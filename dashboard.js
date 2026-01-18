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
const noteFormStatus = document.getElementById('noteFormStatus');
const searchInput = document.getElementById('dashboardSearchInput');
const authOverlay = document.getElementById('authOverlay');
const authOverlayStatus = document.getElementById('authOverlayStatus');
const authOverlayLogin = document.getElementById('authOverlayLogin');
const authOverlayRetry = document.getElementById('authOverlayRetry');
const authOverlaySignup = document.getElementById('authOverlaySignup');

const statDays = document.getElementById('statDays');
const statWords = document.getElementById('statWords');
const statTotal = document.getElementById('statTotal');

let currentSettings = {};
let dashboardData = null;
let currentView = 'home';
let searchTerm = '';
let historyData = [];
let notesData = [];
let noteCaptureActive = false;
let modalResolver = null;
const STYLE_PRESETS = ['Default', 'Casual', 'Formel'];

function openModal({ title, fields, confirmText }) {
  if (!modalBackdrop || !modalBody || !modalTitle || !modalCancel || !modalConfirm) {
    return Promise.resolve(null);
  }
  modalTitle.textContent = title;
  modalConfirm.textContent = confirmText || 'Save';
  modalBody.innerHTML = '';
  const inputs = {};

  fields.forEach((field, index) => {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = field.label;
    const input = field.multiline ? document.createElement('textarea') : document.createElement('input');
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

  modalBackdrop.classList.add('active');
  modalBackdrop.setAttribute('aria-hidden', 'false');

  return new Promise((resolve) => {
    modalResolver = resolve;

    modalCancel.onclick = () => {
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      modalResolver = null;
      resolve(null);
    };

    modalConfirm.onclick = () => {
      const values = {};
      Object.keys(inputs).forEach((key) => {
        values[key] = inputs[key].value.trim();
      });
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      modalResolver = null;
      resolve(values);
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

function renderStats(stats) {
  if (!stats) {
    return;
  }
  statDays.textContent = `${stats.daysActive} days`;
  statWords.textContent = `${stats.words} words`;
  statTotal.textContent = `${stats.total} notes`;
}

function formatDateLabel(value) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function filterEntries(entries, query) {
  if (!query) {
    return entries || [];
  }
  const lower = query.toLowerCase();
  return (entries || []).filter((entry) => {
    const haystack = [
      entry.title,
      entry.text,
      entry.raw_text,
    ].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(lower);
  });
}

function buildEntryRow(entry, type) {
  const row = document.createElement('div');
  row.className = 'list-row';

  const icon = document.createElement('div');
  icon.className = 'file-icon';
  icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';

  const main = document.createElement('div');
  main.className = 'row-main';
  const dateLabel = document.createElement('div');
  dateLabel.className = 'row-date';
  const timePart = entry.created_at ? formatTime(entry.created_at) : '';
  const datePart = formatDateLabel(entry.created_at);
  dateLabel.textContent = [timePart, datePart].filter(Boolean).join(' · ');
  const title = document.createElement('div');
  title.className = 'row-title';
  title.textContent = entry.title || entry.text?.split(/\r?\n/)[0] || 'Untitled entry';
  const preview = document.createElement('div');
  preview.className = 'row-preview';
  preview.textContent = entry.text || entry.raw_text || '';
  main.appendChild(dateLabel);
  main.appendChild(title);
  main.appendChild(preview);

  const actions = document.createElement('div');
  actions.className = 'row-actions';
  const copyBtn = document.createElement('button');
  copyBtn.className = 'action-btn copy';
  copyBtn.type = 'button';
  copyBtn.textContent = 'Copy';
  copyBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const textToCopy = entry.text || entry.raw_text || '';
    if (!textToCopy) {
      return;
    }
    try {
      if (!navigator.clipboard) {
        return;
      }
      await navigator.clipboard.writeText(textToCopy);
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Copied';
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1200);
    } catch (error) {
      console.error('Clipboard failed', error);
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'action-btn delete';
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Delete';
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
    historyEmpty.textContent = searchTerm
      ? 'Aucune correspondance trouvee.'
      : 'Aucun historique disponible pour le moment.';
    historyEmpty.style.display = 'block';
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
    notesEmpty.textContent = searchTerm
      ? 'Aucune correspondance trouvee.'
      : 'Aucune note créée pour le moment.';
    notesEmpty.style.display = 'block';
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
  } else {
    renderHistoryList();
  }
}

function setNoteStatus(message, isError = false) {
  if (!noteFormStatus) {
    return;
  }
  noteFormStatus.textContent = message;
  noteFormStatus.style.color = isError ? '#EF4444' : '#059669';
}

async function handleNoteDictation() {
  if (!noteBodyInput) {
    return;
  }
  noteCaptureActive = true;
  setNoteStatus('Enregistrement vocal activé…');
  noteBodyInput.focus();
  if (window.electronAPI?.setRecordingTarget) {
    try {
      await window.electronAPI.setRecordingTarget('notes');
    } catch (error) {
      console.warn('Failed to set recording target:', error);
    }
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
    setNoteStatus('Complète le contenu.', true);
    return;
  }
  const payload = {
    text: content,
    metadata: { source: 'manual' },
  };
  const providedTitle = noteTitleInput?.value.trim();
  if (providedTitle) {
    payload.title = providedTitle;
  }
  setNoteStatus('Création en cours…');
  if (createNoteButton) {
    createNoteButton.disabled = true;
  }
  try {
    if (!window.electronAPI?.addNote) {
      throw new Error('Fonctionnalité non disponible.');
    }
    await window.electronAPI.addNote(payload);
    if (noteTitleInput) {
      noteTitleInput.value = '';
    }
    noteBodyInput.value = '';
    setNoteStatus('Note enregistrée.');
    await refreshDashboard();
  } catch (error) {
    console.error('Note creation failed', error);
    setNoteStatus(error?.message || 'Échec de la création.', true);
  } finally {
    if (createNoteButton) {
      createNoteButton.disabled = false;
    }
    setTimeout(() => {
      if (noteFormStatus && noteFormStatus.textContent?.includes('Note')) {
        noteFormStatus.textContent = '';
      }
    }, 2400);
  }
}

function renderDictionary(dictionary) {
  if (!dictionaryList) {
    return;
  }
  dictionaryList.innerHTML = '';
  if (!dictionary || dictionary.length === 0) {
    dictionaryEmpty.style.display = 'block';
    return;
  }
  dictionaryEmpty.style.display = 'none';
  dictionary.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'dictionary-item';
    const textWrap = document.createElement('div');
    textWrap.className = 'dictionary-term';
    const fromText = document.createElement('span');
    fromText.style.fontWeight = '600';
    fromText.textContent = entry.from_text;
    if (!entry.to_text || entry.to_text === entry.from_text) {
      textWrap.appendChild(fromText);
    } else {
      const arrow = document.createElement('span');
      arrow.className = 'dictionary-arrow';
      arrow.textContent = '→';
      const toText = document.createElement('span');
      toText.textContent = entry.to_text;
      textWrap.appendChild(fromText);
      textWrap.appendChild(arrow);
      textWrap.appendChild(toText);
    }

    const actions = document.createElement('div');
    actions.className = 'dictionary-actions';
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.dataset.action = 'edit';
    editBtn.dataset.id = entry.id;
    editBtn.textContent = 'Edit';
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.dataset.id = entry.id;
    deleteBtn.textContent = 'Delete';
    editBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const result = await openModal({
        title: 'Edit dictionary entry',
        confirmText: 'Save',
        fields: [
          { key: 'from_text', label: 'Replace (from)', value: entry.from_text },
          { key: 'to_text', label: 'Replace with (to)', value: entry.to_text },
        ],
      });
      if (!result || !result.from_text || !result.to_text) {
        return;
      }
      await window.electronAPI.upsertDictionary({
        id: entry.id,
        from_text: result.from_text,
        to_text: result.to_text,
        created_at: entry.created_at,
      });
      await refreshDashboard();
    });
    deleteBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await window.electronAPI.deleteDictionary(entry.id);
      await refreshDashboard();
    });
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(textWrap);
    item.appendChild(actions);
    dictionaryList.appendChild(item);
  });
}

