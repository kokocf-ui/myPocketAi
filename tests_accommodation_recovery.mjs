import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import frontend from './index.js';

const backend=await fs.readFile(new URL('./backend.js',import.meta.url),'utf8');
assert.match(backend,/tourism~"[^"]*\(hotel\|hostel\|guest_house\|motel\|apartment\|chalet\)/,
 'Original multi-type lodging category must remain available');
assert.match(backend,/hotel:\s*"hotel guest house motel hostel holiday apartment"/,
 'Photon lodging fallback must remain available');
const html=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const script=html.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1];
assert.ok(script,'Missing browser script');
new vm.Script(script);
assert.ok(script.includes('fetch(CLIENT_CONFIG.apiUrl'), 'Lodging must use the existing browser API configuration');
assert.ok(!script.includes('fetch(APP.apiUrl'), 'APP is not defined in the browser');

const start=script.indexOf('function showAccommodationNotice(');
const end=script.indexOf('function openStandaloneChoicePanel(',start);
assert.ok(start>=0&&end>start,'Accommodation view functions missing');

class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.style={cssText:''};this.textContent='';this.className='';this.dataset={};this.parent=null;}
 append(...items){for(const c of items){this.children.push(c);c.parent=this}}
 prepend(...items){this.children.unshift(...items)}
 setAttribute(){}
 remove(){this.removed=true;if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this)}
}

const examplePlaces=[
 {name:'Hotel Test',type:'hotel',latitude:41.4038,longitude:2.175},
 {name:'Apartament Test',type:'apartment',latitude:41.404,longitude:2.173},
 {name:'Hostel Test',type:'hostel',latitude:41.401,longitude:2.174},
 {name:'Motel Test',type:'motel',latitude:41.402,longitude:2.176},
];
const response=places=>({ok:true,json:async()=>({status:'success',search_ok:places.length>0,results_count:places.length,places})});

async function runScenario(providerResponse,mode){
 const state={language:'ro',tripCountryOnChoice:null};
 const panels=[],requests=[],routes=[],timers=[],root=new Element('body');
 const document={createElement:tag=>new Element(tag),getElementById:id=>root.children.find(x=>x.id===id)||null,body:root};
 const fetch=async (url,options)=>{requests.push({url,body:JSON.parse(options.body)});return providerResponse};
 const methods=new Function('document','state','fetch','CLIENT_CONFIG','openStandaloneChoicePanel','openTransportModeFromAssistant','setTimeout','console',
  script.slice(start,end)+';return {offerDestinationAccommodationBeforeRoute};')(
  document,state,fetch,{apiUrl:'https://unit-test.example/api/chat'},
  (host,title)=>panels.push({host,title}),data=>routes.push(data),(callback,ms)=>timers.push(ms),{warn(){}}
 );
 const destination={label:'Sagrada Família, Barcelona, Spain',latitude:41.4036,longitude:2.1744};
 assert.equal(methods.offerDestinationAccommodationBeforeRoute(destination),true);
 const yes=panels[0].host.children.find(el=>el.textContent==='Da, caută cazare');
 assert.ok(yes,'The accommodation option should exist');
 await yes.onclick();
 assert.equal(requests.length,1,'Only the original provider pipeline is queried');
 const body=requests[0].body;
 assert.equal(requests[0].url,'https://unit-test.example/api/chat');
 assert.equal(body.message,'Caută cazare în jurul meu');
 assert.equal(body.module,'travel');
 assert.equal(body.location_source,'selected_attraction');
 assert.equal(body.location.latitude,destination.latitude);
 assert.equal(body.location.longitude,destination.longitude);
 assert.ok(Math.abs(Date.now()-body.location.updatedAt)<60000);

 const labels=el=>[el.textContent,...el.children.flatMap(labels)].filter(Boolean);
 if(mode==='found'){
  const panel=panels.at(-1);
  assert.equal(panel.title,'Cazări găsite');
  const text=labels(panel.host).join(' | ');
  for(const name of examplePlaces.map(p=>p.name))assert.ok(text.includes(name),'Lodging missing: '+name);
  const skip=panel.host.children.find(el=>el.textContent==='Continuă fără cazare');
  assert.ok(skip,'Skip action needed to preserve travel flow');
  skip.onclick();
  assert.equal(routes.at(-1).route_context.destination.label,destination.label);
  assert.equal(root.children.length,0,'No notice when accommodations are found');
 }else if(mode==='empty'){
  assert.equal(routes.at(-1).route_context.destination.label,destination.label);
  assert.equal(root.children.length,1,'Exactly one temporary empty notice');
  assert.ok(root.children[0].textContent.includes('Nu am identificat cazări'));
  assert.equal(timers[0],2000,'Notice must last 2 seconds');
 }else if(mode==='error'){
  assert.equal(routes.at(-1).route_context.destination.label,destination.label);
  assert.equal(root.children.length,0,'Technical errors must not pretend no accommodation exists');
 }
}

await runScenario(response(examplePlaces),'found');
await runScenario(response([]),'empty');
await runScenario({ok:false,status:503,json:async()=>({})},'error');
console.log('Accommodation recovery: original provider + apartment/hostel/motel + return to routing + short notice OK');
