export interface MercadoPagoTemplateCheckoutPayload {
  template_key: string
}

export interface MercadoPagoTemplateCheckoutResponse {
  transaction_public_id?: string
  preference_id?: string
  init_point: string | null
  sandbox_init_point: string | null
  amount?: string
  currency?: 'BRL'
}

