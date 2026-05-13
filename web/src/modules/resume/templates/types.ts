import type { Component } from 'vue'
import type { Resume, ResumeSection, ResumeSectionType } from '../types/resume.types'
import type { UserProfile } from '@/modules/profile/types/profile.types'
import type { AuthUser } from '@/modules/auth/types/auth.types'
import type { ResumeModelCategory, ResumeTemplateMapping } from '@/modelos/resume/types'

export type ResumeTemplateFamily = 'sidebar' | 'letter' | 'technical' | 'split' | 'executive'

/** Capacidades do modelo — o construtor e o preview consultam isto (ex.: foto de perfil). */
export interface ResumeTemplateCapabilities {
  supportsPhoto: boolean
}

export interface ResumeTemplateDefinition {
  key: string
  name: string
  description: string
  family: ResumeTemplateFamily
  previewImage: string
  sourceFile: string
  accent: string
  background: string
  premium?: boolean
  component: Component
  /** Funcionalidades suportadas pelo layout (campos/UI no construtor). */
  capabilities?: ResumeTemplateCapabilities
  /** Metadados para picker, filtros e futuros ganchos ATS/IA */
  categories?: readonly ResumeModelCategory[]
  tags?: string[]
  atsFriendly?: boolean
  mapping?: ResumeTemplateMapping
}

export interface ResumeTemplateData {
  name: string
  headline: string
  email: string
  phone: string
  location: string
  /** Data URL ou URL https — só layouts com avatar devem ler isto. */
  photoUrl?: string | null
  links: string[]
  summary: string
  experiences: ResumeTemplateEntry[]
  educations: ResumeTemplateEntry[]
  skills: ResumeTemplateSkill[]
  languages: ResumeTemplateSkill[]
  certifications: ResumeTemplateEntry[]
  projects: ResumeTemplateEntry[]
  customSections: ResumeTemplateSection[]
}

export interface ResumeTemplateEntry {
  title: string
  subtitle?: string
  meta?: string
  description?: string
  link?: string
}

export interface ResumeTemplateSkill {
  name: string
  level?: string
  category?: string
}

export interface ResumeTemplateSection {
  title: string
  type: ResumeSectionType
  content: string
}

export interface ResumeTemplateRendererContext {
  /** Chave do modelo ativo — usada com `resume.template_key` para resolver capacidades (ex.: foto). */
  templateKey?: string | null
  resume?: Resume | null
  sections?: ResumeSection[] | null
  profile?: UserProfile | null
  user?: AuthUser | null
  fallback?: Partial<ResumeTemplateData>
  /**
   * Foto de perfil para o preview.
   * - `undefined`: não definido pelo pai — pode usar `user.avatar` se o modelo suportar foto.
   * - `null` ou `''`: explícito “sem foto” (iniciais / espaço vazio conforme o layout).
   * - string: data URL ou URL https.
   */
  profilePhotoUrl?: string | null
}
