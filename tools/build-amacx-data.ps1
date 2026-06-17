<#
  build-amacx-data.ps1  —  AMACX snapshot generator (on-demand)
  --------------------------------------------------------------
  Merges MerchantSpring ACTUALS (sales/spend/units/orders/adSales, by month, by market)
  with the SHEET BUDGETS (which MerchantSpring doesn't have) and writes clients/amacx/data.js.
  Loaded via dataSource.type:'appsScript', overlay:'sections' — the live proxy overlays ONLY the
  sheet-controlled sections (ad budgets/forecast, overview tasks/flags/completed) + per-market budgets;
  the baked dateRanges + MerchantSpring sections below are authoritative and are NOT overlaid.

  Monthly $M actuals: SALES/units/orders = MerchantSpring SINGLE-MONTH getSalesByPeriod (includeTax:true,
  matches Seller Central). NOTE the multi-month interval=M series has unreliable bucket labels — do NOT
  use it. adSpend/adSales = getAdvertisingByChannels. Re-pulled 2026-06-17 (idx5-16). Re-run after editing.

  Months index: 0=Jan2025 .. 11=Dec2025, 12=Jan2026 .. 16=May2026

  NOTE: sections.products.groupsByPeriod (per-period x per-market product groups, with ad spend + TACOS)
  is a BAKED literal, injected by a SEPARATE PowerShell pass from per-period getSalesByProduct pulls joined
  to the sheet's SKU->Group map. Re-running THIS script preserves it; to REFRESH the group numbers, re-run
  that injection pass — editing $M alone will NOT update groupsByPeriod.
#>

$ErrorActionPreference = 'Stop'
$OutFile = Join-Path $PSScriptRoot '..\clients\amacx\data.js'

# non-ASCII as char codes so PS 5.1 script-reading can't mangle them
$EUR=[char]0x20AC; $DOT=[char]0x00B7; $ND=[char]0x2013; $EMD=[char]0x2014; $UP=[char]0x25B2; $DN=[char]0x25BC; $MUL=[char]0x00D7

# ---------------- MerchantSpring actuals (clean monthly series) ----------------
# sales = GROSS / inc-VAT (includeTax:true) — single-month getSalesByPeriod, to match Seller Central.
# Re-verified 2026-06-17: sales/units/orders unchanged from 06-11 (May-26 confirmed exact across DE/FR/ES/IT).
# adSpend/adSales REFRESHED 2026-06-17 for idx5-16 (Jun-25..May-26) from getAdvertisingByChannels (attribution
# restated since 06-11); idx0-4 (Jan-May 2025) kept (settled). May-26 EU TACOS 26.2% / ROAS 3.82x.
$M = @{
  DE = @{
    sales   = @(399.86,717.81,1180.18,1467.06,2919.53,3237.85,4835.34,5180.57,3597.35,1563.41,1170.27,946.24,2154.35,1150.25,1913.67,2240.07,2094.59)
    units   = @(15,26,39,50,91,106,154,169,115,50,39,35,72,38,59,70,66)
    orders  = @(15,24,39,48,83,97,143,155,108,47,37,27,61,36,53,62,62)
    adSpend = @(0,0,175.99,370.74,296.90,763.44,1505.00,1562.40,800.82,626.95,311.53,58.67,142.15,76.55,364.40,676.99,529.17)
    adSales = @(0,0,320.06,762.16,1203.74,1503.46,2964.57,2808.71,1996.46,813.31,553.31,706.50,947.26,349.36,1149.65,1903.13,1286.29)
  }
  FR = @{
    sales   = @(0,0,29.95,0,388.55,115.68,955.12,1103.77,750.26,561.77,347.13,511.77,569.04,503.23,868.14,1577.44,2201.05)
    units   = @(0,0,1,0,13,4,33,37,24,17,11,16,20,18,28,47,68)
    orders  = @(0,0,1,0,13,4,33,33,19,15,10,15,18,18,26,46,63)
    adSpend = @(0,0,0,10.09,278.04,129.58,375.21,324.03,252.52,181.67,101.75,19.28,58.35,27.64,167.83,463.84,575.45)
    adSales = @(0,0,0,28.39,155.97,47.20,460.73,648.92,189.20,227.12,91.80,160.81,243.09,157.45,282.00,903.61,1285.21)
  }
  ES = @{
    sales   = @(0,36.05,0,102.25,79.07,548.20,648.62,731.29,1021.48,583.23,588.84,693.44,351.85,616.90,1034.02,1630.37,2166.81)
    units   = @(0,1,0,3,3,16,21,26,37,19,19,24,13,20,33,52,68)
    orders  = @(0,1,0,3,3,15,18,24,36,18,18,23,12,19,30,50,63)
    adSpend = @(0,0,0,0,0,157.24,150.80,193.86,283.16,311.21,109.16,26.80,22.54,45.96,221.47,402.39,608.46)
    adSales = @(0,0,0,0,0,55.37,157.02,429.09,388.69,366.71,249.61,247.79,77.10,222.38,456.61,877.01,1104.55)
  }
  IT = @{
    sales   = @(0,57.85,89.75,200.65,336.71,620.03,995.44,1290.47,1202.05,791.09,1053.21,865.74,853.25,1328.87,1144.99,1574.68,2392.84)
    units   = @(0,2,3,6,11,21,33,43,38,24,33,28,28,40,35,46,67)
    orders  = @(0,2,3,6,11,19,33,41,38,24,32,27,23,37,33,41,58)
    adSpend = @(0,0,0,0,333.76,188.46,330.08,427.73,297.66,220.57,140.79,58.52,52.29,69.49,196.46,465.71,603.90)
    adSales = @(0,0,0,0,135.23,345.75,611.85,881.57,543.61,255.06,541.71,413.01,320.37,480.10,487.50,706.22,1290.91)
  }
}
$MARKETS = 'DE','FR','ES','IT'         # NLD pending launch — excluded
$FLAG = @{ DE='de'; FR='fr'; ES='es'; IT='it' }

# ---------------- Sheet budgets (from the Apps Script proxy) ----------------
# Synced to the live sheet (Apps Script proxy) 2026-06-11. 2025 matched; may/3m/6m/12m were stale.
$BUD = @{
  may   = @{ DE=1200;  FR=550;  ES=450;  IT=500  }
  '3m'  = @{ DE=2450;  FR=1400; ES=1150; IT=1250 }
  '6m'  = @{ DE=3300;  FR=1900; ES=1500; IT=1850 }
  '2025'= @{ DE=12680; FR=2400; ES=1300; IT=2500 }
  '12m' = @{ DE=14500; FR=3900; ES=2800; IT=4200 }   # trailing-12 (Jun25-May26) = Jun-Dec25 + new 6m
}

# ---------------- Period -> month indices ----------------
$PERIODS = [ordered]@{
  may    = @{ idx=@(16);             prior=15;    label='May 2026';                short='May 2026' }
  '3m'   = @{ idx=@(14,15,16);       prior=$null; label="Mar${ND}May 2026";        short="Mar${ND}May 2026" }
  '6m'   = @{ idx=@(12,13,14,15,16); prior=$null; label="Jan${ND}May 2026 (YTD)";  short="Jan${ND}May 2026" }
  '2025' = @{ idx=@(0..11);          prior=$null; label='Full Year 2025';          short='FY 2025' }
  '12m'  = @{ idx=@(5..16);          prior=$null; label='Last 12 Months';          short='Last 12 Months' }
}

# ---------------- helpers ----------------
function Sum($arr,$idx){ $s=0.0; foreach($i in $idx){ $s+=[double]$arr[$i] }; $s }
function Money($n){ $EUR + ('{0:N0}' -f [math]::Round([double]$n)) }
function Pct1($n){ ('{0:N1}' -f [double]$n) + '%' }
function RoasF($n){ ('{0:N2}' -f [double]$n) + $MUL }
function AovF($n){ $EUR + ('{0:N2}' -f [double]$n) }
function MoM($cur,$prev){ if($prev -le 0){return $EMD}; $p=(($cur-$prev)/$prev)*100; $a=if($p -ge 0){$UP}else{$DN}; "$a " + ('{0:N1}' -f [math]::Abs($p)) + '%' }
function TacosBadge($t){ if($t -le 0){'bb'} elseif($t -lt 19){'bg'} elseif($t -le 27){'ba'} else {'br'} }
function MonShort($i){ @('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec')[$i % 12] }
function JStr($s){ if($null -eq $s){'null'} else { "'" + ([string]$s).Replace("'","\'") + "'" } }
# Trend-chart series helpers (trailing window): rounded monthly values + monthly TACOS%.
function NumArr($arr,$idx){ ($idx | ForEach-Object { [string][math]::Round([double]$arr[$_]) }) -join ',' }
function TacosArr($salesArr,$spendArr,$idx){ ($idx | ForEach-Object { $s=[double]$salesArr[$_]; $sp=[double]$spendArr[$_]; $t= if($s){[math]::Round(($sp/$s)*100,1)}else{0}; [string]$t }) -join ',' }

# EU monthly totals (sum of 4 markets)
$EU = @{ sales=@(); units=@(); orders=@(); adSpend=@(); adSales=@() }
for($i=0;$i -lt 17;$i++){
  $EU.sales   += ($MARKETS | ForEach-Object { [double]$M[$_].sales[$i] }   | Measure-Object -Sum).Sum
  $EU.units   += ($MARKETS | ForEach-Object { [double]$M[$_].units[$i] }   | Measure-Object -Sum).Sum
  $EU.orders  += ($MARKETS | ForEach-Object { [double]$M[$_].orders[$i] }  | Measure-Object -Sum).Sum
  $EU.adSpend += ($MARKETS | ForEach-Object { [double]$M[$_].adSpend[$i] } | Measure-Object -Sum).Sum
  $EU.adSales += ($MARKETS | ForEach-Object { [double]$M[$_].adSales[$i] } | Measure-Object -Sum).Sum
}

# Campaign-mix pie (fixed trailing-12, by spend share; SD spends but barely converts).
$mixJs = "{ slices:[ {name:'Sponsored Products',color:'#404935',pct:82.5,sales:'${EUR}28.7k',acos:'45.1%'}, {name:'Sponsored Brands',color:'#6b7160',pct:9.3,sales:'${EUR}4.5k',acos:'32.6%'}, {name:'Sponsored Display',color:'#a7ab90',pct:8.3,sales:'${EUR}0.0k',acos:'n/a'} ] }"

# Per-market KPI fields — same maths/format as the EU cards above, computed for ONE market so the
# sidebar market filter can overlay the headline KPIs (Overview + Advertising) with that market's
# numbers instead of the EU total. Returns an ordered hashtable keyed by the data.js KPI field names.
function MarketKpi($sales,$adSpend,$adSales,$units,$orders,$idx,$prior,$pk){
  $rev=Sum $sales $idx; $spend=Sum $adSpend $idx; $u=Sum $units $idx; $o=Sum $orders $idx; $as=Sum $adSales $idx
  $tacos= if($rev){($spend/$rev)*100}else{0}
  $roas = if($spend){$rev/$spend}else{0}
  $aov  = if($o){$rev/$o}else{0}
  $h=[ordered]@{}
  $h.rev=Money $rev; $h.adSales=Money $as; $h.tacos=Pct1 $tacos; $h.roas=RoasF $roas; $h.spend=Money $spend; $h.aov=AovF $aov
  $h.tacosAd=Pct1 $tacos; $h.roasAd=RoasF $roas
  $h.revC='du'; $h.adSalesC='df'; $h.tacosC='df'; $h.roasC='df'; $h.spendC='df'; $h.aovC='df'; $h.tacosAdC='df'; $h.roasAdC='df'
  $h.tacosS='Target <20%'; $h.roasS=''; $h.roasAdS=(Money $rev)+' revenue'; $h.aovD=''; $h.aovS=''
  $h.adSalesS= if($rev){(Pct1 (($as/$rev)*100))+' of revenue'}else{''}
  if($pk -eq 'may'){
    $pm=MonShort 3
    $pRev=[double]$sales[$prior]; $pSpend=[double]$adSpend[$prior]; $pAdSal=[double]$adSales[$prior]
    $pTacos= if($pRev){($pSpend/$pRev)*100}else{0}; $pRoas= if($pSpend){$pRev/$pSpend}else{0}
    $h.revD=(MoM $rev $pRev)+' MoM'; $h.revC= if($rev -ge $pRev){'du'}else{'dd'}; $h.revS='vs '+(Money $pRev)+" $pm"
    $h.spendD=(MoM $spend $pSpend)+' MoM'; $h.spendS='vs '+(Money $pSpend)+" $pm"
    $ppd=$tacos-$pTacos; $tA= if($ppd -le 0){$DN}else{$UP}
    $h.tacosD="$tA "+('{0:N1}' -f [math]::Abs($ppd))+"pp vs $pm"; $h.tacosC= if($ppd -le 0){'du'}else{'dd'}
    $h.tacosAdD=$h.tacosD; $h.tacosAdC=$h.tacosC
    $rd=$roas-$pRoas; $rA= if($rd -ge 0){$UP}else{$DN}
    $h.roasD="$rA "+('{0:N2}' -f [math]::Abs($rd))+$MUL+" vs $pm"; $h.roasC= if($rd -ge 0){'du'}else{'dd'}
    $h.roasAdD=$h.roasD; $h.roasAdC=$h.roasC
    $h.roasS=('{0:N0}' -f $u)+" units $DOT AOV "+(AovF $aov)
    $h.aovS=('{0:N0}' -f $o)+' orders '+(MonShort 4)
    $h.adSalesD=(MoM $as $pAdSal)+' MoM'; $h.adSalesC= if($as -ge $pAdSal){'du'}else{'dd'}
  } else {
    $desc=@{ '3m'='3-month actuals'; '6m'='5-month actuals'; '2025'='Full year actuals'; '12m'='Trailing 12 months' }[$pk]
    $h.revD=$desc; $h.revS=''; $h.spendD=$desc; $h.spendS=''; $h.tacosD=''; $h.tacosAdD=''
    $h.roasD=''; $h.roasAdD=''; $h.adSalesD=$desc
  }
  return $h
}

$jsPeriods = @()
$summary = @()

foreach($pk in $PERIODS.Keys){
  $def = $PERIODS[$pk]; $idx = $def.idx

  $rev=Sum $EU.sales $idx; $spend=Sum $EU.adSpend $idx; $units=Sum $EU.units $idx
  $orders=Sum $EU.orders $idx; $adSal=Sum $EU.adSales $idx
  $tacos= if($rev){($spend/$rev)*100}else{0}
  $roas = if($spend){$rev/$spend}else{0}
  $aov  = if($orders){$rev/$orders}else{0}

  $revD='';$revC='du';$revS='';$spendD='';$spendC='df';$spendS='';$tacosD='';$tacosC='df';$roasD='';$roasC='df';$roasS='';$aovS='';$adSalesD='';$adSalesC='df';$adSalesS=''
  if($pk -eq 'may'){
    $pr=$def.prior; $pm=MonShort 3
    $prevRev=$EU.sales[$pr]; $prevSpend=$EU.adSpend[$pr]; $prevAdSal=$EU.adSales[$pr]
    $prevTacos= if($prevRev){($prevSpend/$prevRev)*100}else{0}
    $prevRoas = if($prevSpend){$prevRev/$prevSpend}else{0}
    $revD=(MoM $rev $prevRev)+' MoM'; $revC= if($rev -ge $prevRev){'du'}else{'dd'}; $revS='vs '+(Money $prevRev)+" $pm"
    $spendD=(MoM $spend $prevSpend)+' MoM'; $spendS='vs '+(Money $prevSpend)+" $pm"
    $ppd=$tacos-$prevTacos; $tA= if($ppd -le 0){$DN}else{$UP}
    $tacosD="$tA "+('{0:N1}' -f [math]::Abs($ppd))+"pp vs $pm"; $tacosC= if($ppd -le 0){'du'}else{'dd'}
    $rd=$roas-$prevRoas; $rA= if($rd -ge 0){$UP}else{$DN}
    $roasD="$rA "+('{0:N2}' -f [math]::Abs($rd))+$MUL+" vs $pm"; $roasC= if($rd -ge 0){'du'}else{'dd'}
    $roasS=('{0:N0}' -f $units)+" units $DOT AOV "+(AovF $aov)
    $aovS=('{0:N0}' -f $orders)+' orders '+(MonShort 4)
    $adSalesD=(MoM $adSal $prevAdSal)+' MoM'; $adSalesC= if($adSal -ge $prevAdSal){'du'}else{'dd'}
    $adSalesS=(Pct1 (($adSal/$rev)*100))+' of revenue'
  } else {
    $desc=@{ '3m'='3-month actuals'; '6m'='5-month actuals'; '2025'='Full year actuals'; '12m'='Trailing 12 months' }[$pk]
    $revD=$desc; $spendD=$desc; $adSalesD=$desc; $adSalesS=(Pct1 (($adSal/$rev)*100))+' of revenue'
  }

  $rows=@()
  $budPer = $BUD[$pk]
  foreach($mk in $MARKETS){
    $ms = Sum $M[$mk].sales $idx
    $msp = Sum $M[$mk].adSpend $idx
    $mBud = [double]($budPer[$mk])
    $mt = if($ms){ ($msp/$ms)*100 } else { 0 }
    $diff = [math]::Round($mBud-$msp)
    if($diff -ge 0){ $vsCls='bg'; $vsTxt="$DN "+(Money ([math]::Abs($diff)))+' under' }
    else           { $vsCls='br'; $vsTxt="$UP "+(Money ([math]::Abs($diff)))+' over' }
    $rows += ,@($mk,$FLAG[$mk],(Money $mBud),(Money $msp),$vsCls,$vsTxt,(Money $ms),(TacosBadge $mt),(Pct1 $mt))
  }
  $rows += ,@('NLD','nl',(Money 0),(Money 0),'bb','Early launch',(Money 0),'bb',[string]$EMD)
  $budTot = 0.0; foreach($mm in $MARKETS){ $budTot += [double]($budPer[$mm]) }
  $util= if($budTot){[math]::Round(($spend/$budTot)*100)}else{0}
  $rows+= ,@('Total EU',$null,(Money $budTot),(Money $spend),'bg',"$util% utilised",(Money $rev),(TacosBadge $tacos),(Pct1 $tacos))

  $rowsJs=($rows | ForEach-Object { '['+(($_ | ForEach-Object { JStr $_ }) -join ',')+']' }) -join ",`n      "

  # Per-market KPI overlay (de/fr/es/it) — read by app.js applyMarketKpis when a market is selected.
  $mkpis=@()
  foreach($mk in $MARKETS){
    $k = MarketKpi $M[$mk].sales $M[$mk].adSpend $M[$mk].adSales $M[$mk].units $M[$mk].orders $idx $def.prior $pk
    $fields = ($k.GetEnumerator() | ForEach-Object { "$($_.Key):'" + (([string]$_.Value).Replace('\','\\').Replace("'","\'")) + "'" }) -join ', '
    $mkpis += "      $($FLAG[$mk]): { $fields }"
  }
  $marketKpisJs = "{`n" + ($mkpis -join ",`n") + "`n    }"

  $obj=@"
  '$pk': {
    label: '$($def.label)', shortLabel: '$($def.short)',
    rev: '$(Money $rev)', revD: '$revD', revC: '$revC', revS: '$revS',
    adSales: '$(Money $adSal)', adSalesD: '$adSalesD', adSalesC: '$adSalesC', adSalesS: '$adSalesS',
    tacos: '$(Pct1 $tacos)', tacosD: '$tacosD', tacosC: '$tacosC', tacosS: 'Target <20%',
    roas: '$(RoasF $roas)', roasD: '$roasD', roasC: '$roasC', roasS: '$roasS',
    spend: '$(Money $spend)', spendD: '$spendD', spendC: '$spendC', spendS: '$spendS',
    tacosAd: '$(Pct1 $tacos)', tacosAdD: '$tacosD', tacosAdC: '$tacosC', tacosAdS: 'Target <20%',
    roasAd: '$(RoasF $roas)', roasAdD: '$roasD', roasAdC: '$roasC', roasAdS: '$(Money $rev) revenue',
    aov: '$(AovF $aov)', aovD: '', aovC: 'df', aovS: '$aovS',
    mktRows: [
      $rowsJs
    ],
    marketKpis: $marketKpisJs,
    campaignMix: $mixJs,
  }
"@
  $jsPeriods += $obj
  $summary += [pscustomobject]@{ Period=$def.label; Rev=(Money $rev); Spend=(Money $spend); TACOS=(Pct1 $tacos); ROAS=(RoasF $roas); Units=[int]$units; Orders=[int]$orders }
}

$header=@'
/* AMACX EU - client data (window.DASHBOARD_DATA).
   GENERATED by tools/build-amacx-data.ps1 - do not hand-edit; re-run the generator.
   ACTUALS: MerchantSpring. BUDGETS: Google Sheet. NLD pending launch (excluded from actuals).
   Loaded via dataSource overlay:'sections': the live proxy overlays only the sheet-controlled sections
   (ad budgets/forecast, overview tasks/flags/completed) + per-market budgets; baked values are otherwise authoritative. */
window.DASHBOARD_DATA = {
  dateRanges: {
'@
# ---- sections.pnl: fixed trailing-12-month P&L (Jun 2025 - May 2026), financial basis ----
# From generateChannelProfitAndLossReport (4 channels, summed to EU). Footnoted as a different
# basis to the Overview (sales-attribution). Fixed view: same regardless of the period selector.
$pnlJs = @"
{
      fixedLabel: 'Last 12 months (Jun 2025${ND}May 2026) ${DOT} financial basis',
      summary: [ {val:'${EUR}58,530',lbl:'Net Revenue',color:'brand'}, {val:'${EUR}37,697',lbl:'Total Costs',color:'red'}, {val:'${EUR}20,833',lbl:'Net Profit',color:'green'} ],
      margin: { pct:'35.6%', pctColor:'green', note:'Trailing 12 months ${DOT} financial basis (MerchantSpring) ${DOT} differs from Overview which is on a sales-attribution basis', rows:[
        {lbl:'Net Revenue', val:'${EUR}58,530'},
        {lbl:'Marketplace Fees', val:'-${EUR}9,838', color:'red'},
        {lbl:'Ad Spend', val:'-${EUR}16,035', color:'red'},
        {lbl:'COGS', val:'-${EUR}11,824', color:'red'},
        {lbl:'Net Profit', val:'${EUR}20,833', color:'green', strong:true}
      ] },
      mkt: [
        {name:'Germany',flag:'de',revenue:'${EUR}30,826',adspend:'${EUR}7,723',net:'${EUR}12,184',netColor:'green',margin:'39.5%',marginCls:'bg'},
        {name:'France',flag:'fr',revenue:'${EUR}8,145',adspend:'${EUR}2,760',net:'${EUR}2,251',netColor:'green',margin:'27.6%',marginCls:'ba'},
        {name:'Spain',flag:'es',revenue:'${EUR}7,941',adspend:'${EUR}2,332',net:'${EUR}2,536',netColor:'green',margin:'31.9%',marginCls:'bg'},
        {name:'Italy',flag:'it',revenue:'${EUR}11,618',adspend:'${EUR}3,220',net:'${EUR}3,862',netColor:'green',margin:'33.2%',marginCls:'bg'}
      ],
      statement: { groups:[
        { header:'Income', rows:[
          {lbl:'Product sales', amount:'${EUR}57,435', pct:'98.1%', unit:'${EUR}28.93'},
          {lbl:'Refunds', amount:'-${EUR}905', pct:'-1.5%', unit:'-${EUR}0.46'},
          {lbl:'Reimbursements', amount:'${EUR}2', pct:'0.0%', unit:'${EUR}0.00'},
          {lbl:'Promotions', amount:'-${EUR}2,600', pct:'-4.4%', unit:'-${EUR}1.31'},
          {lbl:'Other income', amount:'${EUR}4,598', pct:'7.9%', unit:'${EUR}2.32'},
          {lbl:'Net revenue', amount:'${EUR}58,530', pct:'100.0%', unit:'${EUR}29.49', total:true}
        ] },
        { header:'Expenses', rows:[
          {lbl:'Advertising', amount:'${EUR}16,035', pct:'27.4%', unit:'${EUR}8.08'},
          {lbl:'Selling fees', amount:'${EUR}9,803', pct:'16.7%', unit:'${EUR}4.94'},
          {lbl:'Cost of goods', amount:'${EUR}11,824', pct:'20.2%', unit:'${EUR}5.96'},
          {lbl:'Refunds and returns', amount:'${EUR}35', pct:'0.1%', unit:'${EUR}0.02'},
          {lbl:'Total expenses', amount:'${EUR}37,697', pct:'64.4%', unit:'${EUR}18.99', total:true}
        ] },
        { header:'Profit', rows:[
          {lbl:'PROFIT', amount:'${EUR}20,833', pct:'35.6%', unit:'${EUR}10.49', total:true, profit:true},
          {lbl:'Profit %', amount:'35.6%', accent:'green'}
        ] },
        { header:'Metrics', rows:[
          {lbl:'Estimated payout', amount:'${EUR}32,657', unit:'${EUR}16.45'},
          {lbl:'TACOS %', amount:'27.4%'}
        ] }
      ] },
      portfolio: { total:35, profitable:35, breakeven:0, unprofitable:0,
        most:[ {name:'Energy Gel Cola/Caffeine',profit:'${EUR}456',margin:'58%',marginCls:'bg'}, {name:'Energy Gel Orange',profit:'${EUR}319',margin:'60%',marginCls:'bg'}, {name:'Recovery Shake Chocolate',profit:'${EUR}249',margin:'53%',marginCls:'bg'} ],
        least:[ {name:'Energy Drink Forest Fruit 1kg',profit:'${EUR}131',margin:'42%',marginCls:'ba',color:'var(--green)'}, {name:'Energy Gel Raspberry',profit:'${EUR}124',margin:'45%',marginCls:'ba',color:'var(--green)'}, {name:'Protein Shake Banana',profit:'${EUR}94',margin:'45%',marginCls:'ba',color:'var(--green)'} ] }
    }
"@
# ---- sections.advertising: top campaigns (fixed trailing-12). Budgets/forecast stay sheet-controlled. ----
$advJs = @"
{
      campaigns: [
        {name:'DE ${DOT} Brand Protection',type:'Sponsored Brands',spend:'${EUR}916',sales:'${EUR}3,818',acos:'24.0%',acosCls:'bg',roas:'4.17${MUL}',cpc:'${EUR}0.96',status:'Active',statusCls:'bg'},
        {name:'DE ${DOT} Turbo Gels (Manual)',type:'Sponsored Products',spend:'${EUR}854',sales:'${EUR}640',acos:'133.4%',acosCls:'br',roas:'0.75${MUL}',cpc:'${EUR}1.60',status:'Paused',statusCls:'ba'},
        {name:'DE ${DOT} PAT Brand Defence',type:'Sponsored Products',spend:'${EUR}695',sales:'${EUR}4,858',acos:'14.3%',acosCls:'bg',roas:'6.99${MUL}',cpc:'${EUR}0.77',status:'Active',statusCls:'bg'},
        {name:'DE ${DOT} Energy Gels (Auto)',type:'Sponsored Products',spend:'${EUR}558',sales:'${EUR}556',acos:'100.4%',acosCls:'br',roas:'1.00${MUL}',cpc:'${EUR}1.47',status:'Active',statusCls:'bg'},
        {name:'DE ${DOT} Fast Oat & Recovery Bars',type:'Sponsored Products',spend:'${EUR}463',sales:'${EUR}1,109',acos:'41.7%',acosCls:'ba',roas:'2.40${MUL}',cpc:'${EUR}1.65',status:'Active',statusCls:'bg'},
        {name:'FR ${DOT} Brand Defense',type:'Sponsored Products',spend:'${EUR}702',sales:'${EUR}2,836',acos:'24.8%',acosCls:'bg',roas:'4.04${MUL}',cpc:'${EUR}1.20',status:'Active',statusCls:'bg'},
        {name:'FR ${DOT} Energy Gels (Turbo & OG) (Auto)',type:'Sponsored Products',spend:'${EUR}458',sales:'${EUR}441',acos:'103.9%',acosCls:'br',roas:'0.96${MUL}',cpc:'${EUR}1.03',status:'Active',statusCls:'bg'},
        {name:'FR ${DOT} Oat Bars (Auto)',type:'Sponsored Products',spend:'${EUR}362',sales:'${EUR}333',acos:'108.7%',acosCls:'br',roas:'0.92${MUL}',cpc:'${EUR}1.21',status:'Active',statusCls:'bg'},
        {name:'FR ${DOT} Energy Gels (Turbo & OG) (Manual)',type:'Sponsored Products',spend:'${EUR}289',sales:'${EUR}312',acos:'92.6%',acosCls:'br',roas:'1.08${MUL}',cpc:'${EUR}1.38',status:'Active',statusCls:'bg'},
        {name:'FR ${DOT} Turbo Drink (Manual)',type:'Sponsored Products',spend:'${EUR}150',sales:'${EUR}274',acos:'54.7%',acosCls:'br',roas:'1.83${MUL}',cpc:'${EUR}2.08',status:'Active',statusCls:'bg'},
        {name:'ES ${DOT} PAT Brand Defence',type:'Sponsored Products',spend:'${EUR}607',sales:'${EUR}2,746',acos:'22.1%',acosCls:'bg',roas:'4.52${MUL}',cpc:'${EUR}0.69',status:'Active',statusCls:'bg'},
        {name:'ES ${DOT} Category Banner',type:'Sponsored Brands',spend:'${EUR}415',sales:'${EUR}601',acos:'69.1%',acosCls:'br',roas:'1.45${MUL}',cpc:'${EUR}0.67',status:'Active',statusCls:'bg'},
        {name:'ES ${DOT} Energy Gels (Turbo & OG) (Auto)',type:'Sponsored Products',spend:'${EUR}344',sales:'${EUR}317',acos:'108.5%',acosCls:'br',roas:'0.92${MUL}',cpc:'${EUR}0.84',status:'Active',statusCls:'bg'},
        {name:'ES ${DOT} Hydro Tabs (Auto)',type:'Sponsored Products',spend:'${EUR}328',sales:'${EUR}243',acos:'135.0%',acosCls:'br',roas:'0.74${MUL}',cpc:'${EUR}0.76',status:'Active',statusCls:'bg'},
        {name:'ES ${DOT} Hydro Tabs (Manual)',type:'Sponsored Products',spend:'${EUR}266',sales:'${EUR}335',acos:'79.4%',acosCls:'br',roas:'1.26${MUL}',cpc:'${EUR}0.81',status:'Active',statusCls:'bg'},
        {name:'IT ${DOT} Brand Defence',type:'Sponsored Products',spend:'${EUR}902',sales:'${EUR}4,586',acos:'19.7%',acosCls:'bg',roas:'5.08${MUL}',cpc:'${EUR}0.86',status:'Active',statusCls:'bg'},
        {name:'IT ${DOT} Top of Funnel Full Catalogue',type:'Sponsored Display',spend:'${EUR}326',sales:'${EUR}0',acos:'n/a',acosCls:'br',roas:'0.00${MUL}',cpc:'${EUR}0.64',status:'Paused',statusCls:'ba'},
        {name:'IT ${DOT} Energy Gels (Manual)',type:'Sponsored Products',spend:'${EUR}289',sales:'${EUR}312',acos:'92.6%',acosCls:'br',roas:'1.08${MUL}',cpc:'${EUR}0.82',status:'Active',statusCls:'bg'},
        {name:'IT ${DOT} Energy Gels (Auto)',type:'Sponsored Products',spend:'${EUR}269',sales:'${EUR}213',acos:'126.3%',acosCls:'br',roas:'0.79${MUL}',cpc:'${EUR}0.57',status:'Active',statusCls:'bg'},
        {name:'IT ${DOT} Nougat Bar (Auto)',type:'Sponsored Products',spend:'${EUR}225',sales:'${EUR}145',acos:'155.2%',acosCls:'br',roas:'0.64${MUL}',cpc:'${EUR}0.68',status:'Active',statusCls:'bg'}
      ],
      campaignMixByPeriod: {
        'may': {
          all: { slices:[ {name:'Sponsored Products',color:'#404935',pct:80.7,sales:'${EUR}3.8k',acos:'42.1%'}, {name:'Sponsored Brands',color:'#6b7160',pct:19.3,sales:'${EUR}0.9k',acos:'45.3%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          de: { slices:[ {name:'Sponsored Products',color:'#404935',pct:61.9,sales:'${EUR}0.8k',acos:'46.7%'}, {name:'Sponsored Brands',color:'#6b7160',pct:38.1,sales:'${EUR}0.5k',acos:'31.6%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          fr: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'${EUR}1.2k',acos:'50.8%'}, {name:'Sponsored Brands',color:'#6b7160',pct:0,sales:'${EUR}0.0k',acos:'n/a'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          es: { slices:[ {name:'Sponsored Products',color:'#404935',pct:58.1,sales:'${EUR}0.6k',acos:'54.3%'}, {name:'Sponsored Brands',color:'#6b7160',pct:41.9,sales:'${EUR}0.5k',acos:'58.1%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          it: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'${EUR}1.3k',acos:'25.7%'}, {name:'Sponsored Brands',color:'#6b7160',pct:0,sales:'${EUR}0.0k',acos:'n/a'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] }
        },
        '3m': {
          all: { slices:[ {name:'Sponsored Products',color:'#404935',pct:78.9,sales:'${EUR}9.2k',acos:'41.9%'}, {name:'Sponsored Brands',color:'#6b7160',pct:21.1,sales:'${EUR}2.5k',acos:'31.9%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          de: { slices:[ {name:'Sponsored Products',color:'#404935',pct:57,sales:'${EUR}2.5k',acos:'45.9%'}, {name:'Sponsored Brands',color:'#6b7160',pct:43,sales:'${EUR}1.9k',acos:'19.6%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          fr: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'${EUR}2.4k',acos:'46.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:0,sales:'${EUR}0.0k',acos:'n/a'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          es: { slices:[ {name:'Sponsored Products',color:'#404935',pct:75.4,sales:'${EUR}1.8k',acos:'44.6%'}, {name:'Sponsored Brands',color:'#6b7160',pct:24.6,sales:'${EUR}0.6k',acos:'69.1%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          it: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'${EUR}2.5k',acos:'32.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:0,sales:'${EUR}0.0k',acos:'n/a'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] }
        },
        '6m': {
          all: { slices:[ {name:'Sponsored Products',color:'#404935',pct:80.5,sales:'${EUR}12.9k',acos:'33.8%'}, {name:'Sponsored Brands',color:'#6b7160',pct:19.5,sales:'${EUR}3.1k',acos:'30.4%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          de: { slices:[ {name:'Sponsored Products',color:'#404935',pct:59.9,sales:'${EUR}3.8k',acos:'33.2%'}, {name:'Sponsored Brands',color:'#6b7160',pct:40.1,sales:'${EUR}2.5k',acos:'20.9%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          fr: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'${EUR}3.0k',acos:'40.2%'}, {name:'Sponsored Brands',color:'#6b7160',pct:0,sales:'${EUR}0.0k',acos:'n/a'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          es: { slices:[ {name:'Sponsored Products',color:'#404935',pct:79.9,sales:'${EUR}2.4k',acos:'38.4%'}, {name:'Sponsored Brands',color:'#6b7160',pct:20.1,sales:'${EUR}0.6k',acos:'69.1%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          it: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'${EUR}3.7k',acos:'26.2%'}, {name:'Sponsored Brands',color:'#6b7160',pct:0,sales:'${EUR}0.0k',acos:'n/a'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] }
        },
        '2025': {
          all: { slices:[ {name:'Sponsored Products',color:'#404935',pct:92,sales:'${EUR}19.6k',acos:'50.6%'}, {name:'Sponsored Brands',color:'#6b7160',pct:7.8,sales:'${EUR}1.7k',acos:'34.7%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.2,sales:'${EUR}0.0k',acos:'n/a'} ] },
          de: { slices:[ {name:'Sponsored Products',color:'#404935',pct:87.8,sales:'${EUR}12.0k',acos:'44.8%'}, {name:'Sponsored Brands',color:'#6b7160',pct:12,sales:'${EUR}1.6k',acos:'33.1%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.3,sales:'${EUR}0.0k',acos:'n/a'} ] },
          fr: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'${EUR}2.0k',acos:'72.4%'}, {name:'Sponsored Brands',color:'#6b7160',pct:0,sales:'${EUR}0.0k',acos:'n/a'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          es: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'${EUR}1.9k',acos:'65.1%'}, {name:'Sponsored Brands',color:'#6b7160',pct:0,sales:'${EUR}0.0k',acos:'n/a'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          it: { slices:[ {name:'Sponsored Products',color:'#404935',pct:99.4,sales:'${EUR}3.7k',acos:'50.2%'}, {name:'Sponsored Brands',color:'#6b7160',pct:0.6,sales:'${EUR}0.0k',acos:'n/a'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] }
        },
        '12m': {
          all: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.4,sales:'${EUR}28.7k',acos:'45.1%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.4,sales:'${EUR}4.5k',acos:'32.6%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.1,sales:'${EUR}0.0k',acos:'n/a'} ] },
          de: { slices:[ {name:'Sponsored Products',color:'#404935',pct:77.2,sales:'${EUR}13.1k',acos:'44.2%'}, {name:'Sponsored Brands',color:'#6b7160',pct:22.6,sales:'${EUR}3.8k',acos:'26.1%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.2,sales:'${EUR}0.0k',acos:'n/a'} ] },
          fr: { slices:[ {name:'Sponsored Products',color:'#404935',pct:100,sales:'${EUR}4.7k',acos:'52.9%'}, {name:'Sponsored Brands',color:'#6b7160',pct:0,sales:'${EUR}0.0k',acos:'n/a'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          es: { slices:[ {name:'Sponsored Products',color:'#404935',pct:87,sales:'${EUR}4.0k',acos:'52.6%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13,sales:'${EUR}0.6k',acos:'69.1%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] },
          it: { slices:[ {name:'Sponsored Products',color:'#404935',pct:99.7,sales:'${EUR}6.9k',acos:'37.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:0.3,sales:'${EUR}0.0k',acos:'n/a'}, {name:'Sponsored Display',color:'#a7ab90',pct:0,sales:'${EUR}0.0k',acos:'n/a'} ] }
        }
      }
    }
"@
# ---- sections.inventory: FBM stock from getSalesByProduct (quantity/daysCover/OOS). ----
# Reshaped for FBM: KPIs = active/in-stock/OOS/SKUs-to-restock; stock list = OOS + healthy; restock = OOS priorities.
# DISCONTINUED SKUs are EXCLUDED from every stock section (lists AND counts) — filter the pull against
# $DISCONTINUED on each inventory re-bake. Discontinued = the sheet SKU list "Discontinued" status:
#   B0F32S8KRN Cherry Juice Booster (was OOS FR/ES/IT), B0CZ9QMR9F Energy Drink Grape (OOS FR/ES),
#   B0F331NKWY Beet Shot (on-hold all markets, already suppressed/not listed).
# Dispatch card hidden (no FBM late-dispatch source). REFRESHED 2026-06-17 from getSalesByProduct (4 channels,
# sortKey:quantity asc), EXCL. discontinued: EU 194 active listings, 140 in stock, 54 OOS (29 unique SKUs).
$DISCONTINUED = @('B0F32S8KRN','B0CZ9QMR9F','B0F331NKWY')   # never report these ASINs in any stock section
$invJs = @"
{
      kpis: [
        {bar:'green',lbl:'In Stock',val:'140',dCls:'du',d:'listings',s:'across DE/FR/ES/IT'},
        {bar:'red',lbl:'Out of Stock',val:'54',dCls:'dd',d:'listings suppressed',s:'29 unique SKUs'},
        {bar:'#404935',lbl:'Active SKUs',val:'194',dCls:'df',d:'EU listings',s:'~48 per market'},
        {bar:'amber',lbl:'SKUs to Restock',val:'9',dCls:'df',dColor:'amber',d:'OOS in 2+ markets',s:'see priority list'}
      ],
      stock: [
        {dot:'dr',name:'Fast Bar Lemon',note:'B086XB1N46 ${DOT} DE ES FR IT (14 May)',units:'0 units',unitsColor:'red',days:'OOS',daysColor:'red'},
        {dot:'dr',name:'Energy Drink Lemon 1kg',note:'B0GS21WT66 ${DOT} DE ES FR IT (15 Apr)',units:'0 units',unitsColor:'red',days:'OOS',daysColor:'red'},
        {dot:'dr',name:'Energy Ice Gel Lemon-Lime',note:'B0F332LV9B ${DOT} DE ES FR IT (18 Feb)',units:'0 units',unitsColor:'red',days:'OOS',daysColor:'red'},
        {dot:'dr',name:'Energy Drink Forest Fruit 320g',note:'B0GZ469Z98 ${DOT} DE ES FR IT (10 Jun)',units:'0 units',unitsColor:'red',days:'OOS',daysColor:'red'},
        {dot:'dr',name:'Hydro Tabs Orange',note:'B0CCJW62HZ ${DOT} DE ES FR (3 Jun)',units:'0 units',unitsColor:'red',days:'OOS',daysColor:'red'},
        {dot:'dr',name:'Turbo Drink Lemon',note:'B0GM195X6S ${DOT} DE ES FR IT (16 Jun)',units:'0 units',unitsColor:'red',days:'OOS',daysColor:'red'},
        {dot:'dr',name:'Fast Bar Vanilla',note:'B0868T4MCP ${DOT} DE ES FR IT (15 Jun)',units:'0 units',unitsColor:'red',days:'OOS',daysColor:'red'},
        {dot:'dr',name:'Energy Drink Forest Fruit 1kg',note:'B0GSWK3DNX ${DOT} DE ES FR IT (17 Jun)',units:'0 units',unitsColor:'red',days:'OOS',daysColor:'red'},
        {dot:'dg',name:'Cherry Juice+ 12x500ml',note:'B0GZW1BJ1C ${DOT} EU ${DOT} Healthy',units:'714 units',days:'>12 mo'},
        {dot:'dg',name:'Fruit Chew Blackcurrant',note:'B0C9MWY4G3 ${DOT} EU ${DOT} Healthy',units:'655 units',days:'>12 mo'},
        {dot:'dg',name:'Energy Gel Citrus',note:'B0CRFD8L2X ${DOT} EU ${DOT} Healthy',units:'447 units',days:'>12 mo'},
        {dot:'dg',name:'Turbo Drink Watermelon 850g',note:'B0GSWHPXQV ${DOT} EU ${DOT} Healthy',units:'332 units',days:'>12 mo'}
      ],
      restock: [
        {level:'red',title:'Fast Bar Lemon ${EMD} all 4 markets',sub:'B086XB1N46 ${DOT} OOS since 14 May ${DOT} top restock priority'},
        {level:'red',title:'Energy Drink Lemon 1kg ${EMD} all 4 markets',sub:'B0GS21WT66 ${DOT} OOS since 15 Apr'},
        {level:'red',title:'Energy Ice Gel Lemon-Lime ${EMD} all 4 markets',sub:'B0F332LV9B ${DOT} OOS since 18 Feb ${DOT} longest outage'},
        {level:'amber',title:'Hydro Tabs Orange ${EMD} DE/ES/FR',sub:'B0CCJW62HZ ${DOT} OOS since 3 Jun'}
      ]
    }
"@
# ---- sections.products: per-market performance + Sales-by-Group. ----
# kpis/kpisByMarket/table = fixed trailing-12 (Jun25-May26; CVR = recent session-conversion per market).
# groups/groupsByMarket = trailing-12 fallback. The LIVE Sales-by-Group card uses groupsByPeriod
# (per-period x per-market, w/ adSpend + TACOS) — a baked literal injected by the separate groups pass.
# Period-aware Products KPIs + Performance-by-Market table (computed from $M).
# CVR = MerchantSpring per-period conversion rate (units/pageViews, from getSalesByChannels, pulled 2026-06-17).
$SKU=@{de='50';fr='49';es='50';it='50'}; $MKN=@{de='Germany';fr='France';es='Spain';it='Italy'}
$CVRP=@{ may=@{de=3.4;fr=6.7;es=4.1;it=3.1}; '3m'=@{de=3.8;fr=5.5;es=4.1;it=3.2}; '6m'=@{de=4.6;fr=5.9;es=3.9;it=3.9}; '12m'=@{de=4.7;fr=4.7;es=3.5;it=3.7} }
function CvrCls($v){ if($v -ge 5){'bg'}elseif($v -ge 3){'ba'}else{'br'} }
function KpiCards($skus,$skuSub,$orders,$aov,$asp,$perMo,$lbl,$aovSub){
  "[ {bar:'#404935',lbl:'Active SKUs',val:'$skus',dCls:'df',d:'listings',s:'$skuSub'}, {bar:'green',lbl:'Orders',val:'$('{0:N0}' -f [double]$orders)',dCls:'du',d:'$lbl',s:'~$perMo/mo'}, {bar:'blue',lbl:'AOV',val:'$(AovF $aov)',dCls:'df',d:'$lbl',s:'$aovSub'}, {bar:'amber',lbl:'ASP',val:'$(AovF $asp)',dCls:'df',d:'$lbl',s:'per unit'} ]"
}
$kpiP=@(); $tblP=@()
foreach($pk in 'may','3m','6m','12m'){
  $idx=$PERIODS[$pk].idx; $sl=$PERIODS[$pk].short; $mn=@($idx).Count
  $sumR=0.0;$sumU=0.0;$sumO=0.0; $mkc=@{}; $trows=@()
  foreach($mt in $MARKETS){ $k=$FLAG[$mt]
    $r=Sum $M[$mt].sales $idx; $u=Sum $M[$mt].units $idx; $o=Sum $M[$mt].orders $idx
    $aov=if($o){$r/$o}else{0}; $asp=if($u){$r/$u}else{0}; $pm=if($mn){[math]::Round($o/$mn)}else{0}
    $sumR+=$r;$sumU+=$u;$sumO+=$o
    $mkc[$k]=KpiCards $SKU[$k] $MKN[$k] $o $aov $asp $pm $sl $MKN[$k]
    $cv=$CVRP[$pk][$k]
    $trows += "{name:'$($MKN[$k])',flag:'$k',revenue:'$(Money $r)',units:'$('{0:N0}' -f [double]$u)',orders:'$('{0:N0}' -f [double]$o)',cvr:'$cv%',cvrCls:'$(CvrCls $cv)',aov:'$(AovF $aov)'}"
  }
  $sumAov=if($sumO){$sumR/$sumO}else{0}; $sumAsp=if($sumU){$sumR/$sumU}else{0}; $sumPm=if($mn){[math]::Round($sumO/$mn)}else{0}
  $allc=KpiCards '199' '~50 per market' $sumO $sumAov $sumAsp $sumPm $sl 'blended EU'
  $kpiP += "'$pk': { all:$allc, de:$($mkc.de), fr:$($mkc.fr), es:$($mkc.es), it:$($mkc.it) }"
  $tblP += "'$pk': [ $($trows -join ', ') ]"
}
$kpisByPeriodJs = "{ " + ($kpiP -join ", ") + " }"
$tableByPeriodJs = "{ " + ($tblP -join ", ") + " }"
$prodJs = @"
{
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'199',dCls:'df',d:'EU listings',s:'~50 per market'},
        {bar:'green',lbl:'Orders (12mo)',val:'1,361',dCls:'du',d:'trailing 12 months',s:'~113/mo'},
        {bar:'blue',lbl:'AOV',val:'${EUR}42',dCls:'df',d:'12-mo avg',s:'blended EU'},
        {bar:'amber',lbl:'ASP',val:'${EUR}28.90',dCls:'df',d:'12-mo avg',s:'per unit'}
      ],
      kpisByPeriod: $kpisByPeriodJs,
      table: [
        {name:'Germany',flag:'de',revenue:'${EUR}27,939',units:'964',orders:'640',cvr:'4.4%',cvrCls:'ba',aov:'${EUR}43.65'},
        {name:'France',flag:'fr',revenue:'${EUR}8,801',units:'298',orders:'199',cvr:'7.8%',cvrCls:'bg',aov:'${EUR}44.23'},
        {name:'Spain',flag:'es',revenue:'${EUR}8,728',units:'317',orders:'214',cvr:'5.8%',cvrCls:'ba',aov:'${EUR}40.79'},
        {name:'Italy',flag:'it',revenue:'${EUR}11,967',units:'406',orders:'308',cvr:'3.6%',cvrCls:'ba',aov:'${EUR}38.85'}
      ],
      tableByPeriod: $tableByPeriodJs,
      groupsByPeriod: {
        'may': { all:[{name:'Energy Gels',sales:'${EUR}1,961',units:'65',pct:'22%',adSpend:'${EUR}743',tacos:'37.9%',tacosCls:'ba',oosRate:'14%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}1,226',units:'28',pct:'14%',adSpend:'${EUR}348',tacos:'28.4%',tacosCls:'ba',oosRate:'8%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}679',units:'24',pct:'8%',adSpend:'${EUR}233',tacos:'34.3%',tacosCls:'ba',oosRate:'11%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}900',units:'25',pct:'10%',adSpend:'${EUR}103',tacos:'11.4%',tacosCls:'bg',oosRate:'53%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}581',units:'11',pct:'7%',adSpend:'${EUR}19',tacos:'3.3%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}503',units:'16',pct:'6%',adSpend:'${EUR}111',tacos:'22.1%',tacosCls:'ba',oosRate:'10%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}519',units:'16',pct:'6%',adSpend:'${EUR}147',tacos:'28.3%',tacosCls:'ba',oosRate:'14%',oosCls:'ba'},{name:'Hydro Tabs',sales:'${EUR}746',units:'29',pct:'8%',adSpend:'${EUR}361',tacos:'48.4%',tacosCls:'br',oosRate:'45%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}503',units:'15',pct:'6%',adSpend:'${EUR}74',tacos:'14.7%',tacosCls:'bg',oosRate:'71%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}575',units:'20',pct:'6%',adSpend:'${EUR}25',tacos:'4.3%',tacosCls:'bg',oosRate:'59%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}286',units:'8',pct:'3%',adSpend:'${EUR}41',tacos:'14.3%',tacosCls:'bg',oosRate:'20%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}233',units:'5',pct:'3%',adSpend:'${EUR}48',tacos:'20.6%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}143',units:'2',pct:'2%',adSpend:'${EUR}63',tacos:'44.1%',tacosCls:'br',oosRate:'8%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'75%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'57%',oosCls:'br'}], de:[{name:'Energy Gels',sales:'${EUR}570',units:'19',pct:'27%',adSpend:'${EUR}165',tacos:'28.9%',tacosCls:'ba',oosRate:'20%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}48',units:'1',pct:'2%',adSpend:'${EUR}5',tacos:'10.4%',tacosCls:'bg',oosRate:'25%',oosCls:'ba'},{name:'Oat Bars',sales:'${EUR}311',units:'11',pct:'15%',adSpend:'${EUR}126',tacos:'40.5%',tacosCls:'br',oosRate:'20%',oosCls:'ba'},{name:'Turbo Drinks',sales:'${EUR}156',units:'4',pct:'7%',adSpend:'${EUR}68',tacos:'43.6%',tacosCls:'br',oosRate:'50%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}224',units:'4',pct:'11%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}214',units:'7',pct:'10%',adSpend:'${EUR}37',tacos:'17.3%',tacosCls:'bg',oosRate:'33%',oosCls:'ba'},{name:'Nougat Bars',sales:'${EUR}183',units:'6',pct:'9%',adSpend:'${EUR}32',tacos:'17.5%',tacosCls:'bg',oosRate:'25%',oosCls:'ba'},{name:'Hydro Tabs',sales:'${EUR}84',units:'3',pct:'4%',adSpend:'${EUR}22',tacos:'26.2%',tacosCls:'ba',oosRate:'33%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}144',units:'4',pct:'7%',adSpend:'${EUR}46',tacos:'31.9%',tacosCls:'ba',oosRate:'75%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}71',units:'3',pct:'3%',adSpend:'${EUR}2',tacos:'2.8%',tacosCls:'bg',oosRate:'57%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}39',units:'1',pct:'2%',adSpend:'${EUR}26',tacos:'66.7%',tacosCls:'br',oosRate:'33%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}51',units:'1',pct:'2%',adSpend:'${EUR}1',tacos:'2%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'0%',oosCls:'bg'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'50%',oosCls:'br'}], fr:[{name:'Energy Gels',sales:'${EUR}687',units:'23',pct:'31%',adSpend:'${EUR}207',tacos:'30.1%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Turbo Gels',sales:'${EUR}300',units:'7',pct:'14%',adSpend:'${EUR}168',tacos:'56%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}167',units:'6',pct:'8%',adSpend:'${EUR}60',tacos:'35.9%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}244',units:'7',pct:'11%',adSpend:'${EUR}35',tacos:'14.3%',tacosCls:'bg',oosRate:'50%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}50',units:'1',pct:'2%',adSpend:'${EUR}4',tacos:'8%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}126',units:'4',pct:'6%',adSpend:'${EUR}27',tacos:'21.4%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}66',units:'2',pct:'3%',adSpend:'${EUR}11',tacos:'16.7%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Hydro Tabs',sales:'${EUR}100',units:'4',pct:'5%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'33%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}64',units:'2',pct:'3%',adSpend:'${EUR}4',tacos:'6.2%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}167',units:'6',pct:'8%',adSpend:'${EUR}23',tacos:'13.8%',tacosCls:'bg',oosRate:'57%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}140',units:'4',pct:'6%',adSpend:'${EUR}5',tacos:'3.6%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Turbo Fruit Chews',sales:'${EUR}90',units:'2',pct:'4%',adSpend:'${EUR}18',tacos:'20%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}11',tacos:'-',tacosCls:'bb',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'50%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'50%',oosCls:'br'}], es:[{name:'Energy Gels',sales:'${EUR}307',units:'10',pct:'14%',adSpend:'${EUR}61',tacos:'19.9%',tacosCls:'bg',oosRate:'20%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}309',units:'7',pct:'14%',adSpend:'${EUR}97',tacos:'31.4%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}144',units:'5',pct:'7%',adSpend:'${EUR}25',tacos:'17.4%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}108',units:'3',pct:'5%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'60%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}205',units:'4',pct:'9%',adSpend:'${EUR}15',tacos:'7.3%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}33',units:'1',pct:'2%',adSpend:'${EUR}38',tacos:'115.2%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}102',units:'3',pct:'5%',adSpend:'${EUR}1',tacos:'1%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Hydro Tabs',sales:'${EUR}562',units:'22',pct:'26%',adSpend:'${EUR}339',tacos:'60.3%',tacosCls:'br',oosRate:'50%',oosCls:'br'},{name:'Fast Bars',sales:'${EUR}197',units:'6',pct:'9%',adSpend:'${EUR}6',tacos:'3%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}154',units:'5',pct:'7%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'62%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'0%',oosCls:'bg'},{name:'Turbo Fruit Chews',sales:'${EUR}46',units:'1',pct:'2%',adSpend:'${EUR}21',tacos:'45.7%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}6',tacos:'-',tacosCls:'bb',oosRate:'25%',oosCls:'ba'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'}], it:[{name:'Energy Gels',sales:'${EUR}397',units:'13',pct:'17%',adSpend:'${EUR}310',tacos:'78.1%',tacosCls:'br',oosRate:'17%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}569',units:'13',pct:'24%',adSpend:'${EUR}78',tacos:'13.7%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}57',units:'2',pct:'2%',adSpend:'${EUR}22',tacos:'38.6%',tacosCls:'ba',oosRate:'20%',oosCls:'ba'},{name:'Turbo Drinks',sales:'${EUR}392',units:'11',pct:'16%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'50%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}102',units:'2',pct:'4%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}130',units:'4',pct:'5%',adSpend:'${EUR}9',tacos:'6.9%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}168',units:'5',pct:'7%',adSpend:'${EUR}103',tacos:'61.3%',tacosCls:'br',oosRate:'25%',oosCls:'ba'},{name:'Hydro Tabs',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Fast Bars',sales:'${EUR}98',units:'3',pct:'4%',adSpend:'${EUR}18',tacos:'18.4%',tacosCls:'bg',oosRate:'75%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}183',units:'6',pct:'8%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'57%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}107',units:'3',pct:'4%',adSpend:'${EUR}10',tacos:'9.3%',tacosCls:'bg',oosRate:'33%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}46',units:'1',pct:'2%',adSpend:'${EUR}8',tacos:'17.4%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}143',units:'2',pct:'6%',adSpend:'${EUR}46',tacos:'32.2%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'50%',oosCls:'br'}] },
        '3m': { all:[{name:'Energy Gels',sales:'${EUR}5,617',units:'188',pct:'27%',adSpend:'${EUR}1,803',tacos:'32.1%',tacosCls:'ba',oosRate:'13%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}2,358',units:'55',pct:'11%',adSpend:'${EUR}733',tacos:'31.1%',tacosCls:'ba',oosRate:'8%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}1,364',units:'49',pct:'7%',adSpend:'${EUR}366',tacos:'26.8%',tacosCls:'ba',oosRate:'11%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}1,741',units:'50',pct:'8%',adSpend:'${EUR}187',tacos:'10.7%',tacosCls:'bg',oosRate:'50%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}1,198',units:'24',pct:'6%',adSpend:'${EUR}50',tacos:'4.2%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}1,960',units:'62',pct:'9%',adSpend:'${EUR}425',tacos:'21.7%',tacosCls:'ba',oosRate:'8%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}1,310',units:'40',pct:'6%',adSpend:'${EUR}301',tacos:'23%',tacosCls:'ba',oosRate:'14%',oosCls:'ba'},{name:'Hydro Tabs',sales:'${EUR}1,628',units:'65',pct:'8%',adSpend:'${EUR}690',tacos:'42.4%',tacosCls:'br',oosRate:'45%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}1,102',units:'35',pct:'5%',adSpend:'${EUR}243',tacos:'22.1%',tacosCls:'ba',oosRate:'71%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}1,157',units:'40',pct:'6%',adSpend:'${EUR}69',tacos:'6%',tacosCls:'bg',oosRate:'65%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}488',units:'14',pct:'2%',adSpend:'${EUR}167',tacos:'34.2%',tacosCls:'ba',oosRate:'20%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}493',units:'11',pct:'2%',adSpend:'${EUR}112',tacos:'22.7%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}419',units:'6',pct:'2%',adSpend:'${EUR}135',tacos:'32.2%',tacosCls:'ba',oosRate:'8%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'75%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'57%',oosCls:'br'}], de:[{name:'Energy Gels',sales:'${EUR}1,909',units:'64',pct:'31%',adSpend:'${EUR}627',tacos:'32.8%',tacosCls:'ba',oosRate:'17%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}129',units:'3',pct:'2%',adSpend:'${EUR}5',tacos:'3.9%',tacosCls:'bg',oosRate:'25%',oosCls:'ba'},{name:'Oat Bars',sales:'${EUR}581',units:'21',pct:'9%',adSpend:'${EUR}189',tacos:'32.5%',tacosCls:'ba',oosRate:'20%',oosCls:'ba'},{name:'Turbo Drinks',sales:'${EUR}173',units:'5',pct:'3%',adSpend:'${EUR}98',tacos:'56.6%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Recovery Protein Powders',sales:'${EUR}548',units:'11',pct:'9%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}1,133',units:'36',pct:'18%',adSpend:'${EUR}237',tacos:'20.9%',tacosCls:'ba',oosRate:'25%',oosCls:'ba'},{name:'Nougat Bars',sales:'${EUR}457',units:'14',pct:'7%',adSpend:'${EUR}57',tacos:'12.5%',tacosCls:'bg',oosRate:'25%',oosCls:'ba'},{name:'Hydro Tabs',sales:'${EUR}224',units:'9',pct:'4%',adSpend:'${EUR}43',tacos:'19.2%',tacosCls:'bg',oosRate:'33%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}399',units:'13',pct:'6%',adSpend:'${EUR}163',tacos:'40.9%',tacosCls:'br',oosRate:'75%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}272',units:'10',pct:'4%',adSpend:'${EUR}38',tacos:'14%',tacosCls:'bg',oosRate:'80%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}105',units:'3',pct:'2%',adSpend:'${EUR}115',tacos:'109.5%',tacosCls:'br',oosRate:'33%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}178',units:'4',pct:'3%',adSpend:'${EUR}1',tacos:'0.6%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}140',units:'2',pct:'2%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'0%',oosCls:'bg'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'50%',oosCls:'br'}], fr:[{name:'Energy Gels',sales:'${EUR}1,701',units:'57',pct:'37%',adSpend:'${EUR}440',tacos:'25.9%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Turbo Gels',sales:'${EUR}684',units:'16',pct:'15%',adSpend:'${EUR}340',tacos:'49.7%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}223',units:'8',pct:'5%',adSpend:'${EUR}101',tacos:'45.3%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}453',units:'13',pct:'10%',adSpend:'${EUR}88',tacos:'19.4%',tacosCls:'bg',oosRate:'50%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}50',units:'1',pct:'1%',adSpend:'${EUR}29',tacos:'58%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}190',units:'6',pct:'4%',adSpend:'${EUR}60',tacos:'31.6%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}359',units:'11',pct:'8%',adSpend:'${EUR}22',tacos:'6.1%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Hydro Tabs',sales:'${EUR}199',units:'8',pct:'4%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'33%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}127',units:'4',pct:'3%',adSpend:'${EUR}10',tacos:'7.9%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}256',units:'9',pct:'6%',adSpend:'${EUR}31',tacos:'12.1%',tacosCls:'bg',oosRate:'57%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}244',units:'7',pct:'5%',adSpend:'${EUR}14',tacos:'5.7%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Turbo Fruit Chews',sales:'${EUR}90',units:'2',pct:'2%',adSpend:'${EUR}46',tacos:'51.1%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}70',units:'1',pct:'2%',adSpend:'${EUR}28',tacos:'40%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'50%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'50%',oosCls:'br'}], es:[{name:'Energy Gels',sales:'${EUR}965',units:'32',pct:'20%',adSpend:'${EUR}173',tacos:'17.9%',tacosCls:'bg',oosRate:'17%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}692',units:'16',pct:'14%',adSpend:'${EUR}220',tacos:'31.8%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}282',units:'10',pct:'6%',adSpend:'${EUR}36',tacos:'12.8%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}247',units:'7',pct:'5%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'60%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}352',units:'7',pct:'7%',adSpend:'${EUR}21',tacos:'6%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}161',units:'5',pct:'3%',adSpend:'${EUR}64',tacos:'39.8%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}167',units:'5',pct:'3%',adSpend:'${EUR}9',tacos:'5.4%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Hydro Tabs',sales:'${EUR}1,205',units:'48',pct:'25%',adSpend:'${EUR}647',tacos:'53.7%',tacosCls:'br',oosRate:'50%',oosCls:'br'},{name:'Fast Bars',sales:'${EUR}322',units:'10',pct:'7%',adSpend:'${EUR}20',tacos:'6.2%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}302',units:'10',pct:'6%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}4',tacos:'-',tacosCls:'bb',oosRate:'0%',oosCls:'bg'},{name:'Turbo Fruit Chews',sales:'${EUR}136',units:'3',pct:'3%',adSpend:'${EUR}27',tacos:'19.9%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}11',tacos:'-',tacosCls:'bb',oosRate:'25%',oosCls:'ba'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'}], it:[{name:'Energy Gels',sales:'${EUR}1,042',units:'35',pct:'20%',adSpend:'${EUR}563',tacos:'54%',tacosCls:'br',oosRate:'17%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}853',units:'20',pct:'17%',adSpend:'${EUR}168',tacos:'19.7%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}278',units:'10',pct:'5%',adSpend:'${EUR}40',tacos:'14.4%',tacosCls:'bg',oosRate:'20%',oosCls:'ba'},{name:'Turbo Drinks',sales:'${EUR}868',units:'25',pct:'17%',adSpend:'${EUR}1',tacos:'0.1%',tacosCls:'bg',oosRate:'60%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}248',units:'5',pct:'5%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}476',units:'15',pct:'9%',adSpend:'${EUR}64',tacos:'13.4%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}327',units:'10',pct:'6%',adSpend:'${EUR}213',tacos:'65.1%',tacosCls:'br',oosRate:'25%',oosCls:'ba'},{name:'Hydro Tabs',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Fast Bars',sales:'${EUR}254',units:'8',pct:'5%',adSpend:'${EUR}50',tacos:'19.7%',tacosCls:'bg',oosRate:'75%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}327',units:'11',pct:'6%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'60%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}139',units:'4',pct:'3%',adSpend:'${EUR}34',tacos:'24.5%',tacosCls:'ba',oosRate:'33%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}89',units:'2',pct:'2%',adSpend:'${EUR}38',tacos:'42.7%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}209',units:'3',pct:'4%',adSpend:'${EUR}96',tacos:'45.9%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'50%',oosCls:'br'}] },
        '6m': { all:[{name:'Energy Gels',sales:'${EUR}7,340',units:'246',pct:'26%',adSpend:'${EUR}1,930',tacos:'26.3%',tacosCls:'ba',oosRate:'13%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}3,023',units:'72',pct:'11%',adSpend:'${EUR}759',tacos:'25.1%',tacosCls:'ba',oosRate:'8%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}1,942',units:'72',pct:'7%',adSpend:'${EUR}408',tacos:'21%',tacosCls:'ba',oosRate:'11%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}2,084',units:'60',pct:'7%',adSpend:'${EUR}215',tacos:'10.3%',tacosCls:'bg',oosRate:'63%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}1,565',units:'34',pct:'6%',adSpend:'${EUR}61',tacos:'3.9%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}2,750',units:'89',pct:'10%',adSpend:'${EUR}477',tacos:'17.3%',tacosCls:'bg',oosRate:'8%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}1,901',units:'61',pct:'7%',adSpend:'${EUR}351',tacos:'18.5%',tacosCls:'bg',oosRate:'18%',oosCls:'ba'},{name:'Hydro Tabs',sales:'${EUR}1,948',units:'80',pct:'7%',adSpend:'${EUR}691',tacos:'35.5%',tacosCls:'ba',oosRate:'45%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}1,629',units:'55',pct:'6%',adSpend:'${EUR}291',tacos:'17.9%',tacosCls:'bg',oosRate:'71%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}1,991',units:'68',pct:'7%',adSpend:'${EUR}123',tacos:'6.2%',tacosCls:'bg',oosRate:'81%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}840',units:'25',pct:'3%',adSpend:'${EUR}187',tacos:'22.3%',tacosCls:'ba',oosRate:'20%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}691',units:'16',pct:'2%',adSpend:'${EUR}113',tacos:'16.4%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}667',units:'10',pct:'2%',adSpend:'${EUR}145',tacos:'21.7%',tacosCls:'ba',oosRate:'8%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}19',tacos:'-',tacosCls:'bb',oosRate:'57%',oosCls:'br'}], de:[{name:'Energy Gels',sales:'${EUR}2,801',units:'94',pct:'29%',adSpend:'${EUR}710',tacos:'25.3%',tacosCls:'ba',oosRate:'17%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}354',units:'9',pct:'4%',adSpend:'${EUR}5',tacos:'1.4%',tacosCls:'bg',oosRate:'25%',oosCls:'ba'},{name:'Oat Bars',sales:'${EUR}784',units:'29',pct:'8%',adSpend:'${EUR}211',tacos:'26.9%',tacosCls:'ba',oosRate:'20%',oosCls:'ba'},{name:'Turbo Drinks',sales:'${EUR}310',units:'9',pct:'3%',adSpend:'${EUR}114',tacos:'36.8%',tacosCls:'ba',oosRate:'67%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}695',units:'15',pct:'7%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}1,431',units:'46',pct:'15%',adSpend:'${EUR}262',tacos:'18.3%',tacosCls:'bg',oosRate:'25%',oosCls:'ba'},{name:'Nougat Bars',sales:'${EUR}834',units:'27',pct:'9%',adSpend:'${EUR}82',tacos:'9.8%',tacosCls:'bg',oosRate:'33%',oosCls:'ba'},{name:'Hydro Tabs',sales:'${EUR}332',units:'14',pct:'3%',adSpend:'${EUR}52',tacos:'15.7%',tacosCls:'bg',oosRate:'33%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}642',units:'22',pct:'7%',adSpend:'${EUR}183',tacos:'28.5%',tacosCls:'ba',oosRate:'75%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}629',units:'22',pct:'7%',adSpend:'${EUR}38',tacos:'6%',tacosCls:'bg',oosRate:'83%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}267',units:'8',pct:'3%',adSpend:'${EUR}130',tacos:'48.7%',tacosCls:'br',oosRate:'33%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}336',units:'8',pct:'4%',adSpend:'${EUR}1',tacos:'0.3%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}140',units:'2',pct:'1%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'0%',oosCls:'bg'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'50%',oosCls:'br'}], fr:[{name:'Energy Gels',sales:'${EUR}1,877',units:'63',pct:'33%',adSpend:'${EUR}454',tacos:'24.2%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Turbo Gels',sales:'${EUR}684',units:'16',pct:'12%',adSpend:'${EUR}343',tacos:'50.1%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}375',units:'14',pct:'7%',adSpend:'${EUR}111',tacos:'29.6%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}488',units:'14',pct:'9%',adSpend:'${EUR}93',tacos:'19.1%',tacosCls:'bg',oosRate:'60%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}50',units:'1',pct:'1%',adSpend:'${EUR}29',tacos:'58%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}423',units:'14',pct:'7%',adSpend:'${EUR}63',tacos:'14.9%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}494',units:'16',pct:'9%',adSpend:'${EUR}24',tacos:'4.9%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Hydro Tabs',sales:'${EUR}240',units:'10',pct:'4%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'33%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}153',units:'5',pct:'3%',adSpend:'${EUR}23',tacos:'15%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}405',units:'14',pct:'7%',adSpend:'${EUR}45',tacos:'11.1%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}371',units:'11',pct:'6%',adSpend:'${EUR}14',tacos:'3.8%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Turbo Fruit Chews',sales:'${EUR}90',units:'2',pct:'2%',adSpend:'${EUR}47',tacos:'52.2%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}70',units:'1',pct:'1%',adSpend:'${EUR}35',tacos:'50%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}11',tacos:'-',tacosCls:'bb',oosRate:'50%',oosCls:'br'}], es:[{name:'Energy Gels',sales:'${EUR}1,205',units:'40',pct:'21%',adSpend:'${EUR}184',tacos:'15.3%',tacosCls:'bg',oosRate:'17%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}892',units:'21',pct:'15%',adSpend:'${EUR}229',tacos:'25.7%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}307',units:'11',pct:'5%',adSpend:'${EUR}40',tacos:'13%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}246',units:'7',pct:'4%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'60%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}426',units:'9',pct:'7%',adSpend:'${EUR}27',tacos:'6.3%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}219',units:'7',pct:'4%',adSpend:'${EUR}71',tacos:'32.4%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}166',units:'5',pct:'3%',adSpend:'${EUR}21',tacos:'12.7%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Hydro Tabs',sales:'${EUR}1,376',units:'56',pct:'24%',adSpend:'${EUR}639',tacos:'46.4%',tacosCls:'br',oosRate:'50%',oosCls:'br'},{name:'Fast Bars',sales:'${EUR}374',units:'12',pct:'6%',adSpend:'${EUR}26',tacos:'7%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}422',units:'14',pct:'7%',adSpend:'${EUR}17',tacos:'4%',tacosCls:'bg',oosRate:'86%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}32',units:'1',pct:'1%',adSpend:'${EUR}9',tacos:'28.1%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Turbo Fruit Chews',sales:'${EUR}136',units:'3',pct:'2%',adSpend:'${EUR}27',tacos:'19.9%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}12',tacos:'-',tacosCls:'bb',oosRate:'25%',oosCls:'ba'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'}], it:[{name:'Energy Gels',sales:'${EUR}1,457',units:'49',pct:'20%',adSpend:'${EUR}582',tacos:'39.9%',tacosCls:'ba',oosRate:'17%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}1,093',units:'26',pct:'15%',adSpend:'${EUR}182',tacos:'16.7%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}476',units:'18',pct:'7%',adSpend:'${EUR}46',tacos:'9.7%',tacosCls:'bg',oosRate:'20%',oosCls:'ba'},{name:'Turbo Drinks',sales:'${EUR}1,040',units:'30',pct:'14%',adSpend:'${EUR}8',tacos:'0.8%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}394',units:'9',pct:'5%',adSpend:'${EUR}5',tacos:'1.3%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}677',units:'22',pct:'9%',adSpend:'${EUR}81',tacos:'12%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}407',units:'13',pct:'6%',adSpend:'${EUR}224',tacos:'55%',tacosCls:'br',oosRate:'33%',oosCls:'ba'},{name:'Hydro Tabs',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Fast Bars',sales:'${EUR}460',units:'16',pct:'6%',adSpend:'${EUR}59',tacos:'12.8%',tacosCls:'bg',oosRate:'75%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}535',units:'18',pct:'7%',adSpend:'${EUR}23',tacos:'4.3%',tacosCls:'bg',oosRate:'100%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}170',units:'5',pct:'2%',adSpend:'${EUR}34',tacos:'20%',tacosCls:'ba',oosRate:'33%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}129',units:'3',pct:'2%',adSpend:'${EUR}38',tacos:'29.5%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}457',units:'7',pct:'6%',adSpend:'${EUR}98',tacos:'21.4%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}8',tacos:'-',tacosCls:'bb',oosRate:'50%',oosCls:'br'}] },
        '12m': { all:[{name:'Energy Gels',sales:'${EUR}15,225',units:'510',pct:'23%',adSpend:'${EUR}4,079',tacos:'26.8%',tacosCls:'ba',oosRate:'13%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}9,343',units:'231',pct:'14%',adSpend:'${EUR}3,415',tacos:'36.6%',tacosCls:'ba',oosRate:'8%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}4,174',units:'162',pct:'6%',adSpend:'${EUR}1,130',tacos:'27.1%',tacosCls:'ba',oosRate:'11%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}4,000',units:'115',pct:'6%',adSpend:'${EUR}797',tacos:'19.9%',tacosCls:'bg',oosRate:'65%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}3,518',units:'87',pct:'5%',adSpend:'${EUR}131',tacos:'3.7%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}5,293',units:'177',pct:'8%',adSpend:'${EUR}951',tacos:'18%',tacosCls:'bg',oosRate:'8%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}4,859',units:'171',pct:'7%',adSpend:'${EUR}1,335',tacos:'27.5%',tacosCls:'ba',oosRate:'10%',oosCls:'bg'},{name:'Hydro Tabs',sales:'${EUR}3,416',units:'150',pct:'5%',adSpend:'${EUR}1,158',tacos:'33.9%',tacosCls:'ba',oosRate:'45%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}3,677',units:'135',pct:'6%',adSpend:'${EUR}889',tacos:'24.2%',tacosCls:'ba',oosRate:'69%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}6,501',units:'219',pct:'10%',adSpend:'${EUR}1,022',tacos:'15.7%',tacosCls:'bg',oosRate:'85%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}2,210',units:'68',pct:'3%',adSpend:'${EUR}356',tacos:'16.1%',tacosCls:'bg',oosRate:'20%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}891',units:'21',pct:'1%',adSpend:'${EUR}166',tacos:'18.6%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}1,270',units:'21',pct:'2%',adSpend:'${EUR}178',tacos:'14%',tacosCls:'bg',oosRate:'8%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}469',units:'12',pct:'1%',adSpend:'${EUR}78',tacos:'16.6%',tacosCls:'bg',oosRate:'57%',oosCls:'br'}], de:[{name:'Energy Gels',sales:'${EUR}7,518',units:'252',pct:'25%',adSpend:'${EUR}1,950',tacos:'25.9%',tacosCls:'ba',oosRate:'17%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}4,918',units:'124',pct:'16%',adSpend:'${EUR}2,138',tacos:'43.5%',tacosCls:'br',oosRate:'25%',oosCls:'ba'},{name:'Oat Bars',sales:'${EUR}1,477',units:'57',pct:'5%',adSpend:'${EUR}461',tacos:'31.2%',tacosCls:'ba',oosRate:'20%',oosCls:'ba'},{name:'Turbo Drinks',sales:'${EUR}1,180',units:'34',pct:'4%',adSpend:'${EUR}331',tacos:'28.1%',tacosCls:'ba',oosRate:'67%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}1,432',units:'35',pct:'5%',adSpend:'${EUR}4',tacos:'0.3%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}2,962',units:'99',pct:'10%',adSpend:'${EUR}639',tacos:'21.6%',tacosCls:'ba',oosRate:'25%',oosCls:'ba'},{name:'Nougat Bars',sales:'${EUR}2,313',units:'82',pct:'8%',adSpend:'${EUR}236',tacos:'10.2%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Hydro Tabs',sales:'${EUR}1,125',units:'52',pct:'4%',adSpend:'${EUR}239',tacos:'21.2%',tacosCls:'ba',oosRate:'33%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}2,172',units:'82',pct:'7%',adSpend:'${EUR}669',tacos:'30.8%',tacosCls:'ba',oosRate:'67%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}3,254',units:'110',pct:'11%',adSpend:'${EUR}492',tacos:'15.1%',tacosCls:'bg',oosRate:'83%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}808',units:'25',pct:'3%',adSpend:'${EUR}252',tacos:'31.2%',tacosCls:'ba',oosRate:'33%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}416',units:'10',pct:'1%',adSpend:'${EUR}1',tacos:'0.2%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}249',units:'4',pct:'1%',adSpend:'${EUR}1',tacos:'0.4%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'0%',oosCls:'bg'},{name:'Energy Ice Gels',sales:'${EUR}229',units:'6',pct:'1%',adSpend:'${EUR}6',tacos:'2.6%',tacosCls:'bg',oosRate:'50%',oosCls:'br'}], fr:[{name:'Energy Gels',sales:'${EUR}2,859',units:'96',pct:'28%',adSpend:'${EUR}602',tacos:'21.1%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Turbo Gels',sales:'${EUR}1,241',units:'30',pct:'12%',adSpend:'${EUR}504',tacos:'40.6%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}1,168',units:'46',pct:'12%',adSpend:'${EUR}525',tacos:'44.9%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}662',units:'19',pct:'7%',adSpend:'${EUR}317',tacos:'47.9%',tacosCls:'br',oosRate:'60%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}122',units:'3',pct:'1%',adSpend:'${EUR}49',tacos:'40.2%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}740',units:'25',pct:'7%',adSpend:'${EUR}88',tacos:'11.9%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}789',units:'27',pct:'8%',adSpend:'${EUR}166',tacos:'21%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Hydro Tabs',sales:'${EUR}261',units:'11',pct:'3%',adSpend:'${EUR}0',tacos:'0%',tacosCls:'bg',oosRate:'33%',oosCls:'ba'},{name:'Fast Bars',sales:'${EUR}257',units:'9',pct:'3%',adSpend:'${EUR}70',tacos:'27.2%',tacosCls:'ba',oosRate:'67%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}734',units:'25',pct:'7%',adSpend:'${EUR}178',tacos:'24.3%',tacosCls:'ba',oosRate:'67%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}753',units:'23',pct:'7%',adSpend:'${EUR}22',tacos:'2.9%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Turbo Fruit Chews',sales:'${EUR}90',units:'2',pct:'1%',adSpend:'${EUR}78',tacos:'86.7%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}344',units:'6',pct:'3%',adSpend:'${EUR}47',tacos:'13.7%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}45',units:'1',pct:'0%',adSpend:'${EUR}31',tacos:'68.9%',tacosCls:'br',oosRate:'50%',oosCls:'br'}], es:[{name:'Energy Gels',sales:'${EUR}2,259',units:'75',pct:'21%',adSpend:'${EUR}516',tacos:'22.8%',tacosCls:'ba',oosRate:'17%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}1,574',units:'38',pct:'15%',adSpend:'${EUR}515',tacos:'32.7%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}607',units:'23',pct:'6%',adSpend:'${EUR}46',tacos:'7.6%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Turbo Drinks',sales:'${EUR}387',units:'11',pct:'4%',adSpend:'${EUR}17',tacos:'4.4%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}835',units:'20',pct:'8%',adSpend:'${EUR}41',tacos:'4.9%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}510',units:'17',pct:'5%',adSpend:'${EUR}92',tacos:'18%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}492',units:'17',pct:'5%',adSpend:'${EUR}225',tacos:'45.7%',tacosCls:'br',oosRate:'0%',oosCls:'bg'},{name:'Hydro Tabs',sales:'${EUR}2,030',units:'87',pct:'19%',adSpend:'${EUR}919',tacos:'45.3%',tacosCls:'br',oosRate:'50%',oosCls:'br'},{name:'Fast Bars',sales:'${EUR}452',units:'15',pct:'4%',adSpend:'${EUR}30',tacos:'6.6%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}995',units:'33',pct:'9%',adSpend:'${EUR}60',tacos:'6%',tacosCls:'bg',oosRate:'100%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}97',units:'3',pct:'1%',adSpend:'${EUR}23',tacos:'23.7%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Turbo Fruit Chews',sales:'${EUR}216',units:'5',pct:'2%',adSpend:'${EUR}36',tacos:'16.7%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}56',units:'1',pct:'1%',adSpend:'${EUR}13',tacos:'23.2%',tacosCls:'ba',oosRate:'25%',oosCls:'ba'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}106',units:'3',pct:'1%',adSpend:'${EUR}2',tacos:'1.9%',tacosCls:'bg',oosRate:'100%',oosCls:'br'}], it:[{name:'Energy Gels',sales:'${EUR}2,589',units:'87',pct:'18%',adSpend:'${EUR}1,011',tacos:'39%',tacosCls:'ba',oosRate:'17%',oosCls:'ba'},{name:'Turbo Gels',sales:'${EUR}1,610',units:'39',pct:'11%',adSpend:'${EUR}258',tacos:'16%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Oat Bars',sales:'${EUR}922',units:'36',pct:'7%',adSpend:'${EUR}98',tacos:'10.6%',tacosCls:'bg',oosRate:'20%',oosCls:'ba'},{name:'Turbo Drinks',sales:'${EUR}1,771',units:'51',pct:'13%',adSpend:'${EUR}132',tacos:'7.5%',tacosCls:'bg',oosRate:'67%',oosCls:'br'},{name:'Recovery Protein Powders',sales:'${EUR}1,129',units:'29',pct:'8%',adSpend:'${EUR}37',tacos:'3.3%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Fruit Chews',sales:'${EUR}1,081',units:'36',pct:'8%',adSpend:'${EUR}132',tacos:'12.2%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Nougat Bars',sales:'${EUR}1,265',units:'45',pct:'9%',adSpend:'${EUR}708',tacos:'56%',tacosCls:'br',oosRate:'33%',oosCls:'ba'},{name:'Hydro Tabs',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Fast Bars',sales:'${EUR}796',units:'29',pct:'6%',adSpend:'${EUR}120',tacos:'15.1%',tacosCls:'bg',oosRate:'75%',oosCls:'br'},{name:'Energy Drinks',sales:'${EUR}1,518',units:'51',pct:'11%',adSpend:'${EUR}292',tacos:'19.2%',tacosCls:'bg',oosRate:'100%',oosCls:'br'},{name:'Recovery Bars',sales:'${EUR}552',units:'17',pct:'4%',adSpend:'${EUR}59',tacos:'10.7%',tacosCls:'bg',oosRate:'33%',oosCls:'ba'},{name:'Turbo Fruit Chews',sales:'${EUR}169',units:'4',pct:'1%',adSpend:'${EUR}51',tacos:'30.2%',tacosCls:'ba',oosRate:'0%',oosCls:'bg'},{name:'Protein Deluxe',sales:'${EUR}621',units:'10',pct:'4%',adSpend:'${EUR}117',tacos:'18.8%',tacosCls:'bg',oosRate:'0%',oosCls:'bg'},{name:'Cherry Juice+',sales:'${EUR}0',units:'0',pct:'0%',adSpend:'${EUR}0',tacos:'-',tacosCls:'bb',oosRate:'100%',oosCls:'br'},{name:'Energy Ice Gels',sales:'${EUR}89',units:'2',pct:'1%',adSpend:'${EUR}39',tacos:'43.8%',tacosCls:'br',oosRate:'50%',oosCls:'br'}] }
      },
    }
