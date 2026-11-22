// Warehouse generator: period windows, ad-source switch, figures and the data.js block. Made-up data only.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'), path = require('path'), os = require('os');
const { buildOverlay, mergeDays, windows } = require('../build');
const { stripBlock, blockFor, loadData } = require('../run');

const cfg = { symbol: '£', periods: ['may', '3m', '12m', 'mtd'], markets: [{ key: 'uk', profileId: 'x' }] };
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
function makeDays(from, to, perDay) { const out = []; for (let d = from; d <= to; d = addDays(d, 1)) out.push({ date: d, ...perDay(d) }); return out; }

// Every day: £100 revenue, 4 units, 3 orders. MerchantSpring ad figures £10 spend / £20 sales; Ads API from 1 Oct with £30 / £45 (SP 2/3, SB 1/3).
const days = makeDays('2025-08-01', '2026-11-20', () => ({ sales: 100, orders: 3, units: 4, ms_ad_spend: 10, ms_ad_sales: 20 }));
const ads = makeDays('2026-10-01', '2026-11-20', () => ({})).flatMap((d) => [
  { date: d.date, ad_type: 'SP', spend: 20, sales: 30 }, { date: d.date, ad_type: 'SB', spend: 10, sales: 15 }]);
const existing = { dateRanges: { may: { tacosS: 'Target <15%', mktRows: [['Amazon UK', 'gb', '—', '£1', 'bb', 'No budget set', '£1', 'br', '1%']] } } };

test('windows: last month, 3 and 12 months, month to date with a like-for-like comparison', () => {
  const { W, P } = windows('2026-11-20');
  assert.deepEqual([W.may.from, W.may.to, W.may.label], ['2026-10-01', '2026-10-31', 'October 2026']);
  assert.deepEqual([W['3m'].from, W['12m'].from], ['2026-08-01', '2025-11-01']);
  assert.deepEqual([W.mtd.from, W.mtd.to, P.mtd.from, P.mtd.to], ['2026-11-01', '2026-11-20', '2026-10-01', '2026-10-20']);
  assert.deepEqual([P.may.from, P.may.to], ['2026-09-01', '2026-09-30']);
  const first = windows('2026-11-30'); // data to the last day of a month: that month is "Last Month"
  assert.equal(first.W.may.label, 'November 2026');
  assert.match(first.W.mtd.label, /no days yet/);
});

test('ad source: MerchantSpring before the Ads API start, Ads API from it (never both)', () => {
  const rows = mergeDays(days, ads, '2026-10-01');
  const sep = rows.find((r) => r.date === '2026-09-30'), oct = rows.find((r) => r.date === '2026-10-01');
  assert.deepEqual([sep.adSpend, sep.adSales, sep.apiAds], [10, 20, false]);
  assert.deepEqual([oct.adSpend, oct.adSales, oct.apiAds], [30, 45, true]);
});

test('figures: October from the Ads API, comparisons against September (MerchantSpring ads)', () => {
  const o = buildOverlay({ cfg, existing, days, ads, adsStart: '2026-10-01' });
  const m = o.dateRanges.may;
  assert.equal(o.asOf, '2026-11-20');
  assert.deepEqual([m.rev, m.spend, m.adSales, m.tacos, m.roas, m.aov], ['£3,100', '£930', '£1,395', '30.0%', '1.50×', '£25.00']);
  assert.equal(m.revD, '▲ 3.3% vs Sep'); // 31 days vs 30
  assert.equal(m.spendC, 'dd'); // spend up = red
  assert.equal(m.tacosD, '▲ 20.0pp vs Sep (10.0%)');
  assert.equal(m.tacosS, 'Target <15%');
  assert.deepEqual(m.mktRows[0], ['Amazon UK', 'gb', '—', '£930', 'bb', 'No budget set', '£3,100', 'br', '30.0%']);
  assert.deepEqual(m.campaignMix.slices.map((s) => [s.name, s.pct, s.acos]), [['Sponsored Products', 66.7, '66.7%'], ['Sponsored Brands', 33.3, '66.7%']]);
  // Last Month: one point per day, labelled every 5 days plus first and last
  assert.equal(m.revChart.grain, 'day');
  assert.equal(m.revChart.xLabels.length, 31);
  assert.deepEqual(m.revChart.xLabels.filter(Boolean), ['1 Oct', '6 Oct', '11 Oct', '16 Oct', '21 Oct', '26 Oct', '31 Oct']);
  assert.deepEqual([m.revChart.series[0].values[0], m.revChart.series[1].values[0]], [100, 30]);
  assert.equal(m.revChart.series[0].dots, false);
  const q = o.dateRanges['3m'].revChart; // weekly, Monday weeks cut to the window
  assert.equal(q.grain, 'week');
  assert.equal(q.series[0].values.reduce((a, b) => a + b, 0), 9200);
  assert.equal(q.series[0].values.length, 13); // 92 days: 13 weeks, the 1-day remainder joins the last week
  assert.equal(q.series[0].values[0], 700);
  assert.equal(q.subtitle, 'Weekly revenue and ad spend · Aug–Oct 2026');
  assert.equal(m.revChart.subtitle, 'Daily revenue and ad spend · Oct 2026');
  assert.equal(o.dateRanges['12m'].revChart.subtitle, 'Monthly revenue and ad spend · 12 months');
  assert.equal(o.dateRanges['12m'].revChart.xLabels.length, 12);
  assert.equal(o.dateRanges.mtd.revChart.xLabels.length, 20);
});

