import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://first-install-consent.test/'))).text();
const boot=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(boot,'Frontend boot source');
new vm.Script(boot,{filename:'first-install-consent.js'});
const launcher=readFileSync('android/app/src/main/java/ai/mypocket/mobile/AvatarLaunchActivity.java','utf8');
const main=readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
const mist=readFileSync('android/app/src/main/assets/avatar-enter.js','utf8');
const lit=readFileSync('literature_task_ui.mjs','utf8');

assert.match(launcher,/first_setup_complete_v1/,'Onboarding runs only on new installations');
assert.match(launcher,/info\.lastUpdateTime>info\.firstInstallTime/,'App upgrades skip first-run question');
assert.match(launcher,/showFirstInstallationPanel\(\)/,'Single professional first-run panel');
for(const entry of ['first_setup_location','first_setup_camera','first_setup_notifications']){
 assert.match(launcher,new RegExp(entry),'Consent preference '+entry+' is stored');
}
assert.match(launcher,/detectFirstSetupLanguage\(\)/,'Language is known before rendering the setup panel');
assert.match(launcher,/onboardingString\(/,'First-run copy is localized');
assert.match(launcher,/location\.isChecked\(\)/,'Location request is opt-in');
assert.match(launcher,/if\(location\.isChecked\(\) && checkSelfPermission/,'Android location prompt only follows opt-in');
assert.doesNotMatch(launcher,/missing\.add\(Manifest\.permission\.RECORD_AUDIO\)/,'No microphone prompt at startup');
assert.doesNotMatch(launcher,/requestPermissions\(new String\[\]\{Manifest\.permission\.POST_NOTIFICATIONS/,'No notification prompt at startup');
assert.match(main,/if\("open"\.equals\(action\)\)\{ensureAgendaNotificationPermission\(\);return;\}/,'Agenda open is the only notification permission trigger');
assert.match(main,/if\(!"sync"\.equals\(action\)\)return;/,'Background sync does not ask permission');
assert.match(main,/!prefs\.getBoolean\("first_setup_notifications",false\)/,'Notification opt-out respected');
assert.match(boot,/JSON\.stringify\(\{action:'open'\}\)/,'Entering Agenda notifies Android');
assert.match(main,/firstSetupCameraAllowed\(\)/,'Camera opt-out respected');
assert.match(boot,/first_setup_language/,'Initial native regional language used on first install');
assert.match(mist,/const cx=width\*\.5,cy=height\*\.47/,'Mist is centered on face, not chest');
assert.match(lit,/eduOpenPrint\('save',material,\(\)=>dialog\.close\(\)\)/,'Reader Save closes after successful export');
assert.match(lit,/eduOpenPrint\('print',material,\(\)=>dialog\.close\(\)\)/,'Reader Print closes after successful save and handoff');
console.log('PASS: first-run localized consent, Agenda-only notifications, avatar mist and reader dismissal');
