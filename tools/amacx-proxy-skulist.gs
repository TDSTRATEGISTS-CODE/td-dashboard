/**
 * AMACX Dashboard Proxy — SkuList.gs (second file in the same Apps Script project as Code.gs).
 * Fixes ?rebake=1 → skuList, which came back empty after the SKU List tab's headers changed
 * (CHILDASIN → ASIN, DE → DE Status). This file's rebakeInputsResponse_ replaces the one in Code.gs
 * (Apps Script loads files in order; the later definition wins), so Code.gs stays untouched.
 * Read by the weekly AMACX overview routine (tools/amacx-weekly-overview.routine.md).
 */
function rebakeInputsResponse_() {
  var out;
  try { out = rebakeInputs_(); out.skuList = skuListRows_(); }
  catch (err) { out = { error: String(err && err.message || err) }; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function skuListRows_() {
  var sh = openBook_().getSheetByName('SKU List');
  if (!sh) return [];
  var v = sh.getDataRange().getValues(), hdr = -1, col = {}, r, c, rows = [];
  for (r = 0; r < v.length && hdr < 0; r++) {
    for (c = 0; c < v[r].length; c++) {
      var h = String(v[r][c]).trim().toUpperCase();
      if (h === 'ASIN' || h === 'CHILDASIN') { hdr = r; break; }
    }
  }
  if (hdr < 0) return [];
  v[hdr].forEach(function (h, i) { var k = String(h).trim().toUpperCase(); if (!(k in col)) col[k] = i; });
  function cell(row, names) {
    for (var n = 0; n < names.length; n++) if (names[n] in col) return String(row[col[names[n]]] == null ? '' : row[col[names[n]]]).trim();
    return '';
  }
  for (r = hdr + 1; r < v.length; r++) {
    var asin = cell(v[r], ['ASIN', 'CHILDASIN']);
    if (!asin) continue;
    var st = { de: cell(v[r], ['DE STATUS', 'DE']), fr: cell(v[r], ['FR STATUS', 'FR']),
               es: cell(v[r], ['ES STATUS', 'ES']), it: cell(v[r], ['IT STATUS', 'IT']) };
    var stockTxt = cell(v[r], ['EU STOCK']), euStock = stockTxt === '' ? null : Number(stockTxt);
    // One pooled EU FBM stock: every live market (DE/FR/ES/IT) must agree. oos = pooled stock is 0
    // (status columns only when EU Stock is blank). mismatch = status columns disagree with each
    // other or with the pooled stock: a team fix-list item, never shown to the client as OOS.
    var live = [st.de, st.fr, st.es, st.it].map(function (x) { return x.toUpperCase(); });
    var anyOos = live.indexOf('OOS') !== -1, anyActive = live.indexOf('ACTIVE') !== -1;
    rows.push({
      asin: asin, sku: cell(v[r], ['AMAZON SKU', 'FBM SKU']), title: cell(v[r], ['TITLE']),
      group: cell(v[r], ['GROUP NAME']), de: st.de, fr: st.fr, es: st.es, it: st.it,
      euStock: euStock, euUnits30: cell(v[r], ['EU UNITS 30D']), euLastSold: cell(v[r], ['EU LAST SOLD']),
      euSyncStatus: cell(v[r], ['EU SYNC STATUS']), lastSynced: cell(v[r], ['LAST SYNCED']),
      oos: euStock === 0 || (euStock == null && anyOos),
      mismatch: (anyOos && anyActive) || (anyOos && euStock != null && euStock > 0) || (euStock === 0 && anyActive)
    });
  }
  return rows;
}
