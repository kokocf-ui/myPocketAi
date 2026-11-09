import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import app from './index.js';
const native=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/MainActivity.java',import.meta.url),'utf8');
assert.match(native,/settings\.setCacheMode\(WebSettings\.LOAD_NO_CACHE\)/);
assert.match(native,/web\.loadUrl\(APP_URL \+ "\?nativeLaunch=1&uiFresh=" \+ System\.currentTimeMillis\(\)\)/);
assert.match(native,/private static final String APP_URL = "https:\/\/lifewise-ai-v2\.kokocf\.workers\.dev\/";/);
assert.doesNotMatch(native,/web\.clearData\(|web\.clearFormData\(|CookieManager\.getInstance\(\)\.removeAllCookies/,'Keep user data');
const local=await app.fetch(new Request('https://version-fixture.example/'));
const html=await local.text();
const expected=html.match(/data-pocket-ui-version="([^"]+)"/)?.[1];
assert.ok(expected,'local version token');
assert.ok(html.includes('class="home-einstein"'),'Einstein in current production source');
const checkedUrl='https://lifewise-ai-v2.kokocf.workers.dev/__ui_version?cacheBust='+Date.now();
let actual='',error;
for(let attempt=0;attempt<3;attempt++){
 try{
  const signal=AbortSignal.timeout(9000);
  const reply=await fetch(checkedUrl+'&try='+attempt,{headers:{'Cache-Control':'no-store'},signal});
  if(!reply.ok)throw Error('HTTP '+reply.status);
  actual=(await reply.text()).trim();
  if(actual===expected)break;
  error=Error('UI hash mismatch: expected '+expected+' got '+actual);
 }catch(e){error=e}
}
console.log('Cloudflare frontend version:',actual,'expected:',expected);
if(actual!==expected)throw error||new Error('Live deployed document does not match GitHub main');
console.log('PASS: deployed frontend includes Einstein and new card layout; Android WebView reloads it uncached');
