import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {ORACLE_COMMUNICATION_SCRIPT} from './oracle_communication_ui.mjs';

// Main app must never reload a private conversation on a background UI version check.
const ui=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const a=ui.indexOf('function pocketUiUpdateSafe(){');
const b=ui.indexOf('async function checkUiUpdateAfterModuleExit(){',a);
assert.ok(a>=0&&b>a,'UI update guard exists');
const safeSource=ui.slice(a,b);
for(const view of ['communication','assistant','conversations','module','tools','organize','learning','maps']){
 const safe=vm.runInNewContext(safeSource+';pocketUiUpdateSafe();',{state:{currentView:view}});
 assert.equal(safe,false,'No UI auto-reload during '+view);
}
assert.match(ui,/return view==='home'/,'Auto refresh is Home-only');
assert.match(ui,/sessionStorage\.getItem\(key\)===version/,'Repeated version refreshes are deduplicated');
assert.doesNotMatch(ui,/if\(leavingShopping\)checkUiUpdateAfterModuleExit\(\)/,'Organisation chooser cannot start a refresh');
const journey=readFileSync(new URL('./one_field_journey_ui.mjs',import.meta.url),'utf8');
assert.match(journey,/const choices=\[\['transit',text\.transit\],\['drive',text\.drive\]\]/,'Only mixed transport and car in Directions');
assert.doesNotMatch(journey,/\['walk',text\.walk\]/,'Walking remains a separate Maps option');

assert.match(ui,/const keyboardVisible=!!viewport&&viewport\.height<window\.innerHeight\*0\.76/);
assert.match(ui,/if\(keyboardVisible&&focused\?\.matches\?\.\('input,textarea/);
assert.match(ui,/if\(state\.currentView==='communication'&&window\.pocketCommunicationCloseChat\?\.\(\)\)return/);

// Receipt sender must use distinct states: accepted by server != delivered to device.
new vm.Script(ORACLE_COMMUNICATION_SCRIPT);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/Așteaptă livrarea/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/Pe server/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/livrarea către destinatar nu este confirmată/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/message\.delivered_at\?tr\('✓✓ Livrat'/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/action:'pending_messages'/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/setInterval\(\(\)=>\{if\(document\.visibilityState==='visible'\)void backgroundEnvelopeCheck\(\)\},16000\)/);
assert.doesNotMatch(ORACLE_COMMUNICATION_SCRIPT,/if\(!identity\?\.id\|\|!root\.classList\.contains\('active'\)\|\|document\.visibilityState==='hidden'\)return/);

const c=ORACLE_COMMUNICATION_SCRIPT.indexOf('async function syncDeliveredMessages(){');
const d=ORACLE_COMMUNICATION_SCRIPT.indexOf('async function refreshMessages(){',c);
assert.ok(c>=0&&d>c);
const pending=[
 {id:'m1',sender:'contact-a'},
 {id:'m2',sender:'contact-a'},
 {id:'m3',sender:'contact-b'}
];
const requests=[];
const context={
 identity:{id:'my-device'},document:{visibilityState:'visible'},
 send:async payload=>{
  requests.push(payload);
  return payload.action==='pending_messages'?{messages:pending}:{ok:true,acknowledged:payload.messageIds?.length||0}
 },
 Map,Set,console
};
const receive=vm.runInNewContext(ORACLE_COMMUNICATION_SCRIPT.slice(c,d)+';syncDeliveredMessages',context);
await receive();
assert.deepEqual(requests.map(x=>x.action),['pending_messages','receipt','receipt']);
assert.equal(requests[1].receiptType,'delivered');
assert.equal(requests[1].friend,'contact-a');
assert.deepEqual(Array.from(requests[1].messageIds),['m1','m2']);
assert.equal(requests[2].friend,'contact-b');
requests.length=0;
context.document.visibilityState='hidden';
await receive();
assert.equal(requests.length,0,'Hidden app never falsely acknowledges delivery');

// The introduction ends TTS audio and the actual 3D mouth at the final boundary.
const java=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/AvatarLaunchActivity.java',import.meta.url),'utf8');
const avatar=readFileSync(new URL('./android/app/src/main/assets/avatar-enter.js',import.meta.url),'utf8');
const finish=java.slice(java.indexOf('private void finishGreeting(){'),java.indexOf('private void sendToAvatar(',java.indexOf('private void finishGreeting(){')));
assert.match(finish,/speech\.stop\(\)/,'TTS audio is stopped');
assert.match(finish,/pocketLaunchEndGreeting/,'Final avatar mouth callback is sent');
assert.match(java,/if \(greetingFinished \|\| finishingLaunch\) return;/,'Stale onStart cannot animate mouth');
assert.match(avatar,/window\.pocketLaunchEndGreeting=\(\)=>/);
assert.match(avatar,/window\.PocketAvatarAPI\?\.setVisible\?\.\(false\)/);
assert.match(avatar,/window\.pocketLaunchFinish=\(\)=>\{/);

console.log('PASS private chat stability, queued delivery receipts and final avatar silence');
