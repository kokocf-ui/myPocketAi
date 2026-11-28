// Rankings for verified mixed-transport itineraries. Never invent prices or schedules.
const isWalk = mode => /^(?:walking|walk|foot|pedestrian)$/i.test(String(mode||''));
const time = v => {
  if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}[T ]/.test(v))return null;
  const n=Date.parse(v);
  return Number.isFinite(n)?n:null;
};
export function quotedTotalFare(journey){
  const j=journey&&typeof journey==='object'?journey:{};
  if(j.fareComplete===false||j.availability_disclosure?.fare_status==='partial')return null;
  const vehicleLegs=(Array.isArray(j.legs)?j.legs:[]).filter(l=>!isWalk(l?.mode));
  // For transfers, a single-leg fare is not proof of a complete ticket.
  if(vehicleLegs.length>1&&j.fareComplete!==true)return null;
  const f=j.fareLocal&&typeof j.fareLocal==='object'?j.fareLocal:
    j.fareGBP!==null&&j.fareGBP!==undefined?{amount:j.fareGBP,currency:'GBP'}:null;
  if(!f||f.amount===null||f.amount===undefined||f.amount==='')return null;
  const amount=Number(f.amount),currency=String(f.currency||'').toUpperCase();
  if(!Number.isFinite(amount)||amount<0||amount>100000||!/^[A-Z]{3}$/.test(currency))return null;
  return {amount,currency};
}
export function compareMixedTransportOptions(journeys){
  const options=Array.isArray(journeys)?journeys:[];
  if(!options.length)return {fastestIndex:null,cheapestIndex:null,priceStatus:'no_options',pricedCount:0};
  let fastestIndex=null,shortest=Infinity,earliest=Infinity;
  options.forEach((j,i)=>{
    const arrival=time(j?.arrivalDateTime||j?.legs?.at(-1)?.arrivalTime);
    const departure=time(j?.startDateTime||j?.legs?.[0]?.departureTime);
    if(arrival===null||departure===null||arrival<departure)return;
    const duration=arrival-departure;
    if(duration<shortest||(duration===shortest&&arrival<earliest)){
      shortest=duration;earliest=arrival;fastestIndex=i;
    }
  });
  const fares=options.map(quotedTotalFare);
  const pricedCount=fares.filter(Boolean).length;
  if(options.length<2)return {fastestIndex,cheapestIndex:null,priceStatus:'one_option',pricedCount};
  if(pricedCount!==options.length){
    // Partial quotes can still be compared *among the fully priced options*.
    // Never badge one as the absolute cheapest when other journeys have no
    // verifiable total. Do not convert foreign currencies heuristically.
    const available=fares.map((fare,index)=>fare?index:null).filter(index=>index!==null);
    const currencies=new Set(available.map(index=>fares[index].currency));
    if(available.length>=2&&currencies.size===1){
      let cheapestKnownIndex=available[0];
      for(const index of available.slice(1)){
        if(fares[index].amount<fares[cheapestKnownIndex].amount||
           fares[index].amount===fares[cheapestKnownIndex].amount&&index===fastestIndex)
          cheapestKnownIndex=index;
      }
      return {fastestIndex,cheapestIndex:null,priceStatus:'missing_or_incomplete',
        pricedCount,cheapestKnownIndex,cheapestKnownFare:fares[cheapestKnownIndex]};
    }
    return {fastestIndex,cheapestIndex:null,priceStatus:'missing_or_incomplete',pricedCount};
  }
  const currencies=new Set(fares.map(f=>f.currency));
  if(currencies.size!==1)return {fastestIndex,cheapestIndex:null,priceStatus:'different_currencies',pricedCount};
  let cheapestIndex=0;
  for(let i=1;i<fares.length;i++){
    if(fares[i].amount<fares[cheapestIndex].amount||
      fares[i].amount===fares[cheapestIndex].amount&&i===fastestIndex)cheapestIndex=i;
  }
  return {fastestIndex,cheapestIndex,priceStatus:'comparable',pricedCount,cheapestFare:fares[cheapestIndex]};
}

 // Serialize the verified pure functions into Eva's generated inline WebView script.
 // Imported Node-side functions are not visible inside the Android WebView unless injected.
export const MIXED_TRANSPORT_COMPARISON_SCRIPT=[
 'const isWalk='+isWalk.toString()+';',
 'const time='+time.toString()+';',
 quotedTotalFare.toString(),
 compareMixedTransportOptions.toString()
].join('\n');
