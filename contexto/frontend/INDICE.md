# Índice — Contexto permanente do frontend (iPortfolio)

Esta pasta consolida o **contrato de implementação** do frontend da plataforma iPortfolio para uso por humanos e por IA em futuras tarefas. Está alinhada a `docs/`, `README.md`, `templates-cv/` e `template-plataforma/`.

## Ordem sugerida de leitura

| Ficheiro | Conteúdo |
|----------|----------|
| [contexto-geral.md](contexto-geral.md) | Produto, SPA, relação com `iportfolio-api`, fluxos críticos |
| [arquitetura-spa-modulos-e-pastas.md](arquitetura-spa-modulos-e-pastas.md) | Camadas, módulos feature-based, separação de responsabilidades |
| [design-system-ui-ux-e-referencias-visuais.md](design-system-ui-ux-e-referencias-visuais.md) | Tokens, Flowbite, identidade, referências em `template-plataforma/` e `templates-cv/` |
| [componentes-composicao-e-layouts.md](componentes-composicao-e-layouts.md) | UI vs domain, composables, reutilização de layouts |
| [paginas-rotas-e-navegacao.md](paginas-rotas-e-navegacao.md) | Estrutura SPA, lazy loading, guards, meta |
| [convencoes-typescript-vue.md](convencoes-typescript-vue.md) | Nomenclatura, ESLint/Prettier, Git, segurança no código |
| [api-pinia-estado-e-fetch.md](api-pinia-estado-e-fetch.md) | Axios, serviços, Pinia, anti–over-fetch, anti–memory leak |
| [formularios-loading-erros.md](formularios-loading-erros.md) | Formulários, 401/402/422, estados de UI |
| [performance-a11y-seo-responsivo.md](performance-a11y-seo-responsivo.md) | Mobile-first, WCAG, Core Web Vitals, SEO quando aplicável |
| [templates-cv-renderer-e-assets.md](templates-cv-renderer-e-assets.md) | `template_key`, registo de renders, pasta `templates-cv/`, ATS |
| [organizacao-assets-e-i18n.md](organizacao-assets-e-i18n.md) | `src/assets/`, `public/`, ícones, i18n, versionamento |
| [boas-praticas-stack.md](boas-praticas-stack.md) | Checklist Vue + TS + Tailwind + Flowbite |

## Mapa rápido (perguntas frequentes)

- *Onde coloco lógica nova?* → `arquitetura-spa-modulos-e-pastas.md`
- *Como deve parecer a UI?* → `design-system-ui-ux-e-referencias-visuais.md` + ficheiros em `template-plataforma/`
- *Como chamar a API sem duplicar estado?* → `api-pinia-estado-e-fetch.md`
- *Rotas públicas vs autenticadas?* → `paginas-rotas-e-navegacao.md`
- *Novo template de CV?* → `templates-cv-renderer-e-assets.md`
- *Onde colocar imagens e traduções?* → `organizacao-assets-e-i18n.md`
- *Revisão rápida da stack?* → `boas-praticas-stack.md`

## Fonte canónica

Detalhes técnicos extensos continuam em `docs/` (numerados 01–12). Os ficheiros aqui **sintetizam e orientam** implementação e revisão de código para manter um único “cérebro” de contexto para IA.
