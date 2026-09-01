import { ROOT_LOCALE, TRANSLATED_LOCALES, type DocsLocale } from './locales'

function localeForPage(relativePath: string): DocsLocale {
  const normalizedPath = relativePath.replaceAll('\\', '/').replace(/^\/+/, '')
  return (
    TRANSLATED_LOCALES.find(
      (locale) => normalizedPath === locale.path || normalizedPath.startsWith(`${locale.path}/`),
    ) ?? ROOT_LOCALE
  )
}

function escapeHtmlText(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function escapeHtmlAttribute(value: string): string {
  return escapeHtmlText(value).replaceAll('"', '&quot;')
}

function escapeCssString(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', '\\a ')
}

export function localizeShellA11yHtml(code: string, relativePath: string): string {
  const { theme } = localeForPage(relativePath)
  const labels: ReadonlyArray<readonly [string, string]> = [
    ['main-nav-aria-label', theme.mainNavigation],
    ['sidebar-aria-label', theme.sidebarNavigation],
    ['doc-footer-aria-label', theme.pager],
  ]

  let localized = labels.reduce((html, [id, label]) => {
    const element = new RegExp(`(<span\\b(?=[^>]*\\bid="${id}")[^>]*>)[\\s\\S]*?(</span>)`, 'u')
    return html.replace(element, (_match, opening: string, closing: string) => {
      return `${opening}${escapeHtmlText(label)}${closing}`
    })
  }, code)

  const attributes: ReadonlyArray<readonly [string, string, string]> = [
    ['aria-label', 'mobile navigation', theme.mobileNavigation],
    ['aria-label', 'extra navigation', theme.extraNavigation],
    ['aria-label', 'toggle section', theme.toggleSection],
    ['title', 'Copy Code', theme.copyCode],
  ]
  for (const [attribute, english, translated] of attributes) {
    localized = localized.replaceAll(`${attribute}="${english}"`, `${attribute}="${escapeHtmlAttribute(translated)}"`)
  }

  localized = localized.replaceAll(
    'aria-label="Permalink to &quot;',
    `aria-label="${escapeHtmlAttribute(theme.permalinkTo)} &quot;`,
  )

  const copiedStyle = `<style>:root{--vp-code-copy-copied-text-content:'${escapeCssString(theme.copied)}'}</style>`
  return localized.replace('</head>', `${copiedStyle}</head>`)
}
