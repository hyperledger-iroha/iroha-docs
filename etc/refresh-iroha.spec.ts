import { execFileSync } from 'node:child_process'
import { link, mkdir, mkdtemp, readFile, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { IROHA_REPOSITORY, sha256, type CargoLockBinding, type IrohaProvenance } from './provenance'
import {
  assertCargoLockBinding,
  assertCommandEnvironment,
  assertCompletePendingRefreshSelection,
  gitEnvironment,
  isolatedCommandEnvironment,
  refreshIroha,
} from './refresh-iroha'

async function lockFixture(content = 'version = 4\n'): Promise<{ binding: CargoLockBinding; root: string }> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-refresh-lock-'))
  await writeFile(path.join(root, 'Cargo.lock'), content)
  return {
    root,
    binding: {
      source: 'Cargo.lock',
      bytes: Buffer.byteLength(content),
      sha256: sha256(content),
    },
  }
}

function pendingManifest(): IrohaProvenance {
  return {
    schema_version: 1,
    source: {
      repository: IROHA_REPOSITORY,
      commit: '0123456789abcdef0123456789abcdef01234567',
      refresh_state: 'awaiting-signed-source-commit',
    },
    artifacts: [
      {
        id: 'copy',
        kind: 'copy',
        status: 'pending-signed-source-commit',
        source: 'defaults/client.toml',
        source_sha256: 'a'.repeat(64),
        target: 'src/snippets/client.toml',
        sha256: 'a'.repeat(64),
      },
      {
        id: 'command',
        kind: 'command',
        status: 'pending-signed-source-commit',
        command: ['cargo', 'run', '--locked'],
        inputs: ['crates/example'],
        target: 'src/snippets/command.md',
        sha256: 'b'.repeat(64),
      },
    ],
  }
}

function git(root: string, ...args: string[]): string {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
}

