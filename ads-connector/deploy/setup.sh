#!/usr/bin/env bash
# One-time (and safe to re-run) setup for the TDS Amazon Ads connector.
# Run in Google Cloud Shell, signed in as admin@tdstrategists.co.uk, from the repo root:
#   bash ads-connector/deploy/setup.sh
# Never prints a secret value.
set -euo pipefail

PROJECT=tds-amazon-ads
REGION=europe-west2
DATASET=amazon_ads
REPO=ads-connector
SERVICE=ads-connector
JOB=ads-pull
SCHEDULE_NAME=ads-pull-daily
GITHUB_REPOS=("TDSTRATEGISTS-CODE/td-dashboard" "tdstrategists-code/td-dashboard")

RUNTIME_SA=ads-connector@$PROJECT.iam.gserviceaccount.com
SCHEDULER_SA=ads-scheduler@$PROJECT.iam.gserviceaccount.com
DEPLOYER_SA=github-deployer@$PROJECT.iam.gserviceaccount.com

step() { printf '\n\033[1m== %s\033[0m\n' "$*"; }
here="$(cd "$(dirname "$0")/.." && pwd)"

gcloud config set project "$PROJECT" >/dev/null
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT" --format='value(projectNumber)')
PUBLIC_URL="https://$SERVICE-$PROJECT_NUMBER.$REGION.run.app"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/$REPO/$SERVICE:setup-$(date +%Y%m%d%H%M%S)"

step "1/9 Extra APIs for keyless GitHub deploys"
gcloud services enable iam.googleapis.com iamcredentials.googleapis.com sts.googleapis.com \
  run.googleapis.com secretmanager.googleapis.com bigquery.googleapis.com cloudscheduler.googleapis.com \
  artifactregistry.googleapis.com --quiet

step "2/9 Service accounts"
mk_sa() { gcloud iam service-accounts describe "$1@$PROJECT.iam.gserviceaccount.com" >/dev/null 2>&1 \
  || gcloud iam service-accounts create "$1" --display-name "$2" --quiet; }
mk_sa ads-connector   "TDS Ads connector runtime (read secrets, write amazon_ads)"
mk_sa ads-scheduler   "TDS Ads daily pull trigger (start ads-pull only)"
mk_sa github-deployer "GitHub Actions deploy of ads-connector"
sleep 5 # new service accounts take a moment to be usable in IAM bindings

step "3/9 Connector-owned secrets (random values generated here, never shown)"
for s in mcp-oauth-client-secret mcp-token-signing-key google-oauth-client-id google-oauth-client-secret; do
  gcloud secrets describe "$s" >/dev/null 2>&1 \
    || gcloud secrets create "$s" --replication-policy=user-managed --locations="$REGION" --quiet
done
for s in mcp-oauth-client-secret mcp-token-signing-key; do
  if [ -z "$(gcloud secrets versions list "$s" --filter='state=ENABLED' --format='value(name)' --limit=1)" ]; then
    openssl rand -base64 48 | tr -d '\n' | gcloud secrets versions add "$s" --data-file=- --quiet >/dev/null
    echo "  generated $s"
  fi
done

step "4/9 Least-access permissions for the runtime account"
for s in ads-client-id ads-client-secret ads-refresh-token-eu mcp-oauth-client-secret mcp-token-signing-key google-oauth-client-id google-oauth-client-secret; do
  gcloud secrets add-iam-policy-binding "$s" --member="serviceAccount:$RUNTIME_SA" \
    --role=roles/secretmanager.secretAccessor --quiet >/dev/null
done
echo "  secret access: the 7 named secrets only"
# Write access to the amazon_ads dataset only (dataset-level WRITER = BigQuery Data Editor on that dataset).
tmp=$(mktemp)
bq show --format=prettyjson "$PROJECT:$DATASET" > "$tmp"
python3 - "$tmp" "$RUNTIME_SA" <<'PY'
import json, sys
path, sa = sys.argv[1], sys.argv[2]
ds = json.load(open(path))
acc = ds.setdefault("access", [])
if not any(a.get("userByEmail") == sa and a.get("role") == "WRITER" for a in acc):
    acc.append({"role": "WRITER", "userByEmail": sa})
json.dump({"access": acc}, open(path, "w"))
PY
bq update --source "$tmp" "$PROJECT:$DATASET" >/dev/null && rm -f "$tmp"
echo "  BigQuery: write to $DATASET only"
gcloud projects add-iam-policy-binding "$PROJECT" --member="serviceAccount:$RUNTIME_SA" \
  --role=roles/bigquery.jobUser --condition=None --quiet >/dev/null
echo "  BigQuery: run query/load jobs (needed to write; grants no data access)"

