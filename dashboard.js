const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item[data-view]');
const settingsInputs = document.querySelectorAll('[data-setting]');
const apiKeyStatus = document.getElementById('apiKeyStatus');
const historyList = document.getElementById('historyList');
const historyEmpty = document.getElementById('historyEmpty');
const notesList = document.getElementById('notesList');
const notesEmpty = document.getElementById('notesEmpty');
const dictionaryList = document.getElementById('dictionaryList');
const dictionaryEmpty = document.getElementById('dictionaryEmpty');
const snippetsList = document.getElementById('snippetsList');
const snippetsEmpty = document.getElementById('snippetsEmpty');
const snippetCueInput = document.getElementById('snippetCueInput');
const snippetTemplateInput = document.getElementById('snippetTemplateInput');
const snippetDescriptionInput = document.getElementById('snippetDescriptionInput');
const snippetCancelButton = document.getElementById('snippetCancelButton');
const snippetAddButton = document.getElementById('snippetAddButton');
const styleList = document.getElementById('styleList');
const styleEmpty = document.getElementById('styleEmpty');
const contextEnabledToggle = document.getElementById('contextEnabledToggle');
const contextPostProcessToggle = document.getElementById('contextPostProcessToggle');
const contextSignalApp = document.getElementById('contextSignalApp');
const contextSignalWindow = document.getElementById('contextSignalWindow');
const contextSignalUrl = document.getElementById('contextSignalUrl');
const contextSignalAx = document.getElementById('contextSignalAx');
const contextSignalTextbox = document.getElementById('contextSignalTextbox');
const contextSignalScreenshot = document.getElementById('contextSignalScreenshot');
const contextRetentionInput = document.getElementById('contextRetentionInput');
const contextRetentionSave = document.getElementById('contextRetentionSave');
const contextDeleteAll = document.getElementById('contextDeleteAll');
const contextActiveApp = document.getElementById('contextActiveApp');
const contextActiveWindow = document.getElementById('contextActiveWindow');
const contextActiveUrl = document.getElementById('contextActiveUrl');
const contextOverrideMode = document.getElementById('contextOverrideMode');
const contextOverrideProfile = document.getElementById('contextOverrideProfile');
const contextOverrideSignalApp = document.getElementById('contextOverrideSignalApp');
const contextOverrideSignalWindow = document.getElementById('contextOverrideSignalWindow');
const contextOverrideSignalUrl = document.getElementById('contextOverrideSignalUrl');
const contextOverrideSignalAx = document.getElementById('contextOverrideSignalAx');
const contextOverrideSignalTextbox = document.getElementById('contextOverrideSignalTextbox');
const contextOverrideSignalScreenshot = document.getElementById('contextOverrideSignalScreenshot');
const contextSuggestion = document.getElementById('contextSuggestion');
const contextSuggestionApply = document.getElementById('contextSuggestionApply');
const contextProfileCreate = document.getElementById('contextProfileCreate');
const contextProfileList = document.getElementById('contextProfileList');
const contextPreviewProfile = document.getElementById('contextPreviewProfile');
const contextPreviewButton = document.getElementById('contextPreviewButton');
const contextPreviewInput = document.getElementById('contextPreviewInput');
const contextPreviewOutput = document.getElementById('contextPreviewOutput');
const authPanel = document.getElementById('authPanel');
const microphoneSelect = document.getElementById('microphoneSelect');
const misspellingToggle = document.getElementById('misspellingToggle');
const dictionaryWordInput = document.getElementById('dictionaryWordInput');
const dictionaryCorrectionInput = document.getElementById('dictionaryCorrectionInput');
const dictionaryCancelButton = document.getElementById('dictionaryCancelButton');
const dictionaryAddButton = document.getElementById('dictionaryAddButton');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');
const createNoteButton = document.getElementById('createNoteButton');
const noteFocusOverlay = document.getElementById('noteFocusOverlay');
const noteFocusBack = document.getElementById('noteFocusBack');
const noteFocusTitle = document.getElementById('noteFocusTitle');
const noteFocusEditor = document.getElementById('noteFocusEditor');
const noteFocusToolbar = document.getElementById('noteFocusToolbar');
const noteFocusTimestamp = document.getElementById('noteFocusTimestamp');
const noteFocusSource = document.getElementById('noteFocusSource');
const noteFocusStatus = document.getElementById('noteFocusStatus');
const toastContainer = document.getElementById('toastContainer');
const searchInput = document.getElementById('dashboardSearchInput');
const breadcrumbPrimary = document.getElementById('breadcrumbPrimary');
const breadcrumbSecondary = document.getElementById('breadcrumbSecondary');
const authOverlay = document.getElementById('authOverlay');
const authOverlayStatus = document.getElementById('authOverlayStatus');
const authOverlayLogin = document.getElementById('authOverlayLogin');
const authOverlayRetry = document.getElementById('authOverlayRetry');
const authOverlaySignup = document.getElementById('authOverlaySignup');
const authOverlayForm = document.getElementById('authOverlayForm');
const authOverlayEmail = document.getElementById('authOverlayEmail');
const authOverlayPassword = document.getElementById('authOverlayPassword');
const statDays = document.getElementById('statDays');
const statWords = document.getElementById('statWords');
const statTotal = document.getElementById('statTotal');
const streakSubtitle = document.getElementById('streakSubtitle');
const quotaRemaining = document.getElementById('quotaRemaining');
const quotaReset = document.getElementById('quotaReset');
const upgradeNudge = document.getElementById('upgradeNudge');
const upgradeNudgeRemaining = document.getElementById('upgradeNudgeRemaining');
const upgradeNudgeFill = document.getElementById('upgradeNudgeFill');
const upgradeNudgeCaption = document.getElementById('upgradeNudgeCaption');
const upgradeNudgeButton = document.getElementById('upgradeNudgeButton');
const profileName = document.getElementById('profileName');
const profilePlan = document.getElementById('profilePlan');
const profileAvatar = document.getElementById('profileAvatar');
const profileCard = document.getElementById('profileCard');
const subscriptionStatus = document.getElementById('subscriptionStatus');
const subscriptionBadge = document.getElementById('subscriptionBadge');
const subscriptionNote = document.getElementById('subscriptionNote');
const upgradePlanButton = document.getElementById('upgradePlanButton');
const manageSubscriptionButton = document.getElementById('manageSubscriptionButton');
const refreshSubscriptionButton = document.getElementById('refreshSubscriptionButton');
const shortcutInput = document.getElementById('shortcutInput');
const shortcutResetButton = document.getElementById('shortcutResetButton');
const shortcutHelp = document.getElementById('shortcutHelp');
const syncNowButton = document.getElementById('syncNowButton');
const syncStatus = document.getElementById('syncStatus');
const onboardingResetButton = document.getElementById('onboardingResetButton');
const onboardingOverlay = document.getElementById('onboardingOverlay');
const onboardingStepper = document.getElementById('onboardingStepper');
const onboardingPanels = document.querySelectorAll('.onboarding-panel[data-step]');
const onboardingStartButton = document.getElementById('onboardingStart');
const onboardingSkipButton = document.getElementById('onboardingSkip');
const onboardingPermissionButton = document.getElementById('onboardingPermissionButton');
const onboardingPrivacyLink = document.getElementById('onboardingPrivacyLink');
const onboardingPermissionStatus = document.getElementById('onboardingPermissionStatus');
const onboardingVuBar = document.getElementById('onboardingVuBar');
const onboardingMicStatus = document.getElementById('onboardingMicStatus');
const onboardingMicContinue = document.getElementById('onboardingMicContinue');
const onboardingMicrophoneSelect = document.getElementById('onboardingMicrophoneSelect');
const onboardingMicrophoneApply = document.getElementById('onboardingMicrophoneApply');
const onboardingHotkeyInput = document.getElementById('onboardingHotkeyInput');
const onboardingHotkeyNext = document.getElementById('onboardingHotkeyNext');
const onboardingHotkeyStatus = document.getElementById('onboardingHotkeyStatus');
const onboardingSandbox = document.getElementById('onboardingSandbox');
const onboardingDictateButton = document.getElementById('onboardingDictateButton');
const onboardingFirstRunNext = document.getElementById('onboardingFirstRunNext');
const onboardingDictationStatus = document.getElementById('onboardingDictationStatus');
const onboardingSuccessBadge = document.getElementById('onboardingSuccessBadge');
const onboardingDeliveryInput = document.getElementById('onboardingDeliveryInput');
const onboardingDeliveryTestButton = document.getElementById('onboardingDeliveryTestButton');
const onboardingDeliveryNext = document.getElementById('onboardingDeliveryNext');
const onboardingDeliveryStatus = document.getElementById('onboardingDeliveryStatus');
const onboardingFinishButton = document.getElementById('onboardingFinishButton');
const onboardingCheckPermission = document.getElementById('onboardingCheckPermission');
const onboardingCheckSignal = document.getElementById('onboardingCheckSignal');
const onboardingCheckHotkey = document.getElementById('onboardingCheckHotkey');
const onboardingCheckDictation = document.getElementById('onboardingCheckDictation');
const onboardingCheckDelivery = document.getElementById('onboardingCheckDelivery');
const uploadAudioButton = document.getElementById('uploadAudioButton');
const uploadDropzone = document.getElementById('uploadDropzone');
const uploadQueue = document.getElementById('uploadQueue');
const diagnosticsRunChecks = document.getElementById('diagnosticsRunChecks');
const diagnosticsOutput = document.getElementById('diagnosticsOutput');
const diagnosticsChecks = document.getElementById('diagnosticsChecks');
const diagnosticsCopy = document.getElementById('diagnosticsCopy');
const diffBefore = document.getElementById('diffBefore');
const diffAfter = document.getElementById('diffAfter');

let currentSettings = {};
let dashboardData = null;
let currentView = 'home';
let searchTerm = '';
let historyData = [];
let notesData = [];
let snippetsData = [];
let dictionaryData = [];
let modalResolver = null;
let platform = 'win32';
let shortcutCaptureActive = false;
let shortcutBeforeCapture = '';
let shortcutInvalidShown = false;
let historyLoadError = false;
let searchDebounceId = null;
let quotaSnapshot = null;
let currentSubscription = null;
let currentAuth = null;
let onboardingState = { step: 'welcome', completed: false, firstRunSuccess: false, hotkeyReady: false, updatedAt: null };
let onboardingSessionDismissed = false;
let onboardingMicReady = false;
let onboardingPermissionGranted = false;
let onboardingMicLevel = 0;
let diagnosticsSnapshot = null;
let diagnosticsChecksState = null;
let diffData = { before: '', after: '' };

const DEFAULT_CONTEXT_SETTINGS = {
  enabled: true,
  postProcessEnabled: false,
  retentionDays: 30,
  signals: {
    app: true,
    window: true,
    url: true,
    ax: false,
    textbox: false,
    screenshot: false,
  },
  overrides: {},
};
let onboardingMicLastActiveAt = 0;
let onboardingRecordingActive = false;
let onboardingDeliveryReady = false;
let onboardingShortcutCaptureActive = false;
let onboardingShortcutBeforeCapture = '';
let micDeviceCount = 0;
let onboardingMicIgnoreUntil = 0;
const UPGRADE_NUDGE_THRESHOLD = 500;
const STYLE_PRESETS = ['Default', 'Casual', 'Formel', 'Croco'];
const STYLE_EXAMPLES = {
  Default: {
    before: "Je vais, euh, manger une pomme.",
    after: "Je vais manger une pomme.",
  },
  Casual: {
    before: "Nous devons impérativement finaliser ce dossier.",
    after: "Faut qu'on boucle ce dossier rapidos !",
  },
  Formel: {
    before: "C'est pas bon, on refait.",
    after: "Cette proposition est insatisfaisante, une révision est nécessaire.",
  },
  Croco: {
    before: "On a besoin de booster les ventes rapidement.",
    after: "On doit doper les ventes vite, comme si on branchait un turbo sur un vélo.",
  },
};
const STYLE_DESCRIPTIONS = {
  Default: 'Correction et mise en forme sans reformulation.',
  Casual: 'Reecriture legere, ton simple et naturel.',
  Formel: 'Reecriture legere, ton professionnel et structure.',
  Croco: 'Reecriture libre avec une metaphore courte.',
};
const STYLE_LABELS = {
  Default: 'Standard',
  Casual: 'Casual',
  Formel: 'Formel',
  Croco: 'Croco',
};
const SUBSCRIPTION_POLL_DELAY_MS = 4000;
const SUBSCRIPTION_POLL_MAX_ATTEMPTS = 6;
const SUBSCRIPTION_POLL_COOLDOWN_MS = 60000;
let subscriptionPollInFlight = false;
let subscriptionPollToken = 0;
let lastSubscriptionPollAt = 0;
const ONBOARDING_STEPS = ['welcome', 'permissions', 'mic_check', 'hotkey', 'first_dictation', 'delivery_check', 'done'];
const MIC_NOISE_FLOOR = 0.012;
const MIC_READY_THRESHOLD = 0.018;
const MIC_READY_HOLD_MS = 500;
const MIC_IGNORE_AFTER_CHANGE_MS = 1000;
let focusedNote = null;
let focusedNoteDirty = false;
let focusedNoteSaving = false;
let focusedNoteTimer = null;

function setButtonLoading(button, isLoading, label) {
  if (!button) {
    return;
  }
  if (isLoading) {
    if (!button.dataset.loadingLabel) {
      button.dataset.loadingLabel = button.textContent;
    }
    if (button.dataset.loadingDisabled === undefined) {
      button.dataset.loadingDisabled = button.disabled ? '1' : '0';
    }
    button.disabled = true;
    button.classList.add('is-loading');
    if (label) {
      button.dataset.loadingText = label;
      button.textContent = label;
    }
    return;
  }
  const wasDisabled = button.dataset.loadingDisabled === '1';
  button.disabled = wasDisabled;
  delete button.dataset.loadingDisabled;
  if (button.dataset.loadingLabel && (!button.dataset.loadingText || button.textContent === button.dataset.loadingText)) {
    button.textContent = button.dataset.loadingLabel;
  }
  delete button.dataset.loadingLabel;
  delete button.dataset.loadingText;
  button.classList.remove('is-loading');
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isSubscriptionActive(subscription) {
  if (!subscription) {
    return false;
  }
  if (subscription.isPro) {
    return true;
  }
  return subscription.status === 'active' || subscription.status === 'trialing';
}

function normalizeOnboardingState(settings) {
  const onboarding = settings?.onboarding || {};
  const step = ONBOARDING_STEPS.includes(onboarding.step) ? onboarding.step : 'welcome';
  return {
    step,
    completed: Boolean(onboarding.completed),
    firstRunSuccess: Boolean(onboarding.firstRunSuccess),
    hotkeyReady: Boolean(onboarding.hotkeyReady),
    updatedAt: onboarding.updatedAt || null,
  };
}

function setOnboardingChecklistState(el, done) {
  if (!el) {
    return;
  }
  el.classList.toggle('done', Boolean(done));
}

function setOnboardingOverlayVisible(visible) {
  if (!onboardingOverlay) {
    return;
  }
  onboardingOverlay.classList.toggle('active', visible);
  onboardingOverlay.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

async function persistOnboardingState(nextState) {
  if (!window.electronAPI?.saveSettings) {
    return;
  }
  onboardingState = { ...onboardingState, ...nextState, updatedAt: new Date().toISOString() };
  await window.electronAPI.saveSettings({ onboarding: onboardingState });
}

function setOnboardingStep(step, { skipPersist } = {}) {
  if (!ONBOARDING_STEPS.includes(step)) {
    return;
  }
  onboardingState = { ...onboardingState, step };
  updateOnboardingUI();
  if (!skipPersist) {
    persistOnboardingState({ step });
  }
}

function updateOnboardingStepper() {
  if (!onboardingStepper) {
    return;
  }
  const currentIndex = ONBOARDING_STEPS.indexOf(onboardingState.step);
  onboardingStepper.querySelectorAll('.onboarding-step').forEach((stepEl) => {
    const step = stepEl.dataset.step;
    const stepIndex = ONBOARDING_STEPS.indexOf(step);
    const isActive = step === onboardingState.step;
    stepEl.classList.toggle('active', isActive);
    stepEl.classList.toggle('done', stepIndex > -1 && stepIndex < currentIndex);
  });
}

function updateOnboardingPanels() {
  onboardingPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.step === onboardingState.step);
  });
}

