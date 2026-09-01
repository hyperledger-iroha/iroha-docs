import { createHash } from 'node:crypto'
import { chmod, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { globby } from 'globby'
import { describe, expect, test } from 'vitest'
import { TRANSLATED_LOCALES } from './locales'
import {
  BING_LANGUAGE_CODES,
  BING_RECOMMENDED_LOCALE_KEYS,
  BingTranslationProvider,
  GoogleTranslationProvider,
  NLLB_LANGUAGE_CODES,
  NllbTranslationProvider,
  addStableHeadingAnchors,
  assertGeneratedMarkdownStructure,
  chunkForTranslation,
  curatedExactTranslation,
  curatedExactTranslationEntries,
  clarifyTechnicalTranslationSource,
  generateTranslations,
  hasExactProtectedMarkerMultiset,
  isCompleteCompactCjkRetryClause,
  isCompleteCompactCjkRetryListTail,
  isCompleteCompactCjkSentence,
  isCompleteCompactCjkRetryPhrase,
  isCompleteCompactCjkTableLabel,
  isCompleteCompactCjkTableSentence,
  isCompleteShortStructuralLeadIn,
  markdownHeadings,
  markdownTranslationUnits,
  normalizeExistingTranslations,
  normalizeMachineTranslationArtifacts,
  parseTranslationCli,
  protectMarkdown,
  synchronizeReviewedTranslations,
  synchronizeTechnicalLinkLabels,
  synchronizeTranslationHeadingAnchors,
  synchronizeTranslationMarkdownStructure,
  technicalIdentifiers,
  translateDocument,
  type TranslationProvider,
} from './translate'

describe('Bing translation provider', () => {
  test('maps every supported maintained locale without treating Tibetan as Dzongkha', () => {
    expect(Object.keys(BING_LANGUAGE_CODES).sort()).toEqual(
      TRANSLATED_LOCALES.map(({ key }) => key)
        .filter((key) => key !== 'dz')
        .sort(),
    )
    expect(() => new BingTranslationProvider().languageCode(dzongkha)).toThrow(
      'No Bing Translator language code is configured for locale dz',
    )
    expect(new BingTranslationProvider().clarifyTechnicalTerms).toBe(true)
  })

  test('selects only corpus-approved locales by default and rejects unsafe or unsupported targets', () => {
    const selected = parseTranslationCli(['--provider=bing']).locales.map(({ key }) => key)

    expect(selected).toEqual([...BING_RECOMMENDED_LOCALE_KEYS])
    expect(selected).not.toContain('my')
    expect(selected).not.toContain('ka')
    expect(selected).not.toContain('hy')
    expect(() => parseTranslationCli(['--provider=bing', '--locale=fr,dz'])).toThrow(
      'Bing Translator does not support maintained locale(s): dz',
    )
    expect(() => parseTranslationCli(['--provider=bing', '--locale=fr,my,ka,hy'])).toThrow(
      'Bing Translator is not approved for full-quality maintained output in locale(s): my, ka, hy; use the guarded NLLB provider instead',
    )
  })

  test('reuses one parsed session and sends the required translation fields', async () => {
    const calls: Array<{ init?: RequestInit; url: string }> = []
    const fetcher = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = String(input)
      calls.push({ url, init })
      if (url.startsWith('https://www.bing.com/translator?')) {
        return new Response(
          '<div id="rich_tta" data-iid="translator.5023"></div>' +
            '<script>var params_AbusePreventionHelper = [12345,"session-token",3600000];' +
            'var config={IG:"ABC123"};</script>',
          { headers: { 'set-cookie': '_EDGE_S=fixture-cookie; Path=/; Secure' } },
        )
      }
      return Response.json([{ translations: [{ text: 'Registre &amp; réseau' }] }])
    }) as typeof fetch
    const provider = new BingTranslationProvider(fetcher)

    await expect(provider.translate('Ledger and network', 'fr')).resolves.toBe('Registre & réseau')
    await expect(provider.translate('Ledger and peer', 'fr')).resolves.toBe('Registre & réseau')

    expect(calls).toHaveLength(3)
    expect(calls.filter(({ url }) => url.startsWith('https://www.bing.com/translator?'))).toHaveLength(1)
    const translationCalls = calls.filter(({ url }) => url.startsWith('https://www.bing.com/ttranslatev3?'))
    expect(translationCalls.map(({ url }) => new URL(url).searchParams.get('SFX'))).toEqual(['1', '2'])
    expect(new URL(translationCalls[0].url).searchParams.get('IG')).toBe('ABC123')
    expect(new URL(translationCalls[0].url).searchParams.get('IID')).toBe('translator.5023')
    expect(translationCalls[0].init?.headers).toMatchObject({ cookie: '_EDGE_S=fixture-cookie' })
    expect(new URLSearchParams(String(translationCalls[0].init?.body))).toEqual(
      new URLSearchParams({
        fromLang: 'en',
        to: 'fr',
        text: 'Ledger and network',
        token: 'session-token',
        key: '12345',
      }),
    )
  })

  test('rejects input beyond the public translator limit before making a request', async () => {
    let requested = false
    const provider = new BingTranslationProvider((async (): Promise<Response> => {
      requested = true
      return new Response()
    }) as typeof fetch)

    await expect(provider.translate('x'.repeat(1_001), 'fr')).rejects.toThrow('1,000-character limit')
    expect(requested).toBe(false)
  })
})

