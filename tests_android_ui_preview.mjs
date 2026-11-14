import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const java=readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
const gradle=readFileSync('android/app/build.gradle','utf8');
const flow=readFileSync('.github/workflows/build-android-signed-release.yml','utf8');
const bundler=readFileSync('scripts/build_android_ui_preview.mjs','utf8');

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
assert.match(flow,/name: Bundle exact PR frontend for preview-only APK/);
assert.match(flow,/run: node scripts\/build_android_ui_preview\.mjs/);
assert.match(flow,/POCKET_TOOLS_UI_PREVIEW: 'true'/);
assert.match(flow,/assets\/tools-ui-preview\.html/);
assert.match(bundler,/response\.status,200/);
assert.match(bundler,/extraCreatorLocalHtml/);
console.log('PASS: signed Android preview bundles branch UI; production host, APIs and native security preserved');
