/** Categorias de filtro na grelha de modelos (alinhado ao plano UX). */
export type ResumeModelCategory =
  | 'moderno'
  | 'minimalista'
  | 'corporativo'
  | 'editorial'
  | 'tecnico'
  | 'executivo'

/**
 * Região visual da folha.
 * Capacidades por modelo (`supportsPhoto`, etc.): `ResumeTemplateDefinition.capabilities` em
 * `templateCapabilities.ts`, sobrescrevível no `config.ts` com `capabilities: { supportsPhoto: true }`.
 */
export type TemplateRegion = 'header' | 'sidebar' | 'main' | 'footer' | 'full'

export type SectionPresentation = 'list' | 'paragraph' | 'progress-bar' | 'tags' | 'timeline'

/**
 * Componente lógico sugerido para futura renderização dinâmica a partir do `mapping`.
 * Hoje os templates Vue continuam a usar `ResumeTemplateData` plano (Fase A).
 */
export type TemplateBlockComponent =
  | 'progress-bar'
  | 'tags'
  | 'timeline'
  | 'paragraph'
  | 'list'
  | 'contact-inline'
  | 'header-block'

/** Mapeamento de uma secção do CV para região / apresentação do modelo. */
export interface TemplateSectionMapping {
  /** Região visual da folha (preferido). */
  region: TemplateRegion
  /** Alias legado / alternativo a `region` (ex.: `position: 'header'`). */
  position?: TemplateRegion
  fields?: string[]
  presentation?: SectionPresentation
  /** Sugestão de bloco UI (ex.: progress-bar para skills). */
  component?: TemplateBlockComponent | string
}

/**
 * Contrato declarativo por secção.
 * Ponte com `createResumeTemplateData` em `web/src/modules/resume/templates/data.ts`:
 * os dados continuam a ser agregados de forma genérica; o `mapping` documenta
 * intenção de layout para futuros transformadores ou builders visuais.
 */
export interface ResumeTemplateMapping {
  sections?: Record<string, TemplateSectionMapping>
}
