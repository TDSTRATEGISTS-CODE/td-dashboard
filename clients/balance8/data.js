/* Balance 8 — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 05 Nov 2026 (channel 95589144, seller A3NEIOUENQO9V9),
   Amazon UK, native GBP. Two brands: "BrainMatter" (nootropic capsules — Cognitive + Calm, live
   since Sep 2025) and "WIRED" (sports nutrition — Creatine + 3 Electrolytes flavours + a Discovery
   Pack — new line, first sale 29 Aug 2026). dataSource.type is 'static' (no project-tracker sheet
   supplied yet — see config.js).

   ✅ Oct 2026 revenue/units CROSS-CHECK: getSalesByPeriod (£1,063.11 / 34 u) AGREES exactly with the
   summed getSalesByProduct rows (£1,063.11 / 34 u). Also reconciled for the 3m window (Aug–Oct: £3,873.77 /
   155 u) and the 12m window (Nov 25–Oct 26: £14,419.98 / 440 u) — per-SKU sums = monthly getSalesByPeriod sums.
   Revenue/units source this bake: getSalesByPeriod, confirmed by getSalesByProduct (third clean cycle in a
   row — keep cross-checking each cycle). Ad spend/ad sales/sessions/Buy Box come from getSalesByPeriod
   (monthly buckets need timezone GMT — Europe/London is rejected for interval 'M').
   (Per-SKU ad spend sums to £598.61 for Oct on a Europe/London-bucketed pull vs channel £588.33 (GMT
   buckets); over the 3m and 12m windows per-SKU and channel spend agree exactly (£946.64 / £3,724.07). The
   Oct Advertising table therefore shows the per-SKU rows as pulled plus an "other / unattributed" row for
   unallocated ad sales only; the headline uses the channel figure.)

   ⚠️ REAL FINDING — Balance 8 had ZERO sales Mar–Jul 2026 (5 months, confirmed via per-SKU pull, not
   a reporting gap — every SKU shows totalSales:0 / unitsSold:0 in each of those months individually).
   Cause is not visible in MerchantSpring data. Flagged as a task below; ask the client directly.

   ⚠️ Oct 2026: revenue £1,063 (−40% vs Sep £1,779) while ad spend more than doubled (£261 → £588), so TACOS
   jumped 14.6% → 55.3% and ROAS fell 1.38× → 0.93×. Cause is identifiable (not a data error): WIRED sales
   collapsed (£1,344 in Sep → £50 in Oct; Berry Fusion/Melon Ice/Citrus Lime £0) while BrainMatter ads were
   scaled up (BrainMatter revenue £435 → £1,013 but Calm ACOS 113%, Cognitive 105%).

   October 2026 P&L (getStoreProfitAndLoss, SETTLED basis, includeTax:false): product sales £745, promotions
   -£59, other income +£22 → net revenue £708 vs £964 of expenses (ad £575 + selling fees £287 + shipping/
   fulfilment £101) = -£256 net loss (-36.2%). COGS is £0 (not configured in MerchantSpring), so true
   profitability is lower once product cost is entered. Settled net loss flagged in the run log (#29).

   Monthly actuals used to build every window (GBP; getSalesByPeriod, cross-checked vs per-SKU for Aug/Sep/Oct):
     Nov 25  £2,458.70 · 62 u · 881 sess · BuyBox 94.3% · spend £692.70 · adSales £1,304.60 · ACOS 53.1% · TACOS 28.2%
     Dec 25  £3,261.32 · 91 u · 1,105 sess · BuyBox 98.1% · spend £794.45 · adSales £1,486.80 · ACOS 53.4% · TACOS 24.4%
     Jan 26  £4,010.72 · 111 u · 1,543 sess · BuyBox 98.4% · spend £1,103.00 · adSales £2,438.13 · ACOS 45.2% · TACOS 27.5%
     Feb 26  £815.47 · 21 u · 286 sess · BuyBox 97.4% · spend £187.28 · adSales £432.25 · ACOS 43.3% · TACOS 23.0%
     Mar–Jul 26  £0 every month, all SKUs — confirmed dead period (see finding above)
     Aug 26  £1,032.16 · 53 u · 448 sess · BuyBox 92.0% · spend £97.77 · adSales £71.64 · ACOS 136.5% · TACOS 9.5%
     Sep 26  £1,778.50 · 68 u · 1,340 sess · BuyBox 93.8% · spend £260.54 · adSales £359.31 · ACOS 72.5% · TACOS 14.6%
     Oct 26  £1,063.11 · 34 u · 680 sess · BuyBox 94.7% · spend £588.33 · adSales £549.20 · ACOS 107.1% · TACOS 55.3%
   (Oct 25 £746.62 / 17 u dropped out of the rolling 12m window this bake.)
   12m window Nov 25–Oct 26: £14,419.98 · 440 u · spend £3,724.07 · adSales £6,641.93 · 6,283 sessions.

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
  // ===== Last Month = October 2026 =====
  'may': {
    label: 'October 2026', shortLabel: 'Oct 2026',
    rev: '£1,063', revD: '▼ 40.2% vs Sep', revC: 'dd', revS: 'vs £1,779 Sep · WIRED sales slowed to £50',
    adSales: '£549', adSalesD: '51.7% of revenue', adSalesC: 'df', adSalesS: '£588 spend → £549 ad sales',
    tacos: '55.3%', tacosD: '▲ 40.7pp vs Sep (14.6%)', tacosC: 'dd', tacosS: 'Target <15%',
    roas: '0.93×', roasD: '▼ from 1.38× Sep', roasC: 'dd', roasS: '34 units · ASP £31.27',
    spend: '£588', spendD: '▲ 125.8% vs Sep (£261)', spendC: 'dd', spendS: 'vs £261 Sep',
    tacosAd: '55.3%', tacosAdD: '▲ 40.7pp vs Sep (14.6%)', tacosAdC: 'dd', tacosAdS: 'Target <15%',
    roasAd: '0.93×', roasAdD: 'ACOS 107.1%', roasAdC: 'dd', roasAdS: '£1,063 revenue',
    aov: '£31.27', aovD: 'ASP (per unit)', aovC: 'du', aovS: '34 units Oct — no order-count field exposed, see note',
    mktRows: [
      ['Amazon UK','gb','—','£588','bb','No budget set','£1,063','br','55.3%'],
      ['Total UK',null,'—','£588','bb','No budget set','£1,063','br','55.3%']
    ],
    revBreakChart: { max: 2000, yTicks: ['£2k','£1.5k','£1k','£500','£0'], xLabels: ['Oct'],
      series: [ { color:'#404935', values:[549] }, { color:'#a7ab90', values:[514] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:2000, yTicks:['£2k','£1.5k','£1k','£500','£0'], xLabels:['May','Jun','Jul','Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,0,0,1032,1779,1063],main:true,area:true}, {color:'#a7ab90',values:[0,0,0,98,261,588],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:2000, yTicks:['£2k','£1.5k','£1k','£500','£0'], xLabels:['May','Jun','Jul','Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[0,0,0,1032,1779,1063],main:true,area:true}, {color:'#a7ab90',values:[0,0,0,98,261,588],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'£549',acos:'107.1%'} ] },
  },
  // ===== Last 3 Months = Aug–Oct 2026 =====
  '3m': {
    label: 'Aug–Oct 2026', shortLabel: 'Aug–Oct 2026',
    rev: '£3,874', revD: '3-month total', revC: 'df', revS: 'Aug £1,032 · Sep £1,779 · Oct £1,063',
    adSales: '£980', adSalesD: '3-month total', adSalesC: 'df', adSalesS: '25.3% of revenue',
    tacos: '24.4%', tacosD: '3-month blended', tacosC: 'dd', tacosS: 'Target <15%',
    roas: '1.04×', roasD: '3-month avg', roasC: 'df', roasS: 'ad activity Aug–Oct',
    spend: '£947', spendD: '3-month total', spendC: 'df', spendS: 'Aug £98 · Sep £261 · Oct £588',
    tacosAd: '24.4%', tacosAdD: '3-month blended', tacosAdC: 'dd', tacosAdS: 'Target <15%',
    roasAd: '1.04×', roasAdD: '3-month avg', roasAdC: 'df', roasAdS: '£3,874 revenue',
    aov: '£24.99', aovD: '3-month ASP', aovC: 'df', aovS: '155 units total',
    mktRows: [
      ['Amazon UK','gb','—','£947','bb','No budget set','£3,874','ba','24.4%'],
      ['Total UK',null,'—','£947','bb','No budget set','£3,874','ba','24.4%']
    ],
    revBreakChart: { max: 2000, yTicks: ['£2k','£1.5k','£1k','£500','£0'], xLabels: ['Aug','Sep','Oct'],
      series: [ { color:'#404935', values:[72,359,549] }, { color:'#a7ab90', values:[960,1420,514] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:2000, yTicks:['£2k','£1.5k','£1k','£500','£0'], xLabels:['Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[1032,1779,1063],main:true,area:true}, {color:'#a7ab90',values:[98,261,588],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:2000, yTicks:['£2k','£1.5k','£1k','£500','£0'], xLabels:['Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[1032,1779,1063],main:true,area:true}, {color:'#a7ab90',values:[98,261,588],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'£980',acos:'96.6%'} ] },
    // Amazon P&L for this window (settled, summed per month — see sections.pnl note on basis).
    sec: { pnl: {
      summary: [ {val:'£1,311',lbl:'Net Revenue',color:'brand'}, {val:'£1,828',lbl:'Total Costs',color:'red'}, {val:'-£517',lbl:'Net Profit',color:'red'} ],
      margin: { pct:'-39.4%', pctColor:'red', note:'Aug–Oct 2026 (3-month) · financial basis (MerchantSpring, settled) · UK channel · COGS not configured', rows:[
        {lbl:'Net Revenue', val:'£1,311'},
        {lbl:'Advertising', val:'-£674', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-£1,154', color:'red'},
        {lbl:'COGS (not yet configured)', val:'£0', color:'red'},
        {lbl:'Net Profit', val:'-£517', color:'red', strong:true}
      ] },
      mkt: [
        {name:'United Kingdom',flag:'gb',revenue:'£1,311',adspend:'£674',net:'-£517',netColor:'red',margin:'-39.4%',marginCls:'br'}
      ],
      statement: {
        fixedLabel: 'Aug–Oct 2026 (3-month) · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag and bills ad spend in arrears, so the latest weeks are understated until settlement completes (settled ad spend £674 vs £947 in the ad console). COGS is not configured in MerchantSpring (£0 shown), so real profit is lower once product cost is entered.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales (ex-VAT)', amount:'£3,298', pct:'251.6%', unit:'£21.28'},
            {lbl:'Promotions & discounts', amount:'-£2,032', pct:'-155.0%', unit:'-£13.11'},
            {lbl:'Reimbursements & other income', amount:'£45', pct:'3.4%', unit:'£0.29'},
            {lbl:'Net revenue', amount:'£1,311', pct:'100.0%', unit:'£8.46',total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'£674', pct:'51.4%', unit:'£4.35'},
            {lbl:'Selling fees', amount:'£680', pct:'51.9%', unit:'£4.39'},
            {lbl:'Shipping & fulfilment fees', amount:'£474', pct:'36.1%', unit:'£3.06'},
            {lbl:'Cost of goods (not configured)', amount:'£0', pct:'0.0%', unit:'£0.00'},
            {lbl:'Total expenses', amount:'£1,828', pct:'139.4%', unit:'£11.79',total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'-£517', pct:'-39.4%', unit:'-£3.34', total:true, profit:true},
            {lbl:'Profit %', amount:'-39.4%', accent:'red'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'24.4%'},
            {lbl:'Ad spend (console)', amount:'£947'}
          ] }
        ]
      }
    } },
  },
  // ===== Last 12 Months = Nov 2025–Oct 2026 =====
  '12m': {
    label: 'Nov 2025 – Oct 2026', shortLabel: 'Last 12 Months',
    rev: '£14,420', revD: '12-month total', revC: 'df', revS: 'Jan 26 peak £4,011 · Mar–Jul 26 £0',
    adSales: '£6,642', adSalesD: '12-month total', adSalesC: 'df', adSalesS: '46.1% of revenue',
    tacos: '25.8%', tacosD: '12-month blended', tacosC: 'dd', tacosS: 'Target <15%',
    roas: '1.78×', roasD: '12-month avg', roasC: 'dd', roasS: '440 units total',
    spend: '£3,724', spendD: '12-month total', spendC: 'df', spendS: 'concentrated Nov 25–Feb 26 and Oct 26',
    tacosAd: '25.8%', tacosAdD: '12-month blended', tacosAdC: 'dd', tacosAdS: 'Target <15%',
    roasAd: '1.78×', roasAdD: '12-month avg', roasAdC: 'dd', roasAdS: '£14,420 revenue',
    aov: '£32.77', aovD: '12-month ASP', aovC: 'df', aovS: '440 units total',
    mktRows: [
      ['Amazon UK','gb','—','£3,724','bb','No budget set','£14,420','ba','25.8%'],
      ['Total UK',null,'—','£3,724','bb','No budget set','£14,420','ba','25.8%']
    ],
    revBreakChart: { max: 4000, yTicks: ['£4k','£3k','£2k','£1k','£0'], xLabels: ['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'],
      series: [ { color:'#404935', values:[1305,1487,2438,432,0,0,0,0,0,72,359,549] }, { color:'#a7ab90', values:[1154,1774,1573,383,0,0,0,0,0,960,1420,514] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:4000, yTicks:['£4k','£3k','£2k','£1k','£0'], xLabels:['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[2459,3261,4011,815,0,0,0,0,0,1032,1779,1063],main:true,area:true}, {color:'#a7ab90',values:[693,794,1103,187,0,0,0,0,0,98,261,588],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:4000, yTicks:['£4k','£3k','£2k','£1k','£0'], xLabels:['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[2459,3261,4011,815,0,0,0,0,0,1032,1779,1063],main:true,area:true}, {color:'#a7ab90',values:[693,794,1103,187,0,0,0,0,0,98,261,588],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'£6.6k',acos:'56.1%'} ] },
    // Amazon P&L for this window (settled, summed per month — see sections.pnl note on basis).
    sec: { pnl: {
      summary: [ {val:'£10,185',lbl:'Net Revenue',color:'brand'}, {val:'£6,841',lbl:'Total Costs',color:'red'}, {val:'£3,344',lbl:'Net Profit',color:'green'} ],
      margin: { pct:'32.8%', pctColor:'green', note:'Nov 2025 – Oct 2026 (12-month) · financial basis (MerchantSpring, settled) · UK channel · COGS not configured', rows:[
        {lbl:'Net Revenue', val:'£10,185'},
        {lbl:'Advertising', val:'-£3,550', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-£3,286', color:'red'},
        {lbl:'COGS (not yet configured)', val:'£0', color:'red'},
        {lbl:'Other adjustments', val:'-£5', color:'red'},
        {lbl:'Net Profit', val:'£3,344', color:'green', strong:true}
      ] },
      mkt: [
        {name:'United Kingdom',flag:'gb',revenue:'£10,185',adspend:'£3,550',net:'£3,344',netColor:'green',margin:'32.8%',marginCls:'bg'}
      ],
      statement: {
        fixedLabel: 'Nov 2025 – Oct 2026 (12-month) · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag and bills ad spend in arrears, so the latest weeks are understated until settlement completes (settled ad spend £3,550 vs £3,724 in the ad console). COGS is not configured in MerchantSpring (£0 shown), so real profit is lower once product cost is entered.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales (ex-VAT)', amount:'£12,615', pct:'123.9%', unit:'£28.67'},
            {lbl:'Refunds & returns', amount:'-£276', pct:'-2.7%', unit:'-£0.63'},
            {lbl:'Promotions & discounts', amount:'-£2,543', pct:'-25.0%', unit:'-£5.78'},
            {lbl:'Reimbursements & other income', amount:'£389', pct:'3.8%', unit:'£0.88'},
            {lbl:'Net revenue', amount:'£10,185', pct:'100.0%', unit:'£23.15',total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'£3,550', pct:'34.9%', unit:'£8.07'},
            {lbl:'Selling fees', amount:'£1,825', pct:'17.9%', unit:'£4.15'},
            {lbl:'Shipping & fulfilment fees', amount:'£1,460', pct:'14.3%', unit:'£3.32'},
            {lbl:'Cost of goods (not configured)', amount:'£0', pct:'0.0%', unit:'£0.00'},
            {lbl:'Refund/return handling', amount:'£5', pct:'0.1%', unit:'£0.01'},
            {lbl:'Total expenses', amount:'£6,841', pct:'67.2%', unit:'£15.55',total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'£3,344', pct:'32.8%', unit:'£7.60', total:true, profit:true},
            {lbl:'Profit %', amount:'32.8%', accent:'green'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'25.8%'},
            {lbl:'Ad spend (console)', amount:'£3,724'}
          ] }
        ]
      }
    } },
  },
  },

  // ---- Deep-page content (rendered once at boot; October 2026 snapshot) ----
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
      // No per-ASIN Buy Box rows are baked — each group shown at ~the Oct 2026 channel rate (94.7%),
      // same limitation noted in Abimax's data.js.
      buyBox: [
        {label:'BrainMatter Cognitive', pct:95, color:'green'},
        {label:'BrainMatter Calm', pct:95, color:'green'},
        {label:'WIRED Electrolytes', pct:95, color:'green'},
        {label:'WIRED Creatine + Discovery Pack', pct:95, color:'green'}
      ],
      buyBoxHeadline: { pctTxt:'94.7%', delta:'▲ 0.9pp vs Sep', deltaCls:'du' },
      cvr: { val:'5.0%', note:'October 2026 · 680 sessions', sub:'UK · session conversion' },
      // ---- Overview cards — baked WEEKLY (config.overviewSource:'notion'; runbook tools/weekly-overview.routine.md) ----
      // First baked 12 Oct 2026 (review used as approved for this run by Ryan's instruction). The sheet-era
      // tasksSpec / flagsSpec / completedSpec above are ignored while overviewSource is 'notion'.
      // healthMgmtSpec ← "Balance 8 — Client Notes (dashboard & reports)" task › Account Health (Approved — Solei, 5 Nov 2026;
      //                  based on the 02 Nov 2026 Account Health Review); includes the ✅ Healthy line for UK (SOP rule).
      // adsStrategySpec ← same task › Advertising (fixed format: Overall, Best seller, Conversion, Flags, Budget + 2 Done).
      // stockWarn      ← Balance8_UK_sku-sync_2026-11-16 (MerchantSpring, 17 Oct–15 Nov 2026, FBA). Thresholds ≤21d / soon ≤45d.
      //                  Health and ads held at the 5 Nov approval (Client Notes approval >10 days old on 19 Nov; stock only refreshed).
      healthMgmtSpec: { badge:'1 open', subLabel:'Weekly review · 2 Nov 2026', items:[
        {level:'amber',title:'UK — Sales',sub:'In progress · BrainMatter is carrying the range'},
        {level:'green',title:'UK — Account Health',sub:'Healthy · all metrics within Amazon\'s targets'}
      ] },
      adsStrategySpec: { badge:'Launch phase', subLabel:'Weekly review · 4 Nov 2026', items:[
        {level:'amber',title:'UK — Flags',sub:'In progress · WIRED push runs to 20 Nov: few shoppers reached, no orders yet. BrainMatter Calm ad spend is above sales from ads (4 weeks to 21 Oct)'},
        {level:'muted',title:'UK — Overall',sub:'TACoS 55% (4 weeks to 21 Oct) against a 30% launch ceiling (to 31 Jan)'},
        {level:'muted',title:'UK — Best seller',sub:'BrainMatter Calm, £491 from 15 units (3 Oct–1 Nov, incl. VAT)'},
        {level:'muted',title:'UK — Conversion',sub:'5.0% UK session conversion (October 2026, 680 sessions)'},
        {level:'muted',title:'UK — Budget',sub:'November budget £700; £62 spent 1–3 Nov'},
        {level:'green',title:'UK — WIRED bids raised on high-intent searches',sub:'Done 29 Oct'},
        {level:'green',title:'UK — WIRED ads focused on three products',sub:'Done 29 Oct'}
      ] },
      stockWarn: { title:'&#128230; Logistics &amp; Operations', badge:'1 stock-up · 0 OOS', subLabel:'SKU sync · UK FBA stock · 16 Nov 2026', items:[
        {level:'amber',title:'WIRED Electrolytes Melon Ice — stock-up soon',sub:'B0HD7JBLVY · UK · ~40 days cover · 40 units'}
      ] }
    },
    // Amazon P&L — ACTIVE (un-gated Oct 2026, see config.js hiddenPages). Basis: getStoreProfitAndLoss,
    // profitabilityView 'settled', includeTax:false (so Product sales is ex-VAT and the Income lines
    // foot exactly to Net revenue), pulled per month (endpoint is ~31-day capped) and summed for the
    // multi-month windows. sections.pnl = Last Month (Oct 2026); dateRanges['3m'|'12m'].sec.pnl = the
    // other windows. COGS is NOT configured in MerchantSpring (£0) so profit/margin are overstated vs
    // true profit. Settled timing: Sep orders settle into Oct, and ad spend is billed in arrears
    // (settled Oct ad £575 vs £588 console), so single-month figures swing — read the 12-month view.
    // Monthly settled net (rev − exp): Nov +849 · Dec +1,175 · Jan +1,000 · Feb +914 · Mar −142 ·
    // Apr +67 · May–Jul ~£0 · Aug −1 · Sep −260 · Oct −256 (Oct: settled net LOSS — ad £575 vs net revenue £708).
    pnl: {
      summary: [ {val:'£708',lbl:'Net Revenue',color:'brand'}, {val:'£964',lbl:'Total Costs',color:'red'}, {val:'-£256',lbl:'Net Profit',color:'red'} ],
      margin: { pct:'-36.2%', pctColor:'red', note:'October 2026 (31-day) · financial basis (MerchantSpring, settled) · UK channel · COGS not configured', rows:[
        {lbl:'Net Revenue', val:'£708'},
        {lbl:'Advertising', val:'-£575', color:'red'},
        {lbl:'Selling & Shipping Fees', val:'-£389', color:'red'},
        {lbl:'COGS (not yet configured)', val:'£0', color:'red'},
        {lbl:'Net Profit', val:'-£256', color:'red', strong:true}
      ] },
      mkt: [
        {name:'United Kingdom',flag:'gb',revenue:'£708',adspend:'£575',net:'-£256',netColor:'red',margin:'-36.2%',marginCls:'br'}
      ],
      statement: {
        fixedLabel: 'October 2026 (1–31) · financial basis (MerchantSpring, settled)',
        caveat: 'Settled (cash) basis — Amazon settles orders on a ~2-week lag and bills ad spend in arrears, so the latest weeks are understated until settlement completes (settled ad spend £575 vs £588 in the ad console). COGS is not configured in MerchantSpring (£0 shown), so real profit is lower once product cost is entered.',
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales (ex-VAT)', amount:'£745', pct:'105.2%', unit:'£21.90'},
            {lbl:'Promotions & discounts', amount:'-£59', pct:'-8.3%', unit:'-£1.73'},
            {lbl:'Reimbursements & other income', amount:'£22', pct:'3.1%', unit:'£0.65'},
            {lbl:'Net revenue', amount:'£708', pct:'100.0%', unit:'£20.82',total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'£575', pct:'81.2%', unit:'£16.92'},
            {lbl:'Selling fees', amount:'£287', pct:'40.6%', unit:'£8.45'},
            {lbl:'Shipping & fulfilment fees', amount:'£101', pct:'14.3%', unit:'£2.98'},
            {lbl:'Cost of goods (not configured)', amount:'£0', pct:'0.0%', unit:'£0.00'},
            {lbl:'Total expenses', amount:'£964', pct:'136.2%', unit:'£28.35',total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'-£256', pct:'-36.2%', unit:'-£7.53', total:true, profit:true},
            {lbl:'Profit %', amount:'-36.2%', accent:'red'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'55.3%'},
            {lbl:'Ad spend (console)', amount:'£588'}
          ] }
        ]
      }
    },
    advertising: {
      // Oct 2026 channel ad totals (MerchantSpring channel report, UK, GBP): spend £588.33 · ad sales
      // £549.20 → ACOS 107.1% · ROAS 0.93×. Per-SKU rows below are the real MerchantSpring per-product
      // figures for Oct (spend £598.61 / sales £494.28 — per-SKU spend is £10 ABOVE the channel total
      // because the per-product pull is bucketed Europe/London vs GMT for the channel monthly report; over
      // 3m/12m the two agree exactly). The "other / unattributed" row therefore carries only the ad sales
      // not attributed to a SKU (£54.92), with £0 spend. WIRED ran £52 of spend with £0 attributed sales.
      //
      // campaignsByPeriod: period-aware (app.js checks campaignsByPeriod[currentPeriod] first).
      //   may: Oct per-SKU. 3m: Aug–Oct per-SKU pulled as one window (spend £946.64 = channel exactly;
      //   other row = remaining channel ad sales £175.42). 12m: one aggregate row —
      //   per-SKU ad detail was not pulled per month, so a split would be invented.
      metrics: [
        {lbl:'Total Spend',  val:'£588', id:'a-spend'},
        {lbl:'Ad Sales',     val:'£549', color:'brand'},
        {lbl:'ACOS',         val:'107.1%',  color:'red', id:'a-tacos'},
        {lbl:'ROAS',         val:'0.93×',  color:'red', id:'a-roas'},
        {lbl:'Impressions',  val:'67.4K'},
        {lbl:'Avg. CPC',     val:'£2.06'}
      ],
      campaigns: [
        {name:'UK · BrainMatter Calm — SP',type:'Sponsored Products',spend:'£374',sales:'£330',acos:'113.5%',acosCls:'br',roas:'0.88×',cpc:'£2.38',status:'Active',statusCls:'bg'},
        {name:'UK · BrainMatter Cognitive — SP',type:'Sponsored Products',spend:'£173',sales:'£165',acos:'104.7%',acosCls:'br',roas:'0.95×',cpc:'£1.69',status:'Active',statusCls:'bg'},
        {name:'UK · WIRED Creatine — SP',type:'Sponsored Products',spend:'£25',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.70',status:'Active',statusCls:'bg'},
        {name:'UK · WIRED Berry Fusion — SP',type:'Sponsored Products',spend:'£18',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.36',status:'Active',statusCls:'bg'},
        {name:'UK · WIRED Discovery Pack — SP',type:'Sponsored Products',spend:'£9',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.26',status:'Active',statusCls:'bg'},
        {name:'UK · Other / unattributed (channel remainder)',type:'Sponsored Products',spend:'£0',sales:'£55',acos:'—',acosCls:'bg',roas:'—',cpc:'—',status:'Active',statusCls:'bg'}
      ],
      campaignsByPeriod: {
        may: [
          {name:'UK · BrainMatter Calm — SP',type:'Sponsored Products',spend:'£374',sales:'£330',acos:'113.5%',acosCls:'br',roas:'0.88×',cpc:'£2.38',status:'Active',statusCls:'bg'},
          {name:'UK · BrainMatter Cognitive — SP',type:'Sponsored Products',spend:'£173',sales:'£165',acos:'104.7%',acosCls:'br',roas:'0.95×',cpc:'£1.69',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Creatine — SP',type:'Sponsored Products',spend:'£25',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.70',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Berry Fusion — SP',type:'Sponsored Products',spend:'£18',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.36',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Discovery Pack — SP',type:'Sponsored Products',spend:'£9',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.26',status:'Active',statusCls:'bg'},
          {name:'UK · Other / unattributed (channel remainder)',type:'Sponsored Products',spend:'£0',sales:'£55',acos:'—',acosCls:'bg',roas:'—',cpc:'—',status:'Active',statusCls:'bg'}
        ],
        '3m': [
          {name:'UK · BrainMatter Calm — SP',type:'Sponsored Products',spend:'£543',sales:'£493',acos:'110.0%',acosCls:'br',roas:'0.91×',cpc:'£1.85',status:'Active',statusCls:'bg'},
          {name:'UK · BrainMatter Cognitive — SP',type:'Sponsored Products',spend:'£311',sales:'£312',acos:'99.7%',acosCls:'br',roas:'1.00×',cpc:'£1.56',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Creatine — SP',type:'Sponsored Products',spend:'£48',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.50',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Berry Fusion — SP',type:'Sponsored Products',spend:'£30',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.23',status:'Active',statusCls:'bg'},
          {name:'UK · WIRED Discovery Pack — SP',type:'Sponsored Products',spend:'£16',sales:'£0',acos:'—',acosCls:'br',roas:'0.0×',cpc:'£1.13',status:'Active',statusCls:'bg'},
          {name:'UK · Other / unattributed (channel remainder)',type:'Sponsored Products',spend:'£0',sales:'£175',acos:'—',acosCls:'bg',roas:'—',cpc:'—',status:'Active',statusCls:'bg'}
        ],
        '12m': [
          {name:'UK · All Sponsored Products (12-month)',type:'Sponsored Products',spend:'£3,724',sales:'£6,642',acos:'56.1%',acosCls:'ba',roas:'1.78×',cpc:'—',status:'Active',statusCls:'bg'}
        ]
      }
    },
    inventory: {
      // Real FBA stock snapshot from the MerchantSpring product report (qty + days-cover per ASIN,
      // 05 Nov 2026). All 7 selling ASINs are in stock, 0 OOS. No SKU is on stock-up watch: Calm has the
      // lowest cover (~152 days MerchantSpring) and WIRED Berry Fusion (41 units) made no sales in Oct.
      // No dispatch-rate source → the Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'7',dCls:'du',d:'ASINs · 0 OOS',s:'all listings live'},
        {bar:'#404935',lbl:'Units on Hand',val:'430',dCls:'df',d:'FBA total',s:'across 7 SKUs'},
        {bar:'green',lbl:'Stock-up Watch',val:'0',dCls:'du',d:'none flagged',s:'lowest cover ~152 days (Calm)'},
        {bar:'green',lbl:'Buy Box (Oct)',val:'94.7%',dCls:'du',d:'▲ 0.9pp vs Sep',s:'channel rate'}
      ],
      stock: [
        {dot:'dg',name:'BrainMatter Calm',note:'B0DS8X7RH8 · UK · sold 16 in Oct',units:'76 units',days:'~152 days'},
        {dot:'dg',name:'BrainMatter Cognitive',note:'B0DS8V2T97 · UK · sold 15 in Oct',units:'80 units',days:'~200 days'},
        {dot:'dg',name:'WIRED Electrolytes — Berry Fusion',note:'B0HD7RFZN4 · UK · no Oct sales',units:'41 units',days:'— (no Oct sales)'},
        {dot:'dg',name:'WIRED Pure Creatine Monohydrate',note:'B0HD7ZKMZZ · UK · sold 2 in Oct',units:'37 units',days:'~555 days'},
        {dot:'dg',name:'WIRED Electrolytes Discovery Pack',note:'B0HD7XTQ3H · UK · sold 1 in Oct',units:'56 units',days:'~1,461 days (MS cap)'},
        {dot:'dg',name:'WIRED Electrolytes — Melon Ice',note:'B0HD7JBLVY · UK · no Oct sales',units:'70 units',days:'— (no Oct sales)'},
        {dot:'dg',name:'WIRED Electrolytes — Citrus Lime',note:'B0HD7WP7VT · UK · no Oct sales',units:'70 units',days:'— (no Oct sales)'}
      ],
      restock: []
    },
    products: {
      // KPIs + by-market table + groups below are the static (May-period) fallback; the *ByPeriod
      // variants are what app.js reads first (see advertising.campaignsByPeriod).
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'4',dCls:'dd',d:'sold in Oct',s:'4 of 7 live SKUs sold · 3 Electrolytes flavours £0'},
        {bar:'var(--green)',lbl:'Top Product Rev.',val:'£524',dCls:'du',d:'BrainMatter Calm',s:'49% of Oct sales'},
        {bar:'var(--blue)',lbl:'Units (Oct)',val:'34',dCls:'dd',d:'▼ from 68 (Sep)',s:'WIRED units 3 (Sep 56)'},
        {bar:'var(--amber)',lbl:'ASP',val:'£31.27',dCls:'du',d:'per unit',s:'no order-count field exposed'}
      ],
      kpisByPeriod: {
        may: { all: [
          {bar:'#404935',lbl:'Active SKUs',val:'4',dCls:'dd',d:'sold in Oct',s:'4 of 7 live SKUs sold · 3 Electrolytes flavours £0'},
          {bar:'var(--green)',lbl:'Top Product Rev.',val:'£524',dCls:'du',d:'BrainMatter Calm',s:'49% of Oct sales'},
          {bar:'var(--blue)',lbl:'Units (Oct)',val:'34',dCls:'dd',d:'▼ from 68 (Sep)',s:'WIRED units 3 (Sep 56)'},
          {bar:'var(--amber)',lbl:'ASP',val:'£31.27',dCls:'du',d:'per unit',s:'no order-count field exposed'}
        ] },
        '3m': { all: [
          {bar:'#404935',lbl:'Active SKUs',val:'7',dCls:'df',d:'sold in Aug–Oct',s:'Aug 4 SKUs · Sep 7 SKUs · Oct 4 SKUs'},
          {bar:'var(--green)',lbl:'Top Product Rev.',val:'£975',dCls:'du',d:'WIRED Berry Fusion',s:'25% of 3-month sales'},
          {bar:'var(--blue)',lbl:'Units (3m)',val:'155',dCls:'du',d:'3-month total',s:'Aug 53 · Sep 68 · Oct 34'},
          {bar:'var(--amber)',lbl:'ASP',val:'£24.99',dCls:'df',d:'3-month ASP',s:'per unit'}
        ] },
        // 12-month figures reconcile per-SKU (trafficAndConversion + getSalesByProduct over the full window,
        // FBA+FBM merged by ASIN): Cognitive £6,840.78 + Calm £5,321.14 + Berry £975.40 + Creatine £782.50 +
        // Discovery £377.35 + Melon £61.41 + Citrus £61.40 = £14,419.98, 440 units = headline exactly.
        '12m': { all: [
          {bar:'#404935',lbl:'Active SKUs',val:'7',dCls:'df',d:'sold in last 12mo',s:'all 7 live SKUs have sold'},
          {bar:'var(--green)',lbl:'Top Product Rev.',val:'£6,841',dCls:'du',d:'BrainMatter Cognitive',s:'47% of 12-month sales'},
          {bar:'var(--blue)',lbl:'Units (12m)',val:'440',dCls:'df',d:'12-month total',s:'Jan 26 peak month'},
          {bar:'var(--amber)',lbl:'ASP',val:'£32.77',dCls:'df',d:'12-month ASP',s:'440 units total'}
        ] }
      },
      table: [
        {name:'United Kingdom',flag:'gb',revenue:'£1,063',units:'34',orders:'~34*',cvr:'5.0%',cvrCls:'ba',aov:'£31.27'}
      ],
      tableByPeriod: {
        may: [ {name:'United Kingdom',flag:'gb',revenue:'£1,063',units:'34',orders:'~34*',cvr:'5.0%',cvrCls:'ba',aov:'£31.27'} ],
        '3m': [ {name:'United Kingdom',flag:'gb',revenue:'£3,874',units:'155',orders:'~155*',cvr:'6.3%',cvrCls:'ba',aov:'£24.99'} ],
        // Sessions summed across the 12 months (881 Nov + 1,105 Dec + 1,543 Jan + 286 Feb + 0 Mar–Jul +
        // 448 Aug + 1,340 Sep + 680 Oct = 6,283); CVR = units/sessions (440/6,283).
        '12m': [ {name:'United Kingdom',flag:'gb',revenue:'£14,420',units:'440',orders:'~440*',cvr:'7.0%',cvrCls:'ba',aov:'£32.77'} ]
      },
      // October 2026 sales by product (real MerchantSpring product report, UK, FBA+FBM combined per
      // ASIN). Whole-£ values use largest-remainder rounding so the group sum equals the table total.
      // cvr (per-SKU, session-based — units ÷ sessions) pulled 05 Nov 2026 via
      // generateReport(report_type:'trafficAndConversion', view:'skus') per window (CSV unitsPerSession);
      // getSalesByProduct has no per-SKU session count. cvrCls thresholds: ≥10% green, 4–9.99% amber, <4% red.
      groups: [
        {name:'BrainMatter Calm',sales:'£524',units:16,pct:'49%',adSpend:'£374',tacos:'71.4%',tacosCls:'br',cvr:'7.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
        {name:'BrainMatter Cognitive',sales:'£489',units:15,pct:'46%',adSpend:'£173',tacos:'35.3%',tacosCls:'br',cvr:'8.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Pure Creatine Monohydrate',sales:'£41',units:2,pct:'4%',adSpend:'£25',tacos:'62.3%',tacosCls:'br',cvr:'2.4%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Electrolytes Discovery Pack',sales:'£9',units:1,pct:'1%',adSpend:'£9',tacos:'98.4%',tacosCls:'br',cvr:'1.2%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Electrolytes — Berry Fusion',sales:'£0',units:0,pct:'0%',adSpend:'£18',tacos:'—',tacosCls:'br',cvr:'0.0%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Electrolytes — Melon Ice',sales:'£0',units:0,pct:'0%',adSpend:'£0',tacos:'—',tacosCls:'bg',cvr:'0.0%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
        {name:'WIRED Electrolytes — Citrus Lime',sales:'£0',units:0,pct:'0%',adSpend:'£0',tacos:'—',tacosCls:'bg',cvr:'0.0%',cvrCls:'br',oosRate:'0%',oosCls:'bg'}
      ],
      groupsByPeriod: {
        may: { all: [
          {name:'BrainMatter Calm',sales:'£524',units:16,pct:'49%',adSpend:'£374',tacos:'71.4%',tacosCls:'br',cvr:'7.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'BrainMatter Cognitive',sales:'£489',units:15,pct:'46%',adSpend:'£173',tacos:'35.3%',tacosCls:'br',cvr:'8.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Pure Creatine Monohydrate',sales:'£41',units:2,pct:'4%',adSpend:'£25',tacos:'62.3%',tacosCls:'br',cvr:'2.4%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes Discovery Pack',sales:'£9',units:1,pct:'1%',adSpend:'£9',tacos:'98.4%',tacosCls:'br',cvr:'1.2%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Berry Fusion',sales:'£0',units:0,pct:'0%',adSpend:'£18',tacos:'—',tacosCls:'br',cvr:'0.0%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Melon Ice',sales:'£0',units:0,pct:'0%',adSpend:'£0',tacos:'—',tacosCls:'bg',cvr:'0.0%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Citrus Lime',sales:'£0',units:0,pct:'0%',adSpend:'£0',tacos:'—',tacosCls:'bg',cvr:'0.0%',cvrCls:'br',oosRate:'0%',oosCls:'bg'}
        ] },
        '3m': { all: [
          {name:'WIRED Electrolytes — Berry Fusion',sales:'£975',units:31,pct:'25%',adSpend:'£30',tacos:'3.0%',tacosCls:'bg',cvr:'15.6%',cvrCls:'bg',oosRate:'0%',oosCls:'bg'},
          {name:'BrainMatter Calm',sales:'£838',units:24,pct:'22%',adSpend:'£543',tacos:'64.7%',tacosCls:'br',cvr:'5.4%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Pure Creatine Monohydrate',sales:'£783',units:35,pct:'20%',adSpend:'£48',tacos:'6.1%',tacosCls:'bg',cvr:'10.2%',cvrCls:'bg',oosRate:'0%',oosCls:'bg'},
          {name:'BrainMatter Cognitive',sales:'£778',units:23,pct:'20%',adSpend:'£311',tacos:'39.9%',tacosCls:'br',cvr:'5.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes Discovery Pack',sales:'£377',units:38,pct:'10%',adSpend:'£16',tacos:'4.2%',tacosCls:'bg',cvr:'4.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Melon Ice',sales:'£62',units:2,pct:'2%',adSpend:'£0',tacos:'0.0%',tacosCls:'bg',cvr:'2.4%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Citrus Lime',sales:'£61',units:2,pct:'2%',adSpend:'£0',tacos:'0.0%',tacosCls:'bg',cvr:'3.3%',cvrCls:'br',oosRate:'0%',oosCls:'bg'}
        ] },
        // Real per-SKU 12m split (same trafficAndConversion pull as CVR; window Nov 2025–Oct 2026).
        // Reconciles exactly to the 12m table total (£14,420 / 440 units).
        '12m': { all: [
          {name:'BrainMatter Cognitive',sales:'£6,841',units:187,pct:'47%',cvr:'7.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'BrainMatter Calm',sales:'£5,321',units:145,pct:'37%',cvr:'6.8%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Berry Fusion',sales:'£975',units:31,pct:'7%',cvr:'15.6%',cvrCls:'bg',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Pure Creatine Monohydrate',sales:'£783',units:35,pct:'5%',cvr:'10.2%',cvrCls:'bg',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes Discovery Pack',sales:'£377',units:38,pct:'3%',cvr:'4.3%',cvrCls:'ba',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Melon Ice',sales:'£62',units:2,pct:'0%',cvr:'2.4%',cvrCls:'br',oosRate:'0%',oosCls:'bg'},
          {name:'WIRED Electrolytes — Citrus Lime',sales:'£61',units:2,pct:'0%',cvr:'3.3%',cvrCls:'br',oosRate:'0%',oosCls:'bg'}
        ] }
      }
    }
  }
};

/* PREV-MONTH-START — month-on-month comparison rows for the Products tables (September 2026); see tools/bake-prev-month.js */
(function () { var P = window.DASHBOARD_DATA && window.DASHBOARD_DATA.sections && window.DASHBOARD_DATA.sections.products;
  if (P) P.prevMonth = {"table":[{"name":"United Kingdom","flag":"gb","revenue":"£1,779","units":"68","orders":"~68*","cvr":"5.1%","cvrCls":"ba","aov":"£26.15"}],"groups":{"all":[{"name":"WIRED Electrolytes — Berry Fusion","sales":"£975","units":31,"pct":"55%","adSpend":"£12","tacos":"1.2%","tacosCls":"bg","cvr":"23.9%","cvrCls":"bg","oosRate":"0%","oosCls":"bg"},{"name":"BrainMatter Cognitive","sales":"£250","units":7,"pct":"14%","adSpend":"£109","tacos":"43.6%","tacosCls":"br","cvr":"4.5%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"BrainMatter Calm","sales":"£185","units":5,"pct":"10%","adSpend":"£102","tacos":"55.2%","tacosCls":"br","cvr":"3.4%","cvrCls":"br","oosRate":"0%","oosCls":"bg"},{"name":"WIRED Electrolytes Discovery Pack","sales":"£179","units":18,"pct":"10%","adSpend":"£7","tacos":"3.9%","tacosCls":"bg","cvr":"2.6%","cvrCls":"br","oosRate":"0%","oosCls":"bg"},{"name":"WIRED Pure Creatine Monohydrate","sales":"£67","units":3,"pct":"4%","adSpend":"£23","tacos":"33.8%","tacosCls":"br","cvr":"2.4%","cvrCls":"br","oosRate":"0%","oosCls":"bg"},{"name":"WIRED Electrolytes — Melon Ice","sales":"£62","units":2,"pct":"3%","adSpend":"£0","tacos":"0.0%","tacosCls":"bg","cvr":"5.3%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"WIRED Electrolytes — Citrus Lime","sales":"£61","units":2,"pct":"3%","adSpend":"£0","tacos":"0.0%","tacosCls":"bg","cvr":"6.3%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"}]}}; })();
