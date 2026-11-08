import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert.match(source, /\['work-summary','Rezumat și sinteză de operă'/, 'Work summary has distinct topic id');
const topics=source.match(/const LIT_TOPICS=\{([\s\S]*?)\n\};/);
assert.ok(topics,'Literature topic catalogue exists');
for(const name of ['character','comparison','poetry','review','summary','synthesis']){
  assert.match(source,new RegExp("\\['"+name+"','"),'Missing literature output '+name);
}
assert.match(source,/function pocketNotifySpeechState\(\)/,'Speech state updates are published');
assert.match(source,/window\.addEventListener\('pocket-speech-state',updateRead\)/,'Literature button tracks speech state');
assert.match(source,/if\(state\.speaking\)\{stopSpeech\(\);return\}/,'Literature reading can be stopped');
assert.match(source,/learningLabel\('Oprește','Stop'\)/,'Button changes to Stop while speaking');
assert.match(source,/Nu inventa citate, pagini, ediții, atribuiri literare sau bibliografie/,'No fabricated citations');
assert.match(source,/eduAttachPrintAction\(bar\)/,'Save PDF and print available');
console.log('Literature catalogue, reading toggle and PDF integration checks passed');
