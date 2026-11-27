// Synthetic API response; not a captured or verified Belgian timetable.
export const now=Date.parse('2026-11-26T10:00:00Z'),at='2026-11-27T09:00:00Z';
export const from={latitude:50.835,longitude:4.336},middle={latitude:50.86,longitude:4.36},to={latitude:51.217,longitude:4.421};
export const station=(id,name,p)=>({id,name,standardname:name,locationY:String(p.latitude),locationX:String(p.longitude)});
export const stations=[station('BE.NMBS.008814001','Synthetic Start',from),station('BE.NMBS.008814002','Synthetic Middle',middle),station('BE.NMBS.008814003','Synthetic End',to)];
export const limiter=()=>({limit:async()=>({success:true})});
export const env=()=>({IRAIL_NATIONAL_ENABLED:'true',IRAIL_TERMS_REVIEWED:'true',IRAIL_USER_AGENT:'PocketAI-contract-tests/1.0 (https://example.com/tests)',IRAIL_RATE_LIMITER:limiter()});
export const options={from,to,originCountry:'BE',destinationCountry:'BE',departureAt:at};
export const call=(s,time,vehicle='BE.NMBS.IC123')=>({station:s.name,stationinfo:{...s},time:String(Date.parse(time)/1000),delay:'0',canceled:'0',walking:'0',vehicle,vehicleinfo:{shortname:vehicle},platform:'1',stops:{number:'0',stop:[]}});
export const connection=()=>({departure:call(stations[0],'2026-11-27T09:10:00Z'),arrival:call(stations[2],'2026-11-27T09:50:00Z'),vias:{number:'0',via:[]}});
export function transfer(){
 const c=connection();c.departure.stops={number:'0',stop:[]};
 c.vias={number:'1',via:[{arrival:call(stations[1],'2026-11-27T09:25:00Z'),departure:call(stations[1],'2026-11-27T09:30:00Z','BE.NMBS.IC456')}]};
 c.arrival.vehicle='BE.NMBS.IC456';return c;
}
