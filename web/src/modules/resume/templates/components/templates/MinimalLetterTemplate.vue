<script setup lang="ts">
import LetterTemplate from '../layouts/LetterTemplate.vue'
import type { ResumeTemplateData } from '../../types'

defineProps<{ data: ResumeTemplateData }>()
</script>

<template>
  <LetterTemplate :data="data" accent="#262626" />
</template>
