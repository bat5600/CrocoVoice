require('dotenv').config();
const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, nativeImage, screen, clipboard, shell, dialog, Notification } = require('electron');
const { execFile } = require('child_process');

app.disableHardwareAcceleration();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const os = require('os');
const { OpenAI } = require('openai');
const Store = require('./store');
const SyncService = require('./sync');
let WebSocketClient = null;
try {
  WebSocketClient = require('ws');
} catch (error) {
  console.warn('[streaming] ws dependency not available:', error?.message || error);
}
const {
  countWords,
  isProSubscription,
  getHistoryRetentionDays,
  getWeekStartUTC,
  getNextWeekStartUTC,
  applyDictionaryEntries,
  recordingStateReducer,
} = Store;
let getAuthConfig = null;
try {
  ({ getAuthConfig } = require('./config/auth-config'));
} catch (error) {
  console.warn('[auth-config] missing module, using defaults:', error?.message || error);
  getAuthConfig = () => ({
    signupUrl: process.env.AUTH_SIGNUP_URL || 'https://app.supabase.com/project/your-project-id/auth/signup',
  });
}

// Keyboard input library: try nut-js first, then robotjs fallback
let keyboardLib = null;
let useRobotjs = false;
let nutKey = null;
let getActiveWindow = null;

try {
  const nutjs = require('@nut-tree-fork/nut-js');
  keyboardLib = nutjs.keyboard;
  nutKey = nutjs.Key;
  getActiveWindow = nutjs.getActiveWindow;
} catch (error) {
  console.warn('nut-js not available, trying robotjs...');
  try {
    keyboardLib = require('robotjs');
    useRobotjs = true;
  } catch (error2) {
    console.error('No keyboard library available');
  }
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const STRIPE_CHECKOUT_URL = process.env.STRIPE_CHECKOUT_URL || '';
const STRIPE_PORTAL_URL = process.env.STRIPE_PORTAL_URL || '';
const STRIPE_RETURN_URL = process.env.STRIPE_RETURN_URL || '';
let openai = null;

let mainWindow = null;
let dashboardWindow = null;
let tray = null;
let trayMenuWindow = null;
let widgetOverlayWindow = null;
let widgetOverlayMoveInterval = null;
let widgetOverlayBounds = null;
let widgetOverlayDisplayId = null;
let trayMenuOpen = false;
let widgetContextMenuOpen = false;
let trayIconDefault = null;
let trayIconHover = null;
let isRecording = false;
let recordingStartTime = null;
let currentShortcut = null;
let store = null;
let syncService = null;
let authErrorCount = 0;
let authRetryTimer = null;
let authState = {
  status: 'checking',
  message: '',
  user: null,
  syncReady: false,
  retryable: false,
};

const RecordingState = Object.freeze({
  IDLE: 'idle',
  RECORDING: 'recording',
  PROCESSING: 'processing',
  ERROR: 'error',
});

const ACTION_DEBOUNCE_MS = 500;
const parsedHistoryRetentionFree = Number.parseInt(process.env.CROCOVOICE_HISTORY_RETENTION_DAYS_FREE || '14', 10);
const HISTORY_RETENTION_DAYS_FREE = Number.isFinite(parsedHistoryRetentionFree) ? parsedHistoryRetentionFree : 14;
const STREAM_MAX_DURATION_MS = 60 * 60 * 1000;
const STREAM_MAX_CHUNK_SAMPLES = 16000 * 15;
const parsedHistoryRetentionPro = Number.parseInt(process.env.CROCOVOICE_HISTORY_RETENTION_DAYS_PRO || '365', 10);
const HISTORY_RETENTION_DAYS_PRO = Number.isFinite(parsedHistoryRetentionPro) ? parsedHistoryRetentionPro : 365;
let recordingState = RecordingState.IDLE;
let lastStatusMessage = '';
const lastActionAt = {
  start: 0,
  stop: 0,
};
let transitionLock = false;
let processingTimeoutId = null;
let idleResetTimeoutId = null;
let pendingPasteBuffer = '';
let pasteMutex = Promise.resolve();
let typingTarget = null;
let pendingSync = null;
let syncInFlight = null;
let syncDebounceTimer = null;
let syncDebounceRefresh = false;
const OPENAI_TRANSCRIBE_TIMEOUT_MS = 30000;
const OPENAI_CHAT_TIMEOUT_MS = 20000;
const OPENAI_MAX_RETRIES = 2;
const OPENAI_BASE_BACKOFF_MS = 800;
const OPENAI_MAX_BACKOFF_MS = 5000;
const SYNC_DEBOUNCE_MS = 120000;
const STREAM_START_GRACE_MS = 8000;
const STREAMING_DEPRECATED = ['1', 'true', 'yes']
  .includes(String(process.env.CROCOVOICE_STREAMING_DISABLED || '').trim().toLowerCase());
const parsedWeeklyQuota = Number.parseInt(process.env.CROCOVOICE_WEEKLY_QUOTA_WORDS || '1000', 10);
const WEEKLY_QUOTA_WORDS = Number.isFinite(parsedWeeklyQuota) ? parsedWeeklyQuota : 1000;
const QUOTA_MODE = (process.env.CROCOVOICE_QUOTA_MODE || 'local').toLowerCase(); // local | hybrid | server
const QUOTA_CACHE_TTL_MS = Number.parseInt(process.env.CROCOVOICE_QUOTA_CACHE_TTL_MS || '300000', 10); // 5 min
let recordingDestination = 'clipboard';
const WIDGET_BOTTOM_MARGIN = 2;
const WIDGET_DISPLAY_POLL_MS = 500;
const UPLOAD_AUDIO_EXTENSIONS = ['.wav', '.mp3', '.m4a', '.ogg', '.oga'];
const UPLOAD_AUDIO_EXTENSIONS_NO_DOT = UPLOAD_AUDIO_EXTENSIONS.map((ext) => ext.replace('.', ''));
const UPLOAD_AUDIO_EXTENSIONS_LABEL = UPLOAD_AUDIO_EXTENSIONS.join(', ');
const DICTIONARY_FUZZY = {
  enabled: true,
  minLength: 6,
  prefixLength: 4,
  maxDistanceRatio: 0.4,
};
const SNIPPET_FUZZY = {
  enabled: true,
  minLength: 6,
  prefixLength: 3,
  maxDistanceRatio: 0.25,
};

const NO_AUDIO_MESSAGE = 'Aucun audio capte.';

let widgetDisplayId = null;
let widgetDisplayPoll = null;

function clearIdleResetTimeout() {
  if (idleResetTimeoutId) {
    clearTimeout(idleResetTimeoutId);
    idleResetTimeoutId = null;
  }
}

function scheduleReturnToIdle(delayMs = 3000) {
  clearIdleResetTimeout();
  idleResetTimeoutId = setTimeout(() => {
    idleResetTimeoutId = null;
    if (recordingState === RecordingState.ERROR) {
      setRecordingState(RecordingState.IDLE);
    }
  }, delayMs);
}

const compactWindowSize = { width: 220, height: 52 };
const recordingWindowSize = { width: 260, height: 120 };
const undoWindowSize = { width: 420, height: 120 };
const errorWindowSize = { width: 420, height: 120 };
const expandedWindowSize = { width: 900, height: 420 };
let widgetExpanded = false;
let widgetUndoVisible = false;
let widgetErrorVisible = false;
let widgetHiddenUntil = null;
let widgetHideTimer = null;

const defaultSettings = {
  language: process.env.CROCOVOICE_LANGUAGE || 'fr',
  shortcut:
    process.env.CROCOVOICE_SHORTCUT
    || (process.platform === 'darwin' ? 'Command+Shift+R' : 'Ctrl+Shift+R'),
  microphoneId: '',
  microphoneLabel: '',
  postProcessEnabled: true,
  onboarding: {
    step: 'welcome',
    completed: false,
    firstRunSuccess: false,
    hotkeyReady: false,
    updatedAt: null,
  },
  uploadCloudFallback: false,
  uploadMaxMb: 200,
  streamChunkMs: 900,
  streamSampleRate: 16000,
  streamPartialIntervalMs: 7000,
  streamingTransport: 'local',
  streamingEndpoint: '',
  streamingAuthToken: '',
  featureFlags: {
    streaming: false,
    worklet: false,
    statusBubble: true,
    contextMenu: true,
    diagnostics: true,
    notifications: true,
    insights: true,
    crocomni: true,
    localAsr: true,
    audioEnhancement: false,
  },
  featureFlagsRemoteUrl: '',
  featureFlagsTtlMs: 300000,
  activeStyleId: '',
  metricsEnabled: true,
  telemetryOptIn: false,
  telemetryIncludeSensitive: false,
  audioDiagnosticsEnabled: true,
  context: {
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
  },
  contextProfiles: [],
  crocOmni: {
    enabled: true,
    contextEnabled: false,
    contextOverrides: {},
    aiReplyEnabled: false,
    aiReplyIncludeSensitive: false,
  },
  notificationsEndpoint: '',
  notificationsPollMinutes: 60,
  notificationsEnabled: true,
  notificationsMutedTypes: [],
  notificationsRetentionDays: 30,
  localAsrEnabled: false,
  localAsrScope: 'uploads',
  localAsrMode: 'command',
  localAsrCommand: '',
  localAsrEndpoint: '',
  localAsrMaxDurationMs: 60000,
  localEnhancementEnabled: false,
  localEnhancementCommand: '',
  localEnhancementMaxDurationMs: 20000,
  subscription: {
    plan: 'free',
    status: 'inactive',
    updatedAt: null,
  },
};
let settings = { ...defaultSettings };
const DICTIONARY_CACHE_TTL_MS = 60000;
let dictionaryCache = { entries: null, updatedAt: 0 };
const SNIPPET_CACHE_TTL_MS = 60000;
let snippetCache = { entries: null, updatedAt: 0 };
let contextSnapshotCache = null;
let contextSnapshotCapturedAt = 0;
let uploadJobs = [];
const uploadJobById = new Map();
const streamSessions = new Map();
let lastPolishDiff = null;
const DIAGNOSTIC_EVENT_LIMIT = 20;
let diagnosticEvents = [];
let lastDelivery = null;
let lastNetworkLatencyMs = null;
let lastFallbackReason = null;
let lastTranscriptionPath = 'cloud';
let featureFlagCache = { flags: {}, fetchedAt: 0, error: null };
let notificationsLastFetchedAt = 0;
let lastClipboardTest = null;
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

function areSettingValuesEqual(a, b) {
  if (a === b) {
    return true;
  }
  const bothObjects = a && b && typeof a === 'object' && typeof b === 'object';
  if (!bothObjects) {
    return false;
  }
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function getChangedSettingKeys(previous, next) {
  const keys = new Set([
    ...Object.keys(previous || {}),
    ...Object.keys(next || {}),
  ]);
  const changed = [];
  keys.forEach((key) => {
    if (!areSettingValuesEqual(previous?.[key], next?.[key])) {
      changed.push(key);
    }
  });
  return changed;
}

function normalizeContextSettings(value) {
  const base = { ...DEFAULT_CONTEXT_SETTINGS };
  if (!value || typeof value !== 'object') {
    return base;
  }
  const signals = { ...base.signals, ...(value.signals || {}) };
  const overrides = value.overrides && typeof value.overrides === 'object' ? value.overrides : {};
  return {
    enabled: value.enabled !== false,
    postProcessEnabled: value.postProcessEnabled === true,
    retentionDays: Number.isFinite(value.retentionDays) ? value.retentionDays : base.retentionDays,
    signals,
    overrides,
  };
}

function getContextSettings() {
  return normalizeContextSettings(settings.context);
}

function getContextProfiles() {
  const profiles = settings.contextProfiles;
  return Array.isArray(profiles) ? profiles : [];
}

function getFeatureFlagsRemote() {
  const remote = featureFlagCache?.flags && typeof featureFlagCache.flags === 'object'
    ? featureFlagCache.flags
    : {};
  return remote;
}

function getFeatureFlags() {
  const base = defaultSettings.featureFlags || {};
  const current = settings.featureFlags && typeof settings.featureFlags === 'object' ? settings.featureFlags : {};
  const remote = getFeatureFlagsRemote();
  const flags = { ...base, ...remote, ...current };
  if (STREAMING_DEPRECATED) {
    flags.streaming = false;
    flags.worklet = false;
  }
  return flags;
}

function isFeatureEnabled(flag) {
  const flags = getFeatureFlags();
  return Boolean(flags[flag]);
}

function getStreamingTransport() {
  const value = typeof settings.streamingTransport === 'string'
    ? settings.streamingTransport.trim().toLowerCase()
    : '';
  return value || 'local';
}

function getStreamingEndpoint() {
  return typeof settings.streamingEndpoint === 'string'
    ? settings.streamingEndpoint.trim()
    : '';
}

function getStreamingAuthToken() {
  return typeof settings.streamingAuthToken === 'string'
    ? settings.streamingAuthToken.trim()
    : '';
}

function shouldUseRemoteStreaming() {
  if (!isFeatureEnabled('streaming')) {
    return false;
  }
  const transport = getStreamingTransport();
  const endpoint = getStreamingEndpoint();
  return transport === 'ws' && Boolean(endpoint);
}

async function refreshRemoteFeatureFlags({ force = false } = {}) {
  const remoteUrl = typeof settings.featureFlagsRemoteUrl === 'string'
    ? settings.featureFlagsRemoteUrl.trim()
    : '';
  if (!remoteUrl) {
    featureFlagCache = { flags: {}, fetchedAt: 0, error: null };
    return featureFlagCache;
  }
  const ttlMs = Number.isFinite(settings.featureFlagsTtlMs)
    ? settings.featureFlagsTtlMs
    : defaultSettings.featureFlagsTtlMs;
  const now = Date.now();
  if (!force && featureFlagCache.fetchedAt && now - featureFlagCache.fetchedAt < ttlMs) {
    return featureFlagCache;
  }
  try {
    const response = await fetch(remoteUrl);
    if (!response.ok) {
      throw new Error(`Remote feature flags failed (${response.status}).`);
    }
    const data = await response.json();
    const flags = data && typeof data === 'object' ? data.flags || data : {};
    featureFlagCache = {
      flags,
      fetchedAt: now,
      error: null,
    };
    return featureFlagCache;
  } catch (error) {
    featureFlagCache = {
      ...featureFlagCache,
      fetchedAt: now,
      error: error?.message || 'Remote feature flags unavailable.',
    };
    return featureFlagCache;
  }
}

async function fallbackToFileMode(reason) {
  if (reason) {
    recordDiagnosticEvent('stream_fallback', reason);
    lastFallbackReason = reason;
  }
}

function getUploadConfig() {
  const maxMb = Number.isFinite(settings.uploadMaxMb) ? settings.uploadMaxMb : defaultSettings.uploadMaxMb;
  return {
    cloudFallback: settings.uploadCloudFallback === true,
    maxMb: maxMb || defaultSettings.uploadMaxMb,
  };
}

function recordDiagnosticEvent(code, message) {
  diagnosticEvents.unshift({
    at: new Date().toISOString(),
    code: code || 'event',
    message: message || '',
  });
  if (diagnosticEvents.length > DIAGNOSTIC_EVENT_LIMIT) {
    diagnosticEvents = diagnosticEvents.slice(0, DIAGNOSTIC_EVENT_LIMIT);
  }
}

function recordStreamEvent(code, details) {
  if (!code) {
    return;
  }
  if (typeof details === 'string') {
    recordDiagnosticEvent(code, details);
    return;
  }
  if (details && typeof details === 'object') {
    try {
      recordDiagnosticEvent(code, JSON.stringify(details));
      return;
    } catch (error) {
      recordDiagnosticEvent(code, 'details_unserializable');
      return;
    }
  }
  recordDiagnosticEvent(code, '');
}

function encodeBase64FromFloat32(samples) {
  if (!samples || !samples.buffer) {
    return '';
  }
  return Buffer.from(samples.buffer, samples.byteOffset || 0, samples.byteLength || 0).toString('base64');
}

function encodeBase64FromBuffer(buffer) {
  if (!buffer) {
    return '';
  }
  return Buffer.from(buffer).toString('base64');
}

function openRemoteStreamSession(session, payload = {}) {
  if (!WebSocketClient) {
    recordStreamEvent('stream_ws_missing', { id: session.id });
    return false;
  }
  const endpoint = getStreamingEndpoint();
  if (!endpoint) {
    recordStreamEvent('stream_ws_missing_endpoint', { id: session.id });
    return false;
  }
  if (!/^wss?:\/\//i.test(endpoint)) {
    recordStreamEvent('stream_ws_invalid_endpoint', { id: session.id, endpoint });
    return false;
  }
  const headers = {};
  const authToken = getStreamingAuthToken();
  if (authToken) {
    headers.Authorization = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  }
  const ws = new WebSocketClient(endpoint, { headers });
  session.remote = {
    ws,
    ready: false,
    queue: [],
    closed: false,
    lastMessageAt: null,
  };
  session.remoteEnabled = true;

  ws.on('open', () => {
    session.remote.ready = true;
    recordStreamEvent('stream_ws_open', { id: session.id });
    const startPayload = {
      type: 'start',
      session_id: session.id,
      codec: session.codec || 'pcm',
      sample_rate: session.sampleRate || settings.streamSampleRate || 16000,
      chunk_ms: session.chunkMs || settings.streamChunkMs || 900,
      client: {
        app_version: app.getVersion(),
        platform: process.platform,
      },
    };
    if (session.codec === 'opus' && payload.mimeType) {
      startPayload.mime = payload.mimeType;
    }
    ws.send(JSON.stringify(startPayload));
    while (session.remote.queue.length) {
      const queued = session.remote.queue.shift();
      ws.send(queued);
    }
  });

  ws.on('message', (data) => {
    session.remote.lastMessageAt = Date.now();
    let text = '';
    if (Buffer.isBuffer(data)) {
      text = data.toString('utf8');
    } else if (typeof data === 'string') {
      text = data;
    } else if (data && typeof data.toString === 'function') {
      text = data.toString();
    }
    if (!text) {
      return;
    }
    let message = null;
    try {
      message = JSON.parse(text);
    } catch {
      return;
    }
    if (!message || typeof message !== 'object') {
      return;
    }
    const type = message.type;
    if (type === 'partial' && typeof message.text === 'string') {
      session.remotePartialText = message.text;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('transcription-partial', message.text);
      }
      return;
    }
    if (type === 'final' && typeof message.text === 'string') {
      session.remoteFinalText = message.text;
      recordStreamEvent('stream_ws_final', { id: session.id });
      return;
    }
    if (type === 'error') {
      recordStreamEvent('stream_ws_error', {
        id: session.id,
        code: message.code || 'remote_error',
        message: message.message || '',
      });
      return;
    }
    if (type === 'ack') {
      recordStreamEvent('stream_ws_ack', { id: session.id });
      return;
    }
    if (type === 'pong') {
      recordStreamEvent('stream_ws_pong', { id: session.id });
    }
  });

  ws.on('close', () => {
    session.remote.closed = true;
    recordStreamEvent('stream_ws_close', { id: session.id });
  });

  ws.on('error', (error) => {
    recordStreamEvent('stream_ws_error', {
      id: session.id,
      message: error?.message || String(error),
    });
  });

  return true;
}

function sendRemoteMessage(session, message) {
  if (!session.remote || !session.remote.ws) {
    return false;
  }
  const payload = JSON.stringify(message);
  if (session.remote.ready) {
    session.remote.ws.send(payload);
  } else {
    session.remote.queue.push(payload);
  }
  return true;
}

function sendRemoteChunk(session, payload = {}) {
  if (!session.remote || !session.remote.ws) {
    return false;
  }
  const base = {
    type: 'chunk',
    session_id: session.id,
    seq: payload.seq,
    codec: session.codec || 'pcm',
  };
  if (session.codec === 'opus') {
    const chunk = payload.chunk;
    const encoded = encodeBase64FromBuffer(chunk);
    const message = {
      ...base,
      mime: payload.mimeType || session.mimeType || 'audio/webm;codecs=opus',
      payload: encoded,
      encoding: 'base64',
    };
    return sendRemoteMessage(session, message);
  }
  const samples = payload.samples;
  const encodedSamples = encodeBase64FromFloat32(samples);
  const message = {
    ...base,
    sample_rate: session.sampleRate || settings.streamSampleRate || 16000,
    samples: encodedSamples,
    encoding: 'base64',
  };
  return sendRemoteMessage(session, message);
}

function closeRemoteStreamSession(session) {
  if (!session?.remote?.ws) {
    return;
  }
  try {
    sendRemoteMessage(session, { type: 'stop', session_id: session.id });
  } catch {
    // ignore
  }
  try {
    session.remote.ws.close();
  } catch {
    // ignore
  }
}

async function recordTelemetryEvent(event, payload) {
  if (!store || settings.telemetryOptIn !== true) {
    return;
  }
  try {
    await store.addTelemetryEvent({
      id: crypto.randomUUID(),
      event,
      payload,
    });
  } catch (error) {
    console.warn('Telemetry event failed:', error);
  }
}

async function refreshNotifications({ force = false } = {}) {
  if (!store) {
    return [];
  }
  const notificationsEnabled = settings.notificationsEnabled !== false;
  const mutedTypes = Array.isArray(settings.notificationsMutedTypes)
    ? settings.notificationsMutedTypes
    : typeof settings.notificationsMutedTypes === 'string'
      ? settings.notificationsMutedTypes.split(',').map((item) => item.trim()).filter(Boolean)
      : [];
  const mutedTypesNormalized = mutedTypes.map((item) => String(item).toLowerCase());
  const retentionDays = Number.isFinite(settings.notificationsRetentionDays)
    ? settings.notificationsRetentionDays
    : defaultSettings.notificationsRetentionDays;
  await store.purgeNotifications(retentionDays);
  if (!notificationsEnabled) {
    return store.listNotifications({ limit: 200 });
  }
  const endpoint = typeof settings.notificationsEndpoint === 'string'
    ? settings.notificationsEndpoint.trim()
    : '';
  if (!endpoint) {
    return store.listNotifications({ limit: 200 });
  }
  const pollMinutes = Number.isFinite(settings.notificationsPollMinutes)
    ? settings.notificationsPollMinutes
    : defaultSettings.notificationsPollMinutes;
  const pollMs = Math.max(5, pollMinutes) * 60000;
  const now = Date.now();
  if (!force && notificationsLastFetchedAt && (now - notificationsLastFetchedAt) < pollMs) {
    return store.listNotifications({ limit: 200 });
  }
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Notifications fetch failed (${response.status}).`);
    }
    const payload = await response.json();
    const items = Array.isArray(payload) ? payload : payload?.notifications || [];
    for (const item of items) {
      if (!item || !item.id) {
        continue;
      }
      const type = String(item.type || item.level || 'info').toLowerCase();
      if (mutedTypesNormalized.includes(type)) {
        continue;
      }
      await store.upsertNotification({
        id: String(item.id),
        title: item.title || 'Notification',
        body: item.body || '',
        level: item.level || type,
        source: item.source || 'remote',
        url: item.url || null,
        created_at: item.created_at || item.createdAt || new Date().toISOString(),
      });
      if ((item.level === 'high' || item.priority === 'high') && Notification.isSupported()) {
        const notification = new Notification({
          title: item.title || 'CrocoVoice',
          body: item.body || '',
        });
        notification.show();
      }
    }
    notificationsLastFetchedAt = now;
  } catch (error) {
    console.warn('Notifications refresh failed:', error?.message || error);
  }
  return store.listNotifications({ limit: 200 });
}

async function createUploadJobFromFile(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return { ok: false, reason: 'Fichier invalide.' };
  }
  const allowedExtensions = new Set(UPLOAD_AUDIO_EXTENSIONS);
  const ext = path.extname(filePath).toLowerCase();
  if (ext && !allowedExtensions.has(ext)) {
    return { ok: false, reason: `Format audio non supporte. Formats acceptes: ${UPLOAD_AUDIO_EXTENSIONS_LABEL}.` };
  }
  let stats = null;
  try {
    stats = await fs.promises.stat(filePath);
  } catch (error) {
    return { ok: false, reason: error?.message || 'Fichier introuvable.' };
  }
  const config = getUploadConfig();
  const maxBytes = (config.maxMb || 200) * 1024 * 1024;
  if (stats.size > maxBytes) {
    return { ok: false, reason: `Fichier trop volumineux (>${config.maxMb}MB).` };
  }

  const job = {
    id: crypto.randomUUID(),
    filePath,
    fileName: path.basename(filePath),
    fileSize: stats.size,
    status: 'queued',
    progress: 0,
    error: null,
    cancelled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  uploadJobs = [job, ...uploadJobs].slice(0, 20);
  uploadJobById.set(job.id, job);
  sendDashboardEvent('dashboard:data-updated');
  setImmediate(() => processUploadJob(job));
  return { ok: true, job: serializeUploadJob(job) };
}

async function persistSettings(candidate) {
  if (!store) {
    settings = candidate;
    return settings;
  }
  const changedKeys = getChangedSettingKeys(settings, candidate);
  if (!changedKeys.length) {
    settings = candidate;
    return settings;
  }
  if (changedKeys.length === 1) {
    const key = changedKeys[0];
    await store.setSetting(key, candidate[key]);
  } else {
    await store.saveSettings(candidate);
  }
  settings = candidate;
  return settings;
}

function setSettingValue(key, value) {
  const candidate = { ...settings, [key]: value };
  return persistSettings(candidate);
}

function invalidateDictionaryCache() {
  dictionaryCache = { entries: null, updatedAt: 0 };
}

function invalidateSnippetCache() {
  snippetCache = { entries: null, updatedAt: 0 };
}

function filterManualDictionaryEntries(entries) {
  return (entries || []).filter((entry) => {
    if (!entry || !entry.from_text) {
      return false;
    }
    const source = typeof entry.source === 'string' ? entry.source.toLowerCase() : 'manual';
    const autoLearned = Number(entry.auto_learned) || 0;
    if (autoLearned) {
      return false;
    }
    if (source && source !== 'manual') {
      return false;
    }
    return true;
  });
}

async function getDictionaryEntriesCached() {
  if (!store) {
    return [];
  }
  const now = Date.now();
  if (dictionaryCache.entries && (now - dictionaryCache.updatedAt) < DICTIONARY_CACHE_TTL_MS) {
    return dictionaryCache.entries;
  }
  const entries = filterManualDictionaryEntries(await store.listDictionary());
  const sorted = [...entries].sort((a, b) => b.from_text.length - a.from_text.length);
  dictionaryCache = { entries: sorted, updatedAt: now };
  return sorted;
}

async function getSnippetEntriesCached() {
  if (!store) {
    return [];
  }
  const now = Date.now();
  if (snippetCache.entries && (now - snippetCache.updatedAt) < SNIPPET_CACHE_TTL_MS) {
    return snippetCache.entries;
  }
  const entries = await store.listSnippets();
  const sorted = [...entries].sort((a, b) => {
    const aNorm = a.cue_norm || normalizeSnippetCue(a.cue || '');
    const bNorm = b.cue_norm || normalizeSnippetCue(b.cue || '');
    return bNorm.length - aNorm.length;
  });
  snippetCache = { entries: sorted, updatedAt: now };
  return sorted;
}

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeContextId(value) {
  if (!value) {
    return '';
  }
  return value.toString().toLowerCase().replace(/\s+/g, ' ').trim();
}

function redactSensitiveText(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[redacted-email]')
    .replace(/\+?\d[\d\s().-]{7,}\d/g, '[redacted-phone]')
    .replace(/\b\d{6,}\b/g, '[redacted-number]');
}

function redactContextPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }
  const next = { ...payload };
  if (next.appName) {
    next.appName = redactSensitiveText(next.appName);
  }
  if (next.windowTitle) {
    next.windowTitle = redactSensitiveText(next.windowTitle);
  }
  if (next.url) {
    next.url = redactSensitiveText(next.url);
  }
  if (next.axText) {
    next.axText = redactSensitiveText(next.axText);
  }
  if (next.textboxText) {
    next.textboxText = redactSensitiveText(next.textboxText);
  }
  return next;
}

function truncateHint(value, max = 140) {
  if (!value || typeof value !== 'string') {
    return '';
  }
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 1)}…`;
}

function normalizeHintUrl(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }
  try {
    const url = new URL(value);
    return url.hostname || value;
  } catch {
    return value;
  }
}

