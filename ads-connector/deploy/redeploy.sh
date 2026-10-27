#!/usr/bin/env bash
# Rebuilds and redeploys the connector and pull job from Cloud Shell (same as the GitHub workflow,
# for when a branch isn't merged to main yet). Keeps every setting; only the code changes.
#   cd ~/td-dashboard && git pull && bash ads-connector/deploy/redeploy.sh
set -euo pipefail
PROJECT=tds-amazon-ads; REGION=europe-west2
IMAGE="$REGION-docker.pkg.dev/$PROJECT/ads-connector/ads-connector:manual-$(date +%Y%m%d%H%M%S)"
here="$(cd "$(dirname "$0")/.." && pwd)"
gcloud config set project "$PROJECT" >/dev/null
gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet >/dev/null
# Build and push from Cloud Shell, retrying the push (Cloud Shell → Artifact Registry sometimes drops connections).
pushed=false
if docker build -q -t "$IMAGE" "$here"; then
  for wait in 0 5 15 30; do
    sleep "$wait"
    if docker push -q "$IMAGE"; then pushed=true; break; fi
    echo "Push failed; retrying..."
  done
fi
# Fallback: build inside Google Cloud with Cloud Build (no Cloud Shell network involved).
if [ "$pushed" != true ]; then
  echo "Cloud Shell couldn't upload the image. Building with Cloud Build instead (2-4 minutes)..."
  gcloud builds submit "$here" --region "$REGION" --tag "$IMAGE" --quiet
fi
gcloud run deploy ads-connector --image "$IMAGE" --region "$REGION" --quiet
gcloud run jobs update ads-pull --image "$IMAGE" --region "$REGION" --quiet
echo "Redeployed: $IMAGE"
