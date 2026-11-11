import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import app from './index.js';
import {ACCOUNT_HTML,ACCOUNT_STYLE,ACCOUNT_SCRIPT} from './account_settings_ui.mjs';

const html=await(await app.fetch(new Request('https://account-ui.test/'))).text();
for(const id of ['pocketAccountOpen','pocketAccountDialog','pocketAccountEmail','pocketAccountName','pocketAccountDob','pocketAccountAge','pocketAccountSex','pocketAccountSave']){
 assert.ok(html.includes('id="'+id+'"'),'Missing account control '+id);
}
assert.ok(html.includes('Frontend 1.0.148'),'Settings version is updated');
assert.ok(html.includes('Cont</button>'),'Account entry is visibly labeled');
assert.ok(html.includes('Vârstă (calculată automat)'));
assert.ok(html.includes('.pocket-account-dialog'),'Account has its own compact styling');
assert.ok(html.includes('function pocketAccountCalendarAge(dateText){'));
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'App script is present');
new vm.Script(script,{filename:'account-ui.js'});

const clip=ACCOUNT_SCRIPT.slice(0,ACCOUNT_SCRIPT.indexOf('function pocketAccountInit(){'));
const sandbox=vm.createContext({Date,Number,String});
vm.runInContext(clip,sandbox);
assert.equal(vm.runInContext('pocketAccountCalendarAge("2026-02-30")',sandbox),null);
assert.equal(vm.runInContext('pocketAccountCalendarAge("3000-01-01")',sandbox),null);
assert.equal(vm.runInContext('pocketAccountCalendarAge("1900-01-01")',sandbox),null);
const native=readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
const intro=readFileSync('android/app/src/main/java/ai/mypocket/mobile/AvatarLaunchActivity.java','utf8');
const dates=readFileSync('android/app/src/main/java/ai/mypocket/mobile/UserProfileDates.java','utf8');
assert.match(native,/PocketAndroidAccount/,'Secure native profile bridge exists');
assert.match(native,/handlePocketAccount/,'Profile edits are saved by Android');
assert.match(native,/UserProfileDates\.ageFromBirthDate/,'Native calculates current age');
assert.match(native,/window\.__pocketNativeProfile/,'Conversation gets profile without email');
assert.match(intro,/birthField\.setOnClickListener/,'First install requests date via native date picker');
assert.match(intro,/putString\("birth_date",birthDate\)/,'First install saves birth date');
assert.match(dates,/setLenient\(false\)/,'Invalid dates rejected strictly');
assert.match(ACCOUNT_SCRIPT,/window\.PocketAndroidAccount\.postMessage/,'UI calls native bridge');
assert.doesNotMatch(ACCOUNT_SCRIPT,/user_profile:/,'Account form never sends email in AI requests');
console.log('PASS account UI, native profile bridge, birth-date age, privacy and startup fields');