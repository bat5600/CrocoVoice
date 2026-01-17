# Technical Constraints and Integration Requirements

## Existing Technology Stack
**Languages**: JavaScript (Node.js)  
**Frameworks**: Electron  
**Database**: SQLite local (`flow.sqlite`), Supabase (Postgres) en remote  
**Infrastructure**: Desktop app (tray + renderer windows), OS permissions (micro/keyboard)  
**External Dependencies**: OpenAI SDK/Whisper, Supabase SDK, @nut-tree-fork/nut-js (robotjs fallback)

## Integration Approach
**Database Integration Strategy**: SQLite reste la source locale principale (settings/history/styles/dictionary) avec purge historique; Supabase sync optionnelle non bloquante.  
**API Integration Strategy**: OpenAI Whisper pour transcription + OpenAI chat completions pour post-process; gestion des erreurs et timeouts.  
**Frontend Integration Strategy**: IPC main/renderer pour etats, settings et actions; widget minimaliste et dashboard separes.  
**Testing Integration Strategy**: Pas de harness existant; prioriser tests manuels + scenarios de non-regression, et ajouter tests unitaires si un harness est introduit.

## Code Organization and Standards
**File Structure Approach**: Respect de la separation main/renderer/preload (main.js, renderer.js, preload.js) + modules services (store.js, sync.js).  
**Naming Conventions**: style JavaScript existant (camelCase, fichiers en lower-case).  
**Coding Standards**: Non formalises; conserver le style actuel, ajouter standards progressifs si necessaire.  
**Documentation Standards**: README + PRD; ajouter notes techniques si dette critique identifiee.

## Deployment and Operations
**Build Process Integration**: npm scripts (`npm start`, `npm run dev`); pas de pipeline de build/package visible.  
**Deployment Strategy**: Run local Electron; packaging a definir si distribution requise.  
**Monitoring and Logging**: console logs; pas de telemetrie.  
**Configuration Management**: .env pour OpenAI/Supabase + settings SQLite pour options utilisateur.

## Risk Assessment and Mitigation
**Technical Risks**: permissions micro/clavier, echec OpenAI, timeouts/quota/429, format audio non supporte, libs clavier indisponibles (nut-js/robotjs), echec silencieux de la saisie clavier.  
**Integration Risks**: incoherence d'etats entre main/renderer, IPC fragile, evenements doubles (raccourci + widget) provoquant start/stop multiples, sync Supabase partielle ou conflit de versions.  
**Deployment Risks**: variations OS (macOS/Windows/Linux) sur raccourcis globaux et acces accesibilite, fenetre cible qui change pendant le processing (texte tape au mauvais endroit).  
**Mitigation Strategies**: etat machine robuste, debouncing/locking des actions start/stop, retries limites, backoff sur erreurs OpenAI, fallback locaux, messages d'erreur explicites, detection d'echec de saisie, tests manuels multi-OS, mode offline stable.
