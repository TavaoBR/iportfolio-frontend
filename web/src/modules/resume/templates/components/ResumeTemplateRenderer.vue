<script setup lang="ts">
import { computed } from 'vue'
import { createResumeTemplateData } from '../data'
import { getResumeTemplateDefinition } from '../registry'
import type { ResumeTemplateRendererContext } from '../types'
import { RESUME_A4_HEIGHT_PX, RESUME_A4_WIDTH_PX } from '../resumeA4Constants'
import '../resume-template-tokens.css'

const props = withDefaults(
  defineProps<
    ResumeTemplateRendererContext & {
      templateKey?: string | null
      scale?: number
      framed?: boolean
    }
  >(),
  {
    templateKey: null,
    scale: 0.42,
    framed: true,
  },
)

const definition = computed(() => getResumeTemplateDefinition(props.templateKey ?? props.resume?.template_key))
const data = computed(() => createResumeTemplateData(props))

/** Viewport exatamente do tamanho visual pós-`scale` (sem double-scale no filho). */
const viewportStyle = computed(() => {
  const s = props.scale
  return {
    width: `${RESUME_A4_WIDTH_PX * s}px`,
    height: `${RESUME_A4_HEIGHT_PX * s}px`,
  }
})

const sheetStyle = computed(() => ({
  width: `${RESUME_A4_WIDTH_PX}px`,
  height: `${RESUME_A4_HEIGHT_PX}px`,
  overflow: 'hidden',
  transform: `scale(${props.scale})`,
  transformOrigin: 'top left',
}))
</script>

<template>
  <div
    class="resume-template-tokens resume-template-viewport relative overflow-hidden"
    :class="framed ? 'resume-template-viewport--framed box-border rounded-xl border border-white/10 bg-black/40 shadow-2xl' : ''"
    :style="viewportStyle"
  >
    <div class="resume-template-sheet pointer-events-none absolute left-0 top-0 box-border origin-top-left" :style="sheetStyle">
      <component
        :is="definition.component"
        :data="data"
        :accent="definition.accent"
        :mapping="definition.mapping"
        class="pointer-events-auto"
      />
    </div>
  </div>
</template>