const french = TRANSLATED_LOCALES.find((locale) => locale.key === 'fr')!
const arabic = TRANSLATED_LOCALES.find((locale) => locale.key === 'ar')!
const armenian = TRANSLATED_LOCALES.find((locale) => locale.key === 'hy')!
const amharic = TRANSLATED_LOCALES.find((locale) => locale.key === 'am')!
const azerbaijani = TRANSLATED_LOCALES.find((locale) => locale.key === 'az')!
const bashkir = TRANSLATED_LOCALES.find((locale) => locale.key === 'ba')!
const dzongkha = TRANSLATED_LOCALES.find((locale) => locale.key === 'dz')!
const georgian = TRANSLATED_LOCALES.find((locale) => locale.key === 'ka')!
const hebrew = TRANSLATED_LOCALES.find((locale) => locale.key === 'he')!
const japanese = TRANSLATED_LOCALES.find((locale) => locale.key === 'ja')!
const kazakh = TRANSLATED_LOCALES.find((locale) => locale.key === 'kk')!
const mongolian = TRANSLATED_LOCALES.find((locale) => locale.key === 'mn')!
const myanmar = TRANSLATED_LOCALES.find((locale) => locale.key === 'my')!
const portuguese = TRANSLATED_LOCALES.find((locale) => locale.key === 'pt')!
const russian = TRANSLATED_LOCALES.find((locale) => locale.key === 'ru')!
const spanish = TRANSLATED_LOCALES.find((locale) => locale.key === 'es')!
const simplifiedChinese = TRANSLATED_LOCALES.find((locale) => locale.key === 'zh-hans')!
const traditionalChinese = TRANSLATED_LOCALES.find((locale) => locale.key === 'zh-hant')!
const urdu = TRANSLATED_LOCALES.find((locale) => locale.key === 'ur')!
const uzbek = TRANSLATED_LOCALES.find((locale) => locale.key === 'uz')!

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
      if (text.startsWith("'s single protocol-standard")) {
        return text.replace(/^'s single protocol-standard layer\./u, 'est la couche canonique.')
      }
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
  test('normalizes a fullwidth Japanese footnote-definition colon', () => {
    expect(normalizeMachineTranslationArtifacts('[^mode]： 注記', japanese)).toBe('[^mode]: 注記')
  })

  test('disambiguates software package, test artifact, and test runner terminology', () => {
    expect(
      clarifyTechnicalTranslationSource(
        'The Rust client crate loads two conformance fixtures into the harness from `/fixtures/data.json`, stores a snapshot and sidecars beside `snapshot.bin`, emits boilerplate, and submits one carrier.',
      ),
    ).toBe(
      'The Rust client software package loads two conformance test artifacts into the test runner from `/fixtures/data.json`, stores a point-in-time data view and auxiliary records beside `snapshot.bin`, emits repetitive template code, and submits one container transaction.',
    )
  })

  test('disambiguates blockchain network and consensus terminology', () => {
    expect(
      clarifyTechnicalTranslationSource(
        'The runtime sends peers through one lane to the ledger endpoint after genesis, charges gas, advances the pacemaker, and stores a quorum certificate plus a commit certificate. Keep `runtime`, /peer, and LaneId unchanged.',
      ),
    ).toBe(
      'The software execution environment sends network peers through one execution lane to the blockchain ledger API endpoint after blockchain genesis, charges transaction execution cost, advances the consensus pacemaker, and stores a consensus quorum certificate plus a consensus finalization certificate. Keep `runtime`, /peer, and LaneId unchanged.',
    )
  })

  test('disambiguates consensus signature and limit validity', () => {
    expect(
      clarifyTechnicalTranslationSource('The validator checks that transaction signatures and limits are valid.'),
    ).toBe('The validator checks that transaction signatures and limits satisfy the protocol rules.')
  })

  test('disambiguates canonical form, finalization, and technical call terminology', () => {
    expect(
      clarifyTechnicalTranslationSource(
        'A caller uses the first call to inspect canonical state after peers commit the block at the commit quorum.',
      ),
    ).toBe(
      'A requesting client uses the first technical invocation to inspect single protocol-standard state after network peers finalize the block at the consensus finalization quorum.',
    )
    expect(clarifyTechnicalTranslationSource('A Kaigi call carries audio and video metadata.')).toBe(
      'A Kaigi call carries audio and video metadata.',
    )
    expect(
      clarifyTechnicalTranslationSource(
        'Use the implementation at the pinned commit and do not commit keys to source control.',
      ),
    ).toBe('Use the implementation at the pinned source-code revision and do not store keys in source control.')
  })

  test('keeps Russian and Japanese technical clarifications concise where canonical terms are unambiguous', async () => {
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'concise-locale-clarification-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'ja',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map(() => '正規のソフトウェアランタイムのデータスナップショットは引き続き利用できます。')
      },
    }

    await translateDocument(
      'The canonical runtime snapshot remains available.\n',
      'guide/concise-clarification.md',
      japanese,
      provider,
    )

    expect(batches.flat()).toContain('The canonical software runtime data snapshot remains available.')
  })

  test('keeps already clarified technical wording idempotent', () => {
    const source =
      'An API endpoint lets network peers inspect blockchain ledger state through a software runtime and a processing pipeline.'

    expect(clarifyTechnicalTranslationSource(source)).toBe(source)
    expect(clarifyTechnicalTranslationSource(clarifyTechnicalTranslationSource(source))).toBe(source)
  })

  test('does not disambiguate technical words inside fenced code', async () => {
    const source = "Inspect peers after genesis.\n\n```bash\ncurl -s status | jq '{peers, genesis}'\n```\n"
    const provider: TranslationProvider = {
      engine: 'clarification-fence-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fr',
      translate: async (text) => text,
      translateBatch: async (texts) => [...texts],
    }

    const translated = await translateDocument(source, 'guide/code-fence.md', french, provider)

    expect(translated).toContain('Inspect network peers after blockchain genesis.')
    expect(translated).toContain("curl -s status | jq '{peers, genesis}'")
    expect(translated).not.toContain("jq '{network peers, blockchain genesis}'")
  })

  test('translates each link label first and keeps the complete localized link atomic', async () => {
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'link-boundary-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fr',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) =>
          text.replace('Use', 'Utilisez').replace('the guide', 'le guide').replace('now', 'maintenant'),
        )
      },
    }

    const translated = await translateDocument(
      'Use [the guide](/guide/index.md) now.\n',
      'guide/link-boundary.md',
      french,
      provider,
    )

    expect(batches.flat()).toContain('the guide')
    expect(batches.flat()).toContain('Use [PH000000] now.')
    expect(translated).toContain('Utilisez [le guide](/fr/guide/index.md) maintenant.')
  })

  test('does not treat link-shaped inline code as a Markdown link label', async () => {
    const provider: TranslationProvider = {
      engine: 'link-shaped-code-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fr',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) =>
        texts.map((text) =>
          text.replaceAll('Strings', 'Chaînes').replaceAll('Guide', 'Guide traduit').replaceAll('len', 'longueur'),
        ),
    }

    const translated = await translateDocument(
      'Strings are `[len][utf8-bytes]`; see [Guide](/guide/index.md).\n',
      'reference/link-shaped-code.md',
      french,
      provider,
    )

    expect(translated).toContain('`[len][utf8-bytes]`')
    expect(translated).toContain('[Guide traduit](/fr/guide/index.md)')
    expect(translated).not.toContain('[longueur][utf8-bytes]')
  })

  test('preserves inline code nested inside a real Markdown link label', async () => {
    const provider: TranslationProvider = {
      engine: 'code-in-link-label-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fr',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) =>
        texts.map((text) =>
          text.replaceAll('Use', 'Utilisez').replaceAll('and', 'et').replaceAll('instructions', 'instructions'),
        ),
    }

    const translated = await translateDocument(
      'Use [`Register` and `Unregister`](/blockchain/instructions.md) instructions.\n',
      'blockchain/accounts.md',
      french,
      provider,
    )

    expect(translated).toContain('[`Register` et `Unregister`](/fr/blockchain/instructions.md)')
  })

  test('allows context-capable providers to opt out of source-term expansion', async () => {
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'context-capable-test',
      protectedMarkdownMode: 'inline-identifiers',
      clarifyTechnicalTerms: false,
      languageCode: () => 'fr',
      translate: async (text) => text,
      translateBatch: async (texts) => {
        batches.push([...texts])
        return [...texts]
      },
    }

    await translateDocument('Inspect peers after genesis.\n', 'guide/context.md', french, provider)

    expect(batches.flat()).toContain('Inspect peers after genesis.')
    expect(batches.flat()).not.toContain('Inspect network peers after blockchain genesis.')
  })

  test('disambiguates protocol container, manifest, nonce, authority, and receipt terminology', () => {
    expect(
      clarifyTechnicalTranslationSource(
        'A manifest fragment uses a typed wrapper wrapping a value. It submits envelopes with nonces to the authority and stores receipts plus a boxed finalization instruction inside its sustainable envelope. Keep `manifest`, X-Iroha-Nonce, <nonce>, and /receipt/path unchanged.',
      ),
    ).toBe(
      'A technical manifest fragment uses a typed software adapter encapsulating a value. It submits data containers with cryptographic nonce values to the authorization principal and stores protocol result records plus a type-erased finalization instruction inside its sustainable operating limit. Keep `manifest`, X-Iroha-Nonce, <nonce>, and /receipt/path unchanged.',
    )
  })

  test('disambiguates asset, serialization, and release-workflow terminology', () => {
    expect(
      clarifyTechnicalTranslationSource(
        'A faucet-funded signer can mint and burn assets in a balance bucket. The pipeline stores wire-format hashes and digests, fee quotes, tombstones, and each settlement leg from the source checkout scaffold before retiring it. Keep `faucet`, /pipeline, HashId, and fee_quote unchanged.',
      ),
    ).toBe(
      'A testnet-funded cryptographic signer can issue and destroy assets in a balance partition. The software processing workflow stores serialization format cryptographic hashes and cryptographic digests, fee price estimates, durable deletion markers, and each financial transfer part from the source-code working copy generated starter structure before decommissioning it. Keep `faucet`, /pipeline, HashId, and fee_quote unchanged.',
    )
  })

  test('disambiguates workflow, settlement, container, and fee terminology before translation', () => {
    expect(
      clarifyTechnicalTranslationSource(
        'Try It on Taira with an on-wire carrier, every leg in the pool, a settlement quote guard, a quoted and signed transaction, and a wall-clock timeout.',
      ),
    ).toBe(
      'Run this workflow on Taira with an in protocol transmission container transaction, every financial transfer part in the protocol data group, a financial transaction settlement fee-price validation guard, a signed transaction with a fee price estimate, and a local system clock timeout.',
    )
    expect(
      clarifyTechnicalTranslationSource(
        'The digest commits the encoded transfer preimage, and the plan is chain-, authority-, state-, and deadline-bound.',
      ),
    ).toBe(
      'The cryptographic digest value cryptographically binds to the encoded transfer preimage, and the plan is bound to the chain, transaction authorization identity, blockchain ledger state, and deadline.',
    )
  })

  test('uses Russian-specific source terms that avoid ledger and signer false friends', async () => {
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'russian-source-disambiguation-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'ru',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return [...texts]
      },
    }

    await translateDocument(
      'Inspect the blockchain ledger with a cryptographic signer.\n',
      'guide/test.md',
      russian,
      provider,
    )

    expect(batches.flat()).toContain('Inspect the distributed blockchain registry with a cryptographic signatory.')
  })

  test('disambiguates asset policy and instruction headings', () => {
    expect(
      clarifyTechnicalTranslationSource(
        'Balance Scope {#balance-scope}, Mintability {#mintability}, and Special Instructions {#special-instructions}',
      ),
    ).toBe(
      'Asset balance scope {#balance-scope}, Asset issuance policy {#mintability}, and Instruction operations {#special-instructions}',
    )
  })

  test('keeps stable heading anchors immutable while clarifying visible heading text', async () => {
    const provider: TranslationProvider = {
      engine: 'heading-clarification-test',
      protectedMarkdownMode: 'inline-identifiers',
      clarifyTechnicalTerms: true,
      languageCode: () => 'fr',
      translate: async (text) => text,
      translateBatch: async (texts) => [...texts],
    }

    const translated = await translateDocument('## Mintability\n', 'blockchain/assets.md', french, provider)

    expect(translated).toContain('## Asset issuance policy {#mintability}\n')
    expect(translated).not.toContain('{#asset issuance policy}')
  })

  test('normalizes known cross-script model artifacts without touching surrounding prose', () => {
    expect(normalizeMachineTranslationArtifacts('スナップшотとलेन', japanese)).toBe('スナップショットとレーン')
    expect(normalizeMachineTranslationArtifacts('可нони化', traditionalChinese)).toBe('正規化')
    expect(normalizeMachineTranslationArtifacts('datasaлlarda', azerbaijani)).toBe('məlumat məkanlarında')
    expect(normalizeMachineTranslationArtifacts('رؤية الدولة العالمية (WSV)', arabic)).toBe('عرض حالة العالم (WSV)')
    expect(normalizeMachineTranslationArtifacts('የቀድሞample ሙከራ በተዋቀረው ፕሮfile ላይ ይሰራል።', amharic)).toBe(
      'የቀደመው ምሳሌ ሙከራ በተዋቀረው መገለጫ ላይ ይሰራል።',
    )
  })

  test('repairs Armenian asset false friends only when the aligned source discusses assets', () => {
    const mistranslation = 'Գրանցեք գործիքների սահմանումները և ստուգեք արտոնության ID-ն։'
    expect(normalizeMachineTranslationArtifacts(mistranslation, armenian, 'Register asset definitions and check the asset ID.')).toBe(
      'Գրանցեք ակտիվների սահմանումները և ստուգեք ակտիվի ID-ն։',
    )
    expect(normalizeMachineTranslationArtifacts(mistranslation, armenian, 'Inspect the CLI tooling.')).toBe(mistranslation)
  })

  test('repairs Kazakh ledger false friends only when the aligned source discusses a ledger', () => {
    const mistranslation = 'Блокчейн журналының күйі журналда сақталады.'
    expect(normalizeMachineTranslationArtifacts(mistranslation, kazakh, 'The blockchain ledger state is stored in the ledger.')).toBe(
      'Блокчейн тізілімінің күйі тізілімде сақталады.',
    )
    expect(normalizeMachineTranslationArtifacts(mistranslation, kazakh, 'Inspect the application log.')).toBe(mistranslation)
  })

  test('repairs Kazakh authority, explorer, and lot false friends only in aligned contexts', () => {
    expect(
      normalizeMachineTranslationArtifacts(
        'Авторизация принципі блок зерттеушісінен шот-фактура тобын оқиды.',
        kazakh,
        'The authority reads the invoice lot from the block explorer.',
      ),
    ).toBe('Уәкілетті субъект блок шолушысынан шот-фактура лотын оқиды.')
    expect(
      normalizeMachineTranslationArtifacts(
        'Авторизация принципі блок зерттеушісінен шот-фактура тобын оқиды.',
        kazakh,
        'The research principle reads a user group.',
      ),
    ).toBe('Авторизация принципі блок зерттеушісінен шот-фактура тобын оқиды.')
  })

  test('repairs Russian blockchain-explorer false friends only in aligned contexts', () => {
    expect(normalizeMachineTranslationArtifacts('Маршрут исследователя и проводника.', russian, 'Use the explorer route.')).toBe(
      'Маршрут обозревателя и обозревателя.',
    )
    expect(normalizeMachineTranslationArtifacts('Маршрут исследователя и проводника.', russian, 'Read a travel guide.')).toBe(
      'Маршрут исследователя и проводника.',
    )
  })

  test('repairs Mongolian domain, asset-definition, and instruction false friends in aligned contexts', () => {
    expect(
      normalizeMachineTranslationArtifacts(
        '| Өмчийн тодорхойлолт | Өмчийн нэрс | [Салбарууд](./domains.md) | Сургалтууд |',
        mongolian,
        'Asset definitions, domains, and instructions.',
      ),
    ).toBe('| Хөрөнгийн тодорхойлолт | Домэйнууд | [Домэйнууд](./domains.md) | Зааврууд |')
    expect(
      normalizeMachineTranslationArtifacts(
        'Өмчийн тодорхойлолт, Өмчийн нэрс, Сургалтууд',
        mongolian,
        'Property definitions, owner names, and tutorials.',
      ),
    ).toBe('Өмчийн тодорхойлолт, Өмчийн нэрс, Сургалтууд')
  })

  test('localizes Azerbaijani networking and build prose without changing unrelated text', () => {
    expect(
      normalizeMachineTranslationArtifacts(
        'şəbəkə peer-ləri validator profili ilə node/runtime build command istifadə edir.',
        azerbaijani,
        'The peers use the validator profile with the node/runtime build command.',
      ),
    ).toBe(
      'şəbəkə həmkarları təsdiqləyici profili ilə şəbəkə qovşağı/proqram icra mühiti qurma əmri istifadə edir.',
    )
    expect(normalizeMachineTranslationArtifacts('peer validator runtime build', azerbaijani, 'A music review.')).toBe(
      'peer validator runtime build',
    )
  })

  test('repairs common Georgian technical false friends only in their aligned source contexts', () => {
    expect(normalizeMachineTranslationArtifacts('გამოკითხვის შედეგი', georgian, 'Return the query result.')).toBe(
      'მოთხოვნის შედეგი',
    )
    expect(normalizeMachineTranslationArtifacts('მონაცემთა ბაზის საიდუმლო', georgian, 'Bind the dataspace alias.')).toBe(
      'მონაცემთა სივრცის ალიასი',
    )
    expect(normalizeMachineTranslationArtifacts('წიგნის მასპინძელი', georgian, 'Restart the ledger host.')).toBe(
      'რეესტრის ჰოსტი',
    )
    expect(normalizeMachineTranslationArtifacts('წიგნის მასპინძელი', georgian, 'Read the library host biography.')).toBe(
      'წიგნის მასპინძელი',
    )
  })

  test('repairs Amharic cooking and digestion false friends only in aligned documentation contexts', () => {
    expect(normalizeMachineTranslationArtifacts('የምግብ አሰራር የምግብ መፍጫ እሴት', amharic, 'The recipe verifies the digest.')).toBe(
      'የተግባር መመሪያ ዳይጀስት',
    )
    expect(normalizeMachineTranslationArtifacts('የምግብ አሰራር', amharic, 'Prepare dinner.')).toBe(
      'የምግብ አሰራር',
    )
    expect(
      normalizeMachineTranslationArtifacts(
        'መስቀለኛ መንገድ በመቆጣጠሪያ አውሮፕላን ላይ የብሎክቼይን ደብተርን በአክሲዮን ማረጋገጫ ያስኬዳል።',
        amharic,
        'The node runs the blockchain ledger on the control plane with proof-of-stake.',
      ),
    ).toBe('ኖድ በመቆጣጠሪያ ንብርብር ላይ የብሎክቼይን መዝገብን በድርሻ ማረጋገጫ ያስኬዳል።')
    expect(
      normalizeMachineTranslationArtifacts(
        'የማገጃ ሚዛን ከብሎክቼይን ዘፍጥረት ይመጣል።',
        amharic,
        'The block balance comes from blockchain genesis.',
      ),
    ).toBe('የብሎክ ቀሪ ሒሳብ ከብሎክቼይን ጀነሲስ ይመጣል።')
    expect(normalizeMachineTranslationArtifacts('እገዳው የአግድ ራስጌ አለው።', amharic, 'The block has a block header.')).toBe(
      'ብሎኩ የብሎክ ራስጌ አለው።',
    )
    expect(normalizeMachineTranslationArtifacts('ክፍያ የሚከፍል ጽሑፍ', amharic, 'Submit a fee-paying write.')).toBe(
      'ክፍያ የሚከፍል የመጻፍ ክዋኔ',
    )
    expect(normalizeMachineTranslationArtifacts('ጽሁፉን ያረጋግጡ', amharic, 'Prove the write.')).toBe(
      'የመጻፍ ክዋኔውን ያረጋግጡ',
    )
    expect(normalizeMachineTranslationArtifacts('የጽሁፍ ፋይል', amharic, 'It writes a file.')).toBe('የጽሁፍ ፋይል')
  })

  test('repairs additional Amharic technical false friends only in their aligned source contexts', () => {
    const mistranslation =
      'ማስመሰያ ቅርስ ይበላል። ወንድም እህት፣ ዘር ሐረግ፣ ማዞሪያ፣ የክፍያ ጭነት፣ የፍቃድ ርእሰ መምህር፣ ምስጠራ ቁርጠኝነት እሴት፣ ምስጠራ መፍጨት እሴት፣ የፕሮቶኮል ውጤት መዝገብ።'
    const source =
      'The token consumes an artifact. Check its sibling path, lineage, routing, payload, authority principal, commitment, digest, and receipt.'

    expect(normalizeMachineTranslationArtifacts(mistranslation, amharic, source)).toBe(
      'ቶከን አርቲፋክት ይጠቀማል። አጎራባች፣ ተከታታይነት፣ ማስተላለፊያ፣ ጭነት፣ የፈቃድ ባለቤት፣ ክሪፕቶግራፊያዊ ኮሚትመንት፣ ክሪፕቶግራፊያዊ ዳይጀስት፣ የደረሰኝ።',
    )
    expect(normalizeMachineTranslationArtifacts(mistranslation, amharic, 'A mimic eats beside a family tree.')).toBe(
      mistranslation,
    )

    expect(
      normalizeMachineTranslationArtifacts(
        'የሙከራ ቅርሶች፣ ቅርሶች፣ ዘር ሐረጉ፣ ርዕሰ መምህር፣ ግብረ-ሰዶማዊ ምስጠራ፣ ማገጃ፣ የማዞሪያ ሁነታ፣ አክሲዮኑ Iroha CLI።',
        amharic,
        'The fixtures and artifacts preserve lineage for the authority principal. Homomorphic encryption is a readiness blocker when the rounding mode differs in the stock Iroha CLI.',
      ),
    ).toBe(
      'የሙከራ አብነቶች፣ አርቲፋክቶች፣ ተከታታይነቱ፣ ባለቤት፣ ሆሞሞርፊክ ምስጠራ፣ እንቅፋት፣ የማጠጋጋት ሁነታ፣ መደበኛው Iroha CLI።',
    )

    expect(
      normalizeMachineTranslationArtifacts(
        'የግዛት ሽግግር፣ ለስላሳ ሹካ፣ ሁለት ግድያዎች እና የወጪ ሳጥን።',
        amharic,
        'The state transition records a soft fork, two executions, and one outbox.',
      ),
    ).toBe('የሁኔታ ሽግግር፣ ለስላሳ ፎርክ፣ ሁለት አፈጻጸሞች እና የወጪ መልዕክት ሳጥን።')

    expect(
      normalizeMachineTranslationArtifacts(
        'መስቀለኛ መንገዱ የክፍያ ቁርጥራጮችን ተቀብሎ ሰውነቱን ይመልሳል።',
        amharic,
        'The node receives payload chunks and recovers the canonical body.',
      ),
    ).toBe('ኖዱ የጭነት ቁርጥራጮችን ተቀብሎ የውሂብ አካሉን ይመልሳል።')
    expect(
      normalizeMachineTranslationArtifacts(
        'የክፍያ ቀሪ ሂሳብን እና የኪራይ የክፍያ ዋጋ ግምትን ያረጋግጡ።',
        amharic,
        'Validate the fee balance and rent quote before submitting the payload.',
      ),
    ).toBe('የክፍያ ቀሪ ሂሳብን እና የኪራይ የክፍያ ዋጋ ግምትን ያረጋግጡ።')
    expect(
      normalizeMachineTranslationArtifacts(
        'ፅንስ ማስወረድ፣ የብሎክ ቃና፣ አስማት፣ የመደምሰስ መገለጫ፣ አዝሙድናዊ እና የጉዳይ ጊዜ።',
        amharic,
        'Record the abort, block cadence, binary magic, erasure profile, mint operation, and issue time.',
      ),
    ).toBe('ማቋረጥ፣ የብሎክ ምት፣ magic እሴት፣ የኢሬዥር መገለጫ፣ ሚንት እና የተሰጠበት ጊዜ።')
    expect(
      normalizeMachineTranslationArtifacts(
        'ፖሊሲው ከጠፋ መግቢያው አሁንም አልተዘጋም።',
        amharic,
        'Admission still fails closed when the policy is missing.',
      ),
    ).toBe('ፖሊሲው ከጠፋ መግቢያው አሁንም ውድቅ ይሆናል።')
    expect(normalizeMachineTranslationArtifacts('ድጋሚ ማጫወቱ አስደሳች ነው።', amharic, 'The replay is idempotent.')).toBe(
      'ድጋሚ ማጫወቱ አይደምፖተንት ነው።',
    )
    expect(
      normalizeMachineTranslationArtifacts(
        'የተረጋጋ ገንዳ እንቅስቃሴ እና መንገድ/ገንዳ ድንበር።',
        amharic,
        'Observe stable-pool activity and the route/pool boundary.',
      ),
    ).toBe('የተረጋጋ ፑል እንቅስቃሴ እና መንገድ/ፑል ድንበር።')
    expect(
      normalizeMachineTranslationArtifacts(
        'ቆራጥ አፈጻጸም በቆራጥነት ይደገማል።',
        amharic,
        'Deterministic execution replays deterministically.',
      ),
    ).toBe('ዲተርሚኒስቲክ አፈጻጸም በዲተርሚኒስቲክ ሁኔታ ይደገማል።')
    expect(
      normalizeMachineTranslationArtifacts(
        'ከንቱዎችን፣ የከንቱነት አስተናጋጅን፣ የውድቀት እሴቶችን ይፈትሹ እና curl ማቋረጥን ያሰናክሉ።',
        amharic,
        'Check nullifiers, the vanity host, and fallback values, then disable curl buffering.',
      ),
    ).toBe('ናሊፋየሮችን፣ ብጁ የአስተናጋጅ ስምን፣ ተተኪ እሴቶችን ይፈትሹ እና curl ቋት አጠቃቀምን ያሰናክሉ።')
    expect(
      normalizeMachineTranslationArtifacts(
        'መመሪያ WebRTC ውድቀት',
        amharic,
        'Manual WebRTC fallback',
      ),
    ).toBe('በእጅ የሚደረግ WebRTC ተተኪ አማራጭ')
  })

  test('does not normalize protected code, paths, URLs, or wire-format identifiers', () => {
    expect(
      normalizeMachineTranslationArtifacts(
        'блок `/v1/блок` /v1/блок https://example.com/блок StructName__блок',
        dzongkha,
      ),
    ).toBe('སྡེབ་ཚན་ `/v1/блок` /v1/блок https://example.com/блок StructName__блок')
  })

  test('restores protected dollar-sign literals verbatim', () => {
    const source = [
      'The `$` separator and `price$domain` stay literal.',
      '',
      '$$',
      'x = y + 1',
      '$$',
      '',
      '```bash',
      "printf '%s\\n' \"$CURRENT_OWNER\" '$& $` $\\' $$'",
      '```',
    ].join('\n')

    expect(normalizeMachineTranslationArtifacts(source, french)).toBe(source)
    expect(clarifyTechnicalTranslationSource(source)).toBe(source)
  })

  test('round-trips every English page when a locale has no artifact repairs', async () => {
    const files = await globby('src/**/*.md', {
      ignore: ['src/snippets/**', ...TRANSLATED_LOCALES.map((locale) => `src/${locale.path}/**`)],
    })

    await Promise.all(
      files.map(async (file) => {
        const source = await readFile(file, 'utf8')
        expect(normalizeMachineTranslationArtifacts(source, french), file).toBe(source)
      }),
    )
  })

  test('clarifies every English page idempotently without duplicated context prefixes', async () => {
    const files = await globby('src/**/*.md', {
      ignore: ['src/snippets/**', ...TRANSLATED_LOCALES.map((locale) => `src/${locale.path}/**`)],
    })
    const duplicatePrefix =
      /\b(?:API API|blockchain blockchain|network network|transaction transaction|software software|execution execution|technical technical|processing processing|cryptographic cryptographic|carrier transaction transaction)\b/iu

    await Promise.all(
      files.map(async (file) => {
        const source = await readFile(file, 'utf8')
        const clarified = clarifyTechnicalTranslationSource(source)
        expect(clarifyTechnicalTranslationSource(clarified), file).toBe(clarified)
        expect(clarified, file).not.toMatch(duplicatePrefix)
      }),
    )
  })

  test('uses reviewed exact Spanish I105 safety terminology', () => {
    const reviewed = new Map([
      [
        ' - Preserve letter case and do not apply `Unicode` normalization. ',
        ' - Conserve exactamente las mayúsculas y minúsculas, y no aplique la normalización de `Unicode`. ',
      ],
      [
        ' The checksum-only HRP is the ASCII string `snx`. ',
        ' El HRP usado exclusivamente para la suma de comprobación es la cadena ASCII `snx`. ',
      ],
      [
        ' 4. Split off the six checksum digits. ',
        ' 4. Separe los seis dígitos correspondientes a la suma de comprobación. ',
      ],
      [
        ' 6. Verify the checksum over those canonical bytes. ',
        ' 6. Verifique la suma de comprobación calculada sobre esos bytes canónicos. ',
      ],
      [
        ' 9. Render the `AccountId` canonically for the expected discriminant. ',
        ' 9. Genere la representación canónica del `AccountId` para el discriminante esperado. ',
      ],
      [
        ' - Use a collation that preserves letter case and character width. ',
        ' - Use una intercalación que preserve las mayúsculas y minúsculas y el ancho de los caracteres. ',
      ],
    ])

    for (const [source, expected] of reviewed) {
      expect(curatedExactTranslation(source, spanish)).toBe(expected)
    }
  })

  test('uses reviewed Hebrew wording where Bing mixes Arabic into a table row', () => {
    expect(curatedExactTranslation('| `Offline` | Offline settlement events |', hebrew)).toBe(
      '| `Offline` | אירועי סליקה לא מקוונת |',
    )
  })

  test('uses reviewed Hebrew wording for the FastPQ limb packing rule', () => {
    expect(
      curatedExactTranslation(
        'Byte strings are packed into 7-byte little-endian limbs so every limb is strictly below `p`:',
        hebrew,
      ),
    ).toBe('מחרוזות בתים נארזות ליחידות של 7 בתים בסדר little-endian, כך שכל יחידה קטנה ממש מ־`p`:')
  })

  test('uses reviewed Myanmar wording where NLLB mixes Devanagari into a replay lead-in', () => {
    expect(
      curatedExactTranslation(
        'Challenge calls append the full digest to the transcript state. The replay order is:',
        myanmar,
      ),
    ).toBe(
      'စိန်ခေါ်တန်ဖိုးကို တွက်ချက်သည့် ခေါ်ဆိုမှုများက ဟက်ရှ်အနှစ်ချုပ်တန်ဖိုး အပြည့်အစုံကို မှတ်တမ်းအခြေအနေထဲသို့ နောက်ဆက်တွဲ ပေါင်းထည့်သည်။ ပြန်လည်လုပ်ဆောင်သည့် အစီအစဉ်မှာ အောက်ပါအတိုင်းဖြစ်သည်-',
    )
  })

  test('uses reviewed Myanmar wording where NLLB inserts an Oriya mark into the domain row', () => {
    expect(
      curatedExactTranslation(
        '| Domain           | ensure domain setup, unregister domains, transfer domain ownership, update domain metadata                    |',
        myanmar,
      ),
    ).toBe(
      '| ဒိုမိန်း | ဒိုမိန်းဖွဲ့စည်းမှုကို သေချာစေခြင်း၊ ဒိုမိန်းများကို မှတ်ပုံတင်မှ ပယ်ဖျက်ခြင်း၊ ဒိုမိန်းပိုင်ဆိုင်မှုကို လွှဲပြောင်းခြင်း၊ ဒိုမိန်း မက်တာဒေတာကို ပြင်ဆင်ခြင်း |',
    )
  })

  test('uses reviewed Armenian consensus wording where NLLB code-switches to Russian', () => {
    expect(
      curatedExactTranslation(
        'Observer peers can synchronize committed blocks, but they do not propose, vote, or count toward the commit quorum. Use observers when a deployment needs local query capacity, indexing, monitoring, or regional block replication without increasing the number of voting validators.',
        armenian,
      ),
    ).toBe(
      'Դիտորդ հանգույցները կարող են համաժամեցնել հաստատված բլոկները, սակայն նրանք բլոկ չեն առաջարկում, չեն քվեարկում և չեն հաշվվում հաստատման քվորումի կազմում։ Դիտորդներ օգտագործեք, երբ տեղակայմանը հարկավոր են տեղական հարցումների սպասարկման կարողություն, ինդեքսավորում, մշտադիտարկում կամ բլոկների տարածաշրջանային կրկնօրինակում՝ առանց քվեարկող վավերացնողների քանակն ավելացնելու։',
    )
  })

  test('uses reviewed exact units for newly observed cross-script provider output', () => {
    expect(curatedExactTranslation('Run Atomic Private Cross-Dataspace Settlement', hebrew)).toBe(
      'הפעלת סליקה פרטית אטומית בין מרחבי נתונים',
    )
    expect(curatedExactTranslation('- the transaction entrypoint hash used as the batch hash', armenian)).toBe(
      '- գործարքի մուտքային կետի հեշը, որն օգտագործվում է որպես խմբաքանակի հեշ',
    )
    expect(
      curatedExactTranslation(
        'Pipeline events are emitted when transactions are submitted, executed, or committed to a block. A pipeline event contains the following information: the kind of entity that caused an event (transaction or block), its hash and status. The status can be either `Validating` (validation in progress), `Rejected`, or `Committed`. If an entity was rejected, the reason for the rejection is provided.',
        urdu,
      ),
    ).toContain('اس کا کرپٹوگرافک ہیش، اور اس کی حالت')
    expect(
      curatedExactTranslation('| `Account` | Account lifecycle, metadata, alias, and identity events |', bashkir),
    ).toBe('| `Account` | Иҫәп яҙмаһының тормош циклы, метадатаһы, ҡушаматы һәм идентификация ваҡиғалары |')
    expect(
      curatedExactTranslation(
        'Use a draft when one business action should become one signed transaction. The business receipt number goes in `primary_reference`; the ledger ID is generated after the transaction commits.',
        kazakh,
      ),
    ).toContain('тізілім идентификаторы транзакция бекітілгеннен кейін жасалады')
  })

  test('uses reviewed exact units for later provider truncation and cross-script failures', () => {
    const reviewed = [
      {
        locale: amharic,
        source:
          'The MCP bridge can submit a signed Iroha transaction, but it does not remove the normal transaction requirements. A transaction still needs a correct authority, permissions, fee funding, chain ID, metadata, and signature.',
        expected: 'የ MCP ድልድይ የተፈረመ የ Iroha ግብይት ማስገባት ይችላል፣',
      },
      {
        locale: azerbaijani,
        source:
          '| Execution plane        | Runtime | Use it for                                                                                   |',
        expected: '| İcra müstəvisi | Proqram icra mühiti | İstifadə sahəsi |',
      },
      {
        locale: bashkir,
        source:
          'An empty `items` array is a valid response on a public testnet. It means there are no NFTs in the current page, not that NFT instructions are unavailable.',
        expected: 'хәҙерге биттә NFT-лар юҡлығын аңлата',
      },
      {
        locale: armenian,
        source:
          'Lane relay envelopes also carry compact FastPQ proof material. The material is a digest over the lane id, dataspace id, block height, verification height, block header hash, settlement hash, and manifest root. A relay is merge admissible only when it has both a QC and valid FastPQ proof material.',
        expected: 'Վերահաղորդումը միավորման համար ընդունելի է միայն այն դեպքում',
      },
      {
        locale: hebrew,
        source: 'Use a language-specific guide to register blockchain objects:',
        expected: 'השתמשו במדריך הייעודי לכל שפה כדי לרשום אובייקטים בבלוקצ׳יין:',
      },
      {
        locale: georgian,
        source:
          '- When repetitions reach zero, minting more repetitions is another privileged write. Do not silently change this recipe to an indefinite trigger.',
        expected: 'განუსაზღვრელი რაოდენობის გამეორების მქონე ტრიგერად',
      },
      {
        locale: georgian,
        source:
          'In an Iroha network, a peer is selected randomly and granted the special privilege of forming the next block. This privilege can be revoked in networks that achieve [Byzantine fault tolerance](#byzantine-fault-tolerance-bft) via [view change](#view-change).',
        expected: '[ბიზანტიური ხარვეზებისადმი მედეგობას](#byzantine-fault-tolerance-bft)',
      },
      {
        locale: japanese,
        source:
          'All write commands select the authority as fee payer explicitly. The CLI quotes the exact transaction before signing and waits by default.',
        expected: '対象トランザクションの正確な手数料見積もり',
      },
      {
        locale: japanese,
        source:
          'The first build publishes the artifact and authenticated sidecars. The second runs in read-only `--verify` mode and fails if any existing output does not exactly match the current source. Treat the `.to` file and its manifest as one reviewed build output.',
        expected: '認証済みの付随ファイル',
      },
      {
        locale: japanese,
        source:
          '- If submission times out after returning a hash, query that hash before building another transaction. Blind resubmission creates a new quoted and signed payload.',
        expected: '手数料見積もり済みで署名済みの新しいペイロード',
      },
      {
        locale: japanese,
        source:
          '4. After every leg has a Prepare certificate, build the immutable complete Prepare barrier. Request and persist canonical 3-of-4 Commit certificates. If the coordinator restarts, query participant nodes for their locally durable Prepare and Commit certificates, select a canonical quorum-equivalent certificate, and re-fan it out before continuing; never reconstruct a certificate from an unauthenticated local cache.',
        expected: 'すべての決済区間について Prepare 証明書',
      },
      {
        locale: japanese,
        source:
          '- both formal layers: the 3/255-leg count-symmetry checks and the exact four-validator committee-indexed N=2 validator-focused plus full bounded- fault, paper-primary N=3 fault, N=4 clean, and N=3 expiry/replay configurations, with fault budgets independent per committee',
        expected: '3/255 区間の個数対称性チェック',
      },
      {
        locale: japanese,
        source:
          '[^1]: `Register<Account>` creates ledger state for a canonical, domainless `AccountId`; domain routing and aliases are managed separately.',
        expected: '[^1]: `Register<Account>` は',
      },
      {
        locale: japanese,
        source:
          'Kaigi writes are instructions inside ordinary quoted and signed transactions. Submit them through `POST /v1/pipeline/transactions` and wait for finalized block evidence.',
        expected: '手数料見積もり済み・署名済みトランザクション',
      },
      {
        locale: japanese,
        source:
          'The real demo result also carries finalized block evidence and any quoted fee. Do not treat a transaction hash alone as success.',
        expected: '提示された手数料見積もり',
      },
      {
        locale: japanese,
        source: 'The payload and Minamoto form below come from the cross-SDK compliance fixture.',
        expected: 'SDK 間の適合性テスト用フィクスチャ',
      },
      {
        locale: myanmar,
        source:
          'For public Taira or Minamoto usage, treat the off-chain payment rail and any support or court workflow as application policy. Iroha records the custody state, lifecycle events, evidence hashes, and final asset movement; it does not verify fiat settlement by itself.',
        expected: 'fiat ငွေရှင်းခြင်းကို မိမိဘာသာ အတည်မပြုပါ',
      },
      {
        locale: urdu,
        source:
          '- When metadata points to off-chain data, store a verifiable reference such as a content hash, URI, SoraFS path, manifest reference, or compact commitment.',
        expected: 'مواد کا کرپٹوگرافک ہیش، URI، SoraFS پاتھ',
      },
      {
        locale: amharic,
        source: 'Production equivalent',
        expected: 'የምርት አካባቢ አቻ',
      },
      {
        locale: bashkir,
        source: '- membership or access records',
        expected: '- ағзалыҡ йәки инеү хоҡуғы яҙмалары',
      },
      {
        locale: hebrew,
        source:
          '4. Trigger-produced effects are handled in the block execution pipeline without allowing unbounded recursive trigger execution.',
        expected: 'בלי לאפשר הפעלה רקורסיבית בלתי מוגבלת של טריגרים',
      },
      {
        locale: armenian,
        source: 'Plaintext coefficient vectors are encoded by scaling each coefficient:',
        expected: 'յուրաքանչյուր գործակիցը մասշտաբավորելով',
      },
      {
        locale: mongolian,
        source:
          'RAM-LFE stands for Random-Access Machine Laconic Function Evaluation. In Iroha, it is the generic hidden-function layer for programs whose public policy is on-chain but whose evaluator logic, secret, or raw input should not be written to world state. It is used by SORA Nexus identifier flows, such as private phone or email lookup, and can also be exposed as a generic Torii program-execution helper when a node profile enables the app-facing routes.',
        expected: 'ерөнхий далд функцийн давхарга',
      },
      {
        locale: simplifiedChinese,
        source:
          '- the submitting transaction authority unless the application uses a private entrypoint or relayer pattern',
        expected: '- 提交交易的授权主体，除非应用程序使用私有入口点或中继器模式',
      },
      {
        locale: traditionalChinese,
        source: 'Client configuration stores the signing authority separately from peer configuration:',
        expected: '用戶端設定將簽署授權主體與網路對等節點設定分開儲存：',
      },
      {
        locale: urdu,
        source:
          'These sorts of subtle mistakes can be avoided, for example, by deserialising directly from string literals, or by generating a fresh key-pair in places where it makes sense.',
        expected: 'جہاں مناسب ہو وہاں کلیدوں کا نیا جوڑا بنا کر',
      },
      {
        locale: uzbek,
        source:
          '- strict account fields use the canonical I105 account ID, while readable names are resolved through an active account-alias binding',
        expected: 'faol hisob taxallusi bog‘lanishi orqali aniqlanadi',
      },
      {
        locale: simplifiedChinese,
        source: 'The runtime configuration builds three pieces of lane state:',
        expected: '软件执行环境配置构建三部分执行通道状态：',
      },
      {
        locale: traditionalChinese,
        source: 'The runtime configuration builds three pieces of lane state:',
        expected: '軟體執行環境設定會建構三部分的執行通道狀態：',
      },
      {
        locale: kazakh,
        source:
          'The option summary above is verified against the current `iroha3d` argument definitions. The checked-in generated help snapshot is intentionally not rendered while its provenance status is pending. To inspect the exact help for your checkout, run:',
        expected: 'Жұмыс көшірмеңіздегі дәл анықтаманы көру үшін',
      },
      {
        locale: myanmar,
        source:
          'Treat fraud monitoring as a separate service rather than logic embedded in a validator. The service should subscribe to ledger activity, enrich it with off-chain risk context, persist evidence, and submit response transactions only through accounts that have explicit permissions.',
        expected: 'ကွန်ရက်ပြင်ပ အန္တရာယ်ဆိုင်ရာ အကြောင်းအရာများဖြင့်',
      },
      {
        locale: russian,
        source:
          'Feature availability can differ between SDKs and release profiles. The wire format remains governed by the header and schema, not by local build flags.',
        expected: 'Формат протокольной сериализации по-прежнему определяется заголовком и схемой',
      },
    ]

    for (const { expected, locale, source } of reviewed) {
      expect(curatedExactTranslation(source, locale), locale.key).toContain(expected)
    }
  })

  test('short-circuits provider calls for a reviewed exact prose unit', async () => {
    const source =
      'Accounts are registered and unregistered with the generic [`Register` and `Unregister`](/blockchain/instructions.md#un-register) instructions. The active runtime validator decides who can create accounts and which permission tokens or roles are required.\n'
    const provider: TranslationProvider = {
      engine: 'exact-short-circuit-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'ba',
      translate: async () => {
        throw new Error('reviewed exact prose must not call the provider')
      },
      translateBatch: async () => {
        throw new Error('reviewed exact prose must not call the provider')
      },
    }

    const translated = await translateDocument(source, 'blockchain/accounts.md', bashkir, provider)

    expect(translated).toContain('[`Register` һәм `Unregister`](/ba/blockchain/instructions.md#un-register)')
  })

  test('applies the reviewed Spanish safety wording through the I105 translation pipeline', async () => {
    const provider: TranslationProvider = {
      engine: 'i105-spanish-integration-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'spa_Latn',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => [...texts],
    }
    const source = await readFile(path.resolve('src/reference/i105.md'), 'utf8')

    const translated = await translateDocument(source, 'reference/i105.md', spanish, provider)

    expect(translated).toContain('Separe los seis dígitos correspondientes a la suma de comprobación.')
    expect(translated).toContain('Verifique la suma de comprobación calculada sobre esos bytes canónicos.')
    expect(translated).toContain('Genere la representación canónica del `AccountId` para el discriminante esperado.')
    expect(translated).toContain(
      'Use una intercalación que preserve las mayúsculas y minúsculas y el ancho de los caracteres.',
    )
    expect(translated).not.toContain('Render the `AccountId` canonically for the expected discriminant.')
  })

  test('uses reviewed exact Unicode terminology for the Uzbek I105 guide', () => {
    const reviewed = new Map([
      [' The alphabet is `Unicode`-sensitive. ', ' Alifbo `Unicode` kod nuqtalarini aynan farqlaydi. '],
      [
        ' The exact sequence uses `compatibility-width` Japanese `kana` symbols plus the code points shown for `ヰ` and `ヱ`. ',
        ' Aniq ketma-ketlik `compatibility-width` formatidagi yapon `kana` belgilaridan hamda `ヰ` va `ヱ` uchun ko\u2018rsatilgan aynan shu kod nuqtalaridan foydalanadi. ',
      ],
      [
        ' Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution. ',
        ' NFC yoki NFKC tarzida normallashtirishni, belgi kengligini o\u2018zgartirishni, harf registrini birxillashtirishni yoki belgilarni ko\u2018rinishi o\u2018xshash boshqa belgilar bilan almashtirishni qo\u2018llamang. ',
      ],
      [
        ' ASCII `0`, `O`, `I`, and `l` are not alphabet symbols. ',
        ' ASCII `0`, `O`, `I` va `l` alifbo belgilari emas. ',
      ],
    ])

    for (const [source, expected] of reviewed) {
      expect(curatedExactTranslation(source, uzbek)).toBe(expected)
    }
  })

  test('applies the reviewed Uzbek Unicode wording through the I105 translation pipeline', async () => {
    const provider: TranslationProvider = {
      engine: 'i105-uzbek-integration-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'uzn_Latn',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => [...texts],
    }
    const source = await readFile(path.resolve('src/reference/i105.md'), 'utf8')

    const translated = await translateDocument(source, 'reference/i105.md', uzbek, provider)

    expect(translated).toContain('Alifbo `Unicode` kod nuqtalarini aynan farqlaydi.')
    expect(translated).toContain(
      'Aniq ketma-ketlik `compatibility-width` formatidagi yapon `kana` belgilaridan hamda `ヰ` va `ヱ` uchun ko\u2018rsatilgan aynan shu kod nuqtalaridan foydalanadi.',
    )
    expect(translated).toContain(
      'NFC yoki NFKC tarzida normallashtirishni, belgi kengligini o\u2018zgartirishni, harf registrini birxillashtirishni yoki belgilarni ko\u2018rinishi o\u2018xshash boshqa belgilar bilan almashtirishni qo\u2018llamang.',
    )
    const reviewedSafetyUnits = [
      'Tarmoq sentineli',
      'Matnni bitta `u16` zanjir diskriminantiga moslaydi',
      'Kanonik hisob boshqaruvchisi baytlarining `base-105` kodlanishi',
      'I105 alifbosi orqali ifodalangan `Bech32m` uslubidagi oltita `5-bit` qiymat',
      'Dekoder kutilgan diskriminantni majburiy tekshirishi kerak.',
      'Tekshiruv summasi sentinel almashtirilganini aniqlay olmaydi.',
      '### Tarmoq sentinellari {#network-sentinels}',
      'Nomli qiymatlar uchun har doim ularning nomli sentineli ishlatiladi.',
      'Endpoint yoki zanjir ID sini tanlash manzil profilini avtomatik ravishda tanlamaydi.',
      'Taira shakli ayni shu foydali yukga Taira sentinelini qo‘llaydi:',
      'Ular sentinel, alifbo, tekshiruv summasi, bayt uzunliklari, `CurveId`/kalit tuzilishi va manzil qatlamining aynan qayta kodlanishini tekshiradi.',
      'Ular `AccountId` obyektini hosil qilmaydi.',
      'Ular sarlavha sinfi boshqaruvchiga mos kelishini isbotlamaydi.',
      'Avtorizatsiya yoki doimiy saqlashdan oldin qat’iy `AccountId` tekshiruvidan foydalaning.',
      '`base-105` tanasi ochiq kalit satrini yoki Norito JSON obyektini emas, ikkilik hisob foydali yukini kodlaydi:',
      'Zaxiralangan `extension flag`',
      '`extension flag` qiymati `1` bo‘lsa, u rad etiladi.',
      'Quyi darajadagi dekoder boshqa versiya va normallashtirish bit qiymatlarini saqlab qolishi mumkin, ammo sinfni boshqaruvchi tegi bilan mustaqil ravishda o‘zaro tekshirmaydi.',
      'Xom kalit uzunligi',
      'Ochiq kalitning xom foydali yuki',
      'A’zoning tasdiqlash vazni',
      'Yaroqli siyosatda kamida bitta a’zo, musbat vaznlar va takrorlanmagan ochiq kalitlar bo‘lishi, chegara qiymati esa `1` dan a’zolar vaznlari yig‘indisigacha bo‘lishi kerak.',
      'Kanonik tuzilish a’zolarni avval imzolash algoritmining barqaror nomi, keyin nol ajratuvchi bayt va undan so‘ng xom ochiq kalit baytlari bo‘yicha saralaydi.',
      '## Qat’iy AccountId tekshiruvi va kanoniklik {#strict-accountid-validation-and-canonicality}',
      "SDK'ni kutilgan zanjir diskriminanti bilan sozlagach, qiymatni `AccountId` sifatida tahlil qiling va qaytarilgan kanonik ko‘rinishni chetki bo‘shliqlari olib tashlangan kirish bilan taqqoslang.",
      'Ishonchsiz satr uchun talablarga mos ilova quyidagilarni bajarishi kerak:',
      '1. Faqat to‘liq qiymatning boshi va oxiridagi ruxsat etilgan transport bo‘shliqlarini olib tashlang.',
      '2. Sentinelni o‘qing va kutilgan zanjir diskriminantini talab qiling.',
      '3. Qolgan har bir `Unicode` belgisini aniq 105 belgili alifbo bo‘yicha xaritalang.',
      '4. Tekshiruv summasining olti raqamini ajrating.',
      '5. Foydali yuk raqamlarini qayta kanonik baytlarga aylantiring.',
      '6. Shu kanonik baytlar bo‘yicha tekshiruv summasini tekshiring.',
      '7. Sarlavha va boshqaruvchini tahlil qilib, quyidagilarni talab qiling:',
      '   - maydonlarning aniq uzunliklari',
      '   - qo‘llab-quvvatlanadigan `CurveId`',
      '   - yaroqli ochiq kalit',
      '   - oxirida ortiqcha baytlar yo‘qligi',
      '   - tegishli holatda yaroqli multisig siyosati',
      '8. `AccountId` yarating.',
      '9. `AccountId` obyektini kutilgan diskriminant uchun kanonik tarzda ifodalang.',
      '10. Chetki bo‘shliqlari olib tashlangan kirish bilan `byte-for-byte` tenglikni talab qiling.',
      '- oxiriga `@domain` suffiksi qo‘shilgan I105 literali',
      '- JSON hisob maydonlarida aynan I105 UTF-8 satrini yuboring.',
      '- Harf registri va belgi kengligini saqlaydigan kollatsiyadan foydalaning.',
      '- Zanjir diskriminantini yoki nomlangan tarmoq profilini eksport qilingan hisob ma’lumotlari va zaxira nusxalari bilan birga saqlang.',
      '- Har bir `kana` belgisini aynan saqlang.',
      'Tana foydali yuk va tekshiruv summasining ikkalasini ham sig‘dira olmaydi',
      "I105 ID'ni hosil qilish hisobni ro‘yxatdan o‘tkazmaydi va uni moliyalashtirmaydi.",
      '- Regex I105 validatori emas.',
    ]

    for (const reviewedUnit of reviewedSafetyUnits) {
      expect(translated).toContain(reviewedUnit)
    }
    expect(translated).not.toContain('The alphabet is `Unicode`-sensitive.')
  })

  test('applies a reviewed I105 safety canary for every maintained locale', async () => {
    const sharedSource = '- Preserve letter case and do not apply `Unicode` normalization.'
    const uzbekSource = 'The alphabet is `Unicode`-sensitive.'

    for (const locale of TRANSLATED_LOCALES) {
      const provider: TranslationProvider = {
        engine: `i105-${locale.key}-reviewed-canary-test`,
        protectedMarkdownMode: 'inline-identifiers',
        languageCode: () => NLLB_LANGUAGE_CODES[locale.key],
        translate: async () => {
          throw new Error('inline translation must use the batch method')
        },
        translateBatch: async (texts) => [...texts],
      }
      const source = locale.key === 'uz' ? uzbekSource : sharedSource
      const translated = await translateDocument(`${source}\n`, 'reference/i105.md', locale, provider)

      expect(translated, locale.key).not.toContain(source)
      expect(translated, locale.key).toContain('`Unicode`')
    }
  })

  test('applies reviewed full-table-row translations before translating individual cells', async () => {
    const provider: TranslationProvider = {
      engine: 'i105-hebrew-table-row-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => NLLB_LANGUAGE_CODES.he,
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => [...texts],
    }
    const source =
      '| Network sentinel | Maps the text to one `u16` chain discriminant                      | Not covered       |\n'

    const translated = await translateDocument(source, 'reference/i105.md', hebrew, provider)

    expect(translated).toContain('| סנטינל רשת | ממפה את הטקסט למבחין שרשרת `u16` אחד | לא מכוסה |')
    expect(translated).not.toContain('Network sentinel')
  })

  test('keeps every reviewed I105 unit in the checked-in locale pages', async () => {
    const normalizeWhitespace = (value: string): string => value.replace(/\s+/gu, ' ').trim()
    const source = normalizeWhitespace(
      addStableHeadingAnchors(await readFile(path.resolve('src/reference/i105.md'), 'utf8')),
    )

    for (const locale of TRANSLATED_LOCALES) {
      const translated = normalizeWhitespace(
        await readFile(path.resolve('src', locale.key, 'reference/i105.md'), 'utf8'),
      )

      for (const [sourceUnit, reviewedUnit] of curatedExactTranslationEntries(locale)) {
        if (!source.includes(normalizeWhitespace(sourceUnit))) continue
        expect(translated, `${locale.key}: ${sourceUnit}`).toContain(normalizeWhitespace(reviewedUnit))
      }
    }
  })

  test('keeps every reviewed exact source unit reachable in the English corpus', async () => {
    const normalizeWhitespace = (value: string): string => value.replace(/\s+/gu, ' ').trim()
    const files = await globby('src/**/*.md', {
      ignore: ['src/snippets/**', ...TRANSLATED_LOCALES.map((locale) => `src/${locale.path}/**`)],
    })
    const corpus = normalizeWhitespace(
      (
        await Promise.all(
          files.map(async (file) => addStableHeadingAnchors(await readFile(path.resolve(file), 'utf8'))),
        )
      ).join('\n'),
    )

    for (const locale of TRANSLATED_LOCALES) {
      for (const [sourceUnit] of curatedExactTranslationEntries(locale)) {
        expect(corpus, `${locale.key}: ${sourceUnit}`).toContain(normalizeWhitespace(sourceUnit))
      }
    }
  })

  test('keeps inline I105 wire and signing identifiers out of provider input', async () => {
    const identifiers = [
      'BLS12-381',
      'BLS12-381 normal',
      'Base58',
      'Bech32m',
      'Bitcoin',
      'Cargo',
      'Ed25519',
      'GOST R 34.10-2012',
      'GOST R 34.10-2012 256-bit, parameter set A',
      'ML-DSA',
      'SM2',
      'Unicode',
      'secp256k1',
    ]
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'i105-identifier-protection-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fra_Latn',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) =>
          identifiers.reduce((result, identifier) => result.replaceAll(identifier, 'BROKEN'), text),
        )
      },
    }
    const source = `Preserve ${identifiers.map((identifier) => `\`${identifier}\``).join(', ')} in this protocol description.\n`

    const translated = await translateDocument(source, 'reference/i105-identifiers.md', french, provider)
    const providerInput = batches.flat().join('\n')

    for (const identifier of identifiers) {
      expect(providerInput).not.toContain(identifier)
      expect(translated).toContain(identifier)
    }
    expect(translated).not.toContain('BROKEN')
  })

  test('keeps ordinary I105 prose available to the translation provider', async () => {
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'i105-prose-scope-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fra_Latn',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return [...texts]
      },
    }
    const source =
      'Encode and decode a public key with a chain discriminant, regular expression, extension flag, and byte-preserving comparison.\n'

    await translateDocument(source, 'reference/i105-prose.md', french, provider)

    expect(batches.flat().join('\n')).toContain(source.trim())
  })

  test('uses reviewed exact Norito status terminology for Chinese locales', () => {
    const isoAuditScope =
      'Either original party can read its message record and generated outbox documents. The audit endpoint returns only records in which the authenticated participant is the originator or counterparty. A separately configured audit administrator receives a global read-only audit view and cannot submit or change messages. Unknown participants and unrelated message identifiers are not disclosed.'
    expect(curatedExactTranslation(isoAuditScope, simplifiedChinese)).toBe(
      '原始交易的任一方都可以读取其消息记录和生成的发件箱文档。审计端点只返回已认证参与者为发起方或交易对手方的记录。单独配置的审计管理员可以获得全局只读审计视图，但不能提交或更改消息。系统不会泄露未知参与者或无关消息标识符是否存在。',
    )
    expect(curatedExactTranslation(isoAuditScope, traditionalChinese)).toBe(
      '原始交易的任一方都可以讀取其訊息記錄及產生的寄件匣文件。稽核端點只會傳回已驗證參與者為發起方或交易對手方的記錄。另行設定的稽核管理員可取得全域唯讀稽核檢視，但不能提交或變更訊息。系統不會揭露未知參與者或不相關訊息識別碼是否存在。',
    )
    expect(curatedExactTranslation(' Account report, statement, and notification validation ', simplifiedChinese)).toBe(
      ' 账户报告、对账单和通知的验证 ',
    )
    expect(curatedExactTranslation('Account report, statement, and notification validation', traditionalChinese)).toBe(
      '帳戶報告、對帳單與通知的驗證',
    )
    expect(curatedExactTranslation(' Supported with requirements ', simplifiedChinese)).toBe(' 有条件支持 ')
    expect(curatedExactTranslation('Supported with requirements', traditionalChinese)).toBe('有條件支援')
    expect(
      curatedExactTranslation(
        ' Apply deterministic heuristics to decide whether compression is worthwhile. ',
        simplifiedChinese,
      ),
    ).toBe(' 采用确定性启发式方法判断是否值得压缩。 ')
    expect(
      curatedExactTranslation(
        'Apply deterministic heuristics to decide whether compression is worthwhile.',
        traditionalChinese,
      ),
    ).toBe('採用確定性啟發式方法判斷是否值得壓縮。')
    expect(
      curatedExactTranslation(
        ' Carry manifest announcements, feedback, key updates, and capability negotiation. ',
        simplifiedChinese,
      ),
    ).toBe(' 承载清单通告、反馈消息、密钥更新和能力协商。 ')
    expect(
      curatedExactTranslation(
        'Carry manifest announcements, feedback, key updates, and capability negotiation.',
        traditionalChinese,
      ),
    ).toBe('承載清單通告、回饋訊息、金鑰更新與能力協商。')
    expect(curatedExactTranslation(' Return on-chain executor configuration parameters. ', simplifiedChinese)).toBe(
      ' 返回链上执行器的配置参数。 ',
    )
    expect(curatedExactTranslation('Return on-chain executor configuration parameters.', traditionalChinese)).toBe(
      '返回鏈上執行器的設定參數。',
    )
    expect(curatedExactTranslation(' Return the domain endorsement policy. ', simplifiedChinese)).toBe(
      ' 返回链上域的背书政策。 ',
    )
    expect(curatedExactTranslation('Return the domain endorsement policy.', traditionalChinese)).toBe(
      '返回鏈上網域的背書政策。',
    )
    expect(curatedExactTranslation(' List committed transactions. ', simplifiedChinese)).toBe(
      ' 列出已提交的链上交易。 ',
    )
    expect(curatedExactTranslation('List committed transactions.', traditionalChinese)).toBe('列出已提交的鏈上交易。')
    expect(curatedExactTranslation('Supported', simplifiedChinese)).toBeUndefined()
  })

  test('counts Nexus identifiers consistently across soft wrapping', () => {
    expect(technicalIdentifiers('SORA\nNexus, SORA Nexus, and Nexus.').get('Nexus')).toBe(3)
  })

  test('leaves generic ID prose translatable while preserving concrete identifier names', () => {
    const source = 'List canonical account IDs and copy one AccountId.'
    const protectedMarkdown = protectMarkdown(source, french, 'identifier')

    expect(protectedMarkdown.masked).toContain('IDs')
    expect(protectedMarkdown.masked).not.toContain('AccountId')
    expect(technicalIdentifiers(source)).toEqual(new Map([['AccountId', 1]]))
    expect(protectedMarkdown.restore(protectedMarkdown.masked)).toBe(source)
  })

  test('applies reviewed heading translations after stable anchors are added', () => {
    expect(curatedExactTranslation('## Anonymous Asset Escrow {#anonymous-asset-escrow}', myanmar)).toBe(
      '## အမည်မဖော် ပိုင်ဆိုင်မှု အာမခံအပ်နှံမှု {#anonymous-asset-escrow}',
    )
  })

  test('keeps every reviewed exact translation structurally and technically source-aligned', () => {
    const failures: string[] = []
    for (const locale of TRANSLATED_LOCALES) {
      for (const [source, translated] of curatedExactTranslationEntries(locale)) {
        try {
          assertGeneratedMarkdownStructure(source, translated, locale)
        } catch (error) {
          failures.push(
            `${locale.key}: ${JSON.stringify(source)}: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      }
    }
    expect(failures).toEqual([])
  })

  test('preserves protocol-family link labels while keeping localized destinations', () => {
    expect(
      synchronizeTechnicalLinkLabels(
        'Use [Log/Custom/Upgrade](/blockchain/instructions.md#other-instructions).',
        'Utilisez [Journal/Personnalisé/Mise à niveau](/fr/blockchain/instructions.md#other-instructions).',
        french,
      ),
    ).toBe('Utilisez [Log/Custom/Upgrade](/fr/blockchain/instructions.md#other-instructions).')
  })

  test('rejects generated prose whose link label escaped the brackets', () => {
    expect(() =>
      assertGeneratedMarkdownStructure(
        'Use [Transfer](#transfer).',
        'Utilisez [](#transfer) Transférer.',
        french,
      ),
    ).toThrow('Markdown link label became empty for destination #transfer')
  })

  test('rejects reviewed prose that changes a protected technical identifier', () => {
    expect(() =>
      assertGeneratedMarkdownStructure(
        'World state includes NFTs and SORA Nexus.',
        'L’état mondial inclut NFT et SORA Nexus.',
        french,
      ),
    ).toThrow('technical identifier NFTs drift (expected 1, found 0)')
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

  test('rejects structurally damaged provider output before writing a translated page', async () => {
    const provider: TranslationProvider = {
      engine: 'damaged-output-test',
      protectedMarkdownMode: 'inline-identifiers',
      clarifyTechnicalTerms: false,
      languageCode: () => 'fr',
      translate: async (text) => text,
      translateBatch: async (texts) => texts.map((text) => `${text}\n\nTexte supplémentaire`),
    }

    await expect(
      translateDocument('A complete source paragraph.\n', 'guide/damaged.md', french, provider),
    ).rejects.toThrow('prose unit inventory drift')
  })

  test('rejects invented Markdown links before writing a translated page', async () => {
    const provider: TranslationProvider = {
      engine: 'invented-link-test',
      protectedMarkdownMode: 'inline-identifiers',
      clarifyTechnicalTerms: false,
      languageCode: () => 'fr',
      translate: async (text) => text,
      translateBatch: async (texts) => texts.map((text) => `${text} [lien ajouté](/oops)`),
    }

    await expect(
      translateDocument('A complete source paragraph.\n', 'guide/invented-link.md', french, provider),
    ).rejects.toThrow('Markdown link destination inventory drift')
  })

  test('allows a translation to reorder complete links while preserving their destination inventory', async () => {
    const provider: TranslationProvider = {
      engine: 'reordered-links-test',
      protectedMarkdownMode: 'inline-identifiers',
      clarifyTechnicalTerms: false,
      languageCode: () => 'fr',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) =>
        texts.map((text) =>
          text
            .replace('Byzantine fault tolerance', 'tolérance aux fautes byzantines')
            .replace('view change', 'changement de vue')
            .replace(/See (\[PH\d+\]) via (\[PH\d+\])\./u, 'Consultez $2, puis $1.'),
        ),
    }

    const translated = await translateDocument(
      'See [Byzantine fault tolerance](#bft) via [view change](#view-change).\n',
      'guide/reordered-links.md',
      french,
      provider,
    )

    expect(translated).toContain(
      'Consultez [changement de vue](#view-change), puis [tolérance aux fautes byzantines](#bft).',
    )
  })

  test('rejects invented inline-code delimiters before writing a translated page', async () => {
    const provider: TranslationProvider = {
      engine: 'invented-backtick-test',
      protectedMarkdownMode: 'inline-identifiers',
      clarifyTechnicalTerms: false,
      languageCode: () => 'fr',
      translate: async (text) => text,
      translateBatch: async (texts) => texts.map((text) => `${text}\``),
    }

    await expect(
      translateDocument('A complete source paragraph.\n', 'guide/invented-backtick.md', french, provider),
    ).rejects.toThrow('inline code inventory drift')
  })

  test('rejects foreign-script hallucinations before writing a translated page', async () => {
    const provider: TranslationProvider = {
      engine: 'foreign-script-test',
      protectedMarkdownMode: 'inline-identifiers',
      clarifyTechnicalTerms: false,
      languageCode: () => 'fr',
      translate: async (text) => text,
      translateBatch: async (texts) => texts.map((text) => `${text} Ж`),
    }

    await expect(
      translateDocument('A complete source paragraph.\n', 'guide/foreign-script.md', french, provider),
    ).rejects.toThrow('contains unexpected writing script: Cyrillic')
  })

  test('preserves prose example identifiers exactly', async () => {
    const provider: TranslationProvider = {
      engine: 'example-identifier-test',
      protectedMarkdownMode: 'inline-identifiers',
      clarifyTechnicalTerms: false,
      languageCode: () => 'ja',
      translate: async (text) => text,
      translateBatch: async (texts) =>
        texts.map((text) =>
          text.replaceAll('Alice', 'アリス').replaceAll('Mouse', 'マウス').replaceAll('Mad Hatter', '帽子屋'),
        ),
    }

    const translated = await translateDocument(
      'Alice grants Mouse a role owned by Mad Hatter.\n',
      'guide/example-identifiers.md',
      japanese,
      provider,
    )

    expect(translated).toContain('Alice')
    expect(translated).toContain('Mouse')
    expect(translated).toContain('Mad Hatter')
    expect(translated).not.toMatch(/アリス|マウス|帽子屋/u)
  })

  test('rejects leaked internal private-use placeholders', async () => {
    const provider: TranslationProvider = {
      engine: 'placeholder-leak-test',
      protectedMarkdownMode: 'inline-identifiers',
      clarifyTechnicalTerms: false,
      languageCode: () => 'fr',
      translate: async (text) => text,
      translateBatch: async (texts) => texts.map((text) => `${text}\uE000`),
    }

    await expect(
      translateDocument('# Guide\n\nA complete source paragraph.\n', 'guide/placeholder.md', french, provider),
    ).rejects.toThrow('internal private-use placeholder')
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

  test('protects container keywords and footnote markers from translation', async () => {
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'markdown-structure-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fra_Latn',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => text.replaceAll('Note', 'Remarque').replaceAll('Read', 'Lisez'))
      },
    }
    const source = '::: info Note\n\nRead this[^1].\n\n:::\n\n[^1]: Footnote text.\n'

    const translated = await translateDocument(source, 'guide/structure.md', french, provider)

    expect(translated).toContain('::: info Remarque')
    expect(translated).toContain('Lisez this[^1].')
    expect(translated).toContain('[^1]: Footnote text.')
    expect(batches.flat().join('\n')).not.toMatch(/:::|\[\^1\]/u)
  })

  test('balances retry chunks instead of leaving an undersized sentence tail', () => {
    const source =
      'In a private blockchain, most accounts are assumed not to be able to do anything outside the authority granted to them unless explicitly granted the relevant permission.'
    const chunks = chunkForTranslation(source, 128)

    expect(chunks).toHaveLength(2)
    expect(chunks.join('')).toBe(source)
    expect(chunks.every((chunk) => chunk.length >= 64 && chunk.length <= 128)).toBe(true)
  })

  test('strips generated line-end whitespace without changing fenced code contents', async () => {
    const provider: TranslationProvider = {
      engine: 'trailing-whitespace-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fra_Latn',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => texts.map((text) => `${text} \t`),
    }
    const source = 'Ordinary prose.\n\n```text\nliteral payload  \t\n```\n\nFinal prose.\n'

    const translated = await translateDocument(source, 'guide/whitespace.md', french, provider)

    expect(translated).toContain('Ordinary prose.\n')
    expect(translated).toContain('Final prose.\n')
    expect(translated).toContain('```text\nliteral payload  \t\n```\n')
    expect(translated).not.toMatch(/^(?!literal payload)[^\n]*[ \t]+$/gmu)
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

    const translated = await translateDocument('## NFT SDK IDs\n', 'guide/heading.md', french, provider)

    expect(batches.flat()).toHaveLength(1)
    expect(batches.flat()[0].match(/\[PH\d{6}\]/gu)).toHaveLength(2)
    expect(translated).toContain('## NFT SDK IDs {#nft-sdk-ids}\n')
  })

  test('does not treat double underscores inside inline code as prose emphasis', async () => {
    const provider: TranslationProvider = {
      engine: 'inline-code-underscore-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fr',
      translate: async (text) => text,
      translateBatch: async (texts) => [...texts],
    }

    const translated = await translateDocument(
      'Use `StructName__TraitName__MethodName` with **bold prose**.\n',
      'guide/inline-code.md',
      french,
      provider,
    )

    expect(translated).toContain('`StructName__TraitName__MethodName`')
    expect(translated).toContain('with bold prose.')
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

  test('retains the short Generic asset locks sentence as its own retry request', async () => {
    const source =
      'Generic asset locks. Marketplace and anonymous escrow helpers are not first-class Python methods yet.'
    const maskedSource =
      'Generic asset locks. Marketplace and anonymous escrow helpers are not first-class [PH000000] methods yet.'
    const sentenceChunks = [
      'Generic asset locks. ',
      'Marketplace and anonymous escrow helpers are not first-class [PH000000] methods yet.',
    ]
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'short-sentence-escrow-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'spa_Latn',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === maskedSource) {
            return 'El mercado y los ayudantes anónimos no son métodos de primera clase [PH000000] todavía.'
          }
          if (text === sentenceChunks[0]) return 'Bloqueos genéricos de activos. '
          if (text === sentenceChunks[1]) {
            return 'Los ayudantes de custodia del mercado y anónimos todavía no son métodos de primera clase [PH000000].'
          }
          return text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/escrow.md', spanish, provider)

    expect(batches).toContainEqual([maskedSource])
    expect(batches).toContainEqual(sentenceChunks)
    expect(translated).toContain('Bloqueos genéricos de activos.')
    expect(translated).toContain('métodos de primera clase Python.')
  })

  test('keeps short sentence boundaries while carrying an abbreviation fragment forward', async () => {
    const source =
      'Ask Dr. Rivera to check it. Go now. Continue with the deterministic validation procedure before the network launch.'
    const maskedSource = source
    const sentenceChunks = [
      'Ask Dr. Rivera to check it. ',
      'Go now. ',
      'Continue with the deterministic validation procedure before the network launch.',
    ]
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'short-sentence-boundary-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'fra_Latn',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => (text === maskedSource ? 'Texte incomplet,' : text))
      },
    }

    const translated = await translateDocument(`${source}\n`, 'guide/short-sentence.md', french, provider)

    expect(batches).toContainEqual(sentenceChunks)
    expect(sentenceChunks.join('')).toBe(maskedSource)
    expect(translated).toContain('Ask Dr. Rivera to check it. Go now.')
  })

  test('applies sentence coverage to short prose cells inside table rows', async () => {
    const sourceCell = " A recent root of the asset's commitment tree. Proofs use it to show that spent notes exist. "
    const clarifiedSourceCell =
      " A recent root of the asset's cryptographic commitment value tree. Proofs use it to show that spent notes exist. "
    const sentenceChunks = [
      " A recent root of the asset's cryptographic commitment value tree. ",
      'Proofs use it to show that spent notes exist. ',
    ]
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'short-table-cell-coverage-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'por_Latn',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === clarifiedSourceCell) return ' Uma raiz recente da árvore de compromisso do activo. '
          if (text === sentenceChunks[0]) return ' Uma raiz recente da árvore de compromisso do ativo. '
          if (text === sentenceChunks[1]) return 'As provas mostram que as notas gastas existem. '
          return text
        })
      },
    }
    const source = `| Merkle root |${sourceCell}|\n`

    const translated = await translateDocument(source, 'blockchain/anonymous-transactions.md', portuguese, provider)

    expect(batches.flat()).toContain(clarifiedSourceCell)
    expect(batches).toContainEqual(sentenceChunks)
    expect(translated).toContain('As provas mostram que as notas gastas existem.')
  })

  test('retries a provider truncation guard by isolating and splitting the failed prose chunk', async () => {
    const failedChunk =
      ' To thwart such attempts, craft a unique password devoid of personal information like birthdays, addresses, phone numbers, or social security numbers. Avoid providing attackers with easily guessable clues.'
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'nllb-provider-guard-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'mya_Mymr',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        if (texts.includes(failedChunk)) {
          throw new Error(
            'NLLB translation failed: translation output is materially shorter than its source (7 target tokens for 47 source tokens)',
          )
        }
        return [...texts]
      },
    }
    const source =
      'Passwords can fall victim to brute-force attacks, typically executed using powerful GPUs in conjunction with dictionaries or exhaustive iteration through all possibilities. To thwart such attempts, craft a unique password devoid of personal information like birthdays, addresses, phone numbers, or social security numbers. Avoid providing attackers with easily guessable clues.\n'

    const translated = await translateDocument(source, 'guide/security/password-security.md', french, provider)

    expect(batches[0]).toContain(failedChunk)
    expect(batches.at(-1)).not.toContain(failedChunk)
    expect(batches.at(-1)?.every((chunk) => chunk.length < failedChunk.length)).toBe(true)
    expect(translated).toContain('social security numbers.')
    expect(translated).toContain('Avoid providing attackers with easily guessable clues.')
  })

  test('retries a collapsed colon-terminated unit at complete clause boundaries', async () => {
    const source = 'For a snapshot you can inspect without keeping a stream open, read recent explorer transactions:'
    const clarifiedSource =
      'For a point-in-time data view you can inspect without keeping a stream open, read recent explorer transactions:'
    const expectedChunks = [
      'For a point-in-time data view you can inspect without keeping a stream open, ',
      'read recent explorer transactions:',
    ]
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'clause-collapse-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'zho_Hans',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === clarifiedSource) return '查看最近的探索者交易,'
          if (text === expectedChunks[0]) return '若要在不保持事件流打开的情况下检查完整快照，'
          if (text === expectedChunks[1]) return '请读取最近的区块浏览器交易记录：'
          return text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/events.md', simplifiedChinese, provider)

    expect(batches[0]).toEqual([clarifiedSource])
    expect(batches.at(-1)).toEqual(expectedChunks)
    expect(batches.at(-1)?.join('')).toBe(clarifiedSource)
    expect(translated).toContain('若要在不保持事件流打开的情况下检查完整快照，')
    expect(translated).toContain('请读取最近的区块浏览器交易记录：')
  })

  test('recovers a short but meaningful comma-delimited aside', async () => {
    const source =
      "Although much of the information about the state of the blockchain can be obtained, as we've shown before,"
    const expectedChunks = [
      'Although much of the information about the state of the blockchain can be obtained, ',
      "as we've shown before,",
    ]
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'short-aside-recovery-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'zho_Hans',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === source) return '虽然我们可以获得大部分关于区块链状态的信息,'
          if (text === expectedChunks[0]) return '虽然我们可以获得大部分关于区块链的信息,'
          if (text === expectedChunks[1]) return '正如我们之前所示的,'
          return text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/queries.md', simplifiedChinese, provider)

    expect(batches).toContainEqual(expectedChunks)
    expect(expectedChunks.join('')).toBe(source)
    expect(translated).toContain('虽然我们可以获得大部分关于区块链的信息,正如我们之前所示的,')
  })

  test('recovers a dropped response predicate at a safe from-clause boundary', async () => {
    const source =
      'Queries are small instruction-like objects that, when sent to an Iroha peer, prompt a response with details from the current world state view.'
    const clarifiedSource =
      'Queries are small instruction-like objects that, when sent to an Iroha network peer, prompt a response with details from the current world state view.'
    const maskedSource = clarifiedSource.replace('Iroha', '[PH000000]')
    const balancedChunks = [
      'Queries are small instruction-like objects that, when sent to an [PH000000] network peer,',
      ' prompt a response with details from the current world state view.',
    ]
    const fromChunks = [' prompt a response with details ', 'from the current world state view.']
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'from-clause-recovery-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'zho_Hans',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === maskedSource) return '[PH000000] 查询是类似指令的小物体.'
          if (text === balancedChunks[0]) return '查询是类似指令的小物体,当发送给 [PH000000]同行时,'
          if (text === balancedChunks[1]) return '根据当前世界状况的细节,'
          if (text === fromChunks[0]) return '提示一个详细的答案'
          if (text === fromChunks[1]) return '从当前的世界状况观看.'
          return text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/queries.md', simplifiedChinese, provider)

    expect(batches).toContainEqual(balancedChunks)
    expect(batches).toContainEqual(fromChunks)
    expect(fromChunks.join('')).toBe(balancedChunks[1])
    expect(translated).toContain('提示一个详细的答案从当前的世界状况观看.')
  })

  test('recovers the Japanese consensus sentence at a safe so-clause boundary', async () => {
    const source =
      'It interleaves transactions by lane so one lane does not dominate the block just because its transactions were queued first.'
    const clarifiedSource =
      'It interleaves transactions by execution lane so one execution lane does not dominate the block just because its transactions were queued first.'
    const collapsed = ' लेनदेनが列に並ぶので,一列がブロックを支配しない.'
    const expectedChunks = [
      'It interleaves transactions by execution lane so ',
      'one execution lane does not dominate the block just because its transactions were queued first.',
    ]
    const recovered = [
      'レーンごとにトランザクションを交互に配置します',
      '最初にキューへ入ったという理由だけで一つのレーンがブロック全体を占有しないようにします。',
    ]
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'japanese-consensus-so-clause-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === clarifiedSource) return collapsed
          const chunkIndex = expectedChunks.indexOf(text)
          return chunkIndex >= 0 ? recovered[chunkIndex] : text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/consensus.md', japanese, provider)

    expect(batches).toContainEqual([clarifiedSource])
    expect(batches).toContainEqual(expectedChunks)
    expect(expectedChunks.join('')).toBe(clarifiedSource)
    expect(translated).not.toContain('लेनदेन')
    expect(translated).toContain(`${recovered[0]}。${recovered[1]}`)
  })

  test('recovers the exact Japanese peer-key condition at a safe if-clause boundary', async () => {
    const source =
      'Register and unregister peers. Generate the BLS key and PoP with `kagami` if you do not already have them:'
    const maskedSource =
      'Register and unregister network peers. Generate the [PH000002] key and [PH000001] with [PH000000] if you do not already have them:'
    const sentenceChunks = [
      'Register and unregister network peers. ',
      'Generate the [PH000002] key and [PH000001] with [PH000000] if you do not already have them:',
    ]
    const collapsedCondition = '[PH000002]キーと[PH000001]を [PH000000]で生成する.'
    const ifChunks = ['Generate the [PH000002] key and [PH000001] with [PH000000] ', 'if you do not already have them:']
    const recovered = ['[PH000002]キーと[PH000001]を [PH000000] で生成する', 'すでに持っていない場合:']
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'japanese-instructions-if-clause-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === maskedSource) return collapsedCondition
          if (text === sentenceChunks[0]) return '同級生を登録し,非登録する'
          if (text === sentenceChunks[1]) return collapsedCondition
          const ifIndex = ifChunks.indexOf(text)
          return ifIndex >= 0 ? recovered[ifIndex] : text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/instructions.md', japanese, provider)

    expect(batches).toContainEqual(sentenceChunks)
    expect(batches).toContainEqual(ifChunks)
    expect(ifChunks.join('')).toBe(sentenceChunks[1])
    expect(translated).toContain('BLS')
    expect(translated).toContain('PoP')
    expect(translated).toContain('kagami')
    expect(translated).toContain(recovered[1])
  })

  test('does not split an if-clause with a short side', async () => {
    const source =
      'Generate every deterministic validator recovery artifact and preserve required operational records before deployment if needed:'
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'short-if-side-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map(() => '短い')
      },
    }

    await expect(translateDocument(`${source}\n`, 'guide/short-if.md', japanese, provider)).rejects.toThrow(
      'no smaller safe boundary',
    )
    expect(batches).toEqual([[source], [source]])
  })

  test('recovers the exact Japanese production-capacity omission at a safe for-clause boundary', async () => {
    const source =
      'Public `iroha3d` metrics are useful for learning the signal names. Do not use them as production capacity numbers for your own deployment.'
    const maskedSource =
      'Public [PH000000] metrics are useful for learning the signal names. Do not use them as production capacity numbers for your own deployment.'
    const sentenceChunks = [
      'Public [PH000000] metrics are useful for learning the signal names. ',
      'Do not use them as production capacity numbers for your own deployment.',
    ]
    const forChunks = ['Do not use them as production capacity numbers ', 'for your own deployment.']
    const sentenceTranslations = [
      '公共の [PH000000] メトリックは信号名を学ぶのに役立ちます. ',
      '生産能力番号として使わないで',
    ]
    const recovered = ['生産能力番号として使わないでください', '自分の部署のために']
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'japanese-metrics-for-clause-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === maskedSource) return '公共の [PH000000] メトリックは信号名を知るために有用です.'
          const sentenceIndex = sentenceChunks.indexOf(text)
          if (sentenceIndex >= 0) return sentenceTranslations[sentenceIndex]
          const forIndex = forChunks.indexOf(text)
          return forIndex >= 0 ? recovered[forIndex] : text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'guide/advanced/metrics.md', japanese, provider)

    expect(batches).toContainEqual(sentenceChunks)
    expect(batches).toContainEqual(forChunks)
    expect(forChunks.join('')).toBe(sentenceChunks[1])
    expect(translated).toContain('`iroha3d`')
    expect(translated).toContain(recovered[1])
  })

  test('does not split a for-clause with a short side', async () => {
    const source =
      'Do not use deterministic benchmark results or public reference metrics as production capacity numbers for deployment.'
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'short-for-side-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map(() => '短い')
      },
    }

    await expect(translateDocument(`${source}\n`, 'guide/short-for.md', japanese, provider)).rejects.toThrow(
      'no smaller safe boundary',
    )
    expect(batches).toEqual([[source], [source]])
  })

  test('rejects marker substitution in a for-clause recovery', async () => {
    const source =
      'Public metrics help operators learn signal names. Do not use `iroha3d` benchmark results as production capacity numbers for your own deployment.'
    const maskedSource = protectMarkdown(source, japanese, 'identifier').masked
    const sentenceChunks = Array.from(
      new Intl.Segmenter('en', { granularity: 'sentence' }).segment(maskedSource),
      ({ segment }) => segment,
    )
    const failingSentence = sentenceChunks[1]
    const forIndex = failingSentence.indexOf('for ')
    const forChunks = [failingSentence.slice(0, forIndex), failingSentence.slice(forIndex)]
    const marker = failingSentence.match(/\[PH\d{6}\]/u)?.[0]
    expect(marker).toBeDefined()
    const collapsed = `${marker} 短い.`
    const provider: TranslationProvider = {
      engine: 'for-clause-marker-integrity-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) =>
        texts.map((text) => {
          if (text === maskedSource || text === failingSentence) return collapsed
          if (text === forChunks[0]) return text.replace(marker!, '[PH999999]')
          return text
        }),
    }

    await expect(translateDocument(`${source}\n`, 'guide/advanced/metrics.md', japanese, provider)).rejects.toThrow(
      'output changed protected markers',
    )
    expect(forChunks.join('')).toBe(failingSentence)
  })

  test('allows intact protected markers to reorder during translation', () => {
    expect(
      hasExactProtectedMarkerMultiset(
        '[PH000002] key and [PH000001] with [PH000000]',
        '[PH000000] で [PH000002] と [PH000001]',
      ),
    ).toBe(true)
  })

  test.each([
    ['loss', '[PH000000] and [PH000001]', '[PH000000]'],
    ['duplication', '[PH000000] and [PH000001]', '[PH000000] [PH000001] [PH000001]'],
    ['substitution', '[PH000000] and [PH000001]', '[PH000000] [PH999999]'],
  ])('rejects protected marker %s', (_case, source, translated) => {
    expect(hasExactProtectedMarkerMultiset(source, translated)).toBe(false)
  })

  test('recovers the Kazakh FastPQ AIR marker without dropping the final fold lead-in', async () => {
    const source =
      'FRI commits to AIR composition evaluations. For each round `l`, the transcript samples a challenge `beta_l`. The layer is padded to a multiple of the arity by repeating the last value. Each arity-sized group folds to:'
    const maskedSource =
      '[PH000002] cryptographically binds to [PH000003] composition evaluations. For each round [PH000000], the transcript samples a challenge [PH000001]. The layer is padded to a multiple of the arity by repeating the last value. Each arity-sized group folds to:'
    const sentenceChunks = [
      '[PH000002] cryptographically binds to [PH000003] composition evaluations. ',
      'For each round [PH000000], the transcript samples a challenge [PH000001]. ',
      'The layer is padded to a multiple of the arity by repeating the last value. ',
      'Each arity-sized group folds to:',
    ]
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'kazakh-fastpq-marker-recovery-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'kaz_Cyrl',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === maskedSource) return '[PH000002] [PH000003]. [PH000000] [PH000001].'
          if (text === sentenceChunks[0]) {
            return '[PH000002] [PH000003] құрамының бағалауларын криптографиялық түрде байланыстырады. '
          }
          if (text === sentenceChunks[1]) {
            return 'Әрбір [PH000000] раунды үшін транскрипт [PH000001] сынағын таңдайды. '
          }
          if (text === sentenceChunks[2]) {
            return 'Қабат соңғы мәнді қайталау арқылы арлық еселікке толтырылады. '
          }
          if (text === sentenceChunks[3]) return 'Әр арлық өлшемді топ мынаған бүктеледі:'
          return text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/fastpq.md', kazakh, provider)

    expect(batches).toContainEqual(sentenceChunks)
    expect(translated).toContain('FRI AIR құрамының бағалауларын криптографиялық түрде байланыстырады.')
    expect(translated).toContain('`l` раунды үшін')
    expect(translated).toContain('`beta_l` сынағын')
    expect(translated).toContain('Әр арлық өлшемді топ мынаған бүктеледі:')
  })

  test('accepts the exact short FastPQ structural lead-in after sentence retry', async () => {
    const source =
      'Transparent numeric transfers create a structured transfer transcript when the instruction mutates balances. The transcript records:'
    const sentenceChunks = [
      'Transparent numeric transfers create a structured transfer transcript when the instruction mutates balances. ',
      'The transcript records:',
    ]
    const recovered = [
      '命令が残高を変更すると、透明な数値転送は構造化された転送トランスクリプトを作成します。',
      '記録は:',
    ]
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'japanese-fastpq-structural-lead-in-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === source) return recovered[0]
          const chunkIndex = sentenceChunks.indexOf(text)
          return chunkIndex >= 0 ? recovered[chunkIndex] : text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/fastpq.md', japanese, provider)

    expect(batches).toContainEqual(sentenceChunks)
    expect(sentenceChunks.join('')).toBe(source)
    expect(translated).toContain(recovered.join(''))
  })

  test('recovers the exact FastPQ metadata list by splitting only its colon clause', async () => {
    const source =
      'and a metadata row binding the authorization policy. The `compliance` claim inserts two metadata rows: one for policy and one for target dataspaces.'
    const maskedSource = source.replace('`compliance`', '[PH000000]')
    const sentenceChunks = [
      'and a metadata row binding the authorization policy. ',
      'The [PH000000] claim inserts two metadata rows: one for policy and one for target dataspaces.',
    ]
    const sentenceTranslations = ['許可政策を拘束するメタデータ行.', '[PH000000]請求は2つのメタデータ行を挿入します.']
    const clauseChunks = [
      'The [PH000000] claim inserts two metadata rows: ',
      'one for policy and one for target dataspaces.',
    ]
    const clauseTranslations = [
      '[PH000000]請求書には,2つのメタデータ行が挿入されます. ',
      '1つは政策と1つはターゲットデータパースです',
    ]
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'japanese-fastpq-metadata-clause-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === maskedSource) {
            return sentenceTranslations[1]
          }
          const sentenceIndex = sentenceChunks.indexOf(text)
          if (sentenceIndex >= 0) return sentenceTranslations[sentenceIndex]
          const clauseIndex = clauseChunks.indexOf(text)
          return clauseIndex >= 0 ? clauseTranslations[clauseIndex] : text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/fastpq.md', japanese, provider)

    expect(batches).toContainEqual(sentenceChunks)
    expect(batches).toContainEqual(clauseChunks)
    expect(clauseChunks.join('')).toBe(sentenceChunks[1])
    expect(batches).not.toContainEqual([sentenceChunks[0]])
    expect(translated).toContain(sentenceTranslations[0])
    expect(translated).toContain('`compliance`請求書には')
    expect(translated).toContain(clauseTranslations[1])
  })

  test('rejects an incomplete sentence retry when no safe clause boundary exists', async () => {
    const sentenceChunks = [
      'This sentence describes deterministic validation for every complete proposal. ',
      'Another sentence preserves recovery guidance for validators.',
    ]
    const source = sentenceChunks.join('')
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'no-safe-second-stage-boundary-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === source) return '短い出力'
          if (text === sentenceChunks[0]) return 'あ'.repeat(18)
          if (text === sentenceChunks[1]) return 'い'.repeat(16)
          return text
        })
      },
    }

    await expect(translateDocument(`${source}\n`, 'guide/no-safe-boundary.md', japanese, provider)).rejects.toThrow(
      'sentence-level retry output has incomplete sentence coverage',
    )
    expect(batches).toContainEqual(sentenceChunks)
    expect(batches).toHaveLength(2)
  })

  test('accepts the exact compact Japanese data-model label only as a Markdown table cell', async () => {
    const source = ' Registration and transfer instructions '
    const recovered = '登録と転送の指示'
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'japanese-compact-table-label-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => (text === source ? (batches.length === 1 ? '登録指示' : recovered) : text))
      },
    }

    const translated = await translateDocument(`|${source}|\n`, 'blockchain/data-model.md', japanese, provider)

    expect(batches).toEqual([[source], [source]])
    expect(translated).toContain(`|${recovered}|`)
  })

  test('accepts the exact four-letter Japanese production-equivalent table label', async () => {
    const source = ' Production equivalent '
    const translated = await translateDocument(`|${source}|\n`, 'get-started/sora-nexus-dataspaces.md', japanese, {
      engine: 'japanese-four-letter-table-label-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => texts.map((text) => (text === source ? '生産等価' : text)),
    })

    expect(translated).toContain('|生産等価|')
  })

  test('accepts a complete compact Simplified Chinese table label', async () => {
    const source = ' Ledger representation '
    const clarifiedSource = ' blockchain ledger representation '
    const translated = await translateDocument(
      `|${source}|\n`,
      'blockchain/anonymous-transactions.md',
      simplifiedChinese,
      {
        engine: 'simplified-chinese-compact-table-label-test',
        protectedMarkdownMode: 'inline-identifiers',
        languageCode: () => 'zho_Hans',
        translate: async () => {
          throw new Error('inline translation must use the batch method')
        },
        translateBatch: async (texts) => texts.map((text) => (text === clarifiedSource ? '区块链账本表示' : text)),
      },
    )

    expect(translated).toContain('|区块链账本表示|')
  })

  test('accepts a complete longer Simplified Chinese table label', async () => {
    const source = ' Release authority, or destination when no release authority is set '
    const translated = '没有设置的释放权限或目的地'

    expect(isCompleteCompactCjkTableLabel(source, translated, simplifiedChinese, { markdownTableCell: true })).toBe(
      true,
    )
    expect(
      isCompleteCompactCjkTableLabel(source, '释放权限或目的地', simplifiedChinese, {
        markdownTableCell: true,
      }),
    ).toBe(false)
  })

  test('accepts a complete five-letter Simplified Chinese table label', () => {
    expect(
      isCompleteCompactCjkTableLabel(' transfer numeric quantity ', '转移数量量', simplifiedChinese, {
        markdownTableCell: true,
      }),
    ).toBe(true)
    expect(
      isCompleteCompactCjkTableLabel(' transfer numeric quantity ', '转移数量', simplifiedChinese, {
        markdownTableCell: true,
      }),
    ).toBe(false)
  })

  test('accepts a complete compact two-clause Simplified Chinese table label', () => {
    const source = ' mint/burn numeric quantity, transfer numeric quantity '
    const context = { markdownTableCell: true }

    expect(isCompleteCompactCjkTableLabel(source, '硬币/烧伤数量,转移数量', simplifiedChinese, context)).toBe(true)
    expect(isCompleteCompactCjkTableLabel(source, '硬币/烧伤数量', simplifiedChinese, context)).toBe(false)
    expect(isCompleteCompactCjkTableLabel(source, '硬币/烧伤数量,转移', simplifiedChinese, context)).toBe(false)
  })

  test('accepts a complete long Simplified Chinese table sentence', () => {
    const source =
      ' The outer hidden-function abstraction: program policies, commitments, execution receipts, and receipt verification mode. '
    const translated = '外部隐藏函数抽象:程序政策,承诺,执行收据和收据验证模式.'
    const context = { markdownTableCell: true }

    expect(isCompleteCompactCjkTableSentence(source, translated, simplifiedChinese, context)).toBe(true)
    expect(
      isCompleteCompactCjkTableSentence(source, '外部隐藏函数抽象和收据验证模式.', simplifiedChinese, context),
    ).toBe(false)
    expect(
      isCompleteCompactCjkTableSentence(source, translated, simplifiedChinese, {
        markdownTableCell: false,
      }),
    ).toBe(false)
  })

  test('accepts a complete compact Simplified Chinese sentence', () => {
    const source = 'Treat off-chain payment verification as application policy.'
    const translated = '视支付链外验证为应用政策.'

    expect(isCompleteCompactCjkSentence(source, translated, simplifiedChinese)).toBe(true)
    expect(isCompleteCompactCjkSentence(source, '视支付验证为政策.', simplifiedChinese)).toBe(false)
    expect(isCompleteCompactCjkSentence(source, '视支付链外验证为应用政策,', simplifiedChinese)).toBe(false)
    expect(
      isCompleteCompactCjkSentence(
        'Treat off-chain payment verification as application policy for every deployed escrow integration.',
        translated,
        simplifiedChinese,
      ),
    ).toBe(false)
    expect(
      isCompleteCompactCjkSentence(
        'Treat [PH000000] payment verification as application policy.',
        '视支付链外验证为应用政策.',
        simplifiedChinese,
      ),
    ).toBe(false)
  })

  test('accepts a complete longer compact Simplified Chinese sentence', () => {
    const source = 'outside the authority granted to them unless explicitly granted the relevant permission.'

    expect(isCompleteCompactCjkSentence(source, '在授予他们权限之外,除非明确授予相关许可.', simplifiedChinese)).toBe(
      true,
    )
    expect(isCompleteCompactCjkSentence(source, '除非明确授予相关许可.', simplifiedChinese)).toBe(false)
  })

  test('accepts a complete ideographically compressed sentence without accepting a dropped sentence', () => {
    const source = 'Length and unpredictability matter more than decorative substitutions.'
    const translated = '长度和不可预测性比装饰品更重要.'

    expect(isCompleteCompactCjkSentence(source, translated, simplifiedChinese)).toBe(true)
    expect(isCompleteCompactCjkSentence(source, '长度和不可预测性.', simplifiedChinese)).toBe(false)
    expect(
      isCompleteCompactCjkSentence(
        `${source} Adding one symbol to a predictable word does not make the result safe.`,
        translated,
        simplifiedChinese,
      ),
    ).toBe(false)
  })

  test('accepts a complete ten-letter deterministic-network sentence', () => {
    const source = 'Preserve the deterministic behavior of the network.'

    expect(isCompleteCompactCjkSentence(source, '保持网络的决定性行为.', simplifiedChinese)).toBe(true)
    expect(isCompleteCompactCjkSentence(source, '保持网络行为.', simplifiedChinese)).toBe(false)
    expect(
      isCompleteCompactCjkSentence(
        `${source} Hardware acceleration must not change peer-visible results.`,
        '维护网络的确定性行为.硬件加速不应改变可见结果.',
        simplifiedChinese,
      ),
    ).toBe(false)
  })

  test('accepts a compact CJK retry after every sentence chunk passes', async () => {
    const first = 'Preserve the deterministic behavior of the network.'
    const second = 'Hardware acceleration must not change peer-visible results.'
    const source = `${first} ${second}`
    const translated = await translateDocument(
      `${source}\n`,
      'guide/security/security-principles.md',
      simplifiedChinese,
      {
        engine: 'complete-cjk-sentence-retry-test',
        protectedMarkdownMode: 'inline-identifiers',
        languageCode: () => 'zho_Hans',
        translate: async () => {
          throw new Error('inline translation must use the batch method')
        },
        translateBatch: async (texts) =>
          texts.map((text) => {
            const normalized = text.trim()
            if (normalized === first) return '保持网络的决定性行为.'
            if (normalized === second) return '硬件加速不能改变可见的结果.'
            if (normalized === source) return '维护网络的确定性行为.硬件加速不应改变可见结果.'
            return text
          }),
      },
    )

    expect(translated).toContain('保持网络的决定性行为.硬件加速不能改变可见的结果.')
  })

  test('accepts a compact CJK retry after every evidence-list clause passes', async () => {
    const source =
      'Preserve relevant logs, ledger references, configuration snapshots, and transaction hashes with reliable timestamps.'
    const clarifiedSource =
      'Preserve relevant logs, blockchain ledger references, configuration point-in-time data views, and transaction cryptographic hashes with reliable timestamps.'
    const translated = await translateDocument(
      `${source}\n`,
      'guide/security/security-principles.md',
      simplifiedChinese,
      {
        engine: 'complete-cjk-clause-retry-test',
        protectedMarkdownMode: 'inline-identifiers',
        languageCode: () => 'zho_Hans',
        translate: async () => {
          throw new Error('inline translation must use the batch method')
        },
        translateBatch: async (texts) =>
          texts.map((text) => {
            switch (text.trim()) {
              case clarifiedSource:
                return '保存相关日志,账本参考,配置快照和可靠的时刻标记.'
              case 'Preserve relevant logs,':
                return '保存相关日志,'
              case 'blockchain ledger references,':
                return '账本引用,'
              case 'configuration point-in-time data views,':
                return '配置状态快照,'
              case 'and transaction cryptographic hashes with reliable timestamps.':
                return '和可靠的时间标签的交易哈希.'
              default:
                return text
                  .replace('Preserve relevant logs,', '保存相关日志,')
                  .replace('blockchain ledger references,', '账本引用,')
                  .replace('configuration point-in-time data views,', '配置状态快照,')
                  .replace('configuration ', '配置')
                  .replace('point-in-time data views,', '状态快照,')
                  .replace(
                    'and transaction cryptographic hashes with reliable timestamps.',
                    '和带有可靠时间标签的交易哈希.',
                  )
            }
          }),
      },
    )

    expect(translated).toContain('保存相关日志,账本引用,配置状态快照,和可靠的时间标签的交易哈希.')
  })

  test('recovers adjacent short CJK inventory clauses separately', async () => {
    const source =
      'Keep trusted release artifacts, configuration, genesis records, and inventories available during an incident.'
    const clarifiedSource =
      'Keep trusted release artifacts, configuration, blockchain genesis records, and inventories available during an incident.'
    const translated = await translateDocument(
      `${source}\n`,
      'guide/security/security-principles.md',
      simplifiedChinese,
      {
        engine: 'short-cjk-clause-retry-test',
        protectedMarkdownMode: 'inline-identifiers',
        languageCode: () => 'zho_Hans',
        translate: async () => {
          throw new Error('inline translation must use the batch method')
        },
        translateBatch: async (texts) =>
          texts.map((text) => {
            switch (text.trim()) {
              case clarifiedSource:
                return '在事件期间,保持可信的发布工件,配置,创世记录和库存.'
              case 'Keep trusted release artifacts,':
                return '保持可信的发布工件,'
              case 'configuration, blockchain genesis records,':
                return '创世记录,'
              case 'configuration,':
                return '配置,'
              case 'blockchain genesis records,':
                return '创世记录,'
              case 'and inventories available during an incident.':
                return '并在事件期间保持库存可用.'
              default:
                return text
            }
          }),
      },
    )

    expect(translated).toContain('保持可信的发布工件,配置,创世记录,并在事件期间保持库存可用.')
  })

  test('accepts a complete eleven-letter Simplified Chinese sentence', () => {
    const source = 'Registering a policy on-chain is not enough by itself.'

    expect(isCompleteCompactCjkSentence(source, '在链上注册保险本身不够.', simplifiedChinese)).toBe(true)
    expect(isCompleteCompactCjkSentence(source, '链上注册本身不够.', simplifiedChinese)).toBe(false)
  })

  test('accepts a complete compact coordinated Simplified Chinese sentence', () => {
    const source = 'deployment, and recovery authorities.'

    expect(isCompleteCompactCjkSentence(source, '部署和恢复当局.', simplifiedChinese)).toBe(true)
    expect(isCompleteCompactCjkSentence(source, '恢复当局.', simplifiedChinese)).toBe(false)
    expect(isCompleteCompactCjkSentence(source, '部署和恢复.', simplifiedChinese)).toBe(false)
  })

  test('accepts a complete compact Simplified Chinese retry phrase', () => {
    expect(isCompleteCompactCjkRetryPhrase('and decompressed bytes', '和解压字节', simplifiedChinese)).toBe(true)
    expect(isCompleteCompactCjkRetryPhrase('and decompressed bytes', '解压字节', simplifiedChinese)).toBe(false)
    expect(isCompleteCompactCjkRetryPhrase('and decompressed bytes,', '和解压字节,', simplifiedChinese)).toBe(false)
  })

  test('accepts a complete compact Simplified Chinese retry clause', () => {
    expect(isCompleteCompactCjkRetryClause('configuration snapshots, ', '配置快照,', simplifiedChinese)).toBe(true)
    expect(isCompleteCompactCjkRetryClause('configuration snapshots, ', '配置,', simplifiedChinese)).toBe(false)
    expect(isCompleteCompactCjkRetryClause('configuration, ', '配置,', simplifiedChinese)).toBe(true)
    expect(isCompleteCompactCjkRetryClause('configuration, ', '配,', simplifiedChinese)).toBe(false)
    expect(isCompleteCompactCjkRetryClause('configuration snapshots.', '配置快照.', simplifiedChinese)).toBe(false)
  })

  test('accepts a complete compact Simplified Chinese retry list tail', () => {
    const source = 'and inventories available during an incident.'

    expect(isCompleteCompactCjkRetryListTail(source, '在事件中可用的库存.', simplifiedChinese)).toBe(true)
    expect(isCompleteCompactCjkRetryListTail(source, '事件库存.', simplifiedChinese)).toBe(false)
    expect(
      isCompleteCompactCjkRetryListTail(
        'inventories available during an incident.',
        '在事件中可用的库存.',
        simplifiedChinese,
      ),
    ).toBe(false)
  })

  test.each([
    ['prose context', ' Registration and transfer instructions ', '登録と転送の指示', { markdownTableCell: false }],
    [
      'source above 80 letters',
      ' Registration, deregistration, transfer, authorization, custody, and settlement instruction descriptions ',
      '登録と登録解除と転送の指示の説明',
      { markdownTableCell: true },
    ],
    ['target below four letters', ' Production equivalent ', '生産等', { markdownTableCell: true }],
    ['more than two source words', ' Production use equivalent ', '生産等価', { markdownTableCell: true }],
    ['two-word source above 24 letters', ' Production interoperability ', '生産等価', { markdownTableCell: true }],
    [
      'continuation punctuation',
      ' Registration and transfer instructions ',
      '登録と転送の指示、',
      { markdownTableCell: true },
    ],
    [
      'marker loss',
      ' [PH000000] Registration and transfer instructions ',
      '登録と転送の指示',
      { markdownTableCell: true },
    ],
    ['identifier loss', ' Iroha registration and transfer guide ', '登録と転送のガイド', { markdownTableCell: true }],
  ])('rejects a compact CJK table label with %s', (_case, source, translated, context) => {
    expect(isCompleteCompactCjkTableLabel(source, translated, japanese, context)).toBe(false)
  })

  test.each([
    ['empty target', 'The transcript records:', ''],
    ['too-short target', 'The transcript records:', '記録:'],
    ['missing target colon', 'The transcript records:', '記録は'],
    [
      'source above the short lead-in cap',
      'The transfer transcript records every authorization policy metadata field:',
      '記録内容は:',
    ],
    ['changed protected marker', 'The [PH000000] transcript records:', '[PH000001] 記録内容は:'],
  ])('rejects a short structural lead-in with %s', (_case, source, translated) => {
    expect(isCompleteShortStructuralLeadIn(source, translated)).toBe(false)
  })

  test('accepts a complete longer compact structural lead-in', () => {
    expect(
      isCompleteShortStructuralLeadIn('First, the secret is committed separately:', '首先,秘密是单独承诺的:'),
    ).toBe(true)
    expect(isCompleteShortStructuralLeadIn('First, the secret is committed separately:', '秘密:')).toBe(false)
  })

  test('validates each sentence retry and recovers the omitted expressions clause', async () => {
    const source =
      'Recall that you can combine this with queries, and as such can program the blockchain to do some amazing stuff. This is what we refer to as _smart contracts_, the defining feature of the advanced usage of blockchain technology.'
    const normalizedSource = source.replaceAll('_', '')
    const sentenceChunks = [
      'Recall that you can combine this with queries, and as such can program the blockchain to do some amazing stuff. ',
      'This is what we refer to as smart contracts, the defining feature of the advanced usage of blockchain technology.',
    ]
    const clauseChunks = [
      'Recall that you can combine this with queries, ',
      'and as such can program the blockchain to do some amazing stuff. ',
    ]
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'expressions-clause-coverage-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'zho_Hans',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === normalizedSource) {
            return '记住,你可以将这与查询结合起来,因此可以编程区块链来做一些惊人的事情.这是我们称之为智能合同的东西,'
          }
          if (text === sentenceChunks[0]) return '请记住,你可以将这些与查询结合起来,'
          if (text === sentenceChunks[1]) {
            return '这就是我们所谓的智能合同, 区块链技术的先进使用的定义特征.'
          }
          if (text === clauseChunks[0]) return '记住,你可以将这结合到询问.'
          if (text === clauseChunks[1]) return '因此,可以编程区块链来做一些惊人的东西.'
          return text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/expressions.md', simplifiedChinese, provider)

    expect(batches).toContainEqual([normalizedSource])
    expect(batches).toContainEqual(sentenceChunks)
    expect(batches).toContainEqual(clauseChunks)
    expect(sentenceChunks.join('')).toBe(normalizedSource)
    expect(clauseChunks.join('')).toBe(sentenceChunks[0])
    expect(translated).toContain('记住,你可以将这结合到询问.')
    expect(translated).toContain('因此,可以编程区块链来做一些惊人的东西.')
    expect(translated).toContain('这就是我们所谓的智能合同')
  })

  test('does not let a verbose sibling translation hide an omitted retry clause', async () => {
    const source =
      'Recall that you can combine this with queries, and as such can program the blockchain to do some amazing stuff. This is what we refer to as smart contracts, the defining feature of the advanced usage of blockchain technology.'
    const sentenceChunks = [
      'Recall that you can combine this with queries, and as such can program the blockchain to do some amazing stuff. ',
      'This is what we refer to as smart contracts, the defining feature of the advanced usage of blockchain technology.',
    ]
    const clauseChunks = [
      'Recall that you can combine this with queries, ',
      'and as such can program the blockchain to do some amazing stuff. ',
    ]
    const verboseSibling =
      '这是一段刻意很长的第二句翻译,它足以让整段输出的总长度检查通过,但不应该掩盖第一句中被遗漏的长分句.'
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'independent-retry-coverage-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'zho_Hans',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === source) return '整个段落在这里被截断,'
          if (text === sentenceChunks[0]) return '只保留了第一个短语,'
          if (text === sentenceChunks[1]) return verboseSibling.repeat(2)
          if (text === clauseChunks[0]) return '已恢复关于查询组合的第一个完整分句，'
          if (text === clauseChunks[1]) return '已恢复对区块链进行编程的第二个完整分句。'
          return text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/expressions.md', simplifiedChinese, provider)

    expect(batches).toContainEqual(sentenceChunks)
    expect(batches).toContainEqual(clauseChunks)
    expect(translated).toContain('已恢复关于查询组合的第一个完整分句')
    expect(translated).toContain('已恢复对区块链进行编程的第二个完整分句')
    expect(translated).toContain(verboseSibling)
  })

  test('retries a dropped sentence above the absolute floor but below the locale coverage gate', async () => {
    const sentenceChunks = [
      'The first sentence explains how validators inspect the complete proposal before accepting deterministic state changes. ',
      'The second sentence preserves the independent recovery guidance needed when one payload arrives late.',
    ]
    const source = sentenceChunks.join('')
    const countLetters = (content: string): number => [...content.matchAll(/\p{L}/gu)].length
    const collapsed = `${'ა'.repeat(Math.ceil(countLetters(source) * 0.6))}.`
    const recovered = sentenceChunks.map(
      (sentence, index) => `${index === 0 ? 'ბ' : 'გ'}${'ა'.repeat(countLetters(sentence) - 1)}.`,
    )
    const batches: string[][] = []
    const provider: TranslationProvider = {
      engine: 'sentence-coverage-generation-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'kat_Geor',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => {
        batches.push([...texts])
        return texts.map((text) => {
          if (text === source) return collapsed
          const sentenceIndex = sentenceChunks.indexOf(text)
          return sentenceIndex >= 0 ? recovered[sentenceIndex] : text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'guide/sentence-coverage.md', georgian, provider)

    expect(countLetters(collapsed) / countLetters(source)).toBeGreaterThan(0.5)
    expect(countLetters(collapsed) / countLetters(source)).toBeLessThan(0.75)
    expect(batches).toContainEqual(sentenceChunks)
    expect(translated).toContain(recovered[0])
    expect(translated).toContain(recovered[1])
  })

  test('rejects an exact absolute-floor ratio inclusively during generation', async () => {
    const source = `${'a'.repeat(80)}.`
    const provider: TranslationProvider = {
      engine: 'inclusive-floor-generation-test',
      protectedMarkdownMode: 'inline-identifiers',
      languageCode: () => 'jpn_Jpan',
      translate: async () => {
        throw new Error('inline translation must use the batch method')
      },
      translateBatch: async (texts) => texts.map(() => `${'あ'.repeat(20)}。`),
    }

    await expect(translateDocument(`${source}\n`, 'guide/inclusive-floor.md', japanese, provider)).rejects.toThrow(
      `prose unit 1 (${JSON.stringify(source)}): output is materially short (0.25 of source letters); sentence-level retry output is materially short (0.25 of source letters)`,
    )
  })

  test('restores code, technical names, links, and Markdown delimiters', () => {
    const source =
      '# Install Iroha\n\nUse **Norito** with [`iroha_cli`](/reference/iroha3d-cli), [instructions](/blockchain/instructions.md), and https://example.com.\n'
    const protectedMarkdown = protectMarkdown(source, french)
    const translated = protectedMarkdown.masked
      .replace(/<span\b[^>]*>(\d+)<\/span>/gu, '$1')
      .replace('Install', 'Installer')
      .replace('Use', 'Utilisez')
      .replace('with', 'avec')
    expect(protectedMarkdown.restore(translated)).toBe(
      '# Installer Iroha\n\nUtilisez **Norito** avec [`iroha_cli`](/fr/reference/iroha3d-cli), [instructions](/fr/blockchain/instructions.md), and https://example.com.\n',
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

  test('protects inline LaTeX that contains ordinary nested parentheses', () => {
    const source = 'Store \\(R_{\\mathrm{dst}} \\leftarrow \\operatorname{Enc}(a)\\) in the destination register.\n'
    const protectedMarkdown = protectMarkdown(source, french, 'identifier')

    expect(protectedMarkdown.masked).not.toContain('\\operatorname')
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
    expect(providerInputs[0]).toContain('creates a single protocol-standard')
    expect(providerInputs[0]).not.toContain('[^1]:')
    expect(translated).toContain(
      '[^1]: `Register<Account>` creates a single protocol-standard `AccountId`; domain aliases are managed separately.\n',
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
  test('keeps protected markers out of Google Translate requests', () => {
    expect(new GoogleTranslationProvider().protectedMarkdownMode).toBe('fragments')
  })

  test('bounds concurrent Google Translate fragment requests', async () => {
    class CountingGoogleProvider extends GoogleTranslationProvider {
      active = 0
      maximumActive = 0

      override async translate(text: string): Promise<string> {
        this.active += 1
        this.maximumActive = Math.max(this.maximumActive, this.active)
        await new Promise((resolve) => setTimeout(resolve, 5))
        this.active -= 1
        return text
      }
    }

    const provider = new CountingGoogleProvider()
    await expect(provider.translateBatch(['one', 'two', 'three', 'four'], 'mn')).resolves.toEqual([
      'one',
      'two',
      'three',
      'four',
    ])
    expect(provider.maximumActive).toBe(1)
  })

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
nexusPortal:
  primaryAction:
    text: Get Started
    link: /get-started/sora-nexus-dataspaces
  secondaryAction:
    text: Guide
    link: /cookbook/
  recipes:
    title: Guide
    items:
      - title: Install
        link: /cookbook/connect-to-taira
features:
  - title: Get Started
    link: /get-started/
---
`
    const translated = await translateDocument(english, 'index.md', french, new MarkerAwareProvider())
    expect(translated).toContain('text: "Documentation traduite"')
    expect(translated).toContain('title: "Bien démarrer"')
    expect(translated).toContain('link: /fr/get-started/')
    expect(translated).toContain('link: /fr/get-started/sora-nexus-dataspaces')
    expect(translated).toContain('link: /fr/cookbook/')
    expect(translated).toContain('link: /fr/cookbook/connect-to-taira')
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

  test('synchronizes container keywords while preserving localized titles and prose', async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'iroha-docs-container-directives-'))
    await mkdir(path.join(temporaryRoot, 'guide'), { recursive: true })
    await mkdir(path.join(temporaryRoot, 'fr', 'guide'), { recursive: true })
    await writeFile(
      path.join(temporaryRoot, 'guide', 'index.md'),
      '# Guide\n\n::: warning\n\nKeep secrets safe.\n\n:::\n\n::: info Note\n\nCurrent source.\n\n:::\n',
    )
    await writeFile(
      path.join(temporaryRoot, 'fr', 'guide', 'index.md'),
      '---\ntranslation_locale: fr\n---\n# Guide {#guide}\n\n::: avertissement\n\nGardez les secrets.\n\n:::\n\n::: information Remarque\n\nSource actuelle.\n\n:::\n',
    )

    try {
      await synchronizeTranslationMarkdownStructure({
        sourceRoot: temporaryRoot,
        locales: [french],
        routes: ['guide/index.md'],
      })
      const synchronized = await readFile(path.join(temporaryRoot, 'fr', 'guide', 'index.md'), 'utf8')
      expect(synchronized).toContain('::: warning\n\nGardez les secrets.')
      expect(synchronized).toContain('::: info Remarque\n\nSource actuelle.')
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true })
    }
  })

  test('synchronizes only reviewed prose without retranslating surrounding content', async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'iroha-docs-reviewed-translations-'))
    await mkdir(path.join(temporaryRoot, 'uz'), { recursive: true })
    await writeFile(
      path.join(temporaryRoot, 'index.md'),
      '# Algebra table\n\nUnreviewed source text.\n\n| Instruction | Algebra |\n| --- | --- |\n| Add | Ring addition |\n',
    )
    const existing =
      '---\ntranslation_locale: uz\n---\n# Algebra jadvali {#algebra-table}\n\nO‘zgarmas mavjud tarjima.\n\n| Eski sarlavha | Кирилл |\n| --- | --- |\n| Qo‘shish | Halqa qo‘shish |\n'
    await writeFile(path.join(temporaryRoot, 'uz', 'index.md'), existing)

    try {
      await synchronizeReviewedTranslations({
        sourceRoot: temporaryRoot,
        locales: [uzbek],
        routes: ['/index.md'],
      })
      const synchronized = await readFile(path.join(temporaryRoot, 'uz', 'index.md'), 'utf8')
      expect(synchronized).toContain('O‘zgarmas mavjud tarjima.')
      expect(synchronized).toContain('| Ko‘rsatma | Algebra |')
      expect(synchronized).toContain('| Qo‘shish | Halqa qo‘shish |')
      expect(synchronized).not.toContain('Кирилл')
      expect(() => parseTranslationCli(['--sync-reviewed', '--sync-structure'])).toThrow('mutually exclusive')
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true })
    }
  })

  test('normalizes existing source-aligned prose without calling a translation provider', async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'iroha-docs-normalize-translations-'))
    await mkdir(path.join(temporaryRoot, 'am', 'guide'), { recursive: true })
    await mkdir(path.join(temporaryRoot, 'guide'), { recursive: true })
    await writeFile(path.join(temporaryRoot, 'guide', 'index.md'), '# Terms\n\nThe token consumes an artifact.\n')
    await writeFile(
      path.join(temporaryRoot, 'am', 'guide', 'index.md'),
      '---\ntranslation_locale: am\n---\n# ተክኒካዊ ቃላት {#terms}\n\nማስመሰያው ቅርስን ይበላል።\n',
    )

    try {
      await normalizeExistingTranslations({
        sourceRoot: temporaryRoot,
        locales: [amharic],
        routes: ['/guide/index.md'],
      })
      const normalized = await readFile(path.join(temporaryRoot, 'am', 'guide', 'index.md'), 'utf8')
      expect(normalized).toContain('ቶከኑ አርቲፋክትን ይጠቀማል።')
      expect(normalized).toContain('# ተክኒካዊ ቃላት {#terms}')
      expect(() => parseTranslationCli(['--normalize-existing', '--sync-reviewed'])).toThrow('mutually exclusive')
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true })
    }
  })

  test('retries a complete Bing document after generated-script validation fails', async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'iroha-docs-bing-document-retry-'))
    await writeFile(path.join(temporaryRoot, 'guide.md'), '# Guide\n\nCurrent source text.\n')
    let batches = 0
    const provider: TranslationProvider = {
      engine: 'bing-translator-llm',
      protectedMarkdownMode: 'inline-identifiers',
      clarifyTechnicalTerms: false,
      languageCode: () => 'fr',
      translate: async (text) => text,
      translateBatch: async (texts) => {
        batches += 1
        return texts.map((text) => (batches === 1 ? `${text} Ж` : text))
      },
    }

    try {
      await generateTranslations({ sourceRoot: temporaryRoot, locales: [french], concurrency: 1, provider })
      expect(batches).toBe(2)
      expect(await readFile(path.join(temporaryRoot, 'fr', 'guide.md'), 'utf8')).toContain('Current source text.')
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true })
    }
  })

  test('waits for in-flight workers before cleaning a failed staging tree', async () => {
    const parent = await mkdtemp(path.join(tmpdir(), 'iroha-docs-parallel-failure-'))
    const sourceRoot = path.join(parent, 'src')
    await mkdir(path.join(sourceRoot, 'fr'), { recursive: true })
    await writeFile(path.join(sourceRoot, 'a.md'), '# Failing\n\nTrigger failure.\n')
    await writeFile(path.join(sourceRoot, 'b.md'), '# Slow\n\nWait for cleanup.\n')
    await writeFile(path.join(sourceRoot, 'fr', 'a.md'), '# Traduction précédente\n')
    await writeFile(path.join(sourceRoot, 'fr', 'b.md'), '# Traduction précédente\n')
    let slowFinished = false
    const provider: TranslationProvider = {
      engine: 'parallel-cleanup-test',
      protectedMarkdownMode: 'inline-identifiers',
      clarifyTechnicalTerms: false,
      languageCode: () => 'fr',
      translate: async (text) => text,
      translateBatch: async (texts) => {
        if (texts.some((text) => text.includes('Wait for cleanup'))) {
          await new Promise((resolve) => setTimeout(resolve, 75))
          slowFinished = true
        }
        return texts.map((text) => (text.includes('Trigger failure') ? `${text} Ж` : text))
      },
    }

    try {
      await expect(generateTranslations({ sourceRoot, locales: [french], concurrency: 2, provider })).rejects.toThrow(
        'unexpected writing script: Cyrillic',
      )
      expect(slowFinished).toBe(true)
      expect((await readdir(parent)).filter((entry) => entry.startsWith('.iroha-docs-translation-'))).toEqual([])
      expect(await readFile(path.join(sourceRoot, 'fr', 'a.md'), 'utf8')).toBe('# Traduction précédente\n')
    } finally {
      await rm(parent, { recursive: true, force: true })
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
