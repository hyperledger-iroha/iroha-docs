import { constants as fsConstants } from 'node:fs'
import { chmod, lstat, mkdir, mkdtemp, open, realpath, rename, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { render as renderDataModelSchema } from './schema'
import {
  CARGO_LOCK_SOURCE,
  MAX_CARGO_LOCK_BYTES,
  PROVENANCE_PATH,
  readProvenance,
  resolveInsideRepository,
  sha256,
  type CargoLockBinding,
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

function run(command: string, args: string[], cwd: string, env: NodeJS.ProcessEnv = process.env): Buffer {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'buffer',
    maxBuffer: MAX_GENERATOR_OUTPUT,
    env,
  })
  if (result.error || result.status !== 0) {
    const stderr = result.stderr?.toString('utf8').trim()
    throw new Error(
      [`Command failed: ${[command, ...args].join(' ')}`, result.error?.message, stderr].filter(Boolean).join('\n'),
    )
  }
  return result.stdout
}

export function gitEnvironment(): NodeJS.ProcessEnv {
  const env = { ...process.env }
  for (const key of Object.keys(env)) if (key.toUpperCase().startsWith('GIT_')) delete env[key]
  env.GIT_ATTR_NOSYSTEM = '1'
  env.GIT_CONFIG_GLOBAL = process.platform === 'win32' ? 'NUL' : '/dev/null'
  env.GIT_CONFIG_NOSYSTEM = '1'
  env.GIT_NO_REPLACE_OBJECTS = '1'
  env.GIT_OPTIONAL_LOCKS = '0'
  return env
}

