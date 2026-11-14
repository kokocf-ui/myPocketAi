// Build-only snapshot of the actual branch frontend for a signed Android UI preview.
// This file is not deployed to Cloudflare and must never contain credentials.
import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import app from '../index.js';

const response=await app.fetch(new Request('https://lifewise-ai-v2.kokocf.workers.dev/'));
assert.equal(response.status,200,'Frontend generator did not return HTTP 200');
const html=await response.text();
assert.ok(html.length>100000,'Unexpectedly short frontend bundle');
for(const required of ['extraCreatorHome(work)','extraCreatorLocalHtml','Creare pagini și imagini','extraToolsMountNavigation','extra-work-nav']){
  assert.ok(html.includes(required),'Missing newly approved UI feature: '+required);
}
assert.ok(html.includes('EXTRA_TOOLS_CATEGORIES'),'Tools navigation not found in UI bundle');
const dest=resolve('android/app/src/main/assets/tools-ui-preview.html');
mkdirSync(dirname(dest),{recursive:true});
writeFileSync(dest,html,'utf8');
console.log('SIGNED UI PREVIEW bundled from PR branch: '+html.length+' UTF-16 chars; '+dest);
