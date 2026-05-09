<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/useAuthStore'

const auth = useAuthStore()
const route = useRoute()

const navGroups = [
  {
    label: 'Início',
    items: [{ name: 'dashboard' as const, label: 'Visão geral', icon: '▣' }],
  },
  {
    label: 'Perfil profissional',
    description: 'Dados que alimentam CV e portfólio',
    items: [
      { name: 'profile' as const, label: 'Dados pessoais', icon: '○' },
      { name: 'content-blocks' as const, label: 'Resumo, skills e experiências', icon: '▤' },
    ],
  },
  {
    label: 'Currículo',
    description: 'Gerar, personalizar e exportar',
    items: [
      { name: 'resumes' as const, label: 'Criar / editar CV', icon: '□' },
      { name: 'templates-app' as const, label: 'Templates e visual', icon: '◇' },
    ],
  },
  {
    label: 'Portfólio',
    description: 'Página pública e compartilhamento',
    items: [{ name: 'portfolio' as const, label: 'Site público', icon: '◌' }],
  },
] as const

const mobileNav = [
  { name: 'dashboard' as const, label: 'Início', icon: '▣' },
  { name: 'content-blocks' as const, label: 'Perfil', icon: '▤' },
  { name: 'resumes' as const, label: 'CV', icon: '□' },
  { name: 'portfolio' as const, label: 'Portfólio', icon: '◌' },
] as const

const active = computed(() => route.name)
const pageTitle = computed(() => {
  const matched = [...route.matched].reverse()
  return matched.find((item) => typeof item.meta.title === 'string')?.meta.title ?? 'Dashboard'
})
</script>

<template>
  <div class="min-h-screen w-full bg-black antialiased">
    <div class="flex h-screen w-full overflow-hidden bg-black text-gray-100">
      <aside class="hidden w-[240px] shrink-0 border-r border-white/10 bg-[#111019] lg:flex lg:flex-col">
        <div class="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xs font-black text-black">iP</span>
          <span class="text-lg font-black tracking-tight text-white">iPortfolio</span>
        </div>
        <nav class="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
          <section v-for="group in navGroups" :key="group.label">
            <div class="mb-2 px-3">
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                {{ group.label }}
              </p>
              <p v-if="'description' in group" class="mt-1 text-[11px] leading-4 text-gray-700">
                {{ group.description }}
              </p>
            </div>
            <div class="space-y-1">
              <RouterLink
                v-for="item in group.items"
                :key="item.name"
                :to="{ name: item.name }"
                class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-white/5 hover:text-white"
                :class="{
                  'bg-violet-600 text-white shadow-sm shadow-violet-950/30': active === item.name,
                }"
              >
                <span class="flex h-6 w-6 items-center justify-center rounded-lg text-xs text-gray-400 group-hover:text-white">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </RouterLink>
            </div>
          </section>
        </nav>
        <div class="border-t border-white/10 p-4">
          <button
            type="button"
            class="flex w-full items-center justify-center rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-bold text-gray-300 transition hover:bg-white/5 hover:text-white"
            @click="auth.signOut()"
          >
            Sair
          </button>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="flex min-h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#111019] px-4 sm:px-6">
          <div class="flex min-w-0 items-center gap-3">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xs font-black text-black lg:hidden">iP</span>
            <span class="text-2xl font-black tracking-tight text-white">{{ pageTitle }}</span>
          </div>

          <div class="flex items-center gap-2">
            <label class="hidden sm:block">
              <span class="sr-only">Pesquisar</span>
              <input
                type="search"
                placeholder="Search"
                class="w-64 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500"
              />
            </label>
            <button class="hidden h-10 w-10 rounded-xl border border-white/10 bg-black/30 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white sm:block">
              ♡
            </button>
            <button class="hidden h-10 w-10 rounded-xl border border-white/10 bg-black/30 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white sm:block">
              ♢
            </button>
          </div>
        </header>
        <div class="flex min-h-0 flex-1 flex-col overflow-auto bg-black pb-20 lg:pb-0">
          <div class="w-full flex-1 p-4 sm:p-6">
            <RouterView />
          </div>
        </div>
      </div>
    </div>

    <nav
      class="fixed bottom-3 left-3 right-3 z-40 flex rounded-2xl border border-white/10 bg-[#111019]/95 px-2 py-2 text-gray-100 shadow-2xl backdrop-blur lg:hidden"
    >
      <RouterLink
        v-for="item in mobileNav"
        :key="item.name"
        :to="{ name: item.name }"
        class="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] font-medium text-gray-500"
        :class="{
          'bg-violet-600 font-semibold text-white': active === item.name,
        }"
      >
        <span class="text-base leading-none">{{ item.icon }}</span>
        <span class="truncate">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>
