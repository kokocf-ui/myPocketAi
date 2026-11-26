// Entirely synthetic responses. Names, lines and times are not real services.
export const from={latitude:60.171,longitude:24.941},to={latitude:60.18,longitude:24.95};
export const at='2026-11-27T09:00:00Z',receivedAt='2026-11-26T10:00:00Z',now=Date.parse(receivedAt);
export const env={DIGITRANSIT_NATIONAL_ENABLED:'true',DIGITRANSIT_TERMS_REVIEWED:'true',DIGITRANSIT_API_KEY:'synthetic-test-key-not-real'};
export const options={from,to,originCountry:'FI',destinationCountry:'FI',departureAt:at,limit:4};
export const stop=(id,p)=>({__typename:'Stop',gtfsId:id,lat:p.latitude,lon:p.longitude});
export function leg(mode='BUS',a=from,b=to,start='2026-11-27T09:10:00Z',end='2026-11-27T09:20:00Z'){
 const mid={latitude:(a.latitude+b.latitude)/2,longitude:(a.longitude+b.longitude)/2};
 return {mode,start:{scheduledTime:start,estimated:null},end:{scheduledTime:end,estimated:null},
  from:{name:'Synthetic departure',lat:a.latitude,lon:a.longitude,stop:{gtfsId:'TEST:1'}},
  to:{name:'Synthetic arrival',lat:b.latitude,lon:b.longitude,stop:{gtfsId:'TEST:3'}},
  route:{shortName:'TEST-FI-42',agency:{name:'Synthetic Finnish Operator',url:'https://example.com/'}},
  tripOnServiceDate:{realTimeTripState:{canceled:false,updated:false}},pickupType:'SCHEDULED',dropoffType:'SCHEDULED',
  stopCalls:mode==='WALK'?[]:[stop('TEST:1',a),stop('TEST:2',mid),stop('TEST:3',b)].map(stopLocation=>({stopLocation}))};
}
export const pattern=(mode='BUS')=>({legs:[leg(mode)]});
export const payload=patterns=>({data:{planConnection:{routingErrors:[],edges:patterns.map(node=>({node}))}}});
