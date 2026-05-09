import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/useAuthStore'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicShellLayout.vue'),
      meta: { public: true },
      children: [
        {
          path: '',
          name: 'home',
          meta: { title: 'Home', public: true },
          component: () => import('@/pages/HomePage.vue'),
        },
      ],
    },
    {
      path: '/templates',
      component: () => import('@/layouts/PublicShellLayout.vue'),
      meta: { public: true },
      children: [
        {
          path: '',
          name: 'templates-public',
          meta: { title: 'Templates', public: true },
          component: () => import('@/pages/TemplatesCatalogPage.vue'),
        },
      ],
    },
    {
      path: '/login',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { public: true },
      children: [
        {
          path: '',
          name: 'login',
          meta: { title: 'Entrar', public: true },
          component: () => import('@/modules/auth/pages/LoginPage.vue'),
        },
      ],
    },
    {
      path: '/registar',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { public: true },
      children: [
        {
          path: '',
          name: 'register',
          meta: { title: 'Criar conta', public: true },
          component: () => import('@/modules/auth/pages/RegisterPage.vue'),
        },
      ],
    },
    {
      path: '/p/:slug',
      name: 'public-portfolio',
      meta: { title: 'Portfólio', public: true },
      component: () => import('@/modules/portfolio/pages/PublicPortfolioPage.vue'),
    },
    {
      path: '/app',
      component: () => import('@/layouts/AppShellLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          meta: { title: 'Visão geral' },
          component: () => import('@/pages/DashboardPage.vue'),
        },
        {
          path: 'content-blocks',
          name: 'content-blocks',
          meta: { title: 'Informações profissionais' },
          component: () => import('@/modules/content-blocks/pages/ContentBlocksPage.vue'),
        },
        {
          path: 'resumes',
          name: 'resumes',
          meta: { title: 'Currículo' },
          component: () => import('@/modules/resume/pages/ResumeListPage.vue'),
        },
        {
          path: 'resumes/:publicId',
          name: 'resume-edit',
          meta: { title: 'Editor de CV' },
          component: () => import('@/modules/resume/pages/ResumeEditPage.vue'),
        },
        {
          path: 'templates',
          name: 'templates-app',
          meta: { title: 'Templates e visual' },
          component: () => import('@/modules/templates/pages/TemplatesAppPage.vue'),
        },
        {
          path: 'portfolio',
          name: 'portfolio',
          meta: { title: 'Portfólio' },
          component: () => import('@/modules/portfolio/pages/PortfolioEditorPage.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          meta: { title: 'Dados pessoais' },
          component: () => import('@/modules/profile/pages/ProfilePage.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'templates-public' && auth.isAuthenticated) {
    return { name: 'templates-app' }
  }
  const matched = [...to.matched].reverse()
  const metaTitle = matched.find((r) => typeof r.meta.title === 'string')?.meta.title
  const title = typeof metaTitle === 'string' ? metaTitle : 'iPortfolio'
  document.title = `${title} · iPortfolio`
})
