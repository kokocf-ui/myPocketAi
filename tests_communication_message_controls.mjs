import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {ORACLE_COMMUNICATION_SCRIPT,ORACLE_COMMUNICATION_STYLE} from './oracle_communication_ui.mjs';
import {CREATOR_SITE_STYLE} from './creator_site_ui.mjs';

new vm.Script(ORACLE_COMMUNICATION_SCRIPT,{filename:'chat-voice-pause-and-send.js'});
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function voiceDraftReady\(file\)/,'Pausing creates a playable local draft');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function syncDeliveredMessages\(\)/,'Active client acknowledges encrypted message envelope retrieval');

assert.match(ORACLE_COMMUNICATION_SCRIPT,/packageContents:item\.unit==='bax'/,
 'Sharing a local shopping list retains explicit per-bax contents');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/packageContents:String\(op\.detail\?\.packageContents\|\|''\)/,
 'Shared list replay restores optional per-bax contents');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/item\.packageContents\?' · '\+item\.packageContents\+'\/bax'/,
 'Recipient can see the contents of each bax without opening product details');

assert.match(ORACLE_COMMUNICATION_SCRIPT,/action:'pending_messages'/,'Client explicitly fetches pending incoming messages');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/action:'receipt',friend,receiptType:'delivered'/,'Delivery requires an authenticated app receipt');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/messageReadObserver=new IntersectionObserver/,'Read requires visible message on active chat screen');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/document\.visibilityState==='hidden'/,'Background app cannot claim message was read');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/action:'receipt',friend:peerId,receiptType:'read'/,'Receiver acknowledges visible messages');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/audio\.addEventListener\('playing'/,'Audio listened receipt only when playback starts');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/message\.played_at\?tr\('▶ Ascultat'/,'Listened status is displayed');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/message\.delivered_at\?tr\('✓✓ Livrat'/,'Delivered state distinguished from server accepted');


assert.match(ORACLE_COMMUNICATION_SCRIPT,/media\.kind==='audio'\?tr\('🎙 Mesaj vocal'/,'Audio attachment is identified in the private viewer');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/media\.mime==='audio\/mp4'\?'m4a'/,'AAC audio is saved with an M4A extension');

