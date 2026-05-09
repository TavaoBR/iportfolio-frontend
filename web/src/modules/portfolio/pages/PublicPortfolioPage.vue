<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAsyncData } from '@/composables/useAsyncData'
import { getPublicPortfolio } from '../services/portfolioApi'
import type { PublicPortfolioPayload } from '../types/portfolio.types'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, loading, error, run } = useAsyncData<PublicPortfolioPayload>()

onMounted(() => {
  void run(() => getPublicPortfolio(slug.value))
})
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <header class="border-b border-gray-200 bg-gray-50 px-4 py-6 dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto max-w-3xl">
        <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Portfólio público
        </p>
        <h1 class="mt-1 text-2xl font-bold">{{ data?.title ?? slug }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          <code class="text-xs">GET /api/public/portfolio/{{ slug }}</code>
        </p>
      </div>
    </header>
    <main class="mx-auto max-w-3xl px-4 py-10">
      <div v-if="loading" class="animate-pulse text-gray-500">A carregar…</div>
      <p v-else-if="error" class="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950/40 dark:text-red-200">
        {{ error }}
      </p>
      <article v-else>
        <pre class="rounded-xl bg-gray-50 p-4 text-sm dark:bg-gray-900">{{ JSON.stringify(data, null, 2) }}</pre>
      </article>
    </main>
  </div>
</template>
