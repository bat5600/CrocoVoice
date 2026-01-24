# CROCOVICE - OS VOCAL IA COMPLET
## PRD Ultra-Détaillé | Janvier 2026

**Document de référence pour la développement intégrale du produit**

---

## TABLE DES MATIÈRES

1. [Vision & Stratégie](#vision--stratégie)
2. [Analyse Concurrentielle](#analyse-concurrentielle)
3. [Architecture Globale](#architecture-globale)
4. [Modules & Features Détaillées](#modules--features-détaillées)
5. [Priorités d'Implémentation](#priorités-dimlémentation)
6. [Spécifications Techniques](#spécifications-techniques)
7. [Intégrations Requises](#intégrations-requises)
8. [UX/UI Framework](#uxui-framework)
9. [Modèle de Donnés](#modèle-de-données)
10. [Plan de Développement](#plan-de-développement)
11. [Critères de Succès](#critères-de-succès)
12. [Review Critique & Points d'Attention](#review-critique--points-d'attention)

---

# VISION & STRATÉGIE

## Positionnement Produit

**CrocoVoice devient le "système d'exploitation vocal IA" universel qui remplace:**
- ✅ Couche transcription (Otter, TurboScribe, Maestra)
- ✅ Couche meeting (Fireflies, Otter for Meetings)
- ✅ Couche dictée universelle (Wispr Flow)
- ✅ Couche commands système vocales (Siri, Alexa partiellement)
- ✅ Couche génération contenu IA (ChatGPT pour prompts vocaux)
- ✅ Couche snippets/raccourcis (TextExpander + voice shortcuts)
- ✅ Couche capture notes initiale (Notion capture, OneNote voice capture)

## Objectif Principal

**Un seul hotkey, une seule app, zero context-switching:**
- L'utilisateur parle → CrocoVoice capture → Traite → Exécute action
- Texte envoyé aux bonnes apps (Slack, Gmail, etc.)
- Meetings enregistrés & résumés automatiquement
- AI suggestions intégrées nativement (pas besoin d'ouvrir ChatGPT)
- Snippets/templates rappelés vocalement et insérés

## Target User Personas

1. **SaaS Founder/CTO** (type: toi)
   - Multitâche constant (code, mails, slack, réunions)
   - Besoin de fluidité totale, zéro friction
   - Accepte technologie complexe si productivity gain > 2x

2. **Remote Worker/Sales**
   - Calls + notes + follow-ups en continu
   - Friction avec "copy-paste transcript → Slack → Notion"
   - Veut meeting summary auto + action items

3. **Creator/Writer**
   - Rédige vite par dictée (code, articles, posts)
   - Besoin corrections IA + formatting auto
   - Utilise multi apps (Claude, Cursor, Notion)

---

# ANALYSE CONCURRENTIELLE

## Landscape Actuel (Q1 2026)

| Tool | Scope | Limitation | Margin |
|------|-------|-----------|--------|
| **Wispr Flow** | Dictée universelle | Single purpose, pas de meeting, pas d'AI actions | 50% revenue/user |
| **Fireflies** | Meetings + Transcription | Pas de dictée interactive, pas de système universal | 40% (enterprise focus) |
| **Otter.ai** | Transcription + meeting | UI heavy, pas de voice shortcuts globales | 35% (crowded market) |
| **Siri/Google Assistant** | Voice control système | Limité, pas de formatting texte, pas d'AI sophistiqué | 0% (OS-level) |

## CrocoVoice Advantage (Unique Selling Proposition)

```
┌─────────────────────────────────────────────────────────────────┐
│  UNIFIED VOICE EXPERIENCE (CrocoVoice)                          │
│─────────────────────────────────────────────────────────────────│
│                                                                 │
│  Feature               CrocoVoice  Wispr  Fireflies  Otter  AI │
│  ──────────────────────────────────────────────────────────── │
│  Dictée universelle      ✅✅     ✅      ❌       ❌     ❌   │
│  Meeting assistant       ✅✅     ❌      ✅✅      ✅     ❌   │
│  Voice transcription     ✅✅     ✅      ✅✅      ✅✅    ❌   │
│  AI content gen (voice)  ✅✅     ❌      ❌       ❌     ✅   │
│  Voice shortcuts         ✅✅     ✅      ❌       ❌     ❌   │
│  Speaker labels          ✅✅     ❌      ✅✅      ✅✅    ❌   │
│  Summary + action items  ✅✅     ❌      ✅✅      ✅     ❌   │
│  Real-time editing       ✅✅     ✅      ❌       ❌     ❌   │
│  Knowledge base search   ✅✅     ❌      ❌       ❌     ❌   │
│  Custom NLP rules        ✅✅     ❌      ✅       ❌     ❌   │
│  Native app integrations ✅✅     ✅      ✅       ✅     ❌   │
│  Offline capability      ✅       ✅      ❌       ❌     ❌   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Market Gap Identifié

**Personne n'offre:**
1. Voice-to-action unifiée (dictée + meetings + commands + AI tout en un)
2. AI sophistiqué intégré (pas juste transcription, vraie compréhension)
3. Cross-app orchestration (Slack + Email + Notion + IDE tout en même temps)
4. Voice snippets + learning (la app apprend tes patterns vocaux)

---

# ARCHITECTURE GLOBALE

## System Overview (Macro)

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CROCOVICE UNIFIED STACK                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    USER INPUT LAYER                          │  │
│  │  - Hotkey activation (global shortcuts)                      │  │
│  │  - Voice capture (microphone)                                │  │
│  │  - Context detection (which app is focused?)                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               AUDIO PROCESSING LAYER                         │  │
│  │  - STT (Speech-to-Text) - Local + Cloud                      │  │
│  │  - Audio normalization                                       │  │
│  │  - Speaker detection (single vs multi-speaker)               │  │
│  │  - Format inference (meeting vs dictation vs command)        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │            TEXT PROCESSING & AI LAYER                        │  │
│  │  - ASR post-processing (punctuation, capitalization)         │  │
│  │  - NLP analysis (intent detection, entity extraction)        │  │
│  │  - Grammar/style correction (via Claude/GPT)                 │  │
│  │  - Snippet matching (voice cues)                             │  │
│  │  - Meeting summarization + action items                      │  │
│  │  - Knowledge base search & retrieval                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              ACTION ORCHESTRATION LAYER                      │  │
│  │  - Routing logic (où envoyer le texte?)                      │  │
│  │  - App-specific formatting                                   │  │
│  │  - API integrations (Slack, Gmail, Notion, etc.)             │  │
│  │  - Webhook triggers (ClickUp, Jira, etc.)                    │  │
│  │  - Local execution (Applescript, CLI commands)               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              OUTPUT & PERSISTENCE LAYER                      │  │
│  │  - Direct clipboard paste                                    │  │
│  │  - Native app integration (simulate keyboard input)          │  │
│  │  - Cloud backup (transcripts, meetings, snippets)            │  │
│  │  - Local database (SQLite for offline)                       │  │
│  │  - Version history + recovery                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Tech Stack Recommandé

### Core Frontend
- **Electron** (cross-platform desktop app - macOS/Windows/Linux)
- **React** + TypeScript (UI composants)
- **Tauri** (alternative légère si performance critique - mais Electron plus mature)
- **Shadcn/ui** (design system)

### Backend/Services
- **Node.js + Express** (API backend)
- **Python** (AI/ML processing, local models)
- **WebSocket** (real-time meeting transcription)
- **Redis** (queue pour async tasks, caching)
- **PostgreSQL** (primary DB - user data, transcripts)
- **SQLite** (local offline DB)

### AI/ML
- **Whisper** (STT - OpenAI, en local possible)
- **Claude API** (text processing, summaries, intent detection)
- **GPT-4 Turbo** (fallback pour certain tasks)
- **Llama 2/Mistral** (local models - privacy-first option)
- **LangChain** (orchestration LLM)

### Services Externes
- **Deepgram** ou **Assembly AI** (STT en temps réel - backup Whisper)
- **Rev.com** ou **Otter API** (archive transcription si volume élevé)
- **Slack API** + **Gmail API** + **Notion API** (integrations)
- **Stripe** (payments pour premium)

### Infrastructure
- **AWS** ou **Google Cloud** (backend, storage)
- **S3** (file storage - recordings, exports)
- **CloudFlare** (CDN, DDoS protection)

---

# MODULES & FEATURES DÉTAILLÉES

## M1. TRANSCRIPTION CLASSIQUE (Remplace Otter, TurboScribe, Maestra)

### 1.1 Upload & Processing

**Features:**
- Upload audio/vidéo (MP3, WAV, M4A, MP4, MOV, etc.)
- Drag & drop interface
- Batch upload (traiter 10+ fichiers simultanément)
- Progress tracking + ETA
- Pause/resume support

**Spécifications:**
```
Max file size: 2 GB
Supported formats: MP3, WAV, M4A, MP4, MOV, WebM, FLAC
Processing latency: 1:1 real-time (1 heure audio = 1 heure processing)
Language detection: Auto + manual override
Speaker count detection: Auto (2-10 speakers)
```

**API Endpoint:**
```
POST /api/transcription/upload
- file: Binary (multipart/form-data)
- language: string (auto-detect default)
- speaker_count: number (optional)
- title: string
- description: string

Response:
{
  "transcript_id": "uuid",
  "status": "processing",
  "created_at": "2026-01-20T12:09:00Z",
  "estimated_completion": "2026-01-20T13:20:00Z"
}
```

### 1.2 Real-time Transcription

**Features:**
- Live mic input transcription
- Stream audio from URL
- Desktop screen audio capture (for tutorials/demos)
- Interim results (show text as speaking)
- Final results + corrections

**Tech:**
- WebSocket pour streaming (latency < 500ms)
- Whisper API ou Deepgram pour real-time
- Fallback: local Whisper si cloud fails

### 1.3 Transcript Export

**Formats:**
```
- Markdown (.md) - with timestamps
- PDF (avec timestamps, speaker labels)
- SRT (subtitle file)
- VTT (video subtitle)
- JSON (structured format avec speaker data)
- DOCX (Word format)
- TXT (plain text)
```

**Features:**
- Export par section (30 sec - 5 min chunks)
- Custom timestamp format (mm:ss vs [hh:mm:ss])
- Speaker label export (Speaker 1, Speaker 2, ou names si détectés)
- Download + email délivery

### 1.4 Post-Processing & Correction

**Features:**
- Filler word removal ("um", "uh", "like", "you know")
- Automatic punctuation (Whisper le fait déjà)
- Speaker label refinement (manual correction UI)
- Confidence scoring (highlight low-confidence words)
- Manual edit interface (click word → replace)
- Search/replace regex support

---

## M2. MEETING ASSISTANT (Remplace Fireflies, Otter for Meetings)

### 2.1 Meeting Recording & Transcription

**Features:**
- **Auto-join meetings** (Zoom, Google Meet, Teams, Slack Huddles)
- **Manual recording** (click record button in UI)
- **Real-time transcription** (show live captions)
- **Speaker identification** (who is talking? when?)
- **Emotion/sentiment detection** (frustrated tone detection)

**Integrations:**
```
- Zoom: OAuth + webhook (auto-join meeting rooms)
- Google Meet: Sign in → detect active meet tab
- Microsoft Teams: OAuth integration
- Slack: Huddles detection + recording
- Generic: HTTP server listening for WebRTC offers
```

**Implementation:**
```javascript
// Electron main process - hook Zoom app
const { ipcMain } = require('electron');

ipcMain.on('zoom-meeting-detected', async (event, meeting_info) => {
  const meeting_id = meeting_info.id;
  const participants = meeting_info.participants;
  
  // Start recording
  const recorder = new MeetingRecorder(meeting_id);
  const stream = await recorder.startRecording();
  
  // Stream to transcription service
  transcriptionService.stream(stream, {
    meeting_id,
    participants,
    realtime: true
  });
});
```

### 2.2 Real-Time Speaker Detection

**How it works:**
1. Audio stream analyzed with voice ID model
2. Speaker 1, Speaker 2... labeled based on voice characteristics
3. Optional: Manual name mapping (override "Speaker 1" → "John")
4. Transcript shows:
```
[Speaker 1] The roadmap for Q1 includes...
[Speaker 2] I think we should focus on...
[Speaker 1] That's a great point about...
```

**Tech:**
- **Deepgram Speaker Labels** (part of their API)
- **Pyannote** (open-source, local speaker diarization)
- Or custom fine-tuned model + embeddings

### 2.3 Meeting Summary & Action Items

**Auto-generated:**
```
MEETING: Product Planning Q1
DATE: 2026-01-20
DURATION: 1h 23min
ATTENDEES: John (Product), Sarah (Eng), Mike (Design)

📋 SUMMARY:
- Discussed Q1 roadmap focusing on voice features
- Agreed to prioritize user feedback integration
- Timeline: MVP in 6 weeks
- Budget: $50k allocated

✅ ACTION ITEMS:
- Sarah: Create technical spec for voice intent detection (due: 2026-01-27)
- Mike: Design UI mockups for settings page (due: 2026-01-24)
- John: Schedule customer feedback calls (due: 2026-01-23)

🔑 KEY TOPICS:
- Voice recognition improvements
- User onboarding flow
- Competitor analysis (Wispr Flow, Fireflies)

⚠️ DECISIONS:
- Use Claude for intent detection (vs custom model)
- Start with macOS only, add Windows later
- Premium tier at $29/month
```

**How it's generated:**
1. Full transcript passed to Claude with prompt:
```
Extract from this meeting transcript:
1. Main topics discussed (max 5)
2. Action items with owners and dates
3. Decisions made
4. Risk/blockers mentioned
5. Next meeting date if mentioned

Format as structured JSON.
```

2. LLM response parsed + formatted
3. User can edit/customize in UI

### 2.4 Meeting Search & Retrieval

**Features:**
- Search by keyword ("what did we discuss about pricing?")
- Search by speaker ("what did John say?")
- Search by date range
- Search by meeting type (all product meetings, all sales calls)
- Transcript sections returned with timestamps

**Implementation:**
- Full-text search in PostgreSQL
- Vector embeddings for semantic search (using OpenAI embeddings)
- Quick search (< 500ms response time)

---

## M3. DICTÉE UNIVERSELLE (Remplace Wispr Flow)

### 3.1 Global Hotkey Voice Capture

**Hotkeys:**
```
macOS:
- Cmd+Shift+Space: Quick dictate (insert immediately)
- Cmd+Shift+D: Full dictate mode (editor window)

Windows:
- Ctrl+Shift+Space: Quick dictate
- Ctrl+Shift+D: Full dictate mode

Linux:
- Super+Shift+Space: Quick dictate
- Super+Shift+D: Full dictate mode
```

**Behavior:**
```
Quick Dictate (Cmd+Shift+Space):
1. User presses hotkey
2. Listening indicator appears (small popup)
3. User speaks
4. Text processed in background
5. Result inserted at cursor position
6. Return to previous app

Full Dictate Mode (Cmd+Shift+D):
1. User presses hotkey
2. Full editor window opens
3. Show real-time transcription
4. Show AI suggestions (grammar, clarity)
5. User can edit in-editor
6. Click "Send" or "Copy" button
```

### 3.2 App-Context Awareness

**CrocoVoice détecte l'app en focus et adapte:**

```
┌─────────────────────────────────────────────────────────────┐
│ Context: Slack focused                                      │
│─────────────────────────────────────────────────────────────│
│ User speaks: "hey team let's ship it"                      │
│                                                             │
│ CrocoVoice:                                                 │
│ 1. Detects Slack context                                   │
│ 2. Text processed → "Hey team, let's ship it"              │
│ 3. Formatting: lowercase with natural punctuation          │
│ 4. Inserts into Slack message input                        │
│ 5. Ready to send (Cmd+Enter)                              │
│                                                             │
│ Output: "Hey team, let's ship it"                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Context: Email composer (Gmail)                             │
│─────────────────────────────────────────────────────────────│
│ User speaks: "hello john i wanted to follow up on          │
│              the proposal we discussed"                     │
│                                                             │
│ CrocoVoice:                                                 │
│ 1. Detects email context                                   │
│ 2. Text processed → full sentence                          │
│ 3. Formatting: formal, capitalized sentences               │
│ 4. Paragraph breaks inferred                               │
│ 5. Inserts into email body                                 │
│                                                             │
│ Output: "Hello John, I wanted to follow up on the          │
│          proposal we discussed."                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Context: VS Code focused                                    │
│─────────────────────────────────────────────────────────────│
│ User speaks: "create a function that validates email"      │
│                                                             │
│ CrocoVoice:                                                 │
│ 1. Detects code editor context                             │
│ 2. NLP detects intent: "create function"                   │
│ 3. Could:                                                   │
│    a) Insert function skeleton                             │
│    b) Generate with Claude                                 │
│ 4. Inserts code (with formatting)                          │
│                                                             │
│ Output: function validateEmail(email) {                    │
│           return /^[^@]+@[^@]+\.[^@]+$/.test(email);       │
│         }                                                   │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**
```javascript
// Get active app context
const activeApp = systemInfo.getActiveApp(); // "Slack", "Gmail", "VSCode"
const appContext = contextMap[activeApp];

// Process text based on context
const processed = await processText(rawText, {
  context: appContext,
  rules: appContext.formatting_rules,
  templates: appContext.templates
});

// Insert into app
switch(appContext.input_method) {
  case 'clipboard':
    clipboard.writeText(processed);
    keyboard.simulateKeystroke('Cmd+V');
    break;
  case 'direct_input':
    keyboard.typeText(processed);
    break;
  case 'api':
    await integrationsService.send(activeApp, processed);
    break;
}
```

### 3.3 Real-Time Editing UI

**Full Dictate Mode Window:**
```
┌─────────────────────────────────────────────────────────────┐
│  CrocoVoice - Dictation Editor      [−] [□] [×]           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [🎤] Listening... (3.2 seconds recorded)                  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ This is my first draft of the proposal document      │ │
│  │ that I think we should share with the client         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ⚠️ Suggestion: Add period at end                          │
│  💡 Rephrase: "This is my initial proposal draft..."      │
│  ✨ AI Polish: Enhance this for professional tone         │
│                                                             │
│  [Copy] [Send to Slack] [Send to Email] [Insert]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Editing features:**
- Click word to replace
- Drag select to rephrase (inline UI)
- Voice commands: "capitalize next word", "delete last sentence"
- Keyboard shortcuts: Cmd+Z to undo last dictation

---

## M4. ASSISTANT UNIVERSEL & COMMANDES SYSTÈME

### 4.1 Voice Commands (Intent Detection)

**Supported commands:**
```
SYSTEM COMMANDS:
- "Open Slack" → launches Slack app
- "Take a screenshot" → capture screen
- "Set timer for 5 minutes" → system timer
- "Show clipboard history" → open clipboard manager
- "Open settings" → open CrocoVoice settings

APP COMMANDS:
- "Send this to Slack #general" → target Slack channel
- "Add task to ClickUp" → open ClickUp creation
- "Create Notion page" → new Notion page
- "Schedule email" → Gmail scheduler
- "Call John on Zoom" → initiate Zoom call

WORKFLOW COMMANDS:
- "Create meeting summary" → auto-process last meeting
- "Generate email from last meeting" → AI email draft
- "Export transcript" → download meeting notes
- "Find all action items" → list tasks from meetings
```

**How it works:**
1. User voice → transcribed to text
2. Intent detection (using Claude or local classifier):
   ```
   Input: "Open Slack"
   Detected Intent: SYSTEM_COMMAND
   Action: OPEN_APP
   Parameters: {app: "Slack"}
   
   Input: "Send this to Slack #general"
   Detected Intent: INTEGRATION_COMMAND
   Action: SEND_TO_APP
   Parameters: {app: "Slack", channel: "general", content: "this"}
   ```
3. Execute action directly (no UI needed)

### 4.2 Smart Context Understanding

**CrocoVoice learns user patterns:**
```
User says: "Log this"
CrocoVoice: "Log where? Notion (60%), Email (25%), Slack (15%)"
User clicks Notion → remembers for next time
Next time: Directly logs to Notion without asking
```

**Personal AI model training:**
- Track user's most used apps/actions
- Build probabilistic model
- High confidence (>80%) → execute directly
- Lower confidence → ask for confirmation

---

## M5. GÉNÉRATION CONTENU IA (Remplace ChatGPT, Claude, Copilot)

### 5.1 Voice-Activated AI Generation

**Types de génération:**
```
EMAIL GENERATION:
User speaks: "Write an email to Sarah about Q1 budget approval"
CrocoVoice:
1. Detects intent: email generation
2. Extracts entities: recipient (Sarah), topic (Q1 budget approval)
3. Calls Claude with context
4. Generates professional email draft
5. Shows in editor for review/edit
6. Send or copy

CODE GENERATION:
User speaks: "Write a function to validate email addresses in TypeScript"
CrocoVoice:
1. Detects intent: code generation
2. Language: TypeScript (inferred from context)
3. Calls Claude with full context
4. Generates function with JSDoc
5. Inserts into VS Code
6. Ready to use

SOCIAL POST GENERATION:
User speaks: "Create a LinkedIn post about CrocoVoice launch"
CrocoVoice:
1. Detects intent: social media content
2. Platform: LinkedIn (inferred)
3. Calls Claude with brand voice template
4. Generates 3 options
5. User selects best
6. Copy to clipboard

MEETING SUMMARY GENERATION:
User speaks: "Summarize that last meeting in an email format"
CrocoVoice:
1. Retrieves last meeting transcript
2. Generates email with summary + action items
3. Shows in editor
4. Send to attendees or copy
```

### 5.2 AI Prompt Templates & Custom Prompts

**Built-in templates:**
```json
{
  "templates": [
    {
      "id": "email_formal",
      "name": "Formal Email",
      "prompt": "Write a professional email that [USER_INPUT]. Tone: formal, clear, concise.",
      "voice_cue": "formal email"
    },
    {
      "id": "email_casual",
      "name": "Casual Email",
      "prompt": "Write a casual but professional email that [USER_INPUT]. Tone: friendly, approachable.",
      "voice_cue": "casual email"
    },
    {
      "id": "code_function",
      "name": "Code Function",
      "prompt": "Write a [LANGUAGE] function that [USER_INPUT]. Include JSDoc comments.",
      "voice_cue": "create function"
    },
    {
      "id": "linkedin_post",
      "name": "LinkedIn Post",
      "prompt": "Write a LinkedIn post about [USER_INPUT]. Tone: professional, engaging, authentic.",
      "voice_cue": "linkedin post"
    }
  ]
}
```

**Voice shortcuts:**
- User speaks: "Formal email about..."
- Matched to "email_formal" template
- Input extracted: "about..."
- Generation starts immediately

### 5.3 AI Writing Assistant (Real-Time)

**As user dictates:**
```
User speaks: "The project has been delayed by two weeks because of"
CrocoVoice shows:
- ✅ Grammar: correct
- 💡 Clarity: could be "The project is two weeks behind schedule"
- 🎯 Tone: passive (consider active voice)
- ✨ Expand: "...because of resource constraints, scope creep"
```

**Real-time suggestions:**
- Grammar corrections (shown, not forced)
- Style improvements (passive → active, verbose → concise)
- Tone matching (formal vs casual based on context)
- Completion suggestions (predict what user wants to say)

---

## M6. VOICE SHORTCUTS & SNIPPETS

### 6.1 Snippet Library

**Types de snippets:**
```
TEXT SNIPPETS:
- "Best regards, Tom" (voice cue: "signature")
- "Let me know if you have questions!" (voice cue: "closing")
- "https://calendly.com/tom/30min" (voice cue: "my calendar")

CODE SNIPPETS:
- TypeScript function skeleton
- React component template
- Database query pattern

MEETING SNIPPETS:
- "Let's take this offline" (voice cue: "offline")
- "Can everyone see my screen?" (voice cue: "screen share")
- "Let's go to action items" (voice cue: "next")
```

**Voice activation:**
```
User speaks: "Let me know"
CrocoVoice shows matches:
1. "Let me know if you have questions!" (snippet_closing)
2. "Let me know your thoughts" (snippet_feedback)
User either:
- Confirms selection (Cmd+1, Cmd+2)
- Continues speaking to override
Result: Full snippet inserted OR text continues
```

### 6.2 Learning & Auto-Complete

**CrocoVoice learns patterns:**
```
User frequently:
1. Says "best regards tom" → learns as snippet
2. Says "for more info visit calendly" → learns pattern
3. Uses same closing phrases → suggests creation

After 10 times:
User: "best regards"
CrocoVoice: Auto-completes with ", tom"
User: Confirms (Cmd+Space) or continues speaking
```

**Management UI:**
- Edit snippets (rename, change voice cue, update text)
- Import/export (JSON format)
- Share with team (enterprise feature)

---

## M7. PRISE DE NOTES & KNOWLEDGE BASE

### 7.1 Auto-Capture to Notion/OneNote

**Workflow:**
```
1. User dictates: "Note: Remember to follow up with John about the proposal"
2. CrocoVoice detects "Note:" prefix
3. Sends to configured note app (Notion, OneNote, Obsidian)
4. Auto-tagging:
   - Topic: "follow-up"
   - Person: "John"
   - Context: "proposal"
5. Stored in database (searchable)
```

**Integrations:**
```
NOTION:
- Create page in specified database
- Auto-populate fields (title, date, tags, content)
- Support for database relations (link to CRM, project)

ONENOTE:
- Create section based on date/topic
- Auto-format with timestamps
- Sync with Teams/Office

OBSIDIAN:
- Create note with YAML front matter
- Auto-link to existing notes (backlinks)
- Support for tags, properties

EVERNOTE:
- Create note with tags
- Add to specified notebook
- Image/voice note support (if available)
```

**API Implementation:**
```javascript
async function captureNote(content, metadata) {
  const target = user.preferences.note_app; // "notion", "onenote", etc
  
  const structured = {
    title: generateTitleFromContent(content),
    content: content,
    tags: extractTags(content),
    date: new Date(),
    source: "voice_capture",
    meeting_id: metadata.meeting_id || null
  };
  
  switch(target) {
    case 'notion':
      return notionService.createPage(structured);
    case 'onenote':
      return oneNoteService.createNote(structured);
    case 'obsidian':
      return obsidianService.createNote(structured);
  }
}
```

### 7.2 Knowledge Base Search via Voice

**Feature:**
```
User: "Find notes about pricing strategy"
CrocoVoice:
1. Searches all notes + transcripts
2. Returns top results:
   - 2026-01-15 meeting: "Pricing Strategy Q1"
   - 2025-12-20 note: "Competitor pricing analysis"
   - 2025-11-30 note: "Our pricing model"
3. User clicks to view full content
4. Can ask follow-up: "What was decided about margins?"
```

**Search features:**
- Full-text search (words)
- Semantic search (meaning) via embeddings
- Filter by date, tag, source
- Voice query support
- Results ranked by relevance

---

## M8. SYSTÈME DE ROUTAGE & INTEGRATIONS

### 8.1 Multi-App Output Routing

**CrocoVoice intelligently routes dictation:**

```
┌─────────────────────────────────────────────────┐
│ User speaks: "Send an update to the team"      │
│                                                 │
│ CrocoVoice analyzes:                            │
│ - Focused app: Google Meet (video call active) │
│ - Recent apps: Slack, Email                    │
│ - User's frequency: Slack 70%, Email 20%       │
│                                                 │
│ Decision tree:                                  │
│ if (in_meeting) → Ask: Slack/Email/Chat?      │
│ else if (slack_open) → Send to Slack          │
│ else → Ask destination                         │
│                                                 │
│ User has 3 options:                             │
│ 1. Send to Slack                               │
│ 2. Send to Email                               │
│ 3. Keep in editor (review first)               │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Routing rules (editable by user):**
```json
{
  "routing_rules": [
    {
      "trigger": "keyword:urgent",
      "target": "email",
      "priority": 10
    },
    {
      "trigger": "app:Slack",
      "target": "slack",
      "priority": 5
    },
    {
      "trigger": "context:code",
      "target": "editor",
      "priority": 8
    },
    {
      "trigger": "time:after_hours",
      "target": "schedule_email",
      "priority": 9
    }
  ]
}
```

### 8.2 Native App Integrations (High Priority)

**SLACK:**
```
POST /api/integrations/slack/send
{
  "channel": "general" or "@user",
  "message": "text content",
  "thread_ts": "timestamp (optional - reply in thread)",
  "blocks": [blocks array for rich formatting]
}

✅ Features:
- Direct message + channel support
- Emoji reactions
- Thread replies
- Scheduled messages
- Rich formatting (bold, code, links)
```

**GMAIL:**
```
POST /api/integrations/gmail/send
{
  "to": "email@example.com",
  "cc": ["email2@example.com"],
  "subject": "auto-generated or user input",
  "body": "text content",
  "draft": true/false (true = save as draft)
}

✅ Features:
- Draft mode (review before send)
- Schedule send
- Template variables
- Auto-signature
- Attachment support
```

**NOTION:**
```
POST /api/integrations/notion/create-page
{
  "database_id": "notion_db_uuid",
  "title": "Page title",
  "content": "markdown or blocks",
  "tags": ["tag1", "tag2"],
  "properties": {
    "Status": "In Progress",
    "Owner": "John"
  }
}

✅ Features:
- Multiple database support
- Property mapping
- Relation/lookup fields
- Database template support
```

**VS CODE / CURSOR:**
```
Protocol: Custom IPC or HTTP
POST /api/integrations/editor/insert-code
{
  "code": "function code here",
  "language": "typescript",
  "file": "path/to/file.ts"
}

✅ Features:
- Code insertion with formatting
- Comment generation
- File creation
- Snippet expansion
```

**ZOOM / GOOGLE MEET:**
```
Protocol: WebRTC + API
✅ Features:
- Auto-record meetings
- Real-time transcription
- Speaker identification
- Meeting metadata (duration, participants)
```

**CLICKUP / JIRA / ASANA:**
```
POST /api/integrations/project-mgmt/create-task
{
  "title": "Task from voice",
  "description": "Action item from meeting",
  "assignee": "user_id",
  "due_date": "2026-01-27",
  "list_id": "project_id"
}

✅ Features:
- Task creation from action items
- Auto-populate from meeting summary
- Link to meeting transcript
- Priority/tag assignment
```

### 8.3 Webhook System (Custom Integrations)

**For tools not directly supported:**
```
User can create custom webhooks:

Trigger: "When dictation ends with '#slack'"
Action: POST to custom URL
{
  "event": "dictation_complete",
  "text": "content",
  "app_context": "slack",
  "timestamp": "2026-01-20T12:09:00Z"
}

Example: Send to Zapier → route to any tool
Example: Send to Make.com → complex automation
Example: Send to n8n → self-hosted automation
```

---

## M9. SETTINGS & PERSONALIZATION

### 9.1 Voice Model Selection

**Options:**
```
STT (Speech-to-Text):
1. Whisper (OpenAI) - Free, accurate, 25 languages
2. Deepgram - Faster, real-time capability
3. Assembly AI - Custom vocabulary support
4. Local Whisper - On-device, privacy-first (slower)

LLM (Text Processing):
1. Claude 3.5 Sonnet - Best quality, default
2. GPT-4 Turbo - Alternative, similar cost
3. Mistral/Llama - Local models, free but slower
4. Hybrid: Use Claude for important, Mistral for quick

Speaker Detection:
1. Deepgram speaker labels (built-in)
2. Pyannote (open-source, local)
3. Combination of both (higher accuracy)
```

**Config file:**
```json
{
  "voice_settings": {
    "stt_provider": "whisper",
    "stt_language": "en",
    "llm_provider": "claude",
    "speaker_detection": "deepgram",
    "offline_mode": false,
    "audio_quality": "high" (or "balanced", "low")
  }
}
```

### 9.2 Integration Configuration

**Each integration needs:**
- API key/OAuth token
- Default settings (which Slack channel? which Notion database?)
- Activation toggle
- Custom routing rules

**UI:**
```
┌────────────────────────────────────────┐
│ Integrations Settings                  │
├────────────────────────────────────────┤
│                                        │
│ ✅ Slack                               │
│    Workspace: CrocoClick               │
│    Default channel: #product           │
│    [Configure] [Disconnect]            │
│                                        │
│ ✅ Gmail                               │
│    Account: tom@crocovice.ai           │
│    Auto-signature: Yes                 │
│    [Configure] [Disconnect]            │
│                                        │
│ ✅ Notion                              │
│    Default DB: Product Updates         │
│    Auto-tags: #voice-capture           │
│    [Configure] [Disconnect]            │
│                                        │
│ ⭕ ClickUp                             │
│    [Connect]                           │
│                                        │
└────────────────────────────────────────┘
```

### 9.3 Advanced Settings

```
PRIVACY:
- Data storage location (local vs cloud)
- Auto-deletion policy (delete transcripts after X days)
- Encryption mode (end-to-end available?)
- Recording consent (notify when recording starts)

PERFORMANCE:
- Quality vs speed tradeoff
- GPU acceleration (if available)
- Background processing threads
- Network bandwidth limits

ACCESSIBILITY:
- Font size / zoom level
- High contrast mode
- Screen reader support
- Keyboard-only mode

NOTIFICATIONS:
- Show transcription progress
- Notify on errors
- Summary export notifications
- Meeting recordings ready
```

---

## M10. ANALYTICS & INSIGHTS

### 10.1 User Behavior Tracking

**Track metrics:**
```
- Dictations per day/week/month
- Average dictation length
- Most used apps (Slack 40%, Email 30%, Code 20%, Notes 10%)
- Most used voice commands
- Error rates (transcription, routing)
- Time saved vs manual typing (estimated)
```

**Dashboard:**
```
┌─────────────────────────────────────────┐
│ Usage Analytics                         │
├─────────────────────────────────────────┤
│                                         │
│ Total Dictations: 2,341 (this month)    │
│ Average Length: 45 seconds              │
│ Time Saved: ~24 hours/month             │
│                                         │
│ Top Apps:                               │
│ 1. Slack: 45% 
│ 2. Gmail: 25%
│ 3. VS Code: 20%
│ 4. Notion: 10%
│                                         │
│ Accuracy: 94.2% (avg transcription)     │
│ Error Rate: 0.8% (routing errors)       │
│                                         │
└─────────────────────────────────────────┘
```

### 10.2 Export & Reports

**Options:**
- Monthly productivity report (email)
- Meeting summary exports (PDF, Markdown)
- Transcript archive (searchable, downloadable)

---

# PRIORITÉS D'IMPLÉMENTATION

## Phase 1: MVP (8 semaines)
**Budget:** Complètement tes fonctionnalités core, minimal dependencies

### Week 1-2: Foundation
- [ ] Hotkey system (global shortcuts)
- [ ] Electron app shell (macOS + Windows)
- [ ] Audio input capture + storage
- [ ] Basic Whisper integration
- [ ] Settings UI skeleton

### Week 3-4: Transcription Core
- [ ] Upload & batch processing
- [ ] Real-time transcription (initial)
- [ ] Post-processing (punctuation, filler words)
- [ ] Export formats (TXT, MD, PDF)
- [ ] Basic search

### Week 5-6: Dictation & Routing
- [ ] Quick dictate mode (hotkey insert)
- [ ] Full dictate UI (editor window)
- [ ] App context detection
- [ ] Slack integration (MVP)
- [ ] Gmail integration (MVP)

### Week 7-8: Meeting Assistant (Basic)
- [ ] Zoom auto-record + transcribe
- [ ] Meeting summary generation (Claude)
- [ ] Action items extraction
- [ ] Speaker detection (basic)

**Launch Target:** Feb 20, 2026

---

## Phase 2: Enhancement (Weeks 9-16)

### Week 9-10: Voice Commands
- [ ] Intent detection system
- [ ] System commands (open app, timer, etc.)
- [ ] Custom command learning

### Week 11-12: AI Generation
- [ ] Email generation templates
- [ ] Code generation (Claude integration)
- [ ] Meeting summary in email format
- [ ] AI writing assistant

### Week 13-14: Snippets & Shortcuts
- [ ] Snippet library UI
- [ ] Voice-activated snippet insertion
- [ ] Learning system (auto-detect patterns)

### Week 15-16: Integrations Expansion
- [ ] Notion integration (full)
- [ ] Google Meet integration
- [ ] Microsoft Teams support
- [ ] ClickUp/Jira integration

---

## Phase 3: Polish & Advanced (Weeks 17-24)

### Week 17-18: Knowledge Base
- [ ] Auto-note capture
- [ ] Vector embeddings for semantic search
- [ ] Voice-activated knowledge search
- [ ] Obsidian sync

### Week 19-20: Real-time Features
- [ ] Live meeting transcription (improved)
- [ ] Real-time AI suggestions
- [ ] Collaborative meeting notes

### Week 21-24: Production Ready
- [ ] Load testing + optimization
- [ ] Security audit
- [ ] Privacy mode (local processing)
- [ ] Analytics & monitoring
- [ ] Documentation + onboarding

**Product Launch Target:** April 15, 2026

---

# SPÉCIFICATIONS TECHNIQUES

## Backend Architecture

### Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  api_key VARCHAR(255) UNIQUE,
  plan VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Transcripts
CREATE TABLE transcripts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  content TEXT,
  source VARCHAR(50), -- 'upload', 'dictation', 'meeting'
  duration_seconds INT,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  processed_at TIMESTAMP,
  metadata JSONB -- speaker info, format, etc
);

-- Meeting Records
CREATE TABLE meetings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  transcript_id UUID REFERENCES transcripts(id),
  platform VARCHAR(50), -- 'zoom', 'google_meet', 'teams'
  platform_meeting_id VARCHAR(255),
  title VARCHAR(255),
  attendees JSONB, -- [{name, email, platform_id}]
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_seconds INT,
  recording_url VARCHAR(512),
  summary TEXT,
  action_items JSONB, -- [{task, owner, due_date}]
  metadata JSONB
);

-- Snippets
CREATE TABLE snippets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  content TEXT,
  voice_cue VARCHAR(255) UNIQUE,
  category VARCHAR(50), -- 'text', 'code', 'meeting'
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Integration Tokens
CREATE TABLE integration_tokens (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  provider VARCHAR(50), -- 'slack', 'gmail', 'notion'
  access_token TEXT (encrypted),
  refresh_token TEXT (encrypted),
  expires_at TIMESTAMP,
  metadata JSONB, -- workspace_id, team_id, etc
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Voice Command History
CREATE TABLE command_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  voice_input TEXT,
  detected_intent VARCHAR(255),
  confidence DECIMAL(3,2),
  action_executed VARCHAR(255),
  success BOOLEAN,
  created_at TIMESTAMP
);
```

### API Endpoints (RESTful)

```
Authentication:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout

Transcription:
POST /api/transcription/upload (multipart file)
POST /api/transcription/process (for batch)
GET /api/transcription/:id
GET /api/transcription (list + search)
POST /api/transcription/:id/export
DELETE /api/transcription/:id

Dictation:
POST /api/dictation/stream (WebSocket)
POST /api/dictation/process
GET /api/dictation/context (app context)

Meetings:
POST /api/meetings/start-record
POST /api/meetings/:id/stop-record
GET /api/meetings/:id
POST /api/meetings/:id/summarize
GET /api/meetings (list)
POST /api/meetings/:id/attendees (manual names)

Commands:
POST /api/commands/detect-intent
POST /api/commands/execute
GET /api/commands/history

Snippets:
POST /api/snippets
GET /api/snippets
PUT /api/snippets/:id
DELETE /api/snippets/:id

Integrations:
POST /api/integrations/:provider/connect
POST /api/integrations/:provider/disconnect
POST /api/integrations/:provider/test
GET /api/integrations/connected

Search:
POST /api/search (full-text + semantic)
POST /api/search/voice-query

Analytics:
GET /api/analytics/usage
GET /api/analytics/top-apps
GET /api/analytics/meeting-stats
```

### WebSocket Events (Real-time)

```javascript
// Client → Server
socket.emit('audio_stream', { chunk: Blob, duration: number })
socket.emit('meeting_detected', { platform, meeting_id })
socket.emit('command_execute', { command: string })

// Server → Client
socket.on('transcription_interim', { text: string, confidence: number })
socket.on('transcription_final', { text: string, speaker: string })
socket.on('meeting_summary', { summary: string, action_items: array })
socket.on('command_result', { success: boolean, result: any })
socket.on('error', { code: string, message: string })
```

## Frontend Architecture (Electron + React)

### Component Structure

```
src/
├── main.js (Electron main process)
├── preload.js (IPC bridge)
├── pages/
│   ├── Home.tsx (main UI)
│   ├── Dictation.tsx (full dictate mode)
│   ├── Meetings.tsx (meeting list)
│   ├── Transcripts.tsx (transcript management)
│   ├── Settings.tsx (configuration)
│   └── Analytics.tsx (dashboard)
├── components/
│   ├── AudioRecorder.tsx
│   ├── TranscriptionDisplay.tsx
│   ├── AIWriter.tsx
│   ├── AppRouter.tsx
│   ├── IntegrationSettings.tsx
│   └── SnippetEditor.tsx
├── hooks/
│   ├── useAudioCapture.ts
│   ├── useTranscription.ts
│   ├── useIntegrations.ts
│   └── useAppContext.ts
├── services/
│   ├── transcriptionService.ts
│   ├── integrationService.ts
│   ├── meetingService.ts
│   └── analyticsService.ts
├── state/
│   ├── userSlice.ts (Redux)
│   ├── transcriptSlice.ts
│   └── settingsSlice.ts
└── utils/
    ├── appContextDetector.ts
    ├── intentDetector.ts
    └── formatting.ts
```

### Key Components Detail

```typescript
// AudioRecorder.tsx - Core recording component
interface AudioRecorderProps {
  onTranscriptionStart?: () => void;
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: Error) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({...}) => {
  // Implements:
  // - Hotkey listener (global)
  // - Microphone capture
  // - Real-time visualization
  // - Voice activity detection (silence detection)
  // - Post-processing (filler removal, punctuation)
}

// AppContextDetector.tsx - Detects focused app
interface AppContext {
  appName: string; // "Slack", "Gmail", "VSCode"
  appBundle?: string; // com.tinyspeck.slackmacgap
  windowTitle?: string;
  estimatedFormat: 'slack_message' | 'email_body' | 'code' | 'note' | 'generic';
  formattingRules: FormattingRule[];
}

// Detect current app context
export const detectAppContext = (): AppContext => {
  // macOS: Use system frameworks
  // Windows: Use Windows API
  // Return formatting rules based on app
}
```

## Privacy & Security

### Encryption

```
- Transport: TLS 1.3 (all API calls)
- At-rest: AES-256-GCM (transcript storage)
- Integration tokens: Envelope encryption (per-user key)
- Local audio files: Optional encryption (user choice)
```

### Data Handling

```
GDPR Compliance:
- User can delete all data with one click
- Export data in standard format (CSV + JSON)
- No data sharing without explicit consent
- Transparent data usage policy

PRIVACY MODE:
- Option to process everything locally
- Download Whisper model locally (1.5 GB)
- All LLM calls can be proxied through local service
- No cloud storage unless user enables it
```

---

# INTÉGRATIONS REQUISES

## Tier 1: Critical (MVP)

### Slack Integration

**Scope:**
- Send dictation to Slack (DM or channel)
- Post meeting summaries to channel
- Receive Slack notifications
- Link back to CrocoVoice from Slack message

**OAuth Flow:**
```
1. User clicks "Connect Slack"
2. Redirects to Slack OAuth
3. User authorizes app
4. Receive access token + team info
5. Store encrypted in DB
6. Test connection
```

**API Implementation:**
```typescript
class SlackIntegration {
  async sendMessage(channel: string, text: string): Promise<MessageResponse> {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel,
        text,
        blocks: this.formatAsBlocks(text) // Rich formatting
      })
    });
    return response.json();
  }
}
```

### Gmail Integration

**Scope:**
- Compose emails via voice
- Save as draft or send
- Auto-signature support
- Schedule send option

**OAuth Flow:**
- Similar to Slack
- Scopes: `gmail.compose`, `gmail.send`

**API Implementation:**
```typescript
class GmailIntegration {
  async sendEmail(to: string, subject: string, body: string, draft: boolean) {
    const message = this.createMimeMessage(to, subject, body);
    
    if (draft) {
      return this.gmail.users.drafts.create({
        userId: 'me',
        requestBody: { message }
      });
    } else {
      return this.gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: btoa(message) }
      });
    }
  }
}
```

### Zoom Integration

**Scope:**
- Auto-record meetings
- Transmit recording for transcription
- Retrieve meeting metadata
- Store meeting summary

**SDK:** `@zoom/sdk` official SDK

**API Implementation:**
```typescript
class ZoomIntegration {
  async startMeetingCapture(meetingId: string) {
    // Hook into Zoom desktop app
    // Start local recording
    // Stream audio to transcription service
    
    this.recordingPath = await this.startLocalRecording(meetingId);
    this.audioStream = await this.openAudioStream(this.recordingPath);
    
    await transcriptionService.streamAudio(this.audioStream, {
      meetingId,
      realtime: true
    });
  }
}
```

### Notion Integration

**Scope:**
- Create pages from voice notes
- Auto-populate database properties
- Store meeting summaries
- Link to other records

**API:** Official Notion API

```typescript
class NotionIntegration {
  async createPageFromDictation(dbId: string, title: string, content: string) {
    return this.notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        'Title': { title: [{ text: { content: title } }] }
      },
      children: this.convertMarkdownToBlocks(content)
    });
  }
}
```

---

## Tier 2: Important (Phase 2)

- **Google Meet:** Meeting capture + transcription
- **Microsoft Teams:** Meeting integration + transcription
- **ClickUp / Asana / Jira:** Create tasks from action items
- **OpenAI API:** Fallback LLM provider
- **Deepgram API:** Alternative STT provider with speaker labels

---

## Tier 3: Nice-to-Have (Phase 3)

- **Salesforce:** Log calls + opportunities
- **HubSpot:** Log interactions + deals
- **Zapier / Make.com / n8n:** Custom automations
- **Slack Workflow Builder:** Trigger CrocoVoice actions
- **Calendly / Cal.com:** Extract availability from voice

---

# UX/UI FRAMEWORK

## Design System (Shadcn-based)

### Core Color Palette

```
Primary: #0066FF (Croco Blue)
Secondary: #00D084 (Croco Green)
Accent: #FF6B35 (Croco Orange)
Background: #FAFBFC (Light mode) / #0F1419 (Dark)
Surface: #FFFFFF / #1A1F2E
Text: #0F1419 / #FAFBFC

