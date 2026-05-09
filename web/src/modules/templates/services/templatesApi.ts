import { http } from '@/services/api/http'
import { unwrapData } from '@/types/api-envelope'
import type {
  CreateCatalogTemplatePayload,
  TemplateCatalogItem,
  TemplateType,
  UnlockPremiumTemplatePayload,
  UpdateCatalogTemplatePayload,
  UserTemplateCatalogItem,
} from '../types/templates.types'

export async function listPublicTemplates(type?: TemplateType): Promise<TemplateCatalogItem[]> {
  const { data } = await http.get<unknown>('/api/templates', { params: { type } })
  const list = unwrapData<TemplateCatalogItem[]>(data)
  return Array.isArray(list) ? list : []
}

export async function listMyTemplates(type?: TemplateType): Promise<UserTemplateCatalogItem[]> {
  const { data } = await http.get<unknown>('/api/me/templates', { params: { type } })
  const list = unwrapData<UserTemplateCatalogItem[]>(data)
  return Array.isArray(list) ? list : []
}

export async function unlockPremiumTemplate(
  payload: UnlockPremiumTemplatePayload,
): Promise<UserTemplateCatalogItem> {
  const { data } = await http.post<unknown>('/api/me/template-unlocks', payload)
  return unwrapData<UserTemplateCatalogItem>(data)
}

export async function createCatalogTemplate(
  payload: CreateCatalogTemplatePayload,
): Promise<TemplateCatalogItem> {
  const { data } = await http.post<unknown>('/api/admin/catalog/templates', payload)
  return unwrapData<TemplateCatalogItem>(data)
}

export async function updateCatalogTemplate(
  templateKey: string,
  payload: UpdateCatalogTemplatePayload,
): Promise<TemplateCatalogItem> {
  const { data } = await http.patch<unknown>(
    `/api/admin/catalog/templates/${encodeURIComponent(templateKey)}`,
    payload,
  )
  return unwrapData<TemplateCatalogItem>(data)
}

