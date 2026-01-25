# CrocoVoice 2.0 UI/UX Specification (Premium SaaS)

## Introduction

This document defines the updated user experience goals, information architecture, user flows, and visual design system for CrocoVoice 2.0. The objective is to move from a functional utility to a premium, immersive SaaS experience.

### Overall UX Goals & Principles

#### Target User Personas
- **Modern Creator:** Entrepreneur, content creator, or executive who uses Linear/Raycast/Notion and expects impeccable aesthetics and flow.
- **Power User:** Demands speed, keyboard shortcuts, and zero friction.

#### Design Principles (The "Whaouh Effect")
1. **Cinematic split contrast** - Dark, atmospheric surfaces for hero/branding; luminous light canvas for actions.
2. **Tactile depth** - Soft shadows, inner glow, and glass panels create a premium, layered feel.
3. **Emerald as a signal** - Green accents guide attention (focus rings, CTAs, badges, system status).
4. **Clean, confident typography** - Spacious layouts with bold headings and precise microcopy.
5. **Delight through texture** - Noise overlays and soft gradients add richness without clutter.

### Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-15 | v0.1 | Initial UX spec draft | UX Expert |
| 2026-02-01 | v0.2 | Premium SaaS redesign direction | UX Expert |
| 2026-02-XX | v0.3 | Toasts, empty states illustrés, editeur Markdown, feedback micro & preview styles | UX Expert |

## Information Architecture (IA)

### Layout Structure: Split View
- **Brand/Hero Panel (Left, Dark):** Deep teal canvas with glow gradients, noise texture, and a premium highlight card.
- **Action Panel (Right, Light):** Soft off-white background with crisp form cards and elevated CTAs.

### Navigation Structure
- **Primary Navigation:** Sidebar items (Dashboard, Dictionary, Style, Settings).
- **Active State:** Emerald text, subtle gradient background, left glow bar.
- **Hover State:** Mint-tinted brightening.

### Dashboard Implementation Notes
- **Reference file:** `dashboard.html`.
- **Structure:** Keep the cinematic split contrast from signup: dark left navigation + light action canvas.
- **Lighting:** Use subtle emerald/teal glow accents on dark surfaces; avoid heavy gradients on the light canvas.
- **Type & spacing:** Bold, confident headers (Plus Jakarta Sans) with generous vertical rhythm.
- **Key components:** Stats Cards with hover lift, glass sticky header, Smart List Rows with ghost actions, and a soft-glow modal.

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

## Feature Alignment (PRD → UI Surfaces)
| PRD Requirement | UI Surface / Flow |
| --- | --- |
| FR4 Partial transcript updates | Status Bubble (recording feedback) |
| FR11 Polish diff viewer | Context Menu + Hub (diff viewer) |
| FR12 Multi-window UX | Hub, Status Bubble, Context Menu |
| FR13 Mic/language controls | Status Bubble |
| FR16 Notifications | Toasts + Notifications inbox |
| FR17 Insights | Dashboard / Insights views |
| FR18 Onboarding | Onboarding flow |
| FR24 Export transcripts | Hub export actions |

## Component Library / Design System

### Core Components

#### Stats Card
**Design:** White card, rounded-xl, subtle border, large number (Plus Jakarta Sans 700), label, and icon in a pale-green square.  
**Hover Lift:** translateY(-5px), stronger emerald-tinted shadow, icon shifts to Accent Emerald.

#### Mesh Gradient Banner
**Usage:** Highlights such as "Year in Review".  
**Design:** Light canvas with subtle emerald/teal radial gradients. Keep saturation low.  
**Button:** Solid dark-emerald CTA or white outline (avoid lime dominance).

#### Smart List Row
**Problem Solved:** Avoid spreadsheet density.  
**Design:** Spaced rows with individually rounded corners and a soft border.  
**Ghost Actions:** Hidden by default, fade in on hover; row pops out with a light emerald shadow.

#### Toast Notification
**Design:** Floating card bottom-right with icon + title + message.  
**Behavior:** Slides in from the right with spring easing, auto-dismiss 4-5s, click to close.  
**Usage:** Replace inline status text for note creation, dictation errors, and delete/copy actions.

#### Empty State
**Design:** Centered illustration (SVG), short title, supportive message, single CTA.  
**Behavior:** Action focuses the primary input or switches to the relevant view.

#### Markdown Editor (Hybrid)
**Design:** Title input + toolbar (Bold/Italic/List) + textarea.  
**Behavior:** Toolbar wraps selection with markdown tokens; list inserts "- " on new line.

#### Recording Feedback
**Design:** Dictation button with pulse ring + animated audio bars badge.  
**Behavior:** Only visible while recording; toggles off on stop/error.

#### Style Preview
**Design:** Before/After box inside style cards; "Avant" in muted tone, "Après" emphasized.  
**Behavior:** Uses presets when available, fallback examples otherwise.