Status colors:
- Recording: #FF3B30 (Red)
- Processing: #FF9500 (Orange)
- Success: #00D084 (Green)
- Error: #FF3B30 (Red)
```

### Component Library

```
Buttons:
- Primary (filled blue)
- Secondary (outline)
- Ghost (minimal)
- Icon button (circle)

Input:
- Text input with icon
- Voice input (special styling)
- Rich text editor

Dialog/Modal:
- Settings modal
- Confirmation dialog
- Full editor (dictation mode)

Status indicators:
- Recording indicator (animated)
- Processing spinner
- Success checkmark

Waveform visualization:
- Real-time audio waveform
- Past transcription timeline
- Speaker visualization
```

## Main UI Layout

```
┌──────────────────────────────────────────────────┐
│ CrocoVoice [−] [□] [×]                 🎤 ⚙️    │
├──────────────────────────────────────────────────┤
│                                                  │
│ ┌──────────────────────────────────────────┐    │
│ │ Quick Dictate                [Cmd+Shift+D]    │
│ │                                          │    │
│ │ [🎤 Click to Record] or hold Cmd+Space   │    │
│ │                                          │    │
│ │ "This is my message..."                  │    │
│ │                                          │    │
│ │ [Send to Slack] [Send to Email] [Copy]  │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ ┌──────────────────────────────────────────┐    │
│ │ Recent Meetings:                         │    │
│ │ • Q1 Planning (1h 23m) - 2026-01-20      │    │
│ │ • Sales Call (45m) - 2026-01-19          │    │
│ │ • Engineering Standup (15m) - 2026-01-19 │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ [🎤 Record Meeting] [📁 Transcripts] [⚙️]       │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Full Dictation Editor