"@
# ---- sections.overview: Buy Box win-rate by market + EU session CVR (recent month, from getSalesByPeriod). ----
# tasks/flags/stockWarn left unset → stay sheet-controlled (static markup). DE buy box low (lost buy box on shipping).
$ovJs = @"
{
      buyBox: [
        {flag:'de',label:'Germany',pct:50,valText:'49.8%',color:'red'},
        {flag:'fr',label:'France',pct:99,valText:'98.9%',color:'green'},
        {flag:'es',label:'Spain',pct:93,valText:'93.1%',color:'green'},
        {flag:'it',label:'Italy',pct:94,valText:'94.3%',color:'green'}
      ],
      cvr: { val:'4.4%', note:'recent month ${DOT} 5,543 sessions', sub:'All EU ${DOT} session conversion' },
      stockWarn: { badge:'31 OOS SKUs', items:[
        {level:'red',title:'Fast Bar Lemon ${EMD} OOS all markets',sub:'B086XB1N46 ${DOT} since 14 May'},
        {level:'red',title:'Energy Drink Lemon 1kg ${EMD} all markets',sub:'B0GS21WT66 ${DOT} since 15 Apr'},
        {level:'red',title:'Energy Ice Gel Lemon-Lime ${EMD} all markets',sub:'B0F332LV9B ${DOT} since 18 Feb'},
        {level:'amber',title:'Hydro Tabs Orange ${EMD} DE/ES/FR',sub:'B0CCJW62HZ ${DOT} since 3 Jun'}
      ] }
    }
