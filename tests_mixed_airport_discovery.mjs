import assert from 'node:assert/strict';
import {discoverAirportCandidates,normalizeAirportCandidates} from './mixed_airport_discovery.mjs';
const feature=(iata,name,distance,country,category='airport.international')=>({
 properties:{name,lat:47+distance/100000,lon:21,country_code:country,distance,
  categories:['airport',category],datasource:{raw:{iata}}},
 geometry:{coordinates:[21,47]}
});
const data={features:[
 feature('ABC','A near airport',80000,'HU'),
 feature('DEF','Another airport',30000,'RO'),
 feature('XYZ','Small glider field',10000,'RO','airport.gliding'),
 feature(null,'Unnamed non-IATA airport',25000,'RO'),
 feature('ABC','Same airport duplicate',81000,'HU')
]};
const normalized=normalizeAirportCandidates(data,{latitude:47,longitude:21});
assert.deepEqual(normalized.map(a=>a.iata),['DEF','ABC']);
assert.equal(normalized[1].country_code,'HU','Nearby candidates must cross borders');
assert.equal(normalized[1].flightScheduleVerified,false);
assert.equal(normalized[1].onwardTransferVerified,false);
let observed;
const fake=async url=>{
 observed=new URL(url);
 return {ok:true,json:async()=>data};
};
const result=await discoverAirportCandidates({GEOAPIFY_API_KEY:'private-test-key'},
 {latitude:47,longitude:21},{radiusKm:150,fetcher:fake});
assert.equal(result.status,'candidates_only');
assert.equal(result.airports.length,2);
assert.equal(observed.searchParams.get('categories'),'airport');
assert.equal(observed.searchParams.get('filter'),'circle:21,47,150000');
assert.equal(observed.searchParams.get('bias'),'proximity:21,47');
assert.equal(result.noFlightAvailabilityVerified,true);
assert.equal((await discoverAirportCandidates({}, {latitude:47,longitude:21})).status,
 'geoapify_not_configured');
assert.equal((await discoverAirportCandidates({GEOAPIFY_API_KEY:'x'}, {},{fetcher:fake})).status,
 'location_unverified');
assert.equal((await discoverAirportCandidates({GEOAPIFY_API_KEY:'x'},
 {latitude:47,longitude:21},{fetcher:async()=>({ok:false,status:429})})).status,
 'provider_http_429');
console.log('PASS airport discovery: verified geographies, border-crossing candidates, no invented flights');

const militaryByName=feature('MIL','RAF Example',100,'GB');
const militaryByTag=feature('ARM','Example Base',200,'GB');
militaryByTag.properties.datasource.raw['aerodrome:type']='military';
const noScheduled=feature('NSS','Example airstrip',300,'GB');
noScheduled.properties.datasource.raw.scheduled_service='no';
const privateAccess=feature('PRI','Restricted airfield',400,'GB');
privateAccess.properties.datasource.raw.access='private';
const stillUnknown=feature('UNK','Ordinary geographic airport',500,'GB');
assert.deepEqual(normalizeAirportCandidates({features:[militaryByName,militaryByTag,noScheduled,privateAccess,stillUnknown]},
 {latitude:51,longitude:0}).map(a=>a.iata),['UNK'],
 'Exclude explicit unsuitable gateway evidence; missing scheduled-service tag does not fabricate absence');
assert.equal((await discoverAirportCandidates({GEOAPIFY_API_KEY:'fixture'}, {latitude:null,longitude:null},{fetcher:fake})).status,'location_unverified');
