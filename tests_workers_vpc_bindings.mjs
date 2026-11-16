import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
const config=readFileSync('wrangler-backend.toml','utf8');
function block(name){
 const marker='[['+name+']]';
 const segments=config.split(marker).slice(1);
 return segments.map(part=>part.split('[[')[0]);
}

test('Two exact Workers VPC service IDs with no public hostnames',()=>{
 const entries=block('vpc_services');
 assert.equal(entries.length,2);
 const ids={
   RO_URBAN_VPC:'01a1e3e9-9c6b-7aa1-aefc-50a6824dbcd5',
   EN_URBAN_VPC:'01a1e3ea-f6fa-7d11-8f85-21f267b1d833'
 };
 const seen=new Set();
 for(const entry of entries){
  const name=entry.match(/^binding\s*=\s*"([^"]+)"/m)?.[1];
  assert.ok(name&&ids[name], 'Unexpected or missing VPC binding: '+name);
  assert.ok(!seen.has(name),'Duplicated binding: '+name);
  seen.add(name);
  assert.equal(entry.match(/^service_id\s*=\s*"([^"]+)"/m)?.[1],ids[name]);
  assert.match(entry,/^remote\s*=\s*true\s*$/m);
  assert.doesNotMatch(entry,/token|secret|password|api_key/i,'Credentials must not enter Git');
 }
 assert.deepEqual([...seen].sort(),Object.keys(ids).sort());
});
test('Preserve Eva Worker, DO SQLite communication and AI, without APK modifications',()=>{
 assert.match(config,/^name\s*=\s*"lifewise-ai-api"\s*$/m);
 assert.match(config,/^main\s*=\s*"backend.js"\s*$/m);
 assert.match(config,/^\[ai\]\s*\nbinding\s*=\s*"AI"/m);
 assert.match(config,/^name\s*=\s*"POCKET_COMM_HUB"\s*$/m);
 assert.match(config,/^class_name\s*=\s*"PocketCommunicationHub"\s*$/m);
 assert.match(config,/^tag\s*=\s*"communication-sqlite-v1"\s*$/m);
 assert.match(config,/^new_sqlite_classes\s*=\s*\["PocketCommunicationHub"\]/m);
});
