<script setup lang="ts">
import { builderSteps, type ResumeBuilderStepKey } from '../stores/useResumeBuilderStore'

defineProps<{
  activeStep: ResumeBuilderStepKey
}>()

const emit = defineEmits<{
  select: [step: ResumeBuilderStepKey]
}>()
</script>

<template>
  <nav class="grid gap-1.5">
    <button
      v-for="(step, index) in builderSteps"
      :key="step.key"
      type="button"
      class="flex items-center gap-2 rounded-2xl px-2.5 py-2 text-left transition"
      :class="
        activeStep === step.key
          ? 'bg-blue-500 text-white shadow-[0_10px_24px_rgba(58,134,255,0.28)]'
          : 'bg-white/70 text-slate-500 hover:bg-slate-50 hover:text-slate-950'
      "
      @click="emit('select', step.key)"
    >
      <span
        class="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-black"
        :class="activeStep === step.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'"
      >
        {{ index + 1 }}
      </span>
      <span class="min-w-0">
        <span class="block text-xs font-black leading-tight">{{ step.label }}</span>
        <span class="mt-0.5 block text-[0.65rem] leading-snug opacity-75">{{ step.description }}</span>
      </span>
    </button>
  </nav>
</template>
