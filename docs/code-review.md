# CrocoVoice Code Review

## System Summary

- Electron main process in `main.js` owns tray, shortcuts, windows, IPC, auth state, and quota.
- Widget UI is `index.html` + `renderer.js`, handling recording UX and audio capture.
- Dashboard UI is `dashboard.html` + `dashboard/*.js` for history, notes, settings, styles, auth.
- Audio capture uses `MediaRecorder` with a WebAudio waveform analyzer in the renderer.
- Main process writes temp audio files and calls OpenAI Whisper for transcription.
- Optional post-processing uses OpenAI chat plus dictionary replacements.
- Text delivery uses clipboard + OS keyboard automation (nut-js/robotjs).
- SQLite (`store.js`) persists settings, history, notes, dictionary, and styles.
- Supabase sync (`sync.js`) handles auth, data sync, and subscription state.
- Quota tracking supports local/hybrid/server modes with caching.
- Auth state broadcasts to renderer windows to drive gating and UX.
- Onboarding state is stored in settings and managed by the dashboard.

## Top 10 Issues

Priority | Impact | Effort | File/Area | Fix
---|---|---|---|---
1 | H | L | `main.js:629`, `renderer.js:367`, `dashboard/render.js:588` | Treat `not_configured` as local-mode allowed so the app works without Supabase.
2 | M | L | `store.js:390` | Archive/remove `settings.json` after migration to avoid overwriting new settings on every launch.
3 | M | L | `main.js:1444`, `main.js:1463` | Switch temp audio file write/cleanup to async + guarded unlink to avoid blocking/crash.
4 | M | L | `dashboard/app.js:270`, `dashboard/render.js:85`, `dashboard/render.js:399`, `dashboard/render.js:508` | Wrap dashboard actions in try/catch and surface user feedback.
5 | M | M | `main.js:1529` | Preserve non-text clipboard formats or provide a "copy-only" fallback to avoid data loss.
6 | M | M | `sync.js:373` | Use max `updated_at` from remote rows as cursor to avoid clock-skew drops.
7 | M | M | `sync.js:49` | Enable token refresh or explicitly refresh sessions to avoid auth expiry in long runs.
8 | L/M | L | `main.js:772` | Make processing timeout adaptive (or tie to recorder flush) to prevent false errors.
9 | L/M | M | `main.js:1649`, `main.js:1984` | Add payload size/shape validation for IPC inputs (audio/notes).
10 | M | M/H | tests | Add tests for Store, SyncService, quota and recording flow.

## Patches

Patch 1 — Allow local mode when Supabase isn’t configured.  
Risk: With `SUPABASE_URL` unset, `authState.status` becomes `not_configured`, which hides the widget and blocks recording even though Supabase is optional.  
Location: `main.js:629`, `renderer.js:367`, `dashboard/render.js:588`.  
Fix: Treat `not_configured` as an allowed auth state for local-only usage.

```diff
diff --git a/main.js b/main.js
@@
-function canAccessPremium() {
-  return authState.status === 'authenticated';
-}
+function canAccessPremium() {
+  return authState.status === 'authenticated' || authState.status === 'not_configured';
+}

diff --git a/renderer.js b/renderer.js
@@
-  const authed = status === 'authenticated';
+  const authed = status === 'authenticated' || status === 'not_configured';

diff --git a/dashboard/render.js b/dashboard/render.js
@@
-  const authed = status === 'authenticated';
+  const authed = status === 'authenticated' || status === 'not_configured';
```

Patch 2 — Stop re-migrating `settings.json` on every launch.  
Risk: If `settings.json` exists, it overwrites SQLite settings on every startup, wiping user changes.  
Location: `store.js:390`.  
Fix: Archive the JSON file after successful migration.

```diff
diff --git a/store.js b/store.js
@@
     const raw = fs.readFileSync(jsonPath, 'utf-8');
     const parsed = JSON.parse(raw);
     await this.saveSettings(parsed);
+    const migratedPath = path.join(this.userDataPath, 'settings.json.migrated');
+    try {
+      await fs.promises.rename(jsonPath, migratedPath);
+    } catch (error) {
+      console.warn('Failed to archive settings.json after migration:', error);
+    }
```

Patch 3 — Safer temp audio file handling.  
Risk: `fs.writeFileSync`/`fs.unlinkSync` blocks the main process; unlink errors can crash or mask the real failure.  
Location: `main.js:1444`, `main.js:1463`.  
Fix: Use async write/unlink with guarded cleanup.

