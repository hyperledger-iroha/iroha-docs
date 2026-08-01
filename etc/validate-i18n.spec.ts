import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { TRANSLATED_LOCALES, type DocsLocale } from './locales'
import { validateI18n } from './validate-i18n'

const testLocale: DocsLocale = {
  key: 'fr',
  path: 'fr',
  lang: 'fr',
  label: 'Français',
  direction: 'ltr',
  navigation: {
    getStarted: 'Commencer',
    cookbook: 'Recettes',
    cookbookGroups: {
      start: 'Démarrage',
      ledger: 'Registre',
      accessAndAutomation: 'Accès et automatisation',
      appPatterns: 'Modèles d’application',
    },
    guides: 'Guides',
    architecture: 'Architecture',
    reference: 'Référence',
    help: 'Aide',
  },
  search: { buttonText: 'Rechercher', noResultsText: 'Aucun résultat' },
}
const japaneseLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'ja')!

async function fixture(englishContent = '# Guide\n\nCurrent English source.\n') {
  const sourceRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-i18n-'))
  await mkdir(path.join(sourceRoot, 'guide'), { recursive: true })
  await mkdir(path.join(sourceRoot, 'fr', 'guide'), { recursive: true })
  const englishPath = path.join(sourceRoot, 'guide', 'index.md')
  await writeFile(englishPath, englishContent)
  const english = await readFile(englishPath, 'utf8')
  const hash = createHash('sha256').update(english).digest('hex')
  return { sourceRoot, hash }
}

