const { contextBridge, ipcRenderer } = require('electron');

/**
 * Expose safe APIs to the renderer process for IPC
 */
contextBridge.exposeInMainWorld('electronAPI', {
  onStartRecording: (callback) => {
    ipcRenderer.on('start-recording', callback);
  },

  onStopRecording: (callback) => {
    ipcRenderer.on('stop-recording', callback);
  },

  sendAudioData: (audioBuffer) => {
    ipcRenderer.send('audio-data', audioBuffer);
  },
  sendAudioReady: (audioBuffer) => {
    ipcRenderer.send('audio-ready', audioBuffer);
  },

  onTranscriptionSuccess: (callback) => {
    ipcRenderer.on('transcription-success', (event, text) => callback(text));
  },

  onTranscriptionError: (callback) => {
    ipcRenderer.on('transcription-error', (event, error) => callback(error));
  },

  sendRecordingError: (error) => {
    ipcRenderer.send('recording-error', error);
  },
  sendRecordingEmpty: (reason) => {
    ipcRenderer.send('recording-empty', reason);
  },

  onStatusChange: (callback) => {
    ipcRenderer.on('status-change', (event, status, message) => callback(status, message));
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
  setRecordingTarget: (target) => ipcRenderer.invoke('recording:set-target', target),

  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  openSettings: () => ipcRenderer.invoke('app:open-settings'),
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
  pasteLatestTranscription: () => ipcRenderer.send('history:paste-latest'),
  hideWidgetOneHour: () => ipcRenderer.send('widget:hide-1h'),
  openDashboardView: (viewName) => ipcRenderer.send('dashboard:open-view', viewName),
  sendWindowControl: (action) => ipcRenderer.send('dashboard:window-control', action),
  getPlatform: () => process.platform,

  onShortcutUpdated: (callback) => {
    ipcRenderer.on('shortcut-updated', (event, shortcut) => callback(shortcut));
  },
  onSettingsUpdated: (callback) => {
    ipcRenderer.on('settings-updated', (event, nextSettings) => callback(nextSettings));
  },
  onDashboardView: (callback) => {
    ipcRenderer.on('dashboard:set-view', (event, viewName) => callback(viewName));
  },

  onDashboardDataUpdated: (callback) => {
    ipcRenderer.on('dashboard:data-updated', () => callback());
  },
  onDashboardTranscription: (callback) => {
    ipcRenderer.on('dashboard:transcription-success', (event, text, target) => callback(text, target));
  },
  onDashboardTranscriptionError: (callback) => {
    ipcRenderer.on('dashboard:transcription-error', (event, message) => callback(message));
  },
  onAuthState: (callback) => {
    ipcRenderer.on('auth:state', (event, state) => callback(state));
  },
  onAuthRequired: (callback) => {
    ipcRenderer.on('auth:required', (event, message) => callback(message));
  },
});
