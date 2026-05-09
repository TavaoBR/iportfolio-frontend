import SidebarTemplate from './components/layouts/SidebarTemplate.vue'
import LetterTemplate from './components/layouts/LetterTemplate.vue'
import TechnicalTemplate from './components/layouts/TechnicalTemplate.vue'
import SplitTemplate from './components/layouts/SplitTemplate.vue'
import ExecutiveTemplate from './components/layouts/ExecutiveTemplate.vue'
import type { ResumeTemplateDefinition } from './types'

import previewBotanicalSidebar from '@/assets/resume-templates/original-015f74779a5f8ffed88c9d00a5aefd86.webp'
import previewEditorialLetter from '@/assets/resume-templates/original-2eefb07bdf771f4790bd0e7d546a77ee.webp'
import previewNavyExecutivePanel from '@/assets/resume-templates/original-642e6d4ce105d2e594bbc7645c31d362.webp'
import previewMinimalLetter from '@/assets/resume-templates/original-6e9df6fd1ff082fcaabcfb36a481cac4.webp'
import previewTealSidebar from '@/assets/resume-templates/original-89f566083d783d57a6f13feb909c0941.webp'
import previewStructuredProfessional from '@/assets/resume-templates/original-923c3f4afb4be201b742b151ad753d69.webp'
import previewTechnicalModern from '@/assets/resume-templates/original-98750d399728ebb70a09a792c5f5d25b.webp'
import previewCoverLetterGray from '@/assets/resume-templates/original-a1eb38036222e5595fc8ba4809b43634.webp'
import previewGraphiteSidebar from '@/assets/resume-templates/original-a313a485d3ffbd57e781a5ae4bf72a26.webp'
import previewCompactProfile from '@/assets/resume-templates/original-b29a210208eb96c8574a4229386818ee.webp'
import previewEmeraldTechnical from '@/assets/resume-templates/original-b714024596fa2a8ffa56fa9fe9407d6c.webp'
import previewAmberEditorial from '@/assets/resume-templates/original-c250af88fc8d0db891e904592b9a6ea4.webp'
import previewClassicColumn from '@/assets/resume-templates/original-f15df8b3b910b9e325b9720d571a0fa4.webp'

