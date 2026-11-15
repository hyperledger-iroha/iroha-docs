import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import type { DocsLocale } from './locales'
import { auditableUntranslatedEnglishRuns } from './audit-i18n-scripts'
import { addStableHeadingAnchors, assertGeneratedMarkdownStructure, markdownTranslationUnits } from './translate'
import { validateI18n } from './validate-i18n'

export interface TranslationDeltaUnit {
  /** One-based position in the updated English prose inventory. */
  unit: number
  english: string
  /** One-based position in the previous English inventory, or null for new prose. */
  previousUnit: number | null
}

export interface TranslationDelta {
  previousHash: string
  currentHash: string
  previousUnitCount: number
  units: TranslationDeltaUnit[]
}

export function translationSourceHash(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

export function splitTranslationDocument(content: string): { prefix: string; body: string } {
  const prefix = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u.exec(content)?.[0] ?? ''
  return { prefix, body: content.slice(prefix.length) }
}

/** Change visible prose only; technical literals and destinations remain byte-for-byte intact. */
function mapNamingProse(source: string, transform: (prose: string) => string): string {
  const protectedSpan =
    /(`+)[\s\S]*?\1|\]\((?:\\.|[^)\n])*\)|\]\[[^\]\n]*\]|\{#[^}\n]+\}|<[^>\n]+>|\bhttps?:\/\/[^\s<>)\]]+|\b(?:[\w-]+\.)+[A-Za-z][A-Za-z0-9./_-]*/gu
  let cursor = 0
  let output = ''
  for (const match of source.matchAll(protectedSpan)) {
    output += transform(source.slice(cursor, match.index)) + match[0]
    cursor = match.index + match[0].length
  }
  return output + transform(source.slice(cursor))
}

function normalizePlatformNames(source: string): string {
  return source.replace(/\b(?:SORA(?: Nexus)?|Sora|Nexus)\b/gu, (name, offset: number) =>
    /\bBIS\s+$/u.test(source.slice(0, offset)) ? name : 'SORA Nexus',
  )
}

/** Recognize only the two approved editorial naming changes, never a fuzzy semantic match. */
export function reuseNamingOnlyTranslation(
  previous: string,
  current: string,
  localized: string,
  locale: DocsLocale,
): string | undefined {
  const canonical = (text: string) =>
    mapNamingProse(text, (prose) =>
      normalizePlatformNames(prose).replace(
        /\b(?:dataspace|dataspaces|Dataspace|Dataspaces)\b/gu,
        (word) => `${word[0] === 'D' ? 'Data' : 'data'} space${word.endsWith('s') ? 's' : ''}`,
      ),
    )
  if (previous === current || canonical(previous) !== canonical(current)) return undefined
  const previousNames = mapNamingProse(previous, normalizePlatformNames)
  const currentNames = mapNamingProse(current, normalizePlatformNames)
  let candidate = localized
  if (previousNames !== previous) {
    // A mix of renamed and intentionally unrenamed platform names is ambiguous.
    if (currentNames !== current) return undefined
    candidate = mapNamingProse(localized, normalizePlatformNames)
  }
  try {
    assertGeneratedMarkdownStructure(current, candidate, locale)
  } catch {
    return undefined
  }
  return candidate
}

/** Match naming-only changes within the exact unchanged neighbors, rejecting ambiguous repeated prose. */
export function namingOnlyDeltaTranslations(
  previous: string,
  current: string,
  localized: string,
  locale: DocsLocale,
): Map<number, { previousUnit: number; translation: string }> {
  const plan = planTranslationDelta(previous, current)
  const units = (text: string) =>
    markdownTranslationUnits(addStableHeadingAnchors(splitTranslationDocument(text).body)).filter(
      (unit) => unit.translate,
    )
  const oldUnits = units(previous)
  const localUnits = units(localized)
  if (localUnits.length !== oldUnits.length) throw new Error('Previous translated prose inventory is misaligned')
  const output = new Map<number, { previousUnit: number; translation: string }>()
  const used = new Set(plan.units.flatMap((unit) => (unit.previousUnit === null ? [] : [unit.previousUnit])))
  for (const [index, unit] of plan.units.entries()) {
    if (unit.previousUnit !== null) continue
    const before = plan.units.slice(0, index).findLast((entry) => entry.previousUnit !== null)?.previousUnit ?? 0
    const after =
      plan.units.slice(index + 1).find((entry) => entry.previousUnit !== null)?.previousUnit ?? oldUnits.length + 1
    const matches: Array<{ previousUnit: number; translation: string }> = []
    for (let position = before + 1; position < after; position += 1) {
      if (used.has(position)) continue
      const translation = reuseNamingOnlyTranslation(
        oldUnits[position - 1].content,
        unit.english,
        localUnits[position - 1].content,
        locale,
      )
      if (translation !== undefined) matches.push({ previousUnit: position, translation })
    }
    if (matches.length === 1) {
      output.set(unit.unit, matches[0])
      used.add(matches[0].previousUnit)
    }
  }
  return output
}

/** Align exact prose units; repeated paragraphs keep their order and individual translations. */
export function planTranslationDelta(previous: string, current: string): TranslationDelta {
  const prose = (content: string) =>
    markdownTranslationUnits(addStableHeadingAnchors(splitTranslationDocument(content).body))
      .filter((unit) => unit.translate)
      .map((unit) => unit.content)
  const oldUnits = prose(previous)
  const newUnits = prose(current)
  const lengths = Array.from({ length: oldUnits.length + 1 }, () => new Uint32Array(newUnits.length + 1))
  for (let i = oldUnits.length - 1; i >= 0; i -= 1) {
    for (let j = newUnits.length - 1; j >= 0; j -= 1) {
      lengths[i][j] =
        oldUnits[i] === newUnits[j] ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1])
    }
  }
  const retained = new Map<number, number>()
  let i = 0
  let j = 0
  while (i < oldUnits.length && j < newUnits.length) {
    if (oldUnits[i] === newUnits[j]) {
      retained.set(j++, i++)
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) i += 1
    else j += 1
  }
  return {
    previousHash: translationSourceHash(previous),
    currentHash: translationSourceHash(current),
    previousUnitCount: oldUnits.length,
    units: newUnits.map((english, index) => ({
      unit: index + 1,
      english,
      previousUnit: retained.has(index) ? retained.get(index)! + 1 : null,
    })),
  }
}

/** Build a candidate from current English structure and exact retained localized prose. Does not write files. */
export function assembleTranslationDelta(
  previous: string,
  current: string,
  localized: string,
  locale: DocsLocale,
  translations: ReadonlyMap<number, string>,
  engine: string,
): string {
  const delta = planTranslationDelta(previous, current)
  const original = splitTranslationDocument(localized)
  if (!original.prefix.includes(`translation_locale: ${locale.key}\n`)) throw new Error('Locale metadata mismatch')
  if (!original.prefix.includes(`translation_source_hash: ${delta.previousHash}\n`)) {
    throw new Error('Previous translation does not match the supplied English baseline')
  }
  if (splitTranslationDocument(previous).prefix !== splitTranslationDocument(current).prefix) {
    throw new Error('Changed English frontmatter requires a separate reviewed translation')
  }
  const oldUnits = markdownTranslationUnits(original.body).filter((unit) => unit.translate)
  if (oldUnits.length !== delta.previousUnitCount) throw new Error('Previous translated prose inventory is misaligned')
  const expected = new Set(delta.units.filter((unit) => unit.previousUnit === null).map((unit) => unit.unit))
  for (const key of translations.keys()) {
    if (!expected.has(key)) throw new Error(`Replacement for unchanged or nonexistent unit ${key}`)
  }
  const body = addStableHeadingAnchors(splitTranslationDocument(current).body)
  let index = 0
  const translated = markdownTranslationUnits(body)
    .map((part) => {
      if (!part.translate) return part.content
      const unit = delta.units[index++]
      const value = unit.previousUnit === null ? translations.get(unit.unit) : oldUnits[unit.previousUnit - 1].content
      if (value === undefined) throw new Error(`Missing translation for changed unit ${unit.unit}`)
      assertGeneratedMarkdownStructure(unit.english, value, locale)
      const marker = (text: string) => /^(\s*(?:[-+*]|\d+[.)]))\s/u.exec(text)?.[1] ?? null
      if (marker(unit.english) !== marker(value)) throw new Error(`List marker drift in unit ${unit.unit}`)
      const cells = (text: string) =>
        /^\s*\|/u.test(text) ? text.replace(/`[^`]*`/gu, '').split(/(?<!\\)\|/u).length : 0
      if (cells(unit.english) !== cells(value)) throw new Error(`Table cell drift in unit ${unit.unit}`)
      return value
    })
    .join('')
  assertGeneratedMarkdownStructure(body, translated, locale)
  let prefix = original.prefix.replace(
    /^translation_source_hash: .*$/mu,
    `translation_source_hash: ${delta.currentHash}`,
  )
  if (!/^[\w.+-]+$/u.test(engine)) throw new Error('Invalid translation engine label')
  prefix = prefix.replace(
    /^translation_engine: (.*)$/mu,
    (_, value: string) => `translation_engine: ${[...new Set([...value.split('+'), engine])].join('+')}`,
  )
  return prefix + translated
}

