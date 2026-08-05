/* Abimax — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 05 Aug 2026 (channel 106785689, seller A267LLT9LT0HS9),
   Amazon US, native USD. Single brand: "Magnostream" magnetic water descalers (5 ASINs, 1 unlaunched
   variant B0GLPPDS1M excluded). The store launched on Amazon US in March 2026 (first sale Mar 2026)
   and is scaling — so "Since Launch" (6m key = Mar–Jul) is the widest window; there is no pre-March
   history to show.
   dataSource.type is 'appsScript' (overlay:'sections' — live Overview scope board only).

   Monthly actuals used to build every window (getSalesByPeriod, interval M, America/Los_Angeles):
     Mar  $4,190.91 · 36 ord · 41 u · 367 sess · BuyBox 86.5% · no ads
     Apr  $1,666.95 · 17 ord · 18 u · 391 sess · BuyBox 93.2% · spend $196.70 · adSales $318.50 · ACOS 61.8% · TACOS 11.8%
     May  $5,365.67 · 58 ord · 65 u · 1,118 sess · BuyBox 98.4% · spend $404.08 · adSales $2,773.50 · ACOS 14.6% · TACOS 7.5%
     Jun  $7,393.72 · 54 ord · 55 u · 1,351 sess · BuyBox 99.1% · spend $758.86 · adSales $4,636.00 · ACOS 16.4% · TACOS 10.3%
     Jul  $4,311.39 · 33 ord · 35 u · 1,351 sess · BuyBox 98.9% · spend $980.20 · adSales $2,960.95 · ACOS 33.1% · TACOS 22.7%

   ⚠️ NEEDS REVIEW — Jul 2026 self-check flag: revenue -41.7% MoM, and ROAS fell to 3.02× (Jun 6.11×),
   below Abimax's plausible ~5–7× efficient-ROAS band, while ACOS more than doubled (16.4%→33.1%).
   Investigated for an obvious cause: NOT a stockout — all 5 live ASINs are well-stocked (188–260 days
   FBA cover, actually much improved vs Jun). Per-SKU pull (getSalesByProduct) shows the flagship
   Magnostream Pro's organic-sales mix collapsed from 91% of its sales (Jun) to 23% (Jul) — spend on it
   rose (+71%) but conversion held roughly flat, i.e. an apparent organic visibility/ranking loss not
   explained by inventory, prior settlement noise, or a pricing change visible in this data. No obvious
   cause found → routed to human review per the monthly re-bake self-check gate (NOT pushed to main).

   NOTE: the shared app.js trend-chart axis formatter (moneyK) hardcodes '€' — KPI cards/tables here
   are all in $, but the two trend-chart Y-axes will display '€' until the template adds a currency
   option (same known limitation noted in NKV's data.js). */
