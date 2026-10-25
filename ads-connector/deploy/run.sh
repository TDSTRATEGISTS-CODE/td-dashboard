#!/usr/bin/env bash
# Run the pull job or checks by hand, from Cloud Shell. Executes as the connector's own service account.
#   bash ads-connector/deploy/run.sh backfill      # first run: as far back as Amazon allows (~95 days)
#   bash ads-connector/deploy/run.sh daily         # same as the 06:00 schedule
#   bash ads-connector/deploy/run.sh range 2026-10-01 2026-10-23
#   bash ads-connector/deploy/run.sh verify        # First tests 1 and 2 (Harvaza UK read + £435.57 spend)
#   bash ads-connector/deploy/run.sh logs          # messages from the latest run
set -euo pipefail
REGION=europe-west2; JOB=ads-pull
gcloud config set project tds-amazon-ads >/dev/null

logs() {
  local exec_name
  exec_name=$(gcloud run jobs executions list --job "$JOB" --region "$REGION" --limit 1 --format='value(name)')
  echo "Execution: $exec_name"
  gcloud logging read "resource.type=cloud_run_job AND resource.labels.job_name=$JOB AND labels.\"run.googleapis.com/execution_name\"=$exec_name" \
    --order=asc --limit=500 --freshness=2d \
    --format='value(severity,jsonPayload)' | sed 's/\t/  /g'
}

mode=${1:-}
case "$mode" in
  backfill|daily) args="src/pull.js,$mode" ;;
  range) args="src/pull.js,range,${2:?from date},${3:?to date}" ;;
  verify) args="src/cli.js,verify" ;;
  logs) logs; exit 0 ;;
  *) sed -n '2,8p' "$0"; exit 2 ;;
esac
echo "Running $JOB ($mode). Backfill can take 20–60 minutes; leave this tab open."
status=0
gcloud run jobs execute "$JOB" --region "$REGION" --args="$args" --wait || status=$?
logs
exit $status
