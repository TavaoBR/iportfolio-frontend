# 08 — Axios e comunicação com a API

Integração com **iportfolio-api**: instância Axios única, **interceptors**, tratamento de erros e convenções de tipos.

## Instância base

```ts
// Conceito: services/api/http.ts
import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: 'application/json' },
  timeout: 30_000,
})
```

## Interceptor de pedido

- Anexar header de autenticação se token existir (Pinia ou storage seguro):

```ts
http.interceptors.request.use((config) => {
  const token = getToken() // auth store / sessionStorage
  const headerName = import.meta.env.VITE_AUTH_TOKEN_HEADER ?? 'X-Token-CV'
  if (token) config.headers[headerName] = token
  return config
})
```

## Interceptor de resposta

Tratar centralmente:

| Status | Ação típica |
|--------|-------------|
| 401 | Limpar sessão, redirecionar login |
| 402 | Emitir evento ou rejeitar com código tipado para UI de pagamento |
| 422 | Propagar `errors` de validação |
| 5xx | Mensagem genérica + log |

Evitar **duplicar** `try/catch` idêntico em cada service: padronizar erro customizado `ApiError` com `status`, `message`, `body`.

## Organização dos services

```
services/api/
  http.ts
  auth.ts          # registo, login, logout, me
  users.ts
  resumes.ts
  resumeSections.ts
  templates.ts
  portfolio.ts
  payments.ts      # template-checkout Mercado Pago
```

Cada ficheiro exporta funções pequenas; **não** uma classe gigante.

## Tipos

- Definir interfaces para `data` quando estável (`Resume`, `TemplateCatalogItem`).
- Resposta envelope da API: `{ message: string, data?: T, errors?: unknown }` — alinhar com `ApiResponseService` do backend.

## CORS

A API deve permitir a origem do Vite em desenvolvimento (`nelmio_cors`). Em produção, origem do domínio do frontend.

## Mercado Pago

- `POST /api/me/payments/mercadopago/template-checkout` devolve `init_point` / `sandbox_init_point`.
- O frontend faz **`window.location.href = initPoint`** (ou abre nova aba conforme UX).
- Não expor `MERCADOPAGO_ACCESS_TOKEN` no frontend — só na API.

## Segurança

- Nunca commitar tokens no código.
- Preferir HTTPS em produção; cookies HttpOnly só se houver BFF (fora do escopo SPA pura documentado aqui).

## Referência

- [Axios](https://axios-http.com/docs/intro)
