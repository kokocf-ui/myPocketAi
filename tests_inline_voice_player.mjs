import assert from 'node:assert/strict';
import vm from 'node:vm';
import {ORACLE_COMMUNICATION_SCRIPT,ORACLE_COMMUNICATION_STYLE}
 from './oracle_communication_ui.mjs';
import {readFileSync} from 'node:fs';

new vm.Script(ORACLE_COMMUNICATION_SCRIPT,{filename:'pocket-single-row-voice-player.js'});
const source=ORACLE_COMMUNICATION_SCRIPT;
const between=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));
const build=between('function buildInlineVoice(','\nconst voiceBtn=makeBtn(');
const refresh=between('async function refreshMessages(){','function resizeChatViewport(){');
const menus=between('function showVoiceChoiceMenu(','function voiceClock(');
assert.match(build,/audio=el\('audio'\)/,'Real HTML audio remains the playback engine');
assert.match(build,/audio\.controls=false/,'Hide native speaker/mute and browser overflow buttons');
assert.match(build,/audio\.hidden=true/,'Native player is invisible, not a second widget');
assert.match(build,/bar\.append\(play,time,speed,seek,trash,more\)/,
 'One horizontal bar holds all controls in their requested order');
assert.match(build,/speed=makeBtn\('1×'/,'Speed is inside the audio bar');
assert.match(build,/rates=\[1,1\.25,1\.5,2\]/,'Playback rates are 1×–2×');
assert.match(build,/audio\.playbackRate=next/,'Speed adjusts audio instead of being decorative');
assert.match(build,/seek\.type='range'/,'Slider is a genuine seek control');
assert.match(build,/audio\.currentTime=Number\(seek\.value\)\/1000\*audio\.duration/,
 'Seeking changes actual audio position');
assert.match(build,/audio\.addEventListener\('timeupdate',update\)/,'Counter updates while playing');
assert.match(build,/showVoiceDeleteOptions\(message,peer\)/,'Trash stays inside the bar');
assert.match(build,/showVoiceSaveOptions\(message,peer\)/,'Download stays in a bar-level overflow menu');
assert.match(build,/play\.textContent='❚❚'/,'Playback changes Play to Pause');
assert.match(build,/audio\.pause\(\)/,'Playback can be paused');
assert.match(build,/receiptType:'played'/,'Only actual playback reports listened receipts');
assert.doesNotMatch(build,/audio\.controls=true|comm-inline-audio-tools/,
 'No second row of buttons or built-in mute control');

assert.match(menus,/dialog=el\('dialog',undefined,'comm-voice-choice-menu'\)/);
assert.match(menus,/if\(event\.target===dialog\)close\(\)/,
 'Tapping outside the two actions dismisses them');
assert.doesNotMatch(menus,/confirmChatAction|chatModal\(/,
 'Never open a second confirmation frame for voice deletion');
assert.doesNotMatch(menus,/makeBtn\(tr\('Înapoi'|'Cancel'\)|makeBtn\('Înapoi'/,'No Back/Cancel button in voice choices');
assert.match(menus,/if\(message\.sender===identity\.id\)buttons\.push/,
 'Deleting for both is sender-only');
assert.match(menus,/action:'delete_message'/,'Server-synchronized delete remains');
assert.match(menus,/action:\(\)=>hideMessageLocally\(message,peer\)/,
 'Local-only deletion remains available to both parties');

assert.match(refresh,/existing=isAudio\?inlineVoiceRows\.get\(message\.id\):null/,
 'Same player survives 8-second chat polling');
assert.match(refresh,/transcript\.insertBefore\(wanted,current\)/);
assert.doesNotMatch(refresh,/transcript\.replaceChildren\(\.\.\.nodes\)/,
 'Refreshing chat must not stop current playback');
assert.match(refresh,/if\(isAudio\)\{\s*inlineVoiceRows\.set\(message\.id,row\);\s*\}else\{/,
 'Voice notes do not have a second footer or three-dot button');
assert.doesNotMatch(build,/saveMedia\(/,'Inline player does not open the old attachment viewer');
assert.match(source,/const target=audio\.parentElement\?\.querySelector\('\.comm-voice-bar'\)\|\|audio/,
 'Preloading observes the visible bar rather than hidden audio');
assert.match(source,/URL\.revokeObjectURL\(item\.url\)/,'Decrypted data is released on chat exit');
assert.match(ORACLE_COMMUNICATION_STYLE,/#view-communication \.comm-message\.comm-message--voice/);
assert.match(ORACLE_COMMUNICATION_STYLE,/background:transparent!important;border:0!important/,
 'No outer voice-message frame');
assert.match(ORACLE_COMMUNICATION_STYLE,/height:46px;min-height:46px/,
 'Playback bar is compact');
assert.match(ORACLE_COMMUNICATION_STYLE,/dialog\.comm-voice-choice-menu::backdrop/,
 'One lightweight outside-dismissable choice layer');

// Exercise actual menu callbacks without a browser: two actions for sender,
// only one for recipient, automatic close and click-outside dismissal.
const events=[];
const fakeNode=(tag,text,cls)=>({
 tag,textContent:text||'',className:cls||'',children:[],listeners:{},open:false,
 append(...children){this.children.push(...children)},
 addEventListener(name,fn){(this.listeners[name]??=[]).push(fn)},
 querySelectorAll(sel){return sel==='button'?this.children.filter(c=>c.tag==='button'):[]},
 close(){this.open=false;for(const fn of this.listeners.close||[])fn()},
 showModal(){this.open=true},
 remove(){events.push('removed')},
 set disabled(v){this._disabled=v},get disabled(){return !!this._disabled}
});
const document={body:{append(n){events.push('mounted');document.lastDialog=n}}};
const el=(tag,text,cls)=>fakeNode(tag,text,cls);
const makeBtn=(text,callback)=>{
 const b=fakeNode('button',text);
 b.listeners.click=[callback];
 return b;
};
const identity={id:'sender'};
const peer={id:'peer'};
let selected={id:'peer'};
const log=[];
const send=async request=>{log.push(request)};
const hideMessageLocally=async()=>{log.push({action:'local_hide'})};
const refreshMessages=async()=>{log.push({action:'refresh'})};
const setStatus=()=>{throw Error('Unexpected status error')};
const chatMutationError=e=>e.message;
const downloadInlineVoice=async()=>{log.push({action:'download'})};
const menuFn=new Function('el','makeBtn','document','tr','selected','identity',
 'hideMessageLocally','send','refreshMessages','setStatus','chatMutationError','downloadInlineVoice',
 menus+';return {showVoiceDeleteOptions,showVoiceSaveOptions};');
const choice=menuFn(el,makeBtn,document,(ro)=>ro,selected,identity,
 hideMessageLocally,send,refreshMessages,setStatus,chatMutationError,downloadInlineVoice);
const mine={id:'msg1',sender:'sender'};
let dialog=choice.showVoiceDeleteOptions(mine,peer);
assert.equal(dialog.children.length,2,'Sender sees exactly two options and no Back');
assert.ok(dialog.open);
await dialog.children[1].listeners.click[0]();
assert.ok(!dialog.open);
assert.equal(log[0].action,'delete_message');
assert.equal(log[0].messageId,mine.id);
log.length=0;
dialog=choice.showVoiceDeleteOptions({id:'msg2',sender:'peer'},peer);
assert.equal(dialog.children.length,1,'Receiver cannot delete a sender message for both');
await dialog.children[0].listeners.click[0]();
assert.equal(log[0].action,'local_hide');
log.length=0;
dialog=choice.showVoiceDeleteOptions(mine,peer);
await dialog.listeners.click[0]({target:dialog});
assert.equal(dialog.open,false,'Outside tap immediately dismisses without deleting');
assert.equal(log.length,0);
dialog=choice.showVoiceSaveOptions(mine,peer);
assert.equal(dialog.children.length,1,'Overflow offers only Save file');
await dialog.children[0].listeners.click[0]();
assert.equal(log[0].action,'download');
assert.equal(dialog.open,false);

const timeSource=between('function voiceClock(','function buildInlineVoice(');
const voiceClock=new Function(timeSource+';return voiceClock')();
assert.deepEqual([voiceClock(0),voiceClock(34),voiceClock(65),voiceClock(Infinity)],
 ['0:00','0:34','1:05','0:00']);

assert.match(readFileSync('oracle-communication/device-api.mjs','utf8'),
 /DELETE FROM device_messages WHERE id=\$1 AND sender_id=\$2 AND recipient_id=\$3 AND pair_key=\$4/,
 'Server still prevents unauthorized delete-for-both');
console.log('PASS voice notes: one bar, embedded speed/trash, scope-safe one-step delete, outside dismissal, polling and secure audio');
