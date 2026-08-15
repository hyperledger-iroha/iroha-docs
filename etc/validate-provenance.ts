import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  CARGO_LOCK_SOURCE,
  IROHA_REPOSITORY,
  MAX_CARGO_LOCK_BYTES,
  PROVENANCE_PATH,
  readProvenance,
  resolveInsideRepository,
  sha256,
} from './provenance'

const SHA256_PATTERN = /^[0-9a-f]{64}$/u
const COMMIT_PATTERN = /^[0-9a-f]{40}$/u
const DATA_MODEL_SCHEMA_INPUTS = [
  'crates/iroha_data_model',
  'crates/iroha_kagami',
  'crates/iroha_schema_gen',
  'crates/norito',
]

export async function validateProvenance(repositoryRoot: string): Promise<string[]> {
  const errors: string[] = []
  let manifest
  try {
    manifest = await readProvenance(repositoryRoot)
  } catch (error) {
    return [`${PROVENANCE_PATH}: ${error instanceof Error ? error.message : String(error)}`]
  }

  if (manifest.schema_version !== 1 && manifest.schema_version !== 2) {
    errors.push(`${PROVENANCE_PATH}: schema_version must be 1 or 2`)
  }
  if (manifest.source.repository !== IROHA_REPOSITORY) {
    errors.push(`${PROVENANCE_PATH}: source.repository must be ${IROHA_REPOSITORY}`)
  }
  if (!COMMIT_PATTERN.test(manifest.source.commit)) {
    errors.push(`${PROVENANCE_PATH}: source.commit must be a full 40-character Git commit`)
  }
  if (!Array.isArray(manifest.artifacts) || manifest.artifacts.length === 0) {
    errors.push(`${PROVENANCE_PATH}: artifacts must not be empty`)
    return errors
  }

  const commandArtifacts = manifest.artifacts.filter((artifact) => artifact.kind === 'command')
  const cargoLock = manifest.command_environment?.cargo_lock
  if (manifest.schema_version === 1) {
    if (manifest.command_environment !== undefined) {
      errors.push(`${PROVENANCE_PATH}: schema_version 1 must not define command_environment`)
    }
    if (commandArtifacts.some((artifact) => artifact.status !== 'pending-signed-source-commit')) {
      errors.push(
        `${PROVENANCE_PATH}: current command artifacts require schema_version 2 and command_environment.cargo_lock`,
      )
    }
  } else if (manifest.schema_version === 2) {
    if (!cargoLock || typeof cargoLock !== 'object' || Array.isArray(cargoLock)) {
      errors.push(`${PROVENANCE_PATH}: schema_version 2 requires command_environment.cargo_lock`)
    } else {
      if (cargoLock.source !== CARGO_LOCK_SOURCE) {
        errors.push(`${PROVENANCE_PATH}: command_environment.cargo_lock.source must be ${CARGO_LOCK_SOURCE}`)
      }
      if (!Number.isSafeInteger(cargoLock.bytes) || cargoLock.bytes <= 0 || cargoLock.bytes > MAX_CARGO_LOCK_BYTES) {
        errors.push(
          `${PROVENANCE_PATH}: command_environment.cargo_lock.bytes must be within 1..${MAX_CARGO_LOCK_BYTES}`,
        )
      }
      if (!SHA256_PATTERN.test(cargoLock.sha256)) {
        errors.push(`${PROVENANCE_PATH}: command_environment.cargo_lock.sha256 must be lowercase SHA-256`)
      }
    }
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

    if (artifact.status !== 'current' && artifact.status !== 'pending-signed-source-commit') {
      errors.push(`${artifact.id}: unsupported provenance status`)
    }
    if (artifact.status === 'pending-signed-source-commit') {
      if (manifest.source.refresh_state !== 'awaiting-signed-source-commit') {
        errors.push(`${artifact.id}: output awaiting a signed source commit requires an explicit source refresh_state`)
      }
    }

    if (!artifact.target.startsWith('src/snippets/') && !artifact.target.startsWith('src/public/')) {
      errors.push(`${artifact.id}: generated target must be under src/snippets or src/public`)
    }
    if (!SHA256_PATTERN.test(artifact.sha256)) errors.push(`${artifact.id}: sha256 must be lowercase SHA-256`)

    if (artifact.kind === 'copy') {
      if (!artifact.source || path.isAbsolute(artifact.source) || artifact.source.includes('..')) {
        errors.push(`${artifact.id}: copy source must be a safe repository-relative path`)
      }
      if (!SHA256_PATTERN.test(artifact.source_sha256)) {
        errors.push(`${artifact.id}: source_sha256 must be lowercase SHA-256`)
      }
    } else if (artifact.kind === 'command') {
      if (!Array.isArray(artifact.command) || artifact.command.length === 0) {
        errors.push(`${artifact.id}: command must not be empty`)
      }
      if (!Array.isArray(artifact.inputs) || artifact.inputs.length === 0) {
        errors.push(`${artifact.id}: inputs must document the generator source`)
      } else if (artifact.id === 'data-model-schema') {
        for (const input of DATA_MODEL_SCHEMA_INPUTS) {
          if (!artifact.inputs.includes(input)) errors.push(`${artifact.id}: inputs must include ${input}`)
        }
      }
    } else {
      errors.push(`${artifactId}: unsupported artifact kind`)
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

  if (manifest.source.refresh_state === 'awaiting-signed-source-commit') {
    const current = manifest.artifacts.filter((artifact) => artifact.status === 'current')
    if (current.length > 0) {
      errors.push(`${PROVENANCE_PATH}: awaiting-signed-source-commit requires every artifact to remain pending`)
    }
  } else if (manifest.source.refresh_state !== undefined) {
    errors.push(`${PROVENANCE_PATH}: unsupported source refresh_state`)
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
