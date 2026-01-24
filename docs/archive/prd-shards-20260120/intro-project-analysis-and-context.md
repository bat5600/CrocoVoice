# Intro Project Analysis and Context

## Existing Project Overview

### Analysis Source
- User-provided documentation: `docs/ideas/CODEBASE_AUDIT.md` (2026-01-24) and `docs/ideas/code-review-senior.md` (2026-01-23)
- IDE-based documentation review: `docs/architecture/tech-stack.md`, `docs/architecture/source-tree.md`, `docs/architecture/coding-standards.md`

### Current Project State
CrocoVoice is a local-first Electron dictation app. The widget renderer records audio, the main process transcribes via OpenAI Whisper, optionally post-processes via GPT, applies a dictionary, persists to local SQLite, and pastes via clipboard/typing. Supabase auth and sync are optional, with Edge Functions handling quota and Stripe billing.

## Available Documentation Analysis
- [x] Tech Stack Documentation
- [x] Source Tree/Architecture
- [x] Coding Standards
- [ ] API Documentation
- [ ] External API Documentation
- [ ] UX/UI Guidelines
- [x] Technical Debt Documentation
- [ ] Other:

Note: Using existing project analysis from the two audit documents and docs/architecture/*.

## Enhancement Scope Definition

### Enhancement Type
- [ ] New Feature Addition
- [ ] Major Feature Modification
- [ ] Integration with New Systems
- [x] Performance/Scalability Improvements
- [ ] UI/UX Overhaul
- [ ] Technology Stack Upgrade
- [x] Bug Fix and Stability Improvements
- [x] Other: Security Hardening & Data Integrity

### Enhancement Description
Stabilize and harden the current CrocoVoice codebase by addressing critical security flaws, data-integrity risks in sync, and correctness/performance footguns. This work introduces minimal maintainability improvements (tests, modularization, de-duplication) to prevent regressions while preserving existing product behavior.

### Impact Assessment
- [ ] Minimal Impact (isolated additions)
- [ ] Moderate Impact (some existing code changes)
- [x] Significant Impact (substantial existing code changes)
- [ ] Major Impact (architectural changes required)

## Goals and Background Context

### Goals
- Eliminate critical security vulnerabilities in Edge Functions auth and renderer DOM handling.
- Prevent data loss/drift in sync and add safe user scoping.
- Remove known blocking/locking bugs and reduce race conditions in paste flow.
- Improve performance hot paths (audio IPC, DB queries) without changing UX.
- Establish baseline automated tests for core dictation and sync behavior.
- Reduce maintenance risk by splitting the main-process monolith and de-duplicating shared logic.

### Background Context
Two recent audits (2026-01-23 and 2026-01-24) identified critical auth bypass in Edge Functions, renderer XSS via innerHTML, sync correctness risks (pagination, cursor skew, delete propagation), and stability/performance issues. These issues materially increase security exposure, data-integrity risk, and maintenance cost, making a stabilization effort necessary before further feature expansion.

## Change Log
| Change | Date | Version | Description | Author |
| --- | --- | --- | --- | --- |
| Initial draft | 2026-01-24 | v0.1 | PRD draft from audits and existing docs | John |
