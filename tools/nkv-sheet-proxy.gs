/**
 * NKV Beauty Dashboard — Data Proxy (Google Apps Script Web App)
 * --------------------------------------------------------------
 * Reads the "NKV Beauty Account Tracker" and serves ONLY the sheet-controlled deep-page
 * bits as JSON, shaped like the dashboard's `sections` object:
 *     sections.overview.tasksSpec     ← Project Scope board, "Upcoming" column
 *     sections.overview.flagsSpec     ← Project Scope board, "In Progress" column
 *     sections.overview.completedSpec ← Project Scope board, "Completed" column (header: Completed/Complete/Done)
 *     sections.advertising.budgets   ← monthly ad budget vs the latest actual ad spend
 *     sections.inventory.supplierPOs ← "Supplier Purchase Orders" table (manufacturer reorder forecast;
 *                                       Order-By-Latest urgency is read from the cell background colour)
 *
 * The MerchantSpring-baked sections (pnl, products, campaigns, inventory, buyBox, cvr) and the
 * whole `dateRanges` object stay in the dashboard's data.js — the dashboard is configured with
 * overlay:'sections', so app.js merges ONLY the keys returned here and never touches the rest.
 *
 * doPost (write-back) — the monthly SYNC. Writes last month's actuals into two tabs in one POST:
 * "Amazon Account Tracker" (UK/EU revenue, units, ad metrics — rows 2–10 inputs + 24–27) and
 * "Shopify Account Tracker" (Contours Rx sales/units + Shopify Google/social ad spend). Formula-safe,
 * never touching the Stock / External-Costs / profit rows. Driven by tools/nkv-monthly-sync.routine.md.
 *
 * IMPORTANT — this needs a NATIVE Google Sheet, not the uploaded .xlsx:
 *   1. In Drive, open "NKV Beauty Account Tracker.xlsx" ▸ File ▸ Save as Google Sheets.
 *   2. Open the new native sheet, copy its ID from the URL into CONFIG.SPREADSHEET_ID below.
 *   3. Extensions ▸ Apps Script ▸ paste this file ▸ Deploy ▸ New deployment ▸ Web app
 *        Execute as: Me   ·   Who has access: Anyone
 *   4. Copy the /exec URL into clients/nkv/config.js dataSource.url and set type:'appsScript'.
 *      The SAME /exec URL serves both doGet (dashboard read) and doPost (monthly sync) — paste it into
 *      the "Write endpoint" line of tools/nkv-monthly-sync.routine.md too. After editing this file,
 *      redeploy as a NEW version (Deploy ▸ Manage deployments) or Google keeps serving the old code.
 *
 * Robustness: the scope board is located by MARKER text and its columns by HEADER text
 * ("In Progress" / "Upcoming" / "Completed" / "Flags & Warnings"), NOT by fixed coordinates — so
 * inserting rows/columns won't break it. Currency is GBP (£). Falls back to data.js on any error.
 */

// ============================ CONFIG ============================

var CONFIG = {
  // The NATIVE Google Sheet copy of "NKV Beauty Account Tracker". Leave blank to bind to the
  // container sheet (if this script is created from Extensions ▸ Apps Script inside that sheet).
  SPREADSHEET_ID: '15h_Eo36PhnyX-a4cOlo6yvyhLwS2U9BDbz1fcnruwE4',  // native Google Sheet copy of "NKV Beauty Account Tracker"

  // Approved monthly ad budget (£). The tracker keeps this on the Marketing Activity sheet
  // ("AGG/NKV"), not the per-month grid — so it's a constant here. Edit when the budget changes.
  MONTHLY_BUDGET: 3000,

  // Row label (column A) of the actual monthly ad-spend series, matched case-insensitively/contains.
  AD_SPEND_ROW: 'Total Amazon Ad Spend',

  // ---- Write-back (doPost) — monthly sync (see tools/nkv-monthly-sync.routine.md) ----
  // Tabs the monthly sync writes into, each with a DIFFERENT header shape:
  //  • Amazon: row 1 carries a "2025" grid then a "2026" grid → column found from the requested YEAR block.
  //  • Shopify: row 1 is a single month row (no year block) → column found by the month header alone.
  AMAZON_TAB: 'Amazon Account Tracker',
  SHOPIFY_TAB: 'Shopify Account Tracker',

  // Scope-board column headers → which dashboard card each feeds.
  SCOPE_HEADERS: { inProgress: 'In Progress', upcoming: 'Upcoming', flags: 'Flags & Warnings' },

  // The Completed column → Overview "Completed" card. Matched case-insensitively against this list,
  // so the header on the board tab can read "Completed", "Complete" or "Done".
  COMPLETED_ALIASES: ['completed', 'complete', 'done'],

  // A tab is treated as the scope board only if it contains one of these markers.
  SCOPE_MARKERS: ['flags & warnings', 'requested activity', 'onboarding tasks'],

  // Rows to ignore in the scope columns (headers / notes, matched lower-cased + trimmed).
  SKIP: ['', 'status', 'in progress', 'upcoming', 'completed', 'ongoing', 'flags & warnings',
    'project', 'onboarding tasks', 'requested activity'],

  // Supplier PO table — located by these header texts (case-insensitive 'contains'). Product sits in
  // the column LEFT of "Stock Lasts Until"; the free-text note sits RIGHT of "Order By Latest".
  PO_HEADERS: { lastsUntil: 'stock lasts until', checkAgain: 'check again', orderBy: 'order by' },

  // Shopify P&L block. Anchored on the monthly TOTAL row ("Total Shopify Revenue"); the month columns
  // are the contiguous numeric cells to its right (so adding a new month just works). Each expense
  // line is matched on column A (lower-cased) within a window around the anchor — 'contains' by
  // default, EXACT for the three Google rows so "Google Ad Spend" ≠ "Contours Rx Google Ad Spend".
  // Contours Rx revenue is DERIVED (total − Newnique), avoiding the duplicate CRX-sales label.
  SHOPIFY_PNL: {
    anchor: 'Total Shopify Revenue',
    windowAbove: 50, windowBelow: 150,
    labels: {
      crxRev:  'Contours Rx Shopify Sales',  // read from BELOW the anchor (skips the annual decoy above)
      nkvRev:  'Newnique Shopify Sales',
      crxCogs: 'Total Estimated COGS',
      nkvCogs: 'COGS (Units sold',          // Newnique tier (CRX tiers read "COGS Variations (…")
      sub:     'Shopify Subscription Fee',
      app:     'Additional Application Fees',
      txn:     'Transaction Fee',
      ship:    'Beckdale Costs',
      bm:      'Brand Manager',
      social:  'Social Media Ad Spend',
      td:      'T D Amazon Service Fees',
      shopExp: 'Shopify Expenses',
      googleAll: 'Google Ad Spend',         // EXACT trio (skip the per-brand split rows below)
      gAdsCrx:   'Contours Rx Google Ad Spend',
      gAdsNkv:   'Newnique Google Ad Spend'
    }
  }
};

