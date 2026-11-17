import assert from 'node:assert/strict';
import vm from 'node:vm';
import {ORACLE_COMMUNICATION_SCRIPT,ORACLE_COMMUNICATION_STYLE}
 from './oracle_communication_ui.mjs';
import {readFileSync} from 'node:fs';

new vm.Script(ORACLE_COMMUNICATION_SCRIPT,{filename:'pocket-inline-voice-player.js'});
const source=ORACLE_COMMUNICATION_SCRIPT;
const build=source.slice(source.indexOf('function buildInlineVoice('),
 source.indexOf('\nconst voiceBtn=makeBtn(',source.indexOf('function buildInlineVoice(')));
assert.match(build,/audio=el\('audio'\)/,'The message bubble contains the real HTML audio element');
assert.match(build,/audio\.controls=true/,'Native play/pause and timeline are always visible inline');
assert.match(build,/audio\.preload='metadata'/,'Player should be lightweight');
assert.match(build,/queueInlineVoice\(message,peer,audio\)/,'Voice is prepared for direct playback');
assert.doesNotMatch(build,/saveMedia\(/,'Inline voice never opens a separate attachment dialog');
assert.match(build,/\[1,1\.25,1\.5,2\]/,'Playback speed cycles through useful rates');
assert.match(build,/audio\.playbackRate=next/,'Speed control changes the actual player rate');
assert.match(build,/showVoiceDeleteOptions\(message,peer\)/,'Trash opens the deletion choice');
assert.match(build,/receiptType:'played'/,'A receipt is sent on real playback');
assert.match(build,/if\(message\.sender!==identity\.id\)/,'Only recipient reports listened receipt');

const render=source.slice(source.indexOf('async function refreshMessages(){'),
 source.indexOf('function resizeChatViewport(){'));
assert.match(render,/existing=isAudio\?inlineVoiceRows\.get\(message\.id\):null/,
 'The same player is reused during message polling');
assert.match(render,/if\(existing\)\{[\s\S]*?nodes\.push\(existing\)/,
 'Active audio element remains intact during polling');
assert.match(render,/transcript\.insertBefore\(wanted,current\)/,
 'Incremental reconciliation does not recreate active players');
assert.doesNotMatch(render,/transcript\.replaceChildren\(\.\.\.nodes\)/,
 'Full transcript replacement would stop active audio each 8 seconds');
assert.match(render,/if\(!isAudio\)row\.append\(el\('div',visibleText,'comm-message-body'\)\)/,
 'Avoid duplicate Message voice header');
assert.match(render,/if\(isAudio\)buildInlineVoice\(message,peer,row\)/);
assert.match(render,/if\(message\.kind!=='text'\)/,'Regular attachments still work');
assert.doesNotMatch(render,/▶ Ascultă mesajul/,'Do not show a duplicate open-and-play control');

const actions=source.slice(source.indexOf('function showMessageActions('),
 source.indexOf('async function refreshMessages(){'));
assert.match(actions,/message\.kind==='audio'\|\|message\.attachment_kind==='audio'/,
 'Voice menu keeps a dedicated download action');
assert.match(actions,/downloadInlineVoice\(message,peer\)/,
 'Save is not a second audio playback modal');
assert.match(source,/function showVoiceDeleteOptions\(message,peer\)/);
assert.match(source,/hideMessageLocally\(message,peer\)/,'Local deletion must work');
assert.match(source,/if\(message\.sender===identity\.id\)\{[\s\S]*?action:'delete_message'/,
 'Only the sender can delete the message for both');
assert.match(source,/clearInlineVoicePlayers\(\);\s*selected=null/,
 'Private object URLs are revoked upon leaving chat');
assert.match(source,/clearInlineVoicePlayers\(\);\s*showMain\(\);selected=peer/,
 'Private object URLs are revoked when opening another contact');
assert.match(source,/URL\.revokeObjectURL\(item\.url\)/,
 'Decrypted attachment URLs are cleaned up');
assert.match(source,/const inlineVoiceObserver=typeof IntersectionObserver/,
 'Voice blobs are loaded lazily near the visible messages');
assert.match(source,/media\?\.kind!=='audio'/,
 'Inline audio only decrypts authenticated voice attachments');

assert.match(ORACLE_COMMUNICATION_STYLE,/\.comm-message--voice/);
assert.match(ORACLE_COMMUNICATION_STYLE,/\.comm-inline-audio-tools/);
assert.match(ORACLE_COMMUNICATION_STYLE,/\.comm-inline-trash/);
assert.match(ORACLE_COMMUNICATION_STYLE,/\.comm-inline-speed|\.comm-inline-audio-tools button/);
assert.match(ORACLE_COMMUNICATION_STYLE,/width:min\(82vw,312px\)/,
 'Voice bubbles stay compact rather than using most of the screen');
assert.match(readFileSync('oracle-communication/device-api.mjs','utf8'),
 /DELETE FROM device_messages WHERE id=\$1 AND sender_id=\$2 AND recipient_id=\$3 AND pair_key=\$4/,
 'Server enforces sender-only deletion for both');
console.log('PASS inline encrypted voice: one-tap native controls, speed, compact bubbles, real scoped deletion and playback-safe polling');
