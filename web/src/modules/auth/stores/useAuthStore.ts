import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchMe, login, logout } from '../services/authApi'
import type { AuthUser, LoginPayload } from '../types/auth.types'

const STORAGE_KEY = 'auth.token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(sessionStorage.getItem(STORAGE_KEY))
  const user = ref<AuthUser | null>(null)
  const hydrating = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))

  function setToken(value: string | null) {
    token.value = value
    if (value) {
      sessionStorage.setItem(STORAGE_KEY, value)
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  async function signIn(payload: LoginPayload) {
    const response = await login(payload)
    setToken(response.token)
    user.value = response.user ?? null
  }

  async function hydrate() {
    if (!token.value || user.value) return

    hydrating.value = true
    try {
      user.value = await fetchMe()
    } catch {
      clearSession()
    } finally {
      hydrating.value = false
    }
  }

  async function signOut() {
    try {
      if (token.value) {
        await logout()
      }
    } finally {
      clearSession()
    }
  }

  function clearSession() {
    setToken(null)
    user.value = null
  }

  return {
    token,
    user,
    hydrating,
    isAuthenticated,
    setToken,
    signIn,
    hydrate,
    signOut,
    clearSession,
  }
})

