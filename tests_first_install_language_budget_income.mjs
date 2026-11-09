import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {POCKET_LANGUAGES,pocketPreferredLanguage,pocketLanguageFromLocale,pocketLanguageFromCountry} from './language_first_install.mjs';

assert.deepEqual(POCKET_LANGUAGES,['ro','en','fr','de','it','es','pt','nl','ru','pl']);
assert.deepEqual(pocketPreferredLanguage(null,'en-GB'),{language:'en',allowAutomaticDetection:true});
assert.deepEqual(pocketPreferredLanguage(null,'ro-RO'),{language:'ro',allowAutomaticDetection:true});
assert.deepEqual(pocketPreferredLanguage('fr','en-GB'),{language:'fr',allowAutomaticDetection:false},'Saved manual French wins in UK');
assert.deepEqual(pocketPreferredLanguage('ro','en-GB'),{language:'ro',allowAutomaticDetection:false},'Existing Romanian setting survives update');
assert.equal(pocketLanguageFromLocale('ja-JP'),'en','Unsupported device language falls back to English');
assert.equal(pocketLanguageFromCountry('GB','ro-RO'),'en','UK location overrides Romanian phone language on first install');
assert.equal(pocketLanguageFromCountry('RO','en-GB'),'ro','Romania location overrides English phone language on first install');
assert.equal(pocketLanguageFromCountry('FR','en-GB'),'fr');
assert.equal(pocketLanguageFromCountry('DE','en-GB'),'de');
assert.equal(pocketLanguageFromCountry('IT','en-GB'),'it');
assert.equal(pocketLanguageFromCountry('ES','en-GB'),'es');
assert.equal(pocketLanguageFromCountry('PT','en-GB'),'pt');
assert.equal(pocketLanguageFromCountry('NL','en-GB'),'nl');
assert.equal(pocketLanguageFromCountry('RU','en-GB'),'ru');
assert.equal(pocketLanguageFromCountry('PL','en-GB'),'pl');
assert.equal(pocketLanguageFromCountry('BR','en-GB'),'pt');
assert.equal(pocketLanguageFromCountry('JP','ro-RO'),'ro','Unsupported country uses a supported phone language');

const html=await(await app.fetch(new Request('https://pocket-language-budget.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Generated app browser code exists');
new vm.Script(script,{filename:'first-install-budget.js'});
assert.match(script,/const pocketPreferredLanguage=/);
assert.match(script,/pocketFirstInstallAutoLanguage=false/);
assert.match(script,/pocketFirstInstallDetectCountry\(\);/,'First-install detection starts after location startup');
assert.match(script,/localStorage\.getItem\('mypocketai.language'\)/,'Previous saved language read first');
assert.match(script,/pocketFirstInstallAutoLanguage=false; \/\/ in-flight country detection cannot override a user choice/);
assert.match(script,/localStorage\.setItem\('mypocketai.language.source','manual'\)/,'Manual selection persisted');
assert.match(script,/confidence<pocketAutoCountryConfidence/,'GPS country has precedence over approximate network location');

assert.match(script,/if\(budgetScreen==='home'&&budgetIsActive\(\)\)renderBudget\(\)/,'Geo currency refresh cannot destroy editable income form');
assert.match(script,/form\.noValidate=true/,'Form manually handles invalid fields with visible feedback');
assert.match(script,/save\.type='submit'/,'Manual income button triggers real submit');
assert.match(script,/form\.addEventListener\('submit',async event=>/,'Android click and keyboard have one submit path');
assert.match(script,/feedback\.setAttribute\('aria-live','polite'\)/,'Inline error announced');
assert.match(script,/budgetAmount\(value\.value\)/,'Manual numeric validation before saving');
assert.match(script,/if\(saving\)return/,'Double-click race prevented');
assert.match(script,/timeout=setTimeout\(\(\)=>controller\.abort\(\),12000\)/,'FX call has finite timeout');
assert.match(script,/const ok=await budgetAddEntry\(\{title,amount,currency:currency\.value/,'Income and expense use one persistence function');

const functionStart=script.indexOf('async function budgetAddEntry(details){');
const functionEnd=script.indexOf('function budgetVoiceStop(){',functionStart);
assert.ok(functionStart>=0&&functionEnd>functionStart,'Budget entry function present');
const state={entries:[],baseCurrency:'GBP',currencyLocked:false,openingBalance:null};
const writes=[];
const factory=new Function('budgetAmount','budgetRead','budgetExchangeRate','budgetDateNow','budgetWrite','shopId','budgetIsActive','renderBudget','notify','learningLabel',
 'let budgetScreen="home";'+script.slice(functionStart,functionEnd)+'\nreturn budgetAddEntry');
const add=factory(
 value=>{const n=Number(value);return Number.isFinite(n)&&n>0?n:null},
 ()=>state,
 async()=>({rate:1,date:'2026-11-09',source:'identical'}),
 ()=>'2026-11-09',
 entry=>{writes.push(JSON.stringify(entry));return true},
 ()=>'test-entry-001',
 ()=>false,()=>{},()=>{},(ro)=>ro
);
assert.equal(await add({title:'Salariu',amount:195,currency:'GBP',date:'2026-11-09',type:'income',category:'salary'}),true);
assert.equal(state.entries.length,1,'Income saved exactly once');
assert.equal(state.entries[0].type,'income');
assert.equal(state.entries[0].baseAmount,195);
assert.equal(writes.length,1);
assert.equal(await add({title:'Salariu',amount:'',currency:'GBP',date:'2026-11-09',type:'income'}),false);
assert.equal(state.entries.length,1,'Invalid form never saved');
console.log('PASS first-install locale + explicit override + Android income save + FX timeout and duplicate protection');