// ============================ ENTRY POINT ============================

function doGet(e) {
  var sections, status = 'ok';
  try {
    sections = buildSections();
  } catch (err) {
    status = 'error';
    sections = { error: String(err && err.message || err) };
  }
  var body = JSON.stringify({ status: status, generated: new Date().toISOString(), sections: sections });

  var cb = e && e.parameter && e.parameter.callback;   // optional JSONP: ?callback=fn
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + body + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

// ============================ WRITE-BACK (doPost) ============================
/**
 * Write a month's actuals into the tracker — the write-side counterpart to doGet, driven by
 * tools/nkv-monthly-sync.routine.md. Two tabs are synced in one POST:
 *
 *   • "Amazon Account Tracker"  (rows 2–10 inputs + 24–27 marketing metrics)
 *   • "Shopify Account Tracker" (Contours Rx sales/units + Shopify Google/social ad spend)
 *
 * POST body (JSON), e.g.:
 *   { "client":"nkv", "month":"June", "year":"2026",
 *     "revenue_by_market": { "UK":14112, "EU":224 },
 *     "units_total": 562,
 *     "advertising": { "ad_spend":3500, "ad_sales":6153, "acos":0.49, "tacos":0.24 },
 *     "shopify": { "crx_sales":2826, "crx_units_variations":42, "crx_assortment_packs":62,
 *                  "crx_google_ad_spend":713.84, "newnique_sales":28.95, "newnique_units":2,
 *                  "newnique_google_ad_spend":194.5, "social_media_ad_spend":21.5 } }
 * Any field/section omitted is simply not written — pass only what you have.
 *
 * SCOPE — writes ONLY the labelled rows in each tab's spec list below. It NEVER writes the Stock section,
 * External Costs, the profit rows, or any formula cell (derived totals such as "Amazon Revenue inc VAT" /
 * "Total Shopify Revenue") — see FORMULA-SAFE below.
 *
 * COLUMN — the target month column differs by tab: the Amazon tab is located from the requested YEAR block
 * (the "2026" header cell, then the month to its right), the Shopify tab from the month header alone (it
 * has no year block). Rows are matched by an EXACT column-A label (case-insensitive, trimmed) — so "ACOS"
 * never collides with "TACOS" and "Units ordered (variations…)" never collides with "Units ordered".
 *
 * FORMULA-SAFE: a target cell that already holds a formula is LEFT INTACT and reported under "skipped".
 *
 * Response:
 *   Success:  { "status":"ok",    "written":[...], "skipped":[...] }
 *   Failure:  { "status":"error", "message":"...", "missing":[...], "written":[...], "skipped":[...] }
 */
function doPost(e) {
  var written = [], missing = [], skipped = [];
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error('Missing POST body.');
    var body = JSON.parse(e.postData.contents);
    var month = String(body.month || '').trim();
    if (!month) throw new Error('Missing "month" in request body.');
    var year = String(body.year || '').trim();
    if (!year) throw new Error('Missing "year" in request body.');
    var monthUP = month.toUpperCase();

    var book = CONFIG.SPREADSHEET_ID ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    var rev = body.revenue_by_market || {};
    var adv = body.advertising || {};
    var shp = body.shopify || {};

    // Amazon tab — column found from the requested YEAR block. null value = field not supplied → skipped.
    syncTab_(book, CONFIG.AMAZON_TAB, { year: year, monthUP: monthUP, month: month }, [
      { label: 'NKV UK',                   value: rev.UK },
      { label: 'NKV Europe',               value: rev.EU },
      { label: 'NKV Units Sold on Amazon', value: body.units_total },
      { label: 'Total Amazon Ad Spend',    value: adv.ad_spend },
      { label: 'Total Ad Sales',           value: adv.ad_sales },
      { label: 'ACOS',                     value: adv.acos },
      { label: 'TACOS',                    value: adv.tacos }
    ], written, missing, skipped);

    // Shopify tab — column found from the month header alone (no year block).
    syncTab_(book, CONFIG.SHOPIFY_TAB, { monthUP: monthUP, month: month }, [
      { label: 'Contours Rx Shopify Sales',                 value: shp.crx_sales },
      { label: 'Units ordered (variations not Ass Pack.)',  value: shp.crx_units_variations },
      { label: 'Assortment Packs bought on discount',       value: shp.crx_assortment_packs },
      { label: 'Contours Rx Google Ad Spend',               value: shp.crx_google_ad_spend },
      { label: 'Newnique Shopify Sales',                    value: shp.newnique_sales },
      { label: 'Units ordered',                             value: shp.newnique_units },
      { label: 'Newnique Google Ad Spend',                  value: shp.newnique_google_ad_spend },
      { label: 'Social Media Ad Spend',                     value: shp.social_media_ad_spend }
    ], written, missing, skipped);

    if (missing.length) {
      return jsonOut_({ status: 'error', message: 'Some rows were not found in the sheet.', missing: missing, written: written, skipped: skipped });
    }
    return jsonOut_({ status: 'ok', written: written, skipped: skipped });
  } catch (err) {
    return jsonOut_({ status: 'error', message: String(err && err.message || err), missing: missing, written: written, skipped: skipped });
  }
}

