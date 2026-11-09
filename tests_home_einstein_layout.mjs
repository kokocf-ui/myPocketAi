import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import app from './index.js';
const indexSource=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const response=await app.fetch(new Request('https://home-layout-test.example/'));
assert.equal(response.status,200);
const html=await response.text();
const home=html.match(/<section class="view active" id="view-home"[\s\S]*?<\/div><\/section>/)?.[0];
assert.ok(home,'Home view must render');
const matches=[...home.matchAll(/data-module="(assistant|learning|travel|organize|maps|tools)"/g)].map(x=>x[1]);
assert.deepEqual(matches,['assistant','learning','travel','organize','maps','tools'],
 'Mobile visual rows must be [AI,Education]/[Hotels,Organisation]/[Maps,More]');
const cards=[...home.matchAll(/<button class="feature-card" data-module="([^"]+)"[\s\S]*?<\/button>/g)];
assert.equal(cards.length,6);
for(const [i,title] of ['Asistent AI','Învățare și educație','Hoteluri','Organizare personală','Hărți','Mai multe instrumente'].entries()){
 assert.ok(cards[i][0].includes('<span class="card-title">'+title+'</span>'),title);
}
assert.ok(cards[0][0].includes('class="home-einstein"'));
assert.ok(!cards[0][0].includes('🧠'),'Selected Einstein portrait replaces the brain');
const encoded=cards[0][0].match(/src="data:image\/webp;base64,([A-Za-z0-9+/=]+)"/)?.[1];
assert.ok(encoded&&encoded.length>2500&&encoded.length<15000,'Embedded optimized portrait is missing');
const buffer=Buffer.from(encoded,'base64');
assert.equal(buffer.toString('ascii',0,4),'RIFF');
assert.equal(buffer.toString('ascii',8,12),'WEBP');
assert.ok(buffer.length<12000,'Card art should load instantly, without remote requests');
const tstart=indexSource.indexOf('const UI_TEXT={');
const tend=indexSource.indexOf('\n};',tstart);
assert.ok(tstart>=0&&tend>tstart);
const copies=vm.runInNewContext(indexSource.slice(tstart,tend+3)+'\nUI_TEXT');
for(const locale of ['ro','en','fr','de','it','es','pt','nl','ru','pl']){
 assert.equal(copies[locale].cards.length,6,locale+' should translate all six cards');
}
assert.deepEqual(copies.ro.cards.map(c=>c[0]),['Asistent AI','Învățare și educație','Hoteluri','Organizare personală','Hărți','Mai multe instrumente']);
assert.equal(copies.en.cards[2][0],'Hotels');
assert.equal(copies.en.cards[4][0],'Maps');
assert.match(indexSource,/document\.querySelectorAll\('#view-home \.feature-card'\)\.forEach\(\(card,i\)=>/,'Home translations are order-aware');
assert.match(indexSource,/#view-home \.home-einstein\{/,'Image has bounded mobile dimensions');
const boot=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(boot);
new vm.Script(boot);
console.log('Home: approved Einstein icon, three-by-two mobile order, ten localizations, card routes intact');
