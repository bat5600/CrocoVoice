# Windows Packaging & Signing

## Tool Selection
**Chosen tool:** `electron-forge`

**Why this tool**
- Supports Windows installers via makers like Squirrel.Windows (EXE) from a single Forge configuration.
- Configuration is centralized in `package.json` under `config.forge`.

**Constraints**
- Squirrel.Windows builds only on Windows or Linux with `mono` and `wine` installed.
- Windows app icons require a real `.ico` file (Forge appends the platform extension automatically).
- Squirrel.Windows requires handling install/uninstall events (we use `electron-squirrel-startup`).

## Build Configuration
Packaging is configured in `package.json` under `config.forge`:
- `packagerConfig.name`: `CrocoVoice`
- `packagerConfig.appBundleId`: `com.crocovoice.app`
- `packagerConfig.icon`: `assets/tray-icon` (requires `assets/tray-icon.ico`; current file is 32x32 placeholder)
- `makers`: `@electron-forge/maker-squirrel` (EXE)
- `outDir`: `dist`

Additional identity values:
- `productName` in `package.json` drives user-facing strings and the Squirrel `Setup.exe` name.
- `authors` and `description` are provided in the Squirrel maker config.
- Windows AppUserModelID is set in `main.js` to `com.crocovoice.app`.

Versioning comes from `package.json` (`version`).

## Build Command
```bash
npm run make:win
```
This produces:
- Squirrel.Windows artifacts (`Setup.exe`, `*.nupkg`, `RELEASES`)

## Signing (Windows)
For Squirrel.Windows, provide a `.pfx` and password in the maker config fields:
- `certificateFile`
- `certificatePassword`

If a certificate is not yet available, build unsigned artifacts for internal testing only.
