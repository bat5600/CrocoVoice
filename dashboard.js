const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item[data-view]');
const settingsInputs = document.querySelectorAll('[data-setting]');
const apiKeyStatus = document.getElementById('apiKeyStatus');
const historyList = document.getElementById('historyList');
const historyEmpty = document.getElementById('historyEmpty');
const polishEntryButton = document.getElementById('polishEntryButton');
const notesList = document.getElementById('notesList');
const notesEmpty = document.getElementById('notesEmpty');
const dictionaryList = document.getElementById('dictionaryList');
const dictionaryEmpty = document.getElementById('dictionaryEmpty');
const snippetsList = document.getElementById('snippetsList');
const snippetsEmpty = document.getElementById('snippetsEmpty');
const notificationsList = document.getElementById('notificationsList');
const notificationsEmpty = document.getElementById('notificationsEmpty');
const notificationsRefresh = document.getElementById('notificationsRefresh');
const insightsTotal = document.getElementById('insightsTotal');
const insightsWords = document.getElementById('insightsWords');
const insightsAvgWpm = document.getElementById('insightsAvgWpm');
const insightsStreak = document.getElementById('insightsStreak');
const insightsTopApps = document.getElementById('insightsTopApps');
const insightsRange = document.getElementById('insightsRange');
const crocOmniSearchInput = document.getElementById('dashboardSearchInput');
const crocOmniSearchSource = document.getElementById('crocOmniSearchSource');
const crocOmniSearchRange = document.getElementById('crocOmniSearchRange');
const crocOmniSearchStatus = document.getElementById('crocOmniSearchStatus');
const crocOmniResults = document.getElementById('crocOmniResults');
const crocOmniAnswerPanel = document.getElementById('crocOmniAnswerPanel');
const crocOmniAnswerButton = document.getElementById('crocOmniAnswerButton');
const crocOmniAnswerOutput = document.getElementById('crocOmniAnswerOutput');
const crocOmniAiReplyToggle = document.getElementById('crocOmniAiReplyToggle');
const crocOmniAiSensitiveToggle = document.getElementById('crocOmniAiSensitiveToggle');
const crocOmniConversationList = document.getElementById('crocOmniConversationList');
const crocOmniConversationEmpty = document.getElementById('crocOmniConversationEmpty');
const crocOmniMessages = document.getElementById('crocOmniMessages');
const crocOmniMessagesEmpty = document.getElementById('crocOmniMessagesEmpty');
const crocOmniComposer = document.getElementById('crocOmniComposer');
const crocOmniSendButton = document.getElementById('crocOmniSendButton');
const crocOmniNewConversation = document.getElementById('crocOmniNewConversation');
const crocOmniCreateButton = document.getElementById('crocOmniCreateButton');
const crocOmniClearConversation = document.getElementById('crocOmniClearConversation');
const crocOmniComposerMeta = document.getElementById('crocOmniComposerMeta');
const snippetCueInput = document.getElementById('snippetCueInput');
const snippetTemplateInput = document.getElementById('snippetTemplateInput');
const snippetDescriptionInput = document.getElementById('snippetDescriptionInput');
const snippetCancelButton = document.getElementById('snippetCancelButton');
const snippetAddButton = document.getElementById('snippetAddButton');
const styleList = document.getElementById('styleList');
const styleEmpty = document.getElementById('styleEmpty');
const contextEnabledToggle = document.getElementById('contextEnabledToggle');
const contextPostProcessToggle = document.getElementById('contextPostProcessToggle');
const contextSignalApp = document.getElementById('contextSignalApp');
const contextSignalWindow = document.getElementById('contextSignalWindow');
const contextSignalUrl = document.getElementById('contextSignalUrl');
const contextSignalAx = document.getElementById('contextSignalAx');
const contextSignalTextbox = document.getElementById('contextSignalTextbox');
const contextSignalScreenshot = document.getElementById('contextSignalScreenshot');
const contextRetentionInput = document.getElementById('contextRetentionInput');
const contextRetentionSave = document.getElementById('contextRetentionSave');
const contextDeleteAll = document.getElementById('contextDeleteAll');
const contextActiveApp = document.getElementById('contextActiveApp');
const contextActiveWindow = document.getElementById('contextActiveWindow');
const contextActiveUrl = document.getElementById('contextActiveUrl');
const contextOverrideMode = document.getElementById('contextOverrideMode');
const contextOverrideProfile = document.getElementById('contextOverrideProfile');
const contextOverrideSignalApp = document.getElementById('contextOverrideSignalApp');
const contextOverrideSignalWindow = document.getElementById('contextOverrideSignalWindow');
const contextOverrideSignalUrl = document.getElementById('contextOverrideSignalUrl');
const contextOverrideSignalAx = document.getElementById('contextOverrideSignalAx');
const contextOverrideSignalTextbox = document.getElementById('contextOverrideSignalTextbox');
const contextOverrideSignalScreenshot = document.getElementById('contextOverrideSignalScreenshot');
const contextSuggestion = document.getElementById('contextSuggestion');
const contextSuggestionApply = document.getElementById('contextSuggestionApply');
const contextProfileCreate = document.getElementById('contextProfileCreate');
const contextProfileList = document.getElementById('contextProfileList');
const contextPreviewProfile = document.getElementById('contextPreviewProfile');
const contextPreviewButton = document.getElementById('contextPreviewButton');
const contextPreviewInput = document.getElementById('contextPreviewInput');
const contextPreviewOutput = document.getElementById('contextPreviewOutput');
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
const createNoteButton = document.getElementById('createNoteButton');
const noteFocusOverlay = document.getElementById('noteFocusOverlay');
const noteFocusShell = document.getElementById('noteFocusShell');
const noteFocusResizer = document.getElementById('noteFocusResizer');
const noteFocusBack = document.getElementById('noteFocusBack');
const noteFocusTitle = document.getElementById('noteFocusTitle');
const noteFocusEditor = document.getElementById('noteFocusEditor');
const noteFocusToolbar = document.getElementById('noteFocusToolbar');
const noteFocusTimestamp = document.getElementById('noteFocusTimestamp');
const noteFocusSource = document.getElementById('noteFocusSource');
const noteFocusStatus = document.getElementById('noteFocusStatus');
const toastContainer = document.getElementById('toastContainer');
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
const statStreak = document.getElementById('statStreak');
const statWords = document.getElementById('statWords');
const statTotal = document.getElementById('statTotal');
const statNotesCard = document.getElementById('statNotesCard');
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
const telemetryExportButton = document.getElementById('telemetryExport');
const telemetryOutput = document.getElementById('telemetryOutput');
const onboardingResetButton = document.getElementById('onboardingResetButton');
const onboardingOverlay = document.getElementById('onboardingOverlay');
const onboardingStepper = document.getElementById('onboardingStepper');
const onboardingPanels = document.querySelectorAll('.onboarding-panel[data-step]');
const onboardingStartButton = document.getElementById('onboardingStart');
const onboardingSkipButton = document.getElementById('onboardingSkip');
const onboardingPermissionButton = document.getElementById('onboardingPermissionButton');
const onboardingPrivacyLink = document.getElementById('onboardingPrivacyLink');
const onboardingPermissionStatus = document.getElementById('onboardingPermissionStatus');
const onboardingVuBar = document.getElementById('onboardingVuBar');
const onboardingMicStatus = document.getElementById('onboardingMicStatus');
const onboardingMicContinue = document.getElementById('onboardingMicContinue');
const onboardingMicrophoneSelect = document.getElementById('onboardingMicrophoneSelect');
const onboardingMicrophoneApply = document.getElementById('onboardingMicrophoneApply');
const onboardingHotkeyInput = document.getElementById('onboardingHotkeyInput');
const onboardingHotkeyNext = document.getElementById('onboardingHotkeyNext');
const onboardingHotkeyStatus = document.getElementById('onboardingHotkeyStatus');
const onboardingSandbox = document.getElementById('onboardingSandbox');
const onboardingDictateButton = document.getElementById('onboardingDictateButton');
const onboardingFirstRunNext = document.getElementById('onboardingFirstRunNext');
const onboardingDictationStatus = document.getElementById('onboardingDictationStatus');
const onboardingSuccessBadge = document.getElementById('onboardingSuccessBadge');
const onboardingDeliveryInput = document.getElementById('onboardingDeliveryInput');
const onboardingDeliveryTestButton = document.getElementById('onboardingDeliveryTestButton');
const onboardingDeliveryNext = document.getElementById('onboardingDeliveryNext');
const onboardingDeliveryStatus = document.getElementById('onboardingDeliveryStatus');
const onboardingFinishButton = document.getElementById('onboardingFinishButton');
const onboardingLocalModelList = document.getElementById('onboardingLocalModelList');
const onboardingLocalModelStatus = document.getElementById('onboardingLocalModelStatus');
const onboardingLocalModelSkip = document.getElementById('onboardingLocalModelSkip');
const onboardingLocalModelNext = document.getElementById('onboardingLocalModelNext');
const onboardingCheckPermission = document.getElementById('onboardingCheckPermission');
const onboardingCheckSignal = document.getElementById('onboardingCheckSignal');
const onboardingCheckHotkey = document.getElementById('onboardingCheckHotkey');
const onboardingCheckDictation = document.getElementById('onboardingCheckDictation');
const onboardingCheckDelivery = document.getElementById('onboardingCheckDelivery');
const uploadAudioButton = document.getElementById('uploadAudioButton');
const uploadDropzone = document.getElementById('uploadDropzone');
const uploadQueue = document.getElementById('uploadQueue');
const localModelSummary = document.getElementById('localModelSummary');
const localModelDownloads = document.getElementById('localModelDownloads');
const localModelList = document.getElementById('localModelList');
const localModelPresetSelect = document.getElementById('localModelPresetSelect');
const localAsrCommandStatus = document.getElementById('localAsrCommandStatus');
const localAsrCommandRescan = document.getElementById('localAsrCommandRescan');
const diagnosticsRunChecks = document.getElementById('diagnosticsRunChecks');
const diagnosticsOutput = document.getElementById('diagnosticsOutput');
const diagnosticsChecks = document.getElementById('diagnosticsChecks');
const diagnosticsCopy = document.getElementById('diagnosticsCopy');
const diffBefore = document.getElementById('diffBefore');
const diffAfter = document.getElementById('diffAfter');

let currentSettings = {};
let dashboardData = null;
let currentView = 'home';
let searchTerm = '';
let historyData = [];
let notesData = [];
let snippetsData = [];
let dictionaryData = [];
let notificationsData = [];
let insightsData = null;
let crocOmniSearchResults = [];
let crocOmniSearchQuery = '';
let crocOmniSearchPending = false;
let crocOmniAnswerPending = false;
let crocOmniSearchDebounceId = null;
let crocOmniAutoReturnView = null;
let crocOmniConversations = [];
let crocOmniActiveConversationId = null;
let crocOmniMessagesData = [];
let crocOmniMessagesRequestId = 0;
let localModelPresetSelectUpdating = false;
let localAsrCommandRescanPending = false;
let crocOmniStreaming = false;
let crocOmniStreamState = new Map();
let insightsRangeDays = 30;

const i18n = window.CrocoI18n || null;
const t = i18n
  ? i18n.t
  : (key, vars, fallback) => (fallback !== undefined ? fallback : key);

function applyDashboardLanguage(settings) {
  if (!i18n) {
    return;
  }
  const nextLanguage = i18n.normalizeLanguage(settings?.uiLanguage);
  i18n.setLanguage(nextLanguage);
  applyEmptyStateTranslations();
  updateBreadcrumb(currentView);
  if (dashboardData?.stats) {
    renderStats(dashboardData.stats);
  }
  if (dashboardData?.quota) {
    renderQuota(dashboardData.quota);
  }
  if (dashboardData?.subscription || dashboardData?.auth) {
    renderSubscription(dashboardData.subscription, dashboardData.auth);
  }
  renderDiagnostics();
}

function applyEmptyStateTranslations() {
  if (historyEmpty) {
    historyEmpty.dataset.emptyTitle = t('home.history.emptyTitle');
    historyEmpty.dataset.emptyBody = t('home.history.emptyBody');
    historyEmpty.dataset.searchTitle = t('home.history.searchTitle');
    historyEmpty.dataset.searchBody = t('home.history.searchBody');
    historyEmpty.dataset.errorTitle = t('home.history.errorTitle');
    historyEmpty.dataset.errorBody = t('home.history.errorBody');
  }
}

