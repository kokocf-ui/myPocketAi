import assert from 'node:assert/strict';
import {searchAnchorPolicy as anchor} from './country_search_anchor.mjs';
import {planFrontendPlaceProviders} from './country_frontend_request.mjs';
// No home country, interface language, nationality or previous residence matters.
for(const [city,latitude,longitude] of [['Grays',51.4775,0.3007],['Oradea',47.0594,21.9349]]){
 const choice=anchor({hasValidGps:true,latitude,longitude});
 assert.equal(choice.mode,'device_gps',city);
 assert.equal(choice.locationSource,'browser_gps',city);
 assert.equal(choice.useDeviceGps,true,city);
}
const remote=anchor({hasValidGps:true,latitude:51.4775,longitude:0.3007,
 explicitDestination:'Oradea, România'});
assert.equal(remote.mode,'explicit_destination');
assert.equal(remote.useDeviceGps,false);
assert.equal(remote.locationSource,'explicit_place_query');
// A city-less or ambiguous request must not inherit GPS when requiring clarification.
const ambiguous=anchor({hasValidGps:true,latitude:51.4775,longitude:0.3007,
 needsDestination:true});
assert.equal(ambiguous.mode,'clarification');
assert.equal(ambiguous.useDeviceGps,false);
assert.equal(anchor({hasValidGps:false}).mode,'clarification');
assert.equal(anchor({hasValidGps:true,latitude:null,longitude:0}).mode,'clarification');
assert.equal(anchor({hasValidGps:true,latitude:91,longitude:0}).mode,'clarification');
// Country code only selects sources after the anchor's location has been verified.
const noCountry=planFrontendPlaceProviders({category:'corner_shop',enabled:true,geoapifyConfigured:true});
assert.equal(noCountry.country,null);
assert.equal(noCountry.mode,'common_only');
console.log('GPS-only implicit geographic anchor and explicit destination priority tests passed');