function buildPostProcessContextHints(contextPayload) {
  if (!contextPayload) {
    return '';
  }
  const hints = [];
  if (contextPayload.appName) {
    hints.push(`App: ${truncateHint(contextPayload.appName)}`);
  }
  if (contextPayload.windowTitle) {
    hints.push(`Window: ${truncateHint(contextPayload.windowTitle)}`);
  }
  if (contextPayload.url) {
    const domain = normalizeHintUrl(contextPayload.url);
    hints.push(`URL domain: ${truncateHint(domain)}`);
  }
  return hints.length ? hints.join('\n- ') : '';
}

async function getActiveContextBase() {
  if (!getActiveWindow) {
    return { appName: null, windowTitle: null, url: null };
  }
  try {
    const activeWindow = await getActiveWindow();
    const windowTitle = await activeWindow.title;
    const appName = activeWindow?.app?.name
      || activeWindow?.owner?.name
      || activeWindow?.process?.name
      || null;
    const url = activeWindow?.url || null;
    return { appName, windowTitle, url };
  } catch (error) {
    console.warn('Failed to capture active window context:', error);
    return { appName: null, windowTitle: null, url: null };
  }
}

function getContextId(base) {
  if (!base) {
    return '';
  }
  return normalizeContextId(base.appName || base.windowTitle || '');
}

function matchProfile(profile, base) {
  if (!profile || !base) {
    return 0;
  }
  const appName = normalizeContextId(base.appName);
  const title = normalizeContextId(base.windowTitle);
  const url = normalizeContextId(base.url);
  const match = profile.match || {};
  let score = 0;
  if (match.appName && appName.includes(normalizeContextId(match.appName))) {
    score += 3;
  }
  if (match.windowTitle && title.includes(normalizeContextId(match.windowTitle))) {
    score += 2;
  }
  if (match.urlDomain && url.includes(normalizeContextId(match.urlDomain))) {
    score += 4;
  }
  return score;
}

function selectContextProfile(base, profiles) {
  const candidates = (profiles || []).map((profile) => ({
    profile,
    score: matchProfile(profile, base),
  })).filter((candidate) => candidate.score > 0);
  if (!candidates.length) {
    return null;
  }
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].profile;
}

function suggestContextProfile(base, profiles) {
  if (!base) {
    return null;
  }
  const haystack = `${base.appName || ''} ${base.windowTitle || ''}`.toLowerCase();
  return (profiles || []).find((profile) => {
    const name = (profile.name || '').toLowerCase();
    return name && haystack.includes(name);
  }) || null;
}

function resolveFormattingOptions(profile) {
  const tone = profile?.tone || 'default';
  const toneDefaults = {
    default: { lineBreaks: 'auto', punctuation: 'minimal' },
    concise: { lineBreaks: 'single', punctuation: 'standard' },
    conversational: { lineBreaks: 'auto', punctuation: 'minimal' },
  };
  return {
    ...(toneDefaults[tone] || toneDefaults.default),
    ...(profile?.formatting || {}),
  };
}

function applyAdaptiveFormatting(text, profile) {
  if (!text || !profile) {
    return text;
  }
  const options = resolveFormattingOptions(profile);
  let result = text;
  if (options.lineBreaks === 'single') {
    result = result.replace(/\n{2,}/g, '\n');
  } else if (options.lineBreaks === 'double') {
    result = result.replace(/\n{3,}/g, '\n\n');
  }
  result = result.replace(/[ \t]+/g, ' ').replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n');
  if (options.punctuation === 'standard') {
    if (!/[.!?…]$/.test(result.trim()) && result.trim().length > 3) {
      result = `${result.trim()}.`;
    }
  }
  return result;
}

function applyDictatedListFormatting(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }
  const tokenRegex = /(^|[ \t\n\r])(\d{1,2})([.)]|:)?\s+/g;
  const tokens = [];
  let match = null;
  while ((match = tokenRegex.exec(text))) {
    const number = Number.parseInt(match[2], 10);
    if (!Number.isFinite(number)) {
      continue;
    }
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      number,
    });
  }
  if (tokens.length < 2) {
    return text;
  }
  let seqStart = -1;
  let seqEnd = -1;
  for (let i = 0; i < tokens.length; i += 1) {
    if (tokens[i].number !== 1) {
      continue;
    }
    let expected = 2;
    let end = i;
    for (let j = i + 1; j < tokens.length; j += 1) {
      if (tokens[j].number === expected) {
        end = j;
        expected += 1;
      } else {
        break;
      }
    }
    if (end > i) {
      seqStart = i;
      seqEnd = end;
      break;
    }
  }
  if (seqStart === -1) {
    return text;
  }
  let result = text;
  for (let i = seqEnd; i >= seqStart; i -= 1) {
    const token = tokens[i];
    const prefix = token.start === 0 ? '' : '\n';
    const replacement = `${prefix}${token.number}. `;
    result = result.slice(0, token.start) + replacement + result.slice(token.end);
  }
  return result;
}

async function resolveContextState() {
  const base = await getActiveContextBase();
  const contextSettings = getContextSettings();
  const profiles = getContextProfiles();
  const contextId = getContextId(base);
  const override = contextSettings.overrides?.[contextId] || {};
  let effectiveEnabled = contextSettings.enabled;
  if (override.mode === 'on') {
    effectiveEnabled = true;
  } else if (override.mode === 'off') {
    effectiveEnabled = false;
  }
  const effectiveSignals = {
    ...(contextSettings.signals || {}),
    ...(override.signals || {}),
  };
  let profile = null;
  if (effectiveEnabled) {
    if (override.mode === 'on' && override.profileId) {
      profile = profiles.find((candidate) => candidate.id === override.profileId) || null;
    }
    if (!profile) {
      profile = selectContextProfile(base, profiles);
    }
  }
  const suggestion = !profile ? suggestContextProfile(base, profiles) : null;
  let contextPayload = null;
  if (effectiveEnabled) {
    contextPayload = {
      capturedAt: new Date().toISOString(),
      appName: effectiveSignals.app ? base.appName : null,
      windowTitle: effectiveSignals.window ? base.windowTitle : null,
      url: effectiveSignals.url ? base.url : null,
      axText: effectiveSignals.ax ? null : null,
      textboxText: effectiveSignals.textbox ? null : null,
      screenshot: effectiveSignals.screenshot ? null : null,
      profileId: profile ? profile.id : null,
      contextId,
      signals: {
        app: Boolean(effectiveSignals.app),
        window: Boolean(effectiveSignals.window),
        url: Boolean(effectiveSignals.url),
        ax: Boolean(effectiveSignals.ax),
        textbox: Boolean(effectiveSignals.textbox),
        screenshot: Boolean(effectiveSignals.screenshot),
      },
    };
    contextPayload = redactContextPayload(contextPayload);
  }
  return {
    base,
    contextId,
    enabled: effectiveEnabled,
    profile,
    suggestion,
    payload: contextPayload,
    overrideMode: override.mode || 'inherit',
    signals: effectiveSignals,
  };
}

async function getContextStateCached() {
  const now = Date.now();
  if (contextSnapshotCache && (now - contextSnapshotCapturedAt) < 30000) {
    return contextSnapshotCache;
  }
  const state = await resolveContextState();
  contextSnapshotCache = state;
  contextSnapshotCapturedAt = now;
  return state;
}

function clearContextCache() {
  contextSnapshotCache = null;
  contextSnapshotCapturedAt = 0;
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

function normalizeFuzzyText(value) {
  if (!value) {
    return '';
  }
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function buildWordTokens(text) {
  if (!text) {
    return [];
  }
  const tokens = [];
  const regex = /[\p{L}\p{N}_]+/gu;
  let match = null;
  while ((match = regex.exec(text))) {
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      raw: match[0],
      norm: normalizeFuzzyText(match[0]),
    });
  }
  return tokens;
}

function getLeadingTokenSpan(tokens, tokenCount) {
  if (!tokens.length || tokenCount <= 0 || tokens.length < tokenCount) {
    return null;
  }
  const start = tokens[0].start;
  const end = tokens[tokenCount - 1].end;
  return {
    start,
    end,
    tokens: tokens.slice(0, tokenCount),
  };
}

function stripLeadingSpan(text, endIndex) {
  if (!text || !Number.isFinite(endIndex)) {
    return text || '';
  }
  return text.slice(endIndex).replace(/^[\s\p{P}]+/u, '');
}

function findFuzzySnippetMatch(text, entries) {
  if (!SNIPPET_FUZZY.enabled) {
    return null;
  }
  const tokens = buildWordTokens(text || '');
  if (!tokens.length) {
    return null;
  }
  let best = null;
  (entries || []).forEach((entry) => {
    const cueNorm = entry.cue_norm || normalizeSnippetCue(entry.cue);
    if (!cueNorm) {
      return;
    }
    const cueTokens = cueNorm.split(' ').filter(Boolean);
    if (!cueTokens.length) {
      return;
    }
    const span = getLeadingTokenSpan(tokens, cueTokens.length);
    if (!span) {
      return;
    }
    const cueFirst = normalizeFuzzyText(cueTokens[0]);
    const textFirst = span.tokens[0]?.norm || '';
    const prefixLen = Math.min(SNIPPET_FUZZY.prefixLength, cueFirst.length, textFirst.length);
    if (prefixLen > 0 && cueFirst.slice(0, prefixLen) !== textFirst.slice(0, prefixLen)) {
      return;
    }
    const cueJoined = normalizeFuzzyText(cueTokens.join(' '));
    const textJoined = normalizeFuzzyText(span.tokens.map((token) => token.raw).join(' '));
    if (cueJoined.length < SNIPPET_FUZZY.minLength || textJoined.length < SNIPPET_FUZZY.minLength) {
      return;
    }
    const ratio = computeDivergenceScore(cueJoined, textJoined);
    if (ratio === null || ratio > SNIPPET_FUZZY.maxDistanceRatio) {
      return;
    }
    if (!best || ratio < best.ratio || (ratio === best.ratio && cueJoined.length > best.length)) {
      best = {
        entry,
        spanEnd: span.end,
        ratio,
        length: cueJoined.length,
      };
    }
  });
  return best;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripCueFromText(text, cueNorm) {
  if (!text || !cueNorm) {
    return text || '';
  }
  const tokens = cueNorm.split(' ').filter(Boolean).map(escapeRegExp);
  if (!tokens.length) {
    return text || '';
  }
  const pattern = tokens.join('\\s+');
  const regex = new RegExp(`^\\s*${pattern}[\\s\\p{P}]*`, 'iu');
  const match = text.match(regex);
  if (!match) {
    return text;
  }
  return text.slice(match[0].length);
}

function matchesSnippetCue(text, cueNorm) {
  if (!text || !cueNorm) {
    return false;
  }
  const tokens = cueNorm.split(' ').filter(Boolean).map(escapeRegExp);
  if (!tokens.length) {
    return false;
  }
  const pattern = tokens.join('\\s+');
  const regex = new RegExp(`^\\s*${pattern}(?:[\\s\\p{P}]+|$)`, 'iu');
  return regex.test(text);
}

function isNoAudioTranscription(text) {
  const normalized = normalizeText(text);
  const compact = normalized.replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
  const fragments = [
    'sous titres realises par la communaute d amara org',
    'sous titrage st 501',
  ];
  if (fragments.some((fragment) => compact === fragment || compact.includes(fragment))) {
    return true;
  }
  const looksLikeSubtitleHallucination = compact.includes('amara') && compact.includes('sous') && compact.includes('titres');
  return looksLikeSubtitleHallucination;
}

function getSubscriptionSnapshot() {
  const subscription = settings.subscription || {};
  const plan = subscription.plan || 'free';
  const status = subscription.status || 'inactive';
  const currentPeriodEnd = subscription.currentPeriodEnd || subscription.current_period_end || null;
  const isPro = isProSubscription(subscription);
  return {
    ...subscription,
    plan,
    status,
    currentPeriodEnd,
    isPro,
  };
}

async function setSubscriptionState(nextSubscription) {
  if (!store) {
    return;
  }
  settings.subscription = nextSubscription;
  await store.setSetting('subscription', nextSubscription);
  scheduleDebouncedSync({ refreshSettings: true });
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('settings-updated', settings);
  }
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.webContents.send('settings-updated', settings);
  }
  sendDashboardEvent('dashboard:data-updated');
}

async function normalizeQuotaState() {
  if (!syncService || !syncService.getUser()) {
    return null;
  }
  if (isProSubscription(settings.subscription)) {
    return null;
  }
  const weekStart = getWeekStartUTC();
  const startIso = weekStart.toISOString();
  const existing = settings.quotaWeekly || settings.quota_weekly || {};
  if (existing.periodStart !== startIso) {
    const nextQuota = { periodStart: startIso, wordsUsed: 0 };
    settings.quotaWeekly = nextQuota;
    settings.quota_weekly = nextQuota;
    await store.setSetting('quota_weekly', nextQuota);
    scheduleDebouncedSync({ refreshSettings: true });
    return nextQuota;
  }
  return existing;
}

function shouldUseServerQuota() {
  return QUOTA_MODE === 'server' || QUOTA_MODE === 'hybrid';
}

function readQuotaSnapshotCache() {
  const cache = settings.quota_snapshot_cache || settings.quotaSnapshotCache;
  const fetchedAt = cache?.fetchedAt || cache?.fetched_at;
  const quota = cache?.quota;
  if (!quota || !fetchedAt) {
    return null;
  }
  const fetchedAtMs = Date.parse(fetchedAt);
  if (!Number.isFinite(fetchedAtMs)) {
    return null;
  }
  if (Date.now() - fetchedAtMs > QUOTA_CACHE_TTL_MS) {
    return null;
  }
  return quota;
}

async function writeQuotaSnapshotCache(quota) {
  if (!store) {
    return;
  }
  const entry = { quota, fetchedAt: new Date().toISOString() };
  settings.quota_snapshot_cache = entry;
  settings.quotaSnapshotCache = entry;
  await store.setSetting('quota_snapshot_cache', entry);
}

