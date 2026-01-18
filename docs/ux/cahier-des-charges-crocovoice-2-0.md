# Cahier des Charges UX/UI — CrocoVoice 2.0 (SaaS Premium)

## 1. Introduction
Ce document definit la nouvelle direction artistique et l'experience utilisateur pour l'interface "CrocoVoice 2.0". L'objectif est de passer d'un utilitaire fonctionnel a une experience SaaS Premium, sophistiquee et immersive.

### Objectifs UX & Principes Cles
#### Personas Cibles
- **Le "Creator" Moderne** : Entrepreneur, createur de contenu ou cadre sup qui utilise des outils comme Linear, Raycast ou Notion. Il attend une esthetique irreprochable et une fluidite absolue.
- **Le Power User** : Cherche la rapidite d'execution, des raccourcis clavier, et une interface qui ne le ralentit pas.

#### Principes de Design (Le "Whaouh Effect")
- **Sophistication Visuelle** : Utilisation de la profondeur (ombres portees, flous), de la transparence (glassmorphism) et de degrades subtils (mesh gradients) pour creer une interface vivante.
- **Hierarchie par le Contraste** : Pas de surcharge. Le contenu est roi sur fond clair, encadre par une navigation sombre et ancree.
- **Micro-Interactions** : L'interface doit reagir. Chaque survol, chaque clic doit declencher une reponse visuelle satisfaisante (levitation des cartes, apparition des outils).
- **"Less is More"** : Masquer la complexite. Les actions secondaires (editer, supprimer) n'apparaissent qu'au survol pour reduire le bruit visuel.

## 2. Identite Visuelle (Style Guide)
### Palette de Couleurs "Modern Croco"
L'identite "Croco" est reinterpretee de maniere moderne : exit le vert plat, place a des emeraudes vibrants et des noirs profonds teintes de vert.

| Token | Hex | Usage |
| --- | --- | --- |
| Primary | #1E9E6A (Emerald) | Boutons d'action, etats actifs, accents forts. |
| Primary Surface | #E6F7F0 | Fonds de badges, survols legers. |
| Background Body | #F8FAFC | Fond global de l'application (gris tres froid). |
| Background Sidebar | #051B15 | Navigation laterale ("Deep Swamp" - noir teinte vert). |
| Text Main | #064E3B | Titres, donnees principales (vert tres sombre). |
| Text Muted | #64748B | Metadonnees, labels secondaires. |
| Text On Dark | #ECFDF5 | Texte dans la sidebar. |
| Accent Lime | #84CC16 | Utilise dans les degrades (mesh gradients) pour la lumiere. |

### Typographie
- **Famille** : Plus Jakarta Sans (fallback Inter).
- **Pourquoi** : Moderne, precise, plus premium et alignee au branding CrocoVoice.
- **Echelle** :
  - H1 (Display) : 36-44px, ExtraBold (800).
  - H2 (Section) : 20-22px, Bold (700).
  - Body : 14-16px, Medium (500) pour la lisibilite.
  - Small : 12px, Regular (400) pour les metadonnees.

### Effets & Ombres (Depth System)
- **Glassmorphism** : backdrop-filter: blur(12px) + fond blanc a 85% d'opacite. Utilise pour le Sticky Header.
- **Shadow Float** : 0 20px 25px -5px rgba(0, 50, 20, 0.05). Pour faire leviter les cartes au survol (teinte vert).
- **Glow** : box-shadow: 0 0 15px rgba(30, 158, 106, 0.4). Autour du logo ou des elements actifs majeurs.

## 3. Architecture de l'Information & Layout
### Structure Globale : "Split View"
L'ecran est divise en deux zones distinctes pour ancrer la navigation.

#### Sidebar (Fixe - Gauche - Sombre)
- Contient l'identite (Logo Glow Vert).
- Menu de navigation principal (Dashboard, Dictionary, Style, Settings).
- Profil utilisateur en bas.
- **Comportement** : Fixe, hauteur 100vh. Couleur "Deep Swamp".

#### Main Content (Scrollable - Droite - Clair)
- Contient tout le contenu operationnel.
- **Sticky Header** : Barre superieure en verre (Glass) qui reste fixe au scroll, contenant le fil d'Ariane et la recherche globale.

### Navigation
#### Menu Items
- **Etat inactif** : Gris vert pale, fond transparent.
- **Etat actif** : Texte Emerald vibrant, fond degrade subtil, barre laterale lumineuse ("Glow bar") a gauche.
- **Hover** : Eclaircissement leger vers le vert menthe.

