import { describe, expect, test } from 'vitest'
import {
  ALL_LOCALES,
  alternateLocaleHead,
  documentHead,
  englishRelativePath,
  localeForLanguage,
  localeForRelativePath,
  publishedUrl,
  ROOT_LOCALE,
  SEARCH_LOCALES,
  SITE_LOCALES,
  TRANSLATED_LOCALES,
} from './locales'

function localizedUiStrings(locale: (typeof ALL_LOCALES)[number]): string[] {
  const strings: string[] = []
  const collect = (value: unknown): void => {
    if (typeof value === 'string') {
      strings.push(value)
      return
    }
    if (value && typeof value === 'object') Object.values(value).forEach(collect)
  }

  collect(locale.navigation)
  collect(locale.search)
  collect(locale.theme)
  collect(locale.feedback)
  return strings
}

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

  test('exports canonical language and direction metadata to VitePress', () => {
    const expectedMetadata = {
      root: ['en', 'ltr'],
      es: ['es', 'ltr'],
      pt: ['pt', 'ltr'],
      fr: ['fr', 'ltr'],
      ru: ['ru', 'ltr'],
      ar: ['ar', 'rtl'],
      ur: ['ur', 'rtl'],
      ja: ['ja', 'ltr'],
      he: ['he', 'rtl'],
      my: ['my', 'ltr'],
      ka: ['ka', 'ltr'],
      hy: ['hy', 'ltr'],
      az: ['az', 'ltr'],
      kk: ['kk', 'ltr'],
      ba: ['ba', 'ltr'],
      am: ['am', 'ltr'],
      dz: ['dz', 'ltr'],
      uz: ['uz', 'ltr'],
      mn: ['mn', 'ltr'],
      'zh-hant': ['zh-Hant', 'ltr'],
      'zh-hans': ['zh-Hans', 'ltr'],
    } as const

    expect(Object.fromEntries(ALL_LOCALES.map(({ key, lang, direction }) => [key, [lang, direction]]))).toEqual(
      expectedMetadata,
    )
    for (const locale of ALL_LOCALES) {
      expect(SITE_LOCALES[locale.key]?.lang).toBe(locale.lang)
      expect(SITE_LOCALES[locale.key]?.dir).toBe(locale.direction)
    }
  })

  test('defines exactly sixty-six localized UI strings for every locale', () => {
    const navigationKeys = Object.keys(ROOT_LOCALE.navigation)
    const searchKeys = Object.keys(ROOT_LOCALE.search)
    const themeKeys = Object.keys(ROOT_LOCALE.theme)
    const sidebarGroupKeys = Object.keys(ROOT_LOCALE.theme.sidebarGroups)
    const feedbackKeys = Object.keys(ROOT_LOCALE.feedback)

    for (const locale of ALL_LOCALES) {
      expect(Object.keys(locale.navigation)).toEqual(navigationKeys)
      expect(Object.keys(locale.navigation.cookbookGroups)).toEqual(Object.keys(ROOT_LOCALE.navigation.cookbookGroups))
      expect(Object.keys(locale.search)).toEqual(searchKeys)
      expect(Object.keys(locale.theme)).toEqual(themeKeys)
      expect(Object.keys(locale.theme.sidebarGroups)).toEqual(sidebarGroupKeys)
      expect(Object.keys(locale.feedback)).toEqual(feedbackKeys)
      expect(localizedUiStrings(locale)).toHaveLength(66)
      expect(localizedUiStrings(locale).every((label) => label.trim() === label && label.length > 0)).toBe(true)
    }
  })

  test('keeps every non-Latin UI label in its locale primary script', () => {
    const primaryScripts: Readonly<Record<string, RegExp>> = {
      ru: /\p{Script=Cyrillic}/u,
      ar: /\p{Script=Arabic}/u,
      ur: /\p{Script=Arabic}/u,
      ja: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
      he: /\p{Script=Hebrew}/u,
      my: /\p{Script=Myanmar}/u,
      ka: /\p{Script=Georgian}/u,
      hy: /\p{Script=Armenian}/u,
      kk: /\p{Script=Cyrillic}/u,
      ba: /\p{Script=Cyrillic}/u,
      am: /\p{Script=Ethiopic}/u,
      dz: /\p{Script=Tibetan}/u,
      mn: /\p{Script=Cyrillic}/u,
      'zh-hant': /\p{Script=Han}/u,
      'zh-hans': /\p{Script=Han}/u,
    }

    for (const [localeKey, script] of Object.entries(primaryScripts)) {
      const locale = TRANSLATED_LOCALES.find(({ key }) => key === localeKey)!
      for (const label of localizedUiStrings(locale)) expect(label).toMatch(script)
    }
  })

  test('preserves product names in localized UI copy', () => {
    for (const locale of ALL_LOCALES) {
      expect(locale.theme.editLink).toContain('GitHub')
      expect(locale.feedback.bugPlaceholder).toContain('Iroha 3')
      expect(locale.feedback.description).toContain('Iroha 3')
      expect(locale.feedback.contactPlaceholder).toContain('Discord')
      expect(locale.feedback.contactPlaceholder).toContain('Telegram')
    }
  })

  test('keeps reviewed technical UI terms distinct from common false friends', () => {
    const locale = (key: string) => TRANSLATED_LOCALES.find((candidate) => candidate.key === key)!

    expect(locale('ur').navigation.architecture).toBe('معماری')
    expect(locale('my').navigation.architecture).toBe('စနစ်ဖွဲ့စည်းပုံ')
    expect(locale('hy').navigation.cookbookGroups.appPatterns).toBe('Հավելվածների նախագծման ձևանմուշներ')
    expect(locale('kk').navigation.cookbookGroups.accessAndAutomation).toBe('Қол жеткізу және автоматтандыру')
    expect(locale('ba').navigation.cookbookGroups.accessAndAutomation).toBe('Инеү һәм автоматлаштырыу')
    expect(locale('am').navigation.architecture).toBe('የሥርዓት ንድፍ')
    expect(locale('uz').navigation.cookbookGroups.appPatterns).toBe('Ilova dizayni namunalari')
    expect(locale('mn').theme.sidebarGroups.transactionsAndQueries).toBe('Гүйлгээ ба асуулгууд')
    expect(locale('zh-hant').theme.sidebarGroups.operatorQuickLinks).toBe('維運人員快速連結')
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

  test('defines translated sidebar and standard theme labels for every locale', () => {
    const groupKeys = Object.keys(ROOT_LOCALE.theme.sidebarGroups) as Array<
      keyof typeof ROOT_LOCALE.theme.sidebarGroups
    >
    const requiredThemeKeys = [
      'editLink',
      'lastUpdated',
      'outline',
      'skipToContent',
      'mainNavigation',
      'sidebarNavigation',
      'pager',
      'mobileNavigation',
      'extraNavigation',
      'toggleSection',
      'permalinkTo',
      'copyCode',
      'copied',
    ] as const

    for (const locale of TRANSLATED_LOCALES) {
      for (const key of groupKeys) {
        expect(locale.theme.sidebarGroups[key].trim()).not.toBe('')
        expect(locale.theme.sidebarGroups[key]).not.toBe(ROOT_LOCALE.theme.sidebarGroups[key])
      }
      for (const key of requiredThemeKeys) {
        expect(locale.theme[key].trim()).not.toBe('')
        expect(locale.theme[key]).not.toBe(ROOT_LOCALE.theme[key])
      }
    }
  })

  test('defines every feedback-dialog label in every locale', () => {
    const feedbackKeys = Object.keys(ROOT_LOCALE.feedback) as Array<keyof typeof ROOT_LOCALE.feedback>

    expect(feedbackKeys).toHaveLength(18)
    for (const locale of ALL_LOCALES) {
      expect(Object.keys(locale.feedback)).toEqual(feedbackKeys)
      for (const key of feedbackKeys) {
        expect(locale.feedback[key].trim()).not.toBe('')
      }
    }

    for (const locale of TRANSLATED_LOCALES) {
      let localizedLabelCount = 0
      for (const key of feedbackKeys) {
        if (locale.feedback[key] !== ROOT_LOCALE.feedback[key]) localizedLabelCount += 1
      }
      // Cognates such as French “Suggestion” can be spelled exactly like English.
      expect(localizedLabelCount).toBeGreaterThanOrEqual(feedbackKeys.length - 1)
    }
  })

  test('defines and exports complete local-search translations', () => {
    const searchKeys = Object.keys(ROOT_LOCALE.search) as Array<keyof typeof ROOT_LOCALE.search>

    expect(searchKeys).toHaveLength(12)
    for (const locale of ALL_LOCALES) {
      expect(Object.keys(locale.search)).toEqual(searchKeys)
      for (const key of searchKeys) {
        expect(locale.search[key].trim()).not.toBe('')
      }

      expect(SEARCH_LOCALES[locale.key]).toEqual({
        translations: {
          button: {
            buttonText: locale.search.buttonText,
            buttonAriaLabel: locale.search.buttonText,
          },
          modal: {
            displayDetails: locale.search.displayDetails,
            resetButtonTitle: locale.search.resetButtonTitle,
            backButtonTitle: locale.search.backButtonTitle,
            noResultsText: locale.search.noResultsText,
            footer: {
              selectText: locale.search.selectText,
              selectKeyAriaLabel: locale.search.selectKeyAriaLabel,
              navigateText: locale.search.navigateText,
              navigateUpKeyAriaLabel: locale.search.navigateUpKeyAriaLabel,
              navigateDownKeyAriaLabel: locale.search.navigateDownKeyAriaLabel,
              closeText: locale.search.closeText,
              closeKeyAriaLabel: locale.search.closeKeyAriaLabel,
            },
          },
        },
      })
    }

    for (const locale of TRANSLATED_LOCALES) {
      for (const key of searchKeys) {
        expect(locale.search[key]).not.toBe(ROOT_LOCALE.search[key])
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

  test('resolves the active VitePress language to canonical locale metadata', () => {
    expect(localeForLanguage('ar')).toBe(TRANSLATED_LOCALES.find((locale) => locale.key === 'ar'))
    expect(localeForLanguage('zh-Hant').key).toBe('zh-hant')
    expect(localeForLanguage('unknown')).toBe(ROOT_LOCALE)
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
