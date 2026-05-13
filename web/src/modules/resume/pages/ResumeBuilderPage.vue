<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate, RouterLink, type RouteLocationRaw } from 'vue-router'
import type { LocationQuery } from 'vue-router'
import UiButton from '@/components/ui/UiButton.vue'
import AppSelectField from '@/components/form/AppSelectField.vue'
import AppTextField from '@/components/form/AppTextField.vue'
import { useAppShellChromeStore } from '@/layouts/useAppShellChromeStore'
import { useAuthStore } from '@/modules/auth/stores/useAuthStore'
import { getProfile } from '@/modules/profile/services/profileApi'
import type { UserProfile } from '@/modules/profile/types/profile.types'
import { ApiError } from '@/types/api'
import type { DynamicFormValues } from '@/modules/content-blocks/forms/contentBlockFormSchemas'
import type { Resume, ResumeSection, ResumeSectionType } from '../types/resume.types'
import { createResume, getResume, getResumePdf, updateResume } from '../services/resumesApi'
import {
  createResumeSection,
  listResumeSections,
  updateResumeSection,
} from '../services/resumeSectionsApi'
import { formatSectionContent, resumeSectionSchemas } from '../forms/resumeSectionFormSchemas'
import { isMappedResumeTemplateKey, getResumeTemplateDefinition } from '../templates/registry'
import ResumeBuilderLayout from '../builder/ResumeBuilderLayout.vue'
import ResumeBuilderPreviewPanel from '../builder/ResumeBuilderPreviewPanel.vue'
import ResumeBuilderStepNav from '../builder/ResumeBuilderStepNav.vue'
import ResumeSectionFormRenderer from '../builder/ResumeSectionFormRenderer.vue'
import ResumeBuilderEditorHeader from '../builder/ResumeBuilderEditorHeader.vue'
import {
  RESUME_BUILDER_SECTION_STEP_ORDER,
  addSectionCtaLabel,
  buildResumeBuilderNavSteps,
  computeResumeFillPercent,
  computeStepCompletionMap,
  getResumeBuilderSectionStepIntro,
  type BuilderProgressInput,
} from '../builder/resumeBuilderSteps'
import { useResumeBuilderStore, type ResumeBuilderSectionDraft } from '../stores/useResumeBuilderStore'
import { useResumeDraftStore } from '../stores/useResumeDraftStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const builder = useResumeBuilderStore()
const resumeDraft = useResumeDraftStore()
const appChrome = useAppShellChromeStore()

const loading = ref(false)
const saving = ref(false)
const downloading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const profile = ref<UserProfile | null>(null)
const resume = ref<Resume | null>(null)
const sourceSections = ref<ResumeSection[]>([])

const photoInput = ref<HTMLInputElement | null>(null)

const templateSupportsPhoto = computed(
  () => getResumeTemplateDefinition(builder.templateKey).capabilities?.supportsPhoto ?? false,
)

const builderPhotoThumbUrl = computed(() => {
  if (!templateSupportsPhoto.value) return null
  if (builder.profilePhotoDataUrl) return builder.profilePhotoDataUrl
  if (builder.ignoreAccountAvatar) return null
  const a = auth.user?.avatar
  return typeof a === 'string' && a.trim() ? a.trim() : null
})

const previewProfilePhotoUrl = computed(() => {
  if (!templateSupportsPhoto.value) return undefined
  if (builder.profilePhotoDataUrl) return builder.profilePhotoDataUrl
  if (builder.ignoreAccountAvatar) return null
  const a = auth.user?.avatar
  return typeof a === 'string' && a.trim() ? a.trim() : null
})

const languageOptions = [
  { value: 'pt_BR', label: 'Português' },
  { value: 'en_US', label: 'Inglês' },
  { value: 'es_ES', label: 'Espanhol' },
] as const

const publicId = computed(() => {
  const value = route.params.publicId
  return typeof value === 'string' && value !== 'new' ? value : null
})
const isNew = computed(() => !publicId.value)

const activeStepId = ref('basics')

function contextBarDocumentTitle() {
  if (isNew.value) return 'Novo currículo'
  if (publicId.value) return `Currículo · ${publicId.value}`
  return 'Currículo'
}

