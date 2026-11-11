// Optional Oracle-only FCM HTTP v1 sender. This module never runs in the APK or Cloudflare.
// Service-account JSON is mounted read-only outside the repository, never logged or bundled.
import {readFileSync} from 'node:fs';
import {createSign} from 'node:crypto';

const AUTH_ENDPOINT='https://oauth2.googleapis.com/token';
const SCOPE='https://www.googleapis.com/auth/firebase.messaging';
const TYPES=new Set(['message','list','invite']);
const validUuid=value=>typeof value==='string'&&/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(value);
const validToken=value=>typeof value==='string'&&value.length>=24&&value.length<=4096&&/^[A-Za-z0-9_:\-]+$/.test(value);
export const fcmTokenValid=validToken;

export function createPushSender({projectId,clientEmail,privateKey,fetcher=fetch,clock=Date.now}){
 if(!/^[A-Za-z0-9-]{4,128}$/.test(projectId||''))throw Error('FCM project ID is invalid');
 if(!clientEmail?.includes('@')||!privateKey?.includes('BEGIN PRIVATE KEY'))throw Error('FCM credentials incomplete');
 let cached=null,validUntil=0;
 const base64url=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
 async function oauth(){
  if(cached&&clock()<validUntil-90000)return cached;
  const now=Math.floor(clock()/1000);
  const header=base64url({alg:'RS256',typ:'JWT'});
  const claims=base64url({iss:clientEmail,scope:SCOPE,aud:AUTH_ENDPOINT,iat:now,exp:now+3500});
  const signature=createSign('RSA-SHA256').update(header+'.'+claims).end().sign(privateKey,'base64url');
  const jwt=header+'.'+claims+'.'+signature;
  const response=await fetcher(AUTH_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt}).toString(),signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw Error('FCM authentication failed '+response.status);
  const auth=await response.json();
  if(typeof auth.access_token!=='string'||!auth.access_token)throw Error('FCM token missing');
  cached=auth.access_token;validUntil=clock()+Math.min(3500,Number(auth.expires_in)||3500)*1000;
  return cached
 }
 return async function send({token,kind,target}){
  if(!validToken(token)||!TYPES.has(kind)||!validUuid(target))return {ok:false,invalid:true};
  const access=await oauth();
  const body={message:{token,data:{kind,target,source:'mypocketai_oracle'},
   android:{priority:'HIGH',ttl:'3600s',restricted_package_name:'ai.mypocket.mobile'}}};
  const response=await fetcher('https://fcm.googleapis.com/v1/projects/'+encodeURIComponent(projectId)+'/messages:send',{
   method:'POST',headers:{Authorization:'Bearer '+access,'Content-Type':'application/json'},
   body:JSON.stringify(body),signal:AbortSignal.timeout(8000)
  });
  if(response.ok)return {ok:true};
  const err=await response.json().catch(()=>({}));
  const status=String(err?.error?.status||'');
  if(response.status===404||status==='UNREGISTERED')return {ok:false,unregistered:true};
  // Do not dump error bodies or access tokens into logs.
  return {ok:false,status:response.status}
 }
}

// Missing configuration disables push; it does not affect messages or healthz.
export function createOraclePush({env=process.env,fetcher=fetch}={}){
 const path=env.GOOGLE_APPLICATION_CREDENTIALS;
 if(!path||!env.FCM_PROJECT_ID)return {enabled:false,notify:async()=>{}};
 let service;
 try{service=JSON.parse(readFileSync(path,'utf8'))}
 catch{throw Error('FCM credentials file cannot be read')};
 if(service.project_id!==env.FCM_PROJECT_ID)throw Error('FCM service account project mismatch');
 const send=createPushSender({projectId:env.FCM_PROJECT_ID,clientEmail:service.client_email,privateKey:service.private_key,fetcher});
 return {enabled:true,async notify(pool,userId,kind,target){
  if(!validUuid(userId)||!validUuid(target)||!TYPES.has(kind))return;
  const recipients=await pool.query('SELECT token FROM device_push_tokens WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 5',[userId]);
  for(const row of recipients.rows){
   try{
    const result=await send({token:row.token,kind,target});
    if(result.unregistered)await pool.query('DELETE FROM device_push_tokens WHERE user_id=$1 AND token=$2',[userId,row.token]);
   }catch{/* Push failure never blocks saving encrypted communication. */}
  }
 }};
}
