# Epic 3: Paywall, Quota, and Auth Flows

**Epic Goal**: Activer une offre FREE/PRO avec quotas, reset password, paywall et gestion d'abonnement sans casser l'existant.

**Integration Requirements**: Preserver Supabase auth existant, ne pas casser SQLite ou IPC Electron, garder `docs/signup.html` coherent.

## Decisions
- Quota: comptage sur le texte final (post-process), reset hebdomadaire fixe (lundi 00:00 UTC).
- Limite: hard limit (blocage total de la dictee apres quota atteint).
- Abonnement: Stripe confirme (Checkout + portail client) avec liaison Stripe customer <-> compte utilisateur (Supabase user id/email).

## Story 3.1 Forgot password flow
As a user,  
I want to reset my password by email,  
so that I can regain access without support.

### Acceptance Criteria
1. Un lien "mot de passe oublie" declenche un formulaire email.
2. L'email de reset est envoye via Supabase.
3. L'UI affiche un message de succes et propose un retour au login.
4. Les flows login/signup existants restent inchanges.

### Integration Verification
1. IV1: Supabase auth login/signup fonctionnent apres ajout du reset.
2. IV2: Aucun changement requis cote SQLite.
3. IV3: Erreurs reseau affichees clairement.

## Story 3.2 Quota tracking and UI display
As a user,  
I want to see my weekly word quota and remaining words,  
so that I understand my usage on FREE.

### Acceptance Criteria
1. Le quota hebdo (ex: 2000 mots) est defini avec un reset clair.
2. L'UI affiche mots restants + date/heure de reset.
3. Le compteur se met a jour apres chaque dictee.
4. L'UI reste stable en cas d'erreur de lecture du quota.

### Integration Verification
1. IV1: La dictee existante fonctionne avec le compteur actif.
2. IV2: L'affichage quota ne casse pas les flows login/signup.
3. IV3: Aucun impact sur les IPC ou la perf de base.

## Story 3.3 Paywall enforcement and upgrade CTA
As a user,  
I want a clear paywall when I reach my quota,  
so that I can choose to upgrade.

### Acceptance Criteria
1. Au seuil, un paywall apparait (soft/hard limit a definir).
2. Le CTA d'upgrade est present et fonctionnel.
3. Les etats "presque a limite" sont visibles avant le blocage.
4. L'utilisateur FREE reste connecte et peut consulter ses donnees.

### Integration Verification
1. IV1: Aucune regression sur les flows de dictee quand quota non atteint.
2. IV2: Le paywall n'empeche pas les autres vues non liees.
3. IV3: Les messages d'erreur restent coherents.

## Story 3.4 Subscription purchase and portal access
As a user,  
I want to subscribe to PRO and manage my subscription,  
so that I can access unlimited dictation and control billing.

### Acceptance Criteria
1. Un flow d'achat PRO est disponible (ex: Stripe Checkout).
2. Une fois l'achat valide, l'acces PRO est applique immediatement.
3. Un lien "Gerer mon abonnement" ouvre un portail client.
4. Le statut d'abonnement est affiche dans l'UI.
5. Le client Stripe est lie au compte utilisateur (Supabase user id/email) et reutilise pour les sessions suivantes.

### Integration Verification
1. IV1: Le statut PRO est respecte apres redemarrage.
2. IV2: Les erreurs de paiement sont affichees clairement.
3. IV3: Les flows login/signup/reset restent fonctionnels.
