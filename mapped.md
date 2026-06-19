# Apollo DJ -- File Map

> Complete file inventory for the Apollo DJ project.
> Every file listed with purpose, dependencies, exports, and status.

---

## navbar/

| File | Purpose | Deps | Exports | Status |
|------|---------|------|---------|--------|
| `navbar.html` | Standalone navbar v8 demo page (Swiss Style); includes topbar, 3 slide/dropdown panels, desktop sidebar, content cards grid | `core.js` (CDN), `navbar.css`, `app-btn.navbar.css`, `simulated.navbar.data.js`, `app-btn.navbar.js`, `navbar.js` | Full HTML page | DONE |
| `navbar.php` | Embeddable PHP partial for navbar; same markup as `navbar.html` without `<head>`/`<body>` wrappers (~90 lines) | Consuming page must load `core.js`, `navbar.css`, `app-btn.navbar.css`, JS files; optional `$navbar_base_url` PHP var | Includable partial via `<?php include 'navbar.php'; ?>` | DONE |
| `navbar.css` | Core styles for topbar (`.tb`), panels (`.pn`), overlay (`.ov`), burger-arrow animation (`.ab`), layout shell, preloader, dark mode, responsive breakpoints | CSS custom properties from `core.js` CDN; defines own `:root` fallbacks (`--primary: #FF9820`) | All navbar visual styles | DONE |
| `navbar.js` | Core engine: boots panel system, clock (10s tick), dark mode toggle (localStorage), preloader fade-out | DOM elements from `navbar.html`; calls `window.ApolloNavRenderer.run()` from `app-btn.navbar.js` | `window.ApolloNavbar = { open, close, toggle }` | DONE |
| `app-btn.navbar.js` | DOM renderer: builds nav links, bento apps grid, profile/login form, content cards from data layer; includes app search/filter | `window.ApolloNavData` (from `simulated.navbar.data.js`) | `window.ApolloNavRenderer = { run, renderNav, renderApps, renderProfile }` | DONE |
| `app-btn.navbar.css` | Styles for bento apps grid: responsive columns (3 mobile, 4 at 400px+, 3 at 768px+), glassmorphic app cells (`.bi`), `.bi-new` badge | CSS custom properties from `navbar.css` / `core.js` (`--r-lg`, `--ease-default`, `--bg-item`, `--color-item`) | `.bento-apps`, `.bi`, `.bi-new`, `.bl` classes | DONE |
| `simulated.navbar.data.js` | Mock data layer (self-contained IIFE); replaces REST API (`apollo/v1`) for development | None | `window.ApolloNavData` = `{ NAV_LINKS(8), APPS(17), PROFILE, CARDS(6) }` | DONE |

---

## DASH/

