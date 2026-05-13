<script setup lang="ts">
import { computed } from 'vue'
import type { ResumeTemplateData } from '../../../types'
import ResumeContactLine from '../../blocks/ResumeContactLine.vue'
import EmeraldRectSkillBar from './EmeraldRectSkillBar.vue'
import '@/modelos/resume/tecnico/emerald-technical/styles'

const props = withDefaults(
  defineProps<{
    data: ResumeTemplateData
    accent?: string
  }>(),
  { accent: '#66E9C1' },
)

const accentVar = computed(() => props.accent || '#66E9C1')

const nameParts = computed(() => {
  const raw = props.data.name.trim()
  if (!raw) return { circle: '?', headlineName: 'YOUR NAME', single: true }
  const parts = raw.split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    return {
      circle: parts[0].slice(0, 1).toUpperCase(),
      headlineName: parts[0].toUpperCase(),
      single: true,
    }
  }
  return {
    circle: parts[0],
    headlineName: parts.slice(1).join(' ').toUpperCase(),
    single: false,
  }
})
</script>

<template>
  <article
    class="resume-template-emerald resume-a4 bg-white px-9 py-8 text-[var(--em-text)] shadow-[0_18px_48px_rgb(15_23_42/0.06)]"
    :style="{ '--em-accent': accentVar } as Record<string, string>"
  >
    <!-- Header -->
    <header class="border-b border-neutral-200 pb-5">
      <div class="relative grid grid-cols-[100px_minmax(0,1fr)_108px] items-start gap-x-4 gap-y-3">
        <div
          class="grid size-[100px] shrink-0 place-items-center rounded-full bg-[var(--em-accent)] text-[15px] font-medium leading-tight text-[var(--em-text)]"
        >
          {{ nameParts.circle }}
        </div>

        <div class="min-w-0 pt-0.5">
          <p class="text-[10px] font-bold uppercase tracking-[0.38em] text-[var(--em-accent)]">Resume</p>
          <h1 class="mt-1.5 text-[26px] font-black uppercase leading-[1.05] tracking-[0.04em] text-[var(--em-text)]">
            {{ nameParts.headlineName }}
          </h1>
          <p class="mt-2 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--em-text)]">
            {{ data.headline }}
          </p>
          <div class="mt-3 h-2 max-w-[min(100%,22rem)] bg-[var(--em-accent)]" aria-hidden="true" />
        </div>

        <div class="relative h-[120px] w-full min-w-[88px]">
          <img
            v-if="data.photoUrl"
            :src="data.photoUrl"
            alt=""
            class="absolute right-0 top-0 z-10 h-[124px] w-[86px] border-2 border-[var(--em-photo-border)] object-cover shadow-sm"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div
        class="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-neutral-100 pt-3.5 text-[11px] text-[var(--em-muted)]"
      >
        <ResumeContactLine v-if="data.phone" kind="phone" :text="data.phone" />
        <ResumeContactLine v-if="data.email" kind="email" :text="data.email" />
        <ResumeContactLine v-if="data.location" kind="location" :text="data.location" />
        <ResumeContactLine v-for="(link, li) in data.links.slice(0, 1)" :key="li" kind="link" :text="link" />
      </div>
    </header>

    <!-- About Me -->
    <section class="mt-6">
      <h2 class="text-[12px] font-black uppercase tracking-[0.12em] text-[var(--em-text)]">About Me</h2>
      <div class="mt-2 h-px w-full bg-[var(--em-border)]" />
      <p class="mt-3 text-[11px] leading-[1.72] text-[var(--em-muted)]">{{ data.summary }}</p>
    </section>

    <!-- Education | Skills -->
    <section
      class="mt-7 grid gap-8 border-b border-neutral-200 pb-7 [grid-template-columns:minmax(0,1.75fr)_minmax(0,1fr)]"
    >
      <div class="min-w-0">
        <h2 class="text-[12px] font-black uppercase tracking-[0.12em] text-[var(--em-text)]">Education</h2>
        <div class="mt-2 h-px w-full bg-[var(--em-border)]" />
        <div class="mt-4 space-y-4">
          <div
            v-for="entry in data.educations"
            :key="`${entry.title}-${entry.subtitle}`"
            class="grid gap-3 border-b border-neutral-100 pb-4 last:border-b-0 [grid-template-columns:minmax(0,38%)_1fr]"
          >
            <div class="border-r border-neutral-200 pr-4">
              <p class="text-[11px] font-bold leading-snug text-[var(--em-text)]">{{ entry.title }}</p>
              <p v-if="entry.meta" class="mt-1 text-[10px] font-medium text-[var(--em-soft)]">{{ entry.meta }}</p>
              <p v-if="entry.subtitle" class="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--em-muted)]">
                {{ entry.subtitle }}
              </p>
            </div>
            <p class="text-[10px] leading-[1.65] text-[var(--em-soft)]">{{ entry.description }}</p>
          </div>
        </div>
      </div>

      <div class="min-w-0">
        <h2 class="text-[12px] font-black uppercase tracking-[0.12em] text-[var(--em-text)]">Skills</h2>
        <div class="mt-2 h-px w-full bg-[var(--em-border)]" />
        <div class="mt-4 space-y-3.5">
          <EmeraldRectSkillBar v-for="skill in data.skills" :key="skill.name" :name="skill.name" :level="skill.level" />
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section class="mt-7">
      <h2 class="text-[12px] font-black uppercase tracking-[0.12em] text-[var(--em-text)]">Experience</h2>
      <div class="relative mt-2 h-px w-full bg-[var(--em-border)]">
        <div class="absolute left-0 top-0 h-[3px] w-[5%] max-w-[52px] bg-[var(--em-border)]" aria-hidden="true" />
      </div>
      <div class="mt-5 grid grid-cols-2 gap-x-8 gap-y-6">
        <div v-for="(entry, idx) in data.experiences" :key="`${entry.title}-${idx}`" class="min-w-0">
          <h3 class="text-[11.5px] font-black uppercase leading-snug tracking-wide text-[var(--em-text)]">
            {{ entry.title }}
          </h3>
          <p class="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--em-soft)]">
            <span v-if="entry.subtitle">{{ entry.subtitle }}</span>
            <span v-if="entry.subtitle && entry.meta"> | </span>
            <span v-if="entry.meta">{{ entry.meta }}</span>
          </p>
          <p v-if="entry.description" class="mt-2 text-[10px] leading-[1.65] text-[var(--em-muted)]">{{ entry.description }}</p>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.resume-a4 {
  width: 794px;
  min-height: 1123px;
  box-sizing: border-box;
}
</style>
