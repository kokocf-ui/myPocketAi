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
const restricted=normaliseCommonsPhoto({...sample,imageinfo:[{...sample.imageinfo[0],
 extmetadata:{LicenseShortName:{value:'All rights reserved'}}}]});
assert.ok(restricted,'Discovery must not suppress a source-linked result based on copyright metadata');
assert.equal(restricted.rights_review_required,true);
assert.equal(normaliseCommonsPhoto({...sample,imageinfo:[{...sample.imageinfo[0],mime:'image/svg+xml'}]}),null);
assert.equal(normaliseCommonsPhoto({...sample,imageinfo:[{...sample.imageinfo[0],thumburl:'https://evil.example/photo.jpg'}]}),null);
assert.ok(normaliseCommonsPhoto({...sample,imageinfo:[{...sample.imageinfo[0],extmetadata:{}}]}));
const openverseSample={id:'example-photo',category:'photograph',mature:false,license:'by-sa',
 license_version:'4.0',creator:'Museum',title:'Terracotta Warriors',
 thumbnail:'https://api.openverse.org/v1/images/example-photo/thumb/',
 foreign_landing_url:'https://photos.example.org/warriors',provider:'flickr'};
assert.equal(normaliseOpenversePhoto(openverseSample)?.provider,'Openverse');
assert.equal(normaliseOpenversePhoto({...openverseSample,mature:true}),null);
assert.equal(normaliseOpenversePhoto({...openverseSample,license:'by-nd'})?.rights_review_required,true);
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
assert.equal(empty.status,'no_images_found');


let fallbackRequests=0;
const bilingual=async (url)=>{
 fallbackRequests++;
 const u=new URL(url);
 if(u.hostname==='ro.wikipedia.org'){
  assert.equal(u.searchParams.get('lllang'),'en');
  return new Response(JSON.stringify({query:{pages:[{title:'Soldații de teracotă',langlinks:[{title:'Terracotta Army'}]}]}}),{status:200});
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


// An exact Decebal article is valid, but Decebal Traian Remeș is a namesake.
// Media must be selected from the exact historical article, not the politician.
const exactQueries=[];
const exactHistory=async url=>{
 const u=new URL(url);exactQueries.push([u.hostname,u.searchParams.get('titles'),u.searchParams.get('gsrsearch')]);
 if(u.hostname==='ro.wikipedia.org'){
  if(u.searchParams.get('titles')==='Decebal')
   return new Response(JSON.stringify({query:{pages:[
    {title:'Decebal Traian Remeș',images:[{title:'File:Minister photo.jpg'}]},
    {title:'Decebal',images:[{title:"File:Decebal statue.jpg"}]}
   ]}}),{status:200});
  return new Response(JSON.stringify({query:{pages:[]}}),{status:200});
 }
 if(u.hostname==='commons.wikimedia.org'&&u.searchParams.get('titles'))
  return new Response(JSON.stringify({query:{pages:[{...sample,title:'File:Decebal statue.jpg'}]}}),{status:200});
 return new Response(JSON.stringify(u.hostname==='api.openverse.org'?{results:[]}:{query:{pages:[]}}),{status:200});
};
const verifiedHistory=await searchStorybookCommonsPhotos('Decebal',{
 limit:3,language:'ro',documentary:true,fetchImpl:exactHistory});
assert.equal(verifiedHistory.status,'success');
assert.equal(verifiedHistory.photos.length,1);
assert.ok(exactQueries.some(x=>x[1]?.includes('File:Decebal statue.jpg')));
assert.ok(!exactQueries.some(x=>x[1]?.includes('Minister photo')));
const wrongOnly=async url=>{
 const u=new URL(url);
 if(u.hostname==='ro.wikipedia.org')
  return new Response(JSON.stringify({query:{pages:[{
   title:'Decebal Traian Remeș',images:[{title:'File:Minister photo.jpg'}],
   langlinks:[{title:'Romanian politician'}]
  }]}}),{status:200});
 return new Response(JSON.stringify(u.hostname==='api.openverse.org'?{results:[]}:{query:{pages:[]}}),{status:200});
};
const wrongArticle=await searchStorybookCommonsPhotos('Decebal',{
 limit:3,language:'ro',documentary:true,fetchImpl:wrongOnly});
assert.equal(wrongArticle.status,'no_images_found');
assert.deepEqual(wrongArticle.photos,[]);


// Source relevance, not licence restrictions: discard an unrelated namesake
// even if its Commons file has a perfectly valid licence.
const unrelatedPerson={...sample,title:'File:Decebal Neagu 1966.jpg',imageinfo:[{
 ...sample.imageinfo[0],
 thumburl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Decebal_Neagu_1966.jpg/960px-Decebal_Neagu_1966.jpg',
 descriptionurl:'https://commons.wikimedia.org/wiki/File:Decebal_Neagu_1966.jpg'
}]};
const relevantMap={...sample,title:'File:Dacia under Decebalus Remastered.png',imageinfo:[{
 ...sample.imageinfo[0],mime:'image/png',
 thumburl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Dacia_under_Decebalus_Remastered.png/960px-Dacia_under_Decebalus_Remastered.png',
 descriptionurl:'https://commons.wikimedia.org/wiki/File:Dacia_under_Decebalus_Remastered.png'
}]};
const mixedRealistic=async url=>{
 const host=new URL(url).hostname;
 if(host==='commons.wikimedia.org')return new Response(JSON.stringify({query:{pages:[unrelatedPerson,relevantMap]}}),{status:200});
 return new Response(JSON.stringify(host==='api.openverse.org'?{results:[]}:{query:{pages:[]}}),{status:200});
};
const contextual=await searchStorybookCommonsPhotos('Decebal',{limit:3,
 language:'ro',documentary:true,context:'Regele dacilor Decebal, ultimul rege al Daciei, războaiele cu Imperiul Roman',
 fetchImpl:mixedRealistic});
assert.equal(contextual.status,'success');
assert.equal(contextual.photos.length,1);
assert.match(contextual.photos[0].title,/Dacia under Decebalus/);

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
