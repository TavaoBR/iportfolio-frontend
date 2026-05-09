# Módulo — Usuário e perfil

Cuida do registo de conta, dados básicos do utilizador e perfil profissional reutilizável em currículo/portfólio.

## Endpoints

| Método | Endpoint | Auth | Uso |
|--------|----------|------|-----|
| `POST` | `/api/users` | Público | Criar conta |
| `GET` | `/api/users/{id}` | Público no backend atual | Ver usuário por ID |
| `PUT/PATCH` | `/api/users/{id}` | Público no backend atual | Atualizar nome, e-mail, avatar |
| `PATCH` | `/api/users/{id}/activate` | Público no backend atual | Ativar conta |
| `PATCH` | `/api/users/{id}/deactivate` | Público no backend atual | Desativar conta |
| `GET` | `/api/me` | Sim | Ver sessão autenticada |
| `GET` | `/api/profile` | Sim | Obter perfil profissional |
| `POST` | `/api/profile` | Sim | Criar perfil |
| `PUT/PATCH` | `/api/profile` | Sim | Atualizar perfil |

> Nota de produto: embora alguns endpoints de usuário estejam públicos no backend atual, o frontend deve usá-los com cuidado. Edição de conta deve ser tratada como área autenticada na UX.

## Campos esperados — usuário

### Criar usuário

```ts
type CreateUserPayload = {
  name: string
  email: string
  password: string
  avatar?: string | null // base64 opcional
}
```

Validações:

- `name`: obrigatório, máx. 150.
- `email`: obrigatório, e-mail válido, máx. 180.
- `password`: obrigatório, 8–72 chars, deve conter letras e números.
- `avatar`: opcional, base64; respeitar limite de tamanho.

### Atualizar usuário

```ts
type UpdateUserPayload = {
  name?: string | null
  email?: string | null
  avatar?: string | null
}
```

## Campos esperados — perfil profissional

```ts
type UpsertProfilePayload = {
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
```

Validações:

- `headline`: máx. 180.
- `bio`: máx. 3000.
- `phone`: máx. 30.
- `city`: máx. 120.
- `state`, `country`: máx. 80.
- links: URL válida, máx. 255.

Resposta esperada de perfil:

```ts
type UserProfile = UpsertProfilePayload & {
  id: number
  created_at: string
  updated_at: string | null
}
```

## Estrutura frontend

```
src/modules/profile/
  pages/
    ProfilePage.vue
  components/
    ProfileForm.vue
    AvatarUploader.vue
  services/
    profileApi.ts
    usersApi.ts
  composables/
    useProfileForm.ts
  types/
    profile.types.ts
```

## Service Axios

```ts
export async function getProfile() {
  const { data } = await http.get<ApiEnvelope<UserProfile>>('/api/profile')
  return data.data
}

export async function upsertProfile(payload: UpsertProfilePayload) {
  const { data } = await http.patch<ApiEnvelope<UserProfile>>('/api/profile', payload)
  return data.data
}

export async function register(payload: CreateUserPayload) {
  const { data } = await http.post('/api/users', payload)
  return data.data
}
```

## UX

- Registo pode redirecionar direto para login ou fazer login automático (decisão de produto).
- Avatar: validar tipo e tamanho **antes** de converter para base64.
- Perfil: salvar com botão explícito; autosave só se houver debounce e feedback claro.
- Mostrar estado vazio: “Complete o teu perfil para melhorar sugestões do CV”.

