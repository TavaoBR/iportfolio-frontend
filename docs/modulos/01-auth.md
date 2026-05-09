# Módulo — Autenticação

Responsável por login, logout, sessão local, guards de rota e anexação do token nas chamadas Axios.

## Endpoints

| Método | Endpoint | Auth | Uso no frontend |
|--------|----------|------|-----------------|
| `POST` | `/api/auth/login` | Público | Enviar credenciais e guardar token |
| `POST` | `/api/auth/logout` | Sim | Encerrar sessão atual no backend |
| `GET` | `/api/me` | Sim | Rehidratar sessão ao abrir a SPA |

## Campos esperados

### `POST /api/auth/login`

```ts
type LoginPayload = {
  email: string
  password: string
}
```

Validações da API:

- `email`: obrigatório, formato de e-mail.
- `password`: obrigatório.

Resposta esperada (normalizar no frontend conforme `data` real):

```ts
type LoginResponse = {
  token: string
  user?: AuthUser
  expires_at?: string
}
```

### Header autenticado

```ts
const headerName = import.meta.env.VITE_AUTH_TOKEN_HEADER ?? 'X-Token-CV'
```

Todos os requests privados devem enviar:

```http
X-Token-CV: <token>
```

## Estrutura sugerida

```
src/modules/auth/
  pages/
    LoginPage.vue
  services/
    authApi.ts
  stores/
    useAuthStore.ts
  types/
    auth.types.ts
  composables/
    useAuthRedirect.ts
```

## Service Axios

```ts
// src/modules/auth/services/authApi.ts
import { http } from '@/services/api/http'

export type LoginPayload = {
  email: string
  password: string
}

export async function login(payload: LoginPayload) {
  const { data } = await http.post('/api/auth/login', payload)
  return data.data
}

export async function logout() {
  const { data } = await http.post('/api/auth/logout')
  return data
}

export async function fetchMe() {
  const { data } = await http.get('/api/me')
  return data.data
}
```

## Store Pinia

Responsabilidades da `useAuthStore`:

- guardar `token`;
- guardar `user`;
- expor `isAuthenticated`;
- executar `login`, `logout`, `hydrate`;
- limpar sessão em `401`.

```ts
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(sessionStorage.getItem('auth.token'))
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  async function signIn(payload: LoginPayload) {
    const response = await login(payload)
    token.value = response.token
    sessionStorage.setItem('auth.token', response.token)
    user.value = response.user ?? null
  }

  async function signOut() {
    try {
      await logout()
    } finally {
      token.value = null
      user.value = null
      sessionStorage.removeItem('auth.token')
    }
  }

  return { token, user, isAuthenticated, signIn, signOut }
})
```

## Router guard

```ts
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

## UX

- Login deve mostrar erros de validação e credenciais inválidas.
- Em `401`, limpar sessão e enviar para login.
- Em logout, chamar API e limpar storage mesmo se o backend falhar.
- Não mostrar “flash” de dashboard privado antes de `hydrate()`.

