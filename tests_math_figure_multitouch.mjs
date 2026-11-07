import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://math.test/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'math frontend script');
new vm.Script(script);
const start=script.indexOf('function mathFigureWorkbench()');
const end=script.indexOf('function openLearningSubject(',start);
assert.ok(start>0&&end>start);
const workbench=script.slice(start,end);
for(const figure of ['triangle','rectangle','square','circle','trapezoid','parallelogram','rhombus','pentagon','hexagon','ellipse','cylinder','cone','sphere','cube','prism'])
 assert.ok(workbench.includes("['"+figure+"'"),'missing '+figure);
for(const kind of ['scalene','equilateral','isosceles','right','acute','obtuse'])
 assert.ok(workbench.includes("['"+kind+"'"),'missing triangle subtype '+kind);
assert.match(workbench,/pointers\.size===2/,'pinch gesture for two fingers');
assert.match(workbench,/next\.length\/previousPinch\.length/,'pinch zoom ratio');
assert.match(workbench,/next\.angle-previousPinch\.angle/,'two-finger rotation');
assert.match(workbench,/pointers\.delete\(event\.pointerId\)/,'independent pointer release');
assert.match(workbench,/chooser\.showModal\(\)/,'second question dialog for triangle');
assert.match(workbench,/caption\(svg,210\+safeX\+x/,'labels rendered outside rotating polygon');
assert.match(workbench,/field\.placeholder='—'/,'empty measures allowed');
assert.match(workbench,/svg\.style\.touchAction='none'/,'prevent native zoom handling');
assert.ok(html.includes('.math-triangle-picker{'),'subtype dialog styled');
console.log('PASS math interactive figures: 15 figure options, triangle types, multitouch and upright labels');
