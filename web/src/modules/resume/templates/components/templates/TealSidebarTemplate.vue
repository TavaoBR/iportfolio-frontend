<script setup lang="ts">
import SidebarTemplate from '../layouts/SidebarTemplate.vue'
import type { ResumeTemplateData } from '../../types'

defineProps<{ data: ResumeTemplateData }>()
</script>

<template>
  <SidebarTemplate :data="data" accent="#0f766e" />
</template>
