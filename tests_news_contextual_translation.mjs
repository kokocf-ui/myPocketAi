import assert from 'node:assert/strict';
import {localizeNewsRows} from './localization.mjs';
import {translateUserSuppliedTelegramText} from './news_article_detail.mjs';

const arabic={title:'أعلنت الوزارة مقتل 12 شخصاً وفق مصادر محلية',
 summary:'وقالت الجهات الرسمية إن التقارير الأولية لم تؤكد سبب الحادث.',
 source_name:'Al Masdar',url:'https://example.org/article-1',published_at:'2026-11-07'};
let chosen=[],requests=[];
const ai={run:async(model,opts)=>{
 chosen.push(model);requests.push(opts);
 return {response:JSON.stringify([{id:0,title:'Ministerul a anunțat moartea a 12 persoane, potrivit surselor locale',
  summary:'Autoritățile au declarat că rapoartele preliminare nu au confirmat cauza incidentului.'}])};
}};
const result=await localizeNewsRows([arabic],'ro',ai,'@cf/meta/llama-3.1-8b-instruct-fast');
assert.equal(result[0].translation_status,'translated');
assert.equal(result[0].translation_quality,'contextual_arabic_script');
assert.equal(result[0].source_name,arabic.source_name);
assert.equal(result[0].url,arabic.url);
assert.equal(result[0].original_title,arabic.title);
assert.ok(chosen.every(m=>m.includes('llama-3.3-70b')),'Arabic uses the context-capable model');
assert.match(requests[0].messages[0].content,/idioms.*Arabic/i);
assert.match(requests[0].messages[0].content,/uncertainty/i);
const raw=JSON.parse(requests[0].messages[1].content);
assert.equal(raw[0].summary,arabic.summary,'title and excerpt are supplied together');
assert.equal(raw[0].publisher,arabic.source_name);

const missingNumberAi={run:async()=>({response:JSON.stringify([{id:0,
 title:'Ministerul a anunțat moartea unor persoane, potrivit surselor locale',
 summary:'Autoritățile nu au confirmat cauza incidentului.'}])})};
const invalid=await localizeNewsRows([arabic],'ro',missingNumberAi,'mock');
assert.equal(invalid[0].translation_status,'original_untranslated','loss of 12 must not be marked translated');
assert.equal(invalid[0].title,arabic.title);
assert.match(invalid[0].translation_notice,/nu a trecut verificarea/i);

const badArabicAi={run:async(_model,opts)=>{
 const sys=opts.messages[0].content;
 if(sys.includes('JSON array'))return {response:'not JSON'};
 if(sys.includes('JSON object'))return {response:'still not JSON'};
 return {response:'wrong translation'};
}};
const untranslatable=await localizeNewsRows([arabic],'ro',badArabicAi,'mock');
assert.equal(untranslatable[0].translation_status,'original_untranslated');
assert.equal(untranslatable[0].title,arabic.title);
assert.equal(untranslatable[0].translation_quality,undefined,'no fabricated contextual quality claim');

const post='قالت السلطات إن 12 شخصاً أصيبوا ولكن لم تؤكد التقارير الأولى سبب الحادث.';
let postModel='',postSystem='';
const telegramEnv={AI:{run:async(model,options)=>{postModel=model;postSystem=options.messages[0].content;
 return {response:'Autoritățile au declarat că 12 persoane au fost rănite, dar rapoartele inițiale nu au confirmat cauza incidentului.'};
}}};
const translated=await translateUserSuppliedTelegramText(telegramEnv,post,'ro',true);
assert.equal(translated.status,'success');
assert.equal(translated.translation_quality,'contextual_ai');
assert.match(postModel,/llama-3.3-70b/);
assert.match(postSystem,/NOT word-for-word subtitles/);
const noWordByWord={AI:{run:async(model)=>{assert.match(model,/llama-3.3-70b/);return {response:''};}}};
const refused=await translateUserSuppliedTelegramText(noWordByWord,post,'ro',true);
assert.equal(refused.status,'translation_unavailable','Arabic must not silently switch to a literal engine');
console.log('PASS contextual Arabic news and user-supplied translation, rejection of missing facts');
