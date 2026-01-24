# Epic 7 — Onboarding flow: The "First Magic Moment" (Windows-first)

## Status
Done

## Story
**As a** nouvel utilisateur (potentiellement sceptique),
**I want** etre guide pas a pas pour configurer mon micro et voir le texte s'ecrire seul pour la premiere fois,
**so that** valider immediatement que l'application fonctionne sur mon PC et avoir confiance pour l'utiliser au quotidien.

**UX Philosophy:** "Show, Don't Just Tell"

L'onboarding ne doit pas etre une simple configuration technique. Il doit etre un tutoriel interactif.
Setup: rapide et sans friction. Test: feedback visuel immediat (VU-meter). Win: l'utilisateur reussit une action concrete (le "First Run Success").

## Acceptance Criteria
1. **L'Accueil (The Welcome)**: au premier lancement (ou si onboarding incomplet), une modale ou fenetre dediee (propre, non-intrusive) apparait avec un message cle "Pret a dicter en 30 secondes" et un CTA clair "Commencer la configuration".
2. **Verification Micro (The Hardware Check)**: l'application demande la permission d'acces au microphone (prompt Windows natif) et affiche un VU-meter reactif en temps reel. Si aucun micro n'est detecte ou si le signal est plat, l'UI propose un lien direct vers "Parametres de confidentialite Windows > Microphone".
3. **Le "First Run" (The Magic Moment)**: l'ecran affiche une zone de texte de test integree (sandbox). L'utilisateur maintient le raccourci (ou clique un bouton) et dicte une phrase simple (ex: "Bonjour monde"). Succes = texte transcrit visible, avec une celebration subtile (checkmark vert/confettis/son court).
4. **Verification d'Injection (The Delivery Check)**: si l'app utilise l'injection de touches, l'onboarding verifie que l'OS ne bloque pas. En cas d'echec (AV/droits Admin), l'app propose le mode "Presse-papier" en fallback immediat.
5. **Persistance & Sortie**: l'utilisateur peut quitter via "Passer / Configurer plus tard". L'etat `onboarding_completed: true` n'est enregistre que si l'etape 3 est validee. En sortie, l'app guide vers l'etat normal (tray icon ou dashboard).

## Tasks / Subtasks
- [x] Define minimal onboarding state + persistence (AC: 1,5)
  - Etapes: welcome, permissions, mic_check, first_dictation, done.
  - Persistance locale via `store.js` ou `electron-store`.
  - `onboarding_completed: true` uniquement apres le succes du "First Run".
- [x] Implement onboarding UI flow (stepper, modal, or dedicated view) (AC: 1,3,5)
  - Stepper minimaliste, progressif, boutons "Suivant" desactives tant que l'etape n'est pas validee.
  - Option "Passer / Configurer plus tard".
- [x] Implement Windows-first checks and a “first successful dictation” verification (AC: 2,4)
  - Verification permissions OS (Node/Electron API).
  - VU-meter reactif pour test micro.
  - Lien profond `ms-settings:privacy-microphone` si blocage privacy.
  - Verification injection/keystroke avec fallback "Presse-papier".
- [x] Add clear user feedback (success/failure) and easy next actions (AC: 3,4)
  - Messages d'erreur humains (ex: "On ne vous entend pas...").
  - Animation de succes finale.

## Dev Notes
- Likely stored in `store.js` settings (e.g., `onboarding:*` keys) and surfaced via `main.js`/IPC to `dashboard.js`.
- Architecture: utiliser `ipcRenderer` pour streamer le niveau audio (volume amplitude) du main process vers l'UI d'onboarding pour le VU-meter.
- Windows Privacy Pitfall: sur Windows 10/11, attention au parametre global "Autoriser les applications de bureau a acceder au micro". S'il est OFF, `navigator.mediaDevices.getUserMedia` peut echouer silencieusement ou renvoyer un flux vide.
- Permission handling differs across OS; keep UX resilient with fallbacks and clear messaging.
- Hotkey setup should reuse existing settings patterns and not break current flows.
- The exact UX is intentionally left to the dev (keep it minimal, fast, and consistent with the existing dashboard/widget UI).
- Fallback: si l'utilisateur passe l'onboarding, afficher une notification persistante ou un badge dans le dashboard tant que la configuration n'est pas faite.

### Testing
- Manual (Windows): clean profile first run; simulate failures (no mic, delivery failure); resume flow; verify completion persistence.
- Happy Path: installation propre -> micro OK -> dictee "Test" -> succes -> fermeture.
- Mute: lancer l'onboarding avec le micro physiquement eteint -> l'etape ne se valide pas.
- Privacy Block: desactiver l'acces micro dans Windows Settings -> verifier guidance vers parametres.
- Reprise: quitter l'app en plein milieu -> relancer -> reprise a l'etape sauvegardee.
- Regression: ensure existing dictation flows remain unchanged for returning users.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-21 | v0.2 | Refonte UX pour focus "Magic Moment" + details techniques Windows | Gemini |
| 2026-01-20 | v0.1 | Story created from global PRD Epic 7 shard plan | PO |

## Dev Agent Record
### Agent Model Used
GPT-5 (Codex)

### Debug Log References
N/A

### Completion Notes List
- Added onboarding overlay with stepper, sandbox dictation, and delivery check UX.
- Implemented mic level streaming via IPC and Windows privacy deep-link.
- Added clipboard fallback delivery mode and onboarding state persistence.
- User validated story and completed manual tests.

### File List
- main.js
- preload.js
- renderer.js
- dashboard.html
- dashboard.js

## QA Results
