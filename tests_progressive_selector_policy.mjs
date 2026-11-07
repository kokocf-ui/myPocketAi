import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const code=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const start=code.indexOf('const PROGRESSIVE_VISIBLE_CHOICES=4;');
const end=code.indexOf('function renderStructuredAddressPicker(',start);
assert.ok(start>=0&&end>start,'Shared progressive dropdown renderer exists');
const helperSource=code.slice(start,end).split(String.fromCharCode(92,92)).join(String.fromCharCode(92));
const {render,normalizeLabel}=new Function(helperSource+'\nreturn {render:renderProgressiveChoiceList,normalizeLabel:progressiveMatchText};')();
assert.equal(normalizeLabel('Căutare'),'cautare','Diacritics should not block first-letter narrowing');
assert.equal(normalizeLabel('CAFÉ'),'cafe');
const host={items:[],replaceChildren(...points){this.items=points}};
const names=Array.from({length:18},(_,i)=>({label:'Selection '+i}));
const count=render(host,names,(point)=>point);
assert.equal(count,4,'Only four selector suggestions must appear');
assert.deepEqual(host.items,names.slice(0,4),'Suggestion order is retained');
assert.equal(render(host,[],(point)=>point),0);
assert.equal(host.items.length,0);
assert.equal(render(host,[{label:'Only'}],point=>point),1);
assert.equal(host.items.length,1);
const nativeStart=code.indexOf('function openPocketSelect(select){');
const nativeEnd=code.indexOf('// Capture click AND pointerdown',nativeStart);
assert.ok(nativeStart>0&&nativeEnd>nativeStart);
const nativeCode=code.slice(nativeStart,nativeEnd);
assert.ok(nativeCode.includes('renderProgressiveChoiceList(list,matches'),
 'Native app selectors must obey the same four-suggestion cap');
assert.ok(nativeCode.includes('search.oninput=render'),
 'All native select options must be preloaded and filter on the first keystroke');
const choiceStart=code.indexOf('function openPocketSelectionPanel(');
const choiceEnd=code.indexOf('function openStandaloneChoicePanel(',choiceStart);
assert.ok(choiceStart>0&&choiceEnd>choiceStart);
const choiceCode=code.slice(choiceStart,choiceEnd);
assert.ok(choiceCode.includes('renderProgressiveChoiceList(results,visible'),
 'Standalone selection panels share the progressive cap');
assert.ok(choiceCode.includes('search.oninput=render'));


const preStart=code.indexOf('  function prewarmNext(stage){');
const preEnd=code.indexOf('  function prewarmStreets()',preStart);
assert.ok(preStart>0&&preEnd>preStart,'A common stage-aware prewarming routine is required');
const requests=[],saved=[];
const selected={country:{code:'GB'}};
const localityIndex=new Map();
let epoch=0;
const remember=(stage,q,points)=>saved.push({stage,q,points});
const keyFor=(stage,q)=>[selected.country?.code,selected.city?.city||'',stage,q].join('|');
const apiFetch=async (_url,init)=>{
 const lookup=JSON.parse(init.body).address_lookup;
 requests.push(lookup);
 return {ok:true,json:async()=>({candidates:[{label:lookup.query+'-verified',latitude:51.5,longitude:-0.1}]})};
};
// Evaluate the same routine as the browser, but with a fake provider that only
// returns verified-shaped results. No network or location is needed.
const prewarm=new Function('selected','cityOnly','localityIndex','remember','keyFor','CLIENT_CONFIG','fetch','region',
  'let localityEpoch=0;\n'+code.slice(preStart,preEnd)+'\nreturn prewarmNext;')
  (selected,false,localityIndex,remember,keyFor,{apiUrl:'https://test.invalid/api/chat'},apiFetch,'');
const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
prewarm('country');
await settle();
assert.equal(requests.length,3,'Country selection preloads a bounded sample of cities');
assert.ok(requests.every(r=>r.stage==='city'&&r.country==='gb'));
assert.equal(saved.length,3);
assert.equal(new Set(requests.map(r=>r.query)).size,3);
selected.city={city:'London',latitude:51.5074,longitude:-0.1278};
prewarm('city');
await settle();
assert.equal(requests.length,6,'City selection preloads a bounded sample of streets');
assert.ok(requests.slice(3).every(r=>r.stage==='street'&&r.city==='London'));
selected.street={street:'Oxford Street'};
prewarm('street');
await settle();
assert.equal(requests.length,7,'Street selection preloads real number candidates only for that street');
assert.equal(requests.at(-1).stage,'number');
assert.equal(requests.at(-1).street,'Oxford Street');
prewarm('number');
await settle();
assert.equal(requests.length,7,'Last selection must not trigger extra requests');
selected.street={kind:'station',street:''};
prewarm('street');
await settle();
assert.equal(requests.length,7,'Station must never prefetch fictional house numbers');
assert.ok(!code.includes('PROGRESSIVE_VISIBLE_CHOICES=4; // itinerary cap'),
 'Travel alternatives must not inherit typeahead cap');
console.log('PASS shared progressive suggestion renderer and bounded next-level country/city/street/number prefetch');
