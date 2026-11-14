import MarkdownIt from 'markdown-it'
import { createMarkdownRenderer, disposeMdItInstance } from 'vitepress'
import { expect, test } from 'vitest'
import { staticCodeFences } from './md-static-code'

test('keeps Shiki token markup and code examples literal', async () => {
  const md = await createMarkdownRenderer(process.cwd())
  try {
    const source = ['```js', 'const html = "<img src=x onerror=alert(1)> & {{ value }}";', '```'].join('\n')
    const original = md.render(source)
    const highlighted = /<pre\b[^>]*>(<code\b[^>]*>[\s\S]*?<\/code>)<\/pre>/u.exec(original)![1]
    const dynamic = '```js-vue\n{{ value }}\n```'
    const originalDynamic = md.render(dynamic)

    md.use(staticCodeFences)
    const compact = md.render(source)
    expect(compact).toContain('class="copy"')
    expect(compact).toContain('class="lang">js</span>')
    expect(highlighted).toContain('shiki-light')
    expect(compact).toContain(`v-html="${md.utils.escapeHtml(JSON.stringify(highlighted))}"`)
    expect(compact).not.toContain('<img')
    expect(compact).not.toContain('v-pre')
    expect(md.render(dynamic)).toBe(originalDynamic)
  } finally {
    disposeMdItInstance()
  }
})

test('passes through fences from other renderers', () => {
  const md = new MarkdownIt()
  const component = '<Diagram data-source="example" />'
  const custom = '<pre class="custom" v-pre><code>example</code></pre>'
  md.renderer.rules.fence = (tokens, index) => (tokens[index].info === 'diagram' ? component : custom)
  md.use(staticCodeFences)
  expect(md.render('```diagram\nexample\n```')).toBe(component)
  expect(md.render('```custom\nexample\n```')).toBe(custom)
})
