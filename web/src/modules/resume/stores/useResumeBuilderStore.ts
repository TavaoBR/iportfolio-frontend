import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { DynamicFormValues } from '@/modules/content-blocks/forms/contentBlockFormSchemas'
import type { Resume, ResumeLanguage, ResumeSection, ResumeSectionType } from '../types/resume.types'
import {
  createInitialSectionValues,
  parseSectionContent,
  resumeSectionSchemas,
} from '../forms/resumeSectionFormSchemas'
import { resumeTemplateRegistry } from '../templates/registry'

export interface ResumeBuilderSectionDraft {
  id?: number
  type: ResumeSectionType
  title: string
  values: DynamicFormValues
  is_visible: boolean
  position: number
}

export const builderSteps = [
  { key: 'template', label: 'Design', description: 'Escolha o modelo visual.' },
  { key: 'personal_info', label: 'Dados pessoais', description: 'Contato e objetivo.' },
  { key: 'professional_summary', label: 'Resumo', description: 'Apresentação profissional.' },
  { key: 'experiences', label: 'Experiência', description: 'Histórico profissional.' },
  { key: 'educations', label: 'Formação', description: 'Educação e cursos.' },
  { key: 'skills', label: 'Skills', description: 'Competências e níveis.' },
  { key: 'extras', label: 'Extras', description: 'Idiomas, projetos e certificados.' },
  { key: 'review', label: 'Revisão', description: 'Salvar e exportar.' },
] as const

export type ResumeBuilderStepKey = (typeof builderSteps)[number]['key']

