// Period-keyed Products and campaigns sections. Made-up data only.
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { asinSales, buildSections } = require('../sections');
const { buildOverlay } = require('../build');

const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const range = (a, b) => { const o = []; for (let d = a; d <= b; d = addDays(d, 1)) o.push(d); return o; };

// Two products. Daily rows from 1 Oct; month-close rows for October (late refund: month total lower than the days).
const asinDaily = range('2026-09-01', '2026-11-19').flatMap((d) => [{ date: d, asin: 'B0TESTAAA1', sales: 20, units: 1 }, { date: d, asin: 'B0TESTBBB2', sales: 10, units: 1 }]);
const asinMonthly = [{ ym: '2026-10', asin: 'B0TESTAAA1', sales: 600, units: 30 }, { ym: '2026-10', asin: 'B0TESTBBB2', sales: 300, units: 30 }];

test('product sales: closed month from the month-close table, open month from daily rows', () => {
  const oct = asinSales({ from: '2026-10-01', to: '2026-10-31' }, asinDaily, asinMonthly);
  assert.deepEqual(oct.map((r) => [r.asin, r.sales]), [['B0TESTAAA1', 600], ['B0TESTBBB2', 300]]);
  const mtd = asinSales({ from: '2026-11-01', to: '2026-11-19' }, asinDaily, asinMonthly);
  assert.deepEqual(mtd.map((r) => [r.asin, r.sales, r.units]), [['B0TESTAAA1', 380, 19], ['B0TESTBBB2', 190, 19]]);
});

const days = range('2025-11-01', '2026-11-20').map((d) => ({ date: d, sales: 30, orders: 2, units: 2, sessions: 20, ms_ad_spend: 1, ms_ad_sales: 2 }));
const ads = range('2026-08-15', '2026-11-20').map((d) => ({ date: d, ad_type: 'SP', spend: 3, sales: 6 }));
const campaigns = range('2026-08-15', '2026-11-20').flatMap((d) => [
  { date: d, ad_type: 'SP', campaign_id: '1', name: 'BM Calm - SP - Manual - XCTD', status: d < '2026-11-10' ? 'ENABLED' : 'PAUSED', spend: 2, sales: 4, clicks: 1 },
  { date: d, ad_type: 'SB', campaign_id: '2', name: 'Brand - SB', status: 'ENABLED', spend: 1, sales: 0, clicks: 0 }]);
const asinAds = range('2026-08-15', '2026-11-20').map((d) => ({ date: d, asin: 'B0TESTAAA1', spend: 3 }));
const names = { B0TESTAAA1: 'Calm', B0TESTBBB2: 'Cognitive', B0TESTCCC3: 'Unsold' };
const existing = { dateRanges: { may: { tacosS: 'Target <15%', mktRows: [] } }, sections: { products: { tableByPeriod: { may: [{ name: 'United Kingdom', flag: 'gb' }] } } } };
const cfg = { symbol: '£', periods: ['mtd', 'may', '3m', '12m'], markets: [{ profileId: 'x' }] };

test('sections follow every period, Month to date included; products stop at the last product day', () => {
  const o = buildOverlay({ cfg, existing, days, ads, adsStart: '2026-08-15', asinDaily, asinMonthly, asinAds, campaigns, names });
  const P = o.sections.products, A = o.sections.advertising;
  assert.deepEqual(Object.keys(P.groupsByPeriod).sort(), ['12m', '3m', 'may', 'mtd']);
  assert.equal(o.productsTo, '2026-11-19');
  const mtd = P.groupsByPeriod.mtd.all;
  assert.deepEqual(mtd.map((r) => [r.name, r.sales, r.pct, r.adSpend]), [['Calm', '£380', '67%', '£57'], ['Cognitive', '£190', '33%', '£0']]);
  assert.equal(P.tableByPeriod.mtd[0].name, 'United Kingdom', 'label and flag kept from the baked row');
  assert.deepEqual([P.tableByPeriod.mtd[0].revenue, P.tableByPeriod.mtd[0].orders, P.tableByPeriod.mtd[0].cvr], ['£600', '40', '10.0%']);
  assert.equal(P.kpisByPeriod.mtd.all[0].s, '2 of 3 listed products sold');
  assert.deepEqual(P.groupsByPeriod.may.all.map((r) => r.sales), ['£600', '£300']);
});

test('campaigns: only for windows inside the Ads API history; latest status; XCTD suffix dropped', () => {
  const o = buildOverlay({ cfg, existing, days, ads, adsStart: '2026-08-15', asinDaily, asinMonthly, asinAds, campaigns, names });
  const A = o.sections.advertising;
  assert.ok(A.campaignsByPeriod.mtd && A.campaignsByPeriod.may);
  assert.equal(A.campaignsByPeriod['12m'], undefined, '12 months starts before the Ads API history: baked list kept');
  const c = A.campaignsByPeriod.mtd[0];
  assert.deepEqual([c.name, c.type, c.spend, c.status, c.acos, c.cpc], ['BM Calm - SP - Manual', 'Sponsored Products', '£40', 'Paused', '50.0%', '£2.00']);
  assert.equal(A.campaignsByPeriod.mtd[1].acos, '—');
  assert.deepEqual(o.sections.products.prevMonth.groups.all.map((r) => r.name), ['Calm', 'Cognitive']);
});

test('since launch: 6m window from the launch month', () => {
  const o = buildOverlay({ cfg: { ...cfg, periods: ['mtd', 'may', '3m', '6m'], launch: '2026-03' }, existing, days, ads, adsStart: '2026-08-15', asinDaily, asinMonthly, asinAds, campaigns, names });
  assert.equal(o.dateRanges['6m'].label, 'Since Launch · Mar–Oct 2026');
  assert.equal(o.dateRanges['6m'].revChart.xLabels.length, 8);
  assert.equal(o.dateRanges['6m'].revD, 'since-launch total');
});
