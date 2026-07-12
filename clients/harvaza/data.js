/* Harvaza Ltd (Bervera) — client data. Loaded as window.DASHBOARD_DATA.
   Static Year-1 forecast (Jun 2026 – May 2027), baked from the founder model. The shell reads
   `sections.founder` to render the four founder pages. Amazon pages show the maintenance stub.
   When live data arrives: UK Amazon actuals (MCP) overlay the monthly P&L + stock; the Google
   Sheet supplies forecast/budgets; Shopify adds a channel section. Keep this shape stable. */
window.DASHBOARD_DATA = {

  // Minimal date-range entry so the shell's switchDateRange paints the topbar + sidebar chips.
  // Founder KPIs are rendered from sections.founder, not from these fields.
  dateRanges: {
    // Amazon ACTUALS lenses (MerchantSpring snapshot to 2026-06-25). Per-period sales/products from
    // getSalesByChannels. Ad figures = last ACTIVE UK campaign (Mar–Apr 2026, now paused); ad/P&L
    // endpoints are 30-day capped so are NOT period-summed here (the baker handles via monthly arrays).
    // Chip totals (mktRows col 6) = per-period ACTUAL sales (UK £, US $). 'all' chip (rev) = UK £ total
    // (US is a separate currency, not summed). Forecast is NOT here — it lives on the P&L Detail page.
    // Per-period sec.products overrides the top-level (May) Products section.
    may: {
      label: 'Last Month · May 2026', shortLabel: 'May 2026',
      rev: '£3,832', revD: '▲ vs £3,238 Apr', revC: 'du', revS: 'Amazon UK actual',
      spend: '£201', spendD: 'May 2026', spendC: 'df', spendS: 'ACOS 32%',
      tacosAd: '5.2%', tacosAdD: 'May', tacosAdC: 'df', tacosAdS: '£201 spend',
      roasAd: '3.09×', roasAdD: 'May', roasAdC: 'df', roasAdS: '£621 ad sales',
      aov: '£36.49', aovD: '▲ vs £30.84 Apr', aovC: 'du', aovS: 'UK · 105 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£201', 'br', '▲ no budget', '£3,832', 'ba', '5.2%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$866',   'bg', '—'],
        ['Total', '', '£0', '£201', 'br', '▲ over', '£3,832', 'ba', '5.2%']
      ],
      adChart: { max: 250, yTicks: ['£250','£188','£125','£63','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun'], xHighlight: '#2C3420', series: [{ values: [0,0,90,132,201,0], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // Revenue Breakdown — stacked monthly bars (Ad sales vs Organic), like the demo. Segments sum to
      // the settlement gross revenue; per-period totals reconcile to the P&L margin card (£1,690 + £205).
      revBreakChart: { max: 4000, yTicks: ['£4k','£3k','£2k','£1k','£0'], xLabels: ['May'], series: [{ color: '#2C3420', values: [205] }, { color: '#a7ab90', values: [1690] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] }
    },
    '3m': {
      label: 'Last 3 Months · Mar–May 2026', shortLabel: 'Mar–May 2026',
      rev: '£9,691', revD: '3-month actuals', revC: 'df', revS: 'Amazon UK actual',
      spend: '£423', spendD: 'Mar–May', spendC: 'df', spendS: 'ACOS 33%',
      tacosAd: '4.4%', tacosAdD: 'Mar–May', tacosAdC: 'df', tacosAdS: '£423 spend',
      roasAd: '3.07×', roasAdD: 'Mar–May', roasAdC: 'df', roasAdS: '£1,298 ad sales',
      aov: '£31.36', aovD: '3-month avg', aovC: 'df', aovS: 'UK · 309 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£423', 'br', '▲ no budget', '£9,691', 'ba', '4.4%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$1,543', 'bg', '—'],
        ['Total', '', '£0', '£423', 'br', '▲ over', '£9,691', 'ba', '4.4%']
      ],
      adChart: { max: 250, yTicks: ['£250','£188','£125','£63','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun'], xHighlight: '#2C3420', series: [{ values: [0,0,90,132,201,0], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // Mar–May: Ad sales split by campaign month (Mar/Apr/May), Organic = gross − ad. Sums to £4,623 organic + £1,298 ad.
      revBreakChart: { max: 4000, yTicks: ['£4k','£3k','£2k','£1k','£0'], xLabels: ['Mar','Apr','May'], series: [{ color: '#2C3420', values: [443,650,205] }, { color: '#a7ab90', values: [488,1999,2136] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] },
      sec: {
        overviewActuals: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£9,691', dCls: 'df', d: '3-month actuals', s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$1,543', dCls: 'df', d: '3-month actuals', s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '377',    dCls: 'df', d: 'UK 309 · US 68',  s: 'Mar–May' },
            { bar: '#C8A84B', lbl: 'Units',    val: '418',    dCls: 'df', d: 'UK 339 · US 79',  s: 'Mar–May' }
          ],
          cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 15, valText: '14.5%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 4,  valText: '1.9%',  color: 'amber' }
          ]
        },
        products: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£9,691', dCls: 'df', d: '3-month actuals', s: 'Mar–May' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '377',    dCls: 'df', d: 'UK 309 · US 68',  s: 'Mar–May' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '418',    dCls: 'df', d: 'UK 339 · US 79',  s: 'Mar–May' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£31.36', dCls: 'df', d: '3-month avg',     s: 'US $22.69' }
          ],
          table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£9,691', units: '339', orders: '309', cvr: '14.5%', cvrCls: 'bg', aov: '£31.36' },
            { flag: 'us', name: 'Amazon US', revenue: '$1,543', units: '79',  orders: '68',  cvr: '1.9%',  cvrCls: 'br', aov: '$22.69' }
          ]
        },
        pnl: {
          margin: {
            pct: '17.2%', pctColor: 'amber', note: 'Amazon UK · Mar–May 2026',
            rows: [
              { lbl: 'Gross Revenue', val: '£5,921' },
              { lbl: 'Selling Fees',  val: '−£1,051', color: 'red' },
              { lbl: 'Fulfilment',    val: '−£1,250', color: 'red' },
              { lbl: 'Ad Spend',      val: '−£423',   color: 'red' },
              { lbl: 'COGS',          val: '−£2,177', color: 'red' },
              { lbl: 'Net Profit',    val: '£1,020',  color: 'green', strong: true }
            ]
          },
          statement: {
            fixedLabel: 'Amazon UK · Mar–May 2026',
            groups: [
              { header: 'Income', rows: [
                { lbl: 'Shipped product sales', amount: '£6,378', pct: '107.7%', unit: '£18.81' },
                { lbl: 'Promotions', amount: '−£189', pct: '−3.2%', unit: '−£0.56' },
                { lbl: 'Refunds', amount: '−£25', pct: '−0.4%', unit: '−£0.07' },
                { lbl: 'Other income', amount: '£118', pct: '2.0%', unit: '£0.35' },
                { lbl: 'Net revenue', amount: '£5,921', pct: '100.0%', unit: '£17.47', total: true }
              ] },
              { header: 'Expenses', rows: [
                { lbl: 'Advertising', amount: '£423', pct: '7.1%', unit: '£1.25' },
                { lbl: 'Selling fees', amount: '£1,051', pct: '17.8%', unit: '£3.10' },
                { lbl: 'Fulfilment and shipping', amount: '£1,250', pct: '21.1%', unit: '£3.69' },
                { lbl: 'Cost of goods', amount: '£2,177', pct: '36.8%', unit: '£6.42' },
                { lbl: 'Total expenses', amount: '£4,901', pct: '82.8%', unit: '£14.46', total: true }
              ] },
              { header: 'Profit', rows: [
                { lbl: 'PROFIT', amount: '£1,020', pct: '17.2%', unit: '£3.01', total: true, profit: true },
                { lbl: 'Profit %', amount: '17.2%', accent: 'green' }
              ] },
              { header: 'Metrics', rows: [
                { lbl: 'Units sold', amount: '339' },
                { lbl: 'Orders', amount: '309' }
              ] }
            ]
          },
          mkt: [
            { name: 'Amazon UK', flag: 'gb', revenue: '£5,921', adspend: '£423', net: '£1,020', netColor: 'green', margin: '17.2%', marginCls: 'ba' },
            { name: 'Amazon US', flag: 'us', revenue: '$1,164', adspend: '$0',   net: '$193',   netColor: 'green', margin: '16.6%', marginCls: 'ba' }
          ]
        },
        advertising: {
          metrics: [
            { lbl: 'Total Spend', val: '£423', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£1,298' },
            { lbl: 'ACOS',        val: '32.6%', color: 'amber' },
            { lbl: 'TACOS',       val: '4.4%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '3.07×', id: 'a-roas' },
            { lbl: 'Avg. CPC',    val: '—' }
          ]
        }
      }
    },
    '6m': {
      label: 'Year to Date · Jan–Jun 2026', shortLabel: 'Jan–Jun 2026',
      rev: '£11,107', revD: 'YTD actuals', revC: 'df', revS: 'Amazon UK actual',
      spend: '£423', spendD: 'Jan–Jun', spendC: 'df', spendS: 'ACOS 33%',
      tacosAd: '3.8%', tacosAdD: 'Jan–Jun', tacosAdC: 'df', tacosAdS: '£423 spend',
      roasAd: '3.07×', roasAdD: 'Jan–Jun', roasAdC: 'df', roasAdS: '£1,298 ad sales',
      aov: '£31.03', aovD: 'YTD avg', aovC: 'df', aovS: 'UK · 358 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£423', 'br', '▲ no budget', '£11,107', 'ba', '3.8%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$1,894', 'bg', '—'],
        ['Total', '', '£0', '£423', 'br', '▲ over', '£11,107', 'ba', '3.8%']
      ],
      adChart: { max: 250, yTicks: ['£250','£188','£125','£63','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun'], xHighlight: '#2C3420', series: [{ values: [0,0,90,132,201,0], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // Jan–Jun: Ad sales only in the campaign months (Mar–May); Organic tracks monthly UK revenue. Sums to £6,539 organic + £1,298 ad.
      revBreakChart: { max: 4000, yTicks: ['£4k','£3k','£2k','£1k','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun'], series: [{ color: '#2C3420', values: [0,0,443,650,205,0] }, { color: '#a7ab90', values: [0,169,632,2409,2499,830] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] },
      sec: {
        overviewActuals: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£11,107', dCls: 'df', d: 'YTD actuals',    s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$1,894',  dCls: 'df', d: 'YTD actuals',    s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '445',     dCls: 'df', d: 'UK 358 · US 87', s: 'Jan–Jun' },
            { bar: '#C8A84B', lbl: 'Units',    val: '493',     dCls: 'df', d: 'UK 395 · US 98', s: 'Jan–Jun' }
          ],
          cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 14, valText: '13.5%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 4,  valText: '2.0%',  color: 'amber' }
          ]
        },
        products: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£11,107', dCls: 'df', d: 'YTD actuals',    s: 'Jan–Jun' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '445',     dCls: 'df', d: 'UK 358 · US 87', s: 'Jan–Jun' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '493',     dCls: 'df', d: 'UK 395 · US 98', s: 'Jan–Jun' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£31.03',  dCls: 'df', d: 'YTD avg',        s: 'US $21.77' }
          ],
          table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£11,107', units: '395', orders: '358', cvr: '13.5%', cvrCls: 'bg', aov: '£31.03' },
            { flag: 'us', name: 'Amazon US', revenue: '$1,894',  units: '98',  orders: '87',  cvr: '2.0%',  cvrCls: 'br', aov: '$21.77' }
          ]
        },
        pnl: {
          margin: {
            pct: '20.4%', pctColor: 'green', note: 'Amazon UK · Jan–Jun 2026',
            rows: [
              { lbl: 'Gross Revenue', val: '£7,837' },
              { lbl: 'Selling Fees',  val: '−£1,380', color: 'red' },
              { lbl: 'Fulfilment',    val: '−£1,654', color: 'red' },
              { lbl: 'Ad Spend',      val: '−£423',   color: 'red' },
              { lbl: 'COGS',          val: '−£2,784', color: 'red' },
              { lbl: 'Net Profit',    val: '£1,596',  color: 'green', strong: true }
            ]
          },
          statement: {
            fixedLabel: 'Amazon UK · Jan–Jun 2026 (all-time)',
            groups: [
              { header: 'Income', rows: [
                { lbl: 'Shipped product sales', amount: '£8,344', pct: '106.5%', unit: '£21.12' },
                { lbl: 'Promotions', amount: '−£228', pct: '−2.9%', unit: '−£0.58' },
                { lbl: 'Refunds', amount: '−£59', pct: '−0.8%', unit: '−£0.15' },
                { lbl: 'Other income', amount: '£142', pct: '1.8%', unit: '£0.36' },
                { lbl: 'Net revenue', amount: '£7,837', pct: '100.0%', unit: '£19.84', total: true }
              ] },
              { header: 'Expenses', rows: [
                { lbl: 'Advertising', amount: '£423', pct: '5.4%', unit: '£1.07' },
                { lbl: 'Selling fees', amount: '£1,380', pct: '17.6%', unit: '£3.49' },
                { lbl: 'Fulfilment and shipping', amount: '£1,654', pct: '21.1%', unit: '£4.19' },
                { lbl: 'Cost of goods', amount: '£2,784', pct: '35.5%', unit: '£7.05' },
                { lbl: 'Total expenses', amount: '£6,242', pct: '79.6%', unit: '£15.80', total: true }
              ] },
              { header: 'Profit', rows: [
                { lbl: 'PROFIT', amount: '£1,596', pct: '20.4%', unit: '£4.04', total: true, profit: true },
                { lbl: 'Profit %', amount: '20.4%', accent: 'green' }
              ] },
              { header: 'Metrics', rows: [
                { lbl: 'Units sold', amount: '395' },
                { lbl: 'Orders', amount: '358' }
              ] }
            ]
          },
          mkt: [
            { name: 'Amazon UK', flag: 'gb', revenue: '£7,837', adspend: '£423', net: '£1,596', netColor: 'green', margin: '20.4%', marginCls: 'bg' },
            { name: 'Amazon US', flag: 'us', revenue: '$1,531', adspend: '$0',   net: '$266',   netColor: 'green', margin: '17.4%', marginCls: 'ba' }
          ]
        },
        advertising: {
          metrics: [
            { lbl: 'Total Spend', val: '£423', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£1,298' },
            { lbl: 'ACOS',        val: '32.6%', color: 'amber' },
            { lbl: 'TACOS',       val: '3.8%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '3.07×', id: 'a-roas' },
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

    // ===== AMAZON ANALYTICS — MerchantSpring snapshot (Harvaza Distribution UK + US) =====
    // Top-level (period-independent) sections so the Amazon pages render under the founder 'fy'
    // selector. Snapshot window: last 30 days to 2026-06-25. UK = GBP, US = USD (mixed-currency,
    // shown per-market). TODO: replace with a build-harvaza-data.ps1 baker for repeatable refresh.
    // Founder Overview "Amazon actuals" widgets. kpis + cvr are period-aware (sec.overviewActuals on
    // 3m/6m); revTrend + buyBox are top-level (don't vary by period). Default here = Last Month (May).
    overviewActuals: {
      kpis: [
        { bar: '#2C3420', lbl: 'UK Sales', val: '£3,832', dCls: 'du', d: '▲ vs £3,238 Apr', s: 'Amazon UK' },
        { bar: '#1e4fa0', lbl: 'US Sales', val: '$866',   dCls: 'du', d: '▲ vs $539 Apr',   s: 'Amazon US' },
        { bar: '#3B6D11', lbl: 'Orders',   val: '140',    dCls: 'du', d: 'UK 105 · US 35',   s: 'May 2026' },
        { bar: '#C8A84B', lbl: 'Units',    val: '158',    dCls: 'df', d: 'UK 114 · US 44',   s: 'May 2026' }
      ],
      revTrend: {
        max: 5000, yTicks: ['£5k', '£3.75k', '£2.5k', '£1.25k', '£0'],
        xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], xHighlight: '#2C3420',
        series: [{ values: [0, 240, 1524, 4335, 3832, 1176], color: '#2C3420', area: true, main: true }],
        legend: [{ name: 'Amazon UK revenue (ordered)', color: '#2C3420' }]
      },
      buyBox: [
        { label: 'Amazon UK', flag: 'gb', pct: 99,  valText: '99%',  color: 'green' },
        { label: 'Amazon US', flag: 'us', pct: 100, valText: '100%', color: 'green' }
      ],
      cvr: [
        { label: 'Amazon UK', flag: 'gb', pct: 20, valText: '19.5%', color: 'green' },
        { label: 'Amazon US', flag: 'us', pct: 6,  valText: '3.1%',  color: 'amber' }
      ]
    },

    // Default = Last Month (May 2026). 3m/6m override via dateRanges[p].sec.products.
    products: {
      kpis: [
        { bar: '#2C3420', lbl: 'UK Sales', val: '£3,832', dCls: 'du', d: '▲ vs £3,238 Apr', s: 'May 2026' },
        { bar: '#3B6D11', lbl: 'Orders',   val: '140',    dCls: 'du', d: 'UK 105 · US 35',  s: 'May 2026' },
        { bar: '#1e4fa0', lbl: 'Units',    val: '158',    dCls: 'df', d: 'UK 114 · US 44',  s: 'May 2026' },
        { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£36.49', dCls: 'du', d: '▲ vs £30.84 Apr', s: 'US $24.74' }
      ],
      table: [
        { flag: 'gb', name: 'Amazon UK', revenue: '£3,832', units: '114', orders: '105', cvr: '19.5%', cvrCls: 'bg', aov: '£36.49' },
        { flag: 'us', name: 'Amazon US', revenue: '$866',   units: '44',  orders: '35',  cvr: '3.1%',  cvrCls: 'br', aov: '$24.74' }
      ]
    },

    inventory: {
      kpis: [
        { bar: 'green', lbl: 'In Stock',  val: '2',   dCls: 'du', d: 'ASINs healthy',  s: 'US bottles' },
        { bar: 'amber', lbl: 'Low Stock', val: '2',   dCls: 'df', dColor: 'amber', d: 'Stock-up urgent', s: 'UK <3 days cover' },
        { bar: 'red',   lbl: 'OOS',       val: '0',   dCls: 'du', d: 'None currently', s: '—' },
        { bar: 'blue',  lbl: 'OOS %',     val: '33%', dCls: 'dd', d: 'UK channel',     s: 'US 25%' }
      ],
      stock: [
        { dot: 'da', name: 'Bervera 24×200ml — UK',  note: 'B0CQRHMWFL · FBA · Low',      units: '2 units',  unitsColor: 'amber', days: '~2 days' },
        { dot: 'dr', name: 'Bervera 6×200ml — UK',   note: 'B0D29PL6NJ · FBA · Critical', units: '1 unit',   unitsColor: 'red',   days: '<1 day', daysColor: 'red' },
        { dot: 'dg', name: 'Hydrte Nero Black — US', note: 'B0B1N844DS · FBA · Healthy',  units: '53 units', days: '~145 days' },
        { dot: 'dg', name: 'Hydrte Slate Grey — US', note: 'B0CHJNPWHV · FBA · Healthy',  units: '15 units', days: '~75 days' }
      ],
      restock: [
        { level: 'red',   title: 'Bervera 6×200ml — UK',  sub: '<1 day cover · Immediate restock' },
        { level: 'amber', title: 'Bervera 24×200ml — UK', sub: '2 days cover · Stock-up now' }
      ]
    },

    // Amazon settlement P&L (MerchantSpring snapshot, last 30 days). Renders on the 'pnl' page
    // (relabelled "Amazon P&L"). UK = £ base; US shown $ in the per-market table. Ad spend £0.
    pnl: {
      // Product portfolio — REAL per-product P&L from MerchantSpring (May 2026, UK + US channels).
      // Ranked by margin % (currency-neutral); profit shown in native currency (UK £, US $). All 5
      // active SKUs were profitable in May. Refresh via MS getProductProfitAndLoss for both channels.
      portfolio: {
        total: 5, profitable: 5, breakeven: 0, unprofitable: 0,
        most: [
          { name: 'Hydrte 18oz — Nero (US)',   profit: '$131', margin: '28%', marginCls: 'bg' },
          { name: 'Bervera 6×200ml (UK)',      profit: '£174', margin: '27%', marginCls: 'bg' },
          { name: 'Hydrte 18oz — Slate (US)',  profit: '$39',  margin: '26%', marginCls: 'bg' }
        ],
        least: [
          { name: 'Hydrte 11.8oz — Nero (US)', profit: '$75',  margin: '25%', marginCls: 'ba', color: 'var(--amber)' },
          { name: 'Bervera 24×200ml (UK)',     profit: '£326', margin: '20%', marginCls: 'ba', color: 'var(--amber)' }
        ]
      },
      margin: {
        pct: '13.4%', pctColor: 'amber', note: 'Amazon UK · May 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£1,895' },
          { lbl: 'Selling Fees',  val: '−£330', color: 'red' },
          { lbl: 'Fulfilment',    val: '−£341', color: 'red' },
          { lbl: 'Ad Spend',      val: '−£201', color: 'red' },
          { lbl: 'COGS',          val: '−£768', color: 'red' },
          { lbl: 'Net Profit',    val: '£255',  color: 'green', strong: true }
        ]
      },
      statement: {
        fixedLabel: 'Amazon UK · May 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£2,285', pct: '120.6%', unit: '£20.04' },
            { lbl: 'Promotions', amount: '−£87', pct: '−4.6%', unit: '−£0.76' },
            { lbl: 'Other income', amount: '£35', pct: '1.8%', unit: '£0.31' },
            { lbl: 'Net revenue', amount: '£1,895', pct: '100.0%', unit: '£16.62', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£201', pct: '10.6%', unit: '£1.76' },
            { lbl: 'Selling fees', amount: '£330', pct: '17.4%', unit: '£2.90' },
            { lbl: 'Fulfilment and shipping', amount: '£341', pct: '18.0%', unit: '£2.99' },
            { lbl: 'Cost of goods', amount: '£768', pct: '40.5%', unit: '£6.74' },
            { lbl: 'Total expenses', amount: '£1,640', pct: '86.6%', unit: '£14.39', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£255', pct: '13.4%', unit: '£2.24', total: true, profit: true },
            { lbl: 'Profit %', amount: '13.4%', accent: 'green' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '114' },
            { lbl: 'Orders', amount: '105' }
          ] }
        ]
      },
      mkt: [
        { name: 'Amazon UK', flag: 'gb', revenue: '£1,895', adspend: '£201', net: '£255', netColor: 'green', margin: '13.4%', marginCls: 'ba' },
        { name: 'Amazon US', flag: 'us', revenue: '$758',   adspend: '$0',   net: '$214', netColor: 'green', margin: '28.2%', marginCls: 'bg' }
      ]
    },

    // Advertising — UK ads currently PAUSED (£0 last 30 days). Figures below = last active campaign
    // month (Mar 28–Apr 26). No campaign-level / CPC data from MerchantSpring (endpoint offline).
    // KPI row + chart come from dateRanges (above); these cards fill the rest of the page.
    advertising: {
      metrics: [
        { lbl: 'Total Spend', val: '£201', id: 'a-spend' },
        { lbl: 'Ad Sales',    val: '£621' },
        { lbl: 'ACOS',        val: '32.4%', color: 'amber' },
        { lbl: 'TACOS',       val: '5.2%', id: 'a-tacos' },
        { lbl: 'ROAS',        val: '3.09×', id: 'a-roas' },
        { lbl: 'Avg. CPC',    val: '—' }
      ],
      budgets: {
        headers: ['Spend Mar–Apr', 'May', 'Jun', 'Plan'],
        subLabel: 'Last active Mar–Apr 2026 · ads paused',
        rows: [
          { name: 'Amazon UK', flag: 'gb', cells: ['£329', '£0', '£0', 'TBC'] },
          { name: 'Amazon US', flag: 'us', cells: ['$0', '$0', '$0', 'TBC'] },
          { name: 'Total', total: true, cells: ['£329', '£0', '£0', '—'] }
        ]
      },
      forecast: [
        { month: 'Jun', budget: '£0 · paused', pct: 3, opacity: 0.5, tacos: '—', tacosColor: 'muted', roas: '—' },
        { month: 'Jul', budget: 'TBC',         pct: 3, opacity: 0.4, tacos: '—', tacosColor: 'muted', roas: '—' }
      ],
      campaigns: [
        { name: 'No active campaigns', type: 'Ads paused · last active Mar–Apr 2026', spend: '£0', sales: '£0', acos: '—', acosCls: 'bb', roas: '—', cpc: '—', status: 'Paused', statusCls: 'ba' }
      ]
    }
  }
};
