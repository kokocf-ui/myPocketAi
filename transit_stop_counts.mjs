// Counts mean stops after boarding, INCLUDING the alighting stop.
// Never infer counts from duration, distance, or non-contiguous GTFS sequence IDs.
export function transitStopCount(leg){
 if(!leg||/^(walking|walk|foot|pedestrian)$/i.test(String(leg.mode?.name||leg.mode||'')))return null;
 if(typeof leg.stopCount==='number'&&Number.isInteger(leg.stopCount)&&leg.stopCount>0&&leg.stopCount<=10000)return leg.stopCount;
 return null;
}
export function tflLegStopCount(raw){
 if(!raw||/^(walking|walk|foot|pedestrian)$/i.test(String(raw.mode?.name||'')))return null;
 const stops=raw.path?.stopPoints;
 const id=p=>String(p?.naptanId||p?.id||'');
 const from=id(raw.departurePoint),to=id(raw.arrivalPoint);
 if(!Array.isArray(stops)||!from||!to||from===to)return null;
 const start=stops.findIndex(p=>id(p)===from);
 const end=stops.findIndex((p,i)=>i>start&&id(p)===to);
 // A partial list without either endpoint cannot establish an exact count.
 return start>=0&&end>start?end-start:null;
}
