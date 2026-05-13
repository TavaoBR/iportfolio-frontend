<script setup lang="ts">
import type { ResumeTemplateMapping } from '@/modelos/resume/types'
import type { ResumeTemplateData } from '@/modules/resume/templates/types'
import CoverLetterGrayTemplate from '@/modules/resume/templates/components/templates/CoverLetterGrayTemplate.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
  mapping?: ResumeTemplateMapping
}>()
</script>

<template>
  <CoverLetterGrayTemplate :data="data" />
</template>
