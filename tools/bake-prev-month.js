#!/usr/bin/env node
/* Bakes the PREVIOUS month's Products rows into clients/<client>/data.js so the Products tables can show
   month-on-month ▲/▼ arrows (app.js: renderProdTable / renderProdGroups). Idempotent: replaces the block between
   the PREV-MONTH markers, or appends it.

   Usage:  node tools/bake-prev-month.js <client> <path-to-previous-month-data.js>
   e.g.    git show <rebake-commit>^:clients/nkv/data.js > /tmp/nkv-prev.js
           node tools/bake-prev-month.js nkv /tmp/nkv-prev.js

   Run it in the SAME commit as a monthly rebake, with the data.js from just BEFORE the rebake as the previous
   month. Reads sections.products.tableByPeriod.may and groupsByPeriod.may (the Last Month slot). */
var fs = require('fs'), path = require('path');
var client = process.argv[2], prevFile = process.argv[3];
if (!client || !prevFile) { console.error('usage: node tools/bake-prev-month.js <client> <prev-data.js>'); process.exit(1); }
function load(f) { global.window = {}; delete require.cache[require.resolve(path.resolve(f))]; require(path.resolve(f)); return global.window.DASHBOARD_DATA; }
var target = path.join(__dirname, '..', 'clients', client, 'data.js');
var prev = load(prevFile), P = (prev.sections || {}).products || {};
var table = (P.tableByPeriod && P.tableByPeriod.may) || P.table || [];
var gm = (P.groupsByPeriod && P.groupsByPeriod.may) || null;
var groups = {};
if (gm) { if (Array.isArray(gm)) groups.all = gm; else Object.keys(gm).forEach(function (k) { groups[k] = gm[k]; }); }
else if (P.groups) groups.all = P.groups;
var slim = function (r) { var o = {}; Object.keys(r).forEach(function (k) { if (typeof r[k] !== 'object') o[k] = r[k]; }); return o; };
var out = { table: table.map(slim), groups: {} };
Object.keys(groups).forEach(function (k) { out.groups[k] = (groups[k] || []).map(slim); });
var label = (prev.dateRanges && prev.dateRanges.may && prev.dateRanges.may.label) || 'previous month';
var block = '\n/* PREV-MONTH-START — month-on-month comparison rows for the Products tables (' + label + '); see tools/bake-prev-month.js */\n' +
  '(function () { var P = window.DASHBOARD_DATA && window.DASHBOARD_DATA.sections && window.DASHBOARD_DATA.sections.products;\n' +
  '  if (P) P.prevMonth = ' + JSON.stringify(out) + '; })();\n/* PREV-MONTH-END */\n';
var t = fs.readFileSync(target, 'utf8');
var a = t.indexOf('\n/* PREV-MONTH-START'), b = t.indexOf('/* PREV-MONTH-END */');
if (a >= 0 && b > a) t = t.slice(0, a) + t.slice(b + '/* PREV-MONTH-END */\n'.length);
t = t.replace(/\s*$/, '\n') + block;
fs.writeFileSync(target, t);
console.log(client + ': baked prevMonth (' + label + '): ' + out.table.length + ' table rows; groups ' + Object.keys(out.groups).map(function (k) { return k + '=' + out.groups[k].length; }).join(' '));
