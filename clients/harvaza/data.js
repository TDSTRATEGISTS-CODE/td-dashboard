/* Harvaza Ltd (Bervera) — client data. Loaded as window.DASHBOARD_DATA.
   Static Year-1 forecast (Jun 2026 – May 2027), baked from the founder model. The shell reads
   `sections.founder` to render the four founder pages. Amazon pages show the maintenance stub.
   When live data arrives: UK Amazon actuals (MCP) overlay the monthly P&L + stock; the Google
   Sheet supplies forecast/budgets; Shopify adds a channel section. Keep this shape stable. */
window.DASHBOARD_DATA = {

  // Minimal date-range entry so the shell's switchDateRange paints the topbar + sidebar chips.
  // Founder KPIs are rendered from sections.founder, not from these fields.
  dateRanges: {
    // Amazon ACTUALS lenses (MerchantSpring pulled 2026-11-05). Sales/units/orders/AOV/ad spend/ad sales
    // are per-month native-currency sums from getSalesByPeriod's daily interval (same workaround as prior
    // bakes). October daily sums reconcile to the penny with getSalesByProduct per-SKU totals (UK £1,716.26 /
    // US $390.25 / UK ad spend £474.34) and with getStoreProfitAndLoss ad spend. October UK daily ad SALES
    // (£973.00) is £32.99 above the per-SKU sum (£940.01) — account-level attribution, daily basis kept.
    // 3m = Aug+Sep+Oct reconciled to getSalesByProduct over Aug 1–Oct 31 (UK £4,532.26 / US $1,261.66 /
    // spend £894.03). 6m = Year-to-date reconciled to getSalesByProduct over Jan 1–Oct 31 (UK £13,594.40 /
    // US $3,789.30). YTD spend £1,492 is the monthly basis that matches the P&L card and ad chart (this
    // resolves the old £13 Jan–Aug gap in the headline).
    // SEPTEMBER RESTATED: MerchantSpring now shows Sep UK sales £1,469.31 (baked last month £1,502.30) — one
    // £32.99 order has since dropped out of the report; Sep UK units 56 / orders 47 (orders −1 assumed), UK
    // ad spend £191.43, UK COGS now £522 (was £476 — 6×200ml COGS has been entered). Oct MoM deltas compare
    // against the restated September. YTD CVR denominators are rebuilt from the stored CVR% (±0.3pt) plus the
    // exact October page views (UK 927 / US 661).
    // Oct headline vs Sep: UK sales +16.8%, UK ad spend +146% (£474 vs £191 — Ryan confirmed the Oct ad
    // ramp is intentional), UK ad sales +109%, TACOS 27.6% (Sep 12.8%), UK orders 79 vs 47 (+68%, ad-driven),
    // US sales +28.7%. US Oct net margin collapses to ~0% on $119 of refunds in the month (accrual).
    // Chip totals (mktRows col 6) = per-period ACTUAL sales (UK £, US $). 'all' chip (rev) = UK £ total (US is a
    // separate currency, not summed). Forecast is NOT here — it lives on the P&L Detail page.
    // Per-period sec.products overrides the top-level (last-month) Products section.
    may: {
      label: 'Last Month · October 2026', shortLabel: 'October 2026',
      rev: '£1,716', revD: '▲ vs £1,469 Sep', revC: 'du', revS: 'Amazon UK actual',
      spend: '£474', spendD: 'October 2026', spendC: 'df', spendS: 'ACOS 48.8%',
      tacosAd: '27.6%', tacosAdD: 'October', tacosAdC: 'df', tacosAdS: '£474 spend',
      roasAd: '2.05×', roasAdD: 'October', roasAdC: 'df', roasAdS: '£973 ad sales',
      aov: '£21.73', aovD: '▼ vs £31.26 Sep', aovC: 'dd', aovS: 'UK · 79 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£474', 'br', '▲ no budget', '£1,716', 'ba', '27.6%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$390', 'bg', '—'],
        ['Total', '', '£0', '£474', 'br', '▲ over', '£1,716', 'ba', '27.6%']
      ],
      adChart: { max: 500, yTicks: ['£500','£375','£250','£125','£0'], xLabels: ['May','Jun','Jul','Aug','Sep','Oct'], xHighlight: '#2C3420', series: [{ values: [0,0,110,228,191,474], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      revBreakChart: { max: 2000, yTicks: ['£2k','£1.5k','£1k','£0.5k','£0'], xLabels: ['Oct'], series: [{ color: '#2C3420', values: [973] }, { color: '#a7ab90', values: [700] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] }
    },
    '3m': {
      label: 'Last 3 Months · Aug–Oct 2026', shortLabel: 'Aug–Oct 2026',
      rev: '£4,532', revD: '3-month actuals', revC: 'df', revS: 'Amazon UK actual',
      spend: '£894', spendD: 'Aug–Oct', spendC: 'df', spendS: 'ACOS 43.3%',
      tacosAd: '19.7%', tacosAdD: 'Aug–Oct', tacosAdC: 'df', tacosAdS: '£894 spend',
      roasAd: '2.31×', roasAdD: 'Aug–Oct', roasAdC: 'df', roasAdS: '£2,066 ad sales',
      aov: '£27.47', aovD: '3-month avg', aovC: 'df', aovS: 'UK · 165 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£894', 'br', '▲ no budget', '£4,532', 'ba', '19.7%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$1,262', 'bg', '—'],
        ['Total', '', '£0', '£894', 'br', '▲ over', '£4,532', 'ba', '19.7%']
      ],
      adChart: { max: 500, yTicks: ['£500','£375','£250','£125','£0'], xLabels: ['May','Jun','Jul','Aug','Sep','Oct'], xHighlight: '#2C3420', series: [{ values: [0,0,110,228,191,474], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      revBreakChart: { max: 2000, yTicks: ['£2k','£1.5k','£1k','£0.5k','£0'], xLabels: ['Aug','Sep','Oct'], series: [{ color: '#2C3420', values: [627,466,973] }, { color: '#a7ab90', values: [694,941,700] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] },
      sec: {
        overviewActuals: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£4,532', dCls: 'df', d: '3-month actuals', s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$1,262', dCls: 'df', d: '3-month actuals', s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '233', dCls: 'df', d: 'UK 165 · US 68', s: 'Aug–Oct' },
            { bar: '#C8A84B', lbl: 'Units',    val: '254', dCls: 'df', d: 'UK 182 · US 72', s: 'Aug–Oct' }
          ],
          cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 9, valText: '9.4%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 4, valText: '3.8%', color: 'amber' }
          ]
        },
        products: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£4,532', dCls: 'df', d: '3-month actuals', s: 'Aug–Oct' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '233', dCls: 'df', d: 'UK 165 · US 68', s: 'Aug–Oct' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '254', dCls: 'df', d: 'UK 182 · US 72', s: 'Aug–Oct' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£27.47', dCls: 'df', d: '3-month avg', s: 'US $18.55' }
          ],
          table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£4,532', units: '182', orders: '165', cvr: '9.4%', cvrCls: 'bg', aov: '£27.47' },
            { flag: 'us', name: 'Amazon US', revenue: '$1,262', units: '72', orders: '68', cvr: '3.8%', cvrCls: 'br', aov: '$18.55' }
          ]
        },
        pnl: {
          margin: {
        pct: '9.6%', pctColor: 'amber', note: 'Amazon UK · Aug–Oct 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£4,401' },
          { lbl: 'Selling Fees', val: '−£632', color: 'red' },
          { lbl: 'Fulfilment', val: '−£934', color: 'red' },
          { lbl: 'Ad Spend', val: '−£894', color: 'red' },
          { lbl: 'COGS', val: '−£1,514', color: 'red' },
          { lbl: 'Net Profit', val: '£424', color: 'green', strong: true }
        ]
      },
          marginByMarket: {
            uk: {
        pct: '9.6%', pctColor: 'amber', note: 'Amazon UK · Aug–Oct 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£4,401' },
          { lbl: 'Selling Fees', val: '−£632', color: 'red' },
          { lbl: 'Fulfilment', val: '−£934', color: 'red' },
          { lbl: 'Ad Spend', val: '−£894', color: 'red' },
          { lbl: 'COGS', val: '−£1,514', color: 'red' },
          { lbl: 'Net Profit', val: '£424', color: 'green', strong: true }
        ]
      },
            us: {
        pct: '16.2%', pctColor: 'amber', note: 'Amazon US · Aug–Oct 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '$938' },
          { lbl: 'Selling Fees', val: '−$221', color: 'red' },
          { lbl: 'Fulfilment', val: '−$373', color: 'red' },
          { lbl: 'Ad Spend', val: '$0', color: 'red' },
          { lbl: 'COGS', val: '−$200', color: 'red' },
          { lbl: 'Net Profit', val: '$152', color: 'green', strong: true }
        ]
      }
          },
          statement: {
        fixedLabel: 'Amazon UK · Aug–Oct 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£4,564', pct: '103.7%', unit: '£27.66' },
            { lbl: 'Promotions', amount: '−£100', pct: '−2.3%', unit: '−£0.60' },
            { lbl: 'Refunds', amount: '−£168', pct: '−3.8%', unit: '−£1.02' },
            { lbl: 'Other income', amount: '£105', pct: '2.4%', unit: '£0.64' },
            { lbl: 'Net revenue', amount: '£4,401', pct: '100.0%', unit: '£26.67', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£894', pct: '20.3%', unit: '£5.42' },
            { lbl: 'Selling fees', amount: '£632', pct: '14.4%', unit: '£3.83' },
            { lbl: 'Fulfilment and shipping', amount: '£934', pct: '21.2%', unit: '£5.66' },
            { lbl: 'Cost of goods', amount: '£1,514', pct: '34.4%', unit: '£9.17' },
            { lbl: 'Total expenses', amount: '£3,978', pct: '90.4%', unit: '£24.11', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£424', pct: '9.6%', unit: '£2.57', total: true, profit: true },
            { lbl: 'Profit %', amount: '9.6%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '182' },
            { lbl: 'Orders', amount: '165' }
          ] }
        ]
      },
          statementByMarket: {
            uk: {
        fixedLabel: 'Amazon UK · Aug–Oct 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£4,564', pct: '103.7%', unit: '£27.66' },
            { lbl: 'Promotions', amount: '−£100', pct: '−2.3%', unit: '−£0.60' },
            { lbl: 'Refunds', amount: '−£168', pct: '−3.8%', unit: '−£1.02' },
            { lbl: 'Other income', amount: '£105', pct: '2.4%', unit: '£0.64' },
            { lbl: 'Net revenue', amount: '£4,401', pct: '100.0%', unit: '£26.67', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£894', pct: '20.3%', unit: '£5.42' },
            { lbl: 'Selling fees', amount: '£632', pct: '14.4%', unit: '£3.83' },
            { lbl: 'Fulfilment and shipping', amount: '£934', pct: '21.2%', unit: '£5.66' },
            { lbl: 'Cost of goods', amount: '£1,514', pct: '34.4%', unit: '£9.17' },
            { lbl: 'Total expenses', amount: '£3,978', pct: '90.4%', unit: '£24.11', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£424', pct: '9.6%', unit: '£2.57', total: true, profit: true },
            { lbl: 'Profit %', amount: '9.6%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '182' },
            { lbl: 'Orders', amount: '165' }
          ] }
        ]
      },
            us: {
        fixedLabel: 'Amazon US · Aug–Oct 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '$1,276', pct: '136.0%', unit: '$18.76' },
            { lbl: 'Promotions', amount: '−$30', pct: '−3.2%', unit: '−$0.45' },
            { lbl: 'Refunds', amount: '−$301', pct: '−32.1%', unit: '−$4.43' },
            { lbl: 'Other income', amount: '$52', pct: '5.5%', unit: '$0.76' },
            { lbl: 'Other adjustments', amount: '−$58', pct: '−6.2%', unit: '−$0.85' },
            { lbl: 'Net revenue', amount: '$938', pct: '100.0%', unit: '$13.79', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '$0', pct: '0.0%', unit: '$0.00' },
            { lbl: 'Selling fees', amount: '$221', pct: '23.6%', unit: '$3.25' },
            { lbl: 'Fulfilment and shipping', amount: '$373', pct: '39.8%', unit: '$5.48' },
            { lbl: 'Cost of goods', amount: '$200', pct: '21.3%', unit: '$2.94' },
            { lbl: 'Total expenses', amount: '$786', pct: '83.8%', unit: '$11.56', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '$152', pct: '16.2%', unit: '$2.24', total: true, profit: true },
            { lbl: 'Profit %', amount: '16.2%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '72' },
            { lbl: 'Orders', amount: '68' }
          ] }
        ]
      }
          },
          mkt: [
            { name: 'Amazon UK', flag: 'gb', revenue: '£4,401', adspend: '£894', net: '£424', netColor: 'green', margin: '9.6%', marginCls: 'ba' },
            { name: 'Amazon US', flag: 'us', revenue: '$938', adspend: '$0', net: '$152', netColor: 'green', margin: '16.2%', marginCls: 'ba' }
          ]
        },
        advertising: {
          metrics: [
            { lbl: 'Total Spend', val: '£894', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£2,066' },
            { lbl: 'ACOS',        val: '43.3%', color: 'amber' },
            { lbl: 'TACOS',       val: '19.7%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '2.31×', id: 'a-roas' },
            { lbl: 'Avg. CPC',    val: '—' }
          ]
        }
      }
    },
    '6m': {
      label: 'Year to Date · Jan–Oct 2026', shortLabel: 'Jan–Oct 2026',
      rev: '£13,594', revD: 'YTD actuals', revC: 'df', revS: 'Amazon UK actual',
      spend: '£1,492', spendD: 'Jan–Oct', spendC: 'df', spendS: 'ACOS 41.0%',
      tacosAd: '11.0%', tacosAdD: 'Jan–Oct', tacosAdC: 'df', tacosAdS: '£1,492 spend',
      roasAd: '2.44×', roasAdD: 'Jan–Oct', roasAdC: 'df', roasAdS: '£3,636 ad sales',
      aov: '£25.89', aovD: 'YTD avg', aovC: 'df', aovS: 'UK · 525 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£1,492', 'br', '▲ no budget', '£13,594', 'ba', '11.0%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$3,789', 'bg', '—'],
        ['Total', '', '£0', '£1,492', 'br', '▲ over', '£13,594', 'ba', '11.0%']
      ],
      adChart: { max: 500, yTicks: ['£500','£375','£250','£125','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'], xHighlight: '#2C3420', series: [{ values: [0,0,207,281,0,0,110,228,191,474], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      revBreakChart: { max: 3000, yTicks: ['£3k','£2.25k','£1.5k','£0.75k','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'], series: [{ color: '#2C3420', values: [0,0,651,748,0,0,171,627,466,973] }, { color: '#a7ab90', values: [0,216,1071,1605,2563,1099,321,694,941,700] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] },
      sec: {
        overviewActuals: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£13,594', dCls: 'df', d: 'YTD actuals', s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$3,789', dCls: 'df', d: 'YTD actuals', s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '708', dCls: 'df', d: 'UK 525 · US 183', s: 'Jan–Oct' },
            { bar: '#C8A84B', lbl: 'Units',    val: '797', dCls: 'df', d: 'UK 595 · US 202', s: 'Jan–Oct' }
          ],
          cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 12, valText: '11.7%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 3, valText: '2.6%', color: 'amber' }
          ]
        },
        products: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£13,594', dCls: 'df', d: 'YTD actuals', s: 'Jan–Oct' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '708', dCls: 'df', d: 'UK 525 · US 183', s: 'Jan–Oct' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '797', dCls: 'df', d: 'UK 595 · US 202', s: 'Jan–Oct' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£25.89', dCls: 'df', d: 'YTD avg', s: 'US $20.71' }
          ],
          table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£13,594', units: '595', orders: '525', cvr: '11.7%', cvrCls: 'bg', aov: '£25.89' },
            { flag: 'us', name: 'Amazon US', revenue: '$3,789', units: '202', orders: '183', cvr: '2.6%', cvrCls: 'br', aov: '$20.71' }
          ]
        },
        pnl: {
          margin: {
        pct: '15.1%', pctColor: 'amber', note: 'Amazon UK · Jan–Oct 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£12,845' },
          { lbl: 'Selling Fees', val: '−£2,131', color: 'red' },
          { lbl: 'Fulfilment', val: '−£2,872', color: 'red' },
          { lbl: 'Ad Spend', val: '−£1,492', color: 'red' },
          { lbl: 'COGS', val: '−£4,407', color: 'red' },
          { lbl: 'Net Profit', val: '£1,936', color: 'green', strong: true }
        ]
      },
          statement: {
        fixedLabel: 'Amazon UK · Jan–Oct 2026 (all-time)',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£13,494', pct: '105.1%', unit: '£25.70' },
            { lbl: 'Promotions', amount: '−£320', pct: '−2.5%', unit: '−£0.61' },
            { lbl: 'Refunds', amount: '−£227', pct: '−1.8%', unit: '−£0.43' },
            { lbl: 'Other income', amount: '£253', pct: '2.0%', unit: '£0.48' },
            { lbl: 'Other adjustments', amount: '−£356', pct: '−2.8%', unit: '−£0.68' },
            { lbl: 'Net revenue', amount: '£12,845', pct: '100.0%', unit: '£24.47', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£1,492', pct: '11.6%', unit: '£2.84' },
            { lbl: 'Selling fees', amount: '£2,131', pct: '16.6%', unit: '£4.06' },
            { lbl: 'Fulfilment and shipping', amount: '£2,872', pct: '22.4%', unit: '£5.47' },
            { lbl: 'Cost of goods', amount: '£4,407', pct: '34.3%', unit: '£8.40' },
            { lbl: 'Total expenses', amount: '£10,909', pct: '84.9%', unit: '£20.78', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£1,936', pct: '15.1%', unit: '£3.69', total: true, profit: true },
            { lbl: 'Profit %', amount: '15.1%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '595' },
            { lbl: 'Orders', amount: '525' }
          ] }
        ]
      },
          mkt: [
            { name: 'Amazon UK', flag: 'gb', revenue: '£12,845', adspend: '£1,492', net: '£1,936', netColor: 'green', margin: '15.1%', marginCls: 'ba' },
            { name: 'Amazon US', flag: 'us', revenue: '$2,658', adspend: '$0',   net: '$573', netColor: 'green', margin: '21.6%', marginCls: 'bg' }
          ]
        },
        advertising: {
          metrics: [
            { lbl: 'Total Spend', val: '£1,492', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£3,636' },
            { lbl: 'ACOS',        val: '41.0%', color: 'amber' },
            { lbl: 'TACOS',       val: '11.0%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '2.44×', id: 'a-roas' },
            { lbl: 'Avg. CPC',    val: '—' }
          ]
        }
      }
    }
  },

  sections: {
    founder: {

      // ---------- OVERVIEW ----------
      // SOURCES: kpis/revChart/tasks/milestones are ALL live-overlaid (overlay:'founder' deep-merges
      // whatever keys the Apps Script proxy sends — tasks + milestones come from Notion via the same
      // proxy call, kpis/revChart from the Sheet). Only alert/stockWarn/loanCard/waterfall are NOT part
      // of the payload the proxy currently sends, so those stay genuinely static and need a manual
      // refresh each time the underlying facts change (the proxy can't touch them). Values below were
      // re-baked 2026-09-11 from a live pull of both sources so the proxy-down fallback is current
      // rather than the June-era numbers this used to fall back to — re-check next Harvaza rebake.
      overview: {
        stockWarn: {
          badge: '2 SKUs pending',
          items: [
            { dot: 'green', tint: true, title: '200ml 24-pack — In Stock', sub: '190 units at Storfil · Amazon FBA healthy' },
            { dot: 'amber', tint: true, title: '200ml 6-pack — Scheduled for FBA', sub: 'Sold out on Amazon since Jun; 0 Storfil stock' },
            { dot: 'amber', tint: true, title: '750ml 6-pack — Arriving in the UK soon', sub: 'Not yet listed on Amazon · 0 Storfil stock' },
            { dot: 'green', tint: true, title: 'DCTS/REX preference confirmed', sub: '0% duty on India imports · Sep 2025' }
          ]
        },
        milestones: {
          badge: 'Timeline',
          items: [
            { dot: 'green', title: 'Contract signed', sub: 'June 2026' },
            { dot: 'green', title: 'Payment 1 released', sub: 'June 2026' },
            { dot: 'green', title: 'Due diligence complete', sub: 'June 2026' },
            { dot: 'green', title: 'Handover begins', sub: 'June 2026' },
            { dot: 'green', title: 'Peak season live', sub: 'July 2026' },
            { dot: 'muted', title: 'Payment 2 released', sub: 'On full completion' }
          ]
        },
        tasks: {
          badge: '5 open',
          items: [
            { dot: 'amber', title: "Transfer Google Workspace to Harvaza's Payments Profile", sub: 'Website & Digital · postponed, Arjun required' },
            { dot: 'amber', title: '£1,000 batch of labels (5-week lead time)', sub: 'Supplier & Warehouse (Mo to support) · paused' },
            { dot: 'amber', title: 'Print labels, hold at supplier — MOQs 65,000/SKU', sub: 'Supplier & Warehouse (Mo to support) · postponed' },
            { dot: 'amber', title: 'GS1 barcode licences transfer', sub: 'Compliance & Documentation · @Ryan to action' },
            { dot: 'amber', title: 'UK Trademark hand-over — TM16 (last step)', sub: 'Compliance & Documentation' }
          ]
        },
        kpis: [
          { bar: '#2C3420', lbl: 'Total revenue',          val: '£58,300', dCls: 'df', d: '12-month forecast' },
          { bar: '#C8A84B', lbl: 'Gross profit',           val: '£36,222', dCls: 'df', d: 'After COGS' },
          { bar: '#3B6D11', lbl: 'Profit before debt',     val: '£24,578', dCls: 'du', d: 'After all operating costs' },
          { bar: '#A32D2D', lbl: 'Total capital required', val: '£27,676', dCls: 'dd', d: 'Acq. + stock + labels + reorder' }
        ],
        revChart: {
          max: 8000, yTicks: ['£8k', '£6k', '£4k', '£2k', '£0'],
          xLabels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], xHighlight: '#2C3420',
          series: [
            { values: [3000, 3600, 3400, 7000, 3600, 3600, 3600, 4200, 5300, 7000, 7000, 7000], color: '#2C3420', area: true, main: true },
            { values: [1163, 1281, 1465, 3673, 1375, 1125, 1375, 1643, 2079, 3383, 3383, 2633], color: '#C8A84B', dash: true }
          ],
          legend: [{ name: 'Revenue', color: '#2C3420' }, { name: 'Profit before debt', color: '#C8A84B' }]
        },
        loanCard: {
          sub: '£22,500 · 10% p.a. · 30 months',
          big: '£9,000', bigSub: 'Year 1 repayment target',
          fillPct: 40, meta: ['£0', '40% Yr 1', '£22,500']
        },
        waterfall: [
          { lbl: 'Revenue',      pct: 100, val: '£58.3k', color: '#2C3420' },
          { lbl: 'Gross profit', pct: 62,  val: '£36.2k', color: '#C8A84B' },
          { lbl: 'Before debt',  pct: 42,  val: '£24.6k', color: 'green' },
          { lbl: 'Net profit',   pct: 23,  val: '£13.3k', color: 'muted' }
          // Prior "Free cash £8.4k (13%)" row dropped in the 2026-09-11 re-bake — the live sheet's own
          // 12-month table has no line item it maps to; better left out than guessed (see the "leave a
          // metric out rather than bake an unreconciled number" convention used elsewhere in this file).
        ]
      },

      // ---------- P&L DETAIL ----------
      pnl: {
        kpis: [
          { bar: '#2C3420', lbl: 'Total revenue', val: '£58,300', dCls: 'df', d: 'Jun 26 – May 27' },
          { bar: '#C8A84B', lbl: 'Total COGS',    val: '£22,078', dCls: 'dd', d: 'From cost sheet' },
          { bar: '#3B6D11', lbl: 'Total opex',    val: '£11,644', dCls: 'df', d: 'Excl. debt service' },
          { bar: '#A32D2D', lbl: 'Debt service',  val: '£11,255', dCls: 'dd', d: 'Repayment + interest' }
        ],
        chart: {
          max: 8000, yTicks: ['£8k', '£6k', '£4k', '£2k', '£0'],
          xLabels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], xHighlight: '#2C3420',
          series: [
            { values: [3000, 3600, 3400, 7000, 3600, 3600, 3600, 4200, 5300, 7000, 7000, 7000], color: '#2C3420', main: true },
            { values: [1840, 2208, 2142, 4350, 2242, 2242, 2242, 2610, 3296, 4350, 4350, 4350], color: '#C8A84B' },
            { values: [225, 343, 527, 2735, 437, 187, 437, 705, 1141, 2445, 2445, 1696], color: '#3B6D11' }
          ],
          legend: [{ name: 'Revenue', color: '#2C3420' }, { name: 'Gross profit', color: '#C8A84B' }, { name: 'Net after debt', color: '#3B6D11' }]
        },
        table: {
          cols: ['Line item', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Total'],
          rows: [
            { section: 'Revenue & COGS' },
            { cells: ['Revenue', '£3,000', '£3,600', '£3,400', '£7,000', '£3,600', '£3,600', '£3,600', '£4,200', '£5,300', '£7,000', '£7,000', '£7,000', '£58,300'] },
            { cls: 'red', cells: ['COGS', '£1,160', '£1,392', '£1,258', '£2,650', '£1,358', '£1,358', '£1,358', '£1,590', '£2,004', '£2,650', '£2,650', '£2,650', '£22,078'] },
            { total: true, cls: 'green', cells: ['Gross profit', '£1,840', '£2,208', '£2,142', '£4,350', '£2,242', '£2,242', '£2,242', '£2,610', '£3,296', '£4,350', '£4,350', '£4,350', '£36,222'] },
            { section: 'Operating expenses' },
            { cls: 'red', cells: ['Warehouse costs', '£500', '£500', '£500', '£500', '£500', '£500', '£500', '£500', '£500', '£500', '£500', '£500', '£6,000'] },
            { cls: 'red', cells: ['Customs & imports', '—', '£250', '—', '—', '—', '£250', '—', '—', '£250', '—', '—', '£250', '£1,000'] },
            { cls: 'red', cells: ['Software costs', '£10', '£10', '£10', '£10', '£10', '£10', '£10', '£10', '£10', '£10', '£10', '£10', '£120'] },
            { cls: 'red', cells: ['Shopify', '£50', '£50', '£50', '£50', '£50', '£50', '£50', '£50', '£50', '£50', '£50', '£50', '£600'] },
            { cls: 'red', cells: ['Google & domain', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£480'] },
            { cls: 'red', cells: ['Annual business costs', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£204'] },
            { cls: 'red', cells: ['Amazon general expenses', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£720'] },
            { cls: 'red', cells: ['Accounting fees', '—', '—', '—', '—', '—', '—', '—', '—', '—', '—', '—', '£500', '£500'] },
            { cls: 'red', cells: ['Service fees', '—', '—', '—', '—', '£190', '£190', '£190', '£290', '£290', '£290', '£290', '£290', '£2,020'] },
            { total: true, cls: 'green', cells: ['Profit before debt', '£1,163', '£1,281', '£1,465', '£3,673', '£1,375', '£1,125', '£1,375', '£1,643', '£2,079', '£3,383', '£3,383', '£2,633', '£24,578'] },
            { section: 'Debt service' },
            { cls: 'red', cells: ['Loan repayment', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£9,000'] },
            { cls: 'red', cells: ['Loan interest (10%)', '£188', '£188', '£188', '£188', '£188', '£188', '£188', '£188', '£188', '£188', '£188', '£187', '£2,255'] },
            { total: true, cls: 'green', cells: ['Net profit after debt', '£225', '£343', '£527', '£2,735', '£437', '£187', '£437', '£705', '£1,141', '£2,445', '£2,445', '£1,696', '£13,323'] }
          ]
        }
      },

      // ---------- STOCK & COGS ----------
      // Driven LIVE by the Apps Script proxy (founder.stock) from the SKU master sheet — values below
      // are the pre-load fallback, re-baked 2026-09-11 from a live pull (see the overview comment above).
      // Current Breakdown = Storfil stock; Phase 2 = forecast monthly re-order.
      stock: {
        info: 'Bervera coconut-water SKUs — current Storfil stock plus the Year-1 re-launch forecast. Live from the SKU master sheet.',
        kpis: [
          { bar: '#2C3420', lbl: 'Total COGS (year)',   val: '£22,078', dCls: 'df', d: 'From cost sheet' },
          { bar: '#C8A84B', lbl: 'Cost per 200ml unit', val: '£0.52',   dCls: 'df', d: '£12.50 per 24-pack' },
          { bar: '#1e4fa0', lbl: 'Cost per 750ml unit', val: '£1.10',   dCls: 'df', d: '£6.60 per 6-pack' }
        ],
        phases: [
          {
            title: 'Current Breakdown — Storfil',
            tag: { text: 'Live', cls: 'bg' },
            cols: ['SKU', 'Storfil Stock', 'Pack Size', 'Cost/SKU', 'Total Cost', 'Stock Status'],
            rows: [
              { cells: ['200ml 24-pack', '190', '24', '£12.50', '£2,375', '<span class="badge bg">In Stock</span>'] },
              { cells: ['200ml 12-pack', '0', '12', '£0.00', '—', '<span class="badge bb">—</span>'] },
              { cells: ['200ml 6-pack', '0', '6', '£3.20', '—', '<span class="badge ba">Scheduled for FBA</span>'] },
              { cells: ['750ml 6-pack', '0', '6', '£6.60', '—', '<span class="badge ba">Arriving in the UK Soon</span>'] },
              { total: true, cells: ['Total stock value', '', '', '', '£2,375', ''] }
            ]
          },
          {
            title: 'Phase 2 — Re-launch',
            tag: { text: 'Forecast', cls: 'ba' },
            cols: ['SKU', 'Monthly Average', 'Pack Size', 'Cost/SKU', 'Monthly CF', 'Note'],
            rows: [
              { cells: ['200ml 24-pack', '139', '24', '£12.50', '£1,738', 'Monthly re-order'] },
              { cells: ['200ml 12-pack', '0', '12', '£0.00', '£0', 'Monthly re-order'] },
              { cells: ['200ml 6-pack', '0', '6', '£3.20', '£0', 'Monthly re-order'] },
              { cells: ['750ml 6-pack', '41', '6', '£6.60', '£271', 'Monthly re-order'] },
              { total: true, cells: ['Monthly cashflow', '', '', '', '£2,008', ''] }
            ]
          }
        ]
      },

      // ---------- DIRECTOR'S LOAN ----------
      loan: {
        stats: [
          { lbl: 'Loan amount',       val: '£22,500' },
          { lbl: 'Monthly repayment', val: '£750' },
          { lbl: 'Interest rate',     val: '10% p.a.' },
          { lbl: 'Annual interest',   val: '£2,250' },
          { lbl: 'Payback period',    val: '30 months' },
          { lbl: 'Loan clear date',   val: 'Dec 2028' }
        ],
        progress: {
          note: 'Year 1 repayment: £9,000 of £22,500 (40%)',
          fillPct: 40,
          meta: ['Jun 2026', '40% after Year 1', 'Dec 2028']
        },
        kpis: [
          { bar: '#2C3420', lbl: 'Acquisition price',     val: '£17,500', dCls: 'df', d: 'Paid to Arjun' },
          { bar: '#C8A84B', lbl: 'Stock (18 Jun)',        val: '£4,176',  dCls: 'df', d: '360 cartons landed' },
          { bar: '#A32D2D', lbl: 'Label MOQ + reorder',   val: '£6,000',  dCls: 'dd', d: 'Est. — time w/ disbursement' },
          { bar: '#A32D2D', lbl: 'Total all-in',          val: '£27,676', dCls: 'dd', d: 'Loan covers £22,500' }
        ],
        chart: {
          max: 24000, yTicks: ['£24k', '£18k', '£12k', '£6k', '£0'],
          xLabels: ['Jun 26', 'Sep 26', 'Dec 26', 'Mar 27', 'Jun 27', 'Sep 27', 'Dec 27', 'Mar 28', 'Jun 28', 'Sep 28', 'Dec 28'], xHighlight: '#2C3420',
          series: [
            { values: [22500, 20250, 18000, 15750, 13500, 11250, 9000, 6750, 4500, 2250, 0], color: '#2C3420', area: true, main: true }
          ],
          legend: [{ name: 'Loan balance', color: '#2C3420' }]
        },
        info: 'Per SHA Year 1 policy — all profit reinvested. Distributions to Ryan (80%) and Mo (20%) open after the loan is fully repaid, estimated Dec 2028.'
      }

    },

    // ===== AMAZON ANALYTICS — MerchantSpring pulled 2026-11-05 (Harvaza Distribution UK + US) =====
    // Top-level (period-independent) sections so the Amazon pages render under the founder 'fy'
    // selector. UK = GBP, US = USD (mixed-currency, shown per-market). TODO: replace with a
    // build-harvaza-data.ps1 baker for repeatable refresh.
    // Founder Overview "Amazon actuals" widgets. kpis + cvr are period-aware (sec.overviewActuals on
    // 3m/6m); revTrend + buyBox are top-level (don't vary by period). Default here = Last Month (October).
    overviewActuals: {
      kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£1,716', dCls: 'du', d: '▲ vs £1,469 Sep', s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$390', dCls: 'du', d: '▲ vs $303 Sep', s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '102', dCls: 'df', d: 'UK 79 · US 23', s: 'Oct 2026' },
            { bar: '#C8A84B', lbl: 'Units',    val: '108', dCls: 'df', d: 'UK 83 · US 25', s: 'Oct 2026' }
          ],
      revTrend: {
        max: 3000, yTicks: ['£3k', '£2.25k', '£1.5k', '£0.75k', '£0'],
        xLabels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], xHighlight: '#2C3420',
        series: [{ values: [2911, 836, 624, 1347, 1469, 1716], color: '#2C3420', area: true, main: true }],
        legend: [{ name: 'Amazon UK revenue (ordered)', color: '#2C3420' }]
      },
      // Buy Box = page-view-weighted daily buyboxWinPercentage for October (getSalesByPeriod daily sums).
      buyBox: [
        { label: 'Amazon UK', flag: 'gb', pct: 97,  valText: '96.5%',  color: 'green' },
        { label: 'Amazon US', flag: 'us', pct: 80, valText: '79.8%', color: 'amber' }
      ],
      cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 9, valText: '9.0%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 4, valText: '3.8%', color: 'amber' }
          ]
    },

    // Default = Last Month (October 2026). 3m/6m override via dateRanges[p].sec.products.
    products: {
      kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£1,716', dCls: 'du', d: '▲ vs £1,469 Sep', s: 'Oct 2026' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '102', dCls: 'df', d: 'UK 79 · US 23', s: 'Oct 2026' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '108', dCls: 'df', d: 'UK 83 · US 25', s: 'Oct 2026' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£21.73', dCls: 'dd', d: '▼ vs £31.26 Sep', s: 'US $16.97' }
          ],
      table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£1,716', units: '83', orders: '79', cvr: '9.0%', cvrCls: 'bg', aov: '£21.73' },
            { flag: 'us', name: 'Amazon US', revenue: '$390', units: '25', orders: '23', cvr: '3.8%', cvrCls: 'br', aov: '$16.97' }
          ],
      // Sales by Product (per-ASIN, replaces the low-value 2-row "Performance by Market" table — see
      // config.hideProductsMarketTable). getSalesByProduct per channel per window, keyed like AMACX's
      // groupsByPeriod (period → market). US has no ad account (README) so adSpend/tacos/cvr are '—'/'n/a'
      // there, not 0 — a true $0 would claim a measured-good TACOS that was never measured. All three
      // windows re-pulled 2026-11-05 and reconcile to the headline: may UK £1,716.26 / US $390.25, 3m UK
      // £4,532.26 / US $1,261.66, 6m UK £13,594.40 / US $3,789.30. UK "6×200ml" folds the live
      // HBPACK-6x200 + HBPACK-6x200-FBM SKUs (same ASIN B0D29PL6NJ) with — in the 6m window — the legacy
      // HBPACK-6x200-MB SKU (£3,321 / 241u Jan–Jun, quantity 0 since 2026-09-21; the ASIN itself is still
      // served by the new SKUs). CVR = Σ ad conversions ÷ Σ ad clicks per group. TACOS badge: ≤20% bg,
      // ≤35% ba, else br. Zero-sale SKUs omitted. 6×200ml Oct TACOS 50.5% / ACOS 72% on the 6-pack is the
      // drag on the ad ramp.
      groupsByPeriod: {
        '3m': {
          uk: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£3,471', units: '110', pct: '77%', adSpend: '£391', tacos: '11.3%', tacosCls: 'bg', cvr: '7.4%', cvrCls: 'ba', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£1,004', units: '70', pct: '22%', adSpend: '£499', tacos: '49.7%', tacosCls: 'br', cvr: '10.3%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 24×200ml (FBM)', sales: '£57', units: '2', pct: '1%', adSpend: '£4', tacos: '7.3%', tacosCls: 'bg', cvr: '0.0%', cvrCls: 'br', oosRate: '0%', oosCls: 'bg' }
          ],
          us: [
            { name: 'Hydrte 11.8oz — Nero', sales: '$341', units: '20', pct: '27%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$333', units: '22', pct: '26%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Nero', sales: '$306', units: '16', pct: '24%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$282', units: '14', pct: '22%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ],
          all: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£3,471', units: '110', pct: '77%', adSpend: '£391', tacos: '11.3%', tacosCls: 'bg', cvr: '7.4%', cvrCls: 'ba', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£1,004', units: '70', pct: '22%', adSpend: '£499', tacos: '49.7%', tacosCls: 'br', cvr: '10.3%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 24×200ml (FBM)', sales: '£57', units: '2', pct: '1%', adSpend: '£4', tacos: '7.3%', tacosCls: 'bg', cvr: '0.0%', cvrCls: 'br', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Nero', sales: '$341', units: '20', pct: '27%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$333', units: '22', pct: '26%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Nero', sales: '$306', units: '16', pct: '24%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$282', units: '14', pct: '22%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ]
        },
        'may': {
          uk: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£932', units: '29', pct: '54%', adSpend: '£90', tacos: '9.6%', tacosCls: 'bg', cvr: '12.1%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£754', units: '53', pct: '44%', adSpend: '£381', tacos: '50.5%', tacosCls: 'br', cvr: '10.0%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 24×200ml (FBM)', sales: '£30', units: '1', pct: '2%', adSpend: '£4', tacos: '13.9%', tacosCls: 'bg', cvr: '0.0%', cvrCls: 'br', oosRate: '0%', oosCls: 'bg' }
          ],
          us: [
            { name: 'Hydrte 18oz — Nero', sales: '$121', units: '7', pct: '31%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$115', units: '6', pct: '30%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$102', units: '8', pct: '26%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Nero', sales: '$52', units: '4', pct: '13%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ],
          all: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£932', units: '29', pct: '54%', adSpend: '£90', tacos: '9.6%', tacosCls: 'bg', cvr: '12.1%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£754', units: '53', pct: '44%', adSpend: '£381', tacos: '50.5%', tacosCls: 'br', cvr: '10.0%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 24×200ml (FBM)', sales: '£30', units: '1', pct: '2%', adSpend: '£4', tacos: '13.9%', tacosCls: 'bg', cvr: '0.0%', cvrCls: 'br', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Nero', sales: '$121', units: '7', pct: '31%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$115', units: '6', pct: '30%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$102', units: '8', pct: '26%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Nero', sales: '$52', units: '4', pct: '13%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ]
        },
        '6m': {
          uk: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£8,853', units: '272', pct: '65%', adSpend: '£603', tacos: '6.8%', tacosCls: 'bg', cvr: '7.6%', cvrCls: 'ba', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£4,325', units: '311', pct: '32%', adSpend: '£847', tacos: '19.6%', tacosCls: 'bg', cvr: '9.6%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 24×200ml (FBM)', sales: '£417', units: '12', pct: '3%', adSpend: '£41', tacos: '9.9%', tacosCls: 'bg', cvr: '3.0%', cvrCls: 'br', oosRate: '0%', oosCls: 'bg' }
          ],
          us: [
            { name: 'Hydrte 18oz — Nero', sales: '$1,335', units: '66', pct: '35%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Nero', sales: '$1,100', units: '63', pct: '29%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$909', units: '44', pct: '24%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$446', units: '29', pct: '12%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ],
          all: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£8,853', units: '272', pct: '65%', adSpend: '£603', tacos: '6.8%', tacosCls: 'bg', cvr: '7.6%', cvrCls: 'ba', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£4,325', units: '311', pct: '32%', adSpend: '£847', tacos: '19.6%', tacosCls: 'bg', cvr: '9.6%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 24×200ml (FBM)', sales: '£417', units: '12', pct: '3%', adSpend: '£41', tacos: '9.9%', tacosCls: 'bg', cvr: '3.0%', cvrCls: 'br', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Nero', sales: '$1,335', units: '66', pct: '35%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Nero', sales: '$1,100', units: '63', pct: '29%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$909', units: '44', pct: '24%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$446', units: '29', pct: '12%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ]
        }
      }
    },

    // Current stock snapshot (period-independent) — getSalesByProduct includeNoInventory/includeNoSales, both
    // channels. Re-baked 2026-11-05. UK FBA 24-pack 92 → 65 units (~67 days cover); the FBM 24-pack now holds
    // 357 units. UK 12×200ml FBM (B0DQHCR2K7) remains at zero since 2026-09-11 with no sales in any window —
    // counted as OOS per the runbook (quantity==0). 6×750ml (B0FKH4TRFH) is back in stock on the FBM SKU
    // (193 units, was 0 on 2026-09-09) so the ASIN is no longer OOS; its FBA SKU HBPACK-6x750-FBA hit zero on
    // 2026-10-13 with no sales ever. Legacy HBPACK-6x200-MB is at zero but its ASIN is live on the HBPACK-6x200 /
    // -FBM SKUs (162 + 187 units), so it is not an OOS ASIN.
    inventory: {
      kpis: [
        { bar: 'green', lbl: 'In Stock',  val: '7',   dCls: 'du', d: 'ASINs healthy',  s: 'UK + US' },
        { bar: 'amber', lbl: 'Low Stock', val: '0',   dCls: 'du', d: 'None currently', s: '—' },
        { bar: 'red',   lbl: 'OOS',       val: '1',   dCls: 'dd', d: 'UK FBM ASIN',    s: 'zero stock' },
        { bar: 'blue',  lbl: 'OOS %',     val: '25%', dCls: 'dd', d: 'UK channel',     s: 'US 0%' }
      ],
      stock: [
        { dot: 'dg', name: 'Bervera 24×200ml — UK (FBA)', note: 'B0CQRHMWFL · FBA · Healthy', units: '65 units',  days: '~67 days' },
        { dot: 'dg', name: 'Bervera 24×200ml — UK (FBM)', note: 'B0CQRHMWFL · FBM · Healthy (1 unit sold in Oct)', units: '357 units', days: '—' },
        { dot: 'dg', name: 'Bervera 6×200ml — UK (FBA)',  note: 'B0D29PL6NJ · FBA · Healthy (+187 units on the -FBM SKU)', units: '162 units', days: '~106 days' },
        { dot: 'dr', name: 'Bervera 12×200ml — UK (FBM)', note: 'B0DQHCR2K7 · FBM · OOS since 11 Sep', units: '0 units', days: '—' },
        { dot: 'dg', name: 'Bervera 6×750ml — UK (FBM)',  note: 'B0FKH4TRFH · FBM · Healthy (FBA SKU zero since 13 Oct)', units: '193 units', days: '—' },
        { dot: 'dg', name: 'Hydrte 18oz — Slate (US)',    note: 'B0CHJNPWHV · FBA · Healthy', units: '53 units', days: '~199 days' },
        { dot: 'dg', name: 'Hydrte 11.8oz — Nero (US)',   note: 'B0B1N844DS · FBA · Healthy', units: '24 units', days: '~240 days' },
        { dot: 'dg', name: 'Hydrte 18oz — Nero (US)',     note: 'B0CRKS94F1 · FBA · Healthy', units: '42 units', days: '~180 days' },
        { dot: 'dg', name: 'Hydrte 11.8oz — Champagne (US)', note: 'B0B1N7759K · FBA · Healthy', units: '72 units', days: '~309 days' }
      ],
      restock: [
        { level: 'red', title: 'Bervera 12×200ml — UK (FBM) — stock-up now', sub: 'Zero stock since 11 Sep · no sales in 2026 to date, so no revenue at risk yet — confirm whether this listing is still live' },
        { level: 'amber', title: 'Bervera 6×750ml — UK (FBA SKU) — stock-up soon', sub: 'FBA SKU zero since 13 Oct · ASIN still has 193 units on the FBM SKU · no sales yet' }
      ]
    },

    // Amazon P&L — accrual basis (getStoreProfitAndLoss, profitabilityView:'accrual'). Renders on the 'pnl'
    // page ("Amazon P&L"). UK = £ base; US shown $ in the per-market table. This card's own "Advertising"
    // line is the P&L tool's own figure — a different lens from the Advertising-page spend
    // (dateRanges/sections.advertising); the two are not meant to reconcile (same convention as ordered vs
    // net P&L revenue elsewhere in this file). UK Oct: ad spend £474.34 matches the daily-sum spend exactly.
    // "Other income" on UK Oct/3m/6m and "Other adjustments" rows are reconciling lines so the income block
    // foots to the tool's totalRevenue (the tool's own income lines don't sum to it; US Oct gap −$18). 6m UK
    // "Other adjustments" carries the pre-existing YTD gap (~−£356) that earlier bakes left unlabelled.
    pnl: {
      // Product portfolio — re-baked 2026-11-05 from getProductProfitAndLoss (accrual, October). Margin =
      // totalProfit ÷ totalRevenue per SKU. UK 6×200ml is NOW INCLUDED: COGS has been entered in MerchantSpring
      // (£136 + £20), so its margin reconciles. CAUTION: per-SKU totalProfit figures do not foot to the store
      // net profit (store UK £134 / 8.0% vs SKU profits summing far higher) — same tool behaviour as prior
      // bakes. US 18oz-Slate and 11.8oz-Nero are loss-making in Oct on refunds ($79 / $29). Breakeven = |margin| < 5%.
      portfolio: {
        total: 7, profitable: 5, breakeven: 0, unprofitable: 2, periodLabel: 'October 2026',
        most: [
          { name: 'Bervera 24×200ml (UK, FBM)',   profit: '£15',  margin: '50%', marginCls: 'bg' },
          { name: 'Bervera 6×200ml (UK)',         profit: '£332', margin: '41%', marginCls: 'bg' },
          { name: 'Bervera 24×200ml (UK, FBA)',   profit: '£309', margin: '35%', marginCls: 'bg' }
        ],
        least: [
          { name: 'Hydrte 11.8oz — Nero (US)',    profit: '−$12', margin: '−18%', marginCls: 'br', color: 'var(--red)' },
          { name: 'Hydrte 18oz — Slate (US)',     profit: '−$23', margin: '−17%', marginCls: 'br', color: 'var(--red)' }
        ]
      },
      portfolioByMarket: {
        uk: {
          total: 3, profitable: 3, breakeven: 0, unprofitable: 0, periodLabel: 'October 2026',
          most: [
            { name: 'Bervera 24×200ml (FBM)', profit: '£15', margin: '50%', marginCls: 'bg' },
            { name: 'Bervera 6×200ml', profit: '£332', margin: '41%', marginCls: 'bg' },
            { name: 'Bervera 24×200ml (FBA)', profit: '£309', margin: '35%', marginCls: 'bg' }
          ],
          least: [
            { name: 'Bervera 24×200ml (FBA)', profit: '£309', margin: '35%', marginCls: 'bg' }
          ]
        },
        us: {
          total: 4, profitable: 2, breakeven: 0, unprofitable: 2, periodLabel: 'October 2026',
          most: [
            { name: 'Hydrte 18oz — Nero', profit: '$38', margin: '30%', marginCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', profit: '$14', margin: '11%', marginCls: 'ba' }
          ],
          least: [
            { name: 'Hydrte 11.8oz — Nero', profit: '−$12', margin: '−18%', marginCls: 'br', color: 'var(--red)' },
            { name: 'Hydrte 18oz — Slate', profit: '−$23', margin: '−17%', marginCls: 'br', color: 'var(--red)' }
          ]
        }
      },
      margin: {
        pct: '8.0%', pctColor: 'amber', note: 'Amazon UK · October 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£1,673' },
          { lbl: 'Selling Fees', val: '−£249', color: 'red' },
          { lbl: 'Fulfilment', val: '−£334', color: 'red' },
          { lbl: 'Ad Spend', val: '−£474', color: 'red' },
          { lbl: 'COGS', val: '−£481', color: 'red' },
          { lbl: 'Net Profit', val: '£134', color: 'green', strong: true }
        ]
      },
      // marginByMarket/statementByMarket: getStoreProfitAndLoss per channel (accrual, same method as the
      // blended UK cards above — US net $1 / 0.4% here matches the `mkt` row below to the penny). US has no
      // ad account, so Ad Spend is a real $0 (measured, not "no data").
      marginByMarket: {
        uk: {
        pct: '8.0%', pctColor: 'amber', note: 'Amazon UK · October 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£1,673' },
          { lbl: 'Selling Fees', val: '−£249', color: 'red' },
          { lbl: 'Fulfilment', val: '−£334', color: 'red' },
          { lbl: 'Ad Spend', val: '−£474', color: 'red' },
          { lbl: 'COGS', val: '−£481', color: 'red' },
          { lbl: 'Net Profit', val: '£134', color: 'green', strong: true }
        ]
      },
        us: {
        pct: '0.4%', pctColor: 'red', note: 'Amazon US · October 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '$271' },
          { lbl: 'Selling Fees', val: '−$68', color: 'red' },
          { lbl: 'Fulfilment', val: '−$135', color: 'red' },
          { lbl: 'Ad Spend', val: '$0', color: 'red' },
          { lbl: 'COGS', val: '−$70', color: 'red' },
          { lbl: 'Net Profit', val: '$1', color: 'green', strong: true }
        ]
      }
      },
      statement: {
        fixedLabel: 'Amazon UK · October 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£1,666', pct: '99.6%', unit: '£21.09' },
            { lbl: 'Promotions', amount: '−£27', pct: '−1.6%', unit: '−£0.34' },
            { lbl: 'Refunds', amount: '−£14', pct: '−0.8%', unit: '−£0.18' },
            { lbl: 'Other income', amount: '£48', pct: '2.9%', unit: '£0.61' },
            { lbl: 'Net revenue', amount: '£1,673', pct: '100.0%', unit: '£21.18', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£474', pct: '28.3%', unit: '£6.00' },
            { lbl: 'Selling fees', amount: '£249', pct: '14.9%', unit: '£3.15' },
            { lbl: 'Fulfilment and shipping', amount: '£334', pct: '20.0%', unit: '£4.23' },
            { lbl: 'Cost of goods', amount: '£481', pct: '28.8%', unit: '£6.09' },
            { lbl: 'Total expenses', amount: '£1,539', pct: '92.0%', unit: '£19.48', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£134', pct: '8.0%', unit: '£1.70', total: true, profit: true },
            { lbl: 'Profit %', amount: '8.0%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '83' },
            { lbl: 'Orders', amount: '79' }
          ] }
        ]
      },
      statementByMarket: {
        uk: {
        fixedLabel: 'Amazon UK · October 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£1,666', pct: '99.6%', unit: '£21.09' },
            { lbl: 'Promotions', amount: '−£27', pct: '−1.6%', unit: '−£0.34' },
            { lbl: 'Refunds', amount: '−£14', pct: '−0.8%', unit: '−£0.18' },
            { lbl: 'Other income', amount: '£48', pct: '2.9%', unit: '£0.61' },
            { lbl: 'Net revenue', amount: '£1,673', pct: '100.0%', unit: '£21.18', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£474', pct: '28.3%', unit: '£6.00' },
            { lbl: 'Selling fees', amount: '£249', pct: '14.9%', unit: '£3.15' },
            { lbl: 'Fulfilment and shipping', amount: '£334', pct: '20.0%', unit: '£4.23' },
            { lbl: 'Cost of goods', amount: '£481', pct: '28.8%', unit: '£6.09' },
            { lbl: 'Total expenses', amount: '£1,539', pct: '92.0%', unit: '£19.48', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£134', pct: '8.0%', unit: '£1.70', total: true, profit: true },
            { lbl: 'Profit %', amount: '8.0%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '83' },
            { lbl: 'Orders', amount: '79' }
          ] }
        ]
      },
        us: {
        fixedLabel: 'Amazon US · October 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '$395', pct: '146.0%', unit: '$17.17' },
            { lbl: 'Promotions', amount: '−$5', pct: '−1.7%', unit: '−$0.20' },
            { lbl: 'Refunds', amount: '−$119', pct: '−43.9%', unit: '−$5.16' },
            { lbl: 'Other income', amount: '$17', pct: '6.3%', unit: '$0.74' },
            { lbl: 'Other adjustments', amount: '−$18', pct: '−6.7%', unit: '−$0.79' },
            { lbl: 'Net revenue', amount: '$271', pct: '100.0%', unit: '$11.76', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '$0', pct: '0.0%', unit: '$0.00' },
            { lbl: 'Selling fees', amount: '$68', pct: '25.1%', unit: '$2.95' },
            { lbl: 'Fulfilment and shipping', amount: '$135', pct: '49.9%', unit: '$5.86' },
            { lbl: 'Cost of goods', amount: '$70', pct: '26.0%', unit: '$3.05' },
            { lbl: 'Total expenses', amount: '$270', pct: '99.6%', unit: '$11.72', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '$1', pct: '0.4%', unit: '$0.04', total: true, profit: true },
            { lbl: 'Profit %', amount: '0.4%', accent: 'red' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '25' },
            { lbl: 'Orders', amount: '23' }
          ] }
        ]
      }
      },
      mkt: [
        { name: 'Amazon UK', flag: 'gb', revenue: '£1,673', adspend: '£474', net: '£134', netColor: 'green', margin: '8.0%', marginCls: 'ba' },
        { name: 'Amazon US', flag: 'us', revenue: '$271', adspend: '$0', net: '$1', netColor: 'green', margin: '0.4%', marginCls: 'br' }
      ]
    },

    // Advertising — UK ads active continuously since late July (paused May–Jun, active Mar–Apr before that).
    // October ramp (£474 spend, +146% vs Sep) confirmed intentional. No CPC / campaign-level breakdown:
    // getAdvertisingByChannels still throws its schema error, and getAdvertisingCampaigns attributed sales
    // don't reconcile to the account-level daily sums, so the figures are the same reconciled daily-interval
    // sums as dateRanges above (spend ties to getSalesByProduct per-SKU adSpend £474.34 and the P&L). Oct ad
    // sales £973.00 daily vs £940.01 per-SKU (£32.99 attribution gap). KPI row + chart come from
    // dateRanges (above); these cards fill the rest of the page.
    advertising: {
      metrics: [
            { lbl: 'Total Spend', val: '£474', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£973' },
            { lbl: 'ACOS',        val: '48.8%', color: 'amber' },
            { lbl: 'TACOS',       val: '27.6%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '2.05×', id: 'a-roas' },
            { lbl: 'Avg. CPC',    val: '—' }
          ],
      budgets: {
        headers: ['Aug', 'Sep', 'Spend Oct', 'Plan'],
        subLabel: 'Active Oct 2026 · continuing from Jul (paused May–Jun before that)',
        rows: [
          { name: 'Amazon UK', flag: 'gb', cells: ['£228', '£191', '£474', 'TBC'] },
          { name: 'Amazon US', flag: 'us', cells: ['$0', '$0', '$0', 'TBC'] },
          { name: 'Total', total: true, cells: ['£228', '£191', '£474', '—'] }
        ]
      },
      forecast: [
        { month: 'Nov', budget: 'TBC', pct: 3, opacity: 0.5, tacos: '—', tacosColor: 'muted', roas: '—' },
        { month: 'Dec', budget: 'TBC', pct: 3, opacity: 0.4, tacos: '—', tacosColor: 'muted', roas: '—' }
      ],
      campaigns: [
        { name: 'All active campaigns', type: 'Amazon UK · October 2026', spend: '£474', sales: '£973', acos: '48.8%', acosCls: 'br', roas: '2.05×', cpc: '—', status: 'Active', statusCls: 'bg' }
      ]
    }
  }
};

