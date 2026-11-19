import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{ImageQuota,IMAGE_MODEL} from './eva_image_studio_worker.mjs';

const jpg=Buffer.alloc(256);jpg[0]=255;jpg[1]=216;jpg[254]=255;jpg[255]=217;
const b64=jpg.toString('base64');
const installation=i=>'00000000-0000-4000-8000-'+String(i).padStart(12,'0');
function mock(opts={}){
 const counts=new Map();
 let calls=0,form=null,failed=false;
 // One queue to emulate DO's atomic transactions even when requests race.
 let queue=Promise.resolve();
 const storage={transaction:fn=>{
   const op=queue.then(()=>fn({get:async key=>counts.get(key),put:async(key,val)=>{counts.set(key,val)}}));
   queue=op.catch(()=>{});return op;
 }};
 const q=new ImageQuota({storage},{
   DAILY_IMAGE_LIMIT:'3',PER_INSTALL_DAILY_LIMIT:String(opts.perInstall??3),
   PREVIEW_GLOBAL_DAILY_MAX:String(opts.global??300)
 });
 const env={AI:{run:async(model,params)=>{
   assert.equal(model,IMAGE_MODEL);calls++;
   if(failed)throw Error('provider_down');
   const req=new Request('https://mock.invalid',{method:'POST',body:params.multipart.body,headers:{'content-type':params.multipart.contentType},duplex:'half'});
   form=await req.formData();return {image:b64};
  }},IMAGE_QUOTA:{idFromName:name=>name,get:()=>({fetch:(url,args)=>q.fetch(new Request(url,args))})},
  get calls(){return calls},get form(){return form},set failed(v){failed=v}
 };
 return env;
}
async function send(env,path,data){
 return worker.fetch(new Request('https://mock.invalid'+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)}),env);
}
async function quota(env,id){
 const r=await send(env,'/quota',{installationId:id});
 assert.equal(r.status,200);return r.json();
}
async function gen(env,id,prompt='A modern chalet with a forest in the background'){
 return send(env,'/generate',{prompt,format:'wide',...(id?{installationId:id}:{})});
}
test('health publishes truthful installation preview settings',async()=>{
 const r=await worker.fetch(new Request('https://mock.invalid/health'),mock());
 assert.equal(r.status,200);
 const j=await r.json();
 assert.equal(j.mode,'per_installation_preview');
 assert.equal(j.perInstallationDailyLimit,3);
 assert.equal(j.dailyGlobalSafetyMax,300);
});
test('first installation sees 3 remaining, without AI calls',async()=>{
 const env=mock();
 const q=await quota(env,installation(1));
 assert.equal(q.dailyLimit,3);assert.equal(q.used,0);assert.equal(q.remaining,3);
 assert.equal(q.scope,'installation_preview');assert.match(q.resetAt,/T00:00:00\.000Z$/);
 assert.equal(env.calls,0);
});
test('generation uses correct model + dimensions; decrements only its installation',async()=>{
 const env=mock(),first=installation(1),second=installation(2);
 const r=await gen(env,first);
 assert.equal(r.status,200);
 const data=await r.json();
 assert.match(data.image,/^data:image\/jpeg;base64,/);assert.equal(data.quota.used,1);
 assert.equal(data.quota.remaining,2);
 assert.equal(env.form.get('width'),'1280');assert.equal(env.form.get('height'),'720');
 assert.equal(env.form.has('input_image_0'),false);
 assert.equal((await quota(env,second)).remaining,3);
 assert.equal((await quota(env,first)).remaining,2);
});
test('edit includes binary reference and reduces the same counter',async()=>{
 const env=mock(),id=installation(3);
 const r=await send(env,'/edit',{prompt:'Replace white background with a beach',format:'original',width:600,height:400,image:'data:image/jpeg;base64,'+b64,installationId:id});
 assert.equal(r.status,200);
 assert.equal(env.form.get('input_image_0').type,'image/jpeg');
 assert.match(env.form.get('prompt'),/Replace white background/);
 assert.equal((await quota(env,id)).remaining,2);
});
test('3 uses per installation, not 3 across users; 4th blocked before model',async()=>{
 const env=mock();
 for(let i=1;i<=6;i++){
  const id=installation(i);
  for(let n=0;n<3;n++)assert.equal((await gen(env,id)).status,200);
  const r=await gen(env,id);
  assert.equal(r.status,429);assert.equal((await r.json()).error,'installation_limit_reached');
  assert.equal((await quota(env,id)).remaining,0);
 }
 assert.equal(env.calls,18);
});
test('global safety ceiling independently stops API calls after budget',async()=>{
 const env=mock({global:5});
 for(let i=1;i<=5;i++)assert.equal((await gen(env,installation(i))).status,200);
 const r=await gen(env,installation(6));
 assert.equal(r.status,429);assert.equal((await r.json()).error,'preview_capacity_reached');
 assert.equal(env.calls,5);
 const q=await quota(env,installation(6));assert.equal(q.personalRemaining,3);assert.equal(q.remaining,0);assert.equal(q.capacityLimited,true);
});
test('model failure frees the reservation and returns remaining uses',async()=>{
 const env=mock(),id=installation(7);
 env.failed=true;
 assert.equal((await gen(env,id)).status,502);
 const q=await quota(env,id);
 assert.equal(q.used,0);assert.equal(q.remaining,3);
 env.failed=false;
 assert.equal((await gen(env,id)).status,200);
 assert.equal((await quota(env,id)).remaining,2);
});
test('simultaneous requests cannot exceed 3 uses per installation',async()=>{
 const env=mock(),id=installation(9);
 const attempts=await Promise.all(Array.from({length:8},()=>gen(env,id)));
 assert.equal(attempts.filter(x=>x.status===200).length,3);
 assert.equal(attempts.filter(x=>x.status===429).length,5);
 assert.equal(env.calls,3);assert.equal((await quota(env,id)).remaining,0);
});
test('100 independent installations can each spend 3 in mocked model (300)',async()=>{
 const env=mock({global:300});
 for(let i=1;i<=100;i++){
  const id=installation(i);
  for(let n=0;n<3;n++)assert.equal((await gen(env,id)).status,200);
 }
 assert.equal(env.calls,300);
 const extra=await gen(env,installation(101));
 assert.equal(extra.status,429);assert.equal((await extra.json()).error,'preview_capacity_reached');
 assert.equal((await quota(env,installation(100))).used,3);
});
test('invalid requests cannot spend requests; old APK stays on shared legacy counter',async()=>{
 const env=mock();
 assert.equal((await send(env,'/generate',{prompt:'Hi',format:'wide',installationId:installation(1)})).status,400);
 assert.equal((await send(env,'/generate',{prompt:'A long enough image description',format:'wide',installationId:'user@example.com'})).status,400);
 assert.equal((await send(env,'/quota',{installationId:'abc'})).status,400);
 assert.equal(env.calls,0);
 for(let n=0;n<3;n++)assert.equal((await gen(env,null)).status,200);
 const r=await gen(env,null);assert.equal(r.status,429);
 assert.equal((await r.json()).error,'preview_limit_reached');
 assert.equal((await quota(env,installation(1))).remaining,3);
});
test('OPTIONS, route isolation and invalid content type',async()=>{
 const env=mock();
 assert.equal((await worker.fetch(new Request('https://mock.invalid/edit',{method:'OPTIONS'}),env)).status,204);
 assert.equal((await worker.fetch(new Request('https://mock.invalid/other'),env)).status,404);
 const r=await worker.fetch(new Request('https://mock.invalid/quota',{method:'POST',headers:{'content-type':'text/plain'},body:'hello'}),env);
 assert.equal(r.status,415);
});
