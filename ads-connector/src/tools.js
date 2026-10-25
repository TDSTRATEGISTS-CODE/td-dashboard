// The 8 read tools from Build brief v1. Every tool that takes a profile_id checks the allowlist first;
// the Ads client also refuses any non-read route. Write tools are deliberately absent in v1.
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PROFILE_ALLOWLIST } from './config.js';
import { assertAllowedProfile } from './allowlist.js';
import { listProfiles, spList } from './ads.js';
import { REPORTS, createReport, getReportStatus, downloadReport, summarise, validateRange } from './reports.js';
import { info, warn } from './log.js';
import { runChange } from './changes.js';

const profileId = z.string().describe('Amazon Ads profile ID; must be on the TDS allowlist (see list_profiles)');
const states = z.array(z.enum(['ENABLED', 'PAUSED', 'ARCHIVED'])).optional()
  .describe('States to include. Default: ENABLED and PAUSED');
const ids = (what) => z.array(z.string()).optional().describe(`Only these ${what} IDs`);
const maxItems = z.number().int().min(1).max(5000).optional().describe('Max items to return (default 500)');
const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };

function filters({ state, campaign_ids, ad_group_ids }) {
  const f = { stateFilter: { include: state?.length ? state : ['ENABLED', 'PAUSED'] } };
  if (campaign_ids?.length) f.campaignIdFilter = { include: campaign_ids };
  if (ad_group_ids?.length) f.adGroupIdFilter = { include: ad_group_ids };
  return f;
}

const ok = (data) => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 1) }] });
const fail = (e) => ({ isError: true, content: [{ type: 'text', text: e.message }] });

export function buildMcpServer({ email } = {}) {
  const server = new McpServer({ name: 'tds-amazon-ads', version: '1.0.0' });

  const tool = (name, config, handler) => server.registerTool(name, { ...config, annotations: READ_ONLY }, async (args) => {
    try {
      if (args?.profile_id !== undefined) args.profile_id = assertAllowedProfile(args.profile_id);
      info('Tool call', { tool: name, by: email, profile: args?.profile_id || null });
      return ok(await handler(args || {}));
    } catch (e) {
      warn('Tool call failed', { tool: name, by: email, reason: e.message });
      return fail(e);
    }
  });

  const label = (id) => PROFILE_ALLOWLIST[id] && { client: PROFILE_ALLOWLIST[id].client, market: PROFILE_ALLOWLIST[id].market };

  tool('list_profiles', {
    description: 'List the Amazon Ads profiles TDS may use (allowlisted EU profiles only), with client, market, currency and timezone.',
    inputSchema: {},
  }, async () => {
    const all = await listProfiles();
    return all.filter((p) => PROFILE_ALLOWLIST[String(p.profileId)]).map((p) => ({
      profile_id: String(p.profileId), ...label(String(p.profileId)), country: p.countryCode,
      currency: p.currencyCode, timezone: p.timezone, account_name: p.accountInfo?.name,
    }));
  });

  const listTool = (name, kind, description, extra = {}) => tool(name, {
    description,
    inputSchema: { profile_id: profileId, state: states, campaign_ids: ids('campaign'), ...extra, max_items: maxItems },
  }, async (a) => {
    const r = await spList(kind, a.profile_id, filters(a), a.max_items || 500);
    return { profile_id: a.profile_id, ...label(a.profile_id), count: r.items.length, truncated: r.truncated, items: r.items };
  });

  listTool('get_campaigns', 'campaigns', 'Sponsored Products campaigns for one profile: name, state, budget, bidding strategy, placements.');
  listTool('get_ad_groups', 'adGroups', 'Sponsored Products ad groups for one profile.');
  listTool('get_keywords', 'keywords', 'Sponsored Products keywords (text, match type, bid, state) for one profile.', { ad_group_ids: ids('ad group') });
  listTool('get_targets', 'targets', 'Sponsored Products product/category/auto targets (expression, bid, state) for one profile.', { ad_group_ids: ids('ad group') });

  tool('get_negatives', {
    description: 'Sponsored Products negatives for one profile: negative keywords and negative product targets, at ad group and campaign level.',
    inputSchema: { profile_id: profileId, campaign_ids: ids('campaign'), max_items: maxItems },
  }, async (a) => {
    const f = filters({ state: ['ENABLED', 'PAUSED'], campaign_ids: a.campaign_ids });
    const max = a.max_items || 500;
    const [adGroupKeywords, campaignKeywords, adGroupTargets, campaignTargets] = await Promise.all(
      ['negativeKeywords', 'campaignNegativeKeywords', 'negativeTargets', 'campaignNegativeTargets'].map((k) => spList(k, a.profile_id, f, max)),
    );
    return {
      profile_id: a.profile_id, ...label(a.profile_id),
      ad_group_negative_keywords: adGroupKeywords, campaign_negative_keywords: campaignKeywords,
      ad_group_negative_targets: adGroupTargets, campaign_negative_targets: campaignTargets,
    };
  });

  tool('run_report', {
    description: 'Request a Sponsored Products report from Amazon (max 31 days per report; data kept by Amazon ~95 days; older history is in BigQuery amazon_ads). Returns a report_id; then call get_report.',
    inputSchema: {
      profile_id: profileId,
      report_type: z.enum(Object.keys(REPORTS)),
      start_date: z.string().describe('YYYY-MM-DD, in the profile timezone'),
      end_date: z.string().describe('YYYY-MM-DD, inclusive'),
      time_unit: z.enum(['DAILY', 'SUMMARY']).optional().describe('DAILY (default) or SUMMARY'),
    },
  }, async (a) => {
    validateRange(a.start_date, a.end_date);
    const reportId = await createReport(a.profile_id, a.report_type, a.start_date, a.end_date, a.time_unit || 'DAILY');
    return { report_id: reportId, profile_id: a.profile_id, ...label(a.profile_id), report_type: a.report_type, next: 'Call get_report with this report_id. Reports usually take 1–5 minutes.' };
  });

  tool('get_report', {
    description: 'Check a report from run_report. When COMPLETED, returns totals (impressions, clicks, cost, sales, purchases) and up to max_rows rows.',
    inputSchema: {
      profile_id: profileId,
      report_id: z.string(),
      max_rows: z.number().int().min(0).max(2000).optional().describe('Rows to return (default 200; totals always cover all rows)'),
    },
  }, async (a) => {
    const s = await getReportStatus(a.profile_id, a.report_id);
    if (s.status !== 'COMPLETED') return { report_id: a.report_id, status: s.status, failure_reason: s.failureReason || null };
    const rows = await downloadReport(s.url);
    const max = a.max_rows ?? 200;
    return {
      report_id: a.report_id, status: s.status, profile_id: a.profile_id, ...label(a.profile_id),
      start_date: s.startDate, end_date: s.endDate, totals: summarise(rows),
      rows_returned: Math.min(max, rows.length), rows: rows.slice(0, max),
    };
  });

  registerChangeTools(server, { email });
  return server;
}

