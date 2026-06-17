/* NKV Beauty — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 14 Jun 2026 (channel 71662311, seller A1SNRD9T28Z9ZM), native GBP.
   UK is the live market (real data). Ireland is early-stage (small real May/Apr actuals; longer-period
   figures are approximate). USA is a not-yet-launched placeholder (zeros).
   NOTE: the shared app.js trend-chart axis formatter (moneyK) hardcodes '€' — KPI cards/tables/P&L here
   are all in £, but the two trend-chart Y-axes will display '€' until the template adds a currency option.
   dataSource.type is 'static' (no Sheet/Apps Script proxy for NKV yet). */
window.DASHBOARD_DATA = {
  dateRanges: {
  'may': {
    label: 'May 2026', shortLabel: 'May 2026',
    rev: '£15,693', revD: '▲ 19.1% MoM', revC: 'du', revS: 'vs £13,127 Apr',
    adSales: '£7,637', adSalesD: '▲ 9.2% MoM', adSalesC: 'du', adSalesS: '48.7% of revenue',
    tacos: '20.4%', tacosD: '▲ 1.7pp vs Apr', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.39×', roasD: '▼ 0.53× vs Apr', roasC: 'df', roasS: '573 orders · AOV £27.39',
    spend: '£3,201', spendD: '▲ 33.7% MoM', spendC: 'df', spendS: 'vs £2,394 Apr',
    tacosAd: '20.4%', tacosAdD: '▲ 1.7pp vs Apr', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.39×', roasAdD: '▼ 0.53× vs Apr', roasAdC: 'df', roasAdS: '£15,693 revenue',
    aov: '£27.39', aovD: '', aovC: 'df', aovS: '573 orders May',
    mktRows: [
      ['UK','gb','—','£3,201','bb','UK ad-managed','£15,213','ba','21.0%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£480','bb','—'],
      ['USA','us','—','£0','bb','Not launched','£0','bb','—'],
      ['Total',null,'—','£3,201','bb','85% of catalogue live','£15,693','ba','20.4%']
    ],
    marketKpis: {
      uk: { rev:'£15,213', adSales:'£7,637', tacos:'21.0%', roas:'2.39×', spend:'£3,201', aov:'£27.26', tacosAd:'21.0%', roasAd:'2.39×', revC:'du', adSalesC:'du', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'558 orders · AOV £27.26', roasAdS:'£15,213 revenue', aovD:'', aovS:'558 orders May', adSalesS:'50.2% of revenue', revD:'▲ 19.1% MoM', revS:'vs £12,775 Apr', spendD:'▲ 33.7% MoM', spendS:'vs £2,394 Apr', tacosD:'▲ 2.3pp vs Apr', tacosAdD:'▲ 2.3pp vs Apr', roasD:'▼ 0.53× vs Apr', roasAdD:'▼ 0.53× vs Apr', adSalesD:'▲ 9.2% MoM' },
      irl: { rev:'£480', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£32.00', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'15 orders', roasAdS:'£480 revenue', aovD:'', aovS:'15 orders May', adSalesS:'No ad spend', revD:'Early stage', revS:'vs £352 Apr', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£0', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£0', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Not launched', roasS:'—', roasAdS:'Not launched', aovD:'', aovS:'—', adSalesS:'Not launched', revD:'Not launched', revS:'channel pending', spendD:'', spendS:'—', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.4,sales:'£6.6k',acos:'42.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.6,sales:'£1.0k',acos:'24.7%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.0,sales:'£0.0k',acos:'n/a'} ] },
  },
  '3m': {
    label: 'Mar–May 2026', shortLabel: 'Mar–May 2026',
    rev: '£46,598', revD: '3-month actuals', revC: 'du', revS: '',
    adSales: '£24,444', adSalesD: '3-month actuals', adSalesC: 'df', adSalesS: '52.5% of revenue',
    tacos: '19.0%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.76×', roasD: '', roasC: 'df', roasS: '',
    spend: '£8,845', spendD: '3-month actuals', spendC: 'df', spendS: '',
    tacosAd: '19.0%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.76×', roasAdD: '', roasAdC: 'df', roasAdS: '£46,598 revenue',
    aov: '£29.30', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£8,845','bb','UK ad-managed','£45,366','ba','19.5%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£1,232','bb','—'],
      ['USA','us','—','£0','bb','Not launched','£0','bb','—'],
      ['Total',null,'—','£8,845','bb','3-month actuals','£46,598','ba','19.0%']
    ],
    marketKpis: {
      uk: { rev:'£45,366', adSales:'£24,444', tacos:'19.5%', roas:'2.76×', spend:'£8,845', aov:'£29.20', tacosAd:'19.5%', roasAd:'2.76×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£45,366 revenue', aovD:'', aovS:'', adSalesS:'53.9% of revenue', revD:'3-month actuals', revS:'', spendD:'3-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'3-month actuals' },
      irl: { rev:'£1,232', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£30.00', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£1,232 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage (approx)', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£0', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£0', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Not launched', roasS:'', roasAdS:'Not launched', aovD:'', aovS:'', adSalesS:'Not launched', revD:'Not launched', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.4,sales:'£6.6k',acos:'42.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.6,sales:'£1.0k',acos:'24.7%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.0,sales:'£0.0k',acos:'n/a'} ] },
  },
  '6m': {
    label: 'Jan–May 2026 (YTD)', shortLabel: 'Jan–May 2026',
    rev: '£77,282', revD: '5-month actuals', revC: 'du', revS: '',
    adSales: '£42,847', adSalesD: '5-month actuals', adSalesC: 'df', adSalesS: '55.4% of revenue',
    tacos: '19.5%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.85×', roasD: '', roasC: 'df', roasS: '',
    spend: '£15,046', spendD: '5-month actuals', spendC: 'df', spendS: '',
    tacosAd: '19.5%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.85×', roasAdD: '', roasAdC: 'df', roasAdS: '£77,282 revenue',
    aov: '£28.10', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£15,046','bb','UK ad-managed','£75,182','ba','20.0%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£2,100','bb','—'],
      ['USA','us','—','£0','bb','Not launched','£0','bb','—'],
      ['Total',null,'—','£15,046','bb','5-month actuals','£77,282','ba','19.5%']
    ],
    marketKpis: {
      uk: { rev:'£75,182', adSales:'£42,847', tacos:'20.0%', roas:'2.85×', spend:'£15,046', aov:'£27.98', tacosAd:'20.0%', roasAd:'2.85×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£75,182 revenue', aovD:'', aovS:'', adSalesS:'57.0% of revenue', revD:'5-month actuals', revS:'', spendD:'5-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'5-month actuals' },
      irl: { rev:'£2,100', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£30.00', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£2,100 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage (approx)', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£0', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£0', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Not launched', roasS:'', roasAdS:'Not launched', aovD:'', aovS:'', adSalesS:'Not launched', revD:'Not launched', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.4,sales:'£6.6k',acos:'42.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.6,sales:'£1.0k',acos:'24.7%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.0,sales:'£0.0k',acos:'n/a'} ] },
  },
  '12m': {
    label: 'Last 12 Months', shortLabel: 'Last 12 Months',
    rev: '£173,200', revD: 'Trailing 12 months', revC: 'du', revS: 'incl. 1 estimated month (Oct)',
    adSales: '£93,973', adSalesD: 'Trailing 12 months', adSalesC: 'df', adSalesS: '54.3% of revenue',
    tacos: '19.1%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.84×', roasD: '', roasC: 'df', roasS: '',
    spend: '£33,105', spendD: 'Trailing 12 months', spendC: 'df', spendS: '',
    tacosAd: '19.1%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.84×', roasAdD: '', roasAdC: 'df', roasAdS: '£173,200 revenue',
    aov: '£27.60', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£33,105','bb','UK ad-managed','£168,700','ba','19.6%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£4,500','bb','—'],
      ['USA','us','—','£0','bb','Not launched','£0','bb','—'],
      ['Total',null,'—','£33,105','bb','Trailing 12 months','£173,200','ba','19.1%']
    ],
    marketKpis: {
      uk: { rev:'£168,700', adSales:'£93,973', tacos:'19.6%', roas:'2.84×', spend:'£33,105', aov:'£27.42', tacosAd:'19.6%', roasAd:'2.84×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£168,700 revenue', aovD:'', aovS:'', adSalesS:'55.7% of revenue', revD:'Trailing 12 months', revS:'incl. 1 estimated month', spendD:'Trailing 12 months', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'Trailing 12 months' },
      irl: { rev:'£4,500', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£30.00', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£4,500 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage (approx)', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£0', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£0', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Not launched', roasS:'', roasAdS:'Not launched', aovD:'', aovS:'', adSalesS:'Not launched', revD:'Not launched', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.4,sales:'£6.6k',acos:'42.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.6,sales:'£1.0k',acos:'24.7%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.0,sales:'£0.0k',acos:'n/a'} ] },
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
      buyBox: [
        {flag:'gb',label:'United Kingdom',pct:99,valText:'99.3%',color:'green'},
        {flag:'ie',label:'Ireland',pct:0,valText:'n/a',color:'amber'}
      ],
      cvr: { val:'9.6%', note:'May 2026 · 6,168 sessions', sub:'UK · session conversion' },
      // Stock Warnings = Amazon FBA low-stock / availability only (real, MerchantSpring May 2026).
      // (Account-health/strategy alerts moved to their own section — see ACCOUNT-HEALTH note below.)
      stockWarn: { badge:'2 low stock', items:[
        {level:'amber',title:'Contours Rx 2-Pack (6mm) — low stock',sub:'B0C12KT8L6 · ~11 days cover · 3 units — reorder'},
        {level:'amber',title:'Newnique Advanced Hair Growth Serum — low stock',sub:'B0F8QMT775 · ~15 days cover · 12 units — reorder'},
        {level:'green',title:'No suppressed listings',sub:'0 content/policy blocks · catalogue clean'}
      ] },
      // Account Health = strategy / performance alerts (real, MerchantSpring May 2026). Renders in the
      // bottom-of-Overview "Account Health" card (separate from the stock-only Stock Warnings card).
      healthSpec: { badge:'3 alerts', items:[
        {level:'red',title:'High-ACOS campaigns wasting spend',sub:'Whitening Kits 52.7% · Advanced Hair Growth 159% — review bids & keywords'},
        {level:'amber',title:'Buy Box lost on Contours Rx Assortment',sub:'B0FYR8DQ2G (top SKU) — competing sellers winning the box'},
        {level:'amber',title:'Refund rate 3.3%, up from 2.5%',sub:'16 units refunded in May · watch Contours Rx returns'}
      ] }
    },
    pnl: {
      statement: {
        fixedLabel: 'May 2026 (1–30) · financial basis (MerchantSpring)',
        summary: [ {val:'£13,923',lbl:'Net Revenue',color:'brand'}, {val:'£9,757',lbl:'Total Costs',color:'red'}, {val:'£4,166',lbl:'Net Profit',color:'green'} ],
        margin: { pct:'29.9%', pctColor:'green', note:'May 2026 (30-day) · financial basis (MerchantSpring) · UK channel', rows:[
          {lbl:'Net Revenue', val:'£13,923'},
          {lbl:'Advertising', val:'-£3,255', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-£3,202', color:'red'},
          {lbl:'COGS', val:'-£3,277', color:'red'},
          {lbl:'Net Profit', val:'£4,166', color:'green', strong:true}
        ] },
        mkt: [
          {name:'United Kingdom',flag:'gb',revenue:'£13,923',adspend:'£3,255',net:'£4,166',netColor:'green',margin:'29.9%',marginCls:'ba'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'£14,400', pct:'103.4%', unit:'£24.66'},
            {lbl:'Refunds', amount:'-£500', pct:'-3.6%', unit:'-£0.86'},
            {lbl:'Reimbursements', amount:'£125', pct:'0.9%', unit:'£0.21'},
            {lbl:'Promotions', amount:'-£451', pct:'-3.2%', unit:'-£0.77'},
            {lbl:'Other income', amount:'£350', pct:'2.5%', unit:'£0.60'},
            {lbl:'Net revenue', amount:'£13,923', pct:'100.0%', unit:'£23.84', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising', amount:'£3,255', pct:'23.4%', unit:'£5.57'},
            {lbl:'Selling fees', amount:'£2,059', pct:'14.8%', unit:'£3.53'},
            {lbl:'Shipping & fulfilment fees', amount:'£1,143', pct:'8.2%', unit:'£1.96'},
            {lbl:'Cost of goods', amount:'£3,277', pct:'23.5%', unit:'£5.61'},
            {lbl:'Refunds & returns overheads', amount:'£18', pct:'0.1%', unit:'£0.03'},
            {lbl:'Other', amount:'£6', pct:'0.0%', unit:'£0.01'},
            {lbl:'Total expenses', amount:'£9,757', pct:'70.1%', unit:'£16.71', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'£4,166', pct:'29.9%', unit:'£7.13', total:true, profit:true},
            {lbl:'Profit %', amount:'29.9%', accent:'green'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS %', amount:'21.3%'},
            {lbl:'Ad spend', amount:'£3,255'}
          ] }
        ]
      }
    },
    advertising: {
      // Real May 2026 ad totals (MerchantSpring advertising report, UK channel, GBP).
      metrics: [
        {lbl:'Total Spend',  val:'£3,201', id:'a-spend'},
        {lbl:'Ad Sales',     val:'£7,637', color:'brand'},
        {lbl:'ACOS',         val:'41.9%',  color:'amber'},
        {lbl:'TACOS',        val:'21.0%',  color:'amber', id:'a-tacos'},
        {lbl:'ROAS',         val:'2.39×',  id:'a-roas'},
        {lbl:'Avg. CPC',     val:'£0.87'},
        {lbl:'Impressions',  val:'1.58M'},
        {lbl:'New-to-Brand', val:'10.5%',  color:'green'}
      ],
      // Ad budget = £3,000/mo (NKV tracker · Marketing Activity sheet) vs real May actual spend.
      // Overwrites the template's AMACX placeholder budget table. Goes live via nkv-sheet-proxy.
      budgets: {
        subLabel: 'May 2026 · budget vs actual',
        headers: ['Monthly Budget','May Actual','Variance','Utilisation'],
        rows: [
          {name:'United Kingdom', flag:'gb', cells:['£3,000','£3,201','▲ £201 over','107%']},
          {name:'Total', total:true,         cells:['£3,000','£3,201','▲ £201 over','107%']}
        ]
      },
      // No clean forward ad forecast in the tracker yet (the "Forecast Document" is being rebuilt).
      forecast: [
        {month:'—', budget:'Forecast being rebuilt — see tracker', pct:0, tacos:'—', roas:'—'}
      ],
      campaigns: [
        {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£880',sales:'£1,668',acos:'52.7%',acosCls:'br',roas:'1.90×',cpc:'£0.98',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£678',sales:'£1,731',acos:'39.2%',acosCls:'ba',roas:'2.55×',cpc:'£1.05',status:'Active',statusCls:'bg'},
        {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£256',sales:'£1,040',acos:'24.7%',acosCls:'bg',roas:'4.06×',cpc:'£0.56',status:'Active',statusCls:'bg'},
        {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£250',sales:'£323',acos:'77.6%',acosCls:'br',roas:'1.29×',cpc:'£0.87',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£242',sales:'£653',acos:'37.0%',acosCls:'ba',roas:'2.70×',cpc:'£0.85',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£92',sales:'£855',acos:'10.8%',acosCls:'bg',roas:'9.28×',cpc:'£0.75',status:'Active',statusCls:'bg'},
        {name:'UK · Eye-Liners — SP Manual',type:'Sponsored Products',spend:'£110',sales:'£221',acos:'49.6%',acosCls:'br',roas:'2.02×',cpc:'£0.96',status:'Active',statusCls:'bg'},
        {name:'UK · Lilibeth Brow Shapers — SP PAT',type:'Sponsored Products',spend:'£87',sales:'£207',acos:'41.9%',acosCls:'ba',roas:'2.39×',cpc:'£0.62',status:'Active',statusCls:'bg'},
        {name:'UK · Newnique Brand Defense — SP Manual',type:'Sponsored Products',spend:'£71',sales:'£225',acos:'31.6%',acosCls:'ba',roas:'3.16×',cpc:'£0.94',status:'Active',statusCls:'bg'},
        {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£48',sales:'£191',acos:'24.9%',acosCls:'bg',roas:'4.01×',cpc:'£0.88',status:'Active',statusCls:'bg'},
        {name:'UK · Advanced Hair Growth — SP Auto',type:'Sponsored Products',spend:'£64',sales:'£40',acos:'159.4%',acosCls:'br',roas:'0.63×',cpc:'£0.81',status:'Active',statusCls:'bg'},
        {name:'UK · Botanical Lash — SP Auto',type:'Sponsored Products',spend:'£41',sales:'£0',acos:'n/a',acosCls:'br',roas:'0.00×',cpc:'£1.86',status:'Active',statusCls:'bg'},
        {name:'UK · Lilibeth Tweezers — SP Manual',type:'Sponsored Products',spend:'£33',sales:'£50',acos:'66.9%',acosCls:'br',roas:'1.50×',cpc:'£0.78',status:'Paused',statusCls:'ba'}
      ]
    },
    inventory: {
      // Real FBA stock snapshot from MerchantSpring product report (qty + days-cover per SKU). All
      // sold SKUs are currently in stock; the 36.4% is OOS *time during May* (buy-box lost), now restocked.
      // No dispatch-rate source → the Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'44',dCls:'du',d:'SKUs · 0 OOS now',s:'all sold listings live'},
        {bar:'#404935',lbl:'Units on Hand',val:'1,407',dCls:'df',d:'FBA total',s:'across 44 SKUs'},
        {bar:'amber',lbl:'Reorder Watch',val:'2',dCls:'df',dColor:'amber',d:'selling · <15d cover',s:'see priority list'},
        {bar:'red',lbl:'OOS Time (May)',val:'36.4%',dCls:'dd',d:'buy-box lost in May',s:'now restocked'}
      ],
      stock: [
        {dot:'dg',name:'Contours Rx Lids by Design — Assortment 4–7mm',note:'B0FYR8DQ2G · UK · Contours Rx',units:'84 units',days:'~41 days'},
        {dot:'dg',name:'White Luxe Teeth Whitening Kit',note:'B08SCS43Q1 · UK · White Luxe',units:'74 units',days:'~57 days'},
        {dot:'dg',name:'Contours Rx Lids by Design — 4mm',note:'B08MJ1PSXN · UK · Contours Rx',units:'101 units',days:'~74 days'},
        {dot:'dg',name:'Contours Rx Lids by Design — 7mm',note:'B018EDU1DA · UK · Contours Rx',units:'63 units',days:'~51 days'},
        {dot:'da',name:'Contours Rx Lids by Design — 2-Pack 6mm',note:'B0C12KT8L6 · UK · low cover',units:'3 units',unitsColor:'amber',days:'~11 days',daysColor:'amber'},
        {dot:'da',name:'Newnique Advanced Hair Growth Serum',note:'B0F8QMT775 · UK · low cover',units:'12 units',unitsColor:'amber',days:'~15 days',daysColor:'amber'},
        {dot:'dg',name:'Newnique Hair Growth Kit — GrowPod',note:'B0FCFVGD6Y · UK · Newnique',units:'30 units',days:'~129 days'}
      ],
      restock: [
        {level:'amber',title:'Contours Rx Lids 2-Pack (6mm) — UK',sub:'B0C12KT8L6 · ~11 days cover · 3 units · selling — order this week'},
        {level:'amber',title:'Newnique Advanced Hair Growth Serum — UK',sub:'B0F8QMT775 · ~15 days cover · 12 units · order soon'}
      ],
      // Supplier Purchase Orders (manufacturer reorder forecast). STATIC fallback transcribed from the
      // tracker; the nkv-sheet-proxy overlays this live once deployed. level = Order-By-Latest urgency.
      supplierPOs: [
        {product:'Contours Rx', lastsUntil:'June', checkAgain:'July', orderBy:'18th August', level:'amber', note:'Nailah is aware'},
        {product:'Newnique', lastsUntil:'March', checkAgain:'October', orderBy:'November', level:'green', note:'Check ZQ Portal'},
        {product:'White Luxe (Kits)', lastsUntil:'August', checkAgain:'July', orderBy:'August', level:'amber', note:'Make sure enough stock for Dec/Jan'},
        {product:'Girlactik', lastsUntil:'July', checkAgain:'May', orderBy:'June/July', level:'red', note:'?'},
        {product:'White Luxe (Strips)', lastsUntil:'Good for now', checkAgain:'January', orderBy:'—', level:'', note:''}
      ]
    },
    products: {
      // KPIs + by-market table = May 2026 (page period). Groups card = trailing 12 months (its label).
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'46',dCls:'df',d:'UK listings',s:'44 sold in May'},
        {bar:'var(--green)',lbl:'Top Brand Rev.',val:'£10,472',dCls:'du',d:'Contours Rx',s:'69% of May sales'},
        {bar:'var(--blue)',lbl:'Orders (May)',val:'558',dCls:'du',d:'▲ 31.9% MoM',s:'423 orders Apr'},
        {bar:'var(--amber)',lbl:'ASP',val:'£26.17',dCls:'df',d:'May avg',s:'per unit'}
      ],
      table: [
        {name:'United Kingdom',flag:'gb',revenue:'£15,213',units:'584',orders:'558',cvr:'9.6%',cvrCls:'bg',aov:'£27.26'},
        {name:'Ireland',flag:'ie',revenue:'£480',units:'18',orders:'15',cvr:'4.4%',cvrCls:'ba',aov:'£32.00'},
        {name:'United States',flag:'us',revenue:'£0',units:'0',orders:'0',cvr:'—',cvrCls:'bb',aov:'£0.00'}
      ],
      // Trailing 12 months (Jun 2025–May 2026) by brand · UK · real MerchantSpring product report.
      // OOS Rate = share of the brand's SKUs currently out of stock (all 0% — catalogue fully in stock now,
      // 40–80 days cover; contrast the period OOS-time metric on the Overview).
      groups: [
        {name:'Contours Rx — Eyelid Strips',sales:'£102,401',units:'3,103',pct:'70%',oosRate:'0%',oosCls:'bg'},
        {name:'White Luxe — Teeth Whitening',sales:'£20,120',units:'572',pct:'14%',oosRate:'0%',oosCls:'bg'},
        {name:'Lilibeth — Brow & Dermaplaning',sales:'£11,352',units:'1,148',pct:'8%',oosRate:'0%',oosCls:'bg'},
        {name:'Newnique — Hair Growth',sales:'£8,861',units:'336',pct:'6%',oosRate:'0%',oosCls:'bg'},
        {name:'Girlactik — Eyeliner',sales:'£4,534',units:'289',pct:'3%',oosRate:'0%',oosCls:'bg'}
      ]
    },
    charts: {
      months: ['Dec','Jan','Feb','Mar','Apr','May'],
      rev: { all:[14646,15743,14073,17378,12775,15213], uk:[14646,15743,14073,17378,12775,15213], irl:[0,0,0,0,352,480], usa:[0,0,0,0,0,0] },
      adSpend: { all:[2069,3241,2960,3250,2394,3201], uk:[2069,3241,2960,3250,2394,3201], irl:[0,0,0,0,0,0], usa:[0,0,0,0,0,0] },
      adTacos: { all:[14.1,20.6,21.0,18.7,18.7,21.0], uk:[14.1,20.6,21.0,18.7,18.7,21.0], irl:[0,0,0,0,0,0], usa:[0,0,0,0,0,0] }
    }
  }
};

/* ============================================================================================
   SHOPIFY (D2C) — sections.shopify  ·  brand-filtered: All / Newnique / Contours Rx (2 stores)
   --------------------------------------------------------------------------------------------
   Source: Shopify Admin API + ShopifyQL, pulled in-session 17 Jun 2026, native GBP.
   • Contours Rx UK (contours-rx.co.uk · 658f4a.myshopify.com): MONTH-level sales, sessions/CVR,
     product mix, returning-customer rate, traffic, and live stock-on-hand are EXACT MCP actuals.
   • Newnique: a STUB — the store needs a Shopify re-auth before it can be pulled; numbers populate
     at the next bake. 'all' currently equals Contours Rx (see the derivation at the bottom).
   ESTIMATES (clearly marked 'est' in the cards): per-unit ASP + unit counts for the 3-mo / YTD /
   12-mo periods (units estimated at ~1.05/order), the cart/checkout funnel steps for those longer
   periods (scaled from May's 6.2% cart / 4.5% checkout ratios), the returning-customer rate beyond
   May, and the per-product split for longer periods (Lids ≈ 97.8% of net). Re-bake to make exact.
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
      // 6-month net-sales trend (Dec 2025 → May 2026), exact MCP actuals.
      chart: {
        max: 4000, yTicks: ['£4k', '£3k', '£2k', '£1k', '£0'],
        xLabels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], xHighlight: '#404935',
        series: [ { values: [1863, 2127, 2907, 3243, 2621, 2416], color: '#404935', area: true, main: true } ],
        legend: [ { name: 'Net Sales', color: '#404935' } ]
      },
      // Current on-hand snapshot (Admin API, 17 Jun 2026). Cover = vs ~May run-rate.
      stock: [
        { name: 'Lids by Design Eyelid Lift Strips', note: '7 size variants · Healthy',        level: 'g', units: '2,123 units', cover: '~690 days' },
        { name: 'Exfoliating B5 Prep Pads 30pk',     note: 'SKU CR B5PREP · Healthy',          level: 'g', units: '72 units',    cover: 'ample cover' },
        { name: 'Botanical Lash & Brow Serum',       note: 'SKU CR BLBS · New launch (Oct)',   level: 'g', units: '47 units',    cover: 'ample cover' },
        { name: 'Dermal Blade (3 pack)',             note: 'SKU CR DERMA · Restock needed',    level: 'r', units: '0 units',     cover: 'OOS' }
      ],
      // Traffic by referrer (May actual). Bar widths floored so near-zero channels stay visible.
      // Traffic by GA4 default channel group (May 2026). Cross-network = Google Ads (Performance Max).
      traffic: [
        { lbl: 'Paid (Cross-network)', pct: 79, val: '2,065', color: 'brand' },
        { lbl: 'Organic Search',       pct: 9,  val: '229',   color: 'blue' },
        { lbl: 'Direct',               pct: 8,  val: '203',   color: 'amber' },
        { lbl: 'Email',                pct: 1,  val: '30',    color: 'green' }
      ],
      byPeriod: {
        may: {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£2,416',  dCls: 'dd', d: '▼ 7.8% MoM',   s: 'vs £2,621 Apr' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '90',      dCls: 'du', d: '▲ 1.1% MoM',   s: '89 orders Apr' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£27.17',  dCls: 'dd', d: '▼ £2.85 MoM',  s: '£30.02 Apr' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£25.43',  dCls: 'df', d: 'net ÷ units',  s: '95 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '1.76%',  dCls: 'df', d: 'GA4 · sessions', s: '46 of 2,618 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '2,618',  dCls: 'du', d: '▲ 16.7% MoM',  s: 'GA4 · vs 2,244 Apr' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '95',     dCls: 'df', d: 'Lids 92 · B5 3', s: '2 active SKUs' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '7.8%',   dCls: 'df', d: '7 of 90',      s: 'May actual' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '2,618', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '106',   pct: '4.0%', w: 4,   sub: '4.0% of sessions · GA4' },
            { lbl: 'Reached Checkout', val: '65',    pct: '2.5%', w: 2.5, sub: '61% of carts retained' },
            { lbl: 'Purchased',        val: '46',    pct: '1.8%', w: 1.8, sub: '71% of checkouts retained' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£2,362', units: '92', asp: '£25.67', orders: '90', share: '97.8%', shareCls: 'bg' },
            { name: 'Exfoliating B5 Prep Pads 30pk',     net: '£54',    units: '3',  asp: '£17.97', orders: '3',  share: '2.2%',  shareCls: 'bb' },
            { name: 'Botanical Lash & Brow Serum',       net: '£0',     units: '0',  asp: '—',      orders: '0',  share: '—',     shareCls: 'bb' },
            { name: 'Dermal Blade (3 pack)',             net: '£0',     units: '0',  asp: '—',      orders: '0',  share: 'OOS',   shareCls: 'br' }
          ]
        },
        '3m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£8,280', dCls: 'df', d: '3-mo actuals',  s: 'Mar–May 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '293',    dCls: 'df', d: '3-mo actuals',  s: 'AOV £28.54' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.54', dCls: 'df', d: '3-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£26.88', dCls: 'df', d: 'est · per unit', s: '~308 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.36%', dCls: 'df', d: 'GA4 · 3-mo',   s: '169 of 7,146 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '7,146', dCls: 'df', d: 'GA4 · Mar–May', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '~308',  dCls: 'df', d: 'est',          s: 'Lids-dominant' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '~10%',  dCls: 'df', d: 'est',          s: '3-mo window' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '7,146', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '334',   pct: '4.7%', w: 4.7, sub: 'GA4 · 4.7% of sessions' },
            { lbl: 'Reached Checkout', val: '166',   pct: '2.3%', w: 2.3, sub: 'GA4 begin_checkout' },
            { lbl: 'Purchased',        val: '169',   pct: '2.4%', w: 2.4, sub: '2.36% conversion' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£8,096', units: '~301', asp: '~£27', orders: '286', share: '97.8%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum)',           net: '£184',   units: '~11',  asp: '—',    orders: '7',   share: '2.2%',  shareCls: 'bb' }
          ]
        },
        '6m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£13,314', dCls: 'df', d: 'YTD actuals',   s: 'Jan–May 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '475',     dCls: 'df', d: 'YTD actuals',   s: 'AOV £28.26' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.26',  dCls: 'df', d: 'YTD blended',   s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£26.68',  dCls: 'df', d: 'est · per unit', s: '~499 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.46%',  dCls: 'df', d: 'GA4 · YTD',    s: '296 of 12,012 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '12,012', dCls: 'df', d: 'GA4 · Jan–May', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '~499',  dCls: 'df', d: 'est',         s: 'Lids-dominant' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '~12%',  dCls: 'df', d: 'est',         s: 'YTD window' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '12,012', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '522',    pct: '4.3%', w: 4.3, sub: 'GA4 · 4.3% of sessions' },
            { lbl: 'Reached Checkout', val: '284',    pct: '2.4%', w: 2.4, sub: 'GA4 begin_checkout' },
            { lbl: 'Purchased',        val: '296',    pct: '2.5%', w: 2.5, sub: '2.46% conversion' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£13,021', units: '~492', asp: '~£26.5', orders: '465', share: '97.8%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum)',           net: '£293',    units: '~17',  asp: '—',      orders: '10',  share: '2.2%',  shareCls: 'bb' }
          ]
        },
        '12m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£19,786', dCls: 'df', d: '12-mo actuals',  s: 'Jun 25–May 26' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '689',     dCls: 'df', d: '12-mo actuals',  s: 'AOV £28.88' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.88',  dCls: 'df', d: '12-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£27.36',  dCls: 'df', d: 'est · per unit', s: '~723 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.00%',  dCls: 'df', d: 'GA4 · 12-mo',     s: '436 of 21,773 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '21,773', dCls: 'df', d: 'GA4 · trailing yr', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '~723',   dCls: 'df', d: 'est',           s: 'Lids-dominant' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '~15%',   dCls: 'df', d: 'est',           s: '12-mo window' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '21,773', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '853',    pct: '3.9%', w: 3.9, sub: 'GA4 · 3.9% of sessions' },
            { lbl: 'Reached Checkout', val: '514',    pct: '2.4%', w: 2.4, sub: 'GA4 begin_checkout' },
            { lbl: 'Purchased',        val: '436',    pct: '2.0%', w: 2.0, sub: '2.00% conversion' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£19,350', units: '~707', asp: '~£27', orders: '674', share: '97.8%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum · Dermal)',  net: '£436',    units: '~16',  asp: '—',    orders: '15',  share: '2.2%',  shareCls: 'bb' }
          ]
        }
      }
    },
    // Newnique — LIVE from Porter (Shopify connector), pulled 17 Jun 2026. A young hair-care D2C store;
    // sales are sparse before May. No GA4 connected for Newnique → no sessions/CVR/funnel. Stock sync
    // was still ingesting at bake time (populates next bake). Order-side periods are exact Porter
    // actuals (Jun 2025–May 2026). NOTE: net here is Shopify-actual (£251 May) — the P&L uses the
    // Account Tracker's £223 for May (its own view), so the two pages differ slightly by design.
    newnique: {
      label: 'Newnique', store: 'newniquecare.com',
      chart: {
        max: 300, yTicks: ['£300', '£225', '£150', '£75', '£0'],
        xLabels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], xHighlight: '#404935',
        series: [ { values: [17, 0, 85, 0, 0, 251], color: '#404935', area: true, main: true } ],
        legend: [ { name: 'Net Sales', color: '#404935' } ]
      },
      stock: [], traffic: [],
      placeholder: 'Inventory sync still ingesting in Porter — stock + traffic populate at the next bake.',
      byPeriod: {
        may: {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£251',    dCls: 'du', d: '▲ vs £85 Feb',  s: '6 orders' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '6',       dCls: 'df', d: 'May actual',    s: 'AOV £41.89' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£41.89',  dCls: 'df', d: 'May blended',   s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£7.18',   dCls: 'df', d: 'net ÷ units',   s: '35 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '—',     dCls: 'df', d: 'No GA4 for Newnique', s: 'add GA4 to enable' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '—',     dCls: 'df', d: 'No GA4 for Newnique', s: '' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '35',    dCls: 'df', d: 'hair-care range',     s: '3 active SKUs' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '16.7%', dCls: 'df', d: '1 of 6',             s: 'May actual' }
          ],
          funnel: null,
          products: [
            { name: 'GrowPod™ 5-in-1 Hair Care System', net: '£178', units: '3',  asp: '£59.33', orders: '—', share: '70.8%', shareCls: 'bg' },
            { name: 'Advanced Hair Growth Serum',        net: '£42',  units: '3',  asp: '£14.02', orders: '2', share: '16.7%', shareCls: 'bb' },
            { name: 'Advanced+ Hair Growth Serum',       net: '£31',  units: '24', asp: '£1.30',  orders: '2', share: '12.4%', shareCls: 'bb' }
          ]
        },
        '3m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£251',   dCls: 'df', d: '3-mo actuals', s: 'Mar–May 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '6',      dCls: 'df', d: '3-mo actuals', s: 'all in May' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£41.89', dCls: 'df', d: '3-mo blended', s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£7.18',  dCls: 'df', d: 'net ÷ units',  s: '35 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '—',  dCls: 'df', d: 'No GA4 for Newnique', s: '' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '—',  dCls: 'df', d: 'No GA4 for Newnique', s: '' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '35', dCls: 'df', d: 'hair-care range',     s: 'Mar–May' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '16.7%', dCls: 'df', d: '1 of 6',          s: '3-mo' }
          ],
          funnel: null,
          products: [
            { name: 'GrowPod™ 5-in-1 Hair Care System', net: '£178', units: '3',  asp: '£59.33', orders: '—', share: '70.8%', shareCls: 'bg' },
            { name: 'Advanced Hair Growth Serum',        net: '£42',  units: '3',  asp: '£14.02', orders: '2', share: '16.7%', shareCls: 'bb' },
            { name: 'Advanced+ Hair Growth Serum',       net: '£31',  units: '24', asp: '£1.30',  orders: '2', share: '12.4%', shareCls: 'bb' }
          ]
        },
        '6m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£336',   dCls: 'df', d: 'YTD actuals',  s: 'Jan–May 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '7',      dCls: 'df', d: 'YTD actuals',  s: 'Feb + May' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£48.04', dCls: 'df', d: 'YTD blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£8.41',  dCls: 'df', d: 'net ÷ units',  s: '40 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '—',  dCls: 'df', d: 'No GA4 for Newnique', s: '' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '—',  dCls: 'df', d: 'No GA4 for Newnique', s: '' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '40', dCls: 'df', d: 'hair-care range',     s: 'Jan–May' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '~14%', dCls: 'df', d: 'est',              s: 'YTD window' }
          ],
          funnel: null,
          products: [
            { name: 'Hair-care range (GrowPod · Serums · Scalp)', net: '£336', units: '40', asp: '£8.41', orders: '7', share: '100%', shareCls: 'bg' }
          ]
        },
        '12m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£385',   dCls: 'df', d: '12-mo actuals', s: 'Jun 25–May 26' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '12',     dCls: 'df', d: '12-mo actuals', s: '' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£32.12', dCls: 'df', d: '12-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£7.87',  dCls: 'df', d: 'net ÷ units',    s: '49 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '—',  dCls: 'df', d: 'No GA4 for Newnique', s: '' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '—',  dCls: 'df', d: 'No GA4 for Newnique', s: '' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '49', dCls: 'df', d: 'hair-care range',     s: 'trailing year' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '~12%', dCls: 'df', d: 'est',              s: '12-mo window' }
          ],
          funnel: null,
          products: [
            { name: 'Hair-care range (GrowPod · Serums · Scalp)', net: '£385', units: '49', asp: '£7.87', orders: '12', share: '100%', shareCls: 'bg' }
          ]
        }
      }
    }
  }
};

/* 'All' = Contours Rx + Newnique, a TRUE SUM. Headline cards (Net Sales, Orders, AOV, ASP) and Units
   sum both stores; Conversion/Sessions + the funnel are Contours Rx (GA4) since Newnique has no GA4;
   products merge both ranges; stock/traffic/chart come from Contours Rx (Newnique adds < 2%). The
   per-period sums are listed below — update them whenever either store's period figures change. */
window.DASHBOARD_DATA.sections.shopify.data.all = (function () {
  var SH = window.DASHBOARD_DATA.sections.shopify, crx = SH.data.contoursrx, nkv = SH.data.newnique;
  function gbp(n) { return '£' + Math.round(n).toLocaleString('en-GB'); }
  // Combined net / orders / units (Contours Rx + Newnique) + combined returning-customer rate.
  var S = {
    may:  { net: 2667,  orders: 96,  units: 130, ret: '8.3%', retSub: '8 of 96' },
    '3m': { net: 8531,  orders: 299, units: 343, ret: '~9%',  retSub: '3-mo' },
    '6m': { net: 13650, orders: 482, units: 539, ret: '~12%', retSub: 'YTD' },
    '12m':{ net: 20171, orders: 701, units: 772, ret: '~14%', retSub: '12-mo' }
  };
  var all = { label: 'All Brands', store: 'Contours Rx + Newnique (combined)', chart: crx.chart, stock: crx.stock, traffic: crx.traffic, byPeriod: {} };
  Object.keys(crx.byPeriod).forEach(function (k) {
    var c = crx.byPeriod[k], s = S[k] || {};
    var k1 = c.kpis1.slice(), k2 = c.kpis2.slice();   // start from Contours Rx, override the summed cards
    if (s.net != null) {
      k1 = [
        { bar: '#404935',      lbl: 'Net Sales', val: gbp(s.net),            dCls: 'df', d: 'CRX + Newnique', s: s.orders + ' orders' },
        { bar: 'var(--blue)',  lbl: 'Orders',    val: String(s.orders),      dCls: 'df', d: 'combined',      s: 'AOV ' + gbp(s.net / s.orders) },
        { bar: 'var(--green)', lbl: 'AOV',       val: gbp(s.net / s.orders), dCls: 'df', d: 'blended',       s: '' },
        { bar: 'var(--amber)', lbl: 'ASP',       val: gbp(s.net / s.units),  dCls: 'df', d: 'net ÷ units',   s: s.units + ' units' }
      ];
      k2 = [
        c.kpis2[0], c.kpis2[1],   // Conversion Rate + Sessions = Contours Rx (GA4)
        { bar: 'var(--green)', lbl: 'Units Sold',      val: String(s.units), dCls: 'df', d: 'combined', s: 'both stores' },
        { bar: 'var(--amber)', lbl: 'Returning Cust.', val: s.ret,           dCls: 'df', d: s.retSub,  s: 'combined' }
      ];
    }
    var prods = (c.products || []).concat((nkv.byPeriod[k] && nkv.byPeriod[k].products) || []);
    all.byPeriod[k] = { kpis1: k1, kpis2: k2, funnel: c.funnel, products: prods };
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
