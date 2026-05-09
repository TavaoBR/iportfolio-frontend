import type { ResumeSectionType } from '../types/resume.types'
import type { DynamicFieldSchema, DynamicFormValues } from '@/modules/content-blocks/forms/contentBlockFormSchemas'

export interface ResumeSectionFormSchema {
  key: ResumeSectionType
  label: string
  defaultTitle: string
  fields: DynamicFieldSchema[]
}

export const resumeSectionSchemas: Record<ResumeSectionType, ResumeSectionFormSchema> = {
  personal_info: {
    key: 'personal_info',
    label: 'Dados pessoais',
    defaultTitle: 'Dados de contato',
    fields: [
      { key: 'name', label: 'Nome completo', type: 'text', required: true, placeholder: 'Ex.: James Gustavo' },
      { key: 'email', label: 'E-mail', type: 'text', required: true, placeholder: 'seu@email.com' },
      { key: 'phone', label: 'Telefone', type: 'text', placeholder: '(00) 00000-0000' },
      { key: 'headline', label: 'Cargo ou objetivo', type: 'text', placeholder: 'Ex.: Desenvolvedor Frontend' },
    ],
  },
  professional_summary: {
    key: 'professional_summary',
    label: 'Resumo',
    defaultTitle: 'Resumo profissional',
    fields: [
      {
        key: 'summary',
        label: 'Resumo profissional',
        type: 'textarea',
        required: true,
        placeholder: 'Descreva seu perfil profissional em 2 ou 3 frases.',
      },
    ],
  },
  experiences: {
    key: 'experiences',
    label: 'Experiência profissional',
    defaultTitle: 'Experiências profissionais',
    fields: [
      { key: 'company', label: 'Empresa', type: 'text', required: true, placeholder: 'Ex.: iPortfolio' },
      { key: 'role', label: 'Cargo', type: 'text', required: true, placeholder: 'Ex.: Desenvolvedor Frontend' },
      { key: 'location', label: 'Localização', type: 'text', placeholder: 'Ex.: Remoto' },
      { key: 'start_date', label: 'Data de início', type: 'date' },
      { key: 'end_date', label: 'Data de fim', type: 'date' },
      { key: 'is_current', label: 'Trabalho atualmente aqui', type: 'checkbox' },
      { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descreva responsabilidades e conquistas.' },
    ],
  },
  educations: {
    key: 'educations',
    label: 'Formação acadêmica',
    defaultTitle: 'Formação acadêmica',
    fields: [
      { key: 'institution', label: 'Instituição', type: 'text', required: true, placeholder: 'Ex.: Universidade Federal' },
      { key: 'degree', label: 'Grau', type: 'text', placeholder: 'Ex.: Bacharelado' },
      { key: 'field_of_study', label: 'Curso/Área', type: 'text', placeholder: 'Ex.: Sistemas de Informação' },
      { key: 'start_date', label: 'Data de início', type: 'date' },
      { key: 'end_date', label: 'Data de fim', type: 'date' },
      { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes relevantes da formação.' },
    ],
  },
  skills: {
    key: 'skills',
    label: 'Skills',
    defaultTitle: 'Competências',
    fields: [
      { key: 'name', label: 'Nome da habilidade', type: 'text', required: true, placeholder: 'Ex.: Vue.js' },
      { key: 'category', label: 'Categoria', type: 'text', placeholder: 'Ex.: Frontend' },
      {
        key: 'level',
        label: 'Nível',
        type: 'select',
        required: true,
        options: [
          { label: 'Iniciante', value: 'beginner' },
          { label: 'Intermediário', value: 'intermediate' },
          { label: 'Avançado', value: 'advanced' },
          { label: 'Experiente', value: 'expert' },
        ],
      },
    ],
  },
  languages: {
    key: 'languages',
    label: 'Idiomas',
    defaultTitle: 'Idiomas',
    fields: [
      { key: 'language', label: 'Idioma', type: 'text', required: true, placeholder: 'Ex.: Inglês' },
      {
        key: 'level',
        label: 'Nível',
        type: 'select',
        required: true,
        options: [
          { label: 'Básico', value: 'basic' },
          { label: 'Intermediário', value: 'intermediate' },
          { label: 'Avançado', value: 'advanced' },
          { label: 'Fluente', value: 'fluent' },
          { label: 'Nativo', value: 'native' },
        ],
      },
    ],
  },
  certifications: {
    key: 'certifications',
    label: 'Certificações',
    defaultTitle: 'Certificações',
    fields: [
      { key: 'name', label: 'Nome', type: 'text', required: true, placeholder: 'Ex.: AWS Cloud Practitioner' },
      { key: 'issuer', label: 'Instituição emissora', type: 'text', placeholder: 'Ex.: AWS' },
      { key: 'issued_at', label: 'Data de emissão', type: 'date' },
      { key: 'credential_url', label: 'URL da credencial', type: 'url', placeholder: 'https://...' },
    ],
  },
  projects: {
    key: 'projects',
    label: 'Projetos',
    defaultTitle: 'Projetos',
    fields: [
      { key: 'name', label: 'Nome do projeto', type: 'text', required: true, placeholder: 'Ex.: iPortfolio' },
      { key: 'technologies', label: 'Tecnologias', type: 'text', placeholder: 'Ex.: Vue, TypeScript, Symfony' },
      { key: 'project_url', label: 'Link', type: 'url', placeholder: 'https://...' },
      { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descreva objetivo, escopo e resultados.' },
    ],
  },
  links: {
    key: 'links',
    label: 'Links',
    defaultTitle: 'Links',
    fields: [
      { key: 'label', label: 'Nome do link', type: 'text', required: true, placeholder: 'Ex.: LinkedIn' },
      { key: 'url', label: 'URL', type: 'url', required: true, placeholder: 'https://...' },
    ],
  },
  custom: {
    key: 'custom',
    label: 'Personalizada',
    defaultTitle: 'Nova secção',
    fields: [
      { key: 'content', label: 'Conteúdo', type: 'textarea', required: true, placeholder: 'Escreva o conteúdo da secção.' },
    ],
  },
}

export function createInitialSectionValues(schema: ResumeSectionFormSchema): DynamicFormValues {
  return schema.fields.reduce<DynamicFormValues>((values, field) => {
    values[field.key] = field.type === 'checkbox' ? false : ''
    return values
  }, {})
}

export function formatSectionContent(schema: ResumeSectionFormSchema, values: DynamicFormValues) {
  return schema.fields
    .map((field) => {
      const value = values[field.key]

      if (field.type === 'checkbox') {
        return value ? `${field.label}: Sim` : ''
      }

      if (typeof value !== 'string' || !value.trim()) return ''

      const optionLabel = field.options?.find((option) => option.value === value)?.label
      return `${field.label}: ${optionLabel ?? value.trim()}`
    })
    .filter(Boolean)
    .join('\n')
}

export function parseSectionContent(schema: ResumeSectionFormSchema, content?: string | null): DynamicFormValues {
  const values = createInitialSectionValues(schema)
  const lines = String(content ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  for (const line of lines) {
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) continue

    const label = line.slice(0, separatorIndex).trim()
    const rawValue = line.slice(separatorIndex + 1).trim()
    const field = schema.fields.find((item) => item.label === label)
    if (!field) continue

    if (field.type === 'checkbox') {
      values[field.key] = rawValue.toLowerCase() === 'sim'
      continue
    }

    const option = field.options?.find((item) => item.label === rawValue || item.value === rawValue)
    values[field.key] = option?.value ?? rawValue
  }

  return values
}