#### Modal
**Design:** Centered white modal, 24px radius, subtle shadow.  
**Backdrop:** Deep teal blur (blur(8px)) with slight emerald tint.

## Branding & Style Guide

### Color Palette ("CrocoVoice Emerald")

| Token | Hex | Usage |
| --- | --- | --- |
| Primary | #0F2D28 | Primary CTA base (deep emerald) |
| Primary Hover | #0B3A34 | CTA hover |
| Accent Emerald | #10B981 | Focus rings, badges, highlights |
| Accent Teal | #2DD4BF | Gradient pair for headings |
| Surface Light | #F8FAFC | Main content background |
| Surface White | #FFFFFF | Cards, inputs |
| Surface Dark | #042F2E | Hero/branding panel |
| Text Main | #0F172A | Primary text on light |
| Text Muted | #64748B | Secondary metadata |
| Text On Dark | #ECFDF5 | Text on dark surfaces |
| Stroke Light | #E2E8F0 | Subtle borders |

### Typography

#### Font Families
- **Primary:** Plus Jakarta Sans
- **Secondary:** Inter (fallback for system areas if needed)

#### Type Scale

| Element | Size | Weight | Line Height |
| --- | --- | --- | --- |
| H1 (Display) | 36-48px | 700-800 | 1.1-1.2 |
| H2 (Section) | 20-24px | 700 | 1.25 |
| Body | 14-16px | 500-600 | 1.5 |
| Small | 12px | 500 | 1.4 |

### Spacing, Radius, and Shadow Tokens

#### Spacing Scale
| Token | Value | Usage |
| --- | --- | --- |
| xs | 4px | Micro gaps, icon padding |
| sm | 8px | Compact spacing |
| md | 12px | Form element padding |
| lg | 16px | Card padding |
| xl | 24px | Section spacing |
| 2xl | 32px | Page gutters |
| 3xl | 48px | Hero spacing |

#### Radius Scale
| Token | Value | Usage |
| --- | --- | --- |
| sm | 8px | Buttons, small chips |
| md | 12px | Inputs, badges |
| lg | 16px | Cards |
| xl | 20px | Feature cards |
| 2xl | 24px | Modals |

#### Shadow Tokens
| Token | Value | Usage |
| --- | --- | --- |
| sm | 0 1px 2px rgba(15, 23, 42, 0.06) | Inputs, chips |
| md | 0 8px 20px rgba(15, 23, 42, 0.08) | Cards |
| lg | 0 20px 35px rgba(15, 23, 42, 0.12) | Modals |
| glow | 0 0 24px rgba(16, 185, 129, 0.18) | Active states, hero accents |

### Depth System
- **Glassmorphism:** Frosted panels with blur(12px) on dark surfaces for cards and badges.
- **Shadow Float:** Soft elevation on light cards (shadow-lg, emerald tint at 10%).
- **Glow:** Subtle emerald glow on active elements and hero gradients.

### Texture & Backgrounds
- **Hero Panel:** Gradient glows (emerald + teal) + noise overlay at 15-20% opacity.
- **Light Panel:** Flat off-white with minimal noise; keep readability high.

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
 - **CTA press:** Active scale to 0.99 with a fast ease-out.

## Performance Considerations
- Keep gradients efficient; prefer CSS radial gradients and a single noise texture.
- Limit blur layers to avoid GPU spikes on scroll.

## Implementation Checklist
1. Configure CSS root variables with the CrocoVoice Emerald palette.
2. Implement split layout with dark brand panel + light action panel.
3. Load Plus Jakarta Sans (300-700) and set as primary font.
4. Add emerald focus rings for all inputs and CTAs.
5. Apply glow gradients + noise on dark surfaces only.
6. Verify blur and gradients are performant on target hardware.
#### Hero Panel (Signup)
**Design:** Full-height dark surface (#042F2E) with layered glow gradients and noise.  
**Content:** Logo badge, product promise heading with gradient text, social proof card.  
**Texture:** Subtle grain overlay to avoid flat color.

#### Primary CTA Button
**Design:** Solid emerald/forest fill, bold label, slight scale on active.  
**States:** Hover darkens, focus ring emerald, shadow soft but noticeable.

#### Form Input Group
**Design:** White card input with rounded-xl, icon prefix, focus ring emerald 20% and border emerald.  
**Behavior:** Inline validation helper; error state uses red text only (no heavy borders).

#### Social Login Buttons
**Design:** White surface, muted border, subtle hover tint to emerald, gentle shadow.  
**Icon:** Simple monochrome SVG or brand color with small size.

#### Badge Chip
**Design:** Uppercase microcopy, emerald outline on dark background, slight glow.  
**Use:** Feature label like "Voice Intelligence 2.0".
