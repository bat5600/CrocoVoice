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
