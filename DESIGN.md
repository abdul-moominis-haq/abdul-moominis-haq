---
name: IS-HAQ ABDUL-MOOMIN Portfolio
description: A project-first portfolio for applied full-stack, AI, and IoT engineering.
colors:
  amber-safelight: "hsl(39 78% 78%)"
  warm-paper: "hsl(42 76% 91%)"
  enamel-white: "hsl(42 83% 97%)"
  amber-ground: "hsl(39 65% 88%)"
  near-black-ink: "hsl(27 11% 12%)"
  silver-gray: "hsl(29 7% 37%)"
  amber-primary: "hsl(32 77% 39%)"
  deep-amber: "hsl(28 76% 29%)"
  registration-amber: "hsl(36 86% 56%)"
  paper-rule: "hsl(34 23% 65%)"
  dark-ground: "hsl(24 8% 11%)"
  dark-foreground: "hsl(40 48% 91%)"
  dark-paper: "hsl(26 9% 17%)"
  dark-safelight: "hsl(32 38% 26%)"
  dark-enamel: "hsl(25 8% 14%)"
  dark-silver: "hsl(38 18% 69%)"
  dark-primary: "hsl(38 87% 63%)"
  dark-deep-amber: "hsl(36 81% 51%)"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(2.8rem, 7.2vw, 6rem)"
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(2.3rem, 4.8vw, 4.6rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "0.76rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "6px"
  circle: "50%"
spacing:
  tight: "0.5rem"
  control: "1rem"
  gutter: "1.5rem"
  section: "clamp(3.75rem, 8vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.amber-primary}"
    textColor: "{colors.enamel-white}"
    rounded: "0px"
    padding: "0.55rem 1rem"
    height: "2.8rem"
  button-primary-hover:
    backgroundColor: "{colors.deep-amber}"
    textColor: "{colors.enamel-white}"
  project-record:
    backgroundColor: "{colors.amber-safelight}"
    textColor: "{colors.near-black-ink}"
    rounded: "0px"
    padding: "clamp(1.5rem, 4vw, 3.75rem)"
  text-field:
    backgroundColor: "{colors.enamel-white}"
    textColor: "{colors.near-black-ink}"
    rounded: "{rounded.sm}"
    padding: "0.65rem 0.8rem"
  navigation:
    backgroundColor: "{colors.amber-ground}"
    textColor: "{colors.near-black-ink}"
    padding: "0 1.5rem"
---

# Design System: IS-HAQ ABDUL-MOOMIN Portfolio

## Overview

**Creative North Star: "Safelight Contact Sheet"**

The portfolio reads like a considered sheet of engineering records developed under an amber safelight. Warm paper, near-black ink, silver-gray annotations, and enamel-white fields make the work itself the subject; typographic scale and precise rules provide the structure rather than decorative darkroom props.

Use the same material vocabulary across the portfolio's routes, while letting each section's real content determine its density. The light theme is the default; the dark theme translates the paper-and-ink palette into darkroom values without changing the site's clear hierarchy. Project names, roles, descriptions, technologies, and contact paths remain readable and factual.

**Key Characteristics:**
- Project evidence leads; the homepage opens on a selected project and a compact index.
- Amber, paper, ink, and silver-gray establish a restrained print-room palette.
- Condensed display type contrasts with a highly readable humanist sans-serif.
- Fine rules, numbered records, and underlined technology labels organize information.

## Colors

The palette pairs warm amber paper and safelight fields with dark ink, quiet silver-gray annotations, and a clean enamel-white register; the dark theme shifts the same roles to low-light values.

### Primary
- **Safelight Amber** (`hsl(39 78% 78%)`): The featured project field and the warm center of the light-theme contact sheet.
- **Developing Amber** (`hsl(32 77% 39%)`): Primary links, selected project text, and primary actions.
- **Registration Amber** (`hsl(36 86% 56%)`): Focused accents on the dark contact surface.

### Neutral
- **Warm Paper** (`hsl(42 76% 91%)`): Paper-like section surfaces.
- **Amber Ground** (`hsl(39 65% 88%)`): Default light-theme page background.
- **Enamel White** (`hsl(42 83% 97%)`): The contact-sheet index, form fields, and crisp light register.
- **Near-black Ink** (`hsl(27 11% 12%)`): Primary text and the dark contact/footer ground.
- **Silver-gray** (`hsl(29 7% 37%)`): Secondary labels and project annotations on light surfaces.
- **Paper Rule** (`hsl(34 23% 65%)`): Fine dividers and record boundaries.
- **Darkroom Ground** (`hsl(24 8% 11%)`): Dark-theme page background.
- **Dark Safelight** (`hsl(32 38% 26%)`): Dark-theme featured project field.
- **Dark Enamel** (`hsl(25 8% 14%)`): Dark-theme index and card surfaces.
- **Dark Silver** (`hsl(38 18% 69%)`): Secondary information on dark surfaces.
- **Dark Amber** (`hsl(38 87% 63%)`): Primary interactive color in the dark theme.

### Named Rules
**The Legibility-First Rule.** The darkroom vocabulary is a structural aid, never a reason to reduce contrast or obscure project facts.

## Typography

**Display Font:** Barlow Condensed (with a generic sans-serif fallback)
**Body Font:** Source Sans 3 (with Segoe UI and sans-serif fallbacks)
**Label/Mono Font:** Source Sans 3; use tabular numerals for dates and indexes.

**Character:** Barlow Condensed gives project names and section headings a compact, printed voice. Source Sans 3 keeps descriptions, navigation, and form content open and practical.

### Hierarchy
- **Display** (650, `clamp(2.8rem, 7.2vw, 6rem)`, 1.05 line-height): The portfolio name and strongest page title.
- **Headline** (650, `clamp(2.3rem, 4.8vw, 4.6rem)`, 0.98 line-height): Featured project titles and section headings.
- **Title** (650, about 1.6–2.45rem): Individual project, experience, and study records.
- **Body** (400, 1.0625rem, 1.65 line-height): Project descriptions and long-form portfolio content; keep readable measures near 60–76ch.
- **Label** (700, 0.76rem, 0.1em tracking, uppercase): Record metadata and quiet section annotations.

### Named Rules
**The Work-Speaks Rule.** Use display type for identity and real work titles; keep utility labels small and subordinate.

## Layout

Center the primary reading surfaces in a 1160px column, with the shared header allowed up to 1360px. The homepage opens with a two-column contact sheet: a larger featured record beside a compact project index. Subsequent content uses ruled editorial records rather than a repeated grid of equal cards. Keep headings and their supporting content close, with more space separating sections than elements within a record.

The main section rhythm is `clamp(3.75rem, 8vw, 7rem)` with 1–1.5rem page gutters. At 900px the featured sheet tightens; at 720px it becomes a single-column reading flow and the navigation becomes horizontally scrollable; at 440px record labels and form controls use narrower layouts. Preserve the selected project details and keyboard-accessible controls at every width.

## Elevation & Depth

The system is flat by default. Fine borders and shifts between paper, safelight, enamel, and ink communicate depth; the project selector uses a quiet background change rather than a raised card. Avoid shadows as a substitute for print boundaries. Short color transitions and a single restrained project-change reveal provide the interaction feedback.

### Named Rules
**The Ruled-Surface Rule.** Separate records with tonal fields and fine rules; do not add a shadow beneath a surface that already has a border.

## Shapes

The contact sheet and its project records use square corners, thin outlines, and broad paper-like planes. General form controls use the established 6px radius; the theme control is circular. Technology labels remain text with a fine underline, not pill badges.

## Components

### Buttons
- **Character:** Compact, direct print-room controls.
- **Shape:** Square corners for portfolio actions (0px).
- **Primary:** Amber fill, enamel-white text, 1px amber boundary, and `0.55rem 1rem` padding.
- **Hover / Focus:** Deepen the amber on hover; use the shared 3px visible focus outline with 3px offset.
- **Secondary / Ghost:** Transparent ground, ink text, and a fine paper-rule border; links retain their underline.

### Chips
- **Style:** Technologies are plain text on the surface with a fine underline, not filled pills.
- **State:** They label a record; they are not filters or actions.

### Cards / Containers
- **Corner Style:** Square for the featured record and project index.
- **Background:** Safelight amber for the selected record, enamel white for the index, and paper tones for supporting sections.
- **Shadow Strategy:** None; fine outlines and tonal contrast define the sheet.
- **Border:** 1px paper-rule boundary with fine horizontal rules between records.
- **Internal Padding:** Featured record uses `clamp(1.5rem, 4vw, 3.75rem)`; index uses about `1.25rem`.

### Inputs / Fields
- **Style:** Enamel-white background, paper-rule stroke, and the shared 6px control radius.
- **Focus:** 3px primary outline, offset by 3px.
- **Error / Disabled:** Preserve explicit error messaging; disabled submit controls use a wait cursor and reduced opacity.

### Navigation
- **Style:** A single ink-colored masthead with compact links; the active route uses amber text and a bottom rule.
- **Hover / Active:** Amber text and a bottom rule; the contact action receives a thin amber border.
- **Mobile:** The brand sits above a horizontally scrollable navigation row; at common phone widths, keep the theme control visible without scrolling.

### Project Contact Sheet
The selector is a numbered list of real projects. Each full-width button updates the featured title, year, role, description, and technologies in place. Use `aria-pressed` for selection and retain a visible selected treatment; never replace the record with a fabricated link or metric.

## Do's and Don'ts

### Do:
- **Do** lead the homepage with the selected project's real title, role, description, and technologies.
- **Do** preserve the warm paper, safelight, ink, silver-gray, and enamel-white palette in both themes.
- **Do** use fine rules, restrained labels, and numbered records to make the portfolio scannable.
- **Do** keep controls keyboard-operable and use the shared visible focus treatment.
- **Do** preserve factual project and career content and real contact destinations.

### Don't:
- **Don't** invent project destinations, testimonials, outcomes, or metrics.
- **Don't** turn the darkroom direction into decorative props, faux grain, or unreadable low-contrast text.
- **Don't** use equal icon-and-copy cards as the page's primary structure.
- **Don't** replace the project evidence with generic hero claims or progress meters.
- **Don't** use pill-shaped technology tags, gradient text, or hard offset shadows.
