# Módulo — Pagamentos Mercado Pago

Fluxo de checkout para desbloquear templates premium e tratar estados pós-pagamento no frontend. O **access token** e o webhook vivem apenas no backend.

## Endpoints usados pelo frontend

| Método | Endpoint | Auth | Uso |
|--------|----------|------|-----|
| `POST` | `/api/me/payments/mercadopago/template-checkout` | Sim | Criar Checkout Pro preference |
| `GET` | `/api/me/templates` | Sim | Confirmar se `can_use` virou `true` após pagamento |

Webhook do backend:

| Método | Endpoint | Quem chama |
|--------|----------|------------|
| `GET/POST` | `/webhooks/mercadopago` | Mercado Pago |

O frontend **não** chama o webhook.

## Payload de checkout

```ts
type MercadoPagoTemplateCheckoutPayload = {
  template_key: string
}
```

Resposta esperada:

```ts
type MercadoPagoTemplateCheckoutResponse = {
  transaction_public_id: string
  preference_id: string
  init_point: string | null
  sandbox_init_point: string | null
  amount: string
  currency: 'BRL'
}
```

## Fluxo frontend

1. Utilizador tenta usar template premium bloqueado.
2. UI mostra modal com preview e preço.
3. Chamar `POST /api/me/payments/mercadopago/template-checkout`.
4. Redirecionar:

```ts
const url = response.init_point ?? response.sandbox_init_point
if (url) window.location.href = url
```

5. Ao voltar para a app, fazer `GET /api/me/templates`.
6. Se `can_use = true`, liberar aplicação do template.
7. Se ainda não liberou, mostrar “pagamento em processamento” + botão de atualizar.

## Estrutura frontend

```
src/modules/billing/
  components/
    PremiumUnlockModal.vue
    PaymentPendingState.vue
  services/
    paymentsApi.ts
  composables/
    useTemplateCheckout.ts
  types/
    payments.types.ts
```

## Tratamento de erros

| Status | UX |
|--------|----|
| `402` | Fluxo pode estar pendente; mostrar CTA de checkout |
| `503` | Mercado Pago não configurado; mensagem de indisponibilidade |
| `502` | Falha ao criar preference; permitir tentar novamente |

## Segurança

- Nunca colocar `MERCADOPAGO_ACCESS_TOKEN` no frontend.
- Não confiar em query string de retorno do Mercado Pago para liberar template; a liberação vem da API após webhook.
- Não gravar pagamento “aprovado” localmente; apenas usar estado visual temporário.

## Padrão de composable

```ts
export function useTemplateCheckout() {
  const loading = ref(false)

  async function start(templateKey: string) {
    loading.value = true
    try {
      const checkout = await createTemplateCheckout({ template_key: templateKey })
      const url = checkout.init_point ?? checkout.sandbox_init_point
      if (!url) throw new Error('Checkout sem URL de redirecionamento')
      window.location.href = url
    } finally {
      loading.value = false
    }
  }

  return { loading, start }
}
```