/**
 * Write one tab's specs into the target month column. Skips the tab entirely if none of its specs carry a
 * value (so a Shopify-less or Amazon-less POST touches only what it supplies). Locates the column via the
 * YEAR block when opts.year is set (Amazon), else via the month header alone (Shopify). Each written /
 * skipped / missing entry is prefixed with the tab name so a two-tab response stays unambiguous.
 */
function syncTab_(book, tabName, opts, specs, written, missing, skipped) {
  var any = false;
  for (var i = 0; i < specs.length; i++) { if (specs[i].value != null) { any = true; break; } }
  if (!any) return;                                          // nothing supplied for this tab → leave it alone

  var sheet = book.getSheetByName(tabName);
  if (!sheet) throw new Error('Could not find the "' + tabName + '" tab.');
  var values = sheet.getDataRange().getValues();

  var loc = opts.year ? findYearMonthCol_(values, opts.year, opts.monthUP)
                      : findMonthHeaderCol_(values, opts.monthUP);
  if (!loc) throw new Error('Could not find the ' + opts.month + (opts.year ? ' ' + opts.year : '') + ' column in the "' + tabName + '" header.');

  specs.forEach(function (spec) {
    if (spec.value == null) return;                          // value not supplied → skip
    var rowIdx = matchRowExact_(values, spec.label);
    if (rowIdx < 0) { missing.push(tabName + ' » ' + spec.label); return; }
    if (writeCellIfPlain_(sheet, rowIdx, loc.col, spec.value)) written.push(tabName + ' » ' + spec.label);
    else skipped.push(tabName + ' » ' + spec.label);         // formula cell → left intact
  });
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

var MONTHS_UP_ = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

/**
 * Locate the requested year's month column (Amazon tab): scan the top rows for a cell whose text is exactly
 * `yearStr` (e.g. "2026"), then return the first column to its right whose header contains `monthUP` and is
 * NOT a "Totals" column. Returns { row, col } (0-based) or null. Anchoring on the year cell skips the 2025
 * grid, so "JANUARY" resolves to the 2026 January, not the 2025 one.
 */
function findYearMonthCol_(values, yearStr, monthUP) {
  var want = String(yearStr).trim();
  for (var r = 0; r < Math.min(values.length, 6); r++) {
    var yc = -1;
    for (var c = 0; c < values[r].length; c++) {
      if (String(values[r][c]).trim() === want) { yc = c; break; }
    }
    if (yc === -1) continue;
    for (var cc = yc + 1; cc < values[r].length; cc++) {
      var h = String(values[r][cc]).toUpperCase();
      if (h.indexOf('TOTAL') !== -1) continue;               // never write into a totals/sum column
      if (h.indexOf(monthUP) !== -1) return { row: r, col: cc };
    }
  }
  return null;
}

/**
 * Locate a month column on a single-year tab (Shopify): find the header row (the first top row carrying ≥3
 * month names), then the first column in it that contains `monthUP` and is NOT a "Totals" column. Requiring
 * a real month-header row avoids matching a stray month word in a label cell. Returns { row, col } or null.
 */
function findMonthHeaderCol_(values, monthUP) {
  for (var r = 0; r < Math.min(values.length, 8); r++) {
    var months = 0;
    for (var c = 0; c < values[r].length; c++) {
      var h = String(values[r][c]).toUpperCase();
      for (var mi = 0; mi < MONTHS_UP_.length; mi++) { if (h.indexOf(MONTHS_UP_[mi]) !== -1) { months++; break; } }
    }
    if (months < 3) continue;                                // not the header row
    for (var cc = 0; cc < values[r].length; cc++) {
      var hh = String(values[r][cc]).toUpperCase();
      if (hh.indexOf('TOTAL') !== -1) continue;              // never write into a totals/sum column
      if (hh.indexOf(monthUP) !== -1) return { row: r, col: cc };
    }
  }
  return null;
}

/** First row whose column-A label EXACTLY equals `label` (case-insensitive, trimmed) → row index, else -1. */
function matchRowExact_(values, label) {
  var want = String(label).trim().toLowerCase();
  for (var r = 0; r < values.length; r++) {
    if (String(values[r][0] == null ? '' : values[r][0]).trim().toLowerCase() === want) return r;
  }
  return -1;
}

/**
 * Write `value` into a cell ONLY if it holds no formula. Returns true if written, false if the cell is a
 * formula and was left untouched — the guard that stops the sync clobbering the derived rows (the
 * "Amazon Revenue inc VAT" total, ex-VAT, VAT-held, disbursements, profit rows).
 */
function writeCellIfPlain_(sheet, rowIdx, colIdx, value) {
  var cell = sheet.getRange(rowIdx + 1, colIdx + 1);
  if (String(cell.getFormula()) !== '') return false;        // formula cell → do not clobber
  cell.setValue(value);
  return true;
}

// ============================ BUILD sections ============================

function buildSections() {
  var book = CONFIG.SPREADSHEET_ID
    ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  var sheets = book.getSheets();

  var scope = null, adSpend = null, pos = null, spnl = null;
  sheets.forEach(function (sh) {
    var values = sh.getDataRange().getValues();
    if (!scope) scope = scanScopeBoard_(values);
    if (!adSpend) adSpend = findSeries_(values, CONFIG.AD_SPEND_ROW);
    if (!pos) pos = scanPOTable_(sh, values);
    if (!spnl) spnl = scanShopifyPnl_(values);
  });

  var sections = { overview: {}, advertising: {} };
  if (pos && pos.length) sections.inventory = { supplierPOs: pos };
  if (spnl) sections.shopifypnl = spnl;   // live Shopify P&L (replaces the baked sections.shopifypnl)

  if (scope) {
    if (scope.upcoming.length) {
      sections.overview.tasksSpec = {
        badge: 'Project scope',
        items: scope.upcoming.map(function (t) { return { text: t, sub: 'Upcoming', active: false }; })
      };
    }
    // The "In Progress" card is fed by the In Progress column; a populated "Flags & Warnings"
    // column takes priority (those are genuine warnings) and is shown red.
    var flagItems = [];
    scope.flags.forEach(function (t) { flagItems.push({ level: 'red', title: t, sub: 'Flag' }); });
    scope.inProgress.forEach(function (t) { flagItems.push({ level: 'amber', title: t, sub: 'In progress' }); });
    if (flagItems.length) {
      var n = scope.inProgress.length;
      sections.overview.flagsSpec = { badge: (n ? n + ' in progress' : flagItems.length + ' flagged'), items: flagItems.slice(0, 6) };
    }
    // Completed card (green) — Project Scope "Completed" column. app.js hides the card and reflows the
    // Overview grid to 3 columns when this is absent, so it only appears once the column is populated.
    if (scope.completed && scope.completed.length) {
      var done = scope.completedTotal || scope.completed.length;
      sections.overview.completedSpec = {
        badge: done + ' completed',
        items: scope.completed.map(function (t) { return { text: t, sub: 'Completed' }; })
      };
    }
  }

  // advertising.budgets — monthly budget vs the latest reported actual ad spend.
  var actual = adSpend ? lastReported_(adSpend) : null;
  var bud = CONFIG.MONTHLY_BUDGET;
  if (actual != null) {
    var variance = bud - actual;
    var vtxt = variance === 0 ? 'On budget'
      : (variance > 0 ? '▼ £' + Math.abs(Math.round(variance)).toLocaleString('en-US') + ' under'
                      : '▲ £' + Math.abs(Math.round(variance)).toLocaleString('en-US') + ' over');
    var util = bud ? Math.round((actual / bud) * 100) + '%' : '—';
    sections.advertising.budgets = {
      subLabel: 'Latest month · budget vs actual',
      headers: ['Monthly Budget', 'Actual Spend', 'Variance', 'Utilisation'],
      rows: [
        { name: 'United Kingdom', flag: 'gb', cells: [gbp_(bud), gbp_(actual), vtxt, util] },
        { name: 'Total', total: true, cells: [gbp_(bud), gbp_(actual), vtxt, util] }
      ]
    };
  }

  return sections;
}

// ============================ SCOPE BOARD ============================

/** Locate the scope board and return { upcoming:[], inProgress:[], flags:[] } by column header. */
function scanScopeBoard_(values) {
  var isBoard = false;
  for (var r0 = 0; r0 < Math.min(values.length, 40) && !isBoard; r0++) {
    for (var c0 = 0; c0 < values[r0].length; c0++) {
      if (CONFIG.SCOPE_MARKERS.indexOf(String(values[r0][c0]).trim().toLowerCase()) !== -1) { isBoard = true; break; }
    }
  }
  if (!isBoard) return null;

  // Find the header row that carries the column titles, and resolve each column index.
  var cols = null, headerRow = -1;
  for (var r = 0; r < values.length && !cols; r++) {
    var idx = {};
    for (var c = 0; c < values[r].length; c++) {
      var cell = String(values[r][c]).trim();
      if (cell === CONFIG.SCOPE_HEADERS.inProgress) idx.inProgress = c;
      if (cell === CONFIG.SCOPE_HEADERS.upcoming)   idx.upcoming = c;
      if (cell === CONFIG.SCOPE_HEADERS.flags)      idx.flags = c;
      if (CONFIG.COMPLETED_ALIASES.indexOf(cell.toLowerCase()) !== -1) idx.completed = c;
    }
    if (idx.upcoming != null || idx.inProgress != null || idx.completed != null) { cols = idx; headerRow = r; }
  }
  if (!cols) return null;

  var seen = {};
  function collect(colIdx, seenSet) {
    seenSet = seenSet || seen;
    var out = [];
    if (colIdx == null) return out;
    for (var rr = headerRow + 1; rr < values.length; rr++) {
      var txt = String(values[rr][colIdx] != null ? values[rr][colIdx] : '').trim();
      var key = txt.toLowerCase();
      if (!txt || txt.length < 3 || CONFIG.SKIP.indexOf(key) !== -1 || seenSet[key]) continue;
      seenSet[key] = 1;
      out.push(txt);
    }
    return out;
  }

  // Order matters for de-dupe across the active columns: flags first, then in-progress, then upcoming.
  var flags = collect(cols.flags);
  var inProgress = collect(cols.inProgress);
  var upcoming = collect(cols.upcoming);
  // Completed is a separate stage — give it its own de-dupe so a done item isn't suppressed by an
  // identical (transient) entry still sitting in an active column.
  var completed = collect(cols.completed, {});
  return {
    upcoming: upcoming.slice(0, 6), inProgress: inProgress.slice(0, 6), flags: flags.slice(0, 6),
    completed: completed.slice(0, 6), completedTotal: completed.length
  };
}

// ============================ SUPPLIER PO TABLE ============================

/** Locate the Supplier Purchase Orders table by header text, read its rows + Order-By urgency colour. */
function scanPOTable_(sh, values) {
  var hr = -1, cLasts = -1, cCheck = -1, cOrder = -1;
  for (var r = 0; r < values.length && hr === -1; r++) {
    var lasts = -1, check = -1, order = -1;
    for (var c = 0; c < values[r].length; c++) {
      var t = String(values[r][c]).trim().toLowerCase();
      if (t && t.indexOf(CONFIG.PO_HEADERS.lastsUntil) !== -1) lasts = c;
      if (t && t.indexOf(CONFIG.PO_HEADERS.checkAgain) !== -1) check = c;
      if (t && t.indexOf(CONFIG.PO_HEADERS.orderBy) !== -1) order = c;
    }
    if (lasts !== -1 && order !== -1) { hr = r; cLasts = lasts; cCheck = check; cOrder = order; }
  }
  if (hr === -1) return null;

  var cProduct = Math.max(0, cLasts - 1);   // product = column left of "Stock Lasts Until"
  var cNote = cOrder + 1;                    // note = column right of "Order By Latest"
  var bgs = sh.getDataRange().getBackgrounds();
  var out = [];
  for (var rr = hr + 1; rr < values.length; rr++) {
    var product = String(values[rr][cProduct] != null ? values[rr][cProduct] : '').trim();
    if (product.length < 2) continue;        // skip blank / spacer rows
    var orderBy = String(values[rr][cOrder] != null ? values[rr][cOrder] : '').trim();
    out.push({
      product: product,
      lastsUntil: String(values[rr][cLasts] != null ? values[rr][cLasts] : '').trim() || '—',
      checkAgain: (cCheck !== -1 && values[rr][cCheck] != null) ? String(values[rr][cCheck]).trim() : '',
      orderBy: orderBy || '—',
      level: bgLevel_(bgs[rr][cOrder]) || '',   // background colour of the Order-By cell = urgency
      note: (cNote < values[rr].length && values[rr][cNote] != null) ? String(values[rr][cNote]).trim() : ''
    });
    if (out.length >= 12) break;
  }
  return out.length ? out : null;
}

/** Classify a cell background hex into 'red' | 'amber' | 'green', or null (white / grey). */
function bgLevel_(hex) {
  if (!hex) return null;
  var m = String(hex).toLowerCase().match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/);
  if (!m) return null;
  var R = parseInt(m[1], 16), G = parseInt(m[2], 16), B = parseInt(m[3], 16);
  if (R > 238 && G > 238 && B > 238) return null;                  // white / near-white
  if (Math.abs(R - G) < 16 && Math.abs(G - B) < 16) return null;   // greyscale
  if (G >= R && G >= B && (G - Math.max(R, B)) > 14) return 'green';
  if (R >= G && G > B && R > 150 && G > 110) return 'amber';       // orange / amber / yellow
  if (R >= G && R >= B && (R - Math.max(G, B)) > 20) return 'red';
  return null;
}

