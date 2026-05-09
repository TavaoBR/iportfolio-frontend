# Formulários, loading e tratamento de erros

## Estrutura de formulários

- **Campos agrupados** em componentes de secção quando o formulário for grande (editor de CV).
- **Labels** visíveis ou `aria-label`; mensagens de erro **por campo** abaixo do input ou anunciadas para leitores de ecrã.
- Validação:
  - **Cliente:** UX imediata (campos obrigatórios, formatos).
  - **Servidor (422):** fonte de verdade; mapear `errors` da API para o estado do formulário.
- Biblioteca opcional: VeeValidate — se adotada, usar de forma consistente em todo o projeto.

## Componentes base

- Preferir `AppFormField` (ou equivalente em `components/ui/`) para alinhar labels, hints e erros ao design system.

## Estados de loading (ações)

- **Submissão:** desabilitar botão primário + indicador inline; evitar duplo submit.
- **Carregamento inicial da página:** skeleton ou spinner discreto conforme `design-system-ui-ux-e-referencias-visuais.md`.
- **Re-fetch em background:** indicador não bloqueante quando apropriado.

## Tratamento de erros por origem

| Origem | Comportamento |
|--------|----------------|
| Rede / timeout | Mensagem humana + “Tentar novamente”; opcional retry idempotente |
| 401 | Limpar sessão; redirect login (interceptor + guard) |
| 402 | Modal ou página de desbloqueio; CTA checkout Mercado Pago |
| 422 | Erros por campo; foco no primeiro inválido |
| 5xx | Mensagem genérica; log sem dados sensíveis |

## Fluxo Mercado Pago (templates)

1. Chamada a `POST .../template-checkout` via service.
2. Resposta com `init_point` / `sandbox_init_point`.
3. `window.location.href = initPoint` (ou nova aba, conforme UX acordada).
4. **Nunca** expor credenciais Mercado Pago no frontend.

## Empty e sucesso

- **Empty states:** CTA claro (“Criar primeiro currículo”).
- **Sucesso:** toast ou banner breve; não bloquear navegação desnecessariamente.

## Acessibilidade em formulários

- Associar `label`/`for` ou `aria-describedby` com mensagens de erro.
- Não depender só de cor para indicar erro.

## Referências

- `docs/08-axios-e-comunicacao-com-api.md`
- `docs/04-design-system-e-identidade-visual.md` (estados de interface)
- `performance-a11y-seo-responsivo.md`