async function getQuotaSnapshotFromServer() {
  if (!syncService || !syncService.isReady || !syncService.isReady() || !syncService.getUser()) {
    return null;
  }
  if (!syncService.invokeFunction) {
    return null;
  }
  const result = await syncService.invokeFunction('quota-snapshot', {});
  return result || null;
}

async function refreshQuotaSnapshotInBackground() {
  if (!shouldUseServerQuota()) {
    return;
  }
  try {
    const serverQuota = await getQuotaSnapshotFromServer();
    if (serverQuota) {
      await writeQuotaSnapshotCache(serverQuota);
      await setLocalQuotaFromSnapshot(serverQuota);
    }
  } catch (error) {
    console.warn('Quota snapshot (server) refresh failed:', error);
  }
}

async function consumeQuotaOnServer(words) {
  if (!syncService || !syncService.isReady || !syncService.isReady() || !syncService.getUser()) {
    return null;
  }
  if (!syncService.invokeFunction) {
    return null;
  }
  const result = await syncService.invokeFunction('quota-consume', { words });
  return result || null;
}

async function setLocalQuotaFromSnapshot(quota) {
  if (!store || !quota || quota.unlimited || quota.requiresAuth) {
    return;
  }
  if (!Number.isFinite(quota.used)) {
    return;
  }
  const nextQuota = { periodStart: getWeekStartUTC().toISOString(), wordsUsed: quota.used };
  settings.quotaWeekly = nextQuota;
  settings.quota_weekly = nextQuota;
  await store.setSetting('quota_weekly', nextQuota);
}

async function incrementQuotaUsage(text) {
  if (!syncService || !syncService.getUser()) {
    return null;
  }
  if (isProSubscription(settings.subscription)) {
    return null;
  }
  const words = countWords(text);
  if (shouldUseServerQuota()) {
    try {
      const serverQuota = await consumeQuotaOnServer(words);
      if (serverQuota) {
        await writeQuotaSnapshotCache(serverQuota);
        await setLocalQuotaFromSnapshot(serverQuota);
        scheduleDebouncedSync({ refreshSettings: true });
        return settings.quotaWeekly || settings.quota_weekly || null;
      }
    } catch (error) {
      console.warn('Quota consume (server) failed:', error);
    }
  }

  const nextQuota = (await normalizeQuotaState()) || { periodStart: getWeekStartUTC().toISOString(), wordsUsed: 0 };
  nextQuota.wordsUsed = (nextQuota.wordsUsed || 0) + words;
  settings.quotaWeekly = nextQuota;
  settings.quota_weekly = nextQuota;
  await store.setSetting('quota_weekly', nextQuota);
  scheduleDebouncedSync({ refreshSettings: true });
  return nextQuota;
}

async function getQuotaSnapshot() {
  const cachedQuota = shouldUseServerQuota() ? readQuotaSnapshotCache() : null;
  const authStatus = authState?.status;
  const canUseCachedQuota = cachedQuota
    && authStatus !== 'unauthenticated'
    && authStatus !== 'not_configured';
  if (canUseCachedQuota) {
    void refreshQuotaSnapshotInBackground();
    return cachedQuota;
  }
  if (!syncService || !syncService.getUser()) {
    return {
      limit: WEEKLY_QUOTA_WORDS,
      used: 0,
      remaining: WEEKLY_QUOTA_WORDS,
      resetAt: getNextWeekStartUTC().toISOString(),
      requiresAuth: true,
      unlimited: false,
    };
  }
  if (isProSubscription(settings.subscription)) {
    return {
      limit: null,
      used: 0,
      remaining: null,
      resetAt: null,
      requiresAuth: false,
      unlimited: true,
    };
  }

  if (shouldUseServerQuota()) {
    const cached = readQuotaSnapshotCache();
    if (cached) {
      void refreshQuotaSnapshotInBackground();
      return cached;
    }
    try {
      const serverQuota = await getQuotaSnapshotFromServer();
      if (serverQuota) {
        await writeQuotaSnapshotCache(serverQuota);
        await setLocalQuotaFromSnapshot(serverQuota);
        return serverQuota;
      }
    } catch (error) {
      console.warn('Quota snapshot (server) failed:', error);
      if (QUOTA_MODE === 'server') {
        return {
          limit: WEEKLY_QUOTA_WORDS,
          used: WEEKLY_QUOTA_WORDS,
          remaining: 0,
          resetAt: getNextWeekStartUTC().toISOString(),
          requiresAuth: false,
          unlimited: false,
          checkFailed: true,
          message: 'Impossible de verifier le quota (reseau indisponible).',
        };
      }
    }
  }

  const quota = await normalizeQuotaState();
  const used = quota?.wordsUsed || 0;
  return {
    limit: WEEKLY_QUOTA_WORDS,
    used,
    remaining: Math.max(0, WEEKLY_QUOTA_WORDS - used),
    resetAt: getNextWeekStartUTC().toISOString(),
    requiresAuth: false,
    unlimited: false,
  };
}

function isQuotaReached(quota) {
  if (!quota || quota.unlimited || quota.requiresAuth) {
    return false;
  }
  if (!Number.isFinite(quota.remaining)) {
    return false;
  }
  return quota.remaining <= 0;
}

function notifyQuotaBlocked(quota) {
  const payload = {
    remaining: Number.isFinite(quota?.remaining) ? quota.remaining : 0,
    limit: Number.isFinite(quota?.limit) ? quota.limit : null,
    resetAt: quota?.resetAt || null,
  };
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('quota:blocked', payload);
  }
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.webContents.send('quota:blocked', payload);
  }
}

async function ensureQuotaAvailable() {
  try {
    const quota = await getQuotaSnapshot();
    if (quota?.checkFailed) {
      setRecordingState(RecordingState.ERROR, quota.message || 'Impossible de verifier le quota.');
      scheduleReturnToIdle(3500);
      return false;
    }
    if (isQuotaReached(quota)) {
      setRecordingState(RecordingState.ERROR, 'Quota atteint. Passez Pro pour continuer.');
      scheduleReturnToIdle(3500);
      notifyQuotaBlocked(quota);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Failed to check quota before recording:', error);
    if (QUOTA_MODE === 'server') {
      setRecordingState(RecordingState.ERROR, 'Impossible de verifier le quota.');
      scheduleReturnToIdle(3500);
      return false;
    }
    return true;
  }
}

function sendStatus(state, message) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('status-change', state, message || '');
  }
}

function setRecordingState(state, message) {
  recordingState = state;
  isRecording = state === RecordingState.RECORDING;
  lastStatusMessage = message || '';
  sendStatus(state, message);
  updateWidgetBounds();
  updateTrayMenu();
  if (state === RecordingState.IDLE && pendingSync) {
    const deferred = pendingSync;
    pendingSync = null;
    performSync({ refreshSettings: deferred.refreshSettings })
      .then(deferred.resolve)
      .catch(deferred.reject);
  }
}

function shouldDeferSync() {
  return recordingState === RecordingState.RECORDING || recordingState === RecordingState.PROCESSING;
}

function performSync({ refreshSettings } = {}) {
  if (!syncService || !syncService.isReady()) {
    return Promise.resolve({ ok: false, reason: 'not_configured' });
  }
  if (!syncService.getUser()) {
    return Promise.resolve({ ok: false, reason: 'not_authenticated' });
  }
  if (syncInFlight) {
    return syncInFlight;
  }
  syncInFlight = (async () => {
    const result = await syncService.syncAll();
    if (refreshSettings) {
      await refreshSettingsFromStore();
    }
    return result;
  })().catch((error) => {
    console.error('Sync failed:', error);
    return { ok: false, reason: 'error' };
  }).finally(() => {
    syncInFlight = null;
  });
  return syncInFlight;
}

function requestSync({ refreshSettings } = {}) {
  if (shouldDeferSync()) {
    if (!pendingSync) {
      pendingSync = {};
      pendingSync.promise = new Promise((resolve, reject) => {
        pendingSync.resolve = resolve;
        pendingSync.reject = reject;
      });
    }
    pendingSync.refreshSettings = pendingSync.refreshSettings || refreshSettings;
    return pendingSync.promise;
  }
  return performSync({ refreshSettings });
}

function scheduleDebouncedSync({ refreshSettings } = {}) {
  if (!syncService || !syncService.isReady() || !syncService.getUser()) {
    return;
  }
  syncDebounceRefresh = syncDebounceRefresh || Boolean(refreshSettings);
  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer);
  }
  syncDebounceTimer = setTimeout(() => {
    const nextRefresh = syncDebounceRefresh;
    syncDebounceTimer = null;
    syncDebounceRefresh = false;
    requestSync({ refreshSettings: nextRefresh }).catch((error) => {
      console.error('Debounced sync failed:', error);
    });
  }, SYNC_DEBOUNCE_MS);
}

function broadcastAuthState() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('auth:state', authState);
  }
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.webContents.send('auth:state', authState);
  }
}

function setAuthState(nextState) {
  authState = { ...authState, ...nextState };
  broadcastAuthState();
  updateWindowVisibility();
}

function canAccessPremium() {
  return authState.status === 'authenticated';
}

function buildStripeUrl(baseUrl, user) {
  if (!baseUrl) {
    return null;
  }
  try {
    const url = new URL(baseUrl);
    if (user?.id) {
      url.searchParams.set('client_reference_id', user.id);
      url.searchParams.set('user_id', user.id);
    }
    if (user?.email) {
      url.searchParams.set('prefilled_email', user.email);
      url.searchParams.set('email', user.email);
    }
    if (STRIPE_RETURN_URL) {
      url.searchParams.set('return_to', STRIPE_RETURN_URL);
    }
    return url.toString();
  } catch (error) {
    console.warn('Invalid Stripe URL:', error);
    return null;
  }
}

function requireAuthenticated(message) {
  if (canAccessPremium()) {
    return;
  }
  notifyAuthRequired(message || 'Connexion requise.');
  const error = new Error(message || 'Connexion requise.');
  error.code = 'auth_required';
  throw error;
}

function getAuthErrorMessage(error) {
  const message = (error && error.message) ? error.message.toLowerCase() : '';
  if (message.includes('invalid login credentials')) {
    return 'Email ou mot de passe invalide.';
  }
  if (message.includes('email not confirmed')) {
    return 'Email non confirme. Verifiez votre boite mail.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Reseau indisponible. Reessayez.';
  }
  return error?.message || 'Impossible de se connecter.';
}

function notifyAuthRequired(message) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('auth:required', message || 'Connexion requise.');
  }
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.webContents.send('auth:required', message || 'Connexion requise.');
  }
  ensureDashboardWindow();
}

function clearAuthRetry() {
  if (authRetryTimer) {
    clearTimeout(authRetryTimer);
    authRetryTimer = null;
  }
}

function scheduleAuthRetry() {
  clearAuthRetry();
  if (authState.status === 'authenticated' || authState.status === 'not_configured') {
    return;
  }
  const backoffMs = Math.min(8000, 1000 * Math.pow(2, Math.max(authErrorCount, 1)));
  authRetryTimer = setTimeout(() => {
    if (authState.status !== 'authenticated') {
      hydrateAuthState();
    }
  }, backoffMs);
}

async function hydrateAuthState() {
  if (!syncService || !syncService.isReady()) {
    setAuthState({
      status: 'not_configured',
      message: 'Supabase non configure.',
      user: null,
      syncReady: false,
      retryable: false,
    });
    return;
  }

  setAuthState({
    status: 'checking',
    message: 'Verification de session...',
    syncReady: true,
    retryable: false,
  });

  try {
    const { user } = await syncService.refreshSession();
    authErrorCount = 0;
    clearAuthRetry();
    if (user) {
      setAuthState({
        status: 'authenticated',
        message: '',
        user: { email: user.email, id: user.id },
        retryable: false,
      });
    } else {
      setAuthState({
        status: 'unauthenticated',
        message: '',
        user: null,
        retryable: false,
      });
    }
  } catch (error) {
    authErrorCount += 1;
    const message = authErrorCount >= 2
      ? 'Connexion instable. Mode lecture seule, reessayez.'
      : getAuthErrorMessage(error);
    setAuthState({
      status: 'error',
      message,
      user: null,
      syncReady: true,
      retryable: true,
    });
    scheduleAuthRetry();
  }
}

function clearProcessingTimeout() {
  if (processingTimeoutId) {
    clearTimeout(processingTimeoutId);
    processingTimeoutId = null;
  }
}

function armProcessingTimeout() {
  clearProcessingTimeout();
  processingTimeoutId = setTimeout(() => {
    if (recordingState !== RecordingState.PROCESSING) {
      return;
    }
    console.warn('Processing timeout: no audio received from renderer.');
    setRecordingState(RecordingState.ERROR, NO_AUDIO_MESSAGE);
    scheduleReturnToIdle(3000);
  }, 4000);
}

function shouldDebounceAction(action) {
  const key = action || 'start';
  const now = Date.now();
  if (now - lastActionAt[key] < ACTION_DEBOUNCE_MS) {
    return true;
  }
  lastActionAt[key] = now;
  return false;
}

function refreshRendererState() {
  sendStatus(recordingState, lastStatusMessage);
}

async function captureTypingTarget() {
  if (!getActiveWindow) {
    typingTarget = null;
    return;
  }
  try {
    const activeWindow = await getActiveWindow();
    const title = await activeWindow.title;
    if (!title) {
      typingTarget = null;
      return;
    }
    typingTarget = { title, capturedAt: Date.now() };
  } catch (error) {
    console.warn('Failed to capture active window for typing guard:', error);
    typingTarget = null;
  }
}

async function assertTypingTargetStillActive({ allowMismatch = false } = {}) {
  if (!typingTarget || !getActiveWindow) {
    return;
  }
  try {
    const activeWindow = await getActiveWindow();
    const title = await activeWindow.title;
    if (!title || title !== typingTarget.title) {
      if (allowMismatch) {
        console.warn('Typing guard bypassed: target window changed before paste.');
        return;
      }
      const guardError = new Error('Fenetre cible modifiee pendant le collage. Cliquez dans la zone cible et reessayez.');
      guardError.code = 'typing_guard';
      throw guardError;
    }
  } catch (error) {
    if (allowMismatch) {
      console.warn('Typing guard check failed, continuing paste:', error);
      return;
    }
    const detail = error && error.message
      ? error.message
      : 'Impossible de verifier la fenetre cible.';
    const guardError = new Error(detail);
    guardError.code = 'typing_guard';
    throw guardError;
  }
}

async function refreshSettingsFromStore() {
  if (!store) {
    return;
  }
  settings = await store.getSettings();
  if (settings && Object.prototype.hasOwnProperty.call(settings, 'deliveryMode')) {
    delete settings.deliveryMode;
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('settings-updated', settings);
  }
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.webContents.send('settings-updated', settings);
  }
}

function getOpenAIClient() {
  if (!OPENAI_API_KEY) {
    return null;
  }
  if (!openai) {
    openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  }
  return openai;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, timeoutMs, label) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error(`OpenAI timeout (${label})`);
      error.code = 'ETIMEDOUT';
      reject(error);
    }, timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

function extractOpenAIErrorInfo(error) {
  const responseError = error?.response?.data?.error || error?.error;
  return {
    status: error?.status || error?.response?.status,
    code: error?.code || responseError?.code,
    type: error?.type || responseError?.type,
    message: error?.message || responseError?.message,
  };
}

function isRetryableOpenAIError(error) {
  const { status, code, message } = extractOpenAIErrorInfo(error);
  if (code === 'ETIMEDOUT') {
    return true;
  }
  if (status === 408 || status === 429) {
    return true;
  }
  if (status >= 500 && status < 600) {
    return true;
  }
  if (code === 'rate_limit_exceeded' || code === 'insufficient_quota') {
    return true;
  }
  if (typeof message === 'string' && message.toLowerCase().includes('timeout')) {
    return true;
  }
  return false;
}

function getOpenAIUserMessage(error) {
  const { status, code, message } = extractOpenAIErrorInfo(error);
  if (code === 'ETIMEDOUT' || (message && message.toLowerCase().includes('timeout'))) {
    return 'OpenAI ne repond pas (timeout). Reessayez dans quelques instants.';
  }
  if (status === 401 || status === 403 || code === 'invalid_api_key') {
    return 'Cle OpenAI invalide. Verifiez votre OPENAI_API_KEY.';
  }
  if (status === 429 || code === 'rate_limit_exceeded') {
    return 'Limite de requetes OpenAI atteinte (429). Reessayez bientot.';
  }
  if (code === 'insufficient_quota') {
    return 'Quota OpenAI epuise. Verifiez votre plan ou facturation.';
  }
  return 'Erreur OpenAI. Reessayez.';
}

async function executeOpenAICall({ label, timeoutMs, action }) {
  let attempt = 0;
  while (true) {
    try {
      return await withTimeout(action(), timeoutMs, label);
    } catch (error) {
      attempt += 1;
      const retryable = isRetryableOpenAIError(error);
      if (!retryable || attempt > OPENAI_MAX_RETRIES) {
        throw error;
      }
      const backoff = Math.min(
        OPENAI_MAX_BACKOFF_MS,
        OPENAI_BASE_BACKOFF_MS * Math.pow(2, attempt - 1),
      );
      const jitter = Math.floor(Math.random() * 200);
      console.warn(`[OpenAI] ${label} failed, retrying in ${backoff + jitter}ms...`);
      await sleep(backoff + jitter);
    }
  }
}

async function postProcessText(text, prompt, contextHint) {
  if (!settings.postProcessEnabled) {
    return text;
  }
  const client = getOpenAIClient();
  if (!client) {
    const error = new Error('OpenAI API key missing.');
    error.code = 'missing_api_key';
    throw error;
  }
  const systemPrompt = [
    'You are a text editor. Preserve the original meaning and factual content.',
    'Do not invent new facts. Figurative language is allowed only if requested by the style.',
    'Remove filler words, hesitations, and repetitions.',
    'Remove stray quotation marks.',
    'Fix punctuation, spelling, grammar, and add natural line breaks.',
    'Infer punctuation naturally; do not keep spoken punctuation commands (e.g., "virgule", "point", "?").',
    'Do not summarize.',
  ].join(' ');
  const contextBlock = contextHint
    ? [
      'Context hints (redacted, optional). Use only to resolve proper nouns; do not add new facts:',
      `- ${contextHint}`,
    ].join('\n')
    : '';
  const userPrompt = [
    `Language: ${settings.language || 'fr'}.`,
    prompt || '',
    contextBlock,
    'Text:',
    text,
  ].filter(Boolean).join('\n');

  try {
    const response = await executeOpenAICall({
      label: 'chat.completions',
      timeoutMs: OPENAI_CHAT_TIMEOUT_MS,
      action: () => client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    const content = response.choices?.[0]?.message?.content?.trim();
    return content || text;
  } catch (error) {
    console.error('Post-processing error:', error);
    throw error;
  }
}

// External integrations: OpenAI (transcription + post-process), keyboard automation (nut-js/robotjs), Supabase sync.
// Manual regression checks: start/stop recording, transcription, typing, history entry, optional sync.

async function applyDictionary(text) {
  if (!store) {
    return text;
  }
  const entries = await getDictionaryEntriesCached();
  if (!entries.length) {
    return text;
  }
  const result = applyDictionaryEntries(text, entries, {
    trackUsage: true,
    allowAutoLearned: false,
    allowNonManual: false,
    fuzzy: DICTIONARY_FUZZY.enabled,
    fuzzyMinLength: DICTIONARY_FUZZY.minLength,
    fuzzyPrefixLength: DICTIONARY_FUZZY.prefixLength,
    fuzzyMaxDistanceRatio: DICTIONARY_FUZZY.maxDistanceRatio,
  });
  if (result && result.usage && result.usage.length) {
    await store.updateDictionaryUsage(result.usage);
  }
  return result && typeof result.text === 'string' ? result.text : text;
}

async function applySnippets(text) {
  if (!store) {
    return text;
  }
  const entries = await getSnippetEntriesCached();
  if (!entries.length) {
    return text;
  }
  const matches = entries.filter((entry) => {
    const cueNorm = entry.cue_norm || normalizeSnippetCue(entry.cue);
    if (!cueNorm) {
      return false;
    }
    return matchesSnippetCue(text, cueNorm);
  });

  if (!matches.length) {
    const fuzzyMatch = findFuzzySnippetMatch(text, entries);
    if (!fuzzyMatch || !fuzzyMatch.entry) {
      return text;
    }
    const remaining = stripLeadingSpan(text || '', fuzzyMatch.spanEnd).trim();
    const template = (fuzzyMatch.entry.template || '').trim();
    if (!template) {
      return text;
    }
    if (template.includes('{{content}}')) {
      return template.replace(/{{\s*content\s*}}/g, remaining);
    }
    if (!remaining) {
      return template;
    }
    return `${template} ${remaining}`.trim();
  }

  const longest = matches.reduce((max, entry) => {
    const length = (entry.cue_norm || normalizeSnippetCue(entry.cue)).length;
    return length > max ? length : max;
  }, 0);
  const bestMatches = matches.filter((entry) => {
    const length = (entry.cue_norm || normalizeSnippetCue(entry.cue)).length;
    return length === longest;
  });
  if (bestMatches.length !== 1) {
    return text;
  }
  const chosen = bestMatches[0];
  const remaining = stripCueFromText(text || '', chosen.cue_norm || normalizeSnippetCue(chosen.cue || '')).trim();
  const template = (chosen.template || '').trim();
  if (!template) {
    return text;
  }
  if (template.includes('{{content}}')) {
    return template.replace(/{{\s*content\s*}}/g, remaining);
  }
  if (!remaining) {
    return template;
  }
  return `${template} ${remaining}`.trim();
}

function computeDivergenceScore(rawText, formattedText) {
  if (!rawText || !formattedText) {
    return null;
  }
  const source = rawText.trim();
  const target = formattedText.trim();
  if (!source || !target) {
    return null;
  }
  if (source === target) {
    return 0;
  }
  const a = source;
  const b = target;
  const lenA = a.length;
  const lenB = b.length;
  const dp = new Array(lenB + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= lenA; i += 1) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= lenB; j += 1) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(
        dp[j] + 1,
        dp[j - 1] + 1,
        prev + cost,
      );
      prev = temp;
    }
  }
  const distance = dp[lenB];
  const maxLen = Math.max(lenA, lenB);
  return maxLen ? distance / maxLen : null;
}

