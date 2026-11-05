# Harvaza monthly re-bake — Oct 2026 (NEEDS REVIEW)

Status: **not baked.** `clients/harvaza/data.js`, `config.js` and `index.html` are unchanged; `main` untouched.
Source: MerchantSpring (pulled 2026-11-05, tz Europe/London, includeTax:true). Oct = 1–31 Oct 2026; prior = Sep 2026.

## Self-check that failed
Gate 5 — a headline metric swung >60% MoM (UK advertising):

| UK (£) | Oct 2026 | Sep 2026 (baked) | MoM |
|---|---|---|---|
| Ad spend | £474.34 | £193 | +146% |
| Ad sales | £973.00 | £466 | +109% |
| TACOS | 27.6% | 12.8% | +14.8pt |
| ROAS | 2.05× | 2.42× | down |

Runbook says to route this to a human rather than publish. Pattern: daily spend ran ~£19/day for the first
three weeks of Oct, then fell to £2–7/day from 24 Oct. HBPACK-6x200 alone took £354 spend at 71.9% ACOS.
Looks like a genuine budget/bid change rather than a data error, but needs confirming (Ryan).

## Figures verified (reconcile)
- UK sales £1,716.26 (daily sum = getSalesByProduct), +14.2% vs £1,502.30. 83 units, 79 orders.
- UK ad spend £474.34 (daily sum = getSalesByProduct = P&L advertising).
- US sales $390.25 (getSalesByProduct), +28.7% vs $303.15. US ad spend $0.
- UK P&L (accrual): net revenue £1,673.43, expenses £1,539.09, net profit £134.34 (8.0% margin).
- Within the gate: UK and US sales swings. Sep→Oct UK net margin vs prior month [TO CONFIRM — Sep P&L not re-pulled].

## Not done (stopped at the gate)
Per-month P&L, product portfolio, inventory/OOS count, 3m/6m sums, revBreakChart, adChart, `APP_VER` bump,
`reportPeriodLabel`. If the ad ramp is confirmed as intentional, re-run the routine or ask for the bake to
be completed on this branch.