/** Validate a candidate in isolation, including semantic, script, ratio, and English-run guards. */
export async function validateTranslationDelta(
  english: string,
  candidate: string,
  route: string,
  locale: DocsLocale,
): Promise<string[]> {
  if (path.isAbsolute(route) || route.split('/').includes('..')) throw new Error('Invalid translation route')
  const root = await mkdtemp(path.join(tmpdir(), 'iroha-docs-delta-check-'))
  try {
    const source = path.join(root, route)
    const target = path.join(root, locale.path, route)
    await mkdir(path.dirname(source), { recursive: true })
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(source, english)
    await writeFile(target, candidate)
    const errors = await validateI18n({ sourceRoot: root, locales: [locale] })
    const sourceUnits = markdownTranslationUnits(splitTranslationDocument(english).body).filter(
      (unit) => unit.translate,
    )
    const targetUnits = markdownTranslationUnits(splitTranslationDocument(candidate).body).filter(
      (unit) => unit.translate,
    )
    for (let index = 0; index < sourceUnits.length; index += 1) {
      const runs = auditableUntranslatedEnglishRuns(
        locale.key,
        sourceUnits[index].content,
        targetUnits[index]?.content ?? '',
      )
      if (runs.length) errors.push(`${locale.key}/${route}: unit ${index + 1} untranslated English: ${runs.join(', ')}`)
    }
    return errors
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

/** Apply only a fully validated candidate, rejecting changes made while translation was running. */
export async function publishTranslationDelta(options: {
  sourceRoot: string
  route: string
  locale: DocsLocale
  english: string
  previousTranslation: string
  candidate: string
}): Promise<void> {
  const { sourceRoot, route, locale, english, previousTranslation, candidate } = options
  const errors = await validateTranslationDelta(english, candidate, route, locale)
  if (errors.length) throw new Error(errors.join('\n'))
  const target = path.join(sourceRoot, locale.path, route)
  if ((await readFile(path.join(sourceRoot, route), 'utf8')) !== english)
    throw new Error('English changed during translation')
  if ((await readFile(target, 'utf8')) !== previousTranslation) throw new Error('Translation changed during review')
  const staging = await mkdtemp(path.join(path.dirname(target), '.delta-'))
  try {
    const staged = path.join(staging, 'candidate.md')
    await writeFile(staged, candidate)
    await rename(staged, target)
  } finally {
    await rm(staging, { recursive: true, force: true })
  }
}