"@
# ---- sections.charts: trailing-6-month trend series (Dec 2025 - May 2026), EU + per market. ----
# Drives the Revenue Trend (monthly revenue) and Spend vs TACOS (monthly ad spend + TACOS%) cards.
# app.js renderMarketCharts() picks the series for the selected market; 'all' = EU (sum of markets).
$cidx = 11..16
$monLabels = ($cidx | ForEach-Object { "'" + (MonShort $_) + "'" }) -join ','
# EU revenue TARGET (dotted chart line, All EU only) — Performance Tracker row 8 "Revenue Target
# (past vs future)". Monthly, idx 0=Jan2025 … 16=May2026. NOT from MCP — SYNC from the sheet each bake.
# Sliced by $cidx so it always aligns to the same trailing window as the rev series.
$REVTGT = @(820,1020,1935,2800,4180,6160,8280,8400,11000,10750,7600,7680,4500,5700,5120,8497,10206)
$chartsJs = @"
{
      months: [$monLabels],
      revTarget: [$(NumArr $REVTGT $cidx)],
      rev: { all:[$(NumArr $EU.sales $cidx)], de:[$(NumArr $M.DE.sales $cidx)], fr:[$(NumArr $M.FR.sales $cidx)], es:[$(NumArr $M.ES.sales $cidx)], it:[$(NumArr $M.IT.sales $cidx)] },
      adSpend: { all:[$(NumArr $EU.adSpend $cidx)], de:[$(NumArr $M.DE.adSpend $cidx)], fr:[$(NumArr $M.FR.adSpend $cidx)], es:[$(NumArr $M.ES.adSpend $cidx)], it:[$(NumArr $M.IT.adSpend $cidx)] },
      adSales: { all:[$(NumArr $EU.adSales $cidx)], de:[$(NumArr $M.DE.adSales $cidx)], fr:[$(NumArr $M.FR.adSales $cidx)], es:[$(NumArr $M.ES.adSales $cidx)], it:[$(NumArr $M.IT.adSales $cidx)] },
      adTacos: { all:[$(TacosArr $EU.sales $EU.adSpend $cidx)], de:[$(TacosArr $M.DE.sales $M.DE.adSpend $cidx)], fr:[$(TacosArr $M.FR.sales $M.FR.adSpend $cidx)], es:[$(TacosArr $M.ES.sales $M.ES.adSpend $cidx)], it:[$(TacosArr $M.IT.sales $M.IT.adSpend $cidx)] }
    }
"@
$footer = "`n  },`n  sections: {`n    overview: $ovJs,`n    pnl: $pnlJs,`n    advertising: $advJs,`n    inventory: $invJs,`n    products: $prodJs,`n    charts: $chartsJs`n  }`n};`n"
$content=$header+"`n"+($jsPeriods -join ",`n")+$footer
[IO.File]::WriteAllText($OutFile, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Host ("WROTE {0} ({1} chars)`n" -f $OutFile, $content.Length)
$summary | Format-Table -AutoSize
