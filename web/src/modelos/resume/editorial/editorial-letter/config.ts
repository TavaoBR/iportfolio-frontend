import EditorialLetterTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewEditorialLetter from '@/assets/resume-templates/original-2eefb07bdf771f4790bd0e7d546a77ee.webp'
import { stubMapping } from '@/modelos/resume/mappingStub'

const config: ResumeTemplateDefinition = {
  key: 'editorial-letter',
  name: 'Editorial Letter',
  description: 'Currículo clássico em uma página, tipografia serifada e atmosfera de papel editorial.',
  family: 'letter',
  previewImage: previewEditorialLetter,
  sourceFile: 'original-2eefb07bdf771f4790bd0e7d546a77ee.webp',
  accent: '#9b6b42',
  background: '#fbfaf6',
  component: EditorialLetterTemplate,
  categories: ['editorial', 'minimalista'],
  tags: ['serif', 'carta', 'uma página'],
  mapping: stubMapping,
}

export default config
