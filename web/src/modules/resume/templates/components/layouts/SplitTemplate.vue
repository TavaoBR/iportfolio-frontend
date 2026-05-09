<script setup lang="ts">
import type { ResumeTemplateData } from '../../types'

defineProps<{
  data: ResumeTemplateData
  accent: string
}>()
</script>

<template>
  <article class="resume-a4 bg-white text-slate-950 shadow-2xl">
    <header class="grid grid-cols-[42%_1fr]">
      <div class="px-10 py-12 text-white" :style="{ backgroundColor: accent }">
        <p class="text-[10px] uppercase tracking-[0.42em] text-white/60">Resume</p>
        <h1 class="mt-5 text-[36px] font-black uppercase leading-none">{{ data.name }}</h1>
        <p class="mt-4 text-[13px] text-white/80">{{ data.headline }}</p>
      </div>
      <div class="px-10 py-12">
        <h2 class="section-title" :style="{ color: accent }">Sobre</h2>
        <p class="mt-4 text-[12px] leading-6 text-slate-600">{{ data.summary }}</p>
      </div>
    </header>

    <div class="grid grid-cols-[42%_1fr]">
      <aside class="min-h-[780px] bg-slate-50 px-10 py-9">
        <section>
          <h2 class="section-title" :style="{ color: accent }">Contato</h2>
          <div class="mt-4 space-y-2 text-[11px] text-slate-600">
            <p>{{ data.email }}</p>
            <p>{{ data.phone }}</p>
            <p>{{ data.location }}</p>
            <p v-for="link in data.links.slice(0, 3)" :key="link" class="truncate">{{ link }}</p>
          </div>
        </section>

        <section class="mt-9">
          <h2 class="section-title" :style="{ color: accent }">Skills</h2>
          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="skill in data.skills" :key="skill.name" class="bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 shadow-sm">
              {{ skill.name }}
            </span>
          </div>
        </section>

        <section class="mt-9">
          <h2 class="section-title" :style="{ color: accent }">Formação</h2>
          <div class="mt-4 space-y-4">
            <div v-for="entry in data.educations" :key="`${entry.title}-${entry.subtitle}`">
              <p class="text-[12px] font-bold">{{ entry.title }}</p>
              <p class="text-[10px] text-slate-500">{{ entry.subtitle }}</p>
              <p class="text-[10px] text-slate-400">{{ entry.meta }}</p>
            </div>
          </div>
        </section>
      </aside>

      <main class="px-10 py-9">
        <section>
          <h2 class="section-title" :style="{ color: accent }">Experiência</h2>
          <div class="mt-5 space-y-6">
            <div v-for="entry in data.experiences" :key="`${entry.title}-${entry.subtitle}`">
              <p class="text-[10px] font-bold uppercase tracking-[0.18em]" :style="{ color: accent }">{{ entry.meta }}</p>
              <h3 class="mt-1 text-[16px] font-black">{{ entry.title }}</h3>
              <p class="text-[11px] font-semibold text-slate-500">{{ entry.subtitle }}</p>
              <p v-if="entry.description" class="mt-2 text-[11px] leading-5 text-slate-600">{{ entry.description }}</p>
            </div>
          </div>
        </section>

        <section v-if="data.projects.length || data.certifications.length" class="mt-9">
          <h2 class="section-title" :style="{ color: accent }">Projetos e certificações</h2>
          <div class="mt-4 grid gap-3">
            <div v-for="entry in [...data.projects, ...data.certifications].slice(0, 4)" :key="`${entry.title}-${entry.subtitle}`" class="border-l-4 pl-3" :style="{ borderColor: accent }">
              <p class="text-[12px] font-bold">{{ entry.title }}</p>
              <p class="text-[10px] text-slate-500">{{ entry.subtitle }}</p>
            </div>
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
  font-weight: 900;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}
</style>
