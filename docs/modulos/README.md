# Módulos do frontend — contratos API e integração

Esta pasta separa a documentação do frontend por **módulo funcional**, com:

- campos esperados nos formulários;
- endpoints da API;
- respostas relevantes;
- responsabilidades de páginas, componentes, stores, composables e services;
- cuidados de UX e estados de erro.

Todos os exemplos assumem:

- `baseURL = VITE_API_BASE_URL`
- header autenticado: `VITE_AUTH_TOKEN_HEADER` (por defeito `X-Token-CV`)
- envelope da API: `{ message: string, data?: T, errors?: unknown }`

## Índice dos módulos

| Módulo | Documento | Escopo |
|--------|-----------|--------|
| Autenticação | [01-auth.md](01-auth.md) | Login, logout, sessão, guards, token |
| Usuário e perfil | [02-usuario-e-perfil.md](02-usuario-e-perfil.md) | Conta, avatar, `/api/me`, perfil profissional |
| Blocos profissionais | [03-blocos-profissionais.md](03-blocos-profissionais.md) | Experiências, educação, skills, projetos, certificações |
| Currículos | [04-curriculos-e-secoes.md](04-curriculos-e-secoes.md) | CV, secções, sugestões, PDF |
| Templates | [05-templates-e-catalogo.md](05-templates-e-catalogo.md) | Catálogo, premium, admin, `template_key` |
| Portfólio | [06-portfolio.md](06-portfolio.md) | Sites, secções, publicação, rota pública |
| Pagamentos | [07-pagamentos-mercado-pago.md](07-pagamentos-mercado-pago.md) | Checkout Pro, redirect, pós-pagamento |
| IA de currículo | [08-ia-curriculo.md](08-ia-curriculo.md) | Analyze, optimize, compare job, histórico |

## Convenção para services

Cada módulo deve expor um service focado:

```ts
// src/modules/auth/services/authApi.ts
import { http } from '@/services/api/http'

type ApiEnvelope<T> = {
  message: string
  data?: T
  errors?: unknown
}

export async function login(payload: LoginPayload) {
  const { data } = await http.post<ApiEnvelope<LoginResponse>>('/api/auth/login', payload)
  return data.data
}
```

## Convenção para stores

Usar Pinia apenas quando o estado precisa sobreviver entre páginas:

- `auth`: sim, token + user global.
- `templates`: sim, catálogo e estado de desbloqueio.
- formulários simples: não necessariamente; usar composable local.

## Estados de erro padrão

| Status | Tratamento UX |
|--------|---------------|
| 401 | limpar sessão e enviar para login |
| 402 | mostrar modal/CTA de pagamento/desbloqueio |
| 404 | mostrar empty state ou “recurso não encontrado” |
| 409 | conflito de slug/e-mail; destacar campo |
| 422 | erros de validação por campo |
| 5xx | mensagem genérica + retry |

