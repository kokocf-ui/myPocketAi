import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert.match(backend,/const flightSearchPromise=internationalTarget&&explicitMixedJourney/);
assert.match(backend,/const flightDiscovery=await flightSearchPromise;/);
assert.equal((backend.match(/\.\.\.await mixedFlightFields\(\)/g)||[]).length,4,
  'Verified train/coach providers and mixed schedules carry independent flight options');
assert.match(frontend,/renderTransitChoices\(data\.transit\);if\(Array\.isArray\(data\.flight_candidates\)\&\&data\.flight_candidates\.length\)renderMixedFlightCandidates\(data,choice,true\)/);

const from=frontend.indexOf('function renderMixedFlightCandidates(');
const until=frontend.indexOf('function showTransitRetrySelector(',from);
assert.ok(from>=0&&until>from);
const snippet=frontend.slice(from,until);
class El {
 constructor(tag){this.tag=tag;this.children=[];this.style={};this.textContent='';this.className=''}
 append(...items){this.children.push(...items)}
}
const host=new El('section');
let statusCount=0,retryCount=0;
const render=new Function('document','$','dialogText','moduleStatus',
  'showTransitRetrySelector',snippet+';return renderMixedFlightCandidates;')(
  {createElement:tag=>new El(tag)},()=>host,(ro,en)=>ro,
  ()=>{statusCount++;host.children=[]},()=>{retryCount++}
);
const input={flight_candidates:[{legs:[{
  from:'AAA',to:'BBB',startLocal:'2026-11-18 11:00',
  endLocal:'2026-11-18 15:00',airline:'Example',flightNumber:'EX 12'
}],fareObserved:{amount:90,currency:'GBP'}}]};
host.append(new El('existing-train-card'));
assert.equal(render(input,{mixedJourney:true},true),true);
assert.equal(host.children.length,2,'Keep train/coach results and append flights');
assert.equal(statusCount,0,'No reset of verified terrestrial results');
assert.equal(retryCount,0,'No incomplete journey retry in verified route view');
assert.equal(render(input,{mixedJourney:true}),true);
assert.equal(statusCount,1,'Flight-only view gets an appropriate heading');
assert.equal(retryCount,1,'Flight-only view retains change-date and back actions');
console.log('PASS: concurrent air and ground results render together with truthful statuses');
