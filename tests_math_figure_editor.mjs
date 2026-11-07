import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://math.test/'))).text();
const source=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(source,'main inline script exists');new vm.Script(source);
const start=source.indexOf('const MATH_FIGURE_GROUPS=');
const end=source.indexOf("let mathJourney={stage:'levels'",start);
assert.ok(start>0&&end>start,'geometry figures remain independent of OCR');
const element=tag=>({
 tag,attributes:{},children:[],style:{},textContent:'',
 setAttribute(k,v){this.attributes[k]=v},
 append(...els){this.children.push(...els)},
 replaceChildren(...els){this.children=[...els]}
});
const context={learningLabel:ro=>ro,document:{createElement:element,getElementById:()=>null},
 mathSvgElement:(tag,attrs)=>{const e=element(tag);e.attributes=attrs||{};return e}};
const api=vm.runInNewContext(source.slice(start,end)+
 '\n({groups:MATH_FIGURE_GROUPS,figures:MATH_FIGURES,copy:mathFigureCopy,definition:mathFigureDefinition,auto:mathFigureAutoExercise,conflict:mathFigureConflict,paint:mathFigurePaint,mesh:mathFigureMesh,projection:mathFigureProject3D,defaultVertices:mathFigureDefaultVertices,name:mathFigureName})',context);
assert.equal(api.groups.length,4,'four figure families');
assert.equal(api.figures.filter(x=>x.group==='triangles').length,4);
assert.ok(api.figures.some(x=>x.id==='square'));
assert.ok(api.figures.some(x=>x.id==='circle'));
assert.ok(api.figures.some(x=>x.id==='sphere'&&x.solid));
assert.ok(api.figures.some(x=>x.id==='cone'&&x.solid));
for(const fig of api.figures){
 assert.ok(fig.id&&fig.ro&&fig.en);
 const draft=api.copy({id:fig.id});
 assert.deepEqual(Object.keys(draft.values),[],'every figure permits all dimensions blank');
 const svg=element('svg');api.paint(svg,draft);
 assert.equal(svg.attributes.viewBox,'0 0 360 240');
 assert.equal(svg.children[0].tag,'defs','drawing is clipped to viewport');
 assert.equal(svg.children[1].attributes['clip-path'],'url(#figure-editor-window)');
 if(fig.solid)assert.ok(api.mesh(fig.id).faces.length>0,'3D projected solid has faces: '+fig.id);
}
const right=api.copy({id:'right',values:{a:'3',b:'4'},unit:'cm'});
assert.match(api.auto(right),/catetele 3 cm și 4 cm/,'known dimensions can be passed to solver');
assert.equal(api.auto(api.copy({id:'right'})),'','blank figure cannot invent dimensions');
assert.equal(api.auto(api.copy({id:'right',values:{a:'3'}})),'','a single cateta is not enough');
assert.equal(api.auto(api.copy({id:'right',values:{a:'3',b:'4'},modified:true})),'','moved vertices never retain a guaranteed right angle');
const square=api.copy({id:'square',values:{latura:'5'},unit:'m'});
assert.equal(api.auto(square),'Pătrat latura 5 m.');
assert.equal(api.conflict(square,'Pătrat cu latura de 6 m'),'latura','conflicting statement blocks automatic merge');
assert.equal(api.conflict(square,'Pătrat cu latura de 5 m'),'');
const rect=api.copy({id:'rectangle',values:{lungime:'8',latime:'5'},unit:'cm'});
assert.match(api.auto(rect),/lungimea 8 cm și lățimea 5 cm/);
const circle=api.copy({id:'circle',values:{raza:'3'},unit:'cm'});
assert.match(api.auto(circle),/raza 3 cm/);
assert.equal(api.conflict(circle,'Cerc raza 4 cm'),'raza');
assert.equal(api.auto(api.copy({id:'circle',values:{raza:'3',diametru:'6'}})),'','do not choose between redundant values without checking');
assert.equal(api.copy({id:'free'}).id,'free');
assert.deepEqual(Array.from(api.defaultVertices('triangle'),x=>x.length),[2,2,2]);
assert.deepEqual(Array.from(api.defaultVertices('right')[0]),[70,198]);
const point=api.projection([1,1,1],.4,.2);
assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y)&&Number.isFinite(point.z));
assert.ok(source.includes("geometry.onclick=mathOpenFigureLibrary"));
assert.ok(source.includes("mathFigureDraftSummary();"));
assert.ok(source.includes("Math.max(1,Math.min(4,working.zoom"));
assert.ok(source.includes("Math.max(-lim,Math.min(lim,working.panX"));
assert.ok(source.includes("active.size===2&&pinch"),'pinch zoom with two pointers');
assert.ok(source.includes("working.yaw+=dx*.014"),'3D rotates by drag');
assert.ok(source.includes("mode==='draw'"),'freehand drawing present');
assert.ok(source.includes("mode==='points'"),'vertex editing present');
assert.ok(source.includes("if(!source&&fromFigure)source=fromFigure"),'manual problem optional when known measurements suffice');
assert.ok(source.includes("else if(!source&&mode==='graph')source=mathFigureName"),'dimensionless figures may be graphed');
assert.ok(source.includes("const mismatch=mathFigureConflict(mathFigureDraft,source)"),'field/prose contradictions are checked');
assert.ok(source.includes("item.graphLesson={heading:mathFigureName(mathFigureDraft)"));
assert.ok(source.includes('mathFigureSnapshot(mathFigureDraft)'),'figure displayed in graph view');
assert.match(html,/\.math-figure-viewport\{[^}]*overflow:hidden/,'figure never escapes view window');
console.log('PASS geometry library: 2D/3D catalog, empty dimensions, conflict guards, clipped figures and gestures');
