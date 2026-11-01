// ============================================================================================
// NKV Oct 2026 re-bake -- inventory + products inputs (generated 2026-11-01). NOT yet applied to data.js.
// Part A: sections.inventory -- replace the irl/usa members of kpisByMarket, stockByMarket, restockByMarket
//         (and change the comment above kpisByMarket from "4 Oct 2026" to "1 Nov 2026"). supplierPOs untouched.
// Part B: sections.products script block -- replace the LBL/UK/IRL/GROUPS/USA var lines, replace usaGroups(),
//         and swap the GROUPS comment (suggested text at the bottom).
// ============================================================================================

// ---------------- PART A : inventory ----------------
      kpisByMarket: {
        irl: [
          {bar:'green', lbl:'In Stock', val:'23', dCls:'du', d:'of 25 listings', s:'2 OOS · Girlactik Black & Brown'},
          {bar:'#404935', lbl:'Units on Hand', val:'1,088', dCls:'df', d:'FBA total', s:'ships from UK pool'},
          {bar:'green', lbl:'Stock-up Watch', val:'0', dCls:'du', d:'healthy cover', s:'early stage · low velocity'},
          {bar:'amber', lbl:'Out of Stock', val:'2', dCls:'df', dColor:'amber', d:'none selling in Oct', s:'B099KVFGZP · B09QRJ4Y44'}
        ],
        usa: [
          {bar:'green', lbl:'In Stock', val:'4', dCls:'du', d:'of 4 ASINs', s:'Newnique · 0 OOS'},
          {bar:'#404935', lbl:'Units on Hand', val:'235', dCls:'df', d:'FBA total', s:'across 4 SKUs'},
          {bar:'green', lbl:'Stock-up Watch', val:'0', dCls:'du', d:'healthy cover', s:'all 4 in stock · 100+ days'},
          {bar:'green', lbl:'Out of Stock', val:'0', dCls:'du', d:'catalogue 4 SKUs', s:'all in stock'}
        ]
      },
      stockByMarket: {
        irl: [
          {dot:'dg', name:'Contours Rx Assortment 4–7mm', note:'B0FYR8DQ2G · IE · Contours Rx', units:'150 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 4mm', note:'B08MJ1PSXN · IE · Contours Rx', units:'99 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 5mm', note:'B018EHTG5K · IE · Contours Rx', units:'72 units', days:'ample'},
          {dot:'dg', name:'White Luxe Teeth Whitening Kit', note:'B08SCS43Q1 · IE · White Luxe', units:'71 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 7mm', note:'B018EDU1DA · IE · Contours Rx', units:'68 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 6mm', note:'B018EHOJ2K · IE · Contours Rx', units:'54 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 8mm', note:'B07Y2P3THB · IE · Contours Rx · sold in Oct', units:'38 units', days:'ample'},
          {dot:'dr', name:'Girlactik Gel Eyeliner — Pure Black', note:'B099KVFGZP · IE · out of stock since 28 Sep', units:'0 units', unitsColor:'red', days:'OOS', daysColor:'red'}
        ],
        usa: [
          {dot:'dg', name:'Newnique Hair Loss Serum', note:'B0F8QQGM8Y · US · top seller in Oct (5 units)', units:'60 units', days:'ample'},
          {dot:'dg', name:'Newnique Scalp Exfoliant', note:'B0F8QLYNMQ · US · 3 units in Oct', units:'61 units', days:'ample'},
          {dot:'dg', name:'Newnique Organic Hair Growth Oil', note:'B0F8QQ4M2G · US · 3 units in Oct', units:'47 units', days:'ample'},
          {dot:'dg', name:'Newnique Advanced Hair Growth Serum', note:'B0F8QMT775 · US · no sales in Oct', units:'67 units', days:'ample'}
        ]
      },
      restockByMarket: {
        irl: [
          {level:'amber', title:'Girlactik Gel Eyeliner — Pure Black (IE)', sub:'B099KVFGZP · out of stock since 28 Sep · not selling in Oct · low priority — stock-up with the next Girlactik shipment'}
        ],
        usa: [
          {level:'green', title:'No stock-up needed — all 4 Newnique SKUs have 100+ days cover', sub:'4 live ASINs · 235 units on hand · 11 units sold in Oct'}
        ]
      },

