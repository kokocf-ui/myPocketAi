import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'Math script must exist');
new vm.Script(script);
const linearA=script.indexOf('function mathLinearEquation(');
const linearB=script.indexOf('function mathLinearNotation(',linearA);
const notationB=script.indexOf('// Show each arithmetic transformation',linearB);
const registryA=script.indexOf('function mathLinearInequality(');
const registryB=script.indexOf('// Plot the difference (left side minus right side)',registryA);
assert.ok(linearA>0&&linearB>linearA&&notationB>linearB&&registryA>0&&registryB>registryA);
const stubs={
 mathLinearSolution:()=>null,mathLinearMethodGuide:()=>null,
 mathLinearGraphData:()=>null,
 mathQuadraticSolution:()=>null,mathQuadraticMethodGuide:()=>null,
 mathQuadraticGraphData:()=>null,
 mathDetailedArithmetic:()=>null,mathMethodGuide:()=>null
};
const api=vm.runInNewContext(script.slice(linearA,notationB)+'\n'+script.slice(registryA,registryB)+
 '\n({parse:mathLinearInequality,solve:mathLinearInequalitySolution,method:mathLinearInequalityMethod,local:mathAlgebraLocal})',
 {state:{language:'ro'},learningLabel:(ro,en)=>ro,Intl,...stubs});
const positive=api.parse('2x + 3 > 7');
assert.equal(positive.boundary,2);
assert.equal(positive.comparison,'x > 2');
assert.match(api.solve('2x+3>7').conclusion,/x > 2/);
assert.equal(api.parse('-3x + 2 <= 11').comparison,'x ≥ −3','negative divisor reverses sign');
assert.match(api.solve('-3x+2<=11').steps[1].reason,/inversăm obligatoriu/);
assert.equal(api.parse('x+1 < x+3').universal,true);
assert.equal(api.parse('x+5 < x+1').universal,false);
assert.match(api.solve('x+5<x+1').conclusion,/Mulțimea vidă/);
assert.equal(api.parse('3(x-2)>=6').comparison,'x ≥ 4');
assert.equal(api.parse('x^2>0'),null,'nonlinear inequality is not misrepresented');
assert.equal(api.parse('x<2<3'),null,'chained inequalities are not silently reduced');
assert.equal(api.parse('x<0=0'),null,'mixed equalities are not accepted');
assert.equal(api.local('solve','2x+3>7').engine,'linear-inequality');
assert.equal(api.local('explain','2x+3>7').engine,'linear-inequality');
assert.equal(api.local('graph','2x+3>7'),null,'no fabricated inequality graph');
assert.ok(api.method('x>2').rules.some(x=>x.text.includes('negativ')));
const cases=['3(2x-4)-2(x+5)=2(x-3)+8','2x^2-7x+3=0'];
for(const input of cases)assert.equal(api.parse(input),null,'legacy equation path remains isolated: '+input);
assert.ok(script.includes("const steps=item.detailed||mathAlgebraLocal('solve',item.text)?.value"));
assert.ok(script.includes("const method=item.methodGuide||mathAlgebraLocal('explain',item.text)?.value"));
console.log('PASS algebra registry: linear inequalities, sign reversal, all/empty sets and legacy isolation');
