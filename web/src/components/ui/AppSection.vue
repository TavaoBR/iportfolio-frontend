<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <section class="ip-card p-5">
    <div v-if="title || description || $slots.actions" class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 v-if="title" class="text-base font-black text-slate-950">{{ title }}</h2>
        <p v-if="description" class="mt-1 text-sm leading-6 text-slate-500">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex flex-wrap gap-2">
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </section>
</template>
