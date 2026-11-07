import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const page=await(await frontend.fetch(new Request('https://math.test/'))).text();
const script=[...page.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'frontend math logic exists');
new vm.Script(script);
const start=script.indexOf('function mathRightTriangleModel(');
const end=script.indexOf('function mathAlgebraEngines(',start);
assert.ok(start>0&&end>start,'right triangle functions precede geometry registry');
const element=tag=>({
 tag,attrs:{},children:[],textContent:'',
 append(...items){this.children.push(...items)},
 setAttribute(k,v){this.attrs[k]=v}
});
const context={
 state:{language:'ro'},
 learningLabel:(ro)=>ro,
 document:{createElement:element},
 mathSvgElement:(tag,attrs)=>{const e=element(tag);e.attrs=attrs||{};return e;},
 mathSvgText:(svg,x,y,label)=>{const e=element('text');e.textContent=label;svg.append(e)}
};
const api=vm.runInNewContext(script.slice(start,end)+
 '\n({model:mathRightTriangleModel,solve:mathRightTriangleSolution,method:mathRightTriangleMethod,graph:mathRightTriangleGraph,figure:mathRightTriangleFigure})',context);
const check=(source)=>api.model(source);
let m=check('Un triunghi dreptunghic are catetele de 3 cm și 4 cm. Află ipotenuza, aria și perimetrul.');
assert.ok(m,'catete declarate explicit recunoscute');
assert.equal(m.a,3);assert.equal(m.b,4);assert.equal(m.c,5);
assert.equal(m.area,6);assert.equal(m.perimeter,12);assert.equal(m.unit,'cm');
const solved=api.solve('Triunghi dreptunghic cu catetele 3 și 4 cm');
assert.ok(solved?.steps?.length>=4);
assert.match(solved.steps[1].fullAfter,/√\(9 \+ 16\) = 5 cm/);
assert.match(solved.steps[2].fullAfter,/6 cm²/);
assert.match(solved.steps[3].fullAfter,/12 cm/);
assert.match(solved.conclusion,/5 cm/);
assert.equal(api.method('triunghi dreptunghic catetele 3 și 4').rules.length,5);
assert.ok(!api.method('triunghi dreptunghic catetele 3 și 4').rules.some(x=>x.text.includes('= 5 cm')),'method teaches formula, not numeric answer');
m=check('Triunghi dreptunghic: cateta de 5 cm și ipotenuza de 13 cm. Află cateta necunoscută.');
assert.ok(m,'hypotenuse and one leg explicitly labelled');
assert.equal(m.a,5);assert.equal(m.b,12);assert.equal(m.c,13);
assert.equal(m.area,30);assert.equal(m.perimeter,30);
assert.match(api.solve('Pitagora: cateta 5 și ipotenuza 13').steps[1].fullAfter,/√\(169 − 25\) = 12/);
assert.ok(check('right triangle: legs 3 and 4'));
assert.ok(check('Teorema lui Pitagora: catetele 1,5 m și 2 m'));
assert.equal(check('Pitagora: catetele 1,5 m și 2 m').c,2.5);
for(const bad of [
 'triunghi oarecare cu laturile 3 și 4',
 'triunghi dreptunghic catetele 3 m și 4 cm',
 'triunghi dreptunghic catetele -3 și 4',
 'triunghi dreptunghic catetele 3 și 4 și unghiul 45°',
 'triunghi dreptunghic cateta 13 și ipotenuza 5',
 'triunghi dreptunghic cateta 13 și ipotenuza 13',
 'triunghi dreptunghic catetele 0 și 4',
 'triunghi dreptunghic catetele x și 4',
 'catetele 3 și 4',
 'x + 2 = 4',
])assert.equal(check(bad),null,'reject unsupported/ambiguous geometry: '+bad);
const graph=api.graph('triunghi dreptunghic catetele 3 si 4');
assert.ok(graph?.geometry);
assert.equal(graph.geometry.c,5);
const fig=api.figure(graph.geometry);
assert.equal(fig.tag,'figure');
assert.equal(fig.children[0].tag,'svg');
const svg=fig.children[0];
assert.ok(svg.children.some(el=>el.tag==='path'&&String(el.attrs.d).includes('H105')),'right-angle mark shown');
assert.ok(svg.children.filter(el=>el.tag==='text').some(el=>el.textContent.includes('c = 5')),'hypotenuse label visible');
assert.match(fig.children[1].textContent,/nu este la scară/);
assert.ok(script.includes("id:'right-triangle',solve:mathRightTriangleSolution"));
assert.ok(script.includes("equationGraph?.geometry?mathRightTriangleFigure(equationGraph.geometry)"));
assert.ok(script.includes('mathAlgebraLocal(\'graph\',item.text)'));
console.log('PASS right triangles: Pythagoras, inverse leg, area, perimeter, method, diagram and input safeguards');
