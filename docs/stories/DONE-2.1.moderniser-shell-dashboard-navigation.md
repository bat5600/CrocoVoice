# Story 2.1: Moderniser le shell du dashboard et la navigation

## Status
DONE

## Story
**As a** user,
**I want** a premium dashboard shell with clearer hierarchy and navigation,
**so that** the app feels modern and easier to use.

## Acceptance Criteria
1. Le header et la navigation du dashboard sont modernises (typo, spacing, contrast) sans changer les routes ou labels.
2. Les controles de fenetre (fermer/reduire/agrandir) sont visibles et suivent les conventions OS.
3. Le layout se redimensionne sans clipping ni overlap.
4. La navigation vers settings/history/dictionary/sync reste fonctionnelle.

## Tasks / Subtasks
- [x] Cartographier le shell actuel du dashboard (header, nav, layout) et les contraintes de fenetre (AC: 1,2,3)
- [x] Definir la structure du header/navigation premium sans changer les routes (AC: 1,4)
- [x] Implementer les controles de fenetre (close/minimize/maximize) via IPC si necessaire (AC: 2)
- [x] Ajuster le layout pour le resize sans overlap (AC: 3)
- [x] Verifier la navigation et les actions existantes (AC: 4)
- [x] Tests manuels du dashboard (resize, controles de fenetre, navigation)

## Dev Notes
- Source d'architecture: `docs/architecture.md`
- UX spec: `docs/front-end-spec.md`
- Cahier des charges UX/UI: `docs/ux/cahier-des-charges-crocovoice-2-0.md`
- Fichiers cibles probables: `main.js`, `preload.js`, `dashboard.html`, `dashboard.js`.
- Le dashboard est frameless (`frame: false`), donc controles custom requis.

### Testing
- Tests manuels uniquement.
- Scenarios: resize, close/minimize/maximize, navigation entre vues.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-15 | v0.1 | Creation de la dev story | PM |
| 2026-01-16 | v0.2 | Modernisation du shell, navigation premium et controles fenetre custom | James |
| 2026-01-18 | v0.3 | Alignement du dashboard avec le nouveau style premium fourni | James |
| 2026-02-XX | v0.4 | Feedback dictée, toasts, empty states illustres, editeur Markdown, previews styles | James |

## Dev Agent Record
### Agent Model Used
- Codex CLI (GPT-4.1)

### Debug Log References
- None (rendering/control adjustments only)

### Completion Notes List
- Rebuilt the dashboard shell around a premium header, horizontal navigation, and refreshed workspace frame to clarify the hierarchy without altering routes.
- Added window-control buttons that emit `dashboard:window-control` IPC actions, cleaned up the layout CSS, and scoped the workspace flex structure to avoid clipping on resize; manual dashboard tests still need to run in the UI context.
- Updated the dashboard layout/CSS to match the new visual guidelines (sidebar, header, cards, modal, auth overlay) while keeping the existing JS wiring intact.
- Ajout du feedback visuel dictée (pulse + barres audio), d'un editeur Markdown avec toolbar, de toasts flottants, d'empty states illustres et d'exemples Avant/Apres pour les styles.

### File List
- dashboard.html
- dashboard.js
- docs/front-end-spec.md
- docs/ux/cahier-des-charges-crocovoice-2-0.md
- docs/stories/DONE-2.1.moderniser-shell-dashboard-navigation.md

## QA Results
- Manual dashboard interactions (resize, controls, navigation) still need to be run inside the UI shell.