function compactTextForTitle(text) {
  if (!text) {
    return 'Untitled note';
  }
  const candidate = text.split(/[\r\n\.!\?]+/).find(Boolean) || text;
  return candidate.trim().slice(0, 80) || candidate.trim() || 'Untitled note';
}

async function generateEntryTitle(text) {
  if (!text) {
    return 'Untitled note';
  }
  const fallback = compactTextForTitle(text);
  const client = getOpenAIClient();
  if (!client) {
    return fallback;
  }
  const systemPrompt = [
    'You are a concise title generator.',
    'Craft a short descriptive title (max 60 characters) for the following transcript.',
    'Do not mention the phrase "title" or the request context.',
  ].join(' ');
  const userPrompt = [
    `Language: ${settings.language || 'fr'}.`,
    'Transcript:',
    text,
  ].join('\n');

  try {
    const response = await executeOpenAICall({
      label: 'chat.completions.title',
      timeoutMs: 12000,
      action: () => client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    const candidate = response?.choices?.[0]?.message?.content?.trim();
    if (!candidate) {
      return fallback;
    }
    return candidate.split('\n')[0].trim().slice(0, 80) || fallback;
  } catch (error) {
    console.warn('Title generation failed:', error);
    return fallback;
  }
}

async function getActiveStylePrompt() {
  if (!store) {
    return '';
  }
  const styles = await store.listStyles();
  if (!styles.length) {
    return '';
  }
  const activeId = settings.activeStyleId;
  const active = styles.find((style) => style.id === activeId) || styles[0];
  if (active && active.id !== settings.activeStyleId) {
    await setSettingValue('activeStyleId', active.id);
  }
  return active.prompt;
}

async function ensureDefaultStyle() {
  if (!store) {
    return;
  }
  const styles = await store.listStyles();
  const stylesByName = new Map(styles.map((style) => [style.name, style]));
  const existingNames = new Set(stylesByName.keys());
  const now = new Date().toISOString();
  const legacyPrompts = {
    Default: [
      'Supprimer les "euh", hesitations et repetitions.',
      'Supprimer les guillemets parasites.',
      'Corriger la ponctuation (virgules, points, questions).',
      'Corriger l orthographe, la grammaire et la syntaxe.',
      'Ajouter des retours a la ligne naturels.',
      'Preserver strictement le sens original.',
      'Ne pas resumer, ne pas ajouter de contenu.',
    ].join(' '),
    Casual: [
      'Style naturel, simple, conversationnel.',
      'Ponctuation legere.',
      'Preserver strictement le sens original.',
      'Ne pas resumer, ne pas ajouter de contenu.',

    ].join(' '),
    Formel: [
      'Style professionnel et structure.',
      'Phrases completes, ponctuation soignee.',
      'Vocabulaire precis, ton poli.',
      'Preserver strictement le sens original.',
      'Ne pas resumer, ne pas ajouter de contenu.',

    ].join(' '),
    Croco: [
      'Style naturel, simple, conversationnel.',
      'Metaphores fun & audacieuses et analogies contre-intuitives dans le style de Rory Sutherland.',
      'Preserver strictement le sens original.',
      'Ne pas resumer, ne pas ajouter de contenu.',
    ].join(' '),
  };
  const presets = [
    {
      name: 'Default',
      prompt: [
        'Corriger l orthographe, la grammaire et la ponctuation.',
        'Ponctuation naturelle, sans mots de commande (virgule, point, question).',
        'Supprimer les scories de langage (euh, hesitations, repetitions).',
        'Ajouter des retours a la ligne naturels.',
        'Rester au plus pres du texte dicte (pas de reformulation).',
        'Ne pas ajouter de faits ni de contenu nouveau.',
      ].join(' '),
    },
    {
      name: 'Casual',
      prompt: [
        'Style naturel, simple, conversationnel.',
        'Reecriture legere autorisee pour rendre le texte plus fluide.',
        'Ponctuation legere, vocabulaire simple.',
        'Ponctuation naturelle, sans mots de commande (virgule, point, question).',
        'Conserver le sens et les faits, ne pas inventer.',
        'Ne pas resumer.',

      ].join(' '),
    },
    {
      name: 'Formel',
      prompt: [
        'Style professionnel et structure.',
        'Reecriture legere autorisee pour clarifier et structurer.',
        'Phrases completes, ponctuation soignee, vocabulaire precis.',
        'Ponctuation naturelle, sans mots de commande (virgule, point, question).',
        'Conserver le sens et les faits, ne pas inventer.',
        'Ne pas resumer.',

      ].join(' '),
    },
    {
      name: 'Croco',
      prompt: [
        'Style direct, vivant et percutant.',
        'Reecriture plus libre autorisee tant que le sens est conserve.',
        'Ajouter au plus une metaphore courte ou une analogie creative si naturel.',
        'Ponctuation naturelle, sans mots de commande (virgule, point, question).',
        'Ne pas inventer de faits, ne pas resumer.',
      ].join(' '),
    },
  ];

  for (const preset of presets) {
    if (existingNames.has(preset.name)) {
      const existing = stylesByName.get(preset.name);
      const legacyPrompt = legacyPrompts[preset.name];
      if (existing && legacyPrompt && existing.prompt && existing.prompt.trim() === legacyPrompt.trim()) {
        await store.upsertStyle({
          id: existing.id,
          user_id: existing.user_id || null,
          name: existing.name,
          prompt: preset.prompt,
          created_at: existing.created_at || now,
          updated_at: now,
        });
      }
      continue;
    }
    await store.upsertStyle({
      id: crypto.randomUUID(),
      name: preset.name,
      prompt: preset.prompt,
      created_at: now,
      updated_at: now,
    });
  }

  if (!settings.activeStyleId) {
    const nextStyles = await store.listStyles();
    const defaultStyle = nextStyles.find((style) => style.name === 'Default') || nextStyles[0];
    if (defaultStyle) {
      await setSettingValue('activeStyleId', defaultStyle.id);
    }
  }
}

function getWidgetDisplay() {
  if (!screen) {
    return null;
  }
  const cursorPoint = screen.getCursorScreenPoint();
  return screen.getDisplayNearestPoint(cursorPoint) || screen.getPrimaryDisplay();
}

function setMainWindowBounds(targetSize, displayOverride = null) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  const display = displayOverride || getWidgetDisplay() || screen.getPrimaryDisplay();
  const workArea = display.workArea || { x: 0, y: 0, width: display.size.width, height: display.size.height };
  const x = Math.floor(workArea.x + (workArea.width - targetSize.width) / 2);
  const y = Math.floor(workArea.y + workArea.height - targetSize.height - WIDGET_BOTTOM_MARGIN);
  mainWindow.setBounds({ x, y, width: targetSize.width, height: targetSize.height });
  widgetDisplayId = display.id;
}

function updateWidgetBounds() {
  const isActiveRecording = recordingState === RecordingState.RECORDING
    || recordingState === RecordingState.PROCESSING;
  const baseSize = isActiveRecording ? recordingWindowSize : compactWindowSize;
  const targetSize = widgetUndoVisible
    ? undoWindowSize
    : (widgetErrorVisible ? errorWindowSize : (widgetExpanded ? expandedWindowSize : baseSize));
  const display = getWidgetDisplay();
  if (display && widgetExpanded) {
    const maxWidth = Math.max(compactWindowSize.width, display.workArea.width - 20);
    const clampedWidth = Math.min(targetSize.width, maxWidth);
    setMainWindowBounds({ width: clampedWidth, height: targetSize.height }, display);
    return;
  }
  setMainWindowBounds(targetSize, display);
}

function startWidgetDisplayTracking() {
  if (widgetDisplayPoll) {
    return;
  }
  widgetDisplayPoll = setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return;
    }
    const display = getWidgetDisplay();
    if (!display) {
      return;
    }
    if (widgetDisplayId !== display.id) {
      updateWidgetBounds();
    }
  }, WIDGET_DISPLAY_POLL_MS);
}

function ensureDashboardWindow() {
  createDashboardWindow();
}

function isExternalUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:';
  } catch {
    return false;
  }
}

function attachExternalNavigationGuards(targetWindow) {
  if (!targetWindow) {
    return;
  }
  const { webContents } = targetWindow;
  webContents.setWindowOpenHandler(({ url }) => {
    if (isExternalUrl(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
  webContents.on('will-navigate', (event, url) => {
    if (isExternalUrl(url)) {
      event.preventDefault();
      shell.openExternal(url);
      return;
    }
    if (!url.startsWith('file://')) {
      event.preventDefault();
    }
  });
}

function isWidgetTemporarilyHidden() {
  return typeof widgetHiddenUntil === 'number' && widgetHiddenUntil > Date.now();
}

function clearWidgetHideTimer() {
  if (widgetHideTimer) {
    clearTimeout(widgetHideTimer);
    widgetHideTimer = null;
  }
}

function scheduleWidgetShow() {
  if (!widgetHiddenUntil) {
    clearWidgetHideTimer();
    return;
  }
  clearWidgetHideTimer();
  const delay = Math.max(0, widgetHiddenUntil - Date.now());
  widgetHideTimer = setTimeout(() => {
    widgetHideTimer = null;
    if (!mainWindow || mainWindow.isDestroyed()) {
      widgetHiddenUntil = null;
      return;
    }
    if (isWidgetTemporarilyHidden()) {
      scheduleWidgetShow();
      return;
    }
    widgetHiddenUntil = null;
    if (canAccessPremium()) {
      mainWindow.show();
    }
  }, delay);
}

function updateWindowVisibility() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  if (canAccessPremium()) {
    if (isWidgetTemporarilyHidden()) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      }
      hideWidgetContextOverlay();
      return;
    }
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
    return;
  }
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  }
  hideWidgetContextOverlay();
  ensureDashboardWindow();
}

function createMainWindow() {
  const appRoot = app.getAppPath();
  mainWindow = new BrowserWindow({
    show: false,
    width: compactWindowSize.width,
    height: compactWindowSize.height,
    title: '',
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    focusable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadFile(path.join(appRoot, 'index.html'));
  mainWindow.setBackgroundColor('#00000000');
  mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  attachExternalNavigationGuards(mainWindow);

  updateWidgetBounds();

  mainWindow.webContents.on('did-finish-load', () => {
    broadcastAuthState();
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

}

function createDashboardWindow() {
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.show();
    dashboardWindow.focus();
    return;
  }

  dashboardWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    backgroundColor: '#ffffff',
    resizable: true,
    alwaysOnTop: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  dashboardWindow.setMenu(null);

  dashboardWindow.loadFile('dashboard.html');
  attachExternalNavigationGuards(dashboardWindow);
  dashboardWindow.webContents.on('did-finish-load', () => {
    broadcastAuthState();
  });
  dashboardWindow.on('closed', () => {
    dashboardWindow = null;
  });
}

function sendDashboardEvent(channel, ...args) {
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.webContents.send(channel, ...args);
  }
}

function sendWidgetEvent(channel, ...args) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, ...args);
  }
}

