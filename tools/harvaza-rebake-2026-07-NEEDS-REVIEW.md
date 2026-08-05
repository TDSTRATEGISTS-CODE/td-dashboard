# Harvaza monthly re-bake — July 2026 — FAILED (self-check gate)

Run: 2026-08-05, target month July 2026 (first monthly run of the automated routine —
`clients/harvaza/data.js` was still holding its original May-2026 hand-bake, so this run
would have covered May/Jun/Jul in one go). **No files were changed** — the MerchantSpring
pulls needed for step 1 (headline actuals) and step 4 (advertising) returned mutually
inconsistent figures for the same channel/period, and the routine will not publish a
guessed or averaged number to a live client dashboard.

## What failed

Self-check gate item 2 ("every expected pull returned data") and item 5 (sanity pass) —
more precisely, the underlying MerchantSpring tools disagree with each other for the
identical UK channel (`106474509`), identical date range (Apr 1–30 2026, epochs
`1775001600`–`1777593599`, tz `Europe/London`). Four different tools, four different ad
spend figures for the same month:

| Source call | Ad spend (UK, Apr 2026) | Ad sales |
|---|---|---|
| `getSalesByPeriod` (single-month range, `interval:'M'`) | £536.82 | £1,496.00 |
| `getSalesByPeriod` (Jan→Jul range, `interval:'M'`, same month's bucket) | £268.41 | £748.00 (exactly half of the row above) |
| `getAdvertisingByChannels` (`searchText:"Harvaza"`, Apr range) | £280.69 | £786.97 |
| `getStoreProfitAndLoss` (`advertisingSpend` field, Apr range) | £131.96 | n/a |

Spread is >4× between min and max for the same real-world number. This isn't a
definitional difference (ordered vs settled revenue, etc. — expected and documented in
the runbook); these are all meant to be "how much did we spend on UK ads in April," and
they don't reconcile even approximately.

Separately (lower severity, but adds to the picture): `getSalesByChannels` — the tool the
runbook's step 1 says to use for `rev`/`mktRows`/chip totals — now returns **all monetary
values forced to USD** ("Monetary values ... are always returned in USD for cross-channel
comparison ... does not return the original native-currency amount or exchange rate"),
which contradicts the runbook's assumption of native £/$ per market. `getSalesByPeriod`
(single-channel) does return native currency and was used as a workaround for that part,
but it's the tool that then produced the conflicting ad figures above. Also note:
`getSalesByPeriod` mislabels bucket month names by one month when queried across a
multi-month range (e.g. requesting Mar 1–31 returns a row labelled `"Mar 2026" →
"Apr 2026"`, duplicated twice) — cosmetic, not the cause of the value mismatch above,
since single-month-range requests show the same label bug without a duplicate-value bug,
and the value mismatch persists even comparing single-month-range calls to the dedicated
ads/P&L endpoints.

## What was NOT touched

`clients/harvaza/data.js`, `clients/harvaza/config.js`, `index.html` — all untouched.
`sections.founder` was never in scope for this bake (served live by
`harvaza-sheet-proxy.gs`) and was not touched either.

## Suggested next step

Re-run the routine once MerchantSpring's numbers for Harvaza reconcile again (worth
checking whether this is Harvaza-specific or account-wide, and whether it's a transient
sync issue vs. a permanent API change) — or re-bake by hand, picking one tool as the
source of truth per field and documenting that choice in the runbook (README →
"Re-baking Harvaza's Amazon data") rather than leaving it implicit.
