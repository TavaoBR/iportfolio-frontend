export interface CreatePortfolioSitePayload {
  slug: string
  title: string
  subtitle?: string | null
  template_key?: string | null
}

export type UpdatePortfolioSitePayload = Partial<CreatePortfolioSitePayload> & {
  is_public?: boolean
}

export interface PortfolioSite {
  id: number
  slug: string
  title: string
  subtitle: string | null
  template_key: string | null
  is_public: boolean
  created_at: string
  updated_at: string | null
  sections?: PortfolioSection[]
}

export type PortfolioLayoutType =
  | 'grid'
  | 'list'
  | 'cards'
  | 'carousel'
  | 'timeline'
  | 'tags'
  | 'progress_bar'
  | 'simple'

export interface PortfolioSectionPayload {
  section_type: string
  layout_type: PortfolioLayoutType
  position?: number
  is_visible?: boolean
  settings?: Record<string, unknown> | null
}

export interface PortfolioSection extends PortfolioSectionPayload {
  id: number
}

export interface ReorderPortfolioSectionsPayload {
  ordered_ids: number[]
}

export type PublicPortfolioPayload = PortfolioSite

