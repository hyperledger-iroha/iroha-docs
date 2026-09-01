import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import path from 'path'
import { describe, expect, test } from 'vitest'
import { ALL_LOCALES, ROOT_LOCALE, type DocsLocale } from './locales'
import { scanBuiltLocales } from './validate-locales-build'

function localeHref(locale: DocsLocale, publicPath: string): string {
  return `${publicPath}${locale.path ? `${locale.path}/` : ''}`
}

function navigationHtml(locale: DocsLocale, publicPath: string): string {
  const prefix = localeHref(locale, publicPath)
  const links = [
    [`${prefix}get-started/`, locale.navigation.getStarted],
    [`${prefix}cookbook/`, locale.navigation.cookbook],
    [`${prefix}guide/`, locale.navigation.guides],
    [`${prefix}blockchain/iroha-explained.html`, locale.navigation.architecture],
    [`${prefix}reference/`, locale.navigation.reference],
    [`${prefix}help/`, locale.navigation.help],
  ]
  return `<nav>${links
    .map(([href, label]) => `<a class="VPNavBarMenuLink" href="${href}">${label}</a>`)
    .join('')}</nav>`
}

function localizedShellHtml(locale: DocsLocale, publicPath: string): string {
  const prefix = localeHref(locale, publicPath)
  const installLabel = locale === ROOT_LOCALE ? 'Install Iroha 3' : `localized-install-${locale.key}`
  return `<html lang="${locale.lang}" dir="${locale.direction}"><body>
    ${navigationHtml(locale, publicPath)}
    <span id="main-nav-aria-label">${locale.theme.mainNavigation}</span>
    <button class="VPNavBarHamburger" aria-label="${locale.theme.mobileNavigation}"></button>
    <div class="VPNavBarExtra"><button class="button" aria-label="${locale.theme.extraNavigation}"></button></div>
    <a class="VPSkipLink">${locale.theme.skipToContent}</a>
    <div class="VPNavBarTranslations"><button aria-label="${locale.theme.changeLanguage}"></button></div>
    <div class="VPNavBarExtra"><div class="appearance"><p class="label">${locale.theme.appearance}</p></div></div>
    <div class="VPLocalNav"><button class="menu"><span class="menu-text">${locale.theme.menu}</span></button><div class="VPLocalNavOutlineDropdown"><button>${locale.theme.returnToTop}</button></div></div>
    <aside class="VPSidebar">
      <span id="sidebar-aria-label">${locale.theme.sidebarNavigation}</span>
      <div class="VPSidebarItem"><a href="${prefix}get-started/"><span class="text">${locale.navigation.getStarted}</span></a></div>
      <div class="VPSidebarItem"><a href="${prefix}get-started/install-iroha.html"><span class="text">${installLabel}</span></a></div>
    </aside>
    <div class="VPDocAsideOutline"><div class="outline-title">${locale.theme.outline}</div></div>
    <a class="header-anchor" aria-label="${locale.theme.permalinkTo} &quot;Heading&quot;"></a>
    <footer class="VPDocFooter">
      <span id="doc-footer-aria-label">${locale.theme.pager}</span>
      <a class="edit-link-button">${locale.theme.editLink}</a>
      <p class="VPLastUpdated">${locale.theme.lastUpdated}: 2026-08-31</p>
      <a class="pager-link next"><span class="desc">${locale.theme.nextPage}</span></a>
    </footer>
  </body></html>`
}

function rootHtml(
  publicPath: string,
  options: { omittedLocale?: DocsLocale; revision?: string; wrongLabelLocale?: DocsLocale } = {},
): string {
  const links = ALL_LOCALES.filter((locale) => locale !== ROOT_LOCALE)
    .filter((locale) => locale !== options.omittedLocale)
    .map(
      (locale) =>
        `<a href="${localeHref(locale, publicPath)}">${locale === options.wrongLabelLocale ? '' : locale.label}</a>`,
    )
    .join('')

  const revision = options.revision
    ? `<head><meta name="iroha-docs-revision" content="${options.revision}"></head>`
    : ''
  return `<html lang="en" dir="ltr">${revision}<body>${navigationHtml(ROOT_LOCALE, publicPath)}<div class="VPNavBarTranslations"><button aria-label="Change language"></button>${links}</div></body></html>`
}

