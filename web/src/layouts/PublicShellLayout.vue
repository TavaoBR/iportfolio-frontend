<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/useAuthStore'

const auth = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-[#f5f6f8] text-gray-950 antialiased">
    <header class="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div
        class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 text-sm sm:px-6 lg:px-8"
      >
        <RouterLink :to="{ name: 'home' }" class="inline-flex items-center gap-2 font-black text-gray-950">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-xs text-white">iP</span>
          <span>iPortfolio</span>
        </RouterLink>
        <nav class="flex flex-wrap items-center gap-3 text-gray-600">
          <RouterLink
            :to="{ name: 'home' }"
            class="hidden hover:text-gray-950 sm:inline"
            active-class="font-semibold text-gray-950"
          >
            Home
          </RouterLink>
          <RouterLink
            :to="{ name: 'templates-public' }"
            class="hover:text-gray-950"
            active-class="font-semibold text-gray-950"
          >
            Templates
          </RouterLink>
          <template v-if="!auth.isAuthenticated">
            <RouterLink :to="{ name: 'login' }" class="hover:text-gray-950">
              Entrar
            </RouterLink>
            <RouterLink
              :to="{ name: 'register' }"
              class="rounded-xl bg-gray-950 px-4 py-2 font-bold text-white hover:bg-gray-800"
            >
              Registar
            </RouterLink>
          </template>
          <RouterLink
            v-else
            :to="{ name: 'dashboard' }"
            class="rounded-xl bg-gray-950 px-4 py-2 font-bold text-white hover:bg-gray-800"
          >
            App
          </RouterLink>
        </nav>
      </div>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
