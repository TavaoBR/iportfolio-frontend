<script setup lang="ts">
import type { ResumeTemplateData } from '../../types'

defineProps<{
  data: ResumeTemplateData
  accent: string
}>()
</script>

<template>
  <article class="resume-a4 bg-white p-10 text-zinc-950 shadow-2xl">
    <header class="grid grid-cols-[150px_1fr] gap-7 border-b-4 pb-7" :style="{ borderColor: accent }">
      <div class="grid size-32 place-items-center border-4 text-4xl font-black" :style="{ borderColor: accent, color: accent }">
        {{ data.name.slice(0, 1) }}
      </div>
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.35em]" :style="{ color: accent }">Professional Resume</p>
        <h1 class="mt-2 text-[31px] font-black uppercase tracking-tight">{{ data.name }}</h1>
        <p class="mt-1 text-sm font-semibold text-zinc-500">{{ data.headline }}</p>
        <div class="mt-5 grid grid-cols-2 gap-2 text-[10px] text-zinc-500">
          <p>{{ data.email }}</p>
          <p>{{ data.phone }}</p>
          <p>{{ data.location }}</p>
          <p v-if="data.links[0]" class="truncate">{{ data.links[0] }}</p>
        </div>
      </div>
    </header>

    <section class="mt-7 grid grid-cols-[1fr_250px] gap-8">
      <main>
        <section>
          <h2 class="bar-title" :style="{ backgroundColor: accent }">Summary</h2>
          <p class="mt-3 text-[12px] leading-6 text-zinc-600">{{ data.summary }}</p>
        </section>

        <section class="mt-8">
          <h2 class="bar-title" :style="{ backgroundColor: accent }">Experience</h2>
          <div class="mt-4 space-y-5">
            <div v-for="entry in data.experiences" :key="`${entry.title}-${entry.subtitle}`" class="border-l-2 pl-4" :style="{ borderColor: accent }">
              <h3 class="text-sm font-black uppercase">{{ entry.title }}</h3>
              <p class="text-[11px] font-bold text-zinc-500">{{ entry.subtitle }} · {{ entry.meta }}</p>
              <p v-if="entry.description" class="mt-2 text-[11px] leading-5 text-zinc-600">{{ entry.description }}</p>
            </div>
          </div>
        </section>

        <section v-if="data.projects.length" class="mt-8">
          <h2 class="bar-title" :style="{ backgroundColor: accent }">Projects</h2>
          <div class="mt-4 space-y-4">
            <div v-for="entry in data.projects" :key="entry.title">
              <h3 class="text-[12px] font-black">{{ entry.title }}</h3>
              <p class="text-[11px] text-zinc-500">{{ entry.subtitle }}</p>
              <p v-if="entry.description" class="mt-1 text-[11px] leading-5 text-zinc-600">{{ entry.description }}</p>
            </div>
          </div>
        </section>
      </main>

      <aside class="space-y-7">
        <section>
          <h2 class="bar-title" :style="{ backgroundColor: accent }">Skills</h2>
          <div class="mt-3 space-y-2">
            <div v-for="skill in data.skills" :key="skill.name">
              <p class="text-[11px] font-bold">{{ skill.name }}</p>
              <div class="mt-1 h-1.5 bg-zinc-100">
                <div class="h-full w-3/4" :style="{ backgroundColor: accent }" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="bar-title" :style="{ backgroundColor: accent }">Education</h2>
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
  transform-origin: top left;
}

.bar-title {
  display: inline-flex;
  padding: 5px 12px;
  color: white;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
</style>
