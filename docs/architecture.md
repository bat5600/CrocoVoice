# CrocoVoice Brownfield Enhancement Architecture

## Introduction
This document outlines the architectural approach for enhancing CrocoVoice with stabilization, internal structuring, and robustness improvements across the record -> transcribe -> post-process -> type flow. Its primary goal is to serve as the guiding architectural blueprint for AI-driven development of these stability enhancements while ensuring seamless integration with the existing system.

**Relationship to Existing Architecture:**
This document supplements the current project architecture by defining how new structure, state management, and resilience patterns will integrate with the existing Electron main/renderer split, IPC flows, and data persistence. Where conflicts arise between new and existing patterns, this document provides guidance on maintaining consistency while implementing enhancements.

**Scope and Assessment:**
This is a cross-cutting stability and structuring enhancement with moderate impact across multiple subsystems, warranting architectural planning.

**Required Inputs:**
- PRD: docs/prd.md (brownfield PRD)
- Repo analysis of core files (main.js, renderer.js, preload.js, store.js, sync.js)
- Existing technical docs: none found in docs/

## Existing Project Analysis

### Current Project State
- **Primary Purpose:** Electron desktop app for rapid voice dictation: MediaRecorder -> OpenAI Whisper -> optional post-process -> keyboard typing, plus tray widget and settings dashboard.
- **Current Tech Stack:** Electron (main/renderer/preload), Node.js, OpenAI SDK, @nut-tree-fork/nut-js (robotjs fallback), SQLite local storage, Supabase sync (optional).
- **Architecture Style:** Single-process Electron app with main process orchestration, renderer handling recording + UI, IPC bridge via preload.js, local services (store.js, sync.js).
- **Deployment Method:** Local Electron runtime via npm start / npm run dev (no packaging pipeline observed).

### Available Documentation
- README (project overview, run instructions, high-level structure)
- docs/prd.md (brownfield PRD)
- docs/brainstorming-session-results.md
- supabase/ (schema files present)

### Identified Constraints
- No formal coding standards or architecture doc found in docs/.
- No automated test harness present; quality relies on manual testing.
- OS-level permissions (microphone/keyboard accessibility) are critical and platform-specific.
- External dependencies introduce runtime fragility (OpenAI API, Supabase connectivity, nut-js/robotjs availability).
- IPC-driven state is split between main/renderer; must keep state transitions consistent.
- SQLite local storage is the source of truth; cloud sync is optional and should not block.

### Change Log
| Change | Date | Version | Description | Author |
| --- | --- | --- | --- | --- |
| Initial draft | 2026-01-15 | v0.1 | Brownfield PRD draft from repo analysis | PM |

## Enhancement Scope and Integration Strategy

### Enhancement Overview
**Enhancement Type:** Bug Fix and Stability Improvements
**Scope:** Stabilize and structure the existing record -> transcribe -> post-process -> type flow, plus state management between main/renderer and resilience around external integrations.
**Integration Impact:** Moderate (touches multiple existing modules without replacing system boundaries).

### Integration Approach
**Code Integration Strategy:** Refactor/structure within existing main.js, renderer.js, preload.js, and service modules (store.js, sync.js) while preserving current IPC channels and UI behavior.
**Database Integration:** Keep SQLite (flow.sqlite) as local source of truth; schema compatibility preserved; Supabase sync remains optional and non-blocking.
**API Integration:** Keep OpenAI Whisper + post-process calls in main process with improved error handling and timeouts.
**UI Integration:** Preserve widget + dashboard UX; renderer only reflects state; main remains the single source of truth.

### Compatibility Requirements
- **Existing API Compatibility:** IPC channels for start/stop recording, settings, history, and sync remain stable.
- **Database Schema Compatibility:** No destructive changes to local SQLite schema.
- **UI/UX Consistency:** Preserve existing widget and dashboard interactions/labels.
- **Performance Impact:** Maintain startup and transcription latency comparable to current behavior.

## Tech Stack

### Existing Technology Stack
| Category | Current Technology | Version | Usage in Enhancement | Notes |
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

### New Technology Additions
None required for this enhancement; improvements should be achieved within the existing stack.

## Data Models and Schema Changes

### New Data Models
No new entities required for this enhancement.

### Schema Integration Strategy
**Database Changes Required:**
- **New Tables:** None
- **Modified Tables:** None
- **New Indexes:** None
- **Migration Strategy:** No migration needed; maintain current schema for settings, history, dictionary, styles.

**Backward Compatibility:**
- Preserve current SQLite schema and data to avoid breaking existing installs.
- Any new runtime state should remain in-memory or within existing settings keys if necessary.

## Component Architecture

### New Components

**Recording State Orchestrator (main process)**
**Responsibility:** Centralize recording lifecycle state and transitions (idle -> recording -> processing -> error) and enforce debouncing/locking rules.
**Integration Points:** main.js recording controls, IPC status updates, renderer start/stop commands.

**Key Interfaces:**
- startRecording() / stopRecording() entrypoints (main)
- sendStatus(state, message) IPC broadcast

