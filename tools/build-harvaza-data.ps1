<#
  build-harvaza-data.ps1  -  Harvaza Amazon snapshot generator (on-demand)
  ------------------------------------------------------------------------
  Mirrors build-amacx-data.ps1's strategy: bake a MerchantSpring snapshot into the client's data.js.
  Harvaza is a FOUNDER-template client, so this baker ONLY owns the AMAZON block; the founder
  sections (overview/pnl/stock/loan) + the Google-Sheet/Notion proxy overlay are NOT touched.

  It regenerates the Amazon `dateRanges` (may/3m/6m) + `sections.{products,inventory,pnl,advertising}`
  and writes them to  tools/harvaza-amazon-baked.js  for you to splice into clients/harvaza/data.js
  (between the matching keys). It does NOT overwrite data.js, to keep the hand-tuned founder content safe.

  CHANNELS (getChannels):
    Harvaza Distribution UK  channelId 106474509  merchantId 'APPQBM8SKYNLC @ A1F83G8C2ARO7P'  (GBP, ads connected)
    Harvaza Distribution US  channelId 106482207  merchantId 'A3LN9JCI8BPO2W @ ATVPDKIKX0DER'  (USD, ads not connected)

  TO REFRESH (re-pull in a Claude session, then update the $UK/$US/$PNL/$ADV/$INV literals below):
    sales/orders/units/aov/cvr per period : getSalesByChannels (searchText 'Harvaza', includeTax:true)
       periods: may = May 2026 (1-31) | 3m = Mar 1-May 31 | 6m = Jan 1-Jun 25 (YTD)   [NOT 30-day capped]
    P&L (per market)                      : getStoreProfitAndLoss  [30-day capped -> May only; sum months for 3m/6m]
    advertising (per market)              : getAdvertisingByChannels [30-day capped]; UK last active = Mar 28-Apr 26
    inventory (qty/daysCover)             : getSalesByProduct (current quantity + daysCover)
  Currencies: UK = GBP, US = USD - shown per-market, never summed across currencies.
  Snapshot baked: pulled 2026-06-25.
#>

$ErrorActionPreference = 'Stop'
$OutFile = Join-Path $PSScriptRoot 'harvaza-amazon-baked.js'

# non-ASCII as char codes (PS 5.1 reads scripts as ANSI; literal pound/multiply/dash can mangle)
$P=[string][char]0x00A3; $ND=[string][char]0x2013; $DOT=[string][char]0x00B7; $UP=[string][char]0x25B2; $MUL=[string][char]0x00D7

# NB: do NOT name a function 'GBP' — it's a built-in alias (Get-PSBreakpoint) that shadows it.
# Grp = thousands grouping via regex (plain ASCII comma) — reliable; $P is [string] so + concatenates.
function Grp($n){ ([long][math]::Round([double]$n)).ToString() -replace '\B(?=(\d{3})+(?!\d))', ',' }
function Pnd($n){  $P + (Grp $n) }
function Usd($n){  '$' + (Grp $n) }
function Pnd2($n){ $P + ('{0:0.00}' -f [double]$n) }
function Usd2($n){ '$' + ('{0:0.00}' -f [double]$n) }
function Cvr($n){ ('{0:N1}' -f [double]$n) + '%' }
function CvrCls($n){ if([double]$n -ge 8){'bg'} elseif([double]$n -ge 4){'ba'} else {'br'} }

# ---------------- Per-period sales actuals (getSalesByChannels, includeTax) ----------------
# Each: UK = GBP, US = USD. cvr = MerchantSpring conversions (units / pageViews).
$PER = [ordered]@{
  may = @{ short="May 2026";       label="Last Month $DOT May 2026"
           uk=@{sales=3832; orders=105; units=114; aov=36.49; cvr=19.5}
           us=@{sales=866;  orders=35;  units=44;  aov=24.74; cvr=3.1} }
  '3m'= @{ short="Mar${ND}May 2026"; label="Last 3 Months $DOT Mar${ND}May 2026"
           uk=@{sales=9691; orders=309; units=339; aov=31.36; cvr=14.5}
           us=@{sales=1543; orders=68;  units=79;  aov=22.69; cvr=1.9} }
  '6m'= @{ short="Jan${ND}Jun 2026"; label="Year to Date $DOT Jan${ND}Jun 2026"
           uk=@{sales=11107;orders=358; units=395; aov=31.03; cvr=13.5}
           us=@{sales=1894; orders=87;  units=98;  aov=21.77; cvr=2.0} }
}

