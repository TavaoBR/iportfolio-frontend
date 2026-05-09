<script setup lang="ts">
import type { ResumeTemplateData } from '../../types'

defineProps<{
  data: ResumeTemplateData
  accent: string
}>()
</script>

<template>
  <article class="resume-a4 bg-white px-14 py-12 text-neutral-950 shadow-2xl">
    <header class="border border-neutral-200 p-8">
      <p class="text-[10px] font-black uppercase tracking-[0.5em]" :style="{ color: accent }">Executive Resume</p>
      <div class="mt-5 flex items-end justify-between gap-8">
        <div>
          <h1 class="font-serif text-[38px] uppercase tracking-[0.12em]">{{ data.name }}</h1>
          <p class="mt-2 text-sm text-neutral-500">{{ data.headline }}</p>
        </div>
        <div class="text-right text-[10px] leading-5 text-neutral-500">
          <p>{{ data.email }}</p>
          <p>{{ data.phone }}</p>
          <p>{{ data.location }}</p>
        </div>
      </div>
    </header>

    <section class="mt-8 grid grid-cols-[190px_1fr] gap-9">
      <aside class="space-y-8">
        <section>
          <h2 class="section-title" :style="{ color: accent }">Competências</h2>
          <div class="mt-4 space-y-2">
            <p v-for="skill in data.skills" :key="skill.name" class="border-b border-neutral-200 pb-2 text-[11px] font-semibold">
              {{ skill.name }}
            </p>
          </div>
        </section>

        <section v-if="data.languages.length">
          <h2 class="section-title" :style="{ color: accent }">Idiomas</h2>
          <p v-for="language in data.languages" :key="language.name" class="mt-2 text-[11px] text-neutral-600">
            {{ language.name }} · {{ language.level }}
          </p>
        </section>
      </aside>

      <main>
        <section>
          <h2 class="section-title" :style="{ color: accent }">Perfil</h2>
          <p class="mt-3 text-[12px] leading-6 text-neutral-600">{{ data.summary }}</p>
        </section>

        <section class="mt-8">
          <h2 class="section-title" :style="{ color: accent }">Experiência</h2>
          <div class="mt-5 space-y-6">
            <div v-for="entry in data.experiences" :key="`${entry.title}-${entry.subtitle}`">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="font-serif text-[17px]">{{ entry.title }}</h3>
                  <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">{{ entry.subtitle }}</p>
                </div>
                <p class="text-right text-[10px] text-neutral-400">{{ entry.meta }}</p>
              </div>
              <p v-if="entry.description" class="mt-2 text-[11px] leading-5 text-neutral-600">{{ entry.description }}</p>
            </div>
          </div>
        </section>

        <section class="mt-8">
          <h2 class="section-title" :style="{ color: accent }">Formação</h2>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div v-for="entry in data.educations" :key="`${entry.title}-${entry.subtitle}`">
              <p class="text-[12px] font-bold">{{ entry.title }}</p>
              <p class="text-[10px] text-neutral-500">{{ entry.subtitle }}</p>
              <p class="text-[10px] text-neutral-400">{{ entry.meta }}</p>
            </div>
          </div>
        </section>
      </main>
    </section>
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
  letter-spacing: 0.28em;
  text-transform: uppercase;
}
</style>
