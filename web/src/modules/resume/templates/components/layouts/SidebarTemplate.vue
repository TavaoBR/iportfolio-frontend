<script setup lang="ts">
import type { ResumeTemplateData } from '../../types'
import ResumeContactLine from '../blocks/ResumeContactLine.vue'
import ResumeSectionBarTitle from '../blocks/ResumeSectionBarTitle.vue'
import ResumeSkillBar from '../blocks/ResumeSkillBar.vue'
import ResumeTimelineEntry from '../blocks/ResumeTimelineEntry.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
  compact?: boolean
}>()
</script>

<template>
  <article class="resume-a4 bg-white text-slate-950 shadow-[0_20px_50px_rgb(15_23_42/0.1)]">
    <div class="flex min-h-full">
      <aside class="w-[31%] p-8 text-white shadow-inner" :style="{ backgroundColor: accent }">
        <div
          class="relative mx-auto mb-8 grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-white/30 bg-white/10 text-2xl font-semibold shadow-sm backdrop-blur-[2px]"
        >
          <img
            v-if="data.photoUrl"
            :src="data.photoUrl"
            alt=""
            class="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="relative z-[1] text-white">{{ data.name.slice(0, 1) }}</span>
        </div>

        <section class="space-y-2">
          <h3 class="text-[10px] font-black uppercase tracking-[0.28em] text-white/90">Contato</h3>
          <div class="space-y-2 border-t border-white/15 pt-3">
            <ResumeContactLine v-if="data.email" variant="inverse" kind="email" :text="data.email" />
            <ResumeContactLine v-if="data.phone" variant="inverse" kind="phone" :text="data.phone" />
            <ResumeContactLine v-if="data.location" variant="inverse" kind="location" :text="data.location" />
          </div>
        </section>

        <section class="mt-9 space-y-3">
          <h3 class="text-[10px] font-black uppercase tracking-[0.28em] text-white/90">Competências</h3>
          <div class="space-y-3 border-t border-white/15 pt-3">
            <ResumeSkillBar
              v-for="skill in data.skills"
              :key="skill.name"
              dark
              :name="skill.name"
              :accent="accent"
              :level="skill.level"
            />
          </div>
        </section>

        <section v-if="data.languages.length" class="mt-9 space-y-3">
          <h3 class="text-[10px] font-black uppercase tracking-[0.28em] text-white/90">Idiomas</h3>
          <div class="space-y-2 border-t border-white/15 pt-3">
            <p v-for="language in data.languages" :key="language.name" class="text-[11px] text-white/80">
              {{ language.name }} <span v-if="language.level" class="text-white/55">· {{ language.level }}</span>
            </p>
          </div>
        </section>
      </aside>

      <main class="flex-1 p-9">
        <header class="border-b border-slate-200 pb-6">
          <p class="text-[10px] font-bold uppercase tracking-[0.35em]" :style="{ color: accent }">Resume/CV</p>
          <h1 class="mt-2 text-[32px] font-light uppercase tracking-[0.18em] text-slate-900">{{ data.name }}</h1>
          <p class="mt-2 text-sm font-medium text-slate-500">{{ data.headline }}</p>
        </header>

        <section class="mt-7">
          <ResumeSectionBarTitle :accent="accent">Perfil</ResumeSectionBarTitle>
          <p class="mt-3 text-[12px] leading-[1.65] text-slate-600">{{ data.summary }}</p>
        </section>

        <section class="mt-7">
          <ResumeSectionBarTitle :accent="accent">Experiência</ResumeSectionBarTitle>
          <div class="mt-4 space-y-5">
            <ResumeTimelineEntry v-for="entry in data.experiences" :key="`${entry.title}-${entry.subtitle}`" :entry="entry" :accent="accent" />
          </div>
        </section>

        <section class="mt-7 grid grid-cols-2 gap-6">
          <div>
            <ResumeSectionBarTitle :accent="accent">Formação</ResumeSectionBarTitle>
            <div class="mt-3 space-y-3">
              <div v-for="entry in data.educations" :key="`${entry.title}-${entry.subtitle}`">
                <p class="text-[12px] font-bold">{{ entry.title }}</p>
                <p class="text-[10px] text-slate-500">{{ entry.subtitle }} · {{ entry.meta }}</p>
              </div>
            </div>
          </div>
          <div v-if="data.projects.length || data.certifications.length">
            <ResumeSectionBarTitle :accent="accent">Destaques</ResumeSectionBarTitle>
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
}
</style>