export const resumeTemplateRegistry: ResumeTemplateDefinition[] = [
  {
    key: 'botanical-sidebar',
    name: 'Botanical Sidebar',
    description: 'Layout premium com coluna escura, área editorial clara e composição com respiro visual.',
    family: 'sidebar',
    previewImage: previewBotanicalSidebar,
    sourceFile: 'original-015f74779a5f8ffed88c9d00a5aefd86.webp',
    accent: '#183346',
    background: '#ffffff',
    component: SidebarTemplate,
  },
  {
    key: 'editorial-letter',
    name: 'Editorial Letter',
    description: 'Currículo clássico em uma página, tipografia serifada e atmosfera de papel editorial.',
    family: 'letter',
    previewImage: previewEditorialLetter,
    sourceFile: 'original-2eefb07bdf771f4790bd0e7d546a77ee.webp',
    accent: '#9b6b42',
    background: '#fbfaf6',
    component: LetterTemplate,
  },
  {
    key: 'navy-executive-panel',
    name: 'Navy Executive Panel',
    description: 'Modelo executivo com painel lateral navy e hierarquia corporativa em duas páginas.',
    family: 'split',
    previewImage: previewNavyExecutivePanel,
    sourceFile: 'original-642e6d4ce105d2e594bbc7645c31d362.webp',
    accent: '#1f344f',
    background: '#ffffff',
    premium: true,
    component: SplitTemplate,
  },
  {
    key: 'minimal-letter',
    name: 'Minimal Letter',
    description: 'Documento minimalista, elegante e direto, com foco em leitura e densidade controlada.',
    family: 'letter',
    previewImage: previewMinimalLetter,
    sourceFile: 'original-6e9df6fd1ff082fcaabcfb36a481cac4.webp',
    accent: '#262626',
    background: '#fbfaf6',
    component: LetterTemplate,
  },
  {
    key: 'teal-sidebar',
    name: 'Teal Sidebar',
    description: 'Template moderno com sidebar teal, avatar forte e blocos laterais bem definidos.',
    family: 'sidebar',
    previewImage: previewTealSidebar,
    sourceFile: 'original-89f566083d783d57a6f13feb909c0941.webp',
    accent: '#0f766e',
    background: '#ffffff',
    component: SidebarTemplate,
  },
  {
    key: 'structured-professional',
    name: 'Structured Professional',
    description: 'Modelo técnico com linhas finas, tabela visual e estrutura compacta para alta densidade.',
    family: 'technical',
    previewImage: previewStructuredProfessional,
    sourceFile: 'original-923c3f4afb4be201b742b151ad753d69.webp',
    accent: '#3b82a0',
    background: '#ffffff',
    component: TechnicalTemplate,
  },
  {
    key: 'technical-modern',
    name: 'Technical Modern',
    description: 'CV objetivo, modular e orientado a dados, ideal para perfis técnicos e operacionais.',
    family: 'technical',
    previewImage: previewTechnicalModern,
    sourceFile: 'original-98750d399728ebb70a09a792c5f5d25b.webp',
    accent: '#111827',
    background: '#ffffff',
    component: TechnicalTemplate,
  },
  {
    key: 'cover-letter-gray',
    name: 'Cover Letter Gray',
    description: 'Composição editorial cinza, com folha destacada e leitura limpa para perfis formais.',
    family: 'executive',
    previewImage: previewCoverLetterGray,
    sourceFile: 'original-a1eb38036222e5595fc8ba4809b43634.webp',
    accent: '#6b7280',
    background: '#f4f4f5',
    component: ExecutiveTemplate,
  },
  {
    key: 'graphite-sidebar',
    name: 'Graphite Sidebar',
    description: 'Modelo de duas páginas com coluna grafite, módulos escuros e destaques em azul.',
    family: 'sidebar',
    previewImage: previewGraphiteSidebar,
    sourceFile: 'original-a313a485d3ffbd57e781a5ae4bf72a26.webp',
    accent: '#1f2937',
    background: '#ffffff',
    premium: true,
    component: SidebarTemplate,
  },
  {
    key: 'compact-profile',
    name: 'Compact Profile',
    description: 'Template compacto com foto, grid de informações e leitura rápida para perfis objetivos.',
    family: 'technical',
    previewImage: previewCompactProfile,
    sourceFile: 'original-b29a210208eb96c8574a4229386818ee.webp',
    accent: '#71717a',
    background: '#ffffff',
    component: TechnicalTemplate,
  },
  {
    key: 'emerald-technical',
    name: 'Emerald Technical',
    description: 'Currículo técnico com acento verde, avatar superior e estrutura clara de competências.',
    family: 'technical',
    previewImage: previewEmeraldTechnical,
    sourceFile: 'original-b714024596fa2a8ffa56fa9fe9407d6c.webp',
    accent: '#10a37f',
    background: '#ffffff',
    component: TechnicalTemplate,
  },
  {
    key: 'amber-editorial',
    name: 'Amber Editorial',
    description: 'Layout editorial com acento âmbar, blocos textuais e composição refinada em colunas.',
    family: 'executive',
    previewImage: previewAmberEditorial,
    sourceFile: 'original-c250af88fc8d0db891e904592b9a6ea4.webp',
    accent: '#d97706',
    background: '#ffffff',
    component: ExecutiveTemplate,
  },
  {
    key: 'classic-column',
    name: 'Classic Column',
    description: 'Modelo clássico em colunas, com tipografia serifada e organização formal completa.',
    family: 'letter',
    previewImage: previewClassicColumn,
    sourceFile: 'original-f15df8b3b910b9e325b9720d571a0fa4.webp',
    accent: '#44403c',
    background: '#fbfaf6',
    component: LetterTemplate,
  },
]

export function getResumeTemplateDefinition(templateKey?: string | null) {
  return (
    resumeTemplateRegistry.find((template) => template.key === templateKey) ??
    resumeTemplateRegistry[0]
  )
}

export function isMappedResumeTemplateKey(templateKey?: string | null) {
  return resumeTemplateRegistry.some((template) => template.key === templateKey)
}
