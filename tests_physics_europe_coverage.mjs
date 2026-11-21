import assert from 'node:assert/strict';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {physicsCountryGradePlan,PHYSICS_EUROPE_REFERENCES,PHYSICS_EUROPE_REFERENCE} from './physics_europe_frameworks.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';

let annual=0,nativeYears=0,advisoryYears=0,noStandalone=0,integrated=0,emptyChapters=0;
const issues=[];
for(const code of EDUCATION_EUROPE_COUNTRIES){
 for(const [stage,matrixStage] of [['primary','beginner'],['lower','lower'],['upper','medium']]){
  const school=educationCountrySchoolYears(code,matrixStage);
  const years=school.years;
  assert.ok(years.length>=1,code+'/'+stage+' has no usable year selector');
  for(const year of years){
   const national=physicsCountryGradePlan({country:code,stage,grade:year.id,years});
   const course=scienceGradeTopicPlan({country:code,subject:'physics',stage,
    grade:year.id,years,topics:PHYSICS_TOPICS});
   const matrix=educationSubjectSchoolPlan({country:code,stage:matrixStage,grade:year.id,subject:'physics'});
   assert.deepEqual(matrix.units.map(x=>x.id),course.topics.map(x=>x.id),
    'Year selector, school matrix and Android Physics must agree: '+code+'/'+stage+'/'+year.id);
   assert.ok(national.source&&national.source.startsWith('https://'),
    'Every course has traceable framework or comparative source');
   assert.equal(national.verifiedAnnual,false,
    'Do not claim official year-by-year contents from general stage outcomes');
   if(PHYSICS_EUROPE_REFERENCES[code])nativeYears++;
   else{
    advisoryYears++;
    assert.equal(national.source,PHYSICS_EUROPE_REFERENCE,
     'Unknown Physics curriculum must use European comparative reference');
   }
   if(national.status==='not-offered'){
    assert.equal(course.topics.length,0,'Not-taught course must have zero fake chapters');
    noStandalone++;continue;
   }
   assert.ok(course.topics.length>0,code+'/'+stage+'/'+year.id+' must have study units');
   if(national.kind==='integrated'||national.kind==='mixed')integrated++;
   if(stage==='lower'){
    let lessons=0;
    for(const topic of course.topics){
     const real=scienceSchoolTopicLessons({country:code,subject:'physics',
      stage,grade:year.id,topic:topic.id,lessons:THEORY_ENTRIES,years});
     if(!real.length){emptyChapters++;issues.push(code+'/'+year.id+'/'+topic.id);}
     assert.equal(new Set(real.map(x=>x.id)).size,real.length,'Duplicate chapter ID');
     for(const item of real){
      assert.ok(item.title?.trim()&&item.statement?.length>=40,
       'Physics lesson missing real scientific content: '+code+'/'+year.id+'/'+item.id);
      assert.ok(item.source||item.level,
       'Advisory cards must declare their provenance');
     }
     lessons+=real.length;
    }
    assert.ok(lessons>=10,code+'/'+year.id+' Physics has too few original study lessons: '+lessons);
   }
   annual++;
  }
 }
}
assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
assert.ok(annual>=300,'Audit every European country and school-year route');
assert.equal(emptyChapters,0,'Listed chapter missing authored lessons: '+issues.slice(0,25).join(', '));
const html=await(await frontend.fetch(new Request('https://physics-all-europe.test/'))).text();
assert.ok(html.includes('const physicsCountryGradePlan='),
 'WebView must embed actual country/year rule');
assert.ok(html.includes('const physicsAdvisoryTopicLessons='),
 'WebView must embed real advisory lesson selection');
assert.ok(html.includes('const PHYSICS_EUROPE_REFERENCES='),
 'WebView must carry verifiable source classifications');
console.log('PASS Physics Europe: '+EDUCATION_EUROPE_COUNTRIES.length+
 ' systems; '+annual+' taught/integrated year paths, '+nativeYears+' sourced-framework years, '+
 advisoryYears+' explicitly advisory years, '+noStandalone+' not-offered and '+integrated+
 ' integrated/mixed learning routes');