const builderProgressInput = computed<BuilderProgressInput>(() => ({
  templateKey: builder.templateKey,
  title: builder.title,
  targetRole: builder.targetRole,
  personal: {
    name: String(builder.personal.name ?? ''),
    email: String(builder.personal.email ?? ''),
    phone: String(builder.personal.phone ?? ''),
    headline: String(builder.personal.headline ?? ''),
  },
  summary: { summary: String(builder.summary.summary ?? '') },
  orderedSections: builder.orderedSections.map((s) => ({ type: s.type, values: { ...s.values } })),
}))

const navSteps = computed(() => buildResumeBuilderNavSteps())

const activeStepIndex = computed(() =>
  Math.max(0, navSteps.value.findIndex((s) => s.id === activeStepId.value)),
)

const activeStepLabel = computed(() => navSteps.value[activeStepIndex.value]?.label ?? '')

function goToStep(stepId: string) {
  if (navSteps.value.some((s) => s.id === stepId)) activeStepId.value = stepId
}

function goToPreviousStep() {
  const i = activeStepIndex.value
  if (i > 0) {
    const prev = navSteps.value[i - 1]
    if (prev) activeStepId.value = prev.id
  }
}

function goToNextStep() {
  const i = activeStepIndex.value
  if (i < navSteps.value.length - 1) {
    const next = navSteps.value[i + 1]
    if (next) activeStepId.value = next.id
  }
}

const fillCompletionPercent = computed(() => computeResumeFillPercent(builderProgressInput.value))

const stepCompletionMap = computed(() =>
  computeStepCompletionMap(builderProgressInput.value, navSteps.value),
)

const templatePickerTo = computed<RouteLocationRaw>(() =>
  publicId.value
    ? { name: 'resume-pick-template', query: { publicId: publicId.value } }
    : { name: 'resume-pick-template' },
)

function indicesForSectionType(type: ResumeSectionType): number[] {
  const out: number[] = []
  builder.orderedSections.forEach((s, i) => {
    if (s.type === type) out.push(i)
  })
  return out
}

function updateSectionValuesAt(index: number, values: DynamicFormValues) {
  const row = builder.orderedSections[index]
  if (row) row.values = values
}

const previewFallback = computed(() => ({
  name: String(builder.personal.name || auth.user?.name || ''),
  email: String(builder.personal.email || auth.user?.email || ''),
  phone: String(builder.personal.phone || profile.value?.phone || ''),
  headline: String(builder.personal.headline || builder.targetRole || profile.value?.headline || ''),
  summary: String(builder.summary.summary || profile.value?.bio || ''),
}))
const previewSections = computed<ResumeSection[]>(() => {
  const sections: ResumeSection[] = [
    {
      id: -1,
      section_type: 'personal_info',
      title: resumeSectionSchemas.personal_info.defaultTitle,
      content: formatSectionContent(resumeSectionSchemas.personal_info, builder.personal),
      position: 1,
      is_visible: true,
    },
    {
      id: -2,
      section_type: 'professional_summary',
      title: resumeSectionSchemas.professional_summary.defaultTitle,
      content: formatSectionContent(resumeSectionSchemas.professional_summary, builder.summary),
      position: 2,
      is_visible: true,
    },
  ]

  for (const section of builder.orderedSections) {
    sections.push({
      id: section.id ?? -Math.abs(section.position + 10),
      section_type: section.type,
      title: section.title,
      content: formatSectionContent(resumeSectionSchemas[section.type], section.values),
      position: section.position,
      is_visible: section.is_visible,
    })
  }

  return sections
})
const previewResume = computed<Resume | null>(() =>
  resume.value
    ? { ...resume.value, target_role: builder.targetRole, template_key: builder.templateKey }
    : null,
)

watch(
  () => [publicId.value, isNew.value] as const,
  () => {
    appChrome.updateContextTitle(contextBarDocumentTitle())
  },
)

/** Lê `?template=` de forma robusta (string ou array em query duplicada). */
function readResumeTemplateFromQuery(query: LocationQuery): string | null {
  const raw = query.template
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t || null
  }
  if (Array.isArray(raw)) {
    const first = raw[0]
    const t = typeof first === 'string' ? first.trim() : ''
    return t || null
  }
  return null
}

function applyChosenResumeTemplateKey(key: string | null) {
  if (!key || !isMappedResumeTemplateKey(key)) return
  builder.templateKey = key
}

