# 02 — Contexto geral do projeto frontend

## Papel do frontend no iPortfolio

O frontend é a **camada de experiência** da plataforma iPortfolio: permite ao utilizador **gerir o perfil profissional**, **construir currículos** com secções editáveis, **escolher templates** (gratuitos ou premium), **pagar desbloqueios** via Mercado Pago, **publicar portfólios** e **visualizar/exportar** o resultado.

A **fonte de verdade dos dados** é a API REST (`iportfolio-api`). O SPA:

- Autentica com token opaco (header configurável, ex. `X-Token-CV`).
- Consome recursos versionados (currículos por `publicId`, templates por `template_key`, etc.).
- Trata estados de UI: loading, erros, **402 Payment Required** para templates premium sem desbloqueio.

## Porque SPA (Single Page Application)

| Vantagem | Implicação |
|----------|------------|
| UX fluida entre dashboard, editor e checkout | Estado em memória (Pinia); refresh recupera via API |
| Um único deploy de assets estáticos | SEO das **páginas de marketing** pode exigir outro site ou prerender se necessário |
| Alinhamento com equipas Vue/TS modernas | Necessário bom code splitting e lazy routes |

**Portfólio público** (`GET /api/public/portfolio/{slug}`) pode ser renderizado na mesma SPA (rota pública) ou, numa fase futura, um micro-site otimizado para SEO — a decisão documenta-se aqui quando existir.

## Domínios funcionais (vistas do utilizador)

1. **Onboarding / conta** — registo, login, sessão.
2. **Dados mestres** — perfil, experiências, formação, skills, projetos, certificações.
3. **Currículos** — lista, criação, editor de secções, sugestões (`/sections/suggestions`), PDF.
4. **Templates** — catálogo público, lista autenticada com `can_use`, checkout Mercado Pago, desbloqueio.
5. **Portfólio** — sites, secções, publicação, preview público.
6. **Opcional / roadmap** — análises IA do CV, notificações, preferências.

Cada domínio pode mapear para um **módulo** em `src/modules/` (ver **03**) para limitar acoplamento.

## Fluxos críticos integrados com a API

### Autenticação

1. **Registo** — `POST /api/users` (ver `docs/modulos/02-usuario-e-perfil.md`): criar utilizador; a SPA em `web/` usa `/registar` e envia nome, email e palavra-passe conforme o contrato real.
2. `POST /api/auth/login` → guardar token (memória + `sessionStorage` ou fluxo com cookie se houver BFF).
3. Anexar header em todos os pedidos autenticados.

### Templates premium

1. `GET /api/templates` — previews para visitante.
2. `GET /api/me/templates` — estado de desbloqueio e `bundle_ref` quando `can_use`.
3. Se **402** ao guardar `template_key` no CV → fluxo “desbloquear”: `POST .../template-checkout` → redirect Mercado Pago → após pagamento, webhook no backend; frontend faz **poll** ou **re-fetch** de `/api/me/templates`.

### Erros

- **401** — limpar sessão, redirecionar login.
- **422** — validação; mostrar mensagens por campo.
- **402** — UX específica de pagamento.

## Princípios de implementação

- **Thin pages**: páginas só orquestram; lógica em composables/services/stores.
- **Tipagem**: tipos para payloads da API em `src/types/` ou gerados futuramente a partir de OpenAPI.
- **Acessibilidade e i18n**: consideradas desde o início (ver **10** e **12**).

## O que este repositório cobre

Este repositório (**iportfolio-frontend**) inclui:

- **`docs/`** — documentação oficial (contrato de produto, arquitetura, API, UI, qualidade).
- **`web/`** — implementação da SPA (Vue 3, Vite, Tailwind, Flowbite, Pinia, Router, Axios) alinhada a estes documentos.
- **`templates-cv/`**, **`template-plataforma/`**, **`contexto/frontend/`** — referências visuais e contexto permanente para equipas e IA.

A **especificação normativa** para implementação é **`docs/`** (e `contexto/frontend/` como resumo operacional). O código em `web/` deve refletir alterações feitas na documentação.
