<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiInput from '@/components/ui/UiInput.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { certificationsApi } from '../services/certificationsApi'
import { educationsApi } from '../services/educationsApi'
import { experiencesApi } from '../services/experiencesApi'
import { projectsApi } from '../services/projectsApi'
import { skillsApi } from '../services/skillsApi'
import { ApiError } from '@/types/api'
import {
  contentBlockSchemas,
  createInitialValues,
  toApiPayload,
  type ContentBlockTab,
  type DynamicFieldSchema,
  type DynamicFormValues,
} from '../forms/contentBlockFormSchemas'

type CrudEntity = Record<string, unknown> & { id: number }
type CrudPayload = Record<string, unknown>
type CrudApi = {
  list: () => Promise<CrudEntity[]>
  create: (payload: CrudPayload) => Promise<CrudEntity>
  remove: (id: number) => Promise<void>
}

const tabs = Object.values(contentBlockSchemas)

const apis: Record<ContentBlockTab, CrudApi> = {
  experiences: {
    list: () => experiencesApi.list() as unknown as Promise<CrudEntity[]>,
    create: (payload) => experiencesApi.create(payload as never) as unknown as Promise<CrudEntity>,
    remove: experiencesApi.remove,
  },
  educations: {
    list: () => educationsApi.list() as unknown as Promise<CrudEntity[]>,
    create: (payload) => educationsApi.create(payload as never) as unknown as Promise<CrudEntity>,
    remove: educationsApi.remove,
  },
  skills: {
    list: () => skillsApi.list() as unknown as Promise<CrudEntity[]>,
    create: (payload) => skillsApi.create(payload as never) as unknown as Promise<CrudEntity>,
    remove: skillsApi.remove,
  },
  projects: {
    list: () => projectsApi.list() as unknown as Promise<CrudEntity[]>,
    create: (payload) => projectsApi.create(payload as never) as unknown as Promise<CrudEntity>,
    remove: projectsApi.remove,
  },
  certifications: {
    list: () => certificationsApi.list() as unknown as Promise<CrudEntity[]>,
    create: (payload) => certificationsApi.create(payload as never) as unknown as Promise<CrudEntity>,
    remove: certificationsApi.remove,
  },
}

const activeTab = ref<ContentBlockTab>('experiences')
const { data, loading, error, run } = useAsyncData<CrudEntity[]>()
const form = ref<DynamicFormValues>(createInitialValues(contentBlockSchemas[activeTab.value]))
const actionError = ref('')
const actionMessage = ref('')
const saving = ref(false)
const removingId = ref<number | null>(null)

const activeConfig = computed(() => contentBlockSchemas[activeTab.value])

async function selectTab(tab: ContentBlockTab) {
  activeTab.value = tab
  form.value = createInitialValues(contentBlockSchemas[tab])
  actionError.value = ''
  actionMessage.value = ''
  await run(apis[tab].list)
}

function getErrorMessage(e: unknown, fallback: string) {
  return e instanceof ApiError ? e.message : fallback
}

function buildPayload(): CrudPayload {
  return toApiPayload(activeConfig.value, form.value)
}

async function createBlock() {
  actionError.value = ''
  actionMessage.value = ''
  saving.value = true

  try {
    await apis[activeTab.value].create(buildPayload())
    form.value = createInitialValues(activeConfig.value)
    await run(apis[activeTab.value].list)
    actionMessage.value = 'Informação adicionada.'
  } catch (e) {
    actionError.value = getErrorMessage(e, 'Não foi possível adicionar a informação.')
  } finally {
    saving.value = false
  }
}

async function removeBlock(id: number) {
  actionError.value = ''
  actionMessage.value = ''
  removingId.value = id

  try {
    await apis[activeTab.value].remove(id)
    await run(apis[activeTab.value].list)
    actionMessage.value = 'Informação removida.'
  } catch (e) {
    actionError.value = getErrorMessage(e, 'Não foi possível remover a informação.')
  } finally {
    removingId.value = null
  }
}

function entityTitle(entity: CrudEntity) {
  const value = entity[activeConfig.value.titleKey]
  return typeof value === 'string' && value ? value : 'Sem título'
}

function entitySubtitle(entity: CrudEntity) {
  const key = activeConfig.value.subtitleKey
  if (!key) return ''
  const value = entity[key]
  return typeof value === 'string' ? value : ''
}

function inputValue(field: DynamicFieldSchema) {
  const value = form.value[field.key]
  return typeof value === 'string' ? value : ''
}

function setInputValue(field: DynamicFieldSchema, value: string) {
  form.value[field.key] = value
}

