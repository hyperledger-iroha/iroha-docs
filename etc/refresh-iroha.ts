import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { RENDERERS, renderGenesisTypes } from './generated-references'
import { render as renderDataModelSchema } from './schema'
import {
  IROHA_GITHUB_REPOSITORY,
  readProvenance,
  resolveInsideRepository,
  sha256,
  writeAtomic,
  writeJson,
  writeProvenance,
  type CommandArtifact,
  type IrohaProvenance,
  type ProvenanceArtifact,
} from './provenance'
import { githubSourceApi, verifyPinnedSource } from './select-iroha'

const MAX_GENERATOR_OUTPUT = 256 * 1024 * 1024
/** Command argument replaced by a temporary file path for generators that write a file. */
export const GENERATOR_OUTPUT = '{output}'

/** The bundled SDK compatibility snapshot, which names the pinned revision it describes. */
export const COMPATIBILITY_MATRIX_PATH = 'src/public/compat-matrix.json'

interface CompatibilityMatrix {
  source: { revision: string; [field: string]: unknown }
  stories: Array<{ results: Array<{ status: string }> }>
}

/**
 * Points the compatibility snapshot at `commit`. Results are never inherited from another revision,
 * so every scenario returns to `no-data`, with verification `not-run`, until it is verified again.
 */
async function repinnedCompatibilityMatrix(
  repositoryRoot: string,
  commit: string,
  committedOn: string,
): Promise<CompatibilityMatrix | undefined> {
  const target = resolveInsideRepository(repositoryRoot, COMPATIBILITY_MATRIX_PATH)
  const matrix = JSON.parse(await readFile(target, 'utf8')) as CompatibilityMatrix
  if (matrix.source.revision === commit) return undefined
  matrix.source = {
    ...matrix.source,
    revision: commit,
    revision_url: `https://github.com/${IROHA_GITHUB_REPOSITORY}/commit/${commit}`,
    generated_at: committedOn,
    verification: 'not-run',
  }
  for (const story of matrix.stories) story.results = story.results.map(() => ({ status: 'no-data' }))
  return matrix
}

export interface RefreshOptions {
  sourceDirectory: string
  selectedIds?: Set<string>
  /** Moves the pin to this verified commit and ref before regenerating every artifact. */
  pin?: { commit: string; ref: string }
}

export interface RefreshDependencies {
  /** Runs a process in `cwd` and returns its stdout, throwing on failure. */
  run(command: string, args: string[], cwd: string): Buffer
  /** Rejects a commit that lacks a GitHub-verified signature or is not reachable from `ref`. */
  verifySource(commit: string, ref: string): Promise<void>
}

function run(command: string, args: string[], cwd: string): Buffer {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'buffer',
    maxBuffer: MAX_GENERATOR_OUTPUT,
    env: { ...process.env, CARGO_TERM_COLOR: 'never' },
  })
  if (result.error || result.status !== 0) {
    const stderr = result.stderr?.toString('utf8').trim()
    throw new Error(
      [`Command failed: ${[command, ...args].join(' ')}`, result.error?.message, stderr].filter(Boolean).join('\n'),
    )
  }
  return result.stdout
}

const defaultDependencies: RefreshDependencies = {
  run,
  verifySource: (commit, ref) => verifyPinnedSource(githubSourceApi(), commit, ref),
}

/**
 * Runs a generator in the pinned checkout. A command that names {@link GENERATOR_OUTPUT} writes its
 * result to that file instead of stdout; the placeholder becomes a fresh temporary path.
 */
