<script setup lang="ts">
import type { ResumeSectionType } from '../types/resume.types'

const sectionOptions: Array<{ type: ResumeSectionType; label: string; text: string }> = [
  { type: 'experiences', label: 'Experiência', text: 'Empresa, cargo e período' },
  { type: 'educations', label: 'Formação', text: 'Instituição, curso e grau' },
  { type: 'skills', label: 'Skill', text: 'Habilidade e nível' },
  { type: 'languages', label: 'Idioma', text: 'Idioma e proficiência' },
  { type: 'projects', label: 'Projeto', text: 'Descrição e tecnologias' },
  { type: 'certifications', label: 'Certificação', text: 'Emissor e data' },
]

defineProps<{
  compact?: boolean
}>()

const emit = defineEmits<{
  add: [type: ResumeSectionType]
}>()
</script>

<template>
  <div class="grid gap-1.5" :class="compact ? 'sm:grid-cols-2' : ''">
    <button
      v-for="option in sectionOptions"
      :key="option.type"
      type="button"
      class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-[0.8125rem] transition hover:border-blue-200 hover:shadow-sm"
      @click="emit('add', option.type)"
    >
      <span class="block text-xs font-black text-slate-950">+ {{ option.label }}</span>
      <span class="mt-0.5 block text-[0.65rem] leading-snug text-slate-500">{{ option.text }}</span>
    </button>
  </div>
</template>
