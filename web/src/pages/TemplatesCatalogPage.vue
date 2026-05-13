<script setup lang="ts">
import { computed, ref } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import { useAuthStore } from '@/modules/auth/stores/useAuthStore'
import { resumeTemplateRegistry } from '@/modules/resume/templates/registry'
import TemplateCarousel from '@/modules/resume/templates/components/TemplateCarousel.vue'

const auth = useAuthStore()
const templates = computed(() => resumeTemplateRegistry)
const selectedTemplateKey = ref(resumeTemplateRegistry[0]?.key ?? '')
</script>

<template>
  <div class="px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto mb-8 max-w-5xl text-center">
      <p class="text-xs font-black uppercase tracking-[0.26em] text-blue-500">Templates profissionais</p>
      <h1 class="mt-3 text-3xl font-black tracking-tight text-slate-950">
        Escolha um modelo de currículo pronto para se destacar
      </h1>
      <p class="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        Visualize os modelos em proporção A4, navegue como em um builder premium e comece pelo template que combina com sua carreira.
      </p>
    </div>

    <div
      v-if="!auth.isAuthenticated"
      class="mx-auto mb-8 flex max-w-5xl flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm text-slate-600">
        Conta necessária para aplicar templates aos CVs e desbloquear premium.
      </p>
      <div class="flex flex-shrink-0 flex-wrap gap-2">
        <UiButton :to="{ name: 'register' }" color="blue" size="sm">Registar</UiButton>
        <UiButton :to="{ name: 'login' }" color="alternative" outline size="sm">Entrar</UiButton>
      </div>
    </div>

    <TemplateCarousel
      v-model="selectedTemplateKey"
      :templates="templates"
      title="Modelos prontos para uso que ajudarão seu currículo a se destacar para recrutadores"
      description="Previews reais, navegação fluida e templates parcialmente visíveis nas laterais."
      select-label="Selecionar"
      :scale="0.35"
    />

    <div class="mt-8 text-center">
      <UiButton
        :to="auth.isAuthenticated ? { name: 'resume-pick-template' } : { name: 'login' }"
        color="blue"
        class="!rounded-xl !px-6 !py-3 !font-bold"
      >
        {{ auth.isAuthenticated ? 'Usar no construtor' : 'Entrar para usar' }}
      </UiButton>
    </div>
  </div>
</template>