test('3 and 12 months: totals across both ad sources; pie kept when the period starts before the Ads API', () => {
  const o = buildOverlay({ cfg, existing, days, ads, adsStart: '2026-10-01' });
  const q = o.dateRanges['3m'];
  assert.equal(q.rev, '£9,200');
  assert.equal(q.spend, '£1,540'); // Aug + Sep MerchantSpring £10/day (61 days = £610) + Oct Ads API £30/day (31 days = £930)
  assert.equal(q.spendS, 'Aug £310 · Sep £300 · Oct £930');
  assert.equal(q.campaignMix, undefined);
  assert.equal(o.dateRanges['12m'].revChart.xLabels.length, 12);
  assert.equal(o.dateRanges.mtd.rev, '£2,000');
  assert.equal(o.dateRanges.mtd.revD, '▲ 0.0% vs 1–20 Oct');
  assert.match(o.dateRanges.mtd.roasS, /still settling/);
  assert.equal(o.dateRanges.mtd.sectionFallback, 'may');
  assert.equal(o.dateRanges.may.sectionFallback, undefined);
  const mt = Object.fromEntries(o.dateRanges.mtd.sec.advertising.metrics.map((x) => [x.lbl, x.val]));
  assert.deepEqual([mt['Total Spend'], mt['Ad Sales']], ['£600', '£900']);
  assert.doesNotMatch(o.dateRanges.may.roasS, /settling/);
});

test('data.js block: replaces only the warehouse block, keeps the hand-baked file and the PREV-MONTH block', () => {
  const real = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'clients', 'balance8', 'data.js'), 'utf8');
  const o = buildOverlay({ cfg, existing, days, ads, adsStart: '2026-10-01' });
  const once = stripBlock(real).replace(/\s*$/, '\n') + blockFor(o);
  const twice = stripBlock(once).replace(/\s*$/, '\n') + blockFor(o);
  assert.equal(stripBlock(twice), stripBlock(real).replace(/\s*$/, '\n'), 'idempotent: one block only');
  assert.ok(twice.includes('PREV-MONTH-START'));
  const f = path.join(os.tmpdir(), 'wh-test-data.js');
  fs.writeFileSync(f, twice);
  global.window = {}; require(f);
  const D = global.window.DASHBOARD_DATA;
  assert.equal(D.dateRanges.may.rev, '£3,100');
  assert.equal(D.dateRanges.mtd.label, 'Month to date (1–20 Nov 2026)');
  assert.ok(D.sections.products && D.sections.overview, 'hand-baked sections untouched');
  assert.equal(D.warehouse.asOf, '2026-11-20');
});

test('loadData leaves no global window behind (Google auth treats one as a browser)', () => {
  const D = loadData(path.join(__dirname, '..', '..', '..', 'clients', 'balance8', 'data.js'));
  assert.ok(D && D.dateRanges);
  assert.equal(typeof global.window, 'undefined');
});
