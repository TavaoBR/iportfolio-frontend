<script setup lang="ts">
import ExecutiveTemplate from '../layouts/ExecutiveTemplate.vue'
import type { ResumeTemplateData } from '../../types'

defineProps<{ data: ResumeTemplateData }>()
</script>

<template>
  <ExecutiveTemplate :data="data" accent="#d97706" />
</template>
