/* Demo Brand UK — client data. Loaded as window.DASHBOARD_DATA.
   Static, self-contained GBP demo figures. UK only; "markets" are sales channels
   (Amazon UK / eBay UK / D2C). Numbers are illustrative and internally reconcile. */
window.DASHBOARD_DATA = {
  dateRanges:{
  may: {
    label: 'May 2026', shortLabel: 'May 2026',
    rev: '£29,400', revD: '▲ 18.1% MoM', revC: 'du', revS: 'vs £24,900 Apr',
    adSales: '£11,600', adSalesD: '▲ 16.0% MoM', adSalesC: 'du', adSalesS: '39.5% of revenue',
    tacos: '20.4%', tacosD: '▼ 0.5pp vs Apr', tacosC: 'du', tacosS: 'Target: hold <22%',
    roas: '4.90×', roasD: '▲ 0.1 vs Apr', roasC: 'du', roasS: '717 orders · AOV £41',
    spend: '£6,000', spendD: '▲ 15.4% MoM', spendC: 'du', spendS: 'vs £5,200 Apr',
    tacosAd: '20.4%', tacosAdD: '▼ 0.5pp vs Apr', tacosAdC: 'du', tacosAdS: 'Target <22%',
    roasAd: '4.90×', roasAdD: '▲ 0.1 vs Apr', roasAdC: 'du', roasAdS: '£29,400 revenue',
    aov: '£41', aovD: '▲ £1 MoM', aovC: 'du', aovS: '717 orders May',
    mktRows: [
      ['Amazon UK','gb','£3,800','£3,680','bg','▼ £120 under','£18,400','ba','20.0%'],
      ['eBay UK','gb','£800','£760','bg','▼ £40 under','£4,200','bg','18.1%'],
      ['D2C','gb','£1,800','£1,560','bg','▼ £240 under','£6,800','ba','22.9%'],
      ['Total UK',null,'£6,400','£6,000','bg','94% utilised','£29,400','ba','20.4%'],
    ],
    revBreakChart: { max: 32000, yTicks: ['£32k','£24k','£16k','£8k','£0'], xLabels: ['May'],
      series: [ { color:'#404935', values:[11600] }, { color:'#a7ab90', values:[17800] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:32000, yTicks:['£32k','£24k','£16k','£8k','£0'], xLabels:['Dec','Jan','Feb','Mar','Apr','May'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[19500,19800,21500,22300,24900,29400],main:true,area:true}, {color:'#e8a87c',values:[19500,22000,23000,24000,26000,28000],dash:true}, {color:'#a7ab90',values:[4000,4100,4400,4600,5200,6000],dash:true} ],
      legend:[ {name:'Revenue Actual',color:'#404935'}, {name:'Revenue Target',color:'#e8a87c'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:32000, yTicks:['£32k','£24k','£16k','£8k','£0'], xLabels:['Dec','Jan','Feb','Mar','Apr','May'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[19500,19800,21500,22300,24900,29400],main:true,area:true}, {color:'#a7ab90',values:[4000,4100,4400,4600,5200,6000],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:78.8,sales:'£21.6k',acos:'19.2%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.1,sales:'£3.6k',acos:'20.6%'}, {name:'Sponsored Display',color:'#a7ab90',pct:8.0,sales:'£2.2k',acos:'23.6%'} ] },
  },
  '3m': {
    label: 'Mar–May 2026', shortLabel: 'Mar–May 2026',
    rev: '£76,600', revD: '3-month actuals', revC: 'du', revS: 'Mar £22,300 · Apr £24,900 · May £29,400',
    adSales: '£30,200', adSalesD: '3-month total', adSalesC: 'df', adSalesS: '39.4% of revenue',
    tacos: '20.6%', tacosD: '3-month blended', tacosC: 'df', tacosS: 'Mar 20.6% · Apr 20.9% · May 20.4%',
    roas: '4.85×', roasD: '3-month avg', roasC: 'df', roasS: '1,824 orders · AOV £42',
    spend: '£15,800', spendD: '3-month total', spendC: 'df', spendS: 'Mar £4,600 · Apr £5,200 · May £6,000',
    tacosAd: '20.6%', tacosAdD: '3-month blended', tacosAdC: 'df', tacosAdS: 'Stable vs target',
    roasAd: '4.85×', roasAdD: '3-month avg', roasAdC: 'df', roasAdS: '£76,600 revenue',
    aov: '£42', aovD: '3-month avg', aovC: 'df', aovS: '1,824 orders total',
    mktRows: [
      ['Amazon UK','gb','£10,200','£9,900','bg','▼ £300 under','£48,300','ba','20.5%'],
      ['eBay UK','gb','£2,200','£2,100','bg','▼ £100 under','£10,700','bg','19.6%'],
      ['D2C','gb','£4,100','£3,800','bg','▼ £300 under','£17,600','ba','21.6%'],
      ['Total UK',null,'£16,500','£15,800','bg','96% utilised','£76,600','ba','20.6%'],
    ],
    revBreakChart: { max: 32000, yTicks: ['£32k','£24k','£16k','£8k','£0'], xLabels: ['Mar','Apr','May'],
      series: [ { color:'#404935', values:[8700,9700,11600] }, { color:'#a7ab90', values:[13600,15200,17800] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:32000, yTicks:['£32k','£24k','£16k','£8k','£0'], xLabels:['Mar','Apr','May'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[22300,24900,29400],main:true,area:true}, {color:'#e8a87c',values:[24000,26000,28000],dash:true}, {color:'#a7ab90',values:[4600,5200,6000],dash:true} ],
      legend:[ {name:'Revenue Actual',color:'#404935'}, {name:'Revenue Target',color:'#e8a87c'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:32000, yTicks:['£32k','£24k','£16k','£8k','£0'], xLabels:['Mar','Apr','May'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[22300,24900,29400],main:true,area:true}, {color:'#a7ab90',values:[4600,5200,6000],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:78.0,sales:'£55.4k',acos:'19.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.5,sales:'£9.6k',acos:'20.4%'}, {name:'Sponsored Display',color:'#a7ab90',pct:8.5,sales:'£6.0k',acos:'23.2%'} ] },
    sec: {
      overview: {
        buyBox: [ {label:'Sport Hydration Mix',pct:97,color:'green'}, {label:'Energy Gel 25pk',pct:96,color:'green'}, {label:'Recovery Powder',pct:95,color:'green'}, {label:'Isotonic Mix 1kg',pct:90,color:'amber'} ],
        cvr: { val:'10.8%', note:'3-mo avg · 128,400 sessions', sub:'All UK — Mar–May' }
      },
      pnl: {
        summary: [ {val:'£76,600',lbl:'Gross Revenue',color:'brand'}, {val:'£50,270*',lbl:'Total Costs',color:'red'}, {val:'£26,330*',lbl:'Net Profit',color:'green'} ],
        portfolio: { total:23, profitable:22, breakeven:0, unprofitable:1,
          most:[ {name:'Sport Hydration Mix',profit:'£8,400',margin:'42%',marginCls:'bg'}, {name:'Energy Gel 25pk',profit:'£6,400',margin:'38%',marginCls:'bg'}, {name:'Recovery Powder',profit:'£5,200',margin:'36%',marginCls:'bg'} ],
          least:[ {name:'Isotonic Mix 1kg',profit:'−£140',margin:'−2%',marginCls:'br',color:'var(--red)'}, {name:'Electrolyte Tabs 20pk',profit:'£310',margin:'3%',marginCls:'ba',color:'var(--amber)'}, {name:'Hydration Tabs 40s',profit:'£630',margin:'6%',marginCls:'ba',color:'var(--amber)'} ] },
        margin: { pct:'34.4%*', pctColor:'green', note:'*Estimated · COGS from cost sheet', rows:[ {lbl:'Gross Revenue',val:'£76,600'}, {lbl:'Marketplace Fees',val:'−£9,958*',color:'red'}, {lbl:'Ad Spend',val:'−£15,800',color:'red'}, {lbl:'COGS (est.)',val:'−£24,512*',color:'red'}, {lbl:'Net Profit',val:'£26,330*',color:'green',strong:true} ] },
        mkt: [ {name:'Amazon UK',flag:'gb',revenue:'£48,300',adspend:'£9,900',net:'£15,939*',netColor:'green',margin:'33.0%*',marginCls:'bg'}, {name:'eBay UK',flag:'gb',revenue:'£10,700',adspend:'£2,100',net:'£4,055*',netColor:'green',margin:'37.9%*',marginCls:'bg'}, {name:'D2C',flag:'gb',revenue:'£17,600',adspend:'£3,800',net:'£6,336*',netColor:'green',margin:'36.0%*',marginCls:'bg'} ],
        statement: { groups:[
          { header:'Income', rows:[ {lbl:'Shipped product sales',amount:'£49,100',pct:'101.7%',unit:'£41.09'}, {lbl:'Sales tax',amount:'',pct:'',unit:''}, {lbl:'Refunds',amount:'',pct:'',unit:''}, {lbl:'Reimbursements',amount:'',pct:'',unit:''}, {lbl:'Promotions',amount:'−£1,590',pct:'−3.3%',unit:'−£1.33'}, {lbl:'Other income',amount:'£790',pct:'1.6%',unit:'£0.66'}, {lbl:'Net revenue',amount:'£48,300',pct:'100.0%',unit:'£40.42',total:true} ] },
          { header:'Expenses', rows:[ {lbl:'Advertising',amount:'£9,900',pct:'20.5%',unit:'£8.28'}, {lbl:'Selling fees',amount:'£7,245',pct:'15.0%',unit:'£6.06'}, {lbl:'Fulfilment and shipping',amount:'',pct:'',unit:''}, {lbl:'Cancellations and refunds',amount:'',pct:'',unit:''}, {lbl:'Cost of goods',amount:'£15,456',pct:'32.0%',unit:'£12.93'}, {lbl:'Other expenses',amount:'',pct:'',unit:''}, {lbl:'Total expenses',amount:'£32,601',pct:'67.5%',unit:'£27.28',total:true} ] },
          { header:'Profit', rows:[ {lbl:'PROFIT',amount:'£15,699',pct:'32.5%',unit:'£13.14',total:true,profit:true}, {lbl:'Profit %',amount:'32.5%',pct:'',unit:'',accent:'green'} ] },
          { header:'Metrics', rows:[ {lbl:'Estimated payout',amount:'£31,155',pct:'',unit:'£26.07'}, {lbl:'TACOS %',amount:'20.5%',pct:'',unit:''} ] }
        ] }
      },
      products: {
        kpis: [ {bar:'#404935',lbl:'Top ASIN Rev.',val:'£21,400',dCls:'du',d:'Amazon UK',s:'27.9% of total'}, {bar:'green',lbl:'Orders',val:'1,824',dCls:'df',d:'3-month total',s:'~608/mo'}, {bar:'blue',lbl:'Avg. AoV',val:'£42',dCls:'df',d:'3-month avg',s:'stable'}, {bar:'amber',lbl:'ASP',val:'£28.60',dCls:'df',d:'3-month avg',s:'blended'} ],
        table: [ {name:'Amazon UK',flag:'gb',revenue:'£48,300',units:'1,195',orders:'1,130',cvr:'12.4%',cvrCls:'bg',aov:'£41.3'}, {name:'eBay UK',flag:'gb',revenue:'£10,700',units:'270',orders:'255',cvr:'9.3%',cvrCls:'ba',aov:'£41.2'}, {name:'D2C',flag:'gb',revenue:'£17,600',units:'465',orders:'439',cvr:'3.0%',cvrCls:'ba',aov:'£40.9'} ]
      },
      keywords: {
        kpis: [ {bar:'#404935',lbl:'Active KWs',val:'192',dCls:'du',d:'▲ 20 vs prior',s:'Across all campaigns'}, {bar:'green',lbl:'Avg. CPC',val:'£0.33',dCls:'du',d:'3-month avg',s:'Blended UK'}, {bar:'red',lbl:'High ACOS KWs',val:'9',dCls:'dd',d:'ACOS >30%',s:'Review & pause'}, {bar:'blue',lbl:'Top KW Rev.',val:'£14.8k',dCls:'du',d:'isotonic drink',s:'Amazon UK'} ],
        table: [ {kw:'isotonic drink',geo:'Amazon UK · SP',match:'Exact',matchCls:'bg',spend:'£1,110',sales:'£14.8k',acos:'7.5%',acosCls:'bg',roas:'13.3×',cpc:'£0.28'}, {kw:'sports hydration powder',geo:'Amazon UK · SP',match:'Exact',matchCls:'bg',spend:'£1,020',sales:'£12.7k',acos:'8.0%',acosCls:'bg',roas:'12.5×',cpc:'£0.30'}, {kw:'energy gel marathon',geo:'Amazon UK · SP',match:'Phrase',matchCls:'bb',spend:'£775',sales:'£8.4k',acos:'9.2%',acosCls:'bg',roas:'10.8×',cpc:'£0.34'}, {kw:'electrolyte tablets',geo:'eBay UK · SP',match:'Exact',matchCls:'bg',spend:'£610',sales:'£5.8k',acos:'10.5%',acosCls:'bg',roas:'9.5×',cpc:'£0.26'}, {kw:'recovery protein drink',geo:'D2C · SP',match:'Phrase',matchCls:'bb',spend:'£510',sales:'£4.6k',acos:'11.0%',acosCls:'bg',roas:'9.1×',cpc:'£0.25'} ]
      },
      advertising: {
        metrics: [ {lbl:'Total Spend',val:'£15,800',id:'a-spend'}, {lbl:'Period Budget',val:'£16,500',color:'brand'}, {lbl:'Utilisation',val:'96%',color:'green'}, {lbl:'TACOS',val:'20.6%',color:'amber',id:'a-tacos'}, {lbl:'ROAS',val:'4.85×',id:'a-roas'}, {lbl:'Avg. CPC',val:'£0.33'} ],
        campaigns: [ {name:'SP — Sport Hydration UK',type:'Sponsored Products',spend:'£5.52k',sales:'£30.0k',acos:'18.4%',acosCls:'bg',roas:'5.4×',cpc:'£0.31',status:'Active',statusCls:'bg'}, {name:'SP — Energy Gel UK',type:'Sponsored Products',spend:'£3.10k',sales:'£16.0k',acos:'19.3%',acosCls:'bg',roas:'5.2×',cpc:'£0.34',status:'Active',statusCls:'bg'}, {name:'SB — Demo Brand UK',type:'Sponsored Brands',spend:'£1.95k',sales:'£9.5k',acos:'20.6%',acosCls:'ba',roas:'4.9×',cpc:'£0.45',status:'Active',statusCls:'bg'}, {name:'SP — Recovery Range UK',type:'Sponsored Products',spend:'£2.26k',sales:'£10.8k',acos:'21.0%',acosCls:'ba',roas:'4.8×',cpc:'£0.33',status:'Active',statusCls:'bg'}, {name:'SD — Display Retargeting',type:'Sponsored Display',spend:'£1.37k',sales:'£5.8k',acos:'23.6%',acosCls:'ba',roas:'4.2×',cpc:'£0.40',status:'Review',statusCls:'ba'} ]
      }
    },
  },
  '6m': {
    label: 'Jan–May 2026 (YTD)', shortLabel: 'Jan–May 2026',
    rev: '£117,900', revD: '5-month actuals', revC: 'du', revS: 'Jan £19,800 → May £29,400',
    adSales: '£46,400', adSalesD: '5-month total', adSalesC: 'df', adSalesS: '39.4% of revenue',
    tacos: '20.6%', tacosD: '5-month blended', tacosC: 'df', tacosS: 'Consistent ~20.6% YTD',
    roas: '4.85×', roasD: '5-month avg', roasC: 'df', roasS: '2,807 orders · AOV £42',
    spend: '£24,300', spendD: '5-month total', spendC: 'df', spendS: 'Budget £25,500 total',
    tacosAd: '20.6%', tacosAdD: '5-month blended', tacosAdC: 'df', tacosAdS: 'On target',
    roasAd: '4.85×', roasAdD: '5-month avg', roasAdC: 'df', roasAdS: '£117,900 revenue',
    aov: '£42', aovD: '5-month avg', aovC: 'df', aovS: '2,807 orders total',
    mktRows: [
      ['Amazon UK','gb','£15,800','£15,300','bg','▼ £500 under','£74,300','ba','20.6%'],
      ['eBay UK','gb','£3,400','£3,250','bg','▼ £150 under','£16,500','bg','19.7%'],
      ['D2C','gb','£6,300','£5,750','bg','▼ £550 under','£27,100','ba','21.2%'],
      ['Total UK',null,'£25,500','£24,300','bg','95% utilised','£117,900','ba','20.6%'],
    ],
    revBreakChart: { max: 32000, yTicks: ['£32k','£24k','£16k','£8k','£0'], xLabels: ['Jan','Feb','Mar','Apr','May'],
      series: [ { color:'#404935', values:[7700,8400,8700,9700,11600] }, { color:'#a7ab90', values:[12100,13100,13600,15200,17800] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:32000, yTicks:['£32k','£24k','£16k','£8k','£0'], xLabels:['Jan','Feb','Mar','Apr','May'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[19800,21500,22300,24900,29400],main:true,area:true}, {color:'#e8a87c',values:[22000,23000,24000,26000,28000],dash:true}, {color:'#a7ab90',values:[4100,4400,4600,5200,6000],dash:true} ],
      legend:[ {name:'Revenue Actual',color:'#404935'}, {name:'Revenue Target',color:'#e8a87c'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:32000, yTicks:['£32k','£24k','£16k','£8k','£0'], xLabels:['Jan','Feb','Mar','Apr','May'], xHighlight:'#404935',
      series:[ {color:'#404935',values:[19800,21500,22300,24900,29400],main:true,area:true}, {color:'#a7ab90',values:[4100,4400,4600,5200,6000],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:77.5,sales:'£85.8k',acos:'18.8%'}, {name:'Sponsored Brands',color:'#6b7160',pct:14.0,sales:'£15.5k',acos:'20.2%'}, {name:'Sponsored Display',color:'#a7ab90',pct:8.5,sales:'£9.4k',acos:'23.0%'} ] },
    sec: {
      overview: {
        buyBox: [ {label:'Sport Hydration Mix',pct:96,color:'green'}, {label:'Energy Gel 25pk',pct:95,color:'green'}, {label:'Recovery Powder',pct:94,color:'green'}, {label:'Isotonic Mix 1kg',pct:89,color:'amber'} ],
        cvr: { val:'10.4%', note:'5-mo avg · 214,600 sessions', sub:'All UK — YTD' }
      },
      pnl: {
        summary: [ {val:'£117,900',lbl:'Gross Revenue',color:'brand'}, {val:'£77,355*',lbl:'Total Costs',color:'red'}, {val:'£40,545*',lbl:'Net Profit',color:'green'} ],
        portfolio: { total:23, profitable:21, breakeven:1, unprofitable:1,
          most:[ {name:'Sport Hydration Mix',profit:'£12,900',margin:'42%',marginCls:'bg'}, {name:'Energy Gel 25pk',profit:'£9,800',margin:'38%',marginCls:'bg'}, {name:'Recovery Powder',profit:'£7,900',margin:'36%',marginCls:'bg'} ],
          least:[ {name:'Isotonic Mix 1kg',profit:'−£90',margin:'−1%',marginCls:'br',color:'var(--red)'}, {name:'Electrolyte Tabs 20pk',profit:'£480',margin:'3%',marginCls:'ba',color:'var(--amber)'}, {name:'Hydration Tabs 40s',profit:'£960',margin:'6%',marginCls:'ba',color:'var(--amber)'} ] },
        margin: { pct:'34.4%*', pctColor:'green', note:'*Estimated · COGS from cost sheet', rows:[ {lbl:'Gross Revenue',val:'£117,900'}, {lbl:'Marketplace Fees',val:'−£15,327*',color:'red'}, {lbl:'Ad Spend',val:'−£24,300',color:'red'}, {lbl:'COGS (est.)',val:'−£37,728*',color:'red'}, {lbl:'Net Profit',val:'£40,545*',color:'green',strong:true} ] },
        mkt: [ {name:'Amazon UK',flag:'gb',revenue:'£74,300',adspend:'£15,300',net:'£24,519*',netColor:'green',margin:'33.0%*',marginCls:'bg'}, {name:'eBay UK',flag:'gb',revenue:'£16,500',adspend:'£3,250',net:'£6,254*',netColor:'green',margin:'37.9%*',marginCls:'bg'}, {name:'D2C',flag:'gb',revenue:'£27,100',adspend:'£5,750',net:'£9,772*',netColor:'green',margin:'36.1%*',marginCls:'bg'} ],
        statement: { groups:[
          { header:'Income', rows:[ {lbl:'Shipped product sales',amount:'£75,600',pct:'101.7%',unit:'£41.09'}, {lbl:'Sales tax',amount:'',pct:'',unit:''}, {lbl:'Refunds',amount:'',pct:'',unit:''}, {lbl:'Reimbursements',amount:'',pct:'',unit:''}, {lbl:'Promotions',amount:'−£2,450',pct:'−3.3%',unit:'−£1.33'}, {lbl:'Other income',amount:'£1,150',pct:'1.6%',unit:'£0.63'}, {lbl:'Net revenue',amount:'£74,300',pct:'100.0%',unit:'£40.38',total:true} ] },
          { header:'Expenses', rows:[ {lbl:'Advertising',amount:'£15,300',pct:'20.6%',unit:'£8.32'}, {lbl:'Selling fees',amount:'£11,145',pct:'15.0%',unit:'£6.06'}, {lbl:'Fulfilment and shipping',amount:'',pct:'',unit:''}, {lbl:'Cancellations and refunds',amount:'',pct:'',unit:''}, {lbl:'Cost of goods',amount:'£23,776',pct:'32.0%',unit:'£12.92'}, {lbl:'Other expenses',amount:'',pct:'',unit:''}, {lbl:'Total expenses',amount:'£50,221',pct:'67.6%',unit:'£27.30',total:true} ] },
          { header:'Profit', rows:[ {lbl:'PROFIT',amount:'£24,079',pct:'32.4%',unit:'£13.09',total:true,profit:true}, {lbl:'Profit %',amount:'32.4%',pct:'',unit:'',accent:'green'} ] },
          { header:'Metrics', rows:[ {lbl:'Estimated payout',amount:'£47,855',pct:'',unit:'£26.01'}, {lbl:'TACOS %',amount:'20.6%',pct:'',unit:''} ] }
        ] }
      },
      products: {
        kpis: [ {bar:'#404935',lbl:'Top ASIN Rev.',val:'£32,900',dCls:'du',d:'Amazon UK',s:'27.9% of total'}, {bar:'green',lbl:'Orders',val:'2,807',dCls:'df',d:'5-month total',s:'~561/mo'}, {bar:'blue',lbl:'Avg. AoV',val:'£42',dCls:'df',d:'5-month avg',s:'stable'}, {bar:'amber',lbl:'ASP',val:'£28.50',dCls:'df',d:'5-month avg',s:'blended'} ],
        table: [ {name:'Amazon UK',flag:'gb',revenue:'£74,300',units:'1,840',orders:'1,740',cvr:'12.5%',cvrCls:'bg',aov:'£41.4'}, {name:'eBay UK',flag:'gb',revenue:'£16,500',units:'415',orders:'392',cvr:'9.4%',cvrCls:'ba',aov:'£41.3'}, {name:'D2C',flag:'gb',revenue:'£27,100',units:'715',orders:'675',cvr:'3.0%',cvrCls:'ba',aov:'£40.9'} ]
      },
      keywords: {
        kpis: [ {bar:'#404935',lbl:'Active KWs',val:'198',dCls:'du',d:'▲ 26 YTD',s:'Across all campaigns'}, {bar:'green',lbl:'Avg. CPC',val:'£0.33',dCls:'du',d:'5-month avg',s:'Blended UK'}, {bar:'red',lbl:'High ACOS KWs',val:'10',dCls:'dd',d:'ACOS >30%',s:'Review & pause'}, {bar:'blue',lbl:'Top KW Rev.',val:'£22.7k',dCls:'du',d:'isotonic drink',s:'Amazon UK'} ],
        table: [ {kw:'isotonic drink',geo:'Amazon UK · SP',match:'Exact',matchCls:'bg',spend:'£1,690',sales:'£22.7k',acos:'7.5%',acosCls:'bg',roas:'13.3×',cpc:'£0.28'}, {kw:'sports hydration powder',geo:'Amazon UK · SP',match:'Exact',matchCls:'bg',spend:'£1,550',sales:'£19.4k',acos:'8.0%',acosCls:'bg',roas:'12.5×',cpc:'£0.30'}, {kw:'energy gel marathon',geo:'Amazon UK · SP',match:'Phrase',matchCls:'bb',spend:'£1,180',sales:'£12.8k',acos:'9.2%',acosCls:'bg',roas:'10.8×',cpc:'£0.34'}, {kw:'electrolyte tablets',geo:'eBay UK · SP',match:'Exact',matchCls:'bg',spend:'£925',sales:'£8.8k',acos:'10.5%',acosCls:'bg',roas:'9.5×',cpc:'£0.26'}, {kw:'recovery protein drink',geo:'D2C · SP',match:'Phrase',matchCls:'bb',spend:'£775',sales:'£7.0k',acos:'11.0%',acosCls:'bg',roas:'9.1×',cpc:'£0.25'} ]
      },
      advertising: {
        metrics: [ {lbl:'Total Spend',val:'£24,300',id:'a-spend'}, {lbl:'Period Budget',val:'£25,500',color:'brand'}, {lbl:'Utilisation',val:'95%',color:'green'}, {lbl:'TACOS',val:'20.6%',color:'amber',id:'a-tacos'}, {lbl:'ROAS',val:'4.85×',id:'a-roas'}, {lbl:'Avg. CPC',val:'£0.33'} ],
        campaigns: [ {name:'SP — Sport Hydration UK',type:'Sponsored Products',spend:'£8.50k',sales:'£46.2k',acos:'18.4%',acosCls:'bg',roas:'5.4×',cpc:'£0.31',status:'Active',statusCls:'bg'}, {name:'SP — Energy Gel UK',type:'Sponsored Products',spend:'£4.78k',sales:'£24.7k',acos:'19.3%',acosCls:'bg',roas:'5.2×',cpc:'£0.34',status:'Active',statusCls:'bg'}, {name:'SB — Demo Brand UK',type:'Sponsored Brands',spend:'£3.00k',sales:'£14.6k',acos:'20.6%',acosCls:'ba',roas:'4.9×',cpc:'£0.45',status:'Active',statusCls:'bg'}, {name:'SP — Recovery Range UK',type:'Sponsored Products',spend:'£3.48k',sales:'£16.6k',acos:'21.0%',acosCls:'ba',roas:'4.8×',cpc:'£0.33',status:'Active',statusCls:'bg'}, {name:'SD — Display Retargeting',type:'Sponsored Display',spend:'£2.11k',sales:'£8.9k',acos:'23.6%',acosCls:'ba',roas:'4.2×',cpc:'£0.40',status:'Review',statusCls:'ba'} ]
      }
    },
  },
  '2025': {
    label: 'Full Year 2025', shortLabel: '2025',
    rev: '£198,000', revD: 'Full year actuals', revC: 'du', revS: 'Jan–Dec 2025 confirmed',
    adSales: '£78,000', adSalesD: 'Full year', adSalesC: 'df', adSalesS: '39.4% of revenue',
    tacos: '21.0%', tacosD: 'FY2025 blended', tacosC: 'df', tacosS: 'Peak Nov 24.8% · Low Feb 17.9%',
    roas: '4.77×', roasD: 'FY2025 avg', roasC: 'df', roasS: '4,605 orders · AOV £43',
    spend: '£41,500', spendD: 'Full year actuals', spendC: 'df', spendS: 'Budget £43,400',
    tacosAd: '21.0%', tacosAdD: 'FY2025 blended', tacosAdC: 'df', tacosAdS: 'Peak Nov 24.8%',
    roasAd: '4.77×', roasAdD: 'FY2025 avg', roasAdC: 'df', roasAdS: '£198,000 revenue',
    aov: '£43', aovD: 'FY2025 avg', aovC: 'df', aovS: '4,605 orders FY2025',
    mktRows: [
      ['Amazon UK','gb','£27,000','£26,100','bg','▼ £900 under','£124,700','ba','20.9%'],
      ['eBay UK','gb','£5,900','£5,600','bg','▼ £300 under','£27,700','ba','20.2%'],
      ['D2C','gb','£10,500','£9,800','bg','▼ £700 under','£45,600','ba','21.5%'],
      ['Total UK',null,'£43,400','£41,500','bg','96% utilised','£198,000','ba','21.0%'],
    ],
  },
  '12m': {
    label: 'Last 12 Months', shortLabel: 'Last 12 Months',
    rev: '£239,900', revD: 'Trailing 12 months', revC: 'du', revS: 'Jun 2025 → May 2026',
    adSales: '£89,300', adSalesD: '12-month total', adSalesC: 'df', adSalesS: '37.2% of revenue',
    tacos: '20.4%', tacosD: '12-month blended', tacosC: 'df', tacosS: 'Consistent ~20% TACOS',
    roas: '4.91×', roasD: '12-month avg', roasC: 'du', roasS: '5,712 orders · AOV £42',
    spend: '£48,900', spendD: '12-month total', spendC: 'df', spendS: 'Budget £51,500',
    tacosAd: '20.4%', tacosAdD: '12-month blended', tacosAdC: 'df', tacosAdS: 'On target',
    roasAd: '4.91×', roasAdD: '12-month avg', roasAdC: 'du', roasAdS: '£239,900 revenue',
    aov: '£42', aovD: '12-month avg', aovC: 'df', aovS: '5,712 orders total',
    mktRows: [
      ['Amazon UK','gb','£32,000','£30,800','bg','▼ £1,200 under','£151,100','ba','20.4%'],
      ['eBay UK','gb','£7,100','£6,850','bg','▼ £250 under','£33,600','ba','20.4%'],
      ['D2C','gb','£12,400','£11,250','bg','▼ £1,150 under','£55,200','ba','20.4%'],
      ['Total UK',null,'£51,500','£48,900','bg','95% utilised','£239,900','ba','20.4%'],
    ],
    revBreakChart: { max: 32000, yTicks: ['£32k','£24k','£16k','£8k','£0'],
      xLabels: ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'],
      series: [ { color:'#404935', values:[5200,5400,5600,5800,6400,7800,7000,7700,8400,8700,9700,11600] },
                { color:'#a7ab90', values:[9800,10100,10400,10700,11600,13700,12500,12100,13100,13600,15200,17800] } ],
      legend: [ { name:'Ad sales', color:'#404935' }, { name:'Organic', color:'#a7ab90' } ] },
    revChart: { max:32000, yTicks:['£32k','£24k','£16k','£8k','£0'], xHighlight:'#404935',
      xLabels:['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'],
      series:[ {color:'#404935',values:[15000,15500,16000,16500,18000,21500,19500,19800,21500,22300,24900,29400],main:true,area:true},
               {color:'#e8a87c',values:[15500,16000,16500,17000,18000,20000,19500,22000,23000,24000,26000,28000],dash:true},
               {color:'#a7ab90',values:[3050,3150,3250,3350,3700,4400,4000,4100,4400,4600,5200,6000],dash:true} ],
      legend:[ {name:'Revenue Actual',color:'#404935'}, {name:'Revenue Target',color:'#e8a87c'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    adChart: { max:32000, yTicks:['£32k','£24k','£16k','£8k','£0'], xHighlight:'#404935',
      xLabels:['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'],
      series:[ {color:'#404935',values:[15000,15500,16000,16500,18000,21500,19500,19800,21500,22300,24900,29400],main:true,area:true},
               {color:'#a7ab90',values:[3050,3150,3250,3350,3700,4400,4000,4100,4400,4600,5200,6000],dash:true} ],
      legend:[ {name:'Revenue',color:'#404935'}, {name:'Ad Spend',color:'#a7ab90'} ] },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:79.0,sales:'£176.0k',acos:'19.5%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.0,sales:'£29.0k',acos:'20.8%'}, {name:'Sponsored Display',color:'#a7ab90',pct:8.0,sales:'£18.0k',acos:'23.8%'} ] },
    sec: {
      overview: {
        buyBox: [ {label:'Sport Hydration Mix',pct:95,color:'green'}, {label:'Energy Gel 25pk',pct:94,color:'green'}, {label:'Recovery Powder',pct:93,color:'green'}, {label:'Isotonic Mix 1kg',pct:88,color:'amber'} ],
        cvr: { val:'10.1%', note:'12-mo avg · 472,300 sessions', sub:'All UK — 12 months' }
      },
      pnl: {
        summary: [ {val:'£239,900',lbl:'Gross Revenue',color:'brand'}, {val:'£156,855*',lbl:'Total Costs',color:'red'}, {val:'£83,045*',lbl:'Net Profit',color:'green'} ],
        portfolio: { total:23, profitable:21, breakeven:0, unprofitable:2,
          most:[ {name:'Sport Hydration Mix',profit:'£26,300',margin:'42%',marginCls:'bg'}, {name:'Energy Gel 25pk',profit:'£19,900',margin:'38%',marginCls:'bg'}, {name:'Recovery Powder',profit:'£16,100',margin:'36%',marginCls:'bg'} ],
          least:[ {name:'Isotonic Mix 1kg',profit:'−£640',margin:'−3%',marginCls:'br',color:'var(--red)'}, {name:'Electrolyte Tabs 20pk',profit:'£980',margin:'3%',marginCls:'ba',color:'var(--amber)'}, {name:'Hydration Tabs 40s',profit:'£1,960',margin:'6%',marginCls:'ba',color:'var(--amber)'} ] },
        margin: { pct:'34.6%*', pctColor:'green', note:'*Estimated · COGS from cost sheet', rows:[ {lbl:'Gross Revenue',val:'£239,900'}, {lbl:'Marketplace Fees',val:'−£31,187*',color:'red'}, {lbl:'Ad Spend',val:'−£48,900',color:'red'}, {lbl:'COGS (est.)',val:'−£76,768*',color:'red'}, {lbl:'Net Profit',val:'£83,045*',color:'green',strong:true} ] },
        mkt: [ {name:'Amazon UK',flag:'gb',revenue:'£151,100',adspend:'£30,800',net:'£49,863*',netColor:'green',margin:'33.0%*',marginCls:'bg'}, {name:'eBay UK',flag:'gb',revenue:'£33,600',adspend:'£6,850',net:'£12,734*',netColor:'green',margin:'37.9%*',marginCls:'bg'}, {name:'D2C',flag:'gb',revenue:'£55,200',adspend:'£11,250',net:'£20,448*',netColor:'green',margin:'37.0%*',marginCls:'bg'} ],
        statement: { groups:[
          { header:'Income', rows:[ {lbl:'Shipped product sales',amount:'£153,700',pct:'101.7%',unit:'£41.10'}, {lbl:'Sales tax',amount:'',pct:'',unit:''}, {lbl:'Refunds',amount:'',pct:'',unit:''}, {lbl:'Reimbursements',amount:'',pct:'',unit:''}, {lbl:'Promotions',amount:'−£4,990',pct:'−3.3%',unit:'−£1.33'}, {lbl:'Other income',amount:'£2,390',pct:'1.6%',unit:'£0.64'}, {lbl:'Net revenue',amount:'£151,100',pct:'100.0%',unit:'£40.40',total:true} ] },
          { header:'Expenses', rows:[ {lbl:'Advertising',amount:'£30,800',pct:'20.4%',unit:'£8.24'}, {lbl:'Selling fees',amount:'£22,665',pct:'15.0%',unit:'£6.06'}, {lbl:'Fulfilment and shipping',amount:'',pct:'',unit:''}, {lbl:'Cancellations and refunds',amount:'',pct:'',unit:''}, {lbl:'Cost of goods',amount:'£48,352',pct:'32.0%',unit:'£12.93'}, {lbl:'Other expenses',amount:'',pct:'',unit:''}, {lbl:'Total expenses',amount:'£101,817',pct:'67.4%',unit:'£27.22',total:true} ] },
          { header:'Profit', rows:[ {lbl:'PROFIT',amount:'£49,283',pct:'32.6%',unit:'£13.18',total:true,profit:true}, {lbl:'Profit %',amount:'32.6%',pct:'',unit:'',accent:'green'} ] },
          { header:'Metrics', rows:[ {lbl:'Estimated payout',amount:'£97,635',pct:'',unit:'£26.10'}, {lbl:'TACOS %',amount:'20.4%',pct:'',unit:''} ] }
        ] }
      },
      products: {
        kpis: [ {bar:'#404935',lbl:'Top ASIN Rev.',val:'£66,900',dCls:'du',d:'Amazon UK',s:'27.9% of total'}, {bar:'green',lbl:'Orders',val:'5,712',dCls:'df',d:'12-month total',s:'~476/mo'}, {bar:'blue',lbl:'Avg. AoV',val:'£42',dCls:'df',d:'12-month avg',s:'stable'}, {bar:'amber',lbl:'ASP',val:'£28.30',dCls:'df',d:'12-month avg',s:'blended'} ],
        table: [ {name:'Amazon UK',flag:'gb',revenue:'£151,100',units:'3,740',orders:'3,540',cvr:'12.5%',cvrCls:'bg',aov:'£41.5'}, {name:'eBay UK',flag:'gb',revenue:'£33,600',units:'845',orders:'800',cvr:'9.4%',cvrCls:'ba',aov:'£41.4'}, {name:'D2C',flag:'gb',revenue:'£55,200',units:'1,455',orders:'1,372',cvr:'3.0%',cvrCls:'ba',aov:'£40.9'} ]
      },
      keywords: {
        kpis: [ {bar:'#404935',lbl:'Active KWs',val:'205',dCls:'du',d:'▲ 33 YoY',s:'Across all campaigns'}, {bar:'green',lbl:'Avg. CPC',val:'£0.34',dCls:'df',d:'12-month avg',s:'Blended UK'}, {bar:'red',lbl:'High ACOS KWs',val:'12',dCls:'dd',d:'ACOS >30%',s:'Review & pause'}, {bar:'blue',lbl:'Top KW Rev.',val:'£44.1k',dCls:'du',d:'isotonic drink',s:'Amazon UK'} ],
        table: [ {kw:'isotonic drink',geo:'Amazon UK · SP',match:'Exact',matchCls:'bg',spend:'£3,300',sales:'£44.1k',acos:'7.5%',acosCls:'bg',roas:'13.3×',cpc:'£0.28'}, {kw:'sports hydration powder',geo:'Amazon UK · SP',match:'Exact',matchCls:'bg',spend:'£3,030',sales:'£37.8k',acos:'8.0%',acosCls:'bg',roas:'12.5×',cpc:'£0.30'}, {kw:'energy gel marathon',geo:'Amazon UK · SP',match:'Phrase',matchCls:'bb',spend:'£2,305',sales:'£24.9k',acos:'9.2%',acosCls:'bg',roas:'10.8×',cpc:'£0.34'}, {kw:'electrolyte tablets',geo:'eBay UK · SP',match:'Exact',matchCls:'bg',spend:'£1,805',sales:'£17.2k',acos:'10.5%',acosCls:'bg',roas:'9.5×',cpc:'£0.26'}, {kw:'recovery protein drink',geo:'D2C · SP',match:'Phrase',matchCls:'bb',spend:'£1,515',sales:'£13.8k',acos:'11.0%',acosCls:'bg',roas:'9.1×',cpc:'£0.25'} ]
      },
      advertising: {
        metrics: [ {lbl:'Total Spend',val:'£48,900',id:'a-spend'}, {lbl:'Period Budget',val:'£51,500',color:'brand'}, {lbl:'Utilisation',val:'95%',color:'green'}, {lbl:'TACOS',val:'20.4%',color:'amber',id:'a-tacos'}, {lbl:'ROAS',val:'4.91×',id:'a-roas'}, {lbl:'Avg. CPC',val:'£0.34'} ],
        campaigns: [ {name:'SP — Sport Hydration UK',type:'Sponsored Products',spend:'£17.1k',sales:'£92.9k',acos:'18.4%',acosCls:'bg',roas:'5.4×',cpc:'£0.31',status:'Active',statusCls:'bg'}, {name:'SP — Energy Gel UK',type:'Sponsored Products',spend:'£9.62k',sales:'£49.7k',acos:'19.3%',acosCls:'bg',roas:'5.2×',cpc:'£0.34',status:'Active',statusCls:'bg'}, {name:'SB — Demo Brand UK',type:'Sponsored Brands',spend:'£6.03k',sales:'£29.3k',acos:'20.6%',acosCls:'ba',roas:'4.9×',cpc:'£0.45',status:'Active',statusCls:'bg'}, {name:'SP — Recovery Range UK',type:'Sponsored Products',spend:'£7.01k',sales:'£33.4k',acos:'21.0%',acosCls:'ba',roas:'4.8×',cpc:'£0.33',status:'Active',statusCls:'bg'}, {name:'SD — Display Retargeting',type:'Sponsored Display',spend:'£4.24k',sales:'£17.9k',acos:'23.6%',acosCls:'ba',roas:'4.2×',cpc:'£0.40',status:'Review',statusCls:'ba'} ]
      }
    },
  },
},

  // ---- Phase 2: deep-page content (rendered once at boot; May 2026 snapshot) ----
  sections: {
    overview: {
      tasksSpec: {
        badge: 'June 2026',
        items: [
          { text: 'Scale Amazon UK Sponsored Brands', sub: 'Advertising · In Progress' },
          { text: 'D2C Shopify Store Refresh', sub: 'Web · Upcoming' },
          { text: 'eBay UK Listing Optimisation', sub: 'Listings · Upcoming' },
          { text: 'Q3 Range Expansion — 4 SKUs', sub: 'Catalogue · Upcoming', active: false },
          { text: 'Black Friday Prep — Amazon UK', sub: 'Planning · Upcoming', active: false }
        ]
      },
      flagsSpec: {
        badge: '3 active',
        items: [
          { level: 'red',   title: 'Isotonic Mix 1kg — OOS Amazon UK', sub: 'B0CXUK004 · Listing suppressed' },
          { level: 'amber', title: 'TACOS Above Target — D2C', sub: '22.9% blended · Target <22% · Review bid strategy' },
          { level: 'amber', title: 'eBay Dispatch Window', sub: '1.2d promised vs 0.8d actual · Tighten SLA' },
          { level: 'muted', title: 'Recovery Range — D2C Launch Pending', sub: 'Awaiting product photography' }
        ]
      },
      stockWarn: {
        badge: '1 OOS · 3 low',
        items: [
          { level: 'red',   title: 'Isotonic Mix 1kg — OOS Amazon UK', sub: 'B0CXUK004 · 0 units · suppressed' },
          { level: 'amber', title: 'Energy Gel — Low eBay UK', sub: '88 units · ~9 days cover' },
          { level: 'amber', title: 'Isotonic Mix 1kg — Low Amazon UK', sub: '150 units · ~11 days cover' },
          { level: 'amber', title: 'Sport Hydration — Low D2C', sub: '120 units · ~12 days cover' }
        ]
      },
      buyBox: [
        { label: 'Sport Hydration Mix', pct: 98, color: 'green' },
        { label: 'Energy Gel 25pk', pct: 96, color: 'green' },
        { label: 'Recovery Powder', pct: 95, color: 'green' },
        { label: 'Isotonic Mix 1kg', pct: 91, color: 'amber' }
      ],
      cvr: { val: '11.2%', note: '▲ 0.6pp vs Apr · 41,800 sessions', sub: 'All UK — May' },
      earlyLaunch: null   // UK-only: no early-launch market → section hidden
    },

    pnl: {
      summary: [
        { val: '£29,400',  lbl: 'Gross Revenue', color: 'brand' },
        { val: '£19,216*', lbl: 'Total Costs',   color: 'red' },
        { val: '£10,184*', lbl: 'Net Profit',    color: 'green' }
      ],
      portfolio: { total: 23, profitable: 22, breakeven: 0, unprofitable: 1,
        most: [
          { name: 'Sport Hydration Mix', profit: '£3,200', margin: '42%', marginCls: 'bg' },
          { name: 'Energy Gel 25pk', profit: '£2,450', margin: '38%', marginCls: 'bg' },
          { name: 'Recovery Powder', profit: '£1,980', margin: '36%', marginCls: 'bg' }
        ],
        least: [
          { name: 'Isotonic Mix 1kg', profit: '−£180', margin: '−4%', marginCls: 'br', color: 'var(--red)' },
          { name: 'Electrolyte Tabs 20pk', profit: '£120', margin: '3%', marginCls: 'ba', color: 'var(--amber)' },
          { name: 'Hydration Tabs 40s', profit: '£240', margin: '6%', marginCls: 'ba', color: 'var(--amber)' }
        ] },
      margin: {
        pct: '34.6%*', pctColor: 'green', note: '*Estimated · COGS from cost sheet',
        rows: [
          { lbl: 'Gross Revenue',    val: '£29,400' },
          { lbl: 'Marketplace Fees', val: '−£3,808*', color: 'red' },
          { lbl: 'Ad Spend',         val: '−£6,000',  color: 'red' },
          { lbl: 'COGS (est.)',      val: '−£9,408*', color: 'red' },
          { lbl: 'Net Profit',       val: '£10,184*', color: 'green', strong: true }
        ]
      },
      // Full P&L statement (replaces the Expenses-by-Category card for this client).
      // Reconciles to the summary/margin: Net revenue £29,400 − £19,216 costs = £10,184 profit.
      // Per-unit column = amount / 760 May orders. MCP will populate this live later.
      statement: {
        groups: [
          { header: 'Income', rows: [
            { lbl: 'Shipped product sales', amount: '£18,700', pct: '101.7%', unit: '£39.79' },
            { lbl: 'Sales tax', amount: '', pct: '', unit: '' },
            { lbl: 'Refunds', amount: '', pct: '', unit: '' },
            { lbl: 'Reimbursements', amount: '', pct: '', unit: '' },
            { lbl: 'Promotions', amount: '−£610', pct: '−3.3%', unit: '−£1.30' },
            { lbl: 'Other income', amount: '£310', pct: '1.6%', unit: '£0.66' },
            { lbl: 'Net revenue', amount: '£18,400', pct: '100.0%', unit: '£39.15', total: true }
          ] },
          { header: 'Expenses', rows: [
            { lbl: 'Advertising', amount: '£3,680', pct: '20.0%', unit: '£7.83' },
            { lbl: 'Selling fees', amount: '£2,760', pct: '15.0%', unit: '£5.87' },
            { lbl: 'Fulfilment and shipping', amount: '', pct: '', unit: '' },
            { lbl: 'Cancellations and refunds', amount: '', pct: '', unit: '' },
            { lbl: 'Cost of goods', amount: '£5,888', pct: '32.0%', unit: '£12.53' },
            { lbl: 'Other expenses', amount: '', pct: '', unit: '' },
            { lbl: 'Total expenses', amount: '£12,328', pct: '67.0%', unit: '£26.23', total: true }
          ] },
          { header: 'Profit', rows: [
            { lbl: 'PROFIT', amount: '£6,072', pct: '33.0%', unit: '£12.92', total: true, profit: true },
            { lbl: 'Profit %', amount: '33.0%', pct: '', unit: '', accent: 'green' }
          ] },
          { header: 'Metrics', rows: [
            { lbl: 'Estimated payout', amount: '£11,960', pct: '', unit: '£25.45' },
            { lbl: 'TACOS %', amount: '20.0%', pct: '', unit: '' }
          ] }
        ]
      },
      mkt: [
        { name: 'Amazon UK', flag: 'gb', revenue: '£18,400', adspend: '£3,680', net: '£6,072*', netColor: 'green', margin: '33.0%*', marginCls: 'bg' },
        { name: 'eBay UK',   flag: 'gb', revenue: '£4,200',  adspend: '£760',   net: '£1,592*', netColor: 'green', margin: '37.9%*', marginCls: 'bg' },
        { name: 'D2C',       flag: 'gb', revenue: '£6,800',  adspend: '£1,560', net: '£2,520*', netColor: 'green', margin: '37.1%*', marginCls: 'bg' }
      ]
    },

    advertising: {
      metrics: [
        { lbl: 'Total Spend',    val: '£6,000', id: 'a-spend' },
        { lbl: 'Monthly Budget', val: '£6,400', color: 'brand' },
        { lbl: 'Utilisation',    val: '94%',    color: 'green' },
        { lbl: 'TACOS',          val: '20.4%',  color: 'amber', id: 'a-tacos' },
        { lbl: 'ROAS',           val: '4.90×',  id: 'a-roas' },
        { lbl: 'Avg. CPC',       val: '£0.34' }
      ],
      budgets: {
        rows: [
          { name: 'Amazon UK', flag: 'gb', cells: ['£3,800', '£4,000', '£4,300', '£4,800'] },
          { name: 'eBay UK',   flag: 'gb', cells: ['£800', '£850', '£900', '£1,000'] },
          { name: 'D2C',       flag: 'gb', cells: ['£1,800', '£1,900', '£2,000', '£2,200'] },
          { name: 'Total UK',  total: true, cells: ['£6,400', '£6,750', '£7,200', '£8,000'] }
        ]
      },
      forecast: [
        { month: 'Jun', budget: '£6,750', pct: 80, opacity: 0.7, tacos: '20%', tacosColor: 'green', roas: '4.95×' },
        { month: 'Jul', budget: '£7,200', pct: 86, opacity: 0.7, tacos: '21%', tacosColor: 'amber', roas: '4.80×' },
        { month: 'Aug', budget: '£8,000', pct: 95, opacity: 0.7, tacos: '20%', tacosColor: 'green', roas: '5.00×', peak: true },
        { month: 'Sep', budget: '£6,900', pct: 82, opacity: 0.6, tacos: '19%', tacosColor: 'green', roas: '5.20×' },
        { month: 'Oct', budget: '£6,200', pct: 74, opacity: 0.5, tacos: '19%', tacosColor: 'green', roas: '5.25×' }
      ],
      campaigns: [
        { name: 'SP — Sport Hydration UK', type: 'Sponsored Products', spend: '£2.10k', sales: '£11.4k', acos: '18.4%', acosCls: 'bg', roas: '5.4×', cpc: '£0.31', status: 'Active', statusCls: 'bg' },
        { name: 'SP — Energy Gel UK',      type: 'Sponsored Products', spend: '£1.18k', sales: '£6.1k',  acos: '19.3%', acosCls: 'bg', roas: '5.2×', cpc: '£0.34', status: 'Active', statusCls: 'bg' },
        { name: 'SB — Demo Brand UK',      type: 'Sponsored Brands',   spend: '£0.74k', sales: '£3.6k',  acos: '20.6%', acosCls: 'ba', roas: '4.9×', cpc: '£0.45', status: 'Active', statusCls: 'bg' },
        { name: 'SP — Recovery Range UK',  type: 'Sponsored Products', spend: '£0.86k', sales: '£4.1k',  acos: '21.0%', acosCls: 'ba', roas: '4.8×', cpc: '£0.33', status: 'Active', statusCls: 'bg' },
        { name: 'SD — Display Retargeting',type: 'Sponsored Display',  spend: '£0.52k', sales: '£2.2k',  acos: '23.6%', acosCls: 'ba', roas: '4.2×', cpc: '£0.40', status: 'Review', statusCls: 'ba' }
      ]
    },

    inventory: {
      kpis: [
        { bar: 'green', lbl: 'In Stock',      val: '22',   dCls: 'du', d: 'ASINs healthy',      s: 'Across all channels' },
        { bar: 'amber', lbl: 'Low Stock',     val: '3',    dCls: 'df', dColor: 'amber', d: 'Reorder advised', s: '<14 days cover' },
        { bar: 'red',   lbl: 'OOS',           val: '1',    dCls: 'dd', d: 'Listing suppressed', s: 'Amazon UK — Isotonic' },
        { bar: 'blue',  lbl: 'Late Dispatch', val: '0.6%', dCls: 'du', d: '▼ 0.2pp MoM',        s: 'Target <4%' }
      ],
      stock: [
        { dot: 'dg', name: 'Sport Hydration Mix — Amazon UK', note: 'B0CXUK001 · Healthy', units: '980 units', days: '~32 days' },
        { dot: 'dg', name: 'Energy Gel 25pk — Amazon UK',     note: 'B0CXUK002 · Healthy', units: '740 units', days: '~30 days' },
        { dot: 'dg', name: 'Recovery Powder — D2C',           note: 'SKU-RP-01 · Healthy', units: '410 units', days: '~26 days' },
        { dot: 'dg', name: 'Hydration Tabs 40s — eBay UK',    note: 'B0CXUK003 · Healthy', units: '360 units', days: '~24 days' },
        { dot: 'da', name: 'Isotonic Mix 1kg — Amazon UK',    note: 'B0CXUK004 · Low — reorder', units: '150 units', unitsColor: 'amber', days: '~11 days' },
        { dot: 'da', name: 'Energy Gel — eBay UK',            note: 'B0CXUK005 · Low', units: '88 units', unitsColor: 'amber', days: '~9 days' },
        { dot: 'da', name: 'Sport Hydration — D2C',           note: 'SKU-SH-02 · Low', units: '120 units', unitsColor: 'amber', days: '~12 days' },
        { dot: 'dr', name: 'Isotonic Mix 1kg — Amazon UK',    note: 'B0CXUK004 · OOS · suppressed', units: '0 units', unitsColor: 'red', days: 'OOS', daysColor: 'red' }
      ],
      dispatch: {
        bars: [
          { label: 'Amazon UK', pct: 12, valText: '0.5%', color: 'green' },
          { label: 'eBay UK',   pct: 20, valText: '0.8%', color: 'green' },
          { label: 'D2C',       pct: 10, valText: '0.4%', color: 'green' }
        ],
        note: 'Amazon threshold: <4% · All channels compliant'
      },
      restock: [
        { level: 'red',   title: 'Isotonic Mix 1kg — Amazon UK', sub: 'OOS · Immediate restock needed' },
        { level: 'amber', title: 'Energy Gel — eBay UK', sub: '9 days cover · Order this week' },
        { level: 'amber', title: 'Isotonic Mix 1kg — Amazon UK', sub: '11 days cover · Order this week' }
      ]
    },

    products: {
      kpis: [
        { bar: '#404935', lbl: 'Top ASIN Rev.', val: '£8,200',  dCls: 'du', d: 'Amazon UK',    s: '27.9% of total' },
        { bar: 'green',   lbl: 'Orders',        val: '717',     dCls: 'du', d: '▲ 18.0% MoM',  s: '608 orders Apr' },
        { bar: 'blue',    lbl: 'Avg. AoV',      val: '£41',     dCls: 'du', d: '▲ £1 MoM',     s: '£40 Apr' },
        { bar: 'amber',   lbl: 'ASP',           val: '£28.40',  dCls: 'du', d: '▲ £0.20 MoM',  s: '£28.20 Apr' }
      ],
      table: [
        { name: 'Amazon UK', flag: 'gb', revenue: '£18,400', units: '470', orders: '449', cvr: '12.6%', cvrCls: 'bg', aov: '£41.0' },
        { name: 'eBay UK',   flag: 'gb', revenue: '£4,200',  units: '110', orders: '102', cvr: '9.4%',  cvrCls: 'ba', aov: '£41.2' },
        { name: 'D2C',       flag: 'gb', revenue: '£6,800',  units: '180', orders: '166', cvr: '3.1%',  cvrCls: 'ba', aov: '£41.0' }
      ]
    },

    keywords: {
      kpis: [
        { bar: '#404935', lbl: 'Active KWs',     val: '186',   dCls: 'du', d: '▲ 14 MoM',     s: 'Across all campaigns' },
        { bar: 'green',   lbl: 'Avg. CPC',       val: '£0.33', dCls: 'du', d: '▼ £0.02 MoM',  s: 'Blended UK' },
        { bar: 'red',     lbl: 'High ACOS KWs',  val: '8',     dCls: 'dd', d: 'ACOS >30%',     s: 'Review & pause' },
        { bar: 'blue',    lbl: 'Top KW Rev.',    val: '£5.1k', dCls: 'du', d: 'isotonic drink',s: 'Amazon UK' }
      ],
      table: [
        { kw: 'isotonic drink',        geo: 'Amazon UK · SP', match: 'Exact',  matchCls: 'bg', spend: '£384', sales: '£5.1k', acos: '7.5%',  acosCls: 'bg', roas: '13.3×', cpc: '£0.28' },
        { kw: 'sports hydration powder', geo: 'Amazon UK · SP', match: 'Exact', matchCls: 'bg', spend: '£352', sales: '£4.4k', acos: '8.0%',  acosCls: 'bg', roas: '12.5×', cpc: '£0.30' },
        { kw: 'energy gel marathon',   geo: 'Amazon UK · SP', match: 'Phrase', matchCls: 'bb', spend: '£268', sales: '£2.9k', acos: '9.2%',  acosCls: 'bg', roas: '10.8×', cpc: '£0.34' },
        { kw: 'electrolyte tablets',   geo: 'eBay UK · SP',   match: 'Exact',  matchCls: 'bg', spend: '£210', sales: '£2.0k', acos: '10.5%', acosCls: 'bg', roas: '9.5×',  cpc: '£0.26' },
        { kw: 'recovery protein drink',geo: 'D2C · SP',       match: 'Phrase', matchCls: 'bb', spend: '£176', sales: '£1.6k', acos: '11.0%', acosCls: 'bg', roas: '9.1×',  cpc: '£0.25' }
      ]
    }
  }
};
