import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const embedded=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(embedded,'generated frontend contains the math module');
new vm.Script(embedded);

const graphStart=embedded.indexOf('function mathGraphModel(');
const graphEnd=embedded.indexOf('function mathGeometryFigure(',graphStart);
const algebraStart=embedded.indexOf('function mathArithmeticValue(');
const algebraEnd=embedded.indexOf('function mathQuadraticEquation(',algebraStart);
assert.ok(graphStart>0&&graphEnd>graphStart&&algebraStart>graphEnd&&algebraEnd>algebraStart);

const node=tag=>({
 tag,children:[],attributes:{},textContent:'',
 append(...elements){this.children.push(...elements)},
 setAttribute(key,value){this.attributes[key]=String(value)}
});
const dom={createElement:node,createElementNS:(namespace,tag)=>node(tag)};
const api=vm.runInNewContext(
 embedded.slice(graphStart,graphEnd)+'\n'+embedded.slice(algebraStart,algebraEnd)+
 '\n({model:mathGraphModel,linear:mathLinearEquation,graph:mathLinearGraphData,plot:mathGraphFigure,solve:mathLinearSolution})',
 {state:{language:'ro'},learningLabel:(ro,en)=>ro,Intl,document:dom});

const question='Rezolvă ecuația:\n3(2x−1)+5=20';
const association=api.graph(question);
assert.ok(association);
assert.equal(association.expression,'f(x) = 6x − 18');
assert.equal(association.root,3);
assert.match(association.intro,/Scădem membrul drept din cel stâng/i);
assert.match(association.conclusion,/punctul \(3; 0\).*x = 3/);
const model=api.model(association.expression);
assert.deepEqual([model.a,model.b,model.c],[0,6,-18]);
const figure=api.plot(association.expression,association.root);
assert.equal(figure.tag,'figure');
assert.ok(figure.children.some(v=>v.tag==='svg'),'real SVG chart is built');
assert.ok(figure.children.some(v=>v.tag==='figcaption'),'caption is shown');
const svg=figure.children.find(v=>v.tag==='svg');
assert.equal(svg.children.filter(v=>v.tag==='circle').length,2,'chart marks intercept and origin-side point');
const proof=api.solve(question);
assert.equal(proof.solution,3);
assert.match(proof.steps.at(-1).operation,/3\(2\(3\)−1\)\+5=20/,'substitution is shown in ORIGINAL equation');
assert.match(proof.steps.at(-1).operation,/20 = 20/,'both sides are verified numerically');
assert.equal(proof.steps.at(-1).fullAfter,'20 = 20');

const existing=api.model('Reprezintă grafic funcția:\nf(x) = 2x-3');
assert.deepEqual([existing.a,existing.b,existing.c],[0,2,-3],'original function graph remains unchanged');
assert.equal(api.graph('f(x)=2x-3'),null,'do not reinterpret a function as an equation');
assert.equal(api.graph('x*x=4'),null,'nonlinear expressions must not be claimed to have a verified linear plot');
assert.equal(api.graph('2x+1=2x+2'),null,'contradiction is not shown as an ordinary root');
assert.equal(api.graph('2x+1=2x+1'),null,'identity is not shown as a unique root');
const far=api.graph('2x=24');
assert.equal(far.root,12);
const shifted=api.plot(far.expression,far.root);
assert.ok(shifted.children.some(v=>v.tag==='svg'),'root outside ±5 still has a valid chart');
assert.ok(embedded.includes("item.graphLesson=associated"),'Graph uses local data without model speculation');
assert.ok(embedded.includes("equationGraph?.expression?mathGraphFigure(equationGraph.expression,equationGraph.root??null)"),
 'graph renderer uses the verified associated formula');
console.log('PASS linear-equation SVG graph, x-intercept, original substitution and existing function chart');