describe('i18n validation', () => {
  test('accepts exact route parity and current machine-validation metadata', async () => {
    const { sourceRoot, hash } = await fixture()
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nSource française actuelle.\n`,
    )
    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toEqual([])
  })

  test('does not treat unselected maintained locale trees as English routes', async () => {
    const { sourceRoot, hash } = await fixture()
    await mkdir(path.join(sourceRoot, 'es', 'guide'), { recursive: true })
    await writeFile(path.join(sourceRoot, 'es', 'guide', 'index.md'), '# Guía\n')
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nSource française actuelle.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toEqual([])
  })

  test('rejects stale metadata and an English fallback', async () => {
    const { sourceRoot } = await fixture()
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      '---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: stale\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nCurrent English source.\n',
    )
    const errors = await validateI18n({ sourceRoot, locales: [testLocale] })
    expect(errors).toContain('fr/guide/index.md: translation_source_hash is stale or missing')
    expect(errors).toContain('fr/guide/index.md: translated content is an English fallback')
  })

  test('rejects a translated heading without the stable English anchor', async () => {
    const { sourceRoot, hash } = await fixture()
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide traduit\n\nSource française actuelle.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: heading 1 must preserve anchor guide',
    )
  })

  test('rejects translated container keywords and missing footnote references', async () => {
    const english =
      '# Guide\n\n::: warning\n\nRead the policy[^1].\n\n:::\n\n[^1]: The policy uses a canonical account.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\n::: avertissement\n\nLisez la politique[1].\n\n:::\n\n[^1]: La politique utilise un compte canonique.\n`,
    )

    const errors = await validateI18n({ sourceRoot, locales: [testLocale] })
    expect(errors).toContain('fr/guide/index.md: container directive 1 must preserve keyword warning')
    expect(errors).toContain('fr/guide/index.md: footnote marker count drift for [^1] (expected 2, found 1)')
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

  test('rejects runaway repeated translation text', async () => {
    const { sourceRoot, hash } = await fixture()
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nphrase répétée ici phrase répétée ici phrase répétée ici phrase répétée ici\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: runaway repeated translation text: phrase répétée ici',
    )
  })

  test('allows repeated table values and link destinations', async () => {
    const { sourceRoot, hash } = await fixture(
      '# Guide\n\n| Profile | State |\n| --- | --- |\n| one | yes |\n| two | yes |\n| three | yes |\n| four | yes |\n\n- [First type](/reference/schema.md)\n- [Second type](/reference/schema.md)\n- [Third type](/reference/schema.md)\n- [Fourth type](/reference/schema.md)\n',
    )
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\n| Profil | État |\n| --- | --- |\n| un | oui |\n| deux | oui |\n| trois | oui |\n| quatre | oui |\n\n- [Premier type](/reference/schema.md)\n- [Deuxième type](/reference/schema.md)\n- [Troisième type](/reference/schema.md)\n- [Quatrième type](/reference/schema.md)\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toEqual([])
  })

  test('rejects translated or missing technical identifiers', async () => {
    const sourceRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-i18n-'))
    await mkdir(path.join(sourceRoot, 'fr'), { recursive: true })
    const english = '# Guide\n\nUse Iroha with AccountId at docs.iroha.tech.\n'
    const hash = createHash('sha256').update(english).digest('hex')
    await writeFile(path.join(sourceRoot, 'index.md'), english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nUtilisez Iroha avec AccountId sur la documentation publique.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/index.md: technical identifier count drift for docs.iroha.tech (expected 1, found 0)',
    )
  })

  test('accepts translated suffixes and numeric word order around preserved identifiers', async () => {
    const sourceRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-i18n-'))
    await mkdir(path.join(sourceRoot, 'fr'), { recursive: true })
    const english = '# Guide\n\nUse FHE-backed BLS-Normal in Iroha.\n'
    const hash = createHash('sha256').update(english).digest('hex')
    await writeFile(path.join(sourceRoot, 'index.md'), english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'index.md'),
      `---
translation_locale: fr
translation_source: /index.md
translation_source_hash: ${hash}
translation_status: machine-validated
---
# Guide {#guide}

Utilisez FHE-Assuré BLS-Clé avec Iroha 3 façons.
`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toEqual([])
  })

  test('rejects a materially truncated prose unit', async () => {
    const sourceRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-i18n-'))
    await mkdir(path.join(sourceRoot, 'fr'), { recursive: true })
    const english =
      '# Guide\n\nWhen an endpoint times out or reports a saturated queue, treat the failure as endpoint availability and retry later before debugging client code or changing the request payload.\n'
    const hash = createHash('sha256').update(english).digest('hex')
    await writeFile(path.join(sourceRoot, 'index.md'), english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nRéessayez.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^fr\/index\.md: prose unit 2 is materially truncated \(0\.\d{2} of source letters\)$/u),
      ]),
    )
  })

  test('rejects the exact locale floor and accepts the next representable fixture ratio', async () => {
    const englishProse = 'a'.repeat(80)
    const { sourceRoot, hash } = await fixture(`# Guide\n\n${englishProse}\n`)
    const localeRoot = path.join(sourceRoot, 'ja', 'guide')
    await mkdir(localeRoot, { recursive: true })
    const localized = (letters: number) =>
      `---\ntranslation_locale: ja\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ガイド {#guide}\n\n${'あ'.repeat(letters)}\n`

    await writeFile(path.join(localeRoot, 'index.md'), localized(20))
    expect(await validateI18n({ sourceRoot, locales: [japaneseLocale] })).toContain(
      'ja/guide/index.md: prose unit 2 is materially truncated (0.25 of source letters)',
    )

    await writeFile(path.join(localeRoot, 'index.md'), localized(21))
    expect(await validateI18n({ sourceRoot, locales: [japaneseLocale] })).toEqual([])
  })

  test('rejects a localized prose unit that drops a source sentence', async () => {
    const sourceRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-i18n-'))
    await mkdir(path.join(sourceRoot, 'fr'), { recursive: true })
    const english =
      '# Guide\n\nPublic and private modes are policy profiles rather than separate node binaries. Review executor and genesis permissions before running an open network.\n'
    const hash = createHash('sha256').update(english).digest('hex')
    await writeFile(path.join(sourceRoot, 'index.md'), english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nExaminez toutes les permissions de l’exécuteur et de la genèse avant le lancement.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /^fr\/index\.md: prose unit 2 has incomplete sentence coverage \(expected at least 2, found 1; 0\.\d{2} of source letters\)$/u,
        ),
      ]),
    )
  })

  test('rejects a translated prose unit that stops at continuation punctuation', async () => {
    const sourceRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-i18n-'))
    await mkdir(path.join(sourceRoot, 'fr'), { recursive: true })
    const english =
      '# Guide\n\nIn a private network, an administrator can define an account-registration process, but every accepted transaction still follows the configured permission policy.\n'
    const hash = createHash('sha256').update(english).digest('hex')
    await writeFile(path.join(sourceRoot, 'index.md'), english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nDans un réseau privé, un administrateur peut définir un processus d’enregistrement de compte, mais chaque transaction acceptée suit la politique configurée,\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/index.md: prose unit 2 ends with continuation punctuation',
    )
  })
})
