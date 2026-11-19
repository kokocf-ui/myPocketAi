// Eva AI routing policy and output adapter. No secrets, no network, no user data storage.
// Experimental: active only when POCKET_EVA_SMART_ROUTER_ENABLED === "1".
// Provider-backed factual operations (routes, fares, availability) remain specialized.
export const EVA_AI_MODELS=Object.freeze({
 fast:'@cf/meta/llama-3.1-8b-instruct-fast',
 balanced:'@cf/meta/llama-3.3-70b-instruct-fp8-fast',
 deep:'@cf/openai/gpt-oss-120b'
});
const CREATIVE=new Set(['children','documentary','family','travel']);
const SCIENCE=new Set(['math','physics','chemistry','biology','astronomy','computing']);
const STUDY=new Set(['history','geography','language_literature','school_admission','foreign_language','practical']);
const EVIDENCE=new Set(['documentary','verified_research','evidence_summary']);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function planEvaAI(task={}, {enabled=false,legacyModel=EVA_AI_MODELS.fast}={}){
 const module=norm(task.module||'assistant').replace(/[\s-]+/g,'_');
 const subject=norm(task.education_subject||task.subject);
 const genre=norm(task.genre||task.story_type);
 const activity=norm(task.activity||task.education_activity);
 const query=norm(task.query||task.message).slice(0,1200);
 if(!enabled)return Object.freeze({
  tier:'legacy',model:legacyModel,fallback:null,
  evidenceRequired:false,reasons:['feature_disabled']
 });
 let tier='fast',reason='simple_request';
 if(module==='creative_storybook'&&CREATIVE.has(genre)){
  tier='deep';reason=genre==='documentary'?'nonfiction_documentary':'long_form_creative';
 }else if(module==='education_study'||module==='learning'){
  tier=SCIENCE.has(subject)&&/(analysis|solve|proof|write|essay|complex|advanced|verific|demonstra|deduc|anali|rezolv)/.test(activity+' '+query)
   ?'deep':'balanced';
  if(STUDY.has(subject)&&/(analysis|essay|write|comparison|research|documentary|compare|analiz|eseu|argument|compar)/.test(activity+' '+query))
   tier='deep';
  reason='education_'+subject;
 }else if(module==='assistant'||module==='travel'||module==='maps'){
  // Navigation remains provider-verified. AI can explain results, never invent schedules.
  const isReasoning=/(analiz|analyze|analys|demonstra|demonstrate|argument|explica detaliat|explain in detail|strategie|strategy|compar|compare|investig|investig|documentar|referat|eseu|essay|program|debug|cod |code |pas cu pas|step by step|plan complet|itinerariu complet)/.test(query);
  const isTechnical=/(matemat|algebra|chimie|fizica|physics|chemistry|programare|javascript|python|istoric|historical)/.test(query);
  tier=(isReasoning&&isTechnical)||query.length>420?'deep':isReasoning?'balanced':'fast';
  reason=module==='assistant'?'assistant_complexity':'provider_result_explanation';
 }else if(['news','news_translation','simple_translation','eva_chat','dialogue','social'].includes(module)){
  tier='fast';reason='latency_sensitive';
 }else if(/(write|essay|analysis|report|creative|research)/.test(activity)){
  tier='balanced';reason='other_complex_request';
 }
 if(task.forceTier&&['fast','balanced','deep'].includes(task.forceTier))
  {tier=task.forceTier;reason='explicit_internal_task_tier';}
 const evidenceRequired=EVIDENCE.has(genre)||task.requiresSources===true;
 return Object.freeze({
  tier,model:EVA_AI_MODELS[tier],
  fallback:tier==='deep'?EVA_AI_MODELS.balanced:
    tier==='balanced'?EVA_AI_MODELS.fast:null,
  evidenceRequired,reasons:[reason]
 });
}
export function evaVisibleAnswer(raw){
 const root=raw?.result||raw||{};
 const direct=[root.response,root.output_text,root?.choices?.[0]?.message?.content];
 for(const x of direct)if(typeof x==='string'&&x.trim())return x.trim();
 const output=Array.isArray(root.output)?root.output:[];
 const texts=output.filter(x=>x?.type==='message').flatMap(x=>Array.isArray(x.content)?x.content:[])
  .filter(x=>x?.type==='output_text'||x?.type==='text')
  .map(x=>String(x.text||''));
 return texts.join('\n').trim();
}
function isQuotaError(err){
 const str=String(err?.message||err||'');
 return /\b4006\b|daily.*(allocation|limit)|quota.exceeded|rate.limit|\b429\b/i.test(str);
}
export function evaModelOptions(plan,options){
 const supplied=options&&typeof options==='object'?{...options}:{};
 if(plan.tier!=='deep')return supplied;
 // GPT-OSS spends output tokens on reasoning. Low effort preserves useful prose
 // with a bounded output budget; supported by Cloudflare Workers AI model schema.
 const limit=Number(supplied.max_tokens)||1600;
 return {...supplied,reasoning_effort:'low',
  max_tokens:Math.max(900,Math.min(3600,limit))};
}
export async function executeEvaAI(ai,plan,options,{allowFallback=true}={}){
 if(!ai||typeof ai.run!=='function')throw new Error('eva_ai_unavailable');
 const model=plan?.model||EVA_AI_MODELS.fast;
 const makeResponse=(raw,usedModel,fallback)=>{
  const answer=evaVisibleAnswer(raw);
  if(!answer)throw new Error('eva_ai_empty_visible_response');
  return {
   ...(raw&&typeof raw==='object'?raw:{}),
   response:answer,
   eva_model_used:usedModel,eva_model_fallback:!!fallback,
   eva_tier:plan?.tier||'legacy'
  };
 };
 try{
  return makeResponse(await ai.run(model,evaModelOptions(plan,options)),model,false);
 }catch(error){
  if(isQuotaError(error)||!allowFallback||!plan?.fallback||plan.fallback===model)throw error;
  // Exactly one fallback; never retry quota limits or recursively call more models.
  const fallbackPlan={...plan,tier:'balanced',model:plan.fallback,fallback:null};
  return makeResponse(await ai.run(plan.fallback,evaModelOptions(fallbackPlan,options)),plan.fallback,true);
 }
}