function renderStyles(styles) {
  if (!styleList) {
    return;
  }
  styleList.innerHTML = '';
  const filtered = (styles || []).filter((style) => STYLE_PRESETS.includes(style.name));
  const ordered = STYLE_PRESETS.map((name) => filtered.find((style) => style.name === name)).filter(Boolean);
  if (!ordered || ordered.length === 0) {
    styleEmpty.style.display = 'block';
    return;
  }
  styleEmpty.style.display = 'none';
  ordered.forEach((style) => {
    const card = document.createElement('div');
    card.className = 'style-card';
    const title = document.createElement('h3');
    title.textContent = style.name;
    if (style.id === currentSettings.activeStyleId) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = 'Active';
      title.appendChild(tag);
    }

    const promptEl = document.createElement('p');
    promptEl.className = 'muted';
    promptEl.textContent = style.prompt;

    const useBtn = document.createElement('button');
    useBtn.type = 'button';
    useBtn.dataset.action = 'activate';
    useBtn.dataset.id = style.id;
    useBtn.textContent = 'Use';
    useBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await window.electronAPI.activateStyle(style.id);
      await refreshDashboard();
    });

    card.appendChild(title);
    card.appendChild(promptEl);
    card.appendChild(useBtn);
    styleList.appendChild(card);
  });
}

