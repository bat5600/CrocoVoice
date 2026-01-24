# Code Review Senior - CrocoVoice Electron App

**Date** : 2026-01-23
**Reviewer** : Dev Senior (Claude Opus 4.5)
**Branch** : `main-v2`
**Scope** : Full codebase review (main.js, renderer.js, preload.js, store.js, sync.js, dashboard.js/html, index.html)

---

## Table des matieres

1. [Resume executif (PM)](#1-resume-executif-pm)
2. [Architecture Overview (Architecte)](#2-architecture-overview-architecte)
3. [Securite](#3-securite)
4. [Robustesse / Bugs potentiels](#4-robustesse--bugs-potentiels)
5. [Performance](#5-performance)
6. [Maintenabilite (Dev)](#6-maintenabilite-dev)
7. [Bonnes pratiques observees](#7-bonnes-pratiques-observees)
8. [Plan de remediations priorise](#8-plan-de-remediations-priorise)

---

## 1. Resume executif (PM)

### Etat actuel

L'application est **fonctionnelle** avec un pipeline complet : enregistrement vocal -> transcription OpenAI Whisper -> post-traitement GPT -> paste dans l'application cible. L'authentification Supabase, la synchronisation cloud, le quota, et le billing Stripe sont implementes.

### Risques business

| Risque | Severite | Impact utilisateur |
|--------|----------|-------------------|
| Bug bloquant (`transitionLock`) | Critique | L'app peut se figer definitivement, necessite un restart |
| Faille XSS (labels microphones) | Haute | Un peripherique malveillant pourrait executer du code |
| Pas de tests automatises | Haute | Regressions frequentes a chaque modification |
| Performance audio transfer | Moyenne | Latence perceptible sur longs enregistrements |
| Fichier monolithique (2386 lignes) | Haute | Ralentit le developpement, bugs de merge |

### Recommandations PM

1. **Sprint securite** : Corriger les 3 failles de securite identifiees (XSS, validation IPC, token leak) avant toute nouvelle feature
2. **Dette technique** : Allouer 20-30% du prochain sprint au refactoring du `main.js` monolithique
3. **Tests** : Exiger une couverture minimale sur le pipeline critique (recording state machine, quota, sync) avant de merger de nouvelles features
4. **Monitoring** : Ajouter du error reporting (Sentry ou equivalent) - actuellement les erreurs sont uniquement en `console.error`

### Metriques de qualite

- **Fichiers source** : 6 fichiers JS core
- **Ligne la plus longue** : main.js a 2386 lignes (seuil recommande : 300-500)
- **Variables globales mutables** : 40+ (seuil recommande : 0-5)
- **Tests** : 0 (seuil recommande : 80%+ couverture sur le code critique)
- **Duplication** : 3 fonctions dupliquees entre fichiers
- **Vulnerabilites** : 3 identifiees (XSS, validation, token)

---

## 2. Architecture Overview (Architecte)

### 2.1 Architecture actuelle

```
┌─────────────────────────────────────────────────────────┐
│                    main.js (2386 lignes)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Windows  │ │Recording │ │   Auth   │ │   Quota   │  │
│  │ Mgmt     │ │ Pipeline │ │   Mgmt   │ │   Mgmt    │  │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├───────────┤  │
│  │  Tray    │ │  OpenAI  │ │  Stripe  │ │   Sync    │  │
│  │  Widget  │ │  Calls   │ │ Billing  │ │  Deferred │  │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├───────────┤  │
│  │  50+ IPC │ │Dictionary│ │  State   │ │  Debounce │  │
│  │ Handlers │ │  Apply   │ │ Machine  │ │  Timer    │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ IPC (send/invoke)
              ┌──────────┴──────────┐
              │    preload.js       │
              │  (contextBridge)    │
              └──────────┬──────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
┌────────┴────────┐            ┌─────────┴────────┐
│  renderer.js    │            │  dashboard.js    │
│  (Widget UI)    │            │  (Dashboard UI)  │
│  - MediaRecorder│            │  - Settings      │
│  - Waveform     │            │  - History       │
│  - Auth gate    │            │  - Notes         │
│  - Quota gate   │            │  - Dictionary    │
└─────────────────┘            └──────────────────┘
         │                               │
    index.html                    dashboard.html

External:
  - store.js  → SQLite (local persistence)
  - sync.js   → Supabase (cloud sync)
```

### 2.2 Probleme : Monolithe `main.js`

**Constat** : Toute la logique metier est dans un seul fichier de 2386 lignes avec 40+ variables globales mutables.

**Consequences** :
- Impossible de tester unitairement (pas d'injection de dependances)
- Race conditions entre les differents sous-systemes
- Coupling fort entre modules logiques independants
- Merge conflicts garantis en equipe

### 2.3 Architecture cible recommandee

```
src/
├── main.js                  # Bootstrap uniquement (~50 lignes)
├── windows/
│   ├── widget.js            # createMainWindow, bounds, display tracking
│   └── dashboard.js         # createDashboardWindow, window controls
├── recording/
│   ├── state-machine.js     # RecordingState, transitions, locks
│   ├── pipeline.js          # transcribe -> postProcess -> dictionary -> persist
│   └── paste.js             # clipboard, typing guard, triggerPaste
├── transcription/
│   ├── openai-client.js     # getClient, executeCall, retry, timeout
│   ├── post-process.js      # postProcessText, generateTitle
│   └── dictionary.js        # applyDictionary
├── auth/
│   ├── state.js             # authState, hydrate, broadcast
│   └── handlers.js          # sign-in, sign-out, retry
├── quota/
│   ├── local.js             # normalizeQuotaState, incrementUsage
│   ├── server.js            # getSnapshot, consumeOnServer
│   └── gate.js              # ensureAvailable, notifyBlocked
├── sync/
│   ├── orchestrator.js      # requestSync, performSync, scheduleDebouncedSync
│   └── deferred.js          # shouldDefer, pendingSync
├── subscription/
│   ├── stripe.js            # checkout, portal, buildUrl
│   └── state.js             # getSnapshot, setSubscriptionState
├── ipc/
│   ├── recording.js         # audio-data, audio-ready, cancel, toggle
│   ├── settings.js          # settings:get, settings:save
│   ├── data.js              # dashboard:data, history:*, notes:*, dictionary:*, styles:*
│   ├── auth.js              # auth:sign-in, auth:sign-out, auth:status
│   └── subscription.js      # subscription:checkout, subscription:portal
├── tray.js                  # createTray, buildMenu
├── constants.js             # Toutes les constantes partagees
└── utils.js                 # normalizeText, countWords, sleep, withTimeout
```

### 2.4 State management - Pattern recommande

Remplacer les 40+ `let` globaux par un store centralisable et observable :

```javascript
// Exemple avec EventEmitter simple (pas besoin de lib externe)
const { EventEmitter } = require('events');

class AppState extends EventEmitter {
  #state = {
    recording: { status: 'idle', startTime: null, target: 'clipboard' },
    auth: { status: 'checking', user: null, syncReady: false },
    widget: { expanded: false, undoVisible: false, errorVisible: false },
    sync: { inFlight: false, pending: null },
  };

  get(path) { /* ... */ }

  set(path, value) {
    // immutable update + emit change event
    this.emit('change', { path, value, previous: old });
  }
}
```

### 2.5 Duplication de code inter-fichiers

| Fonction | Fichiers | Solution |
|----------|----------|----------|
| `isProSubscription()` | main.js, sync.js, renderer.js | Extraire dans `constants.js` ou `subscription/state.js` |
| `countWords()` / `_countWords()` | main.js, store.js | Extraire dans `utils.js` |
| `HISTORY_RETENTION_DAYS_*` parsing | main.js, sync.js | Extraire dans `constants.js` |
| `getHistoryRetentionDays()` | main.js, sync.js | Extraire dans `subscription/state.js` |

---

## 3. Securite

### 3.1 [CRITIQUE] XSS via `innerHTML` avec donnees externes

**Fichier** : `renderer.js:188`
**Risque** : Haute
**Vecteur** : Nom de peripherique audio malveillant

```javascript
// VULNERABLE : label vient de navigator.mediaDevices
const label = mic.label || `Micro ${mic.deviceId.slice(0, 4)}...`;
button.innerHTML = `<span class="submenu-text">${label}</span>...`;
```

Un peripherique USB avec un label contenant `<img src=x onerror=alert(1)>` executera du JavaScript dans le contexte du renderer.

**Fix** :
```javascript
const textSpan = document.createElement('span');
textSpan.className = 'submenu-text';
textSpan.textContent = label;  // textContent echappe automatiquement
button.appendChild(textSpan);
```

**Autres occurrences** : lignes 161, 176, 188 de renderer.js.

### 3.2 [HAUTE] Token d'authentification dans le body des edge functions

**Fichier** : `sync.js:110`
**Risque** : Haute

```javascript
body: JSON.stringify({ ...(body || {}), token: accessToken }),
```

Le token est deja dans le header `Authorization: Bearer <token>`. L'inclure dans le body :
- Augmente la surface d'exposition (logs serveur, CDN, proxies)
- Persiste dans les logs Supabase edge functions
- Viole le principe du moindre privilege

**Fix** : Supprimer `token` du body. Si les edge functions en ont besoin, elles doivent lire le header Authorization.

### 3.3 [MOYENNE] Pas de validation des inputs IPC

**Fichier** : `main.js` (multiples handlers)

Exemples de handlers qui acceptent des donnees sans validation :

```javascript
// recording:set-target - accepte n'importe quelle string
ipcMain.handle('recording:set-target', async (event, target) => {
  recordingDestination = target || 'clipboard';  // pas de whitelist
});

// dictionary:upsert - pas de validation de from_text/to_text
ipcMain.handle('dictionary:upsert', async (event, entry) => {
  // entry.from_text pourrait etre undefined, un number, un objet...
  const record = await store.upsertDictionary({
    from_text: entry.from_text,  // non valide
    to_text: entry.to_text,      // non valide
  });
});
```

**Fix** : Ajouter une couche de validation :
```javascript
function validateTarget(target) {
  const allowed = ['clipboard', 'notes', 'notes-editor', 'onboarding'];
  return allowed.includes(target) ? target : 'clipboard';
}

function validateDictionaryEntry(entry) {
  if (!entry || typeof entry.from_text !== 'string' || !entry.from_text.trim()) {
    throw new Error('from_text est requis.');
  }
  if (typeof entry.to_text !== 'string') {
    throw new Error('to_text est requis.');
  }
  return { from_text: entry.from_text.trim(), to_text: entry.to_text };
}
```

### 3.4 [BASSE] Cleanup du fichier `.env` en memoire

Les variables d'environnement sensibles (`OPENAI_API_KEY`, `SUPABASE_ANON_KEY`) restent en memoire pendant toute la duree de vie de l'application via les constantes globales. Ce n'est pas un probleme direct mais a noter pour la conformite.

---

## 4. Robustesse / Bugs potentiels

### 4.1 [CRITIQUE] `transitionLock` sans garantie de release

**Fichier** : `main.js:1419-1435`

```javascript
async function startRecording() {
  // ...
  transitionLock = true;
  const quotaAllowed = await ensureQuotaAvailable();  // PEUT THROW
  if (!quotaAllowed) {
    transitionLock = false;
    return;
  }
  // ...
  transitionLock = false;
}
```

Si `ensureQuotaAvailable()` lance une exception non prevue (ex: erreur reseau dans le mode `server`), `transitionLock` restera `true` indefiniment. L'utilisateur ne pourra plus jamais demarrer un enregistrement sans redemarrer l'app.

**Fix** :
```javascript
async function startRecording() {
  if (transitionLock) return;
  transitionLock = true;
  try {
    const quotaAllowed = await ensureQuotaAvailable();
    if (!quotaAllowed) return;
    // ... reste de la logique
  } finally {
    transitionLock = false;
  }
}
```

### 4.2 [HAUTE] Race condition dans `pasteText`

**Fichier** : `main.js:1544-1578`

```javascript
async function pasteText(text, options = {}) {
  previousClipboard = clipboard.readText();
  pendingPasteBuffer = text;
  await new Promise((resolve) => setTimeout(resolve, 300));  // 300ms gap
  clipboard.writeText(pendingPasteBuffer);
  // ...
}
```

Problemes :
1. Si l'utilisateur copie quelque chose pendant les 300ms, son clipboard sera ecrase puis restaure avec l'ancienne valeur
2. Si un second appel a `pasteText` survient pendant le delai, `pendingPasteBuffer` sera ecrase
3. `previousClipboard` est une variable locale, mais le clipboard est global

**Fix** : Ajouter un mutex simple :
```javascript
let pasteMutex = Promise.resolve();
async function pasteText(text, options = {}) {
  pasteMutex = pasteMutex.then(() => _doPaste(text, options));
  return pasteMutex;
}
```

### 4.3 [MOYENNE] `dotenv` charge apres les imports conditionels

**Fichier** : `main.js:10-19`

```javascript
try {
  ({ getAuthConfig } = require('./config/auth-config'));  // peut lire process.env
} catch (error) { /* ... */ }
require('dotenv').config();  // charge les .env APRES
```

Si `auth-config.js` lit `process.env.AUTH_SIGNUP_URL`, la valeur sera `undefined` car dotenv n'a pas encore ete charge.

**Fix** : Deplacer `require('dotenv').config()` a la ligne 1, avant tout autre import.

### 4.4 [MOYENNE] Tray context menu statique

**Fichier** : `main.js:1338`

```javascript
tray.setContextMenu(buildMenu());  // construit une seule fois
```

Le menu affiche "Start Dictation" / "Stop Dictation" selon `isRecording`, mais cette valeur est capturee au moment de la construction du menu. Le menu ne refletera jamais l'etat reel sauf via right-click (qui reconstruit).

**Fix** : Reconstruire le menu a chaque changement d'etat :
```javascript
function refreshTrayMenu() {
  if (tray) tray.setContextMenu(buildMenu());
}
// Appeler dans setRecordingState()
```

### 4.5 [BASSE] `MediaRecorder` et `audioChunks` sur `window`

**Fichier** : `renderer.js:800-801`

```javascript
window.mediaRecorder = mediaRecorder;
window.audioChunks = [];
```

Pollue le namespace global. Tout script ou extension Chrome pourrait accidentellement interferer.

### 4.6 [BASSE] AudioContext jamais ferme

**Fichier** : `renderer.js:610-612` et `renderer.js:720`

Les `AudioContext` sont crees mais jamais `.close()`. Sur un usage prolonge (app tournant 8h+), les ressources audio systeme s'accumulent. Particulierement problematique sur Windows ou les resources audio sont limitees.

---

## 5. Performance

### 5.1 [HAUTE] Buffer audio converti en Array JSON

**Fichier** : `renderer.js:812`

```javascript
const payload = { buffer: Array.from(new Uint8Array(ab)), mimeType: blob.type };
```

Pour un enregistrement de 30 secondes en WebM/Opus (~480KB) :
- `Array.from()` cree un tableau de ~480,000 entiers JavaScript (chaque octet = 1 element)
- La serialisation IPC en JSON multiplie la taille par ~3-4x (chaque octet = 1-3 chars + virgule)
- Resultat : ~1.5MB de JSON serialise pour 480KB de donnees

**Impact** : Latence de 200-500ms supplementaires sur le pipeline de transcription.

**Fix** : Utiliser un `ArrayBuffer` directement via IPC (supporte nativement par Electron) :
```javascript
const payload = { buffer: ab, mimeType: blob.type };
// Cote main: Buffer.from(audioData.buffer) fonctionne directement
```

### 5.2 [MOYENNE] Polling display toutes les 500ms

**Fichier** : `main.js:1184-1195`

```javascript
widgetDisplayPoll = setInterval(() => {
  const display = getWidgetDisplay();
  if (widgetDisplayId !== display.id) {
    updateWidgetBounds();
  }
}, WIDGET_DISPLAY_POLL_MS);  // 500ms
```

Ce polling consomme du CPU en permanence meme quand le widget est cache.

**Fix** : Utiliser les events Electron :
```javascript
screen.on('display-added', updateWidgetBounds);
screen.on('display-removed', updateWidgetBounds);
screen.on('display-metrics-changed', updateWidgetBounds);
```

### 5.3 [MOYENNE] `saveSettings` ecrit toutes les cles

**Fichier** : `store.js:52-63`

Chaque appel a `saveSettings(nextSettings)` :
1. Merge avec les defaults (15+ cles)
2. Fait un INSERT/UPDATE pour CHAQUE cle
3. 15+ requetes SQLite pour changer 1 seule valeur

C'est appele frequemment (changement de langue, micro, style, etc.).

**Fix** : Utiliser `setSetting()` pour les modifications unitaires, reserver `saveSettings()` pour les bulk updates.

### 5.4 [BASSE] `listDictionary` appele a chaque transcription

**Fichier** : `main.js:986`

```javascript
async function applyDictionary(text) {
  const entries = await store.listDictionary();  // requete SQLite a chaque fois
  // ...
}
```

Le dictionnaire change rarement. Un cache en memoire avec invalidation sur upsert/delete serait plus efficace.

---

## 6. Maintenabilite (Dev)

### 6.1 Pas de tests automatises

**Constat** : Zero fichier de test dans le projet.

**Impact** :
- Chaque modification risque de casser le pipeline de transcription
- La state machine de recording n'est pas verifiee
- Le quota peut deriver silencieusement
- La sync peut perdre des donnees sans detection

**Priorite de couverture** :
1. State machine de recording (transitions valides/invalides)
2. Quota (increment, reset hebdomadaire, mode server/local/hybrid)
3. Dictionary application (ordre, remplacement, cas limites)
4. Sync conflict resolution (local vs remote timestamps)
5. OpenAI retry logic (backoff, max retries, timeout)

### 6.2 Pas de typage (TypeScript ou JSDoc)

Avec 40+ variables globales et des objets complexes, les bugs de type sont inevitables :

```javascript
// Quel est le shape de quota ? settings.subscription ? authState ?
// Impossible a determiner sans lire tout le code
const quota = await getQuotaSnapshot();
```

**Recommandation minimum** : Ajouter des `@typedef` JSDoc pour les structures de donnees cles :
```javascript
/**
 * @typedef {Object} QuotaSnapshot
 * @property {number|null} limit
 * @property {number} used
 * @property {number|null} remaining
 * @property {string|null} resetAt
 * @property {boolean} requiresAuth
 * @property {boolean} unlimited
 * @property {boolean} [checkFailed]
 * @property {string} [message]
 */
```

### 6.3 Melange francais/anglais

| Contexte | Langue utilisee | Recommandation |
|----------|-----------------|----------------|
| Noms de variables/fonctions | Anglais | OK - garder |
| Messages UI | Francais | OK - garder (mais externaliser dans un fichier i18n) |
| Commentaires | Mix FR/EN | Standardiser en anglais |
| Noms de commits | Mix FR/EN | Standardiser |
| Error messages (dev) | Mix | Standardiser en anglais |

### 6.4 IPC listeners sans cleanup

**Fichier** : `preload.js`

```javascript
onStartRecording: (callback) => {
  ipcRenderer.on('start-recording', callback);  // jamais de removeListener
},
```

En dev avec hot-reload, chaque reload du renderer ajoute un nouveau listener. Apres 10 reloads, le callback sera execute 10 fois.

**Fix** :
```javascript
onStartRecording: (callback) => {
  ipcRenderer.removeAllListeners('start-recording');
  ipcRenderer.on('start-recording', callback);
},
```

Ou retourner une fonction de cleanup :
```javascript
onStartRecording: (callback) => {
  ipcRenderer.on('start-recording', callback);
  return () => ipcRenderer.removeListener('start-recording', callback);
},
```

### 6.5 Console.log/warn/error comme seul monitoring

Aucun mecanisme de reporting d'erreurs en production. Si l'app crash chez un utilisateur, il n'y a aucun moyen de le savoir.

**Recommandation** : Integrer un service comme Sentry, Bugsnag, ou au minimum un fichier de log local rotatif.

### 6.6 Pas de linter/formatter configure

Pas de `.eslintrc`, `.prettierrc`, ou equivalent dans le projet. Le style est globalement coherent mais quelques inconsistances :
- Trailing commas parfois presentes, parfois non
- Espaces dans les blocs try/catch variables

---

## 7. Bonnes pratiques observees

Pour equilibrer ce review, voici les points positifs :

| Pratique | Localisation | Commentaire |
|----------|-------------|-------------|
| Context Isolation | main.js:1233-1234 | `nodeIntegration: false, contextIsolation: true` - securite Electron correcte |
| Retry avec backoff | main.js:912-932 | `executeOpenAICall` avec jitter et max retries |
| Safety monitors | renderer.js:250-278 | Duree max (1h) et idle timeout (10min) |
| Typing guard | main.js:793-821 | Verifie que la fenetre cible n'a pas change |
| Sync debouncing | main.js:572-588 | Evite de spammer Supabase (120s min) |
| Queue SQLite | store.js:409-413 | `_enqueue` empeche les race conditions DB |
| Temp file cleanup | main.js:1521-1524 | `finally` block pour supprimer le fichier audio |
| Schema migration | store.js:384-396 | Migration propre depuis JSON vers SQLite |
| Audio validation | renderer.js:301-313 | Verifie RMS, duree, activite avant envoi |
| Graceful degradation | main.js:27-40 | Fallback robotjs si nut-js indisponible |
| Deferred sync | main.js:519-525 | Ne sync pas pendant recording/processing |
| Subscription awareness | sync.js:198-213 | Retention et limites adaptees au plan |

---

## 8. Plan de remediations priorise

### Sprint 1 - Securite & Bugs bloquants (P0)

| # | Action | Fichier | Effort |
|---|--------|---------|--------|
| 1 | Fix `transitionLock` avec try/finally | main.js:1419 | XS |
| 2 | Remplacer tous les `innerHTML` par DOM API safe | renderer.js:161,176,188 | S |
| 3 | Ajouter validation whitelist sur `recording:set-target` | main.js:1826 | XS |
| 4 | Valider `from_text`/`to_text` dans `dictionary:upsert` | main.js:1923 | XS |
| 5 | Supprimer `token` du body dans `invokeFunction` | sync.js:110 | XS |
| 6 | Deplacer `require('dotenv').config()` en ligne 1 | main.js:19 | XS |

### Sprint 2 - Architecture & Maintenabilite (P1)

| # | Action | Effort |
|---|--------|--------|
| 7 | Decouper main.js en modules (voir section 2.3) | L |
| 8 | Extraire les constantes partagees dans `constants.js` | S |
| 9 | Supprimer les duplications (`isProSubscription`, `countWords`) | S |
| 10 | Ajouter tests unitaires : state machine recording | M |
| 11 | Ajouter tests unitaires : quota (local/server/hybrid) | M |
| 12 | Ajouter tests unitaires : dictionary application | S |
| 13 | Configurer ESLint + Prettier | S |

### Sprint 3 - Performance & Polish (P2)

| # | Action | Fichier | Effort |
|---|--------|---------|--------|
| 14 | Optimiser audio transfer (ArrayBuffer direct vs Array JSON) | renderer.js:812 | S |
| 15 | Remplacer polling display par screen events | main.js:1184 | S |
| 16 | Cache dictionnaire en memoire | main.js:982 | S |
| 17 | Cleanup IPC listeners dans preload | preload.js | S |
| 18 | Fermer AudioContext quand non utilise | renderer.js | S |
| 19 | Supprimer `window.mediaRecorder` / `window.audioChunks` | renderer.js:800 | XS |
| 20 | Rafraichir le tray menu sur changement d'etat | main.js:1338 | XS |

### Sprint 4 - Long terme (P3)

| # | Action | Effort |
|---|--------|--------|
| 21 | Migration TypeScript (ou JSDoc complet) | XL |
| 22 | Integration error reporting (Sentry) | M |
| 23 | Externaliser les messages UI (fichier i18n) | M |
| 24 | Ajouter mutex sur `pasteText` | S |
| 25 | Ajouter integration tests (Spectron/Playwright) | L |

---

## Legende efforts

- **XS** : < 30 min
- **S** : 1-2h
- **M** : demi-journee
- **L** : 1-2 jours
- **XL** : 1 semaine+

---

## Annexe : Fichiers concernes

| Fichier | Lignes | Role | Problemes |
|---------|--------|------|-----------|
| `main.js` | 2386 | Main process (TOUT) | Monolithique, 40+ globals, bugs |
| `renderer.js` | ~1419 | Widget UI + audio | XSS, perf audio, memory leaks |
| `preload.js` | 146 | Context bridge | Pas de cleanup listeners |
| `store.js` | 453 | SQLite persistence | Perf saveSettings, duplication countWords |
| `sync.js` | 476 | Supabase sync | Token dans body, duplication constantes |
| `dashboard.js` | ~800 | Dashboard UI | Non review en detail |
| `index.html` | ~400 | Widget HTML | Non review en detail |
| `dashboard.html` | ~600 | Dashboard HTML | Non review en detail |
