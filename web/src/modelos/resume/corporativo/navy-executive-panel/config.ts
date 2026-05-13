import NavyExecutivePanelTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewNavyExecutivePanel from '@/assets/resume-templates/original-642e6d4ce105d2e594bbc7645c31d362.webp'
import { templateMapping } from './mapping'

const config: ResumeTemplateDefinition = {
  key: 'navy-executive-panel',
  name: 'Navy Executive Panel',
  description: 'Modelo executivo com painel lateral navy e hierarquia corporativa em duas páginas.',
  family: 'split',
  previewImage: previewNavyExecutivePanel,
  sourceFile: 'original-642e6d4ce105d2e594bbc7645c31d362.webp',
  accent: '#1f344f',
  background: '#ffffff',
  premium: true,
  component: NavyExecutivePanelTemplate,
  categories: ['corporativo', 'executivo'],
  tags: ['executivo', 'navy', 'painel'],
  atsFriendly: true,
  mapping: templateMapping,
}

export default config
