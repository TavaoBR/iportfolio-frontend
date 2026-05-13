<script setup lang="ts">
import type { ResumeTemplateMapping } from '@/modelos/resume/types'
import type { ResumeTemplateData } from '@/modules/resume/templates/types'
import TealSidebarTemplate from '@/modules/resume/templates/components/templates/TealSidebarTemplate.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
  mapping?: ResumeTemplateMapping
}>()
</script>

<template>
  <TealSidebarTemplate :data="data" />
</template>
