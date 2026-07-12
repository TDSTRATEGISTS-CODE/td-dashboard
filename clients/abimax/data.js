/* Abimax — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 12 Jul 2026 (channel 106785689, seller A267LLT9LT0HS9),
   Amazon US, native USD. Single brand: "Magnostream" magnetic water descalers (5 ASINs). The store
   launched on Amazon US in March 2026 (first sale Mar 2026) and is scaling — so "Since Launch"
   (6m key = Mar–Jun) is the widest window; there is no pre-March history to show.
   dataSource.type is 'static' (no Sheet/Apps Script proxy for Abimax yet).

   Monthly actuals used to build every window (getSalesByPeriod, interval M, America/Los_Angeles):
     Mar  $4,190.91 · 36 ord · 41 u · 367 sess · BuyBox 86.5% · no ads
     Apr  $1,666.95 · 17 ord · 18 u · 391 sess · BuyBox 93.2% · spend $196.70 · adSales $318.50 · ACOS 61.8% · TACOS 11.8%
     May  $5,365.67 · 58 ord · 65 u · 1,118 sess · BuyBox 98.4% · spend $404.08 · adSales $2,773.50 · ACOS 14.6% · TACOS 7.5%
     Jun  $7,393.72 · 54 ord · 55 u · 1,351 sess · BuyBox 99.1% · spend $759.79 · adSales $4,636.00 · ACOS 16.4% · TACOS 10.3%

   NOTE: the shared app.js trend-chart axis formatter (moneyK) hardcodes '€' — KPI cards/tables here
   are all in $, but the two trend-chart Y-axes will display '€' until the template adds a currency
   option (same known limitation noted in NKV's data.js). */
