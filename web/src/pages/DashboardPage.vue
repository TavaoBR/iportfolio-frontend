<script setup lang="ts">
const stats = [
  { title: 'Currículos criados', value: '12', detail: '4 publicados', percent: '72%' },
  { title: 'Portfólios ativos', value: '3', detail: '1 em revisão', percent: '48%' },
  { title: 'Templates salvos', value: '18', detail: '6 favoritos', percent: '64%' },
]

const tasks = [
  { id: '003', name: 'Revisar resumo profissional', status: 'To do', date: '12/05/26', tag: 'Currículo', priority: 'Alta' },
  { id: '018', name: 'Atualizar projetos em destaque', status: 'To do', date: '14/05/26', tag: 'Portfólio', priority: 'Alta' },
  { id: '015', name: 'Selecionar template principal', status: 'Doing', date: '16/05/26', tag: 'Template', priority: 'Média' },
  { id: '021', name: 'Publicar página pública', status: 'Review', date: '18/05/26', tag: 'Publicação', priority: 'Média' },
]

const todos = [
  'Adicionar experiências recentes',
  'Conferir dados de contato',
  'Exportar currículo em PDF',
]

const workflow = [
  {
    step: '1',
    title: 'Complete o perfil profissional',
    text: 'Dados pessoais, resumo, skills, experiências e formação são a base do currículo.',
  },
  {
    step: '2',
    title: 'Gere o currículo',
    text: 'Escolha um template, revise as secções e exporte o PDF.',
  },
  {
    step: '3',
    title: 'Publique o portfólio',
    text: 'Use projetos e informações do perfil para montar sua página pública.',
  },
]
</script>

<template>
  <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
    <section class="ip-card-strong p-6 xl:col-span-2">
      <div class="mb-5">
        <p class="text-xs font-black uppercase tracking-[0.22em] text-[var(--ip-primary)]">Painel de criação</p>
        <h1 class="mt-2 text-3xl font-black tracking-tight text-slate-950">Construa sua presença profissional</h1>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          O currículo, os templates e o portfólio são gerados a partir das mesmas informações do seu perfil profissional.
        </p>
      </div>
      <div class="grid gap-3 md:grid-cols-3">
        <article
          v-for="item in workflow"
          :key="item.step"
          class="rounded-3xl border border-slate-100 bg-white/75 p-4 shadow-sm"
        >
          <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--ip-primary)] text-sm font-black text-white shadow-[0_12px_28px_rgba(58,134,255,0.25)]">
            {{ item.step }}
          </span>
          <h2 class="mt-4 font-black text-slate-950">{{ item.title }}</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500">{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-3 xl:col-span-2">
      <article
        v-for="stat in stats"
        :key="stat.title"
        class="ip-card p-5"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-black text-slate-950">{{ stat.title }}</p>
            <p class="mt-2 text-3xl font-black tracking-tight text-slate-950">{{ stat.value }}</p>
          </div>
          <span class="rounded-2xl border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-400">↗</span>
        </div>
        <p class="mt-1 text-xs font-bold text-[var(--ip-primary)]">{{ stat.percent }} completo</p>
        <div class="mt-3 h-2 rounded-full bg-slate-100">
          <div class="h-full rounded-full bg-[var(--ip-primary)]" :style="{ width: stat.percent }" />
        </div>
        <p class="mt-3 text-xs text-slate-500">{{ stat.detail }}</p>
      </article>
    </section>

    <section class="ip-card p-5 xl:row-span-2">
      <div class="mb-5">
        <h2 class="text-base font-black text-slate-950">Progresso do perfil</h2>
        <p class="text-sm text-slate-500">Acompanhe a preparação para publicação.</p>
      </div>
      <div class="mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-[conic-gradient(#3a86ff_0_68%,#e2e8f0_68%_100%)]">
        <div class="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
          <strong class="text-3xl text-slate-950">68%</strong>
          <span class="text-xs text-slate-500">completo</span>
        </div>
      </div>
      <div class="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div class="rounded-2xl bg-slate-50 p-3">
          <p class="font-bold text-slate-950">CV</p>
          <p class="text-xs text-slate-500">Pronto para revisão</p>
        </div>
        <div class="rounded-2xl bg-slate-50 p-3">
          <p class="font-bold text-slate-950">Portfólio</p>
          <p class="text-xs text-slate-500">Faltam projetos</p>
        </div>
      </div>
    </section>

    <section class="ip-card p-5">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-black text-slate-950">Tarefas de preparação</h2>
          <p class="text-sm text-slate-500">Atividades para deixar seu perfil pronto.</p>
        </div>
        <div class="flex gap-2">
          <button class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">Ver tudo</button>
          <button class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">Exportar</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[680px] text-left text-sm">
          <thead class="border-y border-slate-100 bg-slate-50 text-xs text-slate-500">
            <tr>
              <th class="px-3 py-3 font-bold">#</th>
              <th class="px-3 py-3 font-bold">Nome</th>
              <th class="px-3 py-3 font-bold">Status</th>
              <th class="px-3 py-3 font-bold">Data</th>
              <th class="px-3 py-3 font-bold">Tag</th>
              <th class="px-3 py-3 font-bold">Prioridade</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="task in tasks" :key="task.id">
              <td class="px-3 py-4 font-bold text-slate-950">{{ task.id }}</td>
              <td class="px-3 py-4 font-semibold text-slate-950">{{ task.name }}</td>
              <td class="px-3 py-4 text-slate-500">{{ task.status }}</td>
              <td class="px-3 py-4 text-slate-500">{{ task.date }}</td>
              <td class="px-3 py-4 font-semibold text-slate-950">{{ task.tag }}</td>
              <td class="px-3 py-4 text-slate-500">{{ task.priority }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="ip-card p-5">
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-black text-slate-950">Meus próximos passos</h2>
          <p class="text-sm text-slate-500">Tudo que precisa ser feito em um só lugar.</p>
        </div>
        <button class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">+ Novo</button>
      </div>

      <div class="space-y-3">
        <label
          v-for="todo in todos"
          :key="todo"
          class="flex items-start gap-3 rounded-3xl border border-slate-100 bg-slate-50/80 p-4"
        >
          <input type="checkbox" class="mt-1 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-600" />
          <span>
            <span class="block text-sm font-bold text-slate-950">{{ todo }}</span>
            <span class="mt-1 block text-xs text-slate-500">Organize a informação antes de publicar.</span>
          </span>
        </label>
      </div>
    </section>

    <section class="ip-card p-5">
      <h2 class="text-base font-black text-slate-950">Distribuição de conteúdo</h2>
      <p class="text-sm text-slate-500">Categorias usadas nos templates.</p>
      <div class="mt-5 grid grid-cols-2 gap-5">
        <div class="flex h-40 items-center justify-center rounded-full bg-[conic-gradient(#7c3aed_0_34%,#ef704f_34%_59%,#e7c95f_59%_78%,#25434d_78%_100%)]">
          <div class="h-24 w-24 rounded-full bg-white" />
        </div>
        <div class="space-y-3 self-center text-sm text-slate-600">
          <p class="flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-violet-600" /> Experiência</p>
          <p class="flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-[#ef704f]" /> Projetos</p>
          <p class="flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-[#e7c95f]" /> Skills</p>
          <p class="flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-[#25434d]" /> Formação</p>
        </div>
      </div>
    </section>
  </div>
</template>
