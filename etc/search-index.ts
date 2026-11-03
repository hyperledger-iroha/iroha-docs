import type MarkdownIt from 'markdown-it'
import { GENERATED_REFERENCE_FENCE } from './generated-references'

export interface SearchHeading {
  anchor: string
  text: string
  titles: string[]
}

interface SearchMarkdownEnvironment {
  frontmatter?: {
    search?: boolean
  }
}

function inlineTitle(token: ReturnType<MarkdownIt['parse']>[number] | undefined): string {
  return (
    token?.children
      ?.filter((child) => child.type === 'text' || child.type === 'code_inline')
      .map((child) => child.content)
      .join('')
      .trim() ?? ''
  )
}

/**
 * Indexes page headings. With `readReference`, headings inside an embedded `generated-reference`
 * are indexed under the page heading that contains them, so generated entries are searchable.
 */
export function renderSearchHeadings(
  source: string,
  environment: SearchMarkdownEnvironment,
  markdown: MarkdownIt,
  readReference?: (name: string) => string,
): string {
  if (environment.frontmatter?.search === false) return '[]'

  const parentTitles: string[] = []
  const sections: SearchHeading[] = []

  const collect = (tokens: ReturnType<MarkdownIt['parse']>) => {
    for (let index = 0; index < tokens.length; index += 1) {
      const token = tokens[index]
      if (readReference && token.type === 'fence' && token.info.trim() === GENERATED_REFERENCE_FENCE) {
        collect(markdown.parse(readReference(token.content.trim()), { ...environment }))
        continue
      }
      if (token.type !== 'heading_open') continue

      const level = Number.parseInt(token.tag.slice(1), 10) - 1
      const title = inlineTitle(tokens[index + 1])
      if (level < 0 || !title) continue

      const titles = parentTitles.slice(0, level)
      titles[level] = title
      const compactTitles = titles.filter(Boolean)

      sections.push({
        anchor: token.attrGet('id') ?? '',
        text: title,
        titles: compactTitles,
      })

      if (level === 0) {
        parentTitles.splice(0, parentTitles.length, title)
      } else {
        parentTitles[level] = title
      }
    }
  }

  collect(markdown.parse(source, environment))
  return JSON.stringify(sections)
}

export function splitSearchHeadings(_path: string, rendered: string): SearchHeading[] {
  return JSON.parse(rendered) as SearchHeading[]
}
