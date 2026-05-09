# Módulo — IA de currículo

Módulo para análise, otimização e comparação do currículo com descrição de vaga. No backend atual pode ser stub/evolutivo; o frontend deve isolar a feature para facilitar troca por IA real.

## Endpoints

Todos exigem autenticação.

| Método | Endpoint | Uso |
|--------|----------|-----|
| `POST` | `/api/resumes/{publicId}/ai/analyze` | Analisar currículo |
| `POST` | `/api/resumes/{publicId}/ai/optimize` | Sugerir otimização |
| `POST` | `/api/resumes/{publicId}/ai/compare-job` | Comparar com vaga |
| `GET` | `/api/resumes/{publicId}/ai/analyses` | Listar análises |
| `GET` | `/api/resumes/{publicId}/ai/analyses/{analysisId}` | Ver análise |

## Payloads

### Analyze / Optimize

Sem payload obrigatório no contrato atual. Enviar `{}` se o service padronizar `POST` com body.

```ts
type EmptyAiPayload = Record<string, never>
```

### Compare job

```ts
type AiCompareJobPayload = {
  job_description: string
}
```

Validação:

- `job_description`: obrigatório.

## Modelo de resposta sugerido no frontend

```ts
type AiAnalysis = {
  id: number
  analysis_type: string
  status: string
  request_payload?: Record<string, unknown> | null
  result?: Record<string, unknown> | null
  error_message?: string | null
  created_at: string
  updated_at?: string | null
}
```

A estrutura de `result` pode evoluir. Tipar localmente por `analysis_type` quando a API estabilizar.

## Estrutura frontend

```
src/modules/resume-ai/
  components/
    AiAnalysisPanel.vue
    JobDescriptionCompareForm.vue
    AiResultCard.vue
  services/
    resumeAiApi.ts
  composables/
    useResumeAi.ts
  types/
    resumeAi.types.ts
```

## UX

- Mostrar claramente que sugestões de IA são apoio, não verdade absoluta.
- Exibir estado “processando” se `status` permitir assíncrono no futuro.
- Guardar histórico por currículo na aba “Análises”.
- Inputs longos (`job_description`) devem ter contador e autosave local opcional.

## Integração

```ts
export async function compareJob(publicId: string, payload: AiCompareJobPayload) {
  const { data } = await http.post(`/api/resumes/${publicId}/ai/compare-job`, payload)
  return data.data as AiAnalysis
}
```

## Evolução

- Se análises passarem a ser assíncronas longas: usar polling com intervalo crescente ou Server-Sent Events/WebSocket.
- Se houver custo por análise: mover para módulo de pagamentos/faturação com `purpose` específico no backend.

