/* Android foreground navigation follows the EXISTING Eva Start/Stop tracking.
 * Merely showing a route or a timetable NEVER starts location tracking.
 * Closing/minimising the UI does not end an already started journey.
 */
(function(){
 if(window.__pocketNavigationBridgeInstalled)return;
 window.__pocketNavigationBridgeInstalled=true;
 const KEY='pocket_navigation_session_v1';
 let activeId=null, installing=false, preserveOnMapDismiss=false;
 const safeState=()=>{try{return typeof state==='object'?state:null}catch{return null}};
 const saved=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}};
 const store=value=>{try{
  if(value)localStorage.setItem(KEY,JSON.stringify(value));
  else localStorage.removeItem(KEY);
  return true;
 }catch{return false}};
 const native=payload=>{try{
  if(!window.PocketAndroidNavigation?.postMessage)return false;
  window.PocketAndroidNavigation.postMessage(JSON.stringify(payload));return true;
 }catch{return false}};
 const isCurrentMap=()=>{try{return typeof activeRouteMap!=='undefined'?activeRouteMap:null}catch{return null}};
 const canRestore=route=>{try{
  return typeof validMapRoute==='function'&&validMapRoute(route);
 }catch{return false}};
 const routeId=()=>window.crypto?.randomUUID?.().replace(/-/g,'')||
  ('nav'+Date.now().toString(36)+Math.random().toString(36).slice(2));
 const profile=route=>{
  const mode=String(route?.profile||'').toLowerCase();
  return mode==='walk'?'walking':mode==='drive'?'driving':'mixed';
 };
 const description=route=>{
  const steps=Array.isArray(route?.steps)?route.steps.slice(0,24):[];
  let body=steps.map((step,i)=>(i+1)+'. '+String(step?.text||'')+
   (Number.isFinite(Number(step?.distanceMeters))&&step.distanceMeters>0?
    ' · '+Math.round(step.distanceMeters)+' m':'')).join('\n');
  const transit=safeState()?.selectedTransitJourney?.journey;
  if(!body&&Array.isArray(transit?.legs))body=transit.legs.slice(0,20).map((l,i)=>
   (i+1)+'. '+String(l.mode||'')+' · '+String(l.from||'')+' → '+String(l.to||'')).join('\n');
  return body.slice(0,2700);
 };
 const destination=route=>String(route?.destination?.label||route?.destination?.name||
  route?.destinationLabel||safeState()?.selectedTransitJourney?.journey?.legs?.at(-1)?.to||
  'Destinație').slice(0,120);
 const sameRoute=(a,b)=>{
  if(a===b)return true;
  if(!a||!b)return false;
  const end=r=>r?.destination;
  const loc=end(a),next=end(b);
  return loc&&next&&Math.abs(Number(loc.latitude)-Number(next.latitude))<0.00001&&
   Math.abs(Number(loc.longitude)-Number(next.longitude))<0.00001&&
   String(a.profile||'')===String(b.profile||'');
 };
 function notifyNavigationStart(current){
  if(!current?.navigating||!canRestore(current.route))return false;
  const previous=saved();
  if(activeId&&previous?.id===activeId&&sameRoute(previous.route,current.route))return true;
  const id=routeId().slice(0,64);
  const record={id,destination:destination(current.route),mode:profile(current.route),
   steps:description(current.route),route:current.route,createdAt:Date.now()};
  let json;
  try{json=JSON.stringify(record)}catch{return false}
  // Preserve the route geometry, not a screenshot or an entire app session.
  if(json.length>900000||!store(record))return false;
  if(!native({action:'start',sessionId:id,destination:record.destination,
   mode:record.mode,steps:record.steps})){store(null);return false}
  return true;
 }
 function notifyNavigationStop(){
  if(!activeId&&!saved())return;
  native({action:'stop'});activeId=null;store(null);
 }
 // Bind to the EXISTING user-initiated navigation control, without any new button.
 function installHooks(){
  if(installing)return;
  const start=window.startRouteTracking,stop=window.stopRouteTracking,
   close=window.closeRouteMap;
  if(typeof start!=='function'||typeof stop!=='function'||typeof close!=='function')return;
  if(start.__pocketNotificationHooked)return;
  installing=true;
  const wrappedStart=function(current){
   const result=start.apply(this,arguments);
   if(current?.navigating)notifyNavigationStart(current);
   return result;
  };
  wrappedStart.__pocketNotificationHooked=true;
  window.startRouteTracking=wrappedStart;
  window.stopRouteTracking=function(current){
   const wasActive=Boolean(current?.navigating);
   const result=stop.apply(this,arguments);
   // A GPS permission failure or explicit Stop ends the notification.
   // Closing the map/window is only visual and does NOT stop navigation.
   if(wasActive&&!preserveOnMapDismiss)notifyNavigationStop();
   return result;
  };
  window.closeRouteMap=function(){
   preserveOnMapDismiss=true;
   try{return close.apply(this,arguments)}
   finally{preserveOnMapDismiss=false}
  };
  installing=false;
 }
 window.pocketNativeNavigationAck=(ok,id)=>{
  if(ok&&saved()?.id===id){activeId=id;return}
  if(saved()?.id===id){activeId=null;store(null)}
 };
 window.pocketNativeNavigationStopped=()=>{
  activeId=null;store(null);
 };
 window.pocketNativeNavigationResume=id=>{
  const record=saved();
  if(!record||record.id!==id||!canRestore(record.route))return false;
  activeId=id;installHooks();
  const open=isCurrentMap();
  if(open?.navigating&&sameRoute(open.route,record.route))return true;
  // Notification tap directly opens the current map with navigation running.
  try{
   const s=safeState();
   if(s?.currentModule!=='maps'&&typeof switchConversationModule==='function')
    switchConversationModule('maps');
   if(typeof openRouteMap!=='function')return false;
   Promise.resolve(openRouteMap(record.route,null,[record.route],true)).catch(()=>{
    // The native service remains active; no route is silently fabricated.
   });
   return true;
  }catch{return false}
 };
 // New frontend pages may boot after onPageFinished; install once available.
 installHooks();
 if(!window.startRouteTracking?.__pocketNotificationHooked){
  let attempts=0;
  const retry=()=>{installHooks();if(!window.startRouteTracking?.__pocketNotificationHooked&&++attempts<24)
   setTimeout(retry,350)};
  setTimeout(retry,350);
 }
})();
