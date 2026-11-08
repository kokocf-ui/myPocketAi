import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {ASTRONOMY_TOPICS,ASTRONOMY_SPECIALIZATIONS,ASTRONOMY_LESSONS} from './astronomy_curriculum.mjs';
import {astronomyVerifiedExercise} from './astronomy_verified.mjs';
import {THEORY_ENTRIES,searchTheory,theorySubjects} from './education_theory.mjs';
const rank={beginner:0,intermediate:1,advanced:2};
assert.equal(ASTRONOMY_TOPICS.filter(x=>!x.specialty).length,9);
assert.equal(ASTRONOMY_SPECIALIZATIONS.length,7);
assert.equal(ASTRONOMY_TOPICS.filter(x=>x.specialty).length,7);
assert.equal(ASTRONOMY_LESSONS.length,82);
assert.deepEqual(theorySubjects().map(x=>x.count),[211,102,268,168,82]);
assert.equal(new Set(ASTRONOMY_LESSONS.map(x=>x.id)).size,82);
assert.ok(ASTRONOMY_LESSONS.every(x=>x.subject==='astronomy'&&x.title&&x.formula&&x.statement&&x.topic&&rank[x.level]>=rank[ASTRONOMY_TOPICS.find(t=>t.id===x.topic).minLevel]));
for(const track of ASTRONOMY_SPECIALIZATIONS){
 assert.ok(ASTRONOMY_TOPICS.some(x=>x.specialty===track.id));
 assert.equal(ASTRONOMY_LESSONS.filter(x=>x.topic==='special-'+track.id).length,4);
 assert.ok(track.core.every(id=>ASTRONOMY_TOPICS.some(x=>x.id===id)));
}
assert.ok(searchTheory('Paralaxă',{subject:'astronomy',level:'intermediate'}).length>0);
assert.equal(searchTheory('Paralaxă',{subject:'astronomy',level:'beginner'}).length,0);
const verify=(q,v)=>{const x=astronomyVerifiedExercise(q);assert.equal(x?.verified,true,q);assert.ok(Math.abs(x.value-v)<=Math.max(1e-8,Math.abs(v)*1e-7),q);assert.ok(!astronomyVerifiedExercise(q,'explain').body.includes('Rezultat:'))};
verify('Paralaxă: p=0.5 arcsec',2);
verify('Viteza orbitala: M=5.972e24 kg; r=6.371e6 m',Math.sqrt(6.67430e-11*5.972e24/6.371e6));
verify('Viteza de evadare: M=5.972e24 kg; r=6.371e6 m',Math.sqrt(2*6.67430e-11*5.972e24/6.371e6));
verify('Rezolutie telescop: lambda=5e-7 m; D=2 m',1.22*5e-7/2);
verify('Stefan Boltzmann luminozitate: raza=6.957e8 m; T=5772 K',4*Math.PI*6.957e8**2*5.670374419e-8*5772**4);
verify('Tranzit: Rp=1e7 m; Rs=1e8 m',1);
verify('Converteste: 2 pc',2*3.261563777);
assert.equal(astronomyVerifiedExercise('Paralaxă: p=0 arcsec')?.kind,'input');
assert.equal(astronomyVerifiedExercise('Viteza orbitala: M=-5 kg; r=10 m')?.kind,'input');
assert.equal(astronomyVerifiedExercise('Unde este Marte?'),null,'no false live ephemerides');
const html=await(await frontend.fetch(new Request('https://astronomy.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
for(const marker of ['ASTRONOMY_TOPIC_DATA','ASTRONOMY_SPECIALTY_DATA','ASTRONOMY_SOLVE_VERIFIED',
 'function astronomyTheoryOpen()','function astronomyVisualBuild(kind)','function astronomyDiagramPicker()',
 "scienceJourney.subject==='astronomy'"])
 assert.ok(script.includes(marker),marker);
const begin=script.indexOf('function astronomyVisualKind(question,topic)');
const end=script.indexOf('function scienceShowResult(title,body)',begin);
class FakeEl{constructor(tag){this.tag=tag;this.children=[];this.textContent='';this.attrs={}}append(...v){this.children.push(...v)}setAttribute(k,v){this.attrs[k]=v}}
const visual=vm.runInNewContext(script.slice(begin,end)+';({kind:astronomyVisualKind,draw:astronomyVisualBuild})',{
 document:{createElement:t=>new FakeEl(t),createElementNS:(ns,t)=>new FakeEl(t)},
 learningLabel:(ro,en)=>ro,
 educationTheoryClean:v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()
});
for(const kind of ['solar','orbit','parallax','hr','transit','cosmos','telescope','galaxy']){
 assert.ok(visual.draw(kind).children.some(x=>x.tag==='svg'));
}
assert.equal(visual.kind('Paralaxa stelară','distances'),'parallax');
assert.equal(visual.kind('Legea lui Kepler','gravity'),'orbit');
console.log('PASS astronomy: 82 curated entries, 7 university tracks, guarded calculations, eight SVG diagrams and UI integration');
