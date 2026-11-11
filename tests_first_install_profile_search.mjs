import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import app from './index.js';
import {normalizeConversationProfile,conversationProfileInstruction} from './user_profile.mjs';

const native=readFileSync('android/app/src/main/java/ai/mypocket/mobile/AvatarLaunchActivity.java','utf8');
const main=readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
const backend=readFileSync('backend.js','utf8');
const formStart=native.indexOf('private void showFirstInstallationPanel(){');
const formEnd=native.indexOf('private void beginSystemPermissions()',formStart);
assert.ok(formStart>=0&&formEnd>formStart,'Native first-install setup exists');
const firstScreen=native.slice(formStart,formEnd);
assert.match(firstScreen,/myPocket AI/,'Brand is visible on onboarding');
assert.doesNotMatch(firstScreen,/\bEva\b/,'Eva name is secret until the avatar appears');
for(const name of ['Adresă de e-mail','Nume preferat','Vârstă','Bărbat','Femeie','Nu declar'])
 assert.ok(firstScreen.includes(name),'Missing profile field: '+name);
for(const name of ['Localizare','Microfon','Fotografiere','Notificări'])
 assert.ok(firstScreen.includes(name),'Missing purpose explanation: '+name);
assert.match(native,/setupLabel\("• "\+title\+": "\+detail,12,bodyColor,false\)/,'Permission explanations use 12sp text');
assert.match(firstScreen,/pocket_user_profile/,'Profile saves in private app preferences');
assert.match(firstScreen,/getCheckedRadioButtonId/,'Gender selection is functional');
assert.match(firstScreen,/android\.util\.Patterns\.EMAIL_ADDRESS/,'Email validated before save');
assert.match(firstScreen,/preferredName\.length\(\)<2/,'Preferred name validated');
assert.match(firstScreen,/age<1\|\|age>120/,'Age validated');
assert.match(firstScreen,/beginSystemPermissions\(\)/,'Validated profile proceeds to permissions');
assert.match(native,/firstSetupShownThisLaunch\?firstGreetingForLanguage\(launchLanguage\):greetingForLanguage\(launchLanguage\)/,
 'Avatar introduces Eva only on the actual first installation');
assert.match(native,/case "ro":return "Bună! Eu sunt Eva\./);
assert.match(native,/first_setup_complete_v1/,'Existing installations do not repeat onboarding');
assert.match(main,/provideLocalUserProfile\(view\)/,'Native profile is available to app');
assert.match(main,/getSharedPreferences\("pocket_user_profile"/,'Profile is read locally');
assert.match(main,/prefillEmailForSharedPdf\(send\)/,'Share chooser can prefill the saved email address');
assert.match(main,/send\.putExtra\(Intent\.EXTRA_EMAIL/,'PDF recipient is provided through Android chooser');
assert.match(main,/window\.__pocketNativeProfile=JSON\.parse/,'Only conversation profile crosses to trusted WebView');
assert.doesNotMatch(main.slice(main.indexOf('private void provideLocalUserProfile('),main.indexOf('private void prefillEmailForSharedPdf(')),/profile\.put\("email"/,
 'No email is exposed to the web assistant');

const p=normalizeConversationProfile({preferred_name:'  Ioana  ',age:23,sex:'female',email:'secret@example.com'});
assert.deepEqual(p,{preferred_name:'Ioana',age:23,sex:'female'});
assert.match(conversationProfileInstruction(p,'ro'),/acord feminin/);
assert.match(conversationProfileInstruction(p,'ro'),/sunt pregătită/);
assert.doesNotMatch(conversationProfileInstruction(p,'ro'),/secret@example\.com/);
assert.match(conversationProfileInstruction({preferred_name:'Alex',age:18,sex:'male'},'ro'),/acord masculin/);
assert.match(conversationProfileInstruction({preferred_name:'Alex',age:18,sex:'undisclosed'},'ro'),/Nu presupune genul/);
assert.equal(normalizeConversationProfile({preferred_name:'A',age:20,sex:'male'}),null);
assert.equal(normalizeConversationProfile({preferred_name:'Maria',age:900,sex:'female'}),null);
assert.match(backend,/const nativeConversationProfile=normalizeConversationProfile\(data\.user_profile\)/);
assert.match(backend,/evaDialogueSystem\(lang,evaTurn\.speech_act\)\+userAddressInstruction/);
assert.match(backend,/systemMessage \+= pocketPersona\+userAddressInstruction/);

const html=await(await app.fetch(new Request('https://first-install-profile.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Frontend script exists');
new vm.Script(script,{filename:'onboarding-language-ui.js'});
assert.match(script,/user_profile:window\.__pocketNativeProfile\|\|undefined/,'User profile accompanies the AI request');
const sel=html.match(/<select[^>]+id="languageSelect"[^>]*>([\s\S]*?)<\/select>/)?.[1];
assert.ok(sel);
const codes=[...sel.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)].map(x=>({code:x[1],label:x[2]}));
assert.ok(codes.length>=40,'European languages available to search');
const from=script.indexOf('const languageAlias=');
const to=script.indexOf('const languageChoices=[];',from);
assert.ok(from>=0&&to>from);
const ctx=vm.createContext({});
vm.runInContext(script.slice(from,to),ctx);
const search=term=>codes.filter(o=>{
 const aliases=vm.runInContext('languageAlias['+JSON.stringify(o.code)+']||""',ctx);
 const key=vm.runInContext('languageFold('+JSON.stringify(o.label+' '+o.code+' '+aliases)+')',ctx);
 const query=vm.runInContext('languageFold('+JSON.stringify(term)+')',ctx);
 return key.includes(query);
}).map(o=>o.code);
assert.ok(search('maghiara').includes('hu'),'Hungarian is found by Romanian spelling');
assert.ok(search('Magyar').includes('hu'),'Hungarian is found by native spelling');
assert.ok(search('hu').includes('hu'),'Hungarian is found by language code');
assert.ok(search('Русский').includes('ru'),'Cyrillic language name remains searchable');
assert.ok(search('Ελληνικά').includes('el'),'Greek language name remains searchable');
assert.deepEqual(search('not-a-language-12345'),[],'Unknown language is not matched');
assert.match(script,/languageSearch\.addEventListener\('input',\(\)=>filterLanguageChoices\(languageSearch\.value\)\)/,'Search filters immediately when typing');
assert.match(script,/languageDialogScroll\.scrollTop=0/,'Filtered results start at the top');
assert.match(script,/languageSearch\.focus\(\)/,'Keyboard focus begins in search field');
assert.match(script,/languageSearch\.value=''/,'Search resets when reopened');
assert.match(script,/languageEmpty\.hidden=matches!==0/,'No-result message is conditional');
assert.match(html,/myPocket AI/);
console.log('PASS native first install profile, private PDF email, Eva gender and language search');
