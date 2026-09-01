import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { TRANSLATED_LOCALES, type DocsLocale } from './locales'
import { unexpectedWritingScripts } from './i18n-writing-scripts'
import {
  markdownContainerDirectives,
  markdownHeadings,
  markdownTranslationUnits,
  isPreservedTechnicalLinkLabel,
  sentenceCount,
  sentenceCoverageMinimumRatio,
  technicalIdentifiers,
  translationMinimumRatio,
} from './translate'

export const TRANSLATION_STATUS = 'machine-validated'

interface TranslationMetadata {
  translation_locale?: string
  translation_source?: string
  translation_source_hash?: string
  translation_status?: string
}

interface I18nValidationOptions {
  sourceRoot?: string
  locales?: readonly DocsLocale[]
}

async function markdownFiles(directory: string, relative = ''): Promise<string[]> {
  const absolute = path.join(directory, relative)
  let entries
  try {
    entries = await readdir(absolute, { withFileTypes: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const child = path.posix.join(relative.split(path.sep).join('/'), entry.name)
      if (entry.isDirectory()) return markdownFiles(directory, child)
      return entry.isFile() && entry.name.endsWith('.md') ? [child] : []
    }),
  )
  return files.flat().sort()
}

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

function parseFrontmatter(content: string): { metadata: TranslationMetadata; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(content)
  if (!match) return { metadata: {}, body: content }

  const metadata: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/u)) {
    const field = /^([a-z][a-z0-9_]*):\s*(.*?)\s*$/u.exec(line)
    if (!field) continue
    metadata[field[1]] = field[2].replace(/^(['"])(.*)\1$/u, '$2')
  }
  return { metadata, body: content.slice(match[0].length) }
}

interface TranslatableFrontmatterField {
  key: string
  value: string
}

const TRANSLATABLE_FRONTMATTER_KEYS = new Set(['alt', 'details', 'tagline', 'text', 'title'])

function normalizedFrontmatterScalar(value: string): string {
  const trimmed = value.trim()
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (typeof parsed === 'string') return parsed
    } catch {
      // Keep malformed or non-JSON YAML scalars visible to the validator.
    }
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).replaceAll("''", "'")
  return trimmed
}

function translatableFrontmatterFields(content: string): TranslatableFrontmatterField[] {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(content)
  if (!match) return []

  const lines = match[1].split(/\r?\n/u)
  const fields: TranslatableFrontmatterField[] = []
  for (let index = 0; index < lines.length; index += 1) {
    const field = /^(\s*(?:-\s*)?)([a-z][a-z0-9_-]*):(?:\s*(.*))?$/iu.exec(lines[index])
    if (!field) continue

    const [, indentation, key, inlineValue = ''] = field
    if (!TRANSLATABLE_FRONTMATTER_KEYS.has(key)) continue
    const continuation: string[] = []
    const fieldIndent = indentation.length
    while (index + 1 < lines.length) {
      const next = lines[index + 1]
      const nextIndent = /^\s*/u.exec(next)?.[0].length ?? 0
      if (!next.trim() || nextIndent <= fieldIndent) break
      continuation.push(next.trim())
      index += 1
    }
    const value = normalizedFrontmatterScalar([inlineValue.trim(), ...continuation].filter(Boolean).join(' '))
    if (value) fields.push({ key, value })
  }
  return fields
}

function contentWithoutTranslationMetadata(content: string): string {
  const normalized = content.replace(/\r\n/gu, '\n').replace(/\s+\{#[A-Za-z_][\w:.-]*\}(?=\s*$)/gmu, '')
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/u.exec(normalized)
  if (!match) return normalized.trim()

  const retainedFrontmatter = match[1].split('\n').filter((line) => !/^translation_[a-z0-9_]+:\s*/u.test(line))
  while (retainedFrontmatter[0]?.trim() === '') retainedFrontmatter.shift()
  while (retainedFrontmatter.at(-1)?.trim() === '') retainedFrontmatter.pop()
  const body = normalized.slice(match[0].length)
  if (retainedFrontmatter.length === 0) return body.trim()
  return [`---`, ...retainedFrontmatter, `---`, body].join('\n').trim()
}

function runawayRepeatedText(content: string): string | undefined {
  const prose = content
    .replace(/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*(?:\n|$)/gmu, ' ')
    .replace(/^.*\|.*$/gmu, ' ')
    .replace(/\]\((?:\\.|[^)\n])+\)/gu, ']')
    .replace(/`+[\s\S]*?`+/gu, ' ')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/giu, ' ')
    .replace(/<[^>\n]+>/gu, ' ')
    .replace(/\bhttps?:\/\/[^\s<>)\]]+/giu, ' ')
  const tokens = [...prose.matchAll(/[\p{L}\p{M}]+/gu)].map((match) => match[0].toLocaleLowerCase())

  for (let start = 0; start < tokens.length; start += 1) {
    for (let width = 1; width <= 8 && start + width <= tokens.length; width += 1) {
      const requiredRepeats = width === 1 ? 8 : 4
      let repeats = 1
      while (repeats < requiredRepeats && start + width * (repeats + 1) <= tokens.length) {
        const offset = start + width * repeats
        if (!tokens.slice(start, start + width).every((token, index) => token === tokens[offset + index])) break
        repeats += 1
      }
      if (repeats === requiredRepeats) return tokens.slice(start, start + width).join(' ')
    }
  }
  return undefined
}

function letterCount(content: string): number {
  return [...content.matchAll(/[\p{L}\p{M}]/gu)].length
}

