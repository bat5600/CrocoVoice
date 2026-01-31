const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DAY_MS = 24 * 60 * 60 * 1000;
const SEARCH_INDEX_VERSION = 1;

function countWords(text) {
  if (!text) {
    return 0;
  }
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isProSubscription(subscription) {
  const plan = subscription?.plan || 'free';
  const status = subscription?.status || 'inactive';
  return plan === 'pro' && (status === 'active' || status === 'trialing');
}

function getHistoryRetentionDays(subscription, freeDays = 14, proDays = 365) {
  return isProSubscription(subscription) ? proDays : freeDays;
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

function isWordChar(value) {
  if (!value) {
    return false;
  }
  return /[\p{L}\p{N}_]/u.test(value);
}

function applyDictionaryEntries(text, entries, options = {}) {
  if (text === null || text === undefined) {
    return text;
  }
  if (!entries || !entries.length) {
    return options.trackUsage ? { text, usage: [] } : text;
  }

  const sourceText = String(text);
  const lowerText = sourceText.toLocaleLowerCase();
  const usedRanges = [];
  const matches = [];
  const usageCounts = new Map();
  const trackUsage = Boolean(options.trackUsage);
  const allowAutoLearned = options.allowAutoLearned === true;
  const allowNonManual = options.allowNonManual === true;

  const isOverlapping = (start, end) => usedRanges.some((range) => start < range.end && end > range.start);
  const isEligibleEntry = (entry) => {
    if (!entry) {
      return false;
    }
    const source = typeof entry.source === 'string' ? entry.source.toLowerCase() : 'manual';
    const autoLearned = Number(entry.auto_learned) || 0;
    if (!allowAutoLearned && autoLearned) {
      return false;
    }
    if (!allowNonManual && source && source !== 'manual') {
      return false;
    }
    return true;
  };

  entries.forEach((entry) => {
    if (!entry || !entry.from_text) {
      return;
    }
    if (!isEligibleEntry(entry)) {
      return;
    }
    const needle = String(entry.from_text);
    const needleLower = needle.toLocaleLowerCase();
    if (!needleLower) {
      return;
    }
    let searchIndex = 0;
    while (true) {
      const matchIndex = lowerText.indexOf(needleLower, searchIndex);
      if (matchIndex === -1) {
        break;
      }
      const endIndex = matchIndex + needleLower.length;
      const beforeChar = matchIndex > 0 ? sourceText[matchIndex - 1] : '';
      const afterChar = endIndex < sourceText.length ? sourceText[endIndex] : '';
      const isWholeWord = !isWordChar(beforeChar) && !isWordChar(afterChar);
      if (!isWholeWord || isOverlapping(matchIndex, endIndex)) {
        searchIndex = matchIndex + 1;
        continue;
      }
      matches.push({
        start: matchIndex,
        end: endIndex,
        replacement: entry.to_text || '',
        entry,
      });
      usedRanges.push({ start: matchIndex, end: endIndex });
      if (trackUsage && entry.id) {
        usageCounts.set(entry.id, (usageCounts.get(entry.id) || 0) + 1);
      }
      searchIndex = endIndex;
    }
  });

  if (!matches.length) {
    return trackUsage ? { text: sourceText, usage: [] } : sourceText;
  }

  matches.sort((a, b) => b.start - a.start);
  let result = sourceText;
  matches.forEach((match) => {
    result = result.slice(0, match.start) + match.replacement + result.slice(match.end);
  });

  if (!trackUsage) {
    return result;
  }
  const usage = Array.from(usageCounts.entries()).map(([id, count]) => ({ id, count }));
  return { text: result, usage };
}

function maxUpdatedAt(rows, seed = '') {
  let max = seed || '';
  (rows || []).forEach((row) => {
    if (row && row.updated_at && row.updated_at > max) {
      max = row.updated_at;
    }
  });
  return max;
}

function recordingStateReducer(current, action) {
  switch (action) {
    case 'start':
      return 'recording';
    case 'stop':
      return 'processing';
    case 'error':
      return 'error';
    case 'idle':
      return 'idle';
    default:
      return current;
  }
}

function buildSearchTokens(query, maxTokens = 12) {
  const raw = typeof query === 'string' ? query.trim() : '';
  if (!raw) {
    return [];
  }
  const tokens = raw
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}\p{N}_-]/gu, ''))
    .filter(Boolean);
  return tokens.slice(0, maxTokens);
}

function buildFtsMatchQuery(query) {
  const tokens = buildSearchTokens(query);
  if (!tokens.length) {
    return '';
  }
  return tokens.join(' ');
}

