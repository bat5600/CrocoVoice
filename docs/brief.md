# Project Brief: CrocoVoice (OS vocal IA)

Date: 2026-01-20  
Version: v1.0 (YOLO draft)  
Sources principales: `docs/CrocoVoice_new_idea_new_prd.md` (+ `docs/brainstorming-session-results.md`, `docs/ideas-for-later.md`, `docs/front-end-spec.md`, `docs/prd/intro-project-analysis-and-context.md`)

## Executive Summary

CrocoVoice vise a devenir un **OS vocal IA**: une app desktop avec **un hotkey** qui capture la voix, transcrit, nettoie/structure, et **execute la bonne action** (insertion au curseur, envoi vers une integration, creation de note, etc.) sans context switching.

Le projet part d’un existant (Electron + Whisper + post-process + auto-typing, dashboard + auth/sync optionnel via Supabase) et cherche a l’etendre graduellement vers une experience “premium” (UX, fiabilite, monetisation) puis vers des modules avancés (meeting assistant, snippets vocaux, knowledge base, commandes, etc.).

**MVP recommande (8–12 semaines)**: dictee universelle fiable + post-process de qualite + historique + quota/paywall + settings (latence et robustesse prioritaires), avec une base d’integrations minimalistes (clipboard / paste + 1–2 apps). Le meeting assistant et la “voice-to-action orchestration” multi-app sont post-MVP (complexite + risques privacy/OS).

## Problem Statement

Les utilisateurs “power” (fondateurs, sales, creators) ecrivent et re-ecrivent toute la journee (Slack, email, docs, IDE) et subissent:

- friction de saisie (typing, fatigue, interruptions)
- perte de contexte (switch d’apps, copier-coller, allers-retours avec ChatGPT)
- texte vocal brut souvent “pas assez propre” (hesitations, ponctuation, structure)
- outils concurrents fragmentes (dictation vs meetings vs notes vs AI): chacun fait une tranche du besoin, sans orchestration.

Les solutions actuelles couvrent partiellement le besoin: dictée universelle (Wispr Flow), meeting transcription (Fireflies/Otter), assistants OS (Siri/Google) mais sans la qualite, la structure et l’integration “pro” attendues pour ecrire vite et bien dans des outils professionnels.

## Proposed Solution

CrocoVoice est une app desktop centrée sur:

- **Hotkey global** (quick dictate + full dictate) + feedback d’enregistrement
- **Speech-to-text** (Whisper/cloud au debut) + **post-processing IA** (nettoyage, style, structure, listes)
- **Insertion au curseur** (autotyping / paste / clipboard) avec fallback robuste
- **Historique et edition** (retrouver, copier, supprimer, re-appliquer un style)
- **Monetisation freemium** (quota mots/sem + PRO illimite) avec paywall clair et UX premium
- (Post-MVP) **orchestration** (routing vers Slack/Email/Notion), **snippets vocaux**, meeting assistant, knowledge base + search.

## Target Users

### Primary User Segment: SaaS Founder / Power User
- Multi-context (Slack, email, docs, IDE), recherche vitesse + zero friction
- Pret a payer pour un gain de productivite tangible
- Attentes elevees sur la latence, la fiabilite, et la qualite “texte final”.

### Secondary User Segment: Remote Worker / Sales / Creator
- Calls + follow-ups + notes en continu; besoin de summaries/action items (post-MVP)
- Dictée et reformatage rapide (posts, docs, messages) avec styles.

## Goals & Success Metrics

### Business Objectives
- Lancer un MVP stable qui devient un usage quotidien (“habit forming” via hotkey)
- Activer un modele freemium (FREE quota hebdo) et une conversion PRO saine
- Garder les couts IA sous controle (marge > 50% a terme).

### User Success Metrics
- Hotkey adoption (ex: > 60% des users actifs utilisent le hotkey quotidiennement)
- Qualite percue du texte final (feedback thumbs up/down, NPS qualitatif)
- Gains de temps auto-reportes (“j’ecris X% plus vite”, “moins de rework”).

### Key Performance Indicators (KPIs)
- Activation: % utilisateurs qui finissent onboarding + 1ere dictée reussie
- WAU/DAU, retention D7/D30
- Conversion FREE -> PRO, churn PRO
- Performance: latence hotkey -> “listening” (< 100ms cible), dictée -> texte final (< 3s cible sur 30–60s audio)
- Qualite STT: taux d’erreurs corrigees manuellement / 1k mots (tendance a la baisse)
- Fiabilite: crash rate et “paste failure rate”.

## MVP Scope

### Core Features (Must Have)
- **Dictée hotkey** (quick dictate) avec feedback, stop auto (silence) et gestion d’erreurs
- **Post-process qualite**: suppression hesitations, ponctuation, capitalisation, structuration simple (listes)
- **Insertion robuste**: autotyping + fallback paste/clipboard (et indication de “delivery”)
- **Historique** (ex: 50 dernieres transcriptions) + actions Copy/Delete
- **Settings**: micro selection, hotkey, styles de base (2–3 presets), privacy controls
- **Freemium**: quota mots/sem, affichage conso, paywall au moment du quota atteint, upgrade PRO (checkout) + page settings billing
- **UX premium** alignee aux guidelines (`docs/front-end-spec.md`) sur les ecrans critiques (signup/dashboard/settings + etats).

