# Consumo da API, Pinia e estratégias de dados

## Cliente HTTP (Axios)

Instância única em `services/api/http.ts`:

- `baseURL: import.meta.env.VITE_API_BASE_URL`
- `headers: { Accept: 'application/json' }`
- `timeout` razoável (ex.: 30s para operações normais)

### Interceptor de pedido

- Anexar header de autenticação quando existir token.
- Nome do header: `import.meta.env.VITE_AUTH_TOKEN_HEADER ?? 'X-Token-CV'`.

### Interceptor de resposta

| Status | Ação típica |
|--------|-------------|
| 401 | Limpar sessão; redirecionar login |
| 402 | Rejeitar com erro tipado para UI de pagamento / desbloqueio |
| 422 | Propagar erros de validação para formulários |
| 5xx | Mensagem genérica + log/telemetria |

Evitar `try/catch` idêntico em cada service: usar **`ApiError`** (ou similar) com `status`, `message`, `body`.

## Organização dos services (`services/api/`)

```
http.ts
auth.ts
users.ts
resumes.ts
resumeSections.ts
templates.ts
portfolio.ts
payments.ts    # template-checkout Mercado Pago
```

- Funções pequenas exportadas; **evitar** uma classe monolítica.
- **Sem** manipulação de DOM nos services.

## Tipos

- Interfaces para payloads estáveis (`Resume`, `TemplateCatalogItem`).
- Alinhar envelope da API com o backend (`message`, `data`, `errors`).

## Pinia — quando usar

| Pinia | Estado local (`ref` / composable) |
|-------|-----------------------------------|
| Sessão, token, utilizador | Modal aberto, tab ativa |
| Cache de catálogo de templates | Valores efémeros de um campo |
| Preferências globais (tema, locale futuro) | Estado derivado só da rota atual |

### Stores recomendadas (ilustrativo)

- `useAuthStore` — login, logout, utilizador, reação a 401.
- `useTemplateCatalogStore` — listas públicas/autenticadas; invalidar após checkout.
- `useResumeStore` — opcional: currículo “atual”; ou só composable por `publicId`.
- `useUiStore` — toasts, sidebar, flags de layout.

**Evitar** uma única store com dezenas de entidades não relacionadas.

### Actions assíncronas

- Actions chamam **services**, não Axios espalhado em componentes.
- Padrão: `loading` + `try/finally`; atualizar state com dados tipados.

## Checklist anti–over-fetch

- [ ] Em listagens, usar endpoints **leves** quando a API os expuser (lista vs detalhe com secções).
- [ ] Não carregar sub-recursos até abrir detalhe ou secção relevante (lazy por rota).
- [ ] Cache em Pinia com chave `entity:id` e política de frescura (timestamp ou “staleTime” mental).
- [ ] Se faltar projeção na API, **documentar pedido** de `?fields=` ou endpoint dedicado antes de acumular hacks no cliente.
- [ ] Não duplicar a mesma lista em múltiplas stores — **uma fonte** por domínio.

## Checklist anti–memory leak

- [ ] Em `onMounted`, registar listeners (`window`, `document`, WebSocket); **remover** em `onBeforeUnmount`.
- [ ] Subscrições manuais (event bus raro, `watch` com side-effects pesados): garantir cleanup.
- [ ] **Evitar** closures que retêm grandes estruturas se o componente for montado/desmontado frequentemente (listas virtualizadas, editores).
- [ ] Timers (`setInterval`, `setTimeout`): `clearInterval` / `clearTimeout` no unmount.
- [ ] Observadores de terceiros (charts, editores WYSIWYG): chamar `.dispose()` / API de destroy quando existir.
- [ ] Async em flight: se o componente desmontar antes da resposta, **ignorar** atualização de state (flag `cancelled` ou `AbortController` no Axios).

## Sincronização pós–Mercado Pago

- Após redirect, o backend confirma pagamento; o frontend faz **poll** ou **re-fetch** de `/api/me/templates` antes de assumir desbloqueio.

## CORS e ambientes

- Desenvolvimento: origem Vite (ex.: `http://localhost:5173`) permitida na API.
- Produção: origem do domínio do frontend.

## Referências

- `docs/08-axios-e-comunicacao-com-api.md`
- `docs/06-pinia-gestao-de-estado.md`
- `docs/03-modulos-arquitetura-e-organizacao.md` (secção over-fetching)
