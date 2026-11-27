// Offline check against the engine's published OpenAPI. No endpoint contacted.
// Usage: node scripts/check_germany_motis_contract.mjs <openapi.yaml> <yaml/dist/index.js>
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {planGermanyNationalJourney,GERMANY_MOTIS_MODES} from '../germany_national_transit.mjs';
import {env,options,now,payload} from '../test_fixtures/germany_national.mjs';
const [schemaPath,parserPath]=process.argv.slice(2);
if(!schemaPath||!parserPath)throw Error('Supply published OpenAPI and local YAML parser. Nothing is fetched or installed.');
const {parse}=createRequire(import.meta.url)(resolve(parserPath)),api=parse(readFileSync(schemaPath,'utf8'));
const operation=api.paths['/api/v6/plan'].get,params=new Map(operation.parameters.map(p=>[p.name,p]));
const schemas=api.components.schemas;
const deref=s=>s?.$ref?schemas[s.$ref.split('/').at(-1)]:s;
function parameterValue(value,s){
 s=deref(s);
 if(s.type==='array'){for(const v of value?value.split(','):[])parameterValue(v,s.items);return;}
 if(s.type==='boolean')assert.ok(['true','false'].includes(value));
 if(s.type==='integer')assert.ok(/^\d+$/.test(value));
 if(s.format==='date-time')assert.ok(Number.isFinite(Date.parse(value)));
 if(s.enum)assert.ok(s.enum.includes(value),'Unknown enum '+value);
}
const captures=[];
await planGermanyNationalJourney(env,options,{now,verifyCountry:async()=> 'DE',fetchImpl:async url=>{captures.push(new URL(url));return Response.json(payload());}});
assert.equal(captures.length,2);
for(const u of captures){
 for(const [k,v] of u.searchParams){assert.ok(params.has(k),'Unknown query parameter '+k);parameterValue(v,params.get(k).schema);}
 for(const p of operation.parameters.filter(p=>p.required))assert.ok(u.searchParams.has(p.name),'Missing required parameter '+p.name);
}
for(const m of Object.keys(GERMANY_MOTIS_MODES))assert.ok(schemas.Mode.enum.includes(m));
const consumed={
 Leg:'mode startTime endTime scheduledStartTime scheduledEndTime realTime scheduled from to cancelled intermediateStops agencyName agencyUrl routeShortName displayName routeLongName loopedCalendarSince interlineWithPreviousLeg reservation',
 Place:'name lat lon stopId vertexType pickupType dropoffType cancelled',
 Itinerary:'startTime endTime legs'
};
for(const [type,fields] of Object.entries(consumed))for(const f of fields.split(' '))assert.ok(schemas[type].properties[f],type+'.'+f+' not in schema');
const response=operation.responses['200'].content['application/json'].schema;
assert.equal(response.properties.itineraries.items.$ref,'#/components/schemas/Itinerary');
assert.equal(schemas.Leg.properties.intermediateStops.items.$ref,'#/components/schemas/Place');
console.log('PASS MOTIS v6 request parameters/enums and consumed response fields match published OpenAPI. Not a full JSON Schema validator, API smoke or coverage test.');
