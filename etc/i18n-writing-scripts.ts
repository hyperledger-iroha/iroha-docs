import type { DocsLocale } from './locales'

const EXPECTED_WRITING_SCRIPTS: Readonly<Record<string, readonly string[]>> = {
  es: ['Latin'],
  pt: ['Latin'],
  fr: ['Latin'],
  ru: ['Cyrillic'],
  ar: ['Arabic'],
  ur: ['Arabic'],
  ja: ['Han', 'Hiragana', 'Katakana'],
  he: ['Hebrew'],
  my: ['Myanmar'],
  ka: ['Georgian'],
  hy: ['Armenian'],
  az: ['Latin'],
  kk: ['Cyrillic'],
  ba: ['Cyrillic'],
  am: ['Ethiopic'],
  dz: ['Tibetan'],
  uz: ['Latin'],
  mn: ['Cyrillic'],
  'zh-hant': ['Han'],
  'zh-hans': ['Han'],
}

const AUDITED_WRITING_SCRIPTS: Readonly<Record<string, RegExp>> = {
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

function proseVisibleForScriptAudit(content: string): string {
  return content
    .replace(/`[^`]*`/gu, ' ')
    .replace(/\]\([^)]*\)/gu, ']')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/https?:\/\/\S+/gu, ' ')
    .replace(/\{#[^}]+\}/gu, ' ')
    .replace(/\\\([\s\S]*?\\\)/gu, ' ')
    .replace(/\$[^$\n]+\$/gu, ' ')
}

/** Return foreign writing systems that leaked into visible localized prose. */
export function unexpectedWritingScripts(content: string, locale: Pick<DocsLocale, 'key'>): string[] {
  const expected = new Set(EXPECTED_WRITING_SCRIPTS[locale.key] ?? [])
  const visible = proseVisibleForScriptAudit(content)
  return Object.entries(AUDITED_WRITING_SCRIPTS)
    .filter(([script, pattern]) => !expected.has(script) && pattern.test(visible))
    .map(([script]) => script)
}
