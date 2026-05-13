<script setup lang="ts">
import type { ResumeTemplateData } from '../../types'
import ResumeSectionBarTitle from '../blocks/ResumeSectionBarTitle.vue'
import ResumeSkillBar from '../blocks/ResumeSkillBar.vue'
import ResumeTimelineEntry from '../blocks/ResumeTimelineEntry.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
}>()
</script>

<template>
  <article class="resume-a4 bg-white px-12 py-11 text-neutral-950 shadow-[0_24px_60px_rgb(23_23_23/0.08)]">
    <header class="border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-8 shadow-sm">
      <p class="text-[10px] font-black uppercase tracking-[0.5em]" :style="{ color: accent }">Executive Resume</p>
      <div class="mt-5 flex flex-wrap items-end justify-between gap-8">
        <div>
          <h1 class="font-serif text-[38px] uppercase leading-[1.1] tracking-[0.12em]">{{ data.name }}</h1>
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
      <aside class="space-y-8 border-r border-neutral-100 pr-6">
        <section>
          <ResumeSectionBarTitle :accent="accent">Competências</ResumeSectionBarTitle>
          <div class="mt-4 space-y-3">
            <ResumeSkillBar
              v-for="skill in data.skills"
              :key="skill.name"
              :name="skill.name"
              :accent="accent"
              :level="skill.level"
            />
          </div>
        </section>

        <section v-if="data.languages.length">
          <ResumeSectionBarTitle :accent="accent">Idiomas</ResumeSectionBarTitle>
          <p v-for="language in data.languages" :key="language.name" class="mt-2 text-[11px] text-neutral-600">
            {{ language.name }} · {{ language.level }}
          </p>
        </section>
      </aside>

      <main>
        <section>
          <ResumeSectionBarTitle :accent="accent">Perfil</ResumeSectionBarTitle>
          <p class="mt-3 text-[12px] leading-[1.65] text-neutral-600">{{ data.summary }}</p>
        </section>

        <section class="mt-8">
          <ResumeSectionBarTitle :accent="accent">Experiência</ResumeSectionBarTitle>
          <div class="mt-5 space-y-6">
            <ResumeTimelineEntry v-for="entry in data.experiences" :key="`${entry.title}-${entry.subtitle}`" :entry="entry" :accent="accent" />
          </div>
        </section>

        <section class="mt-8">
          <ResumeSectionBarTitle :accent="accent">Formação</ResumeSectionBarTitle>
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
}
</style>
