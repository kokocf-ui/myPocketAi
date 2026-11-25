// Build-only, isolated Android preview of this branch. Never bundle secrets or
// use this snapshot for a production release. Online API calls remain remote.
import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync,cpSync,rmSync,readdirSync,readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import app from '../index.js';

const response=await app.fetch(new Request('https://lifewise-ai-v2.kokocf.workers.dev/'));
assert.equal(response.status,200,'Frontend generator did not return HTTP 200');
const html=await response.text();
assert.ok(html.length>100000,'Unexpectedly short frontend bundle');
for(const required of ['extraCreatorHome(work)','extraCreatorLocalHtml','Creare pagini și imagini','extraToolsMountNavigation','extra-work-nav','eduTranslateSourceText'])
 assert.ok(html.includes(required),'Missing branch UI feature: '+required);
assert.ok(html.includes('EXTRA_TOOLS_CATEGORIES'),'Tools navigation not found in UI bundle');
const root=resolve('android/app/build/generated/pocket-preview-assets');
rmSync(root,{recursive:true,force:true});mkdirSync(root,{recursive:true});
writeFileSync(join(root,'tools-ui-preview.html'),html,'utf8');
// Bundle only known Education assets, never local environment files or secrets.
// The hash-based annual pack names and source paths are unchanged.
for(const folder of ['education','packs'])cpSync(resolve('public',folder),join(root,'preview',folder),{recursive:true,errorOnExist:true});
const packs=readdirSync(join(root,'preview/packs')).filter(x=>/^p-[0-9a-f]{24}\.json$/.test(x));
assert.ok(packs.length>=3496,'Missing annual education packs');
for(const file of ['FR/CP','HU/1','HU/2','HU/3','HU/4']){
 const data=JSON.parse(readFileSync(join(root,'preview/education/literature/authored',file+'.json'),'utf8'));
 assert.equal(data.schema,'mypocket-literature-authored/v2','Unexpected authored pack schema '+file);
}
console.log('DEBUG PREVIEW: branch HTML and '+packs.length+' annual Education packs bundled; online API remains remote.');
