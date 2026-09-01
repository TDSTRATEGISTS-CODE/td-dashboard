/* NKV Beauty — client config. Loaded as window.DASHBOARD_CONFIG.
   Full Service client (contacts: Nailah & Kavitha). UK is the live trading market;
   Ireland is early-stage (no ads); USA placed its first real sales in June 2026.
   Everything here is client-specific. To add a client, copy this folder and edit this file. */
window.DASHBOARD_CONFIG = {

  // ---- Identity ----
  client: {
    name: 'NKV Beauty',                       // sidebar client name
    title: 'NKV Beauty — TD Strategists',     // browser tab <title>
    portalLabel: 'CLIENT PORTAL',             // small label under the logo
    reportPeriodLabel: 'August 2026 · Monthly Report',
    scopeLabel: 'UK',                         // replaces the template's '.cfg-scope' default ('All EU')
    currencyIcon: '£',                        // NKV trades in GBP — was missing, so the P&L icon and the
                                               // Revenue Trend / Ad Spend vs TACOS charts (app.js moneyK)
                                               // fell back to the shared template's € default
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

  // Page order for NKV. Mirrors the 'amazon' template but inserts the new 'shopify' page (D2C
  // performance) just before the locked Amazon P&L. Declaring `pages` here (rather than adding
  // 'shopify' to the shared template) keeps the Shopify page NKV-only — it stays hidden for every
  // other client until they opt in the same way. 'keywords' + 'pnl' are still removed via hiddenPages.
  pages: ['overview', 'pnl', 'advertising', 'inventory', 'products', 'keywords', 'shopify', 'shopifypnl', 'amazonpnl'],

  // Pages to hide for this client (nav item + tab + page).
  // 'keywords' dropped — MerchantSpring's MCP exposes no keyword-level data (matches AMACX).
  // 'pnl' (the real P&L & Expenses page) hidden for now — Amazon P&L is shown as the locked paywall
  //   blocker (page-amazonpnl) instead. The real P&L data still lives baked in data.js, ready to
  //   expose later by removing 'pnl' here and pointing the 'amazonpnl' nav at the real renderer.
  hiddenPages: ['keywords', 'pnl'],

  // Pages shown as the locked "paywall blocker" (Executive Subscription upsell) rather than their full
  // data view. Both P&L pages route to a dedicated paywall gate, NOT the generic maintenance stub:
  //   • 'amazonpnl'  → page-amazonpnl  (the Amazon P&L upsell block in index.html).
  //   • 'shopifypnl' → page-shopifypnl, whose real builder + live data stay intact in data.js /
  //     nkv-sheet-proxy.gs but are hidden behind the gate (#spnl-locked) — drop the gate to expose.
  // maintenancePages is now empty: nothing routes to the generic "under maintenance" stub.
  maintenancePages: [],

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
    { key: 'usa', flag: 'us', chip: 'United States',   code: 'USA', t: 'United States',   m: 'USA · Recently Launched', launchPill: 'New' }
  ],

  // Per-market page maintenance: selecting these markets shows a maintenance banner on the listed
  // pages instead of their content. Ireland (early stage) and USA (not launched) have no live ad
  // account yet, so their Advertising page is gated. See applyMarketMaintenance() in app.js.
  marketMaintenance: { irl: ['advertising'], usa: ['advertising'] },

  // Per-client layout tweaks (applyClientLayout() in app.js). Overview: drop the Buy Box widget,
  // move the Stock Warnings card into that slot, and relabel it FBA-only (Amazon FBA stock — not
  // Shopify or warehouse). Advertising: stack Ad Spend Actuals under the trend chart to fill the
  // gap, move the campaign-type pie beside Ad Metrics, and hide the Ad Budgets + Forecast section
  // (Ad Budgets by Market + Ad Spend Forecast — not helpful for NKV; kept for AMACX).
  layout: {
    relabel: [
      { id: 'sec-stockwarn-card', title: '&#128230; FBA Stock Warnings', sub: 'Amazon FBA &middot; low &amp; out of stock' }
    ],
    stockToBuyBoxSlot: true,
    actualsUnderChart: true,
    pieIntoAdGrid: true,
    hide: ['sec-buybox-card', 'sec-campaign-mix-row', 'sec-adbudget-forecast']
  },

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
    url: 'https://script.google.com/macros/s/AKfycbxI6OBbwmEARX7-LzF_XzyOTKAL2AbIIDl8xeUWl0-be7rL10JXi2GbgPxnEagN4o7Cww/exec'
  }
};
