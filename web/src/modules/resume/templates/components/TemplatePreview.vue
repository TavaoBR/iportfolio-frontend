<script setup lang="ts">
import { computed } from 'vue'
import ResumeTemplateRenderer from './ResumeTemplateRenderer.vue'
import type { ResumeTemplateDefinition, ResumeTemplateRendererContext } from '../types'

const props = withDefaults(
  defineProps<
    ResumeTemplateRendererContext & {
      template: ResumeTemplateDefinition
      selected?: boolean
      active?: boolean
      scale?: number
      selectLabel?: string
    }
  >(),
  {
    selected: false,
    active: false,
    scale: 0.34,
    selectLabel: 'Selecionar',
  },
)

const emit = defineEmits<{
  select: [key: string]
}>()

const stateLabel = computed(() => (props.selected ? 'Em uso' : props.selectLabel))
</script>

<template>
  <article
    class="group relative flex flex-col items-center transition duration-500"
    :class="active ? 'scale-100 opacity-100' : 'scale-[0.88] opacity-55 hover:opacity-85'"
  >
    <div
      class="relative rounded-[18px] bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.18)] ring-1 transition duration-500"
      :class="selected ? 'ring-blue-500/70' : active ? 'ring-slate-200' : 'ring-transparent'"
    >
      <div class="pointer-events-none absolute inset-x-8 -bottom-5 h-12 rounded-full bg-slate-900/20 blur-2xl" />
      <div class="relative overflow-hidden rounded-xl bg-white">
        <ResumeTemplateRenderer
          :template-key="template.key"
          :resume="resume"
          :sections="sections"
          :profile="profile"
          :user="user"
          :fallback="fallback"
          :scale="scale"
          :framed="false"
        />
      </div>

      <button
        type="button"
        class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-blue-500 px-5 py-2.5 text-sm font-black text-white opacity-0 shadow-[0_14px_35px_rgba(59,130,246,0.38)] transition duration-300 hover:bg-blue-600 focus:opacity-100 focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:opacity-100"
        :class="selected || active ? 'opacity-100' : ''"
        @click.stop="emit('select', template.key)"
      >
        {{ stateLabel }}
      </button>
    </div>

    <div class="mt-5 text-center">
      <p class="text-sm font-black text-slate-950">{{ template.name }}</p>
      <p class="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {{ template.family }}
      </p>
    </div>
  </article>
</template>
