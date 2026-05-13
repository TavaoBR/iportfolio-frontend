# iPortfolio — aplicação web (SPA)

Cliente **Vue 3** + **TypeScript** + **Vite**, com **Tailwind CSS v4** (via `@tailwindcss/vite`), **Flowbite** / **flowbite-vue**, **Vue Router**, **Pinia** e **Axios**. Alias de importação: `@/` → `src/`.

## Documentação e fonte de verdade

| Local | Conteúdo |
|-------|------------|
| [`../docs/`](../docs/) | Especificação canónica do produto e API ([índice](../docs/INDICE.md)). |
| `../contexto/frontend/` | Resumo curto para IA e revisão rápida. |
| **`web/`** | Implementação; em conflito prevalece **`docs/`**. |

## Requisitos

- **Node.js 20+** (LTS recomendado).
- **npm**, pnpm ou yarn (exemplos abaixo usam `npm`).

## Arranque rápido

```bash
cd web
npm install
npm run dev
```

Abrir o URL indicado no terminal (por defeito **`http://localhost:5173`**).

Para chamadas à API funcionarem, o backend (`iportfolio-api` ou equivalente) deve estar acessível no URL definido em **`VITE_API_BASE_URL`** (ver variáveis de ambiente). Sem API, páginas autenticadas e formulários podem falhar com erro de rede.

## Variáveis de ambiente (Vite)

Ficheiros na raiz de `web/`:

| Ficheiro | Uso |
|----------|-----|
| [`.env.example`](./.env.example) | Modelo com variáveis suportadas; copiar para `.env.development` ou `.env.production`. |
| `.env.development` | Valores locais (não versionar segredos). |
| `.env.production` | Deploy; criar a partir do exemplo e ajustar URLs. |

Variáveis `VITE_*` (expostas ao cliente):

| Variável | Descrição |
|----------|-----------|
| `VITE_API_BASE_URL` | URL base da API (ex.: `http://127.0.0.1:8000`), **sem** barra final obrigatória; o cliente Axios junta `/api/...` nos serviços. |
| `VITE_AUTH_TOKEN_HEADER` | Nome do cabeçalho HTTP onde o token de sessão é enviado (ex.: `X-Token-CV`). |

## Scripts npm

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor Vite com HMR. |
| `npm run build` | **`vue-tsc -b`** (verificação de tipos) + **`vite build`** (saída em `dist/`). |
| `npm run preview` | Servir a pasta `dist/` localmente (teste de bundle de produção). |

## Rotas e layouts

O router vive em [`src/router/index.ts`](./src/router/index.ts). Meta comuns:

- **`meta.public: true`** — rota acessível sem login.
- **`meta.requiresAuth: true`** — exige sessão; redireciona para `login` com `?redirect=` se necessário.
- **`meta.title`** — usado no `document.title` (`{título} · iPortfolio`).
- **`meta.resumeEditorShell`** — fluxo de editor de CV (cabeçalho de contexto / chrome específico).

### Rotas públicas

| Caminho | Nome (`name`) | Layout | Descrição |
|---------|---------------|--------|------------|
| `/` | `home` | `PublicShellLayout` | Landing com CTAs para criar CV ou ver templates. |
| `/templates` | `templates-public` | `PublicShellLayout` | Catálogo público de templates. Se o utilizador **já** estiver autenticado, o `beforeEach` redireciona para `templates-app` em `/app/templates`. |
| `/login` | `login` | `AuthLayout` | Login. |
| `/registar` | `register` | `AuthLayout` | Registo de conta. |
| `/p/:slug` | `public-portfolio` | — (página isolada) | Portfólio público por slug. |

### Área autenticada (`/app`)

Todas as rotas filhas usam **`AppShellLayout`** (sidebar + zona principal + barra de contexto quando registada).

| Caminho | Nome | Descrição |
|---------|------|------------|
| `/app` | `dashboard` | Painel / visão geral. |
| `/app/content-blocks` | `content-blocks` | Informações profissionais (blocos de conteúdo). |
| `/app/resumes` | `resumes` | Lista de currículos. |
| `/app/resumes/new/template` | `resume-pick-template` | Escolha de modelo antes de criar CV. |
| `/app/resumes/new` | `resume-new` | Construtor de **novo** currículo (wizard + preview). |
| `/app/resumes/:publicId` | `resume-edit` | Mesmo construtor para **editar** um CV existente. |
| `/app/templates` | `templates-app` | Templates e visual na área autenticada. |
| `/app/portfolio` | `portfolio` | Editor de portfólio. |
| `/app/profile` | `profile` | Dados pessoais / perfil. |

Lista de **endpoints** usados pelos serviços: [ENDPOINTS.md](./ENDPOINTS.md).

## Estrutura de `src/`

| Pasta / ficheiro | Função |
|------------------|--------|
| `layouts/` | `PublicShellLayout`, `AuthLayout`, `AppShellLayout`; `AppSidebar.vue`; `useAppShellChromeStore.ts` (título de contexto, ações Guardar/Cancelar no editor de CV). |
| `pages/` | Páginas de topo fora de módulos (`HomePage`, `DashboardPage`, `TemplatesCatalogPage`, …). |
| `modules/` | Domínio por pasta: `auth`, `billing`, `content-blocks`, `portfolio`, `profile`, `resume`, `resume-ai`, `templates`. Cada um pode ter `pages/`, `services/*Api.ts`, `stores/`, `types/`, `components/`. |
| `modules/resume/builder/` | UI do construtor: layout em duas colunas, stepper no rodapé, preview A4, renderização de secções, `resumeBuilderSteps.ts` (ordem fixa de etapas). |
| `modules/resume/templates/` | `ResumeTemplateRenderer`, `TemplateCarousel`, layouts partilhados, folhas de modelo Vue; `registry.ts` reexporta [`src/modelos/resume/`](./src/modelos/resume/). |
| `modelos/resume/` | Definições por modelo (config, sections, styles, `index.vue` por pasta). |
| `components/ui/` | `UiButton`, `UiInput`, cartões de layout (`AppCard`, …). |
| `components/form/` | `AppTextField`, `AppSelectField`, `AppTextarea`. |
| `router/` | Definição de rotas e [`meta.d.ts`](./src/router/meta.d.ts) para tipagem de `meta`. |
| `services/api/http.ts` | Cliente Axios partilhado (base URL, token, erros). |
| `composables/` | Ex.: `useAsyncData` para pedidos com estado de carregamento/erro. |
| `types/` | Tipos globais de API (`ApiError`, …); tipos de domínio ficam em `modules/*/types/`. |

## Autenticação e API

- O login usa o serviço em **`src/modules/auth/services/authApi.ts`** (ex.: `POST /api/auth/login` conforme contrato do `iportfolio-api`).
- Se o envelope JSON do backend mudar (`data.token`, chaves de utilizador, etc.), ajuste esse serviço e o store **`useAuthStore`** para manter o token e o estado de sessão coerentes com o `http.ts`.

## Convensões úteis

- **Estilos globais e tokens** de produto: `src/style.css` e CSS dos templates de CV quando aplicável.
- **Novas rotas autenticadas**: filho de `/app`, `meta.requiresAuth` herdado do pai, `meta.title` e opcionalmente `breadcrumb` / `resumeEditorShell`.
- **Build de produção**: correr `npm run build` antes de deploy; falhas de `vue-tsc` bloqueiam o bundle de propósito.
