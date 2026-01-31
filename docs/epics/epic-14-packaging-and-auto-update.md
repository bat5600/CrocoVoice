# Epic 14 — Packaging & Auto-Update (Brownfield Enhancement)

## Epic Goal
Deliver a signed, distributable desktop build and a safe auto-update flow so CrocoVoice can ship externally with minimal user friction and reliable rollback.

## Epic Description

**Existing System Context:**
- Current relevant functionality: Electron desktop app (main/renderer split) with local SQLite + optional Supabase sync; no documented packaging/auto-update pipeline yet.
- Technology stack: Electron ^35.7.5, Node (20), JavaScript (CommonJS), sqlite3, Supabase JS.
- Integration points: Electron main process, build scripts/CI, release artifact hosting, signing/notarization, update feed/manifest.

**Enhancement Details:**
- What's being added/changed: Packaging tool selection/config, signed installers, update feed/manifest, in-app update UX, and a rollback/runbook.
- How it integrates: Add build tooling to produce platform installers; integrate auto-update checks in the main process with a minimal UI prompt; publish releases to a versioned channel.
- Success criteria: Users can install on target OS, receive verified updates, and recover if an update fails.

## Stories
1. **Story 14.1:** `docs/stories/14.1-windows-packaging-and-signing.md` — Windows-first packaging tool selection + signed build artifacts (app id, versioning).
2. **Story 14.2:** `docs/stories/14.2-auto-update-service-and-ux.md` — Auto-update service + in-app update prompt (check, download, apply, verify).
3. **Story 14.3:** `docs/stories/14.3-release-pipeline-and-rollback.md` — Release pipeline + update feed + rollback runbook (stable/beta channel optional).

## Compatibility Requirements
- [ ] Existing APIs remain unchanged
- [ ] Database schema changes are backward compatible
- [ ] UI changes follow existing patterns
- [ ] Performance impact is minimal

## Risk Mitigation
- **Primary Risk:** Update failures or signing issues break installs and erode trust.
- **Mitigation:** Signed builds, staged rollout or manual update fallback, checksum verification, and a documented rollback path.
- **Rollback Plan:** Revert to last signed release via update feed pin + manual installer distribution.

## Definition of Done
- [ ] All stories completed with acceptance criteria met
- [ ] Existing functionality verified through testing
- [ ] Integration points working correctly
- [ ] Documentation updated appropriately
- [ ] No regression in existing features

---

**Story Manager Handoff:**
"Please develop detailed user stories for this brownfield epic. Key considerations:

- This is an enhancement to an existing system running Electron (JS CommonJS) with main/renderer split.
- Integration points: Electron main process, build tooling/CI, signing/notarization, update feed/manifest hosting.
- Existing patterns to follow: Minimal UI changes, local-first behavior, no schema changes unless required.
- Critical compatibility requirements: Signed builds, backward-compatible updates, minimal perf impact.
- Each story must include verification that existing functionality remains intact

The epic should maintain system integrity while delivering a safe, low-friction packaging + auto-update pipeline."