# ---------------- Amazon P&L (getStoreProfitAndLoss) - May 2026 (last full month) ----------------
$PNL = @{
  uk=@{ rev=1895; sales=2285; ad=201; selling=330; ship=341; other=35; promo=87; cogs=768; exp=1640; profit=255; margin=13.4; units=114; orders=105 }
  us=@{ rev=758;  profit=214; margin=28.2 }
}
# ---------------- Advertising (getAdvertisingByChannels) - UK last active Mar 28-Apr 26 ----------------
$ADV = @{ spend=329; sales=1071; acos=30.7; roas=3.26; tacos=11.4 }
# ---------------- Inventory (getSalesByProduct quantity + daysCover) ----------------
$INV = @(
  @{ dot='da'; name="Bervera 24${MUL}200ml $ND UK"; note='B0CQRHMWFL '+$DOT+' FBA '+$DOT+' Low';      units='2 units';  uc='amber'; days='~2 days' }
  @{ dot='dr'; name="Bervera 6${MUL}200ml $ND UK";  note='B0D29PL6NJ '+$DOT+' FBA '+$DOT+' Critical'; units='1 unit';   uc='red';   days='<1 day'; dc='red' }
  @{ dot='dg'; name="Hydrte Nero Black $ND US";     note='B0B1N844DS '+$DOT+' FBA '+$DOT+' Healthy';  units='53 units'; days='~145 days' }
  @{ dot='dg'; name="Hydrte Slate Grey $ND US";     note='B0CHJNPWHV '+$DOT+' FBA '+$DOT+' Healthy';  units='15 units'; days='~75 days' }
)

# ---------------- generate products section JS for one period ----------------
function ProductsJs($pk){
  $d=$PER[$pk]; $uk=$d.uk; $us=$d.us
  $orders=$uk.orders + $us.orders; $units=$uk.units + $us.units
  $kpis = "kpis: [`n" +
    "        { bar: '#2C3420', lbl: 'UK Sales', val: '$(Pnd $uk.sales)', dCls: 'df', d: '$($d.short)', s: 'Amazon' },`n" +
    "        { bar: '#3B6D11', lbl: 'Orders',   val: '$orders', dCls: 'df', d: 'UK $($uk.orders) $DOT US $($us.orders)', s: '$($d.short)' },`n" +
    "        { bar: '#1e4fa0', lbl: 'Units',    val: '$units', dCls: 'df', d: 'UK $($uk.units) $DOT US $($us.units)', s: '$($d.short)' },`n" +
    "        { bar: '#C8A84B', lbl: 'AOV (UK)', val: '$(Pnd2 $uk.aov)', dCls: 'df', d: 'UK', s: 'US $(Usd2 $us.aov)' }`n      ]"
  $table = "table: [`n" +
    "        { flag: 'gb', name: 'Amazon UK', revenue: '$(Pnd $uk.sales)', units: '$($uk.units)', orders: '$($uk.orders)', cvr: '$(Cvr $uk.cvr)', cvrCls: '$(CvrCls $uk.cvr)', aov: '$(Pnd2 $uk.aov)' },`n" +
    "        { flag: 'us', name: 'Amazon US', revenue: '$(Usd $us.sales)', units: '$($us.units)', orders: '$($us.orders)', cvr: '$(Cvr $us.cvr)', cvrCls: '$(CvrCls $us.cvr)', aov: '$(Usd2 $us.aov)' }`n      ]"
  "{ $kpis, $table }"
}

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("/* ===== GENERATED by build-harvaza-data.ps1 - splice into clients/harvaza/data.js ===== */")
[void]$sb.AppendLine("/* Amazon dateRanges (may/3m/6m): keep the founder chip cols (6) + ad cols as in data.js; */")
[void]$sb.AppendLine("/* this file emits the per-period Products sections that vary with each pull.            */`n")
foreach($pk in $PER.Keys){
  [void]$sb.AppendLine("// dateRanges['$pk'].sec.products  ($($PER[$pk].short))")
  [void]$sb.AppendLine("products: $(ProductsJs $pk),`n")
}
[void]$sb.AppendLine("// sections.products (default = Last Month / may)")
[void]$sb.AppendLine("products: $(ProductsJs 'may')")

# P&L + advertising + inventory are emitted as a reminder of the current snapshot (refresh in data.js by hand)
[void]$sb.AppendLine("`n/* P&L (May): UK rev $(Pnd $PNL.uk.rev) net $(Pnd $PNL.uk.profit) @ $($PNL.uk.margin)% | US rev $(Usd $PNL.us.rev) net $(Usd $PNL.us.profit) @ $($PNL.us.margin)% */")
[void]$sb.AppendLine("/* Advertising (Mar${ND}Apr, paused): spend $(Pnd $ADV.spend) sales $(Pnd $ADV.sales) ACOS $($ADV.acos)% ROAS $($ADV.roas)$MUL TACOS $($ADV.tacos)% */")

[System.IO.File]::WriteAllText($OutFile, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Wrote $OutFile"
Write-Host ("Periods: " + (($PER.Keys) -join ', '))
foreach($pk in $PER.Keys){ Write-Host ("  {0,-4} UK {1} / US {2}" -f $pk, (Pnd $PER[$pk].uk.sales), (Usd $PER[$pk].us.sales)) }
