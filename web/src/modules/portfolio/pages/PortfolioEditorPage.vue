<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiInput from '@/components/ui/UiInput.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import {
  createPortfolioSite,
  listPortfolioSites,
  publishPortfolioSite,
  updatePortfolioSite,
} from '../services/portfolioApi'
import {
  createPortfolioSection,
  deletePortfolioSection,
  listPortfolioSections,
} from '../services/portfolioSectionsApi'
import type { PortfolioLayoutType, PortfolioSection, PortfolioSite } from '../types/portfolio.types'
import { ApiError } from '@/types/api'

const { data, loading, error, run } = useAsyncData<PortfolioSite[]>()
const {
  data: sections,
  loading: sectionsLoading,
  error: sectionsError,
  run: loadSections,
} = useAsyncData<PortfolioSection[]>()

const selectedId = ref<number | null>(null)
const siteForm = ref({ title: '', slug: '', subtitle: '', template_key: '', is_public: false })
const sectionForm = ref({
  section_type: 'projects',
  layout_type: 'grid' as PortfolioLayoutType,
  is_visible: true,
})
const actionError = ref('')
const actionMessage = ref('')
const savingSite = ref(false)
const creatingSection = ref(false)
const deletingSectionId = ref<number | null>(null)
const publishing = ref(false)

const selectedSite = computed(() => data.value?.find((site) => site.id === selectedId.value) ?? null)

onMounted(() => {
  void run(() => listPortfolioSites())
})

watch(
  data,
  (sites) => {
    if (!selectedId.value && sites?.[0]) {
      selectedId.value = sites[0].id
    }
  },
  { immediate: true },
)

watch(
  selectedSite,
  (site) => {
    if (!site) {
      siteForm.value = { title: '', slug: '', subtitle: '', template_key: '', is_public: false }
      return
    }

    siteForm.value = {
      title: site.title ?? '',
      slug: site.slug ?? '',
      subtitle: site.subtitle ?? '',
      template_key: site.template_key ?? '',
      is_public: site.is_public,
    }
    void loadSections(() => listPortfolioSections(site.id))
  },
  { immediate: true },
)

function getErrorMessage(e: unknown, fallback: string) {
  return e instanceof ApiError ? e.message : fallback
}

async function refreshSites() {
  await run(() => listPortfolioSites())
}

async function saveSite() {
  actionError.value = ''
  actionMessage.value = ''
  savingSite.value = true

  try {
    if (selectedId.value) {
      await updatePortfolioSite(selectedId.value, {
        title: siteForm.value.title,
        slug: siteForm.value.slug,
        subtitle: siteForm.value.subtitle || null,
        template_key: siteForm.value.template_key || null,
        is_public: siteForm.value.is_public,
      })
      actionMessage.value = 'Portfólio salvo.'
    } else {
      const site = await createPortfolioSite({
        title: siteForm.value.title,
        slug: siteForm.value.slug,
        subtitle: siteForm.value.subtitle || null,
        template_key: siteForm.value.template_key || null,
      })
      selectedId.value = site.id
      actionMessage.value = 'Portfólio criado.'
    }
    await refreshSites()
  } catch (e) {
    actionError.value = getErrorMessage(e, 'Não foi possível salvar o portfólio.')
  } finally {
    savingSite.value = false
  }
}

async function newSite() {
  selectedId.value = null
  siteForm.value = { title: '', slug: '', subtitle: '', template_key: '', is_public: false }
}

async function publishSite() {
  if (!selectedId.value) return

  actionError.value = ''
  actionMessage.value = ''
  publishing.value = true

  try {
    await publishPortfolioSite(selectedId.value)
    await refreshSites()
    actionMessage.value = 'Portfólio publicado.'
  } catch (e) {
    actionError.value = getErrorMessage(e, 'Não foi possível publicar o portfólio.')
  } finally {
    publishing.value = false
  }
}

async function addSection() {
  if (!selectedId.value) return

  actionError.value = ''
  actionMessage.value = ''
  creatingSection.value = true

  try {
    await createPortfolioSection(selectedId.value, {
      section_type: sectionForm.value.section_type,
      layout_type: sectionForm.value.layout_type,
      is_visible: sectionForm.value.is_visible,
      position: (sections.value?.length ?? 0) + 1,
      settings: null,
    })
    await loadSections(() => listPortfolioSections(selectedId.value as number))
    actionMessage.value = 'Secção adicionada.'
  } catch (e) {
    actionError.value = getErrorMessage(e, 'Não foi possível adicionar a secção.')
  } finally {
    creatingSection.value = false
  }
}

