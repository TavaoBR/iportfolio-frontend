# Estrutura de páginas, rotas e navegação (Vue Router)

## Padrão de páginas

- **Thin pages:** a página importa layout implícito via router, injeta dados via composables/stores e compõe `components/domain` + `components/ui`.
- **Deep linking:** refresh em ` /resumes/:publicId` deve rehidratar estado com **fetch na montagem** (não depender só de memória).

## Estrutura de rotas (conceito)

```ts
// Exemplo conceitual — localização típica: router/index.ts
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/auth/pages/LoginPage.vue'),
    meta: { public: true, layout: 'auth' },
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },
      { path: 'resumes/:publicId', name: 'resume-edit', component: () => import('@/modules/resume/pages/ResumeEditPage.vue') },
      { path: 'templates', name: 'templates', component: () => import('@/modules/templates/pages/TemplatesPage.vue') },
    ],
  },
  {
    path: '/p/:slug',
    name: 'public-portfolio',
    component: () => import('@/modules/portfolio/pages/PublicPortfolioPage.vue'),
    meta: { public: true },
  },
]
```

## Lazy loading

- **Sempre** `() => import(...)` para páginas de feature — reduz bundle inicial.
- Opcional: comentários de chunk Vite para agrupar features grandes.

## Navigation guards

1. **`beforeEach` global:** se `meta.requiresAuth` e sem token → `redirect('/login')`.
2. **Rotas públicas:** `meta.public: true` — não exigem token.
3. **Título:** `document.title` a partir de `meta.title` ou chave i18n futura.

**402** não é tratado no router de forma genérica: a UI de pagamento dispara a partir de **services/composables** ao guardar recurso ou aplicar template.

## Parâmetros e query

- `params` para identificadores estáveis (`publicId`, UUID).
- `query` para estado opcional (`?tab=sections`, filtros).

## Organização de rotas em escala

- Ficheiro central `router/index.ts` **ou** `router/modules/*.ts` importados e merged, por domínio (`auth.routes.ts`, `resume.routes.ts`).

## Referências

- `docs/07-vue-router-e-navegacao.md`
