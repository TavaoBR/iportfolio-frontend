import { http } from '@/services/api/http'
import { unwrapData } from '@/types/api-envelope'
import type { CreateResumePayload, Resume, ResumeSummary, UpdateResumePayload } from '../types/resume.types'

export async function listResumes(): Promise<ResumeSummary[]> {
  const { data } = await http.get<unknown>('/api/resumes')
  const list = unwrapData<ResumeSummary[]>(data)
  return Array.isArray(list) ? list : []
}

export async function createResume(payload: CreateResumePayload): Promise<Resume> {
  const { data } = await http.post<unknown>('/api/resumes', payload)
  return unwrapData<Resume>(data)
}

export async function getResume(publicId: string): Promise<Resume> {
  const { data } = await http.get<unknown>(`/api/resumes/${encodeURIComponent(publicId)}`)
  return unwrapData<Resume>(data)
}

export async function updateResume(
  publicId: string,
  payload: UpdateResumePayload,
): Promise<Resume> {
  const { data } = await http.patch<unknown>(
    `/api/resumes/${encodeURIComponent(publicId)}`,
    payload,
  )
  return unwrapData<Resume>(data)
}

export async function deleteResume(publicId: string): Promise<void> {
  await http.delete(`/api/resumes/${encodeURIComponent(publicId)}`)
}

export async function getResumePdf(publicId: string): Promise<Blob> {
  const response = await http.get(`/api/resumes/${encodeURIComponent(publicId)}/pdf`, {
    responseType: 'blob',
  })
  return response.data
}

