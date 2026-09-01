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
  search: TRANSLATED_LOCALES.find((locale) => locale.key === 'fr')!.search,
  theme: TRANSLATED_LOCALES.find((locale) => locale.key === 'fr')!.theme,
  feedback: TRANSLATED_LOCALES.find((locale) => locale.key === 'fr')!.feedback,
}
const japaneseLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'ja')!
const azerbaijaniLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'az')!
const mongolianLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'mn')!
const uzbekLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'uz')!
const dzongkhaLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'dz')!
const amharicLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'am')!
const bashkirLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'ba')!
const simplifiedChineseLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'zh-hans')!
const traditionalChineseLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'zh-hant')!
const arabicLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'ar')!
const myanmarLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'my')!
const urduLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'ur')!
const hebrewLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'he')!
const georgianLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'ka')!
const kazakhLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'kk')!
const russianLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'ru')!
const armenianLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'hy')!
const spanishLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'es')!
const portugueseLocale = TRANSLATED_LOCALES.find((locale) => locale.key === 'pt')!

async function fixture(englishContent = '# Guide\n\nCurrent English source.\n', route = 'guide/index.md') {
  const sourceRoot = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-i18n-'))
  await mkdir(path.dirname(path.join(sourceRoot, route)), { recursive: true })
  await mkdir(path.dirname(path.join(sourceRoot, 'fr', route)), { recursive: true })
  const englishPath = path.join(sourceRoot, route)
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

  test('rejects an untranslated English prose unit inside an otherwise translated page', async () => {
    const english =
      '# Security Guide\n\nStore production keys in a dedicated custody system.\n\nRotate every private key before its documented expiry date.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide de sécurité {#security-guide}\n\nStockez les clés de production dans un système de conservation dédié.\n\nRotate every private key before its documented expiry date.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: prose unit 3 is an untranslated English fallback',
    )
  })

  test('rejects an untranslated human-readable link label', async () => {
    const english = '# Guide\n\nContinue with [Release Readiness](/guide/best-practices/release-readiness.md).\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nContinuez avec [Release Readiness](/fr/guide/best-practices/release-readiness.md).\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: link 1 has untranslated label Release Readiness',
    )
  })

  test('rejects a translated protocol-family link label', async () => {
    const english = '# Guide\n\nUse [Log/Custom/Upgrade](#other-instructions).\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nUtilisez [Journal/Personnalisé/Mise à niveau](#other-instructions).\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: link 1 must preserve technical label Log/Custom/Upgrade',
    )
  })

  test('rejects a translated link whose label escaped the brackets', async () => {
    const english = '# Guide\n\nUse [Transfer](#transfer).\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nUtilisez [](#transfer) Transférer.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: link 1 has an empty label',
    )
  })

  test('accepts naturally reordered links when destinations and translated labels are preserved', async () => {
    const english = '# Guide\n\nSee [Byzantine fault tolerance](#bft) via [view change](#view-change).\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nConsultez [le changement de vue](#view-change), puis [la tolérance aux fautes byzantines](#bft).\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toEqual([])
  })

  test('rejects unrelated version-history text leaked by a translation model', async () => {
    const english = '# Configuration\n\nFlag to enable printing new blocks to the console.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Configuration {#configuration}\n\nOption permettant d’afficher les nouveaux blocs dans la console, testée avec la version 5.7.1.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: leaked unrelated version-history text',
    )
  })

  test('rejects a long English fragment embedded in localized prose', async () => {
    const english =
      '# Security Guide\n\nStore production keys in a dedicated custody system, and rotate every private key before its documented expiry date.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide de sécurité {#security-guide}\n\nStockez les clés de production dans un système dédié, puis rotate every private key before its documented expiry date.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: prose unit 2 contains untranslated English text: rotate every private key before',
    )
  })

  test('rejects a source-aligned semantic false friend', async () => {
    const english = '# Proofs\n\nThe proof stores cryptographic commitments for every encrypted note.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'mn', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'mn', 'guide', 'index.md'),
      `---\ntranslation_locale: mn\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Баталгаа {#proofs}\n\nБаталгаа нь шифрлэсэн тэмдэглэл бүрийн криптограф үүрэг гүйцэтгэгчдийг хадгална.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [mongolianLocale] })).toContain(
      'mn/guide/index.md: prose unit 2 contains semantic false friend: cryptographic commitment rendered as performing a duty',
    )
  })

  test.each([
    [
      'A shielded note contains private fields.',
      'Защищённая заметка содержит приватные поля.',
      'confidential protocol note rendered as an ordinary written note',
    ],
    [
      'Public state can be queried without a write.',
      'Публичное государство можно запросить без записи.',
      'public ledger state rendered as a sovereign state',
    ],
    [
      'The record is backed by nullifiers.',
      'Запись поддерживается нулевыми значениями.',
      'cryptographic nullifier rendered as an ordinary zero value',
    ],
    [
      'Read the transaction through the explorer route.',
      'Прочитайте транзакцию через маршрут исследователя.',
      'blockchain explorer rendered as a researcher or guide',
    ],
  ])('rejects a Russian terminology regression: %s', async (source, localized, description) => {
    const english = `# Terminology\n\n${source}\n`
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ru', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ru', 'guide', 'index.md'),
      `---\ntranslation_locale: ru\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Терминология {#terminology}\n\n${localized}\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [russianLocale] })).toContain(
      `ru/guide/index.md: prose unit 2 contains semantic false friend: ${description}`,
    )
  })

  test('rejects a protocol wire format rendered as a physical cable', async () => {
    const english = '# Protocol\n\nNorito is the canonical wire format.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Protocole {#protocol}\n\nNorito est le format de câble canonique.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: prose unit 2 contains semantic false friend: protocol wire format rendered as a physical wire or cable',
    )
  })

  test('accepts the idiomatic Japanese protocol wire-format loanword', async () => {
    const english = '# Protocol\n\nNorito is the canonical wire format.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ja', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ja', 'guide', 'index.md'),
      `---\ntranslation_locale: ja\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# プロトコル {#protocol}\n\nNorito は正規ワイヤーフォーマットです。\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [japaneseLocale] })).toEqual([])
  })

  test('does not apply the protocol wire rule to an ordinary wiring verb', async () => {
    const english = '# Deployment\n\nWire the peer into systemd and dashboard monitoring.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Déploiement {#deployment}\n\nReliez le pair par câble à systemd et à la supervision du tableau de bord.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toEqual([])
  })

  test.each([
    {
      source: 'A non-fungible asset has a unique identity.',
      localized: 'မှိုမပါသော asset တွင် သီးခြား identity ရှိသည်။',
      description: 'non-fungible rendered as mold-free',
    },
    {
      source: 'Record CPU saturation before changing the workload.',
      localized: 'workload မပြောင်းမီ CPU ကျေနပ်မှုကို မှတ်တမ်းတင်ပါ။',
      description: 'CPU saturation rendered as satisfaction',
    },
    {
      source: 'Run the registration command once.',
      localized: 'မှတ်ပုံတင်ကော်မရှင်ကို တစ်ကြိမ် run ပါ။',
      description: 'registration command rendered as a registration commission',
    },
    {
      source: 'This recipe submits and verifies a transaction.',
      localized: 'ဤအချက်ပြုတ်နည်းက transaction ကို တင်ပြီး စစ်ဆေးသည်။',
      description: 'documentation recipe rendered as cooking',
    },
    {
      source: 'Keep the replay tombstone for the full TTL.',
      localized: 'သင်္ချိုင်းကျောက်ကို TTL အပြည့် ထိန်းသိမ်းပါ။',
      description: 'data tombstone rendered as a gravestone or cemetery',
    },
    {
      source: 'Resolve the alias before submitting the transaction.',
      localized: 'transaction မတင်မီ အမည်မဖော်လိုမှုကို resolve လုပ်ပါ။',
      description: 'identifier alias rendered as anonymity',
    },
    {
      source: 'The transaction authority signs the envelope.',
      localized: 'ငွေပေးချေးမှု authority က envelope ကို လက်မှတ်ထိုးသည်။',
      description: 'transaction rendered as a financial loan',
    },
    {
      source: 'Treat contract upgrades as high-risk controls.',
      localized: 'contract upgrade ကို အရဲစွန့်မှုမြင့်သော control အဖြစ် သတ်မှတ်ပါ။',
      description: 'risk rendered as a dare',
    },
    {
      source: 'Send the alert away from the affected host.',
      localized: 'alert ကို ထိခိုက်သော အိမ်ရှင်မှ ခွဲပို့ပါ။',
      description: 'computing host rendered as a landlord',
    },
  ])('rejects Myanmar semantic false friend: $description', async ({ source, localized, description }) => {
    const { sourceRoot, hash } = await fixture(`# Guide\n\n${source}\n`)
    await mkdir(path.join(sourceRoot, 'my', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'my', 'guide', 'index.md'),
      `---\ntranslation_locale: my\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# လမ်းညွှန် {#guide}\n\n${localized}\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [myanmarLocale] })).toContain(
      `my/guide/index.md: prose unit 2 contains semantic false friend: ${description}`,
    )
  })

  test('rejects a technical key or root rendered as fuel in Mongolian', async () => {
    const english = '# Signing keys\n\nKeep every signing key in secure storage.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'mn', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'mn', 'guide', 'index.md'),
      `---\ntranslation_locale: mn\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Гарын үсгийн түлхүүрүүд {#signing-keys}\n\nГарын үсэг зурах түлшийг аюулгүй хадгална.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [mongolianLocale] })).toContain(
      'mn/guide/index.md: prose unit 2 contains semantic false friend: technical key, root, or trigger concept rendered as fuel',
    )
  })

  test('rejects a ledger query rendered as research in Mongolian', async () => {
    const english = '# Queries\n\nRun a query for every account.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'mn', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'mn', 'guide', 'index.md'),
      `---\ntranslation_locale: mn\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Асуулга {#queries}\n\nДанс бүрийн судалгааг ажиллуул.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [mongolianLocale] })).toContain(
      'mn/guide/index.md: prose unit 2 contains semantic false friend: ledger query rendered as research',
    )
  })

  test.each([
    {
      source: 'Execute the instruction.',
      localized: 'Сургалтыг ажиллуул.',
      description: 'protocol instruction rendered as training',
    },
    {
      source: 'Open the escrow.',
      localized: 'Ургийн хадгалалтыг нээ.',
      description: 'protocol escrow rendered as lineage or express storage',
    },
    {
      source: 'Send to accounts or triggers.',
      localized: 'Төхөөрөмжүүд эсвэл триггерүүд рүү илгээ.',
      description: 'account destination rendered as a hardware device',
    },
    {
      source: 'List the triggers.',
      localized: 'Тэргүүлдэг зүйлсийг жагсаа.',
      description: 'software trigger rendered as a leader or stimulus',
    },
    {
      source: 'Read the logs.',
      localized: 'Төлөвлөгөөг унш.',
      description: 'software log rendered as a plan',
    },
    {
      source: 'Register the domain.',
      localized: 'Өмчийн нэрийг бүртгэ.',
      description: 'blockchain domain rendered as a property name',
    },
    {
      source: 'Register the asset definition.',
      localized: 'Өмчийн тодорхойлолтыг бүртгэ.',
      description: 'asset definition rendered as a property definition',
    },
    {
      source: 'Claim funds from the faucet.',
      localized: 'Хөрөнгө оруулалтын үйлчилгээнээс хөрөнгө ав.',
      description: 'testnet faucet rendered as an investment service',
    },
    {
      source: 'Register the RWA lots.',
      localized: 'RWA бүртгэх олон.',
      description: 'RWA lot rendered as the quantity many',
    },
    {
      source: 'Release the asset to the buyer.',
      localized: 'Хөрөнгийг хуучаачид олго.',
      description: 'buyer rendered as a dealer or old-timer',
    },
  ])('rejects Mongolian semantic false friend: $description', async ({ source, localized, description }) => {
    const { sourceRoot, hash } = await fixture(`# Guide\n\n${source}\n`)
    await mkdir(path.join(sourceRoot, 'mn', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'mn', 'guide', 'index.md'),
      `---\ntranslation_locale: mn\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Гарын авлага {#guide}\n\n${localized}\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [mongolianLocale] })).toContain(
      `mn/guide/index.md: prose unit 2 contains semantic false friend: ${description}`,
    )
  })

  test('rejects a lifecycle hook rendered as a reed in Uzbek', async () => {
    const english = '# Lifecycle hook\n\nA successful hook consumes the pending marker atomically.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'uz', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'uz', 'guide', 'index.md'),
      `---\ntranslation_locale: uz\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Hayot davri hooki {#lifecycle-hook}\n\nMuvaffaqiyatli qamish kutayotgan markerni atomik ravishda iste'mol qiladi.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [uzbekLocale] })).toContain(
      'uz/guide/index.md: prose unit 2 contains semantic false friend: lifecycle hook rendered as a reed',
    )
  })

  test('does not mistake Uzbek settlement wording for the word book', async () => {
    const english = '# Ledger settlement\n\nThe ledger records each settlement flow.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'uz', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'uz', 'guide', 'index.md'),
      `---\ntranslation_locale: uz\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Reyestrdagi hisob-kitob {#ledger-settlement}\n\nReyestr har bir hisob-kitob oqimini qayd etadi.\n`,
    )

    const errors = await validateI18n({ sourceRoot, locales: [uzbekLocale] })
    expect(errors).not.toContain(
      'uz/guide/index.md: prose unit 2 contains semantic false friend: ledger rendered as a book',
    )
  })

  test('rejects a technical call rendered as a telephone call', async () => {
    const english = '# SDK calls\n\nCall the SDK helper before signing the transaction.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ja', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ja', 'guide', 'index.md'),
      `---\ntranslation_locale: ja\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# SDK 呼び出し {#sdk-calls}\n\nトランザクションに署名する前に SDK ヘルパーへ電話してください。\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [japaneseLocale] })).toContain(
      'ja/guide/index.md: prose unit 2 contains semantic false friend: technical call rendered as a telephone call',
    )
  })

  test.each([
    {
      description: 'protocol escrow rendered as current accounts',
      source: 'The escrows hold disputed assets.',
      localized: 'تحتفظ الحسابات الجارية بالأصول المتنازع عليها.',
    },
    {
      description: 'protocol wildcard rendered as a postal code',
      source: 'The canonical wildcard is included in the GAR payload.',
      localized: 'يُدرج الرمز البريدي في حمولة GAR.',
    },
    {
      description: 'software encoder rendered as a converter',
      source: 'The encoders write little-endian integers.',
      localized: 'تكتب المحولات الأعداد الصحيحة بترتيب little-endian.',
    },
    {
      description: 'genesis manifest rendered as a founding document',
      source: 'The bundled genesis manifest creates the account.',
      localized: 'تنشئ وثيقة التأسيس المضمّنة الحساب.',
    },
    {
      description: 'write-side toy example rendered as a game on the right side',
      source: 'The first write-side toy is a faucet claim.',
      localized: 'اللعبة الأولى على الجانب الأيمن هي مطالبة تمويل.',
    },
  ])('rejects an Arabic $description', async ({ description, localized, source }) => {
    const english = `# Guide\n\n${source}\n`
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ar', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ar', 'guide', 'index.md'),
      `---\ntranslation_locale: ar\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# دليل {#guide}\n\n${localized}\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [arabicLocale] })).toContain(
      `ar/guide/index.md: prose unit 2 contains semantic false friend: ${description}`,
    )
  })

  test.each([
    {
      source: 'The runtime validates every canonical account.',
      localized: '実行時間は、すべての法典的な会計を検証します。',
      descriptions: [
        'software runtime rendered as elapsed execution time',
        'canonical form rendered as statutory or codified law',
        'ledger account rendered as accounting',
      ],
    },
    {
      source: 'Build the workspace and inspect the generated artifacts.',
      localized: '作業場を建設し、生成された芸術品を確認します。',
      descriptions: [
        'software workspace rendered as a physical workplace',
        'software build rendered as physical construction',
        'software artifact rendered as a cultural or artistic object',
      ],
    },
    {
      source: 'The public endpoint exposes events and queries.',
      localized: '公衆の終点は出来事と疑問を公開します。',
      descriptions: [
        'public protocol surface rendered as the general populace',
        'API endpoint rendered as a physical terminus',
        'typed event rendered as an ordinary occurrence',
        'ledger query rendered as an ordinary question or investigation',
      ],
    },
    {
      source: 'The proof binds its public input to a commitment.',
      localized: '証明は公的な入口を約束に結び付けます。',
      descriptions: ['proof public input rendered as an entrance', 'cryptographic commitment rendered as a promise'],
    },
    {
      source: 'Validators use BLS-Normal peer keys.',
      localized: 'バリデーターは BLS-通常のピア鍵を使用します。',
      descriptions: ['BLS-Normal algorithm name translated instead of preserved'],
    },
    {
      source: 'The first write-side toy is a faucet claim.',
      localized: '最初の書き込み側のおもちゃは faucet への請求です。',
      descriptions: ['small write example rendered as a physical toy'],
    },
    {
      source: 'Test writes before promotion.',
      localized: 'テストが書きます。',
      descriptions: ['test-write label rendered as an ungrammatical sentence'],
    },
    {
      source: 'Use public Taira for this test.',
      localized: 'このテストには公共の Taira を使用します。',
      descriptions: ['public testnet rendered as the general public or public utility'],
    },
  ])('rejects recurring Japanese technical polysemes: $source', async ({ source, localized, descriptions }) => {
    const english = `# Terminology\n\n${source}\n`
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ja', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ja', 'guide', 'index.md'),
      `---\ntranslation_locale: ja\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# 用語 {#terminology}\n\n${localized}\n`,
    )

    const errors = await validateI18n({ sourceRoot, locales: [japaneseLocale] })
    for (const description of descriptions) {
      expect(errors).toContain(`ja/guide/index.md: prose unit 2 contains semantic false friend: ${description}`)
    }
  })

  test('accepts a Japanese commitment sentence that also contains an ordinary promise', async () => {
    const english = '# Terminology\n\nA promise is separate from the cryptographic commitment.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ja', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ja', 'guide', 'index.md'),
      `---\ntranslation_locale: ja\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# 用語 {#terminology}\n\n約束は暗号学的コミットメントとは別です。\n`,
    )

    await expect(validateI18n({ sourceRoot, locales: [japaneseLocale] })).resolves.toEqual([])
  })

  test.each([
    ['The ledger stores state.', '本簿は状態を保存します。', 'ledger rendered as a malformed literal book term'],
    [
      'The wallet signs the payload.',
      '財布がペイロードに署名します。',
      'cryptocurrency wallet rendered as a physical purse',
    ],
    ['The chain commits the block.', '鎖がブロックをコミットします。', 'blockchain rendered as a physical chain'],
    ['Run the code generator.', 'コード発電機を実行します。', 'software generator rendered as an electrical generator'],
    ['Use the SDK helper.', 'SDK 補助人を使用します。', 'software helper rendered as a human assistant'],
    ['Register the trigger.', '引き金を登録します。', 'event trigger rendered as a firearm trigger or explosion'],
    ['Open the escrow.', '保証人を開始します。', 'protocol escrow rendered as collateral or a guarantor'],
    ['Verify the receipt.', '領収書を検証します。', 'protocol receipt rendered as a shop receipt'],
    ['Validate the schema.', 'スケジュールを検証します。', 'data schema rendered as a calendar schedule'],
    ['Sign the manifest.', 'マニストに署名します。', 'software manifest rendered as a statement or malformed loanword'],
    ['Track the lifecycle.', '生命周期を追跡します。', 'lifecycle left as a Chinese term in Japanese prose'],
    ['Review the flow.', '流程を確認します。', 'workflow left as a Chinese term in Japanese prose'],
    ['Encrypt the payload.', 'ペイロードを加密します。', 'encryption left as a Chinese term in Japanese prose'],
    ['Build locally.', '本地でビルドします。', 'local software context left as a Chinese term in Japanese prose'],
    ['Read the output.', '輸出を読み取ります。', 'software output rendered as commercial export'],
    ['Try it on Taira.', 'Taira で試着します。', 'trying a workflow rendered as trying on clothing'],
    ['Burn the asset.', '資産を消費します。', 'asset or trigger burning rendered as ordinary consumption'],
    ['Keep the raw value private.', '原始値を非公開にします。', 'raw data rendered as primitive or ancient material'],
    [
      'Call the transaction builder.',
      '取引建設業者を呼び出します。',
      'software builder rendered as a construction worker',
    ],
    ['Encode each scalar.', '各スケラーを符号化します。', 'scalar rendered with a malformed loanword'],
  ])('rejects Japanese machine-translation residue: %s', async (source, localized, description) => {
    const english = `# Terminology\n\n${source}\n`
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ja', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ja', 'guide', 'index.md'),
      `---\ntranslation_locale: ja\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# 用語 {#terminology}\n\n${localized}\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [japaneseLocale] })).toContain(
      `ja/guide/index.md: prose unit 2 contains semantic false friend: ${description}`,
    )
  })

  test.each([
    [
      'The payload represents the controller.',
      '負荷はコントローラーを表します。',
      'technical payload rendered as a useful or beneficial burden',
    ],
    ['Connect to the peer.', '同類へ接続します。', 'network peer rendered as something merely similar'],
    ['Register the domain.', '域名を登録します。', 'Iroha domain left as a Chinese networking term'],
    [
      'The API exposes the status.',
      'API はステータスを暴露します。',
      'API exposure rendered as involuntary disclosure',
    ],
    [
      'The endpoint returns the result.',
      'エンドポイントは結果を返済します。',
      'software return rendered as debt repayment',
    ],
    ['Run the check locally.', '地元でチェックを実行します。', 'local software context rendered as a hometown'],
    ['Use the SDK tooling.', 'SDK の道具を使用します。', 'software tooling rendered as physical implements'],
    [
      'Call the public entrypoint.',
      '公開入口点を呼び出します。',
      'software entrypoint rendered as a physical entrance point',
    ],
    ['Apply the primary operation.', '原発操作を適用します。', 'primary operation rendered as a nuclear power plant'],
    [
      'Verify both parent nodes.',
      '両方の両親ノードを検証します。',
      'technical parent nodes or lots rendered as human parents',
    ],
    ['Open the child node.', '子供ノードを開きます。', 'technical child node or lot rendered as a human child'],
    ['Run the benchmark.', 'ベンチマークを走行します。', 'software run rendered as physical travel'],
    ['Generate the bindings.', '拘束力を生成します。', 'technical binding rendered as coercive force'],
    ['Charge the fee sponsor.', '料金の保証人に課金します。', 'fee sponsor rendered as a legal guarantor'],
    [
      'Use FRI blowup 8 for this proof.',
      'この証明では FRI 爆発 8 を使用します。',
      'proof expansion or traffic burst rendered as an explosion',
    ],
  ])('rejects additional Japanese semantic false friends: %s', async (source, localized, description) => {
    const english = `# Terminology\n\n${source}\n`
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ja', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ja', 'guide', 'index.md'),
      `---\ntranslation_locale: ja\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# 用語 {#terminology}\n\n${localized}\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [japaneseLocale] })).toContain(
      `ja/guide/index.md: prose unit 2 contains semantic false friend: ${description}`,
    )
  })

  test('rejects a technical payload rendered as a beneficial burden', async () => {
    const english = '# Payload\n\nKeep the transaction payload compact.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ar', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ar', 'guide', 'index.md'),
      `---\ntranslation_locale: ar\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# الحمولة {#payload}\n\nحافظ على الحمولة الفائدة للمعاملة بحجم صغير.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [arabicLocale] })).toContain(
      'ar/guide/index.md: prose unit 2 contains semantic false friend: technical payload rendered as a useful or beneficial burden',
    )
  })

  test.each([
    { locale: hebrewLocale, localized: 'הריצו שאלה עבור כל חשבון.' },
    { locale: myanmarLocale, localized: 'အကောင့်တိုင်းအတွက် မေးခွန်းကို run ပါ။' },
    { locale: urduLocale, localized: 'ہر اکاؤنٹ کے لیے سوال چلائیں۔' },
  ])('rejects a ledger query rendered as an ordinary question in $locale.key', async ({ locale, localized }) => {
    const english = '# Queries\n\nRun a query for every account.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, locale.path, 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, locale.path, 'guide', 'index.md'),
      `---\ntranslation_locale: ${locale.key}\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Queries {#queries}\n\n${localized}\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [locale] })).toContain(
      `${locale.path}/guide/index.md: prose unit 2 contains semantic false friend: ledger query rendered as an ordinary question or investigation`,
    )
  })

  test('accepts a Russian ledger sentence whose separate book reference is literal', async () => {
    const english = '# Glossary\n\nThe ledger glossary lists books for further reading.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ru', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ru', 'guide', 'index.md'),
      `---\ntranslation_locale: ru\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Глоссарий {#glossary}\n\nГлоссарий распределённого реестра перечисляет книги для дальнейшего чтения.\n`,
    )

    await expect(validateI18n({ sourceRoot, locales: [russianLocale] })).resolves.toEqual([])
  })

  test('accepts a Russian ledger query alongside an ordinary user question', async () => {
    const english = '# Queries\n\nRun a ledger query and record the question supplied by the user.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ru', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ru', 'guide', 'index.md'),
      `---\ntranslation_locale: ru\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Запросы {#queries}\n\nВыполните запрос к распределённому реестру и запишите вопрос пользователя.\n`,
    )

    await expect(validateI18n({ sourceRoot, locales: [russianLocale] })).resolves.toEqual([])
  })

  test('rejects a software pipeline rendered as a water pipe', async () => {
    const english = '# Events\n\nThe transaction pipeline emits events.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'he', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'he', 'guide', 'index.md'),
      `---\ntranslation_locale: he\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# אירועים {#events}\n\nצינור העסקאות פולט אירועים.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [hebrewLocale] })).toContain(
      'he/guide/index.md: prose unit 2 contains semantic false friend: software pipeline rendered as a water pipe',
    )
  })

  test('rejects a system wall clock rendered as a wall-mounted clock', async () => {
    const english = '# Time\n\nUse the local wall-clock timeout only for diagnostics.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ja', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ja', 'guide', 'index.md'),
      `---\ntranslation_locale: ja\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# 時刻 {#time}\n\nローカルの壁時計タイムアウトは診断だけに使用します。\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [japaneseLocale] })).toContain(
      'ja/guide/index.md: prose unit 2 contains semantic false friend: system wall clock rendered as a wall-mounted clock',
    )
  })

  test('rejects a protocol body rendered as a corpse', async () => {
    const english = '# Encoding\n\nThe body contains both the payload and checksum.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'kk', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'kk', 'guide', 'index.md'),
      `---\ntranslation_locale: kk\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Кодтау {#encoding}\n\nМәйіт пайдалы жүктеме мен бақылау сомасын қамтиды.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [kazakhLocale] })).toContain(
      'kk/guide/index.md: prose unit 2 contains semantic false friend: protocol body rendered as a corpse',
    )
  })

  test.each([
    ['The HTTP plane remains local.', 'HTTP ұшағы жергілікті болып қалады.', 'software plane rendered as an aircraft'],
    [
      'The node rebuilds from genesis.',
      'Түйін туа біткенінен қайта құрылады.',
      'blockchain genesis rendered as congenital origin',
    ],
    [
      'Read the transaction in the block explorer.',
      'Транзакцияны блок зерттеушісінен оқыңыз.',
      'blockchain explorer rendered as a researcher',
    ],
    ['Use the generated invoice lot ID.', 'Жасалған шот-фактура топ ID-сін пайдаланыңыз.', 'RWA lot rendered as a generic group'],
    [
      'Record which authority may revoke the key.',
      'Қай принцип кілтті кері қайтара алатынын жазыңыз.',
      'authorization authority rendered as a principle',
    ],
    [
      'Do not treat this as a single-peer edit.',
      'Мұны бір пайдаланушының түзетуі деп қарастырмаңыз.',
      'single network peer rendered as a user',
    ],
  ])('rejects a Kazakh terminology regression: %s', async (source, localized, description) => {
    const english = `# Terminology\n\n${source}\n`
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'kk', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'kk', 'guide', 'index.md'),
      `---\ntranslation_locale: kk\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Терминология {#terminology}\n\n${localized}\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [kazakhLocale] })).toContain(
      `kk/guide/index.md: prose unit 2 contains semantic false friend: ${description}`,
    )
  })

  test('rejects a cryptographic hash rendered as hashish', async () => {
    const english = '# Hashes\n\nStore the transaction hash with the receipt.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ar', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ar', 'guide', 'index.md'),
      `---\ntranslation_locale: ar\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# التجزئات {#hashes}\n\nخزّن حشيش المعاملة مع الإيصال.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [arabicLocale] })).toContain(
      'ar/guide/index.md: prose unit 2 contains semantic false friend: cryptographic hash rendered as hashish',
    )
  })

  test('rejects a protocol fork rendered as an eating utensil', async () => {
    const english = '# Fork handling\n\nKeep the soft fork disabled in production.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ru', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ru', 'guide', 'index.md'),
      `---\ntranslation_locale: ru\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Обработка форка {#fork-handling}\n\nОставьте мягкую вилку отключённой в производственной среде.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [russianLocale] })).toContain(
      'ru/guide/index.md: prose unit 2 contains semantic false friend: protocol fork rendered as an eating utensil',
    )
  })

  test('rejects token minting rendered as the mint herb', async () => {
    const english = '# Supply\n\nOnly mint rows update the supply counter.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ru', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ru', 'guide', 'index.md'),
      `---\ntranslation_locale: ru\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Предложение {#supply}\n\nТолько строки мяты обновляют счётчик предложения.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [russianLocale] })).toContain(
      'ru/guide/index.md: prose unit 2 contains semantic false friend: token minting rendered as the mint herb',
    )
  })

  test('rejects software execution rendered as capital punishment', async () => {
    const english = '# Execution\n\nDerive the new root from the execution witness.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'hy', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'hy', 'guide', 'index.md'),
      `---\ntranslation_locale: hy\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Կատարում {#execution}\n\nՆոր արմատը ստացեք մահապատժի վկայից։\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [armenianLocale] })).toContain(
      'hy/guide/index.md: prose unit 2 contains semantic false friend: software execution rendered as capital punishment',
    )
  })

  test('rejects ledger state rendered as a sovereign state', async () => {
    const english = '# State\n\nRebuild the world state from committed blocks.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ar', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ar', 'guide', 'index.md'),
      `---\ntranslation_locale: ar\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# الحالة {#state}\n\nأعِد بناء دولة العالم من الكتل الملتزم بها.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [arabicLocale] })).toContain(
      'ar/guide/index.md: prose unit 2 contains semantic false friend: ledger state rendered as a country or sovereign state',
    )
  })

  test('rejects escrow rendered as fraud', async () => {
    const english = '# Escrow\n\nRelease the escrow after approval.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Séquestre {#escrow}\n\nLibérez l’escroquerie après approbation.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: prose unit 2 contains semantic false friend: escrow rendered as fraud or a scam',
    )
  })

  test.each([
    {
      locale: portugueseLocale,
      english: 'The shell loads the configured alias.',
      localized: 'A concha carrega o alias configurado.',
      heading: 'Shell',
      description: 'command shell rendered as a seashell',
    },
    {
      locale: spanishLocale,
      english: 'Register the trigger before submitting the transaction.',
      localized: 'Registre el gatillo antes de enviar la transacción.',
      heading: 'Desencadenadores',
      description: 'event trigger rendered as a firearm trigger or switch',
    },
    {
      locale: arabicLocale,
      english: 'The seller has enough balance for the transfer.',
      localized: 'لدى البائع ميزان كافٍ للتحويل.',
      heading: 'الرصيد',
      description: 'financial balance rendered as a physical scale',
    },
    {
      locale: spanishLocale,
      english: 'Complete the private settlement after approval.',
      localized: 'Complete el asentamiento privado después de la aprobación.',
      heading: 'Liquidación',
      description: 'protocol settlement rendered as habitation or a populated place',
    },
    {
      locale: hebrewLocale,
      english: 'Route the payload through the governance lane.',
      localized: 'נתבו את המטען דרך כביש הממשל.',
      heading: 'נתיב',
      description: 'protocol lane rendered as a public road or street',
    },
    {
      locale: azerbaijaniLocale,
      english: 'Check a Target Node before deployment.',
      localized: 'Yerləşdirmədən əvvəl Hədəf Qeydiyyatını yoxlayın.',
      heading: 'Qovşaq',
      description: 'network node rendered as registration, a bond, or an unrelated object',
    },
    {
      locale: testLocale,
      english: 'Use a non-sensitive handle for the account alias.',
      localized: 'Utilisez une poignée non sensible pour l’alias du compte.',
      heading: 'Alias',
      description: 'identifier handle rendered as a physical door handle',
    },
    {
      locale: arabicLocale,
      english: 'The codec emits canonical bytes for every account identifier.',
      localized: 'يُصدر برنامج الترميز بايتات قانونية لكل معرّف حساب.',
      heading: 'الترميز',
      description: 'canonical encoding rendered as legal or lawful',
    },
    {
      locale: spanishLocale,
      english: 'A durable tombstone prevents replay after the rich record is pruned.',
      localized: 'Una lápida duradera impide la repetición después de podar el registro detallado.',
      heading: 'Repetición',
      description: 'data tombstone rendered as a gravestone or cemetery',
    },
    {
      locale: russianLocale,
      english: 'Create a separate signer before submitting the transaction.',
      localized: 'Создайте отдельного подписчика перед отправкой транзакции.',
      heading: 'Подписант',
      description: 'cryptographic signer rendered as a subscriber',
    },
    {
      locale: spanishLocale,
      english: 'The Rust client crate exposes the transaction API.',
      localized: 'La caja del cliente Rust expone la API de transacciones.',
      heading: 'Rust',
      description: 'Rust crate rendered as a physical box or cash register',
    },
    {
      locale: spanishLocale,
      english: 'Select the authority as the network fee payer.',
      localized: 'Seleccione la autoridad como pagador de honorarios de la red.',
      heading: 'Comisiones',
      description: 'network fee rendered as a professional honorarium',
    },
    {
      locale: portugueseLocale,
      english: 'Minting requires a separate runtime permission.',
      localized: 'A minagem requer uma permissão de runtime separada.',
      heading: 'Emissão',
      description: 'token minting rendered as cryptocurrency mining',
    },
    {
      locale: spanishLocale,
      english: 'The CLI quotes the fee and signs the exact quoted payload.',
      localized: 'La CLI cita la comisión y firma la carga útil citada exacta.',
      heading: 'Cotización',
      description: 'fee quote rendered as a literary quotation',
    },
    {
      locale: testLocale,
      english: 'The endpoint returns a versioned transaction scaffold.',
      localized: 'Le point de terminaison renvoie un échafaudage de transaction versionné.',
      heading: 'Structure',
      description: 'transaction scaffold rendered as construction scaffolding',
    },
    {
      locale: arabicLocale,
      english: 'Materialize the message family for downstream reconciliation.',
      localized: 'أنشئ عائلة الرسائل للمصالحة أسفل النهر.',
      heading: 'المطابقة',
      description: 'downstream processing rendered as a location below a river',
    },
    {
      locale: testLocale,
      english: 'Use the local source checkout for the JavaScript integration.',
      localized: 'Établissez l’intégration JavaScript avec la caisse locale du code source.',
      heading: 'Intégration',
      description: 'source-control checkout rendered as a cash register or payment checkout',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'The renderer creates WebRTC offers and answers.',
      localized: '渲染器创建 WebRTC 的报价和答案。',
      heading: 'WebRTC',
      description: 'WebRTC offer rendered as a financial price quote',
    },
    {
      locale: spanishLocale,
      english: 'Run the contract against local fixtures.',
      localized: 'Ejecute el contrato contra dispositivos locales.',
      heading: 'Pruebas',
      description: 'software test fixture or harness rendered as a physical object',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'The test harness registers the destination before execution.',
      localized: '测试马具会在执行前注册目标账户。',
      heading: '测试',
      description: 'software test fixture or harness rendered as a physical object',
    },
    {
      locale: uzbekLocale,
      english: 'Store the latest ledger snapshot for fast recovery.',
      localized: 'Tez tiklash uchun eng so‘nggi daftar fotosuratini saqlang.',
      heading: 'Snapshot',
      description: 'software or ledger snapshot rendered as a photograph',
    },
    {
      locale: spanishLocale,
      english: 'Writing the necessary boilerplate requires care.',
      localized: 'Escribir la placa necesaria requiere cuidado.',
      heading: 'FFI',
      description: 'software boilerplate rendered as a physical plate or temperature',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Persist the recovery sidecars before acknowledging the block.',
      localized: '确认区块之前先持久化恢复侧车。',
      heading: 'Kura',
      description: 'software sidecar rendered as a vehicle or motorcycle attachment',
    },
    {
      locale: arabicLocale,
      english: 'Use enough private sidecar storage for the configured retention period.',
      localized: 'استخدم كمية كافية من التخزين الخاص للسيارات الجانبية لفترة الاحتفاظ المحددة.',
      heading: 'التخزين',
      description: 'software sidecar rendered as a vehicle or motorcycle attachment',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Submit exactly one public carrier.',
      localized: '准确提交一个公共运输商。',
      heading: 'Carrier',
      description: 'protocol carrier rendered as a transport company, person, or vehicle',
    },
    {
      locale: japaneseLocale,
      english: 'Use the typed wrapper for this endpoint.',
      localized: 'このエンドポイントには型付き包装を使用します。',
      heading: 'ラッパー',
      description: 'software wrapper rendered as physical packaging',
    },
    {
      locale: japaneseLocale,
      english: 'Submit the signed transaction envelope.',
      localized: '署名済みトランザクション封筒を送信します。',
      heading: 'エンベロープ',
      description: 'protocol envelope rendered as a postal envelope',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'The manifest fragment records the configured lane.',
      localized: '显而易见的部分记录已配置的通道。',
      heading: '清单',
      description: 'manifest noun rendered as apparent or obvious',
    },
    {
      locale: portugueseLocale,
      english: 'Include a nonce before hashing the request.',
      localized: 'Inclua um não antes de calcular o hash da solicitação.',
      heading: 'Nonce',
      description: 'cryptographic nonce rendered as negation, a copy, or an unrelated word',
    },
    {
      locale: japaneseLocale,
      english: 'The transaction authority signs the request.',
      localized: '取引当局がリクエストに署名します。',
      heading: '権限',
      description: 'transaction authority rendered as a government agency or official',
    },
    {
      locale: testLocale,
      english: 'Persist the execution receipt after finality.',
      localized: 'Conservez la réception d’exécution après la finalité.',
      heading: 'Reçu',
      description: 'protocol receipt rendered as a recipe or reception',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Measure the boxed finalization instruction.',
      localized: '测量装箱的最终化指令。',
      heading: '指令',
      description: 'boxed instruction rendered as a physical box or package',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Submit exactly one public carrier.',
      localized: '准确提交一个公共载体。',
      heading: '承载交易',
      description: 'protocol carrier rendered as a transport company, person, or vehicle',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Probe the readiness endpoint before submitting.',
      localized: '提交前探测就绪终点。',
      heading: '端点',
      description: 'API endpoint rendered as a journey terminus',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'The runtime validates every transaction.',
      localized: '运行时间会验证每笔交易。',
      heading: '运行时',
      description: 'software runtime rendered as elapsed running time',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Sign the data-availability manifest.',
      localized: '签署数据可用性宣言。',
      heading: '清单',
      description: 'technical manifest rendered as a public declaration',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Persist the shielded ledger before shutdown.',
      localized: '关闭前持久保存屏蔽的大册子。',
      heading: '账本',
      description: 'ledger rendered as a physical book',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Broadcast the quorum certificate.',
      localized: '广播定制证书。',
      heading: '证书',
      description: 'quorum certificate rendered as a customized certificate',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Lock the asset in escrow.',
      localized: '将资产锁定在保证金中。',
      heading: '托管',
      description: 'escrow rendered as a guarantor or security deposit',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Route the transaction through its lane.',
      localized: '通过其车道路由交易。',
      heading: '通道',
      description: 'protocol lane rendered as a road or railway lane',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Each dataspace has an independent policy.',
      localized: '每个数据库都有独立的策略。',
      heading: '数据空间',
      description: 'dataspace rendered as a database',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Compare the state projection before submitting.',
      localized: '提交前比较状态预测。',
      heading: '投影',
      description: 'state projection rendered as a prediction',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Charge transaction gas to the sponsor.',
      localized: '向赞助方收取交易气体。',
      heading: 'Gas',
      description: 'transaction gas rendered as physical gas',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'The transaction authority signs the payload.',
      localized: '交易权威对有效载荷进行签名。',
      heading: '授权',
      description: 'transaction authority rendered as prestige or government authorities',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Verify the signed envelope.',
      localized: '验证已签名的信封。',
      heading: '封装',
      description: 'protocol envelope rendered as a parcel, cover, or postal envelope',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Poll the readiness endpoint.',
      localized: '调查就绪端点。',
      heading: '轮询',
      description: 'endpoint polling rendered as a survey',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Persist every nullifier.',
      localized: '持久保存每个取消者。',
      heading: '作废标识符',
      description: 'cryptographic nullifier rendered as a person',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Launch the node and emit a readiness event.',
      localized: '发射节点并发射就绪事件。',
      heading: '启动',
      description: 'software launch or event emission rendered as firing a projectile',
    },
    {
      locale: traditionalChineseLocale,
      english: 'The runtime validates every transaction.',
      localized: '執行時間會驗證每筆交易。',
      heading: '執行階段',
      description: 'software runtime rendered as elapsed running time',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Spend the shielded note with a proof.',
      localized: '使用证明花费隐私纸币。',
      heading: '票据',
      description: 'confidential value note rendered as a banknote or invoice',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Persist each private note commitment.',
      localized: '持久保存每个私有笔记承诺。',
      heading: '票据',
      description: 'confidential value note rendered as a written note',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Verify the cryptographic proof bytes.',
      localized: '验证密码学证据字节。',
      heading: '证明',
      description: 'cryptographic proof rendered as legal evidence',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'The proof witness contains private values.',
      localized: '证明证人包含私有值。',
      heading: '见证数据',
      description: 'cryptographic witness rendered as a person',
    },
    {
      locale: georgianLocale,
      english: 'The node validates the transaction.',
      localized: 'ნაოპაგ ტრანზაქციას ამოწმებს.',
      heading: 'ტრანზაქცია',
      description: 'Georgian translation contains obsolete letters or known model gibberish',
    },
    {
      locale: georgianLocale,
      english: 'Claim the asset from the testnet funding service.',
      localized: 'მოითხოვეთ აპარატი ტესტნეტის დაფინანსების სერვისიდან.',
      heading: 'აქტივი',
      description: 'ledger asset rendered as a device or apparatus',
    },
    {
      locale: georgianLocale,
      english: 'Try it on Taira.',
      localized: 'ჰქონდეს სვლა Taira.',
      heading: 'Taira',
      description: 'trying a workflow rendered as having a move',
    },
    {
      locale: georgianLocale,
      english: 'Connect to the Nexus dataspace.',
      localized: 'დაუკავშირდით Nexus მონაცემთა ბაზას.',
      heading: 'Nexus',
      description: 'dataspace rendered as a database',
    },
    {
      locale: armenianLocale,
      english: 'Define the asset before issuing it.',
      localized: 'Սահմանեք արտոնությունը նախքան այն թողարկելը։',
      heading: 'Ակտիվ',
      description: 'ledger asset rendered as a privilege or entitlement',
    },
    {
      locale: armenianLocale,
      english: 'List every asset.',
      localized: 'Թվարկեք բոլոր գործիքները։',
      heading: 'Ակտիվ',
      description: 'ledger asset rendered as a tool or season',
    },
    {
      locale: simplifiedChineseLocale,
      english: 'Try it on Taira.',
      localized: '试穿 Taira。',
      heading: 'Taira',
      description: 'trying a workflow rendered as trying on clothing',
    },
    {
      locale: traditionalChineseLocale,
      english: 'Try it on Taira.',
      localized: '試穿 Taira。',
      heading: 'Taira',
      description: 'trying a workflow rendered as trying on clothing',
    },
    {
      locale: amharicLocale,
      english: 'Mintability',
      localized: 'Asset issuance policy',
      heading: 'የንብረት ፖሊሲ',
      description: 'clarified asset issuance policy left in English',
    },
    {
      locale: russianLocale,
      english: 'Try it on Taira.',
      localized: 'Примерьте это на Taira.',
      heading: 'Taira',
      description: 'trying a workflow rendered as trying on clothing',
    },
  ])(
    'rejects durable semantic regression: $description',
    async ({ locale, english, localized, heading, description }) => {
      const { sourceRoot, hash } = await fixture(`# Guide\n\n${english}\n`)
      await mkdir(path.join(sourceRoot, locale.path, 'guide'), { recursive: true })
      await writeFile(
        path.join(sourceRoot, locale.path, 'guide', 'index.md'),
        `---\ntranslation_locale: ${locale.key}\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ${heading} {#guide}\n\n${localized}\n`,
      )

      expect(await validateI18n({ sourceRoot, locales: [locale] })).toContain(
        `${locale.path}/guide/index.md: prose unit 2 contains semantic false friend: ${description}`,
      )
    },
  )

  test('allows a correct Chinese fee quote beside a key reference', async () => {
    const english =
      '# Transactions\n\nThe CLI prepares verifying-key references and submits an ordinary quoted, signed transaction.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, simplifiedChineseLocale.path, 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, simplifiedChineseLocale.path, 'guide', 'index.md'),
      `---\ntranslation_locale: zh-hans\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# 交易 {#transactions}\n\nCLI 会准备验证密钥引用，并提交完成费用报价和签名的普通交易。\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [simplifiedChineseLocale] })).not.toContainEqual(
      expect.stringContaining('fee quote rendered as a literary quotation'),
    )
  })

  test('allows telephone wording for an actual Kaigi call', async () => {
    const english = '# Kaigi\n\nCreateKaigi creates a call under a domain.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ar', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ar', 'guide', 'index.md'),
      `---\ntranslation_locale: ar\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Kaigi {#kaigi}\n\nينشئ CreateKaigi مكالمة ضمن نطاق.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [arabicLocale] })).not.toContain(
      'ar/guide/index.md: prose unit 2 contains semantic false friend: technical call rendered as a telephone call',
    )
  })

  test('allows telephone wording for a Kaigi call roster and public call view', async () => {
    const english =
      '# Kaigi\n\nUpdate the call roster. The public call view exposes commitment counts instead of account IDs.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ar', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ar', 'guide', 'index.md'),
      `---\ntranslation_locale: ar\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Kaigi {#kaigi}\n\nحدّث قائمة المكالمة. يعرض منظور المكالمة العام أعداد الالتزامات بدلًا من معرفات الحسابات.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [arabicLocale] })).not.toContain(
      'ar/guide/index.md: prose unit 2 contains semantic false friend: technical call rendered as a telephone call',
    )
  })

  test('checks inflected permission grants for subsidy wording', async () => {
    const english = '# Permissions\n\nThe role was granted permission to register accounts.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ja', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ja', 'guide', 'index.md'),
      `---\ntranslation_locale: ja\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# 権限 {#permissions}\n\nロールにはアカウント登録の補助金が付与されました。\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [japaneseLocale] })).toContain(
      'ja/guide/index.md: prose unit 2 contains semantic false friend: permission grant rendered as a subsidy',
    )
  })

  test('rejects an identifier alias rendered as analysis', async () => {
    const english = '# Aliases\n\nResolve the account alias before submitting.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ka', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ka', 'guide', 'index.md'),
      `---\ntranslation_locale: ka\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ანალიზი {#aliases}\n\nგაგზავნამდე ანგარიშის ანალიზი გადაწყვიტეთ.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [georgianLocale] })).toContain(
      'ka/guide/index.md: prose unit 1 contains semantic false friend: identifier alias rendered as anonymity',
    )
  })

  test('rejects a Bashkir identifier alias rendered as a fictitious name', async () => {
    const english = '# Aliases\n\nAccount alias lifecycle events are emitted.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ba', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ba', 'guide', 'index.md'),
      `---\ntranslation_locale: ba\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Ҡушаматтар {#aliases}\n\nХисаптың ялған исем тормош циклы ваҡиғалары сығарыла.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [bashkirLocale] })).toContain(
      'ba/guide/index.md: prose unit 2 contains semantic false friend: identifier alias rendered as anonymity',
    )
  })

  test('rejects an inflected technical commit rendered as a promise', async () => {
    const english = '# Finality\n\nThe block committed after quorum.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ja', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ja', 'guide', 'index.md'),
      `---\ntranslation_locale: ja\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ファイナリティ {#finality}\n\nブロックはクォーラムの後に約束された。\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [japaneseLocale] })).toContain(
      'ja/guide/index.md: prose unit 2 contains semantic false friend: technical commit rendered as an obligation',
    )
  })

  test('does not confuse Russian optional wording with an obligation', async () => {
    const english = '# Digest\n\nThe optional transfer digest commits the encoded preimage.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ru', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ru', 'guide', 'index.md'),
      `---\ntranslation_locale: ru\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Дайджест {#digest}\n\nНеобязательный дайджест передачи криптографически связывает закодированный прообраз.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [russianLocale] })).not.toContain(
      'ru/guide/index.md: prose unit 2 contains semantic false friend: technical commit rendered as an obligation',
    )
  })

  test('requires prose example identifiers to remain exact', async () => {
    const english = '# Example\n\nMouse grants Alice access while Mad Hatter audits the role.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Exemple {#example}\n\nLa souris accorde l’accès à Alicega pendant que le Chapelier Fou audite le rôle.\n`,
    )

    const errors = await validateI18n({ sourceRoot, locales: [testLocale] })
    for (const identifier of ['Mouse', 'Alice', 'Mad Hatter']) {
      expect(errors).toContain(
        `fr/guide/index.md: prose unit 2 must preserve example identifier ${identifier} exactly (expected 1, found 0)`,
      )
    }
  })

  test('allows locale suffixes after exact prose example identifiers', async () => {
    const english = '# Example\n\nAlice reviews Mad Hatter with Mouse.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'az', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'az', 'guide', 'index.md'),
      `---\ntranslation_locale: az\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Nümunə {#example}\n\nAlice’ga Mad Hatter’ga Mouse’un iştirakı ilə baxış keçirilir.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [azerbaijaniLocale] })).toEqual([])
  })

  test('rejects Azerbaijani networking and build terms left in English prose', async () => {
    const english = '# Build\n\nThe peers use the validator profile with the node/runtime build command.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'az', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'az', 'guide', 'index.md'),
      `---\ntranslation_locale: az\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Qurma {#build}\n\nşəbəkə peer-ləri validator profili ilə node/runtime build command istifadə edir.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [azerbaijaniLocale] })).toEqual(
      expect.arrayContaining([
        'az/guide/index.md: prose unit 2 contains semantic false friend: network peer left in English prose',
        'az/guide/index.md: prose unit 2 contains semantic false friend: consensus validator left in English prose',
        'az/guide/index.md: prose unit 2 contains semantic false friend: software runtime left in English prose',
        'az/guide/index.md: prose unit 2 contains semantic false friend: software build left in English prose',
      ]),
    )
  })

  test('rejects Azerbaijani bytes rendered as bits', async () => {
    const english = '# Encoding\n\nThe payload bytes are retained for audit.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'az', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'az', 'guide', 'index.md'),
      `---\ntranslation_locale: az\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Kodlaşdırma {#encoding}\n\nFaydalı yükün bitləri audit üçün saxlanılır.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [azerbaijaniLocale] })).toContain(
      'az/guide/index.md: prose unit 2 contains semantic false friend: bytes rendered as bits',
    )
  })

  test('rejects a cryptographic digest rendered as digestion', async () => {
    const english = '# Proofs\n\nParity commitments use BLAKE3 digests.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Preuves {#proofs}\n\nLes engagements de parité utilisent des digestifs BLAKE3.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: prose unit 2 contains semantic false friend: cryptographic digest rendered as digestive',
    )
  })

  test('rejects a testnet faucet rendered as a literal pipe', async () => {
    const english = '# Testnet\n\nClaim testnet XOR from the public faucet.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ar', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ar', 'guide', 'index.md'),
      `---\ntranslation_locale: ar\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# شبكة الاختبار {#testnet}\n\nاحصل على XOR من أنبوب الشبكة الاختبارية العامة.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [arabicLocale] })).toContain(
      'ar/guide/index.md: prose unit 2 contains semantic false friend: testnet faucet rendered as a window or pipe',
    )
  })

  test('rejects ledger translated as a software library', async () => {
    const english = '# Data model\n\nIroha stores ledger state in the World.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'mn', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'mn', 'guide', 'index.md'),
      `---\ntranslation_locale: mn\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Өгөгдлийн загвар {#data-model}\n\nIroha нь номын сангийн төлөвийг World-д хадгална.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [mongolianLocale] })).toContain(
      'mn/guide/index.md: prose unit 2 contains semantic false friend: ledger rendered as a software library',
    )
  })

  test('rejects ledger translated as a literal book', async () => {
    const english = '# Data model\n\nIroha stores ledger state in the World.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'az', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'az', 'guide', 'index.md'),
      `---\ntranslation_locale: az\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Məlumat modeli {#data-model}\n\nIroha kitabın vəziyyətini World-də saxlayır.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [azerbaijaniLocale] })).toContain(
      'az/guide/index.md: prose unit 2 contains semantic false friend: ledger rendered as a book or software library',
    )
  })

  test('rejects a Kazakh blockchain ledger rendered as a journal', async () => {
    const english = '# Data model\n\nIroha stores blockchain ledger state in the World.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'kk', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'kk', 'guide', 'index.md'),
      `---\ntranslation_locale: kk\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Деректер моделі {#data-model}\n\nIroha блокчейн журналының күйін World ішінде сақтайды.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [kazakhLocale] })).toContain(
      'kk/guide/index.md: prose unit 2 contains semantic false friend: ledger rendered as a book, journal, library, or swimming pool',
    )
  })

  test('rejects a technical concept rendered as a religious text', async () => {
    const english = '# Accounts\n\nList canonical account IDs from the public testnet.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'zh-hans', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'zh-hans', 'guide', 'index.md'),
      `---\ntranslation_locale: zh-hans\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# 账户 {#accounts}\n\n列出公共测试网中的规范圣经 IDs。\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [simplifiedChineseLocale] })).toContain(
      'zh-hans/guide/index.md: prose unit 2 contains semantic false friend: technical concept rendered as a religious text',
    )
  })

  test('rejects a protocol pool rendered as a swimming pool', async () => {
    const english = '# Settlement\n\nRotate the pool policy at the activation height.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'zh-hans', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'zh-hans', 'guide', 'index.md'),
      `---\ntranslation_locale: zh-hans\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# 结算 {#settlement}\n\n在激活高度轮换游泳池策略。\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [simplifiedChineseLocale] })).toContain(
      'zh-hans/guide/index.md: prose unit 2 contains semantic false friend: protocol pool rendered as a swimming pool',
    )
  })

  test('rejects protocol retirement rendered as employment retirement', async () => {
    const english = '# Storage\n\nRetired segments may be pruned after validation.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ja', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ja', 'guide', 'index.md'),
      `---\ntranslation_locale: ja\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ストレージ {#storage}\n\n退職したセグメントは検証後に削除できます。\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [japaneseLocale] })).toContain(
      'ja/guide/index.md: prose unit 2 contains semantic false friend: protocol retirement rendered as an employment pension',
    )
  })

  test('rejects a settlement leg rendered as an anatomical limb', async () => {
    const english = '# Settlement\n\nUpload each canonical settlement leg before finalization.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Règlement {#settlement}\n\nTéléversez chaque jambe canonique avant la finalisation.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: prose unit 2 contains semantic false friend: protocol leg rendered as an anatomical limb',
    )
  })

  test('accepts the Kazakh completion verb in a correctly translated settlement-leg sentence', async () => {
    const english = '# Settlement\n\nFinalize every settlement leg after validation.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'kk', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'kk', 'guide', 'index.md'),
      `---\ntranslation_locale: kk\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Есеп айырысу {#settlement}\n\nТексеруден кейін әрбір есеп айырысу бөлігін аяқтаңыз.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [kazakhLocale] })).not.toContain(
      'kk/guide/index.md: prose unit 2 contains semantic false friend: protocol leg rendered as an anatomical limb',
    )
  })

  test('rejects a technical commit rendered as an obligation', async () => {
    const english = '# Release evidence\n\nRecord the commit ID in the immutable artifact.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ar', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ar', 'guide', 'index.md'),
      `---\ntranslation_locale: ar\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# أدلة الإصدار {#release-evidence}\n\nسجّل معرّف الالتزام في الأثر الثابت.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [arabicLocale] })).toContain(
      'ar/guide/index.md: prose unit 2 contains semantic false friend: technical commit rendered as an obligation',
    )
  })

  test.each([
    {
      locale: georgianLocale,
      heading: 'საბოლოოობა',
      localized: 'ბლოკი ვალდებულად ჩაითვალა კვორუმის შემდეგ.',
    },
    {
      locale: armenianLocale,
      heading: 'Վերջնականություն',
      localized: 'Բլոկը քվորումից հետո պարտավորված է համարվել։',
    },
  ])('rejects $locale.key technical commits rendered as obligations', async ({ locale, heading, localized }) => {
    const english = '# Finality\n\nThe block committed after quorum.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, locale.path, 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, locale.path, 'guide', 'index.md'),
      `---\ntranslation_locale: ${locale.key}\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ${heading} {#finality}\n\n${localized}\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [locale] })).toContain(
      `${locale.path}/guide/index.md: prose unit 2 contains semantic false friend: technical commit rendered as an obligation`,
    )
  })

  test('rejects a technical unit rendered as kilometers', async () => {
    const english = '# Public inputs\n\nThe slot is converted to nanoseconds.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'dz', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'dz', 'guide', 'index.md'),
      `---\ntranslation_locale: dz\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# མི་མང་གི་ནང་དོན། {#public-inputs}\n\nslot འདི་ ཀི་ལོ་མི་ཊར་ལུ་བསྒྱུར་བཅོས་འབདཝ་ཨིན།\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [dzongkhaLocale] })).toContain(
      'dz/guide/index.md: prose unit 2 contains semantic false friend: technical concept rendered as a distance unit',
    )
  })

  test('rejects source-aligned Dzongkha technical false friends', async () => {
    const english =
      '# Runtime checks\n\nThe escrow code consumes gas from the event stream. The invoice lot uses a milestone lock.\n\nThe faucet funds test writes.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'dz', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'dz', 'guide', 'index.md'),
      `---\ntranslation_locale: dz\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# བརྟག་དཔྱད། {#runtime-checks}\n\nགཏེར་ཁའི་ ཀོ་བིཌ་གིས་ རྒྱུགས་ཆུ་ལས་ ས་སྣུམ་ལག་ལེན་འཐབ། གློ་བུར་གྱི་རྩིས་ཁྲའི་ སྣུམ་འཁོར་གིས་ མི་ལི་ཀྲོན་གྱི་ ལྡེ་མིག་ལག་ལེན་འཐབ།\n\nའfaucet་གིས་ བརྟག་དཔྱད་བྲིས་བཀོད་ལུ་དངུལ་སྤྲོདཔ་ཨིན།\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [dzongkhaLocale] })).toEqual(
      expect.arrayContaining([
        'dz/guide/index.md: prose unit 2 contains semantic false friend: escrow rendered as a mine',
        'dz/guide/index.md: prose unit 2 contains semantic false friend: software code rendered as COVID',
        'dz/guide/index.md: prose unit 2 contains semantic false friend: blockchain gas rendered as petroleum',
        'dz/guide/index.md: prose unit 2 contains semantic false friend: technical flow or stream rendered as a river',
        'dz/guide/index.md: prose unit 2 contains semantic false friend: invoice rendered as an emergency item',
        'dz/guide/index.md: prose unit 2 contains semantic false friend: RWA lot rendered as a vehicle',
        'dz/guide/index.md: prose unit 2 contains semantic false friend: milestone rendered as a particle',
        'dz/guide/index.md: prose unit 2 contains semantic false friend: technical lock rendered as a key',
        'dz/guide/index.md: prose unit 3 contains semantic false friend: faucet substitution spliced into a Dzongkha word',
      ]),
    )
  })

  test('rejects source-aligned Amharic technical false friends', async () => {
    const english =
      '# Runtime checks\n\nThe node loads the Rust crate through the pipeline before settlement.\n\nThe faucet response is stored in the metadata file.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# የአሂድ ጊዜ ማረጋገጫዎች {#runtime-checks}\n\nኖት የ Rust ሳጥንን በቧንቧ በኩል ከሰፈራው በፊት ይጭናል።\n\nየውሃ faucet ምላሽ በሜታዳታ faucetሉ ውስጥ ይቀመጣል።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toEqual(
      expect.arrayContaining([
        'am/guide/index.md: prose unit 2 contains semantic false friend: network node rendered as a note',
        'am/guide/index.md: prose unit 2 contains semantic false friend: Rust crate rendered as a physical box',
        'am/guide/index.md: prose unit 2 contains semantic false friend: software pipeline rendered as a water pipe',
        'am/guide/index.md: prose unit 2 contains semantic false friend: protocol settlement rendered as a colony',
        'am/guide/index.md: prose unit 3 contains semantic false friend: faucet wording retained literal water or corrupted the word for file',
      ]),
    )
  })

  test('rejects leaked English subword fragments inside Amharic prose', async () => {
    const english = '# Example\n\nUse the current profile.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ምሳሌ {#example}\n\nየአሁኑን ፕሮfile ይጠቀሙ።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toContain(
      'am/guide/index.md: prose unit 2 contains semantic false friend: Amharic prose contains a leaked English subword fragment',
    )
  })

  test('rejects Amharic documentation recipes and digests rendered as food terminology', async () => {
    const english = '# Verification\n\nThe recipe verifies the cryptographic digest.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ማረጋገጫ {#verification}\n\nየምግብ አሰራር ምስጠራ የምግብ መፍጫ እሴትን ያረጋግጣል።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toEqual(
      expect.arrayContaining([
        'am/guide/index.md: prose unit 2 contains semantic false friend: documentation recipe rendered as cooking instructions',
        'am/guide/index.md: prose unit 2 contains semantic false friend: cryptographic digest rendered as food digestion',
      ]),
    )
  })

  test('rejects additional source-aligned Amharic technical false friends', async () => {
    const english =
      '# Protocol terms\n\nThe token consumes an artifact. Check its sibling path, lineage, routing, payload, authority principal, commitment, digest, and receipt.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# የፕሮቶኮል ቃላት {#protocol-terms}\n\nማስመሰያ ቅርስ ይበላል። ወንድም እህት፣ ዘር ሐረግ፣ ማዞሪያ፣ የክፍያ ጭነት፣ የፍቃድ ርእሰ መምህር፣ ምስጠራ ቁርጠኝነት እሴት፣ ምስጠራ መፍጨት እሴት፣ የፕሮቶኮል ውጤት መዝገብ።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toEqual(
      expect.arrayContaining([
        'am/guide/index.md: prose unit 2 contains semantic false friend: technical token rendered as impersonation',
        'am/guide/index.md: prose unit 2 contains semantic false friend: software artifact rendered as a cultural relic',
        'am/guide/index.md: prose unit 2 contains semantic false friend: technical consumption rendered as eating',
        'am/guide/index.md: prose unit 2 contains semantic false friend: sibling tree path rendered as a brother and sister',
        'am/guide/index.md: prose unit 2 contains semantic false friend: protocol lineage rendered as genealogy',
        'am/guide/index.md: prose unit 2 contains semantic false friend: network routing rendered as rotation',
        'am/guide/index.md: prose unit 2 contains semantic false friend: technical payload rendered as a payment load',
        'am/guide/index.md: prose unit 2 contains semantic false friend: authorization principal rendered as a school principal',
        'am/guide/index.md: prose unit 2 contains semantic false friend: cryptographic commitment rendered as a personal obligation value',
        'am/guide/index.md: prose unit 2 contains semantic false friend: cryptographic digest rendered as food digestion',
        'am/guide/index.md: prose unit 2 contains semantic false friend: protocol receipt rendered as an over-expanded result record',
      ]),
    )
  })

  test('rejects inflected and severe Amharic technical false friends', async () => {
    const english =
      '# Cryptography\n\nThe fixtures and artifacts preserve lineage for the authority principal. Homomorphic encryption is a readiness blocker when the rounding mode differs in the stock Iroha CLI.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ምስጠራ {#cryptography}\n\nየሙከራ ቅርሶች፣ ቅርሶች፣ ዘር ሐረጉ፣ ርዕሰ መምህር፣ ግብረ-ሰዶማዊ ምስጠራ፣ ማገጃ፣ የማዞሪያ ሁነታ፣ አክሲዮኑ Iroha CLI።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toEqual(
      expect.arrayContaining([
        'am/guide/index.md: prose unit 2 contains semantic false friend: test fixture rendered as a cultural relic',
        'am/guide/index.md: prose unit 2 contains semantic false friend: software artifact rendered as a cultural relic',
        'am/guide/index.md: prose unit 2 contains semantic false friend: protocol lineage rendered as genealogy',
        'am/guide/index.md: prose unit 2 contains semantic false friend: authorization principal rendered as a school principal',
        'am/guide/index.md: prose unit 2 contains semantic false friend: homomorphic encryption rendered as homosexuality',
        'am/guide/index.md: prose unit 2 contains semantic false friend: readiness blocker rendered as a physical barrier',
        'am/guide/index.md: prose unit 2 contains semantic false friend: rounding mode rendered as rotation mode',
        'am/guide/index.md: prose unit 2 contains semantic false friend: stock CLI rendered as company stock',
      ]),
    )
  })

  test('validates translated home-page frontmatter against its aligned source field', async () => {
    const english = '---\nlayout: home\nfeatures:\n  - title: Reference\n    details: Consult the current binary and blockchain genesis reference pages\n---\n\n# Home\n'
    const { sourceRoot, hash } = await fixture(english, 'index.md')
    await mkdir(path.join(sourceRoot, 'am'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n\nlayout: home\nfeatures:\n  - title: ማጣቀሻ\n    details: የአሁኑን ሁለትዮሽ እና የብሎክቼይን ዘፍጥረት ማጣቀሻ ገጾችን ያማክሩ\n---\n\n# መነሻ {#home}\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toContain(
      'am/index.md: frontmatter field details 2 contains semantic false friend: blockchain genesis rendered as biblical creation',
    )
  })

  test('rejects Amharic state, fork, execution, and outbox false friends', async () => {
    const english = '# Processing\n\nThe state transition records a soft fork, two executions, and one outbox.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ማቀነባበር {#processing}\n\nየግዛት ሽግግር፣ ለስላሳ ሹካ፣ ሁለት ግድያዎች እና የወጪ ሳጥን።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toEqual(
      expect.arrayContaining([
        'am/guide/index.md: prose unit 2 contains semantic false friend: ledger state rendered as a country or sovereign state',
        'am/guide/index.md: prose unit 2 contains semantic false friend: protocol fork rendered as an eating utensil',
        'am/guide/index.md: prose unit 2 contains semantic false friend: software execution rendered as capital punishment',
        'am/guide/index.md: prose unit 2 contains semantic false friend: message outbox rendered as an unlabeled physical box',
      ]),
    )
  })

  test('rejects Amharic infrastructure terms rendered as physical false friends', async () => {
    const english =
      '# Consensus\n\nThe node reads the ledger and block balance on the control plane under proof-of-stake from genesis before a write.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ስምምነት {#consensus}\n\nመስቀለኛ መንገድ ደብተሩን እና የማገጃ ሚዛንን በመቆጣጠሪያ አውሮፕላን ላይ በአክሲዮን ማረጋገጫ ከዘፍጥረት ከጽሑፍ በፊት ያነባል።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toEqual(
      expect.arrayContaining([
        'am/guide/index.md: prose unit 2 contains semantic false friend: network or tree node rendered as a road intersection',
        'am/guide/index.md: prose unit 2 contains semantic false friend: ledger rendered as a book or software library',
        'am/guide/index.md: prose unit 2 contains semantic false friend: software plane rendered as an aircraft',
        'am/guide/index.md: prose unit 2 contains semantic false friend: proof-of-stake rendered as proof of company stock',
        'am/guide/index.md: prose unit 2 contains semantic false friend: blockchain block rendered as a physical barrier',
        'am/guide/index.md: prose unit 2 contains semantic false friend: account balance rendered as a weighing scale',
        'am/guide/index.md: prose unit 2 contains semantic false friend: blockchain genesis rendered as biblical creation',
        'am/guide/index.md: prose unit 2 contains semantic false friend: transaction write operation rendered as written text',
      ]),
    )
  })

  test('rejects inflected Amharic node, payload, and protocol-body false friends', async () => {
    const english =
      '# Recovery\n\nThe node receives payload chunks and recovers the canonical body.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# መልሶ ማግኛ {#recovery}\n\nመስቀለኛ መንገዱ የክፍያ ቁርጥራጮችን ተቀብሎ ሰውነቱን ይመልሳል።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toEqual(
      expect.arrayContaining([
        'am/guide/index.md: prose unit 2 contains semantic false friend: network or tree node rendered as a road intersection',
        'am/guide/index.md: prose unit 2 contains semantic false friend: technical payload rendered as a payment load',
        'am/guide/index.md: prose unit 2 contains semantic false friend: protocol body rendered as a corpse',
      ]),
    )
  })

  test('rejects additional Amharic protocol terms rendered as unrelated everyday concepts', async () => {
    const english =
      '# Encoding\n\nRecord the abort, block cadence, binary magic, erasure profile, mint operation, and issue time. Admission still fails closed, replay is idempotent, stable-pool activity is public, and execution is deterministic.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ኢንኮዲንግ {#encoding}\n\nፅንስ ማስወረድ፣ የብሎክ ቃና፣ አስማት፣ የመደምሰስ መገለጫ፣ አዝሙድናዊ እና የጉዳይ ጊዜ። መግቢያው አሁንም አልተዘጋም፣ ድጋሚ ማጫወቱም አስደሳች ነው፣ የተረጋጋ ገንዳ እንቅስቃሴ ይፋዊ ነው፣ እና አፈጻጸሙ ቆራጥ ነው።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toEqual(
      expect.arrayContaining([
        'am/guide/index.md: prose unit 2 contains semantic false friend: protocol abort rendered as a pregnancy termination',
        'am/guide/index.md: prose unit 2 contains semantic false friend: block cadence rendered as vocal tone',
        'am/guide/index.md: prose unit 2 contains semantic false friend: binary magic value rendered as sorcery',
        'am/guide/index.md: prose unit 2 contains semantic false friend: erasure coding rendered as deletion or destruction',
        'am/guide/index.md: prose unit 2 contains semantic false friend: token minting rendered as the mint herb',
        'am/guide/index.md: prose unit 2 contains semantic false friend: issuance time rendered as the time of a matter or case',
        'am/guide/index.md: prose unit 2 contains semantic false friend: fail-closed behavior rendered as failure to close or an inverted acceptance condition',
        'am/guide/index.md: prose unit 2 contains semantic false friend: idempotency rendered as uselessness, enjoyment, or thoughtfulness',
        'am/guide/index.md: prose unit 2 contains semantic false friend: protocol pool rendered as a pond or swimming pool',
        'am/guide/index.md: prose unit 2 contains semantic false friend: deterministic behavior rendered as decisiveness',
      ]),
    )
  })

  test('rejects Amharic operational fallbacks and identifiers rendered as unrelated everyday concepts', async () => {
    const english =
      '# Recovery\n\nCheck nullifiers and the vanity host fallback. Disable curl buffering and test the manual WebRTC fallback.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# መልሶ ማግኛ {#recovery}\n\nከንቱዎችን እና የከንቱነት አስተናጋጅ ውድቀትን ይፈትሹ። curl ማቋረጥን ያሰናክሉ እና መመሪያ WebRTC ውድቀትን ይፈትሹ።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toEqual(
      expect.arrayContaining([
        'am/guide/index.md: prose unit 2 contains semantic false friend: fallback behavior rendered as a failure',
        'am/guide/index.md: prose unit 2 contains semantic false friend: cryptographic nullifier rendered as vanity or uselessness',
        'am/guide/index.md: prose unit 2 contains semantic false friend: custom vanity hostname rendered as futility or vanity',
        'am/guide/index.md: prose unit 2 contains semantic false friend: I/O buffering rendered as termination',
        'am/guide/index.md: prose unit 2 contains semantic false friend: manual fallback rendered as an instruction manual',
      ]),
    )
  })

  test('rejects inflected Amharic written-text wording for transaction writes', async () => {
    const english = '# Operation\n\nProve the write.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ክዋኔ {#operation}\n\nጽሁፉን ያረጋግጡ።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toContain(
      'am/guide/index.md: prose unit 2 contains semantic false friend: transaction write operation rendered as written text',
    )
  })

  test('rejects an Amharic blockchain block rendered as blocking or prohibition', async () => {
    const english = '# Finality\n\nThe block has a block header.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# መጨረሻነት {#finality}\n\nእገዳው የአግድ ራስጌ አለው።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toContain(
      'am/guide/index.md: prose unit 2 contains semantic false friend: blockchain block rendered as blocking or prohibition',
    )
  })

  test('accepts the native Amharic wording for a pinned source-code revision', async () => {
    const english = '# Source\n\nUse the implementation at the pinned commit.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'am', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'am', 'guide', 'index.md'),
      `---\ntranslation_locale: am\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# ምንጭ {#source}\n\nበተሰካው የምንጭ-ኮድ ክለሳ ላይ ያለውን ትግበራ ይጠቀሙ።\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [amharicLocale] })).toEqual([])
  })

  test('rejects source-aligned Bashkir technical false friends', async () => {
    const english =
      '# Runtime checks\n\nThe caller sends a canonical Rust crate through the pipeline.\n\nThe local code loads secrets before the commit.\n'
    const { sourceRoot, hash } = await fixture(english)
    await mkdir(path.join(sourceRoot, 'ba', 'guide'), { recursive: true })
    await writeFile(
      path.join(sourceRoot, 'ba', 'guide', 'index.md'),
      `---\ntranslation_locale: ba\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Эш ваҡыты тикшереүҙәре {#runtime-checks}\n\nШылтыратыусы ҡануни Rust һандығын торба аша ебәрә.\n\nЛокаль код серҙәрҙе commit итә һәм commit-ты көтә.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [bashkirLocale] })).toEqual(
      expect.arrayContaining([
        'ba/guide/index.md: prose unit 2 contains semantic false friend: software caller rendered as a telephone caller',
        'ba/guide/index.md: prose unit 2 contains semantic false friend: canonical encoding rendered as legal or lawful',
        'ba/guide/index.md: prose unit 2 contains semantic false friend: Rust crate rendered as a physical box',
        'ba/guide/index.md: prose unit 2 contains semantic false friend: software pipeline rendered as a water pipe',
        'ba/guide/index.md: prose unit 3 contains semantic false friend: data loading corrupted into a Git commit',
      ]),
    )
  })

  test('rejects a translated prose unit that loses its list marker', async () => {
    const english = '# Guide\n\n- Keep the signer key offline.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nConservez la clé du signataire hors ligne.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: prose unit 2 has structural marker drift (expected list, found plain)',
    )
  })

  test('rejects an untranslated descriptive English heading', async () => {
    const english = '# Security Guide\n\nCurrent English source.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Security Guide {#security-guide}\n\nSource française actuelle.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: heading 1 is an untranslated English fallback',
    )
  })

  test('allows exact code directives, display math, and link-only navigation', async () => {
    const english =
      '# Guide\n\nTexte anglais de contrôle.\n\n<<< @/snippets/example.rs\n\n- \\(x + y = z\\)\n\n[API reference](/reference/index.md)\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nTexte français de contrôle.\n\n<<< @/snippets/example.rs\n\n- \\(x + y = z\\)\n\n[API reference](/reference/index.md)\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toEqual([])
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

  test('rejects code spans that lose wildcard or separator characters', async () => {
    const english = '# Guide\n\nUse `/v1/accounts/*` with `StructName__TraitName__MethodName` and `iroha.*`.\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nUtilisez \`/v1/accounts/\` avec \`StructNameTraitNameMethodName\` et \`iroha.\`.\n`,
    )

    const errors = await validateI18n({ sourceRoot, locales: [testLocale] })
    expect(errors).toContain('fr/guide/index.md: inline code count drift for /v1/accounts/* (expected 1, found 0)')
    expect(errors).toContain(
      'fr/guide/index.md: inline code count drift for StructName__TraitName__MethodName (expected 1, found 0)',
    )
    expect(errors).toContain('fr/guide/index.md: inline code count drift for iroha.* (expected 1, found 0)')
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

  test('rejects a leaked translation placeholder even when its delimiters were corrupted', async () => {
    const { sourceRoot, hash } = await fixture()
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nSource française [PH000000).\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: leaked translation placeholder token',
    )
  })

  test('rejects prose contaminated by an unexpected writing script', async () => {
    const { sourceRoot, hash } = await fixture()
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nSource française avec un mot артеfact corrompu.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: prose unit 2 contains unexpected writing script: Cyrillic',
    )
  })

  test('rejects contamination from scripts outside the original audit set', async () => {
    const { sourceRoot, hash } = await fixture()
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nSource française avec un fragment සලකා corrompu.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: prose unit 2 contains unexpected writing script: Sinhala',
    )
  })

  test('rejects a malformed localized link that drops its Markdown destination', async () => {
    const english = '# Guide\n\nSee [the reference](/reference/index.md).\n'
    const { sourceRoot, hash } = await fixture(english)
    await writeFile(
      path.join(sourceRoot, 'fr', 'guide', 'index.md'),
      `---\ntranslation_locale: fr\ntranslation_source: /guide/index.md\ntranslation_source_hash: ${hash}\ntranslation_status: machine-validated\n---\n# Guide {#guide}\n\nVoir la référence](/fr/reference/index.md)[ maintenant.\n`,
    )

    expect(await validateI18n({ sourceRoot, locales: [testLocale] })).toContain(
      'fr/guide/index.md: Markdown link inventory drift (expected 1, found 0)',
    )
  })
})
