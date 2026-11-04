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
const ai={run:async()=>{n++;if(n===1)return {response:'not valid json'};return {response:'Titlu tradus în română'};}};
const r=await localizeNewsRows(src,'ro',ai,'mock');
assert.equal(r.length,3);
assert.ok(n>=3,'Invalid batch must retry individual titles');
assert.equal(r[0].title,'Titlu tradus în română');
assert.equal(r[0].source_name,'Interfax');
assert.equal(r[0].url,src[0].url);
assert.equal(r[1].translation_status,'translated');
assert.equal(src[0].title,'Что случилось этой ночью','Input immutable');
const english=await localizeNewsRows(src,'en',ai,'mock');
assert.equal(english[0].title,src[0].title);
assert.equal(english[0].translation_status,'original_untranslated');
console.log('Shared localization fallback and protected publisher metadata: PASS');
