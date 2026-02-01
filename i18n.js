(function () {
  const listeners = new Set();
  const missingKeys = new Set();
  const state = {
    language: 'en',
    messages: {},
  };

  function normalizeLanguage(value) {
    return value === 'fr' ? 'fr' : 'en';
  }

  function setMessages(messages) {
    state.messages = messages || {};
  }

  function formatMessage(template, vars) {
    if (!vars) {
      return template;
    }
    return String(template).replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (Object.prototype.hasOwnProperty.call(vars, key)) {
        return String(vars[key]);
      }
      return match;
    });
  }

  function warnMissing(key, lang) {
    const missingKey = `${key}:${lang}`;
    if (missingKeys.has(missingKey)) {
      return;
    }
    missingKeys.add(missingKey);
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(`[i18n] Missing ${lang} translation for "${key}"`);
    }
  }

  function t(key, vars, fallback) {
    const entry = state.messages && state.messages[key];
    if (!entry) {
      warnMissing(key, state.language);
      return fallback !== undefined ? fallback : key;
    }
    const lang = state.language;
    let value = entry[lang];
    if (!value) {
      if (lang !== 'en') {
        warnMissing(key, lang);
      }
      value = entry.en;
    }
    if (value === undefined || value === null) {
      return fallback !== undefined ? fallback : key;
    }
    return formatMessage(value, vars);
  }

  function apply(root = document) {
    if (!root || !root.querySelectorAll) {
      return;
    }
    root.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) {
        return;
      }
      const attr = el.getAttribute('data-i18n-attr');
      const fallback = attr ? el.getAttribute(attr) : el.textContent;
      const value = t(key, null, fallback || '');
      if (attr) {
        el.setAttribute(attr, value);
      } else if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });
  }

  function setLanguage(language, root) {
    state.language = normalizeLanguage(language);
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = state.language;
    }
    apply(root || document);
    listeners.forEach((listener) => {
      listener(state.language);
    });
    return state.language;
  }

  function onChange(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getLanguage() {
    return state.language;
  }

  window.CrocoI18n = {
    apply,
    getLanguage,
    normalizeLanguage,
    onChange,
    setLanguage,
    setMessages,
    t,
  };
})();
