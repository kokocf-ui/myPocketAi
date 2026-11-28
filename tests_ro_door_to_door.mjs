import assert from 'node:assert/strict';
import worker from './backend.js';
import {mergeOrAppendBiloJourney,planRomanianNationalJourney,romanianJourneySummary} from './ro_national_transit.mjs';
import {rankRomanianJourneys,groupRomanianJourneys} from './ro_transport_mode_policy.mjs';
import {annotateTransportJourneys} from './transport_availability_disclosure.mjs';
import {parseBiloStopLabel,resolveRomanianIntercityStop,enrichRomanianDoorToDoorJourneys} from './ro_door_to_door.mjs';

// 1. Bilo duplicate removal across mode=all and mode=bus feeds
{
  const list=[];
  mergeOrAppendBiloJourney(list,{
    startDateTime:'2026-11-29T07:05:00.000Z',
    arrivalDateTime:'2026-11-29T10:30:00.000Z',
    durationMinutes:205,
    fareLocal:null,
    legs:[{
      mode:'bus',
      from:'Oradea · Autogara Intrans',
      to:'Cluj-Napoca · Autogara Fany',
      departureTime:'2026-11-29T07:05:00.000Z',
      arrivalTime:'2026-11-29T10:30:00.000Z',
      operator:'Petdor',
      lineNames:[]
    }]
  });
  // Exact duplicate from secondary bus feed with mode='coach', split locality, and fare
  mergeOrAppendBiloJourney(list,{
    startDateTime:'2026-11-29T07:05:00.000Z',
    arrivalDateTime:'2026-11-29T10:30:00.000Z',
    durationMinutes:205,
    fareLocal:{amount:55,currency:'RON'},
    legs:[{
      mode:'coach',
      from:'Autogara Intrans',
      fromLocality:'Oradea',
      to:'Autogara Fany',
      toLocality:'Cluj-Napoca',
      departureTime:'2026-11-29T07:05:00.000Z',
      arrivalTime:'2026-11-29T10:30:00.000Z',
      operator:'',
      lineNames:[]
    }]
  });
  // Distinct afternoon departure must remain separate
  mergeOrAppendBiloJourney(list,{
    startDateTime:'2026-11-29T12:00:00.000Z',
    arrivalDateTime:'2026-11-29T15:25:00.000Z',
    durationMinutes:205,
    fareLocal:{amount:60,currency:'RON'},
    legs:[{
      mode:'coach',
      from:'Oradea · Autogara Intrans',
      to:'Cluj-Napoca · Autogara Fany',
      departureTime:'2026-11-29T12:00:00.000Z',
      arrivalTime:'2026-11-29T15:25:00.000Z',
      operator:'Petdor',
      lineNames:[]
    }]
  });
  assert.equal(list.length,2,'Identical 09:05 -> 12:30 Petdor coach must not appear twice');
  assert.equal(list[0].legs[0].from,'Oradea · Autogara Intrans');
  assert.equal(list[0].legs[0].operator,'Petdor');
  assert.deepEqual(list[0].fareLocal,{amount:55,currency:'RON'});
}

// 2. Stop label parsing & safety guards
{
  const intrans=parseBiloStopLabel('Oradea · Autogara Intrans','','Oradea');
  assert.equal(intrans.city,'Oradea');
  assert.equal(intrans.stop,'Autogara Intrans');
  assert.deepEqual(intrans.distinctive,['intrans']);
  assert.equal(intrans.isBareCity,false);

  const bareCoach=await resolveRomanianIntercityStop({GEOAPIFY_API_KEY:'test'},{
    rawName:'Oradea',locality:'Oradea',mode:'coach',
    fetchImpl:async()=>{throw new Error('Should not geocode bare city for coach');}
  });
  assert.equal(bareCoach,null,'Bare city name on coach must never guess an autogara');
}

