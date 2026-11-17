import {mixedPoint,evaluateMixedJourneyGeography,isPlausibleMixedLegSpeed} from './mixed_route_quality.mjs';
// Date-aware, provider-neutral multimodal routing over VERIFIED transport legs.
// There are no preset cities, airports or countries here. Suppliers discover
// connections independently; this engine only joins actually returned services.
// A flight is not an arrival at the passenger's destination unless verified
// onward legs (including the final transfer) also reach that destination.
const MODE_ALIASES=Object.freeze({
  bus:'bus',coach:'coach',autocar:'coach',train:'train',rail:'train',
  subway:'metro',underground:'metro',metro:'metro',tram:'tram',
  ferry:'ferry',flight:'flight',plane:'flight',airplane:'flight',
  walking:'walking',walk:'walking',foot:'walking'
});
const isWalk=m=>m==='walking';
const validId=x=>typeof x==='string'&&x.length>0&&x.length<=140&&!/[\u0000-\u001f]/.test(x);
const instant=value=>{
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value))return null;
  const time=Date.parse(value);
  return Number.isFinite(time)?time:null;
};
const fareValue=value=>{
  if(!value||typeof value!=='object')return null;
  if(typeof value.amount!=='number'||!Number.isFinite(value.amount)||value.amount<0||value.amount>100000)return null;
  if(!/^[A-Z]{3}$/.test(String(value.currency||'')))return null;
  return {amount:value.amount,currency:value.currency};
};
const normalizedMode=value=>MODE_ALIASES[String(value||'').toLowerCase()]||null;
const safeText=(v,len=120)=>String(v||'').trim().slice(0,len);

/** Validate one sourced schedule leg; reject guesses, missing times and cancellations. */
export function normalizeVerifiedMixedLeg(raw){
  if(!raw||typeof raw!=='object'||raw.verified!==true||raw.cancelled===true)return null;
  const mode=normalizedMode(raw.mode),from=raw.from,to=raw.to;
  const departure=instant(raw.departureTime),arrival=instant(raw.arrivalTime);
  if(!mode||!validId(from?.id)||!validId(to?.id)||from.id===to.id||
     departure===null||arrival===null||arrival<=departure)return null;
  const provider=safeText(raw.provider,100);
  if(!provider||!safeText(from.label)||!safeText(to.label))return null;
  const fee=fareValue(raw.fareLocal);
  // Never treat an indicative or partial fare as a confirmed final ticket price.
  const fareLocal=raw.fareVerified===true?fee:null;
  return {
    id:safeText(raw.id,140)||[provider,mode,from.id,to.id,departure,arrival].join(':'),
    mode,provider,from:{id:from.id,label:safeText(from.label,160),...(mixedPoint(from)||{})},
    to:{id:to.id,label:safeText(to.label,160),...(mixedPoint(to)||{})},
    departureTime:new Date(departure).toISOString(),
    arrivalTime:new Date(arrival).toISOString(),
    departureMs:departure,arrivalMs:arrival,
    operator:safeText(raw.operator),lineNames:Array.isArray(raw.lineNames)?raw.lineNames.slice(0,3).map(v=>safeText(v,70)):[],
    fareLocal, fareVerified:Boolean(fareLocal),
    bookingUrl:typeof raw.bookingUrl==='string'&&/^https:\/\/[^\s@]+$/i.test(raw.bookingUrl)?raw.bookingUrl:null,
    verificationSource:safeText(raw.verificationSource,160),
    departureZone:safeText(raw.departureZone,65),
    arrivalZone:safeText(raw.arrivalZone,65),
    // Operator-declared same-ticket connections may provide their own transfer
    // validation; no such shortcut is inferred from matching airline names.
    protectedConnection:raw.protectedConnection===true
  };
}

/**
 * Conservative minimum interchange time. A change of mode or station cannot
 * occur instantaneously. Crucially, flight security and inbound airport exit
 * time are counted against the actual scheduled onward departure.
 */
