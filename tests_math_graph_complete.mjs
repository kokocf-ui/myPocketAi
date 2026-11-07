import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {mathAdvancedVerifiedModel} from './math_advanced_verified.mjs';
const html=await(await frontend.fetch(new Request('https://math-graphics-contract.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
new vm.Script(script);
const datum=mathAdvancedVerifiedModel('varianța eșantion: 1,2,3');
assert.equal(datum.result,'1');
assert.deepEqual(datum.data,[1,2,3]);
assert.equal(datum.summary,'s² = 1');
const a=script.indexOf('function mathAdditionalGraph('),b=script.indexOf('function mathStatisticsFigure(',a);
const graph=vm.runInNewContext(script.slice(a,b)+'\nmathAdditionalGraph',{mathAdditionalModel:mathAdvancedVerifiedModel,learningLabel:ro=>ro});
const view=graph('varianța eșantion: 1,2,3');
assert.deepEqual([...view.statistics],[1,2,3],'graph reads original values only');
assert.equal(view.conclusion,'s² = 1','graph annotation uses computed result');
const cornerA=script.indexOf('function mathGraphVerifiedAnswers('),cornerB=script.indexOf('function mathGraphCorner(',cornerA);
assert.ok(cornerA>0&&cornerB>cornerA);
const verified=vm.runInNewContext(script.slice(cornerA,cornerB)+'\nmathGraphVerifiedAnswers',{
 state:{language:'ro'},Intl,
 mathFigureInternalConflict:()=>null,mathFigureMeasurement:value=>value==null?null:Number(value),
 mathGraphModel:()=>null,mathAdditionalModel:mathAdvancedVerifiedModel,
 mathPlaneShapeModel:()=>null,mathRightTriangleModel:()=>null,
 mathLinearEquation:()=>null,mathQuadraticEquation:()=>null,mathLinearSystem:()=>null
});
assert.deepEqual([...verified('varianța eșantion: 1,2,3',null)],['s² = 1']);
assert.deepEqual([...verified('ignored',{id:'square',unit:'cm',values:{latura:'6'}})],['A = 36 cm²','P = 24 cm']);
assert.deepEqual([...verified('ignored',{id:'cube',unit:'cm',values:{latura:'3'}})],['V = 27 cm³','A = 54 cm²']);
assert.deepEqual([...verified('ignored',{id:'right',unit:'cm',values:{a:'3',b:'4'}})],['c = 5 cm','A = 6 cm²','P = 12 cm']);
assert.deepEqual([...verified('ignored',{id:'square',unit:'cm',values:{}})],[]);
assert.match(script,/body\.append\(mathGraphCorner\(graph,item\.text,attachedFigure\)\)/);
assert.match(script,/session\.tasks\[session\.active\]===item/,'stale task cannot overwrite a different graph');
console.log('PASS shared graphs: statistics, figures, verified corner results, stale-association guards');
