# Módulo — Currículos e secções

Módulo central do produto: lista e edição de currículos, secções customizáveis, sugestões automáticas e exportação PDF.

## Endpoints — currículos

Todos exigem autenticação.

| Método | Endpoint | Uso |
|--------|----------|-----|
| `GET` | `/api/resumes` | Listar currículos do utilizador |
| `POST` | `/api/resumes` | Criar currículo |
| `GET` | `/api/resumes/{publicId}` | Ver currículo |
| `PUT/PATCH` | `/api/resumes/{publicId}` | Atualizar metadados/template |
| `DELETE` | `/api/resumes/{publicId}` | Remover currículo |
| `GET` | `/api/resumes/{publicId}/pdf` | Baixar/abrir PDF |

## Campos — currículo

### Criar

```ts
type CreateResumePayload = {
  title: string
  target_role?: string | null
  language?: 'pt_BR' | 'en_US' | 'es_ES'
  is_main?: boolean
  template_key?: string | null
}
```

### Atualizar

```ts
type UpdateResumePayload = Partial<CreateResumePayload> & {
  is_public?: boolean
}
```

Resposta:

```ts
type Resume = {
  id: number
  public_id: string
  title: string
  target_role: string | null
  language: 'pt_BR' | 'en_US' | 'es_ES'
  template_key: string | null
  ats_score: number | null
  is_main: boolean
  is_public: boolean
  created_at: string
  updated_at: string | null
}
```

## Regra premium

Se `template_key` for premium e não estiver desbloqueado, a API pode responder **402 Payment Required** ao criar/atualizar currículo.

UX esperada:

1. interceptar `402`;
2. abrir modal “Desbloquear template”;
3. chamar `POST /api/me/payments/mercadopago/template-checkout`;
4. após pagamento, refazer `GET /api/me/templates` e tentar aplicar template novamente.

## Endpoints — secções

| Método | Endpoint | Uso |
|--------|----------|-----|
| `GET` | `/api/resumes/{publicId}/sections` | Listar secções |
| `POST` | `/api/resumes/{publicId}/sections` | Criar secção |
| `PUT/PATCH` | `/api/resumes/{publicId}/sections/{sectionId}` | Atualizar secção |
| `DELETE` | `/api/resumes/{publicId}/sections/{sectionId}` | Remover |
| `POST` | `/api/resumes/{publicId}/sections/reorder` | Reordenar |
| `GET` | `/api/resumes/{publicId}/sections/suggestions` | Sugestões por tipo |

## Campos — secção

```ts
type ResumeSectionType =
  | 'personal_info'
  | 'professional_summary'
  | 'experiences'
  | 'educations'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'projects'
  | 'links'
  | 'custom'

type ResumeSectionPayload = {
  section_type: ResumeSectionType
  title?: string | null
  content?: string | null
  position?: number
  is_visible?: boolean
}
```

Reorder:

```ts
type ReorderResumeSectionsPayload = {
  ordered_ids: number[]
}
```

Resposta de sugestão:

```ts
type ResumeSectionSuggestions = {
  by_section_type: Record<ResumeSectionType, string>
}
```

## Estrutura frontend

```
src/modules/resume/
  pages/
    ResumeListPage.vue
    ResumeEditorPage.vue
  components/
    ResumeMetaForm.vue
    ResumeSectionEditor.vue
    ResumePreviewPane.vue
    ResumeSectionList.vue
    TemplateApplyBanner.vue
  composables/
    useResume.ts
    useResumeSections.ts
    useResumeSuggestions.ts
    useResumePdf.ts
  services/
    resumesApi.ts
    resumeSectionsApi.ts
  stores/
    useResumeDraftStore.ts       # opcional
  types/
    resume.types.ts
```

## Integração de editor

- Carregar `Resume` + `sections` em paralelo quando possível.
- Guardar metadados do currículo separado do conteúdo das secções.
- Reordenar localmente com drag and drop, enviar `ordered_ids` no fim da operação.
- Usar `section_schema` do template como guia de UI, mas persistência vem das secções reais.

## PDF

`GET /api/resumes/{publicId}/pdf` deve ser tratado como blob:

```ts
const response = await http.get(`/api/resumes/${publicId}/pdf`, {
  responseType: 'blob',
})
```

Abrir em nova aba ou fazer download com nome amigável (`curriculo-${title}.pdf`).

