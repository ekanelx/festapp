# Festapp — AGENTS.md

## Product intent

Festapp is a mobile-first web app for fast, reliable consultation of festival events.
The core user goal is: find what event is happening, when, where, and whether it changed, in under 30 seconds.

## Source of truth

- Product scope and requirements live in `docs/prd/FESTAPP_V1_PRD.md`.
- If implementation tradeoffs appear, preserve the product intent and propose the smallest viable approach.
- Do not invent features outside the PRD unless they are strictly necessary for implementation.

## Working mode

- Start by analyzing the existing repo and relevant docs before coding.
- For large or ambiguous tasks, plan first, then implement in small, reviewable phases.
- Keep scope tight. Do not over-engineer.
- Prefer boring, maintainable solutions over abstract future-proofing.

## Current implementation priority

Build the project in this order:

1. project scaffold and app shell
2. data model and auth foundation
3. public catalog: home, agenda, detail, alerts
4. CMS basic CRUD
5. import workflows
6. push
7. AI assistance

## Stack assumptions

- Next.js App Router
- TypeScript
- Supabase for database, auth, and storage
- Tailwind + shadcn/ui
- Mobile-first responsive UI

If the repo already uses a different stack, follow the repo instead of this assumption.

## Non-negotiables

- Public users do not require login in v1.
- Internal CMS requires authenticated roles.
- v1 language is Spanish only.
- Google Maps integration is simple outbound linking, not custom map/routing.
- AI suggestions must never auto-publish.
- Push must never be the only alert channel.
- Avoid social, chat, gamification, payments, and complex editorial workflows.

## Data and architecture rules

- Every event belongs to one festival and one edition.
- Do not mix editions in public queries.
- Use explicit event status and review status.
- Preserve content provenance and basic auditability.
- Prefer explicit relational models over generic JSON blobs for core entities.
- Keep AI-related logic decoupled from core content publishing flow.

## UX rules

- Mobile-first is real, not decorative.
- Public flows must prioritize speed and clarity over visual richness.
- Resolve loading, empty, and error states properly.
- Avoid UI density and avoid dashboard aesthetics in the public app.
- Important changes to events must be visible in list and detail.

## Implementation boundaries

- Do not build all v1 in one pass.
- Do not add advanced abstractions before they are needed.
- Do not introduce new dependencies without clear justification.
- Do not create hidden automation that mutates published content without review.

## Definition of done

A task is done only when:

- requested behavior exists and works end-to-end
- affected routes/components are coherent
- loading/empty/error states are handled
- role restrictions are enforced where relevant
- changed files are summarized
- validation/testing relevant to the task has been run or explicitly noted
  
  

Memoria operativa del repo

Antes de hacer cambios relevantes, leer en este orden:

1. `WORKING_CONTEXT.md`

2. `README.md`

3. `DECISIONS_LOG.md` si hay dudas de criterio, arquitectura o decisiones previas

Reglas de uso:

- `WORKING_CONTEXT.md` es la fuente principal para estado actual, handoff, riesgos abiertos y próximos pasos.

- `README.md` describe el mapa estable del repo, no el estado vivo de la tarea.

- `DECISIONS_LOG.md` registra decisiones estables y trade-offs, no progreso diario.

Obligaciones del agente:

- No asumir que el contexto conversacional previo sigue disponible.

- No usar `README.md` como sustituto de `WORKING_CONTEXT.md`.

- Actualizar `WORKING_CONTEXT.md` cuando cierre una tarea relevante, cambie el enfoque, detecte un bloqueo o deje trabajo a medias.

- Añadir entrada en `DECISIONS_LOG.md` solo cuando exista una decisión real con impacto futuro.

- Al terminar una sesión relevante, dejar un handoff breve y accionable en `WORKING_CONTEXT.md`.
