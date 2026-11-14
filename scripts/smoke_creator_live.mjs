import {CREATOR_SITE_AI_SCRIPT} from '../creator_site_ai.mjs';
const input={
 name:'Aramis',kind:'hotel',style:'clasic rafinat',lang:'ro',
 description:'Pensiune cu mic dejun inclus. Are 5 camere single, 10 camere duble si 3 apartamente. Bucatarie la comun si sala de mese.',
 english:''
};
// Node smoke must explicitly send the same browser Origin; Android WebView supplies it automatically.
const httpFetch=globalThis.fetch.bind(globalThis);
globalThis.fetch=async(url,init={})=>{
 const response=await httpFetch(url,{...init,headers:{...init.headers,Origin:'https://lifewise-ai-v2.kokocf.workers.dev'}});
 if(!response.ok){const body=await response.clone().json().catch(()=>null);
  console.error('Safe site AI diagnostics:',response.status,body?.error,body?.diagnostic||null);}
 return response;
};

const {call,prompt}=new Function(CREATOR_SITE_AI_SCRIPT+';return {call:extraCreatorCallAiWebsite,prompt:extraCreatorAiSitePrompt};')();
try{
 const copy=await call(input,AbortSignal.timeout(40000));
 if(!copy?.ro?.headline||!copy?.ro?.about)throw new Error('missing_text');
 console.log('LIVE EVA SITE AI OK; headline length',copy.ro.headline.length,
  'services:',copy.ro.services.length,'about length:',copy.ro.about.length);
}catch(error){
 console.error('LIVE EVA SITE AI ERROR:',String(error?.message||error));

 process.exitCode=1;
}
