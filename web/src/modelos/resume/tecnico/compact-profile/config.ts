import CompactProfileTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewCompactProfile from '@/assets/resume-templates/original-b29a210208eb96c8574a4229386818ee.webp'
import { stubMapping } from '@/modelos/resume/mappingStub'

const config: ResumeTemplateDefinition = {
  key: 'compact-profile',
  name: 'Compact Profile',
  description: 'Template compacto com foto, grid de informações e leitura rápida para perfis objetivos.',
  family: 'technical',
  previewImage: previewCompactProfile,
  sourceFile: 'original-b29a210208eb96c8574a4229386818ee.webp',
  accent: '#71717a',
  background: '#ffffff',
  component: CompactProfileTemplate,
  categories: ['tecnico', 'moderno'],
  tags: ['compacto', 'foto', 'grid'],
  mapping: stubMapping,
}

export default config
