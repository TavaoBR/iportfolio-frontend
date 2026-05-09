<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { FwbButton, FwbInput } from 'flowbite-vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { getResume, getResumePdf, updateResume } from '../services/resumesApi'
import {
  createResumeSection,
  deleteResumeSection,
  listResumeSections,
  updateResumeSection,
} from '../services/resumeSectionsApi'
import type {
  Resume,
  ResumeLanguage,
  ResumeSection,
  ResumeSectionPayload,
  ResumeSectionType,
} from '../types/resume.types'
import { ApiError } from '@/types/api'
import { getProfile } from '@/modules/profile/services/profileApi'
import type { UserProfile } from '@/modules/profile/types/profile.types'
import { useAuthStore } from '@/modules/auth/stores/useAuthStore'
import ResumeTemplateRenderer from '../templates/components/ResumeTemplateRenderer.vue'
import { resumeTemplateRegistry } from '../templates/registry'
import {
  createInitialSectionValues,
  formatSectionContent,
  parseSectionContent,
  resumeSectionSchemas,
} from '../forms/resumeSectionFormSchemas'
import type {
  DynamicFieldSchema,
  DynamicFormValues,
} from '@/modules/content-blocks/forms/contentBlockFormSchemas'

type ResumeSectionDraft = Omit<ResumeSectionPayload, 'title' | 'content'> & {
  title: string
  content: string
  values: DynamicFormValues
}

const route = useRoute()
const publicId = computed(() => route.params.publicId as string)
const auth = useAuthStore()

const {
  data: resume,
  loading: resumeLoading,
  error: resumeError,
  run: loadResume,
} = useAsyncData<Resume>()
const {
  data: sections,
  loading: sectionsLoading,
  error: sectionsError,
  run: loadSections,
} = useAsyncData<ResumeSection[]>()
const resumeForm = ref({
  title: '',
  target_role: '',
  language: 'pt_BR' as ResumeLanguage,
  template_key: '',
  is_main: false,
  is_public: false,
})
const newSectionType = ref<ResumeSectionType>('professional_summary')
const newSectionTitle = ref(resumeSectionSchemas[newSectionType.value].defaultTitle)
const newSectionValues = ref<DynamicFormValues>(
  createInitialSectionValues(resumeSectionSchemas[newSectionType.value]),
)
const sectionDrafts = ref<Record<number, ResumeSectionDraft>>({})
const saveMessage = ref('')
const actionError = ref('')
const savingResume = ref(false)
const creatingSection = ref(false)
const savingSectionId = ref<number | null>(null)
const deletingSectionId = ref<number | null>(null)
const downloadingPdf = ref(false)
const profile = ref<UserProfile | null>(null)
const templates = resumeTemplateRegistry

const sectionTypes = Object.values(resumeSectionSchemas).map((schema) => ({
  value: schema.key,
  label: schema.label,
}))
const activeNewSectionSchema = computed(() => resumeSectionSchemas[newSectionType.value])
const selectedTemplate = computed(() =>
  templates.find((template) => template.key === resumeForm.value.template_key),
)

onMounted(() => {
  void loadResume(() => getResume(publicId.value))
  void loadSections(() => listResumeSections(publicId.value))
  void getProfile().then((currentProfile) => {
    profile.value = currentProfile
  })
})

watch(
  resume,
  (current) => {
    if (!current) return

    resumeForm.value = {
      title: current.title ?? '',
      target_role: current.target_role ?? '',
      language: current.language ?? 'pt_BR',
      template_key: current.template_key ?? '',
      is_main: current.is_main,
      is_public: current.is_public,
    }
  },
  { immediate: true },
)

watch(
  sections,
  (list) => {
    const drafts: Record<number, ResumeSectionDraft> = {}

    for (const section of list ?? []) {
      drafts[section.id] = {
        section_type: section.section_type,
        title: section.title ?? '',
        content: section.content ?? '',
        values: parseSectionContent(resumeSectionSchemas[section.section_type], section.content),
        position: section.position,
        is_visible: section.is_visible ?? true,
      }
    }

    sectionDrafts.value = drafts
  },
  { immediate: true },
)

