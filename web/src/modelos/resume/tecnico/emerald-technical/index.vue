<script setup lang="ts">
import type { ResumeTemplateMapping } from '@/modelos/resume/types'
import type { ResumeTemplateData } from '@/modules/resume/templates/types'
import EmeraldTechnicalTemplate from '@/modules/resume/templates/components/templates/EmeraldTechnicalTemplate.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
  mapping?: ResumeTemplateMapping
}>()
</script>

<template>
  <EmeraldTechnicalTemplate :data="data" :accent="accent" />
</template>