const I18N_MESSAGES = {
  'nav.dashboard': { en: 'Dashboard', fr: 'Dashboard' },
  'nav.notes': { en: 'Notes', fr: 'Notes' },
  'nav.dictionary': { en: 'Dictionary', fr: 'Dictionnaire' },
  'nav.snippets': { en: 'Snippets', fr: 'Snippets' },
  'nav.crocomni': { en: 'CrocOmni', fr: 'CrocOmni' },
  'nav.inbox': { en: 'Inbox', fr: 'Inbox' },
  'nav.insights': { en: 'Insights', fr: 'Insights' },
  'nav.context': { en: 'Context', fr: 'Context' },
  'nav.styles': { en: 'Styles', fr: 'Styles' },
  'nav.settings': { en: 'Settings', fr: 'Reglages' },
  'nav.diagnostics': { en: 'Diagnostics', fr: 'Diagnostics' },

  'profile.card.aria': { en: 'Open profile and billing', fr: 'Ouvrir le profil et la facturation' },
  'profile.plan.pro': { en: 'Pro plan', fr: 'Plan Pro' },

  'dashboard.search.placeholder': { en: 'Search your notes and dictations...', fr: 'Rechercher dans vos notes et dictees...' },

  'dashboard.auth.title': { en: 'Login required', fr: 'Connexion requise' },
  'dashboard.auth.subtitle': { en: 'Sync your notes and access premium features.', fr: 'Synchronisez vos notes et accedez aux fonctions premium.' },
  'dashboard.auth.email.label': { en: 'Email address', fr: 'Adresse email' },
  'dashboard.auth.email.placeholder': { en: 'you@example.com', fr: 'vous@exemple.com' },
  'dashboard.auth.password.label': { en: 'Password', fr: 'Mot de passe' },
  'dashboard.auth.password.placeholder': { en: 'Your password', fr: 'Votre mot de passe' },
  'dashboard.auth.login': { en: 'Sign in', fr: 'Se connecter' },
  'dashboard.auth.signup': { en: 'Create account', fr: 'Creer un compte' },
  'dashboard.auth.retry': { en: 'Retry', fr: 'Reessayer' },

  'onboarding.kicker': { en: 'First run', fr: 'First Run' },
  'onboarding.title': { en: 'Ready to dictate in 30 seconds', fr: 'Pret a dicter en 30 secondes' },
  'onboarding.skip': { en: 'Skip / Set up later', fr: 'Passer / Configurer plus tard' },
  'onboarding.step.welcome': { en: 'Welcome', fr: 'Accueil' },
  'onboarding.step.permissions': { en: 'Permissions', fr: 'Permission' },
  'onboarding.step.mic': { en: 'Microphone', fr: 'Micro' },
  'onboarding.step.hotkey': { en: 'Shortcut', fr: 'Raccourci' },
  'onboarding.step.localModel': { en: 'Local model', fr: 'Modele local' },
  'onboarding.step.dictation': { en: 'Dictation', fr: 'Dictee' },
  'onboarding.step.delivery': { en: 'Delivery', fr: 'Livraison' },
  'onboarding.step.done': { en: 'Done', fr: 'Fini' },
  'onboarding.welcome.title': { en: "Welcome, we'll prove it in 1 minute.", fr: 'Bienvenue, on va le prouver en 1 minute.' },
  'onboarding.welcome.body': { en: "You'll allow the mic, check the signal, then see text appear on its own for the first time.", fr: "Vous allez autoriser le micro, verifier le signal, puis voir un texte s'ecrire tout seul pour la premiere fois." },
  'onboarding.welcome.cta': { en: 'Start setup', fr: 'Commencer la configuration' },
  'onboarding.permissions.title': { en: 'Allow microphone', fr: 'Autoriser le microphone' },
  'onboarding.permissions.body': { en: 'Windows will show a permission prompt. Accept to start the live audio meter.', fr: "Windows va afficher une autorisation. Acceptez pour lancer la jauge audio en temps reel." },
  'onboarding.permissions.cta': { en: 'Allow mic', fr: 'Autoriser le micro' },
  'onboarding.permissions.settings': { en: 'Open Windows settings', fr: 'Ouvrir les parametres Windows' },
  'onboarding.permissions.status': { en: 'Click to trigger the access prompt.', fr: "Cliquez pour declencher la demande d'acces." },
  'onboarding.permissions.allowed': { en: 'Microphone allowed. Speak to see the meter.', fr: 'Micro autorise. Parlez pour voir la jauge.' },
  'onboarding.permissions.requesting': { en: 'Requesting access...', fr: "Demande d'acces en cours..." },
  'onboarding.permissions.failed': { en: 'Unable to start the microphone.', fr: 'Impossible de lancer le micro.' },
  'onboarding.permissions.denied': { en: 'Mic access denied. Open Windows settings.', fr: 'Acces micro refuse. Ouvrez les parametres Windows.' },

  'onboarding.mic.title': { en: 'Mic test', fr: 'Test micro' },
  'onboarding.mic.body': { en: 'Speak at normal volume. The meter should move to confirm the signal.', fr: 'Parlez a voix normale. La jauge doit reagir pour valider que le signal passe.' },
  'onboarding.mic.change': { en: 'Change mic', fr: 'Changer de micro' },
  'onboarding.mic.status': { en: 'Waiting for audio signal...', fr: 'En attente de signal audio...' },
  'onboarding.mic.waiting': { en: 'Waiting for audio signal...', fr: 'En attente de signal audio...' },
  'onboarding.mic.noMic': { en: 'No microphone detected. Check your hardware.', fr: 'Aucun micro detecte. Verifiez votre materiel.' },
  'onboarding.mic.signalDetected': { en: 'Signal detected. You can continue.', fr: 'Signal detecte. Vous pouvez continuer.' },
  'onboarding.mic.updated': { en: 'Mic updated. Testing...', fr: 'Micro mis a jour. Test en cours...' },
  'onboarding.mic.noSignal': { en: 'No signal detected.', fr: 'Aucun signal detecte.' },

  'onboarding.hotkey.title': { en: 'Dictation shortcut', fr: 'Raccourci de dictee' },
  'onboarding.hotkey.body': { en: 'Press your combination to launch CrocoVoice quickly.', fr: 'Appuyez sur votre combinaison pour lancer CrocoVoice rapidement.' },
  'onboarding.hotkey.prompt': { en: 'Set a keyboard shortcut to start dictation.', fr: 'Definissez un raccourci clavier pour lancer la dictee.' },
  'onboarding.hotkey.ready': { en: 'Shortcut set.', fr: 'Raccourci configure.' },
  'onboarding.hotkey.capturePrompt': { en: 'Press your keys...', fr: 'Appuyez sur les touches...' },
  'onboarding.hotkey.invalidCombo': { en: 'Use a combo (Ctrl/Alt/Shift + key).', fr: 'Utilisez une combinaison (Ctrl/Alt/Shift + touche).' },
  'onboarding.hotkey.saved': { en: 'Shortcut saved.', fr: 'Raccourci enregistre.' },
  'onboarding.hotkey.invalid': { en: 'Invalid shortcut. Try another combo.', fr: 'Raccourci invalide. Essayez une autre combinaison.' },

  'onboarding.localModel.title': { en: 'Install a local model (optional)', fr: 'Installer un modele local (optionnel)' },
  'onboarding.localModel.body': { en: 'On Windows, you can download a Whisper model to dictate offline. It is optional and can be done later.', fr: 'Sur Windows, vous pouvez telecharger un modele Whisper pour dicter hors-ligne. C’est optionnel et peut se faire plus tard.' },
  'onboarding.localModel.empty': { en: 'Models unavailable for now.', fr: 'Modeles indisponibles pour le moment.' },
  'onboarding.localModel.recommended': { en: 'Recommended for this machine: {{preset}}.', fr: 'Recommande pour cette machine: {{preset}}.' },

  'onboarding.dictation.title': { en: 'First run', fr: 'Le First Run' },
  'onboarding.dictation.body': { en: 'Hold the shortcut (or click) and say a simple sentence, e.g. "Hello world".', fr: 'Maintenez le raccourci (ou cliquez) et dites une phrase simple, par exemple "Bonjour monde".' },
  'onboarding.dictation.placeholder': { en: 'Your transcribed text will appear here...', fr: 'Votre texte transcrit apparaitra ici...' },
  'onboarding.dictation.cta': { en: 'Dictate now', fr: 'Dicter maintenant' },
  'onboarding.dictation.stop': { en: 'Stop', fr: 'Arreter' },
  'onboarding.dictation.listening': { en: 'Listening... speak now.', fr: 'En ecoute... Parlez maintenant.' },
  'onboarding.dictation.noAudio': { en: "We can't hear you. Try again.", fr: 'On ne vous entend pas. Reessayez.' },
  'onboarding.dictation.received': { en: 'Text received successfully.', fr: 'Texte recu avec succes.' },
  'onboarding.dictation.failed': { en: 'Dictation failed.', fr: 'La dictee a echoue.' },
  'onboarding.dictation.success': { en: 'Success, the dictation came through!', fr: 'Succes, la dictee est bien arrivee !' },

  'onboarding.delivery.title': { en: 'Injection check', fr: "Verification d'injection" },
  'onboarding.delivery.body': { en: 'Lets test whether Windows allows key injection. Otherwise, we fall back to clipboard mode.', fr: "Testons si Windows autorise l'injection de touches. Sinon, on bascule en mode presse-papier." },
  'onboarding.delivery.placeholder': { en: 'Test area (keep focus here)', fr: 'Zone de test (gardez le focus ici)' },
  'onboarding.delivery.cta': { en: 'Test injection', fr: "Tester l'injection" },
  'onboarding.delivery.unavailable': { en: 'Test unavailable.', fr: 'Test indisponible.' },
  'onboarding.delivery.testing': { en: 'Test in progress...', fr: 'Test en cours...' },
  'onboarding.delivery.success': { en: 'Injection OK.', fr: 'Injection OK.' },
  'onboarding.delivery.blocked': { en: 'Injection blocked. Enable clipboard mode.', fr: 'Injection bloquee. Activez le presse-papier.' },
  'onboarding.common.continue': { en: 'Continue', fr: 'Continuer' },
  'onboarding.common.skip': { en: 'Skip', fr: 'Ignorer' },
  'onboarding.common.finish': { en: 'Finish', fr: 'Terminer' },

  'onboarding.done.title': { en: 'All set.', fr: 'Tout est pret.' },
  'onboarding.done.body': { en: 'Your first dictation is validated. You can now use CrocoVoice daily.', fr: 'Votre premiere dictee est validee. Vous pouvez maintenant utiliser CrocoVoice au quotidien.' },
  'onboarding.done.cta': { en: 'Go to dashboard', fr: 'Aller au dashboard' },

  'onboarding.summary.title': { en: 'First run checklist', fr: 'Checklist du first run' },
  'onboarding.summary.body': { en: 'We check things off as you go for a clear first success.', fr: 'On coche au fur et a mesure pour un premier succes clair.' },
  'onboarding.summary.permission': { en: 'Microphone permission granted', fr: 'Permission micro accordee' },
  'onboarding.summary.signal': { en: 'Audio signal detected', fr: 'Signal audio detecte' },
  'onboarding.summary.hotkey': { en: 'Shortcut set', fr: 'Raccourci configure' },
  'onboarding.summary.dictation': { en: 'Text transcribed in sandbox', fr: 'Texte transcrit en sandbox' },
  'onboarding.summary.delivery': { en: 'Delivery OK or clipboard enabled', fr: 'Livraison OK ou presse-papier active' },

  'modal.title.edit': { en: 'Edit', fr: 'Editer' },
  'modal.close.aria': { en: 'Close', fr: 'Fermer' },
  'modal.confirm': { en: 'Save', fr: 'Sauvegarder' },

  'home.greeting': { en: 'Hello, Baptiste 👋', fr: 'Bonjour, Baptiste 👋' },
  'home.loading': { en: 'Loading stats...', fr: 'Chargement des statistiques...' },
  'home.stats.streak': { en: 'Current streak', fr: 'Serie en cours' },
  'home.stats.words': { en: 'Words transcribed', fr: 'Mots transcrits' },
  'home.stats.notes': { en: 'Total notes', fr: 'Notes totales' },
  'home.stats.remaining': { en: 'Words remaining', fr: 'Mots restants' },
  'home.stats.reset': { en: 'Reset Monday 00:00 UTC', fr: 'Reset lundi 00:00 UTC' },
  'home.stats.notes.aria': { en: 'Open notes', fr: 'Ouvrir les notes' },
  'home.upgrade.remaining.prefix': { en: 'Only', fr: 'Plus que' },
  'home.upgrade.remaining.suffix': { en: 'words before lockout', fr: 'mots avant le blocage' },
  'home.upgrade.body': { en: 'Go Pro to dictate without limits, keep full history, and continue without interruption.', fr: "Passez Pro pour dicter sans limite, garder l'historique complet et continuer sans interruption." },
  'home.upgrade.reset': { en: 'Reset Monday 00:00 UTC', fr: 'Reset lundi 00:00 UTC' },
  'home.upgrade.cta': { en: 'Go Pro', fr: 'Passer Pro' },
  'home.streak.none': { en: 'No streak yet. Start a dictation to begin!', fr: 'Aucune serie en cours. Lancez une dictee pour demarrer !' },
  'home.streak.one': { en: "You're on a 1-day streak. Keep it up!", fr: 'Vous etes sur une serie de 1 jour. Continuez comme ca !' },
  'home.streak.many': { en: "You're on a {{count}}-day streak. Keep it up!", fr: 'Vous etes sur une serie de {{count}} jours. Continuez comme ca !' },
  'home.quota.reset.default': { en: 'Reset Monday 00:00 UTC', fr: 'Reset lundi 00:00 UTC' },
  'home.quota.reset.withDate': { en: 'Reset {{date}} UTC', fr: 'Reset {{date}} UTC' },
  'home.quota.unavailable': { en: 'Quota unavailable', fr: 'Quota indisponible' },
  'home.quota.authRequired': { en: 'Sign in to view quota', fr: 'Connectez-vous pour voir le quota' },
  'home.quota.unlimited': { en: 'Unlimited', fr: 'Illimite' },
  'home.quota.proActive': { en: 'Pro plan active', fr: 'Plan Pro actif' },
  'home.history.title': { en: 'History', fr: 'Historique' },
  'home.history.polish': { en: 'View polish', fr: 'Voir le polish' },
  'home.history.emptyTitle': { en: "It's quiet here", fr: "C'est bien calme ici" },
  'home.history.emptyBody': { en: 'Your history is empty. Start a note to see your sessions appear.', fr: 'Votre historique est vide. Commencez par lancer une note pour voir apparaitre vos sessions.' },
  'home.history.emptyAction': { en: 'Create a note', fr: 'Creer une note' },
  'home.history.searchTitle': { en: 'No results', fr: 'Aucun resultat' },
  'home.history.searchBody': { en: "We couldn't find anything for this search.", fr: "Nous n'avons rien trouve pour cette recherche." },
  'home.history.errorTitle': { en: 'Unable to load history', fr: "Impossible de charger l'historique" },
  'home.history.errorBody': { en: 'Check your connection and try again.', fr: 'Verifiez votre connexion et reessayez.' },
  'home.history.loadFailed': { en: 'Loading error. Please retry.', fr: 'Erreur de chargement. Reessayez.' },

  'diagnostics.title': { en: 'Diagnostics', fr: 'Diagnostics' },
  'diagnostics.subtitle': { en: 'Status of permissions, delivery, and flags.', fr: 'Etat des permissions, livraisons et flags.' },
  'diagnostics.autoChecks.title': { en: 'Auto-checks', fr: 'Auto-checks' },
  'diagnostics.autoChecks.subtitle': { en: 'Mic, shortcut, clipboard.', fr: 'Micro, raccourci, presse-papier.' },
  'diagnostics.run': { en: 'Run checks', fr: 'Lancer les checks' },
  'diagnostics.summary.title': { en: 'Summary', fr: 'Resume' },
  'diagnostics.summary.subtitle': { en: 'Versions, flags, and recent events.', fr: 'Versions, flags et derniers evenements.' },
  'diagnostics.copy': { en: 'Copy', fr: 'Copier' },
  'diagnostics.telemetry.title': { en: 'Telemetry export', fr: 'Export telemetrie' },
  'diagnostics.telemetry.subtitle': { en: 'Opt-in export with redacted content.', fr: 'Export opt-in avec contenu redige.' },
  'diagnostics.telemetry.generate': { en: 'Generate', fr: 'Generer' },
  'diagnostics.unavailable': { en: 'Diagnostics unavailable.', fr: 'Diagnostic indisponible.' },
  'diagnostics.na': { en: 'n/a', fr: 'n/a' },
  'diagnostics.line.error': { en: 'Error: {{message}}', fr: 'Erreur: {{message}}' },
  'diagnostics.line.app': { en: 'App: {{value}}', fr: 'App: {{value}}' },
  'diagnostics.line.os': { en: 'OS: {{value}}', fr: 'OS: {{value}}' },
  'diagnostics.line.flags': { en: 'Flags: {{value}}', fr: 'Flags: {{value}}' },
  'diagnostics.line.delivery': { en: 'Delivery: {{mode}} ({{status}})', fr: 'Delivery: {{mode}} ({{status}})' },
  'diagnostics.line.last': { en: 'Last dictation:', fr: 'Derniere dictee:' },
  'diagnostics.line.latency': { en: '- E2E latency: {{value}}ms', fr: '- Latence E2E: {{value}}ms' },
  'diagnostics.line.networkLatency': { en: '- Network latency: {{value}}ms', fr: '- Latence reseau: {{value}}ms' },
  'diagnostics.line.divergence': { en: '- Divergence: {{value}}', fr: '- Divergence: {{value}}' },
  'diagnostics.line.fallback': { en: '- Fallback: {{value}}', fr: '- Fallback: {{value}}' },
  'diagnostics.line.asrPath': { en: '- ASR path: {{value}}', fr: '- Chemin ASR: {{value}}' },
  'diagnostics.line.audioQuality': { en: '- Audio quality: {{value}}', fr: '- Qualite audio: {{value}}' },
  'diagnostics.line.events': { en: 'Events:', fr: 'Events:' },
  'diagnostics.empty': { en: 'No data available.', fr: 'Aucune donnee disponible.' },
  'diagnostics.check.microphones': { en: 'Microphones: {{value}}', fr: 'Microphones: {{value}}' },
  'diagnostics.check.micPermission': { en: 'Mic permission: {{value}}', fr: 'Permission micro: {{value}}' },
  'diagnostics.check.clipboard': { en: 'Clipboard test: {{value}}', fr: 'Clipboard test: {{value}}' },
  'diagnostics.check.shortcut': { en: 'Shortcut: {{value}} ({{status}})', fr: 'Raccourci: {{value}} ({{status}})' },
  'diagnostics.check.ok': { en: 'OK', fr: 'OK' },
  'diagnostics.check.ko': { en: 'KO', fr: 'KO' },
  'diagnostics.checks.empty': { en: 'Checks not run.', fr: 'Checks non lances.' },

  'settings.title': { en: 'Settings', fr: 'Reglages' },
  'settings.subtitle': { en: 'Customize your recording experience.', fr: "Personnalisez votre experience d'enregistrement." },
  'settings.general.title': { en: 'General', fr: 'General' },
  'settings.language.label': { en: 'Transcription language', fr: 'Langue de transcription' },
  'settings.uiLanguage.label': { en: 'App UI language', fr: "Langue de l'interface" },
  'settings.uiLanguage.option.en': { en: 'English', fr: 'Anglais' },
  'settings.uiLanguage.option.fr': { en: 'French', fr: 'Francais' },
  'settings.apiKey.connected': { en: 'OpenAI API connected', fr: 'API OpenAI connectee' },
  'settings.apiKey.missing': { en: 'OpenAI API missing', fr: 'API manquante' },
  'settings.microphone.label': { en: 'Microphone', fr: 'Microphone' },
  'settings.shortcut.label': { en: 'Dictation shortcut', fr: 'Raccourci de dictee' },
  'settings.shortcut.reset': { en: 'Reset', fr: 'Reinitialiser' },
  'settings.shortcut.help': { en: 'Click the field then press your combination.', fr: 'Cliquez dans le champ puis appuyez sur votre combinaison.' },
  'settings.onboarding.label': { en: 'Onboarding', fr: 'Onboarding' },
  'settings.onboarding.reset': { en: 'Restart onboarding', fr: "Recommencer l'onboarding" },

  'toast.title.error': { en: 'Error', fr: 'Erreur' },
  'toast.title.success': { en: 'Success', fr: 'Succes' },
  'toast.title.action': { en: 'Action', fr: 'Action' },
  'toast.undo': { en: 'Undo', fr: 'Annuler' },
  'toast.noteDeleted': { en: 'Note deleted.', fr: 'Note supprimee.' },
  'toast.entryDeleted': { en: 'Entry deleted.', fr: 'Entree supprimee.' },
  'toast.copy.success': { en: 'Text copied.', fr: 'Texte copie.' },
  'toast.copy.failed': { en: 'Unable to copy.', fr: 'Impossible de copier.' },
  'toast.export.unavailable': { en: 'Export unavailable.', fr: 'Export indisponible.' },
  'toast.export.generated': { en: 'Export generated.', fr: 'Export genere.' },
  'toast.export.failed': { en: 'Export failed.', fr: 'Export echoue.' },
  'toast.import.started': { en: 'Import to notes: {{fileName}}.', fr: 'Import vers notes : {{fileName}}.' },
  'toast.import.noteCreated': { en: 'Note created: {{fileName}}.', fr: 'Note creee : {{fileName}}.' },
  'toast.import.failedReason': { en: 'Import failed: {{reason}}', fr: 'Import echoue : {{reason}}' },
  'toast.import.failedFile': { en: 'Import failed: {{fileName}}.', fr: 'Import echoue : {{fileName}}.' },
  'toast.import.cancelled': { en: 'Import cancelled: {{fileName}}.', fr: 'Import annule : {{fileName}}.' },
  'toast.import.unavailable': { en: 'Import unavailable.', fr: 'Import indisponible.' },
  'toast.import.inProgress': { en: 'Import to notes in progress...', fr: 'Import vers notes en cours...' },
  'toast.cancel.failed': { en: 'Cancellation failed.', fr: 'Annulation impossible.' },

  'toast.diagnostics.none': { en: 'No diagnostics to copy.', fr: 'Aucun diagnostic a copier.' },
  'toast.diagnostics.copied': { en: 'Diagnostics copied.', fr: 'Diagnostics copies.' },
  'toast.telemetry.unavailable': { en: 'Telemetry export unavailable.', fr: 'Export telemetrie indisponible.' },
  'toast.telemetry.generated': { en: 'Telemetry export generated.', fr: 'Export telemetrie genere.' },
  'toast.telemetry.failed': { en: 'Telemetry export failed.', fr: 'Export telemetrie echoue.' },

  'toast.polish.unavailable': { en: 'Polish unavailable.', fr: 'Polish indisponible.' },
  'toast.portal.unavailable': { en: 'Portal unavailable.', fr: 'Portail indisponible.' },
  'toast.portal.authRequired': { en: 'Sign in to manage your subscription.', fr: "Connectez-vous pour gerer l'abonnement." },
  'toast.portal.notConfigured': { en: 'Portal not configured.', fr: 'Portail non configure.' },
  'toast.subscription.refreshUnavailable': { en: 'Refresh unavailable.', fr: 'Actualisation indisponible.' },
  'toast.subscription.refreshAuthRequired': { en: 'Sign in to refresh.', fr: 'Connectez-vous pour actualiser.' },
  'toast.subscription.refreshFailed': { en: 'Refresh failed.', fr: 'Actualisation impossible.' },
  'toast.subscription.refreshed': { en: 'Subscription refreshed.', fr: 'Abonnement actualise.' },

  'toast.notifications.unavailable': { en: 'Notifications unavailable.', fr: 'Notifications indisponibles.' },

  'toast.shortcut.invalid': { en: 'Invalid shortcut. Use at least one modifier.', fr: 'Raccourci invalide. Utilisez au moins un modificateur.' },
  'toast.shortcut.saveFailedKeep': { en: 'Unable to save this shortcut. The previous one stays active.', fr: "Impossible d'enregistrer ce raccourci. L'ancien reste actif." },
  'toast.shortcut.updated': { en: 'Shortcut updated.', fr: 'Raccourci mis a jour.' },
  'toast.shortcut.saveFailed': { en: 'Unable to save shortcut.', fr: 'Impossible de sauvegarder le raccourci.' },

  'toast.sync.unavailable': { en: 'Sync unavailable.', fr: 'Synchronisation indisponible.' },
  'toast.sync.completed': { en: 'Sync completed.', fr: 'Synchronisation terminee.' },
  'toast.sync.authRequired': { en: 'Sign in to sync.', fr: 'Connectez-vous pour synchroniser.' },
  'toast.sync.notConfigured': { en: 'Sync not configured.', fr: 'Sync non configure.' },
  'toast.sync.failed': { en: 'Sync failed.', fr: 'Erreur de synchronisation.' },

  'sync.status.inProgress': { en: 'Sync in progress...', fr: 'Synchronisation en cours...' },
  'sync.status.completed': { en: 'Sync completed.', fr: 'Synchronisation terminee.' },
  'sync.status.authRequired': { en: 'Sign in required to sync.', fr: 'Connexion requise pour synchroniser.' },
  'sync.status.notConfigured': { en: 'Sync configuration unavailable.', fr: 'Configuration sync indisponible.' },
  'sync.status.failed': { en: 'Sync error.', fr: 'Erreur de synchronisation.' },
  'sync.status.available': { en: 'Sync available.', fr: 'Synchronisation disponible.' },

  'toast.dictionary.enterWord': { en: 'Please enter a word.', fr: 'Veuillez entrer un mot.' },
  'toast.dictionary.duplicate': { en: 'This term already exists in the dictionary.', fr: 'Ce terme existe deja dans le dictionnaire.' },
  'toast.dictionary.enterCorrection': { en: 'Please enter the correction.', fr: 'Veuillez saisir la correction.' },
  'toast.dictionary.added': { en: '"{{word}}" added to the dictionary.', fr: '"{{word}}" ajoute au dictionnaire.' },
  'toast.dictionary.updated': { en: 'Term updated.', fr: 'Terme mis a jour.' },
  'toast.dictionary.deleted': { en: 'Term deleted.', fr: 'Terme supprime.' },

  'toast.context.invalidRetention': { en: 'Invalid duration.', fr: 'Duree invalide.' },
  'toast.context.retentionUpdated': { en: 'Retention updated.', fr: 'Retention mise a jour.' },
  'toast.context.cleared': { en: 'Context cleared.', fr: 'Contexte supprime.' },

  'toast.profile.created': { en: 'Profile created.', fr: 'Profil cree.' },
  'toast.profile.selectRequired': { en: 'Choose a profile.', fr: 'Choisissez un profil.' },
  'toast.profile.updated': { en: 'Profile updated.', fr: 'Profil mis a jour.' },
  'toast.profile.deleted': { en: 'Profile deleted.', fr: 'Profil supprime.' },

  'toast.snippet.enterCue': { en: 'Please enter a cue.', fr: 'Veuillez saisir un cue.' },
  'toast.snippet.enterTemplate': { en: 'Please enter a template.', fr: 'Veuillez saisir un template.' },
  'toast.snippet.duplicate': { en: 'This cue already exists.', fr: 'Ce cue existe deja.' },
  'toast.snippet.added': { en: 'Snippet added.', fr: 'Snippet ajoute.' },
  'toast.snippet.updated': { en: 'Snippet updated.', fr: 'Snippet mis a jour.' },
  'toast.snippet.deleted': { en: 'Snippet deleted.', fr: 'Snippet supprime.' },

  'toast.noteAdded': { en: 'Note added.', fr: 'Note ajoutee.' },
  'toast.dashboard.loadFailed': { en: 'Unable to load dashboard.', fr: 'Impossible de charger le dashboard.' },

  'toast.crocomni.loadFailed': { en: 'Unable to load the conversation.', fr: 'Impossible de charger la conversation.' },
  'toast.crocomni.createFailed': { en: 'Unable to create the conversation.', fr: 'Impossible de creer la conversation.' },
  'toast.crocomni.cleared': { en: 'Conversation cleared.', fr: 'Conversation effacee.' },
  'toast.crocomni.clearFailed': { en: 'Unable to clear the conversation.', fr: "Impossible d'effacer la conversation." },
  'toast.crocomni.startFailed': { en: 'Unable to start the conversation.', fr: 'Impossible de demarrer la conversation.' },
  'toast.crocomni.searchUnavailable': { en: 'CrocOmni search unavailable.', fr: 'Recherche CrocOmni indisponible.' },
  'toast.crocomni.searchFailed': { en: 'Search failed.', fr: 'Recherche impossible.' },
  'toast.crocomni.answerUnavailable': { en: 'AI answer unavailable.', fr: 'Reponse IA indisponible.' },
  'toast.crocomni.searchFirst': { en: 'Run a search first.', fr: 'Lancez une recherche avant.' },
  'toast.crocomni.answerFailed': { en: 'Unable to generate the answer.', fr: 'Impossible de generer la reponse.' },
  'toast.note.notFound': { en: 'Note not found.', fr: 'Note introuvable.' },
  'toast.dictation.notFound': { en: 'Dictation not found in the list.', fr: 'Dictee introuvable dans la liste.' },

  'subscription.status.pending': { en: 'Activation in progress', fr: 'Activation en cours' },
  'subscription.status.trial': { en: 'Pro trial active', fr: 'Essai Pro actif' },
  'subscription.status.pro': { en: 'Pro plan', fr: 'Plan Pro' },
  'subscription.status.free': { en: 'Free plan', fr: 'Plan Free' },
  'subscription.guest': { en: 'Guest', fr: 'Invite' },
  'subscription.renewal': { en: '{{status}} • Renews on {{date}}', fr: '{{status}} • Renouvelle le {{date}}' },
  'subscription.badge.pending': { en: 'Pending', fr: 'En cours' },
  'subscription.badge.pro': { en: 'Pro', fr: 'Pro' },
  'subscription.badge.free': { en: 'Free', fr: 'Free' },
  'subscription.cta.proActive': { en: 'Pro active', fr: 'Pro actif' },
  'subscription.cta.upgrade': { en: 'Go Pro', fr: 'Passer Pro' },
  'subscription.note.authRequired': { en: 'Sign in to manage your subscription.', fr: 'Connectez-vous pour gerer votre abonnement.' },
  'subscription.note.pending': { en: 'Activation in progress. This may take a moment.', fr: 'Activation en cours. Cela peut prendre quelques instants.' },
  'subscription.note.proThanks': { en: 'Thanks for your PRO subscription.', fr: 'Merci pour votre abonnement PRO.' },
  'subscription.note.upgrade': { en: 'Go Pro to unlock unlimited dictation.', fr: 'Passez Pro pour debloquer la dictee illimitee.' },
  'subscription.activation.pending': { en: 'Activation in progress...', fr: 'Activation en cours...' },
  'subscription.activation.success': { en: 'PRO subscription activated.', fr: 'Abonnement PRO active.' },
  'subscription.activation.authRequired': { en: 'Sign in to finalize the subscription.', fr: "Connectez-vous pour finaliser l'abonnement." },
  'subscription.activation.unavailable': { en: 'Refresh unavailable.', fr: 'Actualisation indisponible.' },
  'subscription.checkout.unavailable': { en: 'Checkout unavailable.', fr: 'Checkout indisponible.' },
  'subscription.checkout.authRequired': { en: 'Sign in to upgrade to Pro.', fr: 'Connectez-vous pour passer PRO.' },
  'subscription.checkout.notConfigured': { en: 'Checkout not configured.', fr: 'Checkout non configure.' },
  'subscription.checkout.redirect': { en: 'Redirecting to Stripe...', fr: 'Redirection vers Stripe...' },
  'subscription.checkout.failed': { en: 'Checkout failed.', fr: 'Checkout impossible.' },

  'auth.login': { en: 'Sign in', fr: 'Se connecter' },
  'auth.signup': { en: 'Create account', fr: 'Creer compte' },
  'auth.signOut': { en: 'Sign out', fr: 'Deconnexion' },
  'auth.serverConfigError': { en: 'Server configuration error.', fr: 'Erreur de configuration serveur.' },
  'auth.checking': { en: 'Checking...', fr: 'Verification...' },
  'auth.unavailable': { en: 'Sign-in unavailable', fr: 'Connexion indisponible' },
  'auth.notConfigured': { en: 'Supabase not configured.', fr: 'Supabase non configure.' },
  'auth.missingCredentials': { en: 'Please enter email and password.', fr: 'Veuillez saisir email et mot de passe.' },
  'auth.signingIn': { en: 'Signing in...', fr: 'Connexion en cours...' },
  'auth.failed': { en: 'Sign-in failed.', fr: 'Echec de connexion.' },
  'auth.retrying': { en: 'Retrying...', fr: 'Nouvelle tentative...' },

  'common.opening': { en: 'Opening...', fr: 'Ouverture...' },
  'common.openFailed': { en: 'Unable to open.', fr: 'Ouverture impossible.' },
  'common.audioFile': { en: 'Audio file', fr: 'Fichier audio' },

  'localModel.download.queued': { en: 'Queued...', fr: 'En attente...' },
  'localModel.download.progress': { en: 'Downloading... {{percent}}%', fr: 'Telechargement... {{percent}}%' },
  'localModel.download.verifying': { en: 'Verifying...', fr: 'Verification...' },
  'localModel.download.paused': { en: 'Download paused.', fr: 'Telechargement en pause.' },
  'localModel.download.checksumMismatch': { en: 'Verification failed. Try again.', fr: 'Verification echouee. Reessayez.' },
  'localModel.download.unavailable': { en: 'Download unavailable. Try again.', fr: 'Telechargement indisponible. Reessayez.' },
  'localModel.download.writeFailed': { en: 'Disk write error. Check free space.', fr: "Erreur d'ecriture disque. Verifiez l'espace." },
  'localModel.download.failedWithReason': { en: 'Download failed: {{reason}}.', fr: 'Telechargement echoue: {{reason}}.' },
  'localModel.download.failed': { en: 'Download failed. Try again.', fr: 'Telechargement echoue. Reessayez.' },
  'localModel.download.completed': { en: 'Model downloaded: {{label}}.', fr: 'Modele telecharge: {{label}}.' },
  'localModel.download.heading': { en: 'Download in progress', fr: 'Telechargement en cours' },
  'localModel.download.headingPlural': { en: 'Downloads in progress', fr: 'Telechargements en cours' },
  'localModel.download.cancel': { en: 'Cancel', fr: 'Annuler' },
  'localModel.download.cancelled': { en: 'Download cancelled.', fr: 'Telechargement annule.' },
  'localModel.download.cancelFailed': { en: 'Cancellation failed.', fr: 'Annulation impossible.' },
  'localModel.download.resume': { en: 'Resume', fr: 'Reprendre' },

  'localModel.badge.recommande': { en: 'recommended', fr: 'recommande' },
  'localModel.badge.actif': { en: 'active', fr: 'actif' },
  'localModel.badge.installe': { en: 'installed', fr: 'installe' },
  'localModel.badge.maj': { en: 'update', fr: 'maj' },
  'localModel.badge.erreur': { en: 'error', fr: 'erreur' },

  'localModel.status.installed': { en: 'already downloaded', fr: 'deja telecharge' },
  'localModel.status.size': { en: '~{{size}}', fr: '~{{size}}' },
  'localModel.status.notDownloaded': { en: 'not downloaded', fr: 'non telecharge' },
  'localModel.toast.title': { en: 'Model download', fr: 'Telechargement du modele' },
  'localModel.empty': { en: 'No models available.', fr: 'Aucun modele disponible.' },
  'localModel.loading': { en: 'Loading...', fr: 'Chargement...' },
  'localModel.auto': { en: 'Auto ({{preset}})', fr: 'Auto ({{preset}})' },
  'localModel.memory': { en: '{{value}} GB RAM', fr: '{{value}} GB RAM' },
  'localModel.summary': { en: 'Recommended: {{recommended}} · Active: {{active}}{{memory}}', fr: 'Recommande: {{recommended}} · Actif: {{active}}{{memory}}' },
  'localModel.sourceMissing': { en: 'Source missing.', fr: 'Source manquante.' },
  'localModel.onboarding.downloading': { en: 'Download in progress...', fr: 'Telechargement en cours...' },
  'localModel.onboarding.installed': { en: 'Installed.', fr: 'Installe.' },
  'localModel.action.activate': { en: 'Activate', fr: 'Activer' },
  'localModel.action.update': { en: 'Update', fr: 'Mettre a jour' },
  'localModel.action.remove': { en: 'Remove', fr: 'Supprimer' },
  'localModel.action.install': { en: 'Install', fr: 'Installer' },

  'toast.localModel.presetChangeFailed': { en: 'Unable to change preset.', fr: 'Impossible de changer le preset.' },
  'toast.localModel.download.already': { en: 'Download already in progress.', fr: 'Telechargement deja en cours.' },
  'toast.localModel.notFound': { en: 'Model not found.', fr: 'Modele introuvable.' },
  'toast.localModel.download.failed': { en: 'Download failed.', fr: 'Telechargement impossible.' },
  'toast.localModel.alreadyInstalled': { en: 'Model already installed.', fr: 'Modele deja installe.' },
  'toast.localModel.download.started': { en: 'Download started.', fr: 'Telechargement demarre.' },
  'toast.localModel.preset.selected': { en: 'Preset selected.', fr: 'Preset selectionne.' },
  'notes.untitled': { en: 'Untitled', fr: 'Sans titre' },

  'toast.localAsr.scan.unavailable': { en: 'Scan unavailable.', fr: 'Scan indisponible.' },
  'toast.localAsr.command.detected': { en: 'Local command detected.', fr: 'Commande locale detectee.' },
  'toast.localAsr.command.notFound': { en: 'No local ASR binary detected.', fr: 'Aucun binaire local ASR detecte.' },
  'toast.localAsr.command.alreadySet': { en: 'Command already set.', fr: 'Commande deja definie.' },
  'toast.localAsr.serverMode': { en: 'Server mode active.', fr: 'Mode serveur actif.' },
  'toast.localAsr.scan.failed': { en: 'Scan failed.', fr: 'Scan impossible.' },

  'localAsr.command.python': { en: 'Command detected (Python Whisper). Incompatible with local GGML models.', fr: 'Commande detectee (Python Whisper). Incompatible avec les modeles locaux GGML.' },
  'localAsr.command.detected': { en: 'Command detected: {{command}}', fr: 'Commande detectee: {{command}}' },
  'localAsr.command.missing': { en: 'Local command missing. Add a binary or run auto-scan.', fr: 'Commande locale manquante. Ajoutez un binaire ou lancez un scan automatique.' },
  'localAsr.command.rescan': { en: 'Rescan', fr: 'Rescanner' },
  'localAsr.command.scan': { en: 'Scan', fr: 'Scanner' },

  'crocomni.newConversation': { en: 'New conversation', fr: 'Nouvelle conversation' },
  'crocomni.results.empty': { en: 'No results.', fr: 'Aucun resultat.' },
  'crocomni.result.note': { en: 'Note', fr: 'Note' },
  'crocomni.result.dictation': { en: 'Dictation', fr: 'Dictee' },
  'crocomni.result.dictationWithDate': { en: 'Dictation · {{date}}', fr: 'Dictee · {{date}}' },
  'crocomni.result.type.note': { en: 'NOTE', fr: 'NOTE' },
  'crocomni.result.type.dictation': { en: 'DICTATION', fr: 'DICTEE' },
  'crocomni.answer.disabled': { en: 'Enable "Answer with AI" to generate a response.', fr: 'Activez "Repondre avec IA" pour generer une reponse.' },
  'crocomni.answer.missingKey': { en: 'Add OPENAI_API_KEY to generate a response.', fr: 'Ajoutez OPENAI_API_KEY pour generer une reponse.' },
  'crocomni.answer.pending': { en: 'Generating response...', fr: 'Generation de la reponse...' },
  'crocomni.answer.empty': { en: 'No answer.', fr: 'Aucune reponse.' },
  'crocomni.answer.failed': { en: 'Unable to generate the answer.', fr: 'Impossible de generer la reponse.' },
  'crocomni.search.pending': { en: 'Searching...', fr: 'Recherche en cours...' },
  'crocomni.search.count': { en: '{{count}} result(s)', fr: '{{count}} resultat(s)' },
  'crocomni.search.failed': { en: 'Search failed.', fr: 'Recherche impossible.' },
  'crocomni.composer.responding': { en: 'CrocOmni is responding...', fr: 'CrocOmni repond...' },
  'crocomni.composer.hint': { en: 'Enter to send · Shift+Enter for a new line.', fr: 'Entree pour envoyer · Shift+Entree pour une nouvelle ligne.' },
  'crocomni.meta.contextUsed': { en: 'Context used', fr: 'Contexte utilise' },
  'crocomni.meta.contextNone': { en: 'No context', fr: 'Sans contexte' },

  'toast.style.activated': { en: 'Style "{{name}}" activated.', fr: 'Style "{{name}}" active.' },

  'breadcrumb.home.primary': { en: 'Dashboard', fr: 'Dashboard' },
  'breadcrumb.home.secondary': { en: 'History', fr: 'Historique' },
  'breadcrumb.notes.primary': { en: 'Notes', fr: 'Notes' },
  'breadcrumb.notes.secondary': { en: 'Library', fr: 'Bibliotheque' },
  'breadcrumb.notes.focus': { en: 'Focus', fr: 'Focus' },
  'breadcrumb.dictionary.primary': { en: 'Dictionary', fr: 'Dictionnaire' },
  'breadcrumb.dictionary.secondary': { en: 'Corrections', fr: 'Corrections' },
  'breadcrumb.snippets.primary': { en: 'Snippets', fr: 'Snippets' },
  'breadcrumb.snippets.secondary': { en: 'Templates', fr: 'Templates' },
  'breadcrumb.crocomni.primary': { en: 'CrocOmni', fr: 'CrocOmni' },
  'breadcrumb.crocomni.secondary': { en: 'Assistant', fr: 'Assistant' },
  'breadcrumb.inbox.primary': { en: 'Notifications', fr: 'Notifications' },
  'breadcrumb.inbox.secondary': { en: 'Inbox', fr: 'Inbox' },
  'breadcrumb.insights.primary': { en: 'Insights', fr: 'Insights' },
  'breadcrumb.insights.secondary': { en: 'Wrapped', fr: 'Wrapped' },
  'breadcrumb.context.primary': { en: 'Context', fr: 'Context' },
  'breadcrumb.context.secondary': { en: 'Privacy', fr: 'Privacy' },
  'breadcrumb.styles.primary': { en: 'Styles', fr: 'Styles' },
  'breadcrumb.styles.secondary': { en: 'Persona', fr: 'Persona' },
  'breadcrumb.settings.primary': { en: 'Settings', fr: 'Reglages' },
  'breadcrumb.settings.secondary': { en: 'General', fr: 'General' },
  'breadcrumb.diagnostics.primary': { en: 'Diagnostics', fr: 'Diagnostics' },
  'breadcrumb.diagnostics.secondary': { en: 'Status', fr: 'Etat' },
  'breadcrumb.diff.primary': { en: 'Polish', fr: 'Polish' },
  'breadcrumb.diff.secondary': { en: 'Before / After', fr: 'Avant / Apres' },
  'breadcrumb.account.primary': { en: 'Profile', fr: 'Profil' },
  'breadcrumb.account.secondary': { en: 'Billing', fr: 'Facturation' },
};

if (i18n) {
  i18n.setMessages(I18N_MESSAGES);
}
let modalResolver = null;
let platform = 'win32';
let shortcutCaptureActive = false;
let shortcutBeforeCapture = '';
let shortcutInvalidShown = false;
let suppressDashboardRefreshUntil = 0;
let historyLoadError = false;
let quotaSnapshot = null;
let currentSubscription = null;
let currentAuth = null;
let uploadsData = [];
let localModelsData = null;
let onboardingState = {
  step: 'welcome',
  completed: false,
  firstRunSuccess: false,
  hotkeyReady: false,
  localModelReady: false,
  localModelPreset: '',
  updatedAt: null,
};
let onboardingSessionDismissed = false;
let onboardingMicReady = false;
let onboardingPermissionGranted = false;
let onboardingMicLevel = 0;
let diagnosticsSnapshot = null;
let diagnosticsChecksState = null;
let diffData = { before: '', after: '' };
let modelDownloadToasts = new Map();
let modelDownloadStatusCache = new Map();

const DEFAULT_CONTEXT_SETTINGS = {
  enabled: true,
  postProcessEnabled: false,
  retentionDays: 30,
  screenshotConsentAsked: false,
  signals: {
    app: true,
    window: true,
    url: true,
    ax: false,
    textbox: false,
    screenshot: false,
  },
  overrides: {},
};
let onboardingMicLastActiveAt = 0;
let onboardingRecordingActive = false;
let onboardingDeliveryReady = false;
let onboardingShortcutCaptureActive = false;
let onboardingShortcutBeforeCapture = '';
let micDeviceCount = 0;
let micListKnown = false;
let onboardingMicIgnoreUntil = 0;
let localModelsRefreshAt = 0;
let uploadsInitialized = false;
let uploadStatusCache = new Map();
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
  Default: 'Correction et mise en forme sans reformulation.',
  Casual: 'Reecriture legere, ton simple et naturel.',
  Formel: 'Reecriture legere, ton professionnel et structure.',
  Croco: 'Reecriture libre avec une metaphore courte.',
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
const ONBOARDING_STEPS = ['welcome', 'permissions', 'mic_check', 'hotkey', 'local_model', 'first_dictation', 'delivery_check', 'done'];
const MIC_NOISE_FLOOR = 0.012;
const MIC_READY_THRESHOLD = 0.018;
const MIC_READY_HOLD_MS = 500;
const MIC_IGNORE_AFTER_CHANGE_MS = 1000;
const LOCAL_MODELS_REFRESH_COOLDOWN_MS = 2000;
let focusedNote = null;
let focusedNoteDirty = false;
let focusedNoteSaving = false;
let focusedNoteTimer = null;

function setButtonLoading(button, isLoading, label) {
  if (!button) {
    return;
  }
  if (isLoading) {
    if (!button.dataset.loadingLabel) {
      button.dataset.loadingLabel = button.textContent;
    }
    if (button.dataset.loadingDisabled === undefined) {
      button.dataset.loadingDisabled = button.disabled ? '1' : '0';
    }
    button.disabled = true;
    button.classList.add('is-loading');
    if (label) {
      button.dataset.loadingText = label;
      button.textContent = label;
    }
    return;
  }
  const wasDisabled = button.dataset.loadingDisabled === '1';
  button.disabled = wasDisabled;
  delete button.dataset.loadingDisabled;
  if (button.dataset.loadingLabel && (!button.dataset.loadingText || button.textContent === button.dataset.loadingText)) {
    button.textContent = button.dataset.loadingLabel;
  }
  delete button.dataset.loadingLabel;
  delete button.dataset.loadingText;
  button.classList.remove('is-loading');
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isSubscriptionActive(subscription) {
  if (!subscription) {
    return false;
  }
  if (subscription.isPro) {
    return true;
  }
  return subscription.status === 'active' || subscription.status === 'trialing';
}

function normalizeOnboardingState(settings) {
  const onboarding = settings?.onboarding || {};
  const step = ONBOARDING_STEPS.includes(onboarding.step) ? onboarding.step : 'welcome';
  return {
    step,
    completed: Boolean(onboarding.completed),
    firstRunSuccess: Boolean(onboarding.firstRunSuccess),
    hotkeyReady: Boolean(onboarding.hotkeyReady),
    localModelReady: Boolean(onboarding.localModelReady),
    localModelPreset: typeof onboarding.localModelPreset === 'string' ? onboarding.localModelPreset : '',
    updatedAt: onboarding.updatedAt || null,
  };
}

function setOnboardingChecklistState(el, done) {
  if (!el) {
    return;
  }
  el.classList.toggle('done', Boolean(done));
}

function setOnboardingOverlayVisible(visible) {
  if (!onboardingOverlay) {
    return;
  }
  onboardingOverlay.classList.toggle('active', visible);
  onboardingOverlay.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

async function persistOnboardingState(nextState) {
  if (!window.electronAPI?.saveSettings) {
    return;
  }
  onboardingState = { ...onboardingState, ...nextState, updatedAt: new Date().toISOString() };
  await window.electronAPI.saveSettings({ onboarding: onboardingState });
}

function setOnboardingStep(step, { skipPersist } = {}) {
  if (!ONBOARDING_STEPS.includes(step)) {
    return;
  }
  onboardingState = { ...onboardingState, step };
  updateOnboardingUI();
  if (!skipPersist) {
    persistOnboardingState({ step });
  }
}

function updateOnboardingStepper() {
  if (!onboardingStepper) {
    return;
  }
  const currentIndex = ONBOARDING_STEPS.indexOf(onboardingState.step);
  onboardingStepper.querySelectorAll('.onboarding-step').forEach((stepEl) => {
    const step = stepEl.dataset.step;
    const stepIndex = ONBOARDING_STEPS.indexOf(step);
    const isActive = step === onboardingState.step;
    stepEl.classList.toggle('active', isActive);
    stepEl.classList.toggle('done', stepIndex > -1 && stepIndex < currentIndex);
  });
}

function updateOnboardingPanels() {
  onboardingPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.step === onboardingState.step);
  });
}

function updateOnboardingChecklist() {
  setOnboardingChecklistState(onboardingCheckPermission, onboardingPermissionGranted);
  setOnboardingChecklistState(onboardingCheckSignal, onboardingMicReady);
  setOnboardingChecklistState(onboardingCheckHotkey, onboardingState?.hotkeyReady);
  setOnboardingChecklistState(onboardingCheckDictation, onboardingState?.firstRunSuccess);
  setOnboardingChecklistState(onboardingCheckDelivery, onboardingDeliveryReady);
}

function updateOnboardingUI() {
  if (!onboardingOverlay) {
    return;
  }

  const shouldShow = !onboardingSessionDismissed && !onboardingState?.completed;
  setOnboardingOverlayVisible(shouldShow);
  updateOnboardingStepper();
  updateOnboardingPanels();
  updateOnboardingChecklist();

  if (onboardingMicContinue) {
    onboardingMicContinue.disabled = !onboardingMicReady;
  }
  if (onboardingFirstRunNext) {
    onboardingFirstRunNext.disabled = !onboardingState?.firstRunSuccess;
  }
  if (onboardingDeliveryNext) {
    onboardingDeliveryNext.disabled = !onboardingDeliveryReady;
  }
  if (onboardingState.step === 'permissions' && !onboardingPermissionGranted) {
    setOnboardingStatus(onboardingPermissionStatus, t('onboarding.permissions.status'));
  }
  if (onboardingState.step === 'mic_check' && !onboardingMicReady) {
    if (micListKnown && micDeviceCount === 0) {
      setOnboardingStatus(onboardingMicStatus, t('onboarding.mic.noMic'), 'error');
    } else {
      setOnboardingStatus(onboardingMicStatus, t('onboarding.mic.waiting'));
    }
  }
  if (onboardingState.step === 'hotkey') {
    if (onboardingHotkeyInput && !onboardingShortcutCaptureActive) {
      onboardingHotkeyInput.value = currentSettings.shortcut || '';
    }
    const hasShortcut = Boolean((currentSettings.shortcut || '').trim());
    if (hasShortcut && !onboardingState.hotkeyReady) {
      onboardingState = { ...onboardingState, hotkeyReady: true };
      persistOnboardingState({ hotkeyReady: true });
    }
    if (!onboardingState.hotkeyReady) {
      setOnboardingStatus(onboardingHotkeyStatus, t('onboarding.hotkey.prompt'));
    } else {
      setOnboardingStatus(onboardingHotkeyStatus, t('onboarding.hotkey.ready'), 'success');
    }
  }
  if (onboardingHotkeyNext) {
    onboardingHotkeyNext.disabled = !onboardingState?.hotkeyReady;
  }

  if (onboardingState.step === 'local_model') {
    if (platform !== 'win32') {
      setOnboardingStep('first_dictation');
      return;
    }
    if (Date.now() - localModelsRefreshAt >= LOCAL_MODELS_REFRESH_COOLDOWN_MS) {
      localModelsRefreshAt = Date.now();
      void refreshLocalModelsOnly();
    }
    if (onboardingLocalModelNext) {
      onboardingLocalModelNext.disabled = false;
    }
    renderOnboardingLocalModels();
  }

  if (onboardingState.step === 'mic_check' && window.electronAPI?.startOnboardingMic) {
    window.electronAPI.startOnboardingMic();
  }

  if (!['permissions', 'mic_check'].includes(onboardingState.step)) {
    if (window.electronAPI?.stopOnboardingMic) {
      window.electronAPI.stopOnboardingMic();
    }
  }
}

