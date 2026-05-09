# Contexto iPortfolio — Frontend

Repositório da plataforma **iPortfolio**: a **especificação oficial** está em [`docs/`](docs/INDICE.md); a **SPA** implementa essa documentação em [`web/`](web/README.md). Complementos: [`contexto/frontend/`](contexto/frontend/INDICE.md) (resumo para IA), `templates-cv/`, `template-plataforma/`.

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

## Aplicação (`web/`)

Código da SPA: **Vue 3 + Vite + TypeScript + Tailwind v4 + Flowbite (Vue) + Pinia + Vue Router + Axios**.

```bash
cd web
npm install
npm run dev
```

Detalhes: [web/README.md](web/README.md).

## Como navegar na documentação

Comece pelo **[Índice geral](docs/INDICE.md)**. Os ficheiros em `docs/` estão numerados por ordem sugerida de leitura.

Para **contexto consolidado** orientado a implementação e a assistentes (checklists, padrões únicos), use **[contexto/frontend/INDICE.md](contexto/frontend/INDICE.md)**.

## Pasta `templates-cv/`

Armazena **imagens, thumbnails e referências visuais** dos templates de CV/portfólio. Complementa o catálogo da API (`template_key`, `preview_url`). Ver [templates-cv/README.md](templates-cv/README.md) e [docs/05-templates-cv-estrutura-e-organizacao.md](docs/05-templates-cv-estrutura-e-organizacao.md).

## Backend

O frontend consome a REST API do repositório **iportfolio-api** (token, currículos, portfólio, templates, Mercado Pago). Contratos e variáveis em `docs/08-axios-e-comunicacao-com-api.md`.
