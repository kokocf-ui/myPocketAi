import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
import {readFileSync} from 'node:fs';

const html=await(await frontend.fetch(new Request('https://edu-documents-regression.test/'))).text();
const boot=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(boot,'App boot script must render');
new vm.Script(boot,{filename:'pocket-edu-reader-docs.js'});
new vm.Script(LITERATURE_TASK_UI_SCRIPT,{filename:'pocket-literature-reader.js'});

assert.match(html,/id="lit-reader-documents-fix"/,'Reader and document styles must be loaded');
assert.match(html,/\.lit-material-reader\[open\]\{display:flex!important\}/,'Reader must open as independent modal');
assert.match(html,/\.lit-material-reader \.lit-reader-scroll\{[\s\S]*?overflow:auto!important/,'Reader text must scroll inside the overlay');
assert.match(html,/\.lit-material-reader \.lit-reader-footer\{[\s\S]*?grid-template-columns:1fr 1fr!important/,'Reader Save and Print share the footer');
assert.match(html,/#view-module\.learning-literature \.lit-toolbar\{[\s\S]*?grid-template-columns:minmax\(106px,\.82fr\)/,'Back row matches Home header geometry');
assert.match(html,/#view-module\.learning-literature \.lit-toolbar>\.edu-pdf-actions\{[\s\S]*?grid-column:2!important/,'PDF icons are right-aligned and uncropped');

assert.match(LITERATURE_TASK_UI_SCRIPT,/function litShowMaterialReader\(title,text\)/);
assert.match(LITERATURE_TASK_UI_SCRIPT,/dialog\.showModal\(\)/,'Reader opens as overlay');
assert.match(LITERATURE_TASK_UI_SCRIPT,/litShowMaterialReader\(title\+' · '/,'Lessons open in reader after actual result');
assert.match(LITERATURE_TASK_UI_SCRIPT,/litShowMaterialReader\(chosen\.name\+' — '/,'Literary studies and essays use same reader');
assert.match(LITERATURE_TASK_UI_SCRIPT,/litShowMaterialReader\(litSimpleLabel\('Corectarea/,'Corrected exercises use the reader');
assert.match(LITERATURE_TASK_UI_SCRIPT,/eduOpenPrint\('save',material\)/,'Reader Save passes the exact lesson');
assert.match(LITERATURE_TASK_UI_SCRIPT,/eduOpenPrint\('print',material\)/,'Reader Print passes the exact lesson');

assert.match(boot,/function resetExtraToolsScreen\(\)/,'Explicit reset of inherited learning state');
for(const oldClass of ['learning-literature','learning-hg','learning-math','learning-active']){
 assert.ok(boot.includes("'"+oldClass+"'"),'Restore document view by clearing '+oldClass);
}
assert.match(boot,/function renderMyDocuments\(\)\{\s*resetExtraToolsScreen\(\)/,'My Documents must not inherit Education grid');
assert.match(boot,/root\.classList\.add\('extra-tools-active','my-documents-active'\)/,'Documents have a dedicated full-width layout');
assert.match(boot,/back\.textContent=learningLabel\('← Înapoi','← Back'\);back\.onclick=renderExtraToolsChoices/,'Back button returns from Documents to Tools');
assert.match(html,/#view-module\.my-documents-active #moduleContent\{[\s\S]*?grid-column:1\/-1!important/,'Documents use entire width rather than left column');
assert.match(html,/#view-module\.my-documents-active \.my-documents-batch\{[\s\S]*?display:flex!important/,'Print/share/delete actions remain visible');
assert.match(html,/id="pdf-library-viewport-fix"/,'My Documents must use a dedicated scroll viewport');
assert.match(html,/#view-module\.my-documents-active\.active\{[\s\S]*?height:calc\(100dvh - 265px\)!important/,'Library area extends to the bottom navigation instead of clipping halfway');
assert.match(html,/#view-module\.my-documents-active \.my-documents-list\{[\s\S]*?overflow-y:auto!important/,'The PDF rows scroll independently');
assert.match(boot,/window\.PocketAndroidDocuments\.postMessage\('list'\)/,'Document list is fetched from Android storage');
assert.match(boot,/window\.PocketAndroidDocuments\?\.postMessage\('print:'/);
assert.match(boot,/share-many:'\+JSON\.stringify\(names\)/);
assert.match(boot,/window\.PocketAndroidDocuments\?\.postMessage\('delete-many:'/);

const pdf=boot.slice(boot.indexOf("function eduOpenPrint(mode='save')"),boot.indexOf("function eduAttachPrintAction(bar)"));
assert.ok(pdf.length>1000);
assert.match(pdf,/if\(state==='saved'\)/,'Only a native success event confirms save');
assert.doesNotMatch(pdf,/document\.createElement\('dialog'\)/,'Do not open a second save/print dialog after tapping the reader action');
assert.doesNotMatch(pdf,/dialog\.showModal\(\)/,'No duplicate PDF modal');
assert.match(pdf,/eduPdfExportPending=true/,'Prevent repeated direct export taps');
assert.match(pdf,/window\.pocketEduPrintResult=state=>/,'Native result callback remains wired');
assert.match(pdf,/mode:mode==='print'\?'print':'save'/,'Printing still saves PDF first through the native bridge');
assert.match(pdf,/window\.PocketAndroidPrint\.postMessage/,'Native bridge remains the source of PDF success');
assert.match(pdf,/PocketAndroidPrint/);
assert.match(boot,/const lesson=root\.querySelector\('\.lit-activity-heading'\)/,'PDF filename includes lesson');
const java=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/MainActivity.java',import.meta.url),'utf8');
assert.match(java,/new File\(getFilesDir\(\),"documentele_mele"\)/,'Saved files are private native PDFs');
assert.match(java,/notifyEducationPdf\("saved"\)/,'Android acknowledges save only after success');
assert.match(java,/if\("list"\.equals\(request\)\)listEducationDocuments\(\)/,'Library bridge returns saved files');

console.log('PASS: full-screen reader, full-height PDF list, direct export without duplicate modal, native save confirmation');
