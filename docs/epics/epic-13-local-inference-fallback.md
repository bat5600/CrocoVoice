# Epic 13 — Local Inference Fallback

## Status
Draft

## Goal
Provide a safe offline or degraded-mode fallback for transcription and VAD.

## User Value
- Dictation still works when network is unreliable
- Predictable behavior in low-connectivity environments

## In Scope
- Local VAD and fallback transcription path
- Clear user messaging when fallback is active
- Performance safeguards (CPU limits, max duration)

## Out of Scope
- Full offline LLM post-processing
- Multi-language model selection UI

## Dependencies
- Streaming pipeline (Epic 8) for fallback triggers
- Long-form file transcription (Epic 6) if local is required

## Risks
- High CPU usage on low-end devices
- Lower transcription quality vs cloud

## Success Criteria
- Fallback activates automatically when cloud fails
- Users can complete dictations offline with clear messaging

## KPIs
- Fallback activation rate
- User-reported quality in fallback mode

## Shard Plan (Stories)
- `docs/stories/13.1-local-vad-and-asr-path.md` — local VAD/ASR path
- `docs/stories/13.2-fallback-ui-and-safeguards.md` — UI indicators + fallback safeguards

## Anti-Duplication Notes
- Streaming protocol and transport are Epic 8
- Upload flow and exports are Epic 6
