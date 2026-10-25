// Verification checks (Build brief v1 "First tests" 1 and 2). Run as the Cloud Run Job, so it uses the
// connector's own service account and proves its least-access permissions:
//   gcloud run jobs execute ads-pull --region europe-west2 --args=src/cli.js,verify --wait
import { listProfiles, spList } from './ads.js';
import { query } from './bq.js';
import { GCP_PROJECT, DATASET, PROFILE_ALLOWLIST } from './config.js';
import { info, error } from './log.js';

const HARVAZA_UK = '2067592198905075';
const EXPECTED_SPEND = 435.57; // Harvaza UK SP spend 1–23 Oct 2026, from the PowerShell report and Perpetua

async function verify() {
  const results = [];
  const check = (name, pass, detail) => { results.push({ name, pass, ...detail }); (pass ? info : error)(`CHECK ${pass ? 'PASS' : 'FAIL'}: ${name}`, detail); };

  const profiles = await listProfiles();
  const visible = Object.keys(PROFILE_ALLOWLIST).filter((id) => profiles.some((p) => String(p.profileId) === id));
  check('Allowlisted profiles visible to the TDS login', visible.length === Object.keys(PROFILE_ALLOWLIST).length,
    { visible: visible.length, expected: Object.keys(PROFILE_ALLOWLIST).length, missing: Object.keys(PROFILE_ALLOWLIST).filter((id) => !visible.includes(id)) });

  const states = { stateFilter: { include: ['ENABLED', 'PAUSED'] } };
  const campaigns = await spList('campaigns', HARVAZA_UK, states, 5000);
  check('Read Harvaza UK campaigns', campaigns.items.length > 0, {
    campaigns: campaigns.items.length,
    sample: campaigns.items.slice(0, 5).map((c) => `${c.name} [${c.state}]`),
  });
  const keywords = await spList('keywords', HARVAZA_UK, states, 5000);
  check('Read Harvaza UK keywords', keywords.items.length > 0, {
    keywords: keywords.items.length,
    sample: keywords.items.slice(0, 5).map((k) => `${k.keywordText} (${k.matchType}) bid ${k.bid}`),
  });

  try {
    await spList('campaigns', '999', states, 1);
    check('Non-allowlisted profile refused', false, {});
  } catch (e) {
    check('Non-allowlisted profile refused', /allowlist/.test(e.message), { reason: e.message });
  }

  const [row] = await query(
    `SELECT ROUND(SUM(cost), 2) AS spend, SUM(clicks) AS clicks, COUNT(DISTINCT date) AS days
     FROM \`${GCP_PROJECT}.${DATASET}.sp_campaign_daily\`
     WHERE profile_id = @p AND date BETWEEN '2026-10-01' AND '2026-10-23'`, { p: HARVAZA_UK });
  const spend = Number(row?.spend ?? 0);
  check('BigQuery: Harvaza UK SP spend 1–23 Oct = £435.57', Math.abs(spend - EXPECTED_SPEND) < 0.005,
    { spend, expected: EXPECTED_SPEND, clicks: Number(row?.clicks ?? 0), expected_clicks: 434, days: Number(row?.days ?? 0) });

  const failed = results.filter((r) => !r.pass).length;
  info(`VERIFY ${failed ? 'FAILED' : 'PASSED'}: ${results.length - failed}/${results.length} checks passed`);
  return failed === 0;
}

const [cmd] = process.argv.slice(2);
if (cmd !== 'verify') { error('Usage: node src/cli.js verify'); process.exit(2); }
verify().then((ok) => process.exit(ok ? 0 : 1)).catch((e) => { error('Verify crashed', { reason: e.message }); process.exit(1); });