function stripResumeTemplateQueryIfPresent() {
  if (!readResumeTemplateFromQuery(route.query)) return
  const nextQuery = { ...route.query }
  delete nextQuery.template
  void router.replace({ query: nextQuery })
}

/** Ao trocar só a query (ex.: voltar do catálogo com outro `?template=`), o mesmo componente pode ser reutilizado. */
onBeforeRouteUpdate((to) => {
  if (to.name !== 'resume-new' && to.name !== 'resume-edit') return
  const picked = readResumeTemplateFromQuery(to.query)
  if (!picked || !isMappedResumeTemplateKey(picked)) return
  builder.templateKey = picked
  const nextQuery = { ...to.query }
  delete nextQuery.template
  void router.replace({ name: to.name, params: to.params, query: nextQuery, hash: to.hash })
})

watch(
  () => readResumeTemplateFromQuery(route.query),
  (picked) => {
    if (!picked || !isMappedResumeTemplateKey(picked)) return
    builder.templateKey = picked
    stripResumeTemplateQueryIfPresent()
  },
  { flush: 'post' },
)

function onPhotoChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) return
  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'A imagem deve ter no máximo 2 MB.'
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    const url = typeof reader.result === 'string' ? reader.result : null
    if (url) builder.setProfilePhotoDataUrl(url)
  }
  reader.readAsDataURL(file)
}

function clearPhoto() {
  builder.clearProfilePhoto()
  if (photoInput.value) photoInput.value.value = ''
}

onMounted(async () => {
  const fromQuery = readResumeTemplateFromQuery(route.query)
  const fromDraft = resumeDraft.consumeLastPickedTemplateKey()
  const pickedTemplate =
    (fromQuery && isMappedResumeTemplateKey(fromQuery) ? fromQuery : null) ??
    (fromDraft && isMappedResumeTemplateKey(fromDraft) ? fromDraft : null)

  builder.reset()
  applyChosenResumeTemplateKey(pickedTemplate)

  loading.value = true
  errorMessage.value = ''

  appChrome.registerContextBar({
    title: contextBarDocumentTitle(),
    onSave: saveBuilder,
    onCancel: () => {
      void router.push({ name: 'resumes' })
    },
  })

  try {
    profile.value = await getProfile()
    builder.applyProfileDefaults(
      auth.user?.name,
      auth.user?.email,
      profile.value?.phone,
      profile.value?.headline,
    )

    if (publicId.value) {
      const [currentResume, currentSections] = await Promise.all([
        getResume(publicId.value),
        listResumeSections(publicId.value),
      ])
      resume.value = currentResume
      sourceSections.value = currentSections
      builder.hydrateFromResume(currentResume, currentSections)
    }
  } catch (e) {
    errorMessage.value =
      e instanceof ApiError ? e.message : 'Não foi possível carregar o construtor de currículo.'
  } finally {
    loading.value = false
  }

  /** Volta a aplicar depois do hydrate (CV existente sobrescreve o template vindo da API). */
  applyChosenResumeTemplateKey(pickedTemplate)
  stripResumeTemplateQueryIfPresent()
  appChrome.updateContextTitle(contextBarDocumentTitle())
})

onUnmounted(() => {
  appChrome.unregisterContextBar()
})

function addSection(type: ResumeSectionType) {
  builder.addSection(type)
}

function removeSection(index: number) {
  builder.removeSection(index)
}

function sectionContent(section: ResumeBuilderSectionDraft) {
  return formatSectionContent(resumeSectionSchemas[section.type], section.values)
}

function isBuilderDraft(section: ResumeSection | ResumeBuilderSectionDraft): section is ResumeBuilderSectionDraft {
  return 'type' in section && 'values' in section
}

async function upsertSection(currentPublicId: string, section: ResumeSection | ResumeBuilderSectionDraft) {
  const sectionType = 'section_type' in section ? section.section_type : section.type
  const title = section.title
  const content = isBuilderDraft(section) ? sectionContent(section) : section.content
  const position = section.position
  const isVisible = section.is_visible
  const existingId =
    'id' in section && section.id && section.id > 0
      ? section.id
      : sourceSections.value.find(
          (item) => item.section_type === sectionType && item.position === position,
        )?.id

  if (existingId) {
    await updateResumeSection(currentPublicId, existingId, {
      section_type: sectionType,
      title,
      content,
      position,
      is_visible: isVisible,
    })
    return
  }

  await createResumeSection(currentPublicId, {
    section_type: sectionType,
    title,
    content,
    position,
    is_visible: isVisible,
  })
}

