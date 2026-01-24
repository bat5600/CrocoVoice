# FakeWispr vs CrocoVoice - analyse interconnectee (2026-01-24)

## 0) Perimetre, sources, limites

Cette analyse compare FakeWispr et CrocoVoice, avec un focus sur le fonctionnement global, les flux, et l interconnexion entre composants.

Sources inspectees (locales) :
- FakeWispr binaire et ressources :
  - /home/baptiste/projects/FAKEwispr/app-1.4.171/resources/migrations
  - /home/baptiste/projects/FAKEwispr/app-1.4.171/resources/assets
  - /home/baptiste/projects/FAKEwispr-extract/package.json
  - /home/baptiste/projects/FAKEwispr-extract/.webpack (bundles)
- FakeWispr app.asar extrait (complet) :
  - /home/baptiste/projects/FAKEwispr/app-1.4.171/resources/app.asar
  - /home/baptiste/projects/FAKEwispr-asar-extract/.webpack (main + renderer bundles)
  - /home/baptiste/projects/FAKEwispr-asar-extract/node_modules
- CrocoVoice code source :
  - main.js
  - renderer.js
  - preload.js
  - store.js
  - sync.js
  - dashboard.js
  - supabase/functions/*

Limites :
- FakeWispr est precompile (bundles webpack). La visibilite du code source est limitee. L analyse s appuie donc sur :
  - le package.json (stack et dependances)
  - les migrations SQLite (schema et evolution des donnees)
  - les assets (UX, sons, icones, videos)
  - les indices/colonnes qui laissent deviner les flux
- FAKEwispr-extract etait un extrait partiel (sans node_modules et sans une partie des bundles renderer/main).
- Le full extract asar apporte plus d indices, mais le code reste minifie, donc certaines deductions restent des inferrences.
- Le .env fourni contient des secrets (telemetrie / backends). Ils ne sont pas reproduits ici.
- Certaines interpretations sont donc des inferrences, marquees comme telles.

---

## 1) FakeWispr - architecture et fonctionnement

### 1.1 Stack et packaging

- Electron Forge + webpack (main + renderer) -> app desktop multiplateforme.
- Frontend probable : React (dependances react/react-dom, storybook).
- Backend local : SQLite + Sequelize (migrations dans resources/migrations).
- Observabilite/telemetrie : Sentry, PostHog, electron-log.
- Analytics/telemetrie (env) : Segment, Clickhouse (valeurs redacted).
- IA/ASR : presence de onnxruntime-web + grpc + opusscript + flowtoken suggere un pipeline local + cloud (inference hybride).
- Inference locale : presence de ort-wasm-simd-threaded.* (onnxruntime WebAssembly, SIMD + threads).
- Audio temps reel : AudioWorklet (recorderWorklet.js) avec chunkSize=640 et renderQuantumSize=128 (chunking faible latence).
- Transport streaming : flags use-opus, use-msgpack, use-baseten-websocket, use-grpc-client-desktop -> transmission audio/texte en flux.
- Auth/sync : supabase-js, jwt, node-cron.
- UX/anim : lottie-web, howler (sons), lexical (editeur), motion.
- Multi-fenetres renderer : hub, status, contextMenu (separation UI).

Implication : FakeWispr est une app fortement structuree autour d un store local riche + un pipeline de transcription multi-niveaux (local/fallback) + une couche de personnalisation et d observabilite.

### 1.1.1 Indices cles du full extract asar

- .webpack/renderer/dist/recorderWorklet.js : AudioWorklet qui accumule des buffers multi-stream puis envoie des chunks (consensus index).
- .webpack/main/ort-wasm-simd-threaded.{mjs,wasm} : runtime ONNX pour inference locale (WASM SIMD/threads).
- .webpack/main/native_modules : .node natifs + crypt32 + roots.exe + proto/xds -> compat Windows + gRPC/TLS.
- .webpack/main/native_modules/daemon.js : process separer pour taches planifiees (cron).
- .webpack/renderer/{hub,status,contextMenu} : surfaces UI separees (hub complet + status bubble + menu contextuel).

### 1.2 Modele de donnees local (SQLite)

#### Table History (transcriptions et contexte)
Table creee puis enrichie par nombreuses migrations. Champs principaux :
- transcriptEntityId (PK)
- asrText, formattedText, editedText
- toneMatchedText, toneMatchPairs (JSON)
- defaultAsrText, fallbackAsrText, defaultFormattedText, fallbackFormattedText
- fallbackAsrDivergenceScore, fallbackFormattingDivergenceScore
- e2eLatency, clientNetworkLatency, fallbackLevel
- duration, numWords
- detectedLanguage, averageLogProb
- editedTextAttempts, editedTextStatus
- formattingDivergenceScore, pastedText
- feedback, desiredAsr, desiredFormatted
- hasRevertedAI
- usedFallbackAsr, usedFallbackFormatting
- calledExternalAsr, transcriptOrigin
- transcriptCommand (ptt | popo | lens | command)
- conversationId
- app, url, screenshot, textboxContents
- axText, axHTML (accessibility snapshot)
- audio, builtInAudio, opusChunks
- micDevice
- appVersion, platform
- shareType (ex shareable), needsUploading
- isArchived
- timestamps + multiples index

Lecture fonctionnelle :
- FakeWispr stocke non seulement le texte final, mais aussi toutes les versions intermediaires (ASR brut, formatting, tone match), plus les metriques de qualite, latence, et fallback.
- Le contexte applicatif est capture (app, url, screenshot, textbox contents, accessibilite).
- Le pipeline est instrumente (e2e latency, network latency, fallback usage, divergence scores).

#### Table Dictionary (lexique, snippets, remplacement)
Evolution notable :
- id (UUID), phrase, replacement
- teamDictionaryId (support multi equipe)
- lastUsed, frequencyUsed, remoteFrequencyUsed
- manualEntry, isDeleted
- source, observedSource
- isSnippet
- contrainte unique (phrase, teamDictionaryId)

Lecture fonctionnelle :
- Le dictionnaire est un systeme de personnalisation robuste (corrections + snippets).
- Support multi equipers + sync + suivi des usages.
- Indices hub : auto-add to dictionary, autoLearned, tri newest/oldest, team dictionary ops.

#### Table Notes
- id, title, content, contentPreview
- createdAt, modifiedAt
- synced, isDeleted

#### Table RemoteNotifications
- id, type, key, title, text
- isArchived, isRead, synced
- createdAt/updatedAt

#### Table FlowLensHistory
- conversationId, userId, role (user/assistant/system)
- content (JSON), tools (JSON)
- app, url, screenshot
- axText, axHTML
- needsUploading
- indexes par conversationId, userId, etc

Lecture fonctionnelle :
- Flow Lens ressemble a un assistant conversationnel enrichi par contexte applicatif (app/url/screenshot/ax).

### 1.3 Flux principal de dictation (inference)

Flux probable, base sur schema + assets + dependances :

1) Capture audio
   - Micro selection (micDevice), start/stop sounds (assets/sounds/*dictation*).
   - AudioWorklet (recorderWorklet.js) : chunkSize=640, renderQuantumSize=128, envoi de chunks multi-stream.
   - Encodage possible Opus / MsgPack (flags use-opus, use-msgpack).
2) ASR principal
   - Transcription initiale -> asrText.
   - Streaming texte possible (flag stream-text).
   - Transport variable : WebSocket (flag use-baseten-websocket) ou gRPC (use-grpc-client-desktop / use-grpc-staging).
3) Post-processing/formatting
   - formattedText, editedText.
4) Tone matching / personnalisation
   - toneMatchedText + toneMatchPairs.
5) Fallback pipeline
   - default vs fallback ASR/formatting + divergence scores.
6) Delivery
   - paste/typing/command (transcriptCommand).
   - variantes UX : paste sound, shift-insert, notifications d echec de paste.
7) Persistence + telemetry
   - latences, qualite, contexte (app/url/screenshot/textbox/ax), feedback.
8) Sync
   - needsUploading, shareType, remote notifications.

### 1.4 Personnalisation et contexte

Indices forts :
- personalizationStyleSettings (JSON) dans History.
- assets/images/personalization_icons (email/work/personal style).
- toneMatchPairs + toneMatchedText.
- dictionary/snippets avec usage frequency.
- flags : style-detection, style-personalization, contextual-nudge, wiggle-contextual-reminder.
- hub : selection de "polish rules" + autoOpenDiff (diff auto).

Lecture fonctionnelle :
- FakeWispr adapte le style (pro/perso/email) et garde des paires tone match.
- Des nudges contextuels existent (assets/images/contextual_nudge).

### 1.5 Observabilite et qualite

- e2eLatency, clientNetworkLatency, fallbackLevel.
- averageLogProb + detectedLanguage.
- fallback usage + divergence score.
- feedback explicite + desiredAsr/desiredFormatted.
- flags : send-logs, log-ipc-events, cpu-profiling, sampling-rate.

Lecture fonctionnelle :
- Le produit mesure la qualite et la fiabilite, et conserve les artefacts utiles pour itere sur le pipeline.

### 1.6 UX/Produit

Assets indiquent :
- start/stop sounds en multiples versions (A/B tests audio).
- popo-lock sounds (mode push-to-talk verrouille) + paste sounds + notification/achievement sounds.
- tray icons Active/Inactive.
- icons tres riches (history, dictionary, notes, snippets, shortcuts, share, etc).
- lottie animations : ai_auto_edit, languages, works_in_any_app.
- videos par cas d usage (gmail, slack, documentation, etc).
- wrapped2025 (stats/analyse annuelle type Spotify Wrapped).
- diff viewer (avant/apres) dans le context menu (visualisation des edits/polish).
- status bubble avec indicateurs temps reel (audio level, WPM, command mode, mic active).
- flow bar typing reminder (nudge + snooze).
- mic selection dialog avec volume indicator.

### 1.7 Surfaces UI (multi-fenetres)

- Hub (renderer/hub) : interface principale (history, dictionary, notes, settings, onboarding).
- Status (renderer/status) : status bubble temps reel (micro, langue, etat).
- ContextMenu (renderer/contextMenu) : actions rapides, selection mic/langue, paste last transcript, diff viewer.

### 1.8 Feature flags et experimentation (extrait enum observe)

Transport/infra :
- use-opus, use-msgpack, use-baseten-websocket, use-grpc-client-desktop, use-grpc-staging, grpc-desktop-rollout
- use-staging-backend, use-base10-staging
- stream-text, sampling-rate, notify-pong-timeout, websocket-pong-timeout

Systeme de flags :
- enabled-flag, disabled-flag, payload-flag, attribution-items

Contexte/robustesse :
- complex-textbox-extraction, ax-context-v2, focus-change-detector-enabled, focus-change-detector-app-change
- kill-orphan, kill-detached-helper, skip-url-search, skip-edited-text-manager

Equipe/integrations :
- app-teams-settings, slack-tagging, email-sign

UX/produit :
- show-first-dictation-notification, failed-paste-notification, audio-quality-notification, wrong-language-setting-notification
- style-personalization, style-detection, contextual-nudge, wiggle-contextual-reminder, paste-sound, shift-insert, polish
- user-personalized-onboarding, switch-theme, auto-add-to-dict-sound

Growth/engagement :
- refer-promo-offer, referral-invite-team-cta, trial-opt-in-v2, daily-streak, flow-wrapped, hub-top-apps, resurrected-user-flow

Ops/telemetrie :
- log-ipc-events, send-logs, cpu-profiling, remote-notifications

Lecture fonctionnelle :
- FakeWispr pilote de nombreux comportements par flags, ce qui permet un rollout progressif, des A/B tests, et du kill-switch.

### 1.9 IPC et services (observes via hub renderer)

History :
- history:getTranscript / getTranscriptAllColumns / getAudioForTranscript
- history:toggleAiEdit / retryTranscript / sendTranscriptFeedback
- history:getTopApps / getBulkAppWordCounts / initializeStatistics
- history:archiveAll / deleteAllTranscripts / setArchiveTranscript

Notes :
- notes:create / edit / delete / get / getAll / refresh / hardRefresh

Dictation pipeline :
- dictation:audioSetup / audioStart / audioChunk / audioStop / audioClose
- dictation:setStreamingTextState / setAppTypeManually / pasteLastTranscript

Dictionary/memory :
- memory:addManualWord / editManualWord / removeManualWord
- memory:addManualTeamWord / editManualTeamWord / removeManualTeamWord
- memory:getWords / getTeamWords / getStrippedSnippets / syncDictionary

Teams / billing / referrals :
- teams:* (invites, join requests, eligibility, members, enterprise refresh)
- billing:* (pricing, checkout, manage subscription, update status)
- referral:sendInvites / sendIPhoneDownloadLink / cacheReferralInfo

Notifications :
- notification:* (local OS notifications)
- remoteNotification:* (remote inbox + callbacks)

Shared settings :
- sharedSettings:getAudioDevices / updateAudioDevices / signHipaaBaa

Flow state & hub UX :
- flowState:getFlowState / updateFlowState / clearFlowState
- hub:openSettings / openStats / openPolishDialog / openShortcutsDialog
- status:* (audio level, dictation status, polish diff, flow bar)

Lecture fonctionnelle :
- Le hub renderer orchestre une large surface de services IPC, avec separation claire par domaine.

### 1.10 Modules produit observes (hub)

- Onboarding multi-etapes (welcome, login, permissions, mic test, shortcuts, use-cases, trial opt-in).
- Personalization (Style + Dictionary + Snippets + auto-learn).
- History (audio playback, archive, AI edit toggle, report).
- Notes (preview, inline editor, CRUD complet).
- Polish (post-process du texte avec diff viewer).
- Flow Wrapped (year in review) + Stats (Top apps, WPM, usage).
- Billing/Plans (pricing, checkout, manage subscription).
- Teams/Enterprise (invites, domain eligibility, admin contact).
- Notifications (local + remote inbox).
- Settings (audio devices, share usage data, flow bar typing reminder).

### 1.11 App detection / integrations

Indices d une taxonomie app :
- Messagerie : Slack, Teams, Discord, Telegram, WhatsApp, Signal.
- Email : Apple Mail, Outlook, Superhuman, Spark.
- IDEs : VSCode, JetBrains, Sublime, Cursor, Windsurf.
- Navigateurs : Chrome, Edge, Brave, Firefox, Safari, Vivaldi, Opera.
- Notes/docs : Apple Notes, OneNote, Scrivener, Pages.

Lecture fonctionnelle :
- Detection par bundleId + app categories pour adapter UX, style, onboarding et stats.

### 1.12 Enterprise / compliance

- Sign HIPAA BAA (sharedSettings:signHipaaBaa).
- Team billing, admin contact, enterprise trials, SSO/SOC2 mentionnes dans UI.
- Data usage policy + share usage data opt-in.

### 1.13 Interconnexion (schema conceptuel)

```
[Audio Capture] --> [AudioWorklet chunker] --> [Encoder: Opus/MsgPack] --> [Transport: WS/gRPC/Baseten] --> [ASR primary]
        |                         |                              |                               |
        |                         |                              |                               +--> [Streaming text]
        |                         |                              +--> [Local ONNX fallback?]
        |                         |
        |                         +--> [Context capture: app/url/screenshot/textbox/ax]
        |
        +--> [Metrics: latency, micDevice, duration]

[ASR primary] --> [Formatting] --> [Tone/Style] --> [Dictionary/Snippets] --> [Delivery: paste/type/command]
                           |                  |                           |
                           |                  +--> [Quality: toneMatchPairs, editedTextStatus]
                           +--> [Fallback pipeline + divergence scores]

[History DB] <--> [Sync engine] <--> [Backend]
[Notes DB]   <--> [Sync engine]
[Dictionary] <--> [Sync engine + Team dictionary]
[Flow Lens]  <--> [AI assistant + context capture]
[Telemetry]  --> [Sentry/PostHog]
[Feature Flags/Remote Config] --> [Pipeline + UX + Telemetry + Transport]
[Scheduler/Daemon] --> [Remote notifications + daily streak + wrapped]
[Teams/Billing/Referral] <--> [Backend]
[Stats/TopApps/WPM] --> [Flow Wrapped + Hub dashboards]
[Hub UI] <--> [Status UI] <--> [ContextMenu UI] <--> [Main process]
```

---

## 2) CrocoVoice - architecture et fonctionnement

### 2.1 Stack et structure

- Electron app (main process + renderer + preload).
- IA : OpenAI Whisper (audio.transcriptions) + GPT post-process (chat.completions).
- Local DB : SQLite via store.js.
- Auth/Sync : Supabase (sync.js) + supabase/functions/* pour quota/stripe.
- Input automation : nut-js (fallback robotjs).

Fichiers principaux :
- main.js : orchestration globale, pipeline audio, transcription, post-process, delivery.
- renderer.js : capture audio + UI widget.
- preload.js : bridge IPC.
- dashboard.js + dashboard.html : interface complete (historique, notes, dictionnaire, style, settings, subscription, onboarding).
- store.js : schema local.
- sync.js : sync supabase.

### 2.2 Modele de donnees local (store.js)

Tables :
- settings (key, value, updated_at)
- history (id, user_id, text, raw_text, language, duration_ms, title, created_at, updated_at)
- dictionary (id, user_id, from_text, to_text, created_at, updated_at)
- styles (id, user_id, name, prompt, created_at, updated_at)
- notes (id, user_id, title, text, metadata, created_at, updated_at)

Indices :
- history.created_at
- notes.created_at
- dictionary.updated_at
- styles.updated_at

### 2.3 Flux principal de dictation

Pipeline (main.js + renderer.js) :

1) Renderer (renderer.js)
   - getUserMedia + MediaRecorder
   - buffers audio -> envoi IPC (audio-data ou audio-ready)
2) Main (main.js)
   - transcribeAudio() -> OpenAI whisper-1
   - postProcessText() -> GPT (gpt-4o-mini) si postProcessEnabled
   - applyDictionary() -> remplacement from_text -> to_text
   - generateEntryTitle() -> GPT titre
   - persistTranscription() -> history + last_transcription
   - optional addNote() si target notes
   - paste/type via clipboard + nut-js
3) UI feedback
   - widget status, errors, undo window, onboarding, quota gate

### 2.4 Onboarding, quota, subscription

- Onboarding multi-step (dashboard.js): permissions -> mic check -> first dictation -> delivery check.
- Quota hebdo (main.js + supabase/functions/quota-*)
- Stripe checkout/portal (supabase/functions/stripe-*)
- Subscription status garde en settings, gating dans UI.

### 2.5 Interconnexion (schema conceptuel)

```
[Renderer: MediaRecorder] --> IPC --> [Main: transcribe -> post-process -> dictionary]
                                    |                     |
                                    |                     +--> [Delivery: paste/type/clipboard]
                                    |
                                    +--> [Store: history, notes, styles, dictionary]
                                    |
                                    +--> [SyncService -> Supabase]
                                    |
                                    +--> [Quota: supabase/functions]

[Dashboard UI] <--> IPC <--> [Main + Store]
[Onboarding]  <--> IPC <--> [Main + Mic monitor]
```

---

## 3) Comparaison detaillee

| Theme | FakeWispr | CrocoVoice | Implication |
|---|---|---|---|
| Pipeline ASR | Multi-niveaux avec fallback, metrics, divergence scores | Un seul ASR (Whisper OpenAI) + post-process GPT | FakeWispr mesure et optimise la qualite; CrocoVoice plus simple mais moins robuste |
| Audio capture | AudioWorklet + chunking (640) + streaming | MediaRecorder + envoi fichier | FakeWispr optimise la latence et le temps reel |
| Transport | WebSocket/Baseten/gRPC + Opus/MsgPack | HTTP OpenAI direct | FakeWispr a plusieurs chemins + rollout progressif |
| Local inference | ONNX runtime (WASM SIMD/threads) possible | aucun engine local | FakeWispr peut fallback local ou faire du VAD/ML local |
| Contexte | app/url/screenshot/textbox/axText/axHTML | pas de contexte applicatif stocke | FakeWispr peut personnaliser et analyser par app, CrocoVoice non |
| Personnalisation | toneMatchedText, personalizationStyleSettings, dictionnaire evolue | styles simples (prompts) + dictionnaire simple | FakeWispr offre personnalisation plus profonde |
| Dictionnaire | phrases + replacement + snippet + team + usage freq + source | from_text -> to_text simple | CrocoVoice perd les usages et la logique d equipe |
| Feedback/QA | feedback + desiredAsr/desiredFormatted + revert AI | pas de feedback structure | FakeWispr boucle d amelioration qualite |
| Telemetrie | e2e latency + network latency + fallback level + PostHog/Sentry | logs locaux minimalistes | Moins de mesures de performance/qualite dans CrocoVoice |
| Feature flags | systeme de flags tres riche (transport/UX/ops) | pas de flags | FakeWispr peut experimenter + kill-switch |
| UI surfaces | hub + status + contextMenu | 1 dashboard + widget | FakeWispr separer les UI selon usage |
| Notes | Notes structurees + sync + deleted flag | Notes locales + sync simple | FakeWispr plus mature pour la gestion de notes |
| Notifications | local + remote notifications | absent | FakeWispr a un canal produit/ops |
| Flow Lens | conversation historique + tools + contexte | absent | FakeWispr propose un mode assistant/contextual AI |
| UX | sons A/B, assets riches, onboarding guide, videos | UI claire mais plus minimale | FakeWispr travaille beaucoup l experience et la pedagogie |
| Onboarding | multi-step + nudges + trial opt-in | simple | FakeWispr optimise activation et retention |
| Stats/Insights | top apps, WPM, Flow Wrapped | minimal | FakeWispr capitalise sur data pour engagement |
| Teams/Enterprise | teams, invites, domain eligibility, HIPAA BAA | individuel | FakeWispr couvre use-cases entreprise |

---

## 4) Idees d amelioration pour CrocoVoice (inspirees de FakeWispr)

### 4.1 Priorite haute (valeur forte + effort moyen)

1) Enrichir History (qualite + contexte)
   - Ajouter champs : app, url, screenshot, textboxContents, micDevice, detectedLanguage, averageLogProb, e2eLatency.
   - Fichier impacte : store.js, main.js (persistTranscription), dashboard.js (affichage).
   - Benefice : debloque analyses, QA, et personnalisation par app.

2) Pipeline audio faible latence
   - Ajouter AudioWorklet chunker (ex: chunkSize=640) + stream optionnel.
   - Option Opus + WebSocket pour transcription progressive.
   - Benefice : latence percue plus faible, UX temps reel.

3) Feedback loop
   - Ajouter feedback simple par entry (thumbs up/down + commentaire).
   - Stocker feedback dans history.
   - Utiliser pour iterer sur post-process et prompts.

4) Dictionnaire evolue
   - Ajouter : manualEntry, source, observedSource, frequencyUsed, lastUsed, isSnippet.
   - Ajouter table/gestion de snippets (expansion rapide).
   - Permet auto-apprentissage + UX plus fluide.

5) Qualite et fallback
   - Garder texte brut vs post-process + mesure divergence (ex: diff/Levenshtein).
   - Stocker fallback* si un second engine est ajoute (meme local).

### 4.2 Priorite medium

6) Personnalisation contextuelle
   - Styles par contexte (email / work / personal) + detection simple (app/url).
   - Utiliser un mapping app->style prompt.

7) Observabilite
   - Ajouter Sentry + metrics simples (latence, erreurs OpenAI, taux de fallback).
   - Expose dans dashboard une section Qualite.

8) UX audio
   - Sons start/stop distincts + A/B versions simples.
   - Indication system tray active/inactive (existe deja partiellement via widget, a completer).

9) Mode assistant (Flow Lens light)
   - Une vue "assistant" avec conversationId.
   - Stocker messages + contexte (app/url + dernier transcript).

10) Feature flags minimalistes
   - Ajout d un systeme de flags (local + remote) pour rollout progressif.
   - Permet A/B tests (UX, pipeline, pricing).

11) Multi-fenetres UI
   - Separer hub (dashboard) / status bubble / context menu rapide.
   - Facilite des actions rapides sans ouvrir le dashboard.

12) Taches background
   - Scheduler (cron) pour remote notifications, daily streak, wrapped.

13) Onboarding approfondi
    - Parcours multi-etapes (permissions, mic test, shortcuts, use-cases, trial opt-in).
    - Ameliore activation + retention.

14) Insights / Stats
    - Top apps, WPM, usage time, Flow Wrapped.
    - Encourage engagement et donne des preuves de valeur.

15) Status bubble riche
    - Audio level, WPM, command mode, mic active, polish diff.

### 4.3 Priorite basse / long terme

16) Remote notifications
   - Canal produit (annonces, aide, features).

17) Wrapped / stats annuels
   - Exploiter history pour insights (mots, heures, apps, style).

18) Pipeline multi-ASR
   - Ajouter fallback local (onnx) ou provider alternatif.

19) Teams / enterprise
   - Teams, invites, domain eligibility, billing pro/enterprise.
   - Option HIPAA BAA + data usage policy.

---

## 5) Roadmap d integration concrete (CrocoVoice)

### 5.1 Extensions de schema (store.js)

- Ajouter colonnes a history (app, url, micDevice, detectedLanguage, averageLogProb, e2eLatency, feedback).
- Ajouter table Dictionary enrichie ou colonnes supplementaires.
- Ajouter table Snippets (option) ou isSnippet.

### 5.2 Capture de contexte (main.js + renderer.js)

- main.js :
  - Collecter app/url via OS (window title + app name) au moment de stopRecording.
  - Ajouter une option pour capturer un screenshot de la fenetre active (avec consent).
  - Stocker dans history.
- renderer.js :
  - Extraire deviceId/label micro courant pour micDevice.

### 5.3 Feedback et qualite (dashboard.js)

- UI pour feedback par transcription.
- Stocker feedback dans history.
- Ajouter diff score entre raw_text et text.

### 5.4 Personnalisation

- Ajouter styleProfiles (work/personal/email) dans settings.
- selection auto par app/url.

### 5.5 Audio streaming (optionnel)

- Ajouter un AudioWorklet (renderer) pour chunker en temps reel.
- Encoder en Opus si besoin, stream via WebSocket vers un endpoint dedie.
- Garder le mode fichier (MediaRecorder) en fallback.

### 5.6 Feature flags

- Table settings ou supabase table feature_flags.
- Chargement au demarrage + cache local.
- Usage : activer pipeline, UX, pricing sans release.

### 5.7 UI multi-fenetres

- Fenetre "status" (always-on-top) pour etat + mic + langue.
- Fenetre "context menu" pour actions rapides + diff viewer.

### 5.8 Scheduler / background

- Cron local pour daily streak / wrapped / remote notifications.
- Batch upload des metrics (latence, erreurs, quality scores).

### 5.9 Onboarding robuste

- Wizard multi-etapes (permissions, mic test, shortcuts, use-cases).
- Stocker progression + replays (resume).

### 5.10 Insights / stats

- Calcul local: top apps, WPM, temps dicte, streak.
- Export/partage (Flow Wrapped light).

### 5.11 Teams / enterprise

- Mode team: invites, domain eligibility, team dictionary.
- Billing pro/enterprise + contact admin.

---

## 6) Synthese

FakeWispr montre un design "data-rich" : chaque transcription est contextualisee, mesuree, et instrumentee.
CrocoVoice a deja une architecture propre (pipeline clair, dashboard, sync, quota) mais reste minimaliste sur la richesse contextuelle et la mesure de qualite.
Le gain principal vient donc de :
- mieux capturer le contexte,
- enrichir la base locale,
- ajouter une boucle feedback,
- et progresser vers une personnalisation adaptative.
