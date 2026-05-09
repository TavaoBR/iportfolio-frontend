<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { FwbButton, FwbInput } from 'flowbite-vue'
import AuthFormShell from '../components/AuthFormShell.vue'
import { useAuthStore } from '../stores/useAuthStore'
import { ApiError } from '@/types/api'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const registeredOk = computed(() => route.query.registered === '1')

async function submit() {
  errorMessage.value = ''
  loading.value = true
  try {
    await auth.signIn({ email: email.value, password: password.value })
    const redirect =
      typeof route.query.redirect === 'string' ? route.query.redirect : { name: 'dashboard' }
    await router.push(redirect)
  } catch (e) {
    if (e instanceof ApiError) {
      errorMessage.value = e.message
    } else {
      errorMessage.value = 'Não foi possível entrar. Verifique a API e as credenciais.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthFormShell
    title="Entrar na sua conta"
    subtitle="Acesse o painel para gerir currículos, portfólios e templates da plataforma."
  >
    <p
      v-if="registeredOk"
      class="mb-4 rounded-xl border border-green-400/20 bg-green-400/10 p-3 text-xs font-medium text-green-200"
      role="status"
    >
      Conta criada. Entre com o seu email e palavra-passe.
    </p>

    <form class="space-y-4" @submit.prevent="submit">
      <FwbInput
        v-model="email"
        label="Email"
        type="email"
        autocomplete="username"
        placeholder="seu@email.com"
        input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white !shadow-sm placeholder:!text-gray-600"
        label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
        required
      />
      <FwbInput
        v-model="password"
        label="Palavra-passe"
        type="password"
        autocomplete="current-password"
        placeholder="Digite a sua palavra-passe"
        input-class="!rounded-xl !border-white/10 !bg-black/30 !px-4 !py-3 !text-sm !text-white !shadow-sm placeholder:!text-gray-600"
        label-class="!mb-1.5 !text-xs !font-bold !text-gray-200"
        required
      />

      <div class="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <label class="inline-flex items-center gap-2 text-gray-500">
          <input
            type="checkbox"
            class="h-3.5 w-3.5 rounded border-white/20 bg-black/30 text-violet-500 focus:ring-violet-500"
          />
          Lembrar de mim
        </label>
        <span class="font-semibold text-gray-300">Esqueceu a palavra-passe?</span>
      </div>

      <p v-if="errorMessage" class="rounded-xl bg-red-500/10 p-3 text-xs text-red-200" role="alert">
        {{ errorMessage }}
      </p>

      <FwbButton
        type="submit"
        color="purple"
        class="!mt-3 w-full !rounded-xl !py-3 !text-sm !font-bold"
        :loading="loading"
      >
        Entrar
      </FwbButton>

      <p class="pt-1 text-center text-xs text-gray-500">
        Não possui registro?
        <RouterLink :to="{ name: 'register' }" class="font-bold text-gray-200 hover:underline">
          Clique aqui para criar conta.
        </RouterLink>
      </p>
    </form>
  </AuthFormShell>
</template>
