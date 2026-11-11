import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const cut=(from,to)=>{
 const start=code.indexOf(from),end=code.indexOf(to,start+from.length);
 assert.ok(start>=0&&end>start,'Missing '+from);
 return code.slice(start,end);
};
const route= cut('function showDedicatedRouteResults(route,options=state.lastRouteOptions){','function showDedicatedRouteIssue(message){');
const issue= cut('function showDedicatedRouteIssue(message){','function showNavigationReturnInPanel(body){');
const submit= cut('async function submitMessage({fromVoice=false}={}){',"$('chatForm').addEventListener('submit'");
const map= cut('async function openRouteMap(route,origin,options=state.lastRouteOptions,startNavigation=false){','const routeApproximationNotices=new WeakMap();');
const choices= cut('function openWalkingRouteChoices(route,options=state.lastRouteOptions){','function retainRouteResult(data,bubble){');
const source= cut('function returnToNavigationSource(){','function showNavigationReturn(){');
const loader= cut('function beginRouteSearchLoading(profile){','function showNavigationReturnInPanel(body){');

assert.match(submit,/const routePickerFromPlace=Boolean\(state\.routeSearchContext\?\.destination\)/,'Place-anchored route intent is retained');
assert.match(submit,/if\(routeLoadingRequested&&routeLoadingProfile!=='transit'&&validMapRoute\(data\.route\)\)/,'Walking/driving route result switches to choices');
assert.ok(submit.indexOf('showDedicatedRouteResults(data.route,state.lastRouteOptions)')<submit.indexOf('const weatherSummary=reply'),'Route choices open before any chat response UI');
assert.match(submit,/showDedicatedRouteIssue\(reply\)/,'No valid walking/driving route gets a dedicated error screen');
assert.match(submit,/if\(routePickerFromPlace\)showDedicatedRouteIssue\(reason\)/,'Network failures do not expose chat');
assert.match(submit,/if\(routeLoadingRequested\)requestAnimationFrame\(finishRouteSearchLoading\)/,'Loading state cleanup also works after early return');
assert.match(route,/classList\.add\('route-results-active'\)/,'Route presentation hides chat after load');
assert.match(route,/openWalkingRouteChoices\(route,options\)/,'Open choice list, do not skip straight to map');
assert.match(route,/replaceChildren\(panel\)/,'Dedicated page replaces loader');
assert.match(issue,/classList\.add\('route-results-active'\)/,'Error page also hides chat');
assert.match(choices,/button\.onclick=\(\)=>\{layer\.remove\(\);state\.lastRoute=v;openRouteMap\(v,null,usable\)\}/,'Only user selection opens map');
assert.match(choices,/const action=el\.onclick;el\.onclick=\(\)=>\{layer\.remove\(\);action\?\.\(\)\}/,'Find more routes closes choice overlay before searching');
assert.match(map,/else openWalkingRouteChoices\(route,options\)/,'Map Previous reopens exactly the route choices');
assert.match(source,/finishRouteSearchLoading\(\);clearDedicatedRouteResults\(\)/,'Return to sources clears route presentation');
assert.match(loader,/function clearDedicatedRouteResults\(\)/,'Dedicated UI has a teardown');
assert.match(code,/#view-module\.route-results-active\.active #moduleChatHost/,'Chat stays hidden after search completes');

const mocks={},shown=new Set();
const createElement=tag=>({
 tag,children:[],attributes:{},style:{},className:'',textContent:'',
 setAttribute(k,v){this.attributes[k]=v},
 append(...nodes){this.children.push(...nodes)},
 replaceChildren(...nodes){this.children=nodes}
});
const host={children:[],replaceChildren(...nodes){this.children=nodes}};
const view={classList:{add:name=>shown.add(name),remove:name=>shown.delete(name)}};
const fakeDocument={
 createElement,
 querySelector:()=>null,
 getElementById:()=>null
};
const $=id=>({'view-module':view,moduleContent:host})[id];
const sample={profile:'walk',coordinates:[[0,51],[.01,51]],distanceMeters:2400};
let presented=null;
const funcs=new Function('state','$','document','dialogText','validMapRoute','finishRouteSearchLoading','routeOptionsText','openWalkingRouteChoices','returnToNavigationSource','returnToModuleLanding',
 'function showDedicatedRouteResults(route,options=state.lastRouteOptions){'+route.split('function showDedicatedRouteResults(route,options=state.lastRouteOptions){')[1]+'\nreturn {showDedicatedRouteResults};');
const api=funcs({currentView:'module',lastRoute:sample,lastRouteOptions:[sample]},$,fakeDocument,(ro,en)=>ro,()=>true,()=>shown.delete('route-searching'),()=>['Alege traseul'],(r,opts)=>{presented={r,opts}},()=>{},()=>{});
api.showDedicatedRouteResults(sample,[sample]);
assert.ok(shown.has('route-results-active'));
assert.equal(host.children[0].id,'routeResultsLanding');
assert.equal(host.children[0].children[0].textContent,'Alege traseul');
assert.deepEqual(presented,{r:sample,opts:[sample]});
console.log('PASS: Route selection is immediate, silent, and preserved across map Back');
