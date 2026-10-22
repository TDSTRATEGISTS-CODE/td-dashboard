/* Balance 8 — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 05 Oct 2026 (channel 95589144, seller A3NEIOUENQO9V9),
   Amazon UK, native GBP. Two brands: "BrainMatter" (nootropic capsules — Cognitive + Calm, live
   since Sep 2025) and "WIRED" (sports nutrition — Creatine + 3 Electrolytes flavours + a Discovery
   Pack — new line, first sale 29 Aug 2026). dataSource.type is 'static' (no project-tracker sheet
   supplied yet — see config.js).

   ✅ Sep 2026 revenue/units CROSS-CHECK: getSalesByPeriod (£1,778.50 / 68 u) AGREES exactly with the
   summed getSalesByProduct rows (£1,778.50 / 68 u) — MerchantSpring's channel-level revenue lag no longer
   shows on the most recent month. Aug 2026 also reconciles (getSalesByProduct prior-period £1,032.16 /
   53 u = getSalesByPeriod). Oct 2025 now also returns real revenue on getSalesByPeriod. Revenue/units
   source this bake: getSalesByPeriod, confirmed by getSalesByProduct. Keep cross-checking each cycle.
   Ad spend/ad sales/sessions/Buy Box come from getSalesByPeriod. Aug 2026 ad spend was restated by
   MerchantSpring from £95.64 to £97.77 (ad sales unchanged £71.64) — all windows use the restated figure.
   (Per-SKU ad spend sums to £252.39 for Sep vs channel £260.54, and per-SKU ad sales £238.81 vs channel
   £359.31 — the Advertising tables show an explicit "other / unattributed" row for the remainder.)

   ⚠️ REAL FINDING — Balance 8 had ZERO sales Mar–Jul 2026 (5 months, confirmed via per-SKU pull, not
   a reporting gap — every SKU shows totalSales:0 / unitsSold:0 in each of those months individually).
   Cause is not visible in MerchantSpring data. Flagged as a task below; ask the client directly.

   September 2026 P&L (getStoreProfitAndLoss, accrual basis): gross sales £1,841.95, promotions/discounts
   -£1,200.38 (heavy discounting continues), other income +£8.51 → net revenue £541.96 vs £496.59 of
   expenses (ad spend £252.39 + selling fees £29.19 + shipping/fulfilment £215.01) = +£45.37 net profit
   (8.4% margin) — first profitable month since relaunch (Aug was -£124). COGS is £0 (not configured in
   MerchantSpring), so true profitability is lower once product cost is entered. Baked into sections.pnl
   but NOT shown in the UI while hiddenPages includes 'pnl'.

   Monthly actuals used to build every window (GBP; getSalesByPeriod, cross-checked vs per-SKU for Aug/Sep):
     Sep 25  £147.00 · 3 u · no ads  (outside current 12m window)
     Oct 25  £746.62 · 17 u · 255 sess · BuyBox 99.4% · spend £157.46 · adSales £109.97
     Nov 25  £2,458.70 · 62 u · 881 sess · BuyBox 94.3% · spend £692.70 · adSales £1,304.60 · ACOS 53.1% · TACOS 28.2%
     Dec 25  £3,261.32 · 91 u · 1,105 sess · BuyBox 98.1% · spend £794.45 · adSales £1,486.80 · ACOS 53.4% · TACOS 24.4%
     Jan 26  £4,010.72 · 111 u · 1,543 sess · BuyBox 98.4% · spend £1,103.00 · adSales £2,438.13 · ACOS 45.2% · TACOS 27.5%
     Feb 26  £815.47 · 21 u · 286 sess · BuyBox 97.4% · spend £187.28 · adSales £432.25 · ACOS 43.3% · TACOS 23.0%
     Mar–Jul 26  £0 every month, all SKUs — confirmed dead period (see finding above)
     Aug 26  £1,032.16 · 53 u · 448 sess · BuyBox 92.0% · spend £97.77 · adSales £71.64 · ACOS 136.5% · TACOS 9.5%
     Sep 26  £1,778.50 · 68 u · 1,340 sess · BuyBox 93.8% · spend £260.54 · adSales £359.31 · ACOS 72.5% · TACOS 14.6%
   12m window Oct 25–Sep 26: £14,103.49 · 423 u · spend £3,293.20 · adSales £6,202.70 · 5,858 sessions.
   Sep 26 revenue +72% vs Aug has an identifiable cause (not a data error): the 3 WIRED Electrolytes
   flavours started selling (£1,098, previously £0) plus ad spend up 2.7× (£98 → £261) and sessions 3×.

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
  // ===== Last Month = September 2026 =====
  'may': {
    label: 'September 2026', shortLabel: 'Sep 2026',
    rev: '£1,779', revD: '▲ 72.3% vs Aug', revC: 'du', revS: 'vs £1,032 Aug · WIRED Electrolytes now selling',
    adSales: '£359', adSalesD: '20.2% of revenue', adSalesC: 'df', adSalesS: '£261 spend → £359 ad sales',
    tacos: '14.6%', tacosD: '▲ 5.1pp vs Aug (9.5%)', tacosC: 'df', tacosS: 'Target <15%',
    roas: '1.38×', roasD: '▲ from 0.73× Aug', roasC: 'du', roasS: '68 units · ASP £26.15',
    spend: '£261', spendD: '▲ 166% vs Aug (£98)', spendC: 'df', spendS: 'vs £98 Aug',
    tacosAd: '14.6%', tacosAdD: '▲ 5.1pp vs Aug (9.5%)', tacosAdC: 'df', tacosAdS: 'Target <15%',
    roasAd: '1.38×', roasAdD: 'ACOS 72.5%', roasAdC: 'du', roasAdS: '£1,779 revenue',
    aov: '£26.15', aovD: 'ASP (per unit)', aovC: 'du', aovS: '68 units Sep — no order-count field exposed, see note',
    mktRows: [
      ['Amazon UK','gb','—','£261','bb','No budget set','£1,779','bg','14.6%'],
      ['Total UK',null,'—','£261','bb','No budget set','£1,779','bg','14.6%']
    ],
    revBreakChart: { max: 2000, yTicks: ['£2k','£1.5k','£1k','£500','£0'], xLabels: ['Sep'],
      series: [ { color:'#404935', values:[359] }, { color:'#a7ab90', values:[1420] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:2000, yTicks:['£2k','£1.5k','£1k','£500','£0'], xLabels:['Apr','May','Jun','Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,0,0,0,1032,1779],main:true,area:true}, {color:'#a7ab90',values:[0,0,0,0,98,261],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:2000, yTicks:['£2k','£1.5k','£1k','£500','£0'], xLabels:['Apr','May','Jun','Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,0,0,0,1032,1779],main:true,area:true}, {color:'#a7ab90',values:[0,0,0,0,98,261],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'£359',acos:'72.5%'} ] },
  },
  // ===== Last 3 Months = Jul–Sep 2026 =====
  '3m': {
    label: 'Jul–Sep 2026', shortLabel: 'Jul–Sep 2026',
    rev: '£2,811', revD: '3-month total', revC: 'df', revS: 'Jul £0 · Aug £1,032 · Sep £1,779',
    adSales: '£431', adSalesD: '3-month total', adSalesC: 'df', adSalesS: '15.3% of revenue (Aug–Sep)',
    tacos: '12.7%', tacosD: '3-month blended', tacosC: 'df', tacosS: 'Target <15%',
    roas: '1.20×', roasD: '3-month avg', roasC: 'df', roasS: 'ad activity Aug–Sep',
    spend: '£358', spendD: '3-month total', spendC: 'df', spendS: 'Jul £0 · Aug £98 · Sep £261',
    tacosAd: '12.7%', tacosAdD: '3-month blended', tacosAdC: 'df', tacosAdS: 'Target <15%',
    roasAd: '1.20×', roasAdD: '3-month avg', roasAdC: 'df', roasAdS: '£2,811 revenue',
    aov: '£23.23', aovD: '3-month ASP', aovC: 'df', aovS: '121 units total',
    mktRows: [
      ['Amazon UK','gb','—','£358','bb','No budget set','£2,811','bg','12.7%'],
      ['Total UK',null,'—','£358','bb','No budget set','£2,811','bg','12.7%']
    ],
    revBreakChart: { max: 2000, yTicks: ['£2k','£1.5k','£1k','£500','£0'], xLabels: ['Jul','Aug','Sep'],
      series: [ { color:'#404935', values:[0,72,359] }, { color:'#a7ab90', values:[0,960,1420] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:2000, yTicks:['£2k','£1.5k','£1k','£500','£0'], xLabels:['Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,1032,1779],main:true,area:true}, {color:'#a7ab90',values:[0,98,261],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:2000, yTicks:['£2k','£1.5k','£1k','£500','£0'], xLabels:['Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,1032,1779],main:true,area:true}, {color:'#a7ab90',values:[0,98,261],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'£431',acos:'83.1%'} ] },
    // Amazon P&L for this window (settled, summed per month — see sections.pnl note on basis).
    sec: { pnl: {
      summary: [ {val:'£603',lbl:'Net Revenue',color:'brand'}, {val:'£864',lbl:'Total Costs',color:'red'}, {val:'-£261',lbl:'Net Profit',color:'red'} ],
      margin: { pct:'-43.3%', pctColor:'red', note:'Jul–Sep 2026 (3-month) · financial basis (MerchantSpring, settled) · UK channel · COGS not configured', rows:[
        {lbl:'Net Revenue', val:'£603'},
        {lbl:'Advertising', val:'-£99', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-£765', color:'red'},
        {lbl:'COGS (not yet configured)', val:'£0', color:'red'},
        {lbl:'Net Profit', val:'-£261', color:'red', strong:true}
      ] },
      mkt: [
        {name:'United Kingdom',flag:'gb',revenue:'£603',adspend:'£99',net:'-£261',netColor:'red',margin:'-43.3%',marginCls:'br'}
      ],
      statement: {
        fixedLabel: 'Jul–Sep 2026 (3-month) · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag and bills ad spend in arrears, so the latest weeks are understated until settlement completes (settled ad spend £99 vs £358 in the ad console). COGS is not configured in MerchantSpring (£0 shown), so real profit is lower once product cost is entered.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales (ex-VAT)', amount:'£2,553', pct:'423.4%', unit:'£21.10'},
            {lbl:'Promotions & discounts', amount:'-£1,973', pct:'-327.2%', unit:'-£16.30'},
            {lbl:'Reimbursements & other income', amount:'£23', pct:'3.7%', unit:'£0.19'},
            {lbl:'Net revenue', amount:'£603', pct:'100.0%', unit:'£4.98',total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'£99', pct:'16.4%', unit:'£0.82'},
            {lbl:'Selling fees', amount:'£392', pct:'65.1%', unit:'£3.24'},
            {lbl:'Shipping & fulfilment fees', amount:'£372', pct:'61.7%', unit:'£3.08'},
            {lbl:'Cost of goods (not configured)', amount:'£0', pct:'0.0%', unit:'£0.00'},
            {lbl:'Total expenses', amount:'£864', pct:'143.3%', unit:'£7.14',total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'-£261', pct:'-43.3%', unit:'-£2.16', total:true, profit:true},
            {lbl:'Profit %', amount:'-43.3%', accent:'red'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'12.7%'},
            {lbl:'Ad spend (console)', amount:'£358'}
          ] }
        ]
      }
    } },
  },
  // ===== Last 12 Months = Oct 2025–Sep 2026 =====
  '12m': {
    label: 'Oct 2025 – Sep 2026', shortLabel: 'Last 12 Months',
    rev: '£14,103', revD: '12-month total', revC: 'df', revS: 'Jan 26 peak £4,011 · Mar–Jul 26 £0',
    adSales: '£6,203', adSalesD: '12-month total', adSalesC: 'df', adSalesS: '44.0% of revenue',
    tacos: '23.4%', tacosD: '12-month blended', tacosC: 'dd', tacosS: 'Target <15%',
    roas: '1.88×', roasD: '12-month avg', roasC: 'dd', roasS: '423 units total',
    spend: '£3,293', spendD: '12-month total', spendC: 'df', spendS: 'concentrated Nov 25–Feb 26',
    tacosAd: '23.4%', tacosAdD: '12-month blended', tacosAdC: 'dd', tacosAdS: 'Target <15%',
    roasAd: '1.88×', roasAdD: '12-month avg', roasAdC: 'dd', roasAdS: '£14,103 revenue',
    aov: '£33.34', aovD: '12-month ASP', aovC: 'df', aovS: '423 units total',
    mktRows: [
      ['Amazon UK','gb','—','£3,293','bb','No budget set','£14,103','ba','23.4%'],
      ['Total UK',null,'—','£3,293','bb','No budget set','£14,103','ba','23.4%']
    ],
    revBreakChart: { max: 4000, yTicks: ['£4k','£3k','£2k','£1k','£0'], xLabels: ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
      series: [ { color:'#404935', values:[110,1305,1487,2438,432,0,0,0,0,0,72,359] }, { color:'#a7ab90', values:[637,1154,1774,1572,383,0,0,0,0,0,960,1420] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:4000, yTicks:['£4k','£3k','£2k','£1k','£0'], xLabels:['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[747,2459,3261,4011,815,0,0,0,0,0,1032,1779],main:true,area:true}, {color:'#a7ab90',values:[157,693,794,1103,187,0,0,0,0,0,98,261],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:4000, yTicks:['£4k','£3k','£2k','£1k','£0'], xLabels:['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[747,2459,3261,4011,815,0,0,0,0,0,1032,1779],main:true,area:true}, {color:'#a7ab90',values:[157,693,794,1103,187,0,0,0,0,0,98,261],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'£6.2k',acos:'53.1%'} ] },
    // Amazon P&L for this window (settled, summed per month — see sections.pnl note on basis).
    sec: { pnl: {
      summary: [ {val:'£9,681',lbl:'Net Revenue',color:'brand'}, {val:'£5,960',lbl:'Total Costs',color:'red'}, {val:'£3,721',lbl:'Net Profit',color:'green'} ],
      margin: { pct:'38.4%', pctColor:'green', note:'Oct 2025 – Sep 2026 (12-month) · financial basis (MerchantSpring, settled) · UK channel · COGS not configured', rows:[
        {lbl:'Net Revenue', val:'£9,681'},
        {lbl:'Advertising', val:'-£3,026', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-£2,928', color:'red'},
        {lbl:'COGS (not yet configured)', val:'£0', color:'red'},
        {lbl:'Other adjustments', val:'-£5', color:'red'},
        {lbl:'Net Profit', val:'£3,721', color:'green', strong:true}
      ] },
      mkt: [
        {name:'United Kingdom',flag:'gb',revenue:'£9,681',adspend:'£3,026',net:'£3,721',netColor:'green',margin:'38.4%',marginCls:'bg'}
      ],
      statement: {
        fixedLabel: 'Oct 2025 – Sep 2026 (12-month) · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag and bills ad spend in arrears, so the latest weeks are understated until settlement completes (settled ad spend £3,026 vs £3,293 in the ad console). COGS is not configured in MerchantSpring (£0 shown), so real profit is lower once product cost is entered.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales (ex-VAT)', amount:'£12,075', pct:'124.7%', unit:'£28.55'},
            {lbl:'Refunds & returns', amount:'-£276', pct:'-2.9%', unit:'-£0.65'},
            {lbl:'Promotions & discounts', amount:'-£2,484', pct:'-25.7%', unit:'-£5.87'},
            {lbl:'Reimbursements & other income', amount:'£367', pct:'3.8%', unit:'£0.87'},
            {lbl:'Net revenue', amount:'£9,681', pct:'100.0%', unit:'£22.89',total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'£3,026', pct:'31.3%', unit:'£7.15'},
            {lbl:'Selling fees', amount:'£1,563', pct:'16.1%', unit:'£3.69'},
            {lbl:'Shipping & fulfilment fees', amount:'£1,365', pct:'14.1%', unit:'£3.23'},
            {lbl:'Cost of goods (not configured)', amount:'£0', pct:'0.0%', unit:'£0.00'},
            {lbl:'Refund/return handling', amount:'£5', pct:'0.1%', unit:'£0.01'},
            {lbl:'Total expenses', amount:'£5,960', pct:'61.6%', unit:'£14.09',total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'£3,721', pct:'38.4%', unit:'£8.80', total:true, profit:true},
            {lbl:'Profit %', amount:'38.4%', accent:'green'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'23.4%'},
            {lbl:'Ad spend (console)', amount:'£3,293'}
          ] }
        ]
      }
    } },
  },
  },

  // ---- Deep-page content (rendered once at boot; September 2026 snapshot) ----
  sections: {
    overview: {
      // Placeholder scope board — no project-tracker Google Sheet supplied yet for Balance 8 (see
      // config.js dataSource comment). Built from what MerchantSpring itself shows, NOT a real
      // client-side tracker. Replace once tools/balance8-sheet-proxy.gs is deployed.
      tasksSpec: { badge: '4 in progress', items: [
        {text:'Confirm root cause of Mar–Jul 2026 sales gap', sub:'Overview · Upcoming'},
        {text:'Review promotion depth — £1,200 of discounts on £1,842 gross sales in Sep', sub:'Pricing · Upcoming'},
        {text:'Stock-up WIRED Electrolytes Berry Fusion (FBA) — 41 units, 31 sold in Sep', sub:'Supply · Upcoming'},
        {text:'Fix BrainMatter Calm ads — ACOS 111% in Sep', sub:'Advertising · Upcoming', active:false}
      ] },
      flagsSpec: { badge: '3 in progress', items: [
        {level:'amber', title:'Mar–Jul 2026 sales gap — 5 months at £0', sub:'Confirmed via per-SKU pull, not a reporting gap · cause unclear'},
        {level:'amber', title:'Heavy promotions — 65% of gross sales discounted', sub:'Sep net profit +£45 (8.4% margin) before COGS · £1,200 promotions vs £1,842 gross'},
        {level:'amber', title:'WIRED Berry Fusion — fast seller, thin stock', sub:'B0HD7RFZN4 · 41 units · 31 sold in Sep (~40 days at Sep rate)'}
      ] },
      completedSpec: { badge: '3 completed', items: [
        {text:'WIRED Electrolytes flavours now selling — £1,098 in Sep', sub:'Completed · Sep 2026 — Berry Fusion £975, Melon Ice + Citrus Lime £123'},
        {text:'Sep revenue £1,779 — up 72% on Aug', sub:'Completed · Sep 2026'},
        {text:'7 ASINs live, 0 suppressed / 0 OOS', sub:'Completed'}
      ] },
      // No per-ASIN Buy Box field exposed by the MerchantSpring product report — each SKU shown at
      // ~the Sep 2026 channel rate (93.8%), same limitation noted in Abimax's data.js.
      buyBox: [
        {label:'BrainMatter Cognitive', pct:94, color:'green'},
        {label:'BrainMatter Calm', pct:94, color:'green'},
        {label:'WIRED Electrolytes', pct:94, color:'green'},
        {label:'WIRED Creatine + Discovery Pack', pct:94, color:'green'}
      ],
      buyBoxHeadline: { pctTxt:'93.8%', delta:'▲ 1.8pp vs Aug', deltaCls:'du' },
      cvr: { val:'5.1%', note:'September 2026 · 1,340 sessions', sub:'UK · session conversion' },
      // Real FBA stock snapshot (MerchantSpring product report, qty + days-cover per ASIN, 05 Oct
      // 2026). 1 SKU on stock-up watch — Berry Fusion sold 31 of its 72 units in Sep, 41 left. MerchantSpring's
      // daysCover shows ~112 days (blended velocity); at the Sep sell rate it is ~40 days.
      // ---- Overview cards — baked WEEKLY (config.overviewSource:'notion'; runbook tools/weekly-overview.routine.md) ----
      // First baked 12 Oct 2026 (review used as approved for this run by Ryan's instruction). The sheet-era
      // tasksSpec / flagsSpec / completedSpec above are ignored while overviewSource is 'notion'.
      // healthMgmtSpec ← "12 Oct 2026 - Balance 8 Account Health Review" › Notes for client (⚠️ lines; ✅ lines left out).
      // adsStrategySpec ← "Balance8 Ad Strategy" task › Notes for Client (updated 13 Oct 2026) + Weekly log for done items.
      // stockWarn      ← Balance8_UK_sku-sync_2026-10-19 (MerchantSpring, 19 Sep–18 Oct 2026, FBA). Thresholds ≤21d / soon ≤45d: none hit.
      healthMgmtSpec: { badge:'2 open', subLabel:'Weekly review · 12 Oct 2026', items:[
        {level:'amber',title:'UK — Sales',sub:'In progress · WIRED flavours and Creatine slow since mid-September; we\'ve proposed listing improvements'},
        {level:'amber',title:'UK — Deals',sub:'In progress · Black Friday deal submissions close 18 Nov; we\'ve proposed a deal plan'},
        {level:'green',title:'UK — WIRED listings confirmed live',sub:'Done 12 Oct · all 14 UK listings Active, none inactive'}
      ] },
      adsStrategySpec: { badge:'Building keywords', subLabel:'Weekly review · 14 Oct 2026', items:[
        {level:'amber',title:'BrainMatter',sub:'In progress · Calm\'s keyword campaign is now converting well (5 orders in the week to 12 Oct). The automatic campaigns are being monitored as sales build'},
        {level:'amber',title:'WIRED',sub:'In progress · the automatic campaigns haven\'t produced a sale since launch on 17 Sep. As agreed, we\'re keeping them running and trialling a new main image to lift conversion; Amazon Vine is still recommended to build reviews'},
        {level:'muted',title:'Next step',sub:'Next up · building the Cognitive keyword campaign from search terms that already convert'},
        {level:'green',title:'WIRED campaigns live',sub:'Done 17 Sep · first advertising campaigns running'},
        {level:'green',title:'BrainMatter manual keyword campaigns added',sub:'Done 2 Sep · targeting terms alongside the automatic campaigns'}
      ] },
      stockWarn: { title:'&#128230; Logistics &amp; Operations', badge:'All in stock', subLabel:'SKU sync · UK FBA stock · 19 Oct 2026', items:[
        {level:'muted',title:'All live listings in stock',sub:'No stock-up needed on current sales'}
      ] }
    },
    // Amazon P&L — ACTIVE (un-gated Oct 2026, see config.js hiddenPages). Basis: getStoreProfitAndLoss,
    // profitabilityView 'settled', includeTax:false (so Product sales is ex-VAT and the Income lines
    // foot exactly to Net revenue), pulled per month (endpoint is ~31-day capped) and summed for the
    // multi-month windows. sections.pnl = Last Month (Sep 2026); dateRanges['3m'|'12m'].sec.pnl = the
    // other windows. COGS is NOT configured in MerchantSpring (£0) so profit/margin are overstated vs
    // true profit. Settled timing: Aug orders settle into Sep, and ad spend is billed in arrears
    // (settled Sep ad £99 vs £261 console), so single-month figures swing — read the 12-month view.
    // Monthly settled net (rev − exp): Oct +121 · Nov +849 · Dec +1,175 · Jan +1,000 · Feb +914 · Mar −142 ·
    // Apr +67 · May–Jul ~£0 · Aug −1 · Sep −260 (Sep: £1,969 of promotions vs £2,481 ex-VAT sales).
    pnl: {
      summary: [ {val:'£531',lbl:'Net Revenue',color:'brand'}, {val:'£792',lbl:'Total Costs',color:'red'}, {val:'-£260',lbl:'Net Profit',color:'red'} ],
      margin: { pct:'-49.0%', pctColor:'red', note:'September 2026 (30-day) · financial basis (MerchantSpring, settled) · UK channel · COGS not configured', rows:[
        {lbl:'Net Revenue', val:'£531'},
        {lbl:'Advertising', val:'-£99', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-£692', color:'red'},
        {lbl:'COGS (not yet configured)', val:'£0', color:'red'},
        {lbl:'Net Profit', val:'-£260', color:'red', strong:true}
      ] },
      mkt: [
        {name:'United Kingdom',flag:'gb',revenue:'£531',adspend:'£99',net:'-£260',netColor:'red',margin:'-49.0%',marginCls:'br'}
      ],
      statement: {
        fixedLabel: 'September 2026 (1–30) · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag and bills ad spend in arrears, so the latest weeks are understated until settlement completes (settled ad spend £99 vs £261 in the ad console). COGS is not configured in MerchantSpring (£0 shown), so real profit is lower once product cost is entered.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales (ex-VAT)', amount:'£2,481', pct:'467.1%', unit:'£36.49'},
            {lbl:'Promotions & discounts', amount:'-£1,969', pct:'-370.6%', unit:'-£28.95'},
            {lbl:'Reimbursements & other income', amount:'£19', pct:'3.5%', unit:'£0.28'},
            {lbl:'Net revenue', amount:'£531', pct:'100.0%', unit:'£7.81',total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'£99', pct:'18.7%', unit:'£1.46'},
            {lbl:'Selling fees', amount:'£367', pct:'69.2%', unit:'£5.40'},
            {lbl:'Shipping & fulfilment fees', amount:'£325', pct:'61.2%', unit:'£4.78'},
            {lbl:'Cost of goods (not configured)', amount:'£0', pct:'0.0%', unit:'£0.00'},
            {lbl:'Total expenses', amount:'£792', pct:'149.0%', unit:'£11.64',total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'-£260', pct:'-49.0%', unit:'-£3.83', total:true, profit:true},
            {lbl:'Profit %', amount:'-49.0%', accent:'red'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'14.6%'},
            {lbl:'Ad spend (console)', amount:'£261'}
          ] }
        ]
      }
    },
    advertising: {
      // Sep 2026 channel ad totals (MerchantSpring channel report, UK, GBP): spend £260.54 · ad sales
      // £359.31 → ACOS 72.5% · ROAS 1.38×. Per-SKU rows below are the real MerchantSpring per-product
      // figures (spend £252.39 / sales £238.81) plus an explicit "other / unattributed" row carrying the
      // remainder so the table reconciles to the headline (per-product attribution is narrower than the
      // channel-level ad-sales figure). WIRED Creatine/Discovery/Berry ran small spend with £0 attributed.
      //
      // campaignsByPeriod: period-aware (app.js checks campaignsByPeriod[currentPeriod] first).
      //   may: Sep per-SKU. 3m: Aug+Sep per-SKU summed (Jul had £0 ad spend). 12m: one aggregate row —
      //   per-SKU ad detail was not pulled for Oct 25–Feb 26, so a split would be invented.
      metrics: [
        {lbl:'Total Spend',  val:'£261', id:'a-spend'},
        {lbl:'Ad Sales',     val:'£359', color:'brand'},
        {lbl:'ACOS',         val:'72.5%',  color:'red', id:'a-tacos'},
        {lbl:'ROAS',         val:'1.38×',  color:'brand', id:'a-roas'},
        {lbl:'Impressions',  val:'50.0K'},
        {lbl:'Avg. CPC',     val:'£1.35'}
      ],
      campaigns: [
        {name:'UK · BrainMatter Cognitive — SP',type:'Sponsored Products',spend:'£109',sales:'£147',acos:'74.0%',acosCls:'ba',roas:'1.35×',cpc:'£1.65',status:'Active',statusCls:'bg'},
        {name:'UK · BrainMatter Calm — SP',type:'Sponsored Products',spend:'£102',sales:'£92',acos:'111.2%',acosCls:'br',roas:'0.90×',cpc:'£1.17',status:'Active',statusCls:'bg'},
        {name:'UK · WIRED Creatine — SP',type:'Sponsored Products',spend:'£23',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.33',status:'Active',statusCls:'bg'},
        {name:'UK · WIRED Berry Fusion — SP',type:'Sponsored Products',spend:'£12',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.08',status:'Active',statusCls:'bg'},
        {name:'UK · WIRED Discovery Pack — SP',type:'Sponsored Products',spend:'£7',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.00',status:'Active',statusCls:'bg'},
        {name:'UK · Other / unattributed (channel remainder)',type:'Sponsored Products',spend:'£8',sales:'£121',acos:'6.8%',acosCls:'bg',roas:'14.8×',cpc:'—',status:'Active',statusCls:'bg'}
      ],
      campaignsByPeriod: {
        may: [
          {name:'UK · BrainMatter Cognitive — SP',type:'Sponsored Products',spend:'£109',sales:'£147',acos:'74.0%',acosCls:'ba',roas:'1.35×',cpc:'£1.65',status:'Active',statusCls:'bg'},
          {name:'UK · BrainMatter Calm — SP',type:'Sponsored Products',spend:'£102',sales:'£92',acos:'111.2%',acosCls:'br',roas:'0.90×',cpc:'£1.17',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Creatine — SP',type:'Sponsored Products',spend:'£23',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.33',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Berry Fusion — SP',type:'Sponsored Products',spend:'£12',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.08',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Discovery Pack — SP',type:'Sponsored Products',spend:'£7',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.00',status:'Active',statusCls:'bg'},
          {name:'UK · Other / unattributed (channel remainder)',type:'Sponsored Products',spend:'£8',sales:'£121',acos:'6.8%',acosCls:'bg',roas:'14.8×',cpc:'—',status:'Active',statusCls:'bg'}
        ],
        '3m': [
          {name:'UK · BrainMatter Calm — SP',type:'Sponsored Products',spend:'£168',sales:'£164',acos:'103.0%',acosCls:'br',roas:'0.97×',cpc:'£1.24',status:'Active',statusCls:'bg'},
          {name:'UK · BrainMatter Cognitive — SP',type:'Sponsored Products',spend:'£138',sales:'£147',acos:'94.0%',acosCls:'br',roas:'1.06×',cpc:'£1.42',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Creatine — SP',type:'Sponsored Products',spend:'£23',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.33',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Berry Fusion — SP',type:'Sponsored Products',spend:'£12',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.08',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Discovery Pack — SP',type:'Sponsored Products',spend:'£7',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.00',status:'Active',statusCls:'bg'},
          {name:'UK · Other / unattributed (channel remainder)',type:'Sponsored Products',spend:'£10',sales:'£121',acos:'8.5%',acosCls:'bg',roas:'11.7×',cpc:'—',status:'Active',statusCls:'bg'}
        ],
        '12m': [
          {name:'UK · All Sponsored Products (12-month)',type:'Sponsored Products',spend:'£3,293',sales:'£6,203',acos:'53.1%',acosCls:'ba',roas:'1.88×',cpc:'—',status:'Active',statusCls:'bg'}
        ]
      }
    },
    inventory: {
      // Real FBA stock snapshot from the MerchantSpring product report (qty + days-cover per ASIN,
      // 05 Oct 2026). All 7 selling ASINs are in stock, 0 OOS. WIRED Berry Fusion is the one stock-up
      // watch item — sold 31 of 72 units in Sep (MerchantSpring daysCover ~112 days; ~40 days at the Sep
      // sell rate). No dispatch-rate source → the Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'7',dCls:'du',d:'ASINs · 0 OOS',s:'all sold listings live'},
        {bar:'#404935',lbl:'Units on Hand',val:'461',dCls:'df',d:'FBA total',s:'across 7 SKUs'},
        {bar:'amber',lbl:'Stock-up Watch',val:'1',dCls:'dd',d:'WIRED Berry Fusion',s:'~40 days at Sep rate'},
        {bar:'green',lbl:'Buy Box (Sep)',val:'93.8%',dCls:'du',d:'▲ 1.8pp vs Aug',s:'channel rate'}
      ],
      stock: [
        {dot:'da',name:'WIRED Electrolytes — Berry Fusion',note:'B0HD7RFZN4 · UK · sold 31 in Sep',units:'41 units',unitsColor:'amber',days:'~112 days (MS) · ~40 at Sep rate'},
        {dot:'dg',name:'WIRED Pure Creatine Monohydrate',note:'B0HD7ZKMZZ · UK · sold 3 in Sep',units:'39 units',days:'~585 days'},
        {dot:'dg',name:'WIRED Electrolytes Discovery Pack',note:'B0HD7XTQ3H · UK',units:'58 units',days:'~249 days'},
        {dot:'dg',name:'BrainMatter Cognitive',note:'B0DS8V2T97 · UK',units:'92 units',days:'~307 days'},
        {dot:'dg',name:'BrainMatter Calm',note:'B0DS8X7RH8 · UK',units:'91 units',days:'~390 days'},
        {dot:'dg',name:'WIRED Electrolytes — Melon Ice',note:'B0HD7JBLVY · UK · first sales in Sep',units:'70 units',days:'~1,050 days'},
        {dot:'dg',name:'WIRED Electrolytes — Citrus Lime',note:'B0HD7WP7VT · UK · first sales in Sep',units:'70 units',days:'~1,050 days'}
      ],
      restock: []
    },
    products: {
      // KPIs + by-market table + groups below are the static (May-period) fallback; the *ByPeriod
      // variants are what app.js reads first (see advertising.campaignsByPeriod).
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'7',dCls:'du',d:'sold in Sep',s:'all 7 live SKUs sold (3 Electrolytes flavours new)'},
        {bar:'var(--green)',lbl:'Top Product Rev.',val:'£975',dCls:'du',d:'WIRED Berry Fusion',s:'55% of Sep sales'},
        {bar:'var(--blue)',lbl:'Units (Sep)',val:'68',dCls:'du',d:'▲ from 53 (Aug)',s:'second month since relaunch'},
        {bar:'var(--amber)',lbl:'ASP',val:'£26.15',dCls:'du',d:'per unit',s:'no order-count field exposed'}
      ],
      kpisByPeriod: {
        may: { all: [
          {bar:'#404935',lbl:'Active SKUs',val:'7',dCls:'du',d:'sold in Sep',s:'all 7 live SKUs sold (3 Electrolytes flavours new)'},
          {bar:'var(--green)',lbl:'Top Product Rev.',val:'£975',dCls:'du',d:'WIRED Berry Fusion',s:'55% of Sep sales'},
          {bar:'var(--blue)',lbl:'Units (Sep)',val:'68',dCls:'du',d:'▲ from 53 (Aug)',s:'second month since relaunch'},
          {bar:'var(--amber)',lbl:'ASP',val:'£26.15',dCls:'du',d:'per unit',s:'no order-count field exposed'}
        ] },
        '3m': { all: [
          {bar:'#404935',lbl:'Active SKUs',val:'7',dCls:'df',d:'sold in Jul–Sep',s:'Jul £0 · Aug 4 SKUs · Sep 7 SKUs'},
          {bar:'var(--green)',lbl:'Top Product Rev.',val:'£976',dCls:'du',d:'WIRED Berry Fusion',s:'35% of 3-month sales'},
          {bar:'var(--blue)',lbl:'Units (3m)',val:'121',dCls:'du',d:'3-month total',s:'Jul 0 · Aug 53 · Sep 68'},
          {bar:'var(--amber)',lbl:'ASP',val:'£23.23',dCls:'df',d:'3-month ASP',s:'per unit'}
        ] },
        // 12-month figures reconcile at PRODUCT-FAMILY level, not per-SKU: per-SKU data was not pulled
        // for Oct 25–Feb 26 (channel totals only), and WIRED did not exist before Aug 2026, so
        // "BrainMatter combined" = 12m total minus WIRED's Aug+Sep total (exact).
        '12m': { all: [
          {bar:'#404935',lbl:'Active SKUs',val:'7',dCls:'df',d:'sold in last 12mo',s:'all 7 live SKUs have sold'},
          {bar:'var(--green)',lbl:'Top Product Rev.',val:'£11,895',dCls:'du',d:'BrainMatter (combined)',s:'84% of 12-month sales'},
          {bar:'var(--blue)',lbl:'Units (12m)',val:'423',dCls:'df',d:'12-month total',s:'Jan 26 peak month'},
          {bar:'var(--amber)',lbl:'ASP',val:'£33.34',dCls:'df',d:'12-month ASP',s:'423 units total'}
        ] }
      },
      table: [
        {name:'United Kingdom',flag:'gb',revenue:'£1,779',units:'68',orders:'~68*',cvr:'5.1%',cvrCls:'ba',aov:'£26.15'}
      ],
      tableByPeriod: {
        may: [ {name:'United Kingdom',flag:'gb',revenue:'£1,779',units:'68',orders:'~68*',cvr:'5.1%',cvrCls:'ba',aov:'£26.15'} ],
        '3m': [ {name:'United Kingdom',flag:'gb',revenue:'£2,811',units:'121',orders:'~121*',cvr:'6.8%',cvrCls:'ba',aov:'£23.23'} ],
        // Sessions summed across the 12 months (255 Oct + 881 Nov + 1,105 Dec + 1,543 Jan + 286 Feb +
        // 0 Mar–Jul + 448 Aug + 1,340 Sep = 5,858); CVR = units/sessions (423/5,858).
        '12m': [ {name:'United Kingdom',flag:'gb',revenue:'£14,103',units:'423',orders:'~423*',cvr:'7.2%',cvrCls:'ba',aov:'£33.34'} ]
      },
      // September 2026 sales by product (real MerchantSpring product report, UK, FBA+FBM combined per
      // ASIN). Whole-£ values use largest-remainder rounding so the group sum equals the table total.
      // cvr (per-SKU, session-based — units ÷ sessions, same definition as the market-level CVR on
      // this page) pulled 19 Oct 2026 via generateReport(report_type:'trafficAndConversion',
      // view:'skus') — MerchantSpring's product-level sales report (getSalesByProduct) has no
      // per-SKU session count, only ad-click data, so this separate traffic report is the only real
      // source for it. cvrCls thresholds: ≥10% green, 4–9.99% amber, <4% red.
      groups: [
        {name:'WIRED Electrolytes — Berry Fusion',sales:'£975',units:31,pct:'55%',adSpend:'£12',tacos:'1.2%',tacosCls:'bg',cvr:'23.9%',cvrCls:'bg',oosRate:'0%',oosCls:'bg'},
        {name:'BrainMatter Cognitive',sales:'£250',units:7,pct:'14%',adSpend:'£109',tacos:'43.6%',tacosCls:'br',cvr:'4.5%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
        {name:'BrainMatter Calm',sales:'£185',units:5,pct:'10%',adSpend:'£102',tacos:'55.2%',tacosCls:'br',cvr:'3.4%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Electrolytes Discovery Pack',sales:'£179',units:18,pct:'10%',adSpend:'£7',tacos:'3.9%',tacosCls:'bg',cvr:'2.6%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Pure Creatine Monohydrate',sales:'£67',units:3,pct:'4%',adSpend:'£23',tacos:'33.8%',tacosCls:'br',cvr:'2.4%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Electrolytes — Melon Ice',sales:'£62',units:2,pct:'3%',adSpend:'£0',tacos:'0.0%',tacosCls:'bg',cvr:'5.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Electrolytes — Citrus Lime',sales:'£61',units:2,pct:'3%',adSpend:'£0',tacos:'0.0%',tacosCls:'bg',cvr:'6.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'}
      ],
      groupsByPeriod: {
        may: { all: [
          {name:'WIRED Electrolytes — Berry Fusion',sales:'£975',units:31,pct:'55%',adSpend:'£12',tacos:'1.2%',tacosCls:'bg',cvr:'23.9%',cvrCls:'bg',oosRate:'0%',oosCls:'bg'},
          {name:'BrainMatter Cognitive',sales:'£250',units:7,pct:'14%',adSpend:'£109',tacos:'43.6%',tacosCls:'br',cvr:'4.5%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'BrainMatter Calm',sales:'£185',units:5,pct:'10%',adSpend:'£102',tacos:'55.2%',tacosCls:'br',cvr:'3.4%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes Discovery Pack',sales:'£179',units:18,pct:'10%',adSpend:'£7',tacos:'3.9%',tacosCls:'bg',cvr:'2.6%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Pure Creatine Monohydrate',sales:'£67',units:3,pct:'4%',adSpend:'£23',tacos:'33.8%',tacosCls:'br',cvr:'2.4%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Melon Ice',sales:'£62',units:2,pct:'3%',adSpend:'£0',tacos:'0.0%',tacosCls:'bg',cvr:'5.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Citrus Lime',sales:'£61',units:2,pct:'3%',adSpend:'£0',tacos:'0.0%',tacosCls:'bg',cvr:'6.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'}
        ] },
        '3m': { all: [
          {name:'WIRED Electrolytes — Berry Fusion',sales:'£976',units:31,pct:'35%',adSpend:'£12',tacos:'1.2%',tacosCls:'bg',cvr:'22.3%',cvrCls:'bg',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Pure Creatine Monohydrate',sales:'£742',units:33,pct:'26%',adSpend:'£23',tacos:'3.0%',tacosCls:'bg',cvr:'12.7%',cvrCls:'bg',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes Discovery Pack',sales:'£368',units:37,pct:'13%',adSpend:'£7',tacos:'1.9%',tacosCls:'bg',cvr:'4.6%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'BrainMatter Calm',sales:'£314',units:8,pct:'11%',adSpend:'£168',tacos:'53.6%',tacosCls:'br',cvr:'3.5%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'BrainMatter Cognitive',sales:'£288',units:8,pct:'10%',adSpend:'£138',tacos:'47.9%',tacosCls:'br',cvr:'3.1%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Melon Ice',sales:'£62',units:2,pct:'2%',adSpend:'£0',tacos:'0.0%',tacosCls:'bg',cvr:'4.0%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Citrus Lime',sales:'£61',units:2,pct:'2%',adSpend:'£0',tacos:'0.0%',tacosCls:'bg',cvr:'5.1%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'}
        ] },
        // Upgraded 19 Oct 2026 from a product-FAMILY rollup to the real per-SKU split: the same
        // trafficAndConversion pull used for CVR also returns 12-month orderedRevenue/orderedUnits
        // per SKU (MerchantSpring evidently holds this historically even though getSalesByProduct
        // could only be queried per-month during the original bake). Reconciles exactly: Cognitive
        // £6,845.25 + Calm £5,050.04 + Berry Fusion £975.40 + Creatine £741.61 + Discovery Pack
        // £368.38 + Melon Ice £61.41 + Citrus Lime £61.40 = £14,103.49, 423 units — matches the 12m
        // table total exactly (no more "BrainMatter combined" approximation needed).
        '12m': { all: [
          {name:'BrainMatter Cognitive',sales:'£6,845',units:183,pct:'49%',cvr:'7.2%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'BrainMatter Calm',sales:'£5,050',units:135,pct:'36%',cvr:'6.7%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Berry Fusion',sales:'£975',units:31,pct:'7%',cvr:'22.3%',cvrCls:'bg',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Pure Creatine Monohydrate',sales:'£742',units:33,pct:'5%',cvr:'12.7%',cvrCls:'bg',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes Discovery Pack',sales:'£368',units:37,pct:'3%',cvr:'4.6%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Melon Ice',sales:'£62',units:2,pct:'0%',cvr:'4.0%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Citrus Lime',sales:'£61',units:2,pct:'0%',cvr:'5.1%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'}
        ] }
      }
    }
  }
};
