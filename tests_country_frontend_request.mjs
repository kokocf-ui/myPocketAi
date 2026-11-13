import assert from 'node:assert/strict';
import {planFrontendPlaceProviders as plan} from './country_frontend_request.mjs';

// Same rules for UK, Romania and Italy; country comes from backend geocoding.
const common={enabled:true,geoapifyConfigured:true,tomtomConfigured:false};
const uk=plan({...common,category:'corner_shop',verifiedCountryCode:'GB'});
assert.deepEqual(uk.providers,['geoapify','photon','uk_food_retailers']);
assert.equal(uk.mode,'country_scoped');
assert.equal(uk.country,'GB');
const ro=plan({...common,category:'corner_shop',verifiedCountryCode:'RO'});
assert.deepEqual(ro.providers,['geoapify','photon']);
assert.equal(ro.ukRetailAllowed,false);
assert.equal(ro.country,'RO');
const it=plan({...common,category:'corner_shop',verifiedCountryCode:'IT'});
assert.deepEqual(it.providers,ro.providers);
const genericUk=plan({...common,category:'restaurant',verifiedCountryCode:'GB'});
assert.deepEqual(genericUk.providers,['geoapify','photon']);
// An unverified GPS-only location cannot silently become UK.
const gps=plan({...common,category:'corner_shop'});
assert.equal(gps.mode,'common_only');
assert.equal(gps.country,null);
assert.equal(gps.ukRetailAllowed,false);
// Current deployed app behavior preserved until owner explicitly enables flag.
const old=plan({enabled:false,category:'corner_shop',verifiedCountryCode:'RO'});
assert.equal(old.mode,'legacy');
assert.equal(old.ukRetailAllowed,true);
// No API keys: only enabled provider metadata is returned.
assert.deepEqual(plan({...common,category:'pharmacy',verifiedCountryCode:'RO',geoapifyConfigured:false}).providers,['photon']);
console.log('Frontend/backend country-dispatch contract tests passed');
