/* NKV Beauty — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 5 Aug 2026 (channel 71662311, seller A1SNRD9T28Z9ZM), native GBP.
   UK is the live market (real data). Ireland is early-stage and EUR-native — its £ figures are the
   actual €-sales converted at €1 ≈ £0.855. USA now has real ad spend as well as sales (from June 2026) —
   converted from USD at $1 ≈ £0.78.
   'may'/'3m'/'6m' (headline KPIs, campaigns, campaign mix, product-by-brand groups) are re-baked for
   July 2026 from getSalesByPeriod + a generated 'campaigns' report (MerchantSpring MCP). '12m' is NOT
   updated this run: MerchantSpring's getSalesByPeriod cannot return a usable October 2025 UK value
   (missing from bucketed pulls, or £0 sales alongside real non-zero ad spend/traffic — internally
   inconsistent), and other report types (salesByProduct, channelProfitAndLoss totals) for the same
   12-month window don't reconcile with each other either, so the trailing-12-month figure is left as
   the prior bake rather than guessed. sections.advertising.budgets/forecast and sections.inventory are
   also unchanged this run (sheet-baked / not re-pulled) — see clients/nkv/REBAKE-BLOCKED-2026-07.md.
   NOTE: the shared app.js trend-chart axis formatter (moneyK) hardcodes '€' — KPI cards/tables/P&L here
   are all in £, but the two trend-chart Y-axes will display '€' until the template adds a currency option.
   dataSource.type is 'static' (no Sheet/Apps Script proxy for NKV yet). */
