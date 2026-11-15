import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const source=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(source,'web application script must be present');
new vm.Script(source);
assert.match(source,/const LEARNING_SUBJECTS=/);
assert.match(source,/renderLearningSubjects\(\)/);
assert.match(source,/PocketAndroidOCR\.postMessage\(key==='math'&&nativeMathOcrSupported\(\)\?'camera:math':'camera'\)/);
assert.match(source,/PocketAndroidOCR\.postMessage\(key==='math'&&nativeMathOcrSupported\(\)\?'gallery:math':'gallery'\)/);
assert.match(source,/window\.pocketAndroidOcrResult/);
assert.match(html,/education-grid/);
assert.match(html,/learning-choose/);
const manifest=fs.readFileSync('android/app/src/main/AndroidManifest.xml','utf8');
const main=fs.readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
const gradle=fs.readFileSync('android/app/build.gradle','utf8');
assert.match(manifest,/android\.permission\.INTERNET/);
assert.match(main,/TextRecognition\.getClient/);
assert.match(main,/PocketAndroidMathOCR/,'math OCR capability is exposed only by new APKs');
assert.match(main,/WebViewCompat\.addWebMessageListener/);
assert.match(main,/isMainFrame/);
assert.match(main,/PickVisualMedia/);
assert.match(main,/ACTION_IMAGE_CAPTURE/);
assert.match(gradle,/com\.google\.mlkit:text-recognition/);
assert.match(main,/scanEducationMathRegions\(/,'math OCR scans two overlapping image regions');
assert.match(main,/height\*0\.63f/,'portrait regions overlap instead of cutting rows');
assert.match(main,/width\*0\.63f/,'landscape regions overlap instead of cutting columns');
assert.match(main,/firstRead\[0\],secondRead\[0\]/,'both region readings included in OCR review');
assert.match(main,/educationMathPlausible\(selected\)\?"review":"partial"/,'OCR still requires review');

assert.match(source,/function eduOpenPrint\(mode='save'\)/);
assert.match(source,/PocketAndroidPrint\.postMessage/);
assert.match(main,/PocketAndroidPrint/);
assert.match(main,/PrintManager/);
assert.match(source,/edu-pdf-save/,'separate PDF save button');
assert.match(source,/edu-pdf-print/,'separate print button');
assert.match(source,/mode==='print'/);
assert.match(main,/getFilesDir\(\)/,'private Android folder');
assert.match(main,/documentele_mele/,'internal documents directory');
assert.match(main,/new FileOutputStream\(destination\)/,'native PDF saved to private storage');
assert.match(main,/PdfDocument/,'genuine PDF format');
assert.match(main,/if\("print"\.equals\(data\.optString\("mode","save"\)\)\)printSavedEducationPdf\(output,title\)/,'print only saved PDF');
assert.match(main,/new java\.io\.FileInputStream\(savedPdf\)/,'print exact saved PDF bytes');
assert.match(main,/PocketAndroidDocuments/,'native library bridge');
assert.match(source,/function renderMyDocuments\(\)/,'documents list in tools menu');
assert.match(source,/my-documents/,'documents entry in tools');
assert.match(source,/edu-pdf-save/,'Save PDF button');
assert.match(source,/edu-pdf-print/,'Print button');

assert.match(main,/getOnBackPressedDispatcher\(\)\.addCallback/,'Android hardware back is delegated to the frontend');
assert.match(main,/window\.pocketAndroidBack/,'Native back delegates exactly to shared JS navigation');
// Reproduce two nested Mathematics dialogs: page reader must close first,
// then the theory catalogue; neither Back may invoke Eva's exit question.
const from=source.indexOf('window.pocketAndroidBack=function(){');
const until=source.indexOf('\n\nconst LEARNING_SUBJECTS=',from);
assert.ok(from>0&&until>from,'Android Back controller remains present in frontend');
const backHandler=source.slice(from,until);
assert.match(backHandler,/educationPagedLessonDialog/,'Paged lesson must be first priority');
const events=[];
const fakeDialog=name=>({open:true,close(){this.open=false;events.push(name)}});
const paged=fakeDialog('paged');
const theory=fakeDialog('theory');
const map={educationPagedLessonDialog:paged,educationTheoryDialog:theory};
const context={
 window:{},document:{
  getElementById:id=>map[id]||null,
  querySelectorAll:()=>[],
  querySelector:()=>null
 },
 $:()=>null,
 state:{currentView:'module',currentModule:'learning'},
 pocketExitOpen:false,
 activeRouteMap:null,activeAnswerReader:null,
 pocketBackInsideModule:()=>{events.push('math-navigation');return true},
 pocketExitPrompt:()=>events.push('EXIT_QUESTION'),
 showView:v=>events.push('show-'+v)
};
vm.runInNewContext(backHandler,context);
context.window.pocketAndroidBack();
assert.deepEqual(events,['paged'],'First hardware Back closes only visible Mathematics lesson');
assert.equal(theory.open,true,'Theory catalogue stays behind the page reader');
context.window.pocketAndroidBack();
assert.deepEqual(events,['paged','theory'],'Second Back closes theory catalogue, not the app');
context.window.pocketAndroidBack();
assert.deepEqual(events,['paged','theory','math-navigation'],'Third Back uses module navigation');
const physics=fakeDialog('physics');
context.document.querySelectorAll=()=>[physics];
context.window.pocketAndroidBack();
assert.equal(events.at(-1),'physics','Other Education theory dialogs obey Back too');
context.document.querySelectorAll=()=>[];
context.state.currentView='home';
context.window.pocketAndroidBack();
assert.equal(events.at(-1),'EXIT_QUESTION','Only Home may request closing Eva');
assert.equal(events.filter(x=>x==='EXIT_QUESTION').length,1);

console.log('PASS education UI embedded JS syntax and Android native OCR integration contracts');
