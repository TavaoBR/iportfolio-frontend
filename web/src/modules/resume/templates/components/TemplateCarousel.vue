<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import TemplatePreview from './TemplatePreview.vue'
import type { ResumeTemplateDefinition, ResumeTemplateRendererContext } from '../types'

const props = withDefaults(
  defineProps<
    ResumeTemplateRendererContext & {
      templates: ResumeTemplateDefinition[]
      modelValue: string
      title?: string
      description?: string
      selectLabel?: string
      scale?: number
    }
  >(),
  {
    title: 'Modelos prontos para uso que ajudarão seu currículo a se destacar para recrutadores',
    description: '',
    selectLabel: 'Selecionar',
    scale: 0.34,
  },
)

const emit = defineEmits<{
  'update:modelValue': [key: string]
  select: [template: ResumeTemplateDefinition]
}>()

const scroller = ref<HTMLElement | null>(null)
const activeKey = ref(props.modelValue)
let frame = 0
let scrollEndTimer = 0

const activeIndex = computed(() => {
  const index = props.templates.findIndex((template) => template.key === activeKey.value)
  return index >= 0 ? index : 0
})

function templateByIndex(index: number) {
  const normalizedIndex = Math.max(0, Math.min(index, props.templates.length - 1))
  return props.templates[normalizedIndex]
}

function scrollToTemplate(key: string, behavior: ScrollBehavior = 'smooth') {
  const container = scroller.value
  const element = container?.querySelector<HTMLElement>(`[data-template-key="${key}"]`)
  if (!container || !element) return

  const left = element.offsetLeft - container.clientWidth / 2 + element.clientWidth / 2
  container.scrollTo({ left, behavior })
}

function choose(template: ResumeTemplateDefinition) {
  activeKey.value = template.key
  emit('update:modelValue', template.key)
  emit('select', template)
  scrollToTemplate(template.key)
}

function move(direction: -1 | 1) {
  const template = templateByIndex(activeIndex.value + direction)
  if (!template) return

  activeKey.value = template.key
  scrollToTemplate(template.key)
}

function syncActiveFromScroll() {
  const container = scroller.value
  if (!container) return

  const center = container.scrollLeft + container.clientWidth / 2
  const items = Array.from(container.querySelectorAll<HTMLElement>('[data-template-key]'))
  const nearest = items.reduce<{ key: string; distance: number } | null>((current, item) => {
    const itemCenter = item.offsetLeft + item.clientWidth / 2
    const distance = Math.abs(center - itemCenter)
    const key = item.dataset.templateKey
    if (!key) return current
    if (!current || distance < current.distance) return { key, distance }
    return current
  }, null)

  if (nearest && nearest.key !== activeKey.value) {
    activeKey.value = nearest.key
  }
}

function onScroll() {
  window.cancelAnimationFrame(frame)
  window.clearTimeout(scrollEndTimer)
  frame = window.requestAnimationFrame(syncActiveFromScroll)
  scrollEndTimer = window.setTimeout(syncActiveFromScroll, 120)
}

watch(
  () => props.modelValue,
  (key) => {
    activeKey.value = key
    void nextTick(() => scrollToTemplate(key, 'smooth'))
  },
)

onMounted(() => {
  void nextTick(() => scrollToTemplate(props.modelValue || props.templates[0]?.key, 'auto'))
})
</script>

<template>
  <section class="overflow-hidden rounded-[28px] bg-[#eef4f8] px-4 py-8 text-slate-950 sm:px-8 lg:px-10">
    <div class="mx-auto max-w-5xl text-center">
      <h2 class="text-balance text-xl font-black tracking-tight sm:text-2xl">{{ title }}</h2>
      <p v-if="description" class="mt-2 text-sm text-slate-500">{{ description }}</p>
    </div>

    <div class="relative mt-8">
      <button
        type="button"
        class="absolute left-1 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-blue-500 text-2xl font-light text-white shadow-[0_14px_35px_rgba(59,130,246,0.3)] transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
        :disabled="activeIndex === 0"
        aria-label="Template anterior"
        @click="move(-1)"
      >
        ‹
      </button>

      <div
        ref="scroller"
        class="template-carousel-scroll flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[calc(50%-150px)] pb-8 pt-2 sm:px-[calc(50%-185px)] lg:px-[calc(50%-210px)]"
        @scroll="onScroll"
      >
        <div
          v-for="template in templates"
          :key="template.key"
          :data-template-key="template.key"
          class="template-carousel-item shrink-0 snap-center"
        >
          <TemplatePreview
            :template="template"
            :active="activeKey === template.key"
            :selected="modelValue === template.key"
            :resume="resume"
            :sections="sections"
            :profile="profile"
            :user="user"
            :fallback="fallback"
            :scale="scale"
            :select-label="selectLabel"
            @select="choose(template)"
          />
        </div>
      </div>

      <button
        type="button"
        class="absolute right-1 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-blue-500 text-2xl font-light text-white shadow-[0_14px_35px_rgba(59,130,246,0.3)] transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
        :disabled="activeIndex === templates.length - 1"
        aria-label="Próximo template"
        @click="move(1)"
      >
        ›
      </button>
    </div>
  </section>
</template>

<style scoped>
.template-carousel-scroll {
  scrollbar-width: none;
  touch-action: pan-x;
}

.template-carousel-scroll::-webkit-scrollbar {
  display: none;
}

.template-carousel-item {
  width: 300px;
  content-visibility: auto;
  contain-intrinsic-size: 300px 460px;
}

@media (min-width: 640px) {
  .template-carousel-item {
    width: 370px;
  }
}

@media (min-width: 1024px) {
  .template-carousel-item {
    width: 420px;
  }
}
</style>
