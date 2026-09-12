---
name: Sovereign Defense Civic
colors:
  surface: '#f9f9ff'
  surface-dim: '#d1daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dfe8fd'
  surface-container-highest: '#dae3f7'
  on-surface: '#131c2a'
  on-surface-variant: '#43474e'
  inverse-surface: '#283140'
  inverse-on-surface: '#ecf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f85'
  primary: '#001631'
  on-primary: '#ffffff'
  primary-container: '#0d2b4e'
  on-primary-container: '#7993bc'
  inverse-primary: '#aec8f3'
  secondary: '#1e5fa8'
  on-secondary: '#ffffff'
  secondary-container: '#7ab0fe'
  on-secondary-container: '#00427e'
  tertiary: '#755b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c8a74c'
  on-tertiary-container: '#4f3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#aec8f3'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#2e486c'
  secondary-fixed: '#d5e3ff'
  secondary-fixed-dim: '#a6c8ff'
  on-secondary-fixed: '#001c3b'
  on-secondary-fixed-variant: '#004787'
  tertiary-fixed: '#ffe08f'
  tertiary-fixed-dim: '#e6c364'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#584400'
  background: '#f9f9ff'
  on-background: '#131c2a'
  surface-variant: '#dae3f7'
typography:
  display-hero:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
  display-hero-mobile:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Public Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
  code-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an authoritative, sovereign, defense-grade digital environment designed for mission-critical blockchain provenance, security clearances, and supply chain telemetry under the Ministry of Defence. The visual architecture projects uncompromised institutional integrity, absolute reliability, and disciplined clarity. 

The aesthetic is grounded in a **Modern Civic & Institutional Tech** framework:
- **Structural Integrity:** Rigorous grid discipline, calibrated high-density layouts, and unambiguous hierarchy prioritize high-speed information consumption without visual fatigue.
- **National & Defense Dignity:** Restrained, commanding deep navy anchors the experience, accented by disciplined utility blues and precise gold heritage rules signifying sovereign accreditation and Navratna enterprise status.
- **Trust & Compliance:** Zero-nonsense surface architecture with purposeful, low-elevation layering and high-contrast typography ensures auditability, accessibility compliance (WCAG 2.1 AAA contrast targets for data and textual structures), and an unimpeachable civic presence.

## Colors

The color palette establishes an uncompromising sovereign visual standard. Primary foundational surfaces, headers, and mission-critical controls draw from `#0D2B4E` (Dark Navy). Operational interactions, system notifications, active workflow steps, and primary interactive targets rely on `#1E5FA8` (Primary Blue). 

Sovereign credentials, certification badges, security clearance markers, and state status lines strictly employ `#C9A84C` (Navratna Gold) in calibrated, restrained measures (such as 2px structural borders and emblem accents) to avoid decorative excess.

### Palette Implementation
- **Deep Sovereign Surfaces & Footers:** `#0D2B4E`
- **Interactive Focus & System Blue:** `#1E5FA8`
- **Tonal Backdrops & Badge Containers:** `#E8F1FB`
- **Secondary Links & Highlight Outlines:** `#3B82C4`
- **Sovereign Accent & Certification Rule:** `#C9A84C`
- **Primary Typography & High-Contrast Titles:** `#1A2332`
- **Subordinate Copy & Technical Data:** `#4A5568`
- **Structural Boundaries & Grid Dividers:** `#E2E8F0`
- **Surface Elevation Base:** `#FFFFFF`

## Typography

The typographic pairing combines **Public Sans** for structured institutional authority in headings with **Inter** for dense transactional records, logs, and metadata.

- **Headlines & Display:** Set in Public Sans with precise letter-spacing (-0.02em on Display and H1, -0.01em on H2/H3). Display sizes command attention with strict vertical line-height ratios that avoid clipping on multilingual strings or acronym sequences.
- **Body & Data Records:** Set in Inter with neutral tracking (0) and generous line heights (1.5–1.6x) to preserve parsing speed in dense ledgers and technical audit screens.
- **Labels, Badges, and Hashes:** Capitalized tracking (+0.04em) applied to `label-sm` when designating status tiers (e.g., "CONFIDENTIAL", "VERIFIED BEL NODE", "TAMPER-PROOF"). Monospace-inspired tabular numbers are activated across all numeric and timestamp outputs via font feature settings (`"tnum" 1, "cv05" 1`).

## Layout & Spacing

The layout is built on a responsive 12-column grid system tuned for mission-critical dashboards, multi-party ledger audits, and civic portals.

- **Breakpoints & Grids:**
  - **Desktop (≥ 1280px):** 12 columns, fixed container width max 1440px, 32px (`gutter-lg`) columns, 48px (`margin-desktop`) canvas padding.
  - **Tablet (768px – 1279px):** 8 columns, fluid container, 24px (`gutter`) columns, 32px (`margin`) outer margin.
  - **Mobile (< 768px):** 4 columns, fluid container, 16px (`gutter-sm`) columns, 16px (`margin-mobile`) outer margin.
- **Rhythm & Cadence:** An uncompromising 8px baseline rhythm governs all layout structures (using `space-xs` = 4px for tight internal inline padding; `space-sm` = 8px; `space-md` = 16px; `space-lg` = 24px; `space-xl` = 32px).
- **Data Density:** Dashboard rows, audit tables, and telemetry timelines utilize a compact 40px row height; editorial guidance cards and sovereign verification banners expand into 24px internal card padding.

## Elevation & Depth

To maintain defense-grade institutional credibility, the design system avoids hyper-inflated, diffused, or playful drop shadows. Depth is communicated primarily through **tonal separation, structural containment borders, and restrained optical grounding**.

