# 04 — Design system e identidade visual

Documenta como o frontend materializa a **identidade iPortfolio** usando **Tailwind CSS** e **Flowbite (Vue)**, mantendo consistência entre dashboard, editor de CV e fluxos de pagamento.

## Objetivos

1. **Coerência visual** — mesma linguagem de cor, tipo e espaçamento em todo o produto.
2. **Velocidade de entrega** — componentes base prontos (Flowbite) + camada de customização mínima.
3. **Acessibilidade** — contraste, foco, tamanhos de alvo (ver também **10**).

## Pilares da identidade (ajustar com design final)

| Pilar | Notas |
|-------|--------|
| Profissional e claro | Evitar excesso decorativo no editor; foco no conteúdo do CV |
| Moderno | Espaçamento generoso, tipografia legível, cantos e sombras subtis |
| Confiança | Fluxos de pagamento com feedback explícito (loading, sucesso, erro) |

Valores concretos (hex, fontes) devem ser fixados num **Figma** ou ficheiro de tokens e replicados no Tailwind.

## Tailwind como fonte de tokens

### `tailwind.config` (ou `@theme` em v4)

Estender o tema com tokens da marca:

```js
// Exemplo conceitual — adaptar à versão do Tailwind
theme: {
  extend: {
    colors: {
      brand: {
        50: '...',
        // ...
        900: '...',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
},
```

**Regra:** componentes de UI da app preferem `bg-brand-600` a cores hex soltas nos templates, salvo exceções documentadas.

## Flowbite (Vue)

- Usar componentes documentados (modal, dropdown, tabs, forms) para **reduzir bugs de acessibilidade** vs implementações caseiras.
- **Não** importar a biblioteca inteira de forma desordenada: import **por componente** ou registo consciente para tree-shaking.

### Camada `components/ui/`

Criar wrappers finos:

- `AppButton.vue` — mapeia variantes da marca para props Flowbite/Button.
- `AppCard.vue` — padding e sombra padronizados para listagens (templates, currículos).

Assim, se trocar Flowbite no futuro, o impacto concentra-se em `components/ui/`.

## Layout e grelha

- **Dashboard:** largura máxima `max-w-7xl`, gutters consistentes.
- **Editor de CV:** área central tipo “folha” (`max-w-3xl`) para preview próximo do PDF.
- **Mobile:** navegação inferior ou menu colapsável; não esconder ações críticas atrás de gestos obscuros.

## Estados de interface

Padronizar para toda a app:

- **Loading:** skeleton ou spinner discreto; evitar páginas em branco.
- **Empty:** ilustração leve + CTA (“Criar primeiro currículo”).
- **Erro:** mensagem humana + retry; 402 com CTA “Desbloquear template”.

## Dark mode (opcional)

Se ativar:

- Usar `class` strategy do Tailwind (`dark:`).
- Garantir que Flowbite suporta tema escuro ou sobrepor tokens.

Documentar a decisão **sim/não** aqui quando fechada.

## Documentação viva

- Screenshots ou links Figma no repositório de design.
- Este ficheiro referencia **princípios**; números exatos vivem no código (`tailwind.config`) e no Figma.

## Referências

- [Flowbite Vue](https://flowbite-vue.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
