import assert from 'node:assert/strict';
import {identifyCountry,selectCountryProviders,planMixedTransportSources,classifyCategory,countryCoverage} from './smart_country_registry.mjs';
assert.equal(identifyCountry('România'),'RO');
assert.equal(identifyCountry('Italia'),'IT');
assert.deepEqual(selectCountryProviders({category:'restaurant',country:'Romania',enabledProviders:['geoapify','photon','tfl']}).providers,['geoapify','photon']);
assert.deepEqual(selectCountryProviders({category:'urban_transport',country:'Romania',enabledProviders:['ro_urban_gtfs','tfl']}).providers,['ro_urban_gtfs']);
assert.deepEqual(selectCountryProviders({category:'urban_transport',country:'UK',region:'london',enabledProviders:['ro_urban_gtfs','tfl']}).providers,['tfl']);
assert.deepEqual(selectCountryProviders({category:'urban_transport',country:'UK',region:'manchester',enabledProviders:['tfl']}).providers,[]);
assert.deepEqual(selectCountryProviders({category:'intercity_transport',originCountry:'Romania',destinationCountry:'Hungary',enabledProviders:['uk_national_transit','ro_national_transit']}).providers,['ro_national_transit']);
assert.deepEqual(selectCountryProviders({category:'restaurant',country:'Italy',enabledProviders:['geoapify']}).countries,['IT']);
assert.equal(selectCountryProviders({category:'restaurant',enabledProviders:['geoapify']}).status,'country_unresolved');
assert.deepEqual(selectCountryProviders({category:'restaurant',country:'RO',enabledProviders:[]}).providers,[]);
assert.equal(classifyCategory('farmacii').branch,'general');
assert.equal(classifyCategory('transport').branch,'transport');
assert.deepEqual(selectCountryProviders({category:'shop',country:'Italia',enabledProviders:['uk_food_retailers','photon']}).providers,['photon']);
assert.deepEqual(selectCountryProviders({category:'shop',country:'UK',enabledProviders:['uk_food_retailers','photon']}).providers,['photon','uk_food_retailers']);
assert.deepEqual(selectCountryProviders({category:'fast_food',country:'România',enabledProviders:['uk_food_retailers','geoapify']}).providers,['geoapify']);
const mixed=planMixedTransportSources({enabledProviders:['ro_urban_gtfs','tfl','uk_national_transit','ro_national_transit'],
 stages:[{mode:'airport',country:'Romania'},{mode:'flight',originCountry:'Romania',destinationCountry:'UK'},
 {mode:'airport',country:'UK',region:'london'},{mode:'bus',country:'UK',region:'london'}]});
assert.equal(mixed.stages.length,4);
assert.deepEqual(mixed.stages[0].providers,['ro_urban_gtfs']);
assert.equal(mixed.stages[1].status,'no_configured_provider');
assert.deepEqual(mixed.stages[2].providers,['tfl']);
assert.deepEqual(mixed.stages[3].providers,['tfl']);
assert.equal(mixed.status,'partial_coverage');
assert.equal(countryCoverage('Italia').country,'IT');
console.log('Country registry checks passed');
