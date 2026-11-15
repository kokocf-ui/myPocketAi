import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const start=source.indexOf('async function fetchQuickPlaceResponse(');
const end=source.indexOf('async function runModuleSearch(choice){',start);
assert.ok(start>=0&&end>start,'Small-shop retry implementation is present');
const fragment=source.slice(start,end);
assert.match(source,/choice\.placeCategory==='corner_shop'/,'Retries are limited to small shops');
assert.match(source,/retry\.textContent=dialogText\('Reîncearcă băcăniile'/,
 'A failed search has an explicit manual retry button');
assert.match(source,/searchGeneration===state\.moduleSearchGeneration/,
 'An old request cannot overwrite a newer search');

const sleep=(handler,_ms)=>{handler();return 1};
let responses=[],requests=0;
const fetcher=async (...args)=>{requests++;const next=responses.shift();if(next instanceof Error)throw next;return next};
const dialogText=(ro,_en)=>ro;
const request=new Function('CLIENT_CONFIG','fetch','dialogText','setTimeout',
 fragment+'\nreturn fetchQuickPlaceResponse;')(
 {apiUrl:'https://unit.test/api/chat'},fetcher,dialogText,sleep);
const body={message:'Băcănii în apropiere'},query={place_category:'corner_shop'};
const signal=new AbortController().signal;
const data={status:'success',places:[{name:"Sunny's"}]};
responses=[new TypeError('Failed to fetch'),Response.json(data)];
requests=0;
assert.deepEqual(await request(body,query,signal,true),data);
assert.equal(requests,2,'One transparent retry recovers a transient network error');
responses=[new Response('',{status:503}),Response.json(data)];
requests=0;
assert.deepEqual(await request(body,query,signal,true),data);
assert.equal(requests,2,'Temporary Cloudflare 503 gets one retry');
responses=[new TypeError('Failed to fetch')];requests=0;
await assert.rejects(request(body,query,signal,false),/Failed to fetch/);
assert.equal(requests,1,'Other place categories keep their one-request policy');
responses=[new TypeError('Failed to fetch'),new TypeError('Failed to fetch')];
requests=0;
await assert.rejects(request(body,query,signal,true),/Failed to fetch/);
assert.equal(requests,2,'Repeated failure is reported instead of an endless retry');
responses=[new Response('',{status:400})];requests=0;
await assert.rejects(request(body,query,signal,true),/HTTP 400/);
assert.equal(requests,1,'Invalid requests are not retried');
const cancelled=new AbortController();cancelled.abort();
responses=[new TypeError('Failed to fetch')];requests=0;
await assert.rejects(request(body,query,cancelled.signal,true),/Failed to fetch/);
assert.equal(requests,1,'A cancelled search cannot trigger another request');
console.log('PASS corner-shop one-time retry and manual recovery, other search categories unchanged');
