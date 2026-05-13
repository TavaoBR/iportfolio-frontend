<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    accent: string
    level?: string
    /** Fundo escuro (sidebar) */
    dark?: boolean
    /** Paleta para fundos claros quentes (carta / editorial) */
    tone?: 'cool' | 'warm'
  }>(),
  { dark: false, tone: 'cool' },
)

const barFill = computed(() => (props.dark ? 'rgba(255,255,255,0.92)' : props.accent))

const barWidth = computed(() => {
  const l = (props.level ?? '').toLowerCase()
  if (l.includes('avanç') || l.includes('flu')) return '94%'
  if (l.includes('inter') || l.includes('pleno')) return '78%'
  if (l.includes('bás') || l.includes('junior')) return '52%'
  return '72%'
})
</script>

<template>
  <div class="space-y-1" :class="props.dark ? 'text-white' : ''">
    <div class="flex items-baseline justify-between gap-2">
      <p
        class="text-[11px] font-bold"
        :class="
          props.dark
            ? 'text-white'
            : props.tone === 'warm'
              ? 'text-stone-900'
              : 'text-zinc-900'
        "
      >
        {{ props.name }}
      </p>
      <p
        v-if="props.level"
        class="text-[9px] font-semibold uppercase tracking-wider"
        :class="
          props.dark
            ? 'text-white/55'
            : props.tone === 'warm'
              ? 'text-stone-500'
              : 'text-zinc-400'
        "
      >
        {{ props.level }}
      </p>
    </div>
    <div
      class="h-1.5 overflow-hidden rounded-full"
      :class="props.dark ? 'bg-white/15' : props.tone === 'warm' ? 'bg-stone-200/90' : 'bg-zinc-100'"
    >
      <div
        class="h-full rounded-full transition-[width] duration-500"
        :style="{ width: barWidth, backgroundColor: barFill }"
      />
    </div>
  </div>
</template>