function setDefaultSectionTitle() {
  newSectionTitle.value = activeNewSectionSchema.value.defaultTitle
  newSectionValues.value = createInitialSectionValues(activeNewSectionSchema.value)
}

function getErrorMessage(e: unknown, fallback: string) {
  return e instanceof ApiError ? e.message : fallback
}

async function saveResume() {
  actionError.value = ''
  saveMessage.value = ''
  savingResume.value = true

  try {
    await updateResume(publicId.value, {
      title: resumeForm.value.title,
      target_role: resumeForm.value.target_role || null,
      language: resumeForm.value.language,
      template_key: resumeForm.value.template_key || null,
      is_main: resumeForm.value.is_main,
      is_public: resumeForm.value.is_public,
    })
    await loadResume(() => getResume(publicId.value))
    saveMessage.value = 'Currículo salvo.'
  } catch (e) {
    actionError.value = getErrorMessage(e, 'Não foi possível salvar o currículo.')
  } finally {
    savingResume.value = false
  }
}

async function addSection() {
  actionError.value = ''
  saveMessage.value = ''
  creatingSection.value = true

  try {
    await createResumeSection(publicId.value, {
      section_type: newSectionType.value,
      title: newSectionTitle.value,
      content: formatSectionContent(activeNewSectionSchema.value, newSectionValues.value),
      position: (sections.value?.length ?? 0) + 1,
      is_visible: true,
    })
    newSectionValues.value = createInitialSectionValues(activeNewSectionSchema.value)
    await loadSections(() => listResumeSections(publicId.value))
    saveMessage.value = 'Secção adicionada.'
  } catch (e) {
    actionError.value = getErrorMessage(e, 'Não foi possível adicionar a secção.')
  } finally {
    creatingSection.value = false
  }
}

function newSectionInputValue(field: DynamicFieldSchema) {
  const value = newSectionValues.value[field.key]
  return typeof value === 'string' ? value : ''
}

function setNewSectionInputValue(field: DynamicFieldSchema, value: string) {
  newSectionValues.value[field.key] = value
}

function newSectionCheckboxValue(field: DynamicFieldSchema) {
  return Boolean(newSectionValues.value[field.key])
}

function setNewSectionCheckboxValue(field: DynamicFieldSchema, checked: boolean) {
  newSectionValues.value[field.key] = checked
}

function sectionSchema(sectionId: number) {
  const type = sectionDrafts.value[sectionId]?.section_type ?? 'custom'
  return resumeSectionSchemas[type]
}

function setSectionType(sectionId: number, type: ResumeSectionType) {
  const draft = sectionDrafts.value[sectionId]
  if (!draft) return

  draft.section_type = type
  draft.title = resumeSectionSchemas[type].defaultTitle
  draft.values = createInitialSectionValues(resumeSectionSchemas[type])
  draft.content = ''
}

function sectionInputValue(sectionId: number, field: DynamicFieldSchema) {
  const value = sectionDrafts.value[sectionId]?.values[field.key]
  return typeof value === 'string' ? value : ''
}

function setSectionInputValue(sectionId: number, field: DynamicFieldSchema, value: string) {
  const draft = sectionDrafts.value[sectionId]
  if (!draft) return

  draft.values[field.key] = value
  draft.content = formatSectionContent(sectionSchema(sectionId), draft.values)
}

function sectionCheckboxValue(sectionId: number, field: DynamicFieldSchema) {
  return Boolean(sectionDrafts.value[sectionId]?.values[field.key])
}

function setSectionCheckboxValue(sectionId: number, field: DynamicFieldSchema, checked: boolean) {
  const draft = sectionDrafts.value[sectionId]
  if (!draft) return

  draft.values[field.key] = checked
  draft.content = formatSectionContent(sectionSchema(sectionId), draft.values)
}

