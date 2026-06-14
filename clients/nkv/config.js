/* NKV Beauty — client config. Loaded as window.DASHBOARD_CONFIG.
   Full Service client (contacts: Nailah & Kavitha). UK is the live trading market;
   Ireland is early-stage (no ads); USA is a placeholder until a US channel is connected.
   Everything here is client-specific. To add a client, copy this folder and edit this file. */
window.DASHBOARD_CONFIG = {

  // ---- Identity ----
  client: {
    name: 'NKV Beauty',                       // sidebar client name
    title: 'NKV Beauty — TD Strategists',     // browser tab <title>
    portalLabel: 'CLIENT PORTAL',             // small label under the logo
    reportPeriodLabel: 'May 2026 · Monthly Report',
    logo: 'logo.jpg',                         // per-client fallback (unused while logoSrc is set)
    logoSrc: 'td-logo.png',                   // shared TD logo for now (all clients) — dashboard/td-logo.png
    logoAlt: 'TD Strategists',
    logoBlend: '',                            // TD SVG is light-on-dark — no blend trick needed
    logoWidth: '110px',                       // square TD emblem — keep compact in the sidebar
    footer: {
      cadence: 'Updated Monthly',
      autoNext: true,            // always the 5th of next month (computed at load)
      managedBy: 'Managed by TD Strategists'
    }
  },

  // ---- Defaults ----
  defaultPeriod: 'may',
  defaultMarket: 'all',

  // Pages to hide for this client (nav item + tab + page).
  // 'keywords' dropped — MerchantSpring's MCP exposes no keyword-level data (matches AMACX).
  // 'amazonpnl' (locked upsell) dropped — NKV is Full Service and gets the REAL 'pnl' page instead,
  // populated from MerchantSpring's store P&L (COGS held there). Mirrors the demo client.
  hiddenPages: ['keywords', 'amazonpnl'],

  // ---- Date-range selector (drives the topbar dropdown) ----
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
    { key: 'all', flag: 'gb', chip: 'All Markets',    code: 'All Marketplaces', t: 'NKV Beauty',     m: 'All Marketplaces' },
    { key: 'uk',  flag: 'gb', chip: 'United Kingdom',  code: 'UK',  t: 'United Kingdom', m: 'UK' },
    { key: 'irl', flag: 'ie', chip: 'Ireland',         code: 'IRL', t: 'Ireland',        m: 'IRL · Early Stage', launchPill: 'New' },
    { key: 'usa', flag: 'us', chip: 'United States',   code: 'USA', t: 'United States',   m: 'USA · Not Launched', launchPill: 'Soon' }
  ],

  // ---- Brand palette (written to :root CSS variables at runtime) ----
  // Default TD Strategists palette (no client override supplied yet for NKV).
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
  // NKV has no Google Sheet / Apps Script proxy yet, so the dashboard runs purely off the
  // baked static data below. Switch type to 'appsScript' + overlay 'sections' once a tracker
  // sheet + proxy are deployed for NKV (see AMACX config for the pattern).
  dataSource: {
    type: 'static'
  }
};
