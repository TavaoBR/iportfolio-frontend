<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/useAuthStore'

const auth = useAuthStore()

const metrics = [
  { label: 'Currículos criados hoje', value: '1.434' },
  { label: 'Templates profissionais', value: '36+' },
  { label: 'Etapas guiadas', value: '5' },
]

const features = [
  'Crie um currículo profissional com dados, secções e modelo visual em um só fluxo.',
  'Reutilize experiências, skills, projetos e certificações em múltiplos CVs.',
  'Exporte PDF, publique portfólio e mantenha sua identidade profissional organizada.',
]

const steps = ['Dados', 'Experiência', 'Skills', 'Template', 'PDF']
</script>

<template>
  <section class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-16">
    <div class="flex flex-col justify-center">
      <span class="mb-5 inline-flex w-fit rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
        Construtor de currículo online
      </span>
      <h1 class="max-w-2xl text-4xl font-black tracking-[-0.05em] text-gray-950 sm:text-5xl lg:text-6xl">
        Crie um currículo profissional em poucos minutos.
      </h1>
      <p class="mt-5 max-w-xl text-lg leading-8 text-gray-600">
        O iPortfolio funciona como um construtor completo: você preenche suas informações, escolhe um modelo aprovado para recrutadores e gera um CV pronto para enviar.
      </p>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <RouterLink
          :to="auth.isAuthenticated ? { name: 'resumes' } : { name: 'register' }"
          class="inline-flex items-center justify-center rounded-2xl bg-gray-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
        >
          Criar meu currículo
        </RouterLink>
        <RouterLink
          :to="{ name: 'templates-public' }"
          class="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-950 transition hover:border-gray-300"
        >
          Ver templates
        </RouterLink>
      </div>

      <ul class="mt-8 space-y-3 text-sm text-gray-600">
        <li v-for="feature in features" :key="feature" class="flex gap-3">
          <span class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700">✓</span>
          <span>{{ feature }}</span>
        </li>
      </ul>
    </div>

    <div class="rounded-[28px] border border-gray-200 bg-white p-4 shadow-xl shadow-gray-200/70">
      <div class="flex items-center justify-between border-b border-gray-100 px-2 pb-4">
        <div>
          <p class="text-sm font-black text-gray-950">Construtor de currículo</p>
          <p class="text-xs text-gray-500">Fluxo guiado para criar, revisar e exportar</p>
        </div>
        <div class="hidden rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-500 sm:block">
          Search
        </div>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-[1fr_0.7fr]">
        <div class="space-y-4">
          <div class="grid gap-3 sm:grid-cols-3">
            <article
              v-for="metric in metrics"
              :key="metric.label"
              class="rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <p class="text-2xl font-black text-gray-950">{{ metric.value }}</p>
              <p class="mt-1 text-xs text-gray-500">{{ metric.label }}</p>
              <div class="mt-3 h-2 rounded-full bg-gray-200">
                <div class="h-full w-2/3 rounded-full bg-teal-600" />
              </div>
            </article>
          </div>

          <div class="rounded-2xl border border-gray-100 p-4">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h2 class="text-sm font-black text-gray-950">Criação em etapas</h2>
                <p class="text-xs text-gray-500">Tudo que um CV profissional precisa</p>
              </div>
              <span class="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold">Novo CV</span>
            </div>
            <div class="mb-4 flex flex-wrap gap-2">
              <span
                v-for="step in steps"
                :key="step"
                class="rounded-full bg-gray-950 px-3 py-1 text-[11px] font-bold text-white"
              >
                {{ step }}
              </span>
            </div>
            <div class="space-y-3">
              <div class="rounded-xl border border-gray-100 p-3">
                <p class="text-sm font-bold text-gray-950">Preencher informações profissionais</p>
                <p class="mt-1 text-xs text-gray-500">Perfil, resumo, experiências, formação e skills.</p>
              </div>
              <div class="rounded-xl border border-gray-100 p-3">
                <p class="text-sm font-bold text-gray-950">Escolher template de currículo</p>
                <p class="mt-1 text-xs text-gray-500">Aplicar visual profissional e revisar a versão final.</p>
              </div>
              <div class="rounded-xl border border-gray-100 p-3">
                <p class="text-sm font-bold text-gray-950">Exportar PDF e publicar portfólio</p>
                <p class="mt-1 text-xs text-gray-500">Gere o arquivo final e publique sua página profissional.</p>
              </div>
            </div>
          </div>
        </div>

        <aside class="space-y-4">
          <div class="rounded-2xl border border-gray-100 p-4">
            <h2 class="text-sm font-black text-gray-950">Templates por uso</h2>
            <div class="mt-4 flex h-40 items-center justify-center rounded-full bg-[conic-gradient(#2f9e97_0_42%,#ef704f_42%_67%,#e8c95a_67%_82%,#e5e7eb_82%_100%)]">
              <div class="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center text-sm font-black text-gray-950">
                100%<br />
                <span class="text-xs font-medium text-gray-500">perfil</span>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-100 p-4">
            <h2 class="text-sm font-black text-gray-950">Status</h2>
            <div class="mt-4 space-y-3 text-sm">
              <p class="flex justify-between"><span class="text-gray-500">CV principal</span><b>80%</b></p>
              <p class="flex justify-between"><span class="text-gray-500">Portfólio</span><b>55%</b></p>
              <p class="flex justify-between"><span class="text-gray-500">Perfil público</span><b>70%</b></p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