export function minimumMixedTransferMinutes(previous,next){
  if(!previous)return next?.mode==='flight'?90:0;
  if(previous.mode==='flight')return next.mode==='flight'?90:next.mode==='walking'?20:45;
  if(next.mode==='flight')return 105;
  if(previous.mode==='walking')return next.mode==='walking'?0:5;
  if(next.mode==='walking')return 0;
  return previous.mode===next.mode?8:12;
}
function asVisibleJourney(path,searchStart,geography){
  const first=path[0],last=path.at(-1);
  const legs=path.map(l=>({
    mode:l.mode,from:l.from.label,to:l.to.label,provider:l.provider,
    departureTime:l.departureTime,arrivalTime:l.arrivalTime,
    durationMinutes:(l.arrivalMs-l.departureMs)/60000,
    operator:l.operator,lineNames:l.lineNames,
    verified:true,departureZone:l.departureZone,arrivalZone:l.arrivalZone,
    fareLocal:l.fareLocal,bookingUrl:l.bookingUrl,verificationSource:l.verificationSource
  }));
  const modes=path.filter(l=>!isWalk(l.mode)).map(l=>l.mode);
  const currencySet=new Set(path.filter(l=>!isWalk(l.mode)).map(l=>l.fareLocal?.currency).filter(Boolean));
  const priced=path.filter(l=>!isWalk(l.mode));
  const fareComplete=priced.length>0&&priced.every(l=>l.fareVerified)&&currencySet.size===1;
  const amount=fareComplete?priced.reduce((sum,l)=>sum+l.fareLocal.amount,0):null;
  return {
    provider:[...new Set(path.map(l=>l.provider))].join(' + '),
    verified:true, startDateTime:first.departureTime, arrivalDateTime:last.arrivalTime,
    durationMinutes:(last.arrivalMs-searchStart)/60000,
    journeyMinutes:(last.arrivalMs-first.departureMs)/60000,
    elapsedFromRequestMinutes:(last.arrivalMs-searchStart)/60000,
    legs,transferCount:Math.max(0,modes.length-1),
    modes:[...new Set(modes)],modeSignature:modes.join(' → '),
    fareComplete,fareLocal:fareComplete?{amount:Math.round(amount*100)/100,currency:[...currencySet][0]}:null,
    bookingRequirement:priced.length>1?'check_each_leg':'check_provider',
    arrivalVerified:true,departureFeasible:true,finalTransferVerified:true,geography
  };
}
/**
 * Build genuine A-to-B itineraries from independently verified, dated legs.
 * Origin and destination IDs come from geocoding/provider stop identity.
 * No radius-based "teleport" between airports/stations is permitted:
 * different IDs require an explicit verified walk/bus/rail transfer leg.
 * @param {Object} options {origin:{id},destination:{id},departureAt,legs,...}
 */
