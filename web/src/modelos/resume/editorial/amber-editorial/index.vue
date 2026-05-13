<script setup lang="ts">
import type { ResumeTemplateMapping } from '@/modelos/resume/types'
import type { ResumeTemplateData } from '@/modules/resume/templates/types'
import AmberEditorialTemplate from '@/modules/resume/templates/components/templates/AmberEditorialTemplate.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
  mapping?: ResumeTemplateMapping
}>()
</script>

<template>
  <AmberEditorialTemplate :data="data" />
</template>