### Out of Scope for MVP
- Meeting assistant complet (auto-join Zoom/Meet/Teams, diarization, summaries)
- Voice commands OS generalistes
- Knowledge base + semantic search + embeddings
- Multi-platform complet (Windows/Linux) si cela compromet la qualite/velocity (cible: macOS d’abord)
- Offline-first complet (option post-MVP).

### MVP Success Criteria
Le MVP est considere reussi si, sur un panel d’utilisateurs:

- La dictée est fiable et rapide (peu de cas “j’ai dit X, ca a ecrit Y”)
- Le texte final est “directement envoyable” sans rework majeur la plupart du temps
- L’UX de quota/paywall est comprise et la conversion PRO est mesurable
- Les incidents critiques (crash, insertion rate, perte de dictée) sont rares et monitorables.

## Post-MVP Vision

### Phase 2 Features
- Snippets vocaux (voice shortcuts) + dictionnaire evolutif (apprend des corrections)
- Styles contextuels (email vs Slack vs doc) + preview “avant/apres”
- Integrations 1st-party (Slack, Gmail, Notion) + webhooks (Zapier/Make/n8n)
- “Smart corrections” (quand l’utilisateur se corrige a l’oral, n’ecrire que la version finale).

### Long-term Vision (1–2 ans)
- Meeting assistant: capture + transcription temps reel + summaries/action items + search
- OS vocal “voice-to-action” multi-app (routing + workflows)
- Knowledge base/graph issu des transcriptions (personnel ou equipe)
- Options privacy: local models (Whisper on-device, LLM local) pour certains usages.

### Expansion Opportunities
- Offre equipe/enterprise: workspace, SSO, admin, retention longue, compliance (SOC2/GDPR)
- Marketplace/SDK d’integrations (“voice apps”).

## Technical Considerations (initial thoughts)

- **Target Platforms:** macOS d’abord; Windows ensuite si la fiabilite hotkey/insertion est solide
- **App:** Electron (existant) + UI premium (styles definis dans `docs/front-end-spec.md`)
- **STT:** Whisper cloud au debut; benchmark providers realtime post-MVP (Deepgram/Assembly) si besoin
- **Data:** SQLite local comme source de verite + sync optionnelle via Supabase (existant)
- **Security/Compliance:** minimiser la retention audio, encryption at-rest, controles de suppression, consent explicite avant capture/meeting
- **Cost controls:** quotas, caching, choix de modeles moins chers pour post-process; telemetrie des couts.

## Constraints & Assumptions

### Constraints
- **Ressources:** petite equipe (1–2 dev au depart); necessite de prioriser la stabilite
- **Timeline:** MVP en ~8–12 semaines (a ajuster selon scope monetisation/UX)
- **OS APIs:** detection de contexte et insertion dependantes des OS (fragiles); necessite d’un fallback fiable
- **Privacy:** audio/transcripts sensibles; risques juridiques et de confiance.

### Key Assumptions
- La valeur #1 percue est **qualite du texte final + vitesse/fiabilite hotkey**, avant les features “meeting”
- Un modele freemium (quota hebdo) est suffisant pour initialiser la monetisation
- Le produit peut demarrer “single player” (pas d’equipe) avec sync optionnelle.

## Risks & Open Questions

### Key Risks
- **Couts IA** qui depassent le revenu si usage non controle (mitigation: quotas, caching, model selection)
- **Fiabilite insertion** (autotyping/paste) sur des apps variees (mitigation: fallback + tests matrix)
- **Privacy/Trust** (mitigation: transparence, controles retention, option local/limitation audio)
- **Scope creep** (mitigation: MVP strict + phases).

### Open Questions
- MVP: quelle surface “core” prioritaire (widget vs editor) et quelles integrations “Day 1” ?
- Quota: reset fixe (lundi) vs fenetre glissante; soft vs hard limit
- Quel niveau de “context awareness” est necessaire en MVP (simple app focus vs heuristiques avancées) ?
- Roadmap platform: macOS only combien de temps avant Windows ?

### Areas Needing Further Research
- Benchmark STT (latence/qualite/cout) et strategy multi-provider
- Approche robuste pour app focus + insertion par OS
- Cadre privacy (retention, encryption, consent, deletion) et limites legales selon marche cible.

## Appendices

### References
- Vision/roadmap/features: `docs/CrocoVoice_new_idea_new_prd.md`
- Cadrage V1 + monetisation simple: `docs/brainstorming-session-results.md`
- Backlog d’idees et pain points UX: `docs/ideas-for-later.md`
- Direction UX premium: `docs/front-end-spec.md` et `docs/ux/cahier-des-charges-crocovoice-2-0.md`
- Etat actuel du produit (brownfield): `docs/prd/intro-project-analysis-and-context.md`

## Next Steps

1. Valider le scope MVP (must-have vs out-of-scope) et les hypotheses principales
2. Choisir la cible platform “Phase 1” (macOS only ou cross-platform des le debut)
3. Produire un **nouveau PRD vNext** structure (requirements + epics + stories) base sur ce brief et `docs/CrocoVoice_new_idea_new_prd.md`
4. Ecrire une roadmap 2–3 phases (MVP, Phase 2, Long-term) avec criteres d’entree/sortie par phase
5. Mettre en place un plan de mesure (events + KPIs) et un plan de controle des couts IA.

### PM Handoff
Ce Project Brief donne le contexte global de CrocoVoice. Prochaine etape: entrer en “PRD Generation Mode” pour produire un PRD versionne et actionnable (requirements + epics + stories) en s’appuyant sur ce brief et les sources d’idees.
