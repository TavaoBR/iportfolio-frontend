<script setup lang="ts">
import SplitTemplate from '../layouts/SplitTemplate.vue'
import type { ResumeTemplateData } from '../../types'

defineProps<{ data: ResumeTemplateData }>()
</script>

<template>
  <SplitTemplate :data="data" accent="#1f344f" />
</template>
