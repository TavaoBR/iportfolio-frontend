# 11 — Convenções de código e padronização

Normas para manter o código **legível**, **previsível** e **adequado a equipa**.

## Linguagem e estilo

- **TypeScript strict** recomendado (`strict: true` no tsconfig).
- **Vue SFC:** `<script setup lang="ts">` como padrão.
- Nomes em **inglês** para código (`fetchResume`, `TemplateCard`); copy de UI pode ser **português** conforme produto.

## Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componente arquivo | PascalCase | `ResumeSectionEditor.vue` |
| Composable | camelCase com `use` | `useResumeSections.ts` |
| Store Pinia | `useXStore` | `useAuthStore` |
| Constantes | SCREAMING_SNAKE | `MAX_SECTIONS` |
| Tipos/interfaces | PascalCase | `ResumeSectionDto` |

## ESLint + Prettier

- ESLint com `eslint-plugin-vue` e regras TypeScript.
- Prettier para formatação; CI falha se `eslint` ou `format:check` falhar.

## Imports

- Alias `@/` para `src/` (configurar em Vite + tsconfig paths).
- Ordem opcional: Vue, libs externas, alias internos, relativos.

## Git

- **Branches:** `feature/`, `fix/`, `chore/` + descrição curta.
- **Commits:** mensagens imperativas em português ou inglês — **uma língua por projeto**, fixada no CONTRIBUTING do repo de código.
- **PRs:** descrição do que muda e como testar; screenshots para UI.

## Comentários

- Comentar **porquê**, não **o quê** óbvio.
- TODOs com ticket/issue associado quando possível.

## Segurança no código

- Não logar tokens ou PII em `console.log` em produção.
- Sanitizar HTML se algum conteúdo de utilizador for renderizado como HTML (preferir texto puro).

## Documentação no repo de código

- README com setup (pode espelhar **01**).
- ADRs opcionais para decisões grandes (troca de UI kit, estratégia de estado).
