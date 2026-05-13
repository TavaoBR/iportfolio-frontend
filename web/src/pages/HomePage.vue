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
  <section class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
    <div class="flex flex-col justify-center">
      <span class="mb-5 inline-flex w-fit rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--ip-primary)] shadow-sm">
        Construtor de currículo online
      </span>
      <h1 class="max-w-2xl text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
        Crie um currículo profissional com experiência de builder premium.
      </h1>
      <p class="mt-5 max-w-xl text-lg leading-8 text-slate-600">
        Preencha suas informações em etapas, escolha um design real de currículo e acompanhe o preview A4 enquanto constrói seu CV.
      </p>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <RouterLink
          :to="auth.isAuthenticated ? { name: 'resumes' } : { name: 'register' }"
          class="ip-button-primary px-6 py-3 text-sm"
        >
          Criar meu currículo
        </RouterLink>
        <RouterLink
          :to="{ name: 'templates-public' }"
          class="ip-button-secondary px-6 py-3 text-sm"
        >
          Ver templates
        </RouterLink>
      </div>

      <ul class="mt-8 space-y-3 text-sm text-slate-600">
        <li v-for="feature in features" :key="feature" class="flex gap-3">
          <span class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs text-teal-700">✓</span>
          <span>{{ feature }}</span>
        </li>
      </ul>
    </div>

    <div class="ip-card-strong p-4">
      <div class="flex items-center justify-between border-b border-slate-100 px-2 pb-4">
        <div>
          <p class="text-sm font-black text-slate-950">Construtor de currículo</p>
          <p class="text-xs text-slate-500">Fluxo guiado para criar, revisar e exportar</p>
        </div>
        <div class="hidden rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 sm:block">
          Search
        </div>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-[1fr_0.7fr]">
        <div class="space-y-4">
          <div class="grid gap-3 sm:grid-cols-3">
            <article
              v-for="metric in metrics"
              :key="metric.label"
              class="rounded-3xl border border-slate-100 bg-slate-50 p-4"
            >
              <p class="text-2xl font-black text-slate-950">{{ metric.value }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ metric.label }}</p>
              <div class="mt-3 h-2 rounded-full bg-slate-200">
                <div class="h-full w-2/3 rounded-full bg-[var(--ip-primary)]" />
              </div>
            </article>
          </div>

          <div class="rounded-3xl border border-slate-100 bg-white p-4">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h2 class="text-sm font-black text-slate-950">Criação em etapas</h2>
                <p class="text-xs text-slate-500">Tudo que um CV profissional precisa</p>
              </div>
              <span class="rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-bold">Novo CV</span>
            </div>
            <div class="mb-4 flex flex-wrap gap-2">
              <span
                v-for="step in steps"
                :key="step"
                class="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold text-white"
              >
                {{ step }}
              </span>
            </div>
            <div class="space-y-3">
              <div class="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                <p class="text-sm font-bold text-slate-950">Preencher informações profissionais</p>
                <p class="mt-1 text-xs text-slate-500">Perfil, resumo, experiências, formação e skills.</p>
              </div>
              <div class="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                <p class="text-sm font-bold text-slate-950">Escolher template de currículo</p>
                <p class="mt-1 text-xs text-slate-500">Aplicar visual profissional e revisar a versão final.</p>
              </div>
              <div class="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                <p class="text-sm font-bold text-slate-950">Exportar PDF e publicar portfólio</p>
                <p class="mt-1 text-xs text-slate-500">Gere o arquivo final e publique sua página profissional.</p>
              </div>
            </div>
          </div>
        </div>

        <aside class="space-y-4">
          <div class="rounded-3xl border border-slate-100 bg-white p-4">
            <h2 class="text-sm font-black text-slate-950">Templates por uso</h2>
            <div class="mt-4 flex h-40 items-center justify-center rounded-full bg-[conic-gradient(#2f9e97_0_42%,#ef704f_42%_67%,#e8c95a_67%_82%,#e5e7eb_82%_100%)]">
              <div class="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center text-sm font-black text-slate-950">
                100%<br />
                <span class="text-xs font-medium text-slate-500">perfil</span>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-slate-100 bg-white p-4">
            <h2 class="text-sm font-black text-slate-950">Status</h2>
            <div class="mt-4 space-y-3 text-sm">
              <p class="flex justify-between"><span class="text-slate-500">CV principal</span><b>80%</b></p>
              <p class="flex justify-between"><span class="text-slate-500">Portfólio</span><b>55%</b></p>
              <p class="flex justify-between"><span class="text-slate-500">Perfil público</span><b>70%</b></p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
