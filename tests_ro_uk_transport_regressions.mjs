import assert from 'node:assert/strict';
import {test} from 'node:test';
import {romanianNationalQuery} from './ro_national_transit.mjs';
import {requestedRomanianVehicle,filterRomanianVehicleJourneys,romanianModeNoResultsMessage,rankRomanianJourneys,filterRomanianCityEndpoints,groupRomanianJourneys} from './ro_transport_mode_policy.mjs';
import {explicitOriginDestinationPair} from './route_explicit_origin.mjs';
const roGps={latitude:47.05,longitude:21.9};
const ukGps={latitude:51.48,longitude:0.33};
test('Grays -> Liverpool Street must NEVER reach Bilo, even with stale Romanian GPS',()=>{
 const text='Cu transportul public din Grays la Liverpool Street Station mâine.';
 assert.equal(romanianNationalQuery(text,{location:ukGps,mixed_journey:true}),null);
 assert.equal(romanianNationalQuery(text,{location:roGps,mixed_journey:true}),null);
 assert.equal(romanianNationalQuery('Din Grays la Manchester cu trenul',{location:roGps}),null);
 assert.equal(romanianNationalQuery(text,{location:ukGps,origin:{city:'Grays',country_code:'GB'},destination:{city:'Liverpool Street Station',country_code:'GB'}}),null);
});
test('explicit UK destination overrides stale Romania context',()=>{
 assert.equal(romanianNationalQuery('Cu trenul din Oradea la Cluj-Napoca',{
  origin:{country_code:'GB'},destination:{country_code:'RO'},mixed_journey:true
 }),null);
});
test('Romanian national trains still work from UK GPS',()=>{
 const route=romanianNationalQuery('Cu trenul din Oradea la Cluj-Napoca pe 15 noiembrie 2026',{location:ukGps});
 assert.equal(route.origin,'Oradea');
 assert.equal(route.destination,'Cluj-Napoca');
});
test('explicit car route never reaches Bilo even if mixed journey flag is stale',()=>{
 assert.equal(romanianNationalQuery('Arată-mi traseul cu mașina din Oradea la Cluj-Napoca',
  {location:roGps,mixed_journey:true,travel_mode:'transit'}),null);
});
test('only actual coaches satisfy an autocar request',()=>{
 assert.equal(requestedRomanianVehicle('Vreau să călătoresc cu autocarul din Oradea la Cluj-Napoca pe 15 noiembrie 2026'),'coach');
 const train={legs:[{mode:'train',from:'Oradea',to:'Carei'}, {mode:'train',from:'Carei',to:'Cluj-Napoca'}]};
 const coach={legs:[{mode:'coach',from:'Oradea',to:'Cluj-Napoca'}]};
 const mixed={legs:[{mode:'train',from:'Oradea',to:'Carei'},{mode:'coach',from:'Carei',to:'Cluj'}]};
 assert.deepEqual(filterRomanianVehicleJourneys([train,coach,mixed],'coach'),[coach]);
 assert.deepEqual(filterRomanianVehicleJourneys([train,coach,mixed],'rail'),[train]);
 assert.deepEqual(filterRomanianVehicleJourneys([train,coach,mixed],'all'),[train,coach,mixed]);
 assert.match(romanianModeNoResultsMessage('coach'),/Nu am putut confirma nicio cursă cu autocarul/);
});
test('route parser retains explicit departure from Oradea instead of phone GPS',()=>{
 const routes=[
  ['arata-mi traseul cu masina din oradea la cluj-napoca','oradea','cluj-napoca'],
  ['cu masina din bucuresti spre brasov','bucuresti','brasov'],
  ['drive from london to manchester','london','manchester'],
  ['merg din oradea pana la cluj','oradea','cluj']
 ];
 for(const [request,from,to] of routes){
  const pair=explicitOriginDestinationPair(request);
  assert.ok(pair,request);
  assert.equal(pair[1],from);
  assert.equal(pair[2],to);
 }
 assert.equal(explicitOriginDestinationPair('Merg cu mașina la București'),null);
});
test('fast direct train ranks ahead of 8-hour 3-train detour',()=>{
 const slow={durationMinutes:506,startDateTime:'2026-11-15T01:00:00Z',
  legs:[{mode:'train'},{mode:'train'},{mode:'train'}]};
 const direct={durationMinutes:145,startDateTime:'2026-11-15T03:22:00Z',
  legs:[{mode:'train'}]};
 const ranked=rankRomanianJourneys([slow,direct]);
 assert.equal(ranked[0],direct);
 assert.equal(ranked[1],slow);
});

test('do not substitute Episcopia Bihor for requested Oradea departure',()=>{
 const good={legs:[{mode:'train',from:'Oradea',to:'Carei'},{mode:'train',from:'Carei',to:'Cluj Napoca Est'}]};
 const wrong={legs:[{mode:'train',from:'Episcopia Bihor',to:'Valea lui Mihai'},{mode:'train',from:'Valea lui Mihai',to:'Cluj Napoca Est'}]};
 assert.deepEqual(filterRomanianCityEndpoints([wrong,good],'Oradea','Cluj-Napoca'),[good]);
 const bucharest={legs:[{mode:'train',from:'București Nord Gr.A',to:'Brașov'}]};
 assert.deepEqual(filterRomanianCityEndpoints([bucharest],'București','Brașov'),[bucharest]);
});

test('all-mode journeys are grouped into train, road and mixed pages',()=>{
 const time='2026-11-12T08:00:00Z';
 const train={durationMinutes:150,startDateTime:time,legs:[{mode:'train',from:'Oradea',to:'Cluj'}]};
 const coach={durationMinutes:120,startDateTime:time,legs:[{mode:'coach',from:'Oradea',to:'Cluj'}]};
 const localBus={durationMinutes:180,startDateTime:time,legs:[{mode:'bus',from:'Oradea',to:'Cluj'}]};
 const mixed={durationMinutes:145,startDateTime:time,legs:[
  {mode:'train',from:'Oradea',to:'Carei'}, {mode:'coach',from:'Carei',to:'Cluj'}
 ]};
 const pages=groupRomanianJourneys([localBus,train,mixed,coach],4);
 assert.deepEqual(pages.rail,[train]);
 assert.deepEqual(pages.road,[coach,localBus]);
 assert.deepEqual(pages.mixed,[mixed]);
});
test('explicit provider locality may confirm a station with a different name',()=>{
 const associated={legs:[{
  mode:'train',from:'Episcopia Bihor',fromLocality:'Oradea',
  to:'Cluj-Napoca Est',toLocality:'Cluj-Napoca'
 }]};
 assert.deepEqual(filterRomanianCityEndpoints([associated],'Oradea','Cluj-Napoca'),[associated]);
 const unassociated={legs:[{mode:'train',from:'Episcopia Bihor',to:'Cluj-Napoca Est'}]};
 assert.deepEqual(filterRomanianCityEndpoints([unassociated],'Oradea','Cluj-Napoca'),[]);
});