async function removeSection(sectionId: number) {
  if (!selectedId.value) return

  deletingSectionId.value = sectionId
  actionError.value = ''
  actionMessage.value = ''

  try {
    await deletePortfolioSection(selectedId.value, sectionId)
    await loadSections(() => listPortfolioSections(selectedId.value as number))
    actionMessage.value = 'Secção removida.'
  } catch (e) {
    actionError.value = getErrorMessage(e, 'Não foi possível remover a secção.')
  } finally {
    deletingSectionId.value = null
  }
}
</script>

<template>
  <div class="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
    <section class="ip-card p-5">
      <div class="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-black text-slate-950">Portfólios</h1>
          <p class="mt-1 text-sm text-slate-500">Crie e publique seu site profissional.</p>
        </div>
        <button class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600" @click="newSite">
          Novo
        </button>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="n in 3" :key="n" class="h-20 animate-pulse rounded-3xl bg-slate-100" />
      </div>
      <p v-else-if="error" class="rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-600">{{ error }}</p>
      <div v-else class="space-y-3">
        <button
          v-for="site in data ?? []"
          :key="site.id"
          type="button"
          class="w-full rounded-2xl border p-4 text-left transition"
          :class="selectedId === site.id ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200'"
          @click="selectedId = site.id"
        >
          <span class="block font-black text-slate-950">{{ site.title }}</span>
          <span class="mt-1 block text-xs text-slate-500">/{{ site.slug }}</span>
        </button>
        <p v-if="!(data?.length)" class="rounded-3xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
          Nenhum portfólio criado ainda.
        </p>
      </div>
    </section>

    <section class="space-y-5">
      <div class="ip-card-strong p-5">
        <h2 class="text-xl font-black text-slate-950">{{ selectedId ? 'Editar portfólio' : 'Criar portfólio' }}</h2>

        <form class="mt-5 grid gap-4 lg:grid-cols-2" @submit.prevent="saveSite">
          <UiInput
            v-model="siteForm.title"
            label="Título"
            required
          />
          <UiInput
            v-model="siteForm.slug"
            label="Slug"
            placeholder="meu-portfolio"
            required
          />
          <UiInput
            v-model="siteForm.subtitle"
            label="Subtítulo"
          />
          <UiInput
            v-model="siteForm.template_key"
            label="Template key"
          />
          <label class="flex items-center gap-2 text-sm font-bold text-slate-600">
            <input v-model="siteForm.is_public" type="checkbox" class="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-600" />
            Público
          </label>
          <div class="flex flex-wrap justify-end gap-2 lg:col-span-2">
            <UiButton v-if="selectedId" type="button" color="alternative" :loading="publishing" @click="publishSite">
              Publicar
            </UiButton>
            <UiButton type="submit" color="blue" :loading="savingSite">
              Salvar portfólio
            </UiButton>
          </div>
        </form>

        <p v-if="actionError" class="mt-4 rounded-3xl bg-red-50 p-3 text-sm font-bold text-red-600">{{ actionError }}</p>
        <p v-if="actionMessage" class="mt-4 rounded-3xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{{ actionMessage }}</p>
      </div>

      <div class="ip-card p-5">
        <h2 class="text-xl font-black text-slate-950">Secções do portfólio</h2>
        <p class="mt-1 text-sm text-slate-500">Defina quais blocos aparecem na página pública.</p>

        <form class="mt-5 grid gap-4 lg:grid-cols-[1fr_180px_auto]" @submit.prevent="addSection">
          <UiInput
            v-model="sectionForm.section_type"
            label="Tipo"
            placeholder="projects"
            required
          />
          <label class="block">
            <span class="ip-label">Layout</span>
            <select
              v-model="sectionForm.layout_type"
              class="ip-input text-sm"
            >
              <option value="grid">Grid</option>
              <option value="list">Lista</option>
              <option value="cards">Cards</option>
              <option value="timeline">Timeline</option>
              <option value="simple">Simples</option>
            </select>
          </label>
          <div class="flex items-end">
            <UiButton type="submit" color="blue" class="w-full" :loading="creatingSection" :disabled="!selectedId">
              Adicionar
            </UiButton>
          </div>
        </form>

        <div class="mt-5">
          <div v-if="sectionsLoading" class="h-28 animate-pulse rounded-3xl bg-slate-100" />
          <p v-else-if="sectionsError" class="rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-600">{{ sectionsError }}</p>
          <div v-else-if="(sections?.length ?? 0) > 0" class="grid gap-3 md:grid-cols-2">
            <article v-for="section in sections" :key="section.id" class="rounded-3xl border border-slate-200 bg-white p-4">
              <p class="font-black text-slate-950">{{ section.section_type }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ section.layout_type }}</p>
              <div class="mt-4 flex justify-end">
                <UiButton size="xs" color="alternative" :loading="deletingSectionId === section.id" @click="removeSection(section.id)">
                  Remover
                </UiButton>
              </div>
            </article>
          </div>
          <p v-else class="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            Selecione ou crie um portfólio para adicionar secções.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
