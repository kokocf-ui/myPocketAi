import {test} from 'node:test';
import assert from 'node:assert/strict';
import {authorizeVoiceAction,validateVoiceUploadClaim} from './voice_policy.mjs';
const a='4bfac29a-b872-4a1f-a5cd-f68b5e442aed';
const b='b6326dc8-e21d-41f6-8dcc-4b2f6d2efbf9';
const c='c256d354-c8ac-4cbe-a31b-4f04f906b201';
const t='fb8b3d8e-c0f2-4880-8f1a-1a47e15fdb9b';
const actor={userId:a,verified:true};
const direct={id:t,kind:'direct',status:'active'};
const members=[a,b].map(userId=>({userId,status:'accepted',chatAllowed:true,verifiedContact:true,blocked:false}));
const call=(opts={})=>authorizeVoiceAction({actor,thread:direct,members,action:'send',...opts});
test('accepted, verified, mutually permitted contacts can send voice',()=>{
 assert.deepEqual(call(),{threadId:t,actorId:a,action:'send'});
 assert.equal(call({action:'read'}).action,'read');
});
test('reject unverified user or impostor',()=>{
 assert.throws(()=>call({actor:{...actor,verified:false}}),/unauthenticated/);
 assert.throws(()=>call({actor:{userId:c,verified:true}}),/chat_not_authorized/);
});
test('never grant direct voice chat from only one-sided invitations',()=>{
 for (const field of [{status:'invited'},{chatAllowed:false},{verifiedContact:false},{blocked:true}]) {
   assert.throws(()=>call({members:[members[0],{...members[1],...field}]}),/mutual_chat_consent_required/);
 }
});
test('strangers and non-participants cannot access chat',()=>{
 assert.throws(()=>call({members:[members[0],{...members[1],userId:c}]}),/chat_not_authorized/);
 assert.throws(()=>call({thread:{...direct,status:'closed'}}),/invalid_thread/);
});
test('group requires accepted sender and group-level voice enabled',()=>{
 const group={id:t,kind:'group',status:'active',voiceEnabled:true};
 const invited=[members[0],{userId:b,status:'invited',chatAllowed:true},{...members[1],userId:c}];
 assert.equal(call({thread:group,members:invited}).action,'send');
 assert.throws(()=>call({thread:{...group,voiceEnabled:false},members:invited}),/group_voice_not_allowed/);
 assert.throws(()=>call({thread:group,members:[{...members[0],status:'invited'},members[1]]}),/chat_not_authorized/);
});
test('voice metadata restrictions enforce beta limits',()=>{
 assert.equal(validateVoiceUploadClaim({mime:'audio/ogg',bytes:32768,durationMs:2000}).mime,'audio/ogg');
 for (const args of [
  {mime:'audio/wav',bytes:50,durationMs:200},
  {mime:'audio/ogg',bytes:0,durationMs:200},
  {mime:'audio/ogg',bytes:11*1024*1024,durationMs:200},
  {mime:'audio/ogg',bytes:512,durationMs:181000}
 ]) assert.throws(()=>validateVoiceUploadClaim(args));
});
