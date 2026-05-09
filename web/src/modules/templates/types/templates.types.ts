export type TemplateType = 'resume' | 'portfolio'

export interface TemplateCatalogItem {
  id?: number
  name: string
  template_key: string
  type?: TemplateType
  preview_image?: string | null
  preview_url?: string | null
  is_premium?: boolean
  premium_price?: string | number | null
  section_schema?: Record<string, unknown> | null
}

export interface UserTemplateCatalogItem extends TemplateCatalogItem {
  is_unlocked?: boolean
  can_use?: boolean
  bundle_ref?: string | null
}

export interface UnlockPremiumTemplatePayload {
  template_key: string
  payment_reference?: string | null
}

export interface CreateCatalogTemplatePayload {
  name: string
  template_key: string
  type: TemplateType
  is_premium?: boolean
  preview_image?: string | null
  preview_url?: string | null
  bundle_ref?: string | null
  definition_json?: Record<string, unknown> | null
  premium_price?: string | null
}

export type UpdateCatalogTemplatePayload = Partial<CreateCatalogTemplatePayload>

