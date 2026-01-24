# Story 1.2: Stabiliser les appels OpenAI et la gestion d'erreurs

## Status
Done

## Story
**As a** user,
**I want** transcription and post-processing to fail gracefully,
**so that** the app never freezes and I get clear feedback.

## Acceptance Criteria
1. Gestion explicite des timeouts/quota/429 avec backoff et message clair, avec logique de retry cote main.
2. Aucun blocage UI pendant les appels OpenAI; le retour a l'etat idle est garanti.
3. En absence d'API key, l'app affiche une erreur claire et reste utilisable.
4. Les appels OpenAI et la gestion des erreurs sont confines au main process; le renderer reste passif.

## Tasks / Subtasks
- [x] Auditer le pipeline de transcription et post-process dans le main (AC: 1,2,4)
  - [x] Identifier les points de timeout et erreurs 429/quota
- [x] Ajouter retry/backoff et timeouts explicites cote main (AC: 1)
  - [x] Definir messages d'erreur clairs pour l'utilisateur
- [x] Gerer le cas API key absente avec feedback utilisateur (AC: 3)
- [x] Garantir le retour a idle et absence de blocage UI (AC: 2)
- [x] Tests manuels des erreurs (timeout/429/absence de cle)

## Dev Notes
- Source d'architecture: `docs/architecture.md`
- Fichiers cibles probables: `main.js`, `preload.js`, `renderer.js` (affichage etats)
- OpenAI et pipeline restent dans le main process.
- Ne pas loguer de secrets; garder les payloads IPC existants.

### Testing
- Pas de tests automatises; verifier manuellement la gestion des erreurs et le retour a idle.
- Scenarios: API key manquante, timeout simule, 429/quota, reprise d'une dictee.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-15 | v0.1 | Creation de la dev story | PM |

## Dev Agent Record
### Agent Model Used
Codex CLI (GPT-5)

### Debug Log References
N/A

### Completion Notes List
- Manual tests run and reviewed (timeout/429/quota/API key missing).

### File List
- main.js

## QA Results
