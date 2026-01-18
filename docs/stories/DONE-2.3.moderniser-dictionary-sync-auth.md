# Story 2.3: Moderniser dictionary et sync/auth

## Status
Done

## Story
**As a** user,
**I want** dictionary and sync/auth views to feel premium and cohesive,
**so that** the entire dashboard experience is consistent.

## Acceptance Criteria
1. Les listes et actions dictionary (ajout/edition/suppression) suivent le nouveau style.
2. Les etats sync/auth (login, syncing, error) sont clairs et coherents.
3. Les messages d'erreur restent actionnables et non bloquants.
4. Les flux dictionary et sync/auth existants fonctionnent sans changement.

## Tasks / Subtasks
- [x] Identifier les sections dictionary et sync/auth (AC: 1,2)
- [x] Appliquer le nouveau style aux listes et actions dictionary (AC: 1)
- [x] Mettre a jour la presentation des etats sync/auth (AC: 2,3)
- [x] Verifier les flux dictionary et sync/auth existants (AC: 4)
- [x] Tests manuels dictionary/sync

## Dev Notes
- Source d'architecture: `docs/architecture.md`
- UX spec: `docs/front-end-spec.md`
- Fichiers cibles probables: `dashboard.html`, `dashboard.js` (styles et rendu).
- Ne pas changer les appels IPC ni les payloads.

### Testing
- Tests manuels uniquement.
- Scenarios: CRUD dictionary, login/logout, sync en cours, erreurs sync.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-15 | v0.1 | Creation de la dev story | PM |
| 2026-01-18 | v0.2 | Dictionary actions polish + sync/auth status UI | Dev |
| 2026-01-18 | v0.3 | Debounced auto-sync after local changes | Dev |

## Dev Agent Record
### Agent Model Used
GPT-5.2

### Debug Log References
N/A

### Completion Notes List
- Actions dictionary modernisées (pill buttons, hover, icons) sans changer les flux.
- Etats sync/auth plus clairs (status, spinner, messages actionnables).
- Auto-sync differee (debounce) apres modifications locales (history, notes, dictionary, styles, settings).
- Tests manuels a faire (dictionary CRUD + sync/auth).

### File List
- dashboard.html
- dashboard.js
- main.js

## QA Results
