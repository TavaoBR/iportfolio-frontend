<script setup lang="ts">
import type { ResumeTemplateData } from '../../types'
import ResumeContactLine from '../blocks/ResumeContactLine.vue'
import ResumeSectionBarTitle from '../blocks/ResumeSectionBarTitle.vue'
import ResumeSkillBar from '../blocks/ResumeSkillBar.vue'
import ResumeTimelineEntry from '../blocks/ResumeTimelineEntry.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
}>()
</script>

<template>
  <article class="resume-a4 bg-white text-slate-950 shadow-[0_22px_55px_rgb(15_23_42/0.1)]">
    <header class="grid grid-cols-[42%_1fr]">
      <div class="px-10 py-12 text-white shadow-inner" :style="{ backgroundColor: accent }">
        <p class="text-[10px] uppercase tracking-[0.42em] text-white/60">Resume</p>
        <h1 class="mt-5 text-[36px] font-black uppercase leading-none tracking-tight">{{ data.name }}</h1>
        <p class="mt-4 text-[13px] leading-snug text-white/85">{{ data.headline }}</p>
      </div>
      <div class="px-10 py-12">
        <ResumeSectionBarTitle :accent="accent">Sobre</ResumeSectionBarTitle>
        <p class="mt-4 text-[12px] leading-[1.65] text-slate-600">{{ data.summary }}</p>
      </div>
    </header>

    <div class="grid grid-cols-[42%_1fr]">
      <aside class="min-h-[780px] border-r border-slate-100 bg-slate-50 px-10 py-9">
        <section>
          <ResumeSectionBarTitle :accent="accent">Contato</ResumeSectionBarTitle>
          <div class="mt-4 space-y-2">
            <ResumeContactLine v-if="data.email" kind="email" :text="data.email" />
            <ResumeContactLine v-if="data.phone" kind="phone" :text="data.phone" />
            <ResumeContactLine v-if="data.location" kind="location" :text="data.location" />
            <ResumeContactLine v-for="link in data.links.slice(0, 3)" :key="link" kind="link" :text="link" />
          </div>
        </section>

        <section class="mt-9">
          <ResumeSectionBarTitle :accent="accent">Skills</ResumeSectionBarTitle>
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

        <section class="mt-9">
          <ResumeSectionBarTitle :accent="accent">Formação</ResumeSectionBarTitle>
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
          <ResumeSectionBarTitle :accent="accent">Experiência</ResumeSectionBarTitle>
          <div class="mt-5 space-y-6">
            <ResumeTimelineEntry v-for="entry in data.experiences" :key="`${entry.title}-${entry.subtitle}`" :entry="entry" :accent="accent" />
          </div>
        </section>

        <section v-if="data.projects.length || data.certifications.length" class="mt-9">
          <ResumeSectionBarTitle :accent="accent">Projetos e certificações</ResumeSectionBarTitle>
          <div class="mt-4 grid gap-3">
            <div
              v-for="entry in [...data.projects, ...data.certifications].slice(0, 4)"
              :key="`${entry.title}-${entry.subtitle}`"
              class="border-l-4 pl-3"
              :style="{ borderColor: accent }"
            >
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
}
</style>
