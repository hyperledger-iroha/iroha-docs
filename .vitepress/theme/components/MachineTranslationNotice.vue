<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter } = useData()

const isTranslated = computed(() => typeof frontmatter.value.translation_locale === 'string')
const englishRoute = computed(() => {
  const source = frontmatter.value.translation_source
  if (typeof source !== 'string' || !source.startsWith('/')) return withBase('/')
  if (source === '/index.md') return withBase('/')
  if (source.endsWith('/index.md')) return withBase(`${source.slice(0, -'index.md'.length)}`)
  return withBase(source.replace(/\.md$/u, '.html'))
})
</script>

<template>
  <aside
    v-if="isTranslated"
    class="machine-translation-notice"
    role="note"
  >
    <strong>Machine translation.</strong>
    The English page is authoritative.
    <a :href="englishRoute">Open the English page</a>.
  </aside>
</template>

<style scoped>
.machine-translation-notice {
  margin: 0 auto 24px;
  border: 1px solid var(--vp-c-warning-2);
  border-radius: 8px;
  padding: 12px 16px;
  max-width: 1152px;
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1.5;
}

.machine-translation-notice a {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
</style>
