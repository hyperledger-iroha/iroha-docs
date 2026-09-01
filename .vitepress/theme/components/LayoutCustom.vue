<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LocalizedShellA11y from './LocalizedShellA11y.vue'
import NexusBuildPortal, { type NexusBuildPortalContent } from './NexusBuildPortal.vue'

const { Layout } = DefaultTheme

const ShareFeedback = defineAsyncComponent(() => import('./ShareFeedback.vue'))
const FEEDBACK_URL: string | undefined = import.meta.env.VITE_FEEDBACK_URL

const { frontmatter } = useData()
const nexusPortal = computed(() => frontmatter.value.nexusPortal as NexusBuildPortalContent | undefined)
</script>

<template>
  <LocalizedShellA11y />
  <Layout>
    <template #home-features-before>
      <NexusBuildPortal
        v-if="nexusPortal"
        :content="nexusPortal"
      />
    </template>
    <template
      v-if="FEEDBACK_URL"
      #sidebar-nav-before
    >
      <div class="sticky-container py-4">
        <ShareFeedback :feedback-url="FEEDBACK_URL" />
      </div>
    </template>
  </Layout>
</template>

<style lang="scss" scoped>
.sticky-container {
  position: sticky;
  top: 0;
  background: var(--vp-sidebar-bg-color);
  z-index: 9;

  :deep(.VPSidebar.open) & {
    top: -32px;
  }
}
</style>