describe('refresh Cargo.lock binding', () => {
  test('accepts exact regular lock bytes', async () => {
    const { binding, root } = await lockFixture()
    await expect(assertCargoLockBinding(root, binding)).resolves.toBeUndefined()
  })

  test('requires schema v2 before accepting a command refresh environment', async () => {
    const { binding, root } = await lockFixture()
    const source = {
      repository: IROHA_REPOSITORY,
      commit: '0123456789abcdef0123456789abcdef01234567',
    }
    const v1: IrohaProvenance = { schema_version: 1, source, artifacts: [] }
    const v2: IrohaProvenance = {
      schema_version: 2,
      source,
      command_environment: { cargo_lock: binding },
      artifacts: [],
    }
    const incompleteV2 = { schema_version: 2, source, artifacts: [] } as unknown as IrohaProvenance

    await expect(assertCommandEnvironment(root, v1)).rejects.toThrow(/schema_version 2/u)
    await expect(assertCommandEnvironment(root, incompleteV2)).rejects.toThrow(
      /requires command_environment\.cargo_lock/u,
    )
    await expect(assertCommandEnvironment(root, v2)).resolves.toBeUndefined()
  })

  test('rejects an absent or mismatched binding before command execution', async () => {
    const { binding, root } = await lockFixture()
    await expect(assertCargoLockBinding(root)).rejects.toThrow(/requires command_environment\.cargo_lock/u)
    await expect(assertCargoLockBinding(root, { ...binding, bytes: binding.bytes + 1 })).rejects.toThrow(/expected/u)
    await expect(assertCargoLockBinding(root, { ...binding, sha256: '0'.repeat(64) })).rejects.toThrow(
      /does not match pinned/u,
    )
  })

  test.skipIf(process.platform === 'win32')('rejects a symbolic-link lock', async () => {
    const { binding, root } = await lockFixture()
    const linkedRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-refresh-linked-lock-'))
    await symlink(path.join(root, 'Cargo.lock'), path.join(linkedRoot, 'Cargo.lock'))

    await expect(assertCargoLockBinding(linkedRoot, binding)).rejects.toThrow(/regular file/u)
  })

  test('rejects a Cargo.lock with a hard-link alias', async () => {
    const { binding, root } = await lockFixture()
    const aliasRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-refresh-hard-linked-lock-'))
    await link(path.join(root, 'Cargo.lock'), path.join(aliasRoot, 'Cargo.lock'))

    await expect(assertCargoLockBinding(root, binding)).rejects.toThrow(/hard-link aliases/u)
  })

  test('scrubs Cargo behavior overrides and pins the isolated execution policy', () => {
    const previousRustFlags = process.env.RUSTFLAGS
    process.env.RUSTFLAGS = '-Cpanic=abort'
    try {
      const env = isolatedCommandEnvironment(
        '/private/target',
        '/private/gitconfig',
        '1234',
        '0123456789abcdef0123456789abcdef01234567',
        '/private/home',
        '/private/tmp',
        '/trusted/cargo-home',
        '/trusted/rustup-home',
      )
      expect(env.RUSTFLAGS).toBeUndefined()
      expect(env.RUSTC_WRAPPER).toBeUndefined()
      expect(env.CARGO_TARGET_DIR).toBe('/private/target')
      expect(env.CARGO_BUILD_JOBS).toBe('1')
      expect(env.CARGO_HOME).toBe('/trusted/cargo-home')
      expect(env.CARGO_NET_OFFLINE).toBe('true')
      expect(env.RUSTUP_AUTO_INSTALL).toBe('0')
      expect(env.RUSTUP_HOME).toBe('/trusted/rustup-home')
      expect(env.GIT_ATTR_NOSYSTEM).toBe('1')
      expect(env.GIT_CONFIG_COUNT).toBe('2')
      expect(env.GIT_CONFIG_GLOBAL).toBe('/private/gitconfig')
      expect(env.GIT_CONFIG_KEY_0).toBe('core.attributesFile')
      expect(env.GIT_CONFIG_VALUE_0).toBe('/private/gitconfig')
      expect(env.GIT_CONFIG_KEY_1).toBe('core.fsmonitor')
      expect(env.GIT_CONFIG_VALUE_1).toBe('false')
      expect(env.GIT_NO_REPLACE_OBJECTS).toBe('1')
      expect(env.HOME).toBe('/private/home')
      expect(env.IROHA_GIT_COMMIT_HASH).toBe('0123456789abcdef0123456789abcdef01234567')
      expect(env.SOURCE_DATE_EPOCH).toBe('1234')
      expect(env.TMPDIR).toBe('/private/tmp')
      expect(env.VERGEN_GIT_SHA).toBe('0123456789abcdef0123456789abcdef01234567')
    } finally {
      if (previousRustFlags === undefined) delete process.env.RUSTFLAGS
      else process.env.RUSTFLAGS = previousRustFlags
    }
  })

  test('removes ambient Git overrides and disables replacement objects', () => {
    const overrides = {
      GIT_CONFIG_COUNT: process.env.GIT_CONFIG_COUNT,
      GIT_CONFIG_KEY_0: process.env.GIT_CONFIG_KEY_0,
      GIT_CONFIG_VALUE_0: process.env.GIT_CONFIG_VALUE_0,
      GIT_OBJECT_DIRECTORY: process.env.GIT_OBJECT_DIRECTORY,
      Git_Dir: process.env.Git_Dir,
    }
    process.env.GIT_CONFIG_COUNT = '1'
    process.env.GIT_CONFIG_KEY_0 = 'core.fsmonitor'
    process.env.GIT_CONFIG_VALUE_0 = 'malicious'
    process.env.GIT_OBJECT_DIRECTORY = '/private/untrusted-objects'
    process.env.Git_Dir = '/private/case-insensitive-override'
    try {
      const env = gitEnvironment()
      expect(env.GIT_CONFIG_COUNT).toBeUndefined()
      expect(env.GIT_CONFIG_KEY_0).toBeUndefined()
      expect(env.GIT_CONFIG_VALUE_0).toBeUndefined()
      expect(env.GIT_OBJECT_DIRECTORY).toBeUndefined()
      expect(env.Git_Dir).toBeUndefined()
      expect(env.GIT_ATTR_NOSYSTEM).toBe('1')
      expect(env.GIT_CONFIG_NOSYSTEM).toBe('1')
      expect(env.GIT_NO_REPLACE_OBJECTS).toBe('1')
      expect(env.GIT_OPTIONAL_LOCKS).toBe('0')
    } finally {
      for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined) delete process.env[key]
        else process.env[key] = value
      }
    }
  })

  test('reads copy artifacts from the pinned commit without honoring replacement refs', async () => {
    const fixtureRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-refresh-replace-ref-'))
    const docsRoot = path.join(fixtureRoot, 'docs')
    const sourceRoot = path.join(fixtureRoot, 'source')
    const sourcePath = path.join(sourceRoot, 'defaults', 'client.toml')
    const targetPath = path.join(docsRoot, 'src', 'snippets', 'client.toml')
    await mkdir(path.dirname(sourcePath), { recursive: true })
    await mkdir(path.dirname(targetPath), { recursive: true })
    await mkdir(path.join(docsRoot, 'provenance'), { recursive: true })
    git(sourceRoot, 'init', '--quiet')
    git(sourceRoot, 'config', 'user.email', 'fixture@example.invalid')
    git(sourceRoot, 'config', 'user.name', 'Fixture')
    const pinnedContent = 'pinned content\n'
    await writeFile(sourcePath, pinnedContent)
    git(sourceRoot, 'add', 'defaults/client.toml')
    git(sourceRoot, 'commit', '--quiet', '-m', 'pinned')
    const pinnedCommit = git(sourceRoot, 'rev-parse', 'HEAD')
    await writeFile(sourcePath, 'replacement content\n')
    git(sourceRoot, 'commit', '--quiet', '-am', 'replacement')
    const replacementCommit = git(sourceRoot, 'rev-parse', 'HEAD')
    git(sourceRoot, 'replace', pinnedCommit, replacementCommit)

    await writeFile(targetPath, 'stale content\n')
    const manifest: IrohaProvenance = {
      schema_version: 1,
      source: { repository: IROHA_REPOSITORY, commit: pinnedCommit },
      artifacts: [
        {
          id: 'copy',
          kind: 'copy',
          status: 'current',
          source: 'defaults/client.toml',
          source_sha256: '0'.repeat(64),
          target: 'src/snippets/client.toml',
          sha256: '0'.repeat(64),
        },
      ],
    }
    await writeFile(path.join(docsRoot, 'provenance', 'iroha.json'), `${JSON.stringify(manifest, null, 2)}\n`)

    await refreshIroha(docsRoot, { sourceDirectory: sourceRoot })
    await expect(readFile(targetPath, 'utf8')).resolves.toBe(pinnedContent)
  })

  test('requires the complete artifact set while the signed-source transition is pending', () => {
    const manifest = pendingManifest()
    const { artifacts } = manifest

    expect(() => assertCompletePendingRefreshSelection(manifest, artifacts.slice(0, 1))).toThrow(/complete/u)
    expect(() => assertCompletePendingRefreshSelection(manifest, artifacts)).not.toThrow()
  })

  test('rejects a partial pending refresh before reading source Git or changing outputs', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-refresh-partial-'))
    const manifestPath = path.join(root, 'provenance', 'iroha.json')
    const targetPath = path.join(root, 'src', 'snippets', 'client.toml')
    const manifest = `${JSON.stringify(pendingManifest(), null, 2)}\n`
    const target = 'original target\n'
    await mkdir(path.dirname(manifestPath), { recursive: true })
    await mkdir(path.dirname(targetPath), { recursive: true })
    await writeFile(manifestPath, manifest)
    await writeFile(targetPath, target)

    await expect(
      refreshIroha(root, {
        sourceDirectory: path.join(root, 'source-does-not-exist'),
        selectedIds: new Set(['copy']),
      }),
    ).rejects.toThrow(/complete artifact refresh/u)
    await expect(readFile(manifestPath, 'utf8')).resolves.toBe(manifest)
    await expect(readFile(targetPath, 'utf8')).resolves.toBe(target)
  })

  test.skipIf(process.platform === 'win32')(
    'does not write prepared outputs when a command changes the bound Cargo.lock',
    async () => {
      const fixtureRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-refresh-drift-'))
      const docsRoot = path.join(fixtureRoot, 'docs')
      const sourceRoot = path.join(fixtureRoot, 'source')
      await mkdir(path.join(docsRoot, 'provenance'), { recursive: true })
      await mkdir(path.join(docsRoot, 'src', 'snippets'), { recursive: true })
      await mkdir(path.join(sourceRoot, 'defaults'), { recursive: true })
      await writeFile(path.join(sourceRoot, 'defaults', 'client.toml'), 'new copy output\n')
      git(sourceRoot, 'init', '--quiet')
      git(sourceRoot, 'config', 'user.email', 'fixture@example.invalid')
      git(sourceRoot, 'config', 'user.name', 'Fixture')
      git(sourceRoot, 'add', 'defaults/client.toml')
      git(sourceRoot, 'commit', '--quiet', '-m', 'fixture')
      const commit = git(sourceRoot, 'rev-parse', 'HEAD')

      const lock = 'version = 4\n'
      await writeFile(path.join(sourceRoot, 'Cargo.lock'), lock)
      const copyTarget = path.join(docsRoot, 'src', 'snippets', 'client.toml')
      const commandTarget = path.join(docsRoot, 'src', 'snippets', 'iroha-cli.md')
      const oldCopy = 'old copy output\n'
      const oldCommand = 'old command output\n'
      await writeFile(copyTarget, oldCopy)
      await writeFile(commandTarget, oldCommand)
      const manifest: IrohaProvenance = {
        schema_version: 2,
        source: { repository: IROHA_REPOSITORY, commit },
        command_environment: {
          cargo_lock: {
            source: 'Cargo.lock',
            bytes: Buffer.byteLength(lock),
            sha256: sha256(lock),
          },
        },
        artifacts: [
          {
            id: 'copy',
            kind: 'copy',
            status: 'current',
            source: 'defaults/client.toml',
            source_sha256: sha256(oldCopy),
            target: 'src/snippets/client.toml',
            sha256: sha256(oldCopy),
          },
          {
            id: 'iroha-cli',
            kind: 'command',
            status: 'current',
            command: [
              process.execPath,
              '-e',
              "const fs = require('node:fs'); if (fs.existsSync('.git')) throw new Error('git metadata retained'); if ((fs.statSync('.').mode & 0o222) !== 0) throw new Error('source is writable'); if (process.env.CARGO_NET_OFFLINE !== 'true' || process.env.CARGO_BUILD_JOBS !== '1' || process.env.RUSTUP_AUTO_INSTALL !== '0' || process.env.RUSTFLAGS) throw new Error('command environment is not isolated'); fs.chmodSync('Cargo.lock', 0o600); fs.writeFileSync('Cargo.lock', 'changed lock\\n'); process.stdout.write('generated\\n')",
            ],
            inputs: ['crates/example'],
            target: 'src/snippets/iroha-cli.md',
            sha256: sha256(oldCommand),
          },
        ],
      }
      const manifestPath = path.join(docsRoot, 'provenance', 'iroha.json')
      const originalManifest = `${JSON.stringify(manifest, null, 2)}\n`
      await writeFile(manifestPath, originalManifest)

      const previousCargoHome = process.env.CARGO_HOME
      const previousRustupHome = process.env.RUSTUP_HOME
      process.env.CARGO_HOME = path.join(fixtureRoot, 'trusted-cargo-home')
      process.env.RUSTUP_HOME = path.join(fixtureRoot, 'trusted-rustup-home')
      try {
        await mkdir(process.env.CARGO_HOME)
        await mkdir(process.env.RUSTUP_HOME)
        await expect(refreshIroha(docsRoot, { sourceDirectory: sourceRoot })).rejects.toThrow(
          /has 13 bytes; expected 12/u,
        )
        await expect(readFile(copyTarget, 'utf8')).resolves.toBe(oldCopy)
        await expect(readFile(commandTarget, 'utf8')).resolves.toBe(oldCommand)
        await expect(readFile(manifestPath, 'utf8')).resolves.toBe(originalManifest)
        await expect(readFile(path.join(sourceRoot, 'Cargo.lock'), 'utf8')).resolves.toBe(lock)
      } finally {
        if (previousCargoHome === undefined) delete process.env.CARGO_HOME
        else process.env.CARGO_HOME = previousCargoHome
        if (previousRustupHome === undefined) delete process.env.RUSTUP_HOME
        else process.env.RUSTUP_HOME = previousRustupHome
      }
    },
  )
})
