import { readFile } from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import * as cssSelect from 'css-select'
import * as htmlparser from 'htmlparser2'
import { ALL_LOCALES, ROOT_LOCALE } from './locales'

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

function localeHref(localePath: string, publicPath: string): string {
  return `${publicPath}${localePath ? `${localePath}/` : ''}`
}

export async function scanBuiltLocales(options: Options): Promise<string[]> {
  const issues: string[] = []
  const publicPath = normalizePublicPath(options.publicPath)
  const htmlByLocale = new Map<string, string>()

  await Promise.all(
    ALL_LOCALES.map(async (locale) => {
      const indexFile = localeIndex(options.root, locale.path)
      try {
        htmlByLocale.set(locale.key, await readFile(indexFile, 'utf8'))
      } catch {
        issues.push(`missing ${locale.label} locale index: ${indexFile}`)
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
