# CrocoVoice Product Requirements Document (PRD) — vNext

## Goals and Background Context

### Goals
- Faire de CrocoVoice une app desktop “hotkey-first” qui permet d’ecrire vite avec une qualite de texte “envoyable” (Slack/email/docs/IDE) sans context switching.
- Stabiliser et rendre mesurable le pipeline (capture → STT → post-process → delivery) avec des objectifs de latence, fiabilite et couts.
- Proposer une experience premium (UI/UX, micro-interactions, feedback etats, empty states) alignee avec `docs/front-end-spec.md`.
- Mettre en place un modele freemium simple (quota hebdo) + PRO illimite, avec des flows auth/billing solides.
- Construire une base evolutive pour: styles, dictionnaire, snippets vocaux, integrations, puis modules plus lourds (transcription fichiers, meetings, search/knowledge base).

### Background Context
CrocoVoice existe deja comme app Electron de dictee: capture audio via MediaRecorder, transcription via Whisper, post-process via LLM, puis insertion (auto-typing) avec un widget/dashboard. Auth et sync sont optionnels via Supabase; SQLite local est la source de verite.

Ce PRD “vNext” restructure le produit autour d’un **coeur de valeur** (dictée universelle fiable + texte final propre + UX premium + monetisation) et organise l’extension vers des features plus ambitieuses (integrations profondes, meeting assistant, knowledge base) en phases pour limiter les risques (privacy, couts IA, contraintes OS, complexite).

### Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-20 | v1.0 | PRD vNext (YOLO draft) base sur brief + idees | PM |

## Requirements

