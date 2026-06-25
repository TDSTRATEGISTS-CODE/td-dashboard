/* Harvaza Ltd (Bervera) — client data. Loaded as window.DASHBOARD_DATA.
   Static Year-1 forecast (Jun 2026 – May 2027), baked from the founder model. The shell reads
   `sections.founder` to render the four founder pages. Amazon pages show the maintenance stub.
   When live data arrives: UK Amazon actuals (MCP) overlay the monthly P&L + stock; the Google
   Sheet supplies forecast/budgets; Shopify adds a channel section. Keep this shape stable. */
window.DASHBOARD_DATA = {

  // Minimal date-range entry so the shell's switchDateRange paints the topbar + sidebar chips.
  // Founder KPIs are rendered from sections.founder, not from these fields.
  dateRanges: {
    // Actuals lens (default). Ad KPIs reflect the last ACTIVE UK campaign month (Mar–Apr 2026);
    // ads are currently paused (£0 last 30 days). Chip totals (mktRows col 6) carry the founder
    // forecast (overwritten live by the proxy); the ad table uses cols budget/spend/tacos.
    last30: {
      label: 'Last 30 Days', shortLabel: 'Last 30 Days',
      rev: '£67,300', revD: '12-month forecast', revC: 'df', revS: 'Year 1 forecast',
      spend: '£329', spendD: 'Mar–Apr · last active', spendC: 'df', spendS: '£0 last 30 days',
      tacosAd: '11.4%', tacosAdD: 'Mar–Apr', tacosAdC: 'df', tacosAdS: 'ACOS 30.7%',
      roasAd: '3.26×', roasAdD: 'Mar–Apr', roasAdC: 'df', roasAdS: '£1,071 ad sales',
      aov: '£33.64', aovD: 'UK last 30d', aovC: 'df', aovS: '60 orders',
      // [name, flag, budget, spend, vsCls, vsTxt, sales(chip), tacosCls, tacosTxt]
      mktRows: [
        ['UK', 'gb', '£0', '£329', 'br', '▲ no budget', '£67,300', 'ba', '11.4%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '£0',      'bg', '—'],
        ['Total', '', '£0', '£329', 'br', '▲ over', '£67,300', 'ba', '11.4%']
      ],
      adChart: {
        max: 500, yTicks: ['£500', '£375', '£250', '£125', '£0'],
        xLabels: ['Mar–Apr', 'May', 'Jun'], xHighlight: '#2C3420',
        series: [{ values: [329, 0, 0], color: '#2C3420', area: true, main: true }],
        legend: [{ name: 'Ad Spend', color: '#2C3420' }]
      }
    },
    fy: {
      label: 'Jun 2026 – May 2027', shortLabel: 'Year 1',
      rev: '£65,300', revD: '12-month forecast', revC: 'df', revS: 'Year 1 forecast',
      spend: '£329', spendD: 'Mar–Apr · last active', spendC: 'df', spendS: '£0 last 30 days',
      tacosAd: '11.4%', tacosAdD: 'Mar–Apr', tacosAdC: 'df', tacosAdS: 'ACOS 30.7%',
      roasAd: '3.26×', roasAdD: 'Mar–Apr', roasAdC: 'df', roasAdS: '£1,071 ad sales',
      aov: '£33.64', aovD: 'UK last 30d', aovC: 'df', aovS: '60 orders',
      mktRows: [
        ['UK', 'gb', '£0', '£329', 'br', '▲ no budget', '£65,300', 'ba', '11.4%'],
        ['US', 'us', '$0', '$0',   'bg', '—',            '£0',      'bg', '—'],
        ['Total', '', '£0', '£329', 'br', '▲ over', '£65,300', 'ba', '11.4%']
      ],
      adChart: {
        max: 500, yTicks: ['£500', '£375', '£250', '£125', '£0'],
        xLabels: ['Mar–Apr', 'May', 'Jun'], xHighlight: '#2C3420',
        series: [{ values: [329, 0, 0], color: '#2C3420', area: true, main: true }],
        legend: [{ name: 'Ad Spend', color: '#2C3420' }]
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
            { dot: 'amber', title: '750ml 6-pack reorder via Arjun', sub: 'Sserenee · Target net-30 terms' },
            { dot: 'muted', title: 'Amazon brand registry transfer', sub: 'Listing · Upcoming' }
          ]
        },
        stockWarn: {
          badge: '2 OOS SKUs',
          items: [
            { dot: 'red',   tint: true, title: '200ml 24-pack — OOS · 1–2 weeks', sub: '360 cartons arriving 18 Jun' },
            { dot: 'red',   tint: true, title: '750ml 6-pack — OOS · 2–3 months', sub: 'Reorder required · Labels on order' },
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
    products: {
      kpis: [
        { bar: '#2C3420', lbl: 'Top ASIN Rev.', val: '£894',   dCls: 'df', d: 'Bervera 24-pack', s: 'UK · last 30d' },
        { bar: '#3B6D11', lbl: 'Orders',        val: '83',     dCls: 'du', d: 'UK 60 · US 23',   s: 'last 30 days' },
        { bar: '#1e4fa0', lbl: 'Units',         val: '88',     dCls: 'df', d: 'UK 65 · US 23',   s: 'last 30 days' },
        { bar: '#C8A84B', lbl: 'AOV (UK)',      val: '£33.64', dCls: 'dd', d: '▼ vs £37.40',     s: 'US AOV $18.79' }
      ],
      table: [
        { flag: 'gb', name: 'Amazon UK', revenue: '£2,018', units: '65', orders: '60', cvr: '17.9%', cvrCls: 'bg', aov: '£33.64' },
        { flag: 'us', name: 'Amazon US', revenue: '$432',   units: '23', orders: '23', cvr: '2.7%',  cvrCls: 'br', aov: '$18.79' }
      ]
    },

    inventory: {
      kpis: [
        { bar: 'green', lbl: 'In Stock',  val: '2',   dCls: 'du', d: 'ASINs healthy',  s: 'US bottles' },
        { bar: 'amber', lbl: 'Low Stock', val: '2',   dCls: 'df', dColor: 'amber', d: 'Reorder urgent', s: 'UK <3 days cover' },
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
        { level: 'amber', title: 'Bervera 24×200ml — UK', sub: '2 days cover · Order now' }
      ]
    },

    // Amazon settlement P&L (MerchantSpring snapshot, last 30 days). Renders on the 'pnl' page
    // (relabelled "Amazon P&L"). UK = £ base; US shown $ in the per-market table. Ad spend £0.
    pnl: {
      revBreak: [
        { lbl: 'Organic Sales', pct: 100, val: '£2,278', color: '#2C3420' },
        { lbl: 'Ad-Attributed', pct: 0,   val: '£0',     color: 'muted' }
      ],
      margin: {
        pct: '33.0%', pctColor: 'green', note: 'Amazon UK · last 30 days',
        rows: [
          { lbl: 'Gross Revenue', val: '£2,278' },
          { lbl: 'Selling Fees',  val: '−£387', color: 'red' },
          { lbl: 'Fulfilment',    val: '−£401', color: 'red' },
          { lbl: 'COGS',          val: '−£739', color: 'red' },
          { lbl: 'Net Profit',    val: '£752',  color: 'green', strong: true }
        ]
      },
      statement: {
        fixedLabel: 'Amazon UK · Last 30 days',
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£2,359', pct: '103.5%', unit: '£36.29' },
            { lbl: 'Promotions', amount: '−£42', pct: '−1.8%', unit: '−£0.65' },
            { lbl: 'Refunds', amount: '−£34', pct: '−1.5%', unit: '−£0.52' },
            { lbl: 'Other income', amount: '£25', pct: '1.1%', unit: '£0.38' },
            { lbl: 'Net revenue', amount: '£2,278', pct: '100.0%', unit: '£35.05', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£0', pct: '0.0%', unit: '£0.00' },
            { lbl: 'Selling fees', amount: '£387', pct: '17.0%', unit: '£5.95' },
            { lbl: 'Fulfilment and shipping', amount: '£401', pct: '17.6%', unit: '£6.17' },
            { lbl: 'Cost of goods', amount: '£739', pct: '32.4%', unit: '£11.36' },
            { lbl: 'Total expenses', amount: '£1,527', pct: '67.0%', unit: '£23.49', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£752', pct: '33.0%', unit: '£11.56', total: true, profit: true },
            { lbl: 'Profit %', amount: '33.0%', accent: 'green' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Units sold', amount: '65' },
            { lbl: 'Orders', amount: '60' }
          ] }
        ]
      },
      mkt: [
        { name: 'Amazon UK', flag: 'gb', revenue: '£2,278', adspend: '£0', net: '£752', netColor: 'green', margin: '33.0%', marginCls: 'bg' },
        { name: 'Amazon US', flag: 'us', revenue: '$474',   adspend: '$0', net: '$136', netColor: 'green', margin: '28.7%', marginCls: 'bg' }
      ]
    },

    // Advertising — UK ads currently PAUSED (£0 last 30 days). Figures below = last active campaign
    // month (Mar 28–Apr 26). No campaign-level / CPC data from MerchantSpring (endpoint offline).
    // KPI row + chart come from dateRanges (above); these cards fill the rest of the page.
    advertising: {
      metrics: [
        { lbl: 'Total Spend', val: '£329', id: 'a-spend' },
        { lbl: 'Ad Sales',    val: '£1,071' },
        { lbl: 'ACOS',        val: '30.7%', color: 'amber' },
        { lbl: 'TACOS',       val: '11.4%', id: 'a-tacos' },
        { lbl: 'ROAS',        val: '3.26×', id: 'a-roas' },
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
