import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const main=read('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java');
const page=read('index.js');
const enter=read('android/app/src/main/assets/avatar-enter.js');
const avatar=read('android/app/src/main/java/ai/mypocket/mobile/AvatarLaunchActivity.java');
const names=[...main.matchAll(/WebViewCompat\.addWebMessageListener\(web,\s*"([^"]+)"/g)]
 .map(match=>match[1]);
assert.equal(new Set(names).size,names.length,
 'Duplicate native WebView JavaScript bridge names crash the MainActivity immediately after Eva greeting');
assert.ok(names.includes('PocketAndroidNavigation'),'Existing exit interface remains registered');
assert.ok(names.includes('PocketAndroidRouteGuidance'),'GPS navigation uses its own native interface');
assert.match(page,/window\.PocketAndroidNavigation\?\.postMessage\?\.\('exit'\)/,'App exit still uses original bridge');
const begin=page.indexOf('async function openTransitJourneyMap(selected){');
const end=page.indexOf('async function selectTransitJourney(options,index){',begin);
assert.ok(begin>=0&&end>begin);
const map=page.slice(begin,end);
assert.ok(map.includes("window.PocketAndroidRouteGuidance.postMessage(JSON.stringify({action:'start'"),'Start goes to route guidance bridge');
assert.ok(!map.includes('window.PocketAndroidNavigation'),'Map never uses reserved app-exit bridge');
assert.match(avatar,/startActivity\(intent\)/,'Eva launches the app after the greeting');
assert.match(enter,/lipLimitTimer=setTimeout/,'Single-word mouth has a terminal limit');
assert.match(enter,/version!==spokenSequence/,'Late callback cannot restart intro lips');
assert.match(enter,/clearTimeout\(lipLimitTimer\)/,'Speech end cancels fallback mouth timer');
console.log('PASS: unique Android bridges, app exit and GPS both retained, lip-sync terminal guard');
