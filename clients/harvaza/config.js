/* Harvaza Ltd (Bervera) — client config. Loaded as window.DASHBOARD_CONFIG.
   FOUNDER-template client: founder-native pages (Overview / P&L Detail / Stock & COGS /
   Director's Loan) plus the Amazon analytics pages exposed as maintenance stubs until built.
   Static Year-1 forecast for now — structured so Amazon-MCP (US + UK), then a Google-Sheet
   overlay, then Shopify can drop in later via dataSource + a build-harvaza-data.ps1 baker. */
window.DASHBOARD_CONFIG = {

  // ---- Identity ----
  client: {
    name: 'Harvaza Ltd',                          // sidebar client name
    title: 'Harvaza Ltd — TD Strategists',        // browser tab <title>
    portalLabel: 'CLIENT PORTAL',                 // small label under the logo
    reportPeriodLabel: 'Jun 2026 · Year 1 Forecast',
    logo: 'logo.svg',                             // per-client fallback (unused while logoSrc is set)
    logoSrc: 'td-logo.png',                       // shared TD logo for now (dashboard/td-logo.png)
    logoAlt: 'TD Strategists',
    logoBlend: '',
    logoWidth: '110px',
    scopeLabel: 'All Channels',                   // replaces every .cfg-scope span
    currencyIcon: '£',                            // P&L nav icon (GBP)
    statusBadge: 'Forecast',                      // topbar badge (static forecast, not a live feed)
    footer: {
      cadence: 'Updated Monthly',
      autoNext: true,             // always the 5th of next month (computed at load)
      managedBy: 'Managed by TD Strategists'
    }
  },

  // ---- Template ----
  // 'founder' = founder-native pages + all Amazon pages (as maintenance stubs). The founder pages
  // live in the shared shell, so they can be offered to other clients later.
  template: 'founder',

  // ---- Defaults ----
  // Default to actuals ('last30') so the Amazon pages label correctly; Forecast stays selectable.
  // Founder pages render from sections.founder regardless of the selected period.
  defaultPeriod: 'last30',
  defaultMarket: 'all',

  // Keywords hidden — MerchantSpring exposes no keyword-level data. The shared 'pnl' page (real P&L
  // renderer) is relabelled "Amazon P&L" and shows the live Amazon settlement P&L (sections.pnl).
  hiddenPages: ['keywords'],
  pageLabels: { pnl: 'Amazon P&L' },

  // ---- Date-range selector ----
  // Single Year-1 forecast window for now. Add periods here once actuals start flowing.
  dateRangeOptions: [
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'fy',     label: 'Year 1 Forecast' }
  ],

  // ---- Markets (sidebar chips) ----
  // Structured for the data roadmap: UK carries the Year-1 forecast; US is a placeholder ('Soon')
  // until launch. code matches dateRanges mktRows col 0; each maps to an Amazon marketplace later.
  markets: [
    { key: 'all', flag: 'gb', chip: 'Harvaza (All)', code: 'All', t: 'Harvaza — Overview', m: 'All Channels' },
    { key: 'uk',  flag: 'gb', chip: 'Harvaza UK',    code: 'UK',  t: 'Harvaza UK',          m: 'Amazon UK' },
    { key: 'us',  flag: 'us', chip: 'Harvaza US',    code: 'US',  t: 'Harvaza US',          m: 'Amazon US', launchPill: 'Soon' }
  ],

  // ---- Brand palette (written to :root CSS variables at runtime) ----
  // Harvaza olive + gold, matching the Bervera mockup. Reskins the whole shell; no CSS edits.
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
  // Google-Sheet "Founder Dashboard" → Apps Script proxy (see dashboard/tools/harvaza-sheet-proxy.gs).
  // overlay:'founder' deep-merges the sheet-derived financials (overview KPIs + chart, P&L KPIs/chart/
  // table) onto the baked sections.founder; static parts (tasks, milestones, loan, stock) are kept.
  // PASTE the deployed web-app /exec URL into `url`. While blank, the proxy is skipped and the baked
  // data.js renders (safe fallback) — so nothing breaks until the script is live.
  dataSource: {
    type: 'appsScript',
    overlay: 'founder',
    url: 'https://script.google.com/macros/s/AKfycbx7ceZT4cLJz3ACx5sBIITyTj-Slflb9cb1J99sx24UlxvrVEF6vGoD4PDMW7CpXCoF0A/exec'
  }
};