function renderSettings(settings) {
  settingsInputs.forEach((input) => {
    const key = input.dataset.setting;
    if (key && typeof settings[key] !== 'undefined') {
      if (input.tagName.toLowerCase() === 'select' && key === 'postProcessEnabled') {
        input.value = settings[key] ? 'true' : 'false';
      } else {
        input.value = settings[key];
      }
    }
  });
  if (apiKeyStatus) {
    apiKeyStatus.textContent = settings.apiKeyPresent
      ? 'API OpenAI: configuree'
      : 'API OpenAI: manquante (OPENAI_API_KEY)';
  }
}

function renderAuth(auth, syncReady) {
  if (!authPanel) {
    return;
  }
  authPanel.innerHTML = '';
  const syncNowButton = document.getElementById('syncNowButton');
  if (!syncReady) {
    authPanel.innerHTML = '<p class="muted">Supabase non configure.</p>';
    if (syncNowButton) {
      syncNowButton.disabled = true;
    }
    return;
  }
  if (auth) {
    if (syncNowButton) {
      syncNowButton.disabled = false;
    }
    authPanel.innerHTML = `
      <div class="form-row">
        <strong>${auth.email}</strong>
        <div class="auth-actions">
          <button class="ghost-button" id="signOutButton" type="button">Sign out</button>
        </div>
      </div>
    `;
    const signOutButton = document.getElementById('signOutButton');
    signOutButton.addEventListener('click', async () => {
      await window.electronAPI.authSignOut();
      await refreshDashboard();
    });
    return;
  }

  if (syncNowButton) {
    syncNowButton.disabled = true;
  }
  authPanel.innerHTML = `
    <div class="form-row">
      <button class="ghost-button" id="authLoginButton" type="button">Se connecter</button>
      <button class="ghost-button" id="authSignupButton" type="button">S'inscrire</button>
    </div>
  `;
  const authLoginButton = document.getElementById('authLoginButton');
  const authSignupButton = document.getElementById('authSignupButton');
  if (authLoginButton) {
    authLoginButton.addEventListener('click', async () => {
      if (!window.electronAPI?.openSignupUrl) {
        return;
      }
      await window.electronAPI.openSignupUrl('login');
    });
  }
  if (authSignupButton) {
    authSignupButton.addEventListener('click', async () => {
      if (!window.electronAPI?.openSignupUrl) {
        return;
      }
      await window.electronAPI.openSignupUrl('signup');
    });
  }
}

let currentAuthState = null;

function setOverlayStatus(message, isError) {
  if (!authOverlayStatus) {
    return;
  }
  authOverlayStatus.textContent = message || '';
  authOverlayStatus.style.color = isError ? '#DC2626' : '#64748B';
}

