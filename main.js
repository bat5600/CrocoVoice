const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, nativeImage, screen, clipboard, shell } = require('electron');

app.disableHardwareAcceleration();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { OpenAI } = require('openai');
const Store = require('./store');
const SyncService = require('./sync');
let getAuthConfig = null;
try {
  ({ getAuthConfig } = require('./config/auth-config'));
} catch (error) {
  console.warn('[auth-config] missing module, using defaults:', error?.message || error);
  getAuthConfig = () => ({
    signupUrl: process.env.AUTH_SIGNUP_URL || 'https://app.supabase.com/project/your-project-id/auth/signup',
  });
}
require('dotenv').config();

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
const parsedWeeklyQuota = Number.parseInt(process.env.CROCOVOICE_WEEKLY_QUOTA_WORDS || '2000', 10);
const WEEKLY_QUOTA_WORDS = Number.isFinite(parsedWeeklyQuota) ? parsedWeeklyQuota : 2000;
const QUOTA_MODE = (process.env.CROCOVOICE_QUOTA_MODE || 'local').toLowerCase(); // local | hybrid | server
const QUOTA_CACHE_TTL_MS = Number.parseInt(process.env.CROCOVOICE_QUOTA_CACHE_TTL_MS || '300000', 10); // 5 min
let recordingDestination = 'clipboard';

const NO_AUDIO_MESSAGE = 'Aucun audio capte.';

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
const undoWindowSize = { width: 420, height: 120 };
const errorWindowSize = { width: 420, height: 120 };
const expandedWindowSize = { width: 360, height: 420 };
let widgetExpanded = false;
let widgetUndoVisible = false;
let widgetErrorVisible = false;

const defaultSettings = {
  language: process.env.CROCOVOICE_LANGUAGE || 'fr',
  shortcut:
    process.env.CROCOVOICE_SHORTCUT
    || (process.platform === 'darwin' ? 'Command+Shift+R' : 'Ctrl+Shift+R'),
  microphoneId: '',
  postProcessEnabled: true,
  activeStyleId: '',
  subscription: {
    plan: 'free',
    status: 'inactive',
    updatedAt: null,
  },
};
let settings = { ...defaultSettings };

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
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

function countWords(text) {
  if (!text) {
    return 0;
  }
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getWeekStartUTC(date = new Date()) {
  const utcDay = date.getUTCDay();
  const offset = (utcDay + 6) % 7;
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() - offset,
    0,
    0,
    0,
    0,
  ));
}

function getNextWeekStartUTC(date = new Date()) {
  const start = getWeekStartUTC(date);
  return new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
}

function getSubscriptionSnapshot() {
  const subscription = settings.subscription || {};
  const plan = subscription.plan || 'free';
  const status = subscription.status || 'inactive';
  const currentPeriodEnd = subscription.currentPeriodEnd || subscription.current_period_end || null;
  const isPro = plan === 'pro' && (status === 'active' || status === 'trialing');
  return {
    ...subscription,
    plan,
    status,
    currentPeriodEnd,
    isPro,
  };
}

function isProSubscription() {
  return getSubscriptionSnapshot().isPro;
}

