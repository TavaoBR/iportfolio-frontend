# Boas práticas — Vue 3 + TypeScript + Tailwind + Flowbite

Checklist consolidado para revisão de código e implementação de novas features.

## Vue 3

- [ ] Composition API com `<script setup lang="ts">`.
- [ ] Páginas finas; lógica em composables, services e Pinia.
- [ ] `defineProps` / `defineEmits` tipados; evitar `any`.
- [ ] Cleanup em `onBeforeUnmount` para listeners, timers e subscrições.
- [ ] Preferir `computed` a métodos que recalculam sem necessidade em templates grandes.

## TypeScript

- [ ] `strict` ativo; tipos para respostas da API estáveis.
- [ ] DTOs em `types/` ou ao lado dos services quando o domínio for pequeno.
- [ ] Erros de API representados por tipo (`ApiError`) com `status` discriminável.

## Tailwind

- [ ] Tokens semânticos (`brand-*`) em vez de hex repetidos.
- [ ] Mobile-first: classes base para mobile, prefixos `sm:`/`md:`/`lg:` para maiores.
- [ ] Evitar `@apply` excessivo que esconda a estrutura visual; usar com moderação em primitivos.

## Flowbite

- [ ] Import/registo consciente de componentes (tree-shaking).
- [ ] Wrappers em `components/ui/` para variantes de marca e futura substituição do kit.
- [ ] Validar foco e ARIA em modais, dropdowns e formulários após customização.

## Integração stack

- [ ] Estilos: Tailwind + classes dos componentes Flowbite; não combinar com outro framework CSS sem decisão arquitetural.
- [ ] Temas: se dark mode, testar componentes críticos em ambos os modos.

## Qualidade

- [ ] ESLint + Prettier sem avisos ignorados sem justificação.
- [ ] Testes para lógica crítica (composables, stores) e componentes de alto risco.

## Onde aprofundar

- `convencoes-typescript-vue.md`
- `design-system-ui-ux-e-referencias-visuais.md`
- `api-pinia-estado-e-fetch.md`
- `performance-a11y-seo-responsivo.md`
- Documentação oficial: [Vue 3](https://vuejs.org/), [Tailwind](https://tailwindcss.com/), [Flowbite Vue](https://flowbite-vue.com/)
