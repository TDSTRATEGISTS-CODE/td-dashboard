// Reads one client's daily facts from the TDS Data Warehouse (BigQuery tds-amazon-ads.amazon_ads). Read-only:
// SELECT queries only, run as the dashboard-reader service account (GitHub Actions, keyless).
'use strict';

const PROJECT = 'tds-amazon-ads', DATASET = 'amazon_ads', LOCATION = 'europe-west2';
const t = (name) => '`' + PROJECT + '.' + DATASET + '.' + name + '`';

const SQL = {
  days: `SELECT FORMAT_DATE('%F', date) AS date, SUM(sales) AS sales, SUM(orders) AS orders, SUM(units) AS units, SUM(sessions) AS sessions,
      SUM(ad_spend) AS ms_ad_spend, SUM(ad_sales) AS ms_ad_sales, SUM(ad_impressions) AS ms_ad_impressions, SUM(ad_clicks) AS ms_ad_clicks
    FROM ${t('account_sales_daily')} WHERE profile_id IN UNNEST(@profiles) AND date BETWEEN @from AND @to
    GROUP BY date ORDER BY date`,
  ads: `SELECT FORMAT_DATE('%F', date) AS date, 'SP' AS ad_type, SUM(cost) AS spend, SUM(sales_14d) AS sales,
      SUM(impressions) AS impressions, SUM(clicks) AS clicks
      FROM ${t('sp_campaign_daily')} WHERE profile_id IN UNNEST(@profiles) AND date BETWEEN @from AND @to GROUP BY date
    UNION ALL
    SELECT FORMAT_DATE('%F', date), 'SB', SUM(cost), SUM(sales_14d), SUM(impressions), SUM(clicks)
      FROM ${t('sb_campaign_daily')} WHERE profile_id IN UNNEST(@profiles) AND date BETWEEN @from AND @to GROUP BY date`,
  asinDaily: `SELECT FORMAT_DATE('%F', date) AS date, asin, SUM(total_sales) AS sales, SUM(units) AS units
    FROM ${t('total_sales_daily')} WHERE profile_id IN UNNEST(@profiles) AND date BETWEEN @from AND @to GROUP BY 1, 2`,
  asinMonthly: `SELECT FORMAT_DATE('%Y-%m', month) AS ym, asin, SUM(total_sales) AS sales, SUM(units) AS units
    FROM ${t('asin_sales_monthly')} WHERE profile_id IN UNNEST(@profiles) AND month BETWEEN DATE_TRUNC(@from, MONTH) AND @to GROUP BY 1, 2`,
  asinAds: `SELECT FORMAT_DATE('%F', date) AS date, advertised_asin AS asin, SUM(cost) AS spend
    FROM ${t('sp_advertised_product_daily')} WHERE profile_id IN UNNEST(@profiles) AND date BETWEEN @from AND @to GROUP BY 1, 2`,
  campaigns: `SELECT FORMAT_DATE('%F', date) AS date, 'SP' AS ad_type, campaign_id, ANY_VALUE(campaign_name) AS name,
      ANY_VALUE(campaign_status) AS status, SUM(cost) AS spend, SUM(sales_14d) AS sales, SUM(clicks) AS clicks
      FROM ${t('sp_campaign_daily')} WHERE profile_id IN UNNEST(@profiles) AND date BETWEEN @from AND @to GROUP BY 1, 2, 3
    UNION ALL
    SELECT FORMAT_DATE('%F', date), 'SB', campaign_id, ANY_VALUE(campaign_name), ANY_VALUE(campaign_status), SUM(cost), SUM(sales_14d), SUM(clicks)
      FROM ${t('sb_campaign_daily')} WHERE profile_id IN UNNEST(@profiles) AND date BETWEEN @from AND @to GROUP BY 1, 2, 3`,
  names: `SELECT asin, ARRAY_AGG(COALESCE(short_title, title, asin) ORDER BY date DESC LIMIT 1)[OFFSET(0)] AS name
    FROM ${t('product_catalog_daily')} WHERE profile_id IN UNNEST(@profiles) GROUP BY asin`,
  adsStart: `SELECT FORMAT_DATE('%F', MIN(date)) AS first FROM ${t('sp_campaign_daily')} WHERE profile_id IN UNNEST(@profiles)`,
};

async function fetchFacts(cfg, from, to, bq) {
  if (cfg.markets.length !== 1) throw new Error('v1 builds single-market clients only (Balance 8 pilot)');
  const profiles = cfg.markets.map((m) => m.profileId);
  const run = async (query) => (await bq.query({ query, params: { profiles, from, to }, location: LOCATION }))[0];
  const [days, ads, start, asinDaily, asinMonthly, asinAds, campaigns, names] = await Promise.all(
    [SQL.days, SQL.ads, SQL.adsStart, SQL.asinDaily, SQL.asinMonthly, SQL.asinAds, SQL.campaigns, SQL.names].map(run));
  const plain = (rows) => rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v && typeof v === 'object' && 'value' in v ? v.value : v])));
  return {
    days: plain(days), ads: plain(ads), adsStart: (start[0] && start[0].first) || null,
    asinDaily: plain(asinDaily), asinMonthly: plain(asinMonthly), asinAds: plain(asinAds), campaigns: plain(campaigns),
    names: Object.fromEntries(plain(names).map((r) => [r.asin, r.name])),
  };
}

module.exports = { fetchFacts, SQL };
