import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'Math embedded script exists');
new vm.Script(script);
const graphStart=script.indexOf('function mathGraphModel(');
const graphEnd=script.indexOf('function mathSvgElement(',graphStart);
const quadraticStart=script.indexOf('function mathQuadraticEquation(');
const quadraticEnd=script.indexOf('// Plot the difference (left side minus right side)',quadraticStart);
assert.ok(graphStart>0&&graphEnd>graphStart&&quadraticStart>0&&quadraticEnd>quadraticStart);
const api=vm.runInNewContext(script.slice(graphStart,graphEnd)+'\n'+script.slice(quadraticStart,quadraticEnd)+
 '\n({parse:mathQuadraticEquation,solve:mathQuadraticSolution,method:mathQuadraticMethodGuide,graph:mathQuadraticGraphData})',
 {state:{language:'ro'},learningLabel:(ro,en)=>ro,Intl});

const m=api.parse('2x^2-7x+3=0');
assert.equal(m.a,2);assert.equal(m.b,-7);assert.equal(m.c,3);assert.equal(m.delta,25);
assert.deepEqual([...m.roots],[0.5,3]);
const solution=api.solve('2x^2-7x+3=0');
assert.equal(solution.steps.length,4);
assert.match(solution.steps[1].operation,/25/);
assert.match(solution.conclusion,/0,5/);
assert.match(solution.conclusion,/3/);
assert.equal(solution.steps[3].verificationSteps.length,2);
assert.ok(solution.steps[3].verificationSteps.every(v=>v.endsWith(' = 0')));
assert.ok(!JSON.stringify(solution).includes('nu are soluții reale'));
const graph=api.graph('2x^2-7x+3=0');
assert.ok(graph.expression.includes('2x^2-7x+3'));
assert.match(graph.intro,/1,75/);
assert.match(graph.conclusion,/0,5/);
assert.match(graph.conclusion,/3/);
const method=api.method('2x^2-7x+3=0');
assert.ok(method.rules.some(r=>r.text.includes('Δ > 0')));
assert.ok(!method.rules.some(r=>r.text.includes('x = 3')),'Method remains generic');
assert.equal(api.parse('x^2-2x+1=0').roots.length,1,'Repeated root');
assert.equal(api.parse('x^2+1=0').roots.length,0,'No real root');
assert.equal(api.parse('3(2x-4)-2(x+5)=2(x-3)+8'),null,'Keep linear equation separate');
assert.equal(api.parse('x^3-2x+1=0'),null,'Never accept unsupported cubic');
assert.equal(api.parse('2x^2-7x+3=1'),null,'Never silently discard a nonzero RHS');
assert.equal(api.parse('2x^2-7x+3=0=0'),null,'Reject multiple equal signs');
assert.ok(script.includes("const steps=item.detailed||mathAlgebraLocal('solve',item.text)?.value"));
assert.ok(script.includes("mathAlgebraLocal('graph',item.text)"));
assert.ok(script.includes('mathQuadraticGraphData(source)'));
console.log('PASS verified quadratic: discriminant, two roots, proof, graph, repeated/no-real roots and linear isolation');