function git(args: string[], sourceDirectory: string): Buffer {
  const nullDevice = process.platform === 'win32' ? 'NUL' : '/dev/null'
  return run(
    'git',
    ['-c', 'core.safecrlf=false', '-c', `core.attributesFile=${nullDevice}`, '-c', 'core.fsmonitor=false', ...args],
    sourceDirectory,
    gitEnvironment(),
  )
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

function sameFile(left: { dev: number; ino: number }, right: { dev: number; ino: number }): boolean {
  return left.dev === right.dev && left.ino === right.ino
}

async function readCargoLockBinding(sourceDirectory: string, binding?: CargoLockBinding): Promise<Buffer> {
  if (!binding) {
    throw new Error('Command artifact refresh requires command_environment.cargo_lock provenance')
  }
  if (binding.source !== CARGO_LOCK_SOURCE) {
    throw new Error(`command_environment.cargo_lock.source must be ${CARGO_LOCK_SOURCE}`)
  }
  if (!Number.isSafeInteger(binding.bytes) || binding.bytes <= 0 || binding.bytes > MAX_CARGO_LOCK_BYTES) {
    throw new Error(`command_environment.cargo_lock.bytes must be within 1..${MAX_CARGO_LOCK_BYTES}`)
  }
  if (!/^[0-9a-f]{64}$/u.test(binding.sha256)) {
    throw new Error('command_environment.cargo_lock.sha256 must be lowercase SHA-256')
  }

  const lockPath = path.join(sourceDirectory, binding.source)
  const pathBefore = await lstat(lockPath).catch((error: unknown) => {
    throw new Error(`Cannot inspect bound Cargo.lock: ${error instanceof Error ? error.message : String(error)}`)
  })
  if (!pathBefore.isFile()) throw new Error('Bound Cargo.lock must be a regular file, not a symbolic link')
  if (pathBefore.nlink !== 1) throw new Error('Bound Cargo.lock must not have hard-link aliases')
  if (pathBefore.size !== binding.bytes) {
    throw new Error(`Bound Cargo.lock has ${pathBefore.size} bytes; expected ${binding.bytes}`)
  }

  const handle = await open(lockPath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW).catch((error: unknown) => {
    throw new Error(
      `Cannot open bound Cargo.lock without following links: ${error instanceof Error ? error.message : String(error)}`,
    )
  })
  let content: Buffer
  try {
    const openedBefore = await handle.stat()
    if (!openedBefore.isFile() || openedBefore.nlink !== 1 || !sameFile(pathBefore, openedBefore)) {
      throw new Error('Bound Cargo.lock was replaced before it could be read')
    }
    content = await handle.readFile()
    const openedAfter = await handle.stat()
    if (
      !sameFile(openedBefore, openedAfter) ||
      openedAfter.nlink !== 1 ||
      openedBefore.size !== openedAfter.size ||
      openedBefore.mtimeMs !== openedAfter.mtimeMs ||
      openedBefore.ctimeMs !== openedAfter.ctimeMs
    ) {
      throw new Error('Bound Cargo.lock changed while it was read')
    }
  } finally {
    await handle.close()
  }

  const pathAfter = await lstat(lockPath)
  if (
    !pathAfter.isFile() ||
    pathAfter.nlink !== 1 ||
    !sameFile(pathBefore, pathAfter) ||
    pathBefore.size !== pathAfter.size ||
    pathBefore.mtimeMs !== pathAfter.mtimeMs ||
    pathBefore.ctimeMs !== pathAfter.ctimeMs
  ) {
    throw new Error('Bound Cargo.lock was replaced or changed while it was read')
  }
  const actual = sha256(content)
  if (actual !== binding.sha256) {
    throw new Error(`Bound Cargo.lock SHA-256 ${actual} does not match pinned ${binding.sha256}`)
  }
  return content
}

export async function assertCargoLockBinding(sourceDirectory: string, binding?: CargoLockBinding): Promise<void> {
  await readCargoLockBinding(sourceDirectory, binding)
}

export async function assertCommandEnvironment(sourceDirectory: string, manifest: IrohaProvenance): Promise<void> {
  if (manifest.schema_version !== 2) {
    throw new Error('Command artifact refresh requires provenance schema_version 2 with command_environment.cargo_lock')
  }
  await assertCargoLockBinding(sourceDirectory, manifest.command_environment?.cargo_lock)
}

const COMMAND_ENV_PASSTHROUGH = (
  process.platform === 'win32'
    ? ['PATH', 'SystemRoot', 'COMSPEC', 'PATHEXT']
    : ['PATH', 'SSL_CERT_FILE', 'SSL_CERT_DIR']
) as readonly string[]

export function isolatedCommandEnvironment(
  cargoTargetDirectory: string,
  emptyGitConfig: string,
  sourceDateEpoch: string,
  sourceCommit: string,
  privateHome: string,
  privateTemp: string,
  cargoHome: string,
  rustupHome: string,
): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {}
  for (const key of COMMAND_ENV_PASSTHROUGH) {
    const value = process.env[key]
    if (value !== undefined) env[key] = value
  }
  if (!env.PATH) throw new Error('Command artifact refresh requires a non-empty PATH')
  if (!path.isAbsolute(cargoHome)) throw new Error('Command artifact refresh requires an absolute CARGO_HOME')
  if (!path.isAbsolute(rustupHome)) throw new Error('Command artifact refresh requires an absolute RUSTUP_HOME')
  return {
    ...env,
    CARGO_BUILD_JOBS: '1',
    CARGO_HOME: cargoHome,
    CARGO_INCREMENTAL: '0',
    CARGO_NET_OFFLINE: 'true',
    CARGO_TARGET_DIR: cargoTargetDirectory,
    CARGO_TERM_COLOR: 'never',
    GIT_ATTR_NOSYSTEM: '1',
    GIT_CONFIG_COUNT: '2',
    GIT_CONFIG_GLOBAL: emptyGitConfig,
    GIT_CONFIG_KEY_0: 'core.attributesFile',
    GIT_CONFIG_KEY_1: 'core.fsmonitor',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_VALUE_0: emptyGitConfig,
    GIT_CONFIG_VALUE_1: 'false',
    GIT_NO_REPLACE_OBJECTS: '1',
    GIT_OPTIONAL_LOCKS: '0',
    HOME: privateHome,
    IROHA_GIT_COMMIT_HASH: sourceCommit,
    LANG: 'C',
    LC_ALL: 'C',
    NO_COLOR: '1',
    RUSTUP_AUTO_INSTALL: '0',
    RUSTUP_HOME: rustupHome,
    SOURCE_DATE_EPOCH: sourceDateEpoch,
    TEMP: privateTemp,
    TMP: privateTemp,
    TMPDIR: privateTemp,
    TZ: 'UTC',
    USERPROFILE: privateHome,
    VERGEN_GIT_SHA: sourceCommit,
  }
}