| File | Purpose | Deps | Exports | Status |
|------|---------|------|---------|--------|
| `dashboard.apollo.html` | Production dashboard page ("Luxury Flat Open Kitchen"); topbar, left sidebar, tab system (Overview/Analytics/Reports) via Alpine.js, chart area, activity feed | `core.js` (CDN), `htmx.v2.0.8.js`, `alpine.v.3.15.8.js`, Google Fonts, `dashboard.apollo.css` | Full HTML page with Alpine `x-data`/`x-show` tabs + HTMX `hx-get`/`hx-target` stubs | DONE |
| `dashboard.apollo.css` | Dashboard layout, topbar (`.apollo-topbar`), glassmorphic dropdowns (`.dropdown-menu`), toggle switches, apps grid, profile menu, dark mode overrides | CSS custom properties from `core.js` (`--rgb-theme`, `--z-sheet`, `--z-modal`, `--primary`, `--card`); references `universal.css` | All dashboard visual styles | DONE |
| `dashboard.apollo.js` | Dashboard kernel: ThemeManager (dark mode + localStorage + `apolloThemeChanged` event), ClockManager (pt-BR 1s tick), InteractionManager (dropdowns/panels/overlay/icon morph), ChartManager (amCharts 5 line series, Apollo amber/orange palette, gradient fills, peak/valley bullets) | DOM from `dashboard.apollo.html`; amCharts 5 (`am5`, `am5xy`, `am5themes_Animated`) via CDN; `window.ApolloSimData` from `simulated.data4.dashboard.js` | `ApolloDashboard` module, auto-boots on `DOMContentLoaded` | DONE |
| `dashboard.apollo.bak.html` | Backup/previous version of dashboard page; uses unpkg CDN for HTMX/Alpine, includes inline `universal.css` tokens | `core.js` (CDN), HTMX/Alpine via unpkg, Google Fonts, Remix Icons | Full HTML page (archived) | DONE |
| `draft-building-theme-dash.html` | Draft/prototype dashboard; self-contained with all styles inline; earlier iteration of dashboard design | `core.js` (CDN), HTMX/Alpine via unpkg, Google Fonts, Remix Icons, inline `universal.css` tokens | Full HTML page (experimental) | DONE |
| `sidebar-tree.css` | Styles for DJ sidebar tree: sections (`.sb-section`), rows (`.sb-row`) with hover/active/focus states, action buttons; "clean luxury minimalist" approach | CSS custom properties (`--ff-main`, `--ff-mono`, `--muted`, `--primary`, `--rgb-diff`, `--r-xs`, `--ease-default`) | `.sb-tree`, `.sb-section`, `.sb-row`, `.sb-row-icon`, `.sb-row-label` classes | DONE |
| `sidebar-tree.js` | Interactive sidebar tree: 3 sections (COMPUTADOR, PLAYLISTS, PENDRIVE); single active selection, USB export toggle per playlist, group expand/collapse, visibility toggles, folder/playlist creation via `prompt()`, pendrive dropdown | DOM only; contains hardcoded data (replaceable with API) | `window.ApolloSidebarTree = { init, getEnabledExportPlaylists, getActiveItem, getSelectedPendrive, getState }`; dispatches `sidebar-select` custom event | DONE |
| `simulated.data4.dashboard.js` | Mock data layer (self-contained IIFE) for dashboard charts and UI | None | `window.ApolloSimData` = `{ mainChart(12mo), donutStats(3), acquisitions(4cat), applicants(3), messages(3), activity(4) }` | DONE |
| `theme/screen-software/apolloDJ.v3.html` | CDJ screen software theme previewer; renders the DJ software UI as it would appear on Pioneer CDJ/XDJ hardware screens | sidebar-tree.js, sidebar-tree.css, Coletanea data | Theme preview page | PLANNED |

---

## BPM/

| File | Purpose | Deps | Exports | Status |
|------|---------|------|---------|--------|
| `bpm-meter.html` | Standalone BPM meter dev page; mobile-first real-time BPM detection UI with mic/file/stream input, tap tempo, intro overlay, confidence indicator | Remix Icons (jsdelivr CDN), Google Fonts (Space Grotesk, Space Mono); all CSS inline | Full standalone HTML page | DONE |
| `bpm-processor.js` | AudioWorklet processor for ultra-low-latency BPM detection; hybrid algorithm: RMS (0.5) + spectral flux (0.3) + autocorrelation (0.2); adaptive threshold, 120ms beat gate, octave normalization (60-220 BPM), configurable tick throttle (60Hz default) | Web Audio API `AudioWorkletProcessor`, `sampleRate`, `currentTime` globals | Registers `'bpm-processor'` AudioWorklet; posts `{ bpm, phase, downbeat, rms, beat }` | DONE |
| `bpm-core.wasm.js` | Mock WebAssembly module; pure JS simulating WASM interface for BPM detection API | `WebAssembly.Memory` | `window.ApolloBPMWasm` = `{ instance.exports: startMic, stopAnalysis, getBPM, getConfidence, malloc, free, version }` | DONE |
| `bpm-core.blob.js` | XOR-encrypted JavaScript core; contains `ApolloBPMCore` class (mic analysis, AudioContext setup) encrypted with key `'APOLLO_BPM_MAX_2026'` | None (self-contained) | `ENCRYPTED_CORE` constant; `encrypt()` / `decrypt()` functions | DONE |
| `bpm-assets.blob.js` | XOR-encrypted CSS/UI asset blob; BPM meter styles encrypted with key `'APOLLO_ASSETS_MAX_2026'` | None (self-contained) | `ENCRYPTED_CSS` constant; `encryptAsset()` / `decryptAsset()` functions | DONE |
| `bpm-manifest.json` | PWA manifest for "Apollo BPM MAX"; standalone mode, portrait, `theme_color: #f45f00`, embedded SVG icon (base64), microphone permission, CSP policy | None | PWA metadata | DONE |
| `sw.js` | Service Worker: offline-first caching (`apollo-bpm-max-v1.0.0`), cross-origin request blocking (403), `X-Apollo-Auth` header requirement for `.wasm`/`.blob` files (401), `SKIP_WAITING` / `GET_VERSION` message handlers | None (standalone) | Cache management + security layer | DONE |
| `index.html` | Production entry point; heavily obfuscated/minified BPM meter with encrypted blob boot sequence, intro gate ("INICIAR"), pulsing animation | `bpm-manifest.json`, `bpm-core.wasm.js`, `bpm-core.blob.js`, `bpm-assets.blob.js`, `sw.js`, Google Fonts | Full HTML page (production build) | DONE |
| `README.md` | Documentation: architecture overview, security layers (encrypted blobs, SW protection, WASM-style API), dev instructions, performance targets (< 2s load, < 50MB RAM, +/- 1 BPM accuracy) | None | Documentation | DONE |

