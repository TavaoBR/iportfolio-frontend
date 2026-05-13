<script setup lang="ts">
defineProps<{
  accent: string
}>()
</script>

<template>
  <h2
    class="inline-flex px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-sm"
    :style="{ backgroundColor: accent }"
  >
    <slot />
  </h2>
</template>
