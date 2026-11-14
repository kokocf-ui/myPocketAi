import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
import worker from './studio_worker.mjs';
import {StudioAccounts} from './studio_accounts.mjs';
import {StudioSites} from './studio_sites.mjs';
import {entitlement,TRIAL_MILLIS,normalizeStudioPrompt} from './studio_security.mjs';
import {renderStudioSite,validateStudioDraft,STUDIO_THEMES} from './studio_site_renderer.mjs';
import {SITE_HOSTING_GUIDES} from './creator_hosting_guide.mjs';
class Store{
 constructor(){this.data=new Map()}
 async get(k){return structuredClone(this.data.get(k))}
 async put(k,v){this.data.set(k,structuredClone(v))}
 async delete(k){this.data.delete(k)}
 async transaction(fn){return fn(this)}
}
const accountDO=new StudioAccounts({storage:new Store()},{}),siteObjects=new Map();
const binding=(get)=>({idFromName:name=>name,get});
const env={
 STUDIO_ACCOUNTS:binding(()=>({fetch:(u,o)=>accountDO.fetch(new Request(u,o))})),
 STUDIO_SITES:binding(id=>({fetch:(u,o)=>{
  if(!siteObjects.has(id))siteObjects.set(id,new StudioSites({storage:new Store()},{}));
  return siteObjects.get(id).fetch(new Request(u,o));
 }})),
 STUDIO_BOOTSTRAP_SECRET:'test-bootstrap-secret-do-not-use-production-01234',
 STUDIO_OPERATOR_SECRET:'test-operator-secret-do-not-use-production-98765',
 STUDIO_AI_ENABLED:'false',
 AI:{run(){throw Error('AI never allowed when cost toggle off')}}
};
const root='https://studio.test';
const call=async(path,method='GET',body=null,cookie='',headers={})=>{
 const h={...headers};if(method!=='GET'&&!h.Origin)h.Origin=root;
 if(body!==null)h['Content-Type']='application/json';
 if(cookie)h.Cookie=cookie;
 return worker.fetch(new Request(root+path,{method,headers:h,
  ...(body!==null?{body:JSON.stringify(body)}:{})}),env);
};
const result=async(...args)=>{const response=await call(...args);return {response,...await response.json().catch(()=>({}))}};
const rootHtml=await call('/');assert.equal(rootHtml.status,200);
const portal=await rootHtml.text();assert.match(portal,/Site Studio/);
assert.match(portal,/id="auth-info"/);assert.match(portal,/nonce=/);
assert.doesNotMatch(portal,/__STUDIO_NONCE__/);
assert.match(rootHtml.headers.get('Content-Security-Policy'),/nonce-/);
assert.doesNotMatch(portal,/__SITE_HOSTING_CATALOG__/,'Server must inject the hosting guide safely');
assert.match(portal,/Cloudflare Pages/);
assert.match(portal,/Netlify/);
assert.match(portal,/Găzduire clasică/);
assert.equal(SITE_HOSTING_GUIDES.length,5);
const secret='test-bootstrap-secret-do-not-use-production-01234';
assert.equal((await result('/api/setup','POST',{email:'creator@example.test',password:'Administrator!2026'},'',{'X-Studio-Setup':'wrong'})).response.status,403);
assert.equal((await result('/api/setup','POST',{email:'creator@example.test',password:'Administrator!2026'},'',{'X-Studio-Setup':secret})).ok,true);
assert.equal((await result('/api/setup','POST',{email:'new@example.test',password:'Administrator!2026'},'',{'X-Studio-Setup':secret})).response.status,409);
let login=await call('/api/login','POST',{email:'creator@example.test',password:'Administrator!2026'});
assert.equal(login.status,200);
const creatorCookie=login.headers.get('Set-Cookie').split(';')[0];
assert.match(creatorCookie,/__Host-pocket_studio=[0-9a-f]{64}/);
assert.match(login.headers.get('Set-Cookie'),/HttpOnly; SameSite=Lax/);
const creatorSession=await result('/api/session','GET',null,creatorCookie);
assert.equal(creatorSession.user.plan,'premium');
assert.equal((await result('/api/sites')).response.status,401);
assert.equal((await result('/api/sites','POST',{},creatorCookie,{Origin:'https://evil.test'})).response.status,403);
const draft={
 name:'Aramis',description:'Pensiune cu 5 camere single, 10 camere duble si 3 apartamente. Mic dejun inclus.',
 kind:'hotel',styleId:'heritage',lang:'both',
 contact:{email:'info@example.test',phone:'0740000000',address:'Oradea, România'},
 rooms:[{count:5,label:'camere single'},{count:10,label:'camere duble'},{count:3,label:'apartamente'}],
 amenities:['Mic dejun inclus','Bucătărie comună'],
 photos:[],
 content:{
  ro:{headline:'Un loc cu personalitate',intro:'Pensiunea Aramis',about:'Cazare cu mic dejun inclus',
   services:[{title:'Cazare',detail:'Camere și apartamente'}]},
  en:{headline:'Stay at Aramis',intro:'Aramis Guesthouse',about:'Stay with breakfast',
   services:[{title:'Accommodation',detail:'Rooms and apartments'}]}
 }
};
assert.equal(STUDIO_THEMES.length,12);
for(const styleId of STUDIO_THEMES){
 const rendered=renderStudioSite({...draft,styleId});
 assert.match(rendered,new RegExp('theme-'+({heritage:'asym',coastal:'immersive',forest:'organic',urban:'split',art:'mosaic',minimal:'minimal',rustic:'story',luxury:'editorial',soft:'cards',tech:'conversion',retro:'bold',wellness:'gallery'})[styleId]));
 assert.match(rendered,/<div class="metrics">/);
 assert.match(rendered,/5<\/b>/);
 assert.match(rendered,/10<\/b>/);
 assert.match(rendered,/3<\/b>/);
 assert.match(rendered,/Stay at Aramis/);
 assert.match(rendered,/id="lang-en"/);
 assert.doesNotMatch(rendered,/<script|https?:\/\//);
}
const bad=renderStudioSite({...draft,name:'<script>alert(1)</script>'});
assert.doesNotMatch(bad,/<script>/);assert.match(bad,/&lt;script&gt;/);
assert.ok(validateStudioDraft(draft));
const roomGallerySite=renderStudioSite({...draft,photos:[{data:'data:image/webp;base64,AAAA',caption:'Exterior',group:'exterior'},
 {data:'data:image/webp;base64,BBBB',caption:'Camera single',group:'room',roomLabel:'camere single'}]});
assert.match(roomGallerySite,/Galeria camerelor/);
assert.match(roomGallerySite,/room-gallery-tile/);
assert.match(roomGallerySite,/camere single/);
for(const kind of ['restaurant','services','salon','shop','personal','other']){
 const site=renderStudioSite({...draft,kind,photos:[
  {data:'data:image/webp;base64,AAAA',caption:'Copertă',group:'exterior'},
  {data:'data:image/webp;base64,BBBB',caption:'Detaliu',group:'category',categoryLabel:'Portofoliu foto',categoryEn:'Photo portfolio'}
 ]});
 assert.match(site,/Galerie foto/,'Public gallery missing for '+kind);
 assert.match(site,/Photo gallery/,'English public gallery missing for '+kind);
 assert.match(site,/Photo portfolio/,'English category metadata missing for '+kind);
 assert.match(site,/room-gallery-full/);
}
assert.ok(normalizeStudioPrompt('Un cavaler templier călare pe o cămilă','full').includes('Full-body view'));
const created=await result('/api/sites','POST',{draft,management:{
 mode:'shared',client:'Pensiunea Aramis',creator:'Creator Test',currency:'GBP',
 monthly:45,edits:4,turnaround:3,extraCost:8,notice:30,hosting:'owner',backups:'weekly'
}},creatorCookie);
assert.equal(created.ok,true);
const id=created.id;assert.match(id,/^[a-f0-9]{32}$/);
assert.equal((await result('/s/'+id)).response.status,404,'Unpublished site must never be public');
const creatorRead=await result('/api/sites/'+id,'GET',null,creatorCookie);
assert.equal(creatorRead.site.role,'creator');
assert.equal(creatorRead.site.version,1);
const wrongVersion=await result('/api/sites/'+id,'PUT',{version:0,draft},creatorCookie);
assert.equal(wrongVersion.response.status,409);
const changed=structuredClone(draft);changed.styleId='urban';
changed.content.ro.headline='Un nou titlu';
const saved=await result('/api/sites/'+id,'PUT',{version:1,draft:changed},creatorCookie);
assert.equal(saved.version,2);
const publicBefore=await result('/s/'+id);assert.equal(publicBefore.response.status,404);
const publish=await result('/api/sites/'+id+'/publish','POST',{version:2,actor:'f'.repeat(32)},creatorCookie);
assert.equal(publish.ok,true,'Caller-provided actor must not override the authenticated session');
const publicPage=await call('/s/'+id);assert.equal(publicPage.status,200);
const html=await publicPage.text();
assert.match(html,/Un nou titlu/);assert.match(html,/theme-split/);
assert.match(publicPage.headers.get('Content-Security-Policy'),/script-src 'none'/);
assert.match(publicPage.headers.get('Content-Security-Policy'),/sandbox/);
assert.equal((await call('/api/sites/'+id+'/preview','GET',null,creatorCookie)).status,200);
assert.equal((await call('/api/sites/'+id+'/export','GET',null,creatorCookie)).status,200);
assert.equal((await call('/api/sites/'+id+'/export')).status,401);
const invited=await result('/api/sites/'+id+'/invite','POST',{email:'client@example.test'},creatorCookie);
assert.equal(invited.ok,true);
assert.equal((await result('/api/register','POST',{invite:invited.invitation,email:'wrong@example.test',password:'ClientPassword!123'})).response.status,403);
const registered=await result('/api/register','POST',{invite:invited.invitation,email:'client@example.test',password:'ClientPassword!123'});
assert.equal(registered.ok,true);
assert.equal((await result('/api/register','POST',{invite:invited.invitation,email:'client2@example.test',password:'ClientPassword!123'})).response.status,403);
login=await call('/api/login','POST',{email:'client@example.test',password:'ClientPassword!123'});
const clientCookie=login.headers.get('Set-Cookie').split(';')[0];
const clientSession=await result('/api/session','GET',null,clientCookie);
assert.equal(clientSession.user.plan,'trial');
const clientRead=await result('/api/sites/'+id,'GET',null,clientCookie);
assert.equal(clientRead.site.role,'owner');assert.equal(clientRead.site.management.mode,'shared');
const fakeCreator=await result('/api/sites/'+id+'/invite','POST',{
 email:'attacker@example.test',actor:created.id
},creatorCookie);
assert.equal(fakeCreator.response.status,403,'Creator may not invite another owner after handover');
const noDesign=await result('/api/sites/'+id,'PUT',{
 version:2,draft:{...changed,styleId:'luxury'}
},clientCookie);
assert.equal(noDesign.response.status,403);
const newContent=structuredClone(changed);
newContent.content.ro.about='Proprietarul a actualizat fotografiile și descrierea.';
const ownerSaved=await result('/api/sites/'+id,'PUT',{version:2,draft:newContent},clientCookie);
assert.equal(ownerSaved.version,3);
assert.equal((await result('/api/sites/'+id+'/publish','POST',{version:2},clientCookie)).response.status,409);
assert.equal((await result('/api/sites/'+id+'/publish','POST',{version:3},clientCookie)).ok,true);
const ownerPublished=await call('/s/'+id);assert.match(await ownerPublished.text(),/Proprietarul a actualizat/);
assert.equal((await result('/api/ai/image','POST',{prompt:'Templar on camel'},clientCookie)).response.status,503);
assert.equal((await result('/api/ai/site','POST',{name:'Aramis',description:draft.description},clientCookie)).response.status,503);
assert.equal((await result('/api/sites/'+id+'/request','POST',{message:'Schimbă fotografia principală'},clientCookie)).ok,true);
const end=await result('/api/sites/'+id+'/end-maintenance','POST',{},clientCookie);
assert.equal(end.ok,true);
assert.equal((await result('/api/sites/'+id,'GET',null,creatorCookie)).response.status,403);
assert.equal((await result('/api/sites/'+id,'GET',null,clientCookie)).site.role,'owner');
assert.equal((await result('/api/entitlement/grant','POST',{email:'client@example.test',until:Date.now()+30*86400000},
 clientCookie,{'X-Studio-Operator':'bad'})).response.status,403);
assert.equal((await result('/api/entitlement/grant','POST',{email:'client@example.test',until:Date.now()+30*86400000},
 clientCookie,{'X-Studio-Operator':env.STUDIO_OPERATOR_SECRET})).ok,true);
assert.equal((await result('/api/session','GET',null,clientCookie)).user.plan,'premium');
const past=entitlement({plan:'trial',created:Date.now()-TRIAL_MILLIS-1000});
assert.equal(past.canCreate,false);
assert.equal(past.canGenerate,false);
const health=await result('/health');assert.equal(health.billingEnabled,false);assert.equal(health.aiEnabled,false);
console.log('PASS: secure studio login, cookie/CSRF, trial, premium manual gate, all 12 themes, edit roles, invitation transfer, publish, export, audit, AI zero-spend default');
