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
class TestBucket{
 constructor(){this.objects=new Map()}
 async put(key,content){this.objects.set(key,typeof content==='string'?content:new Uint8Array(content));return {key}}
 async get(key){const result=this.objects.get(key);return result==null?null:{
  body:result,async json(){return JSON.parse(result)}}}
 async list({prefix}){return {objects:[...this.objects.entries()].filter(([key])=>key.startsWith(prefix))
  .map(([key,data])=>({key,size:data.length,uploaded:new Date()}))}}
 async delete(keys){for(const key of Array.isArray(keys)?keys:[keys])this.objects.delete(key)}
}
const accountDO=new StudioAccounts({storage:new Store()},{}),siteObjects=new Map();
const binding=(get)=>({idFromName:name=>name,get});
const env={
 STUDIO_ACCOUNTS:binding(()=>({fetch:(u,o)=>accountDO.fetch(new Request(u,o))})),
 STUDIO_SITES:binding(id=>({fetch:(u,o)=>{
  if(!siteObjects.has(id))siteObjects.set(id,new StudioSites({storage:new Store()},env));
  return siteObjects.get(id).fetch(new Request(u,o));
 }})),
 STUDIO_BOOTSTRAP_SECRET:'test-bootstrap-secret-do-not-use-production-01234',
 STUDIO_OPERATOR_SECRET:'test-operator-secret-do-not-use-production-98765',
 SITE_MEDIA:new TestBucket(),SITE_BACKUPS:new TestBucket(),
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
const backupResult=await result('/api/sites/'+id+'/backups','POST',{},creatorCookie);
assert.equal(backupResult.ok,true);
const backups=await result('/api/sites/'+id+'/backups','GET',null,creatorCookie);
assert.equal(backups.objects.length,1);
assert.equal((await result('/api/sites/'+id+'/backups','GET')).response.status,401);
const mediaUpload=await worker.fetch(new Request(root+'/api/sites/'+id+'/media',{method:'POST',
 headers:{Origin:root,Cookie:creatorCookie,'Content-Type':'image/png'},
 body:new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0,0,0,0,0])}),env);
assert.equal(mediaUpload.status,200);
const mediaUrl=(await mediaUpload.json()).mediaUrl;
assert.ok(mediaUrl.startsWith('/media/'+id+'/'));
assert.equal((await call(mediaUrl)).status,404);

