import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{ImageQuota,IMAGE_MODEL} from './eva_image_studio_worker.mjs';
const jpg=Buffer.alloc(256);jpg[0]=255;jpg[1]=216;jpg[254]=255;jpg[255]=217;
const b64=jpg.toString('base64');
function mock(){
  const counts=new Map();
  let calls=0,form=null;
  const q=new ImageQuota({storage:{transaction:async fn=>fn({
    get:async key=>counts.get(key),put:async(key,val)=>counts.set(key,val)})}},{DAILY_IMAGE_LIMIT:'3'});
  return {AI:{run:async(model,params)=>{
    assert.equal(model,IMAGE_MODEL);calls++;
    const req=new Request('https://mock.invalid',{method:'POST',body:params.multipart.body,headers:{'content-type':params.multipart.contentType},duplex:'half'});
    form=await req.formData();return {image:b64};
  }},IMAGE_QUOTA:{idFromName:name=>name,get:()=>({fetch:(url,args)=>q.fetch(new Request(url,args))})},
  get calls(){return calls},get form(){return form}};
}
async function send(env,path,data){
  return worker.fetch(new Request('https://mock.invalid'+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)}),env);
}
test('health is preview, not paid account enforcement',async()=>{
  const r=await worker.fetch(new Request('https://mock.invalid/health'),mock());
  assert.equal(r.status,200);assert.equal((await r.json()).mode,'capped_preview');
});
test('generation calls text model with width and height',async()=>{
  const env=mock();
  const r=await send(env,'/generate',{prompt:'Modern townhouse at sunrise',format:'wide'});
  assert.equal(r.status,200);assert.match((await r.json()).image,/^data:image\/jpeg;base64,/);
  assert.equal(env.form.get('prompt'),'Modern townhouse at sunrise');
  assert.equal(env.form.get('width'),'1280');assert.equal(env.form.get('height'),'720');
  assert.equal(env.form.has('input_image_0'),false);
});
test('editing includes reference photo as binary',async()=>{
  const env=mock();
  const r=await send(env,'/edit',{prompt:'Replace the background with a beach',format:'original',width:600,height:400,image:'data:image/jpeg;base64,'+b64});
  assert.equal(r.status,200);
  assert.equal(env.form.get('input_image_0').type,'image/jpeg');
  assert.match(env.form.get('prompt'),/Replace the background/);
});
test('daily preview quota blocks fourth request',async()=>{
  const env=mock();
  for(let i=0;i<3;i++) assert.equal((await send(env,'/generate',{prompt:'Modern hotel at sunrise',format:'square'})).status,200);
  const r=await send(env,'/generate',{prompt:'Modern hotel at sunrise',format:'square'});
  assert.equal(r.status,429);assert.equal((await r.json()).error,'preview_limit_reached');assert.equal(env.calls,3);
});
test('invalid requests rejected before model call',async()=>{
  const env=mock();
  assert.equal((await send(env,'/generate',{prompt:'Hi',format:'square'})).status,400);
  assert.equal((await send(env,'/edit',{prompt:'Replace the entire background',format:'square',image:'not photo'})).status,400);
  assert.equal(env.calls,0);
});
test('CORS and unknown routes stay safe',async()=>{
  const env=mock(),r=await worker.fetch(new Request('https://mock.invalid/edit',{method:'OPTIONS'}),env);
  assert.equal(r.status,204);
  assert.equal((await worker.fetch(new Request('https://mock.invalid/missing'),env)).status,404);
  assert.equal(env.calls,0);
});
