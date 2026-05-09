# Módulo — Blocos profissionais

Blocos reutilizáveis usados para alimentar sugestões e secções do currículo/portfólio: experiências, educação, competências, projetos e certificações.

## Endpoints

Todos exigem autenticação.

| Recurso | Listar | Criar | Atualizar | Remover |
|---------|--------|-------|-----------|---------|
| Experiências | `GET /api/experiences` | `POST /api/experiences` | `PUT/PATCH /api/experiences/{id}` | `DELETE /api/experiences/{id}` |
| Educação | `GET /api/educations` | `POST /api/educations` | `PUT/PATCH /api/educations/{id}` | `DELETE /api/educations/{id}` |
| Skills | `GET /api/skills` | `POST /api/skills` | `PUT/PATCH /api/skills/{id}` | `DELETE /api/skills/{id}` |
| Projetos | `GET /api/projects` | `POST /api/projects` | `PUT/PATCH /api/projects/{id}` | `DELETE /api/projects/{id}` |
| Certificações | `GET /api/certifications` | `POST /api/certifications` | `PUT/PATCH /api/certifications/{id}` | `DELETE /api/certifications/{id}` |

## Padrão de resposta

Listagens retornam listas ordenadas pelo backend (normalmente `sort_order`):

```ts
type ApiList<T> = {
  message: string
  data: T[]
}
```

## Campos por recurso

### Experiência

```ts
type ExperiencePayload = {
  company: string
  role: string
  description?: string | null
  location?: string | null
  start_date?: string | null // YYYY-MM-DD
  end_date?: string | null
  is_current?: boolean
  sort_order?: number
}
```

Obrigatórios no `POST`: `company`, `role`.

### Educação

```ts
type EducationPayload = {
  institution: string
  degree?: string | null
  field_of_study?: string | null
  description?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current?: boolean
  sort_order?: number
}
```

Obrigatório no `POST`: `institution`.

### Skills

```ts
type SkillPayload = {
  name: string
  category?: string | null
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
  sort_order?: number
}
```

Obrigatório no `POST`: `name`.

### Projetos

```ts
type ProjectPayload = {
  name: string
  description?: string | null
  project_url?: string | null
  repository_url?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current?: boolean
  sort_order?: number
}
```

Obrigatório no `POST`: `name`.

### Certificações

```ts
type CertificationPayload = {
  name: string
  issuer?: string | null
  credential_url?: string | null
  issued_at?: string | null
  expires_at?: string | null
  sort_order?: number
}
```

Obrigatório no `POST`: `name`.

## Estrutura frontend

```
src/modules/content-blocks/
  pages/
    ContentBlocksPage.vue
  components/
    ExperienceForm.vue
    EducationForm.vue
    SkillForm.vue
    ProjectForm.vue
    CertificationForm.vue
    SortableBlockList.vue
  services/
    experiencesApi.ts
    educationsApi.ts
    skillsApi.ts
    projectsApi.ts
    certificationsApi.ts
  composables/
    useCrudList.ts
    useSortableBlocks.ts
  types/
    contentBlocks.types.ts
```

## Service genérico recomendado

```ts
export function createCrudApi<TPayload, TEntity>(basePath: string) {
  return {
    async list() {
      const { data } = await http.get<ApiEnvelope<TEntity[]>>(basePath)
      return data.data ?? []
    },
    async create(payload: TPayload) {
      const { data } = await http.post<ApiEnvelope<TEntity>>(basePath, payload)
      return data.data
    },
    async update(id: number, payload: Partial<TPayload>) {
      const { data } = await http.patch<ApiEnvelope<TEntity>>(`${basePath}/${id}`, payload)
      return data.data
    },
    async remove(id: number) {
      await http.delete(`${basePath}/${id}`)
    },
  }
}
```

Use com cuidado: o service genérico reduz repetição, mas cada recurso ainda deve ter **types próprios**.

## UX e integração

- Listar blocos por separadores: Experiências, Educação, Skills, Projetos, Certificações.
- `sort_order` deve ser atualizado ao reordenar localmente; se não houver endpoint específico de reorder, enviar `PATCH` por item alterado.
- Ao marcar `is_current = true`, limpar `end_date` no frontend para evitar inconsistência visual.
- Estes dados alimentam `GET /api/resumes/{publicId}/sections/suggestions`, então incentivar preenchimento completo.

## Evitar over-fetching

- Dashboard deve carregar apenas contadores/resumos se a API evoluir para isso.
- Editor de CV só deve carregar blocos profissionais se o utilizador abrir sugestões/autocomplete.

