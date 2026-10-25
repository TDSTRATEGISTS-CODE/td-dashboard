// Sponsored Products v3 async reports: definitions, create → poll → download, and row mapping
// to the BigQuery tables in amazon_ads. One definition drives both the request and the table schema.
import { gunzipSync } from 'node:zlib';
import { adsRequest, parseAdsJson } from './ads.js';

const REPORT_MEDIA = 'application/vnd.createasyncreportrequest.v3+json';

// [Amazon column, BigQuery column, BigQuery type]
const METRICS = [
  ['impressions', 'impressions', 'INT64'],
  ['clicks', 'clicks', 'INT64'],
  ['cost', 'cost', 'NUMERIC'],
  ['purchases7d', 'purchases_7d', 'INT64'],
  ['purchases14d', 'purchases_14d', 'INT64'],
  ['sales7d', 'sales_7d', 'NUMERIC'],
  ['sales14d', 'sales_14d', 'NUMERIC'],
  ['unitsSoldClicks7d', 'units_sold_7d', 'INT64'],
  ['unitsSoldClicks14d', 'units_sold_14d', 'INT64'],
];

const CAMPAIGN = [
  ['campaignId', 'campaign_id', 'STRING'],
  ['campaignName', 'campaign_name', 'STRING'],
];
const AD_GROUP = [
  ['adGroupId', 'ad_group_id', 'STRING'],
  ['adGroupName', 'ad_group_name', 'STRING'],
];

export const REPORTS = {
  sp_campaigns: {
    reportTypeId: 'spCampaigns',
    groupBy: ['campaign'],
    table: 'sp_campaign_daily',
    retentionDays: 95,
    dims: [...CAMPAIGN,
      ['campaignStatus', 'campaign_status', 'STRING'],
      ['campaignBudgetAmount', 'campaign_budget_amount', 'NUMERIC']],
  },
  sp_targeting: {
    reportTypeId: 'spTargeting',
    groupBy: ['targeting'],
    table: 'sp_targeting_daily',
    retentionDays: 95,
    dims: [...CAMPAIGN, ...AD_GROUP,
      ['keywordId', 'keyword_id', 'STRING'],
      ['keyword', 'keyword', 'STRING'],
      ['matchType', 'match_type', 'STRING'],
      ['keywordType', 'keyword_type', 'STRING'],
      ['targeting', 'targeting', 'STRING'],
      ['keywordBid', 'keyword_bid', 'NUMERIC']],
  },
  sp_search_term: {
    reportTypeId: 'spSearchTerm',
    groupBy: ['searchTerm'],
    table: 'sp_search_term_daily',
    retentionDays: 95,
    dims: [...CAMPAIGN, ...AD_GROUP,
      ['keywordId', 'keyword_id', 'STRING'],
      ['keyword', 'keyword', 'STRING'],
      ['matchType', 'match_type', 'STRING'],
      ['targeting', 'targeting', 'STRING'],
      ['searchTerm', 'search_term', 'STRING']],
  },
  sp_advertised_product: {
    reportTypeId: 'spAdvertisedProduct',
    groupBy: ['advertiser'],
    table: 'sp_advertised_product_daily',
    retentionDays: 95,
    dims: [...CAMPAIGN, ...AD_GROUP,
      ['adId', 'ad_id', 'STRING'],
      ['advertisedAsin', 'advertised_asin', 'STRING'],
      ['advertisedSku', 'advertised_sku', 'STRING']],
  },
};

export const MAX_RANGE_DAYS = 31;

export function reportDef(type) {
  const def = REPORTS[type];
  if (!def) throw new Error(`Unknown report type ${type}. Use one of: ${Object.keys(REPORTS).join(', ')}`);
  return def;
}

export function tableSchema(type) {
  const def = reportDef(type);
  return [
    { name: 'profile_id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'client', type: 'STRING' },
    { name: 'market', type: 'STRING' },
    { name: 'currency', type: 'STRING' },
    { name: 'date', type: 'DATE', mode: 'REQUIRED' },
    ...[...def.dims, ...METRICS].map(([, name, type]) => ({ name, type })),
    { name: 'pulled_at', type: 'TIMESTAMP' },
  ];
}

export function daysBetween(start, end) {
  return Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000) + 1;
}

