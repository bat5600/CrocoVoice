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
          await window.electronAPI.openSignupUrl('login');
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
      if (!window.electronAPI?.upsertDictionary) {
        showToast('Action indisponible.', 'error');
        return;
      }
      try {
        await window.electronAPI.upsertDictionary({ from_text: word, to_text: correction });
        showToast(`"${word}" ajouté au dictionnaire.`);
        if (dictionaryWordInput) {
          dictionaryWordInput.value = '';
        }
        if (dictionaryCorrectionInput) {
          dictionaryCorrectionInput.value = '';
        }
        await refreshDashboard();
      } catch (error) {
        showToast(error?.message || 'Impossible d’ajouter le terme.', 'error');
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

  if (resetOnboardingButton) {
    resetOnboardingButton.addEventListener('click', async () => {
      await resetOnboardingAndShow();
    });
  }

  if (onboardingClose) {
    onboardingClose.addEventListener('click', async () => {
      await persistOnboardingPatch({ step: onboardingStep });
      setOnboardingVisible(false);
    });
  }
  if (onboardingSecondary) {
    onboardingSecondary.addEventListener('click', async () => {
      if (onboardingStep === 'done') {
        setActiveView('settings');
        await persistOnboardingPatch({ step: onboardingStep });
        setOnboardingVisible(false);
        return;
      }
      if (onboardingStep === 'delivery') {
        const text = onboardingDeliveryTestText || 'CrocoVoice — test de collage';
        const result = await window.electronAPI?.copyOnboardingText?.({ text });
        if (result?.ok) {
          showToast('Texte copié.');
        } else {
          showToast('Impossible de copier.', 'error');
        }
        return;
      }
      await persistOnboardingPatch({ step: onboardingStep });
      setOnboardingVisible(false);
    });
  }
  if (onboardingPrimary) {
    onboardingPrimary.addEventListener('click', async () => {
      if (onboardingInFlight) {
        return;
      }
      if (onboardingStep === 'welcome') {
        await setOnboardingStep('microphone');
        return;
      }
      if (onboardingStep === 'microphone') {
        if (onboardingState?.micOk) {
          await setOnboardingStep('delivery');
        }
        return;
      }
      if (onboardingStep === 'delivery') {
        if (onboardingState?.deliveryOk) {
          await setOnboardingStep('done');
        } else {
          await runOnboardingDeliveryTest();
        }
        return;
      }
      await completeOnboarding();
    });
  }

  if (onboardingMicStart) {
    onboardingMicStart.addEventListener('click', async () => {
      await startOnboardingMicCapture();
    });
  }
  if (onboardingMicStop) {
    onboardingMicStop.addEventListener('click', async () => {
      await stopOnboardingMicCapture();
    });
  }

  if (onboardingMicSelect) {
    onboardingMicSelect.addEventListener('change', async (event) => {
      const value = event.target.value || '';
      currentSettings = { ...currentSettings, microphoneId: value };
      if (window.electronAPI?.saveSettings) {
        try {
          await window.electronAPI.saveSettings(sanitizeSettingsForSave(currentSettings));
          showToast('Microphone mis à jour.');
        } catch {
          showToast('Impossible de sauvegarder le micro.', 'error');
        }
      }
    });
  }

  refreshDashboard();
});
