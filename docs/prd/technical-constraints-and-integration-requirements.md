# Technical Constraints and Integration Requirements

## Existing Technology Stack
**Languages**: JavaScript (ES standard)  
**Frameworks**: Electron ^35.7.5 (main/renderer + IPC)  
**Database**: SQLite (sqlite3 ^5.1.7)  
**Infrastructure**: Local Electron runtime (npm start / npm run dev)  
**External Dependencies**: Supabase JS (auth/sync), OpenAI SDK, @nut-tree-fork/nut-js  

## Integration Approach
**Database Integration Strategy**: Eviter toute migration SQLite; stocker les quotas ailleurs (Supabase ou fichier local).  
**API Integration Strategy**: Utiliser Supabase auth pour reset password et eventuellement functions pour quotas.  
**Frontend Integration Strategy**: Integrer les etats paywall dans `docs/signup.html` et dans la surface d'upsell choisie.  
**Testing Integration Strategy**: Tests manuels (signup/login/reset, quota, upgrade) sur plusieurs scenarii.  

## Code Organization and Standards
**File Structure Approach**: Reutiliser les fichiers existants (pas de nouveaux frameworks).  
**Naming Conventions**: camelCase JS, ID HTML existants.  
**Coding Standards**: Suivre `docs/architecture/coding-standards.md`.  
**Documentation Standards**: Mettre a jour `docs/brainstorming-session-results.md` si besoin.  

## Deployment and Operations
**Build Process Integration**: Pas de changement de pipeline.  
**Deployment Strategy**: Update app standard; services externes via Supabase/Stripe.  
**Monitoring and Logging**: Logs client minimalistes; pas de secrets en clair.  

## Risk Assessment and Mitigation
**Technical Risks**: Enforcement du quota uniquement cote client => contournable.  
**Integration Risks**: Stripe + Supabase peuvent requerir des fonctions serveur.  
**Deployment Risks**: Incoherence entre statut d'abonnement et acces reel.  
**Mitigation Strategies**: Centraliser l'entitlement cote serveur (Supabase), verifier au demarrage, fallback lisible.  
