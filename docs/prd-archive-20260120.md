# CrocoVoice Brownfield Enhancement PRD

## Intro Project Analysis and Context

### Existing Project Overview

#### Analysis Source
IDE-based fresh analysis: `docs/architecture.md`, `docs/architecture/tech-stack.md`, `docs/architecture/source-tree.md`, `docs/architecture/coding-standards.md`, `docs/front-end-spec.md`, `docs/brainstorming-session-results.md`.

#### Current Project State
CrocoVoice est une app Electron de dictee: MediaRecorder -> Whisper -> post-process -> auto-typing, avec widget + dashboard. Auth/sync via Supabase (optionnel), SQLite local comme source de verite.

### Available Documentation Analysis

#### Available Documentation
- [x] Tech Stack Documentation
- [x] Source Tree/Architecture
- [x] Coding Standards
- [ ] API Documentation
- [ ] External API Documentation
- [x] UX/UI Guidelines (`docs/front-end-spec.md`)
- [ ] Technical Debt Documentation
- [ ] Other: 

### Enhancement Scope Definition

#### Enhancement Type
- [x] New Feature Addition
- [ ] Major Feature Modification
- [x] Integration with New Systems
- [ ] Performance/Scalability Improvements
- [x] UI/UX Overhaul
- [ ] Technology Stack Upgrade
- [ ] Bug Fix and Stability Improvements
- [ ] Other: 

#### Enhancement Description
Ajouter un paywall et une logique d'abonnement: plan FREE (quota hebdo ~2000 mots) + plan PRO (illimite a 9.90 EUR/mois), avec flow "mot de passe oublie", affichage de consommation, et gestion d'abonnement (ex: Stripe Checkout/portal).

#### Impact Assessment
- [ ] Minimal Impact (isolated additions)
- [x] Moderate Impact (some existing code changes)
- [ ] Significant Impact (substantial existing code changes)
- [ ] Major Impact (architectural changes required)

### Goals and Background Context

#### Goals
- Activer une offre FREE/PRO claire avec quota hebdo
- Declencher l'upgrade PRO via paywall au bon moment
- Afficher la consommation et le reset de quota
- Ajouter/reset password fonctionnel
- Preparer la gestion d'abonnement (checkout + portail)

#### Background Context
Le signup/login minimal existe deja. Il manque un flux "mot de passe oublie" et un vrai modele d'acces (FREE limite + PRO illimite) pour monetiser. L'objectif est de rendre l'experience claire et actionnable sans casser l'existant.

### Change Log
| Change | Date | Version | Description | Author |
| --- | --- | --- | --- | --- |
| PRD update | 2026-01-15 | v0.2 | Paywall + Auth scope | PM |

## Requirements
These requirements are based on my understanding of the existing system. Please review carefully and confirm they align with your project's reality.

### Functional
1. FR1: Le flow "mot de passe oublie" envoie un email de reset via Supabase et permet un retour au login.
2. FR2: Le plan FREE applique un quota hebdomadaire de mots dictes (ex: 2000 mots/sem) avec une date de reset claire.
3. FR3: L'UI affiche le nombre de mots restants et la date/heure de reset.
4. FR4: Au depassement du quota, un paywall est affiche avec CTA d'upgrade (soft/hard limit a definir).
5. FR5: Le plan PRO debloque un acces illimite a la dictee apres achat d'abonnement.
6. FR6: L'utilisateur peut gerer son abonnement (upgrade/downgrade, factures) via un portail client.
7. FR7: Le statut d'abonnement et les quotas sont lisibles cote client pour adapter l'UI (badge plan, acces).
8. FR8: Les flows signup/login existants restent fonctionnels, hors ajout du reset/paywall.

### Non Functional
1. NFR1: Aucun nouveau framework front; rester en HTML/CSS/JS existants.
2. NFR2: Les actions auth/paywall ont un temps de reponse percu < 2s en conditions normales.
3. NFR3: Aucune cle privee n'est exposee cote client; usage des cles publiques uniquement.
4. NFR4: En cas d'erreur reseau/Stripe/Supabase, l'UI affiche un message clair et un etat stable.
5. NFR5: Les evenements cles (signup, reset, paywall, upgrade) sont tracables.

### Compatibility Requirements
1. CR1: Les flows signup/login existants continuent de fonctionner sans regression.
2. CR2: La base locale SQLite reste compatible (pas de migration destructive).
3. CR3: Les patterns UI de `docs/signup.html` restent coherents avec le design existant.
4. CR4: L'integration Supabase actuelle reste compatible; aucune rupture d'API cote client.

## User Interface Enhancement Goals

### Integration with Existing UI
Aligner les ajouts (paywall, quota, reset password) avec le style et les composants existants de `docs/signup.html`. Garder la structure HTML/JS actuelle, en ajoutant uniquement les etats necessaires (forgot/reset, quota, CTA upgrade).

### Modified/New Screens and Views
- `docs/signup.html` (forgot password + messages de reset)
- Surfaces d'upsell/paywall (modal ou blocage au moment du quota)
- Affichage de quota restant (signup/dashboard ou autre surface existante)
- Lien "Gerer mon abonnement" vers portail client

### UI Consistency Requirements
- Conserver la palette, typo, et systeme de boutons existants.
- Etats d'erreur et succes clairs et coherents.
- CTA upgrade visible mais non intrusif avant le blocage.