// 3. Tier 2 Exa street extraction -> Geoapify street verification when OSM lacks private autogara name
{
  const mockFetch=async input=>{
    const url=String(input);
    if(url==='https://api.exa.ai/search'){
      return Response.json({
        results:[{
          title:'Autogara Intrans Oradea - Program și Adresă',
          highlights:['Autogara Intrans Oradea se află pe Strada Războieni nr. 81, Oradea, Jud. Bihor.']
        }]
      });
    }
    const u=new URL(url);
    const text=u.searchParams.get('text')||'';
    if(u.pathname==='/v1/geocode/search'&&/R[aă]zboieni/i.test(text)){
      return Response.json({results:[{
        street:'Strada Războieni',housenumber:'81',city:'Oradea',country_code:'ro',
        lat:47.0518,lon:21.9562,result_type:'building',
        formatted:'Strada Războieni 81, 410164 Oradea, Romania'
      }]});
    }
    if(u.pathname==='/v1/geocode/search'&&u.searchParams.get('type')==='city'){
      return Response.json({results:[{name:'Oradea',city:'Oradea',country_code:'ro',lat:47.0465,lon:21.9189,result_type:'city'}]});
    }
    return Response.json({results:[],features:[]});
  };
  const resolved=await resolveRomanianIntercityStop({GEOAPIFY_API_KEY:'test',EXA_API_KEY:'test'},{
    rawName:'Oradea · Autogara CustomTest',locality:'Oradea',mode:'bus',fetchImpl:mockFetch
  });
  // Note: snippet says Autogara Intrans, not CustomTest -> must reject mismatched operator!
  assert.equal(resolved,null,'Must reject web snippet that does not mention the requested stop distinctive token');

  const resolvedIntrans=await resolveRomanianIntercityStop({GEOAPIFY_API_KEY:'test',EXA_API_KEY:'test'},{
    rawName:'Oradea · Autogara Intrans',locality:'Oradea',mode:'bus',fetchImpl:mockFetch
  });
  assert.ok(resolvedIntrans,'Verified street address from web evidence geocoded in Geoapify');
  assert.equal(resolvedIntrans.latitude,47.0518);
  assert.equal(resolvedIntrans.longitude,21.9562);
}