- **Level 0 (Base Canvas):** `#F8FAFC` or `#FFFFFF` flat surface.
- **Level 1 (Cards, Ledgers, Data Modules):** Solid `#FFFFFF` background bound by a crisp 1px solid border (`#E2E8F0`). Shadow is minimal and directional: `0 1px 2px 0 rgba(13, 43, 78, 0.05)`.
- **Level 2 (Interactive Floating Modules, Flyouts, Popovers):** Solid `#FFFFFF` with a 1px border (`#E2E8F0`), elevated by `0 4px 12px -2px rgba(13, 43, 78, 0.08), 0 2px 4px -1px rgba(13, 43, 78, 0.04)`.
- **Level 3 (Modal Dialogs & Cryptographic Signing Overlays):** Bound by `1px solid #CBD5E1` accompanied by `0 16px 32px -4px rgba(13, 43, 78, 0.14)`, supported by an overlay backdrop of `rgba(13, 43, 78, 0.65)` with a 2px blur filter.
- **Accent Structural Rule:** Navratna Gold (`#C9A84C`) provides structural grounding via 2px top borders on flagship defense cards, active step modules, and sovereign trust banners.

## Shapes

The design system enforces **Soft (0.25rem / 4px base)** geometry. Soft corners provide a contemporary, clean civic aesthetic while retaining the rigid, reliable posture of defense systems.

- **Default UI Components (Buttons, Input Fields, Step Containers):** `0.25rem` (4px).
- **Cards, Panels, and Data Modules (`rounded-lg`):** `0.5rem` (8px).
- **Modals, Drawer Sheets, and Hero Banners (`rounded-xl`):** `0.75rem` (12px).
- **Pill Exception (Badges & Cryptographic State Tags):** Fully rounded (`9999px`) to immediately visually differentiate data attributes and network verification tags from actionable rectangular buttons.

## Components

### Buttons
- **Primary Sovereign CTA:** Background `#1E5FA8`, text `#FFFFFF`, border none, 4px border radius. Hover: `#0D2B4E`. Active: `#0A213D`. Focus-visible: 2px outline `#3B82C4` offset by 2px. Minimum height 40px, inline padding 16px.
- **Secondary Defense Action:** Background `#FFFFFF`, text `#0D2B4E`, 1px border `#CBD5E1`. Hover: Background `#E8F1FB`, border `#1E5FA8`.
- **Destructive/Emergency Revocation:** Background `#DC2626`, text `#FFFFFF`. Hover: `#B91C1C`.

### Chips & Security Verification Tags
- **Cryptographic Status Badges:** Pill shape (`9999px`), 11px font size, bold uppercase. Height 24px, padding 4px 10px.
- **Node Active / Verified:** Background `#E8F1FB`, text `#1E5FA8`, 1px border `#3B82C4` at 40% opacity.
- **Sovereign Navratna Tag:** Background `#FFFDF5`, text `#8C6E26`, 1px border `#C9A84C`.
- **Alert / Blocked:** Background `#FEF2F2`, text `#991B1B`, 1px border `#F87171`.

### Government Trust Banners & Authority Headers
- **Top Sovereign Banner:** Full-width strip `#0D2B4E` with 2px bottom border `#C9A84C`. Incorporates Indian tricolor or authorized state insignia paired with bilingual ministry title. Height 36px, font size 12px, text `#FFFFFF`.
- **BEL Node Header:** High-contrast Dark Navy banner featuring hardware security module (HSM) status, active consortium node ID, and real-time block validation rate.

### High-Density Structured Cards
- Background `#FFFFFF`, border 1px solid `#E2E8F0`, corner radius 8px.
- Padding: 20px internally. Optional 2px top accent bar in `#1E5FA8` (standard data) or `#C9A84C` (sovereign clearance certificate).
- Card headers feature uppercase, tracked `label-sm` titles with trailing inline status badges.

### Metric Badges & Telemetry Blocks
- Data display components: Background `#F8FAFC`, border 1px solid `#E2E8F0`, padding 12px 16px, 4px corner radius.
- Large numeric metric (24px, Public Sans 700, `#0D2B4E`) paired with 11px uppercase label (`#4A5568`) indicating block height, TPS, encryption standard (e.g., "AES-256-GCM"), or ledger latency.

### Step Diagrams & Provenance Timelines
- Horizontal workflow connectors on desktop; vertical on mobile.
- Active nodes: Circle 28px, background `#1E5FA8`, inner icon/number `#FFFFFF`, outline 3px `#E8F1FB`.
- Completed nodes: Circle 28px, background `#0D2B4E`, tick icon in `#C9A84C`.
- Connecting tracks: 2px solid `#E2E8F0` with progressive fill in `#1E5FA8`.

### Input Fields & Search Ledgers
- Height 40px, padding 0 12px. Background `#FFFFFF`, border 1px solid `#CBD5E1`, text `#1A2332`, placeholder `#94A3B8`.
- Focus state: Border `#1E5FA8`, box-shadow `0 0 0 1px #1E5FA8`.
- Search ledgers feature left-aligned system magnifying lens and right-aligned keyboard shortcut badge (`Ctrl+K`).

### Checkboxes & Radio Buttons
- 16px square (checkbox) or circle (radio), 1px solid `#CBD5E1`, background `#FFFFFF`.
- Checked state: Background `#1E5FA8`, border `#1E5FA8`, inner check/dot `#FFFFFF`. Focus ring: 2px `#3B82C4`.

### Lists & Audit Tables
- Headers: Background `#F1F5F9`, text `#4A5568`, 12px uppercase font, border-bottom 1px solid `#CBD5E1`.
- Rows: Alternating white and neutral `#FCFDFD`, height 44px, bottom border 1px solid `#E2E8F0`. Hover row: `#E8F1FB` at 50% opacity.
- Hashes and wallet signatures truncate with an interactive copy-to-clipboard action.