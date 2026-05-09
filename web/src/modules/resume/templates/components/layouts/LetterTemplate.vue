<script setup lang="ts">
import type { ResumeTemplateData } from '../../types'

defineProps<{
  data: ResumeTemplateData
  accent: string
}>()
</script>

<template>
  <article class="resume-a4 bg-[#fbfaf6] px-16 py-14 text-stone-950 shadow-2xl">
    <header class="text-center">
      <p class="text-[10px] uppercase tracking-[0.55em]" :style="{ color: accent }">Curriculum Vitae</p>
      <h1 class="mt-4 font-serif text-[34px] uppercase tracking-[0.22em]">{{ data.name }}</h1>
      <p class="mx-auto mt-3 max-w-[520px] text-[12px] leading-5 text-stone-500">
        {{ data.headline }} · {{ data.email }} · {{ data.phone }} · {{ data.location }}
      </p>
    </header>

    <section class="mt-11 border-y border-stone-300 py-6">
      <h2 class="section-title">Profile</h2>
      <p class="mt-3 text-[12px] leading-6 text-stone-650">{{ data.summary }}</p>
    </section>

    <section class="mt-9">
      <h2 class="section-title">Professional Experience</h2>
      <div class="mt-5 space-y-6">
        <div v-for="entry in data.experiences" :key="`${entry.title}-${entry.subtitle}`" class="grid grid-cols-[150px_1fr] gap-8">
          <p class="text-[10px] uppercase tracking-[0.18em] text-stone-400">{{ entry.meta }}</p>
          <div>
            <h3 class="font-serif text-[17px]">{{ entry.title }}</h3>
            <p class="mt-1 text-[11px] font-bold uppercase tracking-[0.16em]" :style="{ color: accent }">
              {{ entry.subtitle }}
            </p>
            <p v-if="entry.description" class="mt-2 text-[11px] leading-5 text-stone-600">{{ entry.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-10 grid grid-cols-2 gap-10">
      <div>
        <h2 class="section-title">Education</h2>
        <div class="mt-4 space-y-4">
          <div v-for="entry in data.educations" :key="`${entry.title}-${entry.subtitle}`">
            <h3 class="text-[12px] font-bold">{{ entry.title }}</h3>
            <p class="text-[10px] uppercase tracking-[0.16em] text-stone-500">{{ entry.subtitle }}</p>
            <p class="mt-1 text-[10px] text-stone-400">{{ entry.meta }}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 class="section-title">Skills</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="skill in data.skills"
            :key="skill.name"
            class="rounded-full border border-stone-300 px-3 py-1 text-[10px] text-stone-700"
          >
            {{ skill.name }}
          </span>
        </div>
      </div>
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
  font-weight: 800;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #292524;
}
</style>
