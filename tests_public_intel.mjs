import assert from 'node:assert/strict';
import worker from './backend.js';

const originalFetch=globalThis.fetch;
const fetches=[];
globalThis.fetch=async (input)=>{
  const url=String(input); fetches.push(url);
  if(url.includes('gdeltproject.org'))return new Response(JSON.stringify({articles:[
    {title:'Sample headline',url:'https://example.com/report',domain:'example.com',seendate:'20261104T120000Z'},
    {title:'Unsafe link',url:'javascript:alert(1)'}
  ]}),{headers:{'content-type':'application/json'}});
  if(url.includes('kev-data'))return new Response(JSON.stringify({vulnerabilities:[
    {cveID:'CVE-2026-1001',vendorProject:'Vendor',product:'One',vulnerabilityName:'Sample A',dateAdded:'2026-11-04'},
    {cveID:'CVE-2026-1002',vendorProject:'Other',product:'Two',vulnerabilityName:'Sample B',dateAdded:'2026-10-30'}
  ]}),{headers:{'content-type':'application/json'}});
  if(url.includes('api.first.org'))return new Response(JSON.stringify({data:[
    {cve:'CVE-2026-1001',epss:'0.25',percentile:'0.90',date:'2026-11-04'}
  ]}),{headers:{'content-type':'application/json'}});
  throw new Error('Unexpected destination '+url);
};
try {
  const call=async path=>{
    const response=await worker.fetch(new Request('https://worker.test'+path),{});
    return {status:response.status,body:await response.json()};
  };
  let r=await call('/api/public-intel?kind=news&q=climate%20change&limit=2');
  assert.equal(r.status,200);
  assert.equal(r.body.items.length,1);
  assert.equal(r.body.items[0].verification,'unverified_article');
  assert.match(r.body.verification,/not independent confirmation/);
  r=await call('/api/public-intel?kind=news&q=x');
  assert.equal(r.status,400);
  r=await call('/api/public-intel?kind=kev&q=Vendor');
  assert.equal(r.status,200);
  assert.equal(r.body.items.length,1);
  assert.equal(r.body.items[0].cve,'CVE-2026-1001');
  r=await call('/api/public-intel?kind=epss&q=CVE-2026-1001');
  assert.equal(r.status,200);
  assert.equal(r.body.items[0].epss,0.25);
  r=await call('/api/public-intel?kind=epss&q=invalid');
  assert.equal(r.status,400);
  assert.equal(fetches.length,3);
  console.log('Public intelligence mocked integration tests passed');
} finally {globalThis.fetch=originalFetch;}
