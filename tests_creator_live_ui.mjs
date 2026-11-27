import assert from 'node:assert/strict';
import vm from 'node:vm';
import {CREATOR_BUSINESS_SCRIPT} from './creator_business_profiles.mjs';
import {EXTRA_TOOLS_WORKSPACE_SCRIPT} from './extra_tools_workspace.mjs';
import {CREATOR_SITE_AI_SCRIPT} from './creator_site_ai.mjs';
import {CREATOR_IMAGE_AI_SCRIPT} from './creator_image_ai.mjs';
import {CREATOR_SITE_SCRIPT} from './creator_site_ui.mjs';
new vm.Script(EXTRA_TOOLS_WORKSPACE_SCRIPT,{filename:'Tools creator combined JS'});
assert.ok(EXTRA_TOOLS_WORKSPACE_SCRIPT.includes(CREATOR_IMAGE_AI_SCRIPT),'Creator image AI must be included in the Tools workspace');
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/function extraCreatorWorkingWebsite/);
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/function extraCreatorWorkingImages/);
assert.match(CREATOR_SITE_AI_SCRIPT,/lifewise-ai-creator-preview\.kokocf\.workers\.dev\/site/);
assert.match(CREATOR_SITE_SCRIPT,/extraCreatorWorkingWebsite\(work\)/);
assert.match(CREATOR_SITE_SCRIPT,/extraCreatorWorkingImages\(work\)/);
const f=new Function(CREATOR_BUSINESS_SCRIPT+CREATOR_SITE_AI_SCRIPT+';return {parse:extraCreatorParseAI,prompt:extraCreatorAiSitePrompt,call:extraCreatorCallAiWebsite};')();
const valid=JSON.stringify({ro:{headline:'Cazare la Aramis',intro:'Bine ați venit.',about:'Mic dejun inclus.',
 services:[{title:'Camere single',detail:'5 camere single'},{title:'Apartamente',detail:'3 apartamente'}]},
 en:{headline:'Stay at Aramis',intro:'Welcome',about:'Breakfast included',services:[]}});
const ro=f.parse(valid,'ro'),bilingual=f.parse(valid,'both');
assert.equal(ro.ro.services.length,2);assert.equal(bilingual.en.headline,'Stay at Aramis');
assert.equal(f.parse('{invalid','ro'),null);
assert.equal(f.parse('{"ro":{"headline":"a"}}','ro'),null);
assert.equal(f.parse(JSON.stringify({ro:{headline:'a',intro:'b',about:'c'}}),'both'),null);
const prompt=f.prompt({name:'Aramis',kind:'hotel',description:'5 rooms single; 10 rooms double; breakfast included',style:'mediteranean',lang:'both'});
assert.match(prompt,/ONLY supplied|ONLY actual|STRICT/i);
assert.match(prompt,/ro AND en/);
assert.ok(prompt.length<=3950);
let called=false;
globalThis.CLIENT_CONFIG={apiUrl:'https://example.test/api/chat'};
globalThis.fetch=async(_,options)=>{
 called=true;
 const data=JSON.parse(options.body);
 assert.equal(data.name,'Aramis');
 assert.equal(data.lang,'both');
 assert.match(options.headers['X-Pocket-Preview'],/1/);
 return new Response(JSON.stringify({status:'success',reply:valid}),{status:200,headers:{'Content-Type':'application/json'}});
};
const copy=await f.call({name:'Aramis',kind:'hotel',description:'Rooms and breakfast',style:'mediteranean',lang:'both'},new AbortController().signal);
assert.ok(called);assert.equal(copy.en.headline,'Stay at Aramis');
assert.match(CREATOR_IMAGE_AI_SCRIPT,/Imagini AI: /,'Short per-installation quota is displayed');
assert.match(CREATOR_IMAGE_AI_SCRIPT,/reset 00:00 UTC/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/lifewise-ai-image-studio\.kokocf\.workers\.dev\/generate/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/lifewise-ai-image-studio\.kokocf\.workers\.dev\/edit/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/function evaCreatorPhotoTabs/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/album\.onchange/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/camera\.onchange/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/extraCreatorSaveImage\(work,status\)/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/format:providerFormat/,'4:3 and 3:4 are generated square and cropped locally');
assert.match(CREATOR_IMAGE_AI_SCRIPT,/extraCreatorImageCanvas\(data.image,f.format.value\)/);

