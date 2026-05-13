<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    kind: 'email' | 'phone' | 'location' | 'link'
    text: string
    variant?: 'default' | 'inverse' | 'warm'
    /** `md` — ícones e texto mais fortes (ex.: cabeçalho tipo carta) */
    size?: 'sm' | 'md'
  }>(),
  { variant: 'default', size: 'sm' },
)
</script>

<template>
  <p
    class="flex items-start gap-2.5 leading-snug"
    :class="[
      props.size === 'md' ? 'text-[12px]' : 'text-[11px]',
      props.variant === 'inverse'
        ? 'text-white/85'
        : props.variant === 'warm'
          ? 'text-stone-700'
          : 'text-zinc-600',
    ]"
  >
    <span
      class="mt-0.5 inline-flex shrink-0"
      :class="[
        props.size === 'md' ? 'h-5 w-5' : 'h-4 w-4',
        props.variant === 'inverse'
          ? 'text-white/70'
          : props.variant === 'warm'
            ? 'text-stone-600'
            : 'text-zinc-400',
      ]"
      aria-hidden="true"
    >
      <svg
        v-if="props.kind === 'email'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        :stroke-width="props.size === 'md' ? 2 : 1.75"
        class="h-full w-full"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <svg
        v-else-if="props.kind === 'phone'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        :stroke-width="props.size === 'md' ? 2 : 1.75"
        class="h-full w-full"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      <svg
        v-else-if="props.kind === 'location'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        :stroke-width="props.size === 'md' ? 2 : 1.75"
        class="h-full w-full"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="props.size === 'md' ? 2 : 1.75" class="h-full w-full">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    </span>
    <span class="min-w-0 break-words font-sans font-medium">{{ text }}</span>
  </p>
</template>
