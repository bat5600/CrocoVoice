# Forgot Password Flow - Brownfield Addition

## Status
Done

## User Story
As a user,
I want to reset my password by email,
So that I can regain access without support.

## Story Context

**Existing System Integration:**

- Integrates with: `docs/signup.html` Supabase auth client
- Technology: HTML/CSS/JS + Supabase JS
- Follows pattern: existing login/signup mode toggles and status messaging
- Touch points: `#forgotLink`, `#signupForm`, `formStatus`, `setMode()`

## Acceptance Criteria

**Functional Requirements:**

1. Clicking "Mot de passe oublie" switches the form to a reset-email mode (email-only).
2. Submitting the reset form calls `client.auth.resetPasswordForEmail` with the entered email.
3. UI shows a clear success or error message and provides a return path to login.
4. Le lien "Mot de passe oublie" peut declencher un magic link pour creer/recuperer un compte.
5. Apres ouverture du magic link, l'utilisateur peut definir un mot de passe et un nom complet.

**Integration Requirements:**
4. Existing signup/login flows remain unchanged and functional.
5. New reset flow uses the same visual system and form behavior as `docs/signup.html`.
6. Integration with Supabase auth keeps current behavior for login/signup.

**Quality Requirements:**
7. Change is covered by appropriate tests or manual verification steps.
8. Documentation is updated if needed (PRD/story refs).
9. No regression in existing functionality verified.

## Technical Notes

- **Integration Approach:** Extend the existing mode toggle to include a reset-password state and call Supabase reset API.
- **Existing Pattern Reference:** Current `setMode()` and `setStatus()` patterns in `docs/signup.html`.
- **Key Constraints:** No new framework; keep Supabase keys client-side only (public key).

## Definition of Done

- [x] Functional requirements met
- [x] Integration requirements verified
- [x] Existing functionality regression tested
- [x] Code follows existing patterns and standards
- [x] Tests pass (existing and new)
- [x] Documentation updated if applicable

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Breaking login/signup toggling or form validation.
- **Mitigation:** Reuse existing DOM IDs and mode logic; add a reset-only branch.
- **Rollback:** Remove reset mode and revert `docs/signup.html` JS block.

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
| 2026-01-18 | v0.2 | Magic link + set password flow | Dev |

## Dev Agent Record
### Agent Model Used
GPT-5.2

### Debug Log References
N/A

### Completion Notes List
- Mode "magic" ajoute (email-only) + redirect vers `?mode=set-password`.
- Ecran "set-password" pour definir mot de passe et nom complet.
- Redirection magic link configurable via constante.

### File List
- docs/signup.html

## QA Results
