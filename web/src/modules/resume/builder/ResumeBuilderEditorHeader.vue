<script setup lang="ts">
defineProps<{
  /** 0–100 */
  percent: number
}>()
</script>

<template>
  <div class="mb-4 flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
    <div class="flex min-w-0 flex-1 items-center gap-3">
      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-xs font-black tabular-nums text-[var(--ip-primary)] shadow-sm ring-2 ring-slate-50"
        aria-hidden="true"
      >
        {{ Math.min(100, Math.max(0, Math.round(percent))) }}%
      </div>
      <div class="min-w-0">
        <p class="text-xs font-bold text-slate-800">Progresso do currículo</p>
        <p class="mt-0.5 text-[10px] leading-snug text-slate-500">
          Uma etapa de cada vez à esquerda; o preview à direita acompanha em tempo real.
        </p>
      </div>
    </div>
    <div class="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2">
      <slot name="secondary" />
      <slot name="actions" />
    </div>
  </div>
</template>
