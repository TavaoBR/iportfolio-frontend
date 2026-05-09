# 01 — Inicialização e configuração do projeto frontend

Guia para criar e manter o projeto **Vue 3 SPA** com **TypeScript**, **Tailwind CSS**, **Flowbite**, **Vue Router**, **Pinia** e **Axios**, alinhado à documentação oficial de cada ferramenta.

## Pré-requisitos

- **Node.js** LTS (20.x ou 22.x recomendado)
- **pnpm**, **npm** ou **yarn** (fixar um gestor no `package.json` / CI)
- Git

## Criação do projeto (Vite + Vue + TypeScript)

```bash
npm create vite@latest iportfolio-web -- --template vue-ts
cd iportfolio-web
npm install
```

### Dependências principais

```bash
npm install vue-router pinia axios
npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer
npm install flowbite flowbite-vue
```

**Notas:**

- Tailwind v4 pode usar `@tailwindcss/vite`; em v3, usar `tailwindcss` + `postcss.config.js`. Ajustar conforme a versão escolhida no arranque.
- **Flowbite Vue**: seguir a [documentação oficial](https://flowbite-vue.com/) para registo de componentes (global vs local) e tema.

### Ficheiros de configuração essenciais

| Ficheiro | Função |
|----------|--------|
| `vite.config.ts` | Alias `@`, plugins Vue, Tailwind, eventual split de chunks |
| `tsconfig.json` / `tsconfig.app.json` | Strict mode, paths |
| `tailwind.config.*` ou CSS entry | Tokens, content paths incluindo `flowbite` |
| `.env` / `.env.development` / `.env.production` | `VITE_API_BASE_URL`, etc. (prefixo **`VITE_`** obrigatório no Vite) |

Exemplo mínimo de variáveis:

```env
# .env.development
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_AUTH_TOKEN_HEADER=X-Token-CV
```

Acesso no código: `import.meta.env.VITE_API_BASE_URL`.

## Estrutura de pastas inicial (recomendada)

Alinhada ao doc **03**; aqui apenas o esqueleto para o primeiro commit.

**Neste repositório:** o código da SPA está em [`web/`](../web/); os caminhos abaixo correspondem a `web/src/`.

```
src/
  app/                 # bootstrap: createApp, plugins, App.vue
  assets/              # estáticos processados (ver 12)
  components/
    ui/                # primitivos + wrappers Flowbite
    domain/            # blocos de negócio reutilizáveis (ex.: ResumeSectionCard)
  composables/         # useX — sem efeitos de “página inteira”
  layouts/             # shells (DefaultLayout, AuthLayout)
  modules/             # opcional: features autocontidas (auth, resume, templates)
    auth/
    resume/
    templates/
  pages/               # vistas ligadas a rotas (thin)
  router/
  services/            # api/, mercadopago redirects, mappers
  stores/              # Pinia
  types/               # DTOs espelhando API quando útil
  utils/
```

## Scripts `package.json`

Sugerido:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

## Qualidade: ESLint + Prettier + Vue

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-vue prettier eslint-config-prettier
```

- Regras Vue 3 + TypeScript strict.
- Integrar **Prettier** para evitar debates de formatação; ESLint foca lógica e padrões Vue.

## Integração Flowbite + Tailwind

1. Incluir paths dos componentes Flowbite no `content` do Tailwind (conforme doc Flowbite).
2. Importar CSS base (Flowbite + Tailwind) no `main.ts` ou `style.css`.
3. Preferir **wrappers** em `components/ui/` quando precisar de props de negócio (ex.: `AppButton` com variantes da marca).

## Checklist antes do primeiro merge

- [ ] `VITE_API_BASE_URL` aponta para `iportfolio-api` local ou staging
- [ ] CORS na API permite a origem do Vite (`http://localhost:5173` típico)
- [ ] Build de produção (`npm run build`) sem erros de TypeScript
- [ ] README do repositório de código (não só este de contexto) com os mesmos passos

## Referências externas

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Flowbite Vue](https://flowbite-vue.com/)
- [Axios](https://axios-http.com/)
