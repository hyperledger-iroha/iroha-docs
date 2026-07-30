import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createInterface, type Interface as ReadlineInterface } from 'node:readline'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { TRANSLATED_LOCALES, type DocsLocale } from './locales'

const TRANSLATE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single'
const GOOGLE_TRANSLATION_ENGINE = 'google-translate'
const NLLB_TRANSLATION_ENGINE = 'nllb-200-ct2'
const TRANSLATION_STATUS = 'machine-validated'
const MAX_REQUEST_CHARACTERS = 3_500
const MAX_ATTEMPTS = 6

const GOOGLE_LANGUAGE_CODES: Readonly<Record<string, string>> = {
  'zh-hans': 'zh-CN',
  'zh-hant': 'zh-TW',
}

export const NLLB_LANGUAGE_CODES: Readonly<Record<string, string>> = {
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
}

interface FrontmatterDocument {
  frontmatter: string | null
  body: string
}

interface ProtectedMarkdown {
  masked: string
  restore(translated: string): string
}

export interface TranslationProvider {
  readonly engine?: string
  readonly protectedMarkdownMode?: 'inline' | 'fragments'
  languageCode?(locale: DocsLocale): string
  translate(text: string, targetLanguage: string): Promise<string>
  translateBatch?(texts: readonly string[], targetLanguage: string): Promise<string[]>
  close?(): Promise<void>
}

interface GenerateOptions {
  sourceRoot?: string
  locales?: readonly DocsLocale[]
  concurrency?: number
  provider?: TranslationProvider
}

interface NllbProviderOptions {
  python?: string
  model: string
}

interface PendingNllbRequest {
  resolve(translations: string[]): void
  reject(error: Error): void
}

interface NllbResponse {
  id?: unknown
  translations?: unknown
  error?: unknown
}

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

function splitFrontmatter(content: string): FrontmatterDocument {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(content)
  if (!match) return { frontmatter: null, body: content }
  return {
    frontmatter: match[1],
    body: content.slice(match[0].length),
  }
}

async function markdownFiles(directory: string, relative = ''): Promise<string[]> {
  const absolute = path.join(directory, relative)
  const entries = await readdir(absolute, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const child = path.posix.join(relative.split(path.sep).join('/'), entry.name)
      if (entry.isDirectory()) return markdownFiles(directory, child)
      return entry.isFile() && entry.name.endsWith('.md') ? [child] : []
    }),
  )
  return files.flat().sort()
}

