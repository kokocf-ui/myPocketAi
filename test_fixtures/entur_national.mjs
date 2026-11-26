// Hand-authored test responses, NOT captured timetables or promised services.
export const from={latitude:59.911,longitude:10.75},to={latitude:59.92,longitude:10.76};
export const at='2026-11-27T09:00:00Z';
export const now=Date.parse('2026-11-26T10:00:00Z');
export const env={ENTUR_NATIONAL_ENABLED:'true',ENTUR_TERMS_REVIEWED:'true',ENTUR_CLIENT_NAME:'mypocketai-contract-tests'};
export const options={from,to,originCountry:'NO',destinationCountry:'NO',departureAt:at,limit:4};
export const place=(name,p,id)=>({name,...p,quay:{id}});
export function leg(mode='bus',a=from,b=to,start='2026-11-27T09:10:00Z',end='2026-11-27T09:20:00Z'){
 return {mode,realtime:false,aimedStartTime:start,expectedStartTime:start,aimedEndTime:end,expectedEndTime:end,
  fromPlace:place('Test start',a,'NSR:Quay:1'),toPlace:place('Test end',b,'NSR:Quay:3'),
  fromEstimatedCall:{cancellation:false},toEstimatedCall:{cancellation:false},
  line:{publicCode:'TEST-42'},operator:{name:'Synthetic Operator',url:'https://example.com/'},
  intermediateQuays:[{id:'NSR:Quay:2',latitude:(a.latitude+b.latitude)/2,longitude:(a.longitude+b.longitude)/2}]};
}
export const pattern=(mode='bus')=>({legs:[leg(mode)]});
export const payload=patterns=>({data:{trip:{routingErrors:[],tripPatterns:patterns}}});