function buildFallbackSnippet(text, query, windowSize = 140) {
  const raw = typeof text === 'string' ? text : '';
  const needle = typeof query === 'string' ? query.trim().toLowerCase() : '';
  if (!raw) {
    return '';
  }
  if (!needle) {
    return raw.length > windowSize ? `${raw.slice(0, windowSize).trim()}…` : raw;
  }
  const haystack = raw.toLowerCase();
  const index = haystack.indexOf(needle);
  if (index === -1) {
    return raw.length > windowSize ? `${raw.slice(0, windowSize).trim()}…` : raw;
  }
  const start = Math.max(0, index - Math.floor(windowSize / 2));
  const end = Math.min(raw.length, index + needle.length + Math.floor(windowSize / 2));
  const prefix = start > 0 ? '…' : '';
  const suffix = end < raw.length ? '…' : '';
  const before = raw.slice(start, index);
  const match = raw.slice(index, index + needle.length);
  const after = raw.slice(index + needle.length, end);
  return `${prefix}${before}\u0001${match}\u0002${after}${suffix}`;
}

class Store {
  constructor({ userDataPath, defaults }) {
    this.userDataPath = userDataPath;
    this.defaults = defaults;
    this.db = null;
    this._queue = Promise.resolve();
  }

  async init() {
    const dbPath = path.join(this.userDataPath, 'flow.sqlite');
    await this._ensureDir(this.userDataPath);
    this.db = new sqlite3.Database(dbPath);
    // Ensure SQLite executes statements sequentially to avoid contention.
    this.db.serialize();
    await this._run('PRAGMA foreign_keys = ON;');
    await this._createSchema();
    await this._createIndexes();
    await this._migrateFromJsonSettings();
    await this._maybeRebuildSearchIndex();
  }

  async _searchIndexExists() {
    const row = await this._get(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'search_index'",
      [],
    );
    return Boolean(row?.name);
  }

  async _maybeRebuildSearchIndex() {
    if (!(await this._searchIndexExists())) {
      return;
    }
    const version = await this.getSetting('search_index_version', 0);
    const docsRow = await this._get(
      'SELECT (SELECT COUNT(*) FROM notes) + (SELECT COUNT(*) FROM history) AS count',
      [],
    );
    const docsCount = Number.parseInt(docsRow?.count || '0', 10) || 0;

    let indexCount = 0;
    try {
      const indexRow = await this._get('SELECT COUNT(*) AS count FROM search_index', []);
      indexCount = Number.parseInt(indexRow?.count || '0', 10) || 0;
    } catch {
      indexCount = 0;
    }

    if (version !== SEARCH_INDEX_VERSION || (docsCount > 0 && indexCount === 0)) {
      await this.rebuildSearchIndex();
      await this.setSetting('search_index_version', SEARCH_INDEX_VERSION);
    }
  }

  async rebuildSearchIndex() {
    if (!(await this._searchIndexExists())) {
      return { ok: false, reason: 'search_index_unavailable' };
    }
    await this._run('DELETE FROM search_index');
    const notes = await this._all('SELECT id, title, text, created_at, updated_at FROM notes', []);
    const history = await this._all('SELECT id, title, text, created_at, updated_at FROM history', []);
    for (const row of notes) {
      await this._run(
        'INSERT INTO search_index (source, doc_id, title, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        ['notes', row.id, row.title || '', row.text || '', row.created_at || '', row.updated_at || ''],
      );
    }
    for (const row of history) {
      await this._run(
        'INSERT INTO search_index (source, doc_id, title, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        ['history', row.id, row.title || '', row.text || '', row.created_at || '', row.updated_at || ''],
      );
    }
    return { ok: true, notes: notes.length, history: history.length };
  }

