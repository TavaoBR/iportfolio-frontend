<script setup lang="ts">
/**
 * Botão da app: densidade compacta (sm por defeito) + estilos .ip-ui-btn.
 * Encapsula FwbButton (Flowbite) para consistência Linear/Vercel-like.
 */
import { computed, useAttrs } from 'vue'
import { FwbButton } from 'flowbite-vue'

type FlowbiteBtnSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const btnAttrs = computed(() => {
  const a = { ...(attrs as Record<string, unknown>) }
  const cls = a.class
  const size = a.size as FlowbiteBtnSize | undefined
  delete a.class
  delete a.size
  return {
    ...a,
    size: size ?? 'sm',
    class: [cls, 'ip-ui-btn'].filter(Boolean).join(' '),
  }
})
</script>

<template>
  <FwbButton v-bind="btnAttrs">
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
    <slot />
  </FwbButton>
</template>
