import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import app from './index.js';
import {classifyEvaTurn,isEvaExitRequest,evaConversationHistory,evaDialogueSystem,cleanEvaReply} from './eva_dialogue.mjs';

const conversation=[
 ['Bună, frumoaso! Cum te cheamă și ce fel de asistentă ești?','identity'],
 ['Eva, cred că ești cam obraznică. Mă contrazici dacă spun o prostie?','banter'],
 ['Și dacă mă supăr pe tine, cum mă împaci?','feedback'],
 ['Nu prea m-ai convins. Parcă vorbești dintr-o carte. Încearcă să fii mai naturală!','feedback'],
 ['Eva, despre ce te-am tachinat mai devreme?','feedback'],
 ['Mulțumesc, Eva!','courtesy'],
 ['Mulțumesc încă o dată! 😂','courtesy'],
 ['Salut Eva!','greeting'],
 ['Eva!','greeting'],
 ['Eva, ai un minut?','banter'],
 ['Eva, ce faci dacă te invit la o cafea?','banter'],
 ['Eva, iar faci pe deșteapta? 😂','banter'],
 ['Eva, știi la ce mă gândesc?','banter'],
 ['Eva, ești proastă!','boundary'],
 ['Eva, vreau să închid aplicația.','device_control'],
 ['Închide aplicația','device_control']
];
for(const [value,act] of conversation){
 const kind=classifyEvaTurn(value,{module:'assistant'});
 assert.ok(kind,value+' should be conversational');
 assert.equal(kind.speech_act,act,value);
}
const tasks=[
 'Eva, vreau să merg la Victoria Underground cu mașina.',
 'Salut, Eva! Cum ajung la Victoria?',
 'Eva, caută restaurante lângă mine.',
 'Eva, arată-mi hotelurile din Londra.',
 'Eva, dă-mi 3 rețete de guacamole.',
 'Eva, ce este RAM?',
 'Eva, ce știi despre Marin Preda?',
 'Aldi','Victoria Underground','EVA Air','Unde este gara?',
 'Eva, găsește-mi o farmacie.',
 'Eva, poți să-mi arăți restaurante în jurul meu?',
 'Salut, unde este Aldi?',
 'Ești pregătită să pleci?'
];
for(const value of tasks)assert.equal(classifyEvaTurn(value,{module:'assistant'}),null,
 'Actual tasks and bare place names must retain their original routing: '+value);
assert.equal(classifyEvaTurn('Eva, ești obraznică!',{module:'travel'}),null,
 'Do not intercept dedicated travel modules');
assert.equal(isEvaExitRequest('Eva, vreau să închid aplicația.'),true);
assert.equal(isEvaExitRequest('Eva, vreau să închid ușa.'),false);
assert.match(evaDialogueSystem('ro','boundary'),/ironie isteață/);
assert.match(evaDialogueSystem('ro','feedback'),/în loc să explici teoria/);

const history=[
 {role:'user',content:'Eva, cred că ești cam obraznică.'},
 {role:'assistant',content:'Măcar nu te las să te plictisești.'},
 {role:'user',content:'Și dacă mă supăr pe tine, cum mă împaci?'},
 {role:'assistant',content:'Cu o glumă bună și un răspuns mai atent.'},
 {role:'user',content:'Eva, despre ce te-am tachinat mai devreme?'}
];
const relevant=evaConversationHistory(history,history.at(-1).content,'feedback');
assert.ok(relevant.some(x=>x.content.includes('obraznică')),'Retain meaningful past user speech');
assert.equal(relevant.some(x=>x.content===history.at(-1).content),false,'Do not echo current message in history');
assert.equal(evaConversationHistory(history,'Mulțumesc, Eva!','greeting').length,0);
const verbose='M-am încurcat puțin. Am încercat să răspund prea lung. M-am încurcat puțin. Am încercat să răspund prea lung.';
const cleaned=cleanEvaReply(verbose);
assert.equal((cleaned.match(/M-am încurcat puțin/g)||[]).length,1);
assert.equal((cleaned.match(/Am încercat să răspund prea lung/g)||[]).length,1);
assert.ok(cleanEvaReply('O explicație foarte lungă. '.repeat(60)).length<=480);

const backend=readFileSync('backend.js','utf8');
const gate=backend.indexOf('const evaTurn=classifyEvaTurn(message');
const recipe=backend.indexOf('const culinaryRequest=parseCulinaryRequest(message)');
const namePlace=backend.indexOf('const localNameQuery=');
assert.ok(gate>0&&gate<recipe&&gate<namePlace,'Eva gate precedes recipe/location heuristics');
assert.match(backend,/requires_exit_confirmation:true/);
assert.match(backend,/web_search_status:'not_needed',location_received:false/);
assert.match(backend,/max_tokens:190,temperature:0\.62/);
assert.match(backend,/Sunt Eva, asistenta virtuală din myPocket AI/);

const html=await(await app.fetch(new Request('https://eva-dialogue.test/'))).text();
assert.match(html,/id="pocketUnifiedTitle">myPocket AI<\/strong>/,'The application retains its myPocket AI brand');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Frontend must render the inline script');
new vm.Script(script,{filename:'eva-frontend-boot.js'});
const first=script.indexOf('function evaClientNormalize(value){');
const last=script.indexOf('function isCasualConversationReply(value){',first);
assert.ok(first>=0&&last>first);
const ctx=vm.createContext({});
vm.runInContext(script.slice(first,last),ctx);
for(const text of [
 'Bună, frumoaso! Cum te cheamă și ce fel de asistentă ești?',
 'Eva, cred că ești cam obraznică.',
 'Și dacă mă supăr pe tine, cum mă împaci?',
 'Nu prea m-ai convins. Parcă vorbești dintr-o carte.',
 'Mulțumesc încă o dată!',
 'Eva, vreau să închid aplicația.',
 'Eva, ai un minut?',
 'Eva!',
 'Eva, ce faci dacă te invit la o cafea?',
 'Eva, iar faci pe deșteapta? 😂',
 'Eva, știi la ce mă gândesc?'
])assert.equal(vm.runInContext('isEvaConversationClient('+JSON.stringify(text)+')',ctx),true,text);
for(const text of ['Aldi','Eva, vreau să merg la Victoria Underground',
 'Salut Eva, cum ajung la Victoria?','Eva, caută restaurante în Grays',
 'Eva, poți să-mi arăți restaurante în jurul meu?', 'Salut, unde este Aldi?'])
 assert.equal(vm.runInContext('isEvaConversationClient('+JSON.stringify(text)+')',ctx),false,text);
assert.equal(vm.runInContext('isEvaExitCommandClient("Eva, vreau să închid aplicația.")',ctx),true);
assert.match(script,/if\(state\.currentView==='assistant'&&isEvaExitCommandClient\(message\)\)/,
 'Assistant can invoke the real avatar exit confirmation');
assert.match(script,/if\(!\['home','assistant'\]\.includes\(state\.currentView\)\|\|pocketExitOpen\)return;/,
 'Exit panel must open from the Assistant screen too');
console.log('PASS Eva E1 dialogue routing, no GPS for banter, anti-repeat, and native exit from chat');
