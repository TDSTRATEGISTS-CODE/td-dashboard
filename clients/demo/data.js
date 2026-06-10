/* Demo Brand UK — client data. Loaded as window.DASHBOARD_DATA.
   Static, self-contained GBP demo figures. UK only; "markets" are sales channels
   (Amazon UK / eBay UK / D2C). Numbers are illustrative and internally reconcile. */
window.DASHBOARD_DATA = {
  dateRanges:{
  may: {
    label: 'May 2026', shortLabel: 'May 2026',
    rev: '£29,400', revD: '▲ 18.1% MoM', revC: 'du', revS: 'vs £24,900 Apr',
    adSales: '£11,600', adSalesD: '▲ 16.0% MoM', adSalesC: 'du', adSalesS: '39.5% of revenue',
    tacos: '20.4%', tacosD: '▼ 0.5pp vs Apr', tacosC: 'du', tacosS: 'Target: hold <22%',
    roas: '4.90×', roasD: '▲ 0.1 vs Apr', roasC: 'du', roasS: '717 orders · AOV £41',
    spend: '£6,000', spendD: '▲ 15.4% MoM', spendC: 'du', spendS: 'vs £5,200 Apr',
    tacosAd: '20.4%', tacosAdD: '▼ 0.5pp vs Apr', tacosAdC: 'du', tacosAdS: 'Target <22%',
    roasAd: '4.90×', roasAdD: '▲ 0.1 vs Apr', roasAdC: 'du', roasAdS: '£29,400 revenue',
    aov: '£41', aovD: '▲ £1 MoM', aovC: 'du', aovS: '717 orders May',
    mktRows: [
      ['Amazon UK','gb','£3,800','£3,680','bg','▼ £120 under','£18,400','ba','20.0%'],
      ['eBay UK','gb','£800','£760','bg','▼ £40 under','£4,200','bg','18.1%'],
      ['D2C','gb','£1,800','£1,560','bg','▼ £240 under','£6,800','ba','22.9%'],
      ['Total UK',null,'£6,400','£6,000','bg','94% utilised','£29,400','ba','20.4%'],
    ],
  },
  '3m': {
    label: 'Mar–May 2026', shortLabel: 'Mar–May 2026',
    rev: '£76,600', revD: '3-month actuals', revC: 'du', revS: 'Mar £22,300 · Apr £24,900 · May £29,400',
    adSales: '£30,200', adSalesD: '3-month total', adSalesC: 'df', adSalesS: '39.4% of revenue',
    tacos: '20.6%', tacosD: '3-month blended', tacosC: 'df', tacosS: 'Mar 20.6% · Apr 20.9% · May 20.4%',
    roas: '4.85×', roasD: '3-month avg', roasC: 'df', roasS: '1,824 orders · AOV £42',
    spend: '£15,800', spendD: '3-month total', spendC: 'df', spendS: 'Mar £4,600 · Apr £5,200 · May £6,000',
    tacosAd: '20.6%', tacosAdD: '3-month blended', tacosAdC: 'df', tacosAdS: 'Stable vs target',
    roasAd: '4.85×', roasAdD: '3-month avg', roasAdC: 'df', roasAdS: '£76,600 revenue',
    aov: '£42', aovD: '3-month avg', aovC: 'df', aovS: '1,824 orders total',
    mktRows: [
      ['Amazon UK','gb','£10,200','£9,900','bg','▼ £300 under','£48,300','ba','20.5%'],
      ['eBay UK','gb','£2,200','£2,100','bg','▼ £100 under','£10,700','bg','19.6%'],
      ['D2C','gb','£4,100','£3,800','bg','▼ £300 under','£17,600','ba','21.6%'],
      ['Total UK',null,'£16,500','£15,800','bg','96% utilised','£76,600','ba','20.6%'],
    ],
  },
  '6m': {
    label: 'Jan–May 2026 (YTD)', shortLabel: 'Jan–May 2026',
    rev: '£117,900', revD: '5-month actuals', revC: 'du', revS: 'Jan £19,800 → May £29,400',
    adSales: '£46,400', adSalesD: '5-month total', adSalesC: 'df', adSalesS: '39.4% of revenue',
    tacos: '20.6%', tacosD: '5-month blended', tacosC: 'df', tacosS: 'Consistent ~20.6% YTD',
    roas: '4.85×', roasD: '5-month avg', roasC: 'df', roasS: '2,807 orders · AOV £42',
    spend: '£24,300', spendD: '5-month total', spendC: 'df', spendS: 'Budget £25,500 total',
    tacosAd: '20.6%', tacosAdD: '5-month blended', tacosAdC: 'df', tacosAdS: 'On target',
    roasAd: '4.85×', roasAdD: '5-month avg', roasAdC: 'df', roasAdS: '£117,900 revenue',
    aov: '£42', aovD: '5-month avg', aovC: 'df', aovS: '2,807 orders total',
    mktRows: [
      ['Amazon UK','gb','£15,800','£15,300','bg','▼ £500 under','£74,300','ba','20.6%'],
      ['eBay UK','gb','£3,400','£3,250','bg','▼ £150 under','£16,500','bg','19.7%'],
      ['D2C','gb','£6,300','£5,750','bg','▼ £550 under','£27,100','ba','21.2%'],
      ['Total UK',null,'£25,500','£24,300','bg','95% utilised','£117,900','ba','20.6%'],
    ],
  },
  '2025': {
    label: 'Full Year 2025', shortLabel: '2025',
    rev: '£198,000', revD: 'Full year actuals', revC: 'du', revS: 'Jan–Dec 2025 confirmed',
    adSales: '£78,000', adSalesD: 'Full year', adSalesC: 'df', adSalesS: '39.4% of revenue',
    tacos: '21.0%', tacosD: 'FY2025 blended', tacosC: 'df', tacosS: 'Peak Nov 24.8% · Low Feb 17.9%',
    roas: '4.77×', roasD: 'FY2025 avg', roasC: 'df', roasS: '4,605 orders · AOV £43',
    spend: '£41,500', spendD: 'Full year actuals', spendC: 'df', spendS: 'Budget £43,400',
    tacosAd: '21.0%', tacosAdD: 'FY2025 blended', tacosAdC: 'df', tacosAdS: 'Peak Nov 24.8%',
    roasAd: '4.77×', roasAdD: 'FY2025 avg', roasAdC: 'df', roasAdS: '£198,000 revenue',
    aov: '£43', aovD: 'FY2025 avg', aovC: 'df', aovS: '4,605 orders FY2025',
    mktRows: [
      ['Amazon UK','gb','£27,000','£26,100','bg','▼ £900 under','£124,700','ba','20.9%'],
      ['eBay UK','gb','£5,900','£5,600','bg','▼ £300 under','£27,700','ba','20.2%'],
      ['D2C','gb','£10,500','£9,800','bg','▼ £700 under','£45,600','ba','21.5%'],
      ['Total UK',null,'£43,400','£41,500','bg','96% utilised','£198,000','ba','21.0%'],
    ],
  },
  '12m': {
    label: '2025 + 2026 YTD', shortLabel: '2025–2026 YTD',
    rev: '£315,900', revD: 'Actuals only', revC: 'du', revS: '2025: £198,000 · 2026 YTD: £117,900',
    adSales: '£124,400', adSalesD: 'Combined total', adSalesC: 'df', adSalesS: '39.4% of revenue',
    tacos: '20.8%', tacosD: 'Blended actuals', tacosC: 'df', tacosS: '2025 peak: Nov 24.8%',
    roas: '4.80×', roasD: 'Blended avg', roasC: 'du', roasS: '7,433 orders · AOV £42.50',
    spend: '£65,800', spendD: 'Combined total', spendC: 'df', spendS: '2025: £41,500 · 2026: £24,300',
    tacosAd: '20.8%', tacosAdD: 'Blended', tacosAdC: 'df', tacosAdS: '2025 peak: Nov 24.8%',
    roasAd: '4.80×', roasAdD: 'Blended avg', roasAdC: 'du', roasAdS: '£315,900 revenue',
    aov: '£42.50', aovD: 'Blended avg', aovC: 'df', aovS: '7,433 orders combined',
    mktRows: [
      ['Amazon UK','gb','£43,000','£41,400','bg','Combined','£199,000','ba','20.8%'],
      ['eBay UK','gb','£9,300','£8,850','bg','Combined','£44,200','ba','20.0%'],
      ['D2C','gb','£16,800','£15,550','bg','Combined','£72,700','ba','21.4%'],
      ['Total UK',null,'£69,100','£65,800','bg','95% utilised','£315,900','ba','20.8%'],
    ],
  },
},

  // ---- Phase 2: deep-page content (rendered once at boot; May 2026 snapshot) ----
  sections: {
    overview: {
      tasksSpec: {
        badge: 'June 2026',
        items: [
          { text: 'Scale Amazon UK Sponsored Brands', sub: 'Advertising · In Progress' },
          { text: 'D2C Shopify Store Refresh', sub: 'Web · Upcoming' },
          { text: 'eBay UK Listing Optimisation', sub: 'Listings · Upcoming' },
          { text: 'Q3 Range Expansion — 4 SKUs', sub: 'Catalogue · Upcoming', active: false },
          { text: 'Black Friday Prep — Amazon UK', sub: 'Planning · Upcoming', active: false }
        ]
      },
      flagsSpec: {
        badge: '3 active',
        items: [
          { level: 'red',   title: 'Isotonic Mix 1kg — OOS Amazon UK', sub: 'B0CXUK004 · Listing suppressed' },
          { level: 'amber', title: 'TACOS Above Target — D2C', sub: '22.9% blended · Target <22% · Review bid strategy' },
          { level: 'amber', title: 'eBay Dispatch Window', sub: '1.2d promised vs 0.8d actual · Tighten SLA' },
          { level: 'muted', title: 'Recovery Range — D2C Launch Pending', sub: 'Awaiting product photography' }
        ]
      },
      revChart: {
        max: 32000,
        yTicks: ['£32k', '£24k', '£16k', '£8k', '£0'],
        xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        xHighlight: '#1f2a44',
        series: [
          { color: '#1f2a44', values: [19800, 21500, 22300, 24900, 29400], main: true, area: true },
          { color: '#38bdf8', values: [22000, 23000, 24000, 26000, 28000], dash: true },
          { color: '#94a3b8', values: [4100, 4400, 4600, 5200, 6000], dash: true }
        ],
        legend: [
          { name: 'Revenue Actual', color: '#1f2a44' },
          { name: 'Revenue Target', color: '#38bdf8' },
          { name: 'Ad Spend', color: '#94a3b8' }
        ]
      },
      buyBox: [
        { label: 'Sport Hydration Mix', pct: 98, color: 'green' },
        { label: 'Energy Gel 25pk', pct: 96, color: 'green' },
        { label: 'Recovery Powder', pct: 95, color: 'green' },
        { label: 'Isotonic Mix 1kg', pct: 91, color: 'amber' }
      ],
      cvr: { val: '11.2%', note: '▲ 0.6pp vs Apr · 41,800 sessions', sub: 'All UK — May' },
      earlyLaunch: null   // UK-only: no early-launch market → section hidden
    },

    pnl: {
      summary: [
        { val: '£29,400',  lbl: 'Gross Revenue', color: 'brand' },
        { val: '£19,220*', lbl: 'Total Costs',   color: 'red' },
        { val: '£10,180*', lbl: 'Net Profit',    color: 'green' }
      ],
      revBreak: [
        { lbl: 'Organic Sales', pct: 61, val: '£17,800', color: '#1f2a44' },
        { lbl: 'Ad-Attributed', pct: 39, val: '£11,600', color: '#94a3b8' }
      ],
      margin: {
        pct: '34.6%*', pctColor: 'green', note: '*Estimated · COGS from cost sheet',
        rows: [
          { lbl: 'Gross Revenue',    val: '£29,400' },
          { lbl: 'Marketplace Fees', val: '−£3,808*', color: 'red' },
          { lbl: 'Ad Spend',         val: '−£6,000',  color: 'red' },
          { lbl: 'COGS (est.)',      val: '−£9,408*', color: 'red' },
          { lbl: 'Net Profit',       val: '£10,184*', color: 'green', strong: true }
        ]
      },
      costs: [
        { lbl: 'COGS (est.)',   pct: 100, val: '£9,408*', color: '#1f2a44' },
        { lbl: 'Marketplace Fee', pct: 40, val: '£3,808*', color: '#1f2a44' },
        { lbl: 'Ad Spend',      pct: 64,  val: '£6,000',  color: '#2563eb' }
      ],
      mkt: [
        { name: 'Amazon UK', flag: 'gb', revenue: '£18,400', adspend: '£3,680', net: '£6,072*', netColor: 'green', margin: '33.0%*', marginCls: 'bg' },
        { name: 'eBay UK',   flag: 'gb', revenue: '£4,200',  adspend: '£760',   net: '£1,592*', netColor: 'green', margin: '37.9%*', marginCls: 'bg' },
        { name: 'D2C',       flag: 'gb', revenue: '£6,800',  adspend: '£1,560', net: '£2,520*', netColor: 'green', margin: '37.1%*', marginCls: 'bg' }
      ]
    },

    advertising: {
      adChart: {
        max: 32000,
        yTicks: ['£32k', '£24k', '£16k', '£8k', '£0'],
        xLabels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
        xHighlight: '#1f2a44',
        series: [
          { color: '#15803d', values: [23000, 19800, 21500, 22300, 24900, 29400], main: true, area: true },
          { color: '#1f2a44', values: [4000, 4100, 4400, 4600, 5200, 6000], dash: true }
        ],
        legend: [
          { name: 'Revenue', color: '#15803d' },
          { name: 'Ad Spend', color: '#1f2a44' }
        ]
      },
      metrics: [
        { lbl: 'Total Spend',    val: '£6,000', id: 'a-spend' },
        { lbl: 'Monthly Budget', val: '£6,400', color: 'brand' },
        { lbl: 'Utilisation',    val: '94%',    color: 'green' },
        { lbl: 'TACOS',          val: '20.4%',  color: 'amber', id: 'a-tacos' },
        { lbl: 'ROAS',           val: '4.90×',  id: 'a-roas' },
        { lbl: 'Avg. CPC',       val: '£0.34' }
      ],
      budgets: {
        rows: [
          { name: 'Amazon UK', flag: 'gb', cells: ['£3,800', '£4,000', '£4,300', '£4,800'] },
          { name: 'eBay UK',   flag: 'gb', cells: ['£800', '£850', '£900', '£1,000'] },
          { name: 'D2C',       flag: 'gb', cells: ['£1,800', '£1,900', '£2,000', '£2,200'] },
          { name: 'Total UK',  total: true, cells: ['£6,400', '£6,750', '£7,200', '£8,000'] }
        ]
      },
      forecast: [
        { month: 'Jun', budget: '£6,750', pct: 80, opacity: 0.7, tacos: '20%', tacosColor: 'green', roas: '4.95×' },
        { month: 'Jul', budget: '£7,200', pct: 86, opacity: 0.7, tacos: '21%', tacosColor: 'amber', roas: '4.80×' },
        { month: 'Aug', budget: '£8,000', pct: 95, opacity: 0.7, tacos: '20%', tacosColor: 'green', roas: '5.00×', peak: true },
        { month: 'Sep', budget: '£6,900', pct: 82, opacity: 0.6, tacos: '19%', tacosColor: 'green', roas: '5.20×' },
        { month: 'Oct', budget: '£6,200', pct: 74, opacity: 0.5, tacos: '19%', tacosColor: 'green', roas: '5.25×' }
      ],
      campaigns: [
        { name: 'SP — Sport Hydration UK', type: 'Sponsored Products', spend: '£2.10k', sales: '£11.4k', acos: '18.4%', acosCls: 'bg', roas: '5.4×', cpc: '£0.31', status: 'Active', statusCls: 'bg' },
        { name: 'SP — Energy Gel UK',      type: 'Sponsored Products', spend: '£1.18k', sales: '£6.1k',  acos: '19.3%', acosCls: 'bg', roas: '5.2×', cpc: '£0.34', status: 'Active', statusCls: 'bg' },
        { name: 'SB — Demo Brand UK',      type: 'Sponsored Brands',   spend: '£0.74k', sales: '£3.6k',  acos: '20.6%', acosCls: 'ba', roas: '4.9×', cpc: '£0.45', status: 'Active', statusCls: 'bg' },
        { name: 'SP — Recovery Range UK',  type: 'Sponsored Products', spend: '£0.86k', sales: '£4.1k',  acos: '21.0%', acosCls: 'ba', roas: '4.8×', cpc: '£0.33', status: 'Active', statusCls: 'bg' },
        { name: 'SD — Display Retargeting',type: 'Sponsored Display',  spend: '£0.52k', sales: '£2.2k',  acos: '23.6%', acosCls: 'ba', roas: '4.2×', cpc: '£0.40', status: 'Review', statusCls: 'ba' }
      ]
    },

    inventory: {
      kpis: [
        { bar: 'green', lbl: 'In Stock',      val: '22',   dCls: 'du', d: 'ASINs healthy',      s: 'Across all channels' },
        { bar: 'amber', lbl: 'Low Stock',     val: '3',    dCls: 'df', dColor: 'amber', d: 'Reorder advised', s: '<14 days cover' },
        { bar: 'red',   lbl: 'OOS',           val: '1',    dCls: 'dd', d: 'Listing suppressed', s: 'Amazon UK — Isotonic' },
        { bar: 'blue',  lbl: 'Late Dispatch', val: '0.6%', dCls: 'du', d: '▼ 0.2pp MoM',        s: 'Target <4%' }
      ],
      stock: [
        { dot: 'dg', name: 'Sport Hydration Mix — Amazon UK', note: 'B0CXUK001 · Healthy', units: '980 units', days: '~32 days' },
        { dot: 'dg', name: 'Energy Gel 25pk — Amazon UK',     note: 'B0CXUK002 · Healthy', units: '740 units', days: '~30 days' },
        { dot: 'dg', name: 'Recovery Powder — D2C',           note: 'SKU-RP-01 · Healthy', units: '410 units', days: '~26 days' },
        { dot: 'dg', name: 'Hydration Tabs 40s — eBay UK',    note: 'B0CXUK003 · Healthy', units: '360 units', days: '~24 days' },
        { dot: 'da', name: 'Isotonic Mix 1kg — Amazon UK',    note: 'B0CXUK004 · Low — reorder', units: '150 units', unitsColor: 'amber', days: '~11 days' },
        { dot: 'da', name: 'Energy Gel — eBay UK',            note: 'B0CXUK005 · Low', units: '88 units', unitsColor: 'amber', days: '~9 days' },
        { dot: 'da', name: 'Sport Hydration — D2C',           note: 'SKU-SH-02 · Low', units: '120 units', unitsColor: 'amber', days: '~12 days' },
        { dot: 'dr', name: 'Isotonic Mix 1kg — Amazon UK',    note: 'B0CXUK004 · OOS · suppressed', units: '0 units', unitsColor: 'red', days: 'OOS', daysColor: 'red' }
      ],
      dispatch: {
        bars: [
          { label: 'Amazon UK', pct: 12, valText: '0.5%', color: 'green' },
          { label: 'eBay UK',   pct: 20, valText: '0.8%', color: 'green' },
          { label: 'D2C',       pct: 10, valText: '0.4%', color: 'green' }
        ],
        note: 'Amazon threshold: <4% · All channels compliant'
      },
      restock: [
        { level: 'red',   title: 'Isotonic Mix 1kg — Amazon UK', sub: 'OOS · Immediate restock needed' },
        { level: 'amber', title: 'Energy Gel — eBay UK', sub: '9 days cover · Order this week' },
        { level: 'amber', title: 'Isotonic Mix 1kg — Amazon UK', sub: '11 days cover · Order this week' }
      ]
    },

    products: {
      kpis: [
        { bar: '#1f2a44', lbl: 'Top ASIN Rev.', val: '£8,200',  dCls: 'du', d: 'Amazon UK',    s: '27.9% of total' },
        { bar: 'green',   lbl: 'Orders',        val: '717',     dCls: 'du', d: '▲ 18.0% MoM',  s: '608 orders Apr' },
        { bar: 'blue',    lbl: 'Avg. AoV',      val: '£41',     dCls: 'du', d: '▲ £1 MoM',     s: '£40 Apr' },
        { bar: 'amber',   lbl: 'ASP',           val: '£28.40',  dCls: 'du', d: '▲ £0.20 MoM',  s: '£28.20 Apr' }
      ],
      table: [
        { name: 'Amazon UK', flag: 'gb', revenue: '£18,400', units: '470', orders: '449', cvr: '12.6%', cvrCls: 'bg', aov: '£41.0' },
        { name: 'eBay UK',   flag: 'gb', revenue: '£4,200',  units: '110', orders: '102', cvr: '9.4%',  cvrCls: 'ba', aov: '£41.2' },
        { name: 'D2C',       flag: 'gb', revenue: '£6,800',  units: '180', orders: '166', cvr: '3.1%',  cvrCls: 'ba', aov: '£41.0' }
      ]
    },

    keywords: {
      kpis: [
        { bar: '#1f2a44', lbl: 'Active KWs',     val: '186',   dCls: 'du', d: '▲ 14 MoM',     s: 'Across all campaigns' },
        { bar: 'green',   lbl: 'Avg. CPC',       val: '£0.33', dCls: 'du', d: '▼ £0.02 MoM',  s: 'Blended UK' },
        { bar: 'red',     lbl: 'High ACOS KWs',  val: '8',     dCls: 'dd', d: 'ACOS >30%',     s: 'Review & pause' },
        { bar: 'blue',    lbl: 'Top KW Rev.',    val: '£5.1k', dCls: 'du', d: 'isotonic drink',s: 'Amazon UK' }
      ],
      table: [
        { kw: 'isotonic drink',        geo: 'Amazon UK · SP', match: 'Exact',  matchCls: 'bg', spend: '£384', sales: '£5.1k', acos: '7.5%',  acosCls: 'bg', roas: '13.3×', cpc: '£0.28' },
        { kw: 'sports hydration powder', geo: 'Amazon UK · SP', match: 'Exact', matchCls: 'bg', spend: '£352', sales: '£4.4k', acos: '8.0%',  acosCls: 'bg', roas: '12.5×', cpc: '£0.30' },
        { kw: 'energy gel marathon',   geo: 'Amazon UK · SP', match: 'Phrase', matchCls: 'bb', spend: '£268', sales: '£2.9k', acos: '9.2%',  acosCls: 'bg', roas: '10.8×', cpc: '£0.34' },
        { kw: 'electrolyte tablets',   geo: 'eBay UK · SP',   match: 'Exact',  matchCls: 'bg', spend: '£210', sales: '£2.0k', acos: '10.5%', acosCls: 'bg', roas: '9.5×',  cpc: '£0.26' },
        { kw: 'recovery protein drink',geo: 'D2C · SP',       match: 'Phrase', matchCls: 'bb', spend: '£176', sales: '£1.6k', acos: '11.0%', acosCls: 'bg', roas: '9.1×',  cpc: '£0.25' }
      ]
    }
  }
};
