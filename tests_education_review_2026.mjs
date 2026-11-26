import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import service from './education_pack_service.mjs';
import {EXAM_SPECS,examByGrade} from './exam_curriculum_europe.mjs';
import {EDUCATION_LESSON_WORKSPACE_SCRIPT} from './education_lesson_workspace.mjs';
import {EXAM_LESSON_PRACTICE_SCRIPT} from './exam_lesson_practice.mjs';
import {SCIENCE_REVIEW_SUPPLEMENTS_SCRIPT} from './science_review_supplements.mjs';
const file='public/education/science/review/RO.json';
const raw=await readFile(file,'utf8'),data=JSON.parse(raw);
assert.equal(data.schema,'mypocket-science-review/v1');
assert.equal(data.version,createHash('sha256').update(JSON.stringify(data.lessons)).digest('hex'));
assert.match(data.status,/independent-review-pending/);
assert.match(data.notice,/Nu reprezintă ani universitari compleți/);
assert.equal(data.lessons.length,28);assert.equal(new Set(data.lessons.map(r=>r.id)).size,28);
assert.equal(new Set(data.lessons.map(r=>r.sample)).size,28);
for(const subject of ['physics','chemistry','biology','astronomy']){
 for(const y of [1,2,3])assert.equal(data.lessons.filter(r=>r.subject===subject&&r.stage==='advanced'&&r.grade==='univ-'+y).length,2);
}
for(const y of [9,10,11,12])assert.equal(data.lessons.filter(r=>r.subject==='astronomy'&&r.stage==='upper'&&r.grade===String(y)).length,1);
for(const row of data.lessons){
 for(const field of ['theory','sample','worked'])assert.ok(row[field].length>(field==='sample'?40:70),row.title+' '+field);
 assert.equal(row.test.length,row.answers.length);assert.ok(row.answers.every(s=>s.length>6));
 assert.ok(row.steps.length>=4&&row.steps.at(-1).startsWith('Greșeala frecventă:'));
 assert.ok(!row.steps.some(s=>/^\d+\. /.test(s)),'No double numbered steps');
}
// Independent calculations for representative numerical examples in all fields.
const answer=title=>data.lessons.find(r=>r.title===title).answers[0];
assert.ok(answer('Propagarea incertitudinii la o viteză medie').includes((5*Math.sqrt(.01**2+.01**2)).toFixed(2).replace('.',',')));
assert.ok(answer('Ecuația diferențială a oscilatorului armonic').includes((2*Math.PI/Math.sqrt(8/.5)).toFixed(2).replace('.',',')));
assert.match(answer('Difracția Bragg și ordinea reflexiei'),/0,154 nm/);assert.equal(.154/(2*Math.sin(Math.PI/6)),.15400000000000003);
assert.ok(answer('Timp de înjumătățire și activitate').includes(String(800/2**(18/6))));
assert.match(answer('Prepararea unei soluții prin diluare'),/50 mL/);assert.equal(.1*250/.5,50);
assert.ok(answer('Soluție tampon și Henderson–Hasselbalch').includes((4.76+Math.log10(2)).toFixed(2).replace('.',',')));
assert.ok(answer('Cinetică de ordinul întâi').includes((Math.log(4)/.2).toFixed(2).replace('.',',')));
assert.ok(answer('Potențial electrochimic și ecuația Nernst').includes((1.10-.05916/2*Math.log10(100)).toFixed(2).replace('.',',')));
assert.match(answer('Hardy–Weinberg și frecvențe alelice'),/42%/);assert.equal(Math.round(100*2*.7*.3),42);
assert.match(answer('Cinetică enzimatică Michaelis–Menten'),/90 µmol\/min/);assert.equal(120*6/(2+6),90);
assert.match(answer('Sensibilitate, specificitate și valoare predictivă'),/50%/);assert.equal(90/(90+90),.5);
assert.match(answer('Paralaxă și incertitudine relativă'),/20,0 pc/);assert.equal(1/.05,20);
assert.ok(answer('Rezoluția unghiulară a unui telescop').includes((1.22*500e-9/.1*206265).toFixed(2).replace('.',',')));
assert.match(answer('Modul de distanță și extincție'),/100 pc/);assert.equal(10*10**((10-4-1)/5),100);
assert.match(answer('Masa dintr-o orbită kepleriană'),/4 M☉/);assert.equal(4**3/4**2,4);
assert.match(answer('Tranzit exoplanetar și degenerescențe'),/0,10 R★/);assert.equal(Math.sqrt(.01),.1);
assert.match(answer('Legea Hubble la deplasare mică spre roșu'),/40 Mpc/);assert.equal(300000*.01/75,40);
const bac=EXAM_SPECS.find(x=>x.country==='RO'&&x.id==='bac');assert.deepEqual(bac.grades,['12']);
assert.equal(examByGrade('RO','13 seral').filter(e=>e.id==='bac').length,1,'Compatibility without duplicate menu');
const university=EXAM_SPECS.find(x=>x.country==='RO'&&x.id==='university-course');
assert.ok(university.advisory&&!university.universityAdmission);assert.equal(university.grades.length,3);assert.ok(university.subjects.includes('astronomy'));
for(const script of [EDUCATION_LESSON_WORKSPACE_SCRIPT,EXAM_LESSON_PRACTICE_SCRIPT,SCIENCE_REVIEW_SUPPLEMENTS_SCRIPT])new Function(script);
assert.match(EDUCATION_LESSON_WORKSPACE_SCRIPT,/educationExerciseInstruction\(mode\)/);
assert.doesNotMatch(EDUCATION_LESSON_WORKSPACE_SCRIPT,/theory:row.theory|workedExample:row.worked/,'no unrelated whole-lesson theory or solved example in the request');
assert.match(EDUCATION_LESSON_WORKSPACE_SCRIPT,/reference:task.guide/);
assert.match(EDUCATION_LESSON_WORKSPACE_SCRIPT,/request!==serial\|\|!box.isConnected/);
assert.match(EXAM_LESSON_PRACTICE_SCRIPT,/mathFilters\[j.exam\]/);
for(const url of ['/education/science/review/RO.json','/education/physics/authored/catalog.json','/education/math/authored/RO/ro-uni-ba-1.json']){
 const response=await service.fetch(new Request('https://e.test'+url),{ASSETS:{fetch:async()=>new Response('{}')}});assert.equal(response.status,200,url);
}
for(const url of ['/education/science/review/../unlisted.json','/education/science/review/DE.json','/education/not-a-subject/authored/catalog.json']){
 assert.equal((await service.fetch(new Request('https://e.test'+url),{ASSETS:{fetch:async()=>new Response('{}')}})).status,404,url);
}
console.log('PASS 28 original science/astronomy supplements, numerical checks, unified Bac, separate university course practice, scoped correction and content-service routes');
