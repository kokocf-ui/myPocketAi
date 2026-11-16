// Server-only read-only Impact Partner API adapter for Eva.
// Impact Partner API v16: /Mediapartners/{AccountSID}/Campaigns
// Never publish credentials or raw partner responses via any public HTTP route.
const API_ORIGIN='https://api.impact.com';
const DEFAULT_TIMEOUT_MS=8000;

function readCredentials(env={}){
  const sid=String(env?.IMPACT_ACCOUNT_SID??'').trim();
  const token=String(env?.IMPACT_API_TOKEN??'').trim();
  if(!sid||!token)return null;
  if(!/^[A-Za-z0-9_-]{3,64}$/.test(sid))return null;
  return {sid,token};
}
export const impactPartnerApiConfigured = env=>Boolean(readCredentials(env));
export async function verifyImpactPartnerPrograms(env,{fetcher=fetch,timeoutMs=DEFAULT_TIMEOUT_MS}={}){
  const auth=readCredentials(env);
  if(!auth)return {state:'not_configured'};
  let response;
  try{
    response=await fetcher(API_ORIGIN+'/Mediapartners/'+encodeURIComponent(auth.sid)+'/Campaigns',{
      method:'GET',
      headers:{Authorization:'Basic '+btoa(auth.sid+':'+auth.token),Accept:'application/json'},
      redirect:'error',
      cache:'no-store',
      signal:AbortSignal.timeout(Math.max(1000,Math.min(15000,Number(timeoutMs)||DEFAULT_TIMEOUT_MS)))
    });
  }catch{return {state:'request_failed'}}
  if(response.status===401)return {state:'authentication_failed'};
  if(response.status===403)return {state:'insufficient_permissions'};
  if(response.status===429)return {state:'rate_limited'};
  if(!response.ok)return {state:'upstream_unavailable',http_status:response.status};
  let data;
  try{data=await response.json()}catch{return {state:'invalid_response'}}
  const campaigns=Array.isArray(data?.Campaigns)?data.Campaigns:
    Array.isArray(data?.Campaigns?.Campaign)?data.Campaigns.Campaign:
    Array.isArray(data?.Campaign)?data.Campaign: [];
  const omioListedOnPage=campaigns.some(c=>/\bomio\b/i.test(String(c?.Name||c?.CampaignName||c?.name||'')));
  return {state:'connected',listed_programs_on_page:campaigns.length,omio_listed_on_page:omioListedOnPage};
}
