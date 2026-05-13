import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '../src/modelos/resume')

const entries = [
  ['editorial/editorial-letter', 'EditorialLetterTemplate'],
  ['minimalista/minimal-letter', 'MinimalLetterTemplate'],
  ['moderno/teal-sidebar', 'TealSidebarTemplate'],
  ['tecnico/structured-professional', 'StructuredProfessionalTemplate'],
  ['tecnico/technical-modern', 'TechnicalModernTemplate'],
  ['executivo/cover-letter-gray', 'CoverLetterGrayTemplate'],
  ['moderno/graphite-sidebar', 'GraphiteSidebarTemplate'],
  ['tecnico/compact-profile', 'CompactProfileTemplate'],
  ['tecnico/emerald-technical', 'EmeraldTechnicalTemplate'],
  ['editorial/amber-editorial', 'AmberEditorialTemplate'],
  ['corporativo/classic-column', 'ClassicColumnTemplate'],
]

const sections = `/** Defaults / empty state por secção (extensível por modelo). */\nexport const resumeModelSectionDefaults = {}\n`
const styles = `/** Tokens CSS ou variáveis exportadas para o modelo (extensível). */\nexport const resumeModelStyleTokens = {}\n`

for (const [dir, name] of entries) {
  const base = path.join(root, dir)
  const compPath = `@/modules/resume/templates/components/templates/${name}.vue`
  const index = `<script setup lang="ts">
import type { ResumeTemplateMapping } from '@/modelos/resume/types'
import type { ResumeTemplateData } from '@/modules/resume/templates/types'
import ${name} from '${compPath}'

defineProps<{
  data: ResumeTemplateData
  accent: string
  mapping?: ResumeTemplateMapping
}>()
</script>

<template>
  <${name} :data="data" />
</template>
`
  fs.writeFileSync(path.join(base, 'index.vue'), index)
  fs.writeFileSync(path.join(base, 'sections.ts'), sections)
  fs.writeFileSync(path.join(base, 'styles.ts'), styles)
  const cfgPath = path.join(base, 'config.ts')
  let cfg = fs.readFileSync(cfgPath, 'utf8')
  cfg = cfg.replace(
    `import ${name} from '@/modules/resume/templates/components/templates/${name}.vue'`,
    `import ${name} from './index.vue'`,
  )
  fs.writeFileSync(cfgPath, cfg)
}

console.log('ok', entries.length)
