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
    // Amazon P&L for the 3-month window (Jun+Jul+Aug settled, summed — see sections.pnl note on basis).
    sec: { pnl: {
      statement: {
        fixedLabel: 'Jun–Aug 2026 (3-month) · financial basis (MerchantSpring, settled)',
        summary: [ {val:'$13,847',lbl:'Net Revenue',color:'brand'}, {val:'$7,490',lbl:'Total Costs',color:'red'}, {val:'$6,356',lbl:'Net Profit',color:'green'} ],
        margin: { pct:'45.9%', pctColor:'green', note:'Jun–Aug 2026 (3-month) · financial basis (MerchantSpring, settled) · US channel', rows:[
          {lbl:'Net Revenue', val:'$13,847'},
          {lbl:'Advertising', val:'-$2,784', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-$1,689', color:'red'},
          {lbl:'COGS', val:'-$2,995', color:'red'},
          {lbl:'Other adjustments', val:'-$23', color:'red'},
          {lbl:'Net Profit', val:'$6,356', color:'green', strong:true}
        ] },
        mkt: [
          {name:'United States',flag:'us',revenue:'$13,847',adspend:'$2,784',net:'$6,356',netColor:'green',margin:'45.9%',marginCls:'bg'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$15,823', pct:'114.3%', unit:'$126.59'},
            {lbl:'Refunds & returns', amount:'-$1,437', pct:'-10.4%', unit:'-$11.50'},
            {lbl:'Promotions & coupons', amount:'-$48', pct:'-0.4%', unit:'-$0.39'},
            {lbl:'Reimbursements & other income', amount:'$406', pct:'2.9%', unit:'$3.25'},
            {lbl:'Net revenue', amount:'$13,847', pct:'100.0%', unit:'$110.77', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$2,784', pct:'20.1%', unit:'$22.27'},
            {lbl:'Selling fees', amount:'$840', pct:'6.1%', unit:'$6.72'},
            {lbl:'Shipping & fulfilment fees', amount:'$849', pct:'6.1%', unit:'$6.79'},
            {lbl:'Cost of goods', amount:'$2,995', pct:'21.6%', unit:'$23.96'},
            {lbl:'Refund/return handling', amount:'$23', pct:'0.2%', unit:'$0.18'},
            {lbl:'Total expenses', amount:'$7,490', pct:'54.1%', unit:'$59.92', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$6,356', pct:'45.9%', unit:'$50.85', total:true, profit:true},
            {lbl:'Profit %', amount:'45.9%', accent:'green'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'18.6%'},
            {lbl:'Ad spend (console)', amount:'$2,878'}
          ] }
        ]
      }
    } },
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
    // Amazon P&L for the Since-Launch window (Mar–Aug settled, summed — see sections.pnl note on
    // basis). Settled captures the Mar–Apr launch months that accrual omits.
    sec: { pnl: {
      statement: {
        fixedLabel: 'Since Launch · Mar–Aug 2026 · financial basis (MerchantSpring, settled)',
        summary: [ {val:'$21,225',lbl:'Net Revenue',color:'brand'}, {val:'$11,125',lbl:'Total Costs',color:'red'}, {val:'$10,100',lbl:'Net Profit',color:'green'} ],
        margin: { pct:'47.6%', pctColor:'green', note:'Since Launch · Mar–Aug 2026 · financial basis (MerchantSpring, settled) · US channel', rows:[
          {lbl:'Net Revenue', val:'$21,225'},
          {lbl:'Advertising', val:'-$3,198', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-$3,135', color:'red'},
          {lbl:'COGS', val:'-$4,766', color:'red'},
          {lbl:'Other adjustments', val:'-$26', color:'red'},
          {lbl:'Net Profit', val:'$10,100', color:'green', strong:true}
        ] },
        mkt: [
          {name:'United States',flag:'us',revenue:'$21,225',adspend:'$3,198',net:'$10,100',netColor:'green',margin:'47.6%',marginCls:'bg'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$24,962', pct:'117.6%', unit:'$100.25'},
            {lbl:'Refunds & returns', amount:'-$1,545', pct:'-7.3%', unit:'-$6.20'},
            {lbl:'Promotions & coupons', amount:'-$1,247', pct:'-5.9%', unit:'-$5.01'},
            {lbl:'Reimbursements & other income', amount:'$509', pct:'2.4%', unit:'$2.04'},
            {lbl:'Net revenue', amount:'$21,225', pct:'100.0%', unit:'$85.24', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$3,198', pct:'15.1%', unit:'$12.84'},
            {lbl:'Selling fees', amount:'$1,656', pct:'7.8%', unit:'$6.65'},
            {lbl:'Shipping & fulfilment fees', amount:'$1,478', pct:'7.0%', unit:'$5.94'},
            {lbl:'Cost of goods', amount:'$4,766', pct:'22.5%', unit:'$19.14'},
            {lbl:'Refund/return handling', amount:'$26', pct:'0.1%', unit:'$0.10'},
            {lbl:'Total expenses', amount:'$11,125', pct:'52.4%', unit:'$44.68', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$10,100', pct:'47.6%', unit:'$40.56', total:true, profit:true},
            {lbl:'Profit %', amount:'47.6%', accent:'green'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'13.0%'},
            {lbl:'Ad spend (console)', amount:'$3,479'}
          ] }
        ]
      }
    } },
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
      // Featured-offer (Buy Box) — real per-listing rates from MerchantSpring's trafficAndConversion
      // report (view:'parents', Aug 2026 vs Jul), pulled 07 Sep 2026 — NOT the account-level channel
      // rate copy-pasted across SKUs (that placeholder is what was here before). Amazon computes Buy
      // Box at the parent-listing level, and this account only has 2 live parents: Single/Pack of
      // 2/Pack of 3 share one parent ASIN (B0GLTLW6L3 — the "5 ASINs under one listing" variation
      // family noted in flagsSpec above), and Magnostream Pro is its own parent (B0GLP399NJ) — so all
      // 3 Single/Pack-2/Pack-3 rows below are genuinely the SAME real number (their shared parent's
      // rate), not 3 independent measurements; MerchantSpring exposes nothing more granular than that.
      // Dormant Bundle (B0GH7YKPZJ, 14 page views, no sales) omitted — not shown as its own row.
      buyBox: [
        {label:'Magnostream Single', pct:99.5, valText:'99.5%', color:'green'},
        {label:'Magnostream Pro', pct:99.5, valText:'99.5%', color:'green'},
        {label:'Magnostream Pack of 3', pct:99.5, valText:'99.5%', color:'green'},
        {label:'Magnostream Pack of 2', pct:99.5, valText:'99.5%', color:'green'}
      ],
      // Headline above the bars (app.js renderBuyBox's static-buyBox fallback previously left this as
      // dead placeholder HTML in index.html — literally AMACX's own "82% ▼1.5pp" — since only
      // buyBoxByPeriod clients had it wired up). Real page-view-weighted account average across all 3
      // live parent ASINs, Aug vs Jul (1066+1021+14 page views / 99.50%+99.50%+100.00%): 99.5%, up
      // from a same-methodology 98.9% in July.
      buyBoxHeadline: { pctTxt:'99.5%', delta:'▲ 0.6pp vs July', deltaCls:'du' },
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
    // P&L is ACTIVE for Abimax (Executive tier, Sep 2026) — full MerchantSpring financial P&L, built
    // PER TIMELINE. This top-level sections.pnl is the "Last Month" (August) statement; the 3-month
    // (Jun–Aug) and Since-Launch (Mar–Aug) statements live on dateRanges['3m'].sec.pnl /
    // dateRanges['6m'].sec.pnl. Each carries its own fixedLabel so the page re-renders per period.
    // Basis: getStoreProfitAndLoss, profitabilityView 'settled' (cash basis), includeTax, pulled per
    // month then summed for the multi-month windows (the endpoint is 31-day-capped). SETTLED is used,
    // not accrual/"deferred": MerchantSpring's accrual P&L has no data for the Mar–Apr launch months
    // (returns ~$0), whereas settled has the complete launch-to-date history (Mar sales $4,186 ties to
    // the $4,191 order-date figure). Settled is settlement-timed, so a month's P&L revenue won't tie
    // exactly to that month's order-date sales KPI shown elsewhere — expected for a cash-basis P&L.
    // MerchantSpring's own totalRevenue/totalExpenses drive the summary + totals; itemized rows don't
    // always foot to the top-line (a known MerchantSpring gap). "Ad spend (console)" in Metrics is the
    // order-date figure from the Advertising page, shown for cross-reference. Aug 2026 (settled):
    // sales $4,030 · net rev $4,058 · ad(settlement) $1,504 · selling $66 · shipping $270 · COGS $788
    // · net profit $1,431 (35.3%).
    pnl: {
      statement: {
        fixedLabel: 'August 2026 (1–31) · financial basis (MerchantSpring, settled)',
        summary: [ {val:'$4,058',lbl:'Net Revenue',color:'brand'}, {val:'$2,627',lbl:'Total Costs',color:'red'}, {val:'$1,431',lbl:'Net Profit',color:'green'} ],
        margin: { pct:'35.3%', pctColor:'amber', note:'August 2026 (31-day) · financial basis (MerchantSpring, settled) · US channel', rows:[
          {lbl:'Net Revenue', val:'$4,058'},
          {lbl:'Advertising', val:'-$1,504', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-$336', color:'red'},
          {lbl:'COGS', val:'-$788', color:'red'},
          {lbl:'Net Profit', val:'$1,431', color:'green', strong:true}
        ] },
        mkt: [
          {name:'United States',flag:'us',revenue:'$4,058',adspend:'$1,504',net:'$1,431',netColor:'green',margin:'35.3%',marginCls:'ba'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'$4,030', pct:'99.3%', unit:'$115.14'},
            {lbl:'Refunds & returns', amount:'$0', pct:'0.0%', unit:'$0.00'},
            {lbl:'Promotions & coupons', amount:'-$19', pct:'-0.5%', unit:'-$0.53'},
            {lbl:'Reimbursements & other income', amount:'$328', pct:'8.1%', unit:'$9.37'},
            {lbl:'Net revenue', amount:'$4,058', pct:'100.0%', unit:'$115.95', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising (settlement)', amount:'$1,504', pct:'37.1%', unit:'$42.98'},
            {lbl:'Selling fees', amount:'$66', pct:'1.6%', unit:'$1.89'},
            {lbl:'Shipping & fulfilment fees', amount:'$270', pct:'6.6%', unit:'$7.70'},
            {lbl:'Cost of goods', amount:'$788', pct:'19.4%', unit:'$22.50'},
            {lbl:'Total expenses', amount:'$2,627', pct:'64.7%', unit:'$75.07', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'$1,431', pct:'35.3%', unit:'$40.88', total:true, profit:true},
            {lbl:'Profit %', amount:'35.3%', accent:'amber'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS % (console)', amount:'30.1%'},
            {lbl:'Ad spend (console)', amount:'$1,141'}
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
      // Per-ASIN Sponsored Products campaigns (August 2026). Spend, CPC, sales, ACOS and ROAS are ALL
      // REAL per-SKU actuals from the MerchantSpring product report (getSalesByProduct) — NOT allocated
      // from the channel total this month. Reason for the change from the spend-share-allocation
      // convention used in prior bakes: allocating channel ad-sales by spend share is mathematically
      // guaranteed to produce the SAME ACOS/ROAS on every row (acos_i = spend_i/(spend_i×totalAdSales/
      // totalSpend) = totalSpend/totalAdSales for all i), which would have shown all 4 campaigns at an
      // identical 44.6%/2.2× — hiding that Magnostream Pro is actually badly inefficient (78.8% ACOS)
      // while Pack of 2/3 generated ZERO ad-attributed sales despite real spend (0% ACOS/ROAS = wasted
      // spend, not efficiency). NOTE: because these are real unallocated per-SKU figures, Σ sales here
      // ($1,520) does NOT foot to the channel-attributed headline Ad Sales ($2,572) — MerchantSpring's
      // per-product and channel ad-attribution reports disagree this month (a real data discrepancy,
      // not a rounding artefact); the headline metrics above remain the channel-attributed, internally
      // self-consistent figures per the runbook (getSalesByPeriod).
      campaigns: [
        {name:'US · Magnostream Pro — SP',type:'Sponsored Products',spend:'$674',sales:'$855',acos:'78.8%',acosCls:'br',roas:'1.3×',cpc:'$1.08',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Single — SP',type:'Sponsored Products',spend:'$410',sales:'$665',acos:'61.7%',acosCls:'br',roas:'1.6×',cpc:'$0.94',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 2 — SP',type:'Sponsored Products',spend:'$32',sales:'$0',acos:'0.0%',acosCls:'br',roas:'0.0×',cpc:'$0.94',status:'Active',statusCls:'bg'},
        {name:'US · Magnostream Pack of 3 — SP',type:'Sponsored Products',spend:'$30',sales:'$0',acos:'0.0%',acosCls:'br',roas:'0.0×',cpc:'$0.95',status:'Active',statusCls:'bg'}
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
