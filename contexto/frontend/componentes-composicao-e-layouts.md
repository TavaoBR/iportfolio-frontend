# Guia de componentes, composição e layouts

## Hierarquia de componentes

1. **`components/ui/`** — primitivos com API mínima e estável (botão, input, modal base).
2. **`components/domain/`** — blocos de negócio reutilizáveis entre módulos (`TemplatePicker`, `SectionBlockEditor`, `TemplateCard`).
3. **`modules/*/components/`** — específicos da feature, não pretendidos para reutilização global.

## Fluxo de dados (componentes)

- **Props** tipadas explicitamente; valores por defeito sensatos.
- **Emits** tipados com `defineEmits`; nomes verbais: `submit`, `update:modelValue`, `delete`.
- Formulários grandes: considerar `v-model` customizado ou objeto `form` + validação (VeeValidate opcional).

## Padrões de composição

- Preferir **slots nomeados** (`#header`, `#actions`, `#footer`) a dezenas de props booleanas.
- Listagens: componente de **item** + lista em página ou container que trata loading/empty.

## Composables como extensão do componente

| Composable | Responsabilidade típica |
|------------|-------------------------|
| `useAuth` | Store + helpers `requireAuth` |
| `useResumeSections` | CRUD, reorder, loading por `publicId` |
| `useTemplateCheckout` | API checkout + redirect Mercado Pago |
| `useToast` | Notificações globais |

**Limite:** ~150 linhas; acima, dividir (ex.: `useResumeSections` + `useResumeSectionReorder`).

## Anti-padrões

- Duplicar markup longo entre páginas — extrair componente.
- Chamadas Axios diretas em massa no `setup` — usar `services/`.
- Cadeias de `watch` sem debounce em pesquisa — usar `watchDebounced` (VueUse) ou equivalente.

## Reutilização de layouts

- Layouts em `src/layouts/` expõem slots para conteúdo e opcionalmente para barra de ações.
- Páginas definem `meta.layout` ou o router aninha rotas filhas sob um layout (ver `paginas-rotas-e-navegacao.md`).
- **Não** misturar shell de autenticação com shell de app autenticada na mesma página sem layout.

## Storybook (opcional)

- Documentar sobretudo `components/ui/` para acelerar revisão visual e acessibilidade.

## Testes

- Componentes críticos: render + interação (Vitest + Testing Library).
- Composables: testes unitários sem montar Vue quando o comportamento for puro.

## Referências

- `docs/09-componentes-reutilizaveis-e-composables.md`
- `arquitetura-spa-modulos-e-pastas.md`
