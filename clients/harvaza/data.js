/* Harvaza Ltd (Bervera) — client data. Loaded as window.DASHBOARD_DATA.
   Static Year-1 forecast (Jun 2026 – May 2027), baked from the founder model. The shell reads
   `sections.founder` to render the four founder pages. Amazon pages show the maintenance stub.
   When live data arrives: UK Amazon actuals (MCP) overlay the monthly P&L + stock; the Google
   Sheet supplies forecast/budgets; Shopify adds a channel section. Keep this shape stable. */
window.DASHBOARD_DATA = {

  // Minimal date-range entry so the shell's switchDateRange paints the topbar + sidebar chips.
  // Founder KPIs are rendered from sections.founder, not from these fields.
  dateRanges: {
    // Amazon ACTUALS lenses (MerchantSpring pulled 2026-08-18). Sales/units/AOV are per-month native-
    // currency sums (getSalesByPeriod, single-month calls — the multi-month 'M'-interval variant mislabels
    // buckets and is not used). Ad spend/sales/ACOS/TACOS/ROAS are from getAdvertisingByChannels (the
    // Ads-page lens) — NOT the same figure as the P&L card's own "Advertising" line (getStoreProfitAndLoss,
    // accrual view — a different, cash/earn-basis lens; the two are intentionally not reconciled, per the
    // AMACX/Harvaza convention that ordered vs net P&L revenue are separate valid views). Chip totals
    // (mktRows col 6) = per-period ACTUAL sales (UK £, US $). 'all' chip (rev) = UK £ total (US is a
        // separate currency, not summed). Forecast is NOT here — it lives on the P&L Detail page.
    // Per-period sec.products overrides the top-level (last-month) Products section.
    may: {
      label: 'Last Month · July 2026', shortLabel: 'July 2026',
      rev: '£624', revD: '▼ vs £836 Jun', revC: 'dd', revS: 'Amazon UK actual',
      spend: '£110', spendD: 'July 2026', spendC: 'df', spendS: 'ACOS 64%',
      tacosAd: '17.6%', tacosAdD: 'July', tacosAdC: 'df', tacosAdS: '£110 spend',
      roasAd: '1.56×', roasAdD: 'July', roasAdC: 'df', roasAdS: '£171 ad sales',
      aov: '£44.56', aovD: '▲ vs £26.11 Jun', aovC: 'du', aovS: 'UK · 14 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£110', 'br', '▲ no budget', '£624', 'ba', '17.6%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$551', 'bg', '—'],
        ['Total', '', '£0', '£110', 'br', '▲ over', '£624', 'ba', '17.6%']
      ],
      adChart: { max: 300, yTicks: ['£300','£225','£150','£75','£0'], xLabels: ['Feb','Mar','Apr','May','Jun','Jul'], xHighlight: '#2C3420', series: [{ values: [0,207,281,0,0,110], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // Revenue Breakdown — stacked monthly bars (Ad sales vs Organic). Segments sum to the P&L
      // (accrual) gross revenue; Σad reconciles to the Advertising-page ad sales figure.
      revBreakChart: { max: 600, yTicks: ['£600','£450','£300','£150','£0'], xLabels: ['Jul'], series: [{ color: '#2C3420', values: [171] }, { color: '#a7ab90', values: [321] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] }
    },
    '3m': {
      label: 'Last 3 Months · May–Jul 2026', shortLabel: 'May–Jul 2026',
      rev: '£4,370', revD: '3-month actuals', revC: 'df', revS: 'Amazon UK actual',
      spend: '£110', spendD: 'May–Jul', spendC: 'df', spendS: 'ACOS 64%',
      tacosAd: '2.5%', tacosAdD: 'May–Jul', tacosAdC: 'df', tacosAdS: '£110 spend',
      roasAd: '1.56×', roasAdD: 'May–Jul', roasAdC: 'df', roasAdS: '£171 ad sales',
      aov: '£28.75', aovD: '3-month avg', aovC: 'df', aovS: 'UK · 152 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£110', 'br', '▲ no budget', '£4,370', 'ba', '2.5%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$1,851', 'bg', '—'],
        ['Total', '', '£0', '£110', 'br', '▲ over', '£4,370', 'ba', '2.5%']
      ],
      adChart: { max: 300, yTicks: ['£300','£225','£150','£75','£0'], xLabels: ['Feb','Mar','Apr','May','Jun','Jul'], xHighlight: '#2C3420', series: [{ values: [0,207,281,0,0,110], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // May–Jun: no ads. Jul: ad sales £171, organic £321. Sums to £4,341 organic + £171 ad.
      revBreakChart: { max: 3000, yTicks: ['£3k','£2.25k','£1.5k','£0.75k','£0'], xLabels: ['May','Jun','Jul'], series: [{ color: '#2C3420', values: [0,0,171] }, { color: '#a7ab90', values: [2904,1116,321] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] },
      sec: {
        overviewActuals: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£4,370', dCls: 'df', d: '3-month actuals', s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$1,851', dCls: 'df', d: '3-month actuals', s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '230',    dCls: 'df', d: 'UK 152 · US 78',  s: 'May–Jul' },
            { bar: '#C8A84B', lbl: 'Units',    val: '263',    dCls: 'df', d: 'UK 168 · US 95',  s: 'May–Jul' }
          ],
          cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 16, valText: '15.8%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 3,  valText: '3.1%',  color: 'amber' }
          ]
        },
        products: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£4,370', dCls: 'df', d: '3-month actuals', s: 'May–Jul' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '230',    dCls: 'df', d: 'UK 152 · US 78',  s: 'May–Jul' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '263',    dCls: 'df', d: 'UK 168 · US 95',  s: 'May–Jul' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£28.75', dCls: 'df', d: '3-month avg',     s: 'US $23.73' }
          ],
          table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£4,370', units: '168', orders: '152', cvr: '15.8%', cvrCls: 'bg', aov: '£28.75' },
            { flag: 'us', name: 'Amazon US', revenue: '$1,851', units: '95',  orders: '78',  cvr: '3.1%',  cvrCls: 'br', aov: '$23.73' }
          ]
        },
        pnl: {
          margin: {
            pct: '28.6%', pctColor: 'green', note: 'Amazon UK · May–Jul 2026',
            rows: [
              { lbl: 'Gross Revenue', val: '£4,186' },
              { lbl: 'Selling Fees',  val: '−£745',   color: 'red' },
              { lbl: 'Fulfilment',    val: '−£777',   color: 'red' },
              { lbl: 'Ad Spend',      val: '−£116',   color: 'red' },
              { lbl: 'COGS',          val: '−£1,351', color: 'red' },
              { lbl: 'Net Profit',    val: '£1,196',  color: 'green', strong: true }
            ]
          },
          statement: {
            fixedLabel: 'Amazon UK · May–Jul 2026',
            groups: [
              { header: 'Income', rows: [
                { lbl: 'Shipped product sales', amount: '£4,512', pct: '107.8%', unit: '£26.86' },
                { lbl: 'Promotions', amount: '−£99', pct: '−2.4%', unit: '−£0.59' },
                { lbl: 'Other income', amount: '£51', pct: '1.2%', unit: '£0.30' },
                { lbl: 'Net revenue', amount: '£4,186', pct: '100.0%', unit: '£24.92', total: true }
              ] },
              { header: 'Expenses', rows: [
                { lbl: 'Advertising', amount: '£116', pct: '2.8%', unit: '£0.69' },
                { lbl: 'Selling fees', amount: '£745', pct: '17.8%', unit: '£4.44' },
                { lbl: 'Fulfilment and shipping', amount: '£777', pct: '18.6%', unit: '£4.63' },
                { lbl: 'Cost of goods', amount: '£1,351', pct: '32.3%', unit: '£8.04' },
                { lbl: 'Total expenses', amount: '£2,990', pct: '71.4%', unit: '£17.80', total: true }
              ] },
              { header: 'Profit', rows: [
                { lbl: 'PROFIT', amount: '£1,196', pct: '28.6%', unit: '£7.12', total: true, profit: true },
                { lbl: 'Profit %', amount: '28.6%', accent: 'green' }
              ] },
              { header: 'Metrics', rows: [
                { lbl: 'Units sold', amount: '168' },
                { lbl: 'Orders', amount: '152' }
              ] }
            ]
          },
          mkt: [
            { name: 'Amazon UK', flag: 'gb', revenue: '£4,186', adspend: '£116', net: '£1,196', netColor: 'green', margin: '28.6%', marginCls: 'bg' },
            { name: 'Amazon US', flag: 'us', revenue: '$1,693', adspend: '$0',   net: '$587',   netColor: 'green', margin: '34.7%', marginCls: 'bg' }
          ]
        },
        advertising: {
          metrics: [
            { lbl: 'Total Spend', val: '£110', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£171' },
            { lbl: 'ACOS',        val: '64.1%', color: 'amber' },
            { lbl: 'TACOS',       val: '2.5%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '1.56×', id: 'a-roas' },
            { lbl: 'Avg. CPC',    val: '—' }
          ]
        }
      }
    },
    '6m': {
      label: 'Year to Date · Jan–Jul 2026', shortLabel: 'Jan–Jul 2026',
      rev: '£9,062', revD: 'YTD actuals', revC: 'df', revS: 'Amazon UK actual',
      spend: '£597', spendD: 'Jan–Jul', spendC: 'df', spendS: 'ACOS 37%',
      tacosAd: '6.6%', tacosAdD: 'Jan–Jul', tacosAdC: 'df', tacosAdS: '£597 spend',
      roasAd: '2.67×', roasAdD: 'Jan–Jul', roasAdC: 'df', roasAdS: '£1,596 ad sales',
      aov: '£24.36', aovD: 'YTD avg', aovC: 'df', aovS: 'UK · 372 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£597', 'br', '▲ no budget', '£9,062', 'ba', '6.6%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '$2,528', 'bg', '—'],
        ['Total', '', '£0', '£597', 'br', '▲ over', '£9,062', 'ba', '6.6%']
      ],
      adChart: { max: 300, yTicks: ['£300','£225','£150','£75','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'], xHighlight: '#2C3420', series: [{ values: [0,0,207,281,0,0,110], color: '#2C3420', area: true, main: true }], legend: [{ name: 'Ad Spend', color: '#2C3420' }] },
      // Jan–Jul: ad sales only in the active campaign months (Mar/Apr/Jul); organic tracks monthly UK
      // gross revenue net of ad-attributed sales. Sums to £7,335 organic + £1,596 ad.
      revBreakChart: { max: 3000, yTicks: ['£3k','£2.25k','£1.5k','£0.75k','£0'], xLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'], series: [{ color: '#2C3420', values: [0,0,638,787,0,0,171] }, { color: '#a7ab90', values: [0,216,1104,1674,2904,1116,321] }], legend: [{ name: 'Ad sales', color: '#2C3420' }, { name: 'Organic', color: '#a7ab90' }] },
      sec: {
        overviewActuals: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£9,062', dCls: 'df', d: 'YTD actuals',    s: 'Amazon UK' },
            { bar: '#1e4fa0', lbl: 'US Sales', val: '$2,528', dCls: 'df', d: 'YTD actuals',    s: 'Amazon US' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '483',    dCls: 'df', d: 'UK 372 · US 111', s: 'Jan–Jul' },
            { bar: '#C8A84B', lbl: 'Units',    val: '543',    dCls: 'df', d: 'UK 413 · US 130', s: 'Jan–Jul' }
          ],
          cvr: [
            { label: 'Amazon UK', flag: 'gb', pct: 13, valText: '13.1%', color: 'green' },
            { label: 'Amazon US', flag: 'us', pct: 2,  valText: '2.2%',  color: 'amber' }
          ]
        },
        products: {
          kpis: [
            { bar: '#2C3420', lbl: 'UK Sales', val: '£9,062', dCls: 'df', d: 'YTD actuals',    s: 'Jan–Jul' },
            { bar: '#3B6D11', lbl: 'Orders',   val: '483',    dCls: 'df', d: 'UK 372 · US 111', s: 'Jan–Jul' },
            { bar: '#1e4fa0', lbl: 'Units',    val: '543',    dCls: 'df', d: 'UK 413 · US 130', s: 'Jan–Jul' },
            { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£24.36', dCls: 'df', d: 'YTD avg',        s: 'US $22.77' }
          ],
          table: [
            { flag: 'gb', name: 'Amazon UK', revenue: '£9,062', units: '413', orders: '372', cvr: '13.1%', cvrCls: 'bg', aov: '£24.36' },
            { flag: 'us', name: 'Amazon US', revenue: '$2,528', units: '130', orders: '111', cvr: '2.2%',  cvrCls: 'br', aov: '$22.77' }
          ]
        },
        pnl: {
          margin: {
            pct: '18.5%', pctColor: 'amber', note: 'Amazon UK · Jan–Jul 2026',
            rows: [
              { lbl: 'Gross Revenue', val: '£8,488' },
              { lbl: 'Selling Fees',  val: '−£1,506', color: 'red' },
              { lbl: 'Fulfilment',    val: '−£1,938', color: 'red' },
              { lbl: 'Ad Spend',      val: '−£604',   color: 'red' },
              { lbl: 'COGS',          val: '−£2,867', color: 'red' },
              { lbl: 'Net Profit',    val: '£1,572',  color: 'green', strong: true }
            ]
          },
          statement: {
            fixedLabel: 'Amazon UK · Jan–Jul 2026 (all-time)',
            groups: [
              { header: 'Income', rows: [
                { lbl: 'Shipped product sales', amount: '£8,930', pct: '105.2%', unit: '£21.62' },
                { lbl: 'Promotions', amount: '−£221', pct: '−2.6%', unit: '−£0.54' },
                { lbl: 'Refunds', amount: '−£13', pct: '−0.2%', unit: '−£0.03' },
                { lbl: 'Other income', amount: '£145', pct: '1.7%', unit: '£0.35' },
                { lbl: 'Net revenue', amount: '£8,488', pct: '100.0%', unit: '£20.55', total: true }
              ] },
              { header: 'Expenses', rows: [
                { lbl: 'Advertising', amount: '£604', pct: '7.1%', unit: '£1.46' },
                { lbl: 'Selling fees', amount: '£1,506', pct: '17.7%', unit: '£3.65' },
                { lbl: 'Fulfilment and shipping', amount: '£1,938', pct: '22.8%', unit: '£4.69' },
                { lbl: 'Cost of goods', amount: '£2,867', pct: '33.8%', unit: '£6.94' },
                { lbl: 'Total expenses', amount: '£6,916', pct: '81.5%', unit: '£16.75', total: true }
              ] },
              { header: 'Profit', rows: [
                { lbl: 'PROFIT', amount: '£1,572', pct: '18.5%', unit: '£3.81', total: true, profit: true },
                { lbl: 'Profit %', amount: '18.5%', accent: 'green' }
              ] },
              { header: 'Metrics', rows: [
                { lbl: 'Units sold', amount: '413' },
                { lbl: 'Orders', amount: '372' }
              ] }
            ]
          },
          mkt: [
            { name: 'Amazon UK', flag: 'gb', revenue: '£8,488', adspend: '£604', net: '£1,572', netColor: 'green', margin: '18.5%', marginCls: 'ba' },
            { name: 'Amazon US', flag: 'us', revenue: '$1,833', adspend: '$0',   net: '$476',   netColor: 'green', margin: '26.0%', marginCls: 'bg' }
          ]
        },
        advertising: {
          metrics: [
            { lbl: 'Total Spend', val: '£597', id: 'a-spend' },
            { lbl: 'Ad Sales',    val: '£1,596' },
            { lbl: 'ACOS',        val: '37.4%', color: 'amber' },
            { lbl: 'TACOS',       val: '6.6%', id: 'a-tacos' },
            { lbl: 'ROAS',        val: '2.67×', id: 'a-roas' },
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

    // ===== AMAZON ANALYTICS — MerchantSpring pulled 2026-08-18 (Harvaza Distribution UK + US) =====
    // Top-level (period-independent) sections so the Amazon pages render under the founder 'fy'
    // selector. UK = GBP, US = USD (mixed-currency, shown per-market). TODO: replace with a
    // build-harvaza-data.ps1 baker for repeatable refresh.
    // Founder Overview "Amazon actuals" widgets. kpis + cvr are period-aware (sec.overviewActuals on
    // 3m/6m); revTrend + buyBox are top-level (don't vary by period). Default here = Last Month (July).
    overviewActuals: {
      kpis: [
        { bar: '#2C3420', lbl: 'UK Sales', val: '£624', dCls: 'dd', d: '▼ vs £836 Jun', s: 'Amazon UK' },
        { bar: '#1e4fa0', lbl: 'US Sales', val: '$551', dCls: 'du', d: '▲ vs $434 Jun', s: 'Amazon US' },
        { bar: '#3B6D11', lbl: 'Orders',   val: '35',   dCls: 'df', d: 'UK 14 · US 21', s: 'Jul 2026' },
        { bar: '#C8A84B', lbl: 'Units',    val: '46',   dCls: 'df', d: 'UK 18 · US 28', s: 'Jul 2026' }
      ],
      revTrend: {
        max: 3000, yTicks: ['£3k', '£2.25k', '£1.5k', '£0.75k', '£0'],
        xLabels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], xHighlight: '#2C3420',
        series: [{ values: [240, 1992, 2460, 2911, 836, 624], color: '#2C3420', area: true, main: true }],
        legend: [{ name: 'Amazon UK revenue (ordered)', color: '#2C3420' }]
      },
      buyBox: [
        { label: 'Amazon UK', flag: 'gb', pct: 50,  valText: '50%',  color: 'amber' },
        { label: 'Amazon US', flag: 'us', pct: 100, valText: '100%', color: 'green' }
      ],
      cvr: [
        { label: 'Amazon UK', flag: 'gb', pct: 8, valText: '8.0%', color: 'green' },
        { label: 'Amazon US', flag: 'us', pct: 3, valText: '3.2%', color: 'amber' }
      ]
    },

    // Default = Last Month (July 2026). 3m/6m override via dateRanges[p].sec.products.
    products: {
      kpis: [
        { bar: '#2C3420', lbl: 'UK Sales', val: '£624',   dCls: 'dd', d: '▼ vs £836 Jun',  s: 'Jul 2026' },
        { bar: '#3B6D11', lbl: 'Orders',   val: '35',     dCls: 'df', d: 'UK 14 · US 21',  s: 'Jul 2026' },
        { bar: '#1e4fa0', lbl: 'Units',    val: '46',     dCls: 'df', d: 'UK 18 · US 28',  s: 'Jul 2026' },
        { bar: '#C8A84B', lbl: 'AOV (UK)', val: '£44.56', dCls: 'du', d: '▲ vs £26.11 Jun', s: 'US $26.22' }
      ],
      table: [
        { flag: 'gb', name: 'Amazon UK', revenue: '£624', units: '18', orders: '14', cvr: '8.0%', cvrCls: 'bg', aov: '£44.56' },
        { flag: 'us', name: 'Amazon US', revenue: '$551', units: '28', orders: '21', cvr: '3.2%', cvrCls: 'br', aov: '$26.22' }
      ]
    },

    // Current stock snapshot (period-independent) — getSalesByProduct includeNoInventory, both channels.
    inventory: {
      kpis: [
        { bar: 'green', lbl: 'In Stock',  val: '5',   dCls: 'du', d: 'ASINs healthy',  s: 'UK + US' },
        { bar: 'amber', lbl: 'Low Stock', val: '1',   dCls: 'df', dColor: 'amber', d: 'Stock-up urgent', s: 'US <4 days cover' },
        { bar: 'red',   lbl: 'OOS',       val: '0',   dCls: 'du', d: 'None currently', s: '—' },
        { bar: 'blue',  lbl: 'OOS %',     val: '40%', dCls: 'dd', d: 'UK channel',     s: 'US 25%' }
      ],
      stock: [
        { dot: 'dg', name: 'Bervera 24×200ml — UK (FBM)', note: 'B0CQRHMWFL · FBM · Healthy', units: '235 units', days: '~783 days' },
        { dot: 'dg', name: 'Bervera 24×200ml — UK (FBA)', note: 'B0CQRHMWFL · FBA · Healthy', units: '67 units',  days: '~69 days' },
        { dot: 'dr', name: 'Hydrte 18oz — Slate (US)',    note: 'B0CHJNPWHV · FBA · Critical', units: '1 unit',   unitsColor: 'red', days: '~4 days', daysColor: 'red' },
        { dot: 'dg', name: 'Hydrte 11.8oz — Nero (US)',   note: 'B0B1N844DS · FBA · Healthy', units: '41 units', days: '~205 days' },
        { dot: 'dg', name: 'Hydrte 18oz — Nero (US)',     note: 'B0CRKS94F1 · FBA · Healthy', units: '52 units', days: '~260 days' },
        { dot: 'dg', name: 'Hydrte 11.8oz — Champagne (US)', note: 'B0B1N7759K · FBA · Healthy · no sales this period', units: '90 units', days: '~450 days' }
      ],
      restock: [
        { level: 'red', title: 'Hydrte 18oz — Slate (US)', sub: '~4 days cover · Immediate restock' }
      ]
    },

    // Amazon P&L — accrual basis (getStoreProfitAndLoss, profitabilityView:'accrual'; settled/cash-basis
    // was tried first but the most recent months hadn't finished settling — accrual recognises revenue
    // at order time so July isn't blank). Renders on the 'pnl' page ("Amazon P&L"). UK = £ base; US
    // shown $ in the per-market table. This card's own "Advertising" line is the P&L tool's own figure —
    // a different lens from the Advertising-page spend (dateRanges/sections.advertising, sourced from
    // getAdvertisingByChannels); the two are not meant to reconcile (same convention as ordered vs net
    // P&L revenue elsewhere in this file).
    pnl: {
      // Product portfolio — REAL per-product P&L from MerchantSpring (July 2026, accrual, UK + US
      // channels). Ranked by margin % (currency-neutral); profit shown in native currency (UK £, US $).
      // All 5 active SKUs were profitable in July. Refresh via MS getProductProfitAndLoss for both channels.
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
        pct: '34.8%', pctColor: 'green', note: 'Amazon UK · July 2026',
        rows: [
          { lbl: 'Gross Revenue', val: '£492' },
          { lbl: 'Selling Fees',  val: '−£76',  color: 'red' },
          { lbl: 'Fulfilment',    val: '−£79',  color: 'red' },
          { lbl: 'Ad Spend',      val: '−£116', color: 'red' },
          { lbl: 'COGS',          val: '−£50',  color: 'red' },
          { lbl: 'Net Profit',    val: '£171',  color: 'green', strong: true }
        ]
      },
      statement: {
        fixedLabel: 'Amazon UK · July 2026',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£492', pct: '100.0%', unit: '£27.33' },
            { lbl: 'Promotions', amount: '−£0.25', pct: '−0.1%', unit: '−£0.01' },
            { lbl: 'Other income', amount: '£0.25', pct: '0.1%', unit: '£0.01' },
            { lbl: 'Net revenue', amount: '£492', pct: '100.0%', unit: '£27.33', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£116', pct: '23.7%', unit: '£6.47' },
            { lbl: 'Selling fees', amount: '£76', pct: '15.4%', unit: '£4.21' },
            { lbl: 'Fulfilment and shipping', amount: '£79', pct: '16.0%', unit: '£4.38' },
            { lbl: 'Cost of goods', amount: '£50', pct: '10.2%', unit: '£2.78' },
            { lbl: 'Total expenses', amount: '£321', pct: '65.3%', unit: '£17.83', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£171', pct: '34.8%', unit: '£9.50', total: true, profit: true },
            { lbl: 'Profit %', amount: '34.8%', accent: 'green' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '18' },
            { lbl: 'Orders', amount: '14' }
          ] }
        ]
      },
      mkt: [
        { name: 'Amazon UK', flag: 'gb', revenue: '£492', adspend: '£116', net: '£171', netColor: 'green', margin: '34.8%', marginCls: 'bg' },
        { name: 'Amazon US', flag: 'us', revenue: '$497', adspend: '$0',   net: '$148', netColor: 'green', margin: '29.7%', marginCls: 'bg' }
      ]
    },

    // Advertising — UK ads resumed in July after being paused May–Jun (were also active Mar–Apr).
    // No campaign-level / CPC breakdown from MerchantSpring (endpoint offline) — figures are account-
    // level (getAdvertisingByChannels). KPI row + chart come from dateRanges (above); these cards fill
    // the rest of the page.
    advertising: {
      metrics: [
        { lbl: 'Total Spend', val: '£110', id: 'a-spend' },
        { lbl: 'Ad Sales',    val: '£171' },
        { lbl: 'ACOS',        val: '64.1%', color: 'amber' },
        { lbl: 'TACOS',       val: '17.6%', id: 'a-tacos' },
        { lbl: 'ROAS',        val: '1.56×', id: 'a-roas' },
        { lbl: 'Avg. CPC',    val: '—' }
      ],
      budgets: {
        headers: ['May', 'Jun', 'Spend Jul', 'Plan'],
        subLabel: 'Active Jul 2026 · paused May–Jun, active again after a Mar–Apr run',
        rows: [
          { name: 'Amazon UK', flag: 'gb', cells: ['£0', '£0', '£110', 'TBC'] },
          { name: 'Amazon US', flag: 'us', cells: ['$0', '$0', '$0', 'TBC'] },
          { name: 'Total', total: true, cells: ['£0', '£0', '£110', '—'] }
        ]
      },
      forecast: [
        { month: 'Aug', budget: 'TBC', pct: 3, opacity: 0.5, tacos: '—', tacosColor: 'muted', roas: '—' },
        { month: 'Sep', budget: 'TBC', pct: 3, opacity: 0.4, tacos: '—', tacosColor: 'muted', roas: '—' }
      ],
      campaigns: [
        { name: 'All active campaigns', type: 'Amazon UK · July 2026', spend: '£110', sales: '£171', acos: '64.1%', acosCls: 'ba', roas: '1.56×', cpc: '—', status: 'Active', statusCls: 'bg' }
      ]
    }
  }
};
