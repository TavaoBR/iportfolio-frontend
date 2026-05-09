export interface CreateUserPayload {
  name: string
  email: string
  password: string
  avatar?: string | null
}

export interface UpdateUserPayload {
  name?: string | null
  email?: string | null
  avatar?: string | null
}

export interface UserAccount {
  id: number | string
  name?: string | null
  email?: string | null
  avatar?: string | null
}

export interface UpsertProfilePayload {
  headline?: string | null
  bio?: string | null
  phone?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  linkedin_url?: string | null
  github_url?: string | null
  website_url?: string | null
}

export interface UserProfile extends UpsertProfilePayload {
  id: number
  created_at: string
  updated_at: string | null
}

