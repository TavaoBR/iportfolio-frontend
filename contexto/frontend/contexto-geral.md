# Contexto geral do frontend — iPortfolio

## Papel no ecossistema

O frontend é a **camada de experiência** da plataforma **iPortfolio**: gestão de perfil profissional, construção de currículos com secções editáveis, escolha de templates (gratuitos ou premium), pagamentos via **Mercado Pago**, publicação de portfólios e visualização/exportação (ex.: PDF).

A **fonte de verdade** dos dados é a API REST **`iportfolio-api`**. A **especificação** do frontend está em **`docs/`**; este ficheiro e `contexto/frontend/` resumem para implementação. O código da SPA vive em **`web/`** e deve seguir `docs/` (e atualizar-se quando a documentação mudar).

## Stack acordada

| Camada | Tecnologia |
|--------|------------|
| Framework | Vue 3 (Composition API, `<script setup lang="ts">`) |
| Tipo de aplicação | SPA |
| Linguagem | TypeScript (strict recomendado) |
| Estilo | Tailwind CSS |
| Componentes base | Flowbite (Vue) |
| Roteamento | Vue Router |
| Estado global | Pinia |
| HTTP | Axios |

## Autenticação e integração

- Token opaco enviado em header configurável (ex.: `X-Token-CV`), via variável `VITE_AUTH_TOKEN_HEADER`.
- Base URL da API: `VITE_API_BASE_URL` (prefixo `VITE_` obrigatório no Vite).

## Domínios funcionais (visão utilizador)

1. **Onboarding / conta** — registo, login, sessão.
2. **Dados mestres** — perfil, experiências, formação, skills, projetos, certificações.
3. **Currículos** — lista, criação, editor de secções, sugestões (`/sections/suggestions`), PDF.
4. **Templates** — catálogo, lista autenticada com `can_use`, checkout Mercado Pago, desbloqueio.
5. **Portfólio** — sites, secções, publicação, preview público.
6. **Roadmap** — análises IA, notificações, preferências (quando existirem).

Cada domínio mapeia naturalmente para um **módulo** em `src/modules/` (ver `arquitetura-spa-modulos-e-pastas.md`).

## Fluxos críticos com a API

### Autenticação

1. `POST /api/auth/login` → persistir token (memória + `sessionStorage` ou evolução com cookie/BFF).
2. Interceptor Axios anexa o token em pedidos autenticados.

### Templates premium

1. `GET /api/templates` — previews para visitante.
2. `GET /api/me/templates` — `can_use`, `bundle_ref`.
3. Resposta **402** ao aplicar/guardar template sem direito → fluxo “desbloquear”: checkout → redirect Mercado Pago → backend processa webhook; frontend faz **poll** ou **re-fetch** de `/api/me/templates`.

### Erros HTTP (visão produto)

- **401** — limpar sessão, redirecionar para login.
- **402** — UX específica de pagamento / desbloqueio.
- **422** — validação; mensagens por campo na UI.

## Porque SPA

- Transições fluidas entre dashboard, editor e checkout.
- Um deploy de assets estáticos.
- Implicações: bom **code splitting**, lazy routes, e decisão explícita futura sobre **SEO** para marketing ou portfólio público (ver `performance-a11y-seo-responsivo.md`).

## Princípios de implementação (não negociáveis)

- **Páginas finas** — orquestram; lógica em composables, services e stores.
- **Tipagem** — contratos da API em `src/types/` (ou gerados OpenAPI no futuro).
- **Acessibilidade e i18n** — consideradas desde o início (ver documentos dedicados).

## Referências cruzadas

- Arquitetura: `arquitetura-spa-modulos-e-pastas.md`
- API e erros: `api-pinia-estado-e-fetch.md`, `formularios-loading-erros.md`
- Documentação detalhada: `docs/02-contexto-geral-frontend.md`
