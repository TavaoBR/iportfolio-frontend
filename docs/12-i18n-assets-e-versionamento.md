# 12 — Internacionalização, assets, versionamento e escalabilidade

Planeamento para **i18n**, organização de **ficheiros estáticos** e **estratégia de releases** do frontend.

## Internacionalização (futuro)

### Preparação sem biblioteca

- Centralizar **strings de UI** em ficheiros `src/locales/pt.ts` (e `en.ts` quando existir).
- Evitar literais longos espalhados em templates; usar função `t('key')` quando vue-i18n for adotado.

### Com vue-i18n (quando adotar)

- Instalar `vue-i18n` compatível com Vue 3.
- Lazy load de mensagens por locale (`import()`).
- Formatar datas/números com `Intl` API.
- Atualizar este doc com estrutura de chaves e convenção de namespaces (`resume.editor.title`).

## Assets, ícones e imagens

### `src/assets/`

- Ficheiros **importados** pelo bundler (pequenos SVGs, fontes locais).
- Preferir SVG para ícones; otimizar com SVGO em CI se necessário.

### `public/`

- Ficheiros servidos **sem hash** na URL (`/favicon.ico`, `robots.txt`).
- Não colocar aqui centenas de MB — usar CDN para media pesado se necessário.

### Ícones

- Conjunto único: **Heroicons**, **Lucide** ou pacote Flowbite — evitar misturar três estilos incompatíveis.

### Pasta `templates-cv/` (este repositório de contexto)

- Previews e referências de templates; ver **05** e [templates-cv/README.md](../templates-cv/README.md).

## Versionamento da aplicação

- **Semver** no `package.json` da app (`1.4.0`).
- **Changelog** (`CHANGELOG.md`) por release com secções Added/Changed/Fixed.
- **Tags Git** `v1.4.0` alinhadas a deploy.

## Escalabilidade da codebase

- **Módulos** por domínio (**03**); evitar pastas planas com centenas de ficheiros.
- **Contratos API:** quando a API versionar (`/v2`), encapsular mudança em `services/api` sem espalhar URLs cruas.
- **Feature flags (opcional):** toggles remotos para lançar template novo gradualmente.

## CI/CD (recomendação)

1. Lint + typecheck + testes em cada PR.
2. Build de produção em pipeline.
3. Artefactos estáticos para hosting (S3+CloudFront, Netlify, Vercel, etc.).
4. Variáveis `VITE_*` por ambiente (staging/prod).

## Observabilidade (futuro)

- Erros de runtime: Sentry ou similar (sem dados sensíveis).
- Métricas de negócio: eventos de “template desbloqueado”, “PDF gerado”, conforme privacidade.
