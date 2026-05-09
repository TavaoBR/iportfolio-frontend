# Arquitetura SPA, módulos e organização de pastas

## Visão em camadas

Do topo (UI) à base (infraestrutura):

```
┌─────────────────────────────────────────┐
  pages (rotas) — composição, pouca lógica
┌─────────────────────────────────────────┐
  layouts + components/domain + components/ui
┌─────────────────────────────────────────┐
  composables — estado local, efeitos leves
┌─────────────────────────────────────────┐
  Pinia — estado global, cache de servidor
┌─────────────────────────────────────────┐
  services — HTTP, mapeamento DTO, sem DOM
└─────────────────────────────────────────┘
```

**Regra:** quanto mais **embaixo**, menos conhecimento de template Vue; quanto mais **em cima**, mais apresentação.

## Estrutura de pastas recomendada (`src/`)

```
src/
  app/                 # bootstrap: createApp, plugins, App.vue
  assets/              # estáticos processados pelo bundler
  components/
    ui/                # primitivos + wrappers Flowbite (AppButton, AppCard, …)
    domain/            # blocos de negócio reutilizáveis (TemplateCard, ResumeSectionEditor)
  composables/         # useX — sem “lógica de página inteira” acumulada
  layouts/             # DefaultLayout, AuthLayout — shells reutilizáveis
  modules/             # features autocontidas
    auth/
    profile/
    resume/
    portfolio/
    templates/
    billing/           # checkout Mercado Pago, se separado
  pages/               # vistas muito genéricas ou agregadoras (thin)
  router/
  services/
    api/               # http.ts, auth.ts, resumes.ts, …
  stores/              # Pinia (ou stores por módulo em modules/*/stores/)
  types/               # DTOs alinhados à API
  utils/
```

## Organização modular (feature-based)

Cada módulo agrupa o que evolui junto:

```
src/modules/resume/
  pages/
  components/
  composables/
  services/            # opcional se calls só usadas aqui
  stores/              # opcional: namespaced resume*
  types/
```

**Módulos sugeridos:** `auth`, `profile`, `content-blocks` (experiences, education, …), `resume`, `portfolio`, `templates`, `billing`.

### O que permanece global

- `components/ui/` — design system leve.
- `router/` — definição central ou merge de módulos (`mergeRouteModules` pattern se adotado).
- `services/api/http.ts` — instância Axios única.

## Páginas (`pages/` e `modules/*/pages/`)

- Uma página ≈ uma **rota** (ou sub-rota clara).
- Responsabilidades: ler `params`/`query`, invocar composables/stores, escolher layout.
- **Evitar:** centenas de linhas de lógica ou markup repetido sem extração.

## Componentes

| Pasta | Conteúdo |
|-------|----------|
| `components/ui/` | Primitivos estáveis: botão, campo, modal com API mínima |
| `components/domain/` | Conceitos de negócio partilhados entre módulos |
| `modules/*/components/` | Específicos da feature |

**Tamanho alvo:** preferir &lt; ~200 linhas por `.vue`; acima disso, subcomponente ou composable.

## Composables (`useX`)

- Lógica reativa partilhada (formulários, sincronização com query params).
- **Não** criar um único `useApiGod`; preferir `useResumeSections(publicId)` focado.
- Nome: `useResumeEditor.ts`, export `useResumeEditor`.

## Services

- Funções async/puras **sem** `ref`/`computed`.
- Ex.: `services/api/resumes.ts` com `fetchResume`, `updateResume`.
- Mappers: `mapResumeDtoToModel` quando o modelo de UI diverge do JSON.

## Separação de responsabilidades (pergunta-chave)

| Camada | Pergunta |
|--------|----------|
| Página | O que esta rota precisa mostrar? |
| Componente | Que pedaço de UI é reutilizável ou testável isoladamente? |
| Composable | Que estado/comportamento se repete entre páginas? |
| Service | Como falo com o exterior sem saber quem me chama? |

## Reutilização de layouts

- **AuthLayout** — rotas públicas de entrada (login/registo), centrado, fundo e cartão conforme referências em `template-plataforma/login/`.
- **DefaultLayout** — app autenticada: sidebar ou top nav, área `max-w-7xl`, slots para ações.
- Páginas **não** duplicam a estrutura de shell; usam `<RouterView />` dentro do layout.

## SPA e modularização

- **Lazy loading** de páginas obrigatório (ver `paginas-rotas-e-navegacao.md`).
- Boundaries claros: módulo não importa páginas de outro módulo diretamente; preferir `components/domain` ou contratos em `types/`.

## Testes (recomendação)

- Vitest + Vue Test Utils; mocks de Axios nos services ou MSW.

## Referências

- `docs/03-modulos-arquitetura-e-organizacao.md`
- `docs/01-inicializacao-e-configuracao.md` (esqueleto inicial)
