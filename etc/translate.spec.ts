import { createHash } from 'node:crypto'
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { globby } from 'globby'
import { describe, expect, test } from 'vitest'
import { TRANSLATED_LOCALES } from './locales'
import {
  GoogleTranslationProvider,
  NLLB_LANGUAGE_CODES,
  NllbTranslationProvider,
  addStableHeadingAnchors,
  chunkForTranslation,
  curatedExactTranslation,
  curatedExactTranslationEntries,
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
  protectMarkdown,
  synchronizeTranslationHeadingAnchors,
  synchronizeTranslationMarkdownStructure,
  technicalIdentifiers,
  translateDocument,
  type TranslationProvider,
} from './translate'

const french = TRANSLATED_LOCALES.find((locale) => locale.key === 'fr')!
const georgian = TRANSLATED_LOCALES.find((locale) => locale.key === 'ka')!
const hebrew = TRANSLATED_LOCALES.find((locale) => locale.key === 'he')!
const japanese = TRANSLATED_LOCALES.find((locale) => locale.key === 'ja')!
const kazakh = TRANSLATED_LOCALES.find((locale) => locale.key === 'kk')!
const portuguese = TRANSLATED_LOCALES.find((locale) => locale.key === 'pt')!
const spanish = TRANSLATED_LOCALES.find((locale) => locale.key === 'es')!
const simplifiedChinese = TRANSLATED_LOCALES.find((locale) => locale.key === 'zh-hans')!
const traditionalChinese = TRANSLATED_LOCALES.find((locale) => locale.key === 'zh-hant')!
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
    const sentenceChunks = [
      " A recent root of the asset's commitment tree. ",
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
          if (text === sourceCell) return ' Uma raiz recente da árvore de compromisso do activo. '
          if (text === sentenceChunks[0]) return ' Uma raiz recente da árvore de compromisso do ativo. '
          if (text === sentenceChunks[1]) return 'As provas mostram que as notas gastas existem. '
          return text
        })
      },
    }
    const source = `| Merkle root |${sourceCell}|\n`

    const translated = await translateDocument(source, 'blockchain/anonymous-transactions.md', portuguese, provider)

    expect(batches.flat()).toContain(sourceCell)
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
    const expectedChunks = [
      'For a snapshot you can inspect without keeping a stream open, ',
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
          if (text === source) return '查看最近的探索者交易,'
          if (text === expectedChunks[0]) return '若要在不保持事件流打开的情况下检查完整快照，'
          if (text === expectedChunks[1]) return '请读取最近的区块浏览器交易记录：'
          return text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/events.md', simplifiedChinese, provider)

    expect(batches[0]).toEqual([source])
    expect(batches.at(-1)).toEqual(expectedChunks)
    expect(batches.at(-1)?.join('')).toBe(source)
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
    const maskedSource = source.replace('Iroha', '[PH000000]')
    const balancedChunks = [
      'Queries are small instruction-like objects that, when sent to an [PH000000] peer,',
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
    const collapsed = ' लेनदेनが列に並ぶので,一列がブロックを支配しない.'
    const expectedChunks = [
      'It interleaves transactions by lane so ',
      'one lane does not dominate the block just because its transactions were queued first.',
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
          if (text === source) return collapsed
          const chunkIndex = expectedChunks.indexOf(text)
          return chunkIndex >= 0 ? recovered[chunkIndex] : text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/consensus.md', japanese, provider)

    expect(batches).toContainEqual([source])
    expect(batches).toContainEqual(expectedChunks)
    expect(expectedChunks.join('')).toBe(source)
    expect(translated).not.toContain('लेनदेन')
    expect(translated).toContain(`${recovered[0]}。${recovered[1]}`)
  })

  test('recovers the exact Japanese peer-key condition at a safe if-clause boundary', async () => {
    const source =
      'Register and unregister peers. Generate the BLS key and PoP with `kagami` if you do not already have them:'
    const maskedSource =
      'Register and unregister peers. Generate the [PH000002] key and [PH000001] with [PH000000] if you do not already have them:'
    const sentenceChunks = [
      'Register and unregister peers. ',
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
      'Public `irohad` metrics are useful for learning the signal names. Do not use them as production capacity numbers for your own deployment.'
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
    expect(translated).toContain('`irohad`')
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
      'Public metrics help operators learn signal names. Do not use `irohad` benchmark results as production capacity numbers for your own deployment.'
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
      '[PH000002] commits to [PH000003] composition evaluations. For each round [PH000000], the transcript samples a challenge [PH000001]. The layer is padded to a multiple of the arity by repeating the last value. Each arity-sized group folds to:'
    const sentenceChunks = [
      '[PH000002] commits to [PH000003] composition evaluations. ',
      'For each round [PH000000], the transcript samples a challenge [PH000001]. ',
      'The layer is padded to a multiple of the arity by repeating the last value. ',
      'Each arity-sized group folds to:',
    ]
    const markerFreeFragments = ['commits to', 'composition evaluations.']
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
          if (text === sentenceChunks[0]) return '[PH000002] құрамын бағалауға міндеттенеді. '
          if (text === sentenceChunks[1]) {
            return 'Әрбір [PH000000] раунды үшін транскрипт [PH000001] сынағын таңдайды. '
          }
          if (text === sentenceChunks[2]) {
            return 'Қабат соңғы мәнді қайталау арқылы арлық еселікке толтырылады. '
          }
          if (text === sentenceChunks[3]) return 'Әр арлық өлшемді топ мынаған бүктеледі:'
          if (text === markerFreeFragments[0]) return 'міндеттенеді'
          if (text === markerFreeFragments[1]) return 'құрам бағалауларына.'
          return text
        })
      },
    }

    const translated = await translateDocument(`${source}\n`, 'blockchain/fastpq.md', kazakh, provider)

    expect(batches).toContainEqual(sentenceChunks)
    expect(batches).toContainEqual(markerFreeFragments)
    expect(translated).toContain('FRI міндеттенеді AIR құрам бағалауларына.')
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
        translateBatch: async (texts) => texts.map((text) => (text === source ? '账本表现' : text)),
      },
    )

    expect(translated).toContain('|账本表现|')
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
              case source:
                return '保存相关日志,账本参考,配置快照和可靠的时刻标记.'
              case 'Preserve relevant logs,':
                return '保存相关日志,'
              case 'ledger references,':
                return '账本引用,'
              case 'configuration snapshots,':
                return '配置快照,'
              case 'and transaction hashes with reliable timestamps.':
                return '和可靠的时间标签的交易哈希.'
              default:
                return text
            }
          }),
      },
    )

    expect(translated).toContain('保存相关日志,账本引用,配置快照,和可靠的时间标签的交易哈希.')
  })

  test('recovers adjacent short CJK inventory clauses separately', async () => {
    const source =
      'Keep trusted release artifacts, configuration, genesis records, and inventories available during an incident.'
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
              case source:
                return '在事件期间,保持可信的发布工件,配置,创世记录和库存.'
              case 'Keep trusted release artifacts,':
                return '保持可信的发布工件,'
              case 'configuration, genesis records,':
                return '创世记录,'
              case 'configuration,':
                return '配置,'
              case 'genesis records,':
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
