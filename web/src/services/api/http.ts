import axios, { type AxiosError } from 'axios'
import { router } from '@/router'
import { useAuthStore } from '@/modules/auth/stores/useAuthStore'
import { ApiError } from '@/types/api'

function getBaseURL(): string {
  return import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'
}

function getHeaderName(): string {
  return import.meta.env.VITE_AUTH_TOKEN_HEADER ?? 'X-Token-CV'
}

export const http = axios.create({
  baseURL: getBaseURL(),
  headers: { Accept: 'application/json' },
  timeout: 30_000,
})

http.interceptors.request.use((config) => {
  const token = useAuthStore().token
  if (token) {
    config.headers[getHeaderName()] = token
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string; errors?: unknown }>) => {
    const status = err.response?.status ?? 0
    const data = err.response?.data

    if (status === 401) {
      useAuthStore().clearSession()
      if (
        router.currentRoute.value.name !== 'login' &&
        router.currentRoute.value.name !== 'register'
      ) {
        void router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
      }
    }

    const message =
      typeof data === 'object' && data && 'message' in data && typeof data.message === 'string'
        ? data.message
        : err.message

    return Promise.reject(new ApiError(status, message, data))
  },
)
