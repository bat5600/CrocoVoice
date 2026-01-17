# CrocoVoice Brownfield Enhancement PRD

## Intro Project Analysis and Context

### Existing Project Overview

#### Analysis Source
IDE-based fresh analysis (docs: `docs/architecture.md`, `docs/architecture/tech-stack.md`, `docs/architecture/source-tree.md`, `docs/architecture/coding-standards.md`, `docs/front-end-spec.md`).

#### Current Project State
CrocoVoice is an Electron desktop dictation app: MediaRecorder -> Whisper -> optional post-process -> keyboard typing, with a tray widget and a dashboard for settings/history/dictionary/sync. Main/renderer split via IPC; local SQLite storage with optional Supabase sync.

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
- [ ] New Feature Addition
- [ ] Major Feature Modification
- [ ] Integration with New Systems
- [ ] Performance/Scalability Improvements
- [x] UI/UX Overhaul
- [ ] Technology Stack Upgrade
- [ ] Bug Fix and Stability Improvements
- [ ] Other: 

#### Enhancement Description
Modernize the entire main application interface (dashboard window with dictionary/history/settings/etc.) to feel SaaS premium, improving visual design, layout, and interaction polish while preserving existing functionality and flows.

#### Impact Assessment
- [ ] Minimal Impact (isolated additions)
- [ ] Moderate Impact (some existing code changes)
- [x] Significant Impact (substantial existing code changes)
- [ ] Major Impact (architectural changes required)

### Goals and Background Context

#### Goals
- Modern, premium visual language aligned with a SaaS product
- Clearer navigation and hierarchy across dashboard sections
- Consistent components, typography, spacing, and states
- Improved perceived quality without breaking existing flows
- Maintain current performance and reliability

#### Background Context
The current UI is functional but does not convey a premium, modern SaaS feel. This enhancement aims to raise perceived quality and trust without altering core dictation workflows or integration points, building on the existing UX spec.

### Change Log
| Change | Date | Version | Description | Author |
| --- | --- | --- | --- | --- |
| Initial draft | 2026-01-15 | v0.1 | Brownfield PRD draft (UX overhaul) | PM |

## Requirements
These requirements are based on the existing system analysis. Please review carefully and confirm they align with the current project reality.

### Functional
1. FR1: The dashboard (settings, history, dictionary, sync views) is visually modernized to a premium SaaS look without altering core workflows.
2. FR2: Navigation between dashboard sections remains clear and consistent, with improved hierarchy and affordances.
3. FR3: All existing data views (history list, dictionary entries, styles, sync/auth) remain available and functional after the UI redesign.
4. FR4: The dashboard supports OS-standard window behaviors (resize, maximize, minimize, close) without breaking layout.
5. FR5: Visual states (loading, empty, error) are redesigned to feel premium while preserving current information.

### Non Functional
1. NFR1: The redesign must maintain or improve dashboard load time (target: under 2 seconds on typical hardware).
2. NFR2: UI changes must not introduce new runtime dependencies or require a framework change.
3. NFR3: Accessibility remains WCAG 2.1 AA compliant (focus states, contrast, keyboard navigation).
4. NFR4: Animations remain subtle and do not exceed 60 FPS; reduced-motion is respected.

### Compatibility Requirements
1. CR1: IPC channels and payload shapes between main/renderer must remain unchanged.
2. CR2: SQLite schema and data remain fully backward compatible (no destructive changes).
3. CR3: UI behaviors for settings/history/dictionary/sync remain consistent with existing flows.
4. CR4: Integration with Electron window configuration (frameless dashboard, preload isolation) remains intact.

## User Interface Enhancement Goals

### Integration with Existing UI
Align the redesign with the existing `docs/front-end-spec.md` (state clarity, minimal footprint, keyboard-first, fail gracefully). Keep the dashboard’s functional layout intact but elevate visual hierarchy, spacing, typography, and component polish. Use the established brand palette and typography as a base, updated to a more premium expression.

### Modified/New Screens and Views
- Dashboard shell (window chrome/header, navigation)
- Settings view
- History view
- Dictionary view
- Sync/Auth view

### UI Consistency Requirements
- Preserve existing navigation structure and view names.
- Maintain consistent component styling across all dashboard sections.
- Ensure window controls, focus states, and error/empty states follow platform conventions.
- Keep performance and interaction feedback consistent with current UX principles.

## Technical Constraints and Integration Requirements

### Existing Technology Stack
**Languages**: JavaScript (ES standard)
**Frameworks**: Electron ^35.7.5 (main/renderer + IPC)
**Database**: SQLite (sqlite3 ^5.1.7)
**Infrastructure**: Local Electron runtime (npm start / npm run dev)
**External Dependencies**: OpenAI SDK (Whisper + Chat), @nut-tree-fork/nut-js (robotjs fallback), Supabase JS (optional sync)

