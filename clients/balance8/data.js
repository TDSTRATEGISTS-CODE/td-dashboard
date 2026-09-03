/* Balance 8 — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 03 Sep 2026 (channel 95589144, seller A3NEIOUENQO9V9),
   Amazon UK, native GBP. Two brands: "BrainMatter" (nootropic capsules — Cognitive + Calm, live
   since Sep 2025) and "WIRED" (sports nutrition — Creatine + 3 Electrolytes flavours + a Discovery
   Pack — new line, first sale 29 Aug 2026). dataSource.type is 'static' (no project-tracker sheet
   supplied yet — see config.js).

   ⚠️ DATA-QUALITY NOTE — getSalesByPeriod (channel-level monthly backbone) returned incorrect ZERO
   revenue/units for Sep–Oct 2025 and for Aug 2026 on this store, while its ad-spend/ad-sales/
   sessions/impressions fields for the SAME months were correct (cross-checked: Aug adSpend £95.64 /
   adSales £71.64 / impressions 28,786 match exactly between both tools). Nov 2025–Feb 2026 checked
   out consistent on both tools. So every revenue/units figure below is sourced from getSalesByProduct
   (per-SKU, summed by hand per month) instead, which reconciled correctly against product lastSold
   timestamps. Worth a heads-up to MerchantSpring if this recurs at the next re-bake.

   ⚠️ REAL FINDING — Balance 8 had ZERO sales Mar–Jul 2026 (5 months, confirmed via per-SKU pull, not
   a reporting gap — every SKU shows totalSales:0 / unitsSold:0 in each of those months individually).
   Cause is not visible in MerchantSpring data (not a stockout — FBA had stock the whole time per
   current cover figures). Flagged as a task below; ask the client directly (account health, listing
   suppression, deliberate pause, or something else).

   ⚠️ REAL FINDING — August 2026 P&L (getStoreProfitAndLoss, accrual basis) shows a NET LOSS despite
   the revenue recovery: gross sales £959.72, but -£785.82 of that was given away in promotions/
   discounts, leaving net revenue of only £172.33 against £296.34 of expenses (ad spend £95.64 +
   selling fees £27.62 + shipping/fulfilment £173.08) — a -£124.01 net loss, -72.0% margin. COGS is
   reported as £0 (not configured in MerchantSpring), so true profitability is worse than this once
   real product cost is entered. This is baked into sections.pnl (see the runbook: bake P&L even when
   gated) but is NOT shown in the UI while hiddenPages includes 'pnl' — flagging here because it's the
   single most important commercial fact about this account's relaunch month.

   Monthly actuals used to build every window (GBP, per-SKU pull unless noted "getSalesByPeriod"):
     Sep 25  £147.00 · 3 u · no ads
     Oct 25  £746.62 · 17 u · spend £157.46 · adSales £109.97
     Nov 25  £2,458.70 · 62 u · 881 sess · BuyBox 94.3% · spend £692.70 · adSales £1,304.60 · ACOS 53.1% · TACOS 28.2%  (getSalesByPeriod)
     Dec 25  £3,261.32 · 91 u · 1,105 sess · BuyBox 98.1% · spend £794.45 · adSales £1,486.80 · ACOS 53.4% · TACOS 24.4%  (getSalesByPeriod)
     Jan 26  £4,010.72 · 111 u · 1,543 sess · BuyBox 98.4% · spend £1,103.00 · adSales £2,438.13 · ACOS 45.2% · TACOS 27.5%  (getSalesByPeriod)
     Feb 26  £815.47 · 21 u · 286 sess · BuyBox 97.4% · spend £187.28 · adSales £432.25 · ACOS 43.3% · TACOS 23.0%  (getSalesByPeriod)
     Mar–Jul 26  £0 every month, all SKUs — confirmed dead period (see finding above)
     Aug 26  £1,032.16 · 53 u · 448 sess · BuyBox 92.0% · spend £95.64 · adSales £71.64 · ACOS 133.5% · TACOS 9.3%  (cross-checked both tools)

   NOTE: the shared app.js trend-chart axis formatter (moneyK) hardcodes '€' — KPI cards/tables here
   are all in £, but the two trend-chart Y-axes will display '€' until the template adds a currency
   option (same known limitation noted in NKV's/Abimax's data.js).

   No project-tracker Google Sheet has been supplied for Balance 8, so the Overview tasks/flags/
   completed below are a placeholder scope board built from what MerchantSpring shows (not a real
   client-side tracker) — replace once tools/balance8-sheet-proxy.gs goes live (see config.js). No ad
   budget has been set either, so the Advertising budgets/forecast cards are omitted (not fabricated)
   and the market-spend table shows "No budget set" rather than an invented target. */
