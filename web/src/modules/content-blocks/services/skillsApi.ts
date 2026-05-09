import { createCrudApi } from './createCrudApi'
import type { Skill, SkillPayload } from '../types/contentBlocks.types'

export const skillsApi = createCrudApi<SkillPayload, Skill>('/api/skills')

