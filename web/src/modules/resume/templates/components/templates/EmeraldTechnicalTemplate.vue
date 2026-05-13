<script setup lang="ts">
import EmeraldTechnicalLayout from './emerald/EmeraldTechnicalLayout.vue'
import type { ResumeTemplateData } from '../../types'

defineProps<{
  data: ResumeTemplateData
  /** Cor de acento (config do modelo); default mint referência */
  accent?: string
}>()
</script>

<template>
  <EmeraldTechnicalLayout :data="data" :accent="accent" />
</template>
