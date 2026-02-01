# Manual Test Script — Upload Flow and Cancellation (Story 6.1)

## Prerequisites
- App launched, dashboard open.
- Test audio files available: small (<=10MB) and large (near limit), formats: .wav, .mp3, .m4a.
- Know current settings for local ASR + cloud fallback.

## Test Cases

1. Successful upload (small WAV)
   - Steps: Click "Importer audio" → select small .wav file.
   - Expected:
     - A transient note appears immediately in Notes.
     - Upload queue shows status transitions (queued → processing → completed).
     - Note text updates to formatted transcript.
     - Note metadata contains file name, size, duration.
     - No new History entry is created.

2. Successful upload (small MP3/M4A)
   - Steps: Repeat with .mp3 then .m4a.
   - Expected:
     - Same behavior as above.
     - Duration is populated in note metadata when possible.

3. Size limit rejection
   - Steps: Attempt to upload a file larger than the configured limit.
   - Expected:
     - Clear error message.
     - No transient note remains.
     - No History entry created.

4. Local-only failure (cloud fallback OFF)
   - Steps: Disable local ASR or make it unavailable; ensure cloud fallback is OFF; upload a file.
   - Expected:
     - Upload fails with a clear reason.
     - Transient note is removed.
     - Failed upload record is still visible in the upload queue.
     - No History entry created.

5. Cloud fallback ON
   - Steps: Enable cloud fallback; upload a file with local ASR unavailable.
   - Expected:
     - Upload completes successfully.
     - Note contains formatted transcript + metadata.
     - No History entry created.

6. Cancel while queued
   - Steps: Start an upload and immediately click "Annuler".
   - Expected:
     - Upload status becomes cancelled.
     - Transient note is removed.
     - No History entry created.

7. Cancel during processing
   - Steps: Upload a larger file, wait for processing to start, then click "Annuler".
   - Expected:
     - Status moves to cancelling → cancelled.
     - Transient note is removed.
     - No History entry created.

8. Restart persistence for failures
   - Steps: Trigger a failed upload (case #4), quit and relaunch the app.
   - Expected:
     - Failed upload record remains visible in the upload queue with error.
