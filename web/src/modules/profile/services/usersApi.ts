import { http } from '@/services/api/http'
import { unwrapData } from '@/types/api-envelope'
import type { CreateUserPayload, UpdateUserPayload, UserAccount } from '../types/profile.types'

export async function register(payload: CreateUserPayload): Promise<UserAccount> {
  const { data } = await http.post<unknown>('/api/users', payload)
  return unwrapData<UserAccount>(data)
}

export async function getUser(id: number | string): Promise<UserAccount> {
  const { data } = await http.get<unknown>(`/api/users/${encodeURIComponent(id)}`)
  return unwrapData<UserAccount>(data)
}

export async function updateUser(
  id: number | string,
  payload: UpdateUserPayload,
): Promise<UserAccount> {
  const { data } = await http.patch<unknown>(`/api/users/${encodeURIComponent(id)}`, payload)
  return unwrapData<UserAccount>(data)
}

export async function activateUser(id: number | string): Promise<UserAccount> {
  const { data } = await http.patch<unknown>(`/api/users/${encodeURIComponent(id)}/activate`)
  return unwrapData<UserAccount>(data)
}

export async function deactivateUser(id: number | string): Promise<UserAccount> {
  const { data } = await http.patch<unknown>(`/api/users/${encodeURIComponent(id)}/deactivate`)
  return unwrapData<UserAccount>(data)
}

