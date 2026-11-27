// Synthetic data only. No actual timetable, hosting agreement or live API key.
export const from={latitude:50.107,longitude:8.663},to={latitude:50.115,longitude:8.682};
export const at='2026-11-27T08:00:00Z',now=Date.parse('2026-11-26T12:00:00Z'),receivedAt='2026-11-26T12:00:01Z';
export const env={GERMANY_NATIONAL_ENABLED:'true',GERMANY_MOTIS_TERMS_REVIEWED:'true',GERMANY_MOTIS_DATA_REVIEWED:'true',
 GERMANY_MOTIS_BASE_URL:'https://routing.unit-provider.com/',GERMANY_MOTIS_API_TOKEN:'synthetic-test-token-not-real',GERMANY_MOTIS_ATTRIBUTION:'Synthetic fixture only; not real DELFI data'};
export const options={from,to,originCountry:'DE',destinationCountry:'DE',departureAt:at};
const stop=(p,id)=>({lat:p.latitude,lon:p.longitude,stopId:id,name:'Synthetic '+id,vertexType:'TRANSIT',pickupType:'NORMAL',dropoffType:'NORMAL'});
export function itinerary(mode='BUS',a=from,b=to){
 const startTime='2026-11-27T08:10:00Z',endTime='2026-11-27T08:30:00Z';
 return {duration:1200,startTime,endTime,transfers:0,id:'fixture',legs:[{mode,startTime,endTime,scheduledStartTime:startTime,scheduledEndTime:endTime,
  duration:1200,realTime:false,scheduled:true,from:stop(a,'a'),to:stop(b,'b'),intermediateStops:[stop({latitude:(a.latitude+b.latitude)/2,longitude:(a.longitude+b.longitude)/2},'mid')],
  legGeometry:{length:0,points:''},agencyName:'Synthetic operator',agencyUrl:'https://operator.example/',routeShortName:'TEST',cancelled:false,reservation:'NONE'}]};
}
export const payload=(items=[itinerary()])=>({from:stop(from,'a'),to:stop(to,'b'),direct:[],itineraries:items,previousPageCursor:'',nextPageCursor:''});