```
┌─────────────────────────────────────────────────┐
│ CrocoVoice Dictation      [−] [□] [×]           │
├─────────────────────────────────────────────────┤
│                                                 │
│ [🎤] Recording... (4.2 seconds)                │
│ ▓▓▓▓▓░░░░ (audio waveform visualization)      │
│                                                 │
│ ┌───────────────────────────────────────────┐  │
│ │ Here's my draft proposal for the Q1 roadmap │
│ │ that I think we should review with the     │
│ │ stakeholders before finalizing             │
│ │                                             │
│ │ [cursor blinking]                           │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ 💡 Suggestions:                                 │
│ • Add period at end                            │
│ • "stakeholders" → "key stakeholders"          │
│ • Consider: "Here's my initial proposal draft" │
│                                                 │
│ [📋 Copy] [📤 Send to Slack] [📧 Email Draft]  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

# MODÈLE DE DONNÉES

## User Profile

```json
{
  "id": "uuid",
  "email": "tom@crocovice.ai",
  "plan": "pro",
  "preferences": {
    "stt_provider": "whisper",
    "llm_provider": "claude",
    "default_note_app": "notion",
    "theme": "light",
    "language": "en",
    "hotkeys": {
      "quick_dictate": "cmd+shift+space",
      "full_dictate": "cmd+shift+d",
      "command_palette": "cmd+shift+k"
    }
  },
  "integrations": {
    "slack": {
      "workspace_id": "T00000000",
      "team_name": "CrocoClick",
      "default_channel": "general"
    },
    "gmail": {
      "email": "tom@gmail.com",
      "auto_signature": true
    },
    "notion": {
      "workspace_id": "abc123",
      "default_database": "db-uuid-here"
    }
  },
  "stats": {
    "total_dictations": 2341,
    "total_meetings_recorded": 156,
    "total_transcription_hours": 284.5
  }
}
```

## Transcript Record

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Product Planning Meeting - Q1",
  "source": "meeting", // "upload", "dictation", "meeting"
  "platform": "zoom",
  "duration_seconds": 4980,
  "language": "en",
  "content": "Full transcript text...",
  "speakers": [
    {
      "speaker_id": 1,
      "name": "John",
      "email": "john@crococlic.ai",
      "segment_count": 24,
      "total_seconds": 2400
    },
    {
      "speaker_id": 2,
      "name": "Sarah",
      "email": "sarah@crococlick.ai",
      "segment_count": 18,
      "total_seconds": 1800
    }
  ],
  "segments": [
    {
      "speaker_id": 1,
      "timestamp": 0,
      "duration": 45,
      "text": "Good morning everyone, let's start...",
      "confidence": 0.97
    },
    {
      "speaker_id": 2,
      "timestamp": 45,
      "duration": 120,
      "text": "Thanks for joining. I wanted to discuss...",
      "confidence": 0.95
    }
  ],
  "metadata": {
    "meeting_title": "Q1 Planning",
    "meeting_start": "2026-01-20T10:00:00Z",
    "meeting_attendees": 3,
    "recording_url": "s3://bucket/audio.m4a",
    "summary_generated": true,
    "action_items_extracted": true
  },
  "summary": {
    "text": "Team discussed Q1 roadmap...",
    "action_items": [
      {
        "task": "Create technical spec",
        "owner": "Sarah",
        "due_date": "2026-01-27"
      }
    ],
    "key_topics": ["roadmap", "timeline", "budget"],
    "decisions": ["Use Claude for intent detection"]
  },
  "processing": {
    "status": "completed", // "processing", "completed", "failed"
    "started_at": "2026-01-20T10:15:00Z",
    "completed_at": "2026-01-20T10:30:00Z",
    "error": null
  },
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-20T10:30:00Z"
}
```

