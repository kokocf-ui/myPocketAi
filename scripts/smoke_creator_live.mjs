import {CREATOR_SITE_AI_SCRIPT} from '../creator_site_ai.mjs';
const input={
 name:'Aramis',kind:'hotel',style:'clasic rafinat',lang:'ro',
 description:'Pensiune cu mic dejun inclus. Are 5 camere single, 10 camere duble si 3 apartamente. Bucatarie la comun si sala de mese.',
 english:''
};
globalThis.CLIENT_CONFIG={apiUrl:'https://lifewise-ai-api.kokocf.workers.dev/api/chat'};
const {call}=new Function(CREATOR_SITE_AI_SCRIPT+';return {call:extraCreatorCallAiWebsite};')();
try{
 const copy=await call(input,AbortSignal.timeout(40000));
 if(!copy?.ro?.headline||!copy?.ro?.about)throw new Error('missing_text');
 console.log('LIVE EVA SITE AI OK; headline length',copy.ro.headline.length,
  'services:',copy.ro.services.length,'about length:',copy.ro.about.length);
}catch(error){
 console.error('LIVE EVA SITE AI ERROR:',String(error?.message||error));
 process.exitCode=1;
}
