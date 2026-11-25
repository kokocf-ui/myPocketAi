import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const java=readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
const gradle=readFileSync('android/app/build.gradle','utf8');
const flow=readFileSync('.github/workflows/build-android-signed-release.yml','utf8');


assert.match(java,/BuildConfig\.TOOLS_UI_PREVIEW && request\.isForMainFrame\(\)/,
 'Only test builds may intercept top-level UI');
assert.match(java,/"GET"\.equalsIgnoreCase\(request\.getMethod\(\)\)/,
 'No POST or API requests may be intercepted');
assert.match(java,/APP_HOST\.equalsIgnoreCase\(resource\.getHost\(\)\)/,
 'Origin-limited interception is essential for native bridge safety');
assert.match(java,/&& "\/"\.equals\(resource\.getPath\(\)\)/,
 'Only exact HTML root request can be intercepted');
assert.match(java,/getAssets\(\)\.open\("tools-ui-preview\.html"\)/,
 'APK serves the locally bundled branch UI');
assert.match(java,/return super\.shouldInterceptRequest\(view,request\);/,
 'Other requests retain existing remote behavior');
assert.match(gradle,/buildConfigField 'boolean', 'TOOLS_UI_PREVIEW', \(System\.getenv\('POCKET_TOOLS_UI_PREVIEW'\) == 'true'/,
 'Preview flag must default false');
assert.doesNotMatch(flow,/Bundle exact PR frontend for preview-only APK/,
 'Production release must not generate an archived UI snapshot');
assert.doesNotMatch(flow,/run: node scripts\/build_android_ui_preview\.mjs/,
 'Production workflow must not inject a preview HTML file');
assert.match(flow,/POCKET_TOOLS_UI_PREVIEW: 'false'/,
 'Signed main APK must exclusively use the Cloudflare frontend');
assert.match(flow,/if unzip -l "\$APK" \| grep -Fq 'assets\/tools-ui-preview\.html'/,
 'Production APK verification must reject old UI snapshots');


assert.match(java,/BuildConfig\.TOOLS_UI_PREVIEW && !request\.isForMainFrame\(\)/, 'Pack interception is preview-only');
assert.match(java,/APP_HOST\.equalsIgnoreCase\(resource\.getHost\(\)\)/, 'Preview assets remain same-origin');
assert.match(java,/mypocketai-commercial-curriculum-pack-v1:2026-11\|/, 'Preview uses the production pack naming salt');
assert.match(java,/preview\/packs\/p-/, 'Preview uses bundled annual packs');
assert.match(java,/404,"Not Found"/, 'Missing preview assets do not fall through to incompatible live content');
assert.match(gradle,/applicationIdSuffix '\.preview'/, 'Debug preview is isolated from production');
assert.match(gradle,/Branch UI preview is for debug builds only/, 'Preview cannot be built as a release');
assert.match(gradle,/sourceSets\.debug\.assets/, 'Only debug variant gets generated snapshot');
console.log('PASS: production uses Cloudflare; isolated debug preview bundles its UI and Education assets');
