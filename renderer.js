/**
 * Renderer Process - handles audio recording and IPC
 */
// External integrations: MediaRecorder + getUserMedia, IPC bridge to main process.
// Manual regression checks: mic permission, start/stop, waveform, audio payload delivery.

let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let audioStream = null;

let audioContext = null;
let analyserNode = null;
let waveformData = null;
let waveformCanvas = null;
let waveformCtx = null;
let waveformAnimationId = null;
let statusTextEl = null;
let shortcutLabelEl = null;
let currentSettings = {};
let streamingActive = false;
let streamNode = null;
let streamSource = null;
let streamSessionId = null;
let streamSequence = 0;
let streamingUsesWorklet = false;
let streamFirstChunkSent = false;
let streamPingTimeoutId = null;
let streamPingBackoffMs = 1000;
let lastStreamPongAt = 0;
let cancelButton = null;
let stopButton = null;
let cancelUndoEl = null;
let widgetErrorEl = null;
let widgetErrorText = null;
let widgetErrorUpgradeButton = null;
let undoCancelButton = null;
let cancelUndoProgress = null;
let cancelUndoTimeoutId = null;
let cancelUndoActive = false;
let cancelPending = false;
let pendingCancelPayload = null;
let cancelUndoStartAt = null;
let cancelUndoRemainingMs = 0;
let cancelUndoPaused = false;
let recordingStartedAt = null;
let audioRmsPeak = 0;
let audioActiveMs = 0;
let audioMetricsLastAt = null;
let lastAudioActiveAt = null;
let audioDiagnosticsWindow = [];
let audioQualityClass = 'clean';
let audioDiagnosticsSummary = null;
let safetyIntervalId = null;
let pendingNoAudioReason = null;
let pendingWarningMessage = '';
let micMonitorStream = null;
let micMonitorContext = null;
let micMonitorAnalyser = null;
let micMonitorData = null;
let micMonitorAnimationId = null;
let micMonitorActive = false;
let micMonitorLastSentAt = 0;
let authGateEl = null;
let authLoginButton = null;
let authSignupButton = null;
let authStatusText = null;
let authRetryButton = null;
let authLoginForm = null;
let authEmailInput = null;
let authPasswordInput = null;
let authSubmitPending = false;
let currentAuthState = null;
let widgetContainer = null;
let recordingTooltipEl = null;
let quotaGateEl = null;
let quotaRemainingEl = null;
let quotaResetEl = null;
let quotaUpgradeButton = null;
let quotaDashboardButton = null;
let quotaDismissButton = null;
let quotaStatusText = null;
let quotaGateActive = false;
let widgetContextMenu = null;
let widgetMicrophoneList = null;
let widgetLanguageSearch = null;
let widgetLanguageList = null;
let widgetMicrophoneLabel = null;
let widgetLanguageLabel = null;
let widgetMicrophoneCurrent = null;
let availableMicrophones = [];
let partialTranscript = '';
let widgetFeatureFlags = {};
let contextMenuEnabled = true;
let statusBubbleEnabled = true;

const CANCEL_UNDO_DURATION_MS = 4000;
const AUDIO_RMS_ACTIVE_THRESHOLD = 0.018;
const AUDIO_MIN_TOTAL_MS = 350;
const AUDIO_MIN_ACTIVE_MS = 200;
const AUDIO_MIN_PEAK_RMS = 0.012;
const AUDIO_DIAGNOSTICS_WINDOW_MS = 7000;
const AUDIO_CLIP_THRESHOLD = 0.95;
const AUDIO_SILENCE_THRESHOLD = 0.012;
const RECORDING_IDLE_TIMEOUT_MS = 10 * 60 * 1000;
const RECORDING_MAX_DURATION_MS = 60 * 60 * 1000;
const MIC_MONITOR_SEND_INTERVAL_MS = 80;
const STREAM_PING_BASE_MS = 1000;
const STREAM_PING_MAX_MS = 10000;
const STREAM_PONG_TIMEOUT_MS = 7000;
const MIC_LABEL_MAX_CHARS = 28;
const LANGUAGE_OPTIONS = [
  { code: 'fr', label: 'Francais' },
  { code: 'en', label: 'Anglais' },
  { code: 'es', label: 'Espagnol' },
  { code: 'de', label: 'Allemand' },
  { code: 'it', label: 'Italien' },
  { code: 'pt', label: 'Portugais' },
  { code: 'nl', label: 'Neerlandais' },
  { code: 'sv', label: 'Suedois' },
  { code: 'no', label: 'Norvegien' },
  { code: 'da', label: 'Danois' },
  { code: 'fi', label: 'Finnois' },
  { code: 'pl', label: 'Polonais' },
  { code: 'cs', label: 'Tcheque' },
  { code: 'sk', label: 'Slovaque' },
  { code: 'hu', label: 'Hongrois' },
  { code: 'ro', label: 'Roumain' },
  { code: 'ru', label: 'Russe' },
  { code: 'uk', label: 'Ukrainien' },
  { code: 'tr', label: 'Turc' },
  { code: 'ar', label: 'Arabe' },
  { code: 'he', label: 'Hebreu' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ja', label: 'Japonais' },
  { code: 'ko', label: 'Coreen' },
  { code: 'zh', label: 'Chinois' },
  { code: 'th', label: 'Thai' },
  { code: 'vi', label: 'Vietnamien' },
  { code: 'id', label: 'Indonesien' },
];

function setUndoActive(active) {
  if (!widgetContainer) {
    return;
  }
  widgetContainer.classList.toggle('undo-active', active);
  document.body.classList.toggle('undo-active', active);
}

function resolveLanguageLabel(code) {
  const entry = LANGUAGE_OPTIONS.find((option) => option.code === code);
  return entry ? entry.label : code || '';
}

function renderLanguageList(filterValue = '') {
  if (!widgetLanguageList) {
    return;
  }
  const filter = filterValue.trim().toLowerCase();
  widgetLanguageList.innerHTML = '';
  const currentLanguage = currentSettings.language || 'fr';
  const matches = LANGUAGE_OPTIONS.filter((option) => {
    if (!filter) {
      return true;
    }
    return option.label.toLowerCase().includes(filter) || option.code.toLowerCase().includes(filter);
  });
  if (!matches.length) {
    const empty = document.createElement('div');
    empty.className = 'submenu-empty';
    empty.textContent = 'Aucun resultat';
    widgetLanguageList.appendChild(empty);
    return;
  }
  matches.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'submenu-item';
    const isSelected = currentLanguage === option.code;
    if (isSelected) {
      button.classList.add('selected');
    }
    button.dataset.language = option.code;
    const labelSpan = document.createElement('span');
    labelSpan.className = 'submenu-text';
    labelSpan.textContent = option.label;
    const checkSpan = document.createElement('span');
    checkSpan.className = 'submenu-check';
    checkSpan.textContent = isSelected ? '✓' : '';
    button.appendChild(labelSpan);
    button.appendChild(checkSpan);
    widgetLanguageList.appendChild(button);
  });
}

