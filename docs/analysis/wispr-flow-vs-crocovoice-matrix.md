# Wispr Flow vs CrocoVoice - Feature Comparison Matrix (2026-01-31)

## Sources
- `docs/analysis/fakewispr-vs-crocovoice.md` (FakeWispr/Wispr Flow analysis; inferred from bundles/assets/migrations)
- `docs/prd.md` (CrocoVoice product targets and scope)
- `docs/architecture.md` and `docs/architecture/tech-stack.md` (current stack context)

## Legend
- **Observed** = evidence from analysis (bundles/assets/migrations)
- **Planned** = listed in CrocoVoice PRD, not necessarily implemented yet
- **Current** = mentioned as existing in CrocoVoice docs/architecture

## Matrix

| Capability | Wispr Flow (FakeWispr) | CrocoVoice |
| --- | --- | --- |
| Desktop stack | Electron Forge + webpack (Observed) | Electron ^35.7.5, Node 20, JS CommonJS (Current) |
| Packaging / auto-update | Packaging via Forge; auto-update not explicit in analysis (Observed) | Packaging/auto-update plan pending; new Epic 14 (Planned) |
| Target platform priority | Multi-platform desktop, strong Windows evidence (Observed) | macOS first in brief; Windows next (Planned) |
| Audio capture | AudioWorklet with low-latency chunking (Observed) | AudioWorklet required by PRD (Planned) |
| Streaming transport | WebSocket and gRPC flags; streaming text (Observed) | WebSocket streaming + file upload fallback (Planned) |
| Opus encoding | Flags suggest Opus + MsgPack (Observed) | Optional Opus encoding in PRD (Planned) |
| Context capture | App/URL/screenshot/AX/textbox fields (Observed) | App/window/URL required; AX/textbox/screenshot opt-in (Planned) |
| Local data model richness | History stores raw/formatted/edited + metrics + context (Observed) | PRD requires multi-stage text + quality metrics (Planned) |
| Dictionary / snippets | Dictionary with usage stats + snippets (Observed) | Dictionary v2 + snippets in PRD (Planned) |
| Notes | Notes table present (Observed) | Notes in Epic 4 (Planned) |
| Multi-window UI | Hub + status bubble + context menu (Observed) | Hub + status bubble + context menu (Planned; Epic 9) |
| Diff viewer | Before/after polish diff (Observed) | Diff viewer in PRD (Planned; Epic 9) |
| Personalization / tone match | Tone match pairs + style detection hints (Observed) | Styles + tone match in PRD (Planned; Epic 5) |
| Feature flags | Extensive flags in bundles (Observed) | Feature flags in PRD (Planned; Epic 10) |
| Telemetry / observability | Sentry/PostHog/Segment; latency + divergence metrics (Observed) | Telemetry + quality metrics in PRD (Planned; Epic 10) |
| Notifications inbox | Remote notifications table (Observed) | Notifications inbox in PRD (Planned; Epic 10) |
| Insights / wrapped | Assets indicate usage insights and "Wrapped" (Observed) | Insights + Wrapped in PRD (Planned; Epic 11) |
| Onboarding flow | Assets suggest onboarding animations and flow (Observed) | Multi-step onboarding in PRD (Planned; Epic 11) |
| Assistant / Flow Lens | Flow lens tables and assets (Observed) | CrocOmni assistant in PRD (Planned; Epic 12) |
| Local inference | ONNX runtime assets suggest local inference (Observed) | Local inference fallback in PRD (Planned; Epic 13) |
| Uploads / exports | Not explicit in analysis (Unknown) | Audio upload + exports in PRD (Planned; Epic 6) |
| Diagnostics | Logs + profiling flags (Observed) | Diagnostics in PRD (Planned; Epic 7) |
| Sync | Supabase JS present (Observed) | Optional Supabase sync (Current) |

## Notes
- Wispr Flow capabilities are inferred from packaged artifacts; some items may be incomplete or hidden.
- CrocoVoice column reflects current documentation and PRD goals, not guaranteed implementation status.
