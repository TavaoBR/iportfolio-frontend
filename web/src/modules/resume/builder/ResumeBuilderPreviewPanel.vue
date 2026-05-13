<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ResumeTemplateRenderer from '../templates/components/ResumeTemplateRenderer.vue'
import { RESUME_A4_HEIGHT_PX, RESUME_A4_WIDTH_PX } from '../templates/resumeA4Constants'
import type { ResumeTemplateRendererContext } from '../templates/types'

const props = withDefaults(
  defineProps<
    ResumeTemplateRendererContext & {
      templateKey: string
      progress: number
      /** Painel estilo workspace (direita): fundo cinza, folha A4 centrada */
      workspace?: boolean
      /** Escala base quando não há medição (fallback) */
      sheetScale?: number
    }
  >(),
  {
    progress: 0,
    workspace: false,
    sheetScale: 0.44,
  },
)

const measureHost = ref<HTMLElement | null>(null)
const measuredScale = ref(props.sheetScale)

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/** Área útil dentro do padding (client* inclui padding; não subtrair margem fixa em cima disso). */
function contentBoxSize(el: HTMLElement) {
  const cs = getComputedStyle(el)
  const pl = Number.parseFloat(cs.paddingLeft) || 0
  const pr = Number.parseFloat(cs.paddingRight) || 0
  const pt = Number.parseFloat(cs.paddingTop) || 0
  const pb = Number.parseFloat(cs.paddingBottom) || 0
  return {
    w: Math.max(0, el.clientWidth - pl - pr),
    h: Math.max(0, el.clientHeight - pt - pb),
  }
}

function applyScaleFromContentSize(w: number, h: number) {
  const usableW = Math.max(120, w)
  const usableH = Math.max(80, h)
  const sW = usableW / RESUME_A4_WIDTH_PX
  const sH = usableH / RESUME_A4_HEIGHT_PX
  let base: number
  if (props.workspace) {
    // Preenche largura ou altura do painel; a outra dimensão pode ultrapassar → scroll no host.
    base = Math.max(sW, sH) * 0.995
  } else {
    base = Math.min(sW, sH) * 0.98
  }
  const maxScale = props.workspace ? 1.35 : 0.92
  measuredScale.value = clamp(base, 0.22, maxScale)
}

function updateMeasuredScale() {
  const el = measureHost.value
  if (!el) {
    measuredScale.value = props.sheetScale
    return
  }
  const { w, h } = contentBoxSize(el)
  applyScaleFromContentSize(w, h)
}

const ro = new ResizeObserver((entries) => {
  const cr = entries[0]?.contentRect
  if (!cr) {
    updateMeasuredScale()
    return
  }
  applyScaleFromContentSize(cr.width, cr.height)
})

watch(
  measureHost,
  (el, prev) => {
    if (prev) ro.unobserve(prev)
    if (el) ro.observe(el)
    updateMeasuredScale()
  },
  { flush: 'post' },
)

onMounted(() => {
  void nextTick(() => updateMeasuredScale())
})

onBeforeUnmount(() => {
  ro.disconnect()
})
</script>

<template>
  <aside v-if="!workspace" class="sticky top-4 space-y-3 lg:top-6">
    <div class="ip-card p-3 sm:p-3.5">
      <div class="mb-3 flex items-center justify-between gap-2">
        <div class="min-w-0">
          <p class="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[var(--ip-primary)]">
            Preview
          </p>
          <h2 class="mt-0.5 text-sm font-black leading-tight text-slate-950">Currículo em tempo real</h2>
        </div>
        <span class="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[0.65rem] font-black text-blue-600">
          {{ progress }}%
        </span>
      </div>
      <div class="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div class="h-full rounded-full bg-[var(--ip-primary)] transition-all" :style="{ width: `${progress}%` }" />
      </div>
    </div>

    <div
      ref="measureHost"
      class="flex justify-center overflow-hidden rounded-3xl bg-[#dfeaf2] p-3 shadow-[0_16px_48px_rgba(15,23,42,0.1)] sm:p-3.5"
    >
      <ResumeTemplateRenderer
        :template-key="templateKey"
        :resume="resume"
        :sections="sections"
        :profile="profile"
        :user="user"
        :fallback="fallback"
        :profile-photo-url="profilePhotoUrl"
        :scale="measuredScale"
        :framed="false"
      />
    </div>
  </aside>

  <div v-else class="flex h-full min-h-0 w-full flex-col">
    <div
      ref="measureHost"
      class="flex min-h-0 min-w-0 flex-1 items-start justify-center overflow-auto overscroll-contain p-1 sm:p-2 lg:p-2"
    >
      <div
        class="shrink-0 rounded-sm bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)] ring-1 ring-slate-300/45"
      >
        <ResumeTemplateRenderer
          :template-key="templateKey"
          :resume="resume"
          :sections="sections"
          :profile="profile"
          :user="user"
          :fallback="fallback"
          :profile-photo-url="profilePhotoUrl"
          :scale="measuredScale"
          :framed="false"
        />
      </div>
    </div>
  </div>
</template>
