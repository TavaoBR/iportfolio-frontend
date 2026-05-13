<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import UiButton from '@/components/ui/UiButton.vue'
import UiInput from '@/components/ui/UiInput.vue'
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
      class="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-700"
      role="status"
    >
      Conta criada. Entre com o seu email e palavra-passe.
    </p>

    <form class="space-y-4" @submit.prevent="submit">
      <UiInput
        v-model="email"
        label="Email"
        type="email"
        autocomplete="username"
        placeholder="seu@email.com"
        required
      />
      <UiInput
        v-model="password"
        label="Palavra-passe"
        type="password"
        autocomplete="current-password"
        placeholder="Digite a sua palavra-passe"
        required
      />

      <div class="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <label class="inline-flex items-center gap-2 text-slate-500">
          <input
            type="checkbox"
            class="h-3.5 w-3.5 rounded border-slate-300 bg-white text-blue-500 focus:ring-blue-500"
          />
          Lembrar de mim
        </label>
        <span class="font-semibold text-slate-500">Esqueceu a palavra-passe?</span>
      </div>

      <p v-if="errorMessage" class="rounded-2xl bg-red-50 p-3 text-xs font-bold text-red-600" role="alert">
        {{ errorMessage }}
      </p>

      <UiButton type="submit" color="blue" class="mt-3 w-full" :loading="loading">
        Entrar
      </UiButton>

      <p class="pt-1 text-center text-xs text-slate-500">
        Não possui registro?
        <RouterLink :to="{ name: 'register' }" class="font-black text-blue-600 hover:underline">
          Clique aqui para criar conta.
        </RouterLink>
      </p>
    </form>
  </AuthFormShell>
</template>
