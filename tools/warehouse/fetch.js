// Reads one client's daily facts from the TDS Data Warehouse (BigQuery tds-amazon-ads.amazon_ads). Read-only:
// SELECT queries only, run as the dashboard-reader service account (GitHub Actions, keyless).
'use strict';

const PROJECT = 'tds-amazon-ads', DATASET = 'amazon_ads', LOCATION = 'europe-west2';
const t = (name) => '`' + PROJECT + '.' + DATASET + '.' + name + '`';

const SQL = {
  days: `SELECT FORMAT_DATE('%F', date) AS date, SUM(sales) AS sales, SUM(orders) AS orders, SUM(units) AS units,
      SUM(ad_spend) AS ms_ad_spend, SUM(ad_sales) AS ms_ad_sales
    FROM ${t('account_sales_daily')} WHERE profile_id IN UNNEST(@profiles) AND date BETWEEN @from AND @to
    GROUP BY date ORDER BY date`,
  ads: `SELECT FORMAT_DATE('%F', date) AS date, 'SP' AS ad_type, SUM(cost) AS spend, SUM(sales_14d) AS sales
      FROM ${t('sp_campaign_daily')} WHERE profile_id IN UNNEST(@profiles) AND date BETWEEN @from AND @to GROUP BY date
    UNION ALL
    SELECT FORMAT_DATE('%F', date), 'SB', SUM(cost), SUM(sales_14d)
      FROM ${t('sb_campaign_daily')} WHERE profile_id IN UNNEST(@profiles) AND date BETWEEN @from AND @to GROUP BY date`,
  adsStart: `SELECT FORMAT_DATE('%F', MIN(date)) AS first FROM ${t('sp_campaign_daily')} WHERE profile_id IN UNNEST(@profiles)`,
};

async function fetchFacts(cfg, from, to, bq) {
  if (cfg.markets.length !== 1) throw new Error('v1 builds single-market clients only (Balance 8 pilot)');
  const profiles = cfg.markets.map((m) => m.profileId);
  const run = async (query) => (await bq.query({ query, params: { profiles, from, to }, location: LOCATION }))[0];
  const [days, ads, start] = await Promise.all([run(SQL.days), run(SQL.ads), run(SQL.adsStart)]);
  const plain = (rows) => rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v && typeof v === 'object' && 'value' in v ? v.value : v])));
  return { days: plain(days), ads: plain(ads), adsStart: (start[0] && start[0].first) || null };
}

module.exports = { fetchFacts, SQL };
