# Aperture Design System

An original design system in the spirit of the calm, photography-first, single-accent-blue aesthetic of premium consumer-tech marketing sites — built from a written style brief (colors, type ramp, spacing, component inventory) rather than a live codebase or Figma file. No real company's logo, product names, or copyrighted UI was reproduced; "Aperture" and its products (Aperture Phone, Aperture Watch, Aperture Buds) are placeholder brand names invented for this system.

**Source:** a prose design brief describing a minimalist, edge-to-edge product-tile aesthetic (alternating light/dark full-bleed sections, one blue accent, SF-Pro-style display type). No Figma file, codebase, or logo assets were attached — this is a from-brief, no-source build. There is no real logo; every mark slot renders the wordmark "Aperture" in the display font instead.

## Content fundamentals
- **Tone:** confident, quiet, declarative sentence fragments as headlines ("Impossibly capable.", "Time, well kept."). No exclamation points, no hype adjectives stacked together.
- **Casing:** sentence case throughout — headlines, buttons, nav links. Never full caps except rare micro-legal contexts.
- **Voice:** second person in body copy ("your most personal device"), third person / product-forward in headlines.
- **Emoji:** never used.
- **Length:** one headline + one short tagline per tile. No paragraphs of marketing copy — density is intentionally low.

## Visual foundations
- **Color:** one interactive accent (`--color-primary`, #0066cc) for every link, pill, and focus ring. Surfaces alternate white / parchment (#f5f5f7) / near-black tiles (#272729–#252527) / true black (nav only). No gradients anywhere.
- **Type:** Inter stands in for the brand's proprietary display/text faces (see "Font substitution" below). Display sizes carry tight negative letter-spacing (-0.28 to -0.374px); body runs at 17px/1.47 — one pixel and one notch roomier than typical SaaS default. Weight ladder is 300 / 400 / 600 / 700 — 500 is intentionally absent.
- **Backgrounds:** full-bleed flat color tiles, no photography assets supplied (placeholder geometric silhouettes stand in for product renders in the UI kits) and no repeating patterns or hand-drawn illustration.
- **Animation:** none beyond the single system-wide micro-interaction — `transform: scale(.95)` on button press. No page-transition or scroll animation defined by the brief.
- **Hover/press:** buttons darken/scale on press only; no hover-color states are defined (the brief documents default + active only).
- **Borders:** none on full-bleed tiles. A 1px hairline (`--color-hairline`) appears only on utility cards and the frosted sub-nav's bottom edge.
- **Shadow:** exactly one shadow token in the whole system (`--shadow-product`, `rgba(0,0,0,.22) 3px 5px 30px`), reserved for product renders resting on a tile — never on cards, buttons, or text.
- **Blur/transparency:** `backdrop-filter: saturate(180%) blur(20px)` on the frosted sub-nav and the floating checkout bar — the only translucency in the system, and only ever functional (keeping content visible underneath a sticky element).
- **Corner radii:** none (0, full-bleed tiles) / 5 / 8 / 11 / 18 / pill. No radius lives between 18px and full pill — that's deliberate.
- **Cards:** flat white or parchment, hairline border, 18px radius, no shadow. Elevation always comes from a surface-color change, never a drop shadow.

## Iconography
No icon font, SVG sprite, or icon library was supplied with the brief. UI kits use plain Unicode glyphs (search 🔍, bag 🛍) as lightweight stand-ins for nav-bar glyphs — swap these for a real icon set (e.g. Lucide, sized 16–20px, 1.5px stroke, to match the system's quiet-but-precise feel) before shipping production surfaces. No emoji are used as decorative content; the two Unicode glyphs above are the only pictographic marks in the kit.

## Font substitution
The brief specifies a proprietary system display/text face. This system substitutes **Inter** (Google Fonts, self-hosted `@font-face` in `tokens/fonts.css`, weights 300–700) as the nearest open equivalent, per the brief's own substitution guidance: `system-ui, -apple-system` first in the stack so native Apple-platform browsers still resolve their own system font, Inter as the cross-platform fallback. Display-size letter-spacing is tightened slightly (down to -0.374px) to compensate for Inter's slightly wider default tracking.

## Index
- `styles.css` — root stylesheet, imports every token file below.
- `tokens/` — `colors.css`, `fonts.css` (Inter `@font-face`), `typography.css`, `spacing.css`, `shape.css` (radii), `elevation.css` (shadow/blur/press tokens).
- `guidelines/` — 16 foundation specimen cards (Colors, Type, Spacing, Shape, Elevation, Brand groups) shown in the Design System tab.
- `components/` — 16 reusable primitives across 6 groups:
  - `buttons/` — ButtonPrimary, ButtonSecondaryPill, ButtonDarkUtility, ButtonPearlCapsule, ButtonIconCircular, TextLink, TextLinkOnDark
  - `navigation/` — GlobalNav, SubNavFrosted, Footer
  - `tiles/` — ProductTile (light / parchment / dark / dark-2 / dark-3 tones)
  - `cards/` — StoreUtilityCard, EnvironmentQuoteCard
  - `commerce/` — ConfiguratorOptionChip, FloatingStickyBar
  - `forms/` — SearchInput
- `ui_kits/marketing/` — `Homepage.jsx` + `index.html`: full alternating-tile homepage recreation.
- `ui_kits/store/` — `BuyPage.jsx`, `AccessoriesPage.jsx` + `index.html`: interactive configurator (live price) + searchable accessories grid.
- `thumbnail.html` — project tile shown on the homepage picker.
- `SKILL.md` — portable skill definition for use in Claude Code or other agent contexts.

## Known gaps / intentional additions
- No logo or real photography was provided — every product-render slot in the UI kits is a flat geometric placeholder. Replace with real renders before shipping.
- No error/validation states are defined for `SearchInput` (the brief only documents the neutral state).
- No hover states are documented anywhere in the source brief (only default + active/press) — none were invented.
- Dark-mode counterparts for light-surface components were not in the brief and were not invented.
