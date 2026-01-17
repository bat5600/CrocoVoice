const { createClient } = require('@supabase/supabase-js');

const DAY_MS = 24 * 60 * 60 * 1000;
const HISTORY_RETENTION_DAYS = 14;

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
    this._ensureClient();
    if (!this.user) {
      return;
    }
    await this.client.from(table).delete().eq('id', id).eq('user_id', this.user.id);
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
    const warnings = [];
    await this.store.purgeHistory(HISTORY_RETENTION_DAYS);
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }
    await this._purgeRemoteHistory(HISTORY_RETENTION_DAYS);
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    const historyResult = await this._syncTable('history', async () => this.store.listHistory({ limit: 1000 }), {
      table: 'history',
      key: 'history',
      mapRow: (row) => ({
        id: row.id,
        user_id: row.user_id,
        text: row.text,
        raw_text: row.raw_text,
        language: row.language,
        duration_ms: row.duration_ms,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }),
      upsertLocal: (row) => this.store.addHistory(row),
    });
    if (historyResult && historyResult.skipped) {
      warnings.push({ table: 'history', reason: historyResult.reason });
    }
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    const dictionaryResult = await this._syncTable('dictionary', () => this.store.listDictionary(), {
      table: 'dictionary',
      key: 'dictionary',
      mapRow: (row) => ({
        id: row.id,
        user_id: row.user_id,
        from_text: row.from_text,
        to_text: row.to_text,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }),
      upsertLocal: (row) => this.store.upsertDictionary(row),
    });
    if (dictionaryResult && dictionaryResult.skipped) {
      warnings.push({ table: 'dictionary', reason: dictionaryResult.reason });
    }
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    const stylesResult = await this._syncTable('styles', () => this.store.listStyles(), {
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
    if (stylesResult && stylesResult.skipped) {
      warnings.push({ table: 'styles', reason: stylesResult.reason });
    }
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    const notesResult = await this._syncTable('notes', () => this.store.listNotes({ limit: 1000 }), {
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
    if (notesResult && notesResult.skipped) {
      warnings.push({ table: 'notes', reason: notesResult.reason });
    }
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    const settingsResult = await this._syncSettings();
    if (settingsResult && settingsResult.skipped) {
      warnings.push({ table: 'user_settings', reason: settingsResult.reason });
    }
    if (this.syncAbort) {
      return { ok: false, reason: 'aborted' };
    }

    return { ok: true, warnings };
  }

  async _syncSettings() {
    try {
      const cursor = await this.store.getSyncCursor('settings');
      const settingsMeta = await this.store.getSettingsWithMeta();
      const settingsRows = Object.entries(settingsMeta).map(([key, meta]) => ({
        id: `${this.user.id}:${key}`,
        user_id: this.user.id,
        key,
        value: JSON.stringify(meta.value),
        updated_at: meta.updated_at || new Date().toISOString(),
      }));
      if (settingsRows.length) {
        const { error: upsertError } = await this.client.from('user_settings').upsert(settingsRows, { onConflict: 'id' });
        if (upsertError) {
          throw upsertError;
        }
      }

      let remoteQuery = this.client.from('user_settings').select('*').eq('user_id', this.user.id);
      if (cursor) {
        remoteQuery = remoteQuery.gte('updated_at', cursor);
      }
      const { data: remoteRows, error } = await remoteQuery;
      if (error) {
        throw error;
      }

      const localByKey = settingsMeta;
      for (const row of remoteRows || []) {
        const local = localByKey[row.key];
        if (!local || row.updated_at > local.updated_at) {
          await this.store.setSettingWithTimestamp(row.key, JSON.parse(row.value), row.updated_at);
        }
      }
      await this.store.setSyncCursor('settings', new Date().toISOString());
      return { skipped: false };
    } catch (error) {
      if (this._isMissingTableError(error)) {
        return { skipped: true, reason: 'missing_table' };
      }
      throw error;
    }
  }

  async _syncTable(name, getLocalRows, config) {
    try {
      if (this.syncAbort) {
        return { skipped: false };
      }
      const cursor = await this.store.getSyncCursor(config.key);
      const localRows = await getLocalRows();
      if (this.syncAbort) {
        return { skipped: false };
      }
      const localUpdates = cursor
        ? localRows.filter((row) => row.updated_at >= cursor)
        : localRows;

      if (localUpdates.length > 0) {
        const payload = localUpdates.map(config.mapRow);
        const { error: upsertError } = await this.client.from(config.table).upsert(payload, { onConflict: 'id' });
        if (upsertError) {
          throw upsertError;
        }
      }
      if (this.syncAbort) {
        return { skipped: false };
      }

      let remoteQuery = this.client.from(config.table).select('*').eq('user_id', this.user.id);
      if (cursor) {
        remoteQuery = remoteQuery.gte('updated_at', cursor);
      }
      const { data: remoteRows, error } = await remoteQuery;
      if (error) {
        throw error;
      }

      const localById = new Map(localRows.map((row) => [row.id, row]));
      for (const row of remoteRows || []) {
        if (this.syncAbort) {
          return { skipped: false };
        }
        const local = localById.get(row.id);
        if (!local || row.updated_at > local.updated_at) {
          await config.upsertLocal(row);
        }
      }

      await this.store.setSyncCursor(config.key, new Date().toISOString());
      return { skipped: false };
    } catch (error) {
      if (this._isMissingTableError(error)) {
        return { skipped: true, reason: 'missing_table' };
      }
      throw error;
    }
  }

  async _purgeRemoteHistory(days) {
    if (this.syncAbort) {
      return;
    }
    const cutoff = new Date(Date.now() - days * DAY_MS).toISOString();
    await this.client.from('history').delete().lt('created_at', cutoff);
  }

  async _storeSession(session) {
    if (!session) {
      return;
    }
    await this.store.setSetting('supabase_session', {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  }

  _ensureClient() {
    if (!this.client) {
      throw new Error('Supabase not configured.');
    }
  }

  abortSync() {
    this.syncAbort = true;
  }

  _isMissingTableError(error) {
    const message = (error && error.message ? error.message : '').toLowerCase();
    if (message.includes('could not find the table')) {
      return true;
    }
    if (message.includes('relation') && message.includes('does not exist')) {
      return true;
    }
    return false;
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
