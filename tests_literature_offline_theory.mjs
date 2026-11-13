import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {LIT_OFFLINE_THEORY} from './literature_offline_theory.mjs';
import {LIT_EU_COMMON,LIT_EU_PROGRAMS} from './literature_curriculum_europe.mjs';

const branches={
 language:['grammar','vocabulary','spelling','communication','stylistics','linguistics'],
 literature:['genres','periods','authors','poetry','narrative','theatre','comparison','criticism'],
 writing:['essay','composition','commentary','summary','review','work-summary','research']
};
assert.equal(Object.keys(LIT_OFFLINE_THEORY).length,21);
for(const [branch,ids] of Object.entries(branches)){
 for(const id of ids){
  const lesson=LIT_OFFLINE_THEORY[id];
  assert.ok(Array.isArray(lesson)&&lesson.length===4,branch+' '+id+' theory and worked example');
  assert.ok(lesson.every(v=>typeof v==='string'&&v.length>=130),id+' substantial bilingual notes');
 }
}
let checked=0;
const inspect=rows=>{if(!Array.isArray(rows))return;for(const entry of rows){assert.ok(LIT_OFFLINE_THEORY[entry[3]],'School chapter key '+entry[3]+' has offline theory');checked++}};
for(const rows of Object.values(LIT_EU_COMMON))inspect(rows);
for(const profile of Object.values(LIT_EU_PROGRAMS)){
 for(const rows of Object.values(profile.byLevel||{}))inspect(rows);
 for(const rows of Object.values(profile.byGrade||{}))inspect(rows);
}
assert.ok(checked>200,'European curriculum chapter mapping checked');
const html=await(await frontend.fetch(new Request('https://literature-offline.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Frontend script exists');
new vm.Script(script);
assert.match(script,/const LIT_OFFLINE_THEORY_DATA=/);
assert.match(script,/study\.classList\.add\('lit-theory-open'\)/);
assert.match(script,/educationOpenPagedLesson\(learningLabel\(topic\[1\],topic\[2\]\),material\)/);
assert.match(script,/const out=document\.createElement\('div'\);out\.className='lit-result';out\.style\.display='none'/);
assert.match(script,/educationOpenPagedLesson\(assignment\|\|workInfo\|\|learningLabel\(topic\[1\],topic\[2\]\),material\)/);
assert.match(script,/function educationOpenPagedLesson\(title,body\)/);
assert.match(script,/eduAttachPrintAction\(head\)/,'Opened theory window exposes PDF actions');
console.log('PASS: 21 Literature themes and all school programme topics have offline lessons and printable theory');
