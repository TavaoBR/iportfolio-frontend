# 07 — Vue Router e navegação

Configuração de **rotas**, **lazy loading**, **guards** e **meta** para o SPA iPortfolio.

## Estrutura de rotas sugerida

```ts
// Conceito: router/index.ts
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
      // ...
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

- **Sempre** usar `() => import(...)` para páginas de feature — reduz bundle inicial.
- Agrupar chunks com comentário Vite se necessário: `import(/* webpackChunkName: "resume" */ '...')` (sintaxe pode variar).

## Navigation guards

Fluxo típico:

1. **`beforeEach` global** — se rota `requiresAuth` e não há token → `redirect('/login')`.
2. Rotas **públicas** (`meta.public`) — não exigem token.
3. **Títulos** — `document.title` a partir de `meta.title` ou i18n futuro.

Tratar **402** não no router mas nos **services/composables** ao guardar recurso (mostrar modal checkout).

## Histórico e parâmetros

- Usar `params` para `publicId` estáveis (UUID).
- Query string para filtros opcionais (`?tab=sections`).

## Deep linking

O utilizador deve poder **refrescar** `/resumes/:publicId` sem perder contexto: página re-fetcha dados na montagem.

## Referência

- [Vue Router](https://router.vuejs.org/)
