import 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    public?: boolean
    title?: string
    /** Trilho de navegação na barra superior da área autenticada */
    breadcrumb?: ReadonlyArray<{ label: string; to?: RouteLocationRaw }>
    /**
     * Conteúdo full-bleed: o shell não faz scroll no `RouterView`; o filho gere
     * `overflow` (ex.: construtor de CV com duas colunas).
     */
    resumeEditorShell?: boolean
  }
}
