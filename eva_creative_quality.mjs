// Shared creative-writing contract for Eva's assistant, education, studio and storybook.
// A request for adult-quality writing is not the same as a child-oriented story.
import {hasAssistantRepetitionLoop} from './ai_response_quality.mjs';
const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('ro').replace(/\s+/g,' ').trim();
const includes=(text,expr)=>expr.test(text);
const activityWriting=new Set(['write','essay','composition','creative_writing','script','story','documentary','presentation_copy']);
const creativeModules=new Set(['creative_storybook','creative_studio','creative_writing','creator_ai','ai_writing']);
const creationVerb=/^(?:(?:te rog|as vrea(?: sa)?|vreau(?: sa)?|poti(?: sa)?|i want(?: you to)?|please|can you)\s+)?(?:scrie(?:-mi)?|scrieti|creeaza(?:-mi)?|creaza(?:-mi)?|compune(?:-mi)?|redacteaza(?:-mi)?|genereaza(?:-mi)?|inventeaza(?:-mi)?|imagineaza(?:-ti)?|povesteste(?:-mi)?|fa(?:-mi)?|pregateste(?:-mi)?|write|create|draft|compose|generate|invent|tell me|make me|develop)\b/i;
const creationObject=/\b(?:povest(?:e|ea|i)|basm|nuvela|roman|scenariu|piesa de teatru|dialog fictiv|poezie|poem|versuri|documentar|eseu|compunere|discurs|monolog|articol|reportaj|biografie|descriere creativa|text publicitar|text de prezentare|reclama|campanie|postare|text pentru site|manifest|story|novel|fiction|documentary|essay|screenplay|script|poem|speech|creative writing|advertising copy)\b/i;
const knowledgeRequest=/^(?:cum (?:sa|se)|ce (?:este|inseamna)|de ce |unde |cand |how (?:to|do)|what (?:is|does)|where |when |explain |explica |analizeaza |compara |verifica |corecteaza |rezuma |summarize |translate |tradu |cauta |find |search )/i;
const negation=/^(?:nu |don't |do not )(?:(?:mai )?(?:scrie|crea|compune|redacta|genera|inventa|write|create|generate))\b/i;
const longForm=/\b(?:[2-9]\s*(?:pagini|pages)|\d{3,5}\s*(?:cuvinte|words)|[1-9]\d{3}\s*(?:cuvinte|words)|detaliat|amplu|integral|in extenso|full length|long form|complet)\b/i;
const childAudience=/\b(?:pentru copii|copii de|copil de|clasa [0-4]\b|prescolari|gradinita|children|kids|aged [3-9]|age [3-9])\b/i;
const factualGenre=/\b(?:documentar|documentary|biografie|biography|reportaj|reportage|istoric factual|historical documentary|studiu de caz)\b/i;
const factualInstructions=/\b(?:fapte istorice|surse|izvoare|verificabil|verificate|real documentat|date reale|source backed|verified facts|real evidence)\b/i;
export function evaCreativeIntent(task={}){
 const message=String(task.message||task.query||task.story_seed||'').trim();
 const n=norm(message);
 const module=norm(task.module||'').replace(/[\s-]+/g,'_');
 const activity=norm(task.activity||task.education_activity||'').replace(/[\s-]+/g,'_');
 const genre=norm(task.genre||task.story_type||'');
 const selectedActivity=activityWriting.has(activity);
 const explicitModule=creativeModules.has(module);
 const directCreation=creationVerb.test(n)&&creationObject.test(n)&&!knowledgeRequest.test(n)&&!negation.test(n);
 const requestedCreation=/^(?:am nevoie de|i need|vreau|i want)\s+(?:un|o|a|an)\s+(?:poveste|documentar|eseu|scenariu|poezie|discurs|compunere|reportaj|story|documentary|essay|script|poem|speech)\b/i.test(n);
 const requested=explicitModule||selectedActivity||directCreation||requestedCreation;
 if(!requested)return {requested:false,kind:'none',audience:'general',factual:false,long:false};
 let kind='prose';
 if(['documentary'].includes(genre)||factualGenre.test(n))kind='documentary';
 else if(['children','family','travel'].includes(genre)||/\b(?:povest|basm|nuvela|roman|story|novel|fiction|adventure)\b/.test(n))kind='story';
 else if(/\b(?:poem|poezie|versuri|poetry)\b/.test(n))kind='poetry';
 else if(/\b(?:scenariu|script|screenplay|dialog fictiv|piesa de teatru)\b/.test(n))kind='script';
 else if(activity==='essay'||/\b(?:eseu|essay|compunere)\b/.test(n))kind='essay';
 else if(/\b(?:reclama|publicitar|campanie|advertising|copywriting|postare)\b/.test(n))kind='marketing';
 else if(/\b(?:discurs|speech|monolog)\b/.test(n))kind='speech';
 const audience=childAudience.test(n)||genre==='children'?'children':'general';
 const factual=kind==='documentary'||(kind==='essay'&&module==='education_study')||factualInstructions.test(n);
 const isLong=explicitModule||longForm.test(n)||kind==='documentary'||(kind==='essay'&&activity==='essay');
 return {requested:true,kind,audience,factual,long:isLong};
}
const PREAMBLE='You are writing the requested finished work, not giving advice about how to write it. Preserve the user’s subject, format, language, audience, constraints and requested length. Write fluent, distinctive, well-developed prose with natural rhythm, precise vocabulary and a meaningful ending. Avoid filler, clichés, childish moralizing, generic introductions, repetitive paraphrases and arbitrary characters. Finish paragraphs and sentences; do not stop mid-word.';
const BY_KIND={
 story:'Build scenes with concrete actions, believable motives, obstacles and consequences; make something actually happen. Use selective vivid sensory detail and natural dialogue when helpful. The ending must pay off the central thread, not merely announce a lesson.',
 documentary:'Write a gripping but serious factual documentary, not a fictional adventure. Keep the actual historical people and events central, explain chronology, causes and consequences, and distinguish evidence from disputed interpretations. Never invent eyewitness quotes, discoveries, characters, dialogue or specific dates. Draw factual assertions only from supplied evidence.',
 essay:'Develop a defensible thesis, a progression of specific arguments with examples, counterpoints when useful, and a conclusion that follows from the reasoning. No schoolbook filler or invented quotations. Adapt depth to school level, professional setting or audience requested.',
 poetry:'Use original images, controlled rhythm, intentional word choices and meaningful movement. Avoid nursery-rhyme platitudes unless explicitly requested.',
 script:'Write staged scenes and character actions with purposeful dialogue and believable transitions. No generic synopsis in place of the requested script.',
 marketing:'Write persuasive but credible copy grounded in user-provided product facts. Use distinct benefits and a natural call to action. Never fabricate reviews, statistics, guarantees or results.',
 speech:'Write for the ear, with a coherent argument or emotional arc, memorable concrete examples and natural cadence. Avoid generic motivational clichés.',
 prose:'Deliver the complete requested artifact with an intentional structure, clear development, specific observations and an appropriate conclusion; do not substitute an outline.'
};
export function evaCreativeGuide(intent){
 if(!intent?.requested)return '';
 const audience=intent.audience==='children'
  ?'For children, be age-appropriate and imaginative but never babyish or condescending. Do not simplify into a flat moral.'
  :'Default to an intelligent adult register unless the user requests otherwise; never assume that all creative tasks are for children.';
 const factual=intent.factual
  ?'Treat source-backed claims as evidence and uncertain claims as uncertain; never pass invention off as verified fact.'
  :'Clearly separate invented scenes from any real historical material that appears.';
 return [PREAMBLE,BY_KIND[intent.kind]||BY_KIND.prose,audience,factual].join(' ');
}
export function enhanceEvaCreativeOptions(task,options){
 const intent=evaCreativeIntent(task);
 if(!intent.requested)return {intent,options};
 const original=options&&typeof options==='object'?options:{};
 const messages=Array.isArray(original.messages)?original.messages.map(x=>({...x})):[];
 const guidance=evaCreativeGuide(intent);
 const firstSystem=messages.findIndex(x=>x.role==='system');
 if(firstSystem>=0)messages[firstSystem].content=String(messages[firstSystem].content||'')+'\n\n'+guidance;
 else messages.unshift({role:'system',content:guidance});
 const presentBudget=Number(original.max_tokens)||0;
 const minimum=intent.long?2300:intent.kind==='marketing'?800:1400;
 const maximum=intent.long?3600:2600;
 const maxTokens=Math.max(minimum,Math.min(maximum,presentBudget||minimum));
 const desiredTemperature=intent.factual?0.25:intent.kind==='story'||intent.kind==='poetry'?0.65:0.48;
 const currentTemp=Number(original.temperature);
 // Low temperature in generic assistant/education requests makes stories flat.
 const temperature=Number.isFinite(currentTemp)?Math.max(currentTemp,desiredTemperature):desiredTemperature;
 return {intent,options:{...original,messages,max_tokens:maxTokens,temperature}};
}
export function evaCreativeQualityIssue(text,intent){
 if(!intent?.requested)return null;
 const value=String(text||'').trim();
 if(!value)return 'empty';
 if(hasAssistantRepetitionLoop(value))return 'repetition_loop';
 // Only detect clearly unfinished prose; do not reject dialogue, poetry or scripts on punctuation alone.
 if(['story','documentary','essay','prose','speech'].includes(intent.kind)&&value.length>200
   &&/[.!?…»”"')\]}]$/.test(value)===false
   &&/\p{L}$/u.test(value))return 'unfinished_ending';
 return null;
}
