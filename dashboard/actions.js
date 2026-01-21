// Actions and data handlers
function isSubscriptionActive(subscription) {
  if (!subscription) {
    return false;
  }
  if (subscription.isPro) {
    return true;
  }
  return subscription.status === 'active' || subscription.status === 'trialing';
}
async function refreshSubscriptionData() {
  if (!window.electronAPI?.refreshSubscription) {
    return { ok: false, reason: 'not_available' };
  }
  try {
    const result = await window.electronAPI.refreshSubscription();
    if (!result?.ok) {
      return { ok: false, reason: result?.reason || 'error' };
    }
    await refreshDashboard();
    return { ok: true, subscription: dashboardData?.subscription };
  } catch (error) {
    return { ok: false, reason: 'error' };
  }
}
async function startSubscriptionActivationCheck({ force } = {}) {
  if (subscriptionPollInFlight) {
    return;
  }
  const subscription = dashboardData?.subscription;
  if (isSubscriptionActive(subscription)) {
    return;
  }
  if (!force) {
    if (!subscription || subscription.status !== 'pending') {
      return;
    }
    const now = Date.now();
    if (now - lastSubscriptionPollAt < SUBSCRIPTION_POLL_COOLDOWN_MS) {
      return;
    }
    lastSubscriptionPollAt = now;
  }

  subscriptionPollInFlight = true;
  const token = ++subscriptionPollToken;
  lastSubscriptionPollAt = Date.now();
  showToast('Activation en cours...');

  for (let attempt = 0; attempt < SUBSCRIPTION_POLL_MAX_ATTEMPTS; attempt += 1) {
    const result = await refreshSubscriptionData();
    if (token !== subscriptionPollToken) {
      break;
    }
    if (result?.ok && isSubscriptionActive(dashboardData?.subscription)) {
      showToast('Abonnement PRO activé.');
      break;
    }
    if (result?.reason === 'not_authenticated') {
      showToast('Connectez-vous pour finaliser l’abonnement.', 'error');
      break;
    }
    if (result?.reason === 'not_configured') {
      showToast('Actualisation indisponible.', 'error');
      break;
    }
    if (attempt < SUBSCRIPTION_POLL_MAX_ATTEMPTS - 1) {
      await delay(SUBSCRIPTION_POLL_DELAY_MS);
    }
  }

  subscriptionPollInFlight = false;
}
async function triggerCheckout(button) {
  if (!window.electronAPI?.startCheckout) {
    showToast('Checkout indisponible.', 'error');
    return;
  }
  const auth = window.electronAPI?.authStatus ? await window.electronAPI.authStatus() : null;
  if (!auth) {
    showToast('Connectez-vous pour passer PRO.', 'error');
    if (window.electronAPI?.openSignupUrl) {
      await window.electronAPI.openSignupUrl('login');
    }
    return;
  }
  try {
    setButtonLoading(button, true, 'Ouverture...');
    const result = await window.electronAPI.startCheckout();
    if (!result?.ok) {
      showToast('Checkout non configuré.', 'error');
      return;
    }
    showToast('Redirection vers Stripe...');
    await refreshDashboard();
    startSubscriptionActivationCheck({ force: true });
  } catch (error) {
    showToast(error?.message || 'Checkout impossible.', 'error');
  } finally {
    setButtonLoading(button, false);
  }
}
async function handleNoteDictation() {
  if (!noteBodyInput) {
    return;
  }
  if (noteCaptureActive) {
    toggleRecordingVisuals(false);
    if (window.electronAPI?.toggleRecording) {
      window.electronAPI.toggleRecording();
    }
    return;
  }
  toggleRecordingVisuals(true);
  noteBodyInput.focus();
  if (window.electronAPI?.setRecordingTarget) {
    await window.electronAPI.setRecordingTarget('notes');
  }
  if (window.electronAPI?.toggleRecording) {
    window.electronAPI.toggleRecording();
  }
}

