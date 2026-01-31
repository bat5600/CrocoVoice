# BMAD Agent Quickstart

This guide helps BMAD-method agents find the minimal, correct artifacts quickly. It is the recommended entry point for all agent roles.

## Start Here (SSOT)
- **Single Source of Truth:** `docs/ssot.md`  
  Always read this first. It defines what is canonical and how to resolve conflicts.

## Canonical Sources (Authoritative)
- PRD: `docs/prd.md`
- Architecture: `docs/architecture.md`
- Front-end spec: `docs/front-end-spec.md`
- Configuration defaults: `docs/configuration.md`
- Architecture references: `docs/architecture/`

## Supporting / Derived
- UX research input: `docs/ux/`
- Epic overviews: `docs/epics/`
- Stories: `docs/stories/`
- QA gates/assessments: `docs/qa/`

## Minimal Reading Order by Task

1. **Story drafting / refinement (PM/PO/SM)**
   1. PRD scope + epic list (`docs/prd.md`)
   2. Epic overview (`docs/epics/<epic>.md`)
   3. Related stories (`docs/stories/<epic>.*.md`)

2. **Architecture changes (Architect / Dev)**
   1. Architecture overview (`docs/architecture.md`)
   2. Architecture references (`docs/architecture/`)
   3. PRD technical assumptions (`docs/prd.md`)

3. **UX & front-end flows (UX Expert / Dev)**
   1. UX goals + UI design requirements (`docs/prd.md`)
   2. Front-end spec (`docs/front-end-spec.md`)
   3. UX brief (`docs/ux/cahier-des-charges-crocovoice-2-0.md`)

4. **QA review (QA)**
   1. Story under review (`docs/stories/<epic>.*.md`)
   2. PRD requirements referenced in acceptance criteria (`docs/prd.md`)
   3. QA gate and assessments (`docs/qa/`)

## Story Readiness Checklist (Use Before Dev Work)
- Story is **not** in draft status.
- Acceptance criteria are testable and linked to requirements in `docs/prd.md`.
- Dependencies and constraints are explicit.
- UI changes reference `docs/front-end-spec.md` or `docs/ux/` where applicable.

## Traceability Expectations
- Each story should map to a PRD epic and an architecture component.
- UI stories should cite the relevant UX/front-end sections.

## SSOT Update Rules (Mandatory)
- If you change product scope, architecture, UX behavior, or defaults, update the canonical doc **first**.
- Add a change log entry in that canonical doc.
- Then update stories/epics/QA and log the change in `docs/agent-logbook.md`.
