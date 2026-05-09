# 10 — Responsividade, acessibilidade e performance

Requisitos transversais para o SPA: **mobile-first**, **WCAG** e **performance** perceptível.

## Responsividade

- Desenhar primeiro para **larguras pequenas**; progressive enhancement para desktop.
- Tailwind: breakpoints padrão (`sm`, `md`, `lg`) com consistência (ex.: `md:grid-cols-2`).
- **Editor de CV:** em mobile, alternar entre “lista de secções” e “preview” com tabs claras.
- **Touch targets:** mínimo ~44×44px para botões principais.

## Acessibilidade (a11y)

- **Semântica:** `button` para ações, `a` para navegação; headings em ordem (`h1` → `h2`).
- **Foco visível:** não remover `outline` sem substituto; Flowbite costuma tratar modais — validar.
- **ARIA:** labels em inputs (`label for` ou `aria-label`); modais com `role="dialog"`.
- **Contraste:** cumprir WCAG AA para texto normal (verificar tokens em **04**).
- **Motion:** respeitar `prefers-reduced-motion` para animações não essenciais.

## Performance

### Bundle

- Lazy routes (**07**); lazy imports de componentes pesados (charts, editores).
- Auditar dependências: evitar bibliotecas enormes para tarefas pequenas.

### Rede

- Evitar over-fetching (**03**); cache Pinia com política clara.
- Imagens: `loading="lazy"`, formatos modernos, dimensões explícitas para evitar CLS.

### Core Web Vitals (orientação)

- **LCP:** hero e fontes não bloqueantes; pré-carregar recurso crítico se necessário.
- **INP:** reduzir trabalho longo no main thread (chunking, debounce).
- **CLS:** reservar espaço para imagens e skeletons.

### Build

- `vite build` com minificação; revisar `rollup-plugin-visualizer` periodicamente.

## Ferramentas

- Lighthouse / PageSpeed em rotas chave.
- axe DevTools para acessibilidade em desenvolvimento.
