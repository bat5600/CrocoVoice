// Onboarding flow
const ONBOARDING_STEP_ORDER = ['welcome', 'microphone', 'delivery', 'done'];

function setOnboardingVisible(isVisible) {
  if (!onboardingOverlay) {
    return;
  }
  onboardingOverlay.classList.toggle('is-visible', Boolean(isVisible));
  onboardingOverlay.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
}

function setOnboardingStatus(message, { isError } = {}) {
  if (!onboardingStatus) {
    return;
  }
  const text = (message || '').trim();
  onboardingStatus.textContent = text;
  onboardingStatus.style.display = text ? 'block' : 'none';
  onboardingStatus.style.color = isError ? '#B91C1C' : '';
}

function renderOnboardingSteps() {
  if (!onboardingSteps) {
    return;
  }
  onboardingSteps.innerHTML = '';
  const labels = {
    welcome: 'Start',
    microphone: 'Micro',
    delivery: 'Livraison',
    done: 'Terminé',
  };
  const currentIndex = ONBOARDING_STEP_ORDER.indexOf(onboardingStep);
  ONBOARDING_STEP_ORDER.forEach((key, index) => {
    const pill = document.createElement('div');
    pill.className = 'onboarding-step';
    if (index < currentIndex) {
      pill.classList.add('done');
    } else if (key === onboardingStep) {
      pill.classList.add('active');
    }
    pill.textContent = labels[key] || key;
    onboardingSteps.appendChild(pill);
  });
}

async function persistOnboardingPatch(patch) {
  if (!window.electronAPI?.updateOnboardingState) {
    return null;
  }
  try {
    onboardingState = await window.electronAPI.updateOnboardingState(patch);
    return onboardingState;
  } catch {
    return null;
  }
}

async function setOnboardingStep(nextStep, { persist } = {}) {
  const step = ONBOARDING_STEP_ORDER.includes(nextStep) ? nextStep : 'welcome';
  onboardingStep = step;
  if (step === 'delivery' && onboardingPasteTarget) {
    onboardingPasteTarget.value = '';
  }
  renderOnboarding();
  if (persist !== false) {
    await persistOnboardingPatch({ step });
  }
}

function stopOnboardingWaveformLoop() {
  if (onboardingWaveRaf) {
    cancelAnimationFrame(onboardingWaveRaf);
    onboardingWaveRaf = null;
  }
}