function renderMicrophoneList() {
  if (!widgetMicrophoneList) {
    return;
  }
  widgetMicrophoneList.innerHTML = '';
  const defaultButton = document.createElement('button');
  defaultButton.type = 'button';
  defaultButton.className = 'submenu-item';
  defaultButton.dataset.micId = '';
  const isDefault = !currentSettings.microphoneId;
  const defaultLabel = document.createElement('span');
  defaultLabel.className = 'submenu-text';
  defaultLabel.textContent = 'Detection auto';
  const defaultCheck = document.createElement('span');
  defaultCheck.className = 'submenu-check';
  defaultCheck.textContent = isDefault ? '✓' : '';
  defaultButton.appendChild(defaultLabel);
  defaultButton.appendChild(defaultCheck);
  if (isDefault) {
    defaultButton.classList.add('selected');
  }
  widgetMicrophoneList.appendChild(defaultButton);
  availableMicrophones.forEach((mic) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'submenu-item';
    button.dataset.micId = mic.deviceId;
    const label = mic.label || `Micro ${mic.deviceId.slice(0, 4)}...`;
    const isSelected = currentSettings.microphoneId === mic.deviceId;
    const labelSpan = document.createElement('span');
    labelSpan.className = 'submenu-text';
    labelSpan.textContent = wrapLabel(label, MIC_LABEL_MAX_CHARS);
    const checkSpan = document.createElement('span');
    checkSpan.className = 'submenu-check';
    checkSpan.textContent = isSelected ? '✓' : '';
    button.appendChild(labelSpan);
    button.appendChild(checkSpan);
    if (isSelected) {
      button.classList.add('selected');
    }
    widgetMicrophoneList.appendChild(button);
  });
}

function updateMenuLabels() {
  if (widgetLanguageLabel) {
    const currentLanguage = currentSettings.language || 'fr';
    const label = resolveLanguageLabel(currentLanguage) || currentLanguage;
    widgetLanguageLabel.textContent = label ? `Langue: ${label}` : 'Choisir la langue';
  }
  if (widgetMicrophoneLabel) {
    widgetMicrophoneLabel.textContent = 'Changer le micro';
  }
  if (widgetMicrophoneCurrent) {
    const selected = availableMicrophones.find((mic) => mic.deviceId === currentSettings.microphoneId);
    const label = selected ? (selected.label || `Micro ${selected.deviceId.slice(0, 4)}...`) : 'Detection auto';
    widgetMicrophoneCurrent.textContent = wrapLabel(label, MIC_LABEL_MAX_CHARS);
  }
}

function applyWidgetFeatureFlags(flags = {}) {
  widgetFeatureFlags = flags || {};
  statusBubbleEnabled = widgetFeatureFlags.statusBubble !== false;
  contextMenuEnabled = widgetFeatureFlags.contextMenu !== false;
  document.body.classList.toggle('status-disabled', !statusBubbleEnabled);
  if (widgetContextMenu) {
    widgetContextMenu.style.display = contextMenuEnabled ? '' : 'none';
  }
  if (!contextMenuEnabled && widgetContainer) {
    widgetContainer.classList.remove('context-open');
  }
}

function wrapLabel(label, maxChars) {
  if (!label || label.length <= maxChars) {
    return label || '';
  }
  const words = label.split(/\s+/);
  const lines = [];
  let current = '';

  const pushLine = () => {
    if (current) {
      lines.push(current);
      current = '';
    }
  };

  words.forEach((word) => {
    if (!word) {
      return;
    }
    if (!current) {
      if (word.length <= maxChars) {
        current = word;
        return;
      }
      for (let i = 0; i < word.length; i += maxChars) {
        lines.push(word.slice(i, i + maxChars));
      }
      return;
    }
    if (current.length + 1 + word.length <= maxChars) {
      current = `${current} ${word}`;
      return;
    }
    pushLine();
    if (word.length <= maxChars) {
      current = word;
      return;
    }
    for (let i = 0; i < word.length; i += maxChars) {
      lines.push(word.slice(i, i + maxChars));
    }
  });

  pushLine();
  return lines.join('\n');
}

async function refreshMicrophones() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    return;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    availableMicrophones = devices.filter((device) => device.kind === 'audioinput');
    renderMicrophoneList();
    updateMenuLabels();
  } catch (error) {
    console.error('Failed to list microphones:', error);
  }
}

function saveWidgetSetting(key, value) {
  currentSettings = { ...currentSettings, [key]: value };
  if (window.electronAPI?.saveSettings) {
    const payload = { ...currentSettings };
    delete payload.apiKeyPresent;
    window.electronAPI.saveSettings(payload);
  }
  renderMicrophoneList();
  renderLanguageList(widgetLanguageSearch ? widgetLanguageSearch.value : '');
  updateMenuLabels();
}

function resetAudioMetrics() {
  audioRmsPeak = 0;
  audioActiveMs = 0;
  audioMetricsLastAt = null;
  lastAudioActiveAt = null;
  audioDiagnosticsWindow = [];
  audioQualityClass = 'clean';
  audioDiagnosticsSummary = null;
}

function clearSafetyMonitor() {
  if (safetyIntervalId) {
    clearInterval(safetyIntervalId);
    safetyIntervalId = null;
  }
}

function startSafetyMonitor() {
  clearSafetyMonitor();
  safetyIntervalId = setInterval(() => {
    if (!isRecording || !recordingStartedAt) {
      return;
    }
    const now = Date.now();
    const elapsed = now - recordingStartedAt;
    if (elapsed >= RECORDING_MAX_DURATION_MS && !pendingWarningMessage) {
      pendingWarningMessage = `Arrêt automatique : durée max atteinte (${Math.round(RECORDING_MAX_DURATION_MS / 60000)} min).`;
      clearSafetyMonitor();
      if (window.electronAPI?.toggleRecording) {
        window.electronAPI.toggleRecording();
      } else {
        stopRecording();
      }
      return;
    }
    if (lastAudioActiveAt && now - lastAudioActiveAt >= RECORDING_IDLE_TIMEOUT_MS && !pendingNoAudioReason) {
      pendingNoAudioReason = 'idle_timeout';
      clearSafetyMonitor();
      if (window.electronAPI?.cancelRecording) {
        window.electronAPI.cancelRecording();
      } else {
        stopRecording();
      }
    }
  }, 1000);
}

function trackAudioMetrics(metrics) {
  const rms = metrics?.rms;
  const peak = metrics?.peak;
  const clipRatio = metrics?.clipRatio;
  const frameTimeMs = metrics?.frameTimeMs;
  if (!Number.isFinite(rms)) {
    return;
  }
  audioRmsPeak = Math.max(audioRmsPeak, rms);

  if (!Number.isFinite(frameTimeMs)) {
    return;
  }
  if (audioMetricsLastAt === null) {
    audioMetricsLastAt = frameTimeMs;
    return;
  }
  const dt = Math.max(0, frameTimeMs - audioMetricsLastAt);
  audioMetricsLastAt = frameTimeMs;
  if (rms >= AUDIO_RMS_ACTIVE_THRESHOLD) {
    audioActiveMs += dt;
    lastAudioActiveAt = Date.now();
  }

  const noiseProxy = Number.isFinite(peak) && peak > 0 ? rms / peak : 0;
  audioDiagnosticsWindow.push({
    at: Date.now(),
    rms,
    peak: Number.isFinite(peak) ? peak : null,
    clipRatio: Number.isFinite(clipRatio) ? clipRatio : 0,
    noiseProxy,
    silent: rms < AUDIO_SILENCE_THRESHOLD,
  });
  const cutoff = Date.now() - AUDIO_DIAGNOSTICS_WINDOW_MS;
  audioDiagnosticsWindow = audioDiagnosticsWindow.filter((item) => item.at >= cutoff);
  audioDiagnosticsSummary = summarizeAudioDiagnostics(audioDiagnosticsWindow);
  audioQualityClass = classifyAudioQuality(audioDiagnosticsSummary);
}

