import assert from 'node:assert/strict';
import vm from 'node:vm';
import {STUDIO_ADMIN_HTML} from './studio_admin_portal.mjs';
import {EXTRA_TOOLS_WORKSPACE_SCRIPT} from './extra_tools_workspace.mjs';
import {CREATOR_HANDOFF_SCRIPT} from './creator_site_handoff.mjs';
import {CREATOR_IMAGE_AI_SCRIPT} from './creator_image_ai.mjs';
const script=STUDIO_ADMIN_HTML.match(/<script nonce="__STUDIO_NONCE__">([\s\S]*?)<\/script>/)?.[1];
assert.ok(script&&script.length>8000,'Standalone admin portal must contain complete UI');
new vm.Script(script,{filename:'site-studio-browser.js'});
assert.match(script,/Importă proiect Pocket AI/);
assert.match(script,/mypocket-studio-project-v1/);
assert.match(script,/renderEditor\(null,\{draft:body.draft,management:body.management\}\)/);
assert.match(script,/end-maintenance/);
assert.match(script,/mgmt-mode/);
assert.match(script,/Solicită o modificare/);
assert.match(script,/👁 Previzualizează/);
assert.match(script,/🌐 Publică versiunea salvată/);
assert.match(script,/file.size>3200000/);
assert.ok(!script.includes("fetch(result.image)"),'CSP-restricted data URLs must not be fetched');
assert.ok(script.includes("atob(encoded)"),'AI photos are decoded locally without making network calls');
const f=new Function(EXTRA_TOOLS_WORKSPACE_SCRIPT+';return {handoff:extraCreatorHandoffData,siteDetails:extraCreatorSiteDetails,enhance:extraCreatorEnhancedPrompt};')();
const form={
 name:{value:'Aramis'},desc:{value:'Pensiune cu 5 camere single, 10 camere duble si 3 apartamente. Mic dejun inclus. Bucătărie comună.'},
 type:{value:'hotel'},extra:{value:'Elegant'},lang:{value:'both'},
 contact:{value:'info@example.test'},
 getStyle:()=>({id:'heritage',ro:'Asimetric boutique'}),
 getManagement:()=>({mode:'shared',client:'Aramis',creator:'Creator',monthly:'45',currency:'GBP',edits:'4',response:'3',extras:'8',notice:'30',hosting:'owner',backups:'monthly'})
};
const handoff=f.handoff({siteAiCopy:null},form,null);
assert.equal(handoff.schema,'mypocket-studio-project-v1');
assert.equal(handoff.draft.name,'Aramis');
assert.equal(handoff.draft.styleId,'heritage');
assert.equal(handoff.draft.lang,'both');
assert.equal(handoff.draft.rooms.length,3);
assert.equal(handoff.draft.rooms[0].count,5);
assert.equal(handoff.management.mode,'shared');
assert.equal(handoff.management.turnaround,'3');
assert.equal(handoff.management.extraCost,'8');
assert.equal(handoff.draft.content.en.headline,'','Local design must never fake an English AI translation');
const copy={ro:{headline:'Pensiunea Aramis',intro:'Cazare',about:'Camere',services:[]},
 en:{headline:'Welcome to Aramis',intro:'Rooms',about:'Accommodation',services:[]}};
assert.equal(f.handoff({siteAiCopy:copy},form,null).draft.content.en.headline,'Welcome to Aramis');
assert.equal(f.handoff({siteAiCopy:copy},form,{data:'data:image/webp;base64,AAAA',caption:'Foto'}).draft.photos.length,1);
const prompt=f.enhance('Un cavaler templier călare pe o cămilă','full','portrait');
assert.match(prompt,/FULL SCENE, FULL BODY/);
assert.match(prompt,/Templar knight RIDING ON TOP OF A CAMEL/);
assert.match(prompt,/whole camel \(head, body, four legs\)/);
assert.match(prompt,/Vertical 9:16 image framing, not automatically a close-up/);
assert.ok(prompt.length<=500);
assert.doesNotMatch(f.enhance('A mountain cabin at dawn','wide','square'),/Templar knight/);
assert.match(CREATOR_IMAGE_AI_SCRIPT,/composition/);
assert.match(CREATOR_HANDOFF_SCRIPT,/extraCreatorDownloadProject/);
assert.match(CREATOR_HANDOFF_SCRIPT,/getGallery/);
assert.match(script,/Categorie de camere/);
assert.match(script,/40 fotografii/);
assert.match(CREATOR_HANDOFF_SCRIPT,/DataUrl|canvas\.toDataURL|toDataURL/);
console.log('PASS: Studio portal JS, editable project import, handover schema, automatic RO/EN copy, full-subject image composition without extra AI calls');
