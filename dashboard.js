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
const styleList = document.getElementById('styleList');
const styleEmpty = document.getElementById('styleEmpty');
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
const noteTitleInput = document.getElementById('noteTitleInput');
const noteBodyInput = document.getElementById('noteBodyInput');
const createNoteButton = document.getElementById('createNoteButton');
const captureNoteButton = document.getElementById('captureNoteButton');
const recordingFeedback = document.getElementById('recordingFeedback');
const micPulse = document.getElementById('micPulse');
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

let currentSettings = {};
let dashboardData = null;
let currentView = 'home';
let searchTerm = '';
let historyData = [];
let notesData = [];
let noteCaptureActive = false;
let modalResolver = null;
let platform = 'win32';
let shortcutCaptureActive = false;
let shortcutBeforeCapture = '';
let shortcutInvalidShown = false;
let historyLoadError = false;
let quotaSnapshot = null;
const STYLE_PRESETS = ['Default', 'Casual', 'Formel'];
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
};
const STYLE_DESCRIPTIONS = {
  Default: 'Style par défaut, neutre et clair.',
  Casual: 'Ton décontracté, idéal pour les réseaux.',
  Formel: 'Langage soutenu et professionnel.',
};
const STYLE_LABELS = {
  Default: 'Standard',
  Casual: 'Casual',
  Formel: 'Formel',
};

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
    if (field.multiline) {
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
    notes: { primary: 'Notes', secondary: 'Nouvelle note' },
    dictionary: { primary: 'Dictionnaire', secondary: 'Corrections' },
    style: { primary: 'Styles', secondary: 'Persona' },
    settings: { primary: 'Réglages', secondary: 'Général' },
    account: { primary: 'Profil', secondary: 'Facturation' },
  };

  const next = map[viewName] || map.home;
  breadcrumbPrimary.textContent = next.primary;
  breadcrumbSecondary.textContent = next.secondary;
}

