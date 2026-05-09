import { http } from '@/services/api/http'
import { unwrapData } from '@/types/api-envelope'
import type {
  ReorderResumeSectionsPayload,
  ResumeSection,
  ResumeSectionPayload,
  ResumeSectionSuggestions,
} from '../types/resume.types'

function sectionsPath(publicId: string) {
  return `/api/resumes/${encodeURIComponent(publicId)}/sections`
}

export async function listResumeSections(publicId: string): Promise<ResumeSection[]> {
  const { data } = await http.get<unknown>(sectionsPath(publicId))
  const list = unwrapData<ResumeSection[]>(data)
  return Array.isArray(list) ? list : []
}

export async function createResumeSection(
  publicId: string,
  payload: ResumeSectionPayload,
): Promise<ResumeSection> {
  const { data } = await http.post<unknown>(sectionsPath(publicId), payload)
  return unwrapData<ResumeSection>(data)
}

export async function updateResumeSection(
  publicId: string,
  sectionId: number,
  payload: Partial<ResumeSectionPayload>,
): Promise<ResumeSection> {
  const { data } = await http.patch<unknown>(`${sectionsPath(publicId)}/${sectionId}`, payload)
  return unwrapData<ResumeSection>(data)
}

export async function deleteResumeSection(publicId: string, sectionId: number): Promise<void> {
  await http.delete(`${sectionsPath(publicId)}/${sectionId}`)
}

export async function reorderResumeSections(
  publicId: string,
  payload: ReorderResumeSectionsPayload,
): Promise<void> {
  await http.post(`${sectionsPath(publicId)}/reorder`, payload)
}

export async function getResumeSectionSuggestions(
  publicId: string,
): Promise<ResumeSectionSuggestions> {
  const { data } = await http.get<unknown>(`${sectionsPath(publicId)}/suggestions`)
  return unwrapData<ResumeSectionSuggestions>(data)
}

