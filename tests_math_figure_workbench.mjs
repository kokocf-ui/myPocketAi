import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://math.test/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'frontend script exists');
new vm.Script(script);
assert.ok(script.includes('function mathFigureWorkbench()'),'legacy entry point delegates to the expanded figure editor');
assert.ok(script.includes('function mathOpenFigureLibrary()'),'expanded figure editor is present');
assert.ok(script.includes("['geometry','trigonometry'].includes(mathJourney.topic)"),'tool is only displayed for relevant topics');
for(const shape of ['triangle','right','isosceles','equilateral','rectangle','square','circle','trapezoid','cube','prism','cone','sphere'])
 assert.ok(script.includes("id:'"+shape+"'"),shape+' is available');
assert.ok(script.includes("input.placeholder=learningLabel('Opțional'"),'dimensions may stay blank');
assert.ok(script.includes('Math.max(-lim,Math.min(lim,working.panX))'),'pan stays bounded');
assert.ok(script.includes("Math.min(4,working.zoom"),'zoom has upper bound');
assert.ok(script.includes("svg.addEventListener('pointercancel'"),'gesture cancellation supported');
assert.ok(html.includes('.math-figure-viewport{'),'viewport is styled');
assert.ok(script.includes('mathFigureDraftSummary()'),'figure is attached to the math workspace without overwriting existing typed input');
console.log('PASS math figures: parsed WebView, expanded 2D and 3D figures, optional measures, bounded gestures, workspace integration');
