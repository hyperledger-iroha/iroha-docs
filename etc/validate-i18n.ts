import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { TRANSLATED_LOCALES, type DocsLocale } from './locales'

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
  const normalized = content.replace(/\r\n/gu, '\n')
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/u.exec(normalized)
  if (!match) return normalized.trim()

  const retainedFrontmatter = match[1].split('\n').filter((line) => !/^translation_[a-z0-9_]+:\s*/u.test(line))
  while (retainedFrontmatter[0]?.trim() === '') retainedFrontmatter.shift()
  while (retainedFrontmatter.at(-1)?.trim() === '') retainedFrontmatter.pop()
  const body = normalized.slice(match[0].length)
  if (retainedFrontmatter.length === 0) return body.trim()
  return [`---`, ...retainedFrontmatter, `---`, body].join('\n').trim()
}

export async function validateI18n(options: I18nValidationOptions = {}): Promise<string[]> {
  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const localePaths = new Set(locales.map((locale) => locale.path))
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
      const { metadata } = parseFrontmatter(localizedContent)
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
      if (contentWithoutTranslationMetadata(localizedContent) === contentWithoutTranslationMetadata(englishContent)) {
        errors.push(`${locale.path}/${route}: translated content is an English fallback`)
      }
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
