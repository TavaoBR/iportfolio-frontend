<script setup lang="ts">
/**
 * Campo de texto da app: tamanho sm por defeito + labels/ring compactos.
 */
import { computed, useAttrs } from 'vue'
import { FwbInput } from 'flowbite-vue'

type FlowbiteInputSize = 'sm' | 'md' | 'lg'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const WRAPPER =
  '!rounded-[var(--ip-radius-control)] border-slate-200 bg-white !shadow-none text-slate-900 has-[input:focus]:!ring-2 has-[input:focus]:!ring-[rgb(58_134_255_/0.22)] has-[input:focus]:!border-[var(--ip-primary)] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
const LABEL = 'mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300'
const INNER =
  '!px-2 !py-1.5 !text-xs !font-normal leading-snug placeholder:text-xs placeholder:text-slate-400 dark:placeholder-slate-500'

const fieldAttrs = computed(() => {
  const a = { ...(attrs as Record<string, unknown>) }
  const cls = a.class
  const labelClass = a.labelClass
  const inputClass = a.inputClass
  const size = a.size as FlowbiteInputSize | undefined
  delete a.class
  delete a.labelClass
  delete a.inputClass
  delete a.size
  return {
    ...a,
    size: size ?? 'sm',
    class: [WRAPPER, cls].filter(Boolean).join(' '),
    labelClass: [LABEL, labelClass].filter(Boolean).join(' '),
    inputClass: [INNER, inputClass].filter(Boolean).join(' '),
  }
})
</script>

<template>
  <FwbInput v-bind="fieldAttrs">
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
    <template v-if="$slots.validationMessage" #validationMessage>
      <slot name="validationMessage" />
    </template>
    <template v-if="$slots.helper" #helper>
      <slot name="helper" />
    </template>
  </FwbInput>
</template>
