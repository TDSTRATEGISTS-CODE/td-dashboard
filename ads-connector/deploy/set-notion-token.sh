#!/usr/bin/env bash
# Stores the read-only Notion integration secret (RUNBOOK › "Change tools") in Secret Manager and lets the
# connector read it. Input is hidden and never written to disk or shell history.
set -euo pipefail
PROJECT=tds-amazon-ads; REGION=europe-west2; SECRET=notion-ads-queue-token
RUNTIME_SA=ads-connector@$PROJECT.iam.gserviceaccount.com
gcloud config set project "$PROJECT" >/dev/null
gcloud secrets describe "$SECRET" >/dev/null 2>&1 \
  || gcloud secrets create "$SECRET" --replication-policy=user-managed --locations="$REGION" --quiet >/dev/null
gcloud secrets add-iam-policy-binding "$SECRET" --member="serviceAccount:$RUNTIME_SA" \
  --role=roles/secretmanager.secretAccessor --quiet >/dev/null
read -r -s -p "Notion internal integration secret (hidden, starts ntn_ or secret_): " TOKEN; echo
[[ "$TOKEN" == ntn_* || "$TOKEN" == secret_* ]] || { echo "That doesn't look like a Notion integration secret; nothing saved."; exit 1; }
printf '%s' "$TOKEN" | gcloud secrets versions add "$SECRET" --data-file=- --quiet >/dev/null
unset TOKEN
gcloud run services update ads-connector --region "$REGION" --update-env-vars "SECRETS_ROTATED_AT=$(date +%s)" --quiet >/dev/null
echo "Saved and restarted the connector."
