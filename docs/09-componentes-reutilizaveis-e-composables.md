# 09 — Componentes reutilizáveis e composables

Padrões para **componentização** e **lógica partilhada** sem inflar ficheiros `.vue`.

## Hierarquia de componentes

1. **`components/ui/`** — primitivos de interface (botão, input, modal) com API mínima e estável.
2. **`components/domain/`** — blocos de negócio reutilizáveis entre módulos (`TemplatePicker`, `SectionBlockEditor`).
3. **`modules/*/components/`** — específicos da feature.

## Props e eventos

- Props: preferir **tipos explícitos** e valores por defeito sensatos.
- Eventos: usar `defineEmits` tipado; nomes verbos (`submit`, `update:modelValue`).
- Para formulários grandes, considerar **`v-model` customizado** ou objeto `form` com validação (VeeValidate opcional).

## Composables como extensão do componente

Exemplos de composables no iPortfolio:

| Composable | Função |
|------------|--------|
| `useAuth` | Wrapper à store + helpers `requireAuth` |
| `useResumeSections` | CRUD de secções, reorder, loading |
| `useTemplateCheckout` | Chamar API checkout, redirecionar MP |
| `useToast` | Notificações (Flowbite toast ou custom) |

**Limite:** se um composable ultrapassa ~150 linhas, dividir (ex.: `useResumeSections` + `useResumeSectionReorder`).

## Slots e composição

- Preferir **slots nomeados** para layouts flexíveis (`#header`, `#actions`) em vez de dezenas de props booleanas.

## Storybook (opcional)

- Documentar `components/ui` isoladamente; acelera revisão de design.

## Testes

- Componentes críticos: teste de render + interação (Vitest + Testing Library).
- Composables: teste unitário puro sem montar Vue quando possível.

## Anti-padrões

- Copiar markup de 200 linhas entre duas páginas — extrair componente.
- Lógica Axios dentro de `setup` sem passar por `services/` — mover para service.
- `watch` em cadeia sem debounce em campos de pesquisa — usar `watchDebounced` (VueUse) ou equivalente.
