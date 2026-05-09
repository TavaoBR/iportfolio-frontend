import { createCrudApi } from './createCrudApi'
import type { Certification, CertificationPayload } from '../types/contentBlocks.types'

export const certificationsApi = createCrudApi<CertificationPayload, Certification>(
  '/api/certifications',
)