function getVirtualScreenBounds() {
  const displays = screen.getAllDisplays();
  if (!displays.length) {
    return screen.getPrimaryDisplay().bounds;
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  displays.forEach((display) => {
    const { x, y, width, height } = display.bounds;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function getDisplayBounds(display) {
  if (!display) {
    return screen.getPrimaryDisplay().bounds;
  }
  return display.bounds;
}

function createWidgetOverlayWindow() {
  if (widgetOverlayWindow && !widgetOverlayWindow.isDestroyed()) {
    return widgetOverlayWindow;
  }
  const appRoot = app.getAppPath();
  widgetOverlayWindow = new BrowserWindow({
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000001',
    resizable: false,
    movable: false,
    fullscreenable: false,
    skipTaskbar: true,
    focusable: false,
    hasShadow: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  widgetOverlayWindow.loadFile(path.join(appRoot, 'widget-overlay.html'));
  widgetOverlayWindow.setAlwaysOnTop(true, 'screen-saver', 0);
  widgetOverlayWindow.setIgnoreMouseEvents(true, { forward: true });
  widgetOverlayWindow.setFullScreenable(false);
  widgetOverlayWindow.on('closed', () => {
    widgetOverlayWindow = null;
    widgetContextMenuOpen = false;
    widgetOverlayBounds = null;
    widgetOverlayDisplayId = null;
    if (widgetOverlayMoveInterval) {
      clearInterval(widgetOverlayMoveInterval);
      widgetOverlayMoveInterval = null;
    }
  });
  return widgetOverlayWindow;
}

function updateWidgetOverlayBounds(force = false) {
  if (!widgetOverlayWindow || widgetOverlayWindow.isDestroyed()) {
    return;
  }
  const display = getWidgetDisplay() || screen.getPrimaryDisplay();
  const bounds = getDisplayBounds(display);
  const nextBounds = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };
  if (!force && widgetOverlayBounds
    && widgetOverlayBounds.x === nextBounds.x
    && widgetOverlayBounds.y === nextBounds.y
    && widgetOverlayBounds.width === nextBounds.width
    && widgetOverlayBounds.height === nextBounds.height
    && widgetOverlayDisplayId === display.id) {
    return;
  }
  widgetOverlayBounds = nextBounds;
  widgetOverlayDisplayId = display.id;
  widgetOverlayWindow.setBounds(nextBounds, false);
}

function startWidgetOverlayTracking() {
  if (widgetOverlayMoveInterval) {
    return;
  }
  widgetOverlayMoveInterval = setInterval(() => {
    if (!widgetContextMenuOpen) {
      hideWidgetContextOverlay();
      return;
    }
    updateWidgetOverlayBounds();
  }, 400);
}

function stopWidgetOverlayTracking() {
  if (!widgetOverlayMoveInterval) {
    return;
  }
  clearInterval(widgetOverlayMoveInterval);
  widgetOverlayMoveInterval = null;
}

function showWidgetContextOverlay() {
  if (widgetContextMenuOpen || isWidgetTemporarilyHidden()) {
    return;
  }
  const overlayWindow = createWidgetOverlayWindow();
  updateWidgetOverlayBounds(true);
  overlayWindow.setAlwaysOnTop(true, 'screen-saver', 0);
  overlayWindow.setIgnoreMouseEvents(false);
  overlayWindow.showInactive();
  widgetContextMenuOpen = true;
  startWidgetOverlayTracking();
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    mainWindow.showInactive();
    mainWindow.moveTop();
  }
}

function hideWidgetContextOverlay() {
  const overlayVisible = widgetOverlayWindow && !widgetOverlayWindow.isDestroyed()
    && widgetOverlayWindow.isVisible();
  if (!widgetContextMenuOpen && !overlayVisible) {
    return;
  }
  widgetContextMenuOpen = false;
  stopWidgetOverlayTracking();
  if (!widgetOverlayWindow || widgetOverlayWindow.isDestroyed()) {
    return;
  }
  widgetOverlayWindow.setIgnoreMouseEvents(true, { forward: true });
  widgetOverlayWindow.hide();
  widgetOverlayWindow.setAlwaysOnTop(false);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    if (!isWidgetTemporarilyHidden()) {
      mainWindow.showInactive();
      mainWindow.moveTop();
    }
  }
}

function createTrayMenuWindow() {
  if (trayMenuWindow && !trayMenuWindow.isDestroyed()) {
    return trayMenuWindow;
  }
  const appRoot = app.getAppPath();
  trayMenuWindow = new BrowserWindow({
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    fullscreenable: false,
    skipTaskbar: true,
    focusable: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  trayMenuWindow.loadFile(path.join(appRoot, 'tray-menu.html'));
  trayMenuWindow.setIgnoreMouseEvents(true, { forward: true });
  trayMenuWindow.on('closed', () => {
    trayMenuWindow = null;
    trayMenuOpen = false;
    setTrayHoverState(false);
  });
  return trayMenuWindow;
}

function setTrayHoverState(active) {
  if (!tray || !trayIconDefault) {
    return;
  }
  tray.setImage(active && trayIconHover ? trayIconHover : trayIconDefault);
}

function sendTrayMenuData() {
  if (trayMenuWindow && !trayMenuWindow.isDestroyed()) {
    trayMenuWindow.webContents.send('tray-menu:data', {
      isRecording,
    });
  }
}

function showTrayMenu() {
  if (!tray) {
    return;
  }
  const menuWindow = createTrayMenuWindow();
  const bounds = getVirtualScreenBounds();
  const trayBounds = tray.getBounds();
  menuWindow.setBounds(bounds, false);
  menuWindow.setAlwaysOnTop(true, 'screen-saver');
  menuWindow.setIgnoreMouseEvents(false);
  menuWindow.showInactive();
  trayMenuOpen = true;
  setTrayHoverState(true);
  const payload = { trayBounds, windowBounds: bounds };
  if (menuWindow.webContents.isLoading()) {
    menuWindow.webContents.once('did-finish-load', () => {
      if (trayMenuWindow && !trayMenuWindow.isDestroyed()) {
        trayMenuWindow.webContents.send('tray-menu:open', payload);
        sendTrayMenuData();
      }
    });
  } else {
    menuWindow.webContents.send('tray-menu:open', payload);
    sendTrayMenuData();
  }
}

function hideTrayMenu() {
  trayMenuOpen = false;
  setTrayHoverState(false);
  if (!trayMenuWindow || trayMenuWindow.isDestroyed()) {
    return;
  }
  trayMenuWindow.setIgnoreMouseEvents(true, { forward: true });
  trayMenuWindow.hide();
  trayMenuWindow.setAlwaysOnTop(false);
}

function buildTrayMenu() {
  const startStopLabel = isRecording ? 'Stop Dictation' : 'Start Dictation';
  return Menu.buildFromTemplate([
    { label: 'CrocoVoice', enabled: false },
    { type: 'separator' },
    {
      label: startStopLabel,
      click: () => {
        if (!isRecording) {
          startRecording();
        } else {
          stopRecording();
        }
      },
    },
    {
      label: 'Settings',
      click: () => {
        createDashboardWindow();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit CrocoVoice',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);
}

function updateTrayMenu() {
  if (!tray) {
    return null;
  }
  const menu = buildTrayMenu();
  tray.setContextMenu(menu);
  sendTrayMenuData();
  return menu;
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
  const legacyIconPath = path.join(__dirname, 'assets', 'Logo CrocoVoice (tray).png');
  const hoverIconPath = path.join(__dirname, 'assets', 'tray-icon-hover.png');

  if (fs.existsSync(iconPath)) {
    trayIconDefault = nativeImage.createFromPath(iconPath);
  } else if (fs.existsSync(legacyIconPath)) {
    trayIconDefault = nativeImage.createFromPath(legacyIconPath);
  } else {
    trayIconDefault = nativeImage.createEmpty();
  }
  if (fs.existsSync(hoverIconPath)) {
    trayIconHover = nativeImage.createFromPath(hoverIconPath);
  } else {
    trayIconHover = trayIconDefault;
  }

  tray = new Tray(trayIconDefault);

  tray.setToolTip('CrocoVoice');
  updateTrayMenu();

  tray.on('click', () => {
    if (trayMenuOpen) {
      hideTrayMenu();
      return;
    }
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  tray.on('right-click', () => {
    if (trayMenuOpen) {
      hideTrayMenu();
      return;
    }
    updateTrayMenu();
    showTrayMenu();
  });

  tray.on('double-click', () => {
    if (canAccessPremium()) {
      mainWindow.show();
    } else {
      ensureDashboardWindow();
    }
  });
}

function registerGlobalShortcut(shortcut) {
  if (!shortcut) {
    return false;
  }

  if (currentShortcut) {
    globalShortcut.unregister(currentShortcut);
  }

  const ret = globalShortcut.register(shortcut, () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  if (!ret) {
    console.error(`Failed to register global shortcut: ${shortcut}`);
    return false;
  } else {
    currentShortcut = shortcut;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('shortcut-updated', shortcut);
    }
    if (dashboardWindow && !dashboardWindow.isDestroyed()) {
      dashboardWindow.webContents.send('shortcut-updated', shortcut);
    }
    return true;
  }
}

function hideWidgetFor(ms) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  widgetHiddenUntil = Date.now() + ms;
  clearWidgetHideTimer();
  mainWindow.hide();
  hideWidgetContextOverlay();
  scheduleWidgetShow();
}

async function startRecording() {
  if (!canAccessPremium()) {
    notifyAuthRequired('Connexion requise pour utiliser CrocoVoice.');
    return;
  }
  if (transitionLock || shouldDebounceAction('start')) {
    refreshRendererState();
    return;
  }
  if (recordingState !== RecordingState.IDLE) {
    refreshRendererState();
    return;
  }

  transitionLock = true;
  try {
    const quotaAllowed = await ensureQuotaAvailable();
    if (!quotaAllowed) {
      return;
    }
    clearIdleResetTimeout();
    clearProcessingTimeout();
    recordingStartTime = Date.now();
    setRecordingState(recordingStateReducer(recordingState, 'start'));

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('start-recording');
    }
  } catch (error) {
    console.error('Failed to start recording:', error);
    setRecordingState(RecordingState.ERROR, error?.message || 'Erreur de demarrage.');
    scheduleReturnToIdle(3000);
  } finally {
    transitionLock = false;
    refreshRendererState();
  }
}

async function stopRecording() {
  if (transitionLock || shouldDebounceAction('stop')) {
    refreshRendererState();
    return;
  }
  if (recordingState !== RecordingState.RECORDING) {
    refreshRendererState();
    return;
  }

  transitionLock = true;
  try {
    clearIdleResetTimeout();
    await captureTypingTarget();
    const recordingDuration = recordingStartTime ? Date.now() - recordingStartTime : 0;

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('stop-recording');
    }
    setRecordingState(recordingStateReducer(recordingState, 'stop'));
    armProcessingTimeout();

    return recordingDuration;
  } catch (error) {
    console.error('Failed to stop recording:', error);
    setRecordingState(RecordingState.ERROR, error?.message || 'Erreur lors de l\'arret.');
    scheduleReturnToIdle(3000);
    return 0;
  } finally {
    transitionLock = false;
    refreshRendererState();
  }
}

function getAudioExtension(mimeType) {
  if (!mimeType) {
    return 'webm';
  }

  const normalized = mimeType.split(';')[0].trim().toLowerCase();
  switch (normalized) {
    case 'audio/webm':
      return 'webm';
    case 'audio/ogg':
      return 'ogg';
    case 'audio/oga':
      return 'oga';
    case 'audio/wav':
    case 'audio/x-wav':
      return 'wav';
    case 'audio/mpeg':
      return 'mp3';
    case 'audio/mp4':
    case 'audio/x-m4a':
      return 'm4a';
    default:
      return 'webm';
  }
}

async function transcribeAudio(audioBuffer, mimeType) {
  let tempFilePath = '';
  try {
    const client = getOpenAIClient();
    if (!client) {
      const error = new Error('OpenAI API key missing.');
      error.code = 'missing_api_key';
      throw error;
    }

    const startedAt = Date.now();

    const tempDir = require('os').tmpdir();
    const extension = getAudioExtension(mimeType);
    tempFilePath = path.join(tempDir, `recording-${Date.now()}.${extension}`);

    fs.writeFileSync(tempFilePath, audioBuffer);

    const transcription = await executeOpenAICall({
      label: 'audio.transcriptions',
      timeoutMs: OPENAI_TRANSCRIBE_TIMEOUT_MS,
      action: () => client.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
        language: settings.language || 'fr',
      }),
    });
    lastNetworkLatencyMs = Date.now() - startedAt;

    const transcribedText = transcription.text.trim();

    return transcribedText;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}

async function triggerPasteShortcut() {
  if (useRobotjs) {
    const modifier = process.platform === 'darwin' ? 'command' : 'control';
    keyboardLib.keyTap('v', modifier);
    return;
  }

  if (!nutKey) {
    throw new Error('Keyboard keys unavailable');
  }

  const modifierKey = process.platform === 'darwin' ? nutKey.LeftCmd : nutKey.LeftControl;
  await keyboardLib.pressKey(modifierKey, nutKey.V);
  await keyboardLib.releaseKey(modifierKey, nutKey.V);
}

async function pasteText(text, options = {}) {
  const runPaste = async () => {
    let previousClipboard = '';
    let restoreClipboard = true;
    const mode = options.mode || 'paste';
    const shouldPaste = mode !== 'clipboard';
    const allowTargetChange = options.allowTargetChange !== false;
    try {
      if (!keyboardLib && shouldPaste) {
        throw new Error('Keyboard automation unavailable.');
      }
      if (!text) {
        return;
      }
      if (shouldPaste) {
        await assertTypingTargetStillActive({ allowMismatch: allowTargetChange });
      }
      previousClipboard = clipboard.readText();
      pendingPasteBuffer = text;

      await new Promise((resolve) => setTimeout(resolve, 300));
      clipboard.writeText(pendingPasteBuffer);
      if (shouldPaste) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        await triggerPasteShortcut();
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      lastDelivery = {
        mode,
        status: 'ok',
        message: '',
        at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Paste error:', error);
      restoreClipboard = false;
      const baseMessage = error?.message || 'Echec du collage';
      lastDelivery = {
        mode,
        status: 'error',
        message: baseMessage,
        fallback: 'clipboard',
        at: new Date().toISOString(),
      };
      recordDiagnosticEvent('delivery_error', lastDelivery.message);
      throw new Error(`${baseMessage} Texte conservé dans le presse-papier.`);
    } finally {
      if (shouldPaste && restoreClipboard && previousClipboard !== null && previousClipboard !== undefined) {
        clipboard.writeText(previousClipboard);
      }
      pendingPasteBuffer = '';
      typingTarget = null;
    }
  };

  const next = pasteMutex.then(runPaste, runPaste);
  pasteMutex = next.catch(() => {});
  return next;
}

// Critical flow: record -> transcribe -> post-process -> snippets -> dictionary -> persist -> type.
// Integration points: OpenAI (transcribe/post-process/title), OS keyboard/clipboard, SQLite store, Supabase sync.
// Manual regression checks: start/stop, transcription, post-process fallback, typing, history entry, sync optional.

function normalizeAudioPayload(audioData) {
  let mimeType = '';
  let payload = audioData;
  let warningMessage = '';
  let micDevice = null;
  let audioDiagnostics = null;
  let audioQualityClass = null;

  if (audioData && typeof audioData === 'object' && audioData.buffer) {
    payload = audioData.buffer;
    if (typeof audioData.mimeType === 'string') {
      mimeType = audioData.mimeType;
    }
    if (typeof audioData.warningMessage === 'string') {
      warningMessage = audioData.warningMessage;
    }
    if (typeof audioData.micDevice === 'string') {
      micDevice = audioData.micDevice;
    }
    if (audioData.audioDiagnostics && typeof audioData.audioDiagnostics === 'object') {
      audioDiagnostics = audioData.audioDiagnostics;
    }
    if (typeof audioData.audioQualityClass === 'string') {
      audioQualityClass = audioData.audioQualityClass;
    }
  }

  let buffer;
  if (Buffer.isBuffer(payload)) {
    buffer = payload;
  } else if (payload instanceof ArrayBuffer) {
    buffer = Buffer.from(payload);
  } else if (Array.isArray(payload)) {
    buffer = Buffer.from(payload);
  } else {
    buffer = Buffer.from(payload);
  }

  return { buffer, mimeType, warningMessage, micDevice, audioDiagnostics, audioQualityClass };
}

function shouldAttemptLocalEnhancement(qualityClass) {
  if (settings.localEnhancementEnabled !== true || !isFeatureEnabled('audioEnhancement')) {
    return false;
  }
  if (!qualityClass) {
    return false;
  }
  return qualityClass === 'noisy' || qualityClass === 'degraded';
}

function isSystemUnderLoad() {
  const load = os.loadavg?.()[0] || 0;
  return load >= 3;
}

async function runLocalEnhancement(buffer, mimeType) {
  const command = typeof settings.localEnhancementCommand === 'string'
    ? settings.localEnhancementCommand.trim()
    : '';
  if (!command) {
    return { buffer, enhanced: false, reason: 'enhancer_missing' };
  }
  if (isSystemUnderLoad()) {
    return { buffer, enhanced: false, reason: 'enhancer_skipped_load' };
  }
  const maxDurationMs = Number.isFinite(settings.localEnhancementMaxDurationMs)
    ? settings.localEnhancementMaxDurationMs
    : defaultSettings.localEnhancementMaxDurationMs;
  const tempDir = os.tmpdir();
  const extension = getAudioExtension(mimeType);
  const inputPath = path.join(tempDir, `crocovoice-enhance-in-${Date.now()}.${extension}`);
  const outputPath = path.join(tempDir, `crocovoice-enhance-out-${Date.now()}.${extension}`);
  try {
    fs.writeFileSync(inputPath, buffer);
    await new Promise((resolve, reject) => {
      const child = execFile(command, [inputPath, outputPath], { timeout: maxDurationMs }, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
      child.on('error', reject);
    });
    if (!fs.existsSync(outputPath)) {
      return { buffer, enhanced: false, reason: 'enhancer_no_output' };
    }
    const enhancedBuffer = fs.readFileSync(outputPath);
    return { buffer: enhancedBuffer, enhanced: true, reason: null };
  } catch (error) {
    console.warn('Local enhancement failed:', error);
    return { buffer, enhanced: false, reason: 'enhancer_failed' };
  } finally {
    if (inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    if (outputPath && fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
}

async function runLocalAsrServer(buffer, mimeType, endpoint, maxDurationMs) {
  if (!endpoint) {
    return { text: '', used: false, reason: 'local_asr_missing_endpoint' };
  }
  if (typeof fetch !== 'function') {
    return { text: '', used: false, reason: 'local_asr_fetch_unavailable' };
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), maxDurationMs || 60000);
  try {
    const headers = {
      'Content-Type': 'application/octet-stream',
    };
    if (mimeType) {
      headers['X-Audio-Mime'] = mimeType;
    }
    if (settings.language) {
      headers['X-Language'] = settings.language;
    }
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: buffer,
      signal: controller.signal,
    });
    if (!response.ok) {
      return { text: '', used: false, reason: `local_asr_http_${response.status}` };
    }
    const contentType = response.headers.get('content-type') || '';
    let text = '';
    if (contentType.includes('application/json')) {
      const payload = await response.json();
      text = String(payload?.text || payload?.transcript || '').trim();
    } else {
      text = String(await response.text()).trim();
    }
    if (!text) {
      return { text: '', used: false, reason: 'local_asr_empty' };
    }
    return { text, used: true, reason: null };
  } catch (error) {
    const reason = error?.name === 'AbortError' ? 'local_asr_timeout' : 'local_asr_failed';
    console.warn('Local ASR server failed:', error);
    return { text: '', used: false, reason };
  } finally {
    clearTimeout(timeoutId);
  }
}

function isLocalAsrAllowed(scope) {
  const scopeSetting = typeof settings.localAsrScope === 'string'
    ? settings.localAsrScope.trim().toLowerCase()
    : '';
  if (!scopeSetting || scopeSetting === 'both' || scopeSetting === 'all') {
    return true;
  }
  if (scopeSetting === 'uploads' || scopeSetting === 'upload') {
    return scope === 'upload';
  }
  if (scopeSetting === 'dictation' || scopeSetting === 'dictations') {
    return scope === 'dictation';
  }
  return true;
}

async function runLocalAsr(buffer, mimeType, options = {}) {
  const enabled = settings.localAsrEnabled === true;
  if (!enabled || !isFeatureEnabled('localAsr')) {
    return { text: '', used: false, reason: 'local_asr_disabled' };
  }
  const scope = options.scope === 'upload' ? 'upload' : 'dictation';
  if (!isLocalAsrAllowed(scope)) {
    return { text: '', used: false, reason: 'local_asr_scope_blocked' };
  }
  const maxDurationMs = Number.isFinite(settings.localAsrMaxDurationMs)
    ? settings.localAsrMaxDurationMs
    : defaultSettings.localAsrMaxDurationMs;
  const mode = typeof settings.localAsrMode === 'string'
    ? settings.localAsrMode.trim().toLowerCase()
    : '';
  const endpoint = typeof settings.localAsrEndpoint === 'string'
    ? settings.localAsrEndpoint.trim()
    : '';
  if (mode === 'server' || endpoint) {
    return runLocalAsrServer(buffer, mimeType, endpoint, maxDurationMs);
  }
  const command = typeof settings.localAsrCommand === 'string'
    ? settings.localAsrCommand.trim()
    : '';
  if (!command) {
    return { text: '', used: false, reason: 'local_asr_missing_command' };
  }
  const tempDir = os.tmpdir();
  const extension = getAudioExtension(mimeType);
  const inputPath = path.join(tempDir, `crocovoice-localasr-${Date.now()}.${extension}`);
  try {
    fs.writeFileSync(inputPath, buffer);
    const output = await new Promise((resolve, reject) => {
      const child = execFile(command, [inputPath], { timeout: maxDurationMs }, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout || '');
      });
      child.on('error', reject);
    });
    const text = String(output).trim();
    if (!text) {
      return { text: '', used: false, reason: 'local_asr_empty' };
    }
    return { text, used: true, reason: null };
  } catch (error) {
    console.warn('Local ASR failed:', error);
    return { text: '', used: false, reason: 'local_asr_failed' };
  } finally {
    if (inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
  }
}

async function runTextPipeline(transcribedText) {
  if (!transcribedText || isNoAudioTranscription(transcribedText)) {
    return { skip: true, transcribedText: '' };
  }

  const contextState = await getContextStateCached();
  const contextSettings = getContextSettings();
  const useContextForPostProcess = Boolean(
    contextSettings.postProcessEnabled && contextState?.enabled && contextState?.payload,
  );
  const contextHint = useContextForPostProcess
    ? buildPostProcessContextHints(contextState.payload)
    : '';
  const stylePrompt = await getActiveStylePrompt();
  let editedText = transcribedText;
  let warningMessage = '';
  try {
    editedText = await postProcessText(transcribedText, stylePrompt, contextHint);
  } catch (error) {
    if (error?.code === 'missing_api_key') {
      warningMessage = 'Post-traitement ignore: OPENAI_API_KEY manquante.';
    } else {
      warningMessage = getOpenAIUserMessage(error);
    }
    console.warn('Post-processing failed, using raw transcript.');
  }

  let formattedText = editedText;
  if (contextState.enabled && contextState.profile) {
    formattedText = applyAdaptiveFormatting(editedText, contextState.profile);
  }
  formattedText = applyDictatedListFormatting(formattedText);
  const snippetText = await applySnippets(formattedText);
  const finalText = await applyDictionary(snippetText);
  const title = await generateEntryTitle(finalText);
  return {
    skip: false,
    transcribedText,
    formattedText,
    finalText,
    title,
    divergenceScore: computeDivergenceScore(transcribedText, formattedText),
    contextState,
    warningMessage,
  };
}

function resolveRecordingTarget() {
  const target = recordingDestination || 'clipboard';
  recordingDestination = 'clipboard';
  return target;
}

async function runTranscriptionPipeline(buffer, mimeType, diagnostics = null, qualityClass = null) {
  lastNetworkLatencyMs = null;
  lastFallbackReason = null;
  lastTranscriptionPath = 'cloud';
  let inputBuffer = buffer;
  let enhancementReason = null;
  if (shouldAttemptLocalEnhancement(qualityClass)) {
    const enhancement = await runLocalEnhancement(buffer, mimeType);
    inputBuffer = enhancement.buffer;
    if (!enhancement.enhanced) {
      enhancementReason = enhancement.reason;
    }
  }
  if (enhancementReason) {
    recordDiagnosticEvent('audio_enhancement_skipped', enhancementReason);
  }
  const localAsr = await runLocalAsr(inputBuffer, mimeType, { scope: 'dictation' });
  let transcribedText = '';
  if (localAsr.used) {
    lastTranscriptionPath = 'local';
    transcribedText = localAsr.text;
  } else {
    if (localAsr.reason && localAsr.reason !== 'local_asr_disabled') {
      lastFallbackReason = localAsr.reason;
    }
    transcribedText = await transcribeAudio(inputBuffer, mimeType);
  }
  if (!transcribedText || isNoAudioTranscription(transcribedText)) {
    return { skip: true, transcribedText: '' };
  }

  const contextState = await getContextStateCached();
  const contextSettings = getContextSettings();
  const useContextForPostProcess = Boolean(
    contextSettings.postProcessEnabled && contextState?.enabled && contextState?.payload,
  );
  const contextHint = useContextForPostProcess
    ? buildPostProcessContextHints(contextState.payload)
    : '';
  const stylePrompt = await getActiveStylePrompt();
  let editedText = transcribedText;
  let warningMessage = '';
  try {
    editedText = await postProcessText(transcribedText, stylePrompt, contextHint);
  } catch (error) {
    if (error?.code === 'missing_api_key') {
      warningMessage = 'Post-traitement ignore: OPENAI_API_KEY manquante.';
    } else {
      warningMessage = getOpenAIUserMessage(error);
    }
    console.warn('Post-processing failed, using raw transcript.');
  }

  let formattedText = editedText;
  if (contextState.enabled && contextState.profile) {
    formattedText = applyAdaptiveFormatting(editedText, contextState.profile);
  }
  formattedText = applyDictatedListFormatting(formattedText);
  const snippetText = await applySnippets(formattedText);
  const finalText = await applyDictionary(snippetText);
  const title = await generateEntryTitle(finalText);
  return {
    skip: false,
    transcribedText,
    formattedText,
    finalText,
    title,
    divergenceScore: computeDivergenceScore(transcribedText, formattedText),
    contextState,
    warningMessage,
  };
}

async function persistTranscription({
  transcribedText,
  formattedText,
  finalText,
  title,
  latencyMs,
  networkLatencyMs,
  divergenceScore,
  micDevice,
  fallbackPath,
  fallbackReason,
  transcriptionPath,
  audioDiagnostics,
  audioQualityClass,
  contextPayload,
}) {
  if (!store) {
    return;
  }
  const userId = syncService && syncService.getUser() ? syncService.getUser().id : null;
  const metricsEnabled = settings.metricsEnabled !== false;
  const diagnosticsEnabled = settings.audioDiagnosticsEnabled !== false;
  await store.addHistory({
    id: crypto.randomUUID(),
    user_id: userId,
    text: finalText,
    raw_text: transcribedText,
    formatted_text: formattedText || null,
    edited_text: finalText || null,
    context_json: contextPayload ? JSON.stringify(contextPayload) : null,
    language: settings.language || 'fr',
    duration_ms: recordingStartTime ? Date.now() - recordingStartTime : null,
    latency_ms: metricsEnabled ? latencyMs : null,
    network_latency_ms: metricsEnabled ? networkLatencyMs : null,
    divergence_score: metricsEnabled ? divergenceScore : null,
    mic_device: metricsEnabled ? micDevice : null,
    fallback_path: metricsEnabled ? fallbackPath : null,
    fallback_reason: metricsEnabled ? fallbackReason : null,
    transcription_path: metricsEnabled ? transcriptionPath : null,
    audio_diagnostics_json: metricsEnabled && diagnosticsEnabled && audioDiagnostics
      ? JSON.stringify(audioDiagnostics)
      : null,
    audio_quality_class: metricsEnabled && diagnosticsEnabled ? audioQualityClass : null,
    title,
  });
  await recordTelemetryEvent('dictation_metrics', {
    latency_ms: metricsEnabled ? latencyMs : null,
    network_latency_ms: metricsEnabled ? networkLatencyMs : null,
    divergence_score: metricsEnabled ? divergenceScore : null,
    mic_device: metricsEnabled ? micDevice : null,
    fallback_path: metricsEnabled ? fallbackPath : null,
    fallback_reason: metricsEnabled ? fallbackReason : null,
    transcription_path: metricsEnabled ? transcriptionPath : null,
    audio_quality_class: metricsEnabled ? audioQualityClass : null,
  });
  await store.setSetting('last_transcription', finalText);
  sendDashboardEvent('dashboard:data-updated');
  scheduleDebouncedSync();
  await incrementQuotaUsage(finalText);
}

async function handleAudioPayload(event, audioData) {
  clearIdleResetTimeout();
  clearProcessingTimeout();
  const target = resolveRecordingTarget();
  try {
    if (!OPENAI_API_KEY) {
      const message = 'OPENAI_API_KEY manquante.';
      setRecordingState(RecordingState.ERROR, message);
      setTimeout(() => setRecordingState(RecordingState.IDLE), 3000);
      event.reply('transcription-error', message);
      return;
    }
    const {
      buffer,
      mimeType,
      warningMessage: safetyWarningMessage,
      micDevice,
      audioDiagnostics,
      audioQualityClass,
    } = normalizeAudioPayload(audioData);

    const pipelineResult = await runTranscriptionPipeline(buffer, mimeType, audioDiagnostics, audioQualityClass);
    if (pipelineResult.skip) {
      setRecordingState(RecordingState.ERROR, NO_AUDIO_MESSAGE);
      scheduleReturnToIdle(3000);
      event.reply('transcription-success', '');
      return;
    }

    const {
      transcribedText,
      formattedText,
      finalText,
      title,
      divergenceScore,
      contextState,
      warningMessage: pipelineWarningMessage,
    } = pipelineResult;
    const shouldSkipPaste = target === 'notes' || target === 'notes-editor' || target === 'onboarding';
    const latencyMs = recordingStartTime ? Date.now() - recordingStartTime : null;
    await persistTranscription({
      transcribedText,
      formattedText,
      finalText,
      title,
      latencyMs,
      divergenceScore,
      micDevice: micDevice || settings.microphoneId || null,
      fallbackPath: 'file',
      fallbackReason: lastFallbackReason,
      networkLatencyMs: lastNetworkLatencyMs,
      transcriptionPath: lastTranscriptionPath,
      audioDiagnostics,
      audioQualityClass,
      contextPayload: contextState?.payload || null,
    });
    lastPolishDiff = {
      before: transcribedText || '',
      after: formattedText || finalText || '',
    };
    if (target === 'notes') {
      const userId = syncService && syncService.getUser() ? syncService.getUser().id : null;
      await store.addNote({
        id: crypto.randomUUID(),
        user_id: userId,
        text: finalText,
        title,
        metadata: { source: 'dictation' },
      });
      sendDashboardEvent('dashboard:data-updated');
      scheduleDebouncedSync();
    }

    if (!shouldSkipPaste) {
      await pasteText(finalText, { mode: 'paste', allowTargetChange: true });
    }

    const combinedWarningMessage = [pipelineWarningMessage, safetyWarningMessage].filter(Boolean).join(' ');
    if (combinedWarningMessage) {
      setRecordingState(RecordingState.ERROR, combinedWarningMessage);
      scheduleReturnToIdle(3000);
    } else {
      setRecordingState(RecordingState.IDLE);
    }

    event.reply('transcription-success', finalText);
    sendDashboardEvent('dashboard:transcription-success', finalText, target);
    clearContextCache();
  } catch (error) {
    console.error('Processing error:', error);

    const openAIErrorDetected = !!(
      error?.status
      || error?.response?.status
      || error?.code === 'ETIMEDOUT'
      || error?.code === 'rate_limit_exceeded'
      || error?.code === 'insufficient_quota'
      || error?.code === 'invalid_api_key'
    );
    const defaultMessage = openAIErrorDetected
      ? getOpenAIUserMessage(error)
      : (error?.message || 'Erreur de traitement.');
    const userMessage = error?.code === 'missing_api_key'
      ? 'OPENAI_API_KEY manquante.'
      : defaultMessage;
    setRecordingState(RecordingState.ERROR, userMessage);
    scheduleReturnToIdle(3000);

    event.reply('transcription-error', userMessage);
    sendDashboardEvent('dashboard:transcription-error', userMessage);
    clearContextCache();
  }
}

function getMimeTypeForPath(filePath) {
  if (!filePath) {
    return 'audio/webm';
  }
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.wav':
      return 'audio/wav';
    case '.mp3':
      return 'audio/mpeg';
    case '.m4a':
      return 'audio/x-m4a';
    case '.oga':
    case '.ogg':
      return 'audio/ogg';
    default:
      return 'audio/webm';
  }
}

function getWavDurationMs(buffer) {
  if (!buffer || buffer.length < 44) {
    return null;
  }
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
    return null;
  }
  const numChannels = buffer.readUInt16LE(22);
  const sampleRate = buffer.readUInt32LE(24);
  const bitsPerSample = buffer.readUInt16LE(34);
  let dataOffset = 36;
  let dataSize = null;
  while (dataOffset + 8 <= buffer.length) {
    const chunkId = buffer.toString('ascii', dataOffset, dataOffset + 4);
    const chunkSize = buffer.readUInt32LE(dataOffset + 4);
    if (chunkId === 'data') {
      dataSize = chunkSize;
      break;
    }
    dataOffset += 8 + chunkSize;
  }
  if (!dataSize || !sampleRate || !numChannels || !bitsPerSample) {
    return null;
  }
  const bytesPerSample = bitsPerSample / 8;
  const totalSamples = dataSize / (bytesPerSample * numChannels);
  if (!Number.isFinite(totalSamples) || totalSamples <= 0) {
    return null;
  }
  return Math.round((totalSamples / sampleRate) * 1000);
}

function updateUploadJob(id, patch) {
  const job = uploadJobById.get(id);
  if (!job) {
    return null;
  }
  Object.assign(job, patch, { updatedAt: new Date().toISOString() });
  sendDashboardEvent('dashboard:data-updated');
  return job;
}

function serializeUploadJob(job) {
  if (!job) {
    return null;
  }
  return {
    id: job.id,
    fileName: job.fileName,
    fileSize: job.fileSize,
    status: job.status,
    progress: job.progress || 0,
    error: job.error || null,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

function listUploadJobs() {
  return uploadJobs.map(serializeUploadJob).filter(Boolean);
}

async function processUploadJob(job) {
  const config = getUploadConfig();
  updateUploadJob(job.id, { status: 'processing', progress: 10 });
  let buffer = null;
  try {
    buffer = await fs.promises.readFile(job.filePath);
  } catch (error) {
    updateUploadJob(job.id, { status: 'failed', error: error?.message || 'Lecture fichier impossible.' });
    return;
  }
  if (job.cancelled) {
    updateUploadJob(job.id, { status: 'cancelled' });
    return;
  }

  updateUploadJob(job.id, { status: 'processing', progress: 35 });
  const mimeType = getMimeTypeForPath(job.filePath);
  let transcribedText = '';
  const localAsr = await runLocalAsr(buffer, mimeType, { scope: 'upload' });
  if (localAsr.used) {
    transcribedText = localAsr.text;
  } else if (config.cloudFallback) {
    try {
      transcribedText = await transcribeAudio(buffer, mimeType);
    } catch (error) {
      updateUploadJob(job.id, { status: 'failed', error: error?.message || 'Transcription impossible.' });
      return;
    }
  } else {
    const fallbackHint = 'Activez la transcription locale ou le fallback cloud.';
    const baseReason = localAsr.reason === 'local_asr_disabled'
      ? 'Transcription locale indisponible.'
      : 'Transcription locale en echec.';
    updateUploadJob(job.id, { status: 'failed', error: `${baseReason} ${fallbackHint}` });
    return;
  }
  if (job.cancelled) {
    updateUploadJob(job.id, { status: 'cancelled' });
    return;
  }
  updateUploadJob(job.id, { status: 'processing', progress: 80 });

  const durationMs = mimeType === 'audio/wav' ? getWavDurationMs(buffer) : null;
  const fileMeta = {
    source: 'file_upload',
    file: {
      name: job.fileName,
      size: job.fileSize,
      duration_ms: durationMs,
      path: job.filePath,
    },
  };

  const finalText = transcribedText.trim();
  const title = await generateEntryTitle(finalText || job.fileName);
  const userId = syncService && syncService.getUser() ? syncService.getUser().id : null;
  await store.addNote({
    id: crypto.randomUUID(),
    user_id: userId,
    text: finalText,
    title,
    metadata: fileMeta,
  });
  sendDashboardEvent('dashboard:data-updated');
  scheduleDebouncedSync();
  await incrementQuotaUsage(finalText);

  updateUploadJob(job.id, { status: 'completed', progress: 100 });
}

function sanitizeContextForExport(contextPayload, includeSensitive = false) {
  if (!contextPayload || typeof contextPayload !== 'object') {
    return contextPayload;
  }
  if (includeSensitive) {
    return contextPayload;
  }
  const next = { ...contextPayload };
  if (next.axText) {
    delete next.axText;
  }
  if (next.textboxText) {
    delete next.textboxText;
  }
  if (next.screenshot) {
    delete next.screenshot;
  }
  if (next.file && next.file.path) {
    delete next.file.path;
  }
  return next;
}

function getCrocOmniSettings() {
  const base = defaultSettings.crocOmni || {
    enabled: true,
    contextEnabled: false,
    contextOverrides: {},
    aiReplyEnabled: false,
    aiReplyIncludeSensitive: false,
  };
  const current = settings.crocOmni && typeof settings.crocOmni === 'object' ? settings.crocOmni : {};
  return {
    enabled: current.enabled !== false,
    contextEnabled: current.contextEnabled === true,
    contextOverrides: current.contextOverrides && typeof current.contextOverrides === 'object'
      ? current.contextOverrides
      : base.contextOverrides || {},
    aiReplyEnabled: current.aiReplyEnabled === true,
    aiReplyIncludeSensitive: current.aiReplyIncludeSensitive === true,
  };
}

function isCrocOmniContextEnabledFor(contextId) {
  const crocOmniSettings = getCrocOmniSettings();
  const override = crocOmniSettings.contextOverrides?.[contextId];
  if (override === true) {
    return true;
  }
  if (override === false) {
    return false;
  }
  return crocOmniSettings.contextEnabled === true;
}

async function buildCrocOmniContextPayload() {
  try {
    const contextState = await getContextStateCached();
    const contextId = contextState?.contextId || '';
    if (!contextId || !isCrocOmniContextEnabledFor(contextId)) {
      return { context: null, used: false, contextId };
    }
    const payload = contextState?.payload || null;
    if (!payload) {
      return { context: null, used: false, contextId };
    }
    return { context: payload, used: true, contextId };
  } catch (error) {
    console.warn('CrocOmni context capture failed:', error);
    return { context: null, used: false, contextId: '' };
  }
}

function redactCrocOmniContext(contextPayload) {
  if (!contextPayload) {
    return null;
  }
  const redacted = redactContextPayload(contextPayload);
  return {
    appName: redacted.appName || null,
    windowTitle: redacted.windowTitle || null,
    url: redacted.url || null,
    signals: redacted.signals || null,
  };
}

function computeInsightsFromHistory(history) {
  const stats = {
    totalDictations: 0,
    totalWords: 0,
    averageWords: 0,
    averageWpm: 0,
    topApps: [],
    streakDays: 0,
  };
  if (!Array.isArray(history) || !history.length) {
    return stats;
  }
  let totalDurationMs = 0;
  const appCounts = new Map();
  const days = new Set();
  history.forEach((entry) => {
    stats.totalDictations += 1;
    const words = countWords(entry.text || '');
    stats.totalWords += words;
    if (Number.isFinite(entry.duration_ms)) {
      totalDurationMs += entry.duration_ms;
    }
    if (entry.created_at) {
      days.add(entry.created_at.slice(0, 10));
    }
    if (entry.context_json) {
      try {
        const context = JSON.parse(entry.context_json);
        const appName = context?.appName || context?.app || null;
        if (appName) {
          appCounts.set(appName, (appCounts.get(appName) || 0) + 1);
        }
      } catch {}
    }
  });
  stats.averageWords = stats.totalDictations ? Math.round(stats.totalWords / stats.totalDictations) : 0;
  if (totalDurationMs > 0) {
    const totalMinutes = totalDurationMs / 60000;
    stats.averageWpm = totalMinutes ? Math.round(stats.totalWords / totalMinutes) : 0;
  }
  stats.topApps = Array.from(appCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([app, count]) => ({ app, count }));
  const sortedDays = Array.from(days).sort();
  const dayMs = 24 * 60 * 60 * 1000;
  let streak = 0;
  let current = null;
  sortedDays.forEach((day) => {
    if (!current) {
      current = day;
      streak = 1;
      return;
    }
    const prev = new Date(current);
    const next = new Date(prev.getTime() + dayMs).toISOString().slice(0, 10);
    if (day === next) {
      streak += 1;
    } else {
      streak = 1;
    }
    current = day;
  });
  stats.streakDays = streak;
  return stats;
}

function splitParagraphs(text) {
  if (!text) {
    return [];
  }
  return text.split(/\n{2,}/g).map((part) => part.trim()).filter(Boolean);
}

function buildExportPayload(entry, options) {
  const format = options.format || 'txt';
  const includeTimestamps = options.includeTimestamps === true;
  const includeSensitive = options.includeSensitive === true;
  const createdAt = entry.created_at || new Date().toISOString();
  const title = entry.title || 'transcript';
  let contextPayload = null;
  if (entry.context_json) {
    try {
      contextPayload = sanitizeContextForExport(JSON.parse(entry.context_json), includeSensitive);
    } catch {
      contextPayload = null;
    }
  }
  const paragraphs = splitParagraphs(entry.text || entry.raw_text || '');
  if (format === 'json') {
    return JSON.stringify({
      export_version: 'v1',
      id: entry.id,
      title,
      language: entry.language,
      created_at: createdAt,
      duration_ms: entry.duration_ms || null,
      source: contextPayload?.source || null,
      context: contextPayload || null,
      segments: includeTimestamps
        ? paragraphs.map((text) => ({ at: createdAt, text }))
        : paragraphs.map((text) => ({ text })),
      text: entry.text || entry.raw_text || '',
    }, null, 2);
  }

  const lines = [];
  const stamp = includeTimestamps ? `[${createdAt}] ` : '';
  paragraphs.forEach((paragraph) => {
    lines.push(`${stamp}${paragraph}`);
    lines.push('');
  });
  const content = lines.join('\n').trim();
  if (format === 'md') {
    return `# ${title}\n\n${content}`;
  }
  return content;
}

function slugifyFilename(value) {
  return (value || 'transcript')
    .toString()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
    .toLowerCase() || 'transcript';
}

function buildExportFilename(entry, ext) {
  const date = (entry.created_at || new Date().toISOString()).slice(0, 10);
  const title = slugifyFilename(entry.title || 'transcript');
  return `${date}-${title}.${ext}`;
}

function encodeWavFromFloat32(samples, sampleRate) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i += 1) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  return buffer;
}

ipcMain.on('audio-data', (event, audioData) => {
  handleAudioPayload(event, audioData);
});

ipcMain.on('audio-ready', (event, audioData) => {
  handleAudioPayload(event, audioData);
});

ipcMain.on('stream:start', (event, payload = {}) => {
  if (!isFeatureEnabled('streaming')) {
    recordStreamEvent('stream_start_ignored', { reason: 'streaming_disabled' });
    return;
  }
  const sessionId = payload.sessionId;
  if (!sessionId) {
    recordStreamEvent('stream_start_invalid', { reason: 'missing_session_id' });
    return;
  }
  streamSessions.set(sessionId, {
    id: sessionId,
    sampleRate: payload.sampleRate || settings.streamSampleRate || 16000,
    chunkMs: payload.chunkMs || settings.streamChunkMs || 900,
    codec: payload.codec || 'pcm',
    mimeType: payload.mimeType || 'audio/webm',
    startedAt: Date.now(),
    seqExpected: 0,
    samples: [],
    encodedChunks: [],
    lastPartialAt: 0,
    lastSampleIndex: 0,
    partialText: '',
    remoteEnabled: false,
    remoteFinalText: '',
    remotePartialText: '',
    active: true,
    lastChunkAt: null,
    stallTimer: null,
  });
  recordStreamEvent('stream_start', {
    id: sessionId,
    codec: payload.codec || 'pcm',
    sampleRate: payload.sampleRate || settings.streamSampleRate || 16000,
    chunkMs: payload.chunkMs || settings.streamChunkMs || 900,
    mimeType: payload.mimeType || null,
  });
  const session = streamSessions.get(sessionId);
  if (shouldUseRemoteStreaming()) {
    session.remoteEnabled = openRemoteStreamSession(session, payload);
  }
  session.stallTimer = setInterval(() => {
    if (!session.active) {
      clearInterval(session.stallTimer);
      return;
    }
    const now = Date.now();
    if (!session.lastChunkAt) {
      if (now - session.startedAt < STREAM_START_GRACE_MS) {
        return;
      }
      session.active = false;
      clearInterval(session.stallTimer);
      streamSessions.delete(session.id);
      recordStreamEvent('stream_timeout_no_chunks', {
        id: session.id,
        waitedMs: now - session.startedAt,
      });
      void fallbackToFileMode('Streaming interrompu (timeout).');
      setRecordingState(RecordingState.ERROR, 'Streaming interrompu (timeout).');
      scheduleReturnToIdle(3000);
      return;
    }
    if (now - session.lastChunkAt > Math.max(2000, session.chunkMs * 5)) {
      session.active = false;
      clearInterval(session.stallTimer);
      streamSessions.delete(session.id);
      recordStreamEvent('stream_timeout_gap', {
        id: session.id,
        gapMs: now - session.lastChunkAt,
      });
      void fallbackToFileMode('Streaming interrompu (timeout).');
      setRecordingState(RecordingState.ERROR, 'Streaming interrompu (timeout).');
      scheduleReturnToIdle(3000);
    }
  }, 1000);
});

ipcMain.on('stream:chunk', async (event, payload = {}) => {
  const session = streamSessions.get(payload.sessionId);
  if (!session || !session.active) {
    if (payload.sessionId) {
      recordStreamEvent('stream_chunk_orphan', { id: payload.sessionId });
    }
    return;
  }
  if (payload.seq !== session.seqExpected) {
    session.active = false;
    streamSessions.delete(session.id);
    recordStreamEvent('stream_chunk_invalid_order', {
      id: session.id,
      expected: session.seqExpected,
      got: payload.seq,
    });
    void fallbackToFileMode('Streaming interrompu (ordre invalide).');
    setRecordingState(RecordingState.ERROR, 'Streaming interrompu (ordre invalide).');
    scheduleReturnToIdle(3000);
    return;
  }
  session.seqExpected += 1;
  session.lastChunkAt = Date.now();
  if (!session.firstChunkAt) {
    session.firstChunkAt = session.lastChunkAt;
    recordStreamEvent('stream_first_chunk_main', {
      id: session.id,
      codec: session.codec,
      seq: payload.seq,
    });
  }
  let samples = null;
  if (session.codec === 'opus') {
    const chunk = payload.chunk;
    const chunkSize = chunk?.byteLength || 0;
    if (!chunkSize) {
      return;
    }
    if (chunkSize > 5 * 1024 * 1024) {
      session.active = false;
      streamSessions.delete(session.id);
      recordStreamEvent('stream_chunk_too_large', {
        id: session.id,
        codec: session.codec,
        size: chunkSize,
        max: 5 * 1024 * 1024,
      });
      void fallbackToFileMode('Chunk audio trop volumineux.');
      setRecordingState(RecordingState.ERROR, 'Chunk audio trop volumineux.');
      scheduleReturnToIdle(3000);
      return;
    }
    session.encodedChunks.push(Buffer.from(chunk));
  } else {
    samples = payload.samples;
    if (samples instanceof ArrayBuffer) {
      samples = new Float32Array(samples);
    } else if (ArrayBuffer.isView(samples) && !(samples instanceof Float32Array)) {
      const byteLength = samples.byteLength || 0;
      const length = Math.floor(byteLength / Float32Array.BYTES_PER_ELEMENT);
      samples = new Float32Array(samples.buffer, samples.byteOffset || 0, length);
    } else if (Array.isArray(samples)) {
      samples = Float32Array.from(samples);
    }
    if (!samples || !samples.length) {
      recordStreamEvent('stream_chunk_empty', {
        id: session.id,
        typeof: typeof payload.samples,
      });
      return;
    }
    if (samples.length > STREAM_MAX_CHUNK_SAMPLES) {
      session.active = false;
      streamSessions.delete(session.id);
      recordStreamEvent('stream_chunk_too_large', {
        id: session.id,
        codec: session.codec,
        size: samples.length,
        max: STREAM_MAX_CHUNK_SAMPLES,
      });
      void fallbackToFileMode('Chunk audio trop volumineux.');
      setRecordingState(RecordingState.ERROR, 'Chunk audio trop volumineux.');
      scheduleReturnToIdle(3000);
      return;
    }
    for (let i = 0; i < samples.length; i += 1) {
      session.samples.push(samples[i]);
    }
  }
  if (session.remoteEnabled) {
    sendRemoteChunk(session, {
      seq: payload.seq,
      samples,
      chunk: payload.chunk,
      mimeType: payload.mimeType,
    });
  }
  if (Date.now() - session.startedAt > STREAM_MAX_DURATION_MS) {
    session.active = false;
    streamSessions.delete(session.id);
    recordStreamEvent('stream_session_too_long', {
      id: session.id,
      durationMs: Date.now() - session.startedAt,
      maxMs: STREAM_MAX_DURATION_MS,
    });
    void fallbackToFileMode('Session streaming trop longue.');
    setRecordingState(RecordingState.ERROR, 'Session streaming trop longue.');
    scheduleReturnToIdle(3000);
    return;
  }

  const interval = Number.isFinite(settings.streamPartialIntervalMs) ? settings.streamPartialIntervalMs : 7000;
  if (session.remoteEnabled) {
    return;
  }
  if (Date.now() - session.lastPartialAt < interval) {
    return;
  }
  if (session.codec === 'pcm') {
    const pendingSamples = session.samples.slice(session.lastSampleIndex);
    if (pendingSamples.length < session.sampleRate) {
      return;
    }
    session.lastPartialAt = Date.now();
    const wavBuffer = encodeWavFromFloat32(pendingSamples, session.sampleRate);
    try {
      const partial = await transcribeAudio(wavBuffer, 'audio/wav');
      session.partialText = `${session.partialText} ${partial}`.trim();
      session.lastSampleIndex = session.samples.length;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('transcription-partial', session.partialText);
      }
    } catch (error) {
      recordStreamEvent('stream_partial_error', {
        id: session.id,
        message: error?.message || String(error),
      });
      console.warn('Partial transcription failed:', error?.message || error);
    }
  }
});

ipcMain.on('stream:stop', async (event, payload = {}) => {
  const session = streamSessions.get(payload.sessionId);
  if (!session) {
    if (payload.sessionId) {
      recordStreamEvent('stream_stop_unknown', { id: payload.sessionId });
    }
    return;
  }
  clearProcessingTimeout();
  if (session.stallTimer) {
    clearInterval(session.stallTimer);
  }
  session.active = false;
  streamSessions.delete(session.id);
  if (session.remoteEnabled) {
    closeRemoteStreamSession(session);
  }
  recordStreamEvent('stream_stop', {
    id: session.id,
    codec: session.codec,
    durationMs: Date.now() - session.startedAt,
    samples: session.samples?.length || 0,
    chunks: session.encodedChunks?.length || 0,
  });
  const target = resolveRecordingTarget();
  const shouldSkipPaste = target === 'notes' || target === 'notes-editor' || target === 'onboarding';
  try {
    if (session.remoteFinalText && typeof session.remoteFinalText === 'string') {
      lastTranscriptionPath = 'remote';
      const pipelineResult = await runTextPipeline(session.remoteFinalText.trim());
      if (pipelineResult.skip) {
        setRecordingState(RecordingState.ERROR, NO_AUDIO_MESSAGE);
        scheduleReturnToIdle(3000);
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('transcription-success', '');
        }
        return;
      }
      const {
        transcribedText,
        formattedText,
        finalText,
        title,
        divergenceScore,
        contextState,
      } = pipelineResult;
      const latencyMs = recordingStartTime ? Date.now() - recordingStartTime : null;
      await persistTranscription({
        transcribedText,
        formattedText,
        finalText,
        title,
        latencyMs,
        divergenceScore,
        micDevice: settings.microphoneId || null,
        fallbackPath: 'stream',
        fallbackReason: lastFallbackReason,
        networkLatencyMs: lastNetworkLatencyMs,
        transcriptionPath: lastTranscriptionPath,
        audioDiagnostics: payload.audioDiagnostics || null,
        audioQualityClass: payload.audioQualityClass || null,
        contextPayload: contextState?.payload || null,
      });
      lastPolishDiff = {
        before: transcribedText || '',
        after: formattedText || finalText || '',
      };
      if (!shouldSkipPaste) {
        await pasteText(finalText, { mode: 'paste', allowTargetChange: true });
      }
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('transcription-success', finalText);
      }
      if (dashboardWindow && !dashboardWindow.isDestroyed()) {
        sendDashboardEvent('dashboard:transcription-success', finalText, target);
      }
      setRecordingState(RecordingState.IDLE);
      return;
    }
    const buffer = session.codec === 'opus'
      ? Buffer.concat(session.encodedChunks)
      : encodeWavFromFloat32(session.samples, session.sampleRate);
    const mimeType = session.codec === 'opus' ? session.mimeType : 'audio/wav';
    const audioDiagnostics = payload.audioDiagnostics || null;
    const audioQualityClass = payload.audioQualityClass || null;
    const pipelineResult = await runTranscriptionPipeline(buffer, mimeType, audioDiagnostics, audioQualityClass);
    if (pipelineResult.skip) {
      setRecordingState(RecordingState.ERROR, NO_AUDIO_MESSAGE);
      scheduleReturnToIdle(3000);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('transcription-success', '');
      }
      return;
    }
    const { transcribedText, formattedText, finalText, title, divergenceScore, contextState } = pipelineResult;
    const latencyMs = recordingStartTime ? Date.now() - recordingStartTime : null;
    await persistTranscription({
      transcribedText,
      formattedText,
      finalText,
      title,
      latencyMs,
      divergenceScore,
      micDevice: settings.microphoneId || null,
      fallbackPath: 'stream',
      fallbackReason: lastFallbackReason,
      networkLatencyMs: lastNetworkLatencyMs,
      transcriptionPath: lastTranscriptionPath,
      audioDiagnostics,
      audioQualityClass,
      contextPayload: contextState?.payload || null,
    });
    lastPolishDiff = {
      before: transcribedText || '',
      after: formattedText || finalText || '',
    };
    if (!shouldSkipPaste) {
      await pasteText(finalText, { mode: 'paste', allowTargetChange: true });
    }
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('transcription-success', finalText);
    }
    if (dashboardWindow && !dashboardWindow.isDestroyed()) {
      sendDashboardEvent('dashboard:transcription-success', finalText, target);
    }
    setRecordingState(RecordingState.IDLE);
  } catch (error) {
    console.error('Streaming finalize failed:', error);
    await fallbackToFileMode(error?.message || 'Erreur streaming.');
    setRecordingState(RecordingState.ERROR, error?.message || 'Erreur streaming.');
    scheduleReturnToIdle(3000);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('transcription-error', error?.message || 'Erreur streaming.');
    }
    sendDashboardEvent('dashboard:transcription-error', error?.message || 'Erreur streaming.');
  }
});

