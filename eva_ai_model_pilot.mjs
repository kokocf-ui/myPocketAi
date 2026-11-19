// Isolated synthetic, bounded Workers AI comparison for Eva. NOT a production router.
// No Brave, EXA, location, saved user chats, or background automation.
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export const PILOT_MODELS=Object.freeze([
 {key:'llama8',name:'Llama 3.1 8B Fast',id:'@cf/meta/llama-3.1-8b-instruct-fast'},
 {key:'llama70',name:'Llama 3.3 70B Fast',id:'@cf/meta/llama-3.3-70b-instruct-fp8-fast'},
 {key:'gptoss120',name:'GPT-OSS 120B',id:'@cf/openai/gpt-oss-120b'}
]);
export const PILOT_CASES=Object.freeze([
 {
  id:'history',group:'Documentare',
  system:'Ești Eva. Scrie în română, factual, ca într-un documentar istoric captivant. Folosește DOAR faptele furnizate. Nu inventa personaje, dialoguri, izvoare sau morminte. Maximum 180 de cuvinte. Încheie complet.',
  user:'Subiect: Decebal, regele dacilor. Fapte pentru test: Decebal a condus Dacia aproximativ între anii 87 și 106 d.Hr. A purtat conflicte cu Roma. Războaiele cu împăratul Traian au avut loc în 101–102 și 105–106. După al doilea război, teritoriul unei părți a Daciei a devenit provincie romană. Explică în două paragrafe contextul, deciziile și consecințele. Nu inventa cercetători moderni.',
  max_tokens:420,temperature:0.25
 },
 {
  id:'education',group:'Educație',
  system:'Ești Eva, profesoară de matematică. Explică precis, accesibil, în limba română. Arată calculul, verifică rezultatul și nu inventa reguli. Maximum 160 de cuvinte.',
  user:'Rezolvă pentru un elev de gimnaziu ecuația (3x − 6)/3 = 4. Explică fiecare transformare și verifică rezultatul prin înlocuire în ecuația inițială.',
  max_tokens:350,temperature:0.2
 },
 {
  id:'transport',group:'Transport și cercetare',
  system:'Ești Eva. Distinge itinerariile verificabile de cele ipotetice. Nu ai acces în acest test la orare, zboruri, tarife sau locuri disponibile. Nu inventa curse, ore, prețuri sau transbordări. Răspunde în română, practic, în maximum 170 de cuvinte.',
  user:'Vreau să ajung din Grays (Anglia) în Oradea (România) pe 20 noiembrie 2026. Explică ce categorii de itinerarii multimodale ar trebui căutate și ce date trebuie obținute înainte să poți prezenta o rută completă, fără să inventezi ore sau prețuri.',
  max_tokens:380,temperature:0.25
 },
 {
  id:'creative',group:'Poveste pentru copii',
  system:'Ești Eva, autoare de ficțiune originală pentru copii de 9–11 ani. Scrie în română două paragrafe vii, cu o scenă, un obstacol real, acțiune și o mică rezolvare. Fără morală școlărească, fără rezumat, fără începutul „Într-o zi”. Maximum 190 de cuvinte.',
  user:'O fetiță găsește o busolă veche într-o bibliotecă. Povestea trebuie să conțină o descoperire neașteptată, un moment de tensiune și o decizie inteligentă. Nu folosi fraze banale precum «a decis să afle mai multe».',
  max_tokens:440,temperature:0.7
 }
]);
export const MAX_LIVE_CALLS=PILOT_MODELS.length*PILOT_CASES.length;

