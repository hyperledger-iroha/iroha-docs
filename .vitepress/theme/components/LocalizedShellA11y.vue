<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { onContentUpdated, useData } from 'vitepress'

interface ShellA11yLabels {
  mainNavigation: string
  sidebarNavigation: string
  pager: string
  mobileNavigation: string
  extraNavigation: string
  toggleSection: string
  permalinkTo: string
  copyCode: string
  copied: string
}

interface LocalizedTheme {
  shellA11y?: ShellA11yLabels
}

const { theme } = useData<LocalizedTheme>()

const labelTargets: ReadonlyArray<readonly [keyof ShellA11yLabels, string]> = [
  ['mainNavigation', 'main-nav-aria-label'],
  ['sidebarNavigation', 'sidebar-aria-label'],
  ['pager', 'doc-footer-aria-label'],
]

function applyLocalizedLabels(): void {
  const labels = theme.value.shellA11y
  if (!labels) return

  for (const [key, id] of labelTargets) {
    const element = document.getElementById(id)
    if (element) element.textContent = labels[key]
  }

  const attributeTargets: ReadonlyArray<readonly [string, string, string]> = [
    ['.VPNavBarHamburger', 'aria-label', labels.mobileNavigation],
    ['.VPNavBarExtra > button.button', 'aria-label', labels.extraNavigation],
    ['.VPSidebarItem .caret', 'aria-label', labels.toggleSection],
    ['button.copy', 'title', labels.copyCode],
  ]
  for (const [selector, attribute, label] of attributeTargets) {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      element.setAttribute(attribute, label)
    })
  }

  document.querySelectorAll<HTMLElement>('.header-anchor[aria-label]').forEach((anchor) => {
    const currentLabel = anchor.getAttribute('aria-label')
    const quotedHeading = currentLabel?.slice(currentLabel.indexOf('"'))
    if (quotedHeading?.startsWith('"')) {
      anchor.setAttribute('aria-label', `${labels.permalinkTo} ${quotedHeading}`)
    }
  })
  document.documentElement.style.setProperty('--vp-code-copy-copied-text-content', `'${labels.copied}'`)
}

async function updateLocalizedLabels(): Promise<void> {
  await nextTick()
  applyLocalizedLabels()
}

onMounted(updateLocalizedLabels)
onContentUpdated(updateLocalizedLabels)
</script>

<template>
  <span hidden />
</template>