function updateOnboardingChecklist() {
  setOnboardingChecklistState(onboardingCheckPermission, onboardingPermissionGranted);
  setOnboardingChecklistState(onboardingCheckSignal, onboardingMicReady);
  setOnboardingChecklistState(onboardingCheckHotkey, onboardingState?.hotkeyReady);
  setOnboardingChecklistState(onboardingCheckDictation, onboardingState?.firstRunSuccess);
  setOnboardingChecklistState(onboardingCheckDelivery, onboardingDeliveryReady);
}

function updateOnboardingUI() {
  if (!onboardingOverlay) {
    return;
  }

  const shouldShow = !onboardingSessionDismissed && !onboardingState?.completed;
  setOnboardingOverlayVisible(shouldShow);
  updateOnboardingStepper();
  updateOnboardingPanels();
  updateOnboardingChecklist();

  if (onboardingMicContinue) {
    onboardingMicContinue.disabled = !onboardingMicReady;
  }
  if (onboardingHotkeyNext) {
    onboardingHotkeyNext.disabled = !onboardingState?.hotkeyReady;
  }
  if (onboardingFirstRunNext) {
    onboardingFirstRunNext.disabled = !onboardingState?.firstRunSuccess;
  }
  if (onboardingDeliveryNext) {
    onboardingDeliveryNext.disabled = !onboardingDeliveryReady;
  }
  if (onboardingState.step === 'permissions' && !onboardingPermissionGranted) {
    setOnboardingStatus(onboardingPermissionStatus, 'Cliquez pour déclencher la demande d’accès.');
  }
  if (onboardingState.step === 'mic_check' && !onboardingMicReady) {
    setOnboardingStatus(onboardingMicStatus, 'En attente de signal audio...');
  }
  if (onboardingState.step === 'mic_check' && micDeviceCount === 0) {
    setOnboardingStatus(onboardingMicStatus, 'Aucun micro détecté. Vérifiez votre matériel.', 'error');
    if (onboardingMicContinue) {
      onboardingMicContinue.disabled = true;
    }
  }
  if (onboardingState.step === 'hotkey') {
    if (onboardingHotkeyInput && !onboardingShortcutCaptureActive) {
      onboardingHotkeyInput.value = currentSettings.shortcut || '';
    }
    if (!onboardingState.hotkeyReady) {
      setOnboardingStatus(onboardingHotkeyStatus, 'Définissez un raccourci clavier pour lancer la dictée.');
    } else {
      setOnboardingStatus(onboardingHotkeyStatus, 'Raccourci configuré.', 'success');
    }
  }

  if (onboardingState.step === 'mic_check' && window.electronAPI?.startOnboardingMic) {
    window.electronAPI.startOnboardingMic();
  }

  if (!['permissions', 'mic_check'].includes(onboardingState.step)) {
    if (window.electronAPI?.stopOnboardingMic) {
      window.electronAPI.stopOnboardingMic();
    }
  }
}

function applyOnboardingStateFromSettings(settings) {
  onboardingState = normalizeOnboardingState(settings);
  if (onboardingState.step === 'welcome' && !onboardingState.completed) {
    onboardingMicReady = false;
    onboardingPermissionGranted = false;
    onboardingMicLastActiveAt = 0;
    onboardingDeliveryReady = false;
    onboardingState.hotkeyReady = false;
    onboardingMicIgnoreUntil = 0;
  }
  updateOnboardingUI();
}

function setOnboardingStatus(el, message, tone = '') {
  if (!el) {
    return;
  }
  el.textContent = message || '';
  el.classList.remove('error', 'success');
  if (tone) {
    el.classList.add(tone);
  }
}

function updateVuMeter(level) {
  if (!onboardingVuBar) {
    return;
  }
  const clamped = Math.max(0, Math.min(1, level || 0));
  onboardingVuBar.style.width = `${Math.round(clamped * 100)}%`;
}

function handleOnboardingMicLevel(payload) {
  if (Date.now() < onboardingMicIgnoreUntil) {
    return;
  }
  const level = typeof payload?.level === 'number' ? payload.level : 0;
  onboardingMicLevel = onboardingMicLevel ? (onboardingMicLevel * 0.7 + level * 0.3) : level;
  const effectiveLevel = Math.max(0, onboardingMicLevel - MIC_NOISE_FLOOR);
  updateVuMeter(effectiveLevel * 6);
  onboardingPermissionGranted = level > 0 || onboardingPermissionGranted;
  if (onboardingPermissionGranted) {
    setOnboardingStatus(onboardingPermissionStatus, 'Micro autorisé. Parlez pour voir la jauge.', 'success');
    if (onboardingState?.step === 'permissions') {
      setOnboardingStep('mic_check');
    }
  }
  updateOnboardingChecklist();

  if (onboardingMicReady) {
    return;
  }
  if (effectiveLevel >= MIC_READY_THRESHOLD) {
    if (!onboardingMicLastActiveAt) {
      onboardingMicLastActiveAt = Date.now();
    }
    if (Date.now() - onboardingMicLastActiveAt >= MIC_READY_HOLD_MS) {
      onboardingMicReady = true;
      setOnboardingStatus(onboardingMicStatus, 'Signal détecté. Vous pouvez continuer.', 'success');
      updateOnboardingChecklist();
      updateOnboardingUI();
      return;
    }
  } else {
    onboardingMicLastActiveAt = 0;
  }
  if (onboardingMicStatus) {
    setOnboardingStatus(onboardingMicStatus, 'En attente de signal audio...');
  }
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
      setButtonLoading(button, true, 'Ouverture...');
      const result = await window.electronAPI.openSignupUrl('login');
      if (result?.ok === false) {
        showToast('Ouverture impossible.', 'error');
      }
      setButtonLoading(button, false);
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

function openModal({ title, fields, confirmText }) {
  if (!modalBackdrop || !modalBody || !modalTitle || !modalCancel || !modalConfirm) {
    return Promise.resolve(null);
  }

  modalTitle.textContent = title;
  modalConfirm.textContent = confirmText || 'Sauvegarder';
  modalBody.innerHTML = '';
  const inputs = {};

  fields.forEach((field, index) => {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = field.label;

    let input;
    if (field.type === 'select') {
      input = document.createElement('select');
      input.className = 'input-select';
      (field.options || []).forEach((option) => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.label;
        input.appendChild(opt);
      });
    } else if (field.multiline) {
      input = document.createElement('textarea');
      input.rows = 4;
      input.className = 'input-textarea';
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'input-field';
    }

    input.value = field.value || '';
    input.placeholder = field.placeholder || '';
    input.dataset.key = field.key;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    modalBody.appendChild(wrapper);
    inputs[field.key] = input;

    if (index === 0) {
      setTimeout(() => input.focus(), 0);
    }
  });

  modalBackdrop.classList.add('is-visible');
  modalBackdrop.setAttribute('aria-hidden', 'false');

  return new Promise((resolve) => {
    modalResolver = resolve;

    const closeModal = (value) => {
      modalBackdrop.classList.remove('is-visible');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      modalResolver = null;
      resolve(value);
    };

    modalCancel.onclick = () => closeModal(null);
    modalConfirm.onclick = () => {
      const values = {};
      Object.keys(inputs).forEach((key) => {
        values[key] = inputs[key].value.trim();
      });
      closeModal(values);
    };
  });
}

function updateBreadcrumb(viewName) {
  if (!breadcrumbPrimary || !breadcrumbSecondary) {
    return;
  }

  const map = {
    home: { primary: 'Dashboard', secondary: 'Historique' },
    notes: { primary: 'Notes', secondary: 'Bibliothèque' },
    'note-focus': { primary: 'Notes', secondary: 'Focus' },
    dictionary: { primary: 'Dictionnaire', secondary: 'Corrections' },
    snippets: { primary: 'Snippets', secondary: 'Templates' },
    context: { primary: 'Context', secondary: 'Privacy' },
    style: { primary: 'Styles', secondary: 'Persona' },
    settings: { primary: 'Réglages', secondary: 'Général' },
    diagnostics: { primary: 'Diagnostics', secondary: 'Etat' },
    diff: { primary: 'Polish', secondary: 'Avant / Après' },
    account: { primary: 'Profil', secondary: 'Facturation' },
  };

  const next = map[viewName] || map.home;
  breadcrumbPrimary.textContent = next.primary;
  breadcrumbSecondary.textContent = next.secondary;
}

function setActiveView(viewName) {
  const supportedViews = new Set(['home', 'notes', 'note-focus', 'dictionary', 'snippets', 'context', 'style', 'settings', 'diagnostics', 'diff', 'account']);
  const nextView = supportedViews.has(viewName) ? viewName : 'home';
  views.forEach((view) => {
    view.classList.toggle('active', view.id === `view-${nextView}`);
  });

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.view === nextView);
  });

  currentView = nextView;
  updateBreadcrumb(nextView);
  refreshActiveList();
}