export const useResumeBuilderStore = defineStore('resumeBuilder', () => {
  const activeStep = ref<ResumeBuilderStepKey>('template')
  const publicId = ref<string | null>(null)
  const title = ref('Meu currículo profissional')
  const targetRole = ref('')
  const language = ref<ResumeLanguage>('pt_BR')
  const templateKey = ref(resumeTemplateRegistry[0]?.key ?? '')
  const isMain = ref(false)
  const isPublic = ref(false)
  const personal = ref<DynamicFormValues>(
    createInitialSectionValues(resumeSectionSchemas.personal_info),
  )
  const summary = ref<DynamicFormValues>(
    createInitialSectionValues(resumeSectionSchemas.professional_summary),
  )
  const sections = ref<ResumeBuilderSectionDraft[]>([])

  /** Data URL da foto escolhida no construtor (só modelos com `supportsPhoto`). */
  const profilePhotoDataUrl = ref<string | null>(null)
  /** Após "Remover foto", não reutilizar o avatar da conta até novo upload. */
  const ignoreAccountAvatar = ref(false)

  const activeStepIndex = computed(() =>
    Math.max(0, builderSteps.findIndex((step) => step.key === activeStep.value)),
  )
  const progressPercent = computed(() =>
    Math.round(((activeStepIndex.value + 1) / builderSteps.length) * 100),
  )
  const orderedSections = computed(() =>
    [...sections.value].sort((a, b) => a.position - b.position),
  )

  function reset() {
    activeStep.value = 'template'
    publicId.value = null
    title.value = 'Meu currículo profissional'
    targetRole.value = ''
    language.value = 'pt_BR'
    templateKey.value = resumeTemplateRegistry[0]?.key ?? ''
    isMain.value = false
    isPublic.value = false
    personal.value = createInitialSectionValues(resumeSectionSchemas.personal_info)
    summary.value = createInitialSectionValues(resumeSectionSchemas.professional_summary)
    sections.value = []
    profilePhotoDataUrl.value = null
    ignoreAccountAvatar.value = false
  }

  function hydrateFromResume(resume: Resume, resumeSections: ResumeSection[]) {
    publicId.value = resume.public_id
    title.value = resume.title ?? 'Meu currículo profissional'
    targetRole.value = resume.target_role ?? ''
    language.value = resume.language ?? 'pt_BR'
    templateKey.value = resume.template_key || resumeTemplateRegistry[0]?.key || ''
    isMain.value = resume.is_main
    isPublic.value = resume.is_public

    const personalInfo = resumeSections.find((section) => section.section_type === 'personal_info')
    const professionalSummary = resumeSections.find(
      (section) => section.section_type === 'professional_summary',
    )
    personal.value = personalInfo
      ? parseSectionContent(resumeSectionSchemas.personal_info, personalInfo.content)
      : createInitialSectionValues(resumeSectionSchemas.personal_info)
    summary.value = professionalSummary
      ? parseSectionContent(resumeSectionSchemas.professional_summary, professionalSummary.content)
      : createInitialSectionValues(resumeSectionSchemas.professional_summary)

    sections.value = resumeSections
      .filter(
        (section) =>
          section.section_type !== 'personal_info' &&
          section.section_type !== 'professional_summary',
      )
      .map((section) => ({
        id: section.id,
        type: section.section_type,
        title: section.title || resumeSectionSchemas[section.section_type].defaultTitle,
        values: parseSectionContent(resumeSectionSchemas[section.section_type], section.content),
        is_visible: section.is_visible ?? true,
        position: section.position ?? 1,
      }))
    profilePhotoDataUrl.value = null
    ignoreAccountAvatar.value = false
  }

  function applyProfileDefaults(name?: string | null, email?: string | null, phone?: string | null, headline?: string | null) {
    personal.value.name = String(personal.value.name || name || '')
    personal.value.email = String(personal.value.email || email || '')
    personal.value.phone = String(personal.value.phone || phone || '')
    personal.value.headline = String(personal.value.headline || headline || '')
    targetRole.value = targetRole.value || headline || ''
  }

  function setProfilePhotoDataUrl(url: string) {
    profilePhotoDataUrl.value = url
    ignoreAccountAvatar.value = false
  }

  function clearProfilePhoto() {
    profilePhotoDataUrl.value = null
    ignoreAccountAvatar.value = true
  }

  /** Valor a passar a `profilePhotoUrl` no renderer quando o modelo suporta foto. */
  function resolveProfilePhotoForPreview(accountAvatar?: string | null): string | null {
    if (profilePhotoDataUrl.value) return profilePhotoDataUrl.value
    if (ignoreAccountAvatar.value) return null
    const a = accountAvatar
    return typeof a === 'string' && a.trim() ? a.trim() : null
  }

  function addSection(type: ResumeSectionType) {
    const schema = resumeSectionSchemas[type]
    sections.value.push({
      type,
      title: schema.defaultTitle,
      values: createInitialSectionValues(schema),
      is_visible: true,
      position: sections.value.length + 3,
    })
  }

  function removeSection(index: number) {
    sections.value.splice(index, 1)
    sections.value = sections.value.map((section, currentIndex) => ({
      ...section,
      position: currentIndex + 3,
    }))
  }

  function goTo(step: ResumeBuilderStepKey) {
    activeStep.value = step
  }

  function next() {
    const nextStep = builderSteps[activeStepIndex.value + 1]
    if (nextStep) activeStep.value = nextStep.key
  }

  function previous() {
    const previousStep = builderSteps[activeStepIndex.value - 1]
    if (previousStep) activeStep.value = previousStep.key
  }

  return {
    activeStep,
    activeStepIndex,
    progressPercent,
    publicId,
    title,
    targetRole,
    language,
    templateKey,
    isMain,
    isPublic,
    personal,
    summary,
    sections,
    orderedSections,
    profilePhotoDataUrl,
    ignoreAccountAvatar,
    reset,
    hydrateFromResume,
    applyProfileDefaults,
    setProfilePhotoDataUrl,
    clearProfilePhoto,
    resolveProfilePhotoForPreview,
    addSection,
    removeSection,
    goTo,
    next,
    previous,
  }
})
