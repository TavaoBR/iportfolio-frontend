import StructuredProfessionalTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewStructuredProfessional from '@/assets/resume-templates/original-923c3f4afb4be201b742b151ad753d69.webp'
import { stubMapping } from '@/modelos/resume/mappingStub'

const config: ResumeTemplateDefinition = {
  key: 'structured-professional',
  name: 'Structured Professional',
  description:
    'Modelo técnico com linhas finas, tabela visual e estrutura compacta para alta densidade.',
  family: 'technical',
  previewImage: previewStructuredProfessional,
  sourceFile: 'original-923c3f4afb4be201b742b151ad753d69.webp',
  accent: '#3b82a0',
  background: '#ffffff',
  component: StructuredProfessionalTemplate,
  categories: ['tecnico', 'corporativo'],
  tags: ['tabela', 'denso', 'ATS'],
  atsFriendly: true,
  mapping: stubMapping,
}

export default config
