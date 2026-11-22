#!/usr/bin/env node
/* Warehouse generator (Notion: "Digital Dashboard Live Data — Data Warehouse — Project Plan").
   Rebuilds the number fields of clients/<client>/data.js (dateRanges.may / 3m / 12m / mtd) from the TDS Data Warehouse
   and writes them as one block between WAREHOUSE-START/END markers at the end of the file. The hand-baked file above
   the block is not changed: commentary, P&L, products, stock and the weekly Notion overview cards stay as they are.
   Remove the block to fall back to the hand-baked numbers.

   Usage:  node tools/warehouse/run.js <client> [--dry-run]
     --dry-run  read the warehouse and print hand-baked vs warehouse figures per period; write nothing.
   Without --dry-run it writes data.js and bumps APP_VER in index.html (CLAUDE.md rule). */
'use strict';
const fs = require('fs'), path = require('path');
const { buildOverlay } = require('./build');
const { fetchFacts } = require('./fetch');
const CLIENTS = require('./clients');

const ROOT = path.join(__dirname, '..', '..');
const START = '/* WAREHOUSE-START', END = '/* WAREHOUSE-END */';

// data.js assigns window.DASHBOARD_DATA, so a stand-in window is set while it loads and removed straight after:
// Google's auth library treats any global `window` as a browser and then fails ("fetchImpl is not a function").
function loadData(file) {
  global.window = {};
  try {
    delete require.cache[require.resolve(file)];
    require(file);
    return global.window.DASHBOARD_DATA;
  } finally {
    delete global.window;
  }
}
function stripBlock(text) {
  const a = text.indexOf('\n' + START), b = text.indexOf(END);
  return a >= 0 && b > a ? text.slice(0, a) + text.slice(b + END.length + 1) : text;
}
function blockFor(overlay) {
  const meta = { asOf: overlay.asOf, adsApiFrom: overlay.adsStart, builtAt: new Date().toISOString(), source: 'TDS Data Warehouse (BigQuery amazon_ads)' };
  return '\n' + START + ' — numbers from the TDS Data Warehouse, data to ' + overlay.asOf + '; see tools/warehouse/run.js */\n' +
    '(function () { var D = window.DASHBOARD_DATA; if (!D || !D.dateRanges) return;\n' +
    '  var O = ' + JSON.stringify(overlay.dateRanges) + ';\n' +
    '  Object.keys(O).forEach(function (k) { D.dateRanges[k] = Object.assign(D.dateRanges[k] || {}, O[k]); });\n' +
    '  D.warehouse = ' + JSON.stringify(meta) + '; })();\n' + END + '\n';
}
const n = (s) => (typeof s === 'string' ? Number(s.replace(/[^0-9.\-]/g, '')) : NaN);
function compare(oldD, overlay) {
  const lines = [];
  for (const [k, v] of Object.entries(overlay.dateRanges)) {
    const o = (oldD.dateRanges || {})[k];
    lines.push(`\n${k} · ${v.label} (data to ${v.dataTo})`);
    for (const f of ['rev', 'spend', 'adSales', 'tacos', 'roas', 'aov']) {
      const a = o ? o[f] : undefined, b = v[f];
      const diff = a !== undefined && n(a) ? ((n(b) - n(a)) / n(a)) * 100 : null;
      lines.push(`  ${f.padEnd(8)} hand-baked ${String(a ?? '—').padEnd(10)} warehouse ${String(b).padEnd(10)} ${diff === null ? '' : (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%'}${diff !== null && Math.abs(diff) > 1 ? '  ⚠ over 1%' : ''}`);
    }
  }
  return lines.join('\n');
}

async function main() {
  const client = process.argv[2], dry = process.argv.includes('--dry-run');
  const cfg = CLIENTS[client];
  if (!cfg) throw new Error(`Unknown client "${client}". Known: ${Object.keys(CLIENTS).join(', ')}`);
  const file = path.join(ROOT, 'clients', client, 'data.js');
  const text = fs.readFileSync(file, 'utf8');
  const tmp = path.join(require('os').tmpdir(), `wh-${client}-base.js`);
  fs.writeFileSync(tmp, stripBlock(text));
  const base = loadData(tmp);

  const { BigQuery } = require('@google-cloud/bigquery');
  const today = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 15, 1)).toISOString().slice(0, 10);
  const facts = await fetchFacts(cfg, from, today, new BigQuery({ projectId: 'tds-amazon-ads' }));
  const overlay = buildOverlay({ cfg, existing: base, ...facts });

  console.log(`${client}: ${facts.days.length} days (${facts.days[0]?.date}..${overlay.asOf}), Ads API from ${facts.adsStart || 'n/a'}`);
  console.log(compare(base, overlay));
  if (dry) { console.log('\n--dry-run: nothing written'); return; }

  fs.writeFileSync(file, stripBlock(text).replace(/\s*$/, '\n') + blockFor(overlay));
  const idx = path.join(ROOT, 'index.html');
  const ver = new Date().toISOString().slice(0, 16).replace('T', '.').replace(':', '');
  fs.writeFileSync(idx, fs.readFileSync(idx, 'utf8').replace(/var APP_VER = '[^']*';/, `var APP_VER = '${ver}';`));
  console.log(`\nWrote clients/${client}/data.js (data to ${overlay.asOf}); APP_VER ${ver}`);
}

if (require.main === module) main().catch((e) => { console.error(e.message); process.exit(1); });
module.exports = { stripBlock, blockFor, compare, loadData };
