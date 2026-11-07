import assert from 'node:assert/strict';
import worker from './backend.js';

const actualFetch=globalThis.fetch;
const requested=[];
const london={result_type:'city',city:'London',state:'England',country:'United Kingdom',country_code:'gb',lat:51.5074,lon:-0.1278};
const oxford={result_type:'street',street:'Oxford Street',city:'London',country:'United Kingdom',country_code:'gb',lat:51.5154,lon:-0.1418};

globalThis.fetch=async input=>{
  const url=new URL(typeof input==='string'?input:input.url||input.toString());
  requested.push(url);
  if(url.hostname!=='api.geoapify.com')throw new Error('Unexpected provider '+url.hostname);
  const text=url.searchParams.get('text')||'';
  const country=url.searchParams.get('filter');
  if(country==='countrycode:gb'&&/^London(?:,|$)/i.test(text))return Response.json({results:[london]});
  if(country==='countrycode:gb'&&/^(?:Ox|Oxford)(?:,|\\s)/i.test(text))return Response.json({results:[oxford]});
  return Response.json({results:[]});
};
const lookup=async(stage,query,country='gb',city='')=>{
  requested.length=0;
  const response=await worker.fetch(new Request('https://test.local/api/chat',{
    method:'POST',headers:{'content-type':'application/json'},
    body:JSON.stringify({address_lookup:{stage,country,city,street:'',query,postcode:'',region:'',
      cityPoint:city?{latitude:51.5074,longitude:-0.1278}:undefined}})
  }),{GEOAPIFY_API_KEY:'test'});
  assert.equal(response.status,200,'Address lookup must respond successfully');
  return response.json();
};
try {
  for(const alias of ['Londra','Londres','Londen','Londyn','Лондон']){
    const found=await lookup('city',alias);
    assert.equal(found.candidates?.length,1,'Missing verified city for '+alias);
    assert.equal(found.candidates[0].city,'London');
    assert.equal(found.candidates[0].country_code,'GB');
    assert.ok(requested.every(u=>u.searchParams.get('filter')==='countrycode:gb'));
    assert.ok(requested.every(u=>/^London(?:,|$)/i.test(u.searchParams.get('text')||'')),
      'Provider should receive canonical London, not '+alias);
  }
  const street=await lookup('street','Ox','gb','London');
  assert.equal(street.candidates?.length,1,'Street remains searchable after selecting London');
  assert.equal(street.candidates[0].street,'Oxford Street');
  const wrongCountry=await lookup('city','Londra','fr');
  assert.equal(wrongCountry.candidates?.length,0,'Do not create a London result in the wrong country');
  assert.ok(requested.every(u=>u.searchParams.get('filter')==='countrycode:fr'));
  const english=await lookup('city','London');
  assert.equal(english.candidates?.[0]?.city,'London','Existing canonical name must still work');
  console.log('PASS address picker: localized London names, verified country, street lookup and canonical name');
} finally {
  globalThis.fetch=actualFetch;
}