// 4. Full door-to-door composition: Strada Nufărului 1, Oradea -> Autogara Intrans -> Autogara Fany -> Piața Unirii 2, Cluj-Napoca
{
  const futureDep=new Date(Date.now()+4*3600000);
  futureDep.setUTCSeconds(0,0);
  const depIso=futureDep.toISOString();
  const arrIso=new Date(futureDep.getTime()+205*60000).toISOString();

  const originPoint={latitude:47.0365,longitude:21.9485,label:'Strada Nufărului 1, 410100 Oradea, Romania',city:'Oradea',country_code:'RO'};
  const destinationPoint={latitude:46.7698,longitude:23.5898,label:'Piața Unirii 2, Cluj-Napoca, Romania',city:'Cluj-Napoca',country_code:'RO'};

  const mockFetch=async input=>{
    const u=new URL(typeof input==='string'?input:input.url);
    if(u.pathname==='/v1/geocode/search'){
      const t=u.searchParams.get('text')||'';
      if(/Intrans/i.test(t)){
        return Response.json({results:[{
          name:'Autogara Intrans',city:'Oradea',country_code:'ro',
          categories:['public_transport.bus'],result_type:'amenity',
          lat:47.0518,lon:21.9562,formatted:'Autogara Intrans, Strada Războieni 81, Oradea, Romania'
        }]});
      }
      if(/Fany/i.test(t)){
        return Response.json({results:[{
          name:'Autogara Fany',city:'Cluj-Napoca',country_code:'ro',
          categories:['public_transport.bus'],result_type:'amenity',
          lat:46.7842,lon:23.5875,formatted:'Autogara Fany, Strada Giordano Bruno, Cluj-Napoca, Romania'
        }]});
      }
      return Response.json({results:[]});
    }
    if(u.pathname==='/v2/places')return Response.json({features:[]});
    if(u.pathname==='/v1/routing'){
      const wp=(u.searchParams.get('waypoints')||'').split('|').map(p=>p.split(',').map(Number));
      const [a,b]=wp;
      return Response.json({
        features:[{
          geometry:{type:'LineString',coordinates:[[a[1],a[0]],[(a[1]+b[1])/2,(a[0]+b[0])/2],[b[1],b[0]]]},
          properties:{
            distance:1850,time:1380,
            legs:[{steps:[
              {distance:900,instruction:{text:'Mergi spre nord.'}},
              {distance:950,instruction:{text:'Continuă până la destinație.'}}
            ]}]
          }
        }]
      });
    }
    return Response.json({});
  };

  // Mock urban local planner: Oradea tram for access, Cluj bus for egress
  const mockLocalPlanner=async(_env,from,to,_limit,opts={})=>{
    if(Math.abs(from.latitude-originPoint.latitude)<0.02){
      const startMs=Date.parse(depIso)-35*60000;
      return {
        status:'success',
        journeys:[{
          startDateTime:new Date(startMs).toISOString(),
          arrivalDateTime:new Date(startMs+22*60000).toISOString(),
          durationMinutes:22,
          legs:[
            {
              mode:'walking',from:originPoint.label,to:'Stația Nufărul',
              departurePoint:{lat:originPoint.latitude,lon:originPoint.longitude},
              arrivalLatLon:{lat:47.0372,lon:21.9478},
              departureTime:new Date(startMs).toISOString(),
              arrivalTime:new Date(startMs+4*60000).toISOString(),
              durationMinutes:4,distanceMeters:260,
              coordinates:[[originPoint.longitude,originPoint.latitude],[21.9478,47.0372]],
              geometryAvailable:true,steps:[{text:'Mergi pe Strada Nufărului până la Stația Nufărul.',distanceMeters:260}]
            },
            {
              mode:'tram',from:'Stația Nufărul',to:'Autogara Intrans',
              departurePoint:{lat:47.0372,lon:21.9478},
              arrivalLatLon:{lat:47.0516,lon:21.9560},
              departureTime:new Date(startMs+4*60000).toISOString(),
              arrivalTime:new Date(startMs+22*60000).toISOString(),
              durationMinutes:18,lineNames:['1R'],operator:'OTL Oradea'
            }
          ]
        }]
      };
    }
    if(Math.abs(to.latitude-destinationPoint.latitude)<0.02){
      const startMs=Date.parse(opts.departureAt||arrIso)+2*60000;
      return {
        status:'success',
        journeys:[{
          startDateTime:new Date(startMs).toISOString(),
          arrivalDateTime:new Date(startMs+14*60000).toISOString(),
          durationMinutes:14,
          legs:[
            {
              mode:'bus',from:'Autogara Fany',to:'Memorandumului Sud',
              departurePoint:{lat:46.7842,lon:23.5875},
              arrivalLatLon:{lat:46.7695,lon:23.5872},
              departureTime:new Date(startMs).toISOString(),
              arrivalTime:new Date(startMs+10*60000).toISOString(),
              durationMinutes:10,lineNames:['9'],operator:'CTP Cluj-Napoca'
            },
            {
              mode:'walking',from:'Memorandumului Sud',to:destinationPoint.label,
              departurePoint:{lat:46.7695,lon:23.5872},
              arrivalPoint:{lat:destinationPoint.latitude,lon:destinationPoint.longitude},
              arrivalLatLon:{lat:destinationPoint.latitude,lon:destinationPoint.longitude},
              departureTime:new Date(startMs+10*60000).toISOString(),
              arrivalTime:new Date(startMs+14*60000).toISOString(),
              durationMinutes:4,distanceMeters:240,
              coordinates:[[23.5872,46.7695],[destinationPoint.longitude,destinationPoint.latitude]],
              geometryAvailable:true,steps:[{text:'Mergi spre Piața Unirii 2.',distanceMeters:240}]
            }
          ]
        }]
      };
    }
    return {status:'no_local_journey_returned',journeys:[]};
  };

  const rawBilo=[{
    startDateTime:depIso,
    arrivalDateTime:arrIso,
    durationMinutes:205,
    time_zone:'Europe/Bucharest',
    scheduled:true,
    real_time:false,
    source:'Bilo: operator schedule',
    legs:[{
      mode:'bus',
      from:'Oradea · Autogara Intrans',
      to:'Cluj-Napoca · Autogara Fany',
      departureTime:depIso,
      arrivalTime:arrIso,
      operator:'Petdor',
      lineNames:[]
    }]
  }];

  const enriched=await enrichRomanianDoorToDoorJourneys(
    {GEOAPIFY_API_KEY:'test'},
    rawBilo,
    {
      originPoint,destinationPoint,
      originCity:'Oradea',destinationCity:'Cluj-Napoca',
      localPlanner:mockLocalPlanner,lang:'ro',fetchImpl:mockFetch
    }
  );
  assert.equal(enriched.length,1);
  const j=enriched[0];
  assert.equal(j.door_to_door_mapped,true);
  assert.equal(j.legs.length,5,'Expected Oradea walk + Oradea tram + Petdor coach + Cluj bus + Cluj final walk');
  assert.equal(j.legs[0].from,'Strada Nufărului 1, 410100 Oradea, Romania');
  assert.equal(j.legs[1].lineNames[0],'1R');
  assert.equal(j.legs[2].operator,'Petdor');
  assert.ok(j.legs[2].departurePoint?.lat&&j.legs[2].arrivalPoint?.lat,'Intercity leg has verified station coordinates');
  assert.equal(j.legs[3].lineNames[0],'9');
  assert.equal(j.legs[4].to,'Piața Unirii 2, Cluj-Napoca, Romania');
  assert.equal(j.boarding_stop.label,'Stația Nufărul','Boarding stop points to first vehicle stop');
  assert.equal(j.accessWalkVerified,true);

  // Fallback test when urban transit is unavailable: verified Geoapify walking legs at both ends
  const walkFallback=await enrichRomanianDoorToDoorJourneys(
    {GEOAPIFY_API_KEY:'test'},
    rawBilo,
    {
      originPoint,destinationPoint,
      originCity:'Oradea',destinationCity:'Cluj-Napoca',
      localPlanner:async()=>({status:'not_configured',journeys:[]}),
      lang:'ro',fetchImpl:mockFetch
    }
  );
  assert.equal(walkFallback[0].legs.length,3,'Expected origin walk + intercity coach + destination walk');
  assert.equal(walkFallback[0].legs[0].mode,'walking');
  assert.equal(walkFallback[0].legs[0].from,'Strada Nufărului 1, 410100 Oradea, Romania');
  assert.equal(walkFallback[0].legs[0].to,'Oradea · Autogara Intrans');
  assert.equal(walkFallback[0].legs[2].mode,'walking');
  assert.equal(walkFallback[0].legs[2].from,'Cluj-Napoca · Autogara Fany');
  assert.equal(walkFallback[0].legs[2].to,'Piața Unirii 2, Cluj-Napoca, Romania');
}

