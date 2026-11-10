import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import app from './index.js';
const native=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/MainActivity.java',import.meta.url),'utf8');
assert.match(native,/settings\.setCacheMode\(WebSettings\.LOAD_NO_CACHE\)/);
assert.match(native,/web\.loadUrl\(APP_URL \+ "\?nativeLaunch=1&uiFresh=" \+ System\.currentTimeMillis\(\)\+langParam\)/,'Always bust cache while adding first-install language only when present');
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
const livePage=await fetch('https://lifewise-ai-v2.kokocf.workers.dev/?nativeLaunch=1&inspect='+Date.now(),
 {headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});
const liveText=await livePage.text();
const localCards=[...html.matchAll(/data-module="(assistant|learning|travel|organize|maps|tools)"/g)].slice(0,6).map(x=>x[1]);
const remoteCards=[...liveText.matchAll(/data-module="(assistant|learning|travel|organize|maps|tools)"/g)].slice(0,6).map(x=>x[1]);
console.log('LIVE FRONTEND DETAIL',JSON.stringify({
 status:livePage.status,contentBytes:liveText.length,
 liveVersion:actual,expectedVersion:expected,
 liveHtmlVersion:liveText.match(/data-pocket-ui-version="([^"]+)"/)?.[1],
 hasEinstein:liveText.includes('home-einstein'),
 hasNewHotelCard:liveText.includes('Caută cazare și opțiuni de sejur.'),
 oldTravelCard:liveText.includes('Călătorii și turism'),
 localCards,remoteCards,
 responseHeaders:Object.fromEntries([...livePage.headers].filter(([k])=>['date','cache-control','cf-cache-status','age','etag'].includes(k)))
}));
console.log('Cloudflare frontend version:',actual,'expected:',expected);
const cardModules=source=>{
 const start=source.indexOf('<div class="card-grid">',source.indexOf('id="view-home"'));
 const end=source.indexOf('</div></section>',start);
 assert.ok(start>=0&&end>start,'Home grid must exist');
 const content=source.slice(start,end);
 return {content,codes:[...content.matchAll(/data-module="([^"]+)"/g)].map(x=>x[1])};
};
const expectedCards=['assistant','learning','travel','organize','maps','tools'];
const localHome=cardModules(html),remoteHome=cardModules(liveText);
assert.deepEqual(localHome.codes,expectedCards,'GitHub home card order must be expected');
assert.deepEqual(remoteHome.codes,expectedCards,'Cloudflare must serve Einstein home card order');
assert.match(remoteHome.content,/class="home-einstein"/,'Live home contains approved Einstein image');
assert.ok(remoteHome.content.includes('data:image/webp;base64,'),'Live Einstein portrait embedded');
assert.match(remoteHome.content,/Caută cazare și opțiuni de sejur/,'Hotel card is newly labelled');
assert.doesNotMatch(remoteHome.content,/Călătorii și turism/,'Old Travel label must not render');
console.log('PASS live Cloudflare cards and Einstein image. Runtime version token differs:',actual!==expected);
console.log('PASS: deployed frontend includes Einstein and new card layout; Android WebView reloads it uncached');
