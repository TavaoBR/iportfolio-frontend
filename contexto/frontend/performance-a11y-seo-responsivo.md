# Performance, acessibilidade, SEO e responsividade (mobile-first)

## Responsividade — mobile-first

- Desenhar primeiro para **larguras pequenas**; progressive enhancement para `md`/`lg`.
- Tailwind: breakpoints consistentes (`sm`, `md`, `lg`) — ex.: grelhas `grid-cols-1 md:grid-cols-2`.
- **Editor de CV:** em mobile, alternar entre lista de secções e preview com **tabs** ou passos claros.
- **Touch targets:** mínimo ~44×44px para ações principais.

## Acessibilidade (WCAG — alvo AA)

- **Semântica:** `button` para ações, `a` para navegação; headings em ordem (`h1` → `h2`).
- **Foco visível:** não remover `outline` sem substituto acessível; validar modais Flowbite.
- **ARIA:** labels em inputs; diálogos com `role="dialog"` e foco preso quando aplicável.
- **Contraste:** validar tokens de cor do design system (**04** / tema Tailwind).
- **Motion:** respeitar `prefers-reduced-motion` para animações não essenciais.

### Ferramentas

- Lighthouse / PageSpeed em rotas chave.
- axe DevTools em desenvolvimento.

## Performance — bundle e código

- [ ] Lazy routes para todas as páginas de feature.
- [ ] Lazy import de componentes pesados (gráficos, editores).
- [ ] Auditar dependências; evitar bibliotecas grandes para tarefas pequenas.
- [ ] Revisar bundle com `rollup-plugin-visualizer` periodicamente.

## Performance — rede e render

- [ ] Imagens: `loading="lazy"`, formatos modernos (WebP/AVIF), dimensões explícitas (reduz CLS).
- [ ] Cache Pinia com política clara; evitar over-fetching (ver `api-pinia-estado-e-fetch.md`).
- [ ] Debounce em pesquisas e inputs de alto custo.

## Checklist Core Web Vitals (orientação)

- [ ] **LCP:** hero e fontes sem bloquear render desnecessariamente; preload só do crítico.
- [ ] **INP:** evitar trabalho longo no main thread; dividir tarefas e usar `requestIdleCallback` apenas quando fizer sentido.
- [ ] **CLS:** reservar espaço para imagens, skeletons e conteúdo dinâmico.

## SEO — quando aplicável

O SPA **autenticado** tipicamente **não** é indexável como prioridade.

### Onde SEO importa

- **Marketing / landing** pública: se viver na mesma SPA, considerar:
  - meta tags por rota (`vue-meta` / `@unhead/vue` ou solução equivalente);
  - títulos e descrições únicos;
  - conteúdo significativo no HTML inicial (limitações de SPA pura).
- **Portfólio público** (`/p/:slug`): pode ser alvo de indexação; definir:
  - `document.title` / meta description a partir do conteúdo ou da API;
  - URLs canónicas se houver duplicados;
  - futura migração para **prerender/SSR** ou micro-site estático se o negócio exigir.

### Boas práticas SPA

- Rotas públicas com conteúdo textual real (não só imagens).
- `robots.txt` e `sitemap` no `public/` quando existir estratégia de SEO.

## Build de produção

- `vue-tsc -b && vite build` (ou script equivalente) sem erros.
- Minificação ativa; variáveis `VITE_*` por ambiente.

## Referências

- `docs/10-responsividade-acessibilidade-e-performance.md`
- `docs/12-i18n-assets-e-versionamento.md`