interface CommandSnapshot {
  env: NodeJS.ProcessEnv
  sourceDirectory: string
  dispose: () => Promise<void>
}

async function createCommandSnapshot(
  sourceDirectory: string,
  commit: string,
  manifest: IrohaProvenance,
): Promise<CommandSnapshot> {
  if (process.platform === 'win32') {
    throw new Error('Command artifact refresh requires a POSIX host for read-only source snapshots')
  }
  if (manifest.schema_version !== 2) {
    throw new Error('Command artifact refresh requires provenance schema_version 2 with command_environment.cargo_lock')
  }
  const toolHomes = await Promise.all(
    (['CARGO_HOME', 'RUSTUP_HOME'] as const).map(async (name) => {
      const configured = process.env[name]
      if (!configured || !path.isAbsolute(configured)) {
        throw new Error(`Command artifact refresh requires an explicitly configured absolute ${name}`)
      }
      const resolved = path.resolve(configured)
      const canonical = await realpath(resolved).catch((error: unknown) => {
        throw new Error(`Cannot resolve ${name}: ${error instanceof Error ? error.message : String(error)}`)
      })
      const homeStat = await lstat(canonical).catch((error: unknown) => {
        throw new Error(`Cannot inspect ${name}: ${error instanceof Error ? error.message : String(error)}`)
      })
      if (!homeStat.isDirectory()) throw new Error(`${name} must be a real directory, not a symbolic link`)
      return canonical
    }),
  )
  const [cargoHome, rustupHome] = toolHomes
  const binding = manifest.command_environment.cargo_lock
  const lockContent = await readCargoLockBinding(sourceDirectory, binding)
  const container = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-command-snapshot-'))
  await chmod(container, 0o700)
  const snapshot = path.join(container, 'source')
  const cargoTargetDirectory = path.join(container, 'cargo-target')
  const emptyGitConfig = path.join(container, 'gitconfig')
  const privateHome = path.join(container, 'home')
  const privateTemp = path.join(container, 'tmp')
  let readOnly = false
  const makeWritable = () => {
    if (readOnly) run('/bin/chmod', ['-R', 'u+w', snapshot], container)
  }
  const dispose = async () => {
    makeWritable()
    await rm(container, { force: true, recursive: true })
  }

  try {
    run(
      'git',
      [
        '-c',
        'core.attributesFile=/dev/null',
        '-c',
        'core.fsmonitor=false',
        'clone',
        '--quiet',
        '--shared',
        '--no-checkout',
        '--',
        sourceDirectory,
        snapshot,
      ],
      container,
      gitEnvironment(),
    )
    git(['checkout', '--quiet', '--detach', commit], snapshot)
    assertPinnedCheckout(snapshot, commit)
    const sourceDateEpoch = git(['show', '-s', '--format=%ct', commit], snapshot).toString('utf8').trim()
    if (!/^\d+$/u.test(sourceDateEpoch)) throw new Error('Pinned source commit has no valid timestamp')
    await rm(path.join(snapshot, '.git'), { force: true, recursive: true })
    await writeFile(path.join(snapshot, CARGO_LOCK_SOURCE), lockContent, { flag: 'wx', mode: 0o400 })
    await assertCargoLockBinding(snapshot, binding)
    await mkdir(cargoTargetDirectory, { mode: 0o700 })
    await mkdir(privateHome, { mode: 0o700 })
    await mkdir(privateTemp, { mode: 0o700 })
    await writeFile(emptyGitConfig, '', { flag: 'wx', mode: 0o600 })
    run('/bin/chmod', ['-R', 'a-w', snapshot], container)
    readOnly = true
    return {
      env: isolatedCommandEnvironment(
        cargoTargetDirectory,
        emptyGitConfig,
        sourceDateEpoch,
        commit,
        privateHome,
        privateTemp,
        cargoHome,
        rustupHome,
      ),
      sourceDirectory: snapshot,
      dispose,
    }
  } catch (error) {
    await dispose()
    throw error
  }
}

