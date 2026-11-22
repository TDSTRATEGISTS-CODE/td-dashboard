// Which clients the warehouse generator builds, and from which TDS Data Warehouse accounts (BigQuery tds-amazon-ads.amazon_ads).
// Profile IDs are the Amazon Ads profile IDs used as account keys in the warehouse (xecutive-ads src/config.js allowlist).
// A client is only built when it is listed here; everything else in td-dashboard is untouched.
'use strict';

module.exports = {
  balance8: {
    currency: 'GBP', symbol: '£', timezone: 'Europe/London',
    // One market: the market row label and flag are taken from the existing data.js, only the numbers change.
    markets: [{ key: 'uk', profileId: '783989167267519' }],
    periods: ['may', '3m', '12m', 'mtd'],
  },
};
