import { writeFileSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { IROHA_REPOSITORY, sha256, type IrohaProvenance } from './provenance'
import { GENERATOR_OUTPUT, refreshIroha, type RefreshDependencies } from './refresh-iroha'
import { validateProvenance } from './validate-provenance'

const OLD = 'a'.repeat(40)
const NEW = 'b'.repeat(40)
const REF = 'refs/heads/optimizations'

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-refresh-'))
  await mkdir(path.join(root, 'provenance'))
  await mkdir(path.join(root, 'src', 'snippets'), { recursive: true })
  await writeFile(path.join(root, 'src', 'snippets', 'client.toml'), 'old client\n')
  await writeFile(path.join(root, 'src', 'snippets', 'iroha-cli.md'), 'old help\n')
  const manifest: IrohaProvenance = {
    schema_version: 1,
    source: {
      repository: IROHA_REPOSITORY,
      track: { branch: 'optimizations', release_tags: 'v3*' },
      ref: REF,
      commit: OLD,
    },
    artifacts: [
      {
        id: 'client-config',
        kind: 'copy',
        source: 'defaults/client.toml',
        source_sha256: sha256('old client\n'),
        target: 'src/snippets/client.toml',
        sha256: sha256('old client\n'),
      },
      {
        id: 'iroha-cli',
        kind: 'command',
        command: ['cargo', 'run', '-p', 'iroha_cli', '--', 'tools', 'markdown-help'],
        inputs: ['crates/iroha_cli'],
        target: 'src/snippets/iroha-cli.md',
        sha256: sha256('old help\n'),
      },
    ],
  }
  await writeFile(path.join(root, 'provenance', 'iroha.json'), JSON.stringify(manifest))
  await mkdir(path.join(root, 'src', 'public'), { recursive: true })
  await writeFile(
    path.join(root, 'src', 'public', 'compat-matrix.json'),
    JSON.stringify({
      source: { repo: 'hyperledger-iroha/iroha', revision: OLD, generated_at: '2026-08-30', verification: 'verified' },
      included_sdks: [{ name: 'Rust' }, { name: 'Swift' }],
      stories: [{ name: 'Transfer', results: [{ status: 'ok' }, { status: 'failed' }] }],
    }),
  )
  return root
}

/** A pinned checkout at `head` whose generators print `help`; records every verified pin. */
function fakeSource(head: string, help = '# iroha\n\n') {
  const verified: Array<[string, string]> = []
  const dependencies: RefreshDependencies = {
    run(command, args) {
      if (command === 'cargo') return Buffer.from(help)
      const gitArgs = args.slice(2)
      if (gitArgs[0] === 'cat-file') return Buffer.alloc(0)
      if (gitArgs[0] === 'rev-parse') return Buffer.from(`${head}\n`)
      if (gitArgs[0] === 'status') return Buffer.alloc(0)
      if (gitArgs[0] === 'show' && gitArgs[1] === '-s') return Buffer.from('2026-11-01\n')
      if (gitArgs[0] === 'show') return Buffer.from(`client at ${gitArgs[1]}\n`)
      throw new Error(`unexpected command ${command} ${args.join(' ')}`)
    },
    async verifySource(commit, ref) {
      verified.push([commit, ref])
    },
  }
  return { dependencies, verified }
}

const read = (root: string, file: string) => readFile(path.join(root, file), 'utf8')

