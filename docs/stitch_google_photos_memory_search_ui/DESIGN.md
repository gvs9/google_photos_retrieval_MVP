---
name: Ambient Vision Design System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1c'
  surface-container: '#202020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c3c6d0'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#303030'
  outline: '#8d9199'
  outline-variant: '#43474f'
  surface-tint: '#a9c8fb'
  primary: '#d3e2ff'
  on-primary: '#0a315b'
  primary-container: '#a8c7fa'
  on-primary-container: '#33537f'
  inverse-primary: '#405f8c'
  secondary: '#bcc7dd'
  on-secondary: '#263142'
  secondary-container: '#3c4759'
  on-secondary-container: '#aab6cb'
  tertiary: '#d3e3fd'
  on-tertiary: '#223145'
  tertiary-container: '#b7c7e0'
  on-tertiary-container: '#445368'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a9c8fb'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#274773'
  secondary-fixed: '#d8e3f9'
  secondary-fixed-dim: '#bcc7dd'
  on-secondary-fixed: '#111c2c'
  on-secondary-fixed-variant: '#3c4759'
  tertiary-fixed: '#d4e4fe'
  tertiary-fixed-dim: '#b8c8e1'
  on-tertiary-fixed: '#0c1c2f'
  on-tertiary-fixed-variant: '#38485d'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Roboto Flex
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  display-md:
    fontFamily: Roboto Flex
    fontSize: 45px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: 0px
  headline-lg:
    fontFamily: Roboto Flex
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: 0px
  headline-lg-mobile:
    fontFamily: Roboto Flex
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0px
  headline-md:
    fontFamily: Roboto Flex
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Roboto Flex
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0px
  title-lg:
    fontFamily: Roboto Flex
    fontSize: 22px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0px
  title-md:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.15px
  title-sm:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  body-lg:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  body-sm:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.4px
  label-lg:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Roboto Flex
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.25rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system expresses a refined, AI-native media environment engineered for immersion, emotional resonance, and frictionless personal archive curation. Drawing from modern Material Design 3 and Google's Gemini-infused design direction, the system recedes visually into the background, ensuring high-dynamic-range photography and video remain the focal point.

### Visual Aesthetic & Expression
The style is characterized by deep, ambient tonal layering rather than hard structural lines. It synthesizes soft organic geometry (pill elements, expansive container radii) with computational precision. Fluid transitions, subtle luminescence, and state-driven tinting evoke an intelligent, quiet luxury that feels both high-tech and warm.

### Guiding Principles
- **Content as Foreground:** The canvas recedes into calibrated neutral dark tones, elevating full-gamut imagery without visual competition.
- **Tonal Hierarchy:** Depth is communicated through calibrated luminance steps and tonal containers rather than stark physical shadows or harsh dividers.
- **Intelligent Focus:** Key accents utilize soft, light-infused blues that communicate AI capability and active state recognition with zero visual fatigue.
- **Continuous Softness:** Tactile interactions leverage rounded geometries—from fully circular pills to 24px and 12px squircle containers—maintaining an approachable, human-centered physical language.

## Colors

The palette establishes an OLED-friendly, low-eye-strain environment calibrated for photographic clarity and effortless night browsing. Surfaces are organized into tonal containers with precise luminance deltas.

### Surface System
- **Surface Canvas (Base):** `#1F1F1F` — The root viewport background; quiet, deep, and non-distracting.
- **Surface Container (Level 1):** `#282828` — Bottom sheets, search bars, persistent toolbars, and inactive elevated cards.
- **Surface Container High (Level 2):** `#303030` — Floating dialogs, menus, interactive modal panels, and context sheets.
- **Surface Container Highest (Level 3):** `#3D3D3D` — Hover states, drag elevations, and transient overlay targets.

