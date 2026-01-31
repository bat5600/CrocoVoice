# CrocoVoice — M0 “DONE” Audit Template

Use this template to turn “DONE*” into verified DONE for Epics 1–3.

## Metadata

- Date: 2026-01-31
- Reviewer: Baptiste
- App version / git SHA: 01a511b
- OS + version: Windows 11
- Microphone device: Integrated
- Network: online
- `.env` profile used: with Supabase /  Stripe
- Status: Done

## Evidence Pack (attach links/screenshots/log snippets)

- Screen recording of a successful dictation end-to-end: Captured offline (not attached)
- Screenshot: dashboard quota panel: Captured offline (not attached)
- Screenshot: subscription panel + buttons: Captured offline (not attached)
- Screenshot: paywall (quota blocked): Captured offline (not attached)
- Logs: error case + recovery (timeout/network) without stuck states: Captured offline (not attached)

## Regression Checklist (tick when verified)

### Dictation pipeline
- [x] Hotkey start/stop works and cannot be double-triggered
- [x] Recording → processing → delivered states are consistent
- [x] No UI freeze during OpenAI calls

### Delivery robustness
- [x] Typing works when permissions are granted
- [x] If typing fails, paste fallback is attempted (where supported)
- [x] If paste fails, clipboard fallback happens and user is notified
- [x] “Typing guard” blocks writing to the wrong window if focus changes during processing (warninr-only, not real enforcment for now)

### Quota
- [x] Weekly quota remaining decreases based on final text word count
- [x] Restart app → quota is still correct (no fake 1000 on boot)
- [x] Reset label is correct (UTC boundary) and matches the implemented policy

### Paywall
- [x] At 0 words, paywall shows only when the user attempts dictation (just-in-time)
- [x] Dismiss behavior is acceptable (user can still browse non-dictation areas)
- [x] “Go to dashboard” works from paywall UI

### Billing
- [x] “Upgrade” opens checkout and shows loading state
- [x] “Manage subscription” opens portal and shows loading state
- [x] Subscription refresh/activation flow is understandable to the user

### Auth
- [x] Login works (online, Supabase configured)
- [x] Logout works (if supported)
- [x] Forgot password flow works via `docs/signup.html` (reset email → set password)
NOTES : the email are not yet personnalised

### Offline behavior (declare expected behavior first)
- [x] With network disabled, the app behavior matches the chosen quota mode (`local/hybrid/server`)
- [x] Errors are clear and recoverable; app returns to stable idle state

## Accepted Risks (explicit sign-off)

- Client-side quota/entitlement bypass risk accepted for M0: Yes
- Known issues list:
  - Reset password emails are not personalized yet.

## Decision

- [x] VERIFIED DONE (Epics 1–3)
- [ ] NOT DONE (must fix items listed above)
