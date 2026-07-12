/**
 * Abimax Dashboard — Data Proxy (Google Apps Script Web App)
 * ----------------------------------------------------------
 * Reads the Abimax project tracker and serves ONLY the sheet-controlled Overview scope board as
 * JSON, shaped like the dashboard's `sections` object:
 *     sections.overview.tasksSpec     ← Project Scope board, "Upcoming" column
 *     sections.overview.flagsSpec     ← Project Scope board, "In Progress" column
 *                                       (+ a "Flags & Warnings" column shown red, IF one is ever added)
 *     sections.overview.completedSpec ← Project Scope board, "Completed" column
 *
 * Abimax is Amazon-only with no D2C/Shopify and no supplier-PO forecast, so — unlike the NKV proxy —
 * this serves ONLY the scope board. Everything else (dateRanges + the MerchantSpring-baked pnl /
 * products / advertising / inventory sections) stays baked in clients/abimax/data.js. The client is
 * configured overlay:'sections', so app.js merges ONLY the keys returned here and never touches the rest.
 *
 * SETUP (must be a NATIVE Google Sheet — this repo copy does nothing until deployed):
 *   1. Open the Abimax tracker in Drive. If it's an uploaded .xlsx, File ▸ Save as Google Sheets.
 *   2. Confirm CONFIG.SPREADSHEET_ID below matches the sheet's URL id (or blank to bind to the
 *      container sheet when the script is created from Extensions ▸ Apps Script inside it).
 *   3. Extensions ▸ Apps Script ▸ paste this file ▸ Deploy ▸ New deployment ▸ Web app
 *        Execute as: Me   ·   Who has access: Anyone
 *   4. Copy the /exec URL into clients/abimax/config.js dataSource.url and set type:'appsScript'
 *      (overlay:'sections'), then bump APP_VER in index.html.
 *
 * Robustness: the board is located by MARKER text and its columns by HEADER text
 * ("In Progress" / "Upcoming" / "Completed"), NOT fixed coordinates — inserting rows/columns won't
 * break it. Returns {} sections on any error, so app.js keeps the baked data.js fallback.
 */

// ============================ CONFIG ============================

var CONFIG = {
  // The NATIVE Google Sheet copy of the Abimax project tracker. Leave blank to bind to the container
  // sheet (if this script is created from Extensions ▸ Apps Script inside that sheet).
  SPREADSHEET_ID: '1Fg_ZKND-7OWqipOkhOtXUA1y4w019280IuXD0slK0GY',

  // Scope-board column headers → which dashboard card each feeds. 'flags' is optional: the Abimax
  // board has no "Flags & Warnings" column today, so that card simply won't appear — add the column
  // with this exact header to light it up (shown red, above In Progress).
  SCOPE_HEADERS: { inProgress: 'In Progress', upcoming: 'Upcoming', flags: 'Flags & Warnings' },

  // The Completed column → Overview "Completed" card. Matched case-insensitively, so the header may
  // read "Completed", "Complete" or "Done".
  COMPLETED_ALIASES: ['completed', 'complete', 'done'],

  // A tab is treated as the scope board only if it contains one of these markers (first 40 rows).
  SCOPE_MARKERS: ['project focus', 'onboarding tasks', 'requested activity'],

  // Rows/labels to ignore in the scope columns (headers / section titles, lower-cased + trimmed).
  SKIP: ['', 'status', 'ongoing', 'in progress', 'upcoming', 'completed', 'complete', 'done',
    'project focus', 'onboarding tasks', 'requested activity']
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

// ============================ BUILD sections ============================

function buildSections() {
  var book = CONFIG.SPREADSHEET_ID
    ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  var sheets = book.getSheets();

  var scope = null;
  sheets.forEach(function (sh) {
    if (!scope) scope = scanScopeBoard_(sh.getDataRange().getValues());
  });

  var sections = { overview: {} };
  if (scope) {
    if (scope.upcoming.length) {
      sections.overview.tasksSpec = {
        badge: 'Project scope',
        items: scope.upcoming.map(function (t) { return { text: t, sub: 'Upcoming', active: false }; })
      };
    }
    // "In Progress" card — fed by the In Progress column; a populated "Flags & Warnings" column takes
    // priority (genuine warnings) and is shown red above the amber in-progress items.
    var flagItems = [];
    scope.flags.forEach(function (t) { flagItems.push({ level: 'red', title: t, sub: 'Flag' }); });
    scope.inProgress.forEach(function (t) { flagItems.push({ level: 'amber', title: t, sub: 'In progress' }); });
    if (flagItems.length) {
      var n = scope.inProgress.length;
      sections.overview.flagsSpec = { badge: (n ? n + ' in progress' : flagItems.length + ' flagged'), items: flagItems.slice(0, 6) };
    }
    // Completed card (green). app.js hides the card + reflows the Overview grid when this is absent,
    // so it only appears once the Completed column is populated.
    if (scope.completed && scope.completed.length) {
      var done = scope.completedTotal || scope.completed.length;
      sections.overview.completedSpec = {
        badge: done + ' completed',
        items: scope.completed.map(function (t) { return { text: t, sub: 'Completed' }; })
      };
    }
  }
  return sections;
}

// ============================ SCOPE BOARD ============================

/** Locate the scope board and return { upcoming, inProgress, flags, completed } by column header. */
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

  // Order matters for de-dupe across active columns: flags first, then in-progress, then upcoming.
  var flags = collect(cols.flags);
  var inProgress = collect(cols.inProgress);
  var upcoming = collect(cols.upcoming);
  // Completed is a separate stage — its own de-dupe so a done item isn't suppressed by an identical
  // (transient) entry still sitting in an active column.
  var completed = collect(cols.completed, {});
  return {
    upcoming: upcoming.slice(0, 6), inProgress: inProgress.slice(0, 6), flags: flags.slice(0, 6),
    completed: completed.slice(0, 6), completedTotal: completed.length
  };
}

// ============================ HELPERS ============================

/** Lower-cased, trimmed string of a cell (for label matching). */
function norm_(v) { return String(v == null ? '' : v).trim().toLowerCase(); }
