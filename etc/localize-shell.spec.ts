import { describe, expect, test } from 'vitest'
import { ROOT_LOCALE, TRANSLATED_LOCALES } from './locales'
import { localizeShellA11yHtml } from './localize-shell'

const shellFixture = `<html><head></head><body><nav aria-labelledby="main-nav-aria-label">
  <span id="main-nav-aria-label" class="visually-hidden">Main Navigation</span>
</nav>
<nav aria-labelledby="sidebar-aria-label">
  <span class="visually-hidden" id="sidebar-aria-label">Sidebar Navigation</span>
</nav>
<nav aria-labelledby="doc-footer-aria-label">
  <span data-test="pager" id="doc-footer-aria-label">Pager</span>
</nav>
<button class="VPNavBarHamburger" aria-label="mobile navigation"></button>
<button class="extra" aria-label="extra navigation"></button>
<button class="caret" aria-label="toggle section"></button>
<button class="copy" title="Copy Code"></button>
<a class="header-anchor" aria-label="Permalink to &quot;Heading&quot;"></a>
</body></html>`

describe('localized shell accessibility labels', () => {
  test('keeps the English labels on root pages', () => {
    expect(localizeShellA11yHtml(shellFixture, 'get-started/index.md')).toContain(
      `>${ROOT_LOCALE.theme.mainNavigation}</span>`,
    )
  })

  test.each(TRANSLATED_LOCALES)('localizes all hidden shell labels for $label', (locale) => {
    const localized = localizeShellA11yHtml(shellFixture, `${locale.path}/get-started/index.md`)
    expect(localized).toContain(`>${locale.theme.mainNavigation}</span>`)
    expect(localized).toContain(`>${locale.theme.sidebarNavigation}</span>`)
    expect(localized).toContain(`>${locale.theme.pager}</span>`)
    expect(localized).toContain(`aria-label="${locale.theme.mobileNavigation}"`)
    expect(localized).toContain(`aria-label="${locale.theme.extraNavigation}"`)
    expect(localized).toContain(`aria-label="${locale.theme.toggleSection}"`)
    expect(localized).toContain(`title="${locale.theme.copyCode}"`)
    expect(localized).toContain(`aria-label="${locale.theme.permalinkTo} &quot;Heading&quot;"`)
    expect(localized).toContain(`--vp-code-copy-copied-text-content:'${locale.theme.copied}'`)
    expect(localized).not.toMatch(/>\s*(?:Main Navigation|Sidebar Navigation|Pager)\s*</u)
  })

  test('leaves unrelated spans unchanged', () => {
    expect(localizeShellA11yHtml('<head></head><span id="other">Main Navigation</span>', 'ar/index.md')).toContain(
      '<span id="other">Main Navigation</span>',
    )
  })
})
