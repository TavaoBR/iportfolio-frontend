import ClassicColumnTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewClassicColumn from '@/assets/resume-templates/original-f15df8b3b910b9e325b9720d571a0fa4.webp'
import { stubMapping } from '@/modelos/resume/mappingStub'

const config: ResumeTemplateDefinition = {
  key: 'classic-column',
  name: 'Classic Column',
  description: 'Modelo clássico em colunas, com tipografia serifada e organização formal completa.',
  family: 'letter',
  previewImage: previewClassicColumn,
  sourceFile: 'original-f15df8b3b910b9e325b9720d571a0fa4.webp',
  accent: '#44403c',
  background: '#fbfaf6',
  component: ClassicColumnTemplate,
  categories: ['corporativo', 'editorial'],
  tags: ['clássico', 'colunas', 'formal'],
  atsFriendly: true,
  mapping: stubMapping,
}

export default config
