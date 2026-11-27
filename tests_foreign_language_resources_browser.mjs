// Production bundle + real mobile Chromium. TTS and translation deterministic;
// microphone uses Chromium's fake audio device. No physical Android/live AI claim.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
import {FOREIGN_LANGUAGES} from './foreign_languages_curriculum.mjs';
import {foreignResourceKey} from './foreign_language_resource_loader.mjs';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://languages.test/'))).text();
assert.ok(Buffer.byteLength(html)<8000000,'HTML budget');
assert.ok(!html.includes('Ich hätte gern Wasser'),'editorial pack not embedded');
const hook=String.raw`
window.__foreign={
 init(){state.language='ro';state.currentModule='learning';showView('module');pocketRevealMainApp();$('view-module').classList.add('learning-active');languageJourney.language='en';languageJourney.variant='GB';languageJourney.level='A1';languageOpen('topics')},
 open(language,variant,tab='dictionary'){languageJourney.language=language;languageJourney.variant=variant;languageResourcesOpen(tab)},
 setLanguage(language){state.language=language},
 topic(){languageJourney.language='en';languageJourney.variant='GB';languageJourney.level='A1';languageJourney.topic='grammar';languageOpen('lesson')},
 mockTranslation(fail=false){window.__translated=[];eduTranslateMaterial=async(original,id,source,opts)=>{window.__translated.push({original,id,source,opts});return fail?null:Object.fromEntries(Object.entries(original).map(([k,v])=>[k,'TRANSLATED '+v]))}}
};
`;
html=html.replace('function languageOpen(stage){',hook+'\nfunction languageOpen(stage){');
const requests=[];let failPacks=false,delayKey=null,release=null,received=null;
const server=createServer(async(req,res)=>{
 if(/^\/education\/languages\/resources-v1\/[a-z]{2}(?:-[A-Za-z]+)?\.json$/.test(req.url)){
  requests.push(req.url);if(failPacks){res.writeHead(503);res.end();return}
  if(delayKey&&req.url.includes('/'+delayKey+'.json')){received?.();await new Promise(ok=>release=ok)}
  try{res.setHeader('Content-Type','application/json');res.end(await readFile('public'+req.url))}catch{res.writeHead(404);res.end()}return;
 }
 if(req.url==='/'||req.url.startsWith('/?')){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return}
 res.writeHead(404);res.end();
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,permissions:['microphone']});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{
 window.__spoken=[];window.__cancelled=0;window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
 Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'en-US',name:'US'},{lang:'en-GB',name:'GB'},{lang:'zh-TW',name:'TW'}],cancel(){window.__cancelled++},speak(v){window.__spoken.push({text:v.text,lang:v.lang,rate:v.rate,voice:v.voice?.name})}}});
});
await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
const dialog=()=>page.locator('.foreign-resource-dialog');
const tab=async name=>dialog().locator('.foreign-resource-tabs').getByRole('button',{name}).click();
const close=async()=>{await dialog().getByRole('button',{name:'Închide',exact:true}).click();await dialog().waitFor({state:'detached'})};
const open=async(l,v,t='dictionary')=>{await page.evaluate(([l,v,t])=>window.__foreign.open(l,v,t),[l,v,t]);await dialog().locator('.foreign-resource-entry').first().waitFor({state:'attached'})};
try{
 await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>window.__foreign.init());assert.equal(requests.length,0,'No eager resource fetch');
 await page.locator('#view-module .foreign-resources-open').click();await dialog().locator('.foreign-resource-entry').first().waitFor();
 const search=dialog().getByRole('searchbox');await search.fill('familie');assert.equal(await dialog().locator('.foreign-resource-entry').count(),1);assert.ok((await dialog().innerText()).includes('family'));
 await search.fill('no such entry');assert.equal(await dialog().locator('.foreign-resource-entry').count(),0);assert.match(await dialog().innerText(),/Niciun rezultat/);await search.fill('');
 await tab(/Teme/);const lesson=dialog().locator('.foreign-resource-entry').first();assert.equal(await lesson.locator('tr').count(),6);
 await lesson.getByRole('textbox').fill('are');await lesson.getByRole('button',{name:'Verifică',exact:true}).click();assert.match(await lesson.innerText(),/Mai încearcă/);
 await lesson.getByRole('textbox').fill('is');await lesson.getByRole('button',{name:'Verifică',exact:true}).click();assert.match(await lesson.innerText(),/Corect!/);await lesson.getByText('Arată răspunsul',{exact:true}).click();assert.equal(await lesson.locator('.foreign-grammar-answer p').innerText(),'is');
 // Every authored grammar topic has an explicit next/previous path.
 const english=JSON.parse(await readFile('public/education/languages/resources-v1/en-GB.json','utf8'));
 assert.equal(english.lessons.length,12);assert.equal(english.guide.length,6);
 for(let i=0;i<english.lessons.length;i++){
  assert.equal(await dialog().locator('.foreign-resource-entry>h3').innerText(),english.lessons[i].title);
  if(i+1<english.lessons.length)await dialog().getByRole('button',{name:'Următor →',exact:true}).click();
 }
 assert.equal(await dialog().getByRole('button',{name:'Următor →',exact:true}).isDisabled(),true);
 assert.match(await dialog().innerText(),/Ultima temă din acest pachet local/);
 await tab(/Ghid/);assert.equal(await dialog().locator('.foreign-resource-content>section>h3').count(),1);assert.match(await dialog().innerText(),/Hello/);await dialog().getByRole('button',{name:'Următor →',exact:true}).click();assert.match(await dialog().innerText(),/One ticket/);
 await tab(/Laborator/);assert.equal(await dialog().locator('.foreign-resource-content>details:not(.foreign-resource-info)').first().getAttribute('open'),null);
 await dialog().locator('.foreign-resource-content > div').first().getByRole('button',{name:'🐢 Lent',exact:true}).click();
 let spoken=await page.evaluate(()=>window.__spoken.at(-1));assert.equal(spoken.rate,0.4);assert.equal(spoken.lang,'en-GB');assert.equal(spoken.voice,'GB');
 await dialog().getByRole('textbox',{name:'Scrie ce auzi',exact:true}).fill('house');await dialog().getByRole('button',{name:'Verifică textul',exact:true}).click();assert.match(await dialog().innerText(),/Text corect; nu este scor fonetic/);
 await dialog().getByText('Arată textul și transcrierea',{exact:true}).click();assert.ok(await dialog().locator('.foreign-resource-content>details:not(.foreign-resource-info)').first().getAttribute('open')!==null);
 const audioOptions=await dialog().locator('select option').allTextContents();
 assert.equal(audioOptions.length,english.dictionary.length+english.lessons.reduce((n,l)=>n+l.forms.length,0));
 assert.ok(audioOptions.length>60&&audioOptions.every(x=>!/^\d+$/.test(x)&&x.includes(' · ')),'Descriptive complete audio catalog, not unexplained numbers');
 await dialog().getByRole('button',{name:'Exemplul următor →',exact:true}).click();assert.equal(await dialog().locator('select').inputValue(),'word-1');
 await dialog().getByRole('button',{name:'← Exemplul anterior',exact:true}).click();assert.equal(await dialog().locator('select').inputValue(),'word-0');
 // Test the actual JS bridge branch as well as browser SpeechSynthesis.
 await page.evaluate(()=>{window.__nativeSpeech=[];window.PocketAndroidVoice={postMessage(message){window.__nativeSpeech.push(JSON.parse(message))}}});
 const playback=dialog().locator('.foreign-resource-content > div').first();
 await playback.getByRole('button',{name:'🔊 Ascultă',exact:true}).click();await playback.getByRole('button',{name:'🐢 Lent',exact:true}).click();
 const native=await page.evaluate(()=>window.__nativeSpeech.filter(x=>x.action==='speak'));
 assert.deepEqual(native.map(x=>({text:x.text,language:x.language,rate:x.rate})),[{text:'house',language:'en-GB',rate:0.8},{text:'house',language:'en-GB',rate:0.4}]);
 await page.evaluate(()=>delete window.PocketAndroidVoice);
 const java=await readFile('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
 assert.match(java,/Math\.max\(0\.30,Math\.min\(1\.15,requestedRate\)\)/);
 assert.ok(java.indexOf('tts.stop();',java.indexOf('double requestedRate='))<java.indexOf('tts.setSpeechRate',java.indexOf('double requestedRate=')));
 assert.match(java,/rateStatus==TextToSpeech.ERROR/);
 // Real MediaRecorder with fake browser microphone; no uploads.
 await dialog().getByRole('button',{name:'🎙 Înregistrează local',exact:true}).click();await dialog().getByText('Se înregistrează… maximum 45 secunde.',{exact:true}).waitFor();
 await page.waitForTimeout(1200); // Recording can also be stopped immediately; final data is emitted on stop.
 await dialog().getByRole('button',{name:'■ Oprește înregistrarea',exact:true}).click();await dialog().getByText('Înregistrare locală gata. Ascultă și compară cu modelul.',{exact:true}).waitFor();
 assert.match(await dialog().locator('audio').getAttribute('src'),/^blob:/);
 await dialog().getByRole('button',{name:'Șterge înregistrarea',exact:true}).click();assert.equal(await dialog().locator('audio').getAttribute('src'),null);
 // Permission rejection leaves TTS working and capture retry enabled.
 await page.evaluate(()=>{window.__originalMic=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async()=>{throw Error('denied')}});
 await dialog().getByRole('button',{name:'🎙 Înregistrează local',exact:true}).click();await dialog().getByText(/Microfon indisponibil/).waitFor();assert.equal(await dialog().getByRole('button',{name:'🎙 Înregistrează local',exact:true}).isEnabled(),true);
 // Permission resolves after leaving the audio tab: acquired tracks must stop.
 await page.evaluate(()=>{navigator.mediaDevices.getUserMedia=()=>new Promise(ok=>window.__resolveMic=ok);window.__stopped=false});
 await dialog().getByRole('button',{name:'🎙 Înregistrează local',exact:true}).click();await tab(/Dicționar/);
 await page.evaluate(()=>window.__resolveMic({getTracks:()=>[{stop(){window.__stopped=true}}]}));await page.waitForFunction(()=>window.__stopped);
 await page.evaluate(()=>navigator.mediaDevices.getUserMedia=window.__originalMic);
 // Closing while capture is active releases every real fake-device media track.
 await tab(/Laborator/);
 await page.evaluate(()=>{navigator.mediaDevices.getUserMedia=async(opts)=>{const stream=await window.__originalMic(opts);window.__captureTracks=stream.getTracks();return stream}});
 await dialog().getByRole('button',{name:'🎙 Înregistrează local',exact:true}).click();await dialog().getByText('Se înregistrează… maximum 45 secunde.',{exact:true}).waitFor();
 await dialog().locator('select').selectOption('word-1');assert.equal(await dialog().getByRole('button',{name:'🎙 Înregistrează local',exact:true}).isEnabled(),true);await page.waitForFunction(()=>window.__captureTracks.every(t=>t.readyState==='ended'));
 await dialog().getByRole('button',{name:'🎙 Înregistrează local',exact:true}).click();await dialog().getByText('Se înregistrează… maximum 45 secunde.',{exact:true}).waitFor();await close();await page.waitForFunction(()=>window.__captureTracks.every(t=>t.readyState==='ended'));
 await open('en','GB');
 // Explicit shared-engine translation: only explanation/gloss projection, no target forms.
 await page.evaluate(()=>{window.__foreign.setLanguage('en');window.__foreign.mockTranslation()});
 await dialog().getByRole('button',{name:/Tradu \/ reîncearcă/}).click();await dialog().getByText(/Explanations use the app language/).waitFor();
 const translations=await page.evaluate(()=>window.__translated);assert.ok(translations.length);assert.ok(!JSON.stringify(translations).includes('She ___'));assert.ok(!JSON.stringify(translations).includes('Quisiera'));assert.equal(await dialog().locator('.foreign-resource-entry strong').first().innerText(),'house');assert.match(await dialog().innerText(),/TRANSLATED casă/);
 await page.evaluate(()=>{window.__foreign.setLanguage('de');window.__foreign.mockTranslation(true)});await dialog().getByRole('button',{name:/Tradu \/ reîncearcă/}).click();await dialog().getByText(/Some explanations could not be translated/).waitFor();await page.evaluate(()=>window.__foreign.setLanguage('ro'));assert.equal(await dialog().locator('.foreign-resource-entry strong').first().innerText(),'house');
 await close();
 // All languages and regional/historical variants load their own validated packs.
 for(const l of FOREIGN_LANGUAGES)for(const v of l.variants.length?l.variants:['standard']){
  const key=foreignResourceKey(l.id,v);await open(l.id,v);assert.ok(requests.at(-1).endsWith('/'+key+'.json'));const box=await dialog().boundingBox();assert.ok(box.x>=0&&box.x+box.width<=391,key+' mobile width');
  await tab(/Teme/);assert.ok(await dialog().locator('table').count());await close();
 }
 await open('en','US','audio');await dialog().getByRole('button',{name:'🐢 Lent',exact:true}).first().click();spoken=await page.evaluate(()=>window.__spoken.at(-1));assert.equal(spoken.lang,'en-US');assert.equal(spoken.voice,'US');await close();
 await open('zh','traditional');assert.match(await dialog().innerText(),/書/);assert.match(await dialog().innerText(),/Pinyin/);await close();
 await open('ja','standard');assert.match(await dialog().innerText(),/Rōmaji/);await close();
 await open('el','ancient','guide');assert.match(await dialog().innerText(),/istorică/);assert.doesNotMatch(await dialog().innerText(),/One ticket/);await close();
 // Offline with cache succeeds; cold/invalid cache fails with an explicit retry.
 failPacks=true;await open('en','GB');assert.match(await dialog().innerText(),/cache/);await close();
 await page.evaluate(()=>localStorage.removeItem('pocketai.languages.resources.v1.fr'));await page.evaluate(()=>window.__foreign.open('fr','standard'));await dialog().getByRole('button',{name:'Reîncearcă',exact:true}).waitFor();assert.equal(await dialog().locator('.foreign-resource-entry').count(),0);
 failPacks=false;await dialog().getByRole('button',{name:'Reîncearcă',exact:true}).click();await dialog().locator('.foreign-resource-entry').first().waitFor();await close();
 // A late response from a closed dialog cannot overwrite another language.
 delayKey='pl';const pending=new Promise(ok=>received=ok);await page.evaluate(()=>window.__foreign.open('pl','standard'));await pending;await close();await open('de','standard');release();delayKey=null;await page.waitForFunction(()=>!!localStorage.getItem('pocketai.languages.resources.v1.pl'));assert.equal(await page.locator('.foreign-resource-dialog').count(),1);assert.match(await dialog().innerText(),/das Haus/);await close();
 await page.evaluate(()=>window.__foreign.topic());assert.equal(await page.locator('#view-module .foreign-resources-open').count(),1);await page.locator('#view-module .foreign-resources-open').click();await dialog().locator('table').first().waitFor();await close();
 assert.deepEqual(errors,[]);console.log('PASS production mobile: 19 variants, dictionary/search, grammar/answers, guide, shared translation projection/fallback, TTS rate/voice, real MediaRecorder fake mic, permission/races/cleanup, offline/retry, lazy assets; HTML '+Buffer.byteLength(html)+' bytes');
}finally{await browser.close();server.close();server.closeAllConnections?.()}
