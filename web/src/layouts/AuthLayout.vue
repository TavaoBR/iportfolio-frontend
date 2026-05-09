<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-6 text-gray-100 antialiased"
  >
    <div class="relative flex w-full justify-center">
      <RouterView />
    </div>
  </div>
</template>
