<script setup lang="ts">
import AppSelectField from '@/components/form/AppSelectField.vue'
import AppTextarea from '@/components/form/AppTextarea.vue'
import AppTextField from '@/components/form/AppTextField.vue'
import type {
  DynamicFieldSchema,
  DynamicFormValues,
} from '@/modules/content-blocks/forms/contentBlockFormSchemas'
import type { ResumeSectionFormSchema } from '../forms/resumeSectionFormSchemas'

const props = defineProps<{
  schema: ResumeSectionFormSchema
  values: DynamicFormValues
}>()

const emit = defineEmits<{
  'update:values': [values: DynamicFormValues]
}>()

function inputValue(field: DynamicFieldSchema) {
  const value = props.values[field.key]
  return typeof value === 'string' ? value : ''
}

function checkboxValue(field: DynamicFieldSchema) {
  return Boolean(props.values[field.key])
}

function updateField(field: DynamicFieldSchema, value: string | boolean) {
  emit('update:values', {
    ...props.values,
    [field.key]: value,
  })
}

function gridColClass(field: DynamicFieldSchema): string {
  if (field.type === 'textarea' || field.type === 'checkbox') {
    return 'min-w-0 col-span-full sm:col-span-2 lg:col-span-12'
  }
  if (field.width === 'full') {
    return 'min-w-0 col-span-full sm:col-span-2 lg:col-span-12'
  }
  return 'min-w-0 sm:col-span-1 lg:col-span-6'
}
</script>

<template>
  <div class="ip-form-grid grid min-w-0 grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-12">
    <template v-for="field in schema.fields" :key="field.key">
      <div v-if="field.type === 'textarea'" class="block min-w-0" :class="gridColClass(field)">
        <div class="mb-1 flex items-center gap-1.5">
          <span class="ip-label !mb-0">
            {{ field.label }}<b v-if="field.required" class="text-blue-500"> *</b>
          </span>
          <span
            v-if="field.hint"
            class="inline-flex shrink-0 text-[var(--ip-primary)]"
            title="Texto usado no currículo e visível aos recrutadores quando o CV for partilhado."
            role="img"
            aria-label="Informação"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </div>
        <AppTextarea
          :model-value="inputValue(field)"
          :placeholder="field.placeholder"
          :required="field.required"
          :rows="5"
          @update:model-value="updateField(field, $event)"
        />
      </div>

      <AppSelectField
        v-else-if="field.type === 'select'"
        class="block min-w-0"
        :class="gridColClass(field)"
        :model-value="inputValue(field)"
        :label="field.label"
        :required="field.required"
        placeholder="Selecionar"
        :options="field.options ?? []"
        @update:model-value="updateField(field, $event)"
      />

      <label
        v-else-if="field.type === 'checkbox'"
        class="ip-form-checkbox flex min-h-[2.25rem] items-center gap-2.5 self-end sm:col-span-2 lg:col-span-12"
        :class="gridColClass(field)"
      >
        <input
          type="checkbox"
          :checked="checkboxValue(field)"
          class="size-3.5 shrink-0 rounded border-[var(--ip-input-border)] bg-white text-[var(--ip-primary)] focus:ring-[var(--ip-primary)]"
          @change="updateField(field, ($event.target as HTMLInputElement).checked)"
        />
        {{ field.label }}
      </label>

      <AppTextField
        v-else
        class="min-w-0 w-full"
        :class="gridColClass(field)"
        :model-value="inputValue(field)"
        :label="field.label"
        :type="field.type"
        :placeholder="field.placeholder"
        :required="field.required"
        @update:model-value="updateField(field, String($event ?? ''))"
      />
    </template>
  </div>
</template>
