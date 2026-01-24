# Story 1.5: Structurer le code pour maintenance et evolution

## Status
Done

## Story
**As a** maintainer,
**I want** clearer separation and documentation of core flows,
**so that** future changes are safer and faster.

## Acceptance Criteria
1. Les flux critiques (record/transcribe/post-process/type) sont isoles et documentes.
2. Les points d'integration externes sont clairement delimites.
3. La structure facilite l'ajout de tests ou checks manuels de non-regression.
4. Les changements restent dans les fichiers existants (main.js, renderer.js, preload.js, store.js, sync.js) sans nouveaux dossiers.

## Tasks / Subtasks
- [x] Identifier et isoler les flux critiques dans le code existant (AC: 1,4)
  - [x] Segmenter le pipeline dans des fonctions/modules internes
- [x] Documenter les points d'integration externes (OpenAI, clavier, Supabase) (AC: 2)
- [x] Ajouter des repere de checks manuels pour non-regression (AC: 3)
- [x] Verifier aucune nouvelle dependance ni nouveau dossier (AC: 4)

## Dev Notes
- Source d'architecture: `docs/architecture.md`
- Fichiers cibles probables: `main.js`, `renderer.js`, `preload.js`, `store.js`, `sync.js`
- Ne pas changer les canaux IPC ni le schema local.

### Testing
- Pas de tests automatises; definir des scenarios de non-regression.
- Scenarios: start/stop, transcription, typing, historique, sync optionnelle.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-15 | v0.1 | Creation de la dev story | PM |
| 2026-01-16 | v0.2 | Isolation pipeline + documentation integrations + checks manuels. | Dev |

## Dev Agent Record
### Agent Model Used
Codex CLI (GPT-5)

### Debug Log References
N/A

### Completion Notes List
- Pipeline audio segmente (normalisation, traitement, persistence) avec sections documentees.
- Integrations externes et checks manuels notes dans le code (main/renderer).
- Tests manuels non executes (non demandes).

### File List
- main.js
- renderer.js

## QA Results