## 4. Composants Cles (UI Kit)
### A. Stats Cards (Cartes Metriques)
- **Design** : Carte blanche, bordure fine grise.
- **Contenu** : Gros chiffre (Inter 800) + Label + Icone dans un carre vert pale.
- **Interaction "Hover Lift"** : Au survol, la carte remonte de 5px (translateY), l'ombre s'intensifie, et l'icone devient Emerald vibrant avec une legere rotation.

### B. Mesh Gradient Banner
- **Usage** : Mises en avant (ex : "Year in Review").
- **Design** : Fond blanc avec des taches de couleurs floues (Emerald, Lime, Teal) generees par radial-gradient. Cree une ambiance "nature tech".
- **Bouton** : Style "Outline" (fond blanc, bordure transparente, texte vert) pour ne pas alourdir.

### C. Smart List Rows (Liste des Notes)
- **Probleme resolu** : Eviter l'effet "feuille de calcul" dense.
- **Design** : Lignes espacees, coins arrondis individuels pour chaque ligne.
- **Comportement "Ghost Actions"** :
  - Par defaut : On ne voit que le titre, l'extrait et la date.
  - Au survol : La ligne devient blanche avec une ombre portee (effet "Pop out"). Les boutons d'action (Play, Edit, Delete) apparaissent a droite (opacity: 0 -> 1) en vert.

### D. Modales
- **Style** : Centrees, fond blanc pur, coins tres arrondis (24px).
- **Backdrop** : Fond "Deep Swamp" floute (blur(8px)) pour isoler l'attention sur la tache en cours.

### E. Toasts (Notifications Flottantes)
- **Design** : Cartes flottantes en bas a droite, icone + titre + message.
- **Comportement** : Slide-in avec easing doux, auto-dismiss 4-5s, click pour fermer.
- **Usage** : Remplace les messages d'etat inline (creation, suppression, erreurs).

### F. Empty States
- **Design** : Illustration SVG, titre court, message d'aide, CTA unique.
- **Comportement** : Le CTA focus l'action principale (creer une note, ajouter un terme).

### G. Editeur Hybride (Markdown)
- **Design** : Barre d'outils minimaliste (Gras, Italique, Liste) + textarea.
- **Comportement** : Applique des tokens Markdown autour de la selection.

### H. Feedback Dictée
- **Design** : Pulse autour du bouton dictée + barres audio animees.
- **Comportement** : Visible uniquement pendant l'enregistrement.

### I. Preview Styles
- **Design** : Bloc "Avant / Apres" dans chaque carte de style.
- **Comportement** : Exemple concret pour faciliter le choix.

## 5. Experience Utilisateur (UX Flows)
### Flow : Navigation & Recherche
- L'utilisateur scrolle dans sa liste de notes.
- Le Header reste colle en haut de l'ecran avec un effet de flou sur le contenu qui passe dessous.
- La barre de recherche est toujours accessible. Au focus, elle s'elargit legerement et la bordure devient Emerald (Focus Ring).

### Flow : Gestion des Notes
- L'utilisateur survole une note recente.
- La note se "detache" visuellement (legere ombre).
- Les outils apparaissent.
- Clic sur "Edit" -> Une modale s'ouvre avec une animation fluide (scale 0.95 -> 1). Le fond se floute.

## 6. Accessibilite & Performance
- **Contraste** : Le texte gris (#64748B) doit etre utilise uniquement pour les informations secondaires. Le texte principal (#064E3B) assure un ratio de contraste fort sur fond clair.
- **Animations** : Toutes les animations (hover, modales) doivent utiliser des courbes de Bezier (cubic-bezier) pour un rendu naturel, et etre desactivables via prefers-reduced-motion.
- **Focus States** : Tous les champs de formulaire et boutons doivent avoir un focus-visible clair (anneau Emerald) pour la navigation au clavier.

## 7. Checklist d'Implementation (Dev)
1. Configurer les variables CSS (Root) avec la nouvelle palette Modern Croco (Emerald/Deep Swamp).
2. Mettre en place la grille CSS : Sidebar fixe (270px) + Main Content (flex 1).
3. Creer l'effet Glassmorphism pour le Header (backdrop-filter).
4. Implementer les hover effects complexes sur les Stats Cards et les List Rows.
5. Integrer la police Inter (weights: 400, 500, 600, 700, 800) et Plus Jakarta Sans.
6. Verifier que les degrades (Mesh Gradients) verts/lime sont performants.

## 8. Implementation Dashboard (Reference)
- **Fichier cible** : `dashboard.html`.
- **Structure** : Sidebar sombre fixe (270px), contenu principal clair scrollable, sticky header glassmorphism.
- **Composants cles** : Stats Cards avec hover lift, Mesh Gradient Banner, Smart List Rows avec Ghost Actions, modale floutee.
- **Interactions** : focus ring emerald sur la recherche, hover lift + rotation d'icone sur les cartes, apparition des actions au survol dans la liste.
