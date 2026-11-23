import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {chromium} from 'playwright';
import {MATH_READER_LOCALE_UI_SCRIPT} from './math_reader_locale_ui.mjs';

new vm.Script(MATH_READER_LOCALE_UI_SCRIPT);
assert.ok(MATH_READER_LOCALE_UI_SCRIPT.includes("state.language!=='ro'"));
assert.ok(MATH_READER_LOCALE_UI_SCRIPT.includes('formulaOnly(text)'));
assert.ok(MATH_READER_LOCALE_UI_SCRIPT.includes("eduTranslateMaterial(original,key,'mixed')"));
const html=await(await app.fetch(new Request('https://math-locale.test/'))).text();
const script=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
new vm.Script(script);
assert.ok(script.includes('function inMathReader()'),
 'Client Mathematics lesson reader must actually include dynamic localization');

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},locale:'it-IT'});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('about:blank');
 await page.evaluate(src=>{
  document.body.innerHTML='<main id="view-module" class="learning-math"></main>'+
   '<div id="educationPagedLessonDialog" style="display:block">'+
   '<article><h2>Definiție și explicație</h2>'+
   '<p id="lesson-content">Pentru a aduna trei numere, păstrăm ordinea operațiilor și verificăm rezultatul.</p>'+
   '<p id="math-formula">x = 2 + 3</p><button id="close">Închide</button></article></div>';
  window.state={language:'it'};
  window.mathJourney={grade:'5',topic:'algebra'};
  window.educationCountrySelection={code:'IT'};
  window.translationCalls=[];
  window.eduTranslateMaterial=async (original,key,sourceLanguage)=>{
   window.translationCalls.push({original,key,sourceLanguage});
   const result={};
   for(const [k,v] of Object.entries(original)){
    result[k]='Traduzione italiana: '+v;
   }
   return result;
  };
  const element=document.createElement('script');
  element.textContent=src;document.body.append(element);
 },MATH_READER_LOCALE_UI_SCRIPT);
 await page.waitForFunction(()=>document.querySelector('#lesson-content')?.textContent.includes('Traduzione italiana'),{timeout:7000});
 const initial=await page.evaluate(()=>({
  lesson:document.querySelector('#lesson-content').textContent,
  formula:document.querySelector('#math-formula').textContent,
  controls:document.querySelector('#close').textContent,
  calls:window.translationCalls,
  country:window.educationCountrySelection.code
 }));
 assert.ok(initial.lesson.includes('Traduzione italiana:'));
 assert.equal(initial.formula,'x = 2 + 3','Do not run mathematical formulas through generative translation');
 assert.equal(initial.controls,'Închide','Math translation may not change button labels / global UI');
 assert.equal(initial.country,'IT','Display language and school country must be independent');
 assert.ok(initial.calls.length>0);
 assert.ok(initial.calls.every(x=>x.sourceLanguage==='mixed'));

 await page.evaluate(()=>{
  window.state.language='ro';
  const p=document.createElement('p');p.id='romanian';p.textContent='Această lecție are un exemplu rezolvat concret.';
  document.querySelector('article').append(p);
 });
 await page.waitForTimeout(100);
 assert.equal(await page.locator('#romanian').textContent(),
  'Această lecție are un exemplu rezolvat concret.','Romanian UI needs no spurious translation');

 await page.evaluate(()=>{
  window.state.language='en';
  const p=document.createElement('p');p.id='english';p.textContent='Exemplul matematic trebuie păstrat și explicat.';
  document.querySelector('article').append(p);
 });
 await page.waitForFunction(()=>document.querySelector('#english')?.textContent.includes('Traduzione italiana'),{timeout:7000});
 assert.equal(errors.length,0,'Browser console must have no errors: '+errors.join(' | '));
 console.log('PASS: native Italian/English maths reader translation on Android-sized viewport; formula, controls and country unchanged');
}finally{await browser.close()}
