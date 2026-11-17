import assert from 'node:assert/strict';
import vm from 'node:vm';
import {ORACLE_COMMUNICATION_SCRIPT as js,ORACLE_COMMUNICATION_STYLE as css}
 from './oracle_communication_ui.mjs';
import {readFileSync} from 'node:fs';

new vm.Script(js,{filename:'communication-final-ui.js'});
const block=(a,b)=>{const i=js.indexOf(a),j=js.indexOf(b,i+a.length);assert(i>=0&&j>i,'Section not found '+a);return js.slice(i,j)};
const render=block('async function refreshMessages(){','function resizeChatViewport(){');
const player=block('function buildInlineVoice(','\nconst voiceBtn=makeBtn(');
const attachments=block('const COMM_FILE_MIMES=Object.freeze({','async function encryptMedia(');
const textMenu=block('function showMessageActions(message,peer,visibleText,anchor){','\n// Receipt acknowledgement');
assert.match(render,/const row=el\('div',undefined,'comm-message '\+\(message\.sender===identity\.id\?'mine':'theirs'\)/);
assert.match(css,/\.comm-message\.mine\.comm-message--voice/,'Own voice styled independently');
assert.match(css,/\.comm-message\.theirs\.comm-message--voice/,'Incoming voice styled independently');
assert.match(css,/align-self:flex-end!important;margin:0 3px 0 auto!important/,'Own voice right-aligned');
assert.match(css,/align-self:flex-start!important;margin:0 auto 0 3px!important/,'Incoming voice left-aligned');
assert.match(css,/\.comm-message\.mine\.comm-message--voice \.comm-voice-bar\{\s*background:#65324b!important/,
 'Own audio uses burgundy');
assert.match(css,/\.comm-message\.theirs\.comm-message--voice \.comm-voice-bar\{\s*background:#294353!important/,
 'Incoming audio uses petrol blue');
assert.match(css,/\.comm-message\.comm-message--voice\{\s*width:min\(80vw,316px\)!important/,
 'Narrower audio player still contains the playback seek slider');
assert.match(css,/\.comm-message\.comm-message--text\.mine/,'Own text uses outgoing theme');
assert.match(css,/\.comm-message\.comm-message--text\.theirs/,'Incoming text uses incoming theme');
assert.match(css,/\.comm-message--text \.comm-message-footer,[\s\S]*?min-height:0!important/,
 'No large blank footer in short text messages');
assert.match(css,/\.comm-message--text \.comm-message-menu,[\s\S]*?position:absolute!important/,
 'Text menu lives outside message bubble');
assert.match(css,/\.comm-message--text\.mine \.comm-message-menu,[\s\S]*?left:calc\(100% \+ 5px\)!important;right:auto!important/, 
 'Menu is outside the sender bubble');
assert.match(render,/makeBtn\('⋮',\(\)=>showMessageActions/,
 'Text uses a vertical ellipsis');
assert.match(player,/makeBtn\('⋮',\(\)=>showVoiceSaveOptions/,
 'Voice uses a vertical ellipsis');
assert.match(textMenu,/return showVoiceChoiceMenu\(options,\{anchor,placement:'below',side:mine\?'right':'left'\}\)/,'Text options use anchored, outside-dismiss choice menu');
assert.doesNotMatch(textMenu,/chatModal\(|confirmChatAction\(/,
 'Message context menu does not use nested framed confirmation');
assert.match(css,/dialog\.comm-voice-choice-menu\{\s*box-sizing:border-box!important;display:flex!important/,
 'Choice menu is content-sized and stacked');
assert.match(css,/width:max-content!important;max-width:min\(88vw,320px\)/,
 'Menu width follows the longest action rather than full screen');
assert.match(js,/if\(event\.target===dialog\)close\(\)/,'Outside taps dismiss choice menus');

// Exercise the file selector options and confirm APKs remain inert file attachments.
const fakePicker={accept:'',clicks:0,click(){this.clicks++}};
const selected={id:'peer'};
const showVoiceChoiceMenu=actions=>actions;
const make= new Function('mediaPicker','selected','showVoiceChoiceMenu','tr','attachButton',
 attachments+';return {communicationAttachmentMime,showAttachmentChoices,COMM_FILE_MIMES};');
const h=make(fakePicker,selected,showVoiceChoiceMenu,(ro,en)=>ro,{getBoundingClientRect:()=>({})});
const actions=h.showAttachmentChoices();
assert.deepEqual(actions.map(x=>x.label),['📄 Fișier','🖼 Fotografie','🎬 Video']);
actions[0].action();
assert.match(fakePicker.accept,/\.apk/,'File picker explicitly supports Android APK');
assert.match(fakePicker.accept,/\.pdf/);
actions[1].action();assert.equal(fakePicker.accept,'image/*');
actions[2].action();assert.equal(fakePicker.accept,'video/*');
assert.equal(fakePicker.clicks,3);
assert.equal(h.communicationAttachmentMime({name:'demo.apk',type:'application/octet-stream'}),
 'application/vnd.android.package-archive');
assert.equal(h.communicationAttachmentMime({name:'demo.apk',type:''}),
 'application/vnd.android.package-archive');
assert.equal(h.communicationAttachmentMime({name:'file.pdf',type:'application/pdf'}),'application/pdf');
assert.equal(h.communicationAttachmentMime({name:'data.docx',type:''}),h.COMM_FILE_MIMES.docx);
assert.equal(h.communicationAttachmentMime({name:'malware.exe',type:'application/x-msdownload'}),null);
assert.equal(h.communicationAttachmentMime({name:'demo.apk',type:'image/png'}),null);
assert.doesNotMatch(js,/makeBtn\(tr\('Listă de cumpărături'/,
 'Shopping list is shared from Organize rather than attachment menu');
assert.match(js,/const MAX_MEDIA_SIZE=11\*1024\*1024/,'Existing 11 MiB safety cap remains');
assert.match(js,/if\(file\.size>MAX_MEDIA_SIZE\)/,'Client checks size before encryption');
assert.match(js,/media\.mime==='application\/vnd\.android\.package-archive'\?'apk'/,
 'Downloaded APK retains its extension');
assert.match(js,/instalarea nu pornește automat/,'APK is never installed or executed by chat');
assert.match(js,/kind=mime\.startsWith\('image\/'\)\?'image':mime\.startsWith\('video\/'\)\?'video'/,
 'Photo and video remain distinguishable');
assert.match(js,/kind,mime,encryptedName/,'File metadata remains encrypted and anonymous');

// Dynamic test: message menu differs for sender versus recipient.
const messageActions=new Function('selected','identity','showVoiceChoiceMenu','tr',
 'hideMessageLocally','send','refreshMessages','setTimeout','showTextEditForm',
 textMenu+';return showMessageActions;');
const ops=[];
const handler=messageActions(selected,{id:'me'},entries=>entries,(ro,en)=>ro,
 async()=>{ops.push('local')},async p=>{ops.push(p.action)},
 async()=>{ops.push('refresh')},()=>{},()=>{});
const other=handler({id:'a',kind:'text',sender:'peer'},selected,'hi');
const mine=handler({id:'b',kind:'text',sender:'me'},selected,'hello');
assert.equal(other.length,1,'Receiver sees only local delete');
assert.equal(mine.length,3,'Sender sees Edit/Local/Delete-for-both');
assert.ok(mine.some(x=>/De la amândoi/.test(x.label)));
await other[0].action();assert.deepEqual(ops,['local']);
ops.length=0;await mine[2].action();assert.deepEqual(ops,['delete_message','refresh']);

const api=readFileSync('oracle-communication/device-api.mjs','utf8');
assert.match(api,/const data=await readBody\(req,17000000\)/,
 'Oracle request body bound remains within current safe capacity');
assert.match(api,/data\.cipher\.length<=15600000/,
 'Oracle encrypted payload size limit is unchanged');
assert.match(api,/DELETE FROM device_messages WHERE id=\$1 AND sender_id=\$2 AND recipient_id=\$3 AND pair_key=\$4/,
 'Oracle ensures only original sender can delete for both');
console.log('PASS final chat layout: own/their audio/text, compact outside menus, three attachment choices, APK <= 11 MiB and safe scoped deletion');
