// Isolated regression for county-first navigation and encyclopedia-language fallbacks.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N} ]/gu,' ').replace(/\s+/g,' ').trim();

const begin=backend.indexOf('// Resolve short ambiguous names');
const end=backend.indexOf('    let verifiedCity=null;',begin);
assert(begin>=0&&end>begin,'ambiguity resolver found');
const snippet=backend.slice(begin,end);
let providerCalls=[];
const fetchFake=async url=>{
 const u=String(url);providerCalls.push(u);
 const body=u.includes('geoapify.com')?{features:[{properties:{
  result_type:'city',city:'Alba',country_code:'ro',lat:46.07,lon:23.58
 }}]}:u.includes('tomtom.com')?{results:[{
  type:'area',areaType:'municipality',address:{countryCodeIso2:'RO',municipality:'Alba'},position:{coordinates:[23.58,46.07]}
 }]}:{query:{search:[{title:'Alba'},{title:'Județul Alba'}]}};
 return {ok:true,json:async()=>body};
};
const base={API_VERSION:'v-test',message:'Alba',bareTopic:'Alba',parts:['Alba'],
 seekingRoute:false,explicitKnowledge:false,knownTopic:undefined,topicKey:'alba',lang:'ro',data:{},
 env:{TOMTOM_API_KEY:'TEST_ONLY',GEOAPIFY_API_KEY:'TEST_ONLY'},
 countryNameCodes:new Map([['romania','RO']]),normalizeGeoName:norm,json:async x=>x,fetch:fetchFake};
const resolver=new Function(...Object.keys(base),'return (async()=>{' + snippet + ';return null;})()');
const found=await resolver(...Object.values(base));
assert.equal(found.entity_disambiguation,true);
assert(found.choice_options.length>=2);
assert(found.choice_options.some(x=>x.entity_type==='region'&&x.entity_country_code==='RO'),'Wikipedia county classification');
assert.equal(found.choice_options[0].entity_type,'region','county before ambiguous city centroid');
assert(found.choice_options.some(x=>x.entity_kind==='article'),'retain information-only meaning');
assert(providerCalls.some(x=>x.includes('tomtom.com')),'geographic cross-check occurs');

const ui=frontend.slice(frontend.indexOf('function appendConversationChoices'),frontend.indexOf('function appendTravelModeOverview'));
const county=frontend.slice(frontend.indexOf('function openAssistantStructuredAddress('),frontend.indexOf('function appendConversationChoices(',frontend.indexOf('function openAssistantStructuredAddress(')));
assert(county.includes('renderStructuredAddressPicker({body:container')&&frontend.includes('function renderStructuredAddressPicker('),'county uses shared verified municipality picker');
assert(county.includes("type==='region'")&&county.includes('region:regionName'),'county scope carried into verified locality lookup');
assert(county.includes("if(type==='city'&&point){search(point);return}"),'only verified city can search hotels immediately');
assert(county.includes('openAssistantStructuredAddress(option,{cityOnly:true'),'county lodging requests only town, not an arbitrary county centroid');
assert(county.includes('openAssistantStructuredAddress(option)}'),'declined lodging continues to street/house lookup');
assert(ui.includes("state.pendingSelectedEntityKind='article'"),'selected informational meaning retained');
assert(frontend.includes('selected_entity_kind:selectedEntityKind'),'semantic kind reaches API');
assert(backend.includes("article.can_route=!encyclopedicOnly&&Boolean("),'article cannot open map CTA');

const translationStart=backend.indexOf('// English Wikipedia is a source, not the preferred display language.');
const translationEnd=backend.indexOf('// Country code comes from the named country or verified city',translationStart);
assert(translationStart>=0&&translationEnd>translationStart,'translation pipeline found');
const translatorSnippet=backend.slice(translationStart,translationEnd);
const runTranslator=(article,aiRun,provider)=>new Function(
 'article','lang','env','selectedAiModel','allowedTextModels','responseLanguageName','fetch','URL','AbortSignal','console',
 'return (async()=>{' + translatorSnippet + ';return article;})()'
)(article,'ro',{AI:{run:aiRun}},'modelA',['modelA','modelB','modelC'],'Romanian',provider||fetchFake,URL,AbortSignal,console);

const intro='Alba is the Gaelic name for Scotland and also the name of an early medieval kingdom in northern Britain.';
const translated=await runTranslator({language:'en',description:'Gaelic name for Scotland',extract:intro},
 async()=>({response:'Alba este denumirea în limba gaelică a Scoției și numele unui regat medieval timpuriu din nordul Britaniei.'}));
assert.equal(translated.translation_status,'translated');
assert.equal(translated.description,'','no English description left');
assert.match(translated.extract,/Scoției/);
assert(!translated.extract.includes('nu a putut fi tradus'));

let aiCalls=0;
const linked=await runTranslator({language:'en',wikibase_item:'Q123',description:'English description',extract:intro},
 async()=>{aiCalls++;return {response:'unused'};},async url=>{
  if(String(url).includes('wikidata.org'))return {ok:true,json:async()=>({entities:{Q123:{sitelinks:{rowiki:{title:'Regatul Alba'}}}}})};
  return {ok:true,json:async()=>({title:'Regatul Alba',description:'Regat istoric',extract:'Regatul Alba a existat în Evul Mediu.',content_urls:{desktop:{page:'https://ro.wikipedia.org/wiki/Regatul_Alba'}}})};
 });
assert.equal(linked.translation_status,'localized_wikipedia');
assert.equal(linked.language,'ro');
assert.equal(aiCalls,0,'native-language Wikipedia preferred without AI model');

const failed=await runTranslator({language:'en',description:'English description',extract:intro},async()=>({response:''}));
assert.equal(failed.translation_status,'original_with_notice');
assert(failed.extract.includes(intro),'retain original factual content instead of only an error');
console.log('County locality and encyclopedia localization regressions passed.');
