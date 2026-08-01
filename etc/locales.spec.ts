import { describe, expect, test } from 'vitest'
import {
  ALL_LOCALES,
  alternateLocaleHead,
  documentHead,
  englishRelativePath,
  localeForRelativePath,
  publishedUrl,
  ROOT_LOCALE,
  TRANSLATED_LOCALES,
} from './locales'

describe('locale registry', () => {
  test('defines English plus exactly twenty translated locales', () => {
    expect(TRANSLATED_LOCALES).toHaveLength(20)
    expect(ALL_LOCALES).toHaveLength(21)
    expect(new Set(ALL_LOCALES.map((locale) => locale.key)).size).toBe(21)
    expect(new Set(ALL_LOCALES.map((locale) => locale.lang)).size).toBe(21)
  })

  test('marks only Arabic, Hebrew, and Urdu as right-to-left', () => {
    expect(ALL_LOCALES.filter((locale) => locale.direction === 'rtl').map((locale) => locale.key)).toEqual([
      'ar',
      'ur',
      'he',
    ])
  })

  test('localizes the cookbook nav and unlinked sidebar group labels', () => {
    const groupKeys = Object.keys(ROOT_LOCALE.navigation.cookbookGroups) as Array<
      keyof typeof ROOT_LOCALE.navigation.cookbookGroups
    >

    for (const locale of TRANSLATED_LOCALES) {
      expect(locale.navigation.cookbook).not.toBe(ROOT_LOCALE.navigation.cookbook)
      for (const key of groupKeys) {
        expect(locale.navigation.cookbookGroups[key]).not.toBe(ROOT_LOCALE.navigation.cookbookGroups[key])
      }
    }
  })
})

describe('locale routes', () => {
  test('maps a translated source path back to its English route', () => {
    expect(englishRelativePath('fr/guide/index.md')).toBe('guide/index.md')
    expect(localeForRelativePath('fr/guide/index.md').key).toBe('fr')
    expect(localeForRelativePath('guide/index.md')).toBe(ROOT_LOCALE)
  })

  test('keeps index URLs slash-terminated and detail URLs explicit', () => {
    const french = TRANSLATED_LOCALES.find((locale) => locale.key === 'fr')
    expect(french).toBeDefined()
    expect(publishedUrl('guide/index.md', ROOT_LOCALE)).toBe('https://docs.iroha.tech/guide/')
    expect(publishedUrl('fr/guide/install.md', french!)).toBe('https://docs.iroha.tech/fr/guide/install.html')
  })

  test('emits all hreflang alternatives, x-default, and a canonical URL', () => {
    const head = alternateLocaleHead('ar/reference/index.md')
    const alternates = head.filter((entry) => entry[1].rel === 'alternate')
    const canonical = head.find((entry) => entry[1].rel === 'canonical')

    expect(alternates).toHaveLength(22)
    expect(alternates.some((entry) => entry[1].hreflang === 'x-default')).toBe(true)
    expect(canonical?.[1].href).toBe('https://docs.iroha.tech/ar/reference/')
  })

  test('marks the generated 404 page noindex without nonexistent locale alternates', () => {
    expect(documentHead('404.md')).toEqual([['meta', { name: 'robots', content: 'noindex, nofollow' }]])
  })
})
