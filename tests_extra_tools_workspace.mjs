import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import app from './index.js';
import {EXTRA_TOOLS_WORKSPACE_SCRIPT,EXTRA_TOOLS_WORKSPACE_STYLE} from './extra_tools_workspace.mjs';
import {CREATOR_IMAGE_AI_SCRIPT} from './creator_image_ai.mjs';
import {CREATOR_SITE_SCRIPT} from './creator_site_ui.mjs';
import {EXAM_LOCAL_BANK} from './exam_practice_bank.mjs';
import {EXAM_SUBJECTS} from './exam_curriculum_europe.mjs';

new vm.Script(EXTRA_TOOLS_WORKSPACE_SCRIPT,{filename:'extra-tools-workspace.js'});
const pure=new Function(EXTRA_TOOLS_WORKSPACE_SCRIPT+';return {numbers:extraToolsNumbers,stats:extraToolsStats};')();
assert.deepEqual(pure.numbers('10; 12,5; 14'),[10,12.5,14]);
assert.deepEqual(pure.numbers('1 2 3'),[1,2,3]);
assert.equal(pure.numbers('1+1;2'),null,'Do not evaluate code as arithmetic');
assert.equal(pure.numbers('Infinity'),null);
assert.equal(pure.stats([2,4,8,10]).median,6);
assert.equal(pure.stats([2,4,8,10]).avg,6);
assert.equal(pure.stats([2,4,8,10]).sum,24);
assert.equal(pure.stats([4,3,2]).median,3);

const missing=['native','foreign','french','german','polish','portuguese','italian','spanish','dutch','art','music','oral'];
assert.equal(EXAM_SUBJECTS.length,24,'Exam subject catalogue remains intact');
for(const item of EXAM_SUBJECTS){
 const questions=EXAM_LOCAL_BANK[item.id];
 assert.ok(Array.isArray(questions)&&questions.length>=4,'Local practice absent for '+item.id);
}
for(const key of missing){
 const questions=EXAM_LOCAL_BANK[key];
 assert.equal(questions.length,5,key+' must have five original local practice items');
 for(const q of questions){
  assert.ok(q.prompt.length>18&&q.explanation.length>14);
  assert.equal(q.choices.length,4);
  assert.equal(new Set(q.choices).size,4);
  assert.equal(q.choices[q.correct]?.length>0,true);
 }
}
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/function extraToolsOpenWorkspace\(key\)/);
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/function extraToolsAI\(/);
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/function extraToolsOCRHandle\(payload\)/);
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/function extraToolsVoiceHandleAndroid\(data\)/);
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/mode:'extraTools'/,'Dictation has independent native mode');
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/new URL\(url\.value\.trim\(\)\)/);
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/\['http:','https:'\]/);
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/type:'other',base64/,'Native OCR uses the preexisting local image recognition bridge');
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/extraToolsStatistics\(editor\.value,chart\)/);
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/eduAttachPrintAction\(header\)/,'Native PDF creation available in workspaces');
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/function extraCreatorHome\(work\)/,'Approved creator landing screen remains active');
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/if\(key==='creator'\)/,'Creator has a dedicated workspace');
assert.doesNotMatch(EXTRA_TOOLS_WORKSPACE_SCRIPT,/else if\(key==='images'\)/,'Obsolete image editor UI must not exist');
assert.match(CREATOR_SITE_SCRIPT,/extraCreatorWorkingWebsite/,'Site builder is integrated');
assert.match(CREATOR_IMAGE_AI_SCRIPT,/extraCreatorWorkingImages\(work\)/,'Image generator is integrated');
assert.match(EXTRA_TOOLS_WORKSPACE_STYLE,/\.extra-tools-workarea\{/,'Workspace is independent scroller');
const response=await app.fetch(new Request('https://tool-workspace.test/'));
assert.equal(response.status,200);
const html=await response.text();
const boot=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(boot&&boot.length>100000,'Embedded frontend script');
new vm.Script(boot,{filename:'tools-boot.js'});
assert.match(boot,/extraToolsOpenWorkspace\(key\)/);
assert.match(boot,/extraCreatorWorkingImages\(work\)/);
assert.match(boot,/extraCreatorWorkingWebsite\(work\)/);
assert.match(html,/Creare pagini și imagini/);
assert.doesNotMatch(boot,/\['images','🖼️','Imagini și design'/,'The obsolete catalogue entry is removed');
assert.match(boot,/if\(extraToolsOCRHandle\(payload\)\)return/);
assert.match(boot,/if\(extraToolsVoiceHandleAndroid\(data\)\)return/);
assert.match(boot,/extraToolsStop\(\);mathVoiceStop\(\)/);
assert.match(html,/#view-module\.extra-tools-workspace\.active/,'App has isolated Tools layout');
assert.ok(boot.includes("if(key==='my-documents'){renderMyDocuments();return}"),'Native PDF library is preserved');
assert.ok(boot.includes("EXTRA_TOOLS_CATEGORIES.forEach(cat=>"),'Nine original cards are preserved');
const android=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/MainActivity.java',import.meta.url),'utf8');
assert.match(android,/boolean textSelection=requestedTypes\.contains\("text\/"\)/,'Text and JSON files use the native text chooser');
assert.match(android,/pick\.putExtra\(Intent\.EXTRA_MIME_TYPES,new String\[\]\{"text\/plain"/,'Text file MIME types included');
assert.match(android,/WebViewCompat\.addWebMessageListener\(web,"PocketAndroidImages"/,'Native image save bridge');
assert.match(android,/MediaStore\.Images\.Media\.EXTERNAL_CONTENT_URI/,'PNG is saved with Android MediaStore');
assert.match(CREATOR_IMAGE_AI_SCRIPT,/PocketAndroidImages/,'Creator image export invokes Android Gallery');
console.log('PASS creator restored; legacy UI removed; eight Tools, native gallery, OCR, PDFs, exams and browser boot preserved');
