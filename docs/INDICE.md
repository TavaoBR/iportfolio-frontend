# Índice da documentação — Frontend iPortfolio

Documentação oficial, organizada por **etapas** e **contexto**. Leitura sugerida na ordem numérica dos primeiros capítulos; os restantes podem ser consultados por tópico.

**Implementação da SPA:** código em [`../web/`](../web/README.md) — deve obedecer a estes `docs/` e a [`../contexto/frontend/`](../contexto/frontend/INDICE.md).

## Fundação

| Doc | Tema |
|-----|------|
| [01 — Inicialização e configuração](01-inicializacao-e-configuracao.md) | Vite, Vue 3, TypeScript, Tailwind, Flowbite, variáveis de ambiente, qualidade de código |
| [02 — Contexto geral do frontend](02-contexto-geral-frontend.md) | Produto, SPA, relação com a API, fluxos principais |

## Arquitetura e módulos

| Doc | Tema |
|-----|------|
| [03 — Módulos, camadas e organização](03-modulos-arquitetura-e-organizacao.md) | Pastas, responsabilidades, anti–over-fetching, componentes grandes, páginas vs composables vs services |
| [06 — Pinia — gestão de estado](06-pinia-gestao-de-estado.md) | Stores, padrões, sincronização com API |
| [07 — Vue Router e navegação](07-vue-router-e-navegacao.md) | Rotas, guards, lazy loading, meta |
| [08 — Axios e comunicação com a API](08-axios-e-comunicacao-com-api.md) | Cliente HTTP, interceptors, tipos, erros |

## UI e design

| Doc | Tema |
|-----|------|
| [04 — Design system e identidade visual](04-design-system-e-identidade-visual.md) | Tailwind, Flowbite, tokens, acessibilidade base |
| [09 — Componentes reutilizáveis e composables](09-componentes-reutilizaveis-e-composables.md) | Biblioteca interna, padrões de composição |
| [05 — Templates de CV — estrutura](05-templates-cv-estrutura-e-organizacao.md) | Pasta `templates-cv`, mapeamento `template_key`, personalização |
| [10 — Responsividade, acessibilidade e performance](10-responsividade-acessibilidade-e-performance.md) | Mobile-first, WCAG, Core Web Vitals, bundle |

## Qualidade e evolução

| Doc | Tema |
|-----|------|
| [11 — Convenções de código e padronização](11-convencoes-de-codigo-e-padronizacao.md) | ESLint, Prettier, naming, Git |
| [12 — i18n, assets e versionamento](12-i18n-assets-e-versionamento.md) | Internacionalização futura, organização de ficheiros, escala e releases |

## Mapa rápido por pergunta

- *Como arranco o projeto?* → **01**
- *O que é o frontend no ecossistema iPortfolio?* → **02**
- *Onde meto lógica de negócio vs UI?* → **03**, **09**
- *Como defino cores e componentes base?* → **04**
- *Onde ficam os mocks visuais dos CV?* → **05**, pasta `templates-cv/`
- *Estado global e cache?* → **06**
- *Rotas protegidas e títulos?* → **07**
- *Chamadas à API e 401/402?* → **08**
- *Mobile e performance?* → **10**
- *Estilo de código e releases?* → **11**, **12**