---

## DJ/

| File | Purpose | Deps | Exports | Status |
|------|---------|------|---------|--------|
| `dj-page.css` | Styles for DJ Artist Profile page (`apollo.rio.br/dj/{slug}`); track card grid (`.nh-tracks-grid` horizontal scroll + snap, `.nh-track-card` 110x175px) | `universal.css` (must load first); uses `--primary`, `--border`, `--radius-sm`, `--ease-default`, `--bg` | DJ page component styles | IN PROGRESS |
| `dj-page.js` | DJ page renderer; hardcoded mock data for "Marta Supernova" (gigs, tracks, testimonials); sets copyright year | GSAP + ScrollTrigger (loaded before); runs on `DOMContentLoaded` | Renders dynamic content into page | IN PROGRESS |

### DJ/finished/html/

| File | Purpose | Deps | Exports | Status |
|------|---------|------|---------|--------|
| `hero.html` | Full-viewport DJ hero section; background image, DJ name, bio, action buttons | CSS from `05-hero.css` | HTML partial | DONE |
| `bio.html` | DJ biography section | CSS from `10-bio.css` | HTML partial | DONE |
| `agenda.html` | Upcoming gigs/events listing | CSS from `07-gigs.css` | HTML partial | DONE |
| `booking.html` | Booking/contact form | CSS from `15-booking.css` | HTML partial | DONE |
| `depoimentos.html` | Testimonials / reviews carousel | CSS from `14-depoimentos.css` | HTML partial | DONE |
| `epk.html` | Electronic Press Kit section | CSS from `12-epk.css` | HTML partial | DONE |
| `footer.html` | Page footer | CSS from `16-footer.css` | HTML partial | DONE |
| `gallery.html` | Photo gallery grid | CSS from `13-gallery.css` | HTML partial | DONE |
| `marquee.html` | Scrolling marquee text | CSS from `08-marquee.css` | HTML partial | DONE |
| `metrics.html` | DJ statistics / metrics display | CSS from `06-metrics.css` | HTML partial | DONE |
| `noise.html` | Noise/grain texture overlay | CSS (inline or `17-sections.css`) | HTML partial | DONE |
| `progress.html` | Scroll progress indicator bar | CSS from `03-progress.css` | HTML partial | DONE |
| `sounds.html` | Tracks/sounds listing section | CSS from `09-tracks.css` | HTML partial | DONE |
| `fab-menu.html` | Floating action button menu | CSS from `18-fab-sheet.css` | HTML partial | DONE |

### DJ/finished/css/

