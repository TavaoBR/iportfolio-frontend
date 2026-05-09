import { createCrudApi } from './createCrudApi'
import type { Education, EducationPayload } from '../types/contentBlocks.types'

export const educationsApi = createCrudApi<EducationPayload, Education>('/api/educations')