function runGenerator(artifact: CommandArtifact, sourceDirectory: string, dependencies: RefreshDependencies): Buffer {
  const [command, ...args] = artifact.command
  if (!args.includes(GENERATOR_OUTPUT)) return dependencies.run(command, args, sourceDirectory)
  const directory = mkdtempSync(path.join(os.tmpdir(), 'iroha-docs-generator-'))
  const output = path.join(directory, 'output')
  try {
    dependencies.run(
      command,
      args.map((argument) => (argument === GENERATOR_OUTPUT ? output : argument)),
      sourceDirectory,
    )
    return readFileSync(output)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

function renderGeneratedArtifact(artifact: CommandArtifact, output: Buffer): Buffer {
  switch (artifact.id) {
    case 'data-model-schema': {
      const schema = JSON.parse(output.toString('utf8')) as Parameters<typeof renderDataModelSchema>[0]
      return Buffer.from(`${renderDataModelSchema(schema).trimEnd()}\n`)
    }
    case 'genesis-types':
      return Buffer.from(renderGenesisTypes(output.toString('utf8')))
    case 'iroha-cli':
      return Buffer.from(`${output.toString('utf8').trimEnd()}\n`)
    case 'iroha3d-help': {
      const help = output
        .toString('utf8')
        .replace(/[ \t]+$/gmu, '')
        .trimEnd()
      return Buffer.from(`\`\`\`text\n${help}\n\`\`\`\n`)
    }
    default:
      throw new Error(`No trusted generator is registered for artifact ${artifact.id}`)
  }
}

function parseArguments(args: string[]): RefreshOptions {
  let sourceDirectory: string | undefined
  let selectedIds: Set<string> | undefined
  let commit: string | undefined
  let ref: string | undefined

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--source') sourceDirectory = args[++index]
    else if (argument === '--only') selectedIds = new Set((args[++index] ?? '').split(',').filter(Boolean))
    else if (argument === '--pin') commit = args[++index]
    else if (argument === '--ref') ref = args[++index]
    else throw new Error(`Unknown argument: ${argument}`)
  }

  if (!sourceDirectory) {
    throw new Error(
      'Usage: pnpm refresh:iroha --source /path/to/iroha [--pin <commit> --ref <ref>] [--only artifact-id,...]',
    )
  }
  if ((commit === undefined) !== (ref === undefined)) throw new Error('--pin and --ref must be given together')
  return {
    sourceDirectory: path.resolve(sourceDirectory),
    selectedIds,
    pin: commit !== undefined && ref !== undefined ? { commit, ref } : undefined,
  }
}

function selectedArtifacts(manifest: IrohaProvenance, selectedIds?: Set<string>): ProvenanceArtifact[] {
  if (!selectedIds) return manifest.artifacts
  const known = new Set(manifest.artifacts.map((artifact) => artifact.id))
  const unknown = [...selectedIds].filter((id) => !known.has(id))
  if (unknown.length > 0) throw new Error(`Unknown artifact id(s): ${unknown.join(', ')}`)
  return manifest.artifacts.filter((artifact) => selectedIds.has(artifact.id))
}

/**
 * Regenerates checked-in references from the exact pinned Iroha commit. Every output is produced
 * before anything is written, so a failed generator leaves the artifacts and the manifest untouched.
 */
export async function refreshIroha(
  repositoryRoot: string,
  options: RefreshOptions,
  dependencies: RefreshDependencies = defaultDependencies,
) {
  const manifest = await readProvenance(repositoryRoot)
  if (options.pin) {
    if (options.selectedIds)
      throw new Error('--only cannot be combined with --pin; a new pin regenerates every artifact')
    manifest.source.commit = options.pin.commit
    manifest.source.ref = options.pin.ref
  }
  const { commit, ref } = manifest.source
  const sourceDirectory = options.sourceDirectory
  const git = (args: string[]) => dependencies.run('git', ['-c', 'core.safecrlf=false', ...args], sourceDirectory)

  await dependencies.verifySource(commit, ref)
  const artifacts = selectedArtifacts(manifest, options.selectedIds)

  git(['cat-file', '-e', `${commit}^{commit}`])
  if (artifacts.some((artifact) => artifact.kind === 'command')) {
    const head = git(['rev-parse', 'HEAD']).toString('utf8').trim()
    if (head !== commit) throw new Error(`Iroha checkout is at ${head}; expected pinned commit ${commit}`)
    if (git(['status', '--porcelain=v1', '--untracked-files=no']).toString('utf8').trim()) {
      throw new Error('Iroha checkout has tracked changes; generators require a clean pinned checkout')
    }
  }

  const outputs = artifacts.map((artifact) => {
    if (artifact.kind === 'command') {
      const output = runGenerator(artifact, sourceDirectory, dependencies)
      return { artifact, source: undefined, content: renderGeneratedArtifact(artifact, output) }
    }
    const source = git(['show', `${commit}:${artifact.source}`])
    if (artifact.kind === 'copy') return { artifact, source, content: source }
    const renderer = RENDERERS[artifact.id]
    if (!renderer) throw new Error(`No trusted renderer is registered for artifact ${artifact.id}`)
    return { artifact, source, content: Buffer.from(renderer(source.toString('utf8'))) }
  })
  const committedOn = git(['show', '-s', '--format=%cs', commit]).toString('utf8').trim()
  const matrix = await repinnedCompatibilityMatrix(repositoryRoot, commit, committedOn)

  for (const { artifact, source, content } of outputs) {
    artifact.sha256 = sha256(content)
    if (artifact.kind !== 'command' && source) artifact.source_sha256 = sha256(source)
    await writeAtomic(resolveInsideRepository(repositoryRoot, artifact.target), content)
    console.log(`Refreshed ${artifact.id} -> ${artifact.target}`)
  }
  if (matrix) {
    await writeJson(repositoryRoot, COMPATIBILITY_MATRIX_PATH, matrix)
    console.log(`Re-pinned ${COMPATIBILITY_MATRIX_PATH}; scenarios await verification at ${commit}`)
  }
  await writeProvenance(repositoryRoot, manifest)
}

async function main() {
  await refreshIroha(process.cwd(), parseArguments(process.argv.slice(2)))
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