  async _upsertSearchDocument(doc) {
    if (!doc || !doc.source || !doc.doc_id) {
      return;
    }
    if (!(await this._searchIndexExists())) {
      return;
    }
    await this._run('DELETE FROM search_index WHERE source = ? AND doc_id = ?', [doc.source, doc.doc_id]);
    await this._run(
      'INSERT INTO search_index (source, doc_id, title, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [
        doc.source,
        doc.doc_id,
        doc.title || '',
        doc.body || '',
        doc.created_at || '',
        doc.updated_at || '',
      ],
    );
  }

  async _deleteSearchDocument(source, docId) {
    if (!source || !docId) {
      return;
    }
    if (!(await this._searchIndexExists())) {
      return;
    }
    await this._run('DELETE FROM search_index WHERE source = ? AND doc_id = ?', [source, docId]);
  }

  async searchDocuments(query, options = {}) {
    const raw = typeof query === 'string' ? query.trim() : '';
    if (!raw) {
      return [];
    }
    const source = options?.source === 'notes' || options?.source === 'history' ? options.source : 'all';
    const limit = Number.isFinite(options?.limit) ? Math.max(1, Math.min(50, options.limit)) : 20;
    const since = typeof options?.since === 'string' && options.since ? options.since : null;
    const match = buildFtsMatchQuery(raw);
    if (!match) {
      return [];
    }

    if (await this._searchIndexExists()) {
      try {
        const params = [match];
        let extra = '';
        if (source !== 'all') {
          extra += ' AND source = ?';
          params.push(source);
        }
        if (since) {
          extra += ' AND created_at >= ?';
          params.push(since);
        }
        params.push(limit);
        const rows = await this._all(
          `SELECT source, doc_id, title, created_at, updated_at,
                  snippet(search_index, 3, char(1), char(2), '…', 12) AS snippet,
                  bm25(search_index) AS score
           FROM search_index
           WHERE search_index MATCH ?${extra}
           ORDER BY score
           LIMIT ?`,
          params,
        );
        return rows.map((row) => ({
          source: row.source,
          doc_id: row.doc_id,
          title: row.title || '',
          created_at: row.created_at || null,
          updated_at: row.updated_at || null,
          snippet: row.snippet || '',
          score: row.score,
        }));
      } catch (error) {
        console.warn('FTS search failed, falling back:', error?.message || error);
      }
    }

    const like = `%${raw.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`;
    const results = [];
    if (source === 'all' || source === 'notes') {
      const noteRows = await this._all(
        'SELECT id, title, text, created_at, updated_at FROM notes WHERE title LIKE ? ESCAPE \'\\\' OR text LIKE ? ESCAPE \'\\\' ORDER BY updated_at DESC LIMIT ?',
        [like, like, limit],
      );
      noteRows.forEach((row) => results.push({
        source: 'notes',
        doc_id: row.id,
        title: row.title || '',
        created_at: row.created_at || null,
        updated_at: row.updated_at || null,
        snippet: buildFallbackSnippet(row.text || '', raw),
        score: null,
      }));
    }
    if (source === 'all' || source === 'history') {
      const remaining = Math.max(0, limit - results.length);
      if (remaining > 0) {
        const histRows = await this._all(
          'SELECT id, title, text, created_at, updated_at FROM history WHERE text LIKE ? ESCAPE \'\\\' ORDER BY created_at DESC LIMIT ?',
          [like, remaining],
        );
        histRows.forEach((row) => results.push({
          source: 'history',
          doc_id: row.id,
          title: row.title || '',
          created_at: row.created_at || null,
          updated_at: row.updated_at || null,
          snippet: buildFallbackSnippet(row.text || '', raw),
          score: null,
        }));
      }
    }

    if (!since) {
      return results;
    }
    return results.filter((row) => !row.created_at || row.created_at >= since);
  }

  async getSettings() {
    const rows = await this._all('SELECT key, value FROM settings');
    const settings = { ...this.defaults };
    rows.forEach((row) => {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    });
    return settings;
  }

  async getSettingsWithMeta() {
    const rows = await this._all('SELECT key, value, updated_at FROM settings');
    const settings = {};
    rows.forEach((row) => {
      try {
        settings[row.key] = { value: JSON.parse(row.value), updated_at: row.updated_at };
      } catch {
        settings[row.key] = { value: row.value, updated_at: row.updated_at };
      }
    });
    return settings;
  }

  async saveSettings(nextSettings) {
    const settings = { ...this.defaults, ...nextSettings };
    const now = new Date().toISOString();
    const entries = Object.entries(settings);
    for (const [key, value] of entries) {
      await this._run(
        'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at',
        [key, JSON.stringify(value), now],
      );
    }
    return settings;
  }

  async getSetting(key, fallback = null) {
    const row = await this._get('SELECT value FROM settings WHERE key = ?', [key]);
    if (!row) {
      return fallback;
    }
    try {
      return JSON.parse(row.value);
    } catch {
      return row.value;
    }
  }

  async setSetting(key, value) {
    const now = new Date().toISOString();
    await this._run(
      'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at',
      [key, JSON.stringify(value), now],
    );
  }

  async setSettingWithTimestamp(key, value, updatedAt) {
    await this._run(
      'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at',
      [key, JSON.stringify(value), updatedAt],
    );
  }

  async listHistory({ limit = 50, since = null } = {}) {
    if (since) {
      return this._all(
        'SELECT * FROM history WHERE created_at >= ? ORDER BY created_at DESC LIMIT ?',
        [since, limit],
      );
    }
    return this._all('SELECT * FROM history ORDER BY created_at DESC LIMIT ?', [limit]);
  }

  async getHistoryById(id) {
    if (!id) {
      return null;
    }
    return this._get('SELECT * FROM history WHERE id = ?', [id]);
  }

  async deleteHistory(id) {
    await this._run('DELETE FROM history WHERE id = ?', [id]);
    await this._deleteSearchDocument('history', id);
  }

  async listNotes({ limit = 50 } = {}) {
    return this._all('SELECT * FROM notes ORDER BY created_at DESC LIMIT ?', [limit]);
  }

  async getNoteById(id) {
    if (!id) {
      return null;
    }
    return this._get('SELECT * FROM notes WHERE id = ?', [id]);
  }

  async getNotesCount() {
    const row = await this._get('SELECT COUNT(*) AS count FROM notes', []);
    return Number.parseInt(row?.count || '0', 10) || 0;
  }

  async addNote(entry) {
    const now = new Date().toISOString();
    const record = {
      id: entry.id,
      user_id: entry.user_id || null,
      title: entry.title || entry.text?.split(/\r?\n/)[0] || 'Untitled note',
      text: entry.text,
      metadata: entry.metadata
        ? (typeof entry.metadata === 'string' ? entry.metadata : JSON.stringify(entry.metadata))
        : null,
      created_at: entry.created_at || now,
      updated_at: entry.updated_at || now,
    };
    await this._run(
      `INSERT INTO notes (id, user_id, title, text, metadata, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         user_id = excluded.user_id,
         title = excluded.title,
         text = excluded.text,
         metadata = excluded.metadata,
         updated_at = excluded.updated_at`,
      [
        record.id,
        record.user_id,
        record.title,
        record.text,
        record.metadata,
        record.created_at,
        record.updated_at,
      ],
    );
    await this._upsertSearchDocument({
      source: 'notes',
      doc_id: record.id,
      title: record.title,
      body: record.text,
      created_at: record.created_at,
      updated_at: record.updated_at,
    });
    return record;
  }

  async deleteNote(id) {
    await this._run('DELETE FROM notes WHERE id = ?', [id]);
    await this._deleteSearchDocument('notes', id);
  }

  async addHistory(entry) {
    const now = new Date().toISOString();
    const record = {
      id: entry.id,
      user_id: entry.user_id || null,
      text: entry.text,
      raw_text: entry.raw_text || entry.text,
      formatted_text: entry.formatted_text || null,
      edited_text: entry.edited_text || null,
      context_json: entry.context_json || null,
      language: entry.language || 'fr',
      duration_ms: entry.duration_ms || null,
      latency_ms: typeof entry.latency_ms === 'number' ? entry.latency_ms : null,
      network_latency_ms: typeof entry.network_latency_ms === 'number' ? entry.network_latency_ms : null,
      divergence_score: typeof entry.divergence_score === 'number' ? entry.divergence_score : null,
      mic_device: entry.mic_device || null,
      fallback_path: entry.fallback_path || null,
      fallback_reason: entry.fallback_reason || null,
      transcription_path: entry.transcription_path || null,
      audio_diagnostics_json: entry.audio_diagnostics_json || null,
      audio_quality_class: entry.audio_quality_class || null,
      title: entry.title || null,
      created_at: entry.created_at || now,
      updated_at: entry.updated_at || now,
    };
    await this._run(
      `INSERT INTO history (id, user_id, text, raw_text, formatted_text, edited_text, context_json, language, duration_ms, latency_ms, network_latency_ms, divergence_score, mic_device, fallback_path, fallback_reason, transcription_path, audio_diagnostics_json, audio_quality_class, title, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         user_id = excluded.user_id,
         text = excluded.text,
         raw_text = excluded.raw_text,
         formatted_text = excluded.formatted_text,
         edited_text = excluded.edited_text,
         context_json = excluded.context_json,
         language = excluded.language,
         duration_ms = excluded.duration_ms,
         latency_ms = excluded.latency_ms,
         network_latency_ms = excluded.network_latency_ms,
         divergence_score = excluded.divergence_score,
         mic_device = excluded.mic_device,
         fallback_path = excluded.fallback_path,
         fallback_reason = excluded.fallback_reason,
         transcription_path = excluded.transcription_path,
         audio_diagnostics_json = excluded.audio_diagnostics_json,
         audio_quality_class = excluded.audio_quality_class,
         title = excluded.title,
         updated_at = excluded.updated_at`,
      [
        record.id,
        record.user_id,
        record.text,
        record.raw_text,
        record.formatted_text,
        record.edited_text,
        record.context_json,
        record.language,
        record.duration_ms,
        record.latency_ms,
        record.network_latency_ms,
        record.divergence_score,
        record.mic_device,
        record.fallback_path,
        record.fallback_reason,
        record.transcription_path,
        record.audio_diagnostics_json,
        record.audio_quality_class,
        record.title,
        record.created_at,
        record.updated_at,
      ],
    );
    await this._upsertSearchDocument({
      source: 'history',
      doc_id: record.id,
      title: record.title || '',
      body: record.text,
      created_at: record.created_at,
      updated_at: record.updated_at,
    });
    return record;
  }

  async listNotifications({ limit = 100 } = {}) {
    return this._all('SELECT * FROM notifications ORDER BY created_at DESC LIMIT ?', [limit]);
  }

  async upsertNotification(entry) {
    const now = new Date().toISOString();
    const record = {
      id: entry.id,
      title: entry.title || '',
      body: entry.body || '',
      level: entry.level || 'info',
      source: entry.source || 'remote',
      url: entry.url || null,
      read_at: entry.read_at || null,
      archived_at: entry.archived_at || null,
      created_at: entry.created_at || now,
      updated_at: entry.updated_at || now,
    };
    await this._run(
      `INSERT INTO notifications (id, title, body, level, source, url, read_at, archived_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         body = excluded.body,
         level = excluded.level,
         source = excluded.source,
         url = excluded.url,
         read_at = excluded.read_at,
         archived_at = excluded.archived_at,
         updated_at = excluded.updated_at`,
      [
        record.id,
        record.title,
        record.body,
        record.level,
        record.source,
        record.url,
        record.read_at,
        record.archived_at,
        record.created_at,
        record.updated_at,
      ],
    );
    return record;
  }

  async markNotificationRead(id) {
    const now = new Date().toISOString();
    await this._run('UPDATE notifications SET read_at = ? WHERE id = ?', [now, id]);
  }

  async archiveNotification(id) {
    const now = new Date().toISOString();
    await this._run('UPDATE notifications SET archived_at = ? WHERE id = ?', [now, id]);
  }

  async clearNotifications() {
    await this._run('DELETE FROM notifications');
  }

  async purgeNotifications(days = 30) {
    const cutoff = new Date(Date.now() - days * DAY_MS).toISOString();
    await this._run('DELETE FROM notifications WHERE created_at < ?', [cutoff]);
  }

  async listTelemetryEvents({ limit = 200 } = {}) {
    return this._all('SELECT * FROM telemetry_events ORDER BY created_at DESC LIMIT ?', [limit]);
  }

  async addTelemetryEvent(entry) {
    const now = new Date().toISOString();
    const record = {
      id: entry.id,
      event: entry.event || 'event',
      payload: entry.payload ? (typeof entry.payload === 'string' ? entry.payload : JSON.stringify(entry.payload)) : null,
      created_at: entry.created_at || now,
    };
    await this._run(
      `INSERT INTO telemetry_events (id, event, payload, created_at)
       VALUES (?, ?, ?, ?)`,
      [record.id, record.event, record.payload, record.created_at],
    );
    return record;
  }

  async listCrocOmniConversations({ limit = 50 } = {}) {
    return this._all(
      'SELECT * FROM crocomni_conversations ORDER BY updated_at DESC LIMIT ?',
      [limit],
    );
  }

  async createCrocOmniConversation(entry) {
    const now = new Date().toISOString();
    const record = {
      id: entry.id,
      title: entry.title || 'Nouvelle conversation',
      archived_at: entry.archived_at || null,
      created_at: entry.created_at || now,
      updated_at: entry.updated_at || now,
    };
    await this._run(
      `INSERT INTO crocomni_conversations (id, title, archived_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         archived_at = excluded.archived_at,
         updated_at = excluded.updated_at`,
      [record.id, record.title, record.archived_at, record.created_at, record.updated_at],
    );
    return record;
  }

  async archiveCrocOmniConversation(id) {
    const now = new Date().toISOString();
    await this._run(
      'UPDATE crocomni_conversations SET archived_at = ?, updated_at = ? WHERE id = ?',
      [now, now, id],
    );
  }

  async listCrocOmniMessages(conversationId) {
    return this._all(
      'SELECT * FROM crocomni_messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId],
    );
  }

  async addCrocOmniMessage(entry) {
    const now = new Date().toISOString();
    const record = {
      id: entry.id,
      conversation_id: entry.conversation_id,
      role: entry.role || 'user',
      content: entry.content || '',
      context_used: entry.context_used ? 1 : 0,
      created_at: entry.created_at || now,
    };
    await this._run(
      `INSERT INTO crocomni_messages (id, conversation_id, role, content, context_used, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.conversation_id,
        record.role,
        record.content,
        record.context_used,
        record.created_at,
      ],
    );
    await this._run('UPDATE crocomni_conversations SET updated_at = ? WHERE id = ?', [now, record.conversation_id]);
    return record;
  }

  async purgeHistory(days = 14) {
    const cutoff = new Date(Date.now() - days * DAY_MS).toISOString();
    await this._run('DELETE FROM history WHERE created_at < ?', [cutoff]);
    if (await this._searchIndexExists()) {
      await this._run('DELETE FROM search_index WHERE source = ? AND created_at < ?', ['history', cutoff]);
    }
  }

  async purgeContext(days = 30) {
    const cutoff = new Date(Date.now() - days * DAY_MS).toISOString();
    await this._run('UPDATE history SET context_json = NULL WHERE context_json IS NOT NULL AND created_at < ?', [cutoff]);
  }

  async clearHistory() {
    await this._run('DELETE FROM history');
    if (await this._searchIndexExists()) {
      await this._run('DELETE FROM search_index WHERE source = ?', ['history']);
    }
  }

  async clearContext() {
    await this._run('UPDATE history SET context_json = NULL WHERE context_json IS NOT NULL');
  }

  async clearSensitiveData() {
    await this._run('DELETE FROM history');
    await this._run('DELETE FROM dictionary');
    await this._run('DELETE FROM styles');
    await this._run('DELETE FROM notes');
    await this._run('DELETE FROM snippets');
    if (await this._searchIndexExists()) {
      await this._run('DELETE FROM search_index');
    }
    await this._run("DELETE FROM settings WHERE key = 'supabase_session' OR key LIKE 'sync:%'");
  }

  async getHistoryStats(days = 14) {
    const cutoff = new Date(Date.now() - days * DAY_MS).toISOString();
    const rows = await this._all('SELECT text, created_at FROM history WHERE created_at >= ?', [cutoff]);
    const words = rows.reduce((acc, row) => acc + countWords(row.text), 0);
    const dayKeys = rows.map((row) => row.created_at.slice(0, 10));
    const activeDays = new Set(dayKeys);
    const daysActive = activeDays.size;

    const utcDayKey = (date) => date.toISOString().slice(0, 10);
    const todayKey = utcDayKey(new Date());
    const yesterdayKey = utcDayKey(new Date(Date.now() - DAY_MS));

    const anchorKey = activeDays.has(todayKey) ? todayKey : (activeDays.has(yesterdayKey) ? yesterdayKey : null);
    let dayStreak = 0;
    if (anchorKey) {
      let cursor = new Date(`${anchorKey}T00:00:00.000Z`);
      while (activeDays.has(utcDayKey(cursor))) {
        dayStreak += 1;
        cursor = new Date(cursor.getTime() - DAY_MS);
      }
    }

    return {
      words,
      daysActive,
      dayStreak,
      total: rows.length,
    };
  }

  async listDictionary() {
    return this._all('SELECT * FROM dictionary ORDER BY updated_at DESC');
  }

  async upsertDictionary(entry) {
    const now = new Date().toISOString();
    const existing = entry.id
      ? await this._get('SELECT frequency_used, last_used, source, auto_learned, created_at FROM dictionary WHERE id = ?', [entry.id])
      : null;
    const record = {
      id: entry.id,
      user_id: entry.user_id || null,
      from_text: entry.from_text,
      to_text: entry.to_text,
      frequency_used: typeof entry.frequency_used === 'number'
        ? entry.frequency_used
        : (existing ? existing.frequency_used : 0),
      last_used: entry.last_used !== undefined
        ? entry.last_used
        : (existing ? existing.last_used : null),
      source: entry.source !== undefined
        ? entry.source
        : (existing ? existing.source : 'manual'),
      auto_learned: typeof entry.auto_learned === 'number'
        ? entry.auto_learned
        : (existing ? existing.auto_learned : 0),
      created_at: entry.created_at || existing?.created_at || now,
      updated_at: entry.updated_at || now,
    };
    await this._run(
      `INSERT INTO dictionary (id, user_id, from_text, to_text, frequency_used, last_used, source, auto_learned, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         user_id = excluded.user_id,
         from_text = excluded.from_text,
         to_text = excluded.to_text,
         frequency_used = excluded.frequency_used,
         last_used = excluded.last_used,
         source = excluded.source,
         auto_learned = excluded.auto_learned,
         updated_at = excluded.updated_at`,
      [
        record.id,
        record.user_id,
        record.from_text,
        record.to_text,
        record.frequency_used,
        record.last_used,
        record.source,
        record.auto_learned,
        record.created_at,
        record.updated_at,
      ],
    );
    return record;
  }

  async updateDictionaryUsage(usageList) {
    if (!usageList || !usageList.length) {
      return;
    }
    const now = new Date().toISOString();
    await Promise.all(usageList.map((usage) => {
      if (!usage || !usage.id) {
        return null;
      }
      const increment = Number.isFinite(usage.count) ? usage.count : 1;
      return this._run(
        `UPDATE dictionary
         SET frequency_used = COALESCE(frequency_used, 0) + ?,
             last_used = ?,
             source = COALESCE(source, 'manual'),
             auto_learned = COALESCE(auto_learned, 0),
             updated_at = ?
         WHERE id = ?`,
        [increment, now, now, usage.id],
      );
    }));
  }

  async deleteDictionary(id) {
    await this._run('DELETE FROM dictionary WHERE id = ?', [id]);
  }

  async listSnippets() {
    return this._all('SELECT * FROM snippets ORDER BY updated_at DESC');
  }

  async upsertSnippet(entry) {
    const now = new Date().toISOString();
    const record = {
      id: entry.id,
      user_id: entry.user_id || null,
      cue: entry.cue,
      cue_norm: entry.cue_norm,
      template: entry.template,
      description: entry.description || null,
      created_at: entry.created_at || now,
      updated_at: entry.updated_at || now,
    };
    await this._run(
      `INSERT INTO snippets (id, user_id, cue, cue_norm, template, description, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         user_id = excluded.user_id,
         cue = excluded.cue,
         cue_norm = excluded.cue_norm,
         template = excluded.template,
         description = excluded.description,
         updated_at = excluded.updated_at`,
      [
        record.id,
        record.user_id,
        record.cue,
        record.cue_norm,
        record.template,
        record.description,
        record.created_at,
        record.updated_at,
      ],
    );
    return record;
  }

  async deleteSnippet(id) {
    await this._run('DELETE FROM snippets WHERE id = ?', [id]);
  }

  async listStyles() {
    return this._all('SELECT * FROM styles ORDER BY updated_at DESC');
  }

  async upsertStyle(entry) {
    const now = new Date().toISOString();
    const record = {
      id: entry.id,
      user_id: entry.user_id || null,
      name: entry.name,
      prompt: entry.prompt,
      created_at: entry.created_at || now,
      updated_at: entry.updated_at || now,
    };
    await this._run(
      `INSERT INTO styles (id, user_id, name, prompt, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         user_id = excluded.user_id,
         name = excluded.name,
         prompt = excluded.prompt,
         updated_at = excluded.updated_at`,
      [
        record.id,
        record.user_id,
        record.name,
        record.prompt,
        record.created_at,
        record.updated_at,
      ],
    );
    return record;
  }

  async deleteStyle(id) {
    await this._run('DELETE FROM styles WHERE id = ?', [id]);
  }

  async attachUser(userId) {
    await this._run('UPDATE history SET user_id = ? WHERE user_id IS NULL', [userId]);
    await this._run('UPDATE dictionary SET user_id = ? WHERE user_id IS NULL', [userId]);
    await this._run('UPDATE styles SET user_id = ? WHERE user_id IS NULL', [userId]);
    await this._run('UPDATE notes SET user_id = ? WHERE user_id IS NULL', [userId]);
    await this._run('UPDATE snippets SET user_id = ? WHERE user_id IS NULL', [userId]);
  }

  async getSyncCursor(key) {
    return this.getSetting(`sync:${key}`, null);
  }

  async setSyncCursor(key, value) {
    await this.setSetting(`sync:${key}`, value);
  }

  async _createSchema() {
    await this._run(`CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
    await this._run(`CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      text TEXT NOT NULL,
      raw_text TEXT NOT NULL,
      formatted_text TEXT,
      edited_text TEXT,
      context_json TEXT,
      language TEXT NOT NULL,
      duration_ms INTEGER,
      latency_ms INTEGER,
      network_latency_ms INTEGER,
      divergence_score REAL,
      mic_device TEXT,
      fallback_path TEXT,
      fallback_reason TEXT,
      transcription_path TEXT,
      audio_diagnostics_json TEXT,
      audio_quality_class TEXT,
      title TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
    await this._ensureColumn('history', 'title', 'title TEXT');
    await this._ensureColumn('history', 'formatted_text', 'formatted_text TEXT');
    await this._ensureColumn('history', 'edited_text', 'edited_text TEXT');
    await this._ensureColumn('history', 'context_json', 'context_json TEXT');
    await this._ensureColumn('history', 'latency_ms', 'latency_ms INTEGER');
    await this._ensureColumn('history', 'network_latency_ms', 'network_latency_ms INTEGER');
    await this._ensureColumn('history', 'divergence_score', 'divergence_score REAL');
    await this._ensureColumn('history', 'mic_device', 'mic_device TEXT');
    await this._ensureColumn('history', 'fallback_path', 'fallback_path TEXT');
    await this._ensureColumn('history', 'fallback_reason', 'fallback_reason TEXT');
    await this._ensureColumn('history', 'transcription_path', 'transcription_path TEXT');
    await this._ensureColumn('history', 'audio_diagnostics_json', 'audio_diagnostics_json TEXT');
    await this._ensureColumn('history', 'audio_quality_class', 'audio_quality_class TEXT');
    await this._run(`CREATE TABLE IF NOT EXISTS dictionary (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      from_text TEXT NOT NULL,
      to_text TEXT NOT NULL,
      frequency_used INTEGER DEFAULT 0,
      last_used TEXT,
      source TEXT,
      auto_learned INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
    await this._ensureColumn('dictionary', 'frequency_used', 'frequency_used INTEGER DEFAULT 0');
    await this._ensureColumn('dictionary', 'last_used', 'last_used TEXT');
    await this._ensureColumn('dictionary', 'source', 'source TEXT');
    await this._ensureColumn('dictionary', 'auto_learned', 'auto_learned INTEGER DEFAULT 0');
    await this._run('UPDATE dictionary SET frequency_used = 0 WHERE frequency_used IS NULL');
    await this._run('UPDATE dictionary SET auto_learned = 0 WHERE auto_learned IS NULL');
    await this._run("UPDATE dictionary SET source = 'manual' WHERE source IS NULL");
    await this._run(`CREATE TABLE IF NOT EXISTS styles (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      prompt TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
    await this._run(`CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT NOT NULL,
      text TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
    await this._run(`CREATE TABLE IF NOT EXISTS snippets (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      cue TEXT NOT NULL,
      cue_norm TEXT NOT NULL,
      template TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
    await this._run(`CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      level TEXT,
      source TEXT,
      url TEXT,
      read_at TEXT,
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
    await this._run(`CREATE TABLE IF NOT EXISTS telemetry_events (
      id TEXT PRIMARY KEY,
      event TEXT NOT NULL,
      payload TEXT,
      created_at TEXT NOT NULL
    )`);
    await this._run(`CREATE TABLE IF NOT EXISTS crocomni_conversations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
    await this._run(`CREATE TABLE IF NOT EXISTS crocomni_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      context_used INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY(conversation_id) REFERENCES crocomni_conversations(id) ON DELETE CASCADE
    )`);

    try {
      await this._run(`CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
        source UNINDEXED,
        doc_id UNINDEXED,
        title,
        body,
        created_at UNINDEXED,
        updated_at UNINDEXED,
        tokenize = 'unicode61 remove_diacritics 2'
      )`);
    } catch (error) {
      console.warn('FTS5 unavailable, CrocOmni search will fall back to LIKE.', error?.message || error);
    }
  }

  async _createIndexes() {
    await this._run('CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at)');
    await this._run('CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at)');
    await this._run('CREATE INDEX IF NOT EXISTS idx_dictionary_updated_at ON dictionary(updated_at)');
    await this._run('CREATE INDEX IF NOT EXISTS idx_styles_updated_at ON styles(updated_at)');
    await this._run('CREATE INDEX IF NOT EXISTS idx_snippets_updated_at ON snippets(updated_at)');
    await this._run('CREATE INDEX IF NOT EXISTS idx_snippets_cue_norm ON snippets(cue_norm)');
    await this._run('CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at)');
    await this._run('CREATE INDEX IF NOT EXISTS idx_telemetry_created_at ON telemetry_events(created_at)');
    await this._run('CREATE INDEX IF NOT EXISTS idx_crocomni_conversations_updated_at ON crocomni_conversations(updated_at)');
    await this._run('CREATE INDEX IF NOT EXISTS idx_crocomni_messages_conversation_id ON crocomni_messages(conversation_id)');
  }

  async _ensureColumn(table, columnName, definition) {
    const rows = await this._all(`PRAGMA table_info(${table})`);
    const exists = rows.some((row) => row.name === columnName);
    if (!exists) {
      await this._run(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
    }
  }

  async _migrateFromJsonSettings() {
    const jsonPath = path.join(this.userDataPath, 'settings.json');
    if (!fs.existsSync(jsonPath)) {
      return;
    }
    try {
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      const parsed = JSON.parse(raw);
      await this.saveSettings(parsed);
    } catch (error) {
      console.error('Failed to migrate settings.json:', error);
    }
  }

  _ensureDir(dirPath) {
    return fs.promises.mkdir(dirPath, { recursive: true });
  }

  _enqueue(task) {
    const run = this._queue.then(task, task);
    this._queue = run.catch(() => {});
    return run;
  }

  _run(sql, params = []) {
    return this._enqueue(() => new Promise((resolve, reject) => {
      this.db.run(sql, params, function onRun(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this);
      });
    }));
  }

  _get(sql, params = []) {
    return this._enqueue(() => new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row || null);
      });
    }));
  }

  _all(sql, params = []) {
    return this._enqueue(() => new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows || []);
      });
    }));
  }
}

Store.countWords = countWords;
Store.isProSubscription = isProSubscription;
Store.getHistoryRetentionDays = getHistoryRetentionDays;
Store.getWeekStartUTC = getWeekStartUTC;
Store.getNextWeekStartUTC = getNextWeekStartUTC;
Store.applyDictionaryEntries = applyDictionaryEntries;
Store.maxUpdatedAt = maxUpdatedAt;
Store.recordingStateReducer = recordingStateReducer;

module.exports = Store;
