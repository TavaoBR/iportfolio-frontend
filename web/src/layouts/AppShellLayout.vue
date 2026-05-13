<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import UiButton from '@/components/ui/UiButton.vue'
import AppSidebar from '@/layouts/AppSidebar.vue'
import { useAppShellChromeStore } from '@/layouts/useAppShellChromeStore'

const SIDEBAR_COLLAPSED_KEY = 'ip.sidebarCollapsed'

const route = useRoute()
const chrome = useAppShellChromeStore()

const sidebarCollapsed = ref(
  typeof localStorage !== 'undefined' && localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1',
)

watch(sidebarCollapsed, (v) => {
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, v ? '1' : '0')
})

type MobileNavName = 'dashboard' | 'content-blocks' | 'resumes' | 'templates-app' | 'portfolio'

const mobileNav: ReadonlyArray<{
  name: MobileNavName
  label: string
  icon: 'home' | 'layout' | 'doc' | 'layers' | 'globe'
}> = [
  { name: 'dashboard', label: 'Início', icon: 'home' },
  { name: 'content-blocks', label: 'Perfil', icon: 'layout' },
  { name: 'resumes', label: 'CV', icon: 'doc' },
  { name: 'templates-app', label: 'Design', icon: 'layers' },
  { name: 'portfolio', label: 'Site', icon: 'globe' },
]

const activeName = computed(() => route.name)

function isMobileNavActive(name: MobileNavName): boolean {
  const n = activeName.value
  if (name === 'resumes') {
    return (
      n === 'resumes' ||
      n === 'resume-new' ||
      n === 'resume-edit' ||
      n === 'resume-pick-template'
    )
  }
  return n === name
}

const isResumeEditorShell = computed(() =>
  Boolean(route.matched.some((r) => r.meta.resumeEditorShell === true)),
)

const breadcrumbs = computed(() => {
  const matched = [...route.matched].reverse()
  const crumbMeta = matched.find(
    (r) => Array.isArray(r.meta.breadcrumb) && r.meta.breadcrumb.length > 0,
  )
  if (crumbMeta?.meta.breadcrumb?.length) return [...crumbMeta.meta.breadcrumb]
  const title = matched.find((r) => typeof r.meta.title === 'string')?.meta.title
  if (typeof title === 'string') return [{ label: title }]
  return [{ label: 'Visão geral' }]
})

const hideResumeCta = computed(() =>
  ['resume-new', 'resume-edit', 'resume-pick-template'].includes(String(activeName.value)),
)
</script>

<template>
  <!-- --app-sidebar-w: largura da sidebar em desktop; sidebar fixed + pl aqui alinham topo com o viewport -->
  <div
    class="ip-shell-bg min-h-screen w-full antialiased"
    :style="{ '--app-sidebar-w': sidebarCollapsed ? '68px' : '220px' }"
  >
    <div
      class="min-h-screen w-full overflow-hidden text-[var(--ip-text)] lg:h-screen lg:min-h-0"
    >
      <AppSidebar v-model:collapsed="sidebarCollapsed" />

      <div
        class="flex min-h-0 min-w-0 flex-col bg-slate-50/80 transition-[padding] duration-200 ease-out lg:h-screen lg:min-h-0 lg:bg-transparent lg:pl-[var(--app-sidebar-w)]"
      >
        <header
          class="sticky top-0 z-30 m-0 border-b border-slate-200 bg-white p-0 shadow-sm lg:static lg:z-auto"
        >
          <div
            class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-3.5"
          >
            <div class="flex min-w-0 flex-1 items-center gap-3">
              <RouterLink
                :to="{ name: 'dashboard' }"
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ip-primary)] text-xs font-black text-white lg:hidden"
              >
                iP
              </RouterLink>
              <nav class="min-w-0 text-sm font-semibold text-slate-500" aria-label="Trilho">
                <ol class="flex flex-wrap items-center gap-x-1 gap-y-0.5">
                  <template v-for="(crumb, i) in breadcrumbs" :key="`${i}-${crumb.label}`">
                    <li v-if="i > 0" class="text-slate-300" aria-hidden="true">/</li>
                    <li class="min-w-0 truncate">
                      <RouterLink
                        v-if="crumb.to && i < breadcrumbs.length - 1"
                        :to="crumb.to"
                        class="text-slate-500 transition hover:text-[var(--ip-primary)]"
                      >
                        {{ crumb.label }}
                      </RouterLink>
                      <span
                        v-else
                        class="font-bold text-slate-900"
                        :class="i < breadcrumbs.length - 1 ? 'text-slate-500' : ''"
                      >
                        {{ crumb.label }}
                      </span>
                    </li>
                  </template>
                </ol>
              </nav>
            </div>

            <UiButton
              v-if="!hideResumeCta"
              color="blue"
              class="w-full shrink-0 sm:ml-auto sm:w-auto"
              :to="{ name: 'resume-pick-template' }"
            >
              + Criar currículo
            </UiButton>
          </div>

          <div
            v-if="chrome.contextBarVisible"
            class="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/90 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
            <p class="min-w-0 truncate text-base font-black text-slate-900">
              {{ chrome.contextDocumentTitle }}
            </p>
            <div class="flex shrink-0 flex-wrap gap-2">
              <UiButton
                color="alternative"
                :disabled="chrome.contextSaveLoading"
                @click="chrome.runContextCancel"
              >
                Cancelar
              </UiButton>
              <UiButton
                color="blue"
                :loading="chrome.contextSaveLoading"
                @click="chrome.runContextSave"
              >
                Guardar
              </UiButton>
            </div>
          </div>
        </header>

        <div
          class="flex min-h-0 flex-1 flex-col pb-24 lg:pb-0"
          :class="isResumeEditorShell ? 'overflow-hidden' : 'overflow-auto'"
        >
          <div
            class="w-full flex-1"
            :class="
              isResumeEditorShell
                ? 'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5'
                : 'p-4 sm:p-5 lg:p-6'
            "
          >
            <RouterView />
          </div>
        </div>
      </div>
    </div>

    <nav
      class="fixed bottom-3 left-3 right-3 z-40 flex rounded-2xl border border-slate-200 bg-white px-1 py-1.5 text-slate-600 shadow-lg lg:hidden"
      aria-label="Navegação principal"
    >
      <RouterLink
        v-for="item in mobileNav"
        :key="item.name"
        :to="{ name: item.name }"
        class="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-bold text-slate-500 transition"
        :class="{
          'bg-blue-50 text-[var(--ip-primary)]': isMobileNavActive(item.name),
        }"
      >
        <span class="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-current">
          <svg v-if="item.icon === 'home'" class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <svg v-else-if="item.icon === 'layout'" class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <svg v-else-if="item.icon === 'doc'" class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else-if="item.icon === 'layers'" class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <svg v-else class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <span class="max-w-[4.5rem] truncate">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>
