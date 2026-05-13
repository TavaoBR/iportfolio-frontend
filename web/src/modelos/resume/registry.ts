import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import { withResumeTemplateCapabilities } from '@/modules/resume/templates/templateCapabilities'

const modules = import.meta.glob<{ default: ResumeTemplateDefinition }>('./**/config.ts', {
  eager: true,
})

/** Ordem estável na UI (alinhada ao catálogo anterior). */
const CANONICAL_ORDER = [
  'botanical-sidebar',
  'editorial-letter',
  'navy-executive-panel',
  'minimal-letter',
  'teal-sidebar',
  'structured-professional',
  'technical-modern',
  'cover-letter-gray',
  'graphite-sidebar',
  'compact-profile',
  'emerald-technical',
  'amber-editorial',
  'classic-column',
] as const

function orderIndex(key: string): number {
  const i = (CANONICAL_ORDER as readonly string[]).indexOf(key)
  return i === -1 ? 999 : i
}

function loadFromGlob(): ResumeTemplateDefinition[] {
  const list = Object.values(modules).map((m) => withResumeTemplateCapabilities(m.default))
  return list.sort((a, b) => {
    const d = orderIndex(a.key) - orderIndex(b.key)
    if (d !== 0) return d
    return a.key.localeCompare(b.key)
  })
}

export const resumeModeloRegistry: ResumeTemplateDefinition[] = loadFromGlob()

export function getResumeModeloDefinition(templateKey?: string | null) {
  return (
    resumeModeloRegistry.find((t) => t.key === templateKey) ?? resumeModeloRegistry[0]
  )
}

export function isMappedResumeModeloKey(templateKey?: string | null) {
  return resumeModeloRegistry.some((t) => t.key === templateKey)
}
