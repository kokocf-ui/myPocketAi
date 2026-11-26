// Production bundle + mobile touch and actual geometry. No astrology predictive claims.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://fun.test/'))).text();
html=html.replace('function extraFunGames(){',`window.__fun={init(){state.language='ro';showView('module');pocketRevealMainApp();extraToolsV2OpenGroup('fun')},open:extraFunOpen,back(){window.pocketAndroidBack()}};function extraFunGames(){`);
const server=createServer((req,res)=>{res.setHeader('content-type','text/html; charset=utf-8');res.end(html)});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
await mkdir('.bundle-check/entertainment',{recursive:true});
try{
 for(const viewport of [{width:393,height:817},{width:360,height:640}]){
  const page=await browser.newPage({viewport,isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE',e.message)});
  await page.route('**/*',route=>{const url=route.request().url();if(url.includes('photon.komoot.io'))return route.fulfill({contentType:'application/json',body:JSON.stringify({features:[{geometry:{coordinates:[21.93,47.04]},properties:{name:'Oradea',country:'România'}}]})});if(!url.startsWith('http://127.0.0.1:'))return route.abort();return route.continue()});
  const tap=async locator=>{await locator.scrollIntoViewIfNeeded();assert.ok(await locator.evaluate(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===el||el.contains(hit)}),'Unobstructed touch target');await locator.tap()};
  const back=()=>page.evaluate(()=>window.__fun.back());
  const bounded=async()=>{const v=await page.evaluate(()=>{const el=document.querySelector('.extra-fun-workspace'),r=el.getBoundingClientRect();return{bottom:r.bottom,width:el.scrollWidth,client:el.clientWidth,height:window.innerHeight,page:document.scrollingElement.scrollHeight}});assert.ok(v.bottom<=v.height+1&&v.width<=v.client+1,JSON.stringify(v))};
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');await page.evaluate(()=>window.__fun.init());
  assert.equal(await page.locator('.extra-tools-v2-card').count(),4);
  await page.evaluate(()=>window.__fun.open('fun-jokes'));await bounded();
  const quote=page.locator('.extra-fun-joke-main blockquote'),first=await quote.innerText();await tap(page.getByRole('button',{name:'Alt banc',exact:true}));assert.notEqual(await quote.innerText(),first);
  await tap(page.getByRole('button',{name:'Colecția de bancuri',exact:true}));
  const pop=page.locator('.extra-fun-modal:not(.extra-fun-game-overlay)'),selected=pop.locator('blockquote'),archive=pop.locator('.extra-fun-jokes-archive');
  const before=await selected.boundingBox();await archive.evaluate(el=>el.scrollTop=el.scrollHeight);assert.deepEqual(await selected.boundingBox(),before,'Joke stays pinned while list scrolls');
  await tap(archive.getByRole('button').last());assert.equal(await quote.innerText(),await selected.innerText());
  await tap(pop.getByRole('button',{name:'Mai multe bancuri',exact:true}));assert.equal(await archive.getByRole('button').count(),22);assert.equal(await pop.getByRole('button',{name:'Mai multe bancuri',exact:true}).count(),0);
  await page.screenshot({path:'.bundle-check/entertainment/jokes-'+viewport.width+'.png'});await back();assert.equal(await pop.count(),0);
  await page.evaluate(()=>window.__fun.open('fun-maxim'));await bounded();
  await tap(page.locator('.extra-fun-quote-button'));await pop.getByRole('heading',{name:'Ce înseamnă?'}).waitFor();await back();
  await page.locator('.extra-fun-library').evaluate(el=>el.scrollTop=el.scrollHeight);await tap(page.locator('.extra-fun-library button').last());await pop.getByText('Întrebare pentru tine',{exact:true}).waitFor();await back();
  await page.evaluate(()=>window.__fun.open('fun-puzzles'));await bounded();assert.equal(await page.getByRole('button',{name:'Rebus',exact:true}).count(),0);
  await tap(page.getByRole('button',{name:'Sudoku',exact:true}));
  const cells=page.locator('.extra-fun-sudoku input'),empty=page.locator('.extra-fun-sudoku input[data-given=false]').first();
  await tap(empty);await tap(page.locator('.extra-fun-keypad').getByRole('button',{name:'5',exact:true}));assert.equal(await empty.inputValue(),'5');assert.equal(await empty.getAttribute('inputmode'),'none');
  await tap(page.locator('.extra-fun-keypad').getByRole('button',{name:'↶',exact:true}));assert.equal(await empty.inputValue(),'');
  await page.locator('.extra-fun-game-content select').selectOption('hard');assert.equal(await cells.count(),81);
  await tap(page.getByRole('button',{name:'Verifică',exact:true}));await page.getByText(/Corect până acum/).waitFor();await bounded();
  await page.screenshot({path:'.bundle-check/entertainment/sudoku-'+viewport.width+'.png'});
  await back();await tap(page.getByRole('button',{name:'Integrame',exact:true}));
  const clues=page.locator('.extra-fun-in-grid-clue');assert.equal(await clues.count(),20);
  for(const dir of ['→','↓']){
   const clue=clues.filter({hasText:dir}).first();await tap(clue);await pop.locator('.extra-fun-word-answer').waitFor();
   const field=pop.getByLabel('Răspuns întreg'),length=Number(await field.getAttribute('maxlength'));
   assert.match(await pop.locator('h2').innerText(),dir==='→'?/Orizontal/:/Vertical/);
   await page.setViewportSize({width:viewport.width,height:430});await field.fill('a');await tap(pop.getByRole('button',{name:'Aplică în careu',exact:true}));await pop.getByText('Scrie exact '+length+' litere.',{exact:true}).waitFor();
   await field.fill('ă'.repeat(length));await page.screenshot({path:'.bundle-check/entertainment/word-'+viewport.width+(dir==='→'?'-across':'-down')+'.png'});await tap(pop.getByRole('button',{name:'Aplică în careu',exact:true}));assert.equal(await pop.count(),0);
   assert.equal(await page.locator('.extra-fun-selected-word input').count(),length);assert.deepEqual(await page.locator('.extra-fun-selected-word input').evaluateAll(xs=>xs.map(x=>x.value)),Array(length).fill('A'));
   await page.setViewportSize(viewport);
  }
  await back();await page.evaluate(()=>window.__fun.open('fun-astro'));await bounded();
  await tap(page.getByRole('button',{name:'Citește horoscopul',exact:true}));assert.equal(await pop.locator('.extra-fun-reading-block').count(),8);await back();
  await page.getByLabel('Perioada',{exact:true}).selectOption('week');await tap(page.getByRole('button',{name:'Horoscop umoristic',exact:true}));assert.equal(await pop.locator('.extra-fun-forecast-day').count(),7);await back();
  await page.getByLabel('Perioada',{exact:true}).selectOption('month');await tap(page.getByRole('button',{name:'Citește horoscopul',exact:true}));assert.ok(await pop.locator('.extra-fun-forecast-day').count()>=28);await back();
  await tap(page.getByRole('button',{name:'Compatibilitate în dragoste',exact:true}));await pop.getByText(/compatibilitatea reală/).waitFor();await back();
  await tap(page.locator('.extra-fun-advanced summary'));await page.getByLabel('Data nașterii',{exact:true}).fill('1990-08-20');await page.getByLabel('UTC la naștere, inclusiv ora de vară',{exact:true}).fill('2');await page.getByLabel('Orașul și țara nașterii',{exact:true}).fill('Oradea, România');await tap(page.getByRole('button',{name:'Calculează astrograma simplificată',exact:true}));
  await pop.getByRole('heading',{name:'Cum se leagă cele două',exact:true}).waitFor();assert.match(await pop.innerText(),/nu un test de personalitate/);assert.equal(await pop.locator('svg').count(),1);
  await page.screenshot({path:'.bundle-check/entertainment/astro-'+viewport.width+'.png'});await back();assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS entertainment production mobile: all 4 options, pinned coherent jokes/finite archive, linked maxim explanations, Sudoku keypad/undo/levels, no Rebus, across/down whole-word input + diacritics + keyboard, horoscope day/week/month + compatibility + interpreted partial birth chart. Geocoder mocked.');
}finally{await browser.close();server.close();server.closeAllConnections?.()}
