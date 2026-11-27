import assert from 'node:assert/strict';
import {EUROPE_COUNTRIES,europeanCountrySources} from './europe_country_sources.mjs';
import {OPEN_SURFACE_TRANSPORT_SOURCE,openSurfaceConfigurationStatus} from './public_transport_sources.mjs';
import {NATIONAL_TRANSPORT_COUNTRIES,configuredNationalTransportProviders,nationalTransportCoverage} from './national_transport_registry.mjs';
import {selectCountryProviders,classifyCategory,countryCoverage,planMixedTransportSources} from './smart_country_registry.mjs';
import {nationalPublicTransportPolicy} from './national_public_transport_policy.mjs';
import {loadOpenSurfaceIndex} from './open_surface_timetable.mjs';
import worker from './backend.js';
const id=OPEN_SURFACE_TRANSPORT_SOURCE.id;
assert.equal(classifyCategory('Transport public').category,'public_transport');
assert.equal(classifyCategory('public transport').branch,'transport');
let assetCalls=0;
const assets={fetch(){assetCalls++;throw Error('Metadata must not load the index')}};
for(const [env,status] of [[{},'disabled'],[{OPEN_SURFACE_ASSETS:assets},'disabled'],[{OPEN_SURFACE_ENABLED:'true'},'index_not_configured'],
 [{OPEN_SURFACE_ENABLED:'true',OPEN_SURFACE_ASSETS:{}},'index_not_configured']]){
 assert.equal(openSurfaceConfigurationStatus(env),status);
 assert.ok(!configuredNationalTransportProviders(env).includes(id));
 assert.equal((await loadOpenSurfaceIndex(env)).status,status);
}
const enabledEnv={TFL_PUBLIC_FALLBACK:'false',OPEN_SURFACE_ENABLED:'true',OPEN_SURFACE_ASSETS:assets};
assert.deepEqual(configuredNationalTransportProviders(enabledEnv),[id]);
assert.equal(assetCalls,0);
for(const country of EUROPE_COUNTRIES){
 const profile=NATIONAL_TRANSPORT_COUNTRIES[country];
 assert.ok(profile.supplementary_transport.includes(id));
 assert.ok(profile.international_transport.includes(id));
 assert.ok(!profile.urban_transport.includes(id),'Intercity operator is never an urban network');
 assert.ok(!profile.intercity_transport.includes(id),'Supplementary feed is not a national domestic planner');
 const off=nationalTransportCoverage(country,[]),on=nationalTransportCoverage(country,[id]);
 assert.equal(off.public_transport_registered,true);
 assert.equal(off.supplementary_sources[0].configured,false);
 assert.equal(on.supplementary_sources[0].configured,true);
 assert.equal(on.countrywide_coverage_verified,false);
 assert.equal(on.supplementary_sources[0].domestic_service_verified,false);
 assert.equal(on.supplementary_sources[0].coverage_status,'requires_loaded_feed_stop_and_date_verification');
 assert.equal(on.urban_configured,false);assert.equal(on.intercity_configured,false);
 assert.equal(on.coverage_status,'not_connected','Do not claim an ordinary domestic dispatch exists');
 assert.ok(europeanCountrySources(country).transport.some(s=>s.id===id&&s.status==='implemented_gated'));
 assert.deepEqual(selectCountryProviders({country,category:'public_transport',enabledProviders:[]}).providers,[]);
 assert.deepEqual(selectCountryProviders({country,category:'intercity_transport',enabledProviders:[id]}).providers,[id]);
 assert.deepEqual(selectCountryProviders({country,category:'urban_transport',enabledProviders:[id]}).providers,[]);
}
assert.equal(countryCoverage('Romania').publicTransport.supplementary_sources[0].observed_source_stops,true);
assert.equal(countryCoverage('Italia').publicTransport.supplementary_sources[0].observed_source_stops,false,'No inference from European scope');
assert.equal(countryCoverage('Japan').publicTransport,null);
for(const mode of ['flight','ferry','airport','walking','driving','metro']){
 assert.deepEqual(selectCountryProviders({originCountry:'GB',destinationCountry:'RO',category:'international_transport',mode,enabledProviders:[id]}).providers,[]);
}
for(const mode of ['train','rail','coach']){
 assert.deepEqual(selectCountryProviders({originCountry:'GB',destinationCountry:'RO',category:'international_transport',mode,enabledProviders:[id]}).providers,[id]);
}
assert.deepEqual(selectCountryProviders({originCountry:'GB',destinationCountry:'JP',category:'international_transport',enabledProviders:[id]}).providers,[]);
assert.deepEqual(selectCountryProviders({originCountry:'GB',destinationCountry:'RO',category:'public_transport',region:'london',enabledProviders:['tfl','ro_urban_gtfs',id]}).providers,[id],
 'Cross-border public request must not broadcast to two urban networks');
const stages=planMixedTransportSources({enabledProviders:[id,'tfl'],stages:[{country:'GB',region:'london',mode:'bus'},
 {originCountry:'GB',destinationCountry:'RO',mode:'coach'},{originCountry:'GB',destinationCountry:'RO',mode:'flight'}]});
assert.deepEqual(stages.stages[0].providers,['tfl']);assert.deepEqual(stages.stages[1].providers,[id]);assert.deepEqual(stages.stages[2].providers,[]);
assert.equal(nationalPublicTransportPolicy({originCountry:'FR',destinationCountry:'FR',enabledProviders:[id]}).provider,null);
assert.equal(nationalPublicTransportPolicy({originCountry:'RO',destinationCountry:'RO',enabledProviders:['ro_national_transit',id]}).provider,'ro_national_transit');
assert.equal(nationalPublicTransportPolicy({originCountry:'DE',destinationCountry:'DE',enabledProviders:[id]}).provider,null,'No HERE activation or Germany fallback');
// Actual GPS-country metadata endpoint, no timetable loading / transport calls.
const realFetch=globalThis.fetch;
globalThis.fetch=async input=>{
 const url=new URL(typeof input==='string'?input:input.url||String(input));
 assert.equal(url.hostname,'api.geoapify.com');assert.equal(url.pathname,'/v1/geocode/reverse');
 return Response.json({features:[{properties:{country_code:'fr'}}]});
};
try{
 const response=await worker.fetch(new Request('https://fixture.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({national_transit_country:{location:{latitude:48.85,longitude:2.35}}})}),{...enabledEnv,GEOAPIFY_API_KEY:'fixture'});
 const body=await response.json();assert.equal(response.status,200);
 assert.equal(body.country_code,'FR');assert.equal(body.supported,false,'Registered source must not unlock unsupported domestic search');
 assert.equal(body.provider_coverage.supplementary_sources[0].id,id);
 assert.equal(body.provider_coverage.supplementary_sources[0].configured,true);
 assert.equal(body.provider_coverage.countrywide_coverage_verified,false);assert.equal(assetCalls,0);
}finally{globalThis.fetch=realFetch}
console.log('PASS public transport country registry: 49 profiles, honest gated surface source, shared configuration, mode/country separation, unchanged domestic/HERE policy, actual metadata endpoint without timetable/provider calls');