function summarizeAudioDiagnostics(windowSamples) {
  if (!Array.isArray(windowSamples) || windowSamples.length === 0) {
    return null;
  }
  const totals = windowSamples.reduce(
    (acc, sample) => {
      acc.rms += sample.rms || 0;
      acc.peak = Math.max(acc.peak, sample.peak || 0);
      acc.clipRatio += sample.clipRatio || 0;
      acc.noiseProxy += sample.noiseProxy || 0;
      if (sample.silent) {
        acc.silenceCount += 1;
      }
      return acc;
    },
    { rms: 0, peak: 0, clipRatio: 0, noiseProxy: 0, silenceCount: 0 },
  );
  const count = windowSamples.length;
  return {
    rmsAvg: totals.rms / count,
    peakMax: totals.peak,
    clipRatioAvg: totals.clipRatio / count,
    noiseProxyAvg: totals.noiseProxy / count,
    silenceRatio: totals.silenceCount / count,
    samples: count,
  };
}

function classifyAudioQuality(summary) {
  if (!summary || summary.samples < 5) {
    return 'clean';
  }
  if (summary.silenceRatio >= 0.6) {
    return 'degraded';
  }
  if (summary.clipRatioAvg >= 0.02 || summary.noiseProxyAvg >= 0.6) {
    return 'noisy';
  }
  if (summary.rmsAvg < AUDIO_SILENCE_THRESHOLD * 1.2) {
    return 'degraded';
  }
  return 'clean';
}

function shouldTreatAsNoAudio() {
  const durationMs = recordingStartedAt ? (Date.now() - recordingStartedAt) : 0;
  if (durationMs > 0 && durationMs < AUDIO_MIN_TOTAL_MS) {
    return true;
  }
  if (audioRmsPeak < AUDIO_MIN_PEAK_RMS) {
    return true;
  }
  if (audioActiveMs < AUDIO_MIN_ACTIVE_MS && audioRmsPeak < (AUDIO_RMS_ACTIVE_THRESHOLD * 1.3)) {
    return true;
  }
  return false;
}

function startCancelUndoTimer() {
  if (!cancelUndoProgress || cancelUndoRemainingMs <= 0) {
    clearCancelUndo();
    return;
  }
  cancelUndoStartAt = Date.now();
  cancelUndoProgress.style.transition = 'width 0s linear';
  cancelUndoProgress.style.width = `${(cancelUndoRemainingMs / CANCEL_UNDO_DURATION_MS) * 100}%`;
  requestAnimationFrame(() => {
    if (!cancelUndoProgress) {
      return;
    }
    cancelUndoProgress.style.transition = `width ${cancelUndoRemainingMs}ms linear`;
    cancelUndoProgress.style.width = '0%';
  });
  cancelUndoTimeoutId = setTimeout(() => {
    clearCancelUndo();
  }, cancelUndoRemainingMs);
}

function pauseCancelUndoTimer() {
  if (!cancelUndoActive || cancelUndoPaused) {
    return;
  }
  cancelUndoPaused = true;
  if (cancelUndoTimeoutId) {
    clearTimeout(cancelUndoTimeoutId);
    cancelUndoTimeoutId = null;
  }
  if (cancelUndoStartAt) {
    const elapsed = Date.now() - cancelUndoStartAt;
    cancelUndoRemainingMs = Math.max(0, cancelUndoRemainingMs - elapsed);
  }
  if (cancelUndoProgress) {
    cancelUndoProgress.style.transition = 'none';
    cancelUndoProgress.style.width = `${(cancelUndoRemainingMs / CANCEL_UNDO_DURATION_MS) * 100}%`;
  }
}

function resumeCancelUndoTimer() {
  if (!cancelUndoActive || !cancelUndoPaused) {
    return;
  }
  cancelUndoPaused = false;
  startCancelUndoTimer();
}

function updateWidgetState(state, message) {
  const widgetContainer = document.getElementById('widgetContainer');
  if (!widgetContainer) {
    return;
  }

  widgetContainer.classList.remove('idle', 'recording', 'processing', 'error');
  widgetContainer.classList.add(state);

  if (state === 'recording') {
    startWaveform();
  } else {
    stopWaveform();
  }

  if (statusTextEl) {
    if (state === 'processing') {
      statusTextEl.textContent = 'Transcription...';
    } else if (state === 'error') {
      statusTextEl.textContent = message || 'Erreur';
    } else {
      statusTextEl.textContent = 'Prêt';
    }
  }

  if (state === 'error') {
    if (widgetErrorText) {
      widgetErrorText.textContent = message || 'Erreur';
    }
    if (widgetErrorUpgradeButton) {
      const showUpgrade = quotaGateActive || /quota/i.test(message || '');
      widgetErrorUpgradeButton.style.display = showUpgrade ? 'inline-flex' : 'none';
    }
    if (widgetErrorEl) {
      widgetErrorEl.classList.add('active');
    }
    document.body.classList.add('error-active');
    if (window.electronAPI?.setWidgetErrorVisible) {
      window.electronAPI.setWidgetErrorVisible(true);
    }
  } else {
    if (widgetErrorEl) {
      widgetErrorEl.classList.remove('active');
    }
    if (widgetErrorUpgradeButton) {
      widgetErrorUpgradeButton.style.display = 'none';
    }
    document.body.classList.remove('error-active');
    if (window.electronAPI?.setWidgetErrorVisible) {
      window.electronAPI.setWidgetErrorVisible(false);
    }
  }
}

function clearCancelUndo() {
  if (cancelUndoTimeoutId) {
    clearTimeout(cancelUndoTimeoutId);
    cancelUndoTimeoutId = null;
  }
  pendingCancelPayload = null;
  cancelUndoActive = false;
  cancelUndoPaused = false;
  cancelUndoStartAt = null;
  cancelUndoRemainingMs = 0;
  setUndoActive(false);
  if (window.electronAPI?.setWidgetUndoVisible) {
    window.electronAPI.setWidgetUndoVisible(false);
  }
  if (cancelUndoEl) {
    cancelUndoEl.classList.remove('active');
  }
  if (cancelUndoProgress) {
    cancelUndoProgress.style.transition = 'none';
    cancelUndoProgress.style.width = '100%';
  }
}

function startCancelUndo(payload) {
  pendingCancelPayload = payload;
  cancelUndoActive = true;
  cancelUndoPaused = false;
  cancelUndoRemainingMs = CANCEL_UNDO_DURATION_MS;
  setUndoActive(true);
  if (window.electronAPI?.setWidgetUndoVisible) {
    window.electronAPI.setWidgetUndoVisible(true);
  }
  if (cancelUndoEl) {
    cancelUndoEl.classList.add('active');
  }
  startCancelUndoTimer();
}

function updateShortcutLabel(shortcut) {
  if (!shortcutLabelEl) {
    return;
  }
  shortcutLabelEl.textContent = shortcut || '[Raccourci]';
}

function setAuthStatus(message, isError) {
  if (!authStatusText) {
    return;
  }
  authStatusText.textContent = message || '';
  authStatusText.style.color = isError ? '#f87171' : 'rgba(243, 244, 246, 0.7)';
}

function setQuotaStatus(message, isError) {
  if (!quotaStatusText) {
    return;
  }
  quotaStatusText.textContent = message || '';
  quotaStatusText.style.color = isError ? '#f87171' : 'rgba(243, 244, 246, 0.7)';
}

function formatQuotaResetLabel(iso) {
  if (!iso) {
    return 'Reset lundi 00:00 UTC';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return 'Reset lundi 00:00 UTC';
  }
  return `Reset ${date.toLocaleDateString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' })} UTC`;
}

function applyQuotaGate(payload) {
  quotaGateActive = true;
  document.body.classList.add('quota-gated');
  if (quotaGateEl) {
    quotaGateEl.setAttribute('aria-hidden', 'false');
  }
  if (quotaRemainingEl) {
    const remaining = Number.isFinite(payload?.remaining) ? payload.remaining : 0;
    quotaRemainingEl.textContent = `${remaining}`;
  }
  if (quotaResetEl) {
    quotaResetEl.textContent = formatQuotaResetLabel(payload?.resetAt);
  }
  setQuotaStatus('');
}

