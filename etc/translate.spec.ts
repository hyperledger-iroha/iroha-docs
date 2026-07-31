import { createHash } from 'node:crypto'
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { globby } from 'globby'
import { describe, expect, test } from 'vitest'
import { TRANSLATED_LOCALES } from './locales'
import {
  NLLB_LANGUAGE_CODES,
  NllbTranslationProvider,
  addStableHeadingAnchors,
  generateTranslations,
  markdownHeadings,
  markdownTranslationUnits,
  protectMarkdown,
  synchronizeTranslationHeadingAnchors,
  technicalIdentifiers,
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

class BoundaryDroppingProvider implements TranslationProvider {
  readonly engine = 'nllb-200-ct2'
  readonly protectedMarkdownMode = 'fragments' as const

  async translate(): Promise<string> {
    throw new Error('fragment translation must use the batch method')
  }

  async translateBatch(texts: readonly string[]): Promise<string[]> {
    return texts.map((text) => {
      if (text.startsWith("'s canonical")) return text.replace(/^'s canonical layer\./u, 'est la couche canonique.')
      if (text.startsWith(') limits')) return text.replace(/^\) limits apply\./u, "des limites s'appliquent.")
      if (text.startsWith("'s builders")) return 'fournit les constructeurs.'
      return text
    })
  }
}

class InlineContextProvider implements TranslationProvider {
  readonly engine = 'inline-context-test'
  readonly protectedMarkdownMode = 'inline-identifiers' as const
  readonly batches: string[][] = []

  languageCode(): string {
    return 'fra_Latn'
  }

  async translate(): Promise<string> {
    throw new Error('inline translation must use the batch method')
  }

  async translateBatch(texts: readonly string[]): Promise<string[]> {
    this.batches.push([...texts])
    return texts.map((text) => text.replace('Use', 'Utilisez').replace('then submit', 'puis soumettez'))
  }
}

describe('Markdown translation protection', () => {
  test('counts Nexus identifiers consistently across soft wrapping', () => {
    expect(technicalIdentifiers('SORA\nNexus, SORA Nexus, and Nexus.').get('Nexus')).toBe(3)
  })

  test('round-trips protected markers across every English documentation page', async () => {
    const provider: TranslationProvider = {
      engine: 'identity-preflight',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fra_Latn',
      translate: async (text) => text,
      translateBatch: async (texts) => [...texts],
    }
    const files = await globby('src/**/*.md', {
      ignore: ['src/snippets/**', ...TRANSLATED_LOCALES.map((locale) => `src/${locale.path}/**`)],
    })

    await Promise.all(
      files.map(async (file) => {
        await translateDocument(await readFile(file, 'utf8'), file.slice('src/'.length), french, provider)
      }),
    )
  })

  test('joins soft-wrapped prose into complete logical translation units', () => {
    const units = markdownTranslationUnits(
      'A transaction begins on one physical line\nand finishes after a soft wrap.\n\nA new paragraph remains separate.\n',
    )

    expect(units.filter((unit) => unit.translate).map((unit) => unit.content)).toEqual([
      'A transaction begins on one physical line and finishes after a soft wrap.',
      'A new paragraph remains separate.',
    ])
  })

  test('sends paragraph context with protected identifiers to inline providers', async () => {
    const provider = new InlineContextProvider()
    const source =
      'Use Iroha and `iroha_cli` to register an AccountId, then\nsubmit the complete Norito transaction through https://example.com.\n'

    const translated = await translateDocument(source, 'guide/context.md', french, provider)
    const providerInputs = provider.batches.flat()

    expect(providerInputs).toHaveLength(1)
    expect(providerInputs[0]).toContain('to register an')
    expect(providerInputs[0]).toContain('submit the complete')
    expect(providerInputs[0]).not.toContain('\n')
    expect(providerInputs[0]).not.toMatch(/Iroha|iroha_cli|AccountId|Norito|https:\/\/example\.com/u)
    expect(providerInputs[0].match(/\[PH\d{6}\]/gu)).toHaveLength(5)
    expect(translated).toContain(
      'Utilisez Iroha and `iroha_cli` to register an AccountId, puis soumettez the complete Norito transaction through https://example.com.',
    )
  })

  test('keeps numbered-list prefixes outside inline model input', async () => {
    const provider = new InlineContextProvider()
    const source = '1. Open the escrow and record the buyer.\n2. Release the escrow to the buyer.\n'

    const translated = await translateDocument(source, 'guide/numbered-list.md', french, provider)
    const providerInputs = provider.batches.flat()

    expect(providerInputs).toHaveLength(2)
    expect(providerInputs).not.toContainEqual(expect.stringMatching(/^\[PH\d{6}\]/u))
    expect(translated).toContain('1. Open the escrow and record the buyer.\n2. Release the escrow to the buyer.\n')
  })

  test('keeps adjacent technical identifiers separated and heading anchors last', async () => {
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'collapsed-marker-spacing',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fra_Latn',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => text.replace(/\]\s+\[/gu, ']['))
      },
    }

    const translated = await translateDocument('## NFT IDs\n', 'guide/heading.md', french, provider)

    expect(batches.flat()).toHaveLength(1)
    expect(batches.flat()[0].match(/\[PH\d{6}\]/gu)).toHaveLength(2)
    expect(translated).toContain('## NFT IDs {#nft-ids}\n')
  })

  test('retries materially incomplete prose in smaller contextual chunks', async () => {
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'truncating-inline-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fra_Latn',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => (text.includes('. ') ? text.slice(0, text.indexOf('. ') + 1) : text))
      },
    }
    const source =
      'This is the short opening. The second sentence contains the complete operational guidance, including validator policy, configuration review, deterministic behavior, and a final verification step before launch.\n'

    const translated = await translateDocument(source, 'guide/retry.md', french, provider)

    expect(batches.length).toBeGreaterThan(1)
    expect(translated).toContain('deterministic behavior')
    expect(translated).toContain('final verification step before launch.')
  })

  test('restores code, technical names, links, and Markdown delimiters', () => {
    const source =
      '# Install Iroha\n\nUse **Norito** with [`iroha_cli`](/reference/irohad-cli), [instructions](/blockchain/instructions.md), and https://example.com.\n'
    const protectedMarkdown = protectMarkdown(source, french)
    const translated = protectedMarkdown.masked
      .replace(/<span\b[^>]*>(\d+)<\/span>/gu, '$1')
      .replace('Install', 'Installer')
      .replace('Use', 'Utilisez')
      .replace('with', 'avec')
    expect(protectedMarkdown.restore(translated)).toBe(
      '# Installer Iroha\n\nUtilisez **Norito** avec [`iroha_cli`](/fr/reference/irohad-cli), [instructions](/fr/blockchain/instructions.md), and https://example.com.\n',
    )
  })

  test('keeps relative assets pointed at the shared English asset tree', () => {
    const source = '![KeePassXC screenshot](../../img/KeePassXC.png)\n'
    const protectedMarkdown = protectMarkdown(source, french)
    const translated = protectedMarkdown.masked.replace(/<span\b[^>]*>(\[PH\d{6}\])<\/span>/gu, '$1')

    expect(protectedMarkdown.restore(translated)).toBe('![KeePassXC screenshot](../../../img/KeePassXC.png)\n')
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

    expect(translated).toContain('# Installer {#install}\n\n```text\n$not_math$\n```\n\nLire le guide.\n')
  })

  test('restores dollar-backtick inline code literally', () => {
    const source = 'Use `$` in Iroha naming.\n'
    const protectedMarkdown = protectMarkdown(source, french)

    expect(protectedMarkdown.restore(protectedMarkdown.masked)).toBe(source)
  })

  test('does not treat dollar signs inside separate code spans as inline math', () => {
    const source =
      'For example, `badge$docs.universal` identifies `badge` in `docs.universal`, so `badge$docs` resolves to `badge$docs.universal`.\n'
    const protectedMarkdown = protectMarkdown(source, french, 'identifier')

    expect(protectedMarkdown.restore(protectedMarkdown.masked)).toBe(source)
  })

  test('canonicalizes harmless punctuation and zero-padding changes in identifier markers', () => {
    const source = 'Use Iroha with Norito.\n'
    const protectedMarkdown = protectMarkdown(source, french, 'identifier')
    const translated = protectedMarkdown.masked
      .replace('[PH000000]', '[PH00000,0]')
      .replace('[PH000001]', '[PH00000001]')

    expect(protectedMarkdown.restore(translated)).toBe(source)
  })

  test('translates footnote prose without nesting protected code markers', async () => {
    const provider = new InlineContextProvider()
    const source = '[^1]: `Register<Account>` creates a canonical `AccountId`; domain aliases are managed separately.\n'

    const translated = await translateDocument(source, 'guide/footnote.md', french, provider)
    const providerInputs = provider.batches.flat()

    expect(providerInputs).toHaveLength(1)
    expect(providerInputs[0]).toContain('creates a canonical')
    expect(providerInputs[0]).not.toContain('[^1]:')
    expect(translated).toContain(
      '[^1]: `Register<Account>` creates a canonical `AccountId`; domain aliases are managed separately.\n',
    )
  })

  test('keeps every protected marker out of a marker-blind batch provider', async () => {
    const provider = new MarkerBlindBatchProvider()
    const english = `---
aside: false
---
# Install Iroha

Read **the guide** in [Documentation](/guide/) before installing rustup with Docker Compose, Taira, AccountId, and JSON:

\`\`\`bash
echo "$HOME"
\`\`\`
`
    const translated = await translateDocument(english, 'guide/index.md', french, provider)
    const providerInput = provider.batches.flat().join('')

    expect(provider.singleCalls).toBe(0)
    expect(providerInput).not.toMatch(
      /\[PH|<span|<\/span>|\n|\/guide\/|echo|Iroha|rustup|Docker Compose|Taira|AccountId|JSON/u,
    )
    expect(translated).toContain('translation_engine: nllb-200-ct2')
    expect(translated).toContain('# Installer Iroha')
    expect(translated).toContain(
      'Lire **le guide** in [Documentation traduite](/fr/guide/) avant installing rustup with Docker Compose, Taira, AccountId, and JSON:\n\n```bash\necho "$HOME"\n```\n',
    )
    expect(provider.batches.flat()).not.toContain(':')
  })

  test('keeps punctuation at protected-fragment boundaries', async () => {
    const provider = new MarkerBlindBatchProvider()
    const translated = await translateDocument(
      'For Iroha, Read <a href="https://iroha.tech/">iroha.tech</a>. Learn more.\\n',
      'guide/punctuation.md',
      french,
      provider,
    )

    expect(provider.batches.flat()).not.toContain(', ')
    expect(provider.batches.flat()).not.toContain('. Learn')
    expect(provider.batches.flat()).not.toContain('iroha.tech')
    expect(translated).toContain('For Iroha, Lire <a href="https://iroha.tech/">iroha.tech</a>. Learn more.')
  })

  test('keeps word boundaries when fragment translation drops possessives or punctuation', async () => {
    const translated = await translateDocument(
      "Iroha's canonical layer. Per-unit (TEU) limits apply. Use the SDK's builders.\\n",
      'guide/boundaries.md',
      french,
      new BoundaryDroppingProvider(),
    )

    expect(translated).toContain(
      "Iroha est la couche canonique. Per-unit (TEU des limites s'appliquent. Use the SDK fournit les constructeurs.",
    )
    expect(translated).not.toMatch(/(?:Irohaest|TEUdes|SDKfournit)/u)
    expect(technicalIdentifiers(translated).get('Iroha')).toBe(1)
    expect(technicalIdentifiers(translated).get('TEU')).toBe(1)
    expect(technicalIdentifiers(translated).get('SDK')).toBe(1)
  })

  test('assigns stable English IDs to translated headings', () => {
    const source = `# Install Iroha

## Example

## Example

## 1. Prepare

## Pinned {#custom-anchor}

\`\`\`md
# Not a heading
\`\`\`
`

    expect(markdownHeadings(source).map((heading) => heading.stableAnchor)).toEqual([
      'install-iroha',
      'example',
      'example-1',
      '_1-prepare',
      'custom-anchor',
    ])
    expect(addStableHeadingAnchors(source)).toContain('# Install Iroha {#install-iroha}')
    expect(addStableHeadingAnchors(source)).toContain('## Example {#example-1}')
    expect(addStableHeadingAnchors(source)).toContain('## 1. Prepare {#_1-prepare}')
    expect(addStableHeadingAnchors(source)).toContain('## Pinned {#custom-anchor}')
    expect(addStableHeadingAnchors(source)).toContain('# Not a heading\n```')
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

  test('refreshes selected routes without deleting the rest of a locale', async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'iroha-docs-routes-'))
    const selectedRoute = path.join(temporaryRoot, 'guide', 'selected.md')
    const retainedRoute = path.join(temporaryRoot, 'fr', 'guide', 'retained.md')
    await mkdir(path.dirname(selectedRoute), { recursive: true })
    await mkdir(path.dirname(retainedRoute), { recursive: true })
    await writeFile(selectedRoute, '# Install\n')
    await writeFile(path.join(temporaryRoot, 'guide', 'retained.md'), '# Retained\n')
    await writeFile(retainedRoute, 'existing translation\n')

    try {
      await generateTranslations({
        sourceRoot: temporaryRoot,
        locales: [french],
        routes: ['guide/selected.md'],
        concurrency: 1,
        provider: new MarkerAwareProvider(),
      })

      expect(await readFile(path.join(temporaryRoot, 'fr', 'guide', 'selected.md'), 'utf8')).toContain('# Installer')
      expect(await readFile(retainedRoute, 'utf8')).toBe('existing translation\n')
      await expect(
        generateTranslations({
          sourceRoot: temporaryRoot,
          locales: [french],
          routes: ['guide/missing.md'],
          provider: new MarkerAwareProvider(),
        }),
      ).rejects.toThrow('Unknown English route(s): guide/missing.md')
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true })
    }
  })

  test('copies relative components required by translated pages', async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'iroha-docs-components-'))
    const component = '<template><p>Shared warning</p></template>\n'
    await mkdir(path.join(temporaryRoot, 'guide'), { recursive: true })
    await writeFile(
      path.join(temporaryRoot, 'guide', 'index.md'),
      "<script setup>\nimport SharedWarning from './SharedWarning.vue'\n</script>\n\n# Guide\n",
    )
    await writeFile(path.join(temporaryRoot, 'guide', 'SharedWarning.vue'), component)

    try {
      await generateTranslations({
        sourceRoot: temporaryRoot,
        locales: [french],
        concurrency: 1,
        provider: new MarkerAwareProvider(),
      })

      expect(await readFile(path.join(temporaryRoot, 'fr', 'guide', 'SharedWarning.vue'), 'utf8')).toBe(component)
      expect(await readFile(path.join(temporaryRoot, 'fr', 'guide', 'index.md'), 'utf8')).toContain(
        "import SharedWarning from './SharedWarning.vue'",
      )
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true })
    }
  })

  test('synchronizes stable heading IDs without retranslating prose', async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'iroha-docs-heading-anchors-'))
    await mkdir(path.join(temporaryRoot, 'guide'), { recursive: true })
    await mkdir(path.join(temporaryRoot, 'fr', 'guide'), { recursive: true })
    await writeFile(path.join(temporaryRoot, 'guide', 'index.md'), '# Install Iroha\n\n## Example\n\nCurrent source.\n')
    await writeFile(
      path.join(temporaryRoot, 'fr', 'guide', 'index.md'),
      '---\ntranslation_locale: fr\n---\n# Installer Iroha\n\n## Exemple\n\nProse existante.\n',
    )

    try {
      await synchronizeTranslationHeadingAnchors({
        sourceRoot: temporaryRoot,
        locales: [french],
        routes: ['guide/index.md'],
      })
      const synchronized = await readFile(path.join(temporaryRoot, 'fr', 'guide', 'index.md'), 'utf8')
      expect(synchronized).toContain('# Installer Iroha {#install-iroha}')
      expect(synchronized).toContain('## Exemple {#example}')
      expect(synchronized).toContain('Prose existante.')
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true })
    }
  })

  test('keeps the previous locale tree when English changes during generation', async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'iroha-docs-translation-source-'))
    const englishPath = path.join(temporaryRoot, 'guide.md')
    const localizedPath = path.join(temporaryRoot, 'fr', 'guide.md')
    await mkdir(path.dirname(localizedPath), { recursive: true })
    await writeFile(englishPath, '# Guide\n\nCurrent source.\n')
    await writeFile(localizedPath, '# Ancien guide\n')
    let changedSource = false
    const provider: TranslationProvider = {
      engine: 'snapshot-test',
      protectedMarkdownMode: 'fragments',
      languageCode: () => 'fra_Latn',
      translate: async (text) => text,
      translateBatch: async (texts) => {
        if (!changedSource) {
          changedSource = true
          await writeFile(englishPath, '# Guide\n\nChanged source.\n')
        }
        return texts.map((text) => text.replaceAll('Current', 'Actuelle'))
      },
    }

    try {
      await expect(
        generateTranslations({ sourceRoot: temporaryRoot, locales: [french], concurrency: 1, provider }),
      ).rejects.toThrow('English source changed during translation: guide.md')
      expect(await readFile(localizedPath, 'utf8')).toBe('# Ancien guide\n')
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true })
    }
  })

  test('keeps the previous locale tree when a relative component changes during generation', async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'iroha-docs-translation-component-'))
    const englishComponent = path.join(temporaryRoot, 'SharedNotice.vue')
    const localizedPage = path.join(temporaryRoot, 'fr', 'guide.md')
    const localizedComponent = path.join(temporaryRoot, 'fr', 'SharedNotice.vue')
    await mkdir(path.dirname(localizedPage), { recursive: true })
    await writeFile(
      path.join(temporaryRoot, 'guide.md'),
      "<script setup>\nimport SharedNotice from './SharedNotice.vue'\n</script>\n\n# Guide\n\nCurrent source.\n",
    )
    await writeFile(englishComponent, '<template>Current notice</template>\n')
    await writeFile(localizedPage, '# Ancien guide\n')
    await writeFile(localizedComponent, '<template>Ancienne notice</template>\n')
    let changedSource = false
    const provider: TranslationProvider = {
      engine: 'component-snapshot-test',
      protectedMarkdownMode: 'fragments',
      languageCode: () => 'fra_Latn',
      translate: async (text) => text,
      translateBatch: async (texts) => {
        if (!changedSource) {
          changedSource = true
          await writeFile(englishComponent, '<template>Changed notice</template>\n')
        }
        return [...texts]
      },
    }

    try {
      await expect(
        generateTranslations({ sourceRoot: temporaryRoot, locales: [french], concurrency: 1, provider }),
      ).rejects.toThrow('English source dependency changed during translation: SharedNotice.vue')
      expect(await readFile(localizedPage, 'utf8')).toBe('# Ancien guide\n')
      expect(await readFile(localizedComponent, 'utf8')).toBe('<template>Ancienne notice</template>\n')
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true })
    }
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
