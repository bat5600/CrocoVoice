/**
 * Renderer Process - handles audio recording and IPC
 */

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
let discardRecording = false;
let cancelButton = null;
let stopButton = null;
let authGateEl = null;
let authForm = null;
let authEmailInput = null;
let authPasswordInput = null;
let authStatusText = null;
let authSubmitButton = null;
let authRetryButton = null;
let authSignupButton = null;
let currentAuthState = null;

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

function applyAuthState(state) {
  currentAuthState = state || {};
  const status = currentAuthState.status || 'checking';
  const authed = status === 'authenticated';
  document.body.classList.toggle('auth-gated', !authed);
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

  const disableForm = status === 'checking' || status === 'not_configured';
  if (authEmailInput) {
    authEmailInput.disabled = disableForm;
  }
  if (authPasswordInput) {
    authPasswordInput.disabled = disableForm;
  }
  if (authSubmitButton) {
    authSubmitButton.disabled = disableForm;
  }
  if (authRetryButton) {
    authRetryButton.disabled = status === 'checking' || status === 'not_configured';
    authRetryButton.style.display = currentAuthState.retryable ? 'inline-flex' : 'none';
  }
  if (authSignupButton) {
    authSignupButton.disabled = status === 'checking' || status === 'not_configured';
    authSignupButton.style.display = status === 'unauthenticated' ? 'inline-flex' : 'none';
  }
}

async function setupWaveform(stream) {
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

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 1024;
  waveformData = new Uint8Array(analyserNode.fftSize);

  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyserNode);
}

function drawWaveform() {
  if (!analyserNode || !waveformCtx || !waveformCanvas || !waveformData) {
    return;
  }

  analyserNode.getByteTimeDomainData(waveformData);

  const { width, height } = waveformCanvas;
  waveformCtx.clearRect(0, 0, width, height);
  waveformCtx.lineWidth = 2;
  const rootStyle = getComputedStyle(document.documentElement);
  waveformCtx.strokeStyle = rootStyle.getPropertyValue('--croco-green').trim() || '#36d96f';
  waveformCtx.beginPath();

  const sliceWidth = width / waveformData.length;
  let x = 0;

  for (let i = 0; i < waveformData.length; i += 1) {
    const v = waveformData[i] / 128.0;
    const y = (v * height) / 2;

    if (i === 0) {
      waveformCtx.moveTo(x, y);
    } else {
      waveformCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  waveformCtx.stroke();
}

function startWaveform() {
  if (!analyserNode || !waveformCtx || !waveformCanvas) {
    return;
  }

  if (waveformAnimationId) {
    cancelAnimationFrame(waveformAnimationId);
  }

  const render = () => {
    drawWaveform();
    waveformAnimationId = requestAnimationFrame(render);
  };

  render();
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

async function initializeMediaRecorder() {
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

    window.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        window.audioChunks.push(event.data);
      }
    };

    window.mediaRecorder.onstop = async () => {
      const blob = new Blob(window.audioChunks, { type: window.mediaRecorder.mimeType || 'audio/webm' });

      const shouldSend = !discardRecording;
      discardRecording = false;
      if (shouldSend) {
        const ab = await blob.arrayBuffer();
        window.electronAPI.sendAudioReady({ buffer: Array.from(new Uint8Array(ab)), mimeType: blob.type });
      }

      window.audioChunks = [];

      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        audioStream = null;
      }

      analyserNode = null;
      stopWaveform();
      mediaRecorder = null;
    };

    mediaRecorder.onerror = (event) => {
      window.electronAPI.sendRecordingError(event.error.message);
      stopRecording();
    };

    return true;
  } catch (error) {
    window.electronAPI.sendRecordingError(error.message);
    return false;
  }
}

async function startRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    return;
  }

  isRecording = true;

  if (!mediaRecorder) {
    const initialized = await initializeMediaRecorder();
    if (!initialized) {
      isRecording = false;
      return;
    }
  }

  audioChunks = [];
  window.audioChunks = [];
  discardRecording = false;
  mediaRecorder.start(1000);
  startWaveform();
}

