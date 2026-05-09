import type { Component } from 'vue'
import type { Resume, ResumeSection, ResumeSectionType } from '../types/resume.types'
import type { UserProfile } from '@/modules/profile/types/profile.types'
import type { AuthUser } from '@/modules/auth/types/auth.types'

export type ResumeTemplateFamily = 'sidebar' | 'letter' | 'technical' | 'split' | 'executive'

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
}

export interface ResumeTemplateData {
  name: string
  headline: string
  email: string
  phone: string
  location: string
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
  resume?: Resume | null
  sections?: ResumeSection[] | null
  profile?: UserProfile | null
  user?: AuthUser | null
  fallback?: Partial<ResumeTemplateData>
}
