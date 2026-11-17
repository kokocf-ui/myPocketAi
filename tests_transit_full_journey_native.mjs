import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('.',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const page=read('index.js');
const national=read('national_public_transport_ui.mjs');
const manifest=read('android/app/src/main/AndroidManifest.xml');
const native=read('android/app/src/main/java/ai/mypocket/mobile/PocketNavigationService.java');
const activity=read('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java');

const between=(start,end)=>{
 const a=page.indexOf(start),b=page.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,'Could not locate '+start);
 return page.slice(a,b);
};
const cards=between('function appendTransitCards(host,options){','function appendTransitOverview(host,text){');
assert.match(cards,/transit-choice-compact/,'Only short options before selection');
assert.match(cards,/state\.lastTransitResponse\?\.transit_destination_point/,'Use exact confirmed target');
assert.doesNotMatch(cards,/routeLine|bufferNotice|arrival-eta/,'No long transfer paragraphs in choice cards');
const selection=between('async function selectTransitJourney(options,index){','function appendSelectedTransit(host,route){');
assert.match(selection,/await openTransitJourneyMap\(selected\)/,'Open map on successful selection');
assert.doesNotMatch(selection,/state\.selectedTransitJourney=selected;renderTransitChoices\(options,index\)/,'No intermediary detail screen');
assert.match(selection,/renderTransitChoices\(options\);transitRefreshNotice\(message\)/,'Failure returns to choices with reason');
const map=between('async function openTransitJourneyMap(selected,resume=null){','async function selectTransitJourney(options,index){');
for(const str of ['transitCoordinate','transitStreetPath','loadRouteMapLibrary','transit-full-journey-map',
 'walkRoutes','📌','fitBounds','transit-full-journey-details']){
 assert.ok(map.includes(str),'Map needs '+str);
}
assert.match(map,/dashArray:/,'Unverified vehicle geometry is clearly schematic');
assert.match(map,/window\.PocketAndroidRouteGuidance\.postMessage/,'Opt-in native control from active map');
assert.ok(national.includes('The parent quick-layer header already provides Back.'));
assert.ok(!national.includes('actions.append(back);'));
assert.match(national,/const saved=choice\?\.transitDestination/,'Back keeps destination');
assert.match(national,/stationName=query\.split\(','\)\[0\]/,'Exact named railway station retry');
assert.match(manifest,/android:name="\.PocketNavigationService"/);
assert.match(manifest,/android:foregroundServiceType="location"/);
assert.match(manifest,/android\.permission\.FOREGROUND_SERVICE_LOCATION/);
assert.match(activity,/WebViewCompat\.addWebMessageListener\(web,"PocketAndroidRouteGuidance"/);
assert.match(activity,/Collections\.singleton\("https:\/\/"\+APP_HOST\)/,'Restricted to trusted origin');
assert.match(native,/startForeground\(NOTIFICATION_ID,notification\(\),ServiceInfo\.FOREGROUND_SERVICE_TYPE_LOCATION\)/);
assert.match(native,/locations\.requestLocationUpdates/);
assert.match(native,/remaining<=\(navigationMode\.equals\("drive"\)\?1300:500\)/,'Early warning for walking and driving');
assert.match(native,/remaining<=\(navigationMode\.equals\("drive"\)\?70:20\)&&fix\.getAccuracy\(\)<=15/,'GPS-accurate near turn warnings for both modes');
assert.match(native,/ACTION_STOP/,'Explicit stop');
console.log('PASS: compact transit choices, direct map, separate transfer paths, native background navigation');
