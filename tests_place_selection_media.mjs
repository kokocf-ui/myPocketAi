import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import frontend from './index.js';

const src=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert.ok(src.includes("const u=new URL('/api/place-media',location.origin)"),'Place media must resolve against Android WebView origin');
assert.ok(!src.includes("new URL(CLIENT_CONFIG.apiUrl.split('/api/chat')[0]+'/api/place-media')"),'Broken relative URL is removed');
assert.ok(!src.includes('new URL(CLIENT_CONFIG.apiUrl);'),'All finance/news URL constructors need their origin');
assert.ok(src.includes('Promise.resolve().then(()=>loadPlaceMedia(place)).then(data=>'),'Place detail must render even if enrichment throws synchronously');

// Run the actual place-media function in isolation, using a verified origin.
const a=src.indexOf('const placeMediaRequests=new Map();');
const b=src.indexOf('function mountPlaceLogo(',a);
assert.ok(a>0&&b>a,'Place media implementation is present');
let mediaUrl='';
const loadPlaceMedia=new Function('fetch','location','AbortSignal',
 src.slice(a,b)+'\nreturn loadPlaceMedia;')(
 async url=>{mediaUrl=String(url);return Response.json({details:{opening_hours:'Mon-Fri'}})},
 {origin:'https://lifewise-ai-v2.kokocf.workers.dev'},AbortSignal);
const place={name:'Test cafe',address:'High Street, Grays',type:'cafe',
 latitude:51.477,longitude:0.301,distance_meters:250};
const info=await loadPlaceMedia(place);
assert.equal(info.details.opening_hours,'Mon-Fri');
assert.equal(new URL(mediaUrl).origin,'https://lifewise-ai-v2.kokocf.workers.dev');
assert.equal(new URL(mediaUrl).pathname,'/api/place-media');
assert.equal(new URL(mediaUrl).searchParams.get('name'),'Test cafe');

// Test GET /api/place-media forwarding to the existing backend service.
let upstreamPath='';
const query='?name='+encodeURIComponent('Test cafe')+'&lat=51.477&lon=0.301';
const webResponse=await frontend.fetch(
 new Request('https://lifewise-ai-v2.kokocf.workers.dev/api/place-media'+query),
 {POCKET_API:{fetch:async request=>{
  upstreamPath=new URL(request.url).pathname;
  assert.equal(new URL(request.url).searchParams.get('name'),'Test cafe');
  return Response.json({logos:[],details:{description:'Verified place details'}});
 }}});
assert.equal(webResponse.status,200);
assert.equal(upstreamPath,'/api/place-media');
assert.equal((await webResponse.json()).details.description,'Verified place details');

// Exercise the actual detail renderer with a synchronous media failure.
// The card and Alege traseul button must still exist after the failed request.
class Node {
 constructor(tag='div'){this.tag=tag;this.children=[];this.dataset={};this.style={cssText:''};
  this.className='';this.textContent='';this.isConnected=true;this.listeners={};
  this.classList={add(){},remove(){}};}
 set innerHTML(v){this.children=[]}
 get innerHTML(){return ''}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(){}
 addEventListener(name,cb){this.listeners[name]=cb}
 querySelector(){return null}
}
const body=new Node(),title=new Node(),sheet=new Node();
const elements={moduleLayerBody:body,moduleLayerTitle:title};
const document={createElement:tag=>new Node(tag),createTextNode:text=>String(text),
 querySelector:q=>q==='.module-quick-sheet'?sheet:null};
const state={busy:false,moduleSearchResults:[place],moduleSearchReturnMode:'list',lastQuickPlace:null};
let routed=null;
const start=src.indexOf('function renderModulePlaceDetails(place){');
const end=src.indexOf('const QUICK_SEARCH_ENGLISH=',start);
assert.ok(start>0&&end>start);
const renderDetails=new Function('state','document','$','quickUiText','detailLabels',
 'quickPlaceDisplayName','mountPlaceLogo','dialogText','loadPlaceMedia','appendPlaceWebsite',
 'localizedPlaceCategory','formatDistance','offerPlaceTravelModes','renderModulePlaces',
 src.slice(start,end)+'\nreturn renderModulePlaceDetails;')(
 state,document,id=>elements[id],()=>({location:'Locație',category:'Categorie',distance:'Distanță',
 placeDetails:'Detalii locație',backResults:'Înapoi la rezultate'}),
 ()=>({address:'Adresă',phone:'Telefon',website:'Website',price:'Preț',rooms:'Camere'}),
 p=>p.name,()=>{},(ro)=>ro,
 ()=>{throw new TypeError('Media service unavailable')},
 ()=>{},x=>x,x=>x,
 p=>{routed=p},()=>{});
renderDetails(place);
assert.equal(title.textContent,'Detalii locație');
const card=body.children.find(c=>c.className==='module-place-details');
assert.ok(card,'Details card must be visible even when media service fails');
const header=card.children.find(c=>c.className==='place-detail-header');
const actions=header.children.find(c=>c.className==='place-detail-actions');
const go=actions.children.find(c=>c.className.includes('place-detail-route'));
assert.ok(go,'Alege traseul button must remain visible');
go.onclick();
assert.equal(routed,place,'Selected place is handed off to routing');
await new Promise(resolve=>setTimeout(resolve,0));
assert.ok(body.children.includes(card),'Failed media enrichment must not blank out selected place');

console.log('PASS selected POI renders details and route selection despite media errors; media URL and proxy valid');
