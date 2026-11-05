/* Abimax — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 05 Nov 2026 (channel 106785689, seller A267LLT9LT0HS9),
   Amazon US, native USD. Single brand: "Magnostream" magnetic water descalers. The store launched on
   Amazon US in March 2026 (first sale Mar 2026) and is scaling — so "Since Launch" (6m key = Mar–Oct)
   is the widest window; there is no pre-March history to show.
   dataSource.type is 'appsScript' (overlay:'sections' — live Overview scope board only).

   Monthly actuals used to build every window (getSalesByPeriod, interval M, America/Los_Angeles):
     Mar  $4,190.91 · 36 ord · 41 u · 367 sess · BuyBox 86.5% · no ads
     Apr  $1,666.95 · 17 ord · 18 u · 391 sess · BuyBox 93.2% · spend $196.70 · adSales $318.50 · ACOS 61.8% · TACOS 11.8%
     May  $5,365.67 · 58 ord · 65 u · 1,118 sess · BuyBox 98.4% · spend $404.08 · adSales $2,773.50 · ACOS 14.6% · TACOS 7.5%
     Jun  $7,393.72 · 54 ord · 55 u · 1,351 sess · BuyBox 99.1% · spend $758.86 · adSales $4,636.00 · ACOS 16.4% · TACOS 10.3%
     Jul  $4,311.39 · 33 ord · 35 u · 1,351 sess · BuyBox 98.9% · spend $978.59 · adSales $2,960.95 · ACOS 33.0% · TACOS 22.7%
     Aug  $3,793.27 · 34 ord · 35 u · 1,522 sess · BuyBox 99.4% · spend $1,140.53 · adSales $2,571.82 · ACOS 44.4% · TACOS 30.1%
     Sep  $5,003.35 · 46 ord · 47 u · 1,678 sess · BuyBox 99.7% · spend $1,356.80 · adSales $2,813.70 · ACOS 48.2% · TACOS 27.1%
     Oct  $4,785.13 · 40 ord · 42 u · 1,626 sess · BuyBox 99.6% · spend $1,319.80 · adSales $1,951.89 · ACOS 67.6% · TACOS 27.6%
   (Sep ad spend was $1,363.92 in the prior bake; MerchantSpring now reports $1,356.80 — late attribution
   restatement. Sep is shown at the restated figure in all windows, so Oct's MoM deltas compare to it.)

   ⚠️ Oct 2026 efficiency flag (published per Ryan's instruction that the data matches Amazon): ROAS is 1.48×
   (Sep 2.07×, Aug 2.25×, Jul 3.02×, Jun 6.11×) — a FOURTH consecutive month below Abimax's earlier ~5–7× band —
   and TACOS is 27.6% (target <15%). Revenue was $4,785 (▼4.4% MoM; orders 40 vs 46) on ad spend ▼2.7% to $1,320,
   but channel-attributed ad sales fell 30.6% ($2,814 → $1,952, 40.8% of revenue), so most revenue is organic.
   Per-SKU pull (getSalesByProduct): Magnostream Pro spent $602 for $250 attributed sales (ACOS 241%, ROAS 0.4×)
   and Single spent $642 for $482 (ACOS 133%); Packs of 2 and 3 spent $76 combined with no attributed sales.
   No stockout, price or Buy Box cause (Buy Box 99.6%). Pro Pack of 2 (B0GLPPDS1M) is still out of stock since
   19 Feb 2026 with no sales (not shown). The Multi-Unit Bundle (B0GH7YKPZJ) sold no units in Oct (last sale
   20 Sep). Per-listing Buy Box now comes from the trafficAndConversion report (Oct, by ASIN).
   P&L Oct (settled): net rev $4,697 · expenses $3,819 · profit $879 (18.7%) — Oct refunds of $1,061 weigh on it.

   NOTE: the shared app.js trend-chart axis formatter (moneyK) hardcodes '€' — KPI cards/tables here
   are all in $, but the two trend-chart Y-axes will display '€' until the template adds a currency
   option (same known limitation noted in NKV's data.js). */
