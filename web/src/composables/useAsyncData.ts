import { ref, type Ref } from 'vue'

export function useAsyncData<T>() {
  const data = ref(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function run(fn: () => Promise<T>): Promise<void> {
    loading.value = true
    error.value = null
    try {
      data.value = await fn()
    } catch (e) {
      data.value = null
      error.value = e instanceof Error ? e.message : 'Erro inesperado.'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, run }
}