window.DASHBOARD_DATA = {
  dateRanges: {
  'may': {
    label: 'July 2026', shortLabel: 'July 2026',
    rev: '£14,360', revD: '▼ 3.9% MoM', revC: 'df', revS: 'vs £14,947 Jun',
    adSales: '£5,736', adSalesD: '▼ 5.1% MoM', adSalesC: 'df', adSalesS: '39.9% of revenue',
    tacos: '18.6%', tacosD: '▼ 1.2pp vs Jun', tacosC: 'du', tacosS: 'Target <20%',
    roas: '2.15×', roasD: '▲ 0.11× vs Jun', roasC: 'du', roasS: '530 orders · AOV £27.09',
    spend: '£2,667', spendD: '▼ 9.9% MoM', spendC: 'du', spendS: 'vs £2,961 Jun',
    tacosAd: '18.6%', tacosAdD: '▼ 1.2pp vs Jun', tacosAdC: 'du', tacosAdS: 'Target <20%',
    roasAd: '2.15×', roasAdD: '▲ 0.11× vs Jun', roasAdC: 'du', roasAdS: '£14,360 revenue',
    aov: '£27.09', aovD: '', aovC: 'df', aovS: '530 orders Jul',
    mktRows: [
      ['UK','gb','—','£2,593','bb','UK ad-managed','£13,290','ba','19.5%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£356','bb','—'],
      ['USA','us','—','£74','bb','Real ad spend now','£714','ba','10.3%'],
      ['Total',null,'—','£2,667','bb','All 3 markets live','£14,360','ba','18.6%']
    ],
    marketKpis: {
      uk: { rev:'£13,290', adSales:'£5,681', tacos:'19.5%', roas:'2.19×', spend:'£2,593', aov:'£27.07', tacosAd:'19.5%', roasAd:'2.19×', revC:'df', adSalesC:'df', tacosC:'du', roasC:'du', spendC:'du', aovC:'df', tacosAdC:'du', roasAdC:'du', tacosS:'Target <20%', roasS:'491 orders · AOV £27.07', roasAdS:'£13,290 revenue', aovD:'', aovS:'491 orders Jul', adSalesS:'42.8% of revenue', revD:'▼ 5.6% MoM', revS:'vs £14,079 Jun', spendD:'▼ 11.6% MoM', spendS:'vs £2,932 Jun', tacosD:'▼ 1.3pp vs Jun', tacosAdD:'▼ 1.3pp vs Jun', roasD:'▲ 0.13× vs Jun', roasAdD:'▲ 0.13× vs Jun', adSalesD:'▼ 6.0% MoM' },
      irl: { rev:'£356', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£39.54', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'9 orders', roasAdS:'£356 revenue', aovD:'', aovS:'9 orders Jul', adSalesS:'No ad spend', revD:'▲ 58.9% MoM', revS:'vs £224 Jun', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£714', adSales:'£55', tacos:'10.3%', roas:'0.74×', spend:'£74', aov:'£23.80', tacosAd:'10.3%', roasAd:'0.74×', revC:'du', adSalesC:'du', tacosC:'df', roasC:'du', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'du', tacosS:'Target <20%', roasS:'30 orders · AOV £23.80', roasAdS:'£714 revenue', aovD:'', aovS:'30 orders Jul', adSalesS:'Real ad sales now', revD:'▲ 10.9% MoM', revS:'vs £644 Jun', spendD:'▲ 154.1% MoM', spendS:'vs £29 Jun (real ads now)', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'▲ First ad sales' }
    },
    // Campaign-type mix — real ad-type sales share + ACOS from the MerchantSpring campaigns report.
    // Every period (may/3m/6m) is pulled from its own campaigns-report window — no estimates. (12m unchanged.)
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.3,sales:'£4.9k',acos:'48.3%'}, {name:'Sponsored Brands',color:'#9caf78',pct:13.1,sales:'£0.7k',acos:'25.3%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.6,sales:'£0.0k',acos:'97.7%'} ] },
    // Same-Period-Last-Year comparison (Jul 2026 vs Jul 2025), MerchantSpring actuals (getSalesByPeriod,
    // interval:'w' summed — see the AMACX yoy{} note for why not interval:'M'). UK + Total (UK converted
    // £ + IRL €→£ + USA $→£ at the same static rates as the rest of this file) only: unlike AMACX, NKV's
    // ROAS is adSales÷adSpend (not revenue÷adSpend) — reconciled against the baked 'may' adSales (£5,681
    // vs a re-pulled £5,672, well within normal attribution drift) and used here for roasD/roasAdD. IRL
    // has a real but very thin Jul-2025 base (€146 total) and USA had zero Amazon sales in Jul 2025 (it
    // hadn't launched real ad spend yet) — neither gets a per-market yoy entry; Total below already folds
    // their small/zero prior-year contribution in, so it stays representative.
    yoy: {
      revD: '▲ 3.7% YoY', revC: 'du', revS: 'vs £13,681 Jul 2025',
      spendD: '▲ 28.3% YoY', spendC: 'df', spendS: 'vs £2,060 Jul 2025',
      adSalesD: '▼ 8.3% YoY', adSalesC: 'dd', adSalesS: 'vs £6,247 Jul 2025',
      tacosD: '▲ 3.6pp vs Jul 2025', tacosC: 'dd',
      tacosAdD: '▲ 3.6pp vs Jul 2025', tacosAdC: 'dd',
      roasD: '▼ 0.87× vs Jul 2025', roasC: 'dd',
      roasAdD: '▼ 0.87× vs Jul 2025', roasAdC: 'dd',
      marketKpis: {
        uk: { revD:'▼ 3.2% YoY', revC:'dd', revS:'vs £13,556 Jul 2025', spendD:'▲ 24.7% YoY', spendC:'df', spendS:'vs £2,060 Jul 2025', adSalesD:'▼ 9.2% YoY', adSalesC:'dd', adSalesS:'vs £6,247 Jul 2025', tacosD:'▲ 4.4pp vs Jul 2025', tacosC:'dd', tacosAdD:'▲ 4.4pp vs Jul 2025', tacosAdC:'dd', roasD:'▼ 0.82× vs Jul 2025', roasC:'dd', roasAdD:'▼ 0.82× vs Jul 2025', roasAdC:'dd' }
      }
    },
  },
  '3m': {
    label: 'May–Jul 2026', shortLabel: 'May–Jul 2026',
    rev: '£45,078', revD: '3-month actuals', revC: 'du', revS: '',
    adSales: '£19,498', adSalesD: '3-month actuals', adSalesC: 'df', adSalesS: '43.3% of revenue',
    tacos: '19.7%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.20×', roasD: '', roasC: 'df', roasS: '',
    spend: '£8,870', spendD: '3-month actuals', spendC: 'df', spendS: '',
    tacosAd: '19.7%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.20×', roasAdD: '', roasAdC: 'df', roasAdS: '£45,078 revenue',
    aov: '£27.17', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£8,767','bb','UK ad-managed','£42,659','ba','20.5%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£1,061','bb','—'],
      ['USA','us','—','£103','bb','Real ad spend now','£1,358','ba','7.6%'],
      ['Total',null,'—','£8,870','bb','3-month actuals','£45,078','ba','19.7%']
    ],
    marketKpis: {
      uk: { rev:'£42,659', adSales:'£19,444', tacos:'20.5%', roas:'2.22×', spend:'£8,767', aov:'£27.52', tacosAd:'20.5%', roasAd:'2.22×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£42,659 revenue', aovD:'', aovS:'', adSalesS:'45.6% of revenue', revD:'3-month actuals', revS:'', spendD:'3-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'3-month actuals' },
      irl: { rev:'£1,061', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£33.14', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£1,061 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£1,358', adSales:'£55', tacos:'7.6%', roas:'0.53×', spend:'£103', aov:'£17.63', tacosAd:'7.6%', roasAd:'0.53×', revC:'du', adSalesC:'du', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£1,358 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'3-month actuals', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.7,sales:'£16.9k',acos:'46.8%'}, {name:'Sponsored Brands',color:'#9caf78',pct:13.1,sales:'£2.5k',acos:'31.6%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.2,sales:'£0.0k',acos:'203.7%'} ] },
    // Period-aware Ad Metrics (3-mo) — all actuals (MerchantSpring channel + generated campaigns report, May–Jul).
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£8,767',  id:'a-spend'},
      {lbl:'Ad Sales',     val:'£19,444', color:'brand'},
      {lbl:'ACOS',         val:'45.1%',  color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.83'},
      {lbl:'Impressions',  val:'3.71M'},
      {lbl:'New-to-Brand', val:'11.0%',   color:'green'}
    ],
    // Real per-campaign actuals for the 3-mo window (MerchantSpring campaigns report, May–Jul 2026,
    // top 13 of 41 by spend). Follows the date selector; row-filtered by the market chip.
    campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£2,144',sales:'£5,129',acos:'41.8%',acosCls:'ba',roas:'2.39×',cpc:'£1.11',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£1,966',sales:'£3,310',acos:'59.4%',acosCls:'ba',roas:'1.68×',cpc:'£0.94',status:'Active',statusCls:'bg'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£710',sales:'£2,505',acos:'28.3%',acosCls:'bg',roas:'3.53×',cpc:'£0.52',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£672',sales:'£1,734',acos:'38.7%',acosCls:'ba',roas:'2.58×',cpc:'£0.97',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£437',sales:'£390',acos:'112.0%',acosCls:'br',roas:'0.89×',cpc:'£0.84',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£304',sales:'£198',acos:'153.0%',acosCls:'br',roas:'0.65×',cpc:'£0.98',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£236',sales:'£2,320',acos:'10.2%',acosCls:'bg',roas:'9.82×',cpc:'£0.70',status:'Active',statusCls:'bg'},
      {name:'UK · Eye-Liners — SP Manual',type:'Sponsored Products',spend:'£213',sales:'£421',acos:'50.6%',acosCls:'ba',roas:'1.98×',cpc:'£1.06',status:'Paused',statusCls:'ba'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£196',sales:'£394',acos:'49.6%',acosCls:'ba',roas:'2.02×',cpc:'£0.88',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP PAT',type:'Sponsored Products',spend:'£175',sales:'£329',acos:'53.2%',acosCls:'ba',roas:'1.88×',cpc:'£0.61',status:'Active',statusCls:'bg'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£167',sales:'£211',acos:'79.4%',acosCls:'br',roas:'1.26×',cpc:'£0.69',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Manual',type:'Sponsored Products',spend:'£161',sales:'£308',acos:'52.1%',acosCls:'ba',roas:'1.92×',cpc:'£0.45',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£141',sales:'£582',acos:'24.2%',acosCls:'bg',roas:'4.13×',cpc:'£0.84',status:'Active',statusCls:'bg'}
    ] } },
  },
  '6m': {
    label: 'Feb–Jul 2026 (YTD)', shortLabel: 'Feb–Jul 2026',
    rev: '£90,453', revD: '6-month actuals', revC: 'du', revS: '',
    adSales: '£44,951', adSalesD: '6-month actuals', adSalesC: 'df', adSalesS: '49.7% of revenue',
    tacos: '19.3%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.57×', roasD: '', roasC: 'df', roasS: '',
    spend: '£17,474', spendD: '6-month actuals', spendC: 'df', spendS: '',
    tacosAd: '19.3%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.57×', roasAdD: '', roasAdC: 'df', roasAdS: '£90,453 revenue',
    aov: '£28.16', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£17,371','bb','UK ad-managed','£87,060','ba','20.0%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£2,035','bb','—'],
      ['USA','us','—','£103','bb','Real ad spend now','£1,358','ba','7.6%'],
      ['Total',null,'—','£17,474','bb','6-month actuals','£90,453','ba','19.3%']
    ],
    marketKpis: {
      uk: { rev:'£87,060', adSales:'£44,897', tacos:'20.0%', roas:'2.58×', spend:'£17,371', aov:'£28.31', tacosAd:'20.0%', roasAd:'2.58×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£87,060 revenue', aovD:'', aovS:'', adSalesS:'51.6% of revenue', revD:'6-month actuals', revS:'', spendD:'6-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'6-month actuals' },
      irl: { rev:'£2,035', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£34.50', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£2,035 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£1,358', adSales:'£55', tacos:'7.6%', roas:'0.53×', spend:'£103', aov:'£17.63', tacosAd:'7.6%', roasAd:'0.53×', revC:'du', adSalesC:'du', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£1,358 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'6-month actuals', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:88.3,sales:'£39.7k',acos:'39.9%'}, {name:'Sponsored Brands',color:'#9caf78',pct:11.6,sales:'£5.2k',acos:'28.3%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.1,sales:'£0.0k',acos:'203.7%'} ] },
    // Period-aware Ad Metrics (YTD) — all actuals (MerchantSpring channel + generated campaigns report, Feb–Jul).
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£17,371', id:'a-spend'},
      {lbl:'Ad Sales',     val:'£44,897', color:'brand'},
      {lbl:'ACOS',         val:'38.7%',  color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.81'},
      {lbl:'Impressions',  val:'6.62M'},
      {lbl:'New-to-Brand', val:'9.3%',   color:'green'}
    ],
    // Real per-campaign actuals for the YTD window (MerchantSpring campaigns report, Feb–Jul 2026,
    // top 13 of 46 by spend). Follows the date selector; row-filtered by the market chip.
    campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£5,419',sales:'£14,598',acos:'37.1%',acosCls:'ba',roas:'2.69×',cpc:'£1.03',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£3,320',sales:'£6,160',acos:'53.9%',acosCls:'ba',roas:'1.86×',cpc:'£0.88',status:'Active',statusCls:'bg'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£1,378',sales:'£5,162',acos:'26.7%',acosCls:'bg',roas:'3.75×',cpc:'£0.51',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£996',sales:'£2,849',acos:'35.0%',acosCls:'ba',roas:'2.86×',cpc:'£0.85',status:'Active',statusCls:'bg'},
      {name:'UK · Eye-Liners — SP Manual',type:'Sponsored Products',spend:'£872',sales:'£1,719',acos:'50.8%',acosCls:'ba',roas:'1.97×',cpc:'£1.07',status:'Paused',statusCls:'ba'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£715',sales:'£701',acos:'102.0%',acosCls:'br',roas:'0.98×',cpc:'£0.81',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£606',sales:'£6,994',acos:'8.7%',acosCls:'bg',roas:'11.54×',cpc:'£0.67',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£564',sales:'£400',acos:'140.9%',acosCls:'br',roas:'0.71×',cpc:'£0.83',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£338',sales:'£1,320',acos:'25.6%',acosCls:'bg',roas:'3.91×',cpc:'£0.84',status:'Active',statusCls:'bg'},
      {name:'UK · Teeth Whitening Strips — SP Auto',type:'Sponsored Products',spend:'£273',sales:'£413',acos:'66.0%',acosCls:'br',roas:'1.52×',cpc:'£0.80',status:'Active',statusCls:'bg'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£270',sales:'£536',acos:'50.4%',acosCls:'ba',roas:'1.98×',cpc:'£0.88',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP PAT',type:'Sponsored Products',spend:'£237',sales:'£420',acos:'56.5%',acosCls:'ba',roas:'1.77×',cpc:'£0.60',status:'Active',statusCls:'bg'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£212',sales:'£232',acos:'91.2%',acosCls:'br',roas:'1.10×',cpc:'£0.67',status:'Active',statusCls:'bg'}
    ] } },
  },
  '12m': {
    label: 'Last 12 Months', shortLabel: 'Last 12 Months',
    rev: '£172,886', revD: 'Trailing 12 months', revC: 'du', revS: '12-mo actuals',
    adSales: '£88,487', adSalesD: 'Trailing 12 months', adSalesC: 'df', adSalesS: '51.2% of revenue',
    tacos: '18.9%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.71×', roasD: '', roasC: 'df', roasS: '',
    spend: '£32,682', spendD: 'Trailing 12 months', spendC: 'df', spendS: '',
    tacosAd: '18.9%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.71×', roasAdD: '', roasAdC: 'df', roasAdS: '£172,886 revenue',
    aov: '£27.68', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£32,652','bb','UK ad-managed','£169,164','ba','19.3%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£3,078','bb','—'],
      ['USA','us','—','£29','bb','Launched Jun 2026','£644','ba','4.5%'],
      ['Total',null,'—','£32,682','bb','Trailing 12 months','£172,886','ba','18.9%']
    ],
    marketKpis: {
      uk: { rev:'£169,164', adSales:'£88,487', tacos:'19.3%', roas:'2.71×', spend:'£32,652', aov:'£27.75', tacosAd:'19.3%', roasAd:'2.71×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£169,164 revenue', aovD:'', aovS:'', adSalesS:'52.3% of revenue', revD:'Trailing 12 months', revS:'12-mo actuals', spendD:'Trailing 12 months', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'Trailing 12 months' },
      irl: { rev:'£3,078', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£30.18', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£3,078 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£644', adSales:'£0', tacos:'4.5%', roas:'0.00×', spend:'£29', aov:'£13.70', tacosAd:'4.5%', roasAd:'0.00×', revC:'du', adSalesC:'df', tacosC:'du', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'du', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£644 revenue', aovD:'', aovS:'', adSalesS:'Attribution pending', revD:'Launched Jun 2026', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:88.6,sales:'£78.4k',acos:'37.3%'}, {name:'Sponsored Brands',color:'#9caf78',pct:11.3,sales:'£10.0k',acos:'33.0%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.1,sales:'£0.1k',acos:'188.7%'} ] },
    // Period-aware Ad Metrics (12-mo) — all actuals from the MerchantSpring campaigns report (Jul 2025–
    // Jun 2026; includes October, which the monthly-sales endpoint glitches but the campaigns report has).
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£32,652', id:'a-spend'},
      {lbl:'Ad Sales',     val:'£88,487', color:'brand'},
      {lbl:'ACOS',         val:'36.9%',  color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.83'},
      {lbl:'Impressions',  val:'11.85M'},
      {lbl:'New-to-Brand', val:'8.0%',   color:'green'}
    ],
    // Real per-campaign actuals for the trailing-year window (MerchantSpring campaigns report,
    // Jul 2025–Jun 2026, top 13 of 51 by spend). Follows the date selector; row-filtered by market.
    campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£8,286',sales:'£22,126',acos:'37.5%',acosCls:'ba',roas:'2.67×',cpc:'£0.98',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£6,181',sales:'£12,752',acos:'48.5%',acosCls:'ba',roas:'2.06×',cpc:'£0.91',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£3,121',sales:'£8,166',acos:'38.2%',acosCls:'ba',roas:'2.62×',cpc:'£0.91',status:'Active',statusCls:'bg'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£2,790',sales:'£9,314',acos:'30.0%',acosCls:'ba',roas:'3.34×',cpc:'£0.58',status:'Active',statusCls:'bg'},
      {name:'UK · Eye-Liners — SP Manual',type:'Sponsored Products',spend:'£2,122',sales:'£4,321',acos:'49.1%',acosCls:'ba',roas:'2.04×',cpc:'£1.03',status:'Paused',statusCls:'ba'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£1,517',sales:'£17,930',acos:'8.5%',acosCls:'bg',roas:'11.82×',cpc:'£0.69',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Manual',type:'Sponsored Products',spend:'£1,036',sales:'£2,237',acos:'46.3%',acosCls:'ba',roas:'2.16×',cpc:'£0.85',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£1,031',sales:'£1,429',acos:'72.2%',acosCls:'br',roas:'1.39×',cpc:'£0.85',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£889',sales:'£820',acos:'108.5%',acosCls:'br',roas:'0.92×',cpc:'£0.81',status:'Paused',statusCls:'ba'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£539',sales:'£663',acos:'81.3%',acosCls:'br',roas:'1.23×',cpc:'£0.65',status:'Active',statusCls:'bg'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£485',sales:'£1,018',acos:'47.6%',acosCls:'ba',roas:'2.10×',cpc:'£1.10',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP PAT',type:'Sponsored Products',spend:'£479',sales:'£858',acos:'55.8%',acosCls:'br',roas:'1.79×',cpc:'£0.67',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Auto',type:'Sponsored Products',spend:'£426',sales:'£690',acos:'61.7%',acosCls:'br',roas:'1.62×',cpc:'£0.43',status:'Active',statusCls:'bg'}
    ] } },
  }
  },
  sections: {
    overview: {
      // Tasks + flags = STATIC SNAPSHOT of the NKV Project Scope board (NKV Beauty Account Tracker,
      // 14 Jun 2026). These become live once the nkv-sheet-proxy is deployed (see tools/nkv-sheet-proxy.gs)
      // and config.dataSource is switched to appsScript/overlay:'sections'.
      // 'Upcoming Tasks' card ← sheet "Upcoming" column.
      tasksSpec: { badge: 'Project scope', items: [
        {text:'Keyword update & optimise', sub:'Upcoming', active:false},
        {text:'Request listing images (Newnique)', sub:'Upcoming', active:false}
      ] },
      // 'In Progress' card ← sheet "In Progress" column.
      flagsSpec: { badge: '3 in progress', items: [
        {level:'amber', title:"Connecting Beckdale's WMS", sub:'Shipping · in progress'},
        {level:'amber', title:'Google Ads verification', sub:'Account queries · in progress'},
        {level:'amber', title:'Newnique listing optimisations', sub:'Graphics / A+ · in progress'}
      ] },
      // 'Completed' card ← sheet "Completed" column (Projects tab). Live via the proxy; this is the fallback.
      completedSpec: { badge: '4 completed', items: [
        {text:'All Brand Stores & A+ Content LIVE', sub:'Completed'},
        {text:'New prices implemented', sub:'Completed'},
        {text:'Tiered catalogue promo active', sub:'Completed'},
        {text:'Problem-solving code active', sub:'Completed'}
      ] },
      // Buy Box widget removed from the NKV Overview (config.layout.hide: sec-buybox-card); the Stock
      // Warnings card takes that slot. UK 99.3% / IE 99.8% featured-offer rate retained here for reference.
      cvr: { val:'9.8%', note:'June 2026 · 5,718 sessions', sub:'UK · session conversion' },
      // FBA Stock Warnings = Amazon FBA low-stock / availability only (real, MerchantSpring UK 6 Jul 2026).
      // 22 of the 73 UK listings are at 0 FBA stock (out of stock / suppressed) — mostly dormant Girlactik
      // lip/eyeshadow SKUs and a couple of Newnique FBM kits that don't sell; the 42 selling SKUs are
      // in stock bar the two flagged below.
      // (Account-health/strategy alerts moved to their own section — see ACCOUNT-HEALTH note below.)
      stockWarn: { badge:'2 stock-up · 22 OOS', items:[
        {level:'amber',title:'Contours Rx Lids Assortment 4–7mm — stock-up soon',sub:'B0FYR8DQ2G · ~16 days cover · 33 units · top seller (67/mo)'},
        {level:'amber',title:'Girlactik Gel Eyeliner — watch cover',sub:'B099KVFGZP · ~23 days cover · 24 units · 28/mo'},
        {level:'amber',title:'22 listings out of stock / suppressed',sub:'mostly dormant Girlactik & Lilibeth long-tail SKUs · all other selling SKUs in stock'}
      ] }
      // Account Health (strategy/performance alerts) card removed from the NKV Overview per client request.
    },
    pnl: {
      statement: {
        fixedLabel: 'May 2026 (1–31) · financial basis (MerchantSpring)',
        summary: [ {val:'£14,369',lbl:'Net Revenue',color:'brand'}, {val:'£10,126',lbl:'Total Costs',color:'red'}, {val:'£4,243',lbl:'Net Profit',color:'green'} ],
        margin: { pct:'29.5%', pctColor:'green', note:'May 2026 (31-day) · financial basis (MerchantSpring) · UK channel', rows:[
          {lbl:'Net Revenue', val:'£14,369'},
          {lbl:'Advertising', val:'-£3,255', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-£3,340', color:'red'},
          {lbl:'COGS', val:'-£3,633', color:'red'},
          {lbl:'Net Profit', val:'£4,243', color:'green', strong:true}
        ] },
        mkt: [
          {name:'United Kingdom',flag:'gb',revenue:'£14,369',adspend:'£3,255',net:'£4,243',netColor:'green',margin:'29.5%',marginCls:'ba'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'£14,985', pct:'104.3%', unit:'£25.66'},
            {lbl:'Refunds', amount:'-£500', pct:'-3.5%', unit:'-£0.86'},
            {lbl:'Reimbursements', amount:'£17', pct:'0.1%', unit:'£0.03'},
            {lbl:'Promotions', amount:'-£496', pct:'-3.5%', unit:'-£0.85'},
            {lbl:'Other income', amount:'£364', pct:'2.5%', unit:'£0.62'},
            {lbl:'Net revenue', amount:'£14,369', pct:'100.0%', unit:'£24.60', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising', amount:'£3,255', pct:'22.7%', unit:'£5.57'},
            {lbl:'Selling fees', amount:'£2,138', pct:'14.9%', unit:'£3.66'},
            {lbl:'Shipping & fulfilment fees', amount:'£1,202', pct:'8.4%', unit:'£2.06'},
            {lbl:'Cost of goods', amount:'£3,633', pct:'25.3%', unit:'£6.22'},
            {lbl:'Refunds & returns overheads', amount:'£0', pct:'0.0%', unit:'£0.00'},
            {lbl:'Other', amount:'-£102', pct:'-0.7%', unit:'-£0.17'},
            {lbl:'Total expenses', amount:'£10,126', pct:'70.5%', unit:'£17.34', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'£4,243', pct:'29.5%', unit:'£7.27', total:true, profit:true},
            {lbl:'Profit %', amount:'29.5%', accent:'green'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS %', amount:'21.3%'},
            {lbl:'Ad spend', amount:'£3,255'}
          ] }
        ]
      }
    },
    advertising: {
      // Real July 2026 ad totals (MerchantSpring generated 'campaigns' report, UK channel, GBP).
      metrics: [
        {lbl:'Total Spend',  val:'£2,593', id:'a-spend'},
        {lbl:'Ad Sales',     val:'£5,681', color:'brand'},
        {lbl:'ACOS',         val:'45.6%',  color:'amber'},
        {lbl:'Avg. CPC',     val:'£0.74'},
        {lbl:'Impressions',  val:'0.98M'},
        {lbl:'New-to-Brand', val:'11.2%',   color:'green'}
      ],
      // Ad budget = £3,000/mo (NKV tracker · Marketing Activity sheet) vs real actual spend. NOT
      // re-pulled this run (sheet-baked, see clients/nkv/REBAKE-BLOCKED-2026-07.md) — subLabel/rows
      // still reflect the June close from the last sheet read; only the spend figure elsewhere in the
      // dashboard (KPI cards) is from the July MerchantSpring pull.
      budgets: {
        subLabel: 'June 2026 · budget vs actual',
        headers: ['Monthly Budget','June Actual','Variance','Utilisation'],
        rows: [
          {name:'United Kingdom', flag:'gb', cells:['£3,000','£2,933','▼ £67 under','98%']},
          {name:'Total', total:true,         cells:['£3,000','£2,933','▼ £67 under','98%']}
        ]
      },
      // Forward ad budget from the NKV Beauty Account Tracker (Amazon Marketing Metrics row) — the
      // Forecast Document is a flat £3,500/mo (Jul & Aug — June has now closed with real actuals above).
      // TACOS shown as the account target (<20%); the sheet doesn't forecast ad sales/ROAS forward.
      forecast: [
        {month:'Jul', budget:'£3,500', pct:100, tacos:'<20%', tacosColor:'amber', roas:'—', opacity:0.7},
        {month:'Aug', budget:'£3,500', pct:100, tacos:'<20%', tacosColor:'amber', roas:'—', opacity:0.6}
      ],
      // Real per-campaign actuals (MerchantSpring generated campaigns report, UK channel, July 2026 ·
      // 35 campaigns, top 13 by spend). This is the 'may' default; 3m/6m/12m each override it via their
      // own sec.advertising.campaigns, so Active Campaigns now follows the date selector (and market chip).
      campaigns: [
        {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£631',sales:'£1,514',acos:'41.6%',acosCls:'ba',roas:'2.40×',cpc:'£1.17',status:'Active',statusCls:'bg'},
        {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£437',sales:'£648',acos:'67.4%',acosCls:'br',roas:'1.48×',cpc:'£0.84',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£373',sales:'£897',acos:'41.7%',acosCls:'ba',roas:'2.40×',cpc:'£1.10',status:'Active',statusCls:'bg'},
        {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£188',sales:'£742',acos:'25.3%',acosCls:'bg',roas:'3.95×',cpc:'£0.52',status:'Active',statusCls:'bg'},
        {name:'UK · HYDRTE Travel Bottles — SP Manual',type:'Sponsored Products',spend:'£161',sales:'£308',acos:'52.1%',acosCls:'ba',roas:'1.92×',cpc:'£0.45',status:'Active',statusCls:'bg'},
        {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£118',sales:'£213',acos:'55.3%',acosCls:'ba',roas:'1.81×',cpc:'£0.34',status:'Active',statusCls:'bg'},
        {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£103',sales:'£73',acos:'140.2%',acosCls:'br',roas:'0.71×',cpc:'£1.05',status:'Active',statusCls:'bg'},
        {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£72',sales:'£108',acos:'66.5%',acosCls:'br',roas:'1.50×',cpc:'£0.78',status:'Active',statusCls:'bg'},
        {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£72',sales:'£111',acos:'64.6%',acosCls:'br',roas:'1.55×',cpc:'£0.62',status:'Active',statusCls:'bg'},
        {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£53',sales:'£181',acos:'29.5%',acosCls:'bg',roas:'3.39×',cpc:'£0.92',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£52',sales:'£415',acos:'12.4%',acosCls:'bg',roas:'8.04×',cpc:'£0.59',status:'Active',statusCls:'bg'},
        {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£35',sales:'£0',acos:'0.0%',acosCls:'bg',roas:'0.00×',cpc:'£0.58',status:'Active',statusCls:'bg'},
        {name:'UK · Lilibeth Brow Shapers — SP PAT',type:'Sponsored Products',spend:'£35',sales:'£33',acos:'105.5%',acosCls:'br',roas:'0.95×',cpc:'£0.57',status:'Active',statusCls:'bg'}
      ]
    },
    inventory: {
      // Real FBA stock snapshot from MerchantSpring product report (qty + days-cover per SKU, 6 Jul 2026).
      // All 42 selling SKUs are in stock. The fast-moving Assortment (B0FYR8DQ2G, 67 units/mo) tightened
      // to ~16 days cover; Girlactik Gel Eyeliner (~23 days) also joins the reorder watch this month.
      // No dispatch-rate source → the Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'42',dCls:'du',d:'SKUs · 0 OOS now',s:'all sold listings live'},
        {bar:'#404935',lbl:'Units on Hand',val:'1,283',dCls:'df',d:'FBA total',s:'across 42 SKUs'},
        {bar:'amber',lbl:'Stock-up Watch',val:'5',dCls:'df',dColor:'amber',d:'selling · <30d cover',s:'see priority list'},
        {bar:'green',lbl:'Buy Box (Jun)',val:'99.6%',dCls:'du',d:'featured-offer %',s:'vs 99.3% May'}
      ],
      stock: [
        {dot:'da',name:'Contours Rx Lids by Design — Assortment 4–7mm',note:'B0FYR8DQ2G · UK · top seller (67/mo)',units:'33 units',unitsColor:'amber',days:'~16 days',daysColor:'amber'},
        {dot:'dg',name:'White Luxe Teeth Whitening Kit',note:'B08SCS43Q1 · UK · White Luxe',units:'83 units',days:'~80 days'},
        {dot:'dg',name:'Contours Rx Lids by Design — 5mm',note:'B018EHTG5K · UK · Contours Rx',units:'68 units',days:'~50 days'},
        {dot:'dg',name:'Contours Rx Lids by Design — 6mm',note:'B018EHOJ2K · UK · Contours Rx',units:'78 units',days:'~67 days'},
        {dot:'dg',name:'Contours Rx Lids by Design — 4mm',note:'B08MJ1PSXN · UK · Contours Rx',units:'76 units',days:'~65 days'},
        {dot:'da',name:'Girlactik Long-Wear Gel Eyeliner',note:'B099KVFGZP · UK · low cover',units:'24 units',unitsColor:'amber',days:'~23 days',daysColor:'amber'},
        {dot:'dg',name:'Contours Rx Lids by Design — 7mm',note:'B018EDU1DA · UK · Contours Rx',units:'84 units',days:'~72 days'}
      ],
      restock: [
        {level:'amber',title:'Contours Rx Lids Assortment 4–7mm — UK',sub:'B0FYR8DQ2G · ~16 days cover · 33 units · top seller (67/mo) — stock-up this week'},
        {level:'amber',title:'Girlactik Long-Wear Gel Eyeliner — UK',sub:'B099KVFGZP · ~23 days cover · 24 units · selling 28/mo — stock-up soon'}
      ],
      // Supplier Purchase Orders (manufacturer reorder forecast). STATIC fallback transcribed from the
      // tracker; the nkv-sheet-proxy overlays this live once deployed. level = Order-By-Latest urgency.
      supplierPOs: [
        {product:'Contours Rx', lastsUntil:'June', checkAgain:'July', orderBy:'18th August', level:'amber', note:'Nailah is aware'},
        {product:'Newnique', lastsUntil:'March', checkAgain:'October', orderBy:'November', level:'green', note:'Check ZQ Portal'},
        {product:'White Luxe (Kits)', lastsUntil:'August', checkAgain:'July', orderBy:'August', level:'amber', note:'Make sure enough stock for Dec/Jan'},
        {product:'Girlactik', lastsUntil:'July', checkAgain:'May', orderBy:'June/July', level:'red', note:'?'},
        {product:'White Luxe (Strips)', lastsUntil:'Good for now', checkAgain:'January', orderBy:'—', level:'', note:''}
      ],
      // Per-market FBA stock (MerchantSpring product report, 6 Jul 2026). 'all'/'uk' use the default
      // kpis/stock/restock above. Ireland ships FBA from the UK pool (early stage, ample cover); USA
      // placed its first real orders in June 2026 (Newnique-only seller account, freshly launched) and
      // its previously out-of-stock GrowPod kit (B0FCFVGD6Y) has since been delisted from that catalogue.
      // Selected via the market chip (app.js).
      kpisByMarket: {
        irl: [
          {bar:'green',  lbl:'In Stock',      val:'23',  dCls:'du', d:'of 24 listings', s:'1 OOS · Girlactik Brown'},
          {bar:'#404935',lbl:'Units on Hand', val:'934', dCls:'df', d:'FBA total',       s:'ships from UK pool'},
          {bar:'green',  lbl:'Stock-up Watch', val:'0',   dCls:'du', d:'healthy cover',   s:'early stage · low velocity'},
          {bar:'amber',  lbl:'Out of Stock',  val:'1',   dCls:'df', dColor:'amber', d:'Girlactik Brown', s:'B09QRJ4Y44 · non-selling'}
        ],
        usa: [
          {bar:'green',  lbl:'In Stock',      val:'4',   dCls:'du', d:'of 4 ASINs',      s:'Newnique · 0 OOS'},
          {bar:'#404935',lbl:'Units on Hand', val:'145', dCls:'df', d:'FBA total',       s:'across 4 SKUs'},
          {bar:'amber',  lbl:'Stock-up Watch', val:'2',   dCls:'df', dColor:'amber', d:'~3 weeks cover', s:'2 active sellers'},
          {bar:'green',  lbl:'Out of Stock',  val:'0',   dCls:'du', d:'GrowPod kit delisted', s:'catalogue now 4 SKUs'}
        ]
      },
      stockByMarket: {
        irl: [
          {dot:'dg',name:'Contours Rx Lids by Design — 7mm',note:'B018EDU1DA · IE · Contours Rx',units:'84 units',days:'ample'},
          {dot:'dg',name:'White Luxe Teeth Whitening Kit',note:'B08SCS43Q1 · IE · White Luxe',units:'83 units',days:'ample'},
          {dot:'dg',name:'Contours Rx Lids by Design — 6mm',note:'B018EHOJ2K · IE · Contours Rx',units:'78 units',days:'ample'},
          {dot:'dg',name:'Contours Rx Lids by Design — 4mm',note:'B08MJ1PSXN · IE · Contours Rx',units:'76 units',days:'ample'},
          {dot:'dg',name:'Contours Rx Assortment 4–7mm',note:'B0FYR8DQ2G · IE · top seller · 2 listings',units:'106 units',days:'ample'},
          {dot:'dg',name:'Newnique Advanced Hair Growth Serum',note:'B0F8QMT775 · IE · Newnique',units:'29 units',days:'ample'},
          {dot:'dg',name:'Girlactik Gel Eyeliner — Pure Black',note:'B099KVFGZP · IE · Girlactik',units:'24 units',days:'ample'},
          {dot:'dr',name:'Girlactik Gel Eyeliner — Pure Brown',note:'B09QRJ4Y44 · IE · out of stock',units:'0 units',unitsColor:'red',days:'OOS',daysColor:'red'}
        ],
        usa: [
          {dot:'da',name:'Newnique Organic Hair Growth Oil',note:'B0F8QQ4M2G · US · top seller (~30/mo)',units:'22 units',unitsColor:'amber',days:'~22 days',daysColor:'amber'},
          {dot:'da',name:'Newnique Advanced Hair Growth Serum',note:'B0F8QMT775 · US · ~29/mo',units:'21 units',unitsColor:'amber',days:'~21 days',daysColor:'amber'},
          {dot:'dg',name:'Newnique Scalp Exfoliant',note:'B0F8QLYNMQ · US · seeding · no sales yet',units:'52 units',days:'ample'},
          {dot:'dg',name:'Newnique Hair Loss Serum',note:'B0F8QQGM8Y · US · seeding · no sales yet',units:'50 units',days:'ample'}
        ]
      },
      // NB: rows in these per-market lists must NOT mention a *different* market's code (UK/USA/DE…) —
      // applyMarketFilter scans row text and would hide a row tagged with a market other than the chip.
      restockByMarket: {
        irl: [
          {level:'amber',title:'Girlactik Gel Eyeliner — Pure Brown (IE)',sub:'B09QRJ4Y44 · out of stock · not currently selling · low priority · replenish on the next Contours Rx shipment'}
        ],
        usa: [
          {level:'amber',title:'Newnique Organic Hair Growth Oil — US',sub:'B0F8QQ4M2G · ~22 days cover · 22 units · selling ~30/mo · stock-up within 3 weeks'},
          {level:'amber',title:'Newnique Advanced Hair Growth Serum — US',sub:'B0F8QMT775 · ~21 days cover · 21 units · selling ~29/mo · stock-up within 3 weeks'}
        ]
      },
      // US is a separate Newnique-only seller account — the UK manufacturer PO forecast doesn't apply, so
      // hide the Supplier POs card there. Ireland ships from the UK pool, so it keeps the UK PO table.
      supplierPOsByMarket: { usa: [] }
    },
    products: {
      // KPIs + by-market table = June 2026 (page period). Groups card = trailing 12 months (its label).
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'73',dCls:'df',d:'UK listings',s:'42 sold in Jun'},
        {bar:'var(--green)',lbl:'Top Brand Rev.',val:'£9,678',dCls:'du',d:'Contours Rx',s:'69% of Jun sales'},
        {bar:'var(--blue)',lbl:'Orders (Jun)',val:'510',dCls:'dd',d:'▼ 7.4% MoM',s:'551 orders May'},
        {bar:'var(--amber)',lbl:'ASP',val:'£25.44',dCls:'df',d:'Jun avg',s:'per unit'}
      ],
      table: [
        {name:'United Kingdom',flag:'gb',revenue:'£14,144',units:'556',orders:'510',cvr:'9.8%',cvrCls:'bg',aov:'£27.73'},
        {name:'Ireland',flag:'ie',revenue:'£224',units:'7',orders:'7',cvr:'5.0%',cvrCls:'ba',aov:'£32.00'},
        {name:'United States',flag:'us',revenue:'£644',units:'59',orders:'47',cvr:'—',cvrCls:'bb',aov:'£13.70'}
      ],
      // Trailing 12 months (Jul 2025–Jun 2026) by brand · UK · real MerchantSpring product report.
      // Brand split allocated from June's real per-brand sales mix (same methodology already used for
      // Ireland's brand split below) applied to the 12-mo UK total; ad spend/TACOS scaled the same way.
      // OOS Rate = share of the brand's SKUs currently out of stock (all 0% — catalogue fully in stock now;
      // contrast the period OOS-time metric on the Overview).
      groups: [
        {name:'Contours Rx — Eyelid Strips',sales:'£116,013',units:'4,465',pct:'69%',oosRate:'0%',oosCls:'bg'},
        {name:'White Luxe — Teeth Whitening',sales:'£22,293',units:'858',pct:'13%',oosRate:'0%',oosCls:'bg'},
        {name:'Newnique — Hair Growth',sales:'£13,971',units:'538',pct:'8%',oosRate:'0%',oosCls:'bg'},
        {name:'Lilibeth — Brow & Dermaplaning',sales:'£11,963',units:'460',pct:'7%',oosRate:'0%',oosCls:'bg'},
        {name:'Girlactik — Eyeliner',sales:'£4,925',units:'190',pct:'3%',oosRate:'0%',oosCls:'bg'}
      ]
    },
    charts: {
      // Rolling trailing-6-month window — shift forward one month + append the new month on every
      // re-bake (drop the oldest). Values are MerchantSpring actuals (uk == top-level 'all'; irl/usa
      // are the per-market overlays), same convention as dateRanges.
      months: ['Feb','Mar','Apr','May','Jun','Jul'],
      rev: { all:[14104,17458,12839,15290,14079,13290], uk:[14104,17458,12839,15290,14079,13290], irl:[241,385,349,481,224,356], usa:[0,0,0,0,644,714] },
      adSpend: { all:[2960,3250,2394,3241,2932,2506], uk:[2960,3250,2394,3241,2932,2506], irl:[0,0,0,0,0,0], usa:[0,0,0,0,29,74] },
      adTacos: { all:[21.0,18.6,18.6,21.2,20.8,18.9], uk:[21.0,18.6,18.6,21.2,20.8,18.9], irl:[0,0,0,0,0,0], usa:[0,0,0,0,4.5,10.4] }
    }
  }
};

/* Products page — period + MARKET aware (MerchantSpring, 6 Jul 2026). The KPI row, the
   Performance-by-Market table and the Sales-by-Brand groups all now follow the date selector (and the
   table + groups follow the market chip). UK = channel actuals; brand splits / Top Brand Rev from the
   product report; Ireland is early-stage €-converted; USA placed its first real orders in June 2026.
   'may' is exact per-brand product-level data; 3m/6m/12m brand splits are allocated from June's real
   per-brand mix applied to each window's real UK total (same methodology as Ireland's split below) —
   these per-period structures supersede the static products.kpis/table/groups above (kept as the
   June fallback). */
(function () {
  var P = window.DASHBOARD_DATA.sections.products;
  var LBL = { may: 'Jul', '3m': '3-mo', '6m': 'YTD', '12m': '12-mo' };
  var UK = {
    may:  { rev:'£13,290',  units:530,  orders:491,  aov:'£27.07', cvr:'9.4%', asp:'£25.08', topRev:'£9,000',   topPct:'68%', sold:39 },
    '3m': { rev:'£42,659',  units:1668, orders:1550, aov:'£27.52', cvr:'8.9%', asp:'£25.58', topRev:'£29,559',  topPct:'69%', sold:47 },
    '6m': { rev:'£87,060',  units:3294, orders:3076, aov:'£28.31', cvr:'8.0%', asp:'£26.43', topRev:'£62,155',  topPct:'71%', sold:47 },
    '12m':{ rev:'£169,164', units:6511, orders:6097, aov:'£27.75', cvr:'7.3%', asp:'£25.98', topRev:'£116,013', topPct:'69%', sold:46 }
  };
  var IRL = {
    may:  { rev:'£356',   units:9,   orders:9,   aov:'£39.54', cvr:'3.6%' },
    '3m': { rev:'£1,061', units:34,  orders:32,  aov:'£33.14', cvr:'4.0%' },
    '6m': { rev:'£2,035', units:63,  orders:59,  aov:'£34.50', cvr:'3.3%' },
    '12m':{ rev:'£3,078', units:109, orders:102, aov:'£30.18', cvr:'5.0%' }
  };
  var GROUPS = {
    // [name, sales, units, %share, adSpend, TACOS, tacosCls] — 'may'/3m/6m are exact (MerchantSpring
    // generated salesByProduct report, UK channel, grouped by brand, ad spend ÷ brand sales); 12m is
    // unchanged this run (still May's per-brand mix applied to the 12m real total — see header note).
    // A new brand line (HYDRTE — Travel Bottles) launched in July with real ad spend/sales.
    // bg <20% · ba 20–40% · br >40%.
    may:  [['Contours Rx — Eyelid Strips','£9,000',270,'70%','£990','11.0%','bg'],['White Luxe — Teeth Whitening','£1,324',42,'10%','£495','37.4%','ba'],['Newnique — Hair Growth','£828',70,'7%','£366','44.2%','br'],['Lilibeth — Brow & Dermaplaning','£939',97,'7%','£174','18.5%','bg'],['Girlactik — Eyeliner','£138',8,'1%','£0','0.0%','bg'],['HYDRTE — Travel Bottles','£603',28,'5%','£279','46.2%','br']],
    '3m': [['Contours Rx — Eyelid Strips','£29,559',880,'70%','£3,141','10.6%','bg'],['White Luxe — Teeth Whitening','£5,296',174,'12%','£2,217','41.9%','br'],['Newnique — Hair Growth','£3,087',187,'7%','£1,534','49.7%','br'],['Lilibeth — Brow & Dermaplaning','£2,949',323,'7%','£538','18.2%','bg'],['Girlactik — Eyeliner','£1,037',66,'2%','£239','23.0%','ba'],['HYDRTE — Travel Bottles','£603',28,'1%','£279','46.2%','br']],
    '6m': [['Contours Rx — Eyelid Strips','£62,155',1850,'73%','£7,163','11.5%','bg'],['White Luxe — Teeth Whitening','£9,962',313,'12%','£3,804','38.2%','ba'],['Newnique — Hair Growth','£4,756',243,'6%','£2,445','51.4%','br'],['Lilibeth — Brow & Dermaplaning','£5,328',575,'6%','£949','17.8%','bg'],['Girlactik — Eyeliner','£2,241',138,'3%','£769','34.3%','ba'],['HYDRTE — Travel Bottles','£603',28,'1%','£279','46.2%','br']],
    '12m':[['Contours Rx — Eyelid Strips','£116,013',3343,'69%','£12,094','10.4%','bg'],['White Luxe — Teeth Whitening','£22,293',704,'13%','£9,435','42.3%','br'],['Newnique — Hair Growth','£13,971',821,'8%','£6,799','48.7%','br'],['Lilibeth — Brow & Dermaplaning','£11,963',1314,'7%','£1,554','13.0%','bg'],['Girlactik — Eyeliner','£4,925',328,'3%','£1,312','26.6%','ba']]
  };
  function num(x) { return x.toLocaleString('en-GB'); }
  function gbp(s) { return Number(String(s).replace(/[^0-9.]/g, '')); }
  var USA = {
    may:  { rev:'£714',   units:65,  orders:30, aov:'£23.80' },
    '3m': { rev:'£1,358', units:124, orders:77, aov:'£17.63' },
    '6m': { rev:'£1,358', units:124, orders:77, aov:'£17.63' },
    '12m':{ rev:'£644', units:59, orders:47, aov:'£13.70' }
  };
  // 'All Markets' = UK + Ireland + USA combined (USA placed its first real orders in June 2026).
  // Ireland is ~100% Contours Rx, so it rolls into Top Brand; USA is 100% Newnique, so it doesn't.
  function allCards(u, r, a, lbl) {
    var rev = gbp(u.rev) + gbp(r.rev) + gbp(a.rev), units = u.units + r.units + a.units, orders = u.orders + r.orders + a.orders;
    var topRev = gbp(u.topRev) + gbp(r.rev);
    return [
      { bar:'#404935',      lbl:'Active SKUs',    val:'73',                                dCls:'df', d:'UK + IRL + USA',    s:u.sold + ' sold (' + lbl + ')' },
      { bar:'var(--green)', lbl:'Top Brand Rev.', val:'£' + num(Math.round(topRev)),       dCls:'du', d:'Contours Rx',       s:Math.round(topRev / rev * 100) + '% of ' + lbl + ' sales' },
      { bar:'var(--blue)',  lbl:'Orders',         val:num(orders),                         dCls:'df', d:lbl + ' · All Markets', s:'AOV £' + (rev / orders).toFixed(2) },
      { bar:'var(--amber)', lbl:'ASP',            val:'£' + (rev / units).toFixed(2),      dCls:'df', d:lbl + ' avg',        s:'per unit' }
    ];
  }
  function ukCards(u, lbl) { return [
    { bar:'#404935',      lbl:'Active SKUs',    val:'73',          dCls:'df', d:'UK listings',  s:u.sold + ' sold (' + lbl + ')' },
    { bar:'var(--green)', lbl:'Top Brand Rev.', val:u.topRev,      dCls:'du', d:'Contours Rx',  s:u.topPct + ' of ' + lbl + ' sales' },
    { bar:'var(--blue)',  lbl:'Orders',         val:num(u.orders), dCls:'df', d:lbl + ' actuals', s:'AOV ' + u.aov },
    { bar:'var(--amber)', lbl:'ASP',            val:u.asp,         dCls:'df', d:lbl + ' avg',     s:'per unit' }
  ]; }
  function irlCards(r, lbl) { return [
    { bar:'#404935',      lbl:'Active SKUs',    val:'12',          dCls:'df', d:'IRL listings', s:'early stage' },
    { bar:'var(--green)', lbl:'Top Brand Rev.', val:r.rev,         dCls:'du', d:'Contours Rx',  s:'~100% of IRL' },
    { bar:'var(--blue)',  lbl:'Orders',         val:num(r.orders), dCls:'df', d:lbl + ' actuals', s:'AOV ' + r.aov },
    { bar:'var(--amber)', lbl:'ASP',            val:r.aov,         dCls:'df', d:lbl + ' avg',     s:'per unit' }
  ]; }
  var usaCards = [
    { bar:'#404935',      lbl:'Active SKUs',    val:'4',     dCls:'df', d:'Newnique · live',   s:'trading since Jun 2026' },
    { bar:'var(--green)', lbl:'Top Brand Rev.', val:'£714',  dCls:'du', d:'Newnique',          s:'Jul actuals' },
    { bar:'var(--blue)',  lbl:'Orders',         val:'30',    dCls:'du', d:'Newnique · live',   s:'AOV £23.80' },
    { bar:'var(--amber)', lbl:'ASP',            val:'£23.80',dCls:'df', d:'Jul avg',           s:'per unit' }
  ];
  function rows(u, r, a) { return [
    { name:'United Kingdom', flag:'gb', revenue:u.rev, units:num(u.units), orders:num(u.orders), cvr:u.cvr, cvrCls:'bg', aov:u.aov },
    { name:'Ireland',        flag:'ie', revenue:r.rev, units:num(r.units), orders:num(r.orders), cvr:r.cvr, cvrCls:'ba', aov:r.aov },
    { name:'United States',  flag:'us', revenue:a.rev, units:num(a.units), orders:num(a.orders), cvr:'—',   cvrCls:'bb', aov:a.aov }
  ]; }
  function grp(g) { return g.map(function (x) { return { name:x[0], sales:x[1], units:num(x[2]), pct:x[3], adSpend:x[4], tacos:x[5], tacosCls:x[6], oosRate:'0%', oosCls:'bg' }; }); }
  // Ireland — early-stage, NO ads (so Ad Spend £0 / TACOS n/a). Only three brands sell there; the split
  // is allocated from the real trailing-12mo IE brand mix (MerchantSpring product report: Contours Rx 82%
  // / White Luxe 10% / Newnique 8% by sales, 74/12/14 by units) applied to each period's IE actuals.
  function irlGroups(r) {
    var rev = gbp(r.rev), u = r.units;
    function row(name, sShare, uShare, pct) {
      return { name:name, sales:'£' + num(Math.round(rev * sShare)), adSpend:'£0', tacos:null,
               units:num(Math.round(u * uShare)), pct:pct, oosRate:'0%', oosCls:'bg' };
    }
    return [
      row('Contours Rx — Eyelid Strips', 0.82, 0.74, '82%'),
      row('White Luxe — Teeth Whitening', 0.10, 0.12, '10%'),
      row('Newnique — Hair Growth', 0.08, 0.14, '8%')
    ];
  }
  // USA — placed its first real orders in June 2026 (Newnique only); real ad spend/TACOS from the
  // MerchantSpring product report (still small-sample — a brand-new market).
  var usaGroups = [
    { name:'Newnique — Hair Growth', sales:'£714', adSpend:'£74', tacos:'10.3%', tacosCls:'ba', units:'65', pct:'100%', oosRate:'0%', oosCls:'bg' }
  ];
  P.kpisByPeriod = {}; P.tableByPeriod = {}; P.groupsByPeriod = {};
  ['may', '3m', '6m', '12m'].forEach(function (p) {
    var u = UK[p], r = IRL[p], a = USA[p], lbl = LBL[p], uc = ukCards(u, lbl), g = grp(GROUPS[p]);
    P.kpisByPeriod[p]   = { all:allCards(u, r, a, lbl), uk:uc, irl:irlCards(r, lbl), usa:usaCards };
    P.tableByPeriod[p]  = rows(u, r, a);
    P.groupsByPeriod[p] = { all:g, uk:g, irl:irlGroups(r), usa:usaGroups };
  });
})();

/* ============================================================================================
   SHOPIFY (D2C) — sections.shopify  ·  brand-filtered: All / Newnique / Contours Rx (2 stores)
   --------------------------------------------------------------------------------------------
   Re-baked for July 2026 (5 Aug 2026 pull), native GBP. Pairs two sources, mirroring the Amazon side:
   • ORDER-SIDE (net sales, orders, AOV, units, product mix, stock-on-hand) → MerchantSpring's
     Shopify channels — Contours Rx ch 33616599, Newnique ch 110450469 (the same connector that
     serves NKV's Amazon actuals).
   • SESSION-SIDE (sessions, CVR, the cart→checkout→purchase funnel, traffic-by-channel) → GA4 via
     the Reporting Ninja connector (properties/394327082 Contours Rx, properties/506386258 Newnique).
   Contours Rx UK (contours-rx.co.uk · 658f4a.myshopify.com): order-side + GA4 are both EXACT actuals
   for may/3m/6m (12m intentionally left at its prior bake — see the top-of-file header note on why
   trailing-12m wasn't touched this run). Every net-sales figure below is cross-checked to the penny
   between the period-total pull and the per-product breakdown pulled the same run. Note GA4 purchases
   (54 Jul) run below the Orders KPI (83) — orders include repeat/manual/no-session orders; the funnel
   + CVR are session-based, Orders is order-based — both valid, kept separate. "Returning Cust." is
   marked unavailable this run: GA4's totalPurchasers/firstTimePurchasers came back identical (100%
   "first-time"), which contradicts a store with real repeat orders and looks like a GA4 attribution
   gap rather than a fact — not something to bake as if it were real.
   Newnique: MerchantSpring isn't ingesting its orders yet, so its ORDER-SIDE reads "pending Executive
   integration"; its GA4 session-side IS live (277 sessions Jul). 'all' equals Contours Rx until
   Newnique's orders backfill (see the derivation at the bottom).
   Read by app.js → renderShopify() / renderShopBrands(); follows the shared date-range selector. */
window.DASHBOARD_DATA.sections.shopify = {
  brands: [
    { key: 'all',        label: 'All' },
    { key: 'newnique',   label: 'Newnique' },
    { key: 'contoursrx', label: 'Contours Rx' }
  ],
  data: {
    contoursrx: {
      label: 'Contours Rx UK', store: 'contours-rx.co.uk',
      // 6-month net-sales trend (Feb 2026 → Jul 2026), exact MerchantSpring actuals (Shopify channel
      // 33616599). Cross-checked: net sales sum to the exact penny against the per-product breakdown
      // pulled the same run.
      chart: {
        max: 4000, yTicks: ['£4k', '£3k', '£2k', '£1k', '£0'],
        xLabels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], xHighlight: '#404935',
        series: [ { values: [2907, 3243, 2621, 2416, 2783, 2387], color: '#404935', area: true, main: true } ],
        legend: [ { name: 'Net Sales', color: '#404935' } ]
      },
      // Current on-hand snapshot from MerchantSpring (Shopify channel, 5 Aug 2026). Cover = vs ~Jul run-rate.
      stock: [
        { name: 'Lids by Design Eyelid Lift Strips', note: '7 size variants · Healthy',        level: 'g', units: '1,417 units', cover: '~512 days' },
        { name: 'Exfoliating B5 Prep Pads 30pk',     note: 'SKU CR B5PREP · Healthy',          level: 'g', units: '47 units',    cover: 'ample cover' },
        { name: 'Botanical Lash & Brow Serum',       note: 'SKU CR BLBS · Healthy',            level: 'g', units: '82 units',    cover: 'ample cover' },
        { name: 'Dermal Blade (3 pack)',             note: 'SKU CR DERMA · Restock needed',    level: 'r', units: '0 units',     cover: 'OOS' }
      ],
      // Traffic by GA4 default channel group (July 2026) via Reporting Ninja. Cross-network = Google Ads
      // (Performance Max). Bar widths floored so near-zero channels stay visible. Sum shown = 2,352 of
      // 2,473 sessions (smaller channels omitted).
      traffic: [
        { lbl: 'Paid (Cross-network)', pct: 70, val: '1,723', color: 'brand' },
        { lbl: 'Organic Search',       pct: 14, val: '353',   color: 'blue' },
        { lbl: 'Direct',               pct: 9,  val: '234',   color: 'amber' },
        { lbl: 'Email',                pct: 2,  val: '42',    color: 'green' }
      ],
      byPeriod: {
        may: {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£2,387',  dCls: 'dd', d: '▼ 14.2% MoM',  s: 'vs £2,783 Jun' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '83',      dCls: 'dd', d: '▼ 13.5% MoM',  s: '96 orders Jun' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.76',  dCls: 'dd', d: '▼ £0.22 MoM',  s: '£28.98 Jun' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£27.75',  dCls: 'df', d: 'net ÷ units',  s: '86 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.18%',  dCls: 'df', d: 'GA4 · sessions', s: '54 of 2,473 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '2,473',  dCls: 'du', d: '▲ 10.8% MoM', s: 'GA4 · vs 2,232 Jun' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '86',     dCls: 'df', d: 'Lids 83 · Other 3', s: '3 active SKUs' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',      dCls: 'df', d: 'Data unavailable', s: 'not recomputed this run' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '2,473', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '90',    pct: '3.6%', w: 3.6, sub: 'GA4 · 3.6% of sessions' },
            { lbl: 'Reached Checkout', val: '54',    pct: '2.2%', w: 2.2, sub: '60% of carts retained' },
            { lbl: 'Purchased',        val: '54',    pct: '2.2%', w: 2.2, sub: '100% of checkouts · 2.18% CVR' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£2,316', units: '83', asp: '£27.91', orders: '83', share: '97.0%', shareCls: 'bg' },
            { name: 'Exfoliating B5 Prep Pads 30pk',     net: '£41',    units: '2',  asp: '£20.67', orders: '2',  share: '1.7%',  shareCls: 'bb' },
            { name: 'Botanical Lash & Brow Serum',       net: '£29',    units: '1',  asp: '£29.45', orders: '1',  share: '1.2%',  shareCls: 'bb' },
            { name: 'Dermal Blade (3 pack)',             net: '£0',     units: '0',  asp: '—',      orders: '0',  share: '—',     shareCls: 'br' }
          ]
        },
        '3m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£7,585', dCls: 'df', d: '3-mo actuals',  s: 'May–Jul 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '271',    dCls: 'df', d: '3-mo actuals',  s: 'AOV £27.99' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£27.99', dCls: 'df', d: '3-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£26.43', dCls: 'df', d: 'net ÷ units',  s: '287 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.08%', dCls: 'df', d: 'GA4 · 3-mo',   s: '154 of 7,394 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '7,394', dCls: 'df', d: 'GA4 · May–Jul', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '287',   dCls: 'df', d: 'Lids 279 · Other 8',  s: 'May–Jul' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',     dCls: 'df', d: 'Data unavailable',    s: 'not recomputed this run' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '7,394', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '290',   pct: '3.9%', w: 3.9, sub: 'GA4 · 3.9% of sessions' },
            { lbl: 'Reached Checkout', val: '173',   pct: '2.3%', w: 2.3, sub: 'GA4 begin_checkout' },
            { lbl: 'Purchased',        val: '154',   pct: '2.1%', w: 2.1, sub: '2.08% conversion' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£7,421', units: '279', asp: '£26.60', orders: '271', share: '97.8%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum)',           net: '£164',   units: '8',   asp: '—',      orders: '8',   share: '2.2%',  shareCls: 'bb' }
          ]
        },
        '6m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£16,357', dCls: 'df', d: 'YTD actuals',   s: 'Feb–Jul 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '578',     dCls: 'df', d: 'YTD actuals',   s: 'AOV £28.30' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.30',  dCls: 'df', d: 'YTD blended',   s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£26.38',  dCls: 'df', d: 'net ÷ units',  s: '620 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.48%',  dCls: 'df', d: 'GA4 · YTD',    s: '349 of 14,077 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '14,077', dCls: 'df', d: 'GA4 · Feb–Jul', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '620',   dCls: 'df', d: 'Lids 605 · Other 15', s: 'Feb–Jul' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',     dCls: 'df', d: 'Data unavailable',    s: 'not recomputed this run' }
          ],
          // NOTE: Purchased (349) fractionally exceeds Reached Checkout (332) here — a real GA4 quirk
          // (cross-session attribution: begin_checkout and purchase can land in different GA4 sessions
          // near the window boundary), not a data error. Confirmed via a bypass_cache re-query.
          funnel: [
            { lbl: 'Sessions',         val: '14,077', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '624',    pct: '4.4%', w: 4.4, sub: 'GA4 · 4.4% of sessions' },
            { lbl: 'Reached Checkout', val: '332',    pct: '2.4%', w: 2.4, sub: 'GA4 begin_checkout' },
            { lbl: 'Purchased',        val: '349',    pct: '2.5%', w: 2.5, sub: '2.48% conversion' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£16,068', units: '605', asp: '£26.56', orders: '578', share: '98.2%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum)',           net: '£289',    units: '15',  asp: '—',      orders: '15',  share: '1.8%',  shareCls: 'bb' }
          ]
        },
        '12m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£19,786', dCls: 'df', d: '12-mo actuals',  s: 'Jun 25–May 26' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '689',     dCls: 'df', d: '12-mo actuals',  s: 'AOV £28.88' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.88',  dCls: 'df', d: '12-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£25.76',  dCls: 'df', d: 'net ÷ units',  s: '768 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.00%',  dCls: 'df', d: 'GA4 · 12-mo',     s: '436 of 21,773 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '21,773', dCls: 'df', d: 'GA4 · trailing yr', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '768',   dCls: 'df', d: 'Lids 738 · others',   s: 'trailing year' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '5.8%',   dCls: 'df', d: '~40 of 689',          s: '12-mo window' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '21,773', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '853',    pct: '3.9%', w: 3.9, sub: 'GA4 · 3.9% of sessions' },
            { lbl: 'Reached Checkout', val: '514',    pct: '2.4%', w: 2.4, sub: 'GA4 begin_checkout' },
            { lbl: 'Purchased',        val: '436',    pct: '2.0%', w: 2.0, sub: '2.00% conversion' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£19,426', units: '738', asp: '£26.32', orders: '689', share: '98.2%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Dermal · Tweezers)', net: '£360',  units: '30',  asp: '—',      orders: '30',  share: '1.8%',  shareCls: 'bb' }
          ]
        }
      }
    },
    // Newnique — order-side is PENDING. MerchantSpring (Shopify ch 110450469) is connected but not yet
    // ingesting Newnique's orders, so Net Sales / Orders / AOV / ASP / Units / products / stock read
    // "pending Executive integration". Its SESSION-SIDE is LIVE from GA4 via Reporting Ninja
    // (properties/506386258) — real sessions / CVR / funnel / traffic. 'all' = Contours Rx until the
    // order feed backfills. Newnique's P&L is separate (LIGHT: revenue / COGS / Google Ads from the
    // Account Tracker via sections.shopifypnl) and unaffected.
    newnique: {
      label: 'Newnique', store: 'newniquecare.com',
      chart: null, stock: [],
      // Traffic by GA4 default channel group (July 2026) via Reporting Ninja. Sum = 258 of 277 sessions.
      traffic: [
        { lbl: 'Direct',         pct: 57, val: '158', color: 'brand' },
        { lbl: 'Organic Social', pct: 16, val: '44',  color: 'blue' },
        { lbl: 'Organic Search', pct: 16, val: '43',  color: 'amber' },
        { lbl: 'Referral',       pct: 5,  val: '13',  color: 'green' }
      ],
      placeholder: 'Pending Executive integration — order data (sales / products / stock) populates once Newnique is connected; GA4 traffic is already live.',
      byPeriod: (function () {
        // Order-side cards stay "pending" until the Executive/MerchantSpring order feed backfills;
        // session-side cards + funnel are live GA4 actuals per period.
        function pend(lbl, bar) { return { bar: bar, lbl: lbl, val: '—', dCls: 'df', d: 'Pending Executive', s: '' }; }
        function n(x) { return x.toLocaleString('en-GB'); }
        function rate(a, b) { return (a / b * 100).toFixed(1); }
        function period(sess, cart, chk, pur, cvr, win) {
          return {
            kpis1: [ pend('Net Sales', '#404935'), pend('Orders', 'var(--blue)'), pend('AOV', 'var(--green)'), pend('ASP', 'var(--amber)') ],
            kpis2: [
              { bar: '#404935',      lbl: 'Conversion Rate', val: cvr,    dCls: 'df', d: 'GA4 · ' + win, s: pur + ' of ' + n(sess) + ' sessions' },
              { bar: 'var(--blue)',  lbl: 'Sessions',        val: n(sess), dCls: 'df', d: 'GA4 · ' + win, s: 'GA4 actuals' },
              pend('Units Sold', 'var(--green)'),
              pend('Returning Cust.', 'var(--amber)')
            ],
            funnel: [
              { lbl: 'Sessions',         val: n(sess),    pct: '100%',            w: 100 },
              { lbl: 'Added to Cart',    val: String(cart), pct: rate(cart, sess) + '%', w: +rate(cart, sess), sub: 'GA4 · ' + rate(cart, sess) + '% of sessions' },
              { lbl: 'Reached Checkout', val: String(chk),  pct: rate(chk, sess) + '%',  w: +rate(chk, sess),  sub: 'GA4 begin_checkout' },
              { lbl: 'Purchased',        val: String(pur),  pct: rate(pur, sess) + '%',  w: +rate(pur, sess),  sub: cvr + ' conversion' }
            ],
            products: []
          };
        }
        return {
          may:  period(277,  30,  2,  1, '0.36%', 'Jul'),
          '3m': period(851,  141, 20, 5, '0.59%', 'May–Jul'),
          '6m': period(1165, 171, 28, 5, '0.43%', 'Feb–Jul'),
          '12m':period(1520, 186, 41, 4, '0.26%', 'trailing yr')
        };
      })()
    }
  }
};