function untranslatedEnglishFallback(source: string, localized: string, heading = false): boolean {
  const normalizedSource = source.trim()
  if (normalizedSource !== localized.trim()) return false
  if (!heading) {
    if (/^ {0,3}#{1,6}[ \t]+/u.test(normalizedSource)) return false
    if (/^\|/u.test(normalizedSource) || /^</u.test(normalizedSource) || /^<<<[ \t]/u.test(normalizedSource)) {
      return false
    }
    if (/^[-*+][ \t]+\\\(/u.test(normalizedSource)) return false
    if (/^(?:[-*+][ \t]+)?\[[^\]]+\]\([^\n]+\)$/u.test(normalizedSource)) return false
  }

  const visible = normalizedSource
    .replace(/^ {0,3}#{1,6}[ \t]+/u, ' ')
    .replace(/\s*\{#[A-Za-z_][\w:.-]*\}\s*$/u, ' ')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/`[^`]*`/gu, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/https?:\/\/\S+/gu, ' ')
  const asciiLetters = [...visible.matchAll(/[A-Za-z]/gu)].length
  const asciiWords = visible.match(/[A-Za-z]{2,}/gu)?.length ?? 0
  return asciiLetters >= (heading ? 8 : 15) && asciiWords >= (heading ? 2 : 3)
}

const STRONG_ENGLISH_WORDS = new Set([
  'after',
  'and',
  'are',
  'before',
  'by',
  'each',
  'every',
  'for',
  'from',
  'if',
  'into',
  'is',
  'must',
  'not',
  'of',
  'only',
  'should',
  'than',
  'that',
  'the',
  'then',
  'these',
  'this',
  'those',
  'to',
  'using',
  'when',
  'while',
  'will',
  'with',
  'without',
  'your',
])

function visibleAsciiWords(content: string): string[] {
  const visible = content
    .replace(/`[^`]*`/gu, ' ')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/https?:\/\/\S+/gu, ' ')
    .replace(/\{#[A-Za-z_][\w:.-]*\}/gu, ' ')
  return (visible.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/gu) ?? []).map((word) => word.toLocaleLowerCase())
}

function embeddedEnglishFallback(source: string, localized: string): string | undefined {
  const sourceWords = visibleAsciiWords(source)
  const localizedWords = visibleAsciiWords(localized)
  const runLength = 5
  if (sourceWords.length < runLength || localizedWords.length < runLength) return undefined

  const localizedRuns = new Set<string>()
  for (let index = 0; index <= localizedWords.length - runLength; index += 1) {
    localizedRuns.add(localizedWords.slice(index, index + runLength).join('\u0000'))
  }
  for (let index = 0; index <= sourceWords.length - runLength; index += 1) {
    const run = sourceWords.slice(index, index + runLength)
    if (run.some((word) => STRONG_ENGLISH_WORDS.has(word)) && localizedRuns.has(run.join('\u0000'))) {
      return run.join(' ')
    }
  }
  return undefined
}

interface SemanticFalseFriendRule {
  source: RegExp
  localized: RegExp
  unlessSource?: RegExp
  unlessLocalized?: RegExp
  description: string
}

const ANATOMICAL_PROTOCOL_LEG: Readonly<Partial<Record<string, RegExp>>> = {
  es: /\b(?:piernas?|pies)\b/iu,
  pt: /\b(?:pernas?|pés?)\b/iu,
  fr: /\b(?:jambes?|pieds?)\b/iu,
  ru: /\bног(?:а|и|у|ой|е|ам|ами|ах)\b/iu,
  ar: /(?:ساق|قدم)/u,
  ur: /ٹانگ/u,
  ja: /[脚足]/u,
  he: /רגל/u,
  my: /ခြေထောက်/u,
  ka: /ფეხ\p{L}*/iu,
  hy: /(?<!\p{L})(?:ոտք|մետր)\p{L}*/iu,
  az: /ayaq\p{L}*/iu,
  // Kazakh uses аяқта- for "finish/complete". Keep that verb (and аяққы,
  // "final") out of the anatomical-limb detector while still catching аяқ
  // and its noun inflections when a protocol leg is mistranslated literally.
  kk: /аяқ(?!та|қы)\p{L}*/iu,
  ba: /аяҡ\p{L}*/iu,
  am: /(?:እግር|እግሮ)/u,
  dz: /རྐང/u,
  uz: /oyoq\p{L}*/iu,
  mn: /\bхөл\p{L}*/iu,
  'zh-hans': /[脚腿足]/u,
  'zh-hant': /[腳腿足]/u,
}

const TECHNICAL_COMMIT_AS_OBLIGATION: Readonly<Partial<Record<string, RegExp>>> = {
  ru: /(?<!\p{L})(?:обязательн|обязу)\p{L}*/iu,
  ar: /(?:ال)?(?:التزام|تعهّد|تعهد)\p{Script=Arabic}*/u,
  ur: /\p{Script=Arabic}*(?:ذمہ|عہد)\p{Script=Arabic}*/u,
  ja: /約束/u,
  he: /\p{Script=Hebrew}*(?:מחויב|התחייב)\p{Script=Hebrew}*/u,
  my: /\p{Script=Myanmar}*(?:ကတိ|တာဝန်)\p{Script=Myanmar}*/u,
  ka: /ვალდებულ\p{L}*/iu,
  hy: /պարտավոր\p{L}*/iu,
  ba: /йөкләмә\p{L}*/iu,
  am: /ግዴታ\p{L}*/u,
  'zh-hans': /(?:承诺|义务)/u,
  'zh-hant': /(?:承諾|義務)/u,
}

const PAYLOAD_AS_UTILITY: Readonly<Partial<Record<string, RegExp>>> = {
  ar: /(?:ال)?(?:حمولة|حملات|أحمال|حمل|حملة)\s+الفائدة/u,
  ur: /فائدہ مند بوجھ/u,
  ja: /(?:メリットロード|(?:^|[。.!?！？\n])\s*負荷(?:は|が)|(?:有効|使用)負荷)/u,
  he: /(?:עומס(?:י)? תועלת|עומס התועלת|חומרי תועלת)/u,
  my: /အကျိုးဆောင်(?:ဝန်ဆောင်မှု|ဝန်ပိုး)/u,
  am: /የጥቅም ጭነት/u,
  dz: /(?:སྦྲེལ་ཡོད་པའི་)?ཕན་ཐོགས(?:་མེད་པའི་payload|་ཆེ་བའི་payload|་ཅན(?:་གྱི)?་(?:མཁོ་ཆས|ཁེ་རྒུད|ཅ་ལ)|་ཅན་དང་)/u,
}

const LEDGER_QUERY_AS_QUESTION: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?<!\p{L})preguntas?(?!\p{L})/iu,
  pt: /(?<!\p{L})quest(?:ão|ões)(?!\p{L})/iu,
  fr: /(?<!\p{L})questions?(?!\p{L})/iu,
  ru: /(?<!\p{L})вопрос\p{L}*/iu,
  ar: /(?:^|[^\p{L}])(?:ال)?(?:سؤال|أسئلة|سؤالات?)(?:$|[^\p{L}])/u,
  ur: /(?:^|[^\p{L}])سوال(?:ات|وں)?(?:$|[^\p{L}])/u,
  ja: /(?:質問|疑問|尋問)/u,
  he: /(?:^|[^\p{L}])(?:שאל(?:ה|ות|ת|ון|ונים|ונות|ים)?|תשאלו|שאלו|חקיר(?:ה|ות))(?:$|[^\p{L}])/u,
  my: /မေးခွန်း(?:များ)?/u,
  ka: /გამოკითხვ/u,
  hy: /(?:Հարցազրույց|հարցաքնն|(?<!\p{L})հարց(?:եր|երով|երի|նել|նում|րեք)?(?!\p{L}))/iu,
  az: /(?<!\p{L})sual\p{L}*/iu,
  kk: /сұрақ\p{L}*/iu,
  uz: /(?<!\p{L})savol\p{L}*/iu,
  'zh-hans': /问题/u,
  'zh-hant': /問題/u,
}

const CORRECT_LEDGER_QUERY_TERM: Readonly<Partial<Record<string, RegExp>>> = {
  ru: /(?<!\p{L})запрос\p{L}*/iu,
}

const PIPELINE_AS_WATER_PIPE: Readonly<Partial<Record<string, RegExp>>> = {
  es: /\b(?:tuberías?|cañerías?)\b/iu,
  pt: /\b(?:tubulações?|canos?)\b/iu,
  fr: /\b(?:tuyaux?|canalisations?)\b/iu,
  ru: /(?:трубопровод|(?<!\p{L})труб[аы])\p{L}*/iu,
  ar: /(?:خطوط? الأنابيب|أنبوب)/u,
  he: /צינור/u,
  ka: /მილსადენ/u,
  hy: /խողովակաշար/iu,
  az: /(?:boru (?:kəmər|xətt)|(?<!\p{L})kəmər\p{L}*)/iu,
  kk: /құбыр(?:жол)?\p{L}*/iu,
  uz: /(?<!\p{L})quvur\p{L}*/iu,
}

const IDENTIFIER_ALIAS_AS_ANONYMITY: Readonly<Partial<Record<string, RegExp>>> = {
  fr: /(?:prénoms?|nom de famille|anonymat)/iu,
  ru: /прозвищ\p{L}*/iu,
  ar: /(?:الاسم|مساحة البيانات) المجهول/u,
  ja: /匿名/u,
  my: /အမည်မဖော်/u,
  ka: /(?:ალექსანდრ|საიდუმლო|(?<!\p{L})ანალიზ)\p{L}*/iu,
  ba: /ялған исем\p{L}*/iu,
}

const WALL_CLOCK_AS_PHYSICAL_CLOCK: Readonly<Partial<Record<string, RegExp>>> = {
  pt: /relógio(?:s)? de parede/iu,
  fr: /horloge(?:s)? murale(?:s)?/iu,
  ru: /настенн\p{L}* час\p{L}*/iu,
  ar: /ساعة الحائط/u,
  ja: /壁時計/u,
  my: /နံရံ(?:ကပ်)?နာရီ/u,
  ka: /კედლის საათ/iu,
  az: /divar saat\p{L}*/iu,
  kk: /қабырға сағат\p{L}*/iu,
  ba: /стена сәғәт\p{L}*/iu,
  am: /የግድግዳ ሰዓት/u,
  uz: /devor soat\p{L}*/iu,
}

const TECHNICAL_STATE_AS_COUNTRY: Readonly<Partial<Record<string, RegExp>>> = {
  ar: /(?:^|[^\p{L}])(?:ال)?دول(?:ة|ات)?(?:$|[^\p{L}])/u,
  ur: /ریاست/u,
  ja: /(?:世界国|世界外国)/u,
  he: /(?:מדינת|מדינות)/u,
  ba: /дәүләт\p{L}*/iu,
  am: /ግዛት/u,
}

const TECHNICAL_BODY_AS_CORPSE: Readonly<Partial<Record<string, RegExp>>> = {
  ar: /(?:^|[^\p{L}])(?:ال)?(?:جثة|جثث)(?:$|[^\p{L}])/u,
  he: /(?:^|[^\p{L}])(?:גופה|גופות)(?:$|[^\p{L}])/u,
  az: /(?<!\p{L})(?:cəsəd|meyit)\p{L}*/iu,
  kk: /мәйіт\p{L}*/iu,
  am: /(?:ሰውነት|ሰውነቱ)/u,
  uz: /(?<!\p{L})jasad\p{L}*/iu,
}

const CRYPTO_HASH_AS_HASHISH: Readonly<Partial<Record<string, RegExp>>> = {
  ar: /(?:^|[^\p{L}])(?:ال)?حشيش(?:ة|ات)?(?:$|[^\p{L}])/u,
  he: /(?:^|[^\p{L}])חשיש(?:י|ים)?(?:$|[^\p{L}])/u,
}

const PROTOCOL_FORK_AS_UTENSIL: Readonly<Partial<Record<string, RegExp>>> = {
  ru: /(?<!\p{L})вилк\p{L}*/iu,
  am: /ሹካ/u,
}

const TOKEN_MINT_AS_HERB: Readonly<Partial<Record<string, RegExp>>> = {
  ru: /(?<!\p{L})мят\p{L}*/iu,
  am: /አዝሙድ/u,
}

const TOKEN_MINT_AS_MINING: Readonly<Partial<Record<string, RegExp>>> = {
  pt: /minagem/iu,
}

const TECHNICAL_EXECUTION_AS_CAPITAL_PUNISHMENT: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?:pena de muerte|fusilad|ejecución capital)/iu,
  pt: /(?:pena de morte|fuzilad|execução capital)/iu,
  fr: /(?:peine de mort|exécution capitale|fusill)\p{L}*/iu,
  ru: /казн\p{L}*/iu,
  ar: /إعدام/u,
  ur: /(?:پھانسی|سزائے موت)/u,
  ja: /(?:処刑|死刑)/u,
  he: /הוצאה להורג/u,
  my: /ကွပ်မျက်/u,
  ka: /სიკვდილით დასჯ\p{L}*/iu,
  hy: /մահապատժ\p{L}*/iu,
  az: /(?<!\p{L})edam\p{L}*/iu,
  kk: /өлім жаз\p{L}*/iu,
  ba: /үлем яза\p{L}*/iu,
  am: /(?:(?:የ)?ሞት ቅጣት|ግድያ)/u,
  uz: /(?:o['’]lim jazosi|(?<!\p{L})qatl(?:ni|ga|dan|ning)?(?!\p{L}))/iu,
  mn: /цаазаар\p{L}*/iu,
  'zh-hant': /(?:死刑|處決)/u,
  'zh-hans': /(?:死刑|处决)/u,
}

const SOFTWARE_SHELL_AS_SEASHELL: Readonly<Partial<Record<string, RegExp>>> = {
  pt: /(?<!\p{L})conchas?(?!\p{L})/iu,
  fr: /(?<!\p{L})coquilles?(?!\p{L})/iu,
}

const EVENT_TRIGGER_AS_FIREARM: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?<!\p{L})gatillos?(?!\p{L})/iu,
  uz: /(?<!\p{L})o['’]chirgich\p{L}*/iu,
}

const PROTOCOL_POOL_AS_RECREATION: Readonly<Partial<Record<string, RegExp>>> = {
  ur: /تالاب/u,
  ka: /(?:აუზ|ბილიკ)\p{L}*/iu,
}

const FINANCIAL_BALANCE_AS_PHYSICAL_SCALE: Readonly<Partial<Record<string, RegExp>>> = {
  ar: /ميزان\p{L}*/u,
}

const PROTOCOL_SETTLEMENT_AS_HABITATION: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?<!\p{L})asentamiento\p{L}*/iu,
  ar: /استيطان/u,
  ka: /დასახლებ\p{L}*/iu,
  az: /məskunlaş\p{L}*/iu,
  kk: /елді мекен/iu,
}

const PROTOCOL_LANE_AS_ROAD: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?<!\p{L})(?:calle|carretera)\p{L}*/iu,
  pt: /(?<!\p{L})estrada\p{L}*/iu,
  fr: /voies? de route/iu,
  ar: /شارع/u,
  he: /כביש/u,
  hy: /փողոց\p{L}*/iu,
  dz: /འགྲུལ་ལམ/u,
}

const NETWORK_NODE_AS_REGISTRATION: Readonly<Partial<Record<string, RegExp>>> = {
  az: /(?:Qeydiyyat(?:dan|da|ın|lı)?|qovuş\p{L}*|(?<!\p{L})bağ(?:ın|ların)?(?!\p{L})|dənə\p{L}*|Kütlə|nöqtə-lokal)/iu,
}

const IDENTIFIER_HANDLE_AS_DOOR_HANDLE: Readonly<Partial<Record<string, RegExp>>> = {
  fr: /(?<!\p{L})poignées?(?!\p{L})/iu,
  my: /လက်ကိုင်/u,
}

const DATA_TOMBSTONE_AS_GRAVESTONE: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?:lápid|piedra tumb|tumba)\p{L}*/iu,
  pt: /(?:lápid|túmul)\p{L}*/iu,
  fr: /(?:pierre tombale|tombe)\p{L}*/iu,
  ru: /(?:надгроб|могил)\p{L}*/iu,
  ar: /قبر/u,
  ur: /قبر/u,
  ja: /墓/u,
  he: /(?:קבר|מצבה)/u,
  my: /သင်္ချိုင်းကျောက်/u,
  ka: /(?:საფლავ|სამარ)\p{L}*/iu,
  hy: /գերեզման\p{L}*/iu,
  az: /(?:məzar|qəbir)\p{L}*/iu,
  kk: /(?:құлпытас|қабір)\p{L}*/iu,
  ba: /ҡәбер\p{L}*/iu,
  am: /መቃብር/u,
  dz: /དུར/u,
  uz: /(?<!\p{L})(?:qabr|qabriston)\p{L}*/iu,
  mn: /булш\p{L}*/iu,
  'zh-hans': /墓/u,
  'zh-hant': /墓/u,
}

const CRYPTO_SIGNER_AS_SUBSCRIBER: Readonly<Partial<Record<string, RegExp>>> = {
  fr: /(?:souscripteur|abonné)\p{L}*/iu,
  ru: /(?:подписчик|подписител)\p{L}*/iu,
}

const RUST_CRATE_AS_PHYSICAL_BOX: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?<!\p{L})caja\p{L}*/iu,
  pt: /(?<!\p{L})caixa\p{L}*/iu,
  fr: /(?<!\p{L})(?:boîte|caisse)\p{L}*/iu,
  ru: /(?:ящик|коробк)\p{L}*/iu,
  ar: /صندوق/u,
  ja: /箱/u,
  ka: /ყუთ\p{L}*/iu,
  az: /(?<!\p{L})qutu\p{L}*/iu,
  kk: /коробк\p{L}*/iu,
  ba: /коробк\p{L}*/iu,
  dz: /སྒྲོམ/u,
  uz: /(?<!\p{L})qut\p{L}*/iu,
  mn: /хайрцаг\p{L}*/iu,
  'zh-hans': /箱/u,
  'zh-hant': /箱/u,
}

const NETWORK_FEE_AS_HONORARIUM: Readonly<Partial<Record<string, RegExp>>> = {
  es: /honorari\p{L}*/iu,
  fr: /honoraires?/iu,
}

const PROTOCOL_QUOTE_AS_QUOTATION: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?<!\p{L})cita\p{L}*(?!\p{L})/iu,
  pt: /(?:citaç|(?<!\p{L})citar)\p{L}*/iu,
  fr: /(?:citation|(?<!\p{L})citer)\p{L}*/iu,
  ru: /цитат\p{L}*/iu,
  ar: /اقتباس/u,
  ur: /اقتباس/u,
  ja: /引用/u,
  he: /ציטוט/u,
  my: /ကိုးကား/u,
  ka: /ციტატ\p{L}*/iu,
  hy: /մեջբեր\p{L}*/iu,
  az: /(?<!\p{L})sitat\p{L}*/iu,
  ba: /цитат\p{L}*/iu,
  am: /ጥቅስ/u,
  'zh-hans': /引用/u,
  'zh-hant': /引用/u,
}

const CORRECT_PROTOCOL_QUOTE_TERM: Readonly<Partial<Record<string, RegExp>>> = {
  'zh-hans': /报价/u,
  'zh-hant': /報價/u,
}

const TRANSACTION_SCAFFOLD_AS_CONSTRUCTION_SCAFFOLD: Readonly<Partial<Record<string, RegExp>>> = {
  es: /andami\p{L}*/iu,
  pt: /andaime\p{L}*/iu,
  fr: /échafaudage\p{L}*/iu,
  'zh-hans': /(?:脚手架|架子)/u,
  'zh-hant': /(?:腳手架|架子)/u,
}

const DOWNSTREAM_AS_RIVER: Readonly<Partial<Record<string, RegExp>>> = {
  ar: /(?:أسفل|تحت) النهر/u,
  dz: /འོག་གི་ཆུ་རྒྱུན/u,
}

const SOURCE_CHECKOUT_AS_CASH_REGISTER: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?:caja(?: de)? (?:fuente|código|espacio)|pago de la fuente)/iu,
  pt: /caixa(?: de| do)? (?:fonte|espaço)/iu,
  fr: /(?<!\p{L})caisse\p{L}*/iu,
  az: /(?<!\p{L})kassa\p{L}*/iu,
  uz: /(?<!\p{L})kassa\p{L}*/iu,
  'zh-hans': /(?:收银|结账)/u,
  'zh-hant': /(?:收銀|結帳)/u,
}

const WEBRTC_OFFER_AS_PRICE_QUOTE: Readonly<Partial<Record<string, RegExp>>> = {
  'zh-hans': /WebRTC\s*的报价/u,
  'zh-hant': /WebRTC\s*的報價/u,
}

const SOFTWARE_SNAPSHOT_AS_PHOTOGRAPH: Readonly<Partial<Record<string, RegExp>>> = {
  ja: /写真/u,
  he: /(?:תמונות(?! מצב)|תמונה(?!\p{L}))/u,
  my: /ဓာတ်ပုံ/u,
  ka: /ფოტო\p{L}*/iu,
  hy: /լուսանկար\p{L}*/iu,
  az: /fotoşəkil\p{L}*/iu,
  kk: /фотосурет\p{L}*/iu,
  ba: /фотоһүрәт\p{L}*/iu,
  am: /ፎቶ/u,
  uz: /fotosurat\p{L}*/iu,
}

const SOFTWARE_BOILERPLATE_AS_PHYSICAL_OBJECT: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?<!\p{L})placa(?!\p{L})/iu,
  pt: /placa de caldeira/iu,
  ar: /اللوحة/u,
  he: /לוח הכביסה/u,
  ka: /ბოილერის პლატ/iu,
  hy: /ջերմաստիճան/iu,
}

const SOFTWARE_SIDECAR_AS_VEHICLE: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?:coches?|carros? laterales|vagón lateral)/iu,
  pt: /(?:caminhões|carros? (?:laterais|temporários))/iu,
  fr: /(?:chariots?|voitures? (?:secondaires?|latérales?|de récupération))/iu,
  ru: /(?:коляск|боков\p{L}* машин)\p{L}*/iu,
  ar: /(?:(?:ال|لل|بال|كال)?سيار(?:ة|ات) الجانبي(?:ة|ات)|قطارات الاسترداد الجانبية)/u,
  ur: /سائیڈ کار/u,
  ja: /サイドカー/u,
  he: /(?:רכבים סייד|הסיידקאר|הרכב הצדדי|סיידקרות)/u,
  my: /(?:ဘက်ထရီ|ဘေးကား)/u,
  ka: /გვერდითი მანქ\p{L}*/iu,
  hy: /կողային (?:ավտոմեքեն|մեքեն)\p{L}*/iu,
  az: /(?:yan (?:maşın|avtomobil)|kənar maşın)\p{L}*/iu,
  kk: /(?:қосалқы машин|көліктік көлденең|жапсарлас автокөлік|көлiктi автомобиль|жаппай машин|қосалқы вагон)\p{L}*/iu,
  ba: /(?:тергеҙеү машин|сираттағы машин|яңғыраған машин)\p{L}*/iu,
  am: /ጎን (?:ተሽከርካሪ|መኪና|መደርደሪያ)/u,
  dz: /(?:སྣུམ་འཁོར་ཟུར་པ|འཁོར་ལོའི་སྣུམ་སྒྲོམ|སྣུམ་འཁོར་ལོ་བཏང)/u,
  uz: /yon mashina\p{L}*/iu,
  mn: /(?:хавсралтын автомашин|тасалбар машины|дэргэдэх автомашин|саад машины)\p{L}*/iu,
  'zh-hans': /侧车/u,
  'zh-hant': /側車/u,
}

const SOFTWARE_WRAPPER_AS_PHYSICAL_PACKAGE: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?<!\p{L})(?:envases?|embalajes?|envolturas?)(?!\p{L})/iu,
  pt: /(?<!\p{L})(?:embalagens?|embrulhos?|envolventes?)(?!\p{L})/iu,
  fr: /(?<!\p{L})(?:emballages?|enveloppes?)(?!\p{L})/iu,
  ru: /упаковк\p{L}*/iu,
  ar: /(?:غلافات?|ملفات حول)/u,
  ur: /لفاف\p{Script=Arabic}*/u,
  ja: /包装/u,
  he: /(?:ארגז|ערימות)\p{Script=Hebrew}*/u,
  my: /ပုံး/u,
  ka: /(?:შეფუთვ|ჩანართ|ყუთ)\p{L}*/iu,
  hy: /փաթեթ\p{L}*/iu,
  az: /(?:bağlama|qovluq)\p{L}*/iu,
  kk: /қаптама\p{L}*/iu,
  ba: /(?:төргәк|ҡаплам)\p{L}*/iu,
  am: /ማሸጊያ/u,
  dz: /(?:སྒྲོམ|སྒོ་སྒྲིག)/u,
  uz: /(?:qadoq|qoplama)\p{L}*/iu,
  mn: /тоног төхөөрөмж/iu,
  'zh-hans': /包装/u,
  'zh-hant': /包裝/u,
}

const PROTOCOL_ENVELOPE_AS_POSTAL_ITEM: Readonly<Partial<Record<string, RegExp>>> = {
  ja: /封筒/u,
  my: /စာအိတ်/u,
  am: /ፖስታ/u,
  'zh-hans': /(?:信封|封筒)/u,
  'zh-hant': /(?:信封|封筒)/u,
}

const MANIFEST_FRAGMENT_AS_APPARENT_FRAGMENT: Readonly<Partial<Record<string, RegExp>>> = {
  es: /un fragmento manifiesto/iu,
  pt: /fragmento manifestado/iu,
  fr: /un fragment manifeste/iu,
  ru: /явный фрагмент/iu,
  ar: /قطعة واضحة/u,
  ur: /ظاہری ٹکڑا/u,
  ja: /明らか\s*な\s*断片/u,
  he: /קטע מפורסם/u,
  my: /ထင်ရှားသော အပိုင်းအစ/u,
  ka: /გამოხატული ფრაგმენტი/iu,
  hy: /բացահայտված հատված/iu,
  az: /məlum bir parça/iu,
  kk: /көрініссіз бөлік/iu,
  ba: /билдәле өҙөк/iu,
  am: /በግልጽ የሚታየው ቁራጭ/u,
  dz: /ཕྲ་ཆག་གསལ་ཏོག་ཏོ/u,
  uz: /koʻrinib turgan parchalari/iu,
  mn: /өргөдлийн хувилбар/iu,
  'zh-hans': /显而易见的部分/u,
  'zh-hant': /顯而易見的部分/u,
}

const CRYPTO_NONCE_AS_NEGATION_OR_UNRELATED_WORD: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?:la noción|noces)/iu,
  pt: /(?:nãoces|inclua um não|,\s*e não:)/iu,
  ru: /включить нечто/iu,
  ar: /(?:لكل إشارة|النسخة الفائزة)/u,
  ja: /ノン(?:セ|チェス)/u,
  he: /עבור כל סקרפט/u,
  hy: /եւ ոչ:/iu,
  az: /demir hündürlüyü/iu,
  am: /AAD,\s*የኦዲተሮች/u,
  uz: /bitta notni/iu,
  mn: /бусдыг багтаах/iu,
  'zh-hans': /(?:非符号|获胜的无数|应用程序公钥,\s*并非|包含一个非如此)/u,
  'zh-hant': /(?:非符號|獲勝的無數|應用程式公鑰,\s*並非|包含一個非如此)/u,
}

const TRANSACTION_AUTHORITY_AS_GOVERNMENT_OFFICIAL: Readonly<Partial<Record<string, RegExp>>> = {
  ru: /(?:власт|власть|властей)\p{L}*/iu,
  ar: /السلطات/u,
  ur: /حکام/u,
  ja: /当局/u,
  my: /အာဏာပိုင်/u,
  ka: /ხელისუფლებ\p{L}*/iu,
  hy: /իշխան\p{L}*/iu,
  az: /hakimiyyət\p{L}*/iu,
  ba: /(?:власт|власть|хакимлыҡ)\p{L}*/iu,
  am: /(?:ባለሥልጣን|ባለስልጣን)/u,
  'zh-hans': /当局/u,
  'zh-hant': /當局/u,
}

const PROTOCOL_RECEIPT_AS_RECIPE_OR_RECEPTION: Readonly<Partial<Record<string, RegExp>>> = {
  es: /recepción/iu,
  pt: /(?:receitas?|recepções?|receções?)/iu,
  fr: /réceptions?/iu,
  ka: /რეცეპტ\p{L}*/iu,
  az: /resept\p{L}*/iu,
}

const BOXED_INSTRUCTION_AS_PHYSICAL_PACKAGE: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?:en|dentro de (?:una|la)) caja/iu,
  pt: /em caixa/iu,
  hy: /փաթեթավորված/iu,
  az: /qutulu/iu,
  kk: /қорапталған/iu,
  am: /የታሸገ/u,
  uz: /qutilangan/iu,
  'zh-hans': /装箱/u,
  'zh-hant': /裝箱/u,
}

const PROTOCOL_CARRIER_AS_TRANSPORT_PROVIDER: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?:transportista|compañía aérea|(?<!\p{L})portador(?!a|\p{L})|(?:La|una) portadora|vinculación(?![^\n.]{0,80}transacción portadora)[^\n.]{0,80}portadora)/iu,
  pt: /(?:transporte público|transportadora|(?<!\p{L})portador(?!a|\p{L})|obrigação de carregador)/iu,
  fr: /(?:transporteur\p{L}*|(?:une|la) porteuse|liaison(?![^\n.]{0,80}transaction porteuse)[^\n.]{0,80}porteuse)/iu,
  ru: /(?:глобальным носителем|хэш носителя)/iu,
  ar: /(?:الناقل|الحامل(?!ة)|الشاحن)/u,
  ur: /(?:عوامی نقل و حمل|کیریئر)/u,
  ja: /キャリア/u,
  he: /(?<!\p{L})carrier(?!\p{L})/iu,
  my: /(?:သယ်ဆောင်ရေးလုပ်ငန်းရှင်|သယ်ယူပို့ဆောင်ရေး ကုမ္ပဏီ|သယ်ဆောင်ရေးမှူး|(?<![_\p{L}`])carrier(?!\s+transaction|[_\p{L}`]))/iu,
  ka: /გადამზიდ\p{L}*/iu,
  hy: /(?:(?:տրանսպորտային միջոց|փոխադրամիջոց)\p{L}*|փոխադրող\p{L}*)/iu,
  az: /nəqliyyat (?:şirkət|vasitə)\p{L}*/iu,
  kk: /тасымалдаушы(?! транзакц)\p{L}*/iu,
  ba: /(?:Йәмәғәт транспорты|(?<![_\p{L}`])carrier(?!\s+transaction|[_\p{L}`]))/iu,
  am: /(?:የህዝብ ማጓጓዣ|ተሸካሚ(?! ግብይት| ግብይቱ))/u,
  dz: /(?:མི་མང་གི་སྣུམ་འཁོར|སྤྱི་སྤྱོད་འཁྱེར་མཁན|སྐྱེལ་འདྲེན་འབད་ཐངས|(?<![_\p{L}`])carrier(?!\s+transaction|[_\p{L}`]))/iu,
  uz: /(?:global operator|tashuvchi(?! tranzaksi))\p{L}*/iu,
  mn: /тээврийн хэрэгс\p{L}*/iu,
  'zh-hans': /(?:运输商|运输公司|载体)/u,
  'zh-hant': /(?:運輸商|運輸公司|載體)/u,
}

const PROTOCOL_WIRE_AS_PHYSICAL_CABLE: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?<!\p{L})(?:alambre|cable)\p{L}*/iu,
  pt: /(?<!\p{L})(?:arame|cabo|fio)\p{L}*/iu,
  fr: /(?<!\p{L})(?:câbl\p{L}*|fils?)(?!\p{L})/iu,
  ru: /(?<!\p{L})(?:кабел|провод)\p{L}*/iu,
  ar: /(?:أسلاك|السلك|سلك|كابل)/u,
  ur: /(?:تار|وائر|کیبل)/u,
  ja: /(?:ケーブル|針金|電線)/u,
  he: /(?:חוט|כבל)\p{Script=Hebrew}*/u,
  my: /ကြိုး/u,
  ka: /(?<!\p{L})(?:კაბელ|მავთულ)\p{L}*/iu,
  hy: /(?<!\p{L})(?:մալուխ|լար)\p{L}*/iu,
  az: /(?<!\p{L})(?:kabel|simli|tel)\p{L}*/iu,
  kk: /(?<!\p{L})(?:кабель|сым)\p{L}*/iu,
  ba: /(?<!\p{L})(?:кабель|сым)\p{L}*/iu,
  am: /(?:ገመድ|ኬብል)/u,
  dz: /གློག་ཐག/u,
  uz: /(?<!\p{L})(?:kabel|sim|simli)\p{L}*/iu,
  mn: /(?<!\p{L})(?:кабель|утас|цахилгаан)\p{L}*/iu,
  'zh-hans': /(?:电线|电缆|线缆)/u,
  'zh-hant': /(?:電線|電纜|線纜)/u,
}

const SOFTWARE_TEST_FIXTURE_AS_PHYSICAL_OBJECT: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?<!\p{L})(?:fixtures?|harness(?:es)?|accesorios?|dispositivos?|fijaci\p{L}*|luminarias?|aparatos?)(?!\p{L})/iu,
  pt: /(?<!\p{L})(?:fixtures?|harness(?:es)?|acessórios?|dispositivos?|fixaç\p{L}*|luminárias?|aparelhos?)(?!\p{L})/iu,
  fr: /(?<!\p{L})(?:fixtures?|harness(?:es)?|accessoires?|appareils?|dispositifs?|fixation\p{L}*|luminaires?|harnachement\p{L}*)(?!\p{L})/iu,
  ru: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|(?:светильник|устройств|фиксатор|фиксац|установк|арматур|упряж|сбру)\p{L}*)/iu,
  ar: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|(?:الأجهزة|الأداة|أدوات|جهاز|تجهيزات|تركيبات|لجام|سرج))/iu,
  ur: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|فکسچر|آلات|آلہ|لگام)/iu,
  ja: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|固定装置|治具|器具|備品|馬具)/iu,
  he: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|ציוד|מתקנים|אביזרים|רתמה)/iu,
  my: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|ပြင်ဆင်ပစ္စည်း|ကိရိယာ)/iu,
  ka: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|(?:მოწყობილობ|სამაგრ|აღკაზმულ)\p{L}*)/iu,
  hy: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|(?:սարքավոր|սարքեր|հարմարանք|ամրակ|սանձ)\p{L}*)/iu,
  az: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|(?:qurğu|armatur|qoşqu)\p{L}*)/iu,
  kk: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|(?:құрылғ|фиксатор|арматур|бекіткіш|әбзел)\p{L}*)/iu,
  ba: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|(?:ҡоролма|фиксатор|арматур|ҡорамал|йүгән)\p{L}*)/iu,
  am: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|ማያዣ|መሳሪያ|ዕቃ|ልጓም)/iu,
  dz: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|རྟ་སྒ)/iu,
  uz: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|(?:qurilm|moslama|armatur|egarl)\p{L}*)/iu,
  mn: /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|тоног төхөөрөмж|төхөөрөмж|бэхэлгээ|морины хэрэглэл)/iu,
  'zh-hans': /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|夹具|固定装置|固定器|灯具|马具|线束)/iu,
  'zh-hant': /(?:(?<!\p{L})(?:fixtures?|harness(?:es)?)(?!\p{L})|夾具|固定裝置|固定器|燈具|馬具|線束)/iu,
}

const CORRECT_SOFTWARE_TEST_FIXTURE_TERM: Readonly<Partial<Record<string, RegExp>>> = {
  es: /(?:datos|recursos|caso) de prueba/iu,
  pt: /(?:dados|recursos|caso) de teste/iu,
  fr: /(?:données|ressources|cas|jeu) de test|fichier de conformité/iu,
  ru: /тестов\p{L}*/iu,
  ar: /(?:بيانات|موارد|بيئة) الاختبار|حالة اختبار/u,
  ur: /آزمائشی (?:ڈیٹا|وسائل|نظام)/u,
  ja: /(?:テストデータ|テスト実装|テストハーネス|フィクスチャ)/u,
  he: /(?:נתוני|משאבי|מקרה|ערכת) בדיק/u,
  my: /စမ်းသပ်(?:ဒေတာ|အရင်းအမြစ်|စနစ်)/u,
  ka: /სატესტო (?:მონაცემ|რესურს|გარემო)\p{L}*/iu,
  hy: /թեստային (?:տվյալ|ռեսուրս|միջավայր)\p{L}*/iu,
  az: /sınaq (?:verilən|resurs|sistem)\p{L}*/iu,
  kk: /сынақ (?:дерек|ресурс|орта)\p{L}*/iu,
  ba: /һынау (?:мәғлүмәт|ресурс|мөхит)\p{L}*/iu,
  am: /የሙከራ (?:ውሂብ|ግብዓት|ስርዓት)/u,
  dz: /བརྟག་དཔྱད་(?:གནས་སྡུད|ཐོན་ཁུངས|རྒྱུད་ལམ)/u,
  uz: /sinov (?:ma['’]lumot|resurs|muhit)\p{L}*/iu,
  mn: /туршилтын (?:өгөгдөл|нөөц|орчин)/iu,
  'zh-hans': /测试(?:数据|资料|资源|框架|用例)/u,
  'zh-hant': /測試(?:資料|資源|框架|案例)/u,
}

const CANONICAL_AS_LEGAL: Readonly<Partial<Record<string, RegExp>>> = {
  ar: /(?:^|[^\p{L}])(?:ال)?(?:قانون|قنون|كنس|كنز)\p{L}*(?:$|[^\p{L}])/u,
  ur: /قانونی/u,
  he: /(?:^|[^\p{L}])(?:לא )?חוקי\p{L}*(?:$|[^\p{L}])/u,
  hy: /օրինական\p{L}*/iu,
  az: /(?<!\p{L})qanuni\p{L}*/iu,
  kk: /заңды\p{L}*/iu,
  ba: /ҡануни\p{L}*/iu,
  dz: /ཁྲིམས་མཐུན/u,
  mn: /хууль ёсны/iu,
  'zh-hans': /法定/u,
  'zh-hant': /法定/u,
}

const CORRECT_CANONICAL_TERM: Readonly<Partial<Record<string, RegExp>>> = {
  he: /(?:קנוני|קאנונ)/u,
  kk: /каноник/iu,
  dz: /(?:canonical|ཀན་ནོ་སི|ཀ་ནོ)/iu,
}

const COMPUTING_HOST_AS_HOME_OWNER: Readonly<Partial<Record<string, RegExp>>> = {
  ru: /(?:машин\p{L}*[- ]хозяин|хозяин\p{L}*)/iu,
  pt: /\banfitri(?:ão|ões)\b/iu,
  my: /အိမ်ရှင်/u,
  ka: /მასპინძელ\p{L}*/iu,
  az: /ev sahib\p{L}*/iu,
  ba: /хужа\p{L}*/iu,
}

const TECHNICAL_CALL_AS_TELEPHONE: Readonly<Partial<Record<string, RegExp>>> = {
  ar: /(?:هاتف|مكالم(?:ə|ة|ات))/u,
  ur: /فون/u,
  ja: /電話/u,
  he: /שיח(?:ה|ות|ת)/u,
  my: /ဖုန်း/u,
  ka: /ტელეფონ/u,
  hy: /հեռախոս/u,
  kk: /телефон/iu,
  ba: /(?:телефон|шылтырат\p{L}*)/iu,
  am: /ስልክ/u,
  'zh-hans': /电话/u,
  'zh-hant': /電話/u,
}

const FINANCIAL_BALANCE_SOURCE =
  /(?:\b(?:account|asset|concrete|destination|fee|numeric|receiver|sender|source|sponsor(?:'s)?|user(?:'s)?)\s+balances?\b|\b(?:buyer|holder|owner|seller)\b[^.\n]{0,60}\bbalances?\b|\b(?:available|enough|remaining)\s+balances?\b|\bbalances?\s+(?:before|after|check|checks|drain|drains|held|lookup|queries|scope|snapshots?|streams?|verification|visible)\b|\b(?:check|debit|debits|mutate|mutates|read|top up|verify)\b[^.\n]{0,60}\bbalances?\b)/iu

const SEMANTIC_FALSE_FRIEND_RULES: Readonly<Record<string, readonly SemanticFalseFriendRule[]>> = {
  ru: [
    {
      source: /\btry it (?:on|with)\b/iu,
      localized: /пример(?:ьте|ить)\p{L}*/iu,
      description: 'trying a workflow rendered as trying on clothing',
    },
    {
      source: /\bdigests?\b/iu,
      localized: /переварив\p{L}*/iu,
      description: 'cryptographic digest rendered as digestion',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /пенси\p{L}*/iu,
      description: 'protocol retirement rendered as an employment pension',
    },
    {
      source: /\bpools?\b/iu,
      localized: /бассейн\p{L}*/iu,
      description: 'protocol pool rendered as a swimming pool',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?:книг|библиотек)\p{L}*/iu,
      unlessSource: /\bbooks?\b/iu,
      description: 'ledger rendered as a book or software library',
    },
    {
      source:
        /(?:\b(?:shielded|private|input|output|spent|funding|change)[- ]notes?\b|\bnotes? (?:commitments?|owner|amounts?|randomness|fields?|nullifiers?|exist|contains?)\b|\bnote state\b)/iu,
      localized: /заметк\p{L}*/iu,
      description: 'confidential protocol note rendered as an ordinary written note',
    },
    {
      source: /\bpublic state\b/iu,
      localized: /государств\p{L}*/iu,
      description: 'public ledger state rendered as a sovereign state',
    },
    {
      source: /\bnullifiers?\b/iu,
      localized: /нулев\p{L}* (?:значени|идентификатор)\p{L}*/iu,
      description: 'cryptographic nullifier rendered as an ordinary zero value',
    },
    {
      source: /\bexplorers?\b/iu,
      localized: /(?:исследовател|проводник)\p{L}*/iu,
      description: 'blockchain explorer rendered as a researcher or guide',
    },
  ],
  ar: [
    {
      source: /\bdigests?\b/iu,
      localized: /BLAKE3[^.\n]{0,100}استهلاك/u,
      description: 'cryptographic digest rendered as consumption',
    },
    {
      source: /\bfaucets?\b/iu,
      localized: /(?:النوافذ العامة|أنبوب)/u,
      description: 'testnet faucet rendered as a window or pipe',
    },
    {
      source: /.+/u,
      localized: /(?:القرآن|الكتاب المقدس)/u,
      description: 'technical concept rendered as a religious text',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?:(?:^|[^\p{L}])(?:ال)?كتاب(?!ة)\p{L}*|مكتبة)/u,
      description: 'ledger rendered as a book or software library',
    },
    {
      source: /\borchestrators?\b/iu,
      localized: /الموسيقي/u,
      description: 'software orchestrator rendered as a musician',
    },
    {
      source: /\bescrows?\b/iu,
      localized: /الحسابات الجارية/u,
      description: 'protocol escrow rendered as current accounts',
    },
    {
      source: /\bwildcards?\b/iu,
      localized: /الرمز البريدي/u,
      description: 'protocol wildcard rendered as a postal code',
    },
    {
      source: /\bencoders?\b/iu,
      localized: /محولات/u,
      description: 'software encoder rendered as a converter',
    },
    {
      source: /\bgenesis manifest\b/iu,
      localized: /وثيقة التأسيس/u,
      description: 'genesis manifest rendered as a founding document',
    },
    {
      source: /\bwrite-side toy\b/iu,
      localized: /لعبة[^.\n]{0,80}الجانب (?:الأيمن|اليمين)/u,
      description: 'write-side toy example rendered as a game on the right side',
    },
  ],
  ur: [
    {
      source: /\blittle-endian\b/iu,
      localized: /چھوٹے انڈین/u,
      description: 'little-endian rendered as small Indians',
    },
    {
      source: /\bstreams?\b/iu,
      localized: /ندی/u,
      description: 'event stream rendered as a river',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?:کتاب|لائبریری)/u,
      description: 'ledger rendered as a book or software library',
    },
  ],
  ja: [
    {
      source: /\bBLS-Normal\b/u,
      localized: /BLS-通常/u,
      description: 'BLS-Normal algorithm name translated instead of preserved',
    },
    {
      source: /\bwrite-side toy\b/iu,
      localized: /おもちゃ/u,
      description: 'small write example rendered as a physical toy',
    },
    {
      source: /\bTest writes\b/iu,
      localized: /テストが書/u,
      description: 'test-write label rendered as an ungrammatical sentence',
    },
    {
      source: /\bpublic Taira\b/iu,
      localized: /(?:公衆|公共)(?:の)?\s*Taira/u,
      description: 'public testnet rendered as the general public or public utility',
    },
    {
      source: /\btry it (?:on|with)\b/iu,
      localized: /試着/u,
      description: 'trying a workflow rendered as trying on clothing',
    },
    {
      source: /\bburn(?:s|ed|ing)?\b/iu,
      localized: /消費/u,
      description: 'asset or trigger burning rendered as ordinary consumption',
    },
    {
      source: /\bfaucets?\b/iu,
      localized: /ポンプ/u,
      description: 'testnet faucet rendered as a pump',
    },
    {
      source: /\bgrant(?:s|ed|ing)?\b/iu,
      localized: /補助/u,
      description: 'permission grant rendered as a subsidy',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /(?:退職|年金)/u,
      description: 'protocol retirement rendered as an employment pension',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?:図書館|ライブラリ|(?:^|[^\p{L}])本(?:[^\p{L}]|$))/u,
      description: 'ledger rendered as a book or software library',
    },
    {
      source: /\baccounts?\b/iu,
      localized: /会計/u,
      description: 'ledger account rendered as accounting',
    },
    {
      source: /\bart[ei]facts?\b/iu,
      localized: /(?:文物|芸術品)/u,
      description: 'software artifact rendered as a cultural or artistic object',
    },
    {
      source: /\bworkspaces?\b/iu,
      localized: /作業場/u,
      description: 'software workspace rendered as a physical workplace',
    },
    {
      source: /\bruntimes?\b/iu,
      localized: /実行時間/u,
      description: 'software runtime rendered as elapsed execution time',
    },
    {
      source: /\b(?:canonical|canonicality)\b/iu,
      localized: /(?:法典|法定)/u,
      description: 'canonical form rendered as statutory or codified law',
    },
    {
      source: /\bauthorit(?:y|ies)\b/iu,
      localized: /地方自治体/u,
      description: 'transaction authority rendered as a local government',
    },
    {
      source: /\bpublic\b/iu,
      localized: /公衆/u,
      description: 'public protocol surface rendered as the general populace',
    },
    {
      source: /\bevents?\b/iu,
      localized: /出来事/u,
      description: 'typed event rendered as an ordinary occurrence',
    },
    {
      source: /\b(?:software |coding )?agents?\b/iu,
      localized: /代理人/u,
      description: 'software agent rendered as a legal representative',
    },
    {
      source: /\bendpoints?\b/iu,
      localized: /終点/u,
      description: 'API endpoint rendered as a physical terminus',
    },
    {
      source: /\b(?:logger|logging)\b/iu,
      localized: /伐採/u,
      description: 'software logging rendered as tree felling',
    },
    {
      source: /\bqueues?\b/iu,
      localized: /排隊/u,
      description: 'software queue rendered with an untranslated Chinese term',
    },
    {
      source: /\bnaming conventions?\b/iu,
      localized: /代表大会/u,
      description: 'naming convention rendered as a political convention',
    },
    {
      source: /\bsmart contracts?\b/iu,
      localized: /賢明/u,
      description: 'smart contract rendered as a wise contract',
    },
    {
      source: /\bproduction\b/iu,
      localized: /製造/u,
      description: 'production environment rendered as manufacturing',
    },
    {
      source: /\bbuild(?:s|ing|able)?\b/iu,
      localized: /建設/u,
      description: 'software build rendered as physical construction',
    },
    {
      source: /\bcommitments?\b/iu,
      localized: /約束/u,
      unlessLocalized: /コミットメント/u,
      description: 'cryptographic commitment rendered as a promise',
    },
    {
      source: /\bpublic inputs?\b/iu,
      localized: /入口/u,
      description: 'proof public input rendered as an entrance',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?:本簿|レジー)/u,
      description: 'ledger rendered as a malformed literal book term',
    },
    {
      source: /\bwallets?\b/iu,
      localized: /財布/u,
      description: 'cryptocurrency wallet rendered as a physical purse',
    },
    {
      source: /\bchains?\b/iu,
      localized: /鎖/u,
      description: 'blockchain rendered as a physical chain',
    },
    {
      source: /\b(?:generators?|code generation)\b/iu,
      localized: /発電機/u,
      description: 'software generator rendered as an electrical generator',
    },
    {
      source: /\b(?:helpers?|helper tooling)\b/iu,
      localized: /補助人/u,
      description: 'software helper rendered as a human assistant',
    },
    {
      source: /\b(?:triggers?|triggered)\b/iu,
      localized: /(?:引き金|爆発)/u,
      description: 'event trigger rendered as a firearm trigger or explosion',
    },
    {
      source: /\bescrows?\b/iu,
      localized: /(?:担保|保証人)/u,
      description: 'protocol escrow rendered as collateral or a guarantor',
    },
    {
      source: /\breceipts?\b/iu,
      localized: /領収書/u,
      description: 'protocol receipt rendered as a shop receipt',
    },
    {
      source: /\b(?:schemas?|schema)\b/iu,
      localized: /スケジュール/u,
      description: 'data schema rendered as a calendar schedule',
    },
    {
      source: /\bmanifests?\b/iu,
      localized: /(?:明示書|マニスト)/u,
      description: 'software manifest rendered as a statement or malformed loanword',
    },
    {
      source: /\blifecycles?\b/iu,
      localized: /生命周期/u,
      description: 'lifecycle left as a Chinese term in Japanese prose',
    },
    {
      source: /\bflows?\b/iu,
      localized: /流程/u,
      description: 'workflow left as a Chinese term in Japanese prose',
    },
    {
      source: /\bencrypt(?:s|ed|ing|ion)?\b/iu,
      localized: /加密/u,
      description: 'encryption left as a Chinese term in Japanese prose',
    },
    {
      source: /\b(?:local|locally)\b/iu,
      localized: /本地/u,
      description: 'local software context left as a Chinese term in Japanese prose',
    },
    {
      source: /\boutputs?\b/iu,
      localized: /輸出/u,
      description: 'software output rendered as commercial export',
    },
    {
      source: /\braw\b/iu,
      localized: /原始/u,
      description: 'raw data rendered as primitive or ancient material',
    },
    {
      source: /\b(?:builders?|builder APIs?)\b/iu,
      localized: /(?:建設業者|建設者)/u,
      description: 'software builder rendered as a construction worker',
    },
    {
      source: /\bscalars?\b/iu,
      localized: /スケラー/u,
      description: 'scalar rendered with a malformed loanword',
    },
    {
      source: /\bpeers?\b/iu,
      localized: /同類/u,
      description: 'network peer rendered as something merely similar',
    },
    {
      source: /\bdomains?\b/iu,
      localized: /域名/u,
      description: 'Iroha domain left as a Chinese networking term',
    },
    {
      source: /\b(?:exposes?|publishes?|provides?)\b/iu,
      localized: /暴露/u,
      description: 'API exposure rendered as involuntary disclosure',
    },
    {
      source: /\breturns?|returned\b/iu,
      localized: /返済/u,
      description: 'software return rendered as debt repayment',
    },
    {
      source: /\b(?:local|locally)\b/iu,
      localized: /地元/u,
      description: 'local software context rendered as a hometown',
    },
    {
      source: /\b(?:tools?|tooling)\b/iu,
      localized: /道具/u,
      description: 'software tooling rendered as physical implements',
    },
    {
      source: /\bentrypoints?\b/iu,
      localized: /入口点/u,
      description: 'software entrypoint rendered as a physical entrance point',
    },
    {
      source: /\bprimary\b/iu,
      localized: /原発/u,
      description: 'primary operation rendered as a nuclear power plant',
    },
    {
      source: /\bparents?\b/iu,
      localized: /両親/u,
      description: 'technical parent nodes or lots rendered as human parents',
    },
    {
      source: /\bchild(?:ren)?\b/iu,
      localized: /子供/u,
      description: 'technical child node or lot rendered as a human child',
    },
    {
      source: /\b(?:run|runs|running)\b/iu,
      localized: /走行/u,
      description: 'software run rendered as physical travel',
    },
    {
      source: /\bbindings?\b/iu,
      localized: /拘束力/u,
      description: 'technical binding rendered as coercive force',
    },
    {
      source: /\bsponsors?\b/iu,
      localized: /保証人/u,
      description: 'fee sponsor rendered as a legal guarantor',
    },
    {
      source: /\b(?:blowup|burst)\b/iu,
      localized: /爆発/u,
      description: 'proof expansion or traffic burst rendered as an explosion',
    },
  ],
  he: [
    {
      source: /\bfaucets?\b/iu,
      localized: /(?:מזרקה|קנקן)/u,
      description: 'testnet faucet rendered as a fountain or jug',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /פנסי\p{L}*/iu,
      description: 'protocol retirement rendered as an employment pension',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?:ספריה|ספרייה)/u,
      description: 'ledger rendered as a software library',
    },
  ],
  my: [
    {
      source: /\bdigests?\b/iu,
      localized: /(?:အစာအိမ်|အန်ဒီယန်း)/u,
      description: 'cryptographic digest rendered as a stomach or Andean',
    },
    {
      source: /\bstreams?\b/iu,
      localized: /ချောင်း/u,
      description: 'event stream rendered as a creek',
    },
    {
      source: /\bfaucets?\b/iu,
      localized: /(?:ရေချိုးခန်း|ရေပိုက်)/u,
      description: 'testnet faucet rendered as a bathroom or water pipe',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?:စာအုပ်|စာကြည့်တိုက်)/u,
      description: 'ledger rendered as a book or software library',
    },
    {
      source: /\bnon[- ]fungible\b/iu,
      localized: /မှိုမပါ/u,
      description: 'non-fungible rendered as mold-free',
    },
    {
      source: /\bCPU\s+saturation\b/iu,
      localized: /ကျေနပ်မှု/u,
      description: 'CPU saturation rendered as satisfaction',
    },
    {
      source: /\bregistration command\b/iu,
      localized: /မှတ်ပုံတင်ကော်မရှင်/u,
      description: 'registration command rendered as a registration commission',
    },
    {
      source: /\brecipe\b/iu,
      localized: /အချက်ပြုတ်/u,
      description: 'documentation recipe rendered as cooking',
    },
    {
      source: /\btransactions?\b/iu,
      localized: /ငွေ(?:ပေးချေး|ချေး)မှု/u,
      description: 'transaction rendered as a financial loan',
    },
    {
      source: /\brisk(?:s|y)?\b/iu,
      localized: /အရဲစွန့်/u,
      description: 'risk rendered as a dare',
    },
  ],
  ka: [
    {
      source: /\btry it (?:on|with)\b/iu,
      localized: /ჰქონდეს სვლა/iu,
      description: 'trying a workflow rendered as having a move',
    },
    {
      source: /\bassets?\b/iu,
      localized: /აპარატ\p{L}*/iu,
      description: 'ledger asset rendered as a device or apparatus',
    },
    {
      source: /\bdataspaces?\b/iu,
      localized: /მონაცემთა ბაზ\p{L}*/iu,
      description: 'dataspace rendered as a database',
    },
    {
      source: /[\s\S]/u,
      localized: /(?:[ჱჲჳჴჵჶჷჸჹჺჼ]|ოპვრთ|ოპვჟ|ნაოპაგ|ჟრან|ჟლავ|პაჟლ|ფსკრაჟ|გპვმვ|კჲ)/u,
      description: 'Georgian translation contains obsolete letters or known model gibberish',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /პენსი\p{L}*/iu,
      description: 'protocol retirement rendered as an employment pension',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?:წიგნ|ბიბლიოთეკ)\p{L}*/iu,
      description: 'ledger rendered as a book or software library',
    },
  ],
  hy: [
    {
      source: /\bassets?\b/iu,
      localized: /արտոնությ\p{L}*/iu,
      description: 'ledger asset rendered as a privilege or entitlement',
    },
    {
      source: /\bassets?\b/iu,
      localized: /(?:գործիք|աշուն)\p{L}*/iu,
      description: 'ledger asset rendered as a tool or season',
    },
    {
      source: /\blittle-endian\b/iu,
      localized: /փոքր տերեւ/u,
      description: 'little-endian rendered as small leaves',
    },
    {
      source: /\bfaucets?\b/iu,
      localized: /ջրհեղեղ/u,
      description: 'testnet faucet rendered as a flood',
    },
    {
      source: /\bdummy-slot\b/iu,
      localized: /դիպլոմ\p{L}*/iu,
      description: 'dummy slot rendered as a diploma',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /կենսաթոշակ\p{L}*/iu,
      description: 'protocol retirement rendered as an employment pension',
    },
    {
      source: /\bpools?\b/iu,
      localized: /լողավազ\p{L}*/iu,
      description: 'protocol pool rendered as a swimming pool',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?:գիրք|գրադարան)\p{L}*/iu,
      description: 'ledger rendered as a book or software library',
    },
  ],
  kk: [
    {
      source: /.+/u,
      localized: /(?:Құран|Киелі кітап)/u,
      description: 'technical concept rendered as a religious text',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?:кітап|бассейн|журнал)\p{L}*/iu,
      description: 'ledger rendered as a book, journal, library, or swimming pool',
    },
    {
      source: /\bplanes?\b/iu,
      localized: /ұша(?:қ|ғ)\p{L}*/iu,
      description: 'software plane rendered as an aircraft',
    },
    {
      source: /\bgenesis\b/iu,
      localized: /туа біткен\p{L}*/iu,
      description: 'blockchain genesis rendered as congenital origin',
    },
    {
      source: /\bexplorers?\b/iu,
      localized: /зерттеуш\p{L}*/iu,
      description: 'blockchain explorer rendered as a researcher',
    },
    {
      source: /\blots?\b/iu,
      localized: /(?<!\p{L})топ\p{L}*/iu,
      description: 'RWA lot rendered as a generic group',
    },
    {
      source: /\bauthorit(?:y|ies)\b/iu,
      localized: /принцип\p{L}*/iu,
      description: 'authorization authority rendered as a principle',
    },
    {
      source: /\bsingle[- ]peer\b/iu,
      localized: /бір пайдаланушы/iu,
      description: 'single network peer rendered as a user',
    },
  ],
  ba: [
    {
      source: /.+/u,
      localized: /Изге Яҙма/u,
      description: 'technical concept rendered as a religious text',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /китап\p{L}*/iu,
      description: 'ledger rendered as a book or software library',
    },
    {
      source: /\bpools?\b/iu,
      localized: /бассейн\p{L}*/iu,
      description: 'protocol pool rendered as a swimming pool',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /пенси\p{L}*/iu,
      description: 'protocol retirement rendered as an employment pension',
    },
    {
      source: /\bpeers?\b/iu,
      localized: /(?:Тиҫтер|сверстник)/iu,
      description: 'network peer rendered as an age peer',
    },
    {
      source: /\b(?:canonical|canonicality)\b/iu,
      localized: /ҡануни\p{L}*/iu,
      description: 'canonical encoding rendered as legal or lawful',
    },
    {
      source: /\bcallers?\b/iu,
      localized: /шылтырат\p{L}*/iu,
      description: 'software caller rendered as a telephone caller',
    },
    {
      source: /\bbundles?\b/iu,
      localized: /бюллет\p{L}*/iu,
      description: 'artifact bundle rendered as a bulletin',
    },
    {
      source: /\bcrates?\b/iu,
      localized: /(?:һанды[ҡғ]|ҡумта)\p{L}*/iu,
      description: 'Rust crate rendered as a physical box',
    },
    {
      source: /\bpipelines?\b/iu,
      localized: /(?:торба|труба)\p{L}*/iu,
      description: 'software pipeline rendered as a water pipe',
    },
    {
      source: /\bcommit(?:ments?|s|ted|ting)?\b/iu,
      localized: /йөкмәт(?:елә|ергә|еү|ә|кән|келе(?!лек)|елгән)\p{L}*/iu,
      unlessLocalized: /\bcommit\b/iu,
      description: 'technical commit rendered as loading content',
    },
    {
      source: /\bloads?\b/iu,
      localized: /серҙәр(?:ҙе)?\s+commit\s+ит\p{L}*/iu,
      description: 'data loading corrupted into a Git commit',
    },
    {
      source: /\bfaucets?\b/iu,
      localized: /кран\p{L}*/iu,
      description: 'testnet faucet rendered as a water tap',
    },
    {
      source: /\bsmoke tests?\b/iu,
      localized: /(?:төтөн|тәмәке) һынау/iu,
      description: 'smoke test rendered as literal smoke or tobacco testing',
    },
    {
      source: /\bcanary (?:manifest|probe|run|test|verification)\b/iu,
      localized: /канар(?:ия|ий)\p{L}*/iu,
      description: 'software canary rendered as the bird',
    },
    {
      source: /\bpinned commit\b/iu,
      localized: /^(?![\s\S]*(?:\bcommit\b|коммит))[\s\S]+/iu,
      description: 'pinned Git commit omitted or mistranslated',
    },
  ],
  am: [
    {
      source: /.+/u,
      localized: /(?:\p{Script=Ethiopic}(?:ample|file|tag)|(?:ample|file|tag)\p{Script=Ethiopic})/iu,
      description: 'Amharic prose contains a leaked English subword fragment',
    },
    {
      source: /\b(?:recipes?|cookbooks?)\b/iu,
      localized: /የምግብ (?:አዘገጃጀት|አሰራር|ማብሰያ)/u,
      description: 'documentation recipe rendered as cooking instructions',
    },
    {
      source: /\bdigests?\b/iu,
      localized:
        /(?:የምግብ\s+)?(?:(?:ምስጠራ|ክሪፕቶግራፊክ)\s+)?(?:መፍጨ(?:ት|ቶች)|መፍጫ|መፈጨት)/u,
      description: 'cryptographic digest rendered as food digestion',
    },
    {
      source: /\btokens?\b/iu,
      localized: /ማስመሰያ\p{L}*/u,
      description: 'technical token rendered as impersonation',
    },
    {
      source: /\bfixtures?\b/iu,
      localized: /ቅር(?:ስ|ሶ)\p{L}*/u,
      description: 'test fixture rendered as a cultural relic',
    },
    {
      source: /\bartifacts?\b/iu,
      localized: /ቅር(?:ስ|ሶ)\p{L}*/u,
      description: 'software artifact rendered as a cultural relic',
    },
    {
      source: /\bconsum(?:e|es|ed|ing)\b/iu,
      localized: /(?:ይበላ(?:ል|ሉ)|የሚበላ)/u,
      description: 'technical consumption rendered as eating',
    },
    {
      source: /\bsibling\b/iu,
      localized: /ወንድም\s+እህት/u,
      description: 'sibling tree path rendered as a brother and sister',
    },
    {
      source: /\blineage\b/iu,
      localized: /ዘር\s+[ሀሐ]ረ(?:ግ|ጉ)/u,
      description: 'protocol lineage rendered as genealogy',
    },
    {
      source: /\brouting\b/iu,
      localized: /ማዞሪያ/u,
      description: 'network routing rendered as rotation',
    },
    {
      source: /\bpayloads?\b/iu,
      localized:
        /(?:የክፍያ\s+(?:ጭነት|ቁርጥራጮች|መገኘት|ባይት|ርዝመት|መጠን|መጠኖች|አሃዝ|አሃዞች)|(?:በ|ከ)ክፍያው|ደረሰኝ-ክፍያ|`Register::Domain`\s+ክፍያ)/u,
      description: 'technical payload rendered as a payment load',
    },
    {
      source: /\babort(?:s|ed|ing)?\b/iu,
      localized: /[ፅጽ]ንስ/u,
      description: 'protocol abort rendered as a pregnancy termination',
    },
    {
      source: /\bcadence\b/iu,
      localized: /ቃና/u,
      description: 'block cadence rendered as vocal tone',
    },
    {
      source: /\bmagic\b/iu,
      localized: /አስማት/u,
      description: 'binary magic value rendered as sorcery',
    },
    {
      source: /\berasure\b/iu,
      localized: /መደምሰስ/u,
      description: 'erasure coding rendered as deletion or destruction',
    },
    {
      source: /\bissue time\b/iu,
      localized: /የጉዳይ\s+ጊዜ/u,
      description: 'issuance time rendered as the time of a matter or case',
    },
    {
      source: /\bfail(?:s|ed|ing)? closed\b/iu,
      localized: /(?:አልተዘጋም|መዘጋት\s+አልተሳካም|ተዘግቶ\s+አልተሳካም|እና\s+ያልተሳካ\s+ነው)/u,
      description: 'fail-closed behavior rendered as failure to close or an inverted acceptance condition',
    },
    {
      source: /\bidempoten(?:t|ce|cy)\b/iu,
      localized: /(?:የማይረባ|አስደሳች|አይደምፖል|አስተሳሰብ)/u,
      description: 'idempotency rendered as uselessness, enjoyment, or thoughtfulness',
    },
    {
      source: /\bpools?\b/iu,
      localized: /(?:መዋኛ\s+)?ገንዳ\p{L}*/u,
      description: 'protocol pool rendered as a pond or swimming pool',
    },
    {
      source: /\bdetermin(?:istic(?:ally)?|ism)\b/iu,
      localized: /ቆራጥ/u,
      description: 'deterministic behavior rendered as decisiveness',
    },
    {
      source: /(?:\bfallbacks?\b|\bfalls? back\b)/iu,
      localized: /ውድቀት/u,
      description: 'fallback behavior rendered as a failure',
    },
    {
      source: /\bnullifiers?\b/iu,
      localized: /ከንቱ/u,
      description: 'cryptographic nullifier rendered as vanity or uselessness',
    },
    {
      source: /\bvanity (?:hosts?|hostnames?|domains?|URLs?|names?)\b/iu,
      localized: /ከንቱ/u,
      description: 'custom vanity hostname rendered as futility or vanity',
    },
    {
      source: /\bbuffering\b/iu,
      localized: /(?:curl\s+)?ማቋረጥን/u,
      description: 'I/O buffering rendered as termination',
    },
    {
      source: /\bmanual(?:ly)?(?:\s+\w+){0,2}\s+fallback\b/iu,
      localized: /መመሪያ/u,
      description: 'manual fallback rendered as an instruction manual',
    },
    {
      source: /\b(?:authorit(?:y|ies)|principals?)\b/iu,
      localized: /(?:ፍቃድ\s+)?ር[እዕ]ሰ\s+መምህር/u,
      description: 'authorization principal rendered as a school principal',
    },
    {
      source: /\bcommitments?\b/iu,
      localized: /ቁርጠኝነት/u,
      description: 'cryptographic commitment rendered as a personal obligation value',
    },
    {
      source: /\breceipts?\b/iu,
      localized: /ፕሮቶኮል\s+ውጤት\s+መዝገ(?:ብ|ቦች)/u,
      description: 'protocol receipt rendered as an over-expanded result record',
    },
    {
      source: /\bhomomorphic(?:ally)?\b/iu,
      localized: /ግብረ-ሰዶማዊ/u,
      description: 'homomorphic encryption rendered as homosexuality',
    },
    {
      source: /\bblockers?\b/iu,
      localized: /ማገጃ\p{L}*/u,
      description: 'readiness blocker rendered as a physical barrier',
    },
    {
      source: /\brounding\b/iu,
      localized: /የማዞሪያ\s+ሁነታ/u,
      description: 'rounding mode rendered as rotation mode',
    },
    {
      source: /\bstock Iroha CLI\b/iu,
      localized: /አክሲዮ(?:ን|ኑ)/u,
      description: 'stock CLI rendered as company stock',
    },
    {
      source: /\boutbox(?:es)?\b/iu,
      localized: /የወጪ\s+ሳጥን/u,
      description: 'message outbox rendered as an unlabeled physical box',
    },
    {
      source: /\bnodes?\b/iu,
      localized: /መስቀለኛ መንገ(?:ድ|ዱ|ዶች)/u,
      description: 'network or tree node rendered as a road intersection',
    },
    {
      source: /\bplanes?\b/iu,
      localized: /አውሮፕላን/u,
      description: 'software plane rendered as an aircraft',
    },
    {
      source: /\b(?:proof[- ]of[- ]stake|stake)\b/iu,
      localized: /አክሲዮን/u,
      description: 'proof-of-stake rendered as proof of company stock',
    },
    {
      source: /\bblocks?\b/iu,
      localized: /ማገጃ\p{L}*/u,
      description: 'blockchain block rendered as a physical barrier',
    },
    {
      source:
        /(?:\b(?:a|an|the|each|every|one|same|ordered|recent|latest|committed|finalized|genesis|new|full|local|current|another|finality|data|contiguous)\s+blocks?\b|\bblocks?\s+(?:(?:and|or)\s+(?:event|queue|explorer)|hash(?:es)?|height(?:s)?|header(?:s)?|storage|streams?|payload(?:s)?|proof(?:s)?|processing|history|evidence|context|events?|lookup|detail|target|interval|cadence|progress|synchronization|execution|bounds?|views?)\b|\bblocks?\b(?=[,.;:/-]))/iu,
      localized: /(?:እገዳ|አግድ)\p{L}*/u,
      description: 'blockchain block rendered as blocking or prohibition',
    },
    {
      source: /\bbalances?\b/iu,
      localized: /ሚዛን\p{L}*/u,
      description: 'account balance rendered as a weighing scale',
    },
    {
      source: /\bgenesis\b/iu,
      localized: /ዘፍጥረት/u,
      description: 'blockchain genesis rendered as biblical creation',
    },
    {
      source: /(?:\bwrite-side\b|(?<!\bit )\bwrites?\b)/iu,
      localized: /(?:ጽ(?:ሑ|ሁ)(?:ፍ|ፉ|ፎች|ፎቹ)|ጽፎች)/u,
      description: 'transaction write operation rendered as written text',
    },
    {
      source: /\bfaucets?\b/iu,
      localized: /(?:ቧንቧ|ቧንፉ)/u,
      description: 'testnet faucet rendered as a water pipe',
    },
    {
      source: /\bfaucets?\b/iu,
      localized: /(?:ውሃ\s+faucet|faucetል)/iu,
      description: 'faucet wording retained literal water or corrupted the word for file',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /ጡረታ/u,
      description: 'protocol retirement rendered as an employment pension',
    },
    {
      source: /\bpools?\b/iu,
      localized: /መዋኛ/u,
      description: 'protocol pool rendered as a swimming pool',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?:መጽሐፍ|መጽሀፍ|ደብተ(?:ር|ሩ|ሮ)\p{L}*|ቤተ መጻሕፍት)/u,
      description: 'ledger rendered as a book or software library',
    },
    {
      source: /\bnodes?\b/iu,
      localized: /ኖት/u,
      description: 'network node rendered as a note',
    },
    {
      source: /\bcrates?\b/iu,
      localized: /ሳጥን/u,
      description: 'Rust crate rendered as a physical box',
    },
    {
      source: /\bpipelines?\b/iu,
      localized: /ቧንቧ/u,
      description: 'software pipeline rendered as a water pipe',
    },
    {
      source: /\bsettlement\b/iu,
      localized: /ሰፈራ/u,
      description: 'protocol settlement rendered as a colony',
    },
    {
      source: /\bcommit(?:s|ted|ting)?\b/iu,
      localized: /ተሳትፎ/u,
      unlessLocalized: /\bcommit\b/iu,
      description: 'technical commit rendered as participation',
    },
    {
      source: /\bdeployments?\b/iu,
      localized: /ልውውጥ/u,
      description: 'software deployment rendered as an exchange',
    },
    {
      source: /\bsmoke tests?\b/iu,
      localized: /ጭስ ሙከራ/u,
      description: 'smoke test rendered as a literal smoke test',
    },
    {
      source: /\bsettlement\b/iu,
      localized: /ፍርድ ሂሳብ/u,
      description: 'protocol settlement rendered as a judgment account',
    },
    {
      source: /\bfund(?:ed|ing)?\b/iu,
      localized: /faucetናንስ/iu,
      description: 'funding hallucinated as a faucet-finance hybrid',
    },
    {
      source: /\b(?:committed world state|registry-committed)\b/iu,
      localized: /ተሰማር/u,
      description: 'committed state rendered as deployed state',
    },
    {
      source: /\bMouse\b/u,
      localized: /አይጥ/u,
      description: 'the Mouse example identifier translated as the animal',
    },
    {
      source: /\bAlice\b/u,
      localized: /አሊስ/u,
      description: 'the Alice example identifier transliterated',
    },
    {
      source: /\bpinned commit\b/iu,
      localized: /^(?![\s\S]*(?:\bcommit\b|ኮሚት|የምንጭ[- ]ኮድ ክለሳ))[\s\S]+/iu,
      description: 'pinned Git commit omitted or mistranslated',
    },
  ],
  es: [
    {
      source: /\bdigests?\b/iu,
      localized: /\bdigestiv\p{L}*/iu,
      description: 'cryptographic digest rendered as digestive',
    },
    {
      source: FINANCIAL_BALANCE_SOURCE,
      localized: /\b(?:balanza|equilibrios?)\b/iu,
      description: 'financial balance rendered as physical equilibrium',
    },
    {
      source: /\bpools?\b/iu,
      localized: /\b(?:alberca|piscina)s?\b/iu,
      description: 'protocol pool rendered as a swimming pool',
    },
  ],
  pt: [
    {
      source: /\bgrant(?:s|ed|ing)?\b/iu,
      localized: /\bsubvenç(?:ão|ões)\b/iu,
      description: 'permission grant rendered as a subsidy',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /\b(?:aposentad[oa]s?|aposentadoria|pensionamento)\b/iu,
      description: 'protocol retirement rendered as a pension',
    },
    {
      source: FINANCIAL_BALANCE_SOURCE,
      localized: /\b(?:balanços?|equilíbrios?)\b/iu,
      description: 'financial balance rendered as physical equilibrium',
    },
    {
      source: /\bpools?\b/iu,
      localized: /\bpiscinas?\b/iu,
      description: 'protocol pool rendered as a swimming pool',
    },
  ],
  fr: [
    {
      source: /\bescrows?\b/iu,
      localized: /\bescroquer\p{L}*/iu,
      description: 'escrow rendered as fraud or a scam',
    },
    {
      source: /\bdigests?\b/iu,
      localized: /\bdigestif\p{L}*/iu,
      description: 'cryptographic digest rendered as digestive',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /\b(?:pension|retraite)s?\b/iu,
      description: 'protocol retirement rendered as a pension',
    },
    {
      source: FINANCIAL_BALANCE_SOURCE,
      localized: /\b(?:balances?|équilibres?)\b/iu,
      description: 'financial balance rendered as physical equilibrium',
    },
    {
      source: /\bpools?\b/iu,
      localized: /\bpiscines?\b/iu,
      description: 'protocol pool rendered as a swimming pool',
    },
  ],
  az: [
    {
      source: /\bpeers?\b/iu,
      localized: /\bpeer(?!-to-peer)\b/iu,
      unlessSource: /^\s*<<<\s+\S+\s*$/u,
      description: 'network peer left in English prose',
    },
    {
      source: /\bvalidators?\b/iu,
      localized: /\bvalidators?\b/iu,
      description: 'consensus validator left in English prose',
    },
    {
      source: /\bruntime\b/iu,
      localized: /\bruntime\b/iu,
      description: 'software runtime left in English prose',
    },
    {
      source: /\bbuild(?:s|ing|t)?\b/iu,
      localized: /\bbuild\b/iu,
      description: 'software build left in English prose',
    },
    {
      source: /\bgenesis\b/iu,
      localized: /Müqəddəs Kitab/iu,
      description: 'blockchain genesis rendered as the Bible',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /kitab\p{L}*/iu,
      unlessSource: /\b(?:ledger books?|old-fashioned books?)\b/iu,
      description: 'ledger rendered as a book or software library',
    },
    {
      source: /\bgrant(?:s|ed|ing)?\b/iu,
      localized: /\btəqaüdl?\w*\b/iu,
      description: 'permission grant rendered as a scholarship',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /\b(?:pensiya|təqaüd)\w*\b/iu,
      description: 'protocol retirement rendered as a pension',
    },
    {
      source: /\bpools?\b/iu,
      localized: /hovuz\w*/iu,
      description: 'protocol pool rendered as a swimming pool',
    },
    {
      source: /\bbytes?\b/iu,
      localized: /(?<!\p{L})bit(?:lər(?:in|i|ə|dən)?|in|i)?(?!\p{L})/iu,
      unlessSource: /\bbits?\b/iu,
      description: 'bytes rendered as bits',
    },
  ],
  uz: [
    {
      source: /\bhooks?\b/iu,
      localized: /\bqamish\p{L}*/iu,
      description: 'lifecycle hook rendered as a reed',
    },
    {
      source: /\benabled\b/iu,
      localized: /\byoqilg['‘’]i\p{L}*/iu,
      description: 'enabled state rendered as fuel',
    },
    {
      source: /\bdigests?\b/iu,
      localized: /BLAKE3[^.\n]{0,100}o['’]chirishidir/iu,
      description: 'cryptographic digest rendered as deletion',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /(?<![\p{L}-])kitob\p{L}*/iu,
      description: 'ledger rendered as a book',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /\bpensiya\w*\b/iu,
      description: 'protocol retirement rendered as a pension',
    },
    {
      source: FINANCIAL_BALANCE_SOURCE,
      localized: /\bmuvozanat\w*\b/iu,
      description: 'financial balance rendered as physical equilibrium',
    },
    {
      source: /\bpools?\b/iu,
      localized: /hovuz\w*/iu,
      description: 'protocol pool rendered as a swimming pool',
    },
  ],
  mn: [
    {
      source: /\binstructions?\b/iu,
      localized: /сургалт\p{L}*/iu,
      unlessSource: /\btutorials?\b/iu,
      description: 'protocol instruction rendered as training',
    },
    {
      source: /\bescrows?\b/iu,
      localized: /(?:ургийн|шуурхай) хадгалалт/iu,
      description: 'protocol escrow rendered as lineage or express storage',
    },
    {
      source: /\baccounts? or triggers?\b/iu,
      localized: /төхөөрөмж\p{L}*/iu,
      description: 'account destination rendered as a hardware device',
    },
    {
      source: /\btriggers?\b/iu,
      localized: /(?:тэргүүлдэг зүйлс|Өдлөг)/iu,
      description: 'software trigger rendered as a leader or stimulus',
    },
    {
      source: /\blogs?\b/iu,
      localized: /төлөвлөгөө/iu,
      unlessSource: /\bplans?\b/iu,
      description: 'software log rendered as a plan',
    },
    {
      source: /\bdomains?\b/iu,
      localized: /Өмчийн нэр/iu,
      description: 'blockchain domain rendered as a property name',
    },
    {
      source: /\basset definitions?\b/iu,
      localized: /Өмчийн тодорхойлолт/iu,
      description: 'asset definition rendered as a property definition',
    },
    {
      source: /\bfaucets?\b/iu,
      localized: /хөрөнгө оруулалтын үйлчил\p{L}*/iu,
      description: 'testnet faucet rendered as an investment service',
    },
    {
      source: /\blots?\b/iu,
      localized: /бүртгэх олон/iu,
      description: 'RWA lot rendered as the quantity many',
    },
    {
      source: /\bbuyers?\b/iu,
      localized: /хуучаач\p{L}*/iu,
      description: 'buyer rendered as a dealer or old-timer',
    },
    {
      source: /\bquer(?:y|ies|ied|ying)\b/iu,
      localized: /судалга\p{L}*/iu,
      description: 'ledger query rendered as research',
    },
    {
      source: /\b(?:derive|finding|key|keys|retire|root|roots|schema|trigger|triggers)\b/iu,
      localized: /(?:түлш|шатахуун)\p{L}*/iu,
      description: 'technical key, root, or trigger concept rendered as fuel',
    },
    {
      source: /\bcommitments?\b/iu,
      localized: /үүрэг/iu,
      unlessLocalized: /амлалт/iu,
      description: 'cryptographic commitment rendered as performing a duty',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /номын (?:сан|жагсаалт)/iu,
      description: 'ledger rendered as a software library',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /тэтгэвэр\w*/iu,
      description: 'protocol retirement rendered as a pension',
    },
    {
      source: FINANCIAL_BALANCE_SOURCE,
      localized: /тэнцвэр\w*/iu,
      description: 'financial balance rendered as physical equilibrium',
    },
    {
      source: /\bpools?\b/iu,
      localized: /(?:усан сан|цөөрөм|Хөвсгөл|Баянгийн толгой)/iu,
      description: 'protocol pool rendered as a swimming pool',
    },
  ],
  dz: [
    {
      source: /\b(?:flows?|streams?)\b/iu,
      localized: /(?:ཆུ་རྒྱུན|རྒྱུགས་ཆུ)/u,
      description: 'technical flow or stream rendered as a river',
    },
    {
      source: /\b(?:block height|callers?|columns?|milliseconds|nanoseconds|weights?)\b/iu,
      localized: /ཀི་ལོ/u,
      description: 'technical concept rendered as a distance unit',
    },
    {
      source: /\bcode\b/iu,
      localized: /ཀོ་བིཌ/u,
      description: 'software code rendered as COVID',
    },
    {
      source: /\bescrows?\b/iu,
      localized: /གཏེར/u,
      description: 'escrow rendered as a mine',
    },
    {
      source: /\bgas\b/iu,
      localized: /ས་སྣུམ/u,
      description: 'blockchain gas rendered as petroleum',
    },
    {
      source: /\b(?:lock|locks)\b/iu,
      localized: /ལྡེ་མིག/u,
      description: 'technical lock rendered as a key',
    },
    {
      source: /\blots?\b/iu,
      localized: /སྣུམ་འཁོར/u,
      description: 'RWA lot rendered as a vehicle',
    },
    {
      source: /\binvoices?\b/iu,
      localized: /གློ་བུར/u,
      description: 'invoice rendered as an emergency item',
    },
    {
      source: /\bmilestones?\b/iu,
      localized: /མི་ལི་ཀྲོན/u,
      description: 'milestone rendered as a particle',
    },
    {
      source: /\bcontrollers?\b/iu,
      localized: /(?:ཁྲིམས་སྲུང|འགག་པ)/u,
      description: 'RWA controller rendered as a police officer',
    },
    {
      source: /\binstallation failures?\b/iu,
      localized: /མཐུད་སྦྲེལ/u,
      description: 'installation failure rendered as a connection failure',
    },
    {
      source: /\bsmoke tests?\b/iu,
      localized: /དུ་པ་བརྟག་དཔྱད/u,
      description: 'smoke test rendered as literal smoke testing',
    },
    {
      source: /\bpeers?\b/iu,
      localized: /མེ་ཏོག/u,
      description: 'network peer rendered as a flower',
    },
    {
      source: /\bloops?\b/iu,
      localized: /ལྡེ་མིག/u,
      description: 'software loop rendered as a key',
    },
    {
      source:
        /^(?![\s\S]*\b(?:audio|film|media|video)\b)[\s\S]*\b(?:accumulator|binary|catalog|frame|manifests?|platform|projections?|release|replay (?:limits|window)|snapshots?|wire format)\b/iu,
      localized: /གློག་བརྙན/u,
      description: 'technical artifact rendered as a film or video',
    },
    {
      source: /\bfaucets?\b/iu,
      localized:
        /(?:གློག་མེ་འཕྲུལ་ཆས|གློག་མེ་ལས་འགུལ|ཆུ་གཡུར|ཆུ་རྐ|ཐབ་ཤིང|ཐབ་རྡོག|ཐབ་ལམ|ཐབ་ལན|ཐབ་མ|འབུ་ཊི|འབུད་ཀ|འབུབ)/u,
      description: 'testnet faucet rendered as an appliance, water channel, or insect',
    },
    {
      source: /\bfaucets?\b/iu,
      localized: /(?:འfaucet|faucetི)/iu,
      description: 'faucet substitution spliced into a Dzongkha word',
    },
    {
      source: /\bpinned commit\b/iu,
      localized: /^(?![\s\S]*(?:\bcommit\b|ཀོ་མིཊ|ཀོ་མིཊི|ཀོ་མིཏ))[\s\S]+/iu,
      description: 'pinned Git commit omitted or mistranslated',
    },
  ],
  'zh-hans': [
    {
      source: /\btry it (?:on|with)\b/iu,
      localized: /试穿/u,
      description: 'trying a workflow rendered as trying on clothing',
    },
    {
      source: /.+/u,
      localized: /(?:圣经|神圣经文)/u,
      description: 'technical concept rendered as a religious text',
    },
    {
      source: /\bpools?\b/iu,
      localized: /游泳池/u,
      description: 'protocol pool rendered as a swimming pool',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /退休/u,
      description: 'protocol retirement rendered as employment retirement',
    },
    {
      source: /\bgrant(?:s|ed|ing)?\b/iu,
      localized: /补贴/u,
      description: 'permission grant rendered as a subsidy',
    },
    {
      source: /\bprincipals?\b/iu,
      localized: /校长/u,
      description: 'security principal rendered as a school principal',
    },
    {
      source: /\bendpoints?\b/iu,
      localized: /终(?:端)?点/u,
      description: 'API endpoint rendered as a journey terminus',
    },
    {
      source: /\bruntime\b/iu,
      localized: /运行时间/u,
      description: 'software runtime rendered as elapsed running time',
    },
    {
      source: /\bmanifests?\b/iu,
      localized: /宣言/u,
      description: 'technical manifest rendered as a public declaration',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /大册子/u,
      description: 'ledger rendered as a physical book',
    },
    {
      source: /\bquorum certificates?\b/iu,
      localized: /定制证书/u,
      description: 'quorum certificate rendered as a customized certificate',
    },
    {
      source: /\bescrow(?:s|ed|ing)?\b/iu,
      localized: /(?:保证人|保证金)/u,
      description: 'escrow rendered as a guarantor or security deposit',
    },
    {
      source: /\blanes?\b/iu,
      localized: /(?:轨道|车道|行径)/u,
      description: 'protocol lane rendered as a road or railway lane',
    },
    {
      source: /\bdataspaces?\b/iu,
      localized: /数据库/u,
      description: 'dataspace rendered as a database',
    },
    {
      source: /\bprojections?\b/iu,
      localized: /预测/u,
      description: 'state projection rendered as a prediction',
    },
    {
      source: /\bgas\b/iu,
      localized: /气体/u,
      description: 'transaction gas rendered as physical gas',
    },
    {
      source: /\bauthorit(?:y|ies)\b/iu,
      localized: /(?:权威|当局)/u,
      description: 'transaction authority rendered as prestige or government authorities',
    },
    {
      source: /\benvelopes?\b/iu,
      localized: /(?:包裹|封面|信封)/u,
      description: 'protocol envelope rendered as a parcel, cover, or postal envelope',
    },
    {
      source: /\bpoll(?:s|ed|ing)?\b/iu,
      localized: /调查/u,
      description: 'endpoint polling rendered as a survey',
    },
    {
      source: /\bnullifiers?\b/iu,
      localized: /(?:无效者|取消者)/u,
      description: 'cryptographic nullifier rendered as a person',
    },
    {
      source: /\b(?:launch(?:er|ers|ed|ing)?|emit(?:s|ted|ting)?|firing)\b/iu,
      localized: /发射/u,
      description: 'software launch or event emission rendered as firing a projectile',
    },
    {
      source: /\bnotes?\b/iu,
      localized: /(?:纸币|账单)/u,
      description: 'confidential value note rendered as a banknote or invoice',
    },
    {
      source:
        /(?:\b(?:shielded|opaque|input|output|private|spent|funding|change) notes?\b|\bnotes? (?:commitments?|owner|amounts?|randomness|fields?|nullifiers?|exist|contains?)\b)/iu,
      localized: /笔记/u,
      description: 'confidential value note rendered as a written note',
    },
    {
      source: /\bproofs?\b/iu,
      localized: /证据/u,
      unlessLocalized: /证明/u,
      description: 'cryptographic proof rendered as legal evidence',
    },
    {
      source:
        /(?:\b(?:proof|cryptographic|zero-knowledge|ZK|circuit|evidence) witnesses?\b|\bwitness(?:es)? (?:contains?|bytes?|data|values?|material)\b)/iu,
      localized: /证人/u,
      description: 'cryptographic witness rendered as a person',
    },
  ],
  'zh-hant': [
    {
      source: /\btry it (?:on|with)\b/iu,
      localized: /試穿/u,
      description: 'trying a workflow rendered as trying on clothing',
    },
    {
      source: /.+/u,
      localized: /(?:聖經|神聖經文)/u,
      description: 'technical concept rendered as a religious text',
    },
    {
      source: /\bpools?\b/iu,
      localized: /游泳池/u,
      description: 'protocol pool rendered as a swimming pool',
    },
    {
      source: /\bretir(?:e|ed|ement)\b/iu,
      localized: /退休/u,
      description: 'protocol retirement rendered as employment retirement',
    },
    {
      source: /\bgrant(?:s|ed|ing)?\b/iu,
      localized: /補貼/u,
      description: 'permission grant rendered as a subsidy',
    },
    {
      source: /\bprincipals?\b/iu,
      localized: /校長/u,
      description: 'security principal rendered as a school principal',
    },
    {
      source: /\bendpoints?\b/iu,
      localized: /終(?:端)?點/u,
      description: 'API endpoint rendered as a journey terminus',
    },
    {
      source: /\bruntime\b/iu,
      localized: /(?:運行時間|執行時間)/u,
      description: 'software runtime rendered as elapsed running time',
    },
    {
      source: /\bmanifests?\b/iu,
      localized: /宣言/u,
      description: 'technical manifest rendered as a public declaration',
    },
    {
      source: /\bledgers?\b/iu,
      localized: /大冊子/u,
      description: 'ledger rendered as a physical book',
    },
    {
      source: /\bquorum certificates?\b/iu,
      localized: /定製證書/u,
      description: 'quorum certificate rendered as a customized certificate',
    },
    {
      source: /\bescrow(?:s|ed|ing)?\b/iu,
      localized: /(?:保證人|保證金)/u,
      description: 'escrow rendered as a guarantor or security deposit',
    },
    {
      source: /\blanes?\b/iu,
      localized: /(?:軌道|車道|行徑)/u,
      description: 'protocol lane rendered as a road or railway lane',
    },
    {
      source: /\bdataspaces?\b/iu,
      localized: /資料庫/u,
      description: 'dataspace rendered as a database',
    },
    {
      source: /\bprojections?\b/iu,
      localized: /預測/u,
      description: 'state projection rendered as a prediction',
    },
    {
      source: /\bgas\b/iu,
      localized: /氣體/u,
      description: 'transaction gas rendered as physical gas',
    },
    {
      source: /\bauthorit(?:y|ies)\b/iu,
      localized: /(?:權威|當局)/u,
      description: 'transaction authority rendered as prestige or government authorities',
    },
    {
      source: /\benvelopes?\b/iu,
      localized: /(?:包裹|封面|信封)/u,
      description: 'protocol envelope rendered as a parcel, cover, or postal envelope',
    },
    {
      source: /\bpoll(?:s|ed|ing)?\b/iu,
      localized: /調查/u,
      description: 'endpoint polling rendered as a survey',
    },
    {
      source: /\bnullifiers?\b/iu,
      localized: /(?:無效者|取消者)/u,
      description: 'cryptographic nullifier rendered as a person',
    },
    {
      source: /\b(?:launch(?:er|ers|ed|ing)?|emit(?:s|ted|ting)?|firing)\b/iu,
      localized: /發射/u,
      description: 'software launch or event emission rendered as firing a projectile',
    },
    {
      source: /\bnotes?\b/iu,
      localized: /(?:紙幣|帳單)/u,
      description: 'confidential value note rendered as a banknote or invoice',
    },
    {
      source:
        /(?:\b(?:shielded|opaque|input|output|private|spent|funding|change) notes?\b|\bnotes? (?:commitments?|owner|amounts?|randomness|fields?|nullifiers?|exist|contains?)\b)/iu,
      localized: /筆記/u,
      description: 'confidential value note rendered as a written note',
    },
    {
      source: /\bproofs?\b/iu,
      localized: /證據/u,
      unlessLocalized: /證明/u,
      description: 'cryptographic proof rendered as legal evidence',
    },
    {
      source:
        /(?:\b(?:proof|cryptographic|zero-knowledge|ZK|circuit|evidence) witnesses?\b|\bwitness(?:es)? (?:contains?|bytes?|data|values?|material)\b)/iu,
      localized: /證人/u,
      description: 'cryptographic witness rendered as a person',
    },
  ],
}

function semanticFalseFriends(source: string, localized: string, locale: DocsLocale): string[] {
  const visible = (content: string): string =>
    content
      .replace(/`[^`]*`/gu, ' ')
      .replace(/\]\([^)]*\)/gu, ']')
      .replace(/<[^>]+>/gu, ' ')
      .replace(/https?:\/\/\S+/gu, ' ')
      .replace(/\{#[^}]+\}/gu, ' ')
  const anatomicalLeg = ANATOMICAL_PROTOCOL_LEG[locale.key]
  const technicalCommitAsObligation = TECHNICAL_COMMIT_AS_OBLIGATION[locale.key]
  const technicalCallAsTelephone = TECHNICAL_CALL_AS_TELEPHONE[locale.key]
  const humanCallContext =
    /\b(?:Kaigi|meeting|WebRTC|audio|video|phone|telephone|call (?:metadata|records?|IDs?))\b/iu.test(source) ||
    /\bcall (?:roster|view)\b/iu.test(source) ||
    /(?:CreateKaigi|LeaveKaigi)/u.test(source)
  const payloadAsUtility = PAYLOAD_AS_UTILITY[locale.key]
  const ledgerQueryAsQuestion = LEDGER_QUERY_AS_QUESTION[locale.key]
  const correctLedgerQueryTerm = CORRECT_LEDGER_QUERY_TERM[locale.key]
  const pipelineAsWaterPipe = PIPELINE_AS_WATER_PIPE[locale.key]
  const identifierAliasAsAnonymity = IDENTIFIER_ALIAS_AS_ANONYMITY[locale.key]
  const wallClockAsPhysicalClock = WALL_CLOCK_AS_PHYSICAL_CLOCK[locale.key]
  const technicalStateAsCountry = TECHNICAL_STATE_AS_COUNTRY[locale.key]
  const technicalBodyAsCorpse = TECHNICAL_BODY_AS_CORPSE[locale.key]
  const cryptoHashAsHashish = CRYPTO_HASH_AS_HASHISH[locale.key]
  const protocolForkAsUtensil = PROTOCOL_FORK_AS_UTENSIL[locale.key]
  const tokenMintAsHerb = TOKEN_MINT_AS_HERB[locale.key]
  const tokenMintAsMining = TOKEN_MINT_AS_MINING[locale.key]
  const technicalExecutionAsCapitalPunishment = TECHNICAL_EXECUTION_AS_CAPITAL_PUNISHMENT[locale.key]
  const softwareShellAsSeashell = SOFTWARE_SHELL_AS_SEASHELL[locale.key]
  const eventTriggerAsFirearm = EVENT_TRIGGER_AS_FIREARM[locale.key]
  const protocolPoolAsRecreation = PROTOCOL_POOL_AS_RECREATION[locale.key]
  const financialBalanceAsPhysicalScale = FINANCIAL_BALANCE_AS_PHYSICAL_SCALE[locale.key]
  const protocolSettlementAsHabitation = PROTOCOL_SETTLEMENT_AS_HABITATION[locale.key]
  const protocolLaneAsRoad = PROTOCOL_LANE_AS_ROAD[locale.key]
  const networkNodeAsRegistration = NETWORK_NODE_AS_REGISTRATION[locale.key]
  const identifierHandleAsDoorHandle = IDENTIFIER_HANDLE_AS_DOOR_HANDLE[locale.key]
  const dataTombstoneAsGravestone = DATA_TOMBSTONE_AS_GRAVESTONE[locale.key]
  const cryptoSignerAsSubscriber = CRYPTO_SIGNER_AS_SUBSCRIBER[locale.key]
  const rustCrateAsPhysicalBox = RUST_CRATE_AS_PHYSICAL_BOX[locale.key]
  const networkFeeAsHonorarium = NETWORK_FEE_AS_HONORARIUM[locale.key]
  const protocolQuoteAsQuotation = PROTOCOL_QUOTE_AS_QUOTATION[locale.key]
  const correctProtocolQuoteTerm = CORRECT_PROTOCOL_QUOTE_TERM[locale.key]
  const transactionScaffoldAsConstructionScaffold = TRANSACTION_SCAFFOLD_AS_CONSTRUCTION_SCAFFOLD[locale.key]
  const downstreamAsRiver = DOWNSTREAM_AS_RIVER[locale.key]
  const sourceCheckoutAsCashRegister = SOURCE_CHECKOUT_AS_CASH_REGISTER[locale.key]
  const webRtcOfferAsPriceQuote = WEBRTC_OFFER_AS_PRICE_QUOTE[locale.key]
  const softwareSnapshotAsPhotograph = SOFTWARE_SNAPSHOT_AS_PHOTOGRAPH[locale.key]
  const softwareBoilerplateAsPhysicalObject = SOFTWARE_BOILERPLATE_AS_PHYSICAL_OBJECT[locale.key]
  const softwareSidecarAsVehicle = SOFTWARE_SIDECAR_AS_VEHICLE[locale.key]
  const softwareWrapperAsPhysicalPackage = SOFTWARE_WRAPPER_AS_PHYSICAL_PACKAGE[locale.key]
  const protocolEnvelopeAsPostalItem = PROTOCOL_ENVELOPE_AS_POSTAL_ITEM[locale.key]
  const manifestFragmentAsApparentFragment = MANIFEST_FRAGMENT_AS_APPARENT_FRAGMENT[locale.key]
  const cryptoNonceAsNegationOrUnrelatedWord = CRYPTO_NONCE_AS_NEGATION_OR_UNRELATED_WORD[locale.key]
  const transactionAuthorityAsGovernmentOfficial = TRANSACTION_AUTHORITY_AS_GOVERNMENT_OFFICIAL[locale.key]
  const protocolReceiptAsRecipeOrReception = PROTOCOL_RECEIPT_AS_RECIPE_OR_RECEPTION[locale.key]
  const boxedInstructionAsPhysicalPackage = BOXED_INSTRUCTION_AS_PHYSICAL_PACKAGE[locale.key]
  const protocolCarrierAsTransportProvider = PROTOCOL_CARRIER_AS_TRANSPORT_PROVIDER[locale.key]
  const protocolWireAsPhysicalCable = PROTOCOL_WIRE_AS_PHYSICAL_CABLE[locale.key]
  const softwareTestFixtureAsPhysicalObject = SOFTWARE_TEST_FIXTURE_AS_PHYSICAL_OBJECT[locale.key]
  const canonicalAsLegal = CANONICAL_AS_LEGAL[locale.key]
  const computingHostAsHomeOwner = COMPUTING_HOST_AS_HOME_OWNER[locale.key]
  const rules: readonly SemanticFalseFriendRule[] = [
    ...(SEMANTIC_FALSE_FRIEND_RULES[locale.key] ?? []),
    {
      source: /\bmintability\b/iu,
      localized: /\bAsset issuance polic(?:y|ies)\b/iu,
      description: 'clarified asset issuance policy left in English',
    },
    ...(anatomicalLeg
      ? [
          {
            source: /\blegs?\b/iu,
            localized: anatomicalLeg,
            description: 'protocol leg rendered as an anatomical limb',
          },
        ]
      : []),
    ...(technicalCommitAsObligation
      ? [
          {
            source:
              /^(?![\s\S]*\b(?:commitments?|must|should|required|mandatory|obligation|AIR|FRI|Merkle)\b)[\s\S]*\bcommit(?:s|ted|ting)?\b/iu,
            localized: technicalCommitAsObligation,
            description: 'technical commit rendered as an obligation',
          },
        ]
      : []),
    ...(technicalCallAsTelephone && !humanCallContext
      ? [
          {
            source: /\bcall(?:ed|er|ers|ing|s)?\b/iu,
            localized: technicalCallAsTelephone,
            description: 'technical call rendered as a telephone call',
          },
        ]
      : []),
    ...(payloadAsUtility
      ? [
          {
            source: /\bpayloads?\b/iu,
            localized: payloadAsUtility,
            description: 'technical payload rendered as a useful or beneficial burden',
          },
        ]
      : []),
    ...(ledgerQueryAsQuestion
      ? [
          {
            source: /\bquer(?:y|ies|ied|ying)\b/iu,
            localized: ledgerQueryAsQuestion,
            unlessLocalized: correctLedgerQueryTerm,
            description: 'ledger query rendered as an ordinary question or investigation',
          },
        ]
      : []),
    ...(pipelineAsWaterPipe
      ? [
          {
            source: /\bpipelines?\b/iu,
            localized: pipelineAsWaterPipe,
            description: 'software pipeline rendered as a water pipe',
          },
        ]
      : []),
    ...(identifierAliasAsAnonymity
      ? [
          {
            source: /\balias(?:es)?\b/iu,
            localized: identifierAliasAsAnonymity,
            unlessLocalized: locale.key === 'ka' ? /(?:^|[^\p{L}])(?:alias|ალიას)\p{L}*/iu : undefined,
            description: 'identifier alias rendered as anonymity',
          },
        ]
      : []),
    ...(wallClockAsPhysicalClock
      ? [
          {
            source: /\bwall[- ]clock\b/iu,
            localized: wallClockAsPhysicalClock,
            description: 'system wall clock rendered as a wall-mounted clock',
          },
        ]
      : []),
    ...(technicalStateAsCountry
      ? [
          {
            source: /\bstate(?:s|ful|less)?\b/iu,
            localized: technicalStateAsCountry,
            description: 'ledger state rendered as a country or sovereign state',
          },
        ]
      : []),
    ...(technicalBodyAsCorpse
      ? [
          {
            source: /\bbod(?:y|ies)\b/iu,
            localized: technicalBodyAsCorpse,
            description: 'protocol body rendered as a corpse',
          },
        ]
      : []),
    ...(cryptoHashAsHashish
      ? [
          {
            source: /\bhash(?:es|ed|ing)?\b/iu,
            localized: cryptoHashAsHashish,
            description: 'cryptographic hash rendered as hashish',
          },
        ]
      : []),
    ...(protocolForkAsUtensil
      ? [
          {
            source: /\bfork(?:s|ed|ing)?\b/iu,
            localized: protocolForkAsUtensil,
            description: 'protocol fork rendered as an eating utensil',
          },
        ]
      : []),
    ...(tokenMintAsHerb
      ? [
          {
            source: /\bmint(?:s|ed|ing)?\b/iu,
            localized: tokenMintAsHerb,
            description: 'token minting rendered as the mint herb',
          },
        ]
      : []),
    ...(tokenMintAsMining
      ? [
          {
            source: /\bmint(?:s|ed|ing|able)?\b/iu,
            localized: tokenMintAsMining,
            description: 'token minting rendered as cryptocurrency mining',
          },
        ]
      : []),
    ...(technicalExecutionAsCapitalPunishment
      ? [
          {
            source: /\bexecut(?:e|es|ed|ing|ion|ions)\b/iu,
            localized: technicalExecutionAsCapitalPunishment,
            description: 'software execution rendered as capital punishment',
          },
        ]
      : []),
    ...(softwareShellAsSeashell
      ? [
          {
            source: /\bshells?\b/iu,
            localized: softwareShellAsSeashell,
            description: 'command shell rendered as a seashell',
          },
        ]
      : []),
    ...(eventTriggerAsFirearm
      ? [
          {
            source: /\btriggers?\b/iu,
            localized: eventTriggerAsFirearm,
            description: 'event trigger rendered as a firearm trigger or switch',
          },
        ]
      : []),
    ...(protocolPoolAsRecreation
      ? [
          {
            source: /\bpools?\b/iu,
            localized: protocolPoolAsRecreation,
            description: 'protocol pool rendered as a swimming pool or path',
          },
        ]
      : []),
    ...(financialBalanceAsPhysicalScale
      ? [
          {
            source: FINANCIAL_BALANCE_SOURCE,
            localized: financialBalanceAsPhysicalScale,
            description: 'financial balance rendered as a physical scale',
          },
        ]
      : []),
    ...(protocolSettlementAsHabitation
      ? [
          {
            source: /\bsettlements?\b/iu,
            localized: protocolSettlementAsHabitation,
            description: 'protocol settlement rendered as habitation or a populated place',
          },
        ]
      : []),
    ...(protocolLaneAsRoad
      ? [
          {
            source: /\blanes?\b/iu,
            localized: protocolLaneAsRoad,
            description: 'protocol lane rendered as a public road or street',
          },
        ]
      : []),
    ...(networkNodeAsRegistration
      ? [
          {
            source:
              /\b(?:Check a Target Node|Enable Sponsorship on the Node|Node Count and Quorum|Node Runtime|node identity|node key|node readiness|node parameter snapshot|node-local completion records|node's OpenAPI document)\b/iu,
            localized: networkNodeAsRegistration,
            description: 'network node rendered as registration, a bond, or an unrelated object',
          },
        ]
      : []),
    ...(identifierHandleAsDoorHandle
      ? [
          {
            source: /\bhandles?\b/iu,
            localized: identifierHandleAsDoorHandle,
            description: 'identifier handle rendered as a physical door handle',
          },
        ]
      : []),
    ...(dataTombstoneAsGravestone
      ? [
          {
            source: /\btombstones?\b/iu,
            localized: dataTombstoneAsGravestone,
            description: 'data tombstone rendered as a gravestone or cemetery',
          },
        ]
      : []),
    ...(cryptoSignerAsSubscriber
      ? [
          {
            source: /\b(?:signers?|signator(?:y|ies))\b/iu,
            localized: cryptoSignerAsSubscriber,
            description: 'cryptographic signer rendered as a subscriber',
          },
        ]
      : []),
    ...(rustCrateAsPhysicalBox
      ? [
          {
            source: /\bcrates?\b/iu,
            localized: rustCrateAsPhysicalBox,
            description: 'Rust crate rendered as a physical box or cash register',
          },
        ]
      : []),
    ...(networkFeeAsHonorarium
      ? [
          {
            source: /\bfees?\b/iu,
            localized: networkFeeAsHonorarium,
            description: 'network fee rendered as a professional honorarium',
          },
        ]
      : []),
    ...(protocolQuoteAsQuotation
      ? [
          {
            source: /^(?![\s\S]*\b(?:JSON quotes?|quoted twice)\b)[\s\S]*\bquote(?:s|d|ing)?\b/iu,
            localized: protocolQuoteAsQuotation,
            unlessLocalized: correctProtocolQuoteTerm,
            description: 'fee quote rendered as a literary quotation',
          },
        ]
      : []),
    ...(transactionScaffoldAsConstructionScaffold
      ? [
          {
            source: /\bscaffolds?\b/iu,
            localized: transactionScaffoldAsConstructionScaffold,
            description: 'transaction scaffold rendered as construction scaffolding',
          },
        ]
      : []),
    ...(downstreamAsRiver
      ? [
          {
            source: /\bdownstream\b/iu,
            localized: downstreamAsRiver,
            description: 'downstream processing rendered as a location below a river',
          },
        ]
      : []),
    ...(sourceCheckoutAsCashRegister
      ? [
          {
            source: /\bcheckout\b/iu,
            localized: sourceCheckoutAsCashRegister,
            description: 'source-control checkout rendered as a cash register or payment checkout',
          },
        ]
      : []),
    ...(webRtcOfferAsPriceQuote
      ? [
          {
            source: /\bWebRTC offers? and answers?\b/iu,
            localized: webRtcOfferAsPriceQuote,
            description: 'WebRTC offer rendered as a financial price quote',
          },
        ]
      : []),
    ...(softwareSnapshotAsPhotograph
      ? [
          {
            source: /\bsnapshots?\b/iu,
            localized: softwareSnapshotAsPhotograph,
            description: 'software or ledger snapshot rendered as a photograph',
          },
        ]
      : []),
    ...(softwareBoilerplateAsPhysicalObject
      ? [
          {
            source: /\bboilerplate\b/iu,
            localized: softwareBoilerplateAsPhysicalObject,
            description: 'software boilerplate rendered as a physical plate or temperature',
          },
        ]
      : []),
    ...(softwareSidecarAsVehicle
      ? [
          {
            source: /\bsidecars?\b/iu,
            localized: softwareSidecarAsVehicle,
            description: 'software sidecar rendered as a vehicle or motorcycle attachment',
          },
        ]
      : []),
    ...(softwareWrapperAsPhysicalPackage
      ? [
          {
            source: /(?:\btyped wrapper\b|\bendpoint wrappers\b|\bprovide wrappers\b|^-\s*:\s*a\s+wrapping a\b)/iu,
            localized: softwareWrapperAsPhysicalPackage,
            description: 'software wrapper rendered as physical packaging',
          },
        ]
      : []),
    ...(protocolEnvelopeAsPostalItem
      ? [
          {
            source: /\benvelopes?\b/iu,
            localized: protocolEnvelopeAsPostalItem,
            description: 'protocol envelope rendered as a postal envelope',
          },
        ]
      : []),
    ...(manifestFragmentAsApparentFragment
      ? [
          {
            source: /\bmanifest fragment\b/iu,
            localized: manifestFragmentAsApparentFragment,
            description: 'manifest noun rendered as apparent or obvious',
          },
        ]
      : []),
    ...(cryptoNonceAsNegationOrUnrelatedWord
      ? [
          {
            source: /\bnonces?\b/iu,
            localized: cryptoNonceAsNegationOrUnrelatedWord,
            description: 'cryptographic nonce rendered as negation, a copy, or an unrelated word',
          },
        ]
      : []),
    ...(transactionAuthorityAsGovernmentOfficial
      ? [
          {
            source: /\bauthorit(?:y|ies)\b/iu,
            localized: transactionAuthorityAsGovernmentOfficial,
            description: 'transaction authority rendered as a government agency or official',
          },
        ]
      : []),
    ...(protocolReceiptAsRecipeOrReception
      ? [
          {
            source: /^(?![\s\S]*\brecipe\b)[\s\S]*\breceipts?\b/iu,
            localized: protocolReceiptAsRecipeOrReception,
            description: 'protocol receipt rendered as a recipe or reception',
          },
        ]
      : []),
    ...(boxedInstructionAsPhysicalPackage
      ? [
          {
            source: /\bboxed\b/iu,
            localized: boxedInstructionAsPhysicalPackage,
            description: 'boxed instruction rendered as a physical box or package',
          },
        ]
      : []),
    ...(protocolCarrierAsTransportProvider
      ? [
          {
            source: /\bcarriers?\b/iu,
            localized: protocolCarrierAsTransportProvider,
            description: 'protocol carrier rendered as a transport company, person, or vehicle',
          },
        ]
      : []),
    ...(protocolWireAsPhysicalCable
      ? [
          {
            source: /(?:\bon[- ]wire\b|\bon the wire\b|\bwire[- ]formats?\b|\bwire (?:bytes?|payloads?|values?)\b)/iu,
            localized: protocolWireAsPhysicalCable,
            description: 'protocol wire format rendered as a physical wire or cable',
          },
        ]
      : []),
    ...(softwareTestFixtureAsPhysicalObject
      ? [
          {
            source: /\b(?:fixtures?|harness(?:es)?)\b/iu,
            localized: softwareTestFixtureAsPhysicalObject,
            unlessLocalized: CORRECT_SOFTWARE_TEST_FIXTURE_TERM[locale.key],
            description: 'software test fixture or harness rendered as a physical object',
          },
        ]
      : []),
    ...(canonicalAsLegal
      ? [
          {
            source:
              locale.key === 'zh-hans' || locale.key === 'zh-hant'
                ? /^(?![\s\S]*\bquorum\b)[\s\S]*\b(?:non-?)?canonical(?:ity|ly|i[sz](?:e[ds]?|ing|ation))?\b/iu
                : /\b(?:non-?)?canonical(?:ity|ly|i[sz](?:e[ds]?|ing|ation))?\b/iu,
            localized: canonicalAsLegal,
            unlessLocalized: CORRECT_CANONICAL_TERM[locale.key],
            description: 'canonical encoding rendered as legal or lawful',
          },
        ]
      : []),
    ...(computingHostAsHomeOwner
      ? [
          {
            source:
              /\b(?:affected host|host filesystem|host integration|host name|hostname|hosted|hosts? (?:or|uses?|running|that|where|with)|local host|remote host)\b/iu,
            localized: computingHostAsHomeOwner,
            description: 'computing host rendered as a landlord',
          },
        ]
      : []),
  ]
  return rules
    .filter(
      (rule) =>
        rule.source.test(visible(source)) &&
        !rule.unlessSource?.test(visible(source)) &&
        rule.localized.test(visible(localized)) &&
        !rule.unlessLocalized?.test(visible(localized)),
    )
    .map((rule) => rule.description)
}

const PROSE_EXAMPLE_IDENTIFIERS = ['Mouse', 'Alice', 'Mad Hatter'] as const

function exactAsciiIdentifierCount(content: string, identifier: string): number {
  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
  return content.match(new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z])`, 'gu'))?.length ?? 0
}

type ProseStructureKind = 'blockquote' | 'directive' | 'footnote' | 'heading' | 'list' | 'plain' | 'table'

function proseStructureKind(content: string): ProseStructureKind {
  if (/^ {0,3}#{1,6}[ \t]+/u.test(content)) return 'heading'
  if (/^ {0,3}(?:[-+*]|\d+[.)])[ \t]+/u.test(content)) return 'list'
  if (/^ {0,3}\[\^[^\]\n]+\]:[ \t]+/u.test(content)) return 'footnote'
  if (/^ {0,3}>[ \t]?/u.test(content)) return 'blockquote'
  if (/^ {0,3}\|/u.test(content)) return 'table'
  if (/^ {0,3}:::/u.test(content)) return 'directive'
  return 'plain'
}

const STRUCTURAL_PROSE_KINDS = new Set<ProseStructureKind>([
  'blockquote',
  'directive',
  'footnote',
  'heading',
  'list',
  'table',
])

function headingLabel(body: string, lineIndex: number): string {
  return (body.split(/\r?\n/u)[lineIndex] ?? '')
    .replace(/^ {0,3}#{1,6}[ \t]+/u, '')
    .replace(/[ \t]+#+[ \t]*$/u, '')
    .replace(/\s+\{#[A-Za-z_][\w:.-]*\}\s*$/u, '')
    .trim()
}

function footnoteMarkerCounts(content: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const match of content.matchAll(/\[\^[^\]\n]+\]/gu)) {
    counts.set(match[0], (counts.get(match[0]) ?? 0) + 1)
  }
  return counts
}

export function inlineCodeSpanCounts(content: string): Map<string, number> {
  const counts = new Map<string, number>()
  const prose = markdownTranslationUnits(content)
    .filter((unit) => unit.translate)
    .map((unit) => unit.content)
    .join('\n')
  for (const match of prose.matchAll(/(?<!`)(`+)(?!`)([^\n]*?)\1(?!`)/gu)) {
    let value = match[2]
    if (value.startsWith(' ') && value.endsWith(' ') && value.trim().length > 0) value = value.slice(1, -1)
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return counts
}

export function markdownLinkDestinations(content: string): string[] {
  const prose = markdownTranslationUnits(content)
    .filter((unit) => unit.translate)
    .map((unit) => unit.content)
    .join('\n')
    .replace(/`[^`]*`/gu, ' ')
  const destinations: string[] = []
  for (const match of prose.matchAll(/!?\[[^\]\n]*\]\(\s*(?:<([^>\n]+)>|([^\s)\n]+))/gu)) {
    destinations.push(match[1] ?? match[2])
  }
  for (const match of prose.matchAll(/\bhref\s*=\s*["']([^"']+)["']/giu)) destinations.push(match[1])
  return destinations
}

function markdownLinks(content: string): Array<{ destination: string; label: string }> {
  const prose = markdownTranslationUnits(content)
    .filter((unit) => unit.translate)
    .map((unit) => unit.content)
    .join('\n')
    .replace(/`[^`]*`/gu, ' ')
  return [...prose.matchAll(/!?\[([^\]\n]*)\]\(\s*(?:<([^>\n]+)>|([^\s)\n]+))/gu)].map((match) => ({
    destination: match[2] ?? match[3],
    label: match[1].trim(),
  }))
}

function valueCounts<Value>(values: readonly Value[]): Map<Value, number> {
  const counts = new Map<Value, number>()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  return counts
}

function mapsEqual<Key>(left: ReadonlyMap<Key, number>, right: ReadonlyMap<Key, number>): boolean {
  return left.size === right.size && [...left].every(([key, value]) => right.get(key) === value)
}

const HUMAN_READABLE_LINK_LABELS = new Set([
  'Anonymous Transactions',
  'Client Configuration',
  'Compatibility Matrix',
  'Data Model Schema',
  'Data Modeling',
  'Embed Kaigi',
  'Fraud Monitoring',
  'Fungible Assets',
  'Fungible assets',
  'Generating Cryptographic Keys',
  'Genesis block',
  'Get Testnet XOR on Taira',
  'Hot Reload',
  'Iroha JavaScript demo',
  'Iroha Modules',
  'Iroha source repository',
  'JavaScript SDK source-build setup',
  'Kotlin/Java tutorial',
  'Kura storage',
  'Launch Iroha',
  'Launch Iroha 3',
  'Native Asset Escrow',
  'Native escrow integration tests at the pinned commit',
  'Network Deployment',
  'Operational Security',
  'Password Security',
  'Peer Management',
  'Performance and metrics',
  'Permission Tokens',
  'Provision a New Dataspace',
  'Query Ledger State',
  'Query ledger state',
  'Real-World Assets',
  'Release Readiness',
  'Run Atomic Private Cross-Dataspace Settlement',
  'SDK Tutorials',
  'Security Principles',
  'Shared Setup',
  'Smart Contracts',
  'Smart contracts',
  'Storing Cryptographic Keys',
  'Torii (Gate)',
  'Torii API console',
  'Torii Endpoints',
  'VitePress code-snippet syntax',
  'World State View',
  'Byzantine fault tolerance',
  'configuration parameters',
  'create a GitHub issue',
  'data event filters',
  'domain-specific',
  'event filters',
  'genesis block',
  'key generation',
  'multi-hash format',
  'native asset escrow ISIs',
  'peer configuration',
  'peer management',
  'sample apps',
  'stream-events recipe',
  'view change',
  'Python tutorial',
])

export function markdownLinkLabels(content: string): string[] {
  return markdownLinks(content).map(({ label }) => label)
}

export function sourceEquivalentLink(destination: string, locale: DocsLocale): string {
  if (destination === `/${locale.path}` || destination === `/${locale.path}/`) return '/'
  return destination.startsWith(`/${locale.path}/`) ? destination.slice(locale.path.length + 1) : destination
}

function proseCompletenessErrors(
  englishBody: string,
  localizedBody: string,
  locale: DocsLocale,
  route: string,
): string[] {
  const englishUnits = markdownTranslationUnits(englishBody).filter((unit) => unit.translate)
  const localizedUnits = markdownTranslationUnits(localizedBody).filter((unit) => unit.translate)
  if (englishUnits.length !== localizedUnits.length) {
    return [
      `${locale.path}/${route}: prose unit inventory drift (expected ${englishUnits.length}, found ${localizedUnits.length})`,
    ]
  }

  const minimumRatio = translationMinimumRatio(locale.key)
  const errors: string[] = []
  for (let index = 0; index < englishUnits.length; index += 1) {
    const sourceStructure = proseStructureKind(englishUnits[index].content)
    const localizedStructure = proseStructureKind(localizedUnits[index].content)
    if (
      sourceStructure !== localizedStructure &&
      (STRUCTURAL_PROSE_KINDS.has(sourceStructure) || STRUCTURAL_PROSE_KINDS.has(localizedStructure))
    ) {
      errors.push(
        `${locale.path}/${route}: prose unit ${index + 1} has structural marker drift (expected ${sourceStructure}, found ${localizedStructure})`,
      )
    }
    const exactFallback = untranslatedEnglishFallback(englishUnits[index].content, localizedUnits[index].content)
    if (exactFallback) {
      errors.push(`${locale.path}/${route}: prose unit ${index + 1} is an untranslated English fallback`)
    } else {
      const embeddedFallback = embeddedEnglishFallback(englishUnits[index].content, localizedUnits[index].content)
      if (embeddedFallback) {
        errors.push(
          `${locale.path}/${route}: prose unit ${index + 1} contains untranslated English text: ${embeddedFallback}`,
        )
      }
    }
    const unexpectedScripts = unexpectedWritingScripts(localizedUnits[index].content, locale)
    if (unexpectedScripts.length > 0) {
      errors.push(
        `${locale.path}/${route}: prose unit ${index + 1} contains unexpected writing script: ${unexpectedScripts.join(', ')}`,
      )
    }
    for (const falseFriend of semanticFalseFriends(
      englishUnits[index].content,
      localizedUnits[index].content,
      locale,
    )) {
      errors.push(`${locale.path}/${route}: prose unit ${index + 1} contains semantic false friend: ${falseFriend}`)
    }
    for (const identifier of PROSE_EXAMPLE_IDENTIFIERS) {
      const expected = exactAsciiIdentifierCount(englishUnits[index].content, identifier)
      if (expected === 0) continue
      const found = exactAsciiIdentifierCount(localizedUnits[index].content, identifier)
      if (found !== expected) {
        errors.push(
          `${locale.path}/${route}: prose unit ${index + 1} must preserve example identifier ${identifier} exactly (expected ${expected}, found ${found})`,
        )
      }
    }
    const sourceLetters = letterCount(englishUnits[index].content)
    if (sourceLetters < 80) continue
    const localizedLetters = letterCount(localizedUnits[index].content)
    const ratio = localizedLetters / sourceLetters
    const sourceSentences = sentenceCount(englishUnits[index].content, 'en')
    const localizedSentences = sentenceCount(localizedUnits[index].content, locale.lang)
    // Translators may legitimately fuse adjacent source sentences. Only flag
    // sentence-count drift when the localized unit is also unusually short for
    // the target language, which makes a dropped sentence substantially more
    // likely than a punctuation or style change.
    if (
      sourceSentences >= 2 &&
      localizedSentences < sourceSentences &&
      ratio < sentenceCoverageMinimumRatio(locale.key)
    ) {
      errors.push(
        `${locale.path}/${route}: prose unit ${index + 1} has incomplete sentence coverage (expected at least ${sourceSentences}, found ${localizedSentences}; ${ratio.toFixed(2)} of source letters)`,
      )
    }
    if (ratio <= minimumRatio) {
      errors.push(
        `${locale.path}/${route}: prose unit ${index + 1} is materially truncated (${ratio.toFixed(2)} of source letters)`,
      )
    }
    if (
      /[.!?](?:["')\]}]*)$/u.test(englishUnits[index].content.trim()) &&
      /[,;،؛，；](?:["')\]}»”]*)$/u.test(localizedUnits[index].content.trim())
    ) {
      errors.push(`${locale.path}/${route}: prose unit ${index + 1} ends with continuation punctuation`)
    }
  }
  return errors
}

export async function validateI18n(options: I18nValidationOptions = {}): Promise<string[]> {
  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const localePaths = new Set(TRANSLATED_LOCALES.map((locale) => locale.path))
  const inventory = (await markdownFiles(sourceRoot)).filter((file) => {
    const firstSegment = file.split('/')[0]
    return firstSegment !== 'snippets' && !localePaths.has(firstSegment)
  })
  const inventorySet = new Set(inventory)
  const english = new Map<string, string>()
  const errors: string[] = []

  for (const route of inventory) english.set(route, await readFile(path.join(sourceRoot, route), 'utf8'))

  for (const locale of locales) {
    const localeRoot = path.join(sourceRoot, locale.path)
    const localizedInventory = (await markdownFiles(localeRoot)).filter((file) => !file.startsWith('snippets/'))
    const localizedSet = new Set(localizedInventory)

    for (const route of inventory) {
      if (!localizedSet.has(route)) errors.push(`${locale.path}/${route}: missing translated page`)
    }
    for (const route of localizedInventory) {
      if (!inventorySet.has(route)) errors.push(`${locale.path}/${route}: no matching English page`)
    }

    for (const route of localizedInventory.filter((file) => inventorySet.has(file))) {
      const englishContent = english.get(route)!
      const localizedContent = await readFile(path.join(localeRoot, route), 'utf8')
      const { metadata, body: localizedBody } = parseFrontmatter(localizedContent)
      const englishBody = parseFrontmatter(englishContent).body
      const englishHeadings = markdownHeadings(englishBody)
      const localizedHeadings = markdownHeadings(localizedBody)
      const englishDirectives = markdownContainerDirectives(englishBody)
      const localizedDirectives = markdownContainerDirectives(localizedBody)
      const expectedSource = `/${route}`
      const expectedHash = sha256(englishContent)

      if (!/A?PH\d{4,7}/u.test(englishBody) && /A?PH\d{4,7}/u.test(localizedBody)) {
        errors.push(`${locale.path}/${route}: leaked translation placeholder token`)
      }
      if (!englishBody.includes('5.7.1') && localizedBody.includes('5.7.1')) {
        errors.push(`${locale.path}/${route}: leaked unrelated version-history text`)
      }

      if (metadata.translation_locale !== locale.key) {
        errors.push(`${locale.path}/${route}: translation_locale must be ${locale.key}`)
      }
      if (metadata.translation_source !== expectedSource) {
        errors.push(`${locale.path}/${route}: translation_source must be ${expectedSource}`)
      }
      if (metadata.translation_source_hash !== expectedHash) {
        errors.push(`${locale.path}/${route}: translation_source_hash is stale or missing`)
      }
      if (metadata.translation_status !== TRANSLATION_STATUS) {
        errors.push(`${locale.path}/${route}: translation_status must be ${TRANSLATION_STATUS}`)
      }
      const englishFrontmatterFields = translatableFrontmatterFields(englishContent)
      const localizedFrontmatterFields = translatableFrontmatterFields(localizedContent)
      if (localizedFrontmatterFields.length !== englishFrontmatterFields.length) {
        errors.push(
          `${locale.path}/${route}: translatable frontmatter inventory drift (expected ${englishFrontmatterFields.length}, found ${localizedFrontmatterFields.length})`,
        )
      } else {
        for (let index = 0; index < englishFrontmatterFields.length; index += 1) {
          const sourceField = englishFrontmatterFields[index]
          const localizedField = localizedFrontmatterFields[index]
          if (localizedField.key !== sourceField.key) {
            errors.push(
              `${locale.path}/${route}: translatable frontmatter field ${index + 1} must preserve key ${sourceField.key}`,
            )
            continue
          }
          if (untranslatedEnglishFallback(sourceField.value, localizedField.value)) {
            errors.push(`${locale.path}/${route}: frontmatter field ${sourceField.key} ${index + 1} is untranslated`)
          } else {
            const embeddedFallback = embeddedEnglishFallback(sourceField.value, localizedField.value)
            if (embeddedFallback) {
              errors.push(
                `${locale.path}/${route}: frontmatter field ${sourceField.key} ${index + 1} contains untranslated English text: ${embeddedFallback}`,
              )
            }
          }
          const unexpectedScripts = unexpectedWritingScripts(localizedField.value, locale)
          if (unexpectedScripts.length > 0) {
            errors.push(
              `${locale.path}/${route}: frontmatter field ${sourceField.key} ${index + 1} contains unexpected writing script: ${unexpectedScripts.join(', ')}`,
            )
          }
          for (const falseFriend of semanticFalseFriends(sourceField.value, localizedField.value, locale)) {
            errors.push(
              `${locale.path}/${route}: frontmatter field ${sourceField.key} ${index + 1} contains semantic false friend: ${falseFriend}`,
            )
          }
        }
      }
      if (localizedHeadings.length !== englishHeadings.length) {
        errors.push(
          `${locale.path}/${route}: heading inventory drift (expected ${englishHeadings.length}, found ${localizedHeadings.length})`,
        )
      } else {
        for (let index = 0; index < englishHeadings.length; index += 1) {
          const expectedAnchor = englishHeadings[index].stableAnchor
          const actualAnchor = localizedHeadings[index].explicitAnchor
          if (actualAnchor !== expectedAnchor) {
            errors.push(`${locale.path}/${route}: heading ${index + 1} must preserve anchor ${expectedAnchor}`)
          }
          const englishLabel = headingLabel(englishBody, englishHeadings[index].lineIndex)
          const localizedLabel = headingLabel(localizedBody, localizedHeadings[index].lineIndex)
          if (untranslatedEnglishFallback(englishLabel, localizedLabel, true)) {
            errors.push(`${locale.path}/${route}: heading ${index + 1} is an untranslated English fallback`)
          }
        }
      }
      if (localizedDirectives.length !== englishDirectives.length) {
        errors.push(
          `${locale.path}/${route}: container directive inventory drift (expected ${englishDirectives.length}, found ${localizedDirectives.length})`,
        )
      } else {
        for (let index = 0; index < englishDirectives.length; index += 1) {
          const expectedKeyword = englishDirectives[index].keyword
          const actualKeyword = localizedDirectives[index].keyword
          if (actualKeyword !== expectedKeyword) {
            errors.push(
              `${locale.path}/${route}: container directive ${index + 1} must preserve keyword ${expectedKeyword ?? '(closing)'}`,
            )
          }
        }
      }
      const englishFootnotes = footnoteMarkerCounts(englishBody)
      const localizedFootnotes = footnoteMarkerCounts(localizedBody)
      for (const [marker, expectedCount] of englishFootnotes) {
        const actualCount = localizedFootnotes.get(marker) ?? 0
        if (actualCount !== expectedCount) {
          errors.push(
            `${locale.path}/${route}: footnote marker count drift for ${marker} (expected ${expectedCount}, found ${actualCount})`,
          )
        }
      }
      for (const marker of localizedFootnotes.keys()) {
        if (!englishFootnotes.has(marker)) {
          errors.push(`${locale.path}/${route}: unexpected footnote marker ${marker}`)
        }
      }
      const localizedInlineCode = inlineCodeSpanCounts(localizedBody)
      for (const [span, expectedCount] of inlineCodeSpanCounts(englishBody)) {
        const actualCount = localizedInlineCode.get(span) ?? 0
        if (actualCount < expectedCount) {
          errors.push(
            `${locale.path}/${route}: inline code count drift for ${span} (expected ${expectedCount}, found ${actualCount})`,
          )
        }
      }
      const englishLinks = markdownLinkDestinations(englishBody)
      const localizedLinks = markdownLinkDestinations(localizedBody).map((destination) =>
        sourceEquivalentLink(destination, locale),
      )
      if (localizedLinks.length !== englishLinks.length) {
        errors.push(
          `${locale.path}/${route}: Markdown link inventory drift (expected ${englishLinks.length}, found ${localizedLinks.length})`,
        )
      } else if (!mapsEqual(valueCounts(englishLinks), valueCounts(localizedLinks))) {
        const englishLinkCounts = valueCounts(englishLinks)
        const localizedLinkCounts = valueCounts(localizedLinks)
        const mismatchedDestination = [...new Set([...englishLinks, ...localizedLinks])].find(
          (destination) => englishLinkCounts.get(destination) !== localizedLinkCounts.get(destination),
        )
        errors.push(
          `${locale.path}/${route}: Markdown link destination inventory drift for ${mismatchedDestination} (expected ${englishLinkCounts.get(mismatchedDestination!) ?? 0}, found ${localizedLinkCounts.get(mismatchedDestination!) ?? 0})`,
        )
      } else {
        const englishMarkdownLinks = markdownLinks(englishBody)
        const remainingLocalizedMarkdownLinks = markdownLinks(localizedBody).map((link) => ({
          ...link,
          destination: sourceEquivalentLink(link.destination, locale),
        }))
        const sourceEmptyLabels = valueCounts(
          englishMarkdownLinks.filter((link) => !link.label).map((link) => link.destination),
        )
        const localizedEmptyLabels = new Map<string, number>()
        for (const [index, localizedLink] of remainingLocalizedMarkdownLinks.entries()) {
          if (localizedLink.label) continue
          const observed = (localizedEmptyLabels.get(localizedLink.destination) ?? 0) + 1
          localizedEmptyLabels.set(localizedLink.destination, observed)
          if (observed > (sourceEmptyLabels.get(localizedLink.destination) ?? 0)) {
            errors.push(`${locale.path}/${route}: link ${index + 1} has an empty label`)
          }
        }
        for (let index = 0; index < englishMarkdownLinks.length; index += 1) {
          const englishLink = englishMarkdownLinks[index]
          const matchingIndexes = remainingLocalizedMarkdownLinks
            .map((link, candidateIndex) => ({ candidateIndex, link }))
            .filter(({ link }) => link.destination === englishLink.destination)
            .map(({ candidateIndex }) => candidateIndex)
          const localizedIndex = isPreservedTechnicalLinkLabel(englishLink.label)
            ? (matchingIndexes.find(
                (candidateIndex) => remainingLocalizedMarkdownLinks[candidateIndex].label === englishLink.label,
              ) ?? matchingIndexes[0])
            : (matchingIndexes.find(
                (candidateIndex) => remainingLocalizedMarkdownLinks[candidateIndex].label !== englishLink.label,
              ) ?? matchingIndexes[0])
          if (localizedIndex === undefined) continue
          const [localizedLink] = remainingLocalizedMarkdownLinks.splice(localizedIndex, 1)
          if (
            isPreservedTechnicalLinkLabel(englishLink.label) &&
            localizedLink.label !== englishLink.label
          ) {
            errors.push(
              `${locale.path}/${route}: link ${index + 1} must preserve technical label ${englishLink.label}`,
            )
          } else if (HUMAN_READABLE_LINK_LABELS.has(englishLink.label) && localizedLink.label === englishLink.label) {
            errors.push(`${locale.path}/${route}: link ${index + 1} has untranslated label ${englishLink.label}`)
          }
        }
      }
      if (contentWithoutTranslationMetadata(localizedContent) === contentWithoutTranslationMetadata(englishContent)) {
        errors.push(`${locale.path}/${route}: translated content is an English fallback`)
      }
      const localizedIdentifiers = technicalIdentifiers(localizedContent)
      for (const [identifier, expectedCount] of technicalIdentifiers(englishContent)) {
        const actualCount = localizedIdentifiers.get(identifier) ?? 0
        if (actualCount < expectedCount) {
          errors.push(
            `${locale.path}/${route}: technical identifier count drift for ${identifier} (expected ${expectedCount}, found ${actualCount})`,
          )
        }
      }
      const repeated = runawayRepeatedText(localizedContent)
      if (repeated) {
        errors.push(`${locale.path}/${route}: runaway repeated translation text: ${repeated}`)
      }
      errors.push(...proseCompletenessErrors(englishBody, localizedBody, locale, route))
    }
  }

  return errors
}

async function main() {
  const errors = await validateI18n()
  if (errors.length === 0) {
    console.log(`I18n validation passed for ${TRANSLATED_LOCALES.length} locales.`)
    return
  }

  console.error(`I18n validation failed with ${errors.length} error(s):`)
  for (const error of errors.slice(0, 100)) console.error(`- ${error}`)
  if (errors.length > 100) console.error(`- …and ${errors.length - 100} more`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
