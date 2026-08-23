<script lang="ts">
export interface NexusPortalAction {
  text: string
  link: string
}

export interface NexusPortalRecipe {
  title: string
  link: string
}

export interface NexusBuildPortalContent {
  eyebrow: string
  title: string
  details: string
  primaryAction: NexusPortalAction
  secondaryAction: NexusPortalAction
  recipes: {
    title: string
    items: NexusPortalRecipe[]
  }
}
</script>

<script setup lang="ts">
import { VPLink } from 'vitepress/theme'

defineProps<{
  content: NexusBuildPortalContent
}>()
</script>

<template>
  <section
    class="nexus-portal"
    aria-labelledby="nexus-portal-title"
  >
    <div class="nexus-portal__panel">
      <div class="nexus-portal__intro">
        <p class="nexus-portal__eyebrow">
          {{ content.eyebrow }}
        </p>
        <h2
          id="nexus-portal-title"
          class="nexus-portal__title"
        >
          {{ content.title }}
        </h2>
        <p class="nexus-portal__details">
          {{ content.details }}
        </p>

        <div class="nexus-portal__actions">
          <VPLink
            class="nexus-portal__action nexus-portal__action--primary"
            :href="content.primaryAction.link"
          >
            {{ content.primaryAction.text }}
          </VPLink>
          <VPLink
            class="nexus-portal__action nexus-portal__action--secondary"
            :href="content.secondaryAction.link"
          >
            {{ content.secondaryAction.text }}
          </VPLink>
        </div>
      </div>

      <nav
        class="nexus-portal__recipes"
        aria-labelledby="nexus-portal-recipes-title"
      >
        <h3
          id="nexus-portal-recipes-title"
          class="nexus-portal__recipes-title"
        >
          {{ content.recipes.title }}
        </h3>
        <ul class="nexus-portal__recipe-list">
          <li
            v-for="recipe in content.recipes.items"
            :key="recipe.link"
          >
            <VPLink
              class="nexus-portal__recipe-link"
              :href="recipe.link"
            >
              {{ recipe.title }}
            </VPLink>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.nexus-portal {
  max-width: 1200px;
  margin: 48px auto 0;
  padding-inline: 24px;
}

.nexus-portal__panel {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.72fr);
  gap: clamp(36px, 6vw, 80px);
  align-items: end;
  min-height: 360px;
  padding: clamp(36px, 5vw, 64px);
  overflow: hidden;
  color: #ffffff;
  background:
    linear-gradient(118deg, transparent 0 56%, rgba(255, 255, 255, 0.11) 56% 73%, transparent 73%),
    linear-gradient(132deg, #aa1832 0%, #5d1726 47%, #191923 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(20, 20, 28, 0.22);
}

.nexus-portal__intro,
.nexus-portal__recipes {
  position: relative;
  z-index: 1;
}

.nexus-portal__eyebrow {
  margin: 0 0 20px;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.nexus-portal__title {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2.5rem, 5vw, 4.35rem);
  font-weight: 760;
  line-height: 1.02;
  color: #ffffff;
  letter-spacing: -0.035em;
}

.nexus-portal__details {
  max-width: 700px;
  margin: 24px 0 0;
  font-size: clamp(1rem, 1.4vw, 1.15rem);
  font-weight: 400;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.86);
}

.nexus-portal__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.nexus-portal__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 20px;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 7px;
  transition:
    color 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.nexus-portal__action--primary {
  color: #191923;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.nexus-portal__action--secondary {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.44);
}

.nexus-portal__action:hover {
  color: #ffffff;
  text-decoration: none;
  transform: translateY(-2px);
}

.nexus-portal__action--primary:hover {
  color: #9b1730;
  background: #ffffff;
}

.nexus-portal__action--secondary:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.72);
}

.nexus-portal__action:focus-visible,
.nexus-portal__recipe-link:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 3px;
}

.nexus-portal__recipes {
  padding: 24px;
  background: rgba(15, 16, 24, 0.38);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  backdrop-filter: blur(12px);
}

.nexus-portal__recipes-title {
  margin: 0 0 12px;
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.nexus-portal__recipe-list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nexus-portal__recipe-link {
  display: block;
  padding-block: 13px;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
  color: #ffffff;
  text-decoration: none;
  border-block-end: 1px solid rgba(255, 255, 255, 0.14);
  transition:
    color 0.18s ease,
    padding-inline-start 0.18s ease;
}

.nexus-portal__recipe-list li:last-child .nexus-portal__recipe-link {
  border-block-end: 0;
}

.nexus-portal__recipe-link:hover {
  padding-inline-start: 6px;
  color: #ffd9df;
  text-decoration: none;
}

@media (max-width: 860px) {
  .nexus-portal {
    margin-top: 36px;
  }

  .nexus-portal__panel {
    grid-template-columns: 1fr;
    gap: 32px;
    min-height: 0;
  }

  .nexus-portal__recipes {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .nexus-portal {
    padding-inline: 20px;
  }

  .nexus-portal__panel {
    padding: 28px 24px;
    border-radius: 10px;
  }

  .nexus-portal__title {
    font-size: clamp(2.2rem, 12vw, 3rem);
    line-height: 1.06;
  }

  .nexus-portal__details {
    margin-top: 20px;
    line-height: 1.6;
  }

  .nexus-portal__actions {
    display: grid;
    margin-top: 28px;
  }

  .nexus-portal__action {
    width: 100%;
  }

  .nexus-portal__recipes {
    padding: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nexus-portal__action,
  .nexus-portal__recipe-link {
    transition: none;
  }

  .nexus-portal__action:hover {
    transform: none;
  }

  .nexus-portal__recipe-link:hover {
    padding-inline-start: 0;
  }
}
</style>
