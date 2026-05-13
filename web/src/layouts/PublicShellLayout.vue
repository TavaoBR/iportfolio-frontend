<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/useAuthStore'

const auth = useAuthStore()
</script>

<template>
  <div class="ip-shell-bg min-h-screen text-slate-950 antialiased">
    <header class="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div
        class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 text-sm sm:px-6 lg:px-8"
      >
        <RouterLink :to="{ name: 'home' }" class="inline-flex items-center gap-3 font-black text-slate-950">
          <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--ip-primary)] text-xs text-white shadow-[0_14px_34px_rgba(58,134,255,0.28)]">iP</span>
          <span class="text-base">iPortfolio</span>
        </RouterLink>
        <nav class="flex flex-wrap items-center gap-4 text-slate-500">
          <RouterLink
            :to="{ name: 'home' }"
            class="hidden font-bold hover:text-slate-950 sm:inline"
            active-class="!text-slate-950"
          >
            Home
          </RouterLink>
          <RouterLink
            :to="{ name: 'templates-public' }"
            class="font-bold hover:text-slate-950"
            active-class="!text-slate-950"
          >
            Templates
          </RouterLink>
          <template v-if="!auth.isAuthenticated">
            <RouterLink :to="{ name: 'login' }" class="font-bold hover:text-slate-950">
              Entrar
            </RouterLink>
            <RouterLink
              :to="{ name: 'register' }"
              class="ip-button-primary px-4 py-2"
            >
              Registar
            </RouterLink>
          </template>
          <RouterLink
            v-else
            :to="{ name: 'dashboard' }"
            class="ip-button-primary px-4 py-2"
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