---

# PLAN DE DÉVELOPPEMENT

## Sprint Planning (6-month roadmap)

### Sprint 1: Core Voice Input (2 weeks)
**Goals:** Hotkey system + basic recording + Whisper integration

**Deliverables:**
- Electron app with hotkey listener
- Audio capture + PCM conversion
- Whisper API integration (speech-to-text)
- Basic UI (main window + settings)
- SQLite local database

**Success Metrics:**
- Hotkey responsive (< 100ms to show listening indicator)
- Transcription accuracy > 90%
- App stable (no crashes in 8 hours continuous use)

---

### Sprint 2: Dictation Flow (2 weeks)
**Goals:** End-to-end dictation with app context

**Deliverables:**
- Quick dictate mode (hotkey → insert directly)
- Full dictate editor UI
- App context detection (app name + window title)
- Post-processing (filler words, punctuation)
- Clipboard handling

**Success Metrics:**
- Context detection accuracy > 95%
- Dictation → output in < 3 seconds
- Paste integration works in 10+ apps

---

### Sprint 3: Integrations Foundation (2 weeks)
**Goals:** Slack + Gmail working end-to-end

**Deliverables:**
- OAuth flow for Slack + Gmail
- Send dictation to Slack (direct + channel)
- Compose + send email via voice
- Integration settings UI
- Error handling + retry logic

