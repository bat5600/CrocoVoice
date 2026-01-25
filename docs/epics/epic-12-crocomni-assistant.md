# Epic 12 — CrocOmni Assistant

## Status
Draft

## Goal
Provide a Flow-lens-like assistant with conversation memory and optional context.

## User Value
- Ask follow-up questions about recent dictations
- Use context to improve responses (when opted in)
- Keep a local conversation history

## In Scope
- CrocOmni conversation UI
- Local conversation storage
- Optional context injection (app/url/ax/screenshot) with per-app opt-in
- Redaction safeguards before sending to providers

## Out of Scope
- Team/shared conversations
- Long-term cloud knowledge base

## Dependencies
- Context capture and privacy controls (Epic 5)
- Telemetry opt-in rules (Epic 10)

## Risks
- Privacy concerns with context injection
- Hallucinations impacting user trust

## Success Criteria
- Users can start, resume, and archive conversations locally
- Context injection is transparent and opt-in

## KPIs
- CrocOmni session starts per week
- % of sessions with context enabled

## Shard Plan (Stories)
- `docs/stories/12.1-crocomni-ui-and-storage.md` — UI + local conversation storage
- `docs/stories/12.2-crocomni-context-injection-and-redaction.md` — context injection + redaction

## Anti-Duplication Notes
- Long-form file transcription is Epic 6
- History/notes storage is Epic 4