### Integration Approach
**Database Integration Strategy**: No schema changes; continue using SQLite as local source of truth; sync remains optional/non-blocking.
**API Integration Strategy**: Preserve existing IPC channels and payload shapes; no new external APIs required.
**Frontend Integration Strategy**: Keep HTML/CSS/JS structure in `dashboard.html` + `dashboard.js`, modernize styles and layout without framework changes.
**Testing Integration Strategy**: Manual UI regression checks; no automated harness added.

### Code Organization and Standards
**File Structure Approach**: Maintain flat root layout; update existing `dashboard.html`, `dashboard.js`, shared styles if any.
**Naming Conventions**: Keep camelCase JS and existing naming patterns.
**Coding Standards**: Follow `docs/architecture/coding-standards.md` (plain JS, minimal comments, consistent patterns).
**Documentation Standards**: Update UX specs or inline notes if necessary.

### Deployment and Operations
**Build Process Integration**: No changes; continue Electron local run/build flows.
**Deployment Strategy**: Standard app update; no new services.
**Monitoring and Logging**: Keep console logging minimal; avoid secrets.

### Risk Assessment and Mitigation
**Technical Risks**: UI overhaul could introduce layout regressions or accessibility issues.
**Integration Risks**: Frameless window controls and resize behavior might break across OSes.
**Deployment Risks**: None beyond standard UI regressions.
**Mitigation Strategies**: Manual cross-platform QA, incremental styling changes, fallback to native window controls if custom header is unstable.

## Epic and Story Structure
Based on the existing project analysis, this enhancement should be structured as a single epic because the scope is a cohesive UI/UX overhaul within one surface (dashboard) and shares the same integration points and constraints.

**Epic Structure Decision**: Single epic focused on premium dashboard UX modernization.

## Epic 1: Dashboard UX Premium Modernization

**Epic Goal**: Deliver a premium, modern SaaS-style dashboard UI while preserving existing functionality, performance, and integration behavior.

**Integration Requirements**: Preserve IPC flows, database schema, and renderer/main boundaries; keep functional parity across all dashboard sections.

### Story 1.1 Premium dashboard shell and navigation
As a user,
I want a premium dashboard shell with clearer hierarchy and navigation,
so that the app feels modern and easier to use.

#### Acceptance Criteria
1. The dashboard header and navigation are visually refreshed (spacing, typography, contrast) without changing routes or labels.
2. Window controls (close/minimize/maximize) are present and behave consistently with OS conventions.
3. Layout scales correctly on resize without overlapping or clipping.
4. Existing navigation actions (settings/history/dictionary/sync) remain functional.

#### Integration Verification
1. IV1: Existing dashboard views render without errors after shell changes.
2. IV2: IPC channels used by dashboard remain unchanged.
3. IV3: Resize and window controls do not impact widget or tray behavior.

### Story 1.2 Premium styling for settings and history
As a user,
I want settings and history views to look polished and consistent,
so that the app feels high quality and professional.

#### Acceptance Criteria
1. Settings form fields, labels, and buttons adopt the new premium visual system.
2. History list items use improved spacing, typography, and states (hover/selected).
3. Empty, loading, and error states are redesigned with clear, premium visuals.
4. All existing settings actions and history operations behave as before.

#### Integration Verification
1. IV1: Settings save and history list APIs behave unchanged.
2. IV2: No regression in keyboard navigation and focus handling.
3. IV3: Performance remains comparable to current dashboard load time.

### Story 1.3 Premium styling for dictionary and sync/auth
As a user,
I want dictionary and sync/auth views to feel premium and cohesive,
so that the entire dashboard experience is consistent.

#### Acceptance Criteria
1. Dictionary list and edit actions match the updated visual language.
2. Sync/auth states (logged in/out, syncing, error) are visually consistent and clear.
3. Error messages remain actionable and non-blocking.
4. All existing dictionary and sync/auth flows work without change.

#### Integration Verification
1. IV1: Dictionary CRUD and sync/auth IPC flows remain intact.
2. IV2: No regressions in data rendering or list performance.
3. IV3: Visual states align with accessibility requirements (contrast, focus).

## Story Manager Handoff
Please develop detailed user stories for this brownfield epic. Key considerations:
- This is an enhancement to an existing system running Electron (main/renderer + IPC), JavaScript, and SQLite.
- Integration points: `dashboard.html`, `dashboard.js`, Electron window creation in `main.js`, IPC via `preload.js`.
- Existing patterns to follow: `docs/front-end-spec.md` UX principles and current navigation structure.
- Critical compatibility requirements: preserve IPC channels, database schema, and functional flows.
- Each story must include verification that existing functionality remains intact.
