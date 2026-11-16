import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nationalPublicTransportPolicy} from './national_public_transport_policy.mjs';
import {rankJourneySuggestions} from './journey_suggestion_rank.mjs';
import {romanianLocalJourneyScope} from './romanian_transport_scope.mjs';
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const ui=readFileSync(new URL('./national_public_transport_ui.mjs',import.meta.url),'utf8');
const enabledProviders=['ro_urban_gtfs','ro_national_transit','tfl','uk_national_transit'];
const check=o=>nationalPublicTransportPolicy({...o,enabledProviders});
assert.equal(check({originCountry:'RO',destinationCountry:'RO',urbanRoute:true}).provider,'ro_urban_gtfs');
assert.equal(check({originCountry:'RO',destinationCountry:'RO'}).provider,'ro_national_transit');
assert.equal(check({originCountry:'GB',destinationCountry:'GB',londonRoute:true}).provider,'tfl');
assert.equal(check({originCountry:'GB',destinationCountry:'GB'}).provider,'uk_national_transit');
assert.equal(check({originCountry:'GB',destinationCountry:'RO'}).status,'international_destination');
assert.equal(check({originCountry:'RO',destinationCountry:'GB'}).status,'international_destination');
assert.equal(check({originCountry:'FR',destinationCountry:'FR'}).status,'country_provider_not_connected');
assert.equal(check({originCountry:'',destinationCountry:'GB'}).status,'origin_country_unverified');
assert.equal(nationalPublicTransportPolicy({originCountry:'GB',destinationCountry:'GB',enabledProviders:['tfl']}).status,'national_provider_not_connected');
assert.match(frontend,/title:'Transport public național'/);
assert.match(frontend,/showNationalTransitSearch\(choice\)/);
assert.match(frontend,/national_public_transport:choice\.nationalPublicTransport===true/);
assert.match(ui,/national_transit_country:\{location:origin\}/);
assert.match(ui,/journey_suggest:\{query:attempt,country_code:country,location:origin\}/);
assert.doesNotMatch(ui,/transitSearchSelectors|showPreciseJourney|journeyOrigin:/);
assert.match(backend,/if\(data\?\.national_transit_country\)/);
assert.match(backend,/if\(data\.national_public_transport===true\)/);
assert.match(backend,/nationalPublicTransportPolicy\(/);
assert.match(backend,/data\.national_public_transport===true\?\{status:'national_only',journeys:\[\]\}/);
assert.match(backend,/url\.searchParams\.set\('filter','countrycode:'/);
// The real station wins over accommodation and nearby unrelated businesses.
const ukRanked=rankJourneySuggestions('London victoria station',[
 {label:'Victoria Lodge, Station Road, London',_name:'Victoria Lodge',_categories:['accommodation'],city:'London'},
 {label:'citizenM London Victoria Station',_name:'citizenM London Victoria Station',_categories:['accommodation.hotel'],city:'London'},
 {label:'Victoria Station, London',_name:'Victoria Station',_categories:['public_transport.railway'],source:'TfL StopPoint',city:'London'},
 {label:'Costa, Queen Victoria Street, London',_name:'Costa',_categories:['catering.cafe'],city:'London'}
]);
assert.equal(ukRanked[0].label,'Victoria Station, London');
assert.equal(ukRanked.length,4,'Commercial landmarks remain selectable');
const tubeRanked=rankJourneySuggestions('London victoria underground',[
 {label:'Costa, Queen Victoria Street, London',_name:'Costa',_categories:['catering.cafe'],city:'London'},
 {label:'Victoria Underground Station, London',_name:'Victoria Underground Station',_categories:['public_transport.subway'],source:'TfL StopPoint',city:'London'}
]);
assert.match(tubeRanked[0].label,/Underground/);
const roFrom={latitude:47.0465,longitude:21.9189},roLocal={latitude:47.055,longitude:21.985};
const roUrban=romanianLocalJourneyScope({from:roFrom,to:roLocal,urbanRegion:true});
assert.equal(roUrban.localRoute,true);
assert.equal(check({originCountry:'RO',destinationCountry:'RO',urbanRoute:true,localRoute:true}).provider,'ro_urban_gtfs');
const nonGtfsLocal=romanianLocalJourneyScope({from:{latitude:45.75,longitude:21.23},to:{latitude:45.79,longitude:21.30}});
assert.equal(nonGtfsLocal.localRoute,true);
assert.equal(check({originCountry:'RO',destinationCountry:'RO',localRoute:nonGtfsLocal.localRoute}).status,'local_provider_not_connected',
 'Do not query Bilo for a 5–7 km city POI');
const intercity=romanianLocalJourneyScope({from:roFrom,to:{latitude:46.7712,longitude:23.6236}});
assert.equal(intercity.localRoute,false);
assert.equal(check({originCountry:'RO',destinationCountry:'RO',localRoute:intercity.localRoute}).provider,'ro_national_transit');
assert.match(backend,/rankJourneySuggestions\(selected,candidates\)/);
assert.match(backend,/localRoute:originCountry==='RO'&&roScope\.localRoute/);
assert.match(backend,/StopPoint\/Search/);
console.log('PASS national public transport registry, RO local/intercity, UK station ranking');

const stationCases=[
 {label:'Victoria, London',_name:'Victoria',kind:'city',_categories:[],city:'London'},
 {label:'Costa, Queen Victoria Street, London',_name:'Costa',_categories:['catering.cafe'],city:'London'},
 {label:'Blackfriars, London',_name:'Blackfriars',kind:'district',_categories:[],city:'London'},
 {label:'Victoria Underground Station, London',_name:'Victoria Underground Station',
  kind:'public_transport',_categories:['public_transport','subway'],source:'TfL StopPoint',city:'London'}
];
const strictStop=rankJourneySuggestions('London Victoria underground',stationCases,{national:true,origin:{latitude:51.5,longitude:-0.1}});
assert.equal(strictStop.length,1,'Only a verified Victoria Underground station is a match');
assert.match(strictStop[0].label,/Underground/);
assert.equal(rankJourneySuggestions('London Victoria underground',stationCases.slice(0,3),{national:true}).length,0,'No unrelated fallback');
const london={latitude:51.51,longitude:-0.09};
const addresses=[
 {label:'11 Liverpool Street, Southampton',house_number:'11',street:'Liverpool Street',city:'Southampton',latitude:50.9,longitude:-1.4},
 {label:'11 Liverpool Street, City of London',house_number:'11',street:'Liverpool Street',city:'City of London',latitude:51.52,longitude:-0.08},
 {label:'11 Liverpool Street, City of London, alternate postcode',house_number:'11',street:'Liverpool Street',city:'City of London',latitude:51.52001,longitude:-0.08001},
 {label:'11 Liverpool Street, Northwich',house_number:'11',street:'Liverpool Street',city:'Northwich',latitude:53.25,longitude:-2.52}
];
const refined=rankJourneySuggestions('11 Liverpool Street',addresses,{national:true,origin:london});
assert.equal(refined.length,1,'Local exact-address match must dominate and duplicate entries collapse');
assert.match(refined[0].label,/City of London/);
const explicit=rankJourneySuggestions('11 Liverpool Street, Southampton',addresses,{national:true,origin:london});
assert.ok(explicit.some(c=>c.city==='Southampton'),'User can specify another city in the same country');
assert.ok(rankJourneySuggestions('Costa',stationCases,{national:true}).some(c=>c._name==='Costa'),'Commercial landmarks remain available');
assert.match(backend,/national:Boolean\(nationalCountry\)/);
console.log('PASS screenshot regressions for station and local house number');