ipcMain.on('stream:ping', (event, payload = {}) => {
  const session = streamSessions.get(payload.sessionId);
  if (!session || !session.active) {
    return;
  }
  if (session.remoteEnabled && session.remote?.ws && WebSocketClient) {
    if (session.remote.ws.readyState === WebSocketClient.OPEN) {
      sendRemoteMessage(session, { type: 'ping', at: payload.at || Date.now() });
    }
  }
  event.sender.send('stream:pong', { sessionId: session.id, at: Date.now() });
});

ipcMain.on('stream:diag', (event, payload = {}) => {
  if (!payload || typeof payload !== 'object') {
    return;
  }
  const code = payload.code || 'stream_diag';
  const details = payload.message || payload.details || '';
  recordStreamEvent(code, details);
});

ipcMain.on('mic-monitor:level', (event, payload) => {
  sendDashboardEvent('onboarding:mic-level', payload);
});

ipcMain.on('mic-monitor:error', (event, message) => {
  sendDashboardEvent('onboarding:mic-error', message);
});

ipcMain.on('recording-error', (event, error) => {
  console.error('Recording error:', error);
  recordingStartTime = null;
  clearProcessingTimeout();
  setRecordingState(RecordingState.ERROR, error);
  scheduleReturnToIdle(3000);
  recordDiagnosticEvent('recording_error', typeof error === 'string' ? error : 'Erreur enregistrement');
});