window.DASHBOARD_DATA = {
  dateRanges: {
  // ===== Last Month = August 2026 =====
  'may': {
    label: 'August 2026', shortLabel: 'Aug 2026',
    rev: '£1,032', revD: '▲ First sales since Feb', revC: 'du', revS: 'vs £0 Jun/Jul · WIRED relaunch',
    adSales: '£72', adSalesD: '6.9% of revenue', adSalesC: 'df', adSalesS: '£96 spend → £72 ad sales',
    tacos: '9.3%', tacosD: 'First ad spend since Feb', tacosC: 'df', tacosS: 'Target <15%',
    roas: '0.75×', roasD: 'Loss-making on spend', roasC: 'dd', roasS: '53 units · ASP £19.47',
    spend: '£96', spendD: 'First spend since Feb', spendC: 'df', spendS: 'vs £0 Jun/Jul',
    tacosAd: '9.3%', tacosAdD: 'First ad spend since Feb', tacosAdC: 'df', tacosAdS: 'Target <15%',
    roasAd: '0.75×', roasAdD: 'ACOS 133.5%', roasAdC: 'dd', roasAdS: '£1,032 revenue',
    aov: '£19.47', aovD: 'ASP (per unit)', aovC: 'df', aovS: '53 units Aug — no order-count field exposed for Aug, see note',
    mktRows: [
      ['Amazon UK','gb','—','£96','bb','No budget set','£1,032','bg','9.3%'],
      ['Total UK',null,'—','£96','bb','No budget set','£1,032','bg','9.3%']
    ],
    revBreakChart: { max: 1200, yTicks: ['£1.2k','£900','£600','£300','£0'], xLabels: ['Aug'],
      series: [ { color:'#404935', values:[72] }, { color:'#a7ab90', values:[961] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:1200, yTicks:['£1.2k','£900','£600','£300','£0'], xLabels:['Mar','Apr','May','Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,0,0,0,0,1032],main:true,area:true}, {color:'#a7ab90',values:[0,0,0,0,0,96],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:1200, yTicks:['£1.2k','£900','£600','£300','£0'], xLabels:['Mar','Apr','May','Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,0,0,0,0,1032],main:true,area:true}, {color:'#a7ab90',values:[0,0,0,0,0,96],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'£72',acos:'133.5%'} ] },
  },
  // ===== Last 3 Months = Jun–Aug 2026 =====
  '3m': {
    label: 'Jun–Aug 2026', shortLabel: 'Jun–Aug 2026',
    rev: '£1,032', revD: '3-month total', revC: 'df', revS: 'Jun £0 · Jul £0 · Aug £1,032',
    adSales: '£72', adSalesD: '3-month total', adSalesC: 'df', adSalesS: '6.9% of revenue (all in Aug)',
    tacos: '9.3%', tacosD: '3-month blended', tacosC: 'df', tacosS: 'Target <15%',
    roas: '0.75×', roasD: '3-month avg', roasC: 'dd', roasS: 'all ad activity in Aug',
    spend: '£96', spendD: '3-month total', spendC: 'df', spendS: 'Jun £0 · Jul £0 · Aug £96',
    tacosAd: '9.3%', tacosAdD: '3-month blended', tacosAdC: 'df', tacosAdS: 'Target <15%',
    roasAd: '0.75×', roasAdD: '3-month avg', roasAdC: 'dd', roasAdS: '£1,032 revenue',
    aov: '£19.47', aovD: '3-month ASP', aovC: 'df', aovS: '53 units total',
    mktRows: [
      ['Amazon UK','gb','—','£96','bb','No budget set','£1,032','bg','9.3%'],
      ['Total UK',null,'—','£96','bb','No budget set','£1,032','bg','9.3%']
    ],
    revBreakChart: { max: 1200, yTicks: ['£1.2k','£900','£600','£300','£0'], xLabels: ['Jun','Jul','Aug'],
      series: [ { color:'#404935', values:[0,0,72] }, { color:'#a7ab90', values:[0,0,961] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:1200, yTicks:['£1.2k','£900','£600','£300','£0'], xLabels:['Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,0,1032],main:true,area:true}, {color:'#a7ab90',values:[0,0,96],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:1200, yTicks:['£1.2k','£900','£600','£300','£0'], xLabels:['Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,0,1032],main:true,area:true}, {color:'#a7ab90',values:[0,0,96],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'£72',acos:'133.5%'} ] },
  },
  // ===== Last 12 Months = Sep 2025–Aug 2026 =====
  '12m': {
    label: 'Sep 2025 – Aug 2026', shortLabel: 'Last 12 Months',
    rev: '£12,472', revD: '12-month total', revC: 'df', revS: 'Jan 26 peak £4,011 · Mar–Jul 26 £0',
    adSales: '£5,843', adSalesD: '12-month total', adSalesC: 'df', adSalesS: '46.9% of revenue',
    tacos: '24.3%', tacosD: '12-month blended', tacosC: 'dd', tacosS: 'Target <15%',
    roas: '1.93×', roasD: '12-month avg', roasC: 'dd', roasS: '358 units total',
    spend: '£3,031', spendD: '12-month total', spendC: 'df', spendS: 'concentrated Nov 25–Feb 26',
    tacosAd: '24.3%', tacosAdD: '12-month blended', tacosAdC: 'dd', tacosAdS: 'Target <15%',
    roasAd: '1.93×', roasAdD: '12-month avg', roasAdC: 'dd', roasAdS: '£12,472 revenue',
    aov: '£34.84', aovD: '12-month ASP', aovC: 'df', aovS: '358 units total',
    mktRows: [
      ['Amazon UK','gb','—','£3,031','bb','No budget set','£12,472','ba','24.3%'],
      ['Total UK',null,'—','£3,031','bb','No budget set','£12,472','ba','24.3%']
    ],
    revBreakChart: { max: 4000, yTicks: ['£4k','£3k','£2k','£1k','£0'], xLabels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      series: [ { color:'#404935', values:[0,110,1305,1487,2438,432,0,0,0,0,0,72] }, { color:'#a7ab90', values:[147,637,1154,1775,1573,383,0,0,0,0,0,961] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:4000, yTicks:['£4k','£3k','£2k','£1k','£0'], xLabels:['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[147,747,2459,3261,4011,815,0,0,0,0,0,1032],main:true,area:true}, {color:'#a7ab90',values:[0,157,693,794,1103,187,0,0,0,0,0,96],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:4000, yTicks:['£4k','£3k','£2k','£1k','£0'], xLabels:['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[147,747,2459,3261,4011,815,0,0,0,0,0,1032],main:true,area:true}, {color:'#a7ab90',values:[0,157,693,794,1103,187,0,0,0,0,0,96],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'£5.8k',acos:'51.9%'} ] },
  },
  },

  // ---- Deep-page content (rendered once at boot; August 2026 snapshot) ----
  sections: {
    overview: {
      // Placeholder scope board — no project-tracker Google Sheet supplied yet for Balance 8 (see
      // config.js dataSource comment). Built from what MerchantSpring itself shows, NOT a real
      // client-side tracker. Replace once tools/balance8-sheet-proxy.gs is deployed.
      tasksSpec: { badge: '4 in progress', items: [
        {text:'Confirm root cause of Mar–Jul 2026 sales gap', sub:'Overview · Upcoming'},
        {text:'Investigate BrainMatter Cognitive — 0% ad conversion', sub:'Advertising · Upcoming'},
        {text:'Reorder WIRED Creatine (FBA) — ~41 days cover', sub:'Supply · Upcoming'},
        {text:'Launch Sponsored Products on WIRED Electrolytes (3 flavours, no ads yet)', sub:'Advertising · Upcoming', active:false}
      ] },
      flagsSpec: { badge: '3 in progress', items: [
        {level:'amber', title:'Mar–Jul 2026 sales gap — 5 months at £0', sub:'Confirmed via per-SKU pull, not a reporting gap · cause unclear'},
        {level:'red', title:'August P&L — net loss despite revenue recovery', sub:'-£124 net (-72.0% margin) · £786 given away in promotions vs £960 gross sales'},
        {level:'amber', title:'WIRED Creatine — low FBA cover', sub:'B0HD7ZKMZZ · ~41 days · 30 units sold in Aug alone'}
      ] },
      completedSpec: { badge: '3 completed', items: [
        {text:'WIRED sports-nutrition line live on Amazon UK', sub:'Completed · Aug 2026 — first sales, mostly organic'},
        {text:'BrainMatter Cognitive + Calm — residual sales maintained', sub:'Completed'},
        {text:'7 ASINs live, 0 suppressed / 0 OOS', sub:'Completed'}
      ] },
      // No per-ASIN Buy Box field exposed by the MerchantSpring product report — each SKU shown at
      // ~the Aug 2026 channel rate (92.0%), same limitation noted in Abimax's data.js.
      buyBox: [
        {label:'BrainMatter Cognitive', pct:92, color:'green'},
        {label:'BrainMatter Calm', pct:92, color:'green'},
        {label:'WIRED Creatine', pct:92, color:'green'},
        {label:'WIRED Discovery Pack', pct:92, color:'green'}
      ],
      cvr: { val:'11.8%', note:'August 2026 · 448 sessions', sub:'UK · session conversion' },
      // Real FBA stock snapshot (MerchantSpring product report, qty + days-cover per ASIN, 03 Sep
      // 2026). 1 SKU on stock-up watch — WIRED Creatine sold 30 of its 41 on-hand units in its first
      // full month, so cover is short (~41 days) despite being brand-new stock.
      stockWarn: { badge:'1 stock-up · 0 OOS', items:[
        {level:'amber', title:'WIRED Creatine — stock-up soon', sub:'B0HD7ZKMZZ · ~41 days cover · 41 units · sold 30 in Aug'}
      ] }
    },
    // P&L is GATED behind the Executive-Subscription paywall for Balance 8 per brief ("no P&L for
    // now") — this real statement stays baked so it renders instantly the day the client wants it
    // switched on. Financial basis from getStoreProfitAndLoss (August 2026, ACCRUAL basis — chosen
    // to reconcile against the order-date sales figures used everywhere else on this dashboard):
    // gross sales £959.72 · promotions/discounts -£785.82 · other income +£20.88 · net revenue
    // £172.33 · ad spend £95.64 · selling fees £27.62 · shipping/fulfilment £173.08 · COGS £0 (NOT
    // configured in MerchantSpring — real profitability is worse than shown once product cost is
    // entered) · net loss -£124.01 (-72.0% margin). This is a genuine finding, not a modelling
    // artefact: heavy promotional discounting in the WIRED relaunch month wiped out the revenue
    // recovery and then some.
    pnl: {
      statement: {
        fixedLabel: 'August 2026 (1–31) · financial basis (MerchantSpring, accrual)',
        summary: [ {val:'£172',lbl:'Net Revenue',color:'brand'}, {val:'£296',lbl:'Total Costs',color:'red'}, {val:'-£124',lbl:'Net Profit',color:'red'} ],
        margin: { pct:'-72.0%', pctColor:'red', note:'August 2026 (31-day) · financial basis (MerchantSpring, accrual) · UK channel', rows:[
          {lbl:'Net Revenue', val:'£172'},
          {lbl:'Advertising', val:'-£96', color:'red'},
          {lbl:'Selling Fees', val:'-£28', color:'red'},
          {lbl:'Shipping & Fulfilment', val:'-£173', color:'red'},
          {lbl:'COGS (not yet configured)', val:'£0', color:'red'},
          {lbl:'Other Income', val:'+£21', color:'green'},
          {lbl:'Net Profit', val:'-£124', color:'red', strong:true}
        ] },
        mkt: [
          {name:'United Kingdom',flag:'gb',revenue:'£172',adspend:'£96',net:'-£124',netColor:'red',margin:'-72.0%',marginCls:'br'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales (gross)', amount:'£960', pct:'557.0%', unit:'£18.11'},
            {lbl:'Promotions & discounts', amount:'-£786', pct:'-456.0%', unit:'-£14.83'},
            {lbl:'Other income', amount:'£21', pct:'12.2%', unit:'£0.40'},
            {lbl:'Net revenue', amount:'£172', pct:'100.0%', unit:'£3.25', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising', amount:'£96', pct:'55.7%', unit:'£1.81'},
            {lbl:'Selling fees', amount:'£28', pct:'16.4%', unit:'£0.53'},
            {lbl:'Shipping & fulfilment fees', amount:'£173', pct:'100.4%', unit:'£3.26'},
            {lbl:'Cost of goods (not configured)', amount:'£0', pct:'0.0%', unit:'£0.00'},
            {lbl:'Total expenses', amount:'£296', pct:'171.9%', unit:'£5.59', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'-£124', pct:'-72.0%', unit:'-£2.34', total:true, profit:true},
            {lbl:'Profit %', amount:'-72.0%', accent:'red'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS %', amount:'9.3%'},
            {lbl:'Ad spend (console)', amount:'£96'}
          ] }
        ]
      }
    },
    advertising: {
      // Real August 2026 ad totals (MerchantSpring channel report, UK channel, GBP). ACOS/ROAS/TACOS
      // are channel-attributed (spend £95.64 · ad sales £71.64 → ACOS 133.5% · ROAS 0.75×).
      // ⚠️ ROAS below 1× — the only ad spend this relaunch month is currently loss-making on its own
      // terms (before even counting selling/shipping/COGS). Meanwhile WIRED Creatine and Discovery
      // Pack — 88% of Aug revenue — sold with ZERO ad spend (fully organic).
      metrics: [
        {lbl:'Total Spend',  val:'£96', id:'a-spend'},
        {lbl:'Ad Sales',     val:'£72', color:'brand'},
        {lbl:'ACOS',         val:'133.5%',  color:'red', id:'a-tacos'},
        {lbl:'ROAS',         val:'0.75×',  color:'red', id:'a-roas'},
        {lbl:'Impressions',  val:'28.8K'},
        {lbl:'Avg. CPC',     val:'£1.20'}
      ],
      // No budget sheet for Balance 8 yet — budgets/forecast cards omitted rather than inventing a
      // target (app.js guards both as optional). Add tools/balance8-sheet-proxy.gs once a tracker
      // sheet with a budget is supplied.
      // Per-ASIN Sponsored Products spend (August 2026) — REAL per-SKU actuals from the
      // MerchantSpring product report, ad-sales are the REAL per-SKU attributed figures (not
      // allocated — MerchantSpring exposed genuine per-product ad-sales this pull, unlike the
      // channel-only attribution noted in Abimax's data.js). Creatine + Discovery Pack carried no ad
      // spend this month (0 shown = no ads run, not zero performance).
      //
      // campaignsByPeriod: the Active Campaigns table used to be a single static array shown under
      // every date-range selection — so picking "Last 12 Months" showed August's 2 rows (£66+£29
      // spend) sitting right below a pie chart correctly reading the real 12-month total (£3,031
      // spend / £5,843 sales). Fixed by making this table period-aware (app.js now checks
      // campaignsByPeriod[currentPeriod] first, same idiom as kpisByPeriod/groupsByPeriod elsewhere).
      //   may / 3m: real per-SKU breakdown (Jun+Jul had £0 ad spend, so the 3-month total IS August's).
      //   12m: MerchantSpring wasn't pulled at per-SKU granularity for Nov 25–Feb 26 (only channel-
      //   level spend/sales for those months) — a per-SKU split for the full 12 months would be
      //   invented, so this is one aggregate "All Sponsored Products" row using the real 12-month
      //   totals (reconciles exactly with the campaignMix pie above it: £5.8k sales, 51.9% ACOS). CPC
      //   is left '—' rather than backed into from a rounded CTR.
      campaigns: [
        {name:'UK · BrainMatter Calm — SP',type:'Sponsored Products',spend:'£66',sales:'£72',acos:'92.5%',acosCls:'br',roas:'1.08×',cpc:'£1.35',status:'Active',statusCls:'bg'},
        {name:'UK · BrainMatter Cognitive — SP',type:'Sponsored Products',spend:'£29',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£0.95',status:'Active',statusCls:'bg'}
      ],
      campaignsByPeriod: {
        may: [
          {name:'UK · BrainMatter Calm — SP',type:'Sponsored Products',spend:'£66',sales:'£72',acos:'92.5%',acosCls:'br',roas:'1.08×',cpc:'£1.35',status:'Active',statusCls:'bg'},
          {name:'UK · BrainMatter Cognitive — SP',type:'Sponsored Products',spend:'£29',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£0.95',status:'Active',statusCls:'bg'}
        ],
        '3m': [
          {name:'UK · BrainMatter Calm — SP',type:'Sponsored Products',spend:'£66',sales:'£72',acos:'92.5%',acosCls:'br',roas:'1.08×',cpc:'£1.35',status:'Active',statusCls:'bg'},
          {name:'UK · BrainMatter Cognitive — SP',type:'Sponsored Products',spend:'£29',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£0.95',status:'Active',statusCls:'bg'}
        ],
        '12m': [
          {name:'UK · All Sponsored Products (12-month)',type:'Sponsored Products',spend:'£3,031',sales:'£5,843',acos:'51.9%',acosCls:'ba',roas:'1.93×',cpc:'—',status:'Active',statusCls:'bg'}
        ]
      }
    },
    inventory: {
      // Real FBA stock snapshot from the MerchantSpring product report (qty + days-cover per ASIN,
      // 03 Sep 2026). All 7 selling ASINs are in stock, 0 OOS. WIRED Creatine is the one stock-up
      // watch item — new stock, but sold fast (30 of 41 units in its first month). The 3 WIRED
      // Electrolytes flavours (Melon Ice / Berry Fusion / Citrus Lime) are live but have not sold yet
      // — daysCover is not calculable with zero sales velocity. No dispatch-rate source → the
      // Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'7',dCls:'du',d:'ASINs · 0 OOS',s:'all sold listings live'},
        {bar:'#404935',lbl:'Units on Hand',val:'531',dCls:'df',d:'FBA total',s:'across 7 SKUs'},
        {bar:'amber',lbl:'Stock-up Watch',val:'1',dCls:'dd',d:'WIRED Creatine',s:'~41 days cover'},
        {bar:'green',lbl:'Buy Box (Aug)',val:'92.0%',dCls:'df',d:'featured-offer %',s:'channel rate'}
      ],
      stock: [
        {dot:'da',name:'WIRED Pure Creatine Monohydrate',note:'B0HD7ZKMZZ · UK · sold 30 in first month',units:'41 units',unitsColor:'amber',days:'~41 days'},
        {dot:'dg',name:'WIRED Electrolytes Discovery Pack',note:'B0HD7XTQ3H · UK',units:'75 units',days:'~102 days'},
        {dot:'dg',name:'BrainMatter Cognitive',note:'B0DS8V2T97 · UK · slow mover, residual sales',units:'101 units',days:'~1,461 days'},
        {dot:'dg',name:'BrainMatter Calm',note:'B0DS8X7RH8 · UK · slow mover, residual sales',units:'98 units',days:'~1,461 days'},
        {dot:'dg',name:'WIRED Electrolytes — Melon Ice',note:'B0HD7JBLVY · UK · new, no sales yet',units:'72 units',days:'n/a'},
        {dot:'dg',name:'WIRED Electrolytes — Berry Fusion',note:'B0HD7RFZN4 · UK · new, no sales yet',units:'72 units',days:'n/a'},
        {dot:'dg',name:'WIRED Electrolytes — Citrus Lime',note:'B0HD7WP7VT · UK · new, no sales yet',units:'72 units',days:'n/a'}
      ],
      restock: []
    },
    products: {
      // KPIs + by-market table = August 2026 (page period). Groups card = Aug sales by product,
      // combining FBA + FBM listings per ASIN (7 distinct products; several also carry a near-
      // identical FBM backup listing with no distinct sales history).
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'4',dCls:'df',d:'sold in Aug',s:'7 live · 3 Electrolytes flavours no Aug sales'},
        {bar:'var(--green)',lbl:'Top Product Rev.',val:'£675',dCls:'du',d:'WIRED Creatine',s:'65% of Aug sales'},
        {bar:'var(--blue)',lbl:'Units (Aug)',val:'53',dCls:'du',d:'▲ from 0 (Jun/Jul)',s:'relaunch month'},
        {bar:'var(--amber)',lbl:'ASP',val:'£19.47',dCls:'df',d:'per unit',s:'no order-count field exposed for Aug'}
      ],
      table: [
        {name:'United Kingdom',flag:'gb',revenue:'£1,032',units:'53',orders:'~53*',cvr:'11.8%',cvrCls:'bg',aov:'£19.47'}
      ],
      // August 2026 sales by product (real MerchantSpring product report, UK channel, FBA+FBM
      // combined per ASIN). % = share of Aug product sales. OOS Rate = share of the SKU currently
      // out of stock (all in stock, all 0%).
      groups: [
        {name:'WIRED Pure Creatine Monohydrate',sales:'£675',units:30,pct:'65%',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Electrolytes Discovery Pack',sales:'£190',units:19,pct:'18%',oosRate:'0%',oosCls:'bg'},
        {name:'BrainMatter Calm',sales:'£129',units:3,pct:'12%',oosRate:'0%',oosCls:'bg'},
        {name:'BrainMatter Cognitive',sales:'£39',units:1,pct:'4%',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Electrolytes — Melon Ice',sales:'£0',units:0,pct:'0%',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Electrolytes — Berry Fusion',sales:'£0',units:0,pct:'0%',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Electrolytes — Citrus Lime',sales:'£0',units:0,pct:'0%',oosRate:'0%',oosCls:'bg'}
      ]
    }
  }
};
