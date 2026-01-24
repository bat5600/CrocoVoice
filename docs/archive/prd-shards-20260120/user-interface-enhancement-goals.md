# User Interface Enhancement Goals

## Integration with Existing UI
Aligner les ajouts (paywall, quota, reset password) avec le style et les composants existants de `docs/signup.html`. Garder la structure HTML/JS actuelle, en ajoutant uniquement les etats necessaires (forgot/reset, quota, CTA upgrade).

## Modified/New Screens and Views
- `docs/signup.html` (forgot password + messages de reset)
- Surfaces d'upsell/paywall (modal ou blocage au moment du quota)
- Affichage de quota restant (signup/dashboard ou autre surface existante)
- Lien "Gerer mon abonnement" vers portail client

## UI Consistency Requirements
- Conserver la palette, typo, et systeme de boutons existants.
- Etats d'erreur et succes clairs et coherents.
- CTA upgrade visible mais non intrusif avant le blocage.
