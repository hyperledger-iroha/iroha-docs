import type MarkdownIt from 'markdown-it'
import { GENERATED_REFERENCE_FENCE, readEmbeddedReference } from '../etc/generated-references'

/**
 * Renders a `generated-reference` fence as the pinned Markdown it names, at build time, so the
 * generated reference is part of the static page. `v-pre` keeps Vue from interpreting its text.
 */
export const generatedReferences = (md: MarkdownIt, repositoryRoot: string) => {
  const fence = md.renderer.rules.fence!.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, index, options, env, slf) => {
    const token = tokens[index]
    if (token.info.trim() !== GENERATED_REFERENCE_FENCE) return fence(tokens, index, options, env, slf)

    const reference = readEmbeddedReference(repositoryRoot, token.content.trim())
    return `<div class="generated-reference" v-pre>\n${md.render(reference, { ...env })}</div>\n`
  }
}