function applyOnboardingStateFromSettings(settings) {
  onboardingState = normalizeOnboardingState(settings);
  if (onboardingState.step === 'welcome' && !onboardingState.completed) {
    onboardingMicReady = false;
    onboardingPermissionGranted = false;
    onboardingMicLastActiveAt = 0;
    onboardingDeliveryReady = false;
    onboardingState.hotkeyReady = false;
    onboardingState.localModelReady = false;
    onboardingState.localModelPreset = '';
    onboardingMicIgnoreUntil = 0;
  }
  updateOnboardingUI();
}

function setOnboardingStatus(el, message, tone = '') {
  if (!el) {
    return;
  }
  el.textContent = message || '';
  el.classList.remove('error', 'success');
  if (tone) {
    el.classList.add(tone);
  }
}

function updateVuMeter(level) {
  if (!onboardingVuBar) {
    return;
  }
  const clamped = Math.max(0, Math.min(1, level || 0));
  onboardingVuBar.style.width = `${Math.round(clamped * 100)}%`;
}

function handleOnboardingMicLevel(payload) {
  if (Date.now() < onboardingMicIgnoreUntil) {
    return;
  }
  const level = typeof payload?.level === 'number' ? payload.level : 0;
  onboardingMicLevel = onboardingMicLevel ? (onboardingMicLevel * 0.7 + level * 0.3) : level;
  const effectiveLevel = Math.max(0, onboardingMicLevel - MIC_NOISE_FLOOR);
  updateVuMeter(effectiveLevel * 6);
  onboardingPermissionGranted = level > 0 || onboardingPermissionGranted;
  if (onboardingPermissionGranted) {
    setOnboardingStatus(onboardingPermissionStatus, t('onboarding.permissions.allowed'), 'success');
    if (onboardingState?.step === 'permissions') {
      setOnboardingStep('mic_check');
    }
  }
  updateOnboardingChecklist();

  if (onboardingMicReady) {
    return;
  }
  if (effectiveLevel >= MIC_READY_THRESHOLD) {
    if (!onboardingMicLastActiveAt) {
      onboardingMicLastActiveAt = Date.now();
    }
    if (Date.now() - onboardingMicLastActiveAt >= MIC_READY_HOLD_MS) {
      onboardingMicReady = true;
      setOnboardingStatus(onboardingMicStatus, t('onboarding.mic.signalDetected'), 'success');
      updateOnboardingChecklist();
      updateOnboardingUI();
      return;
    }
  } else {
    onboardingMicLastActiveAt = 0;
  }
  if (onboardingMicStatus) {
    setOnboardingStatus(onboardingMicStatus, t('onboarding.mic.waiting'));
  }
}

async function refreshSubscriptionData() {
  if (!window.electronAPI?.refreshSubscription) {
    return { ok: false, reason: 'not_available' };
  }
  try {
    const result = await window.electronAPI.refreshSubscription();
    if (!result?.ok) {
      return { ok: false, reason: result?.reason || 'error' };
    }
    await refreshDashboard();
    return { ok: true, subscription: dashboardData?.subscription };
  } catch (error) {
    return { ok: false, reason: 'error' };
  }
}

async function startSubscriptionActivationCheck({ force } = {}) {
  if (subscriptionPollInFlight) {
    return;
  }
  const subscription = dashboardData?.subscription;
  if (isSubscriptionActive(subscription)) {
    return;
  }
  if (!force) {
    if (!subscription || subscription.status !== 'pending') {
      return;
    }
    const now = Date.now();
    if (now - lastSubscriptionPollAt < SUBSCRIPTION_POLL_COOLDOWN_MS) {
      return;
    }
    lastSubscriptionPollAt = now;
  }

  subscriptionPollInFlight = true;
  const token = ++subscriptionPollToken;
  lastSubscriptionPollAt = Date.now();
  showToastKey('subscription.activation.pending');

  for (let attempt = 0; attempt < SUBSCRIPTION_POLL_MAX_ATTEMPTS; attempt += 1) {
    const result = await refreshSubscriptionData();
    if (token !== subscriptionPollToken) {
      break;
    }
    if (result?.ok && isSubscriptionActive(dashboardData?.subscription)) {
      showToastKey('subscription.activation.success');
      break;
    }
    if (result?.reason === 'not_authenticated') {
      showToastKey('subscription.activation.authRequired', 'error');
      break;
    }
    if (result?.reason === 'not_configured') {
      showToastKey('subscription.activation.unavailable', 'error');
      break;
    }
    if (attempt < SUBSCRIPTION_POLL_MAX_ATTEMPTS - 1) {
      await delay(SUBSCRIPTION_POLL_DELAY_MS);
    }
  }

  subscriptionPollInFlight = false;
}

async function triggerCheckout(button) {
  if (!window.electronAPI?.startCheckout) {
    showToastKey('subscription.checkout.unavailable', 'error');
    return;
  }
  const auth = window.electronAPI?.authStatus ? await window.electronAPI.authStatus() : null;
  if (!auth) {
    showToastKey('subscription.checkout.authRequired', 'error');
    if (window.electronAPI?.openSignupUrl) {
      setButtonLoading(button, true, t('common.opening'));
      const result = await window.electronAPI.openSignupUrl('login');
      if (result?.ok === false) {
        showToastKey('common.openFailed', 'error');
      }
      setButtonLoading(button, false);
    }
    return;
  }
  try {
    setButtonLoading(button, true, t('common.opening'));
    const result = await window.electronAPI.startCheckout();
    if (!result?.ok) {
      showToastKey('subscription.checkout.notConfigured', 'error');
      return;
    }
    showToastKey('subscription.checkout.redirect');
    await refreshDashboard();
    startSubscriptionActivationCheck({ force: true });
  } catch (error) {
    showToast(error?.message || t('subscription.checkout.failed'), 'error');
  } finally {
    setButtonLoading(button, false);
  }
}

function openModal({ title, fields, confirmText }) {
  if (!modalBackdrop || !modalBody || !modalTitle || !modalCancel || !modalConfirm) {
    return Promise.resolve(null);
  }

  modalTitle.textContent = title;
  modalConfirm.textContent = confirmText || t('modal.confirm');
  modalBody.innerHTML = '';
  const inputs = {};

  fields.forEach((field, index) => {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = field.label;

    let input;
    if (field.type === 'select') {
      input = document.createElement('select');
      input.className = 'input-select';
      (field.options || []).forEach((option) => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.label;
        input.appendChild(opt);
      });
    } else if (field.multiline) {
      input = document.createElement('textarea');
      input.rows = 4;
      input.className = 'input-textarea';
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'input-field';
    }

    input.value = field.value || '';
    input.placeholder = field.placeholder || '';
    input.dataset.key = field.key;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    modalBody.appendChild(wrapper);
    inputs[field.key] = input;

    if (index === 0) {
      setTimeout(() => input.focus(), 0);
    }
  });

  modalBackdrop.classList.add('is-visible');
  modalBackdrop.setAttribute('aria-hidden', 'false');

  return new Promise((resolve) => {
    modalResolver = resolve;

    const closeModal = (value) => {
      modalBackdrop.classList.remove('is-visible');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      modalResolver = null;
      resolve(value);
    };

    modalCancel.onclick = () => closeModal(null);
    modalConfirm.onclick = () => {
      const values = {};
      Object.keys(inputs).forEach((key) => {
        values[key] = inputs[key].value.trim();
      });
      closeModal(values);
    };
  });
}

function openContextScreenshotConsent() {
  if (!modalBackdrop || !modalBody || !modalTitle || !modalCancel || !modalConfirm) {
    return Promise.resolve(null);
  }

  modalTitle.textContent = 'Consentement capture d’écran';
  modalConfirm.textContent = 'Continuer';
  modalBody.innerHTML = '';

  const intro = document.createElement('p');
  intro.style.margin = '0';
  intro.style.fontSize = '14px';
  intro.style.color = 'var(--text-muted)';
  intro.textContent = 'Pour activer la conscience contextuelle, CrocoVoice peut capturer une image de la fenêtre active afin de mieux adapter le formatage.';

  const list = document.createElement('ul');
  list.style.margin = '0';
  list.style.paddingLeft = '18px';
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '6px';
  list.style.color = 'var(--text-muted)';
  list.style.fontSize = '12px';
  [
    'Local uniquement (local-only).',
    'Jamais synchronisé (never synced).',
    'Éphémère (ephemeral) : supprimé automatiquement.',
  ].forEach((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    list.appendChild(item);
  });

  const consentRow = document.createElement('label');
  consentRow.className = 'context-signal-row';
  consentRow.style.marginTop = '4px';
  consentRow.style.background = '#FFFFFF';

  const consentLabel = document.createElement('div');
  consentLabel.style.display = 'flex';
  consentLabel.style.alignItems = 'center';
  consentLabel.style.gap = '8px';
  const consentText = document.createElement('span');
  consentText.textContent = 'Capture d’écran';

  const badge = document.createElement('span');
  badge.textContent = 'Recommandé';
  badge.style.fontSize = '10px';
  badge.style.fontWeight = '700';
  badge.style.textTransform = 'uppercase';
  badge.style.letterSpacing = '0.08em';
  badge.style.padding = '2px 6px';
  badge.style.borderRadius = '999px';
  badge.style.background = '#ECFDF3';
  badge.style.color = '#047857';
  consentLabel.appendChild(consentText);
  consentLabel.appendChild(badge);

  const consentCheckbox = document.createElement('input');
  consentCheckbox.type = 'checkbox';
  consentCheckbox.checked = true;

  consentRow.appendChild(consentLabel);
  consentRow.appendChild(consentCheckbox);

  const footnote = document.createElement('div');
  footnote.style.fontSize = '12px';
  footnote.style.color = 'var(--text-muted)';
  footnote.textContent = 'Vous pourrez modifier ce choix plus tard dans Context → Signaux.';

  modalBody.appendChild(intro);
  modalBody.appendChild(list);
  modalBody.appendChild(consentRow);
  modalBody.appendChild(footnote);

  modalBackdrop.classList.add('is-visible');
  modalBackdrop.setAttribute('aria-hidden', 'false');

  return new Promise((resolve) => {
    modalResolver = resolve;

    const closeModal = (value) => {
      modalBackdrop.classList.remove('is-visible');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      modalResolver = null;
      resolve(value);
    };

    modalCancel.onclick = () => closeModal(null);
    modalConfirm.onclick = () => closeModal({ screenshot: consentCheckbox.checked });
  });
}

function updateBreadcrumb(viewName) {
  if (!breadcrumbPrimary || !breadcrumbSecondary) {
    return;
  }

  const map = {
    home: { primary: t('breadcrumb.home.primary'), secondary: t('breadcrumb.home.secondary') },
    notes: { primary: t('breadcrumb.notes.primary'), secondary: t('breadcrumb.notes.secondary') },
    'note-focus': { primary: t('breadcrumb.notes.primary'), secondary: t('breadcrumb.notes.focus') },
    dictionary: { primary: t('breadcrumb.dictionary.primary'), secondary: t('breadcrumb.dictionary.secondary') },
    snippets: { primary: t('breadcrumb.snippets.primary'), secondary: t('breadcrumb.snippets.secondary') },
    crocomni: { primary: t('breadcrumb.crocomni.primary'), secondary: t('breadcrumb.crocomni.secondary') },
    inbox: { primary: t('breadcrumb.inbox.primary'), secondary: t('breadcrumb.inbox.secondary') },
    insights: { primary: t('breadcrumb.insights.primary'), secondary: t('breadcrumb.insights.secondary') },
    context: { primary: t('breadcrumb.context.primary'), secondary: t('breadcrumb.context.secondary') },
    style: { primary: t('breadcrumb.styles.primary'), secondary: t('breadcrumb.styles.secondary') },
    settings: { primary: t('breadcrumb.settings.primary'), secondary: t('breadcrumb.settings.secondary') },
    diagnostics: { primary: t('breadcrumb.diagnostics.primary'), secondary: t('breadcrumb.diagnostics.secondary') },
    diff: { primary: t('breadcrumb.diff.primary'), secondary: t('breadcrumb.diff.secondary') },
    account: { primary: t('breadcrumb.account.primary'), secondary: t('breadcrumb.account.secondary') },
  };

  const next = map[viewName] || map.home;
  breadcrumbPrimary.textContent = next.primary;
  breadcrumbSecondary.textContent = next.secondary;
}

function setActiveView(viewName) {
  const supportedViews = new Set([
    'home',
    'notes',
    'note-focus',
    'dictionary',
    'snippets',
    'crocomni',
    'inbox',
    'insights',
    'context',
    'style',
    'settings',
    'diagnostics',
    'diff',
    'account',
  ]);
  const nextView = supportedViews.has(viewName) ? viewName : 'home';
  views.forEach((view) => {
    view.classList.toggle('active', view.id === `view-${nextView}`);
  });

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.view === nextView);
  });

  currentView = nextView;
  if (nextView !== 'crocomni') {
    crocOmniAutoReturnView = null;
  }
  updateBreadcrumb(nextView);
  refreshActiveList();
}

function formatTime(iso) {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(value) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '';
  }
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) {
    return '';
  }
  const mb = bytes / (1024 * 1024);
  if (mb < 1) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${mb.toFixed(1)} MB`;
}

function deriveHistoryTitle(entry) {
  const text = (entry && (entry.text || entry.raw_text)) || '';
  const firstLine = text.split(/\r?\n/).find((line) => line && line.trim()) || '';
  const sentence = firstLine.split(/[.!?]/).find((part) => part && part.trim()) || firstLine;
  const trimmed = sentence.trim();
  if (!trimmed) {
    return 'Untitled';
  }
  return trimmed.length > 80 ? `${trimmed.slice(0, 77)}...` : trimmed;
}

function normalizeSnippetCue(value) {
  if (!value) {
    return '';
  }
  return value
    .toString()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s\p{P}]+$/gu, '');
}

function normalizeContextSettings(value) {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_CONTEXT_SETTINGS };
  }
  const screenshotConsentAsked = value.screenshotConsentAsked === true || value?.signals?.screenshot === true;
  return {
    enabled: value.enabled !== false,
    postProcessEnabled: value.postProcessEnabled === true,
    retentionDays: Number.isFinite(value.retentionDays) ? value.retentionDays : DEFAULT_CONTEXT_SETTINGS.retentionDays,
    screenshotConsentAsked,
    signals: { ...DEFAULT_CONTEXT_SETTINGS.signals, ...(value.signals || {}) },
    overrides: value.overrides && typeof value.overrides === 'object' ? value.overrides : {},
  };
}

function getContextSettingsLocal() {
  return normalizeContextSettings(currentSettings.context);
}

function getContextProfilesLocal() {
  return Array.isArray(currentSettings.contextProfiles) ? currentSettings.contextProfiles : [];
}

async function saveContextSettings(nextContext) {
  currentSettings = { ...currentSettings, context: nextContext };
  if (window.electronAPI?.saveSettings) {
    await window.electronAPI.saveSettings(sanitizeSettingsForSave(currentSettings));
  }
}

async function saveContextProfiles(nextProfiles) {
  currentSettings = { ...currentSettings, contextProfiles: nextProfiles };
  if (window.electronAPI?.saveSettings) {
    await window.electronAPI.saveSettings(sanitizeSettingsForSave(currentSettings));
  }
}

function filterEntries(entries, query) {
  if (!query) {
    return entries || [];
  }
  const lower = query.toLowerCase();
  return (entries || []).filter((entry) => [entry.title, entry.text, entry.raw_text, entry.formatted_text, entry.edited_text]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(lower));
}

function filterSnippets(entries, query) {
  if (!query) {
    return entries || [];
  }
  const lower = query.toLowerCase();
  return (entries || []).filter((entry) => [entry.cue, entry.template, entry.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(lower));
}

async function copyTextWithFallback(text) {
  if (!text) {
    return false;
  }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.warn('Clipboard API failed, falling back to main process.', error);
  }
  if (window.electronAPI?.writeClipboard) {
    const result = await window.electronAPI.writeClipboard(text);
    return Boolean(result && result.ok);
  }
  return false;
}

function showToast(message, type = 'success') {
  if (!toastContainer) {
    return;
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  const icon = document.createElement('div');
  icon.className = 'toast-icon';
  icon.innerHTML = type === 'error'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"></path></svg>';
  const content = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'toast-title';
  title.textContent = type === 'error' ? t('toast.title.error') : t('toast.title.success');
  const messageEl = document.createElement('div');
  messageEl.className = 'toast-message';
  messageEl.textContent = message || '';
  content.appendChild(title);
  content.appendChild(messageEl);
  toast.appendChild(icon);
  toast.appendChild(content);
  toast.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    if (toast.isConnected) {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }
  }, 4800);
}

function showUndoToast(message, actionLabel, onUndo) {
  if (!toastContainer) {
    return;
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = document.createElement('div');
  icon.className = 'toast-icon';
  icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0-8-8"></path><polyline points="8 4 4 4 4 8"></polyline></svg>';
  const content = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'toast-title';
  title.textContent = t('toast.title.action');
  const messageEl = document.createElement('div');
  messageEl.className = 'toast-message';
  messageEl.textContent = message || '';
  content.appendChild(title);
  content.appendChild(messageEl);
  const actionButton = document.createElement('button');
  actionButton.className = 'toast-action';
  actionButton.type = 'button';
  actionButton.textContent = actionLabel || '';
  toast.appendChild(icon);
  toast.appendChild(content);
  toast.appendChild(actionButton);
  const dismiss = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  };
  if (actionButton) {
    actionButton.addEventListener('click', async (event) => {
      event.stopPropagation();
      if (typeof onUndo === 'function') {
        await onUndo();
      }
      dismiss();
    });
  }
  toast.addEventListener('click', dismiss);
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    if (toast.isConnected) {
      dismiss();
    }
  }, 5200);
}

function showToastKey(key, type = 'success', vars) {
  showToast(t(key, vars), type);
}

function showUndoToastKey(messageKey, actionKey, onUndo, vars) {
  showUndoToast(t(messageKey, vars), t(actionKey), onUndo);
}

async function deleteNoteWithUndo(entry) {
  if (!window.electronAPI?.deleteNote || !window.electronAPI?.upsertNote) {
    return;
  }
  notesData = notesData.filter((item) => item.id !== entry.id);
  if (statTotal) {
    statTotal.textContent = `${notesData.length}`;
  }
  const filtered = filterEntries(notesData, searchTerm);
  const removed = removeNoteRowFromList(entry.id);
  updateNotesEmptyState(filtered);
  if (!removed) {
    renderNotesList();
  }
  suppressDashboardRefresh(500);
  await window.electronAPI.deleteNote(entry.id);
  showUndoToastKey('toast.noteDeleted', 'toast.undo', async () => {
    const payload = {
      id: entry.id,
      user_id: entry.user_id || null,
      title: entry.title || extractNoteTitle(entry.text || ''),
      text: entry.text || '',
      metadata: entry.metadata || null,
      created_at: entry.created_at,
      updated_at: entry.updated_at || entry.created_at,
    };
    const record = await window.electronAPI.upsertNote(payload);
    updateNotesData(record);
  });
}

async function deleteHistoryWithUndo(entry) {
  if (!window.electronAPI?.deleteHistory || !window.electronAPI?.upsertHistory) {
    return;
  }
  historyData = historyData.filter((item) => item.id !== entry.id);
  renderHistoryList();
  await window.electronAPI.deleteHistory(entry.id);
  showUndoToastKey('toast.entryDeleted', 'toast.undo', async () => {
      const payload = {
        id: entry.id,
        user_id: entry.user_id || null,
        text: entry.text || '',
        raw_text: entry.raw_text || entry.text || '',
        formatted_text: entry.formatted_text || null,
        edited_text: entry.edited_text || entry.text || '',
        language: entry.language || currentSettings.language || 'fr',
        duration_ms: entry.duration_ms || null,
        latency_ms: typeof entry.latency_ms === 'number' ? entry.latency_ms : null,
        network_latency_ms: typeof entry.network_latency_ms === 'number' ? entry.network_latency_ms : null,
        divergence_score: typeof entry.divergence_score === 'number' ? entry.divergence_score : null,
        mic_device: entry.mic_device || null,
        fallback_path: entry.fallback_path || null,
        fallback_reason: entry.fallback_reason || null,
        transcription_path: entry.transcription_path || null,
        audio_quality_class: entry.audio_quality_class || null,
        audio_diagnostics_json: entry.audio_diagnostics_json || null,
        title: entry.title || deriveHistoryTitle(entry),
        created_at: entry.created_at,
        updated_at: entry.updated_at || entry.created_at,
      };
    const record = await window.electronAPI.upsertHistory(payload);
    if (record && record.id) {
      historyData = [record, ...historyData.filter((item) => item.id !== record.id)];
      renderHistoryList();
    }
  });
}

function sanitizeSettingsForSave(value) {
  const settings = { ...(value || {}) };
  delete settings.apiKeyPresent;
  delete settings.deliveryMode;
  return settings;
}

function setSyncStatusMessage(message, type) {
  if (!syncStatus) {
    return;
  }
  syncStatus.textContent = message || '';
  syncStatus.classList.remove('ok', 'error');
  if (type === 'ok') {
    syncStatus.classList.add('ok');
  } else if (type === 'error') {
    syncStatus.classList.add('error');
  }
}

function setEmptyStateMessage(element, title, body, showAction = true) {
  if (!element) {
    return;
  }
  const titleEl = element.querySelector('.empty-title');
  const bodyEl = element.querySelector('.empty-body');
  const actionEl = element.querySelector('.empty-action');
  if (titleEl) {
    titleEl.textContent = title || '';
  }
  if (bodyEl) {
    bodyEl.textContent = body || '';
  }
  if (actionEl) {
    actionEl.style.display = showAction ? 'inline-flex' : 'none';
  }
}

function setEmptyStateState(element, hasSearch) {
  if (!element) {
    return;
  }
  const titleEl = element.querySelector('.empty-title');
  const bodyEl = element.querySelector('.empty-body');
  const actionEl = element.querySelector('.empty-action');
  const title = hasSearch ? element.dataset.searchTitle : element.dataset.emptyTitle;
  const body = hasSearch ? element.dataset.searchBody : element.dataset.emptyBody;
  if (titleEl) {
    titleEl.textContent = title || '';
  }
  if (bodyEl) {
    bodyEl.textContent = body || '';
  }
  if (actionEl) {
    actionEl.style.display = hasSearch ? 'none' : 'inline-flex';
  }
}

function suppressDashboardRefresh(durationMs = 0) {
  const until = Date.now() + Math.max(0, durationMs);
  if (until > suppressDashboardRefreshUntil) {
    suppressDashboardRefreshUntil = until;
  }
}

function shouldSuppressDashboardRefresh() {
  return Date.now() < suppressDashboardRefreshUntil;
}

function renderHistoryLoading() {
  if (!historyList || !historyEmpty) {
    return;
  }
  historyLoadError = false;
  historyEmpty.style.display = 'none';
  historyList.innerHTML = `
    <div class="history-skeleton">
      <div class="history-skeleton-row">
        <div class="history-skeleton-icon"></div>
        <div class="history-skeleton-lines">
          <div class="history-skeleton-line short"></div>
          <div class="history-skeleton-line"></div>
        </div>
      </div>
      <div class="history-skeleton-row">
        <div class="history-skeleton-icon"></div>
        <div class="history-skeleton-lines">
          <div class="history-skeleton-line short"></div>
          <div class="history-skeleton-line"></div>
        </div>
      </div>
      <div class="history-skeleton-row">
        <div class="history-skeleton-icon"></div>
        <div class="history-skeleton-lines">
          <div class="history-skeleton-line short"></div>
          <div class="history-skeleton-line"></div>
        </div>
      </div>
    </div>
  `;
}

function renderHistoryError(message) {
  if (!historyList || !historyEmpty) {
    return;
  }
  historyLoadError = true;
  historyList.innerHTML = '';
  historyEmpty.style.display = 'flex';
  setEmptyStateMessage(
    historyEmpty,
    historyEmpty.dataset.errorTitle || t('home.history.errorTitle'),
    message || historyEmpty.dataset.errorBody || t('home.history.errorBody'),
    false,
  );
}

function extractNoteTitle(text) {
  if (!text) {
    return t('notes.untitled');
  }
  const line = text.split(/\r?\n/).map((row) => row.trim()).find(Boolean);
  if (!line) {
    return t('notes.untitled');
  }
  return line.length > 80 ? `${line.slice(0, 80)}…` : line;
}

function getNotePreview(text) {
  if (!text) {
    return '';
  }
  const collapsed = text.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= 160) {
    return collapsed;
  }
  return `${collapsed.slice(0, 160)}…`;
}

function normalizeNoteMetadata(metadata) {
  if (!metadata) {
    return {};
  }
  if (typeof metadata === 'object') {
    return metadata;
  }
  try {
    return JSON.parse(metadata);
  } catch {
    return {};
  }
}

function formatDateTimeLabel(iso) {
  if (!iso) {
    return '—';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInlineMarkdown(text) {
  let safe = escapeHtml(text);
  safe = safe.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
  safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  safe = safe.replace(/~~([^~]+)~~/g, '<s>$1</s>');
  return safe;
}

function renderMarkdownLite(text) {
  if (!text) {
    return '';
  }
  const lines = text.split(/\r?\n/);
  const html = [];
  let listType = null;
  let inCode = false;
  let codeLines = [];
  let paragraphLines = [];

  const closeList = () => {
     if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  const closeCode = () => {
    if (inCode) {
      html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      inCode = false;
      codeLines = [];
    }
  };

  const flushParagraph = () => {
    if (paragraphLines.length) {
      html.push(`<p>${formatInlineMarkdown(paragraphLines.join(' '))}</p>`);
      paragraphLines = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      if (inCode) {
        closeCode();
      } else {
        closeList();
        inCode = true;
      }
      flushParagraph();
      return;
    }
    if (inCode) {
      codeLines.push(line);
      return;
    }

    if (!trimmed) {
      flushParagraph();
      closeList();
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${formatInlineMarkdown(headingMatch[2])}</h${level}>`);
      return;
    }

    const quoteMatch = trimmed.match(/^>\s+(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      closeList();
      html.push(`<blockquote>${formatInlineMarkdown(quoteMatch[1])}</blockquote>`);
      return;
    }

     const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
     const unorderedMatch = line.match(/^(\s*)([-*])\s+(.*)$/);
     if (orderedMatch || unorderedMatch) {
      flushParagraph();
        const match = orderedMatch || unorderedMatch;
      const indent = match[1] || '';
      const type = orderedMatch ? 'ol' : 'ul';
      const content = orderedMatch ? orderedMatch[3] : unorderedMatch[3];
      if (listType && listType !== type) {
        closeList();
      }
      if (!listType) {
        html.push(`<${type}>`);
        listType = type;
      }
      const indentLevel = Math.floor(indent.length / 2);
      const indentStyle = indentLevel ? ` style="margin-left:${indentLevel * 16}px"` : '';
      html.push(`<li${indentStyle}>${formatInlineMarkdown(content)}</li>`);      return;
    }

    closeList();
    paragraphLines.push(trimmed);
  });

  flushParagraph();
  closeList();
  closeCode();

  return html.join('\n');
}

function setFocusedNoteStatus(state, detail) {
  if (!noteFocusStatus) {
    return;
  }
  noteFocusStatus.classList.remove('is-dirty', 'is-saving', 'is-error');
  let label = 'Enregistré';
  if (state === 'dirty') {
    label = 'Modifications non sauvegardées';
    noteFocusStatus.classList.add('is-dirty');
  } else if (state === 'saving') {
    label = 'Enregistrement...';
    noteFocusStatus.classList.add('is-saving');
  } else if (state === 'error') {
    label = 'Erreur';
    noteFocusStatus.classList.add('is-error');
  } else if (state === 'empty') {
    label = 'Vide';
    noteFocusStatus.classList.add('is-dirty');
  }
  noteFocusStatus.textContent = label;
  if (noteFocusTimestamp && detail !== undefined) {
    noteFocusTimestamp.textContent = detail || '—';
  }
}

const NOTE_FOCUS_MIN_WIDTH = 360;
const NOTE_FOCUS_MAX_RATIO = 0.8;
let noteFocusWidth = null;
let noteFocusResizing = false;

function clampNoteFocusWidth(value) {
  const min = Math.max(NOTE_FOCUS_MIN_WIDTH, Math.floor(window.innerWidth * 0.35));
  const max = Math.max(min, Math.floor(window.innerWidth * NOTE_FOCUS_MAX_RATIO));
  const next = Math.round(value);
  return Math.min(Math.max(next, min), max);
}

function applyNoteFocusWidth(value) {
  const next = clampNoteFocusWidth(value);
  noteFocusWidth = next;
  document.documentElement.style.setProperty('--note-focus-width', `${next}px`);
}

function ensureNoteFocusWidth() {
  if (!noteFocusWidth) {
    applyNoteFocusWidth(window.innerWidth * 0.5);
    return;
  }
  applyNoteFocusWidth(noteFocusWidth);
}

function handleNoteFocusResize(event) {
  if (!noteFocusResizing) {
    return;
  }
  const nextWidth = window.innerWidth - event.clientX;
  applyNoteFocusWidth(nextWidth);
}

function stopNoteFocusResize() {
  if (!noteFocusResizing) {
    return;
  }
  noteFocusResizing = false;
  document.body.classList.remove('note-focus-resizing');
  window.removeEventListener('pointermove', handleNoteFocusResize);
  window.removeEventListener('pointerup', stopNoteFocusResize);
  window.removeEventListener('pointercancel', stopNoteFocusResize);
}

function htmlToMarkdownLite(html) {
  if (!html) {
    return '';
  }
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  const serializeInline = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }
    const tag = node.tagName.toLowerCase();
    if (tag === 'strong' || tag === 'b') {
      return `**${serializeChildren(node)}**`;
    }
    if (tag === 'em' || tag === 'i') {
      return `*${serializeChildren(node)}*`;
    }
    if (tag === 's' || tag === 'del') {
      return `~~${serializeChildren(node)}~~`;
    }
    if (tag === 'code') {
      return `\`${serializeChildren(node)}\``;
    }
    if (tag === 'a') {
      const href = node.getAttribute('href') || '';
      const label = serializeChildren(node) || href;
      return href ? `[${label}](${href})` : label;
    }
    if (tag === 'br') {
      return '\n';
    }
    return serializeChildren(node);
  };

  const serializeChildren = (node) => {
    return Array.from(node.childNodes).map(serializeInline).join('');
  };

  const blocks = [];

  const serializeBlock = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      return text.trim() ? text : '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }
    const tag = node.tagName.toLowerCase();
    if (tag === 'h1') {
      return `# ${serializeChildren(node)}`;
    }
    if (tag === 'h2') {
      return `## ${serializeChildren(node)}`;
    }
    if (tag === 'h3') {
      return `### ${serializeChildren(node)}`;
    }
    if (tag === 'blockquote') {
      return serializeChildren(node).split('\n').map((line) => `> ${line}`).join('\n');
    }
    if (tag === 'ul') {
      return Array.from(node.querySelectorAll('li')).map((li) => `- ${serializeChildren(li)}`).join('\n');
    }
    if (tag === 'pre') {
      const code = node.querySelector('code');
      const content = code ? code.textContent || '' : node.textContent || '';
      return `\`\`\`\n${content}\n\`\`\``;
    }
    if (tag === 'p' || tag === 'div') {
      const content = serializeChildren(node).trim();
      return content ? content : '';
    }
    return serializeChildren(node).trim();
  };

  Array.from(wrapper.childNodes).forEach((node) => {
    const block = serializeBlock(node);
    if (block) {
      blocks.push(block);
    }
  });

  return blocks.join('\n\n').trim();
}

