const { createClient } = require('@supabase/supabase-js');
const Store = require('./store');
const { isProSubscription, getHistoryRetentionDays, maxUpdatedAt } = Store;

const DAY_MS = 24 * 60 * 60 * 1000;
const parsedHistoryRetentionFree = Number.parseInt(process.env.CROCOVOICE_HISTORY_RETENTION_DAYS_FREE || '14', 10);
const HISTORY_RETENTION_DAYS_FREE = Number.isFinite(parsedHistoryRetentionFree) ? parsedHistoryRetentionFree : 14;
const parsedHistoryRetentionPro = Number.parseInt(process.env.CROCOVOICE_HISTORY_RETENTION_DAYS_PRO || '365', 10);
const HISTORY_RETENTION_DAYS_PRO = Number.isFinite(parsedHistoryRetentionPro) ? parsedHistoryRetentionPro : 365;
const parsedHistorySyncLimitFree = Number.parseInt(process.env.CROCOVOICE_HISTORY_SYNC_LIMIT_FREE || '1000', 10);
const HISTORY_SYNC_LIMIT_FREE = Number.isFinite(parsedHistorySyncLimitFree) ? parsedHistorySyncLimitFree : 1000;
const parsedHistorySyncLimitPro = Number.parseInt(process.env.CROCOVOICE_HISTORY_SYNC_LIMIT_PRO || '5000', 10);
const HISTORY_SYNC_LIMIT_PRO = Number.isFinite(parsedHistorySyncLimitPro) ? parsedHistorySyncLimitPro : 5000;

function resolveHistoryRetentionDays(subscription) {
  return getHistoryRetentionDays(subscription, HISTORY_RETENTION_DAYS_FREE, HISTORY_RETENTION_DAYS_PRO);
}

function getHistorySyncLimit(subscription) {
  return isProSubscription(subscription) ? HISTORY_SYNC_LIMIT_PRO : HISTORY_SYNC_LIMIT_FREE;
}

function logHistoryRetentionPolicy(context, retentionDays) {
  if (retentionDays > 0) {
    console.info(`History retention policy (${context}): keep last ${retentionDays} days; purge older entries.`);
    return;
  }
  console.info(`History retention policy (${context}): retention disabled; no purge.`);
}


class SyncService {
  constructor({ store, supabaseUrl, supabaseKey }) {
    this.store = store;
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.client = null;
    this.user = null;
    this.authSubscription = null;
    this.authChangeHandler = null;
    this.syncAbort = false;
    this.accessToken = null;
  }