**Success Metrics:**
- OAuth flow < 2 minutes to complete
- Message delivery success rate > 99%
- No data loss on network errors

---

### Sprint 4: Meeting Assistant (2.5 weeks)
**Goals:** Zoom integration + basic transcription

**Deliverables:**
- Zoom meeting detection + auto-record
- Real-time transcription stream
- Speaker detection (basic)
- Meeting storage + metadata
- Meeting list UI

**Success Metrics:**
- 95% of Zoom meetings automatically recorded
- Real-time transcription latency < 2 seconds
- Speaker detection > 85% accurate for 2-person conversations

---

### Sprint 5: AI Processing (2 weeks)
**Goals:** Claude integration for summaries + text processing

**Deliverables:**
- Claude API integration (summary generation)
- Action items extraction
- Email generation from voice
- Code snippet generation
- Real-time grammar suggestions

**Success Metrics:**
- Summary generation < 10 seconds for 1h meeting
- Action item extraction > 80% complete
- Email quality rated > 4/5 by users

---

### Sprint 6: Voice Commands (2 weeks)
**Goals:** Intent detection + command execution

**Deliverables:**
- Intent classifier (custom + Claude-backed)
- System commands (open app, timer, etc.)
- App commands (send to Slack, create task)
- Command learning (track successful patterns)
- Command history UI

