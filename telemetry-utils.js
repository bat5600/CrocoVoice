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
  if (next.file && typeof next.file === 'object' && next.file.path) {
    next.file = { ...next.file };
    delete next.file.path;
  }
  return next;
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

module.exports = {
  sanitizeContextForExport,
  redactSensitiveText,
  redactContextPayload,
};
