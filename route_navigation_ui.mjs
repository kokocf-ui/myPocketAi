// Shared, GPS-only next-maneuver presentation. Preview directions stay static.
export function pocketRouteManeuver(route,projection,accuracy){
 if(!route||!projection||!Number.isFinite(accuracy)||accuracy<0||accuracy>35)return {status:'gps'};
 if(!Number.isFinite(projection.away)||projection.away>Math.max(50,accuracy*2))return {status:'offroute'};
 if(!(projection.totalMeters>0)||!Number.isFinite(projection.alongMeters))return {status:'gps'};
 const length=Number.isFinite(route.distanceMeters)&&route.distanceMeters>0?route.distanceMeters:projection.totalMeters;
 const travelled=Math.max(0,Math.min(length,projection.alongMeters/projection.totalMeters*length));
 const remaining=Math.max(0,length-travelled);
 if(remaining<=18&&accuracy<=15)return {status:'arrived',remaining,index:(route.steps||[]).length-1};
 const steps=Array.isArray(route.steps)?route.steps:[];
 let at=0;
 for(let i=0;i<steps.length;i++){
  const step=steps[i];
  if(i>0&&at>travelled+3&&typeof step?.text==='string'&&step.text.trim()){
   const following=steps.slice(i+1).find(v=>typeof v?.text==='string'&&v.text.trim());
   return {status:'turn',index:i,text:step.text,distance:at-travelled,remaining,following:following?{text:following.text}:null};
  }
  at+=Math.max(0,Number(step?.distanceMeters)||0);
 }
 return {status:'continue',remaining,index:Math.max(0,steps.length-1)};
}
export const ROUTE_NAVIGATION_STYLE=String.raw`
body:has(.route-unified-preview) .extra-fun-daily-banner{display:none!important}
.route-map-window.route-unified-preview{box-sizing:border-box;min-height:0;overflow:hidden!important}
.route-unified-preview:not(.navigating) .route-map-canvas{flex:0 0 clamp(110px,24dvh,220px)!important;height:clamp(110px,24dvh,220px)!important;min-height:0!important;max-height:28dvh!important}
.route-unified-preview:not(.navigating) .route-directions{display:block!important;flex:1 1 0!important;min-height:0!important;height:auto!important;max-height:none!important;overflow-y:auto!important;overflow-x:hidden!important;padding:8px 12px!important;overscroll-behavior:contain;overflow-wrap:anywhere}
.route-unified-preview .route-map-header{flex:none;padding:4px 6px!important;gap:4px}
.route-unified-preview .route-map-header h2{font-size:15px!important}
.route-unified-preview .route-map-header button{min-height:40px!important}
.route-unified-preview:not(.navigating)>.route-map-status{flex:none;font-size:12px!important;line-height:1.2!important;margin:3px 10px!important;height:auto;min-height:0;max-height:none}
.route-next-maneuver{display:none}
.route-unified-preview.navigating{top:0!important;bottom:0!important;left:0!important;right:0!important;height:100dvh!important;border:0!important;border-radius:0!important;padding:env(safe-area-inset-top,0px) 0 0!important;z-index:1200!important;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:auto auto minmax(0,1fr) auto;gap:0}
.route-unified-preview.navigating .route-map-canvas{position:relative!important;inset:auto!important;grid-column:1/-1;grid-row:3;width:100%!important;height:100%!important;min-height:0!important;max-height:none!important;margin:0!important;z-index:0;box-sizing:border-box}
.route-unified-preview.navigating .route-directions,.route-unified-preview.navigating>.route-map-status{display:none!important}
.route-unified-preview.navigating>.route-map-header{position:relative!important;top:auto!important;left:auto!important;right:auto!important;grid-column:1/-1;grid-row:1;z-index:1;background:#092535;border-radius:0!important;margin:0!important;min-width:0}
.route-unified-preview.navigating>.route-map-header h2{font-size:13px!important}
.route-unified-preview.navigating>.route-map-open{position:relative!important;top:auto!important;left:auto!important;right:auto!important;grid-row:2;grid-column:1;z-index:1;margin:3px 4px!important;min-height:36px!important;max-width:none!important;font-size:12px!important;padding:5px 8px!important;background:#092535}
.route-unified-preview.navigating>.route-recenter{grid-column:2}
.route-unified-preview.navigating .transit-fixed-controls{position:relative!important;top:auto!important;right:auto!important;grid-column:1/-1;grid-row:2;z-index:1;background:#092535;border-radius:0!important;max-width:none!important;padding:3px 6px;justify-content:flex-end;min-width:0}
.route-unified-preview.navigating .transit-fixed-controls button{min-height:36px!important;font-size:12px!important;padding:5px 8px!important}
.route-unified-preview.navigating .transit-fixed-controls button:first-child,.route-unified-preview.navigating .transit-fixed-controls button:nth-child(2){display:none!important}
.route-unified-preview.navigating .route-next-maneuver{display:grid;grid-template-rows:auto auto;position:relative!important;bottom:auto!important;left:auto!important;right:auto!important;grid-column:1/-1;grid-row:4;min-width:0;z-index:1;background:#082637;color:#fff;padding:4px 8px calc(4px + env(safe-area-inset-bottom,0px));font-size:14px;line-height:1.4;box-sizing:border-box;border-top:1px solid #6dc9d5;gap:2px}
.route-next-maneuver-text,.route-following-maneuver{display:block;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:3px 6px;box-sizing:border-box}
.route-next-maneuver-text{font-weight:750;color:#a3ffef;background:#154453;border-left:3px solid #50e4e1}
.route-following-maneuver{font-size:12px;color:#d3e3eb;border-left:3px solid transparent}
.route-directions [aria-current="step"]{background:#135b70;border-left:3px solid #50e4e1}
.route-directions .route-step-complete{opacity:.6}
.route-unified-preview.navigating .pocket-drive-next-turn{top:12px!important}
.route-unified-preview.navigating .pocket-driving-voice-toggle{top:12px!important}
`;
export function pocketAttachManeuver(current){
 const cue=document.createElement('div');cue.className='route-next-maneuver';cue.setAttribute('role','status');cue.setAttribute('aria-live','polite');
 const text=document.createElement('span');text.className='route-next-maneuver-text';
 const following=document.createElement('span');following.className='route-following-maneuver';following.textContent=dialogText('Aștept itinerariul…','Waiting for itinerary…');
 cue.append(text,following);current.followingManeuverText=following;current.layer.append(cue);
 current.maneuverText=text;current.maneuverCue=cue;
 text.textContent=dialogText('Aștept poziția GPS…','Waiting for GPS…');
 const host=current.mapHost||current.layer.querySelector('.route-map-canvas');
 if(host&&typeof ResizeObserver==='function'){current.mapSizeObserver=new ResizeObserver(()=>pocketSyncNavigationMap(current));current.mapSizeObserver.observe(host)}
}
export function pocketUpdateManeuver(current,route,projection,accuracy,rows=null){
 if(!current?.navigating||!current.maneuverText)return;
 const next=pocketRouteManeuver(route,projection,accuracy);
 let text=next.status==='gps'?dialogText('Semnal GPS insuficient pentru următoarea manevră.','Waiting for an accurate GPS fix.'):
  next.status==='offroute'?dialogText('Ești în afara traseului verificat. Revino la traseu.','You are off the verified route. Return to the route.'):
  next.status==='arrived'?dialogText('Ai ajuns la ','You have reached ')+String(route.destination?.label||route.label||dialogText('destinație','your destination')):
  next.status==='turn'?Math.max(0,Math.round(next.distance))+' m · '+next.text:
  Math.round(next.remaining)+' m · '+dialogText('Continuă pe traseul verificat.','Continue on the verified route.');
 const following=next.status==='turn'&&next.following?dialogText('Apoi: ','Then: ')+next.following.text:
  next.status==='gps'||next.status==='offroute'?dialogText('Următoarea manevră va apărea după confirmarea poziției.','Next maneuver needs a confirmed position.'):
  next.status==='arrived'?dialogText('Tronson încheiat.','Leg completed.'):
  dialogText('Nu mai sunt alte manevre în acest tronson.','No further maneuvers in this leg.');
 if(current.followingManeuverText&&current.followingManeuverText.textContent!==following){current.followingManeuverText.textContent=following;current.followingManeuverText.title=following}
 if(current.nativeUnavailable)text=dialogText('Doar pe ecran, fără serviciul Android. ','On-screen only, Android service unavailable. ')+text;
 clearTimeout(current.maneuverTimer);
 if(projection&&Number.isFinite(accuracy)&&accuracy<=35)current.maneuverTimer=setTimeout(()=>pocketUpdateManeuver(current,null,null,Infinity,rows),20000);
 if(current.maneuverText.textContent!==text){current.maneuverText.textContent=text;current.maneuverText.title=text;}
 if(rows){for(const [i,row] of [...rows].entries()){
  if(next.status==='turn'||next.status==='continue'||next.status==='arrived'){
   row.toggleAttribute('data-route-step-complete',i<next.index);row.classList.toggle('route-step-complete',i<next.index);
   if(i===next.index)row.setAttribute('aria-current','step');else row.removeAttribute('aria-current');
  }else row.removeAttribute('aria-current');
 }}
}
// Leaflet caches its viewport separately from DOM/CSS. Re-measure after the
// preview -> navigation layout and button changes have actually been painted.
export function pocketSyncNavigationMap(current){
 cancelAnimationFrame(current.mapSizeFrame);
 const refresh=()=>{
  if(!current.layer?.isConnected||!current.map)return;
  const host=current.mapHost||current.layer.querySelector('.route-map-canvas');
  if(!host||host.getBoundingClientRect().height<=0)return;
  current.map.invalidateSize({pan:false});
  if(current.navigating&&current.follow&&current.lastFix)current.map.setView(current.lastFix,current.map.getZoom?.()||17,{animate:false});
 };
 current.mapSizeFrame=requestAnimationFrame(()=>{refresh();current.mapSizeFrame=requestAnimationFrame(refresh)});
}
export const ROUTE_NAVIGATION_SCRIPT=[['pocketSyncNavigationMap',pocketSyncNavigationMap],['pocketRouteManeuver',pocketRouteManeuver],['pocketAttachManeuver',pocketAttachManeuver],['pocketUpdateManeuver',pocketUpdateManeuver]].map(([name,fn])=>'var '+name+'='+fn.toString()+';').join('\n');