function clearQuotaGate() {
  quotaGateActive = false;
  document.body.classList.remove('quota-gated');
  if (quotaGateEl) {
    quotaGateEl.setAttribute('aria-hidden', 'true');
  }
  setQuotaStatus('');
}

function isProSubscription(subscription) {
  if (!subscription) {
    return false;
  }
  const plan = subscription.plan || 'free';
  const status = subscription.status || 'inactive';
  return plan === 'pro' && (status === 'active' || status === 'trialing');
}

function applyAuthState(state) {
  currentAuthState = state || {};
  const status = currentAuthState.status || 'checking';
  const authed = status === 'authenticated';
  document.body.classList.toggle('auth-gated', !authed);
  if (!authed && quotaGateActive) {
    clearQuotaGate();
  }
  if (window.electronAPI?.setWidgetExpanded) {
    window.electronAPI.setWidgetExpanded(!authed);
  }
  if (authGateEl) {
    authGateEl.setAttribute('aria-hidden', authed ? 'true' : 'false');
  }

  if (status === 'checking') {
    setAuthStatus(currentAuthState.message || 'Verification de session...', false);
  } else if (status === 'error') {
    setAuthStatus(currentAuthState.message || 'Connexion indisponible.', true);
  } else if (status === 'not_configured') {
    setAuthStatus(currentAuthState.message || 'Supabase non configure.', true);
  } else if (status === 'unauthenticated') {
    setAuthStatus(currentAuthState.message || 'Connexion requise.', false);
  } else {
    setAuthStatus('');
  }

  const disableForm = status === 'checking' || status === 'not_configured' || authSubmitPending;
  if (authLoginButton) {
    authLoginButton.disabled = disableForm;
  }
  if (authEmailInput) {
    authEmailInput.disabled = disableForm;
  }
  if (authPasswordInput) {
    authPasswordInput.disabled = disableForm;
  }
  if (authSignupButton) {
    authSignupButton.disabled = disableForm;
    authSignupButton.style.display = status === 'unauthenticated' ? 'inline-flex' : 'none';
  }
  if (authRetryButton) {
    authRetryButton.disabled = status === 'checking' || status === 'not_configured';
    authRetryButton.style.display = currentAuthState.retryable ? 'inline-flex' : 'none';
  }
}

async function submitAuthLogin() {
  if (!window.electronAPI?.authSignIn) {
    setAuthStatus('Connexion indisponible.', true);
    return;
  }
  const email = authEmailInput?.value.trim();
  const password = authPasswordInput?.value || '';
  if (!email || !password) {
    setAuthStatus('Veuillez saisir email et mot de passe.', true);
    return;
  }

  authSubmitPending = true;
  applyAuthState(currentAuthState);
  setAuthStatus('Connexion en cours...', false);
  try {
    await window.electronAPI.authSignIn(email, password);
    if (authPasswordInput) {
      authPasswordInput.value = '';
    }
  } catch (error) {
    setAuthStatus(error?.message || 'Echec de connexion.', true);
  } finally {
    authSubmitPending = false;
    applyAuthState(currentAuthState);
  }
}

