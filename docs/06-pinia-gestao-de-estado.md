# 06 — Gestão de estado com Pinia

Pinia é a **store oficial** para Vue 3. Este documento define **padrões** para o iPortfolio: o que entra na store, o que fica local, e como sincronizar com a API.

## Quando usar Pinia vs estado local

| Use Pinia | Use `ref`/`reactive` no componente ou composable |
|-----------|---------------------------------------------------|
| Sessão do utilizador (token, user) | UI efémera (modal aberto, tab ativa) |
| Lista de templates em cache | Valores de um único campo antes de blur |
| Preferências globais (tema, locale futuro) | Estado derivado só da rota atual |

## Stores recomendadas (nomes ilustrativos)

| Store | Responsabilidade |
|-------|------------------|
| `useAuthStore` | login, logout, token, utilizador, redirect pós-401 |
| `useTemplateCatalogStore` | lista pública + lista autenticada; invalidar após checkout |
| `useResumeStore` | opcional: currículo “atual” em edição; ou manter só em composable por `publicId` |
| `useUiStore` | toasts globais, sidebar, flags de layout |

Evitar **God store** única com dezenas de entidades.

## Actions assíncronas

- Actions chamam **services** (Axios), não Axios direto nos componentes em massa.
- Padronizar retorno: `{ ok: true, data }` ou tratamento de erro com mensagem amigável.

```ts
// Padrão conceitual
async function fetchMeTemplates() {
  this.loading = true
  try {
    this.items = await templateService.listForUser()
  } finally {
    this.loading = false
  }
}
```

## Imutabilidade e TypeScript

- Tipar `state` com interfaces (`User`, `TemplateCatalogRow`).
- Preferir substituir objetos (`this.resume = { ... }`) a mutações profundas não tipadas quando simplificar o fluxo.

## Integração com Vue Router

- **Não** duplicar `userId` na store se já estiver no token/payload; derivar quando necessário.
- Após login bem-sucedido: `router.push` para dashboard; store auth preenchida.

## SSR / hidratação

Em **SPA pura**, não há hidratação. Se no futuro existir SSR, documentar aqui stores compatíveis com serialização.

## Testes

- Testar stores com **Pinia em ambiente isolado** (Vitest) mockando services.

## Referência

- [Pinia](https://pinia.vuejs.org/)
