// Cloud Run Job entry point: pulls SP reports for every allowlisted profile into BigQuery.
//
//   node src/pull.js daily              last DAILY_LOOKBACK days to yesterday (late attribution is re-pulled)
//   node src/pull.js backfill           as far back as Amazon keeps each report (~95 days)
//   node src/pull.js range 2026-10-01 2026-10-23
//   node src/pull.js ensure-tables
//
// Optional: PROFILES=id,id and REPORT_TYPES=sp_campaigns,... env vars narrow a run.
import { pathToFileURL } from 'node:url';
import { PROFILE_ALLOWLIST } from './config.js';
import { listProfiles } from './ads.js';
import { REPORTS, MAX_RANGE_DAYS, createReport, waitForReport, downloadReport, mapRow } from './reports.js';
import { ensureTables, replaceRange } from './bq.js';
import { todayIn, addDays, chunkRange } from './dates.js';
import { info, warn, error } from './log.js';

const DAILY_LOOKBACK = 14;
const CONCURRENCY = 4;

async function pool(items, n, fn) {
  const results = [];
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const idx = i++; results[idx] = await fn(items[idx]); }
  }));
  return results;
}

async function allowedProfiles() {
  const only = (process.env.PROFILES || '').split(',').map((s) => s.trim()).filter(Boolean);
  const live = await listProfiles();
  const byId = new Map(live.map((p) => [String(p.profileId), p]));
  return Object.entries(PROFILE_ALLOWLIST)
    .filter(([id]) => !only.length || only.includes(id))
    .map(([id, meta]) => {
      const p = byId.get(id);
      if (!p) warn('Allowlisted profile not visible to the TDS login; skipped', { profileId: id, ...meta });
      return p && { profileId: id, ...meta, timezone: p.timezone || 'Europe/London', currency: p.currencyCode };
    })
    .filter(Boolean);
}

async function pullOne(job) {
  const { profile, type, start, end } = job;
  const ctx = { profileId: profile.profileId, client: profile.client, market: profile.market, currency: profile.currency, pulledAt: new Date().toISOString() };
  const reportId = await createReport(profile.profileId, type, start, end);
  const status = await waitForReport(profile.profileId, reportId);
  const raw = await downloadReport(status.url);
  const rows = raw.map((r) => mapRow(type, r, ctx));
  const n = await replaceRange(type, profile.profileId, start, end, rows);
  info('Pulled', { client: profile.client, market: profile.market, type, start, end, rows: n });
  return n;
}

// Backfill: Amazon refuses dates past its retention window. If the oldest chunk is refused,
// step its start forward a few days at a time until Amazon accepts it.
async function pullWithRetentionRetry(job, isOldest) {
  for (let tries = 0; ; tries++) {
    try {
      return await pullOne(job);
    } catch (e) {
      if (isOldest && e.status === 400 && tries < 8 && job.start < job.end) {
        warn('Oldest chunk refused; moving start forward', { type: job.type, start: job.start, reason: e.message });
        job = { ...job, start: addDays(job.start, 3) };
        continue;
      }
      throw e;
    }
  }
}

export async function run(mode, from, to) {
  await ensureTables();
  if (mode === 'ensure-tables') return { ok: true };

  const types = (process.env.REPORT_TYPES || '').split(',').map((s) => s.trim()).filter(Boolean);
  const reportTypes = types.length ? types : Object.keys(REPORTS);
  const profiles = await allowedProfiles();
  const jobs = [];
  for (const profile of profiles) {
    const yesterday = addDays(todayIn(profile.timezone), -1);
    for (const type of reportTypes) {
      let start; let end = yesterday;
      if (mode === 'daily') start = addDays(yesterday, -(DAILY_LOOKBACK - 1));
      else if (mode === 'backfill') start = addDays(todayIn(profile.timezone), -REPORTS[type].retentionDays);
      else if (mode === 'range') { start = from; end = to; }
      else throw new Error(`Unknown mode ${mode}`);
      chunkRange(start, end, MAX_RANGE_DAYS).forEach(([s, e], i) => jobs.push({ profile, type, start: s, end: e, isOldest: mode === 'backfill' && i === 0 }));
    }
  }
  info('Pull starting', { mode, profiles: profiles.length, reports: jobs.length });

  const failures = [];
  let rows = 0;
  await pool(jobs, CONCURRENCY, async (job) => {
    try {
      rows += await pullWithRetentionRetry(job, job.isOldest);
    } catch (e) {
      failures.push({ client: job.profile.client, market: job.profile.market, type: job.type, start: job.start, end: job.end, reason: e.message });
      error('Pull failed', failures.at(-1));
    }
  });
  info('Pull finished', { mode, reports: jobs.length, rows, failed: failures.length });
  return { ok: failures.length === 0, rows, failures };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [mode = 'daily', from, to] = process.argv.slice(2);
  run(mode, from, to)
    .then((r) => process.exit(r.ok ? 0 : 1))
    .catch((e) => { error('Pull crashed', { reason: e.message }); process.exit(1); });
}