function updateNotesData(record) {
  if (!record) {
    return;
  }
  const index = notesData.findIndex((item) => item.id === record.id);
  if (index >= 0) {
    notesData[index] = record;
  } else {
    notesData = [record, ...notesData];
  }
  if (statTotal) {
    statTotal.textContent = `${notesData.length}`;
  }
  renderNotesList();
}

function handleFocusedTitleInput() {
  if (focusedNoteSaving) {
    return;
  }
  focusedNoteDirty = true;
  setFocusedNoteStatus('dirty');
  scheduleFocusedSave();
}

function handleFocusedEditorInput() {
  if (focusedNoteSaving) {
    return;
  }
  focusedNoteDirty = true;
  const rawText = noteFocusEditor?.textContent || '';
  const hasContent = Boolean(rawText.trim());
  if (!hasContent && noteFocusEditor) {
    noteFocusEditor.innerHTML = '';
  }
  if (!hasContent && !focusedNote?.id) {
    setFocusedNoteStatus('empty');
  } else {
    setFocusedNoteStatus('dirty');
  }
  scheduleFocusedSave();
}

function scheduleFocusedSave() {
  if (focusedNoteTimer) {
    clearTimeout(focusedNoteTimer);
  }
  focusedNoteTimer = setTimeout(() => {
    saveFocusedNote();
  }, 800);
}

function isSelectionInsideFocusedEditor() {
  if (!noteFocusEditor) {
    return false;
  }
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return false;
  }
  const range = selection.getRangeAt(0);
  if (selection.isCollapsed) {
    return false;
  }
  return noteFocusEditor.contains(range.commonAncestorContainer);
}

const NOTE_EDITOR_BLOCK_TAGS = new Set(['P', 'DIV', 'LI', 'H1', 'H2', 'H3', 'BLOCKQUOTE']);

function getNoteEditorBlock(node) {
  if (!noteFocusEditor) {
    return null;
  }
  let current = node && node.nodeType === Node.ELEMENT_NODE ? node : node?.parentNode;
  while (current && current !== noteFocusEditor) {
    if (current.nodeType === Node.ELEMENT_NODE && NOTE_EDITOR_BLOCK_TAGS.has(current.tagName)) {
      return current;
    }
    current = current.parentNode;
  }
  return noteFocusEditor;
}

function findInlineCodeAncestor(node) {
  if (!noteFocusEditor) {
    return null;
  }
  let current = node && node.nodeType === Node.ELEMENT_NODE ? node : node?.parentNode;
  while (current && current !== noteFocusEditor) {
    if (current.nodeType === Node.ELEMENT_NODE && current.tagName === 'CODE') {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

function unwrapInlineCode(codeElement, selection) {
  if (!codeElement || !codeElement.parentNode) {
    return;
  }
  const text = codeElement.textContent || '';
  const textNode = document.createTextNode(text);
  const parent = codeElement.parentNode;
  parent.replaceChild(textNode, codeElement);

  const range = document.createRange();
  const offset = selection && selection.rangeCount ? selection.getRangeAt(0).startOffset : text.length;
  const safeOffset = Math.min(Math.max(0, offset), text.length);
  range.setStart(textNode, safeOffset);
  range.setEnd(textNode, safeOffset);
  const nextSelection = window.getSelection();
  if (nextSelection) {
    nextSelection.removeAllRanges();
    nextSelection.addRange(range);
  }
}

function toggleInlineCode() {
  if (!noteFocusEditor) {
    return;
  }
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }
  const range = selection.getRangeAt(0);
  const startCode = findInlineCodeAncestor(range.startContainer);
  const endCode = findInlineCodeAncestor(range.endContainer);
  if (startCode && startCode === endCode) {
    unwrapInlineCode(startCode, selection);
    return;
  }
  const text = selection.toString();
  if (text) {
    document.execCommand('insertHTML', false, `<code>${escapeHtml(text)}</code>`);
  }
}

function handleNoteListShortcut(event) {
  if (!noteFocusEditor || event.defaultPrevented) {
    return false;
  }
  if (event.key !== ' ' || event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
    return false;
  }
  const range = selection.getRangeAt(0);
  const block = getNoteEditorBlock(range.startContainer);
  if (!block) {
    return false;
  }
  const prefixRange = document.createRange();
  prefixRange.setStart(block, 0);
  prefixRange.setEnd(range.startContainer, range.startOffset);
  const prefixText = prefixRange.toString().replace(/\u00A0/g, ' ');
  if (!/^\s*[-*]$/.test(prefixText)) {
    return false;
  }
  event.preventDefault();
  prefixRange.deleteContents();
  document.execCommand('insertUnorderedList', false);
  handleFocusedEditorInput();
  return true;
}

function positionFocusToolbar() {
  if (!noteFocusToolbar) {
    return;
  }
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    noteFocusToolbar.classList.remove('is-visible');
    return;
  }
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (!rect || rect.width === 0) {
    noteFocusToolbar.classList.remove('is-visible');
    return;
  }
  const top = Math.max(rect.top + window.scrollY, 12);
  const viewportWidth = document.documentElement.clientWidth;
  const toolbarWidth = noteFocusToolbar.offsetWidth || 0;
  const pageLeft = window.scrollX;
  let left = rect.left + rect.width / 2 + pageLeft;
  if (toolbarWidth > 0 && viewportWidth > 0) {
    const padding = 12;
    const minLeft = pageLeft + padding + toolbarWidth / 2;
    const maxLeft = pageLeft + viewportWidth - padding - toolbarWidth / 2;
    if (minLeft <= maxLeft) {
      left = Math.min(Math.max(left, minLeft), maxLeft);
    } else {
      left = pageLeft + viewportWidth / 2;
    }
  }
  noteFocusToolbar.style.top = `${top}px`;
  noteFocusToolbar.style.left = `${left}px`;
  noteFocusToolbar.classList.add('is-visible');
}

function hideFocusToolbar() {
  if (!noteFocusToolbar) {
    return;
  }
  noteFocusToolbar.classList.remove('is-visible');
}

async function applyFocusFormat(format) {
  if (!noteFocusEditor) {
    return;
  }
  noteFocusEditor.focus();
  switch (format) {
    case 'bold':
      document.execCommand('bold', false);
      break;
    case 'italic':
      document.execCommand('italic', false);
      break;
    case 'strike':
      document.execCommand('strikeThrough', false);
      break;
    case 'code': {
      toggleInlineCode();
      break;
    }
    case 'quote':
      document.execCommand('formatBlock', false, 'blockquote');
      break;
    case 'list':
      document.execCommand('insertUnorderedList', false);
      break;
    case 'h1':
      document.execCommand('formatBlock', false, 'h1');
      break;
    case 'h2':
      document.execCommand('formatBlock', false, 'h2');
      break;
    case 'h3':
      document.execCommand('formatBlock', false, 'h3');
      break;
    case 'p':
      document.execCommand('formatBlock', false, 'p');
      break;
    case 'link': {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount || selection.isCollapsed) {
        break;
      }
      const selectionRange = selection.getRangeAt(0).cloneRange();
      const res = await openModal({
        title: 'Ajouter un lien',
        confirmText: 'Ajouter',
        fields: [
          { key: 'url', label: 'URL du lien', value: '' },
        ],
      });
      const url = res?.url || '';
      if (url) {
        noteFocusEditor.focus();
        const restoredSelection = window.getSelection();
        if (restoredSelection && selectionRange) {
          restoredSelection.removeAllRanges();
          restoredSelection.addRange(selectionRange);
        }
        document.execCommand('createLink', false, url);
      }
      break;
    }
    default:
      break;
  }
  handleFocusedEditorInput();
  positionFocusToolbar();
}

