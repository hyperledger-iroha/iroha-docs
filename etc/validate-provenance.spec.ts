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
        track: { branch: 'optimizations', release_tags: 'v3*' },
        ref: 'refs/heads/optimizations',
        commit: '0123456789abcdef0123456789abcdef01234567',
      },
      artifacts: [
        {
          id: 'fixture',
          kind: 'copy',
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function editManifest(root: string, edit: (manifest: any) => void) {
  const manifestPath = path.join(root, 'provenance', 'iroha.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  edit(manifest)
  await writeFile(manifestPath, JSON.stringify(manifest))
}

describe('artifact provenance validation', () => {
  test('accepts a pinned source and matching artifact hash', async () => {
    expect(await validateProvenance(await fixture())).toEqual([])
  })

  test('accepts a pin taken from a tracked release tag', async () => {
    const root = await fixture()
    await editManifest(root, (manifest) => {
      manifest.source.ref = 'refs/tags/v3.0.0'
    })
    expect(await validateProvenance(root)).toEqual([])
  })

  test('rejects target drift', async () => {
    const root = await fixture()
    await writeFile(path.join(root, 'src', 'snippets', 'fixture.txt'), 'drifted\n')
    expect(await validateProvenance(root)).toContain('fixture: target hash mismatch for src/snippets/fixture.txt')
  })

  test('rejects a pin from a ref outside the tracked branch and release tags', async () => {
    const root = await fixture()
    await editManifest(root, (manifest) => {
      manifest.source.ref = 'refs/heads/feature'
    })
    expect(await validateProvenance(root)).toContain(
      'provenance/iroha.json: source.ref must be the tracked branch refs/heads/optimizations',
    )

    await editManifest(root, (manifest) => {
      manifest.source.ref = 'refs/tags/v2.0.0'
    })
    expect(await validateProvenance(root)).toContain(
      'provenance/iroha.json: source.ref must be a tracked v3* release tag',
    )
  })

  test('requires the tracking policy and a well-formed ref', async () => {
    const root = await fixture()
    await editManifest(root, (manifest) => {
      manifest.source.ref = 'optimizations'
      manifest.source.track = { branch: '../main', release_tags: 'v3 *' }
    })
    expect(await validateProvenance(root)).toEqual(
      expect.arrayContaining([
        'provenance/iroha.json: source.track.branch must be a branch name',
        'provenance/iroha.json: source.track.release_tags must be a tag glob such as v3*',
        'provenance/iroha.json: source.ref must be refs/heads/<branch> or refs/tags/<tag>',
      ]),
    )

    await editManifest(root, (manifest) => {
      delete manifest.source.track
    })
    expect(await validateProvenance(root)).toContain(
      'provenance/iroha.json: source.track must name the tracked branch and release tag glob',
    )
  })

  test('rejects retired pending-state fields', async () => {
    const root = await fixture()
    await editManifest(root, (manifest) => {
      manifest.source.refresh_state = 'awaiting-signed-source-commit'
      manifest.artifacts[0].status = 'pending-signed-source-commit'
    })
    expect(await validateProvenance(root)).toEqual([
      'provenance/iroha.json: source.refresh_state is not a supported field',
      'fixture: status is not a supported field',
    ])
  })
})