| File | Purpose | Deps | Exports | Status |
|------|---------|------|---------|--------|
| `01-tokens.css` | Design tokens: CSS custom properties (colors, spacing, typography, radii, easing) | None (foundational layer) | `:root` variables | DONE |
| `02-base.css` | CSS reset and base element styles | `01-tokens.css` variables | Global reset | DONE |
| `03-progress.css` | Scroll progress bar styles | Tokens | `.scroll-progress` | DONE |
| `04-navbar.css` | DJ page navbar (distinct from main navbar) | Tokens | DJ navbar styles | DONE |
| `05-hero.css` | Hero section: full viewport, background image, content overlay, animations | Tokens | `.dj-hero` styles | DONE |
| `06-metrics.css` | Metrics/statistics section | Tokens | Metrics component | DONE |
| `07-gigs.css` | Gigs listing grid | Tokens | `.gigs` styles | DONE |
| `08-marquee.css` | Scrolling marquee animation | Tokens | `.marquee` styles | DONE |
| `09-tracks.css` | Track cards with horizontal scroll + snap | Tokens | `.tracks` styles | DONE |
| `10-bio.css` | Biography section layout | Tokens | `.bio` styles | DONE |
| `11-timeline.css` | Career timeline component | Tokens | `.timeline` styles | DONE |
| `12-epk.css` | Electronic Press Kit section | Tokens | `.epk` styles | DONE |
| `13-gallery.css` | Photo gallery grid with lightbox | Tokens | `.gallery` styles | DONE |
| `14-depoimentos.css` | Testimonials carousel | Tokens | `.depoimentos` styles | DONE |
| `15-booking.css` | Booking form styles | Tokens | `.booking` styles | DONE |
| `16-footer.css` | Footer layout | Tokens | `.footer` styles | DONE |
| `17-sections.css` | Shared section utilities and noise overlay | Tokens | Section helpers | DONE |
| `18-fab-sheet.css` | Floating action button + bottom sheet | Tokens | `.fab` styles | DONE |
| `19-animations.css` | GSAP-driven animation keyframes and utility classes | Tokens | Animation classes | DONE |

### DJ/finished/js/

| File | Purpose | Deps | Exports | Status |
|------|---------|------|---------|--------|
| `dj.init.js` | Main entry point; orchestrates all DJ page modules on `DOMContentLoaded` | All other `dj.*.js` modules (ES module imports) | Bootstraps entire DJ page | DONE |
| `dj.data.js` | Static demo data: `gigsData`(5), `tracksData`(10), `depoimentosData`(6) for "Marta Supernova" | None | `export { gigsData, tracksData, depoimentosData }` | DONE |
| `dj.animations.js` | GSAP + ScrollTrigger animation setup for all page sections | GSAP, ScrollTrigger | `export { initAnimations }` | DONE |
| `dj.fab-menu.js` | Floating action button toggle behavior | DOM | `export { initFabMenu }` | DONE |
| `dj.marquee.js` | Infinite scrolling marquee with speed control | DOM | `export { initMarquee }` | DONE |
| `dj.navbar.js` | DJ-specific navbar scroll behavior (hide on scroll down, show on scroll up) | DOM | `export { initNavbar }` | DONE |
| `dj.render-depoimentos.js` | Renders testimonial cards from `depoimentosData` | DOM | `export { renderDepoimentos }` | DONE |
| `dj.render-gigs.js` | Renders gig cards from `gigsData` | DOM | `export { renderGigs }` | DONE |
| `dj.render-tracks.js` | Renders track cards from `tracksData` | DOM | `export { renderTracks }` | DONE |
| `dj.scroll-progress.js` | Scroll progress bar (percentage fill) | DOM | `export { initScrollProgress }` | DONE |

### DJ/finished/php/parts/dj-v3/

| File | Purpose | Deps | Exports | Status |
|------|---------|------|---------|--------|
| `bio.php` | PHP template partial for biography section; pulls ACF/meta fields | WordPress + ACF | `<?php include ?>` partial | DONE |
| `booking.php` | PHP template partial for booking form; pulls ACF/meta fields | WordPress + ACF | `<?php include ?>` partial | DONE |
| `agenda.php` | PHP template partial for agenda/gigs; pulls ACF/meta fields | WordPress + ACF | `<?php include ?>` partial | DONE |

---

## Root

| File | Purpose | Deps | Exports | Status |
|------|---------|------|---------|--------|
| `universal.css` | Apollo Universal Design System v3.2.0 (Production); foundational CSS: reset, dark mode overrides (ambient gradients with orange/violet), selection colors, range sliders, custom selects (`.as2`/`.as3`), icon buttons, toggle switches, calendar pickers, form foundation (accent-color, caret, underline inputs) | CSS custom properties from `core.js` CDN (injected into `:root` and `html.dark-mode`) | Global design system classes and tokens | DONE |
| `universal-showcase.html.bak.html` | Token showcase / backup page; visual reference for all `universal.css` components and tokens | `universal.css`, `core.js` CDN | Full HTML reference page (backup) | DONE |
