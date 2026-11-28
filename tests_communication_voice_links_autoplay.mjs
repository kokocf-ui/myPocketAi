import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {ORACLE_COMMUNICATION_SCRIPT,ORACLE_COMMUNICATION_STYLE} from './oracle_communication_ui.mjs';
import {COMMUNICATION_MEDIA_SCRIPT} from './communication_media_ui.mjs';
import {COMMUNICATION_DELIVERY_SCRIPT} from './communication_delivery_ui.mjs';

new vm.Script(ORACLE_COMMUNICATION_SCRIPT,{filename:'oracle-communication-voice-links-autoplay.js'});

const mainActivity=readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');

// 1. Multi-minute voice notes: 1-minute (60000 ms) cap removed in both Android native & Web fallback.
assert.doesNotMatch(mainActivity,/postDelayed\(commVoiceTimeout,\s*60000L\)/,
 'Android native voice recorder must not cut off recordings at 60 seconds');
assert.match(mainActivity,/setAudioEncodingBitRate\(32000\)/,
 'Speech-optimized 32 kbps AAC fits ~45 minutes inside the 11 MB E2EE media limit');
assert.match(mainActivity,/MEDIA_RECORDER_INFO_MAX_FILESIZE_REACHED/,
 'Native recorder stops cleanly if approaching the 11 MB attachment ceiling');
assert.match(mainActivity,/postDelayed\(commVoiceTimeout,\s*2700000L\)/,
 'Native safety timeout allows up to 45 continuous minutes');
assert.doesNotMatch(ORACLE_COMMUNICATION_SCRIPT,/},\s*60000\);/,
 'Browser MediaRecorder fallback must not cut off recordings at 60 seconds');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/audioBitsPerSecond:32000/,
 'Browser MediaRecorder uses 32 kbps speech bitrate for multi-minute notes');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/},\s*2700000\);/,
 'Browser safety timeout allows up to 45 continuous minutes');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/getUserMedia\(\{audio:true\}\)/,
 'Microphone permission request contract remains intact');

// Verify voiceClock formatting across multi-minute durations.
const voiceClockFn=new Function(
 ORACLE_COMMUNICATION_SCRIPT.slice(
  ORACLE_COMMUNICATION_SCRIPT.indexOf('function voiceClock('),
  ORACLE_COMMUNICATION_SCRIPT.indexOf('function buildInlineVoice(')
 )+';return voiceClock;'
)();
assert.equal(voiceClockFn(0),'0:00');
assert.equal(voiceClockFn(65),'1:05');
assert.equal(voiceClockFn(185),'3:05');
assert.equal(voiceClockFn(754),'12:34');

// 2. Clickable links in chat messages (DOM-safe, balanced punctuation, Android bridge + web target=_blank).
assert.match(mainActivity,/PocketAndroidExternalLink/,
 'Android WebView exposes first-party external link bridge');
assert.match(mainActivity,/Intent\.CATEGORY_BROWSABLE/,
 'External links open safely in browsable apps');