// 5. Real addRomanianWalkingAccess shape (walkToFirstStop property, distant stop >350m, near departure <75m)
//    + period-terminated Exa street address ("Str. Giordano Bruno nr. 1-3. Telefon...")
{
  const nearDepMs=Date.now()+65*60000;
  const nearDepIso=new Date(nearDepMs).toISOString();
  const nearArrIso=new Date(nearDepMs+205*60000).toISOString();
  const originPoint={latitude:47.0365,longitude:21.9485,label:'Strada Nufărului 1, 410100 Oradea, Romania',city:'Oradea',country_code:'RO'};
  const destinationPoint={latitude:46.7698,longitude:23.5898,label:'Piața Unirii 2, Cluj-Napoca, Romania',city:'Cluj-Napoca',country_code:'RO'};

  const mockExaPeriodFetch=async input=>{
    const url=typeof input==='string'?input:input.url;
    if(url==='https://api.exa.ai/search'){
      return Response.json({
        results:[{
          title:'Autogara FanyTest Cluj-Napoca',
          highlights:['Autogara FanyTest Cluj-Napoca — Adresa: Str. Giordano Bruno nr. 1-3. Rezervări telefonice zilnic.']
        }]
      });
    }
    const u=new URL(url);
    if(u.pathname==='/v1/geocode/search'){
      const t=u.searchParams.get('text')||'';
      if(/Giordano Bruno/i.test(t)){
        return Response.json({results:[{
          street:'Strada Giordano Bruno',housenumber:'1-3',city:'Cluj-Napoca',country_code:'ro',
          lat:46.7842,lon:23.5875,result_type:'building',
          formatted:'Strada Giordano Bruno 1-3, Cluj-Napoca, Romania'
        }]});
      }
      if(/IntransTest/i.test(t)){
        return Response.json({results:[{
          name:'Autogara IntransTest',city:'Oradea',country_code:'ro',
          categories:['public_transport.bus'],result_type:'amenity',
          lat:47.0518,lon:21.9562,formatted:'Autogara IntransTest, Oradea, Romania'
        }]});
      }
      if(u.searchParams.get('type')==='city'&&/Cluj/i.test(t)){
        return Response.json({results:[{name:'Cluj-Napoca',city:'Cluj-Napoca',country_code:'ro',lat:46.7712,lon:23.6236,result_type:'city'}]});
      }
      return Response.json({results:[]});
    }
    return Response.json({features:[]});
  };

  const queriedDepartures=[];
  const gtfsStyleLocalPlanner=async(_env,from,to,_limit,opts={})=>{
    queriedDepartures.push(Date.parse(opts.departureAt));
    assert.ok(Date.parse(opts.departureAt)>=Date.now()-120000,'Local planner departureAt must never be >2m in the past');
    if(Math.abs(from.latitude-originPoint.latitude)<0.02){
      // First stop is ~520m away (>350m), connected via walkToFirstStop (exact addRomanianWalkingAccess contract)
      const tramDep=nearDepMs-32*60000;
      const tramArr=nearDepMs-14*60000;
      return {
        status:'success',
        journeys:[{
          startDateTime:new Date(tramDep-6*60000).toISOString(),
          arrivalDateTime:new Date(tramArr+4*60000).toISOString(),
          durationMinutes:28,
          access:{stop_name:'Nufărul Centru',latitude:47.0408,longitude:21.9462},
          egress:{stop_name:'Piața București',latitude:47.0530,longitude:21.9540},
          walkToFirstStop:{
            verified:true,distanceMeters:520,durationMinutes:6,
            coordinates:[[originPoint.longitude,originPoint.latitude],[21.9462,47.0408]]
          },
          legs:[
            {
              mode:'tram',from:'Nufărul Centru',to:'Piața București',
              departurePoint:{lat:47.0408,lon:21.9462},
              arrivalLatLon:{lat:47.0530,lon:21.9540},
              departureTime:new Date(tramDep).toISOString(),
              arrivalTime:new Date(tramArr).toISOString(),
              durationMinutes:18,lineNames:['1R']
            },
            {
              mode:'walking',from:'Piața București',to:'Destinație',
              departurePoint:{lat:47.0530,lon:21.9540},
              arrivalLatLon:{lat:47.0518,lon:21.9562},
              departureTime:new Date(tramArr).toISOString(),
              arrivalTime:new Date(tramArr+4*60000).toISOString(),
              durationMinutes:4,distanceMeters:230,
              coordinates:[[21.9540,47.0530],[21.9562,47.0518]],geometryAvailable:true
            }
          ]
        }]
      };
    }
    // Cluj egress with walkToFirstStop from Autogara FanyTest to Piața Gării (~480m away)
    const busDep=Date.parse(nearArrIso)+12*60000;
    const busArr=busDep+11*60000;
    return {
      status:'success',
      journeys:[{
        startDateTime:new Date(busDep-6*60000).toISOString(),
        arrivalDateTime:new Date(busArr+4*60000).toISOString(),
        durationMinutes:21,
        access:{stop_name:'Piața Gării Sud',latitude:46.7835,longitude:23.5930},
        egress:{stop_name:'Sora',latitude:46.7710,longitude:23.5915},
        walkToFirstStop:{
          verified:true,distanceMeters:480,durationMinutes:6,
          coordinates:[[23.5875,46.7842],[23.5930,46.7835]]
        },
        legs:[
          {
            mode:'bus',from:'Piața Gării Sud',to:'Sora',
            departurePoint:{lat:46.7835,lon:23.5930},
            arrivalLatLon:{lat:46.7710,lon:23.5915},
            departureTime:new Date(busDep).toISOString(),
            arrivalTime:new Date(busArr).toISOString(),
            durationMinutes:11,lineNames:['9']
          },
          {
            mode:'walking',from:'Sora',to:'Destinație',
            departurePoint:{lat:46.7710,lon:23.5915},
            arrivalLatLon:{lat:destinationPoint.latitude,lon:destinationPoint.longitude},
            departureTime:new Date(busArr).toISOString(),
            arrivalTime:new Date(busArr+4*60000).toISOString(),
            durationMinutes:4,distanceMeters:210,
            coordinates:[[23.5915,46.7710],[destinationPoint.longitude,destinationPoint.latitude]],geometryAvailable:true
          }
        ]
      }]
    };
  };

  const out=await enrichRomanianDoorToDoorJourneys(
    {GEOAPIFY_API_KEY:'test',EXA_API_KEY:'test'},
    [{
      startDateTime:nearDepIso,arrivalDateTime:nearArrIso,durationMinutes:205,
      time_zone:'Europe/Bucharest',scheduled:true,real_time:false,
      legs:[{
        mode:'coach',from:'Oradea · Autogara IntransTest',to:'Cluj-Napoca · Autogara FanyTest',
        departureTime:nearDepIso,arrivalTime:nearArrIso,operator:'Petdor',lineNames:[]
      }]
    }],
    {originPoint,destinationPoint,originCity:'Oradea',destinationCity:'Cluj-Napoca',
     localPlanner:gtfsStyleLocalPlanner,lang:'ro',fetchImpl:mockExaPeriodFetch}
  );
  const full=out[0];
  assert.equal(full.door_to_door_mapped,true);
  assert.deepEqual(full.legs.map(l=>l.mode),['walking','tram','walking','coach','walking','bus','walking']);
  assert.equal(full.legs[0].from,'Strada Nufărului 1, 410100 Oradea, Romania');
  assert.equal(full.legs[0].to,'Nufărul Centru');
  assert.equal(full.legs[2].to,'Oradea · Autogara IntransTest');
  assert.equal(full.legs[4].from,'Cluj-Napoca · Autogara FanyTest');
  assert.equal(full.legs[4].to,'Piața Gării Sud');
  assert.equal(full.legs[6].to,'Piața Unirii 2, Cluj-Napoca, Romania');
  assert.equal(full.boarding_stop.label,'Nufărul Centru');
  assert.ok(full.legs.every(l=>Array.isArray(l.lineNames)),'every leg must expose iterable lineNames');

  const summary=romanianJourneySummary(out,'Oradea','Cluj-Napoca','ro');
  assert.match(summary,/Mers pe jos/);
  assert.match(summary,/Strada Nufărului 1/);
  assert.equal(rankRomanianJourneys(out).length,1);
  assert.equal(groupRomanianJourneys(out,4).mixed.length,1);
  assert.equal(annotateTransportJourneys(out,'ro')[0].availability_disclosure.timetable_status,'provider_timetable');

  // 7. Full /api/chat Worker request end-to-end (Bilo deduplication + door-to-door legs + summary)
  const origFetch=globalThis.fetch;
  try{
    const depTomorrow=new Date(Date.now()+26*3600*1000);
    const depTomorrowIso=depTomorrow.toISOString();
    const arrTomorrowIso=new Date(depTomorrow.getTime()+205*60000).toISOString();
    const travelDate=depTomorrowIso.slice(0,10);
    globalThis.fetch=async(input,init)=>{
      const url=typeof input==='string'?input:(input?.url||String(input));
      if(url.includes('mcp.bilo.ro/api/v1/search')){
        return Response.json({
          mode:'all',
          results:[{
            tripId:'petdor-0905',
            mode:'bus',
            operator:'Petdor',
            from:'Oradea · Autogara Intrans',
            to:'Cluj-Napoca · Autogara Fany',
            departureTime:depTomorrowIso,
            arrivalTime:arrTomorrowIso,
            price:{amount:75,currency:'RON'}
          }]
        });
      }
      if(url.includes('mcp.bilo.ro/api/v1/trip-details')){
        return Response.json({
          trip:{
            mode:'bus',
            legs:[{
              mode:'bus',
              operator:'Petdor',
              from:'Oradea · Autogara Intrans',
              to:'Cluj-Napoca · Autogara Fany',
              departureTime:depTomorrowIso,
              arrivalTime:arrTomorrowIso
            }]
          }
        });
      }
      if(url.includes('bilo.ro/search-api/v2/search')){
        // Duplicate coach record from secondary Bilo bus feed
        return Response.json({
          mode:'bus',
          results:[{
            mode:'coach',
            operator:'SC Petdor SRL',
            origin:'Autogara Intrans',
            originCity:'Oradea',
            destination:'Autogara Fany',
            destinationCity:'Cluj-Napoca',
            departureTime:depTomorrowIso,
            arrivalTime:arrTomorrowIso,
            date:travelDate
          }]
        });
      }
      if(url.includes('/v1/routing')){
        const u=new URL(url);
        const [a,b]=(u.searchParams.get('waypoints')||'').split('|').map(s=>s.split(',').map(Number));
        return Response.json({
          features:[{
            type:'Feature',
            geometry:{type:'LineString',coordinates:[[a[1],a[0]],[(a[1]+b[1])/2,(a[0]+b[0])/2],[b[1],b[0]]]},
            properties:{distance:1650,time:1240,legs:[{steps:[{distance:1650,instruction:{text:'Mergi spre autogară.'}}]}]}
          }]
        });
      }
      return mockExaPeriodFetch(input,init);
    };

    const res=await worker.fetch(new Request('https://example.test/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        message:'Deplasare de la Strada Nufărului 1, 410100 Oradea, Romania la Piața Unirii 2, Cluj-Napoca, Romania: variante disponibile (tren, autocar, transport public, zbor, combinat).',
        language:'ro',
        mixed_journey:true,
        transit_preference:'all',
        transit_departure_at:new Date(depTomorrow.getTime()-2*3600*1000).toISOString(),
        latitude:47.0398,
        longitude:21.9489,
        journey_origin:{
          label:'Strada Nufărului 1, 410100 Oradea, Romania',
          city:'Oradea',
          latitude:47.0398,
          longitude:21.9489,
          country_code:'RO'
        },
        transit_destination:{
          label:'Piața Unirii 2, Cluj-Napoca, Romania',
          city:'Cluj-Napoca',
          latitude:46.7698,
          longitude:23.5898,
          country_code:'RO'
        }
      })
    }),{
      BILO_API_KEY:'test-bilo-key',
      GEOAPIFY_API_KEY:'test-geo-key',
      EXA_API_KEY:'test-exa-key',
      AI:{run:async()=>({response:'mock'})}
    });
    assert.equal(res.status,200,'/api/chat must return HTTP 200 without throwing');
    const body=await res.json();
    assert.equal(body.status,'success');
    assert.equal(body.transit_available,true);
    assert.equal(body.route_geometry_available,true);
    assert.equal(body.transit.length,1,'duplicate Petdor connection must be merged into 1 option');
    assert.deepEqual(body.transit[0].legs.map(l=>l.mode),['walking','bus','walking']);
    assert.equal(body.transit[0].legs[0].from,'Strada Nufărului 1, 410100 Oradea, Romania');
    assert.equal(body.transit[0].legs.at(-1).to,'Piața Unirii 2, Cluj-Napoca, Romania');
    assert.match(body.reply,/Mers pe jos/);
  }finally{
    globalThis.fetch=origFetch;
  }
}

