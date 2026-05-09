# Templates de CV/portfólio — renderer, `template_key` e assets

## Modelo conceitual

| Conceito | Fonte |
|----------|--------|
| `template_key`, `name`, `type`, `is_premium`, preço, `preview_url`, `section_schema` | API (`GET /api/templates`, `GET /api/me/templates`) |
| `can_use`, `bundle_ref` | API (lista autenticada) |
| **Implementação Vue** do layout (HTML/CSS do template) | Código — registo por `template_key` |
| **Previews estáticos** (marketing, catálogo, design) | Pasta `templates-cv/` neste repositório |

## Registo no frontend (obrigatório)

Manter um **mapa explícito** `template_key` → componente Vue:

```ts
// Conceito — ex.: src/modules/templates/registry.ts
import ResumeClassic from './renders/ResumeClassic.vue'

export const resumeTemplateRegistry: Record<string, Component> = {
  resume_classic: ResumeClassic,
  resume_minimal: ResumeMinimal,
  // ...
}
```

- **Chave desconhecida:** fallback (ex.: `resume_classic`) + log/telemetria.
- **Premium sem `can_use`:** preview permitido; aplicar no editor alinhado à API; tratar **402** ao persistir.

## `section_schema` (API)

- Usar para **montar o editor** (tipos de blocos, ordem, labels sugeridos).
- Secções persistidas continuam a ser a verdade operacional via `GET/POST .../sections`.
- Se schema e dados divergirem, definir política de produto (inicialização vs sincronização guiada).

## Pasta `templates-cv/` — convenções

Estrutura alvo:

```
templates-cv/
  README.md
  resume/
    README.md
    <template-key>/
      preview-desktop.webp
      preview-mobile.webp
      thumb.png          # opcional
      notes.md           # opcional — ATS, margens, fontes
    _mapeamento-pendente/   # previews importados antes de existir chave API — ver MAPEAMENTO.md
  portfolio/
    README.md
    <template-key>/
      ...
  shared/
    README.md
    ...
```

O `<template-key>` deve coincidir com o **`template_key`** da API.

### ATS (Applicant Tracking Systems)

Para templates “ATS-friendly”:

- Texto **selecionável** no render.
- Evitar layout em tabelas complexas ou texto só como imagem.
- Detalhes em `notes.md` por template.

## Personalização

1. Layout base fixo por `template_key`.
2. Futuro: tokens (cor de acento, densidade) persistidos via API se existir contrato.
3. Conteúdo sempre nas secções — não misturar dados com “skin” sem modelo claro.
4. **Não** permitir CSS arbitrário do utilizador (segurança e consistência).

## Checklist — novo template

1. Inserir metadados na API (admin).
2. Implementar componente Vue + entrada no `registry`.
3. Adicionar previews em `templates-cv/` (desktop/mobile).
4. Se premium: testar preço, checkout, desbloqueio e re-fetch de `/api/me/templates`.

## Portfólio (`type: portfolio`)

- Mesmo padrão: registo Vue + pasta `templates-cv/portfolio/<template_key>/`.

## Referências

- `templates-cv/README.md`
- `docs/05-templates-cv-estrutura-e-organizacao.md`
