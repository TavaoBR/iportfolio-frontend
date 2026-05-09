<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { FwbButton, FwbInput } from 'flowbite-vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { getProfile, upsertProfile } from '../services/profileApi'
import type { UserProfile } from '../types/profile.types'
import { ApiError } from '@/types/api'

type ProfileForm = {
  headline: string
  bio: string
  phone: string
  city: string
  state: string
  country: string
  linkedin_url: string
  github_url: string
  website_url: string
}

const { data, loading, error, run } = useAsyncData<UserProfile | null>()
const form = ref<ProfileForm>({
  headline: '',
  bio: '',
  phone: '',
  city: '',
  state: '',
  country: '',
  linkedin_url: '',
  github_url: '',
  website_url: '',
})
const actionError = ref('')
const actionMessage = ref('')
const saving = ref(false)

onMounted(() => {
  void run(() => getProfile())
})

watch(
  data,
  (profile) => {
    form.value = {
      headline: profile?.headline ?? '',
      bio: profile?.bio ?? '',
      phone: profile?.phone ?? '',
      city: profile?.city ?? '',
      state: profile?.state ?? '',
      country: profile?.country ?? '',
      linkedin_url: profile?.linkedin_url ?? '',
      github_url: profile?.github_url ?? '',
      website_url: profile?.website_url ?? '',
    }
  },
  { immediate: true },
)

async function saveProfile() {
  actionError.value = ''
  actionMessage.value = ''
  saving.value = true

  try {
    await upsertProfile({
      headline: form.value.headline || null,
      bio: form.value.bio || null,
      phone: form.value.phone || null,
      city: form.value.city || null,
      state: form.value.state || null,
      country: form.value.country || null,
      linkedin_url: form.value.linkedin_url || null,
      github_url: form.value.github_url || null,
      website_url: form.value.website_url || null,
    })
    await run(() => getProfile())
    actionMessage.value = 'Perfil salvo.'
  } catch (e) {
    actionError.value = e instanceof ApiError ? e.message : 'Não foi possível salvar o perfil.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5">
      <h1 class="text-2xl font-black text-white">Dados pessoais</h1>
      <p class="mt-1 text-sm text-gray-500">
        Essa é a base do seu perfil profissional. O currículo e o portfólio usam essas informações.
      </p>

      <div v-if="loading" class="mt-6 h-64 animate-pulse rounded-2xl bg-white/10" />
      <p v-else-if="error" class="mt-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-200">
        {{ error }}
      </p>

      <form v-else class="mt-6 grid gap-5 lg:grid-cols-2" @submit.prevent="saveProfile">
        <FwbInput
          v-model="form.headline"
          label="Headline"
          placeholder="Ex.: Desenvolvedor Frontend Vue.js"
          input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
          label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
        />
        <FwbInput
          v-model="form.phone"
          label="Telefone"
          input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
          label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
        />
        <FwbInput
          v-model="form.city"
          label="Cidade"
          input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
          label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
        />
        <FwbInput
          v-model="form.state"
          label="Estado"
          input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
          label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
        />
        <FwbInput
          v-model="form.country"
          label="País"
          input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
          label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
        />
        <FwbInput
          v-model="form.website_url"
          label="Website"
          type="url"
          input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
          label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
        />
        <FwbInput
          v-model="form.linkedin_url"
          label="LinkedIn"
          type="url"
          input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
          label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
        />
        <FwbInput
          v-model="form.github_url"
          label="GitHub"
          type="url"
          input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white placeholder:!text-gray-600"
          label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
        />
        <label class="block lg:col-span-2">
          <span class="mb-1.5 block text-xs font-bold text-gray-200">Bio</span>
          <textarea
            v-model="form.bio"
            rows="7"
            class="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
          />
        </label>

        <p v-if="actionError" class="rounded-xl bg-red-500/10 p-3 text-sm text-red-200 lg:col-span-2">
          {{ actionError }}
        </p>
        <p v-if="actionMessage" class="rounded-xl bg-green-500/10 p-3 text-sm text-green-200 lg:col-span-2">
          {{ actionMessage }}
        </p>

        <div class="lg:col-span-2">
          <FwbButton type="submit" color="purple" class="!rounded-xl !px-5 !py-3 !font-bold" :loading="saving">
            Salvar perfil
          </FwbButton>
        </div>
      </form>
    </section>

    <aside class="rounded-2xl border border-white/10 bg-[#111019] p-5">
      <h2 class="text-xl font-black text-white">Resumo</h2>
      <div class="mt-5 space-y-4 text-sm">
        <div>
          <p class="text-gray-500">Headline</p>
          <p class="mt-1 font-semibold text-white">{{ form.headline || 'Não definida' }}</p>
        </div>
        <div>
          <p class="text-gray-500">Localização</p>
          <p class="mt-1 font-semibold text-white">
            {{ [form.city, form.state, form.country].filter(Boolean).join(', ') || 'Não definida' }}
          </p>
        </div>
        <div>
          <p class="text-gray-500">Links</p>
          <p class="mt-1 text-gray-300">
            {{ [form.linkedin_url, form.github_url, form.website_url].filter(Boolean).length }} preenchidos
          </p>
        </div>
      </div>
    </aside>
  </div>
</template>
