/**
 * AMACX re-bake inputs (add as a SECOND file in the Apps Script project, e.g. "Rebake.gs").
 * Read-only. Served only when the web app URL is called with ?rebake=1, so the dashboard's normal
 * response is unchanged. Index 0 = JANUARY in every monthly array. Relies on helpers already in Code.gs.
 */
function rebakeInputsResponse_() {
  var out;
  try { out = rebakeInputs_(); } catch (err) { out = { error: String(err && err.message || err) }; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function rebakeInputs_() {
  var labels = {
    unitsTarget: 'UNITS SOLD TARGET', unitsTargetAlt: 'UNIT SOLD TARGET',
    revenueTarget: 'REVENUE TARGET', adBudget: 'AD BUDGET / SPEND'
  };
  var out = { master: {}, market: {}, skuList: [] };
  openBook_().getSheets().forEach(function (sh) {
    var v = sh.getDataRange().getValues();
    scanMarketGrids_(v, out.market);
    var janCols = null, r, c;
    for (r = 0; r < v.length; r++) {
      var jc = findJanCols_(v[r]);
      if (jc && rowHasTotalsMarker_(v[r])) { janCols = jc; break; }
    }
    if (janCols) {
      for (r = 0; r < v.length; r++) {
        var label = String(v[r][0]).trim().toUpperCase();
        if (!label) continue;
        Object.keys(labels).forEach(function (k) {
          if (!out.master[k] && label.indexOf(labels[k]) !== -1) {
            out.master[k] = { label: String(v[r][0]).trim(), y2025: readMonths_(v[r], janCols[0]), y2026: readMonths_(v[r], janCols[1]) };
          }
        });
      }
    }
    if (sh.getName() === 'SKU List') {
      var hdr = -1, col = {};
      for (r = 0; r < v.length && hdr < 0; r++) {
        for (c = 0; c < v[r].length; c++) if (String(v[r][c]).trim().toUpperCase() === 'CHILDASIN') hdr = r;
      }
      if (hdr >= 0) {
        v[hdr].forEach(function (h, i) { col[String(h).trim().toUpperCase()] = i; });
        for (r = hdr + 1; r < v.length; r++) {
          var asin = String(v[r][col['CHILDASIN']] || '').trim();
          if (!asin) continue;
          out.skuList.push({
            asin: asin, group: String(v[r][col['GROUP NAME']] || '').trim(),
            de: String(v[r][col['DE']] || '').trim(), fr: String(v[r][col['FR']] || '').trim(),
            es: String(v[r][col['ES']] || '').trim(), it: String(v[r][col['IT']] || '').trim()
          });
        }
      }
    }
  });
  return out;
}
