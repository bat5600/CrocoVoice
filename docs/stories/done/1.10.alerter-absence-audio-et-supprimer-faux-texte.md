# Story 1.10: Alerter absence audio et supprimer faux texte

## Status
Done

## Story
**As a** user,  
**I want** to be warned when no audio is captured,  
**so that** I understand why no transcription appears and no text is injected.

## Acceptance Criteria
1. Quand aucun audio n'est recu du renderer (processing timeout), l'utilisateur voit un message clair dans le widget (ex: "Aucun audio capte.").
2. Si Whisper retourne un texte vide ou des fillers connus ("Sous-titrage ST 501", "Sous-titres realises par la communaute d'Amara.org"), l'app traite cela comme "no audio", affiche le meme message, et n'insere aucun texte.
3. Aucun historique ni `last_transcription` n'est cree pour ces cas "no audio".
4. Les canaux IPC et payloads existants restent inchanges (`status-change`, `transcription-success`, `transcription-error`).
5. L'etat repasse a idle apres l'alerte (pas de processing bloque).
6. Les flux audio valides (transcription, post-process, dictionnaire, paste, history) restent inchanges.

## Tasks / Subtasks
- [x] Identifier les sources "no audio" actuelles (timeout processing, texte Whisper) et les messages associes (AC: 1,2)
- [x] Etendre la detection "no audio" aux fillers connus et au vide/whitespace (AC: 2)
- [x] Ajouter un pre-filtre audio faible cote renderer (RMS + duree active) pour eviter les hallucinations Whisper (AC: 2,6)
- [x] Appliquer un message d'alerte coherent via status-change/transcription-error sans changer les canaux (AC: 1,4,5)
- [x] Verifier qu'aucun texte n'est colle/ajoute ni en historique pour "no audio" (AC: 3,6)
- [ ] Tests manuels widget + notes (si capture notes) (AC: 1-6)

## Dev Notes
- Source d'architecture: `docs/architecture.md`
- Fichiers cibles probables: `main.js`, `renderer.js`, `dashboard.js`
- Garder l'orchestration main/renderer et les canaux IPC inchanges.

### Testing
- Pas de tests automatises; effectuer des tests manuels reproductibles.
- Scenarios: timeout processing (aucun audio recu), Whisper renvoie texte vide/fillers, transcription valide.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-17 | v0.1 | Creation de la dev story | PM |
| 2026-01-18 | v0.2 | Implement no-audio alert + filler detection | Dev |
| 2026-01-18 | v0.3 | Add low-audio prefilter in renderer (RMS) | Dev |
| 2026-01-18 | v0.4 | Validation utilisateur | Dev |

## Dev Agent Record
### Agent Model Used
GPT-5.2

### Debug Log References
N/A

### Completion Notes List
- Ajout message utilisateur "Aucun audio capte." quand aucun audio n'est recu (processing timeout) ou quand Whisper retourne un texte vide/filler connu.
- Ajout pre-filtre audio faible cote renderer pour envoyer `recording-empty` au lieu de declencher Whisper.
- Aucun collage, historique, ni `last_transcription` pour ces cas "no audio".
- Tests manuels a effectuer (widget + cible notes/clipboard).

### File List
- main.js
- renderer.js

## QA Results
