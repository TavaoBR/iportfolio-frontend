import { http } from '@/services/api/http'
import { unwrapData } from '@/types/api-envelope'
import type {
  PortfolioSection,
  PortfolioSectionPayload,
  ReorderPortfolioSectionsPayload,
} from '../types/portfolio.types'

function sectionsPath(siteId: number) {
  return `/api/portfolio-sites/${siteId}/sections`
}

export async function listPortfolioSections(siteId: number): Promise<PortfolioSection[]> {
  const { data } = await http.get<unknown>(sectionsPath(siteId))
  const list = unwrapData<PortfolioSection[]>(data)
  return Array.isArray(list) ? list : []
}

export async function createPortfolioSection(
  siteId: number,
  payload: PortfolioSectionPayload,
): Promise<PortfolioSection> {
  const { data } = await http.post<unknown>(sectionsPath(siteId), payload)
  return unwrapData<PortfolioSection>(data)
}

export async function updatePortfolioSection(
  siteId: number,
  sectionId: number,
  payload: Partial<PortfolioSectionPayload>,
): Promise<PortfolioSection> {
  const { data } = await http.patch<unknown>(`${sectionsPath(siteId)}/${sectionId}`, payload)
  return unwrapData<PortfolioSection>(data)
}

export async function deletePortfolioSection(siteId: number, sectionId: number): Promise<void> {
  await http.delete(`${sectionsPath(siteId)}/${sectionId}`)
}

export async function reorderPortfolioSections(
  siteId: number,
  payload: ReorderPortfolioSectionsPayload,
): Promise<void> {
  await http.post(`${sectionsPath(siteId)}/reorder`, payload)
}

