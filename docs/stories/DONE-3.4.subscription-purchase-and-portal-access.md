# Subscription Purchase and Portal Access - Brownfield Addition

## Status
Done

## User Story
As a user,
I want to subscribe to PRO and manage my subscription,
So that I can access unlimited dictation and control billing.

## Story Context

**Existing System Integration:**

- Integrates with: Supabase auth + Stripe Checkout/Portal (web)
- Technology: Electron (main/renderer), JS, Supabase JS, Stripe
- Follows pattern: existing CTA buttons and status messaging
- Touch points: upgrade CTA, subscription status UI, user identity mapping

## Acceptance Criteria

**Functional Requirements:**

1. Upgrade CTA redirects the user to a web Stripe Checkout session for PRO.
2. Successful purchase immediately grants PRO access (unlimited dictation).
3. "Gerer mon abonnement" opens the Stripe customer portal on the web.

**Integration Requirements:**
4. Stripe customer is linked to the authenticated user (Supabase user id/email) and reused on future sessions.
5. Subscription status is displayed in the UI and persisted across restarts.
6. Login/signup/reset flows remain functional and unchanged.

**Quality Requirements:**
7. Change is covered by appropriate tests or manual verification steps.
8. Documentation is updated if needed (PRD/story refs).
9. No regression in existing functionality verified.

## Technical Notes

- **Integration Approach:** Redirect to web-hosted Stripe Checkout/Portal pages; never expose Stripe secret keys client-side.
- **Existing Pattern Reference:** Current UI CTA handling and Supabase session usage.
- **Key Constraints:** Stripe customer mapping must be deterministic for a given user.

## Definition of Done

- [x] Functional requirements met
- [x] Integration requirements verified
- [x] Existing functionality regression tested
- [x] Code follows existing patterns and standards
- [x] Tests pass (existing and new)
- [x] Documentation updated if applicable

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Mismatch between Stripe subscription status and app access.
- **Mitigation:** Verify entitlement on startup and after checkout return.
- **Rollback:** Disable upgrade CTA and fall back to FREE-only access.

**Compatibility Verification:**

- [x] No breaking changes to existing APIs
- [x] Database changes (if any) are additive only
- [x] UI changes follow existing design patterns
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
| 2026-01-15 | v0.1 | Creation de la dev story | PM |
| 2026-01-22 | v0.2 | Checkout/portal + statut abonnement UI | Dev |

## Dev Agent Record
### Agent Model Used
GPT-5

### Debug Log References
N/A

### Completion Notes List
- Checkout/portal Stripe exposes `STRIPE_CHECKOUT_URL` + `STRIPE_PORTAL_URL` (with user id/email query params).
- Statut abonnement persiste via `settings.subscription` synchronise dans `user_settings`.
- UI dashboard affiche plan, badge et actions "Passer Pro", "Gerer mon abonnement", "Actualiser".
- Quota passe en illimite quand abonnement PRO actif (status `active`/`trialing`).

### File List
- main.js
- preload.js
- dashboard.html
- dashboard.js

## QA Results
