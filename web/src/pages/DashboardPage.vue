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
    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] xl:col-span-2">
      <div class="mb-5">
        <h1 class="text-2xl font-black text-white">Construa sua presença profissional</h1>
        <p class="mt-1 max-w-3xl text-sm text-gray-500">
          O currículo, os templates e o portfólio são gerados a partir das mesmas informações do seu perfil profissional.
        </p>
      </div>
      <div class="grid gap-3 md:grid-cols-3">
        <article
          v-for="item in workflow"
          :key="item.step"
          class="rounded-2xl border border-white/10 bg-black/20 p-4"
        >
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm font-black text-white">
            {{ item.step }}
          </span>
          <h2 class="mt-4 font-black text-white">{{ item.title }}</h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-3 xl:col-span-2">
      <article
        v-for="stat in stats"
        :key="stat.title"
        class="rounded-2xl border border-white/10 bg-[#111019] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-black text-white">{{ stat.title }}</p>
            <p class="mt-2 text-3xl font-black tracking-tight text-white">{{ stat.value }}</p>
          </div>
          <span class="rounded-xl border border-white/10 px-2.5 py-1 text-xs text-gray-500">↗</span>
        </div>
        <p class="mt-1 text-xs text-violet-300">{{ stat.percent }} completo</p>
        <div class="mt-3 h-2 rounded-full bg-white/10">
          <div class="h-full rounded-full bg-violet-600" :style="{ width: stat.percent }" />
        </div>
        <p class="mt-3 text-xs text-gray-500">{{ stat.detail }}</p>
      </article>
    </section>

    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] xl:row-span-2">
      <div class="mb-5">
        <h2 class="text-base font-black text-white">Progresso do perfil</h2>
        <p class="text-sm text-gray-500">Acompanhe a preparação para publicação.</p>
      </div>
      <div class="mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-[conic-gradient(#7c3aed_0_68%,rgba(255,255,255,0.08)_68%_100%)]">
        <div class="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#111019]">
          <strong class="text-3xl text-white">68%</strong>
          <span class="text-xs text-gray-500">completo</span>
        </div>
      </div>
      <div class="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div class="rounded-xl bg-black/30 p-3">
          <p class="font-bold text-white">CV</p>
          <p class="text-xs text-gray-500">Pronto para revisão</p>
        </div>
        <div class="rounded-xl bg-black/30 p-3">
          <p class="font-bold text-white">Portfólio</p>
          <p class="text-xs text-gray-500">Faltam projetos</p>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-black text-white">Tarefas de preparação</h2>
          <p class="text-sm text-gray-500">Atividades para deixar seu perfil pronto.</p>
        </div>
        <div class="flex gap-2">
          <button class="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-gray-300">Ver tudo</button>
          <button class="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-gray-300">Exportar</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[680px] text-left text-sm">
          <thead class="border-y border-white/10 bg-black/30 text-xs text-gray-500">
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
              <td class="px-3 py-4 font-bold text-white">{{ task.id }}</td>
              <td class="px-3 py-4 font-semibold text-white">{{ task.name }}</td>
              <td class="px-3 py-4 text-gray-400">{{ task.status }}</td>
              <td class="px-3 py-4 text-gray-400">{{ task.date }}</td>
              <td class="px-3 py-4 font-semibold text-white">{{ task.tag }}</td>
              <td class="px-3 py-4 text-gray-400">{{ task.priority }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-black text-white">Meus próximos passos</h2>
          <p class="text-sm text-gray-500">Tudo que precisa ser feito em um só lugar.</p>
        </div>
        <button class="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-gray-300">+ Novo</button>
      </div>

      <div class="space-y-3">
        <label
          v-for="todo in todos"
          :key="todo"
          class="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
        >
          <input type="checkbox" class="mt-1 rounded border-white/20 bg-black/30 text-violet-600 focus:ring-violet-600" />
          <span>
            <span class="block text-sm font-bold text-white">{{ todo }}</span>
            <span class="mt-1 block text-xs text-gray-500">Organize a informação antes de publicar.</span>
          </span>
        </label>
      </div>
    </section>

    <section class="rounded-2xl border border-white/10 bg-[#111019] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <h2 class="text-base font-black text-white">Distribuição de conteúdo</h2>
      <p class="text-sm text-gray-500">Categorias usadas nos templates.</p>
      <div class="mt-5 grid grid-cols-2 gap-5">
        <div class="flex h-40 items-center justify-center rounded-full bg-[conic-gradient(#7c3aed_0_34%,#ef704f_34%_59%,#e7c95f_59%_78%,#25434d_78%_100%)]">
          <div class="h-24 w-24 rounded-full bg-[#111019]" />
        </div>
        <div class="space-y-3 self-center text-sm text-gray-300">
          <p class="flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-violet-600" /> Experiência</p>
          <p class="flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-[#ef704f]" /> Projetos</p>
          <p class="flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-[#e7c95f]" /> Skills</p>
          <p class="flex items-center gap-2"><span class="h-3 w-3 rounded-sm bg-[#25434d]" /> Formação</p>
        </div>
      </div>
    </section>
  </div>
</template>
