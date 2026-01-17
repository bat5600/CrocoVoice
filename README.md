# 🎙️ CrocoVoice

Application de bureau Electron pour la dictée vocale rapide avec transcription Whisper.

## 🚀 Fonctionnalités

- **Raccourci Global** : Démarrez/arrêtez la dictée via un raccourci global configurable
- **Feedback Visuel** : Fenêtre flottante minimaliste pendant l'enregistrement
- **Transcription IA** : Utilise OpenAI Whisper pour une transcription précise
- **Frappe Automatique** : Le texte transcrit est automatiquement tapé à la position du curseur
- **System Tray** : L'application tourne en arrière-plan avec une icône dans la barre système
- **Paramètres** : Langue + raccourci via le dashboard
- **Sync Cloud** : Synchronisation via Supabase + cache local SQLite (flow.sqlite)

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Clé API OpenAI (obtenez-la sur [platform.openai.com](https://platform.openai.com/api-keys))

## 🛠️ Installation

1. **Clonez ou téléchargez le projet**

2. **Installez les dépendances**
```bash
npm install
```

3. **Configurez votre clé API**
```bash
cp .env.example .env
```
Puis éditez le fichier `.env` et ajoutez votre clé API OpenAI :
```
OPENAI_API_KEY=votre_cle_api_ici
```
Options supplémentaires :
```
CROCOVOICE_LANGUAGE=fr
CROCOVOICE_SHORTCUT=Ctrl+Shift+R
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_anon_key
```

## ▶️ Lancement

```bash
npm start
```

## 📖 Utilisation

1. Lancez l'application avec `npm start`
2. L'application apparaît dans la barre système (System Tray)
3. Utilisez le raccourci global pour démarrer la dictée (configurable dans Settings)
4. Une fenêtre flottante apparaît pour indiquer que l'enregistrement est en cours
5. Relâchez les touches ou ré-appuyez sur le raccourci pour arrêter l'enregistrement
6. Le texte transcrit est automatiquement tapé à la position de votre curseur

## 🏗️ Structure du Projet

```
CrocoVoice/
├── main.js           # Processus principal Electron (raccourcis, IPC, API)
├── renderer.js       # Processus de rendu (MediaRecorder, interface)
├── preload.js        # Bridge sécurisé pour IPC
├── index.html        # Interface principale (widget)
├── dashboard.html    # Dashboard (settings, historique, dictionnaire, sync)
├── dashboard.js      # Logique dashboard
├── assets/           # Icônes et ressources statiques
├── docs/             # Documentation produit/tech
├── supabase/         # Schéma SQL pour la synchro cloud
├── tools/            # Outils et bundles internes
├── package.json      # Dépendances et scripts
├── .env.example      # Template de configuration
└── README.md         # Documentation
```

## 🔧 Technologies Utilisées

- **Electron** : Framework pour applications de bureau
- **OpenAI Whisper** : API de transcription vocale
- **@nut-tree-fork/nut-js** : Automatisation clavier multiplateforme (fork gratuit de nut-js)
- **MediaRecorder API** : Enregistrement audio natif du navigateur

> **Note** : Le paquet original `@nut-tree/nut-js` est devenu payant. Ce projet utilise le fork gratuit `@nut-tree-fork/nut-js` qui maintient la même API.

## ⚠️ Notes Importantes

- **Permissions Microphone** : L'application nécessite l'accès au microphone
- **Clé API** : Assurez-vous que votre clé API OpenAI est valide et a des crédits disponibles
- **Sécurité** : Ne partagez jamais votre fichier `.env` contenant votre clé API

## 🔐 Auth Supabase & paywall

- L'app affiche un ecran de login tant qu'une session Supabase valide n'est pas confirmee.
- En cas d'erreur reseau, un message de retry et un mode lecture seule sont proposes, les fonctions premium restent verrouillees.
- Le CTA "Creer un compte" ouvre la landing interne (`docs/signup.html`) puis redirige vers l'URL definie par `AUTH_SIGNUP_URL` ou `config/auth.json`.

## 🐛 Dépannage

### L'enregistrement ne démarre pas
- Vérifiez que vous avez accordé les permissions microphone à l'application
- Vérifiez que votre clé API OpenAI est correctement configurée dans `.env`

### Le texte n'est pas tapé automatiquement
- Vérifiez que l'application a les permissions nécessaires pour contrôler le clavier
- Sur macOS, vous devrez peut-être accorder l'accès dans Préférences Système > Sécurité et confidentialité > Accessibilité

### Erreur de transcription
- Vérifiez votre connexion Internet
- Vérifiez que votre clé API OpenAI est valide et a des crédits disponibles

## 🔄 Alternatives

Si `@nut-tree-fork/nut-js` ne fonctionne pas correctement, vous pouvez utiliser `robotjs` à la place :

1. Remplacez dans `package.json` :
```json
"@nut-tree-fork/nut-js": "^4.1.0"
```
par :
```json
"robotjs": "^0.6.0"
```

2. Dans `main.js`, remplacez :
```javascript
const { keyboard } = require('@nut-tree-fork/nut-js');
```
par :
```javascript
const robot = require('robotjs');
```

3. Dans la fonction `typeText()`, remplacez :
```javascript
await keyboard.config.autoDelayMs(50);
await keyboard.type(text);
```
par :
```javascript
robot.setKeyboardDelay(50);
robot.typeString(text);
```

> **Note** : `robotjs` nécessite des outils de build natifs (Python, Visual Studio Build Tools sur Windows, Xcode sur macOS).

## 📝 Licence

MIT
