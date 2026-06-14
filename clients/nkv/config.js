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
    scopeLabel: 'UK',                         // replaces the template's '.cfg-scope' default ('All EU')
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
  // 'pnl' (the real P&L & Expenses page) hidden for now — Amazon P&L is shown as a maintenance
  //   stub instead (see maintenancePages). The real P&L data still lives baked in data.js, ready
  //   to expose later by removing 'pnl' here and dropping 'amazonpnl' from maintenancePages.
  hiddenPages: ['keywords', 'pnl'],

  // Pages routed to the shared "under maintenance" stub (nav item shows, content is the stub).
  // 'amazonpnl' → the Amazon P&L tab reads "closed for maintenance" until we go live with it.
  maintenancePages: ['amazonpnl'],

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

  // ---- Live data source (LIVE) ----
  // overlay:'sections' fetches the Apps Script proxy (via JSONP) and merges ONLY the live
  // sheet-controlled sections (overview tasks/flags, advertising budgets/forecast) onto the baked
  // data — the MerchantSpring sections + dateRanges in data.js are left untouched.
  // Proxy source: nkv-sheet-proxy.gs (lives at the repo ROOT, outside dashboard/ — it's deployed in
  // Google Apps Script, NOT served from GitHub). It reads the NATIVE Google Sheet copy of the
  // "NKV Beauty Account Tracker" (id 15h_Eo36PhnyX-a4cOlo6yvyhLwS2U9BDbz1fcnruwE4 · "Projects" tab).
  // data.js still holds a static snapshot of these sections as the fallback if the proxy is down.
  dataSource: {
    type: 'appsScript',
    overlay: 'sections',
    url: 'https://script.google.com/macros/s/AKfycbwhuC4YZZNmyNZZkKEW3iWRz9oQCVCJblKpNcS3Tkh3ZL8DWgCtsa9OGhQXm8ycr-nDwg/exec'
  }
};
