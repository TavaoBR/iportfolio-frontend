import TechnicalModernTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewTechnicalModern from '@/assets/resume-templates/original-98750d399728ebb70a09a792c5f5d25b.webp'
import { stubMapping } from '@/modelos/resume/mappingStub'

const config: ResumeTemplateDefinition = {
  key: 'technical-modern',
  name: 'Technical Modern',
  description: 'CV objetivo, modular e orientado a dados, ideal para perfis técnicos e operacionais.',
  family: 'technical',
  previewImage: previewTechnicalModern,
  sourceFile: 'original-98750d399728ebb70a09a792c5f5d25b.webp',
  accent: '#111827',
  background: '#ffffff',
  component: TechnicalModernTemplate,
  categories: ['tecnico', 'moderno'],
  tags: ['dados', 'modular'],
  mapping: stubMapping,
}

export default config
