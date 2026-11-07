import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://math.test/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'frontend script exists');
new vm.Script(script);
assert.ok(script.includes('function mathFigureWorkbench()'),'figure editor is present');
assert.ok(script.includes("mathJourney.topic==='geometry'||mathJourney.topic==='trigonometry'"),'tool is only displayed for relevant topics');
for(const shape of ['triangle','rectangle','square','circle','trapezoid','cube','prism'])
 assert.ok(script.includes("['"+shape+"'"),shape+' is available');
assert.ok(script.includes("field.placeholder='—'"),'dimensions may stay blank');
assert.ok(script.includes('Math.max(-110,Math.min(110,state3.x))'),'pan stays bounded');
assert.ok(script.includes("Math.min(2.2,state3.zoom+.15)"),'zoom has upper bound');
assert.ok(script.includes("svg.addEventListener('pointercancel'"),'gesture cancellation supported');
assert.ok(html.includes('.math-figure-viewport{'),'viewport is styled');
assert.ok(script.includes("mathRememberDraft(field.value)"),'existing exercise input receives inserted figure');
console.log('PASS math figures: parsed WebView, 7 figures, optional measures, bounded gestures, workspace integration');