**Success Metrics:**
- Intent detection accuracy > 85%
- Command execution success > 95%
- Learning model improves over time

---

### Sprint 7: Snippets & Templates (2 weeks)
**Goals:** Voice-activated snippet library

**Deliverables:**
- Snippet creation + management UI
- Voice cue matching
- Auto-complete learning
- Snippet templates for common use cases
- Import/export functionality

**Success Metrics:**
- Snippet creation < 30 seconds
- Voice cue matching > 90% on first try
- Top 20 snippets account for 50% of usage

---

### Sprint 8: Notion Integration (2 weeks)
**Goals:** Seamless note capture to Notion

**Deliverables:**
- Notion OAuth integration
- Create page from voice notes
- Database property mapping
- Auto-tagging + metadata
- Sync history + status

**Success Metrics:**
- Note capture to Notion < 5 seconds
- Property population > 90% accurate
- Database queries for notes work perfectly

---

### Sprint 9: Real-time Collaboration (2 weeks)
**Goals:** Real-time transcription display + sharing

**Deliverables:**
- WebSocket real-time updates
- Meeting participant notifications
- Live transcript sharing (URL-based)
- Collaborative editing
- Version history

**Success Metrics:**
- Real-time updates < 500ms latency
- Share links shareable + viewable
- Collaborative editing conflict resolution works

---

### Sprint 10: Analytics & Insights (1.5 weeks)
**Goals:** Usage tracking + insights dashboard

**Deliverables:**
- Event tracking (dictations, meetings, etc.)
- Analytics dashboard
- Usage reports (email monthly)
- Time saved calculations
- Top features analysis

**Success Metrics:**
- Dashboard loads < 2 seconds
- Accurate time tracking (within 5%)
- Monthly report > 90% user open rate

---

### Sprint 11: Production Hardening (2 weeks)
**Goals:** Stability, security, performance

**Deliverables:**
- Load testing (1000+ concurrent dictations)
- Security audit + penetration testing
- Encryption at-rest + in-transit
- Error monitoring + logging (Sentry)
- Performance optimization

**Success Metrics:**
- 99.9% uptime SLA
- <100ms p99 latency on API calls
- Zero security vulnerabilities

---

### Sprint 12: Launch Prep (1.5 weeks)
**Goals:** Final polish + documentation

**Deliverables:**
- User onboarding tutorial
- Comprehensive docs + API reference
- Video tutorials (5-10 min each)
- FAQ + troubleshooting guide
- Release notes + changelog

**Success Metrics:**
- Docs cover 95% of use cases
- Onboarding completion > 80%
- Tutorial videos > 1000 views each

---

## Total Timeline

| Phase | Duration | Target Launch |
|-------|----------|----------------|
| MVP (Phases 1-6) | 12 weeks | Early March 2026 |
| Enhancement (Phases 7-10) | 8 weeks | Late April 2026 |
| Polish (Phase 11-12) | 3 weeks | Mid-May 2026 |
| **FULL LAUNCH** | **~23 weeks** | **May 15, 2026** |

---

# CRITÈRES DE SUCCÈS

## Product Metrics (Quarterly)

### Month 1 (March 2026) - MVP Launch
```
- Beta testers: 100 signups
- Daily active users: 40
- Average session: 8 minutes
- Hotkey usage: 60% of users
- Dictation accuracy: > 92%
- Meeting recording: 100% of Zoom meetings
- Crash rate: < 0.5%
```

### Month 2-3 (April-May 2026) - Full Launch
```
- Paid users: 500+
- Monthly recurring revenue: $15,000+
- Churn rate: < 5%
- NPS score: > 50
- Feature usage:
  - Dictation: 70% of users daily
  - Meetings: 60% of users weekly
  - Slack integration: 80% of connected users
  - Email generation: 40% of users weekly
- Support tickets: < 1 per 10 users/month
```

### Month 6 (June 2026)
```
- Paid users: 2,000+
- MRR: $60,000+
- Retention rate (month 2): > 85%
- Primary integrations live and stable
- Enterprise pilots: 3-5 active
```

## Engineering Excellence

- **Test coverage:** > 80% (critical paths 95%+)
- **Performance:**
  - Hotkey activation: < 100ms
  - Dictation processing: < 3 seconds
  - API response: < 500ms (p95)