// ============================ SERIES HELPERS ============================

/** Find a labelled row (column A contains `label`) and return its numeric cells. */
function findSeries_(values, label) {
  for (var r = 0; r < values.length; r++) {
    if (String(values[r][0]).toUpperCase().indexOf(label.toUpperCase()) !== -1) {
      return values[r].map(toNum_);
    }
  }
  return null;
}

/** Last non-empty, non-zero number in a series (the latest reported month). */
function lastReported_(arr) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] != null && arr[i] !== 0) return arr[i];
  }
  return null;
}

function toNum_(v) {
  if (v === '' || v === null || v === undefined) return null;
  if (typeof v === 'number') return v;
  var s = String(v).replace(/[£€$,\s]/g, '').replace(/%/g, '').trim();
  if (s === '' || s === '-' || s === '—') return null;
  var n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function gbp_(n) { return '£' + Math.round(Number(n) || 0).toLocaleString('en-US'); }

/** Lower-cased, trimmed string of a cell (for label matching). */
function norm_(v) { return String(v == null ? '' : v).trim().toLowerCase(); }

// ============================ SHOPIFY P&L ============================

/**
 * Reads the monthly "Shopify" P&L block and returns sections.shopifypnl, shaped EXACTLY like
 * clients/nkv/data.js: { data: { contoursrx, newnique, all } }, each with byPeriod{may,3m,6m,12m}.
 * Per-tab scan + a window around the anchor isolates the block; 'other' is the residual that foots
 * each month to "Shopify Expenses" total so Net Profit ties to the sheet's "Profit after COGS".
 */
function scanShopifyPnl_(values) {
  var cfg = CONFIG.SHOPIFY_PNL, L = cfg.labels;

  var aRow = -1;
  for (var r = 0; r < values.length; r++) {
    if (norm_(values[r][0]) === cfg.anchor.toLowerCase()) { aRow = r; break; }
  }
  if (aRow === -1) return null;

  var monthCols = [];
  for (var c = 1; c < values[aRow].length; c++) {
    var v = toNum_(values[aRow][c]);
    if (v == null) break;                     // stop at the first blank → only populated months
    monthCols.push(c);
  }
  if (!monthCols.length) return null;

  var top = Math.max(0, aRow - cfg.windowAbove), bot = Math.min(values.length, aRow + cfg.windowBelow);
  function rowHasData(rowArr) { for (var i = 0; i < monthCols.length; i++) { if (toNum_(rowArr[monthCols[i]]) != null) return true; } return false; }
  // Label match over the window. needsData skips blank decoy rows (e.g. the annual "Newnique Shopify
  // Sales" with empty month cells), keeping the populated monthly row.
  function rowFor(label, exact, needsData) {
    var want = label.toLowerCase();
    for (var rr = top; rr < bot; rr++) {
      var a = norm_(values[rr][0]);
      if (!a) continue;
      if (exact ? (a === want) : (a.indexOf(want) !== -1)) { if (needsData && !rowHasData(values[rr])) continue; return values[rr]; }
    }
    return null;
  }
  // First match strictly BELOW the anchor — used for "Contours Rx Shopify Sales", whose annual total
  // sits above the anchor as a same-label decoy. The monthly grid is always below the anchor.
  function rowBelow(label) {
    var want = label.toLowerCase();
    for (var rr = aRow + 1; rr < bot; rr++) { if (norm_(values[rr][0]).indexOf(want) !== -1) return values[rr]; }
    return null;
  }
  function cellAt(rowArr, col) { if (!rowArr) return 0; var v = toNum_(rowArr[col]); return v == null ? 0 : v; }

  var rTotal = values[aRow];
  var R = {
    crxRev: rowBelow(L.crxRev), nkvRev: rowFor(L.nkvRev, false, true),
    crxCogs: rowFor(L.crxCogs), nkvCogs: rowFor(L.nkvCogs, false, true),
    sub: rowFor(L.sub), app: rowFor(L.app), txn: rowFor(L.txn), ship: rowFor(L.ship),
    bm: rowFor(L.bm), social: rowFor(L.social), td: rowFor(L.td), shopExp: rowFor(L.shopExp),
    gAll: rowFor(L.googleAll, true), gCrx: rowFor(L.gAdsCrx, true), gNkv: rowFor(L.gAdsNkv, true)
  };

  function buildMonth(col) {
    var nkvRev = cellAt(R.nkvRev, col), totRev = cellAt(rTotal, col);
    // CRX read directly; All uses the sheet's "Total Shopify Revenue" verbatim (some months, e.g. an
    // Amazon-FBM order keyed via Shopify, are deliberately excluded from the total — copied exactly).
    var crxRev = R.crxRev ? cellAt(R.crxRev, col) : (totRev - nkvRev);
    var crxCogs = cellAt(R.crxCogs, col), nkvCogs = cellAt(R.nkvCogs, col);
    var sub = cellAt(R.sub, col), app = cellAt(R.app, col), txn = cellAt(R.txn, col), ship = cellAt(R.ship, col);
    var bm = cellAt(R.bm, col), social = cellAt(R.social, col), td = cellAt(R.td, col);
    var gAll = cellAt(R.gAll, col), gNkv = cellAt(R.gNkv, col), gCrx = cellAt(R.gCrx, col);
    if (!gAll) gAll = gCrx + gNkv;             // no combined row → derive
    if (!gCrx) gCrx = gAll - gNkv;             // no CRX split → all non-Newnique Google is CRX
    var shopExp = cellAt(R.shopExp, col);
    var other = shopExp - (crxCogs + nkvCogs + gAll + social + ship + txn + app + sub + bm + td);
    return { crxRev: crxRev, nkvRev: nkvRev, totRev: totRev, crxCogs: crxCogs, nkvCogs: nkvCogs,
      gAdsCrx: gCrx, gAdsNkv: gNkv, social: social, ship: ship, txn: txn, app: app,
      sub: sub, bm: bm, td: td, other: other };
  }

  var KEYS = ['crxRev','nkvRev','totRev','crxCogs','nkvCogs','gAdsCrx','gAdsNkv','social','ship','txn','app','sub','bm','td','other'];
  function aggCols(cols) {
    var a = {}, i; for (i = 0; i < KEYS.length; i++) a[KEYS[i]] = 0;
    cols.forEach(function (col) { var m = buildMonth(col); for (var j = 0; j < KEYS.length; j++) a[KEYS[j]] += m[KEYS[j]]; });
    return a;
  }
  function lastN(k) { return monthCols.slice(Math.max(0, monthCols.length - k)); }
  var PERIODS = { may: lastN(1), '3m': lastN(3), '6m': lastN(6), '12m': lastN(12) };
  var n = monthCols.length, partial = n < 12;

  var statusList = [
    { label: 'Revenue (Tracker)',           status: 'live', note: 'Account Tracker' },
    { label: 'COGS / unit costs',           status: 'est',  note: 'Tracker estimated unit costs' },
    { label: 'Google Ads spend',            status: 'live', note: 'Account Tracker (CRX + Newnique)' },
    { label: 'Social ad spend',             status: 'live', note: 'Account Tracker' },
    { label: 'Shipping & fulfilment',       status: 'live', note: 'Beckdale · Account Tracker' },
    { label: 'Platform & transaction fees', status: 'live', note: 'Shopify 2.9% + app fees' },
    { label: 'Software & subscriptions',    status: 'live', note: 'Shopify subscription' },
    { label: 'Brand Manager / TD fee',      status: 'live', note: 'Account Tracker' },
    { label: 'Other operating costs',       status: 'est',  note: 'Tracker residual' }
  ];
  var nkvStatus = [
    { label: 'Revenue (Tracker)', status: 'live',  note: 'Account Tracker' },
    { label: 'COGS',              status: 'est',   note: 'Account Tracker' },
    { label: 'Google Ads spend',  status: 'live',  note: 'Account Tracker' },
    { label: 'Shared opex',       status: 'input', note: 'tracked combined under Contours Rx' }
  ];
  var crxInfo = 'Live from the NKV Beauty Account Tracker. Revenue is net of discounts/returns; COGS uses the tracker’s estimated unit costs; expense lines are sheet actuals. Net Profit ties to the sheet’s “Profit after COGS”.';
  var nkvInfo = 'Newnique is tracked “light” — its own revenue, COGS and Google Ads. Shared D2C costs sit under Contours Rx; see the combined view under “All”.';
  var partialNote = 'Trailing-12-month view — the Account Tracker itemises ' + n + ' month(s) so far, so this reflects the available window; earlier months populate as they’re entered.';

  var contours = { label: 'Contours Rx UK', store: 'contours-rx.co.uk', statusList: statusList, info: crxInfo, byPeriod: {} };
  var newnique = { label: 'Newnique', store: 'newniquecare.com', statusList: nkvStatus, info: nkvInfo, byPeriod: {} };
  var all = { label: 'All Brands', store: 'Contours Rx + Newnique (combined)', statusList: statusList, info: crxInfo, byPeriod: {} };

  ['may', '3m', '6m', '12m'].forEach(function (k) {
    var a = aggCols(PERIODS[k]), label = spnlLabel_(k, n);
    var crx = spnlFull_(a, false, label), comb = spnlFull_(a, true, label), nkv = spnlLight_(a, label);
    if (k === '12m' && partial) { crx.info = comb.info = nkv.info = partialNote; }
    contours.byPeriod[k] = crx; all.byPeriod[k] = comb; newnique.byPeriod[k] = nkv;
  });

  return { data: { contoursrx: contours, newnique: newnique, all: all } };
}

function spnlLabel_(key, n) {
  if (key === 'may') return 'Latest month';
  if (key === '3m') return 'Last 3 months';
  if (key === '6m') return n <= 6 ? 'Year to date' : 'Last 6 months';
  return 'Trailing 12m';
}
function spnlMoney_(x) { var r = Math.round(x); return (r < 0 ? '−£' : '£') + Math.abs(r).toLocaleString('en-GB'); }
function spnlParen_(x) { return '(£' + Math.round(x).toLocaleString('en-GB') + ')'; }
function spnlPct_(x) { return (x * 100).toFixed(1) + '%'; }

/** Contours Rx (combined=false) or All (combined=true) full statement → { kpis, rows }. */
function spnlFull_(a, combined, label) {
  var netRev = combined ? a.totRev : a.crxRev;   // All = sheet's Total Shopify Revenue (copied exactly)
  var cogs   = a.crxCogs + (combined ? a.nkvCogs : 0);
  var gAds   = a.gAdsCrx + (combined ? a.gAdsNkv : 0);
  var gp = netRev - cogs, platform = a.txn + a.app;
  function pp(v) { return netRev ? spnlPct_(v / netRev) : ''; }
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
  var totalOpex = 0, i; for (i = 0; i < opex.length; i++) totalOpex += opex[i][1];
  var netProfit = gp - totalOpex;
  var rws = [
    { kind: 'header', label: 'Revenue' },
    { kind: 'sub', label: 'Net Revenue', note: 'net of discounts & returns', val: spnlMoney_(netRev), pct: '100%' },
    { kind: 'header', label: 'Cost of Sales' },
    { label: 'COGS', note: 'Account Tracker unit costs', val: spnlParen_(cogs), pct: pp(cogs) },
    { kind: 'sub', label: 'Gross Profit', val: spnlMoney_(gp), pct: pp(gp) },
    { kind: 'header', label: 'Operating Expenses' }
  ];
  for (i = 0; i < opex.length; i++) rws.push({ label: opex[i][0], note: opex[i][2], val: spnlParen_(opex[i][1]), pct: pp(opex[i][1]) });
  rws.push({ kind: 'sub', label: 'Total Operating Expenses', val: spnlParen_(totalOpex), pct: pp(totalOpex) });
  rws.push({ kind: 'total', label: 'Net Profit', note: netProfit < 0 ? 'Loss this period' : '', val: spnlMoney_(netProfit), pct: pp(netProfit) });
  return {
    kpis: [
      { bar: '#404935',      lbl: 'Net Revenue',  val: spnlMoney_(netRev),    dCls: 'df', d: 'Account Tracker',  s: label },
      { bar: 'var(--green)', lbl: 'Gross Profit', val: spnlMoney_(gp),        dCls: 'df', d: pp(gp) + ' margin', s: 'after COGS' },
      { bar: 'var(--blue)',  lbl: 'Total OpEx',   val: spnlMoney_(totalOpex), dCls: 'df', d: pp(totalOpex),     s: 'inc. ads + fulfilment' },
      { bar: 'var(--amber)', lbl: 'Net Profit',   val: spnlMoney_(netProfit), dCls: netProfit < 0 ? 'dd' : 'du', d: pp(netProfit) + ' margin', s: netProfit < 0 ? 'loss' : 'profit' }
    ],
    rows: rws
  };
}

/** Newnique — tracked LIGHT: own revenue / COGS / Google Ads only. */
function spnlLight_(a, label) {
  var netRev = a.nkvRev, cogs = a.nkvCogs, gp = netRev - cogs, gAds = a.gAdsNkv, netProfit = gp - gAds;
  function pp(v) { return netRev ? spnlPct_(v / netRev) : ''; }
  return {
    kpis: [
      { bar: '#404935',      lbl: 'Net Revenue',     val: spnlMoney_(netRev), dCls: 'df', d: 'Account Tracker', s: label },
      { bar: 'var(--green)', lbl: 'Gross Profit',    val: spnlMoney_(gp),     dCls: 'df', d: pp(gp) + ' margin', s: 'after COGS' },
      { bar: 'var(--blue)',  lbl: 'Google Ad Spend', val: spnlMoney_(gAds),   dCls: 'df', d: 'Newnique',        s: '' },
      { bar: 'var(--amber)', lbl: 'Net Profit',      val: spnlMoney_(netProfit), dCls: netProfit < 0 ? 'dd' : 'du', d: 'pre-allocation', s: '' }
    ],
    rows: [
      { kind: 'header', label: 'Revenue' },
      { kind: 'sub', label: 'Net Revenue', note: 'net of discounts & returns', val: spnlMoney_(netRev), pct: netRev ? '100%' : '' },
      { kind: 'header', label: 'Cost of Sales' },
      { label: 'COGS', note: 'Account Tracker', val: spnlParen_(cogs), pct: pp(cogs) },
      { kind: 'sub', label: 'Gross Profit', val: spnlMoney_(gp), pct: pp(gp) },
      { kind: 'header', label: 'Operating Expenses' },
      { label: 'Advertising — Google Ads', note: 'Newnique Google Ads · Account Tracker', val: spnlParen_(gAds), pct: pp(gAds) },
      { label: 'Shared costs (fulfilment, fees, subs)', note: 'tracked combined under Contours Rx', val: 'n/a', muted: true },
      { kind: 'total', label: 'Net Profit', note: 'before shared-cost allocation', val: spnlMoney_(netProfit), pct: pp(netProfit) }
    ]
  };
}