/* 'All' currently EQUALS Contours Rx. Newnique's order-side is pending Executive integration (see its
   block above), so there's nothing to sum on the headline cards yet and 'all' just mirrors the Contours
   Rx statement. When Newnique's orders backfill, restore the CRX + Newnique sum here (headline Net
   Sales/Orders/AOV/ASP + Units sum both stores; Conversion/Sessions/funnel + stock/traffic/chart stay
   Contours Rx; products merge both ranges). */
window.DASHBOARD_DATA.sections.shopify.data.all = (function () {
  var crx = window.DASHBOARD_DATA.sections.shopify.data.contoursrx;
  var all = { label: 'All Brands', store: 'Contours Rx (Newnique orders pending)', chart: crx.chart, stock: crx.stock, traffic: crx.traffic, byPeriod: {} };
  Object.keys(crx.byPeriod).forEach(function (k) {
    var c = crx.byPeriod[k];
    all.byPeriod[k] = { kpis1: c.kpis1, kpis2: c.kpis2, funnel: c.funnel, products: c.products };
  });
  return all;
})();

/* ============================================================================================
   SHOPIFY P&L — sections.shopifypnl  ·  same brand filter (All / Newnique / Contours Rx) + periods
   --------------------------------------------------------------------------------------------
   Sourced from the NKV Beauty Account Tracker ("Shopify" block, Jan–May 2026) — the client's own
   P&L. Revenue + COGS are split by brand; the operating-expense lines (Google/social ad spend,
   Beckdale fulfilment, Shopify + transaction fees, subscription, brand manager, 5.5% TD fee) are
   tracked at Shopify-total level and sit on the Contours Rx statement (CRX ≈ 99% of D2C). 'other'
   is the tracker's residual (~£160/mo) that makes each month foot to its "Shopify Expenses" total,
   so Net Profit ties exactly to the sheet's "Profit after COGS". Newnique is tracked LIGHT (own
   revenue / COGS / Google Ads only); 'All' = Contours Rx + Newnique combined. These baked monthly
   inputs are the offline fallback — nkv-sheet-proxy serves sections.shopifypnl live on top. */
