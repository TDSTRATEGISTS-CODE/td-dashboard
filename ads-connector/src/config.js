// Fixed settings for the TDS Amazon Ads connector (Build brief v1, Notion:
// "Ads API Migration — Perpetua Replacement — Project Plan"). Nothing here is a secret.

export const GCP_PROJECT = process.env.GCP_PROJECT || 'tds-amazon-ads';
export const DATASET = process.env.BQ_DATASET || 'amazon_ads';
export const BQ_LOCATION = 'europe-west2';

// Public base URL of the Cloud Run service, e.g. https://ads-connector-123456789.europe-west2.run.app
export const PUBLIC_URL = (process.env.PUBLIC_URL || 'http://localhost:8080').replace(/\/$/, '');
export const MCP_URL = `${PUBLIC_URL}/mcp`;

// Amazon Ads API, EU region.
export const ADS_API_BASE = 'https://advertising-api-eu.amazon.com';
export const ADS_TOKEN_URL = 'https://api.amazon.co.uk/auth/o2/token';

// Secret Manager secret names. Values are only ever read at runtime, never logged.
export const SECRETS = {
  adsClientId: 'ads-client-id',
  adsClientSecret: 'ads-client-secret',
  adsRefreshTokenEu: 'ads-refresh-token-eu',
  mcpClientSecret: 'mcp-oauth-client-secret',
  tokenSigningKey: 'mcp-token-signing-key',
  googleClientId: 'google-oauth-client-id',
  googleClientSecret: 'google-oauth-client-secret',
};

// Profile allowlist: the connector may only call these profile IDs. Anything else is refused in code.
export const PROFILE_ALLOWLIST = Object.freeze({
  '2067592198905075': { client: 'Harvaza', market: 'UK' },
  '783989167267519': { client: 'Balance 8', market: 'UK' },
  '2512597432650618': { client: 'NKV', market: 'UK' },
  '3482210927956978': { client: 'AMACX', market: 'DE' },
  '3517192262662766': { client: 'AMACX', market: 'FR' },
  '1996279639090983': { client: 'AMACX', market: 'IT' },
  '455713066943443': { client: 'AMACX', market: 'ES' },
  '4023537660515053': { client: 'HSB', market: 'DE' }, // advertises under the Mokum Dusk profile
});

// Who may use the connector: Google accounts in the TDS Workspace domain only.
// ALLOWED_EMAILS (comma-separated) narrows it further to named people if set.
export const ALLOWED_DOMAIN = 'tdstrategists.co.uk';
export const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

// The one OAuth client allowed to connect: the TDS Claude Team custom connector.
export const CLAUDE_CLIENT_ID = 'tds-claude-connector';
export const CLAUDE_REDIRECT_URIS = [
  'https://claude.ai/api/mcp/auth_callback',
  'https://claude.com/api/mcp/auth_callback',
];

export const SCOPE = 'ads.read';
