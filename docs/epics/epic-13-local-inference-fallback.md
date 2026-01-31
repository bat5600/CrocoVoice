# Epic 13 — Local Inference Fallback

## Status
Draft

## Goal
Provide a safe offline or degraded-mode fallback for transcription and VAD.

## User Value
- Dictation still works when network is unreliable
- Predictable behavior in low-connectivity environments
- Better transcription quality in noisy or low-volume environments without extra cloud cost

## In Scope
- Local VAD and fallback transcription path
- Clear user messaging when fallback is active
- Performance safeguards (CPU limits, max duration)
- Optional local Whisper install during onboarding (Windows-first) with **Lite / Quality / Ultra** presets
- Local model manager (download/resume, checksum, versioning, storage, cleanup) shared across local transcription paths
- **Audio enhancement layer (local-first, adaptive):**
  - Baseline audio processing (AGC / noise suppression / high-pass where available)
  - Optional local enhancement (e.g., DeepFilterNet) **only when audio is degraded**
  - Lightweight audio diagnostics (RMS, noise/SNR proxy, silence probability, clipping)
  - Conservative decisioning: enhancement only when it improves quality
- Feature flag gating for all enhancement paths

## Out of Scope
- Full offline LLM post-processing
- Full multi-language model browser or advanced model import UI
- Bundling large Whisper models in the installer by default
- Double-pass Whisper (baseline + enhanced) selection

## Dependencies
- Streaming pipeline (Epic 8) for fallback triggers
- Long-form file transcription (Epic 6) if local is required
- Onboarding flow (Epic 11) for local model opt-in

## Risks
- High CPU usage on low-end devices
- Lower transcription quality vs cloud
- Onboarding friction due to large model downloads
- Disk usage pressure / cleanup edge cases
- Audio enhancement artifacts if applied unnecessarily

## Success Criteria
- Fallback activates automatically when cloud fails
- Users can complete dictations offline with clear messaging
- No perceptible degradation on clean audio
- Improved quality on noisy/whisper cases without added average latency
- Local model install is optional, reliable, and completes without blocking onboarding

## KPIs
- Fallback activation rate
- User-reported quality in fallback mode
- % of dictations using enhancement
- Error rate / correction rate on noisy samples
- Local model install completion rate
- % of minutes transcribed locally vs cloud (cost avoided)

## Shard Plan (Stories)
- `docs/stories/13.1-local-vad-and-asr-path.md` — local VAD/ASR path + onboarding presets + model manager
- `docs/stories/13.2-fallback-ui-and-safeguards.md` — UI indicators + fallback safeguards
- `docs/stories/13.3-audio-enhancement-layer.md` — adaptive local audio enhancement (no double-pass)
- `docs/stories/13.4-local-enhancement-model-integration.md` — integrate local enhancement model + gating

## Anti-Duplication Notes
- Streaming protocol and transport are Epic 8
- Upload flow and exports are Epic 6
