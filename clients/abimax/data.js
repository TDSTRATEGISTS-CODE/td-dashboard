/* Abimax — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 04 Sep 2026 (channel 106785689, seller A267LLT9LT0HS9),
   Amazon US, native USD. Single brand: "Magnostream" magnetic water descalers. The store launched on
   Amazon US in March 2026 (first sale Mar 2026) and is scaling — so "Since Launch" (6m key = Mar–Aug)
   is the widest window; there is no pre-March history to show.
   dataSource.type is 'appsScript' (overlay:'sections' — live Overview scope board only).

   Monthly actuals used to build every window (getSalesByPeriod, interval M, America/Los_Angeles):
     Mar  $4,190.91 · 36 ord · 41 u · 367 sess · BuyBox 86.5% · no ads
     Apr  $1,666.95 · 17 ord · 18 u · 391 sess · BuyBox 93.2% · spend $196.70 · adSales $318.50 · ACOS 61.8% · TACOS 11.8%
     May  $5,365.67 · 58 ord · 65 u · 1,118 sess · BuyBox 98.4% · spend $404.08 · adSales $2,773.50 · ACOS 14.6% · TACOS 7.5%
     Jun  $7,393.72 · 54 ord · 55 u · 1,351 sess · BuyBox 99.1% · spend $758.86 · adSales $4,636.00 · ACOS 16.4% · TACOS 10.3%
     Jul  $4,311.39 · 33 ord · 35 u · 1,351 sess · BuyBox 98.9% · spend $978.59 · adSales $2,960.95 · ACOS 33.0% · TACOS 22.7%
     Aug  $3,793.27 · 34 ord · 35 u · 1,522 sess · BuyBox 99.4% · spend $1,146.15 · adSales $2,571.82 · ACOS 44.6% · TACOS 30.2%

   ⚠️ NEEDS REVIEW — Aug 2026 self-check flag: ROAS fell again to 2.24× (Jul 3.02×, Jun 6.11×), a
   second consecutive month below Abimax's plausible ~5–7× efficient-ROAS band, and TACOS rose to
   30.2% (Jul 22.7%, target <15%) — a continuation/worsening of the Jul review flag, NOT a resolved
   one-off. Investigated for an obvious cause: NOT a stockout (all 4 ASINs returned by this pull are
   in stock, 111–360 days FBA cover). Per-SKU pull (getSalesByProduct) shows the flagship Magnostream
   Pro's ad spend rose +24% MoM ($542→$674) while its allocated ad sales fell -43% ($1,510→$855, ACOS
   36%→79%); Magnostream Pack of 2's ad spend held roughly flat ($51→$32) while its ad-attributed
   sales collapsed to $0 (from $316). Organic mix for the flagship actually IMPROVED (23%→53% of its
   own sales), so this reads as an ad-efficiency problem specifically (rising CPCs / falling ad
   conversion), not a broader organic visibility loss — but still no obvious external cause (no price
   change, no stockout, no BuyBox loss — BuyBox is actually up to 99.4%) → routed to human review per
   the monthly re-bake self-check gate (NOT pushed to main).
   Also flagging separately: the Aug getSalesByProduct pull returned only 4 ASINs (Magnostream Pro,
   Single, Pack of 2, Pack of 3) — the 5th SKU tracked in prior bakes, "Magnostream Multi-Unit Bundle"
   (B0GH7YKPZJ, a slow mover with no recent sales), did not appear at all this month even with
   includeNoInventory:true. Unknown whether it was deactivated/delisted or is a report gap — worth a
   human check. It has been left out of inventory/products below rather than guessed at.

   NOTE: the shared app.js trend-chart axis formatter (moneyK) hardcodes '€' — KPI cards/tables here
   are all in $, but the two trend-chart Y-axes will display '€' until the template adds a currency
   option (same known limitation noted in NKV's data.js). */
