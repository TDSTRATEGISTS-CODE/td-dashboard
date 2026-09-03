/* Balance 8 — client config. Loaded as window.DASHBOARD_CONFIG.
   Amazon-only, UK marketplace. Two brands under one seller account: "BrainMatter" (nootropic
   supplements, launched Sep 2025) and "WIRED" (sports-nutrition — creatine + electrolytes — new
   line, first sales Aug 2026). Digital Dash tier (NOT Executive yet) — the Amazon P&L page is
   shown as the locked "Executive Subscription" paywall gate, exactly like Abimax/NKV.
   Everything here is client-specific. To add a client, copy this folder and edit this file. */
window.DASHBOARD_CONFIG = {

  // ---- Identity ----
  client: {
    name: 'Balance 8',                        // sidebar client name
    title: 'Balance 8 — TD Strategists',      // browser tab <title>
    portalLabel: 'CLIENT PORTAL',             // small label under the logo
    reportPeriodLabel: 'August 2026 · Monthly Report',
    scopeLabel: 'UK',                         // replaces the template's '.cfg-scope' default ('All EU')
    currencyIcon: '&#163;',                   // £ — used for the P&L nav icon (currency:true pages)
    logo: 'td-logo.png',                      // per-client fallback (unused while logoSrc is set)
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

  // Uses the default 'amazon' template page set (no custom `pages` needed):
  //   overview · pnl · advertising · inventory · products · keywords · amazonpnl
  // 'keywords' + the real 'pnl' page are hidden below; 'amazonpnl' stays as the locked P&L gate.
  template: 'amazon',

  // Pages to hide for this client (nav item + tab + page).
  // 'keywords' dropped — MerchantSpring's MCP exposes no keyword-level data (matches AMACX/NKV/Abimax).
  // 'pnl' (the real P&L & Expenses page) hidden per brief ("no P&L for now") — Balance 8 is on the
  //   Digital Dash tier, so the Amazon P&L shows as the locked paywall blocker (page-amazonpnl) instead
  //   of the full renderer. The real P&L data still lives baked in data.js (sections.pnl), ready to
  //   expose the day Balance 8 wants it: drop 'pnl' from hiddenPages and repoint the nav at the real
  //   renderer.
  hiddenPages: ['keywords', 'pnl'],

  // Nothing routes to the generic "under maintenance" stub. The Amazon P&L page (amazonpnl) routes to
  // its dedicated Executive-Subscription paywall gate in index.html, not this stub.
  maintenancePages: [],

  // No budget/forecast sheet supplied for Balance 8 yet, so sections.advertising deliberately omits
  // `budgets`/`forecast` (see data.js comment — real number, not fabricated). Both cards are
  // hardcoded EU/AMACX placeholder markup in index.html that only gets overwritten when that data is
  // present (see README → "Per-client layout"), so they must be hidden here rather than left to leak
  // wrong-client numbers onto a live Advertising page. Re-enable by removing this hide once a real
  // budget exists (tools/balance8-sheet-proxy.gs).
  layout: { hide: ['sec-adbudget-forecast'] },

  // ---- Date-range selector (drives the topbar dropdown) ----
  // Balance 8 has real trading history back to Sep 2025, but sales dropped to zero Mar–Jul 2026
  // (confirmed via per-SKU pull, not a reporting gap) before the Aug 2026 WIRED relaunch — so
  // "Last 12 Months" (not "Since Launch") is the honest widest window: it shows the Sep–Jan build,
  // the Mar–Jul gap, and the Aug recovery, rather than implying a clean straight-line launch.
  dateRangeOptions: [
    { value: 'may', label: 'Last Month' },
    { value: '3m',  label: 'Last 3 Months' },
    { value: '12m', label: 'Last 12 Months' }
  ],

  // ---- Markets (sidebar chips, market switching, topbar labels) ----
  // Single marketplace: Amazon UK. One chip → the dashboard never re-scopes, so no per-market KPIs
  // or market-maintenance gating are needed (contrast NKV's UK/IE/US setup).
  markets: [
    { key: 'all', flag: 'gb', chip: 'United Kingdom', code: 'All Marketplaces', t: 'Balance 8', m: 'Amazon UK' }
  ],

  // ---- Brand palette (written to :root CSS variables at runtime) ----
  // Shared house palette = Harvaza colour layout (deep green + gold) across all clients.
  brand: {
    'brand': '#2C3420', 'brand2': '#222a18',
    'accent': '#C8A84B', 'accent-l': '#f6efd9', 'accent-m': '#d8bd6a',
    'bg': '#F5F2EC', 'surface': '#ffffff', 'surface2': '#faf9f7',
    'border': '#e0dcd5', 'text': '#2C3420', 'muted': '#6b7160', 'muted2': '#a7ab90',
    'green': '#3B6D11', 'green-bg': '#edf6e8', 'green-b': '#9fce86',
    'red': '#A32D2D', 'red-bg': '#fdf0f0', 'red-b': '#f5b8b9',
    'amber': '#7a5c1e', 'amber-bg': '#fdf6e7', 'amber-b': '#f5d98a',
    'blue': '#1e4fa0', 'blue-bg': '#edf2fc', 'blue-b': '#b3c9f0'
  },

  // ---- Live data source ----
  // LIVE — tools/balance8-sheet-proxy.gs deployed against the "Project Scope" tab of the tracker
  // (https://docs.google.com/spreadsheets/d/1iaOHJ-LilSL7geqUxy07u7V_J7rvG1ez49zg6nRDLU8). overlay:
  // 'sections' merges ONLY the live sheet-controlled Overview scope board (tasksSpec/flagsSpec/
  // completedSpec) onto the baked data.js — the MerchantSpring-derived dateRanges/pnl/advertising/
  // inventory/products sections are untouched. If the proxy is unreachable, app.js keeps the baked
  // Overview fallback in data.js.
  dataSource: {
    type: 'appsScript',
    overlay: 'sections',
    url: 'https://script.google.com/macros/s/AKfycbxl3wvaelUU2AB5brjUpbdUh-g6F084ZNR2zJ-DSl3quQuE-79yr5D-DXX7msB3PjY2/exec'
  }
};
