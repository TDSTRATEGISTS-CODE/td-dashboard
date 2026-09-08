/* Harvaza Ltd (Bervera) — client data. Loaded as window.DASHBOARD_DATA.
   Static Year-1 forecast (Jun 2026 – May 2027), baked from the founder model. The shell reads
   `sections.founder` to render the four founder pages. Amazon pages show the maintenance stub.
   When live data arrives: UK Amazon actuals (MCP) overlay the monthly P&L + stock; the Google
   Sheet supplies forecast/budgets; Shopify adds a channel section. Keep this shape stable. */
window.DASHBOARD_DATA = {

  // Minimal date-range entry so the shell's switchDateRange paints the topbar + sidebar chips.
  // Founder KPIs are rendered from sections.founder, not from these fields.
  dateRanges: {
    // Amazon ACTUALS lenses (MerchantSpring pulled 2026-09-05). Sales/units/AOV are per-month native-
    // currency sums (getSalesByPeriod, daily-interval calls summed per month — the multi-month 'M'-interval
    // variant mislabels/zeroes buckets and getSalesByChannels/getAdvertisingByChannels both threw persistent
    // schema-validation errors this run (buyBoxSnapshot / troas type mismatches, not a "no data" case), so
    // the daily-interval fallback is the source this month, same pattern as the AMACX/NKV weekly-sum
    // workaround. Daily sums were cross-checked to the penny against getStoreProfitAndLoss (Aug UK ad spend
    // £228.26 both ways) and getSalesByProduct's own prior/current fields (Aug/Jul UK + Aug US). Ad
    // spend/sales/ACOS/TACOS/ROAS are the same daily-interval sums — NOT the same figure as the P&L card's
    // own "Advertising" line (getStoreProfitAndLoss, accrual view — a different, cash/earn-basis lens; the
    // two are intentionally not reconciled, per the AMACX/Harvaza convention that ordered vs net P&L revenue
    // are separate valid views). Chip totals (mktRows col 6) = per-period ACTUAL sales (UK £, US $). 'all'
    // chip (rev) = UK £ total (US is a separate currency, not summed). Forecast is NOT here — it lives on
    // the P&L Detail page. UK Amazon revenue more than doubled May→Jun/Jul lull to Aug (£624→£1,347); this
    // was verified independently via getSalesByProduct's prior/current fields (not just the daily-sum
    // reconstruction) and lines up with the FBA SKU's restock (quantity back to 41 units, ~31 days cover,
    // vs OOS-adjacent stock in the founder Overview) landing right at the start of the founder-flagged
    // "Peak season — Jul/Aug/Sep · 200ml BSR recovery critical window" — treated as a validated, explained
    // swing rather than a data error (see the Harvaza run-log comment on issue #19 for the full note).
    // Per-period sec.products overrides the top-level (last-month) Products section.
    may: {
      label: 'Last Month · August 2026', shortLabel: 'August 2026',
      rev: '£1,347', revD: '▲ vs £624 Jul', revC: 'du', revS: 'Amazon UK actual',
      spend: '£228', spendD: 'August 2026', spendC: 'df', spendS: 'ACOS 36.4%',
      tacosAd: '17.0%', tacosAdD: 'August', tacosAdC: 'df', tacosAdS: '£228 spend',
      roasAd: '2.75×', roasAdD: 'August', roasAdC: 'df', roasAdS: '£627 ad sales',
      aov: '£35.44', aovD: '▼ vs £44.56 Jul', aovC: 'dd', aovS: 'UK · 38 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£228', 'br', '▲ no budget', '£1,347', 'ba', '17.0%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$568', 'bg', '—'],
        ['Total', '', '£0', '£228', 'br', '▲ over', '£1,347', 'ba', '17.0%']
      ],
      adChart: { max: 300, yTicks: ['£300','£225','£150','£75','£0'], xLabels: ['Mar','Apr','May','Jun','Jul','Aug'], xHighlight: '#2C3420', series: [{ values: [207,281,0,0,110,228], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // Revenue Breakdown — stacked monthly bars (Ad sales vs Organic). Segments sum to the P&L
      // (accrual) gross revenue; Σad reconciles to the Advertising-page ad sales figure.
      revBreakChart: { max: 1500, yTicks: ['£1.5k','£1.13k','£0.75k','£0.38k','£0'], xLabels: ['Aug'], series: [{ color: '#2C3420', values: [627] }, { color: '#a7ab90', values: [694] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] }
    },
    '3m': {
      label: 'Last 3 Months · Jun–Aug 2026', shortLabel: 'Jun–Aug 2026',
      rev: '£2,806', revD: '3-month actuals', revC: 'df', revS: 'Amazon UK actual',
      spend: '£338', spendD: 'Jun–Aug', spendC: 'df', spendS: 'ACOS 42.3%',
      tacosAd: '12.0%', tacosAdD: 'Jun–Aug', tacosAdC: 'df', tacosAdS: '£338 spend',
      roasAd: '2.36×', roasAdD: 'Jun–Aug', roasAdC: 'df', roasAdS: '£798 ad sales',
      aov: '£33.01', aovD: '3-month avg', aovC: 'df', aovS: 'UK · 85 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£338', 'br', '▲ no budget', '£2,806', 'ba', '12.0%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$1,460', 'bg', '—'],
        ['Total', '', '£0', '£338', 'br', '▲ over', '£2,806', 'ba', '12.0%']
      ],
      adChart: { max: 300, yTicks: ['£300','£225','£150','£75','£0'], xLabels: ['Mar','Apr','May','Jun','Jul','Aug'], xHighlight: '#2C3420', series: [{ values: [207,281,0,0,110,228], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // Jun: no ads. Jul: ad sales £171, organic £321. Aug: ad sales £627, organic £694.
      revBreakChart: { max: 1500, yTicks: ['£1.5k','£1.13k','£0.75k','£0.38k','£0'], xLabels: ['Jun','Jul','Aug'], series: [{ color: '#2C3420', values: [0,171,627] }, { color: '#a7ab90', values: [1099,321,694] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] },
      sec: {
        overviewActuals: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£2,806', dCls: 'df', d: '3-month actuals', s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$1,460', dCls: 'df', d: '3-month actuals', s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '155',    dCls: 'df', d: 'UK 85 · US 70',   s: 'Jun–Aug' },
            { bar: '#C8A84B', lbl: 'Units',    val: '174',    dCls: 'df', d: 'UK 97 · US 77',   s: 'Jun–Aug' }
          ],
          cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 10, valText: '9.9%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 3,  valText: '3.1%',  color: 'amber' }
          ]
        },
        products: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£2,806', dCls: 'df', d: '3-month actuals', s: 'Jun–Aug' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '155',    dCls: 'df', d: 'UK 85 · US 70',   s: 'Jun–Aug' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '174',    dCls: 'df', d: 'UK 97 · US 77',   s: 'Jun–Aug' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£33.01', dCls: 'df', d: '3-month avg',     s: 'US $20.85' }
          ],
          table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£2,806', units: '97', orders: '85', cvr: '9.9%', cvrCls: 'bg', aov: '£33.01' },
            { flag: 'us', name: 'Amazon US', revenue: '$1,460', units: '77',  orders: '70',  cvr: '3.1%',  cvrCls: 'br', aov: '$20.85' }
          ]
        },
        pnl: {
          margin: {
            pct: '23.1%', pctColor: 'amber', note: 'Amazon UK · Jun–Aug 2026',
            rows: [
              { lbl: 'Gross Revenue', val: '£2,912' },
              { lbl: 'Selling Fees',  val: '−£455',   color: 'red' },
              { lbl: 'Fulfilment',    val: '−£501',   color: 'red' },
              { lbl: 'Ad Spend',      val: '−£338',   color: 'red' },
              { lbl: 'COGS',          val: '−£943', color: 'red' },
              { lbl: 'Net Profit',    val: '£673',  color: 'green', strong: true }
            ]
          },
          statement: {
            fixedLabel: 'Amazon UK · Jun–Aug 2026',
            groups: [
              { header: 'Income', rows: [
                { lbl: 'Shipped product sales', amount: '£3,033', pct: '104.1%', unit: '£35.68' },
                { lbl: 'Promotions', amount: '−£85', pct: '−2.9%', unit: '−£1.00' },
                { lbl: 'Refunds', amount: '−£103', pct: '−3.5%', unit: '−£1.21' },
                { lbl: 'Other income', amount: '£70', pct: '2.4%', unit: '£0.83' },
                { lbl: 'Net revenue', amount: '£2,912', pct: '100.0%', unit: '£34.26', total: true }
              ] },
              { header: 'Expenses', rows: [
                { lbl: 'Advertising', amount: '£338', pct: '11.6%', unit: '£3.97' },
                { lbl: 'Selling fees', amount: '£455', pct: '15.6%', unit: '£5.35' },
                { lbl: 'Fulfilment and shipping', amount: '£501', pct: '17.2%', unit: '£5.90' },
                { lbl: 'Cost of goods', amount: '£943', pct: '32.4%', unit: '£11.08' },
                { lbl: 'Total expenses', amount: '£2,237', pct: '76.8%', unit: '£26.31', total: true }
              ] },
              { header: 'Profit', rows: [
                { lbl: 'PROFIT', amount: '£673', pct: '23.1%', unit: '£7.92', total: true, profit: true },
                { lbl: 'Profit %', amount: '23.1%', accent: 'green' }
              ] },
              { header: 'Metrics', rows: [
                { lbl: 'Units sold', amount: '97' },
                { lbl: 'Orders', amount: '85' }
              ] }
            ]
          },
          mkt: [
            { name: 'Amazon UK', flag: 'gb', revenue: '£2,912', adspend: '£338', net: '£673', netColor: 'green', margin: '23.1%', marginCls: 'ba' },
            { name: 'Amazon US', flag: 'us', revenue: '$1,234', adspend: '$0',   net: '$357',   netColor: 'green', margin: '29.0%', marginCls: 'bg' }
          ]
        },
        advertising: {
          metrics: [
            { lbl: 'Total Spend', val: '£338', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£798' },
            { lbl: 'ACOS',        val: '42.3%', color: 'amber' },
            { lbl: 'TACOS',       val: '12.0%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '2.36×', id: 'a-roas' },
            { lbl: 'Avg. CPC',    val: '—' }
          ]
        }
      }
    },
    '6m': {
      label: 'Year to Date · Jan–Aug 2026', shortLabel: 'Jan–Aug 2026',
      rev: '£10,409', revD: 'YTD actuals', revC: 'df', revS: 'Amazon UK actual',
      spend: '£813', spendD: 'Jan–Aug', spendC: 'df', spendS: 'ACOS 37.0%',
      tacosAd: '7.8%', tacosAdD: 'Jan–Aug', tacosAdC: 'df', tacosAdS: '£813 spend',
      roasAd: '2.70×', roasAdD: 'Jan–Aug', roasAdC: 'df', roasAdS: '£2,197 ad sales',
      aov: '£26.09', aovD: 'YTD avg', aovC: 'df', aovS: 'UK · 399 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£813', 'br', '▲ no budget', '£10,409', 'ba', '7.8%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$3,096', 'bg', '—'],
        ['Total', '', '£0', '£813', 'br', '▲ over', '£10,409', 'ba', '7.8%']
      ],
      adChart: { max: 300, yTicks: ['£300','£225','£150','£75','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'], xHighlight: '#2C3420', series: [{ values: [0,0,207,281,0,0,110,228], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // Jan–Aug: ad sales only in the active campaign months (Mar/Apr/Jul/Aug); organic tracks monthly UK
      // P&L (accrual) gross revenue net of ad-attributed sales. Sums to £7,569 organic + £2,197 ad.
      revBreakChart: { max: 3000, yTicks: ['£3k','£2.25k','£1.5k','£0.75k','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'], series: [{ color: '#2C3420', values: [0,0,651,748,0,0,171,627] }, { color: '#a7ab90', values: [0,216,1071,1605,2563,1099,321,694] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] },
      sec: {
        overviewActuals: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£10,409', dCls: 'df', d: 'YTD actuals',    s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$3,096', dCls: 'df', d: 'YTD actuals',    s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '544',    dCls: 'df', d: 'UK 399 · US 145', s: 'Jan–Aug' },
            { bar: '#C8A84B', lbl: 'Units',    val: '617',    dCls: 'df', d: 'UK 456 · US 161', s: 'Jan–Aug' }
          ],
          cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 13, valText: '12.5%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 2,  valText: '2.4%',  color: 'amber' }
          ]
        },
        products: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£10,409', dCls: 'df', d: 'YTD actuals',    s: 'Jan–Aug' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '544',    dCls: 'df', d: 'UK 399 · US 145', s: 'Jan–Aug' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '617',    dCls: 'df', d: 'UK 456 · US 161', s: 'Jan–Aug' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£26.09', dCls: 'df', d: 'YTD avg',        s: 'US $21.35' }
          ],
          table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£10,409', units: '456', orders: '399', cvr: '12.5%', cvrCls: 'bg', aov: '£26.09' },
            { flag: 'us', name: 'Amazon US', revenue: '$3,096', units: '161', orders: '145', cvr: '2.4%',  cvrCls: 'br', aov: '$21.35' }
          ]
        },
        pnl: {
          margin: {
            pct: '17.3%', pctColor: 'amber', note: 'Amazon UK · Jan–Aug 2026',
            rows: [
              { lbl: 'Gross Revenue', val: '£9,765' },
              { lbl: 'Selling Fees',  val: '−£1,682', color: 'red' },
              { lbl: 'Fulfilment',    val: '−£2,157', color: 'red' },
              { lbl: 'Ad Spend',      val: '−£826',   color: 'red' },
              { lbl: 'COGS',          val: '−£3,404', color: 'red' },
              { lbl: 'Net Profit',    val: '£1,693',  color: 'green', strong: true }
            ]
          },
          statement: {
            fixedLabel: 'Amazon UK · Jan–Aug 2026 (all-time)',
            groups: [
              { header: 'Income', rows: [
                { lbl: 'Shipped product sales', amount: '£10,320', pct: '105.7%', unit: '£22.63' },
                { lbl: 'Promotions', amount: '−£272', pct: '−2.8%', unit: '−£0.59' },
                { lbl: 'Refunds', amount: '−£128', pct: '−1.3%', unit: '−£0.28' },
                { lbl: 'Other income', amount: '£201', pct: '2.1%', unit: '£0.44' },
                { lbl: 'Net revenue', amount: '£9,765', pct: '100.0%', unit: '£21.41', total: true }
              ] },
              { header: 'Expenses', rows: [
                { lbl: 'Advertising', amount: '£826', pct: '8.5%', unit: '£1.81' },
                { lbl: 'Selling fees', amount: '£1,682', pct: '17.2%', unit: '£3.69' },
                { lbl: 'Fulfilment and shipping', amount: '£2,157', pct: '22.1%', unit: '£4.73' },
                { lbl: 'Cost of goods', amount: '£3,404', pct: '34.9%', unit: '£7.46' },
                { lbl: 'Total expenses', amount: '£8,073', pct: '82.7%', unit: '£17.70', total: true }
              ] },
              { header: 'Profit', rows: [
                { lbl: 'PROFIT', amount: '£1,693', pct: '17.3%', unit: '£3.71', total: true, profit: true },
                { lbl: 'Profit %', amount: '17.3%', accent: 'green' }
              ] },
              { header: 'Metrics', rows: [
                { lbl: 'Units sold', amount: '456' },
                { lbl: 'Orders', amount: '399' }
              ] }
            ]
          },
          mkt: [
            { name: 'Amazon UK', flag: 'gb', revenue: '£9,765', adspend: '£826', net: '£1,693', netColor: 'green', margin: '17.3%', marginCls: 'ba' },
            { name: 'Amazon US', flag: 'us', revenue: '$2,098', adspend: '$0',   net: '$477',   netColor: 'green', margin: '22.7%', marginCls: 'bg' }
          ]
        },
        advertising: {
          metrics: [
            { lbl: 'Total Spend', val: '£813', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£2,197' },
            { lbl: 'ACOS',        val: '37.0%', color: 'amber' },
            { lbl: 'TACOS',       val: '7.8%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '2.70×', id: 'a-roas' },
            { lbl: 'Avg. CPC',    val: '—' }
          ]
        }
      }
    }
  },

  sections: {
    founder: {

      // ---------- OVERVIEW ----------
      // SOURCES (future live overlays): the context cards below — alert, tasks, stockWarn,
      // milestones — TRACK THE BRAND-ACQUISITION NOTION SHEET (not the Google Sheet). The financial
      // bits (kpis, revChart) come from the Google Sheet via the Apps Script proxy (overlay:'founder',
      // which deep-merges only kpis + revChart, leaving the Notion-sourced cards untouched).
      // Values below are static placeholders — to be updated later; keep the structure + comments.
      overview: {
        alert: 'June revenue revised to £2,500 — 200ml 24-pack OOS on arrival · 750ml 6-pack not live until August.',
        tasks: {
          badge: 'June 2026',
          items: [
            { dot: 'amber', title: 'Apply for Harvaza EORI number', sub: 'GOV.UK · Before 18 Jun shipment' },
            { dot: 'amber', title: "Sign director's loan agreement", sub: 'Before releasing payment to Arjun' },
            { dot: 'amber', title: '750ml 6-pack stock-up via Arjun', sub: 'Sserenee · Target net-30 terms' },
            { dot: 'muted', title: 'Amazon brand registry transfer', sub: 'Listing · Upcoming' }
          ]
        },
        stockWarn: {
          badge: '2 OOS SKUs',
          items: [
            { dot: 'red',   tint: true, title: '200ml 24-pack — OOS · 1–2 weeks', sub: '360 cartons arriving 18 Jun' },
            { dot: 'red',   tint: true, title: '750ml 6-pack — OOS · 2–3 months', sub: 'Stock-up required · Labels on order' },
            { dot: 'amber', tint: true, title: 'Label MOQ cost pending', sub: '£1,000 · 5-week lead time' },
            { dot: 'green', tint: true, title: 'DCTS/REX preference confirmed', sub: '0% duty on India imports · Sep 2025' }
          ]
        },
        milestones: {
          badge: 'On track',
          items: [
            { dot: 'green', title: 'Contract signed · Payment 1 released', sub: 'June 2026' },
            { dot: 'amber', title: '750ml 6-pack live on Amazon', sub: 'August 2026 (target)' },
            { dot: 'amber', title: 'Peak season — Jul / Aug / Sep', sub: '200ml BSR recovery critical window' },
            { dot: 'muted', title: 'Loan clear · Distributions open', sub: 'Est. December 2028' }
          ]
        },
        kpis: [
          { bar: '#2C3420', lbl: 'Total revenue',          val: '£65,300', dCls: 'df', d: '12-month forecast' },
          { bar: '#C8A84B', lbl: 'Gross profit',           val: '£39,514', dCls: 'df', d: 'After COGS + labels' },
          { bar: '#3B6D11', lbl: 'Profit before debt',     val: '£30,855', dCls: 'du', d: 'After all operating costs' },
          { bar: '#A32D2D', lbl: 'Total capital required', val: '£27,676', dCls: 'dd', d: 'Acq. + stock + labels + reorder' }
        ],
        revChart: {
          max: 10000, yTicks: ['£10k', '£7.5k', '£5k', '£2.5k', '£0'],
          xLabels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], xHighlight: '#2C3420',
          series: [
            { values: [2500, 6000, 8500, 7000, 3600, 3600, 3600, 4200, 5300, 7000, 7000, 7000], color: '#2C3420', area: true, main: true },
            { values: [890, 1863, 4703, 3783, 1425, 1675, 1675, 1693, 2629, 3683, 3433, 3183], color: '#C8A84B', dash: true }
          ],
          legend: [{ name: 'Revenue', color: '#2C3420' }, { name: 'Profit before debt', color: '#C8A84B' }]
        },
        loanCard: {
          sub: '£22,500 · 10% p.a. · 30 months',
          big: '£9,000', bigSub: 'Year 1 repayment target',
          fillPct: 40, meta: ['£0', '40% Yr 1', '£22,500']
        },
        waterfall: [
          { lbl: 'Revenue',      pct: 100, val: '£65.3k', color: '#2C3420' },
          { lbl: 'Gross profit', pct: 60,  val: '£39.5k', color: '#C8A84B' },
          { lbl: 'Before debt',  pct: 47,  val: '£30.9k', color: 'green' },
          { lbl: 'Net profit',   pct: 30,  val: '£19.6k', color: 'muted' },
          { lbl: 'Free cash',    pct: 13,  val: '£8.4k',  color: 'muted2' }
        ]
      },

      // ---------- P&L DETAIL ----------
      pnl: {
        kpis: [
          { bar: '#2C3420', lbl: 'Total revenue', val: '£65,300', dCls: 'df', d: 'Jun 26 – May 27' },
          { bar: '#C8A84B', lbl: 'Total COGS',    val: '£25,786', dCls: 'dd', d: 'Inc. £1k label MOQ' },
          { bar: '#3B6D11', lbl: 'Total opex',    val: '£8,659',  dCls: 'df', d: 'Excl. debt service' },
          { bar: '#A32D2D', lbl: 'Debt service',  val: '£11,250', dCls: 'dd', d: 'Repayment + interest' }
        ],
        chart: {
          max: 10000, yTicks: ['£10k', '£7.5k', '£5k', '£2.5k', '£0'],
          xLabels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], xHighlight: '#2C3420',
          series: [
            { values: [2500, 6000, 8500, 7000, 3600, 3600, 3600, 4200, 5300, 7000, 7000, 7000], color: '#2C3420', main: true },
            { values: [1532, 2680, 5270, 4350, 2242, 2242, 2242, 2610, 3296, 4350, 4350, 4350], color: '#C8A84B' },
            { values: [-48, 925, 3765, 2845, 487, 737, 737, 755, 1691, 2745, 2495, 2246], color: '#3B6D11' }
          ],
          legend: [{ name: 'Revenue', color: '#2C3420' }, { name: 'Gross profit', color: '#C8A84B' }, { name: 'Net after debt', color: '#3B6D11' }]
        },
        table: {
          cols: ['Line item', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Total'],
          rows: [
            { section: 'Revenue & COGS' },
            { cells: ['Revenue', '£2,500', '£6,000', '£8,500', '£7,000', '£3,600', '£3,600', '£3,600', '£4,200', '£5,300', '£7,000', '£7,000', '£7,000', '£65,300'] },
            { cls: 'red', cells: ['COGS', '£968', '£2,320', '£3,230', '£2,650', '£1,358', '£1,358', '£1,358', '£1,590', '£2,004', '£2,650', '£2,650', '£2,650', '£24,786'] },
            { cls: 'red', cells: ['Label MOQ', '—', '£1,000', '—', '—', '—', '—', '—', '—', '—', '—', '—', '—', '£1,000'] },
            { total: true, cls: 'green', cells: ['Gross profit', '£1,532', '£2,680', '£5,270', '£4,350', '£2,242', '£2,242', '£2,242', '£2,610', '£3,296', '£4,350', '£4,350', '£4,350', '£39,514'] },
            { section: 'Operating expenses' },
            { cls: 'red', cells: ['Warehouse', '£275', '£200', '£200', '£200', '£200', '£200', '£200', '£200', '£200', '£200', '£200', '£200', '£2,475'] },
            { cls: 'red', cells: ['Customs & imports', '—', '£250', '—', '—', '£250', '—', '—', '£250', '—', '—', '£250', '—', '£1,000'] },
            { cls: 'red', cells: ['Shopify + software', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£720'] },
            { cls: 'red', cells: ['Google + domain', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£40', '£480'] },
            { cls: 'red', cells: ['Amazon general', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£60', '£720'] },
            { cls: 'red', cells: ['Service fees (TDS)', '£190', '£190', '£190', '£190', '£190', '£190', '£190', '£290', '£290', '£290', '£290', '£290', '£2,780'] },
            { cls: 'red', cells: ['Annual business costs', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£17', '£204'] },
            { cls: 'red', cells: ['Accounting fees', '—', '—', '—', '—', '—', '—', '—', '—', '—', '—', '—', '£500', '£500'] },
            { total: true, cls: 'green', cells: ['Profit before debt', '£890', '£1,863', '£4,703', '£3,783', '£1,425', '£1,675', '£1,675', '£1,693', '£2,629', '£3,683', '£3,433', '£3,183', '£30,855'] },
            { section: 'Debt service' },
            { cls: 'red', cells: ['Loan repayment', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£750', '£9,000'] },
            { cls: 'red', cells: ['Loan interest (10%)', '£188', '£188', '£188', '£188', '£188', '£188', '£188', '£188', '£188', '£188', '£188', '£187', '£2,250'] },
            { total: true, cls: 'green', cells: ['Net profit after debt', '−£48', '£925', '£3,765', '£2,845', '£487', '£737', '£737', '£755', '£1,691', '£2,745', '£2,495', '£2,246', '£19,605'] }
          ]
        }
      },

      // ---------- STOCK & COGS ----------
      // Driven LIVE by the Apps Script proxy (founder.stock) from the SKU master sheet — values below
      // are the pre-load fallback. Current Breakdown = Storfil stock; Phase 2 = forecast monthly re-order.
      stock: {
        info: 'Bervera coconut-water SKUs — current Storfil stock plus the Year-1 re-launch forecast. Live from the SKU master sheet.',
        kpis: [
          { bar: '#2C3420', lbl: 'Total COGS (year)',   val: '£25,558', dCls: 'df', d: 'From cost sheet' },
          { bar: '#C8A84B', lbl: 'Cost per 200ml unit', val: '£0.52',   dCls: 'df', d: '£12.50 per 24-pack' },
          { bar: '#1e4fa0', lbl: 'Cost per 750ml unit', val: '£1.10',   dCls: 'df', d: '£6.60 per 6-pack' }
        ],
        phases: [
          {
            title: 'Current Breakdown — Storfil',
            tag: { text: 'Live', cls: 'bg' },
            cols: ['SKU', 'Storfil Stock', 'Pack Size', 'Cost/SKU', 'Total Cost', 'Stock Status'],
            rows: [
              { cells: ['200ml 24-pack', '372', '24', '£12.50', '£4,650', '<span class="badge ba">Arriving Soon</span>'] },
              { cells: ['200ml 6-pack', '0', '6', '£3.20', '—', '<span class="badge ba">Arriving Soon</span>'] },
              { cells: ['750ml 6-pack', '0', '6', '£6.60', '—', '<span class="badge br">Restock</span>'] },
              { total: true, cells: ['Total stock value', '', '', '', '£4,650', ''] }
            ]
          },
          {
            title: 'Phase 2 — Re-launch',
            tag: { text: 'Forecast', cls: 'ba' },
            cols: ['SKU', 'Monthly Average', 'Pack Size', 'Cost/SKU', 'Monthly CF', 'Note'],
            rows: [
              { cells: ['200ml 24-pack', '164', '24', '£12.50', '£2,050', 'Monthly re-order'] },
              { cells: ['200ml 6-pack', '0', '6', '£3.20', '£0', 'Monthly re-order'] },
              { cells: ['750ml 6-pack', '41', '6', '£6.60', '£271', 'Monthly re-order'] },
              { total: true, cells: ['Monthly cashflow', '', '', '', '£2,321', ''] }
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

    // ===== AMAZON ANALYTICS — MerchantSpring pulled 2026-09-05 (Harvaza Distribution UK + US) =====
    // Top-level (period-independent) sections so the Amazon pages render under the founder 'fy'
    // selector. UK = GBP, US = USD (mixed-currency, shown per-market). TODO: replace with a
    // build-harvaza-data.ps1 baker for repeatable refresh.
    // Founder Overview "Amazon actuals" widgets. kpis + cvr are period-aware (sec.overviewActuals on
    // 3m/6m); revTrend + buyBox are top-level (don't vary by period). Default here = Last Month (August).
    overviewActuals: {
      kpis: [
        { bar: '#2C3420', lbl: 'UK Sales', val: '£1,347', dCls: 'du', d: '▲ vs £624 Jul', s: 'Amazon UK' },
        { bar: '#1e4fa0', lbl: 'US Sales', val: '$568', dCls: 'du', d: '▲ vs $551 Jul', s: 'Amazon US' },
        { bar: '#3B6D11', lbl: 'Orders',   val: '68',   dCls: 'df', d: 'UK 38 · US 30', s: 'Aug 2026' },
        { bar: '#C8A84B', lbl: 'Units',    val: '74',   dCls: 'df', d: 'UK 43 · US 31', s: 'Aug 2026' }
      ],
      revTrend: {
        max: 3000, yTicks: ['£3k', '£2.25k', '£1.5k', '£0.75k', '£0'],
        xLabels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], xHighlight: '#2C3420',
        series: [{ values: [2428, 2024, 2911, 836, 624, 1347], color: '#2C3420', area: true, main: true }],
        legend: [{ name: 'Amazon UK revenue (ordered)', color: '#2C3420' }]
      },
      buyBox: [
        { label: 'Amazon UK', flag: 'gb', pct: 98,  valText: '97.9%',  color: 'green' },
        { label: 'Amazon US', flag: 'us', pct: 98, valText: '97.9%', color: 'green' }
      ],
      cvr: [
        { label: 'Amazon UK', flag: 'gb', pct: 9, valText: '9.1%', color: 'green' },
        { label: 'Amazon US', flag: 'us', pct: 4, valText: '4.0%', color: 'amber' }
      ]
    },

    // Default = Last Month (August 2026). 3m/6m override via dateRanges[p].sec.products.
    products: {
      kpis: [
        { bar: '#2C3420', lbl: 'UK Sales', val: '£1,347',   dCls: 'du', d: '▲ vs £624 Jul',  s: 'Aug 2026' },
        { bar: '#3B6D11', lbl: 'Orders',   val: '68',     dCls: 'df', d: 'UK 38 · US 30',  s: 'Aug 2026' },
        { bar: '#1e4fa0', lbl: 'Units',    val: '74',     dCls: 'df', d: 'UK 43 · US 31',  s: 'Aug 2026' },
        { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£35.44', dCls: 'dd', d: '▼ vs £44.56 Jul', s: 'US $18.94' }
      ],
      table: [
        { flag: 'gb', name: 'Amazon UK', revenue: '£1,347', units: '43', orders: '38', cvr: '9.1%', cvrCls: 'bg', aov: '£35.44' },
        { flag: 'us', name: 'Amazon US', revenue: '$568', units: '31', orders: '30', cvr: '4.0%', cvrCls: 'br', aov: '$18.94' }
      ]
    },

    // Current stock snapshot (period-independent) — getSalesByProduct includeNoInventory, both channels.
    // The prior Slate 18oz (US) OOS-risk row has since restocked (30 units, ~225 days cover).
    inventory: {
      kpis: [
        { bar: 'green', lbl: 'In Stock',  val: '6',   dCls: 'du', d: 'ASINs healthy',  s: 'UK + US' },
        { bar: 'amber', lbl: 'Low Stock', val: '0',   dCls: 'du', d: 'None currently', s: '—' },
        { bar: 'red',   lbl: 'OOS',       val: '0',   dCls: 'du', d: 'None currently', s: '—' },
        { bar: 'blue',  lbl: 'OOS %',     val: '0%', dCls: 'du', d: 'UK channel',     s: 'US 0%' }
      ],
      stock: [
        { dot: 'dg', name: 'Bervera 24×200ml — UK (FBM)', note: 'B0CQRHMWFL · FBM · Healthy', units: '209 units', days: '~1461 days' },
        { dot: 'dg', name: 'Bervera 24×200ml — UK (FBA)', note: 'B0CQRHMWFL · FBA · Healthy', units: '41 units',  days: '~31 days' },
        { dot: 'dg', name: 'Hydrte 18oz — Slate (US)',    note: 'B0CHJNPWHV · FBA · Healthy', units: '30 units', days: '~225 days' },
        { dot: 'dg', name: 'Hydrte 11.8oz — Nero (US)',   note: 'B0B1N844DS · FBA · Healthy', units: '33 units', days: '~110 days' },
        { dot: 'dg', name: 'Hydrte 18oz — Nero (US)',     note: 'B0CRKS94F1 · FBA · Healthy', units: '48 units', days: '~180 days' },
        { dot: 'dg', name: 'Hydrte 11.8oz — Champagne (US)', note: 'B0B1N7759K · FBA · Healthy', units: '83 units', days: '~311 days' }
      ],
      restock: []
    },

    // Amazon P&L — accrual basis (getStoreProfitAndLoss, profitabilityView:'accrual'; settled/cash-basis
    // was tried first but the most recent months hadn't finished settling — accrual recognises revenue
    // at order time so July isn't blank). Renders on the 'pnl' page ("Amazon P&L"). UK = £ base; US
    // shown $ in the per-market table. This card's own "Advertising" line is the P&L tool's own figure —
    // a different lens from the Advertising-page spend (dateRanges/sections.advertising, sourced from
    // getAdvertisingByChannels); the two are not meant to reconcile (same convention as ordered vs net
    // P&L revenue elsewhere in this file).
    pnl: {
      // Product portfolio — CARRIED FORWARD from the July 2026 bake (still showing July's per-product
      // profit/margin). getProductProfitAndLoss returned a schema-validation error this run (a "sellerSku"/
      // "totalRevenue" etc. required-field error, not a "no data" case) for both channels, so there is no
      // fresh reconciled per-SKU P&L to bake — left as-is per the "leave a metric out rather than bake an
      // unreconciled number" convention rather than guess at August's split. Re-run once the tool recovers.
      portfolio: {
        total: 5, profitable: 5, breakeven: 0, unprofitable: 0,
        most: [
          { name: 'Bervera 24×200ml (UK, FBM)', profit: '£305', margin: '85%', marginCls: 'bg' },
          { name: 'Hydrte 11.8oz — Nero (US)',   profit: '$58',  margin: '32%', marginCls: 'bg' },
          { name: 'Bervera 24×200ml (UK, FBA)',  profit: '£42',  margin: '32%', marginCls: 'bg' }
        ],
        least: [
          { name: 'Hydrte 18oz — Nero (US)',  profit: '$42', margin: '28%', marginCls: 'ba', color: 'var(--amber)' },
          { name: 'Hydrte 18oz — Slate (US)', profit: '$75', margin: '27%', marginCls: 'ba', color: 'var(--amber)' }
        ]
      },
      margin: {
        pct: '11.5%', pctColor: 'amber', note: 'Amazon UK · August 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£1,322' },
          { lbl: 'Selling Fees',  val: '−£183',  color: 'red' },
          { lbl: 'Fulfilment',    val: '−£219',  color: 'red' },
          { lbl: 'Ad Spend',      val: '−£228', color: 'red' },
          { lbl: 'COGS',          val: '−£538',  color: 'red' },
          { lbl: 'Net Profit',    val: '£152',  color: 'green', strong: true }
        ]
      },
      statement: {
        fixedLabel: 'Amazon UK · August 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£1,389', pct: '105.1%', unit: '£36.56' },
            { lbl: 'Promotions', amount: '−£52', pct: '−3.9%', unit: '−£1.37' },
            { lbl: 'Refunds', amount: '−£69', pct: '−5.2%', unit: '−£1.82' },
            { lbl: 'Other income', amount: '£56', pct: '4.2%', unit: '£1.47' },
            { lbl: 'Net revenue', amount: '£1,322', pct: '100.0%', unit: '£34.79', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£228', pct: '17.3%', unit: '£6.01' },
            { lbl: 'Selling fees', amount: '£183', pct: '13.8%', unit: '£4.80' },
            { lbl: 'Fulfilment and shipping', amount: '£219', pct: '16.6%', unit: '£5.77' },
            { lbl: 'Cost of goods', amount: '£538', pct: '40.7%', unit: '£14.14' },
            { lbl: 'Total expenses', amount: '£1,169', pct: '88.4%', unit: '£30.77', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£152', pct: '11.5%', unit: '£4.01', total: true, profit: true },
            { lbl: 'Profit %', amount: '11.5%', accent: 'amber' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '43' },
            { lbl: 'Orders', amount: '38' }
          ] }
        ]
      },
      mkt: [
        { name: 'Amazon UK', flag: 'gb', revenue: '£1,322', adspend: '£228', net: '£152', netColor: 'green', margin: '11.5%', marginCls: 'ba' },
        { name: 'Amazon US', flag: 'us', revenue: '$378', adspend: '$0',   net: '$86', netColor: 'green', margin: '22.7%', marginCls: 'bg' }
      ]
    },

    // Advertising — UK ads have run continuously since July (were paused May–Jun, active before that
    // Mar–Apr). No campaign-level / CPC breakdown from MerchantSpring (getAdvertisingByChannels and
    // getProductProfitAndLoss both threw schema-validation errors this run; getAdvertisingCampaigns worked
    // but its attributed-sales figures don't reconcile to the account-level daily-sum used elsewhere in
    // this file, so it wasn't used for these headline figures) — figures are the same reconciled
    // daily-interval sums as dateRanges above. KPI row + chart come from dateRanges (above); these cards
    // fill the rest of the page.
    advertising: {
      metrics: [
        { lbl: 'Total Spend', val: '£228', id: 'a-spend' },
        { lbl: 'Ad Sales',    val: '£627' },
        { lbl: 'ACOS',        val: '36.4%', color: 'amber' },
        { lbl: 'TACOS',       val: '17.0%', id: 'a-tacos' },
        { lbl: 'ROAS',        val: '2.75×', id: 'a-roas' },
        { lbl: 'Avg. CPC',    val: '—' }
      ],
      budgets: {
        headers: ['Jun', 'Jul', 'Spend Aug', 'Plan'],
        subLabel: 'Active Aug 2026 · continuing from Jul (paused May–Jun before that)',
        rows: [
          { name: 'Amazon UK', flag: 'gb', cells: ['£0', '£110', '£228', 'TBC'] },
          { name: 'Amazon US', flag: 'us', cells: ['$0', '$0', '$0', 'TBC'] },
          { name: 'Total', total: true, cells: ['£0', '£110', '£228', '—'] }
        ]
      },
      forecast: [
        { month: 'Sep', budget: 'TBC', pct: 3, opacity: 0.5, tacos: '—', tacosColor: 'muted', roas: '—' },
        { month: 'Oct', budget: 'TBC', pct: 3, opacity: 0.4, tacos: '—', tacosColor: 'muted', roas: '—' }
      ],
      campaigns: [
        { name: 'All active campaigns', type: 'Amazon UK · August 2026', spend: '£228', sales: '£627', acos: '36.4%', acosCls: 'ba', roas: '2.75×', cpc: '—', status: 'Active', statusCls: 'bg' }
      ]
    }
  }
};
