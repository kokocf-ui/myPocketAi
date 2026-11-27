// Browser helpers injected INSIDE the authenticated Oracle chat closure.
// A server acknowledgement is not delivery, visibility is not audio playback.
export const COMMUNICATION_DELIVERY_SCRIPT=String.raw`
function showReceiptHelp(){
 const modal=chatModal(tr('Stările mesajelor','Message status'));
 modal.content.append(el('p',tr('Se trimite: criptarea sau transferul este în curs. Pe server: serviciul a confirmat primirea, nu destinatarul. Livrat: aplicația destinatarului a preluat mesajul. Citit: mesajul a fost vizibil în chat; nu înseamnă că vocalul a fost ascultat. Redare confirmată: destinatarul a pornit vocalul; nu confirmă ascultarea integrală. Fără confirmare: rezultatul este necunoscut; reîncearcă aceeași trimitere.','Sending: encryption or transfer is in progress. On server: the service acknowledged receipt, not the recipient. Delivered: the recipient app fetched the message. Read: visible in chat; this does not mean audio was played. Playback confirmed: the recipient started the voice note; not proof of full listening. Unconfirmed: outcome unknown; retry the same send.')));
 modal.content.append(el('p',tr('Timpul afișat măsoară confirmarea serverului. Chatul deschis verifică actualizările la 3 secunde; nu este o conexiune instantanee. În fundal livrarea depinde de Android, conexiune și configurarea notificărilor. Confirmările pot lipsi la versiuni vechi ale aplicației.','Displayed time measures server acknowledgement. Open chat checks every 3 seconds; it is not an instantaneous connection. Background delivery depends on Android, connectivity and notification setup. Old app versions may not provide receipts.')));
}
const outgoingJobs=new Map(),outgoingFiles=new WeakMap(),localVoicePlayed=new Set(),pendingPlayedReceipts=new Map();
let playedReceiptBusy=false;const lastSendTiming=new Map();
const transferClock=ms=>(Math.max(0,ms)/1000).toFixed(1)+' s';
function makeOutgoingJob(kind,peer,prepare,onAccepted=()=>{},preview=''){
 if(outgoingJobs.size>=20)throw Error(tr('Prea multe trimiteri neconfirmate. Reîncearcă mesajele existente.','Too many unconfirmed sends. Retry existing messages.'));
 const job={id:crypto.randomUUID(),kind,peer,prepare,onAccepted,payload:null,busy:false,accepted:false,ackAt:0,timer:null,started:0};
 job.row=el('div',undefined,'comm-message mine comm-message--text comm-outgoing-pending');
 job.row.dataset.outgoingId=job.id;
 job.row.append(el('div',preview||tr(kind==='audio'?'🎙 Mesaj vocal':'📎 Atașament privat',kind==='audio'?'🎙 Voice note':'📎 Private attachment'),'comm-message-body'));
 job.label=el('small','', 'comm-transfer-state');job.label.setAttribute('role','status');job.row.append(job.label);
 job.retry=makeBtn(tr('Reîncearcă aceeași trimitere','Retry same send'),()=>{void attemptOutgoingJob(job)});job.retry.hidden=true;job.row.append(job.retry);
 outgoingJobs.set(job.id,job);if(selected?.id===peer.id){transcript.append(job.row);transcript.scrollTop=transcript.scrollHeight}
 return job;
}
async function attemptOutgoingJob(job){
 if(job.busy)return false;if(job.accepted)return true;
 job.busy=true;job.started=performance.now();job.retry.hidden=true;
 let phase=tr('Criptez…','Encrypting…');
 const paint=()=>{job.label.textContent=phase+' · '+transferClock(performance.now()-job.started);};paint();job.timer=setInterval(paint,1000);
 try{
  if(!job.payload)job.payload=await job.prepare(job.id);
  phase=tr('Se trimite către server…','Sending to server…');paint();
  await send(job.payload);
  job.accepted=true;job.ackAt=Date.now();clearInterval(job.timer);
  job.label.textContent=tr('✓ Trimis pe server în ','✓ Sent to server in ')+transferClock(performance.now()-job.started)+tr(' · livrare încă neconfirmată',' · delivery not yet confirmed');
  lastSendTiming.set(job.peer.id,tr('Ultima trimitere pe server: ','Last server send: ')+transferClock(performance.now()-job.started));
  job.label.title=tr('Timp măsurat până la confirmarea serverului, nu până la citire sau ascultare.','Measured time to server acknowledgement, not to reading or playback.');
  job.onAccepted();
  if(selected?.id===job.peer.id)await refreshMessages();
  return true;
 }catch(error){
  clearInterval(job.timer);job.label.textContent=tr('⚠ Fără confirmare de trimitere · ','⚠ Send not confirmed · ')+transferClock(performance.now()-job.started)+' · '+error.message;
  job.retry.hidden=false;
  // Explicit retries reuse the SAME client message id and encrypted payload.
  // Oracle deduplicates it if a previous acknowledgement was lost.
  return false;
 }finally{job.busy=false;clearInterval(job.timer)}
}
function keepOutgoingJobs(nodes,peer,fetchStartedAt){
 for(const [key,job]of outgoingJobs){
  if(job.peer.id!==peer.id)continue;
  if(job.accepted&&job.ackAt<=fetchStartedAt){outgoingJobs.delete(key);job.row.remove();continue}
  nodes.push(job.row);
 }
}
function noteVoicePlayback(message,peer){
 if(message.sender===identity.id)return;
 localVoicePlayed.add(message.id);if(localVoicePlayed.size>1000)localVoicePlayed.delete(localVoicePlayed.values().next().value);
 const row=inlineVoiceRows.get(message.id);
 if(row)updateMessageReceipt(row.querySelector('.comm-message-footer'),message);
 pendingPlayedReceipts.set(message.id,{id:message.id,friend:peer.id});
 void flushPlayedReceipts();
}
async function flushPlayedReceipts(){
 if(playedReceiptBusy||!identity?.id||document.visibilityState==='hidden'||!pendingPlayedReceipts.size)return;
 playedReceiptBusy=true;
 try{
  const groups=new Map();for(const item of pendingPlayedReceipts.values()){const ids=groups.get(item.friend)||[];ids.push(item.id);groups.set(item.friend,ids)}
  for(const [friend,allIds]of groups){const ids=allIds.slice(0,80);try{await send({action:'receipt',friend,receiptType:'played',messageIds:ids});for(const id of ids)pendingPlayedReceipts.delete(id)}catch(error){if([403,404].includes(error.status))for(const id of ids)pendingPlayedReceipts.delete(id)}}
 }catch{/* Retain unacknowledged playback receipts for the next foreground check. */}
 finally{playedReceiptBusy=false}
}
`;