async function saveFocusedNote({ force = false } = {}) {
  if (!noteFocusEditor || !noteFocusTitle) {
    return null;
  }
  if (!window.electronAPI?.upsertNote) {
    setFocusedNoteStatus('error');
    return null;
  }
  const html = noteFocusEditor.innerHTML || '';
  const text = htmlToMarkdownLite(html);
  const hasContent = Boolean(text.trim());
  if (!hasContent && !focusedNote?.id) {
    setFocusedNoteStatus('empty');
    return null;
  }
  if (!force && !focusedNoteDirty) {
    return focusedNote;
  }
  focusedNoteSaving = true;
  setFocusedNoteStatus('saving');

  const now = new Date().toISOString();
  const titleInput = noteFocusTitle.value.trim();
  const title = titleInput || extractNoteTitle(text);
  const payload = {
    id: focusedNote?.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`),
    user_id: focusedNote?.user_id || null,
    title,
    text,
    metadata: focusedNote?.metadata || { source: 'manual' },
    created_at: focusedNote?.created_at || now,
    updated_at: now,
  };

  try {
    const record = await window.electronAPI.upsertNote(payload);
    focusedNote = record;
    focusedNoteDirty = false;
    focusedNoteSaving = false;
    updateNotesData(record);
    setFocusedNoteStatus('saved', formatDateTimeLabel(record.updated_at));
    return record;
  } catch (error) {
    focusedNoteSaving = false;
    setFocusedNoteStatus('error');
    return null;
  }
}

function openFocusedNote(note = null) {
  if (!noteFocusEditor || !noteFocusTitle) {
    return;
  }
  focusedNote = note ? { ...note } : null;
  focusedNoteDirty = false;
  focusedNoteSaving = false;

  const metadata = normalizeNoteMetadata(note?.metadata);
  const source = metadata.source === 'dictation'
    ? 'Dictée'
    : (metadata.source === 'file_upload' ? 'Import audio' : (metadata.source ? 'Manuel' : ''));
  if (noteFocusSource) {
    noteFocusSource.textContent = source ? `Source: ${source}` : '';
  }
  if (noteFocusTimestamp) {
    const stamp = note?.updated_at || note?.created_at || null;
    noteFocusTimestamp.textContent = formatDateTimeLabel(stamp);
  }
  noteFocusTitle.value = note?.title || '';
  noteFocusEditor.innerHTML = note?.text ? renderMarkdownLite(note.text) : '';
  if ((note?.text || '').trim()) {
    setFocusedNoteStatus('saved', formatDateTimeLabel(note?.updated_at || note?.created_at));
  } else {
    setFocusedNoteStatus('empty');
  }

  ensureNoteFocusWidth();
  document.body.classList.add('note-focus-active');
  if (noteFocusOverlay) {
    noteFocusOverlay.setAttribute('aria-hidden', 'false');
  }
  setTimeout(() => noteFocusTitle.focus(), 0);
}

async function closeFocusedNote() {
  if (focusedNoteDirty) {
    await saveFocusedNote({ force: true });
  }
  stopNoteFocusResize();
  document.body.classList.remove('note-focus-active');
  if (noteFocusOverlay) {
    noteFocusOverlay.setAttribute('aria-hidden', 'true');
  }
  hideFocusToolbar();
  focusedNote = null;
  focusedNoteDirty = false;
  focusedNoteSaving = false;
  if (focusedNoteTimer) {
    clearTimeout(focusedNoteTimer);
    focusedNoteTimer = null;
  }
}

function buildEntryRow(entry, type) {
  const row = document.createElement('div');
  row.className = 'entry-row';
  if (entry?.id) {
    row.dataset.entryId = entry.id;
  }
  row.dataset.entryType = type;
  if (type === 'notes') {
    row.role = 'button';
    row.tabIndex = 0;
    row.addEventListener('click', () => openFocusedNote(entry));
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFocusedNote(entry);
      }
    });
  }

  const icon = document.createElement('div');
  icon.className = 'entry-icon';
  icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';

  const main = document.createElement('div');
  main.className = 'entry-main';

  const metaDiv = document.createElement('div');
  metaDiv.className = 'entry-meta';
  const timePart = entry.created_at ? formatTime(entry.created_at) : '';
  const datePart = formatDateLabel(entry.created_at);
  const metaParts = [timePart, datePart];
  if (type === 'history') {
    const durationLabel = formatDuration(entry.duration_ms);
    if (durationLabel) {
      metaParts.push(durationLabel);
    }
    if (entry.language) {
      metaParts.push(entry.language.toUpperCase());
    }
  }
  metaDiv.textContent = metaParts.filter(Boolean).join(' · ');

  const title = document.createElement('div');
  title.className = 'entry-title';
  if (type === 'notes') {
    title.textContent = entry.title || extractNoteTitle(entry.text);
  } else {
    title.textContent = deriveHistoryTitle(entry);
  }

  const preview = document.createElement('div');
  preview.className = 'entry-preview';
  if (type === 'notes') {
    preview.textContent = getNotePreview(entry.text || '');
  } else {
    preview.classList.add('entry-preview-rich');
    const previewText = entry.edited_text || entry.formatted_text || entry.text || entry.raw_text || '';
    preview.innerHTML = renderMarkdownLite(previewText);
  }

  main.appendChild(metaDiv);
  main.appendChild(title);
  main.appendChild(preview);

  const actions = document.createElement('div');
  actions.className = 'entry-actions';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'entry-action copy';
  copyBtn.type = 'button';
  copyBtn.textContent = 'Copier';
  copyBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const text = entry.text || entry.raw_text || '';
    const ok = await copyTextWithFallback(text);
    if (ok) {
      showToastKey('toast.copy.success');
    } else {
      showToastKey('toast.copy.failed', 'error');
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'entry-action delete';
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Supprimer';
  deleteBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!window.electronAPI) {
      return;
    }
    const method = type === 'notes' ? window.electronAPI.deleteNote : window.electronAPI.deleteHistory;
    if (!method) {
      return;
    }
    if (type === 'notes') {
      await deleteNoteWithUndo(entry);
    } else {
      await deleteHistoryWithUndo(entry);
    }
  });

  actions.appendChild(copyBtn);

  if (type === 'notes') {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'entry-action export';
    exportBtn.type = 'button';
    exportBtn.textContent = 'Exporter';
    exportBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await exportNoteEntry(entry);
    });
    actions.appendChild(exportBtn);
  }
  actions.appendChild(deleteBtn);

  row.appendChild(icon);
  row.appendChild(main);
  row.appendChild(actions);

  return row;
}

async function exportHistoryEntry(entry) {
  if (!window.electronAPI?.exportHistory || !entry?.id) {
    showToastKey('toast.export.unavailable', 'error');
    return;
  }
  const values = await openModal({
    title: 'Exporter la transcription',
    confirmText: 'Exporter',
    fields: [
      {
        key: 'format',
        label: 'Format',
        type: 'select',
        options: [
          { label: 'TXT', value: 'txt' },
          { label: 'Markdown', value: 'md' },
          { label: 'JSON', value: 'json' },
        ],
        value: 'txt',
      },
      {
        key: 'timestamps',
        label: 'Timestamps',
        type: 'select',
        options: [
          { label: 'Sans', value: 'false' },
          { label: 'Avec', value: 'true' },
        ],
        value: 'false',
      },
      {
        key: 'sensitive',
        label: 'Inclure données sensibles',
        type: 'select',
        options: [
          { label: 'Non', value: 'false' },
          { label: 'Oui', value: 'true' },
        ],
        value: 'false',
      },
    ],
  });
  if (!values) {
    return;
  }
  const options = {
    format: values.format || 'txt',
    includeTimestamps: values.timestamps === 'true',
    includeSensitive: values.sensitive === 'true',
  };
  const result = await window.electronAPI.exportHistory(entry.id, options);
  if (result?.ok) {
    showToastKey('toast.export.generated');
  } else {
    showToast(result?.reason || t('toast.export.failed'), 'error');
  }
}

async function exportNoteEntry(entry) {
  if (!window.electronAPI?.exportNote || !entry?.id) {
    showToastKey('toast.export.unavailable', 'error');
    return;
  }
  const values = await openModal({
    title: 'Exporter la note',
    confirmText: 'Exporter',
    fields: [
      {
        key: 'format',
        label: 'Format',
        type: 'select',
        options: [
          { label: 'Markdown', value: 'md' },
          { label: 'TXT', value: 'txt' },
        ],
        value: 'md',
      },
    ],
  });
  if (!values) {
    return;
  }
  const options = {
    format: values.format || 'md',
  };
  const result = await window.electronAPI.exportNote(entry.id, options);
  if (result?.ok) {
    showToastKey('toast.export.generated');
  } else {
    showToast(result?.reason || t('toast.export.failed'), 'error');
  }
}

function renderHistoryList() {
  if (!historyList || !historyEmpty) {
    return;
  }
  if (historyLoadError) {
    return;
  }
  const filtered = filterEntries(historyData, searchTerm);
  historyList.innerHTML = '';
  if (!filtered.length) {
    historyEmpty.style.display = 'flex';
    setEmptyStateState(historyEmpty, Boolean(searchTerm));
    return;
  }
  historyEmpty.style.display = 'none';
  filtered.forEach((entry) => {
    historyList.appendChild(buildEntryRow(entry, 'history'));
  });
}

function normalizeUploadsSnapshot(value) {
  return Array.isArray(value) ? value : [];
}

function hasActiveUploads(items) {
  return items.some((job) => job && ['queued', 'processing', 'cancelling'].includes(job.status));
}

function mergeUploadsSnapshot(next) {
  const nextItems = normalizeUploadsSnapshot(next);
  if (!nextItems.length && hasActiveUploads(uploadsData)) {
    return uploadsData;
  }
  return nextItems;
}

function applyUploadsSnapshot(next) {
  uploadsData = mergeUploadsSnapshot(next);
  renderUploads(uploadsData);
  updateUploadNotifications(uploadsData);
}

function upsertUploadJob(job) {
  if (!job || !job.id) {
    return;
  }
  uploadsData = [job, ...uploadsData.filter((item) => item && item.id !== job.id)].slice(0, 20);
  renderUploads(uploadsData);
  updateUploadNotifications(uploadsData);
}

function renderUploads(uploads) {
  if (!uploadQueue) {
    return;
  }
  const items = Array.isArray(uploads) ? uploads : [];
  if (!items.length) {
    uploadQueue.innerHTML = '';
    return;
  }
  uploadQueue.innerHTML = '';
  items.forEach((job) => {
    const row = document.createElement('div');
    row.className = 'upload-row';

    const meta = document.createElement('div');
    meta.className = 'upload-meta';
    const title = document.createElement('div');
    title.className = 'upload-title';
    title.textContent = job.fileName || 'Fichier audio';
    const status = document.createElement('div');
    status.className = 'upload-status';
    const sizeLabel = job.fileSize ? ` · ${formatBytes(job.fileSize)}` : '';
    status.textContent = `${job.status || 'queued'}${sizeLabel}`;
    meta.appendChild(title);
    meta.appendChild(status);

    const progress = document.createElement('div');
    progress.className = 'upload-progress';
    const fill = document.createElement('div');
    fill.className = 'upload-progress-fill';
    fill.style.width = `${Math.min(100, Math.max(0, job.progress || 0))}%`;
    progress.appendChild(fill);
    meta.appendChild(progress);

    const actions = document.createElement('div');
    if (['queued', 'processing', 'cancelling'].includes(job.status)) {
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'btn-secondary';
      cancel.textContent = 'Annuler';
      cancel.addEventListener('click', async () => {
        if (window.electronAPI?.cancelUploadJob) {
          const result = await window.electronAPI.cancelUploadJob(job.id);
          if (!result?.ok) {
            showToastKey('toast.cancel.failed', 'error');
            return;
          }
          upsertUploadJob({ ...job, status: 'cancelled' });
          await refreshDashboard();
        }
      });
      actions.appendChild(cancel);
    }
    if (job.status === 'failed' && job.error) {
      const err = document.createElement('div');
      err.className = 'upload-status';
      err.textContent = job.error;
      meta.appendChild(err);
    }

    row.appendChild(meta);
    if (actions.childNodes.length) {
      row.appendChild(actions);
    }
    uploadQueue.appendChild(row);
  });
}

function updateUploadNotifications(uploads) {
  const items = Array.isArray(uploads) ? uploads : [];
  const nextCache = new Map();
  items.forEach((job) => {
    if (job && job.id) {
      nextCache.set(job.id, job);
    }
  });

  if (!uploadsInitialized) {
    uploadStatusCache = nextCache;
    uploadsInitialized = true;
    return;
  }

  items.forEach((job) => {
    if (!job || !job.id) {
      return;
    }
    const prev = uploadStatusCache.get(job.id);
    if (!prev) {
      showToastKey('toast.import.started', 'success', {
        fileName: job.fileName || t('common.audioFile'),
      });
      return;
    }
    if (prev.status === job.status) {
      return;
    }
    if (job.status === 'completed') {
      showToastKey('toast.import.noteCreated', 'success', {
        fileName: job.fileName || t('common.audioFile'),
      });
      return;
    }
    if (job.status === 'failed') {
      const message = job.error
        ? t('toast.import.failedReason', { reason: job.error })
        : t('toast.import.failedFile', { fileName: job.fileName || t('common.audioFile') });
      showToast(message, 'error');
      return;
    }
    if (job.status === 'cancelled') {
      showToastKey('toast.import.cancelled', 'error', {
        fileName: job.fileName || t('common.audioFile'),
      });
    }
  });

  uploadStatusCache = nextCache;
}

function applyLocalModelsSnapshot(snapshot) {
  localModelsData = snapshot || null;
  renderLocalModels();
  renderOnboardingLocalModels();
  updateLocalModelPresetSelect();
  updateModelDownloadToasts(localModelsData);
}

function getPresetLabel(presetId, presets) {
  const entry = (presets || []).find((preset) => preset.id === presetId);
  return entry ? entry.label : presetId;
}

function buildLocalModelBadges(model, snapshot) {
  const badges = [];
  if (model.recommended) {
    badges.push('recommande');
  }
  if (snapshot?.activeModelId === model.id) {
    badges.push('actif');
  }
  if (model.status === 'installed') {
    badges.push('installe');
  }
  if (model.updateAvailable) {
    badges.push('maj');
  }
  if (model.download?.status === 'failed') {
    badges.push('erreur');
  }
  return badges;
}

function getLocalModelByPreset(presetId) {
  const models = localModelsData?.models || [];
  return models.find((model) => model.preset === presetId) || null;
}

function updateLocalModelPresetSelect() {
  if (!localModelPresetSelect) {
    return;
  }
  const snapshot = localModelsData;
  localModelPresetSelectUpdating = true;
  localModelPresetSelect.innerHTML = '';
  if (!snapshot || !Array.isArray(snapshot.presets)) {
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = t('localModel.loading');
    localModelPresetSelect.appendChild(placeholder);
    localModelPresetSelect.disabled = true;
    localModelPresetSelectUpdating = false;
    return;
  }
  const recommended = snapshot.recommendedPreset || 'quality';
  snapshot.presets.forEach((preset) => {
    const model = getLocalModelByPreset(preset.id);
    const installed = model?.status === 'installed';
    const sizeLabel = model?.sizeBytes ? formatSizeGb(model.sizeBytes) : '';
    let statusLabel = installed
      ? t('localModel.status.installed')
      : (sizeLabel ? t('localModel.status.size', { size: sizeLabel }) : t('localModel.status.notDownloaded'));
    if (preset.id === recommended) {
      statusLabel += ` · ${t('localModel.badge.recommande')}`;
    }
    const option = document.createElement('option');
    option.value = preset.id;
    option.textContent = `${preset.label} — ${statusLabel}`;
    localModelPresetSelect.appendChild(option);
  });
  const activePreset = snapshot.activePreset === 'auto'
    ? recommended
    : (snapshot.activePreset || recommended);
  const hasActiveOption = Array.from(localModelPresetSelect.options).some((opt) => opt.value === activePreset);
  localModelPresetSelect.value = hasActiveOption ? activePreset : recommended;
  if (localModelPresetSelect.selectedIndex < 0 && localModelPresetSelect.options.length) {
    localModelPresetSelect.selectedIndex = 0;
  }
  localModelPresetSelect.disabled = false;
  localModelPresetSelectUpdating = false;
}

function formatSizeGb(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '';
  }
  const gb = bytes / (1024 ** 3);
  if (gb < 0.1) {
    return '<0.1 GB';
  }
  return `${gb.toFixed(1)} GB`;
}

function createModelDownloadToast(model, snapshot) {
  if (!toastContainer) {
    return null;
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.dataset.modelToast = model.id;

  const icon = document.createElement('div');
  icon.className = 'toast-icon';
  icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"></path><path d="M7 10l5 5 5-5"></path><path d="M5 21h14"></path></svg>';

  const content = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'toast-title';
  title.textContent = t('localModel.toast.title');
  const message = document.createElement('div');
  message.className = 'toast-message';
  const progress = document.createElement('div');
  progress.className = 'toast-progress';
  const fill = document.createElement('div');
  fill.className = 'toast-progress-fill';
  progress.appendChild(fill);
  const progressLabel = document.createElement('div');
  progressLabel.className = 'toast-progress-label';
  content.appendChild(title);
  content.appendChild(message);
  content.appendChild(progress);
  content.appendChild(progressLabel);

  toast.appendChild(icon);
  toast.appendChild(content);
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  toast.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
    modelDownloadToasts.delete(model.id);
  });

  const entry = {
    toast,
    message,
    fill,
    progressLabel,
    status: model.download?.status || '',
  };
  modelDownloadToasts.set(model.id, entry);
  updateModelDownloadToast(entry, model, snapshot);
  return entry;
}

function updateModelDownloadToast(entry, model, snapshot) {
  if (!entry) {
    return;
  }
  const presetLabel = getPresetLabel(model.preset, snapshot?.presets);
  const sizeLabel = model.sizeBytes ? formatSizeGb(model.sizeBytes) : '';
  const baseLabel = sizeLabel ? `${presetLabel} · ${sizeLabel}` : presetLabel;
  const { status, percent, label: statusLabel } = getModelDownloadStatus(model);
  entry.message.textContent = `${baseLabel} · ${statusLabel}`.trim();
  entry.fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  entry.progressLabel.textContent = status === 'downloading' ? `${percent}%` : '';
  entry.status = status;
}

function removeModelDownloadToast(id) {
  const entry = modelDownloadToasts.get(id);
  if (!entry) {
    return;
  }
  entry.toast.classList.remove('show');
  setTimeout(() => entry.toast.remove(), 300);
  modelDownloadToasts.delete(id);
}

function getModelDownloadStatus(model) {
  const status = model.download?.status || 'queued';
  const percent = Number.isFinite(model.download?.progress) ? model.download.progress : 0;
  let label = '';
  if (status === 'queued') {
    label = t('localModel.download.queued');
  } else if (status === 'downloading') {
    label = t('localModel.download.progress', { percent });
  } else if (status === 'verifying') {
    label = t('localModel.download.verifying');
  } else if (status === 'paused') {
    label = t('localModel.download.paused');
  }
  return { status, percent, label };
}

function formatDownloadDetail(model) {
  const received = Number.isFinite(model.download?.receivedBytes) ? model.download.receivedBytes : 0;
  const total = Number.isFinite(model.download?.totalBytes) && model.download.totalBytes > 0
    ? model.download.totalBytes
    : (Number.isFinite(model.sizeBytes) ? model.sizeBytes : 0);
  if (!received && !total) {
    return '';
  }
  if (!total) {
    return formatBytes(received);
  }
  return `${formatBytes(received)} / ${formatBytes(total)}`;
}

function getDownloadErrorMessage(model) {
  const error = model.download?.error || '';
  if (error === 'checksum_mismatch') {
    return t('localModel.download.checksumMismatch');
  }
  if (error === 'download_failed' || error === 'http_error') {
    return t('localModel.download.unavailable');
  }
  if (error === 'write_failed') {
    return t('localModel.download.writeFailed');
  }
  if (error) {
    return t('localModel.download.failedWithReason', { reason: error });
  }
  return t('localModel.download.failed');
}

function updateModelDownloadToasts(snapshot) {
  if (!snapshot?.models) {
    modelDownloadToasts.forEach((entry, id) => removeModelDownloadToast(id));
    modelDownloadStatusCache = new Map();
    return;
  }
  const activeIds = new Set();
  const nextStatusCache = new Map();
  snapshot.models.forEach((model) => {
    const status = model.download?.status;
    const previous = modelDownloadStatusCache.get(model.id);
    if (['queued', 'downloading', 'verifying', 'paused'].includes(status)) {
      activeIds.add(model.id);
      const existing = modelDownloadToasts.get(model.id);
      if (existing) {
        updateModelDownloadToast(existing, model, snapshot);
      } else {
        createModelDownloadToast(model, snapshot);
      }
      nextStatusCache.set(model.id, status);
    } else if (status === 'completed') {
      if (modelDownloadToasts.has(model.id)) {
        removeModelDownloadToast(model.id);
      }
      if (previous !== 'completed') {
        showToastKey('localModel.download.completed', 'success', {
          label: getPresetLabel(model.preset, snapshot.presets),
        });
      }
      nextStatusCache.set(model.id, status);
    } else if (status === 'failed') {
      if (modelDownloadToasts.has(model.id)) {
        removeModelDownloadToast(model.id);
      }
      if (previous !== 'failed') {
        showToast(getDownloadErrorMessage(model), 'error');
      }
      nextStatusCache.set(model.id, status);
    } else if (previous && ['queued', 'downloading', 'verifying', 'paused'].includes(previous)) {
      removeModelDownloadToast(model.id);
    }
  });
  modelDownloadToasts.forEach((entry, id) => {
    if (!activeIds.has(id)) {
      removeModelDownloadToast(id);
    }
  });
  modelDownloadStatusCache = nextStatusCache;
}

function buildLocalModelRow(model, snapshot, context = 'settings') {
  const row = document.createElement('div');
  row.className = 'model-row';

  const meta = document.createElement('div');
  meta.className = 'model-meta';

  const presetLabel = getPresetLabel(model.preset, snapshot?.presets);
  const title = document.createElement('div');
  title.className = 'model-title';
  title.textContent = `${presetLabel} · ${model.name}`;
  meta.appendChild(title);

  const subtitle = document.createElement('div');
  subtitle.className = 'model-subtitle';
  const sizeLabel = model.sizeBytes ? ` · ${formatBytes(model.sizeBytes)}` : '';
  subtitle.textContent = `${model.presetMeta?.description || ''}${sizeLabel}`.trim();
  meta.appendChild(subtitle);

  const badges = buildLocalModelBadges(model, snapshot);
  if (badges.length) {
    const badgeRow = document.createElement('div');
    badgeRow.className = 'model-badges';
    badges.forEach((label) => {
      const badge = document.createElement('span');
      badge.className = label === 'erreur' ? 'model-badge is-error' : 'model-badge';
      badge.textContent = t(`localModel.badge.${label}`);
      badgeRow.appendChild(badge);
    });
    meta.appendChild(badgeRow);
  }

  if (model.download && ['queued', 'downloading', 'verifying', 'paused'].includes(model.download.status)) {
    const progress = document.createElement('div');
    progress.className = 'model-progress';
    const fill = document.createElement('div');
    fill.className = 'model-progress-fill';
    const percent = Number.isFinite(model.download.progress) ? model.download.progress : 0;
    fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    progress.appendChild(fill);
    meta.appendChild(progress);
  }

  if (model.download?.status === 'failed') {
    const errorLine = document.createElement('div');
    errorLine.className = 'model-subtitle is-error';
    errorLine.textContent = getDownloadErrorMessage(model);
    meta.appendChild(errorLine);
  }

  const actions = document.createElement('div');
  actions.className = 'model-actions';

  if (context === 'settings') {
    if (model.download && ['queued', 'downloading', 'verifying'].includes(model.download.status)) {
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'btn-secondary';
      cancel.textContent = t('localModel.download.cancel');
      cancel.addEventListener('click', async () => {
        if (window.electronAPI?.cancelLocalModelDownload) {
          const result = await window.electronAPI.cancelLocalModelDownload(model.id);
          if (result?.ok) {
            showToastKey('localModel.download.cancelled');
          } else {
            showToastKey('localModel.download.cancelFailed', 'error');
          }
          await refreshLocalModelsOnly();
          await refreshDashboard();
        }
      });
      actions.appendChild(cancel);
    } else if (model.download && model.download.status === 'paused') {
      const resume = document.createElement('button');
      resume.type = 'button';
      resume.className = 'btn-secondary';
      resume.textContent = t('localModel.download.resume');
      resume.addEventListener('click', async () => {
        if (window.electronAPI?.installLocalModel) {
          await window.electronAPI.installLocalModel(model.id);
          await refreshLocalModelsOnly();
          await refreshDashboard();
        }
      });
      actions.appendChild(resume);
    } else if (model.status === 'installed') {
      if (snapshot?.activeModelId !== model.id) {
        const activate = document.createElement('button');
        activate.type = 'button';
        activate.className = 'btn-secondary';
        activate.textContent = t('localModel.action.activate');
        activate.addEventListener('click', async () => {
          if (window.electronAPI?.setLocalModelPreset) {
            await window.electronAPI.setLocalModelPreset(model.preset);
            await refreshLocalModelsOnly();
            await refreshDashboard();
          }
        });
        actions.appendChild(activate);
      }
      if (model.updateAvailable) {
        const upgrade = document.createElement('button');
        upgrade.type = 'button';
        upgrade.className = 'btn-secondary';
        upgrade.textContent = t('localModel.action.update');
        upgrade.addEventListener('click', async () => {
          if (window.electronAPI?.installLocalModel) {
            await window.electronAPI.installLocalModel(model.id);
            await refreshLocalModelsOnly();
            await refreshDashboard();
          }
        });
        actions.appendChild(upgrade);
      }
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'btn-secondary';
      remove.textContent = t('localModel.action.remove');
      remove.addEventListener('click', async () => {
        if (window.electronAPI?.removeLocalModel) {
          await window.electronAPI.removeLocalModel(model.id);
          await refreshLocalModelsOnly();
          await refreshDashboard();
        }
      });
      actions.appendChild(remove);
    } else if (model.urlAvailable) {
      const install = document.createElement('button');
      install.type = 'button';
      install.className = 'btn-primary';
      install.textContent = t('localModel.action.install');
      install.addEventListener('click', async () => {
        if (window.electronAPI?.installLocalModel) {
          await window.electronAPI.installLocalModel(model.id);
          await refreshLocalModelsOnly();
          await refreshDashboard();
        }
      });
      actions.appendChild(install);
    } else {
      const note = document.createElement('div');
      note.className = 'model-subtitle';
      note.textContent = t('localModel.sourceMissing');
      actions.appendChild(note);
    }
  } else if (context === 'onboarding') {
    if (model.download && ['queued', 'downloading', 'verifying'].includes(model.download.status)) {
      const wait = document.createElement('div');
      wait.className = 'model-subtitle';
      wait.textContent = t('localModel.onboarding.downloading');
      actions.appendChild(wait);
    } else if (model.status === 'installed') {
      const done = document.createElement('div');
      done.className = 'model-subtitle';
      done.textContent = t('localModel.onboarding.installed');
      actions.appendChild(done);
    } else if (model.urlAvailable) {
      const install = document.createElement('button');
      install.type = 'button';
      install.className = 'btn-primary';
      install.textContent = t('localModel.action.install');
      install.addEventListener('click', async () => {
        if (window.electronAPI?.installLocalModel) {
          const result = await window.electronAPI.installLocalModel(model.id);
          if (!result?.ok) {
            showToastKey('localModel.download.unavailable', 'error');
          }
          await refreshLocalModelsOnly();
          await refreshDashboard();
        }
      });
      actions.appendChild(install);
    }
  }

  row.appendChild(meta);
  if (actions.childNodes.length) {
    row.appendChild(actions);
  }
  return row;
}

function renderLocalModels() {
  if (!localModelList) {
    return;
  }
  const snapshot = localModelsData;
  renderLocalModelDownloads();
  const models = snapshot?.models || [];
  const activeDownloadModels = new Set(
    models
      .filter((model) => model.download && ['queued', 'downloading', 'verifying', 'paused'].includes(model.download.status))
      .map((model) => model.id),
  );
  localModelList.innerHTML = '';
  const modelsToRender = models.filter((model) => !activeDownloadModels.has(model.id));
  if (!modelsToRender.length) {
    const empty = document.createElement('div');
    empty.className = 'model-subtitle';
    empty.textContent = t('localModel.empty');
    localModelList.appendChild(empty);
  } else {
    modelsToRender.forEach((model) => {
      localModelList.appendChild(buildLocalModelRow(model, snapshot, 'settings'));
    });
  }
  if (localModelSummary) {
    if (!snapshot) {
      localModelSummary.textContent = t('localModel.loading');
    } else {
      const recommended = getPresetLabel(snapshot.recommendedPreset, snapshot.presets);
      const activePreset = snapshot.activePreset === 'auto'
        ? t('localModel.auto', { preset: recommended })
        : getPresetLabel(snapshot.activePreset, snapshot.presets);
      const memLabel = snapshot.hardware?.totalMemGb
        ? t('localModel.memory', { value: snapshot.hardware.totalMemGb })
        : '';
      const memory = memLabel ? ` · ${memLabel}` : '';
      localModelSummary.textContent = t('localModel.summary', {
        recommended,
        active: activePreset,
        memory,
      });
    }
  }
}

function renderLocalModelDownloads() {
  if (!localModelDownloads) {
    return;
  }
  const snapshot = localModelsData;
  localModelDownloads.innerHTML = '';
  if (!snapshot) {
    localModelDownloads.style.display = 'none';
    return;
  }
  const models = snapshot.models || [];
  const active = models.filter((model) => model.download && ['queued', 'downloading', 'verifying', 'paused'].includes(model.download.status));
  if (!active.length) {
    localModelDownloads.style.display = 'none';
    return;
  }
  localModelDownloads.style.display = 'flex';

  const heading = document.createElement('div');
  heading.className = 'model-download-heading';
  heading.textContent = active.length > 1
    ? t('localModel.download.headingPlural')
    : t('localModel.download.heading');
  localModelDownloads.appendChild(heading);

  active.forEach((model) => {
    const row = document.createElement('div');
    row.className = 'model-download-row';

    const meta = document.createElement('div');
    meta.className = 'model-download-meta';

    const title = document.createElement('div');
    title.className = 'model-download-title';
    title.textContent = `${getPresetLabel(model.preset, snapshot.presets)} · ${model.name}`;
    meta.appendChild(title);

    const subtitle = document.createElement('div');
    subtitle.className = 'model-download-subtitle';
    const { status, percent, label } = getModelDownloadStatus(model);
    const detail = formatDownloadDetail(model);
    subtitle.textContent = detail ? `${label} · ${detail}` : label;
    meta.appendChild(subtitle);

    const progress = document.createElement('div');
    progress.className = 'model-download-progress';
    const fill = document.createElement('div');
    fill.className = 'model-download-progress-fill';
    fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    progress.appendChild(fill);
    meta.appendChild(progress);

    const actions = document.createElement('div');
    actions.className = 'model-download-actions';
    if (['queued', 'downloading', 'verifying'].includes(status)) {
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'btn-secondary';
      cancel.textContent = t('localModel.download.cancel');
      cancel.addEventListener('click', async () => {
        if (window.electronAPI?.cancelLocalModelDownload) {
          const result = await window.electronAPI.cancelLocalModelDownload(model.id);
          if (result?.ok) {
            showToastKey('localModel.download.cancelled');
          } else {
            showToastKey('localModel.download.cancelFailed', 'error');
          }
          await refreshDashboard();
        }
      });
      actions.appendChild(cancel);
    } else if (status === 'paused') {
      const resume = document.createElement('button');
      resume.type = 'button';
      resume.className = 'btn-secondary';
      resume.textContent = t('localModel.download.resume');
      resume.addEventListener('click', async () => {
        if (window.electronAPI?.installLocalModel) {
          await window.electronAPI.installLocalModel(model.id);
          await refreshDashboard();
        }
      });
      actions.appendChild(resume);
    }

    row.appendChild(meta);
    if (actions.childNodes.length) {
      row.appendChild(actions);
    }
    localModelDownloads.appendChild(row);
  });
}

function renderOnboardingLocalModels() {
  if (!onboardingLocalModelList) {
    return;
  }
  const snapshot = localModelsData;
  const models = snapshot?.models || [];
  onboardingLocalModelList.innerHTML = '';
  if (!models.length) {
    const empty = document.createElement('div');
    empty.className = 'model-subtitle';
    empty.textContent = t('onboarding.localModel.empty');
    onboardingLocalModelList.appendChild(empty);
    return;
  }
  const installed = models.find((model) => model.status === 'installed');
  if (installed && !onboardingState.localModelReady) {
    onboardingState = {
      ...onboardingState,
      localModelReady: true,
      localModelPreset: installed.preset,
    };
    persistOnboardingState({
      localModelReady: true,
      localModelPreset: installed.preset,
    });
  }
  models.forEach((model) => {
    onboardingLocalModelList.appendChild(buildLocalModelRow(model, snapshot, 'onboarding'));
  });
  if (onboardingLocalModelStatus && snapshot?.recommendedPreset) {
    const recommended = getPresetLabel(snapshot.recommendedPreset, snapshot.presets);
    onboardingLocalModelStatus.textContent = t('onboarding.localModel.recommended', { preset: recommended });
  }
}

async function fetchDiagnostics() {
  if (!window.electronAPI?.getDiagnostics) {
    return;
  }
  try {
    diagnosticsSnapshot = await window.electronAPI.getDiagnostics();
    renderDiagnostics();
  } catch (error) {
    diagnosticsSnapshot = { error: error?.message || t('diagnostics.unavailable') };
    renderDiagnostics();
  }
}

async function runDiagnosticsChecks() {
  const checks = {};
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    checks.mics = devices.filter((device) => device.kind === 'audioinput').length;
  } catch (error) {
    checks.mics = 'error';
  }
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const result = await navigator.permissions.query({ name: 'microphone' });
      checks.micPermission = result?.state || 'unknown';
    } else {
      checks.micPermission = 'unknown';
    }
  } catch {
    checks.micPermission = 'unknown';
  }
  diagnosticsChecksState = checks;
  if (window.electronAPI?.runDiagnosticsChecks) {
    try {
      const res = await window.electronAPI.runDiagnosticsChecks();
      if (res?.clipboardTest) {
        if (!diagnosticsSnapshot) {
          diagnosticsSnapshot = {};
        }
        diagnosticsSnapshot = { ...(diagnosticsSnapshot || {}), clipboardTest: res.clipboardTest };
      }
    } catch (error) {
      // ignore
    }
  }
  renderDiagnostics();
}

function renderDiagnostics() {
  if (!diagnosticsOutput || !diagnosticsChecks) {
    return;
  }
  const snapshot = diagnosticsSnapshot || {};
  const checks = diagnosticsChecksState || {};
  const lines = [];
  if (snapshot.error) {
    lines.push(t('diagnostics.line.error', { message: snapshot.error }));
  }
  if (snapshot.appVersion) {
    lines.push(t('diagnostics.line.app', { value: snapshot.appVersion }));
  }
  if (snapshot.os) {
    lines.push(t('diagnostics.line.os', { value: snapshot.os }));
  }
  if (snapshot.flags) {
    lines.push(t('diagnostics.line.flags', { value: JSON.stringify(snapshot.flags) }));
  }
  if (snapshot.lastDelivery) {
    lines.push(t('diagnostics.line.delivery', {
      mode: snapshot.lastDelivery.mode || t('diagnostics.na'),
      status: snapshot.lastDelivery.status || t('diagnostics.na'),
    }));
  }
  const lastEntry = historyData?.[0];
  if (lastEntry) {
    lines.push(t('diagnostics.line.last'));
    if (Number.isFinite(lastEntry.latency_ms)) {
      lines.push(t('diagnostics.line.latency', { value: Math.round(lastEntry.latency_ms) }));
    }
    if (Number.isFinite(lastEntry.network_latency_ms)) {
      lines.push(t('diagnostics.line.networkLatency', { value: Math.round(lastEntry.network_latency_ms) }));
    }
    if (Number.isFinite(lastEntry.divergence_score)) {
      lines.push(t('diagnostics.line.divergence', { value: lastEntry.divergence_score.toFixed(2) }));
    }
    if (lastEntry.fallback_reason || lastEntry.fallback_path) {
      lines.push(t('diagnostics.line.fallback', { value: lastEntry.fallback_reason || lastEntry.fallback_path }));
    }
    if (lastEntry.transcription_path) {
      lines.push(t('diagnostics.line.asrPath', { value: lastEntry.transcription_path }));
    }
    if (lastEntry.audio_quality_class) {
      lines.push(t('diagnostics.line.audioQuality', { value: lastEntry.audio_quality_class }));
    }
  }
  if (snapshot.events && snapshot.events.length) {
    lines.push(t('diagnostics.line.events'));
    snapshot.events.slice(0, 10).forEach((event) => {
      lines.push(`- ${event.at} ${event.code}: ${event.message}`);
    });
  }
  diagnosticsOutput.textContent = lines.join('\n') || t('diagnostics.empty');

  const checkLines = [];
  if (checks.mics !== undefined) {
    checkLines.push(t('diagnostics.check.microphones', { value: checks.mics }));
  }
  if (checks.micPermission) {
    checkLines.push(t('diagnostics.check.micPermission', { value: checks.micPermission }));
  }
  if (snapshot.clipboardTest) {
    checkLines.push(t('diagnostics.check.clipboard', { value: snapshot.clipboardTest }));
  }
  if (snapshot.shortcut) {
    checkLines.push(t('diagnostics.check.shortcut', {
      value: snapshot.shortcut,
      status: snapshot.shortcutRegistered ? t('diagnostics.check.ok') : t('diagnostics.check.ko'),
    }));
  }
  diagnosticsChecks.textContent = checkLines.join(' · ') || t('diagnostics.checks.empty');
}

function renderDiff() {
  if (diffBefore) {
    diffBefore.value = diffData.before || '';
  }
  if (diffAfter) {
    diffAfter.value = diffData.after || '';
  }
}

function renderNotesList() {
  if (!notesList || !notesEmpty) {
    return;
  }
  const filtered = filterEntries(notesData, searchTerm);
  notesList.innerHTML = '';
  if (!filtered.length) {
    updateNotesEmptyState(filtered);
    return;
  }
  updateNotesEmptyState(filtered);
  filtered.forEach((entry) => {
    notesList.appendChild(buildEntryRow(entry, 'notes'));
  });
}

function updateNotesEmptyState(filtered) {
  if (!notesEmpty) {
    return;
  }
  if (!filtered || filtered.length === 0) {
    notesEmpty.style.display = 'flex';
    setEmptyStateState(notesEmpty, Boolean(searchTerm));
    return;
  }
  notesEmpty.style.display = 'none';
}

function removeNoteRowFromList(entryId) {
  if (!notesList || !entryId) {
    return false;
  }
  const row = notesList.querySelector(`[data-entry-id="${entryId}"]`);
  if (!row) {
    return false;
  }
  row.classList.add('is-removing');
  const remove = () => {
    if (row.isConnected) {
      row.remove();
    }
  };
  row.addEventListener('transitionend', remove, { once: true });
  setTimeout(remove, 240);
  return true;
}

function refreshActiveList() {
  if (currentView === 'notes') {
    renderNotesList();
    return;
  }
  if (currentView === 'note-focus') {
    return;
  }
  if (currentView === 'snippets') {
    const filtered = filterSnippets(snippetsData, searchTerm);
    renderSnippets(filtered);
    return;
  }
  if (currentView === 'diagnostics') {
    renderDiagnostics();
    if (!diagnosticsSnapshot) {
      fetchDiagnostics();
    }
    return;
  }
  if (currentView === 'inbox') {
    renderNotifications(notificationsData);
    return;
  }
  if (currentView === 'insights') {
    renderInsights(insightsData);
    return;
  }
  if (currentView === 'crocomni') {
    renderCrocOmniConversationList();
    if (!crocOmniStreaming) {
      renderCrocOmniMessages(crocOmniMessagesData);
    }
    syncCrocOmniComposerState();
    return;
  }
  if (currentView === 'diff') {
    renderDiff();
    return;
  }
  renderHistoryList();
}

async function handleOnboardingDictation() {
  if (!window.electronAPI?.toggleRecording) {
    return;
  }
  if (onboardingRecordingActive) {
    onboardingRecordingActive = false;
    if (onboardingDictateButton) {
      onboardingDictateButton.textContent = t('onboarding.dictation.cta');
    }
    window.electronAPI.toggleRecording();
    return;
  }

  onboardingRecordingActive = true;
  if (onboardingSuccessBadge) {
    onboardingSuccessBadge.classList.remove('active');
  }
  setOnboardingStatus(onboardingDictationStatus, t('onboarding.dictation.listening'));
  if (onboardingDictateButton) {
    onboardingDictateButton.textContent = t('onboarding.dictation.stop');
  }
  if (window.electronAPI?.setRecordingTarget) {
    await window.electronAPI.setRecordingTarget('onboarding');
  }
  window.electronAPI.toggleRecording();
}

async function handleCreateNote() {
  openFocusedNote(null);
}

function renderStats(stats) {
  if (!stats) {
    return;
  }
  const streak = Number.isFinite(stats.dayStreak) ? stats.dayStreak : 0;
  if (statStreak) {
    statStreak.textContent = `${streak}`;
  }
  if (statWords) {
    statWords.textContent = stats.words;
  }
  if (statTotal) {
    const notesTotal = Number.isFinite(stats.notesTotal) ? stats.notesTotal : stats.total;
    statTotal.textContent = Number.isFinite(notesTotal) ? notesTotal : '0';
  }
  if (streakSubtitle) {
    if (streak <= 0) {
      streakSubtitle.textContent = t('home.streak.none');
    } else if (streak === 1) {
      streakSubtitle.textContent = t('home.streak.one');
    } else {
      streakSubtitle.textContent = t('home.streak.many', { count: streak });
    }
  }
}

function formatResetLabel(iso) {
  const fallback = t('home.quota.reset.default');
  if (!iso) {
    return fallback;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
  const locale = i18n?.getLanguage() === 'fr' ? 'fr-FR' : 'en-US';
  const formatted = date.toLocaleDateString(locale ? [locale] : [], { weekday: 'long', hour: '2-digit', minute: '2-digit' });
  return t('home.quota.reset.withDate', { date: formatted });
}

function renderQuota(quota) {
  quotaSnapshot = quota || null;
  if (!quotaRemaining || !quotaReset) {
    return;
  }
  if (!quota) {
    quotaRemaining.textContent = '—';
    quotaReset.textContent = t('home.quota.unavailable');
    renderUpgradeNudge(quotaSnapshot, currentSubscription, currentAuth);
    return;
  }
  if (quota.checkFailed || quota.unavailable) {
    quotaRemaining.textContent = '—';
    quotaReset.textContent = quota.message || t('home.quota.unavailable');
    renderUpgradeNudge(quotaSnapshot, currentSubscription, currentAuth);
    return;
  }
  if (quota.requiresAuth) {
    quotaRemaining.textContent = '—';
    quotaReset.textContent = t('home.quota.authRequired');
    renderUpgradeNudge(quotaSnapshot, currentSubscription, currentAuth);
    return;
  }
  if (quota.unlimited) {
    quotaRemaining.textContent = t('home.quota.unlimited');
    quotaReset.textContent = t('home.quota.proActive');
    renderUpgradeNudge(quotaSnapshot, currentSubscription, currentAuth);
    return;
  }
  quotaRemaining.textContent = quota.remaining;
  quotaReset.textContent = formatResetLabel(quota.resetAt);
  renderUpgradeNudge(quotaSnapshot, currentSubscription, currentAuth);
}

function renderUpgradeNudge(quota, subscription, auth) {
  if (!upgradeNudge) {
    return;
  }
  const isPro = Boolean(subscription?.isPro);
  const remaining = Number.isFinite(quota?.remaining) ? quota.remaining : null;
  const shouldShow = !isPro
    && !quota?.requiresAuth
    && !quota?.unlimited
    && Number.isFinite(remaining)
    && remaining <= UPGRADE_NUDGE_THRESHOLD;

  if (!shouldShow) {
    upgradeNudge.style.display = 'none';
    upgradeNudge.setAttribute('aria-hidden', 'true');
    return;
  }

  if (upgradeNudgeRemaining) {
    upgradeNudgeRemaining.textContent = `${remaining}`;
  }
  if (upgradeNudgeCaption) {
    upgradeNudgeCaption.textContent = formatResetLabel(quota?.resetAt);
  }
  if (upgradeNudgeFill) {
    const limit = Number.isFinite(quota?.limit) ? quota.limit : null;
    const usedRatio = limit ? Math.min(1, Math.max(0, (limit - remaining) / limit)) : 1;
    const percent = Math.max(8, Math.round(usedRatio * 100));
    upgradeNudgeFill.style.width = `${percent}%`;
  }
  if (upgradeNudgeButton) {
    upgradeNudgeButton.disabled = !auth;
  }
  upgradeNudge.style.display = 'block';
  upgradeNudge.setAttribute('aria-hidden', 'false');
}

function getSubscriptionLabel(subscription) {
  const status = subscription?.status || 'inactive';
  if (status === 'pending') {
    return t('subscription.status.pending');
  }
  if (status === 'trialing') {
    return t('subscription.status.trial');
  }
  if (subscription?.isPro) {
    return t('subscription.status.pro');
  }
  return t('subscription.status.free');
}

function renderSubscription(subscription, auth) {
  currentSubscription = subscription || null;
  currentAuth = auth || null;
  if (profileName) {
    const displayName = auth?.email ? auth.email.split('@')[0] : t('subscription.guest');
    profileName.textContent = displayName;
  }
  if (profileAvatar) {
    const letterSource = profileName?.textContent || 'C';
    profileAvatar.textContent = letterSource.slice(0, 1).toUpperCase();
  }
  if (profilePlan) {
    profilePlan.textContent = getSubscriptionLabel(subscription);
  }
  if (subscriptionStatus) {
    const statusLabel = getSubscriptionLabel(subscription);
    const periodEnd = subscription?.currentPeriodEnd ? formatDateLabel(subscription.currentPeriodEnd) : '';
    subscriptionStatus.textContent = periodEnd
      ? t('subscription.renewal', { status: statusLabel, date: periodEnd })
      : statusLabel;
  }
  if (subscriptionBadge) {
    subscriptionBadge.classList.remove('pro', 'free', 'pending');
    const status = subscription?.status || 'inactive';
    if (status === 'pending') {
      subscriptionBadge.classList.add('pending');
      subscriptionBadge.textContent = t('subscription.badge.pending');
    } else if (subscription?.isPro) {
      subscriptionBadge.classList.add('pro');
      subscriptionBadge.textContent = t('subscription.badge.pro');
    } else {
      subscriptionBadge.classList.add('free');
      subscriptionBadge.textContent = t('subscription.badge.free');
    }
  }
  if (upgradePlanButton) {
    upgradePlanButton.textContent = subscription?.isPro ? t('subscription.cta.proActive') : t('subscription.cta.upgrade');
    upgradePlanButton.disabled = !auth || Boolean(subscription?.isPro);
  }
  if (manageSubscriptionButton) {
    manageSubscriptionButton.disabled = !auth;
  }
  if (refreshSubscriptionButton) {
    refreshSubscriptionButton.disabled = !auth;
  }
  if (subscriptionNote) {
    if (!auth) {
      subscriptionNote.textContent = t('subscription.note.authRequired');
    } else if (subscription?.status === 'pending') {
      subscriptionNote.textContent = t('subscription.note.pending');
    } else if (subscription?.isPro) {
      subscriptionNote.textContent = t('subscription.note.proThanks');
    } else {
      subscriptionNote.textContent = t('subscription.note.upgrade');
    }
  }
  renderUpgradeNudge(quotaSnapshot, subscription, auth);
}

function renderDictionary(dictionary) {
  if (!dictionaryList) {
    return;
  }
  dictionaryList.innerHTML = '';
  if (!dictionary || dictionary.length === 0) {
    dictionaryEmpty.style.display = 'flex';
    setEmptyStateState(dictionaryEmpty, false);
    return;
  }
  dictionaryEmpty.style.display = 'none';

  dictionary.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'dictionary-row';

    const content = document.createElement('div');
    content.className = 'dictionary-term';
    const main = document.createElement('div');
    main.className = 'dictionary-main';
    const from = document.createElement('span');
    from.textContent = entry.from_text;
    main.appendChild(from);

    if (entry.to_text && entry.to_text !== entry.from_text) {
      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = '→';
      const to = document.createElement('span');
      to.style.color = '#059669';
      to.textContent = entry.to_text;
      main.appendChild(arrow);
      main.appendChild(to);
    }
    content.appendChild(main);

    const meta = document.createElement('div');
    meta.className = 'dictionary-meta';
    const usageCountRaw = Number.parseInt(entry.frequency_used ?? 0, 10);
    const usageCount = Number.isFinite(usageCountRaw) ? usageCountRaw : 0;
    const usageLabel = usageCount > 0
      ? `${usageCount} utilisation${usageCount > 1 ? 's' : ''}`
      : 'Jamais utilisé';
    const lastUsedLabel = entry.last_used ? formatDateLabel(entry.last_used) : '';
    meta.textContent = lastUsedLabel ? `${usageLabel} · Dernière utilisation: ${lastUsedLabel}` : usageLabel;
    content.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'dictionary-row-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'edit';
    editBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
      </svg>
      Edit
    `;
    editBtn.addEventListener('click', async () => {
      const res = await openModal({
        title: 'Éditer le terme',
        confirmText: 'Mettre à jour',
        fields: [
          { key: 'from_text', label: 'Remplacer (De)', value: entry.from_text },
          { key: 'to_text', label: 'Par (Vers)', value: entry.to_text },
        ],
      });
      if (res && res.from_text && res.to_text) {
        await window.electronAPI.upsertDictionary({
          id: entry.id,
          from_text: res.from_text,
          to_text: res.to_text,
          created_at: entry.created_at,
        });
        showToastKey('toast.dictionary.updated');
        await refreshDashboard();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete';
    deleteBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
      </svg>
      Supprimer
    `;
    deleteBtn.addEventListener('click', async () => {
      await window.electronAPI.deleteDictionary(entry.id);
      showToastKey('toast.dictionary.deleted');
      await refreshDashboard();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    row.appendChild(content);
    row.appendChild(actions);
    dictionaryList.appendChild(row);
  });
}

function renderSnippets(snippets) {
  if (!snippetsList) {
    return;
  }
  snippetsList.innerHTML = '';
  if (!snippets || snippets.length === 0) {
    if (snippetsEmpty) {
      snippetsEmpty.style.display = 'flex';
      setEmptyStateState(snippetsEmpty, Boolean(searchTerm));
    }
    return;
  }
  if (snippetsEmpty) {
    snippetsEmpty.style.display = 'none';
  }

  snippets.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'snippet-row';

    const content = document.createElement('div');
    content.className = 'snippet-term';
    const cue = document.createElement('div');
    cue.className = 'snippet-cue';
    cue.textContent = entry.cue;
    const template = document.createElement('div');
    template.className = 'snippet-template';
    template.textContent = entry.template;
    content.appendChild(cue);
    content.appendChild(template);
    if (entry.description) {
      const desc = document.createElement('div');
      desc.className = 'snippet-description';
      desc.textContent = entry.description;
      content.appendChild(desc);
    }

    const actions = document.createElement('div');
    actions.className = 'snippet-row-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', async () => {
      const res = await openModal({
        title: 'Éditer le snippet',
        confirmText: 'Mettre à jour',
        fields: [
          { key: 'cue', label: 'Cue (ce que vous dites)', value: entry.cue },
          { key: 'template', label: 'Template', value: entry.template, multiline: true },
          { key: 'description', label: 'Description (optionnel)', value: entry.description || '' },
        ],
      });
      if (res && res.cue && res.template) {
        await window.electronAPI.upsertSnippet({
          id: entry.id,
          cue: res.cue,
          template: res.template,
          description: res.description || '',
          created_at: entry.created_at,
        });
        showToastKey('toast.snippet.updated');
        await refreshDashboard();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.addEventListener('click', async () => {
      await window.electronAPI.deleteSnippet(entry.id);
      showToastKey('toast.snippet.deleted');
      await refreshDashboard();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    row.appendChild(content);
    row.appendChild(actions);
    snippetsList.appendChild(row);
  });
}

function renderNotifications(notifications) {
  if (!notificationsList || !notificationsEmpty) {
    return;
  }
  notificationsList.innerHTML = '';
  if (!notifications || notifications.length === 0) {
    notificationsEmpty.style.display = 'flex';
    setEmptyStateState(notificationsEmpty, false);
    return;
  }
  notificationsEmpty.style.display = 'none';
  notifications.forEach((entry) => {
    if (entry.archived_at) {
      return;
    }
    const row = document.createElement('div');
    row.className = `notification-row${entry.read_at ? ' notification-read' : ''}`;
    const content = document.createElement('div');
    content.className = 'notification-content';
    const title = document.createElement('div');
    title.className = 'notification-title';
    title.textContent = entry.title || 'Notification';
    const body = document.createElement('div');
    body.className = 'notification-body';
    body.textContent = entry.body || '';
    const meta = document.createElement('div');
    meta.className = 'notification-meta';
    meta.textContent = entry.created_at ? new Date(entry.created_at).toLocaleString() : '';
    content.appendChild(title);
    content.appendChild(body);
    content.appendChild(meta);
    const actions = document.createElement('div');
    actions.className = 'notification-actions';
    const readButton = document.createElement('button');
    readButton.className = 'btn-secondary';
    readButton.type = 'button';
    readButton.textContent = entry.read_at ? 'Lu' : 'Marquer lu';
    readButton.disabled = Boolean(entry.read_at);
    readButton.addEventListener('click', async () => {
      await window.electronAPI.markNotificationRead(entry.id);
    });
    const archiveButton = document.createElement('button');
    archiveButton.className = 'btn-secondary';
    archiveButton.type = 'button';
    archiveButton.textContent = 'Archiver';
    archiveButton.addEventListener('click', async () => {
      await window.electronAPI.archiveNotification(entry.id);
    });
    actions.appendChild(readButton);
    actions.appendChild(archiveButton);
    row.appendChild(content);
    row.appendChild(actions);
    notificationsList.appendChild(row);
  });
}

function renderInsights(insights) {
  if (!insights) {
    return;
  }
  if (insightsTotal) {
    insightsTotal.textContent = `${insights.totalDictations || 0}`;
  }
  if (insightsWords) {
    insightsWords.textContent = `${insights.totalWords || 0}`;
  }
  if (insightsAvgWpm) {
    insightsAvgWpm.textContent = `${insights.averageWpm || 0}`;
  }
  if (insightsStreak) {
    insightsStreak.textContent = `${insights.streakDays || 0} jours`;
  }
  if (insightsTopApps) {
    insightsTopApps.innerHTML = '';
    const apps = insights.topApps || [];
    if (!apps.length) {
      insightsTopApps.textContent = 'Aucune application détectée.';
      return;
    }
    apps.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'insight-row';
      row.textContent = `${item.app} · ${item.count}`;
      insightsTopApps.appendChild(row);
    });
  }
}

function countWordsLocal(text) {
  if (!text) {
    return 0;
  }
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function computeInsightsFromHistoryLocal(history, days) {
  const stats = {
    totalDictations: 0,
    totalWords: 0,
    averageWords: 0,
    averageWpm: 0,
    topApps: [],
    streakDays: 0,
  };
  if (!Array.isArray(history) || !history.length) {
    return stats;
  }
  const cutoff = days ? Date.now() - (days * 24 * 60 * 60 * 1000) : null;
  const filtered = cutoff
    ? history.filter((entry) => {
      const createdAt = entry.created_at ? Date.parse(entry.created_at) : null;
      return createdAt && createdAt >= cutoff;
    })
    : history;
  let totalDurationMs = 0;
  const appCounts = new Map();
  const daysSet = new Set();
  filtered.forEach((entry) => {
    stats.totalDictations += 1;
    const words = countWordsLocal(entry.text || '');
    stats.totalWords += words;
    if (Number.isFinite(entry.duration_ms)) {
      totalDurationMs += entry.duration_ms;
    }
    if (entry.created_at) {
      daysSet.add(entry.created_at.slice(0, 10));
    }
    if (entry.context_json) {
      try {
        const context = JSON.parse(entry.context_json);
        const appName = context?.appName || context?.app || null;
        if (appName) {
          appCounts.set(appName, (appCounts.get(appName) || 0) + 1);
        }
      } catch {}
    }
  });
  stats.averageWords = stats.totalDictations ? Math.round(stats.totalWords / stats.totalDictations) : 0;
  if (totalDurationMs > 0) {
    const totalMinutes = totalDurationMs / 60000;
    stats.averageWpm = totalMinutes ? Math.round(stats.totalWords / totalMinutes) : 0;
  }
  stats.topApps = Array.from(appCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([app, count]) => ({ app, count }));
  const sortedDays = Array.from(daysSet).sort();
  let streak = 0;
  let current = null;
  sortedDays.forEach((day) => {
    if (!current) {
      current = day;
      streak = 1;
      return;
    }
    const prev = new Date(current);
    const next = new Date(prev.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    if (day === next) {
      streak += 1;
    } else {
      streak = 1;
    }
    current = day;
  });
  stats.streakDays = streak;
  return stats;
}

function getCrocOmniConversationTitle(conversation) {
  if (!conversation) {
    return 'Conversation CrocOmni';
  }
  const title = typeof conversation.title === 'string' ? conversation.title.trim() : '';
  return title || 'Conversation CrocOmni';
}

function filterCrocOmniConversations(conversations) {
  if (!searchTerm) {
    return conversations || [];
  }
  const query = searchTerm.toLowerCase();
  return (conversations || []).filter((conversation) => getCrocOmniConversationTitle(conversation).toLowerCase().includes(query));
}

function renderCrocOmniConversationList() {
  if (!crocOmniConversationList || !crocOmniConversationEmpty) {
    return;
  }
  const filtered = filterCrocOmniConversations(crocOmniConversations);
  crocOmniConversationList.innerHTML = '';
  if (!filtered.length) {
    crocOmniConversationList.style.display = 'none';
    crocOmniConversationEmpty.style.display = 'flex';
    setEmptyStateState(crocOmniConversationEmpty, Boolean(searchTerm));
    return;
  }
  crocOmniConversationList.style.display = 'flex';
  crocOmniConversationEmpty.style.display = 'none';
  filtered.forEach((conversation) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'croc-omni-conversation';
    if (conversation.id === crocOmniActiveConversationId) {
      row.classList.add('active');
    }
    row.addEventListener('click', () => {
      setActiveCrocOmniConversation(conversation.id);
    });

    const title = document.createElement('div');
    title.className = 'croc-omni-conversation-title';
    title.textContent = getCrocOmniConversationTitle(conversation);

    const meta = document.createElement('div');
    meta.className = 'croc-omni-conversation-meta';
    const stamp = conversation.updated_at || conversation.created_at || null;
    meta.textContent = stamp ? formatDateTimeLabel(stamp) : '—';

    row.appendChild(title);
    row.appendChild(meta);
    crocOmniConversationList.appendChild(row);
  });
}

function renderCrocOmniMessageHtml(content) {
  const text = typeof content === 'string' ? content.trim() : '';
  if (!text) {
    return '';
  }
  return renderMarkdownLite(text);
}

function buildCrocOmniMessageMeta(message, override) {
  if (override) {
    return override;
  }
  const parts = [];
  if (message?.created_at) {
    parts.push(formatDateTimeLabel(message.created_at));
  }
  if (message?.role === 'assistant') {
    const contextUsed = message.context_used === 1 || message.context_used === true;
    if (message.context_used !== undefined && message.context_used !== null) {
      parts.push(contextUsed ? 'Contexte utilisé' : 'Sans contexte');
    }
  }
  return parts.join(' · ');
}

function buildCrocOmniThinkingMarkup() {
  return `
    <div class="croc-omni-thinking">
      CrocOmni réfléchit
      <span class="croc-omni-typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </div>
  `;
}

function buildCrocOmniMessageElement(message, options = {}) {
  const role = message?.role === 'assistant' ? 'assistant' : 'user';
  const wrapper = document.createElement('div');
  wrapper.className = `croc-omni-message ${role}`;
  if (options.requestId) {
    wrapper.dataset.requestId = options.requestId;
  }

  const block = document.createElement('div');
  block.className = 'croc-omni-message-block';

  const bubble = document.createElement('div');
  bubble.className = 'croc-omni-bubble';
  if (options.thinking) {
    bubble.innerHTML = buildCrocOmniThinkingMarkup();
  } else {
    bubble.innerHTML = renderCrocOmniMessageHtml(message?.content || '') || escapeHtml(message?.content || '');
  }

  const meta = document.createElement('div');
  meta.className = 'croc-omni-message-meta';
  meta.textContent = buildCrocOmniMessageMeta(message, options.metaOverride);

  block.appendChild(bubble);
  block.appendChild(meta);
  wrapper.appendChild(block);

  return { wrapper, bubble, meta };
}

function renderCrocOmniMessages(messages) {
  if (!crocOmniMessages || !crocOmniMessagesEmpty) {
    return;
  }
  crocOmniMessages.innerHTML = '';
  if (!messages || messages.length === 0) {
    crocOmniMessages.style.display = 'none';
    crocOmniMessagesEmpty.style.display = 'flex';
    setEmptyStateState(crocOmniMessagesEmpty, false);
    return;
  }
  crocOmniMessages.style.display = 'flex';
  crocOmniMessagesEmpty.style.display = 'none';
  messages.forEach((message) => {
    const { wrapper } = buildCrocOmniMessageElement(message);
    crocOmniMessages.appendChild(wrapper);
  });
  scrollCrocOmniToBottom();
}

function appendCrocOmniMessageToUI(message, options = {}) {
  if (!crocOmniMessages || !crocOmniMessagesEmpty) {
    return null;
  }
  const element = buildCrocOmniMessageElement(message, options);
  crocOmniMessages.appendChild(element.wrapper);
  crocOmniMessages.style.display = 'flex';
  crocOmniMessagesEmpty.style.display = 'none';
  scrollCrocOmniToBottom();
  return element;
}

function scrollCrocOmniToBottom() {
  if (!crocOmniMessages) {
    return;
  }
  crocOmniMessages.scrollTop = crocOmniMessages.scrollHeight;
}

function syncCrocOmniComposerState() {
  const hasText = Boolean(crocOmniComposer?.value?.trim());
  if (crocOmniSendButton) {
    crocOmniSendButton.disabled = crocOmniStreaming || !hasText;
  }
  if (crocOmniComposer) {
    crocOmniComposer.disabled = crocOmniStreaming;
  }
  if (crocOmniClearConversation) {
    const hasMessages = crocOmniMessagesData.length > 0;
    crocOmniClearConversation.disabled = crocOmniStreaming || !crocOmniActiveConversationId || !hasMessages;
  }
  if (crocOmniComposerMeta) {
    crocOmniComposerMeta.textContent = crocOmniStreaming
      ? t('crocomni.composer.responding')
      : t('crocomni.composer.hint');
  }
}

function setActiveCrocOmniConversation(conversationId) {
  if (!conversationId) {
    return;
  }
  if (conversationId === crocOmniActiveConversationId) {
    return;
  }
  crocOmniActiveConversationId = conversationId;
  renderCrocOmniConversationList();
  loadCrocOmniMessages(conversationId);
  syncCrocOmniComposerState();
}

async function loadCrocOmniMessages(conversationId) {
  if (!window.electronAPI?.listCrocOmniMessages || !conversationId || crocOmniStreaming) {
    return;
  }
  const requestId = ++crocOmniMessagesRequestId;
  try {
    const messages = await window.electronAPI.listCrocOmniMessages(conversationId);
    if (requestId !== crocOmniMessagesRequestId) {
      return;
    }
    crocOmniMessagesData = Array.isArray(messages) ? messages : [];
    renderCrocOmniMessages(crocOmniMessagesData);
  } catch (error) {
    showToast(error?.message || t('toast.crocomni.loadFailed'), 'error');
  } finally {
    syncCrocOmniComposerState();
  }
}

async function createCrocOmniConversation() {
  if (!window.electronAPI?.createCrocOmniConversation) {
    return null;
  }
  try {
    const record = await window.electronAPI.createCrocOmniConversation({ title: t('crocomni.newConversation') });
    if (record?.id) {
      crocOmniConversations = [record, ...crocOmniConversations];
      crocOmniActiveConversationId = record.id;
      renderCrocOmniConversationList();
      crocOmniMessagesData = [];
      renderCrocOmniMessages(crocOmniMessagesData);
      syncCrocOmniComposerState();
      return record;
    }
  } catch (error) {
    showToast(error?.message || t('toast.crocomni.createFailed'), 'error');
  }
  return null;
}

async function clearCrocOmniConversation() {
  if (!window.electronAPI?.clearCrocOmniConversation || !crocOmniActiveConversationId) {
    return;
  }
  try {
    await window.electronAPI.clearCrocOmniConversation(crocOmniActiveConversationId);
    crocOmniMessagesData = [];
    renderCrocOmniMessages(crocOmniMessagesData);
    syncCrocOmniComposerState();
    showToastKey('toast.crocomni.cleared');
  } catch (error) {
    showToast(error?.message || t('toast.crocomni.clearFailed'), 'error');
  }
}

function handleCrocOmniStream(payload) {
  if (!payload || !payload.requestId) {
    return;
  }
  const state = crocOmniStreamState.get(payload.requestId);
  if (!state) {
    return;
  }
  if (payload.delta) {
    state.content += payload.delta;
    state.bubble.innerHTML = renderCrocOmniMessageHtml(state.content) || escapeHtml(state.content);
  }
  if (payload.error && !payload.delta && !state.content) {
    state.content = payload.error;
    state.bubble.innerHTML = renderCrocOmniMessageHtml(state.content) || escapeHtml(state.content);
  }
  if (payload.done) {
    const finalContent = payload.content || state.content || payload.error || '';
    state.content = finalContent;
    state.bubble.innerHTML = renderCrocOmniMessageHtml(finalContent) || escapeHtml(finalContent || '—');
    const metaParts = [];
    if (payload.completedAt) {
      metaParts.push(formatDateTimeLabel(payload.completedAt));
    } else {
      metaParts.push(formatDateTimeLabel(new Date().toISOString()));
    }
    if (payload.contextUsed === true) {
      metaParts.push(t('crocomni.meta.contextUsed'));
    } else if (payload.contextUsed === false) {
      metaParts.push(t('crocomni.meta.contextNone'));
    }
    state.meta.textContent = metaParts.join(' · ');
    crocOmniStreamState.delete(payload.requestId);
    crocOmniMessagesData = [...crocOmniMessagesData, {
      id: payload.messageId || payload.requestId,
      role: 'assistant',
      content: finalContent,
      context_used: payload.contextUsed === true ? 1 : 0,
      created_at: payload.completedAt || new Date().toISOString(),
    }];
    scrollCrocOmniToBottom();
  }
}

async function sendCrocOmniMessage() {
  if (!window.electronAPI?.sendCrocOmniMessage || crocOmniStreaming) {
    return;
  }
  const content = crocOmniComposer?.value?.trim() || '';
  if (!content) {
    return;
  }
  let conversationId = crocOmniActiveConversationId;
  if (!conversationId) {
    const record = await createCrocOmniConversation();
    conversationId = record?.id || crocOmniActiveConversationId;
  }
  if (!conversationId) {
    showToastKey('toast.crocomni.startFailed', 'error');
    return;
  }
  const requestId = typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : `croc-omni-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const now = new Date().toISOString();
  crocOmniMessagesData = [...crocOmniMessagesData, {
    id: requestId,
    role: 'user',
    content,
    created_at: now,
  }];
  appendCrocOmniMessageToUI({ role: 'user', content, created_at: now });

  if (crocOmniComposer) {
    crocOmniComposer.value = '';
  }
  syncCrocOmniComposerState();

  const thinkingElement = appendCrocOmniMessageToUI(
    { role: 'assistant', content: '' },
    { thinking: true, requestId, metaOverride: t('crocomni.answer.pending') },
  );
  if (thinkingElement) {
    crocOmniStreamState.set(requestId, {
      bubble: thinkingElement.bubble,
      meta: thinkingElement.meta,
      content: '',
    });
  }
  scrollCrocOmniToBottom();

  crocOmniStreaming = true;
  syncCrocOmniComposerState();
  try {
    const res = await window.electronAPI.sendCrocOmniMessage({
      conversationId,
      content,
      stream: true,
      requestId,
    });
    if (res?.ok === false) {
      handleCrocOmniStream({
        requestId,
        error: res.error || t('crocomni.answer.failed'),
        done: true,
      });
    }
  } catch (error) {
    handleCrocOmniStream({
      requestId,
      error: error?.message || t('crocomni.answer.failed'),
      done: true,
    });
  } finally {
    crocOmniStreaming = false;
    syncCrocOmniComposerState();
  }
}

function applyCrocOmniSnapshot(snapshot) {
  crocOmniConversations = Array.isArray(snapshot) ? snapshot.filter((conversation) => !conversation.archived_at) : [];
  if (crocOmniActiveConversationId
    && !crocOmniConversations.some((conversation) => conversation.id === crocOmniActiveConversationId)) {
    crocOmniActiveConversationId = null;
  }
  if (!crocOmniActiveConversationId && crocOmniConversations.length) {
    crocOmniActiveConversationId = crocOmniConversations[0].id;
  }
  renderCrocOmniConversationList();
  if (crocOmniActiveConversationId) {
    loadCrocOmniMessages(crocOmniActiveConversationId);
  } else {
    crocOmniMessagesData = [];
    renderCrocOmniMessages(crocOmniMessagesData);
  }
  syncCrocOmniComposerState();
}

function setCrocOmniSearchStatus(message = '') {
  if (!crocOmniSearchStatus) {
    return;
  }
  crocOmniSearchStatus.textContent = message || '';
}

function formatCrocOmniSnippet(snippet) {
  const safe = escapeHtml(snippet || '');
  return safe.replace(/\u0001/g, '<mark>').replace(/\u0002/g, '</mark>');
}

async function openCrocOmniResult(result) {
  if (!result) {
    return;
  }
  if (result.source === 'notes') {
    const existing = notesData.find((note) => note.id === result.doc_id) || null;
    let note = existing;
    if (!note && window.electronAPI?.getNoteById) {
      note = await window.electronAPI.getNoteById(result.doc_id);
    }
    if (!note) {
      showToastKey('toast.note.notFound', 'error');
      return;
    }
    openFocusedNote(note);
    return;
  }

  setActiveView('home');
  await delay(60);
  const row = document.querySelector(`[data-entry-type="history"][data-entry-id="${CSS.escape(result.doc_id)}"]`);
  if (!row) {
    showToastKey('toast.dictation.notFound', 'error');
    return;
  }
  row.classList.add('is-highlight');
  row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => row.classList.remove('is-highlight'), 1600);
}

function renderCrocOmniResults(results) {
  if (!crocOmniResults) {
    return;
  }
  crocOmniResults.innerHTML = '';
  if (!results || results.length === 0) {
    crocOmniResults.innerHTML = `<div class="empty-state">${t('crocomni.results.empty')}</div>`;
    return;
  }

  results.forEach((result) => {
    const row = document.createElement('div');
    row.className = 'croc-omni-result';
    row.tabIndex = 0;
    row.role = 'button';
    row.addEventListener('click', () => openCrocOmniResult(result));
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openCrocOmniResult(result);
      }
    });

    const header = document.createElement('div');
    header.className = 'croc-omni-result-header';

    const title = document.createElement('div');
    title.className = 'croc-omni-result-title';
    const fallbackTitle = result.source === 'notes'
      ? t('crocomni.result.note')
      : (result.created_at ? t('crocomni.result.dictationWithDate', { date: formatDateLabel(result.created_at) }) : t('crocomni.result.dictation'));
    title.textContent = result.title || fallbackTitle;

    const meta = document.createElement('div');
    meta.className = 'croc-omni-result-meta';
    const stamp = result.updated_at || result.created_at || null;
    const typeLabel = result.source === 'notes' ? t('crocomni.result.type.note') : t('crocomni.result.type.dictation');
    meta.textContent = `${typeLabel}${stamp ? ` · ${formatDateTimeLabel(stamp)}` : ''}`;

    header.appendChild(title);
    header.appendChild(meta);

    const snippet = document.createElement('div');
    snippet.className = 'croc-omni-result-snippet';
    snippet.innerHTML = formatCrocOmniSnippet(result.snippet) || escapeHtml('—');

    row.appendChild(header);
    row.appendChild(snippet);
    crocOmniResults.appendChild(row);
  });
}

