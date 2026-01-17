# CrocoVoice 2.0 UI/UX Specification (Premium SaaS)

## Introduction

This document defines the updated user experience goals, information architecture, user flows, and visual design system for CrocoVoice 2.0. The objective is to move from a functional utility to a premium, immersive SaaS experience.

### Overall UX Goals & Principles

#### Target User Personas
- **Modern Creator:** Entrepreneur, content creator, or executive who uses Linear/Raycast/Notion and expects impeccable aesthetics and flow.
- **Power User:** Demands speed, keyboard shortcuts, and zero friction.

#### Design Principles (The "Whaouh Effect")
1. **Visual sophistication** - Depth, glassmorphism, and subtle mesh gradients create a living interface.
2. **Hierarchy by contrast** - Content on a bright canvas, anchored by a dark, fixed navigation.
3. **Reactive micro-interactions** - Hover and click responses feel satisfying and intentional.
4. **Less is more** - Secondary actions appear only on hover to reduce noise.

### Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-15 | v0.1 | Initial UX spec draft | UX Expert |
| 2026-02-01 | v0.2 | Premium SaaS redesign direction | UX Expert |

## Information Architecture (IA)

### Layout Structure: Split View
- **Sidebar (Fixed, Left, Dark):** Logo with glow, primary navigation, user profile anchored at bottom.
- **Main Content (Scrollable, Right, Light):** Operational content with a sticky glass header.

### Navigation Structure
- **Primary Navigation:** Sidebar items (Dashboard, Dictionary, Style, Settings).
- **Active State:** Emerald text, subtle gradient background, left glow bar.
- **Hover State:** Mint-tinted brightening.

### Dashboard Implementation Notes
- **Reference file:** `dashboard.html`.
- **Structure:** Fixed dark sidebar, glass sticky header, and a scrollable light content column.
- **Key components:** Stats Cards with hover lift, Mesh Gradient Banner, Smart List Rows with ghost actions, and a blurred modal.

## User Flows

### Navigation & Search Flow
**User Goal:** Find and open content quickly while staying oriented.

**Key Behaviors:**
- Sticky header stays fixed with glass blur over scrolling content.
- Search is always visible; on focus it expands slightly and shows an emerald focus ring.

### Notes Management Flow
**User Goal:** Organiser les notes manuelles et l’historique en deux contextes distincts.

**Key Behaviors:**
- Un nouvel onglet “Notes” dans la sidebar ouvre une vue autonome avec un formulaire (titre facultatif + corps) et la liste des notes sauvegardées ; chaque création appelle `notes:add` côté serveur.
- Le champ de recherche global reste au sommet et filtre la liste affichée : l’historique dans la vue Dashboard, les notes dans la vue Notes.
- Les lignes (History ou Notes) présentent une étiquette date/heure, un titre généré par l’IA (si besoin), les transcriptions multi-lignes et les actions “Copy”/“Delete” visibles.
- Le formulaire propose un bouton “Dictée vocale” qui active le widget de transcription ; une fois la séance arrêtée, le texte transcrit est injecté dans le champ de contenu.

## Component Library / Design System

### Core Components

#### Stats Card
**Design:** White card with thin border, large number (Inter 800), label, and icon in a pale-green square.  
**Hover Lift:** translateY(-5px), stronger green-tinted shadow, icon turns emerald with slight rotation.

#### Mesh Gradient Banner
**Usage:** Highlights such as "Year in Review".  
**Design:** White base with radial gradients (emerald, lime, teal) for a "nature-tech" feel.  
**Button:** Outline style, white fill, transparent border, green text.

#### Smart List Row
**Problem Solved:** Avoid spreadsheet density.  
**Design:** Spaced rows with individually rounded corners.  
**Ghost Actions:** Hidden by default, fade in on hover; row pops out with shadow.

#### Modal
**Design:** Centered white modal, 24px radius.  
**Backdrop:** Deep Swamp blur (blur(8px)) to isolate focus.

## Branding & Style Guide

### Color Palette ("Modern Croco")

| Token | Hex | Usage |
| --- | --- | --- |
| Primary | #1E9E6A | Primary actions, active states |
| Primary Surface | #E6F7F0 | Badges, light hovers |
| Background Body | #F8FAFC | Global background |
| Background Sidebar | #051B15 | Sidebar background ("Deep Swamp") |
| Text Main | #064E3B | Titles, primary data |
| Text Muted | #64748B | Secondary metadata |
| Text On Dark | #ECFDF5 | Sidebar text |
| Accent Lime | #84CC16 | Gradient highlights |

### Typography

#### Font Families
- **Primary:** Inter
- **Secondary:** Plus Jakarta Sans

#### Type Scale

| Element | Size | Weight | Line Height |
| --- | --- | --- | --- |
| H1 (Display) | 32px | 800 | 40px |
| H2 (Section) | 18px | 700 | 26px |
| Body | 14px | 500 | 22px |
| Small | 12px | 400 | 18px |

### Depth System
- **Glassmorphism:** backdrop-filter: blur(12px) with 85% white background for sticky header.
- **Shadow Float:** 0 20px 25px -5px rgba(0, 50, 20, 0.05) on hover cards.
- **Glow:** box-shadow: 0 0 15px rgba(30, 158, 106, 0.4) for logo and active elements.

## Accessibility Requirements

### Compliance Target
**Standard:** WCAG 2.1 AA

### Key Requirements
- **Contrast:** Text Muted used only for secondary info; Text Main ensures strong contrast on light backgrounds.
- **Focus States:** Emerald focus-visible ring on all interactive elements.
- **Reduced Motion:** All animations respect prefers-reduced-motion.

## Animation & Micro-interactions

### Motion Principles
- **Purposeful feedback only** - state changes over decoration.
- **Natural easing** - use cubic-bezier curves for hover and modal transitions.
- **Accessible by default** - disable motion when reduced-motion is requested.

### Key Animations
- **Hover lift:** Cards and list rows lift by 5px with soft shadow.
- **Ghost actions:** Opacity 0 to 1 on hover (150ms).
- **Modal scale-in:** 0.95 to 1.0 over 200ms with ease-out.

## Performance Considerations
- Keep mesh gradients efficient; prefer CSS radial gradients over heavy images.
- Limit blur layers to avoid GPU spikes on scroll.

## Implementation Checklist
1. Configure CSS root variables with the Modern Croco palette.
2. Build the split grid: 270px fixed sidebar + flex main content.
3. Implement glassmorphism for the sticky header.
4. Add hover effects for Stats Cards and Smart List Rows.
5. Load Inter (400-800) and Plus Jakarta Sans.
6. Verify mesh gradients are performant on target hardware.
