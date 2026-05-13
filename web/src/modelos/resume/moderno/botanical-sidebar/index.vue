<script setup lang="ts">
import type { ResumeTemplateMapping } from '@/modelos/resume/types'
import type { ResumeTemplateData } from '@/modules/resume/templates/types'
import BotanicalSidebarTemplate from '@/modules/resume/templates/components/templates/BotanicalSidebarTemplate.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
  mapping?: ResumeTemplateMapping
}>()
</script>

<template>
  <BotanicalSidebarTemplate :data="data" />
</template>