async function saveSection(sectionId: number) {
  const draft = sectionDrafts.value[sectionId]
  if (!draft) return

  actionError.value = ''
  saveMessage.value = ''
  savingSectionId.value = sectionId

  try {
    await updateResumeSection(publicId.value, sectionId, draft)
    await loadSections(() => listResumeSections(publicId.value))
    saveMessage.value = 'Secção salva.'
  } catch (e) {
    actionError.value = getErrorMessage(e, 'Não foi possível salvar a secção.')
  } finally {
    savingSectionId.value = null
  }
}

async function removeSection(sectionId: number) {
  actionError.value = ''
  saveMessage.value = ''
  deletingSectionId.value = sectionId

  try {
    await deleteResumeSection(publicId.value, sectionId)
    await loadSections(() => listResumeSections(publicId.value))
    saveMessage.value = 'Secção removida.'
  } catch (e) {
    actionError.value = getErrorMessage(e, 'Não foi possível remover a secção.')
  } finally {
    deletingSectionId.value = null
  }
}

async function downloadPdf() {
  actionError.value = ''
  downloadingPdf.value = true

  try {
    const blob = await getResumePdf(publicId.value)
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    window.setTimeout(() => URL.revokeObjectURL(url), 5000)
  } catch (e) {
    actionError.value = getErrorMessage(e, 'Não foi possível gerar o PDF.')
  } finally {
    downloadingPdf.value = false
  }
}
</script>

