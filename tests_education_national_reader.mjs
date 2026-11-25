// Theory/Examples/Exercises/Test of national packs (History, Geography,
// Computing) open in the paged Education dialog used by Sciences on Android,
// fall back to the Literature overlay and, if no reader is painted, to the
// page itself. Regression for "nothing happens" on the Android APK.
import assert from 'node:assert/strict';
import {EDUCATION_NATIONAL_SUBJECT_PACKS_SCRIPT} from './education_national_subject_packs.mjs';
import {COMPUTING_NATIONAL_PACKS_SCRIPT} from './computing_national_packs.mjs';
const s=EDUCATION_NATIONAL_SUBJECT_PACKS_SCRIPT;
assert.match(s,/function eduNationalShowMaterial\(title,text,out,language\)/);
const fn=s.slice(s.indexOf('function eduNationalShowMaterial('));
assert.ok(fn.indexOf('educationOpenPagedLesson(')>0&&fn.indexOf('educationOpenPagedLesson(')<fn.indexOf('litShowMaterialReader('),'paged dialog first');
assert.match(fn,/elementFromPoint/,'visibility check');
assert.match(fn,/inline\(''\)/,'inline fallback');
assert.match(s,/eduNationalShowMaterial\(row\.title,material\.text,out,pack\.language\)/,'History/Geography use the shared opener');
assert.match(COMPUTING_NATIONAL_PACKS_SCRIPT,/eduNationalShowMaterial\(row\.title,material\.text,out,pack\.language\)/,'Computing uses the shared opener');
// The material call can never throw out of the click handler.
assert.match(s,/try\{material=literatureNationalYearMaterial\(/);
assert.match(COMPUTING_NATIONAL_PACKS_SCRIPT,/try\{material=literatureNationalYearMaterial\(/);
// Production bundles the Worker with esbuild, which renames module-level
// declarations also used as browser globals (foo -> foo2). Browser functions
// called across serialized scripts are emitted under explicit `var` names.
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
assert.match(s,/var eduNationalShowMaterial=function /);
assert.match(LITERATURE_TASK_UI_SCRIPT,/var renderStudyBlocks=function /);
assert.match(LITERATURE_TASK_UI_SCRIPT,/var literatureNationalYearMaterial=function /);
const frontend=(await import('./index.js')).default;
const html=await (await frontend.fetch(new Request('https://pocket.example/'))).text();
assert.ok(html.includes('function eduNationalShowMaterial(')&&html.includes('function educationOpenPagedLesson(title,body){'));
assert.ok(html.length<8_000_000);
console.log('PASS national pack reader: paged dialog → overlay → inline');