- **Uptime:** 99.9% SLA
- **Security:** Zero critical vulnerabilities (per security audit)
- **Accessibility:** WCAG 2.1 AA compliance

---

# REVIEW CRITIQUE & POINTS D'ATTENTION

## 🚨 Critical Issues & Mitigations

### 1. AI Quality Variance (RISK: HIGH)

**Problem:** Claude/GPT reliability isn't constant; sometimes summaries are generic or miss context.

**Mitigation:**
```
✅ Use few-shot prompting (provide 2-3 examples of good summaries)
✅ Implement prompt versioning (test multiple versions, pick best)
✅ Add human review loop (optional for enterprise)
✅ Fallback: Use hybrid approach (structured extraction + LLM)
✅ Monitor summary quality (user feedback thumbs up/down)

Implementation:
- Build evaluation framework (test 100 transcripts monthly)
- A/B test prompt variations
- Collect user feedback on quality
- Version prompts in database (v1, v2, v3)
```

---

### 2. Privacy & Data Handling (RISK: HIGH)

**Problem:** User audio data is sensitive; storing audio + transcripts creates liability. GDPR/CCPA compliance required.

**Mitigation:**
```
✅ Privacy Policy: Clear, transparent (link from app)
✅ Consent: Explicit user opt-in before recording
✅ Data Deletion: One-click delete all data
✅ Encryption: AES-256 at-rest, TLS 1.3 in transit
✅ Local Mode: Optional—process everything locally (Whisper on-device)
✅ Retention Policy: Auto-delete transcripts after 30/60/90 days
✅ Compliance: SOC 2 Type II certification + GDPR audit

Implementation:
- Use AWS KMS for key management
- Implement envelope encryption (per-user keys)
- Add data deletion confirmation UI
- Monthly compliance checks
```

---

### 3. Real-time Transcription Latency (RISK: MEDIUM)

**Problem:** If transcription lags > 3 seconds in meetings, user experience suffers (feels "behind" the speaker).

**Mitigation:**
```
✅ Provider Selection: Use Deepgram (fastest real-time, ~300ms)
✅ Streaming Architecture: Direct WebSocket to STT provider
✅ Client-side Caching: Cache interim results locally
✅ Optimized Encoding: Use opus codec (lower bandwidth)
✅ CDN Strategy: Endpoint selection based on geography

Implementation:
- Benchmark all STT providers (Whisper, Deepgram, Assembly AI)
- Measure latency from audio capture to displayed text
- Set SLA: < 1 second for interim results
- Monitor real-time latency per region
```

---

### 4. App Context Detection Fragility (RISK: MEDIUM)

**Problem:** Detecting "which app is focused" differs per OS; can break on app updates.

**Mitigation:**
```
✅ Multi-OS Testing: Test with major apps (Slack, VS Code, Gmail, etc.)
✅ Fallback: If context unknown, ask user manually
✅ Accessibility API: Use OS native APIs (not heuristics)
✅ Regular Updates: Test after app updates

macOS Implementation:
- Use NSWorkspace for active app detection
- Bundle ID detection (most reliable)
- Window title as secondary indicator

Windows Implementation:
- Use Windows API (GetForegroundWindow, etc.)
- Check process name + window class
- Registry for common app paths

Implementation:
- Test matrix: 20+ major apps × 3 OSes
- Quarterly update cycle for app detections
- User can manually override context
```

---

### 5. Speaker Detection Accuracy (RISK: MEDIUM)

**Problem:** In meetings with > 4 speakers or similar voices, misattribution occurs (Speaker 1 ≠ John).

**Mitigation:**
```
✅ Multi-Modal Approach: Use Deepgram speaker labels + Pyannote
✅ Manual Correction UI: User can override speaker names
✅ Learning: Remember user's voice over time
✅ Confidence Scoring: Flag low-confidence speaker segments

Implementation:
- Deepgram: Primary (good for 2-4 speakers)
- Pyannote: Backup for complex meetings
- Manual mapping UI (before transcription finalized)
- Voice embedding database (learn user's voice)
- Confidence threshold: < 70% requires confirmation
```

---

### 6. Integration Reliability (RISK: MEDIUM)

**Problem:** Slack/Gmail/Notion APIs change; outages block key features.

**Mitigation:**
```
✅ Abstraction Layer: Wrap integrations in interface
✅ Graceful Degradation: Fallback to clipboard on failure
✅ Retry Logic: Exponential backoff (1s, 2s, 4s, 8s, 30s)
✅ Status Monitoring: Health checks on integrations
✅ Queue System: Use Redis for async delivery

Implementation:
- Create IntegrationAdapter interface
  - slack: SlackAdapter implements IntegrationAdapter
  - gmail: GmailAdapter implements IntegrationAdapter
- Queue failed messages in Redis
- User notification when delivery fails
- Status page showing integration health
```

---

### 7. Cost Control (OpenAI/Claude API) (RISK: MEDIUM)

**Problem:** Claude + Whisper API costs grow with usage. Can exceed revenue if not controlled.

**Cost Analysis:
```
Per dictation (30 sec):
- Whisper API: $0.006 (60 min/$1)
- Claude mini (summary + suggestions): $0.02 (worst case)
- Total: $0.026

At 2000 users, 10 dictations/user/day:
- 20,000 dictations/day
- $520/day API costs
- $15,600/month

Revenue (500 paid users @ $29/month):
- $14,500/month

⚠️ Situation: APIs cost nearly exceeds revenue!
```

**Mitigation:**
```
✅ Cost Tiers:
  - Free: 5 dictations/day (limited features)
  - Pro $29: 100 dictations/day + full features
  - Enterprise: Custom API pricing

✅ Cache Summaries: Don't re-generate for same transcript
✅ Batch Processing: Run summaries in off-peak hours
✅ Local Models: Use Mistral/Llama for non-critical tasks
✅ Rate Limiting: Enforce per-user API quotas

Implementation:
- Monitor API costs daily (CloudWatch + custom dashboard)
- Set budget alerts ($500/day max)
- Use Claude "cheap" models for draft suggestions
- Reserve expensive Claude calls for summaries only
- Consider self-hosting LLM (LLaMA 2) for lower cost
```

**Revised Cost Model:**
```
At scale (2000 users):
- Pro users: 50% churn → ~1000 active
- Monthly revenue: $29,000
- API costs (optimized): $12,000 (41% of revenue)
- Margin: 59% (healthy)
```

---

### 8. Offline Capability (RISK: LOW-MEDIUM)

**Problem:** Meeting recording requires cloud (Zoom sends to cloud). Local processing has privacy benefits but limits features.

**Mitigation:**
```
✅ Hybrid Mode:
  - Core (hotkey dictate): Works 100% offline
  - Transcription: Use local Whisper (1.5 GB model)
  - Meetings: Record locally, process when online
  - Summaries: CloudSync when online

✅ Local Model Deployment:
  - Ship lightweight Whisper model (tiny, 39 MB)
  - Optional: Download larger models (small 140 MB, base 140 MB)
  - Local LLM option: Mistral 7B (via Ollama)

Implementation:
- Model downloaded on first run (with user consent)
- Offline indicator in UI
- Queue meeting recordings locally
- Sync + process when network returns
```

---

### 9. Platform-Specific Challenges (RISK: MEDIUM)

**macOS vs Windows Differences:**

| Feature | macOS | Windows | Linux |
|---------|-------|---------|-------|
| Hotkeys | ✅ Easy (Event Monitor) | ⚠️ Harder (Raw Input API) | ⚠️ X11/Wayland |
| App Detection | ✅ NSWorkspace | ✅ Windows API | ⚠️ varies |
| Keyboard Simulation | ✅ EventTap | ✅ SendInput | ⚠️ X-test |
| Screen Capture | ✅ Core Graphics | ✅ DXGI | ⚠️ varies |

**Mitigation:**
```
✅ Phase 1: macOS only (Electron best on macOS)
✅ Phase 2: Windows support (major testing effort)
✅ Phase 3: Linux support (small user base, lower priority)

✅ Abstraction Layer:
  - PlatformService interface
  - macOS: CocoaPlatformService
  - Windows: Win32PlatformService
  - Linux: XlibPlatformService
```

---

### 10. User Onboarding Complexity (RISK: MEDIUM)

**Problem:** "OS vocal IA" is powerful but complex. Users need education.

**Mitigation:**
```
✅ Onboarding Flow:
  1. Welcome screen (what is CrocoVoice?)
  2. Permission grants (microphone, accessibility)
  3. Hotkey assignment (customize shortcuts)
  4. Integration setup (Slack/Gmail/Notion)
  5. First dictation (guided example)
  6. First meeting (explain recording)
  7. Settings overview (key options explained)

✅ In-App Help:
  - Tooltips on every new feature
  - Interactive tutorial (first use)
  - Help sidebar (always accessible)
  - Video guides (embedded in app)

✅ Community:
  - Discord server for help
  - Public roadmap (transparency)
  - Feature requests (user voice)
```

---

## 🎯 Strategic Recommendations

### A. Pricing Strategy

**Recommendation: Freemium + Pro Model**

```
FREE:
- 5 dictations/day
- Basic dictation (no AI suggestions)
- 5 meeting recordings/month
- No integrations
- 7-day transcript retention
- Use case: Individual, light user

PRO ($29/month):
- Unlimited dictations
- AI suggestions + grammar
- Unlimited meeting recordings
- All integrations (Slack, Gmail, Notion)
- 90-day transcript retention
- Email generation
- Voice commands
- Priority support
- Use case: Freelancer, individual contributor

ENTERPRISE (Custom):
- All Pro features
- SSO + admin console
- Team workspace (multiple users)
- Advanced analytics
- Compliance support (GDPR/SOC2/HIPAA)
- 1-year retention
- Dedicated support
- Custom integrations
- Use case: SaaS companies, enterprises

Upgrade triggers:
- User hits 5-dictation limit → "Upgrade to continue"
- Try premium feature → "Available in Pro"
```

