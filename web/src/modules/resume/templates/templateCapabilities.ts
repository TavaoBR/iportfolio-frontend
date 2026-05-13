import type { ResumeTemplateCapabilities, ResumeTemplateDefinition } from './types'

/** Modelos com área de avatar (layouts Technical / Sidebar). */
const PHOTO_KEYS = new Set<string>([
  'botanical-sidebar',
  'teal-sidebar',
  'graphite-sidebar',
  'technical-modern',
  'structured-professional',
  'emerald-technical',
  'compact-profile',
])

const defaultCapabilities: ResumeTemplateCapabilities = {
  supportsPhoto: false,
}

/**
 * Garante `capabilities` em cada definição carregada do registry.
 * Pode ser sobrescrito no `config.ts` do modelo com `capabilities: { ... }`.
 */
export function withResumeTemplateCapabilities(def: ResumeTemplateDefinition): ResumeTemplateDefinition {
  const fromKey: ResumeTemplateCapabilities = {
    supportsPhoto: PHOTO_KEYS.has(def.key),
  }
  return {
    ...def,
    capabilities: {
      ...defaultCapabilities,
      ...fromKey,
      ...def.capabilities,
    },
  }
}
