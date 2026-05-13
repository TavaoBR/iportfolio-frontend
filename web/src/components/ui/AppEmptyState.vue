<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center">
    <div class="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-xl text-[var(--ip-primary)]">
      +
    </div>
    <h3 class="font-black text-slate-950">{{ title }}</h3>
    <p v-if="description" class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{{ description }}</p>
    <div v-if="$slots.default" class="mt-5 flex justify-center">
      <slot />
    </div>
  </div>
</template>