describe('Iroha reference refresh', () => {
  test('moves the pin and regenerates every artifact from the verified commit', async () => {
    const root = await fixture()
    const source = fakeSource(NEW)
    await refreshIroha(root, { sourceDirectory: '/iroha', pin: { commit: NEW, ref: REF } }, source.dependencies)

    expect(source.verified).toEqual([[NEW, REF]])
    expect(await read(root, 'src/snippets/client.toml')).toBe(`client at ${NEW}:defaults/client.toml\n`)
    expect(await read(root, 'src/snippets/iroha-cli.md')).toBe('# iroha\n')
    const manifest = JSON.parse(await read(root, 'provenance/iroha.json')) as IrohaProvenance
    expect(manifest.source).toMatchObject({ commit: NEW, ref: REF })
    expect(await validateProvenance(root)).toEqual([])
  })

  test('points the compatibility snapshot at the new pin without inheriting results', async () => {
    const root = await fixture()
    await refreshIroha(
      root,
      { sourceDirectory: '/iroha', pin: { commit: NEW, ref: REF } },
      fakeSource(NEW).dependencies,
    )

    expect(JSON.parse(await read(root, 'src/public/compat-matrix.json'))).toEqual({
      source: {
        repo: 'hyperledger-iroha/iroha',
        revision: NEW,
        revision_url: `https://github.com/hyperledger-iroha/iroha/commit/${NEW}`,
        generated_at: '2026-11-01',
        verification: 'not-run',
      },
      included_sdks: [{ name: 'Rust' }, { name: 'Swift' }],
      stories: [{ name: 'Transfer', results: [{ status: 'no-data' }, { status: 'no-data' }] }],
    })
  })

  test('verifies the existing pin before a refresh in place', async () => {
    const root = await fixture()
    const source = fakeSource(OLD)
    await refreshIroha(
      root,
      { sourceDirectory: '/iroha', selectedIds: new Set(['client-config']) },
      source.dependencies,
    )

    expect(source.verified).toEqual([[OLD, REF]])
    expect(await read(root, 'src/snippets/iroha-cli.md')).toBe('old help\n')
    expect(await validateProvenance(root)).toEqual([])
  })

  test('renders a copied source and records both hashes', async () => {
    const root = await fixture()
    const manifestPath = path.join(root, 'provenance', 'iroha.json')
    const manifest = JSON.parse(await read(root, 'provenance/iroha.json')) as IrohaProvenance
    manifest.artifacts.push({
      id: 'ivm-syscalls',
      kind: 'render',
      source: 'specs/ivm_syscalls_generated.md',
      source_sha256: sha256('stale'),
      target: 'src/snippets/ivm-syscalls.md',
      sha256: sha256('stale'),
    })
    await writeFile(manifestPath, JSON.stringify(manifest))
    const table = '# Generated IVM Syscall Table\n\n| Name | Value (hex) |\n|---|---|\n| SYSCALL_EXIT | 0x1 |\n'
    const source = fakeSource(NEW)
    const run = source.dependencies.run
    source.dependencies.run = (command, args, cwd) =>
      args.includes(`${NEW}:specs/ivm_syscalls_generated.md`) ? Buffer.from(table) : run(command, args, cwd)

    await refreshIroha(root, { sourceDirectory: '/iroha', pin: { commit: NEW, ref: REF } }, source.dependencies)

    const rendered = '| Name | Value (hex) |\n| --- | --- |\n| SYSCALL_EXIT | 0x1 |\n'
    expect(await read(root, 'src/snippets/ivm-syscalls.md')).toBe(rendered)
    const refreshed = JSON.parse(await read(root, 'provenance/iroha.json')) as IrohaProvenance
    expect(refreshed.artifacts.find((artifact) => artifact.id === 'ivm-syscalls')).toMatchObject({
      source_sha256: sha256(table),
      sha256: sha256(rendered),
    })
    expect(await validateProvenance(root)).toEqual([])
  })

  test('reads a generator result from its output file placeholder', async () => {
    const root = await fixture()
    const manifestPath = path.join(root, 'provenance', 'iroha.json')
    const manifest = JSON.parse(await read(root, 'provenance/iroha.json')) as IrohaProvenance
    manifest.artifacts.push({
      id: 'genesis-types',
      kind: 'command',
      command: ['cargo', 'run', '-p', 'iroha_kagami', '--', 'advanced', 'schema', '--genesis-out', GENERATOR_OUTPUT],
      inputs: ['crates/iroha_kagami'],
      target: 'src/snippets/genesis-types.md',
      sha256: sha256('stale'),
    })
    await writeFile(manifestPath, JSON.stringify(manifest))
    const source = fakeSource(NEW)
    const run = source.dependencies.run
    source.dependencies.run = (command, args, cwd) => {
      const output = args.indexOf('--genesis-out')
      if (command !== 'cargo' || output < 0) return run(command, args, cwd)
      expect(args[output + 1]).not.toBe(GENERATOR_OUTPUT)
      writeFileSync(args[output + 1], JSON.stringify({ RawGenesisTransaction: { Struct: [] } }))
      return Buffer.from('{"stdout": "is ignored"}')
    }

    await refreshIroha(root, { sourceDirectory: '/iroha', pin: { commit: NEW, ref: REF } }, source.dependencies)

    expect(await read(root, 'src/snippets/genesis-types.md')).toContain(
      '## `RawGenesisTransaction` {#rawgenesistransaction}',
    )
    expect(await validateProvenance(root)).toEqual([])
  })

  test('refuses to combine a new pin with a partial refresh', async () => {
    const root = await fixture()
    await expect(
      refreshIroha(
        root,
        { sourceDirectory: '/iroha', selectedIds: new Set(['client-config']), pin: { commit: NEW, ref: REF } },
        fakeSource(NEW).dependencies,
      ),
    ).rejects.toThrow('--only cannot be combined with --pin')
  })

  test('requires generators to run in a checkout of the pinned commit', async () => {
    const root = await fixture()
    await expect(
      refreshIroha(root, { sourceDirectory: '/iroha', pin: { commit: NEW, ref: REF } }, fakeSource(OLD).dependencies),
    ).rejects.toThrow(`Iroha checkout is at ${OLD}; expected pinned commit ${NEW}`)
  })

  test('writes nothing when verification or a generator fails', async () => {
    const root = await fixture()
    const manifestBefore = await read(root, 'provenance/iroha.json')

    const rejected = fakeSource(NEW)
    rejected.dependencies.verifySource = async () => {
      throw new Error('unsigned')
    }
    await expect(
      refreshIroha(root, { sourceDirectory: '/iroha', pin: { commit: NEW, ref: REF } }, rejected.dependencies),
    ).rejects.toThrow('unsigned')

    const failing = fakeSource(NEW)
    const run = failing.dependencies.run
    failing.dependencies.run = (command, args, cwd) => {
      if (command === 'cargo') throw new Error('build failed')
      return run(command, args, cwd)
    }
    await expect(
      refreshIroha(root, { sourceDirectory: '/iroha', pin: { commit: NEW, ref: REF } }, failing.dependencies),
    ).rejects.toThrow('build failed')

    expect(await read(root, 'provenance/iroha.json')).toBe(manifestBefore)
    expect(await read(root, 'src/snippets/client.toml')).toBe('old client\n')
  })
})
