import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';

const root='android/app/src/main/';
const manifest=readFileSync(root+'AndroidManifest.xml','utf8');
const main=readFileSync(root+'java/ai/mypocket/mobile/MainActivity.java','utf8');
const service=readFileSync(root+'java/ai/mypocket/mobile/PocketNavigationService.java','utf8');
const script=readFileSync(root+'assets/navigation-background.js','utf8');
new Script(script);
for(const name of ['android.permission.FOREGROUND_SERVICE',
 'android.permission.FOREGROUND_SERVICE_LOCATION','android.permission.POST_NOTIFICATIONS',
 'android.permission.ACCESS_FINE_LOCATION']){
 assert.ok(manifest.includes(name),name);
}
assert.match(manifest,/<service android:name="\.PocketNavigationService"[\s\S]*?android:exported="false"[\s\S]*?android:foregroundServiceType="location"/);
assert.match(service,/new Intent\(this,MainActivity.class\)/);
assert.doesNotMatch(manifest,/PocketNavigationActivity/);
assert.match(service,/START_NOT_STICKY/,'Service must not silently auto-restart after a killed process');
assert.match(service,/startForeground\(NOTIFICATION_ID,notification\(\),/);
assert.match(service,/ServiceInfo\.FOREGROUND_SERVICE_TYPE_LOCATION/);
assert.match(service,/PendingIntent\.FLAG_IMMUTABLE/);
assert.match(service,/\.setOngoing\(true\)/);
assert.match(service,/ACTION_STOP/);
assert.match(service,/stopForeground\(STOP_FOREGROUND_REMOVE\)/);
assert.match(service,/removeUpdates\(this\)/);
assert.match(service,/android\.R\.drawable\.ic_menu_mylocation/);
const serviceCode=service.split('\n').filter(line=>!line.trim().startsWith('//')&&!line.trim().startsWith('*')).join('\n');
assert.ok(!['new WebView','FirebaseMessaging','Location.getLatitude('].some(x=>serviceCode.includes(x)),
 'No background WebView, network activity or stored GPS coordinates in the navigation service');
assert.match(main,/WebViewCompat\.addWebMessageListener\(web,"PocketAndroidNavigation"/);
assert.match(main,/if\(!isMainFrame\|\|!"https"\.equalsIgnoreCase\(origin\.getScheme\(\)\)/);
assert.match(main,/nativeNavigationActivityVisible/);
assert.match(main,/ContextCompat\.startForegroundService\(this,/);
assert.match(main,/Manifest\.permission\.POST_NOTIFICATIONS/);
assert.match(main,/injectNavigationBridge\(\)/);
assert.match(script,/window\.pocketNativeNavigationResume=/);
assert.match(script,/window\.pocketNativeNavigationStopped=/);
assert.match(script,/window\.PocketAndroidNavigation\.postMessage\(JSON\.stringify\(payload\)\)/);
assert.match(script,/localStorage\.removeItem\(KEY\)/);
assert.match(script,/window\.startRouteTracking=wrappedStart/);
assert.match(script,/window\.closeRouteMap=function/);
assert.match(script,/openRouteMap\(record\.route,null,\[record\.route\],true\)/);
assert.doesNotMatch(script,/createElement\('button'\)|pocket-navigation-background-action|pocket-navigation-restore/);
assert.doesNotMatch(script,/setInterval/);
console.log('PASS: native nav foreground-only service, notification-only return, explicit start/stop, WebView origin and route-scoped resume');