function stopRecording() {
  if (!isRecording) {
    return;
  }

  isRecording = false;

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

window.electronAPI.onStatusChange((status, message) => {
  isRecording = status === 'recording';
  updateWidgetState(status, message);
});

window.electronAPI.onTranscriptionSuccess(() => {
  // No-op: state handled by main process
});

window.electronAPI.onTranscriptionError(() => {});

document.addEventListener('DOMContentLoaded', () => {
  waveformCanvas = document.getElementById('waveformCanvas');
  statusTextEl = document.getElementById('statusText');
  shortcutLabelEl = document.getElementById('shortcutLabel');
  cancelButton = document.getElementById('cancelRecordingButton');
  stopButton = document.getElementById('stopRecordingButton');
  authGateEl = document.getElementById('authGate');
  authForm = document.getElementById('authForm');
  authEmailInput = document.getElementById('authEmailInput');
  authPasswordInput = document.getElementById('authPasswordInput');
  authStatusText = document.getElementById('authStatusText');
  authSubmitButton = document.getElementById('authSubmitButton');
  authRetryButton = document.getElementById('authRetryButton');
  authSignupButton = document.getElementById('authSignupButton');
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

  if (authForm) {
    authForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!window.electronAPI?.authSignIn) {
        return;
      }
      const email = authEmailInput?.value.trim();
      const password = authPasswordInput?.value || '';
      if (!email || !password) {
        setAuthStatus('Email et mot de passe requis.', true);
        return;
      }
      setAuthStatus('Connexion en cours...', false);
      try {
        await window.electronAPI.authSignIn(email, password);
      } catch (error) {
        setAuthStatus(error?.message || 'Echec de connexion.', true);
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

  if (authSignupButton) {
    authSignupButton.addEventListener('click', async () => {
      if (!window.electronAPI?.openSignupUrl) {
        return;
      }
      await window.electronAPI.openSignupUrl();
    });
  }

  if (window.electronAPI.getSettings) {
    window.electronAPI.getSettings().then((settings) => {
      currentSettings = settings || {};
      updateShortcutLabel(settings.shortcut);
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
    });
  }

  const widgetContainer = document.getElementById('widgetContainer');
  if (widgetContainer) {
    let isContextOpen = false;
    let isHovering = false;

    const updateExpandedState = () => {
      if (window.electronAPI && window.electronAPI.setWidgetExpanded) {
        window.electronAPI.setWidgetExpanded(isContextOpen || isHovering);
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
      updateExpandedState();
    };

    widgetContainer.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      widgetContainer.classList.toggle('context-open');
      isContextOpen = widgetContainer.classList.contains('context-open');
      updateExpandedState();
    });

    widgetContainer.addEventListener('mouseenter', () => {
      isHovering = true;
      updateExpandedState();
    });

    widgetContainer.addEventListener('mouseleave', () => {
      isHovering = false;
      updateExpandedState();
    });

    document.addEventListener('click', (event) => {
      if (!widgetContainer.contains(event.target)) {
        closeContextMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeContextMenu();
      }
    });

    const contextMenu = widgetContainer.querySelector('.context-menu');
    if (contextMenu) {
      contextMenu.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) {
          return;
        }
        const action = target.dataset.action;
        if (action === 'hide-1h') {
          window.electronAPI.hideWidgetOneHour();
        } else if (action === 'open-settings') {
          window.electronAPI.openSettings();
        } else if (action === 'open-history') {
          window.electronAPI.openDashboardView('home');
        } else if (action === 'paste-latest') {
          window.electronAPI.pasteLatestTranscription();
        } else if (action === 'open-language') {
          window.electronAPI.openDashboardView('settings');
        } else if (action === 'open-microphone') {
          window.electronAPI.openDashboardView('settings');
        }
        event.stopPropagation();
        closeContextMenu();
      });
    }

    updateExpandedState();
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!isRecording) {
        return;
      }
      discardRecording = true;
      if (window.electronAPI.cancelRecording) {
        window.electronAPI.cancelRecording();
      }
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