### Functional
1. FR1: L’app propose un **hotkey global** “Quick Dictate” qui demarre l’enregistrement, puis insere le texte final dans l’app cible.
2. FR2: L’app propose un mode “Full Dictate” avec une fenetre d’edition (transcription temps reel + edition + actions Copy/Send).
3. FR3: L’app affiche un feedback clair d’etats (listening/processing/success/error) et un “saferail” contre les enregistrements interminables.
4. FR4: Le pipeline supporte STT Whisper (cloud) + post-processing (nettoyage, ponctuation, capitalisation) configurable.
5. FR5: Le post-process peut appliquer des **styles** (ex: Pro, Casual, Structured) et afficher un preview “avant/apres”.
6. FR6: L’app garde un **historique** (avec recherche, copie, suppression) et permet de re-appliquer un style a une entree.
7. FR7: L’app permet des **notes manuelles** (titre optionnel, corps) + dictée injectee dans la note.
8. FR8: L’app propose un **dictionnaire personnel** (ajout manuel) et peut apprendre des corrections (MVP: manuel, evolutif).
9. FR9: L’app propose une **snippet library** (voice shortcuts): dire un cue → inserer un template formate.
10. FR10: L’app propose une transcription “upload” (audio/video) avec suivi de progression et sauvegarde resultat.
11. FR11: L’app supporte des exports (Markdown, TXT, JSON) au minimum; formats additionnels en phase suivante (PDF/DOCX/SRT/VTT).
12. FR12: L’app implemente un plan FREE base sur un quota hebdo (mots dictes) avec affichage “restant + reset”.
13. FR13: Au quota atteint, l’app affiche un paywall **au moment d’action** (quand l’utilisateur tente une dictée), avec CTA d’upgrade PRO.
14. FR14: Le plan PRO debloque l’acces illimite et expose une page Settings “Billing” (etat abo, actions).
15. FR15: L’app supporte auth de base + **forgot password** (reset email) et garde les flows existants fonctionnels.
16. FR16: L’app expose un framework d’integrations (Slack/Gmail/Notion/webhooks), avec fallback “clipboard/paste” si une integration echoue.
17. FR17: (Post-MVP) L’app peut faire un routage “voice-to-action” (ex: “envoie a Slack #general …”) sur un ensemble limite d’actions.
18. FR18: (Post-MVP) L’app peut enregistrer des meetings (au moins “manual record”) et produire transcript + summary + action items.
19. FR19: (Post-MVP) L’app permet une recherche sur contenu (keywords au MVP; semantic ensuite).
20. FR20: L’app trace les evenements cles (dictation_started, dictation_delivered, errors, quota_reached, paywall_shown, upgrade_started/completed).

### Non Functional
1. NFR1: MVP: rester compatible avec le stack existant (Electron + JS + HTML/CSS) et limiter l’introduction de nouveaux frameworks UI.
2. NFR2: Latence hotkey → feedback “listening” < 100ms (p95) sur machine cible.
3. NFR3: Dictée courte (<= 30s) → texte final disponible < 3s (p95) hors conditions reseau degradées.
4. NFR4: Le delivery (paste/typing) doit etre **robuste**: en cas d’echec, l’app doit garantir un fallback (clipboard + notification).
5. NFR5: Aucune cle privee n’est exposee cote client; secrets uniquement via env/local secure storage; logs sans donnees sensibles.
6. NFR6: Privacy by design: consent explicite pour capture; retention configurable; suppression simple; minimiser l’audio stocke.
7. NFR7: Controles de cout: quotas, caching, choix de modeles; instrumentation des couts par action/utilisateur.
8. NFR8: UX premium et accessible: respecter WCAG 2.1 AA pour les ecrans principaux.
9. NFR9: Sync Supabase (si active) ne doit pas bloquer le flux local (SQLite reste source de verite).

## User Interface Design Goals

### Overall UX Vision
Une experience “premium SaaS” tout en restant ultra-rapide: contrast split (dark navigation + light canvas), micro-interactions (hover lift, ghost actions), feedback non-intrusif (toasts), et un focus constant sur l’action principale: dicter et livrer le texte.

### Key Interaction Paradigms
- Hotkey-first: l’utilisateur declenche, dicte, voit un feedback minimal, et retrouve le controle dans l’app cible.
- “Delivery confidence”: l’utilisateur sait toujours si le texte a ete insere/copied.
- “Progressive disclosure”: les actions secondaires apparaissent au survol; la complexite est masquee.

### Core Screens and Views
- Onboarding / permissions (micro, accessibilite/automation)
- Login / Signup / Forgot password
- Dashboard (stats, upsell, historique recent)
- Overlay “Quick Dictate” (listening/processing + actions)
- Full Dictate editor (realtime + edition + style + send/copy)
- Notes (form + list)
- Dictionary (liste + ajout)
- Styles (presets + preview)
- Settings (app, hotkeys, privacy, integrations, billing)

### Accessibility: WCAG AA

### Branding
Aligner palette, typo, radius, ombres et micro-interactions sur `docs/front-end-spec.md` (CrocoVoice Emerald, Plus Jakarta Sans, glow subtil, glass header, rows avec ghost actions).

### Target Device and Platforms: Desktop Only

## Technical Assumptions

### Repository Structure: Monorepo
Repo unique pour l’app Electron et ses modules (main/renderer/services/docs), en gardant le layout plat existant tant que possible.

### Service Architecture
Monolithe Electron (main + renderer + IPC) avec:
- SQLite local comme source de verite
- Supabase optionnel (auth + sync) / functions si besoin
- APIs externes (OpenAI/Whisper/LLM, Stripe) via calls securises.

### Testing Requirements
MVP: tests manuels + smoke checklist + instrumentation. Phase suivante: ajouter des tests unitaires pour la logique “pure” (quota, routing, formatting) et des tests d’integration minimalistes pour les flows critiques.

### Additional Technical Assumptions and Requests
- Strategie de fallback insertion: autotyping → paste → clipboard + toast
- Table de compatibilite apps/OS (Slack, Gmail web, Notion, VS Code, etc.) avec priorites
- Budget perf/cout formalise (latence, erreurs, cout par 1k mots).

## Epic List

- Epic 1: Stabilisation & Mesure du Pipeline: rendre le flux dictée fiable, observable, et predictable (perf, erreurs, cout).
- Epic 2: Dictée Universelle & UX Premium (Core): hotkeys, overlay, full editor, delivery robuste, styles v1.
- Epic 3: Freemium & Billing: quota hebdo, paywall “just-in-time”, PRO illimite, forgot password, settings billing.
- Epic 4: Historique, Notes, Dictionary, Snippets: rendre CrocoVoice utile au quotidien (retrouver, reutiliser, personnaliser).
- Epic 5: Integrations & Routing: Slack/email/notion/webhooks + abstraction layer + contexte minimal.
- Epic 6: Transcription Fichiers & Meetings (Phase): upload, exports, puis meeting recording manuel + summary + search.

## Epic 1 Stabilisation & Mesure du Pipeline

Objectif: fiabiliser le coeur (capture → STT → post-process → delivery) et donner de la visibilite (latence, erreurs, cout) pour iterer sans regressions.

### Story 1.1 Observabilite UX et erreurs actionnables
As a user,  
I want clear feedback during dictation and delivery,  
so that I trust the result and can recover from errors.

#### Acceptance Criteria
1: L’overlay indique listening/processing/success/error avec micro-interactions (toasts) cohérentes.
2: En cas d’erreur STT/LLM/reseau, un message lisible est affiche et propose une action (retry/copy).
3: Les erreurs critiques laissent le texte (si dispo) dans le clipboard.

### Story 1.2 Saferail enregistrement et gestion du micro
As a user,  
I want protections against accidental long recordings,  
so that I don’t waste quota or time.

#### Acceptance Criteria
1: Un timebox configurable (ex: 2–5 min) stoppe l’enregistrement et demande confirmation.
2: Un indicateur persistant “recording” est visible pendant capture.

### Story 1.3 Budget performance & mesures p95
As a product owner,  
I want latency and failure-rate metrics,  
so that we can set targets and detect regressions.

#### Acceptance Criteria
1: Mesure hotkey→listening, stop→texte final, delivery success rate.
2: Les metrics sont visibles dans une vue interne/debug et/ou logs structurés.

## Epic 2 Dictée Universelle & UX Premium (Core)

Objectif: rendre la dictée “hotkey-first” plus rapide, plus belle, et plus fiable, avec un mode edition pour les cas complexes.

### Story 2.1 Global hotkeys + overlay Quick Dictate
As a power user,  
I want global hotkeys for quick dictation,  
so that I can write without leaving my current app.

#### Acceptance Criteria
1: Hotkey configurable (avec valeurs par defaut) pour start/stop.
2: Overlay minimaliste respecte la charte (emerald focus, glass, etc.).
3: Le texte final est livre a l’app cible (ou fallback clipboard).

### Story 2.2 Full Dictate editor (realtime + edition)
As a user,  
I want an editor to refine my dictation before sending,  
so that I can produce high-quality text for important messages.

#### Acceptance Criteria
1: Realtime transcription affichee pendant l’enregistrement (au minimum “interim”).
2: Edition possible avant envoi/copie, avec actions claires.
3: Respect du style UI premium (cards, header glass, etc.).

### Story 2.3 Delivery strategy: autotyping + paste fallback
As a user,  
I want CrocoVoice to reliably insert text,  
so that dictation works across apps and input fields.

#### Acceptance Criteria
1: Si autotyping echoue, tenter paste; sinon copier dans clipboard et notifier.
2: Un etat “delivered via paste/clipboard” est visible.

### Story 2.4 Styles v1 (presets + preview)
As a user,  
I want to choose a writing style,  
so that my dictation matches the context (Slack, email, doc).

#### Acceptance Criteria
1: Au moins 2–3 presets (casual/pro/structured) disponibles.
2: Preview “avant/apres” visible.
3: Le style applique la structuration simple (listes, titres) quand pertinent.

## Epic 3 Freemium & Billing

Objectif: monetiser sans casser l’existant, avec un quota lisible, un paywall au bon moment, et une page settings dediee au billing.

### Story 3.1 Forgot password flow
As a user,  
I want to reset my password by email,  
so that I can regain access without support.

#### Acceptance Criteria
1: Lien “mot de passe oublie” + formulaire email + confirmation.
2: Reset via Supabase; retour vers login.

### Story 3.2 Quota hebdo persistant et affichage fiable
As a FREE user,  
I want my remaining weekly words to persist correctly,  
so that I’m not misled by resets on app restart.

#### Acceptance Criteria
1: La conso est calculee sur le texte final (post-process) et persiste localement.
2: L’UI affiche “restant + date/heure de reset” sans afficher une valeur “fake” au demarrage.

### Story 3.3 Paywall “just-in-time” au moment d’une dictée
As a FREE user,  
I want the paywall to appear only when I try to dictate at 0 words,  
so that the app stays usable and the upsell feels fair.

#### Acceptance Criteria
1: A 0 mots, le paywall s’affiche uniquement quand l’utilisateur lance une dictée.
2: CTA upgrade clair + lien vers billing/settings.
3: L’historique/notes restent consultables en FREE.

### Story 3.4 PRO checkout + customer portal
As a user,  
I want to subscribe and manage billing,  
so that I can upgrade/downgrade and access invoices.

#### Acceptance Criteria
1: Checkout PRO fonctionne (Stripe ou equivalent) et met a jour l’entitlement.
2: Lien “Gerer mon abonnement” ouvre le portal avec un indicateur de chargement.

## Epic 4 Historique, Notes, Dictionary, Snippets

Objectif: transformer CrocoVoice en outil quotidien: retrouver, organiser, reutiliser, personnaliser.

### Story 4.1 Notes view (create + list + search)
As a user,  
I want a dedicated notes view,  
so that I can store and find manual notes separately from dictations.

#### Acceptance Criteria
1: Creation note (titre optionnel, corps) + list + delete.
2: Recherche filtre la liste des notes.

### Story 4.2 Historique “premium” (rows + ghost actions)
As a user,  
I want a clean history list with quick actions,  
so that I can copy or delete entries fast.

#### Acceptance Criteria
1: Lignes “smart list row” avec actions copy/delete au hover.
2: Etats vides (empty states) soignes.

### Story 4.3 Dictionary v1 (manual + suggestions)
As a user,  
I want to add custom words and names,  
so that transcriptions improve over time.

#### Acceptance Criteria
1: Ajout manuel + liste.
2: (Option) bouton “ajouter au dictionnaire” sur correction utilisateur.

### Story 4.4 Snippet library v1 (cue → template)
As a user,  
I want to insert templates by voice cue,  
so that I can reuse recurring text quickly.

#### Acceptance Criteria
1: CRUD snippets (cue + contenu).
2: Matching simple (exact/contains) en MVP.

## Epic 5 Integrations & Routing

Objectif: permettre un routage fiable vers quelques integrations prioritaires, sans fragiliser le core.

### Story 5.1 Integration abstraction + graceful degradation
As a user,  
I want integrations to fail gracefully,  
so that I always get my text delivered somehow.

#### Acceptance Criteria
1: Abstraction layer (adapters) + status visibles.
2: Fallback clipboard si echec API.

### Story 5.2 Slack integration (send message)
As a user,  
I want to send dictation to Slack,  
so that I can communicate without typing.

#### Acceptance Criteria
1: Connect Slack (token/OAuth selon faisabilite) et envoyer message vers un canal choisi.
2: Feedback success/error + retry.

### Story 5.3 Notion integration (create note/page)
As a user,  
I want to send dictation to Notion,  
so that my notes are stored where I work.

#### Acceptance Criteria
1: Creation d’une page ou ajout a une database cible.
2: Formatting simple (titre + corps).

## Epic 6 Transcription Fichiers & Meetings (Phase)

Objectif: etendre CrocoVoice au “long form” (uploads) puis meetings, en commençant par un scope controlé.

### Story 6.1 Upload transcription v1 (audio/video)
As a user,  
I want to upload a file for transcription,  
so that I can transcribe long recordings.

#### Acceptance Criteria
1: Upload + progression + statut processing.
2: Resultat sauvegarde et consultable dans l’historique.

### Story 6.2 Export v1 (md/txt/json)
As a user,  
I want to export my transcripts,  
so that I can share or archive them.

#### Acceptance Criteria
1: Export md/txt/json disponibles depuis une entree.
2: Timestamps optionnels.

### Story 6.3 Meeting recording (manual) + transcript
As a user,  
I want to manually record a meeting and get a transcript,  
so that I can capture discussions without complex auto-join.

#### Acceptance Criteria
1: Demarrage/stop recording depuis l’app.
2: Transcript genere et accessible.

### Story 6.4 Meeting summary + action items
As a user,  
I want a meeting summary and action items,  
so that I can follow up quickly.

#### Acceptance Criteria
1: Summary, decisions, action items au format lisible.
2: L’utilisateur peut editer avant partage.

## Checklist Results Report

Ce rapport est une auto-evaluation rapide (non exhaustive) avant passage a l’architecture.

### Category Statuses
| Category | Status | Critical Issues |
| --- | --- | --- |
| 1. Problem Definition & Context | PASS | Manque de donnees d’usage (user research) quantifiees |
| 2. MVP Scope Definition | PARTIAL | MVP doit etre tranche (meeting/integrations) pour tenir 8–12 semaines |
| 3. User Experience Requirements | PASS | Specs UI disponibles; a completer par wireframes/flows |
| 4. Functional Requirements | PASS | Besoin de priorisation claire (Must vs Post-MVP) par requirement |
| 5. Non-Functional Requirements | PARTIAL | Cibles perf/cout a valider sur machine+usage reel |
| 6. Epic & Story Structure | PARTIAL | Certaines stories restent larges (integrations/meetings) |
| 7. Technical Guidance | PASS | Stack/contraintes brownfield connues |
| 8. Cross-Functional Requirements | PARTIAL | Privacy/retention/legal a formaliser (policies) |
| 9. Clarity & Communication | PASS | Document coherent; alignement stakeholders a faire |

### Final Decision
NEEDS REFINEMENT (priorisation MVP + delimitation meetings/integrations + privacy policy) avant passage “architect”.

## Next Steps

### UX Expert Prompt
En tant que UX Expert, propose des wireframes et flows pour: Quick Dictate overlay, Full Dictate editor, Dashboard premium, Notes, Settings (Integrations + Billing), et paywall just-in-time. Respecter `docs/front-end-spec.md` et prioriser les etats (loading/error/empty).

### Architect Prompt
En tant qu’Architecte, definis une architecture brownfield evolutive pour CrocoVoice (Electron main/renderer/IPC + SQLite + Supabase optionnel) qui respecte les NFR (perf, privacy, cout). Propose une strategie d’insertion robuste (typing/paste/clipboard), d’observabilite, et une approche securisee pour Stripe/entitlements, avec une roadmap technique alignée aux epics.