// ---------- change tools (dry run by default; apply needs an Approved queue row carrying the plan code) ----------

const CHANGE_NOTE = ' DRY RUN by default: shows old → new and a plan code, changes nothing. '
  + 'Apply (apply=true) only works when the Ads Approval Queue row is Approved, carries the plan code, '
  + 'the profile is released from Perpetua and live writes are switched on.';
const common = {
  profile_id: profileId,
  queue_row_id: z.string().describe('Ads Approval Queue row ID, e.g. ADS-92'),
  apply: z.boolean().optional().describe('false/omitted = dry run (default). true = make the change, only if every check passes'),
};
const money = z.number().positive();

function registerChangeTools(server, { email }) {
  const tool = (name, description, inputSchema) => server.registerTool(name, {
    description: description + CHANGE_NOTE,
    inputSchema: { ...common, ...inputSchema },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async (args) => {
    try {
      args.profile_id = assertAllowedProfile(args.profile_id);
      info('Change tool call', { tool: name, by: email, profile: args.profile_id, queue_row: args.queue_row_id, apply: Boolean(args.apply) });
      const out = await runChange(name, args, { email });
      info('Change tool result', { tool: name, by: email, mode: out.mode, ready: out.ready_to_apply, applied: Boolean(out.applied), plan: out.plan_code });
      return ok(out);
    } catch (e) {
      warn('Change tool failed', { tool: name, by: email, reason: e.message });
      return fail(e);
    }
  });

  tool('update_bids', 'Change Sponsored Products keyword or target bids.', {
    changes: z.array(z.object({
      entity: z.enum(['keyword', 'target']),
      id: z.string().describe('keywordId or targetId'),
      new_bid: money,
    })).min(1),
  });

  tool('add_negatives', 'Add negative keywords (exact/phrase, ad group or campaign level) or negative ASINs (ad group level).', {
    negatives: z.array(z.object({
      type: z.enum(['keyword', 'product']),
      level: z.enum(['ad_group', 'campaign']).optional().describe('Default ad_group'),
      campaign_id: z.string(),
      ad_group_id: z.string().optional(),
      keyword_text: z.string().optional(),
      match_type: z.enum(['NEGATIVE_EXACT', 'NEGATIVE_PHRASE']).optional(),
      asin: z.string().optional(),
    })).min(1),
  });

  tool('transfer_targets', 'Harvest a search term: create it as a keyword/ASIN target in the destination manual ad group and add a matching negative exact in the source.', {
    transfers: z.array(z.object({
      type: z.enum(['keyword', 'product']),
      keyword_text: z.string().optional(),
      match_type: z.enum(['EXACT', 'PHRASE', 'BROAD']).optional(),
      asin: z.string().optional(),
      bid: money,
      destination_campaign_id: z.string(),
      destination_ad_group_id: z.string(),
      source_campaign_id: z.string(),
      source_ad_group_id: z.string(),
      negate_in_source: z.enum(['ad_group', 'campaign']).optional().describe('Default ad_group'),
    })).min(1),
  });

  tool('update_budgets', 'Change Sponsored Products campaign daily budgets.', {
    changes: z.array(z.object({ campaign_id: z.string(), new_daily_budget: money })).min(1),
  });

  tool('update_bid_strategy', 'Change a campaign\'s bidding strategy (down only = LEGACY_FOR_SALES, up and down = AUTO_FOR_SALES, fixed = MANUAL) and/or placement adjustments (%).', {
    changes: z.array(z.object({
      campaign_id: z.string(),
      strategy: z.enum(['LEGACY_FOR_SALES', 'AUTO_FOR_SALES', 'MANUAL']).optional(),
      top_of_search_pct: z.number().int().min(0).optional(),
      rest_of_search_pct: z.number().int().min(0).optional(),
      product_page_pct: z.number().int().min(0).optional(),
    })).min(1),
  });
}