function localizeRoute(route: string, locale: DocsLocale): string {
  if (
    !route.startsWith('/') ||
    route.startsWith('//') ||
    route.startsWith(`/${locale.path}/`) ||
    /\.[a-z0-9]{2,8}(?:[?#].*)?$/iu.test(route)
  ) {
    return route
  }
  return `/${locale.path}${route}`
}

function localizeLinkSuffix(suffix: string, locale: DocsLocale): string {
  return suffix.replace(
    /^(\]\(\s*)([^)\s]+)([\s\S]*)$/u,
    (_match, prefix: string, target: string, rest: string) => `${prefix}${localizeRoute(target, locale)}${rest}`,
  )
}

function localizeHtmlTag(tag: string, locale: DocsLocale): string {
  return tag.replace(
    /(\bhref\s*=\s*["'])(\/(?!\/)[^"']*)(["'])/giu,
    (_match, prefix: string, target: string, suffix: string) => `${prefix}${localizeRoute(target, locale)}${suffix}`,
  )
}

/**
 * Replace code, identifiers, URLs, and Markdown delimiters with translation-safe
 * symbolic numeric markers. The bracketed markers remain stable for every
 * published locale, including languages that transliterate unknown Latin
 * tokens.
 */
export function protectMarkdown(source: string, locale: DocsLocale): ProtectedMarkdown {
  const values = new Map<string, string>()
  let sequence = 0
  const protect = (value: string): string => {
    const token = `⟦${sequence}⟧`
    sequence += 1
    values.set(token, value)
    return token
  }

  let masked = source.replace(/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*(?:\n|$)/gmu, (block) =>
    protect(block),
  )
  masked = masked.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/giu, (block) => protect(block))
  masked = masked.replace(/\$\$[\s\S]*?\$\$/gu, (formula) => protect(formula))
  masked = masked.replace(/\\\[[\s\S]*?\\\]/gu, (formula) => protect(formula))
  masked = masked.replace(/\\\([^)\n]*\\\)/gu, (formula) => protect(formula))
  masked = masked.replace(/(?<!\\)\$(?!\s)(?:\\.|[^$\n])+(?<!\s)\$/gu, (formula) => protect(formula))
  masked = masked.replace(/^ {0,3}(?:<{3}|={3})\s+.*$/gmu, (line) => protect(line))
  masked = masked.replace(/^ {0,3}(?:[-*_]\s*){3,}$/gmu, (line) => protect(line))
  masked = masked.replace(/^(\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*)$/gmu, (line) => protect(line))
  masked = masked.replace(/^(\s*\[[^\]\n]+\]:\s+\S+.*)$/gmu, (line) => protect(line))
  masked = masked.replace(/(`+)([\s\S]*?)\1/gu, (code) => protect(code))
  masked = masked.replace(
    /(!?\[)([^\]\n]+)(\]\((?:\\.|[^)\n])+\))/gu,
    (_match, opening: string, label: string, suffix: string) =>
      `${protect(opening)}${label}${protect(localizeLinkSuffix(suffix, locale))}`,
  )
  masked = masked.replace(
    /(\[)([^\]\n]+)(\]\[[^\]\n]*\])/gu,
    (_match, opening: string, label: string, suffix: string) => `${protect(opening)}${label}${protect(suffix)}`,
  )
  masked = masked.replace(/<[^>\n]+>/gu, (tag) => protect(localizeHtmlTag(tag, locale)))
  masked = masked.replace(/\bhttps?:\/\/[^\s<>)\]]+/giu, (url) => protect(url))
  masked = masked.replace(/\{#[A-Za-z][\w:.-]*\}/gu, (anchor) => protect(anchor))
  masked = masked.replace(/&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]+);/giu, (entity) => protect(entity))
  masked = masked.replace(
    /\b(?:AccountId|DA\/RBC|Hyperledger|Iroha|IVM|Kotodama|Norito|SORA|Sumeragi|Torii)\b/gu,
    (term) => protect(term),
  )
  masked = masked.replace(/[*_~]{1,3}/gu, (delimiter) => protect(delimiter))
  masked = masked.replace(/\|/gu, (delimiter) => protect(delimiter))
  masked = masked.replace(/^(\s*(?:#{1,6}|>|[-+*]|\d+[.)]|:::\s*[A-Za-z-]*)\s+)/gmu, (prefix) => protect(prefix))
  masked = masked.replace(/\n/gu, (newline) => protect(newline))

  for (const token of values.keys()) {
    masked = masked.replaceAll(token, `<span class="notranslate">${token}</span>`)
  }

  return {
    masked,
    restore(translated: string): string {
      let restored = translated
      for (const [token, value] of values) {
        const wrapped = new RegExp(`<span\\b[^>]*>\\s*${token}\\s*</span>`, 'gu')
        restored = restored.replace(wrapped, token)
        const occurrences = restored.split(token).length - 1
        if (occurrences !== 1) {
          throw new Error(`Translation changed protected marker ${token} (${occurrences} occurrences)`)
        }
        restored = restored.replace(token, value)
      }
      return restored
    },
  }
}

export function chunkForTranslation(content: string): string[] {
  const chunks: string[] = []
  let remaining = content
  while (remaining.length > MAX_REQUEST_CHARACTERS) {
    let cut = MAX_REQUEST_CHARACTERS
    const candidates = [
      remaining.lastIndexOf('\n\n', cut),
      remaining.lastIndexOf('\n', cut),
      remaining.lastIndexOf('. ', cut),
      remaining.lastIndexOf(' ', cut),
    ]
    const boundary = candidates.find((candidate) => candidate >= MAX_REQUEST_CHARACTERS / 2)
    if (boundary !== undefined) cut = boundary + (remaining.startsWith('\n\n', boundary) ? 2 : 1)

    const openSpan = remaining.lastIndexOf('<span', cut)
    const closeSpan = remaining.lastIndexOf('</span>', cut)
    if (openSpan > closeSpan) cut = openSpan
    if (cut <= 0) throw new Error('Unable to split translation input safely')

    chunks.push(remaining.slice(0, cut))
    remaining = remaining.slice(cut)
  }
  if (remaining) chunks.push(remaining)
  return chunks
}

function providerLanguageCode(provider: TranslationProvider, locale: DocsLocale): string {
  return provider.languageCode?.(locale) ?? GOOGLE_LANGUAGE_CODES[locale.key] ?? locale.key
}

async function translateBatch(
  provider: TranslationProvider,
  texts: readonly string[],
  targetLanguage: string,
): Promise<string[]> {
  if (texts.length === 0) return []
  if (provider.translateBatch) return provider.translateBatch(texts, targetLanguage)
  return Promise.all(texts.map((text) => provider.translate(text, targetLanguage)))
}

interface FragmentPlan {
  pieceIndex: number
  prefix: string
  suffix: string
  firstUnit: number
  unitCount: number
}

/**
 * Translate only the natural-language text between protected markers.
 *
 * NLLB tokenization can omit or duplicate unknown placeholder tokens. Keeping
 * the generated marker spans out of the model input makes reconstruction
 * deterministic even when the model has no representation for those markers.
 */
export async function translateProtectedFragments(
  protectedMarkdown: ProtectedMarkdown,
  targetLanguage: string,
  provider: TranslationProvider,
): Promise<string> {
  const markerPattern = /(<span class="notranslate">⟦\d+⟧<\/span>)/gu
  const exactMarkerPattern = /^<span class="notranslate">⟦\d+⟧<\/span>$/u
  const pieces = protectedMarkdown.masked.split(markerPattern)
  const plans: FragmentPlan[] = []
  const units: string[] = []

  for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex += 1) {
    const piece = pieces[pieceIndex]
    if (!piece || exactMarkerPattern.test(piece)) continue

    const whitespace = /^(\s*)([\s\S]*?)(\s*)$/u.exec(piece)
    if (!whitespace || !whitespace[2]) continue
    const chunks = chunkForTranslation(whitespace[2])
    plans.push({
      pieceIndex,
      prefix: whitespace[1],
      suffix: whitespace[3],
      firstUnit: units.length,
      unitCount: chunks.length,
    })
    units.push(...chunks)
  }

  const translations = await translateBatch(provider, units, targetLanguage)
  if (translations.length !== units.length || translations.some((translation) => typeof translation !== 'string')) {
    throw new Error(`Translation provider returned ${translations.length} results for ${units.length} fragments`)
  }

  for (const plan of plans) {
    pieces[plan.pieceIndex] =
      plan.prefix + translations.slice(plan.firstUnit, plan.firstUnit + plan.unitCount).join('') + plan.suffix
  }
  return protectedMarkdown.restore(pieces.join(''))
}

function decodeTranslatedHtml(content: string): string {
  return content
    .replace(/&#(\d+);/gu, (_match, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&#x([0-9a-f]+);/giu, (_match, hexadecimal: string) =>
      String.fromCodePoint(Number.parseInt(hexadecimal, 16)),
    )
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export class GoogleTranslationProvider implements TranslationProvider {
  readonly engine = GOOGLE_TRANSLATION_ENGINE
  readonly protectedMarkdownMode = 'inline' as const

  languageCode(locale: DocsLocale): string {
    return GOOGLE_LANGUAGE_CODES[locale.key] ?? locale.key
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    let lastError: unknown
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      try {
        const body = new URLSearchParams({
          client: 'gtx',
          sl: 'en',
          tl: targetLanguage,
          dt: 't',
          format: 'html',
          q: text,
        })
        const response = await fetch(TRANSLATE_ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body,
        })
        if (!response.ok) throw new Error(`translation service returned HTTP ${response.status}`)
        const payload = (await response.json()) as [[Array<[string]>]]
        const translated = payload[0]?.map((part) => part[0] ?? '').join('')
        if (typeof translated !== 'string') throw new Error('translation service returned an invalid payload')
        return decodeTranslatedHtml(translated)
      } catch (error) {
        lastError = error
        if (attempt + 1 < MAX_ATTEMPTS) await delay(Math.min(30_000, 750 * 2 ** attempt))
      }
    }
    throw new Error(`Translation failed after ${MAX_ATTEMPTS} attempts`, { cause: lastError })
  }
}

export class NllbTranslationProvider implements TranslationProvider {
  readonly engine = NLLB_TRANSLATION_ENGINE
  readonly protectedMarkdownMode = 'fragments' as const

  private readonly python: string
  private readonly model: string
  private child: ChildProcessWithoutNullStreams | null = null
  private reader: ReadlineInterface | null = null
  private requestSequence = 0
  private readonly pending = new Map<number, PendingNllbRequest>()
  private stderrTail = ''
  private closed = false

  constructor(options: NllbProviderOptions) {
    if (!options.model.trim()) throw new Error('The NLLB provider requires a CTranslate2 model path')
    this.python = options.python?.trim() || 'python3'
    this.model = options.model
  }

  languageCode(locale: DocsLocale): string {
    const language = NLLB_LANGUAGE_CODES[locale.key]
    if (!language) throw new Error(`No NLLB language code is configured for locale ${locale.key}`)
    return language
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    const [translation] = await this.translateBatch([text], targetLanguage)
    return translation
  }

  async translateBatch(texts: readonly string[], targetLanguage: string): Promise<string[]> {
    if (texts.length === 0) return []
    if (!Object.values(NLLB_LANGUAGE_CODES).includes(targetLanguage)) {
      throw new Error(`Unsupported NLLB target language: ${targetLanguage}`)
    }
    const child = this.start()
    const id = this.requestSequence
    this.requestSequence += 1

    return new Promise<string[]>((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      const request = `${JSON.stringify({ id, target_language: targetLanguage, texts })}\n`
      try {
        child.stdin.write(request, (error) => {
          if (!error) return
          this.pending.delete(id)
          reject(new Error(`Unable to send request to the NLLB translator: ${error.message}`, { cause: error }))
        })
      } catch (error) {
        this.pending.delete(id)
        reject(
          new Error(
            `Unable to send request to the NLLB translator: ${error instanceof Error ? error.message : error}`,
            {
              cause: error,
            },
          ),
        )
      }
    })
  }

  async close(): Promise<void> {
    this.closed = true
    const child = this.child
    if (!child) return
    const exited = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve) => {
      child.once('exit', (code, signal) => resolve({ code, signal }))
    })
    child.stdin.end()
    const { code, signal } = await exited
    this.child = null
    this.reader?.close()
    this.reader = null
    if (code !== 0) {
      throw new Error(
        `NLLB translator exited with ${signal ? `signal ${signal}` : `code ${code ?? 'unknown'}`}${this.stderrContext()}`,
      )
    }
  }

  private start(): ChildProcessWithoutNullStreams {
    if (this.closed) throw new Error('NLLB translation provider is closed')
    if (this.child) return this.child

    const helper = path.join(path.dirname(fileURLToPath(import.meta.url)), 'nllb_translate.py')
    const child = spawn(this.python, [helper, '--model', this.model], {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    this.child = child
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    this.reader = createInterface({ input: child.stdout })
    this.reader.on('line', (line) => this.handleResponse(line))
    child.stderr.on('data', (chunk: string) => {
      this.stderrTail = `${this.stderrTail}${chunk}`.slice(-8_192)
    })
    child.once('error', (error) => {
      this.failPending(new Error(`Unable to start the NLLB translator: ${error.message}`, { cause: error }))
      if (this.child === child) this.child = null
    })
    child.once('exit', (code, signal) => {
      if (this.child === child) this.child = null
      this.reader?.close()
      this.reader = null
      if (this.pending.size > 0) {
        this.failPending(
          new Error(
            `NLLB translator exited with ${signal ? `signal ${signal}` : `code ${code ?? 'unknown'}`}${this.stderrContext()}`,
          ),
        )
      }
    })
    return child
  }

  private handleResponse(line: string): void {
    let response: NllbResponse
    try {
      response = JSON.parse(line) as NllbResponse
    } catch (error) {
      this.failPending(new Error('NLLB translator returned malformed JSON', { cause: error }))
      return
    }
    if (typeof response.id !== 'number' || !Number.isInteger(response.id)) {
      this.failPending(new Error('NLLB translator returned a response without a valid request id'))
      return
    }
    const request = this.pending.get(response.id)
    if (!request) return
    this.pending.delete(response.id)
    if (typeof response.error === 'string') {
      request.reject(new Error(`NLLB translation failed: ${response.error}`))
      return
    }
    if (!Array.isArray(response.translations) || !response.translations.every((item) => typeof item === 'string')) {
      request.reject(new Error('NLLB translator returned an invalid translations payload'))
      return
    }
    request.resolve(response.translations)
  }

  private failPending(error: Error): void {
    for (const request of this.pending.values()) request.reject(error)
    this.pending.clear()
  }

  private stderrContext(): string {
    const detail = this.stderrTail.trim()
    return detail ? `: ${detail}` : ''
  }
}

async function translateMarkdown(source: string, locale: DocsLocale, provider: TranslationProvider): Promise<string> {
  if (!source.trim()) return source
  const protectedMarkdown = protectMarkdown(source, locale)
  const targetLanguage = providerLanguageCode(provider, locale)
  if (provider.protectedMarkdownMode === 'fragments') {
    return translateProtectedFragments(protectedMarkdown, targetLanguage, provider)
  }
  const translatedChunks: string[] = []
  for (const chunk of chunkForTranslation(protectedMarkdown.masked)) {
    translatedChunks.push(await provider.translate(chunk, targetLanguage))
  }
  return protectedMarkdown.restore(translatedChunks.join(''))
}

async function translateHomeFrontmatter(
  frontmatter: string,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const lines = frontmatter.split(/\r?\n/u)
  const output: string[] = []
  const translatableKeys = new Set(['alt', 'details', 'tagline', 'text', 'title'])

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const field = /^(\s*(?:-\s*)?)([a-z][a-z0-9_-]*):(?:\s*(.*))?$/iu.exec(line)
    if (!field) {
      output.push(line)
      continue
    }

    const [, indentation, key, inlineValue = ''] = field
    if (key === 'link') {
      output.push(`${indentation}${key}: ${localizeRoute(inlineValue.trim(), locale)}`)
      continue
    }
    if (!translatableKeys.has(key)) {
      output.push(line)
      continue
    }

    const continuation: string[] = []
    const fieldIndent = indentation.length
    while (index + 1 < lines.length) {
      const next = lines[index + 1]
      const nextIndent = /^\s*/u.exec(next)?.[0].length ?? 0
      if (!next.trim() || nextIndent <= fieldIndent) break
      continuation.push(next.trim())
      index += 1
    }
    const value = [inlineValue.trim(), ...continuation].filter(Boolean).join(' ')
    if (!value) {
      output.push(line)
      continue
    }
    const translated = await translateMarkdown(value, locale, provider)
    output.push(`${indentation}${key}: ${JSON.stringify(translated.trim())}`)
  }
  return output.join('\n')
}

export async function translateDocument(
  english: string,
  route: string,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const { frontmatter, body } = splitFrontmatter(english)
  const localizedFrontmatter =
    frontmatter === null
      ? null
      : route === 'index.md'
        ? await translateHomeFrontmatter(frontmatter, locale, provider)
        : frontmatter
  const translatedBody = await translateMarkdown(body, locale, provider)
  const metadata = [
    `translation_locale: ${locale.key}`,
    `translation_source: /${route}`,
    `translation_source_hash: ${sha256(english)}`,
    `translation_status: ${TRANSLATION_STATUS}`,
    `translation_engine: ${provider.engine ?? GOOGLE_TRANSLATION_ENGINE}`,
  ]
  if (localizedFrontmatter !== null) metadata.push('', localizedFrontmatter)
  const bodySeparator = translatedBody.startsWith('\n') || !translatedBody ? '' : '\n'
  return `---\n${metadata.join('\n')}\n---\n${bodySeparator}${translatedBody}`
}

async function parallelMap<T>(
  values: readonly T[],
  concurrency: number,
  operation: (value: T, index: number) => Promise<void>,
): Promise<void> {
  let cursor = 0
  const workers = Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor
      cursor += 1
      await operation(values[index], index)
    }
  })
  await Promise.all(workers)
}

export async function generateTranslations(options: GenerateOptions = {}): Promise<void> {
  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const concurrency = options.concurrency ?? 4
  const provider = options.provider ?? new GoogleTranslationProvider()
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) {
    throw new Error('Translation concurrency must be an integer from 1 through 16')
  }

  const localePaths = new Set(TRANSLATED_LOCALES.map((locale) => locale.path))
  const routes = (await markdownFiles(sourceRoot)).filter((route) => {
    const first = route.split('/')[0]
    return first !== 'snippets' && !localePaths.has(first)
  })
  const sources = new Map<string, string>()
  await Promise.all(
    routes.map(async (route) => {
      sources.set(route, await readFile(path.join(sourceRoot, route), 'utf8'))
    }),
  )

  for (const locale of locales) {
    const localeRoot = path.join(sourceRoot, locale.path)
    await rm(localeRoot, { recursive: true, force: true })
    console.log(`Translating ${routes.length} pages to ${locale.label} (${locale.key})…`)
    await parallelMap(routes, concurrency, async (route, index) => {
      const target = path.join(localeRoot, route)
      let translated
      try {
        translated = await translateDocument(sources.get(route)!, route, locale, provider)
      } catch (error) {
        throw new Error(`${locale.key}/${route}: ${error instanceof Error ? error.message : String(error)}`, {
          cause: error,
        })
      }
      await mkdir(path.dirname(target), { recursive: true })
      await writeFile(target, translated)
      if ((index + 1) % 10 === 0 || index + 1 === routes.length) {
        console.log(`[${locale.key}] ${index + 1}/${routes.length}`)
      }
    })
  }
}

interface TranslationCliOptions {
  locales: readonly DocsLocale[]
  concurrency: number
  providerName: 'google' | 'nllb'
  python?: string
  model?: string
}

function parseCli(argv: string[]): TranslationCliOptions {
  let selectedKeys: string[] = []
  let concurrency = 4
  let providerName: 'google' | 'nllb' = 'google'
  let python: string | undefined
  let model: string | undefined
  for (const argument of argv) {
    if (argument.startsWith('--locale=')) {
      selectedKeys = argument
        .slice('--locale='.length)
        .split(',')
        .map((key) => key.trim())
        .filter(Boolean)
    } else if (argument.startsWith('--concurrency=')) {
      concurrency = Number(argument.slice('--concurrency='.length))
    } else if (argument.startsWith('--provider=')) {
      const requestedProvider = argument.slice('--provider='.length)
      if (requestedProvider !== 'google' && requestedProvider !== 'nllb') {
        throw new Error(`Unknown translation provider: ${requestedProvider}`)
      }
      providerName = requestedProvider
    } else if (argument.startsWith('--python=')) {
      python = argument.slice('--python='.length)
      if (!python) throw new Error('--python requires an executable path')
    } else if (argument.startsWith('--model=')) {
      model = argument.slice('--model='.length)
      if (!model) throw new Error('--model requires a CTranslate2 model path')
    } else {
      throw new Error(`Unknown translation option: ${argument}`)
    }
  }
  const locales = selectedKeys.length
    ? selectedKeys.map((key) => {
        const locale = TRANSLATED_LOCALES.find((candidate) => candidate.key === key)
        if (!locale) throw new Error(`Unknown locale: ${key}`)
        return locale
      })
    : TRANSLATED_LOCALES
  if (providerName === 'nllb' && !model) {
    throw new Error('--provider=nllb requires --model=<CTranslate2 model path>')
  }
  if (providerName === 'google' && (python || model)) {
    throw new Error('--python and --model are only valid with --provider=nllb')
  }
  return { locales, concurrency, providerName, python, model }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { locales, concurrency, providerName, python, model } = parseCli(process.argv.slice(2))
  const provider: TranslationProvider =
    providerName === 'nllb' ? new NllbTranslationProvider({ python, model: model! }) : new GoogleTranslationProvider()
  ;(async () => {
    try {
      await generateTranslations({ locales, concurrency, provider })
    } finally {
      await provider.close?.()
    }
  })().catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
}