window.DASHBOARD_DATA = {
  dateRanges: {
  // ===== Last Month = October 2026 =====
  'may': {
    label: 'October 2026', shortLabel: 'October 2026',
    rev: '$4,785', revD: '▼ 4.4% MoM', revC: 'dd', revS: 'vs $5,003 September',
    adSales: '$1,952', adSalesD: '▼ 30.6% MoM', adSalesC: 'dd', adSalesS: '40.8% of revenue',
    tacos: '27.6%', tacosD: '▲ 0.5pp vs September', tacosC: 'dd', tacosS: 'Target <15%',
    roas: '1.48×', roasD: '▼ 0.59× vs September', roasC: 'dd', roasS: '40 orders · AOV $120',
    spend: '$1,320', spendD: '▼ 2.7% MoM', spendC: 'du', spendS: 'vs $1,357 September · efficiency down',
    tacosAd: '27.6%', tacosAdD: '▲ 0.5pp vs September', tacosAdC: 'dd', tacosAdS: 'Target <15%',
    roasAd: '1.48×', roasAdD: '▼ 0.59× vs September', roasAdC: 'dd', roasAdS: '$4,785 revenue',
    aov: '$120', aovD: '▲ 10.0% MoM', aovC: 'du', aovS: '40 orders Oct',
    mktRows: [
      ['Amazon US','us','$1,600','$1,320','bg','▼ $280 under','$4,785','br','27.6%'],
      ['Total US',null,'$1,600','$1,320','bg','82% utilised','$4,785','br','27.6%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Oct'],
      series: [ { color:'#404935', values:[1952] }, { color:'#a7ab90', values:[2833] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['May','Jun','Jul','Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[5366,7394,4311,3793,5003,4785],main:true,area:true}, {color:'#a7ab90',values:[404,759,981,1141,1357,1320],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['May','Jun','Jul','Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[5366,7394,4311,3793,5003,4785],main:true,area:true}, {color:'#a7ab90',values:[404,759,981,1141,1357,1320],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$2.0k',acos:'67.6%'} ] },
  },
  // ===== Last 3 Months = Aug–Oct 2026 =====
  '3m': {
    label: 'Aug–Oct 2026', shortLabel: 'Aug–Oct 2026',
    rev: '$13,582', revD: '3-month actuals', revC: 'du', revS: 'Aug $3,793 · Sep $5,003 · Oct $4,785',
    adSales: '$7,337', adSalesD: '3-month total', adSalesC: 'df', adSalesS: '54.0% of revenue',
    tacos: '28.1%', tacosD: '3-month blended', tacosC: 'df', tacosS: 'Target <15%',
    roas: '1.92×', roasD: '3-month avg', roasC: 'df', roasS: '120 orders · AOV $113',
    spend: '$3,817', spendD: '3-month total', spendC: 'df', spendS: 'Aug $1,141 · Sep $1,357 · Oct $1,320',
    tacosAd: '28.1%', tacosAdD: '3-month blended', tacosAdC: 'df', tacosAdS: 'Well above Jun-and-earlier levels',
    roasAd: '1.92×', roasAdD: '3-month avg', roasAdC: 'df', roasAdS: '$13,582 revenue',
    aov: '$113', aovD: '3-month avg', aovC: 'df', aovS: '120 orders total',
    mktRows: [
      ['Amazon US','us','$4,200','$3,817','bg','▼ $383 under','$13,582','br','28.1%'],
      ['Total US',null,'$4,200','$3,817','bg','91% utilised','$13,582','br','28.1%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Aug','Sep','Oct'],
      series: [ { color:'#404935', values:[2572,2814,1952] }, { color:'#a7ab90', values:[1221,2189,2833] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[3793,5003,4785],main:true,area:true}, {color:'#a7ab90',values:[1141,1357,1320],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[3793,5003,4785],main:true,area:true}, {color:'#a7ab90',values:[1141,1357,1320],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$7.3k',acos:'52.0%'} ] },
    // Amazon P&L for the 3-month window (Aug+Sep+Oct settled, summed — see sections.pnl note on basis).
    sec: { pnl: {
      summary: [ {val:'$12,294',lbl:'Net Revenue',color:'brand'}, {val:'$9,559',lbl:'Total Costs',color:'red'}, {val:'$2,735',lbl:'Net Profit',color:'green'} ],
      margin: { pct:'22.2%', pctColor:'amber', note:'Aug–Oct 2026 (3-month) · financial basis (MerchantSpring, settled) · US channel', rows:[
        {lbl:'Net Revenue', val:'$12,294'},
        {lbl:'Advertising', val:'-$4,088', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-$1,281', color:'red'},
        {lbl:'COGS', val:'-$4,182', color:'red'},
        {lbl:'Other adjustments', val:'-$8', color:'red'},
        {lbl:'Net Profit', val:'$2,735', color:'green', strong:true}
      ] },
      mkt: [
        {name:'United States',flag:'us',revenue:'$12,294',adspend:'$4,088',net:'$2,735',netColor:'green',margin:'22.2%',marginCls:'ba'}
      ],
      statement: {
        fixedLabel: 'Aug–Oct 2026 (3-month) · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag, so the most recent ~2 weeks may be understated until settlement completes.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$14,462', pct:'117.6%', unit:'$116.63'},
            {lbl:'Refunds & returns', amount:'-$1,771', pct:'-14.4%', unit:'-$14.28'},
            {lbl:'Promotions & coupons', amount:'-$50', pct:'-0.4%', unit:'-$0.40'},
            {lbl:'Reimbursements & other income', amount:'$548', pct:'4.5%', unit:'$4.42'},
            {lbl:'Net revenue', amount:'$12,294', pct:'100.0%', unit:'$99.14', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$4,088', pct:'33.3%', unit:'$32.97'},
            {lbl:'Selling fees', amount:'$351', pct:'2.9%', unit:'$2.83'},
            {lbl:'Shipping & fulfilment fees', amount:'$929', pct:'7.6%', unit:'$7.49'},
            {lbl:'Cost of goods', amount:'$4,182', pct:'34.0%', unit:'$33.72'},
            {lbl:'Refund/return handling', amount:'$8', pct:'0.1%', unit:'$0.07'},
            {lbl:'Total expenses', amount:'$9,559', pct:'77.8%', unit:'$77.09', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$2,735', pct:'22.2%', unit:'$22.06', total:true, profit:true},
            {lbl:'Profit %', amount:'22.2%', accent:'amber'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'28.1%'},
            {lbl:'Ad spend (console)', amount:'$3,817'}
          ] }
        ]
      }
    } },
  },
  // ===== Since Launch = Mar–Oct 2026 (first sale Mar 2026) =====
  '6m': {
    label: 'Since Launch · Mar–Oct 2026', shortLabel: 'Since Launch',
    rev: '$36,510', revD: 'Since launch (Mar–Oct)', revC: 'du', revS: 'first sale Mar 2026',
    adSales: '$18,026', adSalesD: 'launch-to-date', adSalesC: 'df', adSalesS: '49.4% of revenue',
    tacos: '16.9%', tacosD: 'launch blended', tacosC: 'df', tacosS: 'ads live from Apr',
    roas: '2.93×', roasD: 'launch avg', roasC: 'df', roasS: '318 orders · AOV $115',
    spend: '$6,155', spendD: 'launch-to-date', spendC: 'df', spendS: 'ads started Apr 2026',
    tacosAd: '16.9%', tacosAdD: 'launch blended', tacosAdC: 'df', tacosAdS: 'Aug–Oct efficiency dipped',
    roasAd: '2.93×', roasAdD: 'launch avg', roasAdC: 'df', roasAdS: '$36,510 revenue',
    aov: '$115', aovD: 'launch avg', aovC: 'df', aovS: '318 orders total',
    mktRows: [
      ['Amazon US','us','$6,700','$6,155','bg','▼ $545 under','$36,510','ba','16.9%'],
      ['Total US',null,'$6,700','$6,155','bg','92% utilised','$36,510','ba','16.9%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'],
      series: [ { color:'#404935', values:[0,318,2773,4636,2961,2572,2814,1952] }, { color:'#a7ab90', values:[4191,1349,2593,2758,1350,1221,2189,2833] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311,3793,5003,4785],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,981,1141,1357,1320],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311,3793,5003,4785],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,981,1141,1357,1320],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$18.0k',acos:'34.1%'} ] },
    // Amazon P&L for the Since-Launch window (Mar–Oct settled; Mar–Jun carried from the prior bake, Jul–Oct
    // re-pulled this run). Settled captures the Mar–Apr launch months.
    sec: { pnl: {
      summary: [ {val:'$29,460',lbl:'Net Revenue',color:'brand'}, {val:'$18,056',lbl:'Total Costs',color:'red'}, {val:'$11,404',lbl:'Net Profit',color:'green'} ],
      margin: { pct:'38.7%', pctColor:'green', note:'Since Launch · Mar–Oct 2026 · financial basis (MerchantSpring, settled) · US channel', rows:[
        {lbl:'Net Revenue', val:'$29,460'},
        {lbl:'Advertising', val:'-$5,781', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-$4,079', color:'red'},
        {lbl:'COGS', val:'-$8,160', color:'red'},
        {lbl:'Other adjustments', val:'-$36', color:'red'},
        {lbl:'Net Profit', val:'$11,404', color:'green', strong:true}
      ] },
      mkt: [
        {name:'United States',flag:'us',revenue:'$29,460',adspend:'$5,781',net:'$11,404',netColor:'green',margin:'38.7%',marginCls:'bg'}
      ],
      statement: {
        fixedLabel: 'Since Launch · Mar–Oct 2026 · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag, so the most recent ~2 weeks may be understated until settlement completes.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$35,394', pct:'120.1%', unit:'$104.71'},
            {lbl:'Refunds & returns', amount:'-$3,316', pct:'-11.3%', unit:'-$9.81'},
            {lbl:'Promotions & coupons', amount:'-$1,278', pct:'-4.3%', unit:'-$3.78'},
            {lbl:'Reimbursements & other income', amount:'$729', pct:'2.5%', unit:'$2.16'},
            {lbl:'Net revenue', amount:'$29,460', pct:'100.0%', unit:'$87.16', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$5,781', pct:'19.6%', unit:'$17.10'},
            {lbl:'Selling fees', amount:'$1,942', pct:'6.6%', unit:'$5.75'},
            {lbl:'Shipping & fulfilment fees', amount:'$2,137', pct:'7.3%', unit:'$6.32'},
            {lbl:'Cost of goods', amount:'$8,160', pct:'27.7%', unit:'$24.14'},
            {lbl:'Refund/return handling', amount:'$34', pct:'0.1%', unit:'$0.10'},
            {lbl:'Total expenses', amount:'$18,056', pct:'61.3%', unit:'$53.42', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$11,404', pct:'38.7%', unit:'$33.74', total:true, profit:true},
            {lbl:'Profit %', amount:'38.7%', accent:'green'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'16.9%'},
            {lbl:'Ad spend (console)', amount:'$6,155'}
          ] }
        ]
      }
    } },
  },
  },

  // ---- Deep-page content (rendered once at boot; October 2026 snapshot) ----
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
      // Featured-offer (Buy Box) — Oct 2026 per-listing rates from the trafficAndConversion report (skus view,
      // by ASIN); channel-level headline 99.6% from getSalesByPeriod (Sep 99.7%).
      buyBox: [
        {label:'Magnostream Single', pct:99.6, valText:'99.6%', color:'green'},
        {label:'Magnostream Pro', pct:99.7, valText:'99.7%', color:'green'},
        {label:'Magnostream Pack of 3', pct:100, valText:'100%', color:'green'},
        {label:'Magnostream Pack of 2', pct:100, valText:'100%', color:'green'}
      ],
      buyBoxHeadline: { pctTxt:'99.6%', delta:'▼ 0.1pp vs September', deltaCls:'dd' },
      cvr: { val:'2.6%', note:'October 2026 · 1,626 sessions', sub:'US · session conversion' },
      // FBA stock warnings = real MerchantSpring product report (qty + days-cover per ASIN, 05 Oct 2026).
      // All 5 live ASINs are under ~150 days cover; Pack of 3 (42d) is the most urgent.
      // ---- Overview cards — baked WEEKLY (config.overviewSource:'notion'; runbook tools/weekly-overview.routine.md) ----
      // First baked 12 Oct 2026 (review used as approved for this run by Ryan's instruction). The sheet-era
      // tasksSpec / flagsSpec / completedSpec above are ignored while overviewSource is 'notion'.
      // healthMgmtSpec ← "Abimax — Client Notes (dashboard & reports)" task › Account Health (Approved — Solei, 5 Nov 2026; based on the 02 Nov 2026 Account Health Review);
      //                  includes the ✅ Healthy line for US (SOP rule). No Done lines this week.
      // adsStrategySpec ← same task › Advertising (fixed format: Overall, Best seller, Conversion, Flags, Budget + 2 Done).
      // stockWarn      ← Abimax_US_sku-sync_2026-11-02 (MerchantSpring, 3 Oct–1 Nov 2026, FBA). Thresholds ≤45d / soon ≤120d.
      //                  Magno-PRO-002 (0 stock since 19 Feb, no sales) and the Bundle (no sale since 20 Sep) left off.
      healthMgmtSpec: { badge:'1 open', subLabel:'Weekly review · 2 Nov 2026', items:[
        {level:'amber',title:'US — Deals',sub:'In progress · Amazon\'s Black Friday deal submissions close on 13 Nov'},
        {level:'green',title:'US — Account Health',sub:'Healthy · all metrics within Amazon\'s targets'}
      ] },
      adsStrategySpec: { badge:'TACoS on goal', subLabel:'Weekly review · 4 Nov 2026', items:[
        {level:'amber',title:'US — Flags',sub:'In progress · Magnostream Pro ads are paused as they cost more than the sales they brought in (Oct); reviewed weekly'},
        {level:'muted',title:'US — Overall',sub:'TACoS 25.5% (4 weeks to 21 Oct) against a 25% goal; sales $5,307, up 31%'},
        {level:'muted',title:'US — Best seller',sub:'Magnostream Pro, $2,227 from 8 units (3 Oct–1 Nov, incl. tax)'},
        {level:'muted',title:'US — Conversion',sub:'2.6% US session conversion (October 2026, 1,626 sessions)'},
        {level:'muted',title:'US — Budget',sub:'November budget $1,600; $49 spent 1–3 Nov'},
        {level:'green',title:'US — MAGNO-PRO ads paused',sub:'Done 29 Oct'},
        {level:'green',title:'US — Magnostream keyword campaign widened',sub:'Done 22 Oct'}
      ] },
      stockWarn: { title:'&#128230; Logistics &amp; Operations', badge:'3 stock-up · 0 OOS', subLabel:'SKU sync · US FBA stock · 2 Nov 2026', items:[
        {level:'amber',title:'Magnostream Pro — stock-up soon',sub:'B0GGRJKS2D · ~49 days cover · 13 units'},
        {level:'amber',title:'Magnostream Pack of 2 — stock-up soon',sub:'B0GLPQ6YZ4 · ~54 days cover · 9 units'},
        {level:'amber',title:'Magnostream Single — stock-up soon',sub:'B0GLT2LYKY · ~68 days cover · 54 units'},
        {level:'muted',title:'Magnostream — stock-up shipment arriving',sub:'At Amazon and being checked in · 35 of 124 units received (2 Nov)'}
      ] }
    },
    // P&L is ACTIVE for Abimax (Executive tier, Sep 2026) — full MerchantSpring financial P&L, built
    // PER TIMELINE. This top-level sections.pnl is the "Last Month" (October) statement; the 3-month
    // (Aug–Oct) and Since-Launch (Mar–Oct) statements live on dateRanges['3m'].sec.pnl /
    // dateRanges['6m'].sec.pnl. Each carries its own fixedLabel so the page re-renders per period.
    // Basis: getStoreProfitAndLoss, profitabilityView 'settled' (cash basis), includeTax, pulled per
    // month then summed for the multi-month windows (the endpoint is 31-day-capped). SETTLED is used,
    // not accrual/"deferred": MerchantSpring's accrual P&L has no data for the Mar–Apr launch months
    // (returns ~$0), whereas settled has the complete launch-to-date history (Mar sales $4,186 ties to
    // the $4,191 order-date figure). Settled is settlement-timed, so a month's P&L revenue won't tie
    // exactly to that month's order-date sales KPI shown elsewhere — expected for a cash-basis P&L.
    // MerchantSpring's own totalRevenue/totalExpenses drive the summary + totals; itemized rows don't
    // always foot to the top-line (a known MerchantSpring gap). "Ad spend (console)" in Metrics is the
    // order-date figure from the Advertising page, shown for cross-reference. Oct 2026 (settled):
    // sales $6,035 · refunds -$1,061 · net rev $4,697 · ad(settlement) $1,415 · selling $215 · shipping $374
    // · COGS $1,806 · handling $8 · net profit $879 (18.7%).
    pnl: {
      summary: [ {val:'$4,697',lbl:'Net Revenue',color:'brand'}, {val:'$3,819',lbl:'Total Costs',color:'red'}, {val:'$879',lbl:'Net Profit',color:'green'} ],
      margin: { pct:'18.7%', pctColor:'red', note:'October 2026 (31-day) · financial basis (MerchantSpring, settled) · US channel', rows:[
        {lbl:'Net Revenue', val:'$4,697'},
        {lbl:'Advertising', val:'-$1,415', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-$589', color:'red'},
        {lbl:'COGS', val:'-$1,806', color:'red'},
        {lbl:'Other adjustments', val:'-$8', color:'red'},
        {lbl:'Net Profit', val:'$879', color:'green', strong:true}
      ] },
      mkt: [
        {name:'United States',flag:'us',revenue:'$4,697',adspend:'$1,415',net:'$879',netColor:'green',margin:'18.7%',marginCls:'br'}
      ],
      statement: {
        fixedLabel: 'October 2026 (1–31) · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag, so the most recent ~2 weeks may be understated until settlement completes.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$6,035', pct:'128.5%', unit:'$143.68'},
            {lbl:'Refunds & returns', amount:'-$1,061', pct:'-22.6%', unit:'-$25.26'},
            {lbl:'Promotions & coupons', amount:'-$19', pct:'-0.4%', unit:'-$0.44'},
            {lbl:'Reimbursements & other income', amount:'$96', pct:'2.0%', unit:'$2.29'},
            {lbl:'Net revenue', amount:'$4,697', pct:'100.0%', unit:'$111.84', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$1,415', pct:'30.1%', unit:'$33.70'},
            {lbl:'Selling fees', amount:'$215', pct:'4.6%', unit:'$5.11'},
            {lbl:'Shipping & fulfilment fees', amount:'$374', pct:'8.0%', unit:'$8.90'},
            {lbl:'Cost of goods', amount:'$1,806', pct:'38.5%', unit:'$43.00'},
            {lbl:'Refund/return handling', amount:'$8', pct:'0.2%', unit:'$0.20'},
            {lbl:'Total expenses', amount:'$3,819', pct:'81.3%', unit:'$90.92', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$879', pct:'18.7%', unit:'$20.92', total:true, profit:true},
            {lbl:'Profit %', amount:'18.7%', accent:'red'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'27.6%'},
            {lbl:'Ad spend (console)', amount:'$1,320'}
          ] }
        ]
      }
    },
    advertising: {
      // Real October 2026 ad totals (MerchantSpring channel report, US channel, USD). ACOS/ROAS/TACOS
      // are the channel-attributed figures (spend $1,320 · ad sales $1,952 → ACOS 67.6% · ROAS 1.48×).
      // ⚠️ ROAS below Abimax's earlier ~5–7× efficient band for a 4th straight month — see top-of-file note.
      metrics: [
        {lbl:'Total Spend',  val:'$1,320', id:'a-spend'},
        {lbl:'Ad Sales',     val:'$1,952', color:'brand'},
        {lbl:'ACOS',         val:'67.6%',  color:'red', id:'a-tacos'},
        {lbl:'ROAS',         val:'1.48×',  color:'red', id:'a-roas'},
        {lbl:'Impressions',  val:'177.8K'},
        {lbl:'Avg. CPC',     val:'$1.13'}
      ],
      // No budget sheet for Abimax yet — a working monthly ad budget is tracked vs the real actual
      // ($1,000 Jul → $1,200 Aug → $1,400 Sep → $1,600 Oct). Goes live if/when an Apps Script budget proxy is added.
      budgets: {
        subLabel: 'October 2026 · budget vs actual',
        headers: ['Monthly Budget','October Actual','Variance','Utilisation'],
        rows: [
          {name:'United States', flag:'us', cells:['$1,600','$1,320','▼ $280 under','82%']},
          {name:'Total', total:true,        cells:['$1,600','$1,320','▼ $280 under','82%']}
        ]
      },
      // Forward ad budget (working plan; no sheet forecast yet). Given the 4-month efficiency decline
      // (ROAS 1.48×, TACOS 27.6%) the reviewer may want to revisit this progression rather than keep
      // scaling spend — left mechanical (+$200/month) pending that call.
      forecast: [
        {month:'Nov', budget:'$1,800', pct:100, tacos:'<15%', tacosColor:'amber', roas:'—', opacity:0.7},
        {month:'Dec', budget:'$2,000', pct:100, tacos:'<15%', tacosColor:'amber', roas:'—', opacity:0.6}
      ],
      // Per-ASIN Sponsored Products campaigns (October 2026). Spend, CPC, sales, ACOS and ROAS are REAL
      // per-SKU actuals from the MerchantSpring product report (getSalesByProduct), NOT allocated from the
      // channel total (spend-share allocation would show an identical ACOS on every row and hide that Pro
      // and Single are inefficient). Σ spend ($1,320) foots to the headline; Σ sales ($732) does NOT foot to
      // the channel-attributed headline Ad Sales ($1,952) — MerchantSpring's per-product and channel
      // ad-attribution reports disagree (as in Aug/Sep); headline metrics above remain the
      // channel-attributed, self-consistent figures per the runbook (getSalesByPeriod).
      campaigns: [
        {name:'US · Magnostream Single — SP',type:'Sponsored Products',spend:'$642',sales:'$482',acos:'133.2%',acosCls:'br',roas:'0.8×',cpc:'$1.13',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pro — SP',type:'Sponsored Products',spend:'$602',sales:'$250',acos:'240.8%',acosCls:'br',roas:'0.4×',cpc:'$1.13',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 2 — SP',type:'Sponsored Products',spend:'$40',sales:'$0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'$1.22',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 3 — SP',type:'Sponsored Products',spend:'$36',sales:'$0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'$1.15',status:'Active',statusCls:'bg'}
      ]
    },
    inventory: {
      // Real FBA stock snapshot from the MerchantSpring product report (qty + days-cover per ASIN, 05 Nov
      // 2026). 5 live ASINs. Stock-up watch = under ~90 days cover (Pro, Pack of 2, Single); none under 45
      // days. The Bundle has no days-cover figure (no sale since 20 Sep). No dispatch-rate source → the
      // Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'5',dCls:'df',d:'ASINs · 0 OOS',s:'all live ASINs in stock'},
        {bar:'#404935',lbl:'Units on Hand',val:'92',dCls:'dd',d:'FBA total',s:'across 5 SKUs · 128 in Sep'},
        {bar:'red',lbl:'Stock-up Watch',val:'3',dCls:'dd',d:'stock-up soon / now',s:'0 urgent · Pro lowest (49d)'},
        {bar:'green',lbl:'Buy Box (Oct)',val:'99.6%',dCls:'dd',d:'featured-offer %',s:'vs 99.7% Sep'}
      ],
      stock: [
        {dot:'da',name:'Magnostream Pro — Heavy-Duty Descaler',note:'B0GGRJKS2D · US · top revenue SKU',units:'13 units',days:'~49 days',unitsColor:'amber'},
        {dot:'da',name:'Magnostream Pack of 2',note:'B0GLPQ6YZ4 · US',units:'9 units',days:'~54 days',unitsColor:'amber'},
        {dot:'da',name:'Magnostream Single Descaler',note:'B0GLT2LYKY · US · best seller by units',units:'56 units',days:'~76 days',unitsColor:'amber'},
        {dot:'dg',name:'Magnostream Pack of 3',note:'B0GLPWZCRV · US',units:'12 units',days:'~120 days'},
        {dot:'da',name:'Magnostream Multi-Unit Bundle',note:'B0GH7YKPZJ · US · slow mover (no sale since 20 Sep)',units:'2 units',days:'n/a',unitsColor:'amber'}
      ],
      restock: [
        {level:'amber', title:'Magnostream Pro — stock-up soon', sub:'B0GGRJKS2D · ~49 days cover · 13 units · top revenue SKU'},
        {level:'amber', title:'Magnostream Pack of 2 — stock-up soon', sub:'B0GLPQ6YZ4 · ~54 days cover · 9 units'},
        {level:'amber', title:'Magnostream Single — stock-up soon', sub:'B0GLT2LYKY · ~76 days cover · 56 units · best-seller by units'}
      ]
    },
    products: {
      // KPIs + by-market table + groups below are the static (last-month) fallback — same pattern as
      // Balance 8/NKV/AMACX. kpisByPeriod/tableByPeriod/groupsByPeriod (added 19 Oct 2026) are what
      // app.js reads first; keep all three periods (may/3m/6m) in step on every rebake.
      // Per-product session CVR sourced the same way as Balance 8/NKV/AMACX:
      // generateReport(report_type:'trafficAndConversion', view:'skus') — getSalesByProduct has no
      // per-SKU session count. Pulled 5 Nov 2026 (unitsPerSession); thresholds ≥10% green, 4–9.99% amber, <4% red.
      // adSpend/TACOS are getSalesByProduct's own per-SKU fields (bg<20% / ba 20–40% / br>40%, same
      // bands NKV documents). B0GLPPDS1M (unlaunched variant) excluded throughout, as before.
      // Group sales use largest-remainder rounding so each period's Σ equals its headline revenue exactly.
      // October: the Multi-Unit Bundle sold nothing, so it is not listed for the last-month view.
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'4',dCls:'dd',d:'sold in Oct',s:'4 of 5 tracked SKUs sold'},
        {bar:'var(--green)',lbl:'Top Product Rev.',val:'$2,778',dCls:'dd',d:'Magnostream Pro',s:'58% of Oct sales'},
        {bar:'var(--blue)',lbl:'Orders (Oct)',val:'40',dCls:'dd',d:'▼ 13.0% MoM',s:'46 orders Sep'},
        {bar:'var(--amber)',lbl:'ASP',val:'$114',dCls:'du',d:'▲ 7.0% MoM',s:'per unit'}
      ],
      kpisByPeriod: {
        may: { all: [
          {bar:'#404935',lbl:'Active SKUs',val:'4',dCls:'dd',d:'sold in Oct',s:'4 of 5 tracked SKUs sold'},
          {bar:'var(--green)',lbl:'Top Product Rev.',val:'$2,778',dCls:'dd',d:'Magnostream Pro',s:'58% of Oct sales'},
          {bar:'var(--blue)',lbl:'Orders (Oct)',val:'40',dCls:'dd',d:'▼ 13.0% MoM',s:'46 orders Sep'},
          {bar:'var(--amber)',lbl:'ASP',val:'$114',dCls:'du',d:'▲ 7.0% MoM',s:'per unit'}
        ] },
        '3m': { all: [
          {bar:'#404935',lbl:'Active SKUs',val:'5',dCls:'df',d:'sold in Aug–Oct',s:'all 5 tracked SKUs sold'},
          {bar:'var(--green)',lbl:'Top Product Rev.',val:'$6,161',dCls:'df',d:'Magnostream Pro',s:'45% of 3-month sales'},
          {bar:'var(--blue)',lbl:'Orders (3m)',val:'120',dCls:'df',d:'3-month total',s:'Aug 34 · Sep 46 · Oct 40'},
          {bar:'var(--amber)',lbl:'ASP',val:'$110',dCls:'df',d:'3-month ASP',s:'per unit'}
        ] },
        '6m': { all: [
          {bar:'#404935',lbl:'Active SKUs',val:'5',dCls:'df',d:'sold since launch',s:'all 5 tracked SKUs sold'},
          {bar:'var(--green)',lbl:'Top Product Rev.',val:'$14,619',dCls:'df',d:'Magnostream Pro',s:'40% of launch-to-date sales'},
          {bar:'var(--blue)',lbl:'Orders (6m)',val:'318',dCls:'df',d:'launch-to-date',s:'Mar–Oct 2026'},
          {bar:'var(--amber)',lbl:'ASP',val:'$108',dCls:'df',d:'launch ASP',s:'per unit'}
        ] }
      },
      table: [
        {name:'United States',flag:'us',revenue:'$4,785',units:'42',orders:'40',cvr:'2.6%',cvrCls:'br',aov:'$119.63'}
      ],
      // Market-level (session) CVR = units ÷ sessions summed across all 5 tracked SKUs from the same
      // trafficAndConversion pull as the per-product CVR below: may 42/1,625=2.6%, 3m 124/4,822=2.6%,
      // 6m 338/9,351=3.6%.
      tableByPeriod: {
        may: [ {name:'United States',flag:'us',revenue:'$4,785',units:'42',orders:'40',cvr:'2.6%',cvrCls:'br',aov:'$119.63'} ],
        '3m': [ {name:'United States',flag:'us',revenue:'$13,582',units:'124',orders:'120',cvr:'2.6%',cvrCls:'br',aov:'$113.18'} ],
        '6m': [ {name:'United States',flag:'us',revenue:'$36,510',units:'338',orders:'318',cvr:'3.6%',cvrCls:'br',aov:'$114.81'} ]
      },
      // October 2026 sales by product variant (real MerchantSpring product report, US channel). % = share
      // of October product sales (Σ = $4,785, ties to headline revenue).
      groups: [
        {name:'Magnostream Pro — Heavy-Duty',sales:'$2,778',units:10,pct:'58%',adSpend:'$602',tacos:'21.7%',tacosCls:'ba',cvr:'1.4%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Single',sales:'$1,133',units:24,pct:'24%',adSpend:'$642',tacos:'56.7%',tacosCls:'br',cvr:'3.2%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Pack of 2',sales:'$553',units:6,pct:'12%',adSpend:'$40',tacos:'7.3%',tacosCls:'bg',cvr:'8.2%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Pack of 3',sales:'$321',units:2,pct:'7%',adSpend:'$36',tacos:'11.1%',tacosCls:'bg',cvr:'2.7%',cvrCls:'br',oosRate:'0%',oosCls:'bg'}
      ],
      groupsByPeriod: {
        may: { all: [
          {name:'Magnostream Pro — Heavy-Duty',sales:'$2,778',units:10,pct:'58%',adSpend:'$602',tacos:'21.7%',tacosCls:'ba',cvr:'1.4%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'Magnostream Single',sales:'$1,133',units:24,pct:'24%',adSpend:'$642',tacos:'56.7%',tacosCls:'br',cvr:'3.2%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'Magnostream Pack of 2',sales:'$553',units:6,pct:'12%',adSpend:'$40',tacos:'7.3%',tacosCls:'bg',cvr:'8.2%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'Magnostream Pack of 3',sales:'$321',units:2,pct:'7%',adSpend:'$36',tacos:'11.1%',tacosCls:'bg',cvr:'2.7%',cvrCls:'br',oosRate:'0%',oosCls:'bg'}
        ] },
        '3m': { all: [
          {name:'Magnostream Pro — Heavy-Duty',sales:'$6,161',units:21,pct:'45%',adSpend:'$1,906',tacos:'30.9%',tacosCls:'ba',cvr:'0.9%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'Magnostream Single',sales:'$3,647',units:72,pct:'27%',adSpend:'$1,640',tacos:'45.0%',tacosCls:'br',cvr:'3.6%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'Magnostream Pack of 3',sales:'$1,871',units:14,pct:'14%',adSpend:'$123',tacos:'6.6%',tacosCls:'bg',cvr:'6.2%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'Magnostream Pack of 2',sales:'$1,522',units:16,pct:'11%',adSpend:'$148',tacos:'9.7%',tacosCls:'bg',cvr:'6.0%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'Magnostream Multi-Unit Bundle',sales:'$381',units:1,pct:'3%',adSpend:'$0',tacos:'0.0%',tacosCls:'bg',cvr:'2.7%',cvrCls:'br',oosRate:'0%',oosCls:'bg'}
        ] },
        '6m': { all: [
          {name:'Magnostream Pro — Heavy-Duty',sales:'$14,619',units:47,pct:'40%',adSpend:'$2,897',tacos:'19.8%',tacosCls:'bg',cvr:'1.3%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'Magnostream Single',sales:'$11,945',units:215,pct:'33%',adSpend:'$2,851',tacos:'23.9%',tacosCls:'ba',cvr:'4.6%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'Magnostream Pack of 3',sales:'$5,055',units:35,pct:'14%',adSpend:'$184',tacos:'3.6%',tacosCls:'bg',cvr:'7.4%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'Magnostream Pack of 2',sales:'$4,092',units:39,pct:'11%',adSpend:'$223',tacos:'5.4%',tacosCls:'bg',cvr:'7.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'Magnostream Multi-Unit Bundle',sales:'$799',units:2,pct:'2%',adSpend:'$0',tacos:'0.0%',tacosCls:'bg',cvr:'2.1%',cvrCls:'br',oosRate:'0%',oosCls:'bg'}
        ] }
      }
    }
  }
};

