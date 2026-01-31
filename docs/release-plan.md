# CrocoVoice Release Plan (M0 → Market Readiness)

This plan turns the current MVP into a market-ready release using the BMAD Agents as owners.

## Release Goal
Ship a market-ready desktop release that validates MVP behavior, locks operational defaults, and establishes a safe release pipeline.

## Owners (BMAD Agents)
- **Product Owner (po):** Requirements validation, story readiness, milestone sign-off.
- **Product Manager (pm):** Market launch scope, release checklist approvals, go/no-go decision.
- **Full Stack Developer (dev):** Implementation and fixes required for readiness gates.
- **Test Architect & Quality Advisor (qa):** Test coverage, quality gates, and release risk assessment.
- **UX Expert (ux-expert):** UI/UX quality checks and user-facing polish.
- **Architect (architect):** Deployment strategy, packaging/signing, operational reliability.
- **Scrum Master (sm):** Execution coordination, story sequencing, sprint execution flow.
- **Business Analyst (analyst):** Market readiness research inputs and customer risk assessment.
- **BMad Master Orchestrator (bmad-orchestrator):** Cross-agent coordination and dependency tracking.

## Phases & Workstreams

### Phase 0: Audit & Decision Lock-In (Pre-release)
**Goal:** Verify M0 behavior end-to-end and lock operational defaults.

1) **Run M0 DONE Audit** (Owner: qa)
   - Execute `docs/m0-done-audit.md` and attach evidence for dictation, quota, paywall, billing, auth, and offline behavior.
2) **Lock MVP Operational Defaults** (Owner: po + pm)
   - Confirm quota mode (`local | hybrid | server`) and entitlement authority (client vs server) for launch.
3) **Risk Acceptance Sign-off** (Owner: pm)
   - Document accepted risks and known issues for launch.

### Phase 1: Release Readiness Infrastructure
**Goal:** Establish a reliable packaging and release pipeline for external distribution.

1) **Packaging & Signing Plan** (Owner: architect)
   - Define build tooling, signing requirements, and target OS distribution.
2) **Release Checklist** (Owner: qa + po)
   - Create a repeatable smoke checklist derived from the M0 audit.
3) **Rollback Runbook** (Owner: architect + dev)
   - Document rollback steps per integration (quota, billing, auth, permissions).
4) **Vercel Auth Pages Deployment** (Owner: pm + dev)
   - Host `web/` static pages (sales + signup) via Vercel Root Directory.
   - Review/confirm external links (signup URL, legal links) before go-live.

### Phase 2: Product & UX Validation
**Goal:** Ensure UX and product surface areas are ready for external users.

1) **Dashboard & Widget UX Validation** (Owner: ux-expert)
   - Validate user flows, error states, and premium UX polish.
2) **Telemetry/Monitoring Plan** (Owner: architect + qa)
   - Define minimum logs/metrics needed for post-release monitoring.

### Phase 3: Execution Artifacts (Post-MVP)
**Goal:** Ensure M1 execution readiness after release (or in parallel).

1) **Shard Epics 4 & 7 into Stories** (Owner: sm + po)
   - Convert the PRD shard plan into story files with acceptance criteria.

## Release Gates

### Gate A — Audit Complete (Owner: qa)
**Exit Criteria**
- M0 audit checklist completed with evidence artifacts.
- Known issues and accepted risks explicitly recorded.

### Gate B — Defaults Locked (Owner: po + pm)
**Exit Criteria**
- MVP defaults confirmed and documented (quota mode + entitlement authority).
- Offline behavior validated.

### Gate C — Packaging Plan Ready (Owner: architect)
**Exit Criteria**
- Packaging/signing pipeline documented.
- Rollback runbook published.

### Gate D — UX & Quality Ready (Owner: ux-expert + qa)
**Exit Criteria**
- UX review complete (dashboard + widget).
- Release smoke checklist defined and accepted.

### Gate E — Release Go/No-Go (Owner: pm)
**Exit Criteria**
- All previous gates passed.
- Final go/no-go decision recorded.

## Release Timeline (Suggested)
- **Week 1:** Phase 0 + Gate A/B
- **Week 2:** Phase 1 + Gate C
- **Week 3:** Phase 2 + Gate D
- **Week 4:** Gate E + Launch

## Deliverables
- Completed M0 audit with evidence.
- Locked MVP defaults and documented decision.
- Packaging/signing plan + rollback runbook.
- Release smoke checklist.
- UX review notes and approvals.
- Go/No-Go decision record.
