import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { RENDERERS } from './generated-references'
import {
  IROHA_REPOSITORY,
  PROVENANCE_PATH,
  matchesRefGlob,
  readProvenance,
  resolveInsideRepository,
  sha256,
} from './provenance'

const SHA256_PATTERN = /^[0-9a-f]{64}$/u
const COMMIT_PATTERN = /^[0-9a-f]{40}$/u
const BRANCH_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/u
const TAG_GLOB_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/*-]*$/u
const REF_PATTERN = /^refs\/(heads|tags)\/([A-Za-z0-9._/-]+)$/u
const SOURCE_KEYS = ['repository', 'track', 'ref', 'commit']
const TRACK_KEYS = ['branch', 'release_tags']
const ARTIFACT_KEYS = {
  copy: ['id', 'kind', 'source', 'source_sha256', 'target', 'sha256'],
  render: ['id', 'kind', 'source', 'source_sha256', 'target', 'sha256'],
  command: ['id', 'kind', 'command', 'inputs', 'target', 'sha256'],
}

function unknownKeys(value: object, allowed: string[]): string[] {
  return Object.keys(value).filter((key) => !allowed.includes(key))
}

function validateSource(source: Record<string, unknown>): string[] {
  const errors: string[] = []
  const at = `${PROVENANCE_PATH}: source`
  for (const key of unknownKeys(source, SOURCE_KEYS)) errors.push(`${at}.${key} is not a supported field`)
  if (source.repository !== IROHA_REPOSITORY) errors.push(`${at}.repository must be ${IROHA_REPOSITORY}`)
  if (typeof source.commit !== 'string' || !COMMIT_PATTERN.test(source.commit)) {
    errors.push(`${at}.commit must be a full 40-character Git commit`)
  }

  const track = source.track as Record<string, unknown> | undefined
  if (!track || typeof track !== 'object') {
    errors.push(`${at}.track must name the tracked branch and release tag glob`)
    return errors
  }
  for (const key of unknownKeys(track, TRACK_KEYS)) errors.push(`${at}.track.${key} is not a supported field`)
  const branch = track.branch
  const releaseTags = track.release_tags
  const branchValid = typeof branch === 'string' && BRANCH_PATTERN.test(branch) && !branch.includes('..')
  const tagsValid = typeof releaseTags === 'string' && TAG_GLOB_PATTERN.test(releaseTags)
  if (!branchValid) errors.push(`${at}.track.branch must be a branch name`)
  if (!tagsValid) errors.push(`${at}.track.release_tags must be a tag glob such as v3*`)

  const ref = typeof source.ref === 'string' ? REF_PATTERN.exec(source.ref) : null
  if (!ref) {
    errors.push(`${at}.ref must be refs/heads/<branch> or refs/tags/<tag>`)
  } else if (branchValid && tagsValid) {
    const [, kind, name] = ref
    if (kind === 'heads' && name !== branch) errors.push(`${at}.ref must be the tracked branch refs/heads/${branch}`)
    if (kind === 'tags' && !matchesRefGlob(name, releaseTags)) {
      errors.push(`${at}.ref must be a tracked ${releaseTags} release tag`)
    }
  }
  return errors
}

export async function validateProvenance(repositoryRoot: string): Promise<string[]> {
  const errors: string[] = []
  let manifest
  try {
    manifest = await readProvenance(repositoryRoot)
  } catch (error) {
    return [`${PROVENANCE_PATH}: ${error instanceof Error ? error.message : String(error)}`]
  }

  for (const key of unknownKeys(manifest, ['schema_version', 'source', 'artifacts'])) {
    errors.push(`${PROVENANCE_PATH}: ${key} is not a supported field`)
  }
  if (manifest.schema_version !== 1) errors.push(`${PROVENANCE_PATH}: schema_version must be 1`)
  if (!manifest.source || typeof manifest.source !== 'object') {
    errors.push(`${PROVENANCE_PATH}: source must describe the pinned Iroha commit`)
  } else {
    errors.push(...validateSource(manifest.source as unknown as Record<string, unknown>))
  }
  if (!Array.isArray(manifest.artifacts) || manifest.artifacts.length === 0) {
    errors.push(`${PROVENANCE_PATH}: artifacts must not be empty`)
    return errors
  }

  const ids = new Set<string>()
  const targets = new Set<string>()
  for (const artifact of manifest.artifacts) {
    const artifactId = artifact.id
    if (!artifact.id || ids.has(artifact.id))
      errors.push(`${PROVENANCE_PATH}: duplicate or empty artifact id ${artifact.id}`)
    ids.add(artifact.id)
    if (!artifact.target || targets.has(artifact.target)) {
      errors.push(`${PROVENANCE_PATH}: duplicate or empty artifact target ${artifact.target}`)
    }
    targets.add(artifact.target)

    if (!artifact.target.startsWith('src/snippets/') && !artifact.target.startsWith('src/public/')) {
      errors.push(`${artifact.id}: generated target must be under src/snippets or src/public`)
    }
    if (!SHA256_PATTERN.test(artifact.sha256)) errors.push(`${artifact.id}: sha256 must be lowercase SHA-256`)

    if (artifact.kind === 'copy' || artifact.kind === 'render') {
      if (!artifact.source || path.isAbsolute(artifact.source) || artifact.source.includes('..')) {
        errors.push(`${artifact.id}: ${artifact.kind} source must be a safe repository-relative path`)
      }
      if (!SHA256_PATTERN.test(artifact.source_sha256)) {
        errors.push(`${artifact.id}: source_sha256 must be lowercase SHA-256`)
      }
      if (artifact.kind === 'copy' && artifact.source_sha256 !== artifact.sha256) {
        errors.push(`${artifact.id}: a copied target must match its source hash`)
      }
      if (artifact.kind === 'render' && !Object.hasOwn(RENDERERS, artifact.id)) {
        errors.push(`${artifact.id}: no renderer is registered for this artifact`)
      }
    } else if (artifact.kind === 'command') {
      if (!Array.isArray(artifact.command) || artifact.command.length === 0) {
        errors.push(`${artifact.id}: command must not be empty`)
      }
      if (!Array.isArray(artifact.inputs) || artifact.inputs.length === 0) {
        errors.push(`${artifact.id}: inputs must document the generator source`)
      }
    } else {
      errors.push(`${artifactId}: unsupported artifact kind`)
    }
    const allowedKeys = ARTIFACT_KEYS[artifact.kind as keyof typeof ARTIFACT_KEYS]
    if (allowedKeys) {
      for (const key of unknownKeys(artifact, allowedKeys))
        errors.push(`${artifact.id}: ${key} is not a supported field`)
    }

    try {
      const target = resolveInsideRepository(repositoryRoot, artifact.target)
      const content = await readFile(target)
      const actual = sha256(content)
      if (actual !== artifact.sha256) errors.push(`${artifact.id}: target hash mismatch for ${artifact.target}`)
    } catch (error) {
      errors.push(
        `${artifact.id}: cannot read ${artifact.target}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  return errors
}

async function main() {
  const errors = await validateProvenance(process.cwd())
  if (errors.length === 0) {
    console.log('Iroha artifact provenance validation passed.')
    return
  }

  console.error(`Iroha artifact provenance validation failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
