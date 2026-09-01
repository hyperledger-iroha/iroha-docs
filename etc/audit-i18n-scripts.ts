import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { isPreservedTechnicalLinkLabel, markdownTranslationUnits } from './translate'

const EXPECTED_SCRIPT: Readonly<Record<string, string>> = {
  es: 'Latin',
  pt: 'Latin',
  fr: 'Latin',
  ru: 'Cyrillic',
  ar: 'Arabic',
  ur: 'Arabic',
  ja: 'Japanese',
  he: 'Hebrew',
  my: 'Myanmar',
  ka: 'Georgian',
  hy: 'Armenian',
  az: 'Latin',
  kk: 'Cyrillic',
  ba: 'Cyrillic',
  am: 'Ethiopic',
  dz: 'Tibetan',
  uz: 'Latin',
  mn: 'Cyrillic',
  'zh-hant': 'Han',
  'zh-hans': 'Han',
}

const SCRIPT_PATTERNS: Readonly<Record<string, RegExp>> = {
  Arabic: /\p{Script=Arabic}/u,
  Armenian: /\p{Script=Armenian}/u,
  Bengali: /\p{Script=Bengali}/u,
  Cherokee: /\p{Script=Cherokee}/u,
  Coptic: /\p{Script=Coptic}/u,
  Cyrillic: /\p{Script=Cyrillic}/u,
  Devanagari: /\p{Script=Devanagari}/u,
  Ethiopic: /\p{Script=Ethiopic}/u,
  Georgian: /\p{Script=Georgian}/u,
  Greek: /\p{Script=Greek}/u,
  Gujarati: /\p{Script=Gujarati}/u,
  Gurmukhi: /\p{Script=Gurmukhi}/u,
  Han: /\p{Script=Han}/u,
  Hebrew: /\p{Script=Hebrew}/u,
  Hiragana: /\p{Script=Hiragana}/u,
  Kannada: /\p{Script=Kannada}/u,
  Katakana: /\p{Script=Katakana}/u,
  Khmer: /\p{Script=Khmer}/u,
  Lao: /\p{Script=Lao}/u,
  Malayalam: /\p{Script=Malayalam}/u,
  Mongolian: /\p{Script=Mongolian}/u,
  Myanmar: /\p{Script=Myanmar}/u,
  Ol_Chiki: /\p{Script=Ol_Chiki}/u,
  Oriya: /\p{Script=Oriya}/u,
  Sinhala: /\p{Script=Sinhala}/u,
  Syriac: /\p{Script=Syriac}/u,
  Tamil: /\p{Script=Tamil}/u,
  Telugu: /\p{Script=Telugu}/u,
  Thai: /\p{Script=Thai}/u,
  Tibetan: /\p{Script=Tibetan}/u,
}

const HIGH_RATIO_LIMITS: Readonly<Record<string, number>> = {
  es: 1.65,
  pt: 1.45,
  fr: 1.65,
  ru: 1.65,
  ar: 1.25,
  ur: 1.32,
  ja: 0.85,
  he: 1.08,
  my: 1.08,
  ka: 1.65,
  hy: 1.7,
  az: 1.65,
  kk: 1.6,
  ba: 1.55,
  am: 1,
  dz: 1.2,
  uz: 1.75,
  mn: 1.58,
  'zh-hant': 0.7,
  'zh-hans': 0.7,
}

const ENGLISH_LEAKAGE_WORDS = new Set([
  'after',
  'all',
  'and',
  'are',
  'before',
  'checked',
  'build',
  'can',
  'cannot',
  'code',
  'config',
  'configuration',
  'create',
  'creates',
  'default',
  'deployment',
  'directory',
  'disabled',
  'do',
  'enable',
  'exact',
  'fault',
  'feature',
  'flow',
  'flows',
  'for',
  'from',
  'functional',
  'generated',
  'governance',
  'identities',
  'identity',
  'if',
  'independent',
  'infrastructure',
  'is',
  'key',
  'keys',
  'local',
  'logs',
  'must',
  'not',
  'only',
  'or',
  'peer',
  'peers',
  'performance',
  'privacy',
  'production',
  'profile',
  'published',
  'real',
  'release',
  'review',
  'run',
  'runtime',
  'should',
  'signer',
  'stateful',
  'storage',
  'that',
  'the',
  'then',
  'these',
  'this',
  'those',
  'to',
  'trusted',
  'use',
  'uses',
  'using',
  'validator',
  'validators',
  'value',
  'volume',
  'volumes',
  'when',
  'while',
  'will',
  'with',
  'without',
])

