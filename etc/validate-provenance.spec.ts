import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { IROHA_REPOSITORY } from './provenance'
import { validateProvenance } from './validate-provenance'

async function fixture(targetContent = 'generated\n') {
  const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-provenance-'))
  await mkdir(path.join(root, 'provenance'))
  await mkdir(path.join(root, 'src', 'snippets'), { recursive: true })
  await writeFile(path.join(root, 'src', 'snippets', 'fixture.txt'), targetContent)
  const digest = createHash('sha256').update(targetContent).digest('hex')
  await writeFile(
    path.join(root, 'provenance', 'iroha.json'),
    JSON.stringify({
      schema_version: 1,
      source: {
        repository: IROHA_REPOSITORY,
        commit: '0123456789abcdef0123456789abcdef01234567',
      },
      artifacts: [
        {
          id: 'fixture',
          kind: 'copy',
          status: 'current',
          source: 'defaults/fixture.txt',
          source_sha256: digest,
          target: 'src/snippets/fixture.txt',
          sha256: digest,
        },
      ],
    }),
  )
  return root
}

interface MutableManifest {
  schema_version: number
  source: Record<string, unknown>
  artifacts: Record<string, unknown>[]
  command_environment?: unknown
}

async function updateManifest(root: string, update: (manifest: MutableManifest) => void) {
  const manifestPath = path.join(root, 'provenance', 'iroha.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as MutableManifest
  update(manifest)
  await writeFile(manifestPath, JSON.stringify(manifest))
}

async function commandFixture(status: 'current' | 'pending-signed-source-commit' = 'current') {
  const root = await fixture()
  await updateManifest(root, (manifest) => {
    manifest.artifacts[0] = {
      id: 'fixture-command',
      kind: 'command',
      status,
      command: ['cargo', 'run', '--locked'],
      inputs: ['crates/fixture'],
      target: manifest.artifacts[0].target,
      sha256: manifest.artifacts[0].sha256,
    }
    if (status === 'pending-signed-source-commit') {
      manifest.source.refresh_state = 'awaiting-signed-source-commit'
    }
  })
  return root
}

describe('artifact provenance validation', () => {
  test('accepts a pinned source and matching artifact hash', async () => {
    expect(await validateProvenance(await fixture())).toEqual([])
  })

  test('rejects target drift', async () => {
    const root = await fixture()
    await writeFile(path.join(root, 'src', 'snippets', 'fixture.txt'), 'drifted\n')
    expect(await validateProvenance(root)).toContain('fixture: target hash mismatch for src/snippets/fixture.txt')
  })

  test('accepts a public candidate while a signed source commit is still pending', async () => {
    const root = await fixture()
    const manifestPath = path.join(root, 'provenance', 'iroha.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    manifest.source.refresh_state = 'awaiting-signed-source-commit'
    manifest.artifacts[0].status = 'pending-signed-source-commit'
    await writeFile(manifestPath, JSON.stringify(manifest))

    expect(await validateProvenance(root)).toEqual([])
  })

  test('rejects current artifacts while a signed source commit is pending', async () => {
    const root = await fixture()
    const manifestPath = path.join(root, 'provenance', 'iroha.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    manifest.source.refresh_state = 'awaiting-signed-source-commit'
    await writeFile(manifestPath, JSON.stringify(manifest))

    expect(await validateProvenance(root)).toContain(
      'provenance/iroha.json: awaiting-signed-source-commit requires every artifact to remain pending',
    )
  })

  test('rejects signed-source-pending artifacts without the matching source state', async () => {
    const root = await fixture()
    const manifestPath = path.join(root, 'provenance', 'iroha.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    manifest.artifacts[0].status = 'pending-signed-source-commit'
    await writeFile(manifestPath, JSON.stringify(manifest))

    expect(await validateProvenance(root)).toContain(
      'fixture: output awaiting a signed source commit requires an explicit source refresh_state',
    )
  })

  test('keeps schema v1 valid only while command artifacts remain pending', async () => {
    expect(await validateProvenance(await commandFixture('pending-signed-source-commit'))).toEqual([])

    expect(await validateProvenance(await commandFixture())).toContain(
      'provenance/iroha.json: current command artifacts require schema_version 2 and command_environment.cargo_lock',
    )
  })

  test('accepts schema v2 with a complete Cargo.lock binding for current command artifacts', async () => {
    const root = await commandFixture()
    await updateManifest(root, (manifest) => {
      manifest.schema_version = 2
      manifest.command_environment = {
        cargo_lock: {
          source: 'Cargo.lock',
          bytes: 12,
          sha256: 'a'.repeat(64),
        },
      }
    })

    expect(await validateProvenance(root)).toEqual([])
  })

  test('forbids command_environment in v1 and requires it in v2', async () => {
    const v1Root = await commandFixture('pending-signed-source-commit')
    await updateManifest(v1Root, (manifest) => {
      manifest.command_environment = {
        cargo_lock: {
          source: 'Cargo.lock',
          bytes: 12,
          sha256: 'a'.repeat(64),
        },
      }
    })
    expect(await validateProvenance(v1Root)).toContain(
      'provenance/iroha.json: schema_version 1 must not define command_environment',
    )

    const v2Root = await commandFixture('pending-signed-source-commit')
    await updateManifest(v2Root, (manifest) => {
      manifest.schema_version = 2
    })
    expect(await validateProvenance(v2Root)).toContain(
      'provenance/iroha.json: schema_version 2 requires command_environment.cargo_lock',
    )
  })

  test('rejects malformed Cargo.lock bindings even while command artifacts are pending', async () => {
    const root = await commandFixture('pending-signed-source-commit')
    await updateManifest(root, (manifest) => {
      manifest.schema_version = 2
      manifest.command_environment = {
        cargo_lock: {
          source: '../Cargo.lock',
          bytes: 0,
          sha256: 'not-a-digest',
        },
      }
    })

    expect(await validateProvenance(root)).toEqual(
      expect.arrayContaining([
        'provenance/iroha.json: command_environment.cargo_lock.source must be Cargo.lock',
        'provenance/iroha.json: command_environment.cargo_lock.bytes must be within 1..16777216',
        'provenance/iroha.json: command_environment.cargo_lock.sha256 must be lowercase SHA-256',
      ]),
    )
  })

  test('requires the schema generator source for the data-model schema artifact', async () => {
    const root = await commandFixture('pending-signed-source-commit')
    await updateManifest(root, (manifest) => {
      manifest.artifacts[0].id = 'data-model-schema'
      manifest.artifacts[0].inputs = ['crates/iroha_data_model', 'crates/iroha_kagami', 'crates/norito']
    })

    expect(await validateProvenance(root)).toContain('data-model-schema: inputs must include crates/iroha_schema_gen')
  })
})
