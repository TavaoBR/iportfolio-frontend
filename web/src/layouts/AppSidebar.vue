<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import UiButton from '@/components/ui/UiButton.vue'
import { useAuthStore } from '@/modules/auth/stores/useAuthStore'

/** Paleta alinhada à referência (JobsSpark) */
const SIDEBAR = {
  blue: '#1D7BFF',
  activeBg: '#EBF4FF',
  text: '#333333',
  muted: '#6B7280',
  divider: '#F3F4F6',
  star: '#93C5FD',
} as const

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const auth = useAuthStore()
const route = useRoute()
const userMenuOpen = ref(false)

const activeName = computed(() => route.name)

type AppRouteName =
  | 'dashboard'
  | 'portfolio'
  | 'resumes'
  | 'resume-new'
  | 'resume-edit'
  | 'resume-pick-template'
  | 'content-blocks'
  | 'templates-app'
  | 'profile'

type NavIconId =
  | 'dashboard'
  | 'homes'
  | 'job-offer'
  | 'applied'
  | 'saved'
  | 'message'
  | 'notification'
  | 'profile'
  | 'settings'
  | 'help'

const navPrimary: ReadonlyArray<{
  label: string
  to: { name: AppRouteName }
  icon: NavIconId
  activeWhen: ReadonlyArray<AppRouteName | string>
}> = [
  { label: 'Dashboard', to: { name: 'dashboard' }, icon: 'dashboard', activeWhen: ['dashboard'] },
  { label: 'Homes', to: { name: 'portfolio' }, icon: 'homes', activeWhen: ['portfolio'] },
  { label: 'Job offer', to: { name: 'resumes' }, icon: 'job-offer', activeWhen: ['resumes', 'resume-new', 'resume-edit', 'resume-pick-template'] },
  { label: 'Applied job', to: { name: 'content-blocks' }, icon: 'applied', activeWhen: ['content-blocks'] },
  { label: 'Saved job', to: { name: 'templates-app' }, icon: 'saved', activeWhen: ['templates-app'] },
]

const navMessages: ReadonlyArray<{ label: string; icon: NavIconId; disabled: true }> = [
  { label: 'Message', icon: 'message', disabled: true },
  { label: 'Notification', icon: 'notification', disabled: true },
]

const navAccount: ReadonlyArray<
  | { label: string; to: { name: AppRouteName }; icon: NavIconId; disabled?: false }
  | { label: string; icon: NavIconId; disabled: true }
> = [
  { label: 'My profile', to: { name: 'profile' }, icon: 'profile' },
  { label: 'Settings', icon: 'settings', disabled: true },
  { label: 'Help & Support', icon: 'help', disabled: true },
]

function isGroupActive(names: ReadonlyArray<string>): boolean {
  const n = String(activeName.value)
  return names.includes(n)
}

function toggleCollapsed() {
  emit('update:collapsed', !props.collapsed)
}

const userInitials = computed(() => {
  const name = auth.user?.name?.trim()
  const email = auth.user?.email?.trim()
  const base = name || email || '?'
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
  return base.slice(0, 2).toUpperCase()
})

const displayName = computed(() => {
  const n = auth.user?.name?.trim()
  if (n) return n.split(/\s+/)[0] ?? n
  return auth.user?.email?.split('@')[0] ?? 'User'
})

function closeUserMenu() {
  userMenuOpen.value = false
}

async function onSignOut() {
  closeUserMenu()
  await auth.signOut()
}

const navLinkClass = (active: boolean, collapsed: boolean) => [
  'group relative z-0 flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[12px] font-medium leading-tight outline-none transition-colors duration-200 ease-out',
  collapsed ? 'justify-center' : '',
  active ? 'text-[#1D7BFF] hover:bg-[#E2EEFC]/80' : 'text-[#333333] hover:bg-gray-50/90',
]

const iconClass = (active: boolean) => [
  'h-[15px] w-[15px] shrink-0 transition-colors duration-200',
  active ? 'text-[#1D7BFF]' : 'text-gray-500 group-hover:text-gray-700',
]
</script>