/* PREV-MONTH-START — month-on-month comparison rows for the Products tables (September 2026); see tools/bake-prev-month.js */
(function () { var P = window.DASHBOARD_DATA && window.DASHBOARD_DATA.sections && window.DASHBOARD_DATA.sections.products;
  if (P) P.prevMonth = {"table":[{"name":"United States","flag":"us","revenue":"$5,003","units":"47","orders":"46","cvr":"2.8%","cvrCls":"br","aov":"$108.77"}],"groups":{"all":[{"name":"Magnostream Pro — Heavy-Duty","sales":"$1,562","units":5,"pct":"31%","adSpend":"$632","tacos":"40.5%","tacosCls":"br","cvr":"0.6%","cvrCls":"br","oosRate":"0%","oosCls":"bg"},{"name":"Magnostream Single","sales":"$1,304","units":26,"pct":"26%","adSpend":"$593","tacos":"45.4%","tacosCls":"br","cvr":"4.0%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"Magnostream Pack of 3","sales":"$1,276","units":10,"pct":"25%","adSpend":"$57","tacos":"4.4%","tacosCls":"bg","cvr":"11.2%","cvrCls":"bg","oosRate":"0%","oosCls":"bg"},{"name":"Magnostream Pack of 2","sales":"$480","units":5,"pct":"10%","adSpend":"$76","tacos":"15.8%","tacosCls":"bg","cvr":"4.6%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"Magnostream Multi-Unit Bundle","sales":"$381","units":1,"pct":"8%","adSpend":"$0","tacos":"0.0%","tacosCls":"bg","cvr":"9.1%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"}]}}; })();
/* PREV-MONTH-END */