## Technical Constraints and Integration Requirements

### Existing Technology Stack
**Languages**: JavaScript (ES standard)  
**Frameworks**: Electron ^35.7.5 (main/renderer + IPC)  
**Database**: SQLite (sqlite3 ^5.1.7)  
**Infrastructure**: Local Electron runtime (npm start / npm run dev)  
**External Dependencies**: Supabase JS (auth/sync), OpenAI SDK, @nut-tree-fork/nut-js  

### Integration Approach
**Database Integration Strategy**: Eviter toute migration SQLite; stocker les quotas ailleurs (Supabase ou fichier local).  
**API Integration Strategy**: Utiliser Supabase auth pour reset password et eventuellement functions pour quotas.  
**Frontend Integration Strategy**: Integrer les etats paywall dans `docs/signup.html` et dans la surface d'upsell choisie.  
**Testing Integration Strategy**: Tests manuels (signup/login/reset, quota, upgrade) sur plusieurs scenarii.  

### Code Organization and Standards
**File Structure Approach**: Reutiliser les fichiers existants (pas de nouveaux frameworks).  
**Naming Conventions**: camelCase JS, ID HTML existants.  
**Coding Standards**: Suivre `docs/architecture/coding-standards.md`.  
**Documentation Standards**: Mettre a jour `docs/brainstorming-session-results.md` si besoin.  

### Deployment and Operations
**Build Process Integration**: Pas de changement de pipeline.  
**Deployment Strategy**: Update app standard; services externes via Supabase/Stripe.  
**Monitoring and Logging**: Logs client minimalistes; pas de secrets en clair.  

### Risk Assessment and Mitigation
**Technical Risks**: Enforcement du quota uniquement cote client => contournable.  
**Integration Risks**: Stripe + Supabase peuvent requerir des fonctions serveur.  
**Deployment Risks**: Incoherence entre statut d'abonnement et acces reel.  
**Mitigation Strategies**: Centraliser l'entitlement cote serveur (Supabase), verifier au demarrage, fallback lisible.  

## Epic and Story Structure
This enhancement is placed as Epic 3 in the overall roadmap, covering auth + paywall + quota as a cohesive scope sharing the same integration points.

**Epic Structure Decision**: Epic 3 focused on paywall and authentication flows.

## Epic 3: Paywall, Quota, and Auth Flows

**Epic Goal**: Activer une offre FREE/PRO avec quotas, reset password, paywall et gestion d'abonnement sans casser l'existant.

**Integration Requirements**: Preserver Supabase auth existant, ne pas casser SQLite ou IPC Electron, garder `docs/signup.html` coherent.

### Story 3.1 Forgot password flow
As a user,  
I want to reset my password by email,  
so that I can regain access without support.

#### Acceptance Criteria
1. Un lien "mot de passe oublie" declenche un formulaire email.
2. L'email de reset est envoye via Supabase.
3. L'UI affiche un message de succes et propose un retour au login.
4. Les flows login/signup existants restent inchanges.

#### Integration Verification
1. IV1: Supabase auth login/signup fonctionnent apres ajout du reset.
2. IV2: Aucun changement requis cote SQLite.
3. IV3: Erreurs reseau affichees clairement.

### Story 3.2 Quota tracking and UI display
As a user,  
I want to see my weekly word quota and remaining words,  
so that I understand my usage on FREE.

#### Acceptance Criteria
1. Le quota hebdo (ex: 2000 mots) est defini avec un reset clair.
2. L'UI affiche mots restants + date/heure de reset.
3. Le compteur se met a jour apres chaque dictee.
4. L'UI reste stable en cas d'erreur de lecture du quota.

#### Integration Verification
1. IV1: La dictee existante fonctionne avec le compteur actif.
2. IV2: L'affichage quota ne casse pas les flows login/signup.
3. IV3: Aucun impact sur les IPC ou la perf de base.

### Story 3.3 Paywall enforcement and upgrade CTA
As a user,  
I want a clear paywall when I reach my quota,  
so that I can choose to upgrade.

#### Acceptance Criteria
1. Au seuil, un paywall apparait (soft/hard limit a definir).
2. Le CTA d'upgrade est present et fonctionnel.
3. Les etats "presque a limite" sont visibles avant le blocage.
4. L'utilisateur FREE reste connecte et peut consulter ses donnees.

#### Integration Verification
1. IV1: Aucune regression sur les flows de dictee quand quota non atteint.
2. IV2: Le paywall n'empeche pas les autres vues non liees.
3. IV3: Les messages d'erreur restent coherents.

### Story 3.4 Subscription purchase and portal access
As a user,  
I want to subscribe to PRO and manage my subscription,  
so that I can access unlimited dictation and control billing.

#### Acceptance Criteria
1. Un flow d'achat PRO est disponible (ex: Stripe Checkout).
2. Une fois l'achat valide, l'acces PRO est applique immediatement.
3. Un lien "Gerer mon abonnement" ouvre un portail client.
4. Le statut d'abonnement est affiche dans l'UI.

#### Integration Verification
1. IV1: Le statut PRO est respecte apres redemarrage.
2. IV2: Les erreurs de paiement sont affichees clairement.
3. IV3: Les flows login/signup/reset restent fonctionnels.
