<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div
    class="ip-shell-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-6 text-slate-950 antialiased"
  >
    <div class="pointer-events-none absolute left-8 top-8 hidden h-28 w-28 rounded-[2rem] border border-white/70 bg-white/40 shadow-xl backdrop-blur sm:block" />
    <div class="pointer-events-none absolute bottom-10 right-10 hidden h-40 w-40 rounded-full bg-blue-400/15 blur-3xl lg:block" />
    <div class="relative flex w-full justify-center">
      <RouterView />
    </div>
  </div>
</template>
