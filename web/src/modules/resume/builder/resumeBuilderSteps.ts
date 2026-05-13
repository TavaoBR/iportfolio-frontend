import { resumeSectionSchemas } from '../forms/resumeSectionFormSchemas'
import type { ResumeSectionType } from '../types/resume.types'

export type ResumeBuilderStepKind = 'basics' | 'summary' | 'section-type' | 'finalize'

export interface ResumeBuilderNavStep {
  id: string
  kind: ResumeBuilderStepKind
  /** Nome completo (tooltip / acessibilidade). */
  label: string
  /** Rótulo curto para pills do stepper horizontal. */
  pillLabel: string
  anchor: string
  sectionType?: ResumeSectionType
}

/** Ordem fixa de cada bloco de conteúdo no fluxo (sem agrupador genérico). */
export const RESUME_BUILDER_SECTION_STEP_ORDER: ResumeSectionType[] = [
  'experiences',
  'educations',
  'skills',
  'projects',
  'certifications',
  'languages',
  'links',
  'custom',
]

const sectionPillLabel: Partial<Record<ResumeSectionType, string>> = {
  experiences: 'Experiências',
  educations: 'Formação',
  skills: 'Skills',
  projects: 'Projetos',
  certifications: 'Certifs.',
  languages: 'Idiomas',
  links: 'Redes',
  custom: 'Outros',
}

const sectionStepIntro: Partial<Record<ResumeSectionType, string>> = {
  experiences: 'Empresa, cargo, datas e descrição — uma entrada por cargo.',
  educations: 'Instituição, curso, grau e período.',
  skills: 'Nome, categoria e nível de domínio.',
  projects: 'Nome, tecnologias, link e descrição.',
  certifications: 'Nome, emissor e data.',
  languages: 'Idioma e nível de proficiência.',
  links: 'LinkedIn, portfolio, GitHub e outros links públicos.',
  custom: 'Texto livre para conteúdo extra ou referências.',
}

export function getResumeBuilderSectionStepIntro(t: ResumeSectionType): string {
  return sectionStepIntro[t] ?? ''
}

export function addSectionCtaLabel(t: ResumeSectionType): string {
  const map: Partial<Record<ResumeSectionType, string>> = {
    experiences: 'Adicionar experiência',
    educations: 'Adicionar formação',
    skills: 'Adicionar competência',
    languages: 'Adicionar idioma',
    certifications: 'Adicionar certificação',
    projects: 'Adicionar projeto',
    links: 'Adicionar link',
    custom: 'Adicionar secção personalizada',
  }
  return map[t] ?? 'Adicionar secção'
}

export function buildResumeBuilderNavSteps(): ResumeBuilderNavStep[] {
  const steps: ResumeBuilderNavStep[] = [
    {
      id: 'basics',
      kind: 'basics',
      label: 'Informações básicas',
      pillLabel: 'Dados',
      anchor: 'resume-step-basics',
    },
    {
      id: 'summary',
      kind: 'summary',
      label: 'Resumo profissional',
      pillLabel: 'Resumo',
      anchor: 'resume-step-summary',
    },
  ]
  for (const t of RESUME_BUILDER_SECTION_STEP_ORDER) {
    steps.push({
      id: `section-${t}`,
      kind: 'section-type',
      label: resumeSectionSchemas[t].label,
      pillLabel: sectionPillLabel[t] ?? resumeSectionSchemas[t].label.slice(0, 12),
      anchor: `resume-step-section-${t}`,
      sectionType: t,
    })
  }
  steps.push({
    id: 'finalize',
    kind: 'finalize',
    label: 'Finalização',
    pillLabel: 'Concluir',
    anchor: 'resume-step-finalize',
  })
  return steps
}

export interface BuilderProgressInput {
  templateKey: string
  title: string
  targetRole: string
  personal: { name: string; email: string; phone: string; headline: string }
  summary: { summary: string }
  orderedSections: ReadonlyArray<{ type: ResumeSectionType; values: Record<string, unknown> }>
}

const str = (v: unknown) => String(v ?? '').trim()

function sectionTypeHasContent(values: Record<string, unknown>): boolean {
  for (const v of Object.values(values)) {
    if (typeof v === 'boolean' && v) return true
    if (typeof v === 'string' && v.trim().length > 0) return true
    if (typeof v === 'number' && !Number.isNaN(v)) return true
  }
  return false
}

/** Progresso global 0–100 (mesma ponderação conceptual que o antigo fillCompletionPercent). */
export function computeResumeFillPercent(b: BuilderProgressInput): number {
  let s = 0
  if (b.templateKey) s += 14
  if (str(b.title)) s += 8
  if (str(b.personal.name)) s += 12
  if (str(b.personal.email)) s += 12
  if (str(b.targetRole) || str(b.personal.headline)) s += 10
  if (str(b.personal.phone)) s += 4
  if (str(b.summary.summary)) s += 18
  s += Math.min(22, b.orderedSections.length * 5)
  return Math.min(100, Math.round(s))
}

export function computeStepCompletionMap(
  b: BuilderProgressInput,
  steps: ReadonlyArray<ResumeBuilderNavStep>,
): Record<string, boolean> {
  const map: Record<string, boolean> = {}
  for (const step of steps) {
    if (step.kind === 'basics') {
      map[step.id] =
        Boolean(str(b.templateKey)) &&
        Boolean(str(b.title)) &&
        Boolean(str(b.personal.name)) &&
        Boolean(str(b.personal.email))
    } else if (step.kind === 'summary') {
      map[step.id] = str(b.summary.summary).length >= 24
    } else if (step.kind === 'section-type' && step.sectionType) {
      const ofType = b.orderedSections.filter((x) => x.type === step.sectionType)
      map[step.id] = ofType.some((x) => sectionTypeHasContent(x.values))
    } else if (step.kind === 'finalize') {
      map[step.id] = true
    }
  }
  return map
}
