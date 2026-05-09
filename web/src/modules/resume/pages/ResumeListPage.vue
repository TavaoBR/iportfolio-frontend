<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { FwbButton, FwbInput } from 'flowbite-vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { createResume, listResumes } from '../services/resumesApi'
import { createResumeSection } from '../services/resumeSectionsApi'
import type { ResumeLanguage, ResumeSummary } from '../types/resume.types'
import { ApiError } from '@/types/api'
import { useAuthStore } from '@/modules/auth/stores/useAuthStore'
import { getProfile } from '@/modules/profile/services/profileApi'
import type { UserProfile } from '@/modules/profile/types/profile.types'
import ResumeTemplateRenderer from '../templates/components/ResumeTemplateRenderer.vue'
import TemplateCarousel from '../templates/components/TemplateCarousel.vue'
import { resumeTemplateRegistry } from '../templates/registry'

const { data, loading, error, run } = useAsyncData<ResumeSummary[]>()
const router = useRouter()
const auth = useAuthStore()

const step = ref<1 | 2>(1)
const language = ref<ResumeLanguage>('pt_BR')
const selectedTemplateKey = ref(resumeTemplateRegistry[0]?.key ?? '')
const profile = ref<UserProfile | null>(null)
const nameParts = (auth.user?.name ?? '').trim().split(/\s+/)
const firstName = ref(nameParts[0] ?? '')
const lastName = ref(nameParts.slice(1).join(' '))
const email = ref(auth.user?.email ?? '')
const phone = ref('')
const headline = ref('')
const createError = ref('')
const creating = ref(false)
const templates = resumeTemplateRegistry

const selectedTemplate = computed(
  () => templates.find((template) => template.key === selectedTemplateKey.value) ?? null,
)
const fullName = computed(() => [firstName.value, lastName.value].filter(Boolean).join(' '))
const resumeTitle = computed(() =>
  fullName.value ? `Currículo de ${fullName.value}` : 'Meu currículo profissional',
)
const previewFallback = computed(() => ({
  name: fullName.value,
  email: email.value,
  phone: phone.value,
  headline: headline.value,
}))

onMounted(() => {
  void run(() => listResumes())
  void getProfile().then((currentProfile) => {
    profile.value = currentProfile
    phone.value = currentProfile?.phone ?? phone.value
    headline.value = currentProfile?.headline ?? headline.value
  })
})

function goToPersonalInfo() {
  createError.value = ''

  if (!selectedTemplateKey.value) {
    createError.value = 'Escolha um template para continuar.'
    return
  }

  step.value = 2
}

