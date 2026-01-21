# Source Tree

## Current Structure (Observed)

```plaintext
CrocoVoice/
├── main.js
├── renderer.js
├── preload.js
├── store.js
├── sync.js
├── index.html
├── dashboard.html
├── dashboard.css
├── dashboard/
│   ├── app.js
│   ├── onboarding.js
│   ├── state.js
│   ├── ui.js
│   ├── render.js
│   ├── actions.js
│   └── README.md
├── assets/
└── supabase/
```

## Notes
- Core runtime files remain at the root; dashboard UI assets are now split under `dashboard/`.
- `assets/` holds static resources.
- `supabase/` contains schema/config for optional cloud sync.
