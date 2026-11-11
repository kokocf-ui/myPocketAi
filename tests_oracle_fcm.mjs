import assert from 'node:assert/strict';
import {generateKeyPairSync} from 'node:crypto';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createPushSender,createOraclePush,fcmTokenValid} from './oracle-communication/fcm-push.mjs';
import {ORACLE_COMMUNICATION_SCRIPT} from './oracle_communication_ui.mjs';

const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const calls=[];
const fakeFetch=async(url,opts)=>{
 calls.push({url,opts});
 if(url==='https://oauth2.googleapis.com/token'){
  assert.match(opts.body,/grant_type=/);
  return {ok:true,status:200,json:async()=>({access_token:'fake-access-token',expires_in:3600})};
 }
 assert.match(url,/https:\/\/fcm\.googleapis\.com\/v1\/projects\/pocket-test-123\/messages:send/);
 assert.equal(opts.headers.Authorization,'Bearer fake-access-token');
 return {ok:true,status:200,json:async()=>({name:'projects/pocket-test-123/messages/fake'})};
};
const send=createPushSender({
 projectId:'pocket-test-123',
 clientEmail:'svc@pocket-test-123.iam.gserviceaccount.com',
 privateKey:privateKey.export({format:'pem',type:'pkcs8'}),
 fetcher:fakeFetch,
});
const target='12345678-1234-1234-1234-123456789abc';
const token='registration-token:abcdefghijklmnopqrstuvwxyz0123456789';
assert.equal(fcmTokenValid(token),true);
assert.equal((await send({token,kind:'message',target})).ok,true);
assert.equal((await send({token,kind:'list',target})).ok,true);
assert.equal(calls.length,3,'OAuth credentials reused, not fetched for every message');
const payload=JSON.parse(calls[1].opts.body).message;
assert.deepEqual(Object.keys(payload.data).sort(),['kind','source','target']);
assert.equal(payload.data.target,target);
assert.equal(payload.data.source,'mypocketai_oracle');
assert.equal(payload.android.priority,'HIGH');
assert.equal('notification' in payload,false,'Firebase gets no private text, sender name or shopping contents');
assert.equal((await send({token:'bad',kind:'message',target})).invalid,true);
assert.equal(calls.length,3,'invalid push token is not sent');
assert.equal(createOraclePush({env:{}}).enabled,false,'unconfigured Firebase must not disrupt chat');
const api=readFileSync(new URL('./oracle-communication/device-api.mjs',import.meta.url),'utf8');
assert.match(api,/action==='push_register'/,'FCM registration requires signed device API');
assert.match(api,/device_push_tokens/,'FCM token is stored in Oracle not Cloudflare');
assert.match(api,/notify\(friend,'message',me\)/,'Messages trigger generic notifications');
assert.match(api,/notify\(friend,'list',list.id\)/,'Shopping shares trigger generic notifications');
assert.match(api,/!result\.duplicate/,'Idempotent retry cannot duplicate push');
assert.match(api,/SELECT l\.id,l\.title,l\.revision,l\.owner_id AS owner/,'Shopping distinguishes received lists');
new vm.Script(ORACLE_COMMUNICATION_SCRIPT);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/pocketPushTokenReceived/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/action:'push_register'/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/await registerPush\(\)/);
const java=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/MainActivity.java',import.meta.url),'utf8');
const service=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/PocketFirebaseMessagingService.java',import.meta.url),'utf8');
const manifest=readFileSync(new URL('./android/app/src/main/AndroidManifest.xml',import.meta.url),'utf8');
assert.match(java,/FirebaseOptions\.Builder\(\)/);
assert.match(java,/forwardFcmToken\(String token\)/);
assert.match(java,/BuildConfig\.FCM_PROJECT_ID/);
assert.match(service,/onMessageReceived\(RemoteMessage remote\)/);
assert.match(service,/mypocketai_oracle/);
assert.match(manifest,/com\.google\.firebase\.MESSAGING_EVENT/);
console.log('PASS FCM payload secrecy, OAuth cache, Oracle auth, shopping notifications, Android bridge');
