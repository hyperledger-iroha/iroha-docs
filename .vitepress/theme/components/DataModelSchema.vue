<script setup lang="ts">
/* eslint-disable vue/no-v-html */
import MarkdownIt from 'markdown-it'
import { onMounted, ref } from 'vue'
import schemaUrl from '../../../src/snippets/data-model-schema.md?url'

const renderedSchema = ref('')
const loadError = ref('')

function preserveExplicitHeadingAnchors(markdown: string): string {
  return markdown.replace(/^(#{1,6})\s+(.+?)\s+\{#([A-Za-z][\w-]*)\}\s*$/gmu, '$1 <a id="$3"></a>$2')
}

onMounted(async () => {
  try {
    const response = await fetch(schemaUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const source = preserveExplicitHeadingAnchors(await response.text())
    renderedSchema.value = new MarkdownIt({ html: true, linkify: true }).render(source)
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : String(error)
  }
})
</script>

<template>
  <!-- The HTML is rendered from the pinned, repository-owned schema snapshot. -->
  <div
    v-if="renderedSchema"
    class="data-model-schema"
    v-html="renderedSchema"
  />
  <p
    v-else-if="loadError"
    role="alert"
  >
    The generated data-model schema could not be loaded: {{ loadError }}
  </p>
  <p
    v-else
    aria-live="polite"
  >
    Loading the generated data-model schema…
  </p>
</template>
