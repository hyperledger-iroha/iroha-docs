import type MarkdownIt from 'markdown-it'

export function staticCodeFences(md: MarkdownIt) {
  const renderFence = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (...args) =>
    renderFence(...args).replace(
      /<pre\b([^>]*?)\s+v-pre(?:="")?(?=[\s>])([^>]*)>(<code\b[^>]*>[\s\S]*?<\/code>)<\/pre>/gu,
      (original: string, before: string, after: string, highlighted: string) => {
        const attributes = before + after
        const classes = /\sclass="([^"]*)"/u.exec(attributes)?.[1].split(/\s+/u)
        if (!classes?.includes('shiki') || !classes.includes('vp-code')) return original

        // Shiki already escaped the source and marked it static. Give Vue one
        // literal instead of compiling a template node for every highlighted token.
        const literal = md.utils.escapeHtml(JSON.stringify(highlighted))
        return `<pre${attributes} v-html="${literal}"></pre>`
      },
    )
}
