import { http } from '@/services/api/http'
import { unwrapData } from '@/types/api-envelope'
import type { AuthUser, LoginPayload, LoginResponse } from '../types/auth.types'

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await http.post<unknown>('/api/auth/login', payload)
  const response = unwrapData<LoginResponse>(data)

  if (!response?.token) {
    throw new Error('Resposta de login sem token.')
  }

  return response
}

export async function logout(): Promise<void> {
  await http.post('/api/auth/logout')
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await http.get<unknown>('/api/me')
  return unwrapData<AuthUser>(data)
}

