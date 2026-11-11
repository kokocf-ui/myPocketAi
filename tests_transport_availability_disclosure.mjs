import assert from 'node:assert/strict';
import {test} from 'node:test';
import {annotateTransportJourneys,transportAvailabilityDisclosure,transportNoticeLine} from './transport_availability_disclosure.mjs';

const train={provider:'Bilo',legs:[{mode:'train',operator:'CFR'}],fareLocal:null};
test('show uncertainty without hiding a valid unpriced itinerary',()=>{
 const d=transportAvailabilityDisclosure(train);
 assert.equal(d.fare_status,'unavailable');
 assert.equal(d.seat_status,'unverified');
 assert.match(transportNoticeLine(train),/Preț indisponibil/);
 assert.match(transportNoticeLine(train),/Disponibilitatea locurilor/);
 const [annotated]=annotateTransportJourneys([train]);
 assert.equal(annotated.legs[0].mode,'train');
 assert.ok(annotated.availability_disclosure);
 assert.equal(train.availability_disclosure,undefined);
});
test('TfL has no reservations, and no invented fare',()=>{
 const j={provider:'TfL',legs:[{mode:'tube'},{mode:'bus'}]};
 const d=transportAvailabilityDisclosure(j);
 assert.equal(d.seat_status,'not_applicable');
 assert.equal(d.seat_message,null);
 assert.equal(d.fare_status,'unavailable');
 assert.match(transportNoticeLine(j,'en'),/Fare unavailable/);
 assert.doesNotMatch(transportNoticeLine(j,'en'),/Seat/);
});
test('published fare remains visible but not guaranteed for purchase',()=>{
 const j={provider:'Bilo',fareLocal:{amount:48,currency:'RON'},legs:[{mode:'train'}]};
 const d=transportAvailabilityDisclosure(j);
 assert.equal(d.fare_status,'published_unverified');
 assert.match(d.fare_message,/Tarif publicat/);
 assert.equal(d.seat_status,'unverified');
});
test('a partial fare is never presented as a total',()=>{
 const d=transportAvailabilityDisclosure({
  provider:'TransCAPI',fareGBP:12.5,fareComplete:false,legs:[{mode:'coach'}]
 },'en');
 assert.equal(d.fare_status,'partial');
 assert.match(d.fare_message,/total price is not confirmed/);
});
test('do not invent fare or reservation for local buses, unknown provider and zero',()=>{
 const j={provider:'TfL',fareGBP:0,legs:[{mode:'bus'}]};
 assert.equal(transportAvailabilityDisclosure(j).fare_status,'published_unverified');
 assert.equal(transportAvailabilityDisclosure({legs:[{mode:'walking'}]}).seat_status,'not_applicable');
});
test('FlixBus needs availability confirmation even if mode is bus',()=>{
 const d=transportAvailabilityDisclosure({provider:'external',legs:[{mode:'bus',operator:'FlixBus'}]});
 assert.equal(d.seat_status,'unverified');
});
