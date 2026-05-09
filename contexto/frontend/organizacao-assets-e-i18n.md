# Organização de assets, ícones e i18n

## Assets no código da aplicação

### `src/assets/`

- Ficheiros **importados** pelo bundler: SVGs pequenos, fontes locais, imagens referenciadas em componentes.
- SVG preferível para ícones; otimização (ex.: SVGO) em CI se o volume justificar.

### `public/`

- Ficheiros servidos **sem hash** na URL: `favicon.ico`, `robots.txt`, manifestos.
- Evitar colocar ficheiros muito grandes aqui; media pesado → CDN quando necessário.

### Ícones

- **Um conjunto** por produto: Heroicons, Lucide ou ícones alinhados ao Flowbite — não misturar três estilos incompatíveis.

## Relação com este repositório

- **`templates-cv/`** — previews e referências de **templates de CV/portfólio** (ver `templates-cv-renderer-e-assets.md`); não substituem `preview_url` da API.
- **`template-plataforma/`** — referências visuais da **UI da plataforma** (ex.: login).

## Internacionalização (i18n)

### Preparação sem biblioteca

- Centralizar strings em `src/locales/pt.ts` (e `en.ts` quando existir).
- Evitar literais longos espalhados; facilita adoção futura de `vue-i18n`.

### Com `vue-i18n` (quando adotar)

- Lazy load de mensagens por locale (`import()`).
- Datas e números com `Intl` API.
- Convenção de chaves por domínio: `resume.editor.title`, `templates.checkout.cta`, etc.

## Versionamento e escala

- Semver no `package.json`; `CHANGELOG.md`; tags Git alinhadas ao deploy.
- Contratos API versionados (`/v2`) encapsulados em `services/api/`.
- Feature flags opcionais para lançar templates gradualmente.

## CI/CD (recomendação)

1. Lint + typecheck + testes em PR.
2. Build de produção.
3. Artefactos estáticos para hosting; `VITE_*` por ambiente.

## Observabilidade (futuro)

- Erros: Sentry ou similar (sem dados sensíveis).
- Eventos de negócio conforme privacidade (ex.: template desbloqueado).

## Referências

- `docs/12-i18n-assets-e-versionamento.md`