window.DASHBOARD_DATA = {
  dateRanges: {
  // ===== Last Month = July 2026 =====
  'may': {
    label: 'July 2026', shortLabel: 'July 2026',
    rev: '$4,311', revD: '▼ 41.7% MoM', revC: 'dd', revS: 'vs $7,394 June',
    adSales: '$2,961', adSalesD: '▼ 36.1% MoM', adSalesC: 'dd', adSalesS: '68.7% of revenue',
    tacos: '22.7%', tacosD: '▲ 12.4pp vs June', tacosC: 'dd', tacosS: 'Target <15%',
    roas: '3.02×', roasD: '▼ 3.09× vs June', roasC: 'dd', roasS: '33 orders · AOV $131',
    spend: '$980', spendD: '▲ 29.2% MoM', spendC: 'dd', spendS: 'vs $759 June · efficiency down',
    tacosAd: '22.7%', tacosAdD: '▲ 12.4pp vs June', tacosAdC: 'dd', tacosAdS: 'Target <15%',
    roasAd: '3.02×', roasAdD: '▼ 3.09× vs June', roasAdC: 'dd', roasAdS: '$4,311 revenue',
    aov: '$131', aovD: '▼ 4.6% MoM', aovC: 'dd', aovS: '33 orders Jul',
    mktRows: [
      ['Amazon US','us','$1,000','$980','bg','▼ $20 under','$4,311','br','22.7%'],
      ['Total US',null,'$1,000','$980','bg','98% utilised','$4,311','br','22.7%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Jul'],
      series: [ { color:'#404935', values:[2961] }, { color:'#a7ab90', values:[1350] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,980],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,980],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$3.0k',acos:'33.1%'} ] },
  },
  // ===== Last 3 Months = May–Jul 2026 =====
  '3m': {
    label: 'May–Jul 2026', shortLabel: 'May–Jul 2026',
    rev: '$17,071', revD: '3-month actuals', revC: 'du', revS: 'May $5,366 · Jun $7,394 · Jul $4,311',
    adSales: '$10,370', adSalesD: '3-month total', adSalesC: 'df', adSalesS: '60.7% of revenue',
    tacos: '12.6%', tacosD: '3-month blended', tacosC: 'df', tacosS: 'Target <15%',
    roas: '4.84×', roasD: '3-month avg', roasC: 'df', roasS: '145 orders · AOV $118',
    spend: '$2,143', spendD: '3-month total', spendC: 'df', spendS: 'May $404 · Jun $759 · Jul $980',
    tacosAd: '12.6%', tacosAdD: '3-month blended', tacosAdC: 'df', tacosAdS: 'Jul softer than May/Jun',
    roasAd: '4.84×', roasAdD: '3-month avg', roasAdC: 'df', roasAdS: '$17,071 revenue',
    aov: '$118', aovD: '3-month avg', aovC: 'df', aovS: '145 orders total',
    mktRows: [
      ['Amazon US','us','$2,250','$2,143','bg','▼ $107 under','$17,071','ba','12.6%'],
      ['Total US',null,'$2,250','$2,143','bg','95% utilised','$17,071','ba','12.6%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['May','Jun','Jul'],
      series: [ { color:'#404935', values:[2774,4636,2961] }, { color:'#a7ab90', values:[2592,2758,1350] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['May','Jun','Jul'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[5366,7394,4311],main:true,area:true}, {color:'#a7ab90',values:[404,759,980],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['May','Jun','Jul'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[5366,7394,4311],main:true,area:true}, {color:'#a7ab90',values:[404,759,980],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$10.4k',acos:'20.7%'} ] },
  },
  // ===== Since Launch = Mar–Jul 2026 (first sale Mar 2026) =====
  '6m': {
    label: 'Since Launch · Mar–Jul 2026', shortLabel: 'Since Launch',
    rev: '$22,929', revD: 'Since launch (Mar–Jul)', revC: 'du', revS: 'first sale Mar 2026',
    adSales: '$10,689', adSalesD: 'launch-to-date', adSalesC: 'df', adSalesS: '46.6% of revenue',
    tacos: '10.2%', tacosD: 'launch blended', tacosC: 'df', tacosS: 'ads live from Apr',
    roas: '4.57×', roasD: 'launch avg', roasC: 'df', roasS: '198 orders · AOV $116',
    spend: '$2,340', spendD: 'launch-to-date', spendC: 'df', spendS: 'ads started Apr 2026',
    tacosAd: '10.2%', tacosAdD: 'launch blended', tacosAdC: 'df', tacosAdS: 'Jul dipped efficiency',
    roasAd: '4.57×', roasAdD: 'launch avg', roasAdC: 'df', roasAdS: '$22,929 revenue',
    aov: '$116', aovD: 'launch avg', aovC: 'df', aovS: '198 orders total',
    mktRows: [
      ['Amazon US','us','$2,500','$2,340','bg','▼ $160 under','$22,929','ba','10.2%'],
      ['Total US',null,'$2,500','$2,340','bg','94% utilised','$22,929','ba','10.2%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Mar','Apr','May','Jun','Jul'],
      series: [ { color:'#404935', values:[0,319,2774,4636,2961] }, { color:'#a7ab90', values:[4191,1348,2592,2758,1350] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,980],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,980],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$10.7k',acos:'21.9%'} ] },
  },
  },

  // ---- Deep-page content (rendered once at boot; July 2026 snapshot) ----
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
      // Featured-offer (Buy Box) — real account July rate 98.9%; no per-ASIN buybox field exposed by
      // the MerchantSpring product report, so each SKU is shown at ~the channel rate (same limitation
      // as the prior bake).
      buyBox: [
        {label:'Magnostream Single', pct:99, color:'green'},
        {label:'Magnostream Pro', pct:99, color:'green'},
        {label:'Magnostream Pack of 3', pct:98, color:'green'},
        {label:'Magnostream Pack of 2', pct:99, color:'green'}
      ],
      cvr: { val:'2.7%', note:'July 2026 · 1,351 sessions', sub:'US · session conversion' },
      // FBA stock warnings = real MerchantSpring product report (qty + days-cover per ASIN, 05 Aug
      // 2026). All 5 live ASINs are well-stocked (188–260 days cover) — a big improvement vs the
      // prior bake's 2 reorder-watch SKUs; no stock-up items this month.
      stockWarn: { badge:'0 stock-up · 0 OOS', items:[] }
    },
    // P&L is GATED behind the Executive-Subscription paywall for Abimax (Digital Dash tier) — this
    // real statement stays baked so it renders instantly the day the client upgrades. Financial basis
    // from getStoreProfitAndLoss (July 2026, settlement basis): sales $4,521 · refunds -$445 · selling
    // fees $271 · shipping/fulfilment $229 · COGS $844 · settlement ad spend $853 · returns-overhead
    // credit +$75. (Settlement ad spend differs from the $980 ad-console figure shown on the
    // Advertising page — different basis.) Net revenue/net profit below are MerchantSpring's own
    // reported totals (totalRevenue/totalExpenses), which reflect additional settlement adjustments
    // beyond the itemized income rows shown.
    pnl: {
      statement: {
        fixedLabel: 'July 2026 (1–31) · financial basis (MerchantSpring)',
        summary: [ {val:'$3,827',lbl:'Net Revenue',color:'brand'}, {val:'$2,121',lbl:'Total Costs',color:'red'}, {val:'$1,706',lbl:'Net Profit',color:'green'} ],
        margin: { pct:'44.6%', pctColor:'amber', note:'July 2026 (31-day) · financial basis (MerchantSpring) · US channel', rows:[
          {lbl:'Net Revenue', val:'$3,827'},
          {lbl:'Advertising', val:'-$853', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-$500', color:'red'},
          {lbl:'COGS', val:'-$844', color:'red'},
          {lbl:'Returns overhead credit', val:'+$75', color:'green'},
          {lbl:'Net Profit', val:'$1,706', color:'green', strong:true}
        ] },
        mkt: [
          {name:'United States',flag:'us',revenue:'$3,827',adspend:'$980',net:'$1,706',netColor:'green',margin:'44.6%',marginCls:'ba'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$4,521', pct:'118.1%', unit:'$137.01'},
            {lbl:'Refunds', amount:'-$445', pct:'-11.6%', unit:'-$13.48'},
            {lbl:'Reimbursements', amount:'$0', pct:'0.0%', unit:'$0.00'},
            {lbl:'Net revenue', amount:'$3,827', pct:'100.0%', unit:'$115.97', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$853', pct:'22.3%', unit:'$25.85'},
            {lbl:'Selling fees', amount:'$271', pct:'7.1%', unit:'$8.22'},
            {lbl:'Shipping & fulfilment fees', amount:'$229', pct:'6.0%', unit:'$6.94'},
            {lbl:'Cost of goods', amount:'$844', pct:'22.1%', unit:'$25.58'},
            {lbl:'Returns overhead credit', amount:'-$75', pct:'-2.0%', unit:'-$2.29'},
            {lbl:'Total expenses', amount:'$2,121', pct:'55.4%', unit:'$64.27', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$1,706', pct:'44.6%', unit:'$51.70', total:true, profit:true},
            {lbl:'Profit %', amount:'44.6%', accent:'amber'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS %', amount:'22.7%'},
            {lbl:'Ad spend (console)', amount:'$980'}
          ] }
        ]
      }
    },
    advertising: {
      // Real July 2026 ad totals (MerchantSpring channel report, US channel, USD). ACOS/ROAS/TACOS
      // are the channel-attributed figures (spend $980 · ad sales $2,961 → ACOS 33.1% · ROAS 3.02×).
      // ⚠️ ROAS below Abimax's plausible ~5–7× efficient band — see top-of-file review note.
      metrics: [
        {lbl:'Total Spend',  val:'$980', id:'a-spend'},
        {lbl:'Ad Sales',     val:'$2,961', color:'brand'},
        {lbl:'ACOS',         val:'33.1%',  color:'red', id:'a-tacos'},
        {lbl:'ROAS',         val:'3.02×',  color:'red', id:'a-roas'},
        {lbl:'Impressions',  val:'130.2K'},
        {lbl:'Avg. CPC',     val:'$1.03'}
      ],
      // No budget sheet for Abimax yet — a working monthly ad budget is tracked vs the real actual
      // (continuing the $800 Jun → $1,000 Jul progression flagged in the prior bake's forecast).
      // Refreshed at each re-bake; goes live if/when an Apps Script budget proxy is added.
      budgets: {
        subLabel: 'July 2026 · budget vs actual',
        headers: ['Monthly Budget','July Actual','Variance','Utilisation'],
        rows: [
          {name:'United States', flag:'us', cells:['$1,000','$980','▼ $20 under','98%']},
          {name:'Total', total:true,        cells:['$1,000','$980','▼ $20 under','98%']}
        ]
      },
      // Forward ad budget as the account scales into H2 (working plan; no sheet forecast yet).
      forecast: [
        {month:'Aug', budget:'$1,200', pct:100, tacos:'<15%', tacosColor:'amber', roas:'—', opacity:0.7},
        {month:'Sep', budget:'$1,400', pct:100, tacos:'<15%', tacosColor:'amber', roas:'—', opacity:0.6}
      ],
      // Per-ASIN Sponsored Products campaigns (July 2026). Spend + CPC are REAL per-SKU actuals from
      // the MerchantSpring product report; ad-sales are allocated from the channel-attributed total
      // ($2,961) by spend share, so the table foots to the headline (MerchantSpring's MCP exposes
      // channel-level attribution, not per-campaign, without the heavier async campaigns report).
      campaigns: [
        {name:'US · Magnostream Pro — SP',type:'Sponsored Products',spend:'$543',sales:'$1,640',acos:'33.1%',acosCls:'br',roas:'3.0×',cpc:'$1.29',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Single — SP',type:'Sponsored Products',spend:'$357',sales:'$1,079',acos:'33.1%',acosCls:'br',roas:'3.0×',cpc:'$0.83',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 2 — SP',type:'Sponsored Products',spend:'$51',sales:'$154',acos:'33.1%',acosCls:'br',roas:'3.0×',cpc:'$0.82',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 3 — SP',type:'Sponsored Products',spend:'$29',sales:'$88',acos:'33.1%',acosCls:'br',roas:'3.0×',cpc:'$0.84',status:'Active',statusCls:'bg'}
      ]
    },
    inventory: {
      // Real FBA stock snapshot from the MerchantSpring product report (qty + days-cover per ASIN,
      // 05 Aug 2026). All 5 selling ASINs are in stock and well-covered (188–260 days) — a marked
      // improvement vs the prior bake's 2 reorder-watch SKUs. No dispatch-rate source → the Dispatch
      // card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'5',dCls:'du',d:'ASINs · 0 OOS',s:'all sold listings live'},
        {bar:'#404935',lbl:'Units on Hand',val:'209',dCls:'df',d:'FBA total',s:'across 5 SKUs'},
        {bar:'green',lbl:'Stock-up Watch',val:'0',dCls:'du',d:'no reorders needed',s:'all >180d cover'},
        {bar:'green',lbl:'Buy Box (Jul)',val:'98.9%',dCls:'df',d:'featured-offer %',s:'vs 99.1% Jun'}
      ],
      stock: [
        {dot:'dg',name:'Magnostream Pro — Heavy-Duty Descaler',note:'B0GGRJKS2D · US · top revenue SKU',units:'34 units',days:'~204 days'},
        {dot:'dg',name:'Magnostream Single Descaler',note:'B0GLT2LYKY · US · best seller by units',units:'121 units',days:'~191 days'},
        {dot:'dg',name:'Magnostream Pack of 3',note:'B0GLPWZCRV · US',units:'26 units',days:'~260 days'},
        {dot:'dg',name:'Magnostream Pack of 2',note:'B0GLPQ6YZ4 · US',units:'25 units',days:'~188 days'},
        {dot:'da',name:'Magnostream Multi-Unit Bundle',note:'B0GH7YKPZJ · US · slow mover, no Jul sales',units:'3 units',unitsColor:'amber'}
      ],
      restock: []
    },
    products: {
      // KPIs + by-market table = July 2026 (page period). Groups card = July sales by product variant.
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'4',dCls:'df',d:'sold in Jul',s:'5 live · Multi-Bundle no Jul sales'},
        {bar:'var(--green)',lbl:'Top Product Rev.',val:'$1,961',dCls:'du',d:'Magnostream Pro',s:'45% of Jul sales'},
        {bar:'var(--blue)',lbl:'Orders (Jul)',val:'33',dCls:'dd',d:'▼ 38.9% MoM',s:'54 orders Jun'},
        {bar:'var(--amber)',lbl:'ASP',val:'$123',dCls:'dd',d:'▼ 8.4% MoM',s:'per unit'}
      ],
      table: [
        {name:'United States',flag:'us',revenue:'$4,311',units:'35',orders:'33',cvr:'2.7%',cvrCls:'br',aov:'$130.65'}
      ],
      // July 2026 sales by product variant (real MerchantSpring product report, US channel). % = share
      // of July product sales. OOS Rate = share of the variant currently out of stock (all in stock).
      groups: [
        {name:'Magnostream Pro — Heavy-Duty',sales:'$1,961',units:6,pct:'45%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Single',sales:'$1,260',units:21,pct:'29%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Pack of 3',sales:'$611',units:4,pct:'14%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Pack of 2',sales:'$545',units:5,pct:'12%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Multi-Unit Bundle',sales:'$0',units:0,pct:'0%',oosRate:'0%',oosCls:'bg'}
      ]
    }
  }
};
