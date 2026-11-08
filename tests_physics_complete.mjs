import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {PHYSICS_TOPICS,PHYSICS_SPECIALIZATIONS,PHYSICS_LESSONS} from './physics_curriculum.mjs';
import {physicsVerifiedExercise} from './physics_verified.mjs';
import {THEORY_ENTRIES,searchTheory} from './education_theory.mjs';
const rank={beginner:0,intermediate:1,advanced:2};
const ids=new Set(PHYSICS_TOPICS.map(x=>x.id));
assert.equal(PHYSICS_TOPICS.length,21,'14 common chapters and 7 specialties');
assert.equal(PHYSICS_SPECIALIZATIONS.length,7);
assert.equal(PHYSICS_LESSONS.length,83);
assert.equal(new Set(PHYSICS_LESSONS.map(x=>x.id)).size,83,'unique cards');
assert.ok(PHYSICS_LESSONS.every(e=>e.subject==='physics'&&ids.has(e.topic)&&e.title&&e.statement&&e.formula));
assert.ok(PHYSICS_LESSONS.every(e=>rank[e.level]>=rank[PHYSICS_TOPICS.find(t=>t.id===e.topic).minLevel]));
assert.equal(THEORY_ENTRIES.filter(x=>x.subject==='physics').length,102);
assert.ok(searchTheory('Schrödinger',{subject:'physics',level:'advanced'}).length>0);
assert.equal(searchTheory('Schrödinger',{subject:'physics',level:'beginner'}).length,0);
assert.equal(PHYSICS_LESSONS.find(x=>x.title==='Constanta electrostatică în vid').formula,'k=1/(4πε₀)');
assert.equal(physicsVerifiedExercise('Calculează forța: m=2 kg; a=3 m/s²')?.value,6);
assert.equal(physicsVerifiedExercise('Calculează energia cinetică: m=2 kg; v=3 m/s')?.value,9);
assert.equal(physicsVerifiedExercise('Calculează viteza: s=100 m; t=20 s')?.value,5);
assert.equal(physicsVerifiedExercise('Legea lui Ohm: I=2 A; R=5 Ω')?.value,10);
assert.equal(physicsVerifiedExercise('Legea lui Ohm: U=12 V; R=6 Ω')?.value,2);
assert.equal(physicsVerifiedExercise('Putere electrică: U=12 V; I=2 A')?.value,24);
assert.equal(physicsVerifiedExercise('Undă: f=2 Hz; λ=3 m')?.value,6);
assert.equal(physicsVerifiedExercise('Calculează forța: m=-2 kg; a=3 m/s²')?.kind,'input');
assert.equal(physicsVerifiedExercise('Masa este aproximativ 2 kg'),null,'no fabricated result from incomplete data');
const html=await(await frontend.fetch(new Request('https://physics-university.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
for(const text of ['PHYSICS_TOPIC_DATA','PHYSICS_SPECIALTY_DATA','PHYSICS_SOLVE_VERIFIED',
'function physicsTheoryOpen()','function physicsVisualBuild(kind)','function physicsVisualKind(question,topic)',
'function physicsVisualPicker()','function scienceMakeSymbolPalette(editor,subject)',
"scienceJourney.subject==='physics'"])assert.ok(script.includes(text),text);
assert.match(html,/\.physics-theory-dialog\[open\]/);
assert.match(html,/\.science-symbol-tray:not\(\[hidden\]\)/);
const begin=script.indexOf('function physicsVisualKind(question,topic)');
const end=script.indexOf('function scienceShowResult(title,body)',begin);
class FakeEl{
 constructor(tag){this.tag=tag;this.children=[];this.attributes={};this.className='';this.style={};this.textContent='';this.value='';}
 append(...els){this.children.push(...els)}
 setAttribute(k,v){this.attributes[k]=v}
}
const visual=vm.runInNewContext(script.slice(begin,end)+';({kind:physicsVisualKind,draw:physicsVisualBuild})',{
 document:{createElement:tag=>new FakeEl(tag),createElementNS:(ns,tag)=>new FakeEl(tag)},
 learningLabel:(ro,en)=>ro,
 educationTheoryClean:v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()
});
assert.equal(visual.kind('legea lui Ohm','electric'),'circuit');
assert.equal(visual.kind('a doua lege Newton','dynamics'),'force');
assert.equal(visual.kind('frecvența unei unde','waves'),'wave');
for(const kind of ['motion','force','energy','wave','circuit','optics','thermo','quantum']){
 const img=visual.draw(kind);
 assert.ok(img?.children.some(x=>x.tag==='svg'),kind+' has diagram');
}
console.log('PASS physics: 21 chapters, 7 advanced specialties, 102 theory cards, guarded SI solvers, contextual diagrams and shared symbols');
