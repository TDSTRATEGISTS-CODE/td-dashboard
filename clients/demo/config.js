/* Demo Brand UK — client config. Loaded as window.DASHBOARD_CONFIG.
   UK-only demonstration client (static data, GBP). Copy this folder + edit to spin up a real client. */
window.DASHBOARD_CONFIG = {

  // ---- Identity ----
  client: {
    name: 'Demo Brand UK',                     // sidebar client name
    title: 'Demo Brand UK — TD Strategists',   // browser tab <title>
    portalLabel: 'CLIENT PORTAL',              // small label under the logo
    reportPeriodLabel: 'May 2026 · Monthly Report',
    logo: 'logo.svg',                          // file inside this client folder
    logoAlt: 'Demo Brand UK',
    logoBlend: '',                             // SVG is light-on-dark already — no blend trick needed
    scopeLabel: 'All UK',                      // replaces every .cfg-scope span ("All EU" → "All UK")
    currencyIcon: '£',                         // P&L nav icon (€ → £)
    footer: {
      cadence: 'Updated monthly',
      next: 'Next: 1 Jul 2026',
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

  // ---- Markets ----
  // UK-only: the switcher is repurposed as UK SALES CHANNELS rather than countries.
  // flag stays 'gb' on every chip so the demo reads as a single UK account.
  // code : matches the first column of dateRanges mktRows (for chip revenue)
  markets: [
    { key: 'all',  flag: 'gb', chip: 'All UK',        code: 'All Channels', t: 'UK Overview',   m: 'All Channels' },
    { key: 'amz',  flag: 'gb', chip: 'Amazon UK',     code: 'Amazon UK',    t: 'Amazon UK',     m: 'Amazon.co.uk' },
    { key: 'ebay', flag: 'gb', chip: 'eBay UK',       code: 'eBay UK',      t: 'eBay UK',       m: 'eBay.co.uk' },
    { key: 'd2c',  flag: 'gb', chip: 'D2C · Shopify', code: 'D2C',          t: 'D2C · Shopify', m: 'Direct-to-Consumer' }
  ],

  // ---- Brand palette (written to :root CSS variables at runtime) ----
  // Fresh navy/teal scheme so the demo reads as a distinct client from AMACX.
  brand: {
    'brand': '#1f2a44', 'brand2': '#161f33',
    'accent': '#38bdf8', 'accent-l': '#eff6ff', 'accent-m': '#7dd3fc',
    'bg': '#f1f5f9', 'surface': '#ffffff', 'surface2': '#f8fafc',
    'border': '#e2e8f0', 'text': '#1e293b', 'muted': '#64748b', 'muted2': '#94a3b8',
    'green': '#15803d', 'green-bg': '#ecfdf5', 'green-b': '#86efac',
    'red': '#b91c1c', 'red-bg': '#fef2f2', 'red-b': '#fca5a5',
    'amber': '#b45309', 'amber-bg': '#fffbeb', 'amber-b': '#fcd34d',
    'blue': '#1d4ed8', 'blue-bg': '#eff6ff', 'blue-b': '#bfdbfe'
  },

  // ---- Live data source ----
  // Demo is fully self-contained: data.js only, no proxy.
  dataSource: {
    type: 'static'
  }
};
