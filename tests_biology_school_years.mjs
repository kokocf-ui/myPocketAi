// Offline curriculum-age regression: no other APIs, AI models or transport
// sources are called. The 50-country route remains clearly advisory outside
// the explicitly mapped education programmes.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {BIOLOGY_TOPICS} from './biology_curriculum.mjs';
import {BIOLOGY_PRIMARY_YEAR_TOPICS,BIOLOGY_PRIMARY_YEAR_ROWS,
 biologyPrimaryTopics,biologyPrimaryYearLessons} from './biology_primary_years.mjs';
import {BIOLOGY_LOWER_YEAR_TOPICS,BIOLOGY_LOWER_YEAR_ROWS,
 biologyLowerYearLessons} from './biology_lower_europe_years.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
assert.equal(BIOLOGY_PRIMARY_YEAR_ROWS.length,54,'Primary years need 54 original, age-specific lessons');
assert.equal(BIOLOGY_LOWER_YEAR_ROWS.length,30,'Advisory lower years need 30 original lessons');
assert.deepEqual(BIOLOGY_PRIMARY_YEAR_TOPICS['GB-ENG'].Y6,['anatomy','ecology','evolution']);
assert.deepEqual(BIOLOGY_PRIMARY_YEAR_TOPICS['GB-ENG'].Y1,['plants','anatomy','ecology']);
assert.deepEqual(BIOLOGY_PRIMARY_YEAR_TOPICS['GB-ENG'].Y4,['ecology','anatomy']);
assert.deepEqual(BIOLOGY_PRIMARY_YEAR_TOPICS.RO['1'],['plants','ecology']);
let primaryYears=0,lowerYears=0,schoolCards=0;
const unique=new Set();
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const [stage,schoolStage] of [['primary','beginner'],['lower','lower']]){
  const years=educationCountrySchoolYears(country,schoolStage).years;
  for(const year of years){
   const plan=scienceGradeTopicPlan({
    country,subject:'biology',stage,grade:year.id,years,topics:BIOLOGY_TOPICS
   });
   assert.ok(plan.topics.length>0,country+'/'+year.id+'/'+stage+' needs chapters');
   const ids=plan.topics.map(x=>x.id);
   if(stage==='primary')assert.deepEqual(ids,biologyPrimaryTopics({country,grade:year.id,years}));
   for(const topic of plan.topics){
    const cards=scienceSchoolTopicLessons({
     country,subject:'biology',stage,grade:year.id,topic:topic.id,
     years,lessons:THEORY_ENTRIES
    });
    if(stage==='primary'||country!=='RO')
     assert.equal(cards.length,stage==='primary'?3:2,country+'/'+year.id+'/'+topic.id+' has incorrect card count');
    else
     assert.ok(cards.length>0,'RO grade '+year.id+' lacks '+topic.id);
    for(const card of cards){
     assert.equal(String(card.grade||year.id),String(year.id));
     assert.equal(card.topic,topic.id);
     assert.ok(card.title&&card.statement&&((stage==='primary'||country!=='RO')?card.exercise:true),
      country+'/'+year.id+'/'+topic.id+' has a skeletal lesson');
     assert.ok(!unique.has(card.id+'@'+country+'-'+year.id),
      'Duplicated chapter-year lesson ID '+card.id);
     unique.add(card.id+'@'+country+'-'+year.id);
     if(stage==='primary'){
      assert.equal(card.diagramId,null,'Primary lab must not prescribe DNA/cell graphics');
      assert.ok(!/mitoză|meioză|ATP|ARNm|mutație genetică/i.test(card.title),
       'University-level material leaked into primary school: '+card.title);
     }
     schoolCards++;
    }
   }
   if(stage==='primary')primaryYears++;
   else lowerYears++;
  }
 }
}
assert.ok(primaryYears>=100&&lowerYears>=100,
 'Curriculum guard must exercise the European school-year picker');
const ro=[1,2,3,4].map(n=>({id:String(n)}));
assert.ok(ro.flatMap(y=>biologyPrimaryYearLessons({country:'RO',grade:y.id,
 topic:'plants',years:ro})).length>=12,'Each Romanian primary year needs three plant study cards');
const gb=[1,2,3,4,5,6].map(n=>({id:'Y'+n}));
assert.equal(biologyPrimaryYearLessons({country:'GB-ENG',grade:'Y1',
 topic:'evolution',years:gb}).length,0,'Evolution appears in Year 6, not Year 1');
assert.equal(biologyPrimaryYearLessons({country:'GB-ENG',grade:'Y6',
 topic:'evolution',years:gb}).length,3,'Year 6 evolution needs original lessons');
const de=[1,2,3,4].map(n=>({id:'L'+n}));
assert.equal(biologyLowerYearLessons({country:'DE',grade:'L1',
 topic:'genetics',years:de}).length,0,'Do not introduce Grade 3 genetics into first lower-secondary year');
assert.equal(biologyLowerYearLessons({country:'DE',grade:'L3',
 topic:'genetics',years:de}).length,2);
assert.deepEqual(BIOLOGY_LOWER_YEAR_TOPICS[0],['plants','ecology','cells']);
const titleSet=new Set(BIOLOGY_PRIMARY_YEAR_ROWS.map(r=>r[2]));
assert.equal(titleSet.size,BIOLOGY_PRIMARY_YEAR_ROWS.length,'Primary lesson titles must not duplicate');
for(const y of ['1','2','3','4']){
 const years=ro,plan=scienceGradeTopicPlan({country:'RO',subject:'biology',stage:'primary',
  grade:y,years,topics:BIOLOGY_TOPICS});
 assert.ok(plan.topics.find(x=>x.id==='plants')?.ro.includes('Botanică'));
 assert.ok(plan.topics.find(x=>x.id==='ecology')?.ro.includes('Zoologie')||y==='3'&&false);
}
for(const grade of ['5','6','7','8']){
 const years=['5','6','7','8'].map(id=>({id}));
 const plan=scienceGradeTopicPlan({country:'RO',subject:'biology',stage:'lower',
  grade,years,topics:BIOLOGY_TOPICS});
 assert.ok(plan.topics.length>=2);
 assert.ok(plan.topics.every(x=>x.ro&&x.en));
}
const html=await(await app.fetch(new Request('https://biology-age-scope-test.invalid/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Must serve Android WebView script');
new vm.Script(script);
for(const text of [
 'const BIOLOGY_PRIMARY_YEAR_ROWS=',
 'const biologyPrimaryYearLessons=',
 'const BIOLOGY_LOWER_YEAR_ROWS=',
 'const biologyLowerYearLessons=',
 "['physics','biology'].includes(subjectId)",
 "if(subject==='biology'&&['primary','lower','upper'].includes(scienceJourney.schoolStage))",
 'scienceJourney.biologyLabLesson',
 "if(scienceJourney.subject==='biology'&&['primary','lower','upper'].includes(scienceJourney.schoolStage))return true",
 "const entries=scienceSchoolTopicLessons({",
 "'No documented investigation exists for this chapter and school year.'",
 'chosen.country===educationCountrySelection.code',
 'Acest capitol nu are încă activități documentate pentru anul ales.',
 'Schemă pentru lecția selectată'
])assert.ok(script.includes(text),'Missing WebView Biology regression guard: '+text);
console.log('Biology year-specific age tests:',primaryYears,'primary years,',
 lowerYears,'lower years,',schoolCards,'clickable age-scoped cards');
