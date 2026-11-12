import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {PRACTICAL_UI_SCRIPT} from './practical_ui.mjs';

const result=await app.fetch(new Request('https://pocket-ui-regression.test/'));
assert.equal(result.status,200);
const html=await result.text();
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source&&source.length>100000,'Full client script must be present');
new vm.Script(source,{filename:'home-pdf-avatar-route.js'});

assert.match(html,/#view-home \.card-grid\{\s*padding-top:clamp\(18px,2\.5dvh,30px\)/,
 'Home cards regain their top spacing');
assert.match(html,/row-gap:clamp\(13px,2\.4dvh,21px\)/,'Home card row spacing is restored');
assert.match(html,/\.edu-pdf-actions\{display:inline-flex!important;flex-flow:row nowrap!important/,
 'Save and Print are a nonwrapping group');
assert.match(html,/\.edu-pdf-actions \.edu-icon-action\{[^}]*width:42px!important;[^}]*height:42px!important/,
 'Both controls are square 42px icons');
assert.match(source,/function eduAttachPrintAction\(bar\)[\s\S]*?group\.append\(b\)/,
 'Save and Print are inserted in the same PDF group');
assert.match(PRACTICAL_UI_SCRIPT,/pdfActions\.append\(pdfSave,pdfPrint\)/,
 'CV Save and Print remain side by side');

assert.match(source,/function pocketExitQuestion\(\)/,'Exit prompt uses a single source');
assert.match(source,/ro:'Închizi\?'/,'Romanian exit prompt is exactly Închizi?');
assert.doesNotMatch(source,/Vrei să închizi aplicația sau mai ai nevoie de mine\?/,
 'Old farewell prompt is removed');

const start=source.indexOf('function retainRouteResult(data,bubble){');
const end=source.indexOf('\nconst READER_LABELS=',start);
assert.ok(start>=0&&end>start,'Route result entry must be available');
const routeFunction=source.slice(start,end);
const make=(state,calls,queue,bubble)=>new Function(
 'state','validMapRoute','routeMapText','document','routeOptionsControl',
 'routeNavigationLink','requestAnimationFrame','openWalkingRouteChoices','openRouteMap',
 routeFunction+';return retainRouteResult;'
)(
 state,route=>Boolean(route?.coordinates?.length),()=>({open:'Open map'}),
 {createElement:()=>({type:'',className:'',textContent:'',onclick:null})},
 ()=>({kind:'options'}),()=>({kind:'navigation'}),fn=>queue.push(fn),
 (...args)=>calls.push({kind:'choices',args}),(...args)=>calls.push({kind:'map',args})
);
const route={id:'driving-1',profile:'drive',coordinates:[[0,51],[0.02,51.01]],distanceMeters:3800,durationSeconds:530};
const state={lastRouteOptions:[],lastRoute:null,lastRouteReply:''},calls=[],queue=[],bubble={items:[],append(...items){this.items.push(...items)}};
const retain=make(state,calls,queue,bubble);
retain({route,routes:[route],reply:'Driving choices',auto_open_map:true},bubble);
assert.equal(calls.length,0,'The map must not open before route choice');
assert.equal(queue.length,1,'Route options scheduled after route response');
queue[0]();
assert.equal(calls[0]?.kind,'choices','Driving choices appear first');
assert.equal(calls.some(x=>x.kind==='map'),false,'No automatic driving map');
bubble.items[1].onclick();
assert.equal(calls.at(-1)?.kind,'map','Explicit Open map action still works');
assert.doesNotMatch(source,/if\(choices\.length<=1&&state\.lastRoute\.profile==='drive'\)/,'Single driving route cannot skip the choice screen');
assert.match(source,/else openWalkingRouteChoices\(route,options\)/,'Map Back returns to options');

// Education category cards must use the vertical space instead of being crammed
// against the top while the lower part of the screen is empty.
assert.match(html,/#view-module\.learning-choose \.education-grid\{[^}]*grid-template-rows:repeat\(4,minmax\(108px,1fr\)\)!important/s,
 'Four subject rows stay legible and can scroll inside the Education viewport');
assert.match(html,/#view-module\.learning-choose \.education-grid\{[^}]*gap:clamp\(6px,1dvh,10px\)!important/s,
 'Subject rows retain visible spacing without a competing height cap');
assert.match(html,/main\.page:has\(#view-module\.learning-languages\.active\)\{[\s\S]*?overflow-x:hidden!important;overflow-y:auto!important/,
 'Foreign-language pages scroll instead of cropping the last row');
assert.match(html,/#view-module\.learning-languages \.foreign-stage-languages \.science-choice-list\{[^}]*overflow:visible!important/,
 'The entire language option list remains reachable');
assert.match(html,/#view-module\.learning-active \.education-toolbar \.edu-pdf-actions > \.secondary-btn\.edu-icon-action\{[\s\S]*?min-width:42px!important;[\s\S]*?min-height:42px!important/,
 'A more specific rule overrides the old 100–180px icon minimum');
assert.match(source,/🔎 Caută autorul \/ opera/,'Literature has an explicit author/work search button');
assert.match(source,/work\.addEventListener\('keydown',e=>\{/,'Enter can execute the literature search');
assert.match(source,/litSearchAuthorOrWork\(\)/,'Search button executes author-first lookup');
assert.match(source,/search\/authors\.json\?q=/,'Search first queries author records');
assert.match(source,/authors\/\x27\+author\.key\+\x27\/works\.json/,'Works are retrieved for the selected author');
assert.match(source,/const id=cleanName\(title\)/,'Work titles are deduplicated');
assert.match(source,/lookupMore\.hidden=lookupOffset>=lookupTotal/,'More works are paginated only while available');
assert.match(source,/lookupResults\.replaceChildren\(\)/,'Starting a new query clears old results');

console.log('PASS: Education layout, PDF buttons, sourced author/work search, avatar and driving route flow');
