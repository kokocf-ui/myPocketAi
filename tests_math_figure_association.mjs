import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://test.math/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'frontend script');
new vm.Script(script);
const helperStart=script.indexOf('function mathFigureStripAutoStatements(');
const helperEnd=script.indexOf('function mathFigureDefaultVertices(',helperStart);
assert.ok(helperStart>0&&helperEnd>helperStart);
const api=vm.runInNewContext(script.slice(helperStart,helperEnd)+'\n({strip:mathFigureStripAutoStatements,insert:mathFigureInsertStatement})',{
 document:{getElementById:()=>globalThis.__mathTestField},
 mathFigureStatement:f=>'Figura: '+f.name+'. Date: '+f.measure+'.',
 mathRememberDraft:()=>{},
 Event:class {constructor(type){this.type=type}}
});
const field={value:'Figura: Triunghi oarecare. Date: dimensiuni neprecizate.\nFigura: Triunghi isoscel. Date: dimensiuni neprecizate.\nCalculează aria și perimetrul pătratului.',dataset:{},dispatchEvent:()=>{}};
globalThis.__mathTestField=field;
api.insert({name:'Pătrat',measure:'latura = 6 cm'});
assert.equal(field.value,'Figura: Pătrat. Date: latura = 6 cm.\nCalculează aria și perimetrul pătratului.');
api.insert({name:'Pătrat',measure:'latura = 8 cm'});
assert.equal(field.value,'Figura: Pătrat. Date: latura = 8 cm.\nCalculează aria și perimetrul pătratului.');
delete globalThis.__mathTestField;
assert.ok(script.includes("[source]:mathSplitExercises(source)"),'a selected figure and its question become one tab');
assert.ok(script.includes("figure:mathFigureDraft&&"),'snapshot figure at run time');
assert.ok(script.includes('attachedFigure=session.figure'),'render diagram from current session not global mutable selection');
assert.ok(script.includes("if(mode!=='graph'&&!original)"),'a figure without a question cannot trigger invented calculations');
console.log('PASS math figure association: stale headers removed, one exercise, stable figure, no guessed question');
