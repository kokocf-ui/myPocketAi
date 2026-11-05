import assert from 'node:assert/strict';
import {localizeNewsRows,looksUnlocalized} from './localization.mjs';
assert.equal(looksUnlocalized('Что случилось этой ночью','ro'),true);
assert.equal(looksUnlocalized('Atacuri asupra infrastructurii','ro'),false);
const src=[
 {title:'Что случилось этой ночью',summary:'Пожар в логистическом центре',source_name:'Interfax',url:'https://interfax.ru/world/2026/11/04/story',published_at:'2026-11-04'},
 {title:'Guerra Ucraina Russia',summary:'Gli attacchi hanno causato danni',source_name:'Tg24',url:'https://tg24.sky.it/mondo/2026/11/04',published_at:'2026-11-04'},
 {title:'Atac masiv asupra Ucrainei',summary:'Rusia a lansat drone',source_name:'Digi24',url:'https://digi24.ro/stiri/2026/11/04',published_at:'2026-11-04'}
];
let n=0;
const ai={run:async()=>{n++;if(n===1)return {response:'not valid json'};return {response:JSON.stringify({title:'Titlu tradus în română',summary:'Descriere tradusă în română'})};}};
const r=await localizeNewsRows(src,'ro',ai,'mock');
assert.equal(r.length,3);
assert.ok(n>=3,'Invalid batch must retry individual titles and excerpts');
assert.equal(r[0].title,'Titlu tradus în română');
assert.equal(r[0].summary,'Descriere tradusă în română');
assert.equal(r[0].detail,'Descriere tradusă în română');
assert.equal(r[0].source_name,'Interfax');
assert.equal(r[0].url,src[0].url);
assert.equal(r[1].translation_status,'translated');
assert.equal(src[0].title,'Что случилось этой ночью','Input immutable');
const english=await localizeNewsRows(src,'en',ai,'mock');
assert.equal(english[0].title,src[0].title);
assert.equal(english[0].translation_status,'original_untranslated');
console.log('Shared localization fallback and protected publisher metadata: PASS');

// Cloudflare model responses may omit JSON; retry once using labeled text.
const nonJsonAi={run:async(_model,options)=>{
 const system=options.messages[0].content;
 if(system.includes("JSON array"))return {response:"The translated text is ready."};
 if(system.includes("JSON object"))return {response:"Translation without JSON braces"};
 return {response:"Title: Iranul și SUA continuă negocierile\nSummary: Cele două țări continuă discuțiile diplomatice."};
}};
const fixed=await localizeNewsRows([{title:"Iran and US continue negotiations",summary:"Both countries continue diplomatic talks.",url:"https://example.org"}],"ro",nonJsonAi,"mock");
assert.equal(fixed[0].title,"Iranul și SUA continuă negocierile");
assert.equal(fixed[0].translation_status,"translated");
assert.equal(fixed[0].summary,"Cele două țări continuă discuțiile diplomatice.");
console.log("Malformed JSON fallback to labeled text: PASS");

 // Regression: all returned headlines must be attempted, not merely the first 12.
 const many=Array.from({length:14},(_,i)=>({title:'English headline number '+i,summary:'English news excerpt number '+i,url:'https://example.org/'+i}));
 let directCalls=0;
 const plainAi={run:async(_model,options)=>{
   const system=String(options.messages?.[0]?.content||'');
   if(system.includes('JSON array')||system.includes('JSON object')||system.includes('two labeled lines'))return {response:'invalid structured translation'};
   directCalls++;
   const user=String(options.messages?.[1]?.content||'');
   return {response:'Traducere românească: '+user};
 }};
 const allLocalized=await localizeNewsRows(many,'ro',plainAi,'mock');
 assert.equal(allLocalized.length,14);
 assert.equal(allLocalized[13].translation_status,'translated');
 assert.ok(allLocalized[13].title.startsWith('Traducere românească'));
 assert.ok(directCalls>=28,'Plain text fallback should translate both title and excerpt of all items');
 console.log('Full news coverage and direct text translation fallback: PASS');
