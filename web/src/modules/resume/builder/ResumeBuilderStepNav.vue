<script setup lang="ts">
import type { ResumeBuilderNavStep } from './resumeBuilderSteps'

const props = defineProps<{
  steps: ReadonlyArray<ResumeBuilderNavStep>
  activeStepId: string
  stepDone: Readonly<Record<string, boolean>>
}>()

const emit = defineEmits<{
  navigate: [stepId: string]
}>()

function go(stepId: string) {
  emit('navigate', stepId)
}
</script>

<template>
  <nav
    class="resume-builder-stepper -mx-0.5"
    aria-label="Progresso do currículo"
  >
    <div
      class="flex min-h-[2.5rem] items-stretch gap-0 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/80"
    >
      <template v-for="(step, i) in props.steps" :key="step.id">
        <span
          v-if="i > 0"
          class="mx-0.5 hidden w-px shrink-0 self-center bg-slate-200 sm:block sm:h-4"
          aria-hidden="true"
        />
        <button
          type="button"
          class="group flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-left text-[11px] font-semibold tracking-tight transition sm:px-3 sm:text-xs"
          :class="
            activeStepId === step.id
              ? 'border-[var(--ip-primary)]/35 bg-blue-50/90 text-[var(--ip-primary)] shadow-sm'
              : 'border-transparent bg-transparent text-slate-600 hover:border-slate-200/90 hover:bg-slate-50 hover:text-slate-900'
          "
          :title="step.label"
          @click="go(step.id)"
        >
          <span
            class="flex size-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold leading-none"
            :class="
              stepDone[step.id]
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : activeStepId === step.id
                  ? 'border-blue-200 bg-white text-[var(--ip-primary)]'
                  : 'border-slate-200 bg-white text-slate-400 group-hover:text-slate-500'
            "
            aria-hidden="true"
          >
            <span v-if="stepDone[step.id]">✓</span>
            <span v-else class="tabular-nums opacity-80">{{ i + 1 }}</span>
          </span>
          <span class="max-w-[7.5rem] truncate sm:max-w-[9rem]">{{ step.pillLabel }}</span>
        </button>
      </template>
    </div>
  </nav>
</template>
