import assert from 'node:assert/strict';
import {MATH_UPPER_2026_COMPANION} from './math_depth_upper_companion_2026.mjs';
import {MATH_UNIVERSITY_2026_COMPANION} from './math_depth_university_companion_2026.mjs';
import {MATH_DEPTH_STAGES,mathInDepthEntries,mathInDepthMaterial}
 from './math_depth_courses.mjs';
const banks=[
 {stage:'intermediate',rows:MATH_UPPER_2026_COMPANION,each:10,minimum:35},
 {stage:'advanced',rows:MATH_UNIVERSITY_2026_COMPANION,each:8,minimum:35}
];
let authored=0;
for(const {stage,rows,each,minimum} of banks){
 assert.equal(rows.length,4,'Four advisory teaching phases needed for '+stage);
 const workedSolutions=new Set(),fullTitles=new Set();
 for(const [i,subjects] of rows.entries()){
  let count=0,yearTitles=new Set();
  for(const [topic,lessons] of Object.entries(subjects)){
   const live=mathInDepthEntries({stage,phase:i+1,topic});
   const all=MATH_DEPTH_STAGES[stage][i][topic];
   assert.ok(all.length>=lessons.length+2,'New lessons must extend, not replace, existing chapters');
   const titles=live.map(x=>x.title);
   assert.equal(new Set(titles).size,titles.length,
    'Duplicate lesson title within '+stage+' year '+(i+1)+' '+topic);
   for(const row of lessons){
    count++;
    assert.equal(row.length,7,'English title, Romanian title, definition, formula, worked example, practice, answer');
    const [en,ro,statement,formula,worked,practice,answer]=row;
    assert.ok(en.length>=12&&ro.length>=12&&statement.length>80&&formula.length>=5);
    assert.ok(worked.length>=75&&practice.length>=15&&answer.length>=1,
     'Incomplete original theoretical explanation or example: '+ro);
    assert.ok(!yearTitles.has(ro),'Duplicate title within year: '+ro);
    assert.ok(!fullTitles.has(ro),'Same title reused across year phases: '+ro);
    assert.ok(!workedSolutions.has(worked),'The exact same worked example must not be reused: '+ro);
    fullTitles.add(ro);yearTitles.add(ro);workedSolutions.add(worked);
    const lesson=live.find(x=>x.title===ro);
    assert.ok(lesson,'Lesson unreachable in actual app: '+ro);
    assert.equal(lesson.sourceStatus,'general-learning','Unverified national curriculum must remain advisory');
    assert.ok(lesson.enTitle.length>=10,'Original English title missing from client');
    const reader=mathInDepthMaterial(lesson);
    assert.ok(reader.includes(statement)&&reader.includes(formula)&&reader.includes(worked)&&reader.includes(practice)&&reader.includes(answer));
    assert.ok(reader.length>420,'Lesson is too short for a stand-alone independent study');
   }
  }
  assert.equal(count,each,stage+' '+(i+1)+' does not have the expected new chapters');
  const total=Object.values(MATH_DEPTH_STAGES[stage][i]).reduce((sum,rows)=>sum+rows.length,0);
  assert.ok(total>=minimum,stage+' '+(i+1)+' must expose at least '+minimum+' complete original lessons, found '+total);
  authored+=count;
 }
}
assert.equal(authored,72,'40 high-school and 32 university companion lessons');
console.log('PASS',authored,'additional complete Maths lessons: 35–42 high-school, 35 university, without claiming national curriculum completion.');
