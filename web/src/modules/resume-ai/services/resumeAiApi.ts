import { http } from '@/services/api/http'
import { unwrapData } from '@/types/api-envelope'
import type { AiAnalysis, AiCompareJobPayload } from '../types/resumeAi.types'

function aiPath(publicId: string) {
  return `/api/resumes/${encodeURIComponent(publicId)}/ai`
}

export async function analyzeResume(publicId: string): Promise<AiAnalysis> {
  const { data } = await http.post<unknown>(`${aiPath(publicId)}/analyze`, {})
  return unwrapData<AiAnalysis>(data)
}

export async function optimizeResume(publicId: string): Promise<AiAnalysis> {
  const { data } = await http.post<unknown>(`${aiPath(publicId)}/optimize`, {})
  return unwrapData<AiAnalysis>(data)
}

export async function compareJob(
  publicId: string,
  payload: AiCompareJobPayload,
): Promise<AiAnalysis> {
  const { data } = await http.post<unknown>(`${aiPath(publicId)}/compare-job`, payload)
  return unwrapData<AiAnalysis>(data)
}

export async function listResumeAiAnalyses(publicId: string): Promise<AiAnalysis[]> {
  const { data } = await http.get<unknown>(`${aiPath(publicId)}/analyses`)
  const list = unwrapData<AiAnalysis[]>(data)
  return Array.isArray(list) ? list : []
}

export async function getResumeAiAnalysis(
  publicId: string,
  analysisId: number,
): Promise<AiAnalysis> {
  const { data } = await http.get<unknown>(`${aiPath(publicId)}/analyses/${analysisId}`)
  return unwrapData<AiAnalysis>(data)
}

