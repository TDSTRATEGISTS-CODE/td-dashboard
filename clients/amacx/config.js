/* AMACX EU — client config. Loaded as window.DASHBOARD_CONFIG.
   Everything here is client-specific. To add a client, copy this folder and edit this file. */
window.DASHBOARD_CONFIG = {

  // ---- Identity ----
  client: {
    name: 'AMACX EU',                       // sidebar client name
    title: 'AMACX EU — TD Strategists',     // browser tab <title>
    portalLabel: 'CLIENT PORTAL',           // small label under the logo
    reportPeriodLabel: 'May 2026 · Monthly Report',
    logo: 'logo.jpg',                       // per-client fallback (unused while logoSrc is set)
    logoSrc: 'td-logo.png',                 // shared TD logo for now (all clients) — dashboard/td-logo.png
    logoAlt: 'TD Strategists',
    logoBlend: '',                          // TD SVG is light-on-dark — no blend trick needed
    logoWidth: '160px',                     // match demo
    footer: {
      cadence: 'Updated monthly',
      next: 'Next: 1 Jun 2026',
      managedBy: 'Managed by TD Strategists'
    }
  },

  // ---- Defaults ----
  defaultPeriod: 'may',
  defaultMarket: 'all',

  // ---- Date-range selector (drives the topbar dropdown) ----
  dateRangeOptions: [
    { value: 'may',  label: 'May 2026' },
    { value: '3m',   label: 'Last 3 Months (Mar–May)' },
    { value: '6m',   label: 'Jan–May 2026 (YTD)' },
    { value: '2025', label: 'Full Year 2025' },
    { value: '12m',  label: '2025 + 2026 YTD' }
  ],

  // ---- Markets (sidebar chips, market switching, topbar labels) ----
  // key   : internal id used by switchMarket + matched against dateRanges
  // flag  : flagcdn.com code (emoji fails inside the Wix iframe)
  // chip  : sidebar label
  // code  : matches the first column of dateRanges mktRows (for chip revenue)
  // t / m : topbar title / subtitle when this market is selected
  markets: [
    { key: 'all', flag: 'eu', chip: 'All EU',      code: 'All Marketplaces', t: 'EU Overview',  m: 'All Marketplaces' },
    { key: 'de',  flag: 'de', chip: 'Germany',     code: 'DE',  t: 'Germany',     m: 'DE' },
    { key: 'es',  flag: 'es', chip: 'Spain',       code: 'ES',  t: 'Spain',       m: 'ES' },
    { key: 'it',  flag: 'it', chip: 'Italy',       code: 'IT',  t: 'Italy',       m: 'IT' },
    { key: 'fr',  flag: 'fr', chip: 'France',      code: 'FR',  t: 'France',      m: 'FR' },
    { key: 'nld', flag: 'nl', chip: 'Netherlands', code: 'NLD', t: 'Netherlands', m: 'NLD · Early Launch', launchPill: 'Launch' }
  ],

  // ---- Brand palette (written to :root CSS variables at runtime) ----
  // Keys map to --<key>. Change these to reskin a client; no CSS edits needed.
  brand: {
    'brand': '#404935', 'brand2': '#333c28',
    'accent': '#ffe746', 'accent-l': '#fffde7', 'accent-m': '#fff176',
    'bg': '#f1ece6', 'surface': '#ffffff', 'surface2': '#f7f4f0',
    'border': '#e0d9d0', 'text': '#404935', 'muted': '#6b7160', 'muted2': '#a7ab90',
    'green': '#2d6a4f', 'green-bg': '#eaf4ef', 'green-b': '#95d5b2',
    'red': '#b5373a', 'red-bg': '#fdf0f0', 'red-b': '#f5b8b9',
    'amber': '#92660a', 'amber-bg': '#fdf6e7', 'amber-b': '#f5d98a',
    'blue': '#1e4fa0', 'blue-bg': '#edf2fc', 'blue-b': '#b3c9f0'
  },

  // ---- Live data source ----
  // type: 'static' (data.js only) | 'appsScript' (Google Sheets proxy) | 'merchantSpring' (Phase 2+)
  dataSource: {
    type: 'appsScript',
    url: 'https://script.google.com/macros/s/AKfycbygyf0FT3jCCBKHle-IJuiocBebz5dn2squMMdza8v4ViLP8Vn3l9fK94CxJogqf5WDdw/exec'
  }
};
