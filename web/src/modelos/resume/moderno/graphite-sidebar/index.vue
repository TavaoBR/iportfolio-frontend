<script setup lang="ts">
import type { ResumeTemplateMapping } from '@/modelos/resume/types'
import type { ResumeTemplateData } from '@/modules/resume/templates/types'
import GraphiteSidebarTemplate from '@/modules/resume/templates/components/templates/GraphiteSidebarTemplate.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
  mapping?: ResumeTemplateMapping
}>()
</script>

<template>
  <GraphiteSidebarTemplate :data="data" />
</template>
