# CrocoVoice — MVP Readiness Review (M0)

Date: 2026-01-20  
Reviewer: PO  
Scope: Epics 1–3 (as marked `DONE` in `docs/prd.md`)

## Executive Summary

Overall status: **PASS with CONCERNS** (MVP appears usable end-to-end, but a few items should be validated via a short manual regression pass and clarified for hardening).

Key takeaways:
- Core dictation pipeline has explicit state management, retries/timeouts, and delivery guardrails.
- Dashboard includes premium UX patterns plus quota/subscription surfaces and loading states.
- Quota/paywall + Stripe checkout/portal wiring exists and is user-visible.
- The biggest remaining risks are **entitlement authority** (client-side vs server), **quota bypass** (depending on mode), and **lack of automated regression coverage**.

## Evidence (what I verified)

### Epic 1 — Stabilization & Core Reliability
- State machine + debouncing: `main.js` defines `RecordingState` and `ACTION_DEBOUNCE_MS`.
- OpenAI error handling: retries + timeout wrappers (`OPENAI_*_TIMEOUT_MS`, `OPENAI_MAX_RETRIES`) in `main.js`.
- Delivery guardrails: active window guard before paste/typing (`assertTypingTargetStillActive`) in `main.js`.
- Local persistence: SQLite store serializes access (`this.db.serialize()`), and settings/history/notes exist in `store.js`.

### Epic 2 — Premium Dashboard UX
- Dashboard has premium UI structure + components and dedicated subscription/quota panels: `dashboard.html`.
- UX quality-of-life: loading labels/disable behavior for slow actions (e.g., billing) via `setButtonLoading()` in `dashboard.js`.

### Epic 3 — Freemium, Billing, and Auth Flows
- Weekly quota settings + modes: `WEEKLY_QUOTA_WORDS`, `QUOTA_MODE`, cache TTL and local quota writes in `main.js`.
- Quota gate UI on the widget: `quota:blocked` handling and gate UI in `renderer.js`.
- Subscription UI and refresh/polling: `dashboard.js` has checkout trigger + activation polling.
- Forgot password flow exists in the web signup page: `docs/signup.html` (reset email + set password flow).

## MVP Readiness Gate (M0) — PASS/CONCERNS

### PASS (looks implemented)
- End-to-end dictation pipeline works conceptually (record → STT → post-process → deliver).
- Clear user-visible error handling for the widget and dashboard surfaces.
- Weekly quota appears persisted (local store) and displayed on dashboard.
- Stripe checkout/portal entrypoints exist and include loading indicators.

### CONCERNS (validate / tighten before calling it “ship-ready”)
1. **Entitlement source of truth**
   - Current subscription handling relies on local settings and client-visible signals; ensure the “active PRO” state cannot be faked trivially if that matters for your business model.
   - Recommendation: keep MVP as-is if acceptable, but plan a server-backed entitlement (Supabase function + Stripe webhooks) in the next milestone.

2. **Quota enforcement mode**
   - `QUOTA_MODE` supports `local | hybrid | server`. The real behavior depends on env + functions availability.
   - Recommendation: explicitly document which mode is MVP-default and how to operate offline vs authenticated.

3. **No automated regression harness**
   - Manual testing is fine for MVP, but the surface area (Electron + OS permissions + integrations) can regress silently.
   - Recommendation: add a small “smoke checklist” and run it before every release; later add unit tests for pure logic (quota math, reset time, formatting).

4. **Docs consistency**
   - Root `README.md` appears unrelated (Supabase CLI content). This is a contributor onboarding risk.

## Manual Regression Checklist (recommended)

1. Dictation: hotkey start/stop; no double-start; waveform visible; processing state; final text delivered.
2. Delivery fallback: simulate typing failure (permission off) → confirm clipboard fallback + clear message.
3. Quota: verify remaining updates after dictation; restart app → quota remains correct; reset label correct.
4. Paywall: hit 0 words → paywall shown when dictation attempted; dismiss behavior; “go dashboard” works.
5. Billing: “Upgrade” opens checkout; “Manage subscription” opens portal with loading; refresh subscription works.
6. Auth: login/logout; forgot password flow in `docs/signup.html` (reset email + set password).
7. Offline: disable network → ensure app fails gracefully and remains usable for non-server modes.

## Recommendations (next actions)

1. Lock M0 definition: confirm what “MVP Ready” means (acceptable bypass risk? offline mode?).
2. Create sharded stories for M1 (Epics 4 + 7) using `docs/prd.md` shard plan.
3. Decide entitlement strategy for M2+: keep client-only vs add server-backed verification.