function syncCrocOmniAnswerUiState() {
  if (!crocOmniAnswerButton) {
    return;
  }
  const crocOmniSettings = currentSettings?.crocOmni || {};
  const aiEnabled = crocOmniSettings.aiReplyEnabled === true;
  const apiReady = Boolean(currentSettings.apiKeyPresent);
  const hasResults = Array.isArray(crocOmniSearchResults) && crocOmniSearchResults.length > 0;
  crocOmniAnswerButton.disabled = crocOmniAnswerPending || !aiEnabled || !apiReady || !hasResults;
  if (crocOmniAnswerPanel) {
    crocOmniAnswerPanel.style.opacity = aiEnabled ? '1' : '0.85';
  }
  if (!aiEnabled) {
    if (crocOmniAnswerOutput) {
      crocOmniAnswerOutput.textContent = t('crocomni.answer.disabled');
    }
  } else if (!apiReady) {
    if (crocOmniAnswerOutput) {
      crocOmniAnswerOutput.textContent = t('crocomni.answer.missingKey');
    }
  }
}

async function runCrocOmniSearch() {
  if (!window.electronAPI?.searchCrocOmni) {
    showToastKey('toast.crocomni.searchUnavailable', 'error');
    return;
  }
  const query = crocOmniSearchInput?.value?.trim() || '';
  crocOmniSearchQuery = query;
  if (!query) {
    crocOmniSearchResults = [];
    renderCrocOmniResults(crocOmniSearchResults);
    setCrocOmniSearchStatus('');
    syncCrocOmniAnswerUiState();
    return;
  }
  const source = crocOmniSearchSource?.value || 'all';
  const rangeValue = crocOmniSearchRange?.value || 'all';
  const rangeDays = rangeValue && rangeValue !== 'all' ? Number.parseInt(rangeValue, 10) : null;

  crocOmniSearchPending = true;
  setCrocOmniSearchStatus(t('crocomni.search.pending'));
  syncCrocOmniAnswerUiState();
  try {
    const results = await window.electronAPI.searchCrocOmni(query, {
      source,
      rangeDays: Number.isFinite(rangeDays) ? rangeDays : null,
      limit: 20,
    });
    crocOmniSearchResults = Array.isArray(results) ? results : [];
    renderCrocOmniResults(crocOmniSearchResults);
    setCrocOmniSearchStatus(t('crocomni.search.count', { count: crocOmniSearchResults.length }));
  } catch (error) {
    crocOmniSearchResults = [];
    renderCrocOmniResults(crocOmniSearchResults);
    setCrocOmniSearchStatus(t('crocomni.search.failed'));
    showToast(error?.message || t('toast.crocomni.searchFailed'), 'error');
  } finally {
    crocOmniSearchPending = false;
    syncCrocOmniAnswerUiState();
  }
}

async function runCrocOmniAnswer() {
  if (!window.electronAPI?.answerCrocOmni) {
    showToastKey('toast.crocomni.answerUnavailable', 'error');
    return;
  }
  const query = crocOmniSearchQuery || crocOmniSearchInput?.value?.trim() || '';
  if (!query || crocOmniSearchResults.length === 0) {
    showToastKey('toast.crocomni.searchFirst', 'error');
    return;
  }
  crocOmniAnswerPending = true;
  if (crocOmniAnswerOutput) {
    crocOmniAnswerOutput.textContent = t('crocomni.answer.pending');
  }
  syncCrocOmniAnswerUiState();
  try {
    const res = await window.electronAPI.answerCrocOmni({
      query,
      hits: crocOmniSearchResults.slice(0, 6),
    });
    if (!res?.ok) {
      throw new Error(res?.error || 'answer_failed');
    }
    if (crocOmniAnswerOutput) {
      crocOmniAnswerOutput.textContent = res.answer || t('crocomni.answer.empty');
    }
  } catch (error) {
    if (crocOmniAnswerOutput) {
      crocOmniAnswerOutput.textContent = t('crocomni.answer.failed');
    }
    showToast(error?.message || t('toast.crocomni.answerFailed'), 'error');
  } finally {
    crocOmniAnswerPending = false;
    syncCrocOmniAnswerUiState();
  }
}

function renderStyles(styles) {
  if (!styleList) {
    return;
  }
  styleList.innerHTML = '';
  const filtered = (styles || []).filter((style) => STYLE_PRESETS.includes(style.name));
  const ordered = STYLE_PRESETS.map((name) => filtered.find((style) => style.name === name)).filter(Boolean);

  if (!ordered.length) {
    styleEmpty.style.display = 'flex';
    setEmptyStateState(styleEmpty, false);
    return;
  }
  styleEmpty.style.display = 'none';

  ordered.forEach((style) => {
    const card = document.createElement('div');
    card.className = 'style-card';
    if (style.id === currentSettings.activeStyleId) {
      card.classList.add('active');
    }

    const title = document.createElement('h3');
    title.textContent = STYLE_LABELS[style.name] || style.name;
    if (style.id === currentSettings.activeStyleId) {
      const badge = document.createElement('span');
      badge.className = 'style-badge';
      badge.textContent = 'Actif';
      title.appendChild(badge);
    }

    const desc = document.createElement('p');
    desc.textContent = STYLE_DESCRIPTIONS[style.name] || style.prompt || '';

    const preview = document.createElement('div');
    preview.className = 'style-preview';
    const example = STYLE_EXAMPLES[style.name] || {};
    const beforeText = style.exampleBefore || example.before || 'Je... euh... je pense que c\'est bon.';
    const afterText = style.exampleAfter || example.after || 'Je confirme que c\'est valide.';
    const buildPreviewRow = (label, text, extraClass = '') => {
      const row = document.createElement('div');
      row.className = `style-preview-row${extraClass ? ` ${extraClass}` : ''}`;
      const labelEl = document.createElement('span');
      labelEl.className = 'style-preview-label';
      labelEl.textContent = label;
      const textEl = document.createElement('span');
      textEl.className = 'style-preview-text';
      textEl.textContent = `"${text}"`;
      row.appendChild(labelEl);
      row.appendChild(textEl);
      return row;
    };
    preview.appendChild(buildPreviewRow('Avant', beforeText));
    preview.appendChild(buildPreviewRow('Après', afterText, 'style-preview-after'));

    const btn = document.createElement('button');
    btn.textContent = style.id === currentSettings.activeStyleId ? 'Style actuel' : 'Utiliser ce style';
    if (style.id !== currentSettings.activeStyleId) {
      btn.addEventListener('click', async () => {
        await window.electronAPI.activateStyle(style.id);
        showToastKey('toast.style.activated', 'success', { name: style.name });
        await refreshDashboard();
      });
    }

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(preview);
    card.appendChild(btn);
    styleList.appendChild(card);
  });
}