export function composeVerifiedMixedItineraries(options={}){
  const originId=options.origin?.id,destinationId=options.destination?.id;
  const searchStart=instant(options.departureAt);
  if(!validId(originId)||!validId(destinationId)||originId===destinationId||searchStart===null)
    return {status:'invalid_request',journeys:[],providers:[]};
  const maxResults=Math.max(1,Math.min(12,Number.isInteger(options.maxResults)?options.maxResults:8));
  const maxLegs=Math.max(1,Math.min(10,Number.isInteger(options.maxLegs)?options.maxLegs:8));
  const horizon=Math.max(6,Math.min(168,Number(options.horizonHours)||72))*3600000;
  const modesAllowed=new Set((Array.isArray(options.modes)&&options.modes.length?
    options.modes:['train','coach','bus','flight','ferry','walking','metro','tram'])
    .map(normalizedMode).filter(Boolean));
  // Never allow all-walking routes to masquerade as public transport options.
  modesAllowed.add('walking');
  const incoming=Array.isArray(options.legs)?options.legs.slice(0,5000):[];
  const verified=incoming.map(normalizeVerifiedMixedLeg).filter(Boolean)
    .filter(l=>modesAllowed.has(l.mode)&&l.arrivalMs<=searchStart+horizon&&
      l.departureMs>=searchStart&&isPlausibleMixedLegSpeed(l));
  const nextByNode=new Map(),arrivingAt=new Map();
  for(const leg of verified){
    if(!nextByNode.has(leg.from.id))nextByNode.set(leg.from.id,[]);
    nextByNode.get(leg.from.id).push(leg);
    if(!arrivingAt.has(leg.to.id))arrivingAt.set(leg.to.id,new Set());
    arrivingAt.get(leg.to.id).add(leg.from.id);
  }
  // Route search must not waste its finite exploration budget on terminals
  // which cannot reach the actual destination on any verified segment.
  const canReach=new Set([destinationId]),backward=[destinationId];
  while(backward.length){
    const to=backward.pop();
    for(const from of arrivingAt.get(to)||[]){
      if(!canReach.has(from)){canReach.add(from);backward.push(from)}
    }
  }
  if(!canReach.has(originId))return {status:'no_complete_verified_itinerary',
    journeys:[],providers:[...new Set(verified.map(l=>l.provider))],
    checkedLegs:verified.length,incompleteLegsIgnored:incoming.length-verified.length,
    searchCapped:false};
  for(const group of nextByNode.values())group.sort((a,b)=>a.arrivalMs-b.arrivalMs||a.departureMs-b.departureMs);

  // Earliest-arrival first. A depth-first cap can accidentally return 2,000
  // slower bus branches before visiting the best flight/train option.
  const heap=[];
  const push=state=>{
    heap.push(state);
    let i=heap.length-1;
    while(i>0){
      const p=Math.floor((i-1)/2);
      if(heap[p].at<=heap[i].at)break;
      [heap[p],heap[i]]=[heap[i],heap[p]];i=p;
    }
  };
  const pop=()=>{
    const first=heap[0],last=heap.pop();
    if(heap.length){
      heap[0]=last;let i=0;
      while(true){
        const a=i*2+1,b=a+1;
        let smallest=i;
        if(a<heap.length&&heap[a].at<heap[smallest].at)smallest=a;
        if(b<heap.length&&heap[b].at<heap[smallest].at)smallest=b;
        if(smallest===i)break;
        [heap[i],heap[smallest]]=[heap[smallest],heap[i]];i=smallest;
      }
    }
    return first;
  };
  const paths=[],rejectedGeographic={count:0},visitedPathSignatures=new Set();
  push({node:originId,at:searchStart,path:[],visited:new Set([originId]),flightReleaseMs:null});
  let examined=0;
  while(heap.length&&examined<40000&&paths.length<2000){
    const state=pop();examined++;
    if(state.node===destinationId){
      if(!state.path.some(l=>!isWalk(l.mode)))continue;
      const geography=evaluateMixedJourneyGeography(state.path,{origin:options.origin,destination:options.destination});
      if(geography.status==='excessive_geographic_detour'||
         geography.status==='conflicting_stop_locations'){
        rejectedGeographic.count++;continue;
      }
      const signature=state.path.map(l=>l.id).join('|');
      if(!visitedPathSignatures.has(signature)){
        visitedPathSignatures.add(signature);
        paths.push({path:state.path,geography});
      }
      continue;
    }
    if(state.path.length>=maxLegs)continue;
    for(const leg of nextByNode.get(state.node)||[]){
      if(!canReach.has(leg.to.id)||state.visited.has(leg.to.id))continue;
      const previous=state.path.at(-1);
      const min=minimumMixedTransferMinutes(previous,leg);
      if(leg.departureMs<state.at+min*60000)continue;
      // Flight arrivals need passport control, baggage and exit time; a
      // connecting walk must not reset this buffer and enable a fake coach.
      if(state.flightReleaseMs!==null&&!isWalk(leg.mode)&&
         leg.departureMs<state.flightReleaseMs)continue;
      const flightReleaseMs=leg.mode==='flight'?leg.arrivalMs+45*60000:
        isWalk(leg.mode)?state.flightReleaseMs:null;
      push({node:leg.to.id,at:leg.arrivalMs,
        path:[...state.path,leg],visited:new Set([...state.visited,leg.to.id]),
        flightReleaseMs});
    }
  }
  const candidates=paths.map(({path,geography})=>asVisibleJourney(path,searchStart,geography))
    .sort((a,b)=>a.elapsedFromRequestMinutes-b.elapsedFromRequestMinutes||
      a.transferCount-b.transferCount||a.journeyMinutes-b.journeyMinutes);
  const distinct=[],signatures=new Set(),modesSeen=new Set();
  for(const j of candidates){
    const key=j.legs.map(l=>l.provider+':'+l.mode+':'+l.from+':'+l.to+':'+l.departureTime).join('|');
    if(signatures.has(key))continue;signatures.add(key);distinct.push(j);
  }
  // Surface multiple vehicle combinations, not a wall of near-identical
  // departures from the same corridor. Final display is re-sorted by arrival.
  const chosen=[],picked=new Set();
  for(const j of distinct){
    if(modesSeen.has(j.modeSignature))continue;
    chosen.push(j);picked.add(j);modesSeen.add(j.modeSignature);
    if(chosen.length>=maxResults)break;
  }
  for(const j of distinct){
    if(chosen.length>=maxResults)break;
    if(!picked.has(j))chosen.push(j);
  }
  chosen.sort((a,b)=>a.elapsedFromRequestMinutes-b.elapsedFromRequestMinutes||
    a.transferCount-b.transferCount||a.journeyMinutes-b.journeyMinutes);
  return {status:chosen.length?'verified':'no_complete_verified_itinerary',
    journeys:chosen,
    providers:[...new Set(verified.map(l=>l.provider))],
    checkedLegs:verified.length,
    incompleteLegsIgnored:incoming.length-verified.length,
    rejectedGeographicDetours:rejectedGeographic.count,
    searchCapped:examined>=40000||paths.length>=2000
  };
}
