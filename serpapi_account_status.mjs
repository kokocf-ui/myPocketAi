// A no-search-credit health check for a SerpApi Free Plan key stored in Cloudflare.
// No user account identifiers, API key, or provider response body are returned.
const readablePrice = v => (typeof v==='number'||typeof v==='string') &&
  Number.isFinite(Number(v)) && Number(v)===0;
const readableQuota = v => v!==null && v!==undefined && Number.isFinite(Number(v)) && Number(v)>=0;
let recent={until:0,value:null};
export function summarizeSerpApiFreeAccount(data){
  if(!data||typeof data!=='object'||!readablePrice(data.plan_monthly_price))
    return {status:'free_plan_not_verified',freePlan:false,hasQuota:false};
  const left=data.total_searches_left??data.plan_searches_left;
  if(!readableQuota(left))return {status:'quota_not_verified',freePlan:true,hasQuota:false};
  if(data.account_status && !/^active$/i.test(String(data.account_status)))
    return {status:'account_not_active',freePlan:true,hasQuota:false};
  return {status:Number(left)>0?'free_active':'free_exhausted',
    freePlan:true,hasQuota:Number(left)>0};
}
export async function checkSerpApiSecretStatus(env,{fetcher=fetch,clock=Date.now,probe=false}={}){
  const configured=typeof env?.SERPAPI_API_KEY==='string'&&env.SERPAPI_API_KEY.trim().length>=16;
  const pilotFlag=env?.SERPAPI_FLIGHTS_PILOT_ENABLED==='true';
  const termsFlag=env?.SERPAPI_FLIGHTS_TERMS_REVIEWED==='true';
  const base={keyConfigured:configured,pilotEnabled:pilotFlag,termsReviewed:termsFlag,
    pilotConfigured:configured&&pilotFlag&&termsFlag,flightSearchActive:false,
    consumesSearchCredits:false};
  if(!configured)return {...base,status:'secret_missing',freePlan:false,hasQuota:false};
  if(!probe)return {...base,status:'configured_not_probed',freePlan:null,hasQuota:null};
  const now=clock();
  if(recent.value&&now<recent.until)return {...base,...recent.value,source:'short_cache'};
  try {
    const u=new URL('https://serpapi.com/account.json');
    u.searchParams.set('api_key',env.SERPAPI_API_KEY.trim());
    const r=await fetcher(u,{signal:AbortSignal.timeout(7000),headers:{Accept:'application/json'}});
    if(!r.ok)return {...base,status:'account_check_failed',freePlan:null,hasQuota:null};
    const data=await r.json();
    const normalized=summarizeSerpApiFreeAccount(data);
    recent={until:now+60000,value:normalized};
    return {...base,...normalized,source:'account_api'};
  }catch {
    return {...base,status:'account_unreachable',freePlan:null,hasQuota:null};
  }
}
