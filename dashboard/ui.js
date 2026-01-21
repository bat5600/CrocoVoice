// UI helpers and modal/toast
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
