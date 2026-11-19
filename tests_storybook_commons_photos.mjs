import assert from 'node:assert/strict';
import backend from './backend.js';
import {normaliseCommonsPhoto,normaliseOpenversePhoto,searchStorybookCommonsPhotos} from './storybook_commons_photos.mjs';
const sample={
 title:"File:Terracotta Army Xi'an.jpg",
 imageinfo:[{
  mime:'image/jpeg',width:1600,height:900,
  thumburl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Terracotta_Army.jpg/960px-Terracotta_Army.jpg',
  descriptionurl:'https://commons.wikimedia.org/wiki/File:Terracotta_Army_Xian.jpg',
  extmetadata:{
   LicenseShortName:{value:'CC BY-SA 4.0'},
   LicenseUrl:{value:'https://creativecommons.org/licenses/by-sa/4.0/'},
   Artist:{value:'<a href="https://commons.wikimedia.org/">Museum Photographer</a>'}
  }
 }]
};
const found=normaliseCommonsPhoto(sample);
assert.ok(found);
assert.equal(found.license,'CC BY-SA 4.0');
assert.equal(found.author,'Museum Photographer');
assert.equal(found.is_ai_generated,false);
assert.equal(normaliseCommonsPhoto({...sample,imageinfo:[{...sample.imageinfo[0],extmetadata:{LicenseShortName:{value:'All rights reserved'}}}]}),null);
assert.equal(normaliseCommonsPhoto({...sample,imageinfo:[{...sample.imageinfo[0],mime:'image/svg+xml'}]}),null);
assert.equal(normaliseCommonsPhoto({...sample,imageinfo:[{...sample.imageinfo[0],thumburl:'https://evil.example/photo.jpg'}]}),null);
assert.ok(normaliseCommonsPhoto({...sample,imageinfo:[{...sample.imageinfo[0],extmetadata:{}}]}));
const openverseSample={id:'example-photo',category:'photograph',mature:false,license:'by-sa',
 license_version:'4.0',creator:'Museum',title:'Terracotta Warriors',
 thumbnail:'https://api.openverse.org/v1/images/example-photo/thumb/',
 foreign_landing_url:'https://photos.example.org/warriors',provider:'flickr'};
assert.equal(normaliseOpenversePhoto(openverseSample)?.provider,'Openverse');
assert.equal(normaliseOpenversePhoto({...openverseSample,mature:true}),null);
assert.equal(normaliseOpenversePhoto({...openverseSample,license:'by-nd'}),null);
assert.equal(normaliseOpenversePhoto({...openverseSample,category:'illustration'})?.provider,'Openverse');

let requested=0;
const mock=async (url,opts)=>{
 requested++;
 const u=new URL(url);
 assert.equal(u.hostname,'commons.wikimedia.org');
 assert.equal(u.searchParams.get('gsrnamespace'),'6');
 assert.match(String(opts.headers['User-Agent']),/myPocketAI/);
 return new Response(JSON.stringify({query:{pages:[sample]}}),{status:200,headers:{'Content-Type':'application/json'}});
};
const searched=await searchStorybookCommonsPhotos('Terracotta Army',{limit:4,fetchImpl:mock,language:'en'});
assert.equal(searched.status,'success');
assert.equal(searched.photos.length,1);
assert.equal(searched.photos[0].provider,'Wikimedia Commons');
assert.equal(requested,1);
const empty=await searchStorybookCommonsPhotos('Nothing Relevant Here',{fetchImpl:async()=>new Response(JSON.stringify({query:{pages:[]}}),{status:200})});
assert.equal(empty.status,'no_reusable_photos');


let fallbackRequests=0;
const bilingual=async (url)=>{
 fallbackRequests++;
 const u=new URL(url);
 if(u.hostname==='ro.wikipedia.org'){
  assert.equal(u.searchParams.get('lllang'),'en');
  return new Response(JSON.stringify({query:{pages:[{langlinks:[{title:'Terracotta Army'}]}]}}),{status:200});
 }
 assert.equal(u.hostname,'commons.wikimedia.org');
 const pages=u.searchParams.get('gsrsearch')==='Terracotta Army'?[sample]:[];
 return new Response(JSON.stringify({query:{pages}}),{status:200});
};
const bilingualResult=await searchStorybookCommonsPhotos('Soldații de teracotă',{limit:4,language:'ro',fetchImpl:bilingual});
assert.equal(bilingualResult.status,'success');
assert.equal(bilingualResult.photos.length,1);
assert.equal(bilingualResult.query,'Terracotta Army');
assert.equal(fallbackRequests,3);


let openverseCalls=0;
const onlyOpenverse=async(url)=>{
 const u=new URL(url);
 if(u.hostname==='api.openverse.org'){
  openverseCalls++;
  return new Response(JSON.stringify({results:[openverseSample]}),{status:200});
 }
 return new Response(JSON.stringify({query:{pages:[]}}),{status:200});
};
const openverseFallback=await searchStorybookCommonsPhotos('warrior photography generic',{language:'en',fetchImpl:onlyOpenverse});
assert.equal(openverseFallback.status,'success');
assert.equal(openverseFallback.photos[0].provider,'Openverse');
assert.equal(openverseCalls,1);


const historicalQueries=[];
const historicalImages=async url=>{
 const u=new URL(url);
 if(u.hostname==='commons.wikimedia.org'){
  const q=u.searchParams.get('gsrsearch')||'';
  historicalQueries.push(q);
  return new Response(JSON.stringify({query:{pages:q.endsWith(' statue')?[sample]:[]}}),{status:200});
 }
 return new Response(JSON.stringify({results:[]}),{status:200});
};
const historical=await searchStorybookCommonsPhotos('Ancient Dacian king topic',{language:'en',documentary:true,limit:3,fetchImpl:historicalImages});
assert.equal(historical.status,'success');
assert.equal(historical.photos.length,1);
assert.ok(historicalQueries.some(q=>q.endsWith(' statue')));

const orig=globalThis.fetch;
try{
 globalThis.fetch=mock;
 const response=await backend.fetch(new Request('https://unit.test/api/storybook-photos',{
  method:'POST',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({query:'Terracotta Army of Xian',limit:4})
 }),{});
 assert.equal(response.status,200);
 const body=await response.json();
 assert.equal(body.status,'success');
 assert.equal(body.photos[0].license,'CC BY-SA 4.0');
 assert.equal(body.photos[0].is_ai_generated,false);
}finally{globalThis.fetch=orig;}
console.log('PASS: Wikimedia real-photo metadata, licences, host validation and standalone API route');
