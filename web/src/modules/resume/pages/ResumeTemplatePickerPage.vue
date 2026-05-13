<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UiButton from '@/components/ui/UiButton.vue'
import type { ResumeModelCategory } from '@/modelos/resume/types'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import {
  resumeTemplateRegistry,
} from '@/modules/resume/templates/registry'
import { useResumeDraftStore } from '@/modules/resume/stores/useResumeDraftStore'

const FAVORITES_KEY = 'ip.resumeTemplateFavorites'

const route = useRoute()
const router = useRouter()
const draft = useResumeDraftStore()

const search = ref('')
const categoryFilter = ref<ResumeModelCategory | 'all'>('all')
const favorites = ref<Set<string>>(new Set())

const publicIdFromQuery = computed(() => {
  const q = route.query.publicId
  return typeof q === 'string' && q.trim() ? q.trim() : null
})

const categoryLabels: Record<ResumeModelCategory, string> = {
  moderno: 'Moderno',
  minimalista: 'Minimalista',
  corporativo: 'Corporativo',
  editorial: 'Editorial',
  tecnico: 'Técnico',
  executivo: 'Executivo',
}

const allCategories = computed(() =>
  (Object.keys(categoryLabels) as ResumeModelCategory[]).sort(),
)

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return
    favorites.value = new Set(parsed.filter((x) => typeof x === 'string'))
  } catch {
    /* ignore */
  }
}

function persistFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites.value]))
}

onMounted(() => {
  loadFavorites()
})

function toggleFavorite(key: string, ev: Event) {
  ev.preventDefault()
  ev.stopPropagation()
  const next = new Set(favorites.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  favorites.value = next
  persistFavorites()
}

const filteredTemplates = computed(() => {
  const q = search.value.trim().toLowerCase()
  return resumeTemplateRegistry.filter((t) => {
    if (categoryFilter.value !== 'all') {
      const cats = t.categories ?? []
      if (!cats.includes(categoryFilter.value)) return false
    }
    if (!q) return true
    const blob = [t.name, t.description, ...(t.tags ?? [])].join(' ').toLowerCase()
    return blob.includes(q)
  })
})

function sortedForDisplay(list: ResumeTemplateDefinition[]) {
  return [...list].sort((a, b) => {
    const fa = favorites.value.has(a.key) ? 1 : 0
    const fb = favorites.value.has(b.key) ? 1 : 0
    if (fa !== fb) return fb - fa
    return a.name.localeCompare(b.name)
  })
}

const displayList = computed(() => sortedForDisplay(filteredTemplates.value))

function useTemplate(template: ResumeTemplateDefinition) {
  draft.setLastPickedTemplateKey(template.key)
  const pid = publicIdFromQuery.value
  if (pid) {
    void router.push({
      name: 'resume-edit',
      params: { publicId: pid },
      query: { template: template.key },
    })
    return
  }
  void router.push({ name: 'resume-new', query: { template: template.key } })
}

watch(
  () => route.query.q,
  (v) => {
    if (typeof v === 'string') search.value = v
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 py-5 sm:px-6 sm:py-6">
      <header class="mx-auto w-full max-w-6xl">
        <p class="text-xs font-black uppercase tracking-[0.2em] text-[var(--ip-primary)]">Modelos</p>
        <h1 class="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Escolha o design do seu CV
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-slate-600">
          Filtre por estilo, pesquise por nome ou tags e avance para o editor com o preview ao vivo.
        </p>
      </header>

      <div class="mx-auto mt-6 flex w-full max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label class="relative block min-w-0 flex-1 lg:max-w-md">
          <span class="sr-only">Pesquisar modelos</span>
          <span
            class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            v-model="search"
            type="search"
            placeholder="Nome, descrição ou tags…"
            class="ip-input w-full rounded-xl py-2.5 pl-10 pr-3 text-sm"
          />
        </label>
        <p v-if="publicIdFromQuery" class="text-xs font-semibold text-slate-500">
          Está a alterar o modelo de um currículo existente. Ao continuar, o template será aplicado no editor.
        </p>
      </div>

      <div
        class="mx-auto mt-4 flex w-full max-w-6xl flex-wrap gap-2 border-b border-slate-200/80 pb-4"
        role="tablist"
        aria-label="Categorias"
      >
        <button
          type="button"
          class="rounded-full border px-3 py-1.5 text-xs font-bold transition"
          :class="
            categoryFilter === 'all'
              ? 'border-[var(--ip-primary)] bg-blue-50 text-[var(--ip-primary)]'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          "
          @click="categoryFilter = 'all'"
        >
          Todos
        </button>
        <button
          v-for="cat in allCategories"
          :key="cat"
          type="button"
          class="rounded-full border px-3 py-1.5 text-xs font-bold transition"
          :class="
            categoryFilter === cat
              ? 'border-[var(--ip-primary)] bg-blue-50 text-[var(--ip-primary)]'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          "
          @click="categoryFilter = cat"
        >
          {{ categoryLabels[cat] }}
        </button>
      </div>

      <div class="mx-auto mt-6 grid w-full max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="template in displayList"
          :key="template.key"
          class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-transparent transition duration-500 ease-out hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-xl hover:ring-slate-200/80"
        >
          <div class="relative aspect-[3/4] min-h-[200px] overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200/90">
            <img
              :src="template.previewImage"
              :alt="template.name"
              class="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900/25 to-transparent opacity-0 transition duration-500 group-hover:opacity-100"
              aria-hidden="true"
            />
            <div class="absolute left-2 top-2 flex flex-wrap gap-1">
              <span
                v-if="template.premium"
                class="rounded-full bg-amber-500/95 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow"
              >
                Premium
              </span>
              <span
                v-else
                class="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-700 shadow"
              >
                Grátis
              </span>
            </div>
            <button
              type="button"
              class="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/95 text-amber-500 shadow transition hover:scale-105"
              :aria-pressed="favorites.has(template.key)"
              :title="favorites.has(template.key) ? 'Remover dos favoritos' : 'Favorito'"
              @click="toggleFavorite(template.key, $event)"
            >
              <svg
                class="h-5 w-5"
                :class="favorites.has(template.key) ? 'fill-current' : 'fill-none stroke-current stroke-2'"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </button>
          </div>
          <div class="flex flex-1 flex-col gap-2 p-4">
            <div>
              <h2 class="text-base font-black text-slate-900">{{ template.name }}</h2>
              <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                {{ template.description }}
              </p>
            </div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in template.tags?.slice(0, 4) ?? []"
                :key="tag"
                class="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
              >
                {{ tag }}
              </span>
            </div>
            <div class="mt-auto pt-2">
              <UiButton color="blue" class="w-full" @click="useTemplate(template)">
                Usar este modelo
              </UiButton>
            </div>
          </div>
        </article>
      </div>

      <p
        v-if="displayList.length === 0"
        class="mx-auto mt-10 max-w-lg rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center text-sm text-slate-600"
      >
        Nenhum modelo corresponde aos filtros. Tente outra categoria ou limpe a pesquisa.
      </p>
    </div>
  </div>
</template>
