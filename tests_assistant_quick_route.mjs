import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import frontend from './index.js';
import {assistantBareDestinationQuery as quick} from './assistant_bare_destination.mjs';

// Bare destinations are accepted only when a real town is present.
for(const value of [
 'Strada Mihai Eminescu, Oradea',
 'Strada Libertății din Alba Iulia',
 'Oxford Street, London',
 'Hotel Hilton, London',
 'Muzeul Țării Crișurilor din Oradea',
 'Hotel Marriott, București'
])assert.equal(quick(value),value,'one-line destination: '+value);
for(const value of [
 'Strada Libertății',
 'Hoteluri ieftine în Londra',
 'Ce este Muzeul Țării Crișurilor din Oradea?',
 'Unde găsesc hoteluri în Londra?',
 'Salut, ce faci?',
 'Muzee în Oradea'
])assert.equal(quick(value),null,'ordinary request must not start route: '+value);

// Main source delegates geocoding and routing to the existing shared backend.
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert.match(backend,/assistantBareDestinationQuery\(message\)/);
assert.match(backend,/data\.module==="assistant"\?assistantBareDestinationQuery/);
assert.match(backend,/const routeSpecOriginal=/);
assert.match(backend,/du\[- \]\?ma/,'hyphenated spoken navigation intent');

const html=await(await frontend.fetch(new Request('https://quick-route.test/'))).text();
const inline=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline,'frontend script generated');
new vm.Script(inline);
const from=inline.indexOf('function shopQuantityUnitLabel('),to=inline.indexOf('function shopButton(',from);
assert.ok(from>0&&to>from,'unit display helper is present');
const unit=vm.runInNewContext(inline.slice(from,to)+';shopQuantityUnitLabel',{state:{language:'ro'}});
for(const [q,u,result] of [
 ['1','sticlă','sticlă'],['2','sticlă','sticle'],['1','cartuș','cartuș'],
 ['3','cartuș','cartușe'],['2','bax','baxuri'],['2','cutie','cutii'],
 ['2','pachet','pachete'],['2','legătură','legături'],['1','kg','kg'],
 ['1,5','sticlă','sticle']
])assert.equal(unit(q,u),result,`${q} ${u}`);
assert.match(inline,/shopQuantityUnitLabel\(item\.quantity,item\.unit\)/,'active shopping list inflects');
assert.match(inline,/shopQuantityUnitLabel\(i\.quantity,i\.unit\)/,'shopping history inflects');
assert.match(inline,/assistantStructuredDestination=true;state\.pendingTravelConfirmationData/,'assistant chooses mode without leaving assistant');
console.log('Quick assistant routes and Romanian shopping plurals: OK');
