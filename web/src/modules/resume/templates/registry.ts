import type { ResumeTemplateDefinition } from './types'
import {
  getResumeModeloDefinition,
  isMappedResumeModeloKey,
  resumeModeloRegistry,
} from '@/modelos/resume/registry'

export const resumeTemplateRegistry: ResumeTemplateDefinition[] = resumeModeloRegistry

export function getResumeTemplateDefinition(templateKey?: string | null) {
  return getResumeModeloDefinition(templateKey)
}

export function isMappedResumeTemplateKey(templateKey?: string | null) {
  return isMappedResumeModeloKey(templateKey)
}
