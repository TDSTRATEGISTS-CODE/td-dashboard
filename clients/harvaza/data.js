/* Harvaza Ltd (Bervera) — client data. Loaded as window.DASHBOARD_DATA.
   Static Year-1 forecast (Jun 2026 – May 2027), baked from the founder model. The shell reads
   `sections.founder` to render the four founder pages. Amazon pages show the maintenance stub.
   When live data arrives: UK Amazon actuals (MCP) overlay the monthly P&L + stock; the Google
   Sheet supplies forecast/budgets; Shopify adds a channel section. Keep this shape stable. */
window.DASHBOARD_DATA = {

  // Minimal date-range entry so the shell's switchDateRange paints the topbar + sidebar chips.
  // Founder KPIs are rendered from sections.founder, not from these fields.
  dateRanges: {
    // Amazon ACTUALS lenses (MerchantSpring pulled 2026-10-05). Sales/units/orders/AOV/ad spend/ad sales
    // are per-month native-currency sums from getSalesByPeriod's daily interval (the multi-month 'M'
    // interval needs a GMT/LA/Tokyo timezone and getSalesByChannels still throws its buyBoxSnapshot
    // output-validation error on every call — unchanged since the last bake — so the daily-interval sum is
    // the source, same pattern as the AMACX/NKV weekly-sum workaround). September daily sums reconcile to
    // the penny with getSalesByProduct per-SKU totals (UK £1,502.30 / US $303.15 / UK ad spend £192.55 /
    // ad sales £465.76) and with getStoreProfitAndLoss ad spend. 3m = Jul+Aug+Sep, reconciled to
    // getSalesByProduct over the 3-month window (UK £3,472.81 / US $1,421.93 / spend £530.33 / ad sales
    // £1,264.01). 6m = Year-to-date; UK/US sales reconcile to getSalesByProduct over Jan 1–Sep 30 (UK
    // £11,911.13 / US $3,399.05). YTD page views (CVR denominator) are the Jan–Aug baked value rebuilt
    // from the stored CVR% (±0.4%) plus the exact September sum, so YTD CVR is accurate to ~0.1pt.
    // KNOWN PRE-EXISTING GAP: YTD headline ad spend (£1,006) is built on the Jan–Aug daily-sum basis (£813)
    // while the P&L card, ad chart and Sales-by-Product YTD ad spend all sit on £1,019 (Jan–Aug £826 +
    // Sep £193) — the Jan–Aug difference (£13) predates this bake and is left as-is rather than re-pulled.
    // Spend/sales/ACOS/TACOS/ROAS are NOT the same figure as the P&L card's own "Advertising" line
    // (accrual lens — intentionally not reconciled, per the AMACX/Harvaza convention). Chip totals
    // (mktRows col 6) = per-period ACTUAL sales (UK £, US $). 'all' chip (rev) = UK £ total (US is a
    // separate currency, not summed). Forecast is NOT here — it lives on the P&L Detail page.
    // September UK £1,502 (+11.5% vs Aug £1,347) and US $303 (−46.6% vs Aug $568): both inside the 60% MoM
    // gate and reconciled across daily sums, getSalesByProduct and P&L; the US dip is a lumpy-demand month
    // (15 orders vs 30 in Aug, 7 zero-sale days in the second half), not a data error.
    // Per-period sec.products overrides the top-level (last-month) Products section.
    may: {
      label: 'Last Month · September 2026', shortLabel: 'September 2026',
      rev: '£1,502', revD: '▲ vs £1,347 Aug', revC: 'du', revS: 'Amazon UK actual',
      spend: '£193', spendD: 'September 2026', spendC: 'df', spendS: 'ACOS 41.3%',
      tacosAd: '12.8%', tacosAdD: 'September', tacosAdC: 'df', tacosAdS: '£193 spend',
      roasAd: '2.42×', roasAdD: 'September', roasAdC: 'df', roasAdS: '£466 ad sales',
      aov: '£31.30', aovD: '▼ vs £35.44 Aug', aovC: 'dd', aovS: 'UK · 48 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£193', 'br', '▲ no budget', '£1,502', 'ba', '12.8%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$303', 'bg', '—'],
        ['Total', '', '£0', '£193', 'br', '▲ over', '£1,502', 'ba', '12.8%']
      ],
      adChart: { max: 300, yTicks: ['£300','£225','£150','£75','£0'], xLabels: ['Apr','May','Jun','Jul','Aug','Sep'], xHighlight: '#2C3420', series: [{ values: [281,0,0,110,228,193], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // Revenue Breakdown — stacked monthly bars (Ad sales vs Organic). Segments sum to the P&L
      // (accrual) gross revenue; Σad reconciles to the Advertising-page ad sales figure.
      revBreakChart: { max: 1500, yTicks: ['£1.5k','£1.13k','£0.75k','£0.38k','£0'], xLabels: ['Sep'], series: [{ color: '#2C3420', values: [466] }, { color: '#a7ab90', values: [940] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] }
    },
    '3m': {
      label: 'Last 3 Months · Jul–Sep 2026', shortLabel: 'Jul–Sep 2026',
      rev: '£3,473', revD: '3-month actuals', revC: 'df', revS: 'Amazon UK actual',
      spend: '£530', spendD: 'Jul–Sep', spendC: 'df', spendS: 'ACOS 42.0%',
      tacosAd: '15.3%', tacosAdD: 'Jul–Sep', tacosAdC: 'df', tacosAdS: '£530 spend',
      roasAd: '2.38×', roasAdD: 'Jul–Sep', roasAdC: 'df', roasAdS: '£1,264 ad sales',
      aov: '£34.73', aovD: '3-month avg', aovC: 'df', aovS: 'UK · 100 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£530', 'br', '▲ no budget', '£3,473', 'ba', '15.3%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$1,422', 'bg', '—'],
        ['Total', '', '£0', '£530', 'br', '▲ over', '£3,473', 'ba', '15.3%']
      ],
      adChart: { max: 300, yTicks: ['£300','£225','£150','£75','£0'], xLabels: ['Apr','May','Jun','Jul','Aug','Sep'], xHighlight: '#2C3420', series: [{ values: [281,0,0,110,228,193], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // Jul: ad sales £171, organic £321. Aug: ad sales £627, organic £694. Sep: ad sales £466, organic £940.
      revBreakChart: { max: 1500, yTicks: ['£1.5k','£1.13k','£0.75k','£0.38k','£0'], xLabels: ['Jul','Aug','Sep'], series: [{ color: '#2C3420', values: [171,627,466] }, { color: '#a7ab90', values: [321,694,940] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] },
      sec: {
        overviewActuals: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£3,473', dCls: 'df', d: '3-month actuals', s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$1,422', dCls: 'df', d: '3-month actuals', s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '168', dCls: 'df', d: 'UK 100 · US 68', s: 'Jul–Sep' },
            { bar: '#C8A84B', lbl: 'Units',    val: '193', dCls: 'df', d: 'UK 118 · US 75', s: 'Jul–Sep' }
          ],
          cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 10, valText: '9.6%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 4, valText: '3.6%', color: 'amber' }
          ]
        },
        products: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£3,473', dCls: 'df', d: '3-month actuals', s: 'Jul–Sep' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '168', dCls: 'df', d: 'UK 100 · US 68', s: 'Jul–Sep' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '193', dCls: 'df', d: 'UK 118 · US 75', s: 'Jul–Sep' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£34.73', dCls: 'df', d: '3-month avg', s: 'US $20.91' }
          ],
          table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£3,473', units: '118', orders: '100', cvr: '9.6%', cvrCls: 'bg', aov: '£34.73' },
            { flag: 'us', name: 'Amazon US', revenue: '$1,422', units: '75', orders: '68', cvr: '3.6%', cvrCls: 'br', aov: '$20.91' }
          ]
        },
        pnl: {
          margin: {
        pct: '11.6%', pctColor: 'amber', note: 'Amazon UK · Jul–Sep 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£3,220' },
          { lbl: 'Selling Fees',  val: '−£459', color: 'red' },
          { lbl: 'Fulfilment',    val: '−£679', color: 'red' },
          { lbl: 'Ad Spend',      val: '−£530', color: 'red' },
          { lbl: 'COGS',          val: '−£1,176', color: 'red' },
          { lbl: 'Net Profit',    val: '£373', color: 'green', strong: true }
        ]
      },
          // marginByMarket.us: getStoreProfitAndLoss per calendar month (30-day cap), summed Jul+Aug+Sep.
          // Aug inputs are the already-baked (rounded) August figures, so 3m rows can drift ±£1 from a fresh sum.
          marginByMarket: {
            uk: {
        pct: '11.6%', pctColor: 'amber', note: 'Amazon UK · Jul–Sep 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£3,220' },
          { lbl: 'Selling Fees',  val: '−£459', color: 'red' },
          { lbl: 'Fulfilment',    val: '−£679', color: 'red' },
          { lbl: 'Ad Spend',      val: '−£530', color: 'red' },
          { lbl: 'COGS',          val: '−£1,176', color: 'red' },
          { lbl: 'Net Profit',    val: '£373', color: 'green', strong: true }
        ]
      },
            us: {
        pct: '28.0%', pctColor: 'green', note: 'Amazon US · Jul–Sep 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '$1,146' },
          { lbl: 'Selling Fees',  val: '−$254', color: 'red' },
          { lbl: 'Fulfilment',    val: '−$402', color: 'red' },
          { lbl: 'Ad Spend',      val: '$0', color: 'red' },
          { lbl: 'COGS',          val: '−$176', color: 'red' },
          { lbl: 'Net Profit',    val: '$321', color: 'green', strong: true }
        ]
      }
          },
          statement: {
        fixedLabel: 'Amazon UK · Jul–Sep 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£3,389', pct: '105.2%', unit: '£33.89' },
            { lbl: 'Promotions', amount: '−£73', pct: '−2.3%', unit: '−£0.73' },
            { lbl: 'Refunds', amount: '−£154', pct: '−4.8%', unit: '−£1.54' },
            { lbl: 'Other income', amount: '£60', pct: '1.9%', unit: '£0.60' },
            { lbl: 'Net revenue', amount: '£3,220', pct: '100.0%', unit: '£32.20', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£530', pct: '16.5%', unit: '£5.30' },
            { lbl: 'Selling fees', amount: '£459', pct: '14.3%', unit: '£4.59' },
            { lbl: 'Fulfilment and shipping', amount: '£679', pct: '21.1%', unit: '£6.79' },
            { lbl: 'Cost of goods', amount: '£1,176', pct: '36.5%', unit: '£11.76' },
            { lbl: 'Total expenses', amount: '£2,847', pct: '88.4%', unit: '£28.47', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£373', pct: '11.6%', unit: '£3.73', total: true, profit: true },
            { lbl: 'Profit %', amount: '11.6%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '118' },
            { lbl: 'Orders', amount: '100' }
          ] }
        ]
      },
          statementByMarket: {
            uk: {
        fixedLabel: 'Amazon UK · Jul–Sep 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£3,389', pct: '105.2%', unit: '£33.89' },
            { lbl: 'Promotions', amount: '−£73', pct: '−2.3%', unit: '−£0.73' },
            { lbl: 'Refunds', amount: '−£154', pct: '−4.8%', unit: '−£1.54' },
            { lbl: 'Other income', amount: '£60', pct: '1.9%', unit: '£0.60' },
            { lbl: 'Net revenue', amount: '£3,220', pct: '100.0%', unit: '£32.20', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£530', pct: '16.5%', unit: '£5.30' },
            { lbl: 'Selling fees', amount: '£459', pct: '14.3%', unit: '£4.59' },
            { lbl: 'Fulfilment and shipping', amount: '£679', pct: '21.1%', unit: '£6.79' },
            { lbl: 'Cost of goods', amount: '£1,176', pct: '36.5%', unit: '£11.76' },
            { lbl: 'Total expenses', amount: '£2,847', pct: '88.4%', unit: '£28.47', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£373', pct: '11.6%', unit: '£3.73', total: true, profit: true },
            { lbl: 'Profit %', amount: '11.6%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '118' },
            { lbl: 'Orders', amount: '100' }
          ] }
        ]
      },
            us: {
        fixedLabel: 'Amazon US · Jul–Sep 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '$1,427', pct: '124.6%', unit: '$20.98' },
            { lbl: 'Promotions', amount: '−$26', pct: '−2.3%', unit: '−$0.39' },
            { lbl: 'Refunds', amount: '−$243', pct: '−21.2%', unit: '−$3.58' },
            { lbl: 'Other income', amount: '$57', pct: '4.9%', unit: '$0.83' },
            { lbl: 'Other adjustments', amount: '−$68', pct: '−6.0%', unit: '−$1.00' },
            { lbl: 'Net revenue', amount: '$1,146', pct: '100.0%', unit: '$16.85', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '$0', pct: '0.0%', unit: '$0.00' },
            { lbl: 'Selling fees', amount: '$254', pct: '22.2%', unit: '$3.74' },
            { lbl: 'Fulfilment and shipping', amount: '$402', pct: '35.1%', unit: '$5.91' },
            { lbl: 'Cost of goods', amount: '$176', pct: '15.3%', unit: '$2.58' },
            { lbl: 'Total expenses', amount: '$825', pct: '72.0%', unit: '$12.13', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '$321', pct: '28.0%', unit: '$4.71', total: true, profit: true },
            { lbl: 'Profit %', amount: '28.0%', accent: 'green' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '75' },
            { lbl: 'Orders', amount: '68' }
          ] }
        ]
      }
          },
          mkt: [
            { name: 'Amazon UK', flag: 'gb', revenue: '£3,220', adspend: '£530', net: '£373', netColor: 'green', margin: '11.6%', marginCls: 'ba' },
            { name: 'Amazon US', flag: 'us', revenue: '$1,146', adspend: '$0',   net: '$321', netColor: 'green', margin: '28.0%', marginCls: 'bg' }
          ]
        },
        advertising: {
          metrics: [
            { lbl: 'Total Spend', val: '£530', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£1,264' },
            { lbl: 'ACOS',        val: '42.0%', color: 'amber' },
            { lbl: 'TACOS',       val: '15.3%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '2.38×', id: 'a-roas' },
            { lbl: 'Avg. CPC',    val: '—' }
          ]
        }
      }
    },
    '6m': {
      label: 'Year to Date · Jan–Sep 2026', shortLabel: 'Jan–Sep 2026',
      rev: '£11,911', revD: 'YTD actuals', revC: 'df', revS: 'Amazon UK actual',
      spend: '£1,006', spendD: 'Jan–Sep', spendC: 'df', spendS: 'ACOS 37.8%',
      tacosAd: '8.4%', tacosAdD: 'Jan–Sep', tacosAdC: 'df', tacosAdS: '£1,006 spend',
      roasAd: '2.65×', roasAdD: 'Jan–Sep', roasAdC: 'df', roasAdS: '£2,663 ad sales',
      aov: '£26.65', aovD: 'YTD avg', aovC: 'df', aovS: 'UK · 447 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£1,006', 'br', '▲ no budget', '£11,911', 'ba', '8.4%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$3,399', 'bg', '—'],
        ['Total', '', '£0', '£1,006', 'br', '▲ over', '£11,911', 'ba', '8.4%']
      ],
      adChart: { max: 300, yTicks: ['£300','£225','£150','£75','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'], xHighlight: '#2C3420', series: [{ values: [0,0,207,281,0,0,110,228,193], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // Jan–Sep: ad sales only in the active campaign months (Mar/Apr/Jul/Aug/Sep); organic tracks monthly UK
      // P&L (accrual) gross revenue net of ad-attributed sales. Sums to £8,509 organic + £2,663 ad.
      revBreakChart: { max: 3000, yTicks: ['£3k','£2.25k','£1.5k','£0.75k','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'], series: [{ color: '#2C3420', values: [0,0,651,748,0,0,171,627,466] }, { color: '#a7ab90', values: [0,216,1071,1605,2563,1099,321,694,940] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] },
      sec: {
        overviewActuals: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£11,911', dCls: 'df', d: 'YTD actuals', s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$3,399', dCls: 'df', d: 'YTD actuals', s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '607', dCls: 'df', d: 'UK 447 · US 160', s: 'Jan–Sep' },
            { bar: '#C8A84B', lbl: 'Units',    val: '690', dCls: 'df', d: 'UK 513 · US 177', s: 'Jan–Sep' }
          ],
          cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 12, valText: '12.3%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 3, valText: '2.5%', color: 'amber' }
          ]
        },
        products: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£11,911', dCls: 'df', d: 'YTD actuals', s: 'Jan–Sep' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '607', dCls: 'df', d: 'UK 447 · US 160', s: 'Jan–Sep' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '690', dCls: 'df', d: 'UK 513 · US 177', s: 'Jan–Sep' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£26.65', dCls: 'df', d: 'YTD avg', s: 'US $21.24' }
          ],
          table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£11,911', units: '513', orders: '447', cvr: '12.3%', cvrCls: 'bg', aov: '£26.65' },
            { flag: 'us', name: 'Amazon US', revenue: '$3,399', units: '177', orders: '160', cvr: '2.5%', cvrCls: 'br', aov: '$21.24' }
          ]
        },
        pnl: {
          margin: {
        pct: '16.5%', pctColor: 'amber', note: 'Amazon UK · Jan–Sep 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£11,171' },
          { lbl: 'Selling Fees',  val: '−£1,882', color: 'red' },
          { lbl: 'Fulfilment',    val: '−£2,538', color: 'red' },
          { lbl: 'Ad Spend',      val: '−£1,019', color: 'red' },
          { lbl: 'COGS',          val: '−£3,880', color: 'red' },
          { lbl: 'Net Profit',    val: '£1,847', color: 'green', strong: true }
        ]
      },
          statement: {
        fixedLabel: 'Amazon UK · Jan–Sep 2026 (all-time)',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£11,828', pct: '105.9%', unit: '£26.46' },
            { lbl: 'Promotions', amount: '−£293', pct: '−2.6%', unit: '−£0.66' },
            { lbl: 'Refunds', amount: '−£213', pct: '−1.9%', unit: '−£0.48' },
            { lbl: 'Other income', amount: '£205', pct: '1.8%', unit: '£0.46' },
            { lbl: 'Net revenue', amount: '£11,171', pct: '100.0%', unit: '£24.99', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£1,019', pct: '9.1%', unit: '£2.28' },
            { lbl: 'Selling fees', amount: '£1,882', pct: '16.8%', unit: '£4.21' },
            { lbl: 'Fulfilment and shipping', amount: '£2,538', pct: '22.7%', unit: '£5.68' },
            { lbl: 'Cost of goods', amount: '£3,880', pct: '34.7%', unit: '£8.68' },
            { lbl: 'Total expenses', amount: '£9,324', pct: '83.5%', unit: '£20.86', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£1,847', pct: '16.5%', unit: '£4.13', total: true, profit: true },
            { lbl: 'Profit %', amount: '16.5%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '513' },
            { lbl: 'Orders', amount: '447' }
          ] }
        ]
      },
          mkt: [
            { name: 'Amazon UK', flag: 'gb', revenue: '£11,171', adspend: '£1,019', net: '£1,847', netColor: 'green', margin: '16.5%', marginCls: 'ba' },
            { name: 'Amazon US', flag: 'us', revenue: '$2,387', adspend: '$0',   net: '$572', netColor: 'green', margin: '24.0%', marginCls: 'bg' }
          ]
        },
        advertising: {
          metrics: [
            { lbl: 'Total Spend', val: '£1,006', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£2,663' },
            { lbl: 'ACOS',        val: '37.8%', color: 'amber' },
            { lbl: 'TACOS',       val: '8.4%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '2.65×', id: 'a-roas' },
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

    // ===== AMAZON ANALYTICS — MerchantSpring pulled 2026-10-05 (Harvaza Distribution UK + US) =====
    // Top-level (period-independent) sections so the Amazon pages render under the founder 'fy'
    // selector. UK = GBP, US = USD (mixed-currency, shown per-market). TODO: replace with a
    // build-harvaza-data.ps1 baker for repeatable refresh.
    // Founder Overview "Amazon actuals" widgets. kpis + cvr are period-aware (sec.overviewActuals on
    // 3m/6m); revTrend + buyBox are top-level (don't vary by period). Default here = Last Month (September).
    overviewActuals: {
      kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£1,502', dCls: 'du', d: '▲ vs £1,347 Aug', s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$303', dCls: 'dd', d: '▼ vs $568 Aug', s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '63', dCls: 'df', d: 'UK 48 · US 15', s: 'Sep 2026' },
            { bar: '#C8A84B', lbl: 'Units',    val: '73', dCls: 'df', d: 'UK 57 · US 16', s: 'Sep 2026' }
          ],
      revTrend: {
        max: 3000, yTicks: ['£3k', '£2.25k', '£1.5k', '£0.75k', '£0'],
        xLabels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], xHighlight: '#2C3420',
        series: [{ values: [2024, 2911, 836, 624, 1347, 1502], color: '#2C3420', area: true, main: true }],
        legend: [{ name: 'Amazon UK revenue (ordered)', color: '#2C3420' }]
      },
      // Buy Box = page-view-weighted daily buyboxWinPercentage for September (getSalesByPeriod daily sums).
      buyBox: [
        { label: 'Amazon UK', flag: 'gb', pct: 96,  valText: '95.6%',  color: 'green' },
        { label: 'Amazon US', flag: 'us', pct: 96, valText: '95.5%', color: 'green' }
      ],
      cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 11, valText: '10.8%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 4, valText: '3.5%', color: 'amber' }
          ]
    },

    // Default = Last Month (September 2026). 3m/6m override via dateRanges[p].sec.products.
    products: {
      kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£1,502', dCls: 'du', d: '▲ vs £1,347 Aug', s: 'Sep 2026' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '63', dCls: 'df', d: 'UK 48 · US 15', s: 'Sep 2026' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '73', dCls: 'df', d: 'UK 57 · US 16', s: 'Sep 2026' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£31.30', dCls: 'dd', d: '▼ vs £35.44 Aug', s: 'US $20.21' }
          ],
      table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£1,502', units: '57', orders: '48', cvr: '10.8%', cvrCls: 'bg', aov: '£31.30' },
            { flag: 'us', name: 'Amazon US', revenue: '$303', units: '16', orders: '15', cvr: '3.5%', cvrCls: 'br', aov: '$20.21' }
          ],
      // Sales by Product (per-ASIN, replaces the low-value 2-row "Performance by Market" table — see
      // config.hideProductsMarketTable). getSalesByProduct per channel per window, keyed like AMACX's
      // groupsByPeriod (period → market). US has no ad account (README) so adSpend/tacos/cvr are '—'/'n/a'
      // there, not 0 — a true $0 would claim a measured-good TACOS that was never measured. All three
      // windows re-pulled 2026-10-05 and reconcile to the headline: may UK £1,502.30 / US $303.15, 3m UK
      // £3,472.81 / US $1,421.93, 6m UK £11,911.13 / US $3,399.05. UK "6×200ml" folds the live
      // HBPACK-6x200 + HBPACK-6x200-FBM SKUs (same ASIN B0D29PL6NJ) with — in the 6m window — the legacy
      // HBPACK-6x200-MB SKU (£3,321 / 241u Jan–Jun, now quantity 0 since 2026-09-21; the ASIN itself is still
      // served by the new SKUs). TACOS badge: ≤20% bg, ≤35% ba, else br. Zero-sale SKUs omitted.
      groupsByPeriod: {
        '3m': {
          uk: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£2,836', units: '90', pct: '82%', adSpend: '£375', tacos: '13.2%', tacosCls: 'bg', cvr: '5.9%', cvrCls: 'ba', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 24×200ml (FBM)', sales: '£387', units: '11', pct: '11%', adSpend: '£37', tacos: '9.6%', tacosCls: 'bg', cvr: '3.6%', cvrCls: 'br', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£250', units: '17', pct: '7%', adSpend: '£118', tacos: '47.2%', tacosCls: 'br', cvr: '11.3%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' }
          ],
          us: [
            { name: 'Hydrte 11.8oz — Nero', sales: '$451', units: '25', pct: '32%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$434', units: '21', pct: '30%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Nero', sales: '$306', units: '15', pct: '22%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$231', units: '14', pct: '16%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ],
          all: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£2,836', units: '90', pct: '82%', adSpend: '£375', tacos: '13.2%', tacosCls: 'bg', cvr: '5.9%', cvrCls: 'ba', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 24×200ml (FBM)', sales: '£387', units: '11', pct: '11%', adSpend: '£37', tacos: '9.6%', tacosCls: 'bg', cvr: '3.6%', cvrCls: 'br', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£250', units: '17', pct: '7%', adSpend: '£118', tacos: '47.2%', tacosCls: 'br', cvr: '11.3%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Nero', sales: '$451', units: '25', pct: '32%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$434', units: '21', pct: '30%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Nero', sales: '$306', units: '15', pct: '22%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$231', units: '14', pct: '16%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ]
        },
        'may': {
          uk: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£1,252', units: '40', pct: '83%', adSpend: '£75', tacos: '6.0%', tacosCls: 'bg', cvr: '6.3%', cvrCls: 'ba', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£250', units: '17', pct: '17%', adSpend: '£118', tacos: '47.2%', tacosCls: 'br', cvr: '11.3%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' }
          ],
          us: [
            { name: 'Hydrte 11.8oz — Nero', sales: '$126', units: '7', pct: '41%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$87', units: '4', pct: '29%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$47', units: '3', pct: '15%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Nero', sales: '$44', units: '2', pct: '14%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ],
          all: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£1,252', units: '40', pct: '83%', adSpend: '£75', tacos: '6.0%', tacosCls: 'bg', cvr: '6.3%', cvrCls: 'ba', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£250', units: '17', pct: '17%', adSpend: '£118', tacos: '47.2%', tacosCls: 'br', cvr: '11.3%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Nero', sales: '$126', units: '7', pct: '41%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$87', units: '4', pct: '29%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$47', units: '3', pct: '15%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Nero', sales: '$44', units: '2', pct: '14%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ]
        },
        '6m': {
          uk: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£7,954', units: '244', pct: '67%', adSpend: '£514', tacos: '6.5%', tacosCls: 'bg', cvr: '6.8%', cvrCls: 'ba', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£3,571', units: '258', pct: '30%', adSpend: '£467', tacos: '13.1%', tacosCls: 'bg', cvr: '9.4%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 24×200ml (FBM)', sales: '£387', units: '11', pct: '3%', adSpend: '£37', tacos: '9.6%', tacosCls: 'bg', cvr: '3.6%', cvrCls: 'br', oosRate: '0%', oosCls: 'bg' }
          ],
          us: [
            { name: 'Hydrte 18oz — Nero', sales: '$1,214', units: '59', pct: '36%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Nero', sales: '$1,048', units: '59', pct: '31%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$793', units: '38', pct: '23%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$344', units: '21', pct: '10%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ],
          all: [
            { name: 'Bervera 24×200ml (FBA)', sales: '£7,954', units: '244', pct: '67%', adSpend: '£514', tacos: '6.5%', tacosCls: 'bg', cvr: '6.8%', cvrCls: 'ba', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 6×200ml', sales: '£3,571', units: '258', pct: '30%', adSpend: '£467', tacos: '13.1%', tacosCls: 'bg', cvr: '9.4%', cvrCls: 'bg', oosRate: '0%', oosCls: 'bg' },
            { name: 'Bervera 24×200ml (FBM)', sales: '£387', units: '11', pct: '3%', adSpend: '£37', tacos: '9.6%', tacosCls: 'bg', cvr: '3.6%', cvrCls: 'br', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Nero', sales: '$1,214', units: '59', pct: '36%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Nero', sales: '$1,048', units: '59', pct: '31%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 18oz — Slate', sales: '$793', units: '38', pct: '23%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', sales: '$344', units: '21', pct: '10%', adSpend: '$0', tacos: '—', tacosCls: 'bb', cvr: 'n/a', cvrCls: 'bb', oosRate: '0%', oosCls: 'bg' }
          ]
        }
      }
    },

    // Current stock snapshot (period-independent) — getSalesByProduct includeNoInventory, both channels.
    // Re-baked 2026-10-05. UK FBA 24-pack restocked 30 → 92 units (~19 → ~73 days cover; the FBM 24-pack
    // fell 193 → 18 units in the same window, consistent with a transfer into FBA). Two UK FBM-only ASINs
    // (12×200ml, 6×750ml) went to zero stock on 2026-09-11 / 2026-09-09 with no sales in any window — counted
    // as OOS per the runbook (quantity==0). The legacy HBPACK-6x200-MB SKU is also at zero (since 2026-09-21)
    // but its ASIN B0D29PL6NJ is live on the HBPACK-6x200 / -FBM SKUs (210 units), so it is not an OOS ASIN.
    inventory: {
      kpis: [
        { bar: 'green', lbl: 'In Stock',  val: '6',   dCls: 'du', d: 'ASINs healthy',  s: 'UK + US' },
        { bar: 'amber', lbl: 'Low Stock', val: '0',   dCls: 'du', d: 'None currently', s: '—' },
        { bar: 'red',   lbl: 'OOS',       val: '2',   dCls: 'dd', d: 'UK FBM ASINs',   s: 'zero stock' },
        { bar: 'blue',  lbl: 'OOS %',     val: '50%', dCls: 'dd', d: 'UK channel',     s: 'US 0%' }
      ],
      stock: [
        { dot: 'dg', name: 'Bervera 24×200ml — UK (FBA)', note: 'B0CQRHMWFL · FBA · Healthy', units: '92 units',  days: '~73 days' },
        { dot: 'dg', name: 'Bervera 24×200ml — UK (FBM)', note: 'B0CQRHMWFL · FBM · Healthy (no sales since 18 Aug)', units: '18 units', days: '—' },
        { dot: 'dg', name: 'Bervera 6×200ml — UK (FBA)',  note: 'B0D29PL6NJ · FBA · Healthy', units: '210 units', days: '~450 days' },
        { dot: 'dr', name: 'Bervera 12×200ml — UK (FBM)', note: 'B0DQHCR2K7 · FBM · OOS since 11 Sep', units: '0 units', days: '—' },
        { dot: 'dr', name: 'Bervera 6×750ml — UK (FBM)',  note: 'B0FKH4TRFH · FBM · OOS since 9 Sep', units: '0 units', days: '—' },
        { dot: 'dg', name: 'Hydrte 18oz — Slate (US)',    note: 'B0CHJNPWHV · FBA · Healthy', units: '56 units', days: '~336 days' },
        { dot: 'dg', name: 'Hydrte 11.8oz — Nero (US)',   note: 'B0B1N844DS · FBA · Healthy', units: '26 units', days: '~111 days' },
        { dot: 'dg', name: 'Hydrte 18oz — Nero (US)',     note: 'B0CRKS94F1 · FBA · Healthy', units: '49 units', days: '~1461 days' },
        { dot: 'dg', name: 'Hydrte 11.8oz — Champagne (US)', note: 'B0B1N7759K · FBA · Healthy', units: '81 units', days: '~608 days' }
      ],
      restock: [
        { level: 'red', title: 'Bervera 12×200ml — UK (FBM) — stock-up now', sub: 'Zero stock since 11 Sep · no sales in 2026 to date, so no revenue at risk yet — confirm whether this listing is still live' },
        { level: 'red', title: 'Bervera 6×750ml — UK (FBM) — stock-up now', sub: 'Zero stock since 9 Sep · no sales in 2026 to date, so no revenue at risk yet — confirm whether this listing is still live' }
      ]
    },

    // Amazon P&L — accrual basis (getStoreProfitAndLoss, profitabilityView:'accrual'). Renders on the 'pnl'
    // page ("Amazon P&L"). UK = £ base; US shown $ in the per-market table. This card's own "Advertising"
    // line is the P&L tool's own figure — a different lens from the Advertising-page spend
    // (dateRanges/sections.advertising); the two are not meant to reconcile (same convention as ordered vs
    // net P&L revenue elsewhere in this file). UK Sep: ad spend £192.55 matches the daily-sum spend exactly.
    // US "Other adjustments" row (new): the US P&L tool's income lines (sales/promotions/refunds/other
    // income/reimbursements) do not sum to its own totalRevenue — the gap (−$19 Sep, −$17 Aug, −$33 Jul) is
    // unlabelled by the tool, so it is shown as one explicit reconciling row rather than hidden. The UK
    // income lines tie to within £1.
    pnl: {
      // Product portfolio — re-baked 2026-10-05 from getProductProfitAndLoss (recovered this run; July's
      // carried-forward numbers are replaced). Margin = totalProfit ÷ totalRevenue per SKU (accrual, September).
      // The UK 6×200ml ASIN is EXCLUDED: MerchantSpring has no COGS on it (cogs £0 on both SKUs, 17 units
      // sold), so its 60.6% margin is unreconciled — left out per the "leave a metric out rather than bake an
      // unreconciled number" convention. Same reason UK store-level net profit is slightly overstated until
      // that COGS is entered. UK 24×200ml FBM: £5.90 revenue / −£32.33 profit is returns + refunds on August
      // sales (no September FBM sales), so its margin is not meaningful as a percentage. Breakeven = |margin| < 5%.
      // Three zero-sales rows keyed by bare ASIN (reimbursement-only, <$2 each) are excluded.
      portfolio: {
        total: 6, profitable: 4, breakeven: 1, unprofitable: 1, periodLabel: 'September 2026',
        most: [
          { name: 'Hydrte 18oz — Slate (US)',     profit: '$45',  margin: '42%', marginCls: 'bg' },
          { name: 'Hydrte 11.8oz — Nero (US)',    profit: '$52',  margin: '35%', marginCls: 'bg' },
          { name: 'Hydrte 11.8oz — Champagne (US)', profit: '$10', margin: '31%', marginCls: 'bg' }
        ],
        least: [
          { name: 'Bervera 24×200ml (UK, FBM)',   profit: '−£32', margin: '−548%', marginCls: 'br', color: 'var(--red)' },
          { name: 'Hydrte 18oz — Nero (US)',      profit: '$2',   margin: '4%',  marginCls: 'br', color: 'var(--red)' }
        ]
      },
      portfolioByMarket: {
        uk: {
          total: 2, profitable: 1, breakeven: 0, unprofitable: 1, periodLabel: 'September 2026',
          most: [
            { name: 'Bervera 24×200ml (FBA)', profit: '£381', margin: '30%', marginCls: 'bg' }
          ],
          least: [
            { name: 'Bervera 24×200ml (FBM)', profit: '−£32', margin: '−548%', marginCls: 'br', color: 'var(--red)' }
          ]
        },
        us: {
          total: 4, profitable: 3, breakeven: 1, unprofitable: 0, periodLabel: 'September 2026',
          most: [
            { name: 'Hydrte 18oz — Slate', profit: '$45', margin: '42%', marginCls: 'bg' },
            { name: 'Hydrte 11.8oz — Nero', profit: '$52', margin: '35%', marginCls: 'bg' },
            { name: 'Hydrte 11.8oz — Champagne', profit: '$10', margin: '31%', marginCls: 'bg' }
          ],
          least: [
            { name: 'Hydrte 18oz — Nero', profit: '$2', margin: '4%', marginCls: 'br', color: 'var(--red)' }
          ]
        }
      },
      margin: {
        pct: '11.0%', pctColor: 'amber', note: 'Amazon UK · September 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£1,406' },
          { lbl: 'Selling Fees',  val: '−£200', color: 'red' },
          { lbl: 'Fulfilment',    val: '−£381', color: 'red' },
          { lbl: 'Ad Spend',      val: '−£193', color: 'red' },
          { lbl: 'COGS',          val: '−£476', color: 'red' },
          { lbl: 'Net Profit',    val: '£155', color: 'green', strong: true }
        ]
      },
      // marginByMarket/statementByMarket: getStoreProfitAndLoss per channel (accrual, same method as the
      // blended UK cards above — US net $95/32.8% here matches the `mkt` row below to the penny). US has no
      // ad account, so Ad Spend is a real $0 (measured, not "no data").
      marginByMarket: {
        uk: {
        pct: '11.0%', pctColor: 'amber', note: 'Amazon UK · September 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£1,406' },
          { lbl: 'Selling Fees',  val: '−£200', color: 'red' },
          { lbl: 'Fulfilment',    val: '−£381', color: 'red' },
          { lbl: 'Ad Spend',      val: '−£193', color: 'red' },
          { lbl: 'COGS',          val: '−£476', color: 'red' },
          { lbl: 'Net Profit',    val: '£155', color: 'green', strong: true }
        ]
      },
        us: {
        pct: '32.8%', pctColor: 'green', note: 'Amazon US · September 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '$289' },
          { lbl: 'Selling Fees',  val: '−$62', color: 'red' },
          { lbl: 'Fulfilment',    val: '−$86', color: 'red' },
          { lbl: 'Ad Spend',      val: '$0', color: 'red' },
          { lbl: 'COGS',          val: '−$46', color: 'red' },
          { lbl: 'Net Profit',    val: '$95', color: 'green', strong: true }
        ]
      }
      },
      statement: {
        fixedLabel: 'Amazon UK · September 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£1,508', pct: '107.2%', unit: '£31.42' },
            { lbl: 'Promotions', amount: '−£21', pct: '−1.5%', unit: '−£0.44' },
            { lbl: 'Refunds', amount: '−£85', pct: '−6.0%', unit: '−£1.77' },
            { lbl: 'Other income', amount: '£4', pct: '0.3%', unit: '£0.09' },
            { lbl: 'Net revenue', amount: '£1,406', pct: '100.0%', unit: '£29.30', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£193', pct: '13.7%', unit: '£4.01' },
            { lbl: 'Selling fees', amount: '£200', pct: '14.2%', unit: '£4.17' },
            { lbl: 'Fulfilment and shipping', amount: '£381', pct: '27.1%', unit: '£7.93' },
            { lbl: 'Cost of goods', amount: '£476', pct: '33.8%', unit: '£9.91' },
            { lbl: 'Total expenses', amount: '£1,251', pct: '89.0%', unit: '£26.07', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£155', pct: '11.0%', unit: '£3.23', total: true, profit: true },
            { lbl: 'Profit %', amount: '11.0%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '57' },
            { lbl: 'Orders', amount: '48' }
          ] }
        ]
      },
      statementByMarket: {
        uk: {
        fixedLabel: 'Amazon UK · September 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£1,508', pct: '107.2%', unit: '£31.42' },
            { lbl: 'Promotions', amount: '−£21', pct: '−1.5%', unit: '−£0.44' },
            { lbl: 'Refunds', amount: '−£85', pct: '−6.0%', unit: '−£1.77' },
            { lbl: 'Other income', amount: '£4', pct: '0.3%', unit: '£0.09' },
            { lbl: 'Net revenue', amount: '£1,406', pct: '100.0%', unit: '£29.30', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£193', pct: '13.7%', unit: '£4.01' },
            { lbl: 'Selling fees', amount: '£200', pct: '14.2%', unit: '£4.17' },
            { lbl: 'Fulfilment and shipping', amount: '£381', pct: '27.1%', unit: '£7.93' },
            { lbl: 'Cost of goods', amount: '£476', pct: '33.8%', unit: '£9.91' },
            { lbl: 'Total expenses', amount: '£1,251', pct: '89.0%', unit: '£26.07', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£155', pct: '11.0%', unit: '£3.23', total: true, profit: true },
            { lbl: 'Profit %', amount: '11.0%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '57' },
            { lbl: 'Orders', amount: '48' }
          ] }
        ]
      },
        us: {
        fixedLabel: 'Amazon US · September 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '$325', pct: '112.5%', unit: '$21.70' },
            { lbl: 'Promotions', amount: '−$7', pct: '−2.4%', unit: '−$0.46' },
            { lbl: 'Refunds', amount: '−$20', pct: '−7.1%', unit: '−$1.36' },
            { lbl: 'Other income', amount: '$10', pct: '3.4%', unit: '$0.65' },
            { lbl: 'Other adjustments', amount: '−$19', pct: '−6.4%', unit: '−$1.24' },
            { lbl: 'Net revenue', amount: '$289', pct: '100.0%', unit: '$19.29', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '$0', pct: '0.0%', unit: '$0.00' },
            { lbl: 'Selling fees', amount: '$62', pct: '21.5%', unit: '$4.16' },
            { lbl: 'Fulfilment and shipping', amount: '$86', pct: '29.9%', unit: '$5.77' },
            { lbl: 'Cost of goods', amount: '$46', pct: '15.9%', unit: '$3.06' },
            { lbl: 'Total expenses', amount: '$194', pct: '67.2%', unit: '$12.96', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '$95', pct: '32.8%', unit: '$6.33', total: true, profit: true },
            { lbl: 'Profit %', amount: '32.8%', accent: 'green' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '16' },
            { lbl: 'Orders', amount: '15' }
          ] }
        ]
      }
      },
      mkt: [
        { name: 'Amazon UK', flag: 'gb', revenue: '£1,406', adspend: '£193', net: '£155', netColor: 'green', margin: '11.0%', marginCls: 'ba' },
        { name: 'Amazon US', flag: 'us', revenue: '$289', adspend: '$0',   net: '$95', netColor: 'green', margin: '32.8%', marginCls: 'bg' }
      ]
    },

    // Advertising — UK ads active continuously since late July (paused May–Jun, active Mar–Apr before that).
    // No CPC / campaign-level breakdown: getAdvertisingByChannels still throws its schema error, and
    // getAdvertisingCampaigns attributed sales don't reconcile to the account-level daily sums, so the
    // figures are the same reconciled daily-interval sums as dateRanges above (and tie to the
    // getSalesByProduct per-SKU adSpend/adSales totals: £192.55 / £465.76). KPI row + chart come from
    // dateRanges (above); these cards fill the rest of the page.
    advertising: {
      metrics: [
            { lbl: 'Total Spend', val: '£193', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£466' },
            { lbl: 'ACOS',        val: '41.3%', color: 'amber' },
            { lbl: 'TACOS',       val: '12.8%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '2.42×', id: 'a-roas' },
            { lbl: 'Avg. CPC',    val: '—' }
          ],
      budgets: {
        headers: ['Jul', 'Aug', 'Spend Sep', 'Plan'],
        subLabel: 'Active Sep 2026 · continuing from Jul (paused May–Jun before that)',
        rows: [
          { name: 'Amazon UK', flag: 'gb', cells: ['£110', '£228', '£193', 'TBC'] },
          { name: 'Amazon US', flag: 'us', cells: ['$0', '$0', '$0', 'TBC'] },
          { name: 'Total', total: true, cells: ['£110', '£228', '£193', '—'] }
        ]
      },
      forecast: [
        { month: 'Oct', budget: 'TBC', pct: 3, opacity: 0.5, tacos: '—', tacosColor: 'muted', roas: '—' },
        { month: 'Nov', budget: 'TBC', pct: 3, opacity: 0.4, tacos: '—', tacosColor: 'muted', roas: '—' }
      ],
      campaigns: [
        { name: 'All active campaigns', type: 'Amazon UK · September 2026', spend: '£193', sales: '£466', acos: '41.3%', acosCls: 'br', roas: '2.42×', cpc: '—', status: 'Active', statusCls: 'bg' }
      ]
    }
  }
};
