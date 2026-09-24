/* Abimax — client config. Loaded as window.DASHBOARD_CONFIG.
   Amazon-only, USA marketplace. Single brand (Magnostream magnetic water descalers), launched on
   Amazon US in March 2026 and scaling. Executive tier (upgraded from Digital Dash, Sep 2026) — the
   Amazon P&L page is now ACTIVE: the full MerchantSpring financial P&L (settled basis) renders per
   timeline (Last Month / Last 3 Months / Since Launch); the locked "Executive Subscription" paywall
   gate (amazonpnl) is hidden.
   Everything here is client-specific. To add a client, copy this folder and edit this file. */
window.DASHBOARD_CONFIG = {

  // ---- Identity ----
  client: {
    name: 'Abimax',                           // sidebar client name
    title: 'Abimax — TD Strategists',         // browser tab <title>
    portalLabel: 'CLIENT PORTAL',             // small label under the logo
    reportPeriodLabel: 'August 2026 · Monthly Report',
    scopeLabel: 'US',                         // replaces the template's '.cfg-scope' default ('All EU')
    currencyIcon: '&#36;',                    // $ — used for the P&L nav icon (currency:true pages)
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
  // 'keywords' + the paywall gate 'amazonpnl' are hidden below; the real 'pnl' page is now ACTIVE.
  template: 'amazon',

  // Relabel the real P&L page "Amazon P&L" so the nav matches what the client saw on the paywall gate
  // (the amazon template's default label for 'pnl' is "P&L & Expenses").
  pageLabels: { pnl: 'Amazon P&L' },

  // Pages to hide for this client (nav item + tab + page).
  // 'keywords' dropped — MerchantSpring's MCP exposes no keyword-level data (matches AMACX/NKV).
  // 'amazonpnl' (the locked "Executive Subscription" paywall gate) hidden — Abimax upgraded to the
  //   Executive tier (Sep 2026), so the real 'pnl' page (full MerchantSpring financial P&L, per
  //   timeline) renders instead. To revert to Digital Dash: swap back to hiddenPages ['keywords','pnl'].
  hiddenPages: ['keywords', 'amazonpnl'],

  // Nothing routes to the generic "under maintenance" stub. The Amazon P&L page (amazonpnl) routes to
  // its dedicated Executive-Subscription paywall gate in index.html, not this stub.
  maintenancePages: [],

  // ---- Date-range selector (drives the topbar dropdown) ----
  // Abimax launched on Amazon US in March 2026, so "Since Launch" (Mar–Jun) is the widest honest
  // window — a 12-month option would just repeat it (no pre-March sales).
  dateRangeOptions: [
    { value: 'may', label: 'Last Month' },
    { value: '3m',  label: 'Last 3 Months' },
    { value: '6m',  label: 'Since Launch' }
  ],

  // ---- Markets (sidebar chips, market switching, topbar labels) ----
  // Single marketplace: Amazon US. One chip → the dashboard never re-scopes, so no per-market KPIs
  // or market-maintenance gating are needed (contrast NKV's UK/IE/US setup).
  // key / flag / chip / code / t / m as documented in README "Sidebar market filter".
  markets: [
    { key: 'all', flag: 'us', chip: 'United States', code: 'All Marketplaces', t: 'Abimax', m: 'Amazon US' }
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

  // ---- Live data source (LIVE) ----
  // Baked MerchantSpring snapshot (channel 106785689, seller A267LLT9LT0HS9, Amazon US, native USD);
  // a monthly re-bake refreshes data.js directly.
  //
  // overlay:'sections' fetches the Apps Script proxy (via JSONP) and merges ONLY the live
  // sheet-controlled sections onto the baked data — here that's the Overview scope board
  // (sections.overview: In Progress / Upcoming / Completed). The baked dateRanges + MerchantSpring
  // sections in data.js are left untouched, and the baked overview tasks/flags/completed remain the
  // fallback if the proxy is down.
  // Proxy source: tools/abimax-sheet-proxy.gs (deployed in Google Apps Script, NOT served from
  // GitHub). It reads the Abimax project tracker (Google Sheet
  // 1Fg_ZKND-7OWqipOkhOtXUA1y4w019280IuXD0slK0GY). After editing the .gs, redeploy a NEW version
  // (Deploy ▸ Manage deployments ▸ edit ▸ New version) to keep this same /exec URL.
  dataSource: {
    type: 'appsScript',
    overlay: 'sections',
    url: 'https://script.google.com/macros/s/AKfycbxUvKvcHrgQswsnUWG4alYwt7Lv_o0ZLybJJKjtTstPGLMtb46Eqe6Or-EVUZqIaJeB6g/exec'
  }
};
