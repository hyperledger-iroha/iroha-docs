import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { TRANSLATED_LOCALES, type DocsLocale } from './locales'
import {
  markdownContainerDirectives,
  markdownHeadings,
  markdownTranslationUnits,
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

function footnoteMarkerCounts(content: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const match of content.matchAll(/\[\^[^\]\n]+\]/gu)) {
    counts.set(match[0], (counts.get(match[0]) ?? 0) + 1)
  }
  return counts
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
