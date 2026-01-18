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
const shortcutInput = document.getElementById('shortcutInput');
const shortcutResetButton = document.getElementById('shortcutResetButton');
const shortcutHelp = document.getElementById('shortcutHelp');

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

function setActiveView(viewName) {
  views.forEach((view) => {
    view.classList.toggle('active', view.id === `view-${viewName}`);
  });

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  currentView = viewName;
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
    actions.className = 'dictionary-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
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
    deleteBtn.textContent = 'Supprimer';
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

  const syncBtn = document.getElementById('syncNowButton');
  if (!syncReady) {
    authPanel.innerHTML = '<span style="color:#EF4444;font-weight:600;">Erreur de configuration serveur.</span>';
    if (syncBtn) {
      syncBtn.disabled = true;
    }
    return;
  }

  if (auth) {
    if (syncBtn) {
      syncBtn.disabled = false;
    }
    authPanel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;background:#F8FAFC;padding:12px 14px;border-radius:14px;border:1px solid #F1F5F9;">
        <span style="font-weight:700;color:#1F2937;">${auth.email}</span>
        <button id="signOutButton" type="button" style="font-size:12px;font-weight:700;color:#EF4444;background:transparent;border:none;cursor:pointer;">Déconnexion</button>
      </div>
    `;
    document.getElementById('signOutButton')?.addEventListener('click', async () => {
      await window.electronAPI.authSignOut();
      await refreshDashboard();
    });
    return;
  }

  if (syncBtn) {
    syncBtn.disabled = true;
  }
  authPanel.innerHTML = `
    <div style="display:flex;gap:10px;">
      <button id="authLoginButton" type="button" style="flex:1;padding:10px;border-radius:12px;border:1px solid #E2E8F0;background:#FFFFFF;font-weight:600;color:#64748B;">Se connecter</button>
      <button id="authSignupButton" type="button" style="flex:1;padding:10px;border-radius:12px;border:none;background:#059669;color:#FFFFFF;font-weight:600;">Créer compte</button>
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
  dashboardData = await window.electronAPI.getDashboardData();
  currentSettings = dashboardData.settings || {};

  renderStats(dashboardData.stats);
  historyData = dashboardData.history || [];
  notesData = dashboardData.notes || [];
  refreshActiveList();
  renderDictionary(dashboardData.dictionary);
  renderStyles(dashboardData.styles);
  renderSettings(currentSettings);
  renderAuth(dashboardData.auth, dashboardData.syncReady);
  await populateMicrophones();
}

window.addEventListener('DOMContentLoaded', () => {
  platform = window.electronAPI?.getPlatform ? window.electronAPI.getPlatform() : 'win32';

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

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchTerm = event.target.value.trim();
      refreshActiveList();
    });
  }

  if (captureNoteButton) {
    captureNoteButton.addEventListener('click', handleNoteDictation);
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
