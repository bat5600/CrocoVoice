# Dashboard Frontend Split

This folder contains the split dashboard frontend scripts used by `dashboard.html`.

Load order (non-module scripts):
1) `state.js` – DOM references, shared state, and constants.
2) `ui.js` – UI helpers (modal/toast/formatting).
3) `render.js` – render functions for views.
4) `actions.js` – handlers, data fetch, and settings/shortcuts.
5) `onboarding.js` – onboarding flow (depends on ui + state).
6) `app.js` – DOMContentLoaded wiring and event listeners.

Notes:
- These are classic scripts (no ES modules/bundler). Keep globals stable.
- If you add a new file, update the script order in `dashboard.html`.
