# Convenções de código — Vue 3 + TypeScript

## Linguagem

- **TypeScript strict** recomendado no `tsconfig`.
- **Vue SFC:** `<script setup lang="ts">` como padrão.
- **Código** (identificadores, nomes de ficheiros de lógica): **inglês** (`fetchResume`, `TemplateCard`).
- **Copy de UI** visível ao utilizador: **português** (ou conforme estratégia de produto/i18n).

## Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Ficheiro de componente | PascalCase | `ResumeSectionEditor.vue` |
| Composable | camelCase + `use` | `useResumeSections.ts` |
| Store Pinia | `useXStore` | `useAuthStore` |
| Constantes | SCREAMING_SNAKE | `MAX_SECTIONS` |
| Tipos/interfaces | PascalCase | `ResumeSectionDto` |

## ESLint + Prettier

- `eslint-plugin-vue` + regras TypeScript.
- Prettier para formatação; ESLint para lógica e padrões Vue.
- CI: falhar em `eslint` e opcionalmente `prettier --check`.

## Imports

- Alias `@/` → `src/` (Vite + `paths` no tsconfig).
- Ordem sugerida: Vue → bibliotecas externas → `@/` → relativos.

## Git

- Branches: `feature/`, `fix/`, `chore/` + descrição curta.
- Commits: imperativos; **uma língua por projeto** (definir no CONTRIBUTING do repo de código).
- PRs: o quê, como testar, screenshots para mudanças de UI.

## Comentários e TODOs

- Comentar **porquê**, não o óbvio.
- TODOs com referência a ticket/issue.

## Segurança no código

- Não logar tokens nem PII em `console.log` em produção.
- Conteúdo de utilizador renderizado como HTML: **sanitizar**; preferir texto puro quando possível.
- Nunca commitar segredos; apenas `VITE_*` não sensíveis no frontend (tokens de MP ficam no backend).

## Boas práticas Vue 3 + TypeScript

- Preferir `computed` e `ref` com tipos inferidos ou explícitos; evitar `any`.
- Extrair lógica repetida para composables; manter `setup` legível.
- Usar `defineProps` / `defineEmits` com tipos genéricos quando útil.

## Referências

- `docs/11-convencoes-de-codigo-e-padronizacao.md`
