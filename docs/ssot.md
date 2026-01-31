# CrocoVoice Single Source of Truth (SSOT)

This file is the **only authoritative map** for CrocoVoice documentation. If anything conflicts, the rules here decide what is true and what must be updated.

## Canonical (Authoritative) Sources
Update these first. Everything else must follow them.

1. **Product requirements & scope** - `docs/prd.md`
2. **System architecture & data model** - `docs/architecture.md`
3. **UI/UX system & behaviors** - `docs/front-end-spec.md`
4. **Operational defaults & configuration** - `docs/configuration.md`
5. **Architecture references (appendices)** - `docs/architecture/`
   - `docs/architecture/tech-stack.md`
   - `docs/architecture/source-tree.md`
   - `docs/architecture/coding-standards.md`

## Supporting (Derived / Working) Artifacts
These are **not** sources of truth. They must be updated **after** the canonical docs change.

- **Execution backlog:** `docs/epics/`, `docs/stories/`, `docs/qa/`
- **Release/process:** `docs/release-plan.md`, `docs/m0-done-audit.md`, `docs/mvp-*.md`, `docs/po-validation-*.md`
- **Research & analysis:** `docs/analysis/`, `docs/ideas/`, `docs/brief.md`
- **Historical/archive:** `docs/archive/`
- **UX research input:** `docs/ux/` (useful context, but **not** authoritative vs `docs/front-end-spec.md`)
- **Deprecated snapshot:** `docs/architecture-vnext.md` (historical view; do not update)

## Conflict Resolution Order
If two docs disagree:
1. Follow **this SSOT map**.
2. Then follow the **canonical doc** for the domain (product / architecture / UI / config).
3. If still unclear, use the **latest change log date** inside the canonical doc.

## Agent Update Protocol (Mandatory)
When an agent makes a change that affects product scope, architecture, UX, or defaults:

1. **Update the canonical doc first** (PRD / Architecture / Front-end spec / Configuration).
2. **Add a Change Log entry** in the canonical doc with date + summary.
3. **Update derived artifacts** (epics/stories/QA/release notes) to reflect the change.
4. **Log the work** in `docs/agent-logbook.md`.
5. If a conflict is detected, **stop and reconcile** before continuing.

### Quick Checklist (for every change)
- [ ] Does this change affect product scope/requirements?
- [ ] Does it change architecture/data model/integration rules?
- [ ] Does it change UI/UX behaviors/visual system?
- [ ] Does it change defaults/operational model?

If **yes** to any: update canonical docs before anything else.

## Change Log
| Date | Summary | Owner |
| --- | --- | --- |
| 2026-01-31 | Introduced SSOT map + canonical/derived rules | Codex |
