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
├── dashboard.js
├── assets/
└── supabase/
```

## Notes
- Flat root structure for core runtime files (Electron main/renderer/preload + services).
- `assets/` holds static resources.
- `supabase/` contains schema/config for optional cloud sync.
