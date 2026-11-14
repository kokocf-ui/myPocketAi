import {CREATOR_SITE_AI_SCRIPT} from '../creator_site_ai.mjs';
const input={
 name:'Aramis',kind:'hotel',style:'clasic rafinat',lang:'ro',
 description:'Pensiune cu mic dejun inclus. Are 5 camere single, 10 camere duble si 3 apartamente. Bucatarie la comun si sala de mese.',
 english:''
};
globalThis.CLIENT_CONFIG={apiUrl:'https://lifewise-ai-api.kokocf.workers.dev/api/chat'};
const {call,prompt}=new Function(CREATOR_SITE_AI_SCRIPT+';return {call:extraCreatorCallAiWebsite,prompt:extraCreatorAiSitePrompt};')();
try{
 const copy=await call(input,AbortSignal.timeout(40000));
 if(!copy?.ro?.headline||!copy?.ro?.about)throw new Error('missing_text');
 console.log('LIVE EVA SITE AI OK; headline length',copy.ro.headline.length,
  'services:',copy.ro.services.length,'about length:',copy.ro.about.length);
}catch(error){
 console.error('LIVE EVA SITE AI ERROR:',String(error?.message||error));
 try{
  const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({message:prompt(input),language:'ro',module:'assistant',history:[]}),
   signal:AbortSignal.timeout(40000)});
  const result=await response.json();
  console.error('Diagnostic status:',response.status, result.status,
   'reply_length:',String(result.reply||'').length,'reply_preview:',
   String(result.reply||'').slice(0,1300));
 }catch(diagError){console.error('Diagnostic request failed:',diagError.message)}
 process.exitCode=1;
}
