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
 const ids=p=>new Set([p?.naptanId,p?.id,p?.icsId].filter(v=>v!=null&&String(v).trim()).map(String));
 const from=ids(raw.departurePoint),to=ids(raw.arrivalPoint);
 if(!Array.isArray(stops)||!from.size||!to.size||[...from].some(v=>to.has(v)))return null;
 const matches=(p,expected)=>[...ids(p)].some(v=>expected.has(v));
 const starts=stops.map((p,i)=>matches(p,from)?i:-1).filter(i=>i>=0);
 // A repeated endpoint can be a loop; do not choose an arbitrary occurrence.
 if(starts.length!==1)return null;
 const start=starts[0];
 const ends=stops.map((p,i)=>i>start&&matches(p,to)?i:-1).filter(i=>i>=0);
 if(ends.length!==1)return null;
 const end=ends[0];
 // A partial list without either endpoint cannot establish an exact count.
 return start>=0&&end>start?end-start:null;
}
