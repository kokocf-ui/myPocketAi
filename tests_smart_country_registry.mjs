import assert from 'node:assert/strict';
import {identifyCountry,selectCountryProviders,planMixedTransportSources,classifyCategory,countryCoverage,europeanCountrySources,EUROPE_COUNTRIES} from './smart_country_registry.mjs';
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
assert.equal(identifyCountry('Japan'),'JP');
assert.deepEqual(selectCountryProviders({category:'pharmacy',country:'Japan',enabledProviders:['photon','uk_food_retailers']}).providers,['photon']);
assert.equal(identifyCountry('Brazil'),'BR');
assert.ok(EUROPE_COUNTRIES.length>=40);
for(const code of EUROPE_COUNTRIES){
 const catalog=europeanCountrySources(code);
 assert.equal(catalog.country,code);
 assert.ok(catalog.general.length>=2);
 assert.ok(catalog.transport.length>=1);
 assert.equal(catalog.status,'catalog_only');
}
assert.ok(europeanCountrySources('RO').transport.some(x=>x.id==='ro_bilo_evidence'));
assert.ok(europeanCountrySources('FR').transport.some(x=>x.id==='fr_nap'));
assert.ok(europeanCountrySources('DE').transport.some(x=>x.id==='de_delfi'));
assert.equal(selectCountryProviders({country:'Romania',category:'restaurant',enabledProviders:['fr_nap','photon']}).providers.join(','),'photon');
// Country parity: same category, same global sources, plus only verified local sources.
for(const location of ['Romania','UK','Italia','France']){
 const plan=selectCountryProviders({country:location,category:'restaurant',
  enabledProviders:['geoapify','photon','uk_food_retailers','tfl','ro_urban_gtfs']});
 assert.equal(plan.branch,'general');
 assert.deepEqual(plan.providers,['geoapify','photon'],location);
}
assert.deepEqual(selectCountryProviders({country:'UK',category:'corner_shop',
 enabledProviders:['geoapify','photon','uk_food_retailers']}).providers,
 ['geoapify','photon','uk_food_retailers']);
assert.deepEqual(selectCountryProviders({country:'Romania',category:'corner_shop',
 enabledProviders:['geoapify','photon','uk_food_retailers']}).providers,['geoapify','photon']);
assert.deepEqual(selectCountryProviders({country:'UK',category:'intercity_transport',
 enabledProviders:['uk_national_transit','ro_national_transit']}).providers,['uk_national_transit']);
assert.deepEqual(selectCountryProviders({country:'Romania',category:'intercity_transport',
 enabledProviders:['uk_national_transit','ro_national_transit']}).providers,['ro_national_transit']);
assert.deepEqual(selectCountryProviders({country:'UK',category:'urban_transport',region:'london',
 enabledProviders:['tfl','ro_urban_gtfs']}).providers,['tfl']);
assert.deepEqual(selectCountryProviders({country:'UK',category:'urban_transport',region:'manchester',
 enabledProviders:['tfl','ro_urban_gtfs']}).providers,[]);
assert.ok(europeanCountrySources('GB').general.some(x=>x.id==='gb_food_registry_adapter'));
assert.ok(europeanCountrySources('GB').transport.some(x=>x.id==='gb_transcapi_adapter'));
assert.deepEqual(countryCoverage('UK').branches,countryCoverage('Romania').branches);
console.log('Country registry + Europe catalog checks passed');
