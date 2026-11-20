import assert from 'node:assert/strict';
import backend from './backend.js';
import {literatureGrounding,literatureUnsupportedAttribution} from './literature_curated_concepts.mjs';
import {literatureOutputInstruction} from './literature_output_quality.mjs';

const prompt='România, clasa a X-a: Figurile de stil în poezia lirică: epitet, comparație, metaforă, personificare și antiteză. Creează o lecție, cu exemple originale.';
const grounding=literatureGrounding(prompt,'lesson','ro');
assert.ok(grounding.includes('EPITET')&&grounding.includes('COMPARAȚIE'));
assert.ok(grounding.includes('METAFORĂ')&&grounding.includes('PERSONIFICARE'));
assert.ok(grounding.includes('ANTITEZĂ')&&grounding.includes('OXIMORON'));
assert.match(grounding,/Exemplu ORIGINAL/);
assert.equal(literatureGrounding(prompt,'essay','ro'),'');
assert.equal(literatureGrounding('ecuații','lesson','ro'),'');
assert.equal(literatureGrounding(prompt,'lesson','en'),'');
assert.equal(literatureUnsupportedAttribution('Un exemplu se găsește în poezia „Luceafărul” de Mihai Eminescu.',prompt,'lesson'),true,
 'A generic lesson must not cite an unsupplied real work as evidence');
assert.equal(literatureUnsupportedAttribution('Exemplu original: „Afară era zarvă; în cameră, liniște.”',prompt,'lesson'),false);
assert.equal(literatureUnsupportedAttribution('Poezia „Luceafărul” are un conflict cosmic.','Analizează poezia Luceafărul.', 'study'),false,
 'Work named in the task can be discussed without pretending to quote it');
assert.equal(literatureUnsupportedAttribution('Poezia „Luceafărul” poate fi analizată.',prompt,'write'),false);

const essayDirections=literatureOutputInstruction('write','Redactează un eseu argumentativ de 500 de cuvinte');
assert.match(essayDirections,/FINISHED ESSAY/);
assert.match(essayDirections,/grammatical agreement/);
assert.match(essayDirections,/DISTINCT arguments/);
assert.doesNotMatch(essayDirections,/TEACHING CHAPTER/);
const lessonDirections=literatureOutputInstruction('lesson',prompt);
assert.match(lessonDirections,/TEACHING CHAPTER/);
assert.match(lessonDirections,/OXIMORON|attributed|literary/iu);

let requests=0,gotGrounding=false;
const lessonResponse=await backend.fetch(new Request('https://unit.test/api/chat',{
 method:'POST',headers:{'Content-Type':'application/json'},
 body:JSON.stringify({module:'education_study',education_subject:'language_literature',
   education_activity:'lesson',language:'ro',message:prompt})
}),{AI:{run:async(_model,opts)=>{
 requests++;gotGrounding=opts.messages[0].content.includes('CURATED DIDACTIC REFERENCE');
 return {response:'Lecție: Figuri de stil\n\nÎn poezia „Luceafărul” de Mihai Eminescu întâlnim un epitet inventat de model.'};
}}});
const result=await lessonResponse.json();
assert.equal(gotGrounding,true);
assert.equal(lessonResponse.status,502);
assert.equal(result.error,'education_quality_invalid');
assert.equal(requests,2);
console.log('PASS literature: curated semantic anchors and unsourced work-example rejection');
