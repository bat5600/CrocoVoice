# Epic 6 — Long-Form Uploads and Exports

## Status
Draft

## Goal
Enable local transcription of long audio files with clear progress and reliable exports.

## User Value
- Transcribe meetings or recordings without live dictation
- Keep data local by default
- Export outputs for reuse in other tools

## In Scope
- File upload + processing status + cancel
- Local processing by default (no upload)
- Opt-in cloud fallback (explicit user action)
- Save results in Notes with file metadata
- Exports v1: txt/md/json with optional timestamps

## Out of Scope
- Auto-join meetings or live call capture
- Advanced diarization or speaker labeling
- Enterprise archival workflows

## Dependencies
- Local inference/VAD fallback (Epic 13) or local Whisper availability
- History storage and metadata (Epic 4.5)
- Privacy controls (Epic 5)

## Risks
- Large file handling and memory pressure
- Slow processing on low-end devices
- Privacy concerns if cloud fallback is confusing

## Success Criteria
- Users can upload and see progress without app instability
- Completed transcripts are stored and exportable
- Local-only processing is the default and obvious

## KPIs
- Upload success rate
- Average processing time by file length
- Export usage rate

## Shard Plan (Stories)
- `docs/stories/6.1-upload-flow-and-status.md` — upload + progress + local processing
- `docs/stories/6.2-exports-v1.md` — export formats and timestamps

## Anti-Duplication Notes
- Streaming dictation is Epic 8
- CrocOmni conversation summaries are Epic 12
- Telemetry pipeline is Epic 10