function setActiveView(viewName) {
  const supportedViews = new Set(['home', 'notes', 'dictionary', 'style', 'settings', 'account']);
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

function filterEntries(entries, query) {
  if (!query) {
    return entries || [];
  }
  const lower = query.toLowerCase();
  return (entries || []).filter((entry) => [entry.title, entry.text, entry.raw_text]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(lower));
}

function showToast(message, type = 'success') {
  if (!toastContainer) {
    return;
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.innerHTML = `
    <div class="toast-icon">
      ${type === 'error'
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"></path></svg>'}
    </div>
    <div>
      <div class="toast-title">${type === 'error' ? 'Erreur' : 'Succès'}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
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

function sanitizeSettingsForSave(value) {
  const settings = { ...(value || {}) };
  delete settings.apiKeyPresent;
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

function insertMarkdown(syntax) {
  if (!noteBodyInput) {
    return;
  }
  const start = noteBodyInput.selectionStart || 0;
  const end = noteBodyInput.selectionEnd || 0;
  const value = noteBodyInput.value || '';
  const before = value.slice(0, start);
  const selection = value.slice(start, end);
  const after = value.slice(end);
  if (syntax === '- ') {
    noteBodyInput.value = `${before}\n${syntax}${selection}${after}`;
    noteBodyInput.selectionStart = noteBodyInput.selectionEnd = end + syntax.length + 1;
  } else {
    noteBodyInput.value = `${before}${syntax}${selection}${syntax}${after}`;
    noteBodyInput.selectionStart = start + syntax.length;
    noteBodyInput.selectionEnd = end + syntax.length;
  }
  noteBodyInput.focus();
}

function buildEntryRow(entry, type) {
  const row = document.createElement('div');
  row.className = 'entry-row';

  const icon = document.createElement('div');
  icon.className = 'entry-icon';
  icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';

  const main = document.createElement('div');
  main.className = 'entry-main';

  const metaDiv = document.createElement('div');
  metaDiv.className = 'entry-meta';
  const timePart = entry.created_at ? formatTime(entry.created_at) : '';
  const datePart = formatDateLabel(entry.created_at);
  metaDiv.textContent = [timePart, datePart].filter(Boolean).join(' · ');

  const title = document.createElement('div');
  title.className = 'entry-title';
  title.textContent = entry.title || entry.text?.split(/\r?\n/)[0] || 'Sans titre';

  const preview = document.createElement('div');
  preview.className = 'entry-preview';
  preview.textContent = entry.text || entry.raw_text || '';

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
    if (!text || !navigator.clipboard) {
      return;
    }
    await navigator.clipboard.writeText(text);
    showToast('Texte copié.');
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
    await method(entry.id);
    showToast(type === 'notes' ? 'Note supprimée.' : 'Entrée supprimée.');
    await refreshDashboard();
  });

  actions.appendChild(copyBtn);
  actions.appendChild(deleteBtn);

  row.appendChild(icon);
  row.appendChild(main);
  row.appendChild(actions);

  return row;
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
  renderHistoryList();
}

function toggleRecordingVisuals(active) {
  noteCaptureActive = active;
  if (recordingFeedback) {
    recordingFeedback.classList.toggle('active', active);
  }
  if (micPulse) {
    micPulse.classList.toggle('active', active);
  }
  if (captureNoteButton) {
    captureNoteButton.classList.toggle('is-recording', active);
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
    statTotal.textContent = stats.total;
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
    return;
  }
  if (quota.checkFailed || quota.unavailable) {
    quotaRemaining.textContent = '—';
    quotaReset.textContent = quota.message || 'Quota indisponible';
    return;
  }
  if (quota.requiresAuth) {
    quotaRemaining.textContent = '—';
    quotaReset.textContent = 'Connectez-vous pour voir le quota';
    return;
  }
  if (quota.unlimited) {
    quotaRemaining.textContent = 'Illimité';
    quotaReset.textContent = 'Plan Pro actif';
    return;
  }
  quotaRemaining.textContent = quota.remaining;
  quotaReset.textContent = formatResetLabel(quota.resetAt);
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
      subscriptionNote.textContent = 'Après achat, cliquez sur Actualiser pour récupérer votre statut.';
    } else if (subscription?.isPro) {
      subscriptionNote.textContent = 'Merci pour votre abonnement PRO.';
    } else {
      subscriptionNote.textContent = 'Passez Pro pour débloquer la dictée illimitée.';
    }
  }
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
    preview.innerHTML = `
      <div class="style-preview-row">
        <span class="style-preview-label">Avant</span>
        <span class="style-preview-text">"${beforeText}"</span>
      </div>
      <div class="style-preview-row style-preview-after">
        <span class="style-preview-label">Après</span>
        <span class="style-preview-text">"${afterText}"</span>
      </div>
    `;

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

function renderSettings(settings) {
  settingsInputs.forEach((input) => {
    const key = input.dataset.setting;
    if (!key || typeof settings[key] === 'undefined') {
      return;
    }
    if (key === 'postProcessEnabled') {
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
    authPanel.innerHTML = '<span class="sync-status error">Erreur de configuration serveur.</span>';
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
    authPanel.innerHTML = `
      <div class="auth-card-panel">
        <span class="auth-email">${auth.email}</span>
        <button id="signOutButton" class="auth-action" type="button">Déconnexion</button>
      </div>
    `;
    document.getElementById('signOutButton')?.addEventListener('click', async () => {
      await window.electronAPI.authSignOut();
      await refreshDashboard();
    });
    setSyncStatusMessage('Synchronisation disponible.', 'ok');
    return;
  }

  if (syncBtn) {
    syncBtn.disabled = true;
  }
  authPanel.innerHTML = `
    <div class="auth-actions-row">
      <button id="authLoginButton" class="auth-login-btn" type="button">Se connecter</button>
      <button id="authSignupButton" class="auth-signup-btn" type="button">Créer compte</button>
    </div>
  `;
  document.getElementById('authLoginButton')?.addEventListener('click', async () => {
    if (window.electronAPI?.openSignupUrl) {
      await window.electronAPI.openSignupUrl('login');
    }
  });
  document.getElementById('authSignupButton')?.addEventListener('click', async () => {
    if (window.electronAPI?.openSignupUrl) {
      await window.electronAPI.openSignupUrl('signup');
    }
  });
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
  if (!microphoneSelect || !navigator.mediaDevices?.enumerateDevices) {
    return;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const mics = devices.filter((device) => device.kind === 'audioinput');
    microphoneSelect.innerHTML = '<option value="">Défaut système</option>';
    mics.forEach((mic) => {
      const option = document.createElement('option');
      option.value = mic.deviceId;
      option.textContent = mic.label || `Micro ${mic.deviceId.slice(0, 4)}...`;
      microphoneSelect.appendChild(option);
    });
    if (currentSettings.microphoneId) {
      microphoneSelect.value = currentSettings.microphoneId;
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

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      setActiveView(item.dataset.view);
    });
  });

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

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchTerm = event.target.value.trim();
      refreshActiveList();
    });
  }

  if (captureNoteButton) {
    captureNoteButton.addEventListener('click', handleNoteDictation);
  }

  if (upgradePlanButton) {
    upgradePlanButton.addEventListener('click', async () => {
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
        const result = await window.electronAPI.startCheckout();
        if (!result?.ok) {
          showToast('Checkout non configuré.', 'error');
          return;
        }
        showToast('Redirection vers Stripe...');
        await refreshDashboard();
      } catch (error) {
        showToast(error?.message || 'Checkout impossible.', 'error');
      }
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
          await window.electronAPI.openSignupUrl('login');
        }
        return;
      }
      try {
        const result = await window.electronAPI.openSubscriptionPortal();
        if (!result?.ok) {
          showToast('Portail non configuré.', 'error');
          return;
        }
      } catch (error) {
        showToast(error?.message || 'Portail indisponible.', 'error');
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

  document.querySelectorAll('.editor-tool').forEach((button) => {
    button.addEventListener('click', () => {
      const md = button.dataset.md;
      if (md) {
        insertMarkdown(md);
      }
    });
  });

  document.querySelectorAll('[data-empty-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.emptyAction;
      if (action === 'notes') {
        setActiveView('notes');
        return;
      }
      if (action === 'note-editor') {
        setActiveView('notes');
        noteTitleInput?.focus();
        return;
      }
      if (action === 'dictionary') {
        setActiveView('dictionary');
        dictionaryWordInput?.focus();
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

  if (authOverlayForm) {
    authOverlayForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await submitAuthLogin();
    });
  }
  if (authOverlaySignup) {
    authOverlaySignup.addEventListener('click', async () => {
      if (window.electronAPI?.openSignupUrl) {
        await window.electronAPI.openSignupUrl('signup');
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
      if (!noteCaptureActive || !noteBodyInput || target !== 'notes') {
        return;
      }
      const add = (text || '').trim();
      if (!add) {
        toggleRecordingVisuals(false);
        return;
      }
      const existing = noteBodyInput.value.trim();
      noteBodyInput.value = existing ? `${existing}\n${add}` : add;
      showToast('Texte reçu.');
      toggleRecordingVisuals(false);
    });
  }

  if (window.electronAPI?.onDashboardTranscriptionError) {
    window.electronAPI.onDashboardTranscriptionError((error) => {
      if (!noteCaptureActive) {
        return;
      }
      showToast(error?.message || 'La dictée a échoué.', 'error');
      toggleRecordingVisuals(false);
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

  refreshDashboard();
});
