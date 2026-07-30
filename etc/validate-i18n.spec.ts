import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import type { DocsLocale } from './locales'
import { validateI18n } from './validate-i18n'

const testLocale: DocsLocale = {
  key: 'fr',
  path: 'fr',
  lang: 'fr',
  label: 'Français',
  direction: 'ltr',
  navigation: {
    getStarted: 'Commencer',
    guides: 'Guides',
    architecture: 'Architecture',
    reference: 'Référence',
    help: 'Aide',
  },
  search: { buttonText: 'Rechercher', noResultsText: 'Aucun résultat' },
}

async function fixture() {
  const sourceRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-i18n-'))
  await mkdir(path.join(sourceRoot, 'guide'), { recursive: true })
  await mkdir(path.join(sourceRoot, 'fr', 'guide'), { recursive: true })
  const englishPath = path.join(sourceRoot, 'guide', 'index.md')
  await writeFile(englishPath, '# Guide\n\nCurrent English source.\n')
  const english = await readFile(englishPath, 'utf8')
  const hash = createHash('sha256').update(english).digest('hex')
  return { sourceRoot, hash }
}

describe('i18n validation', () => {
  test('accepts exact route parity and current machine-validation metadata', async () => {
    const { sourceRoot, hash } = await fixture()
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide\n\nSource française actuelle.\n`,
    )
    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toEqual([])
  })

  test('rejects stale metadata and an English fallback', async () => {
    const { sourceRoot } = await fixture()
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      '---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: stale\ntranslation_status: machine-validated\n---\n# Guide\n\nCurrent English source.\n',
    )
    const errors = await validateI18n({ sourceRoot, locales: [testLocale] })
    expect(errors).toContain('fr/guide/index.md: translation_source_hash is stale or missing')
    expect(errors).toContain('fr/guide/index.md: translated content is an English fallback')
  })

  test('rejects missing and extra locale routes', async () => {
    const { sourceRoot } = await fixture()
    await writeFile(path.join(sourceRoot, 'fr', 'extra.md'), '# Supplément\n')
    const errors = await validateI18n({ sourceRoot, locales: [testLocale] })
    expect(errors).toContain('fr/guide/index.md: missing translated page')
    expect(errors).toContain('fr/extra.md: no matching English page')
  })

  test('accepts a translated home frontmatter with an empty body', async () => {
    const sourceRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-i18n-'))
    await mkdir(path.join(sourceRoot, 'fr'), { recursive: true })
    const english = '---\nlayout: home\nhero:\n  text: Documentation\n---\n'
    const hash = createHash('sha256').update(english).digest('hex')
    await writeFile(path.join(sourceRoot, 'index.md'), english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n\nlayout: home\nhero:\n  text: Documentation française\n---\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toEqual([])
  })
})
