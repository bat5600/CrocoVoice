# CrocoVoice Agent Logbook and Project Summary

Purpose: a short project summary plus a single, persistent log where AI agents record every change they make. This prevents loss of context between sessions.

## Project summary (short)

- Product: CrocoVoice is an Electron desktop app for hotkey-first voice dictation.
- Core flow: record -> transcribe (Whisper) -> optional AI cleanup -> deliver (type/paste/clipboard), with a premium dashboard UI.
- Integrations: OpenAI API for transcription/cleanup; optional Supabase (auth/sync); optional Stripe (billing links).
- Canonical docs: `docs/prd.md`, `docs/architecture.md`, `docs/architecture-vnext.md`, `docs/front-end-spec.md`, `docs/ux/`, `docs/epics/`, `docs/stories/`, `docs/qa/`.
- App entry points (repo root): `main.js`, `preload.js`, `renderer.js`, `index.html`, `dashboard.html`.

If you need details, read the canonical docs above before making product or architecture decisions.

## Log rules (for all agents)

- Append-only log: add new entries at the top of the log section.
- Log every change: code, config, docs, tests, scripts, build files.
- Include dates in ISO format and time with timezone.
- List files touched and commands/tests run (including failures).
- Keep entries concise but specific; include any blockers or follow-ups.

## Log template

Use this exact template for each new entry:

```
### YYYY-MM-DD HH:MM TZ - <agent/role>

- Scope: <story/epic/issue/task>
- Summary: <what changed and why>
- Files touched: <file1>, <file2>, <file3>
- Commands/tests: <cmd1>; <cmd2>
- Outcome: <done / partial / blocked>
- Notes: <risks, open questions, next steps>
```

## Log entries (newest first)

<!-- Add new entries here -->

