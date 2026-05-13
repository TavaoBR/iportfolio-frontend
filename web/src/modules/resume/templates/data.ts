import type { ResumeTemplateData, ResumeTemplateEntry, ResumeTemplateRendererContext, ResumeTemplateSkill } from './types'
import type { ResumeSection } from '../types/resume.types'
import { getResumeTemplateDefinition } from './registry'

/**
 * Agrega `Resume` + `ResumeSection[]` em `ResumeTemplateData` plano consumido pelos `.vue` dos modelos.
 * O ficheiro `mapping.ts` em cada pasta sob `web/src/modelos/resume/` descreve intenção de layout (região/componente);
 * a ponte para render dinâmico por `mapping` é evolução futura (ver `ResumeTemplateMapping`).
 */

function resolveTemplatePhotoUrl(context: ResumeTemplateRendererContext): string | null {
  const def = getResumeTemplateDefinition(context.templateKey ?? context.resume?.template_key)
  if (!def.capabilities?.supportsPhoto) return null

  const raw = context.profilePhotoUrl
  if (raw === undefined) {
    const a = context.user?.avatar
    return typeof a === 'string' && a.trim() ? a.trim() : null
  }
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  return null
}

const emptyData: ResumeTemplateData = {
  name: 'Seu nome',
  headline: 'Cargo ou objetivo profissional',
  email: 'seu@email.com',
  phone: '(00) 00000-0000',
  location: 'Cidade, Estado',
  photoUrl: null,
  links: [],
  summary: 'Adicione um resumo profissional para apresentar sua trajetória, principais competências e objetivo.',
  experiences: [],
  educations: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  customSections: [],
}

const labelMap: Record<string, string[]> = {
  name: ['Nome completo', 'Nome'],
  email: ['E-mail', 'Email'],
  phone: ['Telefone'],
  headline: ['Cargo ou objetivo', 'Objetivo'],
  summary: ['Resumo profissional', 'Resumo', 'Descrição'],
  company: ['Empresa'],
  role: ['Cargo'],
  location: ['Localização'],
  start_date: ['Data de início'],
  end_date: ['Data de fim'],
  institution: ['Instituição'],
  degree: ['Grau'],
  field_of_study: ['Curso/Área', 'Curso'],
  skill_name: ['Nome da habilidade'],
  level: ['Nível'],
  category: ['Categoria'],
  language: ['Idioma'],
  certification_name: ['Nome'],
  issuer: ['Instituição emissora'],
  issued_at: ['Data de emissão'],
  credential_url: ['URL da credencial'],
  project_name: ['Nome do projeto'],
  technologies: ['Tecnologias'],
  project_url: ['Link'],
  url: ['URL'],
  label: ['Nome do link'],
}

function parseContent(content?: string | null) {
  const values: Record<string, string> = {}
  const lines = String(content ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  for (const line of lines) {
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) continue

    const label = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()
    if (!label || !value) continue

    values[label] = value
  }

  return { values, plainText: lines.join('\n') }
}

function valueFor(values: Record<string, string>, key: keyof typeof labelMap) {
  for (const label of labelMap[key] ?? []) {
    if (values[label]) return values[label]
  }

  return ''
}

function period(values: Record<string, string>) {
  return [valueFor(values, 'start_date'), valueFor(values, 'end_date') || values['Trabalho atualmente aqui']]
    .filter(Boolean)
    .join(' - ')
}

function entryFromSection(section: ResumeSection): ResumeTemplateEntry {
  const { values, plainText } = parseContent(section.content)

  if (section.section_type === 'experiences') {
    return {
      title: valueFor(values, 'role') || section.title || 'Experiência profissional',
      subtitle: valueFor(values, 'company'),
      meta: [period(values), valueFor(values, 'location')].filter(Boolean).join(' · '),
      description: valueFor(values, 'summary') || plainText,
    }
  }

  if (section.section_type === 'educations') {
    return {
      title: valueFor(values, 'field_of_study') || valueFor(values, 'degree') || section.title || 'Formação',
      subtitle: valueFor(values, 'institution'),
      meta: period(values),
      description: valueFor(values, 'summary') || plainText,
    }
  }

  if (section.section_type === 'certifications') {
    return {
      title: valueFor(values, 'certification_name') || section.title || 'Certificação',
      subtitle: valueFor(values, 'issuer'),
      meta: valueFor(values, 'issued_at'),
      link: valueFor(values, 'credential_url'),
    }
  }

  return {
    title: valueFor(values, 'project_name') || section.title || 'Projeto',
    subtitle: valueFor(values, 'technologies'),
    link: valueFor(values, 'project_url'),
    description: valueFor(values, 'summary') || plainText,
  }
}

