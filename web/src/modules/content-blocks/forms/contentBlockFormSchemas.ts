export type ContentBlockTab = 'experiences' | 'educations' | 'skills' | 'projects' | 'certifications'

export type DynamicFieldType = 'text' | 'textarea' | 'date' | 'url' | 'select' | 'checkbox'

export interface DynamicFieldOption {
  label: string
  value: string
}

export interface DynamicFieldSchema {
  key: string
  label: string
  type: DynamicFieldType
  required?: boolean
  placeholder?: string
  options?: DynamicFieldOption[]
}

export interface ContentBlockFormSchema {
  key: ContentBlockTab
  label: string
  description: string
  titleKey: string
  subtitleKey?: string
  descriptionKey?: string
  fields: DynamicFieldSchema[]
}

export type DynamicFormValues = Record<string, string | boolean>

export const contentBlockSchemas: Record<ContentBlockTab, ContentBlockFormSchema> = {
  experiences: {
    key: 'experiences',
    label: 'Experiência profissional',
    description: 'Empresas, cargos, períodos e responsabilidades relevantes.',
    titleKey: 'company',
    subtitleKey: 'role',
    descriptionKey: 'description',
    fields: [
      { key: 'company', label: 'Empresa', type: 'text', required: true, placeholder: 'Ex.: iPortfolio' },
      { key: 'role', label: 'Cargo', type: 'text', required: true, placeholder: 'Ex.: Desenvolvedor Frontend' },
      { key: 'location', label: 'Localização', type: 'text', placeholder: 'Ex.: Remoto, São Paulo' },
      { key: 'start_date', label: 'Data de início', type: 'date' },
      { key: 'end_date', label: 'Data de fim', type: 'date' },
      { key: 'is_current', label: 'Trabalho atualmente aqui', type: 'checkbox' },
      { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descreva responsabilidades, resultados e conquistas.' },
    ],
  },
  educations: {
    key: 'educations',
    label: 'Formação acadêmica',
    description: 'Instituições, cursos, graus e períodos de estudo.',
    titleKey: 'institution',
    subtitleKey: 'degree',
    descriptionKey: 'description',
    fields: [
      { key: 'institution', label: 'Instituição', type: 'text', required: true, placeholder: 'Ex.: Universidade Federal' },
      { key: 'degree', label: 'Grau', type: 'text', placeholder: 'Ex.: Bacharelado, Técnico, MBA' },
      { key: 'field_of_study', label: 'Curso/Área', type: 'text', placeholder: 'Ex.: Ciência da Computação' },
      { key: 'start_date', label: 'Data de início', type: 'date' },
      { key: 'end_date', label: 'Data de fim', type: 'date' },
      { key: 'is_current', label: 'Cursando atualmente', type: 'checkbox' },
      { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes relevantes da formação.' },
    ],
  },
  skills: {
    key: 'skills',
    label: 'Skill',
    description: 'Competências técnicas, ferramentas e níveis de domínio.',
    titleKey: 'name',
    subtitleKey: 'level',
    fields: [
      { key: 'name', label: 'Nome da habilidade', type: 'text', required: true, placeholder: 'Ex.: Vue.js' },
      { key: 'category', label: 'Categoria', type: 'text', placeholder: 'Ex.: Frontend' },
      {
        key: 'level',
        label: 'Nível',
        type: 'select',
        options: [
          { label: 'Iniciante', value: 'beginner' },
          { label: 'Intermediário', value: 'intermediate' },
          { label: 'Avançado', value: 'advanced' },
          { label: 'Experiente', value: 'expert' },
        ],
      },
    ],
  },
  projects: {
    key: 'projects',
    label: 'Projeto',
    description: 'Projetos profissionais ou pessoais usados no currículo/portfólio.',
    titleKey: 'name',
    subtitleKey: 'project_url',
    descriptionKey: 'description',
    fields: [
      { key: 'name', label: 'Nome do projeto', type: 'text', required: true, placeholder: 'Ex.: Plataforma iPortfolio' },
      { key: 'project_url', label: 'Link do projeto', type: 'url', placeholder: 'https://...' },
      { key: 'repository_url', label: 'Repositório', type: 'url', placeholder: 'https://github.com/...' },
      { key: 'start_date', label: 'Data de início', type: 'date' },
      { key: 'end_date', label: 'Data de fim', type: 'date' },
      { key: 'is_current', label: 'Projeto em andamento', type: 'checkbox' },
      { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descreva escopo, tecnologias e impacto.' },
    ],
  },
  certifications: {
    key: 'certifications',
    label: 'Certificação',
    description: 'Certificados, credenciais, instituição emissora e datas.',
    titleKey: 'name',
    subtitleKey: 'issuer',
    fields: [
      { key: 'name', label: 'Nome da certificação', type: 'text', required: true, placeholder: 'Ex.: AWS Cloud Practitioner' },
      { key: 'issuer', label: 'Instituição emissora', type: 'text', placeholder: 'Ex.: Amazon Web Services' },
      { key: 'credential_url', label: 'URL da credencial', type: 'url', placeholder: 'https://...' },
      { key: 'issued_at', label: 'Data de emissão', type: 'date' },
      { key: 'expires_at', label: 'Data de expiração', type: 'date' },
    ],
  },
}

export function createInitialValues(schema: ContentBlockFormSchema): DynamicFormValues {
  return schema.fields.reduce<DynamicFormValues>((values, field) => {
    values[field.key] = field.type === 'checkbox' ? false : ''
    return values
  }, {})
}

export function toApiPayload(schema: ContentBlockFormSchema, values: DynamicFormValues) {
  return schema.fields.reduce<Record<string, unknown>>((payload, field) => {
    const value = values[field.key]

    if (field.type === 'checkbox') {
      payload[field.key] = Boolean(value)
      return payload
    }

    payload[field.key] = typeof value === 'string' && value.trim() ? value.trim() : null
    return payload
  }, {})
}