(function () {
  // Monthly inputs from the NKV Beauty Account Tracker ("Shopify" block, Jan–May 2026). Shared opex
  // lines are Shopify-total (attributed to Contours Rx); 'other' is the tracker residual that foots
  // each month to its "Shopify Expenses" total so Net Profit matches the sheet's "Profit after COGS".
  // totRev = the sheet's "Total Shopify Revenue" row (drives the All view). It equals crxRev + nkvRev
  // EXCEPT Feb, where an Amazon-FBM manual order keyed via Shopify (£84.95) is deliberately excluded
  // from the Shopify total — copied exactly so All ties to the sheet's "Profit after COGS" each month.
  var M = {
    jan: { crxRev:2127, nkvRev:0,      totRev:2127,    crxCogs:666,    nkvCogs:0,  gAdsCrx:695.97, gAdsNkv:0,      social:0,     ship:272.83, txn:61.68, app:18.06, sub:25, bm:200, td:116.99, other:160.00 },
    feb: { crxRev:2937, nkvRev:84.95,  totRev:2937,    crxCogs:931,    nkvCogs:20, gAdsCrx:571.33, gAdsNkv:0,      social:21.50, ship:686.40, txn:85.17, app:15.04, sub:25, bm:200, td:161.54, other:140.00 },
    mar: { crxRev:3243, nkvRev:0,      totRev:3243,    crxCogs:978.50, nkvCogs:0,  gAdsCrx:573.70, gAdsNkv:0,      social:0,     ship:611.88, txn:94.05, app:15.11, sub:25, bm:200, td:178.37, other:159.99 },
    apr: { crxRev:2672, nkvRev:0,      totRev:2672,    crxCogs:753,    nkvCogs:0,  gAdsCrx:575.65, gAdsNkv:0,      social:0,     ship:558.72, txn:77.49, app:15.27, sub:25, bm:200, td:146.96, other:160.00 },
    may: { crxRev:2446, nkvRev:222.95, totRev:2668.95, crxCogs:779,    nkvCogs:16, gAdsCrx:713.84, gAdsNkv:194.50, social:0,     ship:479.61, txn:77.40, app:14.99, sub:25, bm:180, td:146.79, other:164.00 }
  };
  var PERIODS = {
    may:  { months:['may'],                         label:'May 2026' },
    '3m': { months:['mar','apr','may'],             label:'Mar–May 2026' },
    '6m': { months:['jan','feb','mar','apr','may'], label:'Jan–May 2026 (YTD)' },
    '12m':{ months:['jan','feb','mar','apr','may'], label:'Jun 25–May 26', partial:true }
  };
  var KEYS = ['crxRev','nkvRev','totRev','crxCogs','nkvCogs','gAdsCrx','gAdsNkv','social','ship','txn','app','sub','bm','td','other'];
  function agg(months) { var a = {}; KEYS.forEach(function (k) { a[k] = 0; });
    months.forEach(function (m) { KEYS.forEach(function (k) { a[k] += M[m][k]; }); }); return a; }

  function money(n) { var r = Math.round(n); return (r < 0 ? '−£' : '£') + Math.abs(r).toLocaleString('en-GB'); }
  function paren(n) { return '(£' + Math.round(n).toLocaleString('en-GB') + ')'; }   // expense magnitude
  function pct(x) { return (x * 100).toFixed(1) + '%'; }

  // Contours Rx (full statement). combined=true → 'All' (adds Newnique revenue/COGS/Google Ads).
  function fullStatement(a, combined, label) {
    var netRev = combined ? a.totRev : a.crxRev;   // All = sheet's Total Shopify Revenue (Feb excludes the FBM order)
    var cogs   = a.crxCogs + (combined ? a.nkvCogs : 0);
    var gAds   = a.gAdsCrx + (combined ? a.gAdsNkv : 0);
    var gp = netRev - cogs, platform = a.txn + a.app;
    var pp = function (v) { return netRev ? pct(v / netRev) : ''; };
    var opex = [
      ['Advertising — Google Ads',    gAds,     'NKV Google Ads · Account Tracker'],
      ['Advertising — Social Media',  a.social, 'Meta / TikTok'],
      ['Shipping & Fulfilment',       a.ship,   'Beckdale — pick, ship & storage (inc. VAT)'],
      ['Platform & Transaction Fees', platform, 'Shopify 2.9% + app fees'],
      ['Software & Subscriptions',    a.sub,    'Shopify subscription'],
      ['Brand Manager',               a.bm,     ''],
      ['TD Consultancy Fee',          a.td,     '5.5% of Shopify revenue'],
      ['Other Operating Costs',       a.other,  'per Account Tracker']
    ];
    var totalOpex = opex.reduce(function (s, l) { return s + l[1]; }, 0);
    var netProfit = gp - totalOpex;
    var rows = [
      { kind: 'header', label: 'Revenue' },
      { kind: 'sub', label: 'Net Revenue', note: 'net of discounts & returns', val: money(netRev), pct: '100%' },
      { kind: 'header', label: 'Cost of Sales' },
      { label: 'COGS', note: 'Account Tracker unit costs', val: paren(cogs), pct: pp(cogs) },
      { kind: 'sub', label: 'Gross Profit', val: money(gp), pct: pp(gp) },
      { kind: 'header', label: 'Operating Expenses' }
    ];
    opex.forEach(function (l) { rows.push({ label: l[0], note: l[2], val: paren(l[1]), pct: pp(l[1]) }); });
    rows.push({ kind: 'sub', label: 'Total Operating Expenses', val: paren(totalOpex), pct: pp(totalOpex) });
    rows.push({ kind: 'total', label: 'Net Profit', note: netProfit < 0 ? 'Loss this period' : '', val: money(netProfit), pct: pp(netProfit) });
    return {
      kpis: [
        { bar: '#404935',      lbl: 'Net Revenue',  val: money(netRev),    dCls: 'df', d: 'Account Tracker',     s: label },
        { bar: 'var(--green)', lbl: 'Gross Profit', val: money(gp),        dCls: 'df', d: pp(gp) + ' margin',    s: 'after COGS' },
        { bar: 'var(--blue)',  lbl: 'Total OpEx',   val: money(totalOpex), dCls: 'df', d: pp(totalOpex),        s: 'inc. ads + fulfilment' },
        { bar: 'var(--amber)', lbl: 'Net Profit',   val: money(netProfit), dCls: netProfit < 0 ? 'dd' : 'du', d: pp(netProfit) + ' margin', s: netProfit < 0 ? 'loss' : 'profit' }
      ],
      rows: rows
    };
  }

  // Newnique — tracked LIGHT: own revenue / COGS / Google Ads only.
  function lightStatement(a, label) {
    var netRev = a.nkvRev, cogs = a.nkvCogs, gp = netRev - cogs, gAds = a.gAdsNkv, netProfit = gp - gAds;
    var pp = function (v) { return netRev ? pct(v / netRev) : ''; };
    return {
      kpis: [
        { bar: '#404935',      lbl: 'Net Revenue',    val: money(netRev), dCls: 'df', d: 'Account Tracker', s: label },
        { bar: 'var(--green)', lbl: 'Gross Profit',   val: money(gp),     dCls: 'df', d: pp(gp) + ' margin', s: 'after COGS' },
        { bar: 'var(--blue)',  lbl: 'Google Ad Spend',val: money(gAds),   dCls: 'df', d: 'Newnique',        s: '' },
        { bar: 'var(--amber)', lbl: 'Net Profit',     val: money(netProfit), dCls: netProfit < 0 ? 'dd' : 'du', d: 'pre-allocation', s: '' }
      ],
      rows: [
        { kind: 'header', label: 'Revenue' },
        { kind: 'sub', label: 'Net Revenue', note: 'net of discounts & returns', val: money(netRev), pct: netRev ? '100%' : '' },
        { kind: 'header', label: 'Cost of Sales' },
        { label: 'COGS', note: 'Account Tracker (£4/unit)', val: paren(cogs), pct: pp(cogs) },
        { kind: 'sub', label: 'Gross Profit', val: money(gp), pct: pp(gp) },
        { kind: 'header', label: 'Operating Expenses' },
        { label: 'Advertising — Google Ads', note: 'Newnique Google Ads · Account Tracker', val: paren(gAds), pct: pp(gAds) },
        { label: 'Shared costs (fulfilment, fees, subs)', note: 'tracked combined under Contours Rx', val: 'n/a', muted: true },
        { kind: 'total', label: 'Net Profit', note: 'before shared-cost allocation', val: money(netProfit), pct: pp(netProfit) }
      ]
    };
  }

  var crxInfo = 'Live from the NKV Beauty Account Tracker (Jan–May 2026). Revenue is net of discounts/returns; COGS uses the tracker’s estimated unit costs; expense lines are sheet actuals. Net Profit ties to the sheet’s “Profit after COGS”.';
  var nkvInfo = 'Newnique is tracked “light” — its own revenue, COGS and Google Ads. Shared D2C costs sit under Contours Rx; see the combined view under “All”.';
  var partialNote = 'Trailing-12-month view — the Account Tracker currently itemises Jan–May 2026, so this reflects YTD. Earlier-month expenses populate as they’re entered.';

  var statusList = [
    { label: 'Revenue (Tracker)',           status: 'live', note: 'Account Tracker · Jan–May 2026' },
    { label: 'COGS / unit costs',           status: 'est',  note: 'Tracker estimated unit costs' },
    { label: 'Google Ads spend',            status: 'live', note: 'Account Tracker (CRX + Newnique from May)' },
    { label: 'Social ad spend',             status: 'live', note: 'Account Tracker' },
    { label: 'Shipping & fulfilment',       status: 'live', note: 'Beckdale · Account Tracker' },
    { label: 'Platform & transaction fees', status: 'live', note: 'Shopify 2.9% + app fees' },
    { label: 'Software & subscriptions',    status: 'live', note: 'Shopify subscription' },
    { label: 'Brand Manager / TD fee',      status: 'live', note: 'Account Tracker' },
    { label: 'Other operating costs',       status: 'est',  note: 'Tracker residual (≈£160/mo)' }
  ];

  var contours = { label: 'Contours Rx UK', store: 'contours-rx.co.uk', statusList: statusList, info: crxInfo, byPeriod: {} };
  var newnique = { label: 'Newnique', store: 'newniquecare.com', statusList: [
      { label: 'Revenue (Tracker)',   status: 'live',  note: 'Account Tracker' },
      { label: 'COGS',                status: 'est',   note: '£4/unit (Account Tracker)' },
      { label: 'Google Ads spend',    status: 'live',  note: 'Account Tracker (from May)' },
      { label: 'Shared opex',         status: 'input', note: 'tracked combined under Contours Rx' }
    ], info: nkvInfo, byPeriod: {} };
  var all = { label: 'All Brands', store: 'Contours Rx + Newnique (combined)', statusList: statusList, info: crxInfo, byPeriod: {} };

  Object.keys(PERIODS).forEach(function (k) {
    var pr = PERIODS[k], a = agg(pr.months);
    var crx = fullStatement(a, false, pr.label), comb = fullStatement(a, true, pr.label), nkv = lightStatement(a, pr.label);
    if (pr.partial) { crx.info = comb.info = nkv.info = partialNote; }
    contours.byPeriod[k] = crx; all.byPeriod[k] = comb; newnique.byPeriod[k] = nkv;
  });

  window.DASHBOARD_DATA.sections.shopifypnl = { data: { contoursrx: contours, newnique: newnique, all: all } };
})();
