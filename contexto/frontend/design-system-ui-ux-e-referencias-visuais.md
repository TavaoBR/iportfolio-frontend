# Design system, UI/UX e referências visuais

## Objetivos do design na plataforma

1. **Coerência** — mesma linguagem de cor, tipo e espaçamento em dashboard, editor e pagamentos.
2. **Velocidade** — Flowbite como base; personalização via wrappers em `components/ui/`.
3. **Confiança** — fluxos de pagamento com feedback explícito (loading, sucesso, erro).
4. **Profissionalismo** — editor focado no conteúdo do CV; evitar decoração excessiva na área de trabalho.

## Pilares de identidade (valores de produto)

| Pilar | Implicação na UI |
|-------|------------------|
| Profissional e claro | Hierarquia tipográfica legível; densidade controlada no editor |
| Moderno | Espaçamento generoso, raios e sombras subtis, componentes atuais |
| Confiança | Estados de sistema visíveis; mensagens humanas em erro |

**Nota:** hex, escalas completas de cor e famílias finais devem ser fixados em Figma (ou ferramenta equivalente) e espelhados no `tailwind.config` / `@theme` (Tailwind v4).

## Tailwind como fonte de tokens

- Quando a identidade estiver fechada: estender tema com escala `brand` (50–900), como em `docs/04`.
- **Na SPA (`web/`):** até existir essa escala acordada, usar **tema default Flowbite** + utilitários neutros (`gray-*`, `blue-*`); não introduzir paleta `brand-*` arbitrária sem decisão de produto.
- **Dark mode:** se ativado, usar estratégia `class` (`dark:`) e validar componentes Flowbite; documentar decisão sim/não no repositório de código.

## Flowbite (Vue)

- Usar componentes documentados (modal, dropdown, tabs, forms) para reduzir regressões de acessibilidade.
- Import **por componente** ou registo consciente para **tree-shaking** — evitar import desordenado de toda a biblioteca.

## Camada `components/ui/` (wrappers)

Criar wrappers finos que concentram mudanças futuras de kit UI:

- `AppButton.vue` — variantes da marca mapeadas para o botão Flowbite.
- `AppCard.vue` — padding, sombra e raio padronizados para listagens (templates, currículos).
- `AppFormField.vue` — label, erro, hint consistentes (ligação a 422).

Se o kit mudar, o impacto concentra-se em `components/ui/`.

## Layout e grelha (padrões)

| Contexto | Orientação |
|----------|------------|
| Dashboard | `max-w-7xl`, gutters consistentes (`px-4` → `sm:px-6` → `lg:px-8`) |
| Editor de CV | Área central tipo “folha” `max-w-3xl` para aproximar preview ao PDF |
| Mobile | Navegação inferior ou menu colapsável; ações críticas sempre acessíveis |

## Estados de interface (padronizar)

- **Loading** — skeleton ou spinner discreto; nunca página em branco sem feedback.
- **Empty** — mensagem curta + CTA primário (ex.: “Criar primeiro currículo”).
- **Erro** — mensagem humana + ação “Tentar novamente”; **402** com CTA “Desbloquear template”.
- **Sucesso** — confirmação breve (toast ou inline) após ações destrutivas ou pagamento.

## Animações e comportamento visual

- Transições **curtas** e funcionais (abertura de modal, `opacity` em skeleton).
- Respeitar **`prefers-reduced-motion`** para animações não essenciais (ver `performance-a11y-seo-responsivo.md`).
- Evitar autoplay agressivo ou movimento que distraia na leitura do CV.

## Pasta `template-plataforma/` (referência de produto)

Contém capturas **WebP** de telas desejadas da **própria plataforma** (não dos CVs dos utilizadores), incluindo variantes sob `template-plataforma/login/`.

### Como usar na implementação

1. Abrir os ficheiros localmente ou no visualizador do IDE para alinhar **composição**, **hierarquia** e **ritmo visual**.
2. Traduzir para código com **Flowbite + Tailwind**, não com CSS ad-hoc que duplique outro sistema.
3. Garantir **mesmos padrões** em todas as áreas autenticadas: cartões, formulários, espaçamento vertical entre secções, hierarquia de títulos.

### O que extrair das referências (checklist para IA/desenvolvedor)

- Hierarquia: título da página vs subtítulos vs corpo.
- Agrupamento: cartões, listas, separadores.
- Ações primárias vs secundárias (cor, tamanho, posição).
- Formulários: labels, placeholders, estados de foco.
- Responsividade implícita: larguras de coluna e empilhamento esperável em mobile.

*(Os ficheiros atuais são imagens; não substituem tokens numéricos — estes vivem no Tailwind/theme.)*

## Pasta `templates-cv/` (referência de output)

Previews de **templates de currículo/portfólio** que os utilizadores escolhem. Metadados canónicos (`template_key`, preço, `preview_url`) vêm da **API**; as imagens aqui complementam design e marketing.

Ver também: `templates-cv-renderer-e-assets.md` e `templates-cv/README.md`.

## Documentação viva

- Princípios neste ficheiro; **valores exatos** no código (`tailwind.config` / CSS theme) e no Figma.
- Screenshots da app implementada devem convergir com `template-plataforma/` antes de release visual maior.

## Referências

- `docs/04-design-system-e-identidade-visual.md`
- [Flowbite Vue](https://flowbite-vue.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
