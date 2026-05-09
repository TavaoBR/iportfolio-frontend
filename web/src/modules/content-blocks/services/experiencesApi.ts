import { createCrudApi } from './createCrudApi'
import type { Experience, ExperiencePayload } from '../types/contentBlocks.types'

export const experiencesApi = createCrudApi<ExperiencePayload, Experience>('/api/experiences')

