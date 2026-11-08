import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {THEORY_ENTRIES,searchTheory,theorySubjects} from './education_theory.mjs';
import {CHEMISTRY_TOPICS,CHEMISTRY_LEVELS} from './chemistry_curriculum.mjs';
import {CHEMISTRY_SPECIALIZATIONS,CHEMISTRY_SPECIALTY_TOPICS} from './chemistry_advanced.mjs';
import {
 BIOLOGY_TOPICS,BIOLOGY_SPECIALIZATIONS,BIOLOGY_SPECIALTY_TOPICS,
 BIOLOGY_LESSONS,BIOLOGY_SPECIALTY_LESSONS,biologyVerifiedExercise
} from './biology_curriculum.mjs';
const biology=THEORY_ENTRIES.filter(x=>x.subject==='biology');
assert.equal(BIOLOGY_TOPICS.length,10,'ten common branches');
assert.equal(BIOLOGY_SPECIALIZATIONS.length,9,'nine real advanced tracks');
assert.equal(BIOLOGY_SPECIALTY_TOPICS.length,36,'four own chapters per specialty');
assert.equal(BIOLOGY_LESSONS.length,60);
assert.equal(BIOLOGY_SPECIALTY_LESSONS.length,108);
assert.equal(biology.length,168);
assert.deepEqual(theorySubjects().map(x=>x.count),[211,102,268,168]);
assert.equal(new Set(biology.map(x=>x.id)).size,168);
assert.equal(new Set(biology.map(x=>x.title)).size,168,'every title is unique');
assert.ok(biology.every(x=>x.id&&x.title&&x.statement&&x.formula&&x.topic&&x.level&&Array.isArray(x.aliases)));
for(const topic of BIOLOGY_TOPICS)assert.equal(biology.filter(x=>x.topic===topic.id).length,6,topic.id);
for(const specialty of BIOLOGY_SPECIALIZATIONS){
 const chapters=BIOLOGY_SPECIALTY_TOPICS.filter(x=>x.specialty===specialty.id);
 assert.equal(chapters.length,4,specialty.id);
 assert.ok(specialty.core.every(id=>BIOLOGY_TOPICS.some(x=>x.id===id)));
 assert.ok(chapters.every(t=>biology.filter(x=>x.topic===t.id).length===3));
}
assert.ok(searchTheory('hardy',{subject:'biology',level:'advanced'}).length>0);
assert.equal(searchTheory('hardy',{subject:'biology',level:'beginner'}).length,0);
assert.ok(searchTheory('membrana',{subject:'biology',level:'beginner'}).length>0);
assert.equal(searchTheory('membrana',{subject:'chemistry'}).some(x=>x.topic==='cells'),false);
const verify=(input,expected)=>{
 const result=biologyVerifiedExercise(input);
 assert.equal(result?.verified,true,input);
 assert.equal(result.formula,expected,input);
};
verify('ADN:ATGC','TACG');
verify('ARN:ATGC','AUGC');
verify('GC%:GCGCAT','66.66666667%');
verify('Hardy-Weinberg:q2=0.09','p²=0.49; 2pq=0.42; q²=0.09');
verify('Aa x Aa','AA=25%; Aa=50%; aa=25%');
verify('AA x aa','AA=0%; Aa=100%; aa=0%');
verify('aa x aa','AA=0%; Aa=0%; aa=100%');
verify('Aa x aa','AA=0%; Aa=50%; aa=50%');
verify('Populație: N0=100; r=0.1; t=5','N=164.8721271');
assert.equal(biologyVerifiedExercise('ADN:ATTQ'),null,'invalid nucleotides are never silently fixed');
assert.equal(biologyVerifiedExercise('HW:q2=1.8'),null,'invalid allele frequency is not extrapolated');
assert.equal(biologyVerifiedExercise('Aa x Bb'),null,'two-locus model not silently treated as one locus');
assert.equal(biologyVerifiedExercise('Populație: N0=10; r=0.8; t=100'),null,'unsafe extrapolation rejected');
assert.equal(biologyVerifiedExercise('tratament pentru pacient'),null,'medical cases require review');
assert.equal(biologyVerifiedExercise('Aa x Aa','explain').body.includes('AA=25%'),false,'method mode hides solved result');
const html=await(await frontend.fetch(new Request('https://biology-regression.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
new vm.Script(script);
assert.match(script,/const BIOLOGY_TOPIC_DATA=/);
assert.match(script,/const BIOLOGY_SPECIALTY_DATA=/);
assert.match(script,/const BIOLOGY_SOLVE_VERIFIED=/);
assert.match(script,/function biologyCurriculumOpen\(\)/);
assert.match(script,/function scienceBiologyDiagramOpen\(\)/);
assert.match(script,/biologyCurriculumPreset=\{level:scienceJourney\.level,topic:scienceJourney\.topic,specialty:scienceJourney\.specialty\}/);
assert.match(script,/BIOLOGY_SOLVE_VERIFIED\(source,mode\)/);
assert.match(html,/biology-diagram-dialog/);
assert.match(script,/scienceJourney\.specialty/);
const start=script.indexOf('const SCIENCE_SUBJECTS=');
const end=script.indexOf('const MATH_LEVELS=[',start);
class FakeEl{
 constructor(tag){this.tag=tag;this.textContent='';this.children=[];this.style={};this.className='';this.onclick=null;}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=[...children]}
 setAttribute(){}
}
const cls=new Set(['active','learning-choose']);
const root={classList:{add:(...args)=>args.forEach(x=>cls.add(x)),remove:(...args)=>args.forEach(x=>cls.delete(x)),toggle:(x,on)=>on?cls.add(x):cls.delete(x),contains:x=>cls.has(x)}};
const host=new FakeEl('div'),title=new FakeEl('h2'),lead=new FakeEl('div');
const els={'view-module':root,moduleContent:host,moduleTitle:title,moduleLead:lead};
let workspaces=0;
const api=vm.runInNewContext('let activeLearningSubject=null;'+script.slice(start,end)+
 '\n({open:scienceJourneyShowChoices,back:scienceBack,state:scienceJourney})',{
 document:{createElement:tag=>new FakeEl(tag),querySelector:()=>null},
 window:{addEventListener:()=>{},visualViewport:null,innerHeight:900},
 requestAnimationFrame:()=>0,Math,
 CHEMISTRY_TOPIC_DATA:[...CHEMISTRY_TOPICS,...CHEMISTRY_SPECIALTY_TOPICS],
 CHEMISTRY_SPECIALTY_DATA:CHEMISTRY_SPECIALIZATIONS,
 BIOLOGY_TOPIC_DATA:[...BIOLOGY_TOPICS,...BIOLOGY_SPECIALTY_TOPICS],
 BIOLOGY_SPECIALTY_DATA:BIOLOGY_SPECIALIZATIONS,
 CHEMISTRY_LEVEL_DATA:CHEMISTRY_LEVELS,EDUCATION_THEORY_DATA:THEORY_ENTRIES,
 LEARNING_SUBJECTS:[['science','⚛️','Științe','Sciences']],
 learningLabel:(ro,en)=>ro,$:id=>els[id]||null,
 scienceOpenWorkspace:()=>{workspaces++},
 pocketNativeVoiceAvailable:()=>false,
 renderLearningSubjects:()=>{},scienceVoiceStop:()=>{},scienceStopRequest:()=>{}
});
const options=()=>host.children[1]?.children[2]?.children||[];
api.open('subjects');options()[2].onclick();
assert.equal(api.state.subject,'biology');
assert.equal(api.state.stage,'levels');
options()[2].onclick();
assert.equal(api.state.level,'advanced');
assert.equal(api.state.stage,'specialties');
assert.equal(options().length,9);
options()[1].onclick();
assert.equal(api.state.specialty,'molecular');
assert.equal(api.state.stage,'topics');
assert.equal(options().length,7,'4 specialist and 3 shared chapters');
const chapters=[...options().map(x=>x.children[0]?.textContent)];
assert.ok(chapters.some(x=>x.includes('Replicare')));
assert.ok(chapters.some(x=>x.includes('Genetică și ereditate')));
options()[0].onclick();
assert.equal(api.state.stage,'workspace');
assert.equal(workspaces,1);
api.back();assert.equal(api.state.stage,'topics');
api.back();assert.equal(api.state.stage,'specialties');
api.back();assert.equal(api.state.stage,'levels');
api.back();assert.equal(api.state.stage,'subjects');
api.open('subjects');options()[2].onclick();options()[0].onclick();
assert.equal(api.state.stage,'topics','beginner bypasses specialty chooser');
assert.ok(options().length>=6);
assert.ok(!options().some(x=>x.children[0]?.textContent?.includes('Replicare')));
console.log('PASS Biology: 9 tracks, 36 specialist chapters, 168 lessons, verified genetics, 2D/3D UI and staged Back navigation');
