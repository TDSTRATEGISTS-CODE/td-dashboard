# TDS Amazon Ads connector — runbook

Replaces Perpetua's data access with TDS's own Amazon Ads API connection.
Plan and decisions: Notion › Claude Business › **Ads API Migration — Perpetua Replacement — Project Plan** (Build brief v1).

**Live writes are on for profiles handed over from Perpetua** (Harvaza UK since 27 Oct 2026). Every change still
needs an Approved Ads Approval Queue row carrying the batch's plan code, and passes the guards below. Profiles not
yet handed over are refused (`PERPETUA_RELEASED_PROFILES`). See "Change tools" below.

## What it is

| Piece | Where | What it does |
| --- | --- | --- |
| Connector (`ads-connector` Cloud Run service) | `https://ads-connector-<PROJECT_NUMBER>.europe-west2.run.app/mcp` | Remote MCP connector Claude calls. 8 read tools. |
| Daily pull (`ads-pull` Cloud Run job) | Cloud Scheduler `ads-pull-daily`, 06:00 London | Re-pulls the last 14 days of 4 SP reports for every allowlisted profile into BigQuery (late-arriving sales are picked up). |
| History | BigQuery `tds-amazon-ads:amazon_ads` (London) | Our own copy, so we are not limited by Amazon's ~95-day window. |
| Credentials | Secret Manager (London) | Never in the repo, Notion, chat or logs. |
| Code | this folder; deploys from GitHub `main` | `.github/workflows/ads-connector-deploy.yml` |

**Read tools:** `list_profiles`, `get_campaigns`, `get_ad_groups`, `get_keywords`, `get_targets`, `get_negatives`,
`run_report`, `get_report`.

**Goal tools:** `get_goals` (goals from Notion, plus any live campaign not in a goal), `goal_performance`
(spend, 14-day sales, orders, ACoS, CPC per goal from BigQuery).

**Goals** work like Perpetua goals: a group of campaigns run to one strategy. They live in the Notion **Ads Goals**
database (Client Account Tasks › Amazon Advertising Actions), shown and edited as a filtered view inside each
client's PPC Strategy task. Each row: client, market, profile ID, status, role, ASINs, campaign IDs, target and
break-even ACoS, monthly budget. **Every change must belong to an Active goal** — a campaign not in a goal, or in a
Paused/Draft/Retired goal, blocks the batch, and so does Notion being unreadable.

**Change tools (dry run by default):** `update_bids`, `add_negatives`, `transfer_targets`, `update_budgets`,
`update_bid_strategy`.

**Profile allowlist** (`src/config.js`): Harvaza UK, Balance 8 UK, NKV UK, AMACX DE/FR/IT/ES, HSB DE (Mokum Dusk).
Any other profile ID is refused before Amazon is called. Changing it = edit `config.js`, update the Notion
profiles table, merge to `main`.

## Who can call it

1. Claude must connect as the one registered client (`tds-claude-connector` + its secret). No other app can register.
2. The person connecting must sign in with a Google account in the **tdstrategists.co.uk** Workspace.
   Personal Gmail and other domains are refused. To narrow to named people, set `ALLOWED_EMAILS`
   (comma-separated) on the service.
3. Sign-in is OAuth with PKCE; codes are single-use (5 min); access tokens last 1 hour, refresh 30 days.
4. **Log everyone out:** rotate `mcp-token-signing-key` (see "If something is exposed").

## Least-access accounts

| Service account | Can do | Cannot do |
| --- | --- | --- |
| `ads-connector@` (runs the service and job) | Read the 8 named secrets; write tables in `amazon_ads`; run BigQuery jobs | Read other secrets or datasets; change IAM; deploy |
| `ads-scheduler@` | Start the `ads-pull` job | Anything else |
| `github-deployer@` | Push images; deploy the service/job as `ads-connector@` | Read secrets or data. Only usable from `main` of td-dashboard (keyless, no JSON key) |

---

## First-time setup (Ryan)

### Step A — Run the setup script (about 10 minutes)

1. Open <https://console.cloud.google.com/?project=tds-amazon-ads> signed in as **admin@**.
2. Click the **Activate Cloud Shell** icon (`>_`, top right). Wait for the terminal at the bottom.
3. Paste and press Enter:

   ```bash
   git clone -b claude/trusting-faraday-zqzif2 https://github.com/TDSTRATEGISTS-CODE/td-dashboard.git && cd td-dashboard && bash ads-connector/deploy/setup.sh
   ```

   If the repo is private, GitHub will ask for a username and a personal access token.
   If Cloud Shell asks to **Authorize**, click **Authorize**.