<template>
  <aside
    class="hidden min-h-0 w-full min-w-0 shrink-0 flex-col border-r bg-white antialiased transition-[width] duration-200 ease-out lg:fixed lg:inset-y-0 lg:left-0 lg:z-[35] lg:flex lg:min-h-0 lg:w-[var(--app-sidebar-w)]"
    :style="{ borderColor: SIDEBAR.divider }"
  >
    <!-- Cabeçalho: logo + colapsar -->
    <div
      class="flex shrink-0 items-center gap-2 px-2.5 py-3"
      :class="collapsed ? 'flex-col justify-center gap-2' : ''"
    >
      <RouterLink
        :to="{ name: 'dashboard' }"
        class="flex min-w-0 flex-1 items-center gap-2 rounded-lg p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[#1D7BFF]/25"
        :class="collapsed ? 'flex-none justify-center' : ''"
      >
        <span class="flex h-8 w-8 shrink-0 items-center justify-center" aria-hidden="true">
          <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              fill="#93C5FD"
              d="M12 2.25l1.62 4.98h5.24l-4.24 3.08 1.62 4.98L12 12.2l-4.24 3.08 1.62-4.98-4.24-3.08h5.24L12 2.25z"
            />
          </svg>
        </span>
        <span v-if="!collapsed" class="min-w-0 translate-y-px truncate font-semibold tracking-tight">
          <span class="text-[14px] text-[#333333]">Jobs</span><span class="text-[14px] font-semibold text-[#1D7BFF]">Spark</span>
        </span>
      </RouterLink>
      <button
        type="button"
        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-400 outline-none transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-[#1D7BFF]/25"
        :title="collapsed ? 'Expand menu' : 'Collapse menu'"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="toggleCollapsed"
      >
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <rect x="3" y="4" width="7" height="16" rx="1" />
          <rect x="14" y="4" width="7" height="16" rx="1" />
        </svg>
      </button>
    </div>

    <!-- Navegação (scroll só se viewport muito baixa) -->
    <nav
      class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden px-2.5 pb-2 pt-3 [scrollbar-width:thin]"
      aria-label="Main navigation"
    >
      <div class="flex flex-col gap-0.5">
        <RouterLink
          v-for="item in navPrimary"
          :key="item.label"
          :to="item.to"
          :class="navLinkClass(isGroupActive(item.activeWhen), collapsed)"
          :title="collapsed ? item.label : undefined"
        >
          <span
            class="pointer-events-none absolute inset-y-1 left-1 right-1 z-[-1] rounded-lg transition-colors duration-200 ease-out"
            :class="
              isGroupActive(item.activeWhen)
                ? 'bg-[#EBF4FF]'
                : 'bg-transparent group-hover:bg-gray-50/80'
            "
          />
          <svg v-if="item.icon === 'dashboard'" :class="iconClass(isGroupActive(item.activeWhen))" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-7.5Z" />
          </svg>
          <svg v-else-if="item.icon === 'homes'" :class="iconClass(isGroupActive(item.activeWhen))" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h4m8 2V7l-6-4-6 4-6-4v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1Z" />
          </svg>
          <svg v-else-if="item.icon === 'job-offer'" :class="iconClass(isGroupActive(item.activeWhen))" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8M8 14h5" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" />
            <path stroke-linecap="round" stroke-linejoin="round" d="m13 11 3-3m0 0 3 3m-3-3v8" />
          </svg>
          <svg v-else-if="item.icon === 'applied'" :class="iconClass(isGroupActive(item.activeWhen))" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h4m2-12 .667 4m4.333 0h-8.667M7 20h10a2 2 0 0 0 2-2V7l-3-3H7L4 7v11a2 2 0 0 0 2 2Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 3v4h-4" />
          </svg>
          <svg v-else :class="iconClass(isGroupActive(item.activeWhen))" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 4h12v14l-3-2-3 2-3-2-3 2V4Z" />
          </svg>
          <span v-if="!collapsed" class="relative z-10 min-w-0 truncate">{{ item.label }}</span>
        </RouterLink>
      </div>

      <div class="flex flex-col gap-0.5">
        <button
          v-for="item in navMessages"
          :key="item.label"
          type="button"
          disabled
          class="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[12px] font-medium text-gray-400 opacity-70"
          :class="collapsed ? 'justify-center' : ''"
          :title="collapsed ? `${item.label} (soon)` : 'Coming soon'"
        >
          <svg v-if="item.icon === 'message'" class="h-[15px] w-[15px] shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" d="M8 10c0-1.2.9-2.2 2.1-2.4.3-1.5 1.6-2.6 3.2-2.6 1.8 0 3.2 1.4 3.2 3.2V11h.5a2 2 0 0 1 2 2v.3c0 .8-.7 1.5-1.5 1.5H15" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 18h10l-1-4H8l-1 4Z" />
          </svg>
          <svg v-else class="h-[15px] w-[15px] shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0h6Z" />
          </svg>
          <span v-if="!collapsed">{{ item.label }}</span>
        </button>
      </div>

      <div class="flex flex-col gap-0.5">
        <template v-for="(item, idx) in navAccount" :key="idx">
          <RouterLink
            v-if="'to' in item"
            :to="item.to"
            :class="navLinkClass(isGroupActive(['profile']), collapsed)"
            :title="collapsed ? item.label : undefined"
          >
            <span
              class="pointer-events-none absolute inset-y-1 left-1 right-1 z-[-1] rounded-lg transition-colors duration-200 ease-out"
              :class="
                isGroupActive(['profile']) ? 'bg-[#EBF4FF]' : 'bg-transparent group-hover:bg-gray-50/80'
              "
            />
            <svg :class="iconClass(isGroupActive(['profile']))" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21a8 8 0 0 1 16 0v.5H4V21Z" />
            </svg>
            <span v-if="!collapsed" class="relative z-10 min-w-0 truncate">{{ item.label }}</span>
          </RouterLink>
          <button
            v-else
            type="button"
            disabled
            class="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[12px] font-medium text-gray-400 opacity-70"
            :class="collapsed ? 'justify-center' : ''"
            :title="collapsed ? `${item.label} (soon)` : 'Coming soon'"
          >
            <svg v-if="item.icon === 'settings'" class="h-[15px] w-[15px] shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 8-.9 1.7a1 1 0 0 0 .1 1.1l1.1 1.5-2 2-1.5-1.1a1 1 0 0 1-1.1-.1L13 12l-1.7.9a1 1 0 0 1-1.1.1l-1.5-1.1-2 2 1.1 1.5a1 1 0 0 0 .1 1.1L8 19l-2-.5-.5-2 1.7-.9a1 1 0 0 0 .1-1.1L5.2 13l2-2 1.5 1.1a1 1 0 0 0 1.1-.1L11 8l.9-1.7a1 1 0 0 1 1.1-.1l1.5 1.1 2-2-1.1-1.5a1 1 0 0 0-.1-1.1L16 5l2 .5.5 2Z" />
            </svg>
            <svg v-else class="h-[15px] w-[15px] shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="9" />
              <path stroke-linecap="round" d="M9.5 9.5a2.5 2.5 0 0 1 3.35-.12c.55.45.88 1.1.88 1.87 0 1.2-.9 1.75-1.55 2.45-.35.38-.68.78-.68 1.3V15" />
              <circle cx="12" cy="17.5" r="0.75" fill="currentColor" stroke="none" />
            </svg>
            <span v-if="!collapsed">{{ item.label }}</span>
          </button>
        </template>
      </div>
    </nav>

    <!-- Rodapé: card + perfil -->
    <div class="shrink-0 space-y-2.5 px-2.5 pb-3 pt-2.5">
      <div
        v-if="!collapsed"
        class="relative overflow-hidden rounded-lg px-2.5 py-3 text-center shadow-sm"
        :style="{
          background: `linear-gradient(135deg, ${SIDEBAR.blue} 0%, #1568e0 55%, ${SIDEBAR.blue} 100%)`,
        }"
      >
        <div
          class="pointer-events-none absolute -bottom-6 -right-4 h-20 w-20 rounded-full bg-black/10"
          aria-hidden="true"
        />
        <p class="relative z-10 px-1 text-[11px] font-medium leading-snug text-white">
          Experience the improved dashboard
        </p>
        <UiButton
          color="light"
          class="relative z-10 mt-2.5 !h-8 w-full !rounded-md !border-0 !bg-white !px-2 !text-[11px] !font-semibold !text-[#1D7BFF] !shadow-none hover:!bg-gray-50"
          :to="{ name: 'templates-app' }"
        >
          Upgrade plan
        </UiButton>
      </div>

      <RouterLink
        v-else
        :to="{ name: 'templates-app' }"
        class="mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#1D7BFF]/40"
        :style="{ backgroundColor: SIDEBAR.blue }"
        title="Upgrade plan"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8-8 8-4-4-6 6" />
        </svg>
      </RouterLink>

      <div
        v-if="userMenuOpen"
        class="fixed inset-0 z-40 bg-transparent lg:absolute lg:inset-0 lg:bg-transparent"
        aria-hidden="true"
        @click="closeUserMenu"
      />

      <div class="relative flex items-center gap-2 rounded-lg px-1 py-1" :class="collapsed ? 'flex-col' : ''">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-gradient-to-br from-gray-100 to-gray-200 text-[10px] font-bold text-gray-600"
        >
          {{ userInitials }}
        </div>
        <div v-if="!collapsed" class="min-w-0 flex-1">
          <p class="truncate text-[12px] font-semibold leading-tight text-[#333333]">{{ displayName }}</p>
          <p class="truncate text-[10px] font-medium leading-tight text-[#6B7280]">Premium User</p>
        </div>
        <div v-if="!collapsed" class="relative shrink-0">
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 outline-none transition hover:bg-gray-100 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-[#1D7BFF]/25"
            :aria-expanded="userMenuOpen"
            aria-haspopup="true"
            aria-label="Account menu"
            @click.stop="userMenuOpen = !userMenuOpen"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
          <div
            v-if="userMenuOpen"
            class="absolute bottom-full right-0 z-50 mb-1 w-36 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg"
            role="menu"
            @click.stop
          >
            <button
              type="button"
              class="block w-full px-3 py-2 text-left text-[12px] font-medium text-gray-700 hover:bg-gray-50"
              role="menuitem"
              @click="onSignOut"
            >
              Sair
            </button>
          </div>
        </div>
        <button
          v-if="collapsed"
          type="button"
          class="text-gray-400 hover:text-gray-600"
          title="Sign out"
          aria-label="Sign out"
          @click="onSignOut"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>
