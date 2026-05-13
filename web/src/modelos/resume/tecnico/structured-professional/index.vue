<script setup lang="ts">
import type { ResumeTemplateMapping } from '@/modelos/resume/types'
import type { ResumeTemplateData } from '@/modules/resume/templates/types'
import StructuredProfessionalTemplate from '@/modules/resume/templates/components/templates/StructuredProfessionalTemplate.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
  mapping?: ResumeTemplateMapping
}>()
</script>

<template>
  <StructuredProfessionalTemplate :data="data" />
</template>