function checkboxValue(field: DynamicFieldSchema) {
  return Boolean(form.value[field.key])
}

function setCheckboxValue(field: DynamicFieldSchema, checked: boolean) {
  form.value[field.key] = checked
}

function entityDescription(entity: CrudEntity) {
  const key = activeConfig.value.descriptionKey
  if (!key) return ''
  const value = entity[key]
  return typeof value === 'string' ? value : ''
}

onMounted(() => {
  void selectTab(activeTab.value)
})
</script>

<template>
  <div class="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
    <section class="ip-card-strong p-5">
      <h1 class="text-xl font-black text-slate-950">Adicionar ao perfil</h1>
      <p class="mt-1 text-sm text-slate-500">
        Essas informações alimentam automaticamente seus currículos e portfólios.
      </p>

      <form class="mt-5 space-y-4" @submit.prevent="createBlock">
        <template v-for="field in activeConfig.fields" :key="field.key">
          <label v-if="field.type === 'textarea'" class="block">
            <span class="ip-label">
              {{ field.label }}<b v-if="field.required" class="text-blue-500"> *</b>
            </span>
            <textarea
              :value="inputValue(field)"
              :placeholder="field.placeholder"
              :required="field.required"
              rows="5"
              class="ip-input text-sm"
              @input="setInputValue(field, ($event.target as HTMLTextAreaElement).value)"
            />
          </label>

          <label v-else-if="field.type === 'select'" class="block">
            <span class="ip-label">
              {{ field.label }}<b v-if="field.required" class="text-blue-500"> *</b>
            </span>
            <select
              :value="inputValue(field)"
              :required="field.required"
              class="ip-input text-sm"
              @change="setInputValue(field, ($event.target as HTMLSelectElement).value)"
            >
              <option value="">Selecionar</option>
              <option v-for="option in field.options ?? []" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <label v-else-if="field.type === 'checkbox'" class="flex items-center gap-2 text-sm font-bold text-slate-600">
            <input
              type="checkbox"
              :checked="checkboxValue(field)"
              class="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-600"
              @change="setCheckboxValue(field, ($event.target as HTMLInputElement).checked)"
            />
            {{ field.label }}
          </label>

          <UiInput
            v-else
            :model-value="inputValue(field)"
            :label="field.label"
            :type="field.type"
            :placeholder="field.placeholder"
            :required="field.required"
            @update:model-value="setInputValue(field, String($event ?? ''))"
          />
        </template>

        <p v-if="actionError" class="rounded-3xl bg-red-50 p-3 text-sm font-bold text-red-600">{{ actionError }}</p>
        <p v-if="actionMessage" class="rounded-3xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{{ actionMessage }}</p>

        <UiButton type="submit" color="blue" class="w-full" :loading="saving">
          Adicionar
        </UiButton>
      </form>
    </section>

    <section class="ip-card p-5">
      <div class="mb-5">
        <h2 class="text-xl font-black text-slate-950">Informações profissionais</h2>
        <p class="mt-1 text-sm text-slate-500">Resumo, skills, experiências, formação, projetos e certificações em um único lugar.</p>
      </div>

      <div class="mb-5 flex flex-wrap gap-2">
      <UiButton
        v-for="tab in tabs"
        :key="tab.key"
        size="sm"
        :color="activeTab === tab.key ? 'blue' : 'alternative'"
        :outline="activeTab !== tab.key"
        @click="selectTab(tab.key)"
      >
        {{ tab.label }}
      </UiButton>
      </div>

      <div v-if="loading" class="grid gap-3 md:grid-cols-2">
        <div v-for="n in 4" :key="n" class="h-28 animate-pulse rounded-3xl bg-slate-100" />
      </div>
      <p v-else-if="error" class="rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-600">{{ error }}</p>
      <div v-else-if="(data?.length ?? 0) > 0" class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        <article
          v-for="entity in data"
          :key="entity.id"
          class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p class="font-black text-slate-950">{{ entityTitle(entity) }}</p>
          <p v-if="entitySubtitle(entity)" class="mt-1 text-sm text-slate-500">{{ entitySubtitle(entity) }}</p>
          <p v-if="entityDescription(entity)" class="mt-3 line-clamp-3 text-sm text-slate-500">
            {{ entityDescription(entity) }}
          </p>
          <div class="mt-4 flex justify-end">
            <UiButton
              size="xs"
              color="alternative"
              :loading="removingId === entity.id"
              @click="removeBlock(entity.id)"
            >
              Remover
            </UiButton>
          </div>
        </article>
      </div>
      <p v-else class="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
        Nenhuma informação cadastrada nesta categoria.
      </p>
    </section>
  </div>
</template>

