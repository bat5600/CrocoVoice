# Epic 13 — Local Inference Fallback

## Status
Draft

## Story
**As a** privacy-focused user,
**I want** an optional local inference path,
**so that** I can dictate without sending audio to the cloud.

## Acceptance Criteria
1. Local inference can be enabled when supported hardware is detected.
2. If local inference fails, the system falls back to cloud ASR.
3. The UI clearly shows which inference path is active.
4. Local inference respects existing dictionary and personalization rules.

## Tasks / Subtasks
- [ ] Integrate ONNX runtime or VAD fallback path (AC: 1)
- [ ] Implement safe fallback to cloud ASR (AC: 2)
- [ ] Add UI indicator for inference path (AC: 3)
- [ ] Ensure dictionary/personalization runs after local ASR (AC: 4)

## Dev Notes
- Keep this feature optional and gated by a feature flag.
- Avoid shipping large models unless explicitly configured.

### Testing
- Manual: toggle local inference, verify fallback, compare outputs.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-24 | v0.1 | New epic for local inference fallback | PO |

## Dev Agent Record
### Agent Model Used
TBD

### Debug Log References
N/A

### Completion Notes List
- TBD

### File List
- TBD

## QA Results
