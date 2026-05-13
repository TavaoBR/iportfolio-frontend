<script setup lang="ts">
import type { ResumeTemplateEntry } from '../../types'

defineProps<{
  entry: ResumeTemplateEntry
  accent: string
}>()
</script>

<template>
  <div class="border-l-2 pl-4" :style="{ borderColor: accent }">
    <h3 class="text-sm font-black uppercase tracking-tight text-slate-900">{{ entry.title }}</h3>
    <p class="text-[11px] font-bold text-slate-500">{{ entry.subtitle }}<span v-if="entry.meta"> · {{ entry.meta }}</span></p>
    <p v-if="entry.description" class="mt-2 text-[11px] leading-5 text-slate-600">{{ entry.description }}</p>
  </div>
</template>