window.DASHBOARD_DATA = {
  dateRanges: {
  // ===== Last Month = August 2026 =====
  'may': {
    label: 'August 2026', shortLabel: 'August 2026',
    rev: '$3,793', revD: '▼ 12.0% MoM', revC: 'dd', revS: 'vs $4,311 July',
    adSales: '$2,572', adSalesD: '▼ 13.1% MoM', adSalesC: 'dd', adSalesS: '67.8% of revenue',
    tacos: '30.2%', tacosD: '▲ 7.5pp vs July', tacosC: 'dd', tacosS: 'Target <15%',
    roas: '2.24×', roasD: '▼ 0.78× vs July', roasC: 'dd', roasS: '34 orders · AOV $112',
    spend: '$1,146', spendD: '▲ 16.9% MoM', spendC: 'dd', spendS: 'vs $980 July · efficiency down',
    tacosAd: '30.2%', tacosAdD: '▲ 7.5pp vs July', tacosAdC: 'dd', tacosAdS: 'Target <15%',
    roasAd: '2.24×', roasAdD: '▼ 0.78× vs July', roasAdC: 'dd', roasAdS: '$3,793 revenue',
    aov: '$112', aovD: '▼ 14.6% MoM', aovC: 'dd', aovS: '34 orders Aug',
    mktRows: [
      ['Amazon US','us','$1,200','$1,146','bg','▼ $54 under','$3,793','br','30.2%'],
      ['Total US',null,'$1,200','$1,146','bg','95% utilised','$3,793','br','30.2%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Aug'],
      series: [ { color:'#404935', values:[2572] }, { color:'#a7ab90', values:[1221] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311,3793],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,980,1146],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311,3793],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,980,1146],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$2.6k',acos:'44.6%'} ] },
  },
  // ===== Last 3 Months = Jun–Aug 2026 =====
  '3m': {
    label: 'Jun–Aug 2026', shortLabel: 'Jun–Aug 2026',
    rev: '$15,498', revD: '3-month actuals', revC: 'du', revS: 'Jun $7,394 · Jul $4,311 · Aug $3,793',
    adSales: '$10,169', adSalesD: '3-month total', adSalesC: 'df', adSalesS: '65.6% of revenue',
    tacos: '18.6%', tacosD: '3-month blended', tacosC: 'df', tacosS: 'Target <15%',
    roas: '3.53×', roasD: '3-month avg', roasC: 'df', roasS: '121 orders · AOV $128',
    spend: '$2,884', spendD: '3-month total', spendC: 'df', spendS: 'Jun $759 · Jul $980 · Aug $1,146',
    tacosAd: '18.6%', tacosAdD: '3-month blended', tacosAdC: 'df', tacosAdS: 'Aug softer than Jun/Jul',
    roasAd: '3.53×', roasAdD: '3-month avg', roasAdC: 'df', roasAdS: '$15,498 revenue',
    aov: '$128', aovD: '3-month avg', aovC: 'df', aovS: '121 orders total',
    mktRows: [
      ['Amazon US','us','$3,000','$2,884','bg','▼ $116 under','$15,498','ba','18.6%'],
      ['Total US',null,'$3,000','$2,884','bg','96% utilised','$15,498','ba','18.6%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Jun','Jul','Aug'],
      series: [ { color:'#404935', values:[4636,2961,2572] }, { color:'#a7ab90', values:[2758,1350,1221] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[7394,4311,3793],main:true,area:true}, {color:'#a7ab90',values:[759,980,1146],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[7394,4311,3793],main:true,area:true}, {color:'#a7ab90',values:[759,980,1146],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$10.2k',acos:'28.4%'} ] },
  },
  // ===== Since Launch = Mar–Aug 2026 (first sale Mar 2026) =====
  '6m': {
    label: 'Since Launch · Mar–Aug 2026', shortLabel: 'Since Launch',
    rev: '$26,722', revD: 'Since launch (Mar–Aug)', revC: 'du', revS: 'first sale Mar 2026',
    adSales: '$13,262', adSalesD: 'launch-to-date', adSalesC: 'df', adSalesS: '49.6% of revenue',
    tacos: '13.0%', tacosD: 'launch blended', tacosC: 'df', tacosS: 'ads live from Apr',
    roas: '3.81×', roasD: 'launch avg', roasC: 'df', roasS: '232 orders · AOV $115',
    spend: '$3,484', spendD: 'launch-to-date', spendC: 'df', spendS: 'ads started Apr 2026',
    tacosAd: '13.0%', tacosAdD: 'launch blended', tacosAdC: 'df', tacosAdS: 'Jul/Aug dipped efficiency',
    roasAd: '3.81×', roasAdD: 'launch avg', roasAdC: 'df', roasAdS: '$26,722 revenue',
    aov: '$115', aovD: 'launch avg', aovC: 'df', aovS: '232 orders total',
    mktRows: [
      ['Amazon US','us','$3,700','$3,484','bg','▼ $216 under','$26,722','ba','13.0%'],
      ['Total US',null,'$3,700','$3,484','bg','94% utilised','$26,722','ba','13.0%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Mar','Apr','May','Jun','Jul','Aug'],
      series: [ { color:'#404935', values:[0,319,2774,4636,2961,2572] }, { color:'#a7ab90', values:[4191,1348,2592,2758,1350,1221] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311,3793],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,980,1146],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311,3793],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,980,1146],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$13.3k',acos:'26.3%'} ] },
  },
  },

  // ---- Deep-page content (rendered once at boot; August 2026 snapshot) ----
  sections: {
    overview: {
      // Static fallback — served live by tools/abimax-sheet-proxy.gs (overlay:'sections') when the
      // proxy is reachable; DO NOT edit tasks/flags/completed during a re-bake (see CLAUDE.md /
      // tools/abimax-monthly-rebake.prompt.md). Left byte-for-byte unchanged from the prior bake.
      tasksSpec: { badge: 'Launch scale-up', items: [
        {text:'Scale Sponsored Products — Magnostream Pro', sub:'Advertising · Upcoming'},
        {text:'A+ Content across descaler range', sub:'Listings · Upcoming'},
        {text:'Review-generation programme (Vine)', sub:'Reputation · Upcoming', active:false},
        {text:'Restock Magnostream Pro + Pack of 3', sub:'Supply · Upcoming', active:false}
      ] },
      flagsSpec: { badge: '3 in progress', items: [
        {level:'amber', title:'Magnostream Pro — low FBA cover', sub:'B0GGRJKS2D · ~30 days · stock-up soon'},
        {level:'amber', title:'Ad spend scaling — hold ACOS <20%', sub:'Spend +88% MoM · ACOS 16.4%'},
        {level:'muted', title:'Parent-child variation family', sub:'Consolidating 5 ASINs under one listing'}
      ] },
      completedSpec: { badge: '4 completed', items: [
        {text:'Amazon US FBA launch live', sub:'Completed · Mar 2026'},
        {text:'5-SKU Magnostream range live', sub:'Completed'},
        {text:'Sponsored Products campaigns active', sub:'Completed · Apr 2026'},
        {text:'Buy Box 99% featured-offer rate', sub:'Completed'}
      ] },
      // Featured-offer (Buy Box) — real account August rate 99.4%; no per-ASIN buybox field exposed by
      // the MerchantSpring product report, so each SKU is shown at ~the channel rate (same limitation
      // as the prior bake).
      buyBox: [
        {label:'Magnostream Single', pct:99, color:'green'},
        {label:'Magnostream Pro', pct:99, color:'green'},
        {label:'Magnostream Pack of 3', pct:99, color:'green'},
        {label:'Magnostream Pack of 2', pct:99, color:'green'}
      ],
      cvr: { val:'2.3%', note:'August 2026 · 1,522 sessions', sub:'US · session conversion' },
      // FBA stock warnings = real MerchantSpring product report (qty + days-cover per ASIN, 04 Sep
      // 2026). Two SKUs have dropped below the ~180-day comfort band used in prior bakes — Magnostream
      // Single (111 days, down from 191 in Jul) and Magnostream Pro (140 days, down from 204 in Jul) —
      // flagged as stock-up watch (not OOS, still healthy runway, but trending down fast).
      stockWarn: { badge:'2 stock-up · 0 OOS', items:[
        {level:'amber', title:'Magnostream Single — reorder soon', sub:'B0GLT2LYKY · ~111 days cover · down from 191d Jul'},
        {level:'amber', title:'Magnostream Pro — reorder soon', sub:'B0GGRJKS2D · ~140 days cover · down from 204d Jul'}
      ] }
    },
    // P&L is GATED behind the Executive-Subscription paywall for Abimax (Digital Dash tier) — this
    // real statement stays baked so it renders instantly the day the client upgrades. Financial basis
    // from getStoreProfitAndLoss (August 2026, ACCRUAL basis — requested specifically so this ties to
    // the order-date sales figures above): sales $3,793.27 · refunds $0 · reimbursements +$60.75 ·
    // other income +$57.94 · promotions -$24.03 · selling fees $44.73 · shipping/fulfilment $248.32 ·
    // COGS $753.92 · settlement ad spend $1,148.99 · other expenses -$142.83. MerchantSpring's own
    // totalRevenue ($3,610.40) / totalExpenses ($2,053.13) are used for the summary + top margin row
    // below, as they reflect additional settlement adjustments beyond the itemized rows shown (same
    // known gap as the prior bake — MerchantSpring doesn't fully itemize its own top-line total).
    // (Settlement ad spend $1,149 differs slightly from the $1,146 ad-console figure shown on the
    // Advertising page — different basis, same known limitation as prior bakes.)
    pnl: {
      statement: {
        fixedLabel: 'August 2026 (1–31) · financial basis (MerchantSpring, accrual)',
        summary: [ {val:'$3,610',lbl:'Net Revenue',color:'brand'}, {val:'$2,053',lbl:'Total Costs',color:'red'}, {val:'$1,557',lbl:'Net Profit',color:'green'} ],
        margin: { pct:'43.1%', pctColor:'amber', note:'August 2026 (31-day) · financial basis (MerchantSpring) · US channel', rows:[
          {lbl:'Net Revenue', val:'$3,610'},
          {lbl:'Advertising', val:'-$1,149', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-$293', color:'red'},
          {lbl:'COGS', val:'-$754', color:'red'},
          {lbl:'Other adjustments (refunds/reimb./promo)', val:'-$48', color:'red'},
          {lbl:'Net Profit', val:'$1,557', color:'green', strong:true}
        ] },
        mkt: [
          {name:'United States',flag:'us',revenue:'$3,610',adspend:'$1,146',net:'$1,557',netColor:'green',margin:'43.1%',marginCls:'ba'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$3,793', pct:'105.1%', unit:'$111.57'},
            {lbl:'Refunds', amount:'$0', pct:'0.0%', unit:'$0.00'},
            {lbl:'Reimbursements + other income', amount:'$119', pct:'3.3%', unit:'$3.49'},
            {lbl:'Net revenue', amount:'$3,610', pct:'100.0%', unit:'$106.19', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$1,149', pct:'31.8%', unit:'$33.79'},
            {lbl:'Selling fees', amount:'$45', pct:'1.2%', unit:'$1.32'},
            {lbl:'Shipping & fulfilment fees', amount:'$248', pct:'6.9%', unit:'$7.30'},
            {lbl:'Cost of goods', amount:'$754', pct:'20.9%', unit:'$22.18'},
            {lbl:'Promotions + other expenses', amount:'-$167', pct:'-4.6%', unit:'-$4.91'},
            {lbl:'Total expenses', amount:'$2,053', pct:'56.9%', unit:'$60.38', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$1,557', pct:'43.1%', unit:'$45.79', total:true, profit:true},
            {lbl:'Profit %', amount:'43.1%', accent:'amber'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS %', amount:'30.2%'},
            {lbl:'Ad spend (console)', amount:'$1,146'}
          ] }
        ]
      }
    },
    advertising: {
      // Real August 2026 ad totals (MerchantSpring channel report, US channel, USD). ACOS/ROAS/TACOS
      // are the channel-attributed figures (spend $1,146 · ad sales $2,572 → ACOS 44.6% · ROAS 2.24×).
      // ⚠️ ROAS below Abimax's plausible ~5–7× efficient band for a 2nd straight month — see top-of-file review note.
      metrics: [
        {lbl:'Total Spend',  val:'$1,146', id:'a-spend'},
        {lbl:'Ad Sales',     val:'$2,572', color:'brand'},
        {lbl:'ACOS',         val:'44.6%',  color:'red', id:'a-tacos'},
        {lbl:'ROAS',         val:'2.24×',  color:'red', id:'a-roas'},
        {lbl:'Impressions',  val:'135.1K'},
        {lbl:'Avg. CPC',     val:'$1.02'}
      ],
      // No budget sheet for Abimax yet — a working monthly ad budget is tracked vs the real actual
      // (continuing the $1,000 Jul → $1,200 Aug progression flagged in the prior bake's forecast).
      // Refreshed at each re-bake; goes live if/when an Apps Script budget proxy is added.
      budgets: {
        subLabel: 'August 2026 · budget vs actual',
        headers: ['Monthly Budget','August Actual','Variance','Utilisation'],
        rows: [
          {name:'United States', flag:'us', cells:['$1,200','$1,146','▼ $54 under','95%']},
          {name:'Total', total:true,        cells:['$1,200','$1,146','▼ $54 under','95%']}
        ]
      },
      // Forward ad budget as the account scales into H2 (working plan; no sheet forecast yet). Given
      // this month's efficiency flag (ROAS 2.24×, TACOS 30.2%), the human reviewer may want to revisit
      // this progression rather than continuing to scale spend — left mechanical/unchanged pending that call.
      forecast: [
        {month:'Sep', budget:'$1,400', pct:100, tacos:'<15%', tacosColor:'amber', roas:'—', opacity:0.7},
        {month:'Oct', budget:'$1,600', pct:100, tacos:'<15%', tacosColor:'amber', roas:'—', opacity:0.6}
      ],
      // Per-ASIN Sponsored Products campaigns (August 2026). Spend + CPC are REAL per-SKU actuals from
      // the MerchantSpring product report; ad-sales are allocated from the channel-attributed total
      // ($2,572) by spend share, so the table foots to the headline (MerchantSpring's MCP exposes
      // channel-level attribution, not per-campaign, without the heavier async campaigns report).
      campaigns: [
        {name:'US · Magnostream Pro — SP',type:'Sponsored Products',spend:'$674',sales:'$1,512',acos:'44.6%',acosCls:'br',roas:'2.2×',cpc:'$1.08',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Single — SP',type:'Sponsored Products',spend:'$410',sales:'$920',acos:'44.6%',acosCls:'br',roas:'2.2×',cpc:'$0.94',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 2 — SP',type:'Sponsored Products',spend:'$32',sales:'$72',acos:'44.6%',acosCls:'br',roas:'2.2×',cpc:'$0.94',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 3 — SP',type:'Sponsored Products',spend:'$30',sales:'$68',acos:'44.6%',acosCls:'br',roas:'2.2×',cpc:'$0.95',status:'Active',statusCls:'bg'}
      ]
    },
    inventory: {
      // Real FBA stock snapshot from the MerchantSpring product report (qty + days-cover per ASIN, 04
      // Sep 2026). Only 4 ASINs returned this pull (see top-of-file note re: Multi-Unit Bundle missing).
      // Two of the 4 have dropped below the ~180-day comfort band used previously — flagged as
      // stock-up watch, not urgent (both still >100 days runway). No dispatch-rate source → the
      // Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'4',dCls:'df',d:'ASINs · 0 OOS',s:'Multi-Bundle missing from report — see review note'},
        {bar:'#404935',lbl:'Units on Hand',val:'169',dCls:'df',d:'FBA total',s:'across 4 SKUs'},
        {bar:'amber',lbl:'Stock-up Watch',val:'2',dCls:'dd',d:'reorder soon',s:'2 SKUs <150d cover'},
        {bar:'green',lbl:'Buy Box (Aug)',val:'99.4%',dCls:'du',d:'featured-offer %',s:'vs 98.9% Jul'}
      ],
      stock: [
        {dot:'da',name:'Magnostream Pro — Heavy-Duty Descaler',note:'B0GGRJKS2D · US · top revenue SKU',units:'28 units',days:'~140 days',unitsColor:'amber'},
        {dot:'da',name:'Magnostream Single Descaler',note:'B0GLT2LYKY · US · best seller by units',units:'97 units',days:'~111 days',unitsColor:'amber'},
        {dot:'dg',name:'Magnostream Pack of 3',note:'B0GLPWZCRV · US',units:'24 units',days:'~360 days'},
        {dot:'dg',name:'Magnostream Pack of 2',note:'B0GLPQ6YZ4 · US',units:'20 units',days:'~120 days'}
      ],
      restock: [
        {level:'amber', title:'Magnostream Single — reorder soon', sub:'B0GLT2LYKY · ~111 days cover · best-seller by units'},
        {level:'amber', title:'Magnostream Pro — reorder soon', sub:'B0GGRJKS2D · ~140 days cover · top revenue SKU'}
      ]
    },
    products: {
      // KPIs + by-market table = August 2026 (page period). Groups card = August sales by product variant.
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'4',dCls:'df',d:'sold in Aug',s:'all 4 tracked SKUs sold'},
        {bar:'var(--green)',lbl:'Top Product Rev.',val:'$1,821',dCls:'du',d:'Magnostream Pro',s:'48% of Aug sales'},
        {bar:'var(--blue)',lbl:'Orders (Aug)',val:'34',dCls:'du',d:'▲ 3.0% MoM',s:'33 orders Jul'},
        {bar:'var(--amber)',lbl:'ASP',val:'$108',dCls:'dd',d:'▼ 12.0% MoM',s:'per unit'}
      ],
      table: [
        {name:'United States',flag:'us',revenue:'$3,793',units:'35',orders:'34',cvr:'2.3%',cvrCls:'br',aov:'$111.57'}
      ],
      // August 2026 sales by product variant (real MerchantSpring product report, US channel). % = share
      // of August product sales. OOS Rate = share of the variant currently out of stock (all in stock).
      groups: [
        {name:'Magnostream Pro — Heavy-Duty',sales:'$1,821',units:6,pct:'48%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Single',sales:'$1,209',units:22,pct:'32%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Pack of 2',sales:'$489',units:5,pct:'13%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Pack of 3',sales:'$274',units:2,pct:'7%',oosRate:'0%',oosCls:'bg'}
      ]
    }
  }
};
