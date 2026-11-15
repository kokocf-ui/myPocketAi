import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const start=src.indexOf('function ensureVisibleRouteModule(){');
const end=src.indexOf('function updateQuickLayerGeometry(){',start);
assert.ok(start>=0&&end>start,'Maps empty-screen recovery helper is installed');
const helper=src.slice(start,end);
assert.ok(src.includes("if(name==='module')requestAnimationFrame(ensureVisibleRouteModule)"),
 'Re-entering the module checks for missing Maps options');
assert.ok(src.includes("if(routeLoadingRequested)requestAnimationFrame(()=>{finishRouteSearchLoading();ensureVisibleRouteModule()})"),
 'An unsuccessful route cannot leave the loading placeholder removed with no content');
assert.ok(src.includes("data.route_error_code==='route_arrival_street_unverified'"),
 'A storefront arrival rejection must open an explicit route error panel');
assert.ok(src.includes("if(routePickerFromPlace||(routeLoadingRequested&&routeLoadingProfile!=='transit'))showDedicatedRouteIssue(reason)"),
 'Failed route network calls also open an error panel');

const state={currentView:'module',currentModule:'maps',busy:false,navigationReturnContext:{module:'travel'}};
let shown=0,overlay=false,routeWindow=false,panel=false,loading=false,landing=false;
const host={querySelector:()=>panel||loading||landing?{}:null};
const $=id=>id==='moduleContent'?host:id==='moduleQuickLayer'?{classList:{contains:()=>overlay}}:null;
const document={querySelector:()=>routeWindow?{}:null};
const fn=new Function('state','$','document','renderModuleLandingChoices',
 helper+'\nreturn ensureVisibleRouteModule;');
const recover=fn(state,$,document,()=>{shown++;landing=true});
recover();
assert.equal(shown,1,'Blank Maps after a route is restored to its selection menu');
assert.equal(state.navigationReturnContext,null,'Stale route return state is cleared when recovering');
recover();assert.equal(shown,1,'Already visible quick choices must not be replaced');
landing=false;panel=true;recover();assert.equal(shown,1,'Valid route result is preserved');
panel=false;loading=true;recover();assert.equal(shown,1,'Loading route is preserved');
loading=false;overlay=true;recover();assert.equal(shown,1,'Open quick sheet is preserved');
overlay=false;routeWindow=true;recover();assert.equal(shown,1,'Active map is preserved');
routeWindow=false;state.busy=true;recover();assert.equal(shown,1,'Ongoing network request is preserved');
state.busy=false;state.currentModule='learning';recover();assert.equal(shown,1,'Education and other modules are not changed');
console.log('PASS maps empty-state recovery, explicit route rejection and safe screen preservation');
