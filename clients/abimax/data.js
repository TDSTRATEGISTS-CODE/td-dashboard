/* Abimax — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 05 Oct 2026 (channel 106785689, seller A267LLT9LT0HS9),
   Amazon US, native USD. Single brand: "Magnostream" magnetic water descalers. The store launched on
   Amazon US in March 2026 (first sale Mar 2026) and is scaling — so "Since Launch" (6m key = Mar–Sep)
   is the widest window; there is no pre-March history to show.
   dataSource.type is 'appsScript' (overlay:'sections' — live Overview scope board only).

   Monthly actuals used to build every window (getSalesByPeriod, interval M, America/Los_Angeles):
     Mar  $4,190.91 · 36 ord · 41 u · 367 sess · BuyBox 86.5% · no ads
     Apr  $1,666.95 · 17 ord · 18 u · 391 sess · BuyBox 93.2% · spend $196.70 · adSales $318.50 · ACOS 61.8% · TACOS 11.8%
     May  $5,365.67 · 58 ord · 65 u · 1,118 sess · BuyBox 98.4% · spend $404.08 · adSales $2,773.50 · ACOS 14.6% · TACOS 7.5%
     Jun  $7,393.72 · 54 ord · 55 u · 1,351 sess · BuyBox 99.1% · spend $758.86 · adSales $4,636.00 · ACOS 16.4% · TACOS 10.3%
     Jul  $4,311.39 · 33 ord · 35 u · 1,351 sess · BuyBox 98.9% · spend $978.59 · adSales $2,960.95 · ACOS 33.0% · TACOS 22.7%
     Aug  $3,793.27 · 34 ord · 35 u · 1,522 sess · BuyBox 99.4% · spend $1,140.53 · adSales $2,571.82 · ACOS 44.4% · TACOS 30.1%
     Sep  $5,003.35 · 46 ord · 47 u · 1,678 sess · BuyBox 99.7% · spend $1,363.92 · adSales $2,813.70 · ACOS 48.5% · TACOS 27.3%
   (Aug ad spend was $1,146.15 in the prior bake; MerchantSpring now reports $1,140.53 — late attribution
   restatement. Aug is shown at the restated figure in all windows.)

   ⚠️ NEEDS REVIEW — Sep 2026 self-check flag: ROAS is 2.06× (Aug 2.25×, Jul 3.02×, Jun 6.11×) — a THIRD
   consecutive month below Abimax's plausible ~5–7× efficient-ROAS band — and TACOS is 27.3% (target <15%).
   Revenue itself rebounded +31.9% MoM ($3,793 → $5,003; orders 34 → 46) but ad spend grew +19.6% while
   channel-attributed ad sales grew only +9.4% (56% of revenue vs 68% in Aug), so the extra revenue is
   largely organic. Per-SKU pull (getSalesByProduct): Magnostream Pro spent $636 for $580 attributed sales
   (ACOS 110%, ROAS 0.9×) and Single spent $594 for $650 (ACOS 91%); Pack of 3 was efficient (ACOS 11.6%, 8.6×
   on $58 spend). No stockout, price or Buy Box cause (Buy Box 99.7%). Also: Pro Pack of 2 (B0GLPPDS1M) has been
   out of stock since 19 Feb 2026 with no sales (not shown). Routed to human review per the monthly self-check
   gate (NOT pushed to main). Other notes: the "Multi-Unit Bundle" (B0GH7YKPZJ) reappeared in the product
   report and sold 1 unit ($381) in Sep — it is back in products/inventory below. Per-listing Buy Box (the
   trafficAndConversion report) was not pulled this run; the Buy Box headline uses the channel-level 99.7%.
   P&L Sep (settled): net rev $3,538 · expenses $2,814 · profit $724 (20.5%) — Sep refunds of $710 weigh on it.
   The prior-bake Aug settled P&L has since restated (COGS $788 → $1,086, expenses $2,627 → $2,926).

   NOTE: the shared app.js trend-chart axis formatter (moneyK) hardcodes '€' — KPI cards/tables here
   are all in $, but the two trend-chart Y-axes will display '€' until the template adds a currency
   option (same known limitation noted in NKV's data.js). */
