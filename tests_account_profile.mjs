import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import app from './index.js';
import {ACCOUNT_HTML,ACCOUNT_STYLE,ACCOUNT_SCRIPT} from './account_settings_ui.mjs';

const html=await(await app.fetch(new Request('https://account-ui.test/'))).text();
for(const id of ['pocketAccountOpen','pocketAccountDialog','pocketAccountEmail','pocketAccountName','pocketAccountDob','pocketAccountBirthdayNotify','pocketAccountSex','pocketAccountSave']){
 assert.ok(html.includes('id="'+id+'"'),'Missing account control '+id);
}
assert.ok(html.includes('Versiunea 1.0.148'),'Settings version is updated');
assert.ok(html.includes('Cont</button>'),'Account entry is visibly labeled');
assert.ok(!html.includes('id="pocketAccountAge"'),'Age must not be shown in the account');
assert.ok(!html.includes('Vârstă (calculată automat)'),'Account must not show an age label');
assert.ok(html.includes('Eva să-mi ureze'),'The birthday greeting toggle is visible');
assert.ok(html.includes('.pocket-account-dialog'),'Account has its own compact styling');
assert.ok(!html.includes('function pocketAccountCalendarAge(dateText){'),'Account does not calculate a visible age');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'App script is present');
new vm.Script(script,{filename:'account-ui.js'});

assert.match(ACCOUNT_SCRIPT,/birthday_greeting_enabled:birthdayNotify\.checked/,'Birthday preference is sent to native');
assert.match(ACCOUNT_SCRIPT,/value\.birthday_greeting_enabled!==false/,'Existing accounts default to enabled');
assert.doesNotMatch(ACCOUNT_HTML,/pocketAccountAge/,'Account HTML never includes displayed age');

const native=readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
const intro=readFileSync('android/app/src/main/java/ai/mypocket/mobile/AvatarLaunchActivity.java','utf8');
const dates=readFileSync('android/app/src/main/java/ai/mypocket/mobile/UserProfileDates.java','utf8');
const birthday=readFileSync('android/app/src/main/java/ai/mypocket/mobile/ProfileBirthdayScheduler.java','utf8');
const receiver=readFileSync('android/app/src/main/java/ai/mypocket/mobile/AgendaReminderReceiver.java','utf8');
const manifest=readFileSync('android/app/src/main/AndroidManifest.xml','utf8');
assert.match(native,/PocketAndroidAccount/,'Secure native profile bridge exists');
assert.match(native,/handlePocketAccount/,'Profile edits are saved by Android');
assert.match(native,/UserProfileDates\.ageFromBirthDate/,'Native calculates current age');
assert.match(native,/window\.__pocketNativeProfile/,'Conversation gets profile without email');
assert.match(intro,/birthField\.setOnClickListener/,'First install requests date via native date picker');
assert.match(intro,/putString\("birth_date",birthDate\)/,'First install saves birth date');
assert.match(dates,/setLenient\(false\)/,'Invalid dates rejected strictly');
assert.match(native,/birthday_greeting_enabled/,'Birthday preference is saved locally');
assert.match(native,/ProfileBirthdayScheduler\.reschedule\(this\)/,'Profile save and app start reschedule notification');
assert.match(receiver,/ProfileBirthdayScheduler\.fire\(context,intent\)/,'Receiver delivers profile birthday');
assert.match(receiver,/ProfileBirthdayScheduler\.reschedule\(context\)/,'Boot and timezone event restore profile alarm');
assert.match(manifest,/RECEIVE_BOOT_COMPLETED/,'Boot restores native birthday alarm');
assert.match(birthday,/LocalTime\.of\(9,0\)/,'Birthday greeting targets local 09:00');
assert.match(birthday,/setAndAllowWhileIdle/,'Birthday notification works without app open');
assert.match(birthday,/birthday_greeting_last_year/,'Only one birthday greeting per year');
assert.match(birthday,/POST_NOTIFICATIONS/,'Android consent is respected');
assert.match(birthday,/getBoolean\(ENABLED,true\)/,'Birthday greeting preference is opt-out');
assert.doesNotMatch(birthday,/setExactAndAllowWhileIdle/,'No restricted exact alarm permission');
assert.match(birthday,/Math\.min\(day,first\.lengthOfMonth\(\)\)/,'Leap birthdays have explicit fallback');
assert.doesNotMatch(birthday,/https?:\/\//,'Birthday greeting needs no network');
assert.match(ACCOUNT_SCRIPT,/window\.PocketAndroidAccount\.postMessage/,'UI calls native bridge');
assert.doesNotMatch(ACCOUNT_SCRIPT,/user_profile:/,'Account form never sends email in AI requests');
console.log('PASS account hides age, optional yearly birthday greeting, private DOB, Android alarm and opt-out');