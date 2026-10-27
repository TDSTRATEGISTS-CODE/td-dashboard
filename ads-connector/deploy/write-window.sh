#!/usr/bin/env bash
# Opens or closes a live-write window for ONE allowlisted profile on the ads-connector service.
# Records the previous values of WRITES_ENABLED and PERPETUA_RELEASED_PROFILES first, and restores them exactly.
#   bash ads-connector/deploy/write-window.sh status
#   bash ads-connector/deploy/write-window.sh open 2067592198905075
#   bash ads-connector/deploy/write-window.sh close
# Never prints secrets (only these two variables and revision names).
set -euo pipefail
PROJECT=tds-amazon-ads; REGION=europe-west2; SERVICE=ads-connector
STATE="$HOME/.ads-write-window.json"
here="$(cd "$(dirname "$0")/.." && pwd)"
gcloud config set project "$PROJECT" >/dev/null

current() { # prints JSON {"revision":..., "WRITES_ENABLED": value|null, "PERPETUA_RELEASED_PROFILES": value|null}
  gcloud run services describe "$SERVICE" --region "$REGION" --format=json | python3 -c '
import json, sys
s = json.load(sys.stdin)
env = {e["name"]: e.get("value", "") for e in s["spec"]["template"]["spec"]["containers"][0].get("env", []) if "valueFrom" not in e}
print(json.dumps({"revision": s["status"].get("latestReadyRevisionName"),
                  "WRITES_ENABLED": env.get("WRITES_ENABLED"),
                  "PERPETUA_RELEASED_PROFILES": env.get("PERPETUA_RELEASED_PROFILES")}))'
}
show() { python3 -c 'import json, sys
d = json.loads(sys.argv[1])
for k, v in d.items(): print("  %s: %s" % (k, "(not set)" if v is None else repr(v)))' "$1"; }

case "${1:-}" in
  status)
    echo "Live now:"; show "$(current)"
    [ -f "$STATE" ] && { echo "A write window is OPEN. Values to restore on close:"; show "$(cat "$STATE")"; } || echo "No write window open."
    ;;
  open)
    PROFILE="${2:?profile ID required}"
    [[ "$PROFILE" =~ ^[0-9]+$ ]] || { echo "Profile ID must be digits."; exit 1; }
    grep -q "'$PROFILE':" "$here/src/config.js" || { echo "Profile $PROFILE is not on the connector allowlist; refused."; exit 1; }
    [ -f "$STATE" ] && { echo "A write window is already open (see: status). Close it first."; exit 1; }
    before="$(current)"
    printf '%s' "$before" > "$STATE"
    echo "Recorded previous values (saved to $STATE):"; show "$before"
    released=$(python3 -c 'import json,sys; d=json.loads(sys.argv[1]); v=[x for x in (d["PERPETUA_RELEASED_PROFILES"] or "").split(",") if x.strip()]; p=sys.argv[2]; v += [] if p in v else [p]; print(",".join(v))' "$before" "$PROFILE")
    # ^@^ sets "@" as the separator so the comma-separated profile list survives.
    gcloud run services update "$SERVICE" --region "$REGION" --quiet \
      --update-env-vars "^@^WRITES_ENABLED=true@PERPETUA_RELEASED_PROFILES=$released" >/dev/null \
      || { rm -f "$STATE"; echo "Update failed; nothing changed and no window recorded."; exit 1; }
    echo "OPEN. New values:"; show "$(current)"
    ;;
  close)
    [ -f "$STATE" ] || { echo "No write window recorded; nothing to restore. Check with: status"; exit 1; }
    before="$(cat "$STATE")"
    args=$(python3 -c '
import json, sys
d = json.loads(sys.argv[1]); upd = []; rem = []
for k in ("WRITES_ENABLED", "PERPETUA_RELEASED_PROFILES"):
    (upd.append(f"{k}={d[k]}") if d[k] is not None else rem.append(k))
out = []
if upd: out += ["--update-env-vars", "^@^" + "@".join(upd)]
if rem: out += ["--remove-env-vars", ",".join(rem)]
print("\n".join(out))' "$before")
    mapfile -t ARGS <<< "$args"
    gcloud run services update "$SERVICE" --region "$REGION" --quiet "${ARGS[@]}" >/dev/null
    after="$(current)"
    echo "CLOSED. Restored values:"; show "$after"
    python3 -c '
import json, sys
b, a = json.loads(sys.argv[1]), json.loads(sys.argv[2])
bad = [k for k in ("WRITES_ENABLED", "PERPETUA_RELEASED_PROFILES") if b[k] != a[k]]
sys.exit("MISMATCH, check by hand: " + ", ".join(bad) if bad else 0)' "$before" "$after"
    rm -f "$STATE"
    echo "Matches the values recorded before the window opened."
    ;;
  *) sed -n '2,8p' "$0"; exit 2 ;;
esac
