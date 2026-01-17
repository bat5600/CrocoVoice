# Coding Standards

## Language and Modules
- JavaScript (ES standard), no TypeScript.
- CommonJS `require`/`module.exports` pattern used across core files.

## Naming and Structure
- camelCase variables and function names.
- Lower-case filenames (current convention in root).
- Keep the flat root structure for core runtime files.

## Comments and Documentation
- Minimal inline comments; add only when logic is not obvious.
- README/PRD are the primary documentation references.

## Linting and Formatting
- No linting or formatting tooling observed.
- Follow existing style in each file to avoid churn.

## Testing
- No automated test harness present.
- Manual testing + runtime logs are the current practice.
