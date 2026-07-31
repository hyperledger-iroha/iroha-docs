import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFile, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createInterface, type Interface as ReadlineInterface } from 'node:readline'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { slugify } from '@mdit-vue/shared'
import MarkdownIt from 'markdown-it'
import { TRANSLATED_LOCALES, type DocsLocale } from './locales'

const TRANSLATE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single'
const GOOGLE_TRANSLATION_ENGINE = 'google-translate'
const NLLB_TRANSLATION_ENGINE = 'nllb-200-ct2'
const TRANSLATION_STATUS = 'machine-validated'
const MAX_REQUEST_CHARACTERS = 3_500
const MAX_ATTEMPTS = 6

const TECHNICAL_TERM_PATTERN =
  /\b(?:CTranslate2|Docker Compose|Hyperledger Iroha|Iroha 3|LF Decentralized Trust|NLLB-200|Node\.js|SORA Nexus|Android|Docker|Hyperledger|Iroha|Kagami|Kaigi|KeePassXC|Kotodama|Kotlin|Kura|Minamoto|Musubi|Nexus|Norito|pnpm|Python|Rust|rustup|SoraDNS|SoraFS|SoraNet|Soracloud|Sumeragi|Swift|Taira|Torii|VitePress|cargo|curl|git|jq|npm|rustc|systemd|yarn)\b/gu
const CAMEL_CASE_IDENTIFIER_PATTERN = /\b[A-Z][a-z]+(?:[A-Z][A-Za-z0-9]*)+\b/gu
const UPPERCASE_IDENTIFIER_PATTERN = /\b[A-Z][A-Z0-9]+(?:[-/][A-Z0-9]+(?=$|[^\p{L}\p{N}_]))*(?:s)?\b/gu
const DOMAIN_NAME_PATTERN = /\b(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}\b/giu

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

export const TRANSLATION_MINIMUM_RATIO: Readonly<Record<string, number>> = {
  am: 0.35,
  ar: 0.4,
  az: 0.5,
  ba: 0.5,
  dz: 0.5,
  es: 0.5,
  fr: 0.5,
  he: 0.35,
  hy: 0.5,
  ja: 0.25,
  ka: 0.5,
  kk: 0.5,
  mn: 0.5,
  my: 0.5,
  pt: 0.5,
  ru: 0.5,
  ur: 0.5,
  uz: 0.5,
  'zh-hans': 0.25,
  'zh-hant': 0.25,
}

export const SENTENCE_COVERAGE_MINIMUM_RATIO: Readonly<Record<string, number>> = {
  am: 0.49,
  ar: 0.62,
  az: 0.76,
  ba: 0.75,
  dz: 0.78,
  es: 0.82,
  fr: 0.83,
  he: 0.57,
  hy: 0.83,
  ja: 0.42,
  ka: 0.75,
  kk: 0.78,
  mn: 0.79,
  my: 0.87,
  pt: 0.77,
  ru: 0.79,
  ur: 0.67,
  uz: 0.83,
  'zh-hans': 0.25,
  'zh-hant': 0.25,
}

const sentenceSegmenters = new Map<string, Intl.Segmenter>()

export function translationMinimumRatio(localeKey: string): number {
  return TRANSLATION_MINIMUM_RATIO[localeKey] ?? 0.5
}

export function sentenceCoverageMinimumRatio(localeKey: string): number {
  return SENTENCE_COVERAGE_MINIMUM_RATIO[localeKey] ?? 0.7
}

export function sentenceCount(content: string, language: string): number {
  let segmenter = sentenceSegmenters.get(language)
  if (!segmenter) {
    segmenter = new Intl.Segmenter(language, { granularity: 'sentence' })
    sentenceSegmenters.set(language, segmenter)
  }
  return [...segmenter.segment(content)].filter(({ segment }) => /\p{L}/u.test(segment)).length
}

interface FrontmatterDocument {
  frontmatter: string | null
  body: string
}

interface ProtectedMarkdown {
  masked: string
  valueForMarker(marker: string): string | undefined
  restore(translated: string): string
}

type ProtectedMarkerStyle = 'html' | 'identifier'

export interface TranslationProvider {
  readonly engine?: string
  readonly protectedMarkdownMode?: 'inline' | 'inline-identifiers' | 'fragments'
  languageCode?(locale: DocsLocale): string
  translate(text: string, targetLanguage: string): Promise<string>
  translateBatch?(texts: readonly string[], targetLanguage: string): Promise<string[]>
  close?(): Promise<void>
}

interface GenerateOptions {
  sourceRoot?: string
  locales?: readonly DocsLocale[]
  routes?: readonly string[]
  concurrency?: number
  provider?: TranslationProvider
}

interface SynchronizeHeadingAnchorOptions {
  sourceRoot?: string
  locales?: readonly DocsLocale[]
  routes?: readonly string[]
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

/** Return exact technical tokens whose spelling translations must preserve. */
export function technicalIdentifiers(source: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const pattern of [
    TECHNICAL_TERM_PATTERN,
    CAMEL_CASE_IDENTIFIER_PATTERN,
    UPPERCASE_IDENTIFIER_PATTERN,
    DOMAIN_NAME_PATTERN,
  ]) {
    for (const match of source.matchAll(pattern)) {
      counts.set(match[0], (counts.get(match[0]) ?? 0) + 1)
    }
  }
  const irohaVersionMatches = source.match(/\bIroha 3\b/gu) ?? []
  if (irohaVersionMatches.length > 0) {
    counts.set('Iroha', (counts.get('Iroha') ?? 0) + irohaVersionMatches.length)
  }
  const nexusMatches = source.match(/\bNexus\b/gu) ?? []
  if (nexusMatches.length > 0) counts.set('Nexus', nexusMatches.length)
  return counts
}

function splitFrontmatter(content: string): FrontmatterDocument {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(content)
  if (!match) return { frontmatter: null, body: content }
  return {
    frontmatter: match[1],
    body: content.slice(match[0].length),
  }
}

interface MarkdownHeading {
  explicitAnchor?: string
  lineIndex: number
  stableAnchor: string
}

const HEADING_MARKDOWN = new MarkdownIt({ html: true })
const EXPLICIT_HEADING_ANCHOR = /\s+\{#([A-Za-z_][\w:.-]*)\}\s*$/u

function headingText(markdown: string): string {
  const inline = HEADING_MARKDOWN.parseInline(markdown, {})[0]
  return (inline?.children ?? [])
    .filter((token) => token.type === 'text' || token.type === 'code_inline')
    .map((token) => token.content)
    .join('')
}

/** Return stable VitePress heading IDs derived from the English source. */
export function markdownHeadings(source: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = []
  const usedAnchors = new Set<string>()
  const lines = source.split(/\r?\n/u)
  let fence: { character: string; length: number } | undefined

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex]
    const fenceMarker = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line)
    if (fence) {
      if (
        fenceMarker &&
        fenceMarker[1][0] === fence.character &&
        fenceMarker[1].length >= fence.length &&
        fenceMarker[2].trim() === ''
      ) {
        fence = undefined
      }
      continue
    }
    if (fenceMarker) {
      fence = { character: fenceMarker[1][0], length: fenceMarker[1].length }
      continue
    }

    const heading = /^( {0,3}#{1,6})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/u.exec(line)
    if (!heading) continue
    const explicitAnchor = EXPLICIT_HEADING_ANCHOR.exec(heading[2])?.[1]
    const baseAnchor = explicitAnchor ?? slugify(headingText(heading[2].replace(EXPLICIT_HEADING_ANCHOR, '')))
    let stableAnchor = baseAnchor
    let duplicateIndex = 1
    while (usedAnchors.has(stableAnchor)) {
      stableAnchor = `${baseAnchor}-${duplicateIndex}`
      duplicateIndex += 1
    }
    usedAnchors.add(stableAnchor)
    headings.push({ explicitAnchor, lineIndex, stableAnchor })
  }

  return headings
}

