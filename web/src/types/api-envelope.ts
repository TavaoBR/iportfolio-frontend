/**
 * Envelope típico de `iportfolio-api` (ver `docs/08-axios-e-comunicacao-com-api.md`).
 * Ajustar se o backend usar outro formato.
 */
export type ApiEnvelope<T> = {
  message?: string
  data?: T
  errors?: unknown
}

export function unwrapData<T>(payload: unknown): T {
  if (
    payload !== null &&
    typeof payload === 'object' &&
    'data' in payload &&
    (payload as ApiEnvelope<T>).data !== undefined
  ) {
    return (payload as ApiEnvelope<T>).data as T
  }
  return payload as T
}