const ASCII_WORD_SOURCE = String.raw`(?<![\p{L}\p{M}])[A-Za-z]+(?![\p{L}\p{M}])`
function asciiWords(content: string): string[] {
  return [...content.matchAll(new RegExp(ASCII_WORD_SOURCE, 'gu'))]
    .filter((match) => {
      const start = match.index ?? 0
      const end = start + match[0].length
      const joinedOnLeft = start >= 2 && /[-'’]/u.test(content[start - 1]) && /[A-Za-z]/u.test(content[start - 2])
      const joinedOnRight = /[-'’]/u.test(content[end] ?? '') && /[A-Za-z]/u.test(content[end + 1] ?? '')
      return !joinedOnLeft && !joinedOnRight
    })
    .map((match) => match[0])
}

export function englishLeakageWords(sourceContent: string, targetContent: string): string[] {
  if (/^\s*<<<\s+\S+\s*$/u.test(sourceContent) && sourceContent === targetContent) return []
  const sourceWords = new Set(asciiWords(visibleProse(sourceContent)).map((word) => word.toLocaleLowerCase()))
  return [
    ...new Set(
      asciiWords(visibleProse(targetContent))
        .map((word) => word.toLocaleLowerCase())
        .filter((word) => sourceWords.has(word) && ENGLISH_LEAKAGE_WORDS.has(word)),
    ),
  ].sort()
}

const LOCALE_NATIVE_ASCII_WORDS: Readonly<Record<string, ReadonlySet<string>>> = {
  az: new Set(['real']),
  es: new Set(['local', 'real', 'use']),
  fr: new Set([
    'code',
    'configuration',
    'exact',
    'infrastructure',
    'local',
    'performance',
    'production',
    'volume',
    'volumes',
  ]),
  pt: new Set(['do', 'for', 'local', 'logs', 'real', 'use', 'volume', 'volumes']),
}

export function auditableEnglishLeakageWords(
  locale: string,
  sourceContent: string,
  targetContent: string,
): string[] {
  const nativeWords = LOCALE_NATIVE_ASCII_WORDS[locale] ?? new Set<string>()
  return englishLeakageWords(sourceContent, targetContent).filter((word) => !nativeWords.has(word))
}

export function untranslatedEnglishRuns(sourceContent: string, targetContent: string): string[] {
  if (/^\s*<<<\s+\S+\s*$/u.test(sourceContent) && sourceContent === targetContent) return []
  const sourceVisible = visibleProse(sourceContent)
  const targetVisible = visibleProse(targetContent)
  const words = [...targetVisible.matchAll(new RegExp(ASCII_WORD_SOURCE, 'gu'))]
  const candidates = new Set<string>()

  for (let start = 0; start < words.length; start += 1) {
    const runWords = [words[start][0]]
    let previousEnd = (words[start].index ?? 0) + words[start][0].length
    for (let end = start + 1; end < words.length && runWords.length < 8; end += 1) {
      const nextStart = words[end].index ?? 0
      if (!/^[ \t]+$/u.test(targetVisible.slice(previousEnd, nextStart))) break
      runWords.push(words[end][0])
      previousEnd = nextStart + words[end][0].length
      if (!runWords.some((word) => ENGLISH_LEAKAGE_WORDS.has(word.toLocaleLowerCase()))) continue
      const run = runWords.join(' ')
      const escaped = run.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&').replace(/ /gu, '[ \\t]+')
      if (new RegExp(`(?<![\\p{L}\\p{M}])${escaped}(?![\\p{L}\\p{M}])`, 'iu').test(sourceVisible)) {
        candidates.add(run)
      }
    }
  }

  return [...candidates]
    .filter((candidate) => {
      const padded = ` ${candidate.toLocaleLowerCase()} `
      return ![...candidates].some((other) => other !== candidate && ` ${other.toLocaleLowerCase()} `.includes(padded))
    })
    .sort()
}

export function auditableUntranslatedEnglishRuns(
  locale: string,
  sourceContent: string,
  targetContent: string,
): string[] {
  return untranslatedEnglishRuns(sourceContent, targetContent).filter(
    (run) => !(['es', 'pt'].includes(locale) && /^use\b/iu.test(run)),
  )
}

async function markdownFiles(root: string, relative = ''): Promise<string[]> {
  const output: string[] = []
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    const child = path.join(relative, entry.name)
    if (entry.isDirectory()) output.push(...(await markdownFiles(root, child)))
    else if (entry.name.endsWith('.md')) output.push(child)
  }
  return output
}

function visibleProse(content: string): string {
  return content
    .replace(/^---[\s\S]*?---/u, ' ')
    .replace(/`[^`]*`/gu, ' ')
    .replace(/\]\([^)]*\)/gu, ']')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/https?:\/\/\S+/gu, ' ')
    .replace(/\{#[^}]+\}/gu, ' ')
    .replace(/\\\([\s\S]*?\\\)/gu, ' ')
    .replace(/\$[^$\n]+\$/gu, ' ')
}

function bodyWithoutFrontmatter(content: string): string {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, '')
}

function letterCount(content: string): number {
  return [...visibleProse(content).matchAll(/\p{L}/gu)].length
}

function markdownLinkLabels(content: string): string[] {
  const prose = markdownTranslationUnits(bodyWithoutFrontmatter(content))
    .filter((unit) => unit.translate)
    .map((unit) => unit.content)
    .join('\n')
    .replace(/`[^`]*`/gu, ' ')
  return [...prose.matchAll(/!?\[([^\]\n]*)\]\(\s*(?:<[^>\n]+>|[^\s)\n]+)/gu)].map((match) => match[1].trim())
}

