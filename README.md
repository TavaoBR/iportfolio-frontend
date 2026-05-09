# Contexto iPortfolio — Frontend

Repositório de **documentação oficial** do frontend da plataforma **iPortfolio**: decisões de produto, arquitetura, design system, integração com a API (`iportfolio-api`) e organização dos **templates de currículo** (referências visuais em `templates-cv/`).

## Stack documentada

| Camada | Tecnologia |
|--------|------------|
| Framework | **Vue 3** (Composition API) |
| Tipo de aplicação | **SPA** (Single Page Application) |
| Linguagem | **TypeScript** |
| Estilo | **Tailwind CSS** |
| Componentes UI | **Flowbite** (Vue) |
| Roteamento | **Vue Router** |
| Estado global | **Pinia** |
| HTTP | **Axios** |

## Como navegar na documentação

Comece pelo **[Índice geral](docs/INDICE.md)**. Os ficheiros em `docs/` estão numerados por ordem sugerida de leitura.

Para **contexto consolidado** orientado a implementação e a assistentes (checklists, padrões únicos), use **[contexto/frontend/INDICE.md](contexto/frontend/INDICE.md)**.

## Pasta `templates-cv/`

Armazena **imagens, thumbnails e referências visuais** dos templates de CV/portfólio. Complementa o catálogo da API (`template_key`, `preview_url`). Ver [templates-cv/README.md](templates-cv/README.md) e [docs/05-templates-cv-estrutura-e-organizacao.md](docs/05-templates-cv-estrutura-e-organizacao.md).

## Backend

O frontend consome a REST API do repositório **iportfolio-api** (token, currículos, portfólio, templates, Mercado Pago). Contratos e variáveis em `docs/08-axios-e-comunicacao-com-api.md`.
