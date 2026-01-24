# CrocoVoice Brownfield Enhancement PRD

## Intro Project Analysis and Context

### Existing Project Overview

#### Analysis Source
- User-provided documentation: `docs/ideas/CODEBASE_AUDIT.md` (2026-01-24) and `docs/ideas/code-review-senior.md` (2026-01-23)
- IDE-based documentation review: `docs/architecture/tech-stack.md`, `docs/architecture/source-tree.md`, `docs/architecture/coding-standards.md`

#### Current Project State
CrocoVoice is a local-first Electron dictation app. The widget renderer records audio, the main process transcribes via OpenAI Whisper, optionally post-processes via GPT, applies a dictionary, persists to local SQLite, and pastes via clipboard/typing. Supabase auth and sync are optional, with Edge Functions handling quota and Stripe billing.

### Available Documentation Analysis
- [x] Tech Stack Documentation
- [x] Source Tree/Architecture
- [x] Coding Standards
- [ ] API Documentation
- [ ] External API Documentation
- [ ] UX/UI Guidelines
- [x] Technical Debt Documentation
- [ ] Other:

Note: Using existing project analysis from the two audit documents and docs/architecture/*.

### Enhancement Scope Definition

#### Enhancement Type
- [ ] New Feature Addition
- [ ] Major Feature Modification
- [ ] Integration with New Systems
- [x] Performance/Scalability Improvements
- [ ] UI/UX Overhaul
- [ ] Technology Stack Upgrade
- [x] Bug Fix and Stability Improvements
- [x] Other: Security Hardening & Data Integrity

#### Enhancement Description
Stabilize and harden the current CrocoVoice codebase by addressing critical security flaws, data-integrity risks in sync, and correctness/performance footguns. This work introduces minimal maintainability improvements (tests, modularization, de-duplication) to prevent regressions while preserving existing product behavior.

#### Impact Assessment
- [ ] Minimal Impact (isolated additions)
- [ ] Moderate Impact (some existing code changes)
- [x] Significant Impact (substantial existing code changes)
- [ ] Major Impact (architectural changes required)

### Goals and Background Context

#### Goals
- Eliminate critical security vulnerabilities in Edge Functions auth and renderer DOM handling.
- Prevent data loss/drift in sync and add safe user scoping.
- Remove known blocking/locking bugs and reduce race conditions in paste flow.
- Improve performance hot paths (audio IPC, DB queries) without changing UX.
- Establish baseline automated tests for core dictation and sync behavior.
- Reduce maintenance risk by splitting the main-process monolith and de-duplicating shared logic.

#### Background Context
Two recent audits (2026-01-23 and 2026-01-24) identified critical auth bypass in Edge Functions, renderer XSS via innerHTML, sync correctness risks (pagination, cursor skew, delete propagation), and stability/performance issues. These issues materially increase security exposure, data-integrity risk, and maintenance cost, making a stabilization effort necessary before further feature expansion.

### Change Log
| Change | Date | Version | Description | Author |
| --- | --- | --- | --- | --- |
| Initial draft | 2026-01-24 | v0.1 | PRD draft from audits and existing docs | John |

## Requirements

These requirements are based on my understanding of the existing system and the two audits. Please review carefully and confirm they align with the project's reality.

### Functional
1. FR1: Edge Functions must verify Supabase JWT signatures using Supabase auth verification (or JWKS), rejecting forged tokens.
2. FR2: Stripe checkout/portal functions must reuse the shared auth verifier and remove ad-hoc JWT parsing.
3. FR3: All renderer UI elements that display external/user-controlled strings must avoid innerHTML and use safe DOM APIs.
4. FR4: External navigation must be blocked in Electron windows; external links must open via shell.openExternal.
5. FR5: Sync purge operations must be scoped to the authenticated user as defense in depth.
6. FR6: Sync must support pagination and server-based cursors to avoid missing rows and clock-skew drift.
7. FR7: Sync must support delete propagation (tombstones or reconciliation) for offline deletes.
8. FR8: Audio payload IPC must avoid Array-from JSON conversion and use native ArrayBuffer transfer.
9. FR9: Main-process recording transition lock must be exception-safe (try/finally) to avoid permanent lockout.
10. FR10: Paste flow must be serialized to prevent overlapping clipboard writes and race conditions.
11. FR11: Local SQLite must add indexes for hot queries and purges without changing schema semantics.
12. FR12: Settings updates must avoid unnecessary bulk writes when a single key changes.
13. FR13: Preload IPC listeners must support cleanup to prevent duplicate handlers during reloads.
14. FR14: Core shared helpers (word count, subscription logic, retention logic) must be de-duplicated into a shared module.
15. FR15: Main-process code must be modularized into smaller units without changing external behavior.
16. FR16: A minimal automated test suite must cover recording state transitions, quota logic, dictionary application, and sync cursor behavior.
17. FR17: Supabase schema and RLS for synced tables must be represented in migrations to allow deterministic backend setup.

### Non Functional
1. NFR1: Security fixes must not introduce new privileged renderer capabilities or widen IPC surface area.
2. NFR2: Performance must not regress; audio processing latency should improve for large recordings.
3. NFR3: Reliability must improve; no known blocking states should remain in recording flow.
4. NFR4: Sync changes must preserve existing data and avoid destructive migrations.
5. NFR5: Test suite must run locally without external services (mocked Supabase/OpenAI).
6. NFR6: The existing user experience and UI layout must remain visually consistent.

### Compatibility Requirements
1. CR1: Existing IPC APIs and renderer behaviors remain compatible with current UI.
2. CR2: Database schema changes are additive and backward compatible.
3. CR3: UI styling and interaction patterns remain consistent with current app.
4. CR4: Integration with Supabase, SQLite, and OpenAI must maintain current behavior and config expectations.

## Technical Constraints and Integration Requirements

### Existing Technology Stack
**Languages**: JavaScript (ES standard, CommonJS)
**Frameworks**: Electron ^35.7.5, Node.js 16+
**Database**: SQLite (local), Postgres via Supabase (remote)
**Infrastructure**: Supabase Edge Functions (Deno), Electron desktop app
**External Dependencies**: OpenAI (Whisper + Chat), Supabase JS, Stripe, @nut-tree-fork/nut-js, robotjs fallback

### Integration Approach
**Database Integration Strategy**: Add SQLite indexes with CREATE INDEX IF NOT EXISTS. Add Supabase migrations for missing tables and RLS policies; keep all schema changes additive.
**API Integration Strategy**: Centralize Edge Function auth verification in shared helper and update Stripe and quota functions to use it.
**Frontend Integration Strategy**: Replace innerHTML use with DOM construction and textContent; add navigation/window-open guards in main process.
**Testing Integration Strategy**: Add a lightweight unit-test harness (minimal new deps). Mock external APIs and keep tests focused on core logic modules.

### Code Organization and Standards
**File Structure Approach**: Keep root entry points (main.js, renderer.js, preload.js, sync.js, store.js) and introduce small root-level modules with clear prefixes (e.g., main-auth.js, main-recording.js, utils.js) to minimize churn.
**Naming Conventions**: camelCase, lower-case filenames.
**Coding Standards**: Follow existing code style, avoid large-format changes. CommonJS only.
**Documentation Standards**: Update README/PRD or relevant docs when behaviors change; keep comments minimal and focused.

### Deployment and Operations
**Build Process Integration**: No change to existing build pipeline; modifications should remain compatible with current Electron packaging.
**Deployment Strategy**: No behavioral flags required; release as normal app update.
**Monitoring and Logging**: Add minimal error reporting hook if feasible (or document as a follow-up).
**Configuration Management**: Use existing dotenv pattern; ensure no secrets logged.

### Risk Assessment and Mitigation
**Technical Risks**: Edge Function auth changes could break existing token flows; sync changes may reveal RLS or schema gaps.
**Integration Risks**: Refactoring main.js could introduce regressions if behavior changes.
**Deployment Risks**: Supabase schema updates might affect existing data if not additive or if RLS is misconfigured.
**Mitigation Strategies**: Add targeted tests, stage changes in small stories, use feature-flag-like rollout where possible, and keep schema changes additive with backfill scripts if needed.

## Epic and Story Structure

**Epic Structure Decision**: Single epic. Rationale: the fixes are tightly coupled under a stabilization theme (security, sync integrity, correctness, performance, maintainability) and should be sequenced to minimize risk while preserving existing behavior.

## Epic 1: CrocoVoice Stabilization and Security Hardening

**Epic Goal**: Secure and stabilize the current CrocoVoice codebase by eliminating critical vulnerabilities, improving sync integrity, and reducing maintenance risk without changing the user experience.

**Integration Requirements**: Maintain current dictation flow, IPC surface, Supabase connectivity, and local-first behavior; all changes must be additive and backward compatible.

### Story 1.1 Fix Edge Functions Authentication and Token Handling
As a user,
I want server-side authentication to be properly verified,
so that unauthorized access to quota and billing endpoints is prevented.

#### Acceptance Criteria
1. Only JWTs with valid signatures are accepted by Edge Functions.
2. Stripe checkout/portal functions reuse shared auth verification logic.
3. Access tokens are not sent in request bodies when Authorization headers are present.
4. Regression tests or local validation steps confirm no auth bypass.

#### Integration Verification
1. IV1: Existing quota and billing flows still work for valid users.
2. IV2: Unauthorized requests are rejected with clear errors.
3. IV3: No changes required to client configuration or keys.

### Story 1.2 Harden Renderer and Navigation Security
As a user,
I want renderer UIs to be safe from script injection,
so that the app cannot be compromised by untrusted strings.

#### Acceptance Criteria
1. All user- or device-controlled strings are rendered via textContent or DOM APIs.
2. External links cannot open in Electron windows; they open in the OS browser.
3. The dashboard and widget remain visually and behaviorally unchanged.

#### Integration Verification
1. IV1: Dictation UI, toasts, and settings display correctly.
2. IV2: Link clicks open externally and do not navigate the Electron window.
3. IV3: IPC APIs are unchanged from the renderer perspective.

### Story 1.3 Fix Sync Integrity and User Scoping
As a user,
I want sync to be reliable and user-scoped,
so that my data is consistent and protected.

#### Acceptance Criteria
1. Remote purge operations are scoped by user_id as defense in depth.
2. Sync uses pagination for pull operations to avoid missing rows.
3. Sync cursor is based on server timestamps or max updated_at seen, not local clock.
4. Delete propagation is supported (tombstones or reconciliation) for offline deletes.

#### Integration Verification
1. IV1: Existing synced tables still round-trip correctly.
2. IV2: Large datasets sync without missing records.
3. IV3: No user can affect another user's remote data.

### Story 1.4 Stabilize Core Recording and Paste Flow
As a user,
I want recording and paste to be reliable,
so that the app never gets stuck or corrupts my clipboard.

#### Acceptance Criteria
1. transitionLock is always released via try/finally.
2. Paste operations are serialized to prevent overlap and clipboard stomping.
3. Tray menu reflects recording state accurately.
4. Dotenv is loaded before any config reads to avoid undefined values.

#### Integration Verification
1. IV1: Start/stop recording works repeatedly without app restart.
2. IV2: Clipboard contents are restored correctly after paste.
3. IV3: Existing hotkeys and tray controls still work.

### Story 1.5 Improve Performance Hot Paths
As a user,
I want faster processing for long recordings and large history lists,
so that the app remains responsive over time.

#### Acceptance Criteria
1. Audio IPC sends ArrayBuffer directly without Array-from JSON conversion.
2. SQLite indexes are added for history/notes/dictionary/styles sorting and purge queries.
3. Settings writes avoid bulk upserts when only one key changes.
4. Dictionary lookups are cached or optimized without altering results.

#### Integration Verification
1. IV1: Dictation latency improves for longer recordings.
2. IV2: History and notes lists load quickly as data grows.
3. IV3: Settings behavior remains unchanged.

### Story 1.6 Reduce Maintenance Risk and Add Tests
As a developer,
I want the core logic modularized and covered by tests,
so that regressions are less likely and changes are safer.

#### Acceptance Criteria
1. main.js responsibilities are split into focused modules without changing runtime behavior.
2. Shared utilities are de-duplicated (word count, subscription logic, retention logic).
3. A minimal unit-test suite exists for recording state transitions, quota logic, dictionary application, and sync cursor logic.
4. Preload IPC listeners provide cleanup mechanisms to avoid duplicate handlers.

#### Integration Verification
1. IV1: All existing features work after refactor without behavior changes.
2. IV2: Tests run locally and pass consistently.
3. IV3: No new dependencies require runtime changes for end users.

