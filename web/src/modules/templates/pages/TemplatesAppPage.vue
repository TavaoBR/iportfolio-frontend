<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { FwbBadge } from 'flowbite-vue'
import UiButton from '@/components/ui/UiButton.vue'
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
    <section class="ip-card-strong p-5 xl:col-span-2">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.22em] text-[var(--ip-primary)]">Design do currículo</p>
          <h1 class="mt-2 text-3xl font-black tracking-tight text-slate-950">Templates</h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Gerencie os templates liberados na sua conta e desbloqueie novos visuais para currículos e portfólios.
          </p>
        </div>
        <RouterLink
          :to="{ name: 'templates-public' }"
          class="ip-button-secondary px-4 py-2.5 text-sm"
        >
          Ver catálogo público
        </RouterLink>
      </div>
    </section>

    <section class="ip-card p-5 xl:col-span-2">
      <p v-if="checkoutError" class="mb-3 rounded-3xl bg-amber-50 p-3 text-sm font-bold text-amber-700">
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

    <section class="ip-card p-5">
      <div class="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 class="text-base font-black text-slate-950">{{ selectedTemplate?.name }}</h2>
          <p class="mt-1 text-sm text-slate-500">{{ selectedTemplate?.description }}</p>
        </div>
        <FwbBadge v-if="selectedTemplate?.premium" type="dark" class="!px-2 !py-0.5 !text-[10px] !font-semibold">Premium</FwbBadge>
        <FwbBadge v-else type="green" class="!px-2 !py-0.5 !text-[10px] !font-semibold">Liberado</FwbBadge>
      </div>
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        {{ selectedTemplate?.family }} · {{ templates.length }} modelos oficiais
      </p>
      <UiButton
        v-if="selectedTemplate?.premium"
        class="mt-5 w-full"
        size="sm"
        color="blue"
        @click="unlock(selectedTemplate.key)"
      >
        Ver plano premium
      </UiButton>
      <RouterLink
        :to="{ name: 'resume-new', query: { template: selectedTemplateKey } }"
        class="ip-button-primary mt-4 block px-3 py-2 text-center text-xs font-semibold"
      >
        Criar currículo com este modelo
      </RouterLink>
    </section>
  </div>
</template>
