<script setup lang="ts">
withDefaults(
  defineProps<{
    strong?: boolean
    padded?: boolean
  }>(),
  {
    strong: false,
    padded: true,
  },
)
</script>

<template>
  <section :class="[strong ? 'ip-card-strong' : 'ip-card', padded ? 'p-4 sm:p-5' : '']">
    <slot />
  </section>
</template>
