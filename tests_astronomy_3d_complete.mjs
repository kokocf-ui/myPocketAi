import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
const html=await(await app.fetch(new Request('https://astronomy-model-test.invalid/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
assert.ok(script);
const start=script.indexOf('function astronomyOrbit3DOpen(){');
const end=script.indexOf('function astronomyDiagramPicker(',start);
assert.ok(start>0&&end>start);
class El{
 constructor(tag){this.tag=tag;this.children=[];this.style={};this.attrs={};this.events={};
  this.value='';this.textContent='';this.hidden=false;}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=[...children]}
 setAttribute(name,value){this.attrs[name]=String(value)}
 addEventListener(type,handler){this.events[type]=handler}
 remove(){}
 close(){this.events.close?.()}
 showModal(){}
}
let modal=null;
const ctx={
 document:{
  createElement:tag=>new El(tag),
  createElementNS:(ns,tag)=>new El(tag),
  getElementById:()=>null,
  body:{append:x=>modal=x}
 },
 learningLabel:(ro,en)=>ro
};
const prefix=script.substring(script.indexOf('const ASTRONOMY_PLANETS='),script.indexOf('const astronomySchoolTopicLessons='));
const captured=vm.runInNewContext(prefix+'\n'+script.substring(start,end)+
 '\n({open:astronomyOrbit3DOpen})',ctx);
captured.open();
assert.equal(modal.tag,'dialog');
const frame=modal.children.find(x=>x.className==='physics-visual')||
 modal.children.find(x=>x.children.some(y=>y.tag==='svg'));
assert.ok(frame,'3D diagram must be mounted in modal');
const svg=frame.children.find(x=>x.tag==='svg');
assert.ok(svg,'3D diagram requires an SVG');
const count=tag=>svg.children.filter(c=>c.tag===tag).length;
assert.equal(count('path'),8,'all 8 planet orbits appear');
assert.equal(count('circle'),9,'sun plus all 8 planets are visible');
assert.equal(svg.children.filter(c=>c.tag==='text'&&/^[1-8]$/.test(c.textContent)).length,8,
 '8 orbit positions have corresponding legend numbers');
const infos=modal.children.find(x=>x.children.filter(y=>y.tag==='div'&&/UA/.test(y.textContent)).length===8);
assert.ok(infos,'8 named planets must appear in visible legend');
assert.ok(infos.children.some(x=>x.textContent.includes('Mercur')));
assert.ok(infos.children.some(x=>x.textContent.includes('Neptun')));
const note=modal.children.find(x=>x.tag==='p'&&x.textContent.includes('NU sunt la scară'));
assert.ok(note,'diagram must carry visible scale warning');
const tools=modal.children.find(x=>x.className==='science-work-tools');
assert.equal(tools.children.length,3,'rotation, tilt and zoom must be available');
const [turn,tilt,zoom]=tools.children.map(x=>x.children.find(y=>y.tag==='input'));
assert.equal(turn.value,'28');assert.equal(tilt.value,'48');assert.equal(zoom.value,'100');
const before=svg.children.filter(x=>x.tag==='circle').slice(1).map(x=>x.attrs.cx);
turn.value='180';turn.events.input();
const after=svg.children.filter(x=>x.tag==='circle').slice(1).map(x=>x.attrs.cx);
assert.notDeepEqual(before,after,'rotating changes projected planet positions');
zoom.value='140';zoom.events.input();
assert.equal(count('circle'),9,'zoom preserves all eight planets');
console.log('PASS Astronomy interactive 3D: 8 numbered planetary orbits, full legend, scale warnings, rotation and zoom');
