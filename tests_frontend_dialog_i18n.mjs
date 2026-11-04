import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import frontend from './index.js';
const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const start=source.indexOf('const POCKET_DIALOG_TEXT=');
const end=source.indexOf('function renderStructuredAddressPicker(',start);
assert(start>0&&end>start,'centralized dialog translation catalog exists');
const context=vm.createContext({state:{language:'ro'}});
vm.runInContext(source.slice(start,end),context);
const languages=['ro','en','fr','de','it','es','pt','nl','ru','pl'];
const count=vm.runInContext('Object.keys(POCKET_DIALOG_TEXT).length',context);
assert(count>=90,'new selector/dialog catalog covers 90+ entries');
for(const language of languages){
 context.state.language=language;
 const pairs=[
  ['Alege o opțiune','Choose an option'],
  ['Confirmă localitatea de destinație','Confirm destination town'],
  ['Caută cazare','Find accommodation'],
  ['Stradă (opțional)','Street (optional)'],
  ['Căutarea nu este disponibilă acum.','Search is unavailable right now.'],
  ['Nu există conversații salvate încă.','No saved conversations yet.'],
  ['Verifică localitatea','Verify town'],
  ['Conversație nouă','New conversation'],
 ];
 for(const [ro,en] of pairs){
  const actual=vm.runInContext('dialogText('+JSON.stringify(ro)+','+JSON.stringify(en)+')',context);
  assert.equal(typeof actual,'string');
  assert(actual.length>1);
  if(language==='ro')assert.equal(actual,ro);
  else if(language==='en')assert.equal(actual,en);
  else assert.notEqual(actual,en,language+': untranslated English UI label '+en);
 }
}
const incomplete=vm.runInContext('Object.entries(POCKET_DIALOG_TEXT).filter(([k,v])=>["fr","de","it","es","pt","nl","ru","pl"].some(l=>!v[l])).map(([k])=>k)',context);
assert.equal(incomplete.length,0,'catalog must provide all eight additional translations: '+incomplete.join(', '));
assert(source.includes('const t=(a,b)=>dialogText(a,b);'),'shared address picker uses all languages');
assert(source.includes("dialogText('Confirmă localitatea pentru a evita un traseu către o stație greșită.'"),'station prompt localized');
assert(!source.includes("p.textContent='Nu există conversații salvate încă.'"),'history no longer Romanian-only');
const html=await (await frontend.fetch(new Request('https://example.test/'))).text();
const inline=html.match(new RegExp('<script[^>]*>([\\s\\S]*?)</script>','i'))?.[1];
assert(inline,'generated frontend JS exists');
new vm.Script(inline);
console.log('Ten-language frontend dialog translations, coverage and browser syntax — PASS ('+count+' entries)');
