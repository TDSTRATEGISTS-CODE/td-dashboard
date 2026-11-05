      // Real FBA stock snapshot from the MerchantSpring product report (qty + days-cover per listing, 5 Nov 2026; sales = October).
      // 42 UK listings sold in October; 41 of them are in stock (Lilibeth Pink 2-Pack OOS since 3 Oct). Stock-up watch = selling
      // listings under 30 days cover (or OOS). No dispatch-rate source → the Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green', lbl:'In Stock', val:'41', dCls:'du', d:'SKUs · 1 OOS now', s:'of 42 sold listings'},
        {bar:'#404935', lbl:'Units on Hand', val:'1,384', dCls:'df', d:'FBA total', s:'across 42 selling SKUs'},
        {bar:'amber', lbl:'Stock-up Watch', val:'4', dCls:'df', dColor:'amber', d:'selling · <30d cover', s:'see priority list'},
        {bar:'green', lbl:'Buy Box (Oct)', val:'99.6%', dCls:'du', d:'featured-offer %', s:'vs 99.4% Sep'}
      ],
      stock: [
        {dot:'dg', name:'Contours Rx Lids by Design — Assortment 4–7mm', note:'B0FYR8DQ2G · UK · top seller (70/mo)', units:'145 units', days:'~70 days'},
        {dot:'dg', name:'Contours Rx Lids by Design — 4mm', note:'B08MJ1PSXN · UK · Contours Rx', units:'93 units', days:'~66 days'},
        {dot:'dg', name:'Contours Rx Lids by Design — 5mm', note:'B018EHTG5K · UK · Contours Rx', units:'67 units', days:'~96 days'},
        {dot:'dg', name:'White Luxe Teeth Whitening Kit', note:'B08SCS43Q1 · UK · White Luxe', units:'71 units', days:'~125 days'},
        {dot:'dg', name:'Contours Rx Lids by Design — 6mm', note:'B018EHOJ2K · UK · Contours Rx', units:'52 units', days:'~56 days'},
        {dot:'dg', name:'Contours Rx Lids by Design — 7mm', note:'B018EDU1DA · UK · Contours Rx', units:'59 units', days:'~48 days'},
        {dot:'da', name:'Newnique Scalp Renewal Exfoliant', note:'B0F8QLYNMQ · UK · low cover', units:'16 units', unitsColor:'amber', days:'~21 days', daysColor:'amber'},
        {dot:'da', name:'Lilibeth Brow Shaper Purple 2-Pack', note:'B0FFDSR57K · UK · low cover', units:'1 unit', unitsColor:'red', days:'~4 days', daysColor:'red'}
      ],
      restock: [
        {level:'red', title:'Lilibeth Brow Shaper Purple 2-Pack — UK', sub:'B0FFDSR57K · ~4 days cover · 1 unit · selling 7/mo — stock-up this week'},
        {level:'red', title:'Lilibeth Brow Shaper Pink 2-Pack — UK', sub:'B0FFDPBJP2 · out of stock since 3 Oct · sold 3 in Oct — stock-up this week'},
        {level:'amber', title:'Newnique Scalp Renewal Exfoliant — UK', sub:'B0F8QLYNMQ · ~21 days cover · 16 units · selling 13/mo — stock-up soon'},
        {level:'amber', title:'Newnique GrowPod Device — UK', sub:'B0F8QKKZMQ · ~30 days cover · 1 unit · selling 1/mo — stock-up soon'}
      ],
