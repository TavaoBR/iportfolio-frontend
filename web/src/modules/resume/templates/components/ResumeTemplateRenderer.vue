<script setup lang="ts">
import { computed } from 'vue'
import { createResumeTemplateData } from '../data'
import { getResumeTemplateDefinition } from '../registry'
import type { ResumeTemplateRendererContext } from '../types'

const props = withDefaults(
  defineProps<ResumeTemplateRendererContext & {
    templateKey?: string | null
    scale?: number
    framed?: boolean
  }>(),
  {
    templateKey: null,
    scale: 0.42,
    framed: true,
  },
)

const definition = computed(() => getResumeTemplateDefinition(props.templateKey ?? props.resume?.template_key))
const data = computed(() => createResumeTemplateData(props))
const width = computed(() => `${794 * props.scale}px`)
const height = computed(() => `${1123 * props.scale}px`)
</script>

<template>
  <div
    class="overflow-hidden"
    :class="framed ? 'rounded-xl border border-white/10 bg-black/40 p-3 shadow-2xl' : ''"
    :style="{ width, height }"
  >
    <component
      :is="definition.component"
      :data="data"
      :accent="definition.accent"
      :style="{ transform: `scale(${scale})` }"
    />
  </div>
</template>
