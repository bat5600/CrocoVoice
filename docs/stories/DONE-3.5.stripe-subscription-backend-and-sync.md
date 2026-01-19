# Stripe Subscription Backend and Sync - Brownfield Addition

## User Story
As a user,
I want a reliable PRO purchase and subscription management flow,
So that my access is updated automatically and persists across sessions.

## Status
Done

## Story Context

**Existing System Integration:**

- Integrates with: Supabase auth + Stripe Checkout/Portal + webhook updates
- Technology: Electron (main/renderer), JS, Supabase Edge Functions (recommended), Stripe API
- Follows pattern: CTA button -> web flow -> status badge -> sync
- Touch points: dashboard subscription UI, quota gating, sync service, Supabase user settings

## Missing Pieces (Current Gaps)

- No backend endpoint to create/reuse Stripe Customer or Checkout/Portal sessions.
- No webhook handler to persist subscription status in Supabase.
- No authoritative subscription data source in Supabase (only local settings).
- No deterministic mapping between Supabase user id/email and Stripe customer.
- No professional validation (webhook signature, idempotency, event replay).

## Acceptance Criteria

**Functional Requirements:**

1. "Passer Pro" calls a backend endpoint that returns a Stripe Checkout URL; the app opens it.
2. Stripe customer is created or reused deterministically for the authenticated user (Supabase user id/email).
3. Stripe webhook updates subscription status in Supabase on checkout/subscription events.
4. The app displays PRO immediately after the webhook update (manual "Actualiser" or auto-refresh).
5. "Gerer mon abonnement" opens the Stripe customer portal via backend.
6. No Stripe secret keys are exposed to the Electron app.

**Integration Requirements:**
7. Subscription state is persisted in Supabase and survives app restarts.
8. Quota gating uses subscription status (`active` or `trialing`) to unlock unlimited dictation.
9. Login/signup/reset flows remain unchanged.

**Quality Requirements:**
10. Manual verification steps are documented and executed.
11. Webhook signature verification is enforced.
12. Idempotency is handled for repeated webhook events.

## Architecture Decision (Recommended)

- **Backend:** Supabase Edge Functions (auth via JWT, secrets in Supabase).
- **Storage:** Dedicated `subscriptions` table in Supabase (cleaner than `user_settings`).
- **Client Sync:** SyncService reads subscription record and stores a local `settings.subscription` snapshot.

If you prefer faster delivery, fallback to storing `subscription` inside `user_settings` and reuse the existing sync path.

## Technical Notes

- **Supabase table (recommended):**
  - `subscriptions` (PK: `user_id`)
  - Fields: `user_id`, `stripe_customer_id`, `status`, `plan`, `price_id`,
    `current_period_end`, `updated_at`
  - RLS: user can `select` own row; only service role can `insert/update`.

- **Stripe endpoints (Edge Functions):**
  - `POST /stripe/checkout`
    - Auth required (Supabase JWT)
    - Lookup `subscriptions.user_id`
    - If missing `stripe_customer_id`, create customer with metadata
    - Create Checkout Session with `customer`, `client_reference_id`
    - Return `url`
  - `POST /stripe/portal`
    - Auth required
    - Create portal session with `customer`
    - Return `url`
  - `POST /stripe/webhook`
    - Verify signature
    - Handle `checkout.session.completed`,
      `customer.subscription.created|updated|deleted`
    - Upsert subscription row

- **App changes:**
  - Replace direct `STRIPE_CHECKOUT_URL` / `STRIPE_PORTAL_URL` usage with backend calls.
  - Add a subscription refresh path to read Supabase source-of-truth.
  - Use `status in {active, trialing}` as PRO entitlement.

## Tasks / Subtasks

1. **Supabase Schema**
   - Create `subscriptions` table + RLS policies.
   - Add SQL migration file or documented setup steps.

2. **Edge Functions (Backend)**
   - Implement `stripe/checkout`, `stripe/portal`, `stripe/webhook`.
   - Store Stripe secret key + webhook secret in Supabase secrets.
   - Add idempotency guard (event id tracking or upsert by timestamp).

3. **Sync + Local State**
   - Extend `SyncService` to fetch `subscriptions` and store `settings.subscription`.
   - Update `dashboard:data` payload to include subscription state.

4. **App UI + Gating**
   - Ensure dashboard shows plan status from Supabase-driven state.
   - Ensure quota uses PRO entitlement (`active`/`trialing`) to unlock unlimited.

5. **Documentation**
   - Update README with required Stripe env/config.
   - Document webhook setup + required Stripe events.

6. **Manual Verification**
   - Checkout success path -> PRO status appears.
   - Portal access works.
   - Subscription cancellation -> PRO revoked.
   - Webhook replay/idempotency test.

## Definition of Done

- [x] Backend endpoints deployed and authenticated
- [x] Webhook signature verification in place
- [x] Subscription status stored in Supabase and synced to app
- [x] PRO access depends on subscription status
- [x] Manual verification checklist completed
- [x] No regression in auth/sync/quotas

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Subscription mismatch between Stripe and app state.
- **Mitigation:** Webhook as source of truth + idempotent upserts.
- **Rollback:** Disable checkout CTA and keep FREE mode only.

**Compatibility Verification:**

- [x] No breaking changes to existing APIs
- [x] Database changes are additive only
- [x] UI changes follow existing patterns
- [x] Performance impact is negligible

## Validation Checklist

**Scope Validation:**

- [x] Story can be completed in one development session
- [x] Integration approach is straightforward
- [x] Follows existing patterns exactly
- [x] No design or architecture work required

**Clarity Check:**

- [x] Story requirements are unambiguous
- [x] Integration points are clearly specified
- [x] Success criteria are testable
- [x] Rollback approach is simple

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-22 | v0.1 | Creation de la story 3.5 | Dev |
| 2026-01-22 | v0.2 | Stripe backend + webhook + sync | Dev |

## Dev Agent Record
### Agent Model Used
GPT-5

### Debug Log References
N/A

### Completion Notes List
- Supabase schema adds `subscriptions` + `stripe_events` with RLS on subscriptions.
- Edge Functions: `stripe-checkout`, `stripe-portal`, `stripe-webhook` with signature verification and idempotency.
- SyncService pulls subscription state into `settings.subscription` and app UI.
- App checkout/portal now call Edge Functions with fallback hosted URLs.

### File List
- supabase/schema.sql
- supabase/functions/_shared/cors.ts
- supabase/functions/_shared/env.ts
- supabase/functions/_shared/stripe.ts
- supabase/functions/_shared/supabase.ts
- supabase/functions/stripe-checkout/index.ts
- supabase/functions/stripe-portal/index.ts
- supabase/functions/stripe-webhook/index.ts
- sync.js
- main.js
- README.md
- .env.example

## QA Results
