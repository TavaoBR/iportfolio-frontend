import AmberEditorialTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewAmberEditorial from '@/assets/resume-templates/original-c250af88fc8d0db891e904592b9a6ea4.webp'
import { stubMapping } from '@/modelos/resume/mappingStub'

const config: ResumeTemplateDefinition = {
  key: 'amber-editorial',
  name: 'Amber Editorial',
  description: 'Layout editorial com acento âmbar, blocos textuais e composição refinada em colunas.',
  family: 'executive',
  previewImage: previewAmberEditorial,
  sourceFile: 'original-c250af88fc8d0db891e904592b9a6ea4.webp',
  accent: '#d97706',
  background: '#ffffff',
  component: AmberEditorialTemplate,
  categories: ['editorial', 'executivo'],
  tags: ['âmbar', 'colunas', 'refinado'],
  mapping: stubMapping,
}

export default config
