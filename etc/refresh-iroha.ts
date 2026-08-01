import { mkdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { render as renderDataModelSchema } from './schema'
import {
  PROVENANCE_PATH,
  readProvenance,
  resolveInsideRepository,
  sha256,
  type CommandArtifact,
  type CopyArtifact,
  type IrohaProvenance,
  type ProvenanceArtifact,
} from './provenance'

const MAX_GENERATOR_OUTPUT = 256 * 1024 * 1024

interface RefreshOptions {
  sourceDirectory: string
  selectedIds?: Set<string>
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

function git(args: string[], sourceDirectory: string): Buffer {
  return run('git', ['-c', 'core.safecrlf=false', ...args], sourceDirectory)
}

function assertPinnedCheckout(sourceDirectory: string, commit: string) {
  const head = git(['rev-parse', 'HEAD'], sourceDirectory).toString('utf8').trim()
  if (head !== commit) throw new Error(`Iroha checkout is at ${head}; expected pinned commit ${commit}`)

  const dirty = git(['status', '--porcelain=v1', '--untracked-files=no'], sourceDirectory).toString('utf8').trim()
  if (dirty) throw new Error('Iroha checkout has tracked changes; generators require a clean pinned checkout')
}

function copyPinnedBlob(artifact: CopyArtifact, sourceDirectory: string, commit: string): Buffer {
  return git(['show', `${commit}:${artifact.source}`], sourceDirectory)
}

function generatedArtifact(artifact: CommandArtifact, sourceDirectory: string): Buffer {
  const output = run(artifact.command[0], artifact.command.slice(1), sourceDirectory)

  switch (artifact.id) {
    case 'data-model-schema': {
      const schema = JSON.parse(output.toString('utf8')) as Parameters<typeof renderDataModelSchema>[0]
      return Buffer.from(`${renderDataModelSchema(schema).trimEnd()}\n`)
    }
    case 'iroha-cli':
    case 'kagami-cli':
      return Buffer.from(`${output.toString('utf8').trimEnd()}\n`)
    case 'irohad-help':
      return Buffer.from(`\`\`\`text\n${output.toString('utf8').trimEnd()}\n\`\`\`\n`)
    default:
      throw new Error(`No trusted generator is registered for artifact ${artifact.id}`)
  }
}

async function writeAtomic(target: string, content: Buffer) {
  await mkdir(path.dirname(target), { recursive: true })
  const temporary = `${target}.tmp-${process.pid}`
  await writeFile(temporary, content)
  await rename(temporary, target)
}

function parseArguments(args: string[]): RefreshOptions {
  let sourceDirectory: string | undefined
  let selectedIds: Set<string> | undefined

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--source') {
      sourceDirectory = args[++index]
    } else if (argument === '--only') {
      selectedIds = new Set((args[++index] ?? '').split(',').filter(Boolean))
    } else {
      throw new Error(`Unknown argument: ${argument}`)
    }
  }

  if (!sourceDirectory) {
    throw new Error('Usage: pnpm refresh:iroha --source /path/to/pinned/iroha [--only artifact-id,...]')
  }
  return { sourceDirectory: path.resolve(sourceDirectory), selectedIds }
}

function selectedArtifacts(manifest: IrohaProvenance, selectedIds?: Set<string>): ProvenanceArtifact[] {
  if (!selectedIds) return manifest.artifacts
  const known = new Set(manifest.artifacts.map((artifact) => artifact.id))
  const unknown = [...selectedIds].filter((id) => !known.has(id))
  if (unknown.length > 0) throw new Error(`Unknown artifact id(s): ${unknown.join(', ')}`)
  return manifest.artifacts.filter((artifact) => selectedIds.has(artifact.id))
}

export async function refreshIroha(repositoryRoot: string, options: RefreshOptions) {
  const manifest = await readProvenance(repositoryRoot)
  const artifacts = selectedArtifacts(manifest, options.selectedIds)
  const sourceDirectory = options.sourceDirectory

  git(['cat-file', '-e', `${manifest.source.commit}^{commit}`], sourceDirectory)
  if (artifacts.some((artifact) => artifact.kind === 'command')) {
    assertPinnedCheckout(sourceDirectory, manifest.source.commit)
  }

  for (const artifact of artifacts) {
    const content =
      artifact.kind === 'copy'
        ? copyPinnedBlob(artifact, sourceDirectory, manifest.source.commit)
        : generatedArtifact(artifact, sourceDirectory)
    const digest = sha256(content)
    artifact.sha256 = digest
    artifact.status = 'current'
    if (artifact.kind === 'copy') artifact.source_sha256 = digest

    const target = resolveInsideRepository(repositoryRoot, artifact.target)
    await writeAtomic(target, content)
    console.log(`Refreshed ${artifact.id} -> ${artifact.target}`)
  }

  if (manifest.artifacts.every((artifact) => artifact.status === 'current')) {
    delete manifest.source.refresh_state
  }
  const manifestPath = resolveInsideRepository(repositoryRoot, PROVENANCE_PATH)
  await writeAtomic(manifestPath, Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`))
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  await refreshIroha(process.cwd(), options)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
