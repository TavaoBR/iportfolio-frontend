import type { ResumeTemplateMapping } from '@/modelos/resume/types'

/** Mapeamento declarativo: regiões do layout Emerald Technical (referência editorial TI). */
export const templateMapping: ResumeTemplateMapping = {
  sections: {
    personal_info: {
      region: 'header',
      position: 'header',
      fields: ['name', 'headline', 'email', 'phone', 'location', 'photo'],
      presentation: 'list',
      component: 'header-block',
    },
    professional_summary: {
      region: 'main',
      presentation: 'paragraph',
      component: 'paragraph',
    },
    educations: {
      region: 'main',
      presentation: 'timeline',
      component: 'list',
    },
    skills: {
      region: 'main',
      presentation: 'progress-bar',
      component: 'progress-bar',
    },
    experiences: {
      region: 'main',
      presentation: 'timeline',
      component: 'timeline',
    },
  },
}