ipcMain.on('recording-empty', (event, reason) => {
  recordingStartTime = null;
  clearProcessingTimeout();
  const messages = {
    idle_timeout: "Arrêt automatique : aucun son détecté.",
    no_audio: NO_AUDIO_MESSAGE,
  };
  setRecordingState(RecordingState.ERROR, messages[reason] || NO_AUDIO_MESSAGE);
  recordDiagnosticEvent('recording_empty', messages[reason] || NO_AUDIO_MESSAGE);
  scheduleReturnToIdle(3000);
});

ipcMain.on('cancel-recording', () => {
  if (recordingState === RecordingState.IDLE) {
    return;
  }
  recordingStartTime = null;
  clearProcessingTimeout();
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('stop-recording');
  }
  setRecordingState(RecordingState.IDLE);
});

ipcMain.on('toggle-recording', () => {
  if (!isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
});

ipcMain.on('tray-menu:close', () => {
  hideTrayMenu();
});

ipcMain.on('tray-menu:action', (event, action) => {
  hideTrayMenu();
  if (action === 'toggle-recording') {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    return;
  }
  if (action === 'open-settings') {
    createDashboardWindow();
    return;
  }
  if (action === 'quit') {
    app.isQuitting = true;
    app.quit();
  }
});

ipcMain.on('widget:context-menu', (event, isOpen) => {
  if (isOpen) {
    showWidgetContextOverlay();
  } else {
    hideWidgetContextOverlay();
  }
});

ipcMain.on('widget:context-menu-close', () => {
  hideWidgetContextOverlay();
  sendWidgetEvent('widget:context-menu-close');
});

ipcMain.on('widget-expanded', (event, expanded) => {
  widgetExpanded = Boolean(expanded);
  updateWidgetBounds();
  if (!widgetExpanded) {
    hideWidgetContextOverlay();
  }
});

ipcMain.on('widget-undo-visibility', (event, visible) => {
  widgetUndoVisible = Boolean(visible);
  updateWidgetBounds();
});

ipcMain.on('widget-error-visibility', (event, visible) => {
  widgetErrorVisible = Boolean(visible);
  updateWidgetBounds();
});

ipcMain.handle('settings:get', async () => ({ ...settings, apiKeyPresent: Boolean(OPENAI_API_KEY) }));

ipcMain.handle('recording:set-target', async (event, target) => {
  recordingDestination = target || 'clipboard';
});

ipcMain.handle('settings:save', async (event, nextSettings) => {
  const payload = { ...(nextSettings || {}) };
  delete payload.apiKeyPresent;
  const candidate = { ...settings, ...payload };
  if (Object.prototype.hasOwnProperty.call(candidate, 'deliveryMode')) {
    delete candidate.deliveryMode;
  }
  if (STREAMING_DEPRECATED) {
    const flags = { ...(candidate.featureFlags || {}) };
    flags.streaming = false;
    flags.worklet = false;
    candidate.featureFlags = flags;
  }
  if (candidate.shortcut !== settings.shortcut) {
    const ok = registerGlobalShortcut(candidate.shortcut);
    if (!ok) {
      registerGlobalShortcut(settings.shortcut);
      candidate.shortcut = settings.shortcut;
      setRecordingState(RecordingState.ERROR, 'Raccourci invalide ou indisponible.');
      scheduleReturnToIdle(3000);
    }
  }

  settings = await persistSettings(candidate);
  scheduleDebouncedSync({ refreshSettings: true });
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('settings-updated', settings);
  }
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.webContents.send('settings-updated', settings);
  }
  return settings;
});

ipcMain.handle('clipboard:write', async (event, text) => {
  if (typeof text !== 'string') {
    return { ok: false };
  }
  clipboard.writeText(text);
  return { ok: true };
});

ipcMain.handle('app:open-settings', () => {
  createDashboardWindow();
});

ipcMain.handle('app:open-privacy-mic', async () => {
  if (process.platform !== 'win32') {
    return { ok: false, reason: 'unsupported' };
  }
  await shell.openExternal('ms-settings:privacy-microphone');
  return { ok: true };
});

ipcMain.handle('onboarding:mic-start', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return { ok: false, reason: 'no-widget' };
  }
  mainWindow.webContents.send('mic-monitor:start');
  return { ok: true };
});

ipcMain.handle('onboarding:mic-stop', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return { ok: false, reason: 'no-widget' };
  }
  mainWindow.webContents.send('mic-monitor:stop');
  return { ok: true };
});

ipcMain.handle('onboarding:delivery-check', async (event, sampleText) => {
  const text = typeof sampleText === 'string' && sampleText.trim()
    ? sampleText.trim()
    : 'Test CrocoVoice';
  try {
    await captureTypingTarget();
    await pasteText(text, { mode: 'paste' });
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error?.message || 'Echec injection' };
  }
});

ipcMain.handle('dashboard:data', async () => {
  const stats = await store.getHistoryStats(14);
  const notesTotal = await store.getNotesCount();
  const history = await store.listHistory({ limit: 200 });
  const notes = await store.listNotes({ limit: 100 });
  const dictionary = filterManualDictionaryEntries(await store.listDictionary());
  const snippets = await store.listSnippets();
  const styles = await store.listStyles();
  await refreshRemoteFeatureFlags();
  const notifications = await refreshNotifications();
  const crocOmniConversations = await store.listCrocOmniConversations({ limit: 50 });
  const insights = computeInsightsFromHistory(history);
  const contextState = await resolveContextState();
  const authUser = syncService && syncService.getUser();
  const quota = await getQuotaSnapshot();
  const subscription = getSubscriptionSnapshot();
  return {
    settings: { ...settings, apiKeyPresent: Boolean(OPENAI_API_KEY) },
    stats: { ...(stats || {}), notesTotal },
    history,
    notes,
    dictionary,
    snippets,
    styles,
    notifications,
    crocOmniConversations,
    insights,
    uploads: listUploadJobs(),
    context: {
      base: contextState.base,
      contextId: contextState.contextId,
      enabled: contextState.enabled,
      profileId: contextState.profile ? contextState.profile.id : null,
      suggestionId: contextState.suggestion ? contextState.suggestion.id : null,
      overrideMode: contextState.overrideMode,
      signals: contextState.signals,
    },
    quota,
    subscription,
    auth: authUser ? { email: authUser.email, id: authUser.id } : null,
    syncReady: Boolean(syncService && syncService.isReady()),
  };
});

ipcMain.handle('feature-flags:refresh', async () => {
  const result = await refreshRemoteFeatureFlags({ force: true });
  return { ok: true, ...result };
});

ipcMain.handle('notifications:refresh', async () => {
  const notifications = await refreshNotifications({ force: true });
  sendDashboardEvent('dashboard:data-updated');
  return notifications;
});

ipcMain.handle('notifications:read', async (event, id) => {
  if (!id) {
    return { ok: false };
  }
  await store.markNotificationRead(id);
  sendDashboardEvent('dashboard:data-updated');
  return { ok: true };
});

ipcMain.handle('notifications:archive', async (event, id) => {
  if (!id) {
    return { ok: false };
  }
  await store.archiveNotification(id);
  sendDashboardEvent('dashboard:data-updated');
  return { ok: true };
});

ipcMain.handle('telemetry:export', async () => {
  const includeSensitive = settings.telemetryIncludeSensitive === true;
  const events = await store.listTelemetryEvents({ limit: 500 });
  const history = await store.listHistory({ limit: 200 });
  const payload = {
    exportedAt: new Date().toISOString(),
    events: events.map((event) => ({
      ...event,
      payload: event.payload ? JSON.parse(event.payload) : null,
    })),
    history: history.map((entry) => {
      let contextPayload = null;
      if (entry.context_json) {
        try {
          contextPayload = JSON.parse(entry.context_json);
        } catch {
          contextPayload = null;
        }
      }
      return {
        id: entry.id,
        created_at: entry.created_at,
        latency_ms: entry.latency_ms,
        network_latency_ms: entry.network_latency_ms,
        divergence_score: entry.divergence_score,
        fallback_path: entry.fallback_path,
        fallback_reason: entry.fallback_reason,
        transcription_path: entry.transcription_path,
        audio_quality_class: entry.audio_quality_class,
        context: sanitizeContextForExport(contextPayload, includeSensitive),
      };
    }),
  };
  return payload;
});

ipcMain.handle('crocomni:search', async (event, query, options = {}) => {
  if (!store) {
    return [];
  }
  const raw = typeof query === 'string' ? query.trim() : '';
  if (!raw) {
    return [];
  }
  const source = options?.source === 'notes' || options?.source === 'history' ? options.source : 'all';
  const limit = Number.isFinite(options?.limit) ? options.limit : 20;
  let since = typeof options?.since === 'string' && options.since ? options.since : null;
  const days = Number.parseInt(options?.rangeDays || options?.days || '', 10);
  if (!since && Number.isFinite(days) && days > 0) {
    since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  }
  return store.searchDocuments(raw, { source, limit, since });
});

ipcMain.handle('crocomni:answer', async (event, payload = {}) => {
  const query = typeof payload.query === 'string' ? payload.query.trim() : '';
  const hits = Array.isArray(payload.hits) ? payload.hits : [];
  if (!query || hits.length === 0) {
    return { ok: false, error: 'missing_input' };
  }
  const crocOmniSettings = getCrocOmniSettings();
  if (crocOmniSettings.aiReplyEnabled !== true) {
    return { ok: false, error: 'ai_reply_disabled' };
  }
  const client = getOpenAIClient();
  if (!client) {
    return { ok: false, error: 'missing_api_key' };
  }

  const includeSensitive = crocOmniSettings.aiReplyIncludeSensitive === true;
  const sources = [];
  const seen = new Set();
  for (const hit of hits.slice(0, 6)) {
    const source = hit?.source === 'notes' ? 'notes' : (hit?.source === 'history' ? 'history' : '');
    const docId = hit?.doc_id || hit?.docId || hit?.id || '';
    if (!source || !docId) {
      continue;
    }
    const key = `${source}:${docId}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    let title = typeof hit?.title === 'string' ? hit.title : '';
    let excerpt = typeof hit?.snippet === 'string' ? hit.snippet : '';
    excerpt = excerpt.replace(/\u0001|\u0002/g, '').trim();

    if (!excerpt) {
      try {
        const doc = source === 'notes'
          ? await store.getNoteById(docId)
          : await store.getHistoryById(docId);
        const text = doc?.text || doc?.raw_text || '';
        excerpt = String(text).slice(0, 360).trim();
        if (String(text).length > 360) {
          excerpt += '…';
        }
        if (!title) {
          title = doc?.title || '';
        }
      } catch {
        // ignore
      }
    }

    if (!includeSensitive) {
      title = redactSensitiveText(title);
      excerpt = redactSensitiveText(excerpt);
    }
    if (excerpt.length > 600) {
      excerpt = `${excerpt.slice(0, 600).trim()}…`;
    }
    sources.push({
      source,
      doc_id: String(docId),
      title,
      excerpt,
    });
  }

  if (!sources.length) {
    return { ok: false, error: 'no_sources' };
  }

  const sourcesText = sources.map((source, index) => {
    const header = `[${index + 1}] ${source.source.toUpperCase()}${source.title ? ` — ${source.title}` : ''}`;
    return `${header}\n${source.excerpt}`;
  }).join('\n\n');

  const systemPrompt = [
    'You are CrocOmni Search, a helpful assistant for CrocoVoice.',
    'Answer using only the provided sources. If the sources are insufficient, say you cannot find the answer.',
    'Be concise and actionable. Answer in French.',
    'Always cite sources like [1], [2].',
  ].join(' ');

  try {
    const response = await executeOpenAICall({
      label: 'chat.completions.crocomni_answer',
      timeoutMs: OPENAI_CHAT_TIMEOUT_MS,
      action: () => client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Question: ${query}\n\nSources:\n${sourcesText}` },
        ],
      }),
    });
    const answer = response?.choices?.[0]?.message?.content?.trim()
      || 'Je ne trouve pas la réponse dans vos sources.';
    return { ok: true, answer, sources };
  } catch (error) {
    console.error('CrocOmni answer error:', error);
    return { ok: false, error: error?.message || 'answer_failed' };
  }
});

ipcMain.handle('crocomni:create', async (event, payload = {}) => {
  const record = await store.createCrocOmniConversation({
    id: payload.id || crypto.randomUUID(),
    title: payload.title || 'Nouvelle conversation',
  });
  sendDashboardEvent('dashboard:data-updated');
  return record;
});

ipcMain.handle('crocomni:archive', async (event, conversationId) => {
  if (!conversationId) {
    return { ok: false };
  }
  await store.archiveCrocOmniConversation(conversationId);
  sendDashboardEvent('dashboard:data-updated');
  return { ok: true };
});

ipcMain.handle('crocomni:messages', async (event, conversationId) => {
  if (!conversationId) {
    return [];
  }
  return store.listCrocOmniMessages(conversationId);
});

ipcMain.handle('crocomni:send', async (event, payload = {}) => {
  const conversationId = payload.conversationId || crypto.randomUUID();
  const content = typeof payload.content === 'string' ? payload.content.trim() : '';
  if (!content) {
    return { ok: false, error: 'Message vide.' };
  }
  const crocOmniSettings = getCrocOmniSettings();
  if (crocOmniSettings.enabled === false) {
    return { ok: false, error: 'CrocOmni désactivé.' };
  }
  await store.createCrocOmniConversation({
    id: conversationId,
    title: payload.title || 'Conversation CrocOmni',
  });
  await store.addCrocOmniMessage({
    id: crypto.randomUUID(),
    conversation_id: conversationId,
    role: 'user',
    content,
    context_used: false,
  });
  const client = getOpenAIClient();
  if (!client) {
    const fallbackMessage = 'CrocOmni indisponible : OPENAI_API_KEY manquante.';
    await store.addCrocOmniMessage({
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: 'assistant',
      content: fallbackMessage,
      context_used: false,
    });
    sendDashboardEvent('dashboard:data-updated');
    return { ok: true, conversationId };
  }

  const contextData = await buildCrocOmniContextPayload();
  const redactedContext = contextData.used ? redactCrocOmniContext(contextData.context) : null;
  const history = await store.listCrocOmniMessages(conversationId);
  const trimmedHistory = history.slice(-12).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
  const systemPrompt = [
    'You are CrocOmni, a helpful assistant for CrocoVoice.',
    'Be concise, friendly, and actionable.',
  ].join(' ');
  const contextPrompt = redactedContext
    ? `Context (redacted): ${JSON.stringify(redactedContext)}`
    : '';
  const messages = [
    { role: 'system', content: systemPrompt },
    ...(contextPrompt ? [{ role: 'system', content: contextPrompt }] : []),
    ...trimmedHistory,
  ];

  try {
    const response = await executeOpenAICall({
      label: 'chat.completions.crocomni',
      timeoutMs: OPENAI_CHAT_TIMEOUT_MS,
      action: () => client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        messages,
      }),
    });
    const reply = response?.choices?.[0]?.message?.content?.trim()
      || 'Je suis la pour vous aider.';
    await store.addCrocOmniMessage({
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: 'assistant',
      content: reply,
      context_used: Boolean(contextData.used),
    });
    sendDashboardEvent('dashboard:data-updated');
    return { ok: true, conversationId, contextUsed: Boolean(contextData.used) };
  } catch (error) {
    console.error('CrocOmni message error:', error);
    const fallbackMessage = getOpenAIUserMessage(error);
    await store.addCrocOmniMessage({
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: 'assistant',
      content: fallbackMessage,
      context_used: Boolean(contextData.used),
    });
    sendDashboardEvent('dashboard:data-updated');
    return { ok: true, conversationId, contextUsed: Boolean(contextData.used) };
  }
});

