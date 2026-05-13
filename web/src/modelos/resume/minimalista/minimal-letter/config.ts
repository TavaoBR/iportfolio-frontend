import MinimalLetterTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewMinimalLetter from '@/assets/resume-templates/original-6e9df6fd1ff082fcaabcfb36a481cac4.webp'
import { stubMapping } from '@/modelos/resume/mappingStub'

const config: ResumeTemplateDefinition = {
  key: 'minimal-letter',
  name: 'Minimal Letter',
  description: 'Documento minimalista, elegante e direto, com foco em leitura e densidade controlada.',
  family: 'letter',
  previewImage: previewMinimalLetter,
  sourceFile: 'original-6e9df6fd1ff082fcaabcfb36a481cac4.webp',
  accent: '#262626',
  background: '#fbfaf6',
  component: MinimalLetterTemplate,
  categories: ['minimalista', 'moderno'],
  tags: ['minimal', 'limpo'],
  atsFriendly: true,
  mapping: stubMapping,
}

export default config
