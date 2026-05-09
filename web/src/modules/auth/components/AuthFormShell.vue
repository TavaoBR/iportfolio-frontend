<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <section
    class="w-full max-w-[390px] rounded-2xl border border-white/10 bg-[#111019] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6"
  >
    <div class="mb-5 text-center">
      <p class="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500">iPortfolio</p>
      <h1 class="text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">{{ title }}</h1>
      <p class="mx-auto mt-2 max-w-[320px] text-xs leading-5 text-gray-400">{{ subtitle }}</p>
    </div>

    <slot />
  </section>
</template>

