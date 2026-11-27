import assert from 'node:assert/strict';
import {FUN_QUOTE_COLLECTION as quotes,FUN_JOKE_COLLECTION as jokes} from './fun_editorial_content.mjs';
import {FUN_ASTRO_CORE_SCRIPT} from './extra_fun_core.mjs';
import {FUN_GENERATOR_SCRIPT} from './extra_fun_generator.mjs';
import {EXTRA_FUN_UI_SCRIPT} from './extra_fun_ui.mjs';
assert.equal(quotes.length,36);assert.equal(quotes.filter(q=>q.author).length,25);assert.equal(new Set(quotes.filter(q=>q.author).map(q=>q.author)).size,6);
assert.equal(new Set(quotes.map(q=>q.id)).size,quotes.length);assert.equal(new Set(quotes.map(q=>q.text)).size,quotes.length);
for(const q of quotes){assert.ok(q.text.length>=15&&q.meaning.length>=30);assert.ok(q.source.work&&q.source.locator&&q.source.original);assert.ok(['public-domain-original','traditional-proverb'].includes(q.rights));if(q.author){assert.match(q.source.url,/^https:\/\//);assert.notEqual(q.author,'Anonim')}else{assert.equal(q.type,'Proverb');assert.equal(q.source.url,null)}if(q.source.language!=='ro')assert.equal(q.translation,'own-ro-from-public-domain')}
assert.equal(quotes.find(q=>q.text.startsWith('Unde-s doi')).author,'Vasile Alecsandri','A literary line in popular use must keep its known author');
assert.equal(jokes.length,30);assert.equal(new Set(jokes).size,jokes.length);for(const joke of jokes){assert.ok(joke.includes('\n— '));assert.ok(joke.length>=60&&joke.length<450)}
const api=new Function(FUN_ASTRO_CORE_SCRIPT+FUN_GENERATOR_SCRIPT+';return {funDailyMaximEntry,funDailyMaxim,funDailyJoke,funQuoteEntry};')();
for(let i=0;i<72;i++){const key=new Date(Date.UTC(2026,0,i+1)).toISOString().slice(0,10),entry=api.funDailyMaximEntry(key);assert.deepEqual(api.funQuoteEntry(api.funDailyMaxim(key)),entry);assert.ok(quotes.some(q=>q.id===entry.id));assert.ok(jokes.includes(api.funDailyJoke(key)))}
assert.doesNotMatch(EXTRA_FUN_UI_SCRIPT,/autorul este|de \(autor\)/i);assert.match(EXTRA_FUN_UI_SCRIPT,/if\(!entry\?\.author\)return/);assert.match(EXTRA_FUN_UI_SCRIPT,/entry\.author\);author\.translate=false/);
console.log('PASS 36 traceable readings: 25 attributed/6 authors + 11 anonymous proverbs, own Romanian translations identified, 30 complete editorial jokes, deterministic offline rotation and no fake author labels.');
