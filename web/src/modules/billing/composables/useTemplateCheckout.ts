import { ref } from 'vue'
import { createTemplateCheckout } from '../services/paymentsApi'

export function useTemplateCheckout() {
  const loading = ref(false)

  async function start(templateKey: string) {
    loading.value = true
    try {
      const checkout = await createTemplateCheckout({ template_key: templateKey })
      const url = checkout.init_point ?? checkout.sandbox_init_point
      if (!url) {
        throw new Error('Checkout sem URL de redirecionamento.')
      }
      window.location.href = url
    } finally {
      loading.value = false
    }
  }

  return { loading, start }
}

