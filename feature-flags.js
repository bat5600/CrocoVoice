function normalizeFlags(value) {
  return value && typeof value === 'object' ? value : {};
}

function mergeFeatureFlags({ base, remote, current, streamingDeprecated } = {}) {
  const flags = {
    ...normalizeFlags(base),
    ...normalizeFlags(remote),
    ...normalizeFlags(current),
  };
  if (streamingDeprecated) {
    flags.streaming = false;
    flags.worklet = false;
  }
  return flags;
}

function shouldRefreshRemoteFlags({ cache, ttlMs, now, force } = {}) {
  if (force) {
    return true;
  }
  const fetchedAt = cache && typeof cache.fetchedAt === 'number' ? cache.fetchedAt : 0;
  if (!fetchedAt) {
    return true;
  }
  if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
    return true;
  }
  if (!Number.isFinite(now)) {
    return true;
  }
  return now - fetchedAt >= ttlMs;
}

module.exports = {
  mergeFeatureFlags,
  shouldRefreshRemoteFlags,
};
