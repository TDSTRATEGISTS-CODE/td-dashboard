#!/usr/bin/env bash
# Stores the Google sign-in OAuth client (created in the console, RUNBOOK Step B) in Secret Manager.
# Paste each value when asked; input is hidden and never written to disk or shell history.
set -euo pipefail
gcloud config set project tds-amazon-ads >/dev/null
read -r -p "Google OAuth Client ID (ends .apps.googleusercontent.com): " CID
read -r -s -p "Google OAuth Client secret (hidden): " CSECRET; echo
[[ "$CID" == *.apps.googleusercontent.com ]] || { echo "That doesn't look like a client ID; nothing saved."; exit 1; }
[ -n "$CSECRET" ] || { echo "Empty secret; nothing saved."; exit 1; }
printf '%s' "$CID" | gcloud secrets versions add google-oauth-client-id --data-file=- --quiet >/dev/null
printf '%s' "$CSECRET" | gcloud secrets versions add google-oauth-client-secret --data-file=- --quiet >/dev/null
unset CSECRET
# The service caches secrets in memory; restart it so it reads the new values.
gcloud run services update ads-connector --region europe-west2 --update-env-vars "SECRETS_ROTATED_AT=$(date +%s)" --quiet >/dev/null
echo "Saved both values and restarted the connector."