function applyAuthState(state) {
  currentAuthState = state || {};
  const status = currentAuthState.status || 'checking';
  const authed = status === 'authenticated';
  document.body.classList.toggle('auth-locked', !authed);
  if (authOverlay) {
    authOverlay.setAttribute('aria-hidden', authed ? 'true' : 'false');
  }

  if (status === 'checking') {
    setOverlayStatus(currentAuthState.message || 'Verification de session...', false);
  } else if (status === 'error') {
    setOverlayStatus(currentAuthState.message || 'Connexion indisponible.', true);
  } else if (status === 'not_configured') {
    setOverlayStatus(currentAuthState.message || 'Supabase non configure.', true);
  } else if (status === 'unauthenticated') {
    setOverlayStatus(currentAuthState.message || 'Connexion requise.', false);
  } else {
    setOverlayStatus('');
  }

  const disableForm = status === 'checking' || status === 'not_configured';
  if (authOverlayLogin) {
    authOverlayLogin.disabled = disableForm;
  }
  if (authOverlaySignup) {
    authOverlaySignup.disabled = disableForm;
    authOverlaySignup.style.display = status === 'unauthenticated' ? 'inline-flex' : 'none';
  }
  if (authOverlayRetry) {
    authOverlayRetry.disabled = status === 'checking' || status === 'not_configured';
    authOverlayRetry.style.display = currentAuthState.retryable ? 'inline-flex' : 'none';
  }
}

async function populateMicrophones() {
  if (!microphoneSelect || !navigator.mediaDevices?.enumerateDevices) {
    return;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const mics = devices.filter((device) => device.kind === 'audioinput');
    microphoneSelect.innerHTML = '';
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'Default microphone';
    microphoneSelect.appendChild(emptyOption);
    mics.forEach((mic) => {
      const option = document.createElement('option');
      option.value = mic.deviceId;
      option.textContent = mic.label || `Microphone ${mic.deviceId.slice(0, 6)}`;
      microphoneSelect.appendChild(option);
    });
    if (currentSettings.microphoneId) {
      microphoneSelect.value = currentSettings.microphoneId;
    }
  } catch (error) {
    console.error('Failed to list microphones:', error);
  }
}

function normalizeSettingsValue(setting, value) {
  if (setting === 'postProcessEnabled') {
    return value === 'true';
  }
  return value;
}

function handleSettingChange(event) {
  const { setting } = event.target.dataset;
  if (!setting) {
    return;
  }

  const value = normalizeSettingsValue(setting, event.target.value);
  const nextSettings = { ...currentSettings, [setting]: value };

  if (!window.electronAPI || !window.electronAPI.saveSettings) {
    currentSettings = nextSettings;
    return;
  }

  window.electronAPI.saveSettings(nextSettings).then((saved) => {
    currentSettings = saved;
  }).catch((error) => {
    console.error('Failed to save settings:', error);
  });
}

