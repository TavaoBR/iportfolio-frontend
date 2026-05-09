import { http } from '@/services/api/http'
import { unwrapData } from '@/types/api-envelope'
import type {
  CreatePortfolioSitePayload,
  PortfolioSite,
  PublicPortfolioPayload,
  UpdatePortfolioSitePayload,
} from '../types/portfolio.types'

export async function listPortfolioSites(): Promise<PortfolioSite[]> {
  const { data } = await http.get<unknown>('/api/portfolio-sites')
  const list = unwrapData<PortfolioSite[]>(data)
  return Array.isArray(list) ? list : []
}

export async function createPortfolioSite(
  payload: CreatePortfolioSitePayload,
): Promise<PortfolioSite> {
  const { data } = await http.post<unknown>('/api/portfolio-sites', payload)
  return unwrapData<PortfolioSite>(data)
}

export async function getPortfolioSite(id: number): Promise<PortfolioSite> {
  const { data } = await http.get<unknown>(`/api/portfolio-sites/${id}`)
  return unwrapData<PortfolioSite>(data)
}

export async function updatePortfolioSite(
  id: number,
  payload: UpdatePortfolioSitePayload,
): Promise<PortfolioSite> {
  const { data } = await http.patch<unknown>(`/api/portfolio-sites/${id}`, payload)
  return unwrapData<PortfolioSite>(data)
}

export async function deletePortfolioSite(id: number): Promise<void> {
  await http.delete(`/api/portfolio-sites/${id}`)
}

export async function publishPortfolioSite(id: number): Promise<PortfolioSite> {
  const { data } = await http.post<unknown>(`/api/portfolio-sites/${id}/publish`)
  return unwrapData<PortfolioSite>(data)
}

export async function getPublicPortfolio(slug: string): Promise<PublicPortfolioPayload> {
  const { data } = await http.get<unknown>(`/api/public/portfolio/${encodeURIComponent(slug)}`)
  return unwrapData<PublicPortfolioPayload>(data)
}