async function handleCreateNote() {
  if (!noteBodyInput) {
    return;
  }
  const content = noteBodyInput.value.trim();
  if (!content) {
    showToast('La note est vide.', 'error');
    return;
  }

  const payload = { text: content, metadata: { source: 'manual' } };
  if (noteTitleInput?.value.trim()) {
    payload.title = noteTitleInput.value.trim();
  }

  if (createNoteButton) {
    createNoteButton.disabled = true;
  }

  try {
    if (!window.electronAPI?.addNote) {
      throw new Error('API indisponible');
    }
    await window.electronAPI.addNote(payload);
    if (noteTitleInput) {
      noteTitleInput.value = '';
    }
    noteBodyInput.value = '';
    showToast('Note sauvegardée.');
    await refreshDashboard();
  } catch (error) {
    console.error(error);
    showToast('Erreur sauvegarde.', 'error');
  } finally {
    if (createNoteButton) {
      createNoteButton.disabled = false;
    }
  }
}
async function submitAuthLogin() {
  if (!window.electronAPI?.authSignIn) {
    setOverlayStatus('Connexion indisponible.', true);
    return;
  }
  const email = authOverlayEmail?.value.trim();
  const password = authOverlayPassword?.value || '';
  if (!email || !password) {
    setOverlayStatus('Veuillez saisir email et mot de passe.', true);
    return;
  }

  authSubmitPending = true;
  applyAuthState(currentAuthState);
  setOverlayStatus('Connexion en cours...', false);
  try {
    await window.electronAPI.authSignIn(email, password);
    if (authOverlayPassword) {
      authOverlayPassword.value = '';
    }
  } catch (error) {
    setOverlayStatus(error?.message || 'Echec de connexion.', true);
  } finally {
    authSubmitPending = false;
    applyAuthState(currentAuthState);
  }
}
async function populateMicrophones() {
  if ((!microphoneSelect && !onboardingMicSelect) || !navigator.mediaDevices?.enumerateDevices) {
    return;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const mics = devices.filter((device) => device.kind === 'audioinput');
    const selects = [microphoneSelect, onboardingMicSelect].filter(Boolean);
    selects.forEach((select) => {
      select.innerHTML = '<option value="">Défaut système</option>';
      mics.forEach((mic) => {
        const option = document.createElement('option');
        option.value = mic.deviceId;
        option.textContent = mic.label || `Micro ${mic.deviceId.slice(0, 4)}...`;
        select.appendChild(option);
      });
      if (currentSettings.microphoneId) {
        select.value = currentSettings.microphoneId;
      }
    });
  } catch (error) {
    console.error('Failed to list microphones:', error);
  }
}
function handleSettingChange(event) {
  const { setting } = event.target.dataset;
  if (!setting) {
    return;
  }
  if (setting === 'shortcut') {
    return;
  }

  let value = event.target.value;
  if (setting === 'postProcessEnabled') {
    value = value === 'true';
  }

  currentSettings = { ...currentSettings, [setting]: value };
  if (window.electronAPI?.saveSettings) {
    window.electronAPI.saveSettings(sanitizeSettingsForSave(currentSettings));
  }
}
function getDefaultShortcut() {
  return platform === 'darwin' ? 'Command+Shift+R' : 'Ctrl+Shift+R';
}
function normalizeShortcutKey(key) {
  if (!key) {
    return '';
  }
  const map = {
    ' ': 'Space',
    Escape: 'Escape',
    Tab: 'Tab',
    Enter: 'Enter',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
  };
  if (map[key]) {
    return map[key];
  }
  if (/^F\d{1,2}$/i.test(key)) {
    return key.toUpperCase();
  }
  if (key.length === 1) {
    if (/[a-z0-9]/i.test(key)) {
      return key.toUpperCase();
    }
    return '';
  }
  return '';
}
function buildAcceleratorFromEvent(event) {
  const rawKey = event.key;
  if (!rawKey || rawKey === 'Dead') {
    return null;
  }
  const ignored = new Set(['Shift', 'Control', 'Alt', 'Meta']);
  if (ignored.has(rawKey)) {
    return null;
  }

  const key = normalizeShortcutKey(rawKey);
  if (!key) {
    return null;
  }

  const modifiers = [];
  if (platform === 'darwin') {
    if (event.metaKey) {
      modifiers.push('Command');
    }
    if (event.ctrlKey) {
      modifiers.push('Ctrl');
    }
    if (event.altKey) {
      modifiers.push('Option');
    }
    if (event.shiftKey) {
      modifiers.push('Shift');
    }
  } else {
    if (event.ctrlKey) {
      modifiers.push('Ctrl');
    }
    if (event.altKey) {
      modifiers.push('Alt');
    }
    if (event.shiftKey) {
      modifiers.push('Shift');
    }
  }

  if (!modifiers.length) {
    return null;
  }
  return [...modifiers, key].join('+');
}
function setShortcutCaptureState(active) {
  shortcutCaptureActive = Boolean(active);
  if (shortcutCaptureActive) {
    shortcutInvalidShown = false;
  }
  if (shortcutInput) {
    shortcutInput.classList.toggle('is-capturing', shortcutCaptureActive);
  }
  if (shortcutHelp) {
    shortcutHelp.textContent = shortcutCaptureActive
      ? 'Appuyez sur la combinaison (Esc pour annuler).'
      : 'Cliquez dans le champ puis appuyez sur votre combinaison.';
  }
}
async function saveShortcut(shortcut) {
  if (!window.electronAPI?.saveSettings) {
    return;
  }
  const previous = currentSettings.shortcut;
  if (!shortcut || shortcut === previous) {
    return;
  }
  if (shortcutInput) {
    shortcutInput.disabled = true;
  }
  try {
    const next = await window.electronAPI.saveSettings(sanitizeSettingsForSave({ ...currentSettings, shortcut }));
    currentSettings = { ...currentSettings, ...(next || {}) };
    renderSettings(currentSettings);
    if (currentSettings.shortcut !== shortcut) {
      showToast('Impossible d’enregistrer ce raccourci. L’ancien reste actif.', 'error');
      return;
    }
    showToast('Raccourci mis à jour.');
  } catch (error) {
    currentSettings = { ...currentSettings, shortcut: previous };
    renderSettings(currentSettings);
    showToast(error?.message || 'Impossible de sauvegarder le raccourci.', 'error');
  } finally {
    if (shortcutInput) {
      shortcutInput.disabled = false;
    }
  }
}
async function refreshDashboard() {
  if (!window.electronAPI) {
    return;
  }
  renderHistoryLoading();
  try {
    dashboardData = await window.electronAPI.getDashboardData();
  } catch (error) {
    renderHistoryError('Erreur de chargement. Réessayez.');
    showToast('Impossible de charger le dashboard.', 'error');
    return;
  }
  currentSettings = dashboardData.settings || {};
  onboardingState = dashboardData.onboarding || onboardingState;

  renderStats(dashboardData.stats);
  renderQuota(dashboardData.quota);
  historyData = dashboardData.history || [];
  notesData = dashboardData.notes || [];
  refreshActiveList();
  renderDictionary(dashboardData.dictionary);
  renderStyles(dashboardData.styles);
  renderSettings(currentSettings);
  renderAuth(dashboardData.auth, dashboardData.syncReady);
  renderSubscription(dashboardData.subscription, dashboardData.auth);
  await populateMicrophones();
  startSubscriptionActivationCheck();
  maybeShowOnboarding();
}
async function resetOnboardingAndShow() {
  if (!window.electronAPI?.resetOnboarding) {
    showToast('Onboarding indisponible.', 'error');
    return;
  }
  try {
    onboardingState = await window.electronAPI.resetOnboarding();
    onboardingStep = 'welcome';
    setOnboardingStatus('');
    setOnboardingVisible(true);
    renderOnboarding();
    showToast('Onboarding relancé.');
  } catch (error) {
    showToast(error?.message || "Impossible de relancer l'onboarding.", 'error');
  }
}
