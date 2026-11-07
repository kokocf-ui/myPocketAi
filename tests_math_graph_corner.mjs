import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://test.math/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'frontend script present');
new vm.Script(script);
const a=script.indexOf('function mathGraphVerifiedAnswers(');
const b=script.indexOf('function mathResultPage(',a);
assert.ok(a>0&&b>a,'shared graph result function');
const env={
 state:{language:'ro'},
 mathFigureMeasurement:v=>{if(v==null||v==='')return null;const n=Number(String(v).replace(',','.'));return Number.isFinite(n)&&n>0?n:null},
 mathFigureInternalConflict:()=>null,
 mathPlaneShapeModel:source=>source==='text-rectangle'?{kind:'rectangle',a:8,b:5,area:40,perimeter:26,unit:'cm'}:null,
 mathRightTriangleModel:()=>null, mathLinearEquation:()=>null,
 mathQuadraticEquation:()=>null, mathLinearSystem:()=>null,
 mathAdditionalModel:()=>null,
 mathGraphModel:source=>source==='f(x)=2x+3'?{a:0,b:2,c:3}:null
};
const f=vm.runInNewContext(script.slice(a,b)+'\nmathGraphVerifiedAnswers',env);
assert.deepEqual([...f('text-rectangle',null)],['A = 40 cm²','P = 26 cm']);
assert.deepEqual([...f('f(x)=2x+3',null)],['f(0) = 3','x₀ = -1,5']);
assert.deepEqual([...f('ignored',{id:'square',unit:'cm',values:{latura:'6'}})],['A = 36 cm²','P = 24 cm']);
assert.deepEqual([...f('ignored',{id:'rectangle',unit:'cm',values:{lungime:'8',latime:'5'}})],['A = 40 cm²','P = 26 cm']);
assert.deepEqual([...f('ignored',{id:'cube',unit:'cm',values:{latura:'3'}})],['V = 27 cm³','A = 54 cm²']);
assert.deepEqual([...f('ignored',{id:'square',unit:'cm',values:{}})],[],'no guesses for missing dimensions');
assert.deepEqual([...f('ignored',{id:'prism',unit:'cm',values:{baza:'7'}})],[],'no unsupported prism calculation');
assert.ok(script.includes("session.mode==='graph'||Boolean(attachedFigure)||Boolean(mathGraphVerifiedAnswers(item.text,null).length)"),'local plots also appear in step-by-step');
assert.ok(script.includes('body.append(mathGraphCorner(graph,item.text,attachedFigure))'),'corner used by central graph renderer');
assert.ok(html.includes('.math-graph-corner{'),'compact corner style');
console.log('PASS shared graph corner: square 36/24, rectangle 40/26, 3D volume/surface, no invented values');
