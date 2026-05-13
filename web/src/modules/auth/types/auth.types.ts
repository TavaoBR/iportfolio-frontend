export interface AuthUser {
  id?: number | string
  name?: string
  email?: string
  avatar?: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user?: AuthUser
  expires_at?: string
}