4. At the end it prints a box with the **Project number**, **Connector URL** and **Google sign-in redirect URI**.
   Keep the tab open. Send Claude the project number (it is not a secret).

The script is safe to run again; it skips anything that already exists.

### Step B — Google sign-in client (about 5 minutes, clicks in the console)

1. Go to <https://console.cloud.google.com/auth/overview?project=tds-amazon-ads>.
2. If asked, click **Get started**: App name `TDS Amazon Ads connector`, support email admin@, **Audience: Internal**,
   contact email admin@, tick the policy box, **Create**.
3. Left menu **Clients** › **+ Create client** › Application type **Web application**, name `TDS Ads connector`.
4. Under **Authorised redirect URIs** › **+ Add URI** › paste the redirect URI from Step A
   (`https://ads-connector-<number>.europe-west2.run.app/oauth/google/callback`). Click **Create**.
5. Leave the pop-up with the Client ID and secret open. In Cloud Shell run:

   ```bash
   bash ads-connector/deploy/set-google-oauth.sh
   ```

   Paste the Client ID, press Enter, then paste the Client secret (it stays hidden), press Enter.
   It prints `Saved both values and restarted the connector.` Close the pop-up.

### Step C — Turn on deploys from GitHub (Claude, then Ryan)

1. Claude puts the project number into `.github/workflows/ads-connector-deploy.yml`.
2. Ryan merges this branch to `main`. From then on, every merge that touches `ads-connector/` tests and deploys
   automatically (GitHub › Actions › **Deploy Ads connector**). Until then, the Step A deploy is live.

### Step D — Backfill history (20–60 minutes, unattended)

```bash
bash ads-connector/deploy/run.sh backfill
```

Pulls as far back as Amazon allows (~95 days per report) for all 8 profiles. If Amazon refuses the oldest days
for a report, the job moves the start forward automatically and logs it. Ends with
`Pull finished … failed: 0`. If the tab closes, the job keeps running; check later with `run.sh logs`.

### Step E — Add the connector in Claude (clicks)

1. In Cloud Shell, show the connector's client secret **on your screen only**:

   ```bash
   gcloud secrets versions access latest --secret=mcp-oauth-client-secret; echo
   ```

2. Claude (Team): **Settings › Connectors › Add custom connector** (organisation owners: **Admin settings › Connectors**).
   - Name: `TDS Amazon Ads`
   - URL: the Connector URL from Step A (ends `/mcp`)
   - **Advanced settings**: OAuth Client ID `tds-claude-connector`, OAuth Client Secret = the value from step 1.
3. Click **Add**, then **Connect**. Sign in with your tdstrategists.co.uk Google account.
4. Run `clear` in Cloud Shell so the secret is no longer on screen. Never paste it into chat or Notion.

### Step F — Tests (Build brief "First tests" 1 and 2)

```bash
bash ads-connector/deploy/run.sh verify
```

Runs as the connector's own service account and checks: all 8 allowlisted profiles visible; Harvaza UK
campaigns and keywords readable; a non-allowlisted profile is refused; BigQuery Harvaza UK SP spend
1–23 Oct 2026 = **£435.57** (clicks should be 434). Ends `VERIFY PASSED: 5/5`.

Then in a Claude chat with the connector on: *"Using TDS Amazon Ads, list Harvaza UK (2067592198905075)
campaigns and keywords."*

---

## Change tools — how approval works

Golden rule: flag, don't fix. Every change goes Proposed → Approved by Ryan → made → verified by re-reading.

1. **Dry run.** Claude calls a change tool with the queue row ID (e.g. `ADS-92`). Nothing is changed. It returns,
   per item, the current value read live from Amazon, the new value, % change, anything that blocks it, and a
   **plan code** (`plan:` + 12 characters) that fingerprints exactly this batch.
