<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiInput from '@/components/ui/UiInput.vue'
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
    <section class="ip-card-strong p-5">
      <h1 class="text-2xl font-black text-slate-950">Dados pessoais</h1>
      <p class="mt-1 text-sm text-slate-500">
        Essa é a base do seu perfil profissional. O currículo e o portfólio usam essas informações.
      </p>

      <div v-if="loading" class="mt-6 h-64 animate-pulse rounded-3xl bg-slate-100" />
      <p v-else-if="error" class="mt-6 rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-600">
        {{ error }}
      </p>

      <form v-else class="mt-6 grid gap-5 lg:grid-cols-2" @submit.prevent="saveProfile">
        <UiInput
          v-model="form.headline"
          label="Headline"
          placeholder="Ex.: Desenvolvedor Frontend Vue.js"
        />
        <UiInput
          v-model="form.phone"
          label="Telefone"
        />
        <UiInput
          v-model="form.city"
          label="Cidade"
        />
        <UiInput
          v-model="form.state"
          label="Estado"
        />
        <UiInput
          v-model="form.country"
          label="País"
        />
        <UiInput
          v-model="form.website_url"
          label="Website"
          type="url"
        />
        <UiInput
          v-model="form.linkedin_url"
          label="LinkedIn"
          type="url"
        />
        <UiInput
          v-model="form.github_url"
          label="GitHub"
          type="url"
        />
        <label class="block lg:col-span-2">
          <span class="ip-label">Bio</span>
          <textarea
            v-model="form.bio"
            rows="7"
            class="ip-input text-sm"
          />
        </label>

        <p v-if="actionError" class="rounded-3xl bg-red-50 p-3 text-sm font-bold text-red-600 lg:col-span-2">
          {{ actionError }}
        </p>
        <p v-if="actionMessage" class="rounded-3xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700 lg:col-span-2">
          {{ actionMessage }}
        </p>

        <div class="lg:col-span-2">
          <UiButton type="submit" color="blue" :loading="saving">
            Salvar perfil
          </UiButton>
        </div>
      </form>
    </section>

    <aside class="ip-card p-5">
      <h2 class="text-xl font-black text-slate-950">Resumo</h2>
      <div class="mt-5 space-y-4 text-sm">
        <div>
          <p class="text-slate-500">Headline</p>
          <p class="mt-1 font-semibold text-slate-950">{{ form.headline || 'Não definida' }}</p>
        </div>
        <div>
          <p class="text-slate-500">Localização</p>
          <p class="mt-1 font-semibold text-slate-950">
            {{ [form.city, form.state, form.country].filter(Boolean).join(', ') || 'Não definida' }}
          </p>
        </div>
        <div>
          <p class="text-slate-500">Links</p>
          <p class="mt-1 text-slate-600">
            {{ [form.linkedin_url, form.github_url, form.website_url].filter(Boolean).length }} preenchidos
          </p>
        </div>
      </div>
    </aside>
  </div>
</template>