**Projected unit economics:**
```
Acquisition Cost (CAC): $50 (content marketing + organic)
Lifetime Value (LTV): $1,740 (60-month retention @ $29/month)
LTV/CAC Ratio: 34.8x (excellent)
Payback Period: 2 months

Churn assumptions:
- Month 2: 10% churn
- Stabilize at 3% monthly after month 6
- Users: 500 Pro @ month 1 → 2000 Pro @ month 6
```

---

### B. Competitive Moat

**Building defensibility:**

```
1. SPEED MOAT:
   - Hotkey latency < 100ms (industry-leading)
   - Real-time transcription < 1 second
   - Result: User love → habit formation

2. CONTEXT MOAT:
   - App-aware formatting (Slack ≠ Email ≠ Code)
   - Learning patterns (remembers user preferences)
   - Result: Switching cost (work rebuilding context)

3. INTEGRATION MOAT:
   - Early support for 10+ apps (vs competitors 3-4)
   - Custom webhook system
   - Result: Deeper workflow integration

4. AI MOAT:
   - Fine-tuned models per user
   - Voice style learning
   - Result: Better quality over time

5. DATA MOAT:
   - Millions of voice samples
   - Meeting transcripts (anonymized)
   - Result: Better models through data
```

---

### C. Long-term Vision (Year 2)

**Beyond the MVP:**

```
Q3 2026: Team Collaboration
- Shared meeting spaces (multi-device)
- CrocoVoice as Slack bot (@croco summarize)
- Team snippet library + templates
- Meeting permission system

Q4 2026: Knowledge Graph
- Automatic knowledge base (from all transcripts)
- Relationship mapping (who talked to whom about what)
- Predictive suggestions ("you mentioned this last time...")
- Org-wide search across all meetings

2027: Enterprise Suite
- Advanced security (HIPAA, FedRAMP)
- Custom NLP models (train on client data)
- Advanced analytics (meeting trends, sentiment)
- Recording + archival (10-year retention)
- Legal hold support

2027-2028: API Ecosystem
- Public API for third-party integrations
- Marketplace for voice apps
- Partner channels (Salesforce, HubSpot, etc.)
```

---

### D. Partnership Strategy

**Who to partner with early:**

```
CHANNELS:
1. Zapier / Make.com / n8n
   - List CrocoVoice in automation marketplace
   - Enable non-technical users to connect to 100+ apps

2. Notion / Slack / Gmail
   - Get featured in official marketplace
   - "Ecosystem partner" badge

3. AI Tool Platforms
   - Replicant AI ecosystem
   - LLM provider partnerships

4. Influencers
   - SaaS founders (your ICP)
   - Productivity YouTubers
   - Dev influencers
```

---

### E. Distribution Strategy

**Phase 1 (Organic + Content):**
```
- Product Hunt launch (Day 1 + DH audience)
- Hacker News (Show HN: I built an AI voice OS)
- Twitter/LinkedIn (demos, before/after stories)
- Your own audience (CrocoClick users, newsletter)
- Content: "How I built X with 40% less typing" type posts
```

**Phase 2 (Paid + Partnerships):**
```
- Podcasts (Developer/Startup podcasts)
- Sponsorships (Hacker News, GitHub Trending)
- Cohort analysis (find best-fit user segment)
- Partner with Zapier / Make.com
```

---

## 🎁 Bonus: MVP Scope Reduction (if timeline tight)

**If forced to cut to 8 weeks instead of 12:**

### MUST-HAVE:
```
✅ Hotkey dictate → Slack/Email
✅ Upload transcription
✅ Zoom meeting record + transcription
✅ Basic settings UI
✅ Clipboard paste
```

### NICE-TO-HAVE (cut these first):
```
❌ Voice commands (skip)
❌ AI suggestions (simplified version only)
❌ Snippet library (basic version only)
❌ Notion integration (Phase 2)
❌ Analytics dashboard (basic CSV export only)
❌ Offline capability (Phase 2)
❌ Windows support (Phase 2)
```

**Result: Lean MVP, ship faster, validate market demand**

---

## 🔍 Testing Strategy

### Automated Testing

```typescript
// Example: Dictation hotkey test
describe('Hotkey System', () => {
  it('should record audio on hotkey press', async () => {
    const hotkey = new HotkeyListener('cmd+shift+space');
    const recorder = new AudioRecorder();
    
    hotkey.onPress(async () => {
      const audio = await recorder.captureUntilSilence();
      expect(audio.duration).toBeGreaterThan(0);
    });
    
    // Simulate hotkey + voice input
    await simulateHotkey('cmd+shift+space');
    await simulateVoiceInput("hello world");
    await sleep(500); // silence detection
    
    expect(recorder.isRecording()).toBe(false);
  });
});

// Example: Integration test
describe('Slack Integration', () => {
  it('should send dictation to Slack', async () => {
    const slack = new SlackIntegration(mockToken);
    const result = await slack.sendMessage('general', 'Hello team');
    
    expect(result.ok).toBe(true);
    expect(result.ts).toBeDefined();
  });
});
```

### Manual Testing

```
TEST MATRIX:
OS: macOS 13 + 14, Windows 11, Windows 10
Browsers: N/A (desktop app)
Apps: Slack, Gmail, VS Code, Notion, Teams, Zoom (10+ total)
Microphones: Built-in, USB headset, wireless
Network: WiFi, Cellular tether, Offline

Regression test: Run before each release
Smoke test: Before beta release
Load test: 1000+ concurrent users
```

---

## 📊 Metrics Dashboard (Real-time Monitoring)

```
Metrics to track:
✅ Hotkey activation latency (target: < 100ms)
✅ STT accuracy % (target: > 92%)
✅ API response time (target: < 500ms p95)
✅ Meeting detection success rate (target: 95%)
✅ Integration delivery success (target: > 99%)
✅ User session duration (target: > 10 minutes)
✅ Feature adoption % (target: > 60% Pro users use)
✅ Error rate (target: < 0.1%)
✅ Crash rate (target: < 0.01%)

Tools:
- Mixpanel or Amplitude (product analytics)
- Sentry (error tracking)
- DataDog (infrastructure monitoring)
- Custom dashboard (home-rolled in Next.js)
```

---

## ✅ Final Checklist Before Launch

- [ ] Security audit completed (zero critical vulns)
- [ ] Load testing passed (1000+ concurrent users)
- [ ] GDPR/CCPA compliance verified
- [ ] Privacy policy finalized + legal review
- [ ] Onboarding tutorial recorded (5 min video)
- [ ] API docs complete + tested
- [ ] Support process established (email + Discord)
- [ ] Monitoring/alerting set up (Sentry, DataDog)
- [ ] Backup/disaster recovery tested
- [ ] Cost controls implemented (API budget)
- [ ] Product Hunt page prepared
- [ ] Twitter/LinkedIn content calendar ready
- [ ] Beta tester feedback incorporated
- [ ] Performance optimized (profiled)
- [ ] Cross-browser/OS compatibility verified

---

# CONCLUSION

## Summary

CrocoVoice isn't just another dictation tool. It's the **unified OS vocal IA** that replaces 6-8 separate tools:
- Otter (transcription)
- Fireflies (meetings)
- Wispr Flow (dictation)
- ChatGPT (content generation)
- TextExpander (snippets)
- Notion/OneNote (capture)
- Siri/Alexa (commands)

Your technical advantage:
1. **One hotkey** → instant access (vs open app → log in → navigate)
2. **Context-aware formatting** → right output for right app
3. **AI-native** → Claude built in (not just transcription)
4. **Learning system** → gets better over time per user
5. **Offline-capable** → privacy-first option

Your go-to-market advantage:
1. **Founder ICP** → SaaS builders like you (who understand productivity)
2. **Virality** → "How I cut my typing by 60%" stories
3. **Network effects** → team sharing snippets + templates
4. **Enterprise moat** → switching costs high once embedded

---

## Immediate Next Steps

**This week:**
1. ✅ Review this PRD with technical team
2. ✅ Identify gaps/questions/disagreements
3. ✅ Assign Sprint 1 tasks (hotkey + recording + Whisper)

**Next week:**
1. ✅ Begin Sprint 1 development
2. ✅ Set up CI/CD + monitoring
3. ✅ Create issue templates + project board

**By Feb 1:**
1. ✅ MVP core (hotkey dictate → Slack) working
2. ✅ 2-3 alpha testers using daily
3. ✅ Metrics dashboard showing usage

**By March 1:**
1. ✅ Public beta launch (100 testers)
2. ✅ Feedback loop active
3. ✅ Product Hunt readiness

---

## Resources Required

**Team:**
- 1x Full-stack engineer (lead)
- 1x Python ML engineer (optional, can outsource STT)
- 1x Product/growth person (optional)

**Budget (6 months):**
- Salaries: $100-150k (1 FT engineer)
- Cloud infrastructure: $5-10k/month
- API costs: $5-15k/month (scales with users)
- Tools/services: $2-3k/month
- **Total: $150-200k** (reasonable for shipping a product)

**3rd-party services:**
- OpenAI Whisper: $0.006 per minute
- Claude API: $0.003 per 1K input tokens
- AWS: Compute + storage + CDN
- Stripe: 2.2% + $0.30 per transaction

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| AI quality variance | High | Medium | Few-shot prompting, feedback loop |
| Privacy/GDPR issues | Medium | High | Local option, clear policies |
| STT latency > 3s | Medium | Medium | Use Deepgram, real-time API |
| App context breaks | Medium | Low | Multi-OS testing, user override |
| API cost overruns | Medium | Medium | Model caching, rate limiting |
| Competition (Wispr 2.0) | Low | Medium | Ship fast, build moat via integrations |
| Platform fragmentation | Low | Low | Abstract platform layer, test matrix |

**Overall Risk Level: MEDIUM** (manageable with good execution)

---

**Document Versioned:** v1.0 (Jan 20, 2026)  
**Next Review:** Feb 1, 2026  
**Status:** Ready for Development Sprint 1