step "5/9 Container registry"
gcloud artifacts repositories describe "$REPO" --location "$REGION" >/dev/null 2>&1 \
  || gcloud artifacts repositories create "$REPO" --repository-format=docker --location "$REGION" --quiet

step "6/9 Build and push the first image"
gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet >/dev/null
docker build -q -t "$IMAGE" "$here"
docker push -q "$IMAGE"

step "7/9 Deploy connector (Cloud Run service) and daily pull (Cloud Run job)"
# --no-invoker-iam-check: Claude must reach /mcp over the internet; the connector's own OAuth
# (Google sign-in, tdstrategists.co.uk only) is the gate. Avoids needing an allUsers IAM binding.
gcloud run deploy "$SERVICE" --image "$IMAGE" --region "$REGION" --service-account "$RUNTIME_SA" \
  --no-invoker-iam-check --ingress all --min-instances 0 --max-instances 1 --memory 512Mi --cpu 1 --timeout 300 \
  --set-env-vars "PUBLIC_URL=$PUBLIC_URL,GCP_PROJECT=$PROJECT" --quiet
gcloud run jobs deploy "$JOB" --image "$IMAGE" --region "$REGION" --service-account "$RUNTIME_SA" \
  --command node --args src/pull.js,daily --task-timeout 3h --max-retries 1 --memory 1Gi \
  --set-env-vars "GCP_PROJECT=$PROJECT" --quiet

step "8/9 Daily pull at 06:00 London"
gcloud run jobs add-iam-policy-binding "$JOB" --region "$REGION" --member="serviceAccount:$SCHEDULER_SA" \
  --role=roles/run.invoker --quiet >/dev/null
SCHED_ARGS=(--location "$REGION" --schedule "0 6 * * *" --time-zone "Europe/London"
  --uri "https://run.googleapis.com/v2/projects/$PROJECT/locations/$REGION/jobs/$JOB:run" --http-method POST
  --oauth-service-account-email "$SCHEDULER_SA" --oauth-token-scope "https://www.googleapis.com/auth/cloud-platform"
  --attempt-deadline 180s --quiet)
if gcloud scheduler jobs describe "$SCHEDULE_NAME" --location "$REGION" >/dev/null 2>&1; then
  gcloud scheduler jobs update http "$SCHEDULE_NAME" "${SCHED_ARGS[@]}" >/dev/null
else
  gcloud scheduler jobs create http "$SCHEDULE_NAME" "${SCHED_ARGS[@]}" >/dev/null
fi
echo "  $SCHEDULE_NAME: 06:00 Europe/London daily"

step "9/9 Keyless deploys from GitHub (main branch of td-dashboard only)"
gcloud iam workload-identity-pools describe github --location global >/dev/null 2>&1 \
  || gcloud iam workload-identity-pools create github --location global --display-name "GitHub Actions" --quiet
COND="(assertion.repository == '${GITHUB_REPOS[0]}' || assertion.repository == '${GITHUB_REPOS[1]}') && assertion.ref == 'refs/heads/main'"
if gcloud iam workload-identity-pools providers describe td-dashboard --location global --workload-identity-pool github >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers update-oidc td-dashboard --location global --workload-identity-pool github \
    --attribute-condition "$COND" --quiet >/dev/null
else
  gcloud iam workload-identity-pools providers create-oidc td-dashboard --location global --workload-identity-pool github \
    --display-name "td-dashboard repo" --issuer-uri "https://token.actions.githubusercontent.com" \
    --attribute-mapping "google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --attribute-condition "$COND" --quiet
fi
for r in "${GITHUB_REPOS[@]}"; do
  gcloud iam service-accounts add-iam-policy-binding "$DEPLOYER_SA" --role roles/iam.workloadIdentityUser \
    --member "principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/$r" \
    --quiet >/dev/null
done
gcloud projects add-iam-policy-binding "$PROJECT" --member="serviceAccount:$DEPLOYER_SA" --role=roles/run.developer --condition=None --quiet >/dev/null
gcloud artifacts repositories add-iam-policy-binding "$REPO" --location "$REGION" --member="serviceAccount:$DEPLOYER_SA" --role=roles/artifactregistry.writer --quiet >/dev/null
gcloud iam service-accounts add-iam-policy-binding "$RUNTIME_SA" --member="serviceAccount:$DEPLOYER_SA" --role=roles/iam.serviceAccountUser --quiet >/dev/null

cat <<MSG

==================================================================
 Setup complete.
   Project number : $PROJECT_NUMBER   <- send this to Claude (not a secret)
   Connector URL  : $PUBLIC_URL/mcp
   Google sign-in redirect URI (for the OAuth client, next step):
                    $PUBLIC_URL/oauth/google/callback
 Next: RUNBOOK.md › "Step B — Google sign-in client".
==================================================================
MSG
