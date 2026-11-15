import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validWorkerName,safeStudioUrl,withClientName} from './instalare-eva.mjs';
const cfg=JSON.parse(await readFile(new URL('./wrangler.eva-client.jsonc',import.meta.url),'utf8'));
assert.equal(cfg.exports.StudioSites.storage,'sqlite');
assert.ok(cfg.durable_objects.bindings.some(x=>x.name==='STUDIO_SITES'));
assert.ok(cfg.durable_objects.bindings.some(x=>x.name==='STUDIO_ACCOUNTS'));
assert.equal(validWorkerName('eva-pensiune-aramis'),true);
for(const invalid of ['A','A B','-test','test--test','test@client','',null,undefined])
 assert.equal(validWorkerName(invalid),false,'Invalid Worker name must be rejected');
assert.equal(withClientName(cfg,'eva-client-safe').name,'eva-client-safe');
assert.equal(cfg.name,'eva-site-client','Never overwrite base configuration');
const installerSource=await readFile(new URL('./instalare-eva.mjs',import.meta.url),'utf8');
assert.match(installerSource,/flag:'wx'/,'Installer must never overwrite an existing client deployment config');
assert.throws(()=>withClientName(cfg,'../../bad'),/Numele Worker/);
assert.equal(safeStudioUrl('https://eva-site.workers.dev'),'https://eva-site.workers.dev');
for(const u of ['http://eva-site.workers.dev','https://u:p@eva-site.workers.dev',
 'https://eva-site.workers.dev/other','not-a-url']){
 assert.equal(safeStudioUrl(u),null,'Untrusted deploy URL rejected');
}
console.log('PASS Eva guided client installer: strict name and HTTPS validation, SQLite bindings, no login at import');
