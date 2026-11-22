import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {ASTRONOMY_TOPICS,ASTRONOMY_LESSONS} from './astronomy_curriculum.mjs';
import {ASTRONOMY_TOPIC_DIAGRAMS,ASTRONOMY_LAB_TOPIC,ASTRONOMY_LAB_YEAR_METHODS,
 astronomySchoolTopicLessons,astronomyLabMaterial} from './astronomy_study_course.mjs';
import {ASTRONOMY_PLANETS,ASTRONOMY_PLANET_REFERENCE} from './astronomy_planets.mjs';
import {educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {astronomyUniversityStudyText} from './astronomy_university_courses.mjs';

const ids=ASTRONOMY_TOPICS.map(t=>t.id);
for(const topic of ids){
 const diagrams=ASTRONOMY_TOPIC_DIAGRAMS[topic];
 assert.ok(diagrams?.length>=1&&diagrams.length<=2,'Topic visuals missing/duplicated: '+topic);
 assert.equal(new Set(diagrams).size,diagrams.length,'Same diagram twice in '+topic);
 assert.ok(ASTRONOMY_LAB_TOPIC[topic],'Topic lab missing: '+topic);
}
for(const [topic,wrong] of [
 ['sky',['solar','parallax']],['distances',['solar','galaxy']],
 ['special-instruments',['galaxy','solar']],['special-highenergy',['solar','parallax']],
 ['cosmology',['solar','hr']]
])for(const kind of wrong)assert.ok(!ASTRONOMY_TOPIC_DIAGRAMS[topic].includes(kind),
 'Unrelated diagram '+kind+' in '+topic);
assert.ok(Object.keys(ASTRONOMY_LAB_YEAR_METHODS).every(x=>ASTRONOMY_LAB_YEAR_METHODS[x].length===4));
const html=await(await app.fetch(new Request('https://astronomy-all-diagrams.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
const start=script.indexOf('function astronomyVisualKind(question,topic)');
const end=script.indexOf('function scienceShowResult(title,body)',start);
class El{
 constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.style={};this.className='';this.textContent='';}
 append(...xs){this.children.push(...xs)}
 setAttribute(k,v){this.attrs[k]=String(v)}
}
const ctx={ASTRONOMY_PLANETS,ASTRONOMY_PLANET_REFERENCE,ASTRONOMY_TOPIC_DIAGRAMS,
 document:{createElement:tag=>new El(tag),createElementNS:(ns,tag)=>new El(tag)},
 learningLabel:(ro,en)=>ro,
 educationTheoryClean:v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()
};
const api=vm.runInNewContext(script.slice(start,end)+';({draw:astronomyVisualBuild})',ctx);
const kinds=new Set(Object.values(ASTRONOMY_TOPIC_DIAGRAMS).flat());
assert.ok(kinds.size>=18,'Too few distinct relevant diagrams');
const fingerprints=new Set();
for(const kind of kinds){
 const section=api.draw(kind);
 assert.ok(section,'Missing '+kind);
 const svg=section.children.find(x=>x.tag==='svg');
 assert.ok(svg?.children.length>=3,'Diagram has no real content: '+kind);
 const key=JSON.stringify(svg.children.map(x=>[x.tag,x.attrs,x.textContent]));
 assert.ok(!fingerprints.has(key),'Unrelated diagram cloned under '+kind);
 fingerprints.add(key);
}
const roYears={
 primary:educationCountrySchoolYears('RO','beginner').years,
 lower:educationCountrySchoolYears('RO','lower').years,
 upper:educationCountrySchoolYears('RO','medium').years
};
let gradeLabs=0,gradeLessons=0;
for(const [stage,years] of Object.entries(roYears)){
 for(const year of years){
  const grade=year.id;
  const plan=scienceGradeTopicPlan({country:'RO',subject:'astronomy',stage,grade,years,topics:ASTRONOMY_TOPICS});
  assert.ok(plan.topics.length>=2,'Empty annual menu '+stage+'/'+grade);
  for(const topic of plan.topics){
   const lessons=astronomySchoolTopicLessons({country:'RO',stage,grade,topic:topic.id,years,lessons:ASTRONOMY_LESSONS});
   assert.ok(lessons.length,'Annual chapter has no lessons: '+stage+'/'+grade+'/'+topic.id);
   gradeLessons+=lessons.length;
   const lab=astronomyLabMaterial({stage,grade,topic:topic.id,years,language:'ro'});
   assert.ok(lab?.length>950,'Superficial or missing lab: '+stage+'/'+grade+'/'+topic.id);
   assert.ok(lab.includes('Metodă potrivită anului'));
   if(stage==='primary'){
    assert.ok(!/parsec|Kepler|redshift|paralaxa anuală|s⁻¹|kpc/.test(lab.toLowerCase()),
     'Complex equations leaked into primary lab '+grade+'/'+topic.id);
   }
   gradeLabs++;
  }
 }
}
const practices=[];
for(let year=1;year<=4;year++){
 const grade='univ-'+year;
 const body=astronomyLabMaterial({topic:'sky',stage:'advanced',grade,language:'ro',specialty:'instruments'});
 assert.ok(body.length>1000&&body.includes('Metodă potrivită anului'));
 practices.push(body);
}
assert.equal(new Set(practices).size,4,'University sky practical must differ by year');
const uni=astronomyUniversityStudyText({topic:'sky',specialty:'instruments',grade:'univ-1',
 language:'ro',lessons:ASTRONOMY_LESSONS,entryId:'astro-sky-3'});
assert.ok(uni.length>550&&uni.includes('Ascensie dreaptă'));
assert.equal(astronomyUniversityStudyText({topic:'sky',specialty:'instruments',grade:'univ-1',
 language:'ro',lessons:ASTRONOMY_LESSONS,entryId:'not-real'}),'');
console.log('PASS Astronomy visuals: '+kinds.size+' distinct diagrams, '+gradeLabs+
 ' topic/year practicals, '+gradeLessons+' linked school lessons and four university-year methods');
