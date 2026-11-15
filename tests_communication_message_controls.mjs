import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {ORACLE_COMMUNICATION_SCRIPT,ORACLE_COMMUNICATION_STYLE} from './oracle_communication_ui.mjs';
import {CREATOR_SITE_STYLE} from './creator_site_ui.mjs';

new vm.Script(ORACLE_COMMUNICATION_SCRIPT,{filename:'chat-voice-and-message-controls.js'});
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function voiceDraftReady\(file\)/,'Audio recording has a local review stage');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/voicePlayer\.src=voiceDraftUrl/,'User can replay the unsent recording');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/URL\.revokeObjectURL\(voiceDraftUrl\)/,'Discard releases the temporary preview');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/const voicePauseButton=makeBtn/,'Audio has a pause button');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/const voiceDeleteButton=makeBtn/,'Audio draft can be discarded before sending');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/const voiceSendButton=makeBtn/,'Audio has explicit Send');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/const success=await uploadChosenFile\(file\)/,'Audio uploads only on explicit Send');
const nativeComplete=ORACLE_COMMUNICATION_SCRIPT.slice(ORACLE_COMMUNICATION_SCRIPT.indexOf("if(event.status==='complete')"),ORACLE_COMMUNICATION_SCRIPT.indexOf("if(event.status==='error'||"));
assert.match(nativeComplete,/voiceDraftReady\(file\)/,'Android recording produces unsent draft');
assert.doesNotMatch(nativeComplete,/uploadChosenFile/,'Android Stop must not transmit');
const browserStop=ORACLE_COMMUNICATION_SCRIPT.slice(ORACLE_COMMUNICATION_SCRIPT.indexOf('recorder.onstop=()=>'),ORACLE_COMMUNICATION_SCRIPT.indexOf('voiceRecorder.start()'));
assert.match(browserStop,/voiceDraftReady\(/,'Browser recording produces draft');
assert.doesNotMatch(browserStop,/uploadChosenFile/,'Browser Stop must not transmit');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/voiceWebCancelled/,'Permission delay or cancelled capture never sends');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/if\(!selected\|\|selected\.id!==voiceDraftPeer\|\|voiceWebCancelled\)/,'Asynchronous mic permission cannot start capture after leaving chat');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/action:'edit_message'/,'Editing is encrypted and sent only explicitly');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/action:'delete_message'/,'Sender can request deletion for both participants');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function clearChatLocally\(peer\)/,'Clear conversation is local-only');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function showMessageActions\(message,peer,visibleText\)/,'Message actions are attached to actual conversation records');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function confirmChatAction\(/,'Destructive actions require confirmation');
assert.match(ORACLE_COMMUNICATION_STYLE,/\.comm-voice-panel/);
assert.match(ORACLE_COMMUNICATION_STYLE,/dialog\.comm-action-dialog/);
assert.match(CREATOR_SITE_STYLE,/\.extra-creator-option-actions\{display:grid!important;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,'Back and Apply share an equal-size grid');
assert.match(CREATOR_SITE_STYLE,/min-height:76px!important;align-self:stretch!important/,'Two website actions always have equal heights');

const path='android/app/src/main/java/ai/mypocket/mobile/MainActivity.java';
const native=readFileSync(path,'utf8');
assert.match(native,/private boolean commVoicePaused = false/);
assert.match(native,/commVoiceRecorder\.pause\(\)/);
assert.match(native,/commVoiceRecorder\.resume\(\)/);
assert.match(native,/notifyCommVoice\("paused"/);
assert.match(native,/notifyCommVoice\("resumed"/);
assert.match(native,/CountDownLatch/,'Chunks are acknowledged by Android WebView before continuing');
assert.match(native,/ack\.await\(5,java\.util\.concurrent\.TimeUnit\.SECONDS\)/,'Transport has a finite failure timeout');
assert.match(native,/new byte\[24\*1024\]/,'Audio chunk payloads stay below WebView bridge limits');
assert.match(native,/if\(!notifyCommVoice\("chunk"/,'Read fails visibly instead of silently losing voice fragments');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function armNativeVoiceWatchdog\(ms\)/,'UI recovers from a missing Android start/finish response');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/if\(!nativeVoiceRecording\)\{voiceWebCancelled=false/,'New recording is not canceled by a previous chat exit');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/event\.parts>512/,'All bounded audio chunks are accepted');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/Array\.from\(\{length:event\.parts\}/,'Missing interior chunks must be detected');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/selected\.id!==voiceDraftPeer/,'Late voice completion cannot attach to the wrong conversation');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/message\.kind==='audio'\?tr\(/,'Encrypted audio envelopes render as voice messages');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/if\(message\.kind!=='text'\)/,'Audio, image, video and files can open in a viewer');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/if\(nativeVoicePending\|\|nativeVoiceRecording\|\|voiceDraft\)/,'Android hardware Back does not discard an active voice note');

