// Shared state and DOM references
const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item[data-view]');
const settingsInputs = document.querySelectorAll('[data-setting]');
const apiKeyStatus = document.getElementById('apiKeyStatus');
const historyList = document.getElementById('historyList');
const historyEmpty = document.getElementById('historyEmpty');
const notesList = document.getElementById('notesList');
const notesEmpty = document.getElementById('notesEmpty');
const dictionaryList = document.getElementById('dictionaryList');
const dictionaryEmpty = document.getElementById('dictionaryEmpty');
const styleList = document.getElementById('styleList');
const styleEmpty = document.getElementById('styleEmpty');
const authPanel = document.getElementById('authPanel');
const microphoneSelect = document.getElementById('microphoneSelect');
const misspellingToggle = document.getElementById('misspellingToggle');
const dictionaryWordInput = document.getElementById('dictionaryWordInput');
const dictionaryCorrectionInput = document.getElementById('dictionaryCorrectionInput');
const dictionaryCancelButton = document.getElementById('dictionaryCancelButton');
const dictionaryAddButton = document.getElementById('dictionaryAddButton');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');
const onboardingOverlay = document.getElementById('onboardingOverlay');
const onboardingTitle = document.getElementById('onboardingTitle');
const onboardingSubtitle = document.getElementById('onboardingSubtitle');
const onboardingStatus = document.getElementById('onboardingStatus');
const onboardingSteps = document.getElementById('onboardingSteps');
const onboardingMicSection = document.getElementById('onboardingMicSection');
const onboardingMicSelect = document.getElementById('onboardingMicSelect');
const onboardingWaveform = document.getElementById('onboardingWaveform');
const onboardingMicStart = document.getElementById('onboardingMicStart');
const onboardingMicStop = document.getElementById('onboardingMicStop');
const onboardingDeliverySection = document.getElementById('onboardingDeliverySection');
const onboardingPasteTarget = document.getElementById('onboardingPasteTarget');
const onboardingPrimary = document.getElementById('onboardingPrimary');
const onboardingSecondary = document.getElementById('onboardingSecondary');
const onboardingClose = document.getElementById('onboardingClose');
const noteTitleInput = document.getElementById('noteTitleInput');
const noteBodyInput = document.getElementById('noteBodyInput');
const createNoteButton = document.getElementById('createNoteButton');
const captureNoteButton = document.getElementById('captureNoteButton');
const recordingFeedback = document.getElementById('recordingFeedback');
const micPulse = document.getElementById('micPulse');
const toastContainer = document.getElementById('toastContainer');
const searchInput = document.getElementById('dashboardSearchInput');
const breadcrumbPrimary = document.getElementById('breadcrumbPrimary');
const breadcrumbSecondary = document.getElementById('breadcrumbSecondary');
const authOverlay = document.getElementById('authOverlay');
const authOverlayStatus = document.getElementById('authOverlayStatus');
const authOverlayLogin = document.getElementById('authOverlayLogin');
const authOverlayRetry = document.getElementById('authOverlayRetry');
const authOverlaySignup = document.getElementById('authOverlaySignup');
const authOverlayForm = document.getElementById('authOverlayForm');
const authOverlayEmail = document.getElementById('authOverlayEmail');
const authOverlayPassword = document.getElementById('authOverlayPassword');
const statDays = document.getElementById('statDays');
const statWords = document.getElementById('statWords');
const statTotal = document.getElementById('statTotal');
const streakSubtitle = document.getElementById('streakSubtitle');
const quotaRemaining = document.getElementById('quotaRemaining');
const quotaReset = document.getElementById('quotaReset');
const upgradeNudge = document.getElementById('upgradeNudge');
const upgradeNudgeRemaining = document.getElementById('upgradeNudgeRemaining');
const upgradeNudgeFill = document.getElementById('upgradeNudgeFill');
const upgradeNudgeCaption = document.getElementById('upgradeNudgeCaption');
const upgradeNudgeButton = document.getElementById('upgradeNudgeButton');
const profileName = document.getElementById('profileName');
const profilePlan = document.getElementById('profilePlan');
const profileAvatar = document.getElementById('profileAvatar');
const profileCard = document.getElementById('profileCard');
const subscriptionStatus = document.getElementById('subscriptionStatus');
const subscriptionBadge = document.getElementById('subscriptionBadge');
const subscriptionNote = document.getElementById('subscriptionNote');
const upgradePlanButton = document.getElementById('upgradePlanButton');
const manageSubscriptionButton = document.getElementById('manageSubscriptionButton');
const refreshSubscriptionButton = document.getElementById('refreshSubscriptionButton');
const shortcutInput = document.getElementById('shortcutInput');
const shortcutResetButton = document.getElementById('shortcutResetButton');
const shortcutHelp = document.getElementById('shortcutHelp');
const syncNowButton = document.getElementById('syncNowButton');
const syncStatus = document.getElementById('syncStatus');
const resetOnboardingButton = document.getElementById('resetOnboardingButton');

let currentSettings = {};
let dashboardData = null;
let currentView = 'home';
let searchTerm = '';
let historyData = [];
let notesData = [];
let noteCaptureActive = false;
let modalResolver = null;
let platform = 'win32';
let shortcutCaptureActive = false;
let shortcutBeforeCapture = '';
let shortcutInvalidShown = false;
let historyLoadError = false;
let quotaSnapshot = null;
let currentSubscription = null;
let currentAuth = null;
let onboardingState = null;
let onboardingStep = 'welcome';
let onboardingInFlight = false;
let onboardingMicActive = false;
let onboardingMicStream = null;
let onboardingAudioContext = null;
let onboardingAnalyser = null;
let onboardingWaveRaf = null;
let onboardingMicMaxRms = 0;
let onboardingDeliveryTestText = '';
const UPGRADE_NUDGE_THRESHOLD = 500;
const STYLE_PRESETS = ['Default', 'Casual', 'Formel', 'Croco'];
const STYLE_EXAMPLES = {
  Default: {
    before: "Je vais, euh, manger une pomme.",
    after: "Je vais manger une pomme.",
  },
  Casual: {
    before: "Nous devons impérativement finaliser ce dossier.",
    after: "Faut qu'on boucle ce dossier rapidos !",
  },
  Formel: {
    before: "C'est pas bon, on refait.",
    after: "Cette proposition est insatisfaisante, une révision est nécessaire.",
  },
  Croco: {
    before: "On a besoin de booster les ventes rapidement.",
    after: "On doit doper les ventes vite, comme si on branchait un turbo sur un vélo.",
  },
};
const STYLE_DESCRIPTIONS = {
  Default: 'Style par défaut, neutre et clair.',
  Casual: 'Ton décontracté, idéal pour les réseaux.',
  Formel: 'Langage soutenu et professionnel.',
  Croco: 'Ton direct avec des métaphores audacieuses.',
};
const STYLE_LABELS = {
  Default: 'Standard',
  Casual: 'Casual',
  Formel: 'Formel',
  Croco: 'Croco',
};
const SUBSCRIPTION_POLL_DELAY_MS = 4000;
const SUBSCRIPTION_POLL_MAX_ATTEMPTS = 6;
const SUBSCRIPTION_POLL_COOLDOWN_MS = 60000;
let subscriptionPollInFlight = false;
let subscriptionPollToken = 0;
let lastSubscriptionPollAt = 0;
