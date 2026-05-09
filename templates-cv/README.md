# templates-cv — Referências visuais de templates

Ativos estáticos ligados aos templates de **currículo** e **portfólio** apresentados na plataforma.

## Finalidade

- Previews de alta qualidade para o catálogo (além de `preview_url` / `preview_image` na API).
- Material de design para alinhar marketing, editor e renderização final.
- Documentação visual para designers e desenvolvedores (variantes, breakpoints).

## O que evitar

- Dados pessoais reais ou PDFs de utilizadores.
- Duplicar a fonte de verdade do catálogo: `template_key` e metadados vivem na **API**.
- Ficheiros muito pesados sem formato moderno (preferir WebP/AVIF; ver doc de assets).

## Estrutura convencional

```
templates-cv/
  README.md
  resume/
    README.md
    <template-key>/          # ex.: resume_ats_classic
      preview-desktop.webp
      preview-mobile.webp
      thumb.png              # opcional
      notes.md               # opcional — notas de design
    _mapeamento-pendente/     # fila: ficheiros antes de existir template_key (ver MAPEAMENTO.md)
  portfolio/
    README.md
    <template-key>/
      ...
  shared/
    README.md
```

O nome `<template-key>` deve coincidir com o **`template_key`** retornado por `GET /api/templates` e `GET /api/me/templates`.

### Migração a partir da raiz

Os previews que estavam na raiz (`original-*.webp`) foram movidos para `resume/_mapeamento-pendente/`. Assim que cada imagem for associada a um `template_key`, mova-a para `resume/<template_key>/` com os nomes canónicos acima.

## Licenciamento

Garantir direitos de uso de imagens, fontes nos mocks e marcas antes de uso em produção.
