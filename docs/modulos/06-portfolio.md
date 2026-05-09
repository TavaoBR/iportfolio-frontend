# Módulo — Portfólio

Permite criar sites públicos de portfólio, organizar secções e publicar por `slug`.

## Endpoints — site

| Método | Endpoint | Auth | Uso |
|--------|----------|------|-----|
| `GET` | `/api/portfolio-sites` | Sim | Listar sites |
| `POST` | `/api/portfolio-sites` | Sim | Criar site |
| `GET` | `/api/portfolio-sites/{id}` | Sim | Ver site + secções |
| `PUT/PATCH` | `/api/portfolio-sites/{id}` | Sim | Atualizar |
| `DELETE` | `/api/portfolio-sites/{id}` | Sim | Remover |
| `POST` | `/api/portfolio-sites/{id}/publish` | Sim | Publicar |
| `GET` | `/api/public/portfolio/{slug}` | Público | Render público |

## Campos — site

```ts
type CreatePortfolioSitePayload = {
  slug: string
  title: string
  subtitle?: string | null
  template_key?: string | null
}

type UpdatePortfolioSitePayload = Partial<CreatePortfolioSitePayload> & {
  is_public?: boolean
}
```

Validações:

- `slug`: obrigatório no create, minúsculas/números/hífens, máx. 120.
- `title`: obrigatório no create, máx. 180.
- `subtitle`: máx. 255.

Resposta:

```ts
type PortfolioSite = {
  id: number
  slug: string
  title: string
  subtitle: string | null
  template_key: string | null
  is_public: boolean
  created_at: string
  updated_at: string | null
}
```

## Endpoints — secções

| Método | Endpoint | Uso |
|--------|----------|-----|
| `GET` | `/api/portfolio-sites/{siteId}/sections` | Listar |
| `POST` | `/api/portfolio-sites/{siteId}/sections` | Criar |
| `PUT/PATCH` | `/api/portfolio-sites/{siteId}/sections/{sectionId}` | Atualizar |
| `DELETE` | `/api/portfolio-sites/{siteId}/sections/{sectionId}` | Remover |
| `POST` | `/api/portfolio-sites/{siteId}/sections/reorder` | Reordenar |

## Campos — secção

```ts
type PortfolioLayoutType =
  | 'grid'
  | 'list'
  | 'cards'
  | 'carousel'
  | 'timeline'
  | 'tags'
  | 'progress_bar'
  | 'simple'

type PortfolioSectionPayload = {
  section_type: string
  layout_type: PortfolioLayoutType
  position?: number
  is_visible?: boolean
  settings?: Record<string, unknown> | null
}
```

Reorder:

```ts
type ReorderPortfolioSectionsPayload = {
  ordered_ids: number[]
}
```

## Estrutura frontend

```
src/modules/portfolio/
  pages/
    PortfolioListPage.vue
    PortfolioEditorPage.vue
    PublicPortfolioPage.vue
  components/
    PortfolioSiteForm.vue
    PortfolioSectionEditor.vue
    PortfolioPreview.vue
    PublishStatusBadge.vue
  services/
    portfolioApi.ts
    portfolioSectionsApi.ts
  composables/
    usePortfolioSite.ts
    usePortfolioSections.ts
  types/
    portfolio.types.ts
```

## Integração pública

Rota sugerida na SPA:

```ts
{
  path: '/p/:slug',
  name: 'public-portfolio',
  component: () => import('@/modules/portfolio/pages/PublicPortfolioPage.vue'),
  meta: { public: true },
}
```

Essa rota consome `GET /api/public/portfolio/{slug}` e deve renderizar apenas dados públicos.

## Regras de UX

- Validar disponibilidade/conflito de `slug` após `409` da API.
- Mostrar link público só quando `is_public = true`.
- `template_key` premium segue a mesma regra de 402 do currículo.
- `settings` deve ser tipado por `layout_type` no frontend, mesmo sendo JSON flexível no backend.

