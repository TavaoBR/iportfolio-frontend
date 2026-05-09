# iPortfolio — aplicação web (SPA)

Cliente **Vue 3 + TypeScript + Vite**, com **Tailwind CSS v4**, **Flowbite / flowbite-vue**, **Vue Router**, **Pinia** e **Axios**.

A **especificação canónica** do projeto está em **`../docs/`** ([índice](../docs/INDICE.md)). O código em `web/` implementa essa documentação; `../contexto/frontend/` é resumo para IA e revisão rápida. Em caso de dúvida, prevalece **`docs/`**.

## Requisitos

- Node.js **20+** (LTS recomendado)
- npm, pnpm ou yarn

## Arranque

```bash
cd web
npm install
npm run dev
```

Abrir o URL indicado no terminal (por defeito `http://localhost:5173`).

## Variáveis de ambiente

- `.env.development` — exemplo com `VITE_API_BASE_URL` e `VITE_AUTH_TOKEN_HEADER`.
- Copiar `.env.example` para `.env.production` no deploy.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | `vue-tsc` + bundle de produção |
| `npm run preview` | Servir a pasta `dist/` |

## Rotas principais

| Rota | Layout | Descrição |
|------|--------|-----------|
| `/` | — | Redireciona: sessão → `/app`, sem sessão → `/login` |
| `/templates` | `PublicShellLayout` | Catálogo público (`GET /api/templates`) |
| `/login` | Auth | Login |
| `/registar` | Auth | Criar conta (`POST /api/users`) |
| `/p/:slug` | — | Portfólio público (`GET /api/public/portfolio/{slug}`) |
| `/app` … | App shell (sidebar) | Área autenticada: painel, blocos, CVs, templates, portfólio, perfil |

Lista de **endpoints** implementados em serviços: [ENDPOINTS.md](./ENDPOINTS.md).

## Estrutura (`src/`)

- `layouts/` — `PublicShellLayout` (só cabeçalho em rotas públicas), `AppShellLayout`, `AuthLayout`
- `pages/` — catálogo público de templates, painel
- `modules/*/` — `auth`, `profile`, `content-blocks`, `resume`, `templates`, `billing`, `portfolio`, `resume-ai`
- `router/` — rotas, `meta.requiresAuth` / `public`
- `services/api/http.ts` — infraestrutura Axios compartilhada
- `modules/*/services/*Api.ts` — services por módulo, conforme `../docs/modulos/README.md`
- `composables/` — `useAsyncData`
- `types/` — envelope/erro API globais; tipos de domínio ficam em `modules/*/types/`

## Login e API

O formulário de login chama `POST /api/auth/login` conforme o contrato esperado de `iportfolio-api`.

Ajuste `src/modules/auth/services/authApi.ts` se o envelope JSON do backend for diferente (`data.token`, etc.).
