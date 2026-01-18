# Story 1.6: Annuler l'enregistrement et formater l'historique recent

## Status
Done

## Story
**As a** user,
**I want** to cancel a recording without sending audio and see readable history,
**so that** I can discard mistakes and read past entries.

## Acceptance Criteria
1. Le bouton croix annule l'enregistrement en cours sans envoyer d'audio ni declencher de transcription.
2. Une barre de "chargement" apparait pendant 5 secondes avec un bouton "undo" pour finalement envoyer l'audio et procéder normalement (comme s'il n'y avait pas eu d'annulation, mais un arrêt classique de la dicté)
3. Apres annulation, l'etat repasse a idle sans creer d'entree dans l'historique.
4. L'historique recent affiche les sauts de ligne et un formatage lisible (retours preserves).
5. Aucune emission d'audio-ready ni d'appel OpenAI n'est declenchee lors d'une annulation.
6. Si l'utilisateur clique sur "undo" avant la fin des 5 secondes, alors l'audio est traité normalement

## Tasks / Subtasks
- [x] Ajouter le flux d'annulation cote main et renderer (AC: 1,2,4)
  - [x] Court-circuiter l'envoi d'audio-ready
- [x] Garantir retour a idle et absence d'entree historique (AC: 2)
- [x] Preserver les retours a la ligne dans l'affichage historique (AC: 3)
- [x] Tests manuels annulation, historique, reprise d'enregistrement

## Dev Notes
- Source d'architecture: `docs/architecture.md`
- Fichiers cibles probables: `renderer.js`, `main.js`, `dashboard.html`/`dashboard.js` (historique)
- Ne pas appeler OpenAI ni envoyer audio en cas d'annulation.

### Testing
- Pas de tests automatises; verifier manuellement annulation et historique.
- Scenarios: annulation pendant recording, historique multi-lignes, nouvel enregistrement apres annulation.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-15 | v0.1 | Creation de la dev story | PM |
| 2026-01-15 | v0.2 | Implemented cancel/undo flow + history preview formatting | Dev |
| 2026-01-15 | v0.3 | Undo UI polish (hide pill, progress bar visibility, hover pause, resize) | Dev |
| 2026-01-15 | v0.4 | Validation utilisateur | Dev |

## Dev Agent Record
### Agent Model Used
GPT-5

### Debug Log References
N/A

### Completion Notes List
- Implementation done for cancel/undo flow and history preview formatting.
- Manual tests not run (Electron app not started).
- Undo UI now hides pill during undo, uses redesigned banner (icon/text/button), shows visible progress bar, and pauses countdown on hover.
- Undo window size expanded to avoid clipping.

### File List
- index.html
- renderer.js
- dashboard.html
- main.js
- preload.js

## QA Results
