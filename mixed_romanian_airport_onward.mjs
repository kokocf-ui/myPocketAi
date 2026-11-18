// Authorized Romanian intercity continuation after a verified arrival airport.
// A Bilo city-to-city journey is only a PART of a flight's last mile:
// the airport->boarding station and arrival station->exact address remain gaps.
// No fixed airports, routes, station names or timetable guesses.
import {planRomanianNationalJourney,reverseRomanianOriginCity,bucharestTravelDate}
 from './ro_national_transit.mjs';
import {filterRomanianCityEndpoints} from './ro_transport_mode_policy.mjs';

const point=v=>v&&v.latitude!=null&&v.longitude!=null&&
 Number.isFinite(Number(v.latitude))&&Number.isFinite(Number(v.longitude))&&
 Math.abs(Number(v.latitude))<=90&&Math.abs(Number(v.longitude))<=180;
const timed=v=>typeof v==='string'&&Number.isFinite(Date.parse(v))?Date.parse(v):null;
export async function searchRomanianAirportOnward(env,{
 airport,destination,after,findCity=reverseRomanianOriginCity,
 planner=planRomanianNationalJourney
}={}){
 if(!point(airport)||!point(destination)||!timed(after)||
    String(airport.country_code||'').toUpperCase()!=='RO'||
    String(destination.country_code||'').toUpperCase()!=='RO')
  return {status:'outside_romanian_intercity_scope',journey:null};
 if(!env?.BILO_API_KEY)return {status:'bilo_not_connected',journey:null};
 const [fromCity,toCity]=await Promise.all([
  findCity(env,airport),findCity(env,destination)
 ]);
 if(!fromCity||!toCity)return {status:'airport_or_destination_city_unverified',journey:null};
 if(fromCity.toLocaleLowerCase('ro')===toCity.toLocaleLowerCase('ro'))
  return {status:'same_city_urban_transfer_needed',journey:null,fromCity,toCity};
 const start=timed(after),day=bucharestTravelDate(after);
 const days=[day,new Date(Date.parse(day+'T12:00:00Z')+86400000).toISOString().slice(0,10)];
 const reasons=[];
 for(const date of days){
  const result=await planner(env,{origin:fromCity,destination:toCity},{
   date,limit:8
  });
  if(result?.status!=='ok'){reasons.push(result?.status||'provider_unavailable');continue;}
  const valid=filterRomanianCityEndpoints(result.journeys,fromCity,toCity)
   .filter(j=>(timed(j.startDateTime)??-Infinity)>=start&&
    timed(j.arrivalDateTime)>timed(j.startDateTime))
   .sort((a,b)=>timed(a.arrivalDateTime)-timed(b.arrivalDateTime));
  const journey=valid[0];
  if(journey)return {
   status:'intercity_part_only',fromCity,toCity,journey,
   airportTransferVerified:false,lastMileVerified:false,
   source:'Bilo',cityEndPointsVerified:true
  };
  reasons.push('no_departure_after_landing');
 }
 return {status:reasons[0]||'no_regional_schedule',fromCity,toCity,journey:null};
}
