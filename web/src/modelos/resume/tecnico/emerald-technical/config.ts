import EmeraldTechnicalTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewEmeraldTechnical from '@/assets/resume-templates/emerald-technical-preview.png'
import { templateMapping } from './mapping'

const config: ResumeTemplateDefinition = {
  key: 'emerald-technical',
  name: 'Emerald Technical',
  description:
    'Layout editorial TI: cabeçalho com círculo mint, nome em destaque, foto à direita, About Me, Education e Skills em duas colunas, Experience em grelha. Miniatura do catálogo no mesmo estilo visual; o editor renderiza este layout em tempo real.',
  family: 'technical',
  previewImage: previewEmeraldTechnical,
  sourceFile: 'emerald-technical-preview.png',
  accent: '#66E9C1',
  background: '#ffffff',
  component: EmeraldTechnicalTemplate,
  categories: ['tecnico', 'moderno'],
  tags: ['verde', 'técnico', 'skills'],
  mapping: templateMapping,
}

export default config
