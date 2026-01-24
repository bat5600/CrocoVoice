# 1) Product Vision & Context

CrocoVoice is an **AI voice OS for writing**: a hotkey-first desktop app that captures speech, transcribes it, cleans/structures the text, and reliably **delivers** the result (type/paste/clipboard/context-aware output) with a premium UX.

Current state (brownfield): Electron app (MediaRecorder → Whisper → LLM post-process → auto-typing), widget + dashboard, local SQLite as source of truth, optional Supabase (auth/sync).
