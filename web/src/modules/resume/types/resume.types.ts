export type ResumeLanguage = 'pt_BR' | 'en_US' | 'es_ES'

export interface CreateResumePayload {
  title: string
  target_role?: string | null
  language?: ResumeLanguage
  is_main?: boolean
  template_key?: string | null
}

export type UpdateResumePayload = Partial<CreateResumePayload> & {
  is_public?: boolean
}

export interface Resume {
  id: number
  public_id: string
  title: string
  target_role: string | null
  language: ResumeLanguage
  template_key: string | null
  ats_score: number | null
  is_main: boolean
  is_public: boolean
  created_at: string
  updated_at: string | null
}

export type ResumeSummary = Partial<Resume> & {
  public_id: string
  title?: string
}

export type ResumeSectionType =
  | 'personal_info'
  | 'professional_summary'
  | 'experiences'
  | 'educations'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'projects'
  | 'links'
  | 'custom'

export interface ResumeSectionPayload {
  section_type: ResumeSectionType
  title?: string | null
  content?: string | null
  position?: number
  is_visible?: boolean
}

export interface ResumeSection extends ResumeSectionPayload {
  id: number
}

export interface ReorderResumeSectionsPayload {
  ordered_ids: number[]
}

export interface ResumeSectionSuggestions {
  by_section_type: Record<ResumeSectionType, string>
}

