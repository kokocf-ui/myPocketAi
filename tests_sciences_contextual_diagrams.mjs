import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {SCIENCE_CONTEXTUAL_DIAGRAMS,scienceContextualDiagramSpec,scienceContextualDiagramBuild} from './science_contextual_diagrams.mjs';
const counts={chemistry:14,biology:10};
let rendered=0;
class E{
 constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.textContent='';this.className='';this.style={};}
 append(...items){this.children.push(...items)}
 setAttribute(k,v){this.attrs[k]=String(v)}
 getAttribute(k){return this.attrs[k]}
}
const ctx={document:{createElement:tag=>new E(tag),createElementNS:(ns,tag)=>new E(tag)},scienceContextualDiagramSpec};
const draw=vm.runInNewContext('('+scienceContextualDiagramBuild.toString()+')',ctx);
for(const [subject,amount] of Object.entries(counts)){
 const maps=SCIENCE_CONTEXTUAL_DIAGRAMS[subject];
 assert.equal(Object.keys(maps).length,amount,'A unique chapter-specific model per existing foundation chapter');
 const shapes=new Set();
 for(const [topic,source] of Object.entries(maps)){
  const shape=source[2];
  assert.ok(source[0].length>=10&&source[1].length>=10);
  assert.ok(source[3].length>=95&&source[4].length>=70,'Model needs scientifically bounded caption '+topic);
  shapes.add(shape);
  for(const lang of ['ro','en']){
   const figure=draw(subject,topic,lang);
   assert.ok(figure,'Missing topic-specific model '+subject+'/'+topic+'/'+lang);
   assert.equal(figure.children[0].textContent,source[lang==='ro'?0:1]);
   const svg=figure.children.find(x=>x.tag==='svg');
   assert.ok(svg&&svg.children.length>=5,'SVG does not contain a meaningful actual diagram '+topic);
   assert.ok(figure.children.at(-1).textContent.includes(lang==='ro'?'Model didactic':'Schematic teaching model'));
   rendered++;
  }
 }
 assert.ok(shapes.size>=amount-2,'Diagrams must not all reuse the same type across unrelated topics');
}
assert.equal(rendered,48);
assert.equal(scienceContextualDiagramSpec('biology','not-existing'),null);
assert.equal(draw('biology','not-existing','ro'),null,'Never substitute a fake generic biology diagram');
assert.equal(draw('chemistry','not-existing','ro'),null,'Never substitute a fake generic chemistry diagram');
const html=await(await frontend.fetch(new Request('https://sciences-contextual-visuals.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
for(const item of [
 'const SCIENCE_CONTEXTUAL_DIAGRAMS=',
 'const scienceContextualDiagramSpec=',
 'const scienceContextualDiagramBuild=',
 "function scienceSubjectDiagramOpen(subject){",
 "if(subject==='chemistry'&&topic==='periodic')",
 "chemistryVisualOpen('periodic','')",
 "scienceSubjectDiagramOpen('chemistry')",
 "scienceSubjectDiagramOpen('biology')",
 "['cells','genetics'].includes(scienceJourney.topic)"
])assert.ok(script.includes(item),'Sciences diagram wiring missing: '+item);
assert.ok(!/Missing specific biological diagram /.test(script));
console.log('PASS Sciences visuals: 14 Chemistry + 10 Biology exact chapter diagrams, 48 bilingual SVG models, no generic fallbacks; interactive periodic table preserved');
