import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * Barra contextual opcional sob a navbar (ex.: título do documento + Cancelar / Guardar).
 * Registada por páginas como o construtor de CV e limpa no unmount.
 */
export const useAppShellChromeStore = defineStore('appShellChrome', () => {
  const contextBarVisible = ref(false)
  const contextDocumentTitle = ref('')
  const contextSaveLoading = ref(false)

  const saveAction = ref<null | (() => Promise<void>)>(null)
  const cancelAction = ref<null | (() => void | Promise<void>)>(null)

  function registerContextBar(opts: {
    title: string
    onSave: () => Promise<void>
    onCancel: () => void | Promise<void>
  }) {
    contextBarVisible.value = true
    contextDocumentTitle.value = opts.title
    saveAction.value = opts.onSave
    cancelAction.value = opts.onCancel
  }

  function updateContextTitle(title: string) {
    contextDocumentTitle.value = title
  }

  function unregisterContextBar() {
    contextBarVisible.value = false
    contextDocumentTitle.value = ''
    saveAction.value = null
    cancelAction.value = null
    contextSaveLoading.value = false
  }

  async function runContextSave() {
    if (!saveAction.value) return
    contextSaveLoading.value = true
    try {
      await saveAction.value()
    } finally {
      contextSaveLoading.value = false
    }
  }

  async function runContextCancel() {
    if (!cancelAction.value) return
    await cancelAction.value()
  }

  return {
    contextBarVisible,
    contextDocumentTitle,
    contextSaveLoading,
    registerContextBar,
    updateContextTitle,
    unregisterContextBar,
    runContextSave,
    runContextCancel,
  }
})
