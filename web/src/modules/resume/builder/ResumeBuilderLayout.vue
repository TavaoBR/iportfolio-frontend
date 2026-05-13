<script setup lang="ts">
import { ref } from 'vue'

const editorScrollRoot = ref<HTMLElement | null>(null)

defineExpose({ editorScrollRoot })
</script>

<template>
  <div
    class="resume-builder-compact rb-workspace-root flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white text-[0.8125rem] text-slate-800 shadow-sm"
  >
    <div
      class="grid min-h-0 flex-1 grid-cols-1 divide-y divide-slate-200/80 lg:grid-cols-12 lg:divide-x lg:divide-y-0"
    >
      <div
        class="flex min-h-[min(48vh,400px)] min-h-0 flex-col bg-white lg:col-span-5 lg:min-h-0 lg:max-w-none"
      >
        <div
          ref="editorScrollRoot"
          class="resume-builder-editor-scroll flex min-h-0 flex-1 flex-col overflow-hidden px-5 py-6 sm:px-6 sm:py-7 lg:px-7 lg:py-8"
        >
          <slot />
        </div>
        <div
          v-if="$slots.footer"
          class="shrink-0 border-t border-slate-200/90 bg-white/95 px-3 py-2 shadow-[0_-6px_16px_-8px_rgba(15,23,42,0.12)] supports-[backdrop-filter]:backdrop-blur-sm sm:px-4"
        >
          <slot name="footer" />
        </div>
      </div>
      <div
        class="relative flex h-full min-h-0 min-w-0 flex-col bg-slate-100/95 lg:col-span-7"
      >
        <slot name="preview" />
      </div>
    </div>
  </div>
</template>
