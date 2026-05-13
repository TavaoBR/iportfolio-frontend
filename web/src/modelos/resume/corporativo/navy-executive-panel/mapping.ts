import type { ResumeTemplateMapping } from '@/modelos/resume/types'

export const templateMapping: ResumeTemplateMapping = {
  sections: {
    personal_info: {
      region: 'sidebar',
      position: 'sidebar',
      fields: ['name', 'headline', 'email', 'phone'],
      presentation: 'list',
      component: 'contact-inline',
    },
    professional_summary: {
      region: 'main',
      presentation: 'paragraph',
      component: 'paragraph',
    },
    experiences: { region: 'main', presentation: 'timeline', component: 'timeline' },
    skills: { region: 'sidebar', presentation: 'tags', component: 'tags' },
  },
}
