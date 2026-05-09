<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { FwbButton, FwbInput } from 'flowbite-vue'
import AuthFormShell from '../components/AuthFormShell.vue'
import AvatarUploader from '@/modules/profile/components/AvatarUploader.vue'
import { register } from '@/modules/profile/services/usersApi'
import { ApiError } from '@/types/api'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const avatar = ref<string | null>(null)
const errorMessage = ref('')
const loading = ref(false)

async function submit() {
  errorMessage.value = ''
  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'As palavras-passe não coincidem.'
    return
  }
  loading.value = true
  try {
    await register({
      name: name.value,
      email: email.value,
      password: password.value,
      avatar: avatar.value,
    })
    await router.push({ name: 'login', query: { registered: '1' } })
  } catch (e) {
    if (e instanceof ApiError) {
      errorMessage.value = e.message
    } else {
      errorMessage.value = 'Não foi possível criar a conta. Verifique a API e os dados.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthFormShell
    title="Criar conta"
    subtitle="Configure o acesso e personalize seu perfil para começar a montar currículos e portfólios."
  >
    <form class="space-y-3" @submit.prevent="submit">
      <section class="space-y-2">
        <div>
          <h2 class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Dados da conta</h2>
          <p class="mt-0.5 text-[11px] text-gray-500">Informe os dados principais do seu perfil.</p>
        </div>

        <div class="space-y-2.5">
          <FwbInput
            v-model="name"
            label="Nome completo"
            type="text"
            autocomplete="name"
            placeholder="Ex.: James Gustavo"
            input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white !shadow-sm placeholder:!text-gray-600"
            label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
            required
          />
          <FwbInput
            v-model="email"
            label="Email"
            type="email"
            autocomplete="email"
            placeholder="seu@email.com"
            input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white !shadow-sm placeholder:!text-gray-600"
            label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
            required
          />
        </div>
      </section>

      <section class="space-y-2">
        <div>
          <h2 class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Segurança</h2>
          <p class="mt-0.5 text-[11px] text-gray-500">Defina a palavra-passe de acesso.</p>
        </div>

        <div class="space-y-2.5">
          <FwbInput
            v-model="password"
            label="Palavra-passe"
            type="password"
            autocomplete="off"
            placeholder="Crie uma palavra-passe"
            input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white !shadow-sm placeholder:!text-gray-600"
            label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
            required
          />
          <FwbInput
            v-model="passwordConfirmation"
            label="Confirmar palavra-passe"
            type="password"
            autocomplete="off"
            placeholder="Repita a palavra-passe"
            input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white !shadow-sm placeholder:!text-gray-600"
            label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
            required
          />
        </div>
      </section>

      <section class="space-y-2">
        <div>
          <h2 class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Perfil</h2>
          <p class="mt-0.5 text-[11px] text-gray-500">Adicione uma foto opcional.</p>
        </div>

        <AvatarUploader v-model="avatar" :name="name" />
      </section>

      <p v-if="errorMessage" class="rounded-xl bg-red-500/10 p-3 text-xs text-red-200" role="alert">
        {{ errorMessage }}
      </p>

      <FwbButton
        type="submit"
        color="purple"
        class="!mt-2 w-full !rounded-xl !py-3 !text-sm !font-bold"
        :loading="loading"
      >
        Criar conta
      </FwbButton>

      <p class="text-center text-xs text-gray-500">
        Já possui uma conta?
        <RouterLink :to="{ name: 'login' }" class="font-bold text-gray-200 hover:underline">
          Clique aqui para entrar.
        </RouterLink>
      </p>
    </form>
  </AuthFormShell>
</template>
