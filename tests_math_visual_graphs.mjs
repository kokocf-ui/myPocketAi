import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script);
new vm.Script(script);
const start=script.indexOf('function mathSymbolicGraph(');
const end=script.indexOf('function mathAlgebraEngines(',start);
assert.ok(start>0&&end>start);
function element(tag){
 return {tag,children:[],attrs:{},style:{},textContent:'',
  append(...items){this.children.push(...items)},setAttribute(key,value){this.attrs[key]=value}};
}
const context={
 document:{createElement:element},
 learningLabel:(ro,en)=>ro,
 mathSymbolicPoly:(source)=>source==='2(x+3)+3(x-1)'?{coefficients:[3,5]}:
  source==='x^3-x'?{coefficients:[0,-1,0,1]}:null,
 mathSymbolicFormat:coeffs=>coeffs.length===2?'5x + 3':'x^3 − x',
 mathMatrixExercise:source=>source.startsWith('A=')?{first:[[1,2],[3,4]],second:[[5,6],[7,8]],
  result:[[19,22],[43,50]],mode:'multiply'}:null,
 mathLinearNotation:()=>({number:n=>String(n)}),
 mathSvgElement:(tag,attrs)=>{const el=element(tag);el.attrs=attrs;return el},
 mathSvgLine:(svg,...values)=>svg.append(element('line')),
 mathSvgText:(svg,...values)=>svg.append(element('text'))
};
const api=vm.runInNewContext(script.slice(start,end)+
 '\n({symbolic:mathSymbolicGraph,symbolicPlot:mathSymbolicPlot,matrix:mathMatrixGraph,heatmap:mathMatrixHeatmap})',context);
const expression='2(x+3)+3(x-1)';
const graph=api.symbolic(expression);
assert.ok(graph);assert.equal(JSON.stringify([...graph.polynomial]),'[3,5]');
assert.match(graph.intro,/f\(x\) = 5x \+ 3/);
assert.equal(api.symbolic('unsupported'),null);
const plot=api.symbolicPlot(graph.polynomial);
assert.equal(plot.tag,'figure');
const svg=plot.children[0];
assert.equal(svg.tag,'svg');
assert.ok(svg.children.some(p=>p.tag==='path'));
assert.ok(api.symbolicPlot([0,-1,0,1]).children[0].children.some(p=>p.tag==='path'),'cubic plots');
const mg=api.matrix('A=...');
assert.ok(mg&&mg.matrixView);
const heatmap=api.heatmap(mg.matrixView);
assert.equal(heatmap.tag,'figure');
const regions=heatmap.children[0].children;
assert.equal(regions.length,3,'first, second and product matrices shown');
assert.equal(regions[2].children[1].children[0].textContent,'19');
assert.equal(regions[2].children[1].children[1].textContent,'22');
assert.equal(regions[2].children[1].children[2].textContent,'43');
assert.equal(regions[2].children[1].children[3].textContent,'50');
assert.match(mg.conclusion,/nu graficul unei funcții/);
assert.ok(script.includes("graph:mathMatrixGraph"));
assert.ok(script.includes("graph:mathSymbolicGraph"));
assert.ok(script.includes("equationGraph?.matrixView?mathMatrixHeatmap"));
assert.ok(script.includes("equationGraph?.polynomial?mathSymbolicPlot"));
console.log('PASS matrix value heatmaps and polynomial graphs through common dispatch');
