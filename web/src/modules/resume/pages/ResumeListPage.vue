<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAsyncData } from '@/composables/useAsyncData'
import { listResumes } from '../services/resumesApi'
import type { ResumeSummary } from '../types/resume.types'
import { resumeTemplateRegistry } from '../templates/registry'

const { data, loading, error, run } = useAsyncData<ResumeSummary[]>()

onMounted(() => {
  void run(() => listResumes())
})
</script>

<template>
  <div class="space-y-5">
    <section class="ip-card-strong overflow-hidden p-6">
      <div class="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.22em] text-[var(--ip-primary)]">Currículos</p>
          <h1 class="mt-2 text-3xl font-black tracking-tight text-slate-950">Crie um CV com builder guiado</h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Escolha um design real, preencha os compartimentos do currículo e acompanhe o preview antes de exportar em PDF.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <RouterLink :to="{ name: 'resume-pick-template' }" class="ip-button-primary px-5 py-3 text-sm">
              Criar novo currículo
            </RouterLink>
            <RouterLink :to="{ name: 'templates-app' }" class="ip-button-secondary px-5 py-3 text-sm">
              Ver templates
            </RouterLink>
          </div>
        </div>
        <div class="rounded-[2rem] bg-[#eef4f8] p-4">
          <div class="grid grid-cols-3 gap-3">
            <img
              v-for="template in resumeTemplateRegistry.slice(0, 3)"
              :key="template.key"
              :src="template.previewImage"
              :alt="template.name"
              class="h-44 w-full rounded-2xl object-cover object-top shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="ip-card p-5">
      <div class="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-black text-slate-950">Meus currículos</h2>
          <p class="mt-1 text-sm text-slate-500">Edite, personalize e exporte seus CVs.</p>
        </div>
        <span class="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500">
          {{ data?.length ?? 0 }} itens
        </span>
      </div>

      <div v-if="loading" class="grid gap-3 md:grid-cols-2">
        <div v-for="n in 4" :key="n" class="h-32 animate-pulse rounded-3xl bg-slate-100" />
      </div>
      <p v-else-if="error" class="rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-600">
        {{ error }}
      </p>
      <div v-else-if="(data?.length ?? 0) > 0" class="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        <article
          v-for="r in data"
          :key="r.public_id"
          class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p class="font-black text-slate-950">{{ r.title ?? 'Sem título' }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ r.target_role ?? 'Cargo alvo não definido' }}</p>
          <div class="mt-4 flex items-center justify-between gap-3">
            <span class="truncate text-xs text-slate-400">{{ r.public_id }}</span>
            <RouterLink
              :to="{ name: 'resume-edit', params: { publicId: r.public_id } }"
              class="rounded-2xl bg-[var(--ip-primary)] px-3 py-2 text-xs font-black text-white transition hover:bg-blue-600"
            >
              Editar
            </RouterLink>
          </div>
        </article>
      </div>
      <p v-else class="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
        Nenhum currículo ainda. Crie o primeiro para começar a montar seu CV.
      </p>
    </section>
  </div>
</template>
