// Corner-shop-only repair: clip a provider-verified walking route to the
// part that reaches the storefront's addressed street, rather than proceeding
// along an unrelated back street. Never fabricate an off-road connector.
// Geoapify indexes each step into the leg's actual route geometry.
const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/\b(rd)\b/g,'road').replace(/\b(st)\b/g,'street')
 .replace(/\b(ln)\b/g,'lane').replace(/\b(ave)\b/g,'avenue')
 .replace(/[^a-z0-9]+/g,' ').trim();
const streetSame=(a,b)=>{
 const x=fold(a),y=fold(b);
 return Boolean(x&&y&&(x===y||x.startsWith(y+' ')||y.startsWith(x+' ')));
};
const meters=(a,b)=>{
 if(!Array.isArray(a)||!Array.isArray(b)||a.length<2||b.length<2)return Infinity;
 const lat1=Number(a[1]),lon1=Number(a[0]),lat2=Number(b[1]),lon2=Number(b[0]);
 if(![lat1,lon1,lat2,lon2].every(Number.isFinite))return Infinity;
 const r=Math.PI/180,dlat=(lat2-lat1)*r,dlon=(lon2-lon1)*r;
 const h=Math.sin(dlat/2)**2+Math.cos(lat1*r)*Math.cos(lat2*r)*Math.sin(dlon/2)**2;
 return 12742017.6*Math.asin(Math.min(1,Math.sqrt(h)));
};
export function cornerShopFrontageRoute(route,address,target,lang='ro'){
 if(!route||route.profile!=='walk'||!address?.street||
    !Array.isArray(route.coordinates)||route.coordinates.length<3||
    !Array.isArray(route.steps)||route.via?.length)return null;
 const goal=[Number(target?.longitude),Number(target?.latitude)];
 if(!goal.every(Number.isFinite))return null;
 // Only street sections that actually occur within Geoapify's street-indexed
 // walking geometry qualify. A name in free text is NOT sufficient.
 const candidates=[];
 for(let stepIndex=0;stepIndex<route.steps.length;stepIndex++){
  const step=route.steps[stepIndex];
  if(!Array.isArray(step.streets)||!step.streets.some(s=>streetSame(s,address.street)))continue;
  const start=Number(step.fromIndex),end=Number(step.toIndex);
  if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<start||
     end>=route.coordinates.length)continue;
  for(let i=Math.max(1,start);i<=end;i++){
   const distance=meters(route.coordinates[i],goal);
   // A storefront entrance should be close to its signed road.
   if(distance<=90)candidates.push({stepIndex,index:i,distance});
  }
 }
 if(!candidates.length)return null;
 candidates.sort((a,b)=>a.distance-b.distance||b.index-a.index);
 const best=candidates[0];
 const geometry=route.coordinates.slice(0,best.index+1);
 if(geometry.length<2)return null;
 const distanceMeters=geometry.slice(1).reduce((acc,point,i)=>acc+meters(geometry[i],point),0);
 if(!Number.isFinite(distanceMeters)||distanceMeters<2||distanceMeters>5000)return null;
 const selected=route.steps.slice(0,best.stepIndex+1)
  .filter(step=>step.fromIndex==null||step.fromIndex<=best.index)
  .map(({fromIndex,toIndex,...step})=>step);
 if(!selected.length)return null;
 const last=geometry.at(-1);
 const note=lang==='en'
  ?'You have reached '+address.street+'. The shop entrance is estimated nearby; check the frontage.'
  :'Ai ajuns pe '+address.street+'. Intrarea magazinului este estimată în apropiere; verifică fațada.';
 const finalSteps=[...selected,{text:note,streets:[address.street],distanceMeters:null,
   number:selected.length+1}].map((step,i)=>({...step,number:i+1}));
 const ratio=distanceMeters/Math.max(1,Number(route.distanceMeters)||distanceMeters);
 return {...route,id:'verified_frontage',automatic:false,via:[],access_kind:'shop_street_frontage',
   label:lang==='en'?'Walking on '+address.street:'Pietonal pe '+address.street,
   coordinates:geometry,distanceMeters:Math.round(distanceMeters),
   durationSeconds:route.durationSeconds==null?null:Math.max(1,Math.round(route.durationSeconds*ratio)),
   destination:{...route.destination,latitude:last[1],longitude:last[0]},
   original_destination:target,
   frontage_distance_m:Math.round(best.distance),
   frontage_street:address.street,steps:finalSteps
 };
}