async function setupWaveform(stream, preferredSampleRate = null) {
  if (!waveformCanvas) {
    waveformCanvas = document.getElementById('waveformCanvas');
  }
  if (waveformCanvas && !waveformCtx) {
    waveformCtx = waveformCanvas.getContext('2d');
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  if (!audioContext || (preferredSampleRate && audioContext.sampleRate !== preferredSampleRate)) {
    if (audioContext) {
      await audioContext.close();
    }
    audioContext = preferredSampleRate
      ? new AudioContextClass({ sampleRate: preferredSampleRate })
      : new AudioContextClass();
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 1024;
  waveformData = new Uint8Array(analyserNode.fftSize);

  const source = audioContext.createMediaStreamSource(stream);
  if (audioContext.createBiquadFilter && currentSettings.audioDiagnosticsEnabled !== false) {
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 80;
    source.connect(filter);
    filter.connect(analyserNode);
  } else {
    source.connect(analyserNode);
  }
}

function drawWaveform(frameTimeMs) {
  if (!analyserNode || !waveformCtx || !waveformCanvas || !waveformData) {
    return;
  }

  analyserNode.getByteTimeDomainData(waveformData);

  let rmsSum = 0;
  let peak = 0;
  let clipCount = 0;
  const { width, height } = waveformCanvas;
  waveformCtx.clearRect(0, 0, width, height);
  waveformCtx.lineWidth = 2;
  const rootStyle = getComputedStyle(document.documentElement);
  waveformCtx.strokeStyle = rootStyle.getPropertyValue('--croco-green').trim() || '#36d96f';
  waveformCtx.beginPath();

  const sliceWidth = width / waveformData.length;
  let x = 0;

  for (let i = 0; i < waveformData.length; i += 1) {
    const centered = (waveformData[i] - 128) / 128.0;
    const y = (centered + 1) * (height / 2);
    rmsSum += centered * centered;
    const abs = Math.abs(centered);
    if (abs > peak) {
      peak = abs;
    }
    if (abs >= AUDIO_CLIP_THRESHOLD) {
      clipCount += 1;
    }

    if (i === 0) {
      waveformCtx.moveTo(x, y);
    } else {
      waveformCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  waveformCtx.stroke();

  const rms = Math.sqrt(rmsSum / waveformData.length);
  const clipRatio = waveformData.length ? clipCount / waveformData.length : 0;
  trackAudioMetrics({ rms, peak, clipRatio, frameTimeMs });
}

function startWaveform() {
  if (!analyserNode || !waveformCtx || !waveformCanvas) {
    return;
  }

  if (waveformAnimationId) {
    cancelAnimationFrame(waveformAnimationId);
  }

  const render = (frameTimeMs) => {
    drawWaveform(frameTimeMs);
    waveformAnimationId = requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

function stopWaveform() {
  if (waveformAnimationId) {
    cancelAnimationFrame(waveformAnimationId);
    waveformAnimationId = null;
  }

  if (waveformCtx && waveformCanvas) {
    waveformCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
  }
}

async function startMicMonitor() {
  if (micMonitorActive) {
    return;
  }
  if (isRecording || (mediaRecorder && mediaRecorder.state === 'recording')) {
    window.electronAPI.sendMicMonitorError('Mic already in use by recording.');
    return;
  }

  micMonitorActive = true;
  micMonitorLastSentAt = 0;

  try {
    const audioConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    };
    if (currentSettings.microphoneId) {
      audioConstraints.deviceId = { exact: currentSettings.microphoneId };
    }
    micMonitorStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('AudioContext unavailable.');
    }
    if (!micMonitorContext) {
      micMonitorContext = new AudioContextClass();
    }
    if (micMonitorContext.state === 'suspended') {
      await micMonitorContext.resume();
    }

    micMonitorAnalyser = micMonitorContext.createAnalyser();
    micMonitorAnalyser.fftSize = 1024;
    micMonitorData = new Uint8Array(micMonitorAnalyser.fftSize);

    const source = micMonitorContext.createMediaStreamSource(micMonitorStream);
    source.connect(micMonitorAnalyser);

    const render = (frameTimeMs) => {
      if (!micMonitorAnalyser || !micMonitorData) {
        return;
      }
      micMonitorAnalyser.getByteTimeDomainData(micMonitorData);
      let rmsSum = 0;
      for (let i = 0; i < micMonitorData.length; i += 1) {
        const centered = (micMonitorData[i] - 128) / 128.0;
        rmsSum += centered * centered;
      }
      const rms = Math.sqrt(rmsSum / micMonitorData.length);
      if (frameTimeMs - micMonitorLastSentAt >= MIC_MONITOR_SEND_INTERVAL_MS) {
        micMonitorLastSentAt = frameTimeMs;
        window.electronAPI.sendMicMonitorLevel({ level: rms, at: Date.now() });
      }
      micMonitorAnimationId = requestAnimationFrame(render);
    };

    micMonitorAnimationId = requestAnimationFrame(render);
  } catch (error) {
    micMonitorActive = false;
    window.electronAPI.sendMicMonitorError(error?.message || 'Microphone access failed.');
    stopMicMonitor();
  }
}

function stopMicMonitor() {
  micMonitorActive = false;
  if (micMonitorAnimationId) {
    cancelAnimationFrame(micMonitorAnimationId);
    micMonitorAnimationId = null;
  }
  if (micMonitorStream) {
    micMonitorStream.getTracks().forEach((track) => track.stop());
    micMonitorStream = null;
  }
  micMonitorAnalyser = null;
  micMonitorData = null;
}

function stopStreamHeartbeat() {
  if (streamPingTimeoutId) {
    clearTimeout(streamPingTimeoutId);
    streamPingTimeoutId = null;
  }
}

function handleStreamingDisconnect(message) {
  stopStreamHeartbeat();
  if (window.electronAPI?.sendStreamDiag) {
    window.electronAPI.sendStreamDiag({
      code: 'stream_disconnect',
      details: {
        reason: message || 'Streaming interrompu.',
        sessionId: streamSessionId,
        lastPongAt: lastStreamPongAt || null,
        now: Date.now(),
        backoffMs: streamPingBackoffMs,
        pongTimeoutMs: STREAM_PONG_TIMEOUT_MS,
      },
    });
  }
  if (window.electronAPI?.sendRecordingError) {
    window.electronAPI.sendRecordingError(message || 'Streaming interrompu.');
  }
  if (streamSessionId && window.electronAPI?.sendStreamStop) {
    window.electronAPI.sendStreamStop({ sessionId: streamSessionId });
  }
  streamSessionId = null;
  streamSequence = 0;
  streamingActive = false;
  streamingUsesWorklet = false;
  streamFirstChunkSent = false;
}

function scheduleStreamPing() {
  if (!streamingActive || !streamSessionId) {
    return;
  }
  streamPingTimeoutId = setTimeout(() => {
    if (!streamingActive || !streamSessionId) {
      return;
    }
    if (window.electronAPI?.sendStreamPing) {
      window.electronAPI.sendStreamPing({ sessionId: streamSessionId, at: Date.now() });
    }
    const now = Date.now();
    if (now - lastStreamPongAt > STREAM_PONG_TIMEOUT_MS) {
      streamPingBackoffMs = Math.min(streamPingBackoffMs * 2, STREAM_PING_MAX_MS);
      if (streamPingBackoffMs >= STREAM_PING_MAX_MS && now - lastStreamPongAt > STREAM_PONG_TIMEOUT_MS * 2) {
        handleStreamingDisconnect('Streaming déconnecté.');
        return;
      }
    } else {
      streamPingBackoffMs = STREAM_PING_BASE_MS;
    }
    scheduleStreamPing();
  }, streamPingBackoffMs);
}

function startStreamHeartbeat() {
  stopStreamHeartbeat();
  lastStreamPongAt = Date.now();
  streamPingBackoffMs = STREAM_PING_BASE_MS;
  scheduleStreamPing();
}

async function initializeMediaRecorder(streamingMode = false) {
  try {
    const audioConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    };
    if (currentSettings.microphoneId) {
      audioConstraints.deviceId = { exact: currentSettings.microphoneId };
    }
    audioStream = await navigator.mediaDevices.getUserMedia({
      audio: audioConstraints,
    });

    await setupWaveform(audioStream);

    const options = {
      mimeType: 'audio/webm;codecs=opus',
      audioBitsPerSecond: 128000,
    };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.warn('Format WebM not supported, using default format');
      options.mimeType = '';
    }

    mediaRecorder = new MediaRecorder(audioStream, options);
    window.mediaRecorder = mediaRecorder;
    window.audioChunks = [];

    if (streamingMode) {
      streamSessionId = crypto.randomUUID();
      streamSequence = 0;
      streamingActive = true;
      streamingUsesWorklet = false;
      streamFirstChunkSent = false;
      if (window.electronAPI?.sendStreamStart) {
        window.electronAPI.sendStreamStart({
          sessionId: streamSessionId,
          codec: 'opus',
          mimeType: options.mimeType || 'audio/webm',
        });
      }
      startStreamHeartbeat();
      window.mediaRecorder.ondataavailable = async (event) => {
        if (event.data && event.data.size > 0) {
          const ab = await event.data.arrayBuffer();
          if (window.electronAPI?.sendStreamChunk) {
            if (!streamFirstChunkSent && window.electronAPI?.sendStreamDiag) {
              streamFirstChunkSent = true;
              window.electronAPI.sendStreamDiag({
                code: 'stream_first_chunk',
                details: {
                  mode: 'mediarecorder',
                  sessionId: streamSessionId,
                  size: event.data.size,
                },
              });
            }
            window.electronAPI.sendStreamChunk(
              {
                sessionId: streamSessionId,
                seq: streamSequence,
                codec: 'opus',
                mimeType: event.data.type || options.mimeType || 'audio/webm',
                chunk: ab,
              },
              [ab],
            );
            streamSequence += 1;
          }
        }
      };
      window.mediaRecorder.onstop = () => {
        if (window.electronAPI?.sendStreamStop && streamSessionId) {
          const diagnosticsPayload = currentSettings.audioDiagnosticsEnabled !== false && audioDiagnosticsSummary
            ? {
              audioDiagnostics: {
                ...audioDiagnosticsSummary,
                rmsPeak: audioRmsPeak,
                activeMs: audioActiveMs,
              },
              audioQualityClass,
            }
            : {};
          window.electronAPI.sendStreamStop({ sessionId: streamSessionId, ...diagnosticsPayload });
        }
        streamSessionId = null;
        streamSequence = 0;
        streamingActive = false;
        streamingUsesWorklet = false;
        streamFirstChunkSent = false;
        stopStreamHeartbeat();
        clearSafetyMonitor();
        if (audioStream) {
          audioStream.getTracks().forEach((track) => track.stop());
          audioStream = null;
        }
        analyserNode = null;
        stopWaveform();
        mediaRecorder = null;
      };
    } else {
      window.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          window.audioChunks.push(event.data);
        }
      };

      window.mediaRecorder.onstop = async () => {
        const blob = new Blob(window.audioChunks, { type: window.mediaRecorder.mimeType || 'audio/webm' });
        const ab = await blob.arrayBuffer();
        const payload = {
          buffer: ab,
          mimeType: blob.type,
          micDevice: currentSettings.microphoneId || '',
        };
        if (currentSettings.audioDiagnosticsEnabled !== false && audioDiagnosticsSummary) {
          payload.audioDiagnostics = {
            ...audioDiagnosticsSummary,
            rmsPeak: audioRmsPeak,
            activeMs: audioActiveMs,
          };
          payload.audioQualityClass = audioQualityClass;
        }
        if (pendingWarningMessage) {
          payload.warningMessage = pendingWarningMessage;
          pendingWarningMessage = '';
        }

        if (pendingNoAudioReason) {
          const reason = pendingNoAudioReason;
          pendingNoAudioReason = null;
          window.electronAPI.sendRecordingEmpty(reason);
        } else if (cancelPending) {
          cancelPending = false;
          startCancelUndo(payload);
        } else if (shouldTreatAsNoAudio()) {
          window.electronAPI.sendRecordingEmpty('no_audio');
        } else {
          window.electronAPI.sendAudioReady(payload);
        }

        window.audioChunks = [];
        clearSafetyMonitor();

        if (audioStream) {
          audioStream.getTracks().forEach((track) => track.stop());
          audioStream = null;
        }

        analyserNode = null;
        stopWaveform();
        mediaRecorder = null;
      };
    }

    mediaRecorder.onerror = (event) => {
      window.electronAPI.sendRecordingError(event.error.message);
      stopRecording();
    };

    return true;
  } catch (error) {
    if (window.electronAPI?.sendStreamDiag) {
      window.electronAPI.sendStreamDiag({
        code: 'stream_worklet_init_error',
        details: {
          message: error?.message || String(error),
        },
      });
    }
    window.electronAPI.sendRecordingError(error.message);
    return false;
  }
}