  async init() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      return;
    }
    this.client = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    const session = await this.store.getSetting('supabase_session');
    if (session && session.access_token) {
      const { data, error } = await this.client.auth.setSession(session);
      if (!error) {
        this.user = data.user;
        this.accessToken = session.access_token;
        if (this.user) {
          await this.store.attachUser(this.user.id);
        }
      }
    }
    this._registerAuthListener();
  }

  isReady() {
    return Boolean(this.client);
  }

  getUser() {
    return this.user;
  }

  onAuthStateChange(handler) {
    this.authChangeHandler = typeof handler === 'function' ? handler : null;
    this._registerAuthListener();
  }

  async invokeFunction(name, body) {
    this._ensureClient();
    let accessToken = this.accessToken;
    if (!accessToken) {
      const { data: sessionData, error: sessionError } = await this.client.auth.getSession();
      if (sessionError) {
        throw sessionError;
      }
      accessToken = sessionData?.session?.access_token || null;
    }
    if (!accessToken) {
      const stored = await this.store.getSetting('supabase_session');
      accessToken = stored?.access_token || null;
    }
    const headers = {
      apikey: this.supabaseKey,
      'Content-Type': 'application/json',
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    const response = await fetch(`${this.supabaseUrl}/functions/v1/${name}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body || {}),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Function ${name} failed (${response.status}): ${detail || 'unknown error'}`);
    }
    const data = await response.json().catch(() => ({}));
    return data;
  }

  async refreshSession() {
    this._ensureClient();
    const { data, error } = await this.client.auth.getSession();
    if (error) {
      throw error;
    }
    const session = data && data.session;
    this.user = session ? session.user : null;
    if (session) {
      await this._storeSession(session);
      if (this.user) {
        await this.store.attachUser(this.user.id);
      }
    } else {
      await this.store.setSetting('supabase_session', null);
    }
    return { session, user: this.user };
  }

  async signIn(email, password) {
    this._ensureClient();
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    await this._storeSession(data.session);
    this.user = data.user;
    await this.store.attachUser(this.user.id);
    return { user: data.user };
  }

  async signUp(email, password) {
    this._ensureClient();
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (error) {
      throw error;
    }
    if (data.session) {
      await this._storeSession(data.session);
    }
    this.user = data.user;
    if (this.user) {
      await this.store.attachUser(this.user.id);
    }
    return { user: data.user };
  }

  async signOut() {
    this._ensureClient();
    this.abortSync();
    await this.client.auth.signOut();
    this.user = null;
    await this.store.setSetting('supabase_session', null);
  }

  async deleteRemote(table, id) {
    if (!this.user || !id) {
      return;
    }
    if (!this.client) {
      await this._queuePendingDelete(table, id, this.user.id);
      return;
    }
    try {
      await this.client.from(table).delete().eq('id', id).eq('user_id', this.user.id);
      await this._removePendingDelete(table, id, this.user.id);
    } catch (error) {
      await this._queuePendingDelete(table, id, this.user.id);
      console.warn(`Remote delete failed for ${table}:${id}; queued for retry.`, error);
    }
  }

  async deleteAllHistory() {
    this._ensureClient();
    if (!this.user) {
      return;
    }
    await this.client.from('history').delete().eq('user_id', this.user.id);
  }

  async syncAll() {
    this._ensureClient();
    if (!this.user) {
      return { ok: false, reason: 'not_authenticated' };
    }
    this.syncAbort = false;
    const subscription = await this.store.getSetting('subscription');
    const retentionDays = resolveHistoryRetentionDays(subscription);
    logHistoryRetentionPolicy('sync', retentionDays);
    if (retentionDays > 0) {
      await this.store.purgeHistory(retentionDays);
    }
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }
    if (retentionDays > 0) {
      await this._purgeRemoteHistory(retentionDays);
    }
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    const historySyncLimit = getHistorySyncLimit(subscription);
    await this._syncTable('history', async () => this.store.listHistory({ limit: historySyncLimit }), {
      table: 'history',
      key: 'history',
      mapRow: (row) => ({
        id: row.id,
        user_id: row.user_id,
        text: row.text,
        raw_text: row.raw_text,
        formatted_text: row.formatted_text,
        edited_text: row.edited_text,
        language: row.language,
        duration_ms: row.duration_ms,
        latency_ms: row.latency_ms,
        divergence_score: row.divergence_score,
        mic_device: row.mic_device,
        fallback_path: row.fallback_path,
        title: row.title,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }),
      upsertLocal: (row) => this.store.addHistory(row),
    });
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    await this._syncTable('dictionary', () => this.store.listDictionary(), {
      table: 'dictionary',
      key: 'dictionary',
      mapRow: (row) => ({
        id: row.id,
        user_id: row.user_id,
        from_text: row.from_text,
        to_text: row.to_text,
        frequency_used: row.frequency_used,
        last_used: row.last_used,
        source: row.source,
        auto_learned: row.auto_learned,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }),
      upsertLocal: (row) => this.store.upsertDictionary(row),
    });
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    await this._syncTable('styles', () => this.store.listStyles(), {
      table: 'styles',
      key: 'styles',
      mapRow: (row) => ({
        id: row.id,
        user_id: row.user_id,
        name: row.name,
        prompt: row.prompt,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }),
      upsertLocal: (row) => this.store.upsertStyle(row),
    });
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    await this._syncTable('notes', () => this.store.listNotes({ limit: 1000 }), {
      table: 'notes',
      key: 'notes',
      mapRow: (row) => ({
        id: row.id,
        user_id: row.user_id,
        title: row.title,
        text: row.text,
        metadata: row.metadata,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }),
      upsertLocal: (row) => this.store.addNote(row),
    });
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    await this._syncTable('snippets', () => this.store.listSnippets(), {
      table: 'snippets',
      key: 'snippets',
      mapRow: (row) => ({
        id: row.id,
        user_id: row.user_id,
        cue: row.cue,
        cue_norm: row.cue_norm,
        template: row.template,
        description: row.description,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }),
      upsertLocal: (row) => this.store.upsertSnippet(row),
    });
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    await this._syncSettings();
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    await this._syncSubscription();
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    return { ok: true };
  }

  async _syncSettings() {
    const cursor = await this.store.getSyncCursor('settings');
    const settingsMeta = await this.store.getSettingsWithMeta();
    const excludedKeys = new Set([
      'subscription',
      'supabase_session',
      'last_transcription',
      'quota_weekly',
      'quota_snapshot_cache',
    ]);
    const settingsRows = Object.entries(settingsMeta)
      .filter(([key]) => !excludedKeys.has(key) && !key.startsWith('sync:'))
      .map(([key, meta]) => ({
      id: `${this.user.id}:${key}`,
      user_id: this.user.id,
      key,
      value: JSON.stringify(meta.value),
      updated_at: meta.updated_at || new Date().toISOString(),
    }));
    if (settingsRows.length) {
      await this.client.from('user_settings').upsert(settingsRows, { onConflict: 'id' });
    }

    const remoteRows = await this._fetchPagedRows(() => {
      let remoteQuery = this.client.from('user_settings').select('*').eq('user_id', this.user.id);
      if (cursor) {
        remoteQuery = remoteQuery.gte('updated_at', cursor);
      }
      return remoteQuery.order('updated_at', { ascending: true });
    });

    const localByKey = settingsMeta;
    for (const row of remoteRows || []) {
      const local = localByKey[row.key];
      if (!local || row.updated_at > local.updated_at) {
        await this.store.setSettingWithTimestamp(row.key, JSON.parse(row.value), row.updated_at);
      }
    }
    const maxRemote = maxUpdatedAt(remoteRows, cursor);
    const maxLocal = maxUpdatedAt(Object.values(settingsMeta).map((meta) => ({
      updated_at: meta.updated_at,
    })), cursor);
    const nextCursor = this._maxIso(maxRemote, maxLocal);
    if (nextCursor) {
      await this.store.setSyncCursor('settings', nextCursor);
    }
  }

  async _syncSubscription() {
    if (!this.user) {
      return;
    }
    const { data, error } = await this.client
      .from('subscriptions')
      .select('*')
      .eq('user_id', this.user.id)
      .maybeSingle();
    if (error) {
      console.warn('Subscription sync failed:', error);
      return;
    }
    if (!data) {
      const fallback = {
        plan: 'free',
        status: 'inactive',
        updatedAt: new Date().toISOString(),
      };
      await this.store.setSettingWithTimestamp('subscription', fallback, fallback.updatedAt);
      return;
    }
    const next = {
      plan: data.plan || 'free',
      status: data.status || 'inactive',
      priceId: data.price_id || null,
      stripeCustomerId: data.stripe_customer_id || null,
      currentPeriodEnd: data.current_period_end || null,
      updatedAt: data.updated_at || new Date().toISOString(),
    };
    await this.store.setSettingWithTimestamp('subscription', next, next.updatedAt);
  }

  async _syncTable(name, getLocalRows, config) {
    if (this.syncAbort) {
      return;
    }
    const cursor = await this.store.getSyncCursor(config.key);
    const localRows = await getLocalRows();
    if (this.syncAbort) {
      return;
    }
    const pendingDeletes = await this._flushPendingDeletes(config.table);
    const pendingDeleteIds = new Set(
      (pendingDeletes || [])
        .filter((entry) => entry && entry.user_id === this.user?.id)
        .map((entry) => entry.id),
    );
    const localUpdates = cursor
      ? localRows.filter((row) => row.updated_at >= cursor)
      : localRows;

    if (localUpdates.length > 0) {
      const payload = localUpdates.map(config.mapRow);
      await this.client.from(config.table).upsert(payload, { onConflict: 'id' });
    }
    if (this.syncAbort) {
      return;
    }

    const remoteRows = await this._fetchPagedRows(() => {
      let remoteQuery = this.client.from(config.table).select('*').eq('user_id', this.user.id);
      if (cursor) {
        remoteQuery = remoteQuery.gte('updated_at', cursor);
      }
      return remoteQuery.order('updated_at', { ascending: true });
    });

    const localById = new Map(localRows.map((row) => [row.id, row]));
    for (const row of remoteRows || []) {
      if (this.syncAbort) {
        return;
      }
      if (pendingDeleteIds.has(row.id)) {
        continue;
      }
      const local = localById.get(row.id);
      if (!local || row.updated_at > local.updated_at) {
        await config.upsertLocal(row);
      }
    }

    const maxRemote = maxUpdatedAt(remoteRows, cursor);
    const maxLocal = maxUpdatedAt(localUpdates, cursor);
    const nextCursor = this._maxIso(maxRemote, maxLocal);
    if (nextCursor) {
      await this.store.setSyncCursor(config.key, nextCursor);
    }
  }

  async _purgeRemoteHistory(days) {
    if (this.syncAbort) {
      return;
    }
    const cutoff = new Date(Date.now() - days * DAY_MS).toISOString();
    if (!this.user) {
      return;
    }
    await this.client.from('history').delete().lt('created_at', cutoff).eq('user_id', this.user.id);
  }

  _maxIso(a, b) {
    if (!a) {
      return b || '';
    }
    if (!b) {
      return a || '';
    }
    return a > b ? a : b;
  }

  async _fetchPagedRows(buildQuery, pageSize = 1000) {
    const results = [];
    let from = 0;
    while (true) {
      const { data, error } = await buildQuery().range(from, from + pageSize - 1);
      if (error) {
        throw error;
      }
      if (!data || data.length === 0) {
        break;
      }
      results.push(...data);
      if (data.length < pageSize) {
        break;
      }
      from += pageSize;
    }
    return results;
  }

  async _queuePendingDelete(table, id, userId) {
    if (!table || !id || !userId) {
      return;
    }
    const key = `sync:pending_deletes:${table}`;
    const current = (await this.store.getSetting(key, [])) || [];
    const exists = current.some((item) => item.id === id && item.user_id === userId);
    if (!exists) {
      current.push({ id, user_id: userId });
      await this.store.setSetting(key, current);
    }
  }

  async _removePendingDelete(table, id, userId) {
    if (!table || !id || !userId) {
      return;
    }
    const key = `sync:pending_deletes:${table}`;
    const current = (await this.store.getSetting(key, [])) || [];
    const next = current.filter((item) => item.id !== id || item.user_id !== userId);
    if (next.length !== current.length) {
      await this.store.setSetting(key, next);
    }
  }

  async _flushPendingDeletes(table) {
    const key = `sync:pending_deletes:${table}`;
    const pending = (await this.store.getSetting(key, [])) || [];
    if (!pending.length) {
      return [];
    }
    const remaining = [];
    for (const entry of pending) {
      if (!entry || !entry.user_id || !entry.id) {
        remaining.push(entry);
        continue;
      }
      if (!this.client || !this.user || entry.user_id !== this.user.id) {
        remaining.push(entry);
        continue;
      }
      try {
        await this.client.from(table).delete().eq('id', entry.id).eq('user_id', this.user.id);
      } catch {
        remaining.push(entry);
      }
    }
    await this.store.setSetting(key, remaining);
    return remaining;
  }

  async _storeSession(session) {
    if (!session) {
      return;
    }
    await this.store.setSetting('supabase_session', {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
    this.accessToken = session.access_token;
  }

  _ensureClient() {
    if (!this.client) {
      throw new Error('Supabase not configured.');
    }
  }

  abortSync() {
    this.syncAbort = true;
  }

  _registerAuthListener() {
    if (!this.client || !this.authChangeHandler) {
      return;
    }
    if (this.authSubscription && this.authSubscription.unsubscribe) {
      this.authSubscription.unsubscribe();
    }
    const { data } = this.client.auth.onAuthStateChange(async (event, session) => {
      try {
        this.user = session ? session.user : null;
        if (session) {
          await this._storeSession(session);
          if (this.user) {
            await this.store.attachUser(this.user.id);
          }
        } else {
          await this.store.setSetting('supabase_session', null);
        }
      } catch (error) {
        console.warn('Failed to persist auth session update:', error);
      }
      if (this.authChangeHandler) {
        this.authChangeHandler({ event, session, user: this.user });
      }
    });
    this.authSubscription = data && data.subscription;
  }
}

module.exports = SyncService;