/** Add stable English-derived IDs to every Markdown heading in a document body. */
export function addStableHeadingAnchors(source: string): string {
  const lines = source.split(/\r?\n/u)
  for (const heading of markdownHeadings(source)) {
    if (heading.explicitAnchor) continue
    lines[heading.lineIndex] = `${lines[heading.lineIndex]} {#${heading.stableAnchor}}`
  }
  return lines.join('\n')
}

function stripTrailingWhitespaceOutsideFences(source: string): string {
  const lines = source.split('\n')
  let fence: { character: string; length: number } | undefined

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const fenceMarker = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line)
    if (fence) {
      if (
        fenceMarker &&
        fenceMarker[1][0] === fence.character &&
        fenceMarker[1].length >= fence.length &&
        fenceMarker[2].trim() === ''
      ) {
        fence = undefined
        lines[index] = line.replace(/[ \t]+$/u, '')
      }
      continue
    }

    const normalized = line.replace(/[ \t]+$/u, '')
    lines[index] = normalized
    const openingFence = /^ {0,3}(`{3,}|~{3,})/u.exec(normalized)
    if (openingFence) {
      fence = { character: openingFence[1][0], length: openingFence[1].length }
    }
  }

  return lines.join('\n')
}

function applyStableHeadingAnchors(source: string, stableAnchors: readonly string[]): string {
  const lines = source.split(/\r?\n/u)
  const localizedHeadings = markdownHeadings(source)
  if (localizedHeadings.length !== stableAnchors.length) {
    throw new Error(`heading inventory drift (expected ${stableAnchors.length}, found ${localizedHeadings.length})`)
  }
  for (let index = 0; index < localizedHeadings.length; index += 1) {
    const heading = localizedHeadings[index]
    const withoutAnchor = lines[heading.lineIndex].replace(EXPLICIT_HEADING_ANCHOR, '')
    lines[heading.lineIndex] = `${withoutAnchor} {#${stableAnchors[index]}}`
  }
  return lines.join('\n')
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

async function englishRoutes(sourceRoot: string): Promise<string[]> {
  const localePaths = new Set(TRANSLATED_LOCALES.map((locale) => locale.path))
  return (await markdownFiles(sourceRoot)).filter((route) => {
    const first = route.split('/')[0]
    return first !== 'snippets' && !localePaths.has(first)
  })
}

async function routeDependencies(
  sourceRoot: string,
  sources: ReadonlyMap<string, string>,
): Promise<Map<string, Buffer>> {
  const dependencies = new Map<string, Buffer>()
  const pending = [...sources.entries()]
  const modulePattern = /\b(?:from\s+|import\s*)['"](\.{1,2}\/[^'"]+)['"]/gu

  while (pending.length > 0) {
    const [relativeSource, content] = pending.pop()!
    const sourceDirectory = path.posix.dirname(relativeSource)
    for (const match of content.matchAll(modulePattern)) {
      const dependency = path.posix.normalize(path.posix.join(sourceDirectory, match[1]))
      if (dependency === '..' || dependency.startsWith('../') || path.posix.isAbsolute(dependency)) {
        throw new Error(`${relativeSource}: relative import escapes the documentation source root: ${match[1]}`)
      }
      if (dependencies.has(dependency)) continue
      const bytes = await readFile(path.join(sourceRoot, dependency))
      dependencies.set(dependency, bytes)
      if (/\.(?:[cm]?[jt]s|vue)$/iu.test(dependency)) {
        pending.push([dependency, bytes.toString('utf8')])
      }
    }
  }

  return dependencies
}

async function assertEnglishSnapshot(
  sourceRoot: string,
  availableRoutes: readonly string[],
  sources: ReadonlyMap<string, string>,
  dependencies: ReadonlyMap<string, Buffer>,
): Promise<void> {
  const currentRoutes = await englishRoutes(sourceRoot)
  if (
    currentRoutes.length !== availableRoutes.length ||
    currentRoutes.some((route, index) => route !== availableRoutes[index])
  ) {
    throw new Error('English route inventory changed during translation; discard this run and restart')
  }
  for (const [route, content] of sources) {
    if ((await readFile(path.join(sourceRoot, route), 'utf8')) !== content) {
      throw new Error(`English source changed during translation: ${route}; discard this run and restart`)
    }
  }
  for (const [dependency, content] of dependencies) {
    if (!(await readFile(path.join(sourceRoot, dependency))).equals(content)) {
      throw new Error(
        `English source dependency changed during translation: ${dependency}; discard this run and restart`,
      )
    }
  }
}

async function replaceDirectoryAtomically(current: string, replacement: string, backup: string): Promise<void> {
  let movedCurrent = false
  try {
    await rename(current, backup)
    movedCurrent = true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }

  try {
    await rename(replacement, current)
  } catch (error) {
    if (movedCurrent) await rename(backup, current)
    throw error
  }
  if (movedCurrent) await rm(backup, { recursive: true, force: true })
}

function localizeRoute(route: string, locale: DocsLocale): string {
  const routePath = route.split(/[?#]/u, 1)[0]
  const extension = path.posix.extname(routePath).toLowerCase()
  if (/^\.{1,2}\//u.test(route) && extension && extension !== '.md') {
    return `../${route}`
  }
  if (
    !route.startsWith('/') ||
    route.startsWith('//') ||
    route.startsWith(`/${locale.path}/`) ||
    (extension && extension !== '.md')
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
 * symbolic markers. HTML markers use `translate=no`; identifier markers give
 * local models a tokenizer-safe placeholder while retaining paragraph context.
 */
export function protectMarkdown(
  source: string,
  locale: DocsLocale,
  markerStyle: ProtectedMarkerStyle = 'html',
): ProtectedMarkdown {
  const internalValues = new Map<string, string>()
  let sequence = 0
  const protect = (value: string): string => {
    const token = `⟦${sequence}⟧`
    sequence += 1
    internalValues.set(token, value)
    return token
  }

  let masked = source.replace(/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*(?:\n|$)/gmu, (block) =>
    protect(block),
  )
  masked = masked.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/giu, (block) => protect(block))
  masked = masked.replace(/(`+)([\s\S]*?)\1/gu, (code) => protect(code))
  masked = masked.replace(/\$\$[\s\S]*?\$\$/gu, (formula) => protect(formula))
  masked = masked.replace(/\\\[[\s\S]*?\\\]/gu, (formula) => protect(formula))
  masked = masked.replace(/\\\([^)\n]*\\\)/gu, (formula) => protect(formula))
  masked = masked.replace(/(?<!\\)\$(?!\s)(?:\\.|[^$\n])+(?<!\s)\$/gu, (formula) => protect(formula))
  masked = masked.replace(/^ {0,3}(?:<{3}|={3})\s+.*$/gmu, (line) => protect(line))
  masked = masked.replace(/^ {0,3}(?:[-*_]\s*){3,}$/gmu, (line) => protect(line))
  masked = masked.replace(/^(\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*)$/gmu, (line) => protect(line))
  masked = masked.replace(/^(\s*\[(?!\^)[^\]\n]+\]:\s+\S+.*)$/gmu, (line) => protect(line))
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
  masked = masked.replace(DOMAIN_NAME_PATTERN, (domain) => protect(domain))
  masked = masked.replace(/\{#[A-Za-z_][\w:.-]*\}/gu, (anchor) => protect(anchor))
  masked = masked.replace(/&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]+);/giu, (entity) => protect(entity))
  masked = masked.replace(TECHNICAL_TERM_PATTERN, (term) => protect(term))
  masked = masked.replace(CAMEL_CASE_IDENTIFIER_PATTERN, (term) => protect(term))
  masked = masked.replace(UPPERCASE_IDENTIFIER_PATTERN, (term) => protect(term))
  masked = masked.replace(/[*_~]{1,3}/gu, (delimiter) => protect(delimiter))
  masked = masked.replace(/\|/gu, (delimiter) => protect(delimiter))
  masked = masked.replace(/^(\s*(?:#{1,6}|>|[-+*]|\d+[.)]|:::\s*[A-Za-z-]*|\[\^[^\]\n]+\]:)\s+)/gmu, (prefix) =>
    protect(prefix),
  )
  masked = masked.replace(/\n/gu, (newline) => protect(newline))

  const values = new Map<string, string>()
  let markerSequence = 0
  for (const [internalToken, value] of internalValues) {
    const token = `[PH${markerSequence.toString().padStart(6, '0')}]`
    markerSequence += 1
    values.set(token, value)
    const rendered = markerStyle === 'html' ? `<span class="notranslate">${token}</span>` : token
    masked = masked.replaceAll(internalToken, rendered)
  }

  return {
    masked,
    valueForMarker(marker: string): string | undefined {
      const token = /\[PH\d{6}\]/u.exec(marker)?.[0]
      return token ? values.get(token) : undefined
    },
    restore(translated: string): string {
      let restored = translated.replace(/\[\s*PH\s*([0-9][0-9\s,._-]*)\s*\]/giu, (candidate, encodedIndex: string) => {
        const digits = encodedIndex.replace(/\D/gu, '')
        if (!digits) return candidate
        const index = Number.parseInt(digits, 10)
        if (!Number.isSafeInteger(index)) return candidate
        const canonical = `[PH${index.toString().padStart(6, '0')}]`
        return values.has(canonical) ? canonical : candidate
      })
      for (const [token, value] of values) {
        const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
        const wrapped = new RegExp(`<span\\b[^>]*>\\s*${escapedToken}\\s*</span>`, 'gu')
        restored = restored.replace(wrapped, token)
        const occurrences = restored.split(token).length - 1
        if (occurrences !== 1) {
          const carriers = [...values.entries()]
            .filter(([otherToken, value]) => otherToken !== token && value.includes(token))
            .map(([otherToken]) => otherToken)
          const carrierDetail = carriers.length ? `; nested in ${carriers.join(', ')}` : ''
          throw new Error(`Translation changed protected marker ${token} (${occurrences} occurrences${carrierDetail})`)
        }
        const markerIndex = restored.indexOf(token)
        const previous = markerIndex > 0 ? restored[markerIndex - 1] : ''
        const next = restored[markerIndex + token.length] ?? ''
        let replacement = value
        if (/[\p{L}\p{N}]$/u.test(previous) && /^[\p{L}\p{N}]/u.test(replacement)) {
          replacement = ` ${replacement}`
        }
        if (/[\p{L}\p{N}]$/u.test(replacement) && /^[\p{L}\p{N}]/u.test(next)) {
          replacement = `${replacement} `
        }
        restored = restored.replace(token, () => replacement)
      }
      return restored
    },
  }
}

export function chunkForTranslation(content: string, maximumCharacters = MAX_REQUEST_CHARACTERS): string[] {
  if (!Number.isInteger(maximumCharacters) || maximumCharacters < 128) {
    throw new Error('Translation chunk size must be an integer of at least 128 characters')
  }
  const chunks: string[] = []
  let remaining = content
  while (remaining.length > maximumCharacters) {
    let cut = maximumCharacters
    const candidates = [
      remaining.lastIndexOf('\n\n', cut),
      remaining.lastIndexOf('\n', cut),
      remaining.lastIndexOf('. ', cut),
      remaining.lastIndexOf('; ', cut),
      remaining.lastIndexOf(': ', cut),
      remaining.lastIndexOf(', ', cut),
      remaining.lastIndexOf(' ', cut),
    ]
    const boundary = candidates.find((candidate) => candidate >= maximumCharacters / 2)
    if (boundary !== undefined) cut = boundary + (remaining.startsWith('\n\n', boundary) ? 2 : 1)

    const openSpan = remaining.lastIndexOf('<span', cut)
    const closeSpan = remaining.lastIndexOf('</span>', cut)
    if (openSpan > closeSpan) cut = openSpan
    for (const match of remaining.matchAll(/\[PH\d{6}\]/gu)) {
      const start = match.index
      if (start >= cut) break
      if (start + match[0].length > cut) {
        cut = start
        break
      }
    }
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
  try {
    return await requestTranslationBatch(provider, texts, targetLanguage)
  } catch (error) {
    if (!isMateriallyShortProviderError(error)) throw error

    // The Python bridge rejects the whole request when any NLLB hypothesis
    // trips its token-length guard. Bisect the batch to isolate that input,
    // then retry only the failed prose in sentence-sized chunks. The original
    // guard stays active for every retry and the restored unit is checked again
    // by translationCompletenessError.
    if (texts.length > 1) {
      const midpoint = Math.ceil(texts.length / 2)
      const left = await translateBatch(provider, texts.slice(0, midpoint), targetLanguage)
      const right = await translateBatch(provider, texts.slice(midpoint), targetLanguage)
      return [...left, ...right]
    }

    const [source] = texts
    const retryChunks = chunksForIncompleteRetry(source)
    if (retryChunks.length === 1 && retryChunks[0] === source) throw error
    const translations = await translateBatch(provider, retryChunks, targetLanguage)
    return [
      joinTranslatedChunks(retryChunks, translations, ['jpn_Jpan', 'zho_Hans', 'zho_Hant'].includes(targetLanguage)),
    ]
  }
}

async function requestTranslationBatch(
  provider: TranslationProvider,
  texts: readonly string[],
  targetLanguage: string,
): Promise<string[]> {
  if (provider.translateBatch) return provider.translateBatch(texts, targetLanguage)
  return Promise.all(texts.map((text) => provider.translate(text, targetLanguage)))
}

function isMateriallyShortProviderError(error: unknown): boolean {
  const visited = new Set<unknown>()
  let current: unknown = error
  while (current instanceof Error && !visited.has(current)) {
    if (current.message.includes('translation output is materially shorter than its source')) return true
    visited.add(current)
    current = current.cause
  }
  return false
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
  const markerPattern = /(<span class="notranslate">\[PH\d{6}\]<\/span>)/gu
  const exactMarkerPattern = /^<span class="notranslate">\[PH\d{6}\]<\/span>$/u
  const pieces = protectedMarkdown.masked.split(markerPattern)
  const plans: FragmentPlan[] = []
  const units: string[] = []

  for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex += 1) {
    const piece = pieces[pieceIndex]
    if (!piece || exactMarkerPattern.test(piece)) continue

    const whitespace = /^(\s*(?:[,.:;!?]\s*)?)([\s\S]*?)(\s*)$/u.exec(piece)
    if (!whitespace || !whitespace[2]) continue
    if (!/\p{L}/u.test(whitespace[2])) continue
    const chunks = chunkForTranslation(whitespace[2], 128)
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
    const sourceChunks = units.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    const translatedChunks = translations.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    let translated = joinTranslatedChunks(
      sourceChunks,
      translatedChunks,
      ['jpn_Jpan', 'zho_Hans', 'zho_Hant'].includes(targetLanguage),
    )
    const previousMarker = pieces[plan.pieceIndex - 1]
    const nextMarker = pieces[plan.pieceIndex + 1]
    const previousValue =
      previousMarker && exactMarkerPattern.test(previousMarker)
        ? protectedMarkdown.valueForMarker(previousMarker)
        : undefined
    const nextValue =
      nextMarker && exactMarkerPattern.test(nextMarker) ? protectedMarkdown.valueForMarker(nextMarker) : undefined

    // Fragment-only translation deliberately hides protected markers from the
    // model. Some languages then drop an English possessive, parenthesis, or
    // hyphen at that boundary. Keep restored identifiers as separate words
    // even when the translated fragment no longer supplies the punctuation.
    if (previousValue && /[\p{L}\p{N}]$/u.test(previousValue) && /^[\p{L}\p{N}]/u.test(translated) && !plan.prefix) {
      translated = ` ${translated}`
    }
    if (nextValue && /[\p{L}\p{N}]$/u.test(translated) && /^[\p{L}\p{N}]/u.test(nextValue) && !plan.suffix) {
      translated = `${translated} `
    }

    pieces[plan.pieceIndex] = plan.prefix + translated + plan.suffix
  }
  return protectedMarkdown.restore(pieces.join(''))
}

interface MarkdownTranslationUnit {
  completenessMinimumLetters?: number
  content: string
  markdownTableCell?: boolean
  translate: boolean
}

type MarkdownLineKind = 'blockquote' | 'directive' | 'footnote' | 'heading' | 'html' | 'list' | 'plain' | 'table'

function markdownLineKind(line: string): MarkdownLineKind {
  if (/^ {0,3}#{1,6}[ \t]+/u.test(line)) return 'heading'
  if (/^ {0,3}(?:[-+*]|\d+[.)])[ \t]+/u.test(line)) return 'list'
  if (/^ {0,3}\[\^[^\]\n]+\]:[ \t]+/u.test(line)) return 'footnote'
  if (/^ {0,3}>[ \t]?/u.test(line)) return 'blockquote'
  if (/^ {0,3}\|/u.test(line)) return 'table'
  if (/^ {0,3}:::/u.test(line)) return 'directive'
  if (/^ {0,3}<[A-Za-z!/]/u.test(line)) return 'html'
  return 'plain'
}

function logicalProseUnits(lines: readonly string[]): string[] {
  const units: string[] = []
  let current = ''
  let currentKind: MarkdownLineKind | undefined

  const flush = () => {
    if (current) units.push(current)
    current = ''
    currentKind = undefined
  }

  for (const line of lines) {
    const kind = markdownLineKind(line)
    if (!current) {
      current = line
      currentKind = kind
      continue
    }

    if (kind === 'plain' && currentKind === 'plain') {
      current += ` ${line.trim()}`
      continue
    }
    if (
      kind === 'plain' &&
      (currentKind === 'list' || currentKind === 'blockquote' || currentKind === 'footnote') &&
      /^\s+/u.test(line)
    ) {
      current += ` ${line.trim()}`
      continue
    }
    if (kind === 'blockquote' && currentKind === 'blockquote') {
      current += ` ${line.replace(/^ {0,3}>[ \t]?/u, '').trim()}`
      continue
    }

    flush()
    current = line
    currentKind = kind
  }
  flush()
  return units
}

/**
 * Split Markdown into complete prose units while preserving literal blocks.
 *
 * Soft-wrapped paragraph and list continuation lines are joined before
 * translation so a local model sees complete sentences instead of isolated
 * line fragments.
 */
export function markdownTranslationUnits(source: string): MarkdownTranslationUnit[] {
  const units: MarkdownTranslationUnit[] = []
  const lines = source.split('\n')
  let prose: string[] = []

  const pushProse = (hasFollowingNewline: boolean) => {
    const logical = logicalProseUnits(prose)
    for (const [index, content] of logical.entries()) {
      units.push({ content, translate: true })
      if (index + 1 < logical.length || hasFollowingNewline) units.push({ content: '\n', translate: false })
    }
    prose = []
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const hasFollowingNewline = index + 1 < lines.length

    const fence = /^ {0,3}(`{3,}|~{3,})/u.exec(line)
    const script = /^ {0,3}<(script|style)\b/iu.exec(line)
    const displayMath = /^ {0,3}(?:\$\$|\\\[)\s*$/u.test(line)
    if (fence || script || displayMath) {
      pushProse(false)
      const literal: string[] = [line]
      if (fence) {
        for (index += 1; index < lines.length; index += 1) {
          literal.push(lines[index])
          if (new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}\\s*$`, 'u').test(lines[index])) break
        }
      } else if (script) {
        const close = new RegExp(`</${script[1]}>`, 'iu')
        if (!close.test(line)) {
          for (index += 1; index < lines.length; index += 1) {
            literal.push(lines[index])
            if (close.test(lines[index])) break
          }
        }
      } else if (!(line.trim() === '$$' && line.indexOf('$$') !== line.lastIndexOf('$$'))) {
        const close = displayMath && line.trim() === '$$' ? /^\s*\$\$\s*$/u : /^\s*\\\]\s*$/u
        for (index += 1; index < lines.length; index += 1) {
          literal.push(lines[index])
          if (close.test(lines[index])) break
        }
      }
      units.push({ content: literal.join('\n'), translate: false })
      if (index + 1 < lines.length) units.push({ content: '\n', translate: false })
      continue
    }

    if (line === '') {
      pushProse(true)
      if (hasFollowingNewline) units.push({ content: '\n', translate: false })
      continue
    }
    prose.push(line)
    if (!hasFollowingNewline) pushProse(false)
  }

  return units
}

interface InlineTranslationPlan {
  completenessContext: TranslationCompletenessContext
  completenessMinimumLetters: number
  protectedMarkdown: ProtectedMarkdown
  firstChunk: number
  chunkCount: number
  prefix: string
  source: string
  suffix: string
}

export interface TranslationCompletenessContext {
  markdownTableCell: boolean
}

function removeTranslatableEmphasis(source: string): string {
  return source
    .replace(/(\*\*|__|~~)(?=\S)([\s\S]*?\S)\1/gu, '$2')
    .replace(/(?<![\p{L}\p{N}])([*_])(?=\S)([\s\S]*?\S)\1(?![\p{L}\p{N}])/gu, '$2')
}

function detachBoundaryMarkers(
  masked: string,
  protectedMarkdown: ProtectedMarkdown,
): { core: string; prefix: string; suffix: string } {
  const marker = /\[PH\d{6}\]/u
  const structuralPrefix = /^\s*(?:#{1,6}|>|[-+*]|\d+[.)]|:::\s*[A-Za-z-]*|\[\^[^\]\n]+\]:)\s+$/u
  const structuralSuffix = /^\{#[A-Za-z_][\w:.-]*\}$/u
  let core = masked
  let prefix = ''
  let suffix = ''

  for (;;) {
    const leading = /^\s*(\[PH\d{6}\])\s*/u.exec(core)
    if (!leading) break
    const value = protectedMarkdown.valueForMarker(leading[1])
    if (value === undefined || (/[\p{L}\p{N}]/u.test(value) && !structuralPrefix.test(value))) break
    prefix += leading[0]
    core = core.slice(leading[0].length)
  }
  for (;;) {
    const trailing = /\s*(\[PH\d{6}\])\s*$/u.exec(core)
    if (!trailing) break
    const value = protectedMarkdown.valueForMarker(trailing[1])
    if (value === undefined || (/[\p{L}\p{N}]/u.test(value) && !structuralSuffix.test(value))) break
    suffix = trailing[0] + suffix
    core = core.slice(0, trailing.index)
  }

  if (!marker.test(core)) return { core, prefix, suffix }
  return { core, prefix, suffix }
}

function translationLetterCount(content: string): number {
  return [...content.matchAll(/[\p{L}\p{M}]/gu)].length
}

function endsWithContinuationPunctuation(content: string): boolean {
  return /[,;،؛，；](?:["')\]}»”]*)$/u.test(content.trim())
}

function translationCompletenessError(
  source: string,
  translated: string,
  locale: DocsLocale,
  minimumSourceLetters = 80,
): string | undefined {
  const sourceLetters = translationLetterCount(source)
  const translatedLetters = translationLetterCount(translated)
  const ratio = translatedLetters / sourceLetters
  const sourceSentences = sentenceCount(source, 'en')
  const translatedSentences = sentenceCount(translated, locale.lang)
  if (
    sourceLetters >= minimumSourceLetters &&
    sourceSentences >= 2 &&
    translatedSentences < sourceSentences &&
    ratio < sentenceCoverageMinimumRatio(locale.key)
  ) {
    return `output has incomplete sentence coverage (expected at least ${sourceSentences}, found ${translatedSentences}; ${ratio.toFixed(2)} of source letters)`
  }
  if (sourceLetters >= minimumSourceLetters && ratio <= translationMinimumRatio(locale.key)) {
    return `output is materially short (${ratio.toFixed(2)} of source letters)`
  }
  if (
    sourceLetters >= minimumSourceLetters &&
    /[.!?](?:["')\]}]*)$/u.test(source.trim()) &&
    endsWithContinuationPunctuation(translated)
  ) {
    return 'output ends with continuation punctuation'
  }
  return undefined
}

function joinTranslatedChunks(
  sourceChunks: readonly string[],
  translatedChunks: readonly string[],
  compactBoundaries: boolean,
): string {
  let joined = translatedChunks[0] ?? ''
  for (let index = 1; index < translatedChunks.length; index += 1) {
    const next = translatedChunks[index]
    const sourceHadWhitespace = /\s$/u.test(sourceChunks[index - 1]) || /^\s/u.test(sourceChunks[index])
    const connectiveBoundary = /\bso\s*$/iu.test(sourceChunks[index - 1])
    if (
      compactBoundaries &&
      connectiveBoundary &&
      !/[.!?。！？,，、;；:：]\s*$/u.test(joined) &&
      !/^\s*[.!?。！？,，、;；:：]/u.test(next)
    ) {
      joined += '。'
    } else if (sourceHadWhitespace && !compactBoundaries && !/\s$/u.test(joined) && !/^\s/u.test(next)) {
      joined += ' '
    }
    joined += next
  }
  return joined
}

function chunksAtClauseBoundaries(content: string): string[] {
  const clauses: string[] = []
  let start = 0
  for (const match of content.matchAll(/[,;:،؛，；：、](?:\s+|(?=\S)|$)/gu)) {
    const end = match.index + match[0].length
    clauses.push(content.slice(start, end))
    start = end
  }
  if (start < content.length) clauses.push(content.slice(start))
  if (clauses.length < 2) return [content]

  const chunks: string[] = []
  let consumed = 0
  let pending = ''
  for (const clause of clauses) {
    pending += clause
    consumed += clause.length
    const remaining = content.slice(consumed)
    const pendingLetters = translationLetterCount(pending.replace(/\[PH\d{6}\]/gu, ''))
    const remainingLetters = translationLetterCount(remaining.replace(/\[PH\d{6}\]/gu, ''))
    if (remaining && pendingLetters >= 20 && remainingLetters >= 20) {
      chunks.push(pending)
      pending = ''
    }
  }
  if (pending) chunks.push(pending)
  return chunks.length > 1 ? chunks : [content]
}

function chunksAtEnglishConnectiveBoundaries(content: string): string[] {
  const chunks: string[] = []
  let start = 0
  for (const match of content.matchAll(/\bso\b\s+|(?<=\s)(?:if|for)\s+/giu)) {
    const cut = /^(?:if|for)\b/iu.test(match[0]) ? match.index : match.index + match[0].length
    const pending = content.slice(start, cut)
    const remaining = content.slice(cut)
    const pendingLetters = translationLetterCount(pending.replace(/\[PH\d{6}\]/gu, ''))
    const remainingLetters = translationLetterCount(remaining.replace(/\[PH\d{6}\]/gu, ''))
    if (pendingLetters < 20 || remainingLetters < 20) continue
    chunks.push(pending)
    start = cut
  }
  if (start > 0) chunks.push(content.slice(start))
  return chunks.length > 1 ? chunks : [content]
}

export function isCompleteShortStructuralLeadIn(source: string, translated: string): boolean {
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  return (
    sourceLetters > 0 &&
    sourceLetters <= 32 &&
    translatedLetters >= 3 &&
    /:\s*$/u.test(sourceWithoutMarkers) &&
    /[:：]\s*$/u.test(translatedWithoutMarkers)
  )
}

function hasExactTechnicalIdentifierSet(source: string, translated: string): boolean {
  const sourceIdentifiers = technicalIdentifiers(source)
  const translatedIdentifiers = technicalIdentifiers(translated)
  return (
    sourceIdentifiers.size === translatedIdentifiers.size &&
    [...sourceIdentifiers].every(
      ([identifier, expectedCount]) => translatedIdentifiers.get(identifier) === expectedCount,
    )
  )
}

export function isCompleteCompactCjkTableLabel(
  source: string,
  translated: string,
  locale: DocsLocale,
  context: TranslationCompletenessContext,
): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key) || !context.markdownTableCell) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  const sourceWords = sourceWithoutMarkers.match(/\p{L}+/gu) ?? []
  const hasEnoughTargetLetters =
    (sourceLetters <= 40 &&
      (translatedLetters >= 6 ||
        (sourceLetters >= 20 && sourceLetters <= 24 && sourceWords.length === 2 && translatedLetters >= 4))) ||
    (sourceLetters > 40 && sourceLetters <= 80 && translatedLetters >= 12)
  return (
    sourceLetters >= 20 &&
    sourceLetters <= 80 &&
    hasEnoughTargetLetters &&
    !/[.!?]/u.test(sourceWithoutMarkers) &&
    !endsWithContinuationPunctuation(translatedWithoutMarkers) &&
    !/、(?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

export function isCompleteCompactCjkSentence(source: string, translated: string, locale: DocsLocale): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key)) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  return (
    sourceLetters >= 20 &&
    sourceLetters <= 60 &&
    translatedLetters >= 12 &&
    /[.!?](?:["')\]}]*)\s*$/u.test(sourceWithoutMarkers) &&
    /[.!?。！？](?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

function retryChunkCompletenessError(
  source: string,
  translated: string,
  locale: DocsLocale,
  context: TranslationCompletenessContext,
): string | undefined {
  const markerError = retryChunkMarkerError(source, translated)
  if (markerError) return markerError
  if (isCompleteCompactCjkTableLabel(source, translated, locale, context)) return undefined
  if (isCompleteCompactCjkSentence(source, translated, locale)) return undefined
  if (isCompleteShortStructuralLeadIn(source, translated)) return undefined
  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  return translationCompletenessError(withoutMarkers(source), withoutMarkers(translated), locale, 20)
}

export function hasExactProtectedMarkerMultiset(source: string, translated: string): boolean {
  const sourceMarkers = source.match(/\[PH\d{6}\]/gu) ?? []
  const translatedMarkers = translated.match(/\[PH\d{6}\]/gu) ?? []
  const sortedSourceMarkers = [...sourceMarkers].sort()
  const sortedTranslatedMarkers = [...translatedMarkers].sort()
  return (
    sortedSourceMarkers.length === sortedTranslatedMarkers.length &&
    sortedSourceMarkers.every((marker, index) => marker === sortedTranslatedMarkers[index])
  )
}

function retryChunkMarkerError(source: string, translated: string): string | undefined {
  if (hasExactProtectedMarkerMultiset(source, translated)) return undefined
  const sourceMarkers = source.match(/\[PH\d{6}\]/gu) ?? []
  const translatedMarkers = translated.match(/\[PH\d{6}\]/gu) ?? []
  return `output changed protected markers (expected ${sourceMarkers.join(', ') || 'none'}, found ${translatedMarkers.join(', ') || 'none'})`
}

function hasOnlyMissingProtectedMarkers(source: string, translated: string): boolean {
  const sourceMarkers = source.match(/\[PH\d{6}\]/gu) ?? []
  const translatedMarkers = translated.match(/\[PH\d{6}\]/gu) ?? []
  if (translatedMarkers.length >= sourceMarkers.length) return false
  const remaining = new Map<string, number>()
  for (const marker of sourceMarkers) remaining.set(marker, (remaining.get(marker) ?? 0) + 1)
  for (const marker of translatedMarkers) {
    const count = remaining.get(marker) ?? 0
    if (count === 0) return false
    remaining.set(marker, count - 1)
  }
  return true
}

async function recoverRetryChunkMarkers(
  source: string,
  targetLanguage: string,
  provider: TranslationProvider,
): Promise<string> {
  const markerPattern = /(\[PH\d{6}\])/gu
  const exactMarkerPattern = /^\[PH\d{6}\]$/u
  const pieces = source.split(markerPattern)
  const plans: FragmentPlan[] = []
  const units: string[] = []

  for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex += 1) {
    const piece = pieces[pieceIndex]
    if (!piece || exactMarkerPattern.test(piece)) continue

    const whitespace = /^(\s*(?:[,.:;!?]\s*)?)([\s\S]*?)(\s*)$/u.exec(piece)
    if (!whitespace || !whitespace[2] || !/\p{L}/u.test(whitespace[2])) continue
    const chunks = chunkForTranslation(whitespace[2], 128)
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
    throw new Error(`Translation provider returned ${translations.length} results for ${units.length} retry fragments`)
  }

  for (const plan of plans) {
    const sourceChunks = units.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    const translatedChunks = translations.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    pieces[plan.pieceIndex] =
      plan.prefix +
      joinTranslatedChunks(
        sourceChunks,
        translatedChunks,
        ['jpn_Jpan', 'zho_Hans', 'zho_Hant'].includes(targetLanguage),
      ) +
      plan.suffix
  }
  return pieces.join('')
}

const NON_TERMINAL_ENGLISH_ABBREVIATION =
  /(?:^|[\s("'‘“])(?:mr|mrs|ms|dr|prof|sr|jr|st|mt|vs|etc|e\.g|i\.e|no|fig|eq|sec|ch|vol|inc|ltd|co|corp)\.\s*$/iu

function isCompleteNaturalLanguageSentence(segment: string): boolean {
  const withoutMarkers = segment.replace(/\[PH\d{6}\]/gu, '')
  return (
    /\p{L}/u.test(withoutMarkers) &&
    /[.!?](?:["')\]}]*)\s*$/u.test(segment) &&
    !NON_TERMINAL_ENGLISH_ABBREVIATION.test(withoutMarkers)
  )
}

function chunksForIncompleteRetry(content: string): string[] {
  const sentences: string[] = []
  let pending = ''
  for (const { segment } of new Intl.Segmenter('en', { granularity: 'sentence' }).segment(content)) {
    pending += segment
    if (!isCompleteNaturalLanguageSentence(segment)) continue
    sentences.push(pending)
    pending = ''
  }
  if (pending) sentences.push(pending)
  if (sentences.length === 0) sentences.push(content)
  const chunks = sentences.flatMap((sentence) => chunkForTranslation(sentence, 128))
  if (chunks.length === 1 && chunks[0] === content) {
    const punctuationChunks = chunksAtClauseBoundaries(content)
    if (punctuationChunks.length > 1) return punctuationChunks
    return chunksAtEnglishConnectiveBoundaries(content)
  }
  return chunks
}

async function translateRetryChunksWithCoverage(
  sourceChunks: readonly string[],
  locale: DocsLocale,
  provider: TranslationProvider,
  targetLanguage: string,
  context: TranslationCompletenessContext,
): Promise<string[]> {
  let translations: string[]
  try {
    translations = await requestTranslationBatch(provider, sourceChunks, targetLanguage)
  } catch (error) {
    if (!isMateriallyShortProviderError(error)) throw error
    if (sourceChunks.length > 1) {
      const midpoint = Math.ceil(sourceChunks.length / 2)
      const left = await translateRetryChunksWithCoverage(
        sourceChunks.slice(0, midpoint),
        locale,
        provider,
        targetLanguage,
        context,
      )
      const right = await translateRetryChunksWithCoverage(
        sourceChunks.slice(midpoint),
        locale,
        provider,
        targetLanguage,
        context,
      )
      return [...left, ...right]
    }

    const [source] = sourceChunks
    const retryChunks = chunksForIncompleteRetry(source)
    if (retryChunks.length === 1 && retryChunks[0] === source) throw error
    const retryTranslations = await translateRetryChunksWithCoverage(
      retryChunks,
      locale,
      provider,
      targetLanguage,
      context,
    )
    return [joinTranslatedChunks(retryChunks, retryTranslations, ['ja', 'zh-hans', 'zh-hant'].includes(locale.key))]
  }

  if (translations.length !== sourceChunks.length) {
    throw new Error(
      `Translation provider returned ${translations.length} results for ${sourceChunks.length} retry chunks`,
    )
  }

  const covered: string[] = []
  for (let index = 0; index < sourceChunks.length; index += 1) {
    const source = sourceChunks[index]
    const translated = translations[index]
    const incomplete = retryChunkCompletenessError(source, translated, locale, context)
    if (!incomplete) {
      covered.push(translated)
      continue
    }

    const markerError = retryChunkMarkerError(source, translated)
    if (markerError) {
      if (!hasOnlyMissingProtectedMarkers(source, translated)) {
        throw new Error(`semantic retry chunk ${index + 1}: ${markerError}`)
      }
      const recovered = await recoverRetryChunkMarkers(source, targetLanguage, provider)
      const recoveryError = retryChunkCompletenessError(source, recovered, locale, context)
      if (recoveryError) {
        throw new Error(`semantic retry chunk ${index + 1}: ${incomplete}; marker-fragment recovery ${recoveryError}`)
      }
      covered.push(recovered)
      continue
    }

    const retryChunks = chunksForIncompleteRetry(source)
    if (retryChunks.length === 1 && retryChunks[0] === source) {
      throw new Error(`semantic retry chunk ${index + 1}: ${incomplete}; no smaller safe boundary`)
    }
    const retryTranslations = await translateRetryChunksWithCoverage(
      retryChunks,
      locale,
      provider,
      targetLanguage,
      context,
    )
    covered.push(
      joinTranslatedChunks(retryChunks, retryTranslations, ['ja', 'zh-hans', 'zh-hant'].includes(locale.key)),
    )
  }
  return covered
}

async function retryIncompleteInlineUnit(
  source: string,
  locale: DocsLocale,
  provider: TranslationProvider,
  context: TranslationCompletenessContext,
): Promise<string> {
  const protectedMarkdown = protectMarkdown(source, locale, 'identifier')
  const { core, prefix, suffix } = detachBoundaryMarkers(protectedMarkdown.masked, protectedMarkdown)
  if (!/\p{L}/u.test(core)) return protectedMarkdown.restore(prefix + core + suffix)
  const sourceChunks = chunksForIncompleteRetry(core)
  const targetLanguage = providerLanguageCode(provider, locale)
  const translations = await translateRetryChunksWithCoverage(sourceChunks, locale, provider, targetLanguage, context)
  const compactBoundaries = ['ja', 'zh-hans', 'zh-hant'].includes(locale.key)
  const restoreJoined = (translatedChunks: readonly string[]): string =>
    protectedMarkdown.restore(prefix + joinTranslatedChunks(sourceChunks, translatedChunks, compactBoundaries) + suffix)
  const candidate = restoreJoined(translations)

  if (
    isCompleteCompactCjkTableLabel(source, candidate, locale, context) ||
    !translationCompletenessError(source, candidate, locale) ||
    sourceChunks.length < 2
  ) {
    return candidate
  }

  const recoveredTranslations = [...translations]
  let retriedClause = false
  for (let index = 0; index < sourceChunks.length; index += 1) {
    const clauseChunks = chunksAtClauseBoundaries(sourceChunks[index])
    if (clauseChunks.length < 2) continue
    const clauseTranslations = await translateRetryChunksWithCoverage(
      clauseChunks,
      locale,
      provider,
      targetLanguage,
      context,
    )
    recoveredTranslations[index] = joinTranslatedChunks(clauseChunks, clauseTranslations, compactBoundaries)
    retriedClause = true
  }
  if (!retriedClause) return candidate

  return restoreJoined(recoveredTranslations)
}

async function translateInlineIdentifierMarkdown(
  source: string,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const output: string[] = []
  const plans: InlineTranslationPlan[] = []
  const chunks: string[] = []

  const baseUnits = markdownTranslationUnits(source)
  const units = baseUnits.flatMap((unit): MarkdownTranslationUnit[] => {
    if (!unit.translate || markdownLineKind(unit.content) !== 'table') return [unit]
    return unit.content
      .split(/((?<!\\)\|)/u)
      .filter(Boolean)
      .map((content) => ({
        completenessMinimumLetters: content === '|' ? undefined : 20,
        content,
        markdownTableCell: content !== '|',
        translate: content !== '|',
      }))
  })

  for (const unit of units) {
    if (!unit.translate || !/\p{L}/u.test(unit.content)) {
      output.push(unit.content)
      continue
    }

    // NLLB is substantially more reliable when it translates complete prose
    // without paired placeholder tokens around emphasis spans. Localized prose
    // therefore normalizes emphasis to plain text while preserving code,
    // identifiers, links, and every structural Markdown token.
    const protectedMarkdown = protectMarkdown(removeTranslatableEmphasis(unit.content), locale, 'identifier')
    const { core, prefix, suffix } = detachBoundaryMarkers(protectedMarkdown.masked, protectedMarkdown)
    if (!/\p{L}/u.test(core)) {
      output.push(protectedMarkdown.restore(prefix + core + suffix))
      continue
    }
    const unitChunks = chunkForTranslation(core, 300)
    plans.push({
      completenessContext: { markdownTableCell: unit.markdownTableCell === true },
      completenessMinimumLetters: unit.completenessMinimumLetters ?? 80,
      protectedMarkdown,
      firstChunk: chunks.length,
      chunkCount: unitChunks.length,
      prefix,
      source: removeTranslatableEmphasis(unit.content),
      suffix,
    })
    chunks.push(...unitChunks)
    output.push('')
  }

  const translations = await translateBatch(provider, chunks, providerLanguageCode(provider, locale))
  if (translations.length !== chunks.length) {
    throw new Error(`Translation provider returned ${translations.length} results for ${chunks.length} prose chunks`)
  }

  let planIndex = 0
  for (let outputIndex = 0; outputIndex < output.length; outputIndex += 1) {
    if (output[outputIndex] !== '') continue
    const plan = plans[planIndex]
    planIndex += 1
    const sourceChunks = chunks.slice(plan.firstChunk, plan.firstChunk + plan.chunkCount)
    const translatedChunks = translations.slice(plan.firstChunk, plan.firstChunk + plan.chunkCount)
    const translated = joinTranslatedChunks(
      sourceChunks,
      translatedChunks,
      ['ja', 'zh-hans', 'zh-hant'].includes(locale.key),
    )
    let candidate: string
    try {
      candidate = plan.protectedMarkdown.restore(plan.prefix + translated + plan.suffix)
    } catch (error) {
      try {
        candidate = await translateProtectedFragments(
          protectMarkdown(plan.source, locale),
          providerLanguageCode(provider, locale),
          provider,
        )
      } catch (fallbackError) {
        throw new Error(
          `prose unit ${planIndex}: ${error instanceof Error ? error.message : String(error)}; fragment fallback failed: ${
            fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
          }`,
          { cause: fallbackError },
        )
      }
    }
    const incomplete = isCompleteCompactCjkTableLabel(plan.source, candidate, locale, plan.completenessContext)
      ? undefined
      : translationCompletenessError(plan.source, candidate, locale, plan.completenessMinimumLetters)
    if (incomplete) {
      candidate = await retryIncompleteInlineUnit(plan.source, locale, provider, plan.completenessContext)
      const retryIncomplete = isCompleteCompactCjkTableLabel(plan.source, candidate, locale, plan.completenessContext)
        ? undefined
        : translationCompletenessError(plan.source, candidate, locale, plan.completenessMinimumLetters)
      if (retryIncomplete) {
        throw new Error(`prose unit ${planIndex}: ${incomplete}; sentence-level retry ${retryIncomplete}`)
      }
    }
    output[outputIndex] = candidate
  }
  return output.join('')
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
  readonly protectedMarkdownMode = 'inline-identifiers' as const

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
  if (provider.protectedMarkdownMode === 'inline-identifiers') {
    return translateInlineIdentifierMarkdown(source, locale, provider)
  }
  const protectedMarkdown = protectMarkdown(source, locale, 'html')
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
  const translatedBody = await translateMarkdown(addStableHeadingAnchors(body), locale, provider)
  const metadata = [
    `translation_locale: ${locale.key}`,
    `translation_source: /${route}`,
    `translation_source_hash: ${sha256(english)}`,
    `translation_status: ${TRANSLATION_STATUS}`,
    `translation_engine: ${provider.engine ?? GOOGLE_TRANSLATION_ENGINE}`,
  ]
  if (localizedFrontmatter !== null) metadata.push('', localizedFrontmatter)
  const bodySeparator = translatedBody.startsWith('\n') || !translatedBody ? '' : '\n'
  return stripTrailingWhitespaceOutsideFences(`---\n${metadata.join('\n')}\n---\n${bodySeparator}${translatedBody}`)
}

/** Synchronize stable English heading IDs into existing translated pages without retranslating prose. */
export async function synchronizeTranslationHeadingAnchors(
  options: SynchronizeHeadingAnchorOptions = {},
): Promise<void> {
  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const availableRoutes = await englishRoutes(sourceRoot)
  const availableRouteSet = new Set(availableRoutes)
  const routes = options.routes
    ? [...new Set(options.routes.map((route) => route.replace(/^\/+/u, '')))]
    : availableRoutes
  const unknownRoutes = routes.filter((route) => !availableRouteSet.has(route))
  if (unknownRoutes.length > 0) {
    throw new Error(`Unknown English route(s): ${unknownRoutes.join(', ')}`)
  }

  const anchorsByRoute = new Map<string, string[]>()
  await Promise.all(
    routes.map(async (route) => {
      const english = await readFile(path.join(sourceRoot, route), 'utf8')
      anchorsByRoute.set(
        route,
        markdownHeadings(splitFrontmatter(english).body).map((heading) => heading.stableAnchor),
      )
    }),
  )

  const updates: Array<{ content: string; target: string }> = []
  for (const locale of locales) {
    for (const route of routes) {
      const target = path.join(sourceRoot, locale.path, route)
      const content = await readFile(target, 'utf8')
      const document = splitFrontmatter(content)
      const anchoredBody = applyStableHeadingAnchors(document.body, anchorsByRoute.get(route)!)
      const prefixLength = content.length - document.body.length
      updates.push({ target, content: content.slice(0, prefixLength) + anchoredBody })
    }
  }
  await Promise.all(updates.map(({ target, content }) => writeFile(target, content)))
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

  const availableRoutes = await englishRoutes(sourceRoot)
  const availableRouteSet = new Set(availableRoutes)
  const routes = options.routes
    ? [...new Set(options.routes.map((route) => route.replace(/^\/+/u, '')))]
    : availableRoutes
  const unknownRoutes = routes.filter((route) => !availableRouteSet.has(route))
  if (unknownRoutes.length > 0) {
    throw new Error(`Unknown English route(s): ${unknownRoutes.join(', ')}`)
  }
  const sources = new Map<string, string>()
  await Promise.all(
    routes.map(async (route) => {
      sources.set(route, await readFile(path.join(sourceRoot, route), 'utf8'))
    }),
  )
  const dependencies = await routeDependencies(sourceRoot, sources)

  const stagingRoot = await mkdtemp(path.join(path.dirname(sourceRoot), `.iroha-docs-translation-${process.pid}-`))
  try {
    for (const locale of locales) {
      const localeRoot = path.join(sourceRoot, locale.path)
      const stagedLocaleRoot = path.join(stagingRoot, locale.path)
      const backupLocaleRoot = path.join(stagingRoot, `${locale.path}-previous`)
      const scope = options.routes ? 'selected pages' : 'pages'
      console.log(`Translating ${routes.length} ${scope} to ${locale.label} (${locale.key})…`)
      await parallelMap(routes, concurrency, async (route, index) => {
        const target = path.join(stagedLocaleRoot, route)
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
      for (const dependency of dependencies.keys()) {
        const target = path.join(stagedLocaleRoot, dependency)
        await mkdir(path.dirname(target), { recursive: true })
        await copyFile(path.join(sourceRoot, dependency), target)
      }
      await assertEnglishSnapshot(sourceRoot, availableRoutes, sources, dependencies)

      if (options.routes) {
        for (const route of routes) {
          const target = path.join(localeRoot, route)
          await mkdir(path.dirname(target), { recursive: true })
          await rename(path.join(stagedLocaleRoot, route), target)
        }
        for (const dependency of dependencies.keys()) {
          const target = path.join(localeRoot, dependency)
          await mkdir(path.dirname(target), { recursive: true })
          await rename(path.join(stagedLocaleRoot, dependency), target)
        }
      } else {
        await replaceDirectoryAtomically(localeRoot, stagedLocaleRoot, backupLocaleRoot)
      }
    }
    await assertEnglishSnapshot(sourceRoot, availableRoutes, sources, dependencies)
  } finally {
    await rm(stagingRoot, { recursive: true, force: true })
  }
}

interface TranslationCliOptions {
  locales: readonly DocsLocale[]
  routes?: readonly string[]
  concurrency: number
  providerName: 'google' | 'nllb'
  python?: string
  model?: string
  synchronizeAnchors: boolean
}

function parseCli(argv: string[]): TranslationCliOptions {
  let selectedKeys: string[] = []
  let routes: string[] | undefined
  let concurrency = 4
  let providerName: 'google' | 'nllb' = 'google'
  let python: string | undefined
  let model: string | undefined
  let synchronizeAnchors = false
  for (const argument of argv) {
    if (argument.startsWith('--locale=')) {
      selectedKeys = argument
        .slice('--locale='.length)
        .split(',')
        .map((key) => key.trim())
        .filter(Boolean)
    } else if (argument.startsWith('--route=')) {
      routes = [
        ...(routes ?? []),
        ...argument
          .slice('--route='.length)
          .split(',')
          .map((route) => route.trim())
          .filter(Boolean),
      ]
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
    } else if (argument === '--sync-anchors') {
      synchronizeAnchors = true
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
  if (!synchronizeAnchors && providerName === 'nllb' && !model) {
    throw new Error('--provider=nllb requires --model=<CTranslate2 model path>')
  }
  if (!synchronizeAnchors && providerName === 'google' && (python || model)) {
    throw new Error('--python and --model are only valid with --provider=nllb')
  }
  return { locales, routes, concurrency, providerName, python, model, synchronizeAnchors }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { locales, routes, concurrency, providerName, python, model, synchronizeAnchors } = parseCli(
    process.argv.slice(2),
  )
  ;(async () => {
    if (synchronizeAnchors) {
      await synchronizeTranslationHeadingAnchors({ locales, routes })
      return
    }
    const provider: TranslationProvider =
      providerName === 'nllb' ? new NllbTranslationProvider({ python, model: model! }) : new GoogleTranslationProvider()
    try {
      await generateTranslations({ locales, routes, concurrency, provider })
    } finally {
      await provider.close?.()
    }
  })().catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
}
