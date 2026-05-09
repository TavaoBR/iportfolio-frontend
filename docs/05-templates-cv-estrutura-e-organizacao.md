# 05 — Estrutura e organização dos templates de currículo

Alinha a **experiência do utilizador** (escolher template, preencher secções, exportar) com o **modelo de dados** da API e com os **ativos visuais** em `templates-cv/`.

## Modelo conceitual

| Conceito | Onde vive |
|----------|-----------|
| Metadados do template (`template_key`, `name`, `type`, `is_premium`, `premium_price`, `preview_url`, `section_schema`) | API — `GET /api/templates`, `GET /api/me/templates` |
| Direito de uso (`can_use`, `bundle_ref`) | API — lista autenticada |
| **Renderização** (HTML/CSS/layout) | Frontend — componente ou pacote mapeado por `template_key` |
| **Referências visuais** (imagens, notas) | Repo de contexto — `templates-cv/` |

## Mapeamento `template_key` → implementação

No código da aplicação (noutro repositório), manter um **registo explícito**:

```ts
// Conceito — localização real: src/modules/templates/registry.ts
import ResumeClassic from './renders/ResumeClassic.vue'

export const resumeTemplateRegistry: Record<string, Component> = {
  resume_classic: ResumeClassic,
  resume_minimal: ResumeMinimal,
  // ...
}
```

- **Chaves desconhecidas:** fallback (ex.: `resume_classic`) + log/telemetria para alertar admin.
- **Templates premium sem `can_use`:** mostrar preview mas bloquear aplicação no editor com mesma regra da API (e tratar 402).

## `section_schema` (API)

O campo `section_schema` (JSON) descreve secções sugeridas: tipos, ordem, labels. O frontend deve:

1. Usar o schema para **montar o editor** (quais blocos aparecem, ordem inicial).
2. Continuar a respeitar a API como fonte de verdade das **secções persistidas** (`GET/POST .../sections`).

Se o schema e as secções divergirem, definir política: *schema só para inicialização* vs *sincronização guiada*.

## Pasta `templates-cv/` (este repositório)

Ver [templates-cv/README.md](../templates-cv/README.md).

Previews sem `template_key` confirmado ficam em **`templates-cv/resume/_mapeamento-pendente/`**, com inventário em [`MAPEAMENTO.md`](../templates-cv/resume/_mapeamento-pendente/MAPEAMENTO.md), até serem movidos para `resume/<template_key>/`.

### Convenções de ficheiros

- `resume/<template_key>/preview-desktop.webp` — hero do catálogo.
- `resume/<template_key>/preview-mobile.webp` — carrossel mobile.
- `notes.md` — decisões de design (margens, fontes “seguras ATS”, etc.).

### ATS (Applicant Tracking Systems)

Templates marcados como “ATS-friendly” na documentação devem:

- Priorizar **texto selecionável** no render.
- Evitar layouts que quebram parsing (tabelas complexas para layout, texto como imagem).
- Detalhes de produto podem constar em `notes.md` por template.

## Sistema de personalização de layout

Camadas sugeridas:

1. **Layout fixo do template** — grelha e tipografia definidas pelo `template_key`.
2. **Tokens opcionais** — no futuro: cor de acento, densidade (`compact` | `comfortable`) guardados por currículo ou utilizador; persistência via API se existir endpoint.
3. **Conteúdo** — sempre nas secções; não misturar “dados do CV” com “skin” sem modelo claro.

Evitar expor CSS arbitrário do utilizador (risco de segurança e inconsistência).

## Portfólio

Templates `type: portfolio` seguem a mesma ideia: registo Vue + pasta `templates-cv/portfolio/<template_key>/`.

## Checklist ao adicionar um template novo

1. Inserir linha na base via API admin (`POST /api/admin/catalog/templates`).
2. Adicionar render Vue + entrada no `registry`.
3. Colocar previews em `templates-cv/`.
4. Testar fluxo premium (preço, checkout, desbloqueio) se aplicável.