async function saveBuilder() {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const payload = {
      title: builder.title,
      target_role: builder.targetRole || null,
      language: builder.language,
      template_key: builder.templateKey || null,
      is_main: builder.isMain,
      is_public: builder.isPublic,
    }
    const savedResume = publicId.value
      ? await updateResume(publicId.value, payload)
      : await createResume(payload)
    const currentPublicId = savedResume.public_id

    await upsertSection(currentPublicId, previewSections.value[0])
    await upsertSection(currentPublicId, previewSections.value[1])
    for (const section of builder.orderedSections) {
      await upsertSection(currentPublicId, section)
    }

    resume.value = savedResume
    sourceSections.value = await listResumeSections(currentPublicId)
    builder.hydrateFromResume(savedResume, sourceSections.value)
    successMessage.value = 'Currículo salvo com sucesso.'

    if (isNew.value) {
      await router.replace({ name: 'resume-edit', params: { publicId: currentPublicId } })
    }
  } catch (e) {
    errorMessage.value = e instanceof ApiError ? e.message : 'Não foi possível salvar o currículo.'
  } finally {
    saving.value = false
  }
}

async function downloadPdf() {
  if (!publicId.value) {
    await saveBuilder()
  }

  const currentPublicId = publicId.value || resume.value?.public_id
  if (!currentPublicId) return

  downloading.value = true
  errorMessage.value = ''
  try {
    const blob = await getResumePdf(currentPublicId)
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    window.setTimeout(() => URL.revokeObjectURL(url), 5000)
  } catch (e) {
    errorMessage.value = e instanceof ApiError ? e.message : 'Não foi possível gerar o PDF.'
  } finally {
    downloading.value = false
  }
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-1 flex-col">
    <ResumeBuilderLayout>
      <template #preview>
        <ResumeBuilderPreviewPanel
          workspace
          :template-key="builder.templateKey"
          :resume="previewResume"
          :sections="previewSections"
          :profile="profile"
          :user="auth.user"
          :fallback="previewFallback"
          :progress="fillCompletionPercent"
          :profile-photo-url="previewProfilePhotoUrl"
        />
      </template>

      <div v-if="loading" class="h-64 animate-pulse rounded-xl bg-slate-100/90" />
      <div
        v-else
        class="mx-auto flex h-full min-h-0 w-full max-w-xl flex-col gap-3 pb-2 pt-0.5"
      >
        <p
          v-if="errorMessage"
          class="shrink-0 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 ring-1 ring-red-100/80"
          role="alert"
        >
          {{ errorMessage }}
        </p>
        <p
          v-if="successMessage"
          class="shrink-0 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100/80"
          role="status"
        >
          {{ successMessage }}
        </p>

        <ResumeBuilderEditorHeader class="shrink-0" :percent="fillCompletionPercent">
          <template #secondary>
            <RouterLink
              :to="templatePickerTo"
              class="rounded-lg border border-slate-200/90 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              Modelo
            </RouterLink>
          </template>
          <template #actions>
            <UiButton
              color="alternative"
              size="xs"
              class="shrink-0"
              :loading="downloading"
              @click="downloadPdf"
            >
              PDF
            </UiButton>
          </template>
        </ResumeBuilderEditorHeader>

        <div class="flex shrink-0 items-center justify-between gap-2 px-0.5">
          <UiButton
            color="alternative"
            outline
            size="xs"
            type="button"
            class="min-w-[5.5rem]"
            :disabled="activeStepIndex <= 0"
            @click="goToPreviousStep"
          >
            Anterior
          </UiButton>
          <p class="min-w-0 flex-1 truncate text-center text-[11px] font-semibold text-slate-700">
            {{ activeStepLabel }}
          </p>
          <UiButton
            color="alternative"
            outline
            size="xs"
            type="button"
            class="min-w-[5.5rem]"
            :disabled="activeStepIndex >= navSteps.length - 1"
            @click="goToNextStep"
          >
            Seguinte
          </UiButton>
        </div>

        <div class="relative min-h-0 flex-1 overflow-hidden">
          <div
            v-show="activeStepId === 'basics'"
            class="absolute inset-0 overflow-y-auto overflow-x-hidden pb-1"
          >
            <section
              id="resume-step-basics"
              class="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/70"
            >
              <div class="border-b border-slate-100 px-4 py-3.5">
                <h2 class="text-[0.8125rem] font-bold tracking-tight text-slate-900">Informações básicas</h2>
                <p class="mt-1 text-[11px] leading-snug text-slate-500">
                  Modelo, título do CV, idioma, contacto profissional e foto (quando o modelo permitir).
                </p>
              </div>
              <div class="space-y-5 px-4 pb-5 pt-4">
                <div
                  v-if="templateSupportsPhoto"
                  class="flex flex-wrap items-start gap-4"
                >
                  <div
                    class="relative flex h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-full border border-[var(--ip-input-border)] bg-slate-50"
                  >
                    <img
                      v-if="builderPhotoThumbUrl"
                      :src="builderPhotoThumbUrl"
                      alt=""
                      class="h-full w-full object-cover"
                    />
                    <span v-else class="m-auto text-[10px] font-semibold text-slate-400">Foto</span>
                  </div>
                  <div class="min-w-0 flex-1 space-y-2">
                    <input
                      ref="photoInput"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      class="hidden"
                      @change="onPhotoChange"
                    />
                    <UiButton
                      color="alternative"
                      outline
                      size="xs"
                      type="button"
                      @click="photoInput?.click()"
                    >
                      Escolher foto
                    </UiButton>
                    <button
                      v-if="builderPhotoThumbUrl"
                      type="button"
                      class="block text-[10px] font-semibold text-slate-500 underline hover:text-slate-800"
                      @click="clearPhoto"
                    >
                      Remover foto
                    </button>
                    <p class="text-[10px] leading-snug text-slate-500">
                      Pré-visualização local; integração com o PDF virá numa próxima versão.
                    </p>
                  </div>
                </div>

                <div class="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                  <div class="min-w-0 sm:col-span-2">
                    <AppTextField
                      v-model="builder.title"
                      label="Título do currículo"
                    />
                    <p class="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                      Este texto aparece no próprio CV. Na barra superior mostramos o estado do ficheiro (novo ou já
                      guardado), para não repetir o título aqui.
                    </p>
                  </div>
                  <div class="min-w-0">
                    <AppTextField
                      v-model="builder.targetRole"
                      label="Cargo alvo"
                    />
                  </div>
                  <AppSelectField
                    v-model="builder.language"
                    class="min-w-0"
                    label="Idioma"
                    :options="[...languageOptions]"
                  />
                </div>
                <ResumeSectionFormRenderer
                  :schema="resumeSectionSchemas.personal_info"
                  :values="builder.personal"
                  @update:values="builder.personal = $event"
                />
              </div>
            </section>
          </div>

          <div
            v-show="activeStepId === 'summary'"
            class="absolute inset-0 overflow-y-auto overflow-x-hidden pb-1"
          >
            <section
              id="resume-step-summary"
              class="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/70"
            >
              <div class="border-b border-slate-100 px-4 py-3.5">
                <h2 class="text-[0.8125rem] font-bold tracking-tight text-slate-900">Resumo profissional</h2>
                <p class="mt-1 text-[11px] leading-snug text-slate-500">
                  Objetivos, síntese de carreira e mensagem para recrutadores — só neste bloco.
                </p>
              </div>
              <div class="px-4 pb-5 pt-4">
                <ResumeSectionFormRenderer
                  :schema="resumeSectionSchemas.professional_summary"
                  :values="builder.summary"
                  @update:values="builder.summary = $event"
                />
              </div>
            </section>
          </div>

          <div
            v-for="stepType in RESUME_BUILDER_SECTION_STEP_ORDER"
            v-show="activeStepId === `section-${stepType}`"
            :key="stepType"
            class="absolute inset-0 overflow-y-auto overflow-x-hidden pb-1"
          >
            <section
              :id="`resume-step-section-${stepType}`"
              class="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/70"
            >
              <div class="border-b border-slate-100 px-4 py-3.5">
                <h2 class="text-[0.8125rem] font-bold tracking-tight text-slate-900">
                  {{ resumeSectionSchemas[stepType].label }}
                </h2>
                <p class="mt-1 text-[11px] leading-snug text-slate-500">
                  {{ getResumeBuilderSectionStepIntro(stepType) }}
                </p>
              </div>
              <div class="space-y-4 px-4 pb-5 pt-4">
                <p
                  v-if="indicesForSectionType(stepType).length === 0"
                  class="rounded-lg border border-dashed border-slate-200/90 bg-slate-50/70 px-3 py-3 text-center text-[11px] leading-relaxed text-slate-500"
                >
                  Nenhuma entrada nesta etapa. Use o botão em baixo para adicionar a primeira.
                </p>
                <article
                  v-for="index in indicesForSectionType(stepType)"
                  :key="String(builder.orderedSections[index]?.id ?? `${stepType}-${index}`)"
                  class="overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50/30 ring-1 ring-slate-100/60"
                >
                  <div
                    class="flex flex-col gap-3 border-b border-slate-200/70 bg-white/95 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <AppTextField
                      v-model="builder.orderedSections[index]!.title"
                      class="min-w-0 flex-1"
                      label="Título no CV"
                    />
                    <button
                      type="button"
                      class="shrink-0 rounded-md border border-red-100 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 sm:self-center"
                      @click="removeSection(index)"
                    >
                      Remover
                    </button>
                  </div>
                  <div class="bg-white px-3 pb-3 pt-3">
                    <ResumeSectionFormRenderer
                      :schema="resumeSectionSchemas[stepType]"
                      :values="builder.orderedSections[index]!.values"
                      @update:values="updateSectionValuesAt(index, $event)"
                    />
                  </div>
                </article>
                <UiButton
                  color="alternative"
                  outline
                  size="xs"
                  type="button"
                  class="w-full sm:w-auto"
                  @click="addSection(stepType)"
                >
                  {{ addSectionCtaLabel(stepType) }}
                </UiButton>
              </div>
            </section>
          </div>

          <div
            v-show="activeStepId === 'finalize'"
            class="absolute inset-0 overflow-y-auto overflow-x-hidden pb-1"
          >
            <section
              id="resume-step-finalize"
              class="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/70"
            >
              <div class="border-b border-slate-100 px-4 py-3.5">
                <h2 class="text-[0.8125rem] font-bold tracking-tight text-slate-900">Finalização</h2>
                <p class="mt-1 text-[11px] leading-snug text-slate-500">
                  Visibilidade na sua conta. Guarde com <span class="font-semibold text-slate-600">Guardar</span> na
                  barra superior; o PDF pode ser gerado a qualquer momento com o botão ao lado do progresso.
                </p>
              </div>
              <div class="space-y-3 px-4 pb-5 pt-4">
                <label class="ip-form-checkbox flex items-center gap-2.5">
                  <input
                    v-model="builder.isMain"
                    type="checkbox"
                    class="size-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span>
                    <span class="text-xs font-bold text-slate-800">Currículo principal</span>
                    <span class="mt-0.5 block text-[10px] font-normal leading-snug text-slate-500">
                      Destaca este CV como o principal na lista da sua conta.
                    </span>
                  </span>
                </label>
                <label class="ip-form-checkbox flex items-center gap-2.5">
                  <input
                    v-model="builder.isPublic"
                    type="checkbox"
                    class="size-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span>
                    <span class="text-xs font-bold text-slate-800">Perfil público</span>
                    <span class="mt-0.5 block text-[10px] font-normal leading-snug text-slate-500">
                      Permite que o currículo possa ser partilhado via link público, conforme as regras da plataforma.
                    </span>
                  </span>
                </label>
              </div>
            </section>
          </div>
        </div>
      </div>

      <template v-if="!loading" #footer>
        <p class="mb-2 text-center text-[10px] leading-snug text-slate-500 sm:text-left">
          Um passo de cada vez: só a etapa atual aparece acima. Use Anterior/Seguinte ou as pills para mudar de passo.
        </p>
        <ResumeBuilderStepNav
          :steps="navSteps"
          :active-step-id="activeStepId"
          :step-done="stepCompletionMap"
          @navigate="goToStep"
        />
      </template>
    </ResumeBuilderLayout>
  </div>
</template>
