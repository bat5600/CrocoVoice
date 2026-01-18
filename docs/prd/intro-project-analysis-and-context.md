# Intro Project Analysis and Context

## Existing Project Overview

### Analysis Source
IDE-based fresh analysis: `docs/architecture.md`, `docs/architecture/tech-stack.md`, `docs/architecture/source-tree.md`, `docs/architecture/coding-standards.md`, `docs/front-end-spec.md`, `docs/brainstorming-session-results.md`.

### Current Project State
CrocoVoice est une app Electron de dictee: MediaRecorder -> Whisper -> post-process -> auto-typing, avec widget + dashboard. Auth/sync via Supabase (optionnel), SQLite local comme source de verite.

## Available Documentation Analysis

### Available Documentation
- [x] Tech Stack Documentation
- [x] Source Tree/Architecture
- [x] Coding Standards
- [ ] API Documentation
- [ ] External API Documentation
- [x] UX/UI Guidelines (`docs/front-end-spec.md`)
- [ ] Technical Debt Documentation
- [ ] Other: 

## Enhancement Scope Definition

### Enhancement Type
- [x] New Feature Addition
- [ ] Major Feature Modification
- [x] Integration with New Systems
- [ ] Performance/Scalability Improvements
- [x] UI/UX Overhaul
- [ ] Technology Stack Upgrade
- [ ] Bug Fix and Stability Improvements
- [ ] Other: 

### Enhancement Description
Ajouter un paywall et une logique d'abonnement: plan FREE (quota hebdo ~2000 mots) + plan PRO (illimite a 9.90 EUR/mois), avec flow "mot de passe oublie", affichage de consommation, et gestion d'abonnement (ex: Stripe Checkout/portal).

### Impact Assessment
- [ ] Minimal Impact (isolated additions)
- [x] Moderate Impact (some existing code changes)
- [ ] Significant Impact (substantial existing code changes)
- [ ] Major Impact (architectural changes required)

## Goals and Background Context

### Goals
- Activer une offre FREE/PRO claire avec quota hebdo
- Declencher l'upgrade PRO via paywall au bon moment
- Afficher la consommation et le reset de quota
- Ajouter/reset password fonctionnel
- Preparer la gestion d'abonnement (checkout + portail)

### Background Context
Le signup/login minimal existe deja. Il manque un flux "mot de passe oublie" et un vrai modele d'acces (FREE limite + PRO illimite) pour monetiser. L'objectif est de rendre l'experience claire et actionnable sans casser l'existant.

## Change Log
| Change | Date | Version | Description | Author |
| --- | --- | --- | --- | --- |
| PRD update | 2026-01-15 | v0.2 | Paywall + Auth scope | PM |
