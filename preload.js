const { contextBridge, ipcRenderer } = require('electron');

const listenerRegistry = new Map();

function registerListener(channel, handler) {
  const existing = listenerRegistry.get(channel);
  if (existing) {
    ipcRenderer.removeListener(channel, existing);
  }
  ipcRenderer.on(channel, handler);
  listenerRegistry.set(channel, handler);
  return () => {
    const current = listenerRegistry.get(channel);
    ipcRenderer.removeListener(channel, handler);
    if (current === handler) {
      listenerRegistry.delete(channel);
    }
  };
}

/**
 * Expose safe APIs to the renderer process for IPC
 */
contextBridge.exposeInMainWorld('electronAPI', {
  onStartRecording: (callback) => {
    return registerListener('start-recording', callback);
  },

  onStopRecording: (callback) => {
    return registerListener('stop-recording', callback);
  },

  sendAudioData: (audioBuffer) => {
    ipcRenderer.send('audio-data', audioBuffer);
  },
  sendAudioReady: (audioBuffer) => {
    ipcRenderer.send('audio-ready', audioBuffer);
  },

  onTranscriptionSuccess: (callback) => {
    return registerListener('transcription-success', (event, text) => callback(text));
  },

  onTranscriptionError: (callback) => {
    return registerListener('transcription-error', (event, error) => callback(error));
  },

  sendRecordingError: (error) => {
    ipcRenderer.send('recording-error', error);
  },
  sendRecordingEmpty: (reason) => {
    ipcRenderer.send('recording-empty', reason);
  },

  onStatusChange: (callback) => {
    return registerListener('status-change', (event, status, message) => callback(status, message));
  },

  toggleRecording: () => {
    ipcRenderer.send('toggle-recording');
  },

  cancelRecording: () => {
    ipcRenderer.send('cancel-recording');
  },

  setWidgetExpanded: (expanded) => {
    ipcRenderer.send('widget-expanded', expanded);
  },
  setWidgetUndoVisible: (visible) => {
    ipcRenderer.send('widget-undo-visibility', visible);
  },
  setWidgetErrorVisible: (visible) => {
    ipcRenderer.send('widget-error-visibility', visible);
  },
  setRecordingTarget: (target) => ipcRenderer.invoke('recording:set-target', target),

  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  openSettings: () => ipcRenderer.invoke('app:open-settings'),
  openPrivacyMicrophone: () => ipcRenderer.invoke('app:open-privacy-mic'),
  getDashboardData: () => ipcRenderer.invoke('dashboard:data'),
  upsertDictionary: (entry) => ipcRenderer.invoke('dictionary:upsert', entry),
  deleteDictionary: (id) => ipcRenderer.invoke('dictionary:delete', id),
  upsertStyle: (entry) => ipcRenderer.invoke('styles:upsert', entry),
  deleteStyle: (id) => ipcRenderer.invoke('styles:delete', id),
  activateStyle: (id) => ipcRenderer.invoke('styles:activate', id),
  deleteHistory: (id) => ipcRenderer.invoke('history:delete', id),
  deleteNote: (id) => ipcRenderer.invoke('notes:delete', id),
  listNotes: () => ipcRenderer.invoke('notes:list'),
  addNote: (entry) => ipcRenderer.invoke('notes:add', entry),
  upsertNote: (entry) => ipcRenderer.invoke('notes:upsert', entry),
  listHistory: (limit) => ipcRenderer.invoke('history:list', limit),
  clearHistory: () => ipcRenderer.invoke('history:clear'),
  authStatus: () => ipcRenderer.invoke('auth:status'),
  authSignIn: (email, password) => ipcRenderer.invoke('auth:sign-in', email, password),
  authSignUp: (email, password) => ipcRenderer.invoke('auth:sign-up', email, password),
  authSignOut: () => ipcRenderer.invoke('auth:sign-out'),
  getAuthState: () => ipcRenderer.invoke('auth:get-state'),
  authRetry: () => ipcRenderer.invoke('auth:retry'),
  getAuthConfig: () => ipcRenderer.invoke('auth:get-config'),
  getSignupUrl: () => ipcRenderer.invoke('auth:get-signup-url'),
  openSignupUrl: (mode) => ipcRenderer.invoke('auth:open-signup-url', mode),
  syncNow: () => ipcRenderer.invoke('sync:now'),
  startCheckout: () => ipcRenderer.invoke('subscription:checkout'),
  openSubscriptionPortal: () => ipcRenderer.invoke('subscription:portal'),
  refreshSubscription: () => ipcRenderer.invoke('subscription:refresh'),
  pasteLatestTranscription: () => ipcRenderer.send('history:paste-latest'),
  hideWidgetOneHour: () => ipcRenderer.send('widget:hide-1h'),
  openDashboardView: (viewName) => ipcRenderer.send('dashboard:open-view', viewName),
  sendWindowControl: (action) => ipcRenderer.send('dashboard:window-control', action),
  getPlatform: () => process.platform,
  onTrayMenuOpen: (callback) => {
    return registerListener('tray-menu:open', (event, payload) => callback(payload));
  },
  onTrayMenuData: (callback) => {
    return registerListener('tray-menu:data', (event, payload) => callback(payload));
  },
  sendTrayMenuAction: (action) => ipcRenderer.send('tray-menu:action', action),
  closeTrayMenu: () => ipcRenderer.send('tray-menu:close'),

  onShortcutUpdated: (callback) => {
    return registerListener('shortcut-updated', (event, shortcut) => callback(shortcut));
  },
  onSettingsUpdated: (callback) => {
    return registerListener('settings-updated', (event, nextSettings) => callback(nextSettings));
  },
  onDashboardView: (callback) => {
    return registerListener('dashboard:set-view', (event, viewName) => callback(viewName));
  },

  onDashboardDataUpdated: (callback) => {
    return registerListener('dashboard:data-updated', () => callback());
  },
  onDashboardTranscription: (callback) => {
    return registerListener('dashboard:transcription-success', (event, text, target) => callback(text, target));
  },
  onDashboardTranscriptionError: (callback) => {
    return registerListener('dashboard:transcription-error', (event, message) => callback(message));
  },
  onAuthState: (callback) => {
    return registerListener('auth:state', (event, state) => callback(state));
  },
  onAuthRequired: (callback) => {
    return registerListener('auth:required', (event, message) => callback(message));
  },
  onQuotaBlocked: (callback) => {
    return registerListener('quota:blocked', (event, payload) => callback(payload));
  },
  startOnboardingMic: () => ipcRenderer.invoke('onboarding:mic-start'),
  stopOnboardingMic: () => ipcRenderer.invoke('onboarding:mic-stop'),
  runOnboardingDeliveryCheck: (sampleText) => ipcRenderer.invoke('onboarding:delivery-check', sampleText),
  onOnboardingMicLevel: (callback) => {
    return registerListener('onboarding:mic-level', (event, payload) => callback(payload));
  },
  onOnboardingMicError: (callback) => {
    return registerListener('onboarding:mic-error', (event, message) => callback(message));
  },
  onMicMonitorStart: (callback) => {
    return registerListener('mic-monitor:start', callback);
  },
  onMicMonitorStop: (callback) => {
    return registerListener('mic-monitor:stop', callback);
  },
  sendMicMonitorLevel: (payload) => {
    ipcRenderer.send('mic-monitor:level', payload);
  },
  sendMicMonitorError: (message) => {
    ipcRenderer.send('mic-monitor:error', message);
  },
});
