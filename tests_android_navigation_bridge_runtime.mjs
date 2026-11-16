import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const messages=[],cache=new Map(),route={profile:'walk',
 destination:{label:'London Rd/A126',latitude:51.5,longitude:0.28},
 steps:[{text:'Go straight',distanceMeters:240}],coordinates:[[0.28,51.49],[0.28,51.5]]};
let current={route,navigating:false},opened=0;
const state={currentModule:'maps'};
const window={
 crypto:{randomUUID:()=> 'a1234567-1234-1234-1234-abcdef123456'},
 PocketAndroidNavigation:{postMessage:s=>messages.push(JSON.parse(s))},
 startRouteTracking(c){c.navigating=true;},
 stopRouteTracking(c){c.navigating=false;},
 closeRouteMap(){window.stopRouteTracking(current);}
};
const localStorage={getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v),
 removeItem:k=>cache.delete(k)};
const ctx={window,state,activeRouteMap:current,localStorage,
 validMapRoute:r=>Array.isArray(r?.coordinates)&&r.coordinates.length>=2,
 switchConversationModule:kind=>state.currentModule=kind,
 openRouteMap:async route=>{
   opened++;current={route,navigating:false};ctx.activeRouteMap=current;
   window.startRouteTracking(current);
 },setTimeout(){throw Error('Unexpected delayed hook')},console};
vm.runInNewContext(readFileSync('android/app/src/main/assets/navigation-background.js','utf8'),ctx);
assert.ok(window.startRouteTracking.__pocketNotificationHooked);
assert.equal(messages.length,0,'Preview must not start GPS foreground service');
window.startRouteTracking(current);
assert.equal(messages.length,1);
assert.equal(messages[0].action,'start');
assert.equal(messages[0].destination,'London Rd/A126');
const id=messages[0].sessionId;
window.pocketNativeNavigationAck(true,id);
window.closeRouteMap();
assert.equal(messages.length,1,'Closing map must preserve active navigation');
assert.ok(cache.has('pocket_navigation_session_v1'));
assert.equal(window.pocketNativeNavigationResume(id),true);
await Promise.resolve();
assert.equal(opened,1,'Notification directly reopens live map');
assert.ok(current.navigating);
assert.equal(messages.length,1,'Resume must not double-start service');
window.stopRouteTracking(current);
assert.equal(messages[1].action,'stop');
assert.ok(!cache.has('pocket_navigation_session_v1'));
console.log('PASS auto start/stop, no extra button, map-close persistence, direct notification map resume');
