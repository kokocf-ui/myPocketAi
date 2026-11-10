import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import frontend from './index.js';
const html=await (await frontend.fetch(new Request('https://reminders.test/'))).text();
const app=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1]||'';
assert.match(app,/function agendaSyncAndroid\(events\)/);
assert.match(app,/PocketAndroidAgenda\?\.postMessage/);
assert.match(app,/agendaSyncAndroid\(events\);return true/);
assert.match(app,/agendaSyncAndroid\(agendaRead\(\)\)/);
const root='android/app/src/main/';
const manifest=readFileSync(root+'AndroidManifest.xml','utf8');
const main=readFileSync(root+'java/ai/mypocket/mobile/MainActivity.java','utf8');
const alarms=readFileSync(root+'java/ai/mypocket/mobile/AgendaReminderScheduler.java','utf8');
const receiver=readFileSync(root+'java/ai/mypocket/mobile/AgendaReminderReceiver.java','utf8');
assert.match(manifest,/POST_NOTIFICATIONS/);
assert.match(manifest,/RECEIVE_BOOT_COMPLETED/);
assert.match(manifest,/AgendaReminderReceiver/);
assert.match(main,/WEB_MESSAGE_LISTENER[\s\S]*?"PocketAndroidAgenda"/);
const launcher=readFileSync(root+'java/ai/mypocket/mobile/AvatarLaunchActivity.java','utf8');
assert.match(launcher,/ONBOARDING_NOTIFICATIONS_REQUEST/,'Android notification permission is requested at first install');
assert.match(launcher,/Manifest\\.permission\\.POST_NOTIFICATIONS/,'Android notifications are in first-run permission chain');
assert.doesNotMatch(main,/ensureAgendaNotificationPermission/,'Opening Agenda does not request notification permission again');
assert.match(main,/onShowFileChooser\(WebView view,ValueCallback<Uri\[\]> callback/,'Android WebView supports user-selected document pictures');
assert.match(main,/new Intent\(Intent\.ACTION_GET_CONTENT\)/,'document chooser uses OS content picker');
assert.match(main,/MediaStore\.ACTION_IMAGE_CAPTURE/,'camera remains a user-initiated option');
assert.match(main,/documentPhotoCallback/,'file chooser results are handled');
assert.match(main,/settings\.setAllowFileAccess\(false\)/,'arbitrary file scheme remains disabled');
assert.match(main,/settings\.setAllowContentAccess\(true\)/,'chosen image content URIs are permitted');
const filePaths=readFileSync(root+'res/xml/file_paths.xml','utf8');
assert.match(filePaths,/document_camera_cache/,'only scoped camera cache is offered');

assert.match(main,/EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS,mathDictation\?4800L:2200L/,'mathematics has longer silence allowance without changing other modules');
assert.match(main,/EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS,mathDictation\?2600L:1400L/,'mathematics tolerates pauses and other voice modules retain their setting');
assert.match(main,/EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS,1000L/,'short syllables are not forced to finalize');
assert.match(main,/"math"\.equals\(speechMode\)\)return/,'mathematics is excluded from the 1.1-second early stop');
assert.match(main,/"budget"\.equals\(speechMode\)/,'budget voice is excluded from custom 1.1-second stop');
assert.match(alarms,/setAndAllowWhileIdle/);
assert.match(alarms,/event\.minusMinutes\(minutes\)/);
assert.match(alarms,/LocalTime\.of\(19,0\)/);
assert.match(alarms,/birthdayOccurrence/);
for(const preset of ['flight','train','medical','exam','bill','hotel','meeting','default']){
 assert.match(alarms,new RegExp('case "'+preset+'"|return "'+preset+'"'));
}
assert.match(alarms,/case "flight":return new long\[\]\{1440,300,180\}/,'flight notifications cover 24h, 5h and 3h');
assert.match(alarms,/flightPackingPrompt.*before-300/,'5-hour flight prompt is scheduled');
assert.match(alarms,/flightDeparturePrompt.*before-180/,'3-hour airport departure prompt is scheduled');
assert.match(alarms,/Verifică documentele și bagajele/,'packing message includes documents and luggage');
assert.match(alarms,/Este timpul să pleci spre aeroport/,'departure message instructs airport travel');
assert.match(alarms,/case "exam":return new long\[\]\{10080,1440,120\}/);
assert.match(alarms,/event\.getYear\(\)/,'birthday annual alarms distinguish years');
assert.match(app,/function agendaReminderPreset\(title\)/);
assert.match(app,/reminderPreset:preset\.value==='auto'/);
assert.match(receiver,/reschedule\(context\)/);

assert.match(app,/function renderReminders\(\)/,'dedicated reminder workspace is rendered');
assert.match(app,/function remindersParseVoice\(/,'natural-language reminder parser exists');
assert.match(app,/function remindersVoiceHandleAndroid\(/,'native speech results are handled');
assert.match(app,/mode:'reminders'/,'reminders use Android speech bridge');
assert.match(app,/if\(key==='reminders'\)\{renderReminders\(\);return\}/,'organizer navigates directly to reminders');
assert.match(app,/reminderPreset:'reminder'/,'new reminders use their own scheduled time');
assert.match(alarms,/case "reminder":return new long\[\]\{0\}/,'reminder notification is scheduled at event time');

import vm from 'node:vm';
const start=app.indexOf('function remindersDeleteCandidates(');
const end=app.indexOf('function remindersVoiceHandleAndroid(',start);
assert.ok(start>=0&&end>start,'reminder deletion helper is isolated');
const ctx=vm.createContext({shopVoiceFold:value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()});
vm.runInContext(app.slice(start,end),ctx);
const get=(command,items)=>vm.runInContext('remindersDeleteCandidates('+JSON.stringify(command)+','+JSON.stringify(items)+')',ctx);
const records=[
 {id:'1',kind:'reminder',title:'să sun la service',createdAt:'2026-11-06T08:00:00Z'},
 {id:'2',kind:'reminder',title:'cumpără cartofi',createdAt:'2026-11-06T08:05:00Z'},
 {id:'3',kind:'reminder',title:'să sun la dentist',createdAt:'2026-11-06T08:10:00Z'}
];
for(const command of ['Șterge mementoul să sun la service','șterge să sun la service','Elimină memento service','anulează memento de la service']){
 const items=get(command,records);
 assert.equal(items.length,1,command);
 assert.equal(items[0].id,'1',command);
}
assert.equal(get('șterge memento',[records[0]])[0].id,'1','a single reminder can be deleted by short command');
assert.equal(get('șterge mecanic',records)[0]?.id,'1','short mechanic keyword matches service reminder');
assert.equal(get('ȘTERGE SERVICE',records)[0]?.id,'1','short keyword with uppercase matches');
assert.equal(get('șterge dentist',records)[0]?.id,'3','single meaningful keyword matches despite longer reminder title');
assert.equal(get('șterge inexistent',records).length,0,'unknown keyword never deletes a reminder');
assert.equal(get('șterge memento',records).length,0,'ambiguous generic deletion is never automatic');
assert.equal(get('șterge să sun',records).length,0,'similar reminder titles remain ambiguous');
assert.equal(get('șterge ultimul memento',records)[0].id,'3','last reminder is selected by creation time');
assert.equal(get('amintește-mi mâine să sun la dentist',records),null,'create intent is not mistaken for delete');
assert.equal(get('șterge lista de cumpărături',records).length,0,'unrelated objects are not selected');

console.log('PASS agenda: native bridge, reminders, reboot restoration and permissions');
