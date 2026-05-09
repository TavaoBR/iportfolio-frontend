export interface SortableEntity {
  id: number
  sort_order?: number | null
}

export interface ExperiencePayload {
  company: string
  role: string
  description?: string | null
  location?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current?: boolean
  sort_order?: number
}

export type Experience = ExperiencePayload & SortableEntity

export interface EducationPayload {
  institution: string
  degree?: string | null
  field_of_study?: string | null
  description?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current?: boolean
  sort_order?: number
}

export type Education = EducationPayload & SortableEntity

export interface SkillPayload {
  name: string
  category?: string | null
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
  sort_order?: number
}

export type Skill = SkillPayload & SortableEntity

export interface ProjectPayload {
  name: string
  description?: string | null
  project_url?: string | null
  repository_url?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current?: boolean
  sort_order?: number
}

export type Project = ProjectPayload & SortableEntity

export interface CertificationPayload {
  name: string
  issuer?: string | null
  credential_url?: string | null
  issued_at?: string | null
  expires_at?: string | null
  sort_order?: number
}

export type Certification = CertificationPayload & SortableEntity