async function refreshDashboard() {
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

document.addEventListener('DOMContentLoaded', async () => {
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

  if (authOverlayLogin) {
    authOverlayLogin.addEventListener('click', async () => {
      if (!window.electronAPI?.openSignupUrl) {
        return;
      }
      await window.electronAPI.openSignupUrl('login');
    });
  }
  if (authOverlaySignup) {
    authOverlaySignup.addEventListener('click', async () => {
      if (!window.electronAPI?.openSignupUrl) {
        return;
      }
      await window.electronAPI.openSignupUrl('signup');
    });
  }

  if (authOverlayRetry) {
    authOverlayRetry.addEventListener('click', async () => {
      if (!window.electronAPI?.authRetry) {
        return;
      }
      setOverlayStatus('Nouvelle tentative...', false);
      try {
        await window.electronAPI.authRetry();
      } catch (error) {
        setOverlayStatus(error?.message || 'Retry indisponible.', true);
      }
    });
  }


  if (captureNoteButton) {
    captureNoteButton.addEventListener('click', () => {
      handleNoteDictation();
    });
  }

  if (window.electronAPI?.onDashboardTranscription) {
    window.electronAPI.onDashboardTranscription((text, target) => {
      if (!noteCaptureActive || !noteBodyInput || target !== 'notes') {
        return;
      }
      const addition = (text || '').trim();
      if (!addition) {
        noteCaptureActive = false;
        return;
      }
      const existing = noteBodyInput.value.trim();
      noteBodyInput.value = existing ? `${existing}\n${addition}` : addition;
      noteBodyInput.focus();
      setNoteStatus('Transcription intégrée.');
      noteCaptureActive = false;
    });
  }

  if (window.electronAPI?.onDashboardTranscriptionError) {
    window.electronAPI.onDashboardTranscriptionError((error) => {
      if (!noteCaptureActive) {
        return;
      }
      setNoteStatus(error?.message || 'La dictée a échoué.', true);
      noteCaptureActive = false;
    });
  }

  if (createNoteButton) {
    createNoteButton.addEventListener('click', () => {
      handleCreateNote();
    });
  }

  const windowControls = document.querySelectorAll('.window-control, .win-control');
  windowControls.forEach((control) => {
    control.addEventListener('click', () => {
      let action = control.dataset.windowControl || control.dataset.action;
      if (!action) {
        const label = (control.getAttribute('title') || '').toLowerCase();
        if (label.includes('min')) {
          action = 'minimize';
        } else if (label.includes('max')) {
          action = 'maximize';
        } else if (label.includes('close')) {
          action = 'close';
        }
      }
      if (!action || !window.electronAPI?.sendWindowControl) {
        return;
      }
      window.electronAPI.sendWindowControl(action);
    });
  });

  settingsInputs.forEach((input) => {
    input.addEventListener('change', handleSettingChange);
  });

  if (window.electronAPI.onShortcutUpdated) {
    window.electronAPI.onShortcutUpdated((shortcut) => {
      const shortcutInput = document.querySelector('[data-setting="shortcut"]');
      if (shortcutInput) {
        shortcutInput.value = shortcut;
      }
    });
  }

  if (window.electronAPI.onSettingsUpdated) {
    window.electronAPI.onSettingsUpdated((settings) => {
      currentSettings = settings || {};
      renderSettings(currentSettings);
      populateMicrophones();
    });
  }

  if (window.electronAPI.onDashboardView) {
    window.electronAPI.onDashboardView((viewName) => {
      setActiveView(viewName);
    });
  }

  if (window.electronAPI.onDashboardDataUpdated) {
    window.electronAPI.onDashboardDataUpdated(() => {
      refreshDashboard().catch((error) => {
        console.error('Failed to refresh dashboard:', error);
      });
    });
  }

  await refreshDashboard();

  if (misspellingToggle) {
    misspellingToggle.addEventListener('click', () => {
      const active = misspellingToggle.classList.toggle('active');
      misspellingToggle.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (dictionaryCorrectionInput) {
        dictionaryCorrectionInput.style.display = active ? 'block' : 'none';
        dictionaryCorrectionInput.value = '';
      }
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
      if (misspellingToggle && misspellingToggle.classList.contains('active')) {
        misspellingToggle.classList.remove('active');
        misspellingToggle.setAttribute('aria-pressed', 'false');
        if (dictionaryCorrectionInput) {
          dictionaryCorrectionInput.style.display = 'none';
        }
      }
    });
  }

  if (dictionaryAddButton) {
    dictionaryAddButton.addEventListener('click', async () => {
      if (!dictionaryWordInput) {
        return;
      }
      const word = dictionaryWordInput.value.trim();
      if (!word) {
        return;
      }
      const correcting = misspellingToggle && misspellingToggle.classList.contains('active');
      const correction = dictionaryCorrectionInput ? dictionaryCorrectionInput.value.trim() : '';
      if (correcting && !correction) {
        return;
      }
      await window.electronAPI.upsertDictionary({
        from_text: word,
        to_text: correcting ? correction : word,
      });
      dictionaryCancelButton.click();
      await refreshDashboard();
    });
  }

  if (dictionaryWordInput) {
    dictionaryWordInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        dictionaryAddButton?.click();
      }
    });
  }

  if (dictionaryCorrectionInput) {
    dictionaryCorrectionInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        dictionaryAddButton?.click();
      }
    });
  }

  const syncNowButton = document.getElementById('syncNowButton');
  if (syncNowButton) {
    syncNowButton.addEventListener('click', async () => {
      try {
        await window.electronAPI.syncNow();
        await refreshDashboard();
      } catch (error) {
        window.alert(error.message || 'Sync failed');
      }
    });
  }
});
