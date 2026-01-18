# Requirements
These requirements are based on my understanding of the existing system. Please review carefully and confirm they align with your project's reality.

## Functional
1. FR1: Le flow "mot de passe oublie" envoie un email de reset via Supabase et permet un retour au login.
2. FR2: Le plan FREE applique un quota hebdomadaire de mots dictes (ex: 2000 mots/sem) avec une date de reset claire.
3. FR3: L'UI affiche le nombre de mots restants et la date/heure de reset.
4. FR4: Au depassement du quota, un paywall est affiche avec CTA d'upgrade (soft/hard limit a definir).
5. FR5: Le plan PRO debloque un acces illimite a la dictee apres achat d'abonnement.
6. FR6: L'utilisateur peut gerer son abonnement (upgrade/downgrade, factures) via un portail client.
7. FR7: Le statut d'abonnement et les quotas sont lisibles cote client pour adapter l'UI (badge plan, acces).
8. FR8: Les flows signup/login existants restent fonctionnels, hors ajout du reset/paywall.

## Non Functional
1. NFR1: Aucun nouveau framework front; rester en HTML/CSS/JS existants.
2. NFR2: Les actions auth/paywall ont un temps de reponse percu < 2s en conditions normales.
3. NFR3: Aucune cle privee n'est exposee cote client; usage des cles publiques uniquement.
4. NFR4: En cas d'erreur reseau/Stripe/Supabase, l'UI affiche un message clair et un etat stable.
5. NFR5: Les evenements cles (signup, reset, paywall, upgrade) sont tracables.

## Compatibility Requirements
1. CR1: Les flows signup/login existants continuent de fonctionner sans regression.
2. CR2: La base locale SQLite reste compatible (pas de migration destructive).
3. CR3: Les patterns UI de `docs/signup.html` restent coherents avec le design existant.
4. CR4: L'integration Supabase actuelle reste compatible; aucune rupture d'API cote client.