async function writeLocaleFixture(
  root: string,
  publicPath: string,
  options: { omittedLocale?: DocsLocale; revision?: string; wrongLabelLocale?: DocsLocale } = {},
): Promise<void> {
  await Promise.all(
    ALL_LOCALES.map(async (locale) => {
      const directory = path.join(root, locale.path)
      await mkdir(directory, { recursive: true })
      const html =
        locale === ROOT_LOCALE
          ? rootHtml(publicPath, options)
          : `<html lang="${locale.lang}" dir="${locale.direction}"><body>${navigationHtml(locale, publicPath)}</body></html>`
      await writeFile(path.join(directory, 'index.html'), html)
      const getStartedDirectory = path.join(directory, 'get-started')
      await mkdir(getStartedDirectory, { recursive: true })
      await writeFile(path.join(getStartedDirectory, 'index.html'), localizedShellHtml(locale, publicPath))
    }),
  )
}

async function withFixture(
  publicPath: string,
  callback: (root: string) => Promise<void>,
  options: { omittedLocale?: DocsLocale; revision?: string; wrongLabelLocale?: DocsLocale } = {},
): Promise<void> {
  const root = await mkdtemp(path.join(tmpdir(), 'iroha-docs-built-locales-'))
  try {
    await writeLocaleFixture(root, publicPath, options)
    await callback(root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

describe('built locale validation', () => {
  test.each([
    { option: undefined, builtPath: '/' },
    { option: '/iroha-docs/', builtPath: '/iroha-docs/' },
    { option: '/iroha-docs', builtPath: '/iroha-docs/' },
    { option: 'iroha-docs', builtPath: '/iroha-docs/' },
  ])('accepts a complete language selector for public path $option', async ({ option, builtPath }) => {
    await withFixture(builtPath, async (root) => {
      expect(await scanBuiltLocales({ root, publicPath: option })).toEqual([])
    })
  })

  test('reports a missing language selector', async () => {
    await withFixture('/', async (root) => {
      await writeFile(path.join(root, 'index.html'), '<html lang="en" dir="ltr"><body></body></html>')
      expect(await scanBuiltLocales({ root })).toContain('English locale index does not render the language selector')
    })
  })

  test('accepts the expected deployment revision', async () => {
    await withFixture(
      '/',
      async (root) => {
        expect(await scanBuiltLocales({ root, revision: 'abc123' })).toEqual([])
      },
      { revision: 'abc123' },
    )
  })

  test('reports a stale deployment revision', async () => {
    await withFixture(
      '/',
      async (root) => {
        expect(await scanBuiltLocales({ root, revision: 'new-sha' })).toContain(
          'built revision is old-sha; expected new-sha',
        )
      },
      { revision: 'old-sha' },
    )
  })

  test('reports a missing locale link', async () => {
    const japanese = ALL_LOCALES.find((locale) => locale.key === 'ja')!
    await withFixture(
      '/',
      async (root) => {
        expect(await scanBuiltLocales({ root })).toContain('language selector is missing 日本語: /ja/')
      },
      { omittedLocale: japanese },
    )
  })

  test('reports an empty language label', async () => {
    const french = ALL_LOCALES.find((locale) => locale.key === 'fr')!
    await withFixture(
      '/',
      async (root) => {
        expect(await scanBuiltLocales({ root })).toContain(
          'language selector link /fr/ is labelled (empty); expected Français',
        )
      },
      { wrongLabelLocale: french },
    )
  })

  test('reports a missing accessible button label', async () => {
    await withFixture('/', async (root) => {
      const html = rootHtml('/').replace(' aria-label="Change language"', '')
      await writeFile(path.join(root, 'index.html'), html)
      expect(await scanBuiltLocales({ root })).toContain(
        'language selector is missing a non-empty accessible button label',
      )
    })
  })

  test('reports a missing locale root once', async () => {
    const japanese = ALL_LOCALES.find((locale) => locale.key === 'ja')!
    await withFixture('/', async (root) => {
      await rm(path.join(root, japanese.path, 'index.html'))
      const issues = await scanBuiltLocales({ root })
      expect(issues.filter((issue) => issue.includes('missing 日本語 locale index'))).toHaveLength(1)
    })
  })

  test('reports incorrect language metadata', async () => {
    const japanese = ALL_LOCALES.find((locale) => locale.key === 'ja')!
    await withFixture('/', async (root) => {
      await writeFile(path.join(root, japanese.path, 'index.html'), '<html lang="en" dir="ltr"></html>')
      expect(await scanBuiltLocales({ root })).toContain('日本語 locale index has lang=en; expected ja')
    })
  })

  test('reports a missing html element', async () => {
    const japanese = ALL_LOCALES.find((locale) => locale.key === 'ja')!
    await withFixture('/', async (root) => {
      await writeFile(path.join(root, japanese.path, 'index.html'), '<p>broken</p>')
      expect(await scanBuiltLocales({ root })).toContain('日本語 locale index has no html element')
    })
  })

  test('reports incorrect right-to-left metadata', async () => {
    const arabic = ALL_LOCALES.find((locale) => locale.key === 'ar')!
    await withFixture('/', async (root) => {
      await writeFile(path.join(root, arabic.path, 'index.html'), '<html lang="ar" dir="ltr"></html>')
      expect(await scanBuiltLocales({ root })).toContain('العربية locale index has dir=ltr; expected rtl')
    })
  })

  test('reports translated pages that fall back to the English navigation', async () => {
    const arabic = ALL_LOCALES.find((locale) => locale.key === 'ar')!
    await withFixture('/', async (root) => {
      await writeFile(
        path.join(root, arabic.path, 'index.html'),
        `<html lang="ar" dir="rtl"><body>${navigationHtml(ROOT_LOCALE, '/')}</body></html>`,
      )
      expect(await scanBuiltLocales({ root })).toContain('العربية navigation is missing البدء: /ar/get-started/')
    })
  })

  test('reports translated sidebars that fall back to English', async () => {
    const arabic = ALL_LOCALES.find((locale) => locale.key === 'ar')!
    await withFixture('/', async (root) => {
      const file = path.join(root, arabic.path, 'get-started', 'index.html')
      const html = localizedShellHtml(arabic, '/').replace('localized-install-ar', 'Install Iroha 3')
      await writeFile(file, html)
      expect(await scanBuiltLocales({ root })).toContain(
        'العربية sidebar falls back to the English Install Iroha 3 label',
      )
    })
  })

  test('reports translated shell labels that fall back to English', async () => {
    const arabic = ALL_LOCALES.find((locale) => locale.key === 'ar')!
    await withFixture('/', async (root) => {
      const file = path.join(root, arabic.path, 'get-started', 'index.html')
      const html = localizedShellHtml(arabic, '/').replace(arabic.theme.editLink, ROOT_LOCALE.theme.editLink)
      await writeFile(file, html)
      expect(await scanBuiltLocales({ root })).toContain(
        `العربية edit link is labelled ${ROOT_LOCALE.theme.editLink}; expected ${arabic.theme.editLink}`,
      )
    })
  })

  test('reports untranslated hidden shell labels', async () => {
    const arabic = ALL_LOCALES.find((locale) => locale.key === 'ar')!
    await withFixture('/', async (root) => {
      const file = path.join(root, arabic.path, 'get-started', 'index.html')
      const html = localizedShellHtml(arabic, '/').replace(
        arabic.theme.mainNavigation,
        ROOT_LOCALE.theme.mainNavigation,
      )
      await writeFile(file, html)
      expect(await scanBuiltLocales({ root })).toContain(
        `العربية main-navigation label is ${ROOT_LOCALE.theme.mainNavigation}; expected ${arabic.theme.mainNavigation}`,
      )
    })
  })
})
