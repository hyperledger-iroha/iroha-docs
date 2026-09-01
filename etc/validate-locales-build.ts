import { readFile } from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import * as cssSelect from 'css-select'
import * as htmlparser from 'htmlparser2'
import { ALL_LOCALES, ROOT_LOCALE, type DocsLocale } from './locales'

interface Options {
  root: string
  publicPath?: string
  revision?: string
}

function normalizePublicPath(publicPath = '/'): string {
  const withLeadingSlash = publicPath.startsWith('/') ? publicPath : `/${publicPath}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function localeIndex(root: string, localePath: string): string {
  return path.join(root, localePath, 'index.html')
}

function localeGetStartedIndex(root: string, localePath: string): string {
  return path.join(root, localePath, 'get-started', 'index.html')
}

function localeHref(localePath: string, publicPath: string): string {
  return `${publicPath}${localePath ? `${localePath}/` : ''}`
}

function localeNavigation(locale: DocsLocale, publicPath: string): ReadonlyArray<readonly [string, string]> {
  const prefix = localeHref(locale.path, publicPath)
  return [
    [`${prefix}get-started/`, locale.navigation.getStarted],
    [`${prefix}cookbook/`, locale.navigation.cookbook],
    [`${prefix}guide/`, locale.navigation.guides],
    [`${prefix}blockchain/iroha-explained.html`, locale.navigation.architecture],
    [`${prefix}reference/`, locale.navigation.reference],
    [`${prefix}help/`, locale.navigation.help],
  ]
}

export async function scanBuiltLocales(options: Options): Promise<string[]> {
  const issues: string[] = []
  const publicPath = normalizePublicPath(options.publicPath)
  const htmlByLocale = new Map<string, string>()
  const getStartedHtmlByLocale = new Map<string, string>()

  await Promise.all(
    ALL_LOCALES.map(async (locale) => {
      const indexFile = localeIndex(options.root, locale.path)
      const getStartedIndexFile = localeGetStartedIndex(options.root, locale.path)
      try {
        htmlByLocale.set(locale.key, await readFile(indexFile, 'utf8'))
      } catch {
        issues.push(`missing ${locale.label} locale index: ${indexFile}`)
      }
      try {
        getStartedHtmlByLocale.set(locale.key, await readFile(getStartedIndexFile, 'utf8'))
      } catch {
        issues.push(`missing ${locale.label} Get Started index: ${getStartedIndexFile}`)
      }
    }),
  )

  const rootHtml = htmlByLocale.get(ROOT_LOCALE.key)

  if (rootHtml) {
    const document = htmlparser.parseDocument(rootHtml)
    if (options.revision) {
      const revisionMeta = cssSelect.selectOne('meta[name="iroha-docs-revision"]', document.children)
      const builtRevision = revisionMeta && 'attribs' in revisionMeta ? revisionMeta.attribs.content?.trim() : undefined
      if (builtRevision !== options.revision) {
        issues.push(`built revision is ${builtRevision ?? '(missing)'}; expected ${options.revision}`)
      }
    }

    const translationMenu = cssSelect.selectOne('.VPNavBarTranslations', document.children)

    if (!translationMenu) {
      issues.push('English locale index does not render the language selector')
    } else {
      const button = cssSelect.selectOne('button', [translationMenu])
      const buttonLabel = button && 'attribs' in button ? button.attribs['aria-label']?.trim() : undefined
      if (!buttonLabel) issues.push('language selector is missing a non-empty accessible button label')

      const links = new Map(
        cssSelect.selectAll('a[href]', [translationMenu]).flatMap((element) => {
          if (!('attribs' in element) || !element.attribs.href) return []
          return [[element.attribs.href, htmlparser.DomUtils.textContent(element).trim()] as const]
        }),
      )

      for (const locale of ALL_LOCALES) {
        if (locale === ROOT_LOCALE) continue
        const expectedHref = localeHref(locale.path, publicPath)
        const label = links.get(expectedHref)
        if (label === undefined) {
          issues.push(`language selector is missing ${locale.label}: ${expectedHref}`)
        } else if (label !== locale.label) {
          issues.push(
            `language selector link ${expectedHref} is labelled ${label || '(empty)'}; expected ${locale.label}`,
          )
        }
      }
    }
  }

  for (const locale of ALL_LOCALES) {
    const html = htmlByLocale.get(locale.key)
    if (html) {
      const document = htmlparser.parseDocument(html)
      const htmlElement = cssSelect.selectOne('html', document.children)
      if (!htmlElement || !('attribs' in htmlElement)) {
        issues.push(`${locale.label} locale index has no html element`)
        continue
      }

      if (htmlElement.attribs.lang !== locale.lang) {
        issues.push(
          `${locale.label} locale index has lang=${htmlElement.attribs.lang ?? '(missing)'}; expected ${locale.lang}`,
        )
      }
      if (htmlElement.attribs.dir !== locale.direction) {
        issues.push(
          `${locale.label} locale index has dir=${htmlElement.attribs.dir ?? '(missing)'}; expected ${locale.direction}`,
        )
      }

      const navigationLinks = new Map(
        cssSelect.selectAll('a.VPNavBarMenuLink[href]', document.children).flatMap((element) => {
          if (!('attribs' in element) || !element.attribs.href) return []
          return [[element.attribs.href, htmlparser.DomUtils.textContent(element).trim()] as const]
        }),
      )
      for (const [expectedHref, expectedLabel] of localeNavigation(locale, publicPath)) {
        const label = navigationLinks.get(expectedHref)
        if (label === undefined) {
          issues.push(`${locale.label} navigation is missing ${expectedLabel}: ${expectedHref}`)
        } else if (label !== expectedLabel) {
          issues.push(
            `${locale.label} navigation link ${expectedHref} is labelled ${label || '(empty)'}; expected ${expectedLabel}`,
          )
        }
      }
    }

    const getStartedHtml = getStartedHtmlByLocale.get(locale.key)
    if (getStartedHtml) {
      const document = htmlparser.parseDocument(getStartedHtml)
      const prefix = localeHref(locale.path, publicPath)
      const sidebarLink = cssSelect.selectOne(`.VPSidebarItem a[href="${prefix}get-started/"] .text`, document.children)
      const sidebarLabel = sidebarLink ? htmlparser.DomUtils.textContent(sidebarLink).trim() : undefined
      if (sidebarLabel !== locale.navigation.getStarted) {
        issues.push(
          `${locale.label} sidebar root is labelled ${sidebarLabel || '(missing)'}; expected ${locale.navigation.getStarted}`,
        )
      }

      if (locale !== ROOT_LOCALE) {
        const installLink = cssSelect.selectOne(
          `.VPSidebarItem a[href="${prefix}get-started/install-iroha.html"] .text`,
          document.children,
        )
        const installLabel = installLink ? htmlparser.DomUtils.textContent(installLink).trim() : undefined
        if (!installLabel) {
          issues.push(`${locale.label} sidebar is missing its Install Iroha 3 route`)
        } else if (installLabel === 'Install Iroha 3') {
          issues.push(`${locale.label} sidebar falls back to the English Install Iroha 3 label`)
        }
      }

      const editLink = cssSelect.selectOne('.edit-link-button', document.children)
      const editLabel = editLink ? htmlparser.DomUtils.textContent(editLink).trim() : undefined
      if (editLabel !== locale.theme.editLink) {
        issues.push(
          `${locale.label} edit link is labelled ${editLabel || '(missing)'}; expected ${locale.theme.editLink}`,
        )
      }

      const lastUpdated = cssSelect.selectOne('.VPLastUpdated', document.children)
      const lastUpdatedLabel = lastUpdated ? htmlparser.DomUtils.textContent(lastUpdated).trim() : undefined
      if (!lastUpdatedLabel?.startsWith(`${locale.theme.lastUpdated}:`)) {
        issues.push(
          `${locale.label} last-updated label is ${lastUpdatedLabel || '(missing)'}; expected ${locale.theme.lastUpdated}`,
        )
      }

      const shellLabels: ReadonlyArray<readonly [string, string, string]> = [
        ['#main-nav-aria-label', locale.theme.mainNavigation, 'main-navigation label'],
        ['#sidebar-aria-label', locale.theme.sidebarNavigation, 'sidebar-navigation label'],
        ['#doc-footer-aria-label', locale.theme.pager, 'pager label'],
        ['.VPDocAsideOutline .outline-title', locale.theme.outline, 'outline'],
        ['.VPSkipLink', locale.theme.skipToContent, 'skip link'],
        ['.VPLocalNav .menu-text', locale.theme.menu, 'sidebar menu'],
        ['.VPLocalNavOutlineDropdown button', locale.theme.returnToTop, 'return-to-top button'],
        ['.VPNavBarExtra .appearance .label', locale.theme.appearance, 'appearance label'],
        ['.VPDocFooter .pager-link.next .desc', locale.theme.nextPage, 'next-page label'],
      ]
      for (const [selector, expectedLabel, description] of shellLabels) {
        const element = cssSelect.selectOne(selector, document.children)
        const label = element ? htmlparser.DomUtils.textContent(element).trim() : undefined
        if (label !== expectedLabel) {
          issues.push(`${locale.label} ${description} is ${label || '(missing)'}; expected ${expectedLabel}`)
        }
      }

      const shellAttributeLabels: ReadonlyArray<readonly [string, string, string, string]> = [
        ['.VPNavBarHamburger', 'aria-label', locale.theme.mobileNavigation, 'mobile-navigation label'],
        ['.VPNavBarExtra > button.button', 'aria-label', locale.theme.extraNavigation, 'extra-navigation label'],
      ]
      for (const [selector, attribute, expectedLabel, description] of shellAttributeLabels) {
        const element = cssSelect.selectOne(selector, document.children)
        const label = element && 'attribs' in element ? element.attribs[attribute]?.trim() : undefined
        if (label !== expectedLabel) {
          issues.push(`${locale.label} ${description} is ${label || '(missing)'}; expected ${expectedLabel}`)
        }
      }

      const headerAnchor = cssSelect.selectOne('.header-anchor[aria-label]', document.children)
      const permalinkLabel =
        headerAnchor && 'attribs' in headerAnchor ? headerAnchor.attribs['aria-label']?.trim() : undefined
      if (!permalinkLabel?.startsWith(`${locale.theme.permalinkTo} `)) {
        issues.push(
          `${locale.label} permalink label is ${permalinkLabel || '(missing)'}; expected prefix ${locale.theme.permalinkTo}`,
        )
      }

      const languageButton = cssSelect.selectOne('.VPNavBarTranslations button', document.children)
      const languageButtonLabel =
        languageButton && 'attribs' in languageButton ? languageButton.attribs['aria-label']?.trim() : undefined
      if (languageButtonLabel !== locale.theme.changeLanguage) {
        issues.push(
          `${locale.label} language button is labelled ${languageButtonLabel || '(missing)'}; expected ${locale.theme.changeLanguage}`,
        )
      }
    }
  }

  return issues.sort()
}

export async function scanBuiltLocalesAndReport(options: Options): Promise<void> {
  const issues = await scanBuiltLocales(options)
  if (issues.length === 0) {
    console.log(chalk.green(`✓ Language selector and ${ALL_LOCALES.length} locale roots are present`))
    return
  }

  console.error(issues.map((issue) => chalk.red(`× ${issue}`)).join('\n'))
  process.exitCode = 1
}
