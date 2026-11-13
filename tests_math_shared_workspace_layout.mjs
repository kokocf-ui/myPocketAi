import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

// Maths uses one workspace for every topic, school stage, grade and level.
const html=await(await frontend.fetch(new Request('https://math-layout.test/'))).text();
const script=html.split('<script>')[1]?.split('</script>')[0];
assert.ok(script,'frontend boot script');
new vm.Script(script);
const start=script.indexOf('function openLearningSubjectAfterCountry(key)');
const end=script.indexOf('// An OCR candidate is NEVER',start);
assert.ok(start>0&&end>start,'one shared subject workspace');
const workspace=script.slice(start,end);
assert.ok(workspace.includes("root.classList.add('math-workspace-header')"),'universal maths header');
assert.ok(workspace.includes('actionsRow.append(centeredTitle,back)'), 'Home, title, Back in the same row');
assert.ok(workspace.includes("voices.append(dictate,read);bar.append(voices)"), 'voice controls stay together');
assert.ok(workspace.includes("dictate.className='round-control math-utility-icon"), 'Dictate is assistant-style icon');
assert.ok(workspace.includes("read.className='round-control math-utility-icon"), 'Read is assistant-style icon');
assert.ok(workspace.includes("dictate.setAttribute('aria-label',dictate.title)"),'Dictate has accessible name');
assert.ok(workspace.includes("read.setAttribute('aria-label',read.title)"),'Read has accessible name');
assert.ok(workspace.includes('eduAttachPrintAction(bar);host.append(bar)'), 'Save and Print remain beside the voice icons');
assert.ok(!workspace.includes("const theory=document.createElement('button')"),'no redundant Theory button in exercises');
assert.ok(script.includes("theory.onclick=()=>educationTheoryOpen('math',mathJourney.level)"), 'Theory remains in the prior chapter menu');

const explain=workspace.indexOf("['explain',learningLabel(");
const solve=workspace.indexOf("['solve',learningLabel(");
const graph=workspace.indexOf("['graph',learningLabel(");
assert.ok(explain>=0&&explain<solve&&solve<graph,'Explain | Solve | Graph places Solve in the centre');
assert.ok(workspace.includes("'primary-btn math-action-solve'"),'central primary button has its own accent');
assert.ok(workspace.includes("button.onclick=()=>mathEducationRun(mode)"),'actions retain the real math engine');

const scoped=html.slice(html.indexOf('/* 2026-11-13: shared Maths workspace compact layout'));
assert.ok(scoped.includes('#view-module.learning-active.learning-math.math-workspace-header.active'), 'styles apply to every maths exercise');
assert.ok(scoped.includes('grid-column:1/-1!important;grid-row:1!important'), 'header spans the entire screen');
assert.ok(scoped.includes('grid-template-columns:minmax(0,1fr) minmax(0,1.2fr) minmax(0,1fr)'), 'balanced three-column header');
assert.ok(scoped.includes('grid-template-columns:minmax(0,1fr) auto!important'), 'voice/print icons share one row');
assert.ok(scoped.includes('grid-template-columns:repeat(3,minmax(0,1fr))'), 'three equal action buttons');
assert.ok(scoped.includes('.education-math-actions>button.math-action-solve'), 'only central Solve is burgundy');
assert.ok(scoped.includes('overflow-y:auto!important'), 'exercise panel remains scrollable');
assert.ok(!scoped.split('</style>')[0].includes('.math-theory-list-mode'),'new compact rules do not affect the standalone theory modal');
console.log('PASS universal mathematics layout: all years/topics, top navigation, four icons, centred burgundy solve and internal scroll');
