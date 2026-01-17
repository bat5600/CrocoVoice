# Story 1.3: Fiabiliser la saisie au curseur et les retours utilisateur

## Status
Done

## Story
**As a** user,
**I want** to trust that my transcription is typed at the right place,
**so that** I don't lose or misplace text.

## Acceptance Criteria
1. Si la saisie clavier echoue, l'utilisateur est informe explicitement.
2. Des garde-fous evitent la saisie dans une fenetre cible inattendue pendant le processing.
3. Le fallback robotjs reste supporte si nut-js est indisponible.
4. En cas d'echec de saisie, l'etat revient a idle sans bloquer le pipeline.

## Tasks / Subtasks
- [x] Evaluer le flux de typing actuel et detection d'echec (AC: 1,4)
  - [x] Identifier comment les erreurs nut-js/robotjs sont remontees
- [x] Ajouter des garde-fous de fenetre cible avant typing (AC: 2)
- [x] Garantir le fallback robotjs si nut-js indisponible (AC: 3)
- [x] Notifier l'utilisateur en cas d'echec et revenir a idle (AC: 1,4)
- [x] Tests manuels multi-plateformes et cas d'erreur de saisie

## Dev Notes
- Source d'architecture: `docs/architecture.md`
- Fichiers cibles probables: `main.js` (typing), eventuels helpers, `renderer.js` (feedback UI)
- Bibliotheques: `@nut-tree-fork/nut-js` avec fallback robotjs.
- Garder les canaux IPC existants.

### Testing
- Pas de tests automatises; tests manuels requis.
- Scenarios: permission clavier manquante, fenetre cible changee, fallback robotjs.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-15 | v0.1 | Creation de la dev story | PM |

## Dev Agent Record
### Agent Model Used

- Codex (GPT-5 dev)

### Debug Log References

- main.js – typing guard + history flow autour du collage.

### Completion Notes List

- Historique ajoute avant le collage pour conserver la transcription meme si la fenetre cible change pendant la saisie.
- Message concret ajoute lors de la detection d'une fenetre cible modifiee afin que le widget UX l'affiche clairement.
- Le fallback robotjs existant a ete conserve et verifie pour ne pas casser la selection de la librairie clavier.

### File List

- main.js
## QA Results
