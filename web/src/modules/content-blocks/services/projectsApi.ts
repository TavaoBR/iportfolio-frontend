import { createCrudApi } from './createCrudApi'
import type { Project, ProjectPayload } from '../types/contentBlocks.types'

export const projectsApi = createCrudApi<ProjectPayload, Project>('/api/projects')

