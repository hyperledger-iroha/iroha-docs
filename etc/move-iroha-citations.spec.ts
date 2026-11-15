import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { moveIrohaCitations, TRANSLATION_MEMORY, type CitationDependencies } from './move-iroha-citations'
import { IROHA_REPOSITORY, sha256 } from './provenance'

const OLD = 'a'.repeat(40)
const PIN = 'b'.repeat(40)
const SOURCE = (commit: string) => `https://github.com/hyperledger-iroha/iroha/blob/${commit}/crates/iroha/src/lib.rs`
const TREE = (commit: string) => `https://github.com/hyperledger-iroha/iroha/tree/${commit}`

const english = (commit: string) =>
  `# Recipe\n\nBuilt from \`${commit}\`.\n\n- [Client at the pinned commit](${SOURCE(commit)})\n- [Source tree](${TREE(commit)})\n`

const translation = (sourceHash: string, commit: string) =>
  `---\ntranslation_locale: ja\ntranslation_source: /cookbook/recipe.md\ntranslation_source_hash: ${sourceHash}\n` +
  `translation_status: machine-validated\n---\n\n# レシピ {#recipe}\n\n\`${commit}\` から構築します。\n\n` +
  `- [固定コミットのクライアント](${SOURCE(commit)})\n- [ソースツリー](${TREE(commit)})\n`

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-citations-'))
  const write = async (file: string, content: string) => {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true })
    await writeFile(path.join(root, file), content)
  }
  await write(
    'provenance/iroha.json',
    JSON.stringify({
      schema_version: 1,
      source: {
        repository: IROHA_REPOSITORY,
        track: { branch: 'optimizations', release_tags: 'v3*' },
        ref: 'refs/heads/optimizations',
        commit: PIN,
      },
      artifacts: [],
    }),
  )
  await write('src/cookbook/recipe.md', english(OLD))
  await write('src/ja/cookbook/recipe.md', translation(sha256(english(OLD)), OLD))
  await write('src/fr/cookbook/recipe.md', translation('f'.repeat(64), OLD).replace('locale: ja', 'locale: fr'))
  await write('src/snippets/generated.md', `[generated](${SOURCE(OLD)})\n`)
  await write(
    TRANSLATION_MEMORY,
    `export const MEMORY = {\n  '- [Client](${SOURCE(OLD)})': '- [Cliente](${SOURCE(OLD)})',\n}\n`,
  )
  return root
}

const read = (root: string, file: string) => readFile(path.join(root, file), 'utf8')

function checkout(missing: string[] = []): CitationDependencies {
  return {
    commitExists: (commit) => commit === PIN,
    pathExists: (commit, relativePath) => commit === PIN && !missing.includes(relativePath),
  }
}

describe('moving Iroha source citations', () => {
  test('moves every citation to the pin and keeps current translations current', async () => {
    const root = await fixture()
    const report = await moveIrohaCitations(root, checkout())

    expect(report.movedFrom).toEqual([OLD])
    expect(await read(root, 'src/cookbook/recipe.md')).toBe(english(PIN))
    expect(await read(root, 'src/ja/cookbook/recipe.md')).toBe(translation(sha256(english(PIN)), PIN))
    expect(await read(root, TRANSLATION_MEMORY)).not.toContain(OLD)
    expect(report.files).toContainEqual({ file: 'src/cookbook/recipe.md', citations: 3 })
    expect(report.hashesUpdated).toBe(1)
  })

  test('leaves an already stale translation marked stale', async () => {
    const root = await fixture()
    const report = await moveIrohaCitations(root, checkout())

    const french = await read(root, 'src/fr/cookbook/recipe.md')
    expect(french).toContain(`translation_source_hash: ${'f'.repeat(64)}`)
    expect(french).toContain(SOURCE(PIN))
    expect(report.staleTranslations).toEqual(['src/fr/cookbook/recipe.md'])
  })

  test('does not touch generated snippets', async () => {
    const root = await fixture()
    await moveIrohaCitations(root, checkout())
    expect(await read(root, 'src/snippets/generated.md')).toContain(SOURCE(OLD))
  })

  test('writes nothing while a cited path is missing at the pin', async () => {
    const root = await fixture()
    await expect(moveIrohaCitations(root, checkout(['crates/iroha/src/lib.rs']))).rejects.toThrow(
      '- crates/iroha/src/lib.rs (src/cookbook/recipe.md:5 and 4 more)',
    )
    expect(await read(root, 'src/cookbook/recipe.md')).toBe(english(OLD))
    expect(await read(root, TRANSLATION_MEMORY)).toContain(OLD)
  })

  test('requires a checkout that contains the pinned commit', async () => {
    const root = await fixture()
    await expect(moveIrohaCitations(root, { commitExists: () => false, pathExists: () => true })).rejects.toThrow(
      `does not contain the pinned commit ${PIN}`,
    )
  })

  test('changes nothing when every citation already names the pin', async () => {
    const root = await fixture()
    await moveIrohaCitations(root, checkout())
    const before = await read(root, 'src/ja/cookbook/recipe.md')

    const report = await moveIrohaCitations(root, checkout())
    expect(report).toMatchObject({ movedFrom: [], files: [], hashesUpdated: 0 })
    expect(await read(root, 'src/ja/cookbook/recipe.md')).toBe(before)
  })
})