/* PREV-MONTH-START — month-on-month comparison rows for the Products tables (Last Month · September 2026); see tools/bake-prev-month.js */
(function () { var P = window.DASHBOARD_DATA && window.DASHBOARD_DATA.sections && window.DASHBOARD_DATA.sections.products;
  if (P) P.prevMonth = {"table":[{"flag":"gb","name":"Amazon UK","revenue":"£1,502","units":"57","orders":"48","cvr":"10.8%","cvrCls":"bg","aov":"£31.30"},{"flag":"us","name":"Amazon US","revenue":"$303","units":"16","orders":"15","cvr":"3.5%","cvrCls":"br","aov":"$20.21"}],"groups":{"uk":[{"name":"Bervera 24×200ml (FBA)","sales":"£1,252","units":"40","pct":"83%","adSpend":"£75","tacos":"6.0%","tacosCls":"bg","cvr":"6.3%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"Bervera 6×200ml","sales":"£250","units":"17","pct":"17%","adSpend":"£118","tacos":"47.2%","tacosCls":"br","cvr":"11.3%","cvrCls":"bg","oosRate":"0%","oosCls":"bg"}],"us":[{"name":"Hydrte 11.8oz — Nero","sales":"$126","units":"7","pct":"41%","adSpend":"$0","tacos":"—","tacosCls":"bb","cvr":"n/a","cvrCls":"bb","oosRate":"0%","oosCls":"bg"},{"name":"Hydrte 18oz — Slate","sales":"$87","units":"4","pct":"29%","adSpend":"$0","tacos":"—","tacosCls":"bb","cvr":"n/a","cvrCls":"bb","oosRate":"0%","oosCls":"bg"},{"name":"Hydrte 11.8oz — Champagne","sales":"$47","units":"3","pct":"15%","adSpend":"$0","tacos":"—","tacosCls":"bb","cvr":"n/a","cvrCls":"bb","oosRate":"0%","oosCls":"bg"},{"name":"Hydrte 18oz — Nero","sales":"$44","units":"2","pct":"14%","adSpend":"$0","tacos":"—","tacosCls":"bb","cvr":"n/a","cvrCls":"bb","oosRate":"0%","oosCls":"bg"}],"all":[{"name":"Bervera 24×200ml (FBA)","sales":"£1,252","units":"40","pct":"83%","adSpend":"£75","tacos":"6.0%","tacosCls":"bg","cvr":"6.3%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"Bervera 6×200ml","sales":"£250","units":"17","pct":"17%","adSpend":"£118","tacos":"47.2%","tacosCls":"br","cvr":"11.3%","cvrCls":"bg","oosRate":"0%","oosCls":"bg"},{"name":"Hydrte 11.8oz — Nero","sales":"$126","units":"7","pct":"41%","adSpend":"$0","tacos":"—","tacosCls":"bb","cvr":"n/a","cvrCls":"bb","oosRate":"0%","oosCls":"bg"},{"name":"Hydrte 18oz — Slate","sales":"$87","units":"4","pct":"29%","adSpend":"$0","tacos":"—","tacosCls":"bb","cvr":"n/a","cvrCls":"bb","oosRate":"0%","oosCls":"bg"},{"name":"Hydrte 11.8oz — Champagne","sales":"$47","units":"3","pct":"15%","adSpend":"$0","tacos":"—","tacosCls":"bb","cvr":"n/a","cvrCls":"bb","oosRate":"0%","oosCls":"bg"},{"name":"Hydrte 18oz — Nero","sales":"$44","units":"2","pct":"14%","adSpend":"$0","tacos":"—","tacosCls":"bb","cvr":"n/a","cvrCls":"bb","oosRate":"0%","oosCls":"bg"}]}}; })();
/* PREV-MONTH-END */
