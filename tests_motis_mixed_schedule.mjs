import assert from 'node:assert/strict';
import {motisQueryDepartureAt,selectScheduledMOTISAlternatives} from './motis_mixed_schedule.mjs';
import {readFileSync} from 'node:fs';
const base=Date.parse('2026-11-17T10:00:00Z');
const at=minutes=>new Date(base+minutes*60000).toISOString();
assert.deepEqual(motisQueryDepartureAt(null,base),{status:'now',iso:null,ms:base});
const offset='2026-11-18T12:00:00+02:00';
assert.equal(motisQueryDepartureAt(offset,base).iso,'2026-11-18T10:00:00.000Z',
 'Requested local offset is converted to an exact instant');
assert.equal(motisQueryDepartureAt('2026-11-18T10:00',base).status,'invalid_departure_time',
 'Ambiguous timezone-free time may not accidentally change calendar date');
assert.equal(motisQueryDepartureAt(at(-300),base).status,'invalid_departure_time');
assert.equal(motisQueryDepartureAt(at(62*24*60),base).status,'invalid_departure_time');
const mk=(mode,depart,arrive,id)=>({
 id,startDateTime:at(depart),arrivalDateTime:at(arrive),transferCount:0,
 legs:[{mode,from:'A',to:'B',departureTime:at(depart),arrivalTime:at(arrive)}]
});
const trips=[
 mk('coach',16,210,'coach-direct'),
 mk('train',60,135,'train-later-but-sooner'),
 mk('train',12,155,'train-early-but-slower'),
 mk('ferry',50,190,'ferry-direct'),
 mk('coach',20,235,'coach-slower'),
 mk('walking',0,280,'no-public-transport'),
 mk('flight',10,85,'flight-too-early-for-future-day')
];
const ranked=selectScheduledMOTISAlternatives(trips,{
 departureAt:at(15),limit:4,now:base
});
assert.ok(ranked.every(x=>Date.parse(x.startDateTime)>=Date.parse(at(15))),
 'Routes departing before the calendar selection must be excluded');
assert.deepEqual(ranked.map(x=>x.id),[
 'train-later-but-sooner','ferry-direct','coach-direct','coach-slower'
], 'Fastest arrival, a representative of each mode, then other verified alternatives');
assert.deepEqual(selectScheduledMOTISAlternatives(trips,{
 departureAt:at(15),limit:2,now:base
}).map(x=>x.id),['train-later-but-sooner','ferry-direct']);
assert.equal(selectScheduledMOTISAlternatives(trips,{departureAt:'bad-date',now:base}).length,0);
assert.equal(selectScheduledMOTISAlternatives([], {now:base}).length,0);
const b=readFileSync('backend.js','utf8');
assert.match(b,/url\.searchParams\.set\('time',departure\.iso\)/,
 'Licensed MOTIS request includes exact selected ISO time');
assert.match(b,/url\.searchParams\.set\('searchWindow','3600'\)/,
 'Provider-side departure window permits alternative departures');
assert.match(b,/planMOTISMixedJourney\(env,mixedOrigin,\{latitude:targetLat,longitude:targetLon\},lang,effectiveDepartureAt,\{signal:request\.signal\}\)/,
 'Calendar field reaches the international planner');
assert.match(b,/selectScheduledMOTISAlternatives\(journeys,\{/,
 'Back-end uses earliest arrival and mode-diversity ranking');
assert.doesNotMatch(b,/scheduled_search_not_supported/,
 'No more skipping authorized requests solely because calendar has a date');
assert.match(b,/if\(url\.hostname==='api\.transitous\.org'\)return \{status:'provider_usage_not_authorized'/,
 'Unlicensed volunteer MOTIS service remains rejected');
assert.match(b,/!String\(env\.MOTIS_API_BASE_URL\|\|'\'\)\.trim\(\)\?\{status:'not_configured',journeys:\[\]\}/,
 'Missing licensed endpoint is still not invented');
console.log('PASS mixed international calendar: MOTIS date, earliest complete arrival, diverse modes, no fabricated provider');
