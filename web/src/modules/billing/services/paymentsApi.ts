import { http } from '@/services/api/http'
import { unwrapData } from '@/types/api-envelope'
import type {
  MercadoPagoTemplateCheckoutPayload,
  MercadoPagoTemplateCheckoutResponse,
} from '../types/payments.types'

export async function createTemplateCheckout(
  payload: MercadoPagoTemplateCheckoutPayload,
): Promise<MercadoPagoTemplateCheckoutResponse> {
  const { data } = await http.post<unknown>(
    '/api/me/payments/mercadopago/template-checkout',
    payload,
  )
  return unwrapData<MercadoPagoTemplateCheckoutResponse>(data)
}

