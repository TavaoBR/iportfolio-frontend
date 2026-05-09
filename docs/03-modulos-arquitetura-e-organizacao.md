# 03 — Módulos, arquitetura e organização de pastas

Define **padrões de arquitetura** para o SPA Vue 3: responsabilidades por camada, organização modular e práticas para manter o código **escalável**.

## Visão em camadas

```
┌─────────────────────────────────────────┐
  pages (rotas) — composição, pouca lógica
┌─────────────────────────────────────────┐
  layouts + components/domain + components/ui
┌─────────────────────────────────────────┐
  composables — estado local, side effects leves
┌─────────────────────────────────────────┐
  Pinia stores — estado global, cache de servidor
┌─────────────────────────────────────────┐
  services — HTTP, mapeamento DTO, sem DOM
└─────────────────────────────────────────┘
```

**Regra:** quanto mais **embaixo**, menos conhecimento de Vue template; quanto mais **em cima**, mais apresentação.

## Organização modular (feature-based)

Cada **módulo** agrupa o que muda junto quando uma feature evolui:

```
src/modules/resume/
  pages/
  components/
  composables/
  services/
  stores/              # opcional: store namespaced resume*
  types/
```

**Vantagens:** imports localizados, menos ficheiros “genéricos” gigantes na raiz.

**Módulos sugeridos para iPortfolio:** `auth`, `profile`, `content-blocks` (experiences, education…), `resume`, `portfolio`, `templates`, `billing` (checkout MP).

### O que permanece global

- `components/ui/` — botões, inputs, modais base (Flowbite wrappers).
- `router/` — definição central ou split por módulo com `mergeRouteModules`.
- `services/api/http.ts` — instância Axios (ver **08**).

## Páginas (`pages/`)

- Uma página ≈ uma **rota**.
- Responsabilidades: buscar IDs da rota, invocar composables/stores, posicionar layout.
- **Proibido:** centenas de linhas de lógica ou markup repetitivo sem extrair componentes.

## Componentes

| Pasta | Conteúdo |
|-------|----------|
| `components/ui/` | Design system leve: `AppButton`, `AppModal`, `AppFormField` |
| `components/domain/` | Conceitos de negócio: `TemplateCard`, `ResumeSectionEditor` |
| `modules/*/components/` | Específicos da feature, não reutilizáveis noutro módulo |

**Tamanho alvo:** preferir componentes &lt; ~200 linhas; acima disso, dividir por subcomponente ou extrair composable.

## Composables (`useX`)

Uso ideal:

- Encapsular **lógica reativa** partilhada (formulários, listeners de teclado, sincronização com query params).
- **Não** centralizar todas as chamadas API num único `useApiGod`; preferir `useResumeSections(resumePublicId)` pequeno.

Convenção de nome: prefixo **`use`**, ficheiro `useResumeEditor.ts`.

## Services

- Funções **puras** ou **async** sem `ref`/`computed`.
- `services/api/resumes.ts` exporta `fetchResume`, `updateResume`, etc., usando o cliente Axios.
- Mappers: `mapResumeDtoToModel` se o modelo de UI diferir do JSON da API.

## Pinia (resumo; detalhe em **06**)

- **Auth store:** utilizador, token, login/logout.
- **Catálogo store:** lista de templates com TTL curto ou invalidação pós-checkout.
- Evitar **duplicar** a mesma lista em três stores; uma fonte por domínio.

## Over-fetching

**Problema:** pedir “objeto completo” quando só precisamos de dois campos em listas.

**Estratégias:**

1. Usar endpoints que já são **lista leve** (`GET /api/resumes` vs show com secções, se a API diferenciar).
2. Em listas, **não** anexar sub-recursos até abrir detalhe (lazy load ao mudar de rota).
3. Cache em Pinia com chave `entity:id` e **não** refetch se dados ainda válidos (staleTime mental ou timestamp).
4. Se a API não oferecer projeção: documentar pedido de **query params** `?fields=` no backend antes de hacks enormes no frontend.

## Componentes “gigantes” — como evitar

1. Extrair **slots** ou subcomponentes por secção do formulário.
2. Mover tabelas de configuração (colunas, labels) para **constantes** ou `sectionSchema` vindo da API (`section_schema` do template).
3. Usar **composables** para “salvar”, “validar”, “reordenar”.
4. Code review: PRs que adicionam &gt;150 linhas num único `.vue` devem justificar ou dividir.

## Separação páginas / componentes / composables / services

| Camada | Pergunta-chave |
|--------|----------------|
| Página | “O que esta rota precisa mostrar?” |
| Componente | “Que pedaço de UI é reutilizável ou testável isoladamente?” |
| Composable | “Que estado/comportamento se repete entre páginas?” |
| Service | “Como falo com o mundo exterior sem saber quem me chama?” |

## Testes (recomendação)

- **Vitest** + **Vue Test Utils** para componentes e composables críticos.
- Contratos: mockar Axios em services ou usar MSW.

## Referência cruzada

- Rotas: **07**
- HTTP: **08**
- Estado: **06**
- UI base: **04**, **09**
