# Tech Stack

## Existing Technology Stack

| Category | Technology | Version | Usage | Notes |
| --- | --- | --- | --- | --- |
| Runtime | Node.js | 16+ (README) | Core runtime | Maintains Electron compatibility |
| Desktop Framework | Electron | ^35.7.5 | Main/renderer + IPC | Keep main/renderer split |
| Language | JavaScript | ES standard | All modules | No TS present |
| Audio Capture | MediaRecorder (renderer) | Browser API | Recording pipeline | Requires OS mic permissions |
| Transcription | OpenAI Whisper | openai ^4.20.1 | Audio -> text | External API dependency |
| Post-process | OpenAI Chat | openai ^4.20.1 | Text cleanup | Optional via setting |
| Keyboard Automation | @nut-tree-fork/nut-js | ^4.1.0 | Typing output | robotjs fallback |
| Local DB | SQLite | sqlite3 ^5.1.7 | Settings/history/styles/dictionary | Local source of truth |
| Cloud Sync | Supabase JS | ^2.45.4 | Optional sync | Must be non-blocking |
| Config | dotenv | ^16.3.1 | Env secrets | No secrets in logs |

## New Technology Additions
None required for current stabilization/structuration enhancements.