// ---------------- PART B : products script block ----------------
// (inside the IIFE, replace the existing var LBL / var UK / var IRL / var GROUPS / var USA statements.
//  The GROUPS comment, the "function num/gbp" lines and everything else stay as they are.)
  var LBL = { may: 'Oct', '3m': '3-mo', '6m': '6-mo', '12m': '12-mo' };
  var UK = {
    may:  { rev:'£11,398', units:471, orders:441, aov:'£25.84', cvr:'8.9%', asp:'£24.20', topRev:'£8,132', topPct:'71%', sold:42 },
    '3m': { rev:'£41,582', units:1556, orders:1420, aov:'£29.28', cvr:'8.2%', asp:'£26.72', topRev:'£30,234', topPct:'73%', sold:51 },
    '6m': { rev:'£84,073', units:3216, orders:2966, aov:'£28.35', cvr:'8.8%', asp:'£26.14', topRev:'£59,701', topPct:'71%', sold:54 },
    '12m': { rev:'£174,081', units:6626, orders:6161, aov:'£28.26', cvr:'8.3%', asp:'£26.27', topRev:'£119,403', topPct:'69%', sold:78 }
  };
  var IRL = {
    may:  { rev:'£105', units:3, orders:3, aov:'£35.04', cvr:'2.1%' },
    '3m': { rev:'£551', units:15, orders:14, aov:'£39.39', cvr:'2.9%' },
    '6m': { rev:'£1,612', units:49, orders:46, aov:'£35.04', cvr:'3.7%' },
    '12m': { rev:'£3,606', units:111, orders:104, aov:'£34.67', cvr:'3.8%' }
  };
  var GROUPS = {
    may:  [['Contours Rx — Eyelid Strips','£8,132',245,'71%','£642','7.9%','bg','11.2%','bg'],['Newnique — Hair Growth','£954',70,'8%','£420','44.1%','br','7.1%','ba'],['White Luxe — Teeth Whitening','£917',38,'8%','£436','47.5%','br','5.6%','ba'],['Lilibeth — Brow & Dermaplaning','£881',95,'8%','£109','12.4%','bg','18.3%','bg'],['Hydrte — Travel Bottles','£513',23,'4%','£334','65.2%','br','2.4%','br'],['Girlactik — Eyeliner','£0',0,'0%','£0','—','bb','—','bb']],
    '3m': [['Contours Rx — Eyelid Strips','£30,234',888,'73%','£2,392','7.9%','bg','10.7%','bg'],['Newnique — Hair Growth','£3,598',184,'9%','£1,844','51.3%','br','4.7%','ba'],['White Luxe — Teeth Whitening','£3,140',112,'8%','£1,606','51.2%','br','5.2%','ba'],['Lilibeth — Brow & Dermaplaning','£2,532',275,'6%','£380','15.0%','bg','18.3%','bg'],['Hydrte — Travel Bottles','£1,820',82,'4%','£867','47.7%','br','2.6%','br'],['Girlactik — Eyeliner','£257',15,'1%','£2','0.7%','bg','—','bb']],
    '6m': [['Contours Rx — Eyelid Strips','£59,701',1765,'71%','£5,547','9.3%','bg','10.5%','bg'],['White Luxe — Teeth Whitening','£8,437',286,'10%','£3,814','45.2%','br','5.6%','ba'],['Newnique — Hair Growth','£6,642',367,'8%','£3,374','50.8%','br','5.3%','ba'],['Lilibeth — Brow & Dermaplaning','£5,578',607,'7%','£931','16.7%','bg','18.8%','bg'],['Hydrte — Travel Bottles','£2,422',110,'3%','£1,134','46.8%','br','2.7%','br'],['Girlactik — Eyeliner','£1,294',81,'2%','£252','19.5%','bg','22.1%','bg']],
    '12m': [['Contours Rx — Eyelid Strips','£119,403',3548,'69%','£12,774','10.7%','bg','9.1%','bg'],['White Luxe — Teeth Whitening','£20,447',622,'12%','£6,841','33.5%','ba','5.2%','ba'],['Newnique — Hair Growth','£12,141',568,'7%','£5,740','47.3%','br','4.8%','ba'],['Lilibeth — Brow & Dermaplaning','£11,957',1273,'7%','£2,276','19.0%','bg','17.0%','bg'],['Girlactik — Eyeliner','£6,981',464,'4%','£2,030','29.1%','ba','10.2%','bg'],['Hydrte — Travel Bottles','£2,422',110,'1%','£1,134','46.8%','br','2.7%','br'],['While and Wonder — Tummy Time Play Mat','£730',41,'0%','£0','0.0%','bg','6.8%','ba']]
  };
  var USA = {
    may:  { rev:'£99', units:11, orders:10, aov:'£9.90' },
    '3m': { rev:'£746', units:48, orders:39, aov:'£19.14' },
    '6m': { rev:'£2,104', units:172, orders:116, aov:'£18.14' },
    '12m': { rev:'£2,104', units:172, orders:116, aov:'£18.14' }
  };

// NOTE: var order in data.js is LBL, UK, IRL, GROUPS, (num, gbp), USA -- the generated text above has USA last;
// move it back below gbp() if you want the diff minimal. Both orders work (all are function-scoped vars).

// ---- replace usaGroups() (Oct: real US ad spend $13.71 x 0.78 = £10.69; TACOS 13.71/126.93 = 10.8%) ----
  function usaGroups(a, p) {
    return [
      { name:'Newnique — Hair Growth', sales:a.rev, adSpend: p==='may' ? '£11' : '—', tacos: p==='may' ? '10.8%' : null,
        tacosCls: p==='may' ? 'bg' : 'br', units:num(a.units), pct:'100%', oosRate:'0%', oosCls:'bg' }
    ];
  }
// and update the USA comment above it: "Real ad spend/TACOS (£11 / 10.8%) are from the October MerchantSpring
// monthly bucket (US$13.71 / US$126.93) only ... 3m/6m/12m show '—'".

// ---- suggested GROUPS comment (replaces the 4 Oct 2026 text) ----
//   all four periods re-baked 1 Nov 2026 from a fresh MerchantSpring pull (generated salesByProduct reports,
//   GMT, includeTax:true, grouped by brand; generated trafficAndConversion (view:'skus') reports summed by brand
//   give sessions -> CVR = ordered units / sessions). Product-report brand totals reconcile to the channel's
//   settled monthly buckets within £1 in every window (Oct £11,397.52 exact), so no undercount this month.
//   Product-level ad spend excludes unallocated campaign spend (Oct £1,942 vs channel £2,048), so TACOS is a floor.
//   Girlactik: no Oct sales (Pure Black OOS since 28 Sep) -> row kept at £0 with '—'; 3m CVR '—' (34 sessions).
//   12m adds a "While and Wonder" line (Tummy Time play mat, £730, last sold 24 Jan 2026).
