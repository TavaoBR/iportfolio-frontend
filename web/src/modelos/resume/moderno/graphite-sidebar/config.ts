import GraphiteSidebarTemplate from './index.vue'
import type { ResumeTemplateDefinition } from '@/modules/resume/templates/types'
import previewGraphiteSidebar from '@/assets/resume-templates/original-a313a485d3ffbd57e781a5ae4bf72a26.webp'
import { stubMapping } from '@/modelos/resume/mappingStub'

const config: ResumeTemplateDefinition = {
  key: 'graphite-sidebar',
  name: 'Graphite Sidebar',
  description: 'Modelo de duas páginas com coluna grafite, módulos escuros e destaques em azul.',
  family: 'sidebar',
  previewImage: previewGraphiteSidebar,
  sourceFile: 'original-a313a485d3ffbd57e781a5ae4bf72a26.webp',
  accent: '#1f2937',
  background: '#ffffff',
  premium: true,
  component: GraphiteSidebarTemplate,
  categories: ['moderno', 'executivo'],
  tags: ['sidebar', 'grafite', 'duas páginas'],
  mapping: stubMapping,
}

export default config
