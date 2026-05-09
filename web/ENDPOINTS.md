# Endpoints consumidos pela SPA (`web/`)

Contratos alinhados a `docs/modulos/README.md` e aos documentos numerados dentro de `docs/modulos/`.  
**Se o `iportfolio-api` divergir**, ajuste apenas os ficheiros `src/modules/*/services/*Api.ts`.

| Método | Caminho | Serviço | Notas |
|--------|---------|---------|--------|
| POST | `/api/users` | `modules/profile/services/usersApi.ts` | Cadastro público, conforme módulo de usuário/perfil. |
| POST | `/api/auth/login` | `modules/auth/services/authApi.ts` | Token opaco; header configurável (`VITE_AUTH_TOKEN_HEADER`). |
| POST | `/api/auth/logout` | `modules/auth/services/authApi.ts` | Logout backend + limpeza local. |
| GET | `/api/me` | `modules/auth/services/authApi.ts` | Rehidratar sessão autenticada. |
| GET/PATCH | `/api/profile` | `modules/profile/services/profileApi.ts` | Perfil profissional. |
| CRUD | `/api/experiences` | `modules/content-blocks/services/experiencesApi.ts` | Blocos profissionais. |
| CRUD | `/api/educations` | `modules/content-blocks/services/educationsApi.ts` | Blocos profissionais. |
| CRUD | `/api/skills` | `modules/content-blocks/services/skillsApi.ts` | Blocos profissionais. |
| CRUD | `/api/projects` | `modules/content-blocks/services/projectsApi.ts` | Blocos profissionais. |
| CRUD | `/api/certifications` | `modules/content-blocks/services/certificationsApi.ts` | Blocos profissionais. |
| CRUD | `/api/resumes` | `modules/resume/services/resumesApi.ts` | Currículos; PDF em `/pdf`; **402** se template premium bloqueado. |
| CRUD/reorder | `/api/resumes/{publicId}/sections` | `modules/resume/services/resumeSectionsApi.ts` | Secções e sugestões do editor. |
| GET | `/api/templates` | `modules/templates/services/templatesApi.ts` | Catálogo público. |
| GET | `/api/me/templates` | `modules/templates/services/templatesApi.ts` | Estado `can_use` / `is_unlocked` / `bundle_ref`. |
| POST | `/api/me/template-unlocks` | `modules/templates/services/templatesApi.ts` | Desbloqueio manual/dev/backoffice. |
| POST | `/api/me/payments/mercadopago/template-checkout` | `modules/billing/services/paymentsApi.ts` | Devolve `init_point` / `sandbox_init_point`. |
| CRUD/publish | `/api/portfolio-sites` | `modules/portfolio/services/portfolioApi.ts` | Sites de portfólio. |
| CRUD/reorder | `/api/portfolio-sites/{siteId}/sections` | `modules/portfolio/services/portfolioSectionsApi.ts` | Secções de portfólio. |
| GET | `/api/public/portfolio/{slug}` | `modules/portfolio/services/portfolioApi.ts` | Portfólio público. |
| POST/GET | `/api/resumes/{publicId}/ai/*` | `modules/resume-ai/services/resumeAiApi.ts` | Análise/otimização/comparação de currículo. |

## Referências visuais da plataforma

Ficheiros em `template-plataforma/` (na raiz do monorepo) orientam **login** e **shell** da app; não são servidos automaticamente pelo Vite. Para usar como fundo, copiar para `web/public/` ou configurar proxy/CDN.