function getHistoryRetentionDays(subscriptionSnapshot) {
  if (subscriptionSnapshot?.isPro) {
    return HISTORY_RETENTION_DAYS_PRO;
  }
  return HISTORY_RETENTION_DAYS_FREE;
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
  if (isProSubscription()) {
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
  if (isProSubscription()) {
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
  if (isProSubscription()) {
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

async function assertTypingTargetStillActive() {
  if (!typingTarget || !getActiveWindow) {
    return;
  }
  try {
    const activeWindow = await getActiveWindow();
    const title = await activeWindow.title;
    if (!title || title !== typingTarget.title) {
      const guardError = new Error('Fenetre cible modifiee pendant le collage. Cliquez dans la zone cible et reessayez.');
      guardError.code = 'typing_guard';
      throw guardError;
    }
  } catch (error) {
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

async function postProcessText(text, prompt) {
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
    'You are a text editor. Keep the original meaning and do not add content.',
    'Remove filler words, hesitations, and repetitions.',
    'Remove stray quotation marks.',
    'Fix punctuation, add natural line breaks.',
    'Do not summarize.',
  ].join(' ');
  const userPrompt = [
    `Language: ${settings.language || 'fr'}.`,
    prompt || '',
    'Text:',
    text,
  ].join('\n');

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
  const entries = await store.listDictionary();
  if (!entries.length) {
    return text;
  }
  let result = text;
  const sorted = [...entries].sort((a, b) => b.from_text.length - a.from_text.length);
  sorted.forEach((entry) => {
    if (!entry.from_text) {
      return;
    }
    result = result.split(entry.from_text).join(entry.to_text);
  });
  return result;
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
    settings.activeStyleId = active.id;
    await store.saveSettings(settings);
  }
  return active.prompt;
}

async function ensureDefaultStyle() {
  if (!store) {
    return;
  }
  const styles = await store.listStyles();
  const existingNames = new Set(styles.map((style) => style.name));
  const now = new Date().toISOString();
  const presets = [
    {
      name: 'Default',
      prompt: [
        'Supprimer les "euh", hesitations et repetitions.',
        'Supprimer les guillemets parasites.',
        'Corriger la ponctuation (virgules, points, questions).',
        'Corriger l orthographe, la grammaire et la syntaxe.',
        'Ajouter des retours a la ligne naturels.',
        'Preserver strictement le sens original.',
        'Ne pas resumer, ne pas ajouter de contenu.',
      ].join(' '),
    },
    {
      name: 'Casual',
      prompt: [
        'Style naturel, simple, conversationnel.',
        'Ponctuation legere.',
        'Preserver strictement le sens original.',
        'Ne pas resumer, ne pas ajouter de contenu.',

      ].join(' '),
    },
    {
      name: 'Formel',
      prompt: [
        'Style professionnel et structure.',
        'Phrases completes, ponctuation soignee.',
        'Vocabulaire precis, ton poli.',
        'Preserver strictement le sens original.',
        'Ne pas resumer, ne pas ajouter de contenu.',

      ].join(' '),
    },
    {
      name: 'Croco',
      prompt: [
        'Style naturel, simple, conversationnel.',
        'Metaphores fun & audacieuses et analogies contre-intuitives dans le style de Rory Sutherland.',
        'Preserver strictement le sens original.',
        'Ne pas resumer, ne pas ajouter de contenu.',
      ].join(' '),
    },
  ];

  for (const preset of presets) {
    if (existingNames.has(preset.name)) {
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
      settings.activeStyleId = defaultStyle.id;
      await store.saveSettings(settings);
    }
  }
}

function setMainWindowBounds(targetSize) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const x = Math.floor((width - targetSize.width) / 2);
  const y = height - targetSize.height - 16;
  mainWindow.setBounds({ x, y, width: targetSize.width, height: targetSize.height });
}

function updateWidgetBounds() {
  const targetSize = widgetUndoVisible
    ? undoWindowSize
    : (widgetErrorVisible ? errorWindowSize : (widgetExpanded ? expandedWindowSize : compactWindowSize));
  setMainWindowBounds(targetSize);
}

function ensureDashboardWindow() {
  createDashboardWindow();
}

function updateWindowVisibility() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  if (canAccessPremium()) {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
    return;
  }
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  }
  ensureDashboardWindow();
}

function createMainWindow() {
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
  mainWindow.loadFile('index.html');
  mainWindow.setBackgroundColor('#00000000');

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
    width: 980,
    height: 720,
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

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'Logo CrocoVoice (tray).png');

  let trayIcon;
  if (fs.existsSync(iconPath)) {
    trayIcon = nativeImage.createFromPath(iconPath);
  } else {
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);

  const buildMenu = () => {
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
  };

  tray.setToolTip('CrocoVoice');
  tray.setContextMenu(buildMenu());

  tray.on('click', () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  tray.on('right-click', () => {
    tray.popUpContextMenu(buildMenu());
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
  mainWindow.hide();
  setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
    }
  }, ms);
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
  const quotaAllowed = await ensureQuotaAvailable();
  if (!quotaAllowed) {
    transitionLock = false;
    refreshRendererState();
    return;
  }
  clearIdleResetTimeout();
  clearProcessingTimeout();
  recordingStartTime = Date.now();
  setRecordingState(RecordingState.RECORDING);

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('start-recording');
  }

  transitionLock = false;
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
  clearIdleResetTimeout();
  await captureTypingTarget();
  const recordingDuration = recordingStartTime ? Date.now() - recordingStartTime : 0;

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('stop-recording');
  }
  setRecordingState(RecordingState.PROCESSING);
  armProcessingTimeout();

  transitionLock = false;
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

