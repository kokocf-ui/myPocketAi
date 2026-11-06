import assert from 'node:assert/strict';
import fs from 'node:fs';
import frontend from './index.js';
import backend from './backend.js';

const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const embedded=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(embedded,'app contains its inline script');
assert.match(embedded,/function mathPilotToggle\(\)/,'math pilot is controlled by existing Dictare');
assert.match(embedded,/function mathPilotAvailable\(\)/,'new APK is required for continuous recording');
assert.match(embedded,/PocketAndroidMathAudio\.postMessage/,'native recording bridge is used');
assert.match(embedded,/window\.pocketAndroidMathAudioResult/,'recording result callback is registered');
assert.match(embedded,/data\?\.status==='chunk'/,'recorded audio is chunked through Android WebView');
assert.match(embedded,/mathPilotCaptureId/,'audio parts are scoped to the correct recording');
assert.match(embedded,/mathPilotParts\.join\(''\)/,'audio chunks are reconstructed before upload');
assert.match(embedded,/mode:'secret'/,'opt-in token modal uses app styling');
assert.match(embedded,/mathPilotRequest\.abort\(\)/,'navigating away cancels pending upload');
assert.match(embedded,/\/api\/math-transcribe/,'pilot uses dedicated backend route');

const unifiedModal=embedded.slice(embedded.indexOf('function pocketModal('),embedded.indexOf('// Reusable app-styled selector.'));
assert.match(unifiedModal,/initialFocus\.autofocus=true/,'the modal chooses a non-editable focus target before showModal');
assert.match(unifiedModal,/\(initialFocus\|\|actions\.lastElementChild\)\?\.focus/,'modal focuses only its buttons');
assert.doesNotMatch(unifiedModal,/editor\??\.focus\(/,'opening the secret field or submitting it empty must not invoke Android keyboard');
for(const [name,pattern] of [
 ['chat input',/inputEl\.focus\(/],
 ['Math editor',/editor\??\.focus\(/],
 ['destination entry',/\b(?:city|field)\.focus\(/],
 ['address wizard',/fields\.(?:street|number)\.input\.focus\(/]
])assert.doesNotMatch(embedded,pattern,name+' must never focus itself without the user tapping an editable field');
assert.match(embedded,/data\?\.status==='permissionDenied'/,'Android permission denial reaches the Maths pilot');

const native=fs.readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
assert.match(native,/AudioRecord\.getMinBufferSize/);
assert.match(native,/MATH_AUDIO_MAX_BYTES=960000/,'recording is capped to 30 s at 16 kHz');
assert.match(native,/final int chunkSize=48000/,'each WebView callback is safely below 1 MB');
assert.match(native,/notifyMathAudio\("chunk"/,'native streams bounded audio chunks');
assert.match(native,/notifyMathAudio\("captured","",duration,captureId/,'native sends a terminal message without a large payload');
assert.match(native,/startMathPcmRecording\(\)/,'native recording start');
assert.match(native,/boolean mathPermissionRequested=pendingMathAudioPermission/,'a pending Maths permission request is kept distinct');
assert.match(native,/notifyMathAudio\("permissionDenied","",0\)/,'Maths receives a denial callback instead of hanging in recording');
assert.match(native,/stopMathPcmRecording\(\)/,'native recording manual stop');
assert.match(native,/WebViewCompat\.addWebMessageListener\(web,"PocketAndroidMathAudio"/,'origin-bound native bridge');
assert.match(native,/Collections\.singleton\("https:\/\/"\+APP_HOST\)/);
assert.match(native,/if\(!isMainFrame\|\|!APP_HOST\.equals\(origin\.getHost\(\)\)\)return;/);

const token='A'.repeat(48);
function wavAudio(){
 const pcm=Buffer.alloc(16000);
 const wav=Buffer.alloc(44+pcm.length);
 wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVE',8);
 wav.write('fmt ',12);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);
 wav.writeUInt16LE(1,22);wav.writeUInt32LE(16000,24);
 wav.writeUInt32LE(32000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);
 wav.write('data',36);wav.writeUInt32LE(pcm.length,40);
 return wav.toString('base64');
}
let calls=0,received;
const env={
 POCKET_MATH_PILOT_TOKEN:token,
 AI:{async run(model,payload){calls++;received={model,payload};return {text:'trei ori paranteză doi ori minus unu închide paranteza'}}}
};
const route='https://example.test/api/math-transcribe';
const invoke=async({authorization='Bearer '+token,body={audio:wavAudio()},targetEnv=env}={})=>{
 const request=new Request(route,{
  method:'POST',
  headers:{'Content-Type':'application/json','Authorization':authorization},
  body:JSON.stringify(body)
 });
 const response=await backend.fetch(request,targetEnv);
 return {status:response.status,body:await response.json()};
};
assert.equal((await invoke({targetEnv:{AI:env.AI}})).status,503,'not configured by default');
assert.equal((await invoke({authorization:'Bearer invalid'})).status,401,'bad key rejected');
assert.equal((await invoke({body:{audio:'AQID'}})).status,400,'invalid audio rejected');
const response=await invoke();
assert.equal(response.status,200,'configured owner can transcribe');
assert.equal(response.body.status,'success');
assert.match(response.body.transcript,/minus unu/);
assert.equal(received.model,'@cf/openai/whisper-large-v3-turbo');
assert.equal(received.payload.language,'ro');
assert.equal(received.payload.task,'transcribe');
assert.equal(calls,1,'only authorized valid WAV reaches AI model');
console.log('PASS opt-in Math Whisper recording bridge + authenticated no-retention backend contract');
