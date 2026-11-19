import assert from 'node:assert/strict';
import backend from './backend.js';
import {normalizeStorybookRequest,storybookSystemPrompt,storybookUserPrompt,parseStorybookChapters} from './storybook_generation.mjs';

const requestInput={
 title:'Soldații de teracotă',
 story_seed:'Caută informații despre soldații de teracotă și creează o poveste pentru copii.',
 chapter_count:4,story_type:'children',language:'ro',module:'creative_storybook'
};
const spec=normalizeStorybookRequest({...requestInput,message:requestInput.story_seed});
assert.equal(spec?.count,4);
assert.match(storybookSystemPrompt(spec),/NOT A NEWS SEARCH/);
assert.match(storybookUserPrompt(spec),/Soldații de teracotă/);
assert.match(storybookSystemPrompt(spec),/105-155 words/);
assert.match(storybookSystemPrompt(spec),/specific scene/);
const chapterText='Mara a pășit în muzeu alături de bunicul ei. În fața lor erau sute de statui, fiecare cu propria înfățișare. Bunicul i-a povestit că figurile de lut au fost modelate cu grijă cu mult timp în urmă. Mara s-a întrebat cine le-a făcut și de ce au rămas ascunse în pământ. Împreună au pornit să descopere răspunsurile, privind atent armurile și chipurile. Nu știau toate amănuntele, dar curiozitatea i-a îndemnat să învețe mai mult.';
const generated=Array.from({length:4},(_,i)=>'CAPITOL '+(i+1)+': Descoperirea '+(i+1)+'\n'+chapterText).join('\n\n');
assert.equal(parseStorybookChapters(generated,4)?.length,4);
assert.equal(parseStorybookChapters(generated,4)?.[0].title,'Descoperirea 1');
const malformedHeader='CAPITOL 1: Într-o zi, Ling a găsit un obiect vechi. Era pictată c\n'+chapterText+'\n\n'+generated.slice(generated.indexOf('CAPITOL 2:'));
const recovered=parseStorybookChapters(malformedHeader,4);
assert.ok(recovered);
assert.equal(recovered[0].title,'Capitolul 1');
assert.ok(recovered[0].text.startsWith('Într-o zi, Ling a găsit un obiect vechi.'));
assert.ok(recovered[0].text.includes('Era pictată\n'));
assert.ok(parseStorybookChapters(generated,4)?.[0].text.startsWith('Mara a pășit'));
assert.ok(!parseStorybookChapters(generated,4)?.[0].text.startsWith('Descoperirea 1'));

assert.equal(parseStorybookChapters(generated,3),null);
assert.equal(parseStorybookChapters('Știri identificate în sursele consultate',4),null);
assert.equal(parseStorybookChapters(generated.replace('CAPITOL 3:','CAPITOL 2:'),4),null);

const ask=async (answer)=>backend.fetch(new Request('https://test.local/api/chat',{
 method:'POST',headers:{'Content-Type':'application/json'},
 body:JSON.stringify({...requestInput,message:requestInput.story_seed})
}),{AI:{run:async()=>({response:answer})}});
let r=await ask(generated),body=await r.json();
assert.equal(r.status,200);
assert.equal(body.status,'success');
assert.equal(body.module,'creative_storybook');
assert.equal(body.chapter_count,4);
assert.equal(body.chapters.length,4);
assert.equal(body.source_research_performed,false);

r=await ask('Știri identificate în sursele consultate. Apasă pe titlul unei știri pentru detalii.');
body=await r.json();
assert.equal(r.status,502);
assert.equal(body.error,'storybook_invalid_chapters');

const malformed=await backend.fetch(new Request('https://test.local/api/chat',{
 method:'POST',headers:{'Content-Type':'application/json'},
 body:JSON.stringify({...requestInput,message:requestInput.story_seed,chapter_count:0})
}),{AI:{run:async()=>{throw new Error('should not call model')}}});
assert.equal(malformed.status,400);
console.log('PASS: terracotta children story, isolated backend route, four chapters, no news fallback');
