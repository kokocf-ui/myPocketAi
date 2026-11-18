import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {romanianNationalQuery} from './ro_national_transit.mjs';

const destination={latitude:47.0612,longitude:21.9473,
 label:'Strada Nufărului 12, 410100 Oradea, Romania',country_code:'RO'};
const ukGps={latitude:51.475,longitude:0.325};
const roGps={latitude:47.060,longitude:21.960};
const prompt='Caută transport mixt către '+destination.label;
const sameChoices={mixed_journey:true,travel_mode:'transit',destination,transit_query:destination.label};
assert.equal(romanianNationalQuery(prompt,{...sameChoices,location:ukGps}),null,
 'UK phone GPS -> selected Oradea address is international, not a domestic Bilo request');
assert.equal(romanianNationalQuery(prompt,{...sameChoices,location:null}),null,
 'Without verified Romanian origin, do not silently send mixed destination to Bilo');

const ukSavedGps={latitude:51.475,longitude:0.325,label:'GPS'};
assert.equal(romanianNationalQuery(prompt,{...sameChoices,location:ukGps,origin:ukSavedGps}),null,
 'Retained UK GPS coordinates cannot turn the mixed Oradea destination into Bilo domestic transport');
assert.equal(romanianNationalQuery(prompt,{...sameChoices,location:null,origin:ukSavedGps}),null,
 'Retained overseas GPS coordinates still reject Bilo when location permission temporarily fails');
const explicitRoPair=romanianNationalQuery('Caută transport mixt către Cluj-Napoca',{
 mixed_journey:true,location:ukGps,origin:{city:'Oradea',country_code:'RO'},
 destination:{city:'Cluj-Napoca',country_code:'RO'}});
assert.equal(explicitRoPair?.origin,'Oradea',
 'A deliberate Romanian city pair remains eligible regardless of phone location');

const domestic=romanianNationalQuery(prompt,{...sameChoices,location:roGps});
assert.ok(domestic,'Romanian GPS origin remains eligible for domestic planning');
assert.equal(domestic.hasOrigin,false);
assert.ok(romanianNationalQuery('Transport public din Oradea la Cluj-Napoca',{
 mixed_journey:true,location:ukGps
})?.hasOrigin,'Explicit Romanian city pair remains valid regardless of device country');
assert.equal(romanianNationalQuery(prompt,{
 ...sameChoices,location:ukGps,origin:{label:'London, United Kingdom',country_code:'GB'}
}),null,'Explicit GB origin cannot be replaced by Romanian departure');

const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert.ok(backend.includes('const roTransitQuery=!explicitCarRoute?romanianNationalQuery('));
assert.ok(backend.includes('if(roTransitQuery && (env.BILO_API_KEY || !env.MOTIS_API_BASE_URL)'));
assert.ok(backend.includes('if(internationalTarget||explicitMixedJourney||ukRegionalJourney)'));
assert.ok(backend.includes("!String(env.MOTIS_API_BASE_URL||'').trim()?{status:'not_configured',journeys:[]}"));
assert.ok(backend.includes('transit_destination_point:{latitude:targetLat,longitude:targetLon,label:targetName}'));
assert.ok(backend.includes('departure_at:departureAt},')&&backend.includes('provider_status:{motis:detail},reason:detail'),'Departure remains available in the fallback response with sanitized provider status');
const inline=readFileSync(new URL('./one_field_journey_ui.mjs',import.meta.url),'utf8');
assert.ok(inline.includes('journeyOrigin:from,transitDestination:point,transitQuery:point.label'));
assert.ok(inline.includes("initialDepartureAt=null"));
assert.ok(inline.includes("picker.value=formatLocal(validInitial?initialDate:new Date())"));
assert.ok(inline.includes('let changed=Boolean(validInitial)'));
assert.ok(inline.includes('const priorOrigin=incoming?.selected_origin'));
assert.ok(inline.includes('state.moduleSearchCategory=stageChoice'),
 'The calendar must preserve a coordinate-bearing mixed journey stage');
assert.ok(inline.includes('back(){'),
 'The one-field wizard must handle Android and header Back locally');
assert.ok(inline.includes("background:linear-gradient(145deg,#903550,#602139)!important"));
const ui=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert.ok(ui.includes('state.moduleSearchCategory={...choice,journeyOrigin:coords}'),
 'GPS resolution must be copied into the result Back snapshot');
assert.ok(ui.includes("detail==='mixed_origin_unavailable'"),
 'Missing GPS must not trigger an unrelated Romanian domestic planner');
assert.ok(ui.includes('if(oneFieldJourneySession?.back?.())return;'),
 'The shared Back action must unwind the active destination/calendar stage');
const retry=ui.slice(ui.indexOf('function showTransitRetrySelector('),ui.indexOf('function showPreciseJourney('));
assert.ok(retry.includes("if(choice.mixedJourney===true)"));
assert.ok(retry.includes('selected_destination:destination,selected_origin:origin'));
assert.ok(retry.includes('initialDepartureAt:choice.transitDepartureAt||state.lastTransitChoice?.transitDepartureAt||null'));
assert.ok(retry.includes("transitDestination:destination,transitQuery:destination.label"));
assert.ok(retry.includes("action(dialogText('Schimbă data și ora'"));
assert.ok(retry.includes("const burgundy='background:linear-gradient(145deg,#903550,#602139)!important"));
assert.ok(retry.indexOf("if(choice.mixedJourney===true)")<retry.indexOf('const filters=transitSearchSelectors()'),
 'Old blue recalculate + two selectors are not shown for mixed results');
console.log('PASS screenshot regression: UK GPS -> Oradea international routing; date, destination, and burgundy recovery');
