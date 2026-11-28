// Runs inside the authenticated chat closure; plaintext never leaves the device
// except an explicit user-selected Android document destination.
export const COMMUNICATION_MEDIA_SCRIPT=String.raw`
function showPendingDeliveryHelp(){const modal=chatModal(tr('Livrare neconfirmată','Delivery unconfirmed'));modal.content.append(el('p',tr('Serverul păstrează mesajul, dar nu avem confirmarea aplicației destinatarului. Deschiderea sau redarea lui de către tine nu confirmă livrarea. Destinatarul trebuie să aibă conexiune și o versiune actualizată, apoi să deschidă conversația. Verificarea de aici nu poate forța confirmarea de pe alt telefon.','The server holds this message, but the recipient app has not acknowledged it. Your own playback does not confirm delivery. The recipient needs connectivity and an updated app, then must open the conversation. A check here cannot force another phone to acknowledge it.')));if(receiptDiagnostic)modal.content.append(el('p',receiptDiagnostic));modal.content.append(makeBtn(tr('Verifică din nou','Check again'),()=>{void refreshMessages()}))}
async function exportCommunicationBlob(blob,name){
 if(window.PocketAndroidAttachmentExport?.postMessage){
  if(blob.size>11*1024*1024)throw Error(tr('Fișierul depășește 11 MB.','File exceeds 11 MB.'));
  const id=crypto.randomUUID();
  const encoded=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]);r.onerror=()=>reject(Error('file_read_failed'));r.readAsDataURL(blob)});
  return await new Promise((resolve,reject)=>{
   const done=e=>{if(e.detail?.id!==id)return;clearTimeout(timer);window.removeEventListener('pocket-attachment-export',done);if(e.detail.status==='saved'){setStatus(tr('Fișier salvat.','File saved.'));resolve('saved')}else if(e.detail.status==='cancelled'){setStatus(tr('Salvare anulată.','Save cancelled.'));resolve('cancelled')}else reject(Error(tr('Salvarea nu a reușit. Încearcă din nou.','Save failed. Please retry.')))};
   const timer=setTimeout(()=>{window.removeEventListener('pocket-attachment-export',done);reject(Error(tr('Salvarea nu a fost confirmată.','Save was not confirmed.')))},180000);
   window.addEventListener('pocket-attachment-export',done);
   try{window.PocketAndroidAttachmentExport.postMessage(JSON.stringify({id,name,mime:blob.type||'application/octet-stream',base64:encoded}))}catch(e){clearTimeout(timer);window.removeEventListener('pocket-attachment-export',done);reject(e)}
  });
 }
 const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=name;a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
const inlineImageRows=new Map(),inlineImageUrls=new Map(),inlineImageMetadata=new WeakMap();
const inlineImageObserver=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){inlineImageObserver.unobserve(e.target);const record=inlineImageMetadata.get(e.target);if(record)void loadInlineImage(record.message,record.peer,e.target)}},{root:transcript,rootMargin:'180px'}):null;
function clearInlineImages(){inlineImageObserver?.disconnect();inlineImageRows.clear();for(const url of inlineImageUrls.values())URL.revokeObjectURL(url);inlineImageUrls.clear()}
function forgetMissingInlineImages(ids){for(const [id,row]of inlineImageRows)if(!ids.has(id)){inlineImageObserver?.unobserve(row.querySelector('.comm-inline-image'));row.remove();inlineImageRows.delete(id);const url=inlineImageUrls.get(id);if(url)URL.revokeObjectURL(url);inlineImageUrls.delete(id)}}
async function loadInlineImage(message,peer,holder){
 if(holder.dataset.loading==='true'||holder.dataset.ready==='true'||selected?.id!==peer.id)return;
 holder.dataset.loading='true';
 try{
  const {attachment:media}=await send({action:'attachment',friend:peer.id,attachmentId:message.attachment_id});
  if(media?.kind!=='image'||!/^image\/(jpeg|png|webp|gif)$/i.test(media.mime||''))throw Error('image_format_unsupported');
  const raw=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(media.iv),additionalData:bytes(message.sender+'|'+message.recipient)},await cryptoKey(peer),decode(media.cipher));
  if(selected?.id!==peer.id||chat.hidden||!holder.isConnected)return;
  const image=el('img'),url=URL.createObjectURL(new Blob([raw],{type:media.mime}));inlineImageUrls.set(message.id,url);
  image.alt=tr('Fotografie în conversație','Photo in conversation');image.src=url;image.decoding='async';
  image.onerror=()=>{inlineImageUrls.delete(message.id);URL.revokeObjectURL(url);holder.dataset.ready='false';holder.textContent=tr('Imagine indisponibilă. Atinge pentru a reîncerca.','Image unavailable. Tap to retry.')};
  holder.replaceChildren(image);holder.dataset.ready='true';
 }catch{holder.textContent=tr('Fotografia nu s-a încărcat. Atinge pentru a reîncerca.','Photo failed to load. Tap to retry.')}finally{holder.dataset.loading='false'}
}
function buildInlineImage(message,peer,row){
 const button=makeBtn(tr('Se încarcă fotografia…','Loading photo…'),()=>{if(button.dataset.ready==='true')void saveMedia(message,peer).catch(e=>setStatus(e.message));else void loadInlineImage(message,peer,button)});
 button.className='comm-inline-image';button.setAttribute('aria-label',tr('Fotografie — deschide și salvează','Photo — open and save'));row.append(button);inlineImageRows.set(message.id,row);
 inlineImageMetadata.set(button,{message,peer});if(inlineImageObserver)inlineImageObserver.observe(button);else setTimeout(()=>void loadInlineImage(message,peer,button),0);
}
const inlineTextRows=new Map();
function clearInlineTextRows(){inlineTextRows.clear()}
function forgetMissingInlineText(ids){for(const id of inlineTextRows.keys())if(!ids.has(id))inlineTextRows.delete(id)}
function splitChatTextLinks(rawText){
 const text=String(rawText??'');
 const rx=/\b((?:https?:\/\/|www\.)[^\s<>"]+)/gi;
 const parts=[];let last=0,match;
 while((match=rx.exec(text))!==null){
  const start=match.index;
  let token=match[1];
  while(token.length>4){
   const ch=token[token.length-1];
   if('.,;:!?\'\"»”’>'.includes(ch)){token=token.slice(0,-1);continue}
   if(ch===')'&&(token.split(')').length>token.split('(').length)){token=token.slice(0,-1);continue}
   if(ch===']'&&(token.split(']').length>token.split('[').length)){token=token.slice(0,-1);continue}
   break;
  }
  const candidate=/^https?:\/\//i.test(token)?token:'https://'+token;
  let safeHref='';
  try{
   const parsed=new URL(candidate);
   if((parsed.protocol==='https:'||parsed.protocol==='http:')&&parsed.hostname&&parsed.hostname.includes('.'))safeHref=parsed.href;
  }catch{}
  if(!safeHref)continue;
  if(start>last)parts.push({type:'text',value:text.slice(last,start)});
  parts.push({type:'link',value:token,href:safeHref});
  last=start+token.length;
  rx.lastIndex=last;
 }
 if(last<text.length||!parts.length)parts.push({type:'text',value:text.slice(last)});
 return parts;
}
function renderChatMessageBody(rawText){
 const box=el('div',undefined,'comm-message-body');
 const parts=splitChatTextLinks(rawText);
 if(parts.length===1&&parts[0].type==='text'){box.textContent=parts[0].value;return box}
 for(const part of parts){
  if(part.type==='text'){if(part.value)box.append(document.createTextNode(part.value));continue}
  const link=el('a',part.value,'comm-chat-link');
  link.href=part.href;link.target='_blank';link.rel='noopener noreferrer';
  link.addEventListener('click',ev=>{
   ev.stopPropagation();
   if(typeof INVITE_ROOT==='string'&&part.href.startsWith(INVITE_ROOT)){
    const inviteCode=part.href.slice(INVITE_ROOT.length).split(/[?#]/)[0];
    if(inviteCode.length>=32&&inviteCode.length<=150&&/^[A-Za-z0-9_-]+$/.test(inviteCode)&&typeof window.pocketInviteReceived==='function'){
     ev.preventDefault();window.pocketInviteReceived(inviteCode);return;
    }
   }
   if(window.PocketAndroidExternalLink?.postMessage){
    ev.preventDefault();
    try{window.PocketAndroidExternalLink.postMessage(part.href)}catch{}
   }
  });
  box.append(link);
 }
 return box;
}
function nextConsecutiveReceivedVoiceRow(row){
 const next=row?.nextElementSibling||null;
 if(!next||!next.classList?.contains('comm-message'))return null;
 if(!next.classList.contains('theirs')||!next.classList.contains('comm-message--voice'))return null;
 return next;
}
function preloadNextReceivedVoiceRow(row){
 const next=nextConsecutiveReceivedVoiceRow(row);
 if(!next)return;
 const nextAudio=next.querySelector('audio.comm-inline-audio');
 const target=next.querySelector('.comm-voice-bar')||nextAudio;
 const meta=target?inlineVoiceMetadata.get(target):null;
 if(meta&&nextAudio&&nextAudio.dataset.loadState!=='ready'&&nextAudio.dataset.loadState!=='loading'){
  void loadInlineVoice(meta.message,meta.peer,nextAudio);
 }
}
async function autoPlayNextReceivedVoiceRow(row,peer,rate){
 if(!row?.isConnected||!peer||selected?.id!==peer.id||chat.hidden||!root.classList.contains('active'))return false;
 const next=nextConsecutiveReceivedVoiceRow(row);
 if(!next)return false;
 const nextAudio=next.querySelector('audio.comm-inline-audio');
 if(!nextAudio)return false;
 const nextPlay=next.querySelector('.comm-voice-play');
 const nextSpeed=next.querySelector('.comm-inline-speed');
 const target=next.querySelector('.comm-voice-bar')||nextAudio;
 const meta=target?inlineVoiceMetadata.get(target):null;
 if(Number.isFinite(rate)&&rate>0){
  nextAudio.playbackRate=rate;
  if(nextSpeed){
   nextSpeed.textContent=rate+'×';
   nextSpeed.setAttribute('aria-label',tr('Viteză redare','Playback speed')+' '+rate+'×');
  }
 }
 next.scrollIntoView?.({block:'nearest',behavior:'smooth'});
 if(!nextAudio.src||nextAudio.dataset.loadState!=='ready'){
  if(nextPlay)nextPlay.textContent='…';
  if(meta)await loadInlineVoice(meta.message,meta.peer,nextAudio);
  if(!nextAudio.src){if(nextPlay)nextPlay.textContent='▶';return false}
 }
 if(!next.isConnected||selected?.id!==peer.id||chat.hidden||!root.classList.contains('active'))return false;
 try{
  const started=nextAudio.play();
  if(started&&typeof started.then==='function')await started;
  return true;
 }catch{
  if(nextPlay)nextPlay.textContent='▶';
  return false;
 }
}
let deliverySyncBusy=false,deliverySyncLast=0,receiptDiagnostic='';
const deliveredSessionIds=new Set(),deliveryInFlight=new Set();
async function confirmFetchedDelivery(messages){
 const groups=new Map();
 for(const m of messages||[])if(m?.sender&&m.sender!==identity.id&&m.id&&!m.delivered_at&&!m.read_at&&!m.played_at&&!deliveredSessionIds.has(m.id)&&!deliveryInFlight.has(m.id)){const ids=groups.get(m.sender)||[];ids.push(m.id);groups.set(m.sender,ids)}
 for(const [friend,all]of groups)for(let i=0;i<all.length;i+=80){
  const ids=all.slice(i,i+80);ids.forEach(id=>deliveryInFlight.add(id));
  try{const ack=await send({action:'receipt',friend,receiptType:'delivered',messageIds:ids});if(ack.acknowledged===0)throw Error(tr('Serviciul nu a confirmat niciun mesaj.','Service acknowledged no messages.'));for(const id of ids)deliveredSessionIds.add(id);if(deliveredSessionIds.size>2000)deliveredSessionIds.clear();receiptDiagnostic=''}
  catch(e){receiptDiagnostic=tr('Confirmare livrare eșuată: ','Delivery receipt failed: ')+e.message;throw e}
  finally{ids.forEach(id=>deliveryInFlight.delete(id))}
 }
}
`;
export const COMMUNICATION_MEDIA_STYLE=String.raw`
#view-communication .comm-inline-image{display:block;width:100%;min-height:130px;max-height:300px;padding:0!important;border:0!important;border-radius:12px;overflow:hidden;background:#12354a;color:#dff5ff}
#view-communication .comm-inline-image img{display:block;width:100%;height:auto;max-height:300px;object-fit:contain}
#view-communication .comm-message--attachment:has(.comm-inline-image){padding:5px;max-width:min(78%,330px)}
#view-communication .comm-message-body a.comm-chat-link{color:#7ee8fa!important;text-decoration:underline!important;text-underline-offset:2px;font-weight:600;cursor:pointer;pointer-events:auto!important;touch-action:manipulation;overflow-wrap:anywhere;word-break:break-word}
#view-communication .comm-message.mine .comm-message-body a.comm-chat-link{color:#b6f8ff!important}
#view-communication .comm-message-body a.comm-chat-link:active{opacity:.76}
`;
