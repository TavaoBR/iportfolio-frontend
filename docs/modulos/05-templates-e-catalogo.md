# Módulo — Templates e catálogo

Controla catálogo público/autenticado, estado de desbloqueio, aplicação de `template_key` em currículos/portfólios e manutenção admin.

## Endpoints

| Método | Endpoint | Auth | Uso |
|--------|----------|------|-----|
| `GET` | `/api/templates?type=resume|portfolio` | Público | Catálogo com preview |
| `GET` | `/api/me/templates?type=resume|portfolio` | Sim | Catálogo com `can_use`, `is_unlocked`, `bundle_ref` quando aplicável |
| `POST` | `/api/me/template-unlocks` | Sim | Desbloqueio manual/dev ou pós-referência |
| `POST` | `/api/admin/catalog/templates` | Sim + `ROLE_ADMIN` | Criar template |
| `PATCH` | `/api/admin/catalog/templates/{templateKey}` | Sim + `ROLE_ADMIN` | Atualizar template |

## Modelo de catálogo

```ts
type TemplateType = 'resume' | 'portfolio'

type TemplateCatalogItem = {
  id: number
  name: string
  template_key: string
  type: TemplateType
  preview_image: string | null
  preview_url: string | null
  is_premium: boolean
  premium_price: string | null
  section_schema: Record<string, unknown> | null
}

type UserTemplateCatalogItem = TemplateCatalogItem & {
  is_unlocked: boolean
  can_use: boolean
  bundle_ref?: string | null
}
```

## Campos — unlock

```ts
type UnlockPremiumTemplatePayload = {
  template_key: string
  payment_reference?: string | null
}
```

No fluxo normal de produção, o desbloqueio deve vir do **webhook Mercado Pago**. Este endpoint é útil para desenvolvimento, backoffice ou fluxos específicos.

## Campos — admin create/update

```ts
type CreateCatalogTemplatePayload = {
  name: string
  template_key: string
  type: 'resume' | 'portfolio'
  is_premium?: boolean
  preview_image?: string | null
  preview_url?: string | null
  bundle_ref?: string | null
  definition_json?: Record<string, unknown> | null
  premium_price?: string | null
}
```

No frontend público, **não** depender de `bundle_ref` se `can_use = false`.

## Estrutura frontend

```
src/modules/templates/
  pages/
    TemplatesPage.vue
    AdminTemplatesPage.vue
  components/
    TemplateCard.vue
    TemplatePreviewModal.vue
    PremiumTemplateBadge.vue
    TemplateCheckoutButton.vue
  services/
    templatesApi.ts
  stores/
    useTemplateCatalogStore.ts
  types/
    templates.types.ts
  registry.ts              # template_key -> render component
```

## Integração no editor

Fluxo para aplicar template:

1. Carregar `GET /api/me/templates?type=resume`.
2. Se `can_use = true`, permitir aplicar `template_key` no currículo.
3. Se `is_premium && !can_use`, abrir modal com preview + preço + botão checkout.
4. Após checkout/pagamento, refazer `GET /api/me/templates`.

## Service Axios

```ts
export async function listPublicTemplates(type?: TemplateType) {
  const { data } = await http.get('/api/templates', { params: { type } })
  return data.data as TemplateCatalogItem[]
}

export async function listMyTemplates(type?: TemplateType) {
  const { data } = await http.get('/api/me/templates', { params: { type } })
  return data.data as UserTemplateCatalogItem[]
}
```

## UX

- Card deve exibir `preview_image` ou `preview_url`.
- Premium: badge + preço (`premium_price`) + CTA.
- Depois do pagamento, mostrar estado “Aguardando confirmação” e oferecer refresh.
- `section_schema` deve orientar o editor, não substituir dados persistidos.