function drawOnboardingWaveform() {
  if (!onboardingWaveform || !onboardingAnalyser) {
    return;
  }
  const ctx = onboardingWaveform.getContext('2d');
  if (!ctx) {
    return;
  }

  const bufferLength = onboardingAnalyser.fftSize;
  const dataArray = new Uint8Array(bufferLength);
  onboardingAnalyser.getByteTimeDomainData(dataArray);

  let sumSquares = 0;
  for (let i = 0; i < bufferLength; i += 1) {
    const value = (dataArray[i] - 128) / 128;
    sumSquares += value * value;
  }
  const rms = Math.sqrt(sumSquares / bufferLength);
  onboardingMicMaxRms = Math.max(onboardingMicMaxRms, rms);

  ctx.clearRect(0, 0, onboardingWaveform.width, onboardingWaveform.height);
  ctx.fillStyle = '#0B1220';
  ctx.fillRect(0, 0, onboardingWaveform.width, onboardingWaveform.height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#34D399';
  ctx.beginPath();

  const sliceWidth = onboardingWaveform.width / bufferLength;
  let x = 0;
  for (let i = 0; i < bufferLength; i += 1) {
    const v = dataArray[i] / 128.0;
    const y = (v * onboardingWaveform.height) / 2;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  ctx.lineTo(onboardingWaveform.width, onboardingWaveform.height / 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(148,163,184,0.65)';
  ctx.font = '12px sans-serif';
  ctx.fillText(onboardingMicActive ? 'Écoute…' : 'Prêt', 12, 22);
  ctx.fillText(`Niveau: ${(rms * 100).toFixed(0)}%`, 12, 42);

  onboardingWaveRaf = requestAnimationFrame(drawOnboardingWaveform);
}

async function startOnboardingMicCapture() {
  if (onboardingInFlight || onboardingMicActive) {
    return;
  }
  onboardingInFlight = true;
  setOnboardingStatus('Activation du micro…');
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('API micro indisponible.');
    }
    const selectedDeviceId = onboardingMicSelect?.value || '';
    const constraints = selectedDeviceId
      ? { audio: { deviceId: { exact: selectedDeviceId } } }
      : { audio: true };
    onboardingMicStream = await navigator.mediaDevices.getUserMedia(constraints);

    onboardingAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = onboardingAudioContext.createMediaStreamSource(onboardingMicStream);
    onboardingAnalyser = onboardingAudioContext.createAnalyser();
    onboardingAnalyser.fftSize = 2048;
    source.connect(onboardingAnalyser);

    onboardingMicMaxRms = 0;
    onboardingMicActive = true;
    setOnboardingStatus('Parlez maintenant, puis cliquez sur “Arrêter”.');
    stopOnboardingWaveformLoop();
    drawOnboardingWaveform();

    if (selectedDeviceId && currentSettings.microphoneId !== selectedDeviceId) {
      currentSettings = { ...currentSettings, microphoneId: selectedDeviceId };
      if (window.electronAPI?.saveSettings) {
        await window.electronAPI.saveSettings(sanitizeSettingsForSave(currentSettings));
      }
    }
  } catch (error) {
    const message = error?.message || error?.name || 'Accès micro refusé.';
    await persistOnboardingPatch({ micOk: false, lastMicError: message });
    setOnboardingStatus(`Microphone KO: ${message}`, { isError: true });
    showToast('Microphone indisponible. Vérifiez les autorisations Windows.', 'error');
    onboardingMicActive = false;
    stopOnboardingWaveformLoop();
  } finally {
    onboardingInFlight = false;
    renderOnboarding();
  }
}

async function stopOnboardingMicCapture() {
  if (onboardingInFlight || !onboardingMicActive) {
    return;
  }
  onboardingInFlight = true;
  setOnboardingStatus('Arrêt…');
  try {
    stopOnboardingWaveformLoop();
    if (onboardingMicStream) {
      onboardingMicStream.getTracks().forEach((track) => track.stop());
    }
    onboardingMicStream = null;

    if (onboardingAudioContext) {
      try {
        await onboardingAudioContext.close();
      } catch {
        // ignore
      }
    }
    onboardingAudioContext = null;
    onboardingAnalyser = null;

    onboardingMicActive = false;

    const ok = onboardingMicMaxRms > 0.02;
    if (ok) {
      await persistOnboardingPatch({ micOk: true, lastMicError: null });
      setOnboardingStatus('Microphone OK.');
      showToast('Microphone OK.');
    } else {
      await persistOnboardingPatch({ micOk: false, lastMicError: 'Aucun son détecté.' });
      setOnboardingStatus('Aucun son détecté. Vérifiez le micro et réessayez.', { isError: true });
      showToast('Aucun son détecté.', 'error');
    }
  } finally {
    onboardingInFlight = false;
    renderOnboarding();
  }
}

async function runOnboardingDeliveryTest() {
  if (onboardingInFlight) {
    return;
  }
  if (!window.electronAPI?.runOnboardingDeliveryTest) {
    setOnboardingStatus('Test indisponible.', { isError: true });
    return;
  }
  onboardingInFlight = true;
  if (!onboardingPasteTarget) {
    onboardingInFlight = false;
    setOnboardingStatus('Zone de test indisponible.', { isError: true });
    showToast('Zone de test indisponible.', 'error');
    return;
  }
  const code = Math.floor(100000 + Math.random() * 900000);
  const text = `CrocoVoice — test de collage #${code}`;
  onboardingDeliveryTestText = text;
  const seconds = 3;
  setOnboardingStatus(`Cliquez dans la zone de test. Collage dans ${seconds}s…`);
  showToast('Collage dans 3 secondes…');

  try {
    onboardingPasteTarget.value = '';
    onboardingPasteTarget.focus();
    for (let remaining = seconds; remaining > 0; remaining -= 1) {
      setOnboardingStatus(`Test de livraison dans ${remaining}s…`);
      await delay(1000);
    }
    setOnboardingStatus('Livraison en cours…');
    const result = await window.electronAPI.runOnboardingDeliveryTest({ text });
    await delay(200);
    const pasted = (onboardingPasteTarget.value || '').trim();
    const pasteOk = pasted.includes(text);
    if (result?.ok && pasteOk) {
      await persistOnboardingPatch({ deliveryOk: true, lastDeliveryError: null });
      setOnboardingStatus('Livraison OK.');
      showToast('Livraison OK.');
    } else {
      const reason = result?.ok && !pasteOk
        ? 'Le collage a été envoyé, mais rien n’a été inséré dans la zone. Cliquez dedans et réessayez.'
        : (result?.error || 'Échec livraison');
      await persistOnboardingPatch({ deliveryOk: false, lastDeliveryError: reason });
      setOnboardingStatus('Collage KO. Le texte est copié dans le presse-papiers.', { isError: true });
      showToast('Collage KO. Texte copié.', 'error');
    }
  } catch (error) {
    await persistOnboardingPatch({ deliveryOk: false, lastDeliveryError: error?.message || 'Échec livraison' });
    setOnboardingStatus('Collage KO. Texte copié dans le presse-papiers.', { isError: true });
    showToast('Collage KO. Texte copié.', 'error');
  } finally {
    onboardingInFlight = false;
    renderOnboarding();
  }
}

async function completeOnboarding() {
  if (!window.electronAPI?.completeOnboarding) {
    setOnboardingVisible(false);
    return;
  }
  onboardingInFlight = true;
  setOnboardingStatus('Finalisation…');
  try {
    onboardingState = await window.electronAPI.completeOnboarding();
    setOnboardingVisible(false);
    showToast('Onboarding terminé.');
  } catch {
    setOnboardingVisible(false);
  } finally {
    onboardingInFlight = false;
  }
}

function renderOnboarding() {
  if (!onboardingOverlay || !onboardingTitle || !onboardingSubtitle || !onboardingPrimary || !onboardingSecondary) {
    return;
  }

  const completed = Boolean(onboardingState?.completed);
  if (completed) {
    setOnboardingVisible(false);
    return;
  }

  if (onboardingMicSection) {
    onboardingMicSection.style.display = onboardingStep === 'microphone' ? 'block' : 'none';
  }
  if (onboardingDeliverySection) {
    onboardingDeliverySection.style.display = onboardingStep === 'delivery' ? 'block' : 'none';
  }

  renderOnboardingSteps();
  const micOk = Boolean(onboardingState?.micOk);
  const deliveryOk = Boolean(onboardingState?.deliveryOk);

  if (onboardingStep === 'welcome') {
    onboardingTitle.textContent = 'Bienvenue sur CrocoVoice';
    onboardingSubtitle.textContent = 'On valide 2 points : micro OK, puis livraison OK (collage ou clipboard en secours).';
    onboardingSecondary.textContent = 'Plus tard';
    onboardingPrimary.textContent = 'Commencer';
    onboardingPrimary.disabled = false;
  } else if (onboardingStep === 'microphone') {
    onboardingTitle.textContent = 'Microphone';
    onboardingSubtitle.textContent = 'Autorisez l’accès micro pour enregistrer votre voix.';
    onboardingSecondary.textContent = 'Plus tard';
    onboardingPrimary.textContent = micOk ? 'Continuer' : 'Continuer';
    onboardingPrimary.disabled = !micOk;
  } else if (onboardingStep === 'delivery') {
    onboardingTitle.textContent = 'Livraison du texte';
    onboardingSubtitle.textContent = 'On teste le collage dans une zone vide. Si ça échoue, le texte est copié.';
    onboardingSecondary.textContent = 'Copier';
    onboardingPrimary.textContent = deliveryOk ? 'Continuer' : 'Tester le collage';
    onboardingPrimary.disabled = false;
  } else {
    onboardingTitle.textContent = 'C’est bon';
    onboardingSubtitle.textContent = 'Vous êtes prêt. Lancez une dictée, et CrocoVoice livrera toujours quelque chose.';
    onboardingSecondary.textContent = 'Réglages';
    onboardingPrimary.textContent = 'Terminer';
    onboardingPrimary.disabled = false;
  }

  if (onboardingInFlight) {
    onboardingPrimary.disabled = true;
    onboardingSecondary.disabled = true;
  } else {
    onboardingSecondary.disabled = false;
  }

  if (onboardingMicStart) {
    onboardingMicStart.disabled = onboardingInFlight || onboardingMicActive;
  }
  if (onboardingMicStop) {
    onboardingMicStop.disabled = onboardingInFlight || !onboardingMicActive;
  }
}

async function maybeShowOnboarding() {
  if (!onboardingOverlay) {
    return;
  }
  const state = onboardingState || dashboardData?.onboarding;
  if (!state || state.completed) {
    return;
  }
  onboardingState = state;
  onboardingStep = ONBOARDING_STEP_ORDER.includes(state.step) ? state.step : 'welcome';
  setOnboardingVisible(true);
  setOnboardingStatus('');
  renderOnboarding();
}