function formatTime(iso) {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(value) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '';
  }
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) {
    return '';
  }
  const mb = bytes / (1024 * 1024);
  if (mb < 1) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${mb.toFixed(1)} MB`;
}

function deriveHistoryTitle(entry) {
  const text = (entry && (entry.text || entry.raw_text)) || '';
  const firstLine = text.split(/\r?\n/).find((line) => line && line.trim()) || '';
  const sentence = firstLine.split(/[.!?]/).find((part) => part && part.trim()) || firstLine;
  const trimmed = sentence.trim();
  if (!trimmed) {
    return 'Untitled';
  }
  return trimmed.length > 80 ? `${trimmed.slice(0, 77)}...` : trimmed;
}

function normalizeSnippetCue(value) {
  if (!value) {
    return '';
  }
  return value
    .toString()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s\p{P}]+$/gu, '');
}

function normalizeContextSettings(value) {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_CONTEXT_SETTINGS };
  }
  return {
    enabled: value.enabled !== false,
    postProcessEnabled: value.postProcessEnabled === true,
    retentionDays: Number.isFinite(value.retentionDays) ? value.retentionDays : DEFAULT_CONTEXT_SETTINGS.retentionDays,
    signals: { ...DEFAULT_CONTEXT_SETTINGS.signals, ...(value.signals || {}) },
    overrides: value.overrides && typeof value.overrides === 'object' ? value.overrides : {},
  };
}

function getContextSettingsLocal() {
  return normalizeContextSettings(currentSettings.context);
}

function getContextProfilesLocal() {
  return Array.isArray(currentSettings.contextProfiles) ? currentSettings.contextProfiles : [];
}

async function saveContextSettings(nextContext) {
  currentSettings = { ...currentSettings, context: nextContext };
  if (window.electronAPI?.saveSettings) {
    await window.electronAPI.saveSettings(sanitizeSettingsForSave(currentSettings));
  }
}

async function saveContextProfiles(nextProfiles) {
  currentSettings = { ...currentSettings, contextProfiles: nextProfiles };
  if (window.electronAPI?.saveSettings) {
    await window.electronAPI.saveSettings(sanitizeSettingsForSave(currentSettings));
  }
}

function filterEntries(entries, query) {
  if (!query) {
    return entries || [];
  }
  const lower = query.toLowerCase();
  return (entries || []).filter((entry) => [entry.title, entry.text, entry.raw_text, entry.formatted_text, entry.edited_text]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(lower));
}

function filterSnippets(entries, query) {
  if (!query) {
    return entries || [];
  }
  const lower = query.toLowerCase();
  return (entries || []).filter((entry) => [entry.cue, entry.template, entry.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(lower));
}

async function copyTextWithFallback(text) {
  if (!text) {
    return false;
  }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.warn('Clipboard API failed, falling back to main process.', error);
  }
  if (window.electronAPI?.writeClipboard) {
    const result = await window.electronAPI.writeClipboard(text);
    return Boolean(result && result.ok);
  }
  return false;
}

function showToast(message, type = 'success') {
  if (!toastContainer) {
    return;
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  const icon = document.createElement('div');
  icon.className = 'toast-icon';
  icon.innerHTML = type === 'error'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"></path></svg>';
  const content = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'toast-title';
  title.textContent = type === 'error' ? 'Erreur' : 'Succès';
  const messageEl = document.createElement('div');
  messageEl.className = 'toast-message';
  messageEl.textContent = message || '';
  content.appendChild(title);
  content.appendChild(messageEl);
  toast.appendChild(icon);
  toast.appendChild(content);
  toast.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    if (toast.isConnected) {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }
  }, 4800);
}

function showUndoToast(message, actionLabel, onUndo) {
  if (!toastContainer) {
    return;
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = document.createElement('div');
  icon.className = 'toast-icon';
  icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0-8-8"></path><polyline points="8 4 4 4 4 8"></polyline></svg>';
  const content = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'toast-title';
  title.textContent = 'Action';
  const messageEl = document.createElement('div');
  messageEl.className = 'toast-message';
  messageEl.textContent = message || '';
  content.appendChild(title);
  content.appendChild(messageEl);
  const actionButton = document.createElement('button');
  actionButton.className = 'toast-action';
  actionButton.type = 'button';
  actionButton.textContent = actionLabel || '';
  toast.appendChild(icon);
  toast.appendChild(content);
  toast.appendChild(actionButton);
  const dismiss = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  };
  if (actionButton) {
    actionButton.addEventListener('click', async (event) => {
      event.stopPropagation();
      if (typeof onUndo === 'function') {
        await onUndo();
      }
      dismiss();
    });
  }
  toast.addEventListener('click', dismiss);
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    if (toast.isConnected) {
      dismiss();
    }
  }, 5200);
}

async function deleteNoteWithUndo(entry) {
  if (!window.electronAPI?.deleteNote || !window.electronAPI?.upsertNote) {
    return;
  }
  notesData = notesData.filter((item) => item.id !== entry.id);
  if (statTotal) {
    statTotal.textContent = `${notesData.length}`;
  }
  renderNotesList();
  await window.electronAPI.deleteNote(entry.id);
  showUndoToast('Note supprimée.', 'Annuler', async () => {
    const payload = {
      id: entry.id,
      user_id: entry.user_id || null,
      title: entry.title || extractNoteTitle(entry.text || ''),
      text: entry.text || '',
      metadata: entry.metadata || null,
      created_at: entry.created_at,
      updated_at: entry.updated_at || entry.created_at,
    };
    const record = await window.electronAPI.upsertNote(payload);
    updateNotesData(record);
  });
}

async function deleteHistoryWithUndo(entry) {
  if (!window.electronAPI?.deleteHistory || !window.electronAPI?.upsertHistory) {
    return;
  }
  historyData = historyData.filter((item) => item.id !== entry.id);
  renderHistoryList();
  await window.electronAPI.deleteHistory(entry.id);
  showUndoToast('Entrée supprimée.', 'Annuler', async () => {
    const payload = {
      id: entry.id,
      user_id: entry.user_id || null,
      text: entry.text || '',
      raw_text: entry.raw_text || entry.text || '',
      formatted_text: entry.formatted_text || null,
      edited_text: entry.edited_text || entry.text || '',
      language: entry.language || currentSettings.language || 'fr',
      duration_ms: entry.duration_ms || null,
      latency_ms: typeof entry.latency_ms === 'number' ? entry.latency_ms : null,
      divergence_score: typeof entry.divergence_score === 'number' ? entry.divergence_score : null,
      mic_device: entry.mic_device || null,
      fallback_path: entry.fallback_path || null,
      title: entry.title || deriveHistoryTitle(entry),
      created_at: entry.created_at,
      updated_at: entry.updated_at || entry.created_at,
    };
    const record = await window.electronAPI.upsertHistory(payload);
    if (record && record.id) {
      historyData = [record, ...historyData.filter((item) => item.id !== record.id)];
      renderHistoryList();
    }
  });
}

function sanitizeSettingsForSave(value) {
  const settings = { ...(value || {}) };
  delete settings.apiKeyPresent;
  delete settings.deliveryMode;
  return settings;
}

function setSyncStatusMessage(message, type) {
  if (!syncStatus) {
    return;
  }
  syncStatus.textContent = message || '';
  syncStatus.classList.remove('ok', 'error');
  if (type === 'ok') {
    syncStatus.classList.add('ok');
  } else if (type === 'error') {
    syncStatus.classList.add('error');
  }
}

function setEmptyStateMessage(element, title, body, showAction = true) {
  if (!element) {
    return;
  }
  const titleEl = element.querySelector('.empty-title');
  const bodyEl = element.querySelector('.empty-body');
  const actionEl = element.querySelector('.empty-action');
  if (titleEl) {
    titleEl.textContent = title || '';
  }
  if (bodyEl) {
    bodyEl.textContent = body || '';
  }
  if (actionEl) {
    actionEl.style.display = showAction ? 'inline-flex' : 'none';
  }
}

function setEmptyStateState(element, hasSearch) {
  if (!element) {
    return;
  }
  const titleEl = element.querySelector('.empty-title');
  const bodyEl = element.querySelector('.empty-body');
  const actionEl = element.querySelector('.empty-action');
  const title = hasSearch ? element.dataset.searchTitle : element.dataset.emptyTitle;
  const body = hasSearch ? element.dataset.searchBody : element.dataset.emptyBody;
  if (titleEl) {
    titleEl.textContent = title || '';
  }
  if (bodyEl) {
    bodyEl.textContent = body || '';
  }
  if (actionEl) {
    actionEl.style.display = hasSearch ? 'none' : 'inline-flex';
  }
}

function renderHistoryLoading() {
  if (!historyList || !historyEmpty) {
    return;
  }
  historyLoadError = false;
  historyEmpty.style.display = 'none';
  historyList.innerHTML = `
    <div class="history-skeleton">
      <div class="history-skeleton-row">
        <div class="history-skeleton-icon"></div>
        <div class="history-skeleton-lines">
          <div class="history-skeleton-line short"></div>
          <div class="history-skeleton-line"></div>
        </div>
      </div>
      <div class="history-skeleton-row">
        <div class="history-skeleton-icon"></div>
        <div class="history-skeleton-lines">
          <div class="history-skeleton-line short"></div>
          <div class="history-skeleton-line"></div>
        </div>
      </div>
      <div class="history-skeleton-row">
        <div class="history-skeleton-icon"></div>
        <div class="history-skeleton-lines">
          <div class="history-skeleton-line short"></div>
          <div class="history-skeleton-line"></div>
        </div>
      </div>
    </div>
  `;
}

function renderHistoryError(message) {
  if (!historyList || !historyEmpty) {
    return;
  }
  historyLoadError = true;
  historyList.innerHTML = '';
  historyEmpty.style.display = 'flex';
  setEmptyStateMessage(
    historyEmpty,
    historyEmpty.dataset.errorTitle || 'Impossible de charger l’historique',
    message || historyEmpty.dataset.errorBody || 'Veuillez réessayer.',
    false,
  );
}

function extractNoteTitle(text) {
  if (!text) {
    return 'Sans titre';
  }
  const line = text.split(/\r?\n/).map((row) => row.trim()).find(Boolean);
  if (!line) {
    return 'Sans titre';
  }
  return line.length > 80 ? `${line.slice(0, 80)}…` : line;
}

function getNotePreview(text) {
  if (!text) {
    return '';
  }
  const collapsed = text.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= 160) {
    return collapsed;
  }
  return `${collapsed.slice(0, 160)}…`;
}

function normalizeNoteMetadata(metadata) {
  if (!metadata) {
    return {};
  }
  if (typeof metadata === 'object') {
    return metadata;
  }
  try {
    return JSON.parse(metadata);
  } catch {
    return {};
  }
}

function formatDateTimeLabel(iso) {
  if (!iso) {
    return '—';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInlineMarkdown(text) {
  let safe = escapeHtml(text);
  safe = safe.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
  safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  safe = safe.replace(/~~([^~]+)~~/g, '<s>$1</s>');
  return safe;
}

function renderMarkdownLite(text) {
  if (!text) {
    return '';
  }
  const lines = text.split(/\r?\n/);
  const html = [];
  let inList = false;
  let inCode = false;
  let codeLines = [];
  let paragraphLines = [];

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  const closeCode = () => {
    if (inCode) {
      html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      inCode = false;
      codeLines = [];
    }
  };

  const flushParagraph = () => {
    if (paragraphLines.length) {
      html.push(`<p>${formatInlineMarkdown(paragraphLines.join(' '))}</p>`);
      paragraphLines = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      if (inCode) {
        closeCode();
      } else {
        closeList();
        inCode = true;
      }
      flushParagraph();
      return;
    }
    if (inCode) {
      codeLines.push(line);
      return;
    }

    if (!trimmed) {
      flushParagraph();
      closeList();
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${formatInlineMarkdown(headingMatch[2])}</h${level}>`);
      return;
    }

    const quoteMatch = trimmed.match(/^>\s+(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      closeList();
      html.push(`<blockquote>${formatInlineMarkdown(quoteMatch[1])}</blockquote>`);
      return;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${formatInlineMarkdown(listMatch[1])}</li>`);
      return;
    }

    closeList();
    paragraphLines.push(trimmed);
  });

  flushParagraph();
  closeList();
  closeCode();

  return html.join('\n');
}

function setFocusedNoteStatus(state, detail) {
  if (!noteFocusStatus) {
    return;
  }
  noteFocusStatus.classList.remove('is-dirty', 'is-saving', 'is-error');
  let label = 'Enregistré';
  if (state === 'dirty') {
    label = 'Modifications non sauvegardées';
    noteFocusStatus.classList.add('is-dirty');
  } else if (state === 'saving') {
    label = 'Enregistrement...';
    noteFocusStatus.classList.add('is-saving');
  } else if (state === 'error') {
    label = 'Erreur';
    noteFocusStatus.classList.add('is-error');
  } else if (state === 'empty') {
    label = 'Vide';
    noteFocusStatus.classList.add('is-dirty');
  }
  noteFocusStatus.textContent = label;
  if (noteFocusTimestamp && detail !== undefined) {
    noteFocusTimestamp.textContent = detail || '—';
  }
}

function htmlToMarkdownLite(html) {
  if (!html) {
    return '';
  }
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  const serializeInline = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }
    const tag = node.tagName.toLowerCase();
    if (tag === 'strong' || tag === 'b') {
      return `**${serializeChildren(node)}**`;
    }
    if (tag === 'em' || tag === 'i') {
      return `*${serializeChildren(node)}*`;
    }
    if (tag === 's' || tag === 'del') {
      return `~~${serializeChildren(node)}~~`;
    }
    if (tag === 'code') {
      return `\`${serializeChildren(node)}\``;
    }
    if (tag === 'a') {
      const href = node.getAttribute('href') || '';
      const label = serializeChildren(node) || href;
      return href ? `[${label}](${href})` : label;
    }
    if (tag === 'br') {
      return '\n';
    }
    return serializeChildren(node);
  };

  const serializeChildren = (node) => {
    return Array.from(node.childNodes).map(serializeInline).join('');
  };

  const blocks = [];

  const serializeBlock = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      return text.trim() ? text : '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }
    const tag = node.tagName.toLowerCase();
    if (tag === 'h1') {
      return `# ${serializeChildren(node)}`;
    }
    if (tag === 'h2') {
      return `## ${serializeChildren(node)}`;
    }
    if (tag === 'h3') {
      return `### ${serializeChildren(node)}`;
    }
    if (tag === 'blockquote') {
      return serializeChildren(node).split('\n').map((line) => `> ${line}`).join('\n');
    }
    if (tag === 'ul') {
      return Array.from(node.querySelectorAll('li')).map((li) => `- ${serializeChildren(li)}`).join('\n');
    }
    if (tag === 'pre') {
      const code = node.querySelector('code');
      const content = code ? code.textContent || '' : node.textContent || '';
      return `\`\`\`\n${content}\n\`\`\``;
    }
    if (tag === 'p' || tag === 'div') {
      const content = serializeChildren(node).trim();
      return content ? content : '';
    }
    return serializeChildren(node).trim();
  };

  Array.from(wrapper.childNodes).forEach((node) => {
    const block = serializeBlock(node);
    if (block) {
      blocks.push(block);
    }
  });

  return blocks.join('\n\n').trim();
}

function updateNotesData(record) {
  if (!record) {
    return;
  }
  const index = notesData.findIndex((item) => item.id === record.id);
  if (index >= 0) {
    notesData[index] = record;
  } else {
    notesData = [record, ...notesData];
  }
  if (statTotal) {
    statTotal.textContent = `${notesData.length}`;
  }
  renderNotesList();
}

function handleFocusedTitleInput() {
  if (focusedNoteSaving) {
    return;
  }
  focusedNoteDirty = true;
  setFocusedNoteStatus('dirty');
  scheduleFocusedSave();
}

function handleFocusedEditorInput() {
  if (focusedNoteSaving) {
    return;
  }
  focusedNoteDirty = true;
  const rawText = noteFocusEditor?.textContent || '';
  const hasContent = Boolean(rawText.trim());
  if (!hasContent && noteFocusEditor) {
    noteFocusEditor.innerHTML = '';
  }
  if (!hasContent && !focusedNote?.id) {
    setFocusedNoteStatus('empty');
  } else {
    setFocusedNoteStatus('dirty');
  }
  scheduleFocusedSave();
}

function scheduleFocusedSave() {
  if (focusedNoteTimer) {
    clearTimeout(focusedNoteTimer);
  }
  focusedNoteTimer = setTimeout(() => {
    saveFocusedNote();
  }, 800);
}

function isSelectionInsideFocusedEditor() {
  if (!noteFocusEditor) {
    return false;
  }
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return false;
  }
  const range = selection.getRangeAt(0);
  if (selection.isCollapsed) {
    return false;
  }
  return noteFocusEditor.contains(range.commonAncestorContainer);
}

function positionFocusToolbar() {
  if (!noteFocusToolbar) {
    return;
  }
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    noteFocusToolbar.classList.remove('is-visible');
    return;
  }
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (!rect || rect.width === 0) {
    noteFocusToolbar.classList.remove('is-visible');
    return;
  }
  const top = Math.max(rect.top + window.scrollY, 12);
  const viewportWidth = document.documentElement.clientWidth;
  const toolbarWidth = noteFocusToolbar.offsetWidth || 0;
  const pageLeft = window.scrollX;
  let left = rect.left + rect.width / 2 + pageLeft;
  if (toolbarWidth > 0 && viewportWidth > 0) {
    const padding = 12;
    const minLeft = pageLeft + padding + toolbarWidth / 2;
    const maxLeft = pageLeft + viewportWidth - padding - toolbarWidth / 2;
    if (minLeft <= maxLeft) {
      left = Math.min(Math.max(left, minLeft), maxLeft);
    } else {
      left = pageLeft + viewportWidth / 2;
    }
  }
  noteFocusToolbar.style.top = `${top}px`;
  noteFocusToolbar.style.left = `${left}px`;
  noteFocusToolbar.classList.add('is-visible');
}

function hideFocusToolbar() {
  if (!noteFocusToolbar) {
    return;
  }
  noteFocusToolbar.classList.remove('is-visible');
}

async function applyFocusFormat(format) {
  if (!noteFocusEditor) {
    return;
  }
  noteFocusEditor.focus();
  switch (format) {
    case 'bold':
      document.execCommand('bold', false);
      break;
    case 'italic':
      document.execCommand('italic', false);
      break;
    case 'strike':
      document.execCommand('strikeThrough', false);
      break;
    case 'code': {
      const selection = window.getSelection();
      if (selection && selection.rangeCount) {
        const text = selection.toString();
        if (text) {
          document.execCommand('insertHTML', false, `<code>${escapeHtml(text)}</code>`);
        }
      }
      break;
    }
    case 'quote':
      document.execCommand('formatBlock', false, 'blockquote');
      break;
    case 'list':
      document.execCommand('insertUnorderedList', false);
      break;
    case 'h1':
      document.execCommand('formatBlock', false, 'h1');
      break;
    case 'h2':
      document.execCommand('formatBlock', false, 'h2');
      break;
    case 'h3':
      document.execCommand('formatBlock', false, 'h3');
      break;
    case 'p':
      document.execCommand('formatBlock', false, 'p');
      break;
    case 'link': {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount || selection.isCollapsed) {
        break;
      }
      const selectionRange = selection.getRangeAt(0).cloneRange();
      const res = await openModal({
        title: 'Ajouter un lien',
        confirmText: 'Ajouter',
        fields: [
          { key: 'url', label: 'URL du lien', value: '' },
        ],
      });
      const url = res?.url || '';
      if (url) {
        noteFocusEditor.focus();
        const restoredSelection = window.getSelection();
        if (restoredSelection && selectionRange) {
          restoredSelection.removeAllRanges();
          restoredSelection.addRange(selectionRange);
        }
        document.execCommand('createLink', false, url);
      }
      break;
    }
    default:
      break;
  }
  handleFocusedEditorInput();
  positionFocusToolbar();
}