async function pasteText(text) {
  let previousClipboard = '';
  try {
    if (!keyboardLib) {
      throw new Error('Keyboard automation unavailable.');
    }
    if (!text) {
      return;
    }
    await assertTypingTargetStillActive();
    previousClipboard = clipboard.readText();
    pendingPasteBuffer = text;

    await new Promise((resolve) => setTimeout(resolve, 300));
    clipboard.writeText(pendingPasteBuffer);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await triggerPasteShortcut();
    await new Promise((resolve) => setTimeout(resolve, 50));
  } catch (error) {
    console.error('Paste error:', error);
    throw new Error(error.message || 'Echec du collage');
  } finally {
    if (previousClipboard !== null && previousClipboard !== undefined) {
      clipboard.writeText(previousClipboard);
    }
    pendingPasteBuffer = '';
    typingTarget = null;
  }
}

// Critical flow: record -> transcribe -> post-process -> dictionary -> persist -> type.
// Integration points: OpenAI (transcribe/post-process/title), OS keyboard/clipboard, SQLite store, Supabase sync.
// Manual regression checks: start/stop, transcription, post-process fallback, typing, history entry, sync optional.

function normalizeAudioPayload(audioData) {
  let mimeType = '';
  let payload = audioData;
  let warningMessage = '';

  if (audioData && typeof audioData === 'object' && audioData.buffer) {
    payload = audioData.buffer;
    if (typeof audioData.mimeType === 'string') {
      mimeType = audioData.mimeType;
    }
    if (typeof audioData.warningMessage === 'string') {
      warningMessage = audioData.warningMessage;
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

  return { buffer, mimeType, warningMessage };
}

function resolveRecordingTarget() {
  const target = recordingDestination || 'clipboard';
  recordingDestination = 'clipboard';
  return target;
}

async function runTranscriptionPipeline(buffer, mimeType) {
  const transcribedText = await transcribeAudio(buffer, mimeType);
  if (!transcribedText || isNoAudioTranscription(transcribedText)) {
    return { skip: true, transcribedText: '' };
  }

  const stylePrompt = await getActiveStylePrompt();
  let editedText = transcribedText;
  let warningMessage = '';
  try {
    editedText = await postProcessText(transcribedText, stylePrompt);
  } catch (error) {
    if (error?.code === 'missing_api_key') {
      warningMessage = 'Post-traitement ignore: OPENAI_API_KEY manquante.';
    } else {
      warningMessage = getOpenAIUserMessage(error);
    }
    console.warn('Post-processing failed, using raw transcript.');
  }

  const finalText = await applyDictionary(editedText);
  const title = await generateEntryTitle(finalText);
  return {
    skip: false,
    transcribedText,
    finalText,
    title,
    warningMessage,
  };
}

async function persistTranscription({ transcribedText, finalText, title }) {
  if (!store) {
    return;
  }
  const userId = syncService && syncService.getUser() ? syncService.getUser().id : null;
  await store.addHistory({
    id: crypto.randomUUID(),
    user_id: userId,
    text: finalText,
    raw_text: transcribedText,
    language: settings.language || 'fr',
    duration_ms: recordingStartTime ? Date.now() - recordingStartTime : null,
    title,
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
    const { buffer, mimeType, warningMessage: safetyWarningMessage } = normalizeAudioPayload(audioData);

    const pipelineResult = await runTranscriptionPipeline(buffer, mimeType);
    if (pipelineResult.skip) {
      setRecordingState(RecordingState.ERROR, NO_AUDIO_MESSAGE);
      scheduleReturnToIdle(3000);
      event.reply('transcription-success', '');
      return;
    }

    const {
      transcribedText,
      finalText,
      title,
      warningMessage: pipelineWarningMessage,
    } = pipelineResult;
    const shouldSkipPaste = target === 'notes';

    await persistTranscription({ transcribedText, finalText, title });

    if (!shouldSkipPaste) {
      await pasteText(finalText);
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
  }
}

ipcMain.on('audio-data', (event, audioData) => {
  handleAudioPayload(event, audioData);
});

ipcMain.on('audio-ready', (event, audioData) => {
  handleAudioPayload(event, audioData);
});

ipcMain.on('recording-error', (event, error) => {
  console.error('Recording error:', error);
  recordingStartTime = null;
  clearProcessingTimeout();
  setRecordingState(RecordingState.ERROR, error);
  scheduleReturnToIdle(3000);
});

ipcMain.on('recording-empty', (event, reason) => {
  recordingStartTime = null;
  clearProcessingTimeout();
  const messages = {
    idle_timeout: "Arrêt automatique : aucun son détecté.",
    no_audio: NO_AUDIO_MESSAGE,
  };
  setRecordingState(RecordingState.ERROR, messages[reason] || NO_AUDIO_MESSAGE);
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

ipcMain.on('widget-expanded', (event, expanded) => {
  widgetExpanded = Boolean(expanded);
  updateWidgetBounds();
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
  if (candidate.shortcut !== settings.shortcut) {
    const ok = registerGlobalShortcut(candidate.shortcut);
    if (!ok) {
      registerGlobalShortcut(settings.shortcut);
      candidate.shortcut = settings.shortcut;
      setRecordingState(RecordingState.ERROR, 'Raccourci invalide ou indisponible.');
      scheduleReturnToIdle(3000);
    }
  }

  settings = await store.saveSettings(candidate);
  scheduleDebouncedSync({ refreshSettings: true });
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('settings-updated', settings);
  }
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.webContents.send('settings-updated', settings);
  }
  return settings;
});

ipcMain.handle('app:open-settings', () => {
  createDashboardWindow();
});

ipcMain.handle('dashboard:data', async () => {
  const stats = await store.getHistoryStats(14);
  const notesTotal = await store.getNotesCount();
  const history = await store.listHistory({ limit: 100 });
  const notes = await store.listNotes({ limit: 100 });
  const dictionary = await store.listDictionary();
  const styles = await store.listStyles();
  const authUser = syncService && syncService.getUser();
  const quota = await getQuotaSnapshot();
  const subscription = getSubscriptionSnapshot();
  return {
    settings: { ...settings, apiKeyPresent: Boolean(OPENAI_API_KEY) },
    stats: { ...(stats || {}), notesTotal },
    history,
    notes,
    dictionary,
    styles,
    quota,
    subscription,
    auth: authUser ? { email: authUser.email, id: authUser.id } : null,
    syncReady: Boolean(syncService && syncService.isReady()),
  };
});

ipcMain.handle('dictionary:upsert', async (event, entry) => {
  requireAuthenticated('Connexion requise pour modifier le dictionnaire.');
  const now = new Date().toISOString();
  const record = await store.upsertDictionary({
    id: entry.id || crypto.randomUUID(),
    user_id: syncService && syncService.getUser() ? syncService.getUser().id : null,
    from_text: entry.from_text,
    to_text: entry.to_text,
    created_at: entry.created_at || now,
    updated_at: now,
  });
  scheduleDebouncedSync();
  return record;
});

ipcMain.handle('dictionary:delete', async (event, id) => {
  await store.deleteDictionary(id);
  if (syncService && syncService.isReady()) {
    await syncService.deleteRemote('dictionary', id);
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
    settings.activeStyleId = record.id;
    await store.saveSettings(settings);
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
    settings.activeStyleId = '';
    await store.saveSettings(settings);
    scheduleDebouncedSync({ refreshSettings: true });
  }
  scheduleDebouncedSync();
  return { ok: true };
});

ipcMain.handle('styles:activate', async (event, id) => {
  settings.activeStyleId = id;
  await store.saveSettings(settings);
  scheduleDebouncedSync({ refreshSettings: true });
  return { ok: true };
});

ipcMain.handle('notes:list', async () => {
  return store.listNotes({ limit: 100 });
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
  requireAuthenticated('Connexion requise pour creer une note.');
  if (!payload || !payload.text || !payload.text.trim()) {
    throw new Error('Le contenu est requis.');
  }
  const text = payload.text.trim();
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
  shell.openExternal(url);
  return { url };
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
    await pasteText(rows[0].text);
  }
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
  await ensureDefaultStyle();
  const retentionDays = getHistoryRetentionDays(getSubscriptionSnapshot());
  if (retentionDays > 0) {
    console.info(`History retention policy: keep last ${retentionDays} days; purge older entries on startup/sync.`);
    await store.purgeHistory(retentionDays);
  } else {
    console.info('History retention policy: retention disabled; no purge on startup/sync.');
  }

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
});
