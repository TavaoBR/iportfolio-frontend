import BotanicalSidebarTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewBotanicalSidebar from '@/assets/resume-templates/original-015f74779a5f8ffed88c9d00a5aefd86.webp'
import { templateMapping } from './mapping'

const config: ResumeTemplateDefinition = {
  key: 'botanical-sidebar',
  name: 'Botanical Sidebar',
  description:
    'Layout premium com coluna escura, área editorial clara e composição com respiro visual.',
  family: 'sidebar',
  previewImage: previewBotanicalSidebar,
  sourceFile: 'original-015f74779a5f8ffed88c9d00a5aefd86.webp',
  accent: '#183346',
  background: '#ffffff',
  component: BotanicalSidebarTemplate,
  categories: ['moderno', 'executivo'],
  tags: ['sidebar', 'botânico', 'duas colunas'],
  atsFriendly: true,
  mapping: templateMapping,
}

export default config