function isStreamingMode() {
  const flags = currentSettings.featureFlags || {};
  return Boolean(flags.streaming);
}

async function initializeStreamingRecorder() {
  try {
    const audioConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    };
    if (currentSettings.microphoneId) {
      audioConstraints.deviceId = { exact: currentSettings.microphoneId };
    }
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });

    const desiredSampleRate = Number.isFinite(currentSettings.streamSampleRate)
      ? currentSettings.streamSampleRate
      : null;
    await setupWaveform(audioStream, desiredSampleRate);

    const moduleUrl = new URL('assets/stream-worklet.js', window.location.href);
    if (!audioContext?.audioWorklet) {
      throw new Error('AudioWorklet indisponible.');
    }
    await audioContext.audioWorklet.addModule(moduleUrl);
    streamNode = new AudioWorkletNode(audioContext, 'stream-worklet');
    streamSource = audioContext.createMediaStreamSource(audioStream);
    const chunkMs = Number.isFinite(currentSettings.streamChunkMs) ? currentSettings.streamChunkMs : 900;
    const chunkSize = Math.max(256, Math.round((audioContext.sampleRate || 16000) * (chunkMs / 1000)));
    streamNode.port.postMessage({ chunkSize });
    streamNode.port.onmessage = (event) => {
      if (!streamingActive || !event.data) {
        return;
      }
      const samples = event.data;
      if (!window.electronAPI?.sendStreamChunk || !streamSessionId) {
        return;
      }
      if (!streamFirstChunkSent && window.electronAPI?.sendStreamDiag) {
        streamFirstChunkSent = true;
        window.electronAPI.sendStreamDiag({
          code: 'stream_first_chunk',
          details: {
            mode: 'worklet',
            sessionId: streamSessionId,
            length: samples?.length || 0,
          },
        });
      }
      window.electronAPI.sendStreamChunk(
        {
          sessionId: streamSessionId,
          seq: streamSequence,
          sampleRate: audioContext.sampleRate || 16000,
          samples,
        },
        samples?.buffer ? [samples.buffer] : [],
      );
      streamSequence += 1;
    };

    const silent = audioContext.createGain();
    silent.gain.value = 0;
    streamSource.connect(streamNode);
    streamNode.connect(silent).connect(audioContext.destination);

    streamSessionId = crypto.randomUUID();
    streamSequence = 0;
    streamingActive = true;
    streamingUsesWorklet = true;
    streamFirstChunkSent = false;
    if (window.electronAPI?.sendStreamStart) {
      window.electronAPI.sendStreamStart({
        sessionId: streamSessionId,
        sampleRate: audioContext.sampleRate || 16000,
        chunkMs,
      });
    }
    startStreamHeartbeat();
    return true;
  } catch (error) {
    if (streamingMode && window.electronAPI?.sendStreamDiag) {
      window.electronAPI.sendStreamDiag({
        code: 'stream_mediarec_init_error',
        details: {
          message: error?.message || String(error),
        },
      });
    }
    window.electronAPI.sendRecordingError(error.message);
    return false;
  }
}

function stopStreamingRecording() {
  if (!streamingActive) {
    return;
  }
  streamingActive = false;
  streamingUsesWorklet = false;
  streamFirstChunkSent = false;
  stopStreamHeartbeat();
  if (window.electronAPI?.sendStreamStop && streamSessionId) {
    window.electronAPI.sendStreamStop({ sessionId: streamSessionId });
  }
  streamSessionId = null;
  streamSequence = 0;
  if (streamNode) {
    try {
      streamNode.port.postMessage({ flush: true });
    } catch (error) {
      console.warn('Stream flush failed:', error);
    }
    streamNode.disconnect();
    streamNode = null;
  }
  if (streamSource) {
    streamSource.disconnect();
    streamSource = null;
  }
  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop());
    audioStream = null;
  }
  analyserNode = null;
  stopWaveform();
}

async function startRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    return;
  }
  if (cancelUndoActive) {
    return;
  }
  if (micMonitorActive) {
    stopMicMonitor();
  }

  isRecording = true;
  recordingStartedAt = Date.now();
  pendingNoAudioReason = null;
  pendingWarningMessage = '';
  resetAudioMetrics();
  lastAudioActiveAt = Date.now();

  if (isStreamingMode()) {
    const useWorklet = Boolean(currentSettings.featureFlags?.worklet);
    const initialized = useWorklet
      ? await initializeStreamingRecorder()
      : await initializeMediaRecorder(true);
    if (!initialized) {
      isRecording = false;
      return;
    }
    if (!useWorklet && mediaRecorder) {
      const chunkMs = Number.isFinite(currentSettings.streamChunkMs) ? currentSettings.streamChunkMs : 900;
      mediaRecorder.start(chunkMs);
    }
  } else {
    if (!mediaRecorder) {
      const initialized = await initializeMediaRecorder(false);
      if (!initialized) {
        isRecording = false;
        return;
      }
    }

    audioChunks = [];
    window.audioChunks = [];
    mediaRecorder.start(1000);
  }
  startWaveform();
  startSafetyMonitor();
}

function stopRecording() {
  if (!isRecording) {
    return;
  }

  isRecording = false;
  recordingStartedAt = null;
  clearSafetyMonitor();

  if (streamingActive && streamingUsesWorklet) {
    stopStreamingRecording();
    return;
  }

  if (mediaRecorder && mediaRecorder.state === 'recording') {
    try {
      mediaRecorder.requestData();
    } catch (error) {
      console.warn('requestData failed:', error);
    }
    mediaRecorder.stop();
    return;
  }

  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop());
    audioStream = null;
    analyserNode = null;
    stopWaveform();
  }
}

window.electronAPI.onStartRecording(() => {
  startRecording();
});

window.electronAPI.onStopRecording(() => {
  try {
    stopRecording();
  } catch (e) {
    console.error('[RENDERER] stop() crashed', e);
  }
});

if (window.electronAPI.onMicMonitorStart) {
  window.electronAPI.onMicMonitorStart(() => {
    startMicMonitor();
  });
}

if (window.electronAPI.onMicMonitorStop) {
  window.electronAPI.onMicMonitorStop(() => {
    stopMicMonitor();
  });
}

window.electronAPI.onStatusChange((status, message) => {
  isRecording = status === 'recording';
  updateWidgetState(status, message);
});

if (window.electronAPI.onPartialTranscript) {
  window.electronAPI.onPartialTranscript((text) => {
    partialTranscript = (text || '').trim();
    if (statusTextEl && (isRecording || streamingActive)) {
      statusTextEl.textContent = partialTranscript
        ? partialTranscript.slice(0, 60)
        : 'Écoute...';
    }
  });
}