<template>
  <div class="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5">
      <RouterLink :to="{ name: 'resumes' }" class="text-sm font-semibold text-violet-300 hover:underline">
        ← Voltar para currículos
      </RouterLink>

      <div class="mt-5">
        <h1 class="text-2xl font-black text-white">Editor de CV</h1>
        <p class="mt-1 text-sm text-gray-500">{{ publicId }}</p>
      </div>

      <div v-if="resumeLoading" class="mt-6 h-64 animate-pulse rounded-2xl bg-white/10" />
      <p v-else-if="resumeError" class="mt-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-200">
        {{ resumeError }}
      </p>

      <form v-else class="mt-6 space-y-4" @submit.prevent="saveResume">
        <FwbInput
          v-model="resumeForm.title"
          label="Título"
          input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
          label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
          required
        />
        <FwbInput
          v-model="resumeForm.target_role"
          label="Cargo alvo"
          input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
          label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
        />
        <label class="block">
          <span class="mb-1.5 block text-xs font-bold text-gray-200">Idioma</span>
          <select
            v-model="resumeForm.language"
            class="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
          >
            <option value="pt_BR">Português</option>
            <option value="en_US">Inglês</option>
            <option value="es_ES">Espanhol</option>
          </select>
        </label>
        <label class="block">
          <span class="mb-1.5 block text-xs font-bold text-gray-200">Template visual</span>
          <select
            v-model="resumeForm.template_key"
            class="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
          >
            <option v-for="template in templates" :key="template.key" :value="template.key">
              {{ template.name }}
            </option>
          </select>
          <span class="mt-1 block text-xs text-gray-500">
            {{ selectedTemplate?.description ?? 'Selecione um template oficial mapeado.' }}
          </span>
        </label>

        <div class="grid gap-3 text-sm text-gray-300">
          <label class="flex items-center gap-2">
            <input v-model="resumeForm.is_main" type="checkbox" class="rounded border-white/20 bg-black/30 text-violet-600 focus:ring-violet-600" />
            Currículo principal
          </label>
          <label class="flex items-center gap-2">
            <input v-model="resumeForm.is_public" type="checkbox" class="rounded border-white/20 bg-black/30 text-violet-600 focus:ring-violet-600" />
            Público
          </label>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <FwbButton type="submit" color="purple" class="!rounded-xl !py-3 !font-bold" :loading="savingResume">
            Salvar CV
          </FwbButton>
          <FwbButton
            type="button"
            color="alternative"
            class="!rounded-xl !py-3 !font-bold"
            :loading="downloadingPdf"
            @click="downloadPdf"
          >
            PDF
          </FwbButton>
        </div>
      </form>

      <div class="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Template ativo</p>
            <h2 class="mt-1 text-lg font-black text-white">{{ selectedTemplate?.name ?? 'Template' }}</h2>
          </div>
        </div>
        <ResumeTemplateRenderer
          :resume="resume"
          :sections="sections"
          :profile="profile"
          :user="auth.user"
          :scale="0.37"
        />
      </div>
    </section>

    <section class="space-y-5">
      <div class="rounded-2xl border border-white/10 bg-[#111019] p-5">
        <div class="mb-5">
          <h2 class="text-xl font-black text-white">Adicionar informação</h2>
          <p class="mt-1 text-sm text-gray-500">
            Crie secções para resumo, experiências, skills, projetos e qualquer informação relevante.
          </p>
        </div>

        <form class="grid gap-4 lg:grid-cols-[260px_1fr] lg:items-start" @submit.prevent="addSection">
          <div class="space-y-4">
            <label class="block">
              <span class="mb-1.5 block text-xs font-bold text-gray-200">Tipo de secção</span>
              <select
                v-model="newSectionType"
                class="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                @change="setDefaultSectionTitle"
              >
                <option v-for="type in sectionTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </label>
            <FwbInput
              v-model="newSectionTitle"
              label="Título da secção"
              input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
              label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
            />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <template v-for="field in activeNewSectionSchema.fields" :key="field.key">
              <label v-if="field.type === 'textarea'" class="block md:col-span-2">
                <span class="mb-1.5 block text-xs font-bold text-gray-200">
                  {{ field.label }}<b v-if="field.required" class="text-violet-300"> *</b>
                </span>
                <textarea
                  :value="newSectionInputValue(field)"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  rows="6"
                  class="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
                  @input="setNewSectionInputValue(field, ($event.target as HTMLTextAreaElement).value)"
                />
              </label>

              <label v-else-if="field.type === 'select'" class="block">
                <span class="mb-1.5 block text-xs font-bold text-gray-200">
                  {{ field.label }}<b v-if="field.required" class="text-violet-300"> *</b>
                </span>
                <select
                  :value="newSectionInputValue(field)"
                  :required="field.required"
                  class="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                  @change="setNewSectionInputValue(field, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="">Selecionar</option>
                  <option v-for="option in field.options ?? []" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </label>

              <label v-else-if="field.type === 'checkbox'" class="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  :checked="newSectionCheckboxValue(field)"
                  class="rounded border-white/20 bg-black/30 text-violet-600 focus:ring-violet-600"
                  @change="setNewSectionCheckboxValue(field, ($event.target as HTMLInputElement).checked)"
                />
                {{ field.label }}
              </label>

              <FwbInput
                v-else
                :model-value="newSectionInputValue(field)"
                :label="field.label"
                :type="field.type"
                :placeholder="field.placeholder"
                :required="field.required"
                input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
                label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
                @update:model-value="setNewSectionInputValue(field, String($event ?? ''))"
              />
            </template>

            <div class="mt-3 flex justify-end">
              <FwbButton type="submit" color="purple" class="!rounded-xl !px-5 !font-bold" :loading="creatingSection">
                Adicionar secção
              </FwbButton>
            </div>
          </div>
        </form>

        <p v-if="saveMessage" class="mt-4 rounded-xl bg-green-500/10 p-3 text-sm text-green-200" role="status">
          {{ saveMessage }}
        </p>
        <p v-if="actionError" class="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200" role="alert">
          {{ actionError }}
        </p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-[#111019] p-5">
        <div class="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-white">Secções do currículo</h2>
            <p class="mt-1 text-sm text-gray-500">Edite o conteúdo livremente e salve cada secção.</p>
          </div>
          <span class="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-bold text-gray-400">
            {{ sections?.length ?? 0 }} secções
          </span>
        </div>

        <div v-if="sectionsLoading" class="grid gap-3">
          <div v-for="n in 3" :key="n" class="h-32 animate-pulse rounded-2xl bg-white/10" />
        </div>
        <p v-else-if="sectionsError" class="rounded-xl bg-red-500/10 p-4 text-sm text-red-200">
          {{ sectionsError }}
        </p>
        <div v-else-if="(sections?.length ?? 0) > 0" class="grid gap-4">
          <article
            v-for="section in sections"
            :key="section.id"
            class="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div class="grid gap-4 lg:grid-cols-[220px_1fr]">
              <div class="space-y-4">
                <label class="block">
                  <span class="mb-1.5 block text-xs font-bold text-gray-200">Tipo</span>
                  <select
                    :value="sectionDrafts[section.id].section_type"
                    class="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                    @change="setSectionType(section.id, ($event.target as HTMLSelectElement).value as ResumeSectionType)"
                  >
                    <option v-for="type in sectionTypes" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </option>
                  </select>
                </label>
                <FwbInput
                  v-model="sectionDrafts[section.id].title"
                  label="Título"
                  input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
                  label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
                />
                <label class="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    v-model="sectionDrafts[section.id].is_visible"
                    type="checkbox"
                    class="rounded border-white/20 bg-black/30 text-violet-600 focus:ring-violet-600"
                  />
                  Visível
                </label>
              </div>

              <div>
                <div class="grid gap-4 md:grid-cols-2">
                  <template v-for="field in sectionSchema(section.id).fields" :key="field.key">
                    <label v-if="field.type === 'textarea'" class="block md:col-span-2">
                      <span class="mb-1.5 block text-xs font-bold text-gray-200">
                        {{ field.label }}<b v-if="field.required" class="text-violet-300"> *</b>
                      </span>
                      <textarea
                        :value="sectionInputValue(section.id, field)"
                        :placeholder="field.placeholder"
                        :required="field.required"
                        rows="6"
                        class="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
                        @input="setSectionInputValue(section.id, field, ($event.target as HTMLTextAreaElement).value)"
                      />
                    </label>

                    <label v-else-if="field.type === 'select'" class="block">
                      <span class="mb-1.5 block text-xs font-bold text-gray-200">
                        {{ field.label }}<b v-if="field.required" class="text-violet-300"> *</b>
                      </span>
                      <select
                        :value="sectionInputValue(section.id, field)"
                        :required="field.required"
                        class="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                        @change="setSectionInputValue(section.id, field, ($event.target as HTMLSelectElement).value)"
                      >
                        <option value="">Selecionar</option>
                        <option v-for="option in field.options ?? []" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </label>

                    <label v-else-if="field.type === 'checkbox'" class="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        :checked="sectionCheckboxValue(section.id, field)"
                        class="rounded border-white/20 bg-black/30 text-violet-600 focus:ring-violet-600"
                        @change="setSectionCheckboxValue(section.id, field, ($event.target as HTMLInputElement).checked)"
                      />
                      {{ field.label }}
                    </label>

                    <FwbInput
                      v-else
                      :model-value="sectionInputValue(section.id, field)"
                      :label="field.label"
                      :type="field.type"
                      :placeholder="field.placeholder"
                      :required="field.required"
                      input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
                      label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
                      @update:model-value="setSectionInputValue(section.id, field, String($event ?? ''))"
                    />
                  </template>
                </div>
                <div class="mt-3 flex flex-wrap justify-end gap-2">
                  <FwbButton
                    type="button"
                    size="sm"
                    color="alternative"
                    class="!rounded-xl"
                    :loading="deletingSectionId === section.id"
                    @click="removeSection(section.id)"
                  >
                    Remover
                  </FwbButton>
                  <FwbButton
                    type="button"
                    size="sm"
                    color="purple"
                    class="!rounded-xl"
                    :loading="savingSectionId === section.id"
                    @click="saveSection(section.id)"
                  >
                    Salvar secção
                  </FwbButton>
                </div>
              </div>
            </div>
          </article>
        </div>
        <p v-else class="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-500">
          Nenhuma secção ainda. Adicione resumo, experiências, skills ou projetos para montar o CV.
        </p>
      </div>
    </section>
  </div>
</template>