```diff
diff --git a/main.js b/main.js
@@
-    fs.writeFileSync(tempFilePath, audioBuffer);
+    await fs.promises.writeFile(tempFilePath, audioBuffer);
@@
-    if (tempFilePath && fs.existsSync(tempFilePath)) {
-      fs.unlinkSync(tempFilePath);
-    }
+    if (tempFilePath) {
+      try {
+        await fs.promises.unlink(tempFilePath);
+      } catch (error) {
+        if (error?.code !== 'ENOENT') {
+          console.warn('Failed to cleanup temp audio file:', error);
+        }
+      }
+    }
```

Patch 4 — Dashboard action error handling.  
Risk: Clipboard/dictionary/style actions can throw (auth/permissions) and currently fail silently or via unhandled rejections.  
Location: `dashboard/app.js:270`, `dashboard/render.js:85`, `dashboard/render.js:399`, `dashboard/render.js:508`.  
Fix: Add try/catch + user-facing toast messages.

```diff
diff --git a/dashboard/app.js b/dashboard/app.js
@@
-      await window.electronAPI.upsertDictionary({ from_text: word, to_text: correction });
-      showToast(`"${word}" ajouté au dictionnaire.`);
-      if (dictionaryWordInput) {
-        dictionaryWordInput.value = '';
-      }
-      if (dictionaryCorrectionInput) {
-        dictionaryCorrectionInput.value = '';
-      }
-      await refreshDashboard();
+      if (!window.electronAPI?.upsertDictionary) {
+        showToast('Action indisponible.', 'error');
+        return;
+      }
+      try {
+        await window.electronAPI.upsertDictionary({ from_text: word, to_text: correction });
+        showToast(`"${word}" ajouté au dictionnaire.`);
+        if (dictionaryWordInput) {
+          dictionaryWordInput.value = '';
+        }
+        if (dictionaryCorrectionInput) {
+          dictionaryCorrectionInput.value = '';
+        }
+        await refreshDashboard();
+      } catch (error) {
+        showToast(error?.message || 'Impossible d’ajouter le terme.', 'error');
+      }

diff --git a/dashboard/render.js b/dashboard/render.js
@@
-    if (!text || !navigator.clipboard) {
-      return;
-    }
-    await navigator.clipboard.writeText(text);
-    showToast('Texte copié.');
+    if (!text) {
+      return;
+    }
+    if (!navigator.clipboard) {
+      showToast('Copie indisponible.', 'error');
+      return;
+    }
+    try {
+      await navigator.clipboard.writeText(text);
+      showToast('Texte copié.');
+    } catch (error) {
+      showToast(error?.message || 'Impossible de copier.', 'error');
+    }
@@
-    await method(entry.id);
-    showToast(type === 'notes' ? 'Note supprimée.' : 'Entrée supprimée.');
-    await refreshDashboard();
+    try {
+      await method(entry.id);
+      showToast(type === 'notes' ? 'Note supprimée.' : 'Entrée supprimée.');
+      await refreshDashboard();
+    } catch (error) {
+      showToast(error?.message || 'Suppression impossible.', 'error');
+    }
@@
-        await window.electronAPI.upsertDictionary({
-          id: entry.id,
-          from_text: res.from_text,
-          to_text: res.to_text,
-          created_at: entry.created_at,
-        });
-        showToast('Terme mis à jour.');
-        await refreshDashboard();
+        try {
+          await window.electronAPI.upsertDictionary({
+            id: entry.id,
+            from_text: res.from_text,
+            to_text: res.to_text,
+            created_at: entry.created_at,
+          });
+          showToast('Terme mis à jour.');
+          await refreshDashboard();
+        } catch (error) {
+          showToast(error?.message || 'Mise à jour impossible.', 'error');
+        }
@@
-      await window.electronAPI.deleteDictionary(entry.id);
-      showToast('Terme supprimé.');
-      await refreshDashboard();
+      try {
+        await window.electronAPI.deleteDictionary(entry.id);
+        showToast('Terme supprimé.');
+        await refreshDashboard();
+      } catch (error) {
+        showToast(error?.message || 'Suppression impossible.', 'error');
+      }
@@
-        await window.electronAPI.activateStyle(style.id);
-        showToast(`Style "${style.name}" activé.`);
-        await refreshDashboard();
+        try {
+          await window.electronAPI.activateStyle(style.id);
+          showToast(`Style "${style.name}" activé.`);
+          await refreshDashboard();
+        } catch (error) {
+          showToast(error?.message || 'Activation impossible.', 'error');
+        }
```

## Next Steps

- [ ] Run `npm run dev` and smoke-test recording, transcription, paste, and quota gating.
- [ ] Verify local mode works with no Supabase env vars.
- [ ] Validate `settings.json` migration archives correctly after first run.
- [ ] Decide on clipboard preservation strategy and sync cursor clock-skew fix.
- [ ] Add tests (Store + SyncService + quota + IPC) or at least a manual test checklist.
