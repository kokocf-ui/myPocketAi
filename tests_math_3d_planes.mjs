import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'frontend script present');new vm.Script(script);
const a=script.indexOf('function math3DPlanePolygon(');
const b=script.indexOf('function mathAlgebraEngines(',a);
assert.ok(a>0&&b>a);
const document={
 createElement(tag){return element(tag)},
 createElementNS(ns,tag){return element(tag)}
};
function element(tag){
 return {tag,children:[],attrs:{},listeners:{},textContent:'',
  append(...items){this.children.push(...items)},
  replaceChildren(...items){this.children=items},
  setAttribute(k,v){this.attrs[k]=String(v)},
  addEventListener(k,fn){this.listeners[k]=fn},
  getBoundingClientRect(){return {width:420,height:340}},
  setPointerCapture(){},
  className:''
 };
}
const context={document,state:{language:'ro'},learningLabel:(ro,en)=>ro,
 mathLinearNotation:()=>({number:n=>String(n)}),Math,Map};
const api=vm.runInNewContext(script.slice(a,b)+
 '\n({plane:math3DPlanePolygon,figure:mathSystem3x3Figure,graph:mathSystem3x3Graph})',context);
const center=[1,2,3],radius=5;
const equations=[
 {a:1,b:1,c:1,d:6},
 {a:2,b:-1,c:1,d:3},
 {a:1,b:2,c:-1,d:2}
];
for(const eq of equations){
 const points=api.plane(eq,center,radius);
 assert.ok(points.length>=3&&points.length<=6,'plane intersects cube as valid polygon');
 for(const p of points){
  assert.ok(Math.abs(eq.a*p[0]+eq.b*p[1]+eq.c*p[2]-eq.d)<1e-8,'vertex satisfies actual plane');
  assert.ok(p.every((v,k)=>Math.abs(v-center[k])<=radius+1e-8),'vertex stays inside cube');
 }
}
const vertical=api.plane({a:1,b:0,c:0,d:1},center,5);
assert.equal(vertical.length,4,'vertical plane stays drawable');
assert.ok(vertical.every(p=>Math.abs(p[0]-1)<1e-8));
assert.equal(api.plane({a:0,b:0,c:0,d:1},center,5).length,0,'invalid plane omitted');
const m={equations,kind:'unique',values:{x:1,y:2,z:3}};
const figure=api.figure(m);
assert.ok(figure&&figure.tag==='figure');
const svg=figure.children[0];
assert.equal(svg.tag,'svg');
assert.ok(svg.children.filter(c=>c.tag==='polygon').length===3,'all three planes visible');
assert.ok(svg.children.some(c=>c.tag==='circle'),'verified common point visible');
assert.ok(svg.attrs.style.includes('touch-action:none'),'drag handled within chart');
const firstPolygon=svg.children.find(c=>c.tag==='polygon').attrs.points;
svg.listeners.pointerdown({pointerId:1,clientX:100,clientY:100,cancelable:true,preventDefault(){}});
svg.listeners.pointermove({pointerId:1,clientX:170,clientY:125,cancelable:true,preventDefault(){}});
assert.notEqual(svg.children.find(c=>c.tag==='polygon').attrs.points,firstPolygon,'drag rotates planes');
svg.listeners.pointerup({pointerId:1});
svg.listeners.pointerdown({pointerId:2,clientX:100,clientY:100,cancelable:true,preventDefault(){}});
svg.listeners.pointerdown({pointerId:3,clientX:200,clientY:100,cancelable:true,preventDefault(){}});
const beforeZoom=svg.children.find(c=>c.tag==='polygon').attrs.points;
svg.listeners.pointermove({pointerId:3,clientX:250,clientY:100,cancelable:true,preventDefault(){}});
assert.notEqual(svg.children.find(c=>c.tag==='polygon').attrs.points,beforeZoom,'pinch zoom works');
svg.listeners.pointerup({pointerId:2});svg.listeners.pointerup({pointerId:3});
assert.ok(script.includes('equationGraph?.system3d?mathSystem3x3Figure(equationGraph.system3d)'));
assert.ok(script.includes('system3d:m,heading:'));
console.log('PASS verified 3D planes: exact clipping, vertical surfaces, common point, touch rotation, pinch zoom');
