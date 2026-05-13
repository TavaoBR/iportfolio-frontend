<script setup lang="ts">
import TechnicalTemplate from '../layouts/TechnicalTemplate.vue'
import type { ResumeTemplateData } from '../../types'

defineProps<{ data: ResumeTemplateData }>()
</script>

<template>
  <TechnicalTemplate :data="data" accent="#71717a" />
</template>