const art=new Function(CREATOR_IMAGE_AI_SCRIPT+';return {styles:EVA_IMAGE_STYLES,prompt:extraCreatorEnhancedPrompt};')();
assert.equal(art.styles.length,26,'All 26 artistic styles must exist in the live image module');
assert.equal(new Set(art.styles.map(row=>row[0])).size,26,'Every image style must have a unique identifier');
const artisticPrompt=art.prompt('O casă lângă un lac','full','landscape43',{
 artStyle:{value:'watercolor'},mood:{value:'calm'},lighting:{value:'golden'},
 palette:{value:'pastel'},avoid:{value:'sigle'}
});
assert.match(artisticPrompt,/watercolour painting/);
assert.match(artisticPrompt,/golden-hour/);
assert.match(artisticPrompt,/pastel/);
assert.match(artisticPrompt,/Avoid: sigle/);
assert.match(artisticPrompt,/Landscape 4:3 framing/);
assert.match(CREATOR_SITE_SCRIPT,/Stil artistic/);
assert.match(CREATOR_SITE_SCRIPT,/Atmosferă, lumină, culori și detalii/);
assert.match(CREATOR_SITE_SCRIPT,/Portrait · 3:4/);
assert.doesNotMatch(CREATOR_SITE_SCRIPT,/Generarea imaginilor nu este încă activă/);
assert.doesNotMatch(CREATOR_SITE_SCRIPT,/Motorul AI de imagini nu este conectat/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/status.hidden=true/,'No duplicate verbose status before generation');

assert.match(CREATOR_IMAGE_AI_SCRIPT,/evaImageQuotaUrl/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/evaImageInstallationId/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/localStorage\.setItem\(key,next\)/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/installationId:work\.evaImageInstallId/g);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/dailyLimit/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/personalRemaining/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/evaImageQuotaUpdate/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/PREVIEW|preview_capacity_reached|installation_limit_reached/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/eva-image-quota-status/);
const fId=CREATOR_IMAGE_AI_SCRIPT.match(/function evaImageInstallationId\(\)\{[\s\S]*?\n\}/)?.[0];
assert.ok(fId,'Installation identity helper must exist');
const saved=new Map();let creations=0;
const localStorageStub={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)};
const createId=new Function('localStorage','globalThis',fId+';return evaImageInstallationId;')(
 localStorageStub,{crypto:{randomUUID:()=>{creations++;return '00000000-0000-4000-8000-000000000101'}}});
assert.equal(createId(),'00000000-0000-4000-8000-000000000101');
assert.equal(createId(),'00000000-0000-4000-8000-000000000101');
assert.equal(creations,1,'Stable quota identifier survives workspace reopen on same installation');

assert.match(CREATOR_IMAGE_AI_SCRIPT,/function evaImageCompactPrompt/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/evaImageCompactPrompt\(f\.imagePrompt\)/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/evaImageCompactPrompt\(prompt\)/);
const scenes=new Function(CREATOR_IMAGE_AI_SCRIPT+';return {prompt:extraCreatorEnhancedPrompt,background:extraCreatorSceneBackground};')();
const templar='Creează un cavaler templier, călare pe o cămilă, într-un deșert cu o cetate în fundal.';
assert.equal(scenes.background(templar),'o cetate','User-requested castle must be extracted as background requirement');
const enhanced=scenes.prompt(templar,'full','portrait');
assert.match(enhanced,/REQUIRED VISIBLE BACKGROUND: o cetate/);
assert.match(enhanced,/cavaler templier/i);
assert.match(enhanced,/on the camel/i);
assert.match(enhanced,/Vertical 9:16/i);
assert.ok(enhanced.length<=1400,'Keep augmented prompt under provider limit');
assert.match(scenes.prompt('A red bicycle next to a blue wall','wide','wide'),/red bicycle next to a blue wall/);
assert.doesNotMatch(scenes.prompt('A red bicycle next to a blue wall','wide','wide'),/REQUIRED VISIBLE BACKGROUND/,'Do not invent background objects');
assert.match(scenes.prompt('A medieval fortress on the horizon with a blue sky','wide','square'),/medieval fortress/);
assert.throws(()=>scenes.prompt('x'.repeat(801),'full','square'),/invalid_prompt_length/);

assert.match(CREATOR_IMAGE_AI_SCRIPT,/PocketAndroidImages/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/save\.disabled=false/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/preview_limit_reached/,'Image quota errors are handled without spending more credits');
console.log('PASS creator: genuine Eva AI request + validated bilingual copy, image preview limit, Gallery integration and no false AI success');
