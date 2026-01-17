# Story 1.9: Ajouter les boutons de fenetre principale (fermer/agrandir/reduire)

## Status
Done

## Story
**As a** user,
**I want** standard window controls on the main application window (close, maximize, minimize),
**so that** the app behaves like a typical Windows/Mac application.

## Acceptance Criteria
1. La fenetre principale (dictionnaire, historique, etc.) affiche des controles de fenetre visibles en haut.
2. Le bouton fermer ferme la fenetre principale comme une application standard.
3. Le bouton reduire minimise la fenetre dans la barre des taches / dock.
4. Le bouton agrandir bascule entre maximise et restaure (ou comportement natif Mac), sans casser la mise en page.
5. L'emplacement des boutons respecte la convention de l'OS (Windows/Mac) ou une mise en page standard et coherente.
6. Aucun regression sur les interactions existantes de l'interface principale.

## Tasks / Subtasks
- [x] Identifier la creation de la fenetre principale et son mode (frame natif ou frameless) (AC: 1,5)
- [x] Choisir l'approche (controles natifs via frame ou controles custom) en respectant les patterns existants (AC: 1,5)
- [x] Ajouter les controles UI necessaires si frameless (AC: 1)
- [x] Brancher les actions aux API Electron (close/minimize/maximize) via main/IPC si requis (AC: 2,3,4)
- [x] Verifier le comportement sur la fenetre principale (AC: 2,3,4,6)
- [x] Tests manuels sur l'OS courant

## Dev Notes
- Source d'architecture: `docs/architecture.md`
- Tech stack: Electron (main/renderer + IPC).
- Fichiers cibles probables: `main.js`, `preload.js`, `renderer.js`, `index.html`.
- Preferer le comportement natif OS quand possible.

### Testing
- Pas de tests automatises; verifier manuellement les actions fermer/reduire/agrandir.
- Scenarios: etat normal, maximise, restore, minimisation, fermeture depuis la fenetre principale.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-15 | v0.1 | Creation de la dev story | PM |
| 2026-01-16 | v0.2 | Boutons fenetre relies aux actions (dataset + bind). | Dev |
| 2026-01-16 | v0.3 | Fix clics (fallback action + auth-locked). | Dev |
| 2026-01-16 | v0.4 | Boutons fixes hors zones drag pour clics fiables. | Dev |
| 2026-01-16 | v0.5 | Handler inline de secours pour clics. | Dev |
| 2026-01-16 | v0.6 | Boutons ancrés au header (no-drag). | Dev |
| 2026-01-16 | v0.7 | Retrait handler inline (evite double maximize). | Dev |

## Dev Agent Record
### Agent Model Used
Codex CLI (GPT-5)

### Debug Log References
N/A

### Completion Notes List
- Wired window-control buttons with data attributes to trigger IPC actions.
- Manual window behavior checks still needed.
- Ajout d'un fallback JS + reactivation clics en mode auth-locked.
- Boutons fixes hors zones drag pour clics fiables.
- Ajout d'un handler inline en secours si le script ne se charge pas.
- Boutons reancrés dans le header draggable (no-drag explicite).
- Suppression du handler inline pour éviter le double toggle maximize.
- Tests manuels valides (hover + clics minimize/maximize/close).

### File List
- dashboard.html
- dashboard.js

## QA Results