2. **Propose.** Claude writes the item list and the plan code on the queue row (in *Result / notes*), Status Proposed.
3. **Approve.** Ryan checks the row and sets Status = **Approved** and *Approved on* = today.
4. **Apply** (only once live writes are on). Claude calls the same tool with the same items and `apply=true`.
   The connector re-reads the Notion row itself and refuses unless **all** of these hold:
   - Status is Approved, *Approved on* is within 14 days, and the row isn't Done/Rejected/Expired;
   - the row's Client and Market match the profile, and its Lever fits the tool;
   - the plan code on the row matches this exact batch **and the live values it was built on** (change one bid by 1p
     and it won't match);
   - no live value has moved since the approved dry run. If a bid or budget changed after approval, the item is
     blocked with "Live value changed since approval (was X, now Y). Re-run the dry run and re-approve." (found by
     looking up the approved plan code's dry-run rows in `change_log`);
   - every item passes the guards below;
   - live writes are on and the profile is released from Perpetua;
   - the pending change was written to `change_log` first.
5. **Verify.** After writing, every item is re-read from Amazon and logged as `APPLIED_VERIFIED`,
   `APPLIED_MISMATCH` or `FAILED`. Claude then marks the queue row Done with the result.

**Guards (defaults, change via env vars on the service):** max 100 items per run; bids £0.15–£3.00, at most −25% cut / +10% raise per keyword/target per run (bid rules approved 25 Oct 2026; full rules in the Notion plan); daily budgets ≤ 100 and at most ±50% per run; placement adjustments 0–100%;
transfers only into manual campaigns; duplicates refused. No tool can archive or delete anything. Bid rules
(Notion Open decision 3) may change these.

**Every call is logged** in BigQuery `change_log`: who, when, queue row, old → new, dry run or not, status,
verified value, plan code.

### Set up the Notion approval check (Ryan, once, ~5 minutes)

The connector needs its own **read-only** Notion key that can see only the Ads Approval Queue.

1. Go to <https://www.notion.so/profile/integrations> › **New integration**.
   Name `TDS Ads connector (read)`, workspace = TDS, type **Internal** › **Save**.
2. On the integration's **Capabilities**: tick **Read content** only. Untick *Update content*, *Insert content*
   and *comments*; user information: **No user information**. **Save**.
3. **Configuration** tab › Internal Integration Secret › **Show** › **Copy**. Don't paste it anywhere except step 5.
4. Open the **Ads Approval Queue** database (Client Account Tasks › Amazon Advertising Actions) › **•••** (top right) ›
   **Connections** › search `TDS Ads connector (read)` › **Confirm**. Do the same for the **Ads Goals** database on
   the same page. Share only these two databases.
5. In Cloud Shell: `cd ~/td-dashboard && bash ads-connector/deploy/set-notion-token.sh`, paste the secret (hidden), Enter.

### Steady state: releasing a profile at its handover

Live writes stay **on** (`WRITES_ENABLED=true`). Each profile is added to `PERPETUA_RELEASED_PROFILES` **once**, when
it is handed over from Perpetua, and stays there. No weekly opening or closing: the per-change control is the
queue approval, plan code and guards.

Current (27 Oct 2026, revision `ads-connector-00011-vtm`): `WRITES_ENABLED=true`, `PERPETUA_RELEASED_PROFILES=2067592198905075`.

**Handover for a profile** (Ryan + Claude): export its Perpetua history → Claude snapshots every setting via the
connector → delete the Perpetua goal(s) → re-enable the campaigns that were live → Claude checks every setting against
the snapshot → release it:

```bash
bash ads-connector/deploy/write-window.sh open <profile ID> && rm ~/.ads-write-window.json
```

(`open` adds the profile and keeps existing ones; removing the record makes it permanent.) Then set its goals'
**Managed by** = Ads API, strike it from the Perpetua Actioning SOP client config, and log it in the Task Register.
Check first that the TDS login has edit rights on that ad account (a read-only login makes every apply FAIL safely).

**Switch everything off in an emergency:** Cloud Run › ads-connector › Edit › Variables › `WRITES_ENABLED=false` › Deploy.

### Opening and closing a one-off write window (profile still on Perpetua)

Only for an agreed test on a profile not yet handed over. Open a window only with Ryan's go-ahead, only for a profile already handed over from
Perpetua (or for an agreed test), and close it as soon as the work is done. Run in Cloud Shell from `~/td-dashboard`:

1. **Check:** `bash ads-connector/deploy/write-window.sh status` — shows the live `WRITES_ENABLED`,
   `PERPETUA_RELEASED_PROFILES` and revision, and whether a window is already open.
2. **Open:** `bash ads-connector/deploy/write-window.sh open <profile ID>`
   - Refuses a profile that isn't on the allowlist, and refuses if a window is already open.
   - Saves the previous values of both variables to `~/.ads-write-window.json` (including "not set"), then sets
     `WRITES_ENABLED=true` and **adds** the profile to `PERPETUA_RELEASED_PROFILES` (existing entries kept).
   - Prints the previous revision and the new one. Note both in the Notion change log.
3. **Do the work** in Cowork: dry run → plan code on the queue row → Ryan approves → apply → re-read → (revert if a test).
4. **Close:** `bash ads-connector/deploy/write-window.sh close` — restores both variables exactly (removes them
   if they weren't set before), deploys, and checks the result matches. Ends with
   `Matches the values recorded before the window opened.`
5. **Confirm:** a dry run on the same queue row must again list both switches under `switches`.

If Cloud Shell was reset and `~/.ads-write-window.json` is gone, close by hand: Cloud Run › ads-connector ›
**Edit & deploy new revision** › Variables › put both variables back to the values noted in the change log › **Deploy**.

## Day to day

| Task | How |
| --- | --- |
| Did last night's pull work? | `bash ads-connector/deploy/run.sh logs` — look for `Pull finished … failed: 0`. Or console › Cloud Run › Jobs › ads-pull › History. |
| Re-pull specific dates | `bash ads-connector/deploy/run.sh range 2026-10-01 2026-10-23` (any length; split into 31-day reports automatically, and existing rows for those dates are replaced, never duplicated). |
| One client only | Add `--update-env-vars PROFILES=<id>` to a manual execute, or set `PROFILES` / `REPORT_TYPES` on the job temporarily. |
| Query history | BigQuery console › `amazon_ads`. Spend: `SUM(cost)`. Sales: `sales_7d` / `sales_14d` (store both; pick one per report and say which). |
| Add / remove a profile | Edit `PROFILE_ALLOWLIST` in `src/config.js` + the Notion profiles table; merge to `main`. North America needs its own authorisation and endpoint first (not built). |
| Deploy code that isn't on `main` yet | `cd ~/td-dashboard && git pull && bash ads-connector/deploy/redeploy.sh` |
| Restrict to named people | Cloud Run › ads-connector › Edit › Variables › `ALLOWED_EMAILS=ryan@tdstrategists.co.uk,…` › Deploy. |

### Tables (`amazon_ads`)

| Table | Grain |
| --- | --- |
| `sp_campaign_daily` | profile · day · campaign |
| `sp_targeting_daily` | profile · day · keyword/target |
| `sp_search_term_daily` | profile · day · search term · keyword/target |
| `sp_advertised_product_daily` | profile · day · ad (ASIN/SKU) |
| `change_log` | every change-tool call: dry runs, refusals, pending, applied + verified |
| `target_acos_config` | profile · campaign/ad group · target ACoS (loaded from PPC Strategy tasks) |

Report tables are partitioned by `date`, clustered by `profile_id, campaign_id`. Each has `client`, `market`,
`currency` and `pulled_at`. Money columns are NUMERIC in the profile's currency.

Retention: **no expiry is set** — rows are kept until a decision is made. 24 months is [TO CONFIRM] (Notion
Open decision 2); setting it later is one `bq update` per table.

## If something is exposed

Follow the Notion Incident Response SOP first. Then:

| Exposed | Do |
| --- | --- |
| Amazon refresh token / client secret | Revoke in Amazon (Login with Amazon / Ads console), re-authorise, then run `gcloud secrets versions add ads-refresh-token-eu --data-file=-`, paste the new value, press Enter then Ctrl+D (keeps it out of shell history), and restart: `gcloud run services update ads-connector --region europe-west2 --update-env-vars SECRETS_ROTATED_AT=$(date +%s)`. |
| Connector client secret | `openssl rand -base64 48 \| tr -d '\n' \| gcloud secrets versions add mcp-oauth-client-secret --data-file=-`, restart (as above), update it in Claude's connector settings. |
| Log everyone out | Same as above with `mcp-token-signing-key`. Everyone reconnects in Claude. |

Disable old secret versions afterwards in Secret Manager.

## Cost

Expected £0–5/month (Cloud Run scales to zero; BigQuery storage is MBs). Budget alert: £10/month.

## For agents changing this code

- `cd ads-connector && npm ci && npm test` before pushing. Tests cover the allowlist, the read-only guard,
  the OAuth flow (non-TDS accounts, foreign redirects, code replay, PKCE) and the tools end to end against a mocked Amazon.
- Never log or print secret values; `src/log.js` redacts credential-like keys, but don't rely on it.
- Change tools live in `src/changes.js`; every apply must keep all the gates listed in "Change tools — how approval
  works". Never add a delete/archive route, never bypass `adsWrite()`, never default `apply` to true.
- Never write to a campaign Perpetua still manages.
