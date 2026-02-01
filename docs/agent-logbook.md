# CrocoVoice Agent Logbook and Project Summary

Purpose: a short project summary plus a single, persistent log where AI agents record every change they make. This prevents loss of context between sessions.

## Project summary (short)

- Product: CrocoVoice is an Electron desktop app for hotkey-first voice dictation.
- Core flow: record -> transcribe (Whisper) -> optional AI cleanup -> deliver (type/paste/clipboard), with a premium dashboard UI.
- Integrations: OpenAI API for transcription/cleanup; optional Supabase (auth/sync); optional Stripe (billing links).
- Canonical docs are defined in `docs/ssot.md` (start there). Primary sources: `docs/prd.md`, `docs/architecture.md`, `docs/front-end-spec.md`, `docs/configuration.md`, and `docs/architecture/` appendices.
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

### 2026-02-01 15:08 +0700 - Codex

- Scope: Story 0.7 low-audio hallucination guard
- Summary: Skipped Whisper on near-silence using diagnostics, expanded subtitle hallucination filters, and added mic label/id to no-audio errors.
- Files touched: main.js, docs/stories/0.7-no-speech-no-placeholder-transcript.md
- Commands/tests: date
- Outcome: done
- Notes: No automated tests run for this update.

### 2026-02-01 14:38 +0700 - Codex

- Scope: Story 0.7 follow-up (low audio edge case)
- Summary: Allowed short numeric utterances through no-speech heuristics and added post-process refusal fallback to raw transcript.
- Files touched: main.js, docs/stories/0.7-no-speech-no-placeholder-transcript.md
- Commands/tests: none
- Outcome: done
- Notes: Recommend re-testing with “1, 2” low audio case.

### 2026-02-01 14:28 +0700 - Codex

- Scope: Story 0.7 no-speech regression fix
- Summary: Hardened no-speech detection (empty/filler/diagnostics-assisted) and ensured no-speech paths emit error messaging without persisting history/notes; updated story record and ran test-core.
- Files touched: main.js, docs/stories/0.7-no-speech-no-placeholder-transcript.md
- Commands/tests: node test-core.js
- Outcome: done
- Notes: Manual regression script documented in story; not executed here.

### 2026-02-01 14:03 +0700 - Codex

- Scope: Video review → backlog story updates (no new epics)
- Summary: Updated existing stories to reflect video review decisions (uploads → Notes, streak-first dashboard, editor/UX fixes, context/app-url requirements, CrocOmni chat UX), and added missing stories for UI language toggle + settings IA consolidation + no-speech regression guard; updated PRD + epic shards for consistency.
- Files touched: docs/prd.md, docs/pm-video-review-20260201.md, docs/epics/epic-4-dictionary-history-notes-snippets.md, docs/epics/epic-5-context-privacy-retention.md, docs/epics/epic-6-long-form-uploads-exports.md, docs/stories/4.2-history-search-and-actions.md, docs/stories/4.3-notes-view-and-crud.md, docs/stories/4.4-snippets-v1.md, docs/stories/5.2-context-privacy-and-controls.md, docs/stories/5.3-context-signals-and-profiles.md, docs/stories/5.4-context-capture-retention-and-redaction.md, docs/stories/6.1-upload-flow-and-status.md, docs/stories/7.2-permissions-and-diagnostics.md, docs/stories/9.1-status-bubble-and-context-menu.md, docs/stories/11.1-onboarding-flow.md, docs/stories/11.2-insights-and-wrapped.md, docs/stories/12.1-crocomni-ui-and-storage.md, docs/stories/12.2-crocomni-context-injection-and-redaction.md, docs/stories/0.7-no-speech-no-placeholder-transcript.md, docs/stories/4.6-app-ui-language-toggle.md, docs/stories/4.7-settings-ia-consolidation.md
- Commands/tests: rg; sed; git diff; git status; date
- Outcome: done
- Notes: No code changes; `config/local-models.json` appears untracked and was left untouched.

### 2026-01-31 13:47 +07 - Codex

- Scope: Docs SSOT restructure + roadmap alignment
- Summary: Added SSOT map/rules, aligned PRD milestones, added architecture roadmap alignment, and deprecated vNext doc with guidance.
- Files touched: docs/ssot.md, docs/prd.md, docs/architecture.md, docs/architecture-vnext.md, docs/agent-quickstart.md, docs/agent-logbook.md, docs/README.md
- Commands/tests: rg; sed; tail; git show; date
- Outcome: done
- Notes: No code changes; existing non-doc modifications left untouched.
