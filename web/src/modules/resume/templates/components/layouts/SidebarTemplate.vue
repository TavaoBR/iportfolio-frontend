<script setup lang="ts">
import type { ResumeTemplateData } from '../../types'

defineProps<{
  data: ResumeTemplateData
  accent: string
  compact?: boolean
}>()
</script>

<template>
  <article class="resume-a4 bg-white text-slate-950 shadow-2xl">
    <div class="flex min-h-full">
      <aside class="w-[31%] p-8 text-white" :style="{ backgroundColor: accent }">
        <div class="mx-auto mb-8 grid size-20 place-items-center rounded-full border border-white/25 bg-white/10 text-2xl font-semibold">
          {{ data.name.slice(0, 1) }}
        </div>

        <section class="space-y-3">
          <h3 class="section-title text-white/90">Contato</h3>
          <p class="break-words text-[11px] leading-5 text-white/78">{{ data.email }}</p>
          <p class="text-[11px] leading-5 text-white/78">{{ data.phone }}</p>
          <p class="text-[11px] leading-5 text-white/78">{{ data.location }}</p>
        </section>

        <section class="mt-9 space-y-3">
          <h3 class="section-title text-white/90">Competências</h3>
          <div class="space-y-2">
            <div v-for="skill in data.skills" :key="skill.name" class="rounded-md bg-white/10 px-3 py-2">
              <p class="text-[11px] font-semibold">{{ skill.name }}</p>
              <p v-if="skill.level" class="text-[9px] uppercase tracking-[0.18em] text-white/55">{{ skill.level }}</p>
            </div>
          </div>
        </section>

        <section v-if="data.languages.length" class="mt-9 space-y-3">
          <h3 class="section-title text-white/90">Idiomas</h3>
          <p v-for="language in data.languages" :key="language.name" class="text-[11px] text-white/75">
            {{ language.name }} <span v-if="language.level">· {{ language.level }}</span>
          </p>
        </section>
      </aside>

      <main class="flex-1 p-9">
        <header class="border-b border-slate-200 pb-6">
          <p class="text-[10px] font-bold uppercase tracking-[0.35em]" :style="{ color: accent }">
            Resume/CV
          </p>
          <h1 class="mt-2 text-[32px] font-light uppercase tracking-[0.18em]">{{ data.name }}</h1>
          <p class="mt-2 text-sm font-medium text-slate-500">{{ data.headline }}</p>
        </header>

        <section class="mt-7">
          <h2 class="section-title" :style="{ color: accent }">Perfil</h2>
          <p class="mt-3 text-[12px] leading-6 text-slate-600">{{ data.summary }}</p>
        </section>

        <section class="mt-7">
          <h2 class="section-title" :style="{ color: accent }">Experiência</h2>
          <div class="mt-4 space-y-5">
            <div v-for="entry in data.experiences" :key="`${entry.title}-${entry.subtitle}`">
              <div class="flex justify-between gap-4">
                <div>
                  <h3 class="text-sm font-bold text-slate-900">{{ entry.title }}</h3>
                  <p class="text-[11px] font-semibold text-slate-500">{{ entry.subtitle }}</p>
                </div>
                <p class="text-right text-[10px] text-slate-400">{{ entry.meta }}</p>
              </div>
              <p v-if="entry.description" class="mt-2 text-[11px] leading-5 text-slate-600">{{ entry.description }}</p>
            </div>
          </div>
        </section>

        <section class="mt-7 grid grid-cols-2 gap-6">
          <div>
            <h2 class="section-title" :style="{ color: accent }">Formação</h2>
            <div class="mt-3 space-y-3">
              <div v-for="entry in data.educations" :key="`${entry.title}-${entry.subtitle}`">
                <p class="text-[12px] font-bold">{{ entry.title }}</p>
                <p class="text-[10px] text-slate-500">{{ entry.subtitle }} · {{ entry.meta }}</p>
              </div>
            </div>
          </div>
          <div v-if="data.projects.length || data.certifications.length">
            <h2 class="section-title" :style="{ color: accent }">Destaques</h2>
            <p
              v-for="entry in [...data.projects, ...data.certifications].slice(0, 3)"
              :key="`${entry.title}-${entry.subtitle}`"
              class="mt-3 text-[11px] leading-5 text-slate-600"
            >
              <b>{{ entry.title }}</b> {{ entry.subtitle }}
            </p>
          </div>
        </section>
      </main>
    </div>
  </article>
</template>

<style scoped>
.resume-a4 {
  width: 794px;
  min-height: 1123px;
  transform-origin: top left;
}

.section-title {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
</style>
