import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { listMyTemplates, listPublicTemplates } from '../services/templatesApi'
import type { TemplateCatalogItem, TemplateType, UserTemplateCatalogItem } from '../types/templates.types'

export const useTemplateCatalogStore = defineStore('templateCatalog', () => {
  const publicItems = ref<TemplateCatalogItem[]>([])
  const userItems = ref<UserTemplateCatalogItem[]>([])
  const loading = ref(false)

  const unlockedKeys = computed(
    () => new Set(userItems.value.filter((item) => item.can_use).map((item) => item.template_key)),
  )

  async function loadPublic(type?: TemplateType) {
    loading.value = true
    try {
      publicItems.value = await listPublicTemplates(type)
    } finally {
      loading.value = false
    }
  }

  async function loadMine(type?: TemplateType) {
    loading.value = true
    try {
      userItems.value = await listMyTemplates(type)
    } finally {
      loading.value = false
    }
  }

  return { publicItems, userItems, loading, unlockedKeys, loadPublic, loadMine }
})