// 6. When Oracle GTFS returns feed_not_loaded (e.g. Oradea 503), OSM Overpass urban relation composes
//    walking -> tram -> coach -> walking so long urban transfers (>1.4 km) use real local transit instead of multi-km walks.
{
  const coachJourney={
    source:'Bilo (date transport România)',
    time_zone:'Europe/Bucharest',
    startDateTime:'2026-11-29T10:30:00+02:00',
    arrivalDateTime:'2026-11-29T13:50:00+02:00',
    durationMinutes:200,
    transferCount:0,
    legs:[{
      mode:'coach',
      lineNames:['Fany'],
      from:'Oradea · Gara Centrală',
      to:'Cluj-Napoca · Autogara Beta',
      fromSourceStopRef:{id:'oradea-gara',latitude:47.0697,longitude:21.9349},
      toSourceStopRef:{id:'cluj-beta',latitude:46.7848,longitude:23.5865},
      departureTime:'2026-11-29T10:30:00+02:00',
      arrivalTime:'2026-11-29T13:50:00+02:00',
      durationMinutes:200,
      operator:'Fany',
      stops:[]
    }]
  };
  const mockOsmFetch=async(url)=>{
    const u=String(url);
    if(u.includes('overpass.private.coffee')){
      return {
        ok:true,status:200,
        json:async()=>({
          elements:[
            {type:'node',id:101,lat:47.0368,lon:21.9475,tags:{name:'Nufărul'}},
            {type:'node',id:102,lat:47.0520,lon:21.9360,tags:{name:'Piața Unirii'}},
            {type:'node',id:103,lat:47.0695,lon:21.9348,tags:{name:'Gara Centrală'}},
            {
              type:'relation',id:9001,
              tags:{type:'route',route:'tram',ref:'3R',operator:'OTL'},
              members:[
                {type:'node',ref:101,role:'stop'},
                {type:'node',ref:102,role:'stop'},
                {type:'node',ref:103,role:'stop'}
              ]
            }
          ]
        })
      };
    }
    if(u.includes('api.geoapify.com/v1/routing')){
      const wp=new URL(u).searchParams.get('waypoints')||'';
      const [[lat1,lon1],[lat2,lon2]]=wp.split('|').map(p=>p.split(',').map(Number));
      return {
        ok:true,status:200,
        json:async()=>({
          features:[{
            geometry:{type:'LineString',coordinates:[[lon1,lat1],[(lon1+lon2)/2,(lat1+lat2)/2],[lon2,lat2]]},
            properties:{distance:320,time:240,legs:[{steps:[{instruction:{text:'Mergi spre stație'},distance:320}]}]}
          }]
        })
      };
    }
    return {ok:false,status:404,json:async()=>({})};
  };
  const enrichedOsm=await enrichRomanianDoorToDoorJourneys(
    {
      GEOAPIFY_API_KEY:'test-geo-key',
      RO_OSM_URBAN_FALLBACK:'true',
      RO_URBAN_API_TOKEN:'x'.repeat(40),
      RO_URBAN_VPC:{fetch:async()=>new Response(JSON.stringify({error:'feed_not_loaded'}),{status:503})}
    },
    [coachJourney],
    {
      originPoint:{latitude:47.0355,longitude:21.9488,label:'Strada Nufărului, Oradea',city:'Oradea',country_code:'RO'},
      destinationPoint:{latitude:46.7745,longitude:23.5898,label:'Piața Mihai Viteazul, Cluj-Napoca',city:'Cluj-Napoca',country_code:'RO'},
      originCity:'Oradea',destinationCity:'Cluj-Napoca',
      fetchImpl:mockOsmFetch
    }
  );
  assert.equal(enrichedOsm.length,1);
  assert.deepEqual(enrichedOsm[0].legs.map(l=>l.mode),['walking','tram','coach','walking'],
    'Oradea long urban transfer uses OTL Tram 3R instead of a 5+ km walk');
  assert.deepEqual(enrichedOsm[0].legs[1].lineNames,['3R']);
  assert.equal(enrichedOsm[0].legs[1].localScheduleEstimated,true);
  assert.notEqual(enrichedOsm[0].route_only,true,'Scheduled intercity journey must keep Navigare enabled');
}

console.log('PASS Romanian intercity door-to-door composition, Bilo deduplication, and verified station coordinates');
