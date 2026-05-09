<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { FwbBadge, FwbButton } from 'flowbite-vue'
import { useTemplateCheckout } from '@/modules/billing/composables/useTemplateCheckout'
import { ApiError } from '@/types/api'
import { resumeTemplateRegistry } from '@/modules/resume/templates/registry'
import TemplateCarousel from '@/modules/resume/templates/components/TemplateCarousel.vue'

const checkout = useTemplateCheckout()
const checkoutError = ref('')
const templates = resumeTemplateRegistry
const selectedTemplateKey = ref(resumeTemplateRegistry[0]?.key ?? '')
const selectedTemplate = computed(() =>
  templates.find((template) => template.key === selectedTemplateKey.value) ?? templates[0],
)

async function unlock(key: string) {
  checkoutError.value = ''
  try {
    await checkout.start(key)
  } catch (e) {
    checkoutError.value =
      e instanceof ApiError ? e.message : 'Falha ao iniciar checkout. Verifique a API.'
  }
}
</script>

<template>
  <div class="grid w-full gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] xl:col-span-2">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black tracking-tight text-white">Templates</h1>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Gerencie os templates liberados na sua conta e desbloqueie novos visuais para currículos e portfólios.
          </p>
        </div>
        <RouterLink
          :to="{ name: 'templates-public' }"
          class="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500"
        >
          Ver catálogo público
        </RouterLink>
      </div>
      <RouterLink
        :to="{ name: 'templates-public' }"
        class="mt-4 inline-block text-sm font-semibold text-violet-300 hover:underline"
      >
        Ver catálogo público →
      </RouterLink>
    </section>

    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] xl:col-span-2">
      <p v-if="checkoutError" class="mb-3 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-200">
        {{ checkoutError }}
      </p>
      <TemplateCarousel
        v-model="selectedTemplateKey"
        :templates="templates"
        title="Modelos prontos para uso que ajudarão seu currículo a se destacar para recrutadores"
        description="Escolha o template ativo e visualize o currículo como uma página real, com navegação fluida e responsiva."
        select-label="Usar este modelo"
        :scale="0.35"
      />
    </section>

    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div class="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 class="text-base font-black text-white">{{ selectedTemplate?.name }}</h2>
          <p class="mt-1 text-sm text-gray-500">{{ selectedTemplate?.description }}</p>
        </div>
        <FwbBadge v-if="selectedTemplate?.premium" type="dark">Premium</FwbBadge>
        <FwbBadge v-else type="green">Liberado</FwbBadge>
      </div>
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
        {{ selectedTemplate?.family }} · {{ templates.length }} modelos oficiais
      </p>
      <FwbButton
        v-if="selectedTemplate?.premium"
        class="mt-5 w-full"
        size="sm"
        color="blue"
        @click="unlock(selectedTemplate.key)"
      >
        Ver plano premium
      </FwbButton>
      <RouterLink
        :to="{ name: 'resumes' }"
        class="mt-4 block rounded-xl bg-violet-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-violet-500"
      >
        Criar currículo com este modelo
      </RouterLink>
    </section>
  </div>
</template>