### Accent & Interaction
- **Primary / Brand Accent:** `#A8C7FA` — The signature radiant pastel blue; drives primary calls-to-action, active segment indicators, and AI synthesis highlights.
- **On-Primary:** `#041E49` — Deep midnight navy providing AAA contrast against the primary accent.
- **Secondary Container (Filled Chip):** `#3F4A5C` — Desaturated slate-blue container for selected filters, metadata tags, and categorized states.
- **On-Secondary Container:** `#D3E3FD` — High-legibility light tint applied to iconography and text over filled chips.
- **Tertiary Accent:** `#AECBFA` — Alternate accent applied to generative AI suggestions and contextual photo enhancements.

### Typography & Border Colors
- **Text Primary (High Emphasis):** `#E3E3E3` — Applied to headlines, primary labels, and active navigation items.
- **Text Secondary (Medium Emphasis):** `#C4C7C5` — Applied to dates, metadata, body text, and inactive icons.
- **Outline / Border Neutral:** `#444746` — Structural hairline dividers, unselected chip borders, and input boundaries.
- **Outline Variant:** `#303030` — Low-contrast separators between consecutive photo groups and list items.

## Typography

The typographic hierarchy relies on a systematic, clean, variable sans-serif expression aligned with standard Google modern computing surfaces. Hierarchy is structured around optical comfort at small scale and expressive editorial weight at large scale.

### Styling Directives
- **Primary Headers (`headline-*`):** Rendered in weight `400` with tight letter-spacing to mirror modern OS headline standards without unnecessary bulk.
- **Section & Category Markers (`title-md`, `title-sm`):** Set at weight `500` to anchor chronological clusters (e.g., "Yesterday", "San Francisco trip") across gallery feeds.
- **Action Controls (`label-*`):** Standardized across buttons, navigation rails, and chips with tight optical height and slight positive tracking for enhanced clarity against dark containers.
- **Readability Rules:** Never render Body or Title text below contrast ratio 4.5:1. Primary metadata uses `#E3E3E3`; subtext, file types, and camera EXIF metrics utilize `#C4C7C5`.

## Layout & Spacing

Layouts adhere to an 8pt base grid system, paired with a dense 4pt subgrid designed for fluid media tile packing.

### Breakpoints & Adaptive Layout
- **Compact (< 600px):** 4-column flow. Outer margins shrink to `margin-mobile` (16px). Photo galleries utilize a micro-gap grid (`gutter-mobile`, 4px) to maximize screen area for imagery. Navigation anchors to a bottom bar.
- **Medium (600px - 839px):** 8-column layout. Media tiles adapt to flexible aspect-ratio grids. Navigation transitions to a compact left rail.
- **Expanded (> 840px):** 12-column layout. Structural canvas margin expands to `margin` (24px) with maximum container widths capped at 1440px for utility dashboards. Galleries flow edge-to-edge with 16px section padding.

### Gallery Grid Mechanics
Standard photo feeds dismiss standard column gutters in favor of a specialized tight 2px–4px structural spacer (`space-xs`) between media items, mimicking a continuous masonry flow. Elevated toolbars, albums, and curated collection carousels adhere to standard spacing tokens (`space-md`, `space-lg`).

## Elevation & Depth

Visual hierarchy is constructed through tonal shifts rather than opaque drop shadows. Surfaces closer to the user illuminate upward in base value from `#1F1F1F` to `#3D3D3D`.

### Tonal Elevation Levels
- **Level 0 (Canvas):** `#1F1F1F` — Absolute base for the media timeline and full-bleed viewing.
- **Level 1 (Card / Resting Surface):** `#282828` — Search bar containers, floating dock containers, and album cards. No cast shadow.
- **Level 2 (Active Sheets / Elevated Cards):** `#303030` — Bottom utility sheets, Gemini suggestion popovers, and contextual action menus. Accompanied by a subtle ambient diffusion: `0 8px 24px -4px rgba(0, 0, 0, 0.45)`.
- **Level 3 (Modals / Floating System Overlays):** `#3D3D3D` — Full dialog windows and zoom inspect overlays with `0 16px 32px -8px rgba(0, 0, 0, 0.6)`.

