// Pure, deterministic alert evaluator for an owner-only Eva Alpha dashboard.
// It does NOT fetch Cloudflare data, authorize admin access, send push,
// charge users, or enforce budgets by itself.
export const EVA_ALERT_THRESHOLDS=Object.freeze([70,85,100]);
const finiteNonnegative=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const level=p=>p>=100?'limit':p>=85?'critical':p>=70?'warning':'normal';
const pct=(used,limit)=>used/limit*100;
const asBand=(used,limit)=>{
 if(!finiteNonnegative(used)||!finiteNonnegative(limit)||limit<=0)return null;
 const percent=pct(used,limit);
 return Object.freeze({used,limit,percent:Math.round(percent*100)/100,level:level(percent)});
};
export function evaluateEvaUsage(snapshot,{now=new Date().toISOString(),maximumAgeMinutes=30}={}){
 if(!snapshot||typeof snapshot!=='object')return {status:'unavailable',reason:'missing_verified_provider_data'};
 if(typeof now!=='string'||!Number.isFinite(Date.parse(now))||
  !finiteNonnegative(maximumAgeMinutes))return {status:'unavailable',reason:'invalid_local_clock'};
 const observed=Date.parse(snapshot.observedAt);
 if(!Number.isFinite(observed)||observed>Date.parse(now)+60000 ||
    Date.parse(now)-observed>maximumAgeMinutes*60000)
  return {status:'unavailable',reason:'outdated_or_invalid_provider_data'};
 const daily=asBand(snapshot.neuronsToday,snapshot.includedNeuronsPerDay);
 const budget=asBand(snapshot.spentUsdMonth,snapshot.budgetUsdMonth);
 if(!daily||!budget)return {status:'unavailable',reason:'missing_or_invalid_values'};
 const rank={normal:0,warning:1,critical:2,limit:3};
 const severity=rank[daily.level]>=rank[budget.level]?daily.level:budget.level;
 return Object.freeze({
  status:'measured',observedAt:snapshot.observedAt,daily,budget,severity,
  // Displayed separately: approved, pending, and paid are NOT interchangeable.
  affiliatePaidUsd:finiteNonnegative(snapshot.affiliatePaidUsd)?snapshot.affiliatePaidUsd:null,
  affiliatePendingUsd:finiteNonnegative(snapshot.affiliatePendingUsd)?snapshot.affiliatePendingUsd:null,
  subscriptionGrossUsd:finiteNonnegative(snapshot.subscriptionGrossUsd)?snapshot.subscriptionGrossUsd:null
 });
}
export function newEvaAlert(previous,current){
 if(current?.status!=='measured')return null;
 const rank={normal:0,warning:1,critical:2,limit:3};
 const prior=previous?.status==='measured'?previous.severity:'normal';
 if(rank[current.severity]<=rank[prior]||current.severity==='normal')return null;
 return Object.freeze({level:current.severity,reason:current.budget.level!=='normal'?'monthly_budget':'daily_neuron_allocation'});
}