async function saveFocusedNote({ force = false } = {}) {
  if (!noteFocusEditor || !noteFocusTitle) {
    return null;
  }
  if (!window.electronAPI?.upsertNote) {
    setFocusedNoteStatus('error');
    return null;
  }
  const html = noteFocusEditor.innerHTML || '';
  const text = htmlToMarkdownLite(html);
  const hasContent = Boolean(text.trim());
  if (!hasContent && !focusedNote?.id) {
    setFocusedNoteStatus('empty');
    return null;
  }
  if (!force && !focusedNoteDirty) {
    return focusedNote;
  }
  focusedNoteSaving = true;
  setFocusedNoteStatus('saving');

  const now = new Date().toISOString();
  const titleInput = noteFocusTitle.value.trim();
  const title = titleInput || extractNoteTitle(text);
  const payload = {
    id: focusedNote?.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`),
    user_id: focusedNote?.user_id || null,
    title,
    text,
    metadata: focusedNote?.metadata || { source: 'manual' },
    created_at: focusedNote?.created_at || now,
    updated_at: now,
  };

  try {
    const record = await window.electronAPI.upsertNote(payload);
    focusedNote = record;
    focusedNoteDirty = false;
    focusedNoteSaving = false;
    updateNotesData(record);
    setFocusedNoteStatus('saved', formatDateTimeLabel(record.updated_at));
    return record;
  } catch (error) {
    focusedNoteSaving = false;
    setFocusedNoteStatus('error');
    return null;
  }
}

function openFocusedNote(note = null) {
  if (!noteFocusEditor || !noteFocusTitle) {
    return;
  }
  focusedNote = note ? { ...note } : null;
  focusedNoteDirty = false;
  focusedNoteSaving = false;

  const metadata = normalizeNoteMetadata(note?.metadata);
  const source = metadata.source === 'dictation'
    ? 'Dictée'
    : (metadata.source === 'file_upload' ? 'Import audio' : (metadata.source ? 'Manuel' : ''));
  if (noteFocusSource) {
    noteFocusSource.textContent = source ? `Source: ${source}` : '';
  }
  if (noteFocusTimestamp) {
    const stamp = note?.updated_at || note?.created_at || null;
    noteFocusTimestamp.textContent = formatDateTimeLabel(stamp);
  }
  noteFocusTitle.value = note?.title || '';
  noteFocusEditor.innerHTML = note?.text ? renderMarkdownLite(note.text) : '';
  if ((note?.text || '').trim()) {
    setFocusedNoteStatus('saved', formatDateTimeLabel(note?.updated_at || note?.created_at));
  } else {
    setFocusedNoteStatus('empty');
  }

  document.body.classList.add('note-focus-active');
  if (noteFocusOverlay) {
    noteFocusOverlay.setAttribute('aria-hidden', 'false');
  }
  setActiveView('note-focus');
  setTimeout(() => noteFocusTitle.focus(), 0);
}

async function closeFocusedNote() {
  if (focusedNoteDirty) {
    await saveFocusedNote({ force: true });
  }
  document.body.classList.remove('note-focus-active');
  if (noteFocusOverlay) {
    noteFocusOverlay.setAttribute('aria-hidden', 'true');
  }
  hideFocusToolbar();
  focusedNote = null;
  focusedNoteDirty = false;
  focusedNoteSaving = false;
  if (focusedNoteTimer) {
    clearTimeout(focusedNoteTimer);
    focusedNoteTimer = null;
  }
  setActiveView('notes');
}

function buildEntryRow(entry, type) {
  const row = document.createElement('div');
  row.className = 'entry-row';
  if (type === 'notes') {
    row.role = 'button';
    row.tabIndex = 0;
    row.addEventListener('click', () => openFocusedNote(entry));
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFocusedNote(entry);
      }
    });
  }

  const icon = document.createElement('div');
  icon.className = 'entry-icon';
  icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';

  const main = document.createElement('div');
  main.className = 'entry-main';

  const metaDiv = document.createElement('div');
  metaDiv.className = 'entry-meta';
  const timePart = entry.created_at ? formatTime(entry.created_at) : '';
  const datePart = formatDateLabel(entry.created_at);
  const metaParts = [timePart, datePart];
  if (type === 'history') {
    const durationLabel = formatDuration(entry.duration_ms);
    if (durationLabel) {
      metaParts.push(durationLabel);
    }
    if (entry.language) {
      metaParts.push(entry.language.toUpperCase());
    }
  }
  metaDiv.textContent = metaParts.filter(Boolean).join(' · ');

  const title = document.createElement('div');
  title.className = 'entry-title';
  if (type === 'notes') {
    title.textContent = entry.title || extractNoteTitle(entry.text);
  } else {
    title.textContent = deriveHistoryTitle(entry);
  }

  const preview = document.createElement('div');
  preview.className = 'entry-preview';
  if (type === 'notes') {
    preview.textContent = getNotePreview(entry.text || '');
  } else {
    preview.textContent = entry.text || entry.raw_text || '';
  }

  main.appendChild(metaDiv);
  main.appendChild(title);
  main.appendChild(preview);

  const actions = document.createElement('div');
  actions.className = 'entry-actions';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'entry-action copy';
  copyBtn.type = 'button';
  copyBtn.textContent = 'Copier';
  copyBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const text = entry.text || entry.raw_text || '';
    const ok = await copyTextWithFallback(text);
    if (ok) {
      showToast('Texte copié.');
    } else {
      showToast('Impossible de copier.', 'error');
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'entry-action delete';
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Supprimer';
  deleteBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!window.electronAPI) {
      return;
    }
    const method = type === 'notes' ? window.electronAPI.deleteNote : window.electronAPI.deleteHistory;
    if (!method) {
      return;
    }
    if (type === 'notes') {
      await deleteNoteWithUndo(entry);
    } else {
      await deleteHistoryWithUndo(entry);
    }
  });

  actions.appendChild(copyBtn);
  if (type !== 'notes') {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'entry-action';
    exportBtn.type = 'button';
    exportBtn.textContent = 'Exporter';
    exportBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await exportHistoryEntry(entry);
    });
    actions.appendChild(exportBtn);
  }
  actions.appendChild(deleteBtn);

  row.appendChild(icon);
  row.appendChild(main);
  row.appendChild(actions);

  return row;
}

async function exportHistoryEntry(entry) {
  if (!window.electronAPI?.exportHistory || !entry?.id) {
    showToast('Export indisponible.', 'error');
    return;
  }
  const values = await openModal({
    title: 'Exporter la transcription',
    confirmText: 'Exporter',
    fields: [
      {
        key: 'format',
        label: 'Format',
        type: 'select',
        options: [
          { label: 'TXT', value: 'txt' },
          { label: 'Markdown', value: 'md' },
          { label: 'JSON', value: 'json' },
        ],
        value: 'txt',
      },
      {
        key: 'timestamps',
        label: 'Timestamps',
        type: 'select',
        options: [
          { label: 'Sans', value: 'false' },
          { label: 'Avec', value: 'true' },
        ],
        value: 'false',
      },
      {
        key: 'sensitive',
        label: 'Inclure données sensibles',
        type: 'select',
        options: [
          { label: 'Non', value: 'false' },
          { label: 'Oui', value: 'true' },
        ],
        value: 'false',
      },
    ],
  });
  if (!values) {
    return;
  }
  const options = {
    format: values.format || 'txt',
    includeTimestamps: values.timestamps === 'true',
    includeSensitive: values.sensitive === 'true',
  };
  const result = await window.electronAPI.exportHistory(entry.id, options);
  if (result?.ok) {
    showToast('Export généré.');
  } else {
    showToast(result?.reason || 'Export échoué.', 'error');
  }
}

function renderHistoryList() {
  if (!historyList || !historyEmpty) {
    return;
  }
  if (historyLoadError) {
    return;
  }
  const filtered = filterEntries(historyData, searchTerm);
  historyList.innerHTML = '';
  if (!filtered.length) {
    historyEmpty.style.display = 'flex';
    setEmptyStateState(historyEmpty, Boolean(searchTerm));
    return;
  }
  historyEmpty.style.display = 'none';
  filtered.forEach((entry) => {
    historyList.appendChild(buildEntryRow(entry, 'history'));
  });
}

function renderUploads(uploads) {
  if (!uploadQueue) {
    return;
  }
  const items = Array.isArray(uploads) ? uploads : [];
  if (!items.length) {
    uploadQueue.innerHTML = '';
    return;
  }
  uploadQueue.innerHTML = '';
  items.forEach((job) => {
    const row = document.createElement('div');
    row.className = 'upload-row';

    const meta = document.createElement('div');
    meta.className = 'upload-meta';
    const title = document.createElement('div');
    title.className = 'upload-title';
    title.textContent = job.fileName || 'Fichier audio';
    const status = document.createElement('div');
    status.className = 'upload-status';
    const sizeLabel = job.fileSize ? ` · ${formatBytes(job.fileSize)}` : '';
    status.textContent = `${job.status || 'queued'}${sizeLabel}`;
    meta.appendChild(title);
    meta.appendChild(status);

    const progress = document.createElement('div');
    progress.className = 'upload-progress';
    const fill = document.createElement('div');
    fill.className = 'upload-progress-fill';
    fill.style.width = `${Math.min(100, Math.max(0, job.progress || 0))}%`;
    progress.appendChild(fill);
    meta.appendChild(progress);

    const actions = document.createElement('div');
    if (['queued', 'processing', 'cancelling'].includes(job.status)) {
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'btn-secondary';
      cancel.textContent = 'Annuler';
      cancel.addEventListener('click', async () => {
        if (window.electronAPI?.cancelUploadJob) {
          await window.electronAPI.cancelUploadJob(job.id);
          await refreshDashboard();
        }
      });
      actions.appendChild(cancel);
    }
    if (job.status === 'failed' && job.error) {
      const err = document.createElement('div');
      err.className = 'upload-status';
      err.textContent = job.error;
      meta.appendChild(err);
    }

    row.appendChild(meta);
    if (actions.childNodes.length) {
      row.appendChild(actions);
    }
    uploadQueue.appendChild(row);
  });
}

async function fetchDiagnostics() {
  if (!window.electronAPI?.getDiagnostics) {
    return;
  }
  try {
    diagnosticsSnapshot = await window.electronAPI.getDiagnostics();
    renderDiagnostics();
  } catch (error) {
    diagnosticsSnapshot = { error: error?.message || 'Diagnostic indisponible.' };
    renderDiagnostics();
  }
}

async function runDiagnosticsChecks() {
  const checks = {};
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    checks.mics = devices.filter((device) => device.kind === 'audioinput').length;
  } catch (error) {
    checks.mics = 'error';
  }
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const result = await navigator.permissions.query({ name: 'microphone' });
      checks.micPermission = result?.state || 'unknown';
    } else {
      checks.micPermission = 'unknown';
    }
  } catch {
    checks.micPermission = 'unknown';
  }
  diagnosticsChecksState = checks;
  if (window.electronAPI?.runDiagnosticsChecks) {
    try {
      const res = await window.electronAPI.runDiagnosticsChecks();
      if (res?.clipboardTest) {
        if (!diagnosticsSnapshot) {
          diagnosticsSnapshot = {};
        }
        diagnosticsSnapshot = { ...(diagnosticsSnapshot || {}), clipboardTest: res.clipboardTest };
      }
    } catch (error) {
      // ignore
    }
  }
  renderDiagnostics();
}

function renderDiagnostics() {
  if (!diagnosticsOutput || !diagnosticsChecks) {
    return;
  }
  const snapshot = diagnosticsSnapshot || {};
  const checks = diagnosticsChecksState || {};
  const lines = [];
  if (snapshot.error) {
    lines.push(`Erreur: ${snapshot.error}`);
  }
  if (snapshot.appVersion) {
    lines.push(`App: ${snapshot.appVersion}`);
  }
  if (snapshot.os) {
    lines.push(`OS: ${snapshot.os}`);
  }
  if (snapshot.flags) {
    lines.push(`Flags: ${JSON.stringify(snapshot.flags)}`);
  }
  if (snapshot.lastDelivery) {
    lines.push(`Delivery: ${snapshot.lastDelivery.mode || 'n/a'} (${snapshot.lastDelivery.status || 'n/a'})`);
  }
  if (snapshot.events && snapshot.events.length) {
    lines.push('Events:');
    snapshot.events.slice(0, 10).forEach((event) => {
      lines.push(`- ${event.at} ${event.code}: ${event.message}`);
    });
  }
  diagnosticsOutput.textContent = lines.join('\n') || 'Aucune donnée disponible.';

  const checkLines = [];
  if (checks.mics !== undefined) {
    checkLines.push(`Microphones: ${checks.mics}`);
  }
  if (checks.micPermission) {
    checkLines.push(`Permission micro: ${checks.micPermission}`);
  }
  if (snapshot.clipboardTest) {
    checkLines.push(`Clipboard test: ${snapshot.clipboardTest}`);
  }
  if (snapshot.shortcut) {
    checkLines.push(`Raccourci: ${snapshot.shortcut} (${snapshot.shortcutRegistered ? 'OK' : 'KO'})`);
  }
  diagnosticsChecks.textContent = checkLines.join(' · ') || 'Checks non lancés.';
}

function renderDiff() {
  if (diffBefore) {
    diffBefore.value = diffData.before || '';
  }
  if (diffAfter) {
    diffAfter.value = diffData.after || '';
  }
}

function renderNotesList() {
  if (!notesList || !notesEmpty) {
    return;
  }
  const filtered = filterEntries(notesData, searchTerm);
  notesList.innerHTML = '';
  if (!filtered.length) {
    notesEmpty.style.display = 'flex';
    setEmptyStateState(notesEmpty, Boolean(searchTerm));
    return;
  }
  notesEmpty.style.display = 'none';
  filtered.forEach((entry) => {
    notesList.appendChild(buildEntryRow(entry, 'notes'));
  });
}

function refreshActiveList() {
  if (currentView === 'notes') {
    renderNotesList();
    return;
  }
  if (currentView === 'note-focus') {
    return;
  }
  if (currentView === 'snippets') {
    const filtered = filterSnippets(snippetsData, searchTerm);
    renderSnippets(filtered);
    return;
  }
  if (currentView === 'diagnostics') {
    renderDiagnostics();
    if (!diagnosticsSnapshot) {
      fetchDiagnostics();
    }
    return;
  }
  if (currentView === 'diff') {
    renderDiff();
    return;
  }
  renderHistoryList();
}

async function handleOnboardingDictation() {
  if (!window.electronAPI?.toggleRecording) {
    return;
  }
  if (onboardingRecordingActive) {
    onboardingRecordingActive = false;
    if (onboardingDictateButton) {
      onboardingDictateButton.textContent = 'Dicter maintenant';
    }
    window.electronAPI.toggleRecording();
    return;
  }

  onboardingRecordingActive = true;
  if (onboardingSuccessBadge) {
    onboardingSuccessBadge.classList.remove('active');
  }
  setOnboardingStatus(onboardingDictationStatus, 'En écoute... Parlez maintenant.');
  if (onboardingDictateButton) {
    onboardingDictateButton.textContent = 'Arrêter';
  }
  if (window.electronAPI?.setRecordingTarget) {
    await window.electronAPI.setRecordingTarget('onboarding');
  }
  window.electronAPI.toggleRecording();
}

async function handleCreateNote() {
  openFocusedNote(null);
}

function renderStats(stats) {
  if (!stats) {
    return;
  }
  if (statDays) {
    statDays.textContent = stats.daysActive;
  }
  if (statWords) {
    statWords.textContent = stats.words;
  }
  if (statTotal) {
    const notesTotal = Number.isFinite(stats.notesTotal) ? stats.notesTotal : stats.total;
    statTotal.textContent = Number.isFinite(notesTotal) ? notesTotal : '0';
  }
  if (streakSubtitle) {
    const streak = Number.isFinite(stats.dayStreak) ? stats.dayStreak : 0;
    if (streak <= 0) {
      streakSubtitle.textContent = "Aucune série en cours. Lancez une dictée pour démarrer !";
    } else if (streak === 1) {
      streakSubtitle.textContent = 'Vous êtes sur une série de 1 jour. Continuez comme ça !';
    } else {
      streakSubtitle.textContent = `Vous êtes sur une série de ${streak} jours. Continuez comme ça !`;
    }
  }
}

function formatResetLabel(iso) {
  if (!iso) {
    return 'Reset lundi 00:00 UTC';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return 'Reset lundi 00:00 UTC';
  }
  return `Reset ${date.toLocaleDateString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' })} UTC`;
}

function renderQuota(quota) {
  quotaSnapshot = quota || null;
  if (!quotaRemaining || !quotaReset) {
    return;
  }
  if (!quota) {
    quotaRemaining.textContent = '—';
    quotaReset.textContent = 'Quota indisponible';
    renderUpgradeNudge(quotaSnapshot, currentSubscription, currentAuth);
    return;
  }
  if (quota.checkFailed || quota.unavailable) {
    quotaRemaining.textContent = '—';
    quotaReset.textContent = quota.message || 'Quota indisponible';
    renderUpgradeNudge(quotaSnapshot, currentSubscription, currentAuth);
    return;
  }
  if (quota.requiresAuth) {
    quotaRemaining.textContent = '—';
    quotaReset.textContent = 'Connectez-vous pour voir le quota';
    renderUpgradeNudge(quotaSnapshot, currentSubscription, currentAuth);
    return;
  }
  if (quota.unlimited) {
    quotaRemaining.textContent = 'Illimité';
    quotaReset.textContent = 'Plan Pro actif';
    renderUpgradeNudge(quotaSnapshot, currentSubscription, currentAuth);
    return;
  }
  quotaRemaining.textContent = quota.remaining;
  quotaReset.textContent = formatResetLabel(quota.resetAt);
  renderUpgradeNudge(quotaSnapshot, currentSubscription, currentAuth);
}

function renderUpgradeNudge(quota, subscription, auth) {
  if (!upgradeNudge) {
    return;
  }
  const isPro = Boolean(subscription?.isPro);
  const remaining = Number.isFinite(quota?.remaining) ? quota.remaining : null;
  const shouldShow = !isPro
    && !quota?.requiresAuth
    && !quota?.unlimited
    && Number.isFinite(remaining)
    && remaining <= UPGRADE_NUDGE_THRESHOLD;

  if (!shouldShow) {
    upgradeNudge.style.display = 'none';
    upgradeNudge.setAttribute('aria-hidden', 'true');
    return;
  }

  if (upgradeNudgeRemaining) {
    upgradeNudgeRemaining.textContent = `${remaining}`;
  }
  if (upgradeNudgeCaption) {
    upgradeNudgeCaption.textContent = formatResetLabel(quota?.resetAt);
  }
  if (upgradeNudgeFill) {
    const limit = Number.isFinite(quota?.limit) ? quota.limit : null;
    const usedRatio = limit ? Math.min(1, Math.max(0, (limit - remaining) / limit)) : 1;
    const percent = Math.max(8, Math.round(usedRatio * 100));
    upgradeNudgeFill.style.width = `${percent}%`;
  }
  if (upgradeNudgeButton) {
    upgradeNudgeButton.disabled = !auth;
  }
  upgradeNudge.style.display = 'block';
  upgradeNudge.setAttribute('aria-hidden', 'false');
}

function getSubscriptionLabel(subscription) {
  const status = subscription?.status || 'inactive';
  if (status === 'pending') {
    return 'Activation en cours';
  }
  if (status === 'trialing') {
    return 'Essai Pro actif';
  }
  if (subscription?.isPro) {
    return 'Plan Pro';
  }
  return 'Plan Free';
}

function renderSubscription(subscription, auth) {
  currentSubscription = subscription || null;
  currentAuth = auth || null;
  if (profileName) {
    const displayName = auth?.email ? auth.email.split('@')[0] : 'Invité';
    profileName.textContent = displayName;
  }
  if (profileAvatar) {
    const letterSource = profileName?.textContent || 'C';
    profileAvatar.textContent = letterSource.slice(0, 1).toUpperCase();
  }
  if (profilePlan) {
    profilePlan.textContent = getSubscriptionLabel(subscription);
  }
  if (subscriptionStatus) {
    const statusLabel = getSubscriptionLabel(subscription);
    const periodEnd = subscription?.currentPeriodEnd ? formatDateLabel(subscription.currentPeriodEnd) : '';
    subscriptionStatus.textContent = periodEnd ? `${statusLabel} • Renouvelle le ${periodEnd}` : statusLabel;
  }
  if (subscriptionBadge) {
    subscriptionBadge.classList.remove('pro', 'free', 'pending');
    const status = subscription?.status || 'inactive';
    if (status === 'pending') {
      subscriptionBadge.classList.add('pending');
      subscriptionBadge.textContent = 'En cours';
    } else if (subscription?.isPro) {
      subscriptionBadge.classList.add('pro');
      subscriptionBadge.textContent = 'Pro';
    } else {
      subscriptionBadge.classList.add('free');
      subscriptionBadge.textContent = 'Free';
    }
  }
  if (upgradePlanButton) {
    upgradePlanButton.textContent = subscription?.isPro ? 'Pro actif' : 'Passer Pro';
    upgradePlanButton.disabled = !auth || Boolean(subscription?.isPro);
  }
  if (manageSubscriptionButton) {
    manageSubscriptionButton.disabled = !auth;
  }
  if (refreshSubscriptionButton) {
    refreshSubscriptionButton.disabled = !auth;
  }
  if (subscriptionNote) {
    if (!auth) {
      subscriptionNote.textContent = 'Connectez-vous pour gérer votre abonnement.';
    } else if (subscription?.status === 'pending') {
      subscriptionNote.textContent = 'Activation en cours. Cela peut prendre quelques instants.';
    } else if (subscription?.isPro) {
      subscriptionNote.textContent = 'Merci pour votre abonnement PRO.';
    } else {
      subscriptionNote.textContent = 'Passez Pro pour débloquer la dictée illimitée.';
    }
  }
  renderUpgradeNudge(quotaSnapshot, subscription, auth);
}

function renderDictionary(dictionary) {
  if (!dictionaryList) {
    return;
  }
  dictionaryList.innerHTML = '';
  if (!dictionary || dictionary.length === 0) {
    dictionaryEmpty.style.display = 'flex';
    setEmptyStateState(dictionaryEmpty, false);
    return;
  }
  dictionaryEmpty.style.display = 'none';

  dictionary.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'dictionary-row';

    const content = document.createElement('div');
    content.className = 'dictionary-term';
    const from = document.createElement('span');
    from.textContent = entry.from_text;
    content.appendChild(from);

    if (entry.to_text && entry.to_text !== entry.from_text) {
      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = '→';
      const to = document.createElement('span');
      to.style.color = '#059669';
      to.textContent = entry.to_text;
      content.appendChild(arrow);
      content.appendChild(to);
    }

    const actions = document.createElement('div');
    actions.className = 'dictionary-row-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'edit';
    editBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
      </svg>
      Edit
    `;
    editBtn.addEventListener('click', async () => {
      const res = await openModal({
        title: 'Éditer le terme',
        confirmText: 'Mettre à jour',
        fields: [
          { key: 'from_text', label: 'Remplacer (De)', value: entry.from_text },
          { key: 'to_text', label: 'Par (Vers)', value: entry.to_text },
        ],
      });
      if (res && res.from_text && res.to_text) {
        await window.electronAPI.upsertDictionary({
          id: entry.id,
          from_text: res.from_text,
          to_text: res.to_text,
          created_at: entry.created_at,
        });
        showToast('Terme mis à jour.');
        await refreshDashboard();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete';
    deleteBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
      </svg>
      Supprimer
    `;
    deleteBtn.addEventListener('click', async () => {
      await window.electronAPI.deleteDictionary(entry.id);
      showToast('Terme supprimé.');
      await refreshDashboard();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    row.appendChild(content);
    row.appendChild(actions);
    dictionaryList.appendChild(row);
  });
}

function renderSnippets(snippets) {
  if (!snippetsList) {
    return;
  }
  snippetsList.innerHTML = '';
  if (!snippets || snippets.length === 0) {
    if (snippetsEmpty) {
      snippetsEmpty.style.display = 'flex';
      setEmptyStateState(snippetsEmpty, Boolean(searchTerm));
    }
    return;
  }
  if (snippetsEmpty) {
    snippetsEmpty.style.display = 'none';
  }

  snippets.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'snippet-row';

    const content = document.createElement('div');
    content.className = 'snippet-term';
    const cue = document.createElement('div');
    cue.className = 'snippet-cue';
    cue.textContent = entry.cue;
    const template = document.createElement('div');
    template.className = 'snippet-template';
    template.textContent = entry.template;
    content.appendChild(cue);
    content.appendChild(template);
    if (entry.description) {
      const desc = document.createElement('div');
      desc.className = 'snippet-description';
      desc.textContent = entry.description;
      content.appendChild(desc);
    }

    const actions = document.createElement('div');
    actions.className = 'snippet-row-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', async () => {
      const res = await openModal({
        title: 'Éditer le snippet',
        confirmText: 'Mettre à jour',
        fields: [
          { key: 'cue', label: 'Cue (ce que vous dites)', value: entry.cue },
          { key: 'template', label: 'Template', value: entry.template, multiline: true },
          { key: 'description', label: 'Description (optionnel)', value: entry.description || '' },
        ],
      });
      if (res && res.cue && res.template) {
        await window.electronAPI.upsertSnippet({
          id: entry.id,
          cue: res.cue,
          template: res.template,
          description: res.description || '',
          created_at: entry.created_at,
        });
        showToast('Snippet mis à jour.');
        await refreshDashboard();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.addEventListener('click', async () => {
      await window.electronAPI.deleteSnippet(entry.id);
      showToast('Snippet supprimé.');
      await refreshDashboard();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    row.appendChild(content);
    row.appendChild(actions);
    snippetsList.appendChild(row);
  });
}

function renderStyles(styles) {
  if (!styleList) {
    return;
  }
  styleList.innerHTML = '';
  const filtered = (styles || []).filter((style) => STYLE_PRESETS.includes(style.name));
  const ordered = STYLE_PRESETS.map((name) => filtered.find((style) => style.name === name)).filter(Boolean);

  if (!ordered.length) {
    styleEmpty.style.display = 'flex';
    setEmptyStateState(styleEmpty, false);
    return;
  }
  styleEmpty.style.display = 'none';

  ordered.forEach((style) => {
    const card = document.createElement('div');
    card.className = 'style-card';
    if (style.id === currentSettings.activeStyleId) {
      card.classList.add('active');
    }

    const title = document.createElement('h3');
    title.textContent = STYLE_LABELS[style.name] || style.name;
    if (style.id === currentSettings.activeStyleId) {
      const badge = document.createElement('span');
      badge.className = 'style-badge';
      badge.textContent = 'Actif';
      title.appendChild(badge);
    }

    const desc = document.createElement('p');
    desc.textContent = STYLE_DESCRIPTIONS[style.name] || style.prompt || '';

    const preview = document.createElement('div');
    preview.className = 'style-preview';
    const example = STYLE_EXAMPLES[style.name] || {};
    const beforeText = style.exampleBefore || example.before || 'Je... euh... je pense que c\'est bon.';
    const afterText = style.exampleAfter || example.after || 'Je confirme que c\'est valide.';
    const buildPreviewRow = (label, text, extraClass = '') => {
      const row = document.createElement('div');
      row.className = `style-preview-row${extraClass ? ` ${extraClass}` : ''}`;
      const labelEl = document.createElement('span');
      labelEl.className = 'style-preview-label';
      labelEl.textContent = label;
      const textEl = document.createElement('span');
      textEl.className = 'style-preview-text';
      textEl.textContent = `"${text}"`;
      row.appendChild(labelEl);
      row.appendChild(textEl);
      return row;
    };
    preview.appendChild(buildPreviewRow('Avant', beforeText));
    preview.appendChild(buildPreviewRow('Après', afterText, 'style-preview-after'));

    const btn = document.createElement('button');
    btn.textContent = style.id === currentSettings.activeStyleId ? 'Style actuel' : 'Utiliser ce style';
    if (style.id !== currentSettings.activeStyleId) {
      btn.addEventListener('click', async () => {
        await window.electronAPI.activateStyle(style.id);
        showToast(`Style "${style.name}" activé.`);
        await refreshDashboard();
      });
    }

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(preview);
    card.appendChild(btn);
    styleList.appendChild(card);
  });
}

function renderContextProfiles(profiles, contextData) {
  if (!contextProfileList) {
    return;
  }
  contextProfileList.innerHTML = '';
  if (!profiles || profiles.length === 0) {
    const empty = document.createElement('div');
    empty.style.padding = '16px';
    empty.style.color = 'var(--text-muted)';
    empty.textContent = 'Aucun profil pour le moment.';
    contextProfileList.appendChild(empty);
    return;
  }
  profiles.forEach((profile) => {
    const row = document.createElement('div');
    row.className = 'context-profile-row';
    const content = document.createElement('div');
    const title = document.createElement('div');
    title.style.fontWeight = '700';
    title.textContent = profile.name || 'Profil';
    const meta = document.createElement('div');
    meta.className = 'context-profile-meta';
    const match = profile.match || {};
    const details = [
      match.appName ? `App: ${match.appName}` : null,
      match.windowTitle ? `Fenêtre: ${match.windowTitle}` : null,
      match.urlDomain ? `URL: ${match.urlDomain}` : null,
      profile.tone ? `Tone: ${profile.tone}` : null,
    ].filter(Boolean).join(' · ');
    meta.textContent = details || 'Aucune règle de match';
    content.appendChild(title);
    content.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'context-profile-actions';
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn-secondary';
    editBtn.textContent = 'Éditer';
    editBtn.addEventListener('click', async () => {
      const res = await openModal({
        title: 'Éditer un profil',
        confirmText: 'Mettre à jour',
        fields: [
          { key: 'name', label: 'Nom', value: profile.name || '' },
          { key: 'appName', label: 'Match App (contient)', value: match.appName || '' },
          { key: 'windowTitle', label: 'Match Fenêtre (contient)', value: match.windowTitle || '' },
          { key: 'urlDomain', label: 'Match URL (contient)', value: match.urlDomain || '' },
          {
            key: 'tone',
            label: 'Tone',
            type: 'select',
            value: profile.tone || 'default',
            options: [
              { value: 'default', label: 'Default' },
              { value: 'concise', label: 'Concise' },
              { value: 'conversational', label: 'Conversational' },
            ],
          },
          {
            key: 'lineBreaks',
            label: 'Line breaks',
            type: 'select',
            value: profile.formatting?.lineBreaks || 'auto',
            options: [
              { value: 'auto', label: 'Auto' },
              { value: 'single', label: 'Single' },
              { value: 'double', label: 'Double' },
            ],
          },
          {
            key: 'punctuation',
            label: 'Punctuation',
            type: 'select',
            value: profile.formatting?.punctuation || 'minimal',
            options: [
              { value: 'minimal', label: 'Minimal' },
              { value: 'standard', label: 'Standard' },
            ],
          },
        ],
      });
      if (!res || !res.name) {
        return;
      }
      const nextProfiles = profiles.map((item) => (item.id === profile.id ? {
        ...item,
        name: res.name,
        match: {
          appName: res.appName || '',
          windowTitle: res.windowTitle || '',
          urlDomain: res.urlDomain || '',
        },
        tone: res.tone || 'default',
        formatting: {
          lineBreaks: res.lineBreaks || 'auto',
          punctuation: res.punctuation || 'minimal',
        },
      } : item));
      await saveContextProfiles(nextProfiles);
      renderContext(contextData);
      showToast('Profil mis à jour.');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-secondary';
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.addEventListener('click', async () => {
      const nextProfiles = profiles.filter((item) => item.id !== profile.id);
      await saveContextProfiles(nextProfiles);
      renderContext(contextData);
      showToast('Profil supprimé.');
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    row.appendChild(content);
    row.appendChild(actions);
    contextProfileList.appendChild(row);
  });
}

function renderContext(contextData) {
  const contextSettings = getContextSettingsLocal();
  const profiles = getContextProfilesLocal();

  if (contextEnabledToggle) {
    contextEnabledToggle.checked = contextSettings.enabled;
  }
  if (contextPostProcessToggle) {
    contextPostProcessToggle.checked = contextSettings.postProcessEnabled;
  }
  const signalMap = {
    app: contextSignalApp,
    window: contextSignalWindow,
    url: contextSignalUrl,
    ax: contextSignalAx,
    textbox: contextSignalTextbox,
    screenshot: contextSignalScreenshot,
  };
  Object.entries(signalMap).forEach(([key, el]) => {
    if (el) {
      el.checked = Boolean(contextSettings.signals[key]);
    }
  });
  if (contextRetentionInput) {
    contextRetentionInput.value = `${contextSettings.retentionDays || 30}`;
  }

  if (contextActiveApp) {
    contextActiveApp.textContent = contextData?.base?.appName || 'Inconnue';
  }
  if (contextActiveWindow) {
    contextActiveWindow.textContent = contextData?.base?.windowTitle || 'Inconnue';
  }
  if (contextActiveUrl) {
    contextActiveUrl.textContent = contextData?.base?.url || 'Non disponible';
  }

  const contextId = contextData?.contextId || '';
  const override = contextSettings.overrides?.[contextId] || {};
  const effectiveSignals = {
    ...contextSettings.signals,
    ...(override.signals || {}),
  };
  if (contextOverrideMode) {
    contextOverrideMode.value = override.mode || 'inherit';
    contextOverrideMode.disabled = !contextId;
  }

  if (contextOverrideProfile) {
    contextOverrideProfile.innerHTML = '<option value="">Profil…</option>';
    profiles.forEach((profile) => {
      const option = document.createElement('option');
      option.value = profile.id;
      option.textContent = profile.name || 'Profil';
      contextOverrideProfile.appendChild(option);
    });
    if (override.profileId) {
      contextOverrideProfile.value = override.profileId;
    }
    const overrideActive = (override.mode || 'inherit') === 'on';
    contextOverrideProfile.disabled = !overrideActive || !contextId;
    const overrideSignalMap = {
      app: contextOverrideSignalApp,
      window: contextOverrideSignalWindow,
      url: contextOverrideSignalUrl,
      ax: contextOverrideSignalAx,
      textbox: contextOverrideSignalTextbox,
      screenshot: contextOverrideSignalScreenshot,
    };
    Object.entries(overrideSignalMap).forEach(([key, el]) => {
      if (!el) {
        return;
      }
      el.checked = Boolean(effectiveSignals[key]);
      el.disabled = !overrideActive || !contextId;
    });
  }

  if (contextSuggestion) {
    const suggestionProfile = profiles.find((profile) => profile.id === contextData?.suggestionId);
    contextSuggestion.textContent = suggestionProfile ? suggestionProfile.name : '—';
    if (contextSuggestionApply) {
      contextSuggestionApply.disabled = !suggestionProfile;
    }
  }

  if (contextPreviewProfile) {
    contextPreviewProfile.innerHTML = '<option value="">Choisir un profil</option>';
    profiles.forEach((profile) => {
      const option = document.createElement('option');
      option.value = profile.id;
      option.textContent = profile.name || 'Profil';
      contextPreviewProfile.appendChild(option);
    });
  }

  renderContextProfiles(profiles, contextData);
}

async function updateContextOverride(contextId, mode, profileId, signalsOverride) {
  if (!contextId) {
    return;
  }
  const contextSettings = getContextSettingsLocal();
  const overrides = { ...(contextSettings.overrides || {}) };
  overrides[contextId] = {
    mode: mode || 'inherit',
    profileId: profileId || '',
    signals: signalsOverride || overrides[contextId]?.signals || {},
  };
  await saveContextSettings({ ...contextSettings, overrides });
  await refreshDashboard();
}

function renderSettings(settings) {
  settingsInputs.forEach((input) => {
    const key = input.dataset.setting;
    if (!key) {
      return;
    }
    if (key.startsWith('featureFlags.')) {
      const flag = key.split('.')[1];
      input.value = settings.featureFlags?.[flag] ? 'true' : 'false';
      return;
    }
    if (typeof settings[key] === 'undefined') {
      return;
    }
    if (key === 'postProcessEnabled' || key === 'metricsEnabled') {
      input.value = settings[key] ? 'true' : 'false';
    } else {
      input.value = settings[key];
    }
  });

  if (apiKeyStatus) {
    apiKeyStatus.innerHTML = settings.apiKeyPresent
      ? '<span style="width:8px;height:8px;border-radius:999px;background:#10B981;"></span> API OpenAI connectée'
      : '<span style="width:8px;height:8px;border-radius:999px;background:#EF4444;"></span> API manquante';
    apiKeyStatus.style.color = settings.apiKeyPresent ? '#059669' : '#EF4444';
  }
}

function renderAuth(auth, syncReady) {
  if (!authPanel) {
    return;
  }

  const syncBtn = syncNowButton;
  setSyncStatusMessage('');
  if (!syncReady) {
    authPanel.innerHTML = '';
    const errorSpan = document.createElement('span');
    errorSpan.className = 'sync-status error';
    errorSpan.textContent = 'Erreur de configuration serveur.';
    authPanel.appendChild(errorSpan);
    if (syncBtn) {
      syncBtn.disabled = true;
    }
    setSyncStatusMessage('Configuration sync indisponible.', 'error');
    return;
  }

  if (auth) {
    if (syncBtn) {
      syncBtn.disabled = false;
    }
    authPanel.innerHTML = '';
    const panel = document.createElement('div');
    panel.className = 'auth-card-panel';
    const email = document.createElement('span');
    email.className = 'auth-email';
    email.textContent = auth.email || '';
    const signOutButton = document.createElement('button');
    signOutButton.id = 'signOutButton';
    signOutButton.className = 'auth-action';
    signOutButton.type = 'button';
    signOutButton.textContent = 'Déconnexion';
    signOutButton.addEventListener('click', async () => {
      await window.electronAPI.authSignOut();
      await refreshDashboard();
    });
    panel.appendChild(email);
    panel.appendChild(signOutButton);
    authPanel.appendChild(panel);
    setSyncStatusMessage('Synchronisation disponible.', 'ok');
    return;
  }

  if (syncBtn) {
    syncBtn.disabled = true;
  }
  authPanel.innerHTML = '';
  const actions = document.createElement('div');
  actions.className = 'auth-actions-row';
  const authLoginButton = document.createElement('button');
  authLoginButton.id = 'authLoginButton';
  authLoginButton.className = 'auth-login-btn';
  authLoginButton.type = 'button';
  authLoginButton.textContent = 'Se connecter';
  authLoginButton.addEventListener('click', async () => {
    if (window.electronAPI?.openSignupUrl) {
      setButtonLoading(authLoginButton, true, 'Ouverture...');
      const result = await window.electronAPI.openSignupUrl('login');
      if (result?.ok === false) {
        showToast('Ouverture impossible.', 'error');
      }
      setButtonLoading(authLoginButton, false);
    }
  });
  const authSignupButton = document.createElement('button');
  authSignupButton.id = 'authSignupButton';
  authSignupButton.className = 'auth-signup-btn';
  authSignupButton.type = 'button';
  authSignupButton.textContent = 'Créer compte';
  authSignupButton.addEventListener('click', async () => {
    if (window.electronAPI?.openSignupUrl) {
      setButtonLoading(authSignupButton, true, 'Ouverture...');
      const result = await window.electronAPI.openSignupUrl('signup');
      if (result?.ok === false) {
        showToast('Ouverture impossible.', 'error');
      }
      setButtonLoading(authSignupButton, false);
    }
  });
  actions.appendChild(authLoginButton);
  actions.appendChild(authSignupButton);
  authPanel.appendChild(actions);
  setSyncStatusMessage('Connectez-vous pour synchroniser.');
}

let currentAuthState = null;
let authSubmitPending = false;

function setOverlayStatus(message, isError) {
  if (!authOverlayStatus) {
    return;
  }
  authOverlayStatus.textContent = message || '';
  authOverlayStatus.classList.remove('status-ok', 'status-error');
  authOverlayStatus.classList.add(isError ? 'status-error' : 'status-ok');
}

function applyAuthState(state) {
  currentAuthState = state || {};
  const status = currentAuthState.status || 'checking';
  const authed = status === 'authenticated';

  document.body.classList.toggle('auth-locked', !authed);
  if (authOverlay) {
    authOverlay.setAttribute('aria-hidden', authed ? 'true' : 'false');
  }

  let msg = '';
  let isErr = false;
  if (status === 'checking') {
    msg = 'Vérification...';
  } else if (status === 'error') {
    msg = 'Connexion indisponible';
    isErr = true;
  } else if (status === 'not_configured') {
    msg = 'Supabase non configuré.';
    isErr = true;
  }

  setOverlayStatus(currentAuthState.message || msg, isErr);

  const disabled = status === 'checking' || status === 'not_configured' || authSubmitPending;
  if (authOverlayLogin) {
    authOverlayLogin.disabled = disabled;
  }
  if (authOverlayEmail) {
    authOverlayEmail.disabled = disabled;
  }
  if (authOverlayPassword) {
    authOverlayPassword.disabled = disabled;
  }
  if (authOverlaySignup) {
    authOverlaySignup.disabled = disabled;
    authOverlaySignup.style.display = status === 'unauthenticated' ? 'inline-flex' : 'none';
  }
  if (authOverlayRetry) {
    authOverlayRetry.style.display = currentAuthState.retryable ? 'inline-flex' : 'none';
    authOverlayRetry.disabled = disabled;
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
  if (!navigator.mediaDevices?.enumerateDevices) {
    return;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const mics = devices.filter((device) => device.kind === 'audioinput');
    micDeviceCount = mics.length;
    const targets = [microphoneSelect, onboardingMicrophoneSelect].filter(Boolean);
    targets.forEach((select) => {
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
    if (onboardingState?.step === 'mic_check') {
      updateOnboardingUI();
    }
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

  let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
  if (setting === 'postProcessEnabled') {
    value = value === 'true';
  }
  if (setting === 'metricsEnabled') {
    value = value === 'true';
  }
  if (setting === 'uploadCloudFallback') {
    value = value === 'true';
  }
  if (setting === 'streamChunkMs') {
    const parsed = Number.parseInt(value, 10);
    value = Number.isFinite(parsed) ? parsed : currentSettings.streamChunkMs || 900;
  }
  if (setting === 'streamSampleRate') {
    const parsed = Number.parseInt(value, 10);
    value = Number.isFinite(parsed) ? parsed : currentSettings.streamSampleRate || 16000;
  }
  if (setting === 'uploadMaxMb') {
    const parsed = Number.parseInt(value, 10);
    value = Number.isFinite(parsed) ? parsed : currentSettings.uploadMaxMb || 200;
  }

  if (setting.startsWith('featureFlags.')) {
    const flag = setting.split('.')[1];
    const flags = { ...(currentSettings.featureFlags || {}) };
    flags[flag] = value === true || value === 'true';
    currentSettings = { ...currentSettings, featureFlags: flags };
  } else {
    currentSettings = { ...currentSettings, [setting]: value };
  }
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

function setOnboardingHotkeyCaptureState(active) {
  onboardingShortcutCaptureActive = Boolean(active);
  if (onboardingHotkeyInput) {
    onboardingHotkeyInput.classList.toggle('is-capturing', onboardingShortcutCaptureActive);
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

  renderStats(dashboardData.stats);
  renderQuota(dashboardData.quota);
  historyData = dashboardData.history || [];
  notesData = dashboardData.notes || [];
  dictionaryData = dashboardData.dictionary || [];
  snippetsData = dashboardData.snippets || [];
  refreshActiveList();
  renderDictionary(dictionaryData);
  renderSnippets(snippetsData);
  renderStyles(dashboardData.styles);
  renderSettings(currentSettings);
  renderContext(dashboardData.context);
  renderUploads(dashboardData.uploads);
  applyOnboardingStateFromSettings(currentSettings);
  renderAuth(dashboardData.auth, dashboardData.syncReady);
  renderSubscription(dashboardData.subscription, dashboardData.auth);
  await populateMicrophones();
  startSubscriptionActivationCheck();
}

window.addEventListener('DOMContentLoaded', () => {
  platform = window.electronAPI?.getPlatform ? window.electronAPI.getPlatform() : 'win32';
  updateBreadcrumb(currentView);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (event) => {
      if (event.target === modalBackdrop && modalResolver) {
        modalCancel.click();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modalResolver) {
        modalCancel.click();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (!document.body.classList.contains('note-focus-active')) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeFocusedNote();
      return;
    }
    const isSave = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
    if (isSave) {
      event.preventDefault();
      saveFocusedNote({ force: true });
    }
  });

  document.addEventListener('selectionchange', () => {
    if (!document.body.classList.contains('note-focus-active')) {
      hideFocusToolbar();
      return;
    }
    if (isSelectionInsideFocusedEditor()) {
      positionFocusToolbar();
      return;
    }
    hideFocusToolbar();
  });

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      setActiveView(item.dataset.view);
    });
  });

  if (onboardingStartButton) {
    onboardingStartButton.addEventListener('click', () => {
      onboardingSessionDismissed = false;
      setOnboardingStep('permissions');
    });
  }

  if (onboardingSkipButton) {
    onboardingSkipButton.addEventListener('click', () => {
      onboardingSessionDismissed = true;
      setOnboardingOverlayVisible(false);
      if (window.electronAPI?.stopOnboardingMic) {
        window.electronAPI.stopOnboardingMic();
      }
    });
  }

  if (onboardingPermissionButton) {
    onboardingPermissionButton.addEventListener('click', async () => {
      setOnboardingStatus(onboardingPermissionStatus, 'Demande d’accès en cours...');
      if (window.electronAPI?.startOnboardingMic) {
        const result = await window.electronAPI.startOnboardingMic();
        if (result?.ok === false) {
          setOnboardingStatus(onboardingPermissionStatus, 'Impossible de lancer le micro.', 'error');
        }
      }
    });
  }

  if (onboardingPrivacyLink) {
    onboardingPrivacyLink.addEventListener('click', async () => {
      if (window.electronAPI?.openPrivacyMicrophone) {
        await window.electronAPI.openPrivacyMicrophone();
      }
    });
  }

  if (onboardingMicrophoneApply) {
    onboardingMicrophoneApply.addEventListener('click', async () => {
      if (!onboardingMicrophoneSelect || !window.electronAPI?.saveSettings) {
        return;
      }
      const value = onboardingMicrophoneSelect.value;
      if (window.electronAPI?.stopOnboardingMic) {
        window.electronAPI.stopOnboardingMic();
      }
      currentSettings = { ...currentSettings, microphoneId: value };
      await window.electronAPI.saveSettings(sanitizeSettingsForSave(currentSettings));
      onboardingMicReady = false;
      onboardingMicLevel = 0;
      onboardingMicLastActiveAt = 0;
      onboardingMicIgnoreUntil = Date.now() + MIC_IGNORE_AFTER_CHANGE_MS;
      updateVuMeter(0);
      setOnboardingStatus(onboardingMicStatus, 'Micro mis à jour. Test en cours...', '');
      if (window.electronAPI?.startOnboardingMic) {
        await delay(150);
        await window.electronAPI.startOnboardingMic();
      }
      updateOnboardingChecklist();
      updateOnboardingUI();
    });
  }

  if (onboardingMicContinue) {
    onboardingMicContinue.addEventListener('click', () => {
      setOnboardingStep('hotkey');
    });
  }

  if (onboardingHotkeyInput) {
    onboardingHotkeyInput.addEventListener('focus', () => {
      onboardingShortcutBeforeCapture = onboardingHotkeyInput.value || currentSettings.shortcut || '';
      onboardingHotkeyInput.value = 'Appuyez sur les touches...';
      setOnboardingHotkeyCaptureState(true);
    });
    onboardingHotkeyInput.addEventListener('blur', () => {
      if (!onboardingShortcutCaptureActive) {
        onboardingHotkeyInput.value = currentSettings.shortcut || onboardingShortcutBeforeCapture || '';
        return;
      }
      setOnboardingHotkeyCaptureState(false);
      onboardingHotkeyInput.value = currentSettings.shortcut || onboardingShortcutBeforeCapture || '';
    });
    onboardingHotkeyInput.addEventListener('keydown', async (event) => {
      if (!onboardingShortcutCaptureActive) {
        return;
      }
      event.preventDefault();
      if (event.key === 'Escape') {
        onboardingHotkeyInput.value = onboardingShortcutBeforeCapture || currentSettings.shortcut || '';
        onboardingHotkeyInput.blur();
        return;
      }
      const accelerator = buildAcceleratorFromEvent(event);
      if (!accelerator) {
        setOnboardingStatus(onboardingHotkeyStatus, 'Utilisez une combinaison (Ctrl/Alt/Shift + touche).', 'error');
        return;
      }
      onboardingHotkeyInput.value = accelerator;
      onboardingHotkeyInput.blur();
      await saveShortcut(accelerator);
      const ok = currentSettings.shortcut === accelerator;
      onboardingState = { ...onboardingState, hotkeyReady: ok };
      await persistOnboardingState({ hotkeyReady: ok });
      if (ok) {
        setOnboardingStatus(onboardingHotkeyStatus, 'Raccourci enregistré.', 'success');
      } else {
        setOnboardingStatus(onboardingHotkeyStatus, 'Raccourci invalide. Essayez une autre combinaison.', 'error');
      }
      updateOnboardingChecklist();
      updateOnboardingUI();
    });
  }

  if (onboardingHotkeyNext) {
    onboardingHotkeyNext.addEventListener('click', () => {
      setOnboardingStep('first_dictation');
    });
  }

  if (onboardingDictateButton) {
    onboardingDictateButton.addEventListener('click', handleOnboardingDictation);
  }

  if (onboardingFirstRunNext) {
    onboardingFirstRunNext.addEventListener('click', () => {
      setOnboardingStep('delivery_check');
    });
  }

  if (onboardingDeliveryTestButton) {
    onboardingDeliveryTestButton.addEventListener('click', async () => {
      if (!window.electronAPI?.runOnboardingDeliveryCheck) {
        setOnboardingStatus(onboardingDeliveryStatus, 'Test indisponible.', 'error');
        return;
      }
      const sample = 'CrocoVoice OK';
      if (onboardingDeliveryInput) {
        onboardingDeliveryInput.value = '';
        onboardingDeliveryInput.focus();
      }
      setOnboardingStatus(onboardingDeliveryStatus, 'Test en cours...');
      const result = await window.electronAPI.runOnboardingDeliveryCheck(sample);
      setTimeout(() => {
        const received = onboardingDeliveryInput?.value.includes(sample);
        if (result?.ok && received) {
          onboardingDeliveryReady = true;
          setOnboardingStatus(onboardingDeliveryStatus, 'Injection OK.', 'success');
        } else {
          onboardingDeliveryReady = false;
          setOnboardingStatus(
            onboardingDeliveryStatus,
            result?.reason || 'Injection bloquée. Activez le presse-papier.',
            'error',
          );
        }
        updateOnboardingChecklist();
        updateOnboardingUI();
      }, 350);
    });
  }

  if (onboardingDeliveryNext) {
    onboardingDeliveryNext.addEventListener('click', () => {
      setOnboardingStep('done');
    });
  }

  if (onboardingFinishButton) {
    onboardingFinishButton.addEventListener('click', async () => {
      onboardingSessionDismissed = true;
      await persistOnboardingState({ completed: true, step: 'done' });
      setOnboardingOverlayVisible(false);
      setActiveView('home');
    });
  }

  if (profileCard) {
    profileCard.addEventListener('click', () => {
      setActiveView('account');
    });
    profileCard.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveView('account');
      }
    });
  }

  if (window.electronAPI?.onDashboardView) {
    window.electronAPI.onDashboardView((viewName) => {
      setActiveView(viewName || 'home');
    });
  }

  if (onboardingResetButton) {
    onboardingResetButton.addEventListener('click', async () => {
      onboardingSessionDismissed = false;
      onboardingMicReady = false;
      onboardingPermissionGranted = false;
      onboardingMicLevel = 0;
      onboardingMicLastActiveAt = 0;
      onboardingDeliveryReady = false;
      updateVuMeter(0);
      if (onboardingSandbox) {
        onboardingSandbox.value = '';
      }
      if (onboardingSuccessBadge) {
        onboardingSuccessBadge.classList.remove('active');
      }
      if (window.electronAPI?.stopOnboardingMic) {
        window.electronAPI.stopOnboardingMic();
      }
      await persistOnboardingState({
        step: 'welcome',
        completed: false,
        firstRunSuccess: false,
        hotkeyReady: false,
      });
      setActiveView('home');
      updateOnboardingUI();
    });
  }

  if (uploadAudioButton) {
    uploadAudioButton.addEventListener('click', async () => {
      if (!window.electronAPI?.selectUploadFile) {
        showToast('Import indisponible.', 'error');
        return;
      }
      const result = await window.electronAPI.selectUploadFile();
      if (!result?.ok) {
        if (result?.reason && result.reason !== 'canceled') {
          showToast(result.reason, 'error');
        }
        return;
      }
      showToast('Fichier ajouté.');
      await refreshDashboard();
    });
  }

  if (uploadDropzone) {
    const clearDropActive = () => uploadDropzone.classList.remove('is-dragover');
    uploadDropzone.addEventListener('dragover', (event) => {
      event.preventDefault();
      uploadDropzone.classList.add('is-dragover');
    });
    uploadDropzone.addEventListener('dragleave', () => {
      clearDropActive();
    });
    uploadDropzone.addEventListener('drop', async (event) => {
      event.preventDefault();
      clearDropActive();
      const file = event.dataTransfer?.files?.[0];
      if (!file) {
        return;
      }
      if (!window.electronAPI?.addUploadFile) {
        showToast('Import indisponible.', 'error');
        return;
      }
      const result = await window.electronAPI.addUploadFile(file.path);
      if (!result?.ok) {
        if (result?.reason) {
          showToast(result.reason, 'error');
        }
        return;
      }
      showToast('Fichier ajouté.');
      await refreshDashboard();
    });
    uploadDropzone.addEventListener('click', (event) => {
      if (uploadAudioButton && uploadAudioButton.contains(event.target)) {
        return;
      }
      if (uploadAudioButton) {
        uploadAudioButton.click();
      }
    });
  }

  if (diagnosticsRunChecks) {
    diagnosticsRunChecks.addEventListener('click', async () => {
      await runDiagnosticsChecks();
    });
  }

  if (diagnosticsCopy) {
    diagnosticsCopy.addEventListener('click', async () => {
      const text = diagnosticsOutput?.textContent || '';
      if (!text) {
        showToast('Aucun diagnostic à copier.', 'error');
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        showToast('Diagnostics copiés.');
      } catch (error) {
        showToast('Impossible de copier.', 'error');
      }
    });
  }

  if (window.electronAPI?.onOnboardingMicLevel) {
    window.electronAPI.onOnboardingMicLevel(handleOnboardingMicLevel);
  }

  if (window.electronAPI?.onOnboardingMicError) {
    window.electronAPI.onOnboardingMicError((message) => {
      setOnboardingStatus(
        onboardingPermissionStatus,
        message || 'Accès micro refusé. Ouvrez les paramètres Windows.',
        'error',
      );
      setOnboardingStatus(onboardingMicStatus, message || 'Aucun signal détecté.', 'error');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const nextValue = event.target.value;
      if (searchDebounceId) {
        clearTimeout(searchDebounceId);
      }
      searchDebounceId = setTimeout(() => {
        searchTerm = nextValue.trim();
        refreshActiveList();
      }, 200);
    });
  }

  if (noteFocusBack) {
    noteFocusBack.addEventListener('click', () => {
      closeFocusedNote();
    });
  }

  if (noteFocusTitle) {
    noteFocusTitle.addEventListener('input', handleFocusedTitleInput);
  }

  if (noteFocusEditor) {
    noteFocusEditor.addEventListener('input', handleFocusedEditorInput);
    noteFocusEditor.addEventListener('click', (event) => {
      const link = event.target && event.target.closest ? event.target.closest('a') : null;
      if (!link || !link.href) {
        return;
      }
      event.preventDefault();
      window.open(link.href, '_blank', 'noopener');
    });
  }

  if (noteFocusToolbar) {
    noteFocusToolbar.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
    noteFocusToolbar.querySelectorAll('[data-format]').forEach((button) => {
      button.addEventListener('click', async () => {
        await applyFocusFormat(button.dataset.format);
      });
    });
  }

  if (upgradePlanButton) {
    upgradePlanButton.addEventListener('click', async () => {
      await triggerCheckout(upgradePlanButton);
    });
  }

  if (upgradeNudgeButton) {
    upgradeNudgeButton.addEventListener('click', async () => {
      await triggerCheckout(upgradeNudgeButton);
    });
  }

  if (manageSubscriptionButton) {
    manageSubscriptionButton.addEventListener('click', async () => {
      if (!window.electronAPI?.openSubscriptionPortal) {
        showToast('Portail indisponible.', 'error');
        return;
      }
      const auth = window.electronAPI?.authStatus ? await window.electronAPI.authStatus() : null;
      if (!auth) {
        showToast('Connectez-vous pour gérer l’abonnement.', 'error');
        if (window.electronAPI?.openSignupUrl) {
          setButtonLoading(manageSubscriptionButton, true, 'Ouverture...');
          const result = await window.electronAPI.openSignupUrl('login');
          if (result?.ok === false) {
            showToast('Ouverture impossible.', 'error');
          }
          setButtonLoading(manageSubscriptionButton, false);
        }
        return;
      }
      try {
        setButtonLoading(manageSubscriptionButton, true, 'Ouverture...');
        const result = await window.electronAPI.openSubscriptionPortal();
        if (!result?.ok) {
          showToast('Portail non configuré.', 'error');
          return;
        }
      } catch (error) {
        showToast(error?.message || 'Portail indisponible.', 'error');
      } finally {
        setButtonLoading(manageSubscriptionButton, false);
      }
    });
  }

  if (refreshSubscriptionButton) {
    refreshSubscriptionButton.addEventListener('click', async () => {
      if (!window.electronAPI?.refreshSubscription) {
        showToast('Actualisation indisponible.', 'error');
        return;
      }
      const auth = window.electronAPI?.authStatus ? await window.electronAPI.authStatus() : null;
      if (!auth) {
        showToast('Connectez-vous pour actualiser.', 'error');
        return;
      }
      try {
        const result = await window.electronAPI.refreshSubscription();
        if (!result?.ok) {
          showToast('Actualisation impossible.', 'error');
          return;
        }
        showToast('Abonnement actualisé.');
        await refreshDashboard();
      } catch (error) {
        showToast(error?.message || 'Actualisation indisponible.', 'error');
      }
    });
  }

  document.querySelectorAll('[data-empty-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.emptyAction;
      if (action === 'notes') {
        setActiveView('notes');
        return;
      }
      if (action === 'note-editor') {
        setActiveView('notes');
        openFocusedNote(null);
        return;
      }
      if (action === 'dictionary') {
        setActiveView('dictionary');
        dictionaryWordInput?.focus();
        return;
      }
      if (action === 'snippets') {
        setActiveView('snippets');
        snippetCueInput?.focus();
        return;
      }
      if (action === 'styles') {
        refreshDashboard();
      }
    });
  });

  if (createNoteButton) {
    createNoteButton.addEventListener('click', handleCreateNote);
  }

  document.querySelectorAll('.win-control').forEach((control) => {
    const action = control.dataset.windowControl;
    if (!action) {
      return;
    }
    control.addEventListener('click', () => {
      if (window.electronAPI?.sendWindowControl) {
        window.electronAPI.sendWindowControl(action);
      }
    });
  });

  settingsInputs.forEach((input) => input.addEventListener('change', handleSettingChange));

  if (shortcutInput) {
    shortcutInput.addEventListener('focus', () => {
      shortcutBeforeCapture = shortcutInput.value || currentSettings.shortcut || '';
      setShortcutCaptureState(true);
      shortcutInput.value = 'Appuyez sur les touches...';
    });
    shortcutInput.addEventListener('blur', () => {
      if (!shortcutCaptureActive) {
        return;
      }
      setShortcutCaptureState(false);
      renderSettings(currentSettings);
    });
    shortcutInput.addEventListener('keydown', async (event) => {
      if (!shortcutCaptureActive) {
        return;
      }
      if (event.repeat) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      if (event.key === 'Escape') {
        setShortcutCaptureState(false);
        shortcutInput.value = shortcutBeforeCapture;
        shortcutInput.blur();
        return;
      }

      if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) {
        return;
      }

      const accelerator = buildAcceleratorFromEvent(event);
      if (!accelerator) {
        if (!shortcutInvalidShown) {
          showToast('Raccourci invalide. Utilisez au moins un modificateur.', 'error');
          shortcutInvalidShown = true;
        }
        return;
      }

      setShortcutCaptureState(false);
      shortcutInput.value = accelerator;
      shortcutInput.blur();
      await saveShortcut(accelerator);
    });
  }

  if (shortcutResetButton) {
    shortcutResetButton.addEventListener('click', async () => {
      await saveShortcut(getDefaultShortcut());
    });
  }

  if (syncNowButton) {
    syncNowButton.addEventListener('click', async () => {
      if (!window.electronAPI?.syncNow) {
        showToast('Synchronisation indisponible.', 'error');
        return;
      }
      syncNowButton.disabled = true;
      syncNowButton.classList.add('is-loading');
      setSyncStatusMessage('Synchronisation en cours...');
      try {
        const result = await window.electronAPI.syncNow();
        if (result?.ok) {
          showToast('Synchronisation terminée.');
          setSyncStatusMessage('Synchronisation terminée.', 'ok');
        } else if (result?.reason === 'not_authenticated') {
          showToast('Connectez-vous pour synchroniser.', 'error');
          setSyncStatusMessage('Connexion requise pour synchroniser.', 'error');
        } else if (result?.reason === 'not_configured') {
          showToast('Sync non configuré.', 'error');
          setSyncStatusMessage('Configuration sync indisponible.', 'error');
        } else {
          showToast('Erreur de synchronisation.', 'error');
          setSyncStatusMessage('Erreur de synchronisation.', 'error');
        }
      } catch (error) {
        showToast('Erreur de synchronisation.', 'error');
        setSyncStatusMessage('Erreur de synchronisation.', 'error');
      } finally {
        syncNowButton.disabled = false;
        syncNowButton.classList.remove('is-loading');
      }
    });
  }

  if (misspellingToggle) {
    misspellingToggle.addEventListener('change', (event) => {
      if (dictionaryCorrectionInput) {
        dictionaryCorrectionInput.style.display = event.target.checked ? 'block' : 'none';
        if (!event.target.checked) {
          dictionaryCorrectionInput.value = '';
        }
      }
    });
  }

  if (dictionaryAddButton) {
    dictionaryAddButton.addEventListener('click', async () => {
      const word = dictionaryWordInput?.value.trim();
      if (!word) {
        showToast('Veuillez entrer un mot.', 'error');
        return;
      }
      const duplicate = (dictionaryData || []).some((entry) =>
        entry.from_text && entry.from_text.trim().toLowerCase() === word.toLowerCase()
      );
      if (duplicate) {
        showToast('Ce terme existe déjà dans le dictionnaire.', 'error');
        return;
      }
      const correction = misspellingToggle?.checked ? dictionaryCorrectionInput?.value.trim() : word;
      if (misspellingToggle?.checked && !correction) {
        showToast('Veuillez saisir la correction.', 'error');
        return;
      }
      await window.electronAPI.upsertDictionary({ from_text: word, to_text: correction });
      showToast(`"${word}" ajouté au dictionnaire.`);
      if (dictionaryWordInput) {
        dictionaryWordInput.value = '';
      }
      if (dictionaryCorrectionInput) {
        dictionaryCorrectionInput.value = '';
      }
      await refreshDashboard();
    });
  }

  if (dictionaryCancelButton) {
    dictionaryCancelButton.addEventListener('click', () => {
      if (dictionaryWordInput) {
        dictionaryWordInput.value = '';
      }
      if (dictionaryCorrectionInput) {
        dictionaryCorrectionInput.value = '';
      }
      if (misspellingToggle) {
        misspellingToggle.checked = false;
      }
      if (dictionaryCorrectionInput) {
        dictionaryCorrectionInput.style.display = 'none';
      }
    });
  }

  if (contextEnabledToggle) {
    contextEnabledToggle.addEventListener('change', async () => {
      const contextSettings = getContextSettingsLocal();
      await saveContextSettings({ ...contextSettings, enabled: contextEnabledToggle.checked });
      await refreshDashboard();
    });
  }
  if (contextPostProcessToggle) {
    contextPostProcessToggle.addEventListener('change', async () => {
      const contextSettings = getContextSettingsLocal();
      await saveContextSettings({ ...contextSettings, postProcessEnabled: contextPostProcessToggle.checked });
    });
  }

  const contextSignalMap = [
    ['app', contextSignalApp],
    ['window', contextSignalWindow],
    ['url', contextSignalUrl],
    ['ax', contextSignalAx],
    ['textbox', contextSignalTextbox],
    ['screenshot', contextSignalScreenshot],
  ];
  contextSignalMap.forEach(([key, el]) => {
    if (!el) {
      return;
    }
    el.addEventListener('change', async () => {
      const contextSettings = getContextSettingsLocal();
      const nextSignals = { ...(contextSettings.signals || {}), [key]: el.checked };
      await saveContextSettings({ ...contextSettings, signals: nextSignals });
      await refreshDashboard();
    });
  });

  if (contextRetentionSave) {
    contextRetentionSave.addEventListener('click', async () => {
      const value = Number.parseInt(contextRetentionInput?.value || '30', 10);
      if (!Number.isFinite(value) || value <= 0) {
        showToast('Durée invalide.', 'error');
        return;
      }
      const contextSettings = getContextSettingsLocal();
      await saveContextSettings({ ...contextSettings, retentionDays: value });
      showToast('Rétention mise à jour.');
    });
  }

  if (contextDeleteAll) {
    contextDeleteAll.addEventListener('click', async () => {
      if (!window.electronAPI?.clearContext) {
        return;
      }
      await window.electronAPI.clearContext();
      showToast('Contexte supprimé.');
    });
  }

  if (contextOverrideMode) {
    contextOverrideMode.addEventListener('change', async () => {
      const contextId = dashboardData?.context?.contextId || '';
      await updateContextOverride(contextId, contextOverrideMode.value, contextOverrideProfile?.value || '');
    });
  }

  if (contextOverrideProfile) {
    contextOverrideProfile.addEventListener('change', async () => {
      const contextId = dashboardData?.context?.contextId || '';
      await updateContextOverride(contextId, contextOverrideMode?.value || 'inherit', contextOverrideProfile.value || '');
    });
  }

  const overrideSignalElements = [
    ['app', contextOverrideSignalApp],
    ['window', contextOverrideSignalWindow],
    ['url', contextOverrideSignalUrl],
    ['ax', contextOverrideSignalAx],
    ['textbox', contextOverrideSignalTextbox],
    ['screenshot', contextOverrideSignalScreenshot],
  ];
  overrideSignalElements.forEach(([, el]) => {
    if (!el) {
      return;
    }
    el.addEventListener('change', async () => {
      const contextId = dashboardData?.context?.contextId || '';
      const signals = {
        app: Boolean(contextOverrideSignalApp?.checked),
        window: Boolean(contextOverrideSignalWindow?.checked),
        url: Boolean(contextOverrideSignalUrl?.checked),
        ax: Boolean(contextOverrideSignalAx?.checked),
        textbox: Boolean(contextOverrideSignalTextbox?.checked),
        screenshot: Boolean(contextOverrideSignalScreenshot?.checked),
      };
      await updateContextOverride(contextId, contextOverrideMode?.value || 'inherit', contextOverrideProfile?.value || '', signals);
    });
  });

  if (contextSuggestionApply) {
    contextSuggestionApply.addEventListener('click', async () => {
      const contextId = dashboardData?.context?.contextId || '';
      const suggestionId = dashboardData?.context?.suggestionId || '';
      if (!suggestionId) {
        return;
      }
      await updateContextOverride(contextId, 'on', suggestionId);
    });
  }

  if (contextProfileCreate) {
    contextProfileCreate.addEventListener('click', async () => {
      const res = await openModal({
        title: 'Nouveau profil',
        confirmText: 'Créer',
        fields: [
          { key: 'name', label: 'Nom', value: '' },
          { key: 'appName', label: 'Match App (contient)', value: '' },
          { key: 'windowTitle', label: 'Match Fenêtre (contient)', value: '' },
          { key: 'urlDomain', label: 'Match URL (contient)', value: '' },
          {
            key: 'tone',
            label: 'Tone',
            type: 'select',
            value: 'default',
            options: [
              { value: 'default', label: 'Default' },
              { value: 'concise', label: 'Concise' },
              { value: 'conversational', label: 'Conversational' },
            ],
          },
          {
            key: 'lineBreaks',
            label: 'Line breaks',
            type: 'select',
            value: 'auto',
            options: [
              { value: 'auto', label: 'Auto' },
              { value: 'single', label: 'Single' },
              { value: 'double', label: 'Double' },
            ],
          },
          {
            key: 'punctuation',
            label: 'Punctuation',
            type: 'select',
            value: 'minimal',
            options: [
              { value: 'minimal', label: 'Minimal' },
              { value: 'standard', label: 'Standard' },
            ],
          },
        ],
      });
      if (!res || !res.name) {
        return;
      }
      const profiles = getContextProfilesLocal();
      const profile = {
        id: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : `${Date.now()}`,
        name: res.name,
        match: {
          appName: res.appName || '',
          windowTitle: res.windowTitle || '',
          urlDomain: res.urlDomain || '',
        },
        tone: res.tone || 'default',
        formatting: {
          lineBreaks: res.lineBreaks || 'auto',
          punctuation: res.punctuation || 'minimal',
        },
      };
      const nextProfiles = [profile, ...profiles];
      await saveContextProfiles(nextProfiles);
      await refreshDashboard();
      showToast('Profil créé.');
    });
  }

  if (contextPreviewButton) {
    contextPreviewButton.addEventListener('click', async () => {
      const profileId = contextPreviewProfile?.value || '';
      const input = contextPreviewInput?.value || '';
      if (!profileId) {
        showToast('Choisissez un profil.', 'error');
        return;
      }
      if (!window.electronAPI?.previewContextFormatting) {
        return;
      }
      const result = await window.electronAPI.previewContextFormatting(profileId, input);
      if (contextPreviewOutput) {
        contextPreviewOutput.value = result?.text || '';
      }
    });
  }

  if (snippetAddButton) {
    snippetAddButton.addEventListener('click', async () => {
      const cue = snippetCueInput?.value.trim();
      const template = snippetTemplateInput?.value.trim();
      const description = snippetDescriptionInput?.value.trim() || '';
      if (!cue) {
        showToast('Veuillez saisir un cue.', 'error');
        return;
      }
      if (!template) {
        showToast('Veuillez saisir un template.', 'error');
        return;
      }
      const cueNorm = normalizeSnippetCue(cue);
      const duplicate = (snippetsData || []).some((entry) =>
        normalizeSnippetCue(entry.cue) === cueNorm
      );
      if (duplicate) {
        showToast('Ce cue existe déjà.', 'error');
        return;
      }
      await window.electronAPI.upsertSnippet({ cue, template, description });
      showToast('Snippet ajouté.');
      if (snippetCueInput) {
        snippetCueInput.value = '';
      }
      if (snippetTemplateInput) {
        snippetTemplateInput.value = '';
      }
      if (snippetDescriptionInput) {
        snippetDescriptionInput.value = '';
      }
      await refreshDashboard();
    });
  }

  if (snippetCancelButton) {
    snippetCancelButton.addEventListener('click', () => {
      if (snippetCueInput) {
        snippetCueInput.value = '';
      }
      if (snippetTemplateInput) {
        snippetTemplateInput.value = '';
      }
      if (snippetDescriptionInput) {
        snippetDescriptionInput.value = '';
      }
    });
  }

  if (authOverlayForm) {
    authOverlayForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await submitAuthLogin();
    });
  }
  if (authOverlaySignup) {
    authOverlaySignup.addEventListener('click', async () => {
      if (window.electronAPI?.openSignupUrl) {
        setButtonLoading(authOverlaySignup, true, 'Ouverture...');
        const result = await window.electronAPI.openSignupUrl('signup');
        if (result?.ok === false) {
          setOverlayStatus('Ouverture impossible.', true);
        }
        setButtonLoading(authOverlaySignup, false);
      }
    });
  }
  if (authOverlayRetry) {
    authOverlayRetry.addEventListener('click', async () => {
      if (window.electronAPI?.authRetry) {
        setOverlayStatus('Nouvelle tentative...', false);
        await window.electronAPI.authRetry();
      }
    });
  }

  if (window.electronAPI?.onDashboardTranscription) {
    window.electronAPI.onDashboardTranscription((text, target) => {
      if (target === 'notes') {
        const add = (text || '').trim();
        if (!add) {
          return;
        }
        showToast('Note ajoutée.');
        refreshDashboard();
        return;
      }

      if (target === 'onboarding') {
        onboardingRecordingActive = false;
        if (onboardingDictateButton) {
          onboardingDictateButton.textContent = 'Dicter maintenant';
        }
        const add = (text || '').trim();
        if (!add) {
          setOnboardingStatus(onboardingDictationStatus, 'On ne vous entend pas. Réessayez.', 'error');
          return;
        }
        if (onboardingSandbox) {
          onboardingSandbox.value = add;
        }
        onboardingState = { ...onboardingState, firstRunSuccess: true };
        onboardingDeliveryReady = onboardingDeliveryReady || false;
        setOnboardingStatus(onboardingDictationStatus, 'Texte reçu avec succès.', 'success');
        if (onboardingSuccessBadge) {
          onboardingSuccessBadge.classList.add('active');
        }
        updateOnboardingChecklist();
        updateOnboardingUI();
        persistOnboardingState({ firstRunSuccess: true });
      }
    });
  }

  if (window.electronAPI?.onDashboardDiff) {
    window.electronAPI.onDashboardDiff((payload) => {
      diffData = {
        before: payload?.before || '',
        after: payload?.after || '',
      };
      setActiveView('diff');
    });
  }

  if (window.electronAPI?.onDashboardTranscriptionError) {
    window.electronAPI.onDashboardTranscriptionError((error) => {
      if (onboardingRecordingActive) {
        const message = typeof error === 'string' ? error : error?.message;
        onboardingRecordingActive = false;
        if (onboardingDictateButton) {
          onboardingDictateButton.textContent = 'Dicter maintenant';
        }
        setOnboardingStatus(onboardingDictationStatus, message || 'La dictée a échoué.', 'error');
      }
    });
  }

  if (window.electronAPI?.getAuthState) {
    window.electronAPI.getAuthState().then(applyAuthState).catch(() => applyAuthState({ status: 'error' }));
  }
  if (window.electronAPI?.onAuthState) {
    window.electronAPI.onAuthState(applyAuthState);
  }
  if (window.electronAPI?.onAuthRequired) {
    window.electronAPI.onAuthRequired((msg) => applyAuthState({ status: 'unauthenticated', message: msg }));
  }

  if (window.electronAPI?.onDashboardDataUpdated) {
    window.electronAPI.onDashboardDataUpdated(() => refreshDashboard());
  }

  if (window.electronAPI?.onSettingsUpdated) {
    window.electronAPI.onSettingsUpdated((nextSettings) => {
      currentSettings = nextSettings || currentSettings;
      applyOnboardingStateFromSettings(currentSettings);
    });
  }

  refreshDashboard();
});