ipcMain.handle('upload:select', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Audio', extensions: UPLOAD_AUDIO_EXTENSIONS_NO_DOT },
    ],
  });
  if (result.canceled || !result.filePaths || !result.filePaths.length) {
    return { ok: false, reason: 'canceled' };
  }
  return createUploadJobFromFile(result.filePaths[0]);
});

ipcMain.handle('upload:add', async (event, filePath) => {
  return createUploadJobFromFile(filePath);
});

ipcMain.handle('upload:cancel', async (event, id) => {
  const job = uploadJobById.get(id);
  if (!job) {
    return { ok: false };
  }
  job.cancelled = true;
  if (job.status === 'queued') {
    updateUploadJob(id, { status: 'cancelled' });
  } else if (job.status === 'processing') {
    updateUploadJob(id, { status: 'cancelling' });
  }
  return { ok: true };
});

ipcMain.handle('dictionary:upsert', async (event, entry) => {
  const now = new Date().toISOString();
  const record = await store.upsertDictionary({
    id: entry.id || crypto.randomUUID(),
    user_id: syncService && syncService.getUser() ? syncService.getUser().id : null,
    from_text: entry.from_text,
    to_text: entry.to_text,
    frequency_used: typeof entry.frequency_used === 'number' ? entry.frequency_used : undefined,
    last_used: entry.last_used,
    source: 'manual',
    auto_learned: 0,
    created_at: entry.created_at || now,
    updated_at: now,
  });
  invalidateDictionaryCache();
  scheduleDebouncedSync();
  return record;
});

ipcMain.handle('dictionary:delete', async (event, id) => {
  await store.deleteDictionary(id);
  invalidateDictionaryCache();
  if (syncService && syncService.isReady()) {
    await syncService.deleteRemote('dictionary', id);
  }
  scheduleDebouncedSync();
  return { ok: true };
});

ipcMain.handle('context:preview', async (event, profileId, text) => {
  const profile = getContextProfiles().find((candidate) => candidate.id === profileId);
  const preview = applyAdaptiveFormatting(text || '', profile);
  return { text: preview };
});

ipcMain.handle('context:clear', async () => {
  await store.clearContext();
  sendDashboardEvent('dashboard:data-updated');
  scheduleDebouncedSync();
  return { ok: true };
});

ipcMain.handle('snippets:list', async () => {
  return store.listSnippets();
});

ipcMain.handle('snippets:upsert', async (event, entry) => {
  if (!entry || !entry.cue || !entry.template) {
    throw new Error('Cue et template requis.');
  }
  const now = new Date().toISOString();
  const cue = entry.cue.trim();
  const template = entry.template.trim();
  const record = await store.upsertSnippet({
    id: entry.id || crypto.randomUUID(),
    user_id: syncService && syncService.getUser() ? syncService.getUser().id : null,
    cue,
    cue_norm: normalizeSnippetCue(cue),
    template,
    description: entry.description || null,
    created_at: entry.created_at || now,
    updated_at: now,
  });
  invalidateSnippetCache();
  scheduleDebouncedSync();
  return record;
});

ipcMain.handle('snippets:delete', async (event, id) => {
  if (!id) {
    return { ok: false };
  }
  await store.deleteSnippet(id);
  invalidateSnippetCache();
  if (syncService && syncService.isReady()) {
    await syncService.deleteRemote('snippets', id);
  }
  scheduleDebouncedSync();
  return { ok: true };
});

ipcMain.handle('styles:upsert', async (event, entry) => {
  requireAuthenticated('Connexion requise pour modifier les styles.');
  const now = new Date().toISOString();
  const record = await store.upsertStyle({
    id: entry.id || crypto.randomUUID(),
    user_id: syncService && syncService.getUser() ? syncService.getUser().id : null,
    name: entry.name,
    prompt: entry.prompt,
    created_at: entry.created_at || now,
    updated_at: now,
  });
  if (!settings.activeStyleId) {
    await setSettingValue('activeStyleId', record.id);
    scheduleDebouncedSync({ refreshSettings: true });
  }
  scheduleDebouncedSync();
  return record;
});

ipcMain.handle('styles:delete', async (event, id) => {
  await store.deleteStyle(id);
  if (syncService && syncService.isReady()) {
    await syncService.deleteRemote('styles', id);
  }
  if (settings.activeStyleId === id) {
    await setSettingValue('activeStyleId', '');
    scheduleDebouncedSync({ refreshSettings: true });
  }
  scheduleDebouncedSync();
  return { ok: true };
});

ipcMain.handle('styles:activate', async (event, id) => {
  await setSettingValue('activeStyleId', id);
  scheduleDebouncedSync({ refreshSettings: true });
  return { ok: true };
});

ipcMain.handle('notes:list', async () => {
  return store.listNotes({ limit: 100 });
});

ipcMain.handle('notes:get', async (event, id) => {
  if (!id) {
    return null;
  }
  return store.getNoteById(id);
});

ipcMain.handle('history:get', async (event, id) => {
  if (!id) {
    return null;
  }
  return store.getHistoryById(id);
});

ipcMain.handle('history:delete', async (event, id) => {
  if (!id) {
    return { ok: false };
  }
  await store.deleteHistory(id);
  if (syncService && syncService.isReady()) {
    await syncService.deleteRemote('history', id);
  }
  sendDashboardEvent('dashboard:data-updated');
  scheduleDebouncedSync();
  return { ok: true };
});

ipcMain.handle('history:upsert', async (event, payload) => {
  if (!payload || !payload.id || !payload.text) {
    return { ok: false };
  }
  const record = await store.addHistory({
    id: payload.id,
    user_id: payload.user_id || (syncService && syncService.getUser() ? syncService.getUser().id : null),
    text: payload.text,
    raw_text: payload.raw_text || payload.text,
    formatted_text: payload.formatted_text || null,
    edited_text: payload.edited_text || payload.text,
    language: payload.language || settings.language || 'fr',
    duration_ms: payload.duration_ms || null,
    latency_ms: typeof payload.latency_ms === 'number' ? payload.latency_ms : null,
    network_latency_ms: typeof payload.network_latency_ms === 'number' ? payload.network_latency_ms : null,
    divergence_score: typeof payload.divergence_score === 'number' ? payload.divergence_score : null,
    mic_device: payload.mic_device || null,
    fallback_path: payload.fallback_path || null,
    fallback_reason: payload.fallback_reason || null,
    transcription_path: payload.transcription_path || null,
    audio_diagnostics_json: payload.audio_diagnostics_json || null,
    audio_quality_class: payload.audio_quality_class || null,
    title: payload.title || null,
    created_at: payload.created_at,
    updated_at: payload.updated_at,
  });
  sendDashboardEvent('dashboard:data-updated');
  scheduleDebouncedSync();
  return record;
});

ipcMain.handle('notes:delete', async (event, id) => {
  if (!id) {
    return { ok: false };
  }
  await store.deleteNote(id);
  if (syncService && syncService.isReady()) {
    await syncService.deleteRemote('notes', id);
  }
  sendDashboardEvent('dashboard:data-updated');
  scheduleDebouncedSync();
  return { ok: true };
});

ipcMain.handle('notes:add', async (event, payload) => {
  if (!payload || typeof payload.text !== 'string' || !payload.text.trim()) {
    throw new Error('Le contenu est requis.');
  }
  const text = payload.text;
  const userId = syncService && syncService.getUser() ? syncService.getUser().id : null;
  const title = payload.title?.trim() || await generateEntryTitle(text);
  const record = await store.addNote({
    id: crypto.randomUUID(),
    user_id: userId,
    text,
    title,
    metadata: payload.metadata || null,
  });
  sendDashboardEvent('dashboard:data-updated');
  scheduleDebouncedSync();
  return record;
});

ipcMain.handle('notes:upsert', async (event, payload) => {
  if (!payload || typeof payload.text !== 'string') {
    throw new Error('Le contenu est requis.');
  }
  const text = payload.text;
  const userId = syncService && syncService.getUser() ? syncService.getUser().id : null;
  const title = payload.title?.trim() || await generateEntryTitle(text);
  const record = await store.addNote({
    id: payload.id || crypto.randomUUID(),
    user_id: payload.user_id || userId,
    text,
    title,
    metadata: payload.metadata || null,
    created_at: payload.created_at,
    updated_at: payload.updated_at,
  });
  sendDashboardEvent('dashboard:data-updated');
  scheduleDebouncedSync();
  return record;
});

ipcMain.handle('history:list', async (event, limit = 50) => {
  return store.listHistory({ limit });
});

ipcMain.handle('history:clear', async () => {
  await store.clearHistory();
  if (syncService && syncService.isReady()) {
    await syncService.deleteAllHistory();
  }
  scheduleDebouncedSync();
  return { ok: true };
});

ipcMain.handle('history:export', async (event, id, options = {}) => {
  if (!id) {
    return { ok: false, reason: 'missing_id' };
  }
  const entry = await store.getHistoryById(id);
  if (!entry) {
    return { ok: false, reason: 'not_found' };
  }
  const format = options.format || 'txt';
  const ext = format === 'md' ? 'md' : format === 'json' ? 'json' : 'txt';
  const defaultPath = buildExportFilename(entry, ext);
  const dialogResult = await dialog.showSaveDialog({
    defaultPath,
    filters: [{ name: 'Export', extensions: [ext] }],
  });
  if (dialogResult.canceled || !dialogResult.filePath) {
    return { ok: false, reason: 'canceled' };
  }
  const content = buildExportPayload(entry, { ...options, format: ext });
  try {
    await fs.promises.writeFile(dialogResult.filePath, content);
    return { ok: true, path: dialogResult.filePath };
  } catch (error) {
    return { ok: false, reason: error?.message || 'export_failed' };
  }
});

ipcMain.handle('diagnostics:get', async () => {
  return {
    appVersion: app.getVersion(),
    os: `${os.platform()} ${os.release()}`,
    flags: getFeatureFlags(),
    lastDelivery,
    clipboardTest: lastClipboardTest,
    shortcut: settings.shortcut,
    shortcutRegistered: settings.shortcut ? globalShortcut.isRegistered(settings.shortcut) : false,
    events: diagnosticEvents,
  };
});

ipcMain.handle('diagnostics:run-checks', async () => {
  let clipboardResult = 'unknown';
  try {
    const previous = clipboard.readText();
    const probe = `diag-${Date.now()}`;
    clipboard.writeText(probe);
    const readBack = clipboard.readText();
    clipboard.writeText(previous || '');
    clipboardResult = readBack === probe ? 'ok' : 'mismatch';
  } catch (error) {
    clipboardResult = 'error';
  }
  lastClipboardTest = clipboardResult;
  return { ok: true, clipboardTest: clipboardResult };
});

ipcMain.handle('auth:status', async () => {
  const authUser = syncService && syncService.getUser();
  return authUser ? { email: authUser.email, id: authUser.id } : null;
});

ipcMain.handle('auth:get-state', () => authState);

ipcMain.handle('auth:retry', async () => {
  await hydrateAuthState();
  return authState;
});

ipcMain.handle('auth:sign-in', async (event, email, password) => {
  if (!syncService || !syncService.isReady()) {
    throw new Error('Supabase not configured.');
  }
  setAuthState({
    status: 'checking',
    message: 'Connexion en cours...',
    retryable: false,
  });
  try {
    const result = await syncService.signIn(email, password);
    authErrorCount = 0;
    clearAuthRetry();
    await requestSync({ refreshSettings: true });
    sendDashboardEvent('dashboard:data-updated');
    setAuthState({
      status: 'authenticated',
      message: '',
      user: result.user ? { email: result.user.email, id: result.user.id } : null,
      syncReady: true,
      retryable: false,
    });
    return { user: result.user };
  } catch (error) {
    const message = getAuthErrorMessage(error);
    const isNetworkError = message.toLowerCase().includes('reseau');
    setAuthState({
      status: isNetworkError ? 'error' : 'unauthenticated',
      message,
      user: null,
      syncReady: true,
      retryable: true,
    });
    throw new Error(message);
  }
});

ipcMain.handle('auth:sign-up', async (event, email, password) => {
  if (!syncService || !syncService.isReady()) {
    throw new Error('Supabase not configured.');
  }
  setAuthState({
    status: 'checking',
    message: 'Creation du compte...',
    retryable: false,
  });
  try {
    const result = await syncService.signUp(email, password);
    authErrorCount = 0;
    clearAuthRetry();
    await requestSync({ refreshSettings: true });
    sendDashboardEvent('dashboard:data-updated');
    setAuthState({
      status: 'authenticated',
      message: '',
      user: result.user ? { email: result.user.email, id: result.user.id } : null,
      syncReady: true,
      retryable: false,
    });
    return { user: result.user };
  } catch (error) {
    const message = getAuthErrorMessage(error);
    const isNetworkError = message.toLowerCase().includes('reseau');
    setAuthState({
      status: isNetworkError ? 'error' : 'unauthenticated',
      message,
      user: null,
      syncReady: true,
      retryable: true,
    });
    throw new Error(message);
  }
});

ipcMain.handle('auth:sign-out', async () => {
  if (!syncService || !syncService.isReady()) {
    return { ok: false };
  }
  await syncService.signOut();
  clearAuthRetry();
  if (store && store.clearSensitiveData) {
    await store.clearSensitiveData();
  }
  await setSubscriptionState({ plan: 'free', status: 'inactive', updatedAt: null });
  sendDashboardEvent('dashboard:data-updated');
  setAuthState({
    status: 'unauthenticated',
    message: 'Deconnecte.',
    user: null,
    syncReady: true,
    retryable: false,
  });
  return { ok: true };
});

ipcMain.handle('subscription:checkout', async () => {
  requireAuthenticated('Connexion requise pour passer PRO.');
  const authUser = syncService && syncService.getUser();
  let checkoutUrl = null;
  if (syncService && syncService.isReady()) {
    const result = await syncService.invokeFunction('stripe-checkout', {});
    checkoutUrl = result && result.url;
  }
  if (!checkoutUrl) {
    checkoutUrl = buildStripeUrl(STRIPE_CHECKOUT_URL, authUser);
  }
  if (!checkoutUrl) {
    return { ok: false, reason: 'not_configured' };
  }
  await shell.openExternal(checkoutUrl);
  const current = getSubscriptionSnapshot();
  await setSubscriptionState({
    ...current,
    plan: 'pro',
    status: current.status === 'active' ? 'active' : 'pending',
    pendingAt: new Date().toISOString(),
  });
  return { ok: true, url: checkoutUrl };
});

ipcMain.handle('subscription:portal', async () => {
  requireAuthenticated('Connexion requise pour gerer l’abonnement.');
  const authUser = syncService && syncService.getUser();
  let portalUrl = null;
  if (syncService && syncService.isReady()) {
    const result = await syncService.invokeFunction('stripe-portal', {});
    portalUrl = result && result.url;
  }
  if (!portalUrl) {
    portalUrl = buildStripeUrl(STRIPE_PORTAL_URL, authUser);
  }
  if (!portalUrl) {
    return { ok: false, reason: 'not_configured' };
  }
  await shell.openExternal(portalUrl);
  return { ok: true, url: portalUrl };
});

ipcMain.handle('subscription:refresh', async () => {
  requireAuthenticated('Connexion requise pour actualiser.');
  return requestSync({ refreshSettings: true });
});

ipcMain.handle('auth:get-signup-url', () => {
  return getAuthConfig().signupUrl;
});

ipcMain.handle('auth:get-config', () => {
  return getAuthConfig();
});

ipcMain.handle('auth:open-signup-url', (event, mode) => {
  const baseUrl = getAuthConfig().signupUrl;
  let url = baseUrl;
  if (mode === 'login' || mode === 'signup') {
    try {
      const parsed = new URL(baseUrl);
      parsed.searchParams.set('mode', mode);
      url = parsed.toString();
    } catch {
      const joiner = baseUrl.includes('?') ? '&' : '?';
      url = `${baseUrl}${joiner}mode=${mode}`;
    }
  }
  return shell.openExternal(url)
    .then(() => ({ ok: true, url }))
    .catch((error) => ({ ok: false, url, reason: error?.message || 'open_failed' }));
});

ipcMain.handle('sync:now', async () => {
  if (!syncService || !syncService.isReady()) {
    return { ok: false, reason: 'not_configured' };
  }
  if (!syncService.getUser()) {
    notifyAuthRequired('Connexion requise pour synchroniser.');
    return { ok: false, reason: 'not_authenticated' };
  }
  const result = await requestSync({ refreshSettings: true });
  return result;
});

ipcMain.on('history:paste-latest', async () => {
  const rows = await store.listHistory({ limit: 1 });
  if (rows.length) {
    await pasteText(rows[0].text, { mode: 'paste', allowTargetChange: true });
  }
});

ipcMain.on('polish:open', async () => {
  if (!isFeatureEnabled('contextMenu')) {
    return;
  }
  createDashboardWindow();
  let diff = lastPolishDiff;
  if (!diff) {
    const rows = await store.listHistory({ limit: 1 });
    if (rows.length) {
      diff = {
        before: rows[0].raw_text || '',
        after: rows[0].formatted_text || rows[0].text || '',
      };
    }
  }
  sendDashboardEvent('dashboard:diff', diff || { before: '', after: '' });
});

ipcMain.on('widget:hide-1h', () => {
  hideWidgetFor(60 * 60 * 1000);
});

ipcMain.on('dashboard:open-view', (event, viewName) => {
  createDashboardWindow();
  sendDashboardEvent('dashboard:set-view', viewName);
});

ipcMain.on('dashboard:window-control', (event, action) => {
  if (!dashboardWindow || dashboardWindow.isDestroyed()) {
    return;
  }
  if (action === 'close') {
    dashboardWindow.close();
    return;
  }
  if (action === 'minimize') {
    dashboardWindow.minimize();
    return;
  }
  if (action === 'maximize') {
    if (dashboardWindow.isMaximized()) {
      dashboardWindow.restore();
    } else {
      dashboardWindow.maximize();
    }
  }
});

app.whenReady().then(async () => {
  store = new Store({ userDataPath: app.getPath('userData'), defaults: defaultSettings });
  await store.init();
  settings = await store.getSettings();
  if (settings && Object.prototype.hasOwnProperty.call(settings, 'deliveryMode')) {
    delete settings.deliveryMode;
  }
  if (STREAMING_DEPRECATED) {
    const flags = { ...(settings.featureFlags || {}) };
    if (flags.streaming || flags.worklet) {
      flags.streaming = false;
      flags.worklet = false;
      await setSettingValue('featureFlags', flags);
    }
  }
  await ensureDefaultStyle();
  const retentionDays = getHistoryRetentionDays(
    settings.subscription,
    HISTORY_RETENTION_DAYS_FREE,
    HISTORY_RETENTION_DAYS_PRO,
  );
  if (retentionDays > 0) {
    console.info(`History retention policy: keep last ${retentionDays} days; purge older entries on startup/sync.`);
    await store.purgeHistory(retentionDays);
  } else {
    console.info('History retention policy: retention disabled; no purge on startup/sync.');
  }

  const contextSettings = getContextSettings();
  const contextRetentionDays = Number.isFinite(contextSettings.retentionDays)
    ? contextSettings.retentionDays
    : DEFAULT_CONTEXT_SETTINGS.retentionDays;
  if (contextRetentionDays > 0) {
    await store.purgeContext(contextRetentionDays);
  }
  await refreshRemoteFeatureFlags({ force: true });
  await refreshNotifications({ force: true });

  syncService = new SyncService({
    store,
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_ANON_KEY,
  });
  await syncService.init();
  syncService.onAuthStateChange(({ user }) => {
    if (user) {
      clearAuthRetry();
      setAuthState({
        status: 'authenticated',
        message: '',
        user: { email: user.email, id: user.id },
        syncReady: true,
        retryable: false,
      });
      void refreshQuotaSnapshotInBackground();
    } else {
      setAuthState({
        status: 'unauthenticated',
        message: '',
        user: null,
        syncReady: true,
        retryable: false,
      });
    }
  });
  if (syncService.isReady() && syncService.getUser()) {
    requestSync({ refreshSettings: true }).catch((error) => {
      console.error('Initial sync failed:', error);
    });
  }
  await hydrateAuthState();
  void refreshQuotaSnapshotInBackground();

  createMainWindow();
  startWidgetDisplayTracking();
  updateWindowVisibility();
  createTray();
  registerGlobalShortcut(settings.shortcut);
  if (!OPENAI_API_KEY) {
    setRecordingState(RecordingState.ERROR, 'OPENAI_API_KEY manquante');
    setTimeout(() => setRecordingState(RecordingState.IDLE), 4000);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
    updateWindowVisibility();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (widgetDisplayPoll) {
    clearInterval(widgetDisplayPoll);
    widgetDisplayPoll = null;
  }
});