function generatedArtifact(artifact: CommandArtifact, sourceDirectory: string, env: NodeJS.ProcessEnv): Buffer {
  const output = run(artifact.command[0], artifact.command.slice(1), sourceDirectory, env)

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
  const parent = path.dirname(target)
  await mkdir(parent, { recursive: true })
  const temporaryDirectory = await mkdtemp(path.join(parent, `.${path.basename(target)}.tmp-`))
  const temporary = path.join(temporaryDirectory, 'content')
  try {
    const noFollow = process.platform === 'win32' ? 0 : fsConstants.O_NOFOLLOW
    const handle = await open(
      temporary,
      fsConstants.O_WRONLY | fsConstants.O_CREAT | fsConstants.O_EXCL | noFollow,
      0o600,
    )
    try {
      await handle.writeFile(content)
      await chmod(temporary, 0o644)
    } finally {
      await handle.close()
    }
    await rename(temporary, target)
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true })
  }
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

export function assertCompletePendingRefreshSelection(
  manifest: IrohaProvenance,
  artifacts: ProvenanceArtifact[],
): void {
  if (
    manifest.source.refresh_state === 'awaiting-signed-source-commit' &&
    artifacts.length !== manifest.artifacts.length
  ) {
    throw new Error('A pending signed-source transition requires one complete artifact refresh')
  }
}

export async function refreshIroha(repositoryRoot: string, options: RefreshOptions) {
  const manifest = await readProvenance(repositoryRoot)
  const artifacts = selectedArtifacts(manifest, options.selectedIds)
  assertCompletePendingRefreshSelection(manifest, artifacts)
  const sourceDirectory = options.sourceDirectory
  const hasCommands = artifacts.some((artifact) => artifact.kind === 'command')

  git(['cat-file', '-e', `${manifest.source.commit}^{commit}`], sourceDirectory)
  let commandSnapshot: CommandSnapshot | undefined
  if (hasCommands) {
    assertPinnedCheckout(sourceDirectory, manifest.source.commit)
    commandSnapshot = await createCommandSnapshot(sourceDirectory, manifest.source.commit, manifest)
  }

  const prepared: { artifact: ProvenanceArtifact; content: Buffer; digest: string }[] = []
  try {
    for (const artifact of artifacts) {
      let content: Buffer
      if (artifact.kind === 'copy') {
        content = copyPinnedBlob(artifact, sourceDirectory, manifest.source.commit)
      } else {
        if (!commandSnapshot) throw new Error('Command artifact has no authenticated source snapshot')
        await assertCommandEnvironment(commandSnapshot.sourceDirectory, manifest)
        content = generatedArtifact(artifact, commandSnapshot.sourceDirectory, commandSnapshot.env)
        await assertCommandEnvironment(commandSnapshot.sourceDirectory, manifest)
      }
      const digest = sha256(content)
      prepared.push({ artifact, content, digest })
    }
  } finally {
    await commandSnapshot?.dispose()
  }

  for (const { artifact, content, digest } of prepared) {
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
