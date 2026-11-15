// Build a separate, secret-free Studio deployment bundle for a customer's Cloudflare account.
// No Pocket AI chat, transit, education, or Android source is included.
import {mkdir,rm,copyFile,readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist','eva-client-backend');
const list=[
 'studio_worker.mjs','studio_accounts.mjs','studio_sites.mjs',
 'studio_site_renderer.mjs','studio_admin_portal.mjs','studio_security.mjs',
 'studio_business_flows.mjs','studio_commerce.mjs','studio_notifications.mjs','creator_guesthouse_gallery.mjs',
 'creator_hosting_guide.mjs','creator_premium_presentations.mjs',
 'wrangler.eva-client.jsonc','EVA_INSTALARE_BACKEND_CLIENT.md','instalare-eva.mjs'
];
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
const names=new Set(list);
for(const name of list){
 const text=await readFile(path.join(root,name),'utf8');
 if(name.endsWith('.mjs')){
  for(const match of text.matchAll(/from ['"]\.\/([^'"]+)['"]/g))
   if(!names.has(match[1]))throw Error(name+' imports missing '+match[1]);
 }
 await copyFile(path.join(root,name),path.join(out,name));
}
const emitted=await readdir(out);
if(emitted.length!==list.length)throw Error('incomplete_bundle');
console.log('PASS Eva private backend package:',out,emitted.length,'files');