// The same complexity policy can later be used by all modules, but is not wired to the app.
export function recommendEvaTier({intent='',requiresCurrentFacts=false,complex=false}={}){
 if(requiresCurrentFacts)return {tier:'research',requiresSources:true};
 if(['documentary','long_creation','advanced_math','programming','multimodal_transport','analysis'].includes(intent)||complex)
  return {tier:'deep',requiresSources:false};
 if(['education','translation','writing','explanation'].includes(intent))
  return {tier:'balanced',requiresSources:false};
 return {tier:'fast',requiresSources:false};
}
export function visibleModelText(payload){
 const obj=payload?.result??payload??{};
 for(const value of [obj.response,obj.output_text,obj?.choices?.[0]?.message?.content]){
  if(typeof value==='string'&&value.trim())return value.trim();
 }
 const out=Array.isArray(obj.output)?obj.output:[];
 return out.filter(item=>item?.type==='message').flatMap(item=>
  Array.isArray(item.content)?item.content:[])
  .filter(c=>c?.type==='output_text'||c?.type==='text')
  .map(c=>String(c.text||'')).join('\n').trim();
}
export function readUsage(payload){
 const u=(payload?.result?.usage||payload?.usage||{});
 const input=u.prompt_tokens??u.input_tokens??null;
 const output=u.completion_tokens??u.output_tokens??null;
 return {input_tokens:Number.isFinite(Number(input))?Number(input):null,
  output_tokens:Number.isFinite(Number(output))?Number(output):null};
}
function normalized(text){return String(text||'').toLocaleLowerCase('ro').normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
export function provisionalChecks(item,answer){
 const x=normalized(answer);const count=answer.trim().split(/\s+/).filter(Boolean).length;
 const criteria=[
  {name:'text_substantial',ok:count>=45},
  {name:'no_markdown_or_meta_refusal',ok:!/\b(?:ca model de limbaj|as an ai|nu pot răspunde)\b/i.test(x)},
  {name:'complete_final_sentence',ok:/[.!?…]["”’']?\s*$/.test(answer.trim())}
 ];
 if(item.id==='history'){
  criteria.push({name:'about_Decebal',ok:/decebal/i.test(x)});
  criteria.push({name:'mentions_roman_conflict',ok:/roma|roman|traian/i.test(x)});
  criteria.push({name:'no_invented_guide_Alex',ok:!/\balex\b|istoric pe nume|mormantul lui alex/i.test(x)});
 }else if(item.id==='education'){
  criteria.push({name:'solves_x_equals_6',ok:/x\s*=\s*6\b/i.test(x)});
  criteria.push({name:'shows_substitution',ok:/verific|inlocu|substitu|3\s*[·*×]?\s*6/i.test(x)});
 }else if(item.id==='transport'){
  criteria.push({name:'mentions_both_endpoints',ok:/grays/i.test(x)&&/oradea/i.test(x)});
  criteria.push({name:'no_invented_departure_times',ok:!/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/.test(x)});
  criteria.push({name:'discloses_missing_data',ok:/verific|nu (?:pot|am)|date (?:reale|actualizate)|orar|furnizor/i.test(x)});
 }else if(item.id==='creative'){
  criteria.push({name:'includes_compass',ok:/busola|busolei/i.test(x)});
  criteria.push({name:'avoids_generic_opening',ok:!x.startsWith('intr-o zi')});
  criteria.push({name:'avoids_empty_intention',ok:!x.includes('a decis sa afle mai multe')});
 }
 return {passed:criteria.filter(c=>c.ok).length,total:criteria.length,criteria,
  note:'Heuristic indicators, NOT an objective creativity or factuality score'};
}
export function selectedPilotPlan(){
 const pairs=PILOT_CASES.flatMap(item=>PILOT_MODELS.map(model=>({
  case_id:item.id,model_key:model.key,model_id:model.id,max_tokens:item.max_tokens
 })));
 if(pairs.length!==MAX_LIVE_CALLS)throw Error('Unexpected call count');
 return pairs;
}
function classifyHttp(status){
 if(status===401||status===403)return 'permission_or_plan';
 if(status===429)return 'quota_or_rate_limit';
 if(status===404)return 'model_unavailable';
 if(status>=500)return 'provider_unavailable';
 return 'http_error';
}
export async function runPilot({
 fetchImpl=fetch,accountId,apiToken,models=PILOT_MODELS,cases=PILOT_CASES,
 timeoutMs=60000,maxCalls=MAX_LIVE_CALLS
}={}){
 if(!accountId||!apiToken)throw new Error('Missing Cloudflare credentials');
 if(models.length*cases.length>MAX_LIVE_CALLS||maxCalls>MAX_LIVE_CALLS)
  throw new Error('Call cap exceeded');
 const blocked=new Set(),results=[];let calls=0,quotaStopped=false;
 for(const item of cases){
  for(const model of models){
   if(blocked.has(model.key)||quotaStopped){
    results.push({case_id:item.id,model:model.key,status:'skipped',reason:quotaStopped?'quota_stopped':'model_blocked'});
    continue;
   }
   if(calls>=maxCalls){
    results.push({case_id:item.id,model:model.key,status:'skipped',reason:'call_cap'});
    continue;
   }
   calls++;
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),timeoutMs);
   const started=Date.now();
   try{
    const response=await fetchImpl(
     'https://api.cloudflare.com/client/v4/accounts/'+encodeURIComponent(accountId)+'/ai/run/'+model.id,
     {method:'POST',headers:{
      'Authorization':'Bearer '+apiToken,'Content-Type':'application/json'
     },signal:controller.signal,body:JSON.stringify({
      messages:[{role:'system',content:item.system},{role:'user',content:item.user}],
      max_tokens:item.max_tokens,temperature:item.temperature,stream:false
     })}
    );
    const elapsedMs=Date.now()-started;
    if(!response.ok){
     const reason=classifyHttp(response.status);
     if(reason==='permission_or_plan'||reason==='model_unavailable')blocked.add(model.key);
     if(reason==='quota_or_rate_limit')quotaStopped=true;
     results.push({case_id:item.id,model:model.key,status:'error',reason,http_status:response.status,latency_ms:elapsedMs});
     continue;
    }
    const json=await response.json();
    if(json?.success===false){
     results.push({case_id:item.id,model:model.key,status:'error',reason:'provider_rejected',latency_ms:elapsedMs});
     continue;
    }
    const answer=visibleModelText(json);
    if(!answer){
     results.push({case_id:item.id,model:model.key,status:'error',reason:'empty_response',latency_ms:elapsedMs});
     continue;
    }
    results.push({case_id:item.id,model:model.key,status:'success',
     latency_ms:elapsedMs,word_count:answer.split(/\s+/).filter(Boolean).length,
     usage:readUsage(json),checks:provisionalChecks(item,answer),answer:answer.slice(0,3500)});
   }catch(error){
    results.push({case_id:item.id,model:model.key,status:'error',
     reason:error?.name==='AbortError'?'timeout':'network_or_inference_error',
     latency_ms:Date.now()-started});
   }finally{clearTimeout(timer)}
  }
 }
 return {created_at:new Date().toISOString(),status:'pilot_only_not_deployed',
  purpose:'Eva model quality comparison with synthetic prompts',
  max_allowed_calls:MAX_LIVE_CALLS,actual_calls:calls,quota_stopped:quotaStopped,
  models:models.map(({key,name,id})=>({key,name,id})),
  cases:cases.map(({id,group})=>({id,group})),results};
}
export function markdownReport(report){
 const lines=[
 '# Eva · comparație modele (pilot izolat)',
 '',
 '**Nu reprezintă o actualizare a APK-ului sau o schimbare a modelului din producție.**',
 '',
 'Data: '+report.created_at,
 '',
 'Apeluri trimise: '+report.actual_calls+' (limită '+report.max_allowed_calls+').',
 '',
 'Indicatorii de validare sunt doar verificări automate; calitatea literară și acuratețea istorică necesită evaluare umană.',
 '',
 '| Caz | Model | Rezultat | Latență | Tokenuri intrare/ieșire | Indicatori |',
 '|---|---|---|---:|---:|---:|'
 ];
 for(const row of report.results){
  const u=row.usage||{};
  const tokens=[u.input_tokens??'n/d',u.output_tokens??'n/d'].join(' / ');
  lines.push('| '+row.case_id+' | '+row.model+' | '+row.status+
   (row.reason?' ('+row.reason+')':'')+' | '+(row.latency_ms??'—')+
   ' ms | '+tokens+' | '+(row.checks?row.checks.passed+'/'+row.checks.total:'—')+' |');
 }
 for(const row of report.results.filter(r=>r.status==='success')){
  lines.push('\n## '+row.case_id+' · '+row.model+'\n\n'+row.answer+'\n');
 }
 return lines.join('\n');
}
async function main(){
 const dry=!process.argv.includes('--live');
 const outDir=resolve('reports');
 await mkdir(outDir,{recursive:true});
 if(dry){
  const p={status:'dry_run',max_live_calls:MAX_LIVE_CALLS,plan:selectedPilotPlan()};
  await writeFile(resolve(outDir,'eva-ai-model-pilot.json'),JSON.stringify(p,null,2));
  console.log('DRY RUN: '+p.plan.length+' possible calls; no API requests.');
  return;
 }
 if(!process.env.CLOUDFLARE_API_TOKEN||!process.env.CLOUDFLARE_ACCOUNT_ID){
  const p={status:'skipped_credentials_missing',max_live_calls:MAX_LIVE_CALLS};
  await writeFile(resolve(outDir,'eva-ai-model-pilot.json'),JSON.stringify(p,null,2));
  await writeFile(resolve(outDir,'eva-ai-model-pilot.md'),'# Pilot indisponibil\n\nCloudflare credentials are not configured.\n');
  console.log('SKIPPED: Cloudflare credentials unavailable.');
  return;
 }
 const report=await runPilot({
  accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
  apiToken:process.env.CLOUDFLARE_API_TOKEN
 });
 await writeFile(resolve(outDir,'eva-ai-model-pilot.json'),JSON.stringify(report,null,2));
 await writeFile(resolve(outDir,'eva-ai-model-pilot.md'),markdownReport(report));
 console.log(JSON.stringify({status:report.status,calls:report.actual_calls,
  successes:report.results.filter(x=>x.status==='success').length,
  errors:report.results.filter(x=>x.status==='error').map(x=>x.reason)}));
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 await main();
}
