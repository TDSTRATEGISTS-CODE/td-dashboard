// Which clients the warehouse generator builds, and from which TDS Data Warehouse accounts (BigQuery tds-amazon-ads.amazon_ads).
// Profile IDs are the Amazon Ads profile IDs used as account keys in the warehouse (xecutive-ads src/config.js allowlist).
// A client is only built when it is listed here; everything else in td-dashboard is untouched.
'use strict';

module.exports = {
  balance8: {
    currency: 'GBP', symbol: '£', timezone: 'Europe/London',
    // One market: the market row label and flag are taken from the existing data.js, only the numbers change.
    markets: [{ key: 'uk', profileId: '783989167267519' }],
    periods: ['mtd', 'may', '3m', '12m'],
    live: true, // built and committed daily (Ryan, 22 Nov 2026)
  },
  abimax: {
    currency: 'USD', symbol: '$', timezone: 'America/Los_Angeles',
    markets: [{ key: 'all', profileId: '4302554244642336' }],
    periods: ['mtd', 'may', '3m', '6m'],
    launch: '2026-03', // "Since Launch" (6m key) starts with the first sale, March 2026
    live: false, // dry runs only until Ryan signs off the comparison
  },
};