window.DASHBOARD_DATA = {
  dateRanges: {
  // ===== Last Month = September 2026 =====
  'may': {
    label: 'September 2026', shortLabel: 'September 2026',
    rev: '$5,003', revD: '▲ 31.9% MoM', revC: 'du', revS: 'vs $3,793 August',
    adSales: '$2,814', adSalesD: '▲ 9.4% MoM', adSalesC: 'du', adSalesS: '56.2% of revenue',
    tacos: '27.3%', tacosD: '▼ 2.8pp vs August', tacosC: 'du', tacosS: 'Target <15%',
    roas: '2.06×', roasD: '▼ 0.19× vs August', roasC: 'dd', roasS: '46 orders · AOV $109',
    spend: '$1,364', spendD: '▲ 19.6% MoM', spendC: 'dd', spendS: 'vs $1,141 August · efficiency down',
    tacosAd: '27.3%', tacosAdD: '▼ 2.8pp vs August', tacosAdC: 'du', tacosAdS: 'Target <15%',
    roasAd: '2.06×', roasAdD: '▼ 0.19× vs August', roasAdC: 'dd', roasAdS: '$5,003 revenue',
    aov: '$109', aovD: '▼ 2.5% MoM', aovC: 'dd', aovS: '46 orders Sep',
    mktRows: [
      ['Amazon US','us','$1,400','$1,364','bg','▼ $36 under','$5,003','br','27.3%'],
      ['Total US',null,'$1,400','$1,364','bg','97% utilised','$5,003','br','27.3%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Sep'],
      series: [ { color:'#404935', values:[2814] }, { color:'#a7ab90', values:[2189] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Apr','May','Jun','Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[1667,5366,7394,4311,3793,5003],main:true,area:true}, {color:'#a7ab90',values:[197,404,759,981,1141,1364],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Apr','May','Jun','Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[1667,5366,7394,4311,3793,5003],main:true,area:true}, {color:'#a7ab90',values:[197,404,759,981,1141,1364],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$2.8k',acos:'48.5%'} ] },
  },
  // ===== Last 3 Months = Jul–Sep 2026 =====
  '3m': {
    label: 'Jul–Sep 2026', shortLabel: 'Jul–Sep 2026',
    rev: '$13,108', revD: '3-month actuals', revC: 'du', revS: 'Jul $4,311 · Aug $3,793 · Sep $5,003',
    adSales: '$8,346', adSalesD: '3-month total', adSalesC: 'df', adSalesS: '63.7% of revenue',
    tacos: '26.6%', tacosD: '3-month blended', tacosC: 'df', tacosS: 'Target <15%',
    roas: '2.40×', roasD: '3-month avg', roasC: 'df', roasS: '113 orders · AOV $116',
    spend: '$3,483', spendD: '3-month total', spendC: 'df', spendS: 'Jul $979 · Aug $1,141 · Sep $1,364',
    tacosAd: '26.6%', tacosAdD: '3-month blended', tacosAdC: 'df', tacosAdS: 'Well above Jun-and-earlier levels',
    roasAd: '2.40×', roasAdD: '3-month avg', roasAdC: 'df', roasAdS: '$13,108 revenue',
    aov: '$116', aovD: '3-month avg', aovC: 'df', aovS: '113 orders total',
    mktRows: [
      ['Amazon US','us','$3,600','$3,483','bg','▼ $117 under','$13,108','br','26.6%'],
      ['Total US',null,'$3,600','$3,483','bg','97% utilised','$13,108','br','26.6%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Jul','Aug','Sep'],
      series: [ { color:'#404935', values:[2961,2572,2814] }, { color:'#a7ab90', values:[1350,1221,2189] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4311,3793,5003],main:true,area:true}, {color:'#a7ab90',values:[981,1141,1364],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4311,3793,5003],main:true,area:true}, {color:'#a7ab90',values:[981,1141,1364],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$8.3k',acos:'41.7%'} ] },
    // Amazon P&L for the 3-month window (Jul+Aug+Sep settled, summed — see sections.pnl note on basis).
    sec: { pnl: {
      summary: [ {val:'$11,371',lbl:'Net Revenue',color:'brand'}, {val:'$8,201',lbl:'Total Costs',color:'red'}, {val:'$3,170',lbl:'Net Profit',color:'green'} ],
      margin: { pct:'27.9%', pctColor:'amber', note:'Jul–Sep 2026 (3-month) · financial basis (MerchantSpring, settled) · US channel', rows:[
        {lbl:'Net Revenue', val:'$11,371'},
        {lbl:'Advertising', val:'-$3,525', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-$1,170', color:'red'},
        {lbl:'COGS', val:'-$3,504', color:'red'},
        {lbl:'Other adjustments', val:'-$2', color:'red'},
        {lbl:'Net Profit', val:'$3,170', color:'green', strong:true}
      ] },
      mkt: [
        {name:'United States',flag:'us',revenue:'$11,371',adspend:'$3,525',net:'$3,170',netColor:'green',margin:'27.9%',marginCls:'ba'}
      ],
      statement: {
        fixedLabel: 'Jul–Sep 2026 (3-month) · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag, so the most recent ~2 weeks may be understated until settlement completes.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$12,839', pct:'112.9%', unit:'$109.73'},
            {lbl:'Refunds & returns', amount:'-$1,155', pct:'-10.2%', unit:'-$9.87'},
            {lbl:'Promotions & coupons', amount:'-$62', pct:'-0.5%', unit:'-$0.53'},
            {lbl:'Reimbursements & other income', amount:'$531', pct:'4.7%', unit:'$4.53'},
            {lbl:'Net revenue', amount:'$11,371', pct:'100.0%', unit:'$97.19', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$3,525', pct:'31.0%', unit:'$30.13'},
            {lbl:'Selling fees', amount:'$392', pct:'3.5%', unit:'$3.35'},
            {lbl:'Shipping & fulfilment fees', amount:'$778', pct:'6.8%', unit:'$6.65'},
            {lbl:'Cost of goods', amount:'$3,504', pct:'30.8%', unit:'$29.95'},
            {lbl:'Refund/return handling', amount:'$2', pct:'0.0%', unit:'$0.01'},
            {lbl:'Total expenses', amount:'$8,201', pct:'72.1%', unit:'$70.09', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$3,170', pct:'27.9%', unit:'$27.09', total:true, profit:true},
            {lbl:'Profit %', amount:'27.9%', accent:'amber'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'26.6%'},
            {lbl:'Ad spend (console)', amount:'$3,483'}
          ] }
        ]
      }
    } },
  },
  // ===== Since Launch = Mar–Sep 2026 (first sale Mar 2026) =====
  '6m': {
    label: 'Since Launch · Mar–Sep 2026', shortLabel: 'Since Launch',
    rev: '$31,725', revD: 'Since launch (Mar–Sep)', revC: 'du', revS: 'first sale Mar 2026',
    adSales: '$16,074', adSalesD: 'launch-to-date', adSalesC: 'df', adSalesS: '50.7% of revenue',
    tacos: '15.3%', tacosD: 'launch blended', tacosC: 'df', tacosS: 'ads live from Apr',
    roas: '3.32×', roasD: 'launch avg', roasC: 'df', roasS: '278 orders · AOV $114',
    spend: '$4,843', spendD: 'launch-to-date', spendC: 'df', spendS: 'ads started Apr 2026',
    tacosAd: '15.3%', tacosAdD: 'launch blended', tacosAdC: 'df', tacosAdS: 'Jul–Sep efficiency dipped',
    roasAd: '3.32×', roasAdD: 'launch avg', roasAdC: 'df', roasAdS: '$31,725 revenue',
    aov: '$114', aovD: 'launch avg', aovC: 'df', aovS: '278 orders total',
    mktRows: [
      ['Amazon US','us','$5,100','$4,843','bg','▼ $257 under','$31,725','ba','15.3%'],
      ['Total US',null,'$5,100','$4,843','bg','95% utilised','$31,725','ba','15.3%']
    ],
    revBreakChart: { max: 8000, yTicks: ['$8k','$6k','$4k','$2k','$0'], xLabels: ['Mar','Apr','May','Jun','Jul','Aug','Sep'],
      series: [ { color:'#404935', values:[0,319,2774,4636,2961,2572,2814] }, { color:'#a7ab90', values:[4191,1348,2592,2758,1350,1221,2189] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311,3793,5003],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,981,1141,1364],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:8000, yTicks:['$8k','$6k','$4k','$2k','$0'], xLabels:['Mar','Apr','May','Jun','Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[4191,1667,5366,7394,4311,3793,5003],main:true,area:true}, {color:'#a7ab90',values:[0,197,404,759,981,1141,1364],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'$16.1k',acos:'30.1%'} ] },
    // Amazon P&L for the Since-Launch window (Mar–Sep settled; Mar–Aug carried from the prior bake with
    // Aug refreshed to its current settled figures, + Sep). Settled captures the Mar–Apr launch months.
    sec: { pnl: {
      summary: [ {val:'$24,763',lbl:'Net Revenue',color:'brand'}, {val:'$14,238',lbl:'Total Costs',color:'red'}, {val:'$10,525',lbl:'Net Profit',color:'green'} ],
      margin: { pct:'42.5%', pctColor:'green', note:'Since Launch · Mar–Sep 2026 · financial basis (MerchantSpring, settled) · US channel', rows:[
        {lbl:'Net Revenue', val:'$24,763'},
        {lbl:'Advertising', val:'-$4,366', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-$3,490', color:'red'},
        {lbl:'COGS', val:'-$6,354', color:'red'},
        {lbl:'Other adjustments', val:'-$28', color:'red'},
        {lbl:'Net Profit', val:'$10,525', color:'green', strong:true}
      ] },
      mkt: [
        {name:'United States',flag:'us',revenue:'$24,763',adspend:'$4,366',net:'$10,525',netColor:'green',margin:'42.5%',marginCls:'bg'}
      ],
      statement: {
        fixedLabel: 'Since Launch · Mar–Sep 2026 · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag, so the most recent ~2 weeks may be understated until settlement completes.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$29,359', pct:'118.6%', unit:'$99.19'},
            {lbl:'Refunds & returns', amount:'-$2,255', pct:'-9.1%', unit:'-$7.62'},
            {lbl:'Promotions & coupons', amount:'-$1,260', pct:'-5.1%', unit:'-$4.26'},
            {lbl:'Reimbursements & other income', amount:'$633', pct:'2.6%', unit:'$2.14'},
            {lbl:'Net revenue', amount:'$24,763', pct:'100.0%', unit:'$83.66', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$4,366', pct:'17.6%', unit:'$14.75'},
            {lbl:'Selling fees', amount:'$1,727', pct:'7.0%', unit:'$5.83'},
            {lbl:'Shipping & fulfilment fees', amount:'$1,763', pct:'7.1%', unit:'$5.96'},
            {lbl:'Cost of goods', amount:'$6,354', pct:'25.7%', unit:'$21.47'},
            {lbl:'Refund/return handling', amount:'$26', pct:'0.1%', unit:'$0.09'},
            {lbl:'Total expenses', amount:'$14,238', pct:'57.5%', unit:'$48.10', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$10,525', pct:'42.5%', unit:'$35.56', total:true, profit:true},
            {lbl:'Profit %', amount:'42.5%', accent:'green'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'15.3%'},
            {lbl:'Ad spend (console)', amount:'$4,843'}
          ] }
        ]
      }
    } },
  },
  },

  // ---- Deep-page content (rendered once at boot; September 2026 snapshot) ----
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
      // Featured-offer (Buy Box) — Sep 2026 channel-level rate from getSalesByPeriod (99.7%, Aug 99.4%).
      // The per-listing trafficAndConversion report was NOT pulled this run, so the 4 rows below carry the
      // channel rate rather than per-parent rates (Single/Pack-2/Pack-3 share one parent and Pro is its own).
      // Refresh per-listing rates from the report at the next bake / review.
      buyBox: [
        {label:'Magnostream Single', pct:99.7, valText:'99.7%', color:'green'},
        {label:'Magnostream Pro', pct:99.7, valText:'99.7%', color:'green'},
        {label:'Magnostream Pack of 3', pct:99.7, valText:'99.7%', color:'green'},
        {label:'Magnostream Pack of 2', pct:99.7, valText:'99.7%', color:'green'}
      ],
      buyBoxHeadline: { pctTxt:'99.7%', delta:'▲ 0.3pp vs August', deltaCls:'du' },
      cvr: { val:'2.8%', note:'September 2026 · 1,678 sessions', sub:'US · session conversion' },
      // FBA stock warnings = real MerchantSpring product report (qty + days-cover per ASIN, 05 Oct 2026).
      // All 5 live ASINs are under ~150 days cover; Pack of 3 (42d) is the most urgent.
      stockWarn: { badge:'5 stock-up · 0 OOS', items:[
        {level:'red', title:'Magnostream Pack of 3 — stock-up now', sub:'B0GLPWZCRV · ~42 days cover · 14 units'},
        {level:'amber', title:'Magnostream Multi-Unit Bundle — stock-up soon', sub:'B0GH7YKPZJ · ~60 days cover · 2 units'},
        {level:'amber', title:'Magnostream Pack of 2 — stock-up soon', sub:'B0GLPQ6YZ4 · ~70 days cover · down from 120d Aug'},
        {level:'amber', title:'Magnostream Pro — stock-up soon', sub:'B0GGRJKS2D · ~99 days cover · down from 140d Aug'},
        {level:'amber', title:'Magnostream Single — stock-up soon', sub:'B0GLT2LYKY · ~102 days cover · down from 111d Aug'}
      ] }
    },
    // P&L is ACTIVE for Abimax (Executive tier, Sep 2026) — full MerchantSpring financial P&L, built
    // PER TIMELINE. This top-level sections.pnl is the "Last Month" (September) statement; the 3-month
    // (Jul–Sep) and Since-Launch (Mar–Sep) statements live on dateRanges['3m'].sec.pnl /
    // dateRanges['6m'].sec.pnl. Each carries its own fixedLabel so the page re-renders per period.
    // Basis: getStoreProfitAndLoss, profitabilityView 'settled' (cash basis), includeTax, pulled per
    // month then summed for the multi-month windows (the endpoint is 31-day-capped). SETTLED is used,
    // not accrual/"deferred": MerchantSpring's accrual P&L has no data for the Mar–Apr launch months
    // (returns ~$0), whereas settled has the complete launch-to-date history (Mar sales $4,186 ties to
    // the $4,191 order-date figure). Settled is settlement-timed, so a month's P&L revenue won't tie
    // exactly to that month's order-date sales KPI shown elsewhere — expected for a cash-basis P&L.
    // MerchantSpring's own totalRevenue/totalExpenses drive the summary + totals; itemized rows don't
    // always foot to the top-line (a known MerchantSpring gap). "Ad spend (console)" in Metrics is the
    // order-date figure from the Advertising page, shown for cross-reference. Sep 2026 (settled):
    // sales $4,397 · refunds -$710 · net rev $3,538 · ad(settlement) $1,168 · selling $71 · shipping $286
    // · COGS $1,290 · net profit $724 (20.5%).
    pnl: {
      summary: [ {val:'$3,538',lbl:'Net Revenue',color:'brand'}, {val:'$2,814',lbl:'Total Costs',color:'red'}, {val:'$724',lbl:'Net Profit',color:'green'} ],
      margin: { pct:'20.5%', pctColor:'red', note:'September 2026 (30-day) · financial basis (MerchantSpring, settled) · US channel', rows:[
        {lbl:'Net Revenue', val:'$3,538'},
        {lbl:'Advertising', val:'-$1,168', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-$356', color:'red'},
        {lbl:'COGS', val:'-$1,290', color:'red'},
        {lbl:'Other adjustments', val:'-$-0', color:'red'},
        {lbl:'Net Profit', val:'$724', color:'green', strong:true}
      ] },
      mkt: [
        {name:'United States',flag:'us',revenue:'$3,538',adspend:'$1,168',net:'$724',netColor:'green',margin:'20.5%',marginCls:'br'}
      ],
      statement: {
        fixedLabel: 'September 2026 (1–30) · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag, so the most recent ~2 weeks may be understated until settlement completes.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$4,397', pct:'124.3%', unit:'$93.55'},
            {lbl:'Refunds & returns', amount:'-$710', pct:'-20.1%', unit:'-$15.11'},
            {lbl:'Promotions & coupons', amount:'-$13', pct:'-0.4%', unit:'-$0.28'},
            {lbl:'Reimbursements & other income', amount:'$124', pct:'3.5%', unit:'$2.64'},
            {lbl:'Net revenue', amount:'$3,538', pct:'100.0%', unit:'$75.28', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$1,168', pct:'33.0%', unit:'$24.86'},
            {lbl:'Selling fees', amount:'$71', pct:'2.0%', unit:'$1.50'},
            {lbl:'Shipping & fulfilment fees', amount:'$286', pct:'8.1%', unit:'$6.08'},
            {lbl:'Cost of goods', amount:'$1,290', pct:'36.4%', unit:'$27.44'},
            {lbl:'Total expenses', amount:'$2,814', pct:'79.5%', unit:'$59.88', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$724', pct:'20.5%', unit:'$15.40', total:true, profit:true},
            {lbl:'Profit %', amount:'20.5%', accent:'red'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'27.3%'},
            {lbl:'Ad spend (console)', amount:'$1,364'}
          ] }
        ]
      }
    },
    advertising: {
      // Real September 2026 ad totals (MerchantSpring channel report, US channel, USD). ACOS/ROAS/TACOS
      // are the channel-attributed figures (spend $1,364 · ad sales $2,814 → ACOS 48.5% · ROAS 2.06×).
      // ⚠️ ROAS below Abimax's plausible ~5–7× efficient band for a 3rd straight month — see top-of-file review note.
      metrics: [
        {lbl:'Total Spend',  val:'$1,364', id:'a-spend'},
        {lbl:'Ad Sales',     val:'$2,814', color:'brand'},
        {lbl:'ACOS',         val:'48.5%',  color:'red', id:'a-tacos'},
        {lbl:'ROAS',         val:'2.06×',  color:'red', id:'a-roas'},
        {lbl:'Impressions',  val:'171.1K'},
        {lbl:'Avg. CPC',     val:'$1.09'}
      ],
      // No budget sheet for Abimax yet — a working monthly ad budget is tracked vs the real actual
      // ($1,000 Jul → $1,200 Aug → $1,400 Sep). Goes live if/when an Apps Script budget proxy is added.
      budgets: {
        subLabel: 'September 2026 · budget vs actual',
        headers: ['Monthly Budget','September Actual','Variance','Utilisation'],
        rows: [
          {name:'United States', flag:'us', cells:['$1,400','$1,364','▼ $36 under','97%']},
          {name:'Total', total:true,        cells:['$1,400','$1,364','▼ $36 under','97%']}
        ]
      },
      // Forward ad budget (working plan; no sheet forecast yet). Given the 3-month efficiency decline
      // (ROAS 2.06×, TACOS 27.3%) the reviewer may want to revisit this progression rather than keep
      // scaling spend — left mechanical (+$200/month) pending that call.
      forecast: [
        {month:'Oct', budget:'$1,600', pct:100, tacos:'<15%', tacosColor:'amber', roas:'—', opacity:0.7},
        {month:'Nov', budget:'$1,800', pct:100, tacos:'<15%', tacosColor:'amber', roas:'—', opacity:0.6}
      ],
      // Per-ASIN Sponsored Products campaigns (September 2026). Spend, CPC, sales, ACOS and ROAS are REAL
      // per-SKU actuals from the MerchantSpring product report (getSalesByProduct), NOT allocated from the
      // channel total (spend-share allocation would show an identical ACOS on every row and hide that Pro
      // and Single are inefficient while Pack of 3 is not). Σ spend ($1,364) foots to the headline; Σ sales
      // ($1,906) does NOT foot to the channel-attributed headline Ad Sales ($2,814) — MerchantSpring's
      // per-product and channel ad-attribution reports disagree (as in Aug); headline metrics above remain
      // the channel-attributed, self-consistent figures per the runbook (getSalesByPeriod).
      campaigns: [
        {name:'US · Magnostream Pro — SP',type:'Sponsored Products',spend:'$636',sales:'$580',acos:'109.6%',acosCls:'br',roas:'0.9×',cpc:'$0.94',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Single — SP',type:'Sponsored Products',spend:'$594',sales:'$650',acos:'91.3%',acosCls:'br',roas:'1.1×',cpc:'$1.23',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 2 — SP',type:'Sponsored Products',spend:'$77',sales:'$180',acos:'42.9%',acosCls:'br',roas:'2.3×',cpc:'$1.38',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 3 — SP',type:'Sponsored Products',spend:'$58',sales:'$496',acos:'11.6%',acosCls:'bg',roas:'8.6×',cpc:'$1.31',status:'Active',statusCls:'bg'}
      ]
    },
    inventory: {
      // Real FBA stock snapshot from the MerchantSpring product report (qty + days-cover per ASIN, 05 Oct
      // 2026). 5 live ASINs (the Multi-Unit Bundle is back in the report). All are under ~150 days cover;
      // Pack of 3 (42d) is the urgent one. No dispatch-rate source → the Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'5',dCls:'df',d:'ASINs · 0 OOS',s:'all live ASINs in stock'},
        {bar:'#404935',lbl:'Units on Hand',val:'128',dCls:'dd',d:'FBA total',s:'across 5 SKUs · 169 in Aug'},
        {bar:'red',lbl:'Stock-up Watch',val:'5',dCls:'dd',d:'stock-up soon / now',s:'1 urgent (Pack of 3 · 42d)'},
        {bar:'green',lbl:'Buy Box (Sep)',val:'99.7%',dCls:'du',d:'featured-offer %',s:'vs 99.4% Aug'}
      ],
      stock: [
        {dot:'dr',name:'Magnostream Pack of 3',note:'B0GLPWZCRV · US',units:'14 units',days:'~42 days',unitsColor:'red'},
        {dot:'da',name:'Magnostream Multi-Unit Bundle',note:'B0GH7YKPZJ · US · slow mover',units:'2 units',days:'~60 days',unitsColor:'amber'},
        {dot:'da',name:'Magnostream Pack of 2',note:'B0GLPQ6YZ4 · US',units:'14 units',days:'~70 days',unitsColor:'amber'},
        {dot:'da',name:'Magnostream Pro — Heavy-Duty Descaler',note:'B0GGRJKS2D · US · top revenue SKU',units:'23 units',days:'~99 days',unitsColor:'amber'},
        {dot:'da',name:'Magnostream Single Descaler',note:'B0GLT2LYKY · US · best seller by units',units:'75 units',days:'~102 days',unitsColor:'amber'}
      ],
      restock: [
        {level:'red', title:'Magnostream Pack of 3 — stock-up now', sub:'B0GLPWZCRV · ~42 days cover · 14 units'},
        {level:'amber', title:'Magnostream Multi-Unit Bundle — stock-up soon', sub:'B0GH7YKPZJ · ~60 days cover · 2 units'},
        {level:'amber', title:'Magnostream Pack of 2 — stock-up soon', sub:'B0GLPQ6YZ4 · ~70 days cover'},
        {level:'amber', title:'Magnostream Pro — stock-up soon', sub:'B0GGRJKS2D · ~99 days cover · top revenue SKU'},
        {level:'amber', title:'Magnostream Single — stock-up soon', sub:'B0GLT2LYKY · ~102 days cover · best-seller by units'}
      ]
    },
    products: {
      // KPIs + by-market table = September 2026 (page period). Groups card = September sales by variant.
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'5',dCls:'df',d:'sold in Sep',s:'all 5 tracked SKUs sold'},
        {bar:'var(--green)',lbl:'Top Product Rev.',val:'$1,562',dCls:'dd',d:'Magnostream Pro',s:'31% of Sep sales'},
        {bar:'var(--blue)',lbl:'Orders (Sep)',val:'46',dCls:'du',d:'▲ 35.3% MoM',s:'34 orders Aug'},
        {bar:'var(--amber)',lbl:'ASP',val:'$106',dCls:'dd',d:'▼ 1.8% MoM',s:'per unit'}
      ],
      table: [
        {name:'United States',flag:'us',revenue:'$5,003',units:'47',orders:'46',cvr:'2.8%',cvrCls:'br',aov:'$108.77'}
      ],
      // September 2026 sales by product variant (real MerchantSpring product report, US channel). % = share
      // of September product sales (Σ = $5,003, ties to headline revenue). All variants in stock.
      groups: [
        {name:'Magnostream Pro — Heavy-Duty',sales:'$1,562',units:5,pct:'31%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Single',sales:'$1,305',units:26,pct:'26%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Pack of 3',sales:'$1,276',units:10,pct:'25%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Pack of 2',sales:'$481',units:5,pct:'10%',oosRate:'0%',oosCls:'bg'},
        {name:'Magnostream Multi-Unit Bundle',sales:'$381',units:1,pct:'8%',oosRate:'0%',oosCls:'bg'}
      ]
    }
  }
};
