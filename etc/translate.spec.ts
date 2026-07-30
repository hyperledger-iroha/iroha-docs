import { createHash } from 'node:crypto'
import { chmod, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { TRANSLATED_LOCALES } from './locales'
import {
  NLLB_LANGUAGE_CODES,
  NllbTranslationProvider,
  protectMarkdown,
  translateDocument,
  type TranslationProvider,
} from './translate'

const french = TRANSLATED_LOCALES.find((locale) => locale.key === 'fr')!

class MarkerAwareProvider implements TranslationProvider {
  async translate(text: string): Promise<string> {
    return text
      .replace(/<span\b[^>]*>(\d+)<\/span>/gu, '$1')
      .replaceAll('Guide', 'Guide traduit')
      .replaceAll('Install', 'Installer')
      .replaceAll('Documentation', 'Documentation traduite')
      .replaceAll('Get Started', 'Bien démarrer')
  }
}

class MarkerBlindBatchProvider implements TranslationProvider {
  readonly engine = 'nllb-200-ct2'
  readonly protectedMarkdownMode = 'fragments' as const
  readonly batches: string[][] = []
  singleCalls = 0

  languageCode(): string {
    return 'fra_Latn'
  }

  async translate(): Promise<string> {
    this.singleCalls += 1
    throw new Error('fragment translation must use the batch method')
  }

  async translateBatch(texts: readonly string[]): Promise<string[]> {
    this.batches.push([...texts])
    return texts.map((text) =>
      text
        .replaceAll('Install', 'Installer')
        .replaceAll('Read', 'Lire')
        .replaceAll('the guide', 'le guide')
        .replaceAll('Documentation', 'Documentation traduite')
        .replaceAll('before', 'avant'),
    )
  }
}

describe('Markdown translation protection', () => {
  test('restores code, technical names, links, and Markdown delimiters', () => {
    const source =
      '# Install Iroha\n\nUse **Norito** with [`iroha_cli`](/reference/irohad-cli) and https://example.com.\n'
    const protectedMarkdown = protectMarkdown(source, french)
    const translated = protectedMarkdown.masked
      .replace(/<span\b[^>]*>(\d+)<\/span>/gu, '$1')
      .replace('Install', 'Installer')
      .replace('Use', 'Utilisez')
      .replace('with', 'avec')
    expect(protectedMarkdown.restore(translated)).toBe(
      '# Installer Iroha\n\nUtilisez **Norito** avec [`iroha_cli`](/fr/reference/irohad-cli) and https://example.com.\n',
    )
  })

  test('restores line structure when the provider collapses whitespace', () => {
    const source = '## Install\n\nBefore.\n\n```bash\necho ok\n```\n\nAfter.\n'
    const protectedMarkdown = protectMarkdown(source, french)
    const translated = protectedMarkdown.masked
      .replace(/\r?\n/gu, ' ')
      .replace(/>\s+</gu, '><')
      .replace('Install', 'Installer')
      .replace('Before', 'Avant')
      .replace('After', 'Après')

    expect(protectedMarkdown.restore(translated)).toBe('## Installer\n\nAvant.\n\n```bash\necho ok\n```\n\nAprès.\n')
  })

  test('does not nest math markers inside fenced code markers', async () => {
    const provider = new MarkerBlindBatchProvider()
    const english = '# Install\n\n```text\n$not_math$\n```\n\nRead the guide.\n'

    const translated = await translateDocument(english, 'guide/fenced-math.md', french, provider)

    expect(translated).toContain('# Installer\n\n```text\n$not_math$\n```\n\nLire le guide.\n')
  })

  test('keeps every protected marker out of a marker-blind batch provider', async () => {
    const provider = new MarkerBlindBatchProvider()
    const english = `---
aside: false
---
# Install Iroha

Read **the guide** in [Documentation](/guide/) before running:

\`\`\`bash
echo "$HOME"
\`\`\`
`
    const translated = await translateDocument(english, 'guide/index.md', french, provider)
    const providerInput = provider.batches.flat().join('')

    expect(provider.singleCalls).toBe(0)
    expect(providerInput).not.toMatch(/[⟦⟧]|<span|<\/span>|\n|\/guide\/|echo|Iroha/u)
    expect(translated).toContain('translation_engine: nllb-200-ct2')
    expect(translated).toContain('# Installer Iroha')
    expect(translated).toContain(
      'Lire **le guide** in [Documentation traduite](/fr/guide/) avant running:\n\n```bash\necho "$HOME"\n```\n',
    )
  })
})

describe('translated documents', () => {
  test('records source provenance and preserves non-home frontmatter', async () => {
    const english = '---\naside: false\n---\n# Guide\n\nInstall Iroha.\n'
    const translated = await translateDocument(english, 'guide/index.md', french, new MarkerAwareProvider())
    const digest = createHash('sha256').update(english).digest('hex')
    expect(translated).toContain('translation_locale: fr')
    expect(translated).toContain('translation_source: /guide/index.md')
    expect(translated).toContain(`translation_source_hash: ${digest}`)
    expect(translated).toContain('translation_status: machine-validated')
    expect(translated).toContain('translation_engine: google-translate')
    expect(translated).toContain('aside: false')
    expect(translated).toContain('# Guide traduit')
    expect(translated).toContain('Installer Iroha.')
  })

  test('translates home fields and localizes home links', async () => {
    const english = `---
layout: home
hero:
  text: Documentation
features:
  - title: Get Started
    link: /get-started/
---
`
    const translated = await translateDocument(english, 'index.md', french, new MarkerAwareProvider())
    expect(translated).toContain('text: "Documentation traduite"')
    expect(translated).toContain('title: "Bien démarrer"')
    expect(translated).toContain('link: /fr/get-started/')
  })
})

describe('NLLB locale mapping', () => {
  test('uses the requested NLLB-200 language codes for every maintained locale', () => {
    expect(NLLB_LANGUAGE_CODES).toEqual({
      es: 'spa_Latn',
      pt: 'por_Latn',
      fr: 'fra_Latn',
      ru: 'rus_Cyrl',
      ar: 'arb_Arab',
      ur: 'urd_Arab',
      ja: 'jpn_Jpan',
      he: 'heb_Hebr',
      my: 'mya_Mymr',
      ka: 'kat_Geor',
      hy: 'hye_Armn',
      az: 'azj_Latn',
      kk: 'kaz_Cyrl',
      ba: 'bak_Cyrl',
      am: 'amh_Ethi',
      dz: 'dzo_Tibt',
      uz: 'uzn_Latn',
      mn: 'khk_Cyrl',
      'zh-hans': 'zho_Hans',
      'zh-hant': 'zho_Hant',
    })
  })

  test('reuses and closes its JSONL subprocess', async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'iroha-docs-nllb-'))
    const executable = path.join(temporaryRoot, 'fake-nllb')
    await writeFile(
      executable,
      `#!/usr/bin/env node
const readline = require('node:readline')
const lines = readline.createInterface({ input: process.stdin })
lines.on('line', (line) => {
  const request = JSON.parse(line)
  const translations = request.texts.map((text) => String(process.pid) + ':' + text.toUpperCase())
  process.stdout.write(JSON.stringify({ id: request.id, translations }) + '\\n')
})
`,
    )
    await chmod(executable, 0o755)
    const provider = new NllbTranslationProvider({ python: executable, model: 'unused-by-mock' })

    try {
      const [first, second] = await Promise.all([
        provider.translateBatch(['first'], 'fra_Latn'),
        provider.translateBatch(['second'], 'fra_Latn'),
      ])
      expect(first[0].split(':')[0]).toBe(second[0].split(':')[0])
      expect(first[0]).toMatch(/^\d+:FIRST$/u)
      expect(second[0]).toMatch(/^\d+:SECOND$/u)
      await provider.close()
      await expect(provider.translate('closed', 'fra_Latn')).rejects.toThrow('provider is closed')
    } finally {
      await provider.close()
      await rm(temporaryRoot, { recursive: true, force: true })
    }
  })
})
