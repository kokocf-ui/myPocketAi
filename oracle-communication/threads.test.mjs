import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const server=readFileSync(new URL('./server.mjs',import.meta.url),'utf8');

test('only authenticated users can access the thread inbox',()=>{
  const auth=server.indexOf('const me=await currentUser(req);');
  const inbox=server.indexOf("if(method==='GET'&&path==='/v1/threads')");
  assert.ok(auth>=0&&inbox>auth);
});

test('inbox filters strangers, blocked contacts and disabled accounts',()=>{
  const start=server.indexOf("if(method==='GET'&&path==='/v1/threads')");
  const end=server.indexOf("if(method==='GET'&&path==='/v1/device-key')",start);
  const source=server.slice(start,end);
  for(const constraint of ['comm_contacts ab','comm_contacts ba','comm_blocks b','u.disabled_at IS NULL','mine.user_id=$1','peer.user_id<>$1','LIMIT 100']){
    assert.ok(source.includes(constraint),'missing privacy constraint: '+constraint);
  }
  assert.ok(!source.includes('ciphertext'),'inbox must not return message bodies');
});

test('device key GET is scoped to authenticated identity',()=>{
  const start=server.indexOf("if(method==='GET'&&path==='/v1/device-key')");
  const end=server.indexOf("if(method==='POST'&&path==='/v1/threads')",start);
  const source=server.slice(start,end);
  assert.match(source,/WHERE user_id=\$1/);
  assert.match(source,/\[me\.id\]/);
});
