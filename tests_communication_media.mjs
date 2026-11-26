import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {COMMUNICATION_MEDIA_SCRIPT as js} from './communication_media_ui.mjs';
import {ORACLE_COMMUNICATION_SCRIPT as chat} from './oracle_communication_ui.mjs';
import {FUN_ASTRO_CORE_SCRIPT} from './extra_fun_core.mjs';
new vm.Script(chat);new vm.Script(js);
const api=new Function('identity','send','tr',js.slice(js.indexOf('let deliverySyncBusy='))+';return {confirmFetchedDelivery,deliveredSessionIds,deliveryInFlight,diagnostic:()=>receiptDiagnostic}')({id:'me'},send,x=>x);
let requests=[],fail=false,zero=false;
async function send(data){requests.push(data);if(fail)throw Error('offline');return {acknowledged:zero?0:data.messageIds.length}}
const own={id:'own',sender:'me'},read={id:'read',sender:'peer',read_at:'now'},incoming=Array.from({length:181},(_,i)=>({id:'incoming-'+i,sender:'peer'}));
await api.confirmFetchedDelivery([own,read,...incoming]);assert.deepEqual(requests.map(x=>x.messageIds.length),[80,80,21]);assert.ok(requests.every(x=>x.friend==='peer'&&x.receiptType==='delivered'));
requests=[];await api.confirmFetchedDelivery(incoming);assert.equal(requests.length,0,'No repeat acknowledgements while receipt response has not propagated to message query');
fail=true;await assert.rejects(api.confirmFetchedDelivery([{id:'retry',sender:'peer'}]),/offline/);assert.equal(api.deliveryInFlight.size,0);assert.ok(!api.deliveredSessionIds.has('retry'));assert.match(api.diagnostic(),/offline/);
fail=false;await api.confirmFetchedDelivery([{id:'retry',sender:'peer'}]);assert.ok(api.deliveredSessionIds.has('retry'));assert.equal(api.diagnostic(),'');
zero=true;await assert.rejects(api.confirmFetchedDelivery([{id:'zero',sender:'peer'}]),/niciun mesaj/);assert.ok(!api.deliveredSessionIds.has('zero'));
const native=readFileSync('android/app/src/main/java/ai/mypocket/mobile/PocketAttachmentExport.java','utf8');
for(const required of ['if(!isMainFrame','!host.equals(origin.getHost())','Intent.ACTION_CREATE_DOCUMENT','Intent.CATEGORY_OPENABLE','MAX_BYTES=11*1024*1024','"cancelled"','"saved"','"error"','openOutputStream(destination,"w")','pending.delete()','Base64.decode','PocketAndroidAttachmentExport'])assert.ok(native.includes(required),required);
assert.doesNotMatch(native,/ACTION_INSTALL_PACKAGE|REQUEST_INSTALL_PACKAGES|setDataAndType|HttpURLConnection|new URL\(/,'Export never installs APKs or uploads plaintext');
assert.ok(readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8').includes('new PocketAttachmentExport(this,web,APP_HOST)'));
const astro=new Function(FUN_ASTRO_CORE_SCRIPT+';return {funBirthReading};')();
for(let sun=0;sun<12;sun++)for(const asc of [null,...Array.from({length:12},(_,i)=>i)]){
 const sections=astro.funBirthReading(sun,asc);assert.ok(sections.length>=5);assert.ok(sections.some(x=>x[1].includes('nu un test de personalitate')));assert.ok(sections.some(x=>x[0]==='Ce înseamnă desenul și gradele'));if(asc!==null)assert.ok(sections.some(x=>x[0]==='Cum se leagă cele două'));
}
console.log('PASS delivery proof batches/dedup/retry/no own receipt/no zero-ack success, bounded trusted-origin Android SAF export contracts, all 156 partial birth-chart combinations. Native contracts are not a physical-device save test.');
