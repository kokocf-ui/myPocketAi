import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://math.test/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script);new vm.Script(script);
const start=script.indexOf('function mathPlaneShapeModel(');
const end=script.indexOf('function mathAlgebraEngines(',start);
assert.ok(start>0&&end>start);
const element=tag=>({tag,attrs:{},children:[],textContent:'',append(...items){this.children.push(...items)}});
const c={state:{language:'ro'},learningLabel:ro=>ro,document:{createElement:element},
 mathSvgElement:(tag,attrs)=>{const e=element(tag);e.attrs=attrs||{};return e},
 mathSvgText:(svg,x,y,text)=>{const e=element('text');e.textContent=text;svg.append(e)}};
const api=vm.runInNewContext(script.slice(start,end)+
 '\n({model:mathPlaneShapeModel,solve:mathPlaneShapeSolution,method:mathPlaneShapeMethod,graph:mathPlaneShapeGraph,figure:mathPlaneShapeFigure})',c);
let a=api.model('Un pătrat are latura de 4 cm. Calculați aria și perimetrul.');
assert.equal(a.kind,'square');assert.equal(a.area,16);assert.equal(a.perimeter,16);
assert.match(api.solve('pătrat latura 4 cm').steps[1].fullAfter,/16 cm²/);
assert.equal(api.method('pătrat latura 4 cm').rules.length,4);
a=api.model('Dreptunghi cu lungimea de 8 cm și lățimea de 5 cm.');
assert.equal(a.kind,'rectangle');assert.equal(a.area,40);assert.equal(a.perimeter,26);
assert.match(api.solve('dreptunghi lungimea 8 cm latimea 5 cm').steps[2].fullAfter,/26 cm/);
a=api.model('Un cerc cu raza de 3 cm. Calculați aria și circumferința.');
assert.equal(a.kind,'circle');assert.equal(a.r,3);assert.ok(Math.abs(a.area-9*Math.PI)<1e-9);
assert.ok(Math.abs(a.perimeter-6*Math.PI)<1e-9);
assert.match(api.solve('cerc raza 3 cm').steps[1].fullAfter,/9π/);
a=api.model('Cerc cu diametrul de 10 cm');
assert.equal(a.r,5);assert.equal(a.d,10);
assert.match(api.solve('cerc diametrul 10 cm').steps[0].fullAfter,/10 \/ 2 = 5 cm/);
assert.equal(api.model('rectangle length 7 width 2').area,14);
assert.equal(api.model('square side 2,5 m').area,6.25);
for(const wrong of [
 'triunghi dreptunghic catetele 3 și 4 cm',
 'dreptunghi lungimea 3 m latimea 5 cm',
 'dreptunghi lungimea 3 cm',
 'pătrat latura -4 cm',
 'pătrat latura 4 cm și 6 cm',
 'cerc raza 3 și diametru 6',
 'cerc cu diametru necunoscut',
 'cerc raza 0 cm',
 'cerc raza 3 cm 45°',
 'x + 3 = 4'
])assert.equal(api.model(wrong),null,'do not invent a plane shape from '+wrong);
for(const source of ['pătrat latura 4 cm','dreptunghi lungimea 8 cm latimea 5 cm','cerc raza 3 cm']){
 const model=api.graph(source);assert.ok(model?.planeShape);
 const fig=api.figure(model.planeShape);
 assert.equal(fig.tag,'figure');assert.equal(fig.children[0].tag,'svg');
 assert.match(fig.children[1].textContent,/nu este la scară/);
}
assert.ok(script.includes("id:'plane-shapes',solve:mathPlaneShapeSolution"));
assert.ok(script.includes('equationGraph?.planeShape?mathPlaneShapeFigure(equationGraph.planeShape)'));
console.log('PASS plane shapes: square, rectangle, circle, unit validation, formulas, diagrams and unsupported cases');
