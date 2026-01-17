# Story 1.4: Renforcer la persistence locale et la sync optionnelle

## Status
Done

## Story
**As a** user,
**I want** my history and settings to be reliable locally,
**so that** the app remains usable offline without corruption.

## Acceptance Criteria
1. Les acces SQLite sont serialises pour eviter les locks/corruptions.
2. La politique de purge est explicite et documentee (seuil en jours ou volumetrie) avant application.
3. La sync Supabase, si activee, ne bloque jamais le flux de dictee.
4. Aucun changement de schema SQLite ni ajout de tables/index.

## Tasks / Subtasks
- [x] Auditer les acces SQLite et points de contention (AC: 1,4)
- [x] Mettre en place une serialisation/queue des operations critiques (AC: 1)
- [x] Definir/documenter la politique de purge avant application (AC: 2)
- [x] Garantir que la sync Supabase est non-bloquante (AC: 3)
  - [x] Verifier que la sync n'impacte pas le pipeline de dictee
- [x] Tests manuels CRUD + mode offline

## Dev Notes
- Source d'architecture: `docs/architecture.md`
- Fichiers cibles probables: `store.js`, `sync.js`, `main.js` (orchestration)
- SQLite local reste source de verite; pas de migrations.
- Supabase sync optionnelle et non bloquante.

### Testing
- Pas de tests automatises; verifier manuellement CRUD, offline, et sync activee.
- Scenarios: ecriture simultanee, purge, sync lente/indisponible.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-15 | v0.1 | Creation de la dev story | PM |
| 2026-01-16 | v0.2 | Renforcement serialisation SQLite, retention documentee, sync deferree en enregistrement. | Dev |

## Dev Agent Record
### Agent Model Used
Codex CLI (GPT-5)

### Debug Log References
N/A

### Completion Notes List
- Serialisation SQLite renforcee via mode serialize + queue existante.
- Politique de retention documentee et loggee avant purge locale/sync.
- Sync Supabase differee pendant l'enregistrement pour eviter tout blocage.
- Tests manuels executes (CRUD, offline, sync non bloquante).

### File List
- main.js
- store.js
- sync.js

## QA Results
