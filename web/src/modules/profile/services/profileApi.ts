import { http } from '@/services/api/http'
import { unwrapData } from '@/types/api-envelope'
import type { UpsertProfilePayload, UserProfile } from '../types/profile.types'

export async function getProfile(): Promise<UserProfile | null> {
  const { data } = await http.get<unknown>('/api/profile')
  return unwrapData<UserProfile | null>(data)
}

export async function upsertProfile(payload: UpsertProfilePayload): Promise<UserProfile> {
  const { data } = await http.patch<unknown>('/api/profile', payload)
  return unwrapData<UserProfile>(data)
}

