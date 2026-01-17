const fs = require('fs');
const path = require('path');

const AUTH_CONFIG_PATH = path.join(__dirname, 'auth.json');

const DEFAULT_CONFIG = {
  signupUrl: 'https://app.supabase.com/project/your-project-id/auth/signup',
};

function loadFileConfig() {
  try {
    if (!fs.existsSync(AUTH_CONFIG_PATH)) {
      return {};
    }
    const raw = fs.readFileSync(AUTH_CONFIG_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.warn('[auth-config] failed to load auth.json, using defaults', error);
    return {};
  }
}

function getAuthConfig() {
  const fileConfig = loadFileConfig();
  const envUrl = process.env.AUTH_SIGNUP_URL;
  return {
    ...DEFAULT_CONFIG,
    ...fileConfig,
    signupUrl: envUrl || fileConfig.signupUrl || DEFAULT_CONFIG.signupUrl,
  };
}

module.exports = {
  getAuthConfig,
};
