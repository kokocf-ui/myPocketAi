import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from './backend.js';
import {verifiedLocationPhoto} from './place_photo_public.mjs';

const pages=[],cacheData=new Map();
const cache={
 async match(key){return cacheData.get(key)?.clone()||null},
 async put(key,value){cacheData.set(key,value.clone())}
};
const fixtures=async(input)=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 pages.push(u);
 if(u.hostname==='commons.wikimedia.org'){
  if(u.searchParams.get('list')==='geosearch'){
   assert.equal(u.searchParams.get('gsnamespace'),'6');
   assert.equal(u.searchParams.get('gsradius'),'85');
   return Response.json({query:{geosearch:[
    {ns:6,title:'File:Unrelated Pharmacy logo.svg',dist:10},
    {ns:6,title:'File:Nearby building.jpg',dist:8},
    {ns:6,title:'File:Armada Pharmacy facade Chafford Hundred.jpg',dist:18},
    {ns:6,title:'File:Armada Pharmacy Grays sign.jpg',dist:110}
   ]}});
  }
  if(u.searchParams.get('prop')==='imageinfo'){
   const title=u.searchParams.get('titles');
   assert.equal(title,'File:Armada Pharmacy facade Chafford Hundred.jpg');
   return Response.json({query:{pages:[{
    title,imageinfo:[{width:1280,height:900,mime:'image/jpeg',
     thumburl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Armada_Pharmacy.jpg',
     extmetadata:{Artist:{value:'<span>Local photographer</span>'},
      LicenseShortName:{value:'CC BY-SA 4.0'},
      LicenseUrl:{value:'https://creativecommons.org/licenses/by-sa/4.0/'}}}]
   }]}});
  }
 }
 throw Error('Unexpected photo source '+u.href);
};
const address={name:'Armada Pharmacy',latitude:51.48,longitude:0.29};
const good=await verifiedLocationPhoto({...address,fetcher:fixtures,cache});
assert.equal(good.status,'verified');
assert.match(good.photo.image_url,/upload.wikimedia.org/);
assert.equal(good.photo.license,'CC BY-SA 4.0');
assert.equal(good.photo.credit,'Local photographer');
assert.match(good.photo.source_url,/commons.wikimedia.org/);
const before=pages.length;
const same=await verifiedLocationPhoto({...address,fetcher:fixtures,cache});
assert.deepEqual(same,good);
assert.equal(pages.length,before,'Cache prevents repeated Wikimedia traffic');
assert.equal((await verifiedLocationPhoto({...address,latitude:123,fetcher:fixtures})).photo,null);

const mismatch=await verifiedLocationPhoto({
 name:'Different Business',latitude:51.48,longitude:0.29,fetcher:fixtures
});
assert.equal(mismatch.photo,null,'An unrelated nearby photo must never be displayed');

// A matching Wikidata P18 photo is allowed, a brand's P154 logo is not.
const wiki=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 if(u.hostname==='www.wikidata.org')return Response.json({entities:{Q123:{
  labels:{en:{value:'Armada Pharmacy'}},
  claims:{P18:[{mainsnak:{datavalue:{value:'Armada Pharmacy facade Chafford Hundred.jpg'}}}],
   P154:[{mainsnak:{datavalue:{value:'Generic brand logo.svg'}}}]}
 }}});
 return fixtures(input);
};
const wikidata=await verifiedLocationPhoto({
 ...address,wikidata:'Q123',fetcher:wiki
});
assert.equal(wikidata.status,'verified');
const badLicense=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 if(u.searchParams.get('prop')==='imageinfo')return Response.json({query:{pages:[{
  title:'File:Armada Pharmacy facade Chafford Hundred.jpg',
  imageinfo:[{width:1280,height:900,mime:'image/jpeg',
   thumburl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/notlicensed.jpg',
   extmetadata:{LicenseShortName:{value:'All rights reserved'}}}]
 }]}});
 return fixtures(input);
};
assert.equal((await verifiedLocationPhoto({...address,fetcher:badLicense})).photo,null);

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const listStart=frontend.indexOf('function mountPlaceThumbnail(host,place){');
const listEnd=frontend.indexOf('function renderModulePlaceDetails(place){',listStart);
assert.ok(listStart>0&&listEnd>listStart);
const list=frontend.slice(listStart,listEnd);
assert.match(list,/resolveVerifiedPlacePhoto\(place\)/);
assert.doesNotMatch(list,/mountPlaceLogo\(/);
assert.doesNotMatch(list,/place\.image_url/);
assert.doesNotMatch(list,/favicon/);
const detail=frontend.slice(listEnd,frontend.indexOf('const QUICK_SEARCH_ENGLISH=',listEnd));
assert.match(detail,/resolveVerifiedPlacePhoto\(place\)/);
assert.match(detail,/showVerifiedPlacePhoto\(verified,place\.name\)/);
assert.doesNotMatch(detail,/setPhoto\(place\.image_url\)/);
assert.ok(frontend.includes("source.textContent='Wikimedia Commons'"));

const oldFetch=globalThis.fetch;
globalThis.fetch=fixtures;
try{
 const u=new URL('https://unit.test/api/place-photo-v2');
 u.searchParams.set('name','Armada Pharmacy');
 u.searchParams.set('lat','51.48');u.searchParams.set('lon','0.29');
 const res=await worker.fetch(new Request(u.href),{});
 assert.equal(res.status,200);
 const data=await res.json();
 assert.equal(data.status,'verified');
 assert.match(data.photo.image_url,/upload.wikimedia.org/);
}finally{globalThis.fetch=oldFetch}
console.log('PASS verified Commons photos, provenance, anti-logo and no wrong-storefront substitution, CDN photo UI');
