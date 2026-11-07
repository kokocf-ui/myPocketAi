import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'frontend script exists');
new vm.Script(script);
const a=script.indexOf('function mathPhotoCandidates(');
const b=script.indexOf('// Educational mathematics: reject obvious OCR fragments',a);
assert.ok(a>0&&b>a);
const parse=vm.runInNewContext(script.slice(a,b)+'\nmathPhotoCandidates');
const noisy=[
'EXERCITII REZOLVATE:',
'EX. 1) Efectuati:',
'a) 9X - 3X + 4 X = 6X + 4X = oX 2',
'b) 2x - 3X + 5X = -X + 5X = 4x',
'EX. 2) Reduceti termenii asemenea:',
'a) 6X + 3y - 5Z - 5X + 7y - 3Z =',
'6X -5X +34 +14 -5Z -3Z =',
'profesorjitaruionel.com'
].join('\n');
const candidates=parse(noisy);
assert.equal(candidates.length,3,'find exercise starts only');
assert.equal(candidates[0].text,'9X - 3X + 4 X','strip worked results');
assert.equal(candidates[2].text,'6X + 3y - 5Z - 5X + 7y - 3Z');
assert.ok(!candidates.some(x=>x.text.includes('profesor')));
assert.ok(script.includes('mathPhotoNeedsReview=true;'));
assert.ok(script.includes('if(mathPhotoNeedsReview){'));
assert.ok(script.includes('mathPhotoNeedsReview=false;mathRememberDraft(candidate);'));
assert.ok(script.includes('Alege UN singur exercițiu'));
assert.ok(!script.includes("if(text){editor.value=text;mathRememberDraft(text)}"),'never auto-copy photo page into solve editor');
console.log('PASS photo OCR requires single exercise review and rejects entire-page auto-solving');
