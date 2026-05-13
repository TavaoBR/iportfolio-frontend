import TealSidebarTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewTealSidebar from '@/assets/resume-templates/original-89f566083d783d57a6f13feb909c0941.webp'
import { stubMapping } from '@/modelos/resume/mappingStub'

const config: ResumeTemplateDefinition = {
  key: 'teal-sidebar',
  name: 'Teal Sidebar',
  description: 'Template moderno com sidebar teal, avatar forte e blocos laterais bem definidos.',
  family: 'sidebar',
  previewImage: previewTealSidebar,
  sourceFile: 'original-89f566083d783d57a6f13feb909c0941.webp',
  accent: '#0f766e',
  background: '#ffffff',
  component: TealSidebarTemplate,
  categories: ['moderno', 'tecnico'],
  tags: ['sidebar', 'teal', 'avatar'],
  mapping: stubMapping,
}

export default config
