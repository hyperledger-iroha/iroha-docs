import MarkdownIt from 'markdown-it'
import { describe, expect, test } from 'vitest'
import { renderSearchHeadings, splitSearchHeadings } from './search-index'

function markdownWithAnchors(): MarkdownIt {
  const markdown = new MarkdownIt()
  markdown.core.ruler.push('test-heading-anchors', (state) => {
    for (let index = 0; index < state.tokens.length; index += 1) {
      const token = state.tokens[index]
      if (token.type !== 'heading_open') continue
      const inline = state.tokens[index + 1]
      const title = inline.children?.map((child) => child.content).join('') ?? ''
      token.attrSet('id', title.toLowerCase().replaceAll(' ', '-'))
    }
  })
  return markdown
}

describe('search index rendering', () => {
  test('extracts heading hierarchy and anchors without rendered page bodies', () => {
    const rendered = renderSearchHeadings(
      '# Iroha\n\nBody that is not indexed.\n\n## Install `irohad`\n\nMore body.',
      {},
      markdownWithAnchors(),
    )

    expect(splitSearchHeadings('guide.md', rendered)).toEqual([
      { anchor: 'iroha', text: 'Iroha', titles: ['Iroha'] },
      { anchor: 'install-irohad', text: 'Install irohad', titles: ['Iroha', 'Install irohad'] },
    ])
    expect(rendered).not.toContain('Body that is not indexed')
  })

  test('does not parse headings or retain content inside code fences', () => {
    const rendered = renderSearchHeadings(
      '# Visible\n\n```markdown\n## Hidden\nlarge duplicated code sample\n```',
      {},
      markdownWithAnchors(),
    )

    expect(splitSearchHeadings('guide.md', rendered)).toEqual([
      { anchor: 'visible', text: 'Visible', titles: ['Visible'] },
    ])
    expect(rendered).not.toContain('large duplicated code sample')
  })

  test('honors pages excluded from search', () => {
    const rendered = renderSearchHeadings('# Hidden', { frontmatter: { search: false } }, markdownWithAnchors())
    expect(splitSearchHeadings('hidden.md', rendered)).toEqual([])
  })
})
