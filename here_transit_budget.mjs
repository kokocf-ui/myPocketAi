// Persistent atomic request budget. Separate DO, never the communication hub.
// Counts reservations, including failed provider requests; no refunds or retries.
export function hereTransitMonthlyLimit(env={}){
 const n=env.HERE_TRANSIT_MONTHLY_LIMIT===undefined?4500:Number(env.HERE_TRANSIT_MONTHLY_LIMIT);
 return Number.isInteger(n)&&n>=1&&n<=4500?n:null;
}
export class HereTransitBudget {
 constructor(state,env){this.state=state;this.env=env;}
 async fetch(request){
  if(request.method!=='POST'||new URL(request.url).pathname!=='/reserve')return new Response(null,{status:404});
  const limit=hereTransitMonthlyLimit(this.env);
  if(!limit)return Response.json({allowed:false,reason:'budget_unavailable'},{status:503});
  const month=new Date().toISOString().slice(0,7);
  try{
   const result=await this.state.storage.transaction(async tx=>{
    const old=await tx.get('monthly');
    if(old!==undefined&&(!old||!/^\d{4}-(?:0[1-9]|1[0-2])$/.test(old.month)||old.month>month||!Number.isInteger(old.used)||old.used<0))return {allowed:false,reason:'budget_unavailable'};
    const used=old?.month===month?old.used:0;
    // Corruption fails closed, never resets a spent counter within a month.
    if(!Number.isInteger(used)||used<0)return {allowed:false,reason:'budget_unavailable'};
    if(used>=limit)return {allowed:false,reason:'free_quota_exhausted',month,used,limit};
    await tx.put('monthly',{month,used:used+1});return {allowed:true,month,used:used+1,limit};
   });
   return Response.json(result,{status:result.allowed?200:result.reason==='free_quota_exhausted'?429:503});
  }catch{return Response.json({allowed:false,reason:'budget_unavailable'},{status:503});}
 }
}
export async function reserveHereTransitRequest(env){
 try{
  const namespace=env.HERE_TRANSIT_BUDGET;
  // Fixed singleton across countries, clients and isolates. Never keyed by GPS/user.
  const stub=namespace.get(namespace.idFromName('here-public-transit-account-budget-v1'));
  const r=await stub.fetch('https://budget.internal/reserve',{method:'POST',signal:AbortSignal.timeout(2500)});
  const d=await r.json();
  if(r.ok&&d.allowed===true)return {allowed:true};
  return {allowed:false,reason:r.status===429&&d.reason==='free_quota_exhausted'?'free_quota_exhausted':'budget_unavailable'};
 }catch{return {allowed:false,reason:'budget_unavailable'};}
}