export function validateRange(start, end) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) throw new Error('Dates must be YYYY-MM-DD');
  const n = daysBetween(start, end);
  if (n < 1) throw new Error('end_date is before start_date');
  if (n > MAX_RANGE_DAYS) throw new Error(`Amazon allows at most ${MAX_RANGE_DAYS} days per report (asked for ${n})`);
}

export function buildReportRequest(type, startDate, endDate, timeUnit = 'DAILY') {
  const def = reportDef(type);
  validateRange(startDate, endDate);
  const dateCols = timeUnit === 'DAILY' ? ['date'] : ['startDate', 'endDate'];
  return {
    name: `TDS ${type} ${startDate}..${endDate}`,
    startDate,
    endDate,
    configuration: {
      adProduct: 'SPONSORED_PRODUCTS',
      groupBy: def.groupBy,
      columns: [...dateCols, ...def.dims.map(([c]) => c), ...METRICS.map(([c]) => c)],
      reportTypeId: def.reportTypeId,
      timeUnit,
      format: 'GZIP_JSON',
    },
  };
}

export async function createReport(profileId, type, startDate, endDate, timeUnit = 'DAILY') {
  const body = buildReportRequest(type, startDate, endDate, timeUnit);
  try {
    const res = await adsRequest('POST', '/reporting/reports', { profileId, body, mediaType: REPORT_MEDIA });
    return res.reportId;
  } catch (e) {
    // 425 = an identical report is already being generated; reuse it.
    const dup = e.status === 425 && /([0-9a-f]{8}-[0-9a-f-]{27,})/i.exec(JSON.stringify(e.data || {}));
    if (dup) return dup[1];
    throw e;
  }
}

export async function getReportStatus(profileId, reportId) {
  return adsRequest('GET', `/reporting/reports/${reportId}`, { profileId });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function waitForReport(profileId, reportId, { timeoutMs = 90 * 60_000 } = {}) {
  const started = Date.now();
  let delay = 5_000;
  for (;;) {
    const s = await getReportStatus(profileId, reportId);
    if (s.status === 'COMPLETED') return s;
    if (s.status === 'FAILED' || s.status === 'FAILURE') throw new Error(`Report ${reportId} failed: ${s.failureReason || 'no reason given'}`);
    if (Date.now() - started > timeoutMs) throw new Error(`Report ${reportId} not ready after ${Math.round(timeoutMs / 60000)} min`);
    await sleep(delay);
    delay = Math.min(delay * 1.5, 60_000);
  }
}

export async function downloadReport(url) {
  const res = await fetch(url); // pre-signed S3 URL: no Amazon credentials sent
  if (!res.ok) throw new Error(`Report download failed: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const text = (buf[0] === 0x1f && buf[1] === 0x8b ? gunzipSync(buf) : buf).toString('utf8');
  return parseAdsJson(text || '[]');
}

const toNumeric = (v) => (v === null || v === undefined || v === '' ? null : String(Math.round(Number(v) * 1e6) / 1e6));
const toInt = (v) => (v === null || v === undefined || v === '' ? null : Math.round(Number(v)));

export function mapRow(type, row, { profileId, client, market, currency, pulledAt }) {
  const def = reportDef(type);
  const out = { profile_id: String(profileId), client, market, currency, date: row.date, pulled_at: pulledAt };
  for (const [src, dst, t] of [...def.dims, ...METRICS]) {
    const v = row[src];
    out[dst] = t === 'NUMERIC' ? toNumeric(v) : t === 'INT64' ? toInt(v) : v === undefined || v === null ? null : String(v);
  }
  return out;
}

export function summarise(rows) {
  const t = { rows: rows.length, impressions: 0, clicks: 0, cost: 0, sales_7d: 0, sales_14d: 0, purchases_7d: 0, purchases_14d: 0 };
  for (const r of rows) {
    t.impressions += Number(r.impressions || 0);
    t.clicks += Number(r.clicks || 0);
    t.cost += Number(r.cost || 0);
    t.sales_7d += Number(r.sales7d || 0);
    t.sales_14d += Number(r.sales14d || 0);
    t.purchases_7d += Number(r.purchases7d || 0);
    t.purchases_14d += Number(r.purchases14d || 0);
  }
  for (const k of ['cost', 'sales_7d', 'sales_14d']) t[k] = Math.round(t[k] * 100) / 100;
  return t;
}
