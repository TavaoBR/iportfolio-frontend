<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    error?: string
    rows?: number
    size?: 'sm' | 'md'
    variant?: 'default' | 'ghost'
    id?: string
  }>(),
  {
    rows: 5,
    size: 'sm',
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const autoId = useId()
const fieldId = computed(() => props.id ?? autoId)

const controlClass = computed(() => {
  const base = 'ip-input max-w-full resize-y'
  const ghost = props.variant === 'ghost' ? 'border-transparent bg-slate-50/90' : ''
  const md = props.size === 'md' ? 'py-2.5 text-[0.9375rem]' : ''
  const err = props.error ? 'border-red-400 focus-visible:border-red-500' : ''
  return [base, ghost, md, err].filter(Boolean).join(' ')
})
</script>

<template>
  <div class="min-w-0">
    <label v-if="label" :for="fieldId" class="ip-label">
      {{ label }}<b v-if="required" class="text-blue-500"> *</b>
    </label>
    <textarea
      :id="fieldId"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :class="controlClass"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <p v-if="error" class="mt-1 text-[0.65rem] font-semibold text-red-600" role="alert">
      {{ error }}
    </p>
  </div>
</template>
