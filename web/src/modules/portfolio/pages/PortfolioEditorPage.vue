<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { FwbButton, FwbInput } from 'flowbite-vue'
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
    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5">
      <div class="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-black text-white">Portfólios</h1>
          <p class="mt-1 text-sm text-gray-500">Crie e publique seu site profissional.</p>
        </div>
        <button class="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-gray-300" @click="newSite">
          Novo
        </button>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="n in 3" :key="n" class="h-20 animate-pulse rounded-2xl bg-white/10" />
      </div>
      <p v-else-if="error" class="rounded-xl bg-red-500/10 p-4 text-sm text-red-200">{{ error }}</p>
      <div v-else class="space-y-3">
        <button
          v-for="site in data ?? []"
          :key="site.id"
          type="button"
          class="w-full rounded-2xl border p-4 text-left transition"
          :class="selectedId === site.id ? 'border-violet-600 bg-violet-600/10' : 'border-white/10 bg-black/20 hover:bg-white/5'"
          @click="selectedId = site.id"
        >
          <span class="block font-black text-white">{{ site.title }}</span>
          <span class="mt-1 block text-xs text-gray-500">/{{ site.slug }}</span>
        </button>
        <p v-if="!(data?.length)" class="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">
          Nenhum portfólio criado ainda.
        </p>
      </div>
    </section>

    <section class="space-y-5">
      <div class="rounded-2xl border border-white/10 bg-[#111019] p-5">
        <h2 class="text-xl font-black text-white">{{ selectedId ? 'Editar portfólio' : 'Criar portfólio' }}</h2>

        <form class="mt-5 grid gap-4 lg:grid-cols-2" @submit.prevent="saveSite">
          <FwbInput
            v-model="siteForm.title"
            label="Título"
            input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
            label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
            required
          />
          <FwbInput
            v-model="siteForm.slug"
            label="Slug"
            placeholder="meu-portfolio"
            input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
            label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
            required
          />
          <FwbInput
            v-model="siteForm.subtitle"
            label="Subtítulo"
            input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
            label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
          />
          <FwbInput
            v-model="siteForm.template_key"
            label="Template key"
            input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
            label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
          />
          <label class="flex items-center gap-2 text-sm text-gray-300">
            <input v-model="siteForm.is_public" type="checkbox" class="rounded border-white/20 bg-black/30 text-violet-600 focus:ring-violet-600" />
            Público
          </label>
          <div class="flex flex-wrap justify-end gap-2 lg:col-span-2">
            <FwbButton v-if="selectedId" type="button" color="alternative" class="!rounded-xl" :loading="publishing" @click="publishSite">
              Publicar
            </FwbButton>
            <FwbButton type="submit" color="purple" class="!rounded-xl !font-bold" :loading="savingSite">
              Salvar portfólio
            </FwbButton>
          </div>
        </form>

        <p v-if="actionError" class="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{{ actionError }}</p>
        <p v-if="actionMessage" class="mt-4 rounded-xl bg-green-500/10 p-3 text-sm text-green-200">{{ actionMessage }}</p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-[#111019] p-5">
        <h2 class="text-xl font-black text-white">Secções do portfólio</h2>
        <p class="mt-1 text-sm text-gray-500">Defina quais blocos aparecem na página pública.</p>

        <form class="mt-5 grid gap-4 lg:grid-cols-[1fr_180px_auto]" @submit.prevent="addSection">
          <FwbInput
            v-model="sectionForm.section_type"
            label="Tipo"
            placeholder="projects"
            input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
            label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
            required
          />
          <label class="block">
            <span class="mb-1.5 block text-xs font-bold text-gray-200">Layout</span>
            <select
              v-model="sectionForm.layout_type"
              class="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            >
              <option value="grid">Grid</option>
              <option value="list">Lista</option>
              <option value="cards">Cards</option>
              <option value="timeline">Timeline</option>
              <option value="simple">Simples</option>
            </select>
          </label>
          <div class="flex items-end">
            <FwbButton type="submit" color="purple" class="w-full !rounded-xl !font-bold" :loading="creatingSection" :disabled="!selectedId">
              Adicionar
            </FwbButton>
          </div>
        </form>

        <div class="mt-5">
          <div v-if="sectionsLoading" class="h-28 animate-pulse rounded-2xl bg-white/10" />
          <p v-else-if="sectionsError" class="rounded-xl bg-red-500/10 p-4 text-sm text-red-200">{{ sectionsError }}</p>
          <div v-else-if="(sections?.length ?? 0) > 0" class="grid gap-3 md:grid-cols-2">
            <article v-for="section in sections" :key="section.id" class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="font-black text-white">{{ section.section_type }}</p>
              <p class="mt-1 text-xs text-gray-500">{{ section.layout_type }}</p>
              <div class="mt-4 flex justify-end">
                <FwbButton size="xs" color="alternative" class="!rounded-xl" :loading="deletingSectionId === section.id" @click="removeSection(section.id)">
                  Remover
                </FwbButton>
              </div>
            </article>
          </div>
          <p v-else class="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-500">
            Selecione ou crie um portfólio para adicionar secções.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
