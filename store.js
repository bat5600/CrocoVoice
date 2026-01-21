const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DAY_MS = 24 * 60 * 60 * 1000;

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
    await this._migrateFromJsonSettings();
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

  async deleteHistory(id) {
    await this._run('DELETE FROM history WHERE id = ?', [id]);
  }

  async listNotes({ limit = 50 } = {}) {
    return this._all('SELECT * FROM notes ORDER BY created_at DESC LIMIT ?', [limit]);
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
    return record;
  }

  async deleteNote(id) {
    await this._run('DELETE FROM notes WHERE id = ?', [id]);
  }

  async addHistory(entry) {
    const now = new Date().toISOString();
    const record = {
      id: entry.id,
      user_id: entry.user_id || null,
      text: entry.text,
      raw_text: entry.raw_text || entry.text,
      language: entry.language || 'fr',
      duration_ms: entry.duration_ms || null,
      title: entry.title || null,
      created_at: entry.created_at || now,
      updated_at: entry.updated_at || now,
    };
    await this._run(
      `INSERT INTO history (id, user_id, text, raw_text, language, duration_ms, title, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         user_id = excluded.user_id,
         text = excluded.text,
         raw_text = excluded.raw_text,
         language = excluded.language,
         duration_ms = excluded.duration_ms,
         title = excluded.title,
         updated_at = excluded.updated_at`,
      [
        record.id,
        record.user_id,
        record.text,
        record.raw_text,
        record.language,
        record.duration_ms,
        record.title,
        record.created_at,
        record.updated_at,
      ],
    );
    return record;
  }

  async purgeHistory(days = 14) {
    const cutoff = new Date(Date.now() - days * DAY_MS).toISOString();
    await this._run('DELETE FROM history WHERE created_at < ?', [cutoff]);
  }

  async clearHistory() {
    await this._run('DELETE FROM history');
  }

  async clearSensitiveData() {
    await this._run('DELETE FROM history');
    await this._run('DELETE FROM dictionary');
    await this._run('DELETE FROM styles');
    await this._run('DELETE FROM notes');
    await this._run("DELETE FROM settings WHERE key = 'supabase_session' OR key LIKE 'sync:%'");
  }

  async getHistoryStats(days = 14) {
    const cutoff = new Date(Date.now() - days * DAY_MS).toISOString();
    const rows = await this._all('SELECT text, created_at FROM history WHERE created_at >= ?', [cutoff]);
    const words = rows.reduce((acc, row) => acc + this._countWords(row.text), 0);
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
    const record = {
      id: entry.id,
      user_id: entry.user_id || null,
      from_text: entry.from_text,
      to_text: entry.to_text,
      created_at: entry.created_at || now,
      updated_at: entry.updated_at || now,
    };
    await this._run(
      `INSERT INTO dictionary (id, user_id, from_text, to_text, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         user_id = excluded.user_id,
         from_text = excluded.from_text,
         to_text = excluded.to_text,
         updated_at = excluded.updated_at`,
      [
        record.id,
        record.user_id,
        record.from_text,
        record.to_text,
        record.created_at,
        record.updated_at,
      ],
    );
    return record;
  }

  async deleteDictionary(id) {
    await this._run('DELETE FROM dictionary WHERE id = ?', [id]);
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
      language TEXT NOT NULL,
      duration_ms INTEGER,
      title TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
    await this._ensureColumn('history', 'title', 'title TEXT');
    await this._run(`CREATE TABLE IF NOT EXISTS dictionary (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      from_text TEXT NOT NULL,
      to_text TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
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

  _countWords(text) {
    if (!text) {
      return 0;
    }
    return text.trim().split(/\s+/).filter(Boolean).length;
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

module.exports = Store;
