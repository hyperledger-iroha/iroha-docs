import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { ROOT_LOCALE, TRANSLATED_LOCALES } from './locales'

const componentSource = readFileSync(
  new URL('../.vitepress/theme/components/ShareFeedback.vue', import.meta.url),
  'utf8',
)

describe('localized feedback dialog', () => {
  test('reads every visible string from the active locale', () => {
    expect(componentSource).toContain('localeForLanguage(lang.value).feedback')
    for (const key of Object.keys(ROOT_LOCALE.feedback)) {
      expect(componentSource).toMatch(new RegExp(`labels(?:\\.value)?\\.${key}`, 'u'))
    }
  })

  test('uses direction-neutral spacing and logical action alignment', () => {
    expect(componentSource).not.toContain('space-x-')
    expect(componentSource).toContain('items-center justify-end gap-2')
  })

  test.each(['ar', 'he', 'ur'])('provides complete feedback labels for RTL locale %s', (localeKey) => {
    const locale = TRANSLATED_LOCALES.find(({ key }) => key === localeKey)
    expect(locale?.direction).toBe('rtl')
    expect(Object.values(locale?.feedback ?? {}).every((label) => label.trim().length > 0)).toBe(true)
  })
})
