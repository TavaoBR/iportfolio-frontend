<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  level?: string
}>()

const barWidth = computed(() => {
  const l = (props.level ?? '').toLowerCase()
  if (l.includes('avanç') || l.includes('flu') || l.includes('advanced')) return '92%'
  if (l.includes('inter') || l.includes('pleno') || l.includes('intermediate')) return '76%'
  if (l.includes('bás') || l.includes('junior') || l.includes('basic')) return '52%'
  return '72%'
})
</script>

<template>
  <div class="space-y-1">
    <p class="text-[10.5px] font-bold tracking-tight text-[var(--em-text)]">{{ props.name }}</p>
    <div class="h-2 overflow-hidden bg-[var(--em-bar-track)]">
      <div class="h-full bg-[var(--em-bar-fill)] transition-[width] duration-300" :style="{ width: barWidth }" />
    </div>
  </div>
</template>
