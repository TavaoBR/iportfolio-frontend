import type { ResumeTemplateMapping } from '@/modelos/resume/types'

export const templateMapping: ResumeTemplateMapping = {
  sections: {
    personal_info: {
      region: 'sidebar',
      position: 'sidebar',
      fields: ['name', 'headline', 'email', 'phone', 'location'],
      presentation: 'list',
      component: 'contact-inline',
    },
    skills: {
      region: 'sidebar',
      presentation: 'progress-bar',
      component: 'progress-bar',
    },
    experiences: { region: 'main', presentation: 'timeline', component: 'timeline' },
    educations: { region: 'main', presentation: 'timeline', component: 'timeline' },
  },
}
