import assert from 'node:assert/strict';
import {nationalProviderAuthorized as permit} from './country_national_provider_gate.mjs';
import {planFrontendPlaceProviders as choose} from './country_frontend_request.mjs';
assert.equal(permit({provider:'tfl',country:'GB',region:'london'}),true);
assert.equal(permit({provider:'tfl',country:'GB',region:'manchester'}),false);
assert.equal(permit({provider:'tfl',country:'RO',region:'london'}),false);
assert.equal(permit({provider:'uk_national_transit',country:'GB'}),true);
assert.equal(permit({provider:'uk_national_transit',country:'RO'}),false);
assert.equal(permit({provider:'tfl',country:'GB',region:'london',enabled:false}),true);
assert.equal(permit({provider:'unknown',country:'GB'}),false);
for(const country of ['RO','GB','IT','FR']){
 const plan=choose({category:'corner_shop',verifiedCountryCode:country,enabled:true,
  geoapifyConfigured:true,tomtomConfigured:true});
 assert.deepEqual(plan.globalProviders,['photon','geoapify','tomtom_places']);
 assert.equal(plan.localProviders.includes('uk_food_retailers'),country==='GB');
}
const none=choose({category:'corner_shop',enabled:true,geoapifyConfigured:true});
assert.deepEqual(none.localProviders,[]);
assert.equal(none.ukRetailAllowed,false);
console.log('PASS: UK-only adapters from registry, global POI sources independent');