### Scrim & Glass Rules
Overlay sheets, ambient video headers, and context bars apply a backdrop blur of `20px` paired with a translucent fill: `rgba(31, 31, 31, 0.78)`. This maintains legibility while letting underlying colors and shapes subtly bleed through.

## Shapes

The design system incorporates intentional, dual-tier geometry to distinguish media content from UI containers.

### Shape Geometry Rules
- **Full Pill (`border-radius: 9999px`):** Reserved for interactive interactive controls: primary buttons, chips, search bars, floating action pills, and segmented toggles.
- **Major Surfaces & Containers (`24px` radius):** Applied to structural cards, album folders, bottom sheet tops, context panels, and Gemini insight cards.
- **Photo & Video Thumbnails (`12px` radius):** Strictly applied to isolated media previews, grid item selections, and collection thumbnails. This prevents aggressive corner clipping on photographic subjects while softening sharp bounds.
- **Internal Micro-Elements (`8px` radius):** Checkbox boxes, popover submenu items, and internal badge containers.

## Components

### Buttons
- **Primary Pill Button:** Fully rounded (`9999px`), background `#A8C7FA`, label color `#041E49`, typography `label-lg`. Height 40px, horizontal padding 24px. Hover state applies an 8% black tint overlay. Focus displays an outer 2px `#A8C7FA` ring with 2px offset.
- **Tonal Button:** Fully rounded, background `#3F4A5C`, text `#D3E3FD`, height 40px, padding 20px. Used for secondary inline actions.
- **Outlined Button:** Fully rounded, 1px border `#444746`, background transparent, text `#A8C7FA`.
- **Icon Buttons:** 40px circular bounds (`9999px`), centered 24px icon. Idle color `#C4C7C5`, hover background `rgba(227, 227, 227, 0.08)`.

### Chips
- **Filled / Selected Chip:** Background `#3F4A5C`, border none, text `#D3E3FD`, icon tint `#D3E3FD`. Fully rounded pill geometry, height 32px, padding 12px horizontal, typography `label-md`.
- **Outlined / Filter Chip (Resting):** Background transparent, 1px border `#444746`, text `#E3E3E3`. Active state switches directly to the filled container style.

### Input Fields & Search Bars
- **Global Search Surface:** Floating pill container, height 48px, background `#282828`, border none. Left icon `#C4C7C5`, placeholder text `#C4C7C5` set to `body-lg`. Trailing avatar or mic icon positioned with 8px margin.
- **Text Fields:** Boxed or underline variants. Container fills use `#282828` with bottom border `#444746`. Focused border transitions to 2px solid `#A8C7FA`. Label animates upward using `body-sm`.

### Cards & Media Surfaces
- **Photo Media Card:** Border radius `12px`. Overflow hidden. Active/selected state displays an inner 3px border `#A8C7FA` and a circular checkmark badge in the top-right corner.
- **Album / Feature Card:** Background `#282828`, border radius `24px`, padding 16px. Primary title `#E3E3E3` (`title-md`), counter subtitle `#C4C7C5` (`body-sm`).

### Checkboxes & Radio Controls
- **Checkboxes:** 18px square with 4px border radius. Unselected uses 2px outline `#444746`. Selected fills with `#A8C7FA` featuring an inverted checkmark icon `#041E49`.
- **Selection Circle (Photo Selection):** 24px circle floating 8px from photo top-right. Resting state has subtle border with low-opacity dark fill `rgba(0,0,0,0.4)`. Selected state fills `#A8C7FA` with `#041E49` checkmark.

### AI & Assistant Surfaces (Gemini-native)
- **Ask Photos / Gemini Bar:** Elevated surface `#282828`, 24px radius or full pill, framed by a soft, subtle gradient shimmer border transitioning from `#A8C7FA` to `#D3E3FD` at 30% opacity. Inner text in `#E3E3E3` paired with a multi-point star sparkle glyph in `#A8C7FA`.
- **Memory Carousel:** 24px curved hero cards with top-to-bottom dark gradient scrims (`rgba(0,0,0,0)` to `rgba(31,31,31,0.85)`), anchoring white headline typography directly over imagery.