assert.match(ORACLE_COMMUNICATION_STYLE,/\.comm-message-body a\.comm-chat-link\{/,
 'Chat links have dedicated visible underline styling');
assert.match(COMMUNICATION_DELIVERY_SCRIPT,/renderChatMessageBody\(previewText\)/,
 'Pending outgoing messages also render clickable links immediately');

function makeMockDom(){
 const makeClassList=(initial='')=>{
  const set=new Set(String(initial).split(/\s+/).filter(Boolean));
  return {
   add:(...names)=>names.forEach(n=>n&&set.add(n)),
   remove:(...names)=>names.forEach(n=>set.delete(n)),
   contains:n=>set.has(n),
   toString:()=>[...set].join(' ')
  };
 };
 function createNode(tag,text,className){
  const listeners={};
  const attrs={};
  let clsStr=String(className||'');
  let clsList=makeClassList(clsStr);
  const node={
   tagName:String(tag||'div').toUpperCase(),
   textContent:text!==undefined?String(text):'',
   get className(){return clsStr},
   set className(val){clsStr=String(val||'');clsList=makeClassList(clsStr)},
   get classList(){return clsList},
   dataset:{},
   style:{setProperty(){},removeProperty(){}},
   children:[],
   parentNode:null,
   get parentElement(){return node.parentNode},
   isConnected:true,
   hidden:false,
   disabled:false,
   href:'',
   target:'',
   rel:'',
   src:'',
   currentTime:0,
   duration:14,
   playbackRate:1,
   paused:true,
   preload:'',
   append(...items){
    for(const item of items){
     if(!item)continue;
     item.parentNode=node;
     node.children.push(item);
    }
   },
   replaceChildren(...items){
    node.children=[];
    node.append(...items);
   },
   setAttribute(k,v){attrs[k]=String(v)},
   getAttribute(k){return attrs[k]},
   addEventListener(type,fn,opts){
    (listeners[type]??=[]).push({fn,once:Boolean(opts?.once)});
   },
   dispatch(type,extra={}){
    const list=[...(listeners[type]||[])];
    if(list.some(x=>x.once)){
     listeners[type]=(listeners[type]||[]).filter(x=>!x.once);
    }
    const ev={
     type,
     defaultPrevented:false,
     propagationStopped:false,
     preventDefault(){this.defaultPrevented=true},
     stopPropagation(){this.propagationStopped=true},
     ...extra
    };
    for(const entry of list)entry.fn(ev);
    return ev;
   },
   get nextElementSibling(){
    if(!node.parentNode)return null;
    const siblings=node.parentNode.children;
    const i=siblings.indexOf(node);
    return i>=0&&i+1<siblings.length?siblings[i+1]:null;
   },
   querySelector(sel){
    return node.querySelectorAll(sel)[0]||null;
   },
   querySelectorAll(sel){
    const out=[];
    const match=(el)=>{
     if(!el||!el.tagName)return false;
     if(sel==='audio.comm-inline-audio'||sel==='audio')return el.tagName==='AUDIO';
     if(sel==='a.comm-chat-link'||sel==='a')return el.tagName==='A';
     if(sel.startsWith('.'))return el.classList?.contains(sel.slice(1));
     return el.tagName===sel.toUpperCase();
    };
    const walk=(cur)=>{
     for(const child of cur.children||[]){
      if(match(child))out.push(child);
      walk(child);
     }
    };
    walk(node);
    return out;
   }
  };
  if(node.tagName==='AUDIO'){
   node.play=()=>{
    node.paused=false;
    node.dispatch('play');
    node.dispatch('playing');
    return Promise.resolve();
   };
   node.pause=()=>{
    if(!node.paused){
     node.paused=true;
     node.dispatch('pause');
    }
   };
  }
  return node;
 }
 const document={
  createElement:(tag)=>createNode(tag),
  createTextNode:(val)=>({nodeType:3,textContent:String(val??'')})
 };
 const el=(tag,text,cls)=>createNode(tag,text,cls);
 const makeBtn=(label,cb)=>{const b=createNode('button',label);b.addEventListener('click',cb);return b};
 return {document,el,makeBtn,createNode};
}

const {document,el,makeBtn,createNode}=makeMockDom();
const externalOpened=[];
const invitesReceived=[];
const win={
 PocketAndroidExternalLink:{postMessage:url=>externalOpened.push(url)},
 pocketInviteReceived:code=>invitesReceived.push(code)
};

const helperSlice=COMMUNICATION_MEDIA_SCRIPT.slice(
 COMMUNICATION_MEDIA_SCRIPT.indexOf('const inlineTextRows=new Map();'),
 COMMUNICATION_MEDIA_SCRIPT.indexOf('let deliverySyncBusy=')
);
const transcript=createNode('div',undefined,'comm-transcript');
const root=createNode('section',undefined,'view active');
const chat=createNode('div',undefined,'comm-chat');
chat.hidden=false;
let selected={id:'friend-1'};
const identity={id:'me-1'};
const inlineVoiceMetadata=new Map();
const loadedAudioIds=[];
const playedReceiptIds=[];
async function loadInlineVoice(message,_peer,audio){
 loadedAudioIds.push(message.id);
 audio.src='blob:voice-'+message.id;
 audio.dataset.loadState='ready';
}
function noteVoicePlayback(message){
 playedReceiptIds.push(message.id);
}

const helpers=new Function(
 'document','window','el','tr','INVITE_ROOT',
 'inlineVoiceMetadata','loadInlineVoice','selected','chat','root',
 helperSlice+';return {splitChatTextLinks,renderChatMessageBody,inlineTextRows,clearInlineTextRows,forgetMissingInlineText,preloadNextReceivedVoiceRow,autoPlayNextReceivedVoiceRow};'
)(
 document,win,el,(ro)=>ro,'https://mypocketai.duckdns.org/i/',
 inlineVoiceMetadata,loadInlineVoice,selected,chat,root
);

// Plain text without links stays plain text.
const plainBody=helpers.renderChatMessageBody('Salut! Ne vedem la ora 18:30.');
assert.equal(plainBody.textContent,'Salut! Ne vedem la ora 18:30.');
assert.equal(plainBody.querySelectorAll('a').length,0);

// Rich message with https, www, Wikipedia balanced parens, and trailing punctuation.
const richText='Vezi https://exemplu.ro/oferta?x=1, sau (www.exemplu.ro/meniu)! Detalii: https://ro.wikipedia.org/wiki/Oradea_(dezambiguizare).';
const richBody=helpers.renderChatMessageBody(richText);
const links=richBody.querySelectorAll('a');
assert.equal(links.length,3);
assert.equal(links[0].href,'https://exemplu.ro/oferta?x=1');
assert.equal(links[0].textContent,'https://exemplu.ro/oferta?x=1');
assert.equal(links[0].target,'_blank');
assert.equal(links[0].rel,'noopener noreferrer');
assert.equal(links[1].href,'https://www.exemplu.ro/meniu');
assert.equal(links[1].textContent,'www.exemplu.ro/meniu');
assert.equal(links[2].href,'https://ro.wikipedia.org/wiki/Oradea_(dezambiguizare)');
const reconstructed=richBody.children.map(n=>n.textContent).join('');
assert.equal(reconstructed,richText,'Linkification preserves every character including punctuation');

// Clicking normal link uses Android bridge when available and stops bubble propagation.
const clickEv=links[0].dispatch('click');
assert.equal(clickEv.defaultPrevented,true);
assert.equal(clickEv.propagationStopped,true);
assert.deepEqual(externalOpened,['https://exemplu.ro/oferta?x=1']);

// Clicking a myPocketAI invite link routes directly to pocketInviteReceived.
const inviteToken='AbCdEfGhIjKlMnOpQrStUvWxYz0123456789_-abcdef';
const inviteBody=helpers.renderChatMessageBody('Intră aici: https://mypocketai.duckdns.org/i/'+inviteToken);
const inviteLink=inviteBody.querySelector('a');
assert.ok(inviteLink);
inviteLink.dispatch('click');
assert.deepEqual(invitesReceived,[inviteToken]);

// Unsafe markup/schemes are never rendered as executable HTML or javascript: links.
const unsafeBody=helpers.renderChatMessageBody('<img src=x onerror=alert(1)> javascript:alert(1)');
assert.equal(unsafeBody.querySelectorAll('a').length,0);
assert.equal(unsafeBody.textContent,'<img src=x onerror=alert(1)> javascript:alert(1)');

// 3. Sequential auto-play ONLY for consecutive received voice messages.
assert.match(mainActivity,/settings\.setMediaPlaybackRequiresUserGesture\(false\)/,
 'Android WebView allows sequential voice-note playback on audio ended without a second tap');

const buildInlineVoiceSource=ORACLE_COMMUNICATION_SCRIPT.slice(
 ORACLE_COMMUNICATION_SCRIPT.indexOf('function buildInlineVoice('),
 ORACLE_COMMUNICATION_SCRIPT.indexOf('\nconst voiceBtn=makeBtn(')
);
function queueInlineVoice(message,peer,audio){
 const target=audio.parentElement?.querySelector('.comm-voice-bar')||audio;
 inlineVoiceMetadata.set(target,{message,peer,audio});
}
const buildInlineVoice=new Function(
 'el','makeBtn','tr','identity','transcript','inlineVoiceMetadata',
 'inlineVoiceObserver','queueInlineVoice','loadInlineVoice','showVoiceDeleteOptions',
 'showVoiceSaveOptions','noteVoicePlayback','voiceClock','updateMessageReceipt',
 'preloadNextReceivedVoiceRow','autoPlayNextReceivedVoiceRow',
 buildInlineVoiceSource+';return buildInlineVoice;'
)(
 el,makeBtn,(ro)=>ro,identity,transcript,inlineVoiceMetadata,
 {observe(){}},queueInlineVoice,loadInlineVoice,()=>{},()=>{},noteVoicePlayback,voiceClockFn,()=>{},
 helpers.preloadNextReceivedVoiceRow,helpers.autoPlayNextReceivedVoiceRow
);

function appendVoiceMessage(id,sender){
 const row=createNode('div',undefined,'comm-message '+(sender===identity.id?'mine':'theirs'));
 const msg={id,sender,kind:'attachment',mime:'audio/mp4',durationSec:8,created_ms:Date.now()};
 buildInlineVoice(msg,selected,row);
 transcript.append(row);
 return {row,audio:row.querySelector('audio'),playBtn:row.querySelector('.comm-voice-play'),speedBtn:row.querySelector('.comm-inline-speed')};
}
function appendTextMessage(id,sender,text){
 const row=createNode('div',undefined,'comm-message '+(sender===identity.id?'mine':'theirs')+' comm-message--text');
 row.append(helpers.renderChatMessageBody(text));
 transcript.append(row);
 return row;
}

// Transcript layout:
// v1 (theirs) -> v2 (theirs) -> v3 (theirs) -> text1 (theirs) -> v4 (theirs) -> v5 (mine) -> v6 (theirs)
const v1=appendVoiceMessage('v1','friend-1');
const v2=appendVoiceMessage('v2','friend-1');
const v3=appendVoiceMessage('v3','friend-1');
appendTextMessage('t1','friend-1','Un mesaj text între vocale');
const v4=appendVoiceMessage('v4','friend-1');
const v5Mine=appendVoiceMessage('v5','me-1');
const v6=appendVoiceMessage('v6','friend-1');

// Start playing v1 at 1.5x speed.
await loadInlineVoice({id:'v1'},selected,v1.audio);
v1.speedBtn.dispatch('click'); // 1x -> 1.25x
v1.speedBtn.dispatch('click'); // 1.25x -> 1.5x
assert.equal(v1.audio.playbackRate,1.5);
await v1.audio.play();
assert.equal(v1.playBtn.textContent,'❚❚');
assert.ok(loadedAudioIds.includes('v2'),'Playing v1 preloads consecutive received v2 ahead of time');

// Manual pause must NOT auto-play v2.
v1.audio.pause();
assert.equal(v2.audio.paused,true,'Manual pause never triggers auto-play');

// Resume v1 and let it finish ('ended') -> v2 must auto-play at 1.5x and preload v3!
await v1.audio.play();
v1.audio.paused=true;
v1.audio.dispatch('ended');
await new Promise(r=>setTimeout(r,10));
assert.equal(v2.audio.paused,false,'v2 starts playing automatically when v1 finishes');
assert.equal(v2.audio.playbackRate,1.5,'Playback speed carries over across consecutive received voice notes');
assert.equal(v2.speedBtn.textContent,'1.5×');
assert.equal(v2.playBtn.textContent,'❚❚');
assert.ok(loadedAudioIds.includes('v3'),'Starting v2 preloads consecutive received v3');

// Let v2 finish -> v3 must auto-play!
v2.audio.paused=true;
v2.audio.dispatch('ended');
await new Promise(r=>setTimeout(r,10));
assert.equal(v3.audio.paused,false,'v3 starts playing automatically when v2 finishes');
assert.equal(v3.audio.playbackRate,1.5);
assert.deepEqual(playedReceiptIds,['v1','v2','v3'],'Played receipts recorded as each voice note actually plays');

// Let v3 finish -> next row is text ('t1'), so v4 must NOT auto-play!
v3.audio.paused=true;
v3.audio.dispatch('ended');
await new Promise(r=>setTimeout(r,10));
assert.equal(v4.audio.paused,true,'Auto-play stops when sequence is interrupted by a text message');

// Play v4 (incoming) followed by v5Mine (outgoing) -> v5Mine must NOT auto-play!
await loadInlineVoice({id:'v4'},selected,v4.audio);
await v4.audio.play();
v4.audio.paused=true;
v4.audio.dispatch('ended');
await new Promise(r=>setTimeout(r,10));
assert.equal(v5Mine.audio.paused,true,'Incoming voice note never auto-plays an outgoing voice note');

// Play v5Mine (outgoing) followed by v6 (incoming) -> v6 must NOT auto-play!
await loadInlineVoice({id:'v5'},selected,v5Mine.audio);
await v5Mine.audio.play();
v5Mine.audio.paused=true;
v5Mine.audio.dispatch('ended');
await new Promise(r=>setTimeout(r,10));
assert.equal(v6.audio.paused,true,'Replaying own outgoing voice note never auto-plays subsequent messages');

console.log('PASS multi-minute voice notes (no 60s cap), safe clickable chat links + Android bridge, and sequential auto-play strictly for consecutive received voice messages');
