# Assistant Mode Implementation Plan

## Goal
Introduce an **Assistant mode** that is triggered by a dedicated shortcut (separate from Dictation). Assistant mode treats spoken input as an *instruction*, optionally includes selected text from the active app, and returns an AI-generated response as pasted text.

Example: select a paragraph → say “Make this more formal” → CrocoVoice outputs a rewritten version.

## Success Criteria
- Assistant mode can be started/stopped via a new shortcut.
- Spoken input becomes a prompt (not transcription).
- If user has selected text at invocation or during recording, that selection is included in the prompt.
- Assistant response is delivered to the target app via paste (clipboard fallback if needed).
- Errors (no API key, no selection, no keyboard automation) are handled gracefully.

---

## 1) Product Requirements & UX

### Core Behavior
- **Assistant shortcut** starts recording and marks the session as `assistant`.
- **Speech intent** becomes the instruction, not the output.
- **Selection capture** (if any) is appended to the prompt context.
- **Response delivery** uses the existing paste flow (typing guard + clipboard restore).

### UX copy suggestions
- Widget status text when assistant recording: “Assistant : écoute…”
- Widget completion state: “Assistant : réponse prête”
- Error: “Assistant indisponible : OPENAI_API_KEY manquante.”

---

## 2) Settings & Shortcut Configuration

### Add new settings keys
Add to `defaultSettings` (and to settings save/load via Store):
- `assistantShortcut` (e.g., `Command+Shift+A` / `Ctrl+Shift+A`)
- `assistantModeEnabled` (boolean, default true)
- Optional: `assistantSelectionEnabled` (boolean, default true)
- Optional: `assistantUseContext` (boolean, default false)

### UI Configuration
Add inputs to Settings UI for:
- Assistant shortcut
- Toggle assistant mode
- Toggle selection capture

---

## 3) Recording Lifecycle Changes

### Mode Tracking
- Add `recordingMode` (`dictation` | `assistant`) in main process.
- Extend `startRecording(mode)` / `stopRecording()` to respect mode.
- Renderer uses mode in status display, no change in audio logic.

### Status Routing
- Extend `sendStatus()` payload to include `recordingMode` (or a new channel).

---

## 4) Selection Capture Pipeline

### Requirement
If the user selects text before or during assistant mode, the selection should be copied into the prompt.

### Proposed Implementation
1. **Capture selection via clipboard** in main process.
2. Temporarily store clipboard, send Cmd/Ctrl+C, read new clipboard.
3. Restore clipboard to avoid disruption.

### Edge cases
- If keyboard automation is unavailable → skip selection gracefully.
- If selection capture yields empty text → proceed with prompt only.

---

## 5) Assistant Prompt + LLM Flow

### New assistant pipeline function
Introduce `runAssistantPipeline()` that:
1. Transcribes audio → gets `instruction` string.
2. Fetches `selection` text (if enabled).
3. Builds a structured prompt with instruction + selection.
4. Calls OpenAI chat completion.
5. Returns response text for delivery.

### Prompt format
**System prompt** (example):
> You are a writing assistant. Use the instruction to transform the provided text. If no text is provided, respond to the instruction directly. Be concise, accurate, and return only the final text.

**User prompt**:
```
Instruction:
<spoken prompt>

Selected text (if any):
<selection>
```

### Error handling
- Missing API key → show assistant error and exit to idle.
- OpenAI error → show user-friendly fallback message.

---

## 6) Output Delivery

Use existing `pasteText()`:
- Pasting is primary path.
- Clipboard fallback is secondary path.
- Keep typing guard behavior consistent.

---

## 7) Persistence & Analytics

### Minimal persistence (recommended)
- Store assistant responses in `notes` with metadata `{ source: 'assistant' }`.

### Optional analytics
Add telemetry:
- `assistant_requests` (has_selection, selection_length, latency_ms, error_code).

---

## 8) UI Surface Changes

### Widget Context Menu
Add actions:
- “Mode assistant (⌘⇧A)”
- “Mode dictée (⌘⇧R)”

### Tray Menu
Add:
- “Assistant (⌘⇧A)”

### Dashboard
Add assistant shortcut and toggle controls in settings.

---

## 9) IPC & Event Wiring

### New IPC methods
- `assistant:start` / `assistant:stop` or `recording:start` with `mode` payload.
- `assistant:run` for request/response pipeline (optional separation).
- `assistant:result` for UI updates.

### Renderer hooks
- Update `onStatusChange` handling for assistant-specific labels.

---

## 10) Testing Plan

### Manual checks
1. Assistant shortcut triggers recording and status change.
2. Spoken prompt w/out selection returns response text.
3. Spoken prompt w/ selection transforms selected text correctly.
4. Clipboard restored after selection capture.
5. Dictation shortcut still works unchanged.

### Edge cases
- No OpenAI key.
- No keyboard automation (nut-js missing).
- Empty transcription (no audio).

---

## 11) Implementation Sequence (Suggested)

1. Add settings fields for assistant mode + shortcut.
2. Extend shortcut registration and recording mode state.
3. Add selection capture helper in main process.
4. Implement assistant pipeline (prompt + OpenAI call).
5. Wire delivery to pasteText().
6. Add UI controls + menu actions.
7. Add telemetry and persistence (notes metadata).
8. Validate manual tests.

---

## Open Questions
- Should assistant responses be stored in History (with a new `source` column), or Notes only?
- Should selection capture occur at start only, or re-checked just before sending request?
- Should assistant mode respect context injection settings (CrocOmni context) or remain isolated?

