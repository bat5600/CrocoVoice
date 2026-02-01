const assert = require('assert');
const {
  countWords,
  isProSubscription,
  getHistoryRetentionDays,
  getWeekStartUTC,
  getNextWeekStartUTC,
  applyDictionaryEntries,
  maxUpdatedAt,
  recordingStateReducer,
} = require('./store');
const { mergeFeatureFlags, shouldRefreshRemoteFlags } = require('./feature-flags');
const { sanitizeContextForExport, redactSensitiveText, redactContextPayload } = require('./telemetry-utils');

function runTest(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`fail - ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

runTest('recording state transitions', () => {
  assert.strictEqual(recordingStateReducer('idle', 'start'), 'recording');
  assert.strictEqual(recordingStateReducer('recording', 'stop'), 'processing');
  assert.strictEqual(recordingStateReducer('processing', 'error'), 'error');
  assert.strictEqual(recordingStateReducer('error', 'idle'), 'idle');
});

runTest('quota helpers', () => {
  assert.strictEqual(countWords(''), 0);
  assert.strictEqual(countWords('hello world'), 2);
  const sampleDate = new Date('2024-01-03T12:00:00.000Z');
  const weekStart = getWeekStartUTC(sampleDate).toISOString();
  assert.strictEqual(weekStart, '2024-01-01T00:00:00.000Z');
  const nextWeekStart = getNextWeekStartUTC(sampleDate).toISOString();
  assert.strictEqual(nextWeekStart, '2024-01-08T00:00:00.000Z');
});

runTest('subscription retention logic', () => {
  const free = { plan: 'free', status: 'inactive' };
  const pro = { plan: 'pro', status: 'active' };
  assert.strictEqual(isProSubscription(free), false);
  assert.strictEqual(isProSubscription(pro), true);
  assert.strictEqual(getHistoryRetentionDays(free, 14, 365), 14);
  assert.strictEqual(getHistoryRetentionDays(pro, 14, 365), 365);
});

runTest('dictionary application', () => {
  const entries = [
    { id: '1', from_text: 'hello', to_text: 'hi' },
    { id: '2', from_text: 'world', to_text: 'earth' },
  ];
  assert.strictEqual(applyDictionaryEntries('hello world', entries), 'hi earth');
  assert.strictEqual(applyDictionaryEntries('HELLO World', entries), 'hi earth');
});

runTest('dictionary matching rules', () => {
  const entries = [
    { id: '1', from_text: 'foobar', to_text: 'baz' },
    { id: '2', from_text: 'foo', to_text: 'bar' },
    { id: '3', from_text: 'he', to_text: 'she' },
    { id: '4', from_text: 'abc', to_text: 'def' },
    { id: '5', from_text: 'def', to_text: 'ghi' },
  ];
  assert.strictEqual(applyDictionaryEntries('foobar foo', entries), 'baz bar');
  assert.strictEqual(applyDictionaryEntries('the hero', entries), 'the hero');
  assert.strictEqual(applyDictionaryEntries('abc', entries), 'def');
});

runTest('sync cursor max updated_at', () => {
  const rows = [
    { updated_at: '2024-01-01T00:00:00.000Z' },
    { updated_at: '2024-01-03T00:00:00.000Z' },
  ];
  assert.strictEqual(maxUpdatedAt(rows, '2024-01-02T00:00:00.000Z'), '2024-01-03T00:00:00.000Z');
});

runTest('feature flag precedence and deprecation', () => {
  const base = { streaming: true, worklet: true, alpha: false };
  const remote = { alpha: true, beta: true };
  const current = { beta: false };
  const merged = mergeFeatureFlags({ base, remote, current, streamingDeprecated: false });
  assert.deepStrictEqual(merged, {
    streaming: true,
    worklet: true,
    alpha: true,
    beta: false,
  });

  const deprecated = mergeFeatureFlags({ base, remote, current, streamingDeprecated: true });
  assert.strictEqual(deprecated.streaming, false);
  assert.strictEqual(deprecated.worklet, false);
  assert.strictEqual(deprecated.alpha, true);
  assert.strictEqual(deprecated.beta, false);
});

runTest('feature flag TTL refresh decisions', () => {
  const cache = { fetchedAt: 1000 };
  assert.strictEqual(
    shouldRefreshRemoteFlags({ cache, ttlMs: 5000, now: 2000, force: false }),
    false
  );
  assert.strictEqual(
    shouldRefreshRemoteFlags({ cache, ttlMs: 5000, now: 7000, force: false }),
    true
  );
  assert.strictEqual(
    shouldRefreshRemoteFlags({ cache, ttlMs: 0, now: 2000, force: false }),
    true
  );
  assert.strictEqual(
    shouldRefreshRemoteFlags({ cache, ttlMs: 5000, now: 2000, force: true }),
    true
  );
});

runTest('telemetry context redaction', () => {
  const context = {
    axText: 'secret',
    textboxText: 'private',
    screenshot: 'binary',
    file: { path: '/tmp/file.txt', name: 'file.txt' },
    keep: 'ok',
  };
  const redacted = sanitizeContextForExport({ ...context }, false);
  assert.strictEqual(redacted.axText, undefined);
  assert.strictEqual(redacted.textboxText, undefined);
  assert.strictEqual(redacted.screenshot, undefined);
  assert.deepStrictEqual(redacted.file, { name: 'file.txt' });
  assert.strictEqual(redacted.keep, 'ok');

  const sensitive = sanitizeContextForExport({ ...context }, true);
  assert.strictEqual(sensitive.axText, 'secret');
  assert.strictEqual(sensitive.textboxText, 'private');
  assert.strictEqual(sensitive.screenshot, 'binary');
  assert.deepStrictEqual(sensitive.file, { path: '/tmp/file.txt', name: 'file.txt' });
});

runTest('telemetry sensitive text redaction', () => {
  const sample = 'Email me at test@example.com or call +1 (555) 111-2222 ref 123456.';
  const redacted = redactSensitiveText(sample);
  assert.ok(!redacted.includes('test@example.com'));
  assert.ok(!redacted.includes('555'));
  assert.ok(!redacted.includes('123456'));
});

runTest('telemetry context payload redaction', () => {
  const payload = {
    appName: 'Mail test@example.com',
    windowTitle: 'Call +1 (555) 111-2222',
    url: 'https://example.com/123456',
    axText: 'test@example.com',
    textboxText: 'order 123456',
    keep: 'ok',
  };
  const redacted = redactContextPayload(payload);
  assert.ok(!redacted.appName.includes('test@example.com'));
  assert.ok(!redacted.windowTitle.includes('555'));
  assert.ok(!redacted.url.includes('123456'));
  assert.ok(!redacted.axText.includes('test@example.com'));
  assert.ok(!redacted.textboxText.includes('123456'));
  assert.strictEqual(redacted.keep, 'ok');
});