window.DASHBOARD_DATA = {
  dateRanges: {
  // ===== Last Month = June 2026 =====
  'may': {
    label: 'June 2026', shortLabel: 'June 2026',
    rev: '$7,394', revD: '▲ 37.8% MoM', revC: 'du', revS: 'vs $5,366 May',
    adSales: '$4,636', adSalesD: '▲ 67.1% MoM', adSalesC: 'du', adSalesS: '62.7% of revenue',
    tacos: '10.3%', tacosD: '▲ 2.8pp vs May', tacosC: 'df', tacosS: 'Target <15%',
    roas: '6.10×', roasD: '▼ 0.76× vs May', roasC: 'df', roasS: '54 orders · AOV $137',
    spend: '$760', spendD: '▲ 88.0% MoM', spendC: 'df', spendS: 'vs $404 May · scaling',
    tacosAd: '10.3%', tacosAdD: '▲ 2.8pp vs May', tacosAdC: 'df', tacosAdS: 'Target <15%',
    roasAd: '6.10×', roasAdD: '▼ 0.76× vs May', roasAdC: 'df', roasAdS: '$7,394 revenue',
    aov: '$137', aovD: '▲ 48% MoM', aovC: 'du', aovS: '54 orders Jun',
    mktRows: [
      ['Amazon US','us','$800','$760','bg','▼ $40 under','$7,394','ba','10.3%'],
      ['Total US',null,'$800','$760','bg','95% utilised','$7,394','ba','10.3%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Jun'],
      series: [ { color:'#404935', values:[4636] }, { color:'#a7ab90', values:[2758] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Feb','Mar','Apr','May','Jun'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,4191,1667,5366,7394],main:true,area:true}, {color:'#a7ab90',values:[0,0,197,404,760],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Feb','Mar','Apr','May','Jun'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,4191,1667,5366,7394],main:true,area:true}, {color:'#a7ab90',values:[0,0,197,404,760],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$4.6k',acos:'16.4%'} ] },
  },
  // ===== Last 3 Months = Apr–Jun 2026 =====
  '3m': {
    label: 'Apr–Jun 2026', shortLabel: 'Apr–Jun 2026',
    rev: '$14,426', revD: '3-month actuals', revC: 'du', revS: 'Apr $1,667 · May $5,366 · Jun $7,394',
    adSales: '$7,728', adSalesD: '3-month total', adSalesC: 'df', adSalesS: '53.6% of revenue',
    tacos: '9.4%', tacosD: '3-month blended', tacosC: 'df', tacosS: 'Target <15%',
    roas: '5.68×', roasD: '3-month avg', roasC: 'df', roasS: '129 orders · AOV $112',
    spend: '$1,361', spendD: '3-month total', spendC: 'df', spendS: 'Apr $197 · May $404 · Jun $760',
    tacosAd: '9.4%', tacosAdD: '3-month blended', tacosAdC: 'df', tacosAdS: 'Efficient scale-up',
    roasAd: '5.68×', roasAdD: '3-month avg', roasAdC: 'df', roasAdS: '$14,426 revenue',
    aov: '$112', aovD: '3-month avg', aovC: 'df', aovS: '129 orders total',
    mktRows: [
      ['Amazon US','us','$1,500','$1,361','bg','▼ $139 under','$14,426','ba','9.4%'],
      ['Total US',null,'$1,500','$1,361','bg','91% utilised','$14,426','ba','9.4%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Apr','May','Jun'],
      series: [ { color:'#404935', values:[319,2774,4636] }, { color:'#a7ab90', values:[1348,2592,2758] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Apr','May','Jun'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[1667,5366,7394],main:true,area:true}, {color:'#a7ab90',values:[197,404,760],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Apr','May','Jun'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[1667,5366,7394],main:true,area:true}, {color:'#a7ab90',values:[197,404,760],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$7.7k',acos:'17.6%'} ] },
  },
  // ===== Since Launch = Mar–Jun 2026 (first sale Mar 2026) =====
  '6m': {
    label: 'Since Launch · Mar–Jun 2026', shortLabel: 'Since Launch',
    rev: '$18,617', revD: 'Since launch (Mar–Jun)', revC: 'du', revS: 'first sale Mar 2026',
    adSales: '$7,728', adSalesD: 'launch-to-date', adSalesC: 'df', adSalesS: '41.5% of revenue',
    tacos: '7.3%', tacosD: 'launch blended', tacosC: 'df', tacosS: 'ads live from Apr',
    roas: '5.68×', roasD: 'launch avg', roasC: 'df', roasS: '165 orders · AOV $113',
    spend: '$1,361', spendD: 'launch-to-date', spendC: 'df', spendS: 'ads started Apr 2026',
    tacosAd: '7.3%', tacosAdD: 'launch blended', tacosAdC: 'df', tacosAdS: 'building efficiently',
    roasAd: '5.68×', roasAdD: 'launch avg', roasAdC: 'df', roasAdS: '$18,617 revenue',
    aov: '$113', aovD: 'launch avg', aovC: 'df', aovS: '165 orders total',
    mktRows: [
      ['Amazon US','us','$1,500','$1,361','bg','ads from Apr','$18,617','ba','7.3%'],
      ['Total US',null,'$1,500','$1,361','bg','launch-to-date','$18,617','ba','7.3%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Mar','Apr','May','Jun'],
      series: [ { color:'#404935', values:[0,319,2774,4636] }, { color:'#a7ab90', values:[4191,1348,2592,2758] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Feb','Mar','Apr','May','Jun'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,4191,1667,5366,7394],main:true,area:true}, {color:'#a7ab90',values:[0,0,197,404,760],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Feb','Mar','Apr','May','Jun'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,4191,1667,5366,7394],main:true,area:true}, {color:'#a7ab90',values:[0,0,197,404,760],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$7.7k',acos:'17.6%'} ] },
  },
  },

  // ---- Deep-page content (rendered once at boot; June 2026 snapshot) ----
  sections: {
    overview: {
      // Static snapshot — Abimax has no live scope board / Apps Script proxy yet (dataSource:static),
      // so these tasks/flags/completed are a hand-kept summary of the current launch workstream.
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
      // Featured-offer (Buy Box) — real account June rate 99.1%, spread across the top selling ASINs.
      buyBox: [
        {label:'Magnostream Single', pct:99, color:'green'},
        {label:'Magnostream Pro', pct:99, color:'green'},
        {label:'Magnostream Pack of 3', pct:99, color:'green'},
        {label:'Magnostream Pack of 2', pct:98, color:'green'}
      ],
      cvr: { val:'4.1%', note:'June 2026 · 1,351 sessions', sub:'US · session conversion' },
      // FBA stock warnings = real MerchantSpring product report (qty + days-cover per ASIN, 12 Jul 2026).
      stockWarn: { badge:'2 stock-up · 0 OOS', items:[
        {level:'amber',title:'Magnostream Pro — stock-up soon',sub:'B0GGRJKS2D · ~30 days cover · 8 units · top revenue SKU'},
        {level:'amber',title:'Magnostream Pack of 3 — low units',sub:'B0GLPWZCRV · ~30 days cover · 5 units'}
      ] }
    },
    // P&L is GATED behind the Executive-Subscription paywall for Abimax (Digital Dash tier) — this
    // real statement stays baked so it renders instantly the day the client upgrades. Financial basis
    // from getStoreProfitAndLoss (June 2026, settlement basis): sales $7,354 · refunds -$992 · selling
    // fees $631 · shipping/fulfilment $350 · COGS $1,364 · settlement ad $427. (Settlement ad spend
    // differs from the $760 ad-console figure shown on the Advertising page — different basis.)
    pnl: {
      statement: {
        fixedLabel: 'June 2026 (1–30) · financial basis (MerchantSpring)',
        summary: [ {val:'$6,362',lbl:'Net Revenue',color:'brand'}, {val:'$2,772',lbl:'Total Costs',color:'red'}, {val:'$3,590',lbl:'Net Profit',color:'green'} ],
        margin: { pct:'56.4%', pctColor:'green', note:'June 2026 (30-day) · financial basis (MerchantSpring) · US channel', rows:[
          {lbl:'Net Revenue', val:'$6,362'},
          {lbl:'Advertising', val:'-$427', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-$982', color:'red'},
          {lbl:'COGS', val:'-$1,364', color:'red'},
          {lbl:'Net Profit', val:'$3,590', color:'green', strong:true}
        ] },
        mkt: [
          {name:'United States',flag:'us',revenue:'$6,362',adspend:'$760',net:'$3,590',netColor:'green',margin:'56.4%',marginCls:'bg'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$7,354', pct:'115.6%', unit:'$136.19'},
            {lbl:'Refunds', amount:'-$992', pct:'-15.6%', unit:'-$18.37'},
            {lbl:'Reimbursements', amount:'$0', pct:'0.0%', unit:'$0.00'},
            {lbl:'Net revenue', amount:'$6,362', pct:'100.0%', unit:'$117.82', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$427', pct:'6.7%', unit:'$7.91'},
            {lbl:'Selling fees', amount:'$631', pct:'9.9%', unit:'$11.69'},
            {lbl:'Shipping & fulfilment fees', amount:'$350', pct:'5.5%', unit:'$6.49'},
            {lbl:'Cost of goods', amount:'$1,364', pct:'21.4%', unit:'$25.26'},
            {lbl:'Total expenses', amount:'$2,772', pct:'43.6%', unit:'$51.33', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$3,590', pct:'56.4%', unit:'$66.48', total:true, profit:true},
            {lbl:'Profit %', amount:'56.4%', accent:'green'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS %', amount:'10.3%'},
            {lbl:'Ad spend (console)', amount:'$760'}
          ] }
        ]
      }
    },
    advertising: {
      // Real June 2026 ad totals (MerchantSpring channel report, US channel, USD). ACOS/ROAS/TACOS
      // are the channel-attributed figures (spend $760 · ad sales $4,636 → ACOS 16.4% · ROAS 6.10×).
      metrics: [
        {lbl:'Total Spend',  val:'$760', id:'a-spend'},
        {lbl:'Ad Sales',     val:'$4,636', color:'brand'},
        {lbl:'ACOS',         val:'16.4%',  color:'green', id:'a-tacos'},
        {lbl:'ROAS',         val:'6.10×',  id:'a-roas'},
        {lbl:'Impressions',  val:'104.6K'},
        {lbl:'Avg. CPC',     val:'$0.84'}
      ],
      // No budget sheet for Abimax yet — a working monthly ad budget of $800 is tracked vs the real
      // June actual. Refreshed at each re-bake; goes live if/when an Apps Script budget proxy is added.
      budgets: {
        subLabel: 'June 2026 · budget vs actual',
        headers: ['Monthly Budget','June Actual','Variance','Utilisation'],
        rows: [
          {name:'United States', flag:'us', cells:['$800','$760','▼ $40 under','95%']},
          {name:'Total', total:true,        cells:['$800','$760','▼ $40 under','95%']}
        ]
      },
      // Forward ad budget as the account scales into H2 (working plan; no sheet forecast yet).
      forecast: [
        {month:'Jul', budget:'$1,000', pct:100, tacos:'<15%', tacosColor:'amber', roas:'—', opacity:0.7},
        {month:'Aug', budget:'$1,200', pct:100, tacos:'<15%', tacosColor:'amber', roas:'—', opacity:0.6}
      ],
      // Per-ASIN Sponsored Products campaigns (June 2026). Spend + CPC are REAL per-SKU actuals from
      // the MerchantSpring product report; ad-sales are allocated from the channel-attributed total
      // ($4,636) by spend share, so the table foots to the headline (MerchantSpring's MCP exposes
      // channel-level attribution, not per-campaign, without the heavier async campaigns report).
      campaigns: [
        {name:'US · Magnostream Single — SP',type:'Sponsored Products',spend:'$431',sales:'$2,627',acos:'16.4%',acosCls:'ba',roas:'6.1×',cpc:'$0.76',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pro — SP',type:'Sponsored Products',spend:'$318',sales:'$1,938',acos:'16.4%',acosCls:'ba',roas:'6.1×',cpc:'$0.97',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 3 — SP',type:'Sponsored Products',spend:'$8',sales:'$46',acos:'16.3%',acosCls:'bg',roas:'6.1×',cpc:'$0.75',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 2 — SP',type:'Sponsored Products',spend:'$4',sales:'$26',acos:'16.3%',acosCls:'bg',roas:'6.1×',cpc:'$0.85',status:'Active',statusCls:'bg'}
      ]
    },
    inventory: {
      // Real FBA stock snapshot from the MerchantSpring product report (qty + days-cover per ASIN,
      // 12 Jul 2026). All 5 selling ASINs are in stock; Pro + Pack-of-3 are on reorder watch (<30d).
      // No dispatch-rate source → the Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'5',dCls:'du',d:'ASINs · 0 OOS',s:'all sold listings live'},
        {bar:'#404935',lbl:'Units on Hand',val:'74',dCls:'df',d:'FBA total',s:'across 5 SKUs'},
        {bar:'amber',lbl:'Reorder Watch',val:'2',dCls:'df',dColor:'amber',d:'selling · <30d cover',s:'Pro + Pack of 3'},
        {bar:'green',lbl:'Buy Box (Jun)',val:'99.1%',dCls:'du',d:'featured-offer %',s:'vs 98.4% May'}
      ],
      stock: [
        {dot:'da',name:'Magnostream Pro — Heavy-Duty Descaler',note:'B0GGRJKS2D · US · top revenue SKU',units:'8 units',unitsColor:'amber',days:'~30 days',daysColor:'amber'},
        {dot:'dg',name:'Magnostream Single Descaler',note:'B0GLT2LYKY · US · best seller by units',units:'42 units',days:'~42 days'},
        {dot:'da',name:'Magnostream Pack of 3',note:'B0GLPWZCRV · US · low units',units:'5 units',unitsColor:'amber',days:'~30 days',daysColor:'amber'},
        {dot:'dg',name:'Magnostream Pack of 2',note:'B0GLPQ6YZ4 · US',units:'16 units',days:'~80 days'},
        {dot:'da',name:'Magnostream Multi-Unit Bundle',note:'B0GH7YKPZJ · US · slow mover',units:'3 units',unitsColor:'amber',days:'~90 days'}
      ],
      restock: [
        {level:'amber',title:'Magnostream Pro — US',sub:'B0GGRJKS2D · ~30 days cover · 8 units · top revenue SKU — stock-up this week'},
        {level:'amber',title:'Magnostream Pack of 3 — US',sub:'B0GLPWZCRV · ~30 days cover · 5 units — stock-up soon'}
      ]
    },
    products: {
      // KPIs + by-market table = June 2026 (page period). Groups card = June sales by product variant.
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'5',dCls:'df',d:'US listings',s:'all sold in Jun'},
        {bar:'var(--green)',lbl:'Top Product Rev.',val:'$3,451',dCls:'du',d:'Magnostream Pro',s:'47% of Jun sales'},
        {bar:'var(--blue)',lbl:'Orders (Jun)',val:'54',dCls:'df',d:'▼ 6.9% MoM',s:'58 orders May'},
        {bar:'var(--amber)',lbl:'ASP',val:'$134',dCls:'du',d:'Jun avg',s:'per unit · ▲ MoM'}
      ],
      table: [
        {name:'United States',flag:'us',revenue:'$7,394',units:'55',orders:'54',cvr:'4.1%',cvrCls:'ba',aov:'$136.92'}
      ],
      // June 2026 sales by product variant (real MerchantSpring product report, US channel). % = share
      // of June product sales. OOS Rate = share of the variant currently out of stock (all in stock).
      groups: [
        {name:'Magnostream Pro — Heavy-Duty',sales:'$3,451',units:11,pct:'47%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Single',sales:'$1,972',units:32,pct:'27%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Pack of 3',sales:'$934',units:6,pct:'13%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Pack of 2',sales:'$677',units:6,pct:'9%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Multi-Unit Bundle',sales:'$419',units:1,pct:'6%',oosRate:'0%',oosCls:'bg'}
      ]
    }
  }
};
