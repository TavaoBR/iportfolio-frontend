<script setup lang="ts">
import type { ResumeTemplateData } from '../../types'
import ResumeContactLine from '../blocks/ResumeContactLine.vue'
import ResumeSkillBar from '../blocks/ResumeSkillBar.vue'

defineProps<{
  data: ResumeTemplateData
  accent: string
}>()
</script>

<template>
  <article
    class="resume-a4 flex min-h-[1123px] flex-col bg-[#fdfbf7] px-12 pb-10 pt-11 font-serif text-stone-950 shadow-[0_22px_55px_rgb(28_25_23/0.07)]"
  >
    <header class="text-center">
      <p class="font-sans text-[10px] font-semibold uppercase tracking-[0.5em]" :style="{ color: accent }">
        Curriculum vitae
      </p>
      <h1 class="mt-3 text-[32px] font-normal uppercase leading-[1.12] tracking-[0.14em] text-stone-950">
        {{ data.name }}
      </h1>
      <p class="mx-auto mt-3 max-w-[32rem] font-sans text-[12.5px] font-medium leading-relaxed text-stone-600">
        {{ data.headline }}
      </p>
      <div
        class="mx-auto mt-6 flex max-w-3xl flex-wrap items-start justify-center gap-x-10 gap-y-3 border-b border-stone-200/90 pb-7 font-sans"
      >
        <ResumeContactLine v-if="data.email" variant="warm" size="md" kind="email" :text="data.email" />
        <ResumeContactLine v-if="data.phone" variant="warm" size="md" kind="phone" :text="data.phone" />
        <ResumeContactLine v-if="data.location" variant="warm" size="md" kind="location" :text="data.location" />
      </div>
    </header>

    <section class="mt-8">
      <h2 class="section-title font-sans">
        <span class="section-title__rule" :style="{ backgroundColor: accent }" aria-hidden="true" />
        Perfil
      </h2>
      <p class="mt-3.5 font-sans text-[12px] leading-[1.72] text-stone-600">{{ data.summary }}</p>
    </section>

    <section class="mt-9">
      <h2 class="section-title font-sans">
        <span class="section-title__rule" :style="{ backgroundColor: accent }" aria-hidden="true" />
        Experiência profissional
      </h2>
      <div class="mt-5 space-y-7">
        <div
          v-for="entry in data.experiences"
          :key="`${entry.title}-${entry.subtitle}`"
          class="grid grid-cols-[148px_minmax(0,1fr)] gap-x-8 gap-y-0 border-b border-stone-200/70 pb-7 last:border-b-0 last:pb-0"
        >
          <p class="font-sans text-[10px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-stone-500">
            {{ entry.meta }}
          </p>
          <div>
            <h3 class="text-[17px] font-normal leading-snug tracking-wide text-stone-900">{{ entry.title }}</h3>
            <p
              class="mt-1.5 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em]"
              :style="{ color: accent }"
            >
              {{ entry.subtitle }}
            </p>
            <p v-if="entry.description" class="mt-2.5 font-sans text-[11px] leading-[1.65] text-stone-600">
              {{ entry.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Distribui espaço vertical quando há pouco conteúdo (folha A4 equilibrada) -->
    <div class="min-h-4 flex-1" aria-hidden="true" />

    <section class="mt-2">
      <div class="grid grid-cols-2 gap-x-12">
        <h2 class="section-title font-sans">
          <span class="section-title__rule" :style="{ backgroundColor: accent }" aria-hidden="true" />
          Formação
        </h2>
        <h2 class="section-title font-sans">
          <span class="section-title__rule" :style="{ backgroundColor: accent }" aria-hidden="true" />
          Competências
        </h2>
      </div>
      <div class="mt-5 grid grid-cols-2 gap-x-12 items-start">
        <div class="space-y-6">
          <div
            v-for="entry in data.educations"
            :key="`${entry.title}-${entry.subtitle}`"
            class="grid grid-cols-[148px_minmax(0,1fr)] gap-x-6 border-b border-stone-200/60 pb-6 last:border-b-0 last:pb-0"
          >
            <p class="font-sans text-[10px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-stone-500">
              {{ entry.meta }}
            </p>
            <div>
              <h3 class="text-[14px] font-semibold leading-snug text-stone-900">{{ entry.title }}</h3>
              <p class="mt-1 font-sans text-[10.5px] font-bold uppercase tracking-[0.18em]" :style="{ color: accent }">
                {{ entry.subtitle }}
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-3.5">
          <ResumeSkillBar
            v-for="skill in data.skills"
            :key="skill.name"
            tone="warm"
            :name="skill.name"
            :accent="accent"
            :level="skill.level"
          />
        </div>
      </div>
    </section>

    <footer class="mt-auto pt-8 text-center">
      <div class="mx-auto h-px max-w-xs bg-gradient-to-r from-transparent via-stone-300 to-transparent" aria-hidden="true" />
    </footer>
  </article>
</template>

<style scoped>
.resume-a4 {
  width: 794px;
  min-height: 1123px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: #1c1917;
}

.section-title__rule {
  display: block;
  width: 3px;
  height: 0.7rem;
  flex-shrink: 0;
  border-radius: 9999px;
  opacity: 0.92;
}
</style>
