import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';

const html=await(await frontend.fetch(new Request('https://literature-focus.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Generated app must have browser script');
new vm.Script(script,{filename:'myPocketAI-literature.js'});
assert.match(html,/id="literature-one-screen-ui"/,'Scoped layout stylesheet');
assert.match(html,/#view-module\.learning-literature\.learning-active #moduleContent\{[^}]*overflow:hidden!important/s,
 'Main literature page must be a fixed viewport');
assert.match(html,/#view-module\.learning-literature \.lit-panel\{[^}]*overflow-y:auto!important/s,
 'Only inner literature panel scrolls');
assert.match(html,/\.lit-options\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/s,
 'Activity cards should form a two-column grid');
assert.match(script,/const LIT_BRANCHES=\[\{id:'program'/,'Grade-specific programme is the first study activity');
for(const type of ['grammar','vocabulary','analysis','literature','writing','assessment']){
 assert.ok(script.includes("id:'"+type+"'"),'Missing category '+type);
}
assert.match(script,/c\.id==='literature'\?'workspace':'topics'/,'Literature opens directly into work lookup');
assert.match(script,/if\(stage==='workspace'\)litSimpleWorkspace\(panel\)/,'Old universal essay form is bypassed');
assert.match(script,/if\(litJourney\.stage==='workspace'&&litJourney\.branch==='literature'\)/,
 'Back from literary work selection returns to categories');
assert.match(script,/if\(typeof litFitWindow==='function'\)requestAnimationFrame\(litFitWindow\)/);
assert.match(LITERATURE_TASK_UI_SCRIPT,/function litSimpleWorkspace\(panel\)/);
assert.match(LITERATURE_TASK_UI_SCRIPT,/function litSimpleLiterature\(panel\)/);
assert.match(LITERATURE_TASK_UI_SCRIPT,/litSimpleGenerate\(out,feedback,mode/,'Study and essay buttons must execute the AI request');
assert.match(LITERATURE_TASK_UI_SCRIPT,/if\(!response\.ok\|\|data\.status!=='success'/,
 'Response must be checked before claiming a generated essay');
assert.match(LITERATURE_TASK_UI_SCRIPT,/rows=\(data\.docs\|\|\[\]\)\.flatMap/,
 'Search results must be publisher metadata, not invented author matching');
assert.match(LITERATURE_TASK_UI_SCRIPT,/fold\(x\.title\)===fold\(name\)/,
 'Only exact work title matches appear (avoid unrelated literature)');
assert.match(LITERATURE_TASK_UI_SCRIPT,/search\/authors\.json\?q=/,
 'Searching by an author name must use author lookup, not only title lookup');
assert.match(LITERATURE_TASK_UI_SCRIPT,/works\.json\?limit=50/,
 'Author search must provide bibliography from that author works');
assert.match(LITERATURE_TASK_UI_SCRIPT,/Alte opere/,
 'Author works must be paginated rather than silently truncated');
assert.match(LITERATURE_TASK_UI_SCRIPT,/const buttons=branch==='analysis'/,
 'Grammar and analysis must have distinct controls');
assert.match(LITERATURE_TASK_UI_SCRIPT,/if\(!needsInput\)run\('lesson'\)/,
 'Opening grammar lesson directly loads the theory');
assert.match(LITERATURE_TASK_UI_SCRIPT,/const country=educationCountrySelection\.label\|\|litJourney\.country/,
 'Selected country retained across literary activities');
assert.match(LITERATURE_TASK_UI_SCRIPT,/out\.scrollIntoView\(\{behavior:'auto',block:'nearest'\}\)/,
 'Generated material is scrolled into view inside active workspace');
assert.ok(!LITERATURE_TASK_UI_SCRIPT.includes('coordinates')&&!LITERATURE_TASK_UI_SCRIPT.includes('requestUsesLocation('));
console.log('PASS: separated language/literature modes, exact bibliography, direct actions, fixed single-screen UI');
