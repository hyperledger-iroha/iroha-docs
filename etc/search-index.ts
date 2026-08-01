import type MarkdownIt from 'markdown-it'

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

export function renderSearchHeadings(
  source: string,
  environment: SearchMarkdownEnvironment,
  markdown: MarkdownIt,
): string {
  if (environment.frontmatter?.search === false) return '[]'

  const tokens = markdown.parse(source, environment)
  const parentTitles: string[] = []
  const sections: SearchHeading[] = []

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]
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

  return JSON.stringify(sections)
}

export function splitSearchHeadings(_path: string, rendered: string): SearchHeading[] {
  return JSON.parse(rendered) as SearchHeading[]
}