assert.match(native,/!"pause"\.equals\(command\)&&!"resume"\.equals\(command\)/,'Android message bridge accepts pause/resume, not just the recorder implementation');

const oracle=readFileSync('oracle-communication/device-api.mjs','utf8');
assert.match(oracle,/edit_message','delete_message/,'Oracle allows the two authenticated actions');
assert.match(oracle,/check\(await approved\(pool,me,friend\)/,'Actions require an approved peer');
assert.match(oracle,/UPDATE device_messages SET iv=\$4,cipher=\$5 WHERE id=\$1 AND sender_id=\$2 AND recipient_id=\$3 AND pair_key=\$6 AND kind='text'/,'Edit only own encrypted text');
assert.match(oracle,/DELETE FROM device_messages WHERE id=\$1 AND sender_id=\$2 AND recipient_id=\$3 AND pair_key=\$4/,'Delete only own message');
assert.doesNotMatch(oracle,/data\.plaintext|data\.messageText/,'Server never handles plaintext edits');

// Local visibility semantics are deliberately isolated from encrypted payloads.
const start=ORACLE_COMMUNICATION_SCRIPT.indexOf('const localChatPreferences=new Map();');
const end=ORACLE_COMMUNICATION_SCRIPT.indexOf('async function refreshMessages(){',start);
assert.ok(start>0&&end>start,'Local chat preference helpers are available');
const map=new Map();
const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
const transcript={replaceChildren(){}};
const peer={id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'};
const identity={id:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'};
const code=ORACLE_COMMUNICATION_SCRIPT.slice(start,end);
const h=new Function('identity','localStorage','setStatus','tr','transcript','refreshMessages',code+
 ';return {chatVisibility,messageVisibleLocally,hideMessageLocally,clearChatLocally};')(
 identity,storage,()=>{},(a)=>a,transcript,async()=>{});
const old={id:'cccccccc-cccc-4ccc-8ccc-cccccccccccc',created_ms:Date.now()-10000};
assert.equal(h.messageVisibleLocally(old,peer),true);
h.hideMessageLocally(old,peer);
assert.equal(h.messageVisibleLocally(old,peer),false,'Individual local delete persists');
const newMessage={id:'dddddddd-dddd-4ddd-8ddd-dddddddddddd',created_ms:Date.now()-5000};
assert.equal(h.messageVisibleLocally(newMessage,peer),true);
h.clearChatLocally(peer);
assert.equal(h.messageVisibleLocally(newMessage,peer),false,'Clear hides existing messages');
const future={id:'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',created_ms:Date.now()+1000};
assert.equal(h.messageVisibleLocally(future,peer),true,'New messages remain visible after clearing');
assert.ok(map.size===1&&[...map.values()][0].includes('clearedAt'));
console.log('PASS voice notes require explicit send, mobile pause, authenticated encrypted message edits and local clear');