**Dependencies:**
- **Existing Components:** IPC (preload.js), renderer recording, tray/shortcut handlers
- **New Components:** none (implemented as structured module or function block within main.js)
**Technology Stack:** Electron main process, JS

**Transcription Pipeline Controller (main process)**
**Responsibility:** Orchestrate transcribe -> post-process -> dictionary -> type pipeline with error handling and timeouts.
**Integration Points:** handleAudioPayload, OpenAI client, keyboard automation, store history.

**Key Interfaces:**
- handleAudioPayload(event, audioData)
- transcribeAudio() / postProcessText() / applyDictionary() / typeText()

**Dependencies:**
- **Existing Components:** OpenAI SDK, keyboard library, Store
- **New Components:** none (structured separation within main)

**Renderer Recording Handler (renderer)**
**Responsibility:** Manage MediaRecorder lifecycle, audio chunking, and waveform; send audio payload to main.
**Integration Points:** renderer.js MediaRecorder setup, IPC sendAudioReady.

**Key Interfaces:**
- initializeMediaRecorder()
- startRecording() / stopRecording()
- sendAudioReady({ buffer, mimeType })

**Dependencies:**
- **Existing Components:** MediaRecorder API, preload.js IPC
- **New Components:** none

### Component Interaction Diagram
```mermaid
graph TD
  Tray[Tray/Shortcut] --> MainState[Recording State Orchestrator]
  MainState -->|start/stop| Renderer[Renderer Recording Handler]
  Renderer -->|audio-ready| Pipeline[Transcription Pipeline Controller]
  Pipeline --> OpenAI[OpenAI Whisper + Post-process]
  Pipeline --> Keyboard[Typing (nut-js/robotjs)]
  Pipeline --> Store[SQLite Store]
  MainState -->|status-change| UI[Widget/Dashboard Renderer]
```

## Source Tree

### Existing Project Structure
```plaintext
CrocoVoice/
├── main.js
├── renderer.js
├── preload.js
├── store.js
├── sync.js
├── index.html
├── dashboard.html
├── dashboard.js
├── assets/
└── supabase/
```

### New File Organization
No new folders/files required for this enhancement; changes will be made within existing core files.

### Integration Guidelines
- **File Naming:** Keep existing lower-case filenames; no new conventions introduced.
- **Folder Organization:** Preserve current flat root structure for core runtime files.
- **Import/Export Patterns:** Continue CommonJS require pattern as used across main.js, store.js, and sync.js.

## Infrastructure and Deployment Integration

### Existing Infrastructure
**Current Deployment:** Local Electron runtime launched via npm start / npm run dev.
**Infrastructure Tools:** Node.js + Electron; no packaging pipeline observed.
**Environments:** Local user machine; OS permissions for mic and accessibility.

### Enhancement Deployment Strategy
**Deployment Approach:** Ship as a standard app update (same runtime), with no additional services required.
**Infrastructure Changes:** None.
**Pipeline Integration:** No pipeline changes; continue local npm start for dev.

### Rollback Strategy
**Rollback Method:** Revert to previous app build (code rollback).
**Risk Mitigation:** Keep changes isolated to core flow; avoid schema changes to maintain backward compatibility.
**Monitoring:** Use existing console logging; add targeted logs for state transitions and errors if needed.

## Coding Standards

### Existing Standards Compliance
**Code Style:** Plain JavaScript, CommonJS require, camelCase variables, minimal inline comments.
**Linting Rules:** None observed.
**Testing Patterns:** No automated test harness; manual testing + runtime logs.
**Documentation Style:** README + PRD; sparse inline docs.

### Enhancement-Specific Standards
None required beyond reinforcing consistent state transition and error-handling patterns.

### Critical Integration Rules
- **Existing API Compatibility:** Do not break IPC channel names or payload shapes (status-change, start/stop-recording, audio-ready, etc.).
- **Database Integration:** No schema changes; keep flow.sqlite as-is.
- **Error Handling:** Always return to a stable state (idle or error -> idle) after failures; avoid stuck processing.
- **Logging Consistency:** Do not log secrets (OpenAI/Supabase keys). Keep logs concise and actionable.

## Testing Strategy

### Integration with Existing Tests
**Existing Test Framework:** None observed.
**Test Organization:** N/A.
**Coverage Requirements:** N/A; rely on manual regression scenarios.

### New Testing Requirements

**Unit Tests for New Components**
- **Framework:** None required unless introduced later.
- **Location:** N/A.
- **Coverage Target:** Focus on critical path behaviors (state transitions, error handling).
- **Integration with Existing:** Manual test scripts and repeatable steps.

**Integration Tests**
- **Scope:** End-to-end recording -> transcription -> typing pipeline.
- **Existing System Verification:** Confirm no regression in widget state, IPC flow, and keyboard typing.
- **New Feature Testing:** Verify error handling and recovery across start/stop, OpenAI failures, and typing failures.

**Regression Testing**
- **Existing Feature Verification:** Repeat core flows (start/stop, settings change, history save, sync optional).
- **Automated Regression Suite:** None; optional to add later.
- **Manual Testing Requirements:** Multi-OS checks for mic + keyboard permissions and global shortcuts.

