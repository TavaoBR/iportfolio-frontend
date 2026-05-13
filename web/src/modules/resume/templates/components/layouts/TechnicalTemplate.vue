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
  <article class="resume-a4 bg-white p-10 font-[var(--rt-font-body,ui-sans-serif)] text-zinc-950 shadow-[var(--rt-shadow-sheet,0_18px_48px_rgb(15_23_42/0.08))]">
    <header class="grid grid-cols-[150px_1fr] gap-7 border-b-4 pb-7" :style="{ borderColor: accent }">
      <div
        class="relative grid size-32 shrink-0 place-items-center overflow-hidden border-4 text-4xl font-black shadow-inner"
        :style="{ borderColor: accent, color: accent }"
      >
        <img
          v-if="data.photoUrl"
          :src="data.photoUrl"
          alt=""
          class="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <span v-else class="relative z-[1]">{{ data.name.slice(0, 1) }}</span>
      </div>
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.35em]" :style="{ color: accent }">Professional Resume</p>
        <h1 class="mt-2 text-[31px] font-black uppercase leading-[1.1] tracking-tight">{{ data.name }}</h1>
        <p class="mt-1 text-sm font-semibold text-zinc-500">{{ data.headline }}</p>
        <div class="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ResumeContactLine v-if="data.email" kind="email" :text="data.email" />
          <ResumeContactLine v-if="data.phone" kind="phone" :text="data.phone" />
          <ResumeContactLine v-if="data.location" kind="location" :text="data.location" />
          <ResumeContactLine v-if="data.links[0]" kind="link" :text="data.links[0]" />
        </div>
      </div>
    </header>

    <section class="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
      <main>
        <section>
          <ResumeSectionBarTitle :accent="accent">Summary</ResumeSectionBarTitle>
          <p class="mt-3 text-[12px] leading-[1.65] text-zinc-600">{{ data.summary }}</p>
        </section>

        <section class="mt-8">
          <ResumeSectionBarTitle :accent="accent">Experience</ResumeSectionBarTitle>
          <div class="mt-4 space-y-5">
            <ResumeTimelineEntry v-for="entry in data.experiences" :key="`${entry.title}-${entry.subtitle}`" :entry="entry" :accent="accent" />
          </div>
        </section>

        <section v-if="data.projects.length" class="mt-8">
          <ResumeSectionBarTitle :accent="accent">Projects</ResumeSectionBarTitle>
          <div class="mt-4 space-y-4">
            <div v-for="entry in data.projects" :key="entry.title">
              <h3 class="text-[12px] font-black">{{ entry.title }}</h3>
              <p class="text-[11px] text-zinc-500">{{ entry.subtitle }}</p>
              <p v-if="entry.description" class="mt-1 text-[11px] leading-5 text-zinc-600">{{ entry.description }}</p>
            </div>
          </div>
        </section>
      </main>

      <aside class="space-y-7 border-t border-zinc-100 pt-7 lg:border-t-0 lg:pt-0">
        <section>
          <ResumeSectionBarTitle :accent="accent">Skills</ResumeSectionBarTitle>
          <div class="mt-3 space-y-3">
            <ResumeSkillBar
              v-for="skill in data.skills"
              :key="skill.name"
              :name="skill.name"
              :accent="accent"
              :level="skill.level"
            />
          </div>
        </section>

        <section>
          <ResumeSectionBarTitle :accent="accent">Education</ResumeSectionBarTitle>
          <div class="mt-3 space-y-3">
            <div v-for="entry in data.educations" :key="`${entry.title}-${entry.subtitle}`">
              <p class="text-[11px] font-black">{{ entry.title }}</p>
              <p class="text-[10px] text-zinc-500">{{ entry.subtitle }}</p>
              <p class="text-[10px] text-zinc-400">{{ entry.meta }}</p>
            </div>
          </div>
        </section>
      </aside>
    </section>
  </article>
</template>

<style scoped>
.resume-a4 {
  width: 794px;
  min-height: 1123px;
}
</style>
