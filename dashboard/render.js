// Renderers
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
    if (!text) {
      return;
    }
    if (!navigator.clipboard) {
      showToast('Copie indisponible.', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast('Texte copié.');
    } catch (error) {
      showToast(error?.message || 'Impossible de copier.', 'error');
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
    try {
      await method(entry.id);
      showToast(type === 'notes' ? 'Note supprimée.' : 'Entrée supprimée.');
      await refreshDashboard();
    } catch (error) {
      showToast(error?.message || 'Suppression impossible.', 'error');
    }
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
        try {
          await window.electronAPI.upsertDictionary({
            id: entry.id,
            from_text: res.from_text,
            to_text: res.to_text,
            created_at: entry.created_at,
          });
          showToast('Terme mis à jour.');
          await refreshDashboard();
        } catch (error) {
          showToast(error?.message || 'Mise à jour impossible.', 'error');
        }
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
      try {
        await window.electronAPI.deleteDictionary(entry.id);
        showToast('Terme supprimé.');
        await refreshDashboard();
      } catch (error) {
        showToast(error?.message || 'Suppression impossible.', 'error');
      }
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
        try {
          await window.electronAPI.activateStyle(style.id);
          showToast(`Style "${style.name}" activé.`);
          await refreshDashboard();
        } catch (error) {
          showToast(error?.message || 'Activation impossible.', 'error');
        }
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
  const authed = status === 'authenticated' || status === 'not_configured';

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