assert.equal((await result('/s/'+id)).response.status,404,'Unpublished site must never be public');
const creatorRead=await result('/api/sites/'+id,'GET',null,creatorCookie);
assert.equal(creatorRead.site.role,'creator');
assert.equal(creatorRead.site.version,1);
const wrongVersion=await result('/api/sites/'+id,'PUT',{version:0,draft},creatorCookie);
assert.equal(wrongVersion.response.status,409);
const changed=structuredClone(draft);changed.styleId='urban';
changed.content.ro.headline='Un nou titlu';
changed.photos=[{data:mediaUrl,caption:'Camera principală',group:'room',roomLabel:'camere single'}];
const saved=await result('/api/sites/'+id,'PUT',{version:1,draft:changed},creatorCookie);
assert.equal(saved.version,2);
const publicBefore=await result('/s/'+id);assert.equal(publicBefore.response.status,404);
const publish=await result('/api/sites/'+id+'/publish','POST',{version:2,actor:'f'.repeat(32)},creatorCookie);
assert.equal(publish.ok,true,'Caller-provided actor must not override the authenticated session');
const publicPage=await call('/s/'+id);assert.equal(publicPage.status,200);
const html=await publicPage.text();
assert.equal((await call(mediaUrl)).status,200,'Image becomes public only with published site');
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
// Visitor backend: forms are opt-in, same-origin, private and store requests (not confirmations).
const activeFlows=structuredClone(newContent);
activeFlows.features={contact:true,booking:true};
const enabled=await result('/api/sites/'+id,'PUT',{version:3,draft:activeFlows},clientCookie);
assert.equal(enabled.version,4);
assert.equal((await result('/api/sites/'+id+'/publish','POST',{version:4},clientCookie)).response.status,400);
activeFlows.features.privacyUrl='https://example.test/privacy';
const nextVersion=await result('/api/sites/'+id,'PUT',{version:4,draft:activeFlows},clientCookie);
assert.equal(nextVersion.version,5);
assert.equal((await result('/api/sites/'+id+'/publish','POST',{version:5},clientCookie)).ok,true);
const formsPublic=await call('/s/'+id),formsHtml=await formsPublic.text();
assert.match(formsHtml,/\/contact"/);
assert.match(formsHtml,/\/booking"/);
assert.match(formsHtml,/name="roomLabel"/);
assert.match(formsPublic.headers.get('Content-Security-Policy'),/form-action 'self'/);
assert.match(formsPublic.headers.get('Content-Security-Policy'),/sandbox allow-forms allow-same-origin/);
const offline=renderStudioSite(activeFlows);
assert.match(offline,/disabled/);
assert.doesNotMatch(offline,new RegExp('/s/'+id+'/contact'));
const visitor=async(action,payload,ip='203.0.113.10',origin=root)=>{
 const h={Origin:origin,'Content-Type':'application/x-www-form-urlencoded','CF-Connecting-IP':ip,'User-Agent':'site-demo-test'};
 return worker.fetch(new Request(root+'/s/'+id+'/'+action,{
  method:'POST',headers:h,body:new URLSearchParams(payload)
 }),env);
};
const baseVisitor={name:'Client Eva',email:'client-visitor@example.test',phone:'0700000000',privacy_ack:'yes'};
assert.equal((await visitor('contact',{...baseVisitor,message:'Vă rog să mă contactați.'},'203.0.113.11','https://evil.test')).status,403);
assert.equal((await visitor('contact',{...baseVisitor,message:'Vă rog să mă contactați.',privacy_ack:'no'},'203.0.113.12')).status,400);
assert.equal((await visitor('contact',{...baseVisitor,message:'Vă rog să mă contactați.',website:'bot-value'},'203.0.113.12')).status,200);
assert.equal((await result('/api/sites/'+id+'/inbox')).response.status,401);
const msgSent=await visitor('contact',{...baseVisitor,message:'Bună, vreau detalii despre pensiune.'},'203.0.113.11');
assert.equal(msgSent.status,200);
assert.match(await msgSent.text(),/Nu este încă o rezervare confirmată/);
const start=new Date(Date.now()+7*86400000).toISOString().slice(0,10);
const endDate=new Date(Date.now()+10*86400000).toISOString().slice(0,10);
assert.equal((await visitor('booking',{...baseVisitor,start,end:endDate,roomLabel:'camere INEXISTENTE',partySize:'2'},'203.0.113.22')).status,400);
assert.equal((await visitor('booking',{...baseVisitor,start,end:endDate,roomLabel:'camere single',partySize:'2',
 message:'Aș vrea o cameră liniștită.'},'203.0.113.22')).status,200);
const inbox=await result('/api/sites/'+id+'/inbox','GET',null,clientCookie);
assert.equal(inbox.ok,true);assert.equal(inbox.items.length,2);
assert.ok(inbox.items.some(x=>x.type==='contact'));
assert.ok(inbox.items.some(x=>x.type==='booking'&&x.status==='new'&&x.roomLabel==='camere single'));
const messageId=inbox.items.find(x=>x.type==='contact').id;
assert.equal((await result('/api/sites/'+id+'/inbox/'+messageId+'/status','POST',
 {status:'confirmed'},clientCookie)).response.status,400,'No false automatic booking confirmations');
assert.equal((await result('/api/sites/'+id+'/inbox/'+messageId+'/status','POST',
 {status:'contacted'},clientCookie)).ok,true);
assert.equal((await result('/api/sites/'+id+'/inbox/'+messageId,'DELETE',null,clientCookie)).ok,true);
assert.equal((await result('/api/sites/'+id+'/inbox','GET',null,clientCookie)).items.length,1);
assert.equal((await visitor('contact',{...baseVisitor,message:'Mesaj unul de test.'},'203.0.113.33')).status,200);
assert.equal((await visitor('contact',{...baseVisitor,message:'Mesaj doi de test.'},'203.0.113.33')).status,200);
assert.equal((await visitor('contact',{...baseVisitor,message:'Mesaj trei de test.'},'203.0.113.33')).status,200);
assert.equal((await visitor('contact',{...baseVisitor,message:'Mesaj patru de test.'},'203.0.113.33')).status,429);
const commerceDraft=structuredClone(activeFlows);
commerceDraft.features.shop=true;
commerceDraft.commerce={currency:'GBP',slotCapacity:4,automaticConfirmation:true,
 products:[{id:'p-1',title:'Voucher',priceMinor:5000,inventory:2}]};
const commercialSaved=await result('/api/sites/'+id,'PUT',{version:5,draft:commerceDraft},clientCookie);
assert.equal(commercialSaved.version,6);
assert.equal((await result('/api/sites/'+id+'/publish','POST',{version:6},clientCookie)).ok,true);
assert.match(await (await call('/s/'+id)).text(),/name="productId"/);
for(let i=0;i<5;i++){
 const res=await visitor('booking',{...baseVisitor,start,end:endDate,roomLabel:'camere single',partySize:'2'},'203.0.114.'+(i+1));
 assert.equal(res.status,200);
}
const sixth=await visitor('booking',{...baseVisitor,start,end:endDate,roomLabel:'camere single',partySize:'2'},'203.0.114.8');
assert.equal(sixth.status,200);
const busy=await result('/s/'+id+'/availability?roomLabel=camere%20single&start='+start+'&end='+endDate);
assert.equal(busy.available,false,'Five confirmed rooms fill the inventory');
const stockInbox=await result('/api/sites/'+id+'/inbox','GET',null,clientCookie);
assert.equal(stockInbox.items.filter(x=>x.type==='booking'&&x.status==='confirmed'&&x.roomLabel==='camere single').length,5);

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