function renderContextProfiles(profiles, contextData) {
  if (!contextProfileList) {
    return;
  }
  contextProfileList.innerHTML = '';
  if (!profiles || profiles.length === 0) {
    const empty = document.createElement('div');
    empty.style.padding = '16px';
    empty.style.color = 'var(--text-muted)';
    empty.textContent = 'Aucun profil pour le moment.';
    contextProfileList.appendChild(empty);
    return;
  }
  profiles.forEach((profile) => {
    const row = document.createElement('div');
    row.className = 'context-profile-row';
    const content = document.createElement('div');
    const title = document.createElement('div');
    title.style.fontWeight = '700';
    title.textContent = profile.name || 'Profil';
    const meta = document.createElement('div');
    meta.className = 'context-profile-meta';
    const match = profile.match || {};
    const details = [
      match.appName ? `App: ${match.appName}` : null,
      match.windowTitle ? `Fenêtre: ${match.windowTitle}` : null,
      match.urlDomain ? `URL: ${match.urlDomain}` : null,
      profile.tone ? `Tone: ${profile.tone}` : null,
    ].filter(Boolean).join(' · ');
    meta.textContent = details || 'Aucune règle de match';
    content.appendChild(title);
    content.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'context-profile-actions';
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn-secondary';
    editBtn.textContent = 'Éditer';
    editBtn.addEventListener('click', async () => {
      const res = await openModal({
        title: 'Éditer un profil',
        confirmText: 'Mettre à jour',
        fields: [
          { key: 'name', label: 'Nom', value: profile.name || '' },
          { key: 'appName', label: 'Match App (contient)', value: match.appName || '' },
          { key: 'windowTitle', label: 'Match Fenêtre (contient)', value: match.windowTitle || '' },
          { key: 'urlDomain', label: 'Match URL (contient)', value: match.urlDomain || '' },
          {
            key: 'tone',
            label: 'Tone',
            type: 'select',
            value: profile.tone || 'default',
            options: [
              { value: 'default', label: 'Default' },
              { value: 'concise', label: 'Concise' },
              { value: 'conversational', label: 'Conversational' },
            ],
          },
          {
            key: 'lineBreaks',
            label: 'Line breaks',
            type: 'select',
            value: profile.formatting?.lineBreaks || 'auto',
            options: [
              { value: 'auto', label: 'Auto' },
              { value: 'single', label: 'Single' },
              { value: 'double', label: 'Double' },
            ],
          },
          {
            key: 'punctuation',
            label: 'Punctuation',
            type: 'select',
            value: profile.formatting?.punctuation || 'minimal',
            options: [
              { value: 'minimal', label: 'Minimal' },
              { value: 'standard', label: 'Standard' },
            ],
          },
        ],
      });
      if (!res || !res.name) {
        return;
      }
      const nextProfiles = profiles.map((item) => (item.id === profile.id ? {
        ...item,
        name: res.name,
        match: {
          appName: res.appName || '',
          windowTitle: res.windowTitle || '',
          urlDomain: res.urlDomain || '',
        },
        tone: res.tone || 'default',
        formatting: {
          lineBreaks: res.lineBreaks || 'auto',
          punctuation: res.punctuation || 'minimal',
        },
      } : item));
      await saveContextProfiles(nextProfiles);
      renderContext(contextData);
      showToastKey('toast.profile.updated');
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-secondary';
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.addEventListener('click', async () => {
      const nextProfiles = profiles.filter((item) => item.id !== profile.id);
      await saveContextProfiles(nextProfiles);
      renderContext(contextData);
      showToastKey('toast.profile.deleted');
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    row.appendChild(content);
    row.appendChild(actions);
    contextProfileList.appendChild(row);
  });
}

function renderContext(contextData) {
  const contextSettings = getContextSettingsLocal();
  const profiles = getContextProfilesLocal();

  if (contextEnabledToggle) {
    contextEnabledToggle.checked = contextSettings.enabled;
  }
  if (contextPostProcessToggle) {
    contextPostProcessToggle.checked = contextSettings.postProcessEnabled;
  }
  const signalMap = {
    app: contextSignalApp,
    window: contextSignalWindow,
    url: contextSignalUrl,
    ax: contextSignalAx,
    textbox: contextSignalTextbox,
    screenshot: contextSignalScreenshot,
  };
  Object.entries(signalMap).forEach(([key, el]) => {
    if (el) {
      el.checked = Boolean(contextSettings.signals[key]);
    }
  });
  if (contextRetentionInput) {
    contextRetentionInput.value = `${contextSettings.retentionDays || 30}`;
  }

  if (contextActiveApp) {
    contextActiveApp.textContent = contextData?.base?.appName || 'Inconnue';
  }
  if (contextActiveWindow) {
    contextActiveWindow.textContent = contextData?.base?.windowTitle || 'Inconnue';
  }
  if (contextActiveUrl) {
    contextActiveUrl.textContent = contextData?.base?.url || 'Non disponible';
  }

  const contextId = contextData?.contextId || '';
  const override = contextSettings.overrides?.[contextId] || {};
  const effectiveSignals = {
    ...contextSettings.signals,
    ...(override.signals || {}),
  };
  if (contextOverrideMode) {
    contextOverrideMode.value = override.mode || 'inherit';
    contextOverrideMode.disabled = !contextId;
  }

  if (contextOverrideProfile) {
    contextOverrideProfile.innerHTML = '<option value="">Profil…</option>';
    profiles.forEach((profile) => {
      const option = document.createElement('option');
      option.value = profile.id;
      option.textContent = profile.name || 'Profil';
      contextOverrideProfile.appendChild(option);
    });
    if (override.profileId) {
      contextOverrideProfile.value = override.profileId;
    }
    const overrideActive = (override.mode || 'inherit') === 'on';
    contextOverrideProfile.disabled = !overrideActive || !contextId;
    const overrideSignalMap = {
      app: contextOverrideSignalApp,
      window: contextOverrideSignalWindow,
      url: contextOverrideSignalUrl,
      ax: contextOverrideSignalAx,
      textbox: contextOverrideSignalTextbox,
      screenshot: contextOverrideSignalScreenshot,
    };
    Object.entries(overrideSignalMap).forEach(([key, el]) => {
      if (!el) {
        return;
      }
      el.checked = Boolean(effectiveSignals[key]);
      el.disabled = !overrideActive || !contextId;
    });
  }

  if (contextSuggestion) {
    const suggestionProfile = profiles.find((profile) => profile.id === contextData?.suggestionId);
    contextSuggestion.textContent = suggestionProfile ? suggestionProfile.name : '—';
    if (contextSuggestionApply) {
      contextSuggestionApply.disabled = !suggestionProfile;
    }
  }

  if (contextPreviewProfile) {
    contextPreviewProfile.innerHTML = '<option value="">Choisir un profil</option>';
    profiles.forEach((profile) => {
      const option = document.createElement('option');
      option.value = profile.id;
      option.textContent = profile.name || 'Profil';
      contextPreviewProfile.appendChild(option);
    });
  }

  renderContextProfiles(profiles, contextData);
}

async function updateContextOverride(contextId, mode, profileId, signalsOverride) {
  if (!contextId) {
    return;
  }
  const contextSettings = getContextSettingsLocal();
  const overrides = { ...(contextSettings.overrides || {}) };
  overrides[contextId] = {
    mode: mode || 'inherit',
    profileId: profileId || '',
    signals: signalsOverride || overrides[contextId]?.signals || {},
  };
  await saveContextSettings({ ...contextSettings, overrides });
  await refreshDashboard();
}

function renderSettings(settings) {
  settingsInputs.forEach((input) => {
    const key = input.dataset.setting;
    if (!key) {
      return;
    }
    if (key === 'microphoneId') {
      return;
    }
    if (key.startsWith('featureFlags.')) {
      const flag = key.split('.')[1];
      input.value = settings.featureFlags?.[flag] ? 'true' : 'false';
      return;
    }
    if (typeof settings[key] === 'undefined') {
      return;
    }
    const booleanSelectKeys = new Set([
      'postProcessEnabled',
      'metricsEnabled',
      'uploadCloudFallback',
      'telemetryOptIn',
      'telemetryIncludeSensitive',
      'audioDiagnosticsEnabled',
      'localAsrEnabled',
      'localEnhancementEnabled',
      'notificationsEnabled',
    ]);
    if (booleanSelectKeys.has(key)) {
      input.value = settings[key] ? 'true' : 'false';
    } else {
      if (key === 'notificationsMutedTypes') {
        const list = Array.isArray(settings[key]) ? settings[key] : [];
        input.value = list.join(', ');
      } else {
        input.value = settings[key];
      }
    }
    if (input.tagName === 'SELECT') {
      const options = Array.from(input.options || []);
      const hasMatch = options.some((option) => option.value === input.value);
      if (!hasMatch && options.length) {
        input.selectedIndex = 0;
      }
    }
  });

  if (apiKeyStatus) {
    apiKeyStatus.innerHTML = settings.apiKeyPresent
      ? `<span style="width:8px;height:8px;border-radius:999px;background:#10B981;"></span> ${t('settings.apiKey.connected')}`
      : `<span style="width:8px;height:8px;border-radius:999px;background:#EF4444;"></span> ${t('settings.apiKey.missing')}`;
    apiKeyStatus.style.color = settings.apiKeyPresent ? '#059669' : '#EF4444';
  }

  renderLocalAsrCommandStatus(settings);
}

function renderLocalAsrCommandStatus(settings) {
  if (!localAsrCommandStatus || !localAsrCommandRescan) {
    return;
  }
  const enabled = settings.localAsrEnabled === true;
  const mode = typeof settings.localAsrMode === 'string' ? settings.localAsrMode.trim().toLowerCase() : '';
  const endpoint = typeof settings.localAsrEndpoint === 'string' ? settings.localAsrEndpoint.trim() : '';
  const command = typeof settings.localAsrCommand === 'string' ? settings.localAsrCommand.trim() : '';
  const show = enabled && mode !== 'server' && !endpoint;

  localAsrCommandStatus.classList.remove('is-error', 'is-ok');
  if (!show) {
    localAsrCommandStatus.textContent = '';
    localAsrCommandStatus.style.display = 'none';
    localAsrCommandRescan.style.display = 'none';
    return;
  }

  localAsrCommandStatus.style.display = 'block';
  localAsrCommandRescan.style.display = 'inline-flex';
  localAsrCommandRescan.disabled = localAsrCommandRescanPending;

  if (command) {
    if (isLikelyPythonWhisperCommand(command)) {
      localAsrCommandStatus.textContent = t('localAsr.command.python');
      localAsrCommandStatus.classList.add('is-error');
      localAsrCommandRescan.textContent = t('localAsr.command.rescan');
    } else {
      localAsrCommandStatus.textContent = t('localAsr.command.detected', { command });
      localAsrCommandStatus.classList.add('is-ok');
      localAsrCommandRescan.textContent = t('localAsr.command.rescan');
    }
  } else {
    localAsrCommandStatus.textContent = t('localAsr.command.missing');
    localAsrCommandStatus.classList.add('is-error');
    localAsrCommandRescan.textContent = t('localAsr.command.scan');
  }
}

function isLikelyPythonWhisperCommand(commandPath) {
  if (!commandPath) {
    return false;
  }
  const normalized = commandPath.toLowerCase();
  if (!normalized.endsWith('whisper.exe') && !normalized.endsWith('/whisper')) {
    return false;
  }
  return normalized.includes('\\python') || normalized.includes('/python');
}

function renderAuth(auth, syncReady) {
  if (!authPanel) {
    return;
  }

  const syncBtn = syncNowButton;
  setSyncStatusMessage('');
  if (!syncReady) {
    authPanel.innerHTML = '';
    const errorSpan = document.createElement('span');
    errorSpan.className = 'sync-status error';
    errorSpan.textContent = t('auth.serverConfigError');
    authPanel.appendChild(errorSpan);
    if (syncBtn) {
      syncBtn.disabled = true;
    }
    setSyncStatusMessage(t('sync.status.notConfigured'), 'error');
    return;
  }

  if (auth) {
    if (syncBtn) {
      syncBtn.disabled = false;
    }
    authPanel.innerHTML = '';
    const panel = document.createElement('div');
    panel.className = 'auth-card-panel';
    const email = document.createElement('span');
    email.className = 'auth-email';
    email.textContent = auth.email || '';
    const signOutButton = document.createElement('button');
    signOutButton.id = 'signOutButton';
    signOutButton.className = 'auth-action';
    signOutButton.type = 'button';
    signOutButton.textContent = t('auth.signOut');
    signOutButton.addEventListener('click', async () => {
      await window.electronAPI.authSignOut();
      await refreshDashboard();
    });
    panel.appendChild(email);
    panel.appendChild(signOutButton);
    authPanel.appendChild(panel);
    setSyncStatusMessage(t('sync.status.available'), 'ok');
    return;
  }

  if (syncBtn) {
    syncBtn.disabled = true;
  }
  authPanel.innerHTML = '';
  const actions = document.createElement('div');
  actions.className = 'auth-actions-row';
  const authLoginButton = document.createElement('button');
  authLoginButton.id = 'authLoginButton';
  authLoginButton.className = 'auth-login-btn';
  authLoginButton.type = 'button';
  authLoginButton.textContent = t('auth.login');
  authLoginButton.addEventListener('click', async () => {
    if (window.electronAPI?.openSignupUrl) {
      setButtonLoading(authLoginButton, true, t('common.opening'));
      const result = await window.electronAPI.openSignupUrl('login');
      if (result?.ok === false) {
        showToastKey('common.openFailed', 'error');
      }
      setButtonLoading(authLoginButton, false);
    }
  });
  const authSignupButton = document.createElement('button');
  authSignupButton.id = 'authSignupButton';
  authSignupButton.className = 'auth-signup-btn';
  authSignupButton.type = 'button';
  authSignupButton.textContent = t('auth.signup');
  authSignupButton.addEventListener('click', async () => {
    if (window.electronAPI?.openSignupUrl) {
      setButtonLoading(authSignupButton, true, t('common.opening'));
      const result = await window.electronAPI.openSignupUrl('signup');
      if (result?.ok === false) {
        showToastKey('common.openFailed', 'error');
      }
      setButtonLoading(authSignupButton, false);
    }
  });
  actions.appendChild(authLoginButton);
  actions.appendChild(authSignupButton);
  authPanel.appendChild(actions);
  setSyncStatusMessage(t('sync.status.authRequired'));
}

let currentAuthState = null;
let authSubmitPending = false;

function setOverlayStatus(message, isError) {
  if (!authOverlayStatus) {
    return;
  }
  authOverlayStatus.textContent = message || '';
  authOverlayStatus.classList.remove('status-ok', 'status-error');
  authOverlayStatus.classList.add(isError ? 'status-error' : 'status-ok');
}

function applyAuthState(state) {
  currentAuthState = state || {};
  const status = currentAuthState.status || 'checking';
  const authed = status === 'authenticated';

  document.body.classList.toggle('auth-locked', !authed);
  if (authOverlay) {
    authOverlay.setAttribute('aria-hidden', authed ? 'true' : 'false');
  }

  let msg = '';
  let isErr = false;
  if (status === 'checking') {
    msg = t('auth.checking');
  } else if (status === 'error') {
    msg = t('auth.unavailable');
    isErr = true;
  } else if (status === 'not_configured') {
    msg = t('auth.notConfigured');
    isErr = true;
  }

  setOverlayStatus(currentAuthState.message || msg, isErr);

  const disabled = status === 'checking' || status === 'not_configured' || authSubmitPending;
  if (authOverlayLogin) {
    authOverlayLogin.disabled = disabled;
  }
  if (authOverlayEmail) {
    authOverlayEmail.disabled = disabled;
  }
  if (authOverlayPassword) {
    authOverlayPassword.disabled = disabled;
  }
  if (authOverlaySignup) {
    authOverlaySignup.disabled = disabled;
    authOverlaySignup.style.display = status === 'unauthenticated' ? 'inline-flex' : 'none';
  }
  if (authOverlayRetry) {
    authOverlayRetry.style.display = currentAuthState.retryable ? 'inline-flex' : 'none';
    authOverlayRetry.disabled = disabled;
  }
}

function applyPolishEntryState(settings) {
  if (!polishEntryButton) {
    return;
  }
  const flags = settings?.featureFlags || {};
  const enabled = flags.contextMenu !== false;
  polishEntryButton.hidden = !enabled;
  polishEntryButton.disabled = !enabled || !window.electronAPI?.openPolishDiff;
}

async function submitAuthLogin() {
  if (!window.electronAPI?.authSignIn) {
    setOverlayStatus(t('auth.unavailable'), true);
    return;
  }
  const email = authOverlayEmail?.value.trim();
  const password = authOverlayPassword?.value || '';
  if (!email || !password) {
    setOverlayStatus(t('auth.missingCredentials'), true);
    return;
  }

  authSubmitPending = true;
  applyAuthState(currentAuthState);
  setOverlayStatus(t('auth.signingIn'), false);
  try {
    await window.electronAPI.authSignIn(email, password);
    if (authOverlayPassword) {
      authOverlayPassword.value = '';
    }
  } catch (error) {
    setOverlayStatus(error?.message || t('auth.failed'), true);
  } finally {
    authSubmitPending = false;
    applyAuthState(currentAuthState);
  }
}

function applyMicrophoneSelection(value, label, groupId = '') {
  const id = typeof value === 'string' ? value : '';
  const rawLabel = typeof label === 'string' ? label.trim() : '';
  const rawGroup = typeof groupId === 'string' ? groupId.trim() : '';
  const normalizedLabel = rawLabel.toLowerCase();
  const isDefaultLabel = normalizedLabel === 'défaut système'
    || normalizedLabel === 'defaut systeme'
    || normalizedLabel === 'aucun micro détecté'
    || normalizedLabel === 'aucun micro detecte'
    || normalizedLabel === 'detection auto'
    || normalizedLabel === 'détection auto';
  const nextLabel = id ? rawLabel : (isDefaultLabel ? '' : rawLabel);
  currentSettings = {
    ...currentSettings,
    microphoneId: id,
    microphoneLabel: nextLabel,
    microphoneGroupId: id ? rawGroup : '',
  };
  if (window.electronAPI?.saveSettings) {
    return window.electronAPI.saveSettings(sanitizeSettingsForSave(currentSettings));
  }
  return null;
}

async function populateMicrophones(micsOverride) {
  let mics = Array.isArray(micsOverride) ? micsOverride : null;
  let listKnown = Array.isArray(micsOverride);

  if (!listKnown && window.electronAPI?.getMicrophoneList) {
    try {
      const cached = await window.electronAPI.getMicrophoneList();
      if (Array.isArray(cached)) {
        const fallback = cached.filter((device) => !device?.kind || device.kind === 'audioinput');
        mics = fallback;
        listKnown = true;
      }
    } catch (error) {
      console.error('Failed to load cached microphones:', error);
    }
  }

  if (!listKnown && navigator.mediaDevices?.enumerateDevices) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      mics = devices.filter((device) => device.kind === 'audioinput');
      listKnown = true;
    } catch (error) {
      console.error('Failed to list microphones:', error);
    }
  }

  if (!Array.isArray(mics)) {
    mics = [];
  }

  micListKnown = listKnown;
  micDeviceCount = mics.length;

  const defaultLabel = listKnown && mics.length === 0 ? 'Aucun micro détecté' : 'Défaut système';
  const storedId = currentSettings.microphoneId || '';
  const storedLabel = (currentSettings.microphoneLabel || '').trim();
  const storedGroupId = (currentSettings.microphoneGroupId || '').trim();
  const storedInList = storedId && mics.some((mic) => mic?.deviceId === storedId);
  const shouldAddFallback = storedId && !storedInList && mics.length === 0;
  const storedFallbackLabel = storedId
    ? (storedLabel || `Micro ${storedId.slice(0, 4)}...`)
    : '';
  const normalizedStoredLabel = storedLabel.toLowerCase();
  const targets = [microphoneSelect, onboardingMicrophoneSelect].filter(Boolean);
  targets.forEach((select) => {
    select.innerHTML = `<option value="">${defaultLabel}</option>`;
    mics.forEach((mic) => {
      if (!mic?.deviceId) {
        return;
      }
      const option = document.createElement('option');
      option.value = mic.deviceId;
      option.textContent = mic.label || `Micro ${mic.deviceId.slice(0, 4)}...`;
      if (mic.groupId) {
        option.dataset.groupId = mic.groupId;
      }
      select.appendChild(option);
    });
    if (shouldAddFallback) {
      const option = document.createElement('option');
      option.value = storedId;
      option.textContent = storedFallbackLabel;
      select.appendChild(option);
    }
    const options = Array.from(select.options);
    const idMatch = storedId ? options.find((option) => option.value === storedId) : null;
    const groupMatch = storedGroupId
      ? options.find((option) => (option.dataset.groupId || '').trim() === storedGroupId)
      : null;
    const labelMatch = normalizedStoredLabel
      ? options.find((option) => option.textContent?.trim().toLowerCase() === normalizedStoredLabel)
      : null;
    if (idMatch) {
      select.value = storedId;
    } else if (groupMatch) {
      select.value = groupMatch.value;
    } else if (labelMatch) {
      select.value = labelMatch.value;
    } else {
      select.value = '';
    }
    if (select.selectedIndex < 0 && select.options.length) {
      select.selectedIndex = 0;
    }
  });

  if (onboardingState?.step === 'mic_check') {
    updateOnboardingUI();
  }
}

function handleSettingChange(event) {
  const { setting } = event.target.dataset;
  if (!setting) {
    return;
  }
  if (setting === 'shortcut') {
    return;
  }

  let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
  if ([
    'postProcessEnabled',
    'metricsEnabled',
    'uploadCloudFallback',
    'telemetryOptIn',
    'telemetryIncludeSensitive',
    'audioDiagnosticsEnabled',
    'localAsrEnabled',
    'localEnhancementEnabled',
    'notificationsEnabled',
  ].includes(setting)) {
    value = value === 'true';
  }
  if (setting === 'streamChunkMs') {
    const parsed = Number.parseInt(value, 10);
    value = Number.isFinite(parsed) ? parsed : currentSettings.streamChunkMs || 900;
  }
  if (setting === 'streamSampleRate') {
    const parsed = Number.parseInt(value, 10);
    value = Number.isFinite(parsed) ? parsed : currentSettings.streamSampleRate || 16000;
  }
  if (setting === 'uploadMaxMb') {
    const parsed = Number.parseInt(value, 10);
    value = Number.isFinite(parsed) ? parsed : currentSettings.uploadMaxMb || 200;
  }
  if (setting === 'featureFlagsTtlMs') {
    const parsed = Number.parseInt(value, 10);
    value = Number.isFinite(parsed) ? parsed : currentSettings.featureFlagsTtlMs || 300000;
  }
  if (setting === 'notificationsPollMinutes') {
    const parsed = Number.parseInt(value, 10);
    value = Number.isFinite(parsed) ? parsed : currentSettings.notificationsPollMinutes || 60;
  }
  if (setting === 'localAsrMaxDurationMs') {
    const parsed = Number.parseInt(value, 10);
    value = Number.isFinite(parsed) ? parsed : currentSettings.localAsrMaxDurationMs || 60000;
  }
  if (setting === 'localEnhancementMaxDurationMs') {
    const parsed = Number.parseInt(value, 10);
    value = Number.isFinite(parsed) ? parsed : currentSettings.localEnhancementMaxDurationMs || 20000;
  }
  if (setting === 'notificationsRetentionDays') {
    const parsed = Number.parseInt(value, 10);
    value = Number.isFinite(parsed) ? parsed : currentSettings.notificationsRetentionDays || 30;
  }
  if (setting === 'notificationsMutedTypes') {
    value = typeof value === 'string'
      ? value.split(',').map((item) => item.trim()).filter(Boolean)
      : [];
  }

  if (setting.startsWith('featureFlags.')) {
    const flag = setting.split('.')[1];
    const flags = { ...(currentSettings.featureFlags || {}) };
    flags[flag] = value === true || value === 'true';
    currentSettings = { ...currentSettings, featureFlags: flags };
  } else {
    if (setting === 'microphoneId') {
      const selectedLabel = event.target?.selectedOptions?.[0]?.textContent || '';
      const selectedGroup = event.target?.selectedOptions?.[0]?.dataset?.groupId || '';
      applyMicrophoneSelection(value, selectedLabel, selectedGroup);
      populateMicrophones();
      return;
    } else {
      currentSettings = { ...currentSettings, [setting]: value };
    }
  }
  if (window.electronAPI?.saveSettings) {
    window.electronAPI.saveSettings(sanitizeSettingsForSave(currentSettings));
  }
}

function getDefaultShortcut() {
  return platform === 'darwin' ? 'Command+Shift+R' : 'Ctrl+Shift+R';
}

function normalizeShortcutKey(key) {
  if (!key) {
    return '';
  }
  const map = {
    ' ': 'Space',
    Escape: 'Escape',
    Tab: 'Tab',
    Enter: 'Enter',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
  };
  if (map[key]) {
    return map[key];
  }
  if (/^F\d{1,2}$/i.test(key)) {
    return key.toUpperCase();
  }
  if (key.length === 1) {
    if (/[a-z0-9]/i.test(key)) {
      return key.toUpperCase();
    }
    return '';
  }
  return '';
}

function buildAcceleratorFromEvent(event) {
  const rawKey = event.key;
  if (!rawKey || rawKey === 'Dead') {
    return null;
  }
  const ignored = new Set(['Shift', 'Control', 'Alt', 'Meta']);
  if (ignored.has(rawKey)) {
    return null;
  }

  const key = normalizeShortcutKey(rawKey);
  if (!key) {
    return null;
  }

  const modifiers = [];
  if (platform === 'darwin') {
    if (event.metaKey) {
      modifiers.push('Command');
    }
    if (event.ctrlKey) {
      modifiers.push('Ctrl');
    }
    if (event.altKey) {
      modifiers.push('Option');
    }
    if (event.shiftKey) {
      modifiers.push('Shift');
    }
  } else {
    if (event.ctrlKey) {
      modifiers.push('Ctrl');
    }
    if (event.altKey) {
      modifiers.push('Alt');
    }
    if (event.shiftKey) {
      modifiers.push('Shift');
    }
  }

  if (!modifiers.length) {
    return null;
  }
  return [...modifiers, key].join('+');
}

function setShortcutCaptureState(active) {
  shortcutCaptureActive = Boolean(active);
  if (shortcutCaptureActive) {
    shortcutInvalidShown = false;
  }
  if (shortcutInput) {
    shortcutInput.classList.toggle('is-capturing', shortcutCaptureActive);
  }
  if (shortcutHelp) {
    shortcutHelp.textContent = shortcutCaptureActive
      ? 'Appuyez sur la combinaison (Esc pour annuler).'
      : 'Cliquez dans le champ puis appuyez sur votre combinaison.';
  }
}

function setOnboardingHotkeyCaptureState(active) {
  onboardingShortcutCaptureActive = Boolean(active);
  if (onboardingHotkeyInput) {
    onboardingHotkeyInput.classList.toggle('is-capturing', onboardingShortcutCaptureActive);
  }
}

async function saveShortcut(shortcut) {
  if (!window.electronAPI?.saveSettings) {
    return;
  }
  const previous = currentSettings.shortcut;
  if (!shortcut || shortcut === previous) {
    return;
  }
  if (shortcutInput) {
    shortcutInput.disabled = true;
  }
  try {
    const next = await window.electronAPI.saveSettings(sanitizeSettingsForSave({ ...currentSettings, shortcut }));
    currentSettings = { ...currentSettings, ...(next || {}) };
    renderSettings(currentSettings);
    if (currentSettings.shortcut !== shortcut) {
      showToastKey('toast.shortcut.saveFailedKeep', 'error');
      return;
    }
    showToastKey('toast.shortcut.updated');
  } catch (error) {
    currentSettings = { ...currentSettings, shortcut: previous };
    renderSettings(currentSettings);
    showToast(error?.message || t('toast.shortcut.saveFailed'), 'error');
  } finally {
    if (shortcutInput) {
      shortcutInput.disabled = false;
    }
  }
}

async function refreshDashboard() {
  if (!window.electronAPI) {
    return;
  }
  renderHistoryLoading();
  try {
    dashboardData = await window.electronAPI.getDashboardData();
  } catch (error) {
    renderHistoryError(t('home.history.loadFailed'));
    showToastKey('toast.dashboard.loadFailed', 'error');
    return;
  }
  currentSettings = dashboardData.settings || {};
  applyDashboardLanguage(currentSettings);

  renderStats(dashboardData.stats);
  renderQuota(dashboardData.quota);
  historyData = dashboardData.history || [];
  notesData = dashboardData.notes || [];
  dictionaryData = dashboardData.dictionary || [];
  snippetsData = dashboardData.snippets || [];
  notificationsData = dashboardData.notifications || [];
  insightsData = computeInsightsFromHistoryLocal(historyData, insightsRangeDays);
  refreshActiveList();
  renderDictionary(dictionaryData);
  renderSnippets(snippetsData);
  renderNotifications(notificationsData);
  renderInsights(insightsData);
  renderStyles(dashboardData.styles);
  renderSettings(currentSettings);
  applyPolishEntryState(currentSettings);
  renderContext(dashboardData.context);
  applyCrocOmniSettings(currentSettings);
  applyCrocOmniSnapshot(dashboardData.crocOmniConversations);
  applyUploadsSnapshot(dashboardData.uploads);
  applyOnboardingStateFromSettings(currentSettings);
  applyLocalModelsSnapshot(dashboardData.localModels);
  renderAuth(dashboardData.auth, dashboardData.syncReady);
  renderSubscription(dashboardData.subscription, dashboardData.auth);
  await populateMicrophones();
  startSubscriptionActivationCheck();
}

async function refreshLocalModelsOnly() {
  if (!window.electronAPI?.listLocalModels) {
    return;
  }
  try {
    const snapshot = await window.electronAPI.listLocalModels();
    applyLocalModelsSnapshot(snapshot);
  } catch {}
}

window.addEventListener('DOMContentLoaded', () => {
  platform = window.electronAPI?.getPlatform ? window.electronAPI.getPlatform() : 'win32';
  updateBreadcrumb(currentView);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (event) => {
      if (event.target === modalBackdrop && modalResolver) {
        modalCancel.click();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modalResolver) {
        modalCancel.click();
      }
  });
}

	function applyCrocOmniSettings(settings) {
	  const crocOmniSettings = settings?.crocOmni || {};
	  const aiEnabled = crocOmniSettings.aiReplyEnabled === true;
	  if (crocOmniAiReplyToggle) {
	    crocOmniAiReplyToggle.checked = aiEnabled;
	  }
	  if (crocOmniAiSensitiveToggle) {
	    crocOmniAiSensitiveToggle.checked = crocOmniSettings.aiReplyIncludeSensitive === true;
	    crocOmniAiSensitiveToggle.disabled = !aiEnabled;
	  }
	  syncCrocOmniAnswerUiState();
	}

function updateCrocOmniSettings(nextSettings) {
  currentSettings = { ...currentSettings, ...nextSettings };
  if (window.electronAPI?.saveSettings) {
    window.electronAPI.saveSettings(sanitizeSettingsForSave(currentSettings));
  }
}

  document.addEventListener('keydown', (event) => {
    if (!document.body.classList.contains('note-focus-active')) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeFocusedNote();
      return;
    }
    const isSave = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
    if (isSave) {
      event.preventDefault();
      saveFocusedNote({ force: true });
    }
  });

  document.addEventListener('selectionchange', () => {
    if (!document.body.classList.contains('note-focus-active')) {
      hideFocusToolbar();
      return;
    }
    if (isSelectionInsideFocusedEditor()) {
      positionFocusToolbar();
      return;
    }
    hideFocusToolbar();
  });

  window.addEventListener('resize', () => {
    if (noteFocusWidth) {
      applyNoteFocusWidth(noteFocusWidth);
    }
  });

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      setActiveView(item.dataset.view);
    });
  });

  if (onboardingStartButton) {
    onboardingStartButton.addEventListener('click', () => {
      onboardingSessionDismissed = false;
      setOnboardingStep('permissions');
    });
  }

  if (onboardingSkipButton) {
    onboardingSkipButton.addEventListener('click', () => {
      onboardingSessionDismissed = true;
      setOnboardingOverlayVisible(false);
      if (window.electronAPI?.stopOnboardingMic) {
        window.electronAPI.stopOnboardingMic();
      }
    });
  }

  if (onboardingPermissionButton) {
    onboardingPermissionButton.addEventListener('click', async () => {
      setOnboardingStatus(onboardingPermissionStatus, t('onboarding.permissions.requesting'));
      if (window.electronAPI?.startOnboardingMic) {
        const result = await window.electronAPI.startOnboardingMic();
        if (result?.ok === false) {
          setOnboardingStatus(onboardingPermissionStatus, t('onboarding.permissions.failed'), 'error');
        }
      }
    });
  }

  if (onboardingPrivacyLink) {
    onboardingPrivacyLink.addEventListener('click', async () => {
      if (window.electronAPI?.openPrivacyMicrophone) {
        await window.electronAPI.openPrivacyMicrophone();
      }
    });
  }

  if (onboardingMicrophoneApply) {
    onboardingMicrophoneApply.addEventListener('click', async () => {
      if (!onboardingMicrophoneSelect) {
        return;
      }
      const value = onboardingMicrophoneSelect.value;
      const selectedOption = onboardingMicrophoneSelect.selectedOptions?.[0];
      const selectedLabel = selectedOption?.textContent || '';
      const selectedGroup = selectedOption?.dataset?.groupId || '';
      if (window.electronAPI?.stopOnboardingMic) {
        window.electronAPI.stopOnboardingMic();
      }
      await applyMicrophoneSelection(value, selectedLabel, selectedGroup);
      populateMicrophones();
      onboardingMicReady = false;
      onboardingMicLevel = 0;
      onboardingMicLastActiveAt = 0;
      onboardingMicIgnoreUntil = Date.now() + MIC_IGNORE_AFTER_CHANGE_MS;
      updateVuMeter(0);
      setOnboardingStatus(onboardingMicStatus, t('onboarding.mic.updated'), '');
      if (window.electronAPI?.startOnboardingMic) {
        await delay(150);
        await window.electronAPI.startOnboardingMic();
      }
      updateOnboardingChecklist();
      updateOnboardingUI();
    });
  }

  if (onboardingMicContinue) {
    onboardingMicContinue.addEventListener('click', () => {
      setOnboardingStep('hotkey');
    });
  }

  if (onboardingHotkeyInput) {
    onboardingHotkeyInput.addEventListener('focus', () => {
      onboardingShortcutBeforeCapture = onboardingHotkeyInput.value || currentSettings.shortcut || '';
      onboardingHotkeyInput.value = t('onboarding.hotkey.capturePrompt');
      setOnboardingHotkeyCaptureState(true);
    });
    onboardingHotkeyInput.addEventListener('blur', () => {
      if (!onboardingShortcutCaptureActive) {
        onboardingHotkeyInput.value = currentSettings.shortcut || onboardingShortcutBeforeCapture || '';
        return;
      }
      setOnboardingHotkeyCaptureState(false);
      onboardingHotkeyInput.value = currentSettings.shortcut || onboardingShortcutBeforeCapture || '';
    });
    onboardingHotkeyInput.addEventListener('keydown', async (event) => {
      if (!onboardingShortcutCaptureActive) {
        return;
      }
      event.preventDefault();
      if (event.key === 'Escape') {
        onboardingHotkeyInput.value = onboardingShortcutBeforeCapture || currentSettings.shortcut || '';
        onboardingHotkeyInput.blur();
        return;
      }
      const accelerator = buildAcceleratorFromEvent(event);
      if (!accelerator) {
        setOnboardingStatus(onboardingHotkeyStatus, t('onboarding.hotkey.invalidCombo'), 'error');
        return;
      }
      onboardingHotkeyInput.value = accelerator;
      onboardingHotkeyInput.blur();
      await saveShortcut(accelerator);
      const ok = currentSettings.shortcut === accelerator;
      onboardingState = { ...onboardingState, hotkeyReady: ok };
      await persistOnboardingState({ hotkeyReady: ok });
      if (ok) {
        setOnboardingStatus(onboardingHotkeyStatus, t('onboarding.hotkey.saved'), 'success');
      } else {
        setOnboardingStatus(onboardingHotkeyStatus, t('onboarding.hotkey.invalid'), 'error');
      }
      updateOnboardingChecklist();
      updateOnboardingUI();
    });
  }

  if (onboardingHotkeyNext) {
    onboardingHotkeyNext.addEventListener('click', () => {
      setOnboardingStep('local_model');
    });
  }
  if (onboardingLocalModelSkip) {
    onboardingLocalModelSkip.addEventListener('click', () => {
      setOnboardingStep('first_dictation');
    });
  }
  if (onboardingLocalModelNext) {
    onboardingLocalModelNext.addEventListener('click', () => {
      setOnboardingStep('first_dictation');
    });
  }

  if (onboardingDictateButton) {
    onboardingDictateButton.addEventListener('click', handleOnboardingDictation);
  }

  if (onboardingFirstRunNext) {
    onboardingFirstRunNext.addEventListener('click', () => {
      setOnboardingStep('delivery_check');
    });
  }

  if (onboardingDeliveryTestButton) {
    onboardingDeliveryTestButton.addEventListener('click', async () => {
      if (!window.electronAPI?.runOnboardingDeliveryCheck) {
        setOnboardingStatus(onboardingDeliveryStatus, t('onboarding.delivery.unavailable'), 'error');
        return;
      }
      const sample = 'CrocoVoice OK';
      if (onboardingDeliveryInput) {
        onboardingDeliveryInput.value = '';
        onboardingDeliveryInput.focus();
      }
      setOnboardingStatus(onboardingDeliveryStatus, t('onboarding.delivery.testing'));
      const result = await window.electronAPI.runOnboardingDeliveryCheck(sample);
      setTimeout(() => {
        const received = onboardingDeliveryInput?.value.includes(sample);
        if (result?.ok && received) {
          onboardingDeliveryReady = true;
          setOnboardingStatus(onboardingDeliveryStatus, t('onboarding.delivery.success'), 'success');
        } else {
          onboardingDeliveryReady = false;
          setOnboardingStatus(
            onboardingDeliveryStatus,
            result?.reason || t('onboarding.delivery.blocked'),
            'error',
          );
        }
        updateOnboardingChecklist();
        updateOnboardingUI();
      }, 350);
    });
  }

  if (onboardingDeliveryNext) {
    onboardingDeliveryNext.addEventListener('click', () => {
      setOnboardingStep('done');
    });
  }

  if (onboardingFinishButton) {
    onboardingFinishButton.addEventListener('click', async () => {
      onboardingSessionDismissed = true;
      await persistOnboardingState({ completed: true, step: 'done' });
      setOnboardingOverlayVisible(false);
      setActiveView('home');
    });
  }

  if (localModelPresetSelect) {
    localModelPresetSelect.addEventListener('change', async (event) => {
      if (localModelPresetSelectUpdating) {
        return;
      }
      if (!window.electronAPI?.setLocalModelPreset) {
        return;
      }
      const preset = event.target.value;
      if (!preset) {
        return;
      }
      const result = await window.electronAPI.setLocalModelPreset(preset);
      if (!result?.ok) {
        showToastKey('toast.localModel.presetChangeFailed', 'error');
        return;
      }
      const model = getLocalModelByPreset(preset);
      if (!model || model.status !== 'installed') {
        if (window.electronAPI?.installLocalModel) {
          const downloadResult = await window.electronAPI.installLocalModel(preset);
          if (!downloadResult?.ok) {
            const reason = downloadResult?.reason;
            if (reason === 'missing_source') {
              showToastKey('localModel.download.unavailable', 'error');
            } else if (reason === 'already_downloading') {
              showToastKey('toast.localModel.download.already');
            } else if (reason === 'model_not_found') {
              showToastKey('toast.localModel.notFound', 'error');
            } else {
              showToastKey('toast.localModel.download.failed', 'error');
            }
            await refreshDashboard();
            return;
          }
          if (downloadResult.status === 'already_installed') {
            showToastKey('toast.localModel.alreadyInstalled');
          } else {
            showToastKey('toast.localModel.download.started');
          }
          await refreshLocalModelsOnly();
        } else {
          showToastKey('localModel.download.unavailable', 'error');
        }
      } else {
        showToastKey('toast.localModel.preset.selected');
      }
      await refreshDashboard();
    });
  }

  if (localAsrCommandRescan) {
    localAsrCommandRescan.addEventListener('click', async () => {
      if (localAsrCommandRescanPending) {
        return;
      }
      if (!window.electronAPI?.autoConfigureLocalAsrCommand) {
        showToastKey('toast.localAsr.scan.unavailable', 'error');
        return;
      }
      localAsrCommandRescanPending = true;
      renderLocalAsrCommandStatus(currentSettings);
      const result = await window.electronAPI.autoConfigureLocalAsrCommand();
      localAsrCommandRescanPending = false;
      if (result?.ok) {
        showToastKey('toast.localAsr.command.detected');
      } else if (result?.reason === 'not_found') {
        showToastKey('toast.localAsr.command.notFound', 'error');
      } else if (result?.reason === 'already_set') {
        showToastKey('toast.localAsr.command.alreadySet');
      } else if (result?.reason === 'server_mode') {
        showToastKey('toast.localAsr.serverMode', 'error');
      } else {
        showToastKey('toast.localAsr.scan.failed', 'error');
      }
      await refreshDashboard();
    });
  }

  if (profileCard) {
    profileCard.addEventListener('click', () => {
      setActiveView('account');
    });
    profileCard.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveView('account');
      }
    });
  }

  if (window.electronAPI?.onDashboardView) {
    window.electronAPI.onDashboardView((viewName) => {
      setActiveView(viewName || 'home');
    });
  }

  if (onboardingResetButton) {
    onboardingResetButton.addEventListener('click', async () => {
      onboardingSessionDismissed = false;
      onboardingMicReady = false;
      onboardingPermissionGranted = false;
      onboardingMicLevel = 0;
      onboardingMicLastActiveAt = 0;
      onboardingDeliveryReady = false;
      updateVuMeter(0);
      if (onboardingSandbox) {
        onboardingSandbox.value = '';
      }
      if (onboardingSuccessBadge) {
        onboardingSuccessBadge.classList.remove('active');
      }
      if (window.electronAPI?.stopOnboardingMic) {
        window.electronAPI.stopOnboardingMic();
      }
      await persistOnboardingState({
        step: 'welcome',
        completed: false,
        firstRunSuccess: false,
        hotkeyReady: false,
      });
      setActiveView('home');
      updateOnboardingUI();
    });
  }

  if (uploadAudioButton) {
    uploadAudioButton.addEventListener('click', async () => {
      if (!window.electronAPI?.selectUploadFile) {
        showToastKey('toast.import.unavailable', 'error');
        return;
      }
      const result = await window.electronAPI.selectUploadFile();
      if (!result?.ok) {
        if (result?.reason && result.reason !== 'canceled') {
          showToast(result.reason, 'error');
        }
        return;
      }
      if (result?.job) {
        upsertUploadJob(result.job);
      }
      showToastKey('toast.import.inProgress');
      await refreshDashboard();
    });
  }

  if (uploadDropzone) {
    const clearDropActive = () => uploadDropzone.classList.remove('is-dragover');
    uploadDropzone.addEventListener('dragover', (event) => {
      event.preventDefault();
      uploadDropzone.classList.add('is-dragover');
    });
    uploadDropzone.addEventListener('dragleave', () => {
      clearDropActive();
    });
    uploadDropzone.addEventListener('drop', async (event) => {
      event.preventDefault();
      clearDropActive();
      const file = event.dataTransfer?.files?.[0];
      if (!file) {
        return;
      }
      if (!window.electronAPI?.addUploadFile) {
        showToastKey('toast.import.unavailable', 'error');
        return;
      }
      const result = await window.electronAPI.addUploadFile(file.path);
      if (!result?.ok) {
        if (result?.reason) {
          showToast(result.reason, 'error');
        }
        return;
      }
      if (result?.job) {
        upsertUploadJob(result.job);
      }
      showToastKey('toast.import.inProgress');
      await refreshDashboard();
    });
    uploadDropzone.addEventListener('click', (event) => {
      if (uploadAudioButton && uploadAudioButton.contains(event.target)) {
        return;
      }
      if (uploadAudioButton) {
        uploadAudioButton.click();
      }
    });
  }

  if (diagnosticsRunChecks) {
    diagnosticsRunChecks.addEventListener('click', async () => {
      await runDiagnosticsChecks();
    });
  }

  if (telemetryExportButton) {
    telemetryExportButton.addEventListener('click', async () => {
      if (!window.electronAPI?.exportTelemetry) {
        showToastKey('toast.telemetry.unavailable', 'error');
        return;
      }
      try {
        const payload = await window.electronAPI.exportTelemetry();
        if (telemetryOutput) {
          telemetryOutput.textContent = JSON.stringify(payload, null, 2);
        }
        showToastKey('toast.telemetry.generated');
      } catch (error) {
        showToastKey('toast.telemetry.failed', 'error');
      }
    });
  }

  if (diagnosticsCopy) {
    diagnosticsCopy.addEventListener('click', async () => {
      await fetchDiagnostics();
      const text = diagnosticsOutput?.textContent || '';
      if (!text) {
        showToastKey('toast.diagnostics.none', 'error');
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        showToastKey('toast.diagnostics.copied');
      } catch (error) {
        showToastKey('toast.copy.failed', 'error');
      }
    });
  }

  if (window.electronAPI?.onOnboardingMicLevel) {
    window.electronAPI.onOnboardingMicLevel(handleOnboardingMicLevel);
  }

  if (window.electronAPI?.onOnboardingMicError) {
    window.electronAPI.onOnboardingMicError((message) => {
      setOnboardingStatus(
        onboardingPermissionStatus,
        message || t('onboarding.permissions.denied'),
        'error',
      );
      setOnboardingStatus(onboardingMicStatus, message || t('onboarding.mic.noSignal'), 'error');
    });
  }

  if (noteFocusBack) {
    noteFocusBack.addEventListener('click', () => {
      closeFocusedNote();
    });
  }

  if (noteFocusShell) {
    noteFocusShell.addEventListener('click', (event) => {
      if (event.target === noteFocusShell) {
        closeFocusedNote();
      }
    });
  }

  if (noteFocusResizer) {
    noteFocusResizer.addEventListener('pointerdown', (event) => {
      if (event.button !== undefined && event.button !== 0) {
        return;
      }
      event.preventDefault();
      noteFocusResizing = true;
      document.body.classList.add('note-focus-resizing');
      window.addEventListener('pointermove', handleNoteFocusResize);
      window.addEventListener('pointerup', stopNoteFocusResize);
      window.addEventListener('pointercancel', stopNoteFocusResize);
    });
  }

  if (noteFocusTitle) {
    noteFocusTitle.addEventListener('input', handleFocusedTitleInput);
  }

  if (noteFocusEditor) {
    noteFocusEditor.addEventListener('input', handleFocusedEditorInput);
    noteFocusEditor.addEventListener('keydown', (event) => {
      if (handleNoteListShortcut(event)) {
        return;
      }
    });
    noteFocusEditor.addEventListener('click', (event) => {
      const link = event.target && event.target.closest ? event.target.closest('a') : null;
      if (!link || !link.href) {
        return;
      }
      event.preventDefault();
      window.open(link.href, '_blank', 'noopener');
    });
  }

  if (noteFocusToolbar) {
    noteFocusToolbar.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
    noteFocusToolbar.querySelectorAll('[data-format]').forEach((button) => {
      button.addEventListener('click', async () => {
        await applyFocusFormat(button.dataset.format);
      });
    });
  }

  if (upgradePlanButton) {
    upgradePlanButton.addEventListener('click', async () => {
      await triggerCheckout(upgradePlanButton);
    });
  }

  if (upgradeNudgeButton) {
    upgradeNudgeButton.addEventListener('click', async () => {
      await triggerCheckout(upgradeNudgeButton);
    });
  }

  if (polishEntryButton) {
    polishEntryButton.addEventListener('click', () => {
      if (!window.electronAPI?.openPolishDiff) {
        showToastKey('toast.polish.unavailable', 'error');
        return;
      }
      window.electronAPI.openPolishDiff();
    });
  }

  if (manageSubscriptionButton) {
    manageSubscriptionButton.addEventListener('click', async () => {
      if (!window.electronAPI?.openSubscriptionPortal) {
        showToastKey('toast.portal.unavailable', 'error');
        return;
      }
      const auth = window.electronAPI?.authStatus ? await window.electronAPI.authStatus() : null;
      if (!auth) {
        showToastKey('toast.portal.authRequired', 'error');
        if (window.electronAPI?.openSignupUrl) {
          setButtonLoading(manageSubscriptionButton, true, t('common.opening'));
          const result = await window.electronAPI.openSignupUrl('login');
          if (result?.ok === false) {
            showToastKey('common.openFailed', 'error');
          }
          setButtonLoading(manageSubscriptionButton, false);
        }
        return;
      }
      try {
        setButtonLoading(manageSubscriptionButton, true, t('common.opening'));
        const result = await window.electronAPI.openSubscriptionPortal();
        if (!result?.ok) {
          showToastKey('toast.portal.notConfigured', 'error');
          return;
        }
      } catch (error) {
        showToast(error?.message || t('toast.portal.unavailable'), 'error');
      } finally {
        setButtonLoading(manageSubscriptionButton, false);
      }
    });
  }

  if (refreshSubscriptionButton) {
    refreshSubscriptionButton.addEventListener('click', async () => {
      if (!window.electronAPI?.refreshSubscription) {
        showToastKey('toast.subscription.refreshUnavailable', 'error');
        return;
      }
      const auth = window.electronAPI?.authStatus ? await window.electronAPI.authStatus() : null;
      if (!auth) {
        showToastKey('toast.subscription.refreshAuthRequired', 'error');
        return;
      }
      try {
        const result = await window.electronAPI.refreshSubscription();
        if (!result?.ok) {
          showToastKey('toast.subscription.refreshFailed', 'error');
          return;
        }
        showToastKey('toast.subscription.refreshed');
        await refreshDashboard();
      } catch (error) {
        showToast(error?.message || t('toast.subscription.refreshUnavailable'), 'error');
      }
    });
  }

  document.querySelectorAll('[data-empty-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.emptyAction;
      if (action === 'notes') {
        setActiveView('notes');
        return;
      }
      if (action === 'note-editor') {
        setActiveView('notes');
        openFocusedNote(null);
        return;
      }
      if (action === 'dictionary') {
        setActiveView('dictionary');
        dictionaryWordInput?.focus();
        return;
      }
      if (action === 'snippets') {
        setActiveView('snippets');
        snippetCueInput?.focus();
        return;
      }
      if (action === 'styles') {
        refreshDashboard();
      }
    });
  });

  if (statNotesCard) {
    statNotesCard.addEventListener('click', () => {
      setActiveView('notes');
    });
  }

  if (createNoteButton) {
    createNoteButton.addEventListener('click', handleCreateNote);
  }

  document.querySelectorAll('.win-control').forEach((control) => {
    const action = control.dataset.windowControl;
    if (!action) {
      return;
    }
    control.addEventListener('click', () => {
      if (window.electronAPI?.sendWindowControl) {
        window.electronAPI.sendWindowControl(action);
      }
    });
  });

  settingsInputs.forEach((input) => input.addEventListener('change', handleSettingChange));

  if (insightsRange) {
    insightsRange.value = String(insightsRangeDays);
    insightsRange.addEventListener('change', () => {
      const parsed = Number.parseInt(insightsRange.value, 10);
      insightsRangeDays = Number.isFinite(parsed) ? parsed : 30;
      insightsData = computeInsightsFromHistoryLocal(historyData, insightsRangeDays);
      renderInsights(insightsData);
    });
  }

  if (notificationsRefresh) {
    notificationsRefresh.addEventListener('click', async () => {
      if (!window.electronAPI?.refreshNotifications) {
        showToastKey('toast.notifications.unavailable', 'error');
        return;
      }
      await window.electronAPI.refreshNotifications();
      await refreshDashboard();
    });
  }

  if (crocOmniSearchInput) {
    const applySearch = () => {
      searchTerm = crocOmniSearchInput.value?.trim() || '';
      refreshActiveList();
    };
    crocOmniSearchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        applySearch();
      }
    });
    crocOmniSearchInput.addEventListener('input', () => {
      applySearch();
    });
  }

  if (crocOmniSearchSource) {
    crocOmniSearchSource.addEventListener('change', () => {
      if (crocOmniSearchInput?.value?.trim()) {
        runCrocOmniSearch();
      }
    });
  }

  if (crocOmniSearchRange) {
    crocOmniSearchRange.addEventListener('change', () => {
      if (crocOmniSearchInput?.value?.trim()) {
        runCrocOmniSearch();
      }
    });
  }

  if (crocOmniAnswerButton) {
    crocOmniAnswerButton.addEventListener('click', () => runCrocOmniAnswer());
  }

  if (crocOmniAiReplyToggle) {
    crocOmniAiReplyToggle.addEventListener('change', (event) => {
      const crocOmniSettings = { ...(currentSettings.crocOmni || {}) };
      crocOmniSettings.aiReplyEnabled = Boolean(event.target.checked);
      if (!crocOmniSettings.aiReplyEnabled) {
        crocOmniSettings.aiReplyIncludeSensitive = false;
      }
      updateCrocOmniSettings({ crocOmni: crocOmniSettings });
      applyCrocOmniSettings(currentSettings);
    });
  }

  if (crocOmniAiSensitiveToggle) {
    crocOmniAiSensitiveToggle.addEventListener('change', (event) => {
      const crocOmniSettings = { ...(currentSettings.crocOmni || {}) };
      crocOmniSettings.aiReplyIncludeSensitive = Boolean(event.target.checked);
      updateCrocOmniSettings({ crocOmni: crocOmniSettings });
      applyCrocOmniSettings(currentSettings);
    });
  }

  if (crocOmniComposer) {
    crocOmniComposer.addEventListener('input', () => syncCrocOmniComposerState());
    crocOmniComposer.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendCrocOmniMessage();
      }
    });
  }

  if (crocOmniSendButton) {
    crocOmniSendButton.addEventListener('click', () => sendCrocOmniMessage());
  }

  if (crocOmniNewConversation) {
    crocOmniNewConversation.addEventListener('click', () => createCrocOmniConversation());
  }

  if (crocOmniCreateButton) {
    crocOmniCreateButton.addEventListener('click', () => createCrocOmniConversation());
  }

  if (crocOmniConversationEmpty) {
    const emptyAction = crocOmniConversationEmpty.querySelector('.empty-action');
    if (emptyAction) {
      emptyAction.addEventListener('click', () => createCrocOmniConversation());
    }
  }

  if (crocOmniClearConversation) {
    crocOmniClearConversation.addEventListener('click', () => clearCrocOmniConversation());
  }

  if (shortcutInput) {
    shortcutInput.addEventListener('focus', () => {
      shortcutBeforeCapture = shortcutInput.value || currentSettings.shortcut || '';
      setShortcutCaptureState(true);
      shortcutInput.value = 'Appuyez sur les touches...';
    });
    shortcutInput.addEventListener('blur', () => {
      if (!shortcutCaptureActive) {
        return;
      }
      setShortcutCaptureState(false);
      renderSettings(currentSettings);
    });
    shortcutInput.addEventListener('keydown', async (event) => {
      if (!shortcutCaptureActive) {
        return;
      }
      if (event.repeat) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      if (event.key === 'Escape') {
        setShortcutCaptureState(false);
        shortcutInput.value = shortcutBeforeCapture;
        shortcutInput.blur();
        return;
      }

      if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) {
        return;
      }

      const accelerator = buildAcceleratorFromEvent(event);
      if (!accelerator) {
        if (!shortcutInvalidShown) {
          showToastKey('toast.shortcut.invalid', 'error');
          shortcutInvalidShown = true;
        }
        return;
      }

      setShortcutCaptureState(false);
      shortcutInput.value = accelerator;
      shortcutInput.blur();
      await saveShortcut(accelerator);
    });
  }

  if (shortcutResetButton) {
    shortcutResetButton.addEventListener('click', async () => {
      await saveShortcut(getDefaultShortcut());
    });
  }

  if (syncNowButton) {
    syncNowButton.addEventListener('click', async () => {
      if (!window.electronAPI?.syncNow) {
        showToastKey('toast.sync.unavailable', 'error');
        return;
      }
      syncNowButton.disabled = true;
      syncNowButton.classList.add('is-loading');
      setSyncStatusMessage(t('sync.status.inProgress'));
      try {
        const result = await window.electronAPI.syncNow();
        if (result?.ok) {
          showToastKey('toast.sync.completed');
          setSyncStatusMessage(t('sync.status.completed'), 'ok');
        } else if (result?.reason === 'not_authenticated') {
          showToastKey('toast.sync.authRequired', 'error');
          setSyncStatusMessage(t('sync.status.authRequired'), 'error');
        } else if (result?.reason === 'not_configured') {
          showToastKey('toast.sync.notConfigured', 'error');
          setSyncStatusMessage(t('sync.status.notConfigured'), 'error');
        } else {
          showToastKey('toast.sync.failed', 'error');
          setSyncStatusMessage(t('sync.status.failed'), 'error');
        }
      } catch (error) {
        showToastKey('toast.sync.failed', 'error');
        setSyncStatusMessage(t('sync.status.failed'), 'error');
      } finally {
        syncNowButton.disabled = false;
        syncNowButton.classList.remove('is-loading');
      }
    });
  }

  if (misspellingToggle) {
    misspellingToggle.addEventListener('change', (event) => {
      if (dictionaryCorrectionInput) {
        dictionaryCorrectionInput.style.display = event.target.checked ? 'block' : 'none';
        if (!event.target.checked) {
          dictionaryCorrectionInput.value = '';
        }
      }
    });
  }

  if (dictionaryAddButton) {
    dictionaryAddButton.addEventListener('click', async () => {
      const word = dictionaryWordInput?.value.trim();
      if (!word) {
        showToastKey('toast.dictionary.enterWord', 'error');
        return;
      }
      const duplicate = (dictionaryData || []).some((entry) =>
        entry.from_text && entry.from_text.trim().toLowerCase() === word.toLowerCase()
      );
      if (duplicate) {
        showToastKey('toast.dictionary.duplicate', 'error');
        return;
      }
      const correction = misspellingToggle?.checked ? dictionaryCorrectionInput?.value.trim() : word;
      if (misspellingToggle?.checked && !correction) {
        showToastKey('toast.dictionary.enterCorrection', 'error');
        return;
      }
      await window.electronAPI.upsertDictionary({ from_text: word, to_text: correction });
      showToastKey('toast.dictionary.added', 'success', { word });
      if (dictionaryWordInput) {
        dictionaryWordInput.value = '';
      }
      if (dictionaryCorrectionInput) {
        dictionaryCorrectionInput.value = '';
      }
      await refreshDashboard();
    });
  }

  if (dictionaryCancelButton) {
    dictionaryCancelButton.addEventListener('click', () => {
      if (dictionaryWordInput) {
        dictionaryWordInput.value = '';
      }
      if (dictionaryCorrectionInput) {
        dictionaryCorrectionInput.value = '';
      }
      if (misspellingToggle) {
        misspellingToggle.checked = false;
      }
      if (dictionaryCorrectionInput) {
        dictionaryCorrectionInput.style.display = 'none';
      }
    });
  }

  if (contextEnabledToggle) {
    contextEnabledToggle.addEventListener('change', async () => {
      const contextSettings = getContextSettingsLocal();
      if (contextEnabledToggle.checked && !contextSettings.screenshotConsentAsked) {
        const consent = await openContextScreenshotConsent();
        if (!consent) {
          contextEnabledToggle.checked = false;
          return;
        }
        const nextSignals = { ...(contextSettings.signals || {}), screenshot: Boolean(consent.screenshot) };
        await saveContextSettings({
          ...contextSettings,
          enabled: true,
          signals: nextSignals,
          screenshotConsentAsked: true,
        });
        await refreshDashboard();
        return;
      }
      await saveContextSettings({ ...contextSettings, enabled: contextEnabledToggle.checked });
      await refreshDashboard();
    });
  }
  if (contextPostProcessToggle) {
    contextPostProcessToggle.addEventListener('change', async () => {
      const contextSettings = getContextSettingsLocal();
      await saveContextSettings({ ...contextSettings, postProcessEnabled: contextPostProcessToggle.checked });
    });
  }

  const contextSignalMap = [
    ['app', contextSignalApp],
    ['window', contextSignalWindow],
    ['url', contextSignalUrl],
    ['ax', contextSignalAx],
    ['textbox', contextSignalTextbox],
    ['screenshot', contextSignalScreenshot],
  ];
  contextSignalMap.forEach(([key, el]) => {
    if (!el) {
      return;
    }
    el.addEventListener('change', async () => {
      const contextSettings = getContextSettingsLocal();
      const nextSignals = { ...(contextSettings.signals || {}), [key]: el.checked };
      const nextSettings = { ...contextSettings, signals: nextSignals };
      if (key === 'screenshot' && !contextSettings.screenshotConsentAsked) {
        nextSettings.screenshotConsentAsked = true;
      }
      await saveContextSettings(nextSettings);
      await refreshDashboard();
    });
  });

  if (contextRetentionSave) {
    contextRetentionSave.addEventListener('click', async () => {
      const value = Number.parseInt(contextRetentionInput?.value || '30', 10);
      if (!Number.isFinite(value) || value <= 0) {
        showToastKey('toast.context.invalidRetention', 'error');
        return;
      }
      const contextSettings = getContextSettingsLocal();
      await saveContextSettings({ ...contextSettings, retentionDays: value });
      showToastKey('toast.context.retentionUpdated');
    });
  }

  if (contextDeleteAll) {
    contextDeleteAll.addEventListener('click', async () => {
      if (!window.electronAPI?.clearContext) {
        return;
      }
      await window.electronAPI.clearContext();
      showToastKey('toast.context.cleared');
    });
  }

  if (contextOverrideMode) {
    contextOverrideMode.addEventListener('change', async () => {
      const contextId = dashboardData?.context?.contextId || '';
      await updateContextOverride(contextId, contextOverrideMode.value, contextOverrideProfile?.value || '');
    });
  }

  if (contextOverrideProfile) {
    contextOverrideProfile.addEventListener('change', async () => {
      const contextId = dashboardData?.context?.contextId || '';
      await updateContextOverride(contextId, contextOverrideMode?.value || 'inherit', contextOverrideProfile.value || '');
    });
  }

  const overrideSignalElements = [
    ['app', contextOverrideSignalApp],
    ['window', contextOverrideSignalWindow],
    ['url', contextOverrideSignalUrl],
    ['ax', contextOverrideSignalAx],
    ['textbox', contextOverrideSignalTextbox],
    ['screenshot', contextOverrideSignalScreenshot],
  ];
  overrideSignalElements.forEach(([, el]) => {
    if (!el) {
      return;
    }
    el.addEventListener('change', async () => {
      const contextId = dashboardData?.context?.contextId || '';
      const signals = {
        app: Boolean(contextOverrideSignalApp?.checked),
        window: Boolean(contextOverrideSignalWindow?.checked),
        url: Boolean(contextOverrideSignalUrl?.checked),
        ax: Boolean(contextOverrideSignalAx?.checked),
        textbox: Boolean(contextOverrideSignalTextbox?.checked),
        screenshot: Boolean(contextOverrideSignalScreenshot?.checked),
      };
      await updateContextOverride(contextId, contextOverrideMode?.value || 'inherit', contextOverrideProfile?.value || '', signals);
    });
  });

  if (contextSuggestionApply) {
    contextSuggestionApply.addEventListener('click', async () => {
      const contextId = dashboardData?.context?.contextId || '';
      const suggestionId = dashboardData?.context?.suggestionId || '';
      if (!suggestionId) {
        return;
      }
      await updateContextOverride(contextId, 'on', suggestionId);
    });
  }

  if (contextProfileCreate) {
    contextProfileCreate.addEventListener('click', async () => {
      const res = await openModal({
        title: 'Nouveau profil',
        confirmText: 'Créer',
        fields: [
          { key: 'name', label: 'Nom', value: '' },
          { key: 'appName', label: 'Match App (contient)', value: '' },
          { key: 'windowTitle', label: 'Match Fenêtre (contient)', value: '' },
          { key: 'urlDomain', label: 'Match URL (contient)', value: '' },
          {
            key: 'tone',
            label: 'Tone',
            type: 'select',
            value: 'default',
            options: [
              { value: 'default', label: 'Default' },
              { value: 'concise', label: 'Concise' },
              { value: 'conversational', label: 'Conversational' },
            ],
          },
          {
            key: 'lineBreaks',
            label: 'Line breaks',
            type: 'select',
            value: 'auto',
            options: [
              { value: 'auto', label: 'Auto' },
              { value: 'single', label: 'Single' },
              { value: 'double', label: 'Double' },
            ],
          },
          {
            key: 'punctuation',
            label: 'Punctuation',
            type: 'select',
            value: 'minimal',
            options: [
              { value: 'minimal', label: 'Minimal' },
              { value: 'standard', label: 'Standard' },
            ],
          },
        ],
      });
      if (!res || !res.name) {
        return;
      }
      const profiles = getContextProfilesLocal();
      const profile = {
        id: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : `${Date.now()}`,
        name: res.name,
        match: {
          appName: res.appName || '',
          windowTitle: res.windowTitle || '',
          urlDomain: res.urlDomain || '',
        },
        tone: res.tone || 'default',
        formatting: {
          lineBreaks: res.lineBreaks || 'auto',
          punctuation: res.punctuation || 'minimal',
        },
      };
      const nextProfiles = [profile, ...profiles];
      await saveContextProfiles(nextProfiles);
      await refreshDashboard();
      showToastKey('toast.profile.created');
    });
  }

  if (contextPreviewButton) {
    contextPreviewButton.addEventListener('click', async () => {
      const profileId = contextPreviewProfile?.value || '';
      const input = contextPreviewInput?.value || '';
      if (!profileId) {
        showToastKey('toast.profile.selectRequired', 'error');
        return;
      }
      if (!window.electronAPI?.previewContextFormatting) {
        return;
      }
      const result = await window.electronAPI.previewContextFormatting(profileId, input);
      if (contextPreviewOutput) {
        contextPreviewOutput.value = result?.text || '';
      }
    });
  }

  if (snippetAddButton) {
    snippetAddButton.addEventListener('click', async () => {
      const cue = snippetCueInput?.value.trim();
      const template = snippetTemplateInput?.value.trim();
      const description = snippetDescriptionInput?.value.trim() || '';
      if (!cue) {
        showToastKey('toast.snippet.enterCue', 'error');
        return;
      }
      if (!template) {
        showToastKey('toast.snippet.enterTemplate', 'error');
        return;
      }
      const cueNorm = normalizeSnippetCue(cue);
      const duplicate = (snippetsData || []).some((entry) =>
        normalizeSnippetCue(entry.cue) === cueNorm
      );
      if (duplicate) {
        showToastKey('toast.snippet.duplicate', 'error');
        return;
      }
      await window.electronAPI.upsertSnippet({ cue, template, description });
      showToastKey('toast.snippet.added');
      if (snippetCueInput) {
        snippetCueInput.value = '';
      }
      if (snippetTemplateInput) {
        snippetTemplateInput.value = '';
      }
      if (snippetDescriptionInput) {
        snippetDescriptionInput.value = '';
      }
      await refreshDashboard();
    });
  }

  if (snippetCancelButton) {
    snippetCancelButton.addEventListener('click', () => {
      if (snippetCueInput) {
        snippetCueInput.value = '';
      }
      if (snippetTemplateInput) {
        snippetTemplateInput.value = '';
      }
      if (snippetDescriptionInput) {
        snippetDescriptionInput.value = '';
      }
    });
  }

  if (authOverlayForm) {
    authOverlayForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await submitAuthLogin();
    });
  }
  if (authOverlaySignup) {
    authOverlaySignup.addEventListener('click', async () => {
      if (window.electronAPI?.openSignupUrl) {
        setButtonLoading(authOverlaySignup, true, t('common.opening'));
        const result = await window.electronAPI.openSignupUrl('signup');
        if (result?.ok === false) {
          setOverlayStatus(t('common.openFailed'), true);
        }
        setButtonLoading(authOverlaySignup, false);
      }
    });
  }
  if (authOverlayRetry) {
    authOverlayRetry.addEventListener('click', async () => {
      if (window.electronAPI?.authRetry) {
        setOverlayStatus(t('auth.retrying'), false);
        await window.electronAPI.authRetry();
      }
    });
  }

  if (window.electronAPI?.onDashboardTranscription) {
    window.electronAPI.onDashboardTranscription((text, target) => {
      if (target === 'notes') {
        const add = (text || '').trim();
        if (!add) {
          return;
        }
        showToastKey('toast.noteAdded');
        refreshDashboard();
        return;
      }

      if (target === 'onboarding') {
        onboardingRecordingActive = false;
        if (onboardingDictateButton) {
          onboardingDictateButton.textContent = t('onboarding.dictation.cta');
        }
        const add = (text || '').trim();
        if (!add) {
          setOnboardingStatus(onboardingDictationStatus, t('onboarding.dictation.noAudio'), 'error');
          return;
        }
        if (onboardingSandbox) {
          onboardingSandbox.value = add;
        }
        onboardingState = { ...onboardingState, firstRunSuccess: true };
        onboardingDeliveryReady = onboardingDeliveryReady || false;
        setOnboardingStatus(onboardingDictationStatus, t('onboarding.dictation.received'), 'success');
        if (onboardingSuccessBadge) {
          onboardingSuccessBadge.classList.add('active');
        }
        updateOnboardingChecklist();
        updateOnboardingUI();
        persistOnboardingState({ firstRunSuccess: true });
      }
    });
  }

  if (window.electronAPI?.onDashboardDiff) {
    window.electronAPI.onDashboardDiff((payload) => {
      diffData = {
        before: payload?.before || '',
        after: payload?.after || '',
      };
      setActiveView('diff');
    });
  }

  if (window.electronAPI?.onDashboardTranscriptionError) {
    window.electronAPI.onDashboardTranscriptionError((error) => {
      if (onboardingRecordingActive) {
        const message = typeof error === 'string' ? error : error?.message;
        onboardingRecordingActive = false;
        if (onboardingDictateButton) {
          onboardingDictateButton.textContent = t('onboarding.dictation.cta');
        }
        setOnboardingStatus(onboardingDictationStatus, message || t('onboarding.dictation.failed'), 'error');
      }
    });
  }

  if (window.electronAPI?.getAuthState) {
    window.electronAPI.getAuthState().then(applyAuthState).catch(() => applyAuthState({ status: 'error' }));
  }
  if (window.electronAPI?.onAuthState) {
    window.electronAPI.onAuthState(applyAuthState);
  }
  if (window.electronAPI?.onAuthRequired) {
    window.electronAPI.onAuthRequired((msg) => applyAuthState({ status: 'unauthenticated', message: msg }));
  }

  if (window.electronAPI?.onDashboardDataUpdated) {
    window.electronAPI.onDashboardDataUpdated(() => {
      if (shouldSuppressDashboardRefresh()) {
        return;
      }
      refreshDashboard();
    });
  }
  if (window.electronAPI?.onCrocOmniStream) {
    window.electronAPI.onCrocOmniStream((payload) => handleCrocOmniStream(payload));
  }

  if (window.electronAPI?.onMicrophonesUpdated) {
    window.electronAPI.onMicrophonesUpdated((payload) => {
      populateMicrophones(payload);
    });
  }

  if (window.electronAPI?.onSettingsUpdated) {
    window.electronAPI.onSettingsUpdated((nextSettings) => {
      currentSettings = nextSettings || currentSettings;
      applyDashboardLanguage(currentSettings);
      applyOnboardingStateFromSettings(currentSettings);
      renderSettings(currentSettings);
      applyPolishEntryState(currentSettings);
      applyCrocOmniSettings(currentSettings);
      populateMicrophones();
    });
  }

  refreshDashboard();
});
