<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <section
    class="ip-card-strong w-full max-w-[440px] p-6 sm:p-7"
  >
    <div class="mb-5 text-center">
      <p class="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--ip-primary)]">iPortfolio</p>
      <h1 class="text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-3xl">{{ title }}</h1>
      <p class="mx-auto mt-2 max-w-[340px] text-sm leading-6 text-slate-500">{{ subtitle }}</p>
    </div>

    <slot />
  </section>
</template>

