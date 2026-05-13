import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * Estado transitório entre o picker de modelo e o editor (ex.: “trocar modelo”
 * com contexto preservado). Preferimos `query` na rota quando possível; esta
 * store cobre extras sem poluir a URL.
 */
export const useResumeDraftStore = defineStore('resumeDraft', () => {
  const lastPickedTemplateKey = ref<string | null>(null)

  function setLastPickedTemplateKey(key: string | null) {
    lastPickedTemplateKey.value = key
  }

  function consumeLastPickedTemplateKey(): string | null {
    const k = lastPickedTemplateKey.value
    lastPickedTemplateKey.value = null
    return k
  }

  return {
    lastPickedTemplateKey,
    setLastPickedTemplateKey,
    consumeLastPickedTemplateKey,
  }
})
