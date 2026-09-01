<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue'
import { computed, ref } from 'vue'
import { usePromise, wheneverFulfilled, wheneverRejected } from '@vue-kakuyaku/core'
import { mande } from 'mande'
import { useData } from 'vitepress'
import { localeForLanguage } from '../../../etc/locales'
import IconClose from './icons/IconClose.vue'
import IconFeedback from './icons/IconFeedback.vue'
import IconCheck from './icons/IconCheck.vue'
import VBtnPrimary from './VBtnPrimary.vue'
import VBtnSecondary from './VBtnSecondary.vue'
import { whenever } from '@vueuse/core'
import { logicNot } from '@vueuse/math'

const props = defineProps<{
  feedbackUrl: string
}>()

const { lang } = useData()
const labels = computed(() => localeForLanguage(lang.value).feedback)
const openModal = ref(false)

const KINDS = ['bug', 'suggestion', 'other'] as const
type FeedbackKind = (typeof KINDS)[number]

const kindLabels = computed<Record<FeedbackKind, string>>(() => ({
  suggestion: labels.value.suggestion,
  bug: labels.value.bug,
  other: labels.value.other,
}))

const feedbackKind = ref<null | FeedbackKind>(null)
const feedbackText = ref('')
const contact = ref('')

const feedbackTextPlaceholder = computed<string>(() => {
  switch (feedbackKind.value) {
    case 'bug':
      return labels.value.bugPlaceholder
    default:
      return labels.value.generalPlaceholder
  }
})

const action = usePromise()
const success = ref(false)

wheneverFulfilled(action.state, () => {
  success.value = true
  feedbackText.value = contact.value = ''
})

wheneverRejected(action.state, (reason) => {
  console.error('Feedback rejection reason:', reason)
})

whenever(logicNot(openModal), () => {
  success.value = false
})

function doSubmit() {
  const data = {
    kind: feedbackKind.value,
    feedback: feedbackText.value,
    contact: contact.value,
    location: window.location,
  }
  const api = mande(props.feedbackUrl)
  action.set(api.post(data))
}
</script>

<template>
  <VBtnPrimary
    class="inline-flex items-center gap-2"
    @click="openModal = true"
  >
    <IconFeedback />
    <span>{{ labels.shareFeedback }}</span>
  </VBtnPrimary>

  <Dialog
    :open="openModal"
    @close="openModal = false"
  >
    <div
      class="fixed inset-0 bg-black/30 z-90"
      aria-hidden="true"
    />

    <div class="fixed inset-0 flex items-center justify-center p-4 z-90">
      <DialogPanel class="feedback-card shadow-lg flex flex-col">
        <div class="feedback-card_header flex items-center">
          <DialogTitle class="feedback-card_title flex-1">
            {{ labels.shareFeedback }}
          </DialogTitle>

          <VBtnSecondary
            class="text-base p-2 -m-2"
            :aria-label="labels.close"
            @click="openModal = false"
          >
            <IconClose />
          </VBtnSecondary>
        </div>

        <template v-if="success">
          <div class="p-4 flex items-center gap-4">
            <IconCheck class="text-3xl feedback-card_check" />
            <div>{{ labels.thankYou }}</div>
          </div>

          <div class="flex justify-end p-4">
            <VBtnSecondary @click="openModal = false">
              {{ labels.close }}
            </VBtnSecondary>
          </div>
        </template>

        <div
          v-else
          class="flex-1 overflow-y-scroll"
        >
          <div class="p-4 space-y-4">
            <DialogDescription class="text-sm">
              {{ labels.description }}
            </DialogDescription>

            <div>
              <fieldset class="space-y-1">
                <legend class="field-label">
                  {{ labels.feedbackType }}*
                </legend>

                <div
                  v-for="value of KINDS"
                  :key="value"
                  class="flex gap-2 items-center"
                >
                  <input
                    :id="`feedback-kind-${value}`"
                    v-model="feedbackKind"
                    class="max-w-min"
                    :value="value"
                    type="radio"
                    name="feedback-kind"
                  >
                  <label
                    :for="`feedback-kind-${value}`"
                    class="flex-1 text-sm"
                  >{{ kindLabels[value] }}</label>
                </div>
              </fieldset>
            </div>

            <div>
              <label
                for="feedback-input-text"
                class="field-label"
              >{{ labels.feedbackLabel }}*</label>

              <textarea
                id="feedback-input-text"
                v-model="feedbackText"
                :placeholder="feedbackTextPlaceholder"
                rows="5"
              />
            </div>

            <div>
              <label
                for="feedback-input-contact"
                class="field-label"
              >
                <i>({{ labels.optional }})</i> {{ labels.contactInformation }}
              </label>

              <input
                id="feedback-input-contact"
                v-model="contact"
                :placeholder="labels.contactPlaceholder"
              >
            </div>
          </div>

          <div
            v-if="action.state.rejected"
            class="px-4 text-xs"
          >
            {{ labels.unableToSendFeedback }}
          </div>

          <div class="flex p-4 items-center justify-end gap-2">
            <VBtnSecondary @click="openModal = false">
              {{ labels.cancel }}
            </VBtnSecondary>
            <VBtnPrimary
              :disabled="!feedbackText || !feedbackKind || action.state.pending"
              @click="doSubmit"
            >
              {{ action.state.pending ? labels.sending : labels.submit }}
            </VBtnPrimary>
          </div>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
.feedback-card {
  background: var(--vp-c-bg);
  border-radius: 8px;
  width: calc(100vw - 32px);
  max-width: 420px;
  max-height: calc(100vh - 32px);
  border: 1px solid var(--vp-c-border);

  &_header {
    border-bottom: 1px solid var(--vp-c-border);
    padding: 16px;
  }

  &_title {
    font-size: 16px;
    font-weight: bolder;
  }

  &_check {
    color: var(--vp-custom-block-tip-text);
  }
}
.overflow-y-scroll {
  overflow-y: auto;
}

textarea,
input {
  font-family: var(--vp-font-family-base);
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  border-radius: 4px;
  padding: 16px;
  width: 100%;

  &::placeholder {
    color: var(--vp-c-text-2) !important;
    opacity: 1;
  }
}

#share-feedback-description {
  color: var(--vp-c-text-2);
}

.field-label {
  font-size: 12px;
  font-weight: bolder;
  display: block;
  margin-bottom: 8px;
}
fieldset {
  border: none;
}
</style>