async function main(): Promise<void> {
  const uniqueOnly = process.argv.includes('--unique')
  const ratiosOnly = process.argv.includes('--ratios')
  const highRatiosOnly = process.argv.includes('--high-ratios')
  const englishLeakageOnly = process.argv.includes('--english-leakage')
  const englishRunsOnly = process.argv.includes('--english-runs')
  const linkLabelsOnly = process.argv.includes('--link-labels')
  if ([ratiosOnly, highRatiosOnly, englishLeakageOnly, englishRunsOnly, linkLabelsOnly].filter(Boolean).length > 1) {
    throw new Error('Choose only one of --ratios, --high-ratios, --english-leakage, --english-runs, or --link-labels')
  }
  const ratioAudit = ratiosOnly || highRatiosOnly
  const requested = process.argv.slice(2).filter((argument) => !argument.startsWith('--'))
  const locales = requested.length > 0 ? requested : Object.keys(EXPECTED_SCRIPT)
  let findingCount = 0
  for (const locale of locales) {
    const expected = EXPECTED_SCRIPT[locale]
    if (!expected) throw new Error(`Unsupported locale: ${locale}`)
    const findings: object[] = []
    const root = path.join('src', locale)
    for (const relative of await markdownFiles(root)) {
      const content = await readFile(path.join(root, relative), 'utf8')
      if (linkLabelsOnly) {
        const english = await readFile(path.join('src', relative), 'utf8')
        const sourceLabels = markdownLinkLabels(english)
        const targetLabels = markdownLinkLabels(content)
        for (let index = 0; index < Math.min(sourceLabels.length, targetLabels.length); index += 1) {
          const label = sourceLabels[index]
          if (label !== targetLabels[index]) continue
          if (isPreservedTechnicalLinkLabel(label)) continue
          const asciiLetters = [...label.matchAll(/[A-Za-z]/gu)].length
          const asciiWords = label.match(/[A-Za-z]{2,}/gu)?.length ?? 0
          if (asciiLetters < 8 || asciiWords < 2) continue
          findings.push({ route: relative, link: index + 1, label })
        }
        continue
      }
      if (ratioAudit || englishLeakageOnly || englishRunsOnly) {
        const english = await readFile(path.join('src', relative), 'utf8')
        const sourceUnits = markdownTranslationUnits(bodyWithoutFrontmatter(english)).filter((unit) => unit.translate)
        const targetUnits = markdownTranslationUnits(bodyWithoutFrontmatter(content)).filter((unit) => unit.translate)
        for (let index = 0; index < Math.min(sourceUnits.length, targetUnits.length); index += 1) {
          if (englishLeakageOnly) {
            const leakedWords = auditableEnglishLeakageWords(
              locale,
              sourceUnits[index].content,
              targetUnits[index].content,
            )
            if (leakedWords.length > 0) {
              findings.push({
                route: relative,
                unit: index + 1,
                words: leakedWords,
                source: visibleProse(sourceUnits[index].content).slice(0, 280).replace(/\n/gu, ' '),
                target: visibleProse(targetUnits[index].content).slice(0, 280).replace(/\n/gu, ' '),
              })
            }
            continue
          }
          if (englishRunsOnly) {
            const sourceVisible = visibleProse(sourceUnits[index].content)
            const runs = auditableUntranslatedEnglishRuns(
              locale,
              sourceUnits[index].content,
              targetUnits[index].content,
            )
            if (runs.length > 0) {
              findings.push({
                route: relative,
                unit: index + 1,
                runs,
                source: sourceVisible.slice(0, 280).replace(/\n/gu, ' '),
                target: visibleProse(targetUnits[index].content).slice(0, 280).replace(/\n/gu, ' '),
              })
            }
            continue
          }
          const sourceLetters = letterCount(sourceUnits[index].content)
          if (sourceLetters < 60) continue
          const targetLetters = letterCount(targetUnits[index].content)
          const ratio = targetLetters / sourceLetters
          const minimum = ['ja', 'zh-hans', 'zh-hant'].includes(locale)
            ? 0.25
            : ['ar', 'ur', 'he', 'my', 'am', 'dz'].includes(locale)
              ? 0.55
              : 0.7
          const maximum = HIGH_RATIO_LIMITS[locale]
          if ((ratiosOnly && ratio < minimum) || (highRatiosOnly && ratio > maximum)) {
            findings.push({
              route: relative,
              unit: index + 1,
              ratio: Number(ratio.toFixed(2)),
              source: visibleProse(sourceUnits[index].content).slice(0, 280).replace(/\n/gu, ' '),
              target: visibleProse(targetUnits[index].content).slice(0, 280).replace(/\n/gu, ' '),
            })
          }
        }
        continue
      }
      const units = markdownTranslationUnits(content).filter((unit) => unit.translate)
      for (const [index, unit] of units.entries()) {
        const visible = visibleProse(unit.content)
        for (const [name, pattern] of Object.entries(SCRIPT_PATTERNS)) {
          const allowed =
            name === expected || (expected === 'Japanese' && ['Han', 'Hiragana', 'Katakana'].includes(name))
          if (allowed) continue
          const sequences = visible.match(new RegExp(`(?:(?:${pattern.source})\\p{M}*)+`, 'gu')) ?? []
          if (sequences.length === 0) continue
          findings.push({
            route: relative,
            unit: index + 1,
            script: name,
            sequences: [...new Set(sequences)],
            text: visible.slice(0, 240).replace(/\n/gu, ' '),
          })
        }
      }
    }
    findingCount += findings.length
    const findingLabel = ratiosOnly
      ? 'low-ratio'
      : highRatiosOnly
        ? 'high-ratio'
        : englishLeakageOnly
          ? 'english-leakage'
          : englishRunsOnly
            ? 'english-runs'
            : linkLabelsOnly
              ? 'link-labels'
              : 'unexpected'
    console.log(`LOCALE ${locale} ${findingLabel}=${findings.length}`)
    if (uniqueOnly) {
      const sequences = new Set<string>()
      for (const finding of findings as Array<{ script: string; sequences: string[] }>) {
        for (const sequence of finding.sequences) sequences.add(`${finding.script}\t${sequence}`)
      }
      for (const sequence of [...sequences].sort()) console.log(sequence)
    } else {
      for (const finding of findings) console.log(JSON.stringify(finding))
    }
  }
  if (findingCount > 0) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) void main()
