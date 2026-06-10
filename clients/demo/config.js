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
    { value: 'may', label: 'Last Month' },
    { value: '3m',  label: 'Last 3 Months' },
    { value: '6m',  label: 'Year to Date' },
    { value: '12m', label: 'Last 12 Months' }
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

  // ---- Brand palette ----
  // Intentionally omitted: every account currently shares the house TD theme defined in
  // index.html :root (olive/yellow). Add a `brand: {...}` block here later to white-label
  // this client without touching the template.

  // ---- Live data source ----
  // Demo is fully self-contained: data.js only, no proxy.
  dataSource: {
    type: 'static'
  }
};