async function submitCreate() {
  createError.value = ''
  creating.value = true

  try {
    const resume = await createResume({
      title: resumeTitle.value,
      target_role: headline.value || null,
      language: language.value,
      is_main: (data.value?.length ?? 0) === 0,
      template_key: selectedTemplateKey.value || null,
    })

    if (resume?.public_id) {
      await createResumeSection(resume.public_id, {
        section_type: 'personal_info',
        title: 'Dados de contato',
        content: [
          fullName.value ? `Nome: ${fullName.value}` : '',
          email.value ? `Email: ${email.value}` : '',
          phone.value ? `Telefone: ${phone.value}` : '',
          headline.value ? `Objetivo: ${headline.value}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        position: 1,
        is_visible: true,
      })

      await router.push({ name: 'resume-edit', params: { publicId: resume.public_id } })
      return
    }

    firstName.value = ''
    lastName.value = ''
    email.value = ''
    phone.value = ''
    headline.value = ''
    await run(() => listResumes())
  } catch (e) {
    createError.value =
      e instanceof ApiError ? e.message : 'Não foi possível criar o currículo agora.'
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <div class="space-y-5">
    <section
      class="grid min-h-[560px] gap-5 rounded-2xl border border-white/10 bg-[#111019] p-5"
      :class="step === 1 ? 'grid-cols-1' : 'lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_420px]'"
    >
      <div class="flex flex-col">
        <div class="mb-6 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
              Etapa {{ step }} de 2
            </p>
            <h1 class="mt-2 text-2xl font-black text-white">
              {{ step === 1 ? 'Escolha um template' : 'Começando!' }}
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              {{
                step === 1
                  ? 'Escolha o modelo visual do currículo antes de preencher os dados.'
                  : 'Ótima escolha de modelo. Agora vamos adicionar suas informações pessoais.'
              }}
            </p>
          </div>
          <span class="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-bold text-gray-400">
            {{ selectedTemplate?.name ?? 'Nenhum modelo' }}
          </span>
        </div>

        <template v-if="step === 1">
          <TemplateCarousel
            v-model="selectedTemplateKey"
            :templates="templates"
            :profile="profile"
            :user="auth.user"
            :fallback="previewFallback"
            title="Modelos prontos para uso que ajudarão seu currículo a se destacar para recrutadores"
            description="Navegue pelos modelos oficiais em formato A4, compare a composição real e selecione o visual do seu currículo."
            select-label="Selecionar"
            :scale="0.35"
            @select="createError = ''"
          />

          <p v-if="createError" class="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200" role="alert">
            {{ createError }}
          </p>

          <div class="mt-auto flex justify-end pt-6">
            <FwbButton color="purple" class="!rounded-xl !px-6 !py-3 !font-bold" @click="goToPersonalInfo">
              Continuar
            </FwbButton>
          </div>
        </template>

        <form v-else class="mt-8 flex flex-1 flex-col" @submit.prevent="submitCreate">
          <div class="grid gap-5 md:grid-cols-2">
            <FwbInput
              v-model="firstName"
              label="Primeiro nome"
              input-class="!rounded-none !border-0 !border-b !border-white/20 !bg-transparent !px-0 !py-3 !text-sm !text-white placeholder:!text-gray-600 focus:!border-violet-500 focus:!ring-0"
              label-class="!mb-1.5 !text-xs !font-bold !text-gray-400"
              required
            />
            <FwbInput
              v-model="lastName"
              label="Sobrenome"
              input-class="!rounded-none !border-0 !border-b !border-white/20 !bg-transparent !px-0 !py-3 !text-sm !text-white placeholder:!text-gray-600 focus:!border-violet-500 focus:!ring-0"
              label-class="!mb-1.5 !text-xs !font-bold !text-gray-400"
              required
            />
            <FwbInput
              v-model="email"
              label="E-mail"
              type="email"
              input-class="!rounded-none !border-0 !border-b !border-white/20 !bg-transparent !px-0 !py-3 !text-sm !text-white placeholder:!text-gray-600 focus:!border-violet-500 focus:!ring-0"
              label-class="!mb-1.5 !text-xs !font-bold !text-gray-400"
              required
            />
            <FwbInput
              v-model="phone"
              label="Telefone"
              input-class="!rounded-none !border-0 !border-b !border-white/20 !bg-transparent !px-0 !py-3 !text-sm !text-white placeholder:!text-gray-600 focus:!border-violet-500 focus:!ring-0"
              label-class="!mb-1.5 !text-xs !font-bold !text-gray-400"
            />
            <FwbInput
              v-model="headline"
              label="Cargo ou objetivo"
              class="md:col-span-2"
              placeholder="Ex.: Desenvolvedor Frontend"
              input-class="!rounded-none !border-0 !border-b !border-white/20 !bg-transparent !px-0 !py-3 !text-sm !text-white placeholder:!text-gray-600 focus:!border-violet-500 focus:!ring-0"
              label-class="!mb-1.5 !text-xs !font-bold !text-gray-400"
            />
            <label class="block">
              <span class="mb-1.5 block text-xs font-bold text-gray-400">Idioma</span>
              <select
                v-model="language"
                class="w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white outline-none focus:border-violet-500"
              >
                <option value="pt_BR">Português</option>
                <option value="en_US">Inglês</option>
                <option value="es_ES">Espanhol</option>
              </select>
            </label>
          </div>

          <p v-if="createError" class="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200" role="alert">
            {{ createError }}
          </p>

          <div class="mt-auto flex items-center justify-between gap-3 pt-8">
            <FwbButton type="button" color="alternative" class="!rounded-xl !px-6" @click="step = 1">
              Voltar
            </FwbButton>
            <FwbButton
              type="submit"
              color="purple"
              class="!rounded-xl !px-6 !font-bold"
              :loading="creating"
            >
              Continuar
            </FwbButton>
          </div>
        </form>
      </div>

      <aside v-if="step === 2" class="hidden rounded-2xl border border-white/10 bg-black/30 p-4 lg:block">
        <div class="mb-4">
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Preview dinâmico</p>
          <h2 class="mt-1 text-lg font-black text-white">{{ selectedTemplate?.name ?? 'Template' }}</h2>
        </div>
        <ResumeTemplateRenderer
          :template-key="selectedTemplateKey"
          :profile="profile"
          :user="auth.user"
          :fallback="previewFallback"
          :scale="0.4"
        />
      </aside>
    </section>

    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5">
      <div class="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-black text-white">Meus currículos</h2>
          <p class="mt-1 text-sm text-gray-500">Edite, personalize e exporte seus CVs.</p>
        </div>
        <span class="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-bold text-gray-400">
          {{ data?.length ?? 0 }} itens
        </span>
      </div>

      <div v-if="loading" class="grid gap-3 md:grid-cols-2">
        <div v-for="n in 4" :key="n" class="h-32 animate-pulse rounded-2xl bg-white/10" />
      </div>
      <p v-else-if="error" class="rounded-xl bg-red-500/10 p-4 text-sm text-red-200">
        {{ error }}
      </p>
      <div v-else-if="(data?.length ?? 0) > 0" class="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        <article
          v-for="r in data"
          :key="r.public_id"
          class="rounded-2xl border border-white/10 bg-black/20 p-4"
        >
          <p class="font-black text-white">{{ r.title ?? 'Sem título' }}</p>
          <p class="mt-1 text-xs text-gray-500">{{ r.target_role ?? 'Cargo alvo não definido' }}</p>
          <div class="mt-4 flex items-center justify-between gap-3">
            <span class="truncate text-xs text-gray-600">{{ r.public_id }}</span>
            <RouterLink
              :to="{ name: 'resume-edit', params: { publicId: r.public_id } }"
              class="rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-violet-500"
            >
              Editar
            </RouterLink>
          </div>
        </article>
      </div>
      <p v-else class="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-500">
        Nenhum currículo ainda. Crie o primeiro para começar a montar seu CV.
      </p>
    </section>
  </div>
</template>
