import CoverLetterGrayTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewCoverLetterGray from '@/assets/resume-templates/original-a1eb38036222e5595fc8ba4809b43634.webp'
import { stubMapping } from '@/modelos/resume/mappingStub'

const config: ResumeTemplateDefinition = {
  key: 'cover-letter-gray',
  name: 'Cover Letter Gray',
  description: 'Composição editorial cinza, com folha destacada e leitura limpa para perfis formais.',
  family: 'executive',
  previewImage: previewCoverLetterGray,
  sourceFile: 'original-a1eb38036222e5595fc8ba4809b43634.webp',
  accent: '#6b7280',
  background: '#f4f4f5',
  component: CoverLetterGrayTemplate,
  categories: ['executivo', 'editorial'],
  tags: ['carta', 'cinza', 'formal'],
  mapping: stubMapping,
}

export default config
