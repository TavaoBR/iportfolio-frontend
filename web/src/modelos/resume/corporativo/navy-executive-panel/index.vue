<script setup lang="ts">
import type { ResumeTemplateMapping } from '@/modelos/resume/types'
import type { ResumeTemplateData } from '@/modules/resume/templates/types'
import NavyExecutivePanelTemplate from '@/modules/resume/templates/components/templates/NavyExecutivePanelTemplate.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
  mapping?: ResumeTemplateMapping
}>()
</script>

<template>
  <NavyExecutivePanelTemplate :data="data" />
</template>