assert.match(ORACLE_COMMUNICATION_SCRIPT,/voicePlayer\.src=voiceDraftUrl/,'Audio can be replayed while paused');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/URL\.revokeObjectURL\(voiceDraftUrl\)/,'Discard releases local audio URL');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/const voicePauseButton=makeBtn/,'Voice has Pause/Resume');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/const voiceSendButton=makeBtn/,'Voice has explicit Send');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/const voiceDeleteButton=makeBtn/,'Voice has Delete');
assert.doesNotMatch(ORACLE_COMMUNICATION_SCRIPT,/voiceStopButton/,'No separate Stop button');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/voiceActions\.append\(voicePauseButton,voiceSendButton,voiceDeleteButton\)/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/nativeVoiceBridge\.postMessage\('pause'\)/,'Pause asks Android for a local preview');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/nativeVoiceBridge\.postMessage\('resume'\)/,'Continue records a second segment');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/nativeVoiceBridge\.postMessage\('send'\)/,'Send finalizes only on direct user action');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/if\(event\.status==='preview'\|\|event\.status==='complete'\)/,'Paused and final previews use the same validated bridge');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/if\(event\.status==='complete'&&voiceSending\)void sendVoiceDraft\(\)/,'Final capture uploads only after explicit Send');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/const success=await uploadChosenFile\(voiceDraft\)/,'Draft is encrypted and uploaded explicitly');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function buildBrowserVoice\(/,'Browser can preserve multiple segments');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/if\(voiceWebCancelled\)return/,'Cancelled capture cannot upload');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/event\.parts>512/,'Segmented transfer uses bounded chunks');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/Array\.from\(\{length:event\.parts\}/,'Missing audio chunks are rejected');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/selected\.id!==voiceDraftPeer/,'Late completion cannot target another contact');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/action:'edit_message'/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/action:'delete_message'/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function clearChatLocally\(peer\)/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function showMessageActions\(message,peer,visibleText,anchor\)/);
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function confirmChatAction\(/);
assert.match(ORACLE_COMMUNICATION_STYLE,/\.comm-voice-panel/);
assert.match(ORACLE_COMMUNICATION_STYLE,/dialog\.comm-action-dialog/);
assert.match(CREATOR_SITE_STYLE,/\.extra-creator-option-actions\{display:grid!important;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(CREATOR_SITE_STYLE,/min-height:76px!important;align-self:stretch!important/);

const path='android/app/src/main/java/ai/mypocket/mobile/MainActivity.java';
const native=readFileSync(path,'utf8');
assert.match(native,/private boolean commVoicePaused=false/);
assert.match(native,/MediaExtractor/,'Android can extract AAC packets');
assert.match(native,/MediaMuxer/,'Continuation joins AAC packets into one valid MP4');

assert.match(native,/if\(commVoiceSegments\.size\(\)==1\)\{\s*merged=commVoiceSegments\.get\(0\)/,'Single voice message sends finalized AAC without unsafe remux');
assert.match(native,/if\(temporaryMerged&&merged!=null\)merged\.delete\(\)/,'Pause preview never deletes the saved original recording');
assert.match(native,/String failureStage="RECORD_PREPARE_FAILED"/,'Native failures identify audio preparation stage');
assert.match(native,/failureStage="RECORD_TRANSFER_FAILED"/,'Native transfer failures are distinguished');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/RECORD_PREPARE_FAILED:tr/,'UI reports native preparation failure distinctly');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/RECORD_TRANSFER_FAILED:tr/,'UI reports native chunk transfer failure distinctly');

assert.match(native,/ArrayList<File> commVoiceSegments/,'Multiple speech clips remain on-device until Send or Delete');
assert.match(native,/void resumeCommVoice\(\)/,'Android supports Resume');
assert.match(native,/finishCommVoice\(true,true\)/,'Pause prepares local playback');
assert.match(native,/finishCommVoice\(true,false\)/,'Send finalizes for upload');
assert.match(native,/notifyCommVoice\(preview\?"preview":"complete"/,'Pause does not auto-send');
assert.match(native,/if\("cancel"\.equals\(action\)\)cancelCommVoice\(\)/,'Delete cleans temporary recordings');
assert.match(native,/CountDownLatch/,'Transport waits for WebView chunk acknowledgment');
assert.match(native,/if\(parts>0\)event\.put\("parts",parts\)/,'Preview and completion events include the total fragment count even without part index');
assert.match(native,/if\(part>=0\)event\.put\("part",part\)/,'The fragment index is optional for preview and completion');
assert.doesNotMatch(native,/if\(part>=0\)\{event\.put\("part",part\);event\.put\("parts",parts\);\}/,'Voice completion does not lose total fragment count');

assert.match(native,/ack\.await\(5,java\.util\.concurrent\.TimeUnit\.SECONDS\)/);
assert.match(native,/new byte\[24\*1024\]/,'Audio chunks remain small');
assert.match(native,/if\(!notifyCommVoice\("chunk"/,'Transfer must be acknowledged');
assert.match(native,/!"send"\.equals\(command\)/,'Android bridge permits explicit Send');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/function armNativeVoiceWatchdog\(ms\)/,'Bridge cannot wait forever');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/message\.attachment_kind==='audio'/,'Audio envelopes use attachment metadata in the chat bubble');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/if\(message\.kind!=='text'\)/,'Attachments remain accessible');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/if\(nativeVoicePending\|\|nativeVoiceRecording\|\|voiceDraft\)/,'Back respects active recordings');

const oracle=readFileSync('oracle-communication/device-api.mjs','utf8');
assert.match(oracle,/edit_message','delete_message/,'Oracle allows the two authenticated actions');
assert.match(oracle,/check\(await approved\(pool,me,friend\)/,'Actions require an approved peer');
assert.match(oracle,/UPDATE device_messages SET iv=\$4,cipher=\$5 WHERE id=\$1 AND sender_id=\$2 AND recipient_id=\$3 AND pair_key=\$6 AND kind='text'/,'Edit only own encrypted text');
assert.match(oracle,/DELETE FROM device_messages WHERE id=\$1 AND sender_id=\$2 AND recipient_id=\$3 AND pair_key=\$4/,'Delete only own message');
assert.match(oracle,/if\(action==='pending_messages'\)/,'Server returns encrypted pending messages only to logged-in recipient');
assert.match(oracle,/if\(action==='receipt'\)/,'Receipt action requires the existing signed request');
assert.match(oracle,/m\.recipient_id=\$1 AND m\.sender_id=\$2 AND m\.pair_key=\$3/,'Only message recipient can acknowledge');
assert.match(oracle,/receiptType/,'Stages are signed in the request');
assert.match(oracle,/m\.played_at/,'Play receipt exists on backend');
assert.match(oracle,/a\.kind='audio'/,'Play receipt is limited to actual audio attachments');

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
