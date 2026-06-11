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
    logoWidth: '110px',                     // square TD emblem — keep compact in the sidebar
    footer: {
      cadence: 'Updated monthly',
      next: 'Next: 1 Jun 2026',
      managedBy: 'Managed by TD Strategists'
    }
  },

  // ---- Defaults ----
  defaultPeriod: 'may',
  defaultMarket: 'all',

  // Pages to hide for this client (nav item + tab + page).
  // 'keywords' dropped — MerchantSpring's MCP exposes no keyword-level data (revisit).
  // 'pnl' hidden — the full P&L is gated behind the Advanced tier; the 'amazonpnl' upsell page shows instead.
  hiddenPages: ['keywords', 'pnl'],

  // ---- Date-range selector (drives the topbar dropdown) ----
  // Matches the demo's generic 4-option set. ('2025' still exists in data.js but is not selectable.)
  dateRangeOptions: [
    { value: 'may', label: 'Last Month' },
    { value: '3m',  label: 'Last 3 Months' },
    { value: '6m',  label: 'Year to Date' },
    { value: '12m', label: 'Last 12 Months' }
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
  // MerchantSpring data is baked into data.js (snapshot, via tools/build-amacx-data.ps1).
  // overlay:'sections' = fetch the Apps Script proxy on load and merge ONLY the live sheet-controlled
  // sections (ad budgets/forecast, overview tasks/flags) onto the baked sections — the MerchantSpring
  // sections + dateRanges are NOT touched. So Sheet edits to budgets/scope show on reload.
  dataSource: {
    type: 'appsScript',
    overlay: 'sections',
    url: 'https://script.google.com/macros/s/AKfycby2TWWWDLSY_r1_S9ZHSASB-XFRnkYUx5yMxMBIYRlBLjjbRlG2m0wEn7zvPoMIWg9jfw/exec'
  }
};