if (window.electronAPI.onStreamPong) {
  window.electronAPI.onStreamPong((payload) => {
    if (!payload || payload.sessionId !== streamSessionId) {
      return;
    }
    lastStreamPongAt = Date.now();
  });
}

window.electronAPI.onTranscriptionSuccess(() => {
  partialTranscript = '';
});

window.electronAPI.onTranscriptionError(() => {
  partialTranscript = '';
});

document.addEventListener('DOMContentLoaded', () => {
  waveformCanvas = document.getElementById('waveformCanvas');
  statusTextEl = document.getElementById('statusText');
  widgetErrorEl = document.getElementById('widgetError');
  widgetErrorText = document.getElementById('widgetErrorText');
  widgetErrorUpgradeButton = document.getElementById('widgetErrorUpgradeButton');
  recordingTooltipEl = document.getElementById('recordingTooltip');
  shortcutLabelEl = document.getElementById('shortcutLabel');
  cancelButton = document.getElementById('cancelRecordingButton');
  stopButton = document.getElementById('stopRecordingButton');
  cancelUndoEl = document.getElementById('cancelUndo');
  undoCancelButton = document.getElementById('undoCancelButton');
  cancelUndoProgress = document.getElementById('cancelUndoProgress');
  authGateEl = document.getElementById('authGate');
  authLoginForm = document.getElementById('authLoginForm');
  authEmailInput = document.getElementById('authEmail');
  authPasswordInput = document.getElementById('authPassword');
  authLoginButton = document.getElementById('authLoginButton');
  authSignupButton = document.getElementById('authSignupButton');
  authStatusText = document.getElementById('authStatusText');
  authRetryButton = document.getElementById('authRetryButton');
  quotaGateEl = document.getElementById('quotaGate');
  quotaRemainingEl = document.getElementById('quotaGateRemaining');
  quotaResetEl = document.getElementById('quotaGateReset');
  quotaUpgradeButton = document.getElementById('quotaUpgradeButton');
  quotaDashboardButton = document.getElementById('quotaDashboardButton');
  quotaDismissButton = document.getElementById('quotaDismissButton');
  quotaStatusText = document.getElementById('quotaGateStatus');
  updateWidgetState('idle');

  if (window.electronAPI?.getAuthState) {
    window.electronAPI.getAuthState().then((state) => {
      applyAuthState(state);
    }).catch(() => {
      applyAuthState({ status: 'error', message: 'Etat auth indisponible.', retryable: true });
    });
  }

  if (window.electronAPI?.onAuthState) {
    window.electronAPI.onAuthState((state) => {
      applyAuthState(state);
    });
  }

  if (window.electronAPI?.onAuthRequired) {
    window.electronAPI.onAuthRequired((message) => {
      applyAuthState({ ...(currentAuthState || {}), status: 'unauthenticated', message: message || 'Connexion requise.' });
    });
  }

  if (window.electronAPI?.onQuotaBlocked) {
    window.electronAPI.onQuotaBlocked((payload) => {
      applyQuotaGate(payload || {});
    });
  }

  if (authLoginForm) {
    authLoginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await submitAuthLogin();
    });
  }

  if (authSignupButton) {
    authSignupButton.addEventListener('click', async () => {
      if (!window.electronAPI?.openSignupUrl) {
        return;
      }
      setAuthStatus('Ouverture...', false);
      const result = await window.electronAPI.openSignupUrl('signup');
      if (result?.ok === false) {
        setAuthStatus('Ouverture impossible.', true);
      } else {
        setAuthStatus('');
      }
    });
  }

  if (authRetryButton) {
    authRetryButton.addEventListener('click', async () => {
      if (!window.electronAPI?.authRetry) {
        return;
      }
      setAuthStatus('Nouvelle tentative...', false);
      try {
        await window.electronAPI.authRetry();
      } catch (error) {
        setAuthStatus(error?.message || 'Retry indisponible.', true);
      }
    });
  }

  if (quotaUpgradeButton) {
    quotaUpgradeButton.addEventListener('click', async () => {
      if (!window.electronAPI?.startCheckout) {
        setQuotaStatus('Checkout indisponible.', true);
        return;
      }
      setQuotaStatus('Ouverture du checkout...', false);
      try {
        const result = await window.electronAPI.startCheckout();
        if (!result?.ok) {
          setQuotaStatus('Checkout non configuré.', true);
        }
      } catch (error) {
        setQuotaStatus(error?.message || 'Checkout indisponible.', true);
      }
    });
  }

  if (quotaDashboardButton) {
    quotaDashboardButton.addEventListener('click', async () => {
      if (window.electronAPI?.openSettings) {
        await window.electronAPI.openSettings();
      }
      if (window.electronAPI?.openDashboardView) {
        window.electronAPI.openDashboardView('settings');
      }
    });
  }

  if (quotaDismissButton) {
    quotaDismissButton.addEventListener('click', () => {
      clearQuotaGate();
    });
  }

  if (widgetErrorUpgradeButton) {
    widgetErrorUpgradeButton.addEventListener('click', async () => {
      if (!window.electronAPI?.startCheckout) {
        if (widgetErrorText) {
          widgetErrorText.textContent = 'Checkout indisponible.';
        }
        return;
      }
      widgetErrorUpgradeButton.disabled = true;
      try {
        const result = await window.electronAPI.startCheckout();
        if (!result?.ok && widgetErrorText) {
          widgetErrorText.textContent = 'Checkout non configuré.';
        }
      } catch (error) {
        if (widgetErrorText) {
          widgetErrorText.textContent = error?.message || 'Checkout indisponible.';
        }
      } finally {
        widgetErrorUpgradeButton.disabled = false;
      }
    });
  }


  if (window.electronAPI.getSettings) {
    window.electronAPI.getSettings().then((settings) => {
      currentSettings = settings || {};
      updateShortcutLabel(settings.shortcut);
      renderLanguageList();
      updateMenuLabels();
      refreshMicrophones();
      applyWidgetFeatureFlags(currentSettings.featureFlags || {});
    }).catch(() => {
      updateShortcutLabel('');
    });
  }

  if (window.electronAPI.onShortcutUpdated) {
    window.electronAPI.onShortcutUpdated((shortcut) => {
      updateShortcutLabel(shortcut);
    });
  }

  if (window.electronAPI.onSettingsUpdated) {
    window.electronAPI.onSettingsUpdated((nextSettings) => {
      const previousMic = currentSettings.microphoneId;
      currentSettings = nextSettings || {};
      updateShortcutLabel(currentSettings.shortcut);
      applyWidgetFeatureFlags(currentSettings.featureFlags || {});
      if (isProSubscription(currentSettings.subscription)) {
        clearQuotaGate();
      }
      if (!isRecording && previousMic !== currentSettings.microphoneId) {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        mediaRecorder = null;
        if (audioStream) {
          audioStream.getTracks().forEach((track) => track.stop());
          audioStream = null;
        }
      }
      renderMicrophoneList();
      renderLanguageList(widgetLanguageSearch ? widgetLanguageSearch.value : '');
      updateMenuLabels();
    });
  }

  widgetContainer = document.getElementById('widgetContainer');
  if (widgetContainer) {
    widgetContextMenu = widgetContainer.querySelector('.context-menu');
    widgetMicrophoneList = document.getElementById('widgetMicrophoneList');
    widgetLanguageSearch = document.getElementById('widgetLanguageSearch');
    widgetLanguageList = document.getElementById('widgetLanguageList');
    widgetMicrophoneLabel = document.getElementById('widgetMicrophoneLabel');
    widgetLanguageLabel = document.getElementById('widgetLanguageLabel');
    widgetMicrophoneCurrent = document.getElementById('widgetMicrophoneCurrent');
    applyWidgetFeatureFlags(currentSettings.featureFlags || {});
    let isContextOpen = false;
    let isHovering = false;
    let hoverOutTimeout = null;
    let openSubmenu = null;

    if (widgetLanguageSearch) {
      widgetLanguageSearch.addEventListener('input', () => {
        renderLanguageList(widgetLanguageSearch.value);
      });
    }
    if (navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        refreshMicrophones();
      });
    }

    const updateExpandedState = () => {
      const menuOpen = widgetContainer.classList.contains('context-open');
      isContextOpen = menuOpen;
      if (cancelUndoActive) {
        if (window.electronAPI && window.electronAPI.setWidgetExpanded) {
          window.electronAPI.setWidgetExpanded(false);
        }
        return;
      }
      if (window.electronAPI && window.electronAPI.setWidgetExpanded) {
        window.electronAPI.setWidgetExpanded(menuOpen || isHovering);
      }
    };

    widgetContainer.addEventListener('click', () => {
      if (isContextOpen) {
        return;
      }

      window.electronAPI.toggleRecording();
    });

    const closeContextMenu = () => {
      widgetContainer.classList.remove('context-open');
      isContextOpen = false;
      if (openSubmenu) {
        const openItem = widgetContextMenu?.querySelector(`.menu-item[data-submenu="${openSubmenu}"]`);
        openItem?.classList.remove('submenu-open');
        openSubmenu = null;
      }
      updateExpandedState();
    };

    const toggleSubmenu = (submenuName) => {
      if (!widgetContextMenu) {
        return;
      }
      const targetItem = widgetContextMenu.querySelector(`.menu-item[data-submenu="${submenuName}"]`);
      if (!targetItem) {
        return;
      }
      if (openSubmenu && openSubmenu !== submenuName) {
        const openItem = widgetContextMenu.querySelector(`.menu-item[data-submenu="${openSubmenu}"]`);
        openItem?.classList.remove('submenu-open');
      }
      const isOpen = targetItem.classList.toggle('submenu-open');
      openSubmenu = isOpen ? submenuName : null;
    };

    const submenuItems = widgetContextMenu?.querySelectorAll('.menu-item[data-submenu]') || [];
    submenuItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        if (!isContextOpen) {
          return;
        }
        const submenuName = item.dataset.submenu;
        if (!submenuName) {
          return;
        }
        if (openSubmenu && openSubmenu !== submenuName) {
          const openItem = widgetContextMenu.querySelector(`.menu-item[data-submenu="${openSubmenu}"]`);
          openItem?.classList.remove('submenu-open');
        }
        item.classList.add('submenu-open');
        openSubmenu = submenuName;
      });
      item.addEventListener('mouseleave', (event) => {
        if (!isContextOpen) {
          return;
        }
        const submenuName = item.dataset.submenu;
        if (!submenuName) {
          return;
        }
        const panel = widgetContextMenu?.querySelector(`[data-submenu-panel="${submenuName}"]`);
        if (panel && event.relatedTarget && panel.contains(event.relatedTarget)) {
          return;
        }
        item.classList.remove('submenu-open');
        if (openSubmenu === submenuName) {
          openSubmenu = null;
        }
      });
    });

    if (widgetContextMenu) {
      widgetContextMenu.addEventListener('mouseleave', () => {
        if (!isContextOpen) {
          return;
        }
        const openItem = widgetContextMenu.querySelector('.menu-item.submenu-open');
        openItem?.classList.remove('submenu-open');
        openSubmenu = null;
      });
    }

    widgetContainer.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      if (!contextMenuEnabled) {
        return;
      }
      widgetContainer.classList.toggle('context-open');
      isContextOpen = widgetContainer.classList.contains('context-open');
      updateExpandedState();
    });

    widgetContainer.addEventListener('mouseenter', () => {
      if (hoverOutTimeout) {
        clearTimeout(hoverOutTimeout);
        hoverOutTimeout = null;
      }
      isHovering = true;
      updateExpandedState();
    });

    widgetContainer.addEventListener('mouseleave', () => {
      if (hoverOutTimeout) {
        clearTimeout(hoverOutTimeout);
      }
      hoverOutTimeout = setTimeout(() => {
        isHovering = false;
        updateExpandedState();
        hoverOutTimeout = null;
      }, 150);
    });

    window.addEventListener('blur', () => {
      if (!isContextOpen) {
        return;
      }
      closeContextMenu();
    });

    document.addEventListener('pointerdown', (event) => {
      if (!isContextOpen) {
        return;
      }
      if (event.button !== 0 && event.button !== 2) {
        return;
      }
      if (!widgetContextMenu || !widgetContextMenu.contains(event.target)) {
        closeContextMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeContextMenu();
      }
    });

    if (widgetContextMenu) {
      widgetContextMenu.addEventListener('click', (event) => {
        const actionTarget = event.target.closest('[data-action]');
        const micTarget = event.target.closest('[data-mic-id]');
        const langTarget = event.target.closest('[data-language]');
        if (micTarget && micTarget.dataset.micId !== undefined) {
          saveWidgetSetting('microphoneId', micTarget.dataset.micId);
          event.stopPropagation();
          closeContextMenu();
          return;
        }
        if (langTarget && langTarget.dataset.language) {
          saveWidgetSetting('language', langTarget.dataset.language);
          event.stopPropagation();
          closeContextMenu();
          return;
        }
        if (!actionTarget) {
          return;
        }
        const action = actionTarget.dataset.action;
        if (action === 'hide-1h') {
          window.electronAPI.hideWidgetOneHour();
          event.stopPropagation();
          closeContextMenu();
          return;
        }
        if (action === 'open-settings') {
          window.electronAPI.openSettings();
          event.stopPropagation();
          closeContextMenu();
          return;
        }
        if (action === 'open-polish') {
          if (window.electronAPI.openPolishDiff) {
            window.electronAPI.openPolishDiff();
          }
          event.stopPropagation();
          closeContextMenu();
          return;
        }
        if (action === 'open-history') {
          window.electronAPI.openDashboardView('home');
          event.stopPropagation();
          closeContextMenu();
          return;
        }
        if (action === 'paste-latest') {
          window.electronAPI.pasteLatestTranscription();
          event.stopPropagation();
          closeContextMenu();
          return;
        }
        if (action === 'toggle-language') {
          toggleSubmenu('language');
          event.stopPropagation();
          return;
        }
        if (action === 'toggle-microphone') {
          toggleSubmenu('microphone');
          event.stopPropagation();
          return;
        }
      });
    }

    updateExpandedState();
  }

  if (recordingTooltipEl) {
    recordingTooltipEl.addEventListener('mousedown', (event) => {
      event.stopPropagation();
    });
    recordingTooltipEl.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!isRecording) {
        return;
      }
      if (cancelPending || cancelUndoActive) {
        return;
      }
      cancelPending = true;
      if (window.electronAPI.cancelRecording) {
        window.electronAPI.cancelRecording();
      }
    });
  }

  if (undoCancelButton) {
    undoCancelButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!pendingCancelPayload) {
        return;
      }
      const payload = pendingCancelPayload;
      clearCancelUndo();
      window.electronAPI.sendAudioReady(payload);
    });
  }

  if (cancelUndoEl) {
    cancelUndoEl.addEventListener('mouseenter', () => {
      pauseCancelUndoTimer();
    });
    cancelUndoEl.addEventListener('mouseleave', () => {
      resumeCancelUndoTimer();
    });
  }

  if (stopButton) {
    stopButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!isRecording) {
        return;
      }
      window.electronAPI.toggleRecording();
    });
  }

  initializeMediaRecorder().catch(() => {
    // Ignore: user may deny mic at startup
  });
});