function skillFromSection(section: ResumeSection): ResumeTemplateSkill {
  const { values, plainText } = parseContent(section.content)

  return {
    name: valueFor(values, section.section_type === 'languages' ? 'language' : 'skill_name') || plainText || section.title || 'Skill',
    level: valueFor(values, 'level'),
    category: valueFor(values, 'category'),
  }
}

function applyPersonalInfo(data: ResumeTemplateData, section: ResumeSection) {
  const { values } = parseContent(section.content)
  data.name = valueFor(values, 'name') || data.name
  data.email = valueFor(values, 'email') || data.email
  data.phone = valueFor(values, 'phone') || data.phone
  data.headline = valueFor(values, 'headline') || data.headline
}

function withSamples(data: ResumeTemplateData): ResumeTemplateData {
  return {
    ...data,
    experiences: data.experiences.length
      ? data.experiences
      : [
          {
            title: 'Especialista de Produto',
            subtitle: 'Empresa Exemplo',
            meta: '2022 - Atual · Remoto',
            description: 'Lidere projetos, descreva impacto e destaque resultados relevantes para a vaga.',
          },
        ],
    educations: data.educations.length
      ? data.educations
      : [{ title: 'Curso ou graduação', subtitle: 'Instituição de ensino', meta: '2018 - 2022' }],
    skills: data.skills.length
      ? data.skills
      : [
          { name: 'Comunicação', level: 'Avançado' },
          { name: 'Gestão de projetos', level: 'Intermediário' },
          { name: 'Análise de dados', level: 'Avançado' },
        ],
  }
}

export function createResumeTemplateData(context: ResumeTemplateRendererContext): ResumeTemplateData {
  const data: ResumeTemplateData = {
    ...emptyData,
    name: context.user?.name || context.fallback?.name || emptyData.name,
    email: context.user?.email || context.fallback?.email || emptyData.email,
    phone: context.profile?.phone || context.fallback?.phone || emptyData.phone,
    headline: context.resume?.target_role || context.profile?.headline || context.fallback?.headline || emptyData.headline,
    location:
      [context.profile?.city, context.profile?.state, context.profile?.country].filter(Boolean).join(', ') ||
      context.fallback?.location ||
      emptyData.location,
    photoUrl: resolveTemplatePhotoUrl(context),
    links: [
      context.profile?.linkedin_url,
      context.profile?.github_url,
      context.profile?.website_url,
      ...(context.fallback?.links ?? []),
    ].filter((link): link is string => Boolean(link)),
    summary: context.profile?.bio || context.fallback?.summary || emptyData.summary,
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    customSections: [],
  }

  for (const section of context.sections ?? []) {
    if (section.is_visible === false) continue

    if (section.section_type === 'personal_info') applyPersonalInfo(data, section)
    else if (section.section_type === 'professional_summary') {
      const parsed = parseContent(section.content)
      data.summary = valueFor(parsed.values, 'summary') || parsed.plainText || data.summary
    } else if (section.section_type === 'experiences') data.experiences.push(entryFromSection(section))
    else if (section.section_type === 'educations') data.educations.push(entryFromSection(section))
    else if (section.section_type === 'skills') data.skills.push(skillFromSection(section))
    else if (section.section_type === 'languages') data.languages.push(skillFromSection(section))
    else if (section.section_type === 'certifications') data.certifications.push(entryFromSection(section))
    else if (section.section_type === 'projects') data.projects.push(entryFromSection(section))
    else if (section.section_type === 'links') {
      const parsed = parseContent(section.content)
      const link = valueFor(parsed.values, 'url')
      if (link) data.links.push(link)
    } else {
      data.customSections.push({
        title: section.title || 'Secção adicional',
        type: section.section_type,
        content: section.content || '',
      })
    }
  }

  return withSamples(data)
}