/* PREV-MONTH-END */

/* WAREHOUSE-START — numbers from the TDS Data Warehouse, data to 2026-11-23; see tools/warehouse/run.js */
(function () { var D = window.DASHBOARD_DATA; if (!D || !D.dateRanges) return;
  var O = {"mtd":{"label":"Month to date (1–23 Nov 2026)","shortLabel":"1–23 Nov","dataTo":"2026-11-23","rev":"£2,544","revD":"▲ 205.0% vs 1–23 Oct","revC":"du","revS":"vs £834 1–23 Oct","adSales":"£193","adSalesD":"7.6% of revenue","adSalesC":"df","adSalesS":"£493 spend → £193 ad sales · ad sales still settling (up to 14 days)","spend":"£493","spendD":"▲ 16.1% vs 1–23 Oct (£424)","spendC":"dd","spendS":"vs £424 1–23 Oct","tacos":"19.4%","tacosD":"▼ 31.5pp vs 1–23 Oct (50.9%)","tacosC":"du","tacosS":"Target <15%","roas":"0.39×","roasD":"▼ from 1.10× 1–23 Oct","roasC":"dd","roasS":"ad sales still settling (up to 14 days)","tacosAd":"19.4%","tacosAdD":"▼ 31.5pp vs 1–23 Oct (50.9%)","tacosAdC":"du","tacosAdS":"Target <15%","roasAd":"0.39×","roasAdD":"ACOS 255.1%","roasAdC":"dd","roasAdS":"ad sales still settling (up to 14 days)","aov":"£28.27","aovD":"ASP (per unit)","aovC":"df","aovS":"90 units","mktRows":[["Amazon UK","gb","—","£493","bb","No budget set","£2,544","br","19.4%"],["Total UK",null,"—","£493","bb","No budget set","£2,544","br","19.4%"]],"revChart":{"max":1000,"yTicks":["£1k","£750","£500","£250","£0"],"xLabels":["1 Nov","","","","","6 Nov","","","","","11 Nov","","","","","16 Nov","","","","","","","23 Nov"],"xHighlight":"#404935","grain":"day","subtitle":"Daily revenue and ad spend · 1–23 Nov","series":[{"color":"#404935","values":[33,33,0,0,84,33,33,0,84,0,689,315,96,0,0,33,90,481,288,196,0,28,28],"main":true,"area":true,"dots":false},{"color":"#a7ab90","values":[21,19,22,18,33,22,18,23,14,14,29,25,24,22,26,31,18,20,14,16,2,30,32],"dash":true,"dots":false}],"legend":[{"name":"Revenue (daily)","color":"#404935"},{"name":"Ad Spend (daily)","color":"#a7ab90"}]},"adChart":{"max":1000,"yTicks":["£1k","£750","£500","£250","£0"],"xLabels":["1 Nov","","","","","6 Nov","","","","","11 Nov","","","","","16 Nov","","","","","","","23 Nov"],"xHighlight":"#404935","grain":"day","subtitle":"Daily revenue and ad spend · 1–23 Nov","series":[{"color":"#404935","values":[33,33,0,0,84,33,33,0,84,0,689,315,96,0,0,33,90,481,288,196,0,28,28],"main":true,"area":true,"dots":false},{"color":"#a7ab90","values":[21,19,22,18,33,22,18,23,14,14,29,25,24,22,26,31,18,20,14,16,2,30,32],"dash":true,"dots":false}],"legend":[{"name":"Revenue (daily)","color":"#404935"},{"name":"Ad Spend (daily)","color":"#a7ab90"}]},"revBreakChart":{"max":4000,"yTicks":["£4k","£3k","£2k","£1k","£0"],"xLabels":["Nov"],"series":[{"color":"#404935","values":[193]},{"color":"#a7ab90","values":[2351]}],"legend":[{"name":"Ad sales","color":"#404935"},{"name":"Organic","color":"#a7ab90"}]},"campaignMix":{"slices":[{"name":"Sponsored Products","color":"#404935","pct":100,"sales":"£193","acos":"255.1%"}]},"sec":{"advertising":{"metrics":[{"lbl":"Total Spend","val":"£493","id":"a-spend"},{"lbl":"Ad Sales","val":"£193","color":"brand"},{"lbl":"ACOS","val":"255.1%","color":"red","id":"a-tacos"},{"lbl":"ROAS","val":"0.39×","color":"red","id":"a-roas"},{"lbl":"Impressions","val":"59.4K"},{"lbl":"Avg. CPC","val":"£2.44"}]},"overview":{"cvr":{"val":"14.7%","note":"Month to date (1–23 Nov 2026) · 606 sessions","sub":"UK · session conversion"}}},"sectionFallback":"may"},"may":{"label":"October 2026","shortLabel":"Oct 2026","dataTo":"2026-10-31","rev":"£1,063","revD":"▼ 40.2% vs Sep","revC":"dd","revS":"vs £1,779 Sep","adSales":"£577","adSalesD":"54.2% of revenue","adSalesC":"df","adSalesS":"£599 spend → £577 ad sales","spend":"£599","spendD":"▲ 137.2% vs Sep (£252)","spendC":"dd","spendS":"vs £252 Sep","tacos":"56.3%","tacosD":"▲ 42.1pp vs Sep (14.2%)","tacosC":"dd","tacosS":"Target <15%","roas":"0.96×","roasD":"▼ from 1.34× Sep","roasC":"dd","roasS":"34 units · ASP £31.27","tacosAd":"56.3%","tacosAdD":"▲ 42.1pp vs Sep (14.2%)","tacosAdC":"dd","tacosAdS":"Target <15%","roasAd":"0.96×","roasAdD":"ACOS 103.8%","roasAdC":"dd","roasAdS":"£1,063 revenue","aov":"£31.27","aovD":"ASP (per unit)","aovC":"df","aovS":"34 units","mktRows":[["Amazon UK","gb","—","£599","bb","No budget set","£1,063","br","56.3%"],["Total UK",null,"—","£599","bb","No budget set","£1,063","br","56.3%"]],"revChart":{"max":500,"yTicks":["£500","£375","£250","£125","£0"],"xLabels":["1 Oct","","","","","6 Oct","","","","","11 Oct","","","","","16 Oct","","","","","21 Oct","","","","","26 Oct","","","","","31 Oct"],"xHighlight":"#404935","grain":"day","subtitle":"Daily revenue and ad spend · Oct 2026","series":[{"color":"#404935","values":[66,66,0,0,33,33,0,33,66,97,64,64,66,41,33,9,33,0,0,0,33,33,64,33,66,0,0,0,64,66,0],"main":true,"area":true,"dots":false},{"color":"#a7ab90","values":[10,10,10,10,18,20,10,9,7,18,16,18,33,23,29,31,31,19,32,29,16,7,18,35,16,24,22,19,11,22,27],"dash":true,"dots":false}],"legend":[{"name":"Revenue (daily)","color":"#404935"},{"name":"Ad Spend (daily)","color":"#a7ab90"}]},"adChart":{"max":500,"yTicks":["£500","£375","£250","£125","£0"],"xLabels":["1 Oct","","","","","6 Oct","","","","","11 Oct","","","","","16 Oct","","","","","21 Oct","","","","","26 Oct","","","","","31 Oct"],"xHighlight":"#404935","grain":"day","subtitle":"Daily revenue and ad spend · Oct 2026","series":[{"color":"#404935","values":[66,66,0,0,33,33,0,33,66,97,64,64,66,41,33,9,33,0,0,0,33,33,64,33,66,0,0,0,64,66,0],"main":true,"area":true,"dots":false},{"color":"#a7ab90","values":[10,10,10,10,18,20,10,9,7,18,16,18,33,23,29,31,31,19,32,29,16,7,18,35,16,24,22,19,11,22,27],"dash":true,"dots":false}],"legend":[{"name":"Revenue (daily)","color":"#404935"},{"name":"Ad Spend (daily)","color":"#a7ab90"}]},"revBreakChart":{"max":1000,"yTicks":["£1k","£750","£500","£250","£0"],"xLabels":["Oct"],"series":[{"color":"#404935","values":[577]},{"color":"#a7ab90","values":[486]}],"legend":[{"name":"Ad sales","color":"#404935"},{"name":"Organic","color":"#a7ab90"}]},"campaignMix":{"slices":[{"name":"Sponsored Products","color":"#404935","pct":100,"sales":"£577","acos":"103.8%"}]},"sec":{"advertising":{"metrics":[{"lbl":"Total Spend","val":"£599","id":"a-spend"},{"lbl":"Ad Sales","val":"£577","color":"brand"},{"lbl":"ACOS","val":"103.8%","color":"red","id":"a-tacos"},{"lbl":"ROAS","val":"0.96×","color":"red","id":"a-roas"},{"lbl":"Impressions","val":"69.2K"},{"lbl":"Avg. CPC","val":"£2.04"}]},"overview":{"cvr":{"val":"5.0%","note":"October 2026 · 680 sessions","sub":"UK · session conversion"}}}},"3m":{"label":"Aug–Oct 2026","shortLabel":"Aug–Oct 2026","dataTo":"2026-10-31","rev":"£3,874","revD":"3-month total","revC":"df","revS":"Aug £1,032 · Sep £1,779 · Oct £1,063","adSales":"£988","adSalesD":"3-month total","adSalesC":"df","adSalesS":"25.5% of revenue","spend":"£947","spendD":"3-month total","spendC":"df","spendS":"Aug £96 · Sep £252 · Oct £599","tacos":"24.4%","tacosD":"3-month blended","tacosC":"dd","tacosS":"Target <15%","roas":"1.04×","roasD":"3-month avg","roasC":"df","roasS":"155 units · ASP £24.99","tacosAd":"24.4%","tacosAdD":"3-month blended","tacosAdC":"dd","tacosAdS":"Target <15%","roasAd":"1.04×","roasAdD":"ACOS 95.8%","roasAdC":"df","roasAdS":"£3,874 revenue","aov":"£24.99","aovD":"3-month ASP","aovC":"df","aovS":"155 units total","mktRows":[["Amazon UK","gb","—","£947","bb","No budget set","£3,874","ba","24.4%"],["Total UK",null,"—","£947","bb","No budget set","£3,874","ba","24.4%"]],"revChart":{"max":2000,"yTicks":["£2k","£1.5k","£1k","£500","£0"],"xLabels":["1 Aug","","15 Aug","","29 Aug","","12 Sep","","26 Sep","","10 Oct","","24 Oct"],"xHighlight":"#404935","grain":"week","subtitle":"Weekly revenue and ad spend · Aug–Oct 2026","series":[{"color":"#404935","values":[0,0,129,605,1029,661,199,105,215,165,374,163,229],"main":true,"area":true,"dots":true},{"color":"#a7ab90","values":[0,0,72,16,18,42,71,58,92,84,167,153,174],"dash":true,"dots":true}],"legend":[{"name":"Revenue (weekly)","color":"#404935"},{"name":"Ad Spend (weekly)","color":"#a7ab90"}]},"adChart":{"max":2000,"yTicks":["£2k","£1.5k","£1k","£500","£0"],"xLabels":["1 Aug","","15 Aug","","29 Aug","","12 Sep","","26 Sep","","10 Oct","","24 Oct"],"xHighlight":"#404935","grain":"week","subtitle":"Weekly revenue and ad spend · Aug–Oct 2026","series":[{"color":"#404935","values":[0,0,129,605,1029,661,199,105,215,165,374,163,229],"main":true,"area":true,"dots":true},{"color":"#a7ab90","values":[0,0,72,16,18,42,71,58,92,84,167,153,174],"dash":true,"dots":true}],"legend":[{"name":"Revenue (weekly)","color":"#404935"},{"name":"Ad Spend (weekly)","color":"#a7ab90"}]},"revBreakChart":{"max":2000,"yTicks":["£2k","£1.5k","£1k","£500","£0"],"xLabels":["Aug","Sep","Oct"],"series":[{"color":"#404935","values":[72,339,577]},{"color":"#a7ab90","values":[960,1440,486]}],"legend":[{"name":"Ad sales","color":"#404935"},{"name":"Organic","color":"#a7ab90"}]},"sec":{"advertising":{"metrics":[{"lbl":"Total Spend","val":"£947","id":"a-spend"},{"lbl":"Ad Sales","val":"£988","color":"brand"},{"lbl":"ACOS","val":"95.8%","color":"red","id":"a-tacos"},{"lbl":"ROAS","val":"1.04×","color":"red","id":"a-roas"},{"lbl":"Impressions","val":"145.8K"},{"lbl":"Avg. CPC","val":"£1.68"}]},"overview":{"cvr":{"val":"6.3%","note":"Aug–Oct 2026 · 2,468 sessions","sub":"UK · session conversion"}}}},"12m":{"label":"Nov 2025 – Oct 2026","shortLabel":"Last 12 Months","dataTo":"2026-10-31","rev":"£14,420","revD":"12-month total","revC":"df","revS":"peak Jan 26 £4,011","adSales":"£6,649","adSalesD":"12-month total","adSalesC":"df","adSalesS":"46.1% of revenue","spend":"£3,724","spendD":"12-month total","spendC":"df","spendS":"over 12 months","tacos":"25.8%","tacosD":"12-month blended","tacosC":"dd","tacosS":"Target <15%","roas":"1.79×","roasD":"12-month avg","roasC":"df","roasS":"440 units · ASP £32.77","tacosAd":"25.8%","tacosAdD":"12-month blended","tacosAdC":"dd","tacosAdS":"Target <15%","roasAd":"1.79×","roasAdD":"ACOS 56.0%","roasAdC":"df","roasAdS":"£14,420 revenue","aov":"£32.77","aovD":"12-month ASP","aovC":"df","aovS":"440 units total","mktRows":[["Amazon UK","gb","—","£3,724","bb","No budget set","£14,420","ba","25.8%"],["Total UK",null,"—","£3,724","bb","No budget set","£14,420","ba","25.8%"]],"revChart":{"max":5000,"yTicks":["£5k","£3.75k","£2.5k","£1.25k","£0"],"xLabels":["Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"],"xHighlight":"#404935","series":[{"color":"#404935","values":[2459,3261,4011,815,0,0,0,0,0,1032,1779,1063],"main":true,"area":true},{"color":"#a7ab90","values":[693,794,1103,187,0,0,0,0,0,96,252,599],"dash":true}],"legend":[{"name":"Revenue","color":"#404935"},{"name":"Ad Spend","color":"#a7ab90"}],"subtitle":"Monthly revenue and ad spend · 12 months"},"adChart":{"max":5000,"yTicks":["£5k","£3.75k","£2.5k","£1.25k","£0"],"xLabels":["Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"],"xHighlight":"#404935","series":[{"color":"#404935","values":[2459,3261,4011,815,0,0,0,0,0,1032,1779,1063],"main":true,"area":true},{"color":"#a7ab90","values":[693,794,1103,187,0,0,0,0,0,96,252,599],"dash":true}],"legend":[{"name":"Revenue","color":"#404935"},{"name":"Ad Spend","color":"#a7ab90"}],"subtitle":"Monthly revenue and ad spend · 12 months"},"revBreakChart":{"max":4000,"yTicks":["£4k","£3k","£2k","£1k","£0"],"xLabels":["Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"],"series":[{"color":"#404935","values":[1305,1487,2438,432,0,0,0,0,0,72,339,577]},{"color":"#a7ab90","values":[1154,1774,1573,383,0,0,0,0,0,960,1440,486]}],"legend":[{"name":"Ad sales","color":"#404935"},{"name":"Organic","color":"#a7ab90"}]},"sec":{"advertising":{"metrics":[{"lbl":"Total Spend","val":"£3,724","id":"a-spend"},{"lbl":"Ad Sales","val":"£6,649","color":"brand"},{"lbl":"ACOS","val":"56.0%","color":"amber","id":"a-tacos"},{"lbl":"ROAS","val":"1.79×","color":"amber","id":"a-roas"},{"lbl":"Impressions","val":"1.0M"},{"lbl":"Avg. CPC","val":"£1.20"}]},"overview":{"cvr":{"val":"7.0%","note":"Nov 2025 – Oct 2026 · 6,283 sessions","sub":"UK · session conversion"}}}}};
  Object.keys(O).forEach(function (k) { D.dateRanges[k] = Object.assign(D.dateRanges[k] || {}, O[k]); });
  var S = {"products":{"kpisByPeriod":{"mtd":{"all":[{"bar":"#404935","lbl":"Active SKUs","val":"6","dCls":"df","d":"sold in 1–23 Nov","s":"6 of 7 listed products sold"},{"bar":"var(--green)","lbl":"Top Product Rev.","val":"£840","dCls":"df","d":"WIRED Electrolytes Citrus Lime","s":"33% of 1–23 Nov sales"},{"bar":"var(--blue)","lbl":"Units","val":"90","dCls":"df","d":"1–23 Nov","s":"85 orders"},{"bar":"var(--amber)","lbl":"ASP","val":"£28.27","dCls":"df","d":"per unit","s":"revenue ÷ units"}]},"may":{"all":[{"bar":"#404935","lbl":"Active SKUs","val":"4","dCls":"df","d":"sold in Oct 2026","s":"4 of 7 listed products sold"},{"bar":"var(--green)","lbl":"Top Product Rev.","val":"£524","dCls":"df","d":"BrainMatter Calm","s":"49% of Oct 2026 sales"},{"bar":"var(--blue)","lbl":"Units","val":"34","dCls":"df","d":"Oct 2026","s":"32 orders"},{"bar":"var(--amber)","lbl":"ASP","val":"£31.27","dCls":"df","d":"per unit","s":"revenue ÷ units"}]},"3m":{"all":[{"bar":"#404935","lbl":"Active SKUs","val":"7","dCls":"df","d":"sold in Aug–Oct 2026","s":"7 of 7 listed products sold"},{"bar":"var(--green)","lbl":"Top Product Rev.","val":"£975","dCls":"df","d":"WIRED Electrolytes Berry Fusion","s":"25% of Aug–Oct 2026 sales"},{"bar":"var(--blue)","lbl":"Units","val":"155","dCls":"df","d":"Aug–Oct 2026","s":"152 orders"},{"bar":"var(--amber)","lbl":"ASP","val":"£24.99","dCls":"df","d":"per unit","s":"revenue ÷ units"}]},"12m":{"all":[{"bar":"#404935","lbl":"Active SKUs","val":"7","dCls":"df","d":"sold in Last 12 Months","s":"7 of 7 listed products sold"},{"bar":"var(--green)","lbl":"Top Product Rev.","val":"£6,841","dCls":"df","d":"BrainMatter Cognitive","s":"47% of Last 12 Months sales"},{"bar":"var(--blue)","lbl":"Units","val":"440","dCls":"df","d":"Last 12 Months","s":"418 orders"},{"bar":"var(--amber)","lbl":"ASP","val":"£32.77","dCls":"df","d":"per unit","s":"revenue ÷ units"}]}},"tableByPeriod":{"mtd":[{"name":"United Kingdom","flag":"gb","revenue":"£2,544","units":"90","orders":"85","cvr":"14.9%","cvrCls":"bg","aov":"£28.27"}],"may":[{"name":"United Kingdom","flag":"gb","revenue":"£1,063","units":"34","orders":"32","cvr":"5.0%","cvrCls":"ba","aov":"£31.27"}],"3m":[{"name":"United Kingdom","flag":"gb","revenue":"£3,874","units":"155","orders":"152","cvr":"6.3%","cvrCls":"ba","aov":"£24.99"}],"12m":[{"name":"United Kingdom","flag":"gb","revenue":"£14,420","units":"440","orders":"418","cvr":"7.0%","cvrCls":"ba","aov":"£32.77"}]},"groupsByPeriod":{"mtd":{"all":[{"name":"WIRED Electrolytes Citrus Lime","sales":"£840","units":30,"pct":"33%","adSpend":"£0","tacos":"0.0%","tacosCls":"bg","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Electrolytes Melon Ice","sales":"£840","units":30,"pct":"33%","adSpend":"£0","tacos":"0.0%","tacosCls":"bg","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"BrainMatter Calm","sales":"£553","units":17,"pct":"22%","adSpend":"£325","tacos":"58.8%","tacosCls":"br","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"BrainMatter Cognitive","sales":"£186","units":6,"pct":"7%","adSpend":"£42","tacos":"22.3%","tacosCls":"ba","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Creatine Sachets","sales":"£89","units":5,"pct":"4%","adSpend":"£74","tacos":"83.1%","tacosCls":"br","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Discovery Pack","sales":"£9","units":1,"pct":"0%","adSpend":"£1","tacos":"13.8%","tacosCls":"bg","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"}]},"may":{"all":[{"name":"BrainMatter Calm","sales":"£524","units":16,"pct":"49%","adSpend":"£374","tacos":"71.4%","tacosCls":"br","cvr":"7.3%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"BrainMatter Cognitive","sales":"£489","units":15,"pct":"46%","adSpend":"£173","tacos":"35.3%","tacosCls":"br","cvr":"8.3%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"WIRED Creatine Sachets","sales":"£41","units":2,"pct":"4%","adSpend":"£25","tacos":"62.3%","tacosCls":"br","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Discovery Pack","sales":"£9","units":1,"pct":"1%","adSpend":"£9","tacos":"98.4%","tacosCls":"br","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"}]},"3m":{"all":[{"name":"WIRED Electrolytes Berry Fusion","sales":"£975","units":31,"pct":"25%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"BrainMatter Calm","sales":"£838","units":24,"pct":"22%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"5.4%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"WIRED Creatine Sachets","sales":"£783","units":35,"pct":"20%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"BrainMatter Cognitive","sales":"£778","units":23,"pct":"20%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"5.3%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"WIRED Discovery Pack","sales":"£377","units":38,"pct":"10%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Electrolytes Melon Ice","sales":"£61","units":2,"pct":"2%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Electrolytes Citrus Lime","sales":"£61","units":2,"pct":"2%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"}]},"12m":{"all":[{"name":"BrainMatter Cognitive","sales":"£6,841","units":187,"pct":"47%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"7.3%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"BrainMatter Calm","sales":"£5,321","units":145,"pct":"37%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"6.8%","cvrCls":"ba","oosRate":"0%","oosCls":"bg"},{"name":"WIRED Electrolytes Berry Fusion","sales":"£975","units":31,"pct":"7%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Creatine Sachets","sales":"£783","units":35,"pct":"5%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Discovery Pack","sales":"£377","units":38,"pct":"3%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Electrolytes Melon Ice","sales":"£61","units":2,"pct":"0%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Electrolytes Citrus Lime","sales":"£61","units":2,"pct":"0%","adSpend":"—","tacos":"—","tacosCls":"bb","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"}]}},"prevMonth":{"table":[{"name":"United Kingdom","flag":"gb","revenue":"£1,779","units":"68","orders":"67","cvr":"5.1%","cvrCls":"ba","aov":"£26.15"}],"groups":{"all":[{"name":"WIRED Electrolytes Berry Fusion","sales":"£975","units":31,"pct":"55%","adSpend":"£12","tacos":"1.2%","tacosCls":"bg","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"BrainMatter Cognitive","sales":"£250","units":7,"pct":"14%","adSpend":"£109","tacos":"43.6%","tacosCls":"br","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"BrainMatter Calm","sales":"£185","units":5,"pct":"10%","adSpend":"£102","tacos":"55.2%","tacosCls":"br","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Discovery Pack","sales":"£179","units":18,"pct":"10%","adSpend":"£7","tacos":"3.9%","tacosCls":"bg","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Creatine Sachets","sales":"£67","units":3,"pct":"4%","adSpend":"£23","tacos":"33.8%","tacosCls":"br","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Electrolytes Melon Ice","sales":"£61","units":2,"pct":"3%","adSpend":"£0","tacos":"0.0%","tacosCls":"bg","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"},{"name":"WIRED Electrolytes Citrus Lime","sales":"£61","units":2,"pct":"3%","adSpend":"£0","tacos":"0.0%","tacosCls":"bg","cvr":"—","cvrCls":"bb","oosRate":"—","oosCls":"bb"}]}}},"advertising":{"campaignsByPeriod":{"mtd":[{"name":"BM Calm - SP - Manual","type":"Sponsored Products","spend":"£346","sales":"£133","acos":"259.9%","acosCls":"br","roas":"0.38×","cpc":"£3.06","status":"Active","statusCls":"bg"},{"name":"Creatine Push - SP - KB_0 Manual","type":"Sponsored Products","spend":"£58","sales":"£60","acos":"96.9%","acosCls":"br","roas":"1.03×","cpc":"£2.24","status":"Active","statusCls":"bg"},{"name":"BM Cognitive - SP - PAT","type":"Sponsored Products","spend":"£39","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£1.67","status":"Active","statusCls":"bg"},{"name":"WRD Creatine Sachets - SP - Auto","type":"Sponsored Products","spend":"£18","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£1.60","status":"Active","statusCls":"bg"},{"name":"WRD 3in1 Electrolytes (multi) - SP - Auto","type":"Sponsored Products","spend":"£16","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£1.59","status":"Active","statusCls":"bg"},{"name":"BM Cognitive - SP - Auto","type":"Sponsored Products","spend":"£8","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£0.75","status":"Active","statusCls":"bg"},{"name":"WRD Creatine Sachets - SP - Manual","type":"Sponsored Products","spend":"£2","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£2.16","status":"Active","statusCls":"bg"},{"name":"WRD 3in1 Electrolytes (multi) - SP - Manual","type":"Sponsored Products","spend":"£2","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£1.98","status":"Active","statusCls":"bg"},{"name":"BM WIRED Brand Defence - SP - Default Manual","type":"Sponsored Products","spend":"£2","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£0.51","status":"Active","statusCls":"bg"},{"name":"BM Calm - SP - Auto","type":"Sponsored Products","spend":"£1","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£0.70","status":"Active","statusCls":"bg"},{"name":"WRD 3in1 Electrolytes (multi) - SP - PAT","type":"Sponsored Products","spend":"£1","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£1.10","status":"Active","statusCls":"bg"},{"name":"BM Cognitive - SP - Manual","type":"Sponsored Products","spend":"£1","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£0.74","status":"Active","statusCls":"bg"}],"may":[{"name":"BM Calm - SP - Manual","type":"Sponsored Products","spend":"£287","sales":"£357","acos":"80.5%","acosCls":"br","roas":"1.24×","cpc":"£2.99","status":"Active","statusCls":"bg"},{"name":"BM Cognitive - SP - PAT","type":"Sponsored Products","spend":"£115","sales":"£137","acos":"84.0%","acosCls":"br","roas":"1.19×","cpc":"£2.26","status":"Active","statusCls":"bg"},{"name":"BM Calm - SP - Auto","type":"Sponsored Products","spend":"£85","sales":"£27","acos":"308.3%","acosCls":"br","roas":"0.32×","cpc":"£1.41","status":"Active","statusCls":"bg"},{"name":"BM Cognitive - SP - Auto","type":"Sponsored Products","spend":"£55","sales":"£55","acos":"100.9%","acosCls":"br","roas":"0.99×","cpc":"£1.13","status":"Active","statusCls":"bg"},{"name":"WRD 3in1 Electrolytes (multi) - SP - Auto","type":"Sponsored Products","spend":"£27","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£1.33","status":"Active","statusCls":"bg"},{"name":"WRD Creatine Sachets - SP - Auto","type":"Sponsored Products","spend":"£21","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£1.89","status":"Active","statusCls":"bg"},{"name":"WRD Creatine Sachets - SP - Manual","type":"Sponsored Products","spend":"£4","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£1.19","status":"Active","statusCls":"bg"},{"name":"BM WIRED Brand Defence - SP - Default Manual","type":"Sponsored Products","spend":"£2","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£2.02","status":"Active","statusCls":"bg"},{"name":"BM Cognitive - SP - Manual","type":"Sponsored Products","spend":"£2","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£0.88","status":"Active","statusCls":"bg"},{"name":"Creatine Push - SP - KB_0 Manual","type":"Sponsored Products","spend":"£1","sales":"£0","acos":"—","acosCls":"bb","roas":"0.00×","cpc":"£1.10","status":"Active","statusCls":"bg"}]}}}; D.sections = D.sections || {};
  Object.keys(S).forEach(function (sec) { var T = D.sections[sec] = D.sections[sec] || {};
    Object.keys(S[sec]).forEach(function (k) { T[k] = /ByPeriod$/.test(k) ? Object.assign(T[k] || {}, S[sec][k]) : S[sec][k]; }); });
  D.warehouse = {"asOf":"2026-11-23","productsTo":"2026-11-22","adsApiFrom":"2026-08-15","builtAt":"2026-11-24T19:41:15.340Z","source":"TDS Data Warehouse (BigQuery amazon_ads)"}; })();
/* WAREHOUSE-END */
