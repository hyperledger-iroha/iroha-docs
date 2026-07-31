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

describe('artifact provenance validation', () => {
  test('accepts a pinned source and matching artifact hash', async () => {
    expect(await validateProvenance(await fixture())).toEqual([])
  })

  test('rejects target drift', async () => {
    const root = await fixture()
    await writeFile(path.join(root, 'src', 'snippets', 'fixture.txt'), 'drifted\n')
    expect(await validateProvenance(root)).toContain('fixture: target hash mismatch for src/snippets/fixture.txt')
  })

  test('accepts an explicitly unpublished source commit without claiming current artifacts', async () => {
    const root = await fixture()
    const manifestPath = path.join(root, 'provenance', 'iroha.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    manifest.source.refresh_state = 'awaiting-public-source-commit'
    manifest.artifacts[0].status = 'pending-public-source-commit'
    await writeFile(manifestPath, JSON.stringify(manifest))

    expect(await validateProvenance(root)).toEqual([])
  })

  test('rejects current artifacts while the source commit is unpublished', async () => {
    const root = await fixture()
    const manifestPath = path.join(root, 'provenance', 'iroha.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    manifest.source.refresh_state = 'awaiting-public-source-commit'
    await writeFile(manifestPath, JSON.stringify(manifest))

    expect(await validateProvenance(root)).toContain(
      'provenance/iroha.json: awaiting-public-source-commit requires every artifact to remain pending',
    )
  })

  test('rejects unpublished-source artifacts without the matching source state', async () => {
    const root = await fixture()
    const manifestPath = path.join(root, 'provenance', 'iroha.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    manifest.artifacts[0].status = 'pending-public-source-commit'
    await writeFile(manifestPath, JSON.stringify(manifest))

    expect(await validateProvenance(root)).toContain(
      'fixture: unpublished source output requires an explicit source refresh_state',
    )
  })
})
