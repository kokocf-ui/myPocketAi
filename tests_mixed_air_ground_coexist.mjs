import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');

assert.match(backend,/const flightSearchPromise=internationalTarget&&explicitMixedJourney/,
 'Flight discovery remains optional and independent from ground searches');
assert.match(backend,/const groundOperatorSearchPromise=internationalTarget&&explicitMixedJourney/,
 'Operator route evidence remains independent from flight searches');
assert.match(backend,/const flightDiscovery=await flightSearchPromise;/);
assert.match(backend,/operator_options:Array\.isArray\(result\.operators\)/);
assert.match(frontend,/renderMixedUnifiedResults\(data,choice\)/);
assert.doesNotMatch(frontend,/function renderMixedFlightCandidates\(/,
 'Obsolete separate flight-only result window must be removed, not just hidden');
const start=frontend.indexOf('function renderMixedUnifiedResults(');
const end=frontend.indexOf('function renderTransitChoices(',start);
assert.ok(start>=0&&end>start);
const unified=frontend.slice(start,end);
assert.match(unified,/appendMixedGroundOperatorCards\(host,providers,choice\)/);
assert.match(unified,/appendMixedAirCandidateCards\(host,flights,choice\)/);
assert.ok(!unified.includes('moduleStatus('),
 'Never switch back to the old status/flight-only modal');
assert.ok(frontend.includes('function appendCompactMixedTransitCards('),
 'Verified complete journeys still use the compact result cards');
console.log('PASS ground and air provider results share one screen; old flight-only renderer removed');
