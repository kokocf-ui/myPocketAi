import assert from 'node:assert/strict';
import vm from 'node:vm';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {EDUCATION_SELECTS_UI_SCRIPT} from './education_selects_ui.mjs';
import {COMPUTING_UI_SCRIPT} from './computing_ui.mjs';
import {EXAM_UI_SCRIPT} from './exam_ui.mjs';
import {PRACTICAL_UI_SCRIPT} from './practical_ui.mjs';

for(const [name,script] of [
 ['country',EDUCATION_COUNTRY_UI_SCRIPT],['selector',EDUCATION_SELECTS_UI_SCRIPT],
 ['computing',COMPUTING_UI_SCRIPT],['exams',EXAM_UI_SCRIPT],['practical',PRACTICAL_UI_SCRIPT]
])new vm.Script(script,{filename:name+'-education-ui.js'});

const factory=new Function('state','learningLabel','Intl',
 EDUCATION_COUNTRY_UI_SCRIPT+';return {label:eduUiLabel,country:eduCountryLabel,fold:eduCountryFold};');
const fallback=(ro,en)=>en||ro;
for(const [lang,expected] of [
 ['ro','Continuă'],['en','Continue'],['fr','Continuer'],['de','Weiter'],
 ['it','Continua'],['es','Continuar'],['pt','Continuar'],['nl','Doorgaan'],
 ['ru','Продолжить'],['pl','Kontynuuj']
]){
 const api=factory({language:lang},fallback,Intl);
 assert.equal(api.label('Continuă','Continue'),expected,'Continue localized in '+lang);
 if(lang!=='en')assert.notEqual(api.label('Țara studiului','Country of study'),'Country of study','No English fallback on country label: '+lang);
 assert.ok(api.country({id:'GB-ENG',ro:'Anglia',en:'England'}),'UK region label '+lang);
}
const french=factory({language:'fr'},fallback,Intl);
assert.equal(french.country({id:'GB-ENG',ro:'Anglia',en:'England'}),'Angleterre');
assert.equal(french.country({id:'DE',ro:'Germania',en:'Germany'}),'Allemagne');
assert.ok(french.fold(french.country({id:'DE',ro:'Germania',en:'Germany'})).startsWith('allemagne'));
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/fold\(eduCountryLabel\(c\)\)\.startsWith\(query\)/,'Country search includes selected UI language');
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/fold\(eduCountryLabel\(c\)\)===fold\(input\.value\)/,'Country confirmation supports localized name');
assert.match(EDUCATION_SELECTS_UI_SCRIPT,/eduUiLabel\('Niciun rezultat\.'/,'In-page selectors use shared labels');
assert.match(EXAM_UI_SCRIPT,/typeof eduUiLabel==='function'\?eduUiLabel\(ro,en\)/,'Exams use shared labels');
assert.match(PRACTICAL_UI_SCRIPT,/typeof eduUiLabel==='function'\?eduUiLabel\(ro,en\)/,'Practical courses use shared labels');
assert.match(COMPUTING_UI_SCRIPT,/typeof eduUiLabel==='function'\?eduUiLabel\(ro,en\)/,'Computing uses shared fallback');

// Existing backend translation is optional, cached, and cannot reorder quiz answers.
const testStore=new Map();
let modelRequests=0;
const original={title:'Lecție cu 12 exemple',question:'Cât face 12?',choices:['2','4','12','14']};
const translated={title:'Leçon avec 12 exemples',question:'Combien font 12 ?',choices:['2','4','12','14']};
const translateFactory=new Function('state','learningLabel','CLIENT_CONFIG','localStorage','fetch',
 EDUCATION_COUNTRY_UI_SCRIPT+';return {translate:eduTranslateMaterial,valid:eduValidateTranslation};');
const translateApi=translateFactory({language:'fr'},fallback,{apiUrl:'https://example.invalid'},
 {getItem:key=>testStore.get(key)||null,setItem:(key,value)=>testStore.set(key,value)},
 async(_url,options)=>{
  modelRequests++;
  assert.equal(JSON.parse(options.body).language,'fr');
  return {ok:true,json:async()=>({status:'success',reply:JSON.stringify(translated)})};
 });
assert.deepEqual(await translateApi.translate(original,'computing:lesson'),translated);
assert.deepEqual(await translateApi.translate(original,'computing:lesson'),translated);
assert.equal(modelRequests,1,'Successful translation is cached per language and source');
assert.equal(translateApi.valid(original,{...translated,question:'Combien font 13 ?'}),false,'Reject changed numeric fact');
assert.equal(translateApi.valid(original,{...translated,choices:['2','12']}),false,'Reject missing quiz answers');
assert.match(COMPUTING_UI_SCRIPT,/eduTranslateMaterial\(originals,'computing:'\+t\.id\)/,'Translate Computing lesson as a whole');
assert.match(COMPUTING_UI_SCRIPT,/choiceButtons\.forEach\(b=>b\.disabled=true\)/,'Hold quiz while translation is pending');
assert.match(COMPUTING_UI_SCRIPT,/localized\.choices\.forEach/,'Keep answer ordering in displayed choices');

console.log('PASS 10-language Education navigation, country lookup and embedded script syntax